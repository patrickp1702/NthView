# Dataflow data schema — schemaVersion 1

## Overview
The data describes any flow of data or work between parties: a network
protocol, a payment, an order pipeline, a CI run, a signalling pathway, a
legal process. **Entities** sit in labelled **zones** and are joined by
**links**; **topics**, grouped under **sections**, each explain one part of the
flow as numbered **steps**, and every step carries the **messages** that travel
at that moment (who sends what to whom, with the payload and a note on each
field), an optional **check** that asks the learner to predict before the
step is shown, and optional per-**version** differences. An optional list of
versions adds a time machine: topics, steps and messages can arrive, change or
disappear from one version to the next. Three optional layers deepen a
document: **holdings** (what each entity holds after every message, with new
items marked), **channels** (a colour per link or message saying who can see
it), and **fragments** (alt, opt and loop frames drawn on the sequence
diagram).

The view shows a hero introduction, then a three-column lesson: topics on the
left, the step with a network or sequence diagram and the message flow table
in the centre, the topic's article and the current message's payload on the
right. Nothing in the view is specific to a subject; every label comes from
this data.

Text fields marked *rich* accept `**bold**` and `` `code` ``; nothing else is
interpreted and no HTML is ever rendered. Character limits count JavaScript
string length. Ids are lowercase kebab-case (`card-network`), 1–40 characters.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Brand in the top bar, the page title, and the hero heading when `heading` is absent |
| `kicker` | string | no | ≤80 chars | Small line above the hero heading, e.g. the full name of the subject |
| `heading` | string | no | ≤120 chars | The hero heading when it should differ from `title`, e.g. "What is a card payment?" |
| `lead` | string | yes | 1–800 chars, rich | The one-paragraph definition in the hero |
| `facts` | array | no | 0–8 Fact objects | The glossary-like list under the lead |
| `startLabel` | string | no | 1–40 chars; default "Start the lessons" | Text of the hero button |
| `jumps` | string[] | no | 0–4 topic ids, no duplicates | "or jump to …" links under the hero button |
| `theme` | string | no | one of `graphite`, `paper`, `blueprint`, `amber`; default `graphite` | Visual theme (see Themes) |
| `defaultMode` | string | no | `network` or `sequence`; default `network` | The diagram shown first. `sequence` suits a document whose point is the order of messages |
| `versions` | array | no | 0–8 Version objects, in chronological order | The time machine. Absent or fewer than 2 entries: no timeline is shown |
| `versionsLabel` | string | no | 1–24 chars; default "Version" | Label beside the timeline, e.g. "Spec" |
| `zones` | array | no | 0–10 Zone objects | Labelled groups the entities sit in |
| `entities` | array | yes | 2–40 Entity objects | Every party that sends or receives something |
| `links` | array | no | 0–80 Link objects | Declared connections, labelled by protocol or medium |
| `channels` | array | no | 0–8 Channel objects | Kinds of exposure a link or message can have, each with a colour; drawn as a legend on the diagram |
| `sections` | array | yes | 1–12 Section objects; 1–60 topics in all | The sidebar groups and their topics |
| `further` | object | no | a Further object | A final sidebar group of external links ("What's next") |
| `footer` | string | no | ≤300 chars, rich | A closing line under the article, e.g. the edition this document describes |

## Themes
Every theme has a light and a dark variant; the reader's system setting picks
one and a top-bar toggle switches auto, light and dark. All four are
near-monochrome with one warm accent used for attention (deprecated,
warnings, the current message).

| Theme | Default side | Look | Suits |
| :- | :- | :- | :- |
| `graphite` | dark | Warm near-black, bone text, amber accent | Protocols, APIs, infrastructure; the default |
| `paper` | light | Warm off-white, ink text, rust accent | Business and legal processes, reading-heavy flows |
| `blueprint` | dark | Deep navy, pale blue text, cyan accent | Networking, hardware, engineering pipelines |
| `amber` | light | Cream with amber-tinted surfaces, deep amber accent | Payments, retail, friendly everyday flows |

## Fact object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–40 chars | Left column, e.g. "Issuer" or "Not REST" |
| `text` | string | yes | 1–240 chars, rich | Right column |

