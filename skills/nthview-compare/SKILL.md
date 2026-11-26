---
name: nthview-compare
description: Builds a compare-and-contrast view of two to four similar things: a matrix of options against named criteria that becomes one card per criterion or per option on phones, a predict-then-reveal self-test on the grid, a "when to choose which" guide, a recap of similarities, differences and common mix-ups, and practice that makes the learner tell the options apart (sort statements, fill a hidden cell, pick the option for a situation, choose the true contrast, explain the difference in their own words). Use when the user asks to compare or contrast, says "X vs Y", "difference between", "which should I use", "pros and cons", "comparison table" or "how are these alike", or keeps confusing similar ideas; not for one concept on its own, for a process over time, or for more than four options.
---

# NthView — Compare

## Overview
The learner meets two to four easily confused options compared on named
criteria. They can read in any order (an overview, a matrix, one card per
criterion or per option, "when to choose which", a recap) and practise
whenever they like with questions that make them tell the options apart,
each explained. Telling similar things apart is learned by comparing them
side by side on explicit criteria, predicting before reading, and practising
mixed questions that set the options against each other; the view is built
for exactly that.

Everything works from 320px: the matrix (sticky header and first column) on
wide screens, cards on phones, toggles for "differences only" or "shared
only", option chips to focus on two, and a predict mode that covers the
grid so the learner guesses each cell's mark before revealing it. Scored
questions offer "Check, I'm sure" and "Check, not sure", and confident
errors are flagged for review. Progress is saved in the browser at every
step and restored on reopening; Restart erases it. The file needs no
internet access.

## When to use
- Two to four things that are easy to confuse: tools, methods, laws,
  species, diseases, frameworks, assessment types, historical periods
- The user asks "X vs Y", "what's the difference", "which should I use when",
  for a comparison table or pros and cons
- A lesson needs a chapter that confronts a confusion between neighbouring
  ideas, or consolidates several ideas side by side

Do not use when:
- There is one concept with parts and relations (use `nthview-concept-map`)
- The content is a process or exchange over time (use `nthview-dataflow` or
  `nthview-mechanism`)
- More than four options: split into two comparisons, or group the options
- Judgement calls inside one story matter more than the contrast
  (use `nthview-scenario-quiz`)

## Procedure

### 1. Understand the content
Name the options and the question the comparison answers (`focus`): "Which
assessment answers which question?". List every criterion on which the
options differ in a way that matters, plus one or two on which they are
alike. Find the situations that call for each option, the beliefs people
hold that blur them, and the one principle that ties the comparison
together (`bigIdea`). Use reliable sources and note them.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
Open `references/complete-example.md` only when a table leaves the shape of
something unclear; it is long. Never open `assets/view.js` or
`scripts/validate.js`: the tools run and copy them, and everything the JSON
needs is in this file and `references/schema.md`.
- Order dimensions with the most telling first; the first is usually "the
  question it answers" or "purpose".
- Write every cell short enough for a table (one line or two). Put the
  evidence, the nuance and the source in `detail`.
- Give marks one scale per dimension: `yes`/`partly`/`no` for a feature,
  `low`/`medium`/`high` for a degree. Leave marks off where text says it
  better (purpose, who, output).
- Give each dimension a `takeaway` in "with regard to X, A … whereas B …"
  form, and mark shared criteria `alike: true`; keep one or two.
- Write 8–14 questions and interleave the kinds and options: never two
  questions about the same option in a row, never all the sorts first.
  Aim each at the pair most often confused. Every option should be the
  answer of at least one `pick`.
- A `cell` question needs the cells of its dimension to differ in text.
- `bigIdea` is the principle, shown after comparing; do not put it in
  `intro`.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable.

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

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-compare.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `<`,
then `scripts/validate.js` and `assets/view.js` inlined verbatim, then the
three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`. This view loads no
library, so there are no CDN tags.

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
Hand the user the single file. It works offline. Build no other view unless
asked.

## Content guidance
- **Size.** Three options and six to eight criteria read well on a phone;
  four options by ten criteria is the ceiling. Fewer, sharper criteria beat
  many vague ones.
- **Criteria that discriminate.** Each criterion should help someone choose.
  Drop one where every cell would say the same thing, unless the sameness
  is itself a lesson (then mark it `alike`).
- **Fill every cell.** A blank is not allowed; use `mark: "na"` and say why
  in the text.
- **Facts, not adjectives.** "At least every three months (PCI DSS)" beats
  "frequently". Say when something is convention rather than a rule.
- **Situations are concrete.** "A new portal goes live next month" beats
  "for web apps". `pick` notes say why each other option falls short.
- **Question mix.** One or two `sort` (shared versus distinctive traits),
  two or three `cell`, three or four `pick`, two `choice` (one "true of A
  but not B", one "which is false"), one `explain` near the end.
- **Misconceptions.** Two to five real ones, each corrected with the fact
  that separates the options.
- **Sources.** Cite standards and primary documents for factual
  comparisons; the overview lists them.

## Common mistakes
- Criteria that are really options ("Cloud", "On-premise" as rows) → rows
  are criteria, columns are the things compared.
- Cells that repeat the criterion name ("Scope: broad scope") → say what the
  option is, briefly.
- A `cell` question on a dimension whose cells read alike → the validator
  rejects it; ask about a dimension where they differ.
- Mixing `yes` and `high` in one dimension → one scale per dimension.
- All questions about the same pair, or all of one kind → interleave.
- `bigIdea` repeated in the intro → it lands better after the comparison.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth)
- `references/complete-example.md` — a complete valid example; open only when needed
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; run it, never read it
- `assets/view.js` — `NthView.build(container, data)`; the build tool copies it, never read it
- `examples/example.html` — scan vs pen test vs red team, a working standalone sample built from the complete example
