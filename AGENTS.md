# AGENTS.md: hackathon build rules

This is a hackathon build. The code is throwaway, so speed and a polished demo are the only
goals. Every agent reads this file first, then the files under "Read first".

**Project:** My Utah Footprint · **Deadline:** 1:45 PM MST, Sat 14 Nov 2026 (submit by 1:34 PM) · **Freeze:** 12:52 PM
**Live URL:** https://utah-footprint.vercel.app · **Repo:** https://github.com/craigcossairt/utah-footprint

## Read first
1. `docs/hack/01-demo.md`: the demo script. If a feature isn't in it, don't build it.
2. `docs/hack/02-plan.md`: scope, screens, data contract, cut ladder, gates.
3. `DESIGN.md`: tokens, components and the spec for your screen. Read it before touching UI.
4. Your lane brief in `docs/hack/03-lanes.md`.

## Speed rules
- **No tests.** No unit, integration or e2e tests, no test files, no test runners. Don't add
  them, even if a tool suggests it.
- **The only gate is the build command** in `02-plan.md` (usually `npm run build`). Run it before
  every push. It catches the type errors that break the deploy.
- **Ship to main directly.** In your worktree or branch: commit, `git pull --rebase origin main`,
  run the build command, `git push origin HEAD:main`. Push small and often, at least every 30–45 minutes
  of work. If the build breaks on main, fixing it beats everything else, whoever broke it.
- **PR mode** (only if `02-plan.md` says the sponsor requires PRs):
  `gh pr create --fill && gh pr merge --auto --squash`. Never wait for a human review.
- **Stay in your lane's folders.** Shared files (UI components, tokens, contract types,
  dependencies, root config) belong to their owner in `03-lanes.md`. If you need a change there,
  say so in your final report or ask the orchestrator. Never fork a shared component.
- **Don't add dependencies** unless your brief allows it. Use what's installed.
- **Don't ask permission for routine work.** Decide, note it in your final report, keep going.
  Ask only when the answer changes what the judges see.
- **When you finish or get blocked,** end with: what shipped (commit SHAs), the URL path to see
  it, what's left, and any decision others need to know.

## Product rules
- **Fixtures first.** Every screen renders from fixture data with no network and no keys.
  Live calls sit behind the demo-mode switch (`DEMO_MODE=fixtures|replay|live`).
- **Every number on screen comes from data and has a source** in `docs/hack/FACTS.md`. Never type
  a statistic into markup or copy. Never invent testimonials, logos, ratings or user counts.
- **Real-looking content.** Use realistic names, places and text from the domain. No lorem
  ipsum, no "John Doe", no "Acme".
- **Store times in UTC** and display them in the event's time zone.
- Slow AI calls run in the background or behind a cache. A judge never waits more than about
  2 seconds without visible progress.

## Design rules (the short version; `DESIGN.md` has the rest)
- Use only the tokens and the shared components listed in `DESIGN.md`. A raw hex value, pixel size or one-off button in a
  screen is a bug.
- Build all four states every screen reaches: loading, empty, error, too-much-content.
- Hierarchy comes from type and space, not chrome: no cards inside cards, no pill around every
  label, no gradient blobs, no emoji as icons.
- Build only for the target screens in `DESIGN.md` section 1, and make them excellent. Don't spend
  time on sizes that aren't listed.
- Status is never shown by colour alone. Respect `prefers-reduced-motion`. Every control has an
  accessible name.

## Copy rules (anything a judge reads)
- Plain, specific words. No em dashes in UI copy.
- Banned: *seamless, robust, leverage, delve, utilize, empower, streamline, cutting-edge,
  revolutionize, unlock, elevate, supercharge, harness, game-changer, next-gen, AI-powered*
  (show what it does instead), and "it's not just X, it's Y".
- Buttons say what happens ("Book the room"), not "Submit" or "Get started".

## Secrets
Keys live in `.env.local` (gitignored) and in the host's env settings. Pasting keys into chat
is fine. Never write a key into a tracked file, a commit message or the README.
Anything the browser can read (for example `NEXT_PUBLIC_*` or `VITE_*` variables) is visible to
every visitor, so never put a secret there.

## Gotchas
Read `docs/hack/GOTCHAS.md` before deploy work. Add a line when you hit something new.
