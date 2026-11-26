# Game data schema — schemaVersion 1

## Overview
The data describes a learning game cut into levels: each level is one short
lesson, read while the game waits, then one question or hands-on task about
it, then a one-line takeaway; a final round of questions and a report end the
game. The same data plays in three games, chosen by `game`: a walk across
islands (`islands`), a run through temple ruins (`runner`) or a sneak through
guarded rooms (`stealth`). Everything the learner reads and answers comes from
this JSON; each game supplies its own world, so any valid document plays in
all three.

Text fields accept one inline mark-up: `**bold**`. Nothing else is interpreted.
Character limits count JavaScript string length, so one emoji counts as 2.

## External libraries
The renderer loads **three.js r128** from cdnjs and Google Fonts (Atkinson
Hyperlegible, Bricolage Grotesque, Cinzel, Rubik), declared in `NthView.libs`
in `assets/view.js`. The output is still one file, but it needs internet
access the first time it opens.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–60 chars | Game title: intro heading, page title |
| `subtitle` | string | no | ≤160 chars | One line under the intro heading |
| `game` | string | yes | one of `islands`, `runner`, `stealth` | Which game plays the levels (see Games). `islands` is the default when the user names none |
| `strictMode` | boolean | no | default `false` | `false`: learning mode, wrong answers are explained and never block. `true`: quiz mode, wrong answers cost lives and the answer stays hidden until found (see Modes) |
| `hero` | object | yes | see Hero | The character the learner plays |
| `lives` | integer | no | 1–9, default 3 | Lives for quiz mode: each wrong answer costs one; when the last goes it is counted and a fresh set is handed out. Unused in learning mode |
| `intro` | object | yes | see Intro | The start card |
| `levels` | array | yes | 1–500 Level objects | One lesson and one question or task per level, in play order |
| `finale` | object | yes | see Finale | The questions after the last level |
| `report` | object | yes | see Report | The end screen |
| `world` | object | no | see World | Optional dressing per game: themes, opponents, per-level scenery. Everything has a default |

## Games
`game` picks the world; the lessons, questions, scoring, progress, report and
modes are the same in all three. Write `intro`, lessons and questions so they
read well in any of them (no "run" or "island" in the lesson text); each game
adds its own one-line controls to the start card. A file contains only the
game it names; to play the same content as another game, change `game` and
build a new file.

| Game | The learner | A level | The question or task | Lives | Finale | Suits |
| :- | :- | :- | :- | :- | :- | :- |
| `islands` | walks with a companion across an archipelago, by keys, a stick, or by tapping an island | an island: walk there, read the lesson, then the challenge | a card, or a task walked on the island for `lanes`, `gates`, `torches`, `levers`, `tiles`, `collect` | hearts | the summit at the centre | The default: calm, beginners, children, any topic |
| `runner` | runs through temple ruins with chasers behind, swiping or using arrow keys | a stretch of track of about 15 seconds after the lesson | an encounter at the end asks it, or a trial on the track for the eight in-world types | torches | a final sprint with stops | Quick recall, phones, energy |
| `stealth` | sneaks through a room of guards seen from above, tapping to move | a room: take down the boss, open his secret box | a card, or a task in the cleared room for the eight in-world types | lockpicks | the vault | Missions, suspense, older learners |

Every game waits while a lesson is open: nothing moves, chases or times out
until the learner taps **Begin**, and every question card has **Read the
lesson again**, so reading always comes before speed.

More than 50 levels in `islands` are split into archipelagos of up to 50
islands; the last island of one leads to a harbour that sails on to the next.

## Modes
`strictMode` decides what a wrong answer does; leave it `false` unless the
user asked for a quiz, test, exam or to evaluate or grade the learner.

- **Learning mode** (`false`, the default). A wrong answer shows why it is
  wrong, reveals and highlights the right answer, and the screen edge flashes.
  The learner taps **Continue**, or picks again first; options stay live. The
  level's stars drop (3 with no mistakes, 2 after one, 1 after two or more).
  Nothing is ever locked: an in-world task with mistakes still opens the way,
  with the corrections listed on the cleared page.
