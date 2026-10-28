import os
import logging
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator

logger = logging.getLogger("dinego.config")

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/dinego"
    SECRET_KEY: str = "insecure-placeholder-key-for-local-scaffold-only-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30
    ALLOWED_ORIGINS: str = "http://localhost:8081,http://localhost:8082,http://127.0.0.1:8081,http://localhost:5173"
    GOOGLE_MAPS_SERVER_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_file=(
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))), ".env"),
            ".env",
        ),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @field_validator("DATABASE_URL")
    @classmethod
    def validate_database_url(cls, v: str) -> str:
        if v.startswith("sqlite"):
            raise ValueError(
                "SQLite is strictly disallowed in DineGo. PostgreSQL (postgresql+asyncpg://...) is the only supported database."
            )
        if not (v.startswith("postgresql+asyncpg://") or v.startswith("postgresql://")):
            raise ValueError(
                "DATABASE_URL must be a PostgreSQL connection URL (e.g. postgresql+asyncpg://user:pass@host:port/dbname)."
            )
        return v

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if len(v) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters long for secure cryptographic hashing.")
        return v

    def model_post_init(self, __context) -> None:
        if self.ENVIRONMENT.lower() == "production":
            insecure_markers = ["placeholder", "change-me", "change-this", "insecure"]
            if any(marker in self.SECRET_KEY.lower() for marker in insecure_markers):
                raise ValueError("Insecure placeholder SECRET_KEY is strictly forbidden in production mode.")
            if "postgres:postgres" in self.DATABASE_URL.lower():
                raise ValueError("Default placeholder database credentials cannot be used in production mode.")

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

settings = Settings()
