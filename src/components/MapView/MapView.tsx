import { useMemo } from 'react';
import type { TripPlan } from '../../types/trip.types';
import { buildMapsEmbedUrl } from '../../services/mapsService';

interface MapViewProps {
  plan: TripPlan;
  selectedDay?: number;
}

/**
 * Google Maps embed iframe showing the first activity of the selected day.
 * Has fallback text if iframe fails to load.
 */
export function MapView({ plan, selectedDay = 1 }: MapViewProps) {
  const { embedUrl, locationName } = useMemo(() => {
    const day = plan.days.find((d) => d.dayNumber === selectedDay) ?? plan.days[0];
    const firstActivity = day?.activities[0];
    if (!firstActivity) {
      return { embedUrl: '', locationName: plan.destination };
    }
    return {
      embedUrl: buildMapsEmbedUrl(firstActivity.location, plan.destination),
      locationName: firstActivity.location,
    };
  }, [plan, selectedDay]);

  if (!embedUrl) {
    return (
      <div className="glass rounded-xl p-6 text-center text-[var(--color-text-muted)] text-sm">
        No location available to display on map.
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/5 flex items-center gap-2">
        <span className="text-sm">🗺️</span>
        <h3 className="text-xs font-medium text-[var(--color-text-secondary)]">
          Day {selectedDay} · {locationName}
        </h3>
      </div>
      <div className="relative aspect-video bg-[var(--color-bg-card)]">
        <iframe
          src={embedUrl}
          title={`Map of ${locationName}`}
          className="absolute inset-0 w-full h-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
        {/* Fallback text for failed iframe */}
        <noscript>
          <p className="absolute inset-0 flex items-center justify-center text-[var(--color-text-muted)] text-sm">
            Map requires JavaScript to load. Visit Google Maps directly.
          </p>
        </noscript>
      </div>
    </div>
  );
}
