---
name: nthview-timeline
description: Turns a dated story (an incident, a history, a project, a scientific discovery, the evolution of a law or a technology) into an interactive vertical timeline that shows events, eras, lanes such as attacker and defender, and cause-and-effect links, with questions mixed in between the events (put in order, place an event, what caused this or what it led to, multiple choice, sort into groups, and open "why?" reflections), each answer explained. Use when the user asks for a timeline, a chronology, "what happened when", "how did we get here", the sequence of an incident or a history, or wants to understand why events unfolded as they did; not for exchanges between parties (use nthview-sequence), systems with no time order (use nthview-concept-map), or quantities changing tick by tick (use nthview-mechanism).
---

# NthView — Timeline

## Overview
The first screen says what the timeline covers, how long it takes and offers
one "Start" button. The learner then scrolls down one vertical line: dated
event cards (the date sits in a left gutter on wide screens), numbered parts
for the eras, up to three labelled, coloured lanes, and the elapsed time
between neighbours ("4 months later"). Every event says why it happened and
what it led to, so the learner can follow a chain back and forth. Questions
are numbered checkpoints on the same line: pick an answer, press Check, read
why each option is right or wrong, then Continue. In the default `step` mode
the rest of the story stays locked until the learner answers or skips, so
recall and prediction come before the reveal. The end card recaps the story:
takeaways, the turning points and every answer.

A slim sticky bar shows the current part and date, how many questions are
answered with a progress line, a Contents button (progress, a proportional map
of when each event really happened, a lane filter and a list of every event
to jump to) and the Restart button. Progress is saved in the browser after every
answer, move, toggle and scroll position, so reopening the file resumes at the
same place; Restart erases it. The output is one self-contained HTML file; it
loads two typefaces from Google Fonts and falls back to system fonts offline.

## When to use
- A story whose order and timing matter: a security incident, a war, a
  product's history, a discovery, an outbreak, the passage of a law
- "Why did this happen then?": causes building up over time, triggers versus
  long-standing conditions, turning points
- Two or three sides acting in parallel (attacker and defender, two
  countries, research and regulation)

Do not use when:
- Parties exchange messages step by step (use `nthview-sequence` or
  `nthview-dataflow`)
- The content is a structure with no time order (use `nthview-concept-map`)
- Quantities change under rules, tick by tick (use `nthview-mechanism`)
- It is a puzzle with misconceptions to rule out (use `nthview-detective`)

## Procedure

### 1. Understand the content
List the dated events that carry the story: 10–25 is the sweet spot. For each,
note the most precise date you can verify and nothing more precise (a year is
fine; never invent a day). Then mark the causal links: which earlier events
made each one possible (conditions) or set it off (triggers), and the one or
two turning points where the direction or pace changed. Decide whether the
story has two or three sides worth a lane each, and two to five stretches
worth naming as eras. Collect the public sources you relied on.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
Open `references/complete-example.md` only when a table leaves the shape of
something unclear; it is long. Never open `assets/view.js` or
`scripts/validate.js`: the tools run and copy them, and everything the JSON
needs is in this file and `references/schema.md`.
- List `events` in time order. Write `date` at the precision you know
  (`2017`, `2017-05`, `2017-05-12`, `2017-05-12T15:03`), set `timeZone` when
  times appear, and use `label` for fuzzy dates ("c. 1450", "Spring 2017").
- `text` is two or three sentences; longer explanation goes in `detail`.
- Put `causes` on the effect, pointing back; give each a `how` and, where it
  is clear, a `kind` (`trigger` or `condition`). The view draws the reverse
  "Led to" links itself.
- Place a question every two to four events. Mix the kinds:
  `order` and `place` for chronology, `cause` (with `ask: "effect"` for
  prediction) for causation, `sort` for trigger versus condition or changed
  versus stayed the same, `choice` for a fact or an interval ("How long
  between the patch and the outbreak?"), `reflect` for "why then?".
- A question placed before the events it asks about is a prediction; in
  `step` mode the answer is revealed by the events that follow.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable: a long stretch with no question, an option without `why`, or an
event outside every lane usually means the teaching is thinner than it
should be.

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

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-timeline.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `\u003c`,
then `scripts/validate.js` and `assets/view.js` inlined verbatim, then the
three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`, with the one Google
Fonts tag from `NthView.libs` before the scripts.

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
Hand the user the single file. It needs internet access once to load the
fonts and degrades to system fonts without it. Build no other view unless
asked.

## Content guidance
- **Accuracy first.** Every date and number must come from a source you can
  cite; list it in `references` and point to it with `refs`. Where sources
  disagree, say so in `detail` rather than picking silently.
- **Precision honestly.** A month you are sure of beats a day you guessed.
  Times only when the source gives them, with `timeZone`.
- **Causes are the lesson.** Most events after the first few should have at
  least one cause. Distinguish the long-standing condition (unpatched
  machines) from the trigger (the worm's release); the `sort` kind drills it.
- **One or two turning points**, not five: the moment the pace or direction
  changed.
- **Lanes** only when the sides act in parallel; otherwise leave `tracks`
  out. Give every event a lane once lanes exist.
- **Questions teach.** Distractors in `cause` should be real earlier events
  that are tempting but not the cause, each with a `why`. `order` works best
  on 4–5 events spread across the story; `place` on an event whose timing
  surprises. `explain` always says why, not only what.
- **Mode.** Keep `step` (the default) for a first reading; use `open` for a
  reference timeline or a review where the learner jumps around.
- **Length.** 10–25 events, 6–12 questions, 2–5 eras.

## Common mistakes
- Events out of time order → the validator rejects them; sort by `date`.
- A cause pointing to a later event → causes point back in time; put the
  link on the effect.
- A `cause` question whose options include two linked causes → exactly one
  option may be linked; make the others real but unlinked events.
- A `place` question attached to an event before the placed one, or using
  the placed event as a neighbour → attach it at or after the event and pick
  neighbours already on the timeline.
- Invented precision ("12 May 2017, 08:00" when the source says "morning")
  → use the day, or `label` "Morning, 12 May 2017".
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth)
- `references/complete-example.md` — a complete valid example; open only when needed
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; run it, never read it
- `assets/view.js` — `NthView.build(container, data)`; fonts declared in `NthView.libs`; the build tool copies it, never read it
- `examples/example.html` — the WannaCry outbreak timeline, a working standalone sample built from the complete example
