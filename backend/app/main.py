"""
FastAPI Backend Application for Portfolio Website
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import projects, skills, profile, contact

# Create FastAPI application
app = FastAPI(
    title="Portfolio API",
    description="Python Developer Portfolio API",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(skills.router, prefix="/api/skills", tags=["skills"])
app.include_router(profile.router, prefix="/api/profile", tags=["profile"])
app.include_router(contact.router, prefix="/api/contact", tags=["contact"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Portfolio API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
