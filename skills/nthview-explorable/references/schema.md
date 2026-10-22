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
The example is "How Herd Immunity Works": eight steps that go from chains of
infection and R₀ to effective R, the herd immunity threshold, an agent
simulation, clustered households, imperfect vaccines and two towns side by
side. It uses all eleven visualisation kinds and all six control kinds.
Build the demo with:

    node scripts/build-html.js skills/nthview-explorable --example skills/nthview-explorable/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "How Herd Immunity Works",
  "subtitle": "Play with a live outbreak model and discover why vaccinating most people can protect everyone",
  "theme": "sunlit",
  "seed": 7,
  "intro": {
    "kicker": "Explorable · public health",
    "question": "Why can vaccinating **most** people protect **everyone**, and why does “most” mean such different numbers for different diseases?",
    "body": [
      "You will not be asked to memorise anything. Each step hands you a live model of an outbreak: sliders, switches, a crowd of simulated people, a town of households.",
      "Before each experiment you predict what will happen, then watch. Guessing wrong is the point: surprises are where understanding starts. The numbers come from simple textbook models and typical estimates, so treat them as illustrations, not forecasts."
    ]
  },
  "model": {
    "variables": [
      { "id": "rZero", "label": "R₀ (spread per case)", "min": 0.5, "max": 18, "step": 0.1, "default": 2, "format": "dp1" },
      { "id": "coverage", "label": "Vaccinated share", "min": 0, "max": 1, "step": 0.01, "default": 0, "format": "pct" },
      { "id": "efficacy", "label": "Vaccine effectiveness", "min": 0.5, "max": 1, "step": 0.01, "default": 1, "format": "pct" },
      { "id": "contacts", "label": "Close contacts per case", "min": 2, "max": 30, "step": 1, "default": 10, "format": "int" },
      { "id": "stayHome", "label": "Share staying home", "min": 0, "max": 0.5, "step": 0.05, "default": 0, "format": "pct" },
      { "id": "clustered", "label": "Unvaccinated live together", "min": 0, "max": 1, "step": 1, "default": 0, "format": "int" },
      { "id": "spread", "label": "How much towns differ", "min": 0, "max": 0.25, "step": 0.01, "default": 0.08, "format": "pct" },
      { "id": "population", "label": "Town size", "min": 1000, "max": 100000, "step": 1000, "default": 10000, "format": "int", "unit": "people" }
    ],
    "formulas": [
      { "id": "protectedShare", "label": "Protected share", "expr": "coverage * efficacy", "format": "pct" },
      { "id": "reff", "label": "Effective R", "expr": "rZero * (1 - protectedShare)", "format": "dp2" },
      { "id": "threshold", "label": "Herd immunity threshold", "expr": "max(0, 1 - 1 / rZero)", "format": "pct" },
      { "id": "critical", "label": "Coverage needed", "expr": "threshold / efficacy", "format": "pct" },
      { "id": "exposed", "label": "Unprotected contacts", "expr": "contacts * (1 - protectedShare)", "format": "dp1" },
      { "id": "genSix", "label": "Cases in generation 6", "expr": "pow(rZero, 6)", "format": "int" },
      { "id": "firstSix", "label": "Cases in generations 0–6", "expr": "if(abs(rZero - 1) < 0.001, 7, (pow(rZero, 7) - 1) / (rZero - 1))", "format": "int" },
      { "id": "z1", "expr": "1 - exp(-reff) / (1 - reff * exp(-reff))" },
      { "id": "z2", "expr": "z1 - (z1 - 1 + exp(-reff * z1)) / (1 - reff * exp(-reff * z1))" },
      { "id": "z3", "expr": "z2 - (z2 - 1 + exp(-reff * z2)) / (1 - reff * exp(-reff * z2))" },
      { "id": "z4", "expr": "z3 - (z3 - 1 + exp(-reff * z3)) / (1 - reff * exp(-reff * z3))" },
      { "id": "z5", "expr": "z4 - (z4 - 1 + exp(-reff * z4)) / (1 - reff * exp(-reff * z4))" },
      { "id": "attack", "label": "Share of the unprotected infected", "expr": "if(reff > 1, clamp(z5, 0, 1), 0)", "format": "pct" },
      { "id": "infectedShare", "label": "Share of town infected", "expr": "attack * (1 - protectedShare)", "format": "pct1" },
      { "id": "infectedPeople", "label": "People infected", "expr": "infectedShare * population", "format": "int", "prefix": "≈", "unit": "people" },
      { "id": "simChance", "label": "Infection chance per tick", "expr": "clamp(rZero * 0.05, 0, 1)", "format": "pct1" }
    ]
  },
  "steps": [
    {
      "id": "one-becomes-many",
      "title": "One case becomes many",
      "kicker": "Chains of infection",
      "body": [
        "An infectious disease spreads in **generations**. One sick person passes it on, those people pass it on, and so on. The number that matters most is how many people each case infects when nobody is immune: the ((basic reproduction number|R₀)), written R₀.",
        "Suppose each case infects [[rZero]] others. Drag that number. Generation 6 then has {genSix} new cases, and the first seven generations add up to {firstSix} people."
      ],
      "start": { "rZero": 2 },
      "visuals": [
        {
          "kind": "timeline",
          "title": "Generation by generation",
          "frames": "7",
          "value": "pow(rZero, k)",
          "label": "Generation {k}: **{value|int}** new cases",
          "display": "dots",
          "frameMs": 750,
          "autoplay": true,
          "color": "orange",
          "format": "int",
          "caption": "Each dot is one new case. Replay the chain with the play button or scrub through it."
        },
        {
          "kind": "number",
          "title": "The count",
          "items": [
            { "label": "New cases in generation 6", "value": "genSix", "format": "int", "color": "orange" },
            { "label": "Everyone infected so far", "value": "firstSix", "format": "int", "unit": "people" }
          ]
        }
      ],
      "controls": [
        { "kind": "slider", "var": "rZero" }
      ],
      "predict": {
        "prompt": "Each case infects 2 people. What if each case infected 4 instead: how many times more cases would generation 6 have?",
        "options": [
          { "text": "Twice as many, because 4 is twice 2", "why": "That is the straight-line intuition, but the doubling happens at every generation, not once. Six generations of “twice as many” compound into 2 × 2 × 2 × 2 × 2 × 2." },
          { "text": "About 12 times as many", "why": "Close to what you get by adding the extra cases up generation by generation, but chains multiply rather than add." },
          { "text": "64 times as many", "correct": true, "why": "4⁶ ÷ 2⁶ = (4 ÷ 2)⁶ = 2⁶ = 64. A difference in R₀ is multiplied in once per generation." }
        ],
        "set": { "rZero": "rZero * 2" },
        "expect": "genSix == 4096",
        "notice": "Generation 6 now has **{genSix}** cases instead of 64. The chain multiplies by R₀ at every step, so a small difference in R₀ becomes an enormous difference a few generations later. That is ((exponential growth))."
      },
      "takeaway": "Cases multiply by R₀ every generation, so outbreaks grow exponentially."
    },
    {
      "id": "shrink-or-grow",
      "title": "Above one it grows, below one it dies",
      "kicker": "The magic number 1",
      "body": [
        "What if each case infects fewer than one person on average? Some do infect others, but more of them infect no one, and the chain gets shorter each generation.",
        "The curve shows cases per generation for R₀ = [[rZero]]. The dashed line is R₀ = 1, where every case exactly replaces itself. The vertical axis is a ((log scale)): each gridline is ten times the one below, so steady multiplication draws a straight line."
      ],
      "start": { "rZero": 1.5 },
      "visuals": [
        {
          "kind": "line",
          "title": "Cases per generation",
          "x": { "id": "g", "from": "0", "to": "12", "label": "Generation", "format": "int" },
          "series": [
            { "label": "Your R₀", "y": "pow(rZero, g)", "color": "accent" },
            { "label": "R₀ = 1", "y": "1", "color": "grey", "dashed": true }
          ],
          "logY": true,
          "marker": "12",
          "markerLabel": "Gen",
          "samples": 120,
          "yLabel": "Cases",
          "format": "auto"
        },
        {
          "kind": "gauge",
          "title": "Growth per generation",
          "value": "rZero",
          "min": "0",
          "max": "4",
          "label": "R₀ (needle stops at 4)",
          "format": "dp1",
          "zones": [
            { "to": 0.99, "color": "green", "label": "Shrinks" },
            { "to": 1.01, "color": "amber", "label": "Holds steady" },
            { "to": 100, "color": "red", "label": "Grows" }
          ]
        }
      ],
      "controls": [
        { "kind": "slider", "var": "rZero", "label": "R₀" }
      ],
      "predict": {
        "prompt": "Set R₀ to 0.8. What happens to the outbreak over the generations?",
        "options": [
          { "text": "It keeps growing, just slowly", "why": "Growth needs each case to be replaced by more than one new case. At 0.8, every generation is 20% smaller than the one before." },
          { "text": "It levels off at a steady number of cases", "why": "Levelling off happens only at exactly 1, when each case replaces itself. That is the dashed line." },
          { "text": "It shrinks every generation and dies out", "correct": true, "why": "Multiplying by 0.8 again and again heads towards zero: after 12 generations only about 7% of the starting cases are left." }
        ],
        "set": { "rZero": "0.8" },
        "expect": "pow(rZero, 12) < 0.1",
        "notice": "With R₀ = {rZero}, generation 12 has only {pow(rZero, 12)|dp2} cases for every case you started with: the chain fizzles. On the log scale the line now slopes **down**. Everything hinges on whether each case is replaced by more or fewer than one new case.",
        "lock": false
      },
      "challenge": {
        "prompt": "Find the R₀ where the curve goes perfectly flat.",
        "when": "abs(rZero - 1) < 0.05",
        "success": "At R₀ = {rZero} every case replaces itself exactly once, so the line stays flat. This is the knife edge between growth and decline.",
        "hint": "Watch the gauge needle and the dashed line."
      },
      "takeaway": "If each case causes fewer than one new case, the outbreak shrinks and dies out."
    },
    {
      "id": "breaking-the-chain",
      "title": "Immunity breaks the chain",
      "kicker": "Effective R",
      "body": [
        "Vaccination doesn't make a disease less contagious. It takes people out of the chain. Picture one case meeting {contacts} close contacts: the vaccinated ones are protected, and only the unprotected ones can catch it.",
        "So what drives the outbreak is the ((effective R)): R₀ times the share of people still unprotected. Right now [[coverage]] of people are vaccinated, so effective R is {reff}."
      ],
      "start": { "rZero": 3, "coverage": 0 },
      "visuals": [
        {
          "kind": "flow",
          "title": "One case, one round of contacts",
          "stages": [
            { "label": "Case", "value": "1", "color": "orange" },
            { "label": "Contacts", "value": "contacts", "color": "blue" },
            { "label": "Unprotected", "value": "exposed", "color": "amber" },
            { "label": "New cases", "value": "reff", "color": "red" }
          ],
          "links": [
            { "rate": "contacts", "label": "meets" },
            { "rate": "exposed", "label": "open" },
            { "rate": "reff", "label": "infects" }
          ],
          "maxRate": "contacts",
          "format": "dp1",
          "caption": "Thicker, faster dots mean more people passing through that stage."
        },
        {
          "kind": "stack",
          "title": "The town",
          "parts": [
            { "label": "Protected", "value": "protectedShare", "color": "teal" },
            { "label": "Unprotected", "value": "1 - protectedShare", "color": "amber" }
          ],
          "shape": "donut",
          "format": "pct"
        }
      ],
      "controls": [
        { "kind": "slider", "var": "coverage" },
        { "kind": "stepper", "var": "contacts" }
      ],
      "predict": {
        "prompt": "R₀ is 3. Half the town gets a vaccine that always works. How many people does each case infect now, on average?",
        "options": [
          { "text": "Still 3: the disease is just as contagious", "why": "Each contact is just as risky as before, but half of those contacts can no longer be infected. Contagiousness hasn't changed; the supply of people to infect has." },
          { "text": "1.5", "correct": true, "why": "Half the would-be infections land on protected people, so 3 becomes 3 × (1 − 0.5) = 1.5." },
          { "text": "0: the vaccinated half stops it completely", "why": "Vaccines protect the people who get them. The unvaccinated half is still open, and a case still meets plenty of them." }
        ],
        "set": { "coverage": "0.5" },
        "expect": "reff == 1.5",
        "notice": "Each case still meets {contacts} people, but only {exposed} of them are unprotected, so the chain now multiplies by **{reff}** instead of {rZero}. Vaccination lowers effective R, and effective R is the number that actually drives the outbreak."
      },
      "takeaway": "Effective R = R₀ × the share of people still unprotected."
    },
    {
      "id": "tipping-point",
      "title": "The tipping point",
      "kicker": "Herd immunity threshold",
      "body": [
        "Push coverage up and effective R falls in a straight line. At some coverage it crosses 1, and from then on every outbreak shrinks, even though not everyone is immune. That crossing is the ((herd immunity threshold)): 1 − 1/R₀.",
        "For a disease with R₀ = [[rZero]], the threshold is {threshold}. Press play on coverage and watch the needle cross into the green."
      ],
      "start": { "rZero": 3, "coverage": 0.2 },
      "visuals": [
        {
          "kind": "gauge",
          "title": "Effective R",
          "value": "reff",
          "min": "0",
          "max": "max(4, rZero)",
          "label": "At the current coverage",
          "format": "dp2",
          "zones": [
            { "to": 1, "color": "green", "label": "Outbreaks shrink" },
            { "to": 1000, "color": "red", "label": "Outbreaks grow" }
          ]
        },
        {
          "kind": "line",
          "title": "Effective R as coverage rises",
          "x": { "id": "c", "from": "0", "to": "1", "label": "Vaccinated share", "format": "pct" },
          "series": [
            { "label": "Effective R", "y": "rZero * (1 - c * efficacy)", "color": "accent" },
            { "label": "R = 1", "y": "1", "color": "grey", "dashed": true }
          ],
          "yMin": "0",
          "yMax": "max(4, rZero)",
          "marker": "coverage",
          "markerLabel": "Now",
          "yLabel": "Effective R",
          "format": "dp1"
        }
      ],
      "controls": [
        { "kind": "play", "var": "coverage", "duration": 8, "loop": true },
        { "kind": "slider", "var": "rZero" }
      ],
      "predict": {
        "prompt": "Measles is one of the most contagious diseases known, with R₀ around 15. What share of people must be immune to stop it spreading?",
        "options": [
          { "text": "About half", "why": "Half is enough only for diseases with R₀ around 2. Each measles case would still infect about 7.5 others." },
          { "text": "About three quarters", "why": "That works for R₀ = 4. With R₀ = 15, a case surrounded by 25% unprotected people still infects nearly 4." },
          { "text": "More than 90%", "correct": true, "why": "1 − 1/15 ≈ 93%. The more contagious the disease, the closer to everyone you need." }
        ],
        "set": { "rZero": "15" },
        "expect": "threshold > 0.9 && threshold < 0.95",
        "notice": "With R₀ = {rZero}, effective R only drops below 1 once **{threshold}** of people are immune. Look at the line: it starts much higher and has much further to fall before it crosses 1."
      },
      "challenge": {
        "prompt": "Keep measles at R₀ 15 and raise coverage until outbreaks shrink.",
        "when": "rZero >= 14.9 && reff < 1",
        "success": "Effective R is {reff}: below 1. At {coverage} coverage measles cannot sustain itself in this model town.",
        "hint": "Use the coverage slider or press play, and watch for the needle to enter the green."
      },
      "takeaway": "Herd immunity starts when 1 − 1/R₀ of people are immune; for measles that is about 93%."
    },
    {
      "id": "watch-it-spread",
      "title": "Watch it spread",
      "kicker": "Agent simulation",
      "body": [
        "Formulas describe averages. Here are 220 people wandering a town square. Three arrive infected. Anyone who comes close to a case may catch it, and recovers after a while. Vaccinated people never catch it.",
        "With R₀ = {rZero} and [[coverage]] vaccinated, effective R is {reff}. Each run is random, but a run always replays the same way; press the dice for a new one."
      ],
      "start": { "rZero": 3, "coverage": 0.3, "stayHome": 0 },
      "visuals": [
        {
          "kind": "agents",
          "title": "A town square of 220 people",
          "states": [
            { "id": "susceptible", "label": "Never infected", "color": "blue" },
            { "id": "infected", "label": "Infected", "color": "red" },
            { "id": "recovered", "label": "Recovered", "color": "grey" },
            { "id": "vaccinated", "label": "Vaccinated", "color": "teal" }
          ],
          "initial": {
            "susceptible": "217 - round(217 * coverage)",
            "infected": "3",
            "vaccinated": "round(217 * coverage)"
          },
          "rules": [
            { "kind": "contact", "from": "susceptible", "to": "infected", "with": "infected", "chance": "simChance" },
            { "kind": "timer", "from": "infected", "to": "recovered", "chance": "1 / 90" }
          ],
          "speed": "1.2",
          "radius": "9",
          "still": "stayHome",
          "ticks": 1500,
          "max": 400,
          "history": true,
          "caption": "The strip underneath shows how the mix changes over time. Ringed dots are staying home."
        },
        {
          "kind": "number",
          "items": [
            { "label": "Effective R", "value": "reff", "format": "dp2", "color": "red" },
            { "label": "Herd immunity threshold", "value": "threshold", "format": "pct", "color": "teal" }
          ]
        }
      ],
      "controls": [
        { "kind": "slider", "var": "coverage" },
        { "kind": "toggle", "var": "stayHome", "label": "Half the town stays home" },
        { "kind": "button", "label": "Vaccinate 10% more", "set": { "coverage": "min(1, coverage + 0.1)" } }
      ],
      "predict": {
        "prompt": "At 30% coverage plenty of people get infected. If coverage rose to 80%, what would you expect?",
        "options": [
          { "text": "About half as many infections", "why": "That would be true if a vaccine only protected the person who got it. But at 80% coverage effective R is below 1, so chains die out early." },
          { "text": "Almost no one beyond the first few, including the unvaccinated", "correct": true, "why": "Effective R falls below 1: each case meets too few unprotected people to keep the chain going, so the unvaccinated are shielded too." },
          { "text": "No real change: the unvaccinated still mix with cases", "why": "They still mix, but a case rarely reaches them, because most of the people it meets are protected." }
        ],
        "set": { "coverage": "0.8" },
        "expect": "reff < 1",
        "notice": "At {coverage} coverage effective R is {reff}. The few cases rarely meet anyone they can infect, so chains break before they start. Look at the blue dots: most **unvaccinated** people never get sick. They are protected by the people around them. That is ((herd immunity))."
      },
      "takeaway": "Above the threshold even the unvaccinated are protected, because chains of infection can't find a path."
    },
    {
      "id": "pockets",
      "title": "Averages hide pockets",
      "kicker": "Clusters",
      "body": [
        "Real towns aren't evenly mixed. People who skip vaccines often live near each other or share a school. Each cell below is a household, and infection jumps to neighbouring households.",
        "Both versions have the same average coverage of [[coverage]]. The only difference is whether the unvaccinated are scattered or clustered in one district."
      ],
      "start": { "rZero": 3, "coverage": 0.7, "clustered": 0, "spread": 0.08 },
      "visuals": [
        {
          "kind": "grid",
          "title": "A town of 1,296 households",
          "rows": 36,
          "cols": 36,
          "states": [
            { "id": "open", "label": "Not immune", "color": "blue" },
            { "id": "sick", "label": "Infected", "color": "red" },
            { "id": "over", "label": "Recovered", "color": "grey" },
            { "id": "immune", "label": "Vaccinated", "color": "teal" }
          ],
          "cell": "if(row == 18 && col == 6, 1, if(u < if(clustered, if(col < 12, coverage - 0.3, coverage + 0.15), coverage), 3, 0))",
          "rules": [
            { "kind": "contact", "from": "open", "to": "sick", "with": "sick", "chance": "clamp(rZero / 6, 0, 1)" },
            { "kind": "timer", "from": "sick", "to": "over", "chance": "0.3" }
          ],
          "neighbors": 8,
          "ticks": 300,
          "speed": 12,
          "caption": "The first case appears in the west district, the left third of the town."
        },
        {
          "kind": "scatter",
          "title": "100 towns, one national average",
          "count": "100",
          "x": "clamp(coverage + spread * n, 0, 1)",
          "y": "2 + 48 * v * v",
          "xMin": "0.4",
          "xMax": "1",
          "yMin": "0",
          "yMax": "50",
          "xLabel": "Town vaccination coverage",
          "yLabel": "Town size (thousands)",
          "xFormat": "pct",
          "yFormat": "int",
          "color": "teal",
          "highlight": "rZero * (1 - clamp(coverage + spread * n, 0, 1) * efficacy) > 1",
          "highlightColor": "red",
          "highlightLabel": "towns where outbreaks can grow",
          "caption": "Each dot is a town. Towns vary around the national average by about {spread}."
        }
      ],
      "controls": [
        { "kind": "toggle", "var": "clustered" },
        { "kind": "slider", "var": "coverage" },
        { "kind": "slider", "var": "spread" }
      ],
      "predict": {
        "prompt": "Coverage averages 70% either way, just above the 67% threshold for R₀ = 3. Now the unvaccinated cluster together in the west district. What happens?",
        "options": [
          { "text": "Nothing changes: the average is above the threshold", "why": "The threshold applies to the people who actually meet each other. Inside the cluster, coverage is far lower than the town average." },
          { "text": "The outbreak takes hold inside the cluster, even though the average looks safe", "correct": true, "why": "In the west district only 40% are vaccinated, well below the 67% threshold, so the infection has a connected path through it." },
          { "text": "Clustering protects the town by keeping the unvaccinated apart", "why": "It keeps them apart from the vaccinated, which is exactly the problem: it packs the unprotected people next to each other." }
        ],
        "set": { "clustered": "1" },
        "expect": "coverage - 0.3 < threshold",
        "notice": "Same average, very different outcome. Inside the cluster coverage is only {coverage - 0.3|pct}, far below the {threshold} threshold, so the infection burns through the district. Herd immunity is **local**: what counts is coverage among the people who actually meet. The scatter makes the same point for whole towns."
      },
      "takeaway": "Herd immunity is local: clusters of unvaccinated people can sustain outbreaks even when the average looks safe."
    },
    {
      "id": "imperfect-vaccines",
      "title": "No vaccine is perfect",
      "kicker": "Effectiveness",
      "body": [
        "So far every shot has worked. Real vaccines protect most, not all, of the people who get them. If the ((vaccine|vaccine effectiveness)) is [[efficacy]] effective, you need more coverage to reach the same protected share: threshold ÷ effectiveness.",
        "Pick a disease and slide the effectiveness to see the coverage each one needs."
      ],
      "start": { "rZero": 15, "efficacy": 1 },
      "visuals": [
        {
          "kind": "bars",
          "title": "Coverage needed to stop spread",
          "bars": [
            { "label": "Seasonal flu", "value": "(1 - 1 / 1.3) / efficacy", "color": "blue", "alert": "(1 - 1 / 1.3) / efficacy > 1" },
            { "label": "COVID-19 (2020)", "value": "(1 - 1 / 2.5) / efficacy", "color": "violet", "alert": "(1 - 1 / 2.5) / efficacy > 1" },
            { "label": "Polio", "value": "(1 - 1 / 6) / efficacy", "color": "amber", "alert": "(1 - 1 / 6) / efficacy > 1" },
            { "label": "Measles", "value": "(1 - 1 / 15) / efficacy", "color": "orange", "alert": "(1 - 1 / 15) / efficacy > 1" }
          ],
          "max": "1.2",
          "horizontal": true,
          "format": "pct",
          "caption": "Typical R₀ estimates: flu about 1.3, the original COVID-19 strain about 2.5, polio about 6, measles about 15. A red bar would need more than everyone."
        },
        {
          "kind": "number",
          "title": "Your chosen disease",
          "items": [
            { "label": "Herd immunity threshold", "value": "threshold", "format": "pct" },
            { "label": "Coverage needed", "value": "critical", "format": "pct", "prefix": "≈", "color": "orange" }
          ]
        }
      ],
      "controls": [
        { "kind": "slider", "var": "efficacy" },
        { "kind": "choice", "var": "rZero", "label": "Disease", "options": [
          { "label": "Flu 1.3", "value": 1.3 },
          { "label": "COVID 2.5", "value": 2.5 },
          { "label": "Polio 6", "value": 6 },
          { "label": "Measles 15", "value": 15 }
        ] }
      ],
      "predict": {
        "prompt": "Measles needs about 93% of people immune. Suppose the vaccine works for 90% of the people who get it. What coverage would you need?",
        "options": [
          { "text": "93%, the same as before", "why": "93% must be **immune**, not just vaccinated. With a 90% vaccine, vaccinating 93% leaves only about 84% immune." },
          { "text": "About 96%", "why": "That is roughly the answer for the real two-dose measles vaccine, which is about 97% effective. At 90% it is worse." },
          { "text": "More than 100%, which is impossible", "correct": true, "why": "93% ÷ 0.9 ≈ 104%. Even vaccinating everyone would leave too many people unprotected." }
        ],
        "set": { "efficacy": "0.9" },
        "expect": "critical > 1",
        "notice": "Coverage needed = {threshold} ÷ {efficacy} = **{critical}**. Even vaccinating everyone would leave measles room to spread. That is why measles vaccination uses two doses, about 97% effective together, and why measles is the first disease to return when coverage slips."
      },
      "takeaway": "Coverage needed = threshold ÷ vaccine effectiveness, so for very contagious diseases every gap counts."
    },
    {
      "id": "two-towns",
      "title": "Two towns, one virus",
      "kicker": "Side by side",
      "body": [
        "Put it all together. Two towns of [[population]] face measles (R₀ {rZero}) with a vaccine that is {efficacy} effective. Town A vaccinates 70% of people. Town B vaccinates 95%.",
        "The model solves the ((final size equation)) to estimate how many people an outbreak eventually reaches."
      ],
      "start": { "rZero": 15, "efficacy": 0.97, "coverage": 0.7, "population": 10000 },
      "visuals": [
        {
          "kind": "compare",
          "title": "Town A against Town B",
          "scenarios": [
            { "label": "Town A · 70%", "set": { "coverage": "0.7" }, "color": "orange" },
            { "label": "Town B · 95%", "set": { "coverage": "0.95" }, "color": "teal" }
          ],
          "metrics": [
            { "label": "Effective R", "value": "reff", "format": "dp2", "better": "lower" },
            { "label": "Share of town infected", "value": "infectedShare", "format": "pct1", "better": "lower" },
            { "label": "People infected", "value": "infectedPeople", "format": "int", "prefix": "≈", "unit": "people", "better": "lower" }
          ]
        },
        {
          "kind": "stack",
          "title": "Your town at the current coverage",
          "parts": [
            { "label": "Protected by vaccine", "value": "protectedShare", "color": "teal" },
            { "label": "Infected", "value": "infectedShare", "color": "red" },
            { "label": "Unprotected but spared", "value": "max(0, 1 - protectedShare - infectedShare)", "color": "blue" }
          ],
          "shape": "bar",
          "format": "pct1"
        }
      ],
      "controls": [
        { "kind": "slider", "var": "coverage", "label": "Your town's coverage" }
      ],
      "predict": {
        "prompt": "Your town starts like Town A. If it vaccinated 95% instead of 70%, how many people would catch measles?",
        "options": [
          { "text": "About a quarter fewer, since coverage rose by 25 points", "why": "Proportional thinking again. Near the threshold, each extra percent of coverage breaks chains for everyone, so the effect is far bigger than the change." },
          { "text": "About half as many", "why": "Halving would already be a big win, but the real drop is much larger, because effective R falls from about 4.8 to about 1.2." },
          { "text": "More than ten times fewer", "correct": true, "why": "In this model the outbreak reaches about 32% of Town A but only about 2% of Town B: more than ten times fewer people." }
        ],
        "set": { "coverage": "0.95" },
        "expect": "infectedShare < 0.03",
        "notice": "At 70% coverage measles reaches about a third of the town; at {coverage} it reaches about **{infectedShare}**, roughly {infectedPeople} out of {population}. A 25-point rise in coverage cut infections more than tenfold, because it pushed effective R down to {reff}, right next to the tipping point."
      },
      "challenge": {
        "prompt": "Find the lowest coverage at which measles cannot take off in your town at all.",
        "when": "reff < 1 && coverage < 0.975",
        "success": "At {coverage} coverage effective R is {reff}: outbreaks fizzle. One percentage point lower and measles can spread again.",
        "hint": "Divide the 93% threshold by the vaccine's 97% effectiveness."
      },
      "takeaway": "Near the threshold, each extra percent of coverage prevents far more than a percent of cases."
    }
  ],
  "glossary": [
    { "term": "R₀", "definition": "The basic reproduction number: how many people one case infects, on average, when nobody around them is immune." },
    { "term": "Exponential growth", "definition": "Growth by the same factor at every step, such as doubling each generation. It starts slowly and then explodes." },
    { "term": "Log scale", "definition": "An axis on which each step multiplies by the same factor (here 10), so exponential growth or decline draws a straight line." },
    { "term": "Effective R", "definition": "How many people one case infects right now, given the immunity already in the population. Above 1 an outbreak grows; below 1 it shrinks." },
    { "term": "Herd immunity threshold", "definition": "The share of people who must be immune for effective R to fall below 1. In the simplest model it is 1 − 1/R₀." },
    { "term": "Herd immunity", "definition": "The protection that people who are not immune get when enough people around them are immune that chains of infection break." },
    { "term": "Vaccine effectiveness", "definition": "The share of vaccinated people who are actually protected. A 90% effective vaccine leaves 1 in 10 vaccinated people unprotected." },
    { "term": "Final size equation", "definition": "z = 1 − e^(−R·z): in the simplest outbreak model, the share z of unprotected people that an outbreak with effective R eventually infects. The model solves it numerically." }
  ],
  "wrapUp": {
    "heading": "What you discovered",
    "body": [
      "An outbreak is a chain, and every link multiplies by effective R. Above 1 the chain grows exponentially; below 1 it fizzles. Vaccination doesn't change how contagious a disease is. It removes links from the chain, and once enough links are gone, even people who could not be vaccinated are protected.",
      "How many is “enough” depends on the disease: about a quarter of people for seasonal flu, over 93% for measles, and more again when vaccines are imperfect or the unvaccinated cluster together."
    ],
    "takeaways": [
      "Cases multiply by **R₀** every generation; small changes in R₀ make huge differences.",
      "Outbreaks grow when **effective R** is above 1 and shrink when it is below 1.",
      "Effective R = R₀ × the share of people still unprotected.",
      "The **herd immunity threshold** is 1 − 1/R₀: about 93% for measles.",
      "Coverage needed = threshold ÷ vaccine effectiveness.",
      "Herd immunity is local: clusters of unvaccinated people can sustain outbreaks."
    ],
    "next": [
      "Go back to the town square at 30% coverage and switch on “Half the town stays home”. How does staying home compare with vaccinating?",
      "In “Averages hide pockets”, raise “How much towns differ” and watch more towns turn red with the same national average.",
      "In “No vaccine is perfect”, find the lowest effectiveness at which polio can still be stopped."
    ]
  }
}
```
