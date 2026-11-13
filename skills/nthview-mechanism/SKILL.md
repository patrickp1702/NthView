---
name: nthview-mechanism
description: Builds a mechanism simulation: a scroll-driven story with a live 3D stage of internal quantities (counters, buckets, scores, timers) that rules update tick by tick, where step cards and pinned chapters move one shared clock, pulses show what is calculated from what, and the learner can play, scrub, switch scenarios and tune parameters. Use when the user wants to see "how it works over time", "watch it run", "simulate", "what happens minute by minute", a rate limiter, lockout, decay, backoff, queue, budget or any rule-driven quantity changing over time; not for facts to memorise, one-off formulas without time, or exchanges between parties (use nthview-sequence).
---

# NthView — Mechanism

## Overview
The learner scrolls through a story about a mechanism and watches it run. A
3D stage behind the page shows every counter as a glowing pillar and every rule
as an arc between the counters it reads and sets; on each tick pulses run along
the arcs that changed something, and events burst as rings. Chapters drive one
shared clock: step cards beside a sticky panel of live figures move the clock to
the moment they describe, pinned chapters run the clock as the reader scrolls,
and a bench chapter hands over every knob. A dock at the bottom always offers
play, scrub, speed, scenario, window and event jumps.

Figures: lines, step lines, areas, stacked bars, bars, gauges, number tiles,
an event timeline, state chips that flash, a calculation-flow graph with
travelling pulses, a "what is calculated now" table, small multiples and a heat
map across scenarios. Watching the counters fill and drain, and seeing the
arithmetic flow from one value to the next, is what turns a policy described in
words into an intuition.

Optional prediction checks veil a chapter's figures until the learner
guesses (or skips); nothing is scored. Six themes, each with a light and a
dark design. The stage uses three.js from cdnjs, so the file needs internet
access the first time it opens. Progress (scenario, clock position, speed and
window, parameter changes per scenario, answered checks, the chapter being read
and the colour scheme) is saved in the browser and resumed; Restart in the top
bar clears it.

## When to use
- Quantities that change under rules over time: rate limiters and token
  buckets, lockouts and backoff, risk or reputation scores that accrue and
  decay, caches and TTLs, queues and retries, budgets, certificate or key
  lifetimes, patch and exposure windows, epidemics, inventories
- The learner needs to know what is calculated at each step and from what,
  not only the end result
- Two to four scenarios contrast the mechanism's behaviour (benign,
  attacker, mitigated; before and after a policy change)
- The user asks for a simulation, a "watch it run" explainer, or a
  minute-by-minute (hour-by-hour, request-by-request) walkthrough

Do not use when:
- There is no time dimension: one formula with sliders is
  `nthview-explorable`
- The content is an exchange of messages between parties
  (`nthview-sequence`) or a data flow through components (`nthview-dataflow`)
- The goal is recall of facts or judgement calls (`nthview-scenario-quiz`,
  `nthview-island-quest`)

## Procedure

### 1. Understand the content
Find the **state**: the 5–20 quantities the mechanism keeps (tokens in a
bucket, a failure counter, time left on a lockout, a score). Find the
**rules**: how each one changes in one tick, written as plain assignments
(`tokens = min(capacity, tokens + refill)`). Find the **events**: things that
happen at a moment or when a condition holds (an account locks when the
counter reaches the threshold; the owner signs in every two hours). Then
find the **knobs** a defender or designer would turn, and two to four
**scenarios** whose contrast is the lesson. Pick a tick unit and a horizon
in which the interesting behaviour happens (minutes over a day; days over a
quarter; requests over a burst). Check numbers against sources and say in
the lead when values are illustrative.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- **Parameters first**, then **variables** with an `initial` value each
  (which may use parameters), then **rules** in the order they happen in one
  tick. A rule that reads a variable whose own rule comes later sees the
  previous tick's value; use that on purpose (a lockout timer that counts
  down after it has been used) and put dependent rules after their inputs.
- **Events** for discrete moments: a `when` condition with a `set` is the
  clean way to express a threshold that triggers a reaction (lock, alert,
  rotate). Rules can read an event's id: it is 1 on the tick it fired.
- **Scenarios** set parameters and add their own events; the first scenario
  is what the learner sees first.
- **Stage**: list 6–12 `stage.variables`, the counters a reader should see
  at a glance, ordered so related ones sit next to each other on the ring.
- **Chapters** tell the story in order, one idea each, from the simplest
  piece to the full system. Pick a shape per chapter:
  - `steps` (3–5 cards) to walk through moments: each card names a tick,
    optionally a scenario and a window, and says what to see there with
    `{id}` placeholders that show the values at that moment;
  - `scrub` to let the reader scroll through a stretch of time (a burst, a
    morning, a rollout), with `marks` that caption the moments that matter;
  - `bench: true` for the last chapter, with the knobs worth playing with;
  - plain figures for a short interlude.
  Give each chapter a `focus` (the pillars it is about), the `controls` for
  the knobs it discusses, and a `check` where a prediction is worth making.
