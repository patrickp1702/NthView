# Hunter data schema — schemaVersion 1

## Overview
The data describes a stealth learning game seen from above: the learner is a
hunter who slips through a building one room at a time, and each room is a
block. A block is one short lesson read before the room starts, then a room
of patrolling soldiers of eleven different kinds and one boss, whose flashlights
must be avoided, and, when the boss falls, a secret box that asks the block's question as a panel
activity or as a task played in the room; the key from the box opens the door
to the next block, and a vault and a report end the game. Everything the
learner reads and answers comes from this JSON; the renderer supplies the
rooms, generated from the block ids so any number of blocks from 1 to 500
works and a restarted room is always the same room.

Text fields accept one inline mark-up: `**bold**`. Nothing else is interpreted.
Character limits count JavaScript string length, so one emoji counts as 2.

## External libraries
The renderer loads **three.js r128** from cdnjs and one Google Font (Rubik),
declared in `NthView.libs` in `assets/view.js`. The output is still one file,
but it needs internet access the first time it opens.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–60 chars | Game title: intro heading, page title |
| `subtitle` | string | no | ≤160 chars | One line under the intro heading |
| `theme` | string | no | one of `warehouse`, `bunker`, `lab`, `rooftop`; default `warehouse` | World theme: floor, walls, crates, uniforms and the accent colour of the cards (see World themes) |
| `strictMode` | boolean | no | default `false` | `false`: learning mode, wrong answers are explained and never block. `true`: quiz mode, wrong answers cost lockpicks and the answer stays hidden until found (see Modes) |
| `hunter` | object | yes | see Hunter | The character the learner plays |
| `guards` | object | yes | see Guards | Who patrols the rooms |
| `picks` | integer | no | 1–9, default 3 | Lockpicks, used in quiz mode only: each wrong answer breaks one and the last one breaking jams the lock |
| `intro` | object | yes | see Intro | The start card |
| `blocks` | array | yes | 1–500 Block objects | One lesson and one room per block, in play order |
| `finale` | object | yes | see Finale | The vault after the last block |
| `report` | object | yes | see Report | The end screen |

## Modes
`strictMode` decides what a wrong answer does; leave it `false` unless the
user asked for a quiz, test, exam or to evaluate or grade the learner.

- **Learning mode** (`false`, the default). A wrong answer shows why it is
  wrong, reveals and highlights the right answer, and the screen edge flashes.
  The learner taps **Continue**, or picks again first; options stay live. The
  block's stars drop (3 with no mistakes, 2 after one, 1 after two or more).
  Nothing is ever locked: a room task with mistakes still gives up the key,
  with the corrections listed on the cleared page.
- **Quiz mode** (`true`). A wrong answer breaks a lockpick and the right
  answer stays hidden until it is found. When the last lockpick breaks the
  lock jams: a "Lock jammed!" card counts it and its one button, **Resume**,
  hands out a fresh set of lockpicks and continues where the learner was. The
  report shows stars, first-try answers, lockpicks left and jammed locks.

**Being seen and being caught, in both modes.** Stepping into a guard's
light does not end the attempt. The guard **notices** the hunter and his
reaction time starts (it differs by kind of soldier, from a third of a second
to a full second; his light turns orange, then red). If the hunter is still in
the light when it runs out, the guard **strikes**: a shot for those with a
gun, a charge for those with a sword. If the hunter gets out of the light
first, the guard **chases**: he runs to where he last saw the hunter, then on
in the direction the hunter was heading, and **searches** there before he
gives up and walks back to his post. A guard can only fire at a hunter who is
inside his light, so breaking the line of sight and hiding always works.
Officers, drones and bosses raise the **alarm** when they notice the hunter:
for ten seconds every guard runs to the spot, faster than usual, and reacts
sooner. Running head-on at a guard who is already chasing fails; from behind
or the side he can still be taken down.

One hit ends the attempt. A "Caught!" card counts it and **Try again**
restarts that room only, with every guard back at his post: the lesson is not
repeated, and no answer, star or earlier block is lost. Each time the hunter
is caught in a room its guards walk and react a little slower, and from the
third time the card also offers **Skip to the question**, which clears the
room and is counted in the report. Stealth skill never blocks learning, and
being caught never costs stars.

## World themes
The room always keeps its own dark palette; the lesson and question cards
follow the reader's light or dark colour scheme.

| Theme | Look | Suits |
| :- | :- | :- |
| `warehouse` | Slate floor tiles, pale concrete walls, wooden crates, guards in navy, amber cards | The default; business, logistics, general topics |
| `bunker` | Olive floor, sand-coloured walls, green ammunition boxes, guards in khaki, green cards | History, security, risk, engineering |
| `lab` | Teal floor tiles, white walls, blue containers, guards in white, teal cards | Science, health, food safety, clean processes |
| `rooftop` | Night-blue roof, brick parapets, grey roof units, guards in grey and red, violet cards | Technology, cities, finance, anything with suspense |

## Hunter object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–20 chars | Used in lessons, notices and the report, e.g. "Mara" |

## Guards object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–40 chars | Written as a plural noun phrase, e.g. "the night guards"; used in the frame story and notices |

## Intro object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `paragraphs` | string[] | yes | 1–4 items, each 1–400 chars | Story set-up on the start card |
| `steps` | string[] | no | 0–5 items, each 1–300 chars | Numbered "how it works" list |
| `note` | string | no | ≤300 chars | Small print (e.g. the source) |

## Block object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–30 chars, unique | Stable key for progress and scores; also the seed of the room's layout |
| `name` | string | yes | 1–40 chars | Block name in the HUD, lesson and report |
| `room` | string | no | one of `corridors`, `pillars`, `offices`, `yard`; default rotates in that order by position | Kind of room layout (see Rooms) |
| `boss` | string | no | one of `sentinel`, `sprinter`, `brute`, `warden`; default rotates in that order by position | The boss's extra power (see Bosses) |
| `soldiers` | integer | no | 3–5; default cycles 3, 4, 5 by position | How many soldiers patrol besides the boss |
| `squad` | string[] | no | 3–5 items, each one of `rookie`, `rifleman`, `scout`, `blade`, `sniper`, `heavy`, `shield`, `officer`, `drone`, `medic`, `prowler` | Exactly which kinds of soldier patrol (see Soldiers). Without it the game picks a squad: easy kinds in the first blocks, the special kinds later |
| `reward` | string | no | one of `sprint`, `knife`, `smoke`, `vest`, `grenade`, `pot`; default rotates in that order by position | The one-time power inside this block's secret box (see Powers) |
| `color` | string | no | `#rrggbb` | Accent colour of this block's cards; defaults to the theme accent |
| `lead` | string | yes | 1–600 chars | Opening paragraph of the lesson |
| `body` | string[] | no | 0–3 items, each 1–600 chars | Further paragraphs |
| `findings` | object | no | see Findings | Bar chart of numbers |
| `activity` | object | no | see Activities | The secret box's question or exploration; omit for a quiz-only block |
| `quiz` | object | conditional | see Quiz | Required unless `activity.type` is a scored type; forbidden when it is |
| `checks` | array | no | 1–10 activity objects, each of a scored panel type | Extra questions the box asks one after another, after the activity and quiz |
| `aside` | object | no | `title` 1–60, `text` 1–600 | Extra box on the cleared page |
| `remember` | string | yes | 1–300 chars | One-line takeaway on the cleared page and in the report |