## Version object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among versions | Referenced by topics, steps, messages and notes |
| `label` | string | yes | 1–20 chars | Text under the timeline dot, e.g. "Mar '25" or "3-D Secure 2" |
| `date` | string | no | ≤40 chars | Shown in the dot's tooltip and beside the label, e.g. "2025-03-26" |
| `note` | string | no | ≤200 chars, rich | One line about this version, shown under the timeline when it is active |
| `default` | boolean | no | at most one version is `true` | The version active on first open. When none is marked, the last one is |

## Zone object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among zones | Referenced by `entities[].zone` |
| `name` | string | yes | 1–40 chars | Small-caps label, e.g. "YOUR MACHINE" |
| `subtitle` | string | no | ≤60 chars | Muted text beside the label, e.g. "your computer" |
| `remote` | boolean | no | default `false` | Draw the zone with a dashed border (something far away or not under the learner's control) |

## Entity object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among entities | Referenced by links and messages |
| `name` | string | yes | 1–32 chars | Label under the glyph and on the lifeline header |
| `subtitle` | string | no | ≤40 chars | Monospace line under the name, e.g. "one per server" or "mcp.example.com" |
| `kind` | string | no | one of `person`, `browser`, `app`, `client`, `server`, `service`, `database`, `gateway`, `network`, `bank`, `model`, `device`, `document`, `queue`, `cloud`, `generic`; default `generic` | Picks the isometric line-art glyph |
| `zone` | string | no | a `zones[].id` | The zone the entity is drawn in; without one it stands alone |
| `holds` | string[] | no | 0–12 items, each 1–60 chars, no duplicates | What the entity holds at the start of every topic (keys, tokens, documents), unless the topic overrides it |

## Link object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `from` | string | yes | an entity id | One end |
| `to` | string | yes | an entity id, not equal to `from`; the unordered pair is unique among links | The other end |
| `label` | string | no | ≤24 chars | Protocol or medium pill on the line, e.g. "MCP", "ISO 8583", "HTTPS" |
| `channel` | string | no | a `channels[].id` | Colours the line; messages on this link inherit it unless they name their own |

Messages between two entities with no declared link are still drawn, on a
dashed line without a label.

## Channel object
A kind of exposure, in the learner's terms: visible to an attacker, encrypted,
local, out of band. Links and messages point at one; the diagram draws a
legend of the channels the current topic uses.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among channels | Referenced by `links[].channel` and `messages[].channel` |
| `name` | string | yes | 1–40 chars | Legend text, e.g. "Front channel, through the browser" |
| `color` | string | yes | one of `slate`, `amber`, `green`, `blue`, `red`, `teal`, `violet`, `pink` | Line, arrow, packet and table dot colour |
| `description` | string | no | ≤200 chars | Tooltip on the legend entry: who can see this channel |

## Section object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–60 chars | Group heading in the sidebar, e.g. "Core protocol" |
| `topics` | array | yes | 1–60 Topic objects | The topics in this group, in order |

## Topic object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among all topics | Referenced by `jumps` and the saved progress |
| `title` | string | yes | 1–60 chars | Sidebar title and article heading |
| `subtitle` | string | yes | 1–80 chars | One line under the title in the sidebar and the article |
| `tag` | string | no | ≤20 chars | Small amber tag after the title, e.g. "experimental" or "beta extension" |
| `availableFrom` | string | no | a version id | Before this version the topic shows "Arrives in <label>" and has no steps |
| `removedIn` | string | no | a version id, later than `availableFrom` | From this version on the topic shows "Removed in <label>" and has no steps |
| `article` | object | yes | an Article object | The right-hand reading panel |
| `holds` | object | no | keys are entity ids, values are 0–12 strings each 1–60 chars, no duplicates | What those entities hold when this topic starts, replacing their `entities[].holds` for this topic |
| `steps` | array | yes | 1–30 Step objects | The numbered steps, in order |
| `fragments` | array | no | 0–12 Fragment objects | alt, opt and loop frames drawn around ranges of steps on the sequence diagram |

## Article object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `body` | string[] | yes | 1–8 paragraphs, each 1–1500 chars, rich | The explanation |
| `referencesLabel` | string | no | 1–24 chars; default "References" | Label before the reference links |
| `references` | array | no | 0–10 Reference objects | Links to specs, docs or sources |
| `versionNotes` | array | no | 0–8 Version note objects, one per version at most | "What changes in …" lists; only with `versions` |
| `boxes` | array | no | 0–4 Box objects | Extra callouts such as "In progress" or "Not in the spec" |

## Reference object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–60 chars | Link text |
| `url` | string | yes | 1–500 chars, starts with `https://` or `http://` | Opens in a new tab |

## Version note object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `version` | string | yes | a version id, unique within the article's notes | The version the note is about |
| `heading` | string | no | 1–80 chars; default "What changes in <label>" | Heading of the list |
| `items` | string[] | yes | 1–8 items, each 1–300 chars, rich | The bullet points |

## Box object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–60 chars | Box heading |
| `tone` | string | no | one of `neutral`, `attention`; default `neutral` | `attention` uses the accent border |
| `items` | array | yes | 1–8 Box item objects | The rows |

Box item object: `text` (string, 1–240 chars, rich, required), `tag` (string,
≤30 chars, optional, shown muted after the text), `url` (string, optional,
`https://` or `http://`, makes the text a link).

## Step object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–80 chars | Step heading, also in the sidebar list |
| `explanation` | string | yes | 1–700 chars, rich | Two or three sentences shown above the diagram |
| `tag` | string | no | ≤20 chars | Small amber tag in the sidebar, e.g. "deprecated" |
| `focus` | string[] | no | 0–12 entity ids | Entities to highlight in addition to the ones the step's messages touch |
| `messages` | array | no | 0–20 Message objects | What travels during this step, in order. A step without messages is a beat of its own in the flow |
| `check` | object | no | a Check object | A prediction question asked before the step is revealed |
| `versions` | object | no | keys are version ids; values are Step override objects | Per-version replacements for `title`, `explanation`, `tag`, `focus` and `messages` |

Step override object: any of `title`, `explanation`, `tag`, `focus`,
`messages`, with the same constraints as on the step. A field present in the
override replaces the step's field when that version is active; `messages` is
replaced as a whole.

## Message object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `from` | string | yes | an entity id | Sender |
| `to` | string | yes | an entity id; may equal `from` for local work | Receiver |
| `name` | string | yes | 1–60 chars | The method, verb or event, shown in monospace, e.g. `tools/list`, `POST /token`, `AUTH 0100` |
| `info` | string | no | ≤120 chars | Short note in the table and on the sequence arrow |
| `kind` | string | no | one of `request`, `response`, `error`, `notification`, `local`, `transport`; default `request` | Dot and arrow style: filled, outlined, accent, dashed, dotted, square |
| `payload` | string or object | no | string ≤4000 chars, or a JSON object or array that serialises to ≤4000 chars | The full message. A string is shown verbatim (monospace, whitespace kept); an object is pretty-printed with light syntax colouring |
| `annotations` | array | no | 0–12 Annotation objects | Field-by-field explanation under the payload |
| `size` | string | no | ≤12 chars | Shown right-aligned beside the name, e.g. "58 B" or "2 KB" |
| `tags` | string[] | no | 0–4 items, each 1–20 chars | Tags after the name; `deprecated` is drawn with the accent and a strike-through, others muted |
| `versions` | string[] | no | 1–8 version ids, no duplicates | Only show this message in these versions. Absent: all versions |
| `channel` | string | no | a `channels[].id` | The exposure of this message; default: the channel of the link between `from` and `to`, if any |
| `holds` | object | no | a Holdings change object | What entities gain or give up when this message is sent |

## Holdings change object
An object whose keys are entity ids. Each value is an object with `add`
and/or `remove`, string arrays of 0–12 items each 1–60 chars; at least one of
the two is present and an item is not in both. Holdings are computed, never
re-typed: the strip under the diagram shows, after each message, the
entity's starting items with every change up to that message applied,
removes before adds, items added by the current message marked new and items
removed by it shown struck through. The state is computed per version from
the messages that version shows.

## Fragment object
A frame on the sequence diagram around consecutive steps, in UML style.
Fragments never change the network diagram or the flow table.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kind` | string | yes | `alt`, `opt` or `loop` | `alt`: one branch or another; `opt`: happens only sometimes; `loop`: repeats |
| `label` | string | no | ≤40 chars | Shown in the frame's tab after the kind, e.g. "registration" |
| `start` | integer | yes | step index, 0 to steps − 1 | First step inside the frame |
| `end` | integer | yes | step index, ≥ `start` | Last step inside the frame |
| `condition` | string | for `opt` and `loop` | 1–80 chars; not allowed on `alt` | The guard, shown as `[condition]` |
| `branches` | array | for `alt` | 2–4 Branch objects; only on `alt` | The alternatives, in order |

Branch object: `condition` (string, 1–80 chars, required, shown as
`[condition]`), `start` and `end` (integer step indexes, required). Branches
follow each other without gaps: the first starts at the fragment's `start`,
each next one starts at the step after the previous one's `end`, and the last
ends at the fragment's `end`.

## Annotation object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `field` | string | yes | 1–60 chars | Monospace key, e.g. `id` or `Authorization` |
| `text` | string | yes | 1–300 chars, rich | What the field means and its rules |

## Check object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 chars, rich | The question, e.g. "What does the server answer?" |
| `options` | array | yes | 2–4 Option objects, exactly one `correct`, texts unique | The choices |

Option object: `text` (string, 1–200 chars, rich, required), `correct`
(boolean, optional, default `false`), `why` (string, 1–400 chars, rich,
required: why this option is right or wrong).

A check is learning-first: when the learner reaches the step, the question
replaces the explanation and the step's messages stay dimmed until they answer
or skip; a wrong answer shows the explanation of the chosen option and the
correct one, then reveals the step. Play pauses at a step with an unanswered
check. Nothing blocks and nothing is scored against the learner.

## Further object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | no | 1–60 chars; default "What's next" | Sidebar group heading |
| `items` | array | yes | 1–10 Further item objects | External links |

Further item object: `title` (string, 1–60 chars, required), `subtitle`
(string, ≤80 chars, optional), `url` (string, required, `https://` or
`http://`).

