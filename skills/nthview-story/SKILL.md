---
name: nthview-story
description: Turns a concept, process, system or event into a 3D animated story that plays like a short explainer video: cartoon characters personify its parts, props stand for its things, and short captioned beats in a small toon world, with a "who's who" cast card, a pause-to-think moment and key takeaways after each chapter, a recap, optional read-aloud narration, chapters, a scrubber and phone full screen. Use when the user asks for a story, an animation, an animated explainer, a cartoon, "explain it like a video", "show me who does what", personified parts or characters, or something to watch rather than answer; not for practice or testing (it asks no questions), dense reference, or exact numbers changing over time (use nthview-mechanism).
---

# NthView — Story

## Overview
The learner presses Play and watches a landscape 3D story: a small toon
town where cartoon characters stand for the parts of the concept (a courier
for a request, a guard for a check, a cell for a cell), props stand for its
things (a letter, a padlock, a gauge) and captions say the one idea of each
beat. It plays like a video, scene by scene, but the learner is in control:
Play and Pause, a scrubber with chapter marks, beat by beat with the arrow
keys, replay of a beat, speed, a chapter list with the full transcript, a
"Who's who" card, optional read-aloud narration, and full screen in
landscape on phones. After each chapter it holds still for a "pause to
think" prompt and the key takeaways; the end card recaps the whole story.
It asks no questions: its only job is to explain well.

The output is one self-contained HTML file. It loads three.js r128 from
cdnjs and two typefaces from Google Fonts, so it needs internet access the
first time it opens (offline it shows an error panel; the fonts fall back).
Progress (chapter, beat, speed, narration and auto-play settings) is saved in
the browser and resumed on reopening; Restart erases it.

## When to use
- A system or process whose parts can act: requests and servers, cells and
  signals, buyers and markets, kings and parliaments, forces and objects
- "Who does what, in what order, and why it matters", told as a story with
  a conflict and a resolution (an attack and a defence, a problem and a fix)
- A first, friendly pass at a topic before practice in another view, or the
  "watch it" chapter of a lesson (roles `preview` or `demonstrate`)
- Anyone, including children, who would rather watch than read; phones

Do not use when:
- The learner should practise or be tested (use `nthview-scenario-quiz`,
  `nthview-island-quest` or `nthview-temple-run`)
- Exact quantities change under rules over time (use `nthview-mechanism`)
- Messages between parties are the point, field by field (use
  `nthview-sequence` or `nthview-dataflow`)
- The content is a reference to look things up in, or has no actors at all
  (use `nthview-concept-map` or `nthview-zoom-map`)

## Procedure

### 1. Understand the content
Find the **cast**: the three to six parts that act (people, programs,
organs, institutions, forces) and the one thing each one does. Find the
**props**: the things that move between them, and the metaphor each one
makes concrete (a letter is a request, a key is a password, a gauge is a
score). Find the **places** where things happen (two to four). Then find
the **story**: a situation, a turn (what goes wrong, what changes) and a
resolution, in three to six chapters of three to seven beats. Each beat is
one idea. Collect the public sources you rely on.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
Open `references/complete-example.md` only when a table leaves the shape of
something unclear; it is long. Never open `assets/view.js` or
`scripts/validate.js`: the tools run and copy them, and everything the JSON
needs is in this file and `references/schema.md`.

You write **who, what and where**, never coordinates. The player places
everyone from the set and the shot, walks people in and out, turns them to
face each other (a little toward the camera, as on a stage), hands props
over and frames the camera.

- **Cast**: pick the preset whose look fits the role (`guard` for a check,
  `courier` or `messenger` for something that carries, `crook` or `spiky`
  for a threat, `blob` for a cell or a particle, `robot` for a machine,
  `clerk` or `chief` for a service, `scientist`, `doctor`, `teacher`,
  `royal`, `knight`, `worker`, `student`, `citizen`). `name` is short (it is
  on the tag), `role` says the part it plays, `stands` says what it is in
  the real system. Give a `post` to whoever works at a place (the clerk
  behind the counter, the guard by the gate).
- **Props**: one per thing that matters; `means` states the metaphor. Use
  `card` for a short rule or message, `code` for a few lines of real code,
  `formula` for an equation, `number` for a big figure, `gauge` for a level,
  `counter` for a count, `orb` for anything abstract.
