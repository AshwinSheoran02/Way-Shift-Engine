/**
 * Strips HTML tags from input, trims whitespace, and limits to maxLen characters.
 * Apply to ALL user text inputs before they are inserted into Gemini prompts.
 */
export function sanitizeInput(s: string, maxLen: number = 500): string {
  const stripped = s.replace(/<[^>]*>/g, '');
  const trimmed = stripped.trim();
  return trimmed.slice(0, maxLen);
}

/**
 * Strips HTML tags and trims, keeping full length.
 */
export function stripHtml(s: string): string {
  return s.replace(/<[^>]*>/g, '').trim();
}

/**
 * Trims and limits string to a maximum length, adding ellipsis if truncated.
 */
export function trimAndLimit(s: string, maxLen: number): string {
  const trimmed = s.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return trimmed.slice(0, maxLen - 1) + '…';
}
