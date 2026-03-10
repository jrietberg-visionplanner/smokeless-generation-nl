'use client';

import { useState } from 'react';
import { Plus, RefreshCw, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface Feed {
  id: string;
  name: string;
  url: string;
  active: boolean;
  itemsToday: number;
}

const INITIAL_FEEDS: Feed[] = [
  { id: '1', name: 'Smoking',        url: 'https://alerts.google.com/alerts/feeds/...smoking',        active: true,  itemsToday: 42 },
  { id: '2', name: 'E-cigarettes',   url: 'https://alerts.google.com/alerts/feeds/...ecigarettes',   active: true,  itemsToday: 37 },
  { id: '3', name: 'Vaping',         url: 'https://alerts.google.com/alerts/feeds/...vaping',         active: true,  itemsToday: 29 },
  { id: '4', name: 'Tobacco Policy', url: 'https://alerts.google.com/alerts/feeds/...tobaccopolicy', active: true,  itemsToday: 24 },
  { id: '5', name: 'Youth Health',   url: 'https://alerts.google.com/alerts/feeds/...youthhealth',   active: false, itemsToday: 0  },
];

export default function RssFeedsTab() {
  const [feeds, setFeeds]     = useState<Feed[]>(INITIAL_FEEDS);
  const [name, setName]       = useState('');
  const [url, setUrl]         = useState('');
  const [error, setError]     = useState('');
  const [refreshing, setRefreshing] = useState(false);

  function addFeed() {
    if (!name.trim()) { setError('Feed name is required.'); return; }
    if (!url.trim())  { setError('RSS Feed URL is required.'); return; }
    setFeeds(prev => [
      ...prev,
      { id: Date.now().toString(), name: name.trim(), url: url.trim(), active: true, itemsToday: 0 },
    ]);
    setName('');
    setUrl('');
    setError('');
  }

  function removeFeed(id: string) {
    setFeeds(prev => prev.filter(f => f.id !== id));
  }

  function toggleFeed(id: string) {
    setFeeds(prev =>
      prev.map(f => (f.id === id ? { ...f, active: !f.active } : f)),
    );
  }

  async function handleRefresh() {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1200));
    setRefreshing(false);
  }

  const activeCount = feeds.filter(f => f.active).length;
  const totalItems  = feeds.reduce((s, f) => s + f.itemsToday, 0);

  return (
    <div className="space-y-6">
      {/* Add New Feed Card */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-semibold text-gray-900 mb-1">RSS Feed Management</h2>
        <p className="text-sm text-gray-500 mb-5">
          Manage Google Alerts RSS feeds for automated news collection
        </p>

        <div className="border border-dashed border-gray-300 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add New RSS Feed
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Feed Name</label>
              <input
                type="text"
                placeholder="e.g., Smoking"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">RSS Feed URL</label>
              <input
                type="url"
                placeholder="Paste Google Alerts RSS URL"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
          {error && (
            <p className="text-xs text-red-600 mb-2 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}
          <button
            onClick={addFeed}
            className="bg-brand-700 hover:bg-brand-800 text-white text-sm font-medium px-4 py-2 rounded-md flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Feed
          </button>
        </div>
      </section>

      {/* Active Feeds */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Active Feeds</h2>
            <p className="text-xs text-gray-500">
              {activeCount} active &nbsp;&bull;&nbsp; {totalItems} items today
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 text-sm text-brand-700 hover:text-brand-900 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh All
          </button>
        </div>

        <div className="divide-y divide-gray-100">
          {feeds.map(feed => (
            <div key={feed.id} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={() => toggleFeed(feed.id)}
                  title={feed.active ? 'Disable feed' : 'Enable feed'}
                  className="flex-shrink-0"
                >
                  <CheckCircle2
                    className={`w-5 h-5 transition-colors ${
                      feed.active ? 'text-brand-600' : 'text-gray-300'
                    }`}
                  />
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900">{feed.name}</p>
                  <p className="text-xs text-gray-400 truncate">{feed.url}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 flex-shrink-0">
                {feed.active && (
                  <span className="text-xs bg-brand-50 text-brand-700 font-medium px-2 py-0.5 rounded-full">
                    {feed.itemsToday} today
                  </span>
                )}
                <button
                  onClick={() => removeFeed(feed.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
