# Story data schema — schemaVersion 1

## Overview
The data describes an animated 3D story that plays like a video: a cast of
cartoon characters who personify the parts of a concept, props that stand
for its things, a few places in one small toon world, and chapters of short
beats. Each beat says **where** it happens, **who and what** is there, what
they **do** and the caption that explains it; the player works out every
position, walk, hand-over and camera move itself, so the data holds no
coordinates.

Character limits count JavaScript string length. Ids are lowercase
kebab-case (`mail-carrier`), 1–40 characters. Actor and prop ids share one
namespace; place ids and chapter ids each have their own. No id may be a
mark name (`left`, `center`, `right`, `back-left`, `back-right`, `door`,
`post`).

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Page heading and title card |
| `subtitle` | string | no | ≤200 chars | One line under the title |
| `summary` | string | no | ≤400 chars | Intro paragraph on the start screen |
| `audience` | string | no | ≤80 chars | Shown on the start screen, e.g. "Anyone with an email account" |
| `lang` | string | no | BCP 47 tag, ≤20 chars, default `en` | Language of the text; picks the narration voice |
| `world` | string | no | `day` (default), `dusk`, `night`, `studio` | Light and sky; `studio` is a soft abstract backdrop for non-physical topics |
| `narrator` | object | no | Narrator object | The storyteller's voice |
| `pace` | string | no | `chapter` (default), `flow`, `beat` | Default auto-play: `chapter` pauses after each chapter's takeaways, `flow` only holds for the think pause, `beat` stops after every beat. The learner can change it |
| `cast` | array | yes | 1–10 Actor objects | Who is who |
| `props` | array | no | 0–30 Prop objects | Things and their metaphors |
| `places` | array | no | 1–6 Place objects | Locations in the world; without it there is one `stage` place |
| `chapters` | array | yes | 1–12 Chapter objects | The story, in order |
| `recap` | object | no | Recap object | The end card's key takeaways for the whole story |
| `next` | string | no | ≤120 chars | A closing teaser on the end card, e.g. "Next: Part 2, account recovery" |
| `sources` | array | no | 0–12 Source objects | Listed on the end card |

## Actor object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among actors and props | Used in beats |
| `name` | string | yes | 1–24 chars | Name on the tag above the head |
| `role` | string | yes | 1–40 chars | Second line of the tag: the part it plays, e.g. "the login check" |
| `preset` | string | yes | a preset below | Body, hat, accessory and default colour |
| `stands` | string | no | ≤160 chars | What it stands for, shown on the "Who's who" card |
| `color` | string | no | `#rrggbb` | Overrides the preset's body colour |
| `post` | string | no | a place id | The actor works there and stands at its post (behind the counter, by the gate) |
| `voice` | string | no | `female` or `male` | Kind of voice the actor speaks with when the story is read aloud; each actor gets its own voice, distinct from the narrator |

Presets: `courier` (orange, cap, satchel), `guard` (navy, peaked cap,
clipboard), `clerk` (green, apron), `crook` (plum, top hat, eye mask),
`scientist` (white coat, goggles), `doctor` (teal, stethoscope), `worker`
(yellow, hard hat), `robot` (grey, box head, antenna), `chief` (dark suit,
red tie), `messenger` (red, winged cap, scroll), `teacher` (brown, glasses),
`student` (teal, backpack), `citizen` (pink, plain), `knight` (steel,
plumed helmet), `royal` (purple robe, crown), `blob` (a round cell-like
creature that hops) and `spiky` (a spiky blob: a germ, a bug, a threat).

## Narrator object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `voice` | string | no | `female` or `male`, default `female` | Kind of narrator voice |
| `tone` | string | no | a tone, default `warm` | Default tone of the narration |

Tones: `calm`, `warm`, `urgent`, `wry`, `whisper`, `excited`, `serious`,
`sad`. Each sets the speaking rate, pitch, loudness and the length of the
pauses.

## Prop object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among actors and props | Used in beats |
| `kind` | string | yes | a kind below | Its shape |
| `label` | string | yes | 1–30 chars | Tag shown beside it |
| `means` | string | no | ≤160 chars | The metaphor, on the "Who's who" card: "a request" |
| `color` | string | no | `#rrggbb` | Main colour |
| `heldBy` | string | no | an actor id | Starts in that actor's hand |
| `value` | number or string | see kinds | | Starting value |
| `text` | string | see kinds | | Text the prop shows |
| `title` | string | no | ≤40 chars | Heading of a `card` or `code` window |
| `code` | string | `code` only | 1–600 chars, ≤12 lines | Source shown in a `code` window |
| `lang` | string | no | ≤20 chars | Language label of a `code` window |
| `highlight` | integer[] | no | line numbers within `code`, 1-based | Lines to emphasise |

