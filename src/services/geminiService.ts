/** Custom error class for Gemini API failures */
export class GeminiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GeminiError';
  }
}

/** Custom error class for JSON parse failures */
export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ParseError';
  }
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent`;

/**
 * Calls the Gemini 2.5 Flash Lite API with the given prompt.
 * Throws GeminiError if the API key is missing or the request fails.
 */
export async function callGemini(prompt: string): Promise<string> {
  if (!API_KEY) {
    throw new GeminiError('VITE_GEMINI_API_KEY is not configured. Using fallback data.');
  }

  const url = `${ENDPOINT}?key=${API_KEY}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new GeminiError(`Gemini API error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new GeminiError('Gemini returned an empty response.');
  }

  return text;
}

/**
 * Strips any accidental markdown fences and parses JSON response from Gemini.
 * Throws ParseError if the response is not valid JSON.
 */
export function parseGeminiResponse<T>(raw: string): T {
  // Strip markdown code fences if present
  let cleaned = raw.trim();

  // Remove ```json ... ``` or ``` ... ``` wrappers
  const fenceRegex = /^```(?:json)?\s*\n?([\s\S]*?)\n?\s*```$/;
  const match = cleaned.match(fenceRegex);
  if (match) {
    cleaned = match[1].trim();
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    throw new ParseError(`Failed to parse Gemini response as JSON: ${cleaned.slice(0, 200)}`);
  }
}
