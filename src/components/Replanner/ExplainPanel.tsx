import type { ReplanResult } from '../../types/trip.types';
import { DISRUPTION_LABELS } from '../../constants/disruptions';

interface ExplainPanelProps {
  replanResult: ReplanResult;
}

/**
 * Expandable accordion explaining why changes were made.
 * Uses <details>/<summary> for native keyboard accessibility.
 */
export function ExplainPanel({ replanResult }: ExplainPanelProps) {
  const { reasoning, disruptionDetected } = replanResult;
  const label = DISRUPTION_LABELS[disruptionDetected];

  return (
    <details className="glass rounded-xl overflow-hidden group">
      <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors flex items-center justify-between list-none">
        <span>💡 Why did Wayshift change this?</span>
        <svg
          className="w-4 h-4 transition-transform duration-200 group-open:rotate-180"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>

      <div className="px-4 pb-4 space-y-3 animate-fade-in">
        {/* Disruption type badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-bg-elevated)] border border-white/5">
          <span className="w-2 h-2 rounded-full bg-[var(--color-diff-changed)]" />
          <span className="text-xs font-medium text-[var(--color-text-secondary)]">
            Disruption detected: <span className="text-[var(--color-warning-text)]">{label}</span>
          </span>
        </div>

        {/* Reasoning text */}
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {reasoning}
        </p>
      </div>
    </details>
  );
}
