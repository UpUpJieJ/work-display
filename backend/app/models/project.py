"""
Project Data Models
"""
from pydantic import BaseModel, Field, HttpUrl
from enum import Enum
from typing import List, Optional


class ProjectCategory(str, Enum):
    """Project category enumeration"""
    WEB_DEVELOPMENT = "web_development"
    WEB_SCRAPING = "web_scraping"
    DATA_ANALYSIS = "data_analysis"
    AUTOMATION = "automation"
    MACHINE_LEARNING = "machine_learning"
    API_DEVELOPMENT = "api_development"


class ProjectLink(BaseModel):
    """Project link model"""
    title: str = Field(..., description="Link title (e.g., 'GitHub', 'Live Demo')")
    url: str = Field(..., description="URL of the link")
    icon: Optional[str] = Field(None, description="Icon name")


class Technology(BaseModel):
    """Technology/tag model"""
    name: str = Field(..., description="Technology name")
    category: str = Field(..., description="Technology category")


class Project(BaseModel):
    """Project model"""
    id: str = Field(..., description="Unique project identifier")
    title: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., description="URL-friendly identifier")
    short_description: str = Field(..., max_length=200)
    description: str = Field(..., description="Full project description (Markdown supported)")
    category: ProjectCategory
    technologies: List[str] = Field(default_factory=list)
    links: List[ProjectLink] = Field(default_factory=list)
    featured: bool = Field(default=False, description="Show on homepage")
    image: Optional[str] = Field(None, description="Project screenshot path")
    status: str = Field(default="completed", description="completed, in_progress, planned")
    highlights: List[str] = Field(default_factory=list, description="Key features/achievements")

    class Config:
        json_schema_extra = {
            "example": {
                "id": "web-dev-001",
                "title": "E-commerce Platform",
                "slug": "ecommerce-platform",
                "short_description": "Full-stack e-commerce solution with payment integration",
                "description": "Full description...",
                "category": "web_development",
                "technologies": ["FastAPI", "React", "PostgreSQL", "Stripe"],
                "links": [
                    {"title": "GitHub", "url": "https://github.com/user/ecommerce", "icon": "github"}
                ],
                "featured": True,
                "status": "completed"
            }
        }
