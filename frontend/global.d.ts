/**
 * Global Type Definitions
 * Re-export types from lib/types for global access
 */

/// <reference types="./lib/types" />

declare global {
  // Re-export all types from lib/types as global types
  type Project = import('./lib/types').Project;
  type ProjectLink = import('./lib/types').ProjectLink;
  type ProjectCategory = import('./lib/types').ProjectCategory;
  type ProjectStatus = import('./lib/types').ProjectStatus;
  type ProjectCategoryInfo = import('./lib/types').ProjectCategoryInfo;

  type Skill = import('./lib/types').Skill;
  type SkillGroup = import('./lib/types').SkillGroup;
  type SkillCategory = import('./lib/types').SkillCategory;
  type ProficiencyLevel = import('./lib/types').ProficiencyLevel;

  type Profile = import('./lib/types').Profile;
  type SocialLink = import('./lib/types').SocialLink;
  type Experience = import('./lib/types').Experience;
  type Education = import('./lib/types').Education;

  type ContactFormData = import('./lib/types').ContactFormData;
}

export {};
