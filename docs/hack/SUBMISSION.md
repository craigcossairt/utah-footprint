# Submission

Draft at 50% of the clock, finish at 85%. Paste-ready text, one block per form field.

## Form fields
(Copy every field from `00-event.md`, with its length limit, then write the answer under it.)

## README for judges (checklist)
- [ ] First line: what it is, in one sentence. Second line: the live URL.
- [ ] A screenshot or GIF of the hero screen right under that
- [ ] "Try it": judge taps (deep links) and any demo login
- [ ] A table: screen → what it shows → which criterion or track it answers
- [ ] How each sponsor tool is used, with a pointer to where it's visible
- [ ] Real vs illustrative (from `FACTS.md`)
- [ ] Built by, and how AI was used, if the rules ask
- [ ] No keys, no `.env` contents, no private links

## Before the repo goes public
- [ ] `gitleaks detect --no-git --source .` is clean
- [ ] `.env*` is not tracked (`git ls-files | grep -i env`)
- [ ] The video link opens in a private window
