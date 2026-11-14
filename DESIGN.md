# DESIGN.md

The design system for My Utah Footprint. The design lead fills this in during the first 10% of the
clock (`hack-design` skill). Every UI agent reads it before building. If this file and a lane
brief disagree, this file wins.

## 1. Direction

**Name:** Trailhead sign.
**One sentence:** it should feel like the interpretive sign at a Utah trailhead, plain, sturdy and
trustworthy, to a homeowner standing in their own front yard with a phone.
**Borrowed from:** National Park Service wayside signs (brown and cream, heavy sans headings, one
measured fact per panel) and a USGS stream gauge readout (big tabular numbers, a unit, a timestamp).
**Not:** a green-leaf eco startup landing page, a climate-doom dashboard, or a gardening blog.
**Brand source:** none. Colours come from the place: salt flat cream, lake blue-grey, sagebrush, red rock for the one accent.
**Target screens:** phone 390×844 and laptop 1440×900 (the laptop is mirrored to the projector, so
body text there is at least 20px and every number a judge must read is at least 40px). Nothing else.

## 2. Tokens

Live in `app/globals.css` under Tailwind v4 `@theme`. A component never uses a raw value.

| Token | Light | Dark | Use |
|---|---|---|---|
| `--color-bg` | | | page |
| `--color-surface` | | | raised areas (use sparingly) |
| `--color-ink` | | | body text |
| `--color-muted` | | | secondary text |
| `--color-line` | | | hairlines and dividers |
| `--color-accent` | | | the one primary action and focus ring. Only this. |
| `--color-ok` / `--color-warn` / `--color-bad` | | | status, always paired with a word or icon |

**Type:** display __FONT__ / text __FONT__ / numbers __MONO_OR_TABULAR__, loaded with `next/font`
(no runtime CDN). Scale: 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64. If a projector is a target
screen, body text there is at least 20px and every number a judge must read is at least 40px.
**Space:** 4px base. Allowed steps: 4, 8, 12, 16, 24, 32, 48, 64, 96.
**Radius:** one value for controls, one for panels. **Shadow:** at most one elevation.
**Motion:** 150ms for UI feedback, 250ms for things entering, ease-out going in and ease-in
going out. Under reduced motion the end state appears at once.
**Icons:** one set only (lucide by default), one stroke width.

## 3. Components (`components/ui/`, owned by the design lead)

List each one with a usage note. Start from shadcn/ui primitives, then restyle them to the
tokens. The default shadcn look is itself an AI tell.

| Component | Variants | Note |
|---|---|---|
| Button | primary, secondary, ghost, danger | one primary per view |
| ... | | |

## 4. Screens

One block per screen in the demo script, in demo order. A lane builds exactly this.

### Screen: Lake today + start (`/`, lane screen-home)
- **Job:** show the lake's level today and start a yard. One action: "Use a photo of my yard".
- **First thing the eye lands on:** the lake elevation in feet, very large, with the healthy line drawn above it on a vertical gauge.
- **Content, top to bottom:** gauge with today's level, the healthy minimum and the gap in feet; "measured" timestamp and "USGS" source line; one sentence of context; primary button "Use a photo of my yard"; a quiet row of three sample homes ("Try Marisol's yard in Rose Park").
- **States:** loading: gauge skeleton, button usable. Empty: not reachable. Error: last good level with "as of" time and the word "Earlier reading". Too-much: not reachable. Photo upload in progress: the photo appears at once with a progress line naming the step ("Finding the lawn").
- **Demo moment:** "This is the Great Salt Lake this morning."

### Screen: My yard (`/yard/[id]`, lane screen-yard)
- **Job:** show what this yard uses and let the owner try changes. One action: toggle an option.
- **First thing the eye lands on:** gallons per summer, counting up, over the yard photo.
- **Content, top to bottom:** yard photo (before and after compare once an option is on, labelled "illustration"); gallons per summer with the lawn and park-strip area beneath it, labelled "estimate" with an edit control; three option toggles ("Flip the park strip", "Swap half the lawn", "Add a smart controller"), each with gallons saved and cost; a totals line: gallons saved, dollars saved per year, rebate; button "See what my street could save".
- **States:** loading: photo skeleton and number skeleton at final size. Empty (no lawn found): "We couldn't find lawn in this photo" with "Try another photo" and "Enter the size yourself". Error: sample home offered. Too-much (very large lot): numbers abbreviate ("1.2 million gallons"), layout unchanged.
- **Demo moment:** the photo redraws while the gallons number drops.

### Screen: Street and city (`/community`, lane screen-community)
- **Job:** put one yard in scale, honestly. One action: drag the homes slider.
- **First thing the eye lands on:** total gallons saved for the chosen number of homes.
- **Content, top to bottom:** "If [n] homes on my street did this" slider and total; the same for the city as a share of households; the water-share bar (farming, homes, industry) with the household slice marked "the part we control" and a source line; QR code and "Try it on your yard".
- **States:** loading: bar skeleton. Empty (no plan chosen): uses Marisol's plan and says so. Error: static fixture values. Too-much: totals switch to acre-feet with gallons beneath.
- **Demo moment:** "This slice is the part households control."

## 5. Anti-slop rules

These are the tells that make a judge think "AI made this". Avoid every one:

- Default shadcn/Tailwind look: slate grey, Inter, `rounded-lg` on everything, no point of view.
- A purple-to-blue gradient, glowing blobs, glassmorphism, sparkle icons for "AI".
- A centred hero with a big headline and three feature cards under it.
- Cards inside cards. A border, a shadow and a background on the same box.
- A pill or badge around every piece of metadata. Emoji used as icons.
- Every element centred. Everything the same weight. No clear first thing to look at.
- Placeholder or invented content: "Lorem", "John Doe", "Acme", fake logos, fake metrics.
- Spinners where a skeleton fits. A blank screen while loading. Layout that jumps when data arrives.
- Copy full of the banned words in `AGENTS.md`, or headings that are slogans instead of labels.
- Tiny, low-contrast grey text. A dashboard where every number is the same size.

What to do instead: a clear point of view from section 1, real content, strong type contrast
(big against small, heavy against light), generous space, alignment to one grid, one accent used
rarely, numbers in tabular figures, and details that only someone who knows the domain would put
in.

## 6. When rules conflict, protect them in this order
1. Facts, prices, units and privacy. Never bent to fit a layout.
2. The demo moment for this screen.
3. The tokens and components here.
4. Responsive behaviour and extra polish.
