---
name: nthview-island-quest
description: Turns a paper, article or concept into a playable 3D island adventure where each island is a short lesson with one of 25 hands-on activities (quiz, sorting, matching, ordering, estimating, lighting beacons, stepping on pads and more), ending in a final exam and report card; any number of islands from 3 to 60, in one of four world themes. Use when the user asks for a game, an adventure, an "explorable explanation", something playful for beginners or kids, or wants to learn by doing rather than reading; not for quick reference or dense technical detail.
---

# NthView — Island Quest

## Overview
The learner is a coach walking a small companion character across an
archipelago of islands laid out in rings around a central hub. Every island
is one idea from the source: a short lesson, a hands-on activity chosen from
25 types (collect votes, stand on a pad, sort into buckets, match pairs, rank,
estimate a number, light beacons, step on pads in order, predict then watch,
and more), and a one-line takeaway. Coins pay for guesses, stars reward
first-try answers, and finishing every island opens a final exam and a report
card that maps the game words back to the real terms. The output is a single
HTML file that loads three.js and two web fonts from CDNs, so it needs
internet access the first time it opens.

On about a third of the longer walks between islands, a surprise ride takes
over instead: a bird swoops in and carries the coach, a hot-air balloon drifts
down, or the halo unfolds into a glider. The ride is cosmetic, needs no data,
lands at the same spot, and is skipped for short hops and under reduced motion.

## When to use
- Research papers, long articles, lecture notes or a whole topic with 5–25
  separable ideas (the layout supports 3–60 islands)
- Content with numbers that can become bars, rankings or estimates
- Terminology that benefits from matching, sorting, gap-filling or flashcards
- Beginners, children, or anyone who asked for a game or something playful
- The user wants a memorable walk-through rather than a reference

Do not use when:
- The content is a quick fact list or definitions only (a quiz or flashcard view fits better)
- The user needs exact technical detail; this view deliberately simplifies
- Fewer than 3 distinct ideas exist (the archipelago needs at least 3 islands)

## Procedure

### 1. Understand the content
Read the paper, article or notes. Pull out the findings or ideas that stand
on their own and put them in a teaching order where each builds on the last:
5–7 for a short quest, up to 25 for a whole topic. For each idea note: the
plain-language point, any numbers that compare things, a wrong belief a
beginner holds, a sequence or classification hidden in it, and the one-line
takeaway. Pick a companion character and a frame story (an exam, a journey,
a delivery) that makes the source's core tension concrete, and a world
`theme` whose mood matches the topic (table in `references/schema.md`).

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- One island per idea, in play order. Give each a vivid two-word `name`, a
  scenery `theme` and, when the default palette does not suit, a `color`.
- Choose the activity type from the shape of the idea using the table in
  `references/activities.md`, and vary the types: a good quest changes
  rhythm every island or two, with a walking task roughly every third
  island. Seventeen types replace the quiz (the activity is the question);
  the eight exploration types need a `quiz` afterwards.
- Every island needs `lead` and `remember`. Use `findings` whenever the
  source has numbers to compare; set `after: true` when the bars would give
  away the answer.
- Write for a beginner: short sentences, concrete nouns, no jargon. Keep the
  real terminology for the report's glossary.
- Reuse the companion's name in text so the story stays personal.

### 3. Validate
Write the JSON to a file and run:

    node skills/nthview-island-quest/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable (a wrong option without `why`, findings without `text`, too few
activity types, an empty bucket).

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly, including the CDN tags for three.js and
the fonts declared in `assets/view.js`:

    node scripts/build-html.js skills/nthview-island-quest <path-to-json> examples/<concept-slug>-island-quest.html

Generated games go in the repo-root `examples/` folder (or wherever the user
asks); never inside `skills/`.

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `<`,
the two library tags from `NthView.libs`, then `scripts/validate.js` and
`assets/view.js` inlined verbatim, then the three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`.

### 5. Deliver
Hand the user the single file and say it needs internet access the first time
it opens (for three.js and the fonts). Build no other view unless asked.

## Content guidance
- **Island count**: 5–7 for a paper, 10–25 for a topic. The layout grows in
  rings of 7, 14, 21 and 28 islands; above 30 the validator warns that the
  quest is long, and 60 is the hard limit.
- **World theme** (`theme` at the root): `lagoon` (default, bright day),
  `aurora` (night with aurora curtains), `canyon` (desert mesas and oasis
  water), `snow` (snowfall). Match the mood to the topic with the table in
  `references/schema.md`. Each works in light and dark mode and sets the
  default island palette.
- **Pick the activity from the shape of the idea**; the full table and a
  snippet per type are in `references/activities.md`. In short:
  - compare magnitudes → `pads`, `race`, `rank`, `estimate`, `bars`, `compare`
  - sequence or process → `story`, `order`, `steps`
  - vocabulary and classification → `match`, `sort`, `gather`, `cloze`,
    `multi`, `odd`, `beacons`, `flashcards`
  - cause, effect and misconception → `truefalse`, `predict`, `confidence`,
    `tune`, `switches`, `fork`
  - a labelled object or system → `hotspot`
  - "many samples, majority wins" → `collect`
- **Scenery** (`theme` on the island) is decorative and independent of the
  activity: `grove`, `tower`, `arena`, `workshop`, `canyon`, `hall`, `clock`,
  `plain`. Props sit on the outward half of the island; `plain`, `arena`,
  `workshop` and `grove` leave them the most room.
- **Numbers**: keep `findings.rows` to the two to four numbers that make the
  point; use `grey` for baselines and `dashed` for estimates or ceilings. If
  the numbers are illustrative rather than cited, say so in `caption` or
  `text`.
- **Labels on 3D props** are short: pad labels ≤12 characters, beacon, bin,
  part and path labels ≤16. Explain long names in `lead` or `prompt`.
- **`collect.items`** are short tokens (letters work best). Explain what each
  letter stands for in `lead`, `body` or `prompt`.
- **`order`, `rank`, `steps`** list their items in the correct order; the
  renderer shuffles them for the learner.
- **Quiz questions** test the takeaway, not trivia. Make the wrong options
  tempting beliefs, and give each a `why` that points back to the lesson.
- **The finale** asks the learner to apply the lessons to situations, one
  question per major takeaway, with an encouraging `okText`.
- **The report** restates each lesson in one line and maps game words to real
  terms in `glossary`; cite the source with `url` when there is one.
- **Tone**: warm, concrete, a little playful. Never condescending.

## Common mistakes
- A quiz-replacing activity (`pads`, `order`, `match`, …) with a `quiz` →
  remove the quiz; the activity is the question.
- An exploration activity (`story`, `tune`, `compare`, …) without a `quiz` →
  add one that tests what the exploration showed.
- `answer` that is not an option/part/path `id` → copy the id exactly.
- `cloze.text` with a different number of `___` than `gaps` → one marker per gap.
- `sort` items pointing at a bucket id that does not exist → use `buckets[].id`.
- Readout placeholders using control ids that do not exist → use only the
  `controls[].id` (or `switches[].id`) values of that activity.
- Findings values above 100 → scale to "out of 100" and say so in `caption`.
- Long `lead` paragraphs → split into `lead` plus one or two `body` items.
- Forgetting `after: true` on findings that would give away the answer.
- Every island the same type → mix at least four or five types.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), the world-theme table, the layout rule and the complete Exam Island example
- `references/activities.md` — which of the 25 activity types fits which idea, with a snippet for each
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; declares the CDN libraries in `NthView.libs`
- `examples/example.html` — Exam Island, a working standalone sample built from the schema example
