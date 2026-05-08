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

/**
 * Builds a Google Maps Directions URL for a full day of activities.
 */
export function buildDayRouteUrl(locations: string[], destination: string): string | null {
  if (locations.length === 0) return null;
  if (locations.length === 1) return buildMapsSearchUrl(locations[0], destination);

  const origin = encodeURIComponent(`${locations[0]}, ${destination}`);
  const dest = encodeURIComponent(`${locations[locations.length - 1]}, ${destination}`);
  
  const waypointsRaw = locations.slice(1, -1);
  let waypointsStr = '';
  if (waypointsRaw.length > 0) {
    waypointsStr = '&waypoints=' + waypointsRaw.map(l => encodeURIComponent(`${l}, ${destination}`)).join('|');
  }

  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${dest}${waypointsStr}`;
}
