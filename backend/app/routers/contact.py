"""
Contact API Router
"""
from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
import logging
from app.models.profile import ContactSubmission
from app.services.data_writer import save_contact_submission
from app.dependencies.auth import get_current_user
from app.database import get_db
from datetime import datetime
from uuid import uuid4

router = APIRouter()
logger = logging.getLogger(__name__)


@router.post("", status_code=status.HTTP_201_CREATED)
async def submit_contact(submission: ContactSubmission):
    """
    Submit contact form

    Args:
        submission: Contact form data

    Returns:
        Success message with submission ID

    Raises:
        HTTPException: If save fails
    """
    try:
        # Add metadata
        submission_data = submission.model_dump()
        submission_data["submitted_at"] = datetime.utcnow().isoformat()
        submission_data["id"] = str(uuid4())

        # Save to MongoDB
        success = await save_contact_submission(submission_data)

        if not success:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Failed to save contact submission"
            )

        return {
            "message": "Contact form submitted successfully",
            "data": {
                "id": submission_data["id"],
                "name": submission.name,
                "email": submission.email,
                "submitted_at": submission_data["submitted_at"]
            }
        }
    except HTTPException:
        raise
    except Exception:
        logger.exception("Failed to submit contact form")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )


@router.get("", response_model=List[dict])
async def get_contact_submissions(
    _current_user: str = Depends(get_current_user)
):
    """
    Get all contact form submissions (requires authentication)

    Args:
        _current_user: Authenticated user (injected)

    Returns:
        List of contact submissions
    """
    try:
        db = get_db()
        # Get all submissions, sorted by submitted_at descending
        submissions = await db.contact_submissions.find().sort("submitted_at", -1).to_list(100)
        
        # Convert ObjectId to string
        for submission in submissions:
            if "_id" in submission:
                submission["_id"] = str(submission["_id"])
        
        return submissions
    except Exception:
        logger.exception("Failed to fetch contact submissions")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Internal server error"
        )
