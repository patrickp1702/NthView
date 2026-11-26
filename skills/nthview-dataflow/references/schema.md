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

A document has one of two shapes. **Topics** (`sections`) give the full
explainer: a hero introduction, then a three-column lesson: topics on the
left, the step with a network or sequence diagram and the message flow table
in the centre, the topic's article and the current message's payload on the
right. A **single exchange** (root `steps` instead of `sections`) is the
lightweight form for one handshake or one flow: no hero, no articles, the
title, lead and steps in the sidebar, the sequence diagram first. Both shapes
share everything else.

Long flows stay readable through two kinds of folding. A step may open an
**inner sequence** that shows how that one step is carried out, often between
parties that appear only there (the **members** of a group entity); the
learner drills in and backs out, and the sequence diagram draws the step as a
`ref` frame. A run of consecutive steps may be a **group** fragment, folded
into one beat until the learner expands it. Steps may also carry a **note**
with a severity, a **compare** panel ("how it used to be"), **detail** rows,
and glossary marks. Nothing in the view is specific to a subject; every label
comes from this data.

Text fields marked *rich* accept `**bold**`, `` `code` `` and glossary marks
`((term))` or `((shown text|term))`; nothing else is interpreted and no HTML
is ever rendered. Character limits count JavaScript
string length. Ids are lowercase kebab-case (`card-network`), 1–40 characters.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Brand in the top bar, the page title, and the hero heading when `heading` is absent |
| `kicker` | string | no | ≤80 chars; only with `sections` | Small line above the hero heading, e.g. the full name of the subject |
| `heading` | string | no | ≤120 chars; only with `sections` | The hero heading when it should differ from `title`, e.g. "What is a card payment?" |
| `lead` | string | with `sections` | 1–800 chars, rich | The one-paragraph definition in the hero; for a single exchange, the paragraph under the title in the sidebar |
| `facts` | array | no | 0–8 Fact objects; only with `sections` | The glossary-like list under the lead |
| `startLabel` | string | no | 1–40 chars; default "Start the lessons"; only with `sections` | Text of the hero button |
| `jumps` | string[] | no | 0–4 topic ids, no duplicates; only with `sections` | "or jump to …" links under the hero button |
| `theme` | string | no | one of `graphite`, `paper`, `blueprint`, `amber`; default `graphite` | Visual theme (see Themes) |
| `defaultMode` | string | no | `network` or `sequence`; default `network`, or `sequence` for a single exchange | The diagram shown first. `sequence` suits a document whose point is the order of messages |
| `versions` | array | no | 0–8 Version objects, in chronological order | The time machine. Absent or fewer than 2 entries: no timeline is shown |
| `versionsLabel` | string | no | 1–24 chars; default "Version" | Label beside the timeline, e.g. "Spec" |
| `zones` | array | no | 0–10 Zone objects | Labelled groups the entities sit in |
| `entities` | array | yes | 2–40 Entity objects | Every party that sends or receives something |
| `links` | array | no | 0–80 Link objects | Declared connections, labelled by protocol or medium |
| `channels` | array | no | 0–8 Channel objects | Kinds of exposure a link or message can have, each with a colour; drawn as a legend on the diagram |
| `sections` | array | unless `steps` | 1–12 Section objects; 1–60 topics in all; not with `steps` | The sidebar groups and their topics |
| `steps` | array | unless `sections` | 1–60 Step objects; not with `sections` | A single exchange: the steps of the one flow, in order |
| `fragments` | array | no | 0–20 Fragment objects; only with `steps` | Frames and groups around ranges of the root `steps` |
| `compareLabel` | string | no | 1–60 chars; default "Show the comparison" | Label of the checkbox that shows every step's `compare` panel, e.g. "Show how TLS 1.2 did it" |
| `glossary` | array | no | 0–40 Glossary objects | Terms the learner can tap wherever `((term))` appears; a Glossary button lists them all |
| `closing` | string[] | no | 0–4 items, each 1–600 chars, rich | Paragraphs shown with the prediction tally when the learner reaches the end |
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
| `members` | string[] | no | 2–12 entity ids, no duplicates; not its own id | Makes the entity a group: one lane or card ("N inside") where its parts do not matter, while inner sequences use the members as entities of their own. A member without a `zone` sits in its group's zone |

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
| `note` | object | no | a Note object | A highlighted remark under the explanation, also marked `!` on the sequence diagram |
| `compare` | object | no | a Compare object | "How it used to be" or "how the alternative does it", shown under the explanation when the learner ticks the compare checkbox |
| `detail` | array | no | 1–8 Detail objects | "About this step" rows under the payload in the Message panel |
| `inner` | object | no | an Inner sequence object; at most 6 levels deep | How this one step is carried out, as a sequence of its own. The caption offers "Open the inner sequence"; the sequence diagram draws the step as a `ref` frame |
| `versions` | object | no | keys are version ids; values are Step override objects | Per-version replacements for `title`, `explanation`, `tag`, `focus` and `messages` |

