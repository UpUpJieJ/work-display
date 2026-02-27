"""
Skills API Router
"""
from fastapi import APIRouter
from typing import List, Optional
from app.models.skill import Skill, SkillCategory
from app.services.data_loader import load_skills

router = APIRouter()


@router.get("", response_model=List[Skill])
async def get_skills_list(
    category: Optional[SkillCategory] = None,
    featured: Optional[bool] = None
):
    """
    Get skills list with optional filtering

    Args:
        category: Filter by skill category
        featured: Filter by featured status

    Returns:
        List of skills
    """
    skills = await load_skills()

    # Filter by category
    if category:
        skills = [s for s in skills if s.get("category") == category.value]

    # Filter by featured status
    if featured is not None:
        skills = [s for s in skills if s.get("featured") == featured]

    return skills


@router.get("/grouped")
async def get_skills_grouped():
    """
    Get skills grouped by category

    Returns:
        List of skill groups
    """
    skills = await load_skills()

    # Group skills by category
    grouped = {}
    for skill in skills:
        category = skill.get("category")
        if category not in grouped:
            grouped[category] = []
        grouped[category].append(skill)

    # Format response
    category_names = {
        "languages": "编程语言",
        "frameworks": "框架",
        "databases": "数据库",
        "tools": "工具",
        "cloud_platforms": "云平台",
        "concepts": "概念"
    }

    result = []
    for category, skills_list in grouped.items():
        result.append({
            "category": category,
            "category_name": category_names.get(category, category),
            "skills": skills_list
        })

    return result


@router.get("/categories")
async def get_skill_categories():
    """
    Get all skill categories

    Returns:
        List of skill categories
    """
    categories = [
        {"id": "languages", "name": "编程语言", "icon": "Code"},
        {"id": "frameworks", "name": "框架", "icon": "Layers"},
        {"id": "databases", "name": "数据库", "icon": "Database"},
        {"id": "tools", "name": "工具", "icon": "Tool"},
        {"id": "cloud_platforms", "name": "云平台", "icon": "Cloud"},
        {"id": "concepts", "name": "概念", "icon": "Lightbulb"},
    ]
    return categories
