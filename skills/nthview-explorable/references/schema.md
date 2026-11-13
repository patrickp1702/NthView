# Explorable Lab data schema — schemaVersion 1

## Overview
The data describes an explorable explanation: a short guided story told in
4–12 steps, each with a few paragraphs, one to three live visualisations
bound to a shared numeric model, controls that change the model's
variables, and a "predict, then observe" question that the learner answers
before the model shows what happens. A glossary, an intro and a wrap-up
frame the steps; every number the learner sees is computed from the model.

Text fields accept `**bold**` and glossary marks `((term))` or
`((shown text|term))`. Fields marked **live** also accept placeholders
`{expr}` or `{expr|format}` that show a model value and update as the
learner tinkers. `steps[].body` additionally accepts scrubbers `[[variableId]]`:
an inline number the learner drags (or moves with the arrow keys) to change
that variable. Nothing else is interpreted. Character limits count
JavaScript string length, so one emoji counts as 2.

## External libraries
The renderer loads ten typefaces from Google Fonts (see `NthView.libs` in
`assets/view.js`). Everything else, including every chart and simulation,
is drawn with inline SVG or `<canvas>` by the view's own code. Without
internet access the file still works with system fonts.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–80 chars | Intro heading, top bar and page title |
| `subtitle` | string | no | ≤200 chars | One line under the intro heading |
| `theme` | string | no | one of `lab`, `chalk`, `nebula`, `paper`, `sunlit`, `mint` | Visual theme (see Themes). When omitted, one is derived from the title |
| `seed` | integer | no | 0–2147483647, default `1` | Seeds every random number (scatter points, simulations), so the same file always plays the same way |
| `intro` | object | yes | see Intro | The cover screen |
| `model` | object | yes | see Model | Variables and formulas shared by every step |
| `steps` | array | yes | 4–12 Step objects | Shown in order, one at a time |
| `glossary` | array | yes | 1–30 Glossary objects | Terms the learner can tap anywhere `((term))` appears |
| `wrapUp` | object | yes | see Wrap-up | The end screen |

## Themes
Every theme sets the backdrop gradient and drifting colour fields, a dot
grid, glass surfaces, an accent pair, typefaces and corner radius, and has a
light and a dark variant. The reader's system setting picks the variant; a
button in the top bar cycles auto, light and dark. Each variant stays on one
side of brightness: text is near-black (`#0a…`–`#17…`) on every light
variant and near-white (`#f0…`–`#ff…`) on every dark one, and the hue tokens
(see Colours) switch to a darker set on light variants and a brighter set on
dark ones, so every chart stays readable.

| Theme | Native mood (other variant) | Type | Suits |
| :- | :- | :- | :- |
| `lab` | Deep navy with cyan and teal glow (pale blue-grey) | Space Grotesk / Inter | Science, engineering, data, technology |
| `chalk` | Chalkboard green with chalk yellow and coral (cream board) | Kalam / Atkinson Hyperlegible | Maths, school topics, teaching |
| `nebula` | Violet night with magenta (lilac and pink) | Sora / Inter | Physics, astronomy, big abstract ideas |
| `paper` | Notebook cream, ink blue and red (dark sepia) | Fraunces / Source Serif 4 | Economics, history, essays, reading-heavy topics |
| `sunlit` | Warm peach with burnt orange and amber (ember brown) | Bricolage Grotesque / Inter | Biology, health, everyday life |
| `mint` | Cool mint with teal and blue (deep pine) | Nunito | Ecology, children, gentle topics |

Numbers in readouts, sliders and charts use JetBrains Mono in every theme.

## Colours
Any `color` field takes one hue token: `accent`, `accent2` (the theme's
accent pair), `blue`, `teal`, `green`, `lime`, `amber`, `orange`, `red`,
`pink`, `violet` or `grey`. Raw colour values are not accepted, so a file
looks right in every theme and both variants. When a series, bar or part
has no `color`, the renderer cycles `accent`, `accent2`, `violet`, `amber`,
`pink`, `green`.

## Expressions
Formulas, visual values, `set` targets, `expect`, `when` and placeholders are
expressions: a string such as `"rZero * (1 - coverage)"`, or a plain number,
which counts as the expression with that value.

- Numbers (`3`, `0.25`, `.5`, `1e6`), identifiers, `+ - * / %`, comparisons
  `== != < <= > >=`, `&& || !`, unary `-`, and parentheses. A comparison or
  logical operator yields `1` (true) or `0` (false); `==` and `!=` ignore
  differences below `1e-9`.
