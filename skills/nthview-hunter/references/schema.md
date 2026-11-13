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
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
