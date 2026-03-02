"""
MongoDB Collection Models
定义集合结构和索引
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


# ==================== PROJECTS ====================

class Project:
    """Project MongoDB collection schema with indexes"""
    collection_name = "projects"
    
    # Indexes for MongoDB
    indexes = [
        {"key": [("slug", 1)], "unique": True},
        {"key": [("category", 1)]},
        {"key": [("featured", 1)]},
    ]
    
    # Field definitions (as dict for reference)
    fields = {
        "id": str,
        "title": str,
        "slug": str,
        "short_description": str,
        "description": str,
        "category": str,
        "technologies": list,
        "links": list,
        "featured": bool,
        "status": str,
        "highlights": list,
        "updated_at": datetime,
    }


class ProjectLink(BaseModel):
    title: str
    url: str
    icon: Optional[str] = None


class ProjectModel(BaseModel):
    """Project Pydantic model for validation"""
    id: str
    title: str
    slug: str
    short_description: str
    description: str
    category: str
    technologies: List[str] = []
    links: List[ProjectLink] = []
    featured: bool = False
    status: str = "completed"
    highlights: List[str] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Alias for backwards compatibility
Project = ProjectModel


# ==================== SKILLS ====================

class Skill:
    """Skill MongoDB collection schema with indexes"""
    collection_name = "skills"
    
    # Indexes for MongoDB
    indexes = [
        {"key": [("name", 1)], "unique": True},
        {"key": [("category", 1)]},
        {"key": [("featured", 1)]},
    ]
    
    # Field definitions (as dict for reference)
    fields = {
        "name": str,
        "category": str,
        "proficiency": str,
        "years_experience": float,
        "icon": str,
        "featured": bool,
    }


class SkillModel(BaseModel):
    """Skill Pydantic model for validation"""
    name: str
    category: str  # languages, frameworks, databases, tools, cloud_platforms, concepts
    proficiency: str  # expert, advanced, intermediate, beginner, learning
    years_experience: Optional[float] = None
    icon: Optional[str] = None
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


# Alias for backwards compatibility
Skill = SkillModel


# ==================== PROFILE ====================

class SocialLink(BaseModel):
    platform: str
    url: str
    icon: str
    display_name: Optional[str] = None


class Experience(BaseModel):
    id: str
    title: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None
    technologies: List[str] = []


class Education(BaseModel):
    id: str
    degree: str
    institution: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    highlights: List[str] = []


class Profile:
    """Profile MongoDB collection schema with indexes"""
    collection_name = "profiles"
    
    # Indexes for MongoDB
    indexes = [
        # Single profile collection, no special indexes needed
    ]
    
    # Field definitions (as dict for reference)
    fields = {
        "name": str,
        "title": str,
        "tagline": str,
        "bio": str,
        "email": str,
        "phone": str,
        "location": str,
        "resume_url": str,
        "social_links": list,
        "experience": list,
        "education": list,
        "updated_at": datetime,
    }


class ProfileModel(BaseModel):
    """Profile Pydantic model for validation"""
    name: str
    title: str
    tagline: Optional[str] = None
    bio: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    resume_url: Optional[str] = None
    social_links: List[SocialLink] = []
    experience: List[Experience] = []
    education: List[Education] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# Alias for backwards compatibility
Profile = ProfileModel


# ==================== CONTACT ====================

class ContactSubmission:
    """Contact submission MongoDB collection schema with indexes"""
    collection_name = "contact_submissions"
    
    # Indexes for MongoDB
    indexes = [
        {"key": [("submitted_at", -1)]},
        {"key": [("read", 1)]},
    ]
    
    # Field definitions (as dict for reference)
    fields = {
        "id": str,
        "name": str,
        "email": str,
        "subject": str,
        "message": str,
        "submitted_at": datetime,
        "read": bool,
    }


class ContactSubmissionModel(BaseModel):
    """Contact submission Pydantic model for validation"""
    id: str
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False


# Alias for backwards compatibility
ContactSubmission = ContactSubmissionModel
