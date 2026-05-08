import { useState, useCallback } from 'react';
import { callGemini, parseGeminiResponse, GeminiError } from '../services/geminiService';

/**
 * Hook for making Gemini API calls with automatic fallback handling.
 * Exposes loading state, error state, and a callWithFallback function.
 */
export function useGemini() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  /**
   * Calls Gemini with the given prompt and parses the response.
   * On failure, returns the provided fallback value.
   */
  const callWithFallback = useCallback(async <T>(
    prompt: string,
    fallback: T
  ): Promise<{ result: T; usedFallback: boolean }> => {
    setLoading(true);
    setError(null);

    try {
      const rawResponse = await callGemini(prompt);
      const parsed = parseGeminiResponse<T>(rawResponse);
      setLoading(false);
      return { result: parsed, usedFallback: false };
    } catch (err) {
      const message = err instanceof GeminiError
        ? err.message
        : 'An unexpected error occurred.';
      setError(message);
      setLoading(false);
      return { result: fallback, usedFallback: true };
    }
  }, []);

  return { loading, error, clearError, callWithFallback };
}
