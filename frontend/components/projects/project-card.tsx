/**
 * Project Card Component
 */
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/lib/types';
import { Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const getCategoryDisplayName = (category: string) => {
    const names: Record<string, string> = {
      web_development: 'Web 开发',
      web_scraping: '网络爬虫',
      data_analysis: '数据分析',
      automation: '自动化',
      machine_learning: '机器学习',
      api_development: 'API 开发',
    };
    return names[category] || category;
  };

  return (
    <div className="group bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border">
      {/* Project Image */}
      {project.image && (
        <div className="relative h-48 overflow-hidden bg-muted">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5" />
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            <span className="text-4xl font-bold text-primary/20">{project.title[0]}</span>
          </div>
        </div>
      )}

      {/* Project Content */}
      <div className="p-6">
        {/* Category Badge */}
        <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary mb-3">
          {getCategoryDisplayName(project.category)}
        </span>

        {/* Title */}
        <h3 className="text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
          {project.title}
        </h3>

        {/* Short Description */}
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {project.short_description}
        </p>

        {/* Technology Tags */}
        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md"
            >
              {tech}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded-md">
              +{project.technologies.length - 4}
            </span>
          )}
        </div>

        {/* Links */}
        {project.links.length > 0 && (
          <div className="mt-4 flex gap-3">
            {project.links.map((link) => (
              <Link
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
              >
                {link.icon === 'github' ? (
                  <Github className="w-4 h-4" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                <span>{link.title}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Status Badge */}
        {project.status !== 'completed' && (
          <div className="mt-3">
            <span className={cn(
              "inline-block px-2 py-1 text-xs rounded-md",
              project.status === 'in_progress'
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {project.status === 'in_progress' ? '进行中' : '计划中'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
