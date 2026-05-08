import type { TripPlan } from '../types/trip.types';
import { callGemini, parseGeminiResponse, GeminiError } from './geminiService';
import { buildImportPrompt } from '../utils/promptBuilder';
import { buildMapsSearchUrl } from './mapsService';
import { FALLBACK_TRIP } from './fallbackData';

interface ImportResult {
  plan: TripPlan;
  warning?: string;
}

/**
 * Accepts raw pasted trip text. Calls Gemini to parse into TripPlan.
 * If Gemini fails, returns FALLBACK_TRIP with a warning message.
 */
export async function parseImportedTrip(rawText: string): Promise<ImportResult> {
  try {
    const prompt = buildImportPrompt(rawText);
    const rawResponse = await callGemini(prompt);
    const plan = parseGeminiResponse<TripPlan>(rawResponse);

    // Populate mapsUrl for all activities
    for (const day of plan.days) {
      for (const activity of day.activities) {
        if (!activity.mapsUrl) {
          activity.mapsUrl = buildMapsSearchUrl(activity.location, plan.destination);
        }
      }
    }

    return { plan };
  } catch (error) {
    const message = error instanceof GeminiError
      ? error.message
      : 'Failed to parse trip. Using demo data.';
    return {
      plan: FALLBACK_TRIP,
      warning: message,
    };
  }
}