- Functions: `min(a, …)` and `max(a, …)` (1–8 arguments), `abs`, `sqrt`,
  `pow(a, b)`, `exp`, `log` (natural), `sin`, `cos` (radians), `floor`,
  `round`, `clamp(x, lo, hi)`, and `if(condition, then, else)`.
- The constant `pi`.
- Division or `%` by exactly zero gives `0`. Any other result that is not a
  finite number (for example `sqrt(-1)`) is shown as `0`; the validator warns
  when that happens at a step's start values.

Identifiers are model ids (variables and formulas), plus these locals where
stated: the line chart's own `x.id`; `i`, `u`, `v`, `n` in a scatter's `x`,
`y` and `highlight`; `row`, `col`, `rows`, `cols`, `i`, `u` in a grid's
`cell`; `k` in a timeline's `value`; `k` and `value` in a timeline's
`label`. Any other identifier is an error.

Number formats (`format`, `x.format`, `xFormat`, `yFormat`, and the `|fmt`
suffix of a placeholder) are one of:

| Format | Shows 0.4567 as | Shows 12345.6 as |
| :- | :- | :- |
| `auto` (default) | `0.46` | `12,346` |
| `int` | `0` | `12,346` |
| `dp1` | `0.5` | `12,345.6` |
| `dp2` | `0.46` | `12,345.60` |
| `pct` (×100) | `46%` | `1,234,560%` |
| `pct1` (×100) | `45.7%` | `1,234,560.0%` |
| `compact` | `0.46` | `12.3k` |
| `times` | `×0.46` | `×12,346` |

`prefix` (≤4 chars) goes before the number and `unit` (≤16 chars) after it,
with a space when the unit starts with a letter. A placeholder that is a bare
model id (`{reff}`) uses that variable's or formula's format, prefix and
unit; any other placeholder uses its `|fmt` suffix, or `auto`.

## Intro object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kicker` | string | no | ≤40 chars, default "Explorable explanation" | Small label above the title |
| `question` | string | no | ≤200 chars | The big question the lab answers, shown in a card |
| `body` | string[] | yes | 1–4 items, each 1–600 chars | What the learner is about to do; bold and glossary marks only |

## Model object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `variables` | array | yes | 1–24 Variable objects | The numbers the learner can change |
| `formulas` | array | no | 0–40 Formula objects | Derived numbers, evaluated in list order after every change |

## Variable object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | 1–24 chars, `^[a-z][a-zA-Z0-9]*$` (camelCase), unique across variables and formulas, not a function name or reserved local | Used in expressions and controls |
| `label` | string | yes | 1–40 chars | Shown on controls and scrubbers |
| `min` | number | yes | finite | Lowest value |
| `max` | number | yes | greater than `min` | Highest value |
| `default` | number | yes | between `min` and `max` | Value at the start of the lab, unless a step's `start` overrides it |
| `step` | number | no | > 0 and ≤ `max − min`; default (max − min)/100 | Slider, stepper and scrubber increment |
| `format` | string | no | a number format | How the value is shown |
| `prefix` | string | no | ≤4 chars | Text before the number, e.g. `$` |
| `unit` | string | no | ≤16 chars | Text after the number, e.g. `people` |

A variable that is 0 or 1 (min 0, max 1, step 1) works as a switch with a
`toggle` control: off is `min`, on is `max`.

## Formula object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | as Variable `id` | Name used by later formulas, visuals and text |
| `expr` | expression | yes | may use variables and formulas listed **before** it | The calculation |
| `label` | string | no | ≤40 chars | Human name (documentation only) |
| `format` | string | no | a number format | Used when a placeholder or readout shows this formula |
| `prefix` | string | no | ≤4 chars | |
| `unit` | string | no | ≤16 chars | |

## Step object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Stable key |
| `title` | string | yes | 1–80 chars | Step heading, progress rail and intro list |
| `kicker` | string | no | ≤40 chars | Short label shown with "Step n of N" |
| `body` | string[] | yes | 1–5 items, each 1–700 chars; **live**, plus `[[variable]]` scrubbers | The narrative for this step |
| `start` | object | no | keys are variable ids, values numbers within that variable's range | Values set when the learner first enters the step (others take their `default`). Revisiting a step restores what the learner left |
| `visuals` | array | yes | 1–3 Visual objects | The live pictures, drawn on the "lab bench" |
| `controls` | array | no | 0–6 Control objects | Widgets bound to variables |
| `predict` | object | no (warned) | see Predict | The question asked before the model reveals the answer |
| `challenge` | object | no | see Challenge | A goal to reach by tinkering, checked live |
| `takeaway` | string | no | ≤240 chars; **live** | One line to remember, shown after the prediction and in the wrap-up |

