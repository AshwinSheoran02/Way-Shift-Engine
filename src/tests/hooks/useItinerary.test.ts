import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useItinerary } from '../../hooks/useItinerary';
import type { TripPlan, ReplanResult } from '../../types/trip.types';

const mockPlan: TripPlan = {
  destination: 'Paris',
  days: [],
  totalBudgetINR: 50000,
  constraints: [],
  generatedAt: '2025-01-01',
};

const mockUpdatedPlan: TripPlan = {
  ...mockPlan,
  destination: 'London',
};

const mockReplanResult: ReplanResult = {
  updatedPlan: mockUpdatedPlan,
  changedActivityIds: [],
  addedActivityIds: [],
  removedActivityIds: [],
  reasoning: 'Testing',
  disruptionDetected: 'UNKNOWN',
};

describe('useItinerary', () => {
  it('initializes with null plans', () => {
    const { result } = renderHook(() => useItinerary());
    expect(result.current.currentPlan).toBeNull();
    expect(result.current.previousPlan).toBeNull();
  });

  it('sets a new plan correctly', () => {
    const { result } = renderHook(() => useItinerary());
    act(() => {
      result.current.setPlan(mockPlan);
    });
    expect(result.current.currentPlan).toEqual(mockPlan);
    expect(result.current.previousPlan).toBeNull();
  });

  it('updates plan and preserves previous plan for diff', () => {
    const { result } = renderHook(() => useItinerary());
    act(() => {
      result.current.setPlan(mockPlan);
    });
    act(() => {
      result.current.updatePlan(mockReplanResult);
    });
    expect(result.current.currentPlan).toEqual(mockUpdatedPlan);
    expect(result.current.previousPlan).toEqual(mockPlan);
  });
});
