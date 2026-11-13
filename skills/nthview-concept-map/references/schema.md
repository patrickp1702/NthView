# Concept Map data schema — schemaVersion 1

## Overview
The data describes one idea as a concept map: concepts (nodes) grouped into
coloured clusters, joined by labelled, directed relationships (edges), around
one root concept. It also scripts the three learning phases the view plays: a
guided tour that lights up one region at a time, a rebuild in which the map is
taken apart and the learner puts it back from memory (six kinds of task), and
a reflection in which the learner picks the three links that matter most and
compares them with the author's key links. Nothing is scored; every slip is
explained and listed again on the review screen.

The renderer lays the map out itself with a seeded force-directed layout, so
the same data always gives the same picture; the data never carries
coordinates. Text fields accept one inline mark-up, `**bold**`; nothing else
is interpreted. Character limits count JavaScript string length, so one emoji
counts as 2.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–80 chars | The idea being mapped; intro heading, top bar and page title |
| `subtitle` | string | no | ≤200 chars | One line under the intro heading |
| `theme` | string | no | one of `nebula`, `blueprint`, `atlas`, `botanic`, `prism` | Visual theme (see Themes). When omitted, one is derived from the title so different maps look different |
| `intro` | string[] | no | 1–3 items, each 1–500 chars | Paragraphs on the start screen |
| `root` | string | yes | a `nodes[].id` | The central concept; pinned at the centre of the layout and styled larger |
| `clusters` | array | yes | 2–8 Cluster objects | The regions of the map |
| `nodes` | array | yes | 6–60 Node objects | The concepts |
| `edges` | array | yes | 5–120 Edge objects | The labelled, directed relationships |
| `tour` | array | yes | 1–20 Tour step objects | The guided tour, in order |
| `rebuild` | object | yes | see Rebuild | The take-apart-and-rebuild phase |
| `reflection` | object | yes | see Reflection | The "three links that matter most" step |
| `glossary` | array | no | 0–80 Glossary objects | Key terms; opens from the top bar and is shown on the review screen |
| `summary` | object | no | see Summary | Heading and paragraphs for the review screen |

## Themes
Every theme sets the backdrop (gradient, drifting colour fields and a faint
pattern that moves with the map), glass panel surfaces, accent pair, display
typeface, corner radius and the eight cluster colours. Each has a light and a
dark variant, chosen by the reader's system setting; each variant stays on one
side of brightness, so text is always near-black on light surfaces or
near-white on dark ones. Cluster colours are tuned per variant so all eight
stay distinct from one another and readable as text on the panels.

| Theme | Native mood | Other variant | Type | Pattern | Suits |
| :- | :- | :- | :- | :- | :- |
| `nebula` | Deep indigo space, violet and cyan light | Lilac-white | Outfit / Inter | Star field | Science, space, systems, anything "big picture" |
| `blueprint` | Navy drafting table, cyan ink | Pale engineering blue | Space Grotesk / Inter | Fine grid | Engineering, software, architecture, processes |
| `atlas` | Warm parchment, ink and terracotta | Dark leather | Fraunces / Inter | Graticule | History, law, politics, geography, the humanities |
| `botanic` | Pale sage and cream, leaf green and amber | Night forest | Outfit / Inter | Seed dots | Biology, health, ecology, food |
| `prism` | Bright white, magenta and blue | Ink black | Space Grotesk / Inter | Fine dots | Economics, data, business, design, clean modern topics |

`nebula` and `blueprint` are dark by default and turn light for readers who
prefer light; `atlas`, `botanic` and `prism` are light by default and turn dark.

## Cluster colours
`clusters[].color` names a colour role, not a hex value, so the theme can
tune it: `red`, `orange`, `gold`, `green`, `teal`, `blue`, `violet`, `pink`.
When omitted, roles are assigned by cluster position in the order teal,
violet, gold, red, blue, green, orange, pink (neighbours far apart on the
colour wheel). Every cluster is also named on its hull and in the legend, so
colour is never the only cue.