## Predict object
The learner picks an option; the controls are locked until then (unless
`lock` is `false`). On a pick the model returns to the step's start values,
animates to the `set` targets in front of the learner, then shows whether
the prediction held, the `why` of the picked option (and of the right one),
and the `notice`. "Skip the prediction" reveals the notice without a
verdict. A replay button re-runs the observation.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | yes | 1–240 chars | The question, e.g. "What happens if you double R₀?" |
| `options` | array | yes | 2–5 Option objects, exactly one `correct` | What the learner can predict; keys 1–5 pick them |
| `set` | object | no | keys are variable ids; values expressions, at least one key | Assignments applied during the observation, evaluated against the step's start values, then clamped to each variable's range. Omit when the learner should find the answer by tinkering |
| `expect` | expression | no | must be true after `set` is applied to the step's start values | A check on the content: the validator computes it and rejects the file if the model does not actually do what the correct option claims |
| `notice` | string | yes | 1–500 chars; **live** | "What to notice": the point of the observation |
| `lock` | boolean | no | default `true` | Lock the step's controls and scrubbers until the learner predicts or skips |

Option: `text` (string, 1–160, required), `correct` (boolean, default
`false`), `why` (string, 1–400, required: why it does or does not happen).

## Challenge object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `prompt` | string | yes | 1–240 chars | The goal, e.g. "Find the lowest coverage that stops measles" |
| `when` | expression | yes | | Checked after every change; true means solved |
| `success` | string | yes | 1–300 chars; **live** | Shown once solved |
| `hint` | string | no | ≤240 chars | Behind a "Need a hint?" toggle |

The challenge appears after the prediction (or straight away when the step
has none) and stays solved once solved.

