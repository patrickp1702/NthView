# Zoom Map data schema — schemaVersion 1

## Overview
The data describes one large system (typically a codebase) as a ladder of
abstraction: one `root` node for the whole system, its pillars, the concepts
inside each pillar, the mechanisms inside each concept, and the files that
implement them, as one nested tree. Around the tree sit the ladder's `levels`
(what each rung of the explanation means), `pipelines` (ordered flows such
as a lifecycle), `relations` (labelled links between regions) and a
`glossary`.

The view draws the same tree two ways. **Map mode** is a zoomable
containment map: each node is a region nested inside its parent, the camera
zooms into a region until it fills the screen, and detail appears as regions
grow (labels, then one-liners, then key facts, then snippets and files).
**Doc mode** is a readable ladder document: one rung per `levels` entry, with
pillar cards, numbered pipelines, one section per node, collapsed "Go
deeper" accordions, a file map and a glossary. Every region links to its
section and every section links back to its region. The data never carries
coordinates: the renderer lays the map out itself, deterministically.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Page title, top bar and the doc's top line |
| `subtitle` | string | no | ≤200 chars | Kicker above the big idea in doc mode |
| `theme` | string | no | one of `blueprint`, `paper`, `graphite`, `aurora`, `porcelain` | Visual theme (see Themes). When omitted, one is derived from the title |
| `levels` | array | yes | 2–8 Level objects | The rungs of the ladder, L0 first |
| `root` | object | yes | a Node object with `kind` `"system"` | The whole system: the big idea, with the pillars as its `children` |
| `pipelines` | array | no | 0–12 Pipeline objects | Ordered flows (a lifecycle, a request path, a build) |
| `relations` | array | no | 0–300 Relation objects | Labelled links between regions ("feeds", "reads from") |
| `glossary` | array | no | 0–120 Glossary objects | Terms; `((term))` in any text opens a pop-over |
| `footer` | string | no | ≤400 chars, mark-up | A closing line at the end of the doc |

## Themes
Every theme sets the animated backdrop (gradient, drifting colour fields and
a faint pattern that drifts with the camera), glass panel surfaces, an accent
pair, the display typeface, corner radius and the eight region colours. Each
has a light and a dark variant: the reader's system setting picks one and a
top-bar button cycles auto, light and dark. Each variant stays on one side
of brightness, so text is near-black on every light variant and near-white
on every dark one, and the region colours switch to a darker set on light
variants and a brighter set on dark ones so every pillar stays distinct and
readable.

| Theme | Native mood (other variant) | Type | Pattern | Suits |
| :- | :- | :- | :- | :- |
| `blueprint` | Navy drafting table, cyan ink (pale engineering blue) | Space Grotesk / Inter | Fine grid | Codebases, engineering, architecture |
| `paper` | Warm ivory, ink and terracotta (dark sepia) | Fraunces / Inter | Ruled dots | Field guides, documentation, long reads |
| `graphite` | Charcoal studio, lime and amber (light grey) | Manrope / Inter | Fine dots | Tools, infrastructure, developer platforms |
| `aurora` | Polar night, green and violet light (pale mint) | Sora / Inter | Star field | Big-picture overviews, AI and data systems |
| `porcelain` | Crisp white, indigo and coral (ink navy) | Bricolage Grotesque / Inter | Dot grid | Products, design systems, onboarding |

`blueprint`, `graphite` and `aurora` are dark by default; `paper` and
`porcelain` are light by default. Code uses JetBrains Mono in every theme.

## Region colours
A pillar may name a colour role: `red`, `orange`, `gold`, `green`, `teal`,
`blue`, `violet` or `pink`. Every descendant of the pillar inherits its
colour. When omitted, roles are assigned by pillar position in the order
teal, violet, gold, red, blue, green, orange, pink. Every region is also
labelled, so colour is never the only cue.

## Text mark-up
Fields marked **mark-up** accept a small Markdown subset; nothing else is
interpreted and no HTML is ever rendered.

- Blank lines separate paragraphs. Lines starting `- ` form a bullet list,
  lines starting `1. ` (any number) a numbered list, and a line starting
  `# ` a small heading.
- Inline: `**bold**`, `*italic*`, `` `code` ``.
- `((term))` or `((shown text|term))` shows a glossary term the reader can
  tap; `term` must match a `glossary[].term` (case-insensitive).
- `[[node-id]]` or `[[shown text|node-id]]` links to a node: in doc mode it
  scrolls to that section, on the map it zooms to that region.
- Mark-up inside `` `code` `` is not interpreted.

Character limits count JavaScript string length.

