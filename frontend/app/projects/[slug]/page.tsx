/**
 * Project Detail Page Component
 */
import { fetchProject, fetchProjects } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, ExternalLink, Github } from 'lucide-react';

interface ProjectPageProps {
  params: {
    slug: string;
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = await fetchProject(params.slug);

  if (!project) {
    notFound();
  }

  // Fetch related projects
  const allProjects = await fetchProjects();
  const relatedProjects = allProjects
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  const getCategoryName = (category: string) => {
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
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回项目列表
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
              {getCategoryName(project.category)}
            </span>
            {project.status !== 'completed' && (
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                {project.status === 'in_progress' ? '进行中' : '计划中'}
              </span>
            )}
          </div>
          <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
          <p className="text-xl text-muted-foreground">
            {project.short_description}
          </p>
        </div>

        {/* Links */}
        {project.links.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-8">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {link.icon === 'github' ? (
                  <Github className="w-4 h-4" />
                ) : (
                  <ExternalLink className="w-4 h-4" />
                )}
                {link.title}
              </a>
            ))}
          </div>
        )}

        {/* Technologies */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">技术栈</h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-muted text-muted-foreground rounded-md text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">项目介绍</h2>
          <div className="prose prose-slate dark:prose-invert max-w-none">
            {project.description.split('\n\n').map((paragraph, index) => {
              // Simple markdown parsing
              if (paragraph.startsWith('## ')) {
                return (
                  <h3 key={index} className="text-xl font-semibold mt-6 mb-3">
                    {paragraph.replace('## ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <ul key={index} className="list-disc pl-6 space-y-1">
                    <li>{paragraph.replace('- ', '')}</li>
                  </ul>
                );
              }
              return (
                <p key={index} className="text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

        {/* Highlights */}
        {project.highlights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">项目亮点</h2>
            <ul className="space-y-2">
              {project.highlights.map((highlight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-muted-foreground"
                >
                  <span className="text-primary mt-1">✓</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-4">相关项目</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedProjects.map((relatedProject) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.slug}`}
                  className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-card-foreground mb-2">
                    {relatedProject.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {relatedProject.short_description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
