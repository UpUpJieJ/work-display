"""
Password Hash Generator Utility

This script generates password hashes for configuration purposes.
Run from the backend directory: python -m app.utils.generate_hash

Usage:
    python -m app.utils.generate_hash <password> [salt]
    
Example:
    python -m app.utils.generate_hash admin123
"""

import hashlib
import sys
from pathlib import Path

# Add parent directory to path to import config
sys.path.insert(0, str(Path(__file__).parent.parent.parent))

from app.config import settings


def generate_password_hash(password: str, salt: str = None) -> str:
    """
    Generate a password hash using SHA-256 with salt

    Args:
        password: Password to hash
        salt: Optional salt (uses default if not provided)

    Returns:
        Hash string for use in environment variables
    """
    salt_to_use = salt or settings.password_salt
    salted = f"{salt_to_use}{password}".encode('utf-8')
    return hashlib.sha256(salted).hexdigest()


def main():
    """CLI entry point"""
    if len(sys.argv) < 2:
        print("Usage: python -m app.utils.generate_hash <password> [salt]")
        print(f"Default salt: {settings.password_salt}")
        sys.exit(1)
    
    password = sys.argv[1]
    salt = sys.argv[2] if len(sys.argv) > 2 else None
    
    hash_value = generate_password_hash(password, salt)
    print(f"Password hash: {hash_value}")
    print(f"")
    print(f"Set in your .env file:")
    print(f"ADMIN_PASSWORD_HASH={hash_value}")


if __name__ == "__main__":
    main()
