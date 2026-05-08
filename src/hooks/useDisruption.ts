import { useState, useCallback } from 'react';
import type { ReplanResult, DisruptionIntent } from '../types/trip.types';

/**
 * Hook for tracking disruption diff state (which activities changed/added/removed).
 * Updates whenever a replan is applied.
 */
export function useDisruption() {
  const [changedActivityIds, setChangedActivityIds] = useState<string[]>([]);
  const [removedActivityIds, setRemovedActivityIds] = useState<string[]>([]);
  const [addedActivityIds, setAddedActivityIds] = useState<string[]>([]);
  const [lastReasoning, setLastReasoning] = useState<string>('');
  const [lastIntent, setLastIntent] = useState<DisruptionIntent | null>(null);

  /** Updates disruption state from a new ReplanResult */
  const applyReplan = useCallback((result: ReplanResult) => {
    setChangedActivityIds(result.changedActivityIds);
    setRemovedActivityIds(result.removedActivityIds);
    setAddedActivityIds(result.addedActivityIds);
    setLastReasoning(result.reasoning);
    setLastIntent(result.disruptionDetected);
  }, []);

  /** Clears all disruption state */
  const clearDisruption = useCallback(() => {
    setChangedActivityIds([]);
    setRemovedActivityIds([]);
    setAddedActivityIds([]);
    setLastReasoning('');
    setLastIntent(null);
  }, []);

  return {
    changedActivityIds,
    removedActivityIds,
    addedActivityIds,
    lastReasoning,
    lastIntent,
    applyReplan,
    clearDisruption,
  };
}
