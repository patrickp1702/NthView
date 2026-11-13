# Sequence data schema — schemaVersion 1

## Overview
The data describes an exchange between 2–8 participants as an ordered list of
steps: who sends what to whom, over which channel, with the exact message
content, the reason for it, and what each participant holds afterwards. The
view walks through the steps one at a time and can show the whole exchange as
one UML-style sequence diagram, with trust zones, fragments (alt, opt, loop)
and notes.

A document is a tree. Any step may carry an `inner` sequence that explains how
that one step is carried out, with its own steps, parties and checks; inner
sequences nest to any depth up to 6. A participant may be a **group** whose
`members` appear only inside inner sequences, so a party that takes part in a
short stretch does not need a lane in the main diagram. A run of consecutive
steps between the same parties can be folded in place with a `group`
fragment, collapsed by default.

Text fields marked *rich* accept `**bold**`, `` `code` `` and glossary marks
`((term))` or `((shown text|term))`; nothing else is interpreted. `wire` and
`payload` are shown exactly as written (monospace, whitespace kept). Step
indexes are 0-based: `0` is the first step, shown to the learner as step 1.
Character limits count JavaScript string length, so one emoji counts as 2.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Page heading and page title |
| `subtitle` | string | no | ≤300 chars, rich | One or two lines under the title |
| `theme` | string | no | one of `paper`, `slate`, `blueprint`, `mint` | Visual theme (see Themes). When omitted, one is derived from the title |
| `compareLabel` | string | no | ≤60 chars | Label of the checkbox that shows every step's `compare` panel, e.g. "Show what OAuth 2.0 allowed here". Default "Show the comparison" |
| `zones` | array | no | 0–6 Zone objects | Trust zones drawn as shaded bands behind the participants |
| `participants` | array | yes | 2–8 Participant objects | The lanes, left to right in this order. A group counts as one lane |
| `channels` | array | yes | 1–8 Channel objects | Kinds of transition; every step names one |
| `steps` | array | yes | 2–60 Step objects | The sequence, in time order |
| `fragments` | array | no | 0–20 Fragment objects | alt, opt and loop frames around ranges of steps |
| `glossary` | array | no | 0–40 Glossary objects | Terms the learner can tap wherever `((term))` appears |
| `closing` | string[] | no | 0–4 items, each 1–600 chars, rich | Paragraphs at the end of the recap |

## Themes
Every theme has a light and a dark variant chosen by the reader's system
setting. Channel colours are the same hue names in every theme.

| Theme | Look | Suits |
| :- | :- | :- |
| `paper` | Warm off-white, serif headings, rust accent | Business processes, law, history, reading-heavy flows |
| `slate` | Cool grey, indigo accent | Security protocols, web flows, general use |
| `blueprint` | Pale blue or navy, monospace headings | Networking, handshakes, low-level protocols |
| `mint` | Soft green, teal accent | Health, finance, friendly everyday workflows |

## Zone object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among zones | Referenced by `participants[].zone` |
| `name` | string | yes | 1–40 chars | Label above the band, e.g. "Your device" |
| `description` | string | no | ≤200 chars | Tooltip on the label |

## Participant object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among participants | Referenced by steps and holds |
| `name` | string | yes | 1–32 chars | Lane heading |
| `role` | string | no | ≤60 chars | One line under the name, e.g. "issues tokens" |
| `kind` | string | no | one of `person`, `browser`, `app`, `server`, `service`, `database`, `device`, `other`, `group`; default `other` | Picks the small glyph. `group` makes it a group of parties |
| `members` | array | for `group` | 2–12 Member objects; only allowed when `kind` is `group` | The parties inside the group. One lane in this sequence (its header says "N inside"); inner sequences address the members by id |
| `zone` | string | no | a `zones[].id` (zones are defined at the top level only) | The trust zone this participant sits in. A participant of an inner sequence without a zone sits in the zone of the party its parent step is addressed to |
| `holds` | string[] | no | 0–12 items, each 1–60 chars, no duplicates | What it holds before the first step of its sequence |

