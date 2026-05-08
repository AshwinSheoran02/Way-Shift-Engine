
```markdown
# Wayshift — Antigravity Build Instructions

## Product

**Name:** Wayshift  
**Tagline:** Plan once. Replan instantly. Understand why.  
**Core idea:** A constraint-aware travel disruption recovery engine. Not a generic itinerary generator. The primary feature is a natural-language chatbot that detects disruptions from plain English ("my flight is delayed by 2 hours", "it's raining", "I'm exhausted") and surgically replans only the affected segments of an existing trip — showing a visual diff and a plain-English explanation of every change.

---

## What to Build

Build a React + TypeScript + Vite web application called **Wayshift** with two modes:

1. **Planner mode** — user inputs trip preferences (destination, dates, budget, energy level, interests) and Gemini generates a structured day-by-day itinerary as typed JSON
2. **Replanner mode (primary mode)** — a chatbot interface where the user types a natural-language disruption. Gemini detects the disruption type, surgically replans only the affected activities, and returns a new plan. The app shows a side-by-side or inline visual diff of what changed, with an explainability panel explaining each change.

The user can either:
- Generate a new trip plan using the Planner form, which automatically loads into the Replanner
- Or paste/type a plain-text existing trip description into a text area in the Replanner, which Gemini parses into the typed TripPlan schema before chatbot replanning begins

---

## Stack

- React 18
- TypeScript with `strict: true` in tsconfig.json
- Vite
- Tailwind CSS (no other UI component libraries)
- Vitest for testing
- No database, no authentication, no payments, no external state management library

---

## TypeScript Types

Define these exact types in `src/types/trip.types.ts`:

```typescript
export type ActivityCategory = 'food' | 'culture' | 'adventure' | 'rest' | 'transport' | 'shopping';

export interface Activity {
  id: string;
  time: string;
  title: string;
  location: string;
  description: string;
  category: ActivityCategory;
  durationMinutes: number;
  mapsUrl: string; // Google Maps search URL
}

export interface Day {
  dayNumber: number;
  date: string;
  activities: Activity[];
}

export interface TripPlan {
  destination: string;
  days: Day[];
  totalBudgetINR: number;
  constraints: string[];
  generatedAt: string;
}

export type DisruptionIntent =
  | 'FLIGHT_DELAY'
  | 'TRAIN_DELAY'
  | 'RAIN'
  | 'EXHAUSTED'
  | 'BUDGET_CUT'
  | 'VENUE_CLOSED'
  | 'TRAFFIC'
  | 'SAFETY_ALERT'
  | 'WORK_CALL'
  | 'DIETARY_CHANGE'
  | 'LOW_MOBILITY'
  | 'UNKNOWN';

export interface ReplanResult {
  updatedPlan: TripPlan;
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
  reasoning: string;
  disruptionDetected: DisruptionIntent;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  replanResult?: ReplanResult;
  timestamp: string;
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  budgetPerDayINR: number;
  energyLevel: 'relaxed' | 'active' | 'intense';
  interests: string[];
  constraints: string[];
}
```

Define these in `src/types/disruption.types.ts`:

```typescript
export interface DisruptionContext {
  rawMessage: string;
  detectedIntent: DisruptionIntent;
  parameters: Record<string, string>; // e.g. { delayHours: '2', dayAffected: '1' }
}
```

---

## Folder Structure

Create exactly this structure:

```
src/
  components/
    Planner/
      TripForm.tsx          # Preferences input form
      TripForm.test.tsx
    Replanner/
      ChatInterface.tsx     # Chatbot input + message thread
      ChatMessage.tsx       # Single message bubble
      DiffView.tsx          # Visual diff of changed activities
      ExplainPanel.tsx      # Reasoning panel below diff
      ImportTrip.tsx        # Paste existing trip text area
    ItineraryView/
      ItineraryView.tsx     # Full plan display, day by day
      ActivityCard.tsx      # Single activity card
      DayColumn.tsx         # Day wrapper
    MapView/
      MapView.tsx           # Google Maps embed iframe
    Layout/
      Header.tsx
      ModeToggle.tsx        # Switch between Planner and Replanner tabs
    ErrorBoundary/
      ErrorBoundary.tsx
  hooks/
    useGemini.ts            # API calls, loading, error, fallback
    useItinerary.ts         # TripPlan state, updatePlan action
    useChat.ts              # Chat history, send message, parse replan
    useDisruption.ts        # Detect intent, trigger replan, return diff
  services/
    geminiService.ts        # Prompt builders, callGemini, parseResponse
    mapsService.ts          # buildMapsSearchUrl(location, destination)
    fallbackData.ts         # Full hardcoded Jaipur 3-day TripPlan + ReplanResults
    importParser.ts         # Parse pasted plain-text trip into TripPlan via Gemini
  types/
    trip.types.ts
    disruption.types.ts
  utils/
    sanitize.ts             # stripHtml, trimAndLimit(s, maxLen)
    diffUtils.ts            # computeDiff(oldPlan, newPlan): returns changed/added/removed IDs
    validators.ts           # validateTripForm(data): { valid, errors }
    promptBuilder.ts        # All Gemini prompt strings centralised here
  constants/
    disruptions.ts          # DISRUPTION_LABELS, DISRUPTION_EXAMPLES
    categories.ts           # CATEGORY_EMOJI map
  tests/
    services/
      geminiService.test.ts
    utils/
      diffUtils.test.ts
      validators.test.ts
      sanitize.test.ts
  App.tsx
  main.tsx
  vite.config.ts
  tailwind.config.ts
  tsconfig.json
  .env.example
  .gitignore
  firebase.json
  README.md
