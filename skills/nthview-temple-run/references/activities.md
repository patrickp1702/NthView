# Temple Run — choosing and writing activities

This guide helps pick one of the 31 activity types for each stretch and gives
a minimal JSON snippet for each. The field tables and limits live in
`schema.md`; this file is about *which* type fits *which* question. The
complete showcase, one stretch per type, is the example in `schema.md`
(built as `examples/example.html`).

Every type works in both modes. In learning mode (`strictMode` false, the
default) a wrong answer is explained, the right answer is shown, and the
learner continues; in quiz mode (`strictMode` true) it costs a torch and the
answer stays hidden until found (see Modes in `schema.md`).

## Pick by the shape of the question

| The question is… | Use | Played |
| :- | :- | :- |
| Any question with one right answer and no better fit | `choice` | panel |
| One statement to judge | `truefalse` | panel |
| One statement after another, fast | `planks` | track |
| Several members of a category among impostors | `multi` (panel) or `harvest` (track) | |
| A key sentence to complete | `cloze` | panel |
| A sequence, timeline or process | `order` (panel) or `levers` (track) | |
| Terms and their meanings, parts and jobs | `match` | panel |
| Items that fall into 2–4 groups | `sort` (panel) or `tiles` (track, 2–3 groups) | |
| Items that differ along one measurable axis | `rank` | panel |
| A number worth having a feel for | `estimate` | panel |
| An exact number the learner can work out | `number` | panel |
| A word or name the learner should recall unprompted | `text` | panel |
| One item that breaks a pattern | `odd` | panel |
| A labelled system or a diagram with parts | `hotspot` | panel |
| Two to four options compared by size or by two numbers | `pads` | panel |
| Two or three answers to choose between, then a dash through the right one | `lanes` (runes) or `gates` (gateways) | track |
| A set where some members qualify and others do not | `torches` | track |
| A cause and effect worth predicting first | `predict` | panel |
| A fact learners are often confidently wrong about | `confidence` | panel |
| "Many samples, the majority wins" | `collect` | track, needs a quiz |
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
- Vary the types: a good run changes rhythm every stretch or two, with a
  track trial roughly every third stretch. Six or more stretches with only
  one or two types trigger a validator warning.
- Track trials are read first: the runner stops before each choice (each
  step for `torches`, `planks`, `harvest`, `levers`, `tiles`), a card shows
  the prompt and the lane labels, and the run resumes only when the learner
  presses Enter or taps Run. Keep labels to one or two words anyway
  (≤16 characters, ≤12 for tokens, levers and tile items) so they also read
  on the floating signs, and put the explanation in `lead`, `body` or
  `prompt`.
- A lesson that deserves more than one check gets `checks`: up to ten extra
  scored panel questions the encounter asks after the main one.
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

### lanes (track)
```json
{ "type": "lanes", "prompt": "Run through the rune of the belt where rainforests grow.",
  "options": [ { "id": "equator", "label": "Equator" }, { "id": "poles", "label": "Poles", "hint": "Far too cold." } ],
  "answer": "equator" }
```

### gates (track)
```json
{ "type": "gates", "prompt": "Run through the gate of the sunniest layer.",
  "paths": [ { "id": "emergent", "label": "Emergent" }, { "id": "floor", "label": "Forest floor", "hint": "The darkest layer." } ],
  "answer": "emergent" }
```

### torches (track)
```json
{ "type": "torches", "prompt": "Light the braziers of the decomposers.",
  "items": [ { "id": "fungi", "label": "Fungi", "lit": true }, { "id": "toucan", "label": "Toucan", "lit": false },
             { "id": "worms", "label": "Earthworms", "lit": true } ] }
```

### planks (track)
```json
{ "type": "planks", "prompt": "Step on the true planks, jump the false ones.",
  "planks": [ { "text": "Trees take in carbon dioxide", "answer": true },
              { "text": "The Amazon makes most of our oxygen", "answer": false, "why": "Ocean algae make most of it." },
              { "text": "Rainforest soil is rich", "answer": false, "why": "It is poor." } ] }
```

### harvest (track)
```json
{ "type": "harvest", "prompt": "Grab what comes from rainforest plants.",
  "items": [ { "label": "Chocolate", "belongs": true }, { "label": "Wool", "belongs": false },
             { "label": "Rubber", "belongs": true }, { "label": "Granite", "belongs": false } ] }
```

### levers (track)
```json
{ "type": "levers", "prompt": "Pull the levers in water-cycle order, starting with the rain.",
  "items": [ { "id": "rain", "label": "Rain falls" }, { "id": "roots", "label": "Roots drink" }, { "id": "clouds", "label": "Clouds form" } ] }
```

### tiles (track)
```json
{ "type": "tiles", "prompt": "Step on the tile of the layer where each one lives.",
  "bins": [ { "id": "canopy", "label": "Canopy" }, { "id": "floor", "label": "Floor" } ],
  "items": [ { "label": "Sloth", "bin": "canopy" }, { "label": "Tapir", "bin": "floor" }, { "label": "Orchid", "bin": "canopy" } ] }
```

### collect (track, needs a quiz)
```json
{ "type": "collect", "prompt": "Run through all seven votes.", "items": ["P", "T", "P", "F", "P", "P", "T"],
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