Kinds, and what they take:

| Kinds | `value` | `text` | Opens |
| :- | :- | :- | :- |
| `gauge` (thermometer) | number 0–1, the fill | — | — |
| `counter`, `clock`, `phone`, `laptop`, `coin`, `ticket`, `server` | string ≤24, shown on its tag | — | `laptop` |
| `number` (big number card) | string 1–16, **required** | — | — |
| `card` (text window) | — | 1–240, **required** | — |
| `formula` | — | 1–120, **required** | — |
| `sign` (signpost) | — | 1–40, **required** | — |
| `document` | — | ≤160, shown on its tag | — |
| `code` (code window) | — | — | — |
| `letter`, `parcel`, `box`, `gift`, `lock`, `cabinet`, `book`, `bulb` | — | — | yes (`lock` opens its shackle, `bulb` lights) |
| `key`, `stamp`, `shield`, `magnifier`, `flag`, `orb`, `hook` | — | — | — |

`card`, `code`, `formula` and `number` are windows: crisp text floating
beside whoever holds them, or in a corner of the frame. `orb` is a glowing
sphere for anything abstract (a molecule, an idea, a token, energy).

## Place object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among places | Used by `beats[].at` and `actor.post` |
| `set` | string | yes | a set below | The scenery |
| `name` | string | yes | 1–40 chars | Shown when the story arrives there, and on its sign |

Sets: `street`, `shop` (counter), `office` (desk, cabinet), `lab`,
`tower` (watchtower), `server-room`, `classroom` (blackboard), `gate`
(wall and gate), `home`, `bank` (columns, vault), `park`, `factory`
(conveyor belt), `organic` (inside a body: soft tissue, cells, a vessel) and
`stage` (an abstract round stage). Places stand side by side along one
street; each has a post, five standing marks and spots for props.

## Chapter object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, unique among chapters | Stable key |
| `title` | string | yes | 1–60 chars | Title card and chapter list |
| `beats` | array | yes | 1–12 Beat objects | Played in order |
| `takeaway` | object | no | Takeaway object | Shown after the last beat |

## Takeaway object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `think` | string | no | ≤200 chars | A "pause to think" prompt shown first, with a calm countdown; a pause, not a question to answer |
| `seconds` | integer | no | 3–30, default 8 | Length of the think pause |
| `points` | string[] | yes | 1–4 items, each 1–140 chars | Key takeaways of the chapter |

## Beat object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `caption` | string | yes | 1–160 chars | The one idea of this beat, always on screen |
| `at` | string | no | a place id | Where it happens; default: the previous beat's place, or the first place |
| `with` | string[] | no | 0–12 unique actor or prop ids; ≤6 actors, ≤4 standing props, ≤2 windows | Exactly who and what is at the place now: others there walk off or vanish, newcomers walk in. Omit to keep the scene as it is |
| `do` | array | no | 0–6 Action objects | Played one after another |
| `lines` | array | no | 0–3 Line objects | Speech bubbles, in order |
| `say` | string | no | ≤400 chars | The narration, written for the ear and read aloud instead of `caption` when voice is on: short sentences, contractions, "you". `...` or `…` makes a longer pause |
| `tone` | string | no | a tone | How this beat's narration is spoken; default the narrator's tone |
| `focus` | string or string[] | no | 1–3 actor or prop ids | What the camera frames and the spotlight picks out; default: the subjects of the actions, else everyone |
| `shot` | string | no | a shot below, default `auto` | Camera shot |
| `cut` | boolean | no | default `false` | A hard cut instead of a camera move |
| `hold` | number | no | 0–20 seconds | Extra time on screen |

Shots: `auto` (establishing on a chapter's first beat, else framed to the
focus), `establishing`, `wide`, `medium`, `two-shot`, `close-up`,
`over-shoulder` (behind the second focus, looking at the first), `aerial`,
`crane-up` (rises from the focus to a high view), `follow` (tracks the
first focus) and `low` (looks up at the focus: menace or triumph).

## Line object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `who` | string | yes | an actor id | Speaker; the bubble points at them |
| `text` | string | yes | 1–120 chars | In first person and conversational |
| `mood` | string | no | a mood | The face while speaking, kept afterwards |
| `tone` | string | no | a tone | How the line is spoken; default from the mood |

Moods: `neutral`, `happy`, `sad`, `worried`, `smug`, `suspicious`,
`surprised`, `angry`, `thinking`, `scared`.

