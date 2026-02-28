"""
Data Writer Service - MongoDB version
"""
from typing import List, Dict, Any
from datetime import datetime
from app.database import get_db


async def save_projects(projects: List[Dict[str, Any]]) -> bool:
    """Save projects to MongoDB"""
    db = get_db()

    # Delete all existing projects (simple approach)
    await db.projects.delete_many({})

    # Insert all projects with updated timestamp
    for proj in projects:
        proj["updated_at"] = datetime.utcnow()

    if projects:
        await db.projects.insert_many(projects)

    return True


async def save_skills(skills: List[Dict[str, Any]]) -> bool:
    """Save skills to MongoDB"""
    db = get_db()

    await db.skills.delete_many({})

    if skills:
        await db.skills.insert_many(skills)

    return True


async def save_profile(profile: Dict[str, Any]) -> bool:
    """Save profile to MongoDB"""
    db = get_db()

    # Delete existing profile
    await db.profiles.delete_many({})

    # Insert new profile with updated timestamp
    profile["updated_at"] = datetime.utcnow()
    await db.profiles.insert_one(profile)

    return True


async def save_contact_submission(submission: Dict[str, Any]) -> bool:
    """Save contact form submission to MongoDB"""
    db = get_db()

    await db.contact_submissions.insert_one(submission)

    return True


# Backup-related functions (kept for compatibility with admin routes)
# TODO: Implement MongoDB backup functionality using mongodump

def list_backups(filename: str) -> List[Dict[str, Any]]:
    """
    List available backups (placeholder for MongoDB)

    For MongoDB, backups are typically created using mongodump.
    This function returns an empty list for now.
    """
    return []


def restore_backup(filename: str, backup_path: str) -> bool:
    """
    Restore from backup (placeholder for MongoDB)

    For MongoDB, restores are typically done using mongorestore.
    This function returns False for now.
    """
    return False