- **Quiz mode** (`true`). A wrong answer costs a life (a heart, a torch or a
  lockpick) and the right answer stays hidden until it is found. When the
  last life goes, a card counts it and **Resume** hands out a fresh set; play
  goes on where it was. The report shows lives left and how often they ran
  out.

The world can also stop the hero, in both modes, and never costs answers or
stars: in `runner` three stumbles let the chasers catch up (counted, then the
run resumes a few metres back); in `stealth` a guard who keeps the hero in his
light strikes (counted; only that room restarts, a little easier each time,
and from the third time the room can be skipped). `islands` has no danger.

## Hero object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–20 chars | Used in the intro, notices and the report, e.g. "Mara" |

## Intro object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `paragraphs` | string[] | yes | 1–4 items, each 1–400 chars | Story set-up on the start card |
| `steps` | string[] | no | 0–5 items, each 1–300 chars | Numbered "how it works" list |
| `note` | string | no | ≤300 chars | Small print (e.g. the source) |

## Level object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–30 chars, unique | Stable key for progress and scores; also the seed of the level's generated world |
| `name` | string | yes | 1–40 chars | Level name in the HUD, lesson and report |
| `color` | string | no | `#rrggbb` | Accent colour of this level's cards (and island); defaults to the theme |
| `lead` | string | yes | 1–600 chars | Opening paragraph of the lesson |
| `body` | string[] | no | 0–3 items, each 1–600 chars | Further paragraphs |
| `findings` | object | no | see Findings | Bar chart of numbers |
| `activity` | object | no | see Activities | The level's question, task or exploration; omit for a quiz-only level |
| `quiz` | object | conditional | see Quiz | Required unless `activity.type` is a scored type; forbidden when it is |
| `checks` | array | no | 1–10 activity objects, each of a scored panel type | Extra questions asked one after another, after the activity and quiz |
| `aside` | object | no | `title` 1–60, `text` 1–600 | Extra box on the cleared page |
| `remember` | string | yes | 1–300 chars | One-line takeaway on the cleared page and in the report |

How a level plays: the world brings the learner to the level (a walk to the
island, the next stretch of track, the next room), the lesson card opens and
the world waits; **Begin** starts the level's play (nothing to do on an
island, a run, a room of guards); then come the activity and quiz as cards,
or the in-world task, then the checks; the world celebrates (the island
lights up, the encounter clears, the key opens the door) and the cleared page
shows the stars, any task notes, `findings` with `after`, the `aside` and the
`remember` line.

## World object
Optional. Each key is a game and dresses only that game, so one document can
carry dressing for all three. Per-level entries are keyed by level id; a
level without an entry, or a field left out, takes the default.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `islands` | object | no | see World islands | Dressing for `game: "islands"` |
| `runner` | object | no | see World runner | Dressing for `game: "runner"` |
| `stealth` | object | no | see World stealth | Dressing for `game: "stealth"` |

### World islands

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `theme` | string | no | one of `lagoon`, `aurora`, `canyon`, `snow`; default `lagoon` | Sky, sea, sand, light and sky effects; each has a light and a dark variant |
| `levels` | object | no | keys are level ids; values `{scenery}` | `scenery`: one of `grove`, `tower`, `arena`, `workshop`, `canyon`, `hall`, `clock`, `plain`; default rotates in that order by position. Decoration only |

| Theme | Mood | Suits |
| :- | :- | :- |
| `lagoon` | Pale blue sky, teal sea, warm sand (night: indigo sky, stars), drifting clouds | The default; science, nature, general topics |
| `aurora` | Night sky in every mode, aurora curtains, pale lavender islands | Technology, space, systems |
| `canyon` | Peach sky, terracotta mesas, turquoise water | History, geography, economics |
| `snow` | Overcast pale sky, white islands, falling snow | Health, calm topics, children |