## Action object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `act` | string | yes | an act below | What happens |
| `who` | string | see acts | an actor id | Who does it |
| `prop` | string | see acts | a prop id | What it is done to |
| `to` | string | see acts | see acts | Target |
| `from` | string | `link`, `unlink` | an actor or prop id | Start of a link |
| `mood` | string | `react` | a mood | New face |
| `value` | number or string | `set` | as the prop's kind takes | New value |
| `text` | string | `stamp`; `set` on text kinds | stamp: 1–14 chars; set: as the kind takes | Stamp mark, or new text |
| `tone` | string | no | `good`, `bad` (default for `stamp`), `info` | Colour of a stamp or link |
| `count` | integer | `crowd` | 0–8 | How many copies stand with `who`; 0 dissolves them |
| `label` | string | no | ≤30 chars | Label on a link |

Acts (required fields in brackets; `to` is optional unless marked):

| Act | Fields | What the learner sees |
| :- | :- | :- |
| `walk` | who, **to**: actor, prop, place, or mark | Walks over; to another place: leaves by the door and arrives there |
| `give` | who, prop, **to**: actor | Walks up if needed and hands it over |
| `take` | who, prop | Picks it up |
| `drop` | who, prop, to: prop or mark | Puts it down |
| `show` | prop, or who; to: actor (into their hand) or mark | Pops into view |
| `hide` | prop, or who | Disappears |
| `react` | who, mood | Changes face with a little hop, shake or shiver |
| `point` | who, **to**: actor or prop | Turns and points |
| `turn` | who, **to**: actor or prop | Turns to face it |
| `stamp` | who, prop, text, tone | Stamps it: a coloured mark with the text |
| `open`, `close` | prop | Opens or closes it (kinds that open) |
| `set` | prop, value or text | Changes its value: a gauge fills, a counter ticks |
| `reject` | who, **to**: actor | Holds up a hand; the other is pushed back under a red cross |
| `celebrate` | who | Jumps for joy, with confetti |
| `crowd` | who, count | Copies of `who` crowd in (a botnet, a mob, many cells) |
| `link` | from, **to**: actor or prop, label, tone | A glowing line with pulses running from → to |
| `unlink` | from, **to** | Removes that link |

Marks for `to`: `left`, `center`, `right`, `back-left`, `back-right`,
`door`, `post`.

## Recap object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | no | ≤60 chars, default "Key takeaways" | Heading of the end card |
| `points` | string[] | yes | 1–6 items, each 1–160 chars | The whole story in a few lines |

## Source object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–140 chars | Name of the source |
| `url` | string | no | `http://` or `https://`, ≤300 chars | Link |
| `note` | string | no | ≤160 chars | What it supports |

## Cross-field rules
- Actor and prop ids are unique together; place ids are unique; chapter ids
  are unique; no id is a mark name.
- `actor.post`, `beats[].at` and a `walk` to a place name a `places[].id`.
- `prop.heldBy`, `lines[].who` and every `who` name a `cast[].id`; every
  `prop` names a `props[].id`; `from` and the `to` of `point`, `turn`,
  `link` and `unlink` name an actor or a prop; the `to` of `give` and
  `reject` names an actor other than `who`; the `to` of `drop` and `show`
  names a prop or a mark (`show` also an actor).
- `beats[].with` and `focus` name actors or props; `with` holds no duplicate
  and at most 6 actors, 4 props that are not windows or held, and 2 windows.
- Each act has the fields its row requires; `show` and `hide` take exactly
  one of `who` and `prop`.
- `value` and `text` fit the prop's kind (table above), both on the prop and
  in `set`; `number`, `card`, `formula` and `sign` props have their required
  field; `code` and `highlight` appear only on `code` props, `highlight`
  within its line count.
- `stamp` has `text`; `react` has `mood`; `crowd` has `count`.
- `tone` on the narrator, a beat or a line is one of the tones; `voice` on an
  actor or the narrator is `female` or `male`.

## Warnings (non-blocking)
- A caption longer than 22 words, or `say` longer than 70 words (one idea per
  beat; long text vanishes before it is read).
- `say` identical to the caption (write it for the ear instead), or a `say`
  sentence longer than 25 words (too long to say in one breath).
- A chapter with more than 8 beats, or without a `takeaway`.
- No `recap`.
- An estimated running time over 8 minutes.
- More than 7 actors (hard to keep apart), or an actor or prop that never
  appears.
- A line, or an action's `who`, naming an actor who is not at the beat's
  place (the player brings them in).
- `open` or `close` on a kind that does not open, or a field the prop's kind
  ignores.
- A `code` line longer than 48 characters (hard to read on a phone).
- An actor without `stands`, or a prop without `means`, so the "Who's who"
  card has a gap.

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