## Level object
The ladder's rungs, in order: `levels[0]` is L0 (the big idea). Each node,
pipeline and the file map sits on one rung (see Cross-field rules for the
defaults). In doc mode a rung that holds pillars, its own content or the file
map gets a section headed by `heading` (or `name`); a rung holding several
sections gets a slim divider; a rung holding one section lends that section
its badge.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | no | 1–8 chars, default `"L<index>"` | The badge, such as `L2` or `§` |
| `name` | string | yes | 1–40 chars | Short name in the nav and breadcrumbs ("Five pillars") |
| `meaning` | string | yes | 1–200 chars | One line on what this rung explains; the section's lead |
| `heading` | string | no | ≤120 chars | The rung's section heading when it differs from `name` |
| `fileMap` | boolean | no | at most one level sets `true` | Render the complete file map on this rung |
| `summary`, `facts`, `snippet`, `table`, `stack`, `note`, `deeper` | | no | see Content fields | The rung's own content (for an "under the hood" rung that is not a node) |

## Content fields
Nodes, levels and pipelines share these optional fields.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `summary` | string | no | ≤3000 chars, mark-up | The explanation, always visible in doc mode and on a focused leaf |
| `facts` | array | no | 1–12 items; each a string (1–300 chars, mark-up) or a Fact card object | Key facts: strings render as a list, objects as cards |
| `snippet` | object or array | no | a Snippet object, or an array of 1–4 | Small code examples |
| `table` | object | no | a Table object | A reference table |
| `stack` | array | no | 2–8 Layer objects | A layered architecture diagram, top layer first |
| `note` | string | no | ≤800 chars, mark-up | A highlighted callout; start it with `**A bold lead.**` |
| `deeper` | object | no | a Deeper object | The mechanism, collapsed until the reader asks for it |

## Fact card object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–60 chars | The card's kicker ("Order-free") |
| `text` | string | yes | 1–500 chars, mark-up | The card's text |

## Snippet object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `code` | string | yes | 1–5000 chars | The code, shown verbatim with light highlighting |
| `lang` | string | no | ≤20 chars, lowercase letters, digits, `+`, `#`, `-` | Language hint (`js`, `json`, `md`, `bash`, `text`) |
| `label` | string | no | ≤100 chars | Panel heading ("a Navigator layer · lsass-coverage.json") |
| `caption` | string | no | ≤400 chars, mark-up | A line under the panel |
| `result` | string | no | ≤1500 chars, mark-up | What the code produces; drawn beside the code with an arrow |
| `resultLabel` | string | no | ≤100 chars | Heading of the result panel, default "result" |

## Table object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `columns` | string[] | yes | 2–6 items, each 1–40 chars | Column headings |
| `rows` | array | yes | 1–60 rows; each an array of strings with exactly one cell per column, each cell ≤400 chars, mark-up | The rows |
| `caption` | string | no | ≤300 chars, mark-up | A line under the table |

## Layer object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–60 chars | The layer's name ("Editor surface") |
| `caption` | string | no | ≤120 chars | What the layer is for ("what the author uses") |
| `items` | string[] | yes | 1–20 items, each 1–80 chars | The pieces in the layer |

## Deeper object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | no | ≤100 chars | Completes "Go deeper — …" ("how a fence becomes a live block") |
| `text` | string | yes | 1–5000 chars, mark-up | The mechanism, in as much detail as it needs |

## Node object
`root` is a Node; every node's `children` are Nodes. Kinds follow the tree:
the root is the `system`, its children are `pillar`s, a pillar holds
`concept`s, a concept holds `concept`s or `mechanism`s, a mechanism holds
`mechanism`s, and a `file` node may sit under any non-root node but has no
children.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–48 chars, unique among nodes and pipelines | Stable key, used by links, relations and pipeline steps |
| `title` | string | yes | 1–60 chars | The region's label; short (under about 32 characters fits small regions) |
| `kind` | string | yes | one of `system`, `pillar`, `concept`, `mechanism`, `file` | What the node is (see the rule above) |
| `oneLiner` | string | yes | 1–160 chars | One sentence; under the label on the map, the lead in doc mode. For the root it is the big idea |
| `tag` | string | no | ≤40 chars | A role name shown as a kicker ("Source of truth") |
| `heading` | string | no | ≤120 chars | The doc section heading when it differs from `title` |
| `color` | string | no | a colour role; pillars only | The pillar's region colour |
| `level` | integer | no | an index into `levels` | The rung the node's doc section sits on (default: see Cross-field rules) |
| `summary`, `facts`, `snippet`, `table`, `stack`, `note`, `deeper` | | no | see Content fields | The node's content |
| `files` | array | no | 1–80 File objects, paths unique within the node; not on `file` nodes | The files that implement this node |
| `children` | array | no | 1–16 Node objects; not on `file` nodes | What the node is made of, in reading order |

