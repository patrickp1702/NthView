# System Evolution data schema — schemaVersion 1

## Overview
The data describes one system that changes shape step by step under pressure:
a cast of **components** (each a preset kind with its own isometric look and
icon) joined by **links**, a handful of **metrics** shown in a live strip, the
**packet** types that travel the links, and an ordered list of **steps**. Each
step is a complete snapshot: which components and links are present and in
what state (healthy, busy, overloaded, failed, draining, dimmed, with a load
bar or a badge), which packets flow along which paths and how they end, the
value of every metric, the text beside the diagram, what changed, and which
learning objective it ticks.

Text fields (`body`, callouts, takeaways, changes) accept three inline
mark-ups: `**bold**` (a highlighted term), `` `code` `` and `*italic*`.
Nothing else is interpreted. Character limits count JavaScript string length.
Ids are lowercase kebab-case (`login-api`, `rate-limit`) and unique within
their list.

Positions are optional. Components without `at` are laid out automatically on
an isometric grid from the links: sources on the left, each component one
column after the furthest component that links into it, rows centred on the
components that feed them. The layout is the same in every step, so nothing
jumps; the camera pans and zooms to fit what a step shows.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Page heading, e.g. "Defending a Login Against Credential Stuffing" |
| `summary` | string | no | ≤200 chars | One line under the title |
| `breadcrumb` | string[] | no | 0–3 items, each 1–40 chars | Shown above the title, joined by " / ", e.g. `["Security", "Identity"]` |
| `minutes` | integer | no | 1–600 | Reading time shown as a chip |
| `level` | string | no | `beginner`, `intermediate` or `advanced` | Level chip |
| `note` | string | no | ≤240 chars | Small print under the diagram, e.g. "All numbers are illustrative." |
| `objectives` | array | yes | 1–8 Objective objects | The "You'll learn" checklist |
| `metrics` | array | yes | 1–6 Metric objects | The live metric strip, in display order |
| `packets` | array | no | 0–8 Packet objects | Kinds of thing that travel the links; listed in the legend |
| `components` | array | yes | 1–30 Component objects | Every component that appears in any step |
| `links` | array | no | 0–60 Link objects | Every connection that appears in any step |
| `steps` | array | yes | 2–30 Step objects | The story, in order; the last is usually the recap |
| `sources` | array | no | 0–12 Source objects | Where the facts come from; listed under the objectives |

## Objective object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among objectives | Referenced by `steps[i].objectives` |
| `text` | string | yes | 1–120 chars | What the learner will be able to explain |

## Metric object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among metrics | Key in `steps[i].metrics` |
| `label` | string | yes | 1–24 chars | Shown in capitals above the value, e.g. "Takeovers / hour" |
| `icon` | string | no | an icon name (see Icons), default `gauge` | Small icon before the label |
| `unit` | string | no | ≤12 chars | Appended to numbers, e.g. `ms`, `/min`; ignored by `percent` and `duration` |
| `format` | string | no | `number` (default), `compact`, `percent` or `duration` | `number` groups thousands (`12,400`); `compact` shortens (`12.4k`, `1.2M`); `percent` appends `%`; `duration` reads the value as milliseconds and shows `ms`, `s` or `min` |
| `decimals` | integer | no | 0–3, default 0 | Maximum decimal places shown |
| `better` | string | no | `lower`, `higher` or `none` (default) | Which direction is good; drives the coloured edge |
| `warn` | number | no | needs `better` ≠ `none` | From this value on the chip turns amber (at or above it for `lower`, at or below it for `higher`) |
| `bad` | number | no | needs `better` ≠ `none` | From this value on the chip turns red; with no thresholds a good-direction metric shows no colour |

## Packet object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among packets | Referenced by `steps[i].flows[j].packet` |
| `label` | string | yes | 1–24 chars | Legend text, e.g. "Stuffing attempt" |
| `shape` | string | no | `dot` (default), `square`, `ring` or `diamond` | How one packet looks |
| `tone` | string | no | a tone name (see Tones), default `orange` | Packet colour |

