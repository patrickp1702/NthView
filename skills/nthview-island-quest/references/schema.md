# Island Quest data schema — schemaVersion 1

## Overview
The data describes a 3D adventure: the learner walks with a companion
character across an archipelago of islands, each island is one short lesson
with a hands-on activity (25 kinds, from a quiz to lighting beacons) and a
one-line takeaway, and finishing every island unlocks a final exam and a
report card. Everything the player reads, every activity and every question
comes from this JSON; the renderer supplies the world, laid out in rings
around the finale hub so any number of islands from 3 to 60 fits.

Text fields accept one inline mark-up: `**bold**`. Nothing else is interpreted.
Character limits count JavaScript string length, so one emoji counts as 2.

## External libraries
The renderer loads **three.js r128** from cdnjs and two Google Fonts (see
`NthView.libs` in `assets/view.js`). The output is still one file, but it
needs internet access the first time it opens.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–60 chars | Game title: HUD badge, intro heading, page title |
| `subtitle` | string | no | ≤160 chars | One line under the intro heading |
| `theme` | string | no | one of `lagoon`, `aurora`, `canyon`, `snow`; default `lagoon` | World theme: sky, sea, sand, stone, light, sky effects and the default island palette (see World themes) |
| `companion` | object | yes | see Companion | The character that follows the player |
| `coins` | integer | no | 1–99, default 10 | Starting coins; each guess costs one, every causeway holds three |
| `intro` | object | yes | see Intro | The start screen |
| `islands` | array | yes | 3–60 Island objects | One lesson per island, in play order |
| `finale` | object | yes | see Finale | The exam that opens after every island is done |
| `report` | object | yes | see Report | The end screen |

