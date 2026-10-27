---
name: nthview-zoom-map
description: Turns a codebase, system, product or any layered subject into a Zoom Map, one standalone HTML file with two linked modes over one tree, a zoomable containment map that goes from the big idea into pillars, concepts and mechanisms down to file chips, with connectors, a numbered pipeline overlay, breadcrumb and minimap, and a ladder document (L0 big idea, L1 pillars, L2 lifecycle, L3 one section per concept with snippets, tables and collapsed "Go deeper" mechanisms, L4 under the hood, L5 file map, glossary) where every section links to its region and back. Use when the user asks how something works, wants the architecture or structure of a codebase or system explained top down, says "explain this repo", "how it works", "architecture", "codebase", "zoom", "big picture first", "progressive disclosure" or "C4"; not for memorising isolated facts, judgement calls, a single linear story, or content with fewer than about eight parts.
---

# NthView — Zoom Map

## Overview
The learner sees one system as a ladder of abstraction. In **map mode** the
whole system is a field of large labelled regions, one per pillar, each with
a one-liner; clicking a region zooms in with a smooth transition and its
children appear, down to the mechanisms and the files that implement them.
Detail grows with the zoom (labels, then one-liners, then key facts, then
snippets and file chips), labelled connectors show how regions relate at the
current level, a pipeline overlay numbers the regions a lifecycle passes
through, a breadcrumb and a minimap say where you are, and Escape,
double-click or the wheel zoom back out. In **doc mode** the same tree is a
readable ladder: a level nav (L0 … Ln and the glossary), one section per node
with its level badge, numbered pipeline strips, tables, code with its result
beside it, collapsed "Go deeper" accordions holding the mechanisms, a file map
and a glossary. "Show on map" on every section and "Read" on every region
land on the same node in the other mode.

The method is progressive disclosure down Bret Victor's ladder of abstraction
and the C4 model's context → container → component → code: the learner always
sees the whole before the part and can stop at the rung that satisfies them.
The output is one self-contained HTML file; the layout, camera, transitions
and minimap are plain JavaScript. The only external resource is Google Fonts
(Space Grotesk, Fraunces, Manrope, Sora, Bricolage Grotesque, Inter,
JetBrains Mono), which needs internet access the first time the file opens
and falls back to system fonts without it. Progress (mode, zoomed region,
viewport, open accordions, scroll position, colour scheme) is saved in the
browser's localStorage and restored when the file is reopened; the Restart
button in the top bar clears it and starts from the overview.

## When to use
- A codebase, library, framework or repository the learner wants to
  understand top down ("how does this work", "explain the architecture")
- A system made of parts that contain smaller parts: a product, a platform,
  a protocol stack, an organisation, a pipeline with stages and steps
- A long technical document or design doc that already has a big idea,
  a handful of pillars and many details under each
- Onboarding: the first document a newcomer reads before touching the code
- A recap that must stay honest about depth: the big picture, with every
  mechanism and file still reachable

Do not use when:
- The content is a flat list of facts or definitions (a quiz or flashcard
  view fits better)
- It is mainly about judgement calls in situations (use `nthview-scenario-quiz`)
- It is one linear story or a single process with nothing nested (a timeline
  or step view fits better)
- The meaning lives in a web of causal relations rather than in containment
  (use `nthview-concept-map`)
- There are fewer than about eight meaningful parts: the overview would show
  two or three boxes with nothing inside

## Procedure

### 1. Understand the content
Read the code, document or description with one question: *what contains
what?* Find the **big idea** (one sentence a newcomer would repeat), the
**3–7 pillars** it rests on (the ideas, not the folders), the **concepts**
inside each pillar, the **mechanisms** that explain how a concept works, and
the **files** that implement each one. Look for one **lifecycle** or request
path to draw as a pipeline (Read → Scan → Check → Plan → Run → Render), the
**relations** that cross pillar boundaries ("publishes into", "reads from",
"gates"), and the terms a reader will need in a glossary. The full method,
with sizes and worked examples, is in `references/decomposition.md`.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- `levels`: the rungs of the ladder, L0 first. Six rungs is the proven
  shape: big idea, pillars, lifecycle, concepts, under the hood, file map.
  A rung can carry its own content (an "under the hood" `stack`); set
  `fileMap: true` on the rung that should hold the file map.
- `root`: the `system` node. Its `oneLiner` is the big idea; give it a
  `summary`, 3–5 string `facts` (rendered as chips) and one `snippet` with a
  `result` showing a tiny before/after.
- Pillars: `kind: "pillar"`, a `tag` naming the role ("Source of truth"),
  a `color` role each, a one-sentence `oneLiner` and a short `summary`.
- Concepts: `kind: "concept"`, `level: 3` so they sit on the concepts rung,
  a `heading` when the section title should be longer than the region label,
  a `summary`, and whichever of `facts` (strings or label/text cards),
  `snippet` (with `result` where a before/after helps), `table`, `note`
  and `deeper` the material calls for. Put the mechanism in `deeper` so it
  stays collapsed until asked for.
