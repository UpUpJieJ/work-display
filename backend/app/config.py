"""
Application Configuration using Pydantic Settings
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings"""

    # App info
    app_name: str = "Portfolio API"
    app_version: str = "1.0.0"
    debug: bool = True

    # API paths
    api_prefix: str = "/api"

    # CORS (comma-separated string)
    allowed_origins: str = "http://localhost:3000"

    # JWT Settings
    jwt_secret_key: str = "your-secret-key-change-in-production-min-32-chars"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Password Settings
    password_salt: str = "default-salt-change-in-production"
    admin_password_hash: str = "b6a31c6e4192ca77fec64e177acb8808d2fbc1f4525c046f5070a6d620d19511"  # "admin123"

    # MongoDB Settings
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_database: str = "portfolio"

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
