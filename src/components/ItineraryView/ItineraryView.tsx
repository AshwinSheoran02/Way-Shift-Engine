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
    <section aria-live="polite" aria-label="Trip itinerary" className="space-y-8">
      {/* Plan header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            📍 {plan.destination}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {plan.days.length} days · Budget: ₹{plan.totalBudgetINR.toLocaleString('en-IN')}
          </p>
        </div>
        {plan.constraints.length > 0 && (
          <div className="flex gap-1.5">
            {plan.constraints.map((c) => (
              <span key={c} className="text-[10px] px-2 py-1 rounded-full bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border border-white/5">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Days */}
      <div className="space-y-8">
        {plan.days.map((day) => (
          <DayColumn
            key={day.dayNumber}
            day={day}
            changedActivityIds={changedActivityIds}
            removedActivityIds={removedActivityIds}
            addedActivityIds={addedActivityIds}
          />
        ))}
      </div>
    </section>
  );
}
