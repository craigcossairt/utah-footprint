# Decision log

## 14 Nov 2026, 11:58: Results page layout (grill round 1, `docs/design/results-grill.html`)

**Chosen: D, scoreboard strip.** One row with the three numbers, each against its typical figure,
then the top changes, then the Gemini plan and question box, then each area's full card as "the
details". On the projector all three numbers fit the first screen without scrolling, and the
ranked changes start right under them.

**Rejected:**
- **A, cards first** (the build before this): the three full cards are long, so the top changes
  and Gemini sat two or three screens down. On stage that is a lot of scrolling before the point.
- **B, changes first:** strong for "what do I do", but it opens on actions before the audience
  has seen the numbers that justify them, so the ranking reads as advice from nowhere.
- **C, ask first:** puts Gemini in front, but if Gemini is slow or down the first thing a judge
  sees is a skeleton or a fallback. The product is the sourced math; Gemini explains it.
- **E, one footprint score:** needs an exchange rate between gallons and pounds of CO2 that no
  source gives us. A single score would be our number, not a fact. Breaks the first rule.

**Built differently from the prototype:** the area cards are not folded into each scoreboard cell.
They belong to their owners and carry extra lines (lake level, dust outlook, inversion), so they
stay whole in a "details" section below, linked from each cell. Top changes shows five and folds
the rest.

## 14 Nov 2026, 12:15: Palette and type ("Salt and brine")

**Chosen:** salt-white background, basalt ink, brine pink accent (the Great Salt Lake's north arm), deep lake
teal, sagebrush and desert sun as area colors. Overpass (from Highway Gothic, the US road-sign face) for
headings and numbers; Atkinson Hyperlegible Next for body text. Corners 3 to 4px. Applied through the tokens,
so every screen changed at once.

**Rejected:** all five treatments in grill round 2 (`docs/design/color-grill.html`). Craig's verdict: each still
had the typical AI tells, because all five sat on the same warm-cream and terracotta base with Archivo, one of the
most common generated looks. Changing the stripe or band on top of that base could not fix it; the base had to go.
The Impeccable design skill was not available in this session and there was no time to install it before the freeze.

## 14 Nov 2026, 12:50: Home screen look ("Waterline"), grill round 3

**Chosen: B, Waterline.** The home screen is the gauge. The healthy band, the gap and the water are stacked
full width and drawn to one scale (`--ft` per foot of lake level), the headline sits inside the gap next to a
dimension arrow, and the page ends under water with the air reading and "Check my home". On load the water
stands at the bottom of the healthy range and falls to today's level; the surface is a looping SVG wave. Both
stop under `prefers-reduced-motion`. It keeps the Salt and brine palette and type, so only `/` changed.

**Rejected** (`docs/design/color-grill.html`, round 3):
- **A, Instrument** (dark readout, huge "−7.6 ft"): a dark screen with a neon figure and mono labels is itself
  a common generated look, and dark washes out on a projector.
- **C, Front page** (serif headline, black ink): the strongest alternative, but a font and palette swap touches
  every screen and there was no time to re-check them after the freeze. Worth a look after the event.
- **D, Road sign** (green panel, white capitals, yellow plate): all capitals break with the long Spanish
  strings. Its yellow action plate was the most legible button of the four.

**What the round showed:** all four made the number or the gap the layout itself. The small boxed gauge beside
a headline, more than the palette, was what read as generated.

**Built differently from the prototype:** the kicker lost its uppercase tracking; the scale is real (min-height
per foot), so long Spanish copy stretches the gap rather than clipping. `LakeGauge` is no longer used on `/`.
Shared changes: `ButtonLink` gained an `inverse` variant and `SourceLink` an `onDark` prop, both for the lake ground.

## 14 Nov 2026, 1:05: The other pages ("Surface"), pages grill

**Chosen: S, Surface.** `/check`, `/results`, `/sources` and `/progress` each open with a band of lake water
(`WaterBand` in `components/ui/water-band.tsx`) whose lower edge is the home screen's wave. The title and intro
sit in the band; everything with data stays on salt below it.

**Rejected** (`docs/design/pages-grill.html`):
- **Q, Quiet** (the pages as they were): safe, but going from the lake to a plain form read as two sites.
- **R, Rail** (the gauge scale down every page, filling as the check progresses): the best idea for `/check`,
  but it takes 4rem of a phone's width and means nothing on `/sources` or `/progress`.
- **U, Under water** (every page white on teal): the area colours and comparison bars on `/results` would all
  need new colours on a teal ground.

**What the round showed:** R and U both failed on the screens that carry data. Whatever carries the look has to
stay out of the content area.

**Built differently from the prototype:** on `/check` only the progress bar and language switch are in the band;
the question heading stays on salt, because moving it meant restructuring the form's focus handling minutes
before submission. The site header stays salt above the band. `StepProgress` gained an `onDark` prop.