### World runner

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `theme` | string | no | one of `jungle`, `haunted`, `sand`, `ice`; default `jungle` | Sky, light, fog, props and ambient effects |
| `chaser` | object | no | `name` ≤40 (a plural noun phrase, e.g. "the shadow monkeys"), `kind` one of `monkey`, `ghost`, `jackal`, `yeti` | Who runs behind; the kind defaults by theme (`jungle` monkey, `haunted` ghost, `sand` jackal, `ice` yeti) and the name by kind |
| `levels` | object | no | keys are level ids; values `{scenery, encounter, hazards}` | See below |

`scenery` is one of `causeway`, `canopy`, `ruins`, `cliffs`, `waterfall`,
`bridges`, `tunnel`, `courtyard` (default rotates in that order): the look
and the obstacle mix. `encounter` is one of `gate`, `ghost`, `fire`,
`guardian`, `bridge`, `monkey`, `vines`, `idol`, `ropebridge`, `serpent`
(default rotates in that order): who or what blocks the way and asks.
`hazards` is one of `none`, `light`, `normal`, `heavy` (default `normal`): how
many obstacles the stretch has.

### World stealth

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `theme` | string | no | one of `warehouse`, `bunker`, `lab`, `rooftop`; default `warehouse` | Floor, walls, crates, uniforms and the card accent |
| `guards` | object | no | `name` ≤40, a plural noun phrase, default "the guards" | Named on the start card |
| `levels` | object | no | keys are level ids; values `{room, boss, soldiers, squad, reward}` | See below |

`room` is one of `corridors`, `pillars`, `offices`, `yard` (default rotates):
the layout. `boss` is one of `sentinel` (wide searchlight; come from
behind), `sprinter` (fast, turns at random), `brute` (two hits) and `warden`
(shielded while soldiers stand); default rotates. `soldiers` (3–5, default
cycles 3, 4, 5) is how many patrol besides the boss; `squad` (3–5 kinds, each
one of `rookie`, `rifleman`, `scout`, `blade`, `sniper`, `heavy`, `shield`,
`officer`, `drone`, `medic`, `prowler`) names them exactly, and without it
the first levels get easy kinds and later ones the special kinds. `reward` is
one of `sprint`, `knife`, `smoke`, `vest`, `grenade`, `pot` (default
rotates): the one-time power in the level's secret box, one charge or two
after a level without a mistake. The lesson card introduces each new kind of
soldier and the boss; the pause menu holds the guard guide.

## Findings object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `caption` | string | no | ≤200 chars, default "Out of 100" | Line above the bars |
| `rows` | array | yes | 1–8 Row objects | One bar each |
| `text` | string | no | ≤600 chars | Paragraph under the bars |
| `after` | boolean | no | default `false` | `true` shows the findings on the cleared page instead of the lesson, when the bars would give the answer away |

Row: `label` (string, 1–80), `value` (number, 0–100, bar length), `show`
(string, 1–12, printed next to the bar), `style` (one of `normal`, `grey`,
`dashed`; default `normal`).

## Quiz object
Used for `level.quiz`, the finale questions, and the shape of `choice` and
`confidence`.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `question` | string | yes | 1–300 chars | |
| `options` | array | yes | 2–6 Option objects, exactly one `correct` | Shown as big tappable cards |
| `okText` | string | no | ≤200 chars, default "Correct!" | Shown on the right answer |

Option: `text` (string, 1–200), `correct` (boolean, optional; `false` means
the same as omitting it), `why` (string, ≤300, optional feedback for a wrong
pick).

## Finale object
After the last level the game's own finale asks the questions: the summit at
the centre of the islands, a final sprint with a stop before each question,
or the vault, whose door has one lock per question. Each question waits in a
compact card; a right answer (then Continue) moves on. It draws `ask`
questions from the pool in a seeded random order, a fresh order on every
replay, so a large pool stays fair. The report follows the last one.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–40 chars | Shown in the HUD and the vault card |
| `lead` | string | yes | 1–400 chars | Intro paragraph |
| `ask` | integer | no | 1–50, default 5 | How many questions to draw; all are asked when the pool is smaller |
| `questions` | array | yes | 1–200 Quiz objects | The question pool |

