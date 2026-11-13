# Mechanism data schema — schemaVersion 1

## Overview
The data describes a mechanism: named state `variables` that a list of `rules`
updates once per clock tick, `events` that fire at set times or when a
condition holds, reader-tunable `parameters`, and `scenarios` that preset them.
`sections` are chapters of a scroll-driven story around live `figures` and a 3D
`stage`; all share one clock, and scrolling itself moves it: step cards jump the
clock to their moment, pinned chapters run it as the reader scrolls, and a
bench chapter hands over every knob.

The whole run is computed from tick 0 to the `horizon` whenever a scenario or a
parameter changes, so every tick is exact, including when the reader scrubs
backwards. Nothing is random: `noise(x)` is a seeded hash.

### Text mark-up
Fields marked **rich** accept:

- `**bold**` and `` `code` ``
- `((term))` or `((shown text|term))`: a glossary term the reader can tap
- `{id}` or `{id|format}`: the value of a variable or parameter at the cursor,
  updating as the clock moves; `{t}` is the cursor's time. A bare `{id}` uses
  that variable's or parameter's own format and unit.

Nothing else is interpreted. Character limits count JavaScript string length.

### Expressions
`initial`, rule `expr` and `when`, event `when` and `set` values, and
`check.expect.test` are expressions: a string such as `"min(bucketSize,
tokens + refillRate)"`, or a plain number.

- Numbers, identifiers, `+ - * / %`, comparisons `== != < <= > >=`, `&& || !`,
  unary `-`, parentheses. Comparisons and logic give `1` or `0`; `==` and `!=`
  ignore differences below `1e-9`. Division or `%` by zero gives `0`.
- Functions: `min(a, …)`, `max(a, …)` (1–8 arguments), `abs`, `sqrt`,
  `pow(a, b)`, `exp`, `log` (natural), `floor`, `ceil`, `round`,
  `clamp(x, lo, hi)`, `if(condition, then, else)` and `noise(x)`, a
  deterministic number from 0 to 1 for each value of `x` (seeded by `seed`),
  for example `noise(t) < 0.1` for "one tick in ten, irregularly".
- The constant `pi`. Any other result that is not a finite number is used and
  shown as `0`; the validator warns where that happens.

Identifiers are parameter ids, variable ids, event ids and `t`, the tick being
computed (0 for initial values). Which ones a field may use is in its table.

### The tick pipeline
At tick 0 every variable takes its `initial` value, in list order, clamped to
its `min` and `max`. Then for each tick `t` from 1 to the horizon:

1. **Events**, root events first and then the scenario's, in list order. An
   event fires if `t` is in its `at`, matches its `every`, or its `when` is
   true on the state so far (the end of the previous tick, plus the `set` of
   any event that fired before it this tick). A firing event sets its id to
   `1` for this tick (every other event id is `0`), leaves a marker on the
   charts and applies its `set` assignments in the order written.
2. **Rules**, in list order. A rule whose `when` is true (or absent) assigns
   `target = expr`, then clamps to the target's `min` and `max`. A rule sees
   every value as updated so far this tick: a variable whose own rule comes
   later still holds its previous tick's value.
3. The values of every variable are stored for tick `t`.

### Number formats
`format` fields take one of:

| Format | Shows | Example |
| :- | :- | :- |
| `number` (default) | Grouped, two significant decimals below 10 | `0.83`, `12.5`, `1,234` |
| `int` | Rounded, grouped | `1,234` |
| `dp1`, `dp2` | Fixed one or two decimals | `9.5`, `0.25` |
| `percent` | × 100 with a `%`, decimals as needed | `0.2%`, `13%`, `25.1%` |
| `duration` | The value read in clock units | `1 h 15 min` (minute clock) |
| `bytes` | Bytes with binary prefixes | `1.5 KiB`, `20 MiB` |
| `compact` | Thousands as k, M, B | `12.3k` |
| `plain` | Up to four significant digits, no grouping | `1234`, `0.0021` |

`unit` (≤16 chars) follows the number, with a space when it starts with a
letter. `duration` ignores `unit`. On a `request`, `round` or `step` clock a
duration reads as a count, for example `12 requests`.

## External libraries
three.js r128 from cdnjs (declared in `NthView.libs`) draws the stage. The file
needs internet access the first time it opens; without three.js the page shows
the standard error panel. Without WebGL the stage is left out and everything
else works. Every chart is inline SVG drawn by the view's own code, with system
fonts.

### The stage
A fixed 3D scene behind the page: one pillar per stage variable, its height the
value at the cursor as a share of the largest value it reaches in any scenario
(or of its `max`). Every rule that reads one stage variable to set another is an
arc between them; when the rule changes its result on a tick, a pulse runs along
the arc, in rule order. An event that fires sends a ring out from the pillars it
sets. The chapter on screen lights its `focus` variables (default: the
variables its figures show) and dims the rest. Beside the hero the stage is
large and labelled; behind step cards it recedes; in a pinned chapter it sits
under the clock.

### How chapters drive the clock
- A chapter with `steps` shows them as cards beside a sticky panel of its
  figures. When a card reaches the middle of the screen it becomes active and
  the clock runs (eased, through every tick in between) to its `at`, in its
  `scenario` and `window` when given.
- A chapter with `scrub` is pinned: while it is on screen the scroll position
  maps linearly to the ticks from `from` to `to`, a large readout shows the
  time, and the latest `marks` text whose `at` has passed is shown.
- A chapter with `bench: true` shows its `controls` (up to 16, default every
  parameter) beside its figures, with a play button.
- Any other chapter shows its figures in a grid below the prose.

The dock at the bottom always offers play, scrub, speed, window, scenario,
event jumps and the tune drawer.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–120 chars | Page heading and page title |
| `subtitle` | string | no | ≤240 chars | One line under the heading |
| `kicker` | string | no | ≤40 chars, default "Mechanism" | Small label above the heading |
| `theme` | string | no | one of `graphite`, `paper`, `blueprint`, `terminal`, `sand`, `aurora` | Visual theme, each with a light and a dark design; default derived from the title |
| `seed` | integer | no | 0–2147483647, default `1` | Seeds `noise(x)` |
| `lead` | string[] | yes | 1–4 items, each 1–700 chars; **rich** | The opening paragraphs |
| `clock` | object | yes | see Clock | Tick unit, horizon, speeds and windows |
| `parameters` | array | no | 0–16 Parameter objects | Knobs the reader can turn |
| `variables` | array | yes | 1–24 Variable objects | The state, one stored series each |
| `rules` | array | yes | 1–48 Rule objects | The per-tick updates, in order |
| `events` | array | no | 0–24 Event objects | Events in every scenario |
| `scenarios` | array | yes | 1–6 Scenario objects | Tabs that preset parameters and add events; the first is shown first |
| `stage` | object | no | see Stage | Which variables stand on the 3D stage |
| `sections` | array | yes | 1–16 Section objects, at most 40 figures in all | The chapters, in reading order |
| `glossary` | array | no | 1–40 Glossary objects | Terms marked with `((term))` |
| `closing` | object | no | see Closing | The end of the essay |

