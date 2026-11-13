---
name: nthview-hunter
description: Turns a topic, paper or document into a Hunter Assassin style top-down 3D stealth game where the learner sneaks through maze rooms past guards with flashlights; each room is a block with a short lesson, three to five soldiers drawn from eleven distinct kinds (riflemen, swordsmen, snipers, shield bearers, officers who raise the alarm, drones, medics) and a boss, and when the boss falls a secret box asks about the lesson with one of 31 activity types, in a card or as a task in the room, before its key opens the door to the next block; guards notice, chase and search instead of ending the game at once; 1 to 500 blocks, one-time powers, four themes, a learning mode and an optional quiz mode. Use when the user asks for a stealth game, a sneaking game, "Hunter Assassin", an assassin or guards-and-flashlights game, a tap-to-move game for phones, or practice that should feel like a mission; not for slow reading, dense reference material or content without separable questions.
---

# NthView — Hunter

## Overview
The learner plays a hunter seen from above who slips through a building one
room at a time: tap the floor to move, stay out of the guards' flashlight
cones, and reach each guard to take him down in one hit. A guard who catches
the hunter in his light needs a moment to react: leave the light in time and
he chases and searches instead of striking. Every room is one block of the
source: a short lesson read before the room starts, three to five soldiers of
eleven clearly different kinds and one boss with an extra power, and, when the
boss falls, a
secret box that asks the lesson's question in a card (23 panel types) or as
a task played in the room (8 room types). The answer frees the key, the key
opens the door, and the box also holds a one-time power (a sprint, a throwing
knife, a grenade, a smoke grenade, a vest or a flower-pot disguise) for the
rooms ahead. The stealth makes each
lesson a small mission and the box turns it into a memorable moment; a vault
with questions from a pool and a report end the game. The output is a single
HTML file that loads three.js and one web font from CDNs, so it needs
internet access the first time it opens. The room is real 3D with textured
floors and walls and a shadow-casting light for every flashlight; on slow
devices it falls back to drawn light cones by itself.

Two modes: learning mode (the default) explains every wrong answer, shows the
right one and never blocks; quiz mode (`strictMode: true`) breaks a lockpick
per wrong answer and keeps the answer hidden until found. In both, a guard
who keeps the hunter in his light past his reaction time ends the attempt
and only that room starts again, the same room with every guard back at his
post; the guards slow down a little each time, and from the third time the
learner may skip to the question, so stealth skill never blocks learning. Progress and restart: the game saves
progress in the browser as the learner plays (block reached, stars, gems,
times caught, powers, settings) and resumes at the start of that block when
the file is reopened; the Restart button clears it and starts over.

## When to use
- A topic, article, lecture or document with several separable ideas, each
  testable by a question (the game supports 1–500 blocks; 5–25 is typical)
- Recall and consolidation: vocabulary, facts, sequences, classifications,
  true-or-false misconceptions, numbers worth remembering
- Learners who asked for a game, stealth or something tactical; phones and
  tablets (portrait first, tap to move) and laptops alike
- A quiz, test or graded check that should feel like a game (`strictMode`)

Do not use when:
- The learner needs to read slowly or explore one model in depth (Explorable
  Lab fits better)
- The content is one idea without questions, or mostly connections between
  ideas (Concept Map)
- The audience wants no action at all; Island Quest offers the same
  activities at walking pace, and Scenario Quiz needs no game skill

## Procedure

### 1. Understand the content
Read the source and pull out the ideas that stand on their own, in a teaching
order where each builds on the last. For each idea note the plain-language
point, the question that proves it was understood, its shape (one answer, a
sequence, groups, a number, a statement to judge, a word to recall), a
tempting wrong belief, and the one-line takeaway. Pick a hunter, the guards
and a frame story (a rescue, a recovery, an inspection at night) and a world
`theme` whose mood suits the topic (table in `references/schema.md`).

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
Open `references/complete-example.md` only when a table leaves the shape of
something unclear; it is long. Never open `assets/view.js` or
`scripts/validate.js`: the tools run and copy them, and everything the JSON
needs is in this file and `references/schema.md`.
- One block per idea, in play order. Give each a vivid two-word `name`, the
  name of a room. `room`, `boss`, `soldiers`, `squad` and `reward` are
  optional; by default rooms and bosses rotate and the squads start with
  rookies and bring in the special kinds later. Set them to pace the game
  (three soldiers for a hard lesson, five for a recap) or to name the squad
  (`"squad": ["blade", "shield", "rifleman"]`).
- Choose each activity from the shape of the question using the table in
  `references/activities.md`, and vary the types. Prefer the specialised
  types; `choice` is the fallback that can always express a question. Put a
  room task (`lanes`, `gates`, `torches`, `planks`, `harvest`, `levers`,
  `tiles`, `collect`) roughly every third block.
- 23 types are scored and replace the quiz; the eight exploration types
  (`compare`, `bars`, `switches`, `flashcards`, `story`, `tune`, `race`,
  `collect`) need a `quiz`. A lesson that deserves several checks gets up to
  ten more scored panel questions in `checks`.
- Room tasks are played in the quiet room after the boss has fallen, so the
  learner never reads and dodges at once. Keep their labels to one or two
  words (they sit on the floor) and explain them in `lead`, `body` or
  `prompt`.
