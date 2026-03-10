'use client';

import { useState } from 'react';
import { CheckCircle2, Edit3, Zap, Clock, ExternalLink } from 'lucide-react';

interface Publication {
  id: string;
  title: string;
  status: 'Published' | 'Draft' | 'Pending';
  time: string;
}

const RECENT: Publication[] = [
  { id: '1', title: 'No to Vaping Campaign Launched',               status: 'Published', time: '2 hours ago' },
  { id: '2', title: 'Parliament Votes on Tobacco Display Ban',       status: 'Draft',     time: '4 hours ago' },
  { id: '3', title: 'Teen E-cigarette Use Rises 18% – RIVM Report', status: 'Published', time: 'Yesterday' },
  { id: '4', title: 'Supermarkets to Phase Out Tobacco by 2028',     status: 'Pending',   time: 'Today 11:00' },
];

const STATUS_STYLES: Record<string, string> = {
  Published: 'bg-green-100 text-green-700',
  Draft:     'bg-gray-100 text-gray-600',
  Pending:   'bg-yellow-100 text-yellow-700',
};

export default function PublishTab() {
  const [mode, setMode] = useState<'manual' | 'auto'>('manual');
  const [publishing, setPublishing] = useState(false);
  const [pubs, setPubs] = useState<Publication[]>(RECENT);

  async function handlePublish() {
    setPublishing(true);
    await new Promise(r => setTimeout(r, 1500));
    setPublishing(false);
    setPubs(prev => [
      { id: Date.now().toString(), title: 'New Article Published via AI Workflow', status: 'Published', time: 'Just now' },
      ...prev,
    ]);
  }

  return (
    <div className="space-y-5">
      {/* CMS Status */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">CMS Publishing Interface</h2>

        <div className="mt-4 bg-brand-50 border border-brand-200 rounded-lg px-4 py-3 flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-brand-900">Connected to Joomla CMS</p>
            <p className="text-sm text-brand-700">
              System is ready to{' '}
              <span className="underline cursor-pointer">publish articles</span>
            </p>
          </div>
        </div>

        {/* Mode selector */}
        <div className="grid grid-cols-2 gap-4 mt-5">
          <button
            onClick={() => setMode('manual')}
            className={`rounded-lg p-4 border-2 text-left transition ${
              mode === 'manual'
                ? 'border-brand-600 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Edit3 className={`w-4 h-4 ${mode === 'manual' ? 'text-brand-700' : 'text-gray-500'}`} />
              <p className="text-sm font-semibold text-gray-900">Manual Editing</p>
            </div>
            <p className="text-xs text-gray-500">Review and edit articles before publishing</p>
          </button>

          <button
            onClick={() => setMode('auto')}
            className={`rounded-lg p-4 border-2 text-left transition ${
              mode === 'auto'
                ? 'border-brand-600 bg-brand-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap className={`w-4 h-4 ${mode === 'auto' ? 'text-brand-700' : 'text-gray-500'}`} />
              <p className="text-sm font-semibold text-gray-900">Auto-publish</p>
            </div>
            <p className="text-xs text-gray-500">Articles automatically pushed to CMS draft</p>
          </button>
        </div>

        {/* Publish button */}
        <div className="mt-5">
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="w-full bg-brand-700 hover:bg-brand-800 disabled:opacity-60 text-white text-sm font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
          >
            {publishing ? (
              <><span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Publishing...</>
            ) : (
              <><CheckCircle2 className="w-4 h-4" /> Publish to Joomla CMS</>
            )}
          </button>
        </div>
      </section>

      {/* Recent Publications */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-4">Recent Publications</h2>
        <div className="divide-y divide-gray-100">
          {pubs.map(pub => (
            <div key={pub.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{pub.title}</p>
                  <p className="text-xs text-gray-400">{pub.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLES[pub.status]}`}>
                  {pub.status}
                </span>
                <button className="text-gray-400 hover:text-brand-700 transition">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
