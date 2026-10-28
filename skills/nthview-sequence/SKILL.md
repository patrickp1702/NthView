---
name: nthview-sequence
description: Explains a protocol, handshake or any exchange between parties as an interactive sequence diagram: the learner steps through one message at a time, sees exactly what travels on each arrow, which channel carries it and what every party holds afterwards, and can open the whole exchange as a UML-style diagram with trust zones, alt/opt/loop frames and notes. Use when the user wants to understand a flow, protocol, handshake, login, API call chain, workflow or "who sends what to whom", or asks for a sequence diagram or a step-by-step walkthrough; not for ideas without parties exchanging messages or for drilling facts.
---

# NthView — Sequence

## Overview
The learner sees the participants as lanes across the top and one transition
at a time: an arrow flies from sender to receiver carrying a short payload,
and a card below shows the exact message on the wire, why it is sent, an
optional comparison with an older or alternative design, details, a warning
when the step matters for security, and a strip of what each party holds now,
with newly acquired items marked. Light checks ("who sends the next
message?") make the learner predict before a step is revealed; a wrong guess
explains and reveals, never blocks. A "Full diagram" button shows the whole
exchange as one UML-style sequence diagram (lifelines, activation bars,
numbered arrows, trust zones, alt/opt/loop frames, notes); selecting any
arrow opens that step. A recap lists every step, the final holdings and the
check results.

The output is one self-contained HTML file with no libraries and no fonts to
fetch: it works offline. Four themes (`paper`, `slate`, `blueprint`, `mint`),
light and dark. Progress (step, mode, zoom, toggles, answered checks) is saved
in the browser (localStorage) at every change, so reopening the file resumes
where the learner left off; the Restart button in the header clears it.

## When to use
- Protocols and handshakes: TLS, OAuth and OpenID Connect, Kerberos, SSH,
  TCP, DNS resolution, HTTP caching, payment authorisation
- Distributed systems and APIs: a request through services and queues,
  consensus rounds (Raft, Paxos, two-phase commit), webhooks, retries
- Business and human workflows where "who hands what to whom" is the point:
  an approval chain, a hospital referral, a mortgage application
- The user asks for a sequence diagram, a step-by-step walkthrough of a flow,
  or "what is sent at each step"

Do not use when:
- There are no distinct parties exchanging things; a system of causes fits
  `nthview-concept-map`, a big system top down fits `nthview-zoom-map`
- The content is judgement calls ("what would you do"): use
  `nthview-scenario-quiz`
- The learner should play with numbers or a model: use `nthview-explorable`

## Procedure

### 1. Understand the content
List the parties (2–8; 3–5 read best) and order them left to right so most
arrows are short and parties that trust each other sit together. Decide the
trust zones (whose machine, whose organisation). List every transition in
time order: sender, receiver, what exactly travels, over which kind of
channel, and why it exists. Note what each party knows or holds at the start
and what it gains or gives up at each step. Find the failure paths and
optional or repeated parts: they become `alt`, `opt` and `loop` fragments.
Find the two or three moments where learners usually go wrong: they get a
`note`, a `compare`, or a check.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- Declare `channels` by what they mean for the learner (visible to an
  attacker, encrypted, direct, local computation, out of band) and give each
  a colour; the arrow colour then tells the story at a glance.
- One step per transition. Local work (generating a key, checking a value)
  is a self step with `from` equal to `to`. Mark replies `kind: "return"` and
  fire-and-forget messages `kind: "async"`.
- `payload` is the arrow label (24 characters or fewer). `wire` is the real
  content: request lines, headers, fields, or the computation. Use
  placeholders (`…`, `example.com`, `app.example`) instead of real-looking
  tokens, keys or hostnames.
- Track `holds` as changes only: start items on the participants, then
  `add` and `remove` per step. The view computes the cumulative strip.
- Put the main path first in an `alt`; later branches are side paths and do
  not carry their holds forward.
- Give 2–4 steps a `check`: `who` for "who sends next?" at moments that
  test understanding of the flow, `choice` for "why" questions.
- Pick a `theme` (table in `references/schema.md`); if omitted, one is
  derived from the title.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable: a step without `wire` or a long payload usually means the step is
vaguer than it should be.

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

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-sequence.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `\u003c`,
then `scripts/validate.js` and `assets/view.js` inlined verbatim, then the
three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`. This view declares no
`NthView.libs`, so there are no library tags.

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

The hand build is the fallback when no JavaScript runtime is available; the
tool does nothing beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file. It needs no internet access. Mention that the
"Full diagram" button shows the whole exchange. Build no other view unless
asked.

## Content guidance
- **Length.** 8–20 steps is the sweet spot; up to 60 are allowed. Split a
  very long protocol into a lesson of several sequences (for example the
  handshake, then resumption).
- **Exactness over decoration.** The `wire` block is where the learning
  happens: show the real field names and values, aligned, with `→` lines for
  what the receiver does with them. Keep it under about 15 lines.
- **Why, not what.** `why` explains the purpose and the threat it answers in
  two to four sentences; the wire already shows the what.
- **Holds tell the security story.** Name items so a learner can follow
  them (`code_verifier`, `handshake traffic keys`) and remove items when a
  party discards them; forward secrecy and single-use codes become visible.
- **Fragments.** Use `alt` for a failure path next to the happy path, `opt`
  for something that happens only sometimes (a retry, an optional
  extension), `loop` for renewal or polling. Keep fragments to a few steps.
- **Notes sparingly.** `danger` for the one or two moments where skipping a
  check breaks security, `warning` for exposure, `info` for a subtle fact.
- **Compare** is for the version or design the learner may already know
  (OAuth 2.0, TLS 1.2, a naive implementation); write the same lead label on
  every step and set `compareLabel` to match.
- **Detail rows** are free: "Who's involved", "What's in play", "Which
  spec", "Worth knowing" work for protocols; "Who signs off", "Deadline"
  for workflows.
- **Hedge** anything you are not sure of ("varies by browser", "usually").
  Name specs by number and section only when you know them.

## Common mistakes
- A step that is really two messages (a request and its reply) → split it,
  or keep it as one step and show both in the `wire` with `←` lines.
- Re-typing the full holdings at each step → use `add` and `remove` only.
- Removing an item a party never had → the validator rejects it; check the
  order of steps and the alt branches.
- A `who` check whose answer is not the sender → the answer is always the
  step's `from`.
- Real secrets or production hostnames in `wire` → use placeholders and
  `example.com`-style names.
- An `alt` where the main path is not first → put the happy path in
  `branches[0]`.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth) and the complete OAuth 2.1 example
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; step mode, full diagram, the four themes in `PALETTES`, `NthView.THEMES`
- `examples/example.html` — the OAuth 2.1 with PKCE sequence, a working standalone sample built from the schema example
