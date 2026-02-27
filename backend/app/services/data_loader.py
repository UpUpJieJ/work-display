"""
Data Loader Service
Loads data from JSON files
"""
import json
import os
from pathlib import Path
from typing import List, Dict, Any

# Base data directory
DATA_DIR = Path(__file__).parent.parent / "data"


def load_json_data(filename: str) -> List[Dict[str, Any]]:
    """
    Load data from a JSON file in the data directory

    Args:
        filename: Name of the JSON file

    Returns:
        List of dictionaries containing the data
    """
    file_path = DATA_DIR / filename

    if not file_path.exists():
        return []

    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data


async def load_projects() -> List[Dict[str, Any]]:
    """Load all projects from projects.json"""
    return load_json_data("projects.json").get("projects", [])


async def load_skills() -> List[Dict[str, Any]]:
    """Load all skills from skills.json"""
    return load_json_data("skills.json").get("skills", [])


async def load_profile() -> Dict[str, Any]:
    """Load profile data from profile.json"""
    return load_json_data("profile.json")


def get_project_by_slug(slug: str) -> Dict[str, Any] | None:
    """
    Get a single project by its slug

    Args:
        slug: Project slug

    Returns:
        Project data or None if not found
    """
    projects = load_json_data("projects.json").get("projects", [])

    for project in projects:
        if project.get("slug") == slug:
            return project

    return None
