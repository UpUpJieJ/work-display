"""
Data Writer Service - MongoDB version
"""
from typing import List, Dict, Any
from datetime import datetime
from app.database import get_db


async def save_projects(projects: List[Dict[str, Any]]) -> bool:
    """Save projects to MongoDB"""
    db = get_db()

    for proj in projects:
        proj["updated_at"] = datetime.utcnow()

    if projects:
        await db.projects.insert_many(projects)

    return True


async def save_skills(skills: List[Dict[str, Any]]) -> bool:
    """Save skills to MongoDB"""
    db = get_db()

    if skills:
        await db.skills.insert_many(skills)

    return True


async def save_profile(profile: Dict[str, Any]) -> bool:
    """Save profile to MongoDB"""
    db = get_db()

    profile["updated_at"] = datetime.utcnow()
    await db.profiles.replace_one({}, profile, upsert=True)

    return True


async def insert_project(project: Dict[str, Any]) -> bool:
    db = get_db()
    project["updated_at"] = datetime.utcnow()
    await db.projects.insert_one(project)
    return True


async def update_project(project_id: str, project: Dict[str, Any]) -> bool:
    db = get_db()
    project["updated_at"] = datetime.utcnow()
    result = await db.projects.update_one({"id": project_id}, {"$set": project})
    return result.matched_count > 0


async def delete_project(project_id: str) -> bool:
    db = get_db()
    result = await db.projects.delete_one({"id": project_id})
    return result.deleted_count > 0


async def insert_skill(skill: Dict[str, Any]) -> bool:
    db = get_db()
    await db.skills.insert_one(skill)
    return True


async def update_skill(skill_name: str, skill: Dict[str, Any]) -> bool:
    db = get_db()
    result = await db.skills.update_one({"name": skill_name}, {"$set": skill})
    return result.matched_count > 0


async def delete_skill(skill_name: str) -> bool:
    db = get_db()
    result = await db.skills.delete_one({"name": skill_name})
    return result.deleted_count > 0


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