How a block plays: the lesson card is shown over the waiting room and the
learner taps **Begin**. Tapping the floor sends the hunter there by the
shortest way; tapping a guard hunts him. Reaching a guard takes him down:
the hunter steps in and cuts twice with his sword, and nearby guards hurry
over to look, so the hunter should move on.
A guard who notices the hunter must be escaped, not fought (see Modes).
When the boss falls, any soldiers still standing give up, the boss drops the
**secret box**, and walking onto it opens the question. Answering releases the
**key**, which flies to the door; walking through the door shows the cleared
page (stars, the power from the box, the takeaway) and leads to the next
block's lesson.

## Rooms
`room` only changes the layout; it never changes the lesson. Every room is
the same size (a portrait hall 9 m wide and 19 m long), the hunter starts at
the bottom, the door is at the top, and no guard patrols the last few metres
by the entrance. The layout and every patrol route are generated from the
document title and the block `id`, so a room is identical on every visit.

| Room | Layout | Plays like |
| :- | :- | :- |
| `corridors` | Long cross-walls with gaps, short stubs and a few crates | Lanes to cross between sweeps of light |
| `pillars` | Square blocks in rows with open aisles between them | Circling round cover; some guards walk a ring round a block |
| `offices` | Partition walls with door gaps, crates as desks | Rooms to clear one at a time through narrow doors |
| `yard` | Open floor with stacks of crates and a few low walls | Longer sight lines, short dashes between stacks |

## Soldiers
Eleven kinds of soldier patrol the rooms. Each has its own uniform, headgear and
weapon so it can be told apart from above, its own light, and its own way of
reacting. The lesson card lists the squad of the room with a colour dot per
kind and explains a kind the first time it appears; the pause menu holds the
whole guard guide. `squad` names the kinds for a block; without it the first
block gets rookies and later blocks mix in the special kinds.

| Kind | Looks like | Light | Reacts in | What is special |
| :- | :- | :- | :- | :- |
| `rookie` | Pale blue shirt, white cap, pistol | Short, narrow | about 1 s | Slow to react and quick to give up the chase |
| `rifleman` | Navy uniform, steel helmet, rifle | Medium | 0.6 s | The regular guard |
| `scout` | Green, red bandana, short gun | Short, narrow | 0.55 s | Patrols and chases fast, searches twice as long |
| `blade` | Black with a red sash, hood, sword and lantern | Short, very wide, orange | 0.35 s | No gun: he charges and must reach the hunter, and he runs almost as fast |
| `sniper` | Olive, wide hat, long rifle | Very long, very thin, pale green | 0.8 s | Reaches across the room; walks and turns slowly |
| `heavy` | Grey armour with orange plates, big gun, larger | Wide | 0.5 s | Needs two hits; slow |
| `shield` | Blue riot gear behind a tall shield | Medium | 0.6 s | Cannot be taken down from the front, only from behind |
| `officer` | Black coat, gold trim, peaked cap | Medium | 0.5 s | Raises the alarm when he notices the hunter |
| `drone` | A white flying camera with four rotors | A small round light beneath it, cyan | 0.45 s | Cannot shoot, but raises the alarm and follows the hunter; can be taken down from any side |
| `medic` | White with a green cross and a pack | Medium | 0.75 s | Walks to a fallen soldier nearby and wakes him, once per soldier |
| `prowler` | Yellow with black hoops, white headband, dark glasses | Medium | 0.35 s | The toughest: patrols fast, turns round or snaps a look aside at any moment, whips about when he searches, runs almost as fast as the hunter and keeps on his trail for a moment after losing sight |

## Bosses
Every block has one boss. He is larger than the soldiers, wears gold
shoulders and a turning gold star, and takes the patrol nearest the door.
Every boss raises the alarm when he notices the hunter. The lesson card names
him and says what he does.

| Boss | Extra power | How to beat him |
| :- | :- | :- |
| `sentinel` | A flashlight twice as wide that reaches half as far again | Come from directly behind |
| `sprinter` | Patrols at double speed and turns round without warning | Strike just after he turns away |
| `brute` | Takes two hits; the first staggers him, then he sweeps his light in a full circle | Hit, get out of sight, hit again |
| `warden` | A visible shield protects him while any soldier still stands | Take down every soldier first |

## Powers
Each block's secret box also holds one one-time power for the rooms that
follow: one charge, or two when the block was answered without a mistake. At
most three of each are carried. They appear as round buttons at the bottom of
the room. A tap uses a power at once; on a keyboard **Q** and **E** switch
between the powers carried, **Space** uses the selected one, and the keys 1
to 5 use one directly. A room that is restarted gives back any power used in
the failed attempt. The last block's box holds gems instead.

