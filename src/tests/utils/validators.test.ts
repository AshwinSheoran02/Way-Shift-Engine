import { describe, it, expect } from 'vitest';
import { validateTripForm } from '../../utils/validators';
import type { TripFormData } from '../../types/trip.types';

function makeValidForm(): TripFormData {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);

  return {
    origin: 'Delhi',
    destination: 'Jaipur',
    startDate: tomorrow.toISOString().split('T')[0],
    endDate: dayAfter.toISOString().split('T')[0],
    budgetPerDayINR: 5000,
    energyLevel: 'active',
    interests: ['Culture', 'Food'],
    constraints: [],
  };
}

describe('validateTripForm', () => {
  it('returns invalid with error for empty origin', () => {
    const data = makeValidForm();
    data.origin = '';
    const result = validateTripForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.origin).toBeDefined();
  });

  it('returns invalid with error for empty destination', () => {
    const data = makeValidForm();
    data.destination = '';
    const result = validateTripForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.destination).toBeDefined();
  });

  it('returns invalid with error for destination less than 2 chars', () => {
    const data = makeValidForm();
    data.destination = 'A';
    const result = validateTripForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.destination).toBeDefined();
  });

  it('returns invalid with error for past start date', () => {
    const data = makeValidForm();
    data.startDate = '2020-01-01';
    const result = validateTripForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.startDate).toBeDefined();
  });

  it('returns invalid with error when end date is before start date', () => {
    const data = makeValidForm();
    data.endDate = data.startDate; // same day, not after
    const result = validateTripForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.endDate).toBeDefined();
  });

  it('returns invalid with error for budget of 0', () => {
    const data = makeValidForm();
    data.budgetPerDayINR = 0;
    const result = validateTripForm(data);
    expect(result.valid).toBe(false);
    expect(result.errors.budgetPerDayINR).toBeDefined();
  });

  it('returns valid with no errors for a complete valid form', () => {
    const data = makeValidForm();
    const result = validateTripForm(data);
    expect(result.valid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });
});
