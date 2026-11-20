# Compare data schema — schemaVersion 1

## Overview
The data describes two to four similar things (the **options**) compared on
three to ten named criteria (the **dimensions**): one **cell** for every
option on every dimension, a "when to choose which" list, the similarities
and differences worth remembering, and a set of **questions** that make the
learner tell the options apart. The learner reads in any order (overview,
matrix, one card per dimension or per option, when to choose, recap) and
practises whenever they like. The matrix can also be covered as a
self-test: the learner predicts each cell's mark (yes, partly, no or low,
medium, high, or "not sure") before revealing it, as in a semantic feature
grid. Scored questions offer "Check, I'm sure" and "Check, not sure", and a
confident error gets a stronger nudge and a place in the end review.

Text fields accept one inline mark-up: `**bold**`. Nothing else is
interpreted. Character limits count JavaScript string length, so one emoji
counts as 2. Ids are lowercase kebab-case (`pen-test`, `depth`).

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Page heading, e.g. "Vulnerability scan vs penetration test vs red team" |
| `subtitle` | string | no | ≤200 chars | One line under the title |
| `focus` | string | no | ≤240 chars | The question the comparison answers, e.g. "Which assessment answers which question about our defences?" Shown on the overview |
| `intro` | string[] | no | 0–4 items, each 1–600 chars | Paragraphs on why these are compared and why people confuse them |
| `options` | array | yes | 2–4 Option objects | The things compared, in display order |
| `dimensions` | array | yes | 3–10 Dimension objects | The criteria, in display order (most telling first); 5–8 is usual |
| `cells` | array | yes | exactly one Cell per option × dimension | What each option is on each dimension |
| `whenToChoose` | array | yes | 2–12 Choose objects | Situations and the option that fits each |
| `similarities` | string[] | no | 0–8 items, each 1–240 chars | What all the options share |
| `differences` | string[] | no | 0–8 items, each 1–240 chars | The few differences that matter most, as sentences |
| `bigIdea` | string | no | ≤400 chars | The principle that ties the comparison together, shown in the recap and at the end of practice, after the learner has compared (stating it after the comparison teaches more than before) |
| `misconceptions` | array | no | 0–8 Misconception objects | Tempting confusions between the options, each corrected |
| `questions` | array | yes | 1–40 Question objects | Practice, asked in this order; mix the kinds |
| `sources` | array | no | 0–12 Source objects | Where the facts come from, listed on the overview |

## Option object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among options | Referenced by cells, choices and questions |
| `name` | string | yes | 1–60 chars | Full name, e.g. "Penetration test" |
| `short` | string | no | 1–16 chars | Short label for narrow columns and chips, e.g. "Pen test". Defaults to `name` |
| `aka` | string | no | ≤120 chars | Other names, e.g. "pentest, ethical hack" |
| `summary` | string | yes | 1–300 chars | What it is, in one or two sentences |
| `colour` | string | no | one of `blue`, `teal`, `amber`, `rose`, `violet`, `green` | Accent for this option in every screen. Defaults to the list order; no two options may share one |

## Dimension object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among dimensions | Referenced by cells and questions |
| `name` | string | yes | 1–60 chars | The criterion, e.g. "Depth" or "Who does it" |
| `why` | string | no | ≤300 chars | Why this criterion matters when choosing |
| `takeaway` | string | no | ≤300 chars | The contrast in one sentence: "With regard to depth, a scan finds, a pen test exploits, a red team pursues an objective." Shown under the dimension card and in feedback |
| `alike` | boolean | no | default `false` | The options are essentially the same here. "Differences only" hides such dimensions; keep one or two, because what is shared is learned too |

## Cell object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `option` | string | yes | an `options[].id` | Which option |
| `dimension` | string | yes | a `dimensions[].id` | Which criterion |
| `text` | string | yes | 1–200 chars | What the option is on this dimension, short enough for a table cell |
| `mark` | string | no | one of `yes`, `partly`, `no`, `low`, `medium`, `high`, `na` | A glanceable symbol: feature present (`yes`/`partly`/`no`, as in a semantic feature grid) or a degree (`low`/`medium`/`high`). `na` is "does not apply" |
| `detail` | string | no | ≤800 chars | More on this cell, opened on demand and shown as feedback |

## Choose object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `situation` | string | yes | 1–200 chars | A need or circumstance, e.g. "You must show quarterly that no known high-risk flaw is exposed" |
| `option` | string | yes | an `options[].id` | The option that fits |
| `why` | string | no | ≤400 chars | Why it fits, and why not the others |

