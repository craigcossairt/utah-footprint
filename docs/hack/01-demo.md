# Demo script

Assumes live, 3 minutes. Presenters: Jenn and Jennifer (Britney and Craig are not presenting).

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

## Script (2:50). Presenters: Jenn and Jennifer
Deck: 9 slides, exportable to Google Slides (slide notes hold each line). Run the live site beside the deck.
Goal line, said at the open and the close: **"Most Utahns can't see their environmental impact, so they can't reduce it. We make it visible, then show you how you can actually make a difference."**

| Time | Slide / route | Who | Say |
|---|---|---|---|
| 0:00–0:15 | 1 Cover | Jenn | The goal line. "I'm Jenn, this is Jennifer, and with Craig and Britney we built My Utah Footprint today." |
| 0:15–0:35 | 2 Problem · `/` | Jenn | "This is Utah this morning: the Great Salt Lake from the USGS gauge, below its healthy range, and the air outside. The facts exist, but they're spread across a dozen agency sites." |
| 0:35–0:55 | 3 How it works · `/check` | Jennifer | "Marisol lives in Rose Park. Six questions on her phone, English or Spanish, no account. Her lawn, her commute and what her car runs on, her heating." |
| 0:55–1:20 | 4 Water · `/results` | Jenn | "I built water. Watering her lawn costs about $160 a year; a smart controller saves about $89, with a $100 state rebate. The state now estimates 91% of yard water never flows back to the rivers, so yards are the part households control." |
| 1:20–1:40 | 5 Energy | Jennifer | "I built energy. About 20,400 lbs of CO2 a year, 60% from her power bill: Utah's power plants are 8th highest per MWh. Insulation saves her about $220 a year, with a ThermWise rebate." |
| 1:40–2:00 | 6 Air | Jennifer | "Britney built driving and air. Her commute costs about $530 a year in gas; sharing it saves about $270. An electric car counts at about a third of a gas car on Utah's grid." |
| 2:00–2:20 | 7 Ask · `/results` | Jennifer | Type "Does my lawn really affect the lake?" "Gemini answers only from our sourced facts and names them. No source, it says so. The numbers come from our formulas, not the model." |
| 2:20–2:35 | 8 Trust · `/sources` | Jenn | "Every number has an official source we opened today. Estimates are labelled, assumptions listed, nothing personal stored." |
| 2:35–2:50 | 9 Close · `/` QR | Jenn | "Four of us built this today, three with a coding agent for the first time." The goal line again. "Scan it and try your own home." |

Numbers are the sample home (Marisol: 4 people, 1,800 sq ft lawn, 6-mile commute, gas heat) as shown on `/results` at 12:35.

**If the map lanes ship (optional, cut first):** at 0:20–0:50, on the lawn question tap "Measure it on a map", trace Marisol's
lawn, and use the number; on the commute question, type her two addresses. Say: "She doesn't have to guess her lawn or her
miles. She traces the grass on the satellite map, and Google Maps measures her drive. The addresses aren't kept." Keep it
under 30 seconds or skip it; use a pre-picked address so the map loads on her block.

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
