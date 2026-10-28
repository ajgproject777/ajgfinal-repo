import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.mark.asyncio
async def test_root_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["message"] == "Welcome to DineGo API"
    assert data["docs"] == "/docs"
    assert data["health"] == "/health"
    assert data["api_v1"] == "/api/v1/health"

@pytest.mark.asyncio
async def test_legacy_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "DineGo Backend API"
    assert data["version"] == "1.0.0"

@pytest.mark.asyncio
async def test_versioned_api_v1_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "DineGo Backend API"
    assert data["version"] == "1.0.0"

@pytest.mark.asyncio
async def test_openapi_schema():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/openapi.json")
    assert response.status_code == 200
    data = response.json()
    assert data["info"]["title"] == "DineGo Backend API"
    assert data["info"]["version"] == "1.0.0"
    paths = data["paths"]
    assert "/health" in paths
    assert "/api/v1/health" in paths
