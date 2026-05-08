import { useState, useCallback } from 'react';
import type { TripPlan, ReplanResult } from '../types/trip.types';

/**
 * Hook for managing the current trip plan state.
 * Stores current and previous plan for diff computation.
 */
export function useItinerary() {
  const [currentPlan, setCurrentPlan] = useState<TripPlan | null>(null);
  const [previousPlan, setPreviousPlan] = useState<TripPlan | null>(null);

  /** Sets a completely new plan (from planner or import) */
  const setPlan = useCallback((plan: TripPlan) => {
    setPreviousPlan(null);
    setCurrentPlan(plan);
  }, []);

  /** Updates the current plan from a replan result, preserving old plan for diff */
  const updatePlan = useCallback((replanResult: ReplanResult) => {
    setCurrentPlan((prev) => {
      if (prev) setPreviousPlan(prev);
      return replanResult.updatedPlan;
    });
  }, []);

  return {
    currentPlan,
    previousPlan,
    setPlan,
    updatePlan,
  };
}
