# Portfolio Backend API - Production Dockerfile
# Build from project root: docker build -t portfolio-backend -f backend/Dockerfile .
#   Or from backend/:   docker build -t portfolio-backend .
# Run: docker run -d -p 8000:8000 --env-file .env portfolio-backend

FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY app ./app
COPY run.py ./run.py

# Non-root user
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" || exit 1

# Start uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
