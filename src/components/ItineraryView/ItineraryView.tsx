import type { TripPlan } from '../../types/trip.types';
import { DayColumn } from './DayColumn';

interface ItineraryViewProps {
  plan: TripPlan;
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
}

/**
 * Full itinerary view rendering all days with diff highlights.
 * Uses aria-live="polite" so screen readers announce updates.
 */
export function ItineraryView({ plan, changedActivityIds, removedActivityIds, addedActivityIds }: ItineraryViewProps) {
  return (
    <section aria-live="polite" aria-label="Trip itinerary">
      {/* Sticky itinerary header */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            📍 {plan.destination}
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {plan.days.length} days · ₹{plan.totalBudgetINR.toLocaleString('en-IN')}
          </span>
          {plan.constraints.map((c) => (
            <span key={c} className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-full">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Days */}
      <div>
        {plan.days.map((day) => (
          <DayColumn
            key={day.dayNumber}
            day={day}
            destination={plan.destination}
            changedActivityIds={changedActivityIds}
            removedActivityIds={removedActivityIds}
            addedActivityIds={addedActivityIds}
          />
        ))}
      </div>
    </section>
  );
}
