"""
Projects API Router
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from pydantic import ValidationError
from app.models.project import Project, ProjectCategory
from app.services.data_loader import load_projects, get_project_by_slug_async
from app.services.data_writer import (
    insert_project,
    update_project as update_project_in_storage,
    delete_project as delete_project_in_storage,
    list_backups,
    restore_backup,
)
from app.dependencies.auth import get_current_user
from uuid import uuid4

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
    project = await get_project_by_slug_async(slug)

    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    return project


# ===== Admin CRUD Endpoints =====

@router.post("", response_model=Project, status_code=status.HTTP_201_CREATED)
async def create_project(
    project: Project,
    _current_user: str = Depends(get_current_user)
):
    """
    Create a new project (requires authentication)

    Args:
        project: Project data
        _current_user: Authenticated user (injected)

    Returns:
        Created project

    Raises:
        HTTPException: If slug already exists
    """
    projects = await load_projects()

    # Check if slug already exists
    if any(p.get("slug") == project.slug for p in projects):
        raise HTTPException(status_code=400, detail="Slug already exists")

    # Auto-generate id if not provided
    if not project.id:
        project.id = str(uuid4())

    await insert_project(project.model_dump())

    return project


@router.put("/{project_id}", response_model=Project)
async def update_project(
    project_id: str,
    project: Project | dict,
    _current_user: str = Depends(get_current_user)
):
    """
    Update an existing project (requires authentication)

    Args:
        project_id: Project ID
        project: Updated project data
        _current_user: Authenticated user (injected)

    Returns:
        Updated project

    Raises:
        HTTPException: If project not found
    """
    if isinstance(project, dict):
        try:
            project_model = Project.model_validate({**project, "id": project_id})
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail=exc.errors())
    else:
        project_model = project.model_copy(update={"id": project_id})
    updated = await update_project_in_storage(project_id, project_model.model_dump())
    if not updated:
        raise HTTPException(status_code=404, detail="Project not found")
    return project_model


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: str,
    _current_user: str = Depends(get_current_user)
):
    """
    Delete a project (requires authentication)

    Args:
        project_id: Project ID
        _current_user: Authenticated user (injected)

    Raises:
        HTTPException: If project not found
    """
    deleted = await delete_project_in_storage(project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
    return None


@router.get("/admin/backups", response_model=List[dict])
async def get_project_backups(
    _current_user: str = Depends(get_current_user)
):
    """
    Get list of project backups (requires authentication)

    Args:
        _current_user: Authenticated user (injected)

    Returns:
        List of backup files
    """
    return list_backups("projects.json")


@router.post("/admin/restore")
async def restore_project_backup(
    backup_path: str,
    _current_user: str = Depends(get_current_user)
):
    """
    Restore a project backup (requires authentication)

    Args:
        backup_path: Path to backup file
        _current_user: Authenticated user (injected)

    Returns:
        Success message

    Raises:
        HTTPException: If restore fails
    """
    if restore_backup("projects.json", backup_path):
        return {"message": "Backup restored successfully"}
    raise HTTPException(status_code=500, detail="Failed to restore backup")