## Report object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | yes | 1–60 chars | e.g. "Mara made it!" |
| `tiers` | object | no | `perfect`, `great`, `pass` strings ≤200 | Message for all stars / ≥80% / otherwise |
| `lessons` | string[] | yes | 1–40 items, each 1–200 chars | "What you learned" list |
| `glossaryIntro` | string | no | ≤200 chars | Line above the glossary |
| `glossaryColumns` | string[] | no | exactly 2 items, ≤30 each | Table headings, default "In this game" / "In the source" |
| `glossary` | array | no | 0–40 of `{term 1–60, meaning 1–120}` | Game word → real term |
| `source` | object | no | `label` 1–200, `url` (http or https, optional), `note` ≤300 | Citation; a link when `url` is given |

The report also shows stars, first-try answers and the game's own counts
(coins, gems, captures, times caught, rooms skipped; lives left in quiz mode),
and lists every level with its stars and its `remember` line, 50 at a time,
so very long games stay readable.

## Activities
Every activity has `type` and an optional `title` (1–60 chars; each type has
its own default). The remaining fields depend on `type`. There are 31 types
in four groups, the same in every game.

**Scored panel types** (the activity is the question; `quiz` must be
omitted; also allowed in `checks`): `choice`, `truefalse`, `multi`, `cloze`,
`order`, `match`, `sort`, `rank`, `estimate`, `number`, `text`, `odd`,
`hotspot`, `pads`, `predict`, `confidence`.

**Exploration panel types** (unscored; `quiz` is required and follows in the
same card): `compare`, `bars`, `switches`, `flashcards`, `story`, `tune`,
`race`.

**Scored in-world types** (a task played in the world where the game can,
otherwise a card; `quiz` must be omitted): `lanes`, `gates`, `torches`,
`planks`, `harvest`, `levers`, `tiles`.

**In-world exploration** (`quiz` required): `collect`.

Scoring is the same for every type: a level earns 3 stars with no mistakes,
2 with one and 1 with two or more, counted across its activity, quiz and
checks. In an in-world task, each wrong choice (a lane, gate, lamp, plate,
token, switch, pad or bin) is one mistake. A sure-and-wrong `confidence` answer counts
double; a right answer marked "I think so" or "Just guessing" counts one or
two.

| Type | Group | One line |
| :- | :- | :- |
| `choice` | scored panel | Pick the one right answer from 2–6 cards (the generic fallback) |
| `truefalse` | scored panel | Judge one statement on two big cards |
| `multi` | scored panel | Toggle every card that applies, then check |
| `cloze` | scored panel | Fill each gap of a sentence from word chips |
| `order` | scored panel | Tap the cards in sequence |
| `match` | scored panel | Pair cards from two columns |
| `sort` | scored panel | Put each item into a group |
| `rank` | scored panel | Tap the cards in rank order, then see the real numbers |
| `estimate` | scored panel | Slide to a number within a tolerance |
| `number` | scored panel | Type an exact number on a keypad |
| `text` | scored panel | Type a short answer; variants accepted |
| `odd` | scored panel | Spot the odd one out on a grid of tiles |
| `hotspot` | scored panel | Tap the right part of a diagram |
| `pads` | scored panel | Choose a pad by its columns or figure |
| `predict` | scored panel | Predict, watch it run, see if you were right |
| `confidence` | scored panel | Answer and say how sure you are |
| `compare` | exploration panel | Flip between a before and an after |
| `bars` | exploration panel | Set bars to a guess, then reveal the truth |
| `switches` | exploration panel | Toggle switches and read the status |
| `flashcards` | exploration panel | Flip through a deck |
| `story` | exploration panel | Step through a short story |
| `tune` | exploration panel | Move controls and watch a model react |
| `race` | exploration panel | Watch bars race |
| `lanes` | scored in-world | Go to the one place that names the right answer |
| `gates` | scored in-world | Go through the right gate |
| `torches` | scored in-world | Light exactly the right lamps |
| `planks` | scored in-world | Say true or false to each statement in turn |
| `harvest` | scored in-world | Pick up what belongs, leave the rest |
| `levers` | scored in-world | Step on the things in the right order |
| `tiles` | scored in-world | Put each item in the bin of its group |
| `collect` | in-world exploration | Collect every token, then see the vote |

