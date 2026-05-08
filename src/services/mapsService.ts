/**
 * Builds a Google Maps search URL for a location. No API key needed.
 */
export function buildMapsSearchUrl(location: string, destination: string): string {
  const query = encodeURIComponent(`${location}, ${destination}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Builds a Google Maps embed URL for an iframe. No API key needed.
 */
export function buildMapsEmbedUrl(location: string, destination: string): string {
  const query = encodeURIComponent(`${location}, ${destination}`);
  return `https://maps.google.com/maps?q=${query}&output=embed`;
}
