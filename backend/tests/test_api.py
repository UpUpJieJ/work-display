"""
API Endpoint Tests
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.dependencies.auth import get_current_user

client = TestClient(app)


@pytest.fixture(autouse=True)
def mock_runtime_dependencies(monkeypatch):
    """Avoid external DB dependency in tests."""
    async def fake_ping():
        return True

    async def fake_load_projects():
        return []

    async def fake_load_skills():
        return []

    async def fake_load_profile():
        return {
            "name": "Test User",
            "title": "Developer",
            "bio": "Test bio",
            "social_links": [],
            "experience": [],
            "education": [],
        }

    monkeypatch.setattr("app.main.ping_mongo", fake_ping)
    monkeypatch.setattr("app.routers.projects.load_projects", fake_load_projects)
    monkeypatch.setattr("app.routers.skills.load_skills", fake_load_skills)
    monkeypatch.setattr("app.routers.profile.load_profile", fake_load_profile)
    app.dependency_overrides.clear()
    yield
    app.dependency_overrides.clear()


def test_root():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "message" in response.json()


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_get_projects():
    """Test get projects endpoint"""
    response = client.get("/api/projects")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_project_categories():
    """Test get project categories endpoint"""
    response = client.get("/api/projects/categories")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_skills():
    """Test get skills endpoint"""
    response = client.get("/api/skills")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_profile():
    """Test get profile endpoint"""
    response = client.get("/api/profile")
    assert response.status_code == 200
    assert "name" in response.json()


def test_auth_me_requires_token():
    """Test /me requires auth token"""
    response = client.get("/api/auth/me")
    assert response.status_code in (401, 403)


def test_update_skill_authenticated(monkeypatch):
    """Test update skill endpoint works with auth and storage layer"""
    called = {"value": False}

    async def fake_update_skill_in_storage(skill_name: str, _skill: dict):
        called["value"] = True
        return skill_name == "Python"

    monkeypatch.setattr(
        "app.routers.skills.update_skill_in_storage",
        fake_update_skill_in_storage,
    )
    app.dependency_overrides[get_current_user] = lambda: "admin"

    payload = {
        "name": "Python",
        "category": "languages",
        "proficiency": "advanced",
        "years_experience": 5,
        "featured": True,
    }
    response = client.put("/api/skills/Python", json=payload)
    assert response.status_code == 200
    assert called["value"] is True
