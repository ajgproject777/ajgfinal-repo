import re
import asyncio
from typing import AsyncGenerator, Dict, Any
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=(settings.ENVIRONMENT == "development"),
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
)

async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

def get_masked_db_url(url: str = None) -> str:
    """Return DATABASE_URL with credentials masked to prevent secret leakage in logs/errors."""
    target_url = url or settings.DATABASE_URL
    return re.sub(r"://([^:@]+):([^@]+)@", r"://\1:***@", target_url)

async def check_database_connection(timeout_seconds: float = 3.0) -> Dict[str, Any]:
    """
    Diagnostic connectivity check.
    Attempts to ping PostgreSQL with a timeout.
    Returns status info without exposing passwords.
    """
    masked_url = get_masked_db_url()
    async def _ping() -> None:
        async with engine.connect() as conn:
            await conn.execute(text("SELECT 1"))

    try:
        await asyncio.wait_for(_ping(), timeout=timeout_seconds)
        return {
            "status": "connected",
            "database_url": masked_url,
            "message": "PostgreSQL database connected and responsive.",
        }
    except asyncio.TimeoutError:
        return {
            "status": "disconnected",
            "database_url": masked_url,
            "error_type": "TimeoutError",
            "message": f"Connection to PostgreSQL timed out after {timeout_seconds}s. Verify PostgreSQL is running on port 5432.",
        }
    except Exception as exc:
        return {
            "status": "disconnected",
            "database_url": masked_url,
            "error_type": exc.__class__.__name__,
            "message": f"Could not connect to PostgreSQL ({exc.__class__.__name__}). Verify PostgreSQL is running on port 5432.",
        }

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency that provides an async SQLAlchemy database session."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
