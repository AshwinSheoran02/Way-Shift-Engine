import { memo } from 'react';
import type { Activity } from '../../types/trip.types';
import { CATEGORY_EMOJI } from '../../constants/categories';

type ActivityStatus = 'changed' | 'added' | 'removed' | 'unchanged';

interface ActivityCardProps {
  activity: Activity;
  status: ActivityStatus;
}

/**
 * Single activity card showing time, category, title, location, description, and duration.
 * Wrapped in React.memo for performance.
 */
export const ActivityCard = memo(function ActivityCard({ activity, status }: ActivityCardProps) {
  const statusClasses: Record<ActivityStatus, string> = {
    changed: 'diff-changed',
    added: 'diff-added',
    removed: 'diff-removed',
    unchanged: 'bg-[var(--color-bg-card)] border border-white/5',
  };

  const statusBadge: Record<ActivityStatus, string | null> = {
    changed: '⚡ Modified',
    added: '+ Added',
    removed: '✕ Removed',
    unchanged: null,
  };

  const badgeColors: Record<ActivityStatus, string> = {
    changed: 'bg-amber-500/20 text-amber-300',
    added: 'bg-emerald-500/20 text-emerald-300',
    removed: 'bg-red-500/20 text-red-300',
    unchanged: '',
  };

  return (
    <div className={`rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 ${statusClasses[status]}`}>
      {/* Header: time + status badge */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold px-2 py-1 rounded-md bg-[var(--color-bg-elevated)] text-[var(--color-accent-end)]">
            {activity.time}
          </span>
          <span className="text-lg">{CATEGORY_EMOJI[activity.category]}</span>
        </div>
        {statusBadge[status] && (
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${badgeColors[status]}`}>
            {statusBadge[status]}
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className={`text-sm font-semibold text-[var(--color-text-primary)] mb-1 ${status === 'removed' ? 'line-through opacity-60' : ''}`}>
        {activity.title}
      </h4>

      {/* Location — Maps link */}
      <a
        href={activity.mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-xs text-[var(--color-accent-end)] hover:text-[var(--color-accent-mid)] transition-colors mb-2"
      >
        📍 {activity.location}
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      {/* Description */}
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-2">
        {activity.description}
      </p>

      {/* Duration */}
      <div className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {activity.durationMinutes} minutes
      </div>
    </div>
  );
});
