/**
 * Homepage Component
 */
"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/projects/project-card";
import { SkillsGrid } from "@/components/skills/skills-grid";
import { fetchProjects, fetchSkills, fetchProfile } from "@/lib/api";
import { Project, Skill, Profile } from "@/lib/types";
import Link from "next/link";

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [projectsData, skillsData, profileData] = await Promise.all([
          fetchProjects(undefined, true),
          fetchSkills(undefined, true),
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

  if (loading || !profile) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        <div className="text-center">加载中...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
      <div className="max-w-8xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Left: 自我介绍 + 技能专长 */}
          <div className="lg:col-span-2 space-y-10">
            <Hero compact profile={profile} />
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">技能专长</h2>
                <Link
                  href="/about"
                  className="text-primary hover:underline text-sm inline-flex items-center gap-1"
                >
                  了解更多 →
                </Link>
              </div>
              <SkillsGrid skills={skills} compact />
            </section>
          </div>

          {/* Right: 精选项目 */}
          <section className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">精选项目</h2>
              <Link
                href="/projects"
                className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
              >
                查看全部 →
              </Link>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 3).map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
