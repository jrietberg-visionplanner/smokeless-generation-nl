'use client';

import { useState } from 'react';
import {
  Rss, Sparkles, User, FileText, CheckCircle2, Globe,
  ArrowDown, Settings,
} from 'lucide-react';

type StepType = 'automated' | 'manual';

interface WorkflowStep {
  id: string;
  type: StepType;
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  stats?: string[];
}

const STEPS: WorkflowStep[] = [
  {
    id: 'rss',
    type: 'automated',
    icon: Rss,
    title: 'RSS Feed Collection',
    description: 'Google Alerts RSS feeds automatically collected',
    stats: ['15 active RSS feeds', 'Daily automatic refresh', 'Average 150 items per day'],
  },
  {
    id: 'categorize',
    type: 'automated',
    icon: Sparkles,
    title: 'AI Categorization',
    description: 'Articles categorized and scored for relevance by AI',
    stats: ['Category classification', 'Relevance scoring 1–10', 'Duplicate detection'],
  },
  {
    id: 'selection',
    type: 'manual',
    icon: User,
    title: 'Editorial Selection',
    description: 'Editor reviews AI recommendations and selects articles',
    stats: ['AI recommendations highlighted', 'Filter by category / location', 'Batch select supported'],
  },
  {
    id: 'draft',
    type: 'automated',
    icon: FileText,
    title: 'Article Generation',
    description: 'AI drafts articles from selected news items',
    stats: ['Title, intro & summary', 'Multi-source synthesis', 'Standardised format'],
  },
  {
    id: 'review',
    type: 'manual',
    icon: CheckCircle2,
    title: 'Editorial Review',
    description: 'Editor reviews and refines generated drafts',
    stats: ['Inline text editing', 'Character count tracking', 'Save & iterate'],
  },
  {
    id: 'publish',
    type: 'automated',
    icon: Globe,
    title: 'CMS Publishing',
    description: 'Approved articles pushed to Joomla CMS',
    stats: ['Direct Joomla integration', 'Manual or auto-publish', 'Publication history'],
  },
];

const TYPE_STYLES: Record<StepType, { badge: string; border: string; icon: string }> = {
  automated: {
    badge:  'bg-brand-100 text-brand-800',
    border: 'border-brand-300',
    icon:   'bg-brand-700 text-white',
  },
  manual: {
    badge:  'bg-purple-100 text-purple-800',
    border: 'border-purple-300',
    icon:   'bg-purple-600 text-white',
  },
};

export default function WorkflowTab() {
  const [filter, setFilter] = useState<'all' | StepType>('all');

  const visible = STEPS.filter(s => filter === 'all' || s.type === filter);

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-gray-900 mb-1">Complete Workflow Overview</h2>
            <p className="text-sm text-gray-500">
              Visualization of automated and manual steps in the newsletter creation process
            </p>
          </div>
          <Settings className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
        </div>

        {/* Filter toggle */}
        <div className="mt-5 flex gap-2">
          {(['all', 'automated', 'manual'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-sm px-4 py-1.5 rounded-full border transition ${
                filter === f
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400'
              }`}
            >
              {f === 'all' ? 'All Steps' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="mt-6 space-y-3">
          {visible.map((step, i) => {
            const styles = TYPE_STYLES[step.type];
            return (
              <div key={step.id}>
                <div className={`border-2 ${styles.border} rounded-xl p-4`}>
                  <div className="flex items-start gap-4">
                    <div className={`${styles.icon} rounded-lg p-2.5 flex-shrink-0`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-gray-900">{step.title}</p>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.badge}`}>
                          {step.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{step.description}</p>
                      {step.stats && (
                        <div className="flex flex-wrap gap-2">
                          {step.stats.map(stat => (
                            <span key={stat} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
                              {stat}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {i < visible.length - 1 && (
                  <div className="flex justify-center my-1">
                    <ArrowDown className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-brand-600 inline-block" />
          Automated step
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-purple-600 inline-block" />
          Manual step
        </span>
      </div>
    </div>
  );
}
