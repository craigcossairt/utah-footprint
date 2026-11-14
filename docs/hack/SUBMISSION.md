# Submission

Paste-ready text, one block per form field. Drafted by Craig's agent, 14 Nov, about 12:50 PM MST.

> **We could not read the real form.** The "Submit Project" button on
> https://www.mlh.com/events/hack-for-humanity-salt-lake-city needs an MLH login, and the public page shows
> only the event description and the prize categories. The fields below are the standard hackathon
> ones, each with a short and a long version so they fit any limit. Craig: open the form, match each
> field to the closest block, and trim from the bottom of a block if it is over the limit.

## Craig fills these in (nobody else can)
- [ ] **Demo video link** (if the form asks for one). Check it opens in a private window.
- [ ] **Screenshot** of the home page or `/results?sample=marisol` for the form's image field and the README.
- [ ] **Your two lines in `LEARNED.md`**, then paste them into "What we learned" below where it says CRAIG.
- [ ] **Team members:** full names, emails or MLH usernames for Jenn, Jennifer and Britney, as the form asks.
- [ ] **Prize categories to tick:** "Water, Lake Dust & Data Centers" and "Best Use of the Google Gemini API".
- [ ] **The commute-from-addresses sentence** is marked CHECK below. Try one other address pair on the live site first. (The lawn map was confirmed on the live site by Craig.)
- [ ] Make the repo public (MIT license is already in `LICENSE`).

## Form fields

### Project name
EcoSwitch

(If the form wants the working title too: "EcoSwitch (My Utah Footprint)".)

### Tagline
Short:
> See your Utah home's water, power and air numbers, and what to change first.

Long:
> Six questions, about two minutes: see your Utah home's water, power and air numbers next to a typical Utah home, the changes that matter most, and where every number came from.

### Links
- Live site: https://utah-footprint.vercel.app
- Repo: https://github.com/craigcossairt/utah-footprint
- Sample result (no typing needed): https://utah-footprint.vercel.app/results?sample=marisol
- In Spanish: https://utah-footprint.vercel.app/?lang=es
- Every number and its source: https://utah-footprint.vercel.app/sources
- Video: CRAIG TO ADD

### Track / challenge
Track 02, Environment: "Water, Lake Dust & Data Centers". Also entered for "Best Use of the Google Gemini API".

### The goal (the problem we set out to solve)
Short:
> Most Utahns can't see their environmental impact, so they can't reduce it. The facts about Utah's water, lake dust and power are spread across many agency sites. EcoSwitch puts a household's own numbers on one phone screen, then shows which change matters most.

Long:
> Most Utahns can't see their environmental impact, so they can't reduce it. Utah has a shrinking Great Salt Lake, dust from the exposed lakebed, winter inversions and a power grid that still burns a lot of fossil fuel. The facts are public, but they sit on many different agency sites, in reports and rate tables that a busy family will never read. So a family can't tell which of its own habits matters: the lawn, the furnace, the power bill or the commute.
>
> Our goal was to make that visible in about two minutes, on a phone, in English or Spanish, without an account. A resident answers six questions and sees their home's water, power and driving numbers next to a typical Utah home, the changes that would matter most for them, the Utah rebate or program for each change, and the source of every number.

### What it does
Short:
> You answer six questions on your phone (ZIP code, people at home, lawn size, commute, heating, monthly electricity). You can measure your lawn on a satellite map. EcoSwitch shows your home's water, energy and air numbers next to a typical Utah home, ranks the changes that matter most with dollar savings and Utah rebates, and lets you ask questions. Gemini answers only from our list of sourced facts and names the ones it used. Works in English and Spanish.

Long:
> **Home page.** Today's Great Salt Lake level from the USGS gauge at Saltair and today's air reading for Salt Lake City from Open-Meteo, so the first thing you see is Utah this morning.
>
> **Six questions.** ZIP code, people in the home, lawn size, one-way commute and car type, how the home is heated, and monthly electricity use. If you don't know your electricity use, we use the Utah average and say so. You can measure your lawn by tapping its corners on a Google satellite map, and work out your commute from two addresses instead of guessing the miles. CHECK (bill upload, not yet confirmed live by Craig): If you don't know your monthly electricity use, you can upload a photo or PDF of your power bill, Gemini reads the kWh, and you confirm the number before it is used. A sample bill is included.
>
> **Results.** Three cards, water, energy and air, each with your number next to a typical Utah home and the assumptions behind it. Below them, your top changes ranked across all three areas. Each change shows about how many dollars a year it saves and the Utah program that helps pay for it, such as the $100 Utah Water Savers smart controller rebate. The air card also shows today's air and a bad-air alert from the 3-day forecast for your ZIP code.
>
> **Ask a question.** Gemini writes a short plan in plain language and answers questions such as "Does my lawn really affect the lake?" It answers only from our sourced facts and your computed results, and shows the source for each fact it used. If we have no source, it says "I don't have a source for that."
>
> **Progress.** A tracker page lists your changes so you can tick off what you have done and see the yearly savings add up.
>
> **Sources.** One page lists every number in the app with its source link and year, and marks what is estimated.
>
> **Spanish.** "Ver en español" switches the home page, the questions, the results, the plan and the answers.

