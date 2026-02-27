/**
 * Projects Page Component
 */
'use client';

import { useState, useEffect } from 'react';
import { ProjectTabs } from '@/components/projects/project-tabs';
import { ProjectCard } from '@/components/projects/project-card';
import { fetchProjects } from '@/lib/api';
import { Project } from '@/lib/types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const category = activeCategory === 'all' ? undefined : activeCategory;
        const data = await fetchProjects(category);
        setProjects(data);
      } catch (error) {
        console.error('Failed to load projects:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [activeCategory]);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">项目展示</h1>
        <p className="text-lg text-muted-foreground">
          这里是我参与开发的一些项目，涵盖 Web 开发、数据分析、自动化等多个领域
        </p>
      </div>

      {/* Category Tabs */}
      <div className="max-w-5xl mx-auto">
        <ProjectTabs
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Projects Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-muted-foreground">加载中...</div>
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            该分类下暂无项目
          </div>
        )}
      </div>
    </div>
  );
}
