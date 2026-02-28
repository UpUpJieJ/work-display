"""
Contact API Router
"""
from fastapi import APIRouter, HTTPException, status
from app.models.profile import ContactSubmission
from app.services.data_writer import save_contact_submission
from datetime import datetime
from uuid import uuid4

router = APIRouter()


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
        submission_data["submitted_at"] = datetime.now().isoformat()
        submission_data["id"] = str(uuid4())

        # Save to JSON file
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
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred: {str(e)}"
        )
