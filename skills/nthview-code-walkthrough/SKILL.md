---
name: nthview-code-walkthrough
description: Produces a guided, line-by-line code walkthrough: the learner steps through annotated lines of 1–4 short snippets with notes, subgoal labels and a trace of values, can read the whole code or jump to any step, and answers questions attached to steps (multiple choice, tap the line, predict a value, fill a blank in a line, put lines in order) in any order; works on phones. Use when the user wants to understand, explain or teach a piece of code, a function, a bug, a vulnerability or a fix, or says "walk me through this code", "explain this function line by line", "code tour", "code reading", "what does this code do", "trace this"; not for a whole codebase or architecture (use nthview-zoom-map) or for an exchange between parties (use nthview-dataflow).
---

# NthView — Code Walkthrough

## Overview
The learner reads real code one step at a time: the lines in focus light up
and move to the middle of the code box, the rest is muted, and a note
explains them beside the code (below it on a phone, with the code pinned on
top). Previous, "Step n of m" and Next sit in the same place on every step,
above the code. Steps are grouped under short subgoal labels, a small table
traces the values that matter, and questions attached to steps ask the
learner to choose, tap a line, predict a value, fill a blank or order lines,
each answered with an explanation of why. Nothing forces one path: the
overview gives the route and a warm-up prediction, the Code tab shows the
whole snippet with every step marked, the Questions tab lists every
question, and the wrap-up recaps the key points and the questions worth
another look. It is one self-contained HTML file with no libraries;
progress is saved in the browser and Restart clears it.

## When to use
- One function, a short file, an algorithm or a few related snippets of
  up to about 200 lines in all
- A bug, a vulnerability and its fix: two snippets, before and after
- Learning to read and trace code: what each line does, what a value is
  at a given point, why a line is there
- Teaching code to beginners with worked examples and checks

Do not use when:
- The subject is a whole codebase or architecture (`nthview-zoom-map`)
- The content is an exchange between parties, such as a protocol or API
  call chain (`nthview-dataflow`)
- The learner needs to run or edit the code; this view never runs code
- There is no code to quote; explain the idea with another view

## Procedure

### 1. Understand the content
Find the code worth reading and the story it tells: what goes in, what
comes out, and the few lines where understanding is won or lost (the bug,
the trick, the check). Pick 1–4 snippets, each the smallest excerpt that
still makes sense. Quote code verbatim from its source; shorten only with a
clear elision comment such as `/* ... */`, and record where it comes from
in `path`, `startLine` and `caption`. Never invent or tidy real code. Note
the values a learner should track and the misconceptions a reader is likely
to have.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
Open `references/complete-example.md` only when a table leaves the shape of
something unclear; it is long. Never open `assets/view.js` or
`scripts/validate.js`: the tools run and copy them, and everything the JSON
needs is in this file and `references/schema.md`.
- **Snippets.** Keep `code` exactly as in the source, tabs included. Set
  `startLine` to the original line number so learners can check the file;
  then every line number in the data is the original one. With a
  `startLine`, elide only at the end of an excerpt, since an elision inside
  it shifts the numbers that follow. Two versions of the same code (before
  and after a fix) are two snippets with `title`s.
- **Steps.** One idea per step, focusing 1–8 lines in reading order. The
  `title` names what happens ("The over-read"), the `note` explains why in
  2–3 short paragraphs. Outline the exact expression that matters with
  `focus`. Link related steps with `[[step-id]]`.
- **Subgoals.** Group steps under 3–6 short action labels that say what a
  chunk achieves ("Read what the peer claims", "Build the reply"), not
  what a line does: a subgoal is not a comment.
- **Trace.** Use `watch` to show the values a learner should be tracking at
  that point; follow one concrete input through the whole tour.
- **Checks.** Attach one to three checks to most steps and mix the kinds.
  Use `ask: "before"` on a step when the learner should predict before the
  note explains (it can be skipped). Put a whole-program prediction in
  `opening` (not scored) and an "explain it in one sentence" question in
  `summary.checks`.
- **Sources.** For real-world code (a CVE, a library), cite the source
  file, the commit and the advisory in `sources`.

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
Produce one standalone file using the template in AGENTS.md §6:
- the JSON in `<script type="application/json" id="nthview-data">`, with
  every `<` in the serialised JSON replaced by `\u003c`,
- the full contents of `scripts/validate.js`, then `assets/view.js`, inlined,
- the bootstrap script that calls `NthView.build(document.getElementById("app"), data)`.
Name the file `<concept-slug>-code-walkthrough.html`. The repository tool
does this exactly:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-code-walkthrough.html

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
Hand the user the single file. It needs no internet access. Build no other
view unless asked.

## Content guidance
- **Size.** 8–16 steps over 30–150 lines of code is the sweet spot; more
  than about 20 steps is two walkthroughs.
- **Order.** Follow execution order, not file order, when they differ;
  for a fix, read the broken version first, then the fix.
- **Notes.** Explain why, not only what: what the line assumes, what could
  go wrong, what a reader typically gets wrong. Keep paragraphs short;
  phones show them under the code.
- **Questions.** Aim for 8–14 checks using at least three kinds.
  `spot` and `predict` suit tracing ("what is `n` now?", "which line
  reads it?"); `spot` with `select: "all"` suits "tap every line that uses
  x" or "which lines run?"; `choice` suits why-questions; `fill` and `order`
  suit writing and remembering the key lines.
- **Fill.** Blank the meaningful part (an operand, a bound, a condition),
  not syntax, and never only a keyword. Offer 2–4 `options` per blank for
  phones; typed blanks only for short answers. If a variable is blanked
  where it is assigned, blank it where it is used too, or not at all.
- **Order.** 4–7 lines whose order is forced by the logic; write each
  statement on one line. Use at most one or two distractors, each a
  plausible near-miss paired with the line it imitates and with a `why`.
- **Wrong answers teach.** Give every wrong `choice` option a `why`, and
  every tempting wrong line in a `spot` a `miss` text.
- **Real code.** Quote it faithfully, keep its line numbers, and cite it;
  anonymise identifiers only when the user's code names people or employers.

## Common mistakes
- Line numbers counted from 1 while `startLine` is set → use the numbers
  shown, which start at `startLine`.
- A `focus.text` that differs from the code by a space or a tab → copy it
  from the code exactly.
- Tidying, reformatting or "fixing" quoted code → keep it verbatim; elide
  with a comment instead.
- A step that covers a whole function → split it; the note should be about
  the focused lines.
- Notes that repeat the code in words ("this line sets p to …") → say why
  the line matters.
- Subgoal labels that read like comments → name the goal of the group.
- An `order` problem with two valid orders → choose lines whose order is
  forced, or drop one.
- An unpaired or obviously silly distractor → pair it and make it a real
  near-miss.

## Files
- `references/schema.md` — the JSON format (single source of truth)
- `references/complete-example.md` — a complete valid example (Heartbleed, CVE-2014-0160); open only when needed
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; run it, never read it
- `assets/view.js` — `NthView.build(container, data)`; the build tool copies it, never read it
- `examples/example.html` — a working standalone sample built from the complete example
