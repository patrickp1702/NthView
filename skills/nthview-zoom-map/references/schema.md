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
The MITRE ATT&CK framework explained as a ladder: the public knowledge base of adversary tactics and techniques (attack.mitre.org). It is the exact data in `examples/example.html` (`node scripts/build-html.js skills/nthview-zoom-map --example …`).

```json
{
  "schemaVersion": 1,
  "title": "MITRE ATT&CK, explained",
  "subtitle": "The adversary playbook, read top down",
  "theme": "graphite",
  "levels": [
    {
      "label": "L0",
      "name": "The framework",
      "meaning": "What ATT&CK is, the three matrices, and who turns it into defence."
    },
    {
      "label": "L1",
      "name": "Intrusion phases",
      "heading": "Five phases every intrusion moves through",
      "meaning": "The 14 Enterprise tactics group into five phases of an attack. Learn the phases and the tactics slot in."
    },
    {
      "label": "L2",
      "name": "A ransomware intrusion",
      "meaning": "One real-shaped attack chain walked tactic by tactic, from a phishing email to encrypted disks."
    },
    {
      "label": "L3",
      "name": "Tactics & techniques",
      "meaning": "One section per tactic, with its goal, a representative technique, its sub-techniques and how groups use it."
    },
    {
      "label": "L4",
      "name": "Under the hood",
      "heading": "Under the hood — the data model",
      "meaning": "ATT&CK is data: tactics, techniques and sub-techniques as STIX objects, shared through bundles and the Navigator.",
      "summary": "ATT&CK is not prose, it is a graph of typed objects. The matrix you read is a projection of that graph: tactics are columns, techniques are cells, and everything links to mitigations, ((data source))s, ((group))s and ((software)). Each layer only adds detail to the one above it, so a defender can stop at the rung that answers the question in front of them.",
      "stack": [
        {
          "name": "Matrices",
          "caption": "one per technology domain",
          "items": [
            "Enterprise (Windows, macOS, Linux, cloud)",
            "Mobile (Android, iOS)",
            "ICS (industrial control systems)"
          ]
        },
        {
          "name": "Tactics",
          "caption": "the adversary's goal — the why",
          "items": [
            "TA0001 Initial Access … TA0040 Impact",
            "columns of the matrix"
          ]
        },
        {
          "name": "Techniques & sub-techniques",
          "caption": "how the goal is met",
          "items": [
            "T1566 Phishing",
            "T1566.001 Spearphishing Attachment",
            "T1003.001 LSASS Memory"
          ]
        },
        {
          "name": "Objects that give context",
          "caption": "who, with what, and how to stop it",
          "items": [
            "Groups (G-ids)",
            "Software (S-ids)",
            "Mitigations (M-ids)",
            "Data sources & components (DS-ids)"
          ]
        },
        {
          "name": "Formats and tooling",
          "caption": "how the graph travels",
          "items": [
            "STIX 2.1 bundles",
            "ATT&CK Navigator layers (JSON)",
            "the TAXII / GitHub distribution"
          ]
        }
      ],
      "facts": [
        {
          "label": "One object model",
          "text": "Every tactic, technique, group, piece of software and mitigation is a STIX object with a stable ID. A ((Navigator)) layer is just a list of those IDs with colours and scores, which is why one export opens in anyone's browser."
        },
        {
          "label": "Why sub-techniques exist",
          "text": "A technique like `T1059` was once a bag of unrelated behaviours. Sub-techniques (`T1059.001` PowerShell, `T1059.003` Windows Command Shell) split it so detections and ((mitigation))s can be precise without multiplying the top-level list."
        }
      ],
      "note": "**The matrix is a map, not a checklist.** No intrusion uses every cell, and defending every cell is impossible. ATT&CK is for reasoning about *which* behaviours matter to you, given the ((group))s and ((software)) that target your sector."
    },
    {
      "label": "L5",
      "name": "Artefacts",
      "heading": "The pages and files you actually open",
      "meaning": "Every ATT&CK artefact — matrix, technique page, group page, mitigation page, data source page, Navigator layer, STIX bundle — and what it is for.",
      "fileMap": true
    }
  ],
  "root": {
    "id": "attack",
    "title": "MITRE ATT&CK",
    "kind": "system",
    "oneLiner": "A public, evidence-based catalogue of how real attackers behave after they get in.",
    "summary": "**ATT&CK** (Adversarial Tactics, Techniques, and Common Knowledge) is a free knowledge base, published by MITRE at attack.mitre.org, that names the things attackers *do*. Its spine is a ((matrix)): the columns are ((tactic))s — the attacker's goals, such as Initial Access or Exfiltration — and the cells are ((technique))s — the ways those goals are met, each with a stable ID like `T1566`.\n\nIt is built from reported, real-world intrusions, so every technique links to the ((group))s and ((software)) seen using it and to the ((mitigation))s and ((data source))s that counter and reveal it. Defenders use it as a shared language: to map their coverage, drive detections, plan red-team exercises and tag ((CTI)) reports.\n\nThis map reads ATT&CK top down. L0 is the idea, L1 the five phases of an intrusion, L2 one attack walked end to end, L3 the tactics and their techniques, L4 the data model, and L5 the artefacts you open. Stop at the rung that answers your question.",
    "facts": [
      "built from real, reported intrusions",
      "14 Enterprise tactics",
      "about 200 techniques, 400+ sub-techniques",
      "free and openly licensed"
    ],
    "snippet": {
      "label": "a Navigator layer · lsass-coverage.json",
      "lang": "json",
      "code": "{\n  \"name\": \"EDR coverage — credential access\",\n  \"domain\": \"enterprise-attack\",\n  \"versions\": { \"attack\": \"15\", \"navigator\": \"4.9\" },\n  \"techniques\": [\n    { \"techniqueID\": \"T1003.001\", \"score\": 100,\n      \"color\": \"#2e7d32\", \"comment\": \"LSASS access alert live\" },\n    { \"techniqueID\": \"T1003.002\", \"score\": 0,\n      \"color\": \"#c62828\", \"comment\": \"SAM dumping — no detection yet\" }\n  ]\n}",
      "resultLabel": "what an analyst sees",
      "result": "The **ATT&CK Navigator** paints those two cells of the matrix green and red over the grey of every other technique — a one-glance heat-map of *where detection exists and where it does not*. The same file opens in anyone's browser with no account.",
      "caption": "A layer is only a list of technique IDs with colours, scores and notes; the matrix underneath is ATT&CK's own."
    },
    "table": {
      "columns": [
        "Tactic",
        "ID",
        "The attacker's goal"
      ],
      "rows": [
        ["Reconnaissance", "`TA0043`", "Gather information to plan the operation"],
        ["Resource Development", "`TA0042`", "Build or buy the infrastructure and tools"],
        ["Initial Access", "`TA0001`", "Get the first foothold inside"],
        ["Execution", "`TA0002`", "Run attacker-controlled code"],
        ["Persistence", "`TA0003`", "Keep the foothold across reboots and logins"],
        ["Privilege Escalation", "`TA0004`", "Gain higher permissions"],
        ["Defense Evasion", "`TA0005`", "Avoid being detected"],
        ["Credential Access", "`TA0006`", "Steal account names and passwords"],
        ["Discovery", "`TA0007`", "Learn the environment"],
        ["Lateral Movement", "`TA0008`", "Move to other systems"],
        ["Collection", "`TA0009`", "Gather the data of interest"],
        ["Command and Control", "`TA0011`", "Talk to the compromised systems"],
        ["Exfiltration", "`TA0010`", "Steal the data out"],
        ["Impact", "`TA0040`", "Manipulate, interrupt or destroy"]
      ],
      "caption": "The 14 Enterprise tactics, in roughly the order an intrusion meets them. This map groups them into the five phases at [[L1|get-in]]."
    },
    "files": [
      { "path": "attack.mitre.org/matrices/enterprise", "role": "the Enterprise matrix: every tactic and technique for Windows, macOS, Linux and cloud", "group": "Matrices" },
      { "path": "attack.mitre.org/matrices/mobile", "role": "the Mobile matrix (Android, iOS)", "group": "Matrices" },
      { "path": "attack.mitre.org/matrices/ics", "role": "the ICS matrix for industrial control systems", "group": "Matrices" },
      { "path": "mitre-attack/attack-stix-data (GitHub)", "role": "the whole knowledge base as STIX 2.1 bundles, the machine-readable source of truth", "group": "Tooling (STIX, Navigator)" },
      { "path": "mitre-attack.github.io/attack-navigator", "role": "the Navigator web app that renders coloured, scored layers over the matrix", "group": "Tooling (STIX, Navigator)" }
    ],
    "children": [
      {
        "id": "get-in",
        "title": "Getting a foothold",
        "kind": "pillar",
        "tag": "Recon to access",
        "color": "teal",
        "oneLiner": "Before any code runs on your network, the attacker researches you, builds tooling and finds a way in.",
        "summary": "The first phase covers everything up to and including the first foothold: the pre-compromise ((tactic))s **Reconnaissance** and **Resource Development**, which happen on the attacker's own systems, and **Initial Access**, the moment a technique first touches yours. Phishing is the workhorse here, which is why so much defensive effort sits in email filtering and user training.",
        "children": [
          {
            "id": "reconnaissance",
            "title": "Reconnaissance",
            "kind": "concept",
            "level": 3,
            "tag": "TA0043",
            "oneLiner": "Gathering information — about people, systems and relationships — to plan the intrusion.",
            "summary": "Reconnaissance is the attacker learning about the target before touching it. Much of it is passive and invisible: reading the company website, scraping staff names from social media, enumerating internet-facing hosts. Because it mostly happens off your network, it is rarely detected; the defence is reducing what you expose.",
            "children": [
              {
                "id": "t1595",
                "title": "T1595 Active Scanning",
                "kind": "mechanism",
                "oneLiner": "Probing the target's infrastructure directly — scanning IP blocks, ports and web apps for weak points.",
                "summary": "Unlike passive reconnaissance, active scanning sends traffic to the target: port scans, vulnerability scans and crawling of public web applications. It leaves faint traces in network and web logs, so it is one of the few pre-compromise behaviours a defender can sometimes see.",
                "deeper": {
                  "title": "what the data sources show",
                  "text": "Active scanning surfaces in **Network Traffic** (unusual flows from a single source across many ports) and in web-server logs. It is noisy and common, so alerting on it alone is low value; it matters as *corroboration* when a later `T1190` exploit lands on a host that was scanned days before."
                }
              }
            ]
          },
          {
            "id": "resource-development",
            "title": "Resource Development",
            "kind": "concept",
            "level": 3,
            "tag": "TA0042",
            "oneLiner": "Building, buying or stealing the infrastructure and capabilities the operation will use.",
            "summary": "Before the attack, the adversary stands up what it needs: domains, servers, email accounts, malware and exploits. Like reconnaissance, this happens off your network, but threat-intelligence teams track it — a newly registered look-alike domain is often the first warning of a campaign aimed at you.",
            "children": [
              {
                "id": "t1583",
                "title": "T1583 Acquire Infrastructure",
                "kind": "mechanism",
                "oneLiner": "Registering domains and renting servers that will host phishing pages, payloads and command-and-control.",
                "summary": "Attackers acquire the ((command and control)) and delivery infrastructure an operation needs: look-alike domains for phishing, virtual servers for payload hosting, and redirectors to hide the real C2. Intelligence feeds and certificate-transparency logs let defenders spot some of it early."
              }
            ]
          },
          {
            "id": "initial-access",
            "title": "Initial Access",
            "kind": "concept",
            "level": 3,
            "tag": "TA0001",
            "heading": "Initial Access — the first foothold",
            "oneLiner": "The techniques that get an attacker their first execution or account inside the target.",
            "summary": "Initial Access is the doorway. Options include exploiting a public-facing application, abusing valid accounts, and — most commonly — **phishing**. This is the first tactic whose techniques actually touch your environment, so it is where detection becomes possible and where a layered defence pays off most.",
            "children": [
              {
                "id": "t1566",
                "title": "T1566 Phishing",
                "kind": "mechanism",
                "oneLiner": "Tricking a person into opening a malicious attachment or link that delivers the first payload.",
                "summary": "Phishing sends a crafted message that leads the recipient to run code or hand over credentials. It is the single most common way intrusions begin, which is why it anchors the attack chain walked at level L2.",
                "snippet": {
                  "label": "a Sigma-style detection sketch · suspicious-office-child.yml",
                  "lang": "text",
                  "code": "title: Office app spawns a script interpreter\nlogsource: { category: process_creation, product: windows }\ndetection:\n  parent:\n    ParentImage|endswith: ['\\\\WINWORD.EXE', '\\\\EXCEL.EXE']\n  child:\n    Image|endswith: ['\\\\powershell.exe', '\\\\wscript.exe', '\\\\cmd.exe']\n  condition: parent and child\nlevel: high",
                  "caption": "Detections for phishing usually fire on what the lure *does* — here, a document spawning a script interpreter — not on the email itself."
                },
                "deeper": {
                  "title": "the two sub-techniques you meet most",
                  "text": "`T1566.001` **Spearphishing Attachment** delivers a weaponised file (a macro-enabled document, an ISO, a LNK). `T1566.002` **Spearphishing Link** sends a URL to a credential-harvesting page or a drive-by payload. A group such as ((group)) G0016 (APT29) has used targeted spearphishing links against specific victims. Mitigations: `M1017` User Training and `M1049` Antivirus/Antimalware; the richest ((data source)) is **Application Log** (email gateway) joined to **Process Creation** on the endpoint."
                },
                "files": [
                  { "path": "attack.mitre.org/techniques/T1566", "role": "the Phishing technique page: sub-techniques, procedures, mitigations and detections", "group": "Technique & tactic pages" },
                  { "path": "attack.mitre.org/groups/G0016", "role": "the APT29 group page, listing the techniques and software attributed to it", "group": "Groups & software" }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "run-and-stay",
        "title": "Running code and staying",
        "kind": "pillar",
        "tag": "Execution & footholds",
        "color": "violet",
        "oneLiner": "Once inside, the attacker runs code, survives reboots, grabs higher rights and hides from the defenders.",
        "summary": "This phase turns a foothold into a durable, privileged, quiet presence. **Execution** runs the code, **Persistence** keeps it coming back, **Privilege Escalation** widens what it can do, and **Defense Evasion** — the largest tactic in ATT&CK — hides all of the above. These four tactics interleave rather than run in strict order.",
        "children": [
          {
            "id": "execution",
            "title": "Execution",
            "kind": "concept",
            "level": 3,
            "tag": "TA0002",
            "oneLiner": "Running attacker-controlled code on a local or remote system.",
            "summary": "Execution is the tactic of actually running code. The dominant technique is the **command and scripting interpreter** already present on every machine — PowerShell, cmd, bash — because living off the land avoids dropping detectable files.",
            "children": [
              {
                "id": "t1059",
                "title": "T1059 Scripting",
                "kind": "mechanism",
                "heading": "T1059 Command and Scripting Interpreter",
                "oneLiner": "Abusing the interpreters built into the OS — PowerShell, cmd, bash — to run commands and payloads.",
                "summary": "Rather than drop a new binary, attackers drive the interpreters that ship with the system. `T1059.001` **PowerShell** and `T1059.003` **Windows Command Shell** are the two seen most on Windows. Because these tools are legitimate, detection rests on *how* they are used, not whether they ran.",
                "snippet": {
                  "label": "a one-liner a defender hopes to catch",
                  "lang": "bash",
                  "code": "powershell -nop -w hidden -enc <base64>",
                  "resultLabel": "the red flags",
                  "result": "`-enc` (base64-encoded command), `-w hidden` (no window) and `-nop` (no profile) together are a strong signal: legitimate admin scripts rarely combine all three. Command-line logging (`M1047` Audit, plus Script Block Logging) turns this into a reliable alert.",
                  "caption": "Encoded, hidden, profile-less PowerShell launched by an Office process ties Execution back to Initial Access."
                }
              }
            ]
          },
          {
            "id": "persistence",
            "title": "Persistence",
            "kind": "concept",
            "level": 3,
            "tag": "TA0003",
            "oneLiner": "Keeping access across reboots, logoffs and credential changes.",
            "summary": "Persistence stops a reboot from evicting the attacker. Techniques plant something that runs again automatically — a scheduled task, a service, a registry run key, a startup item. The defender's edge is that most of these create durable, auditable artefacts.",
            "children": [
              {
                "id": "t1053",
                "title": "T1053 Scheduled Task",
                "kind": "mechanism",
                "heading": "T1053 Scheduled Task/Job",
                "oneLiner": "Using the OS task scheduler to run a payload on a trigger — at logon, on a timer, at a set time.",
                "summary": "`T1053.005` **Scheduled Task** on Windows is a favourite: it survives reboots, can run as SYSTEM, and looks like ordinary administration. It is one of the few techniques that spans three tactics — Execution, Persistence and Privilege Escalation — because the same action achieves all three.",
                "deeper": {
                  "title": "why it appears under three tactics",
                  "text": "A scheduled task *runs code* (Execution), *runs it again later* (Persistence) and can *run it as a higher-privileged account* (Privilege Escalation). ATT&CK lists one technique under every goal it serves, so the same `T1053` cell sits in three columns of the matrix. Watch the **Scheduled Job** data source and task-creation events (`4698`). Mitigation: `M1028` Operating System Configuration to restrict who may create tasks."
                }
              }
            ]
          },
          {
            "id": "privilege-escalation",
            "title": "Privilege Escalation",
            "kind": "concept",
            "level": 3,
            "tag": "TA0004",
            "oneLiner": "Gaining higher permissions than the initial foothold allowed.",
            "summary": "A phished user is rarely an administrator, so the attacker climbs. Techniques abuse misconfigurations, OS features and elevation controls to reach admin or SYSTEM, which unlocks credential theft and lateral movement.",
            "children": [
              {
                "id": "t1548",
                "title": "T1548 Elevation Abuse",
                "kind": "mechanism",
                "heading": "T1548 Abuse Elevation Control Mechanism",
                "oneLiner": "Subverting the OS controls meant to gate elevation, such as Windows UAC or Unix sudo.",
                "summary": "`T1548.002` **Bypass User Account Control** abuses the Windows mechanism that is supposed to prompt before elevation, slipping a payload to high integrity without a prompt. Mitigation `M1026` Privileged Account Management and keeping UAC at its highest setting (`M1028`) raise the cost."
              }
            ]
          },
          {
            "id": "defense-evasion",
            "title": "Defense Evasion",
            "kind": "concept",
            "level": 3,
            "tag": "TA0005",
            "oneLiner": "Avoiding detection — hiding code, disabling tools, clearing logs, blending in.",
            "summary": "Defense Evasion is the largest tactic in ATT&CK, because almost every other technique has a stealthy variant. A representative technique is **obfuscating files or information** so that scanners and analysts cannot read what the payload does.",
            "children": [
              {
                "id": "t1027",
                "title": "T1027 Obfuscation",
                "kind": "mechanism",
                "heading": "T1027 Obfuscated Files or Information",
                "oneLiner": "Encoding, encrypting or packing payloads and commands so they resist inspection.",
                "summary": "Attackers base64-encode commands, pack executables and encrypt strings so that static analysis and signature matching fail. The `-enc` PowerShell flag on [[L3|t1059]] is a tiny example. Detection shifts to behaviour and to decoded content at runtime; `M1049` Antivirus/Antimalware and `M1040` Behavior Prevention on Endpoint help.",
                "deeper": {
                  "title": "why evasion is everywhere",
                  "text": "Because Defense Evasion is a *goal*, not a single trick, techniques from other tactics appear here too whenever they have a stealth purpose — disabling security tools, signing malware, timestomping files. That is why the tactic has more techniques than any other and why ATT&CK coverage is never \"complete\": you cover the behaviours that matter to your threat model."
                }
              }
            ]
          }
        ]
      },
      {
        "id": "learn-network",
        "title": "Learning the network",
        "kind": "pillar",
        "tag": "Creds, recon, movement",
        "color": "gold",
        "oneLiner": "From one machine, the attacker steals credentials, maps the network and spreads to the hosts that matter.",
        "summary": "With a privileged foothold, the attacker turns outward. **Credential Access** harvests passwords and hashes, **Discovery** maps the hosts, users and shares worth reaching, and **Lateral Movement** uses stolen credentials to hop to them. This phase is where a single compromise becomes a domain-wide one.",
        "children": [
          {
            "id": "credential-access",
            "title": "Credential Access",
            "kind": "concept",
            "level": 3,
            "tag": "TA0006",
            "oneLiner": "Stealing account names, passwords, hashes and tokens to reuse elsewhere.",
            "summary": "Stolen credentials are the master key: they let an attacker move and persist while looking like a legitimate user. The classic technique is **OS credential dumping** — reading secrets out of the operating system's own stores.",
            "children": [
              {
                "id": "t1003",
                "title": "T1003 Cred Dumping",
                "kind": "mechanism",
                "heading": "T1003 OS Credential Dumping",
                "oneLiner": "Extracting credential material from the OS — LSASS memory, the SAM database, cached hashes.",
                "summary": "`T1003.001` **LSASS Memory** is the headline: on Windows, cleartext-adjacent secrets live in the LSASS process, and tools read them straight out of memory. Protecting LSASS (`M1043` Credential Access Protection, e.g. Credential Guard) and alerting on processes that open a handle to it is one of the highest-value detections a team can build.",
                "snippet": {
                  "label": "the data-source signal · lsass handle access",
                  "lang": "text",
                  "code": "Event 4656/4663 — Object: lsass.exe\n  AccessMask: 0x1410 (VM_READ | QUERY_INFORMATION)\n  Process:    \\\\Users\\\\...\\\\rundll32.exe",
                  "resultLabel": "why it matters",
                  "result": "Almost nothing legitimately reads LSASS memory. A non-system process opening it with read access is a near-certain credential-dumping alert — the single detection most ransomware intrusions would trip.",
                  "caption": "Data source: **Process** (OS API execution) and **Logon Session**."
                },
                "files": [
                  { "path": "attack.mitre.org/techniques/T1003/001", "role": "the LSASS Memory sub-technique page", "group": "Technique & tactic pages" },
                  { "path": "attack.mitre.org/datasources/DS0009", "role": "the Process data source page, including the OS API Execution component", "group": "Mitigations & data sources" },
                  { "path": "attack.mitre.org/mitigations/M1043", "role": "the Credential Access Protection mitigation page (covers Credential Guard)", "group": "Mitigations & data sources" }
                ]
              }
            ]
          },
          {
            "id": "discovery",
            "title": "Discovery",
            "kind": "concept",
            "level": 3,
            "tag": "TA0007",
            "oneLiner": "Learning the environment — hosts, users, shares, software, defences.",
            "summary": "Before moving, the attacker looks around: what machine is this, who is logged in, what can it reach? **System Information Discovery** and its siblings are built from ordinary admin commands, so they hide in the noise. Volume and sequence, not any single command, are the tell.",
            "children": [
              {
                "id": "t1082",
                "title": "T1082 System Info",
                "kind": "mechanism",
                "heading": "T1082 System Information Discovery",
                "oneLiner": "Querying the OS for host details — version, architecture, hardware, hostname.",
                "summary": "Commands like `systeminfo`, `hostname` and `uname -a` tell the attacker where they landed and whether the host is worth keeping. Individually harmless, a burst of them from one process right after execution is a strong behavioural signal. ((Data source)): **Process Creation** and **Command Execution**."
              }
            ]
          },
          {
            "id": "lateral-movement",
            "title": "Lateral Movement",
            "kind": "concept",
            "level": 3,
            "tag": "TA0008",
            "oneLiner": "Moving from the foothold to other systems, usually with stolen credentials.",
            "summary": "Lateral Movement spreads the intrusion. **Remote Services** reuse legitimate remote-access protocols — RDP, SMB, WinRM — with credentials taken in the previous step, so the traffic looks authorised. Segmentation and MFA are the main brakes.",
            "children": [
              {
                "id": "t1021",
                "title": "T1021 Remote Services",
                "kind": "mechanism",
                "heading": "T1021 Remote Services",
                "oneLiner": "Logging in to other hosts over RDP, SMB or WinRM using valid, stolen credentials.",
                "summary": "`T1021.001` **Remote Desktop Protocol** and `T1021.002` **SMB/Windows Admin Shares** carry attackers across the network as if they were administrators. Because the credentials are valid, the defence is structural: `M1030` Network Segmentation, `M1032` Multi-factor Authentication and watching **Logon Session** data for unusual source-to-destination pairs.",
                "deeper": {
                  "title": "the credential-to-movement link",
                  "text": "Lateral Movement depends on Credential Access: no stolen password, no quiet hop. That is the single most important relation on this map — break the credential-dumping step on [[L3|t1003]] and most lateral movement collapses. See the connection drawn between those two regions on the overview."
                }
              }
            ]
          }
        ]
      },
      {
        "id": "take-data",
        "title": "Taking the data",
        "kind": "pillar",
        "tag": "Collect, C2, exfil",
        "color": "blue",
        "oneLiner": "The attacker gathers the data worth stealing, keeps a channel to the outside, and moves it out.",
        "summary": "Now the operation acts on its objective of theft. **Collection** stages the data, **Command and Control** maintains the covert channel that runs the whole intrusion, and **Exfiltration** moves the data out — often over that same channel, to blend with normal traffic.",
        "children": [
          {
            "id": "collection",
            "title": "Collection",
            "kind": "concept",
            "level": 3,
            "tag": "TA0009",
            "oneLiner": "Gathering the data of interest and staging it for theft.",
            "summary": "Collection pulls the target data together — documents, databases, mailboxes — and usually compresses and encrypts it first. **Archive Collected Data** is the staging step that precedes exfiltration and sometimes gives defenders their last chance to notice.",
            "children": [
              {
                "id": "t1560",
                "title": "T1560 Archive Data",
                "kind": "mechanism",
                "heading": "T1560 Archive Collected Data",
                "oneLiner": "Compressing and often encrypting gathered data into archives before stealing it.",
                "summary": "Attackers zip or RAR the files they intend to steal, often with a password, to shrink and hide them. A large archive appearing in a staging directory, built by an unusual process, is a signal that exfiltration is imminent. ((Data source)): **File Creation** and **Command Execution**."
              }
            ]
          },
          {
            "id": "command-and-control",
            "title": "Command and Control",
            "kind": "concept",
            "level": 3,
            "tag": "TA0011",
            "oneLiner": "Maintaining a covert channel to issue commands to compromised systems.",
            "summary": "C2 is the attacker's remote control. **Application Layer Protocol** hides that control inside ordinary-looking web traffic — HTTPS to a benign-seeming domain — so it survives egress filtering. Most other tactics depend on this channel staying open.",
            "children": [
              {
                "id": "t1071",
                "title": "T1071 App-Layer C2",
                "kind": "mechanism",
                "heading": "T1071 Application Layer Protocol",
                "oneLiner": "Tunnelling command-and-control inside common protocols such as HTTP, HTTPS or DNS.",
                "summary": "`T1071.001` **Web Protocols** disguises C2 as normal HTTPS, often with domain fronting or look-alike domains from [[L3|t1583]]. Detection leans on **Network Traffic** analytics — beaconing intervals, rare destinations, JA3 fingerprints — and `M1031` Network Intrusion Prevention.",
                "files": [
                  { "path": "attack.mitre.org/techniques/T1071", "role": "the Application Layer Protocol technique page", "group": "Technique & tactic pages" },
                  { "path": "attack.mitre.org/datasources/DS0029", "role": "the Network Traffic data source page (flow and content components)", "group": "Mitigations & data sources" }
                ]
              }
            ]
          },
          {
            "id": "exfiltration",
            "title": "Exfiltration",
            "kind": "concept",
            "level": 3,
            "tag": "TA0010",
            "oneLiner": "Stealing the collected data out of the environment.",
            "summary": "Exfiltration moves the staged data off the network. The quietest option reuses the existing C2 channel so the theft hides in traffic the defender already tolerates. Volume anomalies and data-loss-prevention controls are the counters.",
            "children": [
              {
                "id": "t1041",
                "title": "T1041 Exfil over C2",
                "kind": "mechanism",
                "heading": "T1041 Exfiltration Over C2 Channel",
                "oneLiner": "Sending stolen data out over the same channel the attacker already uses for control.",
                "summary": "Rather than open a new path, the attacker ships the archive from [[L3|t1560]] back over the C2 link built on [[L3|t1071]]. One channel does both jobs, so blending is near-perfect. The tell is usually *volume*: a channel that normally trickles commands suddenly carrying megabytes outward. ((Data source)): **Network Traffic Flow**."
              }
            ]
          }
        ]
      },
      {
        "id": "cause-harm",
        "title": "Causing harm",
        "kind": "pillar",
        "tag": "Impact",
        "color": "red",
        "oneLiner": "The final phase: manipulate, interrupt or destroy — in ransomware, encrypting everything for extortion.",
        "summary": "**Impact** is what the whole intrusion was for when the goal is disruption rather than quiet theft. In a ransomware case this is the loud finale — files encrypted, backups deleted, a ransom note left — but only after every earlier phase has run.",
        "children": [
          {
            "id": "impact",
            "title": "Impact",
            "kind": "concept",
            "level": 3,
            "tag": "TA0040",
            "oneLiner": "Manipulating, interrupting or destroying systems and data to meet the attacker's goal.",
            "summary": "Impact techniques degrade, disrupt or destroy. **Data Encrypted for Impact** is the ransomware technique: encrypt files on reachable hosts and shares, then demand payment. Because it is the last and loudest step, prevention lives in the earlier phases; recovery lives in backups.",
            "children": [
              {
                "id": "t1486",
                "title": "T1486 Encrypt for Impact",
                "kind": "mechanism",
                "heading": "T1486 Data Encrypted for Impact",
                "oneLiner": "Encrypting data on victim systems to interrupt availability and extort payment.",
                "summary": "The payload encrypts documents, databases and often network shares, deletes volume shadow copies so local recovery fails, and drops a ransom note. By this point the data may already have been stolen on [[L3|t1041]] for double extortion.",
                "table": {
                  "columns": [
                    "Mitigation",
                    "ID",
                    "What it buys you"
                  ],
                  "rows": [
                    ["Data Backup", "`M1053`", "Offline, tested backups make recovery possible without paying"],
                    ["Behavior Prevention on Endpoint", "`M1040`", "Stops rapid mass-encryption patterns before they finish"],
                    ["Network Segmentation", "`M1030`", "Limits how many shares the payload can reach"]
                  ],
                  "caption": "Against Impact, detection is late; the real defence was built in the earlier phases and in `M1053` backups."
                },
                "deeper": {
                  "title": "why the loudest step is the hardest to stop",
                  "text": "By the time encryption starts, the attacker already has execution, privilege and reach. A detection here fires *during* the damage. That is the central lesson of reading ATT&CK as a chain: the cheap, reliable interventions are upstream — stop the phish on [[L3|t1566]], the credential dump on [[L3|t1003]], or the lateral movement on [[L3|t1021]] — and Impact never arrives. Backups (`M1053`) are what turn a catastrophe into an outage when it does."
                },
                "files": [
                  { "path": "attack.mitre.org/techniques/T1486", "role": "the Data Encrypted for Impact technique page", "group": "Technique & tactic pages" },
                  { "path": "attack.mitre.org/mitigations/M1053", "role": "the Data Backup mitigation page", "group": "Mitigations & data sources" }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "pipelines": [
    {
      "id": "chain",
      "title": "A ransomware intrusion, tactic by tactic",
      "level": 2,
      "steps": [
        { "tag": "TA0001", "label": "Phish the user", "node": "initial-access", "text": "A spearphishing email delivers a macro document; the user opens it." },
        { "tag": "TA0002", "label": "Run the loader", "node": "execution", "text": "The macro launches hidden, encoded PowerShell that pulls down a loader." },
        { "tag": "TA0003", "label": "Set a task", "node": "persistence", "text": "A scheduled task re-launches the loader after reboot." },
        { "tag": "TA0004", "label": "Elevate", "node": "privilege-escalation", "text": "A UAC bypass gets the loader to high integrity." },
        { "tag": "TA0006", "label": "Dump creds", "node": "credential-access", "text": "LSASS memory is read to harvest admin credentials." },
        { "tag": "TA0007", "label": "Look around", "node": "discovery", "text": "The host, domain and reachable shares are enumerated." },
        { "tag": "TA0008", "label": "Spread", "node": "lateral-movement", "text": "RDP and SMB carry the attacker to file servers with the stolen creds." },
        { "tag": "TA0009", "label": "Stage data", "node": "collection", "text": "Sensitive files are archived into a password-protected RAR." },
        { "tag": "TA0010", "label": "Exfiltrate", "node": "exfiltration", "text": "The archive leaves over the existing HTTPS C2 channel." },
        { "tag": "TA0040", "label": "Encrypt", "node": "impact", "text": "Shadow copies are deleted, files are encrypted and a ransom note is left." }
      ],
      "rule": "Each step relies on the one before it, so defence is cheapest upstream: breaking the phish, the credential dump or the lateral movement stops everything downstream, including the encryption."
    },
    {
      "id": "defend-flow",
      "title": "From a technique to a defence",
      "at": "credential-access",
      "steps": [
        { "label": "Pick the technique", "text": "Start from the ATT&CK ID you care about, e.g. `T1003.001`." },
        { "label": "Read its data sources", "text": "The technique page lists what telemetry reveals it — here, LSASS handle access." },
        { "label": "Deploy the mitigation", "text": "Apply the listed `M-id`s, such as Credential Guard, and turn on the logging." },
        { "label": "Validate with a layer", "text": "Mark the cell covered in a ((Navigator)) layer and test it with an atomic red-team run." }
      ],
      "rule": "ATT&CK turns a technique page into a work item: data source to collect, mitigation to apply, detection to prove."
    }
  ],
  "relations": [
    { "from": "initial-access", "to": "execution", "label": "delivers code to", "text": "The phishing lure's whole purpose is to get the first code running." },
    { "from": "execution", "to": "persistence", "label": "installs", "text": "The code that runs first usually plants the mechanism that brings it back." },
    { "from": "credential-access", "to": "lateral-movement", "label": "enables", "text": "Stolen credentials are what let the attacker log in to other hosts as a legitimate user." },
    { "from": "discovery", "to": "lateral-movement", "label": "targets", "text": "Discovery tells the attacker which hosts and shares are worth moving to." },
    { "from": "collection", "to": "exfiltration", "label": "feeds", "text": "Collection stages the archive that exfiltration then steals out." },
    { "from": "command-and-control", "to": "exfiltration", "label": "carries", "text": "Exfil over C2 reuses the control channel, so one link does both jobs." },
    { "from": "lateral-movement", "to": "impact", "label": "spreads to", "text": "Reaching more hosts is what lets ransomware encrypt at scale." },
    { "from": "defense-evasion", "to": "credential-access", "label": "hides", "text": "Obfuscation and tool-tampering keep the credential theft from being seen." },
    { "from": "resource-development", "to": "command-and-control", "label": "stands up", "text": "The domains and servers acquired beforehand become the C2 infrastructure." }
  ],
  "glossary": [
    { "term": "matrix", "meaning": "The grid view of ATT&CK: tactics as columns, techniques as the cells beneath them. One per domain — Enterprise, Mobile, ICS." },
    { "term": "tactic", "meaning": "An attacker's goal, the *why* of a behaviour — e.g. Persistence (TA0003). The columns of the matrix." },
    { "term": "technique", "meaning": "A way an attacker achieves a tactic, the *how*, with a stable ID such as T1566. A cell in the matrix." },
    { "term": "sub-technique", "meaning": "A more specific description of a technique, numbered with a suffix — T1566.001 Spearphishing Attachment under T1566 Phishing." },
    { "term": "procedure", "meaning": "A specific, observed implementation of a technique by a particular group or piece of software — the real-world evidence behind the cell." },
    { "term": "mitigation", "meaning": "A configuration, tool or process that prevents or reduces a technique, identified by an M-id such as M1017 User Training." },
    { "term": "data source", "meaning": "A category of telemetry (Process, Network Traffic, Logon Session) that can reveal a technique; its components say exactly what to collect." },
    { "term": "group", "meaning": "A tracked set of intrusion activity attributed to an adversary, with a G-id such as G0016 (APT29). Groups link to the techniques and software they use." },
    { "term": "software", "meaning": "Malware or a tool used in intrusions, with an S-id; ATT&CK maps each to the techniques it implements." },
    { "term": "command and control", "meaning": "Abbreviated C2: the channel an attacker uses to issue commands to compromised systems and receive results." },
    { "term": "Navigator", "meaning": "The ATT&CK Navigator, a web tool for annotating the matrix with coloured, scored layers saved as JSON and shared freely." },
    { "term": "CTI", "meaning": "Cyber Threat Intelligence: reporting on adversaries. ATT&CK is the common vocabulary CTI uses to tag what a group did." }
  ],
  "footer": "This document is the Zoom Map view explaining the public MITRE ATT&CK framework (attack.mitre.org). IDs and names follow Enterprise ATT&CK; approximate counts are hedged because the framework is versioned and grows."
}
```
