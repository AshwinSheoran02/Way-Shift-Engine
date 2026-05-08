import { describe, it, expect } from 'vitest';
import { estimateTransport } from '../../utils/transport';
import type { Activity } from '../../types/trip.types';

const mockActivity1: Activity = {
  id: 'd1-a1',
  title: 'Activity 1',
  location: 'Loc 1',
  time: '10:00',
  description: 'Desc 1',
  category: 'culture',
  durationMinutes: 60,
  costINR: 0,
  mapsUrl: ''
};

const mockActivity2: Activity = {
  id: 'd1-a2',
  title: 'Activity 2',
  location: 'Loc 2',
  time: '12:00',
  description: 'Desc 2',
  category: 'food',
  durationMinutes: 60,
  costINR: 0,
  mapsUrl: ''
};

describe('transport utility', () => {
  it('generates a deterministic transport hint', () => {
    const hint1 = estimateTransport(mockActivity1, mockActivity2);
    const hint2 = estimateTransport(mockActivity1, mockActivity2);
    
    expect(hint1).toBe(hint2);
    expect(typeof hint1).toBe('string');
    expect(hint1.length).toBeGreaterThan(0);
  });

  it('contains expected emojis', () => {
    const hint = estimateTransport(mockActivity1, mockActivity2);
    const hasEmoji = /🚶|🚕|🚇/.test(hint);
    expect(hasEmoji).toBe(true);
  });
});
