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
import { trackDisruptionDetected, trackReplanCompleted } from '../services/analyticsService';

/**
 * Selects the most appropriate fallback replan based on keywords in the user's message.
 * @param message The raw user input message.
 * @returns A pre-defined ReplanResult for demo purposes.
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
  return FALLBACK_REPLAN_DELAY;
}

/**
 * Hook for managing chat messages and the replanning workflow.
 * Encapsulates sanitization, prompt building, API calls, and analytics.
 * 
 * @param currentPlan The current trip plan being discussed.
 * @param onReplan Callback invoked when a new plan is generated.
 */
export function useChat(
  currentPlan: TripPlan | null,
  onReplan: (result: ReplanResult) => void
) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { loading, error, clearError, callWithFallback } = useGemini();

  /**
   * Processes a user message, calls Gemini for a replan, and updates the UI.
   */
  const sendMessage = useCallback(async (userText: string) => {
    if (!currentPlan || !userText.trim()) return;

    const sanitizedText = sanitizeInput(userText);
    const timestamp = new Date().toISOString();

    // Append user message to local state
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: sanitizedText,
      timestamp,
    };
    setMessages((prev) => [...prev, userMessage]);

    // Orchestrate replanning
    const prompt = buildReplanPrompt(currentPlan, sanitizedText);
    const fallback = selectFallbackReplan(sanitizedText);
    
    const { result, usedFallback } = await callWithFallback<ReplanResult>(prompt, fallback);

    // Post-process: Ensure all new/updated activities have valid Google Maps URLs
    result.updatedPlan.days.forEach(day => {
      day.activities.forEach(activity => {
        if (!activity.mapsUrl) {
          activity.mapsUrl = buildMapsSearchUrl(activity.location, result.updatedPlan.destination);
        }
      });
    });

    // Notify parent component
    onReplan(result);

    // Telemetry
    trackDisruptionDetected(result.disruptionDetected);
    trackReplanCompleted(
      result.changedActivityIds.length + 
      result.addedActivityIds.length + 
      result.removedActivityIds.length
    );

    // Append assistant response with replan details
    const assistantContent = usedFallback
      ? "I've adjusted your plan based on the disruption. (Using demo data — add VITE_GEMINI_API_KEY for live replanning)"
      : "I've detected a disruption and adjusted your plan accordingly.";

    const assistantMessage: ChatMessage = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: assistantContent,
      replanResult: result,
      previousPlan: currentPlan,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
  }, [currentPlan, onReplan, callWithFallback]);

  const clearMessages = useCallback(() => setMessages([]), []);

  return {
    messages,
    loading,
    error,
    clearError,
    sendMessage,
    clearMessages,
  };
}
