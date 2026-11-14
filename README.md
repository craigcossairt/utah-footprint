# EcoSwitch

Six questions, two minutes: see your Utah home's water, power and air numbers next to a typical
Utah home, the changes that matter most, and where every number came from.

**Live:** https://utah-footprint.vercel.app

Built at Hack for Humanity: Salt Lake City (14 Nov 2026), track 02, Utah's Environment, by Craig,
Jenn, Jennifer and Britney. MIT license. Open data only.

## For judges: three links
| Link | What to look for |
|---|---|
| [`/`](https://utah-footprint.vercel.app/) | Today's Great Salt Lake level (USGS) and air (Open-Meteo), then "Check my home" |
| [`/results?sample=marisol`](https://utah-footprint.vercel.app/results?sample=marisol) | A sample Rose Park home: three area cards, top changes ranked across areas, the Gemini plan and question box. "Ver en español" switches language. |
| [`/sources`](https://utah-footprint.vercel.app/sources) | Every number, its source link, its year, and what is estimated |

Try asking: "Does my lawn really affect the lake?" Then ask something we have no source for, like
"How much does a data center in Eagle Mountain use?", and Gemini says "I don't have a source for that."

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

## Limits we know about
- Results are estimates from six answers, not meter readings. Each card lists what it assumed.
- Some state figures are years old (the date is shown next to each one on `/sources`).
- "Top changes" ranks by the share of the home's own number in each area, because gallons and
  pounds of CO2 can't be compared directly.
- In Spanish, the plan, answers and page labels are translated; the area cards are still in English.

## Run it
```
npm install
npm run dev
```
Open http://localhost:3000. The app runs without any keys. For live Gemini answers, put
`GEMINI_API_KEY=...` in `.env.local` (never commit it).

- `DEMO_MODE=fixtures` uses saved readings and never calls the network. `DEMO_MODE=live` calls USGS,
  Open-Meteo and Gemini, and falls back to saved data on any failure.
- `/?reset=1` clears saved answers on the device.
- API: `POST /api/plan` `{ answers, lang }`, `POST /api/ask` `{ answers, question, lang }`.
  `GET /api/plan` and `GET /api/ask?q=...` run the sample home, to warm the cache before a demo.

## Team
- Who built what: [ASSIGNMENTS.md](ASSIGNMENTS.md)
- Plan: [docs/hack/02-plan.md](docs/hack/02-plan.md) · Demo script: [docs/hack/01-demo.md](docs/hack/01-demo.md)