## Cross-field rules
- `versions[].id`, `zones[].id`, `entities[].id` and topic ids (across every
  section) are unique. At most one version has `default: true`.
- `jumps[i]` must be a topic id.
- `entities[i].zone` must match a `zones[j].id`.
- `links[i].from` and `links[i].to` must be entity ids and differ; the same
  unordered pair may not appear twice.
- Every message `from` and `to`, and every `focus` entry, must be an entity id.
- Every version reference (`availableFrom`, `removedIn`, `versionNotes[].version`,
  the keys of `steps[].versions`, `messages[].versions[]`) must be a declared
  version id; with no `versions` array, any such reference is an error.
- `removedIn` must come later in `versions` than `availableFrom`.
- A `versionNotes` entry per version at most.
- `check.options` has exactly one `correct: true` and no repeated `text`.
- `payload` is a string, a plain object or an array; serialised it is at most
  4000 characters.
- `references[].url`, box item `url` and further item `url` start with
  `https://` or `http://`.
- `channels[].id` are unique; `links[].channel` and `messages[].channel`
  must be channel ids.
- `entities[].holds` and every `topics[].holds` list has no duplicate items;
  `topics[].holds` keys are entity ids.
- A message's `holds` keys are entity ids; each change has `add` or
  `remove`, and no item is in both. A removed item must be held by that
  entity at that point, in every version that shows the message.
- `fragments[].start` and `end` are step indexes of the topic with
  `start` ≤ `end`. An `alt` has `branches` and no `condition`; `opt` and
  `loop` have a `condition` and no `branches`. Branches are contiguous as
  described above. Two fragments are either separate or one lies entirely
  inside the other; a fragment inside an `alt` lies inside one of its branches.

## Warnings (non-blocking)
- Fewer than 2 topics in all.
- A step with no messages (allowed, but the flow table has nothing to show).
- A message between two entities with no declared link (drawn dashed, unlabelled).
- A topic with more than 12 steps or more than 60 messages in a version.
- An entity no message or `focus` ever uses; a zone with no entities; a link no
  message ever travels.
- A topic whose steps touch more than 8 entities (a crowded diagram).
- A payload longer than 1500 characters.
- `versions` declared but nothing references any version (the time machine changes nothing).
- Ten or more steps in all and no check.
- A step `check` whose `prompt` does not end with a question mark.
- A channel no link or message uses.
- A holdings change that adds an item the entity already holds.
- An entity holding more than 12 items at some point.

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