| Power | Effect |
| :- | :- |
| `sprint` | Double speed for six seconds |
| `knife` | A throwing knife: it flies at the guard the hunter is facing or, if he faces none, at the nearest one in plain sight, up to 7 m away, and takes him down (one hit on a heavy or a brute; a shield held towards the hunter and a warden's shield stop it) |
| `smoke` | A smoke grenade: tap the button and then the place where it should land, or use it with Space to throw it ahead. For six seconds no guard sees into the cloud or through it |
| `vest` | Worn at once; it takes the next hit and gives the hunter a moment to get away |
| `grenade` | Flies at the same target as a knife and takes down every guard within about 2 m of the blast (one hit on a heavy or a brute; a warden's shield holds). It is loud: every other guard comes to look |
| `pot` | A disguise: the hunter stands still as a flower pot for eight seconds and every light passes over him. Moving, striking or throwing ends it |

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
Used for `block.quiz`, the finale questions, and the shape of `choice` and
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
The vault: a last, quiet room with no guards whose door has one lock per
question. The hunter walks to the door and each question waits in a compact
card; a right answer (then Continue) opens one lock. It draws `ask` questions
from the pool in a seeded random order, a fresh order on every replay, so a
large pool stays fair. When the last lock opens the hunter walks out and the
report follows.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–40 chars | Shown in the HUD and the vault card |
| `lead` | string | yes | 1–400 chars | Intro paragraph |
| `ask` | integer | no | 1–50, default 5 | How many questions to draw; all are asked when the pool is smaller |
| `questions` | array | yes | 1–200 Quiz objects | The question pool |

## Report object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | yes | 1–60 chars | e.g. "Mara has every page!" |
| `tiers` | object | no | `perfect`, `great`, `pass` strings ≤200 | Message for all stars / ≥80% / otherwise |
| `lessons` | string[] | yes | 1–40 items, each 1–200 chars | "What you learned" list |
| `glossaryIntro` | string | no | ≤200 chars | Line above the glossary |
| `glossaryColumns` | string[] | no | exactly 2 items, ≤30 each | Table headings, default "In this game" / "In the source" |
| `glossary` | array | no | 0–40 of `{term 1–60, meaning 1–120}` | Game word → real term |
| `source` | object | no | `label` 1–200, `url` (http or https, optional), `note` ≤300 | Citation; a link when `url` is given |

The report also shows stars, first-try answers, gems, how often the hunter
was caught and any rooms skipped, and lists every block with its stars and
its `remember` line, 50 at a time, so very long games stay readable.

## Activities
Every activity has `type` and an optional `title` (1–60 chars; each type has
its own default). The remaining fields depend on `type`. There are 31 types
in four groups, with the same names and fields as the Temple Run view, so
content converts without edits.

**Scored panel types** (the activity is the question; `quiz` must be
omitted; also allowed in `checks`): `choice`, `truefalse`, `multi`, `cloze`,
`order`, `match`, `sort`, `rank`, `estimate`, `number`, `text`, `odd`,
`hotspot`, `pads`, `predict`, `confidence`.

**Exploration panel types** (unscored; `quiz` is required and follows in the
same card): `compare`, `bars`, `switches`, `flashcards`, `story`, `tune`,
`race`.

**Scored room types** (a task played in the quiet room once the boss has
fallen; `quiz` must be omitted): `lanes`, `gates`, `torches`, `planks`,
`harvest`, `levers`, `tiles`.

**Room exploration** (`quiz` required): `collect`.

Scoring is the same for every type: a block earns 3 stars with no mistakes,
2 with one and 1 with two or more, counted across its activity, quiz and
checks. In a room task, a crate, archway, lamp, plate, badge, switch or bin
chosen wrongly is one mistake. A sure-and-wrong `confidence` answer counts
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
| `lanes` | scored room | Walk to the crate that names the answer |
| `gates` | scored room | Walk through the right archway |
| `torches` | scored room | Switch on exactly the right lamps |
| `planks` | scored room | Step on the True plate or the False plate for each statement |
| `harvest` | scored room | Pick up the badges that belong, leave the rest |
| `levers` | scored room | Step on the floor switches in the right order |
| `tiles` | scored room | Carry each file to the bin of its group |
| `collect` | room exploration | Walk over every token to collect a vote |

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
like a floor plan; no images.

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

### Room tasks
The seven scored room types and `collect` are played in the room itself,
after the boss has fallen and the soldiers have given up, so nothing is timed
and the learner never has to read and dodge at the same time. Taking the
secret box sets out labelled things on the floor (crates, archways, lamps,
plates, badges, switches, bins) and a card at the bottom of the screen shows
the prompt, the current statement or item, and one button per thing. The
learner taps the floor to walk onto a thing, or presses its button or its
label and the hunter walks there. Labels in the room are short: keep them to
a word or two. The type names are those of the Temple Run view's track
trials, with identical fields.

### `lanes` — walk to the crate with the right answer

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `options` | array | yes | 2–3 of `{id kebab-case unique, label 1–16, hint ≤300 optional}`; one labelled crate each |
| `answer` | string | yes | one of the option ids |

### `gates` — walk through the right archway

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `paths` | array | yes | 2–3 of `{id kebab-case unique, label 1–16, hint ≤300 optional}`; one archway each |
| `answer` | string | yes | one of the path ids |

### `torches` — switch on the right lamps

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 3–8 of `{id kebab-case unique, label 1–16, lit boolean}`; at least one `lit: true` and one `lit: false` |

Stepping on a lamp switches it on or off. **Check the lamps** in the card
compares them with `lit`.

### `planks` — step on True or False

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `planks` | array | yes | 3–8 of `{text 1–80, answer boolean, why ≤300 optional}`; at least one true and one false |

Two floor plates, True and False, stay in the room; the card shows one
statement after another and the learner steps on a plate for each.

### `harvest` — pick up the badges that belong

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 4–10 of `{label 1–12, belongs boolean}`; at least one that belongs and one that does not |

The task ends when every badge that belongs has been picked up. In learning
mode **Show me the rest** lights up the ones still missing.

### `levers` — step on the switches in order

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | array | yes | 3–7 of `{id kebab-case unique, label 1–12}` listed **in the correct order**; the switches are scattered |

### `tiles` — carry each file to its bin

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `bins` | array | yes | 2–3 of `{id kebab-case unique, label 1–16}`; one bin each |
| `items` | array | yes | 3–8 of `{label 1–12, bin id}`; `bin` must be a bin id |

The card names the file the hunter is carrying; the learner walks to the bin
of its group, one file after another.

### `collect` — collect every vote (room exploration)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `items` | string[] | yes | 3–9 items, each 1–3 chars; one token each. Explain what each token stands for in `lead`, `body` or `prompt` |
| `resultTitle` | string | no | ≤60, default "The vote" |
| `resultText` | string | yes | 1–200; may use `{top}`, `{count}`, `{total}` |
| `resultNote` | string | no | ≤300 |

**Collect the rest for me** gathers any tokens left; the vote and the quiz
follow in a card.

## Cross-field rules
- `blocks[i].id` must be unique across blocks.
- When a block gives both `soldiers` and `squad`, `soldiers` must equal the
  number of entries in `squad`.
- If `blocks[i].activity.type` is a scored type (`choice`, `truefalse`,
  `multi`, `cloze`, `order`, `match`, `sort`, `rank`, `estimate`, `number`,
  `text`, `odd`, `hotspot`, `pads`, `predict`, `confidence`, `lanes`,
  `gates`, `torches`, `planks`, `harvest`, `levers`, `tiles`),
  `blocks[i].quiz` must be absent; otherwise (an exploration activity or
  no activity) `blocks[i].quiz` is required.
- Every `blocks[i].checks[j].type` must be a scored panel type.
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
- Every Quiz object (block quiz, finale question, `choice`, `confidence`)
  has exactly one option with `correct: true`.
- Every expression in a `tune` activity must parse and use only that
  activity's control ids; every `switches.readout[j].when` must parse and use
  only that activity's switch ids.
- `tune.visual.leader` is only allowed when `kind` is `grid`.
- `report.glossaryColumns`, when present, has exactly two entries.

## Warnings (non-blocking)
- Fewer than 3 blocks ("5–7 make a fuller mission"), or more than 60 (a very
  long mission; consider a lesson).
- Six or more blocks using only one or two activity types.
- A block without an activity (the secret box asks only the quiz).
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
The complete example is Operation Canopy: 31 blocks, one per activity type,
covering every room, every boss, every power and all eleven kinds of soldier, in
the `warehouse` theme and
learning mode. It is the data embedded in `examples/example.html`; build that
file with:

    node scripts/build-html.js skills/nthview-hunter --example skills/nthview-hunter/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Operation Canopy",
  "subtitle": "Sneak through a logging depot at night and learn how a rainforest works",
  "theme": "warehouse",
  "strictMode": false,
  "hunter": {
    "name": "Mara"
  },
  "guards": {
    "name": "the night guards"
  },
  "picks": 3,
  "intro": {
    "paragraphs": [
      "Mara is a forest ranger. A logging company has locked away the field notes of a whole research station in its depot: thirty-one pages about how a rainforest works. Tonight she is taking them back.",
      "Every room of the depot holds one page, kept in a secret box by the room's boss. Slip past the flashlights, take down the guards, and answer the box's question to win the key to the next room."
    ],
    "steps": [
      "Read the short lesson, then press **Begin**. Tap the floor to move. Tap a guard to hunt him: reach him from behind, without stepping into a flashlight.",
      "When the boss falls he drops a secret box. Some boxes ask in a card. Others set a task in the room: pick the right crate, light the right lamps, step on True or False.",
      "A wrong answer shows you why. A guard who sees Mara needs a moment to strike: get out of his light and he has to chase and search. If she is caught, only that room starts again. Every box also holds a one-time power."
    ],
    "note": "Numbers are rounded for learning. The depot, Mara and the guards are made up; the rainforest facts are real."
  },
  "blocks": [
    {
      "id": "what-is-a-rainforest",
      "name": "Rain Store",
      "room": "corridors",
      "boss": "sentinel",
      "soldiers": 3,
      "squad": [
        "rookie",
        "rookie",
        "rifleman"
      ],
      "reward": "sprint",
      "lead": "A rainforest is a forest where it rains a lot all year: usually more than **2,000 mm** a year, about two metres of water. Most are also warm all year, because they sit near the equator.",
      "body": [
        "Tall trees, monkeys and parrots live in many kinds of forest. What makes a rainforest a rainforest is the water."
      ],
      "activity": {
        "type": "choice",
        "question": "What makes a forest a rainforest?",
        "options": [
          {
            "text": "Heavy rain all through the year",
            "correct": true
          },
          {
            "text": "Very tall trees",
            "why": "Redwood and pine forests have giant trees too. The rain is what counts."
          },
          {
            "text": "Monkeys living in it",
            "why": "Monkeys live in many forests and some rainforests have none. It is about rain."
          }
        ],
        "okText": "Right: lots of rain, all year round."
      },
      "remember": "A rainforest gets heavy rain all year, usually over 2,000 mm."
    },
    {
      "id": "where-they-grow",
      "name": "Equator Crates",
      "room": "pillars",
      "boss": "sprinter",
      "soldiers": 3,
      "squad": [
        "rifleman",
        "scout",
        "rookie"
      ],
      "reward": "knife",
      "lead": "Most rainforests grow in a belt around the **equator**: the Amazon in South America, the Congo in Africa, and the forests of South-East Asia. Near the equator the sun is strong all year, so the air is warm and wet and it rains almost every afternoon.",
      "activity": {
        "type": "lanes",
        "prompt": "Three crates stand in the room, each stamped with a belt of the Earth. Walk to the one where most rainforests grow.",
        "options": [
          {
            "id": "equator",
            "label": "Equator"
          },
          {
            "id": "poles",
            "label": "Near the poles",
            "hint": "It is far too cold near the poles for a rainforest."
          },
          {
            "id": "deserts",
            "label": "Desert belt",
            "hint": "The desert belts are dry. Rainforests need rain all year."
          }
        ],
        "answer": "equator"
      },
      "remember": "Most rainforests lie in a warm, wet belt around the equator."
    },
    {
      "id": "small-but-crowded",
      "name": "Crowded Corner",
      "room": "offices",
      "boss": "brute",
      "squad": [
        "blade",
        "rifleman",
        "shield",
        "rookie"
      ],
      "reward": "smoke",
      "lead": "Rainforests cover only about **6%** of Earth's land. Yet more than half of all the kinds of land plants and animals live in them. A single hectare can hold more kinds of tree than the whole of Europe.",
      "activity": {
        "type": "truefalse",
        "statement": "Rainforests cover most of Earth's land.",
        "answer": false,
        "why": "They cover only about 6% of the land, but they are packed with life."
      },
      "checks": [
        {
          "type": "choice",
          "question": "About how much of all land life lives in rainforests?",
          "options": [
            {
              "text": "About a tenth",
              "why": "Far more than that: over half of land species."
            },
            {
              "text": "More than half",
              "correct": true
            },
            {
              "text": "Almost none",
              "why": "Rainforests are the most crowded places for life on land."
            }
          ]
        }
      ],
      "remember": "Rainforests are small, about 6% of land, but hold over half of land species."
    },
    {
      "id": "four-layers",
      "name": "Layer Stacks",
      "room": "yard",
      "boss": "warden",
      "squad": [
        "sniper",
        "medic",
        "rifleman",
        "scout"
      ],
      "reward": "vest",
      "lead": "A rainforest is built in **layers**, like floors in a building. On top, a few giant trees poke out: the **emergent** layer. Below them the leaves of most trees join into a roof, the **canopy**. Under it is the shady **understory**, and at the bottom the dark **forest floor**.",
      "activity": {
        "type": "order",
        "prompt": "Put the layers in order from the top of the forest to the ground.",
        "items": [
          {
            "text": "Emergent layer",
            "note": "Lone giants, up to 60 m tall"
          },
          {
            "text": "Canopy",
            "note": "The leafy roof, 30–45 m up"
          },
          {
            "text": "Understory",
            "note": "Shady and still"
          },
          {
            "text": "Forest floor",
            "note": "Only about 2% of the sunlight gets here"
          }
        ]
      },
      "remember": "Top to bottom: emergent, canopy, understory, forest floor."
    },
    {
      "id": "sunlight",
      "name": "Sun Arches",
      "squad": [
        "heavy",
        "officer",
        "rifleman",
        "drone",
        "rookie"
      ],
      "reward": "grenade",
      "color": "#c9831f",
      "lead": "Sunlight is the forest's food. The highest leaves catch it first. By the time light has passed through the canopy, only a tiny bit is left, which is why the forest floor is so dark even at noon.",
      "activity": {
        "type": "gates",
        "prompt": "Three archways stand in the room. Walk through the one for the layer that gets the most sunlight.",
        "paths": [
          {
            "id": "emergent",
            "label": "Emergent"
          },
          {
            "id": "understory",
            "label": "Understory",
            "hint": "The understory is in the canopy's shade."
          },
          {
            "id": "floor",
            "label": "Forest floor",
            "hint": "The floor is the darkest layer of all."
          }
        ],
        "answer": "emergent"
      },
      "remember": "The higher the layer, the more sunlight it gets; the floor gets almost none."
    },
    {
      "id": "who-lives-where",
      "name": "Animal Ledge",
      "squad": [
        "prowler",
        "scout",
        "rifleman"
      ],
      "reward": "pot",
      "lead": "Each layer has its own animals. Eagles nest on the emergent giants. Sloths and monkeys spend their lives in the canopy. Big cats prowl the understory, and ants and beetles work the floor.",
      "activity": {
        "type": "match",
        "prompt": "Match each animal to the layer it calls home.",
        "pairs": [
          {
            "left": "Harpy eagle",
            "right": "Emergent layer"
          },
          {
            "left": "Three-toed sloth",
            "right": "Canopy"
          },
          {
            "left": "Jaguar",
            "right": "Understory"
          },
          {
            "left": "Leafcutter ants",
            "right": "Forest floor"
          }
        ]
      },
      "remember": "Every layer is a different home with its own animals."
    },
    {
      "id": "busiest-layer",
      "name": "Diagram Wall",
      "lead": "Scientists who climb into the canopy find it is the busiest layer of all. Fruit, flowers and insects are up there in the light, so most animals live there too: by some counts, more than half of all rainforest species.",
      "activity": {
        "type": "hotspot",
        "prompt": "This plan shows the forest's layers. Tap the layer where most of the animals live.",
        "parts": [
          {
            "id": "sun",
            "label": "Sun",
            "shape": "circle",
            "x": 88,
            "y": 9,
            "r": 7,
            "color": "#f2c14e",
            "hint": "That's the sun. Which layer gets its light and fruit?"
          },
          {
            "id": "emergent",
            "label": "Emergent",
            "x": 8,
            "y": 4,
            "w": 66,
            "h": 10,
            "hint": "Only a few giant trees reach up here."
          },
          {
            "id": "canopy",
            "label": "Canopy",
            "x": 4,
            "y": 16,
            "w": 92,
            "h": 14
          },
          {
            "id": "understory",
            "label": "Understory",
            "x": 4,
            "y": 32,
            "w": 92,
            "h": 12,
            "hint": "The understory is shady; fewer animals live here."
          },
          {
            "id": "floor",
            "label": "Forest floor",
            "x": 4,
            "y": 46,
            "w": 92,
            "h": 12,
            "hint": "The floor is dark; most life is higher up."
          }
        ],
        "links": [
          {
            "from": "sun",
            "to": "emergent"
          }
        ],
        "answer": "canopy"
      },
      "remember": "The canopy is the busiest layer: most rainforest animals live there."
    },
    {
      "id": "living-in-the-dark",
      "name": "Shade Hall",
      "lead": "Plants on the dark floor have their own tricks. Some grow **enormous leaves** to catch every scrap of light. Vines called **lianas** root in the ground and climb trees to reach the sun. Others, like orchids, skip the ground and grow on branches.",
      "activity": {
        "type": "multi",
        "question": "Which of these help a plant get light under the canopy?",
        "options": [
          {
            "text": "Growing very large leaves",
            "correct": true
          },
          {
            "text": "Climbing up a tree as a vine",
            "correct": true
          },
          {
            "text": "Growing on a high branch",
            "correct": true
          },
          {
            "text": "A thick trunk that stores water",
            "why": "That helps desert plants survive drought, not darkness."
          },
          {
            "text": "Thick fur-like hairs against the cold",
            "why": "Rainforests are warm; that helps mountain plants."
          }
        ]
      },
      "remember": "Under the canopy, plants grow big leaves, climb, or perch on branches to reach light."
    },
    {
      "id": "recyclers",
      "name": "Lamp Room",
      "lead": "Leaves, fruit and dead animals rain onto the floor all the time. **Decomposers** break them down within weeks and hand the nutrients back to the trees. Without them the forest would be buried in its own litter.",
      "activity": {
        "type": "torches",
        "prompt": "Lamps stand around the room, each with a name. Switch on the ones that name a decomposer and leave the others dark.",
        "items": [
          {
            "id": "fungi",
            "label": "Fungi",
            "lit": true
          },
          {
            "id": "toucan",
            "label": "Toucan",
            "lit": false
          },
          {
            "id": "termites",
            "label": "Termites",
            "lit": true
          },
          {
            "id": "orchid",
            "label": "Orchid",
            "lit": false
          },
          {
            "id": "worms",
            "label": "Earthworms",
            "lit": true
          }
        ]
      },
      "remember": "Decomposers like fungi, termites and worms recycle dead matter into nutrients."
    },
    {
      "id": "poor-soil",
      "name": "Thin Soil",
      "lead": "Here is a surprise: rainforest soil is **poor**. Heavy rain washes nutrients away, and decomposers work so fast that nutrients go straight back into roots. Almost all the forest's food is stored in the living plants, not in the ground.",
      "activity": {
        "type": "cloze",
        "text": "Most of a rainforest's nutrients are stored in the ___, not in the ___, because heavy rain ___ the soil.",
        "gaps": [
          {
            "options": [
              "living plants",
              "rocks"
            ],
            "answer": 0
          },
          {
            "options": [
              "leaves",
              "soil"
            ],
            "answer": 1
          },
          {
            "options": [
              "washes out",
              "fertilises"
            ],
            "answer": 0
          }
        ]
      },
      "remember": "Rainforest soil is thin and poor; the nutrients live in the plants."
    },
    {
      "id": "food-web",
      "name": "Web Court",
      "lead": "Every living thing in the forest has a job in the **food web**. **Producers** (plants) make food from sunlight. **Consumers** (animals) eat plants or each other. **Decomposers** turn whatever dies back into nutrients.",
      "activity": {
        "type": "sort",
        "prompt": "Put each living thing in its job.",
        "buckets": [
          {
            "id": "producer",
            "label": "Producer"
          },
          {
            "id": "consumer",
            "label": "Consumer"
          },
          {
            "id": "decomposer",
            "label": "Decomposer"
          }
        ],
        "items": [
          {
            "text": "Kapok tree",
            "bucket": "producer"
          },
          {
            "text": "Jaguar",
            "bucket": "consumer"
          },
          {
            "text": "Mushroom",
            "bucket": "decomposer"
          },
          {
            "text": "Fern",
            "bucket": "producer"
          },
          {
            "text": "Howler monkey",
            "bucket": "consumer"
          },
          {
            "text": "Termite",
            "bucket": "decomposer"
          }
        ]
      },
      "remember": "Producers make food, consumers eat it, decomposers recycle it."
    },
    {
      "id": "lungs-myth",
      "name": "True-False Floor",
      "lead": "People often call the Amazon \"the lungs of the world\". The forest does make a lot of oxygen by day, but its own trees, animals and decomposers breathe almost all of it back in. Most of the oxygen we breathe comes from the ocean's tiny algae. What rainforests really do for the planet is **store carbon**.",
      "activity": {
        "type": "planks",
        "prompt": "Each statement is about the forest and oxygen. Step on the True plate or the False plate.",
        "planks": [
          {
            "text": "Trees take in carbon dioxide",
            "answer": true
          },
          {
            "text": "The Amazon makes most of our oxygen",
            "answer": false,
            "why": "The forest uses almost all its own oxygen; ocean algae make most of ours."
          },
          {
            "text": "Rainforests store huge amounts of carbon",
            "answer": true
          },
          {
            "text": "Rainforest soil is very rich",
            "answer": false,
            "why": "It is poor: heavy rain washes the nutrients out."
          }
        ]
      },
      "remember": "Rainforests are carbon stores more than oxygen factories."
    },
    {
      "id": "wettest-places",
      "name": "Rain Ranks",
      "lead": "How wet is wet? A rainforest gets two to three times the rain of a forest in Europe, and twenty times as much as a desert.",
      "activity": {
        "type": "rank",
        "prompt": "Rank the places from the most rain per year to the least.",
        "items": [
          {
            "text": "Tropical rainforest",
            "value": 100,
            "show": "2,500 mm"
          },
          {
            "text": "European forest",
            "value": 36,
            "show": "900 mm"
          },
          {
            "text": "Grassland",
            "value": 20,
            "show": "500 mm"
          },
          {
            "text": "Desert",
            "value": 4,
            "show": "100 mm"
          }
        ],
        "caption": "Typical yearly rainfall, rounded."
      },
      "remember": "Rainforests get about two metres or more of rain a year, far more than other forests."
    },
    {
      "id": "how-many-species",
      "name": "Guess Gully",
      "lead": "Nobody knows exactly how many species live on Earth, and many rainforest insects have never been named. But scientists agree that a very large share of land species live in rainforests.",
      "activity": {
        "type": "estimate",
        "question": "Roughly what percentage of land plant and animal species live in rainforests?",
        "min": 0,
        "max": 100,
        "answer": 55,
        "tolerance": 12,
        "unit": "%",
        "reveal": "Estimates are about half or more: roughly 50 to 70%."
      },
      "remember": "About half or more of all land species live in rainforests."
    },
    {
      "id": "carbon-sums",
      "name": "Carbon Office",
      "lead": "A big rainforest tree takes in roughly **22 kg** of carbon dioxide a year and locks the carbon into its wood. Multiply that by billions of trees and you see why forests matter for the climate.",
      "activity": {
        "type": "number",
        "question": "If one tree takes in 22 kg of carbon dioxide a year, how many kilograms do 10 trees take in?",
        "answer": 220,
        "unit": "kg",
        "reveal": "10 × 22 kg = 220 kg a year."
      },
      "remember": "Each tree stores carbon every year, so whole forests store enormous amounts."
    },
    {
      "id": "name-the-gas",
      "name": "Word Shrine",
      "lead": "Plants take in a gas from the air, use sunlight to split it, keep the carbon to build wood and leaves, and let the oxygen go. Too much of this gas in the air traps heat and warms the planet.",
      "activity": {
        "type": "text",
        "question": "Which gas do trees take in from the air to build their wood?",
        "answer": "carbon dioxide",
        "accept": [
          "co2",
          "carbon dioxide gas",
          "co 2"
        ],
        "placeholder": "Type the gas",
        "reveal": "Carbon dioxide, CO2."
      },
      "remember": "Trees take in carbon dioxide and keep the carbon in their wood."
    },
    {
      "id": "forest-gifts",
      "name": "Market Store",
      "color": "#d98f2b",
      "lead": "You eat and use rainforest plants every week. Chocolate comes from the cacao tree, rubber from the rubber tree's sap, and bananas, vanilla and many medicines first came from tropical forests.",
      "activity": {
        "type": "harvest",
        "prompt": "Badges lie around the room. Pick up the ones that come from rainforest plants and leave the rest.",
        "items": [
          {
            "label": "Chocolate",
            "belongs": true
          },
          {
            "label": "Wool",
            "belongs": false
          },
          {
            "label": "Rubber",
            "belongs": true
          },
          {
            "label": "Sea salt",
            "belongs": false
          },
          {
            "label": "Vanilla",
            "belongs": true
          },
          {
            "label": "Granite",
            "belongs": false
          }
        ]
      },
      "remember": "Chocolate, rubber, vanilla and many medicines come from rainforest plants."
    },
    {
      "id": "not-from-here",
      "name": "Odd Idols",
      "lead": "Rainforest animals are built for heat, rain and climbing: thin fur or none, long tails and grippy feet. An animal made for cold and ice would not last a week here.",
      "activity": {
        "type": "odd",
        "prompt": "Which animal does not belong in a rainforest?",
        "items": [
          "Sloth",
          "Toucan",
          "Jaguar",
          "Polar bear"
        ],
        "answer": 3,
        "why": "Polar bears are built for Arctic ice; the others are rainforest animals."
      },
      "remember": "Rainforest animals are adapted to heat, rain and life in the trees."
    },
    {
      "id": "making-rain",
      "name": "Switch Floor",
      "lead": "A rainforest helps make its own rain. Roots drink water from the soil, leaves breathe it out as vapour (**transpiration**), the vapour rises and forms clouds, and the clouds rain on the forest again. Up to half of the Amazon's rain is recycled this way.",
      "activity": {
        "type": "levers",
        "prompt": "Floor switches are scattered around the room. Step on them in the order of the forest's water cycle, starting with the rain.",
        "items": [
          {
            "id": "rain",
            "label": "Rain falls"
          },
          {
            "id": "roots",
            "label": "Roots drink"
          },
          {
            "id": "leaves",
            "label": "Leaves sweat"
          },
          {
            "id": "clouds",
            "label": "Clouds form"
          }
        ]
      },
      "remember": "Rain, roots, leaves, clouds, rain: the forest recycles its own water."
    },
    {
      "id": "high-and-low",
      "name": "Filing Room",
      "lead": "Some living things never touch the ground; others never leave it. Orchids and bromeliads grow on branches high up. Tapirs and fungi live their lives down on the floor.",
      "activity": {
        "type": "tiles",
        "prompt": "Each file names a living thing. Carry it to the bin of the layer where it lives.",
        "bins": [
          {
            "id": "canopy",
            "label": "Canopy"
          },
          {
            "id": "floor",
            "label": "Forest floor"
          }
        ],
        "items": [
          {
            "label": "Sloth",
            "bin": "canopy"
          },
          {
            "label": "Tapir",
            "bin": "floor"
          },
          {
            "label": "Orchid",
            "bin": "canopy"
          },
          {
            "label": "Fungi",
            "bin": "floor"
          }
        ]
      },
      "remember": "Some species live their whole life in the canopy, others on the floor."
    },
    {
      "id": "why-forests-vanish",
      "name": "Clearing",
      "lead": "Rainforests are being cut down for land. In the Amazon the biggest cause by far is **cattle ranching**: forest is cleared and turned into pasture. Farming crops like soy, logging and mining clear much less.",
      "activity": {
        "type": "pads",
        "prompt": "The bigger the figure, the more forest that cause clears. Pick the biggest cause of clearing in the Amazon.",
        "options": [
          {
            "id": "cattle",
            "label": "Cattle",
            "size": 3.4
          },
          {
            "id": "soy",
            "label": "Soy fields",
            "size": 1.4,
            "hint": "Soy clears some forest, but much less than pasture for cattle."
          },
          {
            "id": "logging",
            "label": "Logging",
            "size": 1.1,
            "hint": "Logging damages forest, but cattle pasture clears far more."
          },
          {
            "id": "mining",
            "label": "Mining",
            "size": 0.7,
            "hint": "Mines are destructive locally, but small in area."
          }
        ],
        "answer": "cattle"
      },
      "remember": "In the Amazon, most forest is cleared to make pasture for cattle."
    },
    {
      "id": "less-rain",
      "name": "Dry Spell",
      "lead": "Remember that the forest makes much of its own rain. So what happens to the rain when a big part of the forest is cut down?",
      "activity": {
        "type": "predict",
        "question": "A huge area of forest is cleared for pasture. What happens to the rain nearby?",
        "options": [
          {
            "text": "Less rain falls",
            "correct": true
          },
          {
            "text": "More rain falls",
            "why": "Without leaves breathing out water, fewer clouds form."
          },
          {
            "text": "Nothing changes",
            "why": "The forest was helping to make that rain."
          }
        ],
        "frames": [
          "The trees are gone, so no roots drink and no leaves breathe out vapour.",
          "Fewer clouds form over the cleared land.",
          "The dry season gets longer and the remaining forest suffers."
        ],
        "result": "Less rain falls: clearing forest dries out the region."
      },
      "remember": "Cutting a rainforest can reduce the rain that the rest of the forest needs."
    },
    {
      "id": "soil-surprise",
      "name": "Sure Thing",
      "lead": "Farmers who clear rainforest often find that crops grow well for two or three years and then fail. Now you know why.",
      "activity": {
        "type": "confidence",
        "question": "Why do crops on cleared rainforest land often fail after a few years?",
        "options": [
          {
            "text": "The soil was poor; the nutrients were in the trees",
            "correct": true
          },
          {
            "text": "It gets too cold once the trees are gone",
            "why": "The land stays warm. The problem is the thin soil."
          },
          {
            "text": "The monkeys eat the crops",
            "why": "Pests happen, but the main problem is poor soil."
          }
        ],
        "okText": "Right: once the trees are burned and the rain washes the ash away, the soil has little left."
      },
      "remember": "Cleared rainforest soil runs out of nutrients within a few years."
    },
    {
      "id": "before-and-after",
      "name": "Two Valleys",
      "lead": "Compare a valley of standing forest with the same valley after it has been cleared for pasture.",
      "activity": {
        "type": "compare",
        "prompt": "Flip between the two valleys.",
        "before": {
          "label": "Forest",
          "text": "Tall trees, many layers, wet air.",
          "rows": [
            {
              "label": "Kinds of tree in a hectare",
              "value": 100,
              "show": "~250"
            },
            {
              "label": "Rain recycled locally",
              "value": 50,
              "show": "~50%"
            }
          ]
        },
        "after": {
          "label": "Pasture",
          "text": "Grass, cattle and hot, dry ground.",
          "rows": [
            {
              "label": "Kinds of tree in a hectare",
              "value": 2,
              "show": "~5"
            },
            {
              "label": "Rain recycled locally",
              "value": 10,
              "show": "~10%"
            }
          ]
        },
        "caption": "Rounded, illustrative numbers."
      },
      "quiz": {
        "question": "What changes most when the forest becomes pasture?",
        "options": [
          {
            "text": "The number of kinds of tree drops sharply",
            "correct": true
          },
          {
            "text": "The valley gets more rain",
            "why": "Less rain is recycled once the trees are gone."
          }
        ]
      },
      "remember": "Clearing a forest wipes out most of its variety of life and its rain-making."
    },
    {
      "id": "guess-the-split",
      "name": "Split Stones",
      "lead": "Before you see the real numbers, guess them. How is the cleared land in the Amazon used?",
      "activity": {
        "type": "bars",
        "prompt": "Slide each bar to your guess of how much cleared land goes to each use, then reveal the real split.",
        "items": [
          {
            "label": "Cattle pasture",
            "value": 70,
            "show": "~70%"
          },
          {
            "label": "Crops such as soy",
            "value": 15,
            "show": "~15%"
          },
          {
            "label": "Everything else",
            "value": 15,
            "show": "~15%"
          }
        ],
        "revealText": "Pasture dwarfs everything else."
      },
      "quiz": {
        "question": "Roughly how much of the cleared Amazon land is cattle pasture?",
        "options": [
          {
            "text": "About a tenth",
            "why": "Look at the revealed bars: pasture is the big one."
          },
          {
            "text": "About seven tenths",
            "correct": true
          }
        ]
      },
      "remember": "About seven tenths of cleared Amazon land becomes cattle pasture."
    },
    {
      "id": "what-keeps-it-alive",
      "name": "Switch Room",
      "lead": "A rainforest stays healthy when its parts keep working together: rain to drink, decomposers to recycle, and pollinators to carry pollen so new seeds grow.",
      "activity": {
        "type": "switches",
        "prompt": "Turn the parts of the forest on and off and read its health.",
        "switches": [
          {
            "id": "rain",
            "label": "Rain all year",
            "on": true
          },
          {
            "id": "decomposers",
            "label": "Decomposers",
            "on": true
          },
          {
            "id": "pollinators",
            "label": "Pollinators",
            "on": true
          }
        ],
        "readout": [
          {
            "when": "!rain",
            "text": "Without rain the forest dries out and fires spread.",
            "tone": "no"
          },
          {
            "when": "!decomposers",
            "text": "Litter piles up and the trees starve for nutrients.",
            "tone": "no"
          },
          {
            "when": "!pollinators",
            "text": "Old trees live on, but few new seeds grow.",
            "tone": "note"
          },
          {
            "text": "Healthy: everything is working together.",
            "tone": "ok"
          }
        ]
      },
      "quiz": {
        "question": "What happens without pollinators?",
        "options": [
          {
            "text": "Fewer new seeds grow",
            "correct": true
          },
          {
            "text": "The forest floods",
            "why": "Pollinators carry pollen; they do not control water."
          }
        ]
      },
      "remember": "Rain, decomposers and pollinators all have to keep working for a healthy forest."
    },
    {
      "id": "jungle-words",
      "name": "Word Cards",
      "lead": "A short rest before the last rooms. Flip through the words explorers use for the forest.",
      "activity": {
        "type": "flashcards",
        "cards": [
          {
            "front": "Canopy",
            "back": "The leafy roof formed by most trees' crowns."
          },
          {
            "front": "Epiphyte",
            "back": "A plant that grows on another plant, like an orchid on a branch."
          },
          {
            "front": "Liana",
            "back": "A woody vine that roots in the ground and climbs to the light."
          },
          {
            "front": "Transpiration",
            "back": "Leaves breathing out water vapour."
          }
        ]
      },
      "quiz": {
        "question": "An orchid growing on a high branch is called…",
        "options": [
          {
            "text": "An epiphyte",
            "correct": true
          },
          {
            "text": "A liana",
            "why": "A liana roots in the ground and climbs; an epiphyte grows on the branch itself."
          }
        ]
      },
      "remember": "Canopy, epiphyte, liana, transpiration: the explorer's words for the forest."
    },
    {
      "id": "strangler-fig",
      "name": "Fig Tale",
      "lead": "Some rainforest plants compete fiercely for light. The strangler fig has a sneaky way to the top.",
      "activity": {
        "type": "story",
        "buttonLabel": "What happens next?",
        "frames": [
          "A bird eats a fig and drops a seed high on a branch of a big tree.",
          "The seed sprouts up there, in the light, and sends long roots down to the ground.",
          "The roots thicken and wrap around the host tree's trunk.",
          "Years later the host tree dies inside the cage of roots, and the fig stands on its own."
        ],
        "caption": "Strangler figs are real, and many animals depend on their fruit."
      },
      "quiz": {
        "question": "Why does the strangler fig start life high on a branch?",
        "options": [
          {
            "text": "To reach the light without growing up from the dark floor",
            "correct": true
          },
          {
            "text": "To hide from the rain",
            "why": "Rain is everywhere; light is what is scarce below the canopy."
          }
        ]
      },
      "remember": "The strangler fig starts at the top to reach the light, then roots its way down."
    },
    {
      "id": "plant-a-forest",
      "name": "Seed Field",
      "lead": "Can planting trees undo the damage? Young trees take in carbon too, but slowly, and a planted forest takes many decades to grow back its full variety of life.",
      "activity": {
        "type": "tune",
        "controls": [
          {
            "id": "t",
            "label": "Trees planted (hundreds)",
            "min": 1,
            "max": 6,
            "value": 2
          },
          {
            "id": "y",
            "label": "Years of growth",
            "min": 1,
            "max": 5,
            "value": 1
          }
        ],
        "readout": [
          {
            "text": "Roughly {t*100*y*10} kg of carbon dioxide taken in over {y} year(s)."
          }
        ],
        "visual": {
          "kind": "grid",
          "count": "t",
          "extra": "y"
        },
        "caption": "Young trees take in about a tenth of what a grown tree does; the numbers are illustrative."
      },
      "quiz": {
        "question": "What makes a planted forest take in more carbon?",
        "options": [
          {
            "text": "More trees and more years of growth",
            "correct": true
          },
          {
            "text": "Fewer trees, planted closer",
            "why": "More trees, given time, store more carbon."
          }
        ]
      },
      "remember": "Planting helps, but young forests store carbon slowly and take decades to recover."
    },
    {
      "id": "fast-and-slow",
      "name": "Race Clock",
      "lead": "Cutting is quick. Recovery is slow. A machine can clear a hectare in a day; the forest needs a lifetime to grow back.",
      "activity": {
        "type": "race",
        "buttonLabel": "Start the race",
        "bars": [
          {
            "label": "Clearing a hectare",
            "value": 2,
            "show": "1 day",
            "tag": "cut"
          },
          {
            "label": "Forest growing back",
            "value": 100,
            "show": "100+ years",
            "tag": "regrow"
          }
        ]
      },
      "quiz": {
        "question": "How long does a cleared rainforest take to grow back fully?",
        "options": [
          {
            "text": "About a year",
            "why": "Press the race button: regrowth takes a century or more."
          },
          {
            "text": "A century or more",
            "correct": true
          }
        ]
      },
      "remember": "A forest cut in a day can take over a hundred years to grow back."
    },
    {
      "id": "what-to-protect",
      "name": "Vote Hall",
      "lead": "Mara asked seven villagers living at the forest edge what protects the forest best. Their votes lie around the room as glowing tokens: **P** protected parks run with local people, **T** more tourism, **F** fences.",
      "activity": {
        "type": "collect",
        "prompt": "Walk over all seven glowing tokens to collect the votes.",
        "items": [
          "P",
          "T",
          "P",
          "F",
          "P",
          "P",
          "T"
        ],
        "resultTitle": "The vote",
        "resultText": "Most votes: {top} ({count} of {total})",
        "resultNote": "Studies agree with the villagers: forests last longest where local and Indigenous people help run them."
      },
      "quiz": {
        "question": "Which kind of protection keeps forests standing best?",
        "options": [
          {
            "text": "Parks run together with local people",
            "correct": true
          },
          {
            "text": "Fences around the forest",
            "why": "Fences do little; people who live there and care for it protect it best."
          }
        ]
      },
      "remember": "Forests last longest where local and Indigenous people help protect them."
    }
  ],
  "finale": {
    "name": "The vault",
    "lead": "The last door is the depot's vault, where the research station's map is kept. Each lock asks one more question about the forest.",
    "ask": 4,
    "questions": [
      {
        "question": "What makes a forest a rainforest?",
        "options": [
          {
            "text": "Heavy rain all year",
            "correct": true
          },
          {
            "text": "Tall trees",
            "why": "Many forests have tall trees; rainforests have heavy rain."
          }
        ]
      },
      {
        "question": "Which layer is busiest with animals?",
        "options": [
          {
            "text": "The canopy",
            "correct": true
          },
          {
            "text": "The forest floor",
            "why": "The floor is dark; most life is up in the canopy."
          },
          {
            "text": "The emergent layer",
            "why": "Only a few giant trees reach that high."
          }
        ]
      },
      {
        "question": "Where are most of a rainforest's nutrients?",
        "options": [
          {
            "text": "In the living plants",
            "correct": true
          },
          {
            "text": "In the soil",
            "why": "The soil is thin and poor."
          }
        ]
      },
      {
        "question": "What clears the most Amazon forest?",
        "options": [
          {
            "text": "Cattle pasture",
            "correct": true
          },
          {
            "text": "Logging",
            "why": "Logging damages forest, but pasture clears far more."
          }
        ]
      },
      {
        "question": "What happens to rain when a lot of forest is cut?",
        "options": [
          {
            "text": "There is less rain",
            "correct": true
          },
          {
            "text": "There is more rain",
            "why": "The forest helped make the rain through its leaves."
          }
        ]
      },
      {
        "question": "What do rainforests mostly do for the climate?",
        "options": [
          {
            "text": "Store carbon",
            "correct": true
          },
          {
            "text": "Make most of our oxygen",
            "why": "Ocean algae make most of it; forests store carbon."
          }
        ]
      }
    ]
  },
  "report": {
    "heading": "Mara has every page!",
    "tiers": {
      "perfect": "Every box opened first time. The guards will be telling stories about you.",
      "great": "A fine night's work. The research station owes you one.",
      "pass": "You got every page out of the depot! Play it again to earn more stars."
    },
    "lessons": [
      "A rainforest has heavy rain all year and lies mostly near the equator.",
      "It covers 6% of land but holds over half of land species.",
      "It is built in layers; the canopy is the busiest.",
      "Decomposers recycle nutrients fast, so the soil itself is poor.",
      "Rainforests store carbon and make much of their own rain.",
      "Most clearing in the Amazon is for cattle pasture, and recovery takes a century."
    ],
    "glossaryIntro": "Words to know when you read more about rainforests:",
    "glossaryColumns": [
      "Word",
      "Meaning"
    ],
    "glossary": [
      {
        "term": "Emergent layer",
        "meaning": "The few giant trees that rise above the canopy"
      },
      {
        "term": "Canopy",
        "meaning": "The leafy roof formed by most tree crowns"
      },
      {
        "term": "Decomposer",
        "meaning": "A living thing that breaks down dead matter"
      },
      {
        "term": "Transpiration",
        "meaning": "Plants releasing water vapour through their leaves"
      },
      {
        "term": "Deforestation",
        "meaning": "Clearing forest for other uses"
      }
    ],
    "source": {
      "label": "General teaching material about tropical rainforests",
      "note": "Figures are rounded from widely published estimates and are meant to build intuition, not for citation."
    }
  }
}
```