## Cluster object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among clusters | Referenced by `nodes[].cluster` |
| `name` | string | yes | 1–40 chars | Shown on the hull, in the legend and on the cluster buttons of `place` tasks |
| `color` | string | no | one of the eight colour roles | Hull, node dot and legend colour (see Cluster colours) |
| `description` | string | no | ≤240 chars | What the cluster groups together; shown when the learner opens the cluster from the legend |

## Node object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among nodes | Stable key |
| `label` | string | yes | 1–48 chars | Text on the node; up to about 22 characters fit on one line, longer labels wrap to two or three |
| `definition` | string | yes | 1–240 chars | One or two sentences; the first thing the side panel shows |
| `note` | string | no | ≤800 chars | The longer explanation in the side panel |
| `cluster` | string | yes | a `clusters[].id` | The region the node belongs to |
| `example` | string | no | ≤300 chars | A concrete instance, shown as a callout in the side panel |

## Edge object
Edges are directed and read as a sentence: *from* — *relation* → *to*
("Burning fossil fuels **emits** Carbon dioxide").

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among edges, different from every node id | Referenced by the tour, tasks and reflection |
| `from` | string | yes | a `nodes[].id` | Where the arrow starts |
| `to` | string | yes | a `nodes[].id`, not `from` | Where the arrow points |
| `relation` | string | yes | 1–32 chars | The label on the arrow: a verb phrase such as "causes", "is part of", "contrasts with" |
| `explanation` | string | yes | 1–400 chars | Why the relationship holds; shown in the side panel and after rebuild tasks |

## Tour step object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–80 chars | Heading of the stop |
| `text` | string | yes | 1–500 chars | One to three sentences shown while the region is lit |
| `focus` | string[] | yes | 1–40 ids, each a node id or an edge id, no repeats | What lights up. The endpoints of listed edges light up too. When no edge is listed, every edge between listed nodes lights up. The camera glides to fit the lit region |

## Rebuild object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `intro` | string | no | ≤300 chars | Shown when the map comes apart; a default sentence is used when omitted |
| `tasks` | array | yes | 1–30 Task objects | Played in order |

When the rebuild starts, the pieces of **every** task come apart at once (the
map visibly falls apart) and each task puts its own piece back when it is
solved or skipped. What "taking apart" means per type:

| Type | Name shown | What is taken apart | What the learner does |
| :- | :- | :- | :- |
| `place` | Sort into clusters | Its `nodes` float loose below the map, uncoloured; their edges disappear | Drags each node onto its cluster's hull, or taps the node and then a cluster button |
| `relation` | Name the link | The label of `edge` becomes "?" | Picks the relation from `options` |
| `connect` | Draw the missing link | `edge` disappears | Taps the source node and then the target node on the map (or picks both from two lists) |
| `spot` | Spot the wrong link | `edge` shows `wrongRelation` instead of its real label | Picks the wrong one among the highlighted `candidates` |
| `order` | Put the process in order | The edges between its `nodes` disappear | Reorders the shuffled steps (drag or arrow buttons), then checks |
| `label` | Name the concept | The label of `node` becomes "?" | Picks the label from `options` |

## Task object
Common fields for every task:

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among tasks | Stable key |
| `type` | string | yes | one of `place`, `relation`, `connect`, `spot`, `order`, `label` | The kind of task (table above) |
| `prompt` | string | no | ≤240 chars | The question; a sensible default per type is used when omitted |
| `hint` | string | yes | 1–300 chars | Revealed by "Show a hint". For `connect` the source node also pulses |
| `why` | string | yes | 1–500 chars | The explanation: shown after the task is solved or skipped, on slips that have no more specific explanation, and in the review |

