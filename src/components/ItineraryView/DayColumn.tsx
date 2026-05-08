import type { Day } from '../../types/trip.types';
import { ActivityCard } from './ActivityCard';

interface DayColumnProps {
  day: Day;
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
}

/**
 * Day wrapper component that renders a column of ActivityCards for a single day.
 */
export function DayColumn({ day, changedActivityIds, removedActivityIds, addedActivityIds }: DayColumnProps) {
  const getStatus = (activityId: string) => {
    if (changedActivityIds.includes(activityId)) return 'changed' as const;
    if (addedActivityIds.includes(activityId)) return 'added' as const;
    if (removedActivityIds.includes(activityId)) return 'removed' as const;
    return 'unchanged' as const;
  };

  return (
    <div className="animate-slide-up">
      {/* Day header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl gradient-accent text-white font-bold text-sm shadow-md shadow-purple-500/20">
          {day.dayNumber}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
            Day {day.dayNumber}
          </h3>
          <p className="text-xs text-[var(--color-text-muted)]">{day.date}</p>
        </div>
      </div>

      {/* Activities */}
      <div className="space-y-3 ml-5 border-l-2 border-white/5 pl-5">
        {day.activities.map((activity) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            status={getStatus(activity.id)}
          />
        ))}
      </div>
    </div>
  );
}
