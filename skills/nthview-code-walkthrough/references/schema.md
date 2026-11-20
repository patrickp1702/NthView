# Code Walkthrough data schema — schemaVersion 1

## Overview
The data describes a guided reading of 1–4 short code snippets: an ordered
list of steps, each focusing a range of lines with a note, optional values
to trace and optional checks the learner answers. The learner can step
through, read the whole code, or answer every check from one list, in any
order; an optional opening prediction and wrap-up checks frame the tour.

Text fields marked *inline* accept `**bold**` and `` `code` ``; step notes
also accept `[[step-id]]`, which becomes a link to that step. Nothing else
is interpreted. Code is shown as written, character for character.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Page heading |
| `subtitle` | string | no | ≤200 chars | One line under the title |
| `intro` | string[] | no | 0–4 items, each 1–700 chars, inline | Overview paragraphs: what the code is and why it matters |
| `goal` | string | no | ≤300 chars | What the learner will be able to explain afterwards |
| `opening` | Check | no | any kind, no `ask` | An ungraded prediction on the overview screen, before the first step (PRIMM "Predict") |
| `snippets` | Snippet[] | yes | 1–4 items, unique `id` | The code being read |
| `steps` | Step[] | yes | 1–60 items, unique `id` | The tour, in order |
| `summary` | Summary | yes | see below | The wrap-up screen |
| `sources` | Source[] | no | 0–8 items | Where the code and facts come from, listed on the wrap-up |

## Snippet object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, ≤40 chars | Referenced by steps and checks |
| `title` | string | no | ≤80 chars | Short label, e.g. "Before the fix"; names the snippet in tabs |
| `path` | string | no | ≤160 chars | File path shown above the code |
| `lang` | string | yes | one of `c`, `cpp`, `csharp`, `java`, `kotlin`, `swift`, `go`, `rust`, `js`, `ts`, `python`, `ruby`, `php`, `shell`, `sql`, `html`, `css`, `json`, `yaml`, `text` | Drives the light highlighting (`text`: none) |
| `code` | string | yes | 1–12000 chars, at most 200 lines, each ≤160 chars | The code, verbatim, with `\n` line breaks; tabs are kept |
| `startLine` | integer | no | ≥1, default 1 | Number of the first line, so numbers match the original file |
| `caption` | string | no | ≤300 chars | Where it comes from and what was left out |

Line numbers everywhere in the data are the **displayed** numbers:
`startLine` for the first line of `code`, then one more per line.

## Step object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, ≤40 chars | Stable key and link target |
| `snippet` | string | yes when there are 2+ snippets | a `snippets[].id` | The snippet this step reads; defaults to the only snippet |
| `lines` | [integer, integer] | yes | `[first, last]`, first ≤ last, inside the snippet | Lines in focus: highlighted, others dimmed |
| `focus` | Focus[] | no | 0–6 items | Exact pieces of text to outline inside the focus lines |
| `subgoal` | string | no | ≤60 chars | Label of the group this step belongs to; consecutive steps with the same label form one group |
| `title` | string | yes | 1–80 chars | Short title, shown in the step list |
| `note` | string[] | yes | 1–5 items, each 1–800 chars, inline, `[[step-id]]` links | The explanation |
| `watch` | Watch[] | no | 0–8 items | Values at this step, a small trace table |
| `checks` | Check[] | no | 0–4 items, at most one with `ask: "before"` | Questions on this step |

## Focus object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `line` | integer | yes | a line of the step's snippet | Line holding the text |
| `text` | string | yes | 1–160 chars, must occur on that line | Exact substring to outline (first occurrence) |

## Watch object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–40 chars | Variable or expression, shown in monospace |
| `value` | string | yes | 1–80 chars | Its value at this step |
| `note` | string | no | ≤160 chars | Where it came from or why it matters |

## Check object
Fields shared by every kind:

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, ≤40 chars, unique across all checks | Stable key |
| `kind` | string | yes | `choice`, `spot`, `predict`, `fill` or `order` | Question type (below) |
| `prompt` | string | yes | 1–300 chars, inline | The question |
| `ask` | string | no | `before` or `after` (default); steps only | `before`: asked before the note is shown (predict, then read); the learner may skip it |
| `hint` | string | no | ≤300 chars, inline | Shown after a first wrong answer |
| `explain` | string | yes | 1–800 chars, inline | Shown once solved or revealed |

Every check can be retried until right; "Show the answer" appears after a
first wrong try.

### `choice`: pick one option

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `options` | object[] | yes | 2–6 items, exactly one `correct: true` | Shown in a fixed shuffled order |
| `options[].text` | string | yes | 1–200 chars | The option |
| `options[].correct` | boolean | no | default `false` | The right option |
| `options[].why` | string | no | ≤400 chars | Why it is right or wrong, shown when picked |

