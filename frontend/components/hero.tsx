/**
 * Hero Section Component
 * Accepts profile data as props for server-side rendering
 */
import Link from 'next/link';
import { ArrowRight, Github, Linkedin, Mail } from 'lucide-react';
import { Profile } from '@/lib/types';

interface HeroProps {
  compact?: boolean;
  profile?: Profile | null;
}

export function Hero({ compact = false, profile }: HeroProps) {

  // Handle case when profile is not provided
  if (!profile) {
    return (
      <section
        className={compact ? "space-y-6" : "container mx-auto px-4 py-20 md:py-32"}
      >
        <div className={compact ? "space-y-4" : "max-w-3xl mx-auto text-center space-y-8"}>
          <div className="animate-pulse">
            <div className={`h-12 bg-muted rounded mb-4 ${compact ? "w-32" : "w-48 mx-auto"}`} />
            <div className={`h-6 bg-muted rounded ${compact ? "w-40" : "w-64 mx-auto"}`} />
          </div>
        </div>
      </section>
    );
  }

  const githubLink = profile.social_links?.find(l => l.platform === 'GitHub');
  const linkedinLink = profile.social_links?.find(l => l.platform === 'LinkedIn');
  const emailLink = profile.social_links?.find(l => l.platform === 'Email');

  return (
    <section
      className={
        compact ? "space-y-6" : "container mx-auto px-4 py-20 md:py-32"
      }
    >
      <div
        className={
          compact
            ? "space-y-4"
            : "max-w-3xl mx-auto text-center space-y-8"
        }
      >
        {/* Greeting */}
        <div className={compact ? "" : "inline-block"}>
          <span className="text-primary text-sm font-medium">你好，我是</span>
        </div>

        {/* Name and Title */}
        <div className="space-y-4">
          <h1
            className={
              compact
                ? "text-2xl md:text-3xl font-bold tracking-tight"
                : "text-4xl md:text-6xl font-bold tracking-tight"
            }
          >
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {profile.name}
            </span>
          </h1>
          <p
            className={
              compact
                ? "text-lg text-muted-foreground"
                : "text-xl md:text-2xl text-muted-foreground"
            }
          >
            {profile.title}
          </p>
          <p
            className={
              compact
                ? "text-muted-foreground text-sm"
                : "text-muted-foreground max-w-2xl mx-auto"
            }
          >
            {profile.tagline}
          </p>
        </div>

        {/* CTA Buttons */}
        <div
          className={
            compact
              ? "flex flex-wrap gap-3 pt-2"
              : "flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          }
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            查看项目
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors"
          >
            联系我
          </Link>
        </div>

        {/* Social Links */}
        <div
          className={
            compact
              ? "flex items-center gap-4 pt-2"
              : "flex items-center justify-center gap-6 pt-4"
          }
        >
          {githubLink && (
            <a
              href={githubLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          )}
          {linkedinLink && (
            <a
              href={linkedinLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
          )}
          {emailLink && (
            <a
              href={emailLink.url}
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
