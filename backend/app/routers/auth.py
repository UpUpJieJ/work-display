"""
Authentication API Router
Simple password-based authentication using JWT
"""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from datetime import datetime, timedelta
from typing import Optional
import hashlib
import hmac
from jose import jwt
from app.config import settings

router = APIRouter()

# Security configuration (from shared settings)
SECRET_KEY = settings.jwt_secret_key
ALGORITHM = settings.jwt_algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

# Password salt for hashing (from shared settings)
PASSWORD_SALT = settings.password_salt


class LoginRequest(BaseModel):
    """Login request model"""
    password: str = Field(..., min_length=1)


class Token(BaseModel):
    """JWT Token response"""
    access_token: str
    token_type: str = "bearer"


class User(BaseModel):
    """Current user info"""
    username: str
    is_authenticated: bool = True


def hash_password(password: str) -> str:
    """
    Hash a password using SHA-256 with salt

    Args:
        password: Plain text password

    Returns:
        Hexadecimal hash string
    """
    salted = f"{PASSWORD_SALT}{password}".encode('utf-8')
    return hashlib.sha256(salted).hexdigest()


def verify_password(plain_password: str, password_hash: str) -> bool:
    """
    Verify a password against a hash

    Args:
        plain_password: Plain text password to verify
        password_hash: Stored hash to compare against

    Returns:
        True if password matches
    """
    return hmac.compare_digest(hash_password(plain_password), password_hash)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT token

    Args:
        data: Data to encode in token
        expires_delta: Optional expiration time delta

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def get_admin_password_hash() -> str:
    """
    Get the admin password hash from settings

    Default password: admin123
    Pre-computed hash for "admin123" with default salt:
    """
    return settings.admin_password_hash


@router.post("/login", response_model=Token)
async def login(request: LoginRequest):
    """
    Admin login endpoint

    Args:
        request: Login request with password

    Returns:
        JWT access token

    Raises:
        HTTPException: If password is incorrect
    """
    stored_hash = get_admin_password_hash()

    if not verify_password(request.password, stored_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": "admin"}, expires_delta=access_token_expires
    )

    return Token(access_token=access_token)


@router.get("/me", response_model=User)
async def get_current_user():
    """
    Get current authenticated user
    Note: Actual authentication should be done via dependency
    """
    return User(username="admin")


def generate_password_hash(password: str, salt: str = None) -> str:
    """
    Generate a password hash for configuration

    Args:
        password: Password to hash
        salt: Optional salt (uses default if not provided)

    Returns:
        Hash string for use in environment variables

    Example:
        hash = generate_password_hash("my-password")
        print(f"ADMIN_PASSWORD_HASH={hash}")
    """
    salt_to_use = salt or PASSWORD_SALT
    salted = f"{salt_to_use}{password}".encode('utf-8')
    return hashlib.sha256(salted).hexdigest()
