import { memo, useState } from 'react';
import type { Activity } from '../../types/trip.types';
import { CATEGORY_EMOJI } from '../../constants/categories';
import { buildMapsEmbedUrl, buildMapsSearchUrl } from '../../services/mapsService';

type ActivityStatus = 'changed' | 'added' | 'removed' | 'unchanged';

interface ActivityCardProps {
  activity: Activity;
  status: ActivityStatus;
  destination: string;
}

/**
 * Activity card with expandable Google Maps. Light mode, Google colors.
 */
export const ActivityCard = memo(function ActivityCard({ activity, status, destination }: ActivityCardProps) {
  const [mapExpanded, setMapExpanded] = useState(false);

  const embedUrl = buildMapsEmbedUrl(activity.location, destination);
  const searchUrl = buildMapsSearchUrl(activity.location, destination);

  const cardClasses: Record<ActivityStatus, string> = {
    changed: 'border-l-4 border-l-[#FBBC04] bg-[#FBBC04]/5',
    added: 'border-l-4 border-l-[#34A853] bg-[#34A853]/5',
    removed: 'border-l-4 border-l-[#EA4335] bg-[#EA4335]/5 opacity-60',
    unchanged: 'border-gray-200 bg-white',
  };

  const badgeClasses: Record<ActivityStatus, string> = {
    changed: 'bg-[#FBBC04]/15 text-[#F29900]',
    added: 'bg-[#34A853]/15 text-[#34A853]',
    removed: 'bg-[#EA4335]/15 text-[#EA4335]',
    unchanged: '',
  };

  const badgeLabel: Record<ActivityStatus, string | null> = {
    changed: '⚡ Modified',
    added: '+ Added',
    removed: '✕ Removed',
    unchanged: null,
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 hover:shadow-md ${cardClasses[status]}`}>
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {activity.time}
            </span>
            <span aria-hidden="true">{CATEGORY_EMOJI[activity.category]}</span>
          </div>
          {badgeLabel[status] && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeClasses[status]}`}>
              {badgeLabel[status]}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-semibold text-gray-900 mb-1 ${status === 'removed' ? 'line-through' : ''}`}>
          {activity.title}
        </h3>

        {/* Location + duration */}
        <div className="flex items-center justify-between mb-2">
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-[#4285F4] hover:underline"
            aria-label={`Open ${activity.location} in Google Maps`}
          >
            📍 <span className="truncate max-w-[200px]">{activity.location}</span> <span className="text-xs">↗</span>
          </a>
          <span className="text-xs text-gray-400">⏱ {activity.durationMinutes} min</span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed mb-3">
          {activity.description}
        </p>

        {/* Map toggle */}
        <button
          onClick={() => setMapExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500
            hover:text-[#4285F4] transition-colors
            focus:outline-none focus:ring-2 focus:ring-[#4285F4] rounded"
          aria-expanded={mapExpanded}
          aria-label={mapExpanded ? 'Hide map' : 'Show map for this activity'}
        >
          🗺️ {mapExpanded ? 'Hide map ▲' : 'View on map ▼'}
        </button>
      </div>

      {/* Expandable Google Maps embed */}
      {mapExpanded && (
        <div className="border-t border-gray-200">
          <iframe
            src={embedUrl}
            title={`Map of ${activity.location}`}
            width="100%"
            height="180"
            className="block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label={`Google Maps showing ${activity.location}`}
          />
        </div>
      )}
    </div>
  );
});
