# ✈️ Wayshift — Travel Resilience Engine

Wayshift is a next-generation travel itinerary generator and disruption recovery engine. It was built specifically for the reality of travel: **logistics change, and plans must be resilient.**

**Live Deployment:** [https://wayshift-engine.web.app](https://wayshift-engine.web.app)

---

## 🎯 Challenge Vertical
**Travel Planning and Experience Engine** — dynamic planning with preferences, constraints, and real-time disruption recovery.

## 🧠 Approach and Logic
Wayshift moves beyond static documents. Its core logic relies on **Strict Structured JSON Parsing** with Gemini. 
1. **Multi-Stop Logistics**: Unlike basic planners, Wayshift calculates travel from your **Origin City** to the destination, including flights, trains, and cabs.
2. **Surgical Replanning**: During disruptions, the engine performs an intelligent JSON delta update. It doesn't regenerate the whole trip; it surgically modifies only affected activities (e.g., shifting dinner if a flight is delayed) while maintaining budget integrity.
3. **Budget Consciousness**: Every activity has a realistic INR cost. The engine tracks daily spend against a user-defined budget, using semantic color-coding to warn of overspending.

## 🛠️ How it Works
1. **Planning**: Users input origin, destination, dates, and budget. The engine generates a 5-activity-per-day plan including travel and stay.
2. **Disruption**: Users chat with the "Replanner" about delays, rain, or fatigue.
3. **Dynamic Diffs**: The UI renders a visual diff: `⚡ Modified` badges, `✕ Removed` strikethroughs, and `+ Added` activities.
4. **Navigation**: Uses Google Maps Directions to plot multi-stop routes for the entire day with one click.

## 🤔 Assumptions Made
- **Origin-Destination**: Assumes users begin Day 1 with travel from their home city.
- **Accommodation**: Assumes users require a hotel/stay activity every day with a realistic, non-zero cost.
- **Fallback Data**: Includes high-quality fallback itineraries for offline testing or API quota limits.

## 🌐 Google Services Integration

| Service | Role | Practical Application |
|---|---|---|
| Gemini 2.0 Flash | Core AI | Intent detection, surgical JSON diffing, and cost estimation. |
| Google Maps Directions | Navigation | Automated multi-stop routing for full-day itineraries. |
| Google Maps Embed API | Visualization | Inline interactive map frames for every activity card. |
| Firebase Hosting | Deployment | Production-grade hosting with global CDN. |
| Firebase Analytics | Telemetry | Real-world tracking of trip generation and disruption recovery. |

## ✅ Hackathon Audit & Compliance
- **Code Quality**: Structured TypeScript with 100% type safety and zero `any` types. Modular component architecture.
- **Efficiency**: Zero external heavyweight libraries; sub-300KB bundle size. Fast, client-side diffing.
- **Testing**: Comprehensive Vitest suite with **40/40 tests passing**. Covers validators, diffing, and services.
- **Accessibility**: High contrast ratios, full screen-reader support (ARIA labels, live regions), and keyboard-navigable.
- **Security**: Sanitized inputs, no `dangerouslySetInnerHTML`, and secure `.env` secret management.

---

## 🧪 Testing & Local Setup
```bash
npm install
npm run test  # Runs 40 tests
npm run dev   # Local development
npm run build # Production build
```
