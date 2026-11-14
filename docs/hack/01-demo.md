# Demo script

Assumes live, 3 minutes. Presenter: Britney. Each teammate says one line about their part.

## The pitch in one breath
- **Who:** Marisol Vega, a renter-turned-homeowner in Rose Park, Salt Lake City.
- **Problem:** the facts about Utah's water, lake dust and power are spread across a dozen agency sites, so she can't tell which of her own habits matters.
- **Hook:** today's Great Salt Lake level and today's air reading, live. "This is Utah this morning."
- **What we built:** six questions, two minutes, and you see your water, power and air numbers, the changes that matter most, and where every number came from.

## Presentation model
- [x] **The app is the demo.** Three screens, one path, no slides.

## Three moments
1. **The problem made visible:** `/` shows the live lake level and air reading, then six quick questions.
2. **The product does the thing:** `/results` shows her three numbers against a typical Utah home and her top three changes, each with a Utah program.
3. **Proof it can be trusted:** she asks a question; Gemini answers from our sources and shows which ones. `/sources` lists every number and assumption.

## Script (3 minutes)
| Time | Route | Do | Say |
|---|---|---|---|
| 0:00–0:20 | `/` | Point at the lake and air readings | "This is Utah this morning: the lake level from USGS and the air outside. The facts exist, but they're spread across a dozen sites." |
| 0:20–0:50 | `/check` | Answer the six questions as Marisol | "Marisol answers six questions on her phone. No account. Nothing leaves her browser except the answers used for the math." |
| 0:50–1:40 | `/results` | Scroll the three cards, then the top actions | "Her water, her power, her driving, each next to a typical Utah home. These are her three biggest changes, with the Utah program that helps pay for each." (Jenn, Jennifer, Britney: one line each on the part they built.) |
| 1:40–2:20 | `/results` | Type "Does my lawn really affect the lake?" | "She can ask. Gemini answers only from our sourced facts and shows which ones. If we don't have a source, it says so. The numbers come from our formulas, not from the model." |
| 2:20–2:45 | `/sources` | Scroll | "Every number, its source, and what is an estimate." |
| 2:45–3:00 | `/` | Show the QR code | "Four of us built this today, three of us with a coding agent for the first time. Scan it and try your own." |

## Judge taps
- `https://utah-footprint.vercel.app/`, `https://utah-footprint.vercel.app/results?sample=marisol`, `https://utah-footprint.vercel.app/sources`

## Demo mode and safety net
- `DEMO_MODE=fixtures`: sample household, cached plan and cached answers to three questions. No network.
- Live Gemini calls show progress within 2 seconds and fall back to the cached answer after 15 seconds.
- Reset: `/?reset=1`.

## Fallbacks
| Problem | Do |
|---|---|
| Wi-Fi down | hotspot, then fixtures mode |
| Gemini slow | ask one of the three cached questions |
| Site down | `localhost` in fixtures mode |

## Rehearsal log
| Time | Length | What broke or confused |
|---|---|---|
