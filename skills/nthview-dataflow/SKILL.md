---
name: nthview-dataflow
description: Explains any flow of data or work between parties as an interactive explainer in the style of a protocol site: a hero definition, a sidebar of topics and numbered steps, a network diagram of entities in zones and a sequence diagram, a message-flow table the learner plays message by message with the exact payload and a note on every field, an article per topic, light prediction checks, and an optional version time machine that shows what each edition changed. Use when the user wants to understand or teach a protocol, API, handshake, payment flow, order pipeline, CI run, signalling pathway, supply chain or legal process, or says "explain how X works", "what goes over the wire", "who sends what to whom", "message flow", "data flow", "interactive protocol explainer" or "like mcp-explained"; not for a single linear story without parties exchanging anything, for drilling facts, or for judgement calls.
---

# NthView — Dataflow

## Overview
The learner opens on a hero page: a one-paragraph definition, a glossary-like
list of the main entities and a "Start the lessons" button. The lesson is
three columns. On the left, topics grouped under section headings, the open
topic expanded into its numbered steps. In the centre, "Step N of M", the step
title and a short explanation above a diagram that can be a **network** (the
entities as isometric line-art cards in labelled zones, joined by links
labelled with the protocol) or a **sequence** (the same entities as lifelines
with every message of the topic as an arrow), and under it the **message
flow** table with Play, Back, Step and Reset. Play sends the messages one by
one with a travelling dot and highlights the row, the entities and the link in
play. On the right, the topic's article with references and "What changes in
…" lists, and the **Message** panel with the current message's name, size,
direction, formatted payload and a note on every field.

A **Full picture** button in the top bar opens a dialog with the whole flow:
every entity and link as one network, or every message of every topic as one
long sequence where clicking a message opens it in the lesson.

Three optional layers deepen a document. **Holdings**: a strip under the
diagram shows what every entity holds after each message (keys, codes,
tokens), new items marked and given-up items struck through. **Channels**: a
colour per link or message says who can see it (through the browser, machine
to machine, local), with a legend on the diagram. **Fragments**: alt, opt and
loop frames in UML style, drawn on the sequence diagram only. Steps may also
carry a prediction check ("what does the server answer?") that replaces the
explanation until the learner answers or skips; a wrong answer explains and
reveals, never blocks. An optional list of **versions** adds a
time machine to the top bar: topics can arrive or disappear, steps can change
their text and messages, and messages can be tagged deprecated, so the learner
sees how the flow evolved.

Nothing in the view knows the subject: entities, zones, links, topics, steps,
messages and versions all come from the data, so the same view explains a
network protocol, a card payment, an order pipeline, a CI run, a biological
pathway or a legal process. The output is one self-contained HTML file with no
libraries and no fonts to fetch; it works offline. Four themes (`graphite`,
`paper`, `blueprint`, `amber`), each with a light and a dark variant and a
top-bar toggle. Progress (screen, topic, message position, version, diagram
mode, colour scheme, answered checks) is saved in the browser's localStorage
at every change and restored on reopening; the Restart button clears it.

## When to use
- Protocols and APIs: how a protocol's messages fit together, with the real
  payloads (MCP, OAuth, TLS, DNS, HTTP caching, WebRTC signalling)
- Money and commerce: a card payment, a bank transfer, an order from checkout
  to delivery, a refund
- Engineering pipelines: a CI/CD run, a deployment, a build, an incident
  escalation
- Anything with parties, messages and an evolving specification, where the
  learner should see what changed between versions
- The user asks for an interactive protocol explainer, "how X works" with
  diagrams, or a page like mcp-explained.com for their own subject

Do not use when:
- There are no distinct parties exchanging things; a system of causes fits
  `nthview-concept-map`, a layered system top down fits `nthview-zoom-map`
- The point is one exchange walked through with holdings, trust zones and
  UML fragments rather than many topics with articles: use `nthview-sequence`
- The content is judgement calls or recall: use `nthview-scenario-quiz` or
  `nthview-temple-run`

## Procedure

