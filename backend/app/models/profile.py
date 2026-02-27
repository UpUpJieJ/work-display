"""
Profile Data Models
"""
from pydantic import BaseModel, Field, HttpUrl
from typing import List, Optional


class SocialLink(BaseModel):
    """Social media link model"""
    platform: str = Field(..., description="Platform name (e.g., 'GitHub', 'LinkedIn')")
    url: str = Field(..., description="Profile URL")
    icon: str = Field(..., description="Icon class name")
    display_name: Optional[str] = Field(None, description="Custom display text")


class Experience(BaseModel):
    """Work experience model"""
    id: str
    title: str
    company: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    description: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)


class Education(BaseModel):
    """Education model"""
    id: str
    degree: str
    institution: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    highlights: List[str] = Field(default_factory=list)


class Profile(BaseModel):
    """Profile model"""
    name: str
    title: str = Field(..., description="Professional title")
    tagline: Optional[str] = Field(None, description="Short tagline")
    bio: str = Field(..., description="Professional biography")
    email: Optional[str] = Field(None, description="Contact email")
    phone: Optional[str] = Field(None, description="Contact phone")
    location: Optional[str] = Field(None, description="City, Country")
    avatar: Optional[str] = Field(None, description="Profile image path")
    resume_url: Optional[str] = Field(None, description="Resume download link")
    social_links: List[SocialLink] = Field(default_factory=list)
    experience: List[Experience] = Field(default_factory=list)
    education: List[Education] = Field(default_factory=list)


class ContactSubmission(BaseModel):
    """Contact form submission model"""
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., pattern=r"^[^@]+@[^@]+\.[^@]+$")
    subject: Optional[str] = Field(None, max_length=200)
    message: str = Field(..., min_length=1, max_length=5000)
