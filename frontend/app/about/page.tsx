/**
 * About Page Component
 */
import { SkillsGrid } from "@/components/skills/skills-grid";
import { fetchProfile, fetchSkillsGrouped } from "@/lib/api";
import { Mail, MapPin, Calendar } from "lucide-react";

export default async function AboutPage() {
  const [profile, skillsGrouped] = await Promise.all([
    fetchProfile(),
    fetchSkillsGrouped(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">关于我</h1>
          <p className="text-xl text-muted-foreground">{profile.tagline}</p>
        </div>

        {/* Profile Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">个人简介</h2>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {profile.bio.split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-card border border-border rounded-xl p-6 h-fit">
            <div className="space-y-4">
              {profile.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm">{profile.location}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {profile.email}
                  </a>
                </div>
              )}
            </div>

            {/* Social Links */}
            {profile.social_links.length > 0 && (
              <div className="pt-4 border-t border-border">
                <h3 className="text-sm font-medium mb-3">社交媒体</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.social_links.map((link: any) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      {link.display_name || link.platform}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Experience Section */}
        {profile.experience.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">工作经历</h2>
            <div className="space-y-6">
              {profile.experience.map((exp: any) => (
                <div
                  key={exp.id}
                  className="relative pl-6 border-l-2 border-border pb-6 last:pb-0"
                >
                  <div className="absolute left-0 top-0 w-3 h-3 -translate-x-[7px] rounded-full bg-primary" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="text-lg font-semibold">{exp.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {exp.start_date} - {exp.end_date || '至今'}
                    </span>
                  </div>
                  <p className="text-primary mb-2">{exp.company}</p>
                  {exp.description && (
                    <p className="text-muted-foreground text-sm mb-2">
                      {exp.description}
                    </p>
                  )}
                  {exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2 py-1 text-xs bg-muted text-muted-foreground rounded"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {profile.education.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">教育背景</h2>
            <div className="space-y-4">
              {profile.education.map((edu: any) => (
                <div
                  key={edu.id}
                  className="bg-card border border-border rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="font-semibold">{edu.degree}</h3>
                    <span className="text-sm text-muted-foreground">
                      {edu.start_date} - {edu.end_date}
                    </span>
                  </div>
                  <p className="text-primary text-sm">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-sm text-muted-foreground mt-1">
                      GPA: {edu.gpa}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-6">技能专长</h2>
          <SkillsGrid skills={[]} grouped={true} groups={skillsGrouped} />
        </div>
      </div>
    </div>
  );
}