CHECK (Craig: the commute-from-addresses sentence above is true today for the saved Rose Park to University of Utah route. It is true for any address pair only if `GOOGLE_MAPS_SERVER_KEY` is in Vercel. If it is not, change the sentence to: "For the sample home, the commute miles come from a Google Maps route.")

### What makes it different (unique value)
Short:
> Our formulas do the math and Gemini only explains it. Every number has a source you can open, the server blocks any answer with a number that isn't in our data, and nothing personal is stored. It puts today's lake level and air next to your own household numbers, in English and Spanish.

Long:
> **The model never does the math.** Each area has its own formulas that turn your six answers into numbers, using only facts we sourced from public data. Gemini gets the computed results and our fact list, and its job is to explain them in plain words.
>
> **Every answer shows its sources.** Gemini returns the list of facts it used, and we show each one with its link. The server checks every number in Gemini's text against the data it was given. An answer with a number that isn't in our data is blocked and replaced with "I don't have a source for that."
>
> **It is personal and local.** Most calculators give a national average. EcoSwitch uses Salt Lake City water rates, Utah's power grid, Utah gas prices and Utah rebates, and puts today's Great Salt Lake level and air reading next to your own numbers.
>
> **It ranks across water, power and air.** You see one short list of what to change first, with dollars a year and the rebate, instead of three separate reports.
>
> **It respects the person using it.** No account. Answers stay in the browser. Gemini never sees your name or ZIP code. Estimates are labelled as estimates, and each card lists what it assumed. It works on a phone, in English and Spanish, in plain words.

### How we built it
Short:
> Next.js 16, React 19, TypeScript and Tailwind CSS, deployed on Vercel. Google Gemini API for the plan and the answers. Google Maps for the commute distance. Live data from USGS and Open-Meteo. Facts from EIA, EPA, Salt Lake City Public Utilities, the Great Salt Lake Strike Team and other public sources. Four people, each with a coding agent, each owning one part.

Long:
> Four of us built it in one build session, starting from zero. Each person owned one part and worked with their own coding agent: Jenn built water, Jennifer built energy, Britney built air and driving, and Craig built the questions, the results page, the Gemini assistant and the deploy.
>
> Each area is a folder with three files: the facts with their sources, the formulas, and the card. That let four people push to the same site all day without editing each other's files.
>
> The app is Next.js 16 with React 19, TypeScript and Tailwind CSS, on Vercel. The home page reads the Great Salt Lake level from the USGS water data service and the air reading from the Open-Meteo air quality API, with saved readings as a fallback. The Gemini API (model `gemini-3.8-flash`) returns structured JSON with the plan or answer and the keys of the facts it used. The server drops keys that don't exist and blocks any number that isn't in the data. Questions are capped at 300 characters and treated as text, not instructions. Answers are cached, and if Gemini takes longer than 15 seconds the plan falls back to the ranked list from our formulas, labelled as such. Commute distance comes from the Google Maps Routes API on the server; addresses are not logged or stored.
>
> A person on the team opened every source link before its number went into the app.

### How we used Gemini (for the "Best Use of the Google Gemini API" category)
Short:
> Gemini writes each household's plan and answers their questions, in English or Spanish. It sees only the computed results and our sourced fact list, returns the facts it used, and says "I don't have a source for that" when our facts don't cover a question.

Long:
> Gemini does two things: it writes a short plain-language plan from the household's results, and it answers follow-up questions, in English or Spanish.
>
> We built it for responsible use. Gemini never calculates anything; our formulas do. It receives only the computed results and our fact list, with no name and no ZIP code. It returns structured JSON that names the facts it used, and we show each with its source link. The server checks every number in the answer against the data Gemini was given and blocks the answer if one doesn't match. When our facts don't cover a question, for example how much power one named data center uses, the answer is "I don't have a source for that."

### What we learned
Short:
> Yards matter more to the Great Salt Lake than we thought: the state now estimates 91% of the water put on city yards is used up and does not flow back, up from an old assumption of 40%. And a coding agent finds sources fast, but a person still has to open every link. Ours got some figures wrong on the first search, and sources disagreed more than once.

Long:
> **About Utah.**
> - Jenn: The state now estimates 91% of the water on city yards is used up rather than flowing back to the rivers, up from an old assumption of 40%. Yards matter more to the Great Salt Lake than we thought.
> - Jennifer: In a typical gas-heated Utah home, more of the CO2 comes from the electric bill than from the furnace. Utah's grid still put out 1,322 lbs of CO2 per MWh in 2024.
> - Britney: 48% of a typical winter inversion's fine particles come from vehicles, trains and aircraft, and lake dust is mostly coarser dust that the usual air quality number doesn't fully capture.
> - CRAIG: one line to fill in.
>
> **About building with a coding agent.**
> - Jenn: The agent's first search gave a higher figure for household leaks than EPA's live page, which says 9,300 gallons a year. The agent finds sources fast, but someone still has to open every link.
> - Jennifer: The agent couldn't open government websites from its sandbox, so it found numbers through search and I opened every link. Sources disagreed more than once, and a person had to pick.
> - Britney: Working with an agent felt like pairing with a fast teammate: it did the typing, and I made the calls and checked the facts.
> - CRAIG: one line to fill in.
>
> We also learned what we could not source. We wanted a line comparing a home's power use to one large Utah data center, but found no figure from a filing or the operator that we could open and cite, so we left it out.

