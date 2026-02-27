/**
 * Footer Component
 */
'use client';

import Link from 'next/link';
import { Github, Linkedin, Mail } from 'lucide-react';

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { name: 'Email', href: 'mailto:example@email.com', icon: Mail },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {currentYear} Portfolio. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground transition-colors hover:text-primary"
                  aria-label={link.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </div>

          {/* Navigation Links */}
          <nav className="flex gap-4 text-sm">
            <Link
              href="/"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              首页
            </Link>
            <Link
              href="/projects"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              项目
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              联系
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
