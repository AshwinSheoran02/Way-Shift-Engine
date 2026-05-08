import type { TripPlan } from '../../types/trip.types';
import { DayColumn } from './DayColumn';
import { Footer } from '../Layout/Footer';

interface ItineraryViewProps {
  plan: TripPlan;
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
  onDownload?: () => void;
}

export function ItineraryView({ plan, changedActivityIds, removedActivityIds, addedActivityIds, onDownload }: ItineraryViewProps) {
  return (
    <section aria-live="polite" aria-label="Trip itinerary">
      {/* Sticky header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              📍 {plan.destination}
            </h2>
            <span className="text-xs text-gray-500">
              {plan.days.length} days · ₹{plan.totalBudgetINR.toLocaleString('en-IN')}
            </span>
            {plan.constraints.map((c) => (
              <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {c}
              </span>
            ))}
          </div>
          {onDownload && (
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-[#4285F4] bg-[#4285F4]/10 hover:bg-[#4285F4]/20 transition-colors"
              aria-label="Download trip plan"
            >
              📥 Save Plan
            </button>
          )}
        </div>
      </div>

      <div>
        {plan.days.map((day) => (
          <DayColumn
            key={day.dayNumber}
            day={day}
            destination={plan.destination}
            dailyBudget={Math.round(plan.totalBudgetINR / plan.days.length)}
            changedActivityIds={changedActivityIds}
            removedActivityIds={removedActivityIds}
            addedActivityIds={addedActivityIds}
          />
        ))}
      </div>
      <Footer />
    </section>
  );
}
