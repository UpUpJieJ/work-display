/**
 * Homepage Component
 */
import { Hero } from "@/components/hero";
import { ProjectCard } from "@/components/projects/project-card";
import { SkillsGrid } from "@/components/skills/skills-grid";
import { fetchProjects, fetchSkills } from "@/lib/api";
import Link from "next/link";

export default async function HomePage() {
  // Fetch featured projects and skills
  const [projects, skills] = await Promise.all([
    fetchProjects(undefined, true),
    fetchSkills(undefined, true),
  ]);

  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Featured Projects Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">精选项目</h2>
            <Link
              href="/projects"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              查看全部 →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Preview Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">技能专长</h2>
            <Link
              href="/about"
              className="text-primary hover:underline inline-flex items-center gap-1"
            >
              了解更多 →
            </Link>
          </div>
          <SkillsGrid skills={skills} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 bg-primary/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            让我们一起构建精彩的项目
          </h2>
          <p className="text-muted-foreground mb-8">
            如果您对我的工作感兴趣，欢迎随时与我联系
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            联系我
          </Link>
        </div>
      </section>
    </>
  );
}
