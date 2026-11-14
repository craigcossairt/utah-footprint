---
name: hack-demo
description: Make the hackathon demo safe and the video good - demo mode, reset, judge taps, presenter flow, rehearsal, and recording the video with Craig's own voice. Use from the hackathon midpoint for the demo lane, or when asked about the "demo", "pitch", "video", "rehearsal", "presenter mode".
---

# Demo lane

The demo is the product the judges see. Source of truth: `docs/hack/01-demo.md`.

## Build (owned paths: `app/present/**`, `components/demo/**`, demo-mode wiring)
1. **Demo mode:** `DEMO_MODE=fixtures` makes every moment work offline. `replay` plays back a
   recorded live run at real speed. To record one, save each live response to
   `data/replays/<name>.json` with timestamps, then replay them with the same delays.
2. **Reset:** a control outside the app's own UI (a small corner menu, or `?reset=1`) that puts
   all demo state back to the start of the script.
3. **Judge taps:** deep links that open straight into a ready state. List them in `01-demo.md` and the README.
4. **Pre-warm:** a script or route that warms every cache the script hits, run at T minus 10.
5. **Presenter mode** (if chosen): `/present`, one idea per screen, arrow keys, speaker notes
   hidden from the projector, using real components with real data.

## Rehearse (at 50% and after freeze)
- Run the script with a stopwatch in the mode you'll use on stage. Log time and every stumble in
  `01-demo.md` → Rehearsal log.
- Anything that confused you, or that you had to explain, is a fix: change the screen, not the
  script. A number that needs explaining needs a label.
- Cut lines until it fits the limit with 15 seconds to spare.

## Record the video
- v1 at 50%, final at 85–90%. Craig records his own voice. Never use TTS.
- macOS: QuickTime → New Screen Recording (or Screen Studio), at the main target screen size, notifications off.
  Record the whole script in one take, with the voice live. Do 2 takes and keep the better one.
- Trim: `ffmpeg -ss 00:00:03 -to 00:03:00 -i take.mov -c:v libx264 -crf 20 -c:a aac video.mp4`
- Upload unlisted right away and put the link in `SUBMISSION.md`. A rough video that's uploaded beats a perfect one that isn't.

## On stage
Follow the T minus 10 checklist and the fallback table in `01-demo.md`. Decide the mode before
you start, and don't switch it during the demo.
