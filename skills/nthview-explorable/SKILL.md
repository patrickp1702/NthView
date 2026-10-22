---
name: nthview-explorable
description: Builds an explorable explanation: a short guided story in 4–12 steps where the learner predicts what a change will do, then tinkers with a live model (sliders, switches, draggable numbers) driving charts, gauges, flows, replays, side-by-side scenarios and agent or cellular simulations. Use when the user asks for an "explorable explanation", an "interactive simulation", "let me play with it" or "what happens if I change X"; not for facts to memorise or text without a model behind it.
---

# NthView — Explorable Lab

## Overview
The learner reads a few sentences, is asked to **predict** what a change will
do ("What happens if you double R₀?"), then watches a live model animate to
the answer, sees whether the prediction held and what to notice, and is
handed the controls to keep tinkering. Every number on the page comes from a
small model of named variables and formulas, so moving any slider or
dragging a number in the text updates every chart, gauge, simulation and
sentence at once. Prediction before observation, concrete examples and
free play are what make the idea stick; nothing is scored.

The interface is cinematic: an animated gradient backdrop, glass cards,
smooth step transitions, a progress rail, live inline numbers, a glossary
drawer and six themes with light and dark variants. Eleven visualisation
kinds are drawn with inline SVG and canvas: bar chart, curves over a range,
scatter of generated points, agent simulation, cellular grid, gauge, number
readouts, stacked proportions, animated flow, timeline replay and a two
scenario comparison. The output is one HTML file; it loads its typefaces
from Google Fonts (internet needed once) and falls back to system fonts.

## When to use
- Systems with quantities and cause and effect: growth and decay, rates,
  thresholds, feedback, probability, epidemics, finance, physics, ecology,
  queues, algorithms with a tunable parameter
- A concept with a famous counter-intuitive result that a prediction can
  expose (exponential growth, herd immunity, compound interest, regression
  to the mean, the birthday problem)
- The user wants to "play with it", "see what happens if", or asks for an
  explorable, a simulation or an interactive explainer

Do not use when:
- The content is facts or vocabulary with no model behind it (a quiz or
  flashcard view fits better)
- The lesson is a judgement call in a human situation (use
  `nthview-scenario-quiz`)
- The user wants a playful game world for beginners or children (use
  `nthview-island-quest`)

## Procedure

### 1. Understand the content
Find the **model** under the topic: the 2–8 quantities a learner could
change, and the formulas that connect them. Write them down as plain
equations first (`effective R = R₀ × (1 − coverage)`). Then list the
surprises: the moments where intuition predicts one thing and the model does
another (doubling R₀ multiplies cases 64-fold; at 93% coverage measles
stops). Each surprise becomes a step. Order the steps so each adds one new
variable or one new picture, from the simplest case to the full system.
Check numbers against sources and say in the intro when values are
illustrative.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- **Model first.** Declare every variable once with an honest range, a
  `step` that makes the slider usable and a `format`; derive everything
  else as `formulas` in dependency order. Steps share the model; use a
  step's `start` to set the situation that step's question assumes.
- **One surprise per step.** Write the `predict` question about that
  surprise, three options (one correct, the others the beliefs people
  really hold), a `why` for each, a `set` that performs the experiment,
  and an `expect` that proves the correct option is what the model does.
- **Pick visuals from the shape of the idea** using
  `references/visuals.md`: growth and thresholds → `line` and `gauge`;
  individuals interacting → `agents`; neighbours and clusters → `grid`;
  parts of a whole → `stack`; a chain of stages → `flow`; step-by-step
  multiplication → `timeline`; "this versus that" → `compare`; a few
  magnitudes → `bars`; variation across many cases → `scatter`; the
  number that matters → `number`. Use one or two per step and vary them.
- **Controls** only for the variables this step is about (one to three).
  Put the key variable in the prose as a `[[variable]]` scrubber and show
  computed results with `{formula}` placeholders.
- `notice` names exactly what to look at, with live numbers. `takeaway` is
  the one sentence to keep. Add a `challenge` when there is a target worth
  hunting for ("find the lowest coverage that stops it").
- Mark technical words with `((term))` and define each in `glossary`.
- Choose a `theme` from the table in `references/schema.md` that matches the
  topic's mood; vary it between documents.

### 3. Validate
Write the JSON to a file and run:

    node skills/nthview-explorable/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. The validator parses
every expression, rejects unknown identifiers by name, and evaluates each
`expect` against the model, so a wrong "correct" option is caught here.
Address warnings: a step without a prediction or without anything to
tinker with, a challenge that is already solved, or a value that is not a
finite number.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly, including the Google Fonts tag declared
in `NthView.libs`:

    node scripts/build-html.js skills/nthview-explorable <path-to-json> examples/<concept-slug>-explorable.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `<`,
the one Google Fonts `<link>` from `NthView.libs`, then `scripts/validate.js`
and `assets/view.js` inlined verbatim, then the three-line bootstrap that
calls `NthView.build(document.getElementById("app"), data)`.

Generated labs go in the repo-root `examples/` folder (or wherever the user
asks); never inside `skills/`.

### 5. Deliver
Hand the user the single file. It needs internet access once to load the
fonts (Google Fonts) and works without it using system fonts. Build no
other view unless asked.

## Content guidance
- **Length.** 6–8 steps is the sweet spot (4–12 allowed). Two short
  paragraphs per step; the model does the explaining.
- **Predictions.** Ask about a change the learner can picture ("double it",
  "set it to 0.8", "cluster them"), never about a formula. Three options:
  the correct one, the linear or proportional intuition, and one more
  plausible belief. Every `why` grants what is reasonable before correcting.
- **Always add `expect`** when the correct option is checkable from
  formulas: it turns a content error into a validation error.
- **Simulations.** Keep agents at 100–300 and calibrate `chance` so the
  simulation agrees with the formulas in the steps around it; say in a
  caption that runs vary. Use `still` for distancing-style effects and
  `split` for reproduction. Grids work best at 20–40 cells a side.
- **Honest numbers.** Use typical published values and say so in a caption;
  label approximations. Keep ranges physically meaningful.
- **Readable text.** Scrubbers and placeholders for the one or two numbers
  that matter in each paragraph, not every number.
- **Lock.** Leave `lock` on (the default) so the learner predicts before
  playing; turn it off only when free play first is the point.
- **Wrap-up.** Restate the whole model in two paragraphs, list the
  takeaways, and give two or three `next` experiments that reuse earlier
  steps.

## Common mistakes
- A formula that uses a formula listed after it → reorder `formulas`.
- Identifier with a hyphen or underscore (`r-zero`, `r_zero`) → camelCase
  (`rZero`); hyphens read as minus.
- A placeholder for a percentage showing `0.3` → give the formula
  `"format": "pct"` or write `{coverage|pct}`.
- `expect` fails → the `set` is evaluated from the step's `start` values,
  not from the previous step; set `start` explicitly.
- Relying on `==` for computed decimals → prefer ranges
  (`threshold > 0.9 && threshold < 0.95`).
- Scatter `y` that needs the computed `x` → repeat the `x` expression inside
  `y` or `highlight`; locals are only `i`, `u`, `v`, `n`.
- A grid `cell` returning a state id → it returns the state's index
  (0 for the first state).
- Every step uses the same visual → mix kinds; the validator warns.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), themes, colours, expression language and the complete herd-immunity example
- `references/visuals.md` — which visualisation and control fits which idea, with a snippet for each
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; the six themes live in its `PALETTES` table; fonts declared in `NthView.libs`
- `examples/example.html` — "How Herd Immunity Works", a working standalone sample built from the schema example
