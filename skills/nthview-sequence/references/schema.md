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
OAuth 2.1 authorization code flow with PKCE: a photo-printing app asks for
read access to your photos. The authorization server is a group of five
parties; step 6 opens an inner sequence of eight steps inside it, whose step 5
opens a three-step inner sequence of its own (depth 2). Steps 3–4 are a
collapsed group. Build the demo with:

    node scripts/build-html.js skills/nthview-sequence --example skills/nthview-sequence/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Signing in with OAuth 2.1 and PKCE",
  "subtitle": "How a photo-printing app gets permission to read your photos without ever seeing your password, one message at a time. Amber hops pass through your browser; green hops go straight between servers. Step 6 opens to show what happens inside the authorization server.",
  "theme": "slate",
  "compareLabel": "Show what OAuth 2.0 still allowed here",
  "zones": [
    {
      "id": "device",
      "name": "Your device",
      "description": "You and your browser"
    },
    {
      "id": "client",
      "name": "The app's servers",
      "description": "app.example, the client that wants access"
    },
    {
      "id": "provider",
      "name": "Photo provider",
      "description": "auth.example and api.example, run by the company that stores your photos"
    }
  ],
  "participants": [
    {
      "id": "user",
      "name": "You",
      "role": "owns the photos, uses a browser",
      "kind": "person",
      "zone": "device",
      "holds": [
        "your password"
      ]
    },
    {
      "id": "app",
      "name": "Print app",
      "role": "the client, wants access",
      "kind": "app",
      "zone": "client",
      "holds": [
        "client_id",
        "client credentials",
        "registered redirect URI"
      ]
    },
    {
      "id": "auth",
      "name": "Authorization server",
      "role": "signs you in, issues tokens",
      "kind": "group",
      "zone": "provider",
      "holds": [
        "your account",
        "the app's registration"
      ],
      "members": [
        {
          "id": "token-endpoint",
          "name": "Token endpoint",
          "role": "the /token URL, runs the checks",
          "kind": "server"
        },
        {
          "id": "client-registry",
          "name": "Client registry",
          "role": "registered apps and their secrets",
          "kind": "database"
        },
        {
          "id": "grant-store",
          "name": "Grant store",
          "role": "codes, grants, what was consented",
          "kind": "database"
        },
        {
          "id": "pkce-verifier",
          "name": "PKCE verifier",
          "role": "checks verifier against challenge",
          "kind": "service"
        },
        {
          "id": "token-issuer",
          "name": "Token issuer",
          "role": "mints and signs tokens",
          "kind": "service"
        }
      ]
    },
    {
      "id": "api",
      "name": "Photo API",
      "role": "serves photos, checks tokens",
      "kind": "service",
      "zone": "provider",
      "holds": [
        "your photos",
        "token-checking keys"
      ]
    }
  ],
  "channels": [
    {
      "id": "local",
      "name": "Local, nothing sent",
      "color": "slate",
      "description": "Work done inside one party. No network involved."
    },
    {
      "id": "front",
      "name": "Front channel, through your browser",
      "color": "amber",
      "description": "Redirects and form posts. Visible in the address bar, history and to browser extensions, so nothing secret may travel here."
    },
    {
      "id": "back",
      "name": "Back channel, direct HTTPS",
      "color": "green",
      "description": "Server-to-server calls over TLS. The browser never sees them."
    }
  ],
  "steps": [
    {
      "from": "app",
      "to": "app",
      "channel": "local",
      "payload": "verifier + challenge",
      "title": "The app invents a one-time secret before anything leaves it",
      "wire": "code_verifier  = 43–128 random characters (A–Z a–z 0–9 - . _ ~)\ncode_challenge = BASE64URL( SHA-256( code_verifier ) )\nstate          = another random value, tied to your browser session\n\n→ the verifier stays inside the app\n→ only the challenge will be sent out",
      "why": "This is ((PKCE)). The app keeps a random secret and publishes only its hash. Later, whoever redeems the code must show the original secret, which nobody watching the browser has ever seen.",
      "detail": [
        {
          "label": "Who's involved",
          "text": "The print app alone. Nothing has been sent yet."
        },
        {
          "label": "What's in play",
          "text": "`code_verifier` is kept in the app's session store. `code_challenge` is its SHA-256 hash, safe to show the world. `state` lets the app recognise its own request when the answer comes back."
        },
        {
          "label": "Which spec",
          "text": "PKCE is RFC 7636. OAuth 2.1, still an IETF draft that folds 2.0 and its security advice together, makes it required for every client."
        }
      ],
      "holds": {
        "app": {
          "add": [
            "code_verifier",
            "state"
          ]
        }
      }
    },
    {
      "from": "app",
      "to": "auth",
      "kind": "async",
      "channel": "front",
      "payload": "challenge + state",
      "title": "The app sends you to the authorization server",
      "wire": "302 Found\nLocation: https://auth.example/authorize\n  ?response_type=code\n  &client_id=print-app\n  &redirect_uri=https://app.example/callback\n  &scope=photos.read\n  &state=…\n  &code_challenge=…\n  &code_challenge_method=S256",
      "why": "Your browser follows the redirect, so every parameter is visible in the address bar. That is fine: a ((client id|client_id)) is public and the challenge is only a hash. `response_type=code` asks for an ((authorization code)), never a token, on this hop.",
      "compare": {
        "label": "In OAuth 2.0",
        "text": "`response_type=token`, the implicit grant, put the access token itself in the address bar, and PKCE was optional for apps with a client secret. OAuth 2.1 drops the implicit grant and asks every client for PKCE."
      },
      "detail": [
        {
          "label": "Who's involved",
          "text": "The app builds the URL, your browser makes the request, the authorization server receives it."
        },
        {
          "label": "What's in play",
          "text": "`scope` is what the app asks for. `redirect_uri` must match the registered one exactly. The server stores the challenge next to this pending request."
        },
        {
          "label": "Worth knowing",
          "text": "The authorization server will not see the verifier until the token request, which arrives on a different channel."
        }
      ],
      "holds": {
        "auth": {
          "add": [
            "code_challenge",
            "pending request"
          ]
        }
      }
    },
    {
      "from": "user",
      "to": "auth",
      "channel": "front",
      "payload": "password or passkey",
      "title": "You sign in with the server, not with the app",
      "wire": "POST https://auth.example/login\n  username=…\n  password=…   (or a passkey, or a second factor)\n\n← 200 OK\n   Set-Cookie: session=…; Secure; HttpOnly\n   (a cookie for auth.example, not for app.example)",
      "why": "Your credentials go to the provider and nowhere else. The print app never sees them, which is the whole reason this dance exists.",
      "compare": {
        "label": "In OAuth 2.0",
        "text": "The **password grant** let the app collect your password and post it to the token endpoint itself. It defeats multi-factor sign-in and teaches people to type passwords into other sites, so OAuth 2.1 removes it."
      },
      "detail": [
        {
          "label": "Who's involved",
          "text": "You and the authorization server. The app takes no part."
        },
        {
          "label": "What's in play",
          "text": "A session cookie on the provider's own domain, which is why the next sign-in often skips this screen."
        },
        {
          "label": "Which spec",
          "text": "None. How a provider signs you in is outside OAuth."
        }
      ],
      "check": {
        "type": "who",
        "answer": "user",
        "why": "You talk to the authorization server directly. If the app sent this message, it would have to know your password."
      },
      "holds": {
        "user": {
          "add": [
            "provider session cookie"
          ]
        },
        "auth": {
          "add": [
            "your signed-in session"
          ]
        }
      }
    },
    {
      "from": "auth",
      "to": "user",
      "channel": "front",
      "payload": "consent screen",
      "title": "The server asks what you allow",
      "wire": "Print app (app.example) would like to:\n\n  ✓  See your photos (read only)\n\n  It will not be able to delete or share them.\n\n  [ Cancel ]      [ Allow ]",
      "why": "Pressing Allow writes a **grant** on the provider's side: this app, this user, this ((scope)). Revoking access later deletes that record; the tokens built on it stop working at their next use.",
      "detail": [
        {
          "label": "Who's involved",
          "text": "You and the authorization server."
        },
        {
          "label": "What's in play",
          "text": "The grant record. It outlives every token issued from it."
        },
        {
          "label": "Worth knowing",
          "text": "Authentication (who you are, the step before) and authorization (what you allow, this step) share a screen but are different decisions."
        }
      ],
      "holds": {
        "auth": {
          "add": [
            "grant: photos.read for print-app"
          ]
        }
      }
    },
    {
      "from": "auth",
      "to": "app",
      "kind": "async",
      "channel": "front",
      "payload": "code + state",
      "title": "A short-lived code comes back through your browser",
      "wire": "302 Found\nLocation: https://app.example/callback\n  ?code=…\n  &state=…\n\n→ the app compares state with the value it stored in step 1",
      "why": "The ((authorization code)) is single-use, expires within about a minute, and is useless without the verifier. That is exactly why it is the only thing allowed to travel through the browser.",
      "compare": {
        "label": "In OAuth 2.0",
        "text": "Many servers accepted wildcard redirect URIs such as `https://app.example/*`. Combined with one open redirect on the app, that leaked codes to attackers. OAuth 2.1 requires an exact string match."
      },
      "note": {
        "severity": "warning",
        "text": "The code is now in browser history and visible to anything that can read the address bar. Treat every front-channel value as public."
      },
      "detail": [
        {
          "label": "Who's involved",
          "text": "The authorization server issues the redirect, your browser follows it, the app's callback receives it."
        },
        {
          "label": "What's in play",
          "text": "`code`, an opaque one-time ticket bound to the challenge. `state`, echoed back unchanged."
        }
      ],
      "holds": {
        "app": {
          "add": [
            "authorization code"
          ]
        },
        "auth": {
          "remove": [
            "pending request"
          ],
          "add": [
            "issued code"
          ]
        }
      }
    },
    {
      "from": "app",
      "to": "auth",
      "channel": "back",
      "payload": "code + verifier",
      "title": "The app redeems the code over the back channel",
      "wire": "POST https://auth.example/token\nAuthorization: Basic …   (client authentication)\nContent-Type: application/x-www-form-urlencoded\n\ngrant_type=authorization_code\n&code=…\n&redirect_uri=https://app.example/callback\n&code_verifier=…",
      "why": "No browser in the middle now. The server hashes the verifier and compares it with the challenge it stored; only the party that started the flow can pass that test.",
      "check": {
        "type": "choice",
        "prompt": "The code travelled through your browser. What stops someone who copied it from redeeming it?",
        "options": [
          {
            "text": "The code_verifier, which only the app holds",
            "correct": true,
            "why": "The server will only issue tokens if SHA-256 of the verifier equals the challenge from step 2, and the verifier never left the app."
          },
          {
            "text": "The state value",
            "why": "`state` protects the app from accepting a response it never asked for (a ((CSRF)) defence). It does not stop a thief from redeeming a stolen code."
          },
          {
            "text": "The code is encrypted",
            "why": "It is not. The code is an opaque random string, readable by anyone who sees the URL."
          },
          {
            "text": "Nothing; that is why the code expires quickly",
            "why": "A short lifetime narrows the window but does not close it. PKCE is what makes a stolen code worthless."
          }
        ]
      },
      "detail": [
        {
          "label": "Who's involved",
          "text": "The app's backend and the token endpoint, over direct HTTPS."
        },
        {
          "label": "What the server checks",
          "text": "The code is unused and unexpired; the client authenticates; the redirect URI is identical to step 2; SHA-256 of the verifier equals the stored challenge."
        },
        {
          "label": "Which spec",
          "text": "The OAuth token endpoint, plus RFC 7636 for the verifier check."
        }
      ],
      "holds": {
        "auth": {
          "remove": [
            "issued code"
          ],
          "add": [
            "used-code record"
          ]
        }
      },
      "inner": {
        "subtitle": "One outer message, eight hops inside the provider: the request arrives at the token endpoint, which consults three internal services before anything is issued.",
        "channels": [
          {
            "id": "internal",
            "name": "Inside the provider",
            "color": "teal",
            "description": "Calls between the authorization server's own components, on its private network."
          }
        ],
        "glossary": [
          {
            "term": "client authentication",
            "definition": "The app proving it is the registered client, for example with a secret over HTTP Basic or a signed assertion."
          }
        ],
        "steps": [
          {
            "from": "app",
            "to": "token-endpoint",
            "channel": "back",
            "payload": "code + verifier",
            "title": "The request from step 6 arrives at the token endpoint",
            "wire": "POST /token   (from the app's backend, over TLS)\nAuthorization: Basic …\n\ngrant_type=authorization_code\n&code=…\n&redirect_uri=https://app.example/callback\n&code_verifier=…\n\n→ nothing is trusted yet; four checks follow",
            "why": "This is the outer message seen from inside. The token endpoint is only a front door: it parses the form and asks the provider's own services before it answers.",
            "holds": {
              "token-endpoint": {
                "add": [
                  "code from the request",
                  "verifier from the request"
                ]
              }
            }
          },
          {
            "from": "token-endpoint",
            "to": "client-registry",
            "channel": "internal",
            "payload": "client_id + secret",
            "title": "Is this really the registered print app?",
            "wire": "lookup client_id = print-app\n  secret matches the stored hash         ✓\n  redirect URI on file:\n    https://app.example/callback        ✓ exact match\n\n← client ok",
            "why": "((client authentication)) comes first, so a stranger who copied the code cannot even reach the PKCE check. The redirect URI must match the registered one character for character.",
            "detail": [
              {
                "label": "Worth knowing",
                "text": "Public clients such as mobile apps have no secret; for them PKCE is the only proof, which is why OAuth 2.1 requires it everywhere."
              }
            ]
          },
          {
            "from": "token-endpoint",
            "to": "grant-store",
            "channel": "internal",
            "payload": "look up the code",
            "title": "The token endpoint looks up the code",
            "wire": "find code = …\n  issued to    print-app\n  for user     you\n  scope        photos.read\n  challenge    … (from step 2)\n  expires      in 41 s\n  used         no",
            "why": "The code is only a key to a record the provider kept. Everything that matters, who consented to what and which challenge was sent, lives in that record, not in the code.",
            "check": {
              "type": "choice",
              "prompt": "Suppose the grant store answered **used: yes**. What should the token endpoint do?",
              "options": [
                {
                  "text": "Refuse, and revoke the tokens already issued for that code",
                  "correct": true,
                  "why": "A second redemption means someone else has the code. OAuth advises revoking what the first redemption produced, because the server cannot tell which caller was honest."
                },
                {
                  "text": "Issue the tokens again; the app probably retried",
                  "why": "A retry with the same code is indistinguishable from a replay by a thief, so the code is single-use with no exceptions."
                },
                {
                  "text": "Ask you to sign in again",
                  "why": "You are not part of this back-channel call; the server has no way to reach you here."
                }
              ]
            }
          },
          {
            "from": "grant-store",
            "to": "token-endpoint",
            "kind": "return",
            "channel": "internal",
            "payload": "grant + challenge",
            "title": "The grant store answers and burns the code",
            "wire": "← grant record   user, print-app, photos.read\n← code_challenge …\n→ code marked used, in the same transaction",
            "why": "Marking the code used in the same transaction as the lookup closes the race where two requests redeem one code at the same moment.",
            "holds": {
              "token-endpoint": {
                "add": [
                  "stored code_challenge",
                  "grant record"
                ]
              },
              "auth": {
                "remove": [
                  "issued code"
                ],
                "add": [
                  "used-code record"
                ]
              }
            }
          },
          {
            "from": "token-endpoint",
            "to": "pkce-verifier",
            "channel": "internal",
            "payload": "verifier + challenge",
            "title": "The PKCE verifier compares the two halves",
            "wire": "verifier   from this request\nchallenge  stored with the code in step 2\n\n→ hash the verifier, compare with the challenge",
            "why": "Only the app that created the verifier in step 1 can make this comparison succeed. Open the inner sequence to see the comparison itself.",
            "inner": {
              "glossary": [
                {
                  "term": "constant-time comparison",
                  "definition": "Comparing two values in a way that always takes the same time, so an attacker cannot learn how many leading characters matched."
                }
              ],
              "participants": [
                {
                  "id": "sha256",
                  "name": "SHA-256",
                  "role": "a one-way hash function",
                  "kind": "service"
                }
              ],
              "steps": [
                {
                  "from": "pkce-verifier",
                  "to": "sha256",
                  "channel": "local",
                  "payload": "code_verifier",
                  "title": "Hash the verifier",
                  "wire": "input   ASCII bytes of the code_verifier (43–128 characters)",
                  "why": "SHA-256 is one-way: the challenge seen in the browser gives no route back to the verifier."
                },
                {
                  "from": "sha256",
                  "to": "pkce-verifier",
                  "kind": "return",
                  "channel": "local",
                  "payload": "32-byte digest",
                  "title": "The digest comes back",
                  "wire": "← 32 bytes",
                  "why": "The same verifier always gives the same 32 bytes, so the app and the server agree without sharing anything secret in advance.",
                  "holds": {
                    "pkce-verifier": {
                      "add": [
                        "digest"
                      ]
                    }
                  }
                },
                {
                  "from": "pkce-verifier",
                  "to": "pkce-verifier",
                  "channel": "local",
                  "payload": "encode and compare",
                  "title": "Encode and compare",
                  "wire": "BASE64URL(digest), no padding  =?  stored code_challenge\n→ equal: PKCE passes\n→ different: invalid_grant, no tokens",
                  "why": "The comparison is a ((constant-time comparison)) so its timing reveals nothing. A mismatch ends the request with `invalid_grant`.",
                  "holds": {
                    "pkce-verifier": {
                      "remove": [
                        "digest"
                      ]
                    }
                  }
                }
              ]
            }
          },
          {
            "from": "pkce-verifier",
            "to": "token-endpoint",
            "kind": "return",
            "channel": "internal",
            "payload": "match",
            "title": "The verifier matches the challenge",
            "wire": "← PKCE ok\n→ all four checks passed: client, code, redirect URI, verifier",
            "why": "Every check has passed, so the caller is the client that started the flow and the code is fresh and unused."
          },
          {
            "from": "token-endpoint",
            "to": "token-issuer",
            "channel": "internal",
            "payload": "grant + audience",
            "title": "The token issuer mints the tokens",
            "wire": "access token claims\n  iss    https://auth.example\n  sub    (your user id)\n  aud    https://api.example\n  scope  photos.read\n  exp    now + 3600 s\n→ signed with the provider's current signing key\n← access token, refresh token",
            "why": "The access token names its audience, the photo API, so another API must refuse it. The refresh token is stored against the grant, which is how revoking the grant later cuts off renewals.",
            "holds": {
              "token-endpoint": {
                "add": [
                  "access token",
                  "refresh token"
                ]
              }
            }
          },
          {
            "from": "token-endpoint",
            "to": "app",
            "kind": "return",
            "channel": "back",
            "payload": "access + refresh token",
            "title": "The reply leaves the provider: step 7 in the main sequence",
            "wire": "200 OK\nCache-Control: no-store\n{ \"access_token\": \"…\", \"refresh_token\": \"…\", … }",
            "why": "This is the reply the main sequence shows as step 7. `Cache-Control: no-store` keeps the tokens out of any cache on the way.",
            "holds": {
              "token-endpoint": {
                "remove": [
                  "code from the request",
                  "verifier from the request",
                  "stored code_challenge",
                  "grant record",
                  "access token",
                  "refresh token"
                ]
              }
            }
          }
        ]
      }
    },
    {
      "from": "auth",
      "to": "app",
      "kind": "return",
      "channel": "back",
      "payload": "access + refresh token",
      "title": "The server issues the tokens",
      "wire": "200 OK\nContent-Type: application/json\nCache-Control: no-store\n\n{\n  \"access_token\":  \"…\",\n  \"token_type\":    \"Bearer\",\n  \"expires_in\":    3600,\n  \"refresh_token\": \"…\",\n  \"scope\":         \"photos.read\"\n}",
      "why": "The ((access token)) lets the app call the API for an hour. The ((refresh token)) lets it get a new one later without bothering you. Read the returned `scope`: it may be narrower than what was asked for.",
      "detail": [
        {
          "label": "What's in play",
          "text": "Two tokens with different jobs. The access token goes to the API; the refresh token goes back only to the authorization server."
        },
        {
          "label": "Worth knowing",
          "text": "The code, verifier and state have done their jobs, so the app throws them away."
        }
      ],
      "holds": {
        "app": {
          "remove": [
            "authorization code",
            "code_verifier",
            "state"
          ],
          "add": [
            "access token",
            "refresh token"
          ]
        }
      }
    },
    {
      "from": "app",
      "to": "app",
      "channel": "local",
      "payload": "stop, discard code",
      "title": "If state does not match, the app stops",
      "wire": "callback received:  state = (missing or different)\nstored for session: state = …\n\n→ mismatch: show an error, discard the code,\n  never call the token endpoint",
      "why": "A response the app never asked for may be an attacker trying to log you into their account, or to feed the app a code from another session. Refusing it costs nothing; accepting it could connect your session to someone else's photos.",
      "note": {
        "severity": "danger",
        "text": "Skipping this check is a classic ((CSRF)) bug. PKCE also catches injected codes at the token endpoint, but the state check stops the flow before any request is made."
      },
      "detail": [
        {
          "label": "Who's involved",
          "text": "The app alone."
        },
        {
          "label": "Worth knowing",
          "text": "This is the alternative branch. The main path continues with the API call."
        }
      ],
      "holds": {
        "app": {
          "remove": [
            "authorization code",
            "code_verifier",
            "state"
          ]
        }
      }
    },
    {
      "from": "app",
      "to": "api",
      "channel": "back",
      "payload": "Bearer access token",
      "title": "The app calls the API with the access token",
      "wire": "GET https://api.example/v1/photos?album=holiday\nAuthorization: Bearer …\n\n← 200 OK  [ 24 photos ]\n\n→ the API checks the token's issuer, audience,\n  expiry, signature and scope before answering",
      "why": "A ((bearer token)) works for whoever holds it, so it travels only in a header over TLS and lives about an hour. The API never talks to you or to the app's login; it only judges the token.",
      "compare": {
        "label": "In OAuth 2.0",
        "text": "Sending the token in the query string, `?access_token=…`, was permitted. Query strings end up in logs and browser history. OAuth 2.1 forbids it."
      },
      "note": {
        "severity": "info",
        "text": "The audience check matters most: a token minted for a different API must be refused even though its signature is valid."
      },
      "check": {
        "type": "who",
        "answer": "app",
        "why": "The app's backend holds the access token, so it is the one that calls the API. You are not involved at all."
      },
      "detail": [
        {
          "label": "Who's involved",
          "text": "The app's backend and the photo API. The authorization server is not contacted when the token is self-contained."
        },
        {
          "label": "Which spec",
          "text": "Bearer token usage, RFC 6750, carried into OAuth 2.1."
        }
      ]
    },
    {
      "from": "app",
      "to": "auth",
      "channel": "back",
      "payload": "refresh_token",
      "title": "An hour later, the app renews quietly",
      "wire": "POST https://auth.example/token\nAuthorization: Basic …\n\ngrant_type=refresh_token\n&refresh_token=…\n\n← 200 OK\n   { \"access_token\": \"…\", \"refresh_token\": \"…\" }\n   (a new refresh token: the old one is now dead)",
      "why": "You notice nothing. This is why apps keep working for months, and why revoking the grant stops them at the next renewal.",
      "compare": {
        "label": "In OAuth 2.0",
        "text": "A stolen refresh token could be replayed indefinitely. OAuth 2.1 requires public clients to rotate it on every use or bind it to the client, so a replayed old token can be detected."
      },
      "detail": [
        {
          "label": "Who's involved",
          "text": "The app's backend and the token endpoint. You may be asleep."
        },
        {
          "label": "Worth knowing",
          "text": "A refresh can narrow the scope but never widen it. Asking for more sends you back to the consent screen."
        }
      ],
      "holds": {
        "app": {
          "remove": [
            "access token",
            "refresh token"
          ],
          "add": [
            "new access token",
            "rotated refresh token"
          ]
        },
        "auth": {
          "add": [
            "rotation history"
          ]
        }
      }
    }
  ],
  "fragments": [
    {
      "kind": "group",
      "label": "Sign-in and consent",
      "summary": "You sign in with the provider and approve what the app may see. The app takes no part in either step.",
      "start": 2,
      "end": 3
    },
    {
      "kind": "alt",
      "label": "state check",
      "start": 5,
      "end": 7,
      "branches": [
        {
          "condition": "state matches what the app stored",
          "start": 5,
          "end": 6
        },
        {
          "condition": "state is missing or different",
          "start": 7,
          "end": 7
        }
      ]
    },
    {
      "kind": "loop",
      "label": "renewal",
      "condition": "each time the access token expires, while the grant stands",
      "start": 9,
      "end": 9
    }
  ],
  "glossary": [
    {
      "term": "PKCE",
      "definition": "Proof Key for Code Exchange (say \"pixie\"). The app sends a hash first and the secret behind it later, so only the app that started a sign-in can finish it."
    },
    {
      "term": "client_id",
      "definition": "The public name of an app registered with the authorization server. Not a secret."
    },
    {
      "term": "authorization code",
      "definition": "A one-time, short-lived ticket the app trades for tokens over the back channel."
    },
    {
      "term": "scope",
      "definition": "A named permission such as photos.read. The app asks for scopes; you and the server decide which it gets."
    },
    {
      "term": "access token",
      "definition": "The credential the app shows the API. Short-lived, limited to the granted scopes."
    },
    {
      "term": "refresh token",
      "definition": "A longer-lived credential the app uses only at the authorization server, to get new access tokens."
    },
    {
      "term": "bearer token",
      "definition": "A token that works for whoever presents it, like cash. It must be kept off URLs and logs."
    },
    {
      "term": "CSRF",
      "definition": "Cross-site request forgery: tricking a browser into sending a request the user never meant to make, here a forged sign-in response."
    }
  ],
  "closing": [
    "Two ideas carry the whole flow. Anything that passes through the browser is treated as public, so only a short-lived code goes that way. And the code is worthless without the verifier, which never leaves the app until it is sent straight to the server."
  ]
}
```
