# Detective data schema — schemaVersion 1

## Overview
The data describes a case to crack. The learner is the detective: a briefing
poses one question, a cast of people hold competing theories (the
misconceptions and the right explanation), and locations yield clues through
small interactions: examining a scene, interviewing a witness, reading a
document, comparing exhibits, rebuilding a timeline, checking a ledger,
opening a lock and running a lab test. Every clue says what it proves, which
theories it rules out and why it matters. On a case board the learner pins
clues and links them to theories; a contradicting link rules a theory out.
Finally the learner names the explanation with a confidence level, and a
debrief, an epilogue that restates the concept plainly and a case file review
follow. Nothing is scored against the learner.

Text fields accept one inline mark-up: `**bold**`. Nothing else is interpreted.
Character limits count JavaScript string length, so one emoji counts as 2.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–80 chars | Case title: page title, briefing heading, top bar |
| `subtitle` | string | no | ≤200 chars | One line under the title |
| `caseNumber` | string | no | ≤16 chars | Shown as a stamp, e.g. `"MK-0521"` |
| `theme` | string | no | one of `noir`, `parchment`, `neon`, `newsroom`, `forensic` | Visual theme (see Themes). When omitted, one is derived from the title |
| `briefing` | object | yes | see Briefing | The case set-up and the question |
| `detective` | object | yes | see Detective | Who the learner is |
| `cast` | array | yes | 1–10 Person objects | Witnesses, experts and suspects |
| `hypotheses` | array | yes | 2–6 Hypothesis objects, exactly one `correct` | The theories on the board |
| `clues` | array | yes | 2–40 Clue objects | All evidence in the case |
| `locations` | array | yes | 2–14 Location objects | Where clues are found, in map order |
| `board` | object | no | see Board | Wording for the case board |
| `accusation` | object | no | see Accusation | Wording for the final step |
| `epilogue` | object | yes | see Epilogue | The plain restatement of the concept |

## Themes
Every theme sets the animated backdrop, the board surface (cork, glass grid or
felt), pins or tape, string colours, typography and corner radius, and has a
light and a dark variant chosen by the reader's system setting. Each variant
stays on one side of brightness: light variants put near-black ink on light
surfaces, dark variants near-white ink on dark surfaces.

| Theme | Native mood | Board | Backdrop | Type | Suits |
| :- | :- | :- | :- | :- | :- |
| `noir` | Dark: smoky charcoal, amber lamp, red string | Cork with red pins | Venetian-blind light, rain, smoke; a torch beam in scenes | Special Elite / Inter | Classic whodunnits, workplace incidents, ethics |
| `parchment` | Light: aged paper, sepia ink, wax red | Cork with pins | Drifting dust | Playfair Display / Lora | History, law, literature, slow-burn reasoning |
| `neon` | Dark: cyber black, cyan and magenta glow | Glass grid wall | Moving grid floor, rain; torch beam | Space Grotesk / IBM Plex Mono | Technology, security, data incidents, younger audiences |
| `newsroom` | Light: newsprint, black ink, red marker | Grey felt with tape | Faint blinds and dust | Playfair Display / Inter | Media literacy, public policy, current affairs |
| `forensic` | Light: clinical white and teal | Whiteboard grid with tape | Grid floor | Space Grotesk / Inter | Science, medicine, food safety, lab-based topics |

## Briefing object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤60 chars, default "Case briefing" | Label above the paragraphs |
| `paragraphs` | string[] | yes | 1–5 items, each 1–600 chars | What happened and why it matters |
| `question` | string | yes | 1–200 chars | The one question the case answers; repeated on the map and the accusation |
| `stakes` | string | no | ≤200 chars | One line on how to crack it |