### Themes

| Theme | Light design | Dark design | Suits |
| :- | :- | :- | :- |
| `graphite` | Cool grey paper, indigo accent | Near-black slate, periwinkle accent | Security, engineering, operations |
| `paper` | Warm cream, serif headings, ink-blue accent | Dark sepia, serif headings, amber accent | Essays, policy, economics |
| `blueprint` | Pale blue with a drafting grid, mono headings | Deep navy with a faint grid | Networks, protocols, systems |
| `terminal` | Light phosphor grey, green accent, mono headings | Black-green console, green accent | Infrastructure, attacks, logs |
| `sand` | Warm beige, terracotta accent | Dark umber, apricot accent | Biology, economics, everyday life |
| `aurora` | Pale ice, teal and violet accents | Deep night blue, teal and violet glow | Physics, data, abstract models |

### Colours
Any `color` field takes one series hue: `blue`, `orange`, `teal`, `pink`,
`violet`, `amber`, `green`, `red` or `grey`. Each has a light-scheme and a
dark-scheme value of at least 3:1 against the chart background, ordered
so the first six stay distinguishable with the common colour-vision
deficiencies. A series without a colour takes its variable's `color`, or the
next hue in that order.

## Clock object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `unit` | string | yes | one of `second`, `minute`, `hour`, `day`, `week`, `request`, `round`, `step` | What one tick is |
| `horizon` | integer | yes | 10–5000 | Ticks simulated after tick 0 |
| `label` | string | no | ≤40 chars | Shown after the time, e.g. "since midnight" |
| `start` | integer | no | 0 to `horizon`, default 0 | Cursor position on first open |
| `speeds` | number[] | no | 1–6 items, each 0.1–5000 ticks per second, increasing; default about 120 s, 30 s and 10 s for the whole horizon | The speed choices while playing |
| `speed` | integer | no | index into `speeds`, default 1 (or 0 with one speed) | Speed on first open |
| `windows` | array | no | 1–6 Window objects | Zoom presets for every time axis; "All" is always added last |
| `window` | integer | no | index into `windows`, or its length for "All"; default "All" | Window on first open |

Window: `label` (string, 1–16 chars, required), `ticks` (integer, 5 to
`horizon`, required). A window shorter than the horizon pages along with the
cursor while the clock plays.

## Parameter object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | 1–24 chars, camelCase `^[a-z][a-zA-Z0-9]*$`, unique among parameters, variables and events, not a function name, `t` or `pi` | Used in expressions and `controls` |
| `label` | string | yes | 1–40 chars | Shown on the control |
| `description` | string | no | ≤200 chars | Help under the control |
| `min` | number | yes | finite | Lowest value |
| `max` | number | yes | greater than `min` | Highest value |
| `default` | number | yes | `min` to `max` | Value unless a scenario sets it |
| `step` | number | no | > 0 and ≤ `max − min`; default (max − min)/100 | Slider step |
| `control` | string | no | `slider` (default), `toggle`, `choice` | The widget |
| `options` | array | `choice` only, required | 2–6 of `{label` (1–20 chars), `value` (number, `min` to `max`)`}` | The preset buttons |
| `format` | string | no | a number format | How the value is shown |
| `unit` | string | no | ≤16 chars | After the number |

A `toggle` needs `min` 0 and `max` 1: off is 0, on is 1.

## Variable object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | as Parameter `id` | Used in expressions, figures and text |
| `label` | string | yes | 1–40 chars | Legends, tiles, the calculation table |
| `description` | string | no | ≤200 chars | Shown with the variable in the calculation table |
| `initial` | expression | yes | may use parameters and variables listed before it | Value at tick 0 |
| `min` | number | no | finite | Values are clamped up to it |
| `max` | number | no | greater than `min` | Values are clamped down to it |
| `format` | string | no | a number format | How values are shown |
| `unit` | string | no | ≤16 chars | After the number |
| `color` | string | no | a series hue | Its colour in every figure |

## Rule object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `target` | string | yes | a variable id | The variable this rule assigns |
| `expr` | expression | yes | may use parameters, variables, event ids and `t` | The new value |
| `when` | expression | no | same identifiers as `expr` | The rule applies only on ticks where this is true |
| `label` | string | no | ≤60 chars | Plain-words name, shown in the calculation table |
| `note` | string | no | ≤240 chars | Why the rule is what it is |

A variable may have several rules; they run in list order.

## Event object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | as Parameter `id`; a scenario's event may reuse the id of another scenario's event, but not a root event's | Equals 1 in rules on the ticks it fires |
| `label` | string | yes | 1–40 chars | Marker and timeline label |
| `note` | string | no | ≤200 chars | Shown on the event timeline |
| `at` | integer or integer[] | one of `at`, `every`, `when` | each 1 to `horizon`; 1–200 ticks | Fires on these ticks |
| `every` | object | one of `at`, `every`, `when` | `period` (integer, 1 to `horizon`, required), `from` (integer, 1 to `horizon`, default `period`), `to` (integer, `from` to `horizon`, default `horizon`) | Fires on `from`, `from + period`, … up to `to` |
| `when` | expression | one of `at`, `every`, `when` | may use parameters, variables and `t` | Fires on every tick where it is true |
| `once` | boolean | no | only with `when`; default `false` | Fire the first time only |
| `set` | object | no | 1–8 keys, each a variable id; values expressions using parameters, variables and `t` | Assignments applied when it fires, in the order written, each clamped |
| `color` | string | no | a series hue | Marker colour |

## Scenario object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Stable key |
| `label` | string | yes | 1–24 chars | Tab label |
| `description` | string | no | ≤240 chars | Shown under the tabs |
| `parameters` | object | no | keys are parameter ids, values numbers within that parameter's range | Values this scenario starts from; others take their `default` |
| `events` | array | no | 0–24 Event objects | Events that happen only in this scenario |

The reader's parameter changes are kept per scenario; "Reset" returns a
scenario to its own values.