### `spot`: tap the line

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `snippet` | string | no | a `snippets[].id`; required on `opening` and `summary.checks` when there are 2+ snippets | Defaults to the step's snippet (or the only one) |
| `lines` | [integer, integer] | no | inside the snippet | Lines offered; default the whole snippet |
| `answer` | integer[] | yes | 1–8 line numbers inside `lines` | The right line(s) |
| `select` | string | no | `one` (default) or `all` | `one`: tapping any answer line solves it. `all`: the learner selects every answer line, then checks (e.g. "tap every line that uses x", "which lines run?") |
| `miss` | object[] | no | 0–12 items `{ line, text }`, `line` inside `lines` and not an answer, `text` 1–300 chars | Feedback for a tempting wrong line |

### `predict`: type a value or output

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `answer` | string | yes | 1–80 chars | The expected answer, shown when revealed |
| `accept` | string[] | no | 0–8 items, each 1–80 chars | Other accepted answers |
| `caseSensitive` | boolean | no | default `false` | Compare case |

Answers are compared after trimming, collapsing spaces, dropping thousands
separators (`16,384` = `16 384` = `16384`) and, unless `caseSensitive`,
ignoring case.

### `fill`: complete the code (a faded Parsons line)

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `code` | string | yes | 1–1200 chars, 1–8 lines, each ≤160 chars | The code with nothing removed |
| `blanks` | object[] | yes | 1–4 items | Pieces of `code` to blank out, in reading order |
| `blanks[].text` | string | yes | 1–60 chars, one line | The exact text removed; the first occurrence after the previous blank |
| `blanks[].options` | string[] | no | 2–6 distinct items, must include `text` | Offered as a drop-down (best on phones); without it the learner types |
| `blanks[].accept` | string[] | no | 0–6 items, each 1–60 chars | Other accepted answers, compared exactly after trimming |

### `order`: arrange the lines (a Parsons problem)

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `lines` | string[] | yes | 3–7 items, each 1–160 chars | The lines in the right order; shown shuffled |
| `distractors` | object[] | no | 0–2 items | Near-miss lines that do not belong |
| `distractors[].text` | string | yes | 1–160 chars, not equal to a line | The near-miss |
| `distractors[].pairedWith` | integer | yes | index into `lines`, one distractor per line | The line it imitates; the two are shown side by side as "pick one of these two" |
| `distractors[].why` | string | yes | 1–300 chars | Why it is wrong, shown if it is used |

## Summary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤80 chars, default "What you have learned" | Wrap-up heading |
| `points` | string[] | yes | 1–8 items, each 1–300 chars, inline | The takeaways |
| `closing` | string | no | ≤700 chars, inline | A closing paragraph |
| `checks` | Check[] | no | 0–3 items, no `ask` | "Explain it overall" questions on the wrap-up |

## Source object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `label` | string | yes | 1–160 chars | Link text |
| `href` | string | yes | `http://` or `https://` URL, ≤400 chars | Opens in a new tab |
| `note` | string | no | ≤200 chars | Shown after the link |

## Cross-field rules
- `snippets[].id`, `steps[].id` and check ids (across `opening`, every
  step and `summary.checks`) are each unique.
- `steps[].snippet` names a snippet; it may be omitted only when there is
  exactly one snippet.
- `steps[].lines`, `focus[].line`, spot `lines`, `answer` and `miss[].line`
  lie within their snippet's displayed line numbers; spot `answer` and
  `miss[].line` lie within the spot's `lines`; a `miss[].line` is never an
  answer line.
- `focus[].text` occurs on `focus[].line`.
- Every `[[step-id]]` in a note names a step.
- `choice` has exactly one correct option.
- `fill`: each `blanks[].text` occurs in `code` after the previous blank and
  does not span lines; `options`, when given, include `text`.
- `order`: no distractor equals a line; every distractor has a
  `pairedWith`, and no two distractors pair with the same line.
- At most one check per step has `ask: "before"`; `opening` and
  `summary.checks` carry no `ask`.
- A spot check on `opening` or `summary.checks` names its `snippet` when
  there are two or more snippets.

## Warnings (non-blocking)
- A code line wider than 80 columns (tabs count as 4).
- A step whose `lines` cover more than 15 lines.
- A `focus[].line` outside the step's `lines`.
- A `subgoal` longer than 48 characters, or more than 8 subgoal groups.
- Fewer than 3 steps, or fewer than 3 checks in total.
- Six or more checks that use fewer than 3 kinds.
- A wrong `choice` option without `why`; two options with the same text.
- A typed `fill` blank (no `options`) longer than 24 characters.
- Two `order` lines with the same text (either order is then accepted).

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
