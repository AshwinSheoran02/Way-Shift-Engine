import { useState, useCallback } from 'react';

interface ImportTripProps {
  onImport: (rawText: string) => void;
  loading: boolean;
}

/**
 * Collapsible import trip section using <details>.
 * Supports pasting any format — bullet points, paragraphs, other AI output.
 */
export function ImportTrip({ onImport, loading }: ImportTripProps) {
  const [rawText, setRawText] = useState('');

  const handleSubmit = useCallback(() => {
    if (!rawText.trim() || loading) return;
    onImport(rawText.trim());
  }, [rawText, loading, onImport]);

  return (
    <details className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 mx-4 mb-4 animate-fade-in group">
      <summary className="cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-2 list-none">
        <span>📋</span>
        <span>Import an existing trip</span>
        <svg
          className="w-4 h-4 ml-auto transition-transform duration-200 group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="mt-3 space-y-3">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Paste your trip plan in any format — bullet points, paragraphs, or another AI&apos;s output.
        </p>
        <textarea
          value={rawText}
          onChange={(e) => setRawText(e.target.value)}
          placeholder="Day 1: Visit Amber Fort, lunch at 1135 AD..."
          aria-label="Paste your existing trip plan"
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-y"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!rawText.trim() || loading}
          className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
            !rawText.trim() || loading
              ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {loading ? 'Parsing...' : '📥 Parse and Load Trip'}
        </button>
      </div>
    </details>
  );
}
