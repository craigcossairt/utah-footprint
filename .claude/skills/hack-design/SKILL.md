---
name: hack-design
description: Build the hackathon design system fast - tokens, type, restyled components and the hero screen - so every feature lane builds polished UI from its first commit. Use at hackathon kickoff for the design lane, or when asked to "set up the design system", "make it not look like AI slop", "design the screens".
---

# Design lane: lock the look in the first 10% of the clock

Feature lanes start when you finish, so speed matters more than options. Deliver everything in
one push to `main` within about an hour of the start (or 10% of a short event).

## Inputs
`DESIGN.md` section 1 (direction) and section 4 (screens), `docs/hack/01-demo.md`, and any
brand assets (logo, colours, fonts, site URL) Craig provides.

## Steps
1. **Pick the look, quickly.** If the direction is clear, skip prototyping. If it isn't, run
   *one* round of the `grill-design` skill on the hero screen only (3 variants, 20 minutes, Craig
   picks). Never do more than one round on the day. Optionally, generate the hero screen in
   Claude Design using the style header below, and treat the result as a reference to rebuild
   from, never as code to paste in.
The paths below assume the usual Next.js + Tailwind v4 + shadcn stack. On another stack, use
its equivalents and write the real paths into `DESIGN.md`.

2. **Tokens** in one place (`app/globals.css` under Tailwind v4 `@theme`): colours (light and/or
   dark, whichever the demo uses, at AA contrast), type scale, spacing, radius, shadow, motion.
   Fill in the table in `DESIGN.md` section 2.
3. **Fonts**, self-hosted (`next/font`): one display face with character and one text face, or a
   single family with strong weights. Don't use Inter on its own; it's the default tell.
4. **Components** in one shared folder (`components/ui/`): start from shadcn primitives, then
   restyle each one to the tokens (radius, colour, type, focus ring). Minimum set: Button, Input, Select, Tabs, Dialog or
   Sheet, Toast, Badge or Status, Card or Panel, Table or List row, Skeleton, EmptyState,
   ErrorState, plus 2–4 domain components the screens share (for example `RoomTile`,
   `ScoreMeter`). List them in `DESIGN.md` section 3 with a one-line usage note each.
5. **App shell:** layout, navigation in the chosen presentation model, page header pattern.
6. **Hero screen:** build the first screen of the demo for real, from fixtures, in all four
   states. It's the reference every lane copies the patterns from.
7. **Gallery** at `/_kit`: every component and state on one page, so lanes and polish passes can see them.
8. Push, then tell the orchestrator: "Design system ready", with the commit SHA and `/_kit`.

## Style header (for Claude Design or any image or UI generator)
Paste it before every screen prompt so all screens match:

```
Product: __PROJECT__, for __WHO__. Target screens: __TARGET_SCREENS__ (design for these only).
Feel: __DIRECTION_SENTENCE__. Borrow from __REFERENCE__. Not: __NOT__.
Tokens: bg __ , surface __ , ink __ , muted __ , accent __ (primary action only), status ok/warn/bad __.
Type: __DISPLAY__ for headings, __TEXT__ for body, tabular numbers. Strong size contrast.
Rules: hierarchy from type and space, not boxes. No gradients, no glass, no emoji icons,
no card-in-card. Real domain content with real names. Show loading, empty and error states.
Output: one React + Tailwind v4 component, presentational, typed props, inline realistic fixture data.
```

## After this lane
Stay on as design owner: handle requests for component changes, then from 50% of the clock run
`hack-polish` over every screen.
