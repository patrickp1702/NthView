# Explorable Lab — choosing visualisations and controls

`references/schema.md` is the source of truth for every field. This file is
the craft guide: which picture fits which idea, and a working snippet for
each kind and control. All snippets assume a model with the ids they use.

## Pick by the shape of the idea

| The idea is about… | Use | Why it works |
| :- | :- | :- |
| A quantity changing smoothly with another (growth, decay, a threshold crossing) | `line` (add `marker` at the current value; `logY` for exponential) | The learner sees the whole relationship and where they are on it |
| One number that matters, with a good and a bad side | `gauge` with `zones` | The needle crossing a zone boundary is the "aha" |
| A few headline numbers | `number` | Big, live, readable at a glance |
| A handful of magnitudes to compare | `bars` (`horizontal` for long labels, `alert` for "impossible" or "over the limit") | Lengths are the easiest comparison for the eye |
| Parts of a whole (protected and not, spent and saved) | `stack` (`donut` for one whole, `bar` for a strip) | Shares that must add up to 100% |
| A chain of stages where amounts shrink or grow along the way | `flow` | Animated rates show where the flow is lost |
| Repeated multiplication, step by step, generation by generation | `timeline` (`dots` for counts up to a few hundred, `bars` beyond) | Replaying the sequence makes compounding visible |
| "This versus that" under the same model | `compare` | Two columns, paired bars and a ratio do the arithmetic for the learner |
| Variation across many cases (towns, people, trials) | `scatter` with `highlight` | Individual dots expose spread that an average hides |
| Individuals moving and interacting (contagion, collisions, markets) | `agents` | Emergent behaviour from simple rules, with randomness made visible |
| Neighbours, clusters, spatial spread (fires, households, cells) | `grid` | Local rules on a field show percolation and pockets |

Rules of thumb:

- One idea, one or two visuals. A third visual is for a readout (`number`).
- Pair a precise picture with an intuitive one: a `gauge` with a `line`, an
  `agents` run with a `number`, a `grid` with a `scatter`.
- Use every kind at most twice in a lab; the validator warns when five or
  more steps use only one or two kinds.
- Simulations (`agents`, `grid`) should agree with the formulas around them.
  Calibrate `chance` by trying the extremes before writing the notice text,
  and say in a caption that runs vary.

## Pick a control

| Control | Use for |
| :- | :- |
| `slider` | Any continuous variable; the default |
| `stepper` | Small whole numbers where each step matters (contacts, years, players) |
| `toggle` | A yes/no variable with `min` 0 and `max` 1 (or any two values: off is `min`, on is `max`) |
| `choice` | Named presets (diseases, planets, interest rates) |
| `play` | A variable the learner should watch sweep (time, coverage, distance); `loop` for cycles |
| `button` | A discrete action ("vaccinate 10% more", "double it") written as `set` expressions |
| `[[id]]` in the body | The one number the paragraph is about; the learner drags it in the text |

## Snippets

### bars
```json
{ "kind": "bars", "title": "Coverage needed", "format": "pct", "max": "1.2", "horizontal": true,
  "bars": [
    { "label": "Flu", "value": "(1 - 1 / 1.3) / efficacy", "color": "blue" },
    { "label": "Measles", "value": "(1 - 1 / 15) / efficacy", "color": "orange", "alert": "(1 - 1 / 15) / efficacy > 1" }
  ] }
```

### line
```json
{ "kind": "line", "title": "Balance over time", "format": "compact", "yLabel": "Balance",
  "x": { "id": "t", "from": "0", "to": "years", "label": "Years", "format": "int" },
  "series": [
    { "label": "Compound", "y": "principal * pow(1 + rate, t)", "color": "accent" },
    { "label": "Simple", "y": "principal * (1 + rate * t)", "color": "grey", "dashed": true }
  ],
  "marker": "years / 2", "markerLabel": "Halfway" }
```

### scatter
```json
{ "kind": "scatter", "title": "1,000 darts", "count": "darts",
  "x": "u", "y": "v", "xMin": "0", "xMax": "1", "yMin": "0", "yMax": "1",
  "color": "grey", "highlight": "u * u + v * v < 1", "highlightColor": "accent", "highlightLabel": "inside the quarter circle" }
```

### agents
```json
{ "kind": "agents", "title": "A town square",
  "states": [
    { "id": "s", "label": "Susceptible", "color": "blue" },
    { "id": "i", "label": "Infected", "color": "red" },
    { "id": "r", "label": "Recovered", "color": "grey" }
  ],
  "initial": { "s": "197", "i": "3" },
  "rules": [
    { "kind": "contact", "from": "s", "to": "i", "with": "i", "chance": "clamp(rZero * 0.05, 0, 1)" },
    { "kind": "timer", "from": "i", "to": "r", "chance": "1 / 90" }
  ],
  "still": "distancing", "ticks": 1500 }
```
A `split` rule makes agents reproduce: `{ "kind": "split", "from": "cell", "chance": "growth" }`.