### `choice` — pick the right card (generic fallback)
Same fields as a Quiz object (`question`, `options` 2–6 with exactly one
`correct`, optional `why` per option, optional `okText`). Use it when no
specialised type fits; prefer the specialised types.

### `truefalse` — judge one statement

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `statement` | string | yes | 1–300 |
| `answer` | boolean | yes | `true` or `false` |
| `why` | string | no | ≤300; shown after answering |
| `trueLabel` | string | no | ≤20, default "True" |
| `falseLabel` | string | no | ≤20, default "False" |

### `multi` — toggle every card that applies

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `question` | string | yes | 1–300 |
| `options` | array | yes | 3–6 of `{text 1–200, correct boolean optional, why ≤300 optional}`; at least one `correct: true` and at least one wrong |

### `cloze` — fill the gaps from word chips

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `text` | string | yes | 1–600, with one `___` (three underscores) per gap |
| `gaps` | array | yes | 1–6 of `{options string[2–5] each 1–40, answer index}`; the count must equal the number of `___` in `text` |

### `order` — tap the cards in sequence

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `items` | array | yes | 3–7 of `{text 1–120, note ≤200 optional}` listed **in the correct order**; the cards are shuffled |

### `match` — pair cards from two columns

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `pairs` | array | yes | 3–6 of `{left 1–80, right 1–80}`; every `right` unique |

### `sort` — put each item into a group

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `buckets` | array | yes | 2–4 of `{id kebab-case unique, label 1–30}` |
| `items` | array | yes | 3–10 of `{text 1–80, bucket id}`; `bucket` must be a bucket id |

### `rank` — rank the cards, then see the real numbers

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300; say which way is "first" |
| `items` | array | yes | 3–6 of `{text 1–80, value 0–100, show 1–12}` listed **in the correct rank order** (first item = top) |
| `caption` | string | no | ≤300; shown under the revealed bars |

### `estimate` — slide to a number within a tolerance

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `question` | string | yes | 1–300 |
| `min`, `max` | number | yes | `min < max`; the slider range |
| `answer` | number | yes | between `min` and `max` |
| `tolerance` | number | yes | ≥ 0; a guess within ±tolerance is right |
| `step` | number | no | > 0, default 1 |
| `unit` | string | no | ≤12, e.g. "%" or "ms" |
| `reveal` | string | no | ≤300; shown once answered |

### `number` — type an exact number

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `question` | string | yes | 1–300 |
| `answer` | number | yes | the exact answer |
| `tolerance` | number | no | ≥ 0, default 0 (exact) |
| `unit` | string | no | ≤12, shown with the answer |
| `reveal` | string | no | ≤300; shown once answered, e.g. the working |

A text field and an on-screen keypad stay in sync; a comma is read as a
decimal point.

### `text` — type a short answer

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `question` | string | yes | 1–300 |
| `answer` | string | yes | 1–80; must contain a letter or digit; the canonical answer, shown on reveal |
| `accept` | string[] | no | 0–12 items, each 1–80; synonyms and variants also accepted |
| `placeholder` | string | no | ≤40 |
| `reveal` | string | no | ≤300 |

Answers are compared case- and space-insensitively, ignoring the punctuation
`. , ; : ! ? ' " ( ) [ ]`, against `answer` and every `accept` entry.

