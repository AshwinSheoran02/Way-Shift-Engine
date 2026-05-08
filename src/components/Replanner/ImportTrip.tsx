import { useState, useCallback } from 'react';

interface ImportTripProps {
  onImport: (rawText: string) => void;
  loading: boolean;
}

export function ImportTrip({ onImport, loading }: ImportTripProps) {
  const [rawText, setRawText] = useState('');

  const handleSubmit = useCallback(() => {
    if (!rawText.trim() || loading) return;
    onImport(rawText.trim());
  }, [rawText, loading, onImport]);

  return (
    <details className="bg-white border border-gray-200 rounded-xl p-4 mx-4 mb-4 group">
      <summary className="cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2 list-none">
        📋 Import an existing trip
        <svg className="w-4 h-4 ml-auto transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="mt-3 space-y-3">
        <p className="text-xs text-gray-500">
          Paste your trip plan in any format — bullet points, paragraphs, or another AI&apos;s output.
        </p>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Day 1: Visit Amber Fort, lunch at 1135 AD..."
          aria-label="Paste your existing trip plan"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4285F4] text-sm resize-y"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!rawText.trim() || loading}
          className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            !rawText.trim() || loading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-[#4285F4] hover:bg-[#3367D6] text-white'
          }`}
        >
          {loading ? 'Parsing...' : '📥 Parse and Load Trip'}
        </button>
      </div>
    </details>
  );
}
