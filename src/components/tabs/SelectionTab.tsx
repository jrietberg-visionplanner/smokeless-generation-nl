'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles, CheckSquare, Square } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  source: string;
  category: string;
  location: string;
  relevance: 'High' | 'Medium' | 'Low';
  recommended: boolean;
  selected: boolean;
  date: string;
}

const NEWS_ITEMS: NewsItem[] = [
  { id: '1',  title: 'New Smoke-Free Zones Announced in Amsterdam',        source: 'NOS',         category: 'Government', location: 'Amsterdam',   relevance: 'High',   recommended: true,  selected: false, date: 'Today 08:12' },
  { id: '2',  title: 'Study: E-cigarette Use Among Teens Rises 18%',       source: 'RIVM',        category: 'Health',     location: 'Netherlands', relevance: 'High',   recommended: true,  selected: false, date: 'Today 07:45' },
  { id: '3',  title: 'Parliament Votes on Tobacco Display Ban',            source: 'RTL Nieuws',  category: 'Government', location: 'Den Haag',    relevance: 'High',   recommended: true,  selected: false, date: 'Today 09:30' },
  { id: '4',  title: 'Vaping Flavour Regulation Under Review',             source: 'AD',          category: 'Policy',     location: 'Netherlands', relevance: 'High',   recommended: true,  selected: false, date: 'Today 06:55' },
  { id: '5',  title: 'Schools Launch Smoke-Free Campus Pledge',            source: 'Trouw',       category: 'Education',  location: 'Utrecht',     relevance: 'Medium', recommended: false, selected: false, date: 'Today 10:02' },
  { id: '6',  title: 'WHO Report on Youth Nicotine Addiction Published',   source: 'WHO',         category: 'Health',     location: 'International', relevance: 'High', recommended: true,  selected: false, date: 'Today 05:30' },
  { id: '7',  title: 'Supermarkets to Phase Out Tobacco Products by 2028', source: 'Nu.nl',       category: 'Retail',     location: 'Netherlands', relevance: 'Medium', recommended: true,  selected: false, date: 'Yesterday' },
  { id: '8',  title: 'Anti-Smoking Campaign Reaches 2 Million Views',      source: 'Volkskrant',  category: 'Campaigns',  location: 'Netherlands', relevance: 'High',   recommended: true,  selected: false, date: 'Today 11:15' },
];

const CATEGORIES = ['All Categories', 'Government', 'Health', 'Policy', 'Education', 'Campaigns', 'Retail'];
const LOCATIONS  = ['All Locations',  'Amsterdam', 'Den Haag', 'Netherlands', 'Utrecht', 'International'];
const RELEVANCES = ['All Relevance', 'High', 'Medium', 'Low'];

const RELEVANCE_COLOR: Record<string, string> = {
  High:   'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  Low:    'bg-gray-100 text-gray-500',
};

export default function SelectionTab() {
  const [items, setItems]       = useState<NewsItem[]>(NEWS_ITEMS);
  const [category, setCategory] = useState('All Categories');
  const [location, setLocation] = useState('All Locations');
  const [relevance, setRelevance] = useState('All Relevance');

  const filtered = items.filter(item => {
    if (category !== 'All Categories' && item.category !== category) return false;
    if (location  !== 'All Locations'  && item.location  !== location)  return false;
    if (relevance !== 'All Relevance'  && item.relevance !== relevance)  return false;
    return true;
  });

  const recommended = items.filter(i => i.recommended).length;
  const selected    = items.filter(i => i.selected).length;

  function toggleSelect(id: string) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, selected: !i.selected } : i));
  }

  const selectedCount = filtered.filter(i => i.selected).length;

  return (
    <div className="space-y-5">
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">News Selection &amp; Review</h2>
        <p className="text-sm text-gray-500 mb-5">
          Review AI-categorized news items and select relevant articles for processing
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-5">
          {[
            { value: category, options: CATEGORIES, onChange: setCategory },
            { value: location, options: LOCATIONS,  onChange: setLocation },
            { value: relevance, options: RELEVANCES, onChange: setRelevance },
          ].map(({ value, options, onChange }, idx) => (
            <div key={idx} className="relative">
              <select
                value={value}
                onChange={e => onChange(e.target.value)}
                className="appearance-none border border-gray-200 rounded-md pl-3 pr-8 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                {options.map(o => <option key={o}>{o}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Total Items Today</p>
            <p className="text-3xl font-bold text-gray-900">{items.length * 19 + 8}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">AI Recommended</p>
            <p className="text-3xl font-bold text-brand-700">{recommended}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-xs text-gray-500 mb-1">Selected</p>
            <p className="text-3xl font-bold text-gray-900">{selected}</p>
          </div>
        </div>

        {/* News Items */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">News Items for Review</h3>
          <div className="divide-y divide-gray-100">
            {filtered.map(item => (
              <div
                key={item.id}
                className="py-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded"
                onClick={() => toggleSelect(item.id)}
              >
                <div className="mt-0.5 flex-shrink-0 text-brand-600">
                  {item.selected
                    ? <CheckSquare className="w-5 h-5" />
                    : <Square className="w-5 h-5 text-gray-300" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-400">
                    {item.source} &bull; {item.location} &bull; {item.date}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {item.recommended && (
                    <span className="flex items-center gap-1 text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                      <Sparkles className="w-3 h-3" /> AI
                    </span>
                  )}
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${RELEVANCE_COLOR[item.relevance]}`}>
                    {item.relevance}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom action */}
      <div className="flex justify-end">
        <button
          disabled={selectedCount === 0}
          className="bg-brand-700 hover:bg-brand-800 disabled:opacity-40 text-white text-sm font-medium px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Sparkles className="w-4 h-4" />
          Generate Articles ({selectedCount})
        </button>
      </div>
    </div>
  );
}
