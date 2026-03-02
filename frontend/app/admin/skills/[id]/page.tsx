/**
 * Admin Skill Edit/Create Page
 */
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Skill, SkillCategory, ProficiencyLevel } from "@/lib/types";

export default function AdminSkillEditPage() {
  const router = useRouter();
  const params = useParams();
  const [skill, setSkill] = useState<Partial<Skill>>({
    name: "",
    category: "languages" as SkillCategory,
    proficiency: "intermediate" as ProficiencyLevel,
    years_experience: undefined,
    icon: "",
    featured: false,
  });
  const [originalName, setOriginalName] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isNew, setIsNew] = useState(false);

  useEffect(() => {
    const id = params.id as string;
    if (id === "new") {
      setIsNew(true);
    } else {
      const skillName = decodeURIComponent(id);
      setOriginalName(skillName);
      fetchSkillByName(skillName);
    }
  }, [params.id]);

  const fetchSkillByName = async (name: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/skills`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("获取技能失败");

      const skills: Skill[] = await response.json();
      const found = skills.find((s) => s.name === name);

      if (found) {
        setSkill(found);
      } else {
        setError("技能不存在");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载技能失败");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // For editing, use the original name as path parameter
      const url = isNew
        ? `${apiUrl}/api/skills`
        : `${apiUrl}/api/skills/${encodeURIComponent(originalName)}`;

      const method = isNew ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(skill),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "保存技能失败");
      }

      router.push("/admin/skills");
    } catch (err) {
      setError(err instanceof Error ? err.message : "保存技能失败");
      setLoading(false);
    }
  };

  if (loading && !isNew) {
    return <div className="text-center py-12">加载中...</div>;
  }

  const categories: SkillCategory[] = [
    "languages",
    "frameworks",
    "databases",
    "tools",
    "cloud_platforms",
    "concepts",
  ];

  const proficiencies: ProficiencyLevel[] = [
    "expert",
    "advanced",
    "intermediate",
    "beginner",
    "learning",
  ];

  const categoryNames: Record<SkillCategory, string> = {
    languages: "编程语言",
    frameworks: "框架",
    databases: "数据库",
    tools: "工具",
    cloud_platforms: "云平台",
    concepts: "概念",
  };

  const proficiencyNames: Record<ProficiencyLevel, string> = {
    expert: "专家",
    advanced: "高级",
    intermediate: "中级",
    beginner: "初级",
    learning: "学习中",
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {isNew ? "新建技能" : "编辑技能"}
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
              <label htmlFor="name" className="block text-sm font-medium mb-2">
                名称 *
              </label>
              <input
                id="name"
                type="text"
                value={skill.name}
                onChange={(e) => setSkill({ ...skill, name: e.target.value })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
                disabled={!isNew}
              />
              {!isNew && (
                <p className="text-xs text-muted-foreground mt-1">
                  技能创建后无法修改名称
                </p>
              )}
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                分类 *
              </label>
              <select
                id="category"
                value={skill.category}
                onChange={(e) => setSkill({ ...skill, category: e.target.value as SkillCategory })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryNames[cat]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="proficiency" className="block text-sm font-medium mb-2">
                熟练程度 *
              </label>
              <select
                id="proficiency"
                value={skill.proficiency}
                onChange={(e) => setSkill({ ...skill, proficiency: e.target.value as ProficiencyLevel })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                required
              >
                {proficiencies.map((prof) => (
                  <option key={prof} value={prof}>
                    {proficiencyNames[prof]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="years_experience" className="block text-sm font-medium mb-2">
                经验年限
              </label>
              <input
                id="years_experience"
                type="number"
                step="0.1"
                min="0"
                value={skill.years_experience ?? ""}
                onChange={(e) => setSkill({
                  ...skill,
                  years_experience: e.target.value ? parseFloat(e.target.value) : undefined
                })}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
                placeholder="e.g. 3.5"
              />
            </div>
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium mb-2">
              图标
            </label>
            <input
              id="icon"
              type="text"
              value={skill.icon ?? ""}
              onChange={(e) => setSkill({ ...skill, icon: e.target.value })}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-700 dark:border-gray-600"
              placeholder="e.g. python, javascript, react"
            />
            <p className="text-xs text-muted-foreground mt-1">
              图标类名或标识符
            </p>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={skill.featured}
                onChange={(e) => setSkill({ ...skill, featured: e.target.checked })}
                className="w-4 h-4 text-primary rounded focus:ring-primary"
              />
              <span className="text-sm font-medium">精选技能</span>
            </label>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "保存中..." : isNew ? "创建技能" : "保存修改"}
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/skills")}
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
