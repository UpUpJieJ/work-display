/**
 * Project Card Component
 */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Project } from '@/lib/types';
import { Github, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const router = useRouter();

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

  const getStatusName = (status: string) => {
    const names: Record<string, string> = {
      completed: '已完成',
      in_progress: '进行中',
      planned: '计划中',
      maintaining: '维护中',
      archived: '已归档',
    };
    return names[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      in_progress: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      planned: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400',
      maintaining: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      archived: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    };
    return classes[status] || classes.completed;
  };

  const handleCardClick = () => {
    router.push(`/projects/${project.slug}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group cursor-pointer bg-card rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-border"
    >
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
                onClick={(event) => event.stopPropagation()}
                onKeyDown={(event) => event.stopPropagation()}
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
              getStatusClass(project.status)
            )}>
              {getStatusName(project.status)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