## Detective object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–120 chars | E.g. "You are the detective Dana has called in" |
| `description` | string | no | ≤400 chars | What the learner needs (and doesn't need) to know |

## Person object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique in `cast` | Referenced by hypotheses and locations |
| `name` | string | yes | 1–40 chars | |
| `role` | string | yes | 1–60 chars | Job or relation to the case |
| `kind` | string | yes | one of `witness`, `expert`, `suspect` | How they relate to the case |
| `bio` | string | no | ≤240 chars | One line shown in interviews and on hover |
| `portrait` | object | no | see Portrait | Avatar parts; omitted parts are chosen from the id |

### Portrait object
All fields optional. The avatar is inline SVG assembled from these parts.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `skin` | string | no | `porcelain`, `fair`, `tan`, `olive`, `brown`, `deep` | Skin tone |
| `hair` | string | no | `short`, `long`, `bob`, `bun`, `curly`, `buzz`, `bald`, `ponytail` | Hair style |
| `hairColor` | string | no | `black`, `brown`, `auburn`, `blonde`, `red`, `grey`, `white` | Also used for brows and facial hair |
| `outfit` | string | no | `suit`, `shirt`, `apron`, `chef`, `labcoat`, `hoodie`, `uniform`, `cardigan` | Clothing |
| `outfitColor` | string | no | `#rrggbb` | Overrides the outfit's default colour (also colours a cap or headscarf) |
| `accessory` | string | no | `none`, `glasses`, `fedora`, `cap`, `headscarf`, `earrings`, `headset`; default `none` | |
| `facialHair` | string | no | `none`, `beard`, `moustache`, `stubble`; default `none` | |
| `expression` | string | no | `neutral`, `smile`, `worried`, `stern`; default `neutral` | Brows and mouth |

## Hypothesis object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Referenced by clues |
| `title` | string | yes | 1–80 chars | Short theory name on the board |
| `statement` | string | yes | 1–300 chars | The theory in full, as its holder would say it |
| `correct` | boolean | no | exactly one hypothesis is `true` | The right explanation |
| `popular` | boolean | no | never on the correct one | Marks the wrong theories most people believe |
| `holder` | string | no | a `cast` id | Who believes it; their portrait appears on the card |
| `tempting` | string | conditional | ≤400 chars; required on every wrong hypothesis | Why people believe it, said fairly |
| `why` | string | yes | 1–600 chars | For the correct one, why it is right; for a wrong one, why it is wrong |

## Clue object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Referenced by locations |
| `title` | string | yes | 1–60 chars | Handwritten on the board card |
| `kind` | string | no | `physical`, `testimony`, `document`, `record`, `test` | Icon and label; default follows the first location that reveals it |
| `text` | string | yes | 1–300 chars | What the learner found |
| `proves` | string | yes | 1–300 chars | What the clue shows, in plain words |
| `why` | string | yes | 1–400 chars | Why it matters for the concept (shown after "Why does this matter?") |
| `rulesOut` | array | no | 0–5 RuleOut objects | The theories this clue contradicts |
| `supports` | string[] | no | 0–6 hypothesis ids | Theories the clue fits (fitting is not proof) |
| `redHerring` | boolean | no | default `false` | Looks like evidence and isn't; rules out and supports nothing |

RuleOut: `hypothesis` (a hypothesis id, never the correct one) and `because`
(string, 1–300: why this clue contradicts that theory; shown when the learner
links the two and in the debrief).

## Location object

Every location has these fields, plus the fields of its `type` below.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | |
| `name` | string | yes | 1–50 chars | Card and page heading |
| `type` | string | yes | `examine`, `interview`, `document`, `compare`, `timeline`, `ledger`, `lock`, `lab` | The interaction |
| `summary` | string | yes | 1–200 chars | One line on the map card |
| `intro` | string | no | ≤600 chars | Paragraph at the top of the location |
| `host` | string | no | a `cast` id | Person shown at a non-interview location (e.g. the scientist at the lab) |
| `requires` | string[] | no | 0–5 clue ids | The location stays locked until all of these are found |
| `lockedNote` | string | no | ≤200 chars | Shown on a locked card: what to look for first |

### `examine` — tap hotspots in an illustrated scene

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `scene` | string | yes | `kitchen`, `office`, `storeroom`, `lab`, `street`, `room`: the drawn backdrop |
| `hotspots` | array | yes | 2–8 Hotspot objects, at least one with a `clue` |

Hotspot: `id` (kebab-case, unique in the scene), `label` (1–30, shown on the
chip below the scene), `object` (one of `fridge`, `dial`, `alarm`,
`certificate`, `drawer`, `bin`, `sink`, `shelf`, `box`, `laptop`, `phone`,
`note`, `door`, `jar`, `clipboard`, `camera`, `cabinet`, `plant`), `x`
(number 5–95, percent from the left), `y` (number 10–90, percent from the
top), `note` (1–400, what the learner sees), `clue` (optional clue id). A
hotspot without a clue is a dead end; its note says so.

### `interview` — choose questions; answers reveal clues

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `person` | string | yes | a `cast` id |
| `opening` | string | yes | 1–400; what they say first |
| `questions` | array | yes | 1–10 Question objects |

Question: `id` (kebab-case, unique in the interview), `ask` (1–160), `answer`
(1–500), `clue` (optional clue id), `redHerring` (optional boolean; the answer
misleads, and is listed in the debrief), `note` (≤300; required when
`redHerring` is true: why it leads nowhere), `requires` (optional 0–5 clue ids:
the question appears only once these are found), `unlocks` (optional 0–5
question ids in the same interview that appear after this one is asked).

### `document` — read and highlight the lines that matter

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `docType` | string | yes | `memo`, `email`, `policy`, `log`, `letter`, `label`, `report` (styling and stamp) |
| `docTitle` | string | yes | 1–80 |
| `meta` | array | no | 0–6 `{ label (1–20), value (1–80) }` header rows (From, Date, Version…) |
| `prompt` | string | no | ≤200, default "Highlight the line that matters." |
| `lines` | array | yes | 2–16 Line objects, at least one with a `clue` |

Line: `text` (1–300), `clue` (optional clue id), `note` (≤300, shown when the
line is highlighted).

### `compare` — two exhibits side by side, spot the difference

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤200 |
| `rowLabels` | string[] | yes | 2–10 items, each 1–40 |
| `left`, `right` | object | yes | `label` (1–60), `caption` (≤200), `rows` (string[], one per row label, each 1–80) |
| `spots` | array | yes | 1–5 `{ row, note (1–300), clue? }`, at least one with a `clue` |
| `sameNote` | string | no | ≤200, default "These match." (shown on rows that are not spots) |

### `timeline` — put events in order

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤200 |
| `events` | array | yes | 3–8 `{ id, time (1–30), text (1–160) }` **in the true order**; the renderer shuffles them and hides `time` until solved |
| `clue` | string | yes | clue id revealed when the order is rebuilt |
| `solvedNote` | string | yes | 1–400; what the order shows |

### `ledger` — check the numbers against a rule, spot the mismatch

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | no | ≤200 |
| `rule` | string | no | ≤200; the rule to check against, shown above the table |
| `columns` | string[] | yes | 2–6 items, each 1–30 |
| `rows` | array | yes | 2–12 rows, each an array of exactly `columns.length` strings (1–40) |
| `mismatches` | array | yes | 1–3 `{ row, cell?, note (1–300), clue? }`, at least one with a `clue`; `cell` circles one cell |
| `okNote` | string | no | ≤200, default "This row checks out." |

### `lock` — a small combination lock

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `alphabet` | string | no | 2–36 unique non-space symbols, default `"0123456789"` (the dial symbols) |
| `answer` | string | yes | 2–8 symbols, each in `alphabet`; one dial per symbol |
| `hints` | string[] | yes | 1–4 items, each 1–200; revealed one at a time, the last should give the code away |
| `openText` | string | yes | 1–400; shown when it opens |
| `clue` | string | yes | clue id behind the lock |

The code should be derivable from evidence elsewhere (a date on a label, a
number in a document); use `requires` so the lock opens on the map only after
that evidence is found. After every hint is shown, the learner may have the
dials set for them.

### `lab` — set conditions, run a test, observe

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 |
| `visual` | string | yes | `gauge` (needle), `dish` (colonies in a petri dish), `beaker` (fill level) |
| `meterLabel` | string | yes | 1–40; what the instrument measures |
| `controls` | array | yes | 1–3 `{ id, label (1–40), options (2–4 strings, each 1–30) }` |
| `outcomes` | array | yes | 1–64 Outcome objects; first match wins |

Outcome: `when` (optional object mapping control ids to option indexes; omit
for a catch-all), `level` (number 0–100, the instrument reading), `reading`
(1–40, the result in words), `text` (1–300, what it means), `clue` (optional
clue id).

## Board object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤60, default "The case board" | |
| `intro` | string | no | ≤300 | Instructions above the board |

## Accusation object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | no | ≤200, default "Name the explanation" | Heading of the final step |
| `intro` | string | no | ≤400 | Line under the heading |

## Epilogue object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤60, default "Epilogue" | |
| `concept` | string | yes | 1–60 | The concept's name, shown large |
| `paragraphs` | string[] | yes | 1–5 items, each 1–600 | The concept restated plainly |
| `takeaways` | string[] | no | 0–10 items, each 1–200 | Numbered list to remember |

## Cross-field rules
- Ids are unique within `cast`, `hypotheses`, `clues` and `locations`;
  hotspot, question, event and lab-control ids are unique within their
  location.
- Exactly one hypothesis has `correct: true`. `popular` is never on the
  correct one. Every wrong hypothesis has `tempting`.
- `hypotheses[i].holder`, `locations[i].host` and `interview.person` must be
  `cast` ids.
- `clues[i].rulesOut[j].hypothesis` and `clues[i].supports[j]` must be
  hypothesis ids. No clue rules out the correct hypothesis, lists the same
  hypothesis twice in `rulesOut`, or both supports and rules out one
  hypothesis.
- A red-herring clue has no `rulesOut` and no `supports`.
- Every wrong hypothesis is ruled out by at least one clue.
- Every clue id referenced by a location (hotspot, question, line, spot,
  timeline, mismatch, lock, outcome, `requires`) must exist, and every clue
  must be revealed by at least one location.
- Interview: `unlocks` name question ids of the same interview (never the
  question itself); at least one question has no `requires` and is not
  unlocked by another; a red-herring answer has a `note` and no `clue`.
- Document, examine, compare, ledger and lab: at least one line, hotspot,
  spot, mismatch or outcome reveals a clue.
- Compare: `left.rows` and `right.rows` have exactly `rowLabels.length`
  entries; `spots[i].row` is an index into `rowLabels`, listed once.
- Ledger: every row has `columns.length` cells; `mismatches[i].row` is an
  index into `rows`, listed once; `cell` is an index into `columns`.
- Timeline: event ids and texts are unique (the listed order is the answer).
- Lock: `alphabet` symbols are unique; every `answer` symbol is in it.
- Lab: `when` keys are control ids of that lab and values are option indexes;
  every combination of control options matches some outcome; an outcome that
  can never be shown (an earlier one always matches first) must not carry a
  clue.
- Reachability: starting from the locations without `requires`, every
  location must eventually open, every interview question must eventually be
  askable and every clue must eventually be findable.

## Warnings (non-blocking)
- Fewer than 3 hypotheses.
- No wrong hypothesis marked `popular`.
- No clue marked `redHerring`.
- A clue that is not a red herring but neither rules out nor supports any
  hypothesis (it does nothing on the board).
- Fewer than 4 interaction types across the locations.
- A location with `requires` but no `lockedNote`.
- A lab outcome that is never shown.

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
