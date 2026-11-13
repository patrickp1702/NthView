# Temple Run data schema — schemaVersion 1

## Overview
The data describes a temple-run learning game: the learner is a runner
fleeing through temple ruins with chasers on their heels, and the run is cut
into stretches. Each stretch is one short lesson read before running, then a
run with lanes, jumps, slides and turns, and at its end an encounter (a ghost,
a gate, a wall of fire, …) that asks the stretch's question as a panel
activity or as a trial played on the track; a final sprint and a report end
the run. Everything the learner reads and answers comes from this JSON; the
renderer supplies the world, generated and recycled lazily so any number of
stretches from 1 to 500 works.

Text fields accept one inline mark-up: `**bold**`. Nothing else is interpreted.
Character limits count JavaScript string length, so one emoji counts as 2.

## External libraries
The renderer loads **three.js r128** from cdnjs and two Google Fonts
(Atkinson Hyperlegible, Cinzel), declared in `NthView.libs` in
`assets/view.js`. The output is still one file, but it needs internet access
the first time it opens.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–60 chars | Game title: HUD, intro heading, page title |
| `subtitle` | string | no | ≤160 chars | One line under the intro heading |
| `theme` | string | no | one of `jungle`, `haunted`, `sand`, `ice`; default `jungle` | World theme: sky, light, fog, props, ambient effects and the default chaser (see World themes) |
| `strictMode` | boolean | no | default `false` | `false`: learning mode, wrong answers are explained and never block. `true`: quiz mode, wrong answers cost torches and the answer stays hidden until found (see Modes) |
| `runner` | object | yes | see Runner | The character the learner plays |
| `chaser` | object | yes | see Chaser | Who runs behind |
| `torches` | integer | no | 1–9, default 3 | Starting torches: a score in learning mode; in quiz mode each wrong answer puts one out and the last one going out counts as a capture |
| `intro` | object | yes | see Intro | The start card |
| `stretches` | array | yes | 1–500 Stretch objects | One lesson per stretch, in run order |
| `finale` | object | yes | see Finale | The final sprint after the last stretch |
| `report` | object | yes | see Report | The end screen |

## Modes
`strictMode` decides what a wrong answer does; leave it `false` unless the
user asked for a quiz, test, exam or to evaluate or grade the learner.

- **Learning mode** (`false`, the default). A wrong answer shows why it is
  wrong, reveals and highlights the right answer, and plays a reaction (the
  encounter snarls, the chasers lunge a step closer, the screen edge flashes,
  a torch flickers out). The learner taps **Continue**, or picks again first;
  options stay live. The stretch's stars drop (3 with no mistakes, 2 after
  one, 1 after two or more). Nothing is ever locked: torches are only a score,
  and a track trial with mistakes still opens the way with the corrections
  listed.
- **Quiz mode** (`true`). A wrong answer costs a torch and the right answer
  stays hidden until it is found. A track trial with a mistake costs one torch
  and sends the runner back to the start of the trial. The report shows stars,
  first-try answers, torches left and captures.

**Captures, in both modes.** Three stumbles on one stretch (or, in quiz mode,
the last torch going out) let the chasers catch the runner. The capture plays,
a "Captured" card says how many times so far, and its one button, **Resume**,
puts the runner back on the path a few metres before the spot with the
chasers pushed back (torches relit in quiz mode). The stretch, its progress
and every answer stay as they were; nothing restarts. The count is saved with
the progress and shown in the HUD and the report. Running skill never blocks
learning.

## World themes

| Theme | Look | Chaser default | Ambient | Suits |
| :- | :- | :- | :- | :- |
| `jungle` | Sunlit sandstone causeway, moss, broadleaf canopy, misty green abyss | `monkey` (skull-masked demon monkeys) | Fireflies | The default; nature, science, general topics |
| `haunted` | Night, blue mist, grey-blue stone, dead trees, moon and stars | `ghost` (lantern ghosts) | Will-o'-wisps | Risk, compliance, mysteries, history, anything with suspense |
| `sand` | Desert ruins, terracotta stone, palms, obelisks | `jackal` (jackal spirits) | Drifting sand | History, geography, economics, warm topics |
| `ice` | Frozen temple, pale blue stone, snowy pines | `yeti` | Falling snow | Health, calm topics, polar subjects, children |

## Runner object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–20 chars | Used in lessons, notices and the report, e.g. "Mara" |

