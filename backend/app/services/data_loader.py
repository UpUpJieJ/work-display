"""
Data Loader Service - MongoDB version
"""
from typing import List, Dict, Any, Optional
from app.database import get_db


async def load_projects(
    category: Optional[str] = None,
    featured: Optional[bool] = None
) -> List[Dict[str, Any]]:
    """Load projects from MongoDB"""
    db = get_db()

    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured

    cursor = db.projects.find(query)
    projects = await cursor.to_list(length=None)

    # Remove MongoDB _id from results
    for proj in projects:
        if "_id" in proj:
            del proj["_id"]

    return projects


async def load_skills(
    category: Optional[str] = None,
    featured: Optional[bool] = None
) -> List[Dict[str, Any]]:
    """Load skills from MongoDB"""
    db = get_db()

    query = {}
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured

    cursor = db.skills.find(query)
    skills = await cursor.to_list(length=None)

    # Remove MongoDB _id from results
    for skill in skills:
        if "_id" in skill:
            del skill["_id"]

    return skills


async def load_profile() -> Dict[str, Any]:
    """Load profile from MongoDB"""
    db = get_db()

    profile = await db.profiles.find_one({})
    if not profile:
        # Return default profile when database is empty
        return {
            "name": "Your Name",
            "title": "Your Title",
            "tagline": "Your Tagline",
            "bio": "Your bio goes here...",
            "email": "",
            "phone": "",
            "location": "",
            "avatar": None,
            "resume_url": None,
            "social_links": [],
            "experience": [],
            "education": []
        }

    # Remove MongoDB _id from result
    if "_id" in profile:
        del profile["_id"]

    return profile


def get_project_by_slug(slug: str) -> Optional[Dict[str, Any]]:
    """Synchronous wrapper for get_project_by_slug_async"""
    import asyncio
    return asyncio.run(get_project_by_slug_async(slug))


async def get_project_by_slug_async(slug: str) -> Optional[Dict[str, Any]]:
    """Get a single project by slug"""
    db = get_db()

    project = await db.projects.find_one({"slug": slug})
    if not project:
        return None

    # Remove MongoDB _id from result
    if "_id" in project:
        del project["_id"]

    return project


async def load_skills_grouped() -> List[Dict[str, Any]]:
    """Load skills grouped by category"""
    db = get_db()

    pipeline = [
        {"$group": {
            "_id": "$category",
            "skills": {"$push": "$$ROOT"}
        }}
    ]

    cursor = db.skills.aggregate(pipeline)
    results = await cursor.to_list(length=None)

    category_names = {
        "languages": "编程语言",
        "frameworks": "框架",
        "databases": "数据库",
        "tools": "工具",
        "cloud_platforms": "云平台",
        "concepts": "概念"
    }

    grouped = []
    for result in results:
        category = result["_id"]
        skills = result["skills"]
        # Remove _id from each skill
        for skill in skills:
            if "_id" in skill:
                del skill["_id"]

        grouped.append({
            "category": category,
            "category_name": category_names.get(category, category),
            "skills": skills
        })

    return grouped
