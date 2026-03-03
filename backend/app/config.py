"""
Application Configuration using Pydantic Settings
"""
from pydantic_settings import BaseSettings
from pydantic import field_validator
from dotenv import load_dotenv
load_dotenv()
class Settings(BaseSettings):
    """Application settings"""

    # App info
    app_name: str = "Portfolio API"
    app_version: str = "1.0.0"
    debug: bool = False

    # API paths
    api_prefix: str = "/api"

    # CORS (comma-separated string)
    allowed_origins: str

    # JWT Settings
    jwt_secret_key: str
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Password Settings
    password_salt: str
    admin_password_hash: str

    # MongoDB Settings
    mongodb_url: str
    mongodb_database: str

    @field_validator("debug", mode="before")
    @classmethod
    def parse_debug(cls, value):
        if isinstance(value, str):
            normalized = value.strip().lower()
            if normalized in {"release", "prod", "production"}:
                return False
            if normalized in {"dev", "development"}:
                return True
        return value

    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
