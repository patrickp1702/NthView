# Courier data schema — schemaVersion 1

## Overview
The data describes a tiny walkable planet that personifies one concept: its
districts are the concept's main parts, its residents are the ideas or roles
inside it, and every errand the learner runs (letters, mystery parcels,
replies, sorting, chains, telegrams, weighing, notices) is a small learning
task about one idea. The renderer supplies the planet, the walking, the post
office, the bag and the stamps; everything the learner reads comes from this
JSON.

Text fields accept one inline mark-up: `**bold**`. Nothing else is interpreted.
Character limits count JavaScript string length, so one emoji counts as 2.

## External libraries
The renderer loads **three.js r128** from cdnjs and two Google Fonts
(Fredoka, Nunito), declared in `NthView.libs` in `assets/view.js`. The output
is still one file, but it needs internet access the first time it opens.
Without three.js the page shows the standard error panel; without the fonts
it falls back to system fonts.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–60 chars | The town's name: intro heading, HUD badge, page title |
| `subtitle` | string | no | ≤160 chars | One line under the intro heading |
| `theme` | string | no | one of `morning`, `dusk`, `lantern`, `snow`; default `morning` | World and panel theme (see Themes) |
| `courier` | object | yes | see Courier | The learner's character and role line |
| `companion` | object | no | see Companion | A pet that follows the courier |
| `postmaster` | object | yes | see Postmaster | Who runs the post office, with the opening and closing letters |
| `districts` | array | yes | 2–6 District objects | The concept's main parts, one region of the planet each |
| `residents` | array | yes | 3–14 Resident objects, at most 6 per district | The ideas or roles, personified |
| `errands` | array | yes | 3–12 Errand objects | The learning tasks, listed in this order in the checklist |
| `glossary` | array | no | 0–16 Glossary objects | Story word → real term, shown in the review |
| `report` | object | yes | see Report | The review screen |

## Themes
Each theme sets the planet palette (grass, paths, water, sand, sky, light and
sky effects) and the glass panels. Every theme has a light and a dark variant
chosen by the reader's system setting; panels stay light in light mode and
dark in dark mode, so text contrast never flips inside one theme.

| Theme | Mood | Sky effects | Suits |
| :- | :- | :- | :- |
| `morning` | Clear blue sky, green meadows, warm roofs (dark mode: a blue evening) | Drifting clouds, sun arc | The default; science, technology, everyday systems |
| `dusk` | Peach and violet sunset, golden grass (dark mode: late dusk) | Pink clouds, low sun, first stars | History, stories, people and organisations |
| `lantern` | Night in both modes, lit windows and path lanterns | Stars, fireflies, moon arc | Security, mysteries, anything "behind the scenes" |
| `snow` | Snowy ground, pale sky, icy water (dark mode: snowy night) | Falling snow | Calm topics, health, children, winter subjects |

## Courier object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–20 chars | The learner's character name, used in the intro and closing |
| `role` | string | yes | 1–200 chars | The learner's role line on the intro, e.g. "You are Kit, the new courier…" |

## Companion object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kind` | string | yes | `dog`, `cat` or `bird` | Which pet follows the courier |
| `name` | string | yes | 1–20 chars | Shown in its name tag |

## Postmaster object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–30 chars | Stands at the post office at the top of the planet |
| `portrait` | object | no | see Portrait; a default is used when absent | How the postmaster looks |
| `opening` | object | yes | see Letter | The welcome letter shown before the first step |
| `closing` | object | yes | see Letter | The letter that arrives when every errand (notices excepted) is done; the renderer appends every errand's `teaches` line as a recap |

## Letter object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤80 chars | Shown at the top of the letter |
| `paragraphs` | string[] | yes | 1–5 items, each 1–600 chars | The body |
| `signoff` | string | no | ≤80 chars | Signature line |

## District object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–30 chars, unique | Referenced by residents, sort envelopes and notices |
| `name` | string | yes | 1–30 chars | Shown on the district sign and the sorting bins |
| `blurb` | string | yes | 1–240 chars | What belongs in this district; shown on the sign and when an envelope is put in the wrong bin |
| `color` | string | no | `#rrggbb` | District tint on the ground, sign and stamps; a theme palette colour when absent |
| `props` | string[] | yes | 1–6 items from the prop list below | Scenery; the first is the landmark at the district square |

Props: `house`, `cottage`, `tree`, `pine`, `lighthouse`, `market`, `windmill`,
`tower`, `library`, `bakery`, `garden`, `fountain`, `lamp`, `signpost`,
`crates`, `rocks`, `well`, `dish`.

