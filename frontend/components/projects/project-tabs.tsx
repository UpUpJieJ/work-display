/**
 * Project Category Tabs Component
 */
'use client';

import {
  FolderKanban,
  Globe,
  Download,
  BarChart3,
  Zap,
  Brain,
  Server,
  type LucideIcon,
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  { id: 'all', name: '全部项目', icon: FolderKanban },
  { id: 'web_development', name: 'Web 开发', icon: Globe },
  { id: 'web_scraping', name: '网络爬虫', icon: Download },
  { id: 'data_analysis', name: '数据分析', icon: BarChart3 },
  { id: 'automation', name: '自动化', icon: Zap },
  { id: 'machine_learning', name: '机器学习', icon: Brain },
  { id: 'api_development', name: 'API 开发', icon: Server },
];

interface ProjectTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProjectTabs({ activeCategory, onCategoryChange }: ProjectTabsProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${isActive
                ? 'bg-primary text-primary-foreground shadow-md scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted-foreground/10'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{category.name}</span>
          </button>
        );
      })}
    </div>
  );
}
