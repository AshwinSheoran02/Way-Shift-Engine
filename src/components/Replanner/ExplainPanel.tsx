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
    <details className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden group">
      <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center justify-between list-none">
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
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
            Disruption detected: <span className="text-amber-600 dark:text-amber-400">{label}</span>
          </span>
        </div>

        {/* Reasoning text */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {reasoning}
        </p>
      </div>
    </details>
  );
}
