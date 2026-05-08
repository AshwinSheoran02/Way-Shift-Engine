import type { Activity } from '../types/trip.types';

/**
 * Generates a realistic, deterministic transport hint between two activities
 * without requiring any external APIs. Uses a simple string hash for consistency.
 */
export function estimateTransport(activity1: Activity, activity2: Activity): string {
  // Simple hash function for deterministic results
  const str = activity1.id + activity2.id;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  
  const absHash = Math.abs(hash);
  
  // Decide mode of transport
  const modes = [
    { emoji: '🚶', text: 'walk', minTime: 5, maxTime: 15, weight: 30 },
    { emoji: '🚕', text: 'cab', minTime: 10, maxTime: 35, weight: 50 },
    { emoji: '🚇', text: 'metro stops', minTime: 2, maxTime: 6, weight: 20 }
  ];
  
  const modeVal = absHash % 100;
  let selectedMode = modes[1]; // default cab
  let cumulativeWeight = 0;
  
  for (const mode of modes) {
    cumulativeWeight += mode.weight;
    if (modeVal < cumulativeWeight) {
      selectedMode = mode;
      break;
    }
  }
  
  // Calculate time
  const timeRange = selectedMode.maxTime - selectedMode.minTime;
  const time = selectedMode.minTime + (absHash % timeRange);
  
  return `${selectedMode.emoji} ${time} ${selectedMode.text === 'metro stops' ? 'metro stops' : `min ${selectedMode.text}`}`;
}