## Chaser object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–40 chars | Written as a plural noun phrase, e.g. "the shadow monkeys"; shown in the HUD danger meter and notices |
| `kind` | string | no | one of `monkey`, `ghost`, `jackal`, `yeti`; default from the theme | Which creature model runs behind |

## Intro object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `paragraphs` | string[] | yes | 1–4 items, each 1–400 chars | Story set-up on the start card |
| `steps` | string[] | no | 0–5 items, each 1–300 chars | Numbered "how it works" list |
| `note` | string | no | ≤300 chars | Small print (e.g. the source) |

## Stretch object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–30 chars, unique | Stable key for progress and scores |
| `name` | string | yes | 1–40 chars | Stretch name in the HUD, lesson and report |
| `scenery` | string | no | one of `causeway`, `canopy`, `ruins`, `cliffs`, `waterfall`, `bridges`, `tunnel`, `courtyard`; default rotates in that order by position | Look of the track for this stretch (see Scenery) |
| `encounter` | string | no | one of `gate`, `ghost`, `fire`, `guardian`, `bridge`, `monkey`, `vines`, `idol`, `ropebridge`, `serpent`; default rotates in that order by position | Who or what blocks the way at the end (see Encounters) |
| `hazards` | string | no | one of `none`, `light`, `normal`, `heavy`; default `normal` | How many obstacles the run has |
| `color` | string | no | `#rrggbb` | Accent colour of this stretch's cards; defaults to the theme accent |
| `lead` | string | yes | 1–600 chars | Opening paragraph of the lesson |
| `body` | string[] | no | 0–3 items, each 1–600 chars | Further paragraphs |
| `findings` | object | no | see Findings | Bar chart of numbers |
| `activity` | object | no | see Activities | The encounter's question or exploration; omit for a quiz-only stretch |
| `quiz` | object | conditional | see Quiz | Required unless `activity.type` is a scored type; forbidden when it is |
| `checks` | array | no | 1–10 activity objects, each of a scored panel type | Extra questions the encounter asks one after another, after the activity and quiz |
| `aside` | object | no | `title` 1–60, `text` 1–600 | Extra box on the cleared page |
| `remember` | string | yes | 1–300 chars | One-line takeaway on the cleared page and in the report |

## Scenery
`scenery` only changes the look and the obstacle mix; it never changes the
lesson. Every stretch is about 90 m of running, a 10–15 second dash at the
starting speed, plus its trial; the final sprint is just as short.

| Scenery | Track | Obstacles favoured |
| :- | :- | :- |
| `causeway` | The classic raised stone path with trees, pillars and statues | A mix of all |
| `canopy` | Dense trees and hanging vines | Roots, fallen trunks, low branches |
| `ruins` | Broken pillars, statues, carved walls | Gaps, rubble, fire bars |
| `cliffs` | Rock walls and narrow ledges where only one lane is left | Gaps, rubble, ledges |
| `waterfall` | Cliffs with waterfalls into the abyss, stone bridges | Trunks, roots, gaps |
| `bridges` | Stone arch bridges and rope bridges over chasms | Gaps |
| `tunnel` | Carved walls and arches over the path | Fire bars, fire jets |
| `courtyard` | Obelisks, braziers, statues on terraces | Rubble, fire jets |

## Encounters
`encounter` is who or what blocks the way; it is independent of the activity
type. Each one enters, asks, reacts to wrong answers and clears the way.

| Encounter | Blocks the way with | Clears by |
| :- | :- | :- |
| `gate` | A portcullis that slams down | Grinding up into the lintel |
| `ghost` | A huge lantern ghost rising from the path | Bowing and fading into mist |
| `fire` | A wall of flames | Sinking to embers |
| `guardian` | A stone warrior with a crossed spear | Lowering the spear and stepping aside |
| `bridge` | A stone bridge swung away over a chasm | Turning back into place |
| `monkey` | The demon monkey king on a plinth | Leaping off into the trees |
| `vines` | A knotted wall of vines between pillars | Withering upward |
| `idol` | A giant floating golden idol | Floating away into the sky |
| `ropebridge` | A rope bridge with missing planks | The planks flying into place |
| `serpent` | A stone serpent rising from the abyss | Sinking back into the deep |

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
Used for `stretch.quiz`, the finale questions, and the shape of `choice` and
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
The final sprint: a hazard-free run in short bursts; before each question the
runner stops, the question waits in a compact card, and a right answer (then
Continue) sends the runner sprinting on to the next one. It draws `ask` questions from the pool in a seeded
random order, a fresh order on every replay, so a large pool stays fair.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–40 chars | Shown in the HUD and the sprint card |
| `lead` | string | yes | 1–400 chars | Intro paragraph |
| `ask` | integer | no | 1–50, default 5 | How many questions to draw; all are asked when the pool is smaller |
| `questions` | array | yes | 1–200 Quiz objects | The question pool |

