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
The example maps the greenhouse effect and climate feedbacks: 24 concepts in
6 clusters, 34 links, a 6-stop tour and 8 rebuild tasks covering all six
types. Build the demo with:

    node scripts/build-html.js skills/nthview-concept-map --example skills/nthview-concept-map/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "The Greenhouse Effect and Climate Feedbacks",
  "subtitle": "How a thin layer of gas keeps Earth warm, why adding more of it warms us further, and which loops make the warming grow",
  "theme": "nebula",
  "intro": [
    "Climate change is often explained as a list of facts. It makes far more sense as a **structure**: energy flows in and out, a few gases slow the way out, human activity adds those gases, and some consequences loop back and add even more warming.",
    "First you will see the whole map, one region at a time. Then it comes apart and you put it back together from memory. That second part is where the learning sticks."
  ],
  "root": "greenhouse-effect",
  "clusters": [
    { "id": "mechanism", "name": "How the trap works", "color": "gold", "description": "The physical chain from sunlight to a warmer surface: energy comes in as sunlight and tries to leave as infrared heat." },
    { "id": "gases", "name": "Greenhouse gases", "color": "teal", "description": "The gases that let sunlight through but absorb outgoing infrared, and the effect they produce together." },
    { "id": "sources", "name": "Human sources", "color": "red", "description": "The human activities that add greenhouse gases to the air faster than nature removes them." },
    { "id": "sinks", "name": "Carbon sinks", "color": "green", "description": "Natural stores that take carbon dioxide out of the air, slowing its build-up." },
    { "id": "feedbacks", "name": "Feedback loops", "color": "violet", "description": "Changes that warming itself sets off, which then add to (or, rarely, subtract from) the warming." },
    { "id": "impacts", "name": "Consequences", "color": "blue", "description": "What a warmer world, and a more acidic ocean, mean on the ground." }
  ],
  "nodes": [
    { "id": "greenhouse-effect", "label": "Greenhouse effect", "cluster": "gases", "definition": "Gases in the air let sunlight in but slow the escape of heat, keeping Earth about 33 °C warmer than it would otherwise be.", "note": "The natural greenhouse effect is why Earth is habitable at all: without it the average surface temperature would be about −18 °C. The problem is the **enhanced** effect: every extra molecule of CO₂ or methane slows the escape of heat a little more.", "example": "A car parked in the sun: light gets in through the glass, the heat it turns into struggles to get out." },
    { "id": "sunlight", "label": "Incoming sunlight", "cluster": "mechanism", "definition": "Short-wave energy from the Sun; on average about 340 watts reach each square metre at the top of the atmosphere.", "note": "Greenhouse gases are almost transparent to this short-wave light, so most of it passes straight through the air." },
    { "id": "surface", "label": "Warm surface", "cluster": "mechanism", "definition": "Land and ocean absorb the sunlight that is not reflected, and warm up.", "note": "About half of incoming sunlight is absorbed at the surface; the rest is reflected or absorbed in the atmosphere." },
    { "id": "infrared", "label": "Infrared radiation", "cluster": "mechanism", "definition": "The heat a warm surface gives off, as long-wave radiation we cannot see.", "note": "Every warm object glows in infrared. The warmer it is, the more it emits. This is the energy greenhouse gases intercept." },
    { "id": "back-radiation", "label": "Back-radiation", "cluster": "mechanism", "definition": "Infrared that greenhouse gases re-emit downward, warming the surface a second time.", "note": "A gas molecule that absorbs infrared re-emits it in a random direction, so roughly half heads back down." },
    { "id": "space", "label": "Escape to space", "cluster": "mechanism", "definition": "The infrared that makes it out; for a stable climate, outgoing energy must match incoming energy.", "note": "When less escapes than arrives, the planet gains energy and warms until it radiates enough to balance again." },
    { "id": "albedo", "label": "Albedo", "cluster": "mechanism", "definition": "The share of sunlight a surface reflects straight back to space. Bright ice reflects a lot; dark ocean very little.", "example": "Fresh snow reflects about 80–90% of sunlight; open ocean only about 6%." },
    { "id": "co2", "label": "Carbon dioxide (CO₂)", "cluster": "gases", "definition": "A long-lived greenhouse gas and the main driver of human-caused warming.", "note": "CO₂ has risen from about 280 parts per million before industry to over 420 today. A large share of what we emit stays in the air for centuries." },
    { "id": "methane", "label": "Methane (CH₄)", "cluster": "gases", "definition": "A shorter-lived greenhouse gas that traps about 80 times more heat than CO₂ over its first 20 years.", "note": "Methane breaks down in about a decade, so cutting it slows warming quickly." },
    { "id": "water-vapour", "label": "Water vapour", "cluster": "gases", "definition": "The most abundant greenhouse gas; how much the air holds is set by temperature.", "note": "We do not add water vapour directly in any meaningful amount. Warmer air simply holds more of it: about 7% more per degree." },
    { "id": "fossil-fuels", "label": "Burning fossil fuels", "cluster": "sources", "definition": "Coal, oil and gas burned for power, heat and transport, releasing carbon stored for millions of years.", "note": "The largest single source of human CO₂ emissions, roughly three-quarters of the total." },
    { "id": "deforestation", "label": "Deforestation", "cluster": "sources", "definition": "Clearing forests, usually for farmland, which releases their carbon and removes a sink.", "note": "It hurts twice: the trees' carbon goes into the air, and the forest stops absorbing more." },
    { "id": "agriculture", "label": "Farming & livestock", "cluster": "sources", "definition": "Cattle digestion, rice paddies and manure release methane; fertiliser releases nitrous oxide.", "example": "A single cow belches roughly 100 kg of methane a year." },
    { "id": "ocean-uptake", "label": "Ocean uptake", "cluster": "sinks", "definition": "Seawater dissolves CO₂ from the air; the ocean has absorbed about a quarter of human emissions.", "note": "This slows warming, but the dissolved CO₂ turns into carbonic acid." },
    { "id": "forests", "label": "Forests & soils", "cluster": "sinks", "definition": "Plants take in CO₂ to grow, and store carbon in wood, roots and soil.", "note": "Land ecosystems absorb roughly another quarter of human emissions, as long as they are left standing." },
    { "id": "ice-albedo", "label": "Ice–albedo feedback", "cluster": "feedbacks", "definition": "Melting ice exposes darker water and land, which absorb more sunlight and cause more melting.", "note": "One of the main reasons the Arctic is warming about three to four times faster than the global average." },
    { "id": "wv-feedback", "label": "Water-vapour feedback", "cluster": "feedbacks", "definition": "Warming puts more water vapour in the air, which traps more heat, which warms further.", "note": "Roughly doubles the warming that CO₂ alone would cause; it is the strongest feedback we know of." },
    { "id": "permafrost", "label": "Permafrost thaw", "cluster": "feedbacks", "definition": "Frozen Arctic ground thaws, and microbes break down ancient plant matter into methane and CO₂.", "note": "Permafrost holds about twice as much carbon as the atmosphere does today." },
    { "id": "clouds", "label": "Cloud feedback", "cluster": "feedbacks", "definition": "Warming changes how many clouds form and where; low clouds cool, high thin clouds warm.", "note": "The most uncertain feedback, though the best current estimate is that it adds a little warming overall." },
    { "id": "warming", "label": "Global warming", "cluster": "impacts", "definition": "The rise in Earth's average surface temperature, about 1.2 °C since the late 1800s.", "note": "A global average hides much larger changes in some places and seasons." },
    { "id": "melting-ice", "label": "Melting ice", "cluster": "impacts", "definition": "Shrinking sea ice, glaciers and ice sheets as temperatures rise.", "example": "Arctic summer sea ice has lost roughly 40% of its area since 1979." },
    { "id": "sea-level", "label": "Sea-level rise", "cluster": "impacts", "definition": "Oceans rise as land ice melts into them and as warmer water expands.", "note": "Global sea level has risen about 20 cm since 1900, and the rate is speeding up." },
    { "id": "acidification", "label": "Ocean acidification", "cluster": "impacts", "definition": "Dissolved CO₂ makes seawater more acidic, harming shell-building life such as corals and plankton.", "note": "It is a chemistry problem, not a heat problem: it would happen even if CO₂ caused no warming at all." },
    { "id": "extremes", "label": "Heatwaves & extremes", "cluster": "impacts", "definition": "More frequent and intense heatwaves, heavy downpours and droughts.", "example": "A heatwave that used to happen once in 50 years now happens about every 10." }
  ],
  "edges": [
    { "id": "e-sun-surface", "from": "sunlight", "to": "surface", "relation": "heats", "explanation": "Sunlight passes through the mostly transparent air and is absorbed by land and ocean, which warm up." },
    { "id": "e-albedo-sun", "from": "albedo", "to": "sunlight", "relation": "reflects part of", "explanation": "About 30% of incoming sunlight is reflected straight back to space by clouds, ice and bright surfaces, and never heats anything." },
    { "id": "e-surface-ir", "from": "surface", "to": "infrared", "relation": "gives off", "explanation": "Any warm object radiates heat. Earth's surface sheds its energy as long-wave infrared." },
    { "id": "e-ir-space", "from": "infrared", "to": "space", "relation": "partly escapes to", "explanation": "Some infrared slips out through gaps in the gases' absorption; the rest is caught on the way." },
    { "id": "e-ir-back", "from": "infrared", "to": "back-radiation", "relation": "returns as", "explanation": "Infrared absorbed by greenhouse gases is re-emitted in all directions, and about half comes back down." },
    { "id": "e-back-surface", "from": "back-radiation", "to": "surface", "relation": "warms further", "explanation": "The surface is warmed twice, by sunlight and by returned heat. That second helping is the greenhouse effect at work." },
    { "id": "e-co2-ir", "from": "co2", "to": "infrared", "relation": "absorbs", "explanation": "CO₂ molecules vibrate at exactly the frequencies of part of Earth's infrared glow, so they soak it up." },
    { "id": "e-co2-ghe", "from": "co2", "to": "greenhouse-effect", "relation": "strengthens", "explanation": "More CO₂ means more infrared caught on its way out, so the greenhouse effect grows stronger." },
    { "id": "e-methane-ghe", "from": "methane", "to": "greenhouse-effect", "relation": "strengthens", "explanation": "Methane absorbs infrared too, and molecule for molecule it is far more potent than CO₂." },
    { "id": "e-wv-ghe", "from": "water-vapour", "to": "greenhouse-effect", "relation": "provides most of", "explanation": "Water vapour accounts for roughly half of the natural greenhouse effect, more than any other gas." },
    { "id": "e-ghe-back", "from": "greenhouse-effect", "to": "back-radiation", "relation": "works through", "explanation": "The greenhouse effect is not a lid; it works by gases sending part of the outgoing heat back down." },
    { "id": "e-ghe-warming", "from": "greenhouse-effect", "to": "warming", "relation": "when enhanced, drives", "explanation": "Strengthen the effect and less heat escapes than arrives, so the planet warms until balance returns at a higher temperature." },
    { "id": "e-fossil-co2", "from": "fossil-fuels", "to": "co2", "relation": "emits", "explanation": "Burning coal, oil and gas returns carbon that was locked underground for millions of years, all within a few centuries." },
    { "id": "e-defor-co2", "from": "deforestation", "to": "co2", "relation": "releases", "explanation": "Burning or rotting cleared trees puts their stored carbon into the air as CO₂." },
    { "id": "e-defor-forests", "from": "deforestation", "to": "forests", "relation": "shrinks", "explanation": "Every cleared hectare is a hectare that no longer absorbs CO₂." },
    { "id": "e-agri-methane", "from": "agriculture", "to": "methane", "relation": "emits", "explanation": "Microbes in cattle stomachs, flooded rice fields and manure heaps produce methane." },
    { "id": "e-ocean-co2", "from": "ocean-uptake", "to": "co2", "relation": "removes some", "explanation": "The ocean dissolves about a quarter of the CO₂ we emit, which slows its build-up in the air." },
    { "id": "e-forests-co2", "from": "forests", "to": "co2", "relation": "absorb", "explanation": "Growing plants pull CO₂ out of the air through photosynthesis and store the carbon." },
    { "id": "e-ocean-acid", "from": "ocean-uptake", "to": "acidification", "relation": "causes", "explanation": "CO₂ dissolved in seawater forms carbonic acid. The sink that slows warming is also the source of acidification." },
    { "id": "e-acid-warming", "from": "acidification", "to": "warming", "relation": "contrasts with", "explanation": "Both come from CO₂, but acidification is chemistry, not heat: it would happen even if CO₂ trapped no warmth at all." },
    { "id": "e-warming-ice", "from": "warming", "to": "melting-ice", "relation": "causes", "explanation": "Warmer air and water melt sea ice, glaciers and the edges of the great ice sheets." },
    { "id": "e-ice-icealb", "from": "melting-ice", "to": "ice-albedo", "relation": "triggers", "explanation": "Each patch of ice that melts uncovers darker sea or rock underneath, starting the ice–albedo loop." },
    { "id": "e-icealb-albedo", "from": "ice-albedo", "to": "albedo", "relation": "lowers", "explanation": "Dark water and rock reflect far less sunlight than bright ice, so Earth's overall albedo goes down." },
    { "id": "e-icealb-warming", "from": "ice-albedo", "to": "warming", "relation": "amplifies", "explanation": "Less reflection means more sunlight absorbed, which means more warming and more melting: a self-reinforcing loop." },
    { "id": "e-warming-wvf", "from": "warming", "to": "wv-feedback", "relation": "triggers", "explanation": "Warmer air holds about 7% more water vapour per degree, which sets the water-vapour feedback going." },
    { "id": "e-wvf-wv", "from": "wv-feedback", "to": "water-vapour", "relation": "raises", "explanation": "The feedback is simply more water vapour in the air, and water vapour is itself a greenhouse gas." },
    { "id": "e-warming-perma", "from": "warming", "to": "permafrost", "relation": "triggers", "explanation": "As the Arctic warms, ground that has been frozen for thousands of years starts to thaw each summer." },
    { "id": "e-perma-methane", "from": "permafrost", "to": "methane", "relation": "releases", "explanation": "Thawed soil lets microbes digest ancient plant matter, and in waterlogged ground they make methane." },
    { "id": "e-perma-co2", "from": "permafrost", "to": "co2", "relation": "releases", "explanation": "Where thawed soil is drier, microbes break the old carbon down into CO₂ instead." },
    { "id": "e-warming-clouds", "from": "warming", "to": "clouds", "relation": "changes", "explanation": "A warmer, wetter atmosphere changes how many clouds form, how high, and where." },
    { "id": "e-clouds-warming", "from": "clouds", "to": "warming", "relation": "may amplify or damp", "explanation": "Low clouds reflect sunlight and cool; high thin clouds trap heat and warm. The net effect is probably a small extra warming." },
    { "id": "e-ice-sea", "from": "melting-ice", "to": "sea-level", "relation": "raises", "explanation": "Melting land ice (glaciers, Greenland, Antarctica) adds water to the ocean. Melting sea ice does not, because it already floats." },
    { "id": "e-warming-sea", "from": "warming", "to": "sea-level", "relation": "expands water", "explanation": "Water takes up more room as it warms; this thermal expansion is about a third of sea-level rise so far." },
    { "id": "e-warming-extremes", "from": "warming", "to": "extremes", "relation": "intensifies", "explanation": "A small shift in the average makes the hot extremes much more frequent, and warmer air carries more water into downpours." }
  ],
  "tour": [
    { "title": "The big idea", "text": "At the centre is the **greenhouse effect**: certain gases slow the escape of heat. Turn it up, and the planet warms. Everything else on this map either explains that link, feeds it, or follows from it.", "focus": ["greenhouse-effect", "warming", "e-ghe-warming"] },
    { "title": "How the trap works", "text": "Sunlight heats the surface. The warm surface glows in **infrared**. Some escapes to space; the rest is caught by gases and sent back down as back-radiation, warming the surface a second time.", "focus": ["sunlight", "surface", "infrared", "back-radiation", "space", "albedo", "e-sun-surface", "e-surface-ir", "e-ir-space", "e-ir-back", "e-back-surface", "e-albedo-sun"] },
    { "title": "The gases that do it", "text": "CO₂, methane and water vapour all absorb infrared. Water vapour does the most work, but CO₂ is the one we are turning up, and it lasts for centuries.", "focus": ["co2", "methane", "water-vapour", "greenhouse-effect", "infrared", "e-co2-ghe", "e-methane-ghe", "e-wv-ghe", "e-co2-ir", "e-ghe-back"] },
    { "title": "Where the extra comes from", "text": "Burning fossil fuels, clearing forests and farming add gases faster than the ocean and the land can take them back out. The sinks soak up about half of our CO₂; the other half piles up.", "focus": ["fossil-fuels", "deforestation", "agriculture", "co2", "methane", "ocean-uptake", "forests", "e-fossil-co2", "e-defor-co2", "e-agri-methane", "e-ocean-co2", "e-forests-co2", "e-defor-forests"] },
    { "title": "Loops that amplify", "text": "Warming sets off changes that cause **more** warming: melting ice darkens the surface, warmer air holds more water vapour, thawing permafrost releases methane. Clouds are the wild card.", "focus": ["warming", "melting-ice", "ice-albedo", "wv-feedback", "permafrost", "clouds", "albedo", "water-vapour", "methane", "e-warming-ice", "e-ice-icealb", "e-icealb-albedo", "e-icealb-warming", "e-warming-wvf", "e-wvf-wv", "e-warming-perma", "e-perma-methane", "e-warming-clouds", "e-clouds-warming"] },
    { "title": "What it means for us", "text": "A warmer world brings rising seas and fiercer extremes. And the ocean pays twice: the CO₂ it absorbs turns its water more acidic, a harm that **contrasts with** warming because it is chemistry, not heat.", "focus": ["warming", "melting-ice", "sea-level", "extremes", "acidification", "ocean-uptake", "e-ice-sea", "e-warming-sea", "e-warming-extremes", "e-ocean-acid", "e-acid-warming"] }
  ],
  "rebuild": {
    "intro": "Three concepts have floated free of their clusters, a few labels have gone blank, one link has vanished and one now says something false. Put the map back together from memory.",
    "tasks": [
      { "id": "place-three", "type": "place", "nodes": ["methane", "forests", "permafrost"], "hint": "Ask what each one **does**: is it a gas that traps heat, something that soaks up carbon, or a change that warming sets off?", "why": "Clusters group concepts by role. Methane is a greenhouse gas; forests and soils store carbon, so they are a sink; thawing permafrost is a feedback, because warming starts it and it then adds more warming." },
      { "id": "order-trap", "type": "order", "prompt": "Put the steps of the heat trap in order, from the Sun to the second warming.", "nodes": ["sunlight", "surface", "infrared", "back-radiation"], "hint": "Start with what arrives from the Sun, and end with what comes back down.", "why": "Sunlight is short-wave and passes through the air; the ground absorbs it and re-emits long-wave infrared; gases catch some of that and send it back down. More gas means more comes back, so the surface warms." },
      { "id": "rel-forests", "type": "relation", "edge": "e-forests-co2", "hint": "Think about what a growing tree is made of, and where that carbon came from.", "why": "Plants build themselves out of carbon taken from CO₂ in the air. That is what makes forests and soils a sink.",
        "options": [
          { "label": "absorb", "correct": true },
          { "label": "emit", "why": "Forests only release CO₂ when they burn, rot or are cleared; that link belongs to deforestation. A standing, growing forest takes CO₂ in." },
          { "label": "strengthen", "why": "That is what greenhouse gases do to the greenhouse effect. Forests weaken it, by taking CO₂ out of the air." },
          { "label": "contrasts with", "why": "They are directly linked, not merely compared: forests change how much CO₂ is in the air." }
        ] },
      { "id": "connect-permafrost", "type": "connect", "edge": "e-perma-methane", "hint": "Frozen Arctic ground holds old plant matter. Which gas do microbes make from it when the ground thaws and stays waterlogged?", "why": "Thawing permafrost lets microbes break down ancient organic matter, releasing methane (and CO₂). That is why it is a feedback: warming causes the thaw, and the thaw causes more warming." },
      { "id": "spot-albedo", "type": "spot", "edge": "e-icealb-albedo", "wrongRelation": "raises", "candidates": ["e-icealb-albedo", "e-ice-sea", "e-warming-ice", "e-icealb-warming"], "hint": "Is open ocean darker or lighter than ice?", "why": "Ice is bright and reflects most sunlight; open water and bare ground are dark. As ice melts, Earth's albedo goes **down**, so more sunlight is absorbed. That is exactly what makes this loop amplify warming." },
      { "id": "label-ocean", "type": "label", "node": "ocean-uptake", "hint": "It sits with the carbon sinks, and it is also the cause of acidification.", "why": "The ocean dissolves about a quarter of the CO₂ we emit. That slows warming, but the dissolved CO₂ forms carbonic acid, which is why the same concept links to both the sinks and acidification.",
        "options": [
          { "label": "Ocean uptake", "correct": true },
          { "label": "Sea-level rise", "why": "Sea-level rise is a consequence of melting land ice and warming water; it does not take any CO₂ out of the air." },
          { "label": "Water vapour", "why": "Water vapour is a gas in the air, not the sea taking up carbon, and it adds to the greenhouse effect rather than removing CO₂." },
          { "label": "Cloud feedback", "why": "Clouds change how much sunlight is reflected; they do not remove CO₂, and they sit with the feedbacks, not the sinks." }
        ] },
      { "id": "rel-clouds", "type": "relation", "edge": "e-clouds-warming", "hint": "There are two kinds of clouds with opposite effects. What does that make the overall effect?", "why": "Low, thick clouds reflect sunlight and cool; high, thin clouds trap heat and warm. Because both change as the climate warms, scientists can only say the net effect is probably a small amplification.",
        "options": [
          { "label": "may amplify or damp", "correct": true },
          { "label": "always cools", "why": "Low clouds do cool, but high thin clouds warm; the net effect is uncertain and probably slightly warming." },
          { "label": "has no effect on", "why": "Clouds have large effects in both directions; the uncertainty is about which wins, not whether they matter." }
        ] },
      { "id": "rel-acid", "type": "relation", "edge": "e-acid-warming", "hint": "Both start with CO₂. Is acidification caused by heat?", "why": "Ocean acidification and global warming share a cause (CO₂) but work in completely different ways: one is chemistry in the water, the other is trapped heat. That is a contrast, not a cause.",
        "options": [
          { "label": "contrasts with", "correct": true },
          { "label": "is caused by", "why": "Warming does not make water acidic; dissolved CO₂ does. Acidification would happen even if CO₂ trapped no heat." },
          { "label": "causes", "why": "A more acidic ocean harms marine life, but it does not heat the planet." }
        ] }
    ]
  },
  "reflection": {
    "prompt": "If you could keep only three links from this map, which would they be?",
    "keyEdges": [
      { "edge": "e-fossil-co2", "why": "This is the human lever. Most of the extra greenhouse effect since the 1800s traces back to this single link, and it is the one we can switch off." },
      { "edge": "e-co2-ghe", "why": "This turns emissions into trapped heat. Because CO₂ lasts for centuries, what we emit accumulates: the climate responds to the total, not the yearly amount." },
      { "edge": "e-icealb-warming", "why": "Feedbacks are why a modest push becomes a large change. Take this kind of link away and warming would be roughly half as big." }
    ],
    "candidates": ["e-fossil-co2", "e-co2-ghe", "e-icealb-warming", "e-sun-surface", "e-ghe-warming", "e-ocean-co2", "e-warming-sea", "e-warming-extremes", "e-perma-methane", "e-clouds-warming", "e-ocean-acid", "e-back-surface"],
    "closing": "Cause, mechanism, amplifier: with those three links in mind you can rebuild most of the rest of the map yourself."
  },
  "glossary": [
    { "term": "Albedo", "meaning": "The fraction of sunlight a surface reflects. 0 is perfectly dark, 1 is a perfect mirror." },
    { "term": "Infrared", "meaning": "Long-wave radiation that warm objects give off; invisible to us, but felt as heat." },
    { "term": "Greenhouse gas", "meaning": "A gas that lets sunlight through but absorbs outgoing infrared: mainly water vapour, CO₂, methane and nitrous oxide." },
    { "term": "Feedback", "meaning": "A change that a process causes and that then acts back on the process. **Amplifying** feedbacks make it bigger; damping ones make it smaller." },
    { "term": "Carbon sink", "meaning": "Anything that takes up more carbon than it releases, such as the ocean, forests and soils." },
    { "term": "Permafrost", "meaning": "Ground that has stayed frozen for at least two years in a row, often for thousands." },
    { "term": "Back-radiation", "meaning": "Infrared emitted downward by the atmosphere towards the surface." },
    { "term": "ppm", "meaning": "Parts per million: 420 ppm of CO₂ means 420 of every million air molecules are CO₂." }
  ],
  "summary": {
    "heading": "The map, rebuilt",
    "paragraphs": [
      "Sunlight comes in, infrared heat tries to leave, and greenhouse gases send part of it back. Humans have been adding those gases faster than the sinks can remove them, so the planet warms until it can shed as much energy as it receives.",
      "Warming then feeds itself through melting ice, extra water vapour and thawing permafrost. Seeing it as a map makes the key point plain: there is one main lever, and it is upstream of everything else."
    ]
  }
}
```
