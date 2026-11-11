# Hunter — choosing and writing activities

This guide helps pick one of the 31 activity types for each block and gives
a minimal JSON snippet for each. The field tables and limits live in
`schema.md`; this file is about *which* type fits *which* question. The
complete showcase, one block per type, is the example in `schema.md`
(built as `examples/example.html`).

Every type works in both modes. In learning mode (`strictMode` false, the
default) a wrong answer is explained, the right answer is shown, and the
learner continues; in quiz mode (`strictMode` true) it breaks a lockpick and
the answer stays hidden until found (see Modes in `schema.md`).

The secret box asks either in a card (panel types) or as a task in the room
(room types). Room tasks are played after the boss has fallen, in a quiet
room, so they are never timed.

## Pick by the shape of the question

| The question is… | Use | Played |
| :- | :- | :- |
| Any question with one right answer and no better fit | `choice` | panel |
| One statement to judge | `truefalse` | panel |
| Several statements to judge, one after another | `planks` | room |
| Several members of a category among impostors | `multi` (panel) or `harvest` (room) | |
| A key sentence to complete | `cloze` | panel |
| A sequence, timeline or process | `order` (panel) or `levers` (room) | |
| Terms and their meanings, parts and jobs | `match` | panel |
| Items that fall into 2–4 groups | `sort` (panel) or `tiles` (room, 2–3 groups) | |
| Items that differ along one measurable axis | `rank` | panel |
| A number worth having a feel for | `estimate` | panel |
| An exact number the learner can work out | `number` | panel |
| A word or name the learner should recall unprompted | `text` | panel |
| One item that breaks a pattern | `odd` | panel |
| A labelled system or a diagram with parts | `hotspot` | panel |
| Two to four options compared by size or by two numbers | `pads` | panel |
| Two or three answers to choose between, then a walk to the right one | `lanes` (crates) or `gates` (archways) | room |
| A set where some members qualify and others do not | `torches` | room |
| A cause and effect worth predicting first | `predict` | panel |
| A fact learners are often confidently wrong about | `confidence` | panel |
| "Many samples, the majority wins" | `collect` | room, needs a quiz |
| A then-versus-now or with-versus-without contrast | `compare` | panel, needs a quiz |
| A split or distribution the learner probably misjudges | `bars` | panel, needs a quiz |
| A system whose state depends on a few on/off conditions | `switches` | panel, needs a quiz |
| Vocabulary to review | `flashcards` | panel, needs a quiz |
| A process that unfolds, especially one with a twist | `story` | panel, needs a quiz |
| A trade-off with one to three knobs | `tune` | panel, needs a quiz |
| Two to four durations, costs or speeds | `race` | panel, needs a quiz |

Rules of thumb:
- Prefer a specialised type over `choice`; `choice` is the fallback that can
  always express a question.
- Vary the types: a good mission changes rhythm every block or two, with a
  room task roughly every third block. Six or more blocks with only one or
  two types trigger a validator warning.
- Room tasks put labelled things on the floor, and the card at the bottom
  repeats every label as a button. Keep labels to one or two words
  (≤16 characters, ≤12 for badges, switches and files) so they read on the
  floor, and put the explanation in `lead`, `body` or `prompt`.
- A lesson that deserves more than one check gets `checks`: up to ten extra
  scored panel questions the secret box asks after the main one.
- Exploration types (`compare`, `bars`, `switches`, `flashcards`, `story`,
  `tune`, `race`, `collect`) need a `quiz` that tests what the exploration
  showed, not trivia about it.

## Snippets

Each snippet is the `activity` object only. Replace the text; keep the shape.

### choice
```json
{ "type": "choice", "question": "What makes a forest a rainforest?",
  "options": [ { "text": "Heavy rain all year", "correct": true },
               { "text": "Very tall trees", "why": "Many forests have tall trees." } ] }
```

### truefalse
```json
{ "type": "truefalse", "statement": "Rainforests cover most of Earth's land.", "answer": false,
  "why": "They cover about 6% of the land." }
```

### multi
```json
{ "type": "multi", "question": "Which help a plant get light under the canopy?",
  "options": [ { "text": "Very large leaves", "correct": true }, { "text": "Climbing as a vine", "correct": true },
               { "text": "A trunk that stores water", "why": "That helps desert plants." } ] }
```

### cloze
```json
{ "type": "cloze", "text": "Nutrients are stored in the ___, not in the ___.",
  "gaps": [ { "options": ["plants", "rocks"], "answer": 0 }, { "options": ["leaves", "soil"], "answer": 1 } ] }
```

