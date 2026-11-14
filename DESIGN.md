# DESIGN.md

The design system for My Utah Footprint. Every UI agent reads it before building. If this file
and a brief disagree, this file wins.

## 1. Direction
**Name:** Trailhead sign.
**Feel:** the interpretive sign at a Utah trailhead: plain, sturdy, trustworthy, read by a homeowner on a phone.
**Borrowed from:** National Park Service wayside signs (cream panel, heavy sans headings, one measured
fact per panel) and a USGS gauge readout (big tabular numbers, a unit, a timestamp).
**Not:** a green-leaf eco startup page, a climate-doom dashboard, or a default grey template.
**Target screens:** phone 390×844 and laptop 1440×900 (mirrored to the projector). Nothing else.

## 2. Tokens (defined in `app/globals.css`; use the Tailwind names, never a raw hex or pixel value)

| Tailwind name | Use |
|---|---|
| `bg-bg` | page background (cream) |
| `bg-surface` | inputs and raised areas, sparingly |
| `text-ink` / `bg-ink` / `border-ink` | body text, strong rules, bars |
| `text-muted` | secondary text |
| `border-line` / `bg-line` | hairlines, quiet bars |
| `bg-accent` / `text-accent` | the one primary action, and one emphasised figure per screen. Only that. |
| `text-lake` / `bg-lake` | water, and source links |
| `text-sage` / `bg-sage` | land, healthy range |
| `text-ok` / `text-warn` / `text-bad` | status, always with a word or icon |

**Type:** headings use `font-display` (Archivo, weight 800: `font-extrabold`). Text uses the default
(Public Sans). Every number uses the class `num` (tabular figures). Sizes: Tailwind `text-sm` to
`text-6xl` only. The base size grows on laptop so projector text is readable; don't set pixel sizes.
**Space:** Tailwind steps 1, 2, 3, 4, 6, 8, 12, 16. **Radius:** `rounded-control` for controls,
`rounded-panel` for panels. **Icons:** lucide-react only, `strokeWidth={2}`.
**Section rule:** a section starts with `border-t-4 border-ink pt-4` and a heading. No boxes
around sections, no cards inside cards, no shadows, no gradients, no emoji.

## 3. Components (`components/ui/`, owned by Craig; ask in #ship for changes)

| Component | Import | Note |
|---|---|---|
| `AreaCard` | `@/components/ui/area-card` | The standard result card: `<AreaCard title="Water" result={result} facts={facts}>extra lines</AreaCard>`. Shows the big number, the comparison with a typical Utah home, actions, assumptions and sources. Use it for your card. |
| `ActionRow`, `SourceLink` | `@/components/ui/area-card` | One action; an external link to a source |
| `BigNumber` | `@/components/ui/big-number` | A large figure with its unit |
| `Button`, `ButtonLink` | `@/components/ui/button` | `primary`, `secondary`, `ghost`. One primary per view. Labels say what happens. |
| `Skeleton`, `ErrorNote`, `StepProgress` | `@/components/ui/feedback` | Loading placeholder, error message with icon, question progress |
| `LakeGauge` | `@/components/ui/lake-gauge` | Lake level against the healthy range |

## 4. Screens
- **`/` Today in Utah:** the eye lands on how far the lake is below healthy, with the gauge. Then today's air, then "Check my home".
- **`/check` Six questions:** one question per screen, large controls, Back and Next. Ends with "Show my footprint".
- **`/results` My footprint:** three area cards (water, energy, air) side by side on laptop, stacked on phone. Then the plan and the question box.
- **`/sources`:** every fact with its source link.

Every screen handles loading, empty, error and too-much content.

## 5. Avoid
Slate grey and Inter; `rounded-lg` on everything; purple gradients, glows, glass; a centred hero with
three feature cards; a border plus a shadow plus a background on one box; a pill around every label;
emoji as icons; everything centred; invented content; spinners where a skeleton fits; tiny grey text.

## 6. When rules conflict, protect in this order
1. Facts, units and sources. 2. The demo moment. 3. The tokens and components. 4. Extra polish.
