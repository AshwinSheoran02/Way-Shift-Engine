import { memo, useMemo } from 'react';
import type { ReplanResult, TripPlan, Activity } from '../../types/trip.types';
import { CATEGORY_EMOJI } from '../../constants/categories';

interface DiffViewProps {
  replanResult: ReplanResult;
  previousPlan?: TripPlan;
}

/**
 * Visualizes the difference between the previous plan and the replanned version.
 * Highlights added, modified, and removed activities.
 */
export const DiffView = memo(({ replanResult, previousPlan }: DiffViewProps) => {
  const { updatedPlan, changedActivityIds, removedActivityIds, addedActivityIds } = replanResult;

  const affectedActivities = useMemo(() => 
    updatedPlan.days.flatMap((day) =>
      day.activities
        .filter((a) => changedActivityIds.includes(a.id) || addedActivityIds.includes(a.id))
        .map((a) => ({
          ...a,
          dayNumber: day.dayNumber,
          status: changedActivityIds.includes(a.id) ? 'changed' as const : 'added' as const,
        }))
    ),
    [updatedPlan, changedActivityIds, addedActivityIds]
  );

  const previousActivityMap = useMemo(() => {
    const map = new Map<string, Activity>();
    if (!previousPlan) return map;
    previousPlan.days.forEach(day =>
      day.activities.forEach(act => map.set(act.id, act))
    );
    return map;
  }, [previousPlan]);

  const removedItems = useMemo(() => 
    removedActivityIds.map((id) => {
      const activity = previousActivityMap.get(id);
      return {
        id,
        title: activity?.title ?? `Activity ${id}`,
        status: 'removed' as const,
      };
    }),
    [removedActivityIds, previousActivityMap]
  );

  if (affectedActivities.length === 0 && removedItems.length === 0) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-2.5 border-b border-gray-200 bg-gray-50">
        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Changes to your plan
        </h4>
      </div>
      <div className="p-3 space-y-2">
        {affectedActivities.map((activity) => (
          <div
            key={activity.id}
            className={`rounded-lg p-3 border-l-3 ${
              activity.status === 'changed'
                ? 'border-l-[#FBBC04] bg-[#FBBC04]/5'
                : 'border-l-[#34A853] bg-[#34A853]/5'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                activity.status === 'changed'
                  ? 'bg-[#FBBC04]/15 text-[#F29900]'
                  : 'bg-[#34A853]/15 text-[#34A853]'
              }`}>
                {activity.status === 'changed' ? '⚡ Modified' : '+ Added'}
              </span>
              <span className="text-[10px] text-gray-400">Day {activity.dayNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{CATEGORY_EMOJI[activity.category]}</span>
              <span className="text-sm font-medium text-gray-900">
                {activity.time} — {activity.title}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-7">📍 {activity.location}</p>
          </div>
        ))}

        {removedItems.map((item) => (
          <div key={item.id} className="border-l-3 border-l-[#EA4335] bg-[#EA4335]/5 rounded-lg p-3">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#EA4335]/15 text-[#EA4335]">
              ✕ Removed
            </span>
            <p className="text-sm text-gray-500 line-through ml-7 mt-1">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
});