### `odd` — spot the odd one out

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `items` | string[] | yes | 3–6 items, each 1–80 |
| `answer` | integer | yes | index into `items` |
| `why` | string | no | ≤300 |

### `hotspot` — tap the right part of a diagram
The diagram is drawn as SVG on a 100 × 60 grid from rectangles and circles,
like a floor plan; no images. Give every part a position, or none: parts
without positions are drawn as circles in a ring, which suits a list of
named parts with no layout.

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `parts` | array | yes | 3–8 Part objects |
| `answer` | string | yes | one of the part ids |
| `links` | array | no | 0–12 of `{from part id, to part id}`, drawn as dashed lines between part centres |
| `hideLabels` | boolean | no | default `false`; `true` numbers the parts instead and reveals each name when tapped |

Part: `id` (kebab-case, unique), `label` (1–24), `color` (`#rrggbb`,
optional), `hint` (≤300, shown when tapped wrongly), and, for a laid-out
diagram, `shape` (`rect` or `circle`, default `rect`), `x` (0–100), `y`
(0–60), for `rect` `w` (1–100) and `h` (1–60) with `x + w ≤ 100` and
`y + h ≤ 60`, for `circle` `r` (1–30) with the circle inside the grid (`x`,`y`
is its centre).

### `pads` — choose a pad by its columns or figure

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `options` | array | yes | 2–4 Pad objects |
| `answer` | string | yes | the `id` of the correct pad |

Pad: `id` (kebab-case, unique), `label` (1–12), `hint` (≤300), `bars`
(optional `[grey, colour]`, two numbers 0–100 drawn as a column pair), `size`
(optional number 0.5–4, draws a figure of that relative height).

### `predict` — predict, then watch

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `question` | string | yes | 1–300 |
| `options` | array | yes | 2–4 of `{text 1–200, correct boolean optional, why ≤300 optional}`; exactly one `correct` |
| `runLabel` | string | no | ≤40, default "Run it and watch" |
| `frames` | string[] | yes | 1–6 items, each 1–300; shown one by one |
| `result` | string | yes | 1–300; the conclusion |

One shot in both modes: a wrong prediction is one mistake and the result is
shown.

### `confidence` — answer and say how sure you are
Same fields as a Quiz object, plus a fixed three-level choice ("I'm sure",
"I think so", "Just guessing"). Sure and wrong counts double.

### `compare` — flip between a before and an after (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤300 |
| `before`, `after` | object | yes | `{label 1–40, text 1–400, rows 1–5 of {label 1–80, value 0–100, show 1–12}}` |
| `caption` | string | no | ≤300 |

### `bars` — set bars to a guess, then reveal (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 2–5 of `{label 1–80, value 0–100, show 1–12}` |
| `revealText` | string | no | ≤300 |
| `buttonLabel` | string | no | ≤40, default "Reveal the real numbers" |

### `switches` — toggle switches and read the status (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤300 |
| `switches` | array | yes | 1–4 of `{id ^[a-z][a-z0-9]*$ unique, label 1–60, on boolean}` |
| `readout` | array | yes | 1–6 of `{when expr optional, text 1–300, tone ok/note/no optional}`; the first whose `when` is true (or has none) is shown |
| `caption` | string | no | ≤300 |

A switch is `1` when on and `0` when off inside expressions.

### `flashcards` — flip through a deck (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤300 |
| `cards` | array | yes | 2–10 of `{front 1–120, back 1–300}` |

### `story` — step through a short story (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `buttonLabel` | string | yes | 1–40 |
| `resetLabel` | string | no | ≤40, default "Start over" |
| `frames` | string[] | yes | 2–8 items, each 1–300 |
| `caption` | string | no | ≤300 |

