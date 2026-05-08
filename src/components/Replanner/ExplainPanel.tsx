import type { ReplanResult } from '../../types/trip.types';
import { DISRUPTION_LABELS } from '../../constants/disruptions';

interface ExplainPanelProps {
  replanResult: ReplanResult;
}

export function ExplainPanel({ replanResult }: ExplainPanelProps) {
  const { reasoning, disruptionDetected } = replanResult;
  const label = DISRUPTION_LABELS[disruptionDetected];

  return (
    <details className="bg-white border border-gray-200 rounded-xl overflow-hidden group shadow-sm">
      <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center justify-between list-none">
        <span>💡 Why did Wayshift change this?</span>
        <svg className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </summary>
      <div className="px-4 pb-4 space-y-3 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-[#FBBC04]" />
          <span className="text-xs font-medium text-gray-600">
            Disruption detected: <span className="text-[#EA4335] font-semibold">{label}</span>
          </span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{reasoning}</p>
      </div>
    </details>
  );
}
