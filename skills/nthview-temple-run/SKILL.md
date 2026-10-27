---
name: nthview-temple-run
description: Turns a topic, paper or document into a Temple Run style 3D endless-runner where the learner flees through temple ruins with chasers behind them; each stretch of the run is a short lesson, and at its end an encounter (a ghost, a sealed gate, a wall of fire, a stone guardian) asks about it with one of 31 activity types, from cards and typed answers to running through the right lane or jumping the false planks, ending in a final sprint and a report; 1 to 500 stretches, four world themes, a learning mode and an optional quiz mode. Use when the user asks for a runner, an endless runner, "Temple Run", a fast-paced game, a game for phones, or quick recall practice that should feel like a run; not for slow reading, dense reference material or content without separable questions.
---

# NthView — Temple Run

## Overview
The learner plays a runner escaping a temple with chasers on their heels:
lanes, jumps, slides and sharp turns on a raised stone path through jungle
(or haunted, desert or frozen) ruins. Every stretch of the run is one idea
from the source: a short lesson read before running, a stretch of track, and
an encounter that blocks the way until its question is answered, either in a
card (31 activity types in all) or as a trial on the track itself. The run
makes recall feel urgent and physical, and the encounter turns each lesson
into a memorable moment. A final sprint asks questions drawn from a pool, and
the report lists every stretch with its stars and takeaway. The output is a
single HTML file that loads three.js and two web fonts from CDNs, so it needs
internet access the first time it opens.

Each stretch is a brisk 10–15 second dash between questions. Two modes:
learning mode (the default) explains every wrong answer, shows the right one
and never stops the run; quiz mode (`strictMode: true`) costs a torch per wrong
answer and keeps the answer hidden until found. In both, if the chasers catch
the runner (three stumbles, or the last torch in quiz mode) a "Captured" card
counts it and Resume continues from just before the spot, so running skill
never blocks learning. Progress and restart: the game saves progress in the browser as the
learner plays (stretch reached, stars, torches, captures, settings) and resumes at the
start of that stretch when the file is reopened; the Restart button clears it
and starts over.

## When to use
- A topic, article, lecture or document with several separable ideas, each
  testable by a question (the run supports 1–500 stretches; 5–25 is typical)
- Recall and consolidation: vocabulary, facts, sequences, classifications,
  true-or-false misconceptions, numbers worth remembering
- Learners who asked for a game, a runner or something fast; phones and
  tablets (portrait first, touch swipes and on-screen arrows)
- A quiz, test or graded check that should feel like a game (`strictMode`)

Do not use when:
- The learner needs to read slowly or explore one model in depth (Explorable
  Lab fits better)
- The content is one idea without questions, or mostly connections between
  ideas (Concept Map)
- The audience cannot use fast keyboard or touch input; Island Quest offers
  the same activities at walking pace

## Procedure

### 1. Understand the content
Read the source and pull out the ideas that stand on their own, in a teaching
order where each builds on the last. For each idea note the plain-language
point, the question that proves it was understood, its shape (one answer, a
sequence, groups, a number, a statement to judge, a word to recall), a
tempting wrong belief, and the one-line takeaway. Pick a runner, a chaser
and a frame story (an escape, a delivery, an exam) and a world `theme` whose
mood suits the topic (table in `references/schema.md`).

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- One stretch per idea, in run order. Give each a vivid two-word `name`.
  `scenery` and `encounter` are optional and rotate by default; set them to
  match the mood of a stretch.
- Choose each activity from the shape of the question using the table in
  `references/activities.md`, and vary the types. Prefer the specialised
  types; `choice` is the fallback that can always express a question. Put a
  track trial (`lanes`, `gates`, `torches`, `planks`, `harvest`, `levers`,
  `tiles`, `collect`) roughly every third stretch.
- 23 types are scored and replace the quiz; the eight exploration types
  (`compare`, `bars`, `switches`, `flashcards`, `story`, `tune`, `race`,
  `collect`) need a `quiz`. A lesson that deserves several checks gets up to
  ten more scored panel questions in `checks`.
- Track labels are read while running: one or two words each; explain them
  in `lead`, `body` or `prompt`.
- Leave `strictMode` off (omit it or set `false`) unless the user explicitly
  asks for a quiz, test or exam, or to evaluate or grade the learner.
- Every stretch needs `lead` and `remember`. Use `findings` for numbers; set
  `after: true` when the bars would give the answer away.
