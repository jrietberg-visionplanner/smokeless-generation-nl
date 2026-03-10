'use client';

import { useState } from 'react';
import { Sparkles, ChevronLeft, ChevronRight, Save, Send } from 'lucide-react';

const MAX_TITLE = 36;

interface Draft {
  id: string;
  category: string;
  classification: string;
  charCount: number;
  sources: number;
  title: string;
  intro: string;
  summary: string;
}

const DRAFTS: Draft[] = [
  {
    id: '1',
    category: 'Government',
    classification: 'Domestic',
    charCount: 1847,
    sources: 8,
    title: 'No to Vaping',
    intro:
      'The Dutch government has announced sweeping new regulations targeting the sale and marketing of vaping products, effective from Q3 2026. The measures aim to curb the rising uptake of e-cigarettes among young people.',
    summary:
      'New government policy restricts flavoured vaping products and imposes strict packaging rules. Health Minister confirmed that enforcement will begin immediately in retail outlets. NGOs including Smokeless Generation NL have welcomed the announcement, calling it a significant step toward a smoke-free generation.',
  },
  {
    id: '2',
    category: 'Health',
    classification: 'International',
    charCount: 1523,
    sources: 5,
    title: 'Teen Vaping Up 18%',
    intro:
      'A new RIVM study reveals that e-cigarette usage among Dutch teenagers has increased by 18% in the past year, raising urgent concerns among public health officials.',
    summary:
      'The research highlights social media influence as a primary driver of adoption. Experts call for tighter age-verification requirements and school-based awareness campaigns as immediate countermeasures.',
  },
  {
    id: '3',
    category: 'Government',
    classification: 'Domestic',
    charCount: 2104,
    sources: 6,
    title: 'Tobacco Display Ban Vote',
    intro:
      'Parliament is set to vote on a bill that would prohibit the public display of tobacco products in all retail environments across the Netherlands.',
    summary:
      'Proponents argue the ban aligns the Netherlands with neighbours such as the United Kingdom and Ireland. Retail associations have raised concerns about implementation costs, while health advocates project a 12% decline in impulse purchases.',
  },
];

export default function DraftTab() {
  const [index, setIndex] = useState(0);
  const [drafts, setDrafts] = useState<Draft[]>(DRAFTS);
  const [saved, setSaved]   = useState<Record<string, boolean>>({});

  const draft = drafts[index];

  function update(field: keyof Draft, value: string) {
    setDrafts(prev =>
      prev.map((d, i) => (i === index ? { ...d, [field]: value } : d)),
    );
  }

  async function saveDraft() {
    setSaved(prev => ({ ...prev, [draft.id]: true }));
    await new Promise(r => setTimeout(r, 800));
  }

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="font-semibold text-gray-900">Article Draft Preview</h2>
            <p className="text-sm text-gray-500">
              AI-generated article following standard format: title, intro, summary, sources
            </p>
          </div>
          {/* Pager */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIndex(i => Math.max(0, i - 1))}
              disabled={index === 0}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600">
              {index + 1} / {drafts.length}
            </span>
            <button
              onClick={() => setIndex(i => Math.min(drafts.length - 1, i + 1))}
              disabled={index === drafts.length - 1}
              className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* AI badge */}
        <div className="mt-5 bg-brand-50 border border-brand-200 rounded-lg p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-brand-900">AI-Generated Draft</p>
            <p className="text-sm text-brand-700">
              This article was automatically generated from {draft.sources} sources and follows
              the standard pattern defined in your workflow.
            </p>
          </div>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-3 gap-4 mt-5">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Category</label>
            <div className="bg-brand-800 text-white text-sm font-medium rounded-md py-2 px-3 text-center">
              {draft.category}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Classification</label>
            <div className="bg-brand-600 text-white text-sm font-medium rounded-md py-2 px-3 text-center">
              {draft.classification}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">Character Count</label>
            <div className="border border-gray-200 text-sm text-gray-700 rounded-md py-2 px-3 text-right">
              {draft.charCount.toLocaleString()} chars
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              Title <span className="text-gray-400 font-normal">(max {MAX_TITLE} characters)</span>
            </label>
            <span className={`text-xs ${
              draft.title.length > MAX_TITLE ? 'text-red-500' : 'text-gray-400'
            }`}>
              {draft.title.length} / {MAX_TITLE}
            </span>
          </div>
          <input
            type="text"
            maxLength={MAX_TITLE}
            value={draft.title}
            onChange={e => update('title', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Intro */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Introduction</label>
          <textarea
            rows={3}
            value={draft.intro}
            onChange={e => update('intro', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Summary */}
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Summary</label>
          <textarea
            rows={4}
            value={draft.summary}
            onChange={e => update('summary', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={saveDraft}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <Save className="w-4 h-4" />
            {saved[draft.id] ? 'Saved' : 'Save Draft'}
          </button>
          <button className="flex items-center gap-2 bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
            <Send className="w-4 h-4" />
            Send to Publish
          </button>
        </div>
      </section>
    </div>
  );
}
