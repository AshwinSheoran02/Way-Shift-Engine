import type { ActivityCategory } from '../types/trip.types';

/** Emoji icons for each activity category */
export const CATEGORY_EMOJI: Record<ActivityCategory, string> = {
  food: '🍽️',
  culture: '🏛️',
  adventure: '🧗',
  rest: '🛋️',
  transport: '🚗',
  shopping: '🛍️',
};

export const INTEREST_OPTIONS = ['Food', 'Culture', 'Adventure', 'Shopping', 'Nature', 'Nightlife'];
export const CONSTRAINT_OPTIONS = ['Vegetarian', 'Low walking', 'Elderly-friendly', 'Budget-conscious'];
