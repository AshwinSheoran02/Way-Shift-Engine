import { useState, useCallback } from 'react';
import type { TripFormData, TripPlan, ReplanResult } from './types/trip.types';
import { Header } from './components/Layout/Header';
import { ModeToggle } from './components/Layout/ModeToggle';
import { TripForm } from './components/Planner/TripForm';
import { ChatInterface } from './components/Replanner/ChatInterface';
import { ImportTrip } from './components/Replanner/ImportTrip';
import { ItineraryView } from './components/ItineraryView/ItineraryView';
import { MapView } from './components/MapView/MapView';
import { useItinerary } from './hooks/useItinerary';
import { useChat } from './hooks/useChat';
import { useDisruption } from './hooks/useDisruption';
import { useGemini } from './hooks/useGemini';
import { buildPlanPrompt } from './utils/promptBuilder';
import { buildMapsSearchUrl } from './services/mapsService';
import { sanitizeInput } from './utils/sanitize';
import { FALLBACK_TRIP } from './services/fallbackData';
import { parseImportedTrip } from './services/importParser';

/**
 * Main application component.
 * Manages mode switching between Planner and Replanner,
 * wires hooks together, and renders the full layout.
 */
export default function App() {
  const [mode, setMode] = useState<'planner' | 'replanner'>('planner');
  const [showFallbackBanner, setShowFallbackBanner] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importWarning, setImportWarning] = useState<string | null>(null);

  const { currentPlan, setPlan, updatePlan } = useItinerary();
  const { changedActivityIds, removedActivityIds, addedActivityIds, applyReplan, clearDisruption } = useDisruption();
  const { loading: geminiLoading, callWithFallback } = useGemini();

  // Handle replan from chat — updates both itinerary and disruption state
  const handleReplan = useCallback((result: ReplanResult) => {
    updatePlan(result);
    applyReplan(result);
  }, [updatePlan, applyReplan]);

  const { messages, loading: chatLoading, sendMessage } = useChat(currentPlan, handleReplan);

  // Handle trip form submission
  const handleTripSubmit = useCallback(async (formData: TripFormData) => {
    const sanitizedData: TripFormData = {
      ...formData,
      destination: sanitizeInput(formData.destination),
      interests: formData.interests.map((i) => sanitizeInput(i)),
      constraints: formData.constraints.map((c) => sanitizeInput(c)),
    };

    const prompt = buildPlanPrompt(sanitizedData);
    const { result, usedFallback } = await callWithFallback<TripPlan>(prompt, FALLBACK_TRIP);

    // Populate mapsUrl for all activities
    for (const day of result.days) {
      for (const activity of day.activities) {
        if (!activity.mapsUrl) {
          activity.mapsUrl = buildMapsSearchUrl(activity.location, result.destination);
        }
      }
    }

    setPlan(result);
    clearDisruption();
    setShowFallbackBanner(usedFallback);
    setMode('replanner');
  }, [callWithFallback, setPlan, clearDisruption]);

  // Handle import
  const handleImport = useCallback(async (rawText: string) => {
    setImportLoading(true);
    setImportWarning(null);
    const { plan, warning } = await parseImportedTrip(rawText);
    setPlan(plan);
    clearDisruption();
    setImportWarning(warning ?? null);
    setImportLoading(false);
    setShowFallbackBanner(!!warning);
  }, [setPlan, clearDisruption]);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-primary)]">
      <Header />
      <ModeToggle activeMode={mode} onModeChange={setMode} hasPlan={!!currentPlan} />

      {/* Fallback banner */}
      {showFallbackBanner && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-2">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--color-warning-bg)] border border-[var(--color-warning-border)]/30 text-[var(--color-warning-text)] text-xs font-medium animate-fade-in">
            ⚠️ {importWarning || 'Using demo data — add VITE_GEMINI_API_KEY to .env for live generation'}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Planner panel */}
        {mode === 'planner' && (
          <div
            role="tabpanel"
            id="panel-planner"
            aria-labelledby="tab-planner"
            className="max-w-2xl mx-auto"
          >
            <div className="glass rounded-2xl p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">
                  ✈️ Plan Your Trip
                </h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Tell us about your dream trip and we&apos;ll create a detailed itinerary.
                </p>
              </div>
              <TripForm onSubmit={handleTripSubmit} loading={geminiLoading} />
            </div>
          </div>
        )}

        {/* Replanner panel */}
        {mode === 'replanner' && (
          <div
            role="tabpanel"
            id="panel-replanner"
            aria-labelledby="tab-replanner"
          >
            {!currentPlan ? (
              /* No plan loaded yet */
              <div className="max-w-2xl mx-auto space-y-6">
                <div className="glass rounded-2xl p-8 text-center animate-fade-in">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h2 className="text-lg font-bold text-[var(--color-text-primary)] mb-2">
                    No trip loaded yet
                  </h2>
                  <p className="text-sm text-[var(--color-text-muted)] mb-4">
                    Create a trip in the Planner tab, or import an existing one below.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode('planner')}
                    className="gradient-accent text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:opacity-90 transition-opacity shadow-lg shadow-purple-500/20"
                  >
                    ✈️ Plan a Trip
                  </button>
                </div>
                <ImportTrip onImport={handleImport} loading={importLoading} />
              </div>
            ) : (
              /* Two-column layout: Chat + Itinerary */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: Chat + Import */}
                <div className="space-y-4">
                  <div className="glass rounded-2xl overflow-hidden">
                    <ChatInterface
                      messages={messages}
                      loading={chatLoading}
                      onSendMessage={sendMessage}
                    />
                  </div>
                  <ImportTrip onImport={handleImport} loading={importLoading} />
                </div>

                {/* Right: Itinerary + Map */}
                <div className="space-y-4">
                  <div className="glass rounded-2xl p-5 sm:p-6">
                    <ItineraryView
                      plan={currentPlan}
                      changedActivityIds={changedActivityIds}
                      removedActivityIds={removedActivityIds}
                      addedActivityIds={addedActivityIds}
                    />
                  </div>
                  <MapView plan={currentPlan} />
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[var(--color-text-muted)]">
            Wayshift uses Google Gemini AI. Verify important travel information with official sources.
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">
            Built with ❤️ for travellers
          </p>
        </div>
      </footer>
    </div>
  );
}
