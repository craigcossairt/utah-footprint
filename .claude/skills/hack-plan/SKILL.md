---
name: hack-plan
description: Turn hackathon event information into a complete, agent-ready plan - event facts, bounty pick, demo script, scope, design direction and lane briefs. Use the night before a hackathon or at kickoff, when asked to "plan the hackathon", "plan this event", "what should we build", or given an event page, brief or rubric.
---

# Plan a hackathon build

Output: the files in `docs/hack/` and section 1 of `DESIGN.md` filled in, ready for an
orchestrator to launch lanes from. Target: under 2 hours of Craig's time. Work in this order,
because each step constrains the next.

## 1. Event facts (`docs/hack/00-event.md`)
- Replace every `__PLACEHOLDER__` in `AGENTS.md`, `DESIGN.md` and `docs/hack/` as you learn the answer. Leave any still unknown and list them in your hand-back.
- Read everything Craig gives you, and fetch the event page, rules, submission form and track briefs.
- Fill in the clock, then **Judging**, quoting the official wording. The judging format (live,
  video or both), its length, the criteria and the submission fields decide everything after this.
  If one is unknown, ask Craig once, and meanwhile assume "live, 3 minutes, plus a video".
- Score the tracks or bounties in the table, pick one with a one-sentence reason, and record it.
  Don't reopen the choice later unless the rules change.

## 2. Demo script first (`docs/hack/01-demo.md`)
- Name the person with the problem, the hook and the three moments.
- Pick the presentation model (app, presenter mode, or slides plus app). This decides navigation, so it can't change later.
- Write the timed SAY/DO table. Read it aloud at speaking pace; if it runs over the limit, cut.
- List the judge taps and the demo-mode needs.

## 3. Plan (`docs/hack/02-plan.md`)
- P0 = the screens and data in the script, nothing more. Put everything else in P1 or the cut ladder.
- Sketch `lib/contract.ts` entities and the fixtures each screen needs, so lanes can start against fake data.
- List the risks to spike in the first 30 minutes (platform limits, rate limits, latency, SDK installs).
- Fill in the gate times from the clock.

## 4. Design direction (`DESIGN.md` section 1, plus a screen block per P0 screen)
- Pick a named direction with a real reference and a "Not:" line. Use the sponsor's or client's
  real brand if one exists.
- Set the **target screens**: only the sizes the real users and the judges will see (from the
  "Screen" row in `00-event.md` and who uses the product). Fewer sizes means more polish on each.
- Choose the stack in `02-plan.md` from the event's requirements. This repo ships no app code,
  so nothing is assumed.
- Write a screen block (job, first thing seen, content order, states, demo moment) for every
  P0 screen. The `hack-design` skill fills in tokens and components at kickoff.

## 5. Lanes (`docs/hack/03-lanes.md`)
- Always start with scaffold, design and data at 0%. Then one lane per P0 screen and one per
  backend capability, plus a demo lane at about 33%.
- Make sure no two lanes own the same path. Shared files belong to scaffold or design.
- Write each brief under 40 lines, with a judge-visible "done when".
- Pick harnesses and models. Spread them across providers for rate-limit headroom.

## 6. Hand back
Give Craig, in under 20 lines:
- the pick and why;
- the three moments;
- the lane count;
- the top 3 risks;
- every decision you made that he should check;
- what's still unknown about judging.

Don't write any app code. Many events forbid code before the start, and the scaffold lane does it at T+0.
