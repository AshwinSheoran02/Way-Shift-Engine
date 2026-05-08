import { useState, useCallback } from 'react';
import type { ChatMessage, TripPlan, ReplanResult } from '../types/trip.types';
import { useGemini } from './useGemini';
import { buildReplanPrompt } from '../utils/promptBuilder';
import { buildMapsSearchUrl } from '../services/mapsService';
import { sanitizeInput } from '../utils/sanitize';
import {
  FALLBACK_REPLAN_RAIN,
  FALLBACK_REPLAN_DELAY,
  FALLBACK_REPLAN_EXHAUSTED,
} from '../services/fallbackData';

/**
 * Selects the most appropriate fallback replan based on the user's message.
 */
function selectFallbackReplan(message: string): ReplanResult {
  const lower = message.toLowerCase();
  if (lower.includes('rain') || lower.includes('weather') || lower.includes('storm')) {
    return FALLBACK_REPLAN_RAIN;
  }
  if (lower.includes('delay') || lower.includes('late') || lower.includes('flight') || lower.includes('train')) {
    return FALLBACK_REPLAN_DELAY;
  }
  if (lower.includes('tired') || lower.includes('exhaust') || lower.includes('rest') || lower.includes('sick')) {
    return FALLBACK_REPLAN_EXHAUSTED;
  }
  return FALLBACK_REPLAN_DELAY; // Default fallback
}

/**
 * Hook for managing chat messages and the replanning workflow.
 */
export function useChat(
  currentPlan: TripPlan | null,
  onReplan: (result: ReplanResult) => void
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { loading, error, clearError, callWithFallback } = useGemini();

  const sendMessage = useCallback(async (userText: string) => {
    if (!currentPlan || !userText.trim()) return;

    const sanitizedText = sanitizeInput(userText);

    // Append user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: sanitizedText,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Build prompt and call Gemini
    const prompt = buildReplanPrompt(currentPlan, sanitizedText);
    const fallback = selectFallbackReplan(sanitizedText);
    const { result, usedFallback } = await callWithFallback<ReplanResult>(prompt, fallback);

    // Populate mapsUrl for all activities in the updated plan
    for (const day of result.updatedPlan.days) {
      for (const activity of day.activities) {
        if (!activity.mapsUrl) {
          activity.mapsUrl = buildMapsSearchUrl(activity.location, result.updatedPlan.destination);
        }
      }
    }

    // Update the itinerary
    onReplan(result);

    // Append assistant message
    const assistantContent = usedFallback
      ? `I've adjusted your plan based on the disruption. (Using demo data — add VITE_GEMINI_API_KEY for live replanning)`
      : `I've detected a disruption and adjusted your plan accordingly.`;

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: assistantContent,
      replanResult: result,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
  }, [currentPlan, onReplan, callWithFallback]);

  return {
    messages,
    loading,
    error,
    clearError,
    sendMessage,
  };
}