### grid
```json
{ "kind": "grid", "title": "A forest", "rows": 40, "cols": 40, "neighbors": 4,
  "states": [
    { "id": "tree", "label": "Tree", "color": "green" },
    { "id": "fire", "label": "Burning", "color": "orange" },
    { "id": "ash", "label": "Burnt", "color": "grey" },
    { "id": "gap", "label": "Clearing", "color": "amber" }
  ],
  "cell": "if(col == 0, 1, if(u < density, 0, 3))",
  "rules": [
    { "kind": "contact", "from": "tree", "to": "fire", "with": "fire", "chance": "0.9" },
    { "kind": "timer", "from": "fire", "to": "ash", "chance": "0.5" }
  ] }
```
Without `rules` a grid is a static unit chart, for example
`"cell": "if(i < round(share * rows * cols), 1, 0)"`.

### gauge
```json
{ "kind": "gauge", "title": "Effective R", "value": "reff", "min": "0", "max": "4", "format": "dp2",
  "zones": [ { "to": 1, "color": "green", "label": "Shrinks" }, { "to": 1000, "color": "red", "label": "Grows" } ] }
```

### number
```json
{ "kind": "number", "items": [
  { "label": "After 30 years", "value": "balance", "format": "int", "prefix": "$", "color": "accent" },
  { "label": "Interest earned", "value": "balance - principal", "format": "compact", "prefix": "$" }
] }
```

### stack
```json
{ "kind": "stack", "title": "Where the money went", "shape": "donut", "format": "int", "prefix": "$",
  "parts": [ { "label": "Deposits", "value": "principal", "color": "blue" }, { "label": "Interest", "value": "balance - principal", "color": "accent" } ] }
```

### flow
```json
{ "kind": "flow", "title": "The sales funnel", "format": "int",
  "stages": [ { "label": "Visitors", "value": "visitors" }, { "label": "Sign-ups", "value": "visitors * signup" }, { "label": "Buyers", "value": "visitors * signup * buy" } ],
  "links": [ { "rate": "visitors * signup", "label": "sign up" }, { "rate": "visitors * signup * buy", "label": "buy" } ] }
```

### timeline
```json
{ "kind": "timeline", "title": "Doubling", "frames": "11", "value": "pow(2, k)", "display": "bars",
  "label": "Day {k}: **{value|int}** bacteria", "frameMs": 600, "color": "lime" }
```

### compare
```json
{ "kind": "compare", "title": "Start at 25 or at 35",
  "scenarios": [ { "label": "Start at 25", "set": { "years": "40" } }, { "label": "Start at 35", "set": { "years": "30" } } ],
  "metrics": [ { "label": "Balance at 65", "value": "balance", "format": "compact", "prefix": "$", "better": "higher" } ] }
```

### controls
```json
[
  { "kind": "slider", "var": "rate" },
  { "kind": "stepper", "var": "years" },
  { "kind": "toggle", "var": "monthly", "label": "Compound monthly" },
  { "kind": "choice", "var": "rate", "label": "Account", "options": [ { "label": "Savings 2%", "value": 0.02 }, { "label": "Index 7%", "value": 0.07 } ] },
  { "kind": "play", "var": "years", "duration": 8 },
  { "kind": "button", "label": "Double the rate", "set": { "rate": "min(0.2, rate * 2)" } }
]
```

## Writing the predict block

```json
"predict": {
  "prompt": "The rate doubles from 5% to 10%. After 30 years, how much bigger is the balance?",
  "options": [
    { "text": "Twice as big", "why": "That is how simple interest behaves. Compounding multiplies the gap every year." },
    { "text": "About 4 times as big", "correct": true, "why": "1.10³⁰ ÷ 1.05³⁰ ≈ 17.4 ÷ 4.3 ≈ 4." },
    { "text": "About the same", "why": "Rates feel small, but they act on a growing balance every year." }
  ],
  "set": { "rate": "rate * 2" },
  "expect": "balance > 3.5 * principal * pow(1.05, 30)",
  "notice": "The balance is now **{balance}**. Doubling the rate did far more than double the result."
}
```

- The `set` runs from the step's `start` values, so write `start` for every
  variable the question assumes.
- Write `expect` so it is true only if the correct option is right; the
  validator evaluates it.
- `notice` uses live placeholders so it stays true if the learner replays or
  keeps tinkering.
