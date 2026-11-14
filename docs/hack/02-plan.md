# Plan

## One sentence
My Utah Footprint helps Utah households see their water and energy use next to today's lake level and
air, so that they pick the two or three changes that matter most and know where each number came from.

## Stack
Next.js (App Router) + TypeScript + Tailwind v4, deployed on Vercel from `main`. Gemini API,
server-side only, free tier. No database, no login: answers stay in the browser.
- Build gate: `npm run build`. Push straight to `main` after `git pull --rebase origin main`.
- `DEMO_MODE=fixtures|live`. Fixtures mode needs no key and no network.
- Open data only (USGS, EPA AirNow, Open-Meteo, EIA, Utah agencies). Spend $0.
- Gemini model names come from the current Gemini API docs, not from memory.

**Target screens:** phone 390×844 and laptop 1440×900 (mirrored to the projector).

## P0 screens

| # | Screen | Route | Demo moment | Owner |
|---|---|---|---|---|
| 1 | Today in Utah + start | `/` | 1: live lake level and air reading | Craig |
| 2 | The check (6 questions) | `/check` | 1: fast, plain, phone-sized | Craig |
| 3 | My footprint | `/results` | 2: three area cards and the top actions; 3: Gemini plan and question box with sources | Craig (page) + area owners (cards) |
| 4 | Sources and assumptions | `/sources` | 3: every number, its source, what is estimated | Craig, from area files |

## Contract (`lib/contract.ts`)
Each area is one folder, `areas/<water|energy|air>/`, owned by one person, exporting an `Area`:

```ts
type Answers = { zip: string; household: number; yardSqFt: number; commuteMiles: number;
                 heating: 'gas' | 'electric' | 'heat-pump'; monthlyKwh?: number };
type Fact = { key: string; value: number; unit: string; source: string; url: string; year: number };
type Action = { id: string; title: string; saves: number; unit: string; costNote: string;
                program?: { name: string; url: string } };
type AreaResult = { headline: number; unit: string; typical: number; summary: string;
                    actions: Action[]; assumptions: string[] };
type Area = { id: 'water' | 'energy' | 'air'; label: string; facts: Fact[];
              calculate(a: Answers): AreaResult };
```

- `areas/<id>/facts.ts`: sourced numbers. `areas/<id>/calc.ts`: the formula. `areas/<id>/Card.tsx`: the result card.
- API routes (Craig): `GET /api/today` (USGS lake level, Open-Meteo air, cached), `POST /api/plan` (results → plain-language plan), `POST /api/ask` (question → answer citing `Fact` keys; refuses when the facts don't cover it).
- Fixtures: `data/fixtures/today.json`, three sample households in `data/fixtures/households.json`.

## P1 (only after gate B)
1. Spanish toggle (Gemini translates the plan; UI labels from a small dictionary). Move to P0 if B is early.
2. Data center context card: how a household's use compares with one data center's.
3. Yard on a map: the person outlines their lawn on a Google satellite view and we compute the square feet (replaces the Gemini yard-photo idea; same answer, and it's a measurement, not a guess). Lane `map-yard`.
4. Commute from addresses: home and work addresses → driving miles one way from the Google Routes API. Lane `map-distance`.

Both map features are optional inputs on `/check`. The manual answers stay, and fixtures mode hides both.
Keys (Craig): `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` (Maps JavaScript API and Geocoding API only, restricted by referrer to
`utah-footprint.vercel.app/*` and `localhost:3000/*`; a browser key is public by design, the restrictions are what protect it) and
`GOOGLE_MAPS_SERVER_KEY` (Routes API only, server side). Google needs a billing account on the project; the monthly free usage
covers a hackathon, but set a quota cap so a room of phones can't run up a bill.

## Cut ladder (cut from the top first)
1. Yard on a map. 2. Commute from addresses. 3. Data center card. 4. Spanish. 5. The question box (keep the written plan).
**Never cut:** the three area cards, `/sources`, fixtures mode, the deployed URL.

## Gates (clock started 10:15; plan landed 10:35)
| Gate | At | Must be true | Status |
|---|---|---|---|
| A | 10:55 | Deployed URL shows the shell; everyone has cloned, run it and pushed one line | |
| B | 11:40 | Check → results clicks through with all three area cards on the deployed URL | |
| C | 12:10 | Timed run-through, cuts decided | |
| D | 12:52 | Feature freeze | |
| E | 1:24 | Repo public, submission sent (hard stop 1:34) | |

## Risks to spike first
- [ ] A teammate's laptop can't run the app within 15 minutes → they switch to the no-code path in `ASSIGNMENTS.md`.
- [ ] Gemini free-tier rate limit with a room of phones → cache the plan per answer set; fixtures fallback.
- [ ] USGS and Open-Meteo calls work from Vercel without a key.
- [ ] A number with no official source by 11:30 leaves the screen.