- Write for a beginner: short sentences, concrete nouns, no jargon; keep the
  real terms for the report's glossary. Reuse the runner's name in the text.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable (a wrong option without `why`, findings without `text`, too few
activity types, an empty bin, a finale `ask` larger than its pool).

If `node` is not installed, try `bun` or `deno run -A` with the same
script; both run it unchanged. If no JavaScript runtime exists, do the
validator's job yourself: check the JSON against every table, cross-field
rule and warning in `references/schema.md`, which is exactly what
`scripts/validate.js` implements, and fix what you find. Say that the check
was done by hand; the file also validates itself when opened and shows an
error panel if anything was missed.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly, including the CDN tags for three.js and
the fonts declared in `assets/view.js`:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-temple-run.html

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `\u003c`,
the two library tags from `NthView.libs`, then `scripts/validate.js` and
`assets/view.js` inlined verbatim, then the three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`.

The hand build is the fallback when no JavaScript runtime is available; the
tool does nothing beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file and say it needs internet access the first time
it opens (for three.js and the fonts), and whether it is in learning or quiz
mode. Build no other view unless asked.

## Content guidance
- **Stretch count**: 5–7 for an article, 10–25 for a topic. Each stretch is
  a 10–15 second run plus its encounter. Long runs (above 60
  stretches, up to 500) work and save progress, but a lesson of several
  shorter runs is kinder.
- **World theme** (`theme`): `jungle` (default, sunlit, demon monkeys),
  `haunted` (night and blue mist, lantern ghosts), `sand` (desert ruins,
  jackal spirits), `ice` (frozen temple, yeti). `chaser.kind` overrides the
  creature.
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
- **Hazards**: a normal stretch has two to four obstacles. `hazards: "none"`
  gives a calm stretch for a hard lesson or a young audience; `heavy` suits a
  recap. Three stumbles in a stretch mean a capture, which is counted but never
  blocks the run.
- **The finale** draws `ask` questions (default 5) from `questions`; write a
  pool of one or two per major takeaway so replays differ.
- **The report** restates each lesson in one line (`lessons`) and maps game
  words to real terms in `glossary`; cite the source with `url` when there
  is one.
- **Tone**: urgent but warm. The chasers are comic, never cruel.

### Converting from Island Quest
Island Quest content converts with small edits; the shared activity types
keep their exact fields.

| Island Quest | Temple Run |
| :- | :- |
| `islands` | `stretches` |
| island `theme` (`grove`, `tower`, `arena`, `workshop`, `canyon`, `hall`, `clock`, `plain`) | `scenery` (`canopy`, `ruins`, `courtyard`, `tunnel`, `cliffs`, `ruins`, `courtyard`, `causeway`), optional |
| world `theme` `lagoon`, `aurora`, `canyon`, `snow` | `jungle`, `haunted`, `sand`, `ice` |
| `companion` | `runner`; add a `chaser` |
| `coins` (guesses) | `torches` (1–9; a score, put out by wrong answers in quiz mode) |
| `finale.questions` | the same, plus optional `ask` |
| `collect`, `pads`, panel types | unchanged (`collect` is played on the track) |
| `fork` | `gates` (same fields) |
| `beacons` | `torches` (same fields) |
| `steps` | `levers` (same fields) |
| `gather` | `tiles` (same fields) |
| `hotspot` (3D object) | `lanes` (rename `parts` to `options`, keep 2–3) or `hotspot` with a diagram (add `x`, `y`, `w`, `h`) |

## Common mistakes
- A scored activity (`choice`, `lanes`, `order`, …) with a `quiz` → remove
  the quiz; the activity is the question.
- An exploration activity (`story`, `tune`, `collect`, …) without a `quiz` →
  add one that tests what it showed.
- A track type or an exploration in `checks` → checks take only scored panel
  types; make the track type the main `activity`.
- `answer` that is not an option, path or part id → copy the id exactly.
- Long labels on track props → one or two words; move the detail into `lead`.
- `cloze.text` with a different number of `___` than `gaps` → one marker per gap.
- `text.answer` without the obvious variants → add them to `accept`.
- A `hotspot` part outside the 100 × 60 grid → keep `x + w ≤ 100`, `y + h ≤ 60`.
- `strictMode: true` when the user only wanted to learn → leave it off.
- Every stretch the same type → mix at least four or five types.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), modes, themes, scenery, encounters and the complete Rainforest Run example
- `references/activities.md` — which of the 31 activity types fits which question, with a snippet for each
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; declares the CDN libraries in `NthView.libs` and the themes in `NthView.THEMES`
- `examples/example.html` — Rainforest Run, a working standalone sample built from the schema example
