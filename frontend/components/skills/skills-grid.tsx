/**
 * Skills Grid Component
 */
'use client';

import { Skill, SkillGroup } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SkillsGridProps {
  skills: Skill[];
  grouped?: boolean;
  groups?: SkillGroup[];
  compact?: boolean;
}

const proficiencyColors = {
  expert: 'bg-green-500',
  advanced: 'bg-blue-500',
  intermediate: 'bg-yellow-500',
  beginner: 'bg-orange-500',
  learning: 'bg-gray-400',
};

const proficiencyNames = {
  expert: '专家',
  advanced: '熟练',
  intermediate: '中级',
  beginner: '初级',
  learning: '学习中',
};

export function SkillsGrid({ skills, grouped = false, groups, compact = false }: SkillsGridProps) {
  const gridCols = compact ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  if (grouped && groups) {
    return (
      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.category}>
            <h3 className="text-lg font-semibold mb-4 text-foreground">
              {group.category_name}
            </h3>
            <div className={cn("grid gap-4", gridCols)}>
              {group.skills.map((skill) => (
                <SkillCard key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", gridCols)}>
      {skills.map((skill) => (
        <SkillCard key={skill.name} skill={skill} />
      ))}
    </div>
  );
}

function SkillCard({ skill }: { skill: Skill }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-card-foreground">{skill.name}</h4>
        <div
          className={cn(
            'w-2 h-2 rounded-full',
            proficiencyColors[skill.proficiency]
          )}
          title={proficiencyNames[skill.proficiency]}
        />
      </div>
      {skill.years_experience && (
        <p className="text-xs text-muted-foreground">
          {skill.years_experience} 年经验
        </p>
      )}
    </div>
  );
}