Participant ids are unique across the whole document: the top level, every
inner sequence and every group's members.

## Member object
A party inside a group participant.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique across the whole document | Referenced by inner steps and holds |
| `name` | string | yes | 1–32 chars | Lane heading inside the group |
| `role` | string | no | ≤60 chars | One line under the name |
| `kind` | string | no | one of `person`, `browser`, `app`, `server`, `service`, `database`, `device`, `other` (not `group`); default `other` | Picks the glyph |

A member starts holding nothing and sits in its group's zone; it has no other
fields.

## Channel object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among channels | Referenced by `steps[].channel` |
| `name` | string | yes | 1–60 chars | Shown on the step badge and in the legend, e.g. "Front channel, through your browser" |
| `color` | string | yes | one of `slate`, `amber`, `green`, `blue`, `red`, `teal`, `violet`, `pink` | Arrow and badge colour |
| `description` | string | no | ≤240 chars | Tooltip in the legend: who can see this channel |

## Step object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `from` | string | yes | a participant id visible at this level (see Visibility) | Sender |
| `to` | string | yes | a participant id visible at this level; may equal `from` | Receiver; equal to `from` for a local or self step |
| `channel` | string | yes | a channel id defined at this level or an enclosing one | How the transition travels |
| `kind` | string | no | one of `sync`, `async`, `return`, `self`; default `self` when `from` equals `to`, otherwise `sync` | Arrow style: `sync` solid with filled head (the sender waits), `async` solid with open head, `return` dashed with open head (a reply), `self` a loop on one lifeline |
| `payload` | string | yes | 1–40 chars | Short label that flies on the arrow, e.g. "code + verifier" |
| `title` | string | yes | 1–120 chars | Step heading |
| `wire` | string | no | ≤3000 chars | The message as it actually travels: request lines, headers, fields, or the computation for a self step. Monospace, whitespace kept |
| `why` | string | yes | 1–800 chars, rich | Why this step exists and what it achieves |
| `compare` | object | no | see Compare | "How it used to be" or "how the alternative does it", shown when the learner ticks the compare checkbox |
| `detail` | array | no | 1–8 Detail objects | Rows in the "What's involved in this step" disclosure |
| `note` | object | no | see Note | A highlighted remark with a severity, also drawn as a note in the diagram |
| `holds` | object | no | see Holds change | What participants gain or give up at this step |
| `check` | object | no | see Check | A light question asked before the step is shown |
| `inner` | object | no | an Inner sequence object; at most 6 levels deep | How this one step is carried out, as a sequence of its own. The step card offers "Open the inner sequence"; the diagram draws the step as a `ref` frame |

## Inner sequence object
The value of `steps[i].inner`. It has the shape of the top level without the
fields that belong to the whole document.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `subtitle` | string | no | ≤300 chars, rich | One or two lines under the breadcrumb |
| `participants` | array | no | 0–8 Participant objects, ids unique across the document | Parties that appear only here. Groups are allowed |
| `channels` | array | no | 0–8 Channel objects; ids must not repeat an enclosing sequence's | Added to the channels inherited from the enclosing sequences |
| `steps` | array | yes | 2–60 Step objects | The inner sequence, in time order; steps may have their own `inner` |
| `fragments` | array | no | 0–20 Fragment objects; indexes refer to this inner sequence's `steps` | Frames and groups inside it |
| `glossary` | array | no | 0–40 Glossary objects; terms unique across the document | Added to the terms inherited from the enclosing sequences |

`schemaVersion`, `title`, `theme`, `compareLabel`, `zones` and `closing` are
only allowed at the top level; the inner sequence takes its heading from its
parent step.

**Visibility.** A step's `from` and `to`, its holds keys and a `who` check's
answer may name any participant visible at its level: the level's own
participants, the members of any group declared at that level or an
enclosing one, and the participants of every enclosing level. Inner steps
therefore show the outer message arriving (`from` a parent-level party) and
the reply leaving. Lanes at a level are its own participants plus every party
its steps name, in one document-wide order: top-level participants left to
right, each followed by its members and by the parties of inner sequences
whose parent step is addressed to it. A member named at the level where its
group is declared is drawn on the group's lane.

