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
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