## Resident object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–30 chars, unique | Referenced by errands |
| `name` | string | yes | 1–20 chars | Name tag over their head |
| `role` | string | yes | 1–40 chars | Their job in the story; added to the name tag once met |
| `district` | string | yes | a `districts[].id` | Where they stand |
| `personality` | string | yes | 1–160 chars | One line of character, shown in the dialogue |
| `portrait` | object | yes | see Portrait | Builds both the 3D figure and the dialogue portrait |
| `knows` | string | yes | 1–400 chars | The idea they personify, in plain words ("What I do") |
| `greeting` | string | yes | 1–300 chars | Said the first time the learner talks to them |
| `smallTalk` | string[] | yes | 1–4 items, each 1–240 chars | Said on later visits, in turn; reinforces the idea |

## Portrait object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `skin` | string | yes | `#rrggbb` | Face and hands |
| `hair` | string | yes | `#rrggbb` | Hair (or cap) colour |
| `hairStyle` | string | yes | `short`, `long`, `bun`, `curly`, `bob`, `bald` or `cap` | Hair shape |
| `top` | string | yes | `#rrggbb` | Shirt or coat colour |
| `accessory` | string | no | `none`, `glasses`, `hat`, `scarf`, `apron`, `headset`, `bowtie` or `flower`; default `none` | One extra part |

## Errand object
Every errand has these fields, plus the fields of its `kind` below. Errands
are listed in the checklist in array order, but all of them can be done in
any order unless `after` says otherwise.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Stable key |
| `kind` | string | yes | `letter`, `parcel`, `reply`, `sort`, `chain`, `telegram`, `weigh` or `notice` | What the learner does |
| `title` | string | yes | 1–60 chars | Checklist line and stamp name |
| `hint` | string | yes | 1–200 chars | Shown in the checklist; points the way in words, never a waypoint |
| `teaches` | string | yes | 1–200 chars | The one idea this errand teaches; recapped in the closing letter and the review |
| `done` | string | yes, except `notice` | 1–300 chars | What the resident (or the postmaster, for post-office errands) says when it is complete |
| `after` | string | no | an earlier `errands[].id` | The errand stays in the checklist as "later" until that one is done |

### `letter` — read a letter, deliver it, answer one question
The letter is readable from the bag at any time. On handover the recipient
asks the check question; every option explains itself, and the errand is
complete when the learner picks the correct one.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `to` | string | yes | a `residents[].id` | Recipient |
| `from` | string | no | a `residents[].id`, not `to` | Someone the learner must collect the letter from first; when absent it starts in the bag |
| `letter` | object | yes | see Letter | The explanation itself |
| `check` | object | yes | see Check | Asked by the recipient on handover |

### `parcel` — work out who a mystery parcel belongs to
The parcel carries no name, only clues (properties of the idea). The learner
can offer it to anyone; wrong residents explain why it is not theirs.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–60 chars | What the parcel looks like |
| `clues` | string[] | yes | 1–5 items, each 1–200 chars | Written on the label |
| `owner` | string | yes | a `residents[].id` | Whose it is |
| `from` | string | no | a `residents[].id`, not `owner` | Someone to collect it from first; when absent it starts in the bag |
| `decoys` | array | no | 0–6 of `{resident, why}` | What a likely wrong resident says (`why` 1–300 chars); every other wrong resident answers with their own `knows` |

### `reply` — choose the right answer and carry it on
`asker` asks a question; the learner picks one reply card (each card explains
itself when picked) and carries the right one to `to`.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `asker` | string | yes | a `residents[].id` | Who asks |
| `question` | string | yes | 1–300 chars | What they ask |
| `cards` | array | yes | 2–4 Option objects, exactly one `correct` | The reply cards |
| `to` | string | yes | a `residents[].id`, not `asker` | Who receives the reply |

### `sort` — sort envelopes into district pigeonholes
Played at the post office: tap an envelope, then a district. A wrong bin
answers with that district's `blurb`; the right bin shows the envelope's
`note`.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `intro` | string | no | ≤300 chars | Instruction above the table |
| `envelopes` | array | yes | 3–10 of `{label 1–60, district, note 1–240}` | `district` is a `districts[].id` |

### `chain` — pass a message through residents in order
Every resident in `steps` can receive the message; only the next one in order
takes it. Coming too early earns a gentle hint (`tooEarly`, or a default).

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `message` | string | yes | 1–200 chars | What is being passed, shown in the bag |
| `steps` | array | yes | 2–6 Step objects, each resident at most once | In the correct order |

Step: `resident` (a `residents[].id`), `says` (1–300 chars, said when the
message reaches them in order), `tooEarly` (≤300 chars, optional, said when the
learner comes to them before the earlier steps are done; ignored on the first
step).

