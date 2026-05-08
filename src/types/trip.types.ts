/** Activity categories for trip planning */
export type ActivityCategory = 'food' | 'culture' | 'adventure' | 'rest' | 'transport' | 'shopping';

/** A single activity in the itinerary */
export interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  category: ActivityCategory;
  durationMinutes: number;
  costINR: number;
  mapsUrl: string;
}

/** A single day in the trip plan */
export interface Day {
  dayNumber: number;
  date: string;
  activities: Activity[];
}

/** The complete trip plan */
export interface TripPlan {
  destination: string;
  days: Day[];
  totalBudgetINR: number;
  constraints: string[];
  generatedAt: string;
}

/** Types of disruptions Wayshift can detect */
export type DisruptionIntent =
  | 'FLIGHT_DELAY'
  | 'TRAIN_DELAY'
  | 'RAIN'
  | 'EXHAUSTED'
  | 'BUDGET_CUT'
  | 'VENUE_CLOSED'
  | 'TRAFFIC'
  | 'SAFETY_ALERT'
  | 'WORK_CALL'
  | 'DIETARY_CHANGE'
  | 'LOW_MOBILITY'
  | 'UNKNOWN';

/** Result of a replanning operation */
export interface ReplanResult {
  updatedPlan: TripPlan;
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
  reasoning: string;
  disruptionDetected: DisruptionIntent;
}

/** A single chat message in the replanner */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  replanResult?: ReplanResult;
  previousPlan?: TripPlan;
  timestamp: string;
}

/** Form data for creating a new trip plan */
export interface TripFormData {
  origin: string;
  destination: string;
  startDate: string;
  endDate: string;
  budgetPerDayINR: number;
  energyLevel: 'relaxed' | 'active' | 'intense';
  interests: string[];
  constraints: string[];
}