**Holds in an inner sequence** start from the holds as they stand just before
the parent step, plus the inner participants' own `holds` (members start
empty). Changes made inside stay inside; the parent step's own `holds` give
the net result at the outer level.

## Compare object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–60 chars | Lead-in, e.g. "In OAuth 2.0" or "Without PKCE" |
| `text` | string | yes | 1–600 chars, rich | The comparison |

## Detail object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–40 chars | Row label, e.g. "Who's involved", "Which spec" |
| `text` | string | yes | 1–600 chars, rich | Row content |

## Note object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `severity` | string | yes | one of `info`, `warning`, `danger` | Badge and colour; `danger` for a security-critical moment |
| `text` | string | yes | 1–300 chars, rich | The note |

## Holds change object
An object whose keys are participant ids. Each value is an object:

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `<participant id>` | object | at least one key | a `participants[].id` | The change for that participant |
| `….add` | string[] | no | 0–12 items, each 1–60 chars | Items it holds from this step on; marked new at this step |
| `….remove` | string[] | no | 0–12 items, each 1–60 chars | Items it gives up or discards at this step |

Holds are computed, never re-typed: the strip at step *i* is the participant's
starting `holds` with every change up to step *i* applied in order, removes
before adds. Inside an `alt` fragment, every branch after the first starts
from the state before the fragment and does not carry forward; after the
fragment the state is the one at the end of the first branch. Steps in `opt`
and `loop` fragments carry forward like any other step.

## Check object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `type` | string | yes | `who` or `choice` | `who` asks which participant sends the step; `choice` asks a multiple-choice question |
| `prompt` | string | for `choice` | 1–200 chars for `who` (default "Who sends the next message?"), 1–300 chars for `choice`; rich | The question |
| `answer` | string | for `who` | a `participants[].id`, must equal the step's `from`; not allowed on `choice` | The sender |
| `why` | string | no | ≤500 chars, rich; `who` only | Explanation shown after answering |
| `options` | array | for `choice` | 2–4 Option objects, exactly one `correct`; not allowed on `who` | The choices |

Option object: `text` (string, 1–200 chars, rich, unique within the check),
`correct` (boolean, optional, default `false`), `why` (string, 1–500 chars,
rich, required: why this option is right or wrong).

A check is learning-first: the step stays hidden until the learner answers or
skips; a wrong answer shows the explanation and the step at once. Nothing
blocks and nothing is scored against the learner.

## Fragment object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kind` | string | yes | `alt`, `opt`, `loop` or `group` | `alt`: one branch or another; `opt`: happens only sometimes; `loop`: repeats; `group`: a named run of steps folded into one unit |
| `label` | string | for `group` | ≤40 chars on `alt`, `opt`, `loop`; 1–80 chars and required on `group` | Shown in the frame's tab after the kind, e.g. "state check"; a group's name, e.g. "Session setup" |
| `start` | integer | yes | step index, 0 to steps − 1 | First step inside the frame |
| `end` | integer | yes | step index, ≥ `start`; > `start` for `group` | Last step inside the frame |
| `condition` | string | for `opt` and `loop` | 1–80 chars; not allowed on `alt` or `group` | The guard, shown as `[condition]` |
| `branches` | array | for `alt` | 2–4 Branch objects; only on `alt` | The alternatives, in order; the first is the main path |
| `summary` | string | no | ≤200 chars, rich; only on `group` | The one-line summary on the collapsed group's card |
| `collapsed` | boolean | no | only on `group`; default `true` | Whether the group starts folded. The learner's choice is saved |

A **group** fragment folds 2 or more consecutive steps into one unit. In step
mode a collapsed group is one summary card (label, parties, step count,
summary, an Expand button) and its steps share one folded chip; expanded, the
steps appear one by one under a group header with a Collapse button. In the
full diagram a collapsed group is one frame across the lifelines it touches;
expanded, the frame holds the real arrows. Step numbers never change. Holds
inside a group carry forward like any other step.

