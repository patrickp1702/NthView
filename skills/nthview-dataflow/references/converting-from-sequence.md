# Converting from Sequence

The Sequence view (`nthview-sequence`) was merged into Dataflow. A Sequence
document becomes a Dataflow **single exchange**: the same steps, holdings,
fragments, inner sequences and checks, with root `steps` instead of
`sections`. Nothing a learner could do in Sequence is lost. Convert field by
field, then run the validator.

## Root

| Sequence | Dataflow |
| :- | :- |
| `subtitle` | `lead` |
| `theme` `paper`, `slate`, `blueprint`, `mint` | `theme` `paper`, `graphite`, `blueprint`, `amber` |
| `compareLabel`, `glossary`, `closing` | the same fields |
| `zones[].description` | `zones[].subtitle` (60 characters at most) |
| `participants` | `entities`, in the same order (see below) |
| `channels` | `channels`; channel names are 40 characters at most |
| `steps`, `fragments` | root `steps` and `fragments` (see below) |

Add `links` for the pairs that exchange messages, with the channel the pair
mostly uses and a short protocol `label` where one helps; without links the
network diagram draws dashed, unlabelled lines and the validator warns.

## Participants become entities

- `role` becomes `subtitle` (40 characters at most); `kind: "other"` becomes
  `generic`; `holds` stay.
- A `group` participant becomes an entity with a fitting `kind` and
  `members`: the ids of its members, each declared as an entity of its own
  right after the group, with no `zone` (they sit in the group's zone).
- Parties declared in an inner sequence's `participants` move to the root
  `entities`, right after the party the parent step is addressed to, with that
  party's `zone`. An inner sequence never declares entities, channels or
  glossary terms; move inner `channels` and `glossary` entries to the root.

## Steps

Each Sequence step becomes one Dataflow step with one message:

| Sequence step | Dataflow |
| :- | :- |
| `title` (≤120) | `title` (≤80; shorten if needed) |
| `why` (≤800) | `explanation` (≤700) |
| `from`, `to`, `channel` | `messages[0].from`, `.to`, `.channel` |
| `payload` | `messages[0].name` |
| `wire` | `messages[0].payload` (a string, shown verbatim) |
| `kind` `sync`, `return`, `self` | `messages[0].kind` `request`, `response`, `local` |
| `kind` `async` | `notification`, or `request` or `response` when the message pairs up, `transport` for a redirect or a file |
| `holds` | `messages[0].holds` (the same add and remove lists) |
| `note`, `compare`, `detail` | the same fields on the step |
| `inner` | `inner` with `subtitle`, `steps` and `fragments` only |
| `check` `choice` | `check` with `prompt` and `options` (option `why` ≤400) |
| `check` `who` | `check` with `type: "who"`, `answer`, optional `prompt` and `why` |

Fragments (`alt`, `opt`, `loop`, `group`) keep their fields and indexes.
Holdings keep their meaning: an `alt` branch after the first starts from the
state before the fragment, and an inner sequence starts from the state just
before its parent step.

## Then

Run `node ${CLAUDE_SKILL_DIR}/scripts/validate.js <file>` and fix what it
reports, then build the file as `<concept-slug>-dataflow.html`. Set
`defaultMode` only if the network diagram should show first; a single
exchange opens on the sequence diagram.
