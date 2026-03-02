/**
 * Project Detail Page Component
 */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProject, fetchProjects } from "@/lib/api";
import { Project } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ProjectPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    async function loadData() {
      try {
        const [projectData, allProjects] = await Promise.all([
          fetchProject(slug),
          fetchProjects(),
        ]);

        if (!projectData) {
          notFound();
          return;
        }

        setProject(projectData);
        setRelatedProjects(
          allProjects
            .filter((p) => p.category === projectData.category && p.id !== projectData.id)
            .slice(0, 3)
        );
      } catch (err) {
        setError("加载项目失败");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center text-destructive">{error || "项目不存在"}</div>
      </div>
    );
  }

  const getCategoryName = (category: string) => {
    const names: Record<string, string> = {
      web_development: "Web 开发",
      web_scraping: "网络爬虫",
      data_analysis: "数据分析",
      automation: "自动化",
      machine_learning: "机器学习",
      api_development: "API 开发",
    };
    return names[category] || category;
  };

  const getStatusName = (status: string) => {
    const names: Record<string, string> = {
      completed: "已完成",
      in_progress: "进行中",
      planned: "计划中",
      maintaining: "维护中",
      archived: "已归档",
    };
    return names[status] || status;
  };

  const getStatusClass = (status: string) => {
    const classes: Record<string, string> = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      in_progress: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      planned: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
      maintaining: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      archived: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return classes[status] || classes.completed;
  };

  // 确保 URL 是完整的（包含协议）
  const getFullUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
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
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(project.status)}`}>
              {getStatusName(project.status)}
            </span>
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
                href={getFullUrl(link.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                {link.icon === "github" ? (
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
            <ReactMarkdown>{project.description}</ReactMarkdown>
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