### Challenges we ran into
Short:
> Finding numbers we could stand behind. Sources disagreed, some state figures are years old, and we could not find a citable power figure for a Utah data center, so that comparison is not in the app.

Long:
> **Sourcing.** Every number needed an official page that a person opened and read. Sources disagreed on small things, an agent's first search result was sometimes wrong, and some state figures are several years old. We show the year next to every number.
>
> **Comparing unlike things.** Gallons and pounds of CO2 can't be added up, so "top changes" ranks each change by its share of the home's own number in that area.
>
> **Keeping Gemini honest.** A prompt alone was not enough for us, so the server checks the numbers in every answer.
>
> **Four people on one codebase.** One folder per person, small pushes straight to the live site, and a shared backlog kept us from blocking each other.

### What we're proud of
> Every number on screen has a source link, and one page lists them all. It works on a phone in English and Spanish. Four people each shipped a working part of one product in a single build session.

### What's next after the event
Short:
> Cover more of Utah (water rates and rebates beyond Salt Lake City), add a sourced data center comparison from utility or Public Service Commission filings, add lake dust readings by neighborhood, and test the wording with Spanish-speaking residents.

Long:
> - **More of Utah.** Water rates and yard figures are Salt Lake City's today. Add other cities and water districts so the numbers match where a person lives.
> - **Data centers.** Look in Rocky Mountain Power and Utah Public Service Commission filings for a figure we can cite, then add the comparison we left out.
> - **Lake dust by neighborhood.** The usual air number doesn't fully capture coarse lakebed dust. Add state dust monitoring where it is published.
> - **Real bills.** Let a person type in their own water and power bills in place of estimates.
> - **Test with residents.** Sit with Spanish-speaking families and people who don't use apps much, and fix the words that confuse them.
> - **Keep sources fresh.** Re-check every source link and year on a schedule.
> - **Renters and small businesses.** Different questions and different programs for people who can't change their yard or furnace.

### Tools used (built with)
Short:
> Next.js, React, TypeScript, Tailwind CSS, Vercel, Google Gemini API, Google Maps Platform, USGS Water Data, Open-Meteo

Long:
> - **App:** Next.js 16, React 19, TypeScript, Tailwind CSS 4, lucide-react icons
> - **Hosting:** Vercel
> - **AI:** Google Gemini API (`gemini-3.8-flash`) for the plan and the answers
> - **Maps:** Google Maps Platform (Routes API for commute distance; Maps JavaScript API for the lawn map)
> - **Live data:** USGS Water Data (Great Salt Lake level), Open-Meteo air quality API
> - **Open data sources:** US EIA, US EPA, ENERGY STAR, US DOE Alternative Fuels Data Center, FHWA, Salt Lake City Public Utilities, Great Salt Lake Strike Team, Utah Division of Water Resources, Utah Division of Air Quality, USU Extension, Jordan Valley Water Conservancy District, Enbridge Gas Utah
> - **Coding agents:** each team member worked with an AI coding agent. People chose the facts and opened every source link.

### How AI was used to build it (if the form asks)
> Each of the four team members worked with an AI coding agent that wrote most of the code under their direction. No code was written before the event started. People picked the facts, opened and read every source link, and decided what to keep and cut. In the product, Gemini explains results and answers questions; it does not calculate them.

### Team
Craig, Jenn, Jennifer, Britney. (Craig: add last names and MLH accounts as the form asks.)

### License
MIT. Open data only.

## README for judges (checklist)
- [x] First line: what it is, in one sentence. Second line: the live URL.
- [ ] A screenshot or GIF of the hero screen right under that. **Craig:** save it as `public/readme-hero.png` and uncomment the image line near the top of `README.md`.
- [x] "Try it": judge taps (deep links) and any demo login. No login needed.
- [x] A table: screen → what it shows → which criterion or track it answers
- [x] How each sponsor tool is used, with a pointer to where it's visible (Gemini and Google Maps)
- [x] Real vs illustrative (from `FACTS.md`)
- [x] Built by, and how AI was used
- [x] No keys, no `.env` contents, no private links
- [ ] Video link. **Craig:** add it to the README line marked "Video".

## Before the repo goes public
- [ ] `gitleaks detect --no-git --source .` is clean. **Not run:** gitleaks is not installed in the agent's
      session (12:50 PM). In its place, a pattern search of all tracked files for Google API keys (`AIza...`),
      `sk-...` keys and private key blocks found nothing. Craig: run gitleaks on your laptop if you have it.
- [x] `.env*` is not tracked (`git ls-files | grep -i env`). Checked 12:50 PM: the only match is `.env.example`,
      which holds `DEMO_MODE` and commented-out variable names with no values. `.gitignore` covers `.env*`.
- [ ] The video link opens in a private window. Craig, once the video exists.
