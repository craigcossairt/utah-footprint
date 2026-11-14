# Lanes

People own folders (see `ASSIGNMENTS.md`). Craig's own work is split into agent lanes below.

| Lane | Owner | Owns (only these paths) | Starts |
|---|---|---|---|
| scaffold | Craig | `package.json`, root config, `app/layout.tsx`, `lib/contract.ts`, `lib/demo-mode.ts`, `data/fixtures/**`, deploy | now |
| design | Craig | `app/globals.css`, `components/ui/**`, `DESIGN.md` | now |
| check | Craig | `app/page.tsx`, `app/check/**`, `components/check/**` | Gate A |
| results | Craig | `app/results/**`, `app/sources/**`, `components/results/**` | Gate A |
| gemini | Craig | `app/api/**`, `lib/gemini.ts`, `lib/today.ts` | Gate A |
| water | Jenn | `areas/water/**` | Gate A |
| energy | Jennifer | `areas/energy/**` | Gate A |
| air | Britney | `areas/air/**` | Gate A |
| map-yard | Craig | `components/check/yard-map.tsx`, `lib/maps-browser.ts`; one hook-in on the yard step of `components/check/check-flow.tsx` | after Gate B, once Craig has set the Maps keys |
| map-distance | Craig | `app/api/distance/**`, `lib/maps-server.ts`, `components/check/commute-route.tsx`, `data/fixtures/routes.json`; one hook-in on the commute step of `components/check/check-flow.tsx` | after Gate B, once Craig has set the Maps keys |
| demo | Craig + Britney | `README.md`, `docs/hack/01-demo.md`, `docs/hack/SUBMISSION.md` | 11:40 |

## Preamble (paste at the top of every lane prompt)
> You are one of several agents building My Utah Footprint in parallel at a hackathon. Deadline
> 1:45 PM MST, freeze 12:52 PM. Read `AGENTS.md`, `docs/hack/01-demo.md`, `docs/hack/02-plan.md`,
> `DESIGN.md` and your brief. No tests. Run `npm run build` before each push, push straight to
> `main` (rebase first). Touch only the paths your lane owns. Build against fixtures first.
> Report what shipped (SHAs and URL path), what's left, and any decision others need.

## Briefs
- **scaffold:** stub `areas/water|energy|air` each exporting a placeholder `Area` so the results page builds before owners land real ones. Done when the deployed URL shows the shell.
- **design:** `hack-design` skill. Components: Button, BigNumber, AreaCard frame, ActionRow, SourceLink, Gauge, Stepper, Skeleton, ErrorNote.
- **check:** `/` shows today's lake level and air reading; `/check` asks the 6 `Answers` fields one per step with large touch targets; answers go to `localStorage` and the URL.
- **results:** `/results` renders the three `Area` cards, ranks all actions by size, shows the Gemini plan and the question box; `/sources` lists every `Fact` and assumption from all areas.
- **gemini:** `/api/plan` and `/api/ask` take computed results and the `Fact` list only. The prompt forbids new numbers, requires fact keys for each claim, and answers "I don't have a source for that" otherwise. `/api/today` caches USGS and Open-Meteo. Key stays server-side.
- **water / energy / air:** `facts.ts`, `calc.ts`, `Card.tsx` to the contract. Done when the card shows a headline number, a "typical Utah home" comparison, 2 to 3 actions with a Utah program link, and its assumptions.
- **map-yard (measure the lawn on a satellite map):** on the yard question, add a "Measure it on a map" link under "I know the size". It opens a satellite view (Google Maps JavaScript API, `mapTypeId: "satellite"`, tilt 0) centred on an address the person types, geocoded with the Maps JS `Geocoder`. They tap the corners of their lawn; draw an editable `google.maps.Polygon` from the taps (the Drawing library is retired, so don't use it), let them add more than one patch, and compute area with `google.maps.geometry.spherical.computeArea` (square metres × 10.7639 = square feet). Show the running total in square feet; "Use 1,240 sq ft" fills `yardCustom` and selects "custom". Load the script with a plain `<script>` tag from `lib/maps-browser.ts` (no new dependency, no `@types/google.maps`; type the handful of calls you use locally). Key: `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`. Hide the link when the key is missing or `DEMO_MODE=fixtures`, so the manual answer always works. States: loading (skeleton over the map area), address not found (ErrorNote, try again), no shape yet (button disabled with the reason), map failed (ErrorNote, "Enter the size instead"). Phone first: taps of at least 44 px, an "Undo last corner" and a "Clear" button. Add to the water assumptions only through Jenn (#ship): "Lawn size measured by you on a satellite map." Spanish copy in the same `COPY` object. Done when Marisol's yard can be measured on the deployed URL on a phone in under 30 seconds.
- **map-distance (commute miles from two addresses):** on the commute question, add "Work it out from my addresses". Two inputs: home and work or school. `POST /api/distance` with `{ from, to }` calls the Routes API `computeRoutes` server-side (`travelMode: DRIVE`, field mask `routes.distanceMeters,routes.duration`), returns one-way miles rounded to a whole mile, and the stepper takes that value. Key: `GOOGLE_MAPS_SERVER_KEY`, server only. Cache by the address pair in memory. In `DEMO_MODE=fixtures`, or when the call fails or takes over 5 seconds, return the saved route from `data/fixtures/routes.json` when the pair matches Marisol's sample, otherwise an ErrorNote ("We couldn't measure that route. Set the miles yourself."). Show the result as a line the person can still adjust ("Rose Park to the University of Utah: 7 miles one way by road"). Don't save the addresses: not in `localStorage`, not in the URL, not in logs. Under the inputs, one plain line: "Your addresses go to Google Maps to measure the route. We don't keep them." Spanish copy in `COPY`. Done when the stepper fills from two real Salt Lake addresses on the deployed URL.
- **demo:** `hack-demo` skill. Reset, QR code, README from the `SUBMISSION.md` checklist, form text.
