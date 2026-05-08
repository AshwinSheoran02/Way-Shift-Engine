import type { Day } from '../../types/trip.types';
import { ActivityCard } from './ActivityCard';

interface DayColumnProps {
  day: Day;
  destination: string;
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
}

/**
 * Day wrapper component that renders a column of ActivityCards for a single day.
 * Uses light-first design with dark: variants.
 */
export function DayColumn({ day, destination, changedActivityIds, removedActivityIds, addedActivityIds }: DayColumnProps) {
  const getStatus = (activityId: string) => {
    if (changedActivityIds.includes(activityId)) return 'changed' as const;
    if (addedActivityIds.includes(activityId)) return 'added' as const;
    if (removedActivityIds.includes(activityId)) return 'removed' as const;
    return 'unchanged' as const;
  };

  return (
    <div className="animate-slide-up">
      {/* Day header */}
      <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-3 sticky top-[57px] z-10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
          {day.dayNumber}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
            Day {day.dayNumber}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{day.date}</p>
        </div>
      </div>

      {/* Activities */}
      <div className="px-4 py-2 flex flex-col gap-3">
        {day.activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            status={getStatus(activity.id)}
            destination={destination}
          />
        ))}
      </div>
    </div>
  );
}
