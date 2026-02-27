"""
API Endpoint Tests
"""
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


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