Step override object: any of `title`, `explanation`, `tag`, `focus`,
`messages`, with the same constraints as on the step. A field present in the
override replaces the step's field when that version is active; `messages` is
replaced as a whole.

## Inner sequence object
The value of `steps[i].inner`: a sequence of its own inside one step.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `subtitle` | string | no | ≤300 chars, rich | One or two lines under the breadcrumb |
| `steps` | array | yes | 2–30 Step objects | The inner steps, in order; they may have their own `inner` |
| `fragments` | array | no | 0–12 Fragment objects; indexes refer to these `steps` | Frames and groups inside it |

Entities, channels, links and the glossary are declared once at the root and
used anywhere; an inner sequence never declares its own. Its diagram shows
the entities its messages touch, so a party used only inside it never
crowds the outer level. Start the inner steps with the outer message arriving
and end them with the result leaving. **Holdings in an inner sequence** start
from the holdings as they stand just before the parent step; changes made
inside stay inside, and the parent step's own messages give the net result
at the outer level.

## Note object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `severity` | string | yes | one of `info`, `warning`, `danger` | Label and colour; `danger` for a security-critical moment |
| `text` | string | yes | 1–300 chars, rich | The note |

## Compare object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–60 chars | Lead-in, e.g. "In TLS 1.2" or "Without PKCE" |
| `text` | string | yes | 1–600 chars, rich | The comparison |

## Detail object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–40 chars | Row label, e.g. "Who's involved", "Which spec" |
| `text` | string | yes | 1–600 chars, rich | Row content |

## Glossary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–40 chars, unique ignoring case | What `((term))` refers to |
| `definition` | string | yes | 1–300 chars, rich | Shown in a pop-over by the term and in the Glossary dialog |

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
the messages that version shows. Inside an `alt` fragment, every branch after
the first starts from the state before the fragment and does not carry
forward; after the fragment the state is the one at the end of the first
branch. Steps in `opt`, `loop` and `group` fragments carry forward like any
other step. A "Changes only" toggle on the strip hides entities whose
holdings do not change at the current message.

