# Wayshift — Travel Resilience Engine

> **Plan once. Replan instantly. Understand why.**

A constraint-aware travel disruption recovery engine built with React, TypeScript, and Google Gemini AI.

---

## Challenge Vertical

Travel Planning and Experience Engine

## Problem Statement

Most AI travel tools generate trips. None of them handle disruption. Real travel rarely goes as planned — flights delay, it rains, budgets shrink, travellers get tired. Wayshift solves the second problem: what happens after the plan breaks.

## Solution Overview

Wayshift is a constraint-aware travel disruption recovery engine with two modes:

- **Planner**: Generate a structured day-by-day itinerary from preferences (destination, dates, budget, energy level, interests)
- **Replanner**: A natural-language chatbot that detects disruptions and surgically repairs the plan — showing exactly what changed and why

## Why This Is Dynamic

- **Natural-language disruption detection**: Users type disruptions in plain English ("my flight is delayed by 2 hours") and Wayshift automatically identifies the disruption type from 12 categories
- **Surgical replanning**: Only affected activities are changed — the rest of the itinerary stays intact, unlike generic AI regeneration
- **Visual diff with explainability**: A colour-coded diff view shows modified (amber), added (green), and removed (red) activities, with a reasoning panel explaining every change in plain English

## User Journey

1. Enter destination, dates, budget, energy level, and interests
2. Wayshift generates a structured itinerary via Google Gemini
3. Switch to the Replanner tab
4. Type a disruption in plain English: "My flight is delayed by 2 hours"
5. Wayshift detects the disruption type and calls Gemini to replan only affected activities
6. A diff view shows what changed: modified, added, and removed activities
7. An explainability panel shows why each change was made
8. Every activity links to Google Maps for navigation

## Approach and Logic

Wayshift uses a **two-prompt Gemini architecture**:

1. **Plan Prompt**: Takes trip preferences and generates a full `TripPlan` JSON with typed activities, categories, and durations
2. **Replan Prompt**: Takes the existing plan + user's disruption message, detects the `DisruptionIntent`, and returns a `ReplanResult` with surgical changes

The diff is computed client-side by comparing activity IDs between old and new plans — detecting changed (same ID, different content), removed (ID missing from new plan), and added (new IDs) activities.

**Fallback system**: When no API key is configured or Gemini fails, the app loads comprehensive hardcoded data for a 3-day Jaipur trip with three pre-built replan scenarios (rain, flight delay, exhaustion). This ensures the app is always functional for demo purposes.

## Assumptions Made

- Works fully with demo data if `VITE_GEMINI_API_KEY` is missing
- No real-time traffic or weather data — disruptions are entered by the user
- Google Maps links are search URLs — no billing or Maps API key required
- Session-only — no data persists after page reload
- Optimised for Indian travel context (INR budget, Indian destinations as defaults)

## Google Services Used

| Service | How Used |
|---------|----------|
| Gemini 1.5 Flash | Trip generation, disruption detection, surgical replanning, import parsing |
| Google Maps Search URLs | Every activity links to Google Maps search for that location |
| Google Maps Embed API | Day-level map embed in the MapView component |
| Firebase Hosting | Production deployment |

## Security Considerations

- API key stored in `.env` only, never committed (`.env` is in `.gitignore`)
- All user inputs sanitised via `sanitizeInput()` before entering Gemini prompts
- No personal data collected or transmitted beyond Gemini API calls
- No `dangerouslySetInnerHTML` used anywhere
- External links use `rel="noopener noreferrer"`
- Content Security Policy meta tag in `index.html`

## Accessibility Considerations

- All form inputs have associated `<label htmlFor>` or `aria-label` attributes
- Itinerary section uses `aria-live="polite"` for screen reader announcements
- Diff view communicates changes by text badges (⚡ Modified, + Added, ✕ Removed), not colour alone
- Mode toggle uses `role="tablist"` and `role="tab"` with `aria-selected`
- ExplainPanel uses native `<details>/<summary>` for keyboard accessibility
- Fully keyboard navigable with visible focus rings
- Responsive layout: single column on mobile, two-column on desktop

## Testing

Run tests:

```bash
npm run test
```

Tests cover:
- **diffUtils**: Identical plans, changed/removed/added activity detection
- **validators**: Destination, dates, budget validation
- **sanitize**: HTML stripping, length limiting, passthrough
- **geminiService**: JSON parsing, markdown fence stripping, error handling, prompt builders
- **TripForm**: Rendering, disabled state, loading state

## Local Setup

```bash
git clone <repo-url>
cd Way-Shift-Engine
npm install
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY
npm run dev
```

The app works without an API key using built-in demo data.

## Deployment

```bash
npm run build
firebase login
firebase init hosting   # set public dir to dist, SPA: yes
firebase deploy
```

Alternative: `npx vercel --prod`

## Future Scope

- Real-time weather API integration for automatic rain detection
- Saved trips via Firebase Firestore
- Multi-language support via Google Translate API
- Voice input for disruptions via Web Speech API
- Collaborative trip planning with real-time sync
