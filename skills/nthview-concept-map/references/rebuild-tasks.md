# Concept Map — choosing and writing rebuild tasks

The rebuild phase is retrieval practice on structure. When it starts, every
task's piece comes apart at once; each task then restores its own piece when
it is solved or skipped. A slip is never counted against the learner: the
view explains it, lets them try again, and lists it with its explanation on
the review screen. The field rules are in `schema.md`; this file is about
choosing and writing good tasks.

## Which type fits which idea

| The idea has… | Use | What it practises |
| :- | :- | :- |
| Concepts that belong to clear groups (roles, stages, actors) | `place` | Organisation: which region a concept lives in |
| An edge whose verb is the insight ("absorbs", not "emits") | `relation` | Precise relationships and their direction of effect |
| A causal link people forget or never notice | `connect` | Recall of the link itself, including its direction |
| A common misconception about one link | `spot` | Discrimination: telling a true link from a plausible false one |
| A process or chain of 3–8 steps | `order` | Sequence and causation |
| A concept defined mostly by its neighbours | `label` | Recall of the concept from its links (elaboration) |

A good rebuild uses at least four types and changes type every one or two
tasks. 6–10 tasks suit a map of 15–30 nodes.

## Ordering tasks
Pieces are restored task by task, so a task cannot rely on something a later
task still holds apart (the validator enforces this):
- `place` nodes sit loose below the map, and their edges are hidden, until
  their task is done. Put `place` tasks first, or at least before any task
  whose edges touch those nodes.
- `order` hides the edges between its steps until it is done.
- `connect` hides its own edge.
- `label` and `relation` only blank text, so they never block other tasks.

## place
Pick 2–4 nodes from **different** clusters whose membership is a real lesson
(a gas versus a sink versus a feedback). Never the root.

```json
{ "id": "place-three", "type": "place", "nodes": ["methane", "forests", "permafrost"],
  "hint": "Ask what each one does: a gas that traps heat, something that soaks up carbon, or a change warming sets off?",
  "why": "Clusters group concepts by role. Methane is a greenhouse gas; forests store carbon (a sink); permafrost thaw is a feedback." }
```
A slip shows the node's definition and asks the learner to think about its role.

## relation
Pick an edge whose verb is the point. Write 3–4 options: the true relation
(exactly as in the edge), its opposite, and one or two relations that belong
to a *different* edge of the map. Give each wrong option a `why`.

```json
{ "id": "rel-forests", "type": "relation", "edge": "e-forests-co2",
  "hint": "What is a growing tree made of, and where did that carbon come from?",
  "why": "Plants build themselves from carbon taken from CO₂ in the air.",
  "options": [
    { "label": "absorb", "correct": true },
    { "label": "emit", "why": "Only when they burn or rot; that link belongs to deforestation." },
    { "label": "strengthen", "why": "That is what greenhouse gases do to the greenhouse effect." }
  ] }
```

## connect
Pick a link between two nodes that are both visible and not already linked.
The relation label is shown as a clue ("? — releases → ?"); the learner taps
the source, then the target. Choosing the right pair the wrong way round gets
its own explanation, so links with a meaningful direction teach most.

```json
{ "id": "connect-permafrost", "type": "connect", "edge": "e-perma-methane",
  "hint": "Frozen Arctic ground holds old plant matter. Which gas do microbes make from it when it thaws?",
  "why": "Thawing permafrost lets microbes release methane, so warming causes the thaw and the thaw causes more warming." }
```

## spot
Pick an edge with a classic misconception and set `wrongRelation` to what
people wrongly believe ("raises" instead of "lowers"). Add 3–5 `candidates`
from the same region, including the target; picking a true candidate shows
that edge's own explanation.

```json
{ "id": "spot-albedo", "type": "spot", "edge": "e-icealb-albedo", "wrongRelation": "raises",
  "candidates": ["e-icealb-albedo", "e-ice-sea", "e-warming-ice", "e-icealb-warming"],
  "hint": "Is open ocean darker or lighter than ice?",
  "why": "Ice reflects most sunlight; water absorbs it. As ice melts, albedo goes down and more sunlight is absorbed." }
```

## order
List 3–8 nodes **in the correct order**; consecutive steps should be linked by
an edge (the validator warns otherwise). The view shuffles them; the learner
drags or uses arrow buttons, then checks. Out-of-place steps are highlighted.

```json
{ "id": "order-trap", "type": "order", "nodes": ["sunlight", "surface", "infrared", "back-radiation"],
  "hint": "Start with what arrives from the Sun, and end with what comes back down.",
  "why": "Sunlight warms the ground, the ground glows in infrared, gases send part of it back down." }
```

## label
Pick a node that its neighbours define well (the panel shows its cluster and
up to six of its links as clues). Options are other plausible concept names,
ideally real nodes of the map from other clusters.

```json
{ "id": "label-ocean", "type": "label", "node": "ocean-uptake",
  "hint": "It sits with the carbon sinks, and it is also the cause of acidification.",
  "why": "The ocean dissolves about a quarter of our CO₂, which slows warming but acidifies the water.",
  "options": [
    { "label": "Ocean uptake", "correct": true },
    { "label": "Sea-level rise", "why": "A consequence of melting ice and warming water; it removes no CO₂." },
    { "label": "Water vapour", "why": "A gas in the air that adds to the greenhouse effect." }
  ] }
```

## Writing hints and explanations
- A **hint** points at the reasoning, never at the answer ("Is open ocean
  darker or lighter than ice?", not "It lowers albedo").
- A task **why** is the paragraph worth remembering; it is shown after the
  task whether it was solved, slipped or skipped.
- An option **why** grants what is reasonable about the wrong choice, then
  says what it misses, in one or two sentences.
