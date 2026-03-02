"""
Skills API Router
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from app.models.skill import Skill, SkillCategory
from app.services.data_loader import load_skills
from app.services.data_writer import (
    insert_skill,
    update_skill,
    delete_skill,
    list_backups,
    restore_backup,
)
from app.dependencies.auth import get_current_user

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


# ===== Admin CRUD Endpoints =====

@router.post("", response_model=Skill, status_code=status.HTTP_201_CREATED)
async def create_skill(
    skill: Skill,
    _current_user: str = Depends(get_current_user)
):
    """
    Create a new skill (requires authentication)

    Args:
        skill: Skill data
        _current_user: Authenticated user (injected)

    Returns:
        Created skill

    Raises:
        HTTPException: If skill name already exists
    """
    skills = await load_skills()

    # Check if name already exists
    if any(s.get("name") == skill.name for s in skills):
        raise HTTPException(status_code=400, detail="Skill name already exists")

    await insert_skill(skill.model_dump())

    return skill


@router.put("/{skill_name}", response_model=Skill)
async def update_skill(
    skill_name: str,
    skill: Skill,
    _current_user: str = Depends(get_current_user)
):
    """
    Update an existing skill by name (requires authentication)

    Args:
        skill_name: Skill name (URL encoded)
        skill: Updated skill data
        _current_user: Authenticated user (injected)

    Returns:
        Updated skill

    Raises:
        HTTPException: If skill not found
    """
    updated = await update_skill(skill_name, skill.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Skill not found")
    return skill


@router.delete("/{skill_name}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_skill(
    skill_name: str,
    _current_user: str = Depends(get_current_user)
):
    """
    Delete a skill by name (requires authentication)

    Args:
        skill_name: Skill name (URL encoded)
        _current_user: Authenticated user (injected)

    Raises:
        HTTPException: If skill not found
    """
    deleted = await delete_skill(skill_name)
    if not deleted:
        raise HTTPException(status_code=404, detail="Skill not found")
    return None


@router.get("/admin/backups", response_model=List[dict])
async def get_skill_backups(
    _current_user: str = Depends(get_current_user)
):
    """
    Get list of skill backups (requires authentication)

    Args:
        _current_user: Authenticated user (injected)

    Returns:
        List of backup files
    """
    return list_backups("skills.json")


@router.post("/admin/restore")
async def restore_skill_backup(
    backup_path: str,
    _current_user: str = Depends(get_current_user)
):
    """
    Restore a skill backup (requires authentication)

    Args:
        backup_path: Path to backup file
        _current_user: Authenticated user (injected)

    Returns:
        Success message

    Raises:
        HTTPException: If restore fails
    """
    if restore_backup("skills.json", backup_path):
        return {"message": "Backup restored successfully"}
    raise HTTPException(status_code=500, detail="Failed to restore backup")