## Misconception object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `claim` | string | yes | 1–200 chars | The tempting wrong belief, e.g. "A clean scan means we are secure" |
| `truth` | string | yes | 1–500 chars | What is actually so, and the difference it hides |

## Source object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–200 chars | Citation as shown, e.g. "NIST SP 800-115, Technical Guide to Information Security Testing and Assessment (2008)" |
| `url` | string | no | starts with `https://` or `http://`, ≤500 chars | Link, opened in a new tab |

## Question object

Every question has these fields, plus the fields of its `kind` below.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique among questions | Stable key for saved progress |
| `kind` | string | yes | one of `sort`, `cell`, `pick`, `choice`, `explain` | See the kinds below |
| `prompt` | string | see kind | ≤300 chars | The question; each kind says whether it is required and what the default is |

The kinds, and what each trains:

| Kind | The learner | Trains |
| :- | :- | :- |
| `sort` | marks, for each statement, which options it is true of (one, several, all or none) | discriminating shared from distinctive features |
| `cell` | fills a hidden cell of the matrix, choosing among that dimension's cells | recalling a feature against its near neighbours |
| `pick` | reads a situation and chooses the option that fits | transfer: when to choose which |
| `choice` | chooses one statement among 2–6, e.g. "Which is true of a red team but not a pen test?" or "Which claim is a misconception?" | precise contrasts and misconceptions |
| `explain` | writes how two options differ, then compares with a model answer and ticks the key points they covered | generating the comparison in their own words; not scored |

### `sort` fields

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | no | ≤300 chars | Default "Which does each statement describe?" |
| `statements` | array | yes | 2–8 Statement objects | Sorted one by one, checked together |

Statement: `text` (string, 1–200 chars, required), `answer` (array of
option ids, required, no repeats; empty means "none of them", every id
means "all of them"), `why` (string, 1–400 chars, required).

### `cell` fields

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `option` | string | yes | an `options[].id` | The option whose cell is hidden |
| `dimension` | string | yes | a `dimensions[].id` | The dimension whose cell is hidden |
| `prompt` | string | no | ≤300 chars | Default "{option name}: {dimension name}?" |
| `why` | string | no | ≤500 chars | Feedback; defaults to the cell's `detail`, then the dimension's `takeaway` |

The choices are the texts of every cell on that dimension, shuffled the
same way on every open.

### `pick` fields

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `situation` | string | yes | 1–500 chars | The concrete need |
| `prompt` | string | no | ≤300 chars | Default "Which would you choose?" |
| `answer` | string | yes | an `options[].id` | The fitting option |
| `why` | string | yes | 1–500 chars | Why it fits |
| `notes` | object | no | keys are option ids other than `answer`, values 1–300 chars | Why each other option falls short, shown when it is chosen or reviewed |

### `choice` fields

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 chars | The question |
| `choices` | array | yes | 2–6 objects, exactly one `correct` | Each `{ text, correct, why }`: `text` 1–200 chars, `correct` boolean (default `false`), `why` 1–400 chars |

### `explain` fields

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | yes | 1–300 chars | E.g. "In two sentences, how does a red team differ from a pen test?" |
| `model` | string | yes | 1–800 chars | A model answer, shown after the learner writes or chooses to reveal |
| `points` | string[] | yes | 1–5 items, each 1–160 chars | Key points the learner ticks off against their own answer |

## Cross-field rules
- `options[].id`, `dimensions[].id` and `questions[].id` are each unique.
- No two options share a `colour`.
- `cells` holds exactly one cell for every pair of option and dimension:
  every `cells[i].option` names an option, every `cells[i].dimension` names a
  dimension, no pair appears twice, and none is missing.
- `whenToChoose[i].option`, `questions[i].answer` (pick),
  `questions[i].option` (cell) and every id in
  `questions[i].statements[j].answer` (sort) name an option.
- `questions[i].dimension` (cell) names a dimension, and the cells on that
  dimension have distinct `text`, so the hidden cell has one right choice.
- A `pick` question's `notes` keys name options and are not the `answer`.
- A `choice` question has exactly one choice with `correct: true`.

## Warnings (non-blocking)
- Fewer than 4 questions, or fewer than 3 different kinds among them.
- No `pick` question (the learner never practises when to choose which).
- An option that is never the right answer of any `pick` question or
  `whenToChoose` entry.
- Every dimension is `alike`, or none of the cells has a `mark`.
- A dimension mixes feature marks (`yes`/`partly`/`no`) with degree marks
  (`low`/`medium`/`high`).
- A `sort` question whose statements all have the same answer (nothing to
  discriminate).
- No `similarities` and no `differences`.

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
