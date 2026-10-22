# Island Quest — choosing and writing activities

This guide helps pick one of the 25 activity types for each island and gives
a minimal JSON snippet for each. The field tables and limits live in
`schema.md`; this file is about *which* type fits *which* idea. The complete
showcase with one island per type is `examples/all-types-island-quest.json`
at the repository root (built as `all-types-island-quest.html`).

## Pick by the shape of the idea

| The idea in the source is… | Use | Why |
| :- | :- | :- |
| "Many samples, take the majority" | `collect` | Walking into tokens and seeing the vote makes "majority" physical |
| Two to four options where one is clearly bigger, faster, better | `pads` (with `bars` or `size`) | The columns or figures show the comparison; standing on a pad is the answer |
| A process that unfolds, especially one that goes wrong | `story` | The frames reveal the twist one step at a time |
| A trade-off with one or two knobs | `tune` | The learner feels the relationship before being asked about it |
| Two or more costs, speeds or durations | `race` | Racing bars make magnitude memorable |
| A common misconception stated as a sentence | `truefalse` | One crisp judgement; put the correction in `why` |
| A category with several members and several impostors | `multi` | "Pick all that apply" forces a definition to be applied |
| Steps, stages, a timeline, a lifecycle | `order` | Sequencing; use `note` to teach as it reveals |
| Terms and their roles, parts and their jobs | `match` | Pairing is faster than four separate questions |
| Items that belong to two to four classes | `sort` | Buckets teach the classification itself |
| Items that differ along one measurable axis | `rank` | The reveal shows how far off the intuition was |
| A key sentence the learner should be able to complete | `cloze` | Builds vocabulary in context |
| A number worth having a feel for | `estimate` | Guessing first makes the real value stick |
| One item that breaks a pattern | `odd` | Teaches the pattern by its exception |
| A labelled object or system with parts | `hotspot` | Spatial: the learner finds the part in 3D |
| A decision point with a right choice | `fork` | Walking a path is a commitment; the hint corrects it |
| A set where some members have a property and others do not | `beacons` | Light the ones that qualify; forgiving to toggle |
| A fixed sequence the learner must perform | `steps` | Doing it in order with your feet |
| Items that belong to two or three groups, as a physical task | `gather` | Carrying each orb to a bin; the 3D version of `sort` |
| A then-versus-now or with-versus-without contrast | `compare` | Flipping between two states makes the change vivid |
| A distribution or split the learner probably misjudges | `bars` | Prediction first, then the truth, no scoring pressure |
| A system whose state depends on a few on/off conditions | `switches` | Rules become visible as lamps and a status light |
| A cause-and-effect worth predicting | `predict` | Commit, then watch; the surprise teaches |
| A fact learners are often *confidently* wrong about | `confidence` | Calibration: being sure and wrong costs more |
| Vocabulary to review at the end | `flashcards` | Low pressure recap before the quiz |

Rules of thumb:
- Mix types. Six or more islands with only one or two types triggers a
  validator warning; a good quest changes rhythm every island or two.
- Put the field tasks (`collect`, `pads`, `steps`, `beacons`, `gather`,
  `fork`, `hotspot`) where a change of pace helps, roughly every third
  island. They take longer than panel tasks.
- Prefer `predict` and `confidence` for the lessons whose point is a
  surprise; prefer `order`, `match`, `sort`, `cloze` for lessons that
  consolidate terminology.
- Exploration types (`collect`, `story`, `tune`, `race`, `compare`, `bars`,
  `switches`, `flashcards`) need a `quiz` that tests what the exploration
  showed, not trivia about it.
- Scenery (`theme` on the island) and activity are independent. Props sit on
  the outward half of the island; `plain`, `arena`, `workshop` and `grove`
  leave them the most room, `tower` and `canyon` are the busiest.

## Snippets

Each snippet is the `activity` object only. Replace the text; keep the shape.

### collect (needs a quiz)
```json
{ "type": "collect", "prompt": "Walk into all 7 letters.", "items": ["B","A","B","C","B","D","B"],
  "resultText": "Most popular answer: {top} ({count} of {total} votes)" }
```

### pads
```json
{ "type": "pads", "prompt": "Stand on the pad that grew the most.",
  "options": [ { "id": "easy", "label": "Easy", "bars": [94, 97], "hint": "Barely grew." },
               { "id": "hard", "label": "Hard", "bars": [8, 17] } ],
  "answer": "hard" }
```

### story (needs a quiz)
```json
{ "type": "story", "buttonLabel": "Next step", "frames": ["First…", "Then…", "Finally…"] }
```

### tune (needs a quiz)
```json
{ "type": "tune", "controls": [ { "id": "h", "label": "Hops", "min": 2, "max": 8, "value": 4 } ],
  "readout": [ { "text": "Total delay: {h*10} ms" } ],
  "visual": { "kind": "grid", "count": "h", "extra": "1" } }
```

### race (needs a quiz)
```json
{ "type": "race", "buttonLabel": "Start the race",
  "bars": [ { "label": "Light, one way", "value": 5, "show": "28 ms", "tag": "light" },
            { "label": "Satellite round trip", "value": 100, "show": "600 ms", "tag": "satellite" } ] }
```

### truefalse
```json
{ "type": "truefalse", "statement": "The internet and the web are the same thing.",
  "answer": false, "why": "The web is one service that runs on the internet." }
```

### multi
```json
{ "type": "multi", "question": "Which of these are protocols?",
  "options": [ { "text": "TCP", "correct": true }, { "text": "HTTP", "correct": true },
               { "text": "Chrome", "why": "Chrome is a browser." } ] }
```

