'use client';

import { Rss, MousePointerClick, FileText, Globe, GitBranch } from 'lucide-react';

export type Tab = 'rss' | 'selection' | 'draft' | 'publish' | 'workflow';

const TABS: { id: Tab; label: string; Icon: React.FC<{ className?: string }> }[] = [
  { id: 'rss',       label: 'RSS Feeds',  Icon: Rss },
  { id: 'selection', label: 'Selection',  Icon: MousePointerClick },
  { id: 'draft',     label: 'Draft',      Icon: FileText },
  { id: 'publish',   label: 'Publish',    Icon: Globe },
  { id: 'workflow',  label: 'Workflow',   Icon: GitBranch },
];

interface Props {
  active: Tab;
  onChange: (tab: Tab) => void;
}

export default function TabNav({ active, onChange }: Props) {
  return (
    <nav className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
      {TABS.map(({ id, label, Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors
            ${
              active === id
                ? 'bg-gray-100 text-gray-900 border-b-2 border-brand-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
        >
          <Icon className="w-4 h-4" />
          {label}
        </button>
      ))}
    </nav>
  );
}
