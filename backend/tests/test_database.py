import pytest
from app.core.database import get_masked_db_url, check_database_connection

def test_get_masked_db_url_masks_password():
    url = "postgresql+asyncpg://dinego_user:superSecretPassword123@localhost:5432/dinego_db"
    masked = get_masked_db_url(url)
    assert "superSecretPassword123" not in masked
    assert masked == "postgresql+asyncpg://dinego_user:***@localhost:5432/dinego_db"

def test_get_masked_db_url_safe_when_no_password():
    url = "postgresql+asyncpg://localhost:5432/dinego_db"
    masked = get_masked_db_url(url)
    assert masked == url

@pytest.mark.asyncio
async def test_check_database_connection_graceful_handling():
    # Diagnostic check should handle unreachable DB gracefully without unhandled crash
    result = await check_database_connection(timeout_seconds=1.0)
    assert "status" in result
    assert "database_url" in result
    assert "message" in result
    # Never expose unmasked credentials
    assert "superSecretPassword" not in result["database_url"]