### order
```json
{ "type": "order", "prompt": "Top of the forest to the ground.",
  "items": [ { "text": "Emergent layer" }, { "text": "Canopy" }, { "text": "Understory" }, { "text": "Forest floor", "note": "2% of the light" } ] }
```

### match
```json
{ "type": "match", "prompt": "Match each animal to its layer.",
  "pairs": [ { "left": "Harpy eagle", "right": "Emergent" }, { "left": "Sloth", "right": "Canopy" }, { "left": "Jaguar", "right": "Understory" } ] }
```

### sort
```json
{ "type": "sort", "prompt": "Put each living thing in its job.",
  "buckets": [ { "id": "producer", "label": "Producer" }, { "id": "consumer", "label": "Consumer" } ],
  "items": [ { "text": "Fern", "bucket": "producer" }, { "text": "Jaguar", "bucket": "consumer" }, { "text": "Kapok tree", "bucket": "producer" } ] }
```

### rank
```json
{ "type": "rank", "prompt": "Most rain per year first.",
  "items": [ { "text": "Rainforest", "value": 100, "show": "2,500 mm" }, { "text": "Grassland", "value": 20, "show": "500 mm" },
             { "text": "Desert", "value": 4, "show": "100 mm" } ] }
```

### estimate
```json
{ "type": "estimate", "question": "What % of land species live in rainforests?", "min": 0, "max": 100,
  "answer": 55, "tolerance": 12, "unit": "%", "reveal": "About half or more." }
```

### number
```json
{ "type": "number", "question": "One tree takes in 22 kg a year. How many kg do 10 trees take in?",
  "answer": 220, "unit": "kg", "reveal": "10 × 22 = 220." }
```

### text
```json
{ "type": "text", "question": "Which gas do trees take in to build wood?", "answer": "carbon dioxide",
  "accept": ["co2", "carbon dioxide gas"], "reveal": "Carbon dioxide, CO2." }
```

### odd
```json
{ "type": "odd", "prompt": "Which animal does not belong?", "items": ["Sloth", "Toucan", "Polar bear"], "answer": 2,
  "why": "Polar bears are built for ice." }
```

### hotspot
```json
{ "type": "hotspot", "prompt": "Tap the layer where most animals live.",
  "parts": [ { "id": "emergent", "label": "Emergent", "x": 8, "y": 4, "w": 66, "h": 10 },
             { "id": "canopy", "label": "Canopy", "x": 4, "y": 16, "w": 92, "h": 14 },
             { "id": "floor", "label": "Forest floor", "x": 4, "y": 46, "w": 92, "h": 12, "hint": "It is dark down here." },
             { "id": "sun", "label": "Sun", "shape": "circle", "x": 88, "y": 9, "r": 7, "color": "#f2c14e" } ],
  "links": [ { "from": "sun", "to": "emergent" } ], "answer": "canopy" }
```

### pads
```json
{ "type": "pads", "prompt": "Pick the biggest cause of clearing.",
  "options": [ { "id": "cattle", "label": "Cattle", "size": 3.4 }, { "id": "soy", "label": "Soy", "size": 1.4, "hint": "Much less than cattle." } ],
  "answer": "cattle" }
```

### predict
```json
{ "type": "predict", "question": "A huge area is cleared. What happens to the rain?",
  "options": [ { "text": "Less rain", "correct": true }, { "text": "More rain", "why": "Fewer leaves, fewer clouds." } ],
  "frames": ["No leaves breathe out vapour.", "Fewer clouds form."], "result": "Less rain falls." }
```

### confidence
```json
{ "type": "confidence", "question": "Is rainforest soil rich or poor?",
  "options": [ { "text": "Poor", "correct": true }, { "text": "Rich", "why": "Rain washes the nutrients out." } ] }
```

### compare (needs a quiz)
```json
{ "type": "compare",
  "before": { "label": "Forest", "text": "Many layers.", "rows": [ { "label": "Tree kinds per hectare", "value": 100, "show": "~250" } ] },
  "after": { "label": "Pasture", "text": "Grass and cattle.", "rows": [ { "label": "Tree kinds per hectare", "value": 2, "show": "~5" } ] } }
```

### bars (needs a quiz)
```json
{ "type": "bars", "prompt": "Guess the split, then reveal it.",
  "items": [ { "label": "Pasture", "value": 70, "show": "70%" }, { "label": "Crops", "value": 15, "show": "15%" }, { "label": "Other", "value": 15, "show": "15%" } ] }
```

