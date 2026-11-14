# Event facts

## Clock
- Event: Hack for Humanity: Salt Lake City (The AI Collective SLC + Tech-Moms, via MLH), Neumont University, Sat 14 Nov 2026 (America/Denver, MST)
- Build clock: 10:15 AM to 1:45 PM (210 minutes). No code before the start.
- Submission deadline: **1:45 PM** (Luma). MLH page says 2:00 PM. We plan for 1:45. Submit by **1:34 PM**.
- Freeze: **12:52 PM**
- Demos 1:45 to 2:30 PM, judging and prizes 2:30 to 3:00 PM

## Judging (from the briefing slide, quoted)
| Category | Evaluation criteria | Points |
|---|---|---|
| 1. Technical implementation | "Does the project work, and how effectively does it use the chosen technology (Gemini)?" "Does the project demonstrate responsible AI use (e.g., human-in-the-loop oversight, privacy, bias and transparency) and address potential biases or limitations of AI?" | 35 |
| 2. Challenge solution | "Does the project satisfy the specific challenge?" "User experience (UX): Is the solution easy to use and accessible to the community (e.g., language, mobile access and low digital literacy)?" | 30 |
| 3. Team learning & collaboration | "Did the team learn something useful during Hack Day, even if it did not have time to implement everything it learned?" "How well did the team work together?" | 15 |
| 4. Creativity | "Is the idea or implementation distinctive?" | 10 |
| 5. Demo and clarity | "Can the team clearly explain the problem, solution and implementation?" | 10 |

- **Format and length:** still UNKNOWN. Assumed live, 3 minutes, our laptop on the projector. Ask a host.
- **Submission form fields:** UNKNOWN. Open "Submit Project" on the MLH event page and list them in `SUBMISSION.md`.

## Rules (from the briefing slide, quoted)
1. "Teams of up to 5. Aim for balance of AI skill levels in each group."
2. "Start from zero. No existing projects. No human or agent-written code before the start."
3. "Open by default. Use open data and submit a public repo with MIT or Apache 2.0."
4. "Spend $0. Free tiers, free credits, and coding agents after the start are allowed."

## Track 02, Environment: "Water, Lake Dust & Data Centers"
- **The problem:** "Utah faces water scarcity, a shrinking Great Salt Lake, exposed lakebed dust, and water and energy demands from data centers. Useful information is spread across many different sources."
- **Your challenge:** "Build an AI solution that helps residents, businesses, or local leaders understand environmental impacts and explore ways to reduce them."
- **What could you build:** "Water and energy impact calculator", "Neighborhood air-quality and dust information dashboard", "Source-grounded environmental Q&A assistant"
- **What success looks like:** residents understand a complex issue in minutes, with credible sources, clear assumptions and actionable insights (slide partly hidden).
- **Data and resources:** USGS, EPA AirNow, Utah agencies, Open-Meteo, EIA, public reports.

## Decision
**My Utah Footprint:** a water and energy impact calculator for Utah households, with today's air and
dust for their area, and a source-grounded Gemini assistant that explains the result and answers
questions. It covers all three "what could you build" examples in one flow. Decided 10:27. Not reopened.

## How we score each category
- **Technical 35:** Gemini writes the plain-language plan and answers questions using only our sourced facts, and shows which source each answer used. Numbers come from our own formulas, never from the model. Every estimate is labelled, every assumption is listed, nothing personal is stored.
- **Challenge 30:** phone first, 6 questions, under 2 minutes, plain words, English and Spanish.
- **Team 15:** each of four people owns and ships one part with their own coding agent. One slide-free sentence each in the demo: "I built the water part, and I learned..."
- **Creativity 10:** today's live lake level and air reading sit next to the household's own numbers.
- **Demo 10:** one path, three screens, rehearsed three times.

## Sponsor tools
| Tool | What the judge must see it do | Ready? |
|---|---|---|
| Google Gemini API | Personal plan, source-cited answers, Spanish | Key in `.env.local` |

## Logistics
- Team: Craig, Jenn, Jennifer, Britney. All registered on MLH.
- Repo must be public with MIT at submission. Run the checks in `SUBMISSION.md` first.
