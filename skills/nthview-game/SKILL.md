---
name: nthview-game
description: Turns a topic, paper or document into a 3D learning game in one of three worlds on the same data, a walk across islands, a temple run with chasers or a top-down stealth mission past guards, where every level is a short lesson the game waits on, then a question or hands-on task in one of 31 activity types, ending in a final round and a report; 1 to 500 levels, a learning mode and an optional quiz mode. Use when the user asks for a game, an adventure, "practise as a game", islands, a runner or "Temple Run", a stealth or "Hunter Assassin" game, something playful for beginners, kids or phones, or quiz practice that should feel like play; not for slow reading, dense reference material or content without separable questions.
---

# NthView — Game

## Overview
The learner plays through the source one level at a time: each level is one
short lesson, read while the game waits, then one question or hands-on task
about it, then a one-line takeaway; a final round of questions and a report
end the game. The same JSON plays in three worlds, chosen by `game`:
`islands`, a calm walk with a companion across an archipelago, each island a
lesson (the default); `runner`, a temple run where each stretch ends at an
encounter that asks; `stealth`, a room of patrolling guards seen from above
whose boss drops a secret box that asks. Questions come as cards (23 types)
or as tasks played in the world (8 types: going to the right place, lighting
the right lamps, stepping in order, sorting into bins, collecting votes), so
answering is part of the play. Every question card can reopen the lesson.
The output is one HTML file that loads three.js and web fonts from CDNs, so
it needs internet access the first time it opens.

Two modes: learning mode (the default) explains every wrong answer, shows the
right one and never blocks; quiz mode (`strictMode: true`) costs a life per
wrong answer and keeps the answer hidden until found. The world can stop the
hero (chasers in the run, guards in the rooms) but never costs answers or
stars. Progress is saved in the browser and resumes on reopening; Restart
clears it.

## When to use
- A topic, article, lecture or document with several separable ideas, each
  testable by a question (1–500 levels; 5–25 is typical)
- Recall and consolidation: vocabulary, facts, sequences, classifications,
  misconceptions, numbers worth remembering
- Learners who asked for a game, children and beginners (`islands`), phones
  and short energetic practice (`runner`), missions and suspense (`stealth`)
- A quiz, test or graded check that should feel like a game (`strictMode`)
- The `consolidate` chapter of a lesson

Do not use when:
- The learner needs to read slowly or explore one model in depth (nthview-explorable)
- The content is mostly connections between ideas (nthview-concept-map) or roles and handoffs (nthview-courier)
- The audience wants no game at all (nthview-scenario-quiz)

## Procedure

### 1. Understand the content
Read the source and pull out the ideas that stand on their own, in a teaching
order where each builds on the last. For each idea note the plain-language
point, the question that proves it was understood, its shape (one answer, a
sequence, groups, a number, a statement to judge, a word to recall), a
tempting wrong belief, and the one-line takeaway. Pick the game: the one the
user named (walk, run, sneak), otherwise `islands`. Pick a hero and a frame
story that suits any of the three worlds.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
Open `references/complete-example.md` only when a table leaves the shape of
something unclear; it is long. Never open `assets/view.js`, the engine files
or `scripts/validate.js`: the tools run and copy them, and everything the
JSON needs is in this file and `references/schema.md`.
- `game` is required: `islands`, `runner` or `stealth`.
- One level per idea, in play order, each with a vivid two- or three-word
  `name`, a `lead` and a `remember`.
- Choose each activity from the shape of the question using the table in
  `references/activities.md`, and vary the types. Prefer the specialised
  types; `choice` can always express a question. Put an in-world task
  (`lanes`, `gates`, `torches`, `planks`, `harvest`, `levers`, `tiles`,
  `collect`) roughly every third level; keep their labels to one or two words.
- 23 types are scored and replace the quiz; the eight exploration types
  (`compare`, `bars`, `switches`, `flashcards`, `story`, `tune`, `race`,
  `collect`) need a `quiz`. A level that deserves several checks gets up to
  ten more scored card questions in `checks`.
- Write lessons and questions for any world: no "run", "jump", "crate" or
  "island" in the lesson text, so the same file can be rebuilt as another
  game. World flavour goes in `world.<game>` (themes, chaser, guards,
  per-level scenery), all optional.
- Leave `strictMode` off unless the user explicitly asks for a quiz, test or
  exam, or to evaluate or grade the learner.
- Use `findings` for numbers; set `after: true` when the bars would give the
  answer away.
- Write for a beginner: short sentences, concrete nouns, no jargon; keep the
  real terms for the report's glossary.

Content from the former Island Quest, Temple Run or Hunter views converts
with a few renames: see `references/converting.md`.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable (a wrong option without `why`, findings without `text`, too few
activity types, an empty bin, a finale `ask` larger than its pool).