## Report object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | yes | 1–60 chars | e.g. "Mara made it out!" |
| `tiers` | object | no | `perfect`, `great`, `pass` strings ≤200 | Message for all stars / ≥80% / otherwise |
| `lessons` | string[] | yes | 1–40 items, each 1–200 chars | "What you learned" list |
| `glossaryIntro` | string | no | ≤200 chars | Line above the glossary |
| `glossaryColumns` | string[] | no | exactly 2 items, ≤30 each | Table headings, default "In this game" / "In the source" |
| `glossary` | array | no | 0–40 of `{term 1–60, meaning 1–120}` | Game word → real term |
| `source` | object | no | `label` 1–200, `url` (http or https, optional), `note` ≤300 | Citation; a link when `url` is given |

The report also shows stars, first-try answers, coins and captures, and lists
every stretch with its stars and its `remember` line, 50 at a time, so very
long runs stay readable.

## Activities
Every activity has `type` and an optional `title` (1–60 chars; each type has
its own default). The remaining fields depend on `type`. There are 31 types
in four groups.

**Scored panel types** (the activity is the question; `quiz` must be
omitted; also allowed in `checks`): `choice`, `truefalse`, `multi`, `cloze`,
`order`, `match`, `sort`, `rank`, `estimate`, `number`, `text`, `odd`,
`hotspot`, `pads`, `predict`, `confidence`.

**Exploration panel types** (unscored; `quiz` is required and follows in the
same card): `compare`, `bars`, `switches`, `flashcards`, `story`, `tune`,
`race`.

**Scored track types** (a trial on the track, read at a standstill and then run, just before the
encounter; `quiz` must be omitted): `lanes`, `gates`, `torches`, `planks`,
`harvest`, `levers`, `tiles`.

**Track exploration** (`quiz` required): `collect`.

Scoring is the same for every type: a stretch earns 3 stars with no mistakes,
2 with one and 1 with two or more, counted across its activity, quiz and
checks. In a trial, a lane, gate, plank, token, lever or tile picked wrongly
is one mistake. A sure-and-wrong `confidence` answer counts double; a right
answer marked "I think so" or "Just guessing" counts one or two.

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
| `hotspot` | scored panel | Tap the right part of a carved diagram |
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
| `lanes` | scored track | Run through the lane whose rune names the answer |
| `gates` | scored track | Run through the right carved gate |
| `torches` | scored track | Light the right braziers by running through them |
| `planks` | scored track | Step on true statements, jump the false ones |
| `harvest` | scored track | Grab the tokens that belong, dodge the rest |
| `levers` | scored track | Pull the lane levers in the right order |
| `tiles` | scored track | Step on the tile of the group each orb belongs to |
| `collect` | track exploration | Run through every token to collect a vote |

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
like a carving; no images.

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `parts` | array | yes | 3–8 Part objects |
| `answer` | string | yes | one of the part ids |
| `links` | array | no | 0–12 of `{from part id, to part id}`, drawn as dashed lines between part centres |
| `hideLabels` | boolean | no | default `false`; `true` numbers the parts instead and reveals each name when tapped |

Part: `id` (kebab-case, unique), `label` (1–24), `shape` (`rect` or
`circle`, default `rect`), `x` (0–100), `y` (0–60), for `rect` `w` (1–100)
and `h` (1–60) with `x + w ≤ 100` and `y + h ≤ 60`, for `circle` `r` (1–30)
with the circle inside the grid (`x`,`y` is its centre), `color` (`#rrggbb`,
optional), `hint` (≤300, shown when tapped wrongly).

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

### Track trials
The seven scored track types and `collect` are played on a trial corridor
between the end of the run and the encounter, and the learner never has to
read and run at the same time. When the trial begins the runner stops at a
safe spot with the chasers holding back, and a card shows the prompt and what
stands in the left, middle and right lane (for `planks` the statement). Nothing
moves until the learner presses Enter or Space or taps **Run**; the first
choice point is then 18 m ahead, more than three seconds of running. `torches`,
`planks`, `harvest`, `levers` and `tiles` stop again before every later step
with that step's card; `lanes`, `gates` and `collect` have one card. While
running, a card at the top of the screen repeats the next row's lane labels.
Labels on the track are short: keep them to a word or two.