- Leave `strictMode` off (omit it or set `false`) unless the user explicitly
  asks for a quiz, test or exam, or to evaluate or grade the learner.
- Every block needs `lead` and `remember`. Use `findings` for numbers; set
  `after: true` when the bars would give the answer away.
- Write for a beginner: short sentences, concrete nouns, no jargon; keep the
  real terms for the report's glossary. Reuse the hunter's name in the text.
  Keep the wording mild: guards are taken down or knocked out, the hunter is
  seen or caught.

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
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly, including the CDN tags for three.js and
the font declared in `assets/view.js`:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-hunter.html

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

Build by hand only when no JavaScript runtime is available: it means
writing out the whole renderer (40–270 KB, up to about 70,000 tokens) and is
easy to get wrong, so tell the user the cost first. The tool does nothing
beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file and say it needs internet access the first time
it opens (for three.js and the font), and whether it is in learning or quiz
mode. Build no other view unless asked.

## Content guidance
- **Block count**: 5–7 for an article, 10–25 for a topic. Each block is a
  room of about a minute plus its question. Long games (above 60 blocks, up
  to 500) work and save progress, but a lesson of several shorter games is
  kinder.
- **World theme** (`theme`): `warehouse` (default, slate and concrete),
  `bunker` (olive and sand), `lab` (teal and white), `rooftop` (night and
  brick). The cards take the theme's accent colour.
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
- **Rooms and bosses**: `soldiers` 3 is gentle and 5 is busy. The `warden`
  forces a full clear and the `brute` a second approach, so they suit recap
  blocks; the `sentinel` and `sprinter` are quicker. Being caught restarts
  only the room, is counted but never costs stars, and never blocks.
- **Soldiers** (`squad`): `rookie` and `rifleman` are the plain ones.
  `scout` chases fast, `blade` has only a sword and must reach the hunter,
  `sniper` has a very long thin light, `heavy` needs two hits, `shield`
  falls only from behind, `officer` and `drone` raise the alarm, `medic`
  wakes fallen soldiers, and `prowler` is the toughest: fast, unpredictable
  and hard to shake off. Leave `squad` out to get the built-in ramp; name it
  when a block should feel different, at most one or two special kinds per
  room for beginners.
- **Powers** (`reward`): the default rotation hands out all six in turn
  (`sprint`, `knife`, `smoke`, `vest`, `grenade`, `pot`). A
  block answered without a mistake gives two charges, which rewards careful
  reading; mention it in `intro.steps`.
- **The finale** draws `ask` questions (default 5) from `questions`; write a
  pool of one or two per major takeaway so replays differ.
- **The report** restates each lesson in one line (`lessons`) and maps game
  words to real terms in `glossary`; cite the source with `url` when there
  is one.
- **Tone**: tense but warm and never gory. The guards are obstacles, not
  victims: no blood, no cruelty in the text.

### Converting from Temple Run or Island Quest
Temple Run content converts with renames only; every activity keeps its type
name and fields. Island Quest content converts through the Temple Run table
in that view's `SKILL.md` first.

| Temple Run | Hunter |
| :- | :- |
| `stretches` | `blocks` |
| `runner` | `hunter` |
| `chaser` `{name, kind}` | `guards` `{name}` |
| `torches` (root, 1–9) | `picks` |
| world `theme` `jungle`, `haunted`, `sand`, `ice` | `warehouse`, `rooftop`, `bunker`, `lab` (pick by mood) |
| `scenery` | `room` (`corridors`, `pillars`, `offices`, `yard`), optional |
| `encounter` | `boss` (`sentinel`, `sprinter`, `brute`, `warden`), optional |
| `hazards` | `soldiers` (3–5) or a named `squad`, optional |
| all 31 activity types, `quiz`, `checks`, `findings`, `aside`, `remember` | unchanged; reword prompts that mention running, lanes or jumping |
| `finale`, `report`, `intro` | unchanged; retell the frame story |

## Common mistakes
- A scored activity (`choice`, `lanes`, `order`, …) with a `quiz` → remove
  the quiz; the activity is the question.
- An exploration activity (`story`, `tune`, `collect`, …) without a `quiz` →
  add one that tests what it showed.
- A room type or an exploration in `checks` → checks take only scored panel
  types; make the room type the main `activity`.
- `answer` that is not an option, path or part id → copy the id exactly.
- Long labels on things in the room → one or two words; move the detail into
  `lead`.
- A prompt copied from a runner ("run through the lane", "jump the plank") →
  reword it for the room ("walk to the crate", "step on True or False").
- `cloze.text` with a different number of `___` than `gaps` → one marker per gap.
- `text.answer` without the obvious variants → add them to `accept`.
- A `hotspot` part outside the 100 × 60 grid → keep `x + w ≤ 100`, `y + h ≤ 60`.
- `strictMode: true` when the user only wanted to learn → leave it off.
- Every block the same type → mix at least four or five types.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), modes, themes, rooms, the eleven kinds of soldier, bosses, powers
- `references/complete-example.md` — a complete valid example; open only when needed
- `references/activities.md` — which of the 31 activity types fits which question, with a snippet for each
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; run it, never read it
- `assets/view.js` — `NthView.build(container, data)`; declares the CDN libraries in `NthView.libs` and the themes in `NthView.THEMES`; the build tool copies it, never read it
- `examples/example.html` — Operation Canopy, a working standalone sample built from the schema example
