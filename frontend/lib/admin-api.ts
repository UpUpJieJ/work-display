/**
 * Admin API Client
 * Handles authenticated requests to admin endpoints
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

function getAuthHeaders() {
  if (typeof window === "undefined") {
    throw new Error("Cannot access localStorage on server");
  }

  const token = localStorage.getItem("admin_token");

  if (!token) {
    throw new Error("Not authenticated");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function fetchAdminAPI(endpoint: string, options?: RequestInit) {
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options?.headers,
      },
    });

    if (response.status === 401) {
      // Token expired or invalid
      if (typeof window !== "undefined") {
        localStorage.removeItem("admin_token");
        window.location.href = "/admin/login";
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    // For DELETE requests with 204 status
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error occurred");
  }
}

// Auth APIs
export async function adminLogin(password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

// Project CRUD
export async function createProject(project: Partial<Project>): Promise<Project> {
  return fetchAdminAPI("/api/projects", {
    method: "POST",
    body: JSON.stringify(project),
  });
}

export async function updateProject(id: string, project: Partial<Project>): Promise<Project> {
  return fetchAdminAPI(`/api/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(project),
  });
}

export async function deleteProject(id: string): Promise<void> {
  return fetchAdminAPI(`/api/projects/${id}`, {
    method: "DELETE",
  });
}

export async function getProjectBackups(): Promise<BackupInfo[]> {
  return fetchAdminAPI("/api/projects/admin/backups");
}

export async function restoreProjectBackup(backupPath: string): Promise<{ message: string }> {
  return fetchAdminAPI("/api/projects/admin/restore", {
    method: "POST",
    body: JSON.stringify({ backup_path: backupPath }),
  });
}

// Skill CRUD
export async function createSkill(skill: Partial<Skill>): Promise<Skill> {
  return fetchAdminAPI("/api/skills", {
    method: "POST",
    body: JSON.stringify(skill),
  });
}

export async function updateSkill(skillId: string, skill: Partial<Skill>): Promise<Skill> {
  return fetchAdminAPI(`/api/skills/${skillId}`, {
    method: "PUT",
    body: JSON.stringify(skill),
  });
}

export async function deleteSkill(skillId: string): Promise<void> {
  return fetchAdminAPI(`/api/skills/${skillId}`, {
    method: "DELETE",
  });
}

export async function getSkillBackups(): Promise<BackupInfo[]> {
  return fetchAdminAPI("/api/skills/admin/backups");
}

export async function restoreSkillBackup(backupPath: string): Promise<{ message: string }> {
  return fetchAdminAPI("/api/skills/admin/restore", {
    method: "POST",
    body: JSON.stringify({ backup_path: backupPath }),
  });
}

// Profile
export async function updateProfile(profile: Partial<Profile>): Promise<Profile> {
  return fetchAdminAPI("/api/profile", {
    method: "PUT",
    body: JSON.stringify(profile),
  });
}

export async function getProfileBackups(): Promise<BackupInfo[]> {
  return fetchAdminAPI("/api/profile/admin/backups");
}

export async function restoreProfileBackup(backupPath: string): Promise<{ message: string }> {
  return fetchAdminAPI("/api/profile/admin/restore", {
    method: "POST",
    body: JSON.stringify({ backup_path: backupPath }),
  });
}

// Types
export interface BackupInfo {
  filename: string;
  path: string;
  timestamp: string;
  size: number;
}

// Re-export types from main types file
export type { Project, Skill, Profile } from "./types";
