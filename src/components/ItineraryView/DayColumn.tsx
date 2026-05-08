import type { Day } from '../../types/trip.types';
import { ActivityCard } from './ActivityCard';
import { buildDayRouteUrl } from '../../services/mapsService';
import { estimateTransport } from '../../utils/transport';

interface DayColumnProps {
  day: Day;
  destination: string;
  dailyBudget: number;
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
}

export function DayColumn({ day, destination, dailyBudget, changedActivityIds, removedActivityIds, addedActivityIds }: DayColumnProps) {
  const getStatus = (activityId: string) => {
    if (changedActivityIds.includes(activityId)) return 'changed' as const;
    if (addedActivityIds.includes(activityId)) return 'added' as const;
    if (removedActivityIds.includes(activityId)) return 'removed' as const;
    return 'unchanged' as const;
  };

  const dayTotal = day.activities.reduce((sum, a) => sum + a.costINR, 0);
  const budgetRatio = dayTotal / dailyBudget;
  
  // Logic: < 75% Green, 75-90% Yellow, > 90% Red
  const budgetColor = budgetRatio < 0.75 
    ? 'text-[#34A853]' 
    : budgetRatio <= 0.9 
      ? 'text-[#FBBC04]' 
      : 'text-[#EA4335]';

  const routeUrl = buildDayRouteUrl(day.activities.map(a => a.location), destination);

  return (
    <div className="animate-slide-up">
      {/* Day header */}
      <div className="bg-gray-50 px-6 py-3 sticky top-[57px] z-10 flex items-center gap-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-[#4285F4] text-white text-sm font-bold flex items-center justify-center">
          {day.dayNumber}
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Day {day.dayNumber}</h3>
          <p className="text-xs text-gray-500">{day.date}</p>
        </div>
        <div className="ml-auto flex flex-col items-end gap-1">
          <p className={`text-[10px] font-bold uppercase tracking-tight ${budgetColor}`}>
            ₹{dayTotal.toLocaleString('en-IN')} / ₹{dailyBudget.toLocaleString('en-IN')}
          </p>
          {routeUrl && (
            <a
              href={routeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-[#4285F4] hover:underline flex items-center gap-1"
            >
              🗺️ Open Day Route
            </a>
          )}
        </div>
      </div>

      <div className="px-4 py-3 flex flex-col">
        {day.activities.map((activity, index) => (
          <div key={activity.id}>
            <ActivityCard
              activity={activity}
              status={getStatus(activity.id)}
              destination={destination}
            />
            {index < day.activities.length - 1 && (
              <div className="py-2 flex items-center justify-center">
                <div className="h-4 w-[1px] bg-gray-200 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 whitespace-nowrap text-[9px] font-medium text-gray-400 italic">
                    {estimateTransport(activity, day.activities[index + 1])}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
