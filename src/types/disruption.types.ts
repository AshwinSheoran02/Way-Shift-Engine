import type { DisruptionIntent } from './trip.types';

/** Context information about a detected disruption */
export interface DisruptionContext {
  rawMessage: string;
  detectedIntent: DisruptionIntent;
  parameters: Record<string, string>;
}
