'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import TabNav, { Tab } from '@/components/TabNav';
import RssFeedsTab from '@/components/tabs/RssFeedsTab';
import SelectionTab from '@/components/tabs/SelectionTab';
import DraftTab from '@/components/tabs/DraftTab';
import PublishTab from '@/components/tabs/PublishTab';
import WorkflowTab from '@/components/tabs/WorkflowTab';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>('selection');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          AI-Assisted Newsletter Workflow
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Streamline your newsletter creation with automated RSS feed processing,
          intelligent categorization, and seamless CMS publishing.
        </p>

        <TabNav active={activeTab} onChange={setActiveTab} />

        <div className="mt-6">
          {activeTab === 'rss'       && <RssFeedsTab />}
          {activeTab === 'selection' && <SelectionTab />}
          {activeTab === 'draft'     && <DraftTab />}
          {activeTab === 'publish'   && <PublishTab />}
          {activeTab === 'workflow'  && <WorkflowTab />}
        </div>
      </main>
    </div>
  );
}
