---
name: nthview-detective
description: Turns a concept into a detective case the learner cracks: they search locations (examine a scene, interview witnesses, read documents, compare exhibits, rebuild a timeline, check a ledger, open a lock, run a lab test), pin clues to an evidence board, rule out competing theories with evidence, then name the explanation and get a debrief on why each wrong theory was tempting; five visual themes. Use when the user asks for a mystery, a detective story, a whodunnit, "a case to solve", learning by deduction, or wants to confront the common misconceptions about a topic; not for memorising facts, step-by-step procedures or a quick reference.
---

# NthView — Detective

## Overview
The concept becomes a case. A briefing poses one question ("Why did fourteen
people fall ill?"), a cast of people each hold a theory, and the learner, as
the detective, searches locations for clues. Each clue says what it proves,
which theories it rules out and why it matters, so every step of the
deduction is a step of understanding. On a corkboard (or glass wall, or felt
pinboard, depending on the theme) the learner pins clues and links them to
theories with string; a contradicting link rules a theory out and greys it.
They then name the explanation with a confidence level, read a debrief that
explains why each wrong theory tempted and what killed it, an epilogue that
restates the concept in plain words, and a full case-file review. Nothing is
scored: red herrings and wrong links teach through their explanations.

The learning methods are deliberate: elaborative interrogation (every clue
asks "why does this matter?" before answering), retrieval (the learner
decides what each clue rules out), narrative memory (the facts live in a
story with people), and direct confrontation of misconceptions (the wrong
theories are the misconceptions, voiced fairly by the people who hold them).

The interface is cinematic: an animated backdrop (blind-light and rain,
drifting dust or a moving grid floor), a case-folder briefing with a stamp,
illustrated scenes with a torch beam, SVG portraits assembled from parts,
strings drawn between pins, stamps that thud onto ruled-out theories. It is
keyboard operable, respects reduced motion, works from 320px up, and has
light and dark variants of every theme. The output is one HTML file; it loads
its typefaces from Google Fonts and falls back to system fonts offline.
Progress is saved in the browser (localStorage) on every change: locations
visited, clues found and pinned, questions asked, links made, theories ruled
out and the final accusation, so reopening the file continues the case where
it was left. The Restart button in the case bar (and on the briefing) clears
that saved progress and reopens the case from scratch.

## When to use
- Concepts surrounded by misconceptions: compliance, security incidents,
  medical myths, scientific explanations, economics, history ("why did X
  happen?"), debugging a system failure
- Topics where understanding means knowing *why* a rule or fact exists, not
  just that it does
- The user asks for a mystery, a detective game, a whodunnit, an
  investigation, or to "figure it out" rather than be told
- Content with naturally investigable material: records, documents,
  testimonies, numbers that can be checked, a sequence of events, a test that
  can be run

Do not use when:
- The content is a list of facts or definitions to memorise (a flashcard or
  quiz view fits better)
- The goal is to follow a procedure step by step (a guided walkthrough fits
  better)
- There is no single explanation to arrive at and no wrong ones worth
  confronting; `nthview-scenario-quiz` suits concepts that are a series of
  separate judgement calls
- The user wants a score or a certificate; this view deliberately has none

## Procedure

### 1. Understand the content
Find the **one question** the concept answers and the **one right
explanation**. Then list the 2–4 wrong explanations people actually believe
(these become the theories; mark the most common as `popular`). For each wrong
theory, write down the fact that kills it. For the right one, the facts that
support it. Those facts are your clues. Then invent a small, concrete
incident where all of this happens: a place, a handful of people, a bad
outcome. Give each wrong theory to a person who would honestly believe it.
`references/case-design.md` walks through this with a worked mapping.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- Write the `briefing` (what happened, which concept is at stake, the
  question) and the `detective` role.
- Build the `cast` (3–6 people) with `portrait` parts so each face is
  distinct; give the misconception-holders `kind: "suspect"` or `"witness"`
  and the explainer `kind: "expert"`.
- Write `hypotheses`: 3–5, exactly one `correct`, the common wrong ones
  `popular`, each wrong one with an honest `tempting` and a `why` that names
  the evidence.
- Write `clues`: 10–18 is the sweet spot. Each has `text` (what was found),
  `proves`, `why` (the concept behind it), and `rulesOut` with a `because`
  per theory it contradicts. Use `supports` for clues that fit a theory.
  Include one or two `redHerring` clues and a red-herring interview answer.
- Place every clue in a `location`. Use at least five of the eight types; the
  table in `references/case-design.md` maps facts to types. Use `requires`
  to gate a location (a lock whose code is found elsewhere) and question
  `requires`/`unlocks` to make interviews respond to evidence.
- Choose a `theme` that suits the topic (table in `references/schema.md`).
- Restate the concept plainly in the `epilogue`.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. The validator checks every
cross reference and that the case is solvable: every wrong theory can be
ruled out, no clue contradicts the right one, every location opens, every
question can be asked and every clue can be found. Act on warnings: a clue
that bears on no theory, or no red herring, usually means thinner teaching.

If `node` is not installed, try `bun` or `deno run -A` with the same
script; both run it unchanged. If no JavaScript runtime exists, do the
validator's job yourself: check the JSON against every table, cross-field
rule and warning in `references/schema.md`, which is exactly what
`scripts/validate.js` implements, and fix what you find. Say that the check
was done by hand; the file also validates itself when opened and shows an
error panel if anything was missed.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-detective.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `\u003c`,
the one Google Fonts tag from `NthView.libs` before the scripts, then
`scripts/validate.js` and `assets/view.js` inlined verbatim, then the
three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`.

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

The hand build is the fallback when no JavaScript runtime is available; the
tool does nothing beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file. It needs internet access once to load the
fonts (Caveat, IBM Plex Mono, Inter, Lora, Playfair Display, Space Grotesk,
Special Elite from Google Fonts) and degrades to system fonts without it.
Build no other view unless asked.

## Content guidance
- **One question, one answer.** The case must have a single explanation the
  evidence converges on. If the concept has several parts, make the right
  theory the one that ties them together.
- **Theories are misconceptions in costume.** Each wrong theory is a belief a
  sensible person holds about the concept ("compliance is paperwork", "a
  failure is one bad apple", "rules are red tape"). Its holder voices it in
  `statement`; `tempting` grants what is reasonable about it before `why`
  takes it apart.
- **Every clue teaches.** `proves` says what the clue shows in plain words;
  `why` connects it to the concept, so the detective learns the concept, not
  just the plot. Keep `text` concrete: a dial at 9 °C, a signature on a
  closed Sunday.
- **Rule-out matrix.** Before writing locations, check the matrix: each wrong
  theory needs at least one clue in its `rulesOut` (two is better, from
  different locations); the right theory needs three or more supporting
  clues; one clue should `support` both a wrong and the right theory, to teach
  that fitting is not proof.
- **Red herrings.** One physical red herring (the framed certificate) and one
  or two misleading interview answers (rumours, blame). Their notes explain
  why they lead nowhere; they appear in the debrief.
- **Variety and flow.** 8–11 locations using at least five types. Start with
  an `examine` scene that yields three or four clues; gate one location
  behind a clue found early (`requires`); let interview questions open up
  when evidence is found so returning to a witness pays off.
- **Small puzzles.** A lock code must be derivable from something seen
  elsewhere; its last hint gives it away. A ledger has exactly one row that
  cannot be true given the `rule`. A timeline has 4–6 events with a lesson in
  the order. A lab has 2 controls and covers every combination.
- **Length limits.** Keep notes to two sentences and interview answers to
  three. Clue titles are handwritten on the board: four to six words.
- **The epilogue** names the concept and restates it in two or three short
  paragraphs, then 4–6 takeaways. It is the "solution" in plain words.
- **Theme.** Pick one that fits the mood: `noir` for incidents and
  wrongdoing, `parchment` for history and law, `neon` for technology and data,
  `newsroom` for media and policy, `forensic` for science and health.

## Common mistakes
- A clue in `rulesOut` of the correct theory → the validator rejects it; move
  the clue to `supports` or change the theory.
- A wrong theory nothing rules out → the learner can never eliminate it; add
  a clue that contradicts it.
- A clue that is referenced by no location → it can never be found; place it.
- A lock whose `requires` is the lock's own clue, or a question that needs a
  clue only it reveals → unreachable; the validator names the cycle.
- `rulesOut` written as a list of ids → each entry is
  `{ "hypothesis": "...", "because": "..." }`.
- Theories that are straw men → write `tempting` so a reader nods before
  `why` corrects them.
- Every clue pointing at the answer → include `supports` on a wrong theory
  and a red herring, or the board teaches nothing about weighing evidence.
- Lab outcomes that miss a combination → add a catch-all outcome without
  `when` as the last entry.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), the theme table and the complete Marigold Kitchen compliance example
- `references/case-design.md` — turning a concept into a case: the theory and clue matrix, which location type fits which fact, a snippet per type
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; includes the solvability checks
- `assets/view.js` — `NthView.build(container, data)`; the five themes live in its `PALETTES` table; fonts declared in `NthView.libs`
- `examples/example.html` — the Marigold Kitchen case, a working standalone sample built from the schema example
