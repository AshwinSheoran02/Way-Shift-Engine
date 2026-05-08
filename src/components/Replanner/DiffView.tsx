import type { ReplanResult } from '../../types/trip.types';
import { CATEGORY_EMOJI } from '../../constants/categories';

interface DiffViewProps {
  replanResult: ReplanResult;
}

/**
 * Shows a compact before/after comparison of changed activities.
 * Uses color borders AND text badges for accessibility (never color alone).
 */
export function DiffView({ replanResult }: DiffViewProps) {
  const { updatedPlan, changedActivityIds, removedActivityIds, addedActivityIds } = replanResult;

  // Collect all affected activities
  const affectedActivities = updatedPlan.days.flatMap((day) =>
    day.activities
      .filter((a) =>
        changedActivityIds.includes(a.id) ||
        addedActivityIds.includes(a.id)
      )
      .map((a) => ({
        ...a,
        dayNumber: day.dayNumber,
        status: changedActivityIds.includes(a.id) ? 'changed' as const
          : 'added' as const,
      }))
  );

  // Add removed activities (from the result metadata)
  const removedItems = removedActivityIds.map((id) => ({
    id,
    title: `Activity ${id}`,
    status: 'removed' as const,
  }));

  if (affectedActivities.length === 0 && removedItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700">
        <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Changes to your plan
        </h4>
      </div>
      <div className="p-3 space-y-2">
        {/* Changed activities */}
        {affectedActivities.map((activity) => (
          <div
            key={activity.id}
            className={`rounded-lg p-3 transition-all border-l-3 ${
              activity.status === 'changed'
                ? 'border-l-amber-400 bg-amber-50 dark:bg-amber-900/10'
                : 'border-l-green-400 bg-green-50 dark:bg-green-900/10'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                activity.status === 'changed'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'
                  : 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300'
              }`}>
                {activity.status === 'changed' ? '⚡ Modified' : '+ Added'}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500">Day {activity.dayNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{CATEGORY_EMOJI[activity.category]}</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">
                {activity.time} — {activity.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 ml-7">
              📍 {activity.location}
            </p>
          </div>
        ))}

        {/* Removed activities */}
        {removedItems.map((item) => (
          <div key={item.id} className="border-l-3 border-l-red-400 bg-red-50 dark:bg-red-900/10 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                ✕ Removed
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 line-through ml-7">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
