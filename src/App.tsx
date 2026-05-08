import { useState, useCallback } from 'react';
import type { TripFormData, TripPlan, ReplanResult } from './types/trip.types';
import { Header } from './components/Layout/Header';
import { TripForm } from './components/Planner/TripForm';
import { ChatInterface } from './components/Replanner/ChatInterface';
import { ImportTrip } from './components/Replanner/ImportTrip';
import { ItineraryView } from './components/ItineraryView/ItineraryView';
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
 * Full-width layout, unified header with dark mode toggle.
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
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
      <Header mode={mode} onModeChange={setMode} hasPlan={!!currentPlan} />

      {/* Fallback banner */}
      {showFallbackBanner && (
        <div className="px-4 py-2">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 text-amber-800 dark:text-amber-300 text-xs font-medium animate-fade-in">
            ⚠️ {importWarning || 'Using demo data — add VITE_GEMINI_API_KEY to .env for live generation'}
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="w-full">
        {/* Planner panel */}
        {mode === 'planner' && (
          <div
            role="tabpanel"
            id="panel-planner"
            aria-labelledby="tab-planner"
            className="w-full max-w-2xl mx-auto px-6 py-8"
          >
            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 shadow-sm">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                  ✈️ Plan Your Trip
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
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
              <div className="w-full max-w-2xl mx-auto px-6 py-8 space-y-6">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center shadow-sm animate-fade-in">
                  <div className="text-5xl mb-4">🗺️</div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                    No trip loaded yet
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Create a trip in the Planner tab, or import an existing one below.
                  </p>
                  <button
                    type="button"
                    onClick={() => setMode('planner')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium text-sm transition-colors shadow-lg shadow-indigo-500/20"
                  >
                    ✈️ Plan a Trip
                  </button>
                </div>
                <ImportTrip onImport={handleImport} loading={importLoading} />
              </div>
            ) : (
              /* Two-column layout: Chat + Itinerary — full width, edge to edge */
              <div className="w-full grid grid-cols-1 lg:grid-cols-2">
                {/* Left: Chat + Import */}
                <div className="h-screen overflow-y-auto border-r border-slate-200 dark:border-slate-700 flex flex-col">
                  <div className="flex-1">
                    <ChatInterface
                      messages={messages}
                      loading={chatLoading}
                      onSendMessage={sendMessage}
                    />
                  </div>
                  <ImportTrip onImport={handleImport} loading={importLoading} />
                </div>

                {/* Right: Itinerary */}
                <div className="h-screen overflow-y-auto">
                  <ItineraryView
                    plan={currentPlan}
                    changedActivityIds={changedActivityIds}
                    removedActivityIds={removedActivityIds}
                    addedActivityIds={addedActivityIds}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
