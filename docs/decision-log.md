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