### `telegram` — fill the gaps before sending (cloze)
Composed at the post-office telegraph. Wrong gaps show their `why` and can be
changed; when every gap is right the telegram is sent and `to` replies with
`done`.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `to` | string | yes | a `residents[].id` | Who receives it |
| `text` | string | yes | 1–400 chars, exactly `gaps.length` occurrences of `___` | The telegram with gaps |
| `gaps` | array | yes | 1–4 Gap objects | In the order the `___` appear |

Gap: `options` (2–4 strings, 1–40 chars each, unique), `answer` (integer index
into `options`), `why` (≤300 chars, optional, shown when this gap is wrong).

### `weigh` — estimate a number on the post-office scale
The learner sets a slider and weighs. Within `tolerance` of `answer` counts;
otherwise they hear "heavier" or "lighter" and may try again or ask to see the
answer. Either way `reveal` is shown, and the weighed parcel is carried to
`to`.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–60 chars | What the parcel on the scale is |
| `prompt` | string | yes | 1–300 chars | The question |
| `unit` | string | yes | 1–12 chars | Shown after the number |
| `min`, `max` | number | yes | `min < max` | Slider range |
| `answer` | number | yes | `min ≤ answer ≤ max` | The true value |
| `tolerance` | number | yes | `> 0` | How close counts as right |
| `step` | number | no | `> 0`, default `(max − min) / 100` | Slider step |
| `reveal` | string | yes | 1–400 chars | The true value explained |
| `to` | string | yes | a `residents[].id` | Who the weighed parcel goes to |

### `notice` — read a board around town (optional)
A notice board stands in `district`. Reading it completes the errand. Notices
are optional: they earn a stamp but the closing letter does not wait for them.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `district` | string | yes | a `districts[].id` | Where the board stands |
| `heading` | string | yes | 1–60 chars | Board heading |
| `paragraphs` | string[] | yes | 1–3 items, each 1–500 chars | The notice |

## Check object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `question` | string | yes | 1–300 chars | Asked by the recipient |
| `options` | array | yes | 2–5 Option objects, exactly one `correct` | |

## Option object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `text` | string | yes | 1–200 chars | What the learner reads |
| `correct` | boolean | no | default `false` | Exactly one per check or card set |
| `why` | string | yes | 1–400 chars | Why it is right, or why it is not |

## Glossary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–60 chars | The story word, e.g. "Della, the directory keeper" |
| `meaning` | string | yes | 1–200 chars | The real term and what it means |

## Report object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | yes | 1–60 chars | Review screen heading |
| `intro` | string | no | ≤300 chars | One line under it |
| `source` | object | no | `label` 1–200, `url` (http or https, optional), `note` ≤300 | Citation; a link when `url` is given |

## Cross-field rules
- `districts[i].id`, `residents[i].id` and `errands[i].id` are each unique.
- `residents[i].district` must be a `districts[].id`; a district holds at
  most 6 residents.
- Every resident reference in an errand (`to`, `from`, `owner`, `asker`,
  `decoys[].resident`, `steps[].resident`) must be a `residents[].id`.
- `letter.from` ≠ `letter.to`; `parcel.from` ≠ `parcel.owner`;
  `reply.to` ≠ `reply.asker`.
- `parcel.decoys[].resident` values are unique and never the `owner`.
- `chain.steps[].resident` values are unique.
- `sort.envelopes[].district` and `notice.district` must be a `districts[].id`.
- Every `check.options` and `reply.cards` has exactly one `correct: true`.
- `telegram.text` contains exactly `gaps.length` occurrences of `___`; every
  `gaps[j].answer` is an index into `gaps[j].options`.
- `weigh`: `min < max`, `min ≤ answer ≤ max`, `tolerance > 0`, `step > 0`.
- `after` must name an errand that comes earlier in `errands`.
- `done` is required on every kind except `notice`.
- At least one errand is not a `notice` (the closing letter waits for those).

## Warnings (non-blocking)
- A district with no residents (its square stands empty).
- A resident who appears in no errand (they can still be talked to).
- Six or more errands using only one or two kinds.
- A `weigh.tolerance` that covers half the range or more.
- A `sort` where every envelope goes to the same district.
- A district listing the same prop twice.

