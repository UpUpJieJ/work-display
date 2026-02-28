/**
 * Admin Project Edit/Create Page
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Project, ProjectCategory, ProjectLink, ProjectStatus } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import { Eye, Edit2 } from "lucide-react";

// This is a simplified version - in production you'd want a more complete form
export default function AdminProjectEditPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Partial<Project>>({
    title: "",
    slug: "",
    short_description: "",
    description: "",
    category: "web_development" as ProjectCategory,
    technologies: [],
    links: [],
    featured: false,
    status: "completed" as ProjectStatus,
    highlights: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    if (id === "new") {
      setIsNew(true);
    } else {
      fetchProject(id);
    }
  }, [params.id]);

  const fetchProject = async (id: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("获取项目失败");

      const projects: Project[] = await response.json();
      const found = projects.find((p) => p.id === id);

      if (found) {
        setProject(found);
      } else {
        setError("项目不存在");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载项目失败");
    } finally {
      setLoading(false);
    }
  };

  const addLink = () => {
    const links = (project.links as ProjectLink[] | undefined) ?? [];
    setProject({
      ...project,
      links: [...links, { title: "", url: "", icon: "" }],
    });
  };

  const updateLink = (
    index: number,
    field: keyof ProjectLink,
    value: string,
  ) => {
    const current = (project.links as ProjectLink[] | undefined) ?? [];
    const next = current.map((link, i) =>
      i === index ? { ...link, [field]: value } : link,
    );
    setProject({
      ...project,
      links: next,
    });
  };

  const removeLink = (index: number) => {
    const current = (project.links as ProjectLink[] | undefined) ?? [];
    const next = current.filter((_, i) => i !== index);
    setProject({
      ...project,
      links: next,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const url = isNew
        ? `${apiUrl}/api/projects`
        : `${apiUrl}/api/projects/${params.id}`;

      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "保存项目失败");
      }

      // Redirect to projects list
      router.push("/admin/projects");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存项目失败");
      setLoading(false);
    }
  };

  if (loading && !isNew) {
    return <div className="text-center py-12">加载中...</div>;
  }

  const categories: ProjectCategory[] = [
    "web_development",
    "web_scraping",
    "data_analysis",
    "automation",
    "machine_learning",
    "api_development",
  ];

  // 常用项目状态
  const statusOptions = [
    { value: "completed", label: "已完成" },
    { value: "in_progress", label: "进行中" },
    { value: "planned", label: "计划中" },
    { value: "maintaining", label: "维护中" },
    { value: "archived", label: "已归档" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isNew ? "新建项目" : "编辑项目"}
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                标题 *
              </label>
              <input
                id="title"
                type="text"
                value={project.title}
                onChange={(e) => setProject({ ...project, title: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium mb-2">
                Slug * <span className="text-xs text-muted-foreground font-normal ml-1">（URL 标识符，如 my-project）</span>
              </label>
              <input
                id="slug"
                type="text"
                value={project.slug}
                onChange={(e) => setProject({ ...project, slug: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="short_description" className="block text-sm font-medium mb-2">
              简短描述 *
            </label>
            <input
              id="short_description"
              type="text"
              value={project.short_description}
              onChange={(e) => setProject({ ...project, short_description: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="description" className="block text-sm font-medium">
                详细描述 * <span className="text-xs text-muted-foreground font-normal ml-2">（支持 Markdown 语法）</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-xs text-primary hover:underline"
              >
                {showPreview ? (
                  <><Edit2 className="w-3 h-3" /> 编辑</>
                ) : (
                  <><Eye className="w-3 h-3" /> 预览</>
                )}
              </button>
            </div>
            {showPreview ? (
              <div className="min-h-[200px] p-4 border border-input rounded-md bg-muted/20 dark:bg-gray-700/50 prose prose-sm dark:prose-invert max-w-none">
                {project.description ? (
                  <ReactMarkdown>{project.description}</ReactMarkdown>
                ) : (
                  <p className="text-muted-foreground">暂无内容...</p>
                )}
              </div>
            ) : (
              <textarea
                id="description"
                value={project.description}
                onChange={(e) => setProject({ ...project, description: e.target.value })}
                rows={12}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600 font-mono text-sm"
                placeholder="使用 Markdown 语法编写详细描述...&#10;&#10;例如：&#10;## 标题&#10;**粗体** *斜体*&#10;- 列表项&#10;```代码块```&#10;[链接](url)"
                required
              />
            )}
            <p className="text-xs text-muted-foreground mt-2">
              支持 Markdown 语法：标题、粗体、斜体、列表、代码块、链接等
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                分类 *
              </label>
              <select
                id="category"
                value={project.category}
                onChange={(e) => setProject({ ...project, category: e.target.value as ProjectCategory })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                状态 *
              </label>
              <select
                id="status"
                value={project.status}
                onChange={(e) => setProject({ ...project, status: e.target.value as ProjectStatus })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={project.featured}
                  onChange={(e) => setProject({ ...project, featured: e.target.checked })}
                  className="w-4 h-4 text-primary rounded focus:ring-primary"
                />
                <span className="text-sm font-medium">精选项目</span>
              </label>
            </div>
          </div>

          <div>
            <label htmlFor="technologies" className="block text-sm font-medium mb-2">
              技术栈（用逗号分隔）
            </label>
            <input
              id="technologies"
              type="text"
              value={project.technologies?.join(", ") || ""}
              onChange={(e) =>
                setProject({
                  ...project,
                  technologies: e.target.value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean),
                })
              }
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
              placeholder="Python, FastAPI, React"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium">
                项目链接
              </label>
              <button
                type="button"
                onClick={addLink}
                className="text-xs text-primary hover:underline"
              >
                添加链接
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              可为项目配置多个链接，例如 GitHub 仓库、在线演示、飞书文档等。
              <span className="ml-1">
                icon 字段为 <code>github</code> 时会在前台显示 GitHub 图标，其它值使用通用外链图标。
              </span>
            </p>
            <div className="space-y-3">
              {((project.links as ProjectLink[] | undefined) ?? []).map(
                (link, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start"
                  >
                    <input
                      type="text"
                      value={link.title ?? ""}
                      onChange={(e) =>
                        updateLink(index, "title", e.target.value)
                      }
                      placeholder="标题（如 GitHub / 在线演示）"
                      className="md:col-span-3 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                    />
                    <input
                      type="text"
                      value={link.url ?? ""}
                      onChange={(e) =>
                        updateLink(index, "url", e.target.value)
                      }
                      placeholder="链接地址，如 https://github.com/..."
                      className="md:col-span-7 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div className="md:col-span-2 flex gap-2">
                      <input
                        type="text"
                        value={link.icon ?? ""}
                        onChange={(e) =>
                          updateLink(index, "icon", e.target.value)
                        }
                        placeholder="icon（如 github）"
                        className="flex-1 px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeLink(index)}
                        className="px-3 py-2 border border-destructive text-destructive rounded-md text-xs hover:bg-destructive/10"
                      >
                        删除
                      </button>
                    </div>
                  </div>
                ),
              )}
              {(((project.links as ProjectLink[] | undefined) ?? []).length ===
                0) && (
                  <p className="text-xs text-muted-foreground">
                    暂无链接，点击「添加链接」创建。
                  </p>
                )}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "保存中..." : isNew ? "创建项目" : "保存修改"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/projects")}
              className="px-6 py-2 border border-input rounded-md hover:bg-muted dark:hover:bg-gray-700"
            >
              取消
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
