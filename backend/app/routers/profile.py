"""
Profile API Router
"""
from fastapi import APIRouter, Depends, HTTPException
from app.models.profile import Profile
from app.services.data_loader import load_profile
from app.services.data_writer import save_profile, list_backups, restore_backup
from app.dependencies.auth import get_current_user

router = APIRouter()


@router.get("", response_model=Profile)
async def get_profile():
    """
    Get profile information

    Returns:
        Profile data
    """
    profile = await load_profile()
    return profile


@router.put("", response_model=Profile)
async def update_profile(
    profile: Profile,
    _current_user: str = Depends(get_current_user)
):
    """
    Update profile information (requires authentication)

    Args:
        profile: Updated profile data
        _current_user: Authenticated user (injected)

    Returns:
        Updated profile
    """
    await save_profile(profile.model_dump())
    return profile


@router.get("/admin/backups", response_model=list)
async def get_profile_backups(
    _current_user: str = Depends(get_current_user)
):
    """
    Get list of profile backups (requires authentication)

    Args:
        _current_user: Authenticated user (injected)

    Returns:
        List of backup files
    """
    return list_backups("profile.json")


@router.post("/admin/restore")
async def restore_profile_backup(
    backup_path: str,
    _current_user: str = Depends(get_current_user)
):
    """
    Restore a profile backup (requires authentication)

    Args:
        backup_path: Path to backup file
        _current_user: Authenticated user (injected)

    Returns:
        Success message

    Raises:
        HTTPException: If restore fails
    """
    if restore_backup("profile.json", backup_path):
        return {"message": "Backup restored successfully"}
    from fastapi import HTTPException
    raise HTTPException(status_code=500, detail="Failed to restore backup")
