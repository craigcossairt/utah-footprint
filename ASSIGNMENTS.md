# Who builds what

Four people, each with a coding agent, working at the same time. Each person owns one folder, so
nobody edits anyone else's files. Find your name, do the setup, paste your prompt.

- **Live site:** https://utah-footprint.vercel.app (every push to `main` goes live in about a minute)
- **Deadline:** 1:45 PM. Freeze at 12:52 PM: after that, fixes only.

| Person | Owns | Builds | Also |
|---|---|---|---|
| **Craig** | everything outside `areas/` | Design, the six questions, results page, Gemini, deploy | Unblocks anyone stuck; decides cuts |
| **Jenn** | `areas/water/` | Home water use and the Great Salt Lake | Tester: tries the live site on her phone at each checkpoint |
| **Jennifer** | `areas/energy/` | Home power, heating and data centers | Submission: lists the MLH form fields, drafts the project story |
| **Britney** | `areas/air/` | Driving, today's air and lake dust | Presenter: owns the 3-minute script in `docs/hack/01-demo.md` |

## Setup (about 10 minutes; tell Craig the moment something fails)
1. Install Node.js LTS (nodejs.org) and Git (git-scm.com) if you don't have them.
2. Send Craig your GitHub username so he can give you push access.
3. In a terminal:
   ```
   git clone https://github.com/craigcossairt/utah-footprint.git
   cd utah-footprint
   npm install
   npm run dev
   ```
4. Open http://localhost:3000/results. You should see three plain cards: Water, Energy, Air.
5. Open the `utah-footprint` folder in your coding agent and paste your prompt from below.

If the app isn't running on your laptop by 11:00, don't keep fighting it. Use any AI chat to find
your area's numbers and sources, post them in Slack `#facts`, and Craig's agents will build your card.

## Rules for everyone (your agent reads these in `AGENTS.md` too)
- Edit only your own folder. If you need a change anywhere else, post it in `#ship`.
- Every number needs an official source link that **you opened and read**. No link, no number.
  Agents sometimes make up figures and links that look real. Click every one.
- Use open data only: USGS, EPA, EIA, Open-Meteo, Utah state agencies, utility and program sites.
- Push small and often, at least every 30 minutes. Your agent runs: commit, `git pull --rebase origin main`, `npm run build`, `git push origin HEAD:main`.
- Post one thing you learned each hour in `#learned`. Judges score team learning (15 points).

## What every area folder contains
Your agent fills in three files. The shapes are defined in `lib/contract.ts`.

| File | What it holds |
|---|---|
| `facts.ts` | Your sourced numbers: value, unit, source name, link, year |
| `calc.ts` | `calculate(answers)`: turns the six answers into a headline number, a typical-Utah-home comparison, 2 to 3 actions, and the assumptions you made |
| `Card.tsx` | The card on the results page |

The six answers your formula receives: `zip`, `household` (people), `yardSqFt` (watered lawn),
`commuteMiles` (one way), `heating` (gas, electric or heat pump), `monthlyKwh` (optional).

**Your card is done when** it shows: one big number with its unit, how that compares with a typical
Utah home, 2 to 3 actions that each say what to do and what it saves, a link to a real Utah program
for at least one action, and a short "What we assumed" list. It must look right on a phone.

---

## Jenn: water (`areas/water/`)

**Your card answers:** how much water does this home use in a year, how much of that is the yard,
and what would change it most?

**Numbers to find:** gallons per person per day in Utah homes; the indoor and outdoor split;
gallons a square foot of lawn uses per season; lawn-replacement and smart-controller rebates;
the price of water in Salt Lake City. Good places to look: Utah Division of Water Resources,
USU Extension, Conserve Water Utah, Utah Water Savers, Salt Lake City Public Utilities.

**Paste this into your agent:**
> Read AGENTS.md, ASSIGNMENTS.md, docs/hack/02-plan.md, lib/contract.ts and DESIGN.md. I am Jenn and
> I own the folder areas/water/. Do not edit anything outside it. Build the water area: facts.ts,
> calc.ts and Card.tsx, to the "Your card is done when" list in ASSIGNMENTS.md. It estimates a Utah
> home's yearly water use from `household` and `yardSqFt`, shows how much is the yard, and offers 2
> to 3 actions with a Utah rebate where one exists. First, list the facts you need and search for an
> official source for each. Show me each number with its link before you use it, so I can open the
> link and check it. Never invent a number or a link: if you can't find an official source, say so
> and leave it out. Use open data only. Style with Tailwind classes and any shared components in
> components/ui. When `npm run build` passes: commit, `git pull --rebase origin main`, build again,
> `git push origin HEAD:main`. Then tell me what to look at on http://localhost:3000/results.

**Then:** add the lake context (today's Great Salt Lake level and the healthy range, from USGS and
the state) as one line on your card. From 11:40, open the live site on your phone every 20 minutes
and post anything broken or confusing in `#bugs` with a screenshot.

---

## Jennifer: energy (`areas/energy/`)

