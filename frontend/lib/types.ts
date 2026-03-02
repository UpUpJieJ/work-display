/**
 * Type Definitions
 * TypeScript types for the portfolio application
 */

// API Base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// ============= Project Types =============

export type ProjectCategory =
  | 'web_development'
  | 'web_scraping'
  | 'data_analysis'
  | 'automation'
  | 'machine_learning'
  | 'api_development';

export type ProjectStatus =
  | 'completed'
  | 'in_progress'
  | 'planned'
  | 'maintaining'
  | 'archived';

export interface ProjectLink {
  title: string;
  url: string;
  icon?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  links: ProjectLink[];
  featured: boolean;
  status: ProjectStatus;
  highlights: string[];
}

export interface ProjectCategoryInfo {
  name: string;
  value: ProjectCategory;
  count: number;
}

// ============= Skill Types =============

export type SkillCategory =
  | 'languages'
  | 'frameworks'
  | 'databases'
  | 'tools'
  | 'cloud_platforms'
  | 'concepts';

export type ProficiencyLevel =
  | 'expert'
  | 'advanced'
  | 'intermediate'
  | 'beginner'
  | 'learning';

export interface Skill {
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  years_experience?: number;
  icon?: string;
  featured: boolean;
}

export interface SkillGroup {
  category: SkillCategory;
  category_name: string;
  skills: Skill[];
}

// ============= Profile Types =============

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  display_name?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location?: string;
  start_date: string;
  end_date?: string;
  description?: string;
  technologies: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  start_date: string;
  end_date?: string;
  gpa?: string;
  highlights: string[];
}

export interface Profile {
  name: string;
  title: string;
  tagline?: string;
  bio: string;
  email?: string;
  phone?: string;
  location?: string;
  resume_url?: string;
  social_links: SocialLink[];
  experience: Experience[];
  education: Education[];
}

// ============= Contact Types =============

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// ============= API Functions =============

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || `HTTP error! status: ${response.status}`);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json();
}

// Project API
export async function fetchProjects(category?: string, featured?: boolean): Promise<Project[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (featured) params.append('featured', 'true');
  const query = params.toString();
  return fetchAPI<Project[]>(`/api/projects${query ? `?${query}` : ''}`);
}

export async function fetchProject(slug: string): Promise<Project | null> {
  return fetchAPI<Project>(`/api/projects/${slug}`);
}

export async function fetchProjectBySlug(slug: string): Promise<Project | null> {
  return fetchAPI<Project>(`/api/projects/${slug}`);
}

export async function fetchProjectCategories(): Promise<ProjectCategoryInfo[]> {
  return fetchAPI<ProjectCategoryInfo[]>('/api/projects/categories');
}

// Skill API
export async function fetchSkills(category?: string, featured?: boolean): Promise<Skill[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (featured) params.append('featured', 'true');
  const query = params.toString();
  return fetchAPI<Skill[]>(`/api/skills${query ? `?${query}` : ''}`);
}

export async function fetchSkillsGrouped(): Promise<SkillGroup[]> {
  return fetchAPI<SkillGroup[]>('/api/skills/grouped');
}

// Profile API
export async function fetchProfile(): Promise<Profile> {
  return fetchAPI<Profile>('/api/profile');
}

// Contact API
export async function submitContact(data: ContactFormData): Promise<void> {
  return fetchAPI<void>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function submitContactForm(data: ContactFormData): Promise<void> {
  return fetchAPI<void>('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