```

No file should exceed 200 lines. Split if needed.

---

## Services

### `src/services/geminiService.ts`

```typescript
// Handles all Gemini API communication. Never import API key directly — read from import.meta.env only.

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

export async function callGemini(prompt: string): Promise<string>
// POST to ENDPOINT with { contents: [{ parts: [{ text: prompt }] }] }
// On error or missing key, throw GeminiError with typed message
// Caller must handle with try/catch and fall back to fallbackData

export function buildPlanPrompt(formData: TripFormData): string
// Returns structured prompt asking Gemini to return ONLY valid JSON matching TripPlan schema
// Instruction: "Return ONLY a valid JSON object. No markdown. No commentary. No backticks."
// Include destination, dates, budget, energy level, interests, constraints in the prompt

export function buildReplanPrompt(currentPlan: TripPlan, userMessage: string): string
// Returns prompt that:
// 1. Receives the current TripPlan as JSON
// 2. Receives the user's natural language disruption message
// 3. Asks Gemini to detect DisruptionIntent from the message
// 4. Asks Gemini to replan only affected activities
// 5. Returns ONLY valid JSON matching ReplanResult schema
// Instruction: "Return ONLY a valid JSON object. No markdown. No commentary. No backticks."

export function buildImportPrompt(rawText: string): string
// Returns prompt that parses pasted plain-text trip description into TripPlan JSON schema

export function parseGeminiResponse<T>(raw: string): T
// Strips any accidental markdown fences
// JSON.parse the result
// Throws ParseError if invalid
```

### `src/services/mapsService.ts`

```typescript
// Builds Google Maps search URLs. No API key needed.

