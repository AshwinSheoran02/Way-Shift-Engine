import { useCallback } from 'react';

interface ModeToggleProps {
  activeMode: 'planner' | 'replanner';
  onModeChange: (mode: 'planner' | 'replanner') => void;
  hasPlan: boolean;
}

/**
 * Tab toggle between Planner and Replanner modes.
 * Uses proper ARIA role="tablist" for accessibility.
 */
export function ModeToggle({ activeMode, onModeChange, hasPlan }: ModeToggleProps) {
  const handlePlannerClick = useCallback(() => onModeChange('planner'), [onModeChange]);
  const handleReplannerClick = useCallback(() => onModeChange('replanner'), [onModeChange]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div
        role="tablist"
        aria-label="Application mode"
        className="inline-flex gap-1 p-1 rounded-xl glass"
      >
        <button
          role="tab"
          id="tab-planner"
          aria-selected={activeMode === 'planner'}
          aria-controls="panel-planner"
          onClick={handlePlannerClick}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeMode === 'planner'
              ? 'gradient-accent text-white shadow-lg shadow-purple-500/25'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
          }`}
        >
          ✈️ Plan a Trip
        </button>
        <button
          role="tab"
          id="tab-replanner"
          aria-selected={activeMode === 'replanner'}
          aria-controls="panel-replanner"
          onClick={handleReplannerClick}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
            activeMode === 'replanner'
              ? 'gradient-accent text-white shadow-lg shadow-purple-500/25'
              : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-white/5'
          }`}
        >
          💬 Replan / Chat
          {hasPlan && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-soft" />
          )}
        </button>
      </div>
    </div>
  );
}
