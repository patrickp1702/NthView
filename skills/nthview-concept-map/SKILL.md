---
name: nthview-concept-map
description: Turns a topic, text or document into an interactive concept map the learner first tours and then rebuilds from memory: concepts as nodes in coloured clusters, labelled relationships as arrows, a guided tour that lights up one region at a time, six kinds of rebuild task (place nodes in clusters, name a link, draw a missing link, spot a wrong link, order a process, name a blank concept) with an explanation for every slip, and a "three links that matter most" reflection. Use when the user asks for a concept map, mind map, knowledge graph or "how it all fits together", wants to see the structure or big picture of an idea, or to understand causes, parts and relationships; not for memorising isolated facts, a single linear story, or step-by-step procedures with no structure.
---

# NthView — Concept Map

## Overview
The learner sees the whole idea as a living map: concepts as glass nodes,
labelled arrows between them ("causes", "is part of", "contrasts with"), and
coloured hulls grouping them into clusters around one root concept. A guided
tour glides the camera from region to region while a short explanation
appears. Then the map comes apart and the learner rebuilds it from memory:
loose concepts are dragged back into their clusters, blank labels are named,
a missing arrow is drawn, a deliberately wrong arrow is spotted and a process
is put in order. Every slip gets a why-explanation, hints are always there,
Skip is always allowed and nothing is scored. A final reflection asks for the
three links that matter most and explains the author's answer; the review
screen shows the completed map and every slip again.

