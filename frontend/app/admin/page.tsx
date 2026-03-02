/**
 * Admin Dashboard Home
 */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchProjects, fetchSkills, fetchProfile } from "@/lib/api";
import { Project, Skill, Profile } from "@/lib/types";
import {
  FolderKanban,
  Brain,
  User,
  ArrowRight,
  Activity,
} from "lucide-react";

interface Stat {
  name: string;
  value: number | string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, skillsData, profileData] = await Promise.all([
          fetchProjects(),
          fetchSkills(),
          fetchProfile(),
        ]);
        setProjects(projectsData);
        setSkills(skillsData);
        setProfile(profileData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const stats: Stat[] = [
    {
      name: "项目总数",
      value: projects.length,
      href: "/admin/projects",
      icon: FolderKanban,
      color: "bg-blue-500",
    },
    {
      name: "精选项目",
      value: projects.filter((p) => p.featured).length,
      href: "/admin/projects",
      icon: Activity,
      color: "bg-green-500",
    },
    {
      name: "技能总数",
      value: skills.length,
      href: "/admin/skills",
      icon: Brain,
      color: "bg-purple-500",
    },
    {
      name: "个人资料",
      value: profile?.name || "未设置",
      href: "/admin/profile",
      icon: User,
      color: "bg-orange-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">控制面板</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.name}</p>
                  <p className="text-2xl font-bold mt-1">
                    {typeof stat.value === "number" ? stat.value : stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                管理 <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">快捷操作</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/projects/new"
            className="p-4 border border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <FolderKanban className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">添加新项目</p>
          </Link>
          <Link
            href="/admin/skills/new"
            className="p-4 border border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <Brain className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">添加新技能</p>
          </Link>
          <Link
            href="/admin/profile"
            className="p-4 border border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-colors text-center"
          >
            <User className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="font-medium">编辑个人资料</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
