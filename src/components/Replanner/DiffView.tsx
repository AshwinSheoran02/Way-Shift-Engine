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
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5">
        <h4 className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
          Changes to your plan
        </h4>
      </div>
      <div className="p-3 space-y-2">
        {/* Changed activities */}
        {affectedActivities.map((activity) => (
          <div
            key={activity.id}
            className={`rounded-lg p-3 transition-all ${
              activity.status === 'changed' ? 'diff-changed' : 'diff-added'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                activity.status === 'changed'
                  ? 'bg-amber-500/20 text-amber-300'
                  : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {activity.status === 'changed' ? '⚡ Modified' : '+ Added'}
              </span>
              <span className="text-[10px] text-[var(--color-text-muted)]">Day {activity.dayNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{CATEGORY_EMOJI[activity.category]}</span>
              <span className="text-sm font-medium text-[var(--color-text-primary)]">
                {activity.time} — {activity.title}
              </span>
            </div>
            <p className="text-xs text-[var(--color-text-muted)] mt-1 ml-7">
              📍 {activity.location}
            </p>
          </div>
        ))}

        {/* Removed activities */}
        {removedItems.map((item) => (
          <div key={item.id} className="diff-removed rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-500/20 text-red-300">
                ✕ Removed
              </span>
            </div>
            <p className="text-sm text-[var(--color-text-secondary)] line-through ml-7">
              {item.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