## File object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `path` | string | yes | 1–200 chars, free text | The file path, shown in monospace (`scripts/validate.js`, `lint/{index.ts, codes.ts}`) |
| `role` | string | yes | 1–300 chars, mark-up | What the file does |
| `group` | string | no | ≤80 chars | Groups the file map ("Technique & tactic pages", "attack.mitre.org · pages"). When no file has a group, the map is grouped by pillar |

## Pipeline object
An ordered flow drawn as a numbered step strip in doc mode and as numbered
arrows between regions on the map (toggle it from the map's legend).

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–48 chars, unique among nodes and pipelines | Stable key |
| `title` | string | yes | 1–80 chars | Section heading and legend chip ("How a board comes alive") |
| `steps` | array | yes | 2–12 Step objects | In order; numbered 01, 02, … |
| `rule` | string | no | ≤600 chars, mark-up | "The one rule that ties it together", shown as a callout |
| `level` | integer | no | an index into `levels`; not with `at` | The rung its section sits on (default `1`) |
| `at` | string | no | a node id; not with `level` | Render the pipeline inside that node's section instead |
| `summary`, `facts`, `snippet`, `table`, `stack`, `note`, `deeper` | | no | see Content fields | The pipeline's content |

## Step object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `node` | string | no | a node id | The region this step happens in; the step links to it |
| `label` | string | no | 1–40 chars; required when `node` is absent | The step's name ("Read"); defaults to the node's title |
| `text` | string | no | ≤200 chars, mark-up | What happens in the step |
| `tag` | string | no | ≤30 chars | A small kicker above the label (`data_fetch`) |

## Relation object
Relations are directed and read as a sentence: *from* — *label* → *to*. On
the map a relation is drawn between the two regions at the current zoom
level that contain its endpoints, so a link between two concepts in
different pillars shows as a link between those pillars at the overview.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `from` | string | yes | a node id | Where the arrow starts |
| `to` | string | yes | a node id; not `from`, and neither node may contain the other | Where the arrow points |
| `label` | string | yes | 1–32 chars | A verb phrase ("feeds", "reads from", "validates") |
| `text` | string | no | ≤300 chars, mark-up | Why the link holds; listed in both nodes' doc sections |

## Glossary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–60 chars, unique (case-insensitive) | The term |
| `meaning` | string | yes | 1–500 chars, mark-up | What it means |

## Cross-field rules
- Node ids are unique across the whole tree, and pipeline ids are unique and
  differ from every node id.
- `root.kind` is `"system"`; every child of the root is a `pillar`; the root
  has 2–12 children.
- Kinds follow the tree: a `pillar`'s children are `concept` or `file`
  nodes; a `concept`'s children are `concept`, `mechanism` or `file` nodes; a
  `mechanism`'s children are `mechanism` or `file` nodes; `pillar` and
  `system` never appear below depth 1 and 0.
- A `file` node has no `children` and no `files`.
- The tree is 2–6 levels deep: at least one node sits at depth 2 (a child of
  a pillar) and none deeper than 6. At most 250 nodes and 500 files in all.
- `color` is set only on pillars.
- `level`: the root is on level `0`. A node's level is never lower than its
  parent's, and a pillar is never on level 0. When `level` is omitted, a
  node sits on the level equal to its depth (capped at the last level), or
  on its parent's level if that is higher. Every `level` must be an index
  into `levels`.
- In doc mode a node on the same level as its parent (when the parent is a
  concept or mechanism) is drawn inside the parent's section as a
  sub-section; every other node gets its own section on its level.
- At most one level sets `fileMap: true`. Without one, the file map follows
  the last level when any file is listed.
- `pipelines[i]` sets at most one of `level` and `at`; `at` and every
  `steps[j].node` must be node ids; a step without `node` needs a `label`.
- `relations[i].from` and `.to` are node ids, differ, and neither node is an
  ancestor of the other.
- Every `((term))` names a `glossary[].term` and every `[[id]]` names a node
  id, in every mark-up field.
- `table.rows[i]` has exactly as many cells as `table.columns`.

## Warnings (non-blocking)
- An unknown field (often a typo such as `oneliner` or `child`).
- Fewer than 3 or more than 7 pillars, or a node with more than 9 children
  (regions get small on the map).
- More than 200 nodes or more than 400 files.
- A `title` longer than 32 characters or a `oneLiner` longer than 110 (they
  are clipped on small regions).
- A pillar without children, or a concept or mechanism with no `summary`,
  no `facts` and no `children` (an empty region teaches nothing).
- No relations and no pipelines (the map shows no connectors).
- The same relation (from, to, label) listed twice.
- A level with nothing on it (no node, pipeline, content or file map).

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
