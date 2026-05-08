/**
 * Firebase Analytics integration for Wayshift.
 * Tracks key user interactions without collecting personal data.
 */
import { initializeApp } from 'firebase/app';
import { getAnalytics, logEvent } from 'firebase/analytics';
import type { Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let analytics: Analytics | null = null;

export function initAnalytics(): void {
  try {
    const app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
  } catch {
    // Analytics unavailable — app continues without tracking
  }
}

export function trackTripGenerated(destination: string, days: number): void {
  if (!analytics) return;
  logEvent(analytics, 'trip_generated', { destination, days });
}

export function trackDisruptionDetected(intent: string): void {
  if (!analytics) return;
  logEvent(analytics, 'disruption_detected', { disruption_type: intent });
}

export function trackReplanCompleted(changedCount: number): void {
  if (!analytics) return;
  logEvent(analytics, 'replan_completed', { activities_changed: changedCount });
}

export function trackMapOpened(location: string): void {
  if (!analytics) return;
  logEvent(analytics, 'map_opened', { location });
}

export function trackImportUsed(): void {
  if (!analytics) return;
  logEvent(analytics, 'import_trip_used');
}