## Fragment object
A frame on the sequence diagram around consecutive steps, in UML style. An
`alt`, `opt` or `loop` changes nothing but the sequence diagram; a `group`
also folds its steps.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kind` | string | yes | `alt`, `opt`, `loop` or `group` | `alt`: one branch or another; `opt`: happens only sometimes; `loop`: repeats; `group`: a named run of steps folded into one beat |
| `label` | string | for `group` | ≤40 chars on `alt`, `opt`, `loop`; 1–80 chars and required on `group` | Shown in the frame's tab after the kind, e.g. "registration"; a group's name, e.g. "Session setup" |
| `start` | integer | yes | step index, 0 to steps − 1 | First step inside the frame |
| `end` | integer | yes | step index, ≥ `start`; > `start` for `group` | Last step inside the frame |
| `condition` | string | for `opt` and `loop` | 1–80 chars; not allowed on `alt` or `group` | The guard, shown as `[condition]` |
| `branches` | array | for `alt` | 2–4 Branch objects; only on `alt` | The alternatives, in order |

| `summary` | string | no | ≤200 chars, rich; only on `group` | The line under the group's name while it is folded |
| `collapsed` | boolean | no | only on `group`; default `true` | Whether the group starts folded. The learner's choice is saved |

A folded **group** is one beat: one row in the flow table and the step list
("4–6 · label"), one rounded band on the sequence diagram, and a caption with
the summary and an Expand button. The holdings strip shows the net change
over the whole group. Expanded, its steps play one by one inside a `group`
frame, and the caption of each offers to fold it again. Step numbers never
change. Checks inside a folded group wait until it is expanded.

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
| `type` | string | no | `choice` or `who`; default `choice` | `choice` asks a multiple-choice question; `who` asks which entity sends the step's first message |
| `prompt` | string | for `choice` | 1–300 chars for `choice`; 1–200 chars for `who` (default "Who sends the next message?"); rich | The question, e.g. "What does the server answer?" |
| `options` | array | for `choice` | 2–4 Option objects, exactly one `correct`, texts unique; not allowed on `who` | The choices |
| `answer` | string | for `who` | an entity id, equal to the `from` of the step's first message; not allowed on `choice` | The sender. The options are the entities on the current diagram |
| `why` | string | no | ≤400 chars, rich; `who` only | Explanation shown after answering |

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
Every rule about steps and fragments applies at every level: a topic, the
root `steps` of a single exchange, and each inner sequence, with paths such as
`steps[5].inner.steps[2].messages[0].from`.
- A document has either `sections` or root `steps`, never both. With root
  `steps`, `kicker`, `heading`, `facts`, `startLabel` and `jumps` are not
  allowed; root `fragments` are allowed only with root `steps`.
- `versions[].id`, `zones[].id`, `entities[].id` and topic ids (across every
  section) are unique. At most one version has `default: true`.
- `jumps[i]` must be a topic id.
- `entities[i].zone` must match a `zones[j].id`.
- `entities[i].members` are entity ids other than its own, without
  duplicates; an entity is a member of one group at most, and a member is not
  itself a group.
- `links[i].from` and `links[i].to` must be entity ids and differ; the same
  unordered pair may not appear twice.
- Every message `from` and `to`, and every `focus` entry, must be an entity id.
- Every version reference (`availableFrom`, `removedIn`, `versionNotes[].version`,
  the keys of `steps[].versions`, `messages[].versions[]`) must be a declared
  version id; with no `versions` array, any such reference is an error.
- `removedIn` must come later in `versions` than `availableFrom`.
- A `versionNotes` entry per version at most.
- `check.type` is `choice` (or absent) or `who`. A choice check has a
  `prompt` and `options` with exactly one `correct: true`, no repeated `text`,
  and no `answer`. A who check has an `answer` equal to the `from` of the
  step's first message (the step must have a message) and no `options`.
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
  A `group` has a `label` (1–80 chars), `end` greater than `start`, no
  `condition` and no `branches`; `summary` and `collapsed` are only allowed on
  `group`. Groups nest like any fragment.
- `steps[i].inner` has 2–30 steps and is nested at most 6 levels deep (a
  topic's own steps are depth 0, their `inner` depth 1). It may not declare
  `participants`, `entities`, `channels`, `glossary` or `zones`; fragment
  indexes inside it count from 0 within its own `steps`.
- `note.severity` is `info`, `warning` or `danger`.
- `glossary[].term` values are unique ignoring case. Every `((term))` or
  `((shown text|term))` mark in a rich field names a glossary term.

## Warnings (non-blocking)
- Fewer than 2 topics in all.
- A step with no messages (allowed, but the flow table has nothing to show).
- A message between two entities with no declared link (drawn dashed, unlabelled).
- A topic with more than 12 steps, a single exchange with more than 30, or a
  topic, single exchange or inner sequence with more than 60 messages.
- An entity no message or `focus` ever uses; a zone with no entities; a link no
  message ever travels.
- A topic or inner sequence whose steps touch more than 8 entities (a crowded
  diagram).
- An inner sequence nested more than 3 levels deep.
- Every step of a sequence inside a collapsed group: the learner has nothing to
  read until they expand one.
- A glossary term never marked with `((...))`.
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