- **Places**: a set per location (`bank`, `shop`, `office`, `lab`, `gate`,
  `server-room`, `home`, `street`, `park`, `classroom`, `tower`, `factory`,
  `organic` for inside a body, `stage` for ideas with no place). Use the
  same set twice for a real and a fake version of one place and let the
  `name` tell them apart.
- **Beats**: `with` lists exactly who and what is at the place now; the
  player walks others off and newcomers in. Then `do` the actions in order
  (`walk`, `give`, `take`, `show`, `hide`, `react`, `point`, `stamp`,
  `open`, `set`, `reject`, `celebrate`, `crowd`, `link`) and add up to three
  `lines` in the characters' own voice. `focus` picks what the camera and the
  spotlight show; leave `shot` on `auto` unless a beat needs a particular one
  (`close-up` on a prop, `low` for menace or triumph, `crane-up` to pull back
  at a moment of consequence, `aerial` for the whole town).
- **Caption** is the one idea of the beat in at most 22 words, plain and
  concrete. `say` is optional, fuller narration read aloud instead of the
  caption when the learner turns the voice on.
- **Chapters** end with a `takeaway`: an optional `think` prompt (a pause
  for reflection, never a question to answer) and two to four `points`.
  End the story with `recap` and list `sources`.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable: a long caption, a chapter without takeaways, an actor who never
appears or someone speaking who is not at the place usually means the story
is harder to follow than it should be.

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
repository tool does this exactly:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-story.html

If building by hand: the three.js script tag and the Google Fonts link from
`NthView.libs`, then the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `\u003c`,
then `scripts/validate.js` and `assets/view.js` inlined verbatim, then the
three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`.

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

Build by hand only when no JavaScript runtime is available: it means
writing out the whole renderer (40–270 KB, up to about 70,000 tokens) and is
easy to get wrong, so tell the user the cost first. The tool does nothing
beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file. Say that it needs internet access the first
time it opens (three.js and fonts load from public CDNs), that on a phone
"Play full screen" turns it sideways, and that the voice button reads it
aloud with the device's own voice. Build no other view unless asked.

## Content guidance
- **One idea per beat.** A beat shows one change and says it in one
  caption. If a caption needs "and then", split the beat.
- **Length.** Three to six chapters, three to seven beats each, about 3–6
  minutes in all; the player paces each beat by its words (roughly 6–10
  seconds), so do not pad with `hold` except after a dense window.
- **Personify faithfully.** Each character should behave the way the real
  part behaves: the guard checks and refuses, the courier carries and does
  not judge. A metaphor that lies (a server that "decides" what it cannot)
  teaches the wrong model.
- **Name the metaphor.** Every actor gets `stands`, every prop `means`; the
  cast card is the legend learners return to.
- **Words beside pictures.** Put a rule in a `card` held by the character it
  belongs to, a figure in a `number`, a line of code in a `code` window, so
  the text sits next to what it describes. At most two windows at a time.
- **Signal the point.** Give `focus` on beats where the eye must land on one
  thing; the camera frames it and the rest dims.
- **Conversational voice.** Lines in the first person ("I only open one
  door"), captions in plain second or third person; no jargon without an
  everyday gloss the first time.
- **A turn, then a fix.** Stories teach best with a problem the learner can
  see: show the failure, then the defence, then why it works.
- **Think prompts** invite reflection on the learner's own life or on the
  mechanism ("Where exactly did the attack happen?"); they are never graded.
- **Accuracy.** Every claim must come from a source you can list; avoid
  statistics unless a source states them exactly.
- **Use example names.** Fictional people and `.example` domains; never real
  companies or private details.

## Common mistakes
- Coordinates or positions in the data → there are none; use `with`, marks
  (`left`, `center`, `right`, `back-left`, `back-right`, `door`, `post`) and
  `post` on the actor.
- Leaving a window prop (`card`, `code`, `formula`, `number`) on screen for
  chapters → `hide` it, or leave it out of the next `with`, once its beat is
  over.
- Someone speaks or acts in a place they are not in → add them to `with`;
  the player brings them in anyway, with a warning.
- Long captions → move the extra to `say`, or split the beat.
- A chapter that ends without `takeaway` → add two to four points, and a
  `think` prompt where reflection helps.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth)
- `references/complete-example.md` — a complete valid example; open only when needed
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; run it, never read it
- `assets/view.js` — `NthView.build(container, data)`; three.js and fonts declared in `NthView.libs`; the build tool copies it, never read it
- `examples/example.html` — how a phishing email steals a password and how MFA and passkeys stop it, a working standalone sample built from the complete example