### switches (needs a quiz)
```json
{ "type": "switches",
  "switches": [ { "id": "rain", "label": "Rain all year", "on": true }, { "id": "fungi", "label": "Decomposers", "on": true } ],
  "readout": [ { "when": "!rain", "text": "The forest dries out.", "tone": "no" }, { "text": "Healthy.", "tone": "ok" } ] }
```

### flashcards (needs a quiz)
```json
{ "type": "flashcards", "cards": [ { "front": "Canopy", "back": "The leafy roof." }, { "front": "Liana", "back": "A climbing woody vine." } ] }
```

### story (needs a quiz)
```json
{ "type": "story", "buttonLabel": "What happens next?", "frames": ["A seed lands on a branch.", "Roots grow down.", "The host tree dies."] }
```

### tune (needs a quiz)
```json
{ "type": "tune", "controls": [ { "id": "t", "label": "Trees (hundreds)", "min": 1, "max": 6, "value": 2 } ],
  "readout": [ { "text": "About {t*100*10} kg a year." } ], "visual": { "kind": "grid", "count": "t", "extra": "1" } }
```

### race (needs a quiz)
```json
{ "type": "race", "buttonLabel": "Start the race",
  "bars": [ { "label": "Clearing", "value": 2, "show": "1 day" }, { "label": "Regrowing", "value": 100, "show": "100+ years" } ] }
```

### lanes (room)
```json
{ "type": "lanes", "prompt": "Walk to the crate of the belt where rainforests grow.",
  "options": [ { "id": "equator", "label": "Equator" }, { "id": "poles", "label": "Poles", "hint": "Far too cold." } ],
  "answer": "equator" }
```

### gates (room)
```json
{ "type": "gates", "prompt": "Walk through the archway of the sunniest layer.",
  "paths": [ { "id": "emergent", "label": "Emergent" }, { "id": "floor", "label": "Forest floor", "hint": "The darkest layer." } ],
  "answer": "emergent" }
```

### torches (room)
```json
{ "type": "torches", "prompt": "Switch on the lamps of the decomposers.",
  "items": [ { "id": "fungi", "label": "Fungi", "lit": true }, { "id": "toucan", "label": "Toucan", "lit": false },
             { "id": "worms", "label": "Earthworms", "lit": true } ] }
```

### planks (room)
```json
{ "type": "planks", "prompt": "Step on True or False for each statement.",
  "planks": [ { "text": "Trees take in carbon dioxide", "answer": true },
              { "text": "The Amazon makes most of our oxygen", "answer": false, "why": "Ocean algae make most of it." },
              { "text": "Rainforest soil is rich", "answer": false, "why": "It is poor." } ] }
```

### harvest (room)
```json
{ "type": "harvest", "prompt": "Grab what comes from rainforest plants.",
  "items": [ { "label": "Chocolate", "belongs": true }, { "label": "Wool", "belongs": false },
             { "label": "Rubber", "belongs": true }, { "label": "Granite", "belongs": false } ] }
```

### levers (room)
```json
{ "type": "levers", "prompt": "Step on the switches in water-cycle order, starting with the rain.",
  "items": [ { "id": "rain", "label": "Rain falls" }, { "id": "roots", "label": "Roots drink" }, { "id": "clouds", "label": "Clouds form" } ] }
```

### tiles (room)
```json
{ "type": "tiles", "prompt": "Carry each one to the bin of the layer where it lives.",
  "bins": [ { "id": "canopy", "label": "Canopy" }, { "id": "floor", "label": "Floor" } ],
  "items": [ { "label": "Sloth", "bin": "canopy" }, { "label": "Tapir", "bin": "floor" }, { "label": "Orchid", "bin": "canopy" } ] }
```

### collect (room, needs a quiz)
```json
{ "type": "collect", "prompt": "Walk over all seven votes.", "items": ["P", "T", "P", "F", "P", "P", "T"],
  "resultText": "Most votes: {top} ({count} of {total})" }
```

## Several questions after one lesson
```json
{ "id": "small-but-crowded", "name": "Crowded Corner", "lead": "…", "remember": "…",
  "activity": { "type": "truefalse", "statement": "Rainforests cover most land.", "answer": false, "why": "About 6%." },
  "checks": [
    { "type": "choice", "question": "How much of land life lives there?", "options": [ { "text": "More than half", "correct": true }, { "text": "A tenth", "why": "Far more." } ] },
    { "type": "number", "question": "Rainforests cover about what % of land?", "answer": 6, "unit": "%" }
  ] }
```
