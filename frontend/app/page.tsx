/**
 * Homepage Component
 */
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/projects/project-card";
import { SkillsGrid } from "@/components/skills/skills-grid";
import { fetchProjects, fetchSkills, fetchProfile } from "@/lib/api";
import Link from "next/link";

export default async function HomePage() {
  // Fetch featured projects and skills
  const [projects, skills, profile] = await Promise.all([
    fetchProjects(undefined, true),
    fetchSkills(undefined, true),
    fetchProfile(),
  ]);

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
