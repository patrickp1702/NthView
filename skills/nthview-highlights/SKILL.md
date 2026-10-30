---
name: nthview-highlights
description: Produces a swipeable stack of text-only cards, in the feel of an educational social-media carousel, that previews everything a lesson or document will cover, one idea per card, with a recap and a call to action. Use when the user asks for highlights, an overview, a preview, a syllabus card, a "what you will learn", a teaser, or when building the first chapter of a lesson; not for teaching the detail itself, which belongs to the other views.
---

# NthView — Highlights

## Overview
The learner sees one portrait card at a time, like a carousel post: a hook on the cover, then one card per thing the lesson or document covers, a recap checklist that ticks off what they have read, and a last card that sends them on. A grid button shows every card at once. It is an advance organiser: it tells the learner what is coming and why it matters, so the detailed chapters land on prepared ground. Progress is saved in the browser; Restart clears it.

## When to use
- The first chapter of every lesson: the overview of all chapters
- A preview of a long document, paper or course before the learner commits
- A recap that lists what was covered, for the end of a lesson
- Anything that is a list of ideas worth one line each

Do not use when:
- The content must be explained, practised or tested: use the view that fits the shape (Concept Map, Explorable Lab, Scenario Quiz, Island Quest, …)
- There is only one idea: a Highlights with three cards is thin; write it into the chapter instead

## Procedure

### 1. Understand the content
List what the lesson or document will cover, one line each, in the order the learner will meet it. For a lesson that is the chapter list with each chapter's single learning objective. Note one striking number, one quotable sentence and the reason a learner should care.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- Open with a `cover` card: the hook, why this matters, in one headline and one sentence.
- One `topic`, `list`, `number` or `quote` card per thing covered. Use the chapter name as the `kicker`. Vary the kinds; two `number` cards in a row read as a spreadsheet.
- Close with a `recap` card, then a `cta` card whose `href` opens the first chapter (`01-….html` from inside a lesson's `chapters/` folder, or the document itself).
- `theme`: dark (`midnight`, `ocean`, `forest`, `berry`) for evening topics and technology, light (`sunrise`, `paper`) for health, children and warm subjects. Match the lesson's tone.
- `tags`: the lesson's tags, lowercase kebab-case.
- Keep every card readable on a phone: headline under 60 characters where you can, body under 200, at most 4 points.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable: a missing cover or recap usually means the preview has no hook or
no close.

If `node` is not installed, try `bun` or `deno run -A` with the same
script; both run it unchanged. If no JavaScript runtime exists, do the
validator's job yourself: check the JSON against every table, cross-field
rule and warning in `references/schema.md`, which is exactly what
`scripts/validate.js` implements, and fix what you find. Say that the check
was done by hand; the file also validates itself when opened and shows an
error panel if anything was missed.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly, including the Google Fonts tag declared
in `NthView.libs`:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-highlights.html

If building by hand:
- the JSON in `<script type="application/json" id="nthview-data">`, with
  every `<` in the serialised JSON replaced by the six characters `\u003c`,
- the one `<link rel="stylesheet">` tag from `NthView.libs` before the scripts,
- the full contents of `scripts/validate.js`, then `assets/view.js`, inlined,
- the bootstrap script that calls `NthView.build(document.getElementById("app"), data)`.
Name the file `<concept-slug>-highlights.html`.

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

The hand build is the fallback when no JavaScript runtime is available; the
tool does nothing beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file. Build no other view unless asked. Inside a lesson the file is chapter `01-highlights` and the lesson builder adds the navigation bar.

## Content guidance
- 6–10 cards. Fewer than 5 is thin; more than 12 stops being a preview.
- One idea per card. If a card needs a second paragraph, it is two cards or it belongs in the chapter.
- Headlines are claims, not labels: "A vaccine is a rehearsal" beats "Introduction".
- The cover answers "why should I care" in one breath. The cta answers "what do I do now".
- Use one `number` card and one `quote` card at most; they are seasoning.
- Every card may carry `href` to the chapter it previews; the "Open" button then lets a learner jump straight in.
- Hashtags are the lesson's tags; do not invent new ones per card unless the card introduces a term.
- Text only. No emoji strings standing in for images; the gradient and shapes are the visual.

## Common mistakes
- Teaching inside the preview → one line per topic; the detail belongs to the chapter.
- Cover card that names the subject but gives no reason to care → lead with the surprising or useful claim.
- Every card the same kind → mix `topic`, `list`, `number`, `quote`.
- Points longer than a line each → shorten, or move to body.
- Forgetting the `cta` href → the learner reaches the end with nowhere to go.
- Kicker repeating the headline → kicker is the chapter name or a label, headline is the idea.

## Files
- `references/schema.md` — the JSON format (single source of truth)
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`
- `examples/example.html` — a working standalone sample
