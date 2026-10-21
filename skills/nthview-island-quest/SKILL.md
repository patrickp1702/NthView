---
name: nthview-island-quest
description: Turns a paper, article or concept into a playable 3D island adventure where each island is a short lesson with a hands-on activity and a one-question quiz, ending in a final exam and report card. Use when the user asks for a game, an adventure, an "explorable explanation", something playful for beginners or kids, or wants to learn by doing rather than reading; not for quick reference or dense technical detail.
---

# NthView — Island Quest

## Overview
The learner is a coach walking a small companion character across a ring of
islands. Every island is one idea from the source: a short lesson, often a
hands-on activity (collect votes, stand on a pad, move sliders, step through a
story, watch bars race), and one easy question. Coins pay for guesses, stars
reward first-try answers, and finishing every island opens a final exam and a
report card that maps the game words back to the real terms. The output is a
single HTML file that loads three.js and two web fonts from CDNs, so it needs
internet access the first time it opens.

## When to use
- Research papers, long articles or lecture notes with 5–7 separable findings
- Content with numbers that can become bars ("64 vs 69 out of 100")
- Beginners, children, or anyone who asked for a game or something playful
- The user wants a memorable walk-through rather than a reference

Do not use when:
- The content is a quick fact list or definitions (a quiz or flashcard view fits better)
- The user needs exact technical detail; this view deliberately simplifies
- Fewer than 3 distinct ideas exist (the ring needs at least 3 islands)

## Procedure

### 1. Understand the content
Read the paper, article or notes. Pull out 5–7 findings that stand on their
own and put them in a teaching order where each builds on the last. For each
finding note: the plain-language idea, any numbers that compare two or more
things, a wrong belief a beginner holds, and the one-line takeaway. Pick a
companion character and a frame story (an exam, a journey, a competition)
that makes "spending effort wisely" or the source's core tension concrete.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- One island per finding, in teaching order. Give each a vivid two-word
  `name` and a `theme` that matches its activity (see Content guidance).
- Every island needs `lead`, `remember`, and either a `quiz` or a `pads`
  activity. Use `findings` whenever the source has numbers to compare.
- Write for a beginner: short sentences, concrete nouns, no jargon. Keep the
  real terminology for the report's glossary.
- Reuse the companion's name in text so the story stays personal.

### 3. Validate
Write the JSON to a file and run:

    node skills/nthview-island-quest/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable (a wrong option without `why`, findings without `text`).

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly, including the CDN tags for three.js and
the fonts declared in `assets/view.js`:

    node scripts/build-html.js skills/nthview-island-quest <path-to-json> <concept-slug>-island-quest.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by `<`, the two library tags
from `NthView.libs`, then `scripts/validate.js` and `assets/view.js` inlined
verbatim, then the three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`.

### 5. Deliver
Hand the user the single file and say it needs internet access the first time
it opens (for three.js and the fonts). Build no other view unless asked.

## Content guidance
- **Island count**: 5–7 is the sweet spot. The ring supports 3–9.
- **Pick the activity from the shape of the idea**:
  - `collect` when the idea is "many samples, take the majority" (theme `grove`)
  - `story` when a process goes wrong step by step (theme `tower`)
  - `tune` with `visual.kind: "circle"` for "more members, more rounds" trade-offs (theme `arena`)
  - `tune` with `visual.kind: "grid"` and `leader: true` for layered teams or pipelines (theme `workshop`)
  - `pads` with `bars` when the learner must spot the biggest difference among groups (theme `canyon`)
  - `pads` with `size` when the learner chooses between a big and a small option (theme `hall`)
  - `race` when two costs or speeds should be compared (theme `clock`)
  - no activity plus `plain` for a short read-only lesson, sparingly
- **Numbers**: keep `findings.rows` to the two to four numbers that make the
  point; use `grey` for baselines and `dashed` for estimates or ceilings.
- **Quiz questions** test the takeaway, not trivia. Make the wrong options
  tempting beliefs, and give each a `why` that points back to the box above.
- **The finale** asks the learner to apply the lessons to situations, one
  question per major takeaway, with an encouraging `okText`.
- **The report** restates each lesson in one line and maps game words to real
  terms in `glossary`; cite the source with `url` when there is one.
- **Tone**: warm, concrete, a little playful. Never condescending.

## Common mistakes
- A `pads` island with a `quiz` → remove the quiz; the pads are the question.
- `answer` that is not a pad `id` → copy the id exactly.
- Readout placeholders using control ids that do not exist → use only the
  `controls[].id` values of that activity.
- Findings values above 100 → scale to "out of 100" and say so in `caption`.
- Long `lead` paragraphs → split into `lead` plus one or two `body` items.
- Forgetting `after: true` on findings that would give away a `pads` answer.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth) and the complete Exam Island example
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; declares the CDN libraries in `NthView.libs`
- `examples/example.html` — Exam Island, a working standalone sample built from the schema example