export function buildMapsSearchUrl(location: string, destination: string): string {
  const query = encodeURIComponent(`${location}, ${destination}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function buildMapsEmbedUrl(location: string, destination: string): string {
  const query = encodeURIComponent(`${location}, ${destination}`);
  return `https://maps.google.com/maps?q=${query}&output=embed`;
}
```

Every Activity generated by Gemini must have its `mapsUrl` populated by `buildMapsSearchUrl` before being stored in state.

### `src/services/fallbackData.ts`

Export:
- `FALLBACK_TRIP`: a complete hardcoded `TripPlan` for a 3-day trip to Jaipur with 4 activities per day
- `FALLBACK_REPLAN_RAIN`: a `ReplanResult` replacing outdoor activities with indoor ones
- `FALLBACK_REPLAN_DELAY`: a `ReplanResult` shifting the first day's afternoon activities by 2 hours
- `FALLBACK_REPLAN_EXHAUSTED`: a `ReplanResult` removing intense activities and adding rest stops

These are used when API key is missing or Gemini call fails.

### `src/services/importParser.ts`

```typescript
// Accepts raw pasted trip text. Calls Gemini to parse into TripPlan.
// If Gemini fails, returns FALLBACK_TRIP with a warning message.
export async function parseImportedTrip(rawText: string): Promise<{ plan: TripPlan; warning?: string }>
```

---

## Hooks

### `src/hooks/useGemini.ts`
- `callWithFallback<T>(prompt, fallback): Promise<T>` — calls Gemini, returns fallback on error
- Exposes `loading`, `error`, `clearError`

### `src/hooks/useItinerary.ts`
- Holds `currentPlan: TripPlan | null`
- Exposes `setPlan`, `updatePlan(replanResult: ReplanResult)`
- `updatePlan` replaces changed activities in-place and stores `previousPlan` for diff

### `src/hooks/useChat.ts`
- Holds `messages: ChatMessage[]`
- Exposes `sendMessage(userText: string)` — this is the core chatbot function:
  1. Appends user message to history
  2. Calls `buildReplanPrompt(currentPlan, userText)`
  3. Calls `callGemini` via `useGemini`
  4. Parses `ReplanResult`
  5. Calls `updatePlan` on `useItinerary`
  6. Appends assistant message with `replanResult` attached
  7. Falls back to appropriate FALLBACK_REPLAN if API fails

### `src/hooks/useDisruption.ts`
- Exposes `changedActivityIds`, `removedActivityIds`, `addedActivityIds`
- Exposes `lastReasoning: string`
- Exposes `lastIntent: DisruptionIntent`
- Updates whenever `useItinerary.updatePlan` is called

---

## Components

### `TripForm`
- Fields: Destination (text), Start Date, End Date, Budget per day (INR slider 1000–50000 step 500), Energy Level (3 radio buttons: Relaxed / Active / Intense), Interests (multi-select pill buttons: Food, Culture, Adventure, Shopping, Nature, Nightlife), Constraints (multi-select pill buttons: Vegetarian, Low walking, Elderly-friendly, Budget-conscious)
- All inputs have `<label htmlFor>` for accessibility
- Submit button disabled when destination is empty or dates are invalid
- On submit: call Gemini with `buildPlanPrompt`, parse result, call `setPlan`, switch app to Replanner mode
- On Gemini failure: load `FALLBACK_TRIP` and show a yellow banner "Using demo data — add VITE_GEMINI_API_KEY for live generation"

### `ChatInterface`
- A chat thread showing `messages` from `useChat`
- Text input at the bottom with a Send button
- On send: calls `sendMessage(text)`, clears input
- Input has `aria-label="Describe what changed in your trip"`
- Pressing Enter sends the message
- Show a typing indicator (animated dots) while `loading` is true
- Each assistant message that contains a `replanResult` renders the `DiffView` and `ExplainPanel` inline below the message bubble

### `ChatMessage`
- Renders a single message bubble
- User messages: right-aligned, subtle background
- Assistant messages: left-aligned
- If `message.replanResult` exists, renders `DiffView` + `ExplainPanel` below the bubble

### `DiffView`
- Shows a compact before/after comparison of changed activities
- Changed activities: amber left border + badge "⚡ Modified"
- Removed activities: red left border + badge "✕ Removed" + strikethrough title
- Added activities: green left border + badge "+ Added"
- Unchanged activities: not shown in DiffView (they appear in ItineraryView only)
- Color difference is ALSO communicated by icon/text badge — never by color alone

### `ExplainPanel`
- Expandable accordion below DiffView
- Title: "Why did Wayshift change this?"
- Body: `replanResult.reasoning` from Gemini
- Shows `disruptionDetected` as a human-readable label: e.g. "Disruption detected: Flight delay"
- Uses `<details>/<summary>` HTML elements for native keyboard accessibility

### `ImportTrip`
- A `<textarea>` where user can paste an existing trip in any format (bullet points, paragraphs, other AI output)
- Below it: a button "Parse and Load Trip"
- On click: calls `parseImportedTrip(rawText)`, shows loading state, calls `setPlan` on success
- Shows warning banner if fallback was used

### `ItineraryView`
- Renders the full `currentPlan` day by day
- Each day in a `DayColumn`
- Each activity in an `ActivityCard`
- Activities whose IDs are in `changedActivityIds` get amber highlight + ⚡ badge
- Activities whose IDs are in `removedActivityIds` get red strikethrough styling
- Activities whose IDs are in `addedActivityIds` get green highlight + + badge
- The entire itinerary section has `aria-live="polite"` so screen readers announce updates

### `ActivityCard`
- Shows: time badge, category emoji, title, location (as a Google Maps link — `target="_blank" rel="noopener noreferrer"`), description, duration
- Wrap in `React.memo`
- Props: `activity: Activity`, `status: 'changed' | 'added' | 'removed' | 'unchanged'`

### `MapView`
- Shows a Google Maps embed `<iframe>` for the currently selected day's first activity location
- `<iframe>` has a `title` attribute: `title="Map of {location}"`
- Updates when the plan changes
- Has a visible fallback text if iframe fails to load

### `ModeToggle`
- Two tab buttons: "Plan a Trip" and "Replan / Chat"
- Keyboard navigable, `role="tablist"` with `role="tab"` on each button
- Switches between showing `TripForm` and `ChatInterface + ItineraryView`

### `ErrorBoundary`
- Wraps the whole app
- Shows a friendly error screen on uncaught exceptions
- Includes a "Reload" button

---

## Utils

### `src/utils/sanitize.ts`
```typescript
export function sanitizeInput(s: string): string
// Strips HTML tags using regex replace, trims whitespace, limits to 500 characters
// Apply to ALL user text inputs before they are inserted into Gemini prompts
```

### `src/utils/diffUtils.ts`
```typescript
export function computeDiff(oldPlan: TripPlan, newPlan: TripPlan): {
  changedActivityIds: string[];
  removedActivityIds: string[];
  addedActivityIds: string[];
}
// Compare activities by ID across all days
// Changed: same ID, different title or time or location
// Removed: ID in oldPlan not in newPlan
// Added: ID in newPlan not in oldPlan
```

### `src/utils/validators.ts`
```typescript
export function validateTripForm(data: TripFormData): { valid: boolean; errors: Record<string, string> }
// destination: required, min 2 chars
// startDate: must be today or future
// endDate: must be after startDate
// budgetPerDayINR: must be > 0
```

### `src/utils/promptBuilder.ts`
Centralise ALL Gemini prompt strings here. No prompt strings should appear inline in components or hooks.

---

## Constants

### `src/constants/disruptions.ts`
```typescript
export const DISRUPTION_LABELS: Record<DisruptionIntent, string> = {
  FLIGHT_DELAY: 'Flight delay',
  TRAIN_DELAY: 'Train delay',
  RAIN: 'Rain or bad weather',
  EXHAUSTED: 'Traveller fatigue',
  BUDGET_CUT: 'Budget reduced',
  VENUE_CLOSED: 'Venue or attraction closed',
  TRAFFIC: 'Traffic or road issue',
  SAFETY_ALERT: 'Safety concern',
  WORK_CALL: 'Unexpected work commitment',
  DIETARY_CHANGE: 'Dietary constraint changed',
  LOW_MOBILITY: 'Low mobility or elderly-friendly required',
  UNKNOWN: 'Disruption detected',
};

export const DISRUPTION_EXAMPLES: string[] = [
  'My flight is delayed by 2 hours',
  "It's raining heavily outside",
  "I'm too tired for the fort visit",
  'The museum is closed today',
  'We need to cut ₹2000 from today\'s budget',
  'I have an urgent work call at 3pm',
  'One person in our group has low mobility',
];
```

### `src/constants/categories.ts`
```typescript
export const CATEGORY_EMOJI: Record<ActivityCategory, string> = {
  food: '🍽️',
  culture: '🏛️',
  adventure: '🧗',
  rest: '🛋️',
  transport: '🚗',
  shopping: '🛍️',
};
```

---

## Security Requirements

- API key accessed ONLY via `import.meta.env.VITE_GEMINI_API_KEY` — never hardcoded anywhere
- `.env` is in `.gitignore`
- `.env.example` committed with: `VITE_GEMINI_API_KEY=your_gemini_api_key_here`
- `sanitizeInput()` from `src/utils/sanitize.ts` is called on every user text input before it enters any Gemini prompt
- No `dangerouslySetInnerHTML` anywhere in the codebase
- All external links use `target="_blank" rel="noopener noreferrer"`
- No user data is stored, sent to any third party, or persisted beyond the browser session
- Add a one-line disclaimer in the UI footer: "Wayshift uses Google Gemini AI. Verify important travel information with official sources."
- Add a `Content-Security-Policy` meta tag in `index.html`

---

## Efficiency Requirements

- Zero external UI component libraries — Tailwind only
- No Redux, Zustand, or other state libraries — React useState and useReducer only
- `ActivityCard` must be wrapped in `React.memo`
- `useCallback` on all event handlers passed as props
- Gemini calls are not made on every keystroke — only on explicit submit/send
- Fallback data loads synchronously — zero latency if API is down
- No images or large binary assets in the repo
- `vite.config.ts` should have `build.chunkSizeWarningLimit` set to 500
- The production build must complete with zero TypeScript errors and zero Vite warnings

---

## Testing Requirements

Create the following test files using Vitest:

### `src/utils/diffUtils.test.ts`
- Test: two identical plans return empty arrays for all three diff categories
- Test: activity with same ID but changed title appears in `changedActivityIds`
- Test: activity ID missing from new plan appears in `removedActivityIds`
- Test: activity ID in new plan but not old plan appears in `addedActivityIds`

### `src/utils/validators.test.ts`
- Test: empty destination returns `valid: false` with destination error
- Test: past start date returns `valid: false` with date error
- Test: end date before start date returns `valid: false`
- Test: budget of 0 returns `valid: false`
- Test: valid complete form returns `valid: true` with no errors

### `src/utils/sanitize.test.ts`
- Test: HTML tags are stripped from input
- Test: input exceeding 500 characters is trimmed
- Test: normal text passes through unchanged

### `src/services/geminiService.test.ts`
- Test: `parseGeminiResponse` with valid JSON returns parsed object
- Test: `parseGeminiResponse` with markdown-wrapped JSON strips fences and parses
- Test: `parseGeminiResponse` with invalid JSON throws ParseError
- Test: `buildPlanPrompt` includes destination in output string
- Test: `buildReplanPrompt` includes user message and plan in output string

### `src/components/Planner/TripForm.test.tsx`
- Test: renders without crash
- Test: submit button is disabled when destination is empty
- Test: submit button is enabled when required fields are filled

Add to `package.json` scripts:
```json
"test": "vitest run",
"test:watch": "vitest"
```

---

## Accessibility Requirements

- Every `<input>`, `<select>`, and `<textarea>` must have a `<label htmlFor>` or `aria-label`
- All buttons must have visible, descriptive text or `aria-label`
- Disruption chat input must have `aria-label="Describe what changed in your trip"`
- The itinerary section must have `aria-live="polite"` — when the plan updates, screen readers announce the change
- The ExplainPanel uses `<details>/<summary>` for native keyboard accessibility
- ModeToggle uses `role="tablist"`, `role="tab"`, `aria-selected` on each tab
- Color differences in DiffView are always accompanied by a text badge (⚡ Modified, + Added, ✕ Removed) — never color alone
- Focus must return to the chat input after a replan completes
- All `<iframe>` elements must have a `title` attribute
- Minimum font size: 14px throughout
- All interactive elements must have visible focus rings — do not set `outline: none` without replacement
- The layout must be responsive: single column on mobile, two-column on desktop

---

## Google Services Integration

### Gemini 1.5 Flash
- Used for: initial trip plan generation, natural-language disruption detection, surgical replanning, import parsing
- API key: `import.meta.env.VITE_GEMINI_API_KEY`
- Model: `gemini-1.5-flash`
- Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- Fallback: `FALLBACK_TRIP` and `FALLBACK_REPLAN_*` constants used on API failure

### Google Maps
- Every activity has a `mapsUrl` field built by `buildMapsSearchUrl(location, destination)`
- Format: `https://www.google.com/maps/search/?api=1&query=ENCODED_LOCATION`
- No billing required for search URLs
- `MapView` component renders a Google Maps embed `<iframe>` for the selected day
- Embed URL format: `https://maps.google.com/maps?q=ENCODED_LOCATION&output=embed`

### Firebase Hosting (Deployment)
- Add `firebase.json` configured for hosting from `dist/`
- README deployment section must include:
  1. `npm run build`
  2. `firebase login`
  3. `firebase init hosting` (select `dist` as public directory, SPA: yes)
  4. `firebase deploy`
- Also mention Vercel as a simpler alternative: `npx vercel --prod`

---

## README

Create `README.md` with exactly these headings and content guidance:

```
# Wayshift — Travel Resilience Engine

## Challenge Vertical
Travel Planning and Experience Engine

## Problem Statement
Most AI travel tools generate trips. None of them handle disruption. Real travel rarely goes as planned — flights delay, it rains, budgets shrink, travellers get tired. Wayshift solves the second problem: what happens after the plan breaks.

## Solution Overview
Wayshift is a constraint-aware travel disruption recovery engine with two modes:
- **Planner**: generate a structured day-by-day itinerary from preferences
- **Replanner**: a natural-language chatbot that detects disruptions and surgically repairs the plan

## Why This Is Dynamic
[3 bullet points explaining: chatbot disruption detection, surgical replan of only affected segments, visual diff showing exactly what changed]

## User Journey
1. Enter destination, dates, budget, energy level, interests
2. Wayshift generates a structured itinerary via Gemini
3. User types a disruption in plain English: "my flight is delayed by 2 hours"
4. Wayshift detects the disruption type, calls Gemini to replan only affected activities
5. A diff view shows what changed: modified, added, and removed activities
6. An explainability panel shows why each change was made

## Approach and Logic
[Describe the two-prompt Gemini architecture: plan prompt and replan prompt, how diff is computed, how fallback works]

## Assumptions Made
- Works fully with demo data if VITE_GEMINI_API_KEY is missing
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
- API key stored in .env only, never committed
- All user inputs sanitised before entering Gemini prompts
- No personal data collected or transmitted beyond Gemini API calls
- No dangerouslySetInnerHTML used anywhere
- External links use rel="noopener noreferrer"

## Accessibility Considerations
- All form inputs have associated labels
- Itinerary section uses aria-live="polite" for screen reader announcements
- Diff view communicates changes by text badges, not color alone
- Fully keyboard navigable
- Responsive layout: mobile and desktop

## Testing
Run tests:
\`\`\`bash
npm run test
\`\`\`
Tests cover: diff computation, form validation, input sanitisation, Gemini response parsing, component rendering.

## Local Setup
\`\`\`bash
git clone <repo-url>
cd wayshift
npm install
cp .env.example .env
# Edit .env and add your VITE_GEMINI_API_KEY
npm run dev
\`\`\`
The app works without an API key using built-in demo data.

## Deployment
\`\`\`bash
npm run build
firebase login
firebase init hosting   # set public dir to dist, SPA: yes
firebase deploy
\`\`\`
Alternative: \`npx vercel --prod\`

## Future Scope
- Real-time weather API integration for automatic rain detection
- Saved trips via Firebase Firestore
- Multi-language support via Google Translate API
- Voice input for disruptions via Web Speech API
```

---

## Refactor Prompt (Run After Initial Build)

Paste this as a second Antigravity prompt after the initial build:

```
Audit and refactor the Wayshift codebase against these exact criteria. Do not add new features. Only improve existing code.

CODE QUALITY:
- Add a JSDoc comment block to every exported function and component
- Replace any `any` type with a proper TypeScript interface
- Confirm no single file exceeds 200 lines — split if needed
- Move all Gemini prompt strings to src/utils/promptBuilder.ts if not already there
- Confirm all disruption labels and category emojis are in src/constants/ not inline

SECURITY:
- Grep for any hardcoded string starting with "AIza" — remove if found
- Confirm sanitizeInput() is called before every Gemini prompt construction
- Confirm .env is in .gitignore and .env.example exists
- Confirm no dangerouslySetInnerHTML exists anywhere
- Add Content-Security-Policy meta tag to index.html if missing

EFFICIENCY:
- Confirm ActivityCard is wrapped in React.memo
- Confirm all handlers passed as props use useCallback
- Confirm fallback data is not fetched from network — it must be a local import
- Run npm run build and confirm zero TypeScript errors and zero Vite chunk warnings

TESTING:
- Confirm all five test files exist: diffUtils.test.ts, validators.test.ts, sanitize.test.ts, geminiService.test.ts, TripForm.test.tsx
- Confirm every test uses vi.mock for fetch — no real API calls in tests
- Add a test confirming that when VITE_GEMINI_API_KEY is undefined, callGemini throws GeminiError
- Run npm run test and confirm all tests pass

ACCESSIBILITY:
- Confirm aria-live="polite" is on the itinerary container
- Confirm ModeToggle uses role="tablist" and role="tab"
- Confirm ExplainPanel uses <details>/<summary>
- Confirm all <iframe> elements have a title attribute
- Confirm no outline: none appears in CSS without a replacement focus style
- Confirm the chat input receives focus after each replan completes

GOOGLE SERVICES:
- Confirm README has a table under "Google Services Used" listing Gemini, Maps Search URLs, Maps Embed, Firebase
- Confirm geminiService.ts explicitly names the model as gemini-1.5-flash in the endpoint
- Confirm every Activity object has its mapsUrl populated before being stored in state
```

---

## Final Submission Audit Prompt

Paste this as a third Antigravity prompt before submitting:

```
Perform a final submission audit of the Wayshift repository. Check each item. Report PASS or FAIL. Fix all FAILs before submission.

1. REPO SIZE
   Run: du -sh . (excluding node_modules and .git)
   Must be under 10 MB. If over: check for committed node_modules, large images, or dist/ in repo.

2. SINGLE BRANCH
   Run: git branch
   Must show only one branch named main. Delete any other branches.

3. NO SECRETS
   Run: grep -r "AIza" src/
   Must return nothing. Also confirm .env is not committed.

4. BUILD PASSES
   Run: npm run build
   Must complete with zero errors and zero TypeScript strict-mode violations.

5. TESTS PASS
   Run: npm run test
   All tests must pass. Minimum 15 passing test assertions.

6. README COMPLETE
   Confirm README.md has all of these headings:
   - Challenge Vertical
   - Problem Statement
   - Solution Overview
   - Why This Is Dynamic
   - User Journey
   - Approach and Logic
   - Assumptions Made
   - Google Services Used (as a table)
   - Security Considerations
   - Accessibility Considerations
   - Testing
   - Local Setup
   - Deployment
   - Future Scope

7. FALLBACK WORKS
   Remove VITE_GEMINI_API_KEY from .env temporarily.
   Start the app: npm run dev
   Confirm: FALLBACK_TRIP loads automatically, yellow banner appears, chat still works using fallback replans, DiffView renders correctly.
   Restore the key.

8. LIVE DEPLOYMENT
   Confirm the app is deployed and accessible at a public URL.
   Add the URL to:
   - README.md at the top under the project name
   - GitHub repository website field

9. DEMO FLOW (60 seconds)
   Run through this exact sequence and confirm everything works:
   Step 1: Open app — Planner tab is shown by default
   Step 2: Enter "Jaipur", dates, budget ₹5000/day, Energy: Active, Interests: Culture + Food
   Step 3: Click "Build My Trip" — itinerary appears within 5 seconds (or fallback loads instantly)
   Step 4: Switch to "Replan / Chat" tab
   Step 5: Type "My flight is delayed by 2 hours" and press Enter
   Step 6: Typing indicator appears, then assistant message appears with DiffView showing amber/red/green activity cards
   Step 7: Click "Why did Wayshift change this?" — ExplainPanel expands showing plain-English reasoning
   Step 8: Confirm ItineraryView updated with same highlights
   Step 9: Click any activity's location link — Google Maps opens in new tab
   If any step fails, fix before submitting.

10. GOOGLE SERVICES MENTION
    Confirm README Google Services Used table has at least 3 rows.
    Confirm geminiService.ts uses gemini-1.5-flash.
    Confirm the deployed app footer mentions Google Gemini.
```

---

## 60-Second Demo Script

> "Real travel never goes as planned. Wayshift doesn't just generate trips — it repairs them.

> I'll type a destination — Jaipur — add my budget and energy level, and hit Build. Wayshift calls Gemini and generates a structured 3-day itinerary. Every activity links directly to Google Maps.

> Now — the interesting part. I'll switch to the Replanner and type exactly what a traveller would say: *'My flight is delayed by 2 hours.'*

> Wayshift detects the disruption, sends the existing plan plus the message to Gemini, and gets back a surgical replan. Watch — only the affected afternoon activities change. The morning is untouched. The diff shows exactly what was modified, what was removed, and what was added — in amber, red, and green.

> I'll click 'Why did Wayshift change this?' — and it explains in plain English: the fort visit was dropped because of the time loss, replaced with a closer rooftop restaurant.

> That's the core. Plan once, chat to replan, see the diff, understand why. Built with Gemini 1.5 Flash, Google Maps, deployed on Firebase."
```
