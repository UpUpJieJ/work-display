"""
Migrate data from JSON files to MongoDB
"""
import sys
import json
import os
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime

# MongoDB connection - use environment variables or defaults
MONGODB_URL = os.environ.get("MONGODB_URL", "mongodb://111.231.68.34:27017")
DB_NAME = os.environ.get("MONGODB_DATABASE", "portfolio")


def migrate_projects(db):
    """Migrate projects from JSON to MongoDB"""
    print("Migrating projects...")
    projects_file = Path(__file__).parent.parent / "app" / "data" / "projects.json"

    with open(projects_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    projects = data.get("projects", [])

    for proj in projects:
        proj["created_at"] = datetime.utcnow()
        proj["updated_at"] = datetime.utcnow()

    if projects:
        db.projects.insert_many(projects)
        print(f"Migrated {len(projects)} projects")


def migrate_skills(db):
    """Migrate skills from JSON to MongoDB"""
    print("Migrating skills...")
    skills_file = Path(__file__).parent.parent / "app" / "data" / "skills.json"

    with open(skills_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    skills = data.get("skills", [])

    for skill in skills:
        skill["created_at"] = datetime.utcnow()

    if skills:
        db.skills.insert_many(skills)
        print(f"Migrated {len(skills)} skills")


def migrate_profile(db):
    """Migrate profile from JSON to MongoDB"""
    print("Migrating profile...")
    profile_file = Path(__file__).parent.parent / "app" / "data" / "profile.json"

    with open(profile_file, "r", encoding="utf-8") as f:
        profile = json.load(f)

    profile["updated_at"] = datetime.utcnow()

    db.profiles.insert_one(profile)
    print("Migrated profile")


def migrate_contact_submissions(db):
    """Migrate contact submissions if exists"""
    print("Migrating contact submissions...")
    contact_file = Path(__file__).parent.parent / "app" / "data" / "contact_submissions.json"

    if not contact_file.exists():
        print("No contact submissions to migrate")
        return

    with open(contact_file, "r", encoding="utf-8") as f:
        data = json.load(f)

    submissions = data.get("submissions", [])

    # Convert string timestamps to datetime
    for sub in submissions:
        if "submitted_at" in sub and isinstance(sub["submitted_at"], str):
            sub["submitted_at"] = datetime.fromisoformat(sub["submitted_at"])
        if "read" not in sub:
            sub["read"] = False

    if submissions:
        db.contact_submissions.insert_many(submissions)
        print(f"Migrated {len(submissions)} contact submissions")


def create_indexes(db):
    """Create indexes for better query performance"""
    print("Creating indexes...")

    # Projects indexes
    db.projects.create_index("slug", unique=True)
    db.projects.create_index("category")
    db.projects.create_index("featured")

    # Skills indexes
    db.skills.create_index("name", unique=True)
    db.skills.create_index("category")
    db.skills.create_index("featured")

    # Contact submissions indexes
    db.contact_submissions.create_index("submitted_at")

    print("Indexes created")


def main():
    """Main migration function"""
    print("Starting migration to MongoDB...")

    # Connect to MongoDB
    client = MongoClient(MONGODB_URL)
    db = client[DB_NAME]

    try:
        # Check if data already exists
        if db.projects.count_documents({}) > 0:
            response = input("Database already contains data. Continue anyway? (y/n): ")
            if response.lower() != "y":
                print("Migration cancelled.")
                return

        # Run migrations
        migrate_projects(db)
        migrate_skills(db)
        migrate_profile(db)
        migrate_contact_submissions(db)

        # Create indexes
        create_indexes(db)

        print("\n=== Migration completed successfully! ===")
        print(f"Database: {DB_NAME}")
        print(f"Collections: projects, skills, profiles, contact_submissions")

    except Exception as e:
        print(f"\nMigration failed: {e}")
        raise
    finally:
        client.close()


if __name__ == "__main__":
    main()
