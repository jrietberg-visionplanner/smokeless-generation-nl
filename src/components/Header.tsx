import { Rss } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Logo & App name */}
        <div className="flex items-center gap-3">
          <div className="bg-brand-700 text-white rounded-md p-2">
            <Rss className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 leading-tight">Newsletter AI Assistant</p>
            <p className="text-xs text-gray-500">Smokeless Generation NL</p>
          </div>
        </div>

        {/* Right: Publication info */}
        <div className="text-right">
          <p className="font-semibold text-gray-900 text-sm">Opgelucht Newsletter</p>
          <p className="text-xs text-gray-500">50,000 circulation</p>
        </div>
      </div>
    </header>
  );
}