## Component object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among components | Referenced by links and steps |
| `kind` | string | yes | a kind name (see Kinds) | Decides the shape, icon and colour |
| `label` | string | yes | 1–24 chars | Name on the block (wraps to two lines) or in the pill under a crowd, device or tile |
| `sublabel` | string | no | ≤28 chars | Second, smaller line, e.g. "10 tries/min per IP" |
| `tone` | string | no | a tone name (see Tones) | Overrides the kind's colour |
| `icon` | string | no | an icon name (see Icons) | Overrides the kind's icon |
| `at` | integer[2] | no | `[col, row]`, each 0–15 | Fixed grid cell; columns run up and to the right, rows down and to the right. Omit to place automatically |
| `count` | integer | no | 3–24, default 12; only for `users` and `botnet` | Number of figures drawn on a crowd |

## Link object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among links | Referenced by `steps[i].links` and flows |
| `from` | string | yes | a component id | Start; the arrow points away from it |
| `to` | string | yes | a component id, not `from` | End |
| `label` | string | no | ≤40 chars | Pill on the link, e.g. "POST /login" |
| `style` | string | no | `solid` (default) or `dashed` | Line style when active |
| `arrow` | string | no | `forward` (default), `both` or `none` | Arrowheads |

## Step object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among steps | Also the URL hash of the step (`#rate-limit`) |
| `type` | string | yes | `context`, `problem`, `technique`, `solution`, `tradeoff`, `case` or `recap` | Badge beside "STEP n / N" |
| `short` | string | yes | 1–20 chars | Name under the step dots and on the Next button ("Next: Rate limit") |
| `title` | string | yes | 1–90 chars | Heading of the step panel |
| `body` | string[] | yes | 1–4 items, each 1–600 chars | Short paragraphs; keep them about the diagram |
| `callouts` | array | no | 0–2 Callout objects | Boxed asides |
| `takeaways` | string[] | no | 0–8 items, each 1–200 chars | Ticked list, mostly for the recap |
| `changes` | array | no | 0–6 Change objects | The "What changed" list |
| `objectives` | string[] | no | 0–4 objective ids | Objectives this step teaches; they tick once the learner reaches it |
| `components` | object | yes | at least one key; each key a component id, each value a ComponentState object (`{}` for defaults) | Exactly the components shown in this step |
| `links` | object | no | each key a link id, each value a LinkState object | Exactly the links shown in this step |
| `flows` | array | no | 0–12 Flow objects | Packets moving in this step |
| `focus` | string[] | no | component ids shown in this step | Extra spotlight; components new in this step are spotlit anyway |
| `metrics` | object | yes | one key per metric id, each value a MetricValue | The strip's values at this step |
| `breakdown` | object | no | a Breakdown object | A table card over the diagram, e.g. "Where the time went" |

## ComponentState object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `status` | string | no | `ok` (default), `busy`, `overloaded`, `failed`, `off` or `dim` | `busy` amber edge; `overloaded` red tint; `failed` grey with a red cross; `off` faded (draining, standby); `dim` background context |
| `load` | number | no | 0–100 | Load bar above the component, green under 70, amber under 90, red from 90 |
| `badge` | string | no | 1–28 chars | Pill above the component, e.g. "23 queued", "out of pool" |
| `badgeTone` | string | no | `neutral` (default), `good`, `warn`, `bad` or `info` | Badge colour |
| `label` | string | no | 1–24 chars | Renames the component from this step on display, e.g. "Passkeys" |
| `sublabel` | string | no | ≤28 chars | Replaces the sublabel for this step; `""` hides it |

## LinkState object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `state` | string | no | `active` (default), `faint` or `down` | `faint` is a past or background path (dashed, light); `down` is broken (dashed grey). A link to a failed component is drawn down |
| `label` | string | no | ≤40 chars | Replaces the link's label for this step; `""` hides it |

## Flow object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `link` | string | one of `link`, `path` | a link id shown in this step | A packet stream along one link |
| `path` | string[] | one of `link`, `path` | 1–6 link ids shown in this step, each consecutive pair sharing a component | A packet stream that travels several links in a row |
| `packet` | string | yes | a packet id | What travels |
| `rate` | integer | no | 1–5, default 2 | How many packets: 1 a trickle, 5 a flood |
| `outcome` | string | no | `ok` (default), `fail`, `blocked` or `held` | How each packet ends: arrives, fails with a red cross, is stopped at the edge of the last component, or waits there in a queue |
| `reverse` | boolean | no | default `false` | Travel the path backwards (a response) |

