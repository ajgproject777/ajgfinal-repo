import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional, Tuple, Dict, Any
import bcrypt
import jwt
from app.core.config import settings

def hash_password(password: str) -> str:
    """Hash a password securely using direct bcrypt with 12 salt rounds."""
    salt = bcrypt.gensalt(rounds=12)
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a stored bcrypt hash."""
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False

def hash_token(raw_token: str) -> str:
    """Generate SHA-256 hash of a refresh token to safely store in database."""
    return hashlib.sha256(raw_token.encode("utf-8")).hexdigest()

def create_access_token(
    subject: str,
    role: str = "traveller",
    expires_delta: Optional[timedelta] = None
) -> str:
    """Generate HS256 JWT access token with standard claims."""
    now = datetime.now(timezone.utc)
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)

    payload = {
        "sub": str(subject),
        "role": role,
        "type": "access",
        "iat": int(now.timestamp()),
        "exp": int(expire.timestamp()),
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(
    user_id: str,
    expires_delta: Optional[timedelta] = None
) -> Tuple[str, str, datetime]:
    """
    Generate cryptographically secure refresh token.
    Returns: (raw_token_for_client, token_hash_for_db, expires_at)
    """
    now = datetime.now(timezone.utc)
    if expires_delta:
        expires_at = now + expires_delta
    else:
        expires_at = now + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)

    # 48-byte URL-safe cryptographically strong random string
    raw_token = secrets.token_urlsafe(48)
    token_db_hash = hash_token(raw_token)
    return raw_token, token_db_hash, expires_at

def decode_access_token(token: str) -> Dict[str, Any]:
    """Decode and validate an access token. Raises jwt exceptions on invalid token."""
    payload = jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.ALGORITHM]
    )
    if payload.get("type") != "access":
        raise jwt.InvalidTokenError("Token is not an access token")
    return payload