- **Figures**: `tile` for the outcome numbers, `events` for when things
  happened, `state` for the counters of the moment, `flow` to show which
  value is computed from which, `step` for counters and integer state, `line`
  for continuous values and probabilities, `area` for a quantity running down
  or a stacked share, `stacked` for "where did everything go" per bucket of
  time, `bar` for the current split, `gauge` for a value against a threshold,
  `calc` to show the arithmetic, `compare` and `heatmap` to put scenarios side
  by side. Two or three per chapter; the first one is what a phone shows first.
- Mark technical words with `((term))` and define each in `glossary`.
- Choose a `theme` from `references/schema.md`; vary it between documents.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. The validator parses
every expression, rejects unknown identifiers by name (and says when a
variable is used before it is declared), runs every scenario to the horizon
and evaluates each check's `expect`, so a wrong "correct" option is caught
here. Address warnings: a variable that never changes, a parameter nothing
uses, an event that never fires, a value that stops being a number.

If `node` is not installed, try `bun` or `deno run -A` with the same
script; both run it unchanged. If no JavaScript runtime exists, do the
validator's job yourself: check the JSON against every table, cross-field
rule and warning in `references/schema.md`, which is exactly what
`scripts/validate.js` implements, and fix what you find. Say that the check
was done by hand; the file also validates itself when opened and shows an
error panel if anything was missed.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-mechanism.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `<`,
then `scripts/validate.js` and `assets/view.js` inlined verbatim, then the
three-line bootstrap that calls `NthView.build(document.getElementById("app"), data)`.
Add the one `<script src>` tag for three.js from `NthView.libs` before the
inlined scripts.

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

The hand build is the fallback when no JavaScript runtime is available; the
tool does nothing beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file. It needs internet access the first time it
opens, to load three.js for the stage. Build no other view unless asked.

## Content guidance
- **A mechanism worth simulating** has state that accumulates or drains,
  a threshold or a cap that changes behaviour, and at least one surprise
  that only shows over time (a slow attacker that never trips a counter; a
  backoff that spends most of the day locked; a decay that forgets faster
  than a signal arrives). If the end result follows from one formula, use
  `nthview-explorable` instead.
- **Scenarios that teach**: a benign baseline, the case that defeats the
  naive mechanism, and the mitigated case. Two to four; give each a
  one-line `description`.
- **Size**: 5–8 sections, 8–20 variables, 10–30 rules, a horizon of a few
  hundred to a few thousand ticks. Two or three short paragraphs per
  section; let the figures carry the detail.
- **Readable rules**: one idea per rule, named with a `label` a reader can
  scan in the calculation table ("Refill the bucket", "Leak old failures");
  a `note` for the why. Prefer several small rules over one long
  expression; compute intermediate quantities as their own variables so
  they can be charted and quoted. Keep identifiers in camelCase and close to
  the words in the prose (`lockLeft`, not `ll`).
- **Honest numbers**: say whether values are expected values or single
  runs, give units on every variable, and keep ranges physically
  meaningful. Use `noise(t)` only when irregularity is the point; the run
  is still identical on every open.
- **Story shape**: a hero that names the scenarios, a first chapter of steps
  that tours the scenarios' outcomes, one chapter per mechanism piece, a
  pinned chapter where time itself is the lesson, and a bench at the end.
- **Checks**: one prediction in two or three sections, about something the
  learner can picture ("will the lockout ever trigger?"). Always add
  `expect` so the validator proves the correct option against the run.
- **Figures**: give the window presets a reason (1 h to see the burst, 6 h
  for a pattern, All for the day). A `goto` with a `window` makes the
  moment unmissable.

## Common mistakes
- A rule reads a variable that is updated later in the same tick and gets
  last tick's value by accident → move the rule after its input, or make it
  deliberate and say so in its `note`.
- A threshold implemented as a rule that fires every tick → use an event
  with `when` and `set`, which also puts a marker on every chart.
- Placeholder text that repeats the unit ("{bucketSize} tokens" where the
  parameter's unit is already "tokens") → write just `{bucketSize}`.
- A variable that only exists to be shown but has no rule → the validator
  warns; give it a rule or remove it.
- `expect` false → it runs the scenario with its own parameters, not the
  learner's changes; check the tick and the scenario.
- Identifiers with hyphens or underscores → camelCase; hyphens read as minus.
- Every section uses the same figure kind → mix kinds so each picture adds
  something.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), the tick pipeline, expressions, formats, themes and the complete login-defence example
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; runs every scenario
- `assets/view.js` — `NthView.build(container, data)`; the engine, the stage, the clock, thirteen figure kinds and the six themes in `PALETTES`; three.js declared in `NthView.libs`
- `examples/example.html` — "How Login Defences Shape a Password Attack", built from the schema example
