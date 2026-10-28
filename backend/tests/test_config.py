import pytest
from pydantic import ValidationError
from app.core.config import Settings

def test_config_defaults():
    settings = Settings()
    assert settings.ENVIRONMENT == "development"
    assert settings.ALGORITHM == "HS256"
    assert settings.ACCESS_TOKEN_EXPIRE_MINUTES == 15
    assert len(settings.cors_origins) > 0

def test_cors_origins_parsing():
    settings = Settings(ALLOWED_ORIGINS="http://localhost:3000, https://dinego.app ")
    assert settings.cors_origins == ["http://localhost:3000", "https://dinego.app"]

def test_secret_key_validation_rejects_short_keys():
    with pytest.raises(ValidationError) as exc_info:
        Settings(SECRET_KEY="short-key")
    assert "SECRET_KEY must be at least 32 characters" in str(exc_info.value)

def test_database_url_rejects_sqlite():
    with pytest.raises(ValidationError) as exc_info:
        Settings(DATABASE_URL="sqlite:///dinego.db")
    assert "SQLite is strictly disallowed in DineGo" in str(exc_info.value)

def test_database_url_requires_postgresql_driver():
    with pytest.raises(ValidationError) as exc_info:
        Settings(DATABASE_URL="mysql://user:pass@localhost/dinego")
    assert "DATABASE_URL must be a PostgreSQL connection URL" in str(exc_info.value)