The method rests on schema building (Novak's concept maps), dual coding
(words plus spatial layout), organisation, elaboration and retrieval
practice. The output is one self-contained HTML file. The force-directed
layout, pan and zoom, minimap and cluster collapsing are plain JavaScript;
the only external resource is Google Fonts (Fraunces, Inter, Outfit, Space
Grotesk), which needs internet access the first time the file opens and
falls back to system fonts without it.

## When to use
- Topics whose meaning lives in the relationships: causes and effects,
  systems, feedback loops, parts and wholes, competing ideas
- The learner says they know the pieces but "don't see how it fits together"
- Science (climate, ecosystems, the immune system), civics (how a bill
  becomes law), economics (inflation and interest rates), architecture of a
  codebase, a chapter or paper with many interlinked terms
- Revision: the rebuild phase is retrieval practice on structure

Do not use when:
- The content is a list of facts or definitions to memorise (a flashcard or
  quiz view fits better)
- It is mainly about judgement calls in situations (use `nthview-scenario-quiz`)
- It is one linear sequence with nothing branching off (a timeline or step
  view fits better), or has fewer than about 6 concepts
- The learner wants a playful game for children (use `nthview-island-quest`)

## Procedure

### 1. Understand the content
Find the **one root concept** the whole topic hangs on, then the 12–30
concepts a learner must know to explain it (6–60 are allowed). Group them
into 3–6 clusters by **role** (mechanism, causes, sinks, consequences, actors,
stages), not by surface similarity. For every pair that is directly related,
write the relationship as a short verb phrase that reads as a sentence from
one concept to the other, and one or two sentences on why it holds. Look for
a process inside the topic (3–8 steps), the misconceptions people hold (they
become wrong options and the spotted mistake), and the three links without
which the map would make no sense.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- Pick a `theme` that matches the subject (table in `references/schema.md`)
  and give each cluster its own `color` role.
- Nodes: short labels (under about 22 characters stay on one line), a
  one-sentence `definition`, a `note` for depth and an `example` where a
  concrete case helps.
- Edges: verb phrases of 24 characters or fewer; prefer precise verbs
  ("absorbs", "releases", "amplifies") over vague ones ("affects").
  Include at least one "contrasts with" or "is a kind of" link if the topic
  has one; they teach discrimination.
- Tour: 4–8 stops. Start with the root and its main consequence, then one
  stop per cluster or mechanism, ending with what it means. List the node
  and edge ids to light up in `focus`.
- Rebuild: 6–10 tasks that use at least four of the six types. Detailed
  guidance per type is in `references/rebuild-tasks.md`.
- Reflection: three `keyEdges` (typically the cause, the mechanism and the
  amplifier) and 8–12 `candidates` for maps with more than about 15 edges.
- Add a `glossary` for technical terms and a two-paragraph `summary`.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable: an isolated node, a disconnected map, a cluster the tour never
visits or a wrong option without `why` usually means the teaching is thinner
than it should be. A "still taken apart by the later rebuild.tasks[n]" error
means a task relies on a piece a later task holds; reorder the tasks.

If `node` is not installed, try `bun` or `deno run -A` with the same
script; both run it unchanged. If no JavaScript runtime exists, do the
validator's job yourself: check the JSON against every table, cross-field
rule and warning in `references/schema.md`, which is exactly what
`scripts/validate.js` implements, and fix what you find. Say that the check
was done by hand; the file also validates itself when opened and shows an
error panel if anything was missed.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly, including the Google Fonts tag declared in
`NthView.libs`:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-concept-map.html

If building by hand:
- the JSON in `<script type="application/json" id="nthview-data">`, with
  every `<` in the serialised JSON replaced by `\u003c`,
- the one `<link rel="stylesheet">` tag from `NthView.libs` before the scripts,
- the full contents of `scripts/validate.js`, then `assets/view.js`, inlined,
- the bootstrap script that calls `NthView.build(document.getElementById("app"), data)`.
Name the file `<concept-slug>-concept-map.html`.

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

The hand build is the fallback when no JavaScript runtime is available; the
tool does nothing beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file and mention that it loads its fonts from Google
Fonts the first time it opens (it still works offline with system fonts).
Build no other view unless asked.

## Content guidance
- **Size.** 15–30 nodes and 1–1.5 edges per node is the sweet spot. Below 10
  the map is trivial; above 40 use clusters of 6–10 and expect learners to
  collapse some (the legend offers collapse and expand from 30 nodes; a
  minimap appears from 16).
- **Clusters.** 3–6, each with 2–8 nodes and a `description`. The root's
  cluster is drawn in the middle; the others ring around it, ordered so
  strongly linked clusters sit side by side.
- **Relations read as sentences.** "Ocean uptake **causes** Ocean
  acidification" must make sense aloud. Direction matters: the `connect` task
  tells the learner when they drew the right pair the wrong way round.
- **Explanations teach the why.** Each edge `explanation` should give the
  mechanism, not restate the label. Task `why` texts are shown after every
  task, so make them the one paragraph worth remembering.
- **Tour text** is 1–3 sentences per stop; bold the one term the stop is about.
- **Rebuild order.** Put `place` tasks early (they restore nodes other tasks
  need) and let later tasks build on what earlier ones restored. Mix types so
  the rhythm changes every task or two; see `references/rebuild-tasks.md`.
- **Wrong options are misconceptions**, not nonsense, each with a `why` that
  grants what is reasonable about it before correcting it.
- **Tone.** Calm, curious, encouraging. A slip is "not quite", never "wrong!".

## Common mistakes
- Clusters by topic word rather than role (all "ocean" things together) →
  regroup by what each concept *does* in the system.
- Vague relations ("relates to", "affects") → name the mechanism ("absorbs",
  "releases", "amplifies").
- Correct option label differs from the edge `relation` → copy it exactly;
  the validator checks this.
- A `relation` or `spot` task about an edge that touches a node a later
  `place` task still holds loose → move the `place` task earlier.
- `order.nodes` listed shuffled → list them in the correct order; the view
  shuffles them.
- Putting `root` in a `place` task → the root stays pinned; place others.
- Reflection candidates missing a key edge → include all three.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), the theme and colour tables, and the complete greenhouse-effect example
- `references/rebuild-tasks.md` — how to choose and write each of the six rebuild task types, with a snippet for each
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; the force layout, the five themes (`PALETTES`) and the Google Fonts entry in `NthView.libs`
- `examples/example.html` — the greenhouse-effect map, a working standalone sample built from the schema example