## World themes
`theme` picks the look of the whole world. Each theme has a light and a dark
variant chosen by the reader's system setting, and its own default palette
for island accents (an island's `color` overrides the palette entry).

| Theme | Mood | Sky effects | Suits |
| :- | :- | :- | :- |
| `lagoon` | Pale blue sky, teal sea, warm sand (night: indigo sky, stars) | Drifting low-poly clouds | The default; science, nature, general topics |
| `aurora` | Night sky in every mode, violet and green aurora curtains, pale lavender islands | Aurora, stars always on | Technology, space, systems, anything "wow" |
| `canyon` | Peach sky, terracotta mesas, turquoise oasis water | Clouds, distant mesas on the horizon | History, geography, economics, warm or earthy topics |
| `snow` | Overcast pale sky, white snow islands, steel-blue sea | Falling snow | Health, calm topics, winter or polar subjects, children |

## Layout
Islands are placed in concentric rings around the hub where the finale
stands. Ring *k* (counting from 1) has radius 50 + 36·(k−1) world units and
room for 7·k islands (7, 14, 21, 28), so 7 islands fill one ring, 21 fill
two, 42 fill three, and the maximum of 60 uses four. Islands fill ring 1
first in play order; a ring that is not full spreads its islands evenly.
Every island has a causeway inward (ring 1 to the hub, ring k to the
nearest island of ring k−1) and a causeway to each neighbour on its ring
whose shore is at most 40 units away, so every island is reachable and the
auto-walk follows the causeways. Islands never overlap and causeways never
cross another island; the minimap scales to the whole archipelago.

## Companion object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–20 chars | Used in HUD and guide text, e.g. "Robo" |

## Intro object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `paragraphs` | string[] | yes | 1–4 items, each 1–400 chars | Story set-up shown on the start card |
| `steps` | string[] | no | 0–5 items, each 1–300 chars | Numbered "how it works" list |
| `note` | string | no | ≤300 chars | Small print under the list (e.g. the source) |

## Island object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–30 chars, unique | Stable key for scores |
| `name` | string | yes | 1–40 chars | Island name on the 3D label and the panel |
| `theme` | string | yes | one of `grove`, `tower`, `arena`, `workshop`, `canyon`, `hall`, `clock`, `plain` | Decorative scenery on this island (not the world theme). Any scenery works with any activity; SKILL.md suggests pairings |
| `color` | string | no | `#rrggbb` | Accent colour; defaults to the world theme's palette by position |
| `lead` | string | yes | 1–600 chars | Opening paragraph of the lesson |
| `body` | string[] | no | 0–3 items, each 1–600 chars | Further paragraphs |
| `activity` | object | no | see Activities | Hands-on part; omit for a read-only lesson |
| `findings` | object | no | see Findings | Bar chart of results |
| `aside` | object | no | `title` 1–60, `text` 1–600 | Extra box shown after the activity |
| `quiz` | object | conditional | see Quiz | Required unless `activity.type` is one of the quiz-replacing types listed under Activities; forbidden when it is |
| `remember` | string | yes | 1–300 chars | One-line takeaway shown once the island is solved |

## Findings object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `caption` | string | no | ≤200 chars, default "Right answers out of 100 questions" | Line above the bars |
| `rows` | array | yes | 1–8 Row objects | One bar each |
| `text` | string | no | ≤600 chars | Paragraph under the bars |
| `after` | boolean | no | default `false` | `true` shows the findings only once the island is solved. Use it when the bars would give away the answer |

Row: `label` (string, 1–80), `value` (number, 0–100, bar length), `show`
(string, 1–12, printed next to the bar), `style` (one of `normal`, `grey`,
`dashed`; default `normal`).

## Quiz object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `question` | string | yes | 1–300 chars | |
| `options` | array | yes | 2–4 Option objects, exactly one `correct` | |
| `okText` | string | no | ≤200 chars, default "Correct!" | Shown on the right answer |

Option: `text` (string, 1–200), `correct` (boolean, optional; `false` is
accepted and means the same as omitting it), `why` (string, ≤300, optional
feedback for a wrong pick).

## Activities

Every activity has `type` and an optional `title` (1–60 chars; each type has
its own default). The remaining fields depend on `type`. There are 25 types.

**Quiz-replacing types** (the activity *is* the question; `quiz` must be
omitted; a first-try success earns 3 stars, each wrong try costs a coin):
`pads`, `truefalse`, `multi`, `order`, `match`, `sort`, `rank`, `cloze`,
`estimate`, `odd`, `hotspot`, `fork`, `beacons`, `steps`, `gather`,
`predict`, `confidence`.

**Exploration types** (unscored; `quiz` is required and asks the question
afterwards): `collect`, `story`, `tune`, `race`, `compare`, `bars`,
`switches`, `flashcards`.

**Field tasks** are played on the island itself by walking: `collect`,
`pads`, `steps`, `beacons`, `gather`, `fork`, `hotspot` (hotspot and beacons
can also be answered from the panel). Every other type is played in the
panel, and every type has a 3D prop on the island that reacts to it.

| Type | One line | Replaces quiz | Field task |
| :- | :- | :- | :- |
| `collect` | Walk into scattered tokens and hold a vote | no | yes |
| `pads` | Stand on a pad to choose | yes | yes |
| `story` | Step through a short story | no | |
| `tune` | Move controls and watch a model react | no | |
| `race` | Press a button and watch bars race | no | |
| `truefalse` | Judge one statement | yes | |
| `multi` | Tick every option that applies | yes | |
| `order` | Put items in sequence | yes | |
| `match` | Pair items from two columns | yes | |
| `sort` | Put items into buckets | yes | |
| `rank` | Rank items, then see the real numbers | yes | |
| `cloze` | Fill the gaps from options | yes | |
| `estimate` | Guess a number within a tolerance | yes | |
| `odd` | Spot the odd one out | yes | |
| `hotspot` | Click the right part of a 3D object | yes | yes |
| `fork` | Walk through the gate you choose | yes | yes |
| `beacons` | Light exactly the right beacons | yes | yes |
| `steps` | Step on pads in the right order | yes | yes |
| `gather` | Carry orbs to the right bins | yes | yes |
| `compare` | Flip between a before and an after | no | |
| `bars` | Set bars to your guess, then reveal the truth | no | |
| `switches` | Toggle switches and read the status | no | |
| `predict` | Predict, run it, see if you were right | yes | |
| `confidence` | Answer and say how sure you are | yes | |
| `flashcards` | Flip through a card deck | no | |

### `collect` — walk into scattered answers and hold a vote

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400; task text shown before collecting |
| `items` | string[] | yes | 3–9 items, each 1–3 chars; the answers to pick up. Short tokens such as letters; the orbs show only the token, so explain what each stands for in `lead`, `body` or `prompt` |
| `resultTitle` | string | no | ≤60, default "The vote" |
| `resultText` | string | yes | 1–200; may use `{top}`, `{count}`, `{total}` |
| `resultNote` | string | no | ≤300; small print under the result |

### `pads` — stand on a pad to choose

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `options` | array | yes | 2–4 Pad objects |
| `answer` | string | yes | the `id` of the correct pad |

Pad: `id` (kebab-case, unique), `label` (1–12 chars shown on the pad),
`hint` (≤300, toast when chosen wrongly), `bars` (optional `[grey, colour]`,
two numbers 0–100 drawn as a column pair behind the pad), `size` (optional
number 0.5–4, draws a figure of that height behind the pad).

### `story` — step through a short story

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `buttonLabel` | string | yes | 1–40 |
| `resetLabel` | string | no | ≤40, default "Start over" |
| `frames` | string[] | yes | 2–8 items, each 1–300 |
| `caption` | string | no | ≤300 |

On the island a row of story stones lights up frame by frame.

### `tune` — move controls and watch a model react

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `controls` | array | yes | 1–3 Control objects |
| `readout` | array | yes | 1–4 Readout objects; the first whose `when` is true (or has none) is shown |
| `visual` | object | no | `kind` one of `circle`, `grid`; `count` expr; `extra` expr; `leader` boolean (grid only). See below |
| `tally` | object | no | `count` expr, `icon` one emoji or 1–2 characters, `max` integer 1–60 (default 30) |
| `outcomes` | object | no | `buttonLabel` 1–40; `cases` 1–8 of `{when, text, tone}`; `fallback` `{text, tone}` |
| `caption` | string | no | ≤300 |

Control: `id` (`^[a-z][a-z0-9]*$`, unique), `label` (1–60), `min`, `max`,
`value` (integers, `min < max`, `min ≤ value ≤ max`).
Readout: `when` (expr, optional), `text` (1–300, may contain `{expr}`).
Tone: one of `ok`, `note`, `no`.

**Expressions** may contain numbers, control ids, `+ - * / %`, comparisons
`== != < <= > >=`, `&& || !` and parentheses. Nothing else. `{expr}` inside a
readout text is replaced by its value.

**What the visual draws on the island** (values are rounded and clamped):
- `circle`: `count` figures standing in a ring (0–12) and `extra` paper slabs
  stacked in the middle (0–36). Good for "members" and "notes" or "rounds".
- `grid`: `count` cubes per row (1–8) and `extra` rows (0–6), wired to the
  next row; `leader: true` adds one glowing node on top. Good for layered
  teams or pipelines.

`tally.count` is rounded to a whole number and shown as that many `icon`s in
the panel, capped at `max`.

### `race` — press a button and watch bars race

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `buttonLabel` | string | yes | 1–40 |
| `bars` | array | yes | 2–4 of `{label 1–80, value 0–100, show 1–12, tag ≤12}` |
| `caption` | string | no | ≤300 |

`tag` is the short word drawn on the 3D gear; it defaults to the first word
of `label`. A larger `value` means a longer or slower thing: in the panel its
bar is longer, and on the island its gear spins faster and glows. The bars
start empty and animate when the button is pressed.

### `truefalse` — judge one statement

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `statement` | string | yes | 1–300 |
| `answer` | boolean | yes | `true` or `false` |
| `why` | string | no | ≤300; shown after answering, right or wrong |
| `trueLabel` | string | no | ≤20, default "True" |
| `falseLabel` | string | no | ≤20, default "False" |

Island prop: a signpost with two boards; the right one lights up when solved.

### `multi` — tick every option that applies

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `question` | string | yes | 1–300 |
| `options` | array | yes | 3–6 of `{text 1–200, correct boolean optional, why ≤300 optional}`; at least one `correct: true` and at least one wrong |

Feedback after a wrong check says how many options are off, how many were
missed and how many should not be ticked, plus the `why` of the first wrongly
ticked option. Island prop: one pillar per option, lit while ticked.

### `order` — put items in sequence

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `items` | array | yes | 3–7 of `{text 1–120, note ≤200 optional}` listed **in the correct order**; the panel shuffles them (never into the correct order) |

Move items with up/down buttons; after a wrong check the items in the right
place turn green. `note` appears under each item once solved. Island prop:
stepping stones that reveal their numbers when solved.

### `match` — pair items from two columns

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `pairs` | array | yes | 3–6 of `{left 1–80, right 1–80}`; every `right` unique |

The right column is shuffled; the learner taps a left item then its partner.
Wrong pairs are undone after a check. Island prop: two rows of pillars joined
by light beams when solved.

### `sort` — put items into buckets

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `buckets` | array | yes | 2–4 of `{id kebab-case unique, label 1–30}` |
| `items` | array | yes | 3–10 of `{text 1–80, bucket id}`; `bucket` must be a bucket id |

Island prop: one bin per bucket, filled with cubes when solved.

### `rank` — rank items, then see the real numbers

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300; say which way is "first" |
| `items` | array | yes | 3–6 of `{text 1–80, value 0–100, show 1–12}` listed **in the correct rank order** (first item = top) |
| `caption` | string | no | ≤300; shown under the revealed bars |

`value` is the bar length and `show` the printed value, revealed as a bar
chart once the ranking is right. Island prop: a podium of columns that rise
to the values when solved.

### `cloze` — fill the gaps from options

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `text` | string | yes | 1–600, with one `___` (three underscores) per gap |
| `gaps` | array | yes | 1–6 of `{options string[2–5] each 1–40, answer index}`; the count must equal the number of `___` in `text` |

Each gap is a dropdown; after a wrong check the wrong gaps turn red. Island
prop: a stone tablet with glowing gap slabs.

### `estimate` — guess a number within a tolerance

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `question` | string | yes | 1–300 |
| `min`, `max` | number | yes | `min < max`; the slider range |
| `answer` | number | yes | between `min` and `max` |
| `tolerance` | number | yes | ≥ 0; a guess within ±tolerance is right |
| `step` | number | no | > 0, default 1 |
| `unit` | string | no | ≤12, e.g. "%" or "ms" |
| `reveal` | string | no | ≤300; shown once solved |

A slider and a number box stay in sync; feedback says "too high" or "too
low". Island prop: a glass gauge that fills to the guess and marks the answer.

### `odd` — spot the odd one out

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `items` | string[] | yes | 3–6 items, each 1–80 |
| `answer` | integer | yes | index into `items` |
| `why` | string | no | ≤300; shown once solved |

Island prop: a half-ring of statues; the odd one spins and glows when solved.

### `hotspot` — click the right part of a 3D object (field task)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `parts` | array | yes | 3–6 of `{id kebab-case unique, label 1–16, hint ≤300 optional}` |
| `answer` | string | yes | one of the part ids |

The island carries a glowing core with one labelled node per part. The
learner clicks a node in the 3D view, or picks the part from a list in the
panel. A wrong part dims and shows its `hint`.

### `fork` — walk through the gate you choose (field task)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `paths` | array | yes | 2–3 of `{id kebab-case unique, label 1–16, hint ≤300 optional}` |
| `answer` | string | yes | one of the path ids |

Each path is a short pier ending in a gate. Walking through the right gate
solves the island; a wrong gate shows its `hint`, costs a coin and sends the
player back to the signpost.

### `beacons` — light exactly the right beacons (field task)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 3–8 of `{id kebab-case unique, label 1–16, lit boolean}`; at least one `lit: true` and one `lit: false` |

Walk up to a brazier and press "Light" or "Put out" in the guide, or toggle
them from the panel, then press "Check the beacons". The check succeeds when
every beacon matches its `lit` value.

### `steps` — step on pads in the right order (field task)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 3–7 of `{id kebab-case unique, label 1–12}` listed **in the correct order**; the pads are laid out shuffled |

Stepping on the next pad in order lights it; a wrong pad costs a coin and
resets the sequence. Stepping on the last pad solves the island.

### `gather` — carry orbs to the right bins (field task)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `bins` | array | yes | 2–3 of `{id kebab-case unique, label 1–16}` |
| `items` | array | yes | 3–8 of `{label 1–12, bin id}`; `bin` must be a bin id |

Walking into an orb picks it up (it floats above the player); near a bin the
guide offers "Drop it here". A wrong bin costs a coin and the orb stays in
hand. All orbs sorted solves the island.

### `compare` — flip between a before and an after (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤300 |
| `before`, `after` | object | yes | `{label 1–40, text 1–400, rows 1–5 of {label 1–80, value 0–100, show 1–12}}` |
| `caption` | string | no | ≤300 |

A two-way switch shows one side at a time with its bars animating in.
Island prop: two platforms of columns; the active side is raised.

### `bars` — set bars to your guess, then reveal the truth (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 2–5 of `{label 1–80, value 0–100, show 1–12}` |
| `revealText` | string | no | ≤300; shown after the reveal |
| `buttonLabel` | string | no | ≤40, default "Reveal the real numbers" |

One slider per item; the reveal marks the real value on each bar. Island
prop: columns that follow the sliders, with ghost columns at the real values.

### `switches` — toggle switches and read the status (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤300 |
| `switches` | array | yes | 1–4 of `{id ^[a-z][a-z0-9]*$ unique, label 1–60, on boolean}` |
| `readout` | array | yes | 1–6 of `{when expr optional, text 1–300, tone ok/note/no optional}`; the first whose `when` is true (or has none) is shown |
| `caption` | string | no | ≤300 |

Expressions use the same grammar as `tune`; a switch is `1` when on and `0`
when off. Island prop: a machine with one lamp per switch and a status light
coloured by the readout's tone.

### `predict` — predict, run it, see if you were right

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `question` | string | yes | 1–300 |
| `options` | array | yes | 2–4 of `{text 1–200, correct boolean optional, why ≤300 optional}`; exactly one `correct` |
| `runLabel` | string | no | ≤40, default "Run it and watch" |
| `frames` | string[] | yes | 1–6 items, each 1–300; shown one by one after "run" |
| `result` | string | yes | 1–300; the conclusion shown at the end |

One shot: a right prediction earns 3 stars; a wrong one costs a coin, earns 1
star, and the island still counts as done. Island prop: a crystal orb that
flares when run.

### `confidence` — answer and say how sure you are

Same fields as a Quiz object (`question`, `options` with exactly one
`correct`, optional `okText`), plus a fixed three-level confidence choice.
Right and "I'm sure" earns 3 stars, "I think so" 2, "Just guessing" 1. A
wrong answer costs one coin, or two when the learner was sure; wrong options
are disabled and the learner may try again. Island prop: a three-ring target
that lights one ring per star.

### `flashcards` — flip through a card deck (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤300 |
| `cards` | array | yes | 2–10 of `{front 1–120, back 1–300}` |

Flip, previous/next and a "Got it" toggle per card. Island prop: a deck of
slabs whose top card flips with the panel.

## Finale object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–40 | Shown on the centre label and guide |
| `lead` | string | yes | 1–400 | Intro paragraph of the exam |
| `questions` | array | yes | 1–6 Quiz objects | Asked one after another |

## Report object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | yes | 1–60 | e.g. "Robo passed!" |
| `tiers` | object | no | `perfect`, `great`, `pass` strings ≤200 | Message for all stars / ≥80% / otherwise |
| `lessons` | string[] | yes | 1–12 items, each 1–200 | "What you learned" list |
| `glossaryIntro` | string | no | ≤200 | Line above the glossary |
| `glossaryColumns` | string[] | no | exactly 2 items, ≤30 each | Table headings, default "In this game" / "In the paper" |
| `glossary` | array | no | 0–12 of `{term 1–60, meaning 1–120}` | Game word → real term |
| `source` | object | no | `label` 1–200, `url` (http or https, optional), `note` ≤300 | Citation; rendered as a link when `url` is given |

## Cross-field rules
- `islands[i].id` must be unique across islands.
- If `islands[i].activity.type` is a quiz-replacing type (`pads`,
  `truefalse`, `multi`, `order`, `match`, `sort`, `rank`, `cloze`,
  `estimate`, `odd`, `hotspot`, `fork`, `beacons`, `steps`, `gather`,
  `predict`, `confidence`), `islands[i].quiz` must be absent; in every other
  case (an exploration activity or no activity) `islands[i].quiz` is required.
- `pads.answer`, `hotspot.answer` and `fork.answer` must equal one of their
  option/part/path ids; those ids are unique within the activity.
- `sort.items[j].bucket` must be a `sort.buckets[k].id`;
  `gather.items[j].bin` must be a `gather.bins[k].id`.
- `cloze.text` must contain exactly `cloze.gaps.length` occurrences of `___`;
  every `gaps[j].answer` is an index into `gaps[j].options`.
- `odd.answer` is an index into `odd.items`.
- `estimate`: `min < max` and `min ≤ answer ≤ max`.
- `match.pairs[j].right` values are unique.
- `multi` has at least one correct and at least one wrong option; `beacons`
  has at least one lit and at least one unlit item; `predict.options` has
  exactly one correct option.
- Every quiz (island, finale, `confidence`) has exactly one option with
  `correct: true`.
- Every expression in a `tune` activity must parse and reference only that
  activity's control ids; every `switches.readout[j].when` must parse and
  reference only that activity's switch ids.
- `tune.visual.leader` is only allowed when `kind` is `grid`.
- `report.glossaryColumns`, when present, has exactly two entries.

## Warnings (non-blocking)
- Fewer than 5 islands ("5–7 make a fuller quest"), or more than 30 (a long
  quest; consider splitting the topic).
- Six or more islands using only one or two activity types.
- A `findings` object without `text`.
- A wrong quiz option without a `why`; a `truefalse` without a `why`.
- `collect.items` where no answer is a clear majority.
- An island without an activity (read-only lesson).
- A `sort` bucket or `gather` bin that receives no items.
- Two neighbouring `rank` items with the same value.
- An `estimate.tolerance` that covers half the range.
- A `switches.readout` where every entry has a `when` (nothing shows when
  none matches).

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
