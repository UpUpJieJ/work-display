"""
MongoDB connection and client management
"""
from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

# MongoDB client
client: AsyncIOMotorClient = None

# Database
db = None


async def connect_to_mongo():
    """Connect to MongoDB"""
    global client, db
    client = AsyncIOMotorClient(settings.mongodb_url)
    db = client[settings.mongodb_database]
    print(f"Connected to MongoDB: {settings.mongodb_database}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()


def get_db():
    """Get database instance"""
    return db


async def ping_mongo() -> bool:
    """Check MongoDB connectivity"""
    if client is None:
        return False
    try:
        await client.admin.command("ping")
        return True
    except Exception:
        return False