Branch object: `condition` (string, 1–80 chars, required, shown as
`[condition]`), `start` and `end` (integer step indexes, required).

## Glossary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–40 chars, unique ignoring case | What `((term))` refers to |
| `definition` | string | yes | 1–300 chars, rich | Shown in a pop-over and in the glossary drawer |

## Cross-field rules
Every rule applies at every level: the top level and each inner sequence,
with paths such as `steps[5].inner.steps[2].from`.
- `zones[].id` are unique. Participant and member ids are unique across the
  whole document. Channel ids are unique within a sequence and must not
  repeat a channel of an enclosing sequence. Glossary terms are unique
  (ignoring case) across the whole document.
- `participants[i].zone` must match a top-level `zones[j].id`.
- A participant with `kind: "group"` has 2–12 `members`; `members` on any
  other kind is an error. A member's `kind` is not `group` and a member has
  no `holds`, `members` or `zone`.
- `steps[i].from`, `steps[i].to`, holds keys and a `who` check's `answer`
  must name a participant visible at that level (see Visibility);
  `steps[i].channel` must match a channel of that level or an enclosing one.
- `steps[i].inner` is an Inner sequence object with 2 or more steps, nested
  at most 6 levels deep (the top level is depth 0, `steps[i].inner` depth 1).
  It may not contain `schemaVersion`, `title`, `theme`, `compareLabel`,
  `zones` or `closing`.
- `kind: "self"` requires `from` equal to `to`; `from` equal to `to` requires
  `kind` to be `self` or omitted.
- `steps[i].holds` keys must be participant ids; each change must add or
  remove at least one item, and may only have the keys `add` and `remove`; an
  item may not be both added and removed in one step.
- A removed item must be held by that participant at that step, computed as
  described under Holds change.
- `participants[i].holds` has no duplicate items.
- `check.type` is `who` or `choice`. A `who` check's `answer` must be a
  visible participant id equal to the step's `from` and has no `options`. A `choice`
  check has a `prompt`, 2–4 `options` with exactly one `correct: true` and
  unique texts, and no `answer`.
- `fragments[i].start`, `end` and every `branches[k].start` and `end` must be
  valid step indexes of the sequence that holds the fragment, with
  `start` ≤ `end`; a fragment inside an inner sequence cannot reach outside it.
- A `group` fragment has a `label` (1–80 chars), `end` greater than `start`,
  no `condition` and no `branches`; `summary` and `collapsed` are only allowed
  on `group`.
- An `alt` fragment's branches follow each other without gaps:
  `branches[0].start` equals the fragment `start`, each next branch starts at
  the step after the previous one ends, and the last branch's `end` equals the
  fragment `end`. An `alt` has no `condition`; `opt` and `loop` have a
  `condition` and no `branches`.
- Two fragments are either separate or one lies entirely inside the other; a
  fragment inside an `alt` lies inside one of its branches. Groups follow the
  same rule and may nest inside groups.
- Every `((term))` or `((shown text|term))` mark must name a glossary term of
  its own sequence or an enclosing one.

## Warnings (non-blocking)
- Fewer than 3 steps.
- More than 6 participants (lanes get narrow on a phone).
- A step without `wire`.
- A `payload` longer than 24 characters.
- Six or more steps and no check.
- A participant that never sends or receives a step at its level; a channel
  that no step uses at its level or deeper.
- A zone with no participants, or a zone whose participants are not next to
  each other (it is drawn as separate bands).
- A holds change that adds an item the participant already holds.
- A participant holding more than 12 items at some step.
- A glossary term never marked with `((...))`.
- An inner sequence nested more than 3 levels deep.
- An inner sequence that shows more than 8 lanes at once.
- A group participant that no step at its level sends to or from, directly or
  through one of its members; a member that no step at any level uses.
- Every step of a sequence inside a collapsed group: "the main level has
  nothing to read".

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
