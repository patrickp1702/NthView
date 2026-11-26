# Game — converting Island Quest, Temple Run and Hunter documents

The former views `nthview-island-quest`, `nthview-temple-run` and
`nthview-hunter` became the three games of this view. Their documents convert
with renames and moves only: lessons, questions and activities keep their
words. Validate the result with `scripts/validate.js` and rebuild the HTML.

## Root

| Island Quest | Temple Run | Hunter | Game |
| :- | :- | :- | :- |
| (none) | (none) | (none) | `game`: `"islands"`, `"runner"` or `"stealth"` (keep the old game, or pick another) |
| `islands` | `stretches` | `blocks` | `levels` |
| `companion` `{name}` | `runner` `{name}` | `hunter` `{name}` | `hero` `{name}` |
| `coins` (1–99) | `torches` (1–9) | `picks` (1–9) | `lives` (1–9; drop `coins`, which was not a life) |
| `theme` | `theme` | `theme` | `world.islands.theme`, `world.runner.theme` or `world.stealth.theme` |
| (none) | `chaser` `{name, kind}` | (none) | `world.runner.chaser` |
| (none) | (none) | `guards` `{name}` | `world.stealth.guards` |
| `strictMode` absent | `strictMode` | `strictMode` | `strictMode` (now in every game) |
| `intro`, `finale`, `report` | same | same | unchanged, except below |

`finale`: Island Quest asked every question; add `"ask": <number of
questions>` to keep that. Temple Run and Hunter already have `ask`.

## Levels
Every level keeps `id`, `name`, `color`, `lead`, `body`, `findings`,
`activity`, `quiz`, `checks`, `aside` and `remember`. The world dressing
moves out of the level into `world.<game>.levels`, keyed by the level `id`:

| Old level field | Moves to |
| :- | :- |
| Island Quest `theme` (`grove`, `tower`, …) | `world.islands.levels.<id>.scenery` |
| Temple Run `scenery`, `encounter`, `hazards` | `world.runner.levels.<id>` |
| Hunter `room`, `boss`, `soldiers`, `squad`, `reward` | `world.stealth.levels.<id>` |

For example, Temple Run's `{ "id": "rain", "scenery": "canopy", ... }`
becomes a level without `scenery` plus
`"world": { "runner": { "levels": { "rain": { "scenery": "canopy" } } } }`.

## Activities
Temple Run and Hunter activities are unchanged. Island Quest renames four
types (the fields are identical):

| Island Quest | Game |
| :- | :- |
| `fork` | `gates` |
| `beacons` | `torches` |
| `steps` | `levers` |
| `gather` | `tiles` |

An Island Quest `hotspot` lists parts without positions; it stays valid, and
the card draws such parts in a ring. Every other Island Quest type keeps its
name and fields.

## Wording
Old text sometimes names its world: "run through the lane", "walk to the
crate", "the secret box", "on this island". It plays fine in its own game;
before offering the document as another game, reword such lines so they read
in any world.
