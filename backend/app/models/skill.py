"""
Skill Data Models
"""
from pydantic import BaseModel, Field
from enum import Enum
from typing import List, Optional


class SkillCategory(str, Enum):
    """Skill category enumeration"""
    LANGUAGES = "languages"
    FRAMEWORKS = "frameworks"
    DATABASES = "databases"
    TOOLS = "tools"
    CLOUD_PLATFORMS = "cloud_platforms"
    CONCEPTS = "concepts"


class ProficiencyLevel(str, Enum):
    """Proficiency level enumeration"""
    EXPERT = "expert"
    ADVANCED = "advanced"
    INTERMEDIATE = "intermediate"
    BEGINNER = "beginner"
    LEARNING = "learning"


class Skill(BaseModel):
    """Skill model"""
    name: str = Field(..., description="Skill name")
    category: SkillCategory
    proficiency: ProficiencyLevel
    years_experience: Optional[float] = Field(None, ge=0, description="Years of experience")
    icon: Optional[str] = Field(None, description="Icon class or URL")
    featured: bool = Field(default=False, description="Show in featured skills section")


class SkillGroup(BaseModel):
    """Skill group for display"""
    category: SkillCategory
    category_name: str = Field(..., description="Display name for category")
    skills: List[Skill]