### `lanes` — run through the lane with the right answer

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `options` | array | yes | 2–3 of `{id kebab-case unique, label 1–16, hint ≤300 optional}`; a floating rune per lane (2 options use the outer lanes) |
| `answer` | string | yes | one of the option ids |

### `gates` — run through the right carved gate

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `paths` | array | yes | 2–3 of `{id kebab-case unique, label 1–16, hint ≤300 optional}`; one stone gateway per lane |
| `answer` | string | yes | one of the path ids |

### `torches` — light the right braziers

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 3–8 of `{id kebab-case unique, label 1–16, lit boolean}`; at least one `lit: true` and one `lit: false` |

One brazier per row stands in a lane; running through it lights it, steering
around it leaves it dark. The encounter checks them at the end.

### `planks` — step on the true, jump the false

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `planks` | array | yes | 3–8 of `{text 1–80, answer boolean, why ≤300 optional}`; at least one true and one false |

The trial is a rope bridge; each glowing plank carries a statement (also
shown large in the top card). Landing on a plank says "true"; jumping over it
says "false". A false plank cracks underfoot.

### `harvest` — grab the tokens that belong

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 4–10 of `{label 1–12, belongs boolean}`; at least one that belongs and one that does not |

Tokens float over the lanes, up to two per row.

### `levers` — pull the levers in order

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 3–7 of `{id kebab-case unique, label 1–12}` listed **in the correct order** |

Each row has the next lever plus up to two others in shuffled lanes; every
right pull moves the encounter a step (the gate rises, the bridge turns).

### `tiles` — step on the right group's tile

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `bins` | array | yes | 2–3 of `{id kebab-case unique, label 1–16}`; one floor tile per lane |
| `items` | array | yes | 3–8 of `{label 1–12, bin id}`; `bin` must be a bin id |

Each row floats one item as a glowing orb over the path; the learner steps
on the tile of its group.

### `collect` — collect every vote (track exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | string[] | yes | 3–9 items, each 1–3 chars; one token per row. Explain what each token stands for in `lead`, `body` or `prompt` |
| `resultTitle` | string | no | ≤60, default "The vote" |
| `resultText` | string | yes | 1–200; may use `{top}`, `{count}`, `{total}` |
| `resultNote` | string | no | ≤300 |

Tokens missed on the track are collected at the encounter anyway; the vote
and the quiz follow in the card.

## Cross-field rules
- `stretches[i].id` must be unique across stretches.
- If `stretches[i].activity.type` is a scored type (`choice`, `truefalse`,
  `multi`, `cloze`, `order`, `match`, `sort`, `rank`, `estimate`, `number`,
  `text`, `odd`, `hotspot`, `pads`, `predict`, `confidence`, `lanes`,
  `gates`, `torches`, `planks`, `harvest`, `levers`, `tiles`),
  `stretches[i].quiz` must be absent; otherwise (an exploration activity or
  no activity) `stretches[i].quiz` is required.
- Every `stretches[i].checks[j].type` must be a scored panel type.
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
- `hotspot`: a `rect` part has `w` and `h` (no `r`) and fits the 100 × 60
  grid; a `circle` part has `r` (no `w` or `h`) and fits the grid.
- `text.answer` must contain at least one letter or digit.
- `match.pairs[j].right` values are unique.
- `multi` has at least one correct and one wrong option; `torches` at least
  one lit and one unlit item; `planks` at least one true and one false plank;
  `harvest` at least one item that belongs and one that does not;
  `predict.options` has exactly one correct option.
- Every Quiz object (stretch quiz, finale question, `choice`, `confidence`)
  has exactly one option with `correct: true`.
- Every expression in a `tune` activity must parse and use only that
  activity's control ids; every `switches.readout[j].when` must parse and use
  only that activity's switch ids.
- `tune.visual.leader` is only allowed when `kind` is `grid`.
- `report.glossaryColumns`, when present, has exactly two entries.

## Warnings (non-blocking)
- Fewer than 3 stretches ("5–7 make a fuller run"), or more than 60 (a very
  long run; consider a lesson).
- Six or more stretches using only one or two activity types.
- A stretch without an activity (the encounter asks only the quiz).
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