## Control object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kind` | string | yes | one of `slider`, `stepper`, `toggle`, `choice`, `play`, `button` | See below |
| `var` | string | yes, except `button` | a variable id (not a formula) | The variable it changes |
| `label` | string | yes for `button`; else no | ≤40 chars; default the variable's `label` | Shown with the control |
| `options` | array | `choice` only, required | 2–6 of `{label` (1–24), `value` (number within the variable's range)`}` | The segmented choices |
| `duration` | number | `play` only | 1–30 seconds, default 6 | Time to sweep from `min` to `max` |
| `loop` | boolean | `play` only | default `false` | Start again from `min` after reaching `max` |
| `set` | object | `button` only, required | keys are variable ids; values expressions, at least one key | Assignments evaluated against the current values when pressed, e.g. `{"coverage": "min(1, coverage + 0.1)"}` |

- `slider`: a range input with the live value and the range ends.
- `stepper`: − and + buttons moving by the variable's `step`.
- `toggle`: a switch; off sets `min`, on sets `max`.
- `choice`: a segmented radio group of preset values.
- `play`: a slider with a play button that sweeps the variable.
- `button`: one action that applies `set`, animated.

Every step with controls also gets a "Reset this step" button.

## Visual object
Every visual has these fields, plus the fields of its `kind` below.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `kind` | string | yes | one of `bars`, `line`, `scatter`, `agents`, `grid`, `gauge`, `number`, `stack`, `flow`, `timeline`, `compare` | What to draw |
| `title` | string | no | ≤60 chars | Card heading |
| `caption` | string | no | ≤240 chars; **live** | Under the picture |
| `format` | string | no | a number format | How values are shown (bars, line y values, gauge, stack, flow, timeline, number and compare defaults) |
| `prefix` | string | no | ≤4 chars | As above |
| `unit` | string | no | ≤16 chars | As above |

### `bars` — bar chart

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `bars` | array | yes | 1–12 of `{label` (1–24), `value` (expression), `color` (hue, optional), `alert` (expression, optional)`}` | One bar each; a bar whose `alert` is true turns red and is marked "!" |
| `max` | expression | no | | Axis maximum; default a round number just above the largest bar |
| `horizontal` | boolean | no | default `false` | Rows with labels on the left (better for long labels) |

### `line` — curves over a range

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `x` | object | yes | `id` (identifier, 1–12, not a model id), `from` and `to` (expressions), `label` (1–30), `format` (optional) | The horizontal axis and the local name the series use for it |
| `series` | array | yes | 1–4 of `{label` (1–30), `y` (expression that may use `x.id`), `color` (hue, optional), `dashed` (boolean, optional)`}` | The curves |
| `yMin`, `yMax` | expression | no | | Vertical range; default 0 (or the data minimum) to a round number above the data |
| `logY` | boolean | no | default `false` | Logarithmic vertical axis (powers of ten); values ≤ 0 are skipped |
| `marker` | expression | no | | An x position to mark; the legend shows each series' value there |
| `markerLabel` | string | no | ≤24 chars, needs `marker` | Text on the marker badge |
| `samples` | integer | no | 20–400, default 100 | Points per curve |
| `yLabel` | string | no | ≤30 chars | Vertical axis title |

### `scatter` — generated points

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `count` | expression | yes | rounded, clamped to 1–1000 | Number of points |
| `x`, `y` | expression | yes | may use `i` (index), `u`, `v` (uniform 0–1), `n` (standard normal) | Position of point `i`; each point keeps its own `u`, `v`, `n` across changes |
| `xMin`, `xMax`, `yMin`, `yMax` | expression | no | default 0 and 1 | Axis ranges; points outside are pinned to the edge |
| `xLabel`, `yLabel` | string | no | ≤30 chars | Axis titles |
| `xFormat`, `yFormat` | string | no | a number format | Tick formats |
| `color` | string | no | hue; default `grey` when `highlight` is set, else `accent` | Point colour |
| `highlight` | expression | no | same locals as `x` | Points where it is true use `highlightColor`; the legend counts them |
| `highlightColor` | string | no | hue, default `red`; needs `highlight` | |
| `highlightLabel` | string | no | ≤40 chars; needs `highlight` | Legend text for highlighted points |

### `agents` — particle simulation
Agents wander a 400 × 250 box (random walk with bounces). Each tick, every
agent checks the rules in order and applies the first that fires.

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `states` | array | yes | 2–5 of `{id` (kebab-case, unique), `label` (1–24), `color` (hue, required)`}` | What an agent can be |
| `initial` | object | yes | keys are state ids, values expressions (counts, rounded) | Agents created per state; the total is capped at `max` |
| `rules` | array | yes | 1–6 Rule objects | How states change |
| `speed` | expression | no | 0–6, default 1.2 | Distance moved per tick |
| `radius` | expression | no | 2–30, default 9 | Contact distance |
| `still` | expression | no | 0–1, default 0 | Share of agents that do not move (drawn with a ring) |
| `ticks` | integer | no | 100–5000, default 900 | The run stops after this many ticks, or earlier once nothing changes |
| `max` | integer | no | 10–800, default 400 | Cap on agents, including those born by `split` |
| `history` | boolean | no | default `true` | Show a stacked strip of state counts over time |

Rule: `kind` one of `contact` (an agent in `from` within `radius` of an
agent in `with` becomes `to`, with probability `chance` per nearby agent per
tick), `timer` (an agent in `from` becomes `to` with probability `chance`
per tick) or `split` (an agent in `from` adds a new agent in `to`, default
`from`, with probability `chance` per tick). `from`, `to` and `with` are
state ids; `chance` is an expression clamped to 0–1.

Changing a value that feeds `initial` or `still` restarts the run after a
short pause; `chance`, `speed` and `radius` update live. The card has play
or pause, restart (same run) and a dice button (next seeded run).

### `grid` — cellular field

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `rows`, `cols` | integer | yes | 4–60 each | Field size |
| `states` | array | yes | as in `agents` | What a cell can be |
| `cell` | expression | yes | may use `row`, `col`, `rows`, `cols`, `i` (index), `u` (uniform 0–1, fixed per cell and run) | Initial state of each cell as a state index (0 = first state), rounded and clamped |
| `rules` | array | no | 0–4 Rule objects of kind `contact` or `timer` | Without rules the field is a static picture redrawn after every change |
| `neighbors` | integer | no | `4` or `8`, default 8 | Which neighbouring cells count for `contact` |
| `ticks` | integer | no | 10–1000, default 160 | Maximum generations |
| `speed` | integer | no | 1–30, default 10 | Generations per second |

### `gauge` — dial readout

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `value` | expression | yes | | Needle position, clamped to the dial |
| `min` | expression | no | default 0 | Left end |
| `max` | expression | yes | | Right end |
| `label` | string | no | ≤30 chars | Under the dial |
| `zones` | array | no | 1–4 of `{to` (number, increasing), `color` (hue, required), `label` (1–20)`}` | Coloured bands; a zone runs from the previous `to` up to its own, and the last runs to `max`. The current zone's label is shown |

### `number` — big readouts

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `items` | array | yes | 1–4 of `{label` (1–30), `value` (expression), `format`, `prefix`, `unit`, `color` (all optional)`}` | Each item falls back to the visual's `format`, `prefix` and `unit` |

### `stack` — proportions of a whole

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `parts` | array | yes | 2–6 of `{label` (1–24), `value` (expression, negatives count as 0), `color` (hue, optional)`}` | Shown as shares of their sum |
| `shape` | string | no | `bar` (default) or `donut` | |

### `flow` — pipeline with animated rates

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `stages` | array | yes | 2–5 of `{label` (1–24), `value` (expression), `color` (hue, optional)`}` | Boxes in a row (a column on narrow screens) |
| `links` | array | yes | exactly one fewer than `stages`; each `{rate` (expression), `label` (≤24, optional)`}` | The pipe into the next stage; dots move faster, denser and brighter as `rate` rises, and stop at 0 |
| `maxRate` | expression | no | default the largest rate | The rate drawn at full speed |

### `timeline` — sequence replay

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `frames` | expression | yes | rounded, clamped to 2–40 | Number of frames |
| `value` | expression | yes | may use `k` (frame index from 0) | Value of frame `k` |
| `label` | string | yes | 1–100 chars; **live** with locals `k` and `value` | Narration under the current frame, e.g. `"Generation {k}: {value|int} new cases"` |
| `display` | string | no | `dots` (default: one dot per unit, up to 240) or `bars` | How the current frame is drawn |
| `frameMs` | integer | no | 200–3000, default 700 | Time per frame when playing |
| `autoplay` | boolean | no | default `true` | Play once when the step opens (never under reduced motion) |
| `color` | string | no | hue, default `accent` | |

The card has previous, play/pause and next buttons and a scrubber.

### `compare` — two scenarios side by side

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `scenarios` | array | yes | exactly 2 of `{label` (1–30), `set` (object: variable id → expression, at least one), `color` (hue, optional)`}` | Each scenario is the current model with its `set` applied |
| `metrics` | array | yes | 1–4 of `{label` (1–30), `value` (expression), `format`, `prefix`, `unit` (optional), `better` (`higher` or `lower`, optional)`}` | Rows compared with paired bars and a ratio; `better` marks the winning side |

## Glossary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `term` | string | yes | 1–40 chars, unique ignoring case | What `((term))` refers to |
| `definition` | string | yes | 1–300 chars | Shown in a pop-over, the glossary drawer and the wrap-up |

## Wrap-up object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤80 chars, default "What you discovered" | |
| `body` | string[] | yes | 1–4 items, each 1–600 chars | The concept restated in plain words |
| `takeaways` | string[] | no | 1–12 items, each 1–200 chars | Overrides the list built from each step's `takeaway` |
| `next` | string[] | no | 1–6 items, each 1–200 chars | "Keep tinkering": experiments to try next |

The wrap-up also counts steps explored, predictions made and held up, and
challenges solved. Nothing is scored against the learner.

## Cross-field rules
- `steps[i].id` must be unique; variable and formula ids share one namespace
  and must be unique across it.
- A formula may use only variables and formulas listed before it.
- Every expression must parse, and every identifier in it must be a model id
  or one of the locals that field allows (see Expressions); a line chart's
  `x.id` must not equal a model id.
- `steps[i].start`, `predict.set`, `compare.scenarios[j].set` and button
  `set` keys must be variable ids; `start` values must be within the
  variable's range.
- `controls[j].var` must be a variable id; a `choice` option's `value` must
  be within that variable's range; `options` only on `choice`, `duration`
  and `loop` only on `play`, `set` only on `button`.
- Every `[[id]]` scrubber must name a variable; every `((term))` must name a
  glossary term; every `{placeholder}` must parse and use known ids, and its
  `|format`, if any, must be a number format.
- `predict.options` has exactly one option with `correct: true`.
- `predict.expect`, when present, must be true after `predict.set` is applied
  to the step's start values (variables at their `default` overridden by
  `start`).
- `agents` and `grid` rule `from`, `to` and `with`, and `agents.initial`
  keys, must be state ids; `contact` rules need `with`; `contact` and `timer`
  rules need `to`, different from `from`; `split` is only for `agents`.
- `flow.links` has exactly `stages.length − 1` entries.
- `gauge.zones[j].to` values strictly increase.
- `line.markerLabel` needs `marker`; scatter `highlightColor` and
  `highlightLabel` need `highlight`.

## Warnings (non-blocking)
- A step without `predict`.
- A step with no controls and no `[[variable]]` scrubber.
- `challenge.when` already true at the step's start values.
- `predict.set` targets that are clamped to the variable range.
- A formula, placeholder or visual expression that is not a finite number at
  the default or step start values.
- A variable `default` that is not on its `step` grid.
- A glossary term never marked with `((...))` anywhere.
- Duplicate option text within one prediction.
- A scatter whose `highlightColor` is the same hue as its `color`.
- Five or more steps using only one or two visualisation kinds.

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
