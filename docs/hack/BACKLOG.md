# Backlog

The open list of work. Round 1 and 2 assignments are done; from here, everyone's agent pulls the
next item when it finishes one. Nobody waits for Craig to hand out work.

## How to pull an item (your agent does this)
1. `git pull --rebase origin main`, then read this file fresh. Someone may have just claimed what you wanted.
2. Pick the first unclaimed item in **Open** that you want. "Good fit" is a hint, not a rule: anyone can take anything.
3. **Claim it before you start:** change its `Claimed:` line to your name and the time, commit only that
   change ("Claim B3"), and push to `main` right away. If the push conflicts because someone else claimed it, pick another.
4. While it's claimed, the files in its `Touches:` line are yours, even outside your folder. Nobody else edits them.
   Your own `areas/<you>/` folder is still yours as before.
5. Build, push small and often, as in `AGENTS.md`.
6. When it's live: move the item to **Done** with the commit SHA and the URL to check, push, post one line in `#ship`.
7. Stuck for 15 minutes? Write what you learned under the item, set `Claimed: (open)`, push, post in `#ship`, and pull the next one.

One item at a time per person. Don't claim ahead.

## Add your own idea
Got an idea for a feature? Add it under **Open** with the template below, claim it, post one line in `#ship`, and start.
No approval needed from anyone. A good idea:
- a judge sees it during the 3-minute demo, or it makes a screen in the demo clearer or more trustworthy;
- every number in it has an official source you opened, added to `facts.ts` (or `FACTS.md`);
- it fits in about 30 minutes and works in fixtures mode with no network;
- isn't a test (we don't write tests today).

If it's a new demo moment, add one line for it to `docs/hack/01-demo.md` too, so Britney can work it into the script.

```
### B<next number>. <What the person sees, in plain words>
Good fit: <name or anyone> · Size: S (≤15 min) / M (≤30) / L (≤60) · Claimed: (open)
Touches: <exact paths>
Do: <2 to 4 sentences>
Done when: <what you can see on the live URL>
```

## Freeze
At **12:52** this list closes except items marked **Fix**. After that, only fixes to what's already live.
Map items (B1, B2) come out at 12:30 if they aren't working on the live site.

---

## Open

