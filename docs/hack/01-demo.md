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

## Script (2:00, then questions). Presenters: Jenn and Jennifer
Assumes 2 minutes plus questions (format still to confirm with a host). Deck: 9 slides shown (slide 9 "Why you can trust it" is hidden; un-hide it if there are 3 minutes). QR code on the first and last slides. Slide notes hold each line.
Goal line, at the open and the close: **"Most Utahns can't see their environmental impact, so they can't reduce it. We make it visible, then show you how you can actually make a difference."**

| Time | Slide / app screen | Who | Do · Say |
|---|---|---|---|
| 0:00–0:12 | 1 Cover (QR code top right) | Jenn | Goal line. "We're team Ctrl + Alt + Conserve. I'm Jenn, this is Jennifer, and with Craig and Britney we built EcoSwitch today." |
| 0:12–0:22 | 2 Problem · home page | Jenn | Point at "The Great Salt Lake is … feet below healthy." "The facts are spread across a dozen agency sites, so a family can't tell which habits matter." |
| 0:22–0:34 | 3 How it works · `/check` | Jennifer | "Six questions on your phone, English or Spanish, no account: lawn, commute and car, heat." |
| 0:34–0:52 | 4 Water · `/results` | Jenn | Under WATER in the top strip, click "Details and sources". "$160 a year to water an 1,800 sq ft lawn; a smart controller saves $89 with a $100 rebate; 91% of yard water never flows back to the rivers." |
| 0:52–1:06 | 5 Energy · Energy card | Jennifer | Scroll to Energy. "About 60% of 20,400 lbs of CO2 is the power bill: Utah's plants are 8th highest per MWh. Insulation saves about $220 a year." |
| 1:06–1:20 | 6 Air · Air card | Jenn | Scroll to Air. "A 6-mile commute costs about $530 a year in gas; sharing it saves $270. An electric car counts at about a third of a gas car." |
| 1:20–1:34 | 7 Ask · "Ask about your numbers" | Jennifer | Scroll UP (it sits above the cards); tap "Does my lawn really affect the lake?" "Gemini answers only from our 41 sourced facts and names them. Our formulas do the math." |
| 1:34–1:46 | 8 Track my progress · `/progress` | Jennifer | Bottom of results, "Track my progress"; tap "I started this" on carpool. "Mark a change you've started and it tracks the dollars, CO2 and gallons saved since. It stays in your browser." |
| 1:46–2:00 | 10 Close (QR code) | Jenn | "We're Ctrl + Alt + Conserve: Jenn, Jennifer, Craig and Britney." Goal line. "Scan the code and try your own home." Then questions. |

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
