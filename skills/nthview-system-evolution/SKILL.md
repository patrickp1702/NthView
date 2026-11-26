---
name: nthview-system-evolution
description: Builds a step-by-step system evolution: an isometric diagram of components and links that changes shape at every step under pressure, with packets flowing along the links, load bars and failures on the parts, a live metric strip that turns green, amber or red, a step panel of problem, technique, trade-off and recap steps with "what changed", and a "you'll learn" checklist that ticks as the learner moves on. Use when the user wants to see how a system grows or is defended step by step and what each change does to the numbers, or says "how it scales", "architecture evolution", "add a cache, then a load balancer", "defence in depth", "what each fix costs", "like Designed to Scale"; not for message payloads between parties (use nthview-dataflow), rule-driven quantities ticking over time (use nthview-mechanism) or drilling facts.
---

# NthView — System Evolution

## Overview
The learner steps through one system as it changes. On the left, a warm
isometric diagram: blocks, data stores, crowds and devices on a grid, joined
by links that carry animated packets (requests, attacks, checks, failures),
with load bars, queue badges, failed parts greyed out with a cross, and a
metric strip above that reacts to every step with coloured edges. On the
right, "STEP n / N" with a type badge (problem, technique, solution,
trade-off, case, recap), a short heading, two short paragraphs, callouts
(key idea, good to know, watch out), and a "What changed" list. Back and a
Next button that names the next step, step dots, ←/→ keys, R to replay, Space
to pause, F for full screen, and a URL hash per step. The objectives tick as
their step is reached; the recap can carry a breakdown table that adds up.
Seeing the same diagram take one change at a time, and the numbers answer
it, is what turns "add a rate limiter" into an intuition about why, and at
what cost.

No library is loaded: the file works offline. It respects reduced motion
(packets stand still, nothing slides) and can read a step aloud with the
browser's voice. Progress (step, pause, colour scheme) is saved in the
browser and resumed; Restart in the top bar clears it.

## When to use
- A system that grows or is hardened in steps, each step a response to a
  pressure: scaling a web service, defending a login, a network rollout, an
  emergency department under a surge, a supply chain adding warehouses, a
  city junction adding signals
- Each change has measurable effects worth watching: latency, errors,
  throughput, cost, wait times, takeovers, people turned away
- Trade-offs matter: a fix that improves one number and worsens another
- The user asks for an architecture walkthrough, "how X scales", "defence
  in depth", or a lesson like an interactive system-design course

Do not use when:
- The point is what travels between parties and what each message holds
  (`nthview-dataflow`, as topics or as one exchange)
- The point is a rule that updates counters tick by tick, such as a token
  bucket, lockout or decay (`nthview-mechanism`)
- The system is a fixed structure to explore top down (`nthview-zoom-map`)
  or a web of causes (`nthview-concept-map`)
- The learner should be tested; this view teaches (`nthview-scenario-quiz`)

## Procedure

### 1. Understand the content
Find the **cast**: the 4–12 parts of the system (users, attackers, services,
stores, defences, staff, vehicles). Find the **pressures and responses**: the
story is a chain of "this hurts → we add or change that → here is what it
did and what it cost". Find 3–5 **metrics** the learner should watch, each
with a good direction. Write down the value of every metric at every step
before writing JSON; that table is the heart of the view.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
Open `references/complete-example.md` only when a table leaves the shape of
something unclear; it is long. Never open `assets/view.js` or
`scripts/validate.js`: the tools run and copy them, and everything the JSON
needs is in this file and `references/schema.md`.
- List every component and link once at the root; each step then names
  exactly what it shows, with a state object (`{}` for healthy). Components
  a step leaves out disappear; new ones fade in with a spotlight.
- Pick each component's `kind` from the schema's list; it fixes the shape,
  icon and colour. Use `tone` or `icon` only to tell two similar parts apart.
- Leave `at` out. The layout runs left to right from the links, and columns
  a step does not use close up, so parts slide aside when a new one is
  inserted between them. Add `at` only if two parts land badly.
- Give links the direction work flows. A response is a flow with
  `"reverse": true`, not a second link.
- Use flows to show what happens, not decoration: `blocked` where a defence
  stops traffic, `fail` where it breaks, `held` where it queues, and a
  separate low-rate flow for the rare bad outcome that still gets through.
- Every step needs a value for every metric. Set `better` and thresholds so
  the edge colour tells the story; use `{ "value": …, "level": … }` only to
  override.
- Write `changes` as before → after ("Takeovers 1,200 → 180 an hour").
- Tick each objective at the step that teaches it; every objective needs
  one.
- Put a `breakdown` on the recap when a total splits into parts; the rows
  must add up to the total.
- Illustrative numbers are fine when they are labelled: say so in `note`.

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

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-system-evolution.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `\u003c`,
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
- 6–12 steps. Open with the system as it is (`context`), then alternate
  pressure (`problem`) and response (`technique`, `solution`), mark the
  steps where a fix costs something as `tradeoff`, use `case` for a
  variation or a real-world twist, and end on a `recap`.
- One change per step. If a step adds two components, it probably wants
  to be two steps.
- 4–12 components on screen at once; the diagram stays readable to about
  10. Short labels (under 14 characters) fit on a block.
- 3–5 metrics. Each should move at least twice; a metric that never moves
  belongs in the text.
- Show the costs, not only the wins: a defence that slows real users, a
  cache that serves stale data, a fix the pressure adapts to.
- Keep each step's text to about 60–120 words in two paragraphs, plus one
  callout. The diagram carries the rest.
- `short` is 1–3 words; it names the step on the dots and on Next.
- Ground facts in sources and list them in `sources`; label made-up numbers
  as illustrative.

## Common mistakes
- A step that lists a link but not one of its ends → list both components.
- A flow path whose links do not touch → consecutive links must share a
  component; check the direction of each link.
- A metric missing from one step → every step needs every metric, even
  when it did not change.
- Breakdown rows that do not add up → fix the rows or the total; the
  validator checks it.
- Every step a win → add the cost: users turned away, added latency,
  money, staff time.
- Long paragraphs → move detail into a callout or cut it; the panel sits
  beside the diagram and should read in under a minute.
- Hand-placing every component with `at` → leave it out; the automatic
  layout and the closing-up columns are usually better.

## Files
- `references/schema.md` — the JSON format (single source of truth)
- `references/complete-example.md` — a complete valid example; open only when needed
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser; run it, never read it
- `assets/view.js` — `NthView.build(container, data)`; the build tool copies it, never read it
- `examples/example.html` — a working standalone sample