### order
```json
{ "type": "order", "prompt": "Arrange the steps from first to last.",
  "items": [ { "text": "Type the address" }, { "text": "Look up the IP", "note": "DNS" }, { "text": "Request the page" } ] }
```

### match
```json
{ "type": "match", "prompt": "Match each name to its job.",
  "pairs": [ { "left": "IP", "right": "Addresses packets" }, { "left": "DNS", "right": "Names to numbers" },
             { "left": "HTTP", "right": "Asks for pages" } ] }
```

### sort
```json
{ "type": "sort", "prompt": "Put each item in the right bucket.",
  "buckets": [ { "id": "hw", "label": "Hardware" }, { "id": "sw", "label": "Software" } ],
  "items": [ { "text": "Router", "bucket": "hw" }, { "text": "Browser", "bucket": "sw" }, { "text": "Cable", "bucket": "hw" } ] }
```

### rank
```json
{ "type": "rank", "prompt": "Fastest first.",
  "items": [ { "text": "Same city", "value": 2, "show": "10 ms" }, { "text": "Across an ocean", "value": 14, "show": "80 ms" },
             { "text": "Via satellite", "value": 100, "show": "600 ms" } ] }
```

### cloze
```json
{ "type": "cloze", "text": "A ___ server turns a name into an ___ address.",
  "gaps": [ { "options": ["DNS", "mail"], "answer": 0 }, { "options": ["email", "IP"], "answer": 1 } ] }
```

### estimate
```json
{ "type": "estimate", "question": "Light in fibre runs at what % of its vacuum speed?",
  "min": 10, "max": 100, "answer": 67, "tolerance": 8, "unit": "%", "reveal": "About two-thirds." }
```

### odd
```json
{ "type": "odd", "prompt": "Which one does not belong?", "items": ["Router", "Switch", "Modem", "Browser"],
  "answer": 3, "why": "A browser is software." }
```

### hotspot
```json
{ "type": "hotspot", "prompt": "Click the part that hands out local addresses.",
  "parts": [ { "id": "modem", "label": "Modem", "hint": "Talks to the provider." }, { "id": "router", "label": "Router" },
             { "id": "laptop", "label": "Laptop", "hint": "Receives an address." } ],
  "answer": "router" }
```

### fork
```json
{ "type": "fork", "prompt": "The direct road is congested. Which way?",
  "paths": [ { "id": "wait", "label": "Wait in line", "hint": "Queues overflow." }, { "id": "detour", "label": "Take a detour" } ],
  "answer": "detour" }
```

### beacons
```json
{ "type": "beacons", "prompt": "Light every beacon that is an IP address.",
  "items": [ { "id": "a", "label": "192.168.0.1", "lit": true }, { "id": "b", "label": "example.com", "lit": false },
             { "id": "c", "label": "10.0.0.42", "lit": true } ] }
```

### steps
```json
{ "type": "steps", "prompt": "Step on the pads in handshake order.",
  "items": [ { "id": "syn", "label": "SYN" }, { "id": "synack", "label": "SYN-ACK" }, { "id": "ack", "label": "ACK" } ] }
```

### gather
```json
{ "type": "gather", "prompt": "Drop each address in the right bin.",
  "bins": [ { "id": "public", "label": "Public" }, { "id": "private", "label": "Private" } ],
  "items": [ { "label": "8.8.8.8", "bin": "public" }, { "label": "192.168.1.5", "bin": "private" }, { "label": "10.0.0.7", "bin": "private" } ] }
```

### compare (needs a quiz)
```json
{ "type": "compare",
  "before": { "label": "1996", "text": "Text and a small picture.", "rows": [ { "label": "Page size", "value": 2, "show": "50 KB" } ] },
  "after":  { "label": "Today", "text": "Scripts, fonts, video.", "rows": [ { "label": "Page size", "value": 100, "show": "2.5 MB" } ] } }
```

### bars (needs a quiz)
```json
{ "type": "bars", "prompt": "Guess the split, then reveal it.",
  "items": [ { "label": "DNS", "value": 10, "show": "10%" }, { "label": "Connecting", "value": 20, "show": "20%" },
             { "label": "Downloading", "value": 70, "show": "70%" } ] }
```

### switches (needs a quiz)
```json
{ "type": "switches",
  "switches": [ { "id": "https", "label": "HTTPS", "on": true }, { "id": "vpn", "label": "VPN", "on": false } ],
  "readout": [ { "when": "!https", "text": "Anyone can read what you send.", "tone": "no" },
               { "when": "https && !vpn", "text": "Content is private; sites visited are visible.", "tone": "note" },
               { "text": "Content private, sites hidden.", "tone": "ok" } ] }
```

### predict
```json
{ "type": "predict", "question": "A major undersea cable is cut. What happens?",
  "options": [ { "text": "The internet stops nearby", "why": "Many paths exist." }, { "text": "Traffic re-routes", "correct": true } ],
  "frames": ["An anchor snaps the cable.", "Routers notice within seconds.", "Traffic shifts to other cables."],
  "result": "Traffic re-routed within seconds." }
```

### confidence
```json
{ "type": "confidence", "question": "What does the s in https stand for?",
  "options": [ { "text": "Speed", "why": "It is not about speed." }, { "text": "Secure", "correct": true } ],
  "okText": "Secure: the connection is encrypted." }
```

### flashcards (needs a quiz)
```json
{ "type": "flashcards", "cards": [ { "front": "Packet", "back": "A small chunk of data with an address." },
                                   { "front": "DNS", "back": "Turns names into IP addresses." } ] }
```
