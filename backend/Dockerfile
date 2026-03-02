# Portfolio Backend API - Production Dockerfile
# Build from project root: docker build -t portfolio-backend -f backend/Dockerfile .
#   Or from backend/:   docker build -t portfolio-backend .
# Run: docker run -d -p 8000:8000 --env-file .env portfolio-backend

# =============================================================================
# Stage 1: Builder - Install dependencies using uv
# =============================================================================
FROM python:3.11.6-slim-bookworm AS builder

WORKDIR /app

# Install uv (fast Python package manager)
RUN pip install --no-cache-dir uv

# Copy dependency files first for better layer caching
COPY pyproject.toml uv.lock ./

# Sync dependencies using uv (without dev dependencies)
RUN uv sync --frozen --no-dev

# =============================================================================
# Stage 2: Production - Final runtime image
# =============================================================================
FROM python:3.11.6-slim-bookworm AS production

WORKDIR /app

# Install minimal runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder
COPY --from=builder /app/.venv /app/.venv
ENV PATH="/app/.venv/bin:$PATH"

# Copy application code
COPY app ./app
COPY run.py ./run.py

# Non-root user for security
RUN groupadd --gid 1000 appgroup && \
    useradd --uid 1000 --gid appgroup --shell /bin/bash --create-home appuser && \
    chown -R appuser:appgroup /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Start uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
