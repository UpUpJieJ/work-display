/**
 * Admin Skills Management Page
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Skill, SkillCategory } from "@/lib/types";

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/skills`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("获取技能列表失败");

      const data = await response.json();
      setSkills(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载技能列表失败");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    // Find the skill to get its ID
    const skillToDelete = skills.find((s) => s.name === name);
    if (!skillToDelete) return;

    if (!confirm(`确定要删除 ${name} 吗？`)) return;

    try {
      const token = localStorage.getItem("admin_token");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

      // Skills use name as identifier in our API
      const response = await fetch(`${apiUrl}/api/skills/${name}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("删除技能失败");

      setSkills(skills.filter((s) => s.name !== name));
    } catch (err) {
      alert(err instanceof Error ? err.message : "删除技能失败");
    }
  };

  const getCategoryName = (category: SkillCategory): string => {
    const names: Record<SkillCategory, string> = {
      languages: "编程语言",
      frameworks: "框架",
      databases: "数据库",
      tools: "工具",
      cloud_platforms: "云平台",
      concepts: "概念",
    };
    return names[category] || category;
  };

  const getProficiencyColor = (proficiency: string): string => {
    const colors: Record<string, string> = {
      expert: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      advanced: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      intermediate: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      beginner: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      learning: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
    };
    return colors[proficiency] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="text-center py-12">加载中...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-destructive">{error}</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">技能</h1>
        <Link
          href="/admin/skills/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          添加技能
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium">名称</th>
                <th className="px-6 py-3 text-left text-sm font-medium">分类</th>
                <th className="px-6 py-3 text-left text-sm font-medium">熟练程度</th>
                <th className="px-6 py-3 text-left text-sm font-medium">精选</th>
                <th className="px-6 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {skills.map((skill) => (
                <tr key={skill.name} className="hover:bg-muted/50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{skill.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-muted dark:bg-gray-700 rounded text-sm">
                      {getCategoryName(skill.category)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-sm ${getProficiencyColor(skill.proficiency)}`}>
                      {skill.proficiency}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {skill.featured ? "是" : "否"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/skills/${encodeURIComponent(skill.name)}`}
                        className="p-2 hover:bg-muted dark:hover:bg-gray-700 rounded-md"
                        title="编辑"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(skill.name)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-md"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            暂无技能，开始添加第一个技能吧！
          </div>
        )}
      </div>
    </div>
  );
}
