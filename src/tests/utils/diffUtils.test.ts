import { describe, it, expect } from 'vitest';
import { computeDiff } from '../../utils/diffUtils';
import type { TripPlan } from '../../types/trip.types';

function makePlan(activities: { id: string; title: string; time: string; location: string }[]): TripPlan {
  return {
    destination: 'Test City',
    totalBudgetINR: 10000,
    constraints: [],
    generatedAt: new Date().toISOString(),
    days: [
      {
        dayNumber: 1,
        date: '2025-01-01',
        activities: activities.map((a) => ({
          ...a,
          description: 'Test description',
          category: 'culture' as const,
          durationMinutes: 60,
          mapsUrl: '',
        })),
      },
    ],
  };
}

describe('computeDiff', () => {
  it('returns empty arrays for identical plans', () => {
    const plan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Fort' },
      { id: 'a2', title: 'Lunch', time: '13:00', location: 'Restaurant' },
    ]);
    const result = computeDiff(plan, plan);
    expect(result.changedActivityIds).toEqual([]);
    expect(result.removedActivityIds).toEqual([]);
    expect(result.addedActivityIds).toEqual([]);
  });

  it('detects changed activity when title differs', () => {
    const oldPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Fort' },
    ]);
    const newPlan = makePlan([
      { id: 'a1', title: 'Visit Museum', time: '10:00', location: 'Fort' },
    ]);
    const result = computeDiff(oldPlan, newPlan);
    expect(result.changedActivityIds).toContain('a1');
    expect(result.removedActivityIds).toEqual([]);
    expect(result.addedActivityIds).toEqual([]);
  });

  it('detects removed activity when ID is missing from new plan', () => {
    const oldPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Fort' },
      { id: 'a2', title: 'Lunch', time: '13:00', location: 'Restaurant' },
    ]);
    const newPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Fort' },
    ]);
    const result = computeDiff(oldPlan, newPlan);
    expect(result.removedActivityIds).toContain('a2');
    expect(result.changedActivityIds).toEqual([]);
    expect(result.addedActivityIds).toEqual([]);
  });

  it('detects added activity when ID is in new plan but not old', () => {
    const oldPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Fort' },
    ]);
    const newPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Fort' },
      { id: 'a3', title: 'Tea Break', time: '15:00', location: 'Cafe' },
    ]);
    const result = computeDiff(oldPlan, newPlan);
    expect(result.addedActivityIds).toContain('a3');
    expect(result.changedActivityIds).toEqual([]);
    expect(result.removedActivityIds).toEqual([]);
  });

  it('detects changed activity when time differs', () => {
    const oldPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Fort' },
    ]);
    const newPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '12:00', location: 'Fort' },
    ]);
    const result = computeDiff(oldPlan, newPlan);
    expect(result.changedActivityIds).toContain('a1');
  });

  it('detects changed activity when location differs', () => {
    const oldPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Fort' },
    ]);
    const newPlan = makePlan([
      { id: 'a1', title: 'Visit Fort', time: '10:00', location: 'Museum' },
    ]);
    const result = computeDiff(oldPlan, newPlan);
    expect(result.changedActivityIds).toContain('a1');
  });
});
