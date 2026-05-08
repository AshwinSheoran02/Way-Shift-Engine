import type { DisruptionIntent } from '../types/trip.types';

/** Human-readable labels for each disruption type */
export const DISRUPTION_LABELS: Record<DisruptionIntent, string> = {
  FLIGHT_DELAY: 'Flight delay',
  TRAIN_DELAY: 'Train delay',
  RAIN: 'Rain or bad weather',
  EXHAUSTED: 'Traveller fatigue',
  BUDGET_CUT: 'Budget reduced',
  VENUE_CLOSED: 'Venue or attraction closed',
  TRAFFIC: 'Traffic or road issue',
  SAFETY_ALERT: 'Safety concern',
  WORK_CALL: 'Unexpected work commitment',
  DIETARY_CHANGE: 'Dietary constraint changed',
  LOW_MOBILITY: 'Low mobility or elderly-friendly required',
  UNKNOWN: 'Disruption detected',
};

/** Example disruption messages shown as input hints */
export const DISRUPTION_EXAMPLES: string[] = [
  'My flight is delayed by 2 hours',
  "It's raining heavily outside",
  "I'm too tired for the fort visit",
  'The museum is closed today',
  "We need to cut ₹2000 from today's budget",
  'I have an urgent work call at 3pm',
  'One person in our group has low mobility',
];