Fields by type:

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `nodes` (`place`) | string[] | yes | 1–6 node ids, no repeats, never `root` | The nodes the learner places; each must go into its own `cluster` |
| `nodes` (`order`) | string[] | yes | 3–8 node ids, no repeats | The steps **in the correct order**; the view shuffles them |
| `node` (`label`) | string | yes | a node id | The node whose label is blanked |
| `edge` (`relation`, `connect`, `spot`) | string | yes | an edge id | The edge the task is about |
| `options` (`relation`, `label`) | array | yes | 2–6 Option objects, exactly one `correct`, labels unique | The choices; shuffled by the view |
| `wrongRelation` (`spot`) | string | yes | 1–32 chars, different from the edge's `relation` | The false label shown on `edge` |
| `candidates` (`spot`) | string[] | yes | 2–6 edge ids, no repeats, must include `edge` | The highlighted edges the learner chooses from |

## Option object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–48 chars | The choice as shown. The correct option must read exactly the edge's `relation` (`relation` task) or the node's `label` (`label` task), ignoring case and surrounding spaces |
| `correct` | boolean | no | default `false` | Exactly one option per task is `true` |
| `why` | string | no | ≤400 chars | Why this option is wrong; shown when the learner picks it. Falls back to the task's `why` |

## Reflection object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | no | ≤200 chars | Default "Which three links matter most?" |
| `keyEdges` | array | yes | exactly 3 Key edge objects, different edges | The author's canonical three |
| `candidates` | string[] | no | 4–24 edge ids, no repeats, must include every key edge | The edges the learner picks from; all edges when omitted (list them for maps with more than about 15 edges) |
| `closing` | string | no | ≤500 chars | Shown after the key links are revealed |

Key edge object: `edge` (string, required, an edge id), `why` (string,
required, 1–500 chars: why this link carries the map).

## Glossary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–60 chars | The term |
| `meaning` | string | yes | 1–300 chars | Plain-language meaning |

## Summary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤80 chars, default "The map, rebuilt" | Review-screen heading |
| `paragraphs` | string[] | yes | 1–4 items, each 1–600 chars | What the map adds up to |

## Cross-field rules
- `clusters[].id`, `nodes[].id`, `edges[].id` and `rebuild.tasks[].id` are each unique within their list, and no edge id equals a node id.
- `root` must be a `nodes[].id`.
- Every `nodes[i].cluster` must be a `clusters[].id`.
- Every `edges[i].from` and `edges[i].to` must be a `nodes[].id`, and they must differ.
- No two edges share the same `from` and `to` (one relation per direction; an edge each way is allowed).
- Every `tour[i].focus[j]` must be a node id or an edge id, with no repeats within one step.
- Every node or edge id a task names (`nodes`, `node`, `edge`, `candidates`) must exist.
- `place` tasks may not include `root`.
- A `relation` or `label` task has exactly one option with `correct: true`, its label equals the edge's `relation` or the node's `label` (ignoring case and surrounding spaces), and option labels are unique within the task.
- A `spot` task's `wrongRelation` differs from the edge's `relation`, and its `candidates` include its `edge`.
- Each node is taken apart by at most one `place`, `order` or `label` task, and each edge by at most one `relation`, `connect` or `spot` task (as its `edge`).
- **Visibility order.** Pieces come apart together and return task by task, so a task may not rely on something a *later* task still holds apart: the edge of a `relation` or `spot` task, each `spot` candidate, and both endpoints of a `connect` edge must not touch a node of a later `place` task; those edges must not lie between two nodes of a later `order` task, and must not be the edge of a later `connect` task. A `spot` candidate (other than its own edge) must also not be the edge of a later `relation` or `spot` task, whose label is still blank or false. Fix by moving the task after the one that holds the piece.
- `reflection.keyEdges` has exactly 3 items naming 3 different existing edges; `reflection.candidates`, when given, are existing edges, without repeats, and include all 3 key edges.

## Warnings (non-blocking)
- Two clusters with the same `color`, or a cluster with no nodes.
- Two nodes with the same label (ignoring case).
- A node with no edges, or a map that falls apart into separate pieces.
- An edge `relation` longer than 24 characters (clutters the map).
- Fewer than 3 tour steps, or a cluster that no tour step focuses on.
- Four or more tasks using fewer than 3 different task types.
- A wrong option without `why` (the task's `why` is shown instead).
- Consecutive steps of an `order` task that no edge links (in either direction).

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
