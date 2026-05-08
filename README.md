# ✈️ Wayshift — Travel Resilience Engine

Wayshift is a next-generation travel itinerary generator and disruption recovery engine. It was built specifically for the reality of travel: **things change**. 

**Live Deployment:** [https://wayshift-engine.web.app](https://wayshift-engine.web.app)

---

## 🎯 Challenge Vertical
**Travel Planning and Experience Engine** — plan trips dynamically with preferences, constraints, and real-time updates.

## 🚨 Problem Statement
Standard travel planners treat itineraries as static documents. If your flight is delayed by 4 hours, or if it starts pouring rain during your planned outdoor hike, a static itinerary breaks down completely. Travelers are forced to manually research alternatives, recalculate travel times, and frantically re-adjust their day on the fly. 

## 💡 Solution Overview
Wayshift solves this by introducing a **"Replanner" chat interface** powered by Gemini 2.5 Flash Lite. After generating a constraint-aware itinerary, users can simply tell the AI about a disruption in plain English (e.g., *"My flight is delayed by 2 hours"*, or *"It's pouring rain outside"*). 

The engine instantly calculates the impact of the disruption and **surgically updates** only the affected parts of the itinerary, leaving the rest untouched. 

## 🔄 Why this is Dynamic
Unlike traditional "regenerate everything" AI tools, Wayshift performs an intelligent JSON diffing process. 
When a disruption occurs:
1. It flags modified activities with a `⚡ Modified` badge.
2. It flags newly added backup plans with an `+ Added` badge.
3. It clearly strikes through `✕ Removed` activities.
4. It provides an expandable **Explanation Panel** detailing exactly *why* the AI made those specific decisions based on the disruption.

## 🚶 User Journey
1. **Planning Mode:** The user enters a destination, dates, exact budget, energy levels, and specific constraints (e.g. Vegetarian, Elderly-friendly).
2. **Review:** The engine creates a precise day-by-day itinerary. Every activity has exact times, durations, and an inline Google Maps integration.
3. **Disruption:** The user encounters an issue (e.g., they get tired, a venue is closed, or weather changes).
4. **Replanning:** The user chats with the AI in the left panel. The AI pushes a dynamic diff update to the itinerary on the right.
5. **Save:** The user clicks "Save Plan" to download their finalized or newly-replanned itinerary as a `.txt` file.

## 🧠 Approach and Logic
The core logic relies on **Strict Structured JSON Parsing** using Gemini.
- We pass explicit TypeScript schemas to Gemini and enforce JSON-only responses.
- During replanning, we feed the AI the *current* JSON state and the natural language disruption. We instruct it to return an updated JSON state along with arrays of `changedActivityIds`, `addedActivityIds`, and `removedActivityIds`.
- The React frontend computes the visual diffs based on these arrays, allowing us to highlight the exact delta without full-page re-renders.

## 🤔 Assumptions Made
- **Fallback Data:** We assume the user may run out of API quota or face network issues. The app includes graceful degradation to hardcoded fallback data if the API fails, ensuring the UI remains testable.
- **Connectivity:** We assume users have an active internet connection to load the inline Google Maps iframe embeds.
- **API Key Security:** For the scope of this hackathon, the frontend uses Vite's `.env` system. We assume that for a true production rollout, the Gemini API calls would be proxied through a lightweight backend (like Firebase Functions or Cloud Run) to conceal the API key from the client.

## 🌐 Google Services Used

| Service | Role | How Used |
|---|---|---|
| Gemini 2.5 Flash Lite (Vertex AI) | Core AI | Trip generation, disruption intent detection, surgical replanning, import parsing |
| Google Maps Embed API | Visualisation | Per-activity expandable map embed inside every itinerary card |
| Google Maps Search URLs | Navigation | Direct deep-link to Google Maps for every activity location |
| Firebase Hosting | Deployment | Static hosting with CDN, SPA rewrite rules |
| Firebase Analytics | Telemetry | Event tracking: trip_generated, disruption_detected, replan_completed, map_opened |
| Firebase Cloud Functions | Serverless backend | Production-grade Gemini API proxy that keeps the key server-side (Planned Architecture) |
| Google Cloud Secret Manager | Security | API key stored as a Cloud Secret, not an environment variable, in production (Planned Architecture) |

Note: Gemini 2.5 Flash Lite is served by Google's Vertex AI infrastructure, making this app a direct consumer of Google's AI/ML API platform.

## 🔒 Security Considerations
- **No Hardcoded Secrets**: The API key is strictly loaded via `.env.local` and is not committed to the repository.
- **Sanitization**: All user inputs from the chat and planning forms are sanitized to strip potentially malicious scripts or HTML before being passed to the Gemini prompt.
- **No Dangerous HTML**: The app strictly avoids `dangerouslySetInnerHTML`, relying on React's safe rendering pipeline.
- **Secure Links**: All outbound links use `target="_blank" rel="noopener noreferrer"`.

## ♿ Accessibility Considerations
- **Screen Reader Support**: All form inputs have explicit `htmlFor` labels. The chat input has an `aria-label`.
- **Dynamic Updates**: The itinerary section uses `aria-live="polite"` so screen readers announce when the AI pushes a new trip update.
- **Color Contrast & Focus**: The app uses official Google brand colors (`#4285F4`, `#EA4335`, etc.) against a high-contrast white background. All interactive elements have visible `focus:ring` states.
- **Semantic Badging**: Diffs are not communicated through color alone. They use explicit text labels (`Modified`, `Added`, `Removed`) alongside colors.

## 🧪 Testing
The application includes a comprehensive Vitest testing suite covering:
- **Validators:** Ensuring form inputs meet minimum logical requirements (e.g., Start Date < End Date).
- **Sanitization:** Verifying malicious inputs are stripped.
- **Diffing Logic:** Testing the custom diff array generation.
- **API Fallbacks:** Mocking Gemini responses and testing the fallback behavior.

To run the test suite:
```bash
npm run test
```

## 💻 Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/AshwinSheoran02/Way-Shift-Engine.git
   cd Way-Shift-Engine
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Create a `.env.local` file in the root directory.
   - Add your Gemini API key:
     ```env
     VITE_GEMINI_API_KEY=your_api_key_here
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## 🚀 Deployment
The application is built using Vite and deployed to Firebase Hosting.
To build for production locally:
```bash
npm run build
```
The optimized bundle will be generated in the `/dist` directory.
