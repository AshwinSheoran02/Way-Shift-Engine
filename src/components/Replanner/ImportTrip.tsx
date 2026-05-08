import { useState, useCallback } from 'react';

interface ImportTripProps {
  onImport: (rawText: string) => void;
  loading: boolean;
}

/**
 * Text area where users can paste an existing trip description.
 * Supports any format — bullet points, paragraphs, other AI output.
 */
export function ImportTrip({ onImport, loading }: ImportTripProps) {
  const [rawText, setRawText] = useState('');

  const handleSubmit = useCallback(() => {
    if (!rawText.trim() || loading) return;
    onImport(rawText.trim());
  }, [rawText, loading, onImport]);

  return (
    <div className="glass rounded-xl p-4 space-y-3 animate-fade-in">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">📋</span>
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">
          Import an existing trip
        </h3>
      </div>
      <p className="text-xs text-[var(--color-text-muted)]">
        Paste your trip plan in any format — bullet points, paragraphs, or another AI's output.
      </p>
      <textarea
        value={rawText}
        onChange={(e) => setRawText(e.target.value)}
        placeholder="Day 1: Visit Amber Fort, lunch at 1135 AD..."
        aria-label="Paste your existing trip plan"
        rows={4}
        className="w-full px-4 py-3 rounded-xl bg-[var(--color-bg-card)] border border-white/10 text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-accent-mid)] transition-colors text-sm resize-y"
      />
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!rawText.trim() || loading}
        className={`w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-200 ${
          !rawText.trim() || loading
            ? 'bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] cursor-not-allowed'
            : 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] border border-white/10 hover:border-[var(--color-accent-mid)]/50 active:scale-[0.98]'
        }`}
      >
        {loading ? 'Parsing...' : '📥 Parse and Load Trip'}
      </button>
    </div>
  );
}