- Mechanisms: `kind: "mechanism"` children of a concept, left on the same
  level as their parent so they render as sub-sections inside it, each with
  its own `snippet` or short `summary`.
- `files`: on the node that owns them, `path` plus a `role`; use `group`
  when the file map should be grouped by package rather than by pillar.
- `pipelines`: the lifecycle, `level: 2`, each step pointing at a `node`
  so the map can number the regions, plus the one `rule` that ties it
  together.
- `relations`: 6–15 directed links with verb-phrase labels, mostly across
  pillars; add a `text` saying why the link holds.
- `glossary`: 6–12 terms; reference them in text with `((term))`. Link
  nodes with `[[node-id]]`.
- Pick a `theme` that matches the subject (table in `references/schema.md`).

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable: a title over 32 characters or a one-liner over 110 is clipped on
small regions, an empty concept teaches nothing, and a level with nothing on
it should be removed or given content.

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

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-zoom-map.html

If building by hand:
- the JSON in `<script type="application/json" id="nthview-data">`, with
  every `<` in the serialised JSON replaced by `\u003c`,
- the one `<link rel="stylesheet">` tag from `NthView.libs` before the scripts,
- the full contents of `scripts/validate.js`, then `assets/view.js`, inlined,
- the bootstrap script that calls `NthView.build(document.getElementById("app"), data)`.
Name the file `<concept-slug>-zoom-map.html`.

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
- **Shape.** 3–7 pillars, 2–5 concepts per pillar, 0–4 mechanisms per
  concept, 15–40 nodes in all. Beyond nine children a region's cells get
  small; group them. The tree may be 2–6 levels deep; four (pillar → concept
  → mechanism → file) is usually enough.
- **Pillars are ideas, not folders.** "One Markdown document", "Blocks that
  produce data"; the folder goes in `files`. Give each a role `tag` the reader
  can hold on to.
- **Labels are short, one-liners are one sentence.** A `title` under 32
  characters reads on the overview; a `oneLiner` under 110 characters fits
  under it. Put the longer version in `heading` and `summary`.
- **One-liners say what, summaries say how, `deeper` says why it is built
  that way.** The map shows the first two; the mechanism waits in the
  accordion for the reader who wants it.
- **Snippets are small and real.** Under 15 lines, taken from the subject
  itself, with `label` naming the file or context and `result` when the
  reader should see what it produces. One or two per concept.
- **Facts.** Strings for short claims (rendered as a list, or as chips on the
  root), label/text objects for named cards ("Order-free", "Fail-forward").
  Three or four cards read better than eight bullets.
- **The pipeline is the spine.** One lifecycle with 4–8 steps, each tied to
  the node where it happens, and one `rule` that ties it together. A second
  pipeline is fine when the system has a clearly different path (a build
  versus a request).
- **Relations cross pillars.** The connectors are most useful when they
  show how one pillar's concept feeds another's; sibling links inside a
  pillar are shown too but rarely teach much.
- **Files are complete at the bottom.** Every file worth knowing appears
  once, under the node it implements, with a role of one line; the file map
  rung collects them all. Use `group` for package names when the subject has
  packages. When the subject is not code but a framework, standard or body of
  knowledge, map `files` to its artefacts instead — for MITRE ATT&CK, the
  matrix, technique and tactic pages, group and software pages, mitigation and
  data-source pages, Navigator layers and STIX bundles — with `group` naming
  the kind of artefact; the file map then reads as "where to find each thing".
- **Glossary.** The terms a newcomer would look up; reference each at least
  once with `((term))` so it opens in place.
- **Tone.** Plain, concrete, present tense. Say what the thing does before
  what it is called.

## Common mistakes
- Pillars that mirror the folder tree → regroup by idea; folders belong in
  `files`.
- A concept at `level` 2 by accident (the default is the depth) → set
  `level: 3` on every concept so the pillars rung holds only pillars.
- Mechanisms given their own level → leave them on the parent's level so
  they nest inside the concept's section.
- Long titles on the overview → shorten `title`, move the full phrase to
  `heading`.
- The mechanism written into `summary` → move it to `deeper.text` and keep
  `summary` to what and how.
- A relation between a node and its ancestor → the validator rejects it;
  relate siblings or cousins instead.
- Pipeline steps without `node` → the map cannot number regions; tie every
  step to the node where it happens.
- `((term))` without a glossary entry, or `[[id]]` with a typo → the
  validator names the field; add the term or fix the id.
- Files listed only in a table → put them in `files` so the file map, the
  region chips and the leaf cards all show them.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), the theme table, the mark-up subset, and the complete "How NthView works" example
- `references/decomposition.md` — how to decompose a system into pillars, concepts, mechanisms and files, how many of each, and how to write one-liners versus deeper text
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; the containment layout, camera, both modes, the five themes (`PALETTES`) and the Google Fonts entry in `NthView.libs`
- `examples/example.html` — the "How NthView works" map, a working standalone sample built from the schema example