**Your card answers:** how much electricity and heating does this home use, what does that emit
given Utah's power mix, and what would change it most?

**Numbers to find:** average monthly kWh for a Utah home; pounds of CO2 per kWh for Utah's grid;
typical natural gas use for home heating; heat pump, insulation and thermostat rebates. Good places
to look: EIA (state electricity profiles), EPA eGRID, Rocky Mountain Power Wattsmart, Enbridge Gas Utah.

**Paste this into your agent:**
> Read AGENTS.md, ASSIGNMENTS.md, docs/hack/02-plan.md, lib/contract.ts and DESIGN.md. I am Jennifer
> and I own the folder areas/energy/. Do not edit anything outside it. Build the energy area:
> facts.ts, calc.ts and Card.tsx, to the "Your card is done when" list in ASSIGNMENTS.md. It
> estimates a Utah home's yearly electricity and heating use from `household`, `heating` and
> `monthlyKwh` (use the Utah average when monthlyKwh is missing, and say so in the assumptions),
> converts it to CO2 using Utah's grid, and offers 2 to 3 actions with a Utah utility rebate where
> one exists. First, list the facts you need and search for an official source for each. Show me
> each number with its link before you use it, so I can open the link and check it. Never invent a
> number or a link: if you can't find an official source, say so and leave it out. Use open data
> only. Style with Tailwind classes and any shared components in components/ui. When `npm run build`
> passes: commit, `git pull --rebase origin main`, build again, `git push origin HEAD:main`. Then
> tell me what to look at on http://localhost:3000/results.

**Then:** add a data center comparison as one line on your card ("One large data center uses as
much power as about N homes like yours"), only if you find a public figure for a named facility
and year. Around 11:40, open "Submit Project" at https://www.mlh.com/events/hack-for-humanity-salt-lake-city,
copy every form field into `docs/hack/SUBMISSION.md`, and draft the project story: goal, unique
value, after-event plan.

---

## Britney: air (`areas/air/`)

**Your card answers:** what does this home's driving put into the air each year, what is the air
like today where they live, and what would change it most?

**Numbers to find:** emissions per mile for a typical car; a typical Utahn's miles driven per year;
what is known about dust from the exposed Great Salt Lake bed; transit and clean-air programs.
Good places to look: EPA (greenhouse gas emissions from a typical passenger vehicle), Utah Division
of Air Quality, UTA, Utah Clean Air Partnership. Today's air comes live from the Open-Meteo
air quality API, which is free and needs no key.

**Paste this into your agent:**
> Read AGENTS.md, ASSIGNMENTS.md, docs/hack/02-plan.md, lib/contract.ts and DESIGN.md. I am Britney
> and I own the folder areas/air/. Do not edit anything outside it. Build the air area: facts.ts,
> calc.ts and Card.tsx, to the "Your card is done when" list in ASSIGNMENTS.md. It estimates yearly
> emissions from driving using `commuteMiles`, and offers 2 to 3 actions such as transit, carpooling
> or combining trips, with a Utah program where one exists. First, list the facts you need and
> search for an official source for each. Show me each number with its link before you use it, so I
> can open the link and check it. Never invent a number or a link: if you can't find an official
> source, say so and leave it out. Use open data only. Style with Tailwind classes and any shared
> components in components/ui. When `npm run build` passes: commit, `git pull --rebase origin main`,
> build again, `git push origin HEAD:main`. Then tell me what to look at on
> http://localhost:3000/results.

**Then:** ask your agent to add today's PM2.5 and PM10 for the user's zip from Open-Meteo, inside
your folder, with a plain-words label and a fallback when the call fails. From 12:10, read the
script in `docs/hack/01-demo.md` aloud on the live site with a timer, three times, and rewrite any
line that doesn't sound like you. It must fit in 3 minutes.

---

## Craig: everything else

| Order | Task | Paths |
|---|---|---|
| 1 | Design tokens and shared components (`hack-design` skill) | `app/globals.css`, `components/ui/**`, `DESIGN.md` |
| 2 | Home page with today's lake level and air; the six questions | `app/page.tsx`, `app/check/**`, `lib/today.ts` |
| 3 | Results page: three cards, actions ranked by size; sources page | `app/results/**`, `app/sources/**` |
| 4 | Gemini: plain-language plan and question box, answering only from our facts and naming the ones used | `app/api/**`, `lib/gemini.ts` |
| 5 | Spanish toggle, QR code, reset, README, submission | see `docs/hack/02-plan.md` |

## Checkpoints
| Time | Must be true |
|---|---|
| 11:00 | Everyone has the app running and has pushed one small change |
| 11:40 | All three cards show real, sourced numbers on the live site |
| 12:10 | First timed run-through of the demo; cuts decided |
| 12:52 | Freeze |
| 1:24 | Submitted (deadline 1:45) |

## Slack channels
`#ship` "I pushed X" and requests for changes outside your folder · `#facts` number + link ·
`#bugs` screenshot + page · `#pitch` script and form text · `#learned` what each of us learned