### B1. Measure my lawn on a satellite map
Good fit: Jenn · Size: L · Claimed: Jenn 12:12
Key: `NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY`. Don't wait for it: build against the key in your own `.env.local`, or with the link hidden; it lights up once the key is in Vercel.
Touches: `components/check/yard-map.tsx`, `lib/maps-browser.ts`, the yard step of `components/check/check-flow.tsx`
Do: on the lawn question, add "Measure it on a map" under "I know the size". It opens a satellite view (Google Maps
JavaScript API, `mapTypeId: "satellite"`, tilt 0) centred on an address the person types, geocoded with the Maps JS
`Geocoder`. They tap the corners of their lawn; draw an editable `google.maps.Polygon` from the taps (Google retired the
Drawing library, so don't use it), allow more than one patch, and add up the area with
`google.maps.geometry.spherical.computeArea` (square metres × 10.7639 = square feet). "Use 1,240 sq ft" fills `yardCustom`
and selects "custom". Load the script with a plain `<script>` tag from `lib/maps-browser.ts`: no new dependency, no
`@types/google.maps`, type the few calls you use locally. Hide the link when the key is missing or `DEMO_MODE=fixtures`.
States: loading (Skeleton over the map), address not found (ErrorNote), no shape yet (button disabled with the reason),
map failed (ErrorNote: "Enter the size instead"). Taps of at least 44 px, "Undo last corner" and "Clear". Spanish copy in `COPY`.
Add the assumption "Lawn size measured by you on a satellite map." to the water card.
Done when: Marisol's lawn can be measured on the live URL, on a phone, in under 30 seconds.
Status (Jenn, 12:12): built and pushed in caeed18. The "Measure it on a map" link shows under "I know the size" only when
`NEXT_PUBLIC_GOOGLE_MAPS_BROWSER_KEY` is set at build time (and `NEXT_PUBLIC_DEMO_MODE` isn't `fixtures`). Tested with a fake
key: link shows, and a rejected key or no answer in 8 s shows "The map didn't load. Enter the size instead." Not yet tested
with a real key (none in this session), so drawing and the area are unverified. Needs: the key in Vercel, then a redeploy,
then one phone test. Not done: the "measured on a satellite map" assumption on the water card (needs a flag in Answers).

### B3. Data center line on the energy card
Good fit: Jennifer · Size: M · Claimed: (open)
Touches: `areas/energy/**`
Do: "One large data center uses as much power as about N homes like yours", only from a public figure for a named Utah
facility and year (utility filing, state report or the operator's own disclosure). Add the figure to `facts.ts`, EN and ES.
No figure you can open and read? Write that under this item and close it.
Done when: the line shows on `/results?sample=marisol` with its source on `/sources`.
**Closed by Jennifer, 12:05: no figure we can open and cite.** Meta Eagle Mountain publishes investment, square feet and
renewable matching, but no kWh or MW. The NSA Utah Data Center's 65 MW comes only from 2013 press (NPR, WSJ), not a
filing or the operator. Rocky Mountain Power or Utah PSC filings would be the place to look after the event.

### B4. Submission form and project story
Good fit: Jennifer · Size: M · Claimed: (open)
Touches: `docs/hack/SUBMISSION.md`
Do: open "Submit Project" at https://www.mlh.com/events/hack-for-humanity-salt-lake-city, copy every field and its
length limit into `SUBMISSION.md`, and draft each answer: goal, unique value, after-event plan, what we learned (from `LEARNED.md`).
Done when: every field has paste-ready text, by 12:30.

### B6. Phone pass of the demo path, both languages
Good fit: Jenn · Size: S · Repeat every 20 minutes · Claimed: (open)
Touches: nothing (report only)
Do: on your phone, go `/` → `/check` → `/results` → ask a question → `/sources`, in English and then with `?lang=es`.
Screenshot anything broken, cut off or confusing into `#bugs` with the page.
Done when: posted. Leave this item open for the next pass.

### B8. Timed run of the demo script
Good fit: Britney · Size: S · Repeat 3 times from 12:10 · Claimed: (open)
Touches: `docs/hack/01-demo.md`
Do: read the script aloud on the live site with a timer. Rewrite any line that doesn't sound like you. Log each run in the rehearsal table.
Done when: three runs logged, each under 3 minutes.

### B9. Two lines each in LEARNED.md
Good fit: everyone (no claim needed, just edit your own section) · Size: S
Touches: your section of `docs/hack/LEARNED.md`
Do: one thing you learned about Utah's water, air or power; one about building with a coding agent. Before 12:40.
Done when: all four sections are filled.

### B11. Dollar savings on the energy actions
Good fit: Jennifer · Size: M · Claimed: Jennifer 12:07
Touches: `areas/energy/**`
Do: add "About $N a year" to each energy action, from kWh saved × Utah's average residential electricity price (EIA Electric Power Monthly) and heating savings × Utah's residential natural gas price (EIA Natural Gas, or Enbridge Gas Utah's residential rate). Add both as facts and an assumptions line. EN and ES. Pattern: the Air card's gas savings in `areas/air/calc.ts`.
Done when: each energy action on `/results` shows a dollar figure, with both prices on `/sources`.
## Done
(Move items here: `B<n>. <title>`, done by, commit SHA, URL to check.)
- B10. Dollar savings on the water actions, Jenn, c2e52e2, /results (water actions: about $89, $55 and $44 a year at SLC 2026 rates; rate on /sources)
- Car type on the driving question (own idea), Jenn, 930d341, /check question 4 then /results air card
- B2. Commute miles from two addresses, Craig's agent, 78b17f1, /check question 4, "Work it out from my addresses". Works now with the saved route (type "Rose Park" and "University of Utah"); any other pair shows the error note until `GOOGLE_MAPS_SERVER_KEY` is in Vercel (Routes API enabled, then redeploy). Live call not yet run against Google.
- B7. Home page in Spanish, Craig's agent, 7e749eb, /?lang=es (all home labels, gauge and air word in Spanish; "Ver en español" on / switches; links carry lang to /check and /results; `LakeGauge` got an optional `lang` prop)
- B5. Click every source link, Craig's agent, no code change, /sources. All 40 links checked at 12:10 MST (36 fact links and 4 "Today's readings" links, 26 different pages): every one opens and shows the number it is cited for. No fixes needed, none blocked. Links were listed from `main` because this agent's network could not open the live site, and pages were read through a fetch service, not a browser. Not confirmed: the page numbers in four water citations ("PDF page 21" on `water.residentialGpcd`, "page 24" on the three Great Salt Lake facts); the figures themselves are in those PDFs.
