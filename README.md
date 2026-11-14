# EcoSwitch

Six questions, two minutes: see your Utah home's water, power and air numbers next to a typical
Utah home, the changes that matter most, and where every number came from.

**Live:** https://utah-footprint.vercel.app

<!-- Craig: save a screenshot of the home page or /results?sample=marisol as public/readme-hero.png, then uncomment the next line. -->
<!-- ![EcoSwitch results for a sample Rose Park home](public/readme-hero.png) -->

**Video:** to be added by Craig before submission.

Built at Hack for Humanity: Salt Lake City (14 Nov 2026), track 02, Environment: "Water, Lake Dust &
Data Centers", by Craig, Jenn, Jennifer and Britney. MIT license. Open data only.

## Try it (no login, no typing needed)
| Link | What to look for |
|---|---|
| [`/`](https://utah-footprint.vercel.app/) | Today's Great Salt Lake level (USGS) and air (Open-Meteo), then "Check my home" |
| [`/results?sample=marisol`](https://utah-footprint.vercel.app/results?sample=marisol) | A sample Rose Park home: three area cards, top changes ranked across areas, the Gemini plan and question box |
| [`/?lang=es`](https://utah-footprint.vercel.app/?lang=es) | The same flow in Spanish. "Ver en español" on the home and results pages switches language. |
| [`/sources`](https://utah-footprint.vercel.app/sources) | Every number, its source link, its year, and what is estimated |

Try asking: "Does my lawn really affect the lake?" Then ask something we have no source for, like
"How much does a data center in Eagle Mountain use?", and Gemini says "I don't have a source for that."

## Screens
| Screen | What it shows | Judging criterion it answers |
|---|---|---|
| `/` Home | Today's lake level and air reading, live, next to "Check my home" | Creativity; Challenge solution (credible sources) |
| `/check` Six questions | ZIP code, people, lawn, commute and car, heating, electricity. Phone first, plain words, English and Spanish. Commute miles can come from two addresses. | Challenge solution (easy to use, language, mobile) |
| `/results` Results | Water, energy and air cards next to a typical Utah home, with assumptions. Top changes with dollars a year and Utah rebates. Bad-air alert from the 3-day forecast. | Challenge solution (understand impacts, ways to reduce them) |
| `/results` Plan and questions | Gemini's plain-language plan and answers, each with the sources it used | Technical implementation (Gemini, responsible AI) |
| `/progress` My progress | Tick off the changes you have made and see the yearly savings add up. Saved on your device only. | Challenge solution (ways to reduce) |
| `/sources` Sources | Every fact with its link and year; what is real and what is estimated | Technical implementation (transparency) |

## How we use Gemini, and how we keep it honest
- **Our formulas do the math, Gemini only explains it.** Each area (`areas/water`, `areas/energy`,
  `areas/air`) has a `calc.ts` that turns the six answers into numbers, using only sourced facts in
  its `facts.ts`.
- **Gemini sees only computed results and our fact list.** No ZIP code, no name. Answers stay in the
  browser; nothing is stored.
- **Every answer names the facts it used.** Gemini returns structured JSON with `factKeys`; we show
  each one with its source link. Keys that don't exist are dropped.
- **No new numbers.** The server checks every number in Gemini's text against the data it was given.
  An answer with a number that isn't in our data is blocked and replaced with "I don't have a source
  for that."
- **It says when it doesn't know.** If our facts don't cover a question, the answer is exactly
  "I don't have a source for that."
- **Questions are treated as text, not instructions,** and are capped at 300 characters.
- **It never leaves you waiting.** Progress shows at once; after 15 seconds the plan falls back to
  the ranked list from our formulas, labelled as such. Answers are cached per answer set.
- Model: `gemini-3.8-flash` (stable, per the Gemini API models page on 14 Nov 2026), set by
  `GEMINI_MODEL`. Code: [`lib/gemini.ts`](lib/gemini.ts), [`app/api/plan`](app/api/plan/route.ts),
  [`app/api/ask`](app/api/ask/route.ts).

## How we use Google Maps
- **Commute miles from two addresses.** On the commute question, "Work it out from my addresses" sends
  the two addresses to our server, which asks the Google Maps Routes API for the one-way driving
  distance. Addresses are not logged or stored. Without a server key the app uses a saved route for
  the sample home (Rose Park to the University of Utah). Code: [`lib/maps-server.ts`](lib/maps-server.ts),
  [`app/api/distance`](app/api/distance/route.ts).
- **Lawn size on a satellite map.** On the lawn question, "Measure it on a map" lets you tap the
  corners of your lawn on a Google satellite view and uses the measured area. The link shows only when
  a Maps browser key is set for the deploy. Code: [`components/check/yard-map.tsx`](components/check/yard-map.tsx).

## What is real and what is estimated
- **Real:** the live lake level (USGS) and air reading (Open-Meteo), and every sourced fact on `/sources`.
- **Estimated:** household results. They are computed from your six answers and the listed
  assumptions, not from meter readings. Dollar savings are estimates from published rates and prices.
- **Sample data:** "Marisol" in Rose Park is a made-up sample home, not a real person.
- **Not stored:** answers stay in the browser. Only the computed results and your question go to Gemini.

## How AI was used to build this
Each of the four team members worked with an AI coding agent, which wrote most of the code under
their direction. No code was written before the event started. People chose the facts, opened and
read every source link, and decided what to keep and what to cut. What we learned is in
[docs/hack/LEARNED.md](docs/hack/LEARNED.md).

## Limits we know about
- Results are estimates from six answers, not meter readings. Each card lists what it assumed.
- Some state figures are years old (the date is shown next to each one on `/sources`).
- "Top changes" ranks by the share of the home's own number in each area, because gallons and
  pounds of CO2 can't be compared directly.
- Water rates and yard figures are Salt Lake City's; other Utah cities will differ.
- We found no citable power figure for a Utah data center, so that comparison is not in the app.

## Run it
```
npm install
npm run dev
```
Open http://localhost:3000. The app runs without any keys. For live Gemini answers, put
`GEMINI_API_KEY=...` in `.env.local` (never commit it). Variable names are listed in `.env.example`.

- `DEMO_MODE=fixtures` uses saved readings and never calls the network. `DEMO_MODE=live` calls USGS,
  Open-Meteo and Gemini, and falls back to saved data on any failure.
- `/?reset=1` clears saved answers on the device.
- API: `POST /api/plan` `{ answers, lang }`, `POST /api/ask` `{ answers, question, lang }`.
  `GET /api/plan` and `GET /api/ask?q=...` run the sample home, to warm the cache before a demo.

## Team
- Who built what: [ASSIGNMENTS.md](ASSIGNMENTS.md)
- Plan: [docs/hack/02-plan.md](docs/hack/02-plan.md) · Demo script: [docs/hack/01-demo.md](docs/hack/01-demo.md)
