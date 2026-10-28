# Sequence data schema — schemaVersion 1

## Overview
The data describes an exchange between 2–8 participants as an ordered list of
steps: who sends what to whom, over which channel, with the exact message
content, the reason for it, and what each participant holds afterwards. The
view walks through the steps one at a time and can show the whole exchange as
one UML-style sequence diagram, with trust zones, fragments (alt, opt, loop)
and notes.

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
| `participants` | array | yes | 2–8 Participant objects | The lanes, left to right in this order |
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
| `kind` | string | no | one of `person`, `browser`, `app`, `server`, `service`, `database`, `device`, `other`; default `other` | Picks the small glyph |
| `zone` | string | no | a `zones[].id` | The trust zone this participant sits in |
| `holds` | string[] | no | 0–12 items, each 1–60 chars, no duplicates | What it holds before the first step |

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
| `from` | string | yes | a `participants[].id` | Sender |
| `to` | string | yes | a `participants[].id`; may equal `from` | Receiver; equal to `from` for a local or self step |
| `channel` | string | yes | a `channels[].id` | How the transition travels |
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
| `kind` | string | yes | `alt`, `opt` or `loop` | `alt`: one branch or another; `opt`: happens only sometimes; `loop`: repeats |
| `label` | string | no | ≤40 chars | Shown in the frame's tab after the kind, e.g. "state check" |
| `start` | integer | yes | step index, 0 to steps − 1 | First step inside the frame |
| `end` | integer | yes | step index, ≥ `start` | Last step inside the frame |
| `condition` | string | for `opt` and `loop` | 1–80 chars; not allowed on `alt` | The guard, shown as `[condition]` |
| `branches` | array | for `alt` | 2–4 Branch objects; not allowed on `opt` or `loop` | The alternatives, in order; the first is the main path |

Branch object: `condition` (string, 1–80 chars, required, shown as
`[condition]`), `start` and `end` (integer step indexes, required).

## Glossary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–40 chars, unique ignoring case | What `((term))` refers to |
| `definition` | string | yes | 1–300 chars, rich | Shown in a pop-over and in the glossary drawer |

## Cross-field rules
- `zones[].id`, `participants[].id` and `channels[].id` are unique within their list.
- `participants[i].zone` must match a `zones[j].id`.
- `steps[i].from` and `steps[i].to` must match a `participants[j].id`;
  `steps[i].channel` must match a `channels[j].id`.
- `kind: "self"` requires `from` equal to `to`; `from` equal to `to` requires
  `kind` to be `self` or omitted.
- `steps[i].holds` keys must be participant ids; each change must add or
  remove at least one item, and may only have the keys `add` and `remove`; an
  item may not be both added and removed in one step.
- A removed item must be held by that participant at that step, computed as
  described under Holds change.
- `participants[i].holds` has no duplicate items.
- `check.type` is `who` or `choice`. A `who` check's `answer` must be a
  participant id equal to the step's `from` and has no `options`. A `choice`
  check has a `prompt`, 2–4 `options` with exactly one `correct: true` and
  unique texts, and no `answer`.
- `fragments[i].start`, `end` and every `branches[k].start` and `end` must be
  valid step indexes, with `start` ≤ `end`.
- An `alt` fragment's branches follow each other without gaps:
  `branches[0].start` equals the fragment `start`, each next branch starts at
  the step after the previous one ends, and the last branch's `end` equals the
  fragment `end`. An `alt` has no `condition`; `opt` and `loop` have a
  `condition` and no `branches`.
- Two fragments are either separate or one lies entirely inside the other; a
  fragment inside an `alt` lies inside one of its branches.
- Every `((term))` or `((shown text|term))` mark must name a glossary term.

## Warnings (non-blocking)
- Fewer than 3 steps.
- More than 6 participants (lanes get narrow on a phone).
- A step without `wire`.
- A `payload` longer than 24 characters.
- Six or more steps and no check.
- A participant that never sends or receives a step; a channel no step uses.
- A zone with no participants, or a zone whose participants are not next to
  each other (it is drawn as separate bands).
- A holds change that adds an item the participant already holds.
- A participant holding more than 12 items at some step.
- A glossary term never marked with `((...))`.

## Complete example
OAuth 2.1 authorization code flow with PKCE: a photo-printing app asks for
read access to your photos. Build the demo with:

    node scripts/build-html.js skills/nthview-sequence --example skills/nthview-sequence/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Signing in with OAuth 2.1 and PKCE",
  "subtitle": "How a photo-printing app gets permission to read your photos without ever seeing your password, one message at a time. Amber hops pass through your browser; green hops go straight between servers.",
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
      "kind": "server",
      "zone": "provider",
      "holds": [
        "your account",
        "the app's registration"
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