## Stage object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `variables` | string[] | no | 2–12 distinct variable ids; default the first 10 variables that have a rule | The pillars, in ring order |
| `title` | string | no | ≤60 chars | Name of the stage (for the reader's orientation) |

## Section object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Stable key |
| `kicker` | string | no | ≤40 chars | Small label above the title |
| `title` | string | yes | 1–100 chars | Section heading |
| `body` | string[] | yes | 1–6 items, each 1–900 chars; **rich** | The prose |
| `controls` | string[] | no | 1–6 parameter ids (1–16 with `bench`) | Controls shown with this chapter |
| `figures` | array | no | 1–4 Figure objects | Live figures: the sticky panel, the pinned panel, the bench or a grid |
| `focus` | string[] | no | 1–12 distinct variable ids | Stage pillars lit for this chapter; default the variables its figures show |
| `steps` | array | no | 1–10 Step objects; not with `scrub` or `bench` | Cards that move the clock as they scroll into view |
| `scrub` | object | no | see Scrub; not with `steps` or `bench` | Pin the chapter and let scrolling run the clock |
| `bench` | boolean | no | default `false`; not with `steps` or `scrub` | Free play: controls beside the figures |
| `goto` | object | no | `label` (1–40 chars, required), `tick` (integer, 0 to `horizon`, required), `scenario` (a scenario id, optional), `window` (a `clock.windows` label or `"All"`, optional) | A "Show me" button that moves the clock, and optionally the scenario and the time window |
| `check` | object | no | see Check | A prediction asked before the section's figures are shown |

## Step object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `title` | string | yes | 1–80 chars | Card heading |
| `text` | string | yes | 1–600 chars; **rich** | Card text; placeholders show values at the step's moment |
| `at` | integer | yes | 0 to `horizon` | The tick the clock runs to |
| `scenario` | string | no | a scenario id | Switch to this scenario first |
| `window` | string | no | a `clock.windows` label or `"All"` | Switch the time window first |
| `focus` | string[] | no | 1–12 distinct variable ids | Stage pillars lit for this card; default the chapter's |

## Scrub object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `from` | integer | yes | 0 to `horizon` | Tick at the top of the pinned stretch |
| `to` | integer | yes | greater than `from`, at most `horizon` | Tick at the bottom |
| `scenario` | string | no | a scenario id | Scenario while pinned |
| `window` | string | no | a `clock.windows` label or `"All"` | Window while pinned |
| `screens` | integer | no | 2–10, default 4 | How many screen heights of scrolling the stretch takes |
| `marks` | array | no | 1–12 of `{at` (integer, `from` to `to`, increasing), `text` (1–300 chars, **rich**)`}` | Captions; the latest one whose `at` has passed is shown |

## Check object
The section's figures are veiled until the reader picks an option or skips.
Nothing is scored and nothing is blocked: "Skip and show" is always there.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | yes | 1–240 chars | The question |
| `options` | array | yes | 2–5 of `{text` (1–160 chars, required), `correct` (boolean, exactly one `true`), `why` (1–400 chars, **rich**, required)`}` | The choices |
| `reveal` | string | no | 1–500 chars; **rich** | Shown after the answer, with live values |
| `expect` | object | no | `scenario` (scenario id; default the section's `goto` scenario, else the first), `at` (integer tick, 0 to `horizon`, required), `test` (expression over parameters, variables and `t`, required) | A content check: the validator runs that scenario with its own parameters and rejects the file if `test` is false at tick `at` |

## Figure object
Every figure has `kind` and these optional fields, plus the fields of its kind.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kind` | string | yes | one of `line`, `step`, `area`, `bar`, `stacked`, `gauge`, `tile`, `events`, `calc`, `flow`, `state`, `compare`, `heatmap` | What to draw |
| `title` | string | no | ≤80 chars | Card heading |
| `caption` | string | no | 1–300 chars; **rich** | Under the figure |
| `format` | string | no | a number format | Axis and readout format; default the first variable's |
| `unit` | string | no | ≤16 chars | Axis and readout unit; default the first variable's |

Every time-based figure (all but `bar`, `gauge`, `tile` and `calc`) draws
the current window with time ticks and a cursor, shows values under the
pointer on hover, and moves the clock on click or tap.

### `line`, `step`, `area` — series over time

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `series` | array | yes | 1–6 of `{var` (variable id, required), `label` (≤30 chars), `color` (hue), `dashed` (boolean)`}` | One line each; the legend shows each value at the cursor |
| `yMin`, `yMax` | number | no | `yMax` > `yMin` | Vertical range; default 0 (or the lowest value) to a round number above the highest value over the whole horizon of the scenario, so the scale never jumps while playing |
| `yLabel` | string | no | ≤30 chars | Vertical axis title |
| `thresholds` | array | no | 1–3 of `{value` (number or parameter id, required), `label` (1–30 chars, required), `color` (hue)`}` | Dashed horizontal reference lines |
| `markers` | boolean | no | default `true` | Event markers along the top |
| `stacked` | boolean | `area` only | default `false` | Stack the areas instead of overlapping them |

`step` holds each value for the whole tick; `line` joins ticks directly.

### `bar` — current values

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `bars` | array | yes | 1–12 of `{var` (variable id, required), `label` (≤30 chars), `color` (hue)`}` | One horizontal bar each, at the cursor |
| `max` | number | no | > 0 | Scale end; default a round number above the highest value any bar reaches in the scenario |

### `stacked` — stacked bars over time

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `series` | array | yes | 2–6, as in `line` | The stacked parts |
| `bucket` | integer | no | 1 to `horizon`; default a round span giving about 24 bars in the window | Ticks per bar |
| `agg` | string | no | `sum` (default), `mean`, `last` | How a bucket's ticks combine |
| `yLabel` | string | no | ≤30 chars | Vertical axis title |

### `gauge` — a value against its range

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `var` | string | yes | a variable id | The value shown |
| `min` | number | no | default the variable's `min`, else 0 | Left end |
| `max` | number | when the variable has no `max` | greater than the minimum | Right end |
| `label` | string | no | ≤30 chars | Under the meter |
| `zones` | array | no | 1–4 of `{to` (number or parameter id; numbers increasing), `color` (hue, required), `label` (1–20 chars, required)`}` | Coloured bands; a zone runs from the previous `to` to its own, the last to `max`. The current zone is named |

### `tile` — numbers with a delta

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `items` | array | yes | 1–4 of `{var` (variable id, required), `label` (≤30 chars), `format`, `unit`, `color` (hue), `delta` (`start` (default), `tick` or `none`), `better` (`up` or `down`)`}` | Each tile shows the value at the cursor and its change since tick 0 or since the previous tick; `better` colours the change |
| `sparkline` | boolean | no | default `true` | A small line of the window under each number |

### `events` — event timeline

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `events` | string[] | no | 1–12 event ids | Rows to show; default every event of the current scenario |

One row per event with a marker each time it fired in the window, its count,
and the last firing before the cursor. Clicking a marker moves the clock.

### `calc` — this tick's calculation

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `targets` | string[] | no | 1–24 variable ids, each with at least one rule | Rules to show; default every rule |
| `showEvents` | boolean | no | default `true` | List the events that fired on this tick first |

For the tick at the cursor, one row per rule: its label, `target = expr`,
every input it read with its value, and the result with its change. A rule
whose `when` was false is shown as skipped.

### `flow` — the calculation as a graph

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `targets` | string[] | no | 1–16 variable ids, each with at least one rule; default every rule | The rules to draw |

Every value a shown rule reads is a box on the left (parameters and events
dashed); each rule's target sits to the right of the values computed before it
in the same tick. Each box shows its value at the cursor. When a rule changes its
result, its box and its incoming lines light up, and on a forward tick a pulse
runs along each line.

### `state` — chips that flash

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `vars` | string[] | yes | 1–16 distinct variable ids | One chip each: label and value at the cursor; a chip flashes when its value changes |

### `compare` — small multiples by scenario

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `var` | string | yes | a variable id | The value compared |
| `scenarios` | string[] | no | 2–6 scenario ids; default all (the document then needs two) | The panels |
| `yMin`, `yMax` | number | no | | Shared vertical range; default 0 to a round number above every panel's highest value |

Each scenario runs with its own parameters, including the reader's changes to it.

### `heatmap` — scenario by time

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `var` | string | yes | a variable id | The value shown |
| `scenarios` | string[] | no | 1–6 scenario ids; default all | One row each |
| `buckets` | integer | no | 6–96, default 48 | Columns across the window |
| `agg` | string | no | `mean` (default), `max`, `last` | How a column's ticks combine |
| `max` | number | no | | Value drawn at full strength; default the highest cell |

## Glossary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–40 chars, unique ignoring case | What `((term))` refers to |
| `definition` | string | yes | 1–300 chars | Shown in a pop-over and the glossary drawer |

## Closing object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤80 chars, default "What the clock showed" | |
| `body` | string[] | yes | 1–4 items, each 1–700 chars; **rich** | The mechanism restated |
| `takeaways` | string[] | no | 1–8 items, each 1–200 chars; **rich** | Short list to keep |

## Cross-field rules
- Parameter, variable and event ids share one namespace; ids are unique in it
  (scenario events may reuse ids across scenarios), and none is a function
  name, `t` or `pi`. Scenario and section ids are unique.
- Every expression parses, and every identifier in it is one the field
  allows: a variable's `initial` may use only parameters and variables listed
  before it; event `when` and `set` may not use event ids.
- `rules[i].target`, event `set` keys and every figure `var` are variable
  ids; `controls` and threshold or zone `to` strings are parameter ids;
  `scenarios[i].parameters` keys are parameter ids with values in range;
  figure `scenarios`, `goto.scenario` and `expect.scenario` are scenario
  ids; `goto.window` is a window label or `All`; `events` figure ids are event ids; `calc.targets` have rules.
- An event has exactly one of `at`, `every`, `when`; ticks lie from 1 to the
  horizon; `once` only with `when`.
- `clock.speeds` increase; `clock.speed` and `clock.window` index into them.
- A parameter's `default` and every `choice` value lie in its range; a
  `toggle` has range 0 to 1; `options` only on `choice`.
- `gauge.max` is given when its variable has no `max`; zone ends increase.
- `compare` without `scenarios` needs at least two scenarios.
- Every `((term))` is a glossary term; every `{id}` is a variable, a
  parameter or `t`, and its `|format` a number format.
- A check has exactly one correct option; its `expect.test` must be true
  when the validator runs the scenario.
- `stage.variables`, `focus`, step `focus` and `state.vars` are distinct
  variable ids; `flow.targets` have rules.
- A chapter has at most one of `steps`, `scrub` and `bench`. Step `at` and
  scrub `from` and `to` lie within the horizon, `to` after `from`; mark `at`
  values increase and lie from `from` to `to`; step and scrub `scenario` and
  `window` name a scenario and a window.

## Warnings (non-blocking)
- Only one scenario.
- Every figure is the same kind.
- A variable that no rule or event changes.
- A parameter that no expression uses.
- An event that never fires within the horizon (in any scenario, for a root
  event; in its own scenario, for a scenario event).
- An expression that is not a finite number in some scenario (shown as 0).
- A glossary term never marked in the text.

## Complete example
```json
{
  "schemaVersion": 1,
  "title": "How Login Defences Shape a Password Attack",
  "subtitle": "A token bucket, an account lockout with backoff, and what a patient attacker does about them, minute by minute over one day.",
  "kicker": "Mechanism · identity security",
  "theme": "graphite",
  "seed": 7,
  "lead": [
    "Every sign-in page sits behind two classic defences: a ((token bucket)) that limits how fast one IP address may try, and a ((lockout)) that freezes an account after too many failures. Both are counters that fill and drain over time, so the only honest way to understand them is to watch them run.",
    "Scroll and the story drives the clock: cards move it to the moment they describe, pinned chapters run it as you scroll, and the dock at the bottom lets you play, scrub and switch scenarios at any time. Every number is recomputed from minute 0 by the same short list of rules. Values are ((expected value))s for a typical account, and the numbers are illustrative."
  ],
  "clock": {
    "unit": "minute",
    "horizon": 1440,
    "label": "since midnight",
    "speeds": [
      5,
      30,
      120,
      480
    ],
    "speed": 1,
    "windows": [
      {
        "label": "1 h",
        "ticks": 60
      },
      {
        "label": "6 h",
        "ticks": 360
      }
    ],
    "window": 2
  },
  "parameters": [
    {
      "id": "attackRate",
      "label": "Attempts per IP per minute",
      "min": 0,
      "max": 60,
      "default": 0,
      "step": 0.5,
      "unit": "/min",
      "description": "How fast each attacking address would like to guess."
    },
    {
      "id": "attackIps",
      "label": "Attacking IP addresses",
      "min": 1,
      "max": 500,
      "default": 1,
      "step": 1,
      "format": "int"
    },
    {
      "id": "accounts",
      "label": "Accounts targeted",
      "min": 1,
      "max": 2000,
      "default": 1,
      "step": 1,
      "format": "int",
      "description": "The attacker spreads guesses evenly over these accounts."
    },
    {
      "id": "bucketSize",
      "label": "Burst allowance per IP",
      "min": 1,
      "max": 60,
      "default": 10,
      "step": 1,
      "unit": "tokens",
      "format": "int"
    },
    {
      "id": "refillRate",
      "label": "Refill per IP",
      "min": 0.1,
      "max": 10,
      "default": 1,
      "step": 0.1,
      "unit": "/min"
    },
    {
      "id": "lockThreshold",
      "label": "Failures before lockout",
      "min": 3,
      "max": 20,
      "default": 5,
      "step": 1,
      "format": "int"
    },
    {
      "id": "failWindow",
      "label": "Failure memory",
      "min": 5,
      "max": 120,
      "default": 30,
      "step": 5,
      "format": "duration",
      "description": "The counter forgets the threshold's worth of failures over this long."
    },
    {
      "id": "baseLockout",
      "label": "First lockout",
      "min": 1,
      "max": 60,
      "default": 15,
      "step": 1,
      "format": "duration"
    },
    {
      "id": "backoff",
      "label": "Backoff",
      "min": 1,
      "max": 4,
      "default": 2,
      "control": "choice",
      "options": [
        {
          "label": "None",
          "value": 1
        },
        {
          "label": "×2",
          "value": 2
        },
        {
          "label": "×3",
          "value": 3
        },
        {
          "label": "×4",
          "value": 4
        }
      ]
    },
    {
      "id": "maxLockout",
      "label": "Longest lockout",
      "min": 15,
      "max": 1440,
      "default": 240,
      "format": "duration",
      "control": "choice",
      "options": [
        {
          "label": "1 h",
          "value": 60
        },
        {
          "label": "4 h",
          "value": 240
        },
        {
          "label": "24 h",
          "value": 1440
        }
      ]
    },
    {
      "id": "pGuess",
      "label": "Chance one guess is right",
      "min": 0.0001,
      "max": 0.01,
      "default": 0.002,
      "step": 0.0001,
      "format": "percent"
    },
    {
      "id": "screening",
      "label": "Block breached passwords",
      "min": 0,
      "max": 1,
      "default": 0,
      "step": 1,
      "control": "toggle",
      "description": "Users may not pick passwords from known breach lists, so common guesses rarely work."
    },
    {
      "id": "mfaShare",
      "label": "Accounts with MFA",
      "min": 0,
      "max": 1,
      "default": 0,
      "step": 0.05,
      "format": "percent"
    },
    {
      "id": "challenge",
      "label": "Tenant-wide challenge",
      "min": 0,
      "max": 1,
      "default": 0,
      "step": 1,
      "control": "toggle"
    },
    {
      "id": "alarmRate",
      "label": "Challenge above",
      "min": 10,
      "max": 1000,
      "default": 50,
      "step": 10,
      "unit": "fails/min",
      "format": "int"
    }
  ],
  "variables": [
    {
      "id": "tokens",
      "label": "Tokens in the bucket",
      "initial": "bucketSize",
      "min": 0,
      "format": "dp1",
      "color": "blue",
      "description": "Per attacking IP. Each attempt spends one token."
    },
    {
      "id": "allowed",
      "label": "Let through per IP",
      "initial": 0,
      "min": 0,
      "format": "dp1",
      "unit": "/min",
      "color": "teal"
    },
    {
      "id": "limited",
      "label": "Turned away by the limiter",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "grey"
    },
    {
      "id": "tenantFails",
      "label": "Failed logins, tenant",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "orange"
    },
    {
      "id": "challenged",
      "label": "Challenge active",
      "initial": 0,
      "min": 0,
      "max": 1,
      "format": "int",
      "color": "violet"
    },
    {
      "id": "passed",
      "label": "Past the challenge",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "teal"
    },
    {
      "id": "stopped",
      "label": "Stopped by the challenge",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "violet"
    },
    {
      "id": "lockLeft",
      "label": "Lockout time left",
      "initial": 0,
      "min": 0,
      "format": "duration",
      "color": "red"
    },
    {
      "id": "rejected",
      "label": "Rejected by the lockout",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "red"
    },
    {
      "id": "perAccount",
      "label": "Guesses per account",
      "initial": 0,
      "min": 0,
      "format": "dp2",
      "unit": "/min",
      "color": "amber"
    },
    {
      "id": "tested",
      "label": "Guesses tested, tenant",
      "initial": 0,
      "min": 0,
      "format": "number",
      "unit": "/min",
      "color": "amber"
    },
    {
      "id": "failures",
      "label": "Failure counter",
      "initial": 0,
      "min": 0,
      "format": "dp1",
      "color": "orange"
    },
    {
      "id": "lockouts",
      "label": "Lockouts so far",
      "initial": 0,
      "min": 0,
      "format": "int",
      "color": "red"
    },
    {
      "id": "guesses",
      "label": "Guesses tried per account",
      "initial": 0,
      "min": 0,
      "format": "number",
      "color": "pink"
    },
    {
      "id": "pFallen",
      "label": "Chance an account has fallen",
      "initial": 0,
      "min": 0,
      "max": 1,
      "format": "percent",
      "color": "pink"
    },
    {
      "id": "takeovers",
      "label": "Expected takeovers",
      "initial": 0,
      "min": 0,
      "format": "dp1",
      "color": "red"
    },
    {
      "id": "userDenied",
      "label": "Sign-ins refused to the owner",
      "initial": 0,
      "min": 0,
      "format": "int",
      "color": "amber"
    }
  ],
  "rules": [
    {
      "target": "tokens",
      "expr": "min(bucketSize, tokens + refillRate)",
      "label": "Refill the bucket",
      "note": "Tokens drip in at the refill rate and never exceed the burst allowance."
    },
    {
      "target": "allowed",
      "expr": "min(attackRate, floor(tokens))",
      "label": "Let through what tokens cover",
      "note": "One whole token per attempt; the rest waits or is refused."
    },
    {
      "target": "tokens",
      "expr": "tokens - allowed",
      "label": "Spend the tokens"
    },
    {
      "target": "limited",
      "expr": "(attackRate - allowed) * attackIps",
      "label": "Count what the limiter refused",
      "note": "Across every attacking IP."
    },
    {
      "target": "tenantFails",
      "expr": "allowed * attackIps",
      "label": "Failed logins across the tenant"
    },
    {
      "target": "challenged",
      "expr": "if(challenge && tenantFails > alarmRate, 1, 0)",
      "label": "Raise the challenge?",
      "note": "A tenant-wide signal: too many failures per minute anywhere, and every sign-in must pass a challenge."
    },
    {
      "target": "passed",
      "expr": "tenantFails * if(challenged, 0.05, 1)",
      "label": "Attempts that clear the challenge",
      "note": "Automated tools clear about 5% of challenges."
    },
    {
      "target": "stopped",
      "expr": "tenantFails - passed",
      "label": "Attempts the challenge stopped"
    },
    {
      "target": "rejected",
      "expr": "if(lockLeft > 0, passed, 0)",
      "label": "Refused while locked"
    },
    {
      "target": "perAccount",
      "expr": "if(lockLeft > 0, 0, passed / accounts)",
      "label": "Guesses that reach each account",
      "note": "Spread evenly; a locked account accepts none."
    },
    {
      "target": "tested",
      "expr": "perAccount * accounts",
      "label": "Guesses actually tested"
    },
    {
      "target": "failures",
      "expr": "max(0, failures - lockThreshold / failWindow) + perAccount",
      "label": "Leak old failures, add new ones",
      "note": "A leaky counter: it forgets the threshold's worth of failures over the failure memory."
    },
    {
      "target": "guesses",
      "expr": "guesses + perAccount",
      "label": "Add to the guesses tried"
    },
    {
      "target": "pFallen",
      "expr": "1 - pow(1 - pGuess * if(screening, 0.1, 1), guesses)",
      "label": "Chance at least one guess was right",
      "note": "Breach screening makes each common guess ten times less likely to work."
    },
    {
      "target": "takeovers",
      "expr": "accounts * pFallen * (1 - mfaShare)",
      "label": "Accounts actually taken over",
      "note": "A right password does not get past MFA."
    },
    {
      "target": "userDenied",
      "expr": "userDenied + if(lockLeft > 0, userLogin, 0)",
      "label": "Did the owner hit a locked door?"
    },
    {
      "target": "lockLeft",
      "expr": "max(0, lockLeft - 1)",
      "label": "A minute of lockout passes"
    }
  ],
  "events": [
    {
      "id": "lockout",
      "label": "Account locked",
      "when": "failures >= lockThreshold && lockLeft == 0",
      "set": {
        "lockLeft": "min(maxLockout, baseLockout * pow(backoff, lockouts))",
        "lockouts": "lockouts + 1",
        "failures": 0
      },
      "color": "red",
      "note": "Each lockout lasts the first lockout times backoff to the power of earlier lockouts, up to the longest lockout."
    },
    {
      "id": "userLogin",
      "label": "Owner signs in",
      "every": {
        "period": 120,
        "from": 30
      },
      "set": {
        "failures": "if(lockLeft > 0, failures, 0)"
      },
      "color": "green",
      "note": "The real owner signs in every two hours; a success clears the failure counter."
    },
    {
      "id": "challengeOn",
      "label": "Challenge raised",
      "when": "challenged > 0",
      "once": true,
      "color": "violet"
    }
  ],
  "scenarios": [
    {
      "id": "normal",
      "label": "Normal day",
      "description": "No attacker. The owner signs in every two hours and fumbles the password: twice before one sign-in, four times before another.",
      "events": [
        {
          "id": "typo",
          "label": "Owner mistypes",
          "at": [
            148,
            149,
            506,
            507,
            508,
            509
          ],
          "set": {
            "failures": "failures + 1"
          },
          "color": "amber"
        }
      ]
    },
    {
      "id": "brute",
      "label": "Brute force",
      "description": "One IP hammers one account at 30 guesses a minute.",
      "parameters": {
        "attackRate": 30,
        "attackIps": 1,
        "accounts": 1
      }
    },
    {
      "id": "spray",
      "label": "Password spray",
      "description": "200 IPs try one common password at a time across 1,000 accounts, slowly.",
      "parameters": {
        "attackRate": 0.5,
        "attackIps": 200,
        "accounts": 1000
      }
    },
    {
      "id": "defended",
      "label": "Spray, defended",
      "description": "The same spray against breach screening, 90% MFA and a tenant-wide challenge.",
      "parameters": {
        "attackRate": 0.5,
        "attackIps": 200,
        "accounts": 1000,
        "screening": 1,
        "mfaShare": 0.9,
        "challenge": 1
      }
    }
  ],
  "sections": [
    {
      "id": "setting",
      "kicker": "The setting",
      "title": "One sign-in page, one day, four stories",
      "body": [
        "The page you are protecting accepts a username and a password. Behind it sit counters per attacking address and per account, and every minute a short list of rules updates them. The stage behind this page shows those counters as pillars: each arc is a rule reading one counter to set another, and a pulse runs along it whenever that calculation changes something.",
        "Scroll on: each card below moves the clock to the end of the day in a different scenario. Watch the scoreboard and the pillars change."
      ],
      "focus": [
        "takeovers",
        "guesses",
        "lockouts",
        "userDenied"
      ],
      "steps": [
        {
          "title": "A normal day",
          "text": "No attacker. The owner signs in every two hours and mistypes now and then, but the failure counter forgets faster than typos add up. Nothing locks, nobody is refused.",
          "at": 1440,
          "scenario": "normal"
        },
        {
          "title": "Brute force",
          "text": "One address hammers one account at 30 guesses a minute. The account locks **{lockouts}** times and the owner is refused **{userDenied}** sign-ins, yet the attacker only got **{guesses}** guesses in.",
          "at": 1440,
          "scenario": "brute"
        },
        {
          "title": "Password spray",
          "text": "Two hundred addresses, a thousand accounts, half a guess per address per minute. No lockout ever fires, and about **{takeovers}** accounts fall by midnight.",
          "at": 1440,
          "scenario": "spray"
        },
        {
          "title": "Spray, defended",
          "text": "The same spray against breach screening, 90% MFA and a tenant-wide challenge: **{takeovers}** expected takeovers.",
          "at": 1440,
          "scenario": "defended"
        }
      ],
      "figures": [
        {
          "kind": "tile",
          "title": "End-of-day scoreboard",
          "items": [
            {
              "var": "takeovers",
              "better": "down"
            },
            {
              "var": "guesses",
              "label": "Guesses per account",
              "better": "down"
            },
            {
              "var": "lockouts",
              "better": "down"
            },
            {
              "var": "userDenied",
              "label": "Owner refused",
              "better": "down"
            }
          ]
        },
        {
          "kind": "events",
          "title": "What happened when",
          "caption": "Each row is one kind of event in the current scenario. The owner's sign-ins are green."
        }
      ]
    },
    {
      "id": "token-bucket",
      "kicker": "Defence 1",
      "title": "The limiter: a token bucket per IP",
      "body": [
        "A ((token bucket)) holds up to **{bucketSize}** for each address. Every attempt spends one token, and the bucket refills at **{refillRate}**. A full bucket lets a burst through at once; after that the address is held to the refill rate, however fast it tries."
      ],
      "controls": [
        "bucketSize",
        "refillRate",
        "attackRate"
      ],
      "focus": [
        "tokens",
        "allowed"
      ],
      "steps": [
        {
          "title": "Minute 0: a full bucket",
          "text": "Before the first attempt the bucket holds **{tokens}** tokens. Nothing has happened yet.",
          "at": 0,
          "scenario": "brute",
          "window": "1 h"
        },
        {
          "title": "Minute 1: the burst",
          "text": "The attacker asks for 30 attempts. The bucket covers **{allowed}** of them and is empty; the limiter refuses the other **{limited}**. Follow the pulses in the flow: the refill feeds the bucket, the bucket feeds what is let through.",
          "at": 1,
          "scenario": "brute",
          "window": "1 h"
        },
        {
          "title": "Minute 2 onwards: one a minute",
          "text": "Each minute the bucket refills by one token and the attacker spends it at once. From here on the address gets exactly **{allowed}**, however hard it tries.",
          "at": 5,
          "scenario": "brute",
          "window": "1 h"
        },
        {
          "title": "An hour later, nothing has changed",
          "text": "The pattern holds for the whole day: the bucket never fills again. Try a bigger burst allowance or a faster refill in the controls above and scroll back up.",
          "at": 60,
          "scenario": "brute",
          "window": "1 h"
        }
      ],
      "figures": [
        {
          "kind": "flow",
          "title": "How this minute is calculated",
          "targets": [
            "tokens",
            "allowed",
            "limited"
          ],
          "caption": "Each box is a value; each line is a rule reading it. Pulses run when a rule changes its result."
        },
        {
          "kind": "state",
          "title": "The counters right now",
          "vars": [
            "tokens",
            "allowed",
            "limited",
            "tenantFails"
          ]
        },
        {
          "kind": "step",
          "title": "Bucket and throughput, per IP",
          "series": [
            {
              "var": "tokens"
            },
            {
              "var": "allowed"
            }
          ],
          "yLabel": "tokens · attempts/min",
          "caption": "Step lines: each value holds for a whole minute. In the brute force the bucket empties in minute 1 and never refills, so the blue line sits on zero."
        }
      ]
    },
    {
      "id": "lockout",
      "kicker": "Defence 2",
      "title": "The lockout: a leaky counter with backoff",
      "body": [
        "Each account keeps a failure counter. Every wrong guess adds one; the counter also forgets, losing {lockThreshold} failures over each {failWindow|duration}, so a few typos spread over a morning never add up. When it reaches **{lockThreshold}**, the account ((locks|lockout)).",
        "The first lockout lasts {baseLockout|duration}. Each later one is multiplied by the ((exponential backoff)) factor, up to {maxLockout|duration}. Backoff is what makes a lockout expensive for a guessing machine: the waits double while the guesses do not.",
        "This chapter is pinned: **keep scrolling and the clock runs** through the brute-force morning, lockout by lockout."
      ],
      "controls": [
        "lockThreshold",
        "failWindow",
        "baseLockout",
        "backoff",
        "maxLockout"
      ],
      "focus": [
        "failures",
        "lockLeft",
        "lockouts"
      ],
      "scrub": {
        "from": 0,
        "to": 720,
        "scenario": "brute",
        "window": "All",
        "screens": 5,
        "marks": [
          {
            "at": 0,
            "text": "Midnight. The account has a clean record: the failure counter is at zero."
          },
          {
            "at": 2,
            "text": "Minute 2: ten guesses in the first burst, well over the threshold of {lockThreshold}. The first ((lockout)): {baseLockout|duration}."
          },
          {
            "at": 23,
            "text": "The account opens, five more guesses, locked again. This time for 30 minutes: ((exponential backoff)) doubles every wait."
          },
          {
            "at": 59,
            "text": "Third lockout, an hour. The attacker is now spending most of the time waiting."
          },
          {
            "at": 125,
            "text": "Fourth lockout, two hours. Each lockout costs the attacker more than the last; the guesses do not grow."
          },
          {
            "at": 251,
            "text": "From the fifth lockout on, the wait is capped at {maxLockout|duration}. The account opens for a few minutes every four hours."
          },
          {
            "at": 600,
            "text": "By mid-morning the account has been locked **{lockouts}** times for only **{guesses}** guesses."
          }
        ]
      },
      "figures": [
        {
          "kind": "gauge",
          "title": "Failure counter",
          "var": "failures",
          "min": 0,
          "max": 10,
          "label": "failures remembered",
          "zones": [
            {
              "to": "lockThreshold",
              "color": "green",
              "label": "Counting"
            },
            {
              "to": 10,
              "color": "red",
              "label": "Locks next minute"
            }
          ]
        },
        {
          "kind": "area",
          "title": "Lockout time left",
          "series": [
            {
              "var": "lockLeft"
            }
          ],
          "yLabel": "minutes",
          "caption": "Each red marker is a lockout; each ramp is one lockout running down, minute by minute."
        }
      ],
      "check": {
        "prompt": "In the brute force, with backoff ×2 and a 4-hour cap, how many times is the account locked by noon?",
        "options": [
          {
            "text": "About 36: one every 20 minutes",
            "why": "That is what happens without backoff: 15 minutes locked, 5 minutes of guessing, again and again. Set backoff to None and look."
          },
          {
            "text": "About 6: the waits double until the cap",
            "correct": true,
            "why": "15, 30, 60, 120 and then 240 minutes, again and again. Most of the morning is spent locked."
          },
          {
            "text": "Once: the account stays locked all day",
            "why": "Only a 24-hour cap would do that; a cap of 4 hours lets the account open again."
          }
        ],
        "reveal": "By noon the account has been locked **{lockouts}** times and the attacker has tried **{guesses}** guesses against it.",
        "expect": {
          "scenario": "brute",
          "at": 720,
          "test": "lockouts >= 5 && lockouts <= 7"
        }
      }
    },
    {
      "id": "where-attempts-go",
      "kicker": "The funnel",
      "title": "Where every attempt goes",
      "body": [
        "Every attempt the attacker wants to make ends in exactly one place: refused by the limiter, stopped by a challenge, refused by a locked account, or actually tested against a password. The cards switch scenarios at the same moment of the day."
      ],
      "focus": [
        "tenantFails",
        "passed",
        "perAccount"
      ],
      "steps": [
        {
          "title": "Brute force: the limiter does the work",
          "text": "Almost every attempt is refused by the limiter: **{limited}** a minute, against one that gets through.",
          "at": 600,
          "scenario": "brute"
        },
        {
          "title": "Password spray: nothing is refused",
          "text": "Each address sends half a guess a minute, well under its bucket. Every single guess is tested: **{tested}** a minute across the tenant.",
          "at": 600,
          "scenario": "spray"
        },
        {
          "title": "Spray, defended: the challenge takes over",
          "text": "The tenant-wide challenge stops **{stopped}** attempts a minute; only **{tested}** are still tested.",
          "at": 600,
          "scenario": "defended"
        }
      ],
      "figures": [
        {
          "kind": "stacked",
          "title": "Attempts per hour, by outcome",
          "series": [
            {
              "var": "limited",
              "label": "Limiter"
            },
            {
              "var": "stopped",
              "label": "Challenge"
            },
            {
              "var": "rejected",
              "label": "Lockout"
            },
            {
              "var": "tested",
              "label": "Tested"
            }
          ],
          "bucket": 60,
          "agg": "sum",
          "yLabel": "attempts per hour"
        },
        {
          "kind": "bar",
          "title": "This minute, whole tenant",
          "bars": [
            {
              "var": "limited",
              "label": "Limiter"
            },
            {
              "var": "stopped",
              "label": "Challenge"
            },
            {
              "var": "rejected",
              "label": "Lockout"
            },
            {
              "var": "tested",
              "label": "Tested"
            }
          ]
        }
      ]
    },
    {
      "id": "spray",
      "kicker": "The attacker adapts",
      "title": "Password spraying walks under both defences",
      "body": [
        "A ((password spray)) turns the problem around. Instead of many guesses against one account, it tries one common password against many accounts, from many addresses, then the next password, and so on. Each address stays under its bucket and each account sees a guess only every few minutes. Accounts targeted now: **{accounts}**; attacking addresses: **{attackIps}**."
      ],
      "controls": [
        "attackIps",
        "accounts",
        "pGuess"
      ],
      "focus": [
        "perAccount",
        "guesses",
        "pFallen",
        "takeovers"
      ],
      "steps": [
        {
          "title": "One hour in",
          "text": "Each account has seen about **{guesses}** guesses. The chance that a given account has fallen is **{pFallen}**: small, and growing.",
          "at": 60,
          "scenario": "spray"
        },
        {
          "title": "Six hours in",
          "text": "It compounds. After **{guesses}** guesses an account has a **{pFallen}** chance of having fallen; across the tenant that is about **{takeovers}** accounts.",
          "at": 360,
          "scenario": "spray"
        },
        {
          "title": "Midnight",
          "text": "**{takeovers}** expected takeovers, and not one lockout. The small multiples put all four scenarios on one scale: the spray is in a different league.",
          "at": 1440,
          "scenario": "spray"
        }
      ],
      "figures": [
        {
          "kind": "line",
          "title": "Chance a targeted account has fallen",
          "series": [
            {
              "var": "pFallen"
            }
          ],
          "yMin": 0,
          "thresholds": [
            {
              "value": 0.1,
              "label": "1 in 10",
              "color": "grey"
            }
          ]
        },
        {
          "kind": "compare",
          "title": "Expected takeovers, every scenario",
          "var": "takeovers",
          "caption": "Same vertical scale in every panel. The highlighted panel is the scenario you are viewing."
        }
      ],
      "check": {
        "prompt": "The spray sends each account one guess every ten minutes. Will the lockout ever trigger?",
        "options": [
          {
            "text": "Yes, after 50 minutes: five failures",
            "why": "It would, if the counter never forgot. It forgets five failures per half hour, faster than the spray adds them."
          },
          {
            "text": "No, never",
            "correct": true,
            "why": "The counter leaks faster than it fills, so it never gets near five."
          },
          {
            "text": "Yes, but only for the most targeted accounts",
            "why": "The spray is even: every account gets the same trickle, so none reaches the threshold."
          }
        ],
        "reveal": "The spray has locked the account **{lockouts}** times, yet has tested **{guesses}** guesses against each of the {accounts} accounts.",
        "expect": {
          "scenario": "spray",
          "at": 1440,
          "test": "lockouts == 0 && takeovers > 100"
        }
      }
    },
    {
      "id": "lockout-as-weapon",
      "kicker": "The side effect",
      "title": "A lockout is also a weapon",
      "body": [
        "Look at the owner during the brute force. The account is locked for most of the day, so most of the owner's sign-ins hit a locked door: the attacker cannot get in, but neither can the owner. Keep scrolling to run the whole day."
      ],
      "focus": [
        "lockLeft",
        "userDenied"
      ],
      "scrub": {
        "from": 0,
        "to": 1440,
        "scenario": "brute",
        "window": "All",
        "screens": 4,
        "marks": [
          {
            "at": 0,
            "text": "The owner will try to sign in every two hours, starting at half past midnight."
          },
          {
            "at": 30,
            "text": "00:30: the account is locked. The owner is refused for the first time."
          },
          {
            "at": 390,
            "text": "By morning the owner has been refused **{userDenied}** times out of four tries."
          },
          {
            "at": 1350,
            "text": "By the end of the day: refused **{userDenied}** times out of twelve. Anyone who knows a username can do this on purpose."
          }
        ]
      },
      "figures": [
        {
          "kind": "heatmap",
          "title": "Lockout time left, by scenario",
          "var": "lockLeft",
          "buckets": 48,
          "agg": "max"
        },
        {
          "kind": "step",
          "title": "Owner sign-ins refused",
          "series": [
            {
              "var": "userDenied"
            }
          ],
          "yMin": 0
        }
      ]
    },
    {
      "id": "defences-that-work",
      "kicker": "The bench",
      "title": "Defences that look at the whole tenant",
      "body": [
        "The spray is invisible per address and per account, but not across the tenant: two hundred addresses at half a guess a minute is a hundred failures a minute, far above normal. A tenant-wide ((challenge)), raised when failures pass **{alarmRate}**, stops most automated guesses.",
        "Two more defences change the arithmetic instead of the rate. ((Breached-password screening)) makes each common guess ten times less likely to work, and ((MFA)) means a right password alone does not open the account.",
        "This is the bench: every knob, every figure, and the clock. Switch scenarios, turn defences on and off, press play and watch the stage."
      ],
      "controls": [
        "challenge",
        "alarmRate",
        "screening",
        "mfaShare",
        "attackIps",
        "accounts",
        "attackRate",
        "pGuess"
      ],
      "focus": [
        "tenantFails",
        "passed",
        "takeovers",
        "pFallen"
      ],
      "bench": true,
      "figures": [
        {
          "kind": "area",
          "title": "Failed logins across the tenant",
          "series": [
            {
              "var": "passed"
            },
            {
              "var": "stopped"
            }
          ],
          "stacked": true,
          "yLabel": "per minute",
          "thresholds": [
            {
              "value": "alarmRate",
              "label": "challenge threshold",
              "color": "violet"
            }
          ]
        },
        {
          "kind": "tile",
          "items": [
            {
              "var": "takeovers",
              "better": "down"
            },
            {
              "var": "pFallen",
              "better": "down"
            }
          ],
          "sparkline": true
        },
        {
          "kind": "calc",
          "title": "This minute's calculation",
          "targets": [
            "challenged",
            "passed",
            "stopped",
            "perAccount",
            "pFallen",
            "takeovers"
          ]
        }
      ],
      "goto": {
        "label": "Start the defended spray",
        "tick": 0,
        "scenario": "defended"
      }
    }
  ],
  "glossary": [
    {
      "term": "token bucket",
      "definition": "A rate limiter: a bucket holds a fixed number of tokens, each request spends one, and tokens refill at a steady rate. It allows short bursts but caps the long-run rate."
    },
    {
      "term": "lockout",
      "definition": "Refusing every sign-in to an account for a while after too many failed attempts."
    },
    {
      "term": "exponential backoff",
      "definition": "Making each successive wait longer by a fixed factor, for example 15, 30, 60, 120 minutes."
    },
    {
      "term": "password spray",
      "definition": "An attack that tries a few very common passwords against many accounts, slowly, to stay under per-account and per-address limits."
    },
    {
      "term": "challenge",
      "definition": "An extra test, such as a puzzle or a device check, that people pass easily and automated tools mostly fail."
    },
    {
      "term": "breached-password screening",
      "definition": "Refusing passwords that appear in known breach lists when users set them, so the most common guesses stop working."
    },
    {
      "term": "MFA",
      "definition": "Multi-factor authentication: a second proof, such as a code or a key, that a stolen or guessed password alone cannot supply."
    },
    {
      "term": "expected value",
      "definition": "The average outcome over many runs. Half a guess a minute means one guess every two minutes on average."
    }
  ],
  "closing": {
    "heading": "What the clock showed",
    "body": [
      "Per-address rate limits and per-account lockouts are both counters with a refill or a leak. They stop an attacker who is fast and narrow, and they are blind to one who is slow and wide, because neither counter ever fills.",
      "Defences that work against the spray either look across the whole tenant, or change what a right guess is worth. And a lockout always has a cost: whoever can trigger it can lock real users out."
    ],
    "takeaways": [
      "A token bucket caps the long-run rate per address at its refill rate.",
      "A leaky failure counter never trips if failures arrive slower than it forgets them.",
      "Backoff makes lockouts expensive for machines; a cap decides how expensive.",
      "Spraying beats per-address and per-account limits by going wide and slow.",
      "Tenant-wide signals, breach screening and MFA defeat the spray.",
      "Every lockout policy can be turned into a denial of service against real users."
    ]
  },
  "stage": {
    "title": "The counters",
    "variables": [
      "tokens",
      "allowed",
      "tenantFails",
      "passed",
      "perAccount",
      "failures",
      "lockLeft",
      "lockouts",
      "guesses",
      "pFallen",
      "takeovers",
      "userDenied"
    ]
  }
}
```
