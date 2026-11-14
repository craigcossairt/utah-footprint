# Lanes

People own folders (see `ASSIGNMENTS.md`) and pull new work from `docs/hack/BACKLOG.md`. Craig's own work is split into agent lanes below.

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
| demo | Craig + Britney | `README.md`, `docs/hack/01-demo.md`, `docs/hack/SUBMISSION.md` | 11:40 |

Anything not listed here, including the map features, is in `docs/hack/BACKLOG.md` for whoever claims it first.

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
- **demo:** `hack-demo` skill. Reset, QR code, README from the `SUBMISSION.md` checklist, form text.