### `tune` — move controls and watch a model react (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `controls` | array | yes | 1–3 Control objects |
| `readout` | array | yes | 1–4 Readout objects; the first whose `when` is true (or has none) is shown |
| `visual` | object | no | `kind` one of `circle`, `grid`; `count` expr; `extra` expr; `leader` boolean (grid only) |
| `tally` | object | no | `count` expr, `icon` one emoji or 1–2 characters, `max` integer 1–60 (default 30) |
| `outcomes` | object | no | `buttonLabel` 1–40; `cases` 1–8 of `{when, text, tone}`; `fallback` `{text, tone}` |
| `caption` | string | no | ≤300 |

Control: `id` (`^[a-z][a-z0-9]*$`, unique), `label` (1–60), `min`, `max`,
`value` (integers, `min < max`, `min ≤ value ≤ max`). Readout: `when` (expr,
optional), `text` (1–300, may contain `{expr}`). Tone: one of `ok`, `note`,
`no`. The visual draws `count` squares per row and `extra` rows (`grid`, with
a gold leader square when `leader` is true) or `count` figures and `extra`
slabs (`circle`).

**Expressions** may contain numbers, control or switch ids, `+ - * / %`,
comparisons `== != < <= > >=`, `&& || !` and parentheses. Nothing else.
`{expr}` inside a readout text is replaced by its value.

### `race` — watch bars race (exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `buttonLabel` | string | yes | 1–40 |
| `bars` | array | yes | 2–4 of `{label 1–80, value 0–100, show 1–12, tag ≤12}` |
| `caption` | string | no | ≤300 |

### In-world tasks
The seven scored in-world types and `collect` are played in the world itself,
where nothing is timed: on the island (islands), on the track as a trial with
a reading stop before each step (runner), or in the room once the boss has
fallen and his guards have given up (stealth). A card at the bottom of the
screen shows the prompt, the current statement or item and, where it helps,
one button per thing. Labels in the world are short: keep them to a word or
two. A type a game does not play in its world is asked as a card with the
same fields and scoring: `islands` asks `planks` as true-or-false cards and
`harvest` as a tick-all card.

| Type | islands | runner | stealth |
| :- | :- | :- | :- |
| `lanes` | stand on a pad, then choose it | run through a lane | walk to a crate |
| `gates` | walk through a gate | run through a gate | walk through an archway |
| `torches` | light beacons, then check | run through braziers to light them | step on lamps, then check |
| `planks` | true-or-false cards | step on a true plank, jump a false one | step on the True or False plate |
| `harvest` | a tick-all card | grab tokens that belong | pick up badges that belong |
| `levers` | step on pads in order | run through levers in order | step on floor switches in order |
| `tiles` | carry orbs to bins | step on the tile of each orb's group | carry files to bins |
| `collect` | walk into every orb | run through every token | walk over every token |

### `lanes` — go to the right answer

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `options` | array | yes | 2–3 of `{id kebab-case unique, label 1–16, hint ≤300 optional}`; one labelled place each |
| `answer` | string | yes | one of the option ids |

### `gates` — go through the right gate

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `paths` | array | yes | 2–3 of `{id kebab-case unique, label 1–16, hint ≤300 optional}`; one gate each |
| `answer` | string | yes | one of the path ids |

### `torches` — light the right lamps

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 3–8 of `{id kebab-case unique, label 1–16, lit boolean}`; at least one `lit: true` and one `lit: false` |

The learner switches each one on or off, then checks against `lit`; in
`runner` each brazier counts as it is when the runner passes it.

### `planks` — true or false, statement by statement

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `planks` | array | yes | 3–8 of `{text 1–80, answer boolean, why ≤300 optional}`; at least one true and one false |

The statements come one after another and the learner answers each.

### `harvest` — pick up what belongs

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 4–10 of `{label 1–12, belongs boolean}`; at least one that belongs and one that does not |

The task ends when everything that belongs has been picked up; in learning
mode the ones still missing can be shown.

### `levers` — in the right order

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 3–7 of `{id kebab-case unique, label 1–12}` listed **in the correct order**; the switches are scattered |

