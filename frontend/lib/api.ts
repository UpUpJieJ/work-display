/**
 * API Functions
 * API request functions for the portfolio application
 */

import {
  fetchProjects,
  fetchProject,
  fetchProjectBySlug,
  fetchProjectCategories,
  fetchSkills,
  fetchSkillsGrouped,
  fetchProfile,
  submitContact,
  submitContactForm,
  ContactFormData,
  Project,
  ProjectCategoryInfo,
  Skill,
  SkillGroup,
  Profile,
} from './types';

// Re-export types for convenience
export type {
  Project,
  ProjectCategoryInfo,
  Skill,
  SkillGroup,
  Profile,
  ContactFormData,
};

// Project API
export { fetchProjects, fetchProject, fetchProjectBySlug, fetchProjectCategories };

// Skill API
export { fetchSkills, fetchSkillsGrouped };

// Profile API
export { fetchProfile };

// Contact API
export { submitContact, submitContactForm };
