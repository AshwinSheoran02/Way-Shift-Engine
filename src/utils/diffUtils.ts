import type { TripPlan } from '../types/trip.types';

interface DiffResult {
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
}

/**
 * Compares activities by ID across all days between old and new plan.
 * - Changed: same ID, different title or time or location
 * - Removed: ID in oldPlan not in newPlan
 * - Added: ID in newPlan not in oldPlan
 */
export function computeDiff(oldPlan: TripPlan, newPlan: TripPlan): DiffResult {
  const oldActivities = new Map<string, { title: string; time: string; location: string }>();
  const newActivities = new Map<string, { title: string; time: string; location: string }>();

  for (const day of oldPlan.days) {
    for (const activity of day.activities) {
      oldActivities.set(activity.id, {
        title: activity.title,
        time: activity.time,
        location: activity.location,
      });
    }
  }

  for (const day of newPlan.days) {
    for (const activity of day.activities) {
      newActivities.set(activity.id, {
        title: activity.title,
        time: activity.time,
        location: activity.location,
      });
    }
  }

  const changedActivityIds: string[] = [];
  const removedActivityIds: string[] = [];
  const addedActivityIds: string[] = [];

  // Find removed and changed
  for (const [id, oldAct] of oldActivities) {
    const newAct = newActivities.get(id);
    if (!newAct) {
      removedActivityIds.push(id);
    } else if (
      oldAct.title !== newAct.title ||
      oldAct.time !== newAct.time ||
      oldAct.location !== newAct.location
    ) {
      changedActivityIds.push(id);
    }
  }

  // Find added
  for (const id of newActivities.keys()) {
    if (!oldActivities.has(id)) {
      addedActivityIds.push(id);
    }
  }

  return { changedActivityIds, removedActivityIds, addedActivityIds };
}