### 1. Understand the content
List the **entities** (2–40; a topic reads best with 2–6 on screen) and give
each a kind that fits its glyph: person, browser, app, client, server,
service, database, gateway, network, bank, model, device, document, queue,
cloud or generic. Group them into **zones** by who runs them or where they
live ("YOUR MACHINE", "CLOUD API", "ISSUER"), marking far-away zones
`remote`. List the **links** that carry traffic and the protocol on each.
Then split the subject into **topics**, 3–12 of them grouped under 1–6
**sections** (core, features, utilities, attacks, what's next), each topic a
thing a learner can finish in a few minutes. For every topic list its
**steps** in time order and, for each step, the **messages**: sender,
receiver, the method or event name, a one-line info, the kind (request,
response, error, notification, local, transport), the payload and what each
field means. Note where the subject has **versions** and what each changed:
topics that appear or vanish, steps whose messages differ, messages that are
deprecated. Find two to five moments where learners predict wrongly: those
become checks.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- Hero: `title` (the brand), `kicker`, `heading` (a question works well:
  "What is MCP?"), `lead` (one paragraph), 3–6 `facts` (term and one line),
  `jumps` to two or three topics.
- `versions` only when the subject really has editions; 2–8 in
  chronological order, short `label`s ("Mar '25", "v2"), a `date` and a
  one-line `note`, `default` on the one to open. `versionsLabel` names what
  a version is ("Spec", "Release", "Edition"). A document with one or no
  version shows no time machine.
- Messages: `name` is what appears on the wire (`tools/list`, `POST /token`,
  `0100`); `info` is for the table; `payload` is the full message, as a JSON
  object (pretty-printed and coloured) or as text (shown verbatim);
  `annotations` explain the fields that matter. Use placeholders
  (`example.com`, `…`, `tok_…`) for hosts, ids and secrets.
- Versions in content: `availableFrom` and `removedIn` on a topic;
  `steps[].versions.<id>` to replace a step's title, explanation or messages
  in one version; `messages[].versions` to show a message in some versions
  only; `tags: ["deprecated"]` for what is going away; `versionNotes` in the
  article for the "What changes in …" list.
- Holdings: `entities[].holds` for what a party has from the start (a
  password, a card), `topics[].holds` to set the starting state of a topic
  that continues an earlier one, and `messages[].holds` with `add` and
  `remove` per entity where something is gained or given up. Name items so
  the learner can follow them across steps (`code_verifier`, `access token`).
- Channels: declare `channels` by what they mean for the learner (through
  the browser, machine to machine, inside one organisation) with a colour,
  then set `channel` on each link; a message names its own only when it
  differs from its link.
- Fragments: `topics[].fragments` with `alt` (branches with conditions over
  consecutive steps), `opt` or `loop` (a condition). They frame steps on the
  sequence diagram and change nothing else.
- Checks: `steps[].check` with a `prompt`, 2–4 options, one `correct`, and a
  `why` on every option. Place them where the next message is a surprise.
  Skip them in a reference document that should read straight through.
- `further` for external "What's next" links; `footer` for the edition note.
- Pick a `theme` (table in `references/schema.md`); `graphite` is the default
  and dark, `paper` and `amber` are light by default. Set `defaultMode` to
  `sequence` when the order of messages is the point (a handshake, a login).

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable: a message between entities with no link draws a dashed line, an
entity nobody uses clutters the overview, a topic touching more than eight
entities gets crowded.

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

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-dataflow.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `<`,
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
Hand the user the single file. It needs no internet access. Mention the
Network and Sequence toggle, Play and the space bar, and, when the document
has versions, the time machine in the top bar. Build no other view unless
asked.

## Content guidance
- **Shape.** 3–12 topics, 2–6 steps each, 1–6 messages per step; 20–80
  messages in all reads well. Up to 60 topics and 30 steps per topic are
  allowed for a reference-style document.
- **Topics are lessons, not chapters.** Each topic has one idea and one
  article; "Request", "Result", "Error", "Notification" as steps of a
  "JSON-RPC" topic, not four topics.
- **Explanations are three sentences.** Say what happens, why, and the one
  thing that surprises people. The article carries the background.
- **Payloads are real.** Show the actual field names and plausible values;
  the learning happens in the payload and its annotations. Keep each under
  about 25 lines and annotate only the fields that teach something.
- **Kinds carry meaning.** `request` and `response` pair up; `error` draws
  attention; `notification` is fire-and-forget; `local` is work inside one
  entity (from equals to); `transport` is a carrier-level step (a redirect, a
  file, a batch).
- **Entities per topic.** The network diagram shows only the entities a
  topic's messages touch. Add `focus` when an entity matters but sends
  nothing in that step.
- **Links.** Declare the links traffic really uses and label them with the
  protocol; undeclared pairs still draw, dashed and unlabelled.
- **Versions tell a story.** A note per version in the article, a changed
  step where the wire changed, a tag where something is deprecated. Do not
  invent differences; if two versions are the same for a topic, say nothing.
- **Checks are predictions.** Ask what comes next or why, not trivia. Two to
  five per document, each with a `why` that teaches even when the answer is
  right.
- **Hero facts** are the five things a learner must hold on to: the parties,
  and one or two "not X" clarifications.
- **Hedge** anything you are not sure of ("varies by issuer", "typically").
  Name specs and sections only when you know them; put them in `references`.

## Common mistakes
- A message whose `from` or `to` is not an entity → add the entity or fix
  the id; the validator names the path.
- Referencing a version id that is not declared, or using `versions` in
  steps when the document has no `versions` array → declare the versions
  first, in chronological order.
- `removedIn` earlier than `availableFrom` → the validator rejects it; check
  the order of the versions array.
- A payload with real tokens, keys or hostnames → placeholders and
  `example.com`-style names.
- Two options marked `correct`, or an option without `why` → one correct
  option, a reason on every option.
- A step with twelve messages → split it; a step is one beat of the story.
- Removing a holding the entity never gained in that topic → set the
  topic's starting `holds`, or add it in an earlier message; the validator
  names the version in which it fails.
- An `alt` whose branches leave a gap or overlap another frame → branches
  are contiguous and frames are either separate or nested.
- One giant topic with thirty steps → split by idea into several topics
  under one section.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), the theme table, and the complete card-payment example with two versions
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; hero, lesson layout, network and sequence diagrams, message flow, time machine, the four themes in `PALETTES`, `NthView.THEMES`
- `examples/example.html` — the card-payment explainer, a working standalone sample built from the schema example
