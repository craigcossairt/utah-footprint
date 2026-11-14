---
name: hack-polish
description: Screenshot-driven polish pass that removes "AI slop" from hackathon screens - checks each screen at its target sizes against DESIGN.md and the anti-slop checklist, then fixes it. Use from the hackathon midpoint, or when asked to "polish the UI", "make it look better", "this looks like AI made it", "do a design pass".
---

# Polish pass

One screen at a time, in demo order. For each screen:

## 1. Look at it for real
Open the deployed URL (or localhost in fixtures mode) in a browser tool. Take screenshots at
**each target screen size in `DESIGN.md` section 1, and only those**, in the theme used for the demo. Show each state too: loading
(throttle the network or add a delay flag), empty, error, too-much-content. Don't judge a
screen from its code.

## 2. Check it
Write down every failure before fixing anything.

**Hierarchy:** Within 2 seconds, is there one obvious first thing to look at? Does the
demo moment for this screen (`DESIGN.md` section 4) stand out the most?

**AI tells:**
- default shadcn grey with Inter
- gradient or glow
- card inside card
- pills everywhere
- emoji icons
- everything centred
- the same weight everywhere
- sparkle "AI" badges

**Tokens:**
- any raw hex or pixel value
- more than one accent use per view
- spacing off the scale
- mixed radii
- mixed icon sets

**Content:**
- placeholder or fake text
- invented numbers (check `FACTS.md`)
- banned words
- em dashes
- vague button labels
- slogan headings

**Type:**
- text readable at the real viewing distance (on a projector: body at least 20px, key numbers at least 40px)
- tabular numbers in tables and meters
- line length under about 75 characters
- no orphaned single words in headings

**Alignment:** Do edges line up on one grid? Is spacing even between siblings?

**States:**
- no layout jump when data arrives
- skeletons match the final shape
- the error state says what to do next

**Motion:** Is it purposeful and short, and does it respect reduced motion?

**Accessibility:**
- contrast is AA
- focus is visible
- controls have names
- colour is never the only signal

**Viewing conditions:** If it's shown on a projector or a shared screen, does it read from the
back of the room? Do low-contrast greys disappear?

## 3. Fix it
Fix inside the screen's own files. If the fix belongs in a shared component or token, make it
there (if you're the design owner) or report it. Fix the biggest problem first: hierarchy, then
content, then everything else.

## 4. Prove it
Take before and after screenshots at each target size, and save them to `docs/design/polish/`.
Report per screen: what changed, and anything still weak.

Stop polishing a screen once a stranger would believe a product team shipped it. Then move on.
