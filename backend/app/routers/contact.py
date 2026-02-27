"""
Contact API Router
"""
from fastapi import APIRouter
from app.models.profile import ContactSubmission

router = APIRouter()


@router.post("")
async def submit_contact(submission: ContactSubmission):
    """
    Submit contact form

    Args:
        submission: Contact form data

    Returns:
        Success message
    """
    # In a real application, you would:
    # 1. Validate the submission
    # 2. Send an email
    # 3. Store in database
    # 4. Return success response

    # For now, just return success
    return {
        "message": "Contact form submitted successfully",
        "data": {
            "name": submission.name,
            "email": submission.email
        }
    }
