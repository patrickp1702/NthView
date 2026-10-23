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
| `label` | string | no | ≤100 chars | Panel heading ("what you write · sales.floboard.md") |
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
| `group` | string | no | ≤80 chars | Groups the file map ("packages/floboard/js · the engine"). When no file has a group, the map is grouped by pillar |

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
The "How NthView works" map: this repository explained as a ladder. It is the exact data in `examples/example.html` (`node scripts/build-html.js skills/nthview-zoom-map --example …`).

```json
{
  "schemaVersion": 1,
  "title": "How NthView works",
  "subtitle": "The repository, explained as a ladder",
  "theme": "aurora",
  "levels": [
    {
      "label": "L0",
      "name": "The big idea",
      "meaning": "What NthView is, in one sentence and one example."
    },
    {
      "label": "L1",
      "name": "Five pillars",
      "heading": "The five things that make it work",
      "meaning": "Everything in the repository is one of five ideas. Learn these names and the rest is detail."
    },
    {
      "label": "L2",
      "name": "From concept to file",
      "meaning": "The fixed path every piece of content travels, from a request to a file the learner opens."
    },
    {
      "label": "L3",
      "name": "Concepts",
      "meaning": "One section per concept: what it is, the rules that shape it and the mechanism behind it."
    },
    {
      "label": "L4",
      "name": "Under the hood",
      "heading": "Under the hood — how the pieces fit",
      "meaning": "The repository is layered: what the learner opens, the views, the contract they follow, and the tooling that assembles them.",
      "summary": "Each layer only depends on the ones beneath it. The learner's file at the top contains everything it needs; the tooling at the bottom is used only when a file is produced, never when it is opened.",
      "stack": [
        {
          "name": "What the learner opens",
          "caption": "one file each, no server",
          "items": [
            "index.html (gallery)",
            "docs/<slug>-<view>.html",
            "lessons/<slug>/index.html",
            "lessons/<slug>/chapters/NN-<slug>.html"
          ]
        },
        {
          "name": "The views",
          "caption": "one folder per way of seeing",
          "items": [
            "assets/view.js",
            "scripts/validate.js",
            "references/schema.md",
            "SKILL.md",
            "examples/example.html"
          ]
        },
        {
          "name": "The contract",
          "caption": "fixed so every view behaves the same",
          "items": [
            "AGENTS.md",
            "SKILL.md template (§4)",
            "schema template (§5.1)",
            "validator skeleton (§5.2)",
            "renderer skeleton (§5.3)",
            "HTML template (§6)"
          ]
        },
        {
          "name": "Repo tooling",
          "caption": "plain Node, no packages",
          "items": [
            "scripts/build-html.js",
            "scripts/build-lesson.js",
            "scripts/build-registry.js"
          ]
        },
        {
          "name": "The outside world",
          "caption": "the only things fetched at runtime",
          "items": [
            "fonts.googleapis.com",
            "fonts.gstatic.com",
            "cdnjs.cloudflare.com",
            "cdn.jsdelivr.net",
            "unpkg.com"
          ]
        }
      ],
      "facts": [
        {
          "label": "Why one file",
          "text": "A learner should be able to open the result from disk, mail it, or drop it on any static host. So the data, the validator and the renderer travel together in one HTML file, and the only things fetched at runtime are pinned libraries and fonts from five allowed hosts."
        },
        {
          "label": "Why no build step",
          "text": "There is no `package.json`, bundler or transpiler anywhere. Views are ES2018 scripts with no module syntax, so they can be inlined verbatim, and Node is used only to run the three repo scripts. The output never depends on Node."
        },
        {
          "label": "Why independence beats DRY",
          "text": "Two views that need the same helper each carry their own copy. A view folder must install alone (copied into `.claude/skills/`), so nothing in one view may import, read or depend on another."
        }
      ]
    },
    {
      "label": "L5",
      "name": "File map",
      "heading": "The complete file map",
      "meaning": "Every file in the repository, what it does and the concept it belongs to.",
      "fileMap": true
    }
  ],
  "root": {
    "id": "nthview",
    "title": "NthView",
    "kind": "system",
    "oneLiner": "Learn anything, in the nth view that suits you.",
    "summary": "NthView is a ((kaleidoscope)) for learning. The same content — a topic, a pasted text, a paper, a codebase — can be turned into a quiz, a game, a concept map, an explorable model or a zoomable map, and the learner picks the one that suits them. Each way of seeing is a ((view)): a separate, self-contained agent ((skill)) that turns content into one ((standalone file)) the learner opens in a browser.\n\nThis guide explains the repository itself as a ladder. L0 is the idea, L1 the five pillars, L2 the path from a request to a file, L3 one section per concept, L4 how the layers fit and L5 the complete file map. Stop wherever it clicks.",
    "facts": [
      "one concept, many views",
      "one view at a time",
      "one standalone HTML file",
      "validated before it renders"
    ],
    "snippet": {
      "label": "what the agent writes · docs/greenhouse-effect-concept-map.json",
      "lang": "json",
      "code": "{\n  \"schemaVersion\": 1,\n  \"title\": \"The greenhouse effect\",\n  \"theme\": \"paper\",\n  \"nodes\": [ { \"id\": \"co2\", \"label\": \"CO₂\" }, … ],\n  \"edges\": [ { \"from\": \"co2\", \"to\": \"warming\", \"relation\": \"traps heat, causing\" }, … ]\n}",
      "resultLabel": "what the learner opens",
      "result": "**greenhouse-effect-concept-map.html** — one file with the data, the validator and the renderer inlined. It opens from disk, follows light or dark mode, works at phone width and needs the network only for its fonts.",
      "caption": "Ask for the same topic as a quiz or a game and a second file is built from the same content. Never two views in one file."
    },
    "children": [
      {
        "id": "the-contract",
        "title": "The view contract",
        "kind": "pillar",
        "tag": "Rulebook",
        "color": "teal",
        "oneLiner": "AGENTS.md fixes five files, one global object and one HTML template, so every view behaves identically.",
        "summary": "`AGENTS.md` is the rulebook every agent reads first. It fixes the folder layout of a view, the shape of its validator and renderer, the data conventions and the output template. The structure is not a suggestion: a view that deviates is rejected by the registry builder even if it works. If a rule needs to change, the file changes first, in its own commit, and every existing view follows.",
        "children": [
          {
            "id": "five-files",
            "title": "Five files per view",
            "kind": "concept",
            "level": 3,
            "oneLiner": "A view is a folder skills/nthview-<view>/ holding exactly five files with fixed names and roles.",
            "summary": "Fixing the names means an agent that has seen one view can work on any other without reading the folder first. The Agent Skills specification defines three optional folders and each is used for its intended purpose: `scripts/` for executable code, `references/` for documentation loaded on demand, `assets/` for resources that end up in the output. `examples/` is an NthView addition.",
            "table": {
              "columns": [
                "Path",
                "Role",
                "Public surface"
              ],
              "rows": [
                [
                  "`SKILL.md`",
                  "The procedure the agent follows to turn content into this view, in a fixed section order, under 500 lines",
                  "frontmatter `name`, `description`"
                ],
                [
                  "`references/schema.md`",
                  "The single source of truth for the view's JSON: field tables, cross-field rules, warnings and the complete example",
                  "the documented fields"
                ],
                [
                  "`scripts/validate.js`",
                  "Implements every rule in schema.md and nothing more; Node CLI and browser",
                  "`NthView.validate(data)`"
                ],
                [
                  "`assets/view.js`",
                  "Renders the view; all CSS inside, every class prefixed `nthview-`",
                  "`NthView.build(container, data)`"
                ],
                [
                  "`examples/example.html`",
                  "The schema's complete example built with the output template; opens from disk with no console errors",
                  "none"
                ]
              ],
              "caption": "Permitted additions: extra `.md` files in `references/` linked from SKILL.md, and extra samples `examples/example-<topic>.html`. Nothing else."
            },
            "note": "**Forbidden inside a view:** any other folder (`src/`, `lib/`, `css/`, `tests/`), any file that is not `.md`, `.js` or `.html`, shared code between views, `import`/`export`, a `package.json` or a build step. `scripts/build-registry.js` refuses the folder otherwise.",
            "files": [
              {
                "path": "AGENTS.md",
                "role": "the rulebook: the five-file contract (§3), the templates and skeletons (§4–6), the registry (§7) and the checklist for a new view (§11)",
                "group": "repo root"
              }
            ]
          },
          {
            "id": "nthview-global",
            "title": "One global, two functions",
            "kind": "concept",
            "level": 3,
            "oneLiner": "Every view exposes NthView.validate(data) and NthView.build(container, data), and nothing else public.",
            "summary": "The validator and the renderer are two plain scripts that extend one global object, `NthView`, never replace it. The only other permitted properties are `SUPPORTED_VERSIONS`, `libs` (the view's CDN resources) and `THEMES` (when the view has themes). Helpers stay inside each script's closure.",
            "snippet": {
              "label": "assets/view.js · the fixed entry point",
              "lang": "js",
              "code": "NthView.build = function (container, data) {\n  container.innerHTML = \"\";\n  container.classList.add(\"nthview\", \"nthview-<view>\");\n  injectStyles();                       // once, into <head>\n  var result = NthView.validate(data);  // always first\n  if (!result.valid) { renderErrorPanel(container, result); return result; }\n  render(container, data);              // data is valid here\n  return result;\n};",
              "caption": "`build` validates first, clears the container, injects styles once and returns the validation result. Re-running it replaces the previous render."
            },
            "deeper": {
              "title": "what build() guarantees",
              "text": "The renderer skeleton in AGENTS.md §5.3 fixes everything around `render`: the `el()` helper that builds DOM with `textContent` (never `innerHTML` from data, so content cannot inject markup), the `CSS` string with every colour read from `--nv-*` custom properties so light and dark mode share one rule set, the `:focus-visible` rule for keyboard users, and the standard ((error panel)).\n\nWhen the view declares libraries in `NthView.libs`, `build()` also checks that each script's global exists and, if one did not load, renders the error panel with a single message naming the library and the URL — never a blank screen or a broken scene.\n\nA view must be responsive from 320px, keyboard operable (real buttons, links and inputs, or `tabindex=\"0\"` with a key handler), and must not call `fetch`, `XMLHttpRequest` or `import`."
            },
            "files": [
              {
                "path": "skills/nthview-<view>/assets/view.js",
                "role": "the renderer: `NthView.build`, the `CSS` string, `render` and the view's helpers",
                "group": "skills/ · the views"
              },
              {
                "path": "skills/nthview-<view>/scripts/validate.js",
                "role": "the validator: `NthView.validate`, `SUPPORTED_VERSIONS`, the Node CLI",
                "group": "skills/ · the views"
              }
            ]
          },
          {
            "id": "schema-md",
            "title": "schema.md, the source of truth",
            "kind": "concept",
            "heading": "schema.md — the single source of truth",
            "level": 3,
            "oneLiner": "Every field in a five-column table, the cross-field rules, the warnings and one complete example.",
            "summary": "A view's data format lives in one place. `schemaVersion` (integer, required) is always the first field and `title` (string, required) is always at the root, so every view has a page heading. Cross-field problems — a dangling id, an out-of-range index — are errors; stylistic concerns are warnings. The validator implements the rules written here and nothing more: when the validator needs a rule, the schema gets it first.",
            "facts": [
              "Fixed headings: Overview, Root object, one table per nested type, Cross-field rules, Warnings, Complete example.",
              "The complete example is the exact data in `examples/example.html`; `scripts/build-html.js --example` reads it from the fenced json block, so there is one copy.",
              "`schemaVersion` is bumped only for breaking changes; the new number is added to `SUPPORTED_VERSIONS` and the old shape is handled in `render` when feasible."
            ],
            "files": [
              {
                "path": "skills/nthview-<view>/references/schema.md",
                "role": "the view's JSON format and its complete example",
                "group": "skills/ · the views"
              }
            ]
          },
          {
            "id": "validation",
            "title": "Validation before rendering",
            "kind": "concept",
            "level": 3,
            "oneLiner": "The same validator runs as a Node CLI while the agent works and inside the page when the learner opens it.",
            "summary": "`scripts/validate.js` is one file in two places. Its UMD wrapper defines `NthView.validate` in the browser and exports the same function for Node; a CLI block at the end reads a JSON file, prints every problem and exits `0` when valid, `1` when invalid or unreadable, `2` on a usage error. It prints exactly `valid` on success so a skill can grep for it.",
            "snippet": {
              "label": "terminal",
              "lang": "bash",
              "code": "node skills/nthview-concept-map/scripts/validate.js docs/greenhouse-effect-concept-map.json\n# error    edges[2].to: node id \"step-9\" is not defined in nodes\n# warning  nodes[4].label: is 41 characters; labels over 32 are clipped\n# invalid: 1 error(s)",
              "resultLabel": "after the fix",
              "result": "`valid`\n\nThe CLI prints the single word, exits `0`, and the build tool accepts the file."
            },
            "facts": [
              {
                "label": "Never throws",
                "text": "Bad root input yields one error at `$`. An unknown `schemaVersion` is rejected before anything else is checked. All problems are reported in one pass."
              },
              {
                "label": "path: message",
                "text": "Paths run from the root with `.` and `[n]`, the root is `$`; one sentence says what is wrong and what was expected, with the actual value when it helps: `items[3].answer: index 4 is out of range (4 options, valid indexes are 0–3)`."
              },
              {
                "label": "Errors block, warnings advise",
                "text": "A blocking problem is never put in warnings. The in-page error panel shows the same strings the CLI prints."
              }
            ],
            "deeper": {
              "title": "how the error panel is reached",
              "text": "`build()` calls `validate` first. On invalid data it renders a fixed block — `.nthview-error-panel[role=alert]` with an `h2` (\"This view could not be built\"), a `p` with the count, and a `ul` of `<code>path</code>: message` — and returns the result without touching `render`. That is why an NthView file never shows a half-broken view: either the data passed, or the learner sees exactly what the agent would have seen on the command line.\n\nThe build tools enforce the same gate from the outside: `scripts/build-html.js` validates before it writes and refuses to write an invalid file, and `scripts/build-lesson.js` does the same for every chapter."
            }
          },
          {
            "id": "skill-md",
            "title": "SKILL.md, the procedure",
            "kind": "concept",
            "heading": "SKILL.md — the procedure the agent follows",
            "level": 3,
            "oneLiner": "A fixed template: Overview, When to use, a five-step Procedure, Content guidance, Common mistakes, Files.",
            "summary": "The frontmatter `name` equals the folder name and the single-line `description` says, in the third person, what the view *produces* and *when* to use it, with the trigger words a user would actually say — and never summarises the procedure, because an agent may follow the description instead of the body. The gallery shows exactly this description, so it is written for both the agent and the human reader.",
            "facts": [
              "The five numbered steps are mandatory and ordered: Understand the content → Prepare the JSON → Validate → Build the HTML file → Deliver.",
              "Under 500 lines; heavier guidance moves to `references/*.md` files linked from SKILL.md.",
              "Each view carries its own copy of the procedure; nothing is shared."
            ],
            "files": [
              {
                "path": "skills/nthview-<view>/SKILL.md",
                "role": "the view's procedure, frontmatter `name` and `description`",
                "group": "skills/ · the views"
              }
            ]
          }
        ]
      },
      {
        "id": "the-views",
        "title": "The views",
        "kind": "pillar",
        "tag": "Kaleidoscope",
        "color": "violet",
        "oneLiner": "Six self-contained skills, each one way of seeing the same content; the learner picks one at a time.",
        "summary": "Think of a kaleidoscope: the same content, turned, appears in a new form. Each view is a separate skill folder with its own validator, renderer, schema and example. Nothing in one view folder may import, read or depend on another, so each installs alone. The user picks **one** view; only that view is built. Another view of the same content is another file.",
        "deeper": {
          "title": "the kaleidoscope, mechanically",
          "text": "The one-view-at-a-time principle is what keeps every view independent. Because a file is one view over one dataset, a view never has to know how another view shapes content, and the agent never has to merge two schemas. Turning the kaleidoscope means: take the same source content, follow a different `SKILL.md`, write a different JSON, validate it with that view's validator, and build a second file. Two angles on an idea inside a lesson are two chapters, never one.\n\nThemes follow the same discipline: every view carries its own palettes (light and dark for each), picks one from the root `theme` field or derives it from the title, and keeps every colour in CSS custom properties so the base error panel keeps the shared look."
        },
        "children": [
          {
            "id": "island-quest",
            "title": "Island Quest",
            "kind": "concept",
            "level": 3,
            "oneLiner": "A playable 3D island adventure: one lesson per island, 25 kinds of activity, a final exam and a report card.",
            "summary": "Islands are laid out in rings (3 to 60), each holding one lesson with activities, in four world themes. It suits beginners, children, anyone asking for a game, a paper with separable findings, and consolidating several ideas at the end of a lesson.",
            "files": [
              {
                "path": "skills/nthview-island-quest/",
                "role": "the five files of the Island Quest view",
                "group": "skills/ · the views"
              }
            ]
          },
          {
            "id": "scenario-quiz",
            "title": "Scenario Quiz",
            "kind": "concept",
            "level": 3,
            "oneLiner": "A story-based decision quiz: a role, a run of choices, every option explained as right, wrong or tempting.",
            "summary": "The learner is given a role in a scenario and faces a sequence of choices; the file ends with a full review. It suits judgement calls, rules, ethics and \"what would you do\" content.",
            "files": [
              {
                "path": "skills/nthview-scenario-quiz/",
                "role": "the five files of the Scenario Quiz view",
                "group": "skills/ · the views"
              }
            ]
          },
          {
            "id": "explorable",
            "title": "Explorable Lab",
            "kind": "concept",
            "level": 3,
            "oneLiner": "Learn by tinkering: live slider-driven models, predict-then-observe prompts and eleven visualisation kinds.",
            "summary": "A guided sequence of models the learner can push on. It suits anything with numbers or a mechanism worth playing with, and building intuition in the middle of a lesson.",
            "files": [
              {
                "path": "skills/nthview-explorable/",
                "role": "the five files of the Explorable Lab view",
                "group": "skills/ · the views"
              }
            ]
          },
          {
            "id": "detective",
            "title": "Detective Case",
            "kind": "concept",
            "level": 3,
            "oneLiner": "Learn by deduction: the facts are clues, misconceptions are suspects, and the case is cracked on a board.",
            "summary": "A puzzle with misconceptions to rule out and a story with a reveal; a strong opening chapter for a lesson.",
            "files": [
              {
                "path": "skills/nthview-detective/",
                "role": "the five files of the Detective Case view",
                "group": "skills/ · the views"
              }
            ]
          },
          {
            "id": "concept-map",
            "title": "Concept Map",
            "kind": "concept",
            "level": 3,
            "oneLiner": "Learn by structure: tour a living map of the idea, then rebuild it from memory with a hint for every slip.",
            "summary": "Concepts as nodes in coloured clusters, labelled relationships as arrows, a guided tour, then six kinds of rebuild task. It suits systems of causes and effects and \"how it all fits together\".",
            "files": [
              {
                "path": "skills/nthview-concept-map/",
                "role": "the five files of the Concept Map view, plus `references/rebuild-tasks.md`",
                "group": "skills/ · the views"
              }
            ]
          },
          {
            "id": "zoom-map",
            "title": "Zoom Map",
            "kind": "concept",
            "level": 3,
            "oneLiner": "Learn top-down: a zoomable containment map and a ladder document over one tree of pillars, concepts and files.",
            "summary": "The view you are reading now. Map mode zooms from the big idea into pillars, concepts and mechanisms down to file chips; doc mode is the same tree as a readable ladder with level badges, pipelines, tables, snippets, \"Go deeper\" accordions, a file map and a glossary. Every region links to its section and back. It suits codebases, architectures and \"how does this work\" questions.",
            "files": [
              {
                "path": "skills/nthview-zoom-map/",
                "role": "the five files of the Zoom Map view, plus `references/decomposition.md`",
                "group": "skills/ · the views"
              }
            ]
          }
        ]
      },
      {
        "id": "build-tools",
        "title": "The build tools",
        "kind": "pillar",
        "tag": "Assembly line",
        "color": "gold",
        "oneLiner": "Three Node scripts turn validated JSON into standalone pages, lessons and the gallery registry.",
        "summary": "The root `scripts/` folder holds repo tooling only, never view code. Each script runs on plain Node with no packages: one assembles a standalone page, one assembles a lesson, one checks every view folder against the contract and writes the registry.",
        "children": [
          {
            "id": "build-html",
            "title": "build-html.js",
            "kind": "concept",
            "heading": "build-html.js — the standalone template",
            "level": 3,
            "oneLiner": "Assembles the one-file output exactly as AGENTS.md §6 prescribes and refuses to write invalid data.",
            "summary": "The output of every view, including each `examples/example.html`, is one fixed HTML template with four placeholders: the title, the view's CDN tags, the serialised JSON, and the two scripts inlined verbatim followed by a three-line bootstrap. The tool fills them exactly; building by hand is allowed but must produce the same file.",
            "snippet": [
              {
                "label": "terminal",
                "lang": "bash",
                "code": "node scripts/build-html.js skills/nthview-concept-map docs/greenhouse-effect-concept-map.json docs/greenhouse-effect-concept-map.html\n# wrote docs/greenhouse-effect-concept-map.html (184210 bytes, 1 CDN library)\n\n# the view's own demo, from the example in references/schema.md\nnode scripts/build-html.js skills/nthview-concept-map --example skills/nthview-concept-map/examples/example.html"
              },
              {
                "label": "the template · AGENTS.md §6",
                "lang": "html",
                "code": "<!doctype html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"utf-8\">\n  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n  <meta name=\"color-scheme\" content=\"light dark\">\n  <title>{{title}} — NthView</title>\n</head>\n<body>\n  <div id=\"app\"></div>\n  {{one <link> or <script src> tag per entry in NthView.libs}}\n  <script type=\"application/json\" id=\"nthview-data\">{{JSON, every \"<\" as \\u003c}}</script>\n  <script>{{scripts/validate.js, verbatim}}</script>\n  <script>{{assets/view.js, verbatim}}</script>\n  <script>\n    (function () {\n      var data = JSON.parse(document.getElementById(\"nthview-data\").textContent);\n      NthView.build(document.getElementById(\"app\"), data);\n    })();\n  </script>\n</body>\n</html>",
                "caption": "`id=\"nthview-data\"` and `id=\"app\"` are fixed names. The output file is named `<concept-slug>-<view>.html`."
              }
            ],
            "deeper": {
              "title": "why the JSON is escaped and the scripts are verbatim",
              "text": "After serialising the data, every `<` becomes `\\u003c`. That is a valid JSON escape, so the data is unchanged after parsing, and it neutralises both `</script>` and `<!--`, which would otherwise end the script block early. (`<\\/script>` is not used: the matching trick for `<!--` is not valid JSON.)\n\nThe two scripts are copied byte for byte, validate.js first because view.js needs `NthView.validate` to exist. Never minified, edited or linked: the file must work when it is the only file on the machine, so the only `src=`, `href=` and `url(` values allowed are the CDN entries from `NthView.libs`, `data:` URIs and hyperlinks the view renders from its data.\n\nAs a module, `assemble(viewDir, data, { extraBody })` returns `{ html, errors, warnings, libs }`; `scripts/build-lesson.js` uses `extraBody` for the lesson bar."
            },
            "children": [
              {
                "id": "cdn-rules",
                "title": "Libraries and fonts",
                "kind": "mechanism",
                "heading": "External libraries — the only runtime fetches",
                "oneLiner": "A view that needs a library or a web font declares it in NthView.libs, pinned, from one of five hosts.",
                "summary": "A view that genuinely needs a library (3D, charts, maths typesetting) or a web font may load it from a CDN; the browser fetches it when the file opens, so the output stays one shareable file. `scripts/build-html.js` writes one tag per entry before the inlined scripts, and `build()` checks that every script's global exists.",
                "table": {
                  "columns": [
                    "Rule",
                    "Detail"
                  ],
                  "rows": [
                    [
                      "Allowed hosts",
                      "`cdnjs.cloudflare.com`, `cdn.jsdelivr.net`, `unpkg.com`, `fonts.googleapis.com`, `fonts.gstatic.com`; always `https`"
                    ],
                    [
                      "Pinned version",
                      "`three.js/r128/`, `chart.js/4.4.1/`; never `latest`"
                    ],
                    [
                      "Declared",
                      "`NthView.libs = [{ kind: \"script\", src, global, name }, { kind: \"style\", href, name }]`, directly after `NthView.build`"
                    ],
                    [
                      "Checked",
                      "a missing script global renders the error panel: \"<name> did not load from <src>. This file needs internet access the first time it opens.\""
                    ],
                    [
                      "Prefer none",
                      "plain JavaScript and CSS when they do the job; a view without libraries omits `NthView.libs`"
                    ]
                  ]
                }
              }
            ],
            "files": [
              {
                "path": "scripts/build-html.js",
                "role": "assembles a standalone output file exactly as §6; `--example` reads the complete example from the view's schema.md",
                "group": "scripts/ · repo tooling"
              }
            ]
          },
          {
            "id": "build-lesson",
            "title": "build-lesson.js",
            "kind": "concept",
            "heading": "build-lesson.js — chapters and the lesson bar",
            "level": 3,
            "oneLiner": "Validates a lesson and every chapter, assembles each chapter page with a lesson bar, writes the contents page.",
            "summary": "`node scripts/build-lesson.js lessons/<slug>` validates `lesson.json`, validates each chapter's JSON with its view's validator, assembles every chapter page exactly as [[build-html.js|build-html]] would, appends the lesson bar, writes the lesson's `index.html` contents page and regenerates the registry. `--all` rebuilds every lesson.",
            "deeper": {
              "title": "the lesson bar",
              "text": "A lesson chapter may carry exactly one extra block after the bootstrap script: a `<nav class=\"nthview-lesson-bar\">` with its own `<style>` and `<script>`, every class prefixed `nthview-lesson-`. It shows the chapter number, and on hover or tap a menu with Previous, Contents and Next (or \"Next lesson\" when the manifest names one, or \"Finish\"). It is fixed to the bottom-right corner above everything else, follows light and dark mode, hides when printed and closes on Escape.\n\nIt never touches the ((view)): the view's scripts are unchanged, the bar only sits in the same page. This is the one addition the output template permits, which is why `build-html.js` exposes `extraBody`."
            },
            "files": [
              {
                "path": "scripts/build-lesson.js",
                "role": "validates `lesson.json`, builds every chapter with its view and the lesson bar, writes the contents page, regenerates the registry",
                "group": "scripts/ · repo tooling"
              }
            ]
          },
          {
            "id": "build-registry",
            "title": "build-registry.js",
            "kind": "concept",
            "heading": "build-registry.js — the structure checker",
            "level": 3,
            "oneLiner": "Scans skills/, docs/ and lessons/, rejects any view folder that breaks the contract, and writes registry.js.",
            "summary": "Registering a skill *is* running this script. It reads each `skills/<name>/SKILL.md` frontmatter, checks every `nthview-*` folder against AGENTS.md §3, scans `docs/*.html` and `lessons/<slug>/lesson.json`, and writes [[registry.js|registry-js]]. It exits non-zero and writes nothing if any folder breaks the rules, so it doubles as the structure checker; `--check` exits `1` when `registry.js` is stale.",
            "table": {
              "columns": [
                "What it checks",
                "Example rejection"
              ],
              "rows": [
                [
                  "The five required files exist",
                  "`skills/nthview-quiz: missing required file examples/example.html`"
                ],
                [
                  "Frontmatter `name` equals the folder, `description` is one line under 1024 characters",
                  "`frontmatter name \"nthview-quizz\" does not match folder name \"nthview-quiz\"`"
                ],
                [
                  "No forbidden runtime calls in view.js or the example",
                  "`forbidden runtime call or import: fetch(\"data.json\")`"
                ],
                [
                  "Every URL is on an allowed CDN host; the example has no local `src`, `href` or `url(`",
                  "`URL is not on an allowed CDN host (...): https://example.com/lib.js`"
                ],
                [
                  "Only `SKILL.md`, `assets/`, `scripts/`, `references/`, `examples/` inside the folder",
                  "`unexpected entry \"src\" (only SKILL.md, assets/, scripts/, references/, examples/ are allowed)`"
                ],
                [
                  "A lesson has its `index.html` and every chapter page",
                  "`lessons/x/lesson.json chapters[1]: chapters/02-y.html is missing; run node scripts/build-lesson.js lessons/x`"
                ]
              ]
            },
            "files": [
              {
                "path": "scripts/build-registry.js",
                "role": "the structure checker and registry writer; `--check` verifies registry.js is current",
                "group": "scripts/ · repo tooling"
              }
            ]
          }
        ]
      },
      {
        "id": "gallery",
        "title": "The gallery and the registry",
        "kind": "pillar",
        "tag": "Front door for people",
        "color": "red",
        "oneLiner": "index.html lists every view, doc and lesson from one generated file, registry.js, so it works from disk.",
        "summary": "The gallery must work when opened straight from disk or from any static host, so it cannot scan folders itself. Instead it reads one generated file. The single source of truth is each skill's `SKILL.md` frontmatter: the gallery shows exactly the description written there.",
        "children": [
          {
            "id": "registry-js",
            "title": "registry.js, generated",
            "kind": "concept",
            "heading": "registry.js — generated, never edited",
            "level": 3,
            "oneLiner": "SKILL.md frontmatter → build-registry.js → registry.js → index.html: one flow, one source of truth.",
            "summary": "`registry.js` assigns `window.NthViewRegistry = { skills, docs, lessons }`. For every skill it records the name, a title derived from the folder name (`nthview-concept-map` → \"Concept Map\"), the kind (`view` for `nthview-*` folders, `skill` for the parent), the description, and the paths to its SKILL.md, schema and demo. The parent skill is recorded with `hidden: true` so it never appears as a card.",
            "snippet": {
              "label": "registry.js · one entry",
              "lang": "js",
              "code": "window.NthViewRegistry = { \"skills\": [\n  { \"name\": \"nthview-zoom-map\", \"title\": \"Zoom Map\", \"kind\": \"view\", \"hidden\": false,\n    \"description\": \"…\", \"skillMd\": \"# NthView — Zoom Map …\", \"schemaMd\": \"# Zoom Map data schema …\",\n    \"path\": \"skills/nthview-zoom-map\", \"skill\": \"skills/nthview-zoom-map/SKILL.md\",\n    \"schema\": \"skills/nthview-zoom-map/references/schema.md\",\n    \"demo\": \"skills/nthview-zoom-map/examples/example.html\" }\n], \"docs\": [ … ], \"lessons\": [ … ] };"
            },
            "deeper": {
              "title": "why a generated file, and why the markdown travels inside it",
              "text": "A page opened from `file://` may load a sibling script with a plain `<script src>` but may not `fetch` a sibling file. So the gallery cannot read `SKILL.md` or `schema.md` on demand; their text is embedded in `registry.js` as `skillMd` and `schemaMd`, and the gallery renders them in a reader dialog. The same limitation is why `index.html` never scans folders: `scripts/build-registry.js` does, at build time.\n\nThe file is overwritten on every run and committed together with the skill that changed. `node scripts/build-registry.js --check` exits `1` when it is stale, and is run before finishing any task that touched `skills/`."
            },
            "files": [
              {
                "path": "registry.js",
                "role": "GENERATED list of skills, docs and lessons that the gallery reads; never edited by hand",
                "group": "repo root"
              }
            ]
          },
          {
            "id": "index-html",
            "title": "index.html, the gallery",
            "kind": "concept",
            "heading": "index.html — the gallery page",
            "level": 3,
            "oneLiner": "One card per view with Open demo, Skill file and Schema; docs and lessons behind one button; generic for all.",
            "summary": "The page loads `registry.js` with a plain `<script src>` and renders one card per entry, views first, with the title, name and description. **Open demo** opens the view's `examples/example.html`; **Skill file** and **Schema** open a reader dialog that renders the embedded markdown. Single documents and lessons sit behind one \"N docs · M lessons available\" button that opens a second dialog.",
            "facts": [
              "Follows the same standards as a view: the Google Fonts link and a pinned `marked` build from cdnjs are the only external resources; light and dark mode; responsive; keyboard accessible.",
              "Content is rendered with `textContent`, so a description can never inject markup.",
              "Never add per-view markup to `index.html`: it changes only when the gallery itself changes."
            ],
            "files": [
              {
                "path": "index.html",
                "role": "the gallery: lists every skill with Open demo, Skill file and Schema links, plus the docs-and-lessons dialog",
                "group": "repo root"
              },
              {
                "path": "README.md",
                "role": "the user-facing introduction; its *Views* section lists each view in one line",
                "group": "repo root"
              }
            ]
          }
        ]
      },
      {
        "id": "lessons-parent",
        "title": "Lessons and the parent skill",
        "kind": "pillar",
        "tag": "Front door for agents",
        "color": "blue",
        "oneLiner": "The nthview skill picks document or lesson and a view per chapter; a lesson is a folder of one-view chapters.",
        "summary": "`skills/nthview/SKILL.md` is the front door for an agent. It decides document versus lesson, recommends a view per use case from a minimal table, asks at most two questions, and hands each piece of content to the matching view skill. It holds no view detail of its own.",
        "children": [
          {
            "id": "parent-skill",
            "title": "The parent skill",
            "kind": "concept",
            "heading": "The nthview parent skill",
            "level": 3,
            "oneLiner": "Decides the format, recommends a view with one line of reasoning, then follows the chosen view's SKILL.md.",
            "summary": "One idea, or \"a doc\": a single document. Several ideas that build on each other, or the words lesson, course, chapters: a lesson of 3–10 chapters, each with one learning objective and one view. The recommendation table is minimal on purpose; the detail stays in each view's own `SKILL.md`.",
            "table": {
              "columns": [
                "Use case",
                "Prefer",
                "Also works"
              ],
              "rows": [
                [
                  "A system of causes and effects, \"how it all fits together\"",
                  "Concept Map",
                  "Explorable Lab"
                ],
                [
                  "Something with numbers or a model worth playing with",
                  "Explorable Lab",
                  "Island Quest"
                ],
                [
                  "Judgement calls, rules, ethics, \"what would you do\"",
                  "Scenario Quiz",
                  "Detective Case"
                ],
                [
                  "A puzzle with misconceptions to rule out, a story with a reveal",
                  "Detective Case",
                  "Scenario Quiz"
                ],
                [
                  "How a codebase or system works, top down",
                  "Zoom Map",
                  "Concept Map"
                ],
                [
                  "Beginners, children, anyone asking for a game",
                  "Island Quest",
                  "Detective Case"
                ]
              ],
              "caption": "A pattern that works for a lesson: open with structure or a hook, build intuition, apply it, consolidate."
            },
            "files": [
              {
                "path": "skills/nthview/SKILL.md",
                "role": "the parent skill: document versus lesson, the view-per-use-case table, the hand-off to view skills; hidden from the gallery",
                "group": "skills/ · the views"
              },
              {
                "path": "skills/nthview/references/lesson-format.md",
                "role": "the `lesson.json` format, the folder layout and the build command",
                "group": "skills/ · the views"
              }
            ]
          },
          {
            "id": "lessons",
            "title": "A lesson is a folder",
            "kind": "concept",
            "level": 3,
            "oneLiner": "lessons/<slug>/lesson.json plus chapters/NN-<slug>.json, one view per chapter; nothing hand-written.",
            "summary": "A ((lesson)) is a folder under the repo-root `lessons/`. It holds a manifest and one view output per chapter; the chapter JSON is the source of truth and every HTML page is produced by `scripts/build-lesson.js`. Chapter files start with two digits so the order is visible on disk. Two angles on an idea are two chapters.",
            "snippet": {
              "label": "lessons/compliance-for-everyone/lesson.json",
              "lang": "json",
              "code": "{\n  \"schemaVersion\": 1,\n  \"title\": \"Compliance for Everyone\",\n  \"description\": \"What compliance really means, told three ways: crack a case, make the calls yourself, then play it through.\",\n  \"audience\": \"Anyone starting a job where rules matter, no legal background needed.\",\n  \"chapters\": [\n    { \"file\": \"01-the-marigold-kitchen-case\", \"title\": \"The Marigold Kitchen Case\", \"view\": \"nthview-detective\", \"summary\": \"…\" },\n    { \"file\": \"02-a-week-at-brightpath\", \"title\": \"A Week at BrightPath\", \"view\": \"nthview-scenario-quiz\", \"summary\": \"…\" },\n    { \"file\": \"03-compliance-cove\", \"title\": \"Compliance Cove\", \"view\": \"nthview-island-quest\", \"summary\": \"…\" }\n  ]\n}",
              "caption": "The one lesson in the repository today: a detective case, then a scenario quiz, then an island quest, all about the same subject."
            },
            "files": [
              {
                "path": "lessons/compliance-for-everyone/lesson.json",
                "role": "the manifest of the Compliance for Everyone lesson",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "lessons/compliance-for-everyone/index.html",
                "role": "GENERATED contents page with one card per chapter",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "lessons/compliance-for-everyone/chapters/01-the-marigold-kitchen-case.json",
                "role": "chapter 1 data (Detective Case); its `.html` is generated next to it",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "lessons/compliance-for-everyone/chapters/02-a-week-at-brightpath.json",
                "role": "chapter 2 data (Scenario Quiz)",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "lessons/compliance-for-everyone/chapters/03-compliance-cove.json",
                "role": "chapter 3 data (Island Quest)",
                "group": "docs/ and lessons/ · outputs"
              }
            ]
          },
          {
            "id": "docs-folder",
            "title": "Single documents in docs/",
            "kind": "concept",
            "level": 3,
            "oneLiner": "A document built with a view lives in docs/ as <concept-slug>-<view>.json next to the .html it produced.",
            "summary": "The root `docs/` folder is for single documents produced *with* a view: the JSON next to the HTML, named `<concept-slug>-<view>`. The registry scans the folder so the gallery can list them; nothing in `skills/` may depend on them. A view's own demo stays in `skills/<view>/examples/example.html`.",
            "files": [
              {
                "path": "docs/greenhouse-effect-concept-map.json",
                "role": "the greenhouse effect as a Concept Map; `.html` next to it",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "docs/herd-immunity-explorable.json",
                "role": "herd immunity as an Explorable Lab",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "docs/compliance-detective.json",
                "role": "compliance as a Detective Case",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "docs/compliance-scenario-quiz.json",
                "role": "compliance as a Scenario Quiz",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "docs/compliance-island-quest.json",
                "role": "compliance as an Island Quest",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "docs/all-types-island-quest.json",
                "role": "an Island Quest that exercises every activity type",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": "docs/floboard-how-it-works-zoom-map.json",
                "role": "a codebase explained as a Zoom Map",
                "group": "docs/ and lessons/ · outputs"
              },
              {
                "path": ".gitignore",
                "role": "ignores OS junk files and the scratch `temp/` folder",
                "group": "repo root"
              }
            ]
          }
        ]
      }
    ]
  },
  "pipelines": [
    {
      "id": "lifecycle",
      "title": "From a request to a file",
      "level": 2,
      "summary": "Every `SKILL.md` drives the same five steps, and the registry adds a sixth. Understanding this order explains why the files look the way they do.",
      "steps": [
        {
          "label": "Understand",
          "node": "parent-skill",
          "text": "read what the user wants to learn; settle document or lesson and the view"
        },
        {
          "label": "Transform",
          "node": "schema-md",
          "text": "shape the content into the view's JSON exactly as schema.md defines"
        },
        {
          "label": "Validate",
          "node": "validation",
          "text": "`node scripts/validate.js` prints `valid` or every `path: message`"
        },
        {
          "label": "Build",
          "node": "build-html",
          "text": "one standalone HTML file from the fixed template"
        },
        {
          "label": "Deliver",
          "node": "docs-folder",
          "text": "hand over the one file; build nothing else unless asked"
        },
        {
          "label": "Register",
          "node": "build-registry",
          "text": "`node scripts/build-registry.js` lists it in the gallery"
        }
      ],
      "rule": "The data is validated before anything renders — by the CLI while the agent works, by `build-html.js` before it writes, and again by the same validator inside the page when the learner opens it. An invalid file shows the ((error panel)), never a half-broken view.",
      "facts": [
        {
          "label": "The two things that never change",
          "text": "The content the user wants to learn, and the view's `schema.md`. Everything between them — the JSON, the HTML, the registry entry — is derived and can be rebuilt."
        },
        {
          "label": "Why the order matters",
          "text": "A file built from unvalidated data would carry the problem to the learner; a skill registered before its folder is checked would break the gallery. Each step gates the next."
        }
      ]
    },
    {
      "id": "lesson-build",
      "title": "How a lesson is built",
      "at": "build-lesson",
      "steps": [
        {
          "tag": "lesson.json",
          "label": "Check the manifest",
          "text": "title, description, 1–30 chapters, each with `file`, `title`, `view` and `summary`"
        },
        {
          "tag": "chapters/*.json",
          "label": "Validate each chapter",
          "node": "validation",
          "text": "with the validator of the chapter's own view"
        },
        {
          "tag": "build-html.js",
          "label": "Assemble each page",
          "node": "build-html",
          "text": "the standard template plus the lesson bar as `extraBody`"
        },
        {
          "tag": "index.html",
          "label": "Write the contents page",
          "node": "lessons",
          "text": "one card per chapter, a Start button, the next lesson when named"
        },
        {
          "tag": "registry.js",
          "label": "Regenerate the registry",
          "node": "build-registry",
          "text": "so the gallery lists the lesson"
        }
      ],
      "rule": "A chapter is exactly one view. If the manifest or any chapter is invalid, nothing is written."
    }
  ],
  "relations": [
    {
      "from": "schema-md",
      "to": "validation",
      "label": "is implemented by",
      "text": "The validator implements the rules written in schema.md and nothing more."
    },
    {
      "from": "validation",
      "to": "build-html",
      "label": "gates",
      "text": "build-html.js validates first and refuses to write an invalid file."
    },
    {
      "from": "build-html",
      "to": "build-lesson",
      "label": "is reused by",
      "text": "build-lesson.js calls assemble() for every chapter and passes the lesson bar as extraBody."
    },
    {
      "from": "build-lesson",
      "to": "build-registry",
      "label": "re-runs",
      "text": "After a lesson is built the registry is regenerated so the gallery lists it."
    },
    {
      "from": "skill-md",
      "to": "registry-js",
      "label": "feeds",
      "text": "The frontmatter description is the text the gallery card shows."
    },
    {
      "from": "build-registry",
      "to": "registry-js",
      "label": "writes",
      "text": "The only way registry.js changes."
    },
    {
      "from": "registry-js",
      "to": "index-html",
      "label": "is read by",
      "text": "A plain script tag, allowed from file://, unlike fetch."
    },
    {
      "from": "parent-skill",
      "to": "skill-md",
      "label": "hands off to",
      "text": "The parent skill holds no view detail; it follows each view's own procedure."
    },
    {
      "from": "lessons",
      "to": "build-lesson",
      "label": "is built by",
      "text": "Nothing in a lesson is hand-written HTML."
    },
    {
      "from": "docs-folder",
      "to": "build-html",
      "label": "is built by",
      "text": "A document's JSON and HTML sit side by side in docs/."
    },
    {
      "from": "the-views",
      "to": "nthview-global",
      "label": "each implements",
      "text": "Six views, one public surface."
    },
    {
      "from": "nthview-global",
      "to": "cdn-rules",
      "label": "declares",
      "text": "NthView.libs lists the view's pinned CDN resources, and build() checks them."
    },
    {
      "from": "five-files",
      "to": "build-registry",
      "label": "is enforced by",
      "text": "The registry builder refuses any folder that breaks the five-file contract."
    }
  ],
  "glossary": [
    {
      "term": "view",
      "meaning": "One way of presenting content to a learner — a quiz, a game, a concept map, a zoom map. Each view is a separate skill folder `skills/nthview-<view>/`."
    },
    {
      "term": "skill",
      "meaning": "A folder with a `SKILL.md` an agent follows, plus optional `scripts/`, `references/` and `assets/`, as the Agent Skills specification defines. Every NthView view is one."
    },
    {
      "term": "standalone file",
      "meaning": "One HTML file holding the data, the validator and the renderer; it opens from disk and fetches nothing but pinned CDN libraries and fonts."
    },
    {
      "term": "kaleidoscope",
      "meaning": "NthView's image for itself: the same content, turned, appears in a new form. One view at a time; another view is another file."
    },
    {
      "term": "error panel",
      "meaning": "The fixed block `build()` renders on invalid data: a heading, the problem count and one `path: message` line per error, the same strings the CLI prints."
    },
    {
      "term": "registry",
      "meaning": "`registry.js`, the generated list of skills, docs and lessons that the gallery reads; regenerated by `node scripts/build-registry.js`, never edited by hand."
    },
    {
      "term": "lesson",
      "meaning": "A folder `lessons/<slug>/` with a `lesson.json` manifest and one view output per chapter, built by `scripts/build-lesson.js`."
    },
    {
      "term": "schemaVersion",
      "meaning": "The integer every data object carries; a validator rejects any version it does not list in `SUPPORTED_VERSIONS` before checking anything else."
    }
  ],
  "footer": "NthView — learn anything, in the nth view that suits you. This document is the Zoom Map view explaining its own repository."
}
```
