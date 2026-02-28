"""
MongoDB Collection Models
定义集合结构和索引
"""
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


# ==================== PROJECTS ====================

class ProjectLink(BaseModel):
    title: str
    url: str
    icon: Optional[str] = None


class Project(BaseModel):
    id: str
    title: str
    slug: str
    short_description: str
    description: str
    category: str
    technologies: List[str] = []
    links: List[ProjectLink] = []
    featured: bool = False
    image: Optional[str] = None
    status: str = "completed"
    highlights: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ==================== SKILLS ====================

class Skill(BaseModel):
    name: str
    category: str  # languages, frameworks, databases, tools, cloud_platforms, concepts
    proficiency: str  # expert, advanced, intermediate, beginner, learning
    years_experience: Optional[float] = None
    icon: Optional[str] = None
    featured: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)


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


class Profile(BaseModel):
    name: str
    title: str
    tagline: Optional[str] = None
    bio: str
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    avatar: Optional[str] = None
    resume_url: Optional[str] = None
    social_links: List[SocialLink] = []
    experience: List[Experience] = []
    education: List[Education] = []
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# ==================== CONTACT ====================

class ContactSubmission(BaseModel):
    id: str
    name: str
    email: str
    subject: Optional[str] = None
    message: str
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    read: bool = False