## Complete example
The complete example is Packet Town, a tiny planet about how the internet
delivers a web page: DNS is the directory keeper, the router the crossroads
guide, TCP the careful courier, TLS the sealed-envelope clerk, the server the
baker. Its ten errands cover all eight kinds. The JSON block below is also the
data embedded in `examples/example.html`. Build that file with:

    node scripts/build-html.js skills/nthview-courier --example skills/nthview-courier/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Packet Town",
  "subtitle": "How the internet delivers a web page, one errand at a time",
  "theme": "morning",
  "courier": {
    "name": "Kit",
    "role": "You are Kit, the new courier of Packet Town. Every web page anyone opens here is a delivery, and you are the one who walks it round."
  },
  "companion": { "kind": "dog", "name": "Byte" },
  "postmaster": {
    "name": "Postmaster Ada",
    "portrait": { "skin": "#e8b48f", "hair": "#d9d4cc", "hairStyle": "bun", "top": "#c4473a", "accessory": "glasses" },
    "opening": {
      "heading": "Welcome to Packet Town, Kit",
      "paragraphs": [
        "In this little town, opening a web page is not magic. It is a string of small deliveries. Someone has to find the address, someone points the way at every crossroads, someone numbers the pages so none go missing, someone seals the envelope, and a baker bakes the page itself.",
        "Each of those someones lives here. Walk round, say hello, and carry their mail. Your bag has the first letters already. The checklist behind the bag button says what is waiting, with a hint for each, but nobody will walk you there: ask around, read the boards, and you will soon know who does what.",
        "There is no hurry and no wrong turn that cannot be undone. If you hand something to the wrong person, they will tell you why it is not theirs."
      ],
      "signoff": "Ada, Postmaster"
    },
    "closing": {
      "heading": "Every errand delivered",
      "paragraphs": [
        "Kit, you have walked the whole journey of a web page. Next time a page opens in a blink, you will know the town that made it happen: a name looked up, a route found hop by hop, a careful courier counting pages, a clerk sealing them, and a baker who bakes the page.",
        "Here is everything you carried, in one place."
      ],
      "signoff": "With thanks, Ada"
    }
  },
  "districts": [
    { "id": "name-hill", "name": "Name Hill", "blurb": "Where names become numbers. Anything about looking up an address belongs here.", "color": "#7a6fd0", "props": ["library", "pine", "lamp", "rocks"] },
    { "id": "crossroads", "name": "The Crossroads", "blurb": "Where every packet is pointed one hop closer to where it is going. Questions of which way to go belong here.", "color": "#d98b2b", "props": ["signpost", "tower", "lamp", "house"] },
    { "id": "harbour", "name": "The Harbour", "blurb": "Where packets are labelled, counted, shipped and resent. Anything about arriving complete and in order belongs here.", "color": "#2f8fb3", "props": ["lighthouse", "crates", "rocks", "cottage"] },
    { "id": "server-street", "name": "Server Street", "blurb": "Where pages are ordered, sealed and baked. Requests, replies and certificates belong here.", "color": "#c4473a", "props": ["bakery", "market", "house", "lamp"] },
    { "id": "browser-lane", "name": "Browser Lane", "blurb": "Where pages are read, painted on screen and kept for next time. Anything about showing or saving a page belongs here.", "color": "#3f9b5a", "props": ["cottage", "garden", "fountain", "tree"] }
  ],
  "residents": [
    {
      "id": "della", "name": "Della", "role": "Directory keeper", "district": "name-hill",
      "personality": "Precise, a little proud of her enormous card index, never forgets a name.",
      "portrait": { "skin": "#c98e66", "hair": "#3b2a20", "hairStyle": "long", "top": "#7a6fd0", "accessory": "glasses" },
      "knows": "I am **DNS**, the internet's address book. People remember names like bakery.example; computers find each other by numbers like 93.184.216.34. I turn the name into the number.",
      "greeting": "A new courier! Tell me a name and I will tell you its number. That is all I do, and I do it very fast.",
      "smallTalk": ["If I do not know a name, I ask a bigger directory, which asks a bigger one, all the way up to the root.", "I keep answers for a while, so the second time someone asks it is instant."]
    },
    {
      "id": "rory", "name": "Rory", "role": "Crossroads guide", "district": "crossroads",
      "personality": "Cheerful, always pointing, never sure of the whole way but always sure of the next turn.",
      "portrait": { "skin": "#f0c8a0", "hair": "#b5562c", "hairStyle": "curly", "top": "#d98b2b", "accessory": "scarf" },
      "knows": "I am a **router**. I read the number on each packet and send it one hop closer. I never know the whole route, and I do not need to: the next guide does the same.",
      "greeting": "Left, right, straight on! Hello. Packets come through here all day and I send each one a step closer.",
      "smallTalk": ["A page from far away might pass fifteen guides like me in under a second.", "If one road is jammed I send packets another way. They might even arrive out of order. Tess sorts that out."]
    },
    {
      "id": "tess", "name": "Tess", "role": "Careful courier", "district": "harbour",
      "personality": "Methodical, counts everything twice, quietly proud that nothing she sends ever goes missing.",
      "portrait": { "skin": "#8d5a3b", "hair": "#1d1a18", "hairStyle": "bun", "top": "#2f8fb3", "accessory": "headset" },
      "knows": "I am **TCP**. Before anything is sent I shake hands with the other side. Then I number every page, check each one arrived, put them back in order and resend any that went missing.",
      "greeting": "Oh, hello. One moment, I am counting. Seven, eight. All here. Now, what can I do for you?",
      "smallTalk": ["My handshake has three steps: hello, hello back, and great, let's start.", "Videos sometimes use my sister, who does not resend. A late frame is useless anyway."]
    },
    {
      "id": "ivy", "name": "Ivy", "role": "Address stamper", "district": "harbour",
      "personality": "Brisk and cheerful, stamps faster than you can blink, does not worry about what happens next.",
      "portrait": { "skin": "#f3d2b3", "hair": "#e2b84c", "hairStyle": "bob", "top": "#3fa7a0", "accessory": "apron" },
      "knows": "I am **IP**. I stamp a from-address and a to-address on every packet. I do not promise it will arrive and I do not count anything. I label and send.",
      "greeting": "Stamp, stamp! Every packet needs a from and a to, and that is me. Hello, courier.",
      "smallTalk": ["Big pages are cut into many small packets, and every single one gets my stamp.", "Addresses come in two sizes now: the short old kind and a very long new kind."]
    },
    {
      "id": "lio", "name": "Lio", "role": "Sealed-envelope clerk", "district": "server-street",
      "personality": "Calm, suspicious in a polite way, always asks to see ID before anything else.",
      "portrait": { "skin": "#d7a27b", "hair": "#2b2b33", "hairStyle": "short", "top": "#5a5f73", "accessory": "bowtie" },
      "knows": "I am **TLS**, the padlock in the address bar. I check the baker's certificate, an ID card signed by someone we both trust, then seal every envelope so nobody on the way can read or change it.",
      "greeting": "Good day. Before we talk, may I see some ID? Only joking. With you. Not with servers.",
      "smallTalk": ["Anyone on the road can see that a sealed envelope went to the bakery. Nobody can see what is inside.", "A certificate is only worth something because a trusted authority signed it."]
    },
    {
      "id": "bea", "name": "Bea", "role": "Baker of pages", "district": "server-street",
      "personality": "Warm and floury, always busy, happiest when an order slip arrives.",
      "portrait": { "skin": "#f1c27d", "hair": "#6b3e26", "hairStyle": "short", "top": "#f2efe6", "accessory": "hat" },
      "knows": "I am the **server**. I wait for orders, and for every request I bake a response: the HTML recipe, the pictures, the styles and the scripts that make up the page.",
      "greeting": "Fresh pages, hot from the oven! Have you brought me an order?",
      "smallTalk": ["I bake thousands of pages a minute, for people I never meet.", "If someone orders a page I do not have, I send back a polite 404."]
    },
    {
      "id": "hal", "name": "Hal", "role": "Order-slip writer", "district": "server-street",
      "personality": "Tidy and formal, loves a properly filled-in form, hums while he writes.",
      "portrait": { "skin": "#e0ac69", "hair": "#4a4a4a", "hairStyle": "bald", "top": "#b98c4a", "accessory": "glasses" },
      "knows": "I am **HTTP**, the language of orders. A request says what you want, like GET /menu. A response starts with a status number: 200 means here it is, 404 means not found, 500 means the kitchen broke.",
      "greeting": "Ah, a courier. Every order in this town is written on one of my slips. Shall I show you how they work?",
      "smallTalk": ["GET asks for something. POST sends something, like a filled-in form.", "Status numbers starting with 3 mean: it moved, look over there instead."]
    },
    {
      "id": "pip", "name": "Pip", "role": "Page reader", "district": "browser-lane",
      "personality": "Curious and impatient, wants to see the page right now, reads recipes out loud.",
      "portrait": { "skin": "#f5d6c6", "hair": "#2a5fa8", "hairStyle": "cap", "top": "#3f9b5a", "accessory": "none" },
      "knows": "I am the **browser**. I start every trip by asking for a page, and when it arrives I read the HTML recipe, fetch the pictures and styles it mentions, and paint the page on your screen.",
      "greeting": "Hi! I want to open bakery.example. Can you help? I have no idea where it is.",
      "smallTalk": ["One page can need a hundred little deliveries: every picture and style sheet is its own request.", "I paint the page while pieces are still arriving, so you see something sooner."]
    },
    {
      "id": "cass", "name": "Cass", "role": "Pantry keeper", "district": "browser-lane",
      "personality": "Thrifty, organised, labels every jar with a date.",
      "portrait": { "skin": "#a8705a", "hair": "#a33b62", "hairStyle": "curly", "top": "#7fae5a", "accessory": "flower" },
      "knows": "I am the **cache**. I keep copies of pages and pictures you have fetched before, each labelled with how long it stays fresh, so the next visit does not need a trip to the bakery.",
      "greeting": "Come in, mind the shelves. Everything here is a copy of something someone already fetched.",
      "smallTalk": ["When a copy might be stale I ask the baker a quick question: has it changed? Often the answer is no, and that saves the whole trip.", "Pressing reload makes Pip ask me to check everything again."]
    }
  ],
  "errands": [
    {
      "id": "letter-for-della", "kind": "letter", "title": "A letter for the directory keeper",
      "hint": "Della lives up on Name Hill, by the big library.",
      "teaches": "DNS turns a name people can remember into a number address computers can use.",
      "done": "Perfectly put. Names for people, numbers for machines. Here is your first stamp.",
      "to": "della",
      "letter": {
        "paragraphs": [
          "Dear Della, the new courier starts today. Could you explain your job? People type names like bakery.example, but the roads of Packet Town only understand numbers like 93.184.216.34. You keep the book that turns one into the other, and every trip in town starts with you.",
          "Ada"
        ]
      },
      "check": {
        "question": "Della smiles: \"So, courier. Pip wants bakery.example. What do I give back?\"",
        "options": [
          { "text": "The number address of bakery.example", "correct": true, "why": "Yes. Della only translates the name into a number. Everything after that is somebody else's job." },
          { "text": "The bakery's web page itself", "why": "Della never touches pages. She only knows addresses. The page is baked by Bea on Server Street and fetched later." },
          { "text": "A map of every road to the bakery", "why": "Nobody in town holds the whole map. Once you have the number, guides like Rory point each packet one hop at a time." }
        ]
      }
    },
    {
      "id": "fetch-the-page", "kind": "chain", "title": "Fetch the bakery page",
      "after": "letter-for-della",
      "hint": "Pip on Browser Lane wants to open bakery.example. Pass the request along in the order it really happens.",
      "teaches": "Opening a page is a chain: ask for the page, look up the number, open a connection, seal it, then send the order to the server.",
      "done": "A fresh page, sealed and delivered in the right order. Lovely work, courier.",
      "message": "Pip would like the page at bakery.example.",
      "steps": [
        { "resident": "pip", "says": "Here is what I want: bakery.example. But I don't know where it is. Who turns names into numbers?" },
        { "resident": "della", "says": "bakery.example is 93.184.216.34. Off you go, now somebody can open a line to that number.", "tooEarly": "I am always the first stop after Pip. Has Pip told you what name to look up?" },
        { "resident": "tess", "says": "Number received. Hello, hello back, let's start: the connection is open, and I'll count every page.", "tooEarly": "I can't open a connection yet. Which number would I even call? Someone has to look the name up first." },
        { "resident": "lio", "says": "The baker's certificate checks out. The line is sealed now; nobody on the road can read it.", "tooEarly": "I can only seal a line that is already open. Find the careful courier at the harbour first." },
        { "resident": "bea", "says": "A sealed order for my front page! Baking now. 200 OK, here it comes.", "tooEarly": "I don't take orders on an open postcard. Get the line sealed first, then bring me the order." }
      ]
    },
    {
      "id": "numbered-pages", "kind": "parcel", "title": "A bundle of numbered pages",
      "hint": "No name on this one. Read the clues on the label and think who would care about every page arriving.",
      "teaches": "TCP numbers the pieces of a page, checks every one arrived, puts them in order and resends the missing ones.",
      "done": "My pages! One to eight, and I'd already noticed five was late. Thank you, courier.",
      "label": "A bundle of pages tied with string",
      "clues": ["Every page is numbered: 1 of 8, 2 of 8, and so on.", "A sticky note: \"Page 5 never arrived. Please send it again.\"", "Stamped on the side: \"All of them, and in the right order.\""],
      "owner": "tess",
      "decoys": [
        { "resident": "ivy", "why": "I put addresses on packets and send them off. Counting them and resending lost ones? That's Tess, two doors down." },
        { "resident": "rory", "why": "I just point packets onward. I never check whether they all arrived. Someone at the harbour does that." },
        { "resident": "bea", "why": "I bake the page in one go. Cutting it up, counting the pieces and chasing the missing one is a courier's job." }
      ]
    },
    {
      "id": "rorys-question", "kind": "reply", "title": "Rory's question",
      "hint": "Rory at the Crossroads has been puzzling over something. Ask him what's on his mind.",
      "teaches": "No router knows the whole route. Each one sends a packet one hop closer, and the next one does the same.",
      "done": "So my address stamp is all he needs to choose the next turn. That settles it, thank you.",
      "asker": "rory",
      "question": "A packet for 93.184.216.34 just arrived. Ivy keeps asking whether I need the whole route to the bakery before I send it. What should I tell her?",
      "cards": [
        { "text": "No. You only choose the next hop closer, and the next guide does the same.", "correct": true, "why": "That is how routing works. Each router looks at the destination number and its own table of neighbours, and passes the packet one step on." },
        { "text": "Yes. Every guide keeps a map of the whole internet.", "why": "The internet is far too big and changes every second. Routers only keep a table of which neighbour is best for which range of addresses." },
        { "text": "Ask the baker for directions first.", "why": "The server only bakes pages. It has no idea which roads lie between you and it." }
      ],
      "to": "ivy"
    },
    {
      "id": "morning-sort", "kind": "sort", "title": "Sort the morning mail",
      "hint": "Talk to Ada at the post office. The sorting table has a pile of envelopes for every district.",
      "teaches": "Each part of the journey has its own job: names on the hill, routes at the crossroads, counting at the harbour, orders and seals on Server Street, showing and saving on Browser Lane.",
      "done": "Every pigeonhole full and every envelope in the right one. You know this town already.",
      "intro": "Put each envelope in the pigeonhole of the district that deals with it.",
      "envelopes": [
        { "label": "What is the number for shop.example?", "district": "name-hill", "note": "Turning a name into a number is the directory's job, up on Name Hill." },
        { "label": "Which way to 93.184.216.34?", "district": "crossroads", "note": "Choosing the next hop is what the guides at the Crossroads do." },
        { "label": "Page 3 of 8 is missing, please resend", "district": "harbour", "note": "Counting pages and resending lost ones is the careful courier's job at the Harbour." },
        { "label": "GET /menu", "district": "server-street", "note": "An order slip for a page goes to Server Street, where it is read and baked." },
        { "label": "Here is my certificate for the padlock", "district": "server-street", "note": "Certificates and sealing are handled by the clerk on Server Street." },
        { "label": "Paint the new picture on screen", "district": "browser-lane", "note": "Showing the page is the browser's job, on Browser Lane." },
        { "label": "Keep this copy until Friday", "district": "browser-lane", "note": "Saved copies live in the pantry on Browser Lane." }
      ]
    },
    {
      "id": "telegram-to-hal", "kind": "telegram", "title": "A telegram for Hal",
      "hint": "The telegraph is at the post office. Hal on Server Street checks that every order slip is written properly.",
      "teaches": "HTTP is the language of orders: GET asks for a page, and the reply starts with a status like 200 OK or 404 Not Found.",
      "done": "A perfectly written order. GET to ask, 200 for success, 404 if it's missing. I could frame this.",
      "to": "hal",
      "text": "HAL STOP PIP ASKS FOR THE MENU STOP ORDER READS ___ /menu STOP IF ALL IS WELL BEA ANSWERS ___ STOP IF THERE IS NO MENU SHE ANSWERS ___ STOP",
      "gaps": [
        { "options": ["GET", "POST", "DELETE"], "answer": 0, "why": "GET asks for something. POST sends something, like a form, and DELETE asks to remove it." },
        { "options": ["404 Not Found", "200 OK", "500 Server Error"], "answer": 1, "why": "200 OK means here it is. Codes starting with 2 mean success." },
        { "options": ["200 OK", "301 Moved", "404 Not Found"], "answer": 2, "why": "404 means the server has nothing at that address. 301 would mean it has moved somewhere else." }
      ]
    },
    {
      "id": "weigh-the-page", "kind": "weigh", "title": "How heavy is a web page?",
      "after": "telegram-to-hal",
      "hint": "There is a parcel on the post-office scale. Guess its weight, then take it to whoever keeps copies so it need not be fetched again.",
      "teaches": "A typical web page today weighs about 2 to 3 megabytes, mostly pictures and scripts, which is why keeping copies saves so much.",
      "done": "Two and a half megabytes! Into the pantry it goes. Next time Pip asks, it's right here on the shelf.",
      "label": "Bea's front page, pictures and all",
      "prompt": "This parcel is a whole web page: the HTML, the pictures, the styles and the scripts. How many megabytes (MB) do you think it weighs?",
      "unit": "MB",
      "min": 0, "max": 10, "step": 0.1, "answer": 2.5, "tolerance": 1,
      "reveal": "A typical page today weighs about 2 to 3 MB (the HTTP Archive's 2024 median is close to 2.5 MB). Most of that is pictures and scripts; the HTML recipe itself is often under 50 KB.",
      "to": "cass"
    },
    {
      "id": "sealed-letter", "kind": "letter", "title": "A sealed letter for Lio",
      "hint": "Bea has a letter that needs the sealed-envelope clerk. Both work on Server Street.",
      "teaches": "TLS checks the server's certificate, then seals the connection so nobody on the way can read or change what is sent.",
      "done": "Correct, and properly sealed. That padlock in the address bar is me, at your service.",
      "from": "bea",
      "to": "lio",
      "letter": {
        "paragraphs": [
          "Lio, the courier asked why every order slip goes through you first. Could you explain? I bake the pages; you check my ID card and seal the envelope so nobody on the road can read or swap what is inside.",
          "Floury regards, Bea"
        ]
      },
      "check": {
        "question": "Lio taps the seal: \"Why do I check the baker's certificate before sealing anything?\"",
        "options": [
          { "text": "To be sure it really is bakery.example and not an impostor", "correct": true, "why": "Exactly. The certificate is signed by an authority both sides trust, so Pip knows the seal leads to the real bakery." },
          { "text": "To make the page load faster", "why": "Checking and sealing is an extra step. It costs a little time; it buys privacy and trust." },
          { "text": "To make the page smaller", "why": "Sealing hides the contents; it does not shrink them. Making things smaller is a different trick called compression." }
        ]
      }
    },
    {
      "id": "yesterdays-page", "kind": "parcel", "title": "Yesterday's page",
      "after": "fetch-the-page",
      "hint": "Another unaddressed parcel. Someone in town keeps copies of things that were already fetched.",
      "teaches": "A cache keeps copies of pages that were already fetched, with a freshness date, so the next visit needs no trip to the server.",
      "done": "That's my label. Fresh until Friday, so Pip can have it instantly tomorrow. Thank you!",
      "label": "A jar with a page inside",
      "clues": ["Inside: a copy of the bakery page somebody already fetched yesterday.", "The label says \"Fresh until Friday\".", "A note: \"If it hasn't changed, no need to ask the baker again.\""],
      "owner": "cass",
      "decoys": [
        { "resident": "bea", "why": "I bake fresh pages. Keeping copies for later is someone else's pantry, not my oven." },
        { "resident": "pip", "why": "I read and paint pages, but the copies on the shelf belong to my neighbour, the pantry keeper." },
        { "resident": "della", "why": "I do keep answers for a while, but only names and numbers, never whole pages." }
      ]
    },
    {
      "id": "hill-notice", "kind": "notice", "title": "The board on Name Hill",
      "hint": "There is a notice board by the library on Name Hill. Worth a read on your way past.",
      "teaches": "Name lookups go up a ladder of directories, from your local one to the root servers, and answers are kept for a while so most lookups are instant.",
      "district": "name-hill",
      "heading": "How Della finds a name she doesn't know",
      "paragraphs": [
        "If Della has never heard of a name, she asks a root directory, which tells her who handles names ending in .example. That directory tells her who handles bakery.example, and that one finally gives the number.",
        "It sounds slow, but every directory keeps the answers it has looked up for a while. Most lookups are answered straight from memory in a few milliseconds."
      ]
    }
  ],
  "glossary": [
    { "term": "Della, the directory keeper", "meaning": "DNS, the Domain Name System: turns domain names into IP addresses" },
    { "term": "Rory, the crossroads guide", "meaning": "A router: forwards each packet one hop closer to its destination" },
    { "term": "Ivy, the address stamper", "meaning": "IP, the Internet Protocol: puts source and destination addresses on every packet" },
    { "term": "Tess, the careful courier", "meaning": "TCP: opens a connection, numbers, orders and resends packets" },
    { "term": "Lio, the sealed-envelope clerk", "meaning": "TLS: verifies certificates and encrypts the connection (the padlock, HTTPS)" },
    { "term": "Hal, the order-slip writer", "meaning": "HTTP: the request and response format, with methods like GET and status codes like 200 and 404" },
    { "term": "Bea, the baker", "meaning": "The web server: answers requests with HTML, images, styles and scripts" },
    { "term": "Pip, the page reader", "meaning": "The web browser: requests pages, parses HTML and renders them" },
    { "term": "Cass, the pantry keeper", "meaning": "The cache: stores copies of fetched resources with an expiry time" }
  ],
  "report": {
    "heading": "Your delivery round",
    "intro": "Every errand, what it taught, and anything you mixed up on the way, with why.",
    "source": { "label": "MDN Web Docs: How the web works", "url": "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works", "note": "Page-weight figure from the HTTP Archive Web Almanac 2024." }
  }
}
```