A JavaScript runtime is expected: with one, checking and building the file
cost no tokens. If `node` is not installed, try `bun` or `deno run -A` with
the same script; both run it unchanged. If no JavaScript runtime exists, tell
the user that installing Node makes this much cheaper, then do the
validator's job yourself: check the JSON against every table, cross-field
rule and warning in `references/schema.md`, which is exactly what
`scripts/validate.js` implements, and fix what you find. Say that the check
was done by hand; the file also validates itself when opened and shows an
error panel if anything was missed.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6:
- the JSON in `<script type="application/json" id="nthview-data">`, with
  every `<` in the serialised JSON replaced by `<`,
- the full contents of `scripts/validate.js`, then `assets/view.js`, then the
  one engine the data names, `assets/engine-<game>.js`, inlined,
- the bootstrap script that calls `NthView.build(document.getElementById("app"), data)`.
Name the file `<concept-slug>-game.html`. The repository tool does all of
this exactly, including the CDN tags declared in `assets/view.js`:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-game.html

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

Build by hand only when no JavaScript runtime is available: it means
writing out the whole renderer (about 300 KB, up to about 80,000 tokens) and
is easy to get wrong, so tell the user the cost first. The tool does nothing
beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file and say which game it plays, that it needs
internet access the first time it opens (for three.js and the fonts), and
whether it is in learning or quiz mode. To offer the same content as another
game, change `game` and build again. Build no other view unless asked.

## Content guidance
- **Level count**: 5–7 for an article, 10–25 for a topic. A level is about a
  minute of play plus its question. Up to 500 work and save progress (islands
  splits them into archipelagos of up to 50), but a lesson of several shorter
  games is kinder.
- **Which game**: `islands` for beginners, children, calm study and long
  games; `runner` for quick recall and phones; `stealth` for missions and
  older learners. Each game shows its own controls on the start card.
- **Activity by shape** (full table and a snippet per type in
  `references/activities.md`):
  - one right answer → `choice`, `pads`, `lanes`, `gates`, `odd`, `hotspot`
  - statements to judge → `truefalse`, `planks`, `confidence`
  - category membership → `multi`, `harvest`, `torches`
  - sequence → `order`, `levers`; ranking → `rank`
  - groups → `sort`, `tiles`; pairs → `match`
  - recall without options → `text`, `number`, `cloze`
  - numbers → `estimate`, `number`, `bars`, `race`, `compare`
  - cause and effect → `predict`, `switches`, `tune`, `story`
- **Questions** test the takeaway, not trivia. Make wrong options tempting
  beliefs and give each a `why`; in learning mode the `why` is what teaches.
- **World dressing** (`world.islands`, `world.runner`, `world.stealth`):
  themes by mood, the runner's chaser, the stealth guards, per-level scenery,
  encounters, rooms, bosses, squads and powers. Leave them out for good
  defaults; set them to pace the game (heavy hazards or a five-soldier squad
  for a recap level) or to match the topic's mood.
- **The finale** draws `ask` questions (default 5) from `questions`; write a
  pool of one or two per major takeaway so replays differ.
- **The report** restates each lesson in one line (`lessons`) and maps game
  words to real terms in `glossary`; cite the source with `url` when there
  is one.
- **Tone**: warm, never gory. Chasers and guards are obstacles: guards are
  knocked out, the hero is caught, nobody is hurt.

## Common mistakes
- `game` missing → add `islands`, `runner` or `stealth`.
- A scored activity (`choice`, `lanes`, `order`, …) with a `quiz` → remove
  the quiz; the activity is the question.
- An exploration activity (`story`, `tune`, `collect`, …) without a `quiz` →
  add one that tests what it showed.
- An in-world type or an exploration in `checks` → checks take only scored
  card types; make the in-world type the main `activity`.
- `answer` that is not an option, path or part id → copy the id exactly.
- Lesson text that names one world ("run through the lane") → word it for
  any game; put world flavour in `world.<game>`.
- A `world.<game>.levels` key that is not a level id → copy the id exactly.
- Long labels on things in the world → one or two words; move the detail into
  `lead`.
- `cloze.text` with a different number of `___` than `gaps` → one marker per gap.
- `text.answer` without the obvious variants → add them to `accept`.
- `hotspot` parts where some have positions and some do not → give all or none.
- `strictMode: true` when the user only wanted to learn → leave it off.
- Every level the same type → mix at least four or five types.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth): games, modes, world dressing, 31 activity types
- `references/complete-example.md` — a complete valid example; open only when needed
- `references/activities.md` — which activity type fits which question, with a snippet for each
- `references/converting.md` — converting Island Quest, Temple Run and Hunter documents
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; run it, never read it
- `assets/view.js` — the shared core, `NthView.build(container, data)`; declares the CDN libraries; the build tool copies it, never read it
- `assets/engine-islands.js`, `assets/engine-runner.js`, `assets/engine-stealth.js` — the three worlds; the build tool inlines the one the data names, never read them
- `examples/example.html` — Cyber Watch on the islands, a working standalone sample built from the complete example; `examples/example-runner.html` and `examples/example-stealth.html` are the same data with `game` changed
