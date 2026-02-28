/**
 * Utility Functions
 * Helper functions for the portfolio application
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names with tailwind-merge for proper handling of conflicting classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to Chinese locale
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get category display name
 */
export function getCategoryDisplayName(category: string): string {
  const names: Record<string, string> = {
    web_development: 'Web 开发',
    web_scraping: '网络爬虫',
    data_analysis: '数据分析',
    automation: '自动化',
    machine_learning: '机器学习',
    api_development: 'API 开发',
  };
  return names[category] || category;
}

/**
 * Get skill category display name
 */
export function getSkillCategoryName(category: string): string {
  const names: Record<string, string> = {
    languages: '编程语言',
    frameworks: '框架',
    databases: '数据库',
    tools: '工具',
    cloud_platforms: '云平台',
    concepts: '概念',
  };
  return names[category] || category;
}

/**
 * Get proficiency level display name
 */
export function getProficiencyLevel(level: string): string {
  const names: Record<string, string> = {
    expert: '专家',
    advanced: '高级',
    intermediate: '中级',
    beginner: '初级',
    learning: '学习中',
  };
  return names[level] || level;
}

/**
 * Get project status display name
 */
export function getProjectStatus(status: string): string {
  const names: Record<string, string> = {
    completed: '已完成',
    in_progress: '进行中',
    planned: '计划中',
    maintaining: '维护中',
    archived: '已归档',
  };
  return names[status] || status;
}
