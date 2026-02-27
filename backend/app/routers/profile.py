"""
Profile API Router
"""
from fastapi import APIRouter
from app.models.profile import Profile
from app.services.data_loader import load_profile

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
