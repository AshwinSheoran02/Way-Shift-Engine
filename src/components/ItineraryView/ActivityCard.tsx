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
 * Single activity card with expandable inline Google Maps embed.
 * Uses light-first design with dark: variants.
 */
export const ActivityCard = memo(function ActivityCard({ activity, status, destination }: ActivityCardProps) {
  const [mapExpanded, setMapExpanded] = useState(false);

  const embedUrl = buildMapsEmbedUrl(activity.location, destination);
  const searchUrl = buildMapsSearchUrl(activity.location, destination);

  const cardClasses: Record<ActivityStatus, string> = {
    changed: 'border-l-4 border-l-amber-400 border-slate-200 dark:border-slate-700 bg-amber-50 dark:bg-amber-900/10',
    added: 'border-l-4 border-l-green-400 border-slate-200 dark:border-slate-700 bg-green-50 dark:bg-green-900/10',
    removed: 'border-l-4 border-l-red-400 border-slate-200 dark:border-slate-700 bg-red-50 dark:bg-red-900/10 opacity-60',
    unchanged: 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800',
  };

  const badgeClasses: Record<ActivityStatus, string> = {
    changed: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    added: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    removed: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    unchanged: '',
  };

  const badgeLabel: Record<ActivityStatus, string | null> = {
    changed: '⚡ Modified',
    added: '+ Added',
    removed: '✕ Removed',
    unchanged: null,
  };

  return (
    <div className={`rounded-xl border transition-all duration-200 ${cardClasses[status]}`}>
      <div className="p-4">
        {/* Top row: time + category + status badge */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded">
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
        <h3 className={`font-semibold text-slate-900 dark:text-white mb-1 ${status === 'removed' ? 'line-through' : ''}`}>
          {activity.title}
        </h3>

        {/* Location row with inline Maps link */}
        <div className="flex items-center justify-between mb-2">
          <a
            href={searchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            aria-label={`Open ${activity.location} in Google Maps`}
          >
            <span>📍</span>
            <span className="truncate max-w-[180px]">{activity.location}</span>
            <span className="text-xs">↗</span>
          </a>
          <span className="text-xs text-slate-400 dark:text-slate-500">⏱ {activity.durationMinutes} min</span>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
          {activity.description}
        </p>

        {/* View map toggle button */}
        <button
          onClick={() => setMapExpanded((prev) => !prev)}
          className="flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400
            hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-expanded={mapExpanded}
          aria-label={mapExpanded ? 'Hide map' : 'Show map for this activity'}
        >
          <span>🗺️</span>
          {mapExpanded ? 'Hide map ▲' : 'View on map ▼'}
        </button>
      </div>

      {/* Expandable Google Maps embed */}
      {mapExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700">
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
