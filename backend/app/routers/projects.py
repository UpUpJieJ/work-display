"""
Projects API Router
"""
from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.models.project import Project, ProjectCategory
from app.services.data_loader import load_projects, get_project_by_slug

router = APIRouter()


@router.get("", response_model=List[Project])
async def get_projects_list(
    category: Optional[ProjectCategory] = None,
    featured: Optional[bool] = None
):
    """
    Get projects list with optional filtering

    Args:
        category: Filter by project category
        featured: Filter by featured status

    Returns:
        List of projects
    """
    projects = await load_projects()

    # Filter by category
    if category:
        projects = [p for p in projects if p.get("category") == category.value]

    # Filter by featured status
    if featured is not None:
        projects = [p for p in projects if p.get("featured") == featured]

    return projects


@router.get("/categories", response_model=List[dict])
async def get_project_categories():
    """
    Get all project categories with display info

    Returns:
        List of category definitions
    """
    categories = [
        {"id": "all", "name": "全部项目", "icon": "FolderKanban"},
        {"id": "web_development", "name": "Web 开发", "icon": "Globe"},
        {"id": "web_scraping", "name": "网络爬虫", "icon": "Download"},
        {"id": "data_analysis", "name": "数据分析", "icon": "BarChart3"},
        {"id": "automation", "name": "自动化", "icon": "Zap"},
        {"id": "machine_learning", "name": "机器学习", "icon": "Brain"},
        {"id": "api_development", "name": "API 开发", "icon": "Server"},
    ]
    return categories


@router.get("/{slug}", response_model=Project)
async def get_project_by_slug_endpoint(slug: str):
    """
    Get a single project by slug

    Args:
        slug: Project slug

    Returns:
        Project data

    Raises:
        HTTPException: If project not found
    """
    project = get_project_by_slug(slug)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project