### `tiles` — sort into bins

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `bins` | array | yes | 2–3 of `{id kebab-case unique, label 1–16}`; one bin each |
| `items` | array | yes | 3–8 of `{label 1–12, bin id}`; `bin` must be a bin id |

One item after another goes to the bin of its group.

### `collect` — collect every vote (in-world exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | string[] | yes | 3–9 items, each 1–3 chars; one token each. Explain what each token stands for in `lead`, `body` or `prompt` |
| `resultTitle` | string | no | ≤60, default "The vote" |
| `resultText` | string | yes | 1–200; may use `{top}`, `{count}`, `{total}` |
| `resultNote` | string | no | ≤300 |

The vote and the quiz follow in a card.

## Cross-field rules
- `levels[i].id` must be unique across levels.
- `world` takes only the keys `islands`, `runner`, `stealth`; every key of
  `world.<game>.levels` must be a level id.
- When a stealth level entry gives both `soldiers` and `squad`, `soldiers`
  must equal the number of entries in `squad`.
- If `levels[i].activity.type` is a scored type (`choice`, `truefalse`,
  `multi`, `cloze`, `order`, `match`, `sort`, `rank`, `estimate`, `number`,
  `text`, `odd`, `hotspot`, `pads`, `predict`, `confidence`, `lanes`,
  `gates`, `torches`, `planks`, `harvest`, `levers`, `tiles`),
  `levels[i].quiz` must be absent; otherwise (an exploration activity or
  no activity) `levels[i].quiz` is required.
- Every `levels[i].checks[j].type` must be a scored panel type.
- `pads.answer`, `lanes.answer`, `gates.answer` and `hotspot.answer` must
  equal one of their option, path or part ids; those ids are unique within
  the activity. Every `hotspot.links[j].from` and `.to` must be a part id.
- `sort.items[j].bucket` must be a `sort.buckets[k].id`;
  `tiles.items[j].bin` must be a `tiles.bins[k].id`. Bucket, bin, torch and
  lever ids are unique within their activity.
- `cloze.text` must contain exactly `cloze.gaps.length` occurrences of `___`;
  every `gaps[j].answer` is an index into `gaps[j].options`.
- `odd.answer` is an index into `odd.items`.
- `estimate`: `min < max` and `min ≤ answer ≤ max`.
- `hotspot`: either every part has a position or none has (decided by
  `parts[0]`); a placed `rect` part has `w` and `h` (no `r`) and fits the
  100 × 60 grid; a placed `circle` part has `r` (no `w` or `h`) and fits the
  grid; an unplaced part has none of `shape`, `x`, `y`, `w`, `h`, `r`.
- `text.answer` must contain at least one letter or digit.
- `match.pairs[j].right` values are unique.
- `multi` has at least one correct and one wrong option; `torches` at least
  one lit and one unlit item; `planks` at least one true and one false plank;
  `harvest` at least one item that belongs and one that does not;
  `predict.options` has exactly one correct option.
- Every Quiz object (level quiz, finale question, `choice`, `confidence`)
  has exactly one option with `correct: true`.
- Every expression in a `tune` activity must parse and use only that
  activity's control ids; every `switches.readout[j].when` must parse and use
  only that activity's switch ids.
- `tune.visual.leader` is only allowed when `kind` is `grid`.
- `report.glossaryColumns`, when present, has exactly two entries.

## Warnings (non-blocking)
- Fewer than 3 levels ("5–7 make a fuller game"), or more than 60 (a very
  long game; consider a lesson).
- Six or more levels using only one or two activity types.
- A level without an activity (it asks only the quiz).
- A `findings` object without `text`.
- A wrong quiz option without a `why`; a `truefalse` without a `why`; a
  false plank without a `why`.
- `collect.items` where no answer is a clear majority.
- A `sort` bucket or `tiles` bin that receives no items.
- Two neighbouring `rank` items with the same value.
- An `estimate.tolerance` that covers half the range.
- A `switches.readout` where every entry has a `when`.
- `finale.ask` larger than the question pool.

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