## MetricValue
A number, a string of 1–16 characters (shown as is, such as `"timeout"`), or
an object:

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `value` | number or string | yes | string 1–16 chars | The value |
| `level` | string | no | `good`, `warn`, `bad` or `none` | Overrides the colour the thresholds give |

## Callout object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kind` | string | yes | `key`, `tip` or `warn` | KEY IDEA, GOOD TO KNOW or WATCH OUT |
| `title` | string | no | 1–24 chars | Replaces the default heading |
| `text` | string | yes | 1–320 chars | The aside |

## Change object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `mark` | string | yes | `add`, `change` or `remove` | Marker `+`, `~` or `−` |
| `text` | string | yes | 1–140 chars | e.g. "Takeovers 1,200 → 180 an hour" |

## Breakdown object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–48 chars | Card heading |
| `unit` | string | no | ≤12 chars | Appended to every value |
| `rows` | array | yes | 1–8 BreakdownRow objects | The parts |
| `total` | object | yes | `{ "label": 1–32 chars, "value": number }` | The highlighted total row |
| `note` | string | no | ≤140 chars | Footnote under the table |

## BreakdownRow object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–48 chars | The part |
| `value` | number | yes | finite | Its amount |
| `highlight` | boolean | no | default `false` | Emphasise this row |

## Source object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–160 chars | Title and publisher |
| `url` | string | no | `https://` URL, ≤500 chars | Link |

## Kinds
Each kind fixes a shape, an icon and a tone (overridable with `icon` and `tone`).

| Shape | Kinds |
| :- | :- |
| crowd (figures on a slab) | `users`, `botnet` |
| device (laptop or phone on a slab) | `client`, `phone` |
| tile (flat slab with an icon) | `person`, `staff`, `document`, `vehicle`, `bed`, `junction` |
| cylinder | `database`, `storage` |
| block (rounded isometric cube) | `server`, `service`, `api`, `gateway`, `load-balancer`, `firewall`, `shield`, `rate-limiter`, `detector`, `auth`, `mfa`, `cache`, `queue`, `worker`, `dns`, `cdn`, `network`, `proxy`, `monitor`, `log`, `building`, `hospital`, `warehouse`, `factory`, `store`, `signal`, `router`, `attacker`, `generic` |

## Icons
`users`, `user`, `bot`, `laptop`, `phone`, `server`, `app`, `code`, `door`,
`split`, `wall`, `shield`, `gauge`, `eye`, `key`, `lock`, `bolt`, `stack`,
`gear`, `database`, `box`, `globe`, `cloud`, `relay`, `chart`, `doc`,
`building`, `cross`, `bed`, `truck`, `factory`, `shop`, `signal`, `network`,
`mask`, `clock`, `alert`, `check`, `x`, `heart`, `money`, `percent`,
`fingerprint`, `list`, `dot`.

## Tones
`blue`, `orange`, `amber`, `purple`, `green`, `red`, `teal`, `grey`, `pink`.

## Cross-field rules
- Ids are unique within `objectives`, `metrics`, `packets`, `components`,
  `links` and `steps`.
- Every `links[i].from` and `links[i].to` is a component id, and they differ.
- No two components share the same `at` cell.
- `warn` and `bad` need `better` set to `lower` or `higher`; with `lower`,
  `warn` ≤ `bad`; with `higher`, `warn` ≥ `bad`.
- `count` is allowed only on `users` and `botnet` components.
- Every key of `steps[i].components` is a component id; every key of
  `steps[i].links` is a link id, and both its ends are among that step's
  components.
- Every link in a flow is among that step's links; consecutive links of a
  `path` share exactly one component; `packet` is a packet id; a flow has
  `link` or `path`, not both.
- Every `steps[i].focus` id is among that step's components.
- `steps[i].metrics` has exactly one value for every metric, and no other key.
- Every `steps[i].objectives` id is an objective id, and every objective is
  taught by at least one step.
- A breakdown's rows sum to its total (within one millionth of the total).

## Warnings (non-blocking)
- fewer than 4 steps
- the last step is not a `recap`
- a step's body, callouts and takeaways together exceed 900 characters (the
  text should stay short and next to the diagram)
- a step shows more than 14 components
- a component or link that no step shows; a packet that no flow uses
- a metric whose value is the same at every step
- a block label longer than 16 characters (it wraps tightly)
- a `breakdown` on a step that is not the recap or a case (allowed, but rare)

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
