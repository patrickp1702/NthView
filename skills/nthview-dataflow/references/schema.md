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
disappear from one version to the next.

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
| `versions` | array | no | 0–8 Version objects, in chronological order | The time machine. Absent or fewer than 2 entries: no timeline is shown |
| `versionsLabel` | string | no | 1–24 chars; default "Version" | Label beside the timeline, e.g. "Spec" |
| `zones` | array | no | 0–10 Zone objects | Labelled groups the entities sit in |
| `entities` | array | yes | 2–40 Entity objects | Every party that sends or receives something |
| `links` | array | no | 0–80 Link objects | Declared connections, labelled by protocol or medium |
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

## Link object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `from` | string | yes | an entity id | One end |
| `to` | string | yes | an entity id, not equal to `from`; the unordered pair is unique among links | The other end |
| `label` | string | no | ≤24 chars | Protocol or medium pill on the line, e.g. "MCP", "ISO 8583", "HTTPS" |

Messages between two entities with no declared link are still drawn, on a
dashed line without a label.

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
| `steps` | array | yes | 1–30 Step objects | The numbered steps, in order |

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

## Complete example
How a card payment is authorised: shopper, checkout page, payment gateway,
acquiring bank, card network, issuing bank with its fraud service, access
control server and ledger, in five topics over two versions of the
authentication step (3-D Secure 1 and 3-D Secure 2). Build the demo with:

    node scripts/build-html.js skills/nthview-dataflow --example skills/nthview-dataflow/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Card payments explained",
  "kicker": "Online card payments",
  "heading": "What happens when you pay by card?",
  "lead": "When you pay with a card online, the shop never talks to your bank. The request travels through a payment gateway, the shop's bank and the card network to **your** bank, which checks the card, the risk and the balance and answers in about a second. This explainer follows every message on that path, from the first tap to the money arriving days later.",
  "facts": [
    {
      "term": "Issuer",
      "text": "the bank that gave you the card; it says yes or no"
    },
    {
      "term": "Acquirer",
      "text": "the shop's bank; it collects the money on the shop's behalf"
    },
    {
      "term": "Card network",
      "text": "the rails between the two banks, which route by card number and settle the totals"
    },
    {
      "term": "Gateway",
      "text": "the service the shop integrates; it turns a web request into a bank message and keeps the card number out of the shop"
    },
    {
      "term": "Not a transfer",
      "text": "an authorisation moves no money. It places a hold; the money moves days later at settlement"
    }
  ],
  "startLabel": "Start the lessons",
  "jumps": [
    "authentication",
    "declines"
  ],
  "theme": "graphite",
  "versions": [
    {
      "id": "3ds1",
      "label": "3-D Secure 1",
      "date": "2001",
      "note": "Static passwords on a full-page redirect to the bank. Retired by the networks in October 2022."
    },
    {
      "id": "3ds2",
      "label": "3-D Secure 2",
      "date": "2016 onward",
      "note": "Device data, risk-based decisions and in-page challenges. The version in use today.",
      "default": true
    }
  ],
  "versionsLabel": "Authentication",
  "zones": [
    {
      "id": "device",
      "name": "SHOPPER'S DEVICE",
      "subtitle": "browser or app"
    },
    {
      "id": "merchant",
      "name": "MERCHANT",
      "subtitle": "shop and its gateway"
    },
    {
      "id": "acquiring",
      "name": "ACQUIRER",
      "subtitle": "the shop's bank",
      "remote": true
    },
    {
      "id": "scheme",
      "name": "CARD NETWORK",
      "subtitle": "the rails",
      "remote": true
    },
    {
      "id": "issuing",
      "name": "ISSUER",
      "subtitle": "the shopper's bank",
      "remote": true
    }
  ],
  "entities": [
    {
      "id": "shopper",
      "name": "Shopper",
      "subtitle": "you",
      "kind": "person",
      "zone": "device"
    },
    {
      "id": "checkout",
      "name": "Checkout page",
      "subtitle": "shop.example",
      "kind": "browser",
      "zone": "device"
    },
    {
      "id": "shop",
      "name": "Shop backend",
      "subtitle": "orders and tokens",
      "kind": "app",
      "zone": "merchant"
    },
    {
      "id": "gateway",
      "name": "Payment gateway",
      "subtitle": "pay.example",
      "kind": "gateway",
      "zone": "merchant"
    },
    {
      "id": "acquirer",
      "name": "Acquiring bank",
      "subtitle": "merchant account",
      "kind": "bank",
      "zone": "acquiring"
    },
    {
      "id": "network",
      "name": "Card network",
      "subtitle": "routes by card number",
      "kind": "network",
      "zone": "scheme"
    },
    {
      "id": "directory",
      "name": "Directory server",
      "subtitle": "3-D Secure lookup",
      "kind": "server",
      "zone": "scheme"
    },
    {
      "id": "issuer",
      "name": "Issuing bank",
      "subtitle": "authorisation host",
      "kind": "bank",
      "zone": "issuing"
    },
    {
      "id": "fraud",
      "name": "Fraud service",
      "subtitle": "risk scoring",
      "kind": "service",
      "zone": "issuing"
    },
    {
      "id": "acs",
      "name": "Access control server",
      "subtitle": "challenges the shopper",
      "kind": "server",
      "zone": "issuing"
    },
    {
      "id": "ledger",
      "name": "Ledger",
      "subtitle": "balances and holds",
      "kind": "database",
      "zone": "issuing"
    }
  ],
  "links": [
    {
      "from": "shopper",
      "to": "checkout",
      "label": "taps"
    },
    {
      "from": "checkout",
      "to": "shop",
      "label": "HTTPS"
    },
    {
      "from": "checkout",
      "to": "gateway",
      "label": "HTTPS"
    },
    {
      "from": "shop",
      "to": "gateway",
      "label": "REST API"
    },
    {
      "from": "gateway",
      "to": "acquirer",
      "label": "ISO 8583"
    },
    {
      "from": "acquirer",
      "to": "network",
      "label": "ISO 8583"
    },
    {
      "from": "network",
      "to": "issuer",
      "label": "ISO 8583"
    },
    {
      "from": "issuer",
      "to": "fraud",
      "label": "internal"
    },
    {
      "from": "issuer",
      "to": "ledger",
      "label": "internal"
    },
    {
      "from": "gateway",
      "to": "directory",
      "label": "3-D Secure"
    },
    {
      "from": "directory",
      "to": "acs",
      "label": "3-D Secure"
    },
    {
      "from": "checkout",
      "to": "acs",
      "label": "HTTPS"
    },
    {
      "from": "acs",
      "to": "fraud",
      "label": "internal"
    }
  ],
  "sections": [
    {
      "title": "Checkout",
      "topics": [
        {
          "id": "capture",
          "title": "Capture the card",
          "subtitle": "From the card form to a token",
          "article": {
            "body": [
              "The shop wants to be paid, but it does not want to hold your card number: anyone who stores card numbers has to prove, every year, that they protect them. So the checkout page hands the number straight to the **payment gateway**, which gives back a **token**, a stand-in that is useless outside that gateway. The shop keeps the token and never sees the number.",
              "Everything the shop does later, authorising, capturing, refunding, refers to the token or to a payment id the gateway issued. The card number crosses the merchant's systems exactly zero times."
            ],
            "referencesLabel": "Background",
            "references": [
              {
                "label": "PCI DSS overview",
                "url": "https://www.pcisecuritystandards.org/standards/pci-dss/"
              }
            ]
          },
          "steps": [
            {
              "title": "Enter the card",
              "explanation": "You type the card number, expiry and security code into a form. The form belongs to the shop's page, but its fields are served by the gateway, so the shop's own code never reads them.",
              "messages": [
                {
                  "from": "shopper",
                  "to": "checkout",
                  "name": "type card details",
                  "info": "number, expiry, CVV, name",
                  "kind": "transport"
                }
              ]
            },
            {
              "title": "Tokenise",
              "explanation": "The page posts the card data to the gateway and gets a token back. The gateway stores the real number in its vault; the token is just a reference to it.",
              "check": {
                "prompt": "Why does the page send the card number to the gateway rather than to the shop's own server?",
                "options": [
                  {
                    "text": "So the shop never stores card numbers and its security audit covers far less",
                    "correct": true,
                    "why": "Right. The fewer systems that touch the number, the smaller the surface an attacker can hit and the smaller the compliance scope the shop must prove every year."
                  },
                  {
                    "text": "Because browsers cannot post card numbers to the same site that served the page",
                    "why": "Browsers do not care what a field contains. The choice is about who is allowed to hold the number, not about what is technically possible."
                  },
                  {
                    "text": "Because the gateway needs the shopper's IP address for fraud checks",
                    "why": "The gateway may collect device data, but that would work through the shop's server too. Keeping the number out of the shop is the reason."
                  }
                ]
              },
              "messages": [
                {
                  "from": "checkout",
                  "to": "gateway",
                  "name": "POST /v1/tokens",
                  "info": "card data, over TLS",
                  "kind": "request",
                  "size": "210 B",
                  "payload": {
                    "card": {
                      "number": "4111 1111 1111 1111",
                      "expMonth": 9,
                      "expYear": 2028,
                      "cvc": "123"
                    },
                    "billing": {
                      "name": "A. Shopper",
                      "postalCode": "10115"
                    }
                  },
                  "annotations": [
                    {
                      "field": "card.number",
                      "text": "The primary account number (PAN). The first six to eight digits, the BIN, identify the issuing bank."
                    },
                    {
                      "field": "card.cvc",
                      "text": "The three-digit code from the back. It may never be stored after authorisation, by anyone, not even the gateway."
                    },
                    {
                      "field": "billing.postalCode",
                      "text": "Used by the issuer for address verification; a mismatch lowers the risk score but rarely declines on its own."
                    }
                  ]
                },
                {
                  "from": "gateway",
                  "to": "checkout",
                  "name": "201 Created",
                  "info": "token, last four digits, brand",
                  "kind": "response",
                  "size": "140 B",
                  "payload": {
                    "token": "tok_7f3a9c2e1b",
                    "last4": "1111",
                    "brand": "visa",
                    "expMonth": 9,
                    "expYear": 2028
                  },
                  "annotations": [
                    {
                      "field": "token",
                      "text": "A random id meaningful only inside this gateway. Stealing it from the shop gives an attacker nothing."
                    },
                    {
                      "field": "last4",
                      "text": "Enough for the shopper to recognise the card on a receipt; not enough to reconstruct the number."
                    }
                  ]
                }
              ]
            },
            {
              "title": "Place the order",
              "explanation": "The page sends the token to the shop with the basket. The shop creates the order, then asks the gateway to create a payment for the amount, naming the token. Nothing has reached a bank yet.",
              "messages": [
                {
                  "from": "checkout",
                  "to": "shop",
                  "name": "POST /orders",
                  "info": "basket and token",
                  "kind": "request",
                  "payload": {
                    "items": [
                      {
                        "sku": "lamp-01",
                        "qty": 1,
                        "price": 4995
                      }
                    ],
                    "currency": "EUR",
                    "paymentToken": "tok_7f3a9c2e1b"
                  },
                  "annotations": [
                    {
                      "field": "price",
                      "text": "Amounts travel as integers in the minor unit: 4995 is 49.95 euro. Floating point never touches money."
                    },
                    {
                      "field": "paymentToken",
                      "text": "The only card-related value the shop ever stores."
                    }
                  ]
                },
                {
                  "from": "shop",
                  "to": "gateway",
                  "name": "POST /v1/payments",
                  "info": "amount, token, 3-D Secure requested",
                  "kind": "request",
                  "payload": {
                    "amount": 4995,
                    "currency": "EUR",
                    "source": "tok_7f3a9c2e1b",
                    "authenticate": "when-required",
                    "capture": false,
                    "reference": "order-20481"
                  },
                  "annotations": [
                    {
                      "field": "capture",
                      "text": "false asks for authorisation only. The shop captures later, when it ships; see the settlement topic."
                    },
                    {
                      "field": "authenticate",
                      "text": "Lets the gateway decide whether to run 3-D Secure before asking the bank."
                    }
                  ]
                },
                {
                  "from": "gateway",
                  "to": "shop",
                  "name": "202 Accepted",
                  "info": "payment id, status pending",
                  "kind": "response",
                  "payload": {
                    "id": "pay_01HZX8",
                    "status": "requires_authentication",
                    "next": "3ds"
                  }
                }
              ]
            }
          ]
        },
        {
          "id": "authentication",
          "title": "Authenticate the shopper",
          "subtitle": "3-D Secure: is it really you?",
          "article": {
            "body": [
              "Authorisation asks the bank whether the card is good for the amount. **Authentication** asks a different question: is the person typing really the cardholder? 3-D Secure is the protocol the card networks use for that. Three domains take part: the merchant's (the gateway's 3-D Secure server), the network's (a directory server that finds the right bank) and the issuer's (an access control server, ACS, that decides whether to challenge you and how).",
              "The two versions differ sharply. The first generation redirected you to a bank page that asked for a static password; shoppers abandoned carts and forgot passwords. The second generation sends the bank a hundred or so data points about the device and the purchase and lets the bank wave most payments through without asking anything. When it does ask, it does so in a small window on the shop's page, usually with a one-time code or an approval in the bank's app."
            ],
            "referencesLabel": "Specs",
            "references": [
              {
                "label": "EMV 3-D Secure",
                "url": "https://www.emvco.com/emv-technologies/3-d-secure/"
              }
            ],
            "versionNotes": [
              {
                "version": "3ds2",
                "heading": "What changed in 3-D Secure 2",
                "items": [
                  "The verify-enrolment round trip is gone; one authentication request carries device and transaction data.",
                  "Most payments are approved frictionless, without a challenge.",
                  "Challenges happen in-page, with one-time codes or app approval instead of static passwords.",
                  "Merchants can request exemptions, and issuers can answer a soft decline that asks for authentication."
                ]
              }
            ],
            "boxes": [
              {
                "title": "Why it matters",
                "tone": "attention",
                "items": [
                  {
                    "text": "A payment that passed authentication shifts fraud liability from the shop to the issuer."
                  },
                  {
                    "text": "In some regions regulation requires strong customer authentication for most online payments.",
                    "tag": "regional"
                  }
                ]
              }
            ]
          },
          "steps": [
            {
              "title": "Send the authentication request",
              "explanation": "The gateway's 3-D Secure server sends an authentication request to the directory server, which forwards it to the issuer's access control server. It carries the amount, the merchant and dozens of facts about your browser and device.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "directory",
                  "name": "AReq",
                  "info": "authentication request with device data",
                  "size": "4 KB",
                  "payload": {
                    "messageType": "AReq",
                    "messageVersion": "2.2.0",
                    "threeDSServerTransID": "8a880dc0-d2d2-4067-bcb1-b08d1690b26e",
                    "acctNumber": "4111111111111111",
                    "purchaseAmount": "4995",
                    "purchaseCurrency": "978",
                    "merchantName": "Lamp Shop",
                    "browserUserAgent": "Mozilla/5.0 …",
                    "browserIP": "203.0.113.42",
                    "browserJavaEnabled": false,
                    "browserScreenHeight": "1080",
                    "deviceChannel": "02",
                    "threeDSRequestorChallengeInd": "01"
                  },
                  "annotations": [
                    {
                      "field": "deviceChannel",
                      "text": "02 means a browser; 01 is an app, 03 a merchant-initiated payment with no shopper present."
                    },
                    {
                      "field": "threeDSRequestorChallengeInd",
                      "text": "What the merchant prefers: 01 no preference, 02 no challenge requested, 03 challenge requested, 04 challenge mandated."
                    },
                    {
                      "field": "browserIP",
                      "text": "One of about a hundred optional data points the issuer feeds into its risk model."
                    }
                  ]
                },
                {
                  "from": "directory",
                  "to": "acs",
                  "name": "AReq",
                  "info": "routed by the card's BIN range",
                  "size": "4 KB"
                },
                {
                  "from": "acs",
                  "to": "fraud",
                  "name": "score",
                  "info": "device, history, amount, merchant",
                  "kind": "local"
                },
                {
                  "from": "fraud",
                  "to": "acs",
                  "name": "risk: medium",
                  "info": "new device for this card",
                  "kind": "response"
                }
              ],
              "versions": {
                "3ds1": {
                  "title": "Verify enrolment",
                  "explanation": "The gateway first asks the directory server whether this card is enrolled in 3-D Secure at all. The directory forwards the question to the issuer and returns the answer with the address of the bank's page.",
                  "messages": [
                    {
                      "from": "gateway",
                      "to": "directory",
                      "name": "VEReq",
                      "info": "verify enrolment for this card number",
                      "tags": [
                        "deprecated"
                      ],
                      "payload": "<Message id=\"1\">\n  <VEReq>\n    <version>1.0.2</version>\n    <pan>4111111111111111</pan>\n    <Merchant><acqBIN>123456</acqBIN><merID>lamp-shop</merID></Merchant>\n  </VEReq>\n</Message>",
                      "annotations": [
                        {
                          "field": "VEReq",
                          "text": "Verify Enrolment Request, an XML message. It asks only whether the card can be authenticated."
                        }
                      ]
                    },
                    {
                      "from": "directory",
                      "to": "acs",
                      "name": "VEReq",
                      "info": "is this card enrolled?",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "acs",
                      "to": "directory",
                      "name": "VERes",
                      "info": "enrolled = Y, ACS URL",
                      "kind": "response",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "directory",
                      "to": "gateway",
                      "name": "VERes",
                      "info": "enrolled = Y, ACS URL",
                      "kind": "response",
                      "tags": [
                        "deprecated"
                      ],
                      "payload": "<Message id=\"1\">\n  <VERes>\n    <version>1.0.2</version>\n    <CH><enrolled>Y</enrolled><acctID>…</acctID></CH>\n    <url>https://acs.bank.example/pareq</url>\n  </VERes>\n</Message>"
                    }
                  ]
                }
              }
            },
            {
              "title": "Challenge the shopper",
              "explanation": "The issuer decided it wants more. The checkout page opens a small window served by the bank's access control server; you confirm with a one-time code or by approving in your banking app.",
              "check": {
                "prompt": "In 3-D Secure 2, what does the bank base its decision to challenge on?",
                "options": [
                  {
                    "text": "The device and transaction data in the authentication request, scored against the card's history",
                    "correct": true,
                    "why": "Right. Risk-based authentication is the whole point of the second version: the bank sees enough to approve most payments silently and challenges only the unusual ones."
                  },
                  {
                    "text": "A static password the shopper registered with the bank",
                    "why": "That was the first version. Static passwords were forgotten, phished and abandoned; the second version removed them."
                  },
                  {
                    "text": "The shop's reputation score at the card network",
                    "why": "The merchant's identity is one input among many, but the decision belongs to the issuer and rests on the shopper's device and behaviour."
                  }
                ]
              },
              "messages": [
                {
                  "from": "acs",
                  "to": "directory",
                  "name": "ARes",
                  "info": "transStatus = C, challenge required",
                  "kind": "response",
                  "payload": {
                    "messageType": "ARes",
                    "transStatus": "C",
                    "acsURL": "https://acs.bank.example/challenge",
                    "acsTransID": "d7c45b2e-…",
                    "dsTransID": "f1a3c9…"
                  },
                  "annotations": [
                    {
                      "field": "transStatus",
                      "text": "Y authenticated, N not authenticated, C challenge required, A attempted, U unavailable, R rejected."
                    }
                  ]
                },
                {
                  "from": "directory",
                  "to": "gateway",
                  "name": "ARes",
                  "info": "transStatus = C",
                  "kind": "response"
                },
                {
                  "from": "checkout",
                  "to": "acs",
                  "name": "CReq",
                  "info": "opens the challenge window in-page",
                  "payload": {
                    "messageType": "CReq",
                    "messageVersion": "2.2.0",
                    "threeDSServerTransID": "8a880dc0-…",
                    "acsTransID": "d7c45b2e-…",
                    "challengeWindowSize": "03"
                  }
                },
                {
                  "from": "acs",
                  "to": "checkout",
                  "name": "challenge page",
                  "info": "enter the code we sent you",
                  "kind": "response"
                },
                {
                  "from": "shopper",
                  "to": "checkout",
                  "name": "one-time code",
                  "info": "typed from the bank's text message or app",
                  "kind": "transport"
                },
                {
                  "from": "checkout",
                  "to": "acs",
                  "name": "CReq",
                  "info": "with the code"
                },
                {
                  "from": "acs",
                  "to": "checkout",
                  "name": "CRes",
                  "info": "transStatus = Y",
                  "kind": "response"
                }
              ],
              "versions": {
                "3ds1": {
                  "title": "Redirect to the bank's page",
                  "explanation": "The whole browser is sent to the bank's page, which asks for the static 3-D Secure password you set up when you got the card. Many shoppers never did, or forgot it, and gave up here.",
                  "messages": [
                    {
                      "from": "checkout",
                      "to": "acs",
                      "name": "POST PAReq",
                      "info": "full-page redirect to the bank",
                      "tags": [
                        "deprecated"
                      ],
                      "payload": "<Message id=\"2\">\n  <PAReq>\n    <version>1.0.2</version>\n    <Purchase><amount>49.95</amount><currency>978</currency></Purchase>\n    <TermUrl>https://pay.example/3ds/return</TermUrl>\n  </PAReq>\n</Message>",
                      "annotations": [
                        {
                          "field": "TermUrl",
                          "text": "Where the bank should send the browser back when it is done."
                        }
                      ]
                    },
                    {
                      "from": "acs",
                      "to": "checkout",
                      "name": "password page",
                      "info": "the bank's own page, full screen",
                      "kind": "response",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "shopper",
                      "to": "checkout",
                      "name": "static password",
                      "info": "set up once, rarely remembered",
                      "kind": "transport",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "checkout",
                      "to": "acs",
                      "name": "POST password",
                      "info": "checked by the bank",
                      "tags": [
                        "deprecated"
                      ]
                    },
                    {
                      "from": "acs",
                      "to": "checkout",
                      "name": "PARes",
                      "info": "signed result, redirect back to TermUrl",
                      "kind": "response",
                      "tags": [
                        "deprecated"
                      ]
                    }
                  ]
                }
              }
            },
            {
              "title": "Carry the proof",
              "explanation": "After a challenge the access control server reports the result to the gateway through the directory. The gateway now holds an authentication value and an indicator it can attach to the authorisation so the issuer knows this payment was authenticated.",
              "messages": [
                {
                  "from": "acs",
                  "to": "directory",
                  "name": "RReq",
                  "info": "results request: transStatus Y, authentication value",
                  "payload": {
                    "messageType": "RReq",
                    "transStatus": "Y",
                    "eci": "05",
                    "authenticationValue": "AAABBJg0VhI0VniQEjRWAAAAAAA=",
                    "dsTransID": "f1a3c9…"
                  },
                  "annotations": [
                    {
                      "field": "authenticationValue",
                      "text": "A cryptogram the issuer can verify later in the authorisation message. Proof that authentication happened."
                    },
                    {
                      "field": "eci",
                      "text": "The electronic commerce indicator. 05 fully authenticated, 06 attempted, 07 no authentication (values vary by network)."
                    }
                  ]
                },
                {
                  "from": "directory",
                  "to": "gateway",
                  "name": "RReq",
                  "info": "forwarded to the 3-D Secure server"
                },
                {
                  "from": "gateway",
                  "to": "directory",
                  "name": "RRes",
                  "info": "received",
                  "kind": "response"
                },
                {
                  "from": "directory",
                  "to": "acs",
                  "name": "RRes",
                  "info": "received",
                  "kind": "response"
                }
              ],
              "versions": {
                "3ds1": {
                  "title": "Verify the signed result",
                  "explanation": "The browser came back carrying the PARes. The gateway checks the bank's signature on it and extracts the authentication value and the indicator for the authorisation.",
                  "messages": [
                    {
                      "from": "gateway",
                      "to": "gateway",
                      "name": "verify PARes signature",
                      "info": "extract CAVV and ECI",
                      "kind": "local",
                      "tags": [
                        "deprecated"
                      ]
                    }
                  ]
                }
              }
            }
          ]
        },
        {
          "id": "exemptions",
          "title": "Exemptions and frictionless flow",
          "subtitle": "When nobody asks you anything",
          "availableFrom": "3ds2",
          "article": {
            "body": [
              "Most 3-D Secure 2 payments never show a challenge. The issuer looks at the data in the authentication request, finds nothing unusual and answers **authenticated** straight away. The shopper notices nothing.",
              "Where regulation requires strong authentication, merchants and acquirers may also claim **exemptions**: low-value payments, payments to a merchant the shopper has whitelisted, or payments the acquirer judges low-risk under its own fraud rate. An exemption skips authentication entirely, so the liability for fraud stays with the merchant."
            ],
            "versionNotes": [
              {
                "version": "3ds2",
                "heading": "New in 3-D Secure 2",
                "items": [
                  "Frictionless approval based on device and transaction data.",
                  "Exemption flags in the authorisation and authentication messages."
                ]
              }
            ]
          },
          "steps": [
            {
              "title": "Frictionless approval",
              "explanation": "The access control server scores the request, finds a known device and a usual amount, and returns authenticated without a challenge. The gateway receives the proof in the same response.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "directory",
                  "name": "AReq",
                  "info": "device data, known card"
                },
                {
                  "from": "directory",
                  "to": "acs",
                  "name": "AReq"
                },
                {
                  "from": "acs",
                  "to": "fraud",
                  "name": "score",
                  "kind": "local",
                  "info": "known device, usual amount"
                },
                {
                  "from": "fraud",
                  "to": "acs",
                  "name": "risk: low",
                  "kind": "response"
                },
                {
                  "from": "acs",
                  "to": "directory",
                  "name": "ARes",
                  "info": "transStatus = Y, authentication value",
                  "kind": "response",
                  "payload": {
                    "messageType": "ARes",
                    "transStatus": "Y",
                    "eci": "05",
                    "authenticationValue": "AAABBJg0VhI0VniQEjRWAAAAAAA="
                  }
                },
                {
                  "from": "directory",
                  "to": "gateway",
                  "name": "ARes",
                  "info": "transStatus = Y",
                  "kind": "response"
                }
              ]
            },
            {
              "title": "Claim a low-value exemption",
              "explanation": "For a small amount the gateway may skip authentication and flag the exemption in the authorisation. The issuer can accept it or answer with a soft decline asking for authentication after all.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "acquirer",
                  "name": "AUTH 0100",
                  "info": "exemption: low value",
                  "payload": {
                    "mti": "0100",
                    "pan": "411111******1111",
                    "amount": "000000000950",
                    "currency": "978",
                    "eci": "07",
                    "scaExemption": "low-value"
                  },
                  "annotations": [
                    {
                      "field": "scaExemption",
                      "text": "Tells the issuer which exemption the acquirer claims. The issuer may still insist on authentication."
                    },
                    {
                      "field": "eci",
                      "text": "07 says no authentication was performed."
                    }
                  ]
                },
                {
                  "from": "acquirer",
                  "to": "network",
                  "name": "0100",
                  "info": "forwarded"
                },
                {
                  "from": "network",
                  "to": "issuer",
                  "name": "0100",
                  "info": "forwarded"
                },
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "0110 · 00",
                  "info": "approved, exemption accepted",
                  "kind": "response"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "title": "Authorisation",
      "topics": [
        {
          "id": "authorisation",
          "title": "Authorise the payment",
          "subtitle": "The one-second round trip to your bank",
          "article": {
            "body": [
              "An authorisation is a question: will this card pay this amount to this merchant right now? The gateway turns the shop's request into a bank message, the acquirer forwards it to the card network, the network looks at the first digits of the card number and hands it to the issuer. The issuer checks the card, scores the risk, checks the balance and answers with a two-character response code. The whole trip usually takes well under a second.",
              "The classic wire format is ISO 8583: a message type (`0100` for an authorisation request, `0110` for its response) followed by numbered fields. Modern gateways show it as JSON in their APIs, but the structure is the same and so are the codes."
            ],
            "referencesLabel": "Specs",
            "references": [
              {
                "label": "ISO 8583 overview",
                "url": "https://en.wikipedia.org/wiki/ISO_8583"
              }
            ],
            "versionNotes": [
              {
                "version": "3ds2",
                "heading": "What changed with 3-D Secure 2",
                "items": [
                  "The authorisation carries the authentication value and indicator from the frictionless or challenge flow.",
                  "Issuers may answer a soft decline that asks the merchant to authenticate and retry."
                ]
              }
            ]
          },
          "steps": [
            {
              "title": "Ask the acquirer",
              "explanation": "The gateway builds the authorisation request: card number, amount, currency, merchant id and the proof from authentication. It sends it over a dedicated connection to the acquiring bank.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "acquirer",
                  "name": "AUTH 0100",
                  "info": "authorisation request",
                  "size": "~300 B",
                  "payload": {
                    "mti": "0100",
                    "pan": "411111******1111",
                    "processingCode": "000000",
                    "amount": "000000004995",
                    "currency": "978",
                    "stan": "482913",
                    "merchantId": "lamp-shop-00042",
                    "mcc": "5712",
                    "eci": "05",
                    "cavv": "AAABBJg0VhI0VniQEjRWAAAAAAA=",
                    "posEntryMode": "812"
                  },
                  "annotations": [
                    {
                      "field": "mti",
                      "text": "Message type indicator. 0100 is an authorisation request; 0110 its response; 0400 a reversal."
                    },
                    {
                      "field": "amount",
                      "text": "Twelve digits in the minor unit: 000000004995 is 49.95."
                    },
                    {
                      "field": "stan",
                      "text": "System trace audit number. Matches the response to the request and makes reversals possible."
                    },
                    {
                      "field": "mcc",
                      "text": "Merchant category code; 5712 is furniture. Issuers use it in risk rules."
                    },
                    {
                      "field": "cavv",
                      "text": "The authentication value from 3-D Secure. The issuer verifies it before trusting the ECI."
                    }
                  ]
                }
              ]
            },
            {
              "title": "Route by card number",
              "explanation": "The acquirer passes the message to the card network. The network reads the first digits, the bank identification number, finds the issuer that owns that range and forwards the request.",
              "messages": [
                {
                  "from": "acquirer",
                  "to": "network",
                  "name": "0100",
                  "info": "forwarded with the acquirer's id"
                },
                {
                  "from": "network",
                  "to": "network",
                  "name": "look up BIN 411111",
                  "info": "range belongs to the issuing bank",
                  "kind": "local"
                },
                {
                  "from": "network",
                  "to": "issuer",
                  "name": "0100",
                  "info": "forwarded to the issuer's authorisation host"
                }
              ]
            },
            {
              "title": "The issuer decides",
              "explanation": "The issuer's host checks the card's status and expiry, asks its fraud service for a score, and asks the ledger whether the available balance covers the amount. If all is well it places a hold for the amount.",
              "check": {
                "prompt": "At the moment the issuer approves, where has the money moved?",
                "options": [
                  {
                    "text": "Nowhere yet: the issuer only places a hold on the shopper's available balance",
                    "correct": true,
                    "why": "Right. Authorisation reserves the amount. Money moves later, in clearing and settlement, and only for payments the merchant captures."
                  },
                  {
                    "text": "From the shopper's account to the shop's bank account",
                    "why": "The shop's account is credited days later, after capture, clearing and settlement. Nothing leaves the issuer at authorisation."
                  },
                  {
                    "text": "From the issuer to the card network, which holds it in escrow",
                    "why": "The network never holds the funds. It routes messages now and nets the totals between banks later."
                  }
                ]
              },
              "messages": [
                {
                  "from": "issuer",
                  "to": "fraud",
                  "name": "score transaction",
                  "info": "merchant, amount, device, velocity",
                  "kind": "local"
                },
                {
                  "from": "fraud",
                  "to": "issuer",
                  "name": "score 12 / 100",
                  "info": "low risk",
                  "kind": "response"
                },
                {
                  "from": "issuer",
                  "to": "ledger",
                  "name": "available balance?",
                  "info": "account linked to the card",
                  "kind": "local"
                },
                {
                  "from": "ledger",
                  "to": "issuer",
                  "name": "1 240.00 available",
                  "kind": "response"
                },
                {
                  "from": "issuer",
                  "to": "ledger",
                  "name": "place hold 49.95",
                  "info": "reduces available, not booked",
                  "kind": "local",
                  "payload": {
                    "op": "hold",
                    "account": "acct_…9921",
                    "amount": 4995,
                    "currency": "EUR",
                    "expiresInDays": 7,
                    "reference": "auth_a1b2c3"
                  },
                  "annotations": [
                    {
                      "field": "expiresInDays",
                      "text": "A hold that is never captured falls off after a few days; that is why a cancelled order can show a pending amount for a while."
                    }
                  ]
                }
              ]
            },
            {
              "title": "Approved",
              "explanation": "The response travels back the same path with response code 00 and an authorisation code. The gateway tells the shop, the shop confirms the order. Still no money has moved.",
              "messages": [
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "0110 · 00",
                  "info": "approved, auth code 731204",
                  "kind": "response",
                  "payload": {
                    "mti": "0110",
                    "stan": "482913",
                    "responseCode": "00",
                    "authCode": "731204",
                    "avsResult": "Y",
                    "cvvResult": "M"
                  },
                  "annotations": [
                    {
                      "field": "responseCode",
                      "text": "00 approved. 05 do not honour, 51 insufficient funds, 54 expired card, 1A authentication required."
                    },
                    {
                      "field": "authCode",
                      "text": "The issuer's reference for this approval; it appears on the receipt and in the later capture."
                    }
                  ]
                },
                {
                  "from": "network",
                  "to": "acquirer",
                  "name": "0110 · 00",
                  "kind": "response"
                },
                {
                  "from": "acquirer",
                  "to": "gateway",
                  "name": "0110 · 00",
                  "kind": "response"
                },
                {
                  "from": "gateway",
                  "to": "shop",
                  "name": "payment.authorized",
                  "info": "webhook with payment id",
                  "kind": "notification",
                  "payload": {
                    "event": "payment.authorized",
                    "id": "pay_01HZX8",
                    "amount": 4995,
                    "authCode": "731204"
                  }
                },
                {
                  "from": "shop",
                  "to": "checkout",
                  "name": "order confirmed",
                  "info": "thank-you page",
                  "kind": "response"
                }
              ]
            }
          ]
        },
        {
          "id": "declines",
          "title": "Declines and retries",
          "subtitle": "What a no means and what to do",
          "article": {
            "body": [
              "A decline is a response code other than approval. Some are hard: the card is reported stolen, the account is closed, the issuer says **do not honour** and will not explain. Others are soft: insufficient funds today, a transient system error, or, since 3-D Secure 2, a request to authenticate the shopper first and try again.",
              "The networks watch retries. Hammering a hard decline with the same request earns fines and a worse reputation for the merchant. A good gateway keeps a retry policy per response code and never retries a stolen-card decline."
            ]
          },
          "steps": [
            {
              "title": "Do not honour",
              "explanation": "The issuer declines without a reason. Code 05 covers everything from a risk rule to a temporary block. The shop can only ask the shopper for another card.",
              "messages": [
                {
                  "from": "network",
                  "to": "issuer",
                  "name": "0100",
                  "info": "authorisation request"
                },
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "0110 · 05",
                  "info": "do not honour",
                  "kind": "error",
                  "payload": {
                    "mti": "0110",
                    "stan": "482914",
                    "responseCode": "05"
                  }
                },
                {
                  "from": "network",
                  "to": "acquirer",
                  "name": "0110 · 05",
                  "kind": "error"
                },
                {
                  "from": "acquirer",
                  "to": "gateway",
                  "name": "0110 · 05",
                  "kind": "error"
                },
                {
                  "from": "gateway",
                  "to": "shop",
                  "name": "payment.declined",
                  "info": "reason: generic decline",
                  "kind": "notification"
                }
              ]
            },
            {
              "title": "Soft decline: authenticate first",
              "explanation": "The issuer wants the shopper authenticated before it approves. It answers with a soft decline; the gateway runs 3-D Secure and sends the same authorisation again with the proof attached.",
              "check": {
                "prompt": "The issuer answers with a soft decline asking for authentication. What should the gateway do?",
                "options": [
                  {
                    "text": "Run 3-D Secure, then send the authorisation again with the authentication value",
                    "correct": true,
                    "why": "Right. A soft decline is an instruction, not a refusal. The retry with proof is expected and usually approved."
                  },
                  {
                    "text": "Send the same authorisation again immediately",
                    "why": "An unchanged retry gets the same answer and counts against the merchant's retry limits."
                  },
                  {
                    "text": "Tell the shopper the card is blocked and ask for another",
                    "why": "Nothing is wrong with the card. The issuer only wants to be sure who is paying."
                  }
                ]
              },
              "messages": [
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "0110 · 1A",
                  "info": "authentication required",
                  "kind": "error",
                  "tags": [
                    "new"
                  ],
                  "payload": {
                    "mti": "0110",
                    "responseCode": "1A"
                  },
                  "annotations": [
                    {
                      "field": "responseCode",
                      "text": "1A (or 65 on some networks) means: perform strong customer authentication and retry."
                    }
                  ]
                },
                {
                  "from": "network",
                  "to": "acquirer",
                  "name": "0110 · 1A",
                  "kind": "error"
                },
                {
                  "from": "acquirer",
                  "to": "gateway",
                  "name": "0110 · 1A",
                  "kind": "error"
                },
                {
                  "from": "gateway",
                  "to": "directory",
                  "name": "AReq",
                  "info": "challenge requested (03)"
                },
                {
                  "from": "directory",
                  "to": "gateway",
                  "name": "ARes",
                  "info": "after the challenge: transStatus Y",
                  "kind": "response"
                },
                {
                  "from": "gateway",
                  "to": "acquirer",
                  "name": "AUTH 0100",
                  "info": "retry with authentication value and ECI 05"
                }
              ],
              "versions": {
                "3ds1": {
                  "title": "No step-up path",
                  "explanation": "The first generation of 3-D Secure had no soft decline. An issuer that wanted authentication could only decline outright, and the merchant could only ask the shopper to try again from the start.",
                  "messages": []
                }
              }
            },
            {
              "title": "Retry rules",
              "explanation": "The gateway consults its retry policy. Transient codes may be retried after a pause; insufficient funds may be retried days later for a subscription; stolen or closed cards are never retried.",
              "messages": [
                {
                  "from": "gateway",
                  "to": "gateway",
                  "name": "apply retry policy",
                  "info": "code 05: no automatic retry",
                  "kind": "local",
                  "payload": "05 do not honour      -> no retry, ask for another card\n51 insufficient funds -> retry in 3 days (subscriptions only)\n91 issuer unavailable -> retry once after 30 s\n41 lost card          -> never retry\n43 stolen card        -> never retry\n1A authentication     -> run 3-D Secure, retry once"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "title": "After the sale",
      "topics": [
        {
          "id": "settlement",
          "title": "Capture, clearing and settlement",
          "subtitle": "How the money finally moves",
          "article": {
            "body": [
              "An approved authorisation is a promise. The shop turns it into money in two more stages. **Capture** tells the gateway the goods shipped and the amount is final. **Clearing** is the nightly exchange of captured transactions between acquirers and issuers through the network. **Settlement** is the actual transfer of the netted totals between the banks, after which the acquirer pays the merchant and the issuer posts the charge to the shopper's statement.",
              "This is why a pending amount appears on your statement at once but the real charge a day or two later, and why a cancelled order sometimes shows a hold that simply fades away: it was never captured."
            ]
          },
          "steps": [
            {
              "title": "Capture",
              "explanation": "When the order ships, the shop captures the payment. The gateway queues a capture for the acquirer; nothing travels to the issuer in real time.",
              "messages": [
                {
                  "from": "shop",
                  "to": "gateway",
                  "name": "POST /v1/payments/pay_01HZX8/capture",
                  "info": "amount 4995",
                  "payload": {
                    "amount": 4995
                  }
                },
                {
                  "from": "gateway",
                  "to": "acquirer",
                  "name": "capture record",
                  "info": "added to today's batch",
                  "kind": "transport"
                }
              ]
            },
            {
              "title": "Clearing",
              "explanation": "Overnight the acquirer sends a file of captured transactions to the network, which splits it by issuer. Each issuer receives the records for its cards and matches them to the holds.",
              "messages": [
                {
                  "from": "acquirer",
                  "to": "network",
                  "name": "clearing file",
                  "info": "thousands of records, batch",
                  "kind": "transport",
                  "size": "12 MB"
                },
                {
                  "from": "network",
                  "to": "issuer",
                  "name": "clearing records",
                  "info": "this issuer's cards only",
                  "kind": "transport"
                },
                {
                  "from": "issuer",
                  "to": "ledger",
                  "name": "post 49.95, release hold",
                  "info": "the charge appears on the statement",
                  "kind": "local",
                  "payload": {
                    "op": "post",
                    "account": "acct_…9921",
                    "amount": 4995,
                    "currency": "EUR",
                    "description": "LAMP SHOP",
                    "releaseHold": "auth_a1b2c3"
                  }
                }
              ]
            },
            {
              "title": "Settlement",
              "explanation": "The network nets what every bank owes every other bank and moves the totals through a settlement bank. The acquirer then pays the merchant, minus its fees.",
              "messages": [
                {
                  "from": "network",
                  "to": "network",
                  "name": "compute net positions",
                  "info": "issuer owes acquirer, minus interchange",
                  "kind": "local"
                },
                {
                  "from": "issuer",
                  "to": "network",
                  "name": "settlement transfer",
                  "info": "net amount for the day",
                  "kind": "transport"
                },
                {
                  "from": "network",
                  "to": "acquirer",
                  "name": "settlement transfer",
                  "info": "net amount for the day",
                  "kind": "transport"
                },
                {
                  "from": "acquirer",
                  "to": "gateway",
                  "name": "payout report",
                  "info": "merchant balance credited, fees deducted",
                  "kind": "notification"
                },
                {
                  "from": "gateway",
                  "to": "shop",
                  "name": "payout.paid",
                  "info": "webhook: 48.46 after fees",
                  "kind": "notification",
                  "payload": {
                    "event": "payout.paid",
                    "gross": 4995,
                    "fees": 149,
                    "net": 4846,
                    "currency": "EUR"
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "further": {
    "title": "Go further",
    "items": [
      {
        "title": "EMV 3-D Secure specifications",
        "subtitle": "the protocol behind authentication",
        "url": "https://www.emvco.com/emv-technologies/3-d-secure/"
      },
      {
        "title": "PCI Security Standards",
        "subtitle": "why nobody wants to store card numbers",
        "url": "https://www.pcisecuritystandards.org/"
      }
    ]
  },
  "footer": "Amounts, identifiers and hostnames are illustrative. Response codes and message names follow common practice; details vary by network and acquirer."
}
```
