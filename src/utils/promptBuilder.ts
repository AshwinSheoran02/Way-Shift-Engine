import type { TripFormData, TripPlan } from '../types/trip.types';

/**
 * Builds the Gemini prompt for generating a new trip plan.
 * Instructs Gemini to return ONLY valid JSON matching TripPlan schema.
 */
export function buildPlanPrompt(formData: TripFormData): string {
  const days = Math.ceil(
    (new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return `You are a travel planning AI. Generate a detailed ${days}-day trip plan for ${formData.destination}.

Trip Details:
- Destination: ${formData.destination}
- Start Date: ${formData.startDate}
- End Date: ${formData.endDate}
- Budget per day: ₹${formData.budgetPerDayINR} INR
- Energy Level: ${formData.energyLevel}
- Interests: ${formData.interests.join(', ') || 'general sightseeing'}
- Constraints: ${formData.constraints.join(', ') || 'none'}

Generate exactly 4 activities per day. Each activity must have a unique ID in format "d{dayNumber}-a{activityNumber}" (e.g., "d1-a1", "d1-a2").

Return ONLY a valid JSON object matching this exact schema. No markdown. No commentary. No backticks.

{
  "destination": "string",
  "days": [
    {
      "dayNumber": number,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "id": "string",
          "time": "HH:MM",
          "title": "string",
          "location": "string (specific place name)",
          "description": "string (2-3 sentences)",
          "category": "food" | "culture" | "adventure" | "rest" | "transport" | "shopping",
          "durationMinutes": number,
          "mapsUrl": ""
        }
      ]
    }
  ],
  "totalBudgetINR": number,
  "constraints": ["string"],
  "generatedAt": "ISO date string"
}`;
}

/**
 * Builds the Gemini prompt for replanning after a disruption.
 * Includes the current plan and the user's natural language disruption message.
 */
export function buildReplanPrompt(currentPlan: TripPlan, userMessage: string): string {
  return `You are a travel disruption recovery AI. A traveller has reported a disruption during their trip.

Current Trip Plan (JSON):
${JSON.stringify(currentPlan, null, 2)}

User's disruption message: "${userMessage}"

Instructions:
1. Detect the disruption type from this list: FLIGHT_DELAY, TRAIN_DELAY, RAIN, EXHAUSTED, BUDGET_CUT, VENUE_CLOSED, TRAFFIC, SAFETY_ALERT, WORK_CALL, DIETARY_CHANGE, LOW_MOBILITY, UNKNOWN
2. Identify which activities are affected by this disruption
3. Replan ONLY the affected activities — keep unaffected activities exactly the same with the same IDs
4. For new replacement activities, use IDs in format "d{day}-a{number}-new{counter}" (e.g., "d1-a3-new1")
5. Provide clear reasoning explaining each change

Return ONLY a valid JSON object matching this exact schema. No markdown. No commentary. No backticks.

{
  "updatedPlan": { ... full TripPlan with changes applied ... },
  "changedActivityIds": ["IDs of activities that were modified in-place"],
  "removedActivityIds": ["IDs of activities that were removed"],
  "addedActivityIds": ["IDs of new activities that were added"],
  "reasoning": "Plain English explanation of what changed and why",
  "disruptionDetected": "DISRUPTION_TYPE"
}`;
}

/**
 * Builds the Gemini prompt for parsing pasted plain-text trip into TripPlan JSON.
 */
export function buildImportPrompt(rawText: string): string {
  return `Parse the following trip description into a structured trip plan. Extract as much detail as possible.

Trip Description:
${rawText}

Return ONLY a valid JSON object matching this exact schema. No markdown. No commentary. No backticks.

{
  "destination": "string",
  "days": [
    {
      "dayNumber": number,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "id": "d{dayNumber}-a{activityNumber}",
          "time": "HH:MM",
          "title": "string",
          "location": "string",
          "description": "string",
          "category": "food" | "culture" | "adventure" | "rest" | "transport" | "shopping",
          "durationMinutes": number,
          "mapsUrl": ""
        }
      ]
    }
  ],
  "totalBudgetINR": number,
  "constraints": [],
  "generatedAt": "ISO date string"
}

If you cannot determine specific details, make reasonable assumptions for an Indian travel context. Use INR for budget.`;
}
