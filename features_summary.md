# Wayshift Travel Resilience Engine — Feature Summary

Wayshift is a next-generation travel itinerary generator and disruption recovery engine powered by Gemini. It was designed from the ground up to handle the reality of travel: *things change*.

Here is a summary of all the key features built into this application:

### 1. AI-Powered Trip Generation
*   **Context-Aware Itineraries**: Generate fully detailed trips by providing a destination, start/end dates, daily budget, energy level, specific interests (Food, Culture, etc.), and constraints (Vegetarian, Low walking, etc.).
*   **Precise Constraints**: The engine passes these explicit preferences to the Gemini 2.5 Flash Lite API to ensure recommendations fit the user’s exact travel style.
*   **Google Maps Integration**: Every generated activity tile automatically includes an expandable, interactive Google Maps embed specifically targeting the recommended venue.

### 2. The "Replanner" Chat Engine (Disruption Recovery)
*   **Conversational Recovery**: If it rains, a flight is delayed, or the user is too tired for a hike, they simply chat with the AI in plain English.
*   **Intelligent Diffing**: Wayshift doesn't just regenerate a brand new itinerary. It keeps the unaffected parts of the trip completely intact and *only* surgically replaces the activities that need to change.
*   **Visual Diffs**: Any modifications are visually highlighted. Modified activities are flagged with a yellow "⚡ Modified" badge, added activities are green, and removed activities are crossed out.
*   **"Why did Wayshift change this?" Panel**: Every disruption includes an expandable explanation panel detailing the detected disruption type (e.g., `RAIN`, `FLIGHT_DELAY`) and the AI's reasoning for the specific changes it made.

### 3. Dynamic UI & Google Design Language
*   **Light-First & Edge-to-Edge Layout**: A modern, expansive layout utilizing the full width of the screen (`max-w-4xl` for planning, and a split 50/50 view for replanning).
*   **Google Brand Colors**: The entire application uses official Google brand colors (`#4285F4` Blue, `#EA4335` Red, `#FBBC04` Yellow, `#34A853` Green) for primary actions, badges, typing indicators, and the header color bar.
*   **Sticky Day Headers**: As users scroll through long itineraries, the "Day X" badge sticks to the top of the column for easy contextual navigation.

### 4. Advanced Tooling & Portability
*   **One-Click "Save Plan"**: Users can instantly download their generated or newly-replanned itinerary as a cleanly formatted `.txt` file for offline access.
*   **Trip Import**: Instead of generating a trip from scratch, users can paste a plain-text itinerary generated from ChatGPT or Claude. The engine will parse it into a structured JSON plan and make it ready for the disruption chat engine.

### 5. Technical Foundations
*   **Tech Stack**: Built on React 19, Vite 8, TypeScript, and TailwindCSS v4.
*   **Resilience & Error Boundaries**: Includes custom React Error Boundaries and robust API fallback strategies. If the API fails or a key is invalid, the UI gracefully downgrades to local fallback data while showing exact API error traces to the developer.
*   **Automatic State Cleanup**: Generating or importing a new trip automatically clears the old chat history, preventing cross-contamination of different trip states.

---
*Built as a showcase for LLM structured output parsing, differential state updates, and dynamic UI rendering.*
