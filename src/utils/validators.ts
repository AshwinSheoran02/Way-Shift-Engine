import type { TripFormData } from '../types/trip.types';

interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}

/**
 * Validates trip form data and returns validation result with field-level errors.
 */
export function validateTripForm(data: TripFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Destination: required, min 2 chars
  if (!data.destination || data.destination.trim().length < 2) {
    errors.destination = 'Destination must be at least 2 characters';
  }

  // Start date: must be today or future
  if (!data.startDate) {
    errors.startDate = 'Start date is required';
  } else {
    const start = new Date(data.startDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (start < today) {
      errors.startDate = 'Start date must be today or in the future';
    }
  }

  // End date: must be after start date
  if (!data.endDate) {
    errors.endDate = 'End date is required';
  } else if (data.startDate) {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (end <= start) {
      errors.endDate = 'End date must be after start date';
    }
  }

  // Budget: must be > 0
  if (!data.budgetPerDayINR || data.budgetPerDayINR <= 0) {
    errors.budgetPerDayINR = 'Budget must be greater than 0';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
