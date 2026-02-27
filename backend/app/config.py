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

    # CORS
    allowed_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
