---
name: hack-orchestrate
description: Run a hackathon build as the orchestrator - launch parallel lane agents from docs/hack/03-lanes.md, keep STATUS.md, check the live URL at each gate, enforce cuts and the freeze. Use when told to "start the build", "orchestrate", "launch the lanes", or pasted the orchestrator kickoff prompt.
---

# Orchestrate the build

You coordinate. You don't build features. Lanes push to `main` themselves, so there's no merge
queue for you to run. Your job is to keep every lane fed with clear work, keep the live URL
healthy, and protect the demo.

## One task, one fresh session
A lane is a set of owned files, not a long-lived chat. Every task (one slice, one screen, one
polish pass) gets a **fresh session**. The prompt is the preamble, the lane brief, the task, and
the previous session's final report for that lane. All durable knowledge lives in the repo
(`AGENTS.md`, `DESIGN.md`, `docs/hack/`), so a new session loses nothing that matters, and it
doesn't carry stale file contents, failed attempts or context that has been compacted many times.
- **Reuse a session only** for a quick follow-up on work it just shipped: fixing its own bug, or
  adjusting what it built in the last ~15 minutes.
- When a session finishes, record its report in `STATUS.md` → "Lane reports" before you end it.
  That report is the next session's handoff.
- **The same applies to you.** Keep all your state in `STATUS.md`, never only in your context. At
  each gate, or after you have been compacted, update `STATUS.md` → "Handoff" and tell Craig to
  start a fresh orchestrator with KICKOFF prompt 3b.

## At the start
1. Read `AGENTS.md` and every file in `docs/hack/`. Fill in `STATUS.md` → Now.
2. Launch the **0% wave** in parallel, each in its own worktree: scaffold, design, data. Each
   prompt is the preamble from `03-lanes.md` plus that lane's brief. Use the harness and model in
   the lane table. Spread across providers.
3. While they work, run the risk spikes from `02-plan.md` yourself, or as one short-lived agent.
4. When the scaffold lane reports the deploy is live and the design lane reports "Design system
   ready", check gate A on the deployed URL, then launch every screen and capability lane at once.

## While lanes run
- **Respond when lanes report.** Don't poll in loops.
- When a lane finishes:
  - check its result on the deployed URL, not its own claim;
  - log its report in `STATUS.md` → "Lane reports";
  - end that session, and launch a fresh one for the lane's next planned task, or leave the lane closed.
- **Never give a lane work that isn't in the plan.** If a lane runs out, close it.
- **A broken build on `main` stops the line.** The lane that broke it fixes it right away. If it
  doesn't within 10 minutes, revert the commit.
- **Contract changes** (`lib/contract.ts`, fixtures shape) go through you. Approve fast, then tell every affected lane.
- **Stuck lanes:** no visible progress in 20 minutes means end the session and relaunch the task
  fresh, on another provider if needed.
- **Craig's time:** batch his questions in `STATUS.md` → "Blocked on Craig", and ask only for
  decisions, keys, account clicks and gate reports.

## Gates (from `02-plan.md`)
At each gate, check it on the deployed URL, write the result in `STATUS.md`, and send Craig
three lines: pass or fail, what's missing, what you're cutting.
- **B (33%):** if the demo path doesn't click through, every lane works on the path. No P1 work.
- **C (50%):** make sure Craig does a timed run-through and records video v1. Apply the cut ladder.
  Start polish lanes (`hack-polish`) and the demo lane.
- **D (75%) freeze:**
  - tell every lane: polish and demo fixes only;
  - end any lane whose remaining work is a new surface;
  - **if Craig asks for new scope after a failed gate or after freeze, reply first with the gate
    status, the time cost and what drops from the cut ladder. Start only once he confirms with
    that in view.**
- **E (90%):** final video and submission (`docs/hack/SUBMISSION.md`). Run gitleaks before the repo goes public.

## Things to watch
- Lanes "adopting" the design later instead of using it from the start: stop them and point them at `/_kit`.
- Agents adding tests, CI or review tooling: remove it. Not at a hackathon.
- Unattended agents growing scope, especially overnight: every brief has a stop condition.
- The demo depending on a live call: there must be a fixtures or replay path for every moment.
