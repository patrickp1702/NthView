# Island Quest data schema — schemaVersion 1

## Overview
The data describes a small 3D adventure: the learner walks with a companion
character across a ring of islands, each island is one short lesson with an
optional hands-on activity and a one-question quiz, and finishing every island
unlocks a final exam and a report card. Everything the player reads, every
activity and every quiz comes from this JSON; the renderer supplies the world.

Text fields accept one inline mark-up: `**bold**`. Nothing else is interpreted.
Character limits count JavaScript string length, so one emoji counts as 2.

## External libraries
The renderer loads **three.js r128** from cdnjs and two Google Fonts (see
`NthView.libs` in `assets/view.js`). The output is still one file, but it
needs internet access the first time it opens.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–60 chars | Game title: HUD badge, intro heading, page title |
| `subtitle` | string | no | ≤160 chars | One line under the intro heading |
| `companion` | object | yes | see Companion | The character that follows the player |
| `coins` | integer | no | 1–99, default 10 | Starting coins; each guess costs one, every bridge holds three |
| `intro` | object | yes | see Intro | The start screen |
| `islands` | array | yes | 3–9 Island objects | One lesson per island, in play order |
| `finale` | object | yes | see Finale | The exam that opens after every island is done |
| `report` | object | yes | see Report | The end screen |

## Companion object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–20 chars | Used in HUD and guide text, e.g. "Robo" |

## Intro object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `paragraphs` | string[] | yes | 1–4 items, each 1–400 chars | Story set-up shown on the start card |
| `steps` | string[] | no | 0–5 items, each 1–300 chars | Numbered "how it works" list |
| `note` | string | no | ≤300 chars | Small print under the list (e.g. the source) |

## Island object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–30 chars, unique | Stable key for scores |
| `name` | string | yes | 1–40 chars | Island name on the 3D label and the panel |
| `theme` | string | yes | one of `grove`, `tower`, `arena`, `workshop`, `canyon`, `hall`, `clock`, `plain` | Decorative scenery on the island. Any theme works with any activity; SKILL.md suggests pairings |
| `color` | string | no | `#rrggbb` | Accent colour; defaults to a built-in palette by position |
| `lead` | string | yes | 1–600 chars | Opening paragraph of the lesson |
| `body` | string[] | no | 0–3 items, each 1–600 chars | Further paragraphs |
| `activity` | object | no | see Activities | Hands-on part; omit for a read-only lesson |
| `findings` | object | no | see Findings | Bar chart of results |
| `aside` | object | no | `title` 1–60, `text` 1–600 | Extra box shown after the activity |
| `quiz` | object | conditional | see Quiz | Required unless `activity.type` is `pads`; forbidden when it is |
| `remember` | string | yes | 1–300 chars | One-line takeaway shown once the island is solved |

## Findings object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `caption` | string | no | ≤200 chars, default "Right answers out of 100 questions" | Line above the bars |
| `rows` | array | yes | 1–8 Row objects | One bar each |
| `text` | string | no | ≤600 chars | Paragraph under the bars |
| `after` | boolean | no | default `false` | `true` shows the findings only once the island is solved. Use it when the bars would give away a `pads` answer or a `collect` vote |

Row: `label` (string, 1–80), `value` (number, 0–100, bar length), `show`
(string, 1–12, printed next to the bar), `style` (one of `normal`, `grey`,
`dashed`; default `normal`).

## Quiz object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `question` | string | yes | 1–300 chars | |
| `options` | array | yes | 2–4 Option objects, exactly one `correct` | |
| `okText` | string | no | ≤200 chars, default "Correct!" | Shown on the right answer |

Option: `text` (string, 1–200), `correct` (boolean, optional; `false` is
accepted and means the same as omitting it), `why` (string, ≤300, optional
feedback for a wrong pick).

## Activities

Every activity has `type` and an optional `title` (1–60 chars, default
"Try it"). The remaining fields depend on `type`.

### `collect` — walk into scattered answers and hold a vote

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400; task text shown before collecting |
| `items` | string[] | yes | 3–9 items, each 1–3 chars; the answers to pick up. Short tokens such as letters; the orbs show only the token, so explain what each stands for in `lead`, `body` or `prompt` |
| `resultTitle` | string | no | ≤60, default "The vote" |
| `resultText` | string | yes | 1–200; may use `{top}`, `{count}`, `{total}` |
| `resultNote` | string | no | ≤300; small print under the result |

### `pads` — stand on a pad to choose (replaces the quiz)

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `prompt` | string | yes | 1–400 |
| `options` | array | yes | 2–4 Pad objects |
| `answer` | string | yes | the `id` of the correct pad |

Pad: `id` (kebab-case, unique), `label` (1–12 chars shown on the pad),
`hint` (≤300, toast when chosen wrongly), `bars` (optional `[grey, colour]`,
two numbers 0–100 drawn as a column pair behind the pad), `size` (optional
number 0.5–4, draws a figure of that height behind the pad).

### `story` — step through a short story

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `buttonLabel` | string | yes | 1–40 |
| `resetLabel` | string | no | ≤40, default "Start over" |
| `frames` | string[] | yes | 2–8 items, each 1–300 |
| `caption` | string | no | ≤300 |

### `tune` — move controls and watch a model react

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `controls` | array | yes | 1–3 Control objects |
| `readout` | array | yes | 1–4 Readout objects; the first whose `when` is true (or has none) is shown |
| `visual` | object | no | `kind` one of `circle`, `grid`; `count` expr; `extra` expr; `leader` boolean (grid only). See below |
| `tally` | object | no | `count` expr, `icon` one emoji or 1–2 characters, `max` integer 1–60 (default 30) |
| `outcomes` | object | no | `buttonLabel` 1–40; `cases` 1–8 of `{when, text, tone}`; `fallback` `{text, tone}` |
| `caption` | string | no | ≤300 |

Control: `id` (`^[a-z][a-z0-9]*$`, unique), `label` (1–60), `min`, `max`,
`value` (integers, `min < max`, `min ≤ value ≤ max`).
Readout: `when` (expr, optional), `text` (1–300, may contain `{expr}`).
Tone: one of `ok`, `note`, `no`.

**Expressions** may contain numbers, control ids, `+ - * / %`, comparisons
`== != < <= > >=`, `&& || !` and parentheses. Nothing else. `{expr}` inside a
readout text is replaced by its value.

**What the visual draws on the island** (values are rounded and clamped):
- `circle`: `count` figures standing in a ring (0–12) and `extra` paper slabs
  stacked in the middle (0–36). Good for "members" and "notes" or "rounds".
- `grid`: `count` cubes per row (1–8) and `extra` rows (0–6), wired to the
  next row; `leader: true` adds one glowing node on top. Good for layered
  teams or pipelines.

`tally.count` is rounded to a whole number and shown as that many `icon`s in
the panel, capped at `max`.

### `race` — press a button and watch bars race

| Field | Type | Required | Constraints |
| :- | :- | :- | :- |
| `buttonLabel` | string | yes | 1–40 |
| `bars` | array | yes | 2–4 of `{label 1–80, value 0–100, show 1–12, tag ≤12}` |
| `caption` | string | no | ≤300 |

`tag` is the short word drawn on the 3D gear; it defaults to the first word
of `label`. A larger `value` means a longer or slower thing: in the panel its
bar is longer, and on the island its gear spins faster and glows. The bars
start empty and animate when the button is pressed.

## Finale object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `name` | string | yes | 1–40 | Shown on the centre label and guide |
| `lead` | string | yes | 1–400 | Intro paragraph of the exam |
| `questions` | array | yes | 1–6 Quiz objects | Asked one after another |

## Report object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | yes | 1–60 | e.g. "Robo passed!" |
| `tiers` | object | no | `perfect`, `great`, `pass` strings ≤200 | Message for all stars / ≥80% / otherwise |
| `lessons` | string[] | yes | 1–12 items, each 1–200 | "What you learned" list |
| `glossaryIntro` | string | no | ≤200 | Line above the glossary |
| `glossaryColumns` | string[] | no | exactly 2 items, ≤30 each | Table headings, default "In this game" / "In the paper" |
| `glossary` | array | no | 0–12 of `{term 1–60, meaning 1–120}` | Game word → real term |
| `source` | object | no | `label` 1–200, `url` (http or https, optional), `note` ≤300 | Citation; rendered as a link when `url` is given |

## Cross-field rules
- `islands[i].id` must be unique across islands.
- If `islands[i].activity.type` is `pads`, `islands[i].quiz` must be absent;
  in every other case `islands[i].quiz` is required.
- `activity.answer` must equal one `activity.options[j].id`; pad ids unique.
- Every quiz (island and finale) has exactly one option with `correct: true`.
- Every expression in a `tune` activity must parse and reference only that
  activity's control ids.
- `tune.visual.leader` is only allowed when `kind` is `grid`.
- `report.glossaryColumns`, when present, has exactly two entries.

## Warnings (non-blocking)
- Fewer than 5 islands ("5–7 make a fuller quest"), or more than 7 (the ring
  gets crowded).
- A `findings` object without `text`.
- A wrong quiz option without a `why`.
- `collect.items` where no answer is a clear majority.
- An island without an activity (read-only lesson).

## Complete example
The complete example is the Exam Island game, a learning game about the paper
"Multi-Agent Reasoning Improves Compute Efficiency" (arXiv 2605.01566). The
JSON block below is also the data embedded in `examples/example.html`.
Build that file with:

    node scripts/build-html.js skills/nthview-island-quest --example skills/nthview-island-quest/examples/example.html

```json
{
  "schemaVersion": 1,
  "title": "Exam Island",
  "subtitle": "A beginner's game about how an AI should spend its thinking time",
  "companion": {
    "name": "Robo"
  },
  "coins": 10,
  "intro": {
    "paragraphs": [
      "Robo is an AI with a big exam coming up. It gets more answers right if it thinks longer, but thinking takes time, and time costs money.",
      "You're Robo's coach. Robo tags along behind you. Visit 7 islands, one short lesson each, to find the smartest way for Robo to spend its time."
    ],
    "steps": [
      "Press **Walk me there** at the bottom of the screen, or follow the arrow yourself. Pick up the coins on the bridges on your way.",
      "Read the short lesson and try the experiment. On some islands you'll walk around to collect answers or stand on a pad to choose.",
      "Answer one easy question. Each guess costs a coin. First try earns 3 stars."
    ],
    "note": "Based on a real 2026 research paper from the University of Göttingen."
  },
  "islands": [
    {
      "id": "ask-again-grove",
      "name": "Ask-Again Grove",
      "theme": "grove",
      "lead": "Instead of asking Robo a question once, ask the same question many times. Robo's answer comes out a little different each time. Then go with the answer that comes up most often, like a class vote.",
      "activity": {
        "type": "collect",
        "prompt": "Robo already answered this question 7 times. Its answers are the glowing letters scattered around the grove. Walk into all 7 to collect them. Each one is a vote.",
        "items": [
          "B",
          "A",
          "B",
          "C",
          "B",
          "D",
          "B"
        ],
        "resultTitle": "The vote",
        "resultText": "Most popular answer: {top} ({count} of {total} votes)",
        "resultNote": "Three other letters got one vote each. The vote smooths out Robo's occasional slip."
      },
      "findings": {
        "rows": [
          {
            "label": "Asking once",
            "value": 64,
            "show": "64"
          },
          {
            "label": "Asking 10 times and voting",
            "value": 69,
            "show": "69"
          }
        ],
        "text": "It helped a little. But after about 10 tries, asking more times stopped helping.",
        "after": true
      },
      "quiz": {
        "question": "What happened after about 10 tries?",
        "options": [
          {
            "text": "It kept getting better and better",
            "why": "Look at the box above: after about 10 tries it stopped helping."
          },
          {
            "text": "It stopped getting better",
            "correct": true
          }
        ]
      },
      "remember": "Asking again and voting helps a little, but only up to about 10 tries. It's the best choice when Robo has only a little extra time."
    },
    {
      "id": "rewrite-tower",
      "name": "Rewrite Tower",
      "theme": "tower",
      "lead": "Robo writes an answer, then checks its own work and rewrites it. Then it checks again and rewrites again. Sounds smart, right?",
      "activity": {
        "type": "story",
        "buttonLabel": "Let Robo check and rewrite",
        "resetLabel": "Start over",
        "frames": [
          "First answer: **B**. That happens to be right.",
          "Robo checks its own work: \"Hmm, maybe I missed something.\" It rewrites. Still **B**, but less sure.",
          "Robo checks again: \"Actually, C sounds better.\" It rewrites. New answer: **C**. Now it's wrong.",
          "More time spent, and a worse answer. Nobody new looked at the work, so Robo just argued with itself."
        ],
        "caption": "A made-up example of what can go wrong."
      },
      "findings": {
        "rows": [
          {
            "label": "Answering once",
            "value": 64,
            "show": "64"
          },
          {
            "label": "Checking and rewriting",
            "value": 55,
            "show": "fewer",
            "style": "dashed"
          }
        ],
        "text": "Rewriting took more time and still got fewer right than just answering once. This happened every time they tried it."
      },
      "quiz": {
        "question": "Did checking and rewriting its own answer help Robo?",
        "options": [
          {
            "text": "Yes, it got better",
            "why": "That's what most people expect, but the box above shows the opposite."
          },
          {
            "text": "No, it did worse than answering once",
            "correct": true
          }
        ]
      },
      "remember": "When an AI checks its own work with no outside help, it often talks itself out of the right answer."
    },
    {
      "id": "argue-club",
      "name": "Argue Club",
      "theme": "arena",
      "lead": "Now there are several Robos. They each answer, then read each other's answers and argue for a few rounds. At the end, they vote.",
      "activity": {
        "type": "tune",
        "controls": [
          {
            "id": "a",
            "label": "Robos in the club",
            "min": 2,
            "max": 6,
            "value": 3
          },
          {
            "id": "r",
            "label": "Rounds",
            "min": 1,
            "max": 4,
            "value": 2
          }
        ],
        "readout": [
          {
            "when": "r == 1",
            "text": "Only one round: nobody reads anyone else's notes yet."
          },
          {
            "text": "In the last round, each Robo has to read {a*(r-1)} old notes."
          }
        ],
        "tally": {
          "count": "a*(r-1)",
          "icon": "📄",
          "max": 30
        },
        "visual": {
          "kind": "circle",
          "count": "a",
          "extra": "a*(r-1)"
        },
        "caption": "Everyone keeps all the old notes, so each extra round makes the pile bigger. Watch the stack grow in the ring outside."
      },
      "findings": {
        "rows": [
          {
            "label": "Best club: 4 Robos, 2 rounds",
            "value": 70,
            "show": "70"
          },
          {
            "label": "Asking once",
            "value": 64,
            "show": "64",
            "style": "grey"
          }
        ],
        "text": "Adding Robos helped, up to 4. More than that made it worse. Adding rounds of arguing didn't help, and sometimes hurt."
      },
      "quiz": {
        "question": "What helped the club more?",
        "options": [
          {
            "text": "More Robos (up to 4)",
            "correct": true
          },
          {
            "text": "More rounds of arguing",
            "why": "Extra rounds just piled up notes. Check the box above."
          }
        ]
      },
      "remember": "Add more Robos to the club, not more rounds of arguing."
    },
    {
      "id": "team-workshop",
      "name": "Team Workshop",
      "theme": "workshop",
      "lead": "A team of Robo helpers each write an answer. The next row of helpers reads those answers and writes better ones. At the end, one leader combines the best parts into the final answer.",
      "body": [
        "The trick: each row only reads the row right before it, so nobody carries a growing pile of old notes."
      ],
      "activity": {
        "type": "tune",
        "title": "Try it: build a team",
        "controls": [
          {
            "id": "h",
            "label": "Helpers in each row",
            "min": 2,
            "max": 6,
            "value": 3
          },
          {
            "id": "s",
            "label": "Steps (the leader is the last step)",
            "min": 2,
            "max": 5,
            "value": 2
          }
        ],
        "readout": [
          {
            "text": "Answers written: {h*(s-1)+1} ({h} helpers × {s-1} row(s), plus 1 leader)"
          }
        ],
        "visual": {
          "kind": "grid",
          "count": "h",
          "extra": "s-1",
          "leader": true
        },
        "outcomes": {
          "buttonLabel": "Test this team",
          "cases": [
            {
              "when": "h == 5 && s == 4",
              "text": "71 out of 100. That's the best score in the whole study!",
              "tone": "ok"
            },
            {
              "when": "h == 3 && s == 2",
              "text": "70 out of 100. A good team shape. Now try the bigger one: 5 helpers, 4 steps.",
              "tone": "note"
            },
            {
              "when": "h == s + 1",
              "text": "Good shape! This was one of the most efficient teams. Now try 5 helpers, 4 steps.",
              "tone": "note"
            }
          ],
          "fallback": {
            "text": "This team didn't do as well. Hint: the best teams always had one more helper than steps.",
            "tone": "no"
          }
        },
        "caption": "Testing is free. Try to build the best team from the study: 5 helpers in each row and 4 steps. Watch it grow on the island."
      },
      "findings": {
        "rows": [
          {
            "label": "Team with a leader (5 helpers, 4 steps)",
            "value": 71,
            "show": "71"
          },
          {
            "label": "Argue Club, best",
            "value": 70,
            "show": "70",
            "style": "grey"
          },
          {
            "label": "Asking 10 times",
            "value": 69,
            "show": "69",
            "style": "grey"
          },
          {
            "label": "Asking once",
            "value": 64,
            "show": "64",
            "style": "grey"
          }
        ],
        "text": "The team with a leader beat every other method. And the best teams always had **one more helper than steps**: 3 helpers with 2 steps, 4 with 3, 5 with 4."
      },
      "quiz": {
        "question": "What did the best teams have in common?",
        "options": [
          {
            "text": "One more helper than steps",
            "correct": true
          },
          {
            "text": "Lots of steps and only a few helpers",
            "why": "The box above says the best teams had more helpers, not more steps."
          },
          {
            "text": "Just one helper",
            "why": "One helper isn't a team. Check the box above."
          }
        ]
      },
      "remember": "A team with a leader was the winner of the whole study. Best shape: one more helper than steps."
    },
    {
      "id": "hard-question-canyon",
      "name": "Hard Question Canyon",
      "theme": "canyon",
      "lead": "The scientists split the exam into easy, medium and hard questions. Then they checked: where does extra thinking time help the most?",
      "body": [
        "Look at the three pairs of columns on this island. Grey is Robo answering once. Colour is Robo with lots of extra time."
      ],
      "activity": {
        "type": "pads",
        "prompt": "Find the pair of columns that grew the most. Stand on the pad in front of it, then press **Choose this one**. A wrong pad costs a coin, like a wrong guess.",
        "options": [
          {
            "id": "easy",
            "label": "Easy",
            "bars": [
              94,
              97
            ],
            "hint": "Easy questions were already almost all right. Look how little the easy pair grew."
          },
          {
            "id": "medium",
            "label": "Medium",
            "bars": [
              53,
              62
            ],
            "hint": "Close! Medium grew a lot, but one pair more than doubled. Compare the hard pair."
          },
          {
            "id": "hard",
            "label": "Hard",
            "bars": [
              8,
              17
            ]
          }
        ],
        "answer": "hard"
      },
      "findings": {
        "caption": "Right answers out of 100. Grey: answering once. Colour: with lots of extra time.",
        "rows": [
          {
            "label": "Easy questions, answering once",
            "value": 94,
            "show": "94",
            "style": "grey"
          },
          {
            "label": "Easy questions, with extra time",
            "value": 97,
            "show": "97"
          },
          {
            "label": "Medium questions, answering once",
            "value": 53,
            "show": "53",
            "style": "grey"
          },
          {
            "label": "Medium questions, with extra time",
            "value": 62,
            "show": "62"
          },
          {
            "label": "Hard questions, answering once",
            "value": 8,
            "show": "8",
            "style": "grey"
          },
          {
            "label": "Hard questions, with extra time",
            "value": 17,
            "show": "17"
          }
        ],
        "text": "Hard questions gained the most: from 8 to 17, more than double. Easy questions were already almost all right, so extra time barely changed them.",
        "after": true
      },
      "remember": "Save extra thinking time for hard questions. Easy ones are already right."
    },
    {
      "id": "giants-hall",
      "name": "Giant's Hall",
      "theme": "hall",
      "lead": "Two choices. A big, smart AI that answers once. Or a small AI that uses every trick from the earlier islands, with lots of extra time.",
      "findings": {
        "rows": [
          {
            "label": "Big AI, answering once",
            "value": 64,
            "show": "64"
          },
          {
            "label": "Small AI, every trick and lots of time",
            "value": 53,
            "show": "53 max",
            "style": "dashed"
          }
        ],
        "text": "No matter how much extra time the small AI got, it never got past 53."
      },
      "activity": {
        "type": "pads",
        "prompt": "Walk over to the AI that did better and stand on its pad, then press **Choose this one**.",
        "options": [
          {
            "id": "big",
            "label": "Big",
            "size": 2.9
          },
          {
            "id": "small",
            "label": "Small",
            "size": 1,
            "hint": "The small AI never got past 53, even with every trick. The big AI got 64 answering once."
          }
        ],
        "answer": "big"
      },
      "remember": "A smarter AI answering once can beat a weaker AI thinking really hard. If you can afford the big one, use it."
    },
    {
      "id": "clock-tower",
      "name": "Clock Tower",
      "theme": "clock",
      "lead": "How do you measure what thinking costs? The scientists used real time on a clock.",
      "body": [
        "Here's the surprise. Robo's knowledge (its \"brain\") is huge and lives in the computer's memory. While Robo writes its answer word by word, the computer has to fetch that brain again and again, like walking back to the library every few words. Most of the waiting is the walking, not the thinking."
      ],
      "activity": {
        "type": "race",
        "buttonLabel": "Watch Robo write an answer",
        "bars": [
          {
            "label": "Doing the math",
            "value": 8,
            "show": "1 part",
            "tag": "math"
          },
          {
            "label": "Fetching the brain from memory",
            "value": 100,
            "show": "12 parts",
            "tag": "memory"
          }
        ],
        "caption": "Worked out with the paper's own formulas and computer setup: while Robo writes, fetching takes about 12 times as long as the math. On the island, the glowing gear is the slow one."
      },
      "aside": {
        "title": "Why it matters",
        "text": "Older studies only counted the math. The scientists counted real time, fetching included. That's how they compared every method fairly."
      },
      "quiz": {
        "question": "While Robo writes its answer, what takes most of the time?",
        "options": [
          {
            "text": "Doing the math",
            "why": "The math is the short bar. Press the button above and watch."
          },
          {
            "text": "Fetching its brain from memory",
            "correct": true
          }
        ]
      },
      "remember": "Measure cost as real time on the clock, not just the amount of math."
    }
  ],
  "finale": {
    "name": "The big exam",
    "lead": "Robo's exam is here. For each situation, pick the smartest way for Robo to spend its time.",
    "questions": [
      {
        "question": "Robo has only a little extra time. What should it do?",
        "options": [
          {
            "text": "Ask the question a few times and vote",
            "correct": true
          },
          {
            "text": "Build a team with a leader",
            "why": "A good team needs more time than Robo has here."
          },
          {
            "text": "Check and rewrite its own answer",
            "why": "Rewriting made Robo worse, remember?"
          }
        ],
        "okText": "Correct! With only a little time, asking again and voting is the best pick."
      },
      {
        "question": "Now Robo has lots of extra time. What's the best use of it?",
        "options": [
          {
            "text": "Ask the same question 100 times",
            "why": "Asking again stopped helping after about 10 tries."
          },
          {
            "text": "Build a team with a leader",
            "correct": true
          },
          {
            "text": "Argue for many, many rounds",
            "why": "More rounds of arguing didn't help."
          }
        ],
        "okText": "Correct! The team with a leader, with one more helper than steps, was the overall winner."
      },
      {
        "question": "Last one. You can use a big, smart AI answering once, or a small AI with lots of extra time. Which?",
        "options": [
          {
            "text": "The big AI answering once",
            "correct": true
          },
          {
            "text": "The small AI with lots of time",
            "why": "The small AI never got past 53. The big AI got 64 answering once."
          }
        ],
        "okText": "Correct! A smarter AI can beat a weaker AI that thinks for a long time."
      }
    ]
  },
  "report": {
    "heading": "Robo passed!",
    "tiers": {
      "perfect": "Every answer right on the first try. Robo could not have had a better coach.",
      "great": "Almost perfect. Robo is very proud of you.",
      "pass": "You got Robo through! Play again to see if you can earn more stars."
    },
    "lessons": [
      "Asking again and voting helps a little, up to about 10 tries.",
      "An AI checking its own work alone often makes things worse.",
      "In a group that argues, add more members, not more rounds.",
      "A team with a leader wins. Use one more helper than steps.",
      "Extra thinking time helps hard questions the most.",
      "A smarter AI answering once can beat a weaker AI thinking hard.",
      "Measure cost as real time on the clock."
    ],
    "glossaryIntro": "Want to read the real paper? These are the names the scientists use:",
    "glossaryColumns": [
      "In this game",
      "In the paper"
    ],
    "glossary": [
      {
        "term": "Asking again and voting",
        "meaning": "Self-consistency"
      },
      {
        "term": "Checking and rewriting",
        "meaning": "Self-refinement"
      },
      {
        "term": "Argue Club",
        "meaning": "Multi-agent debate"
      },
      {
        "term": "Team with a leader",
        "meaning": "Mixture-of-agents"
      },
      {
        "term": "Thinking time",
        "meaning": "Test-time compute"
      }
    ],
    "source": {
      "label": "Multi-Agent Reasoning Improves Compute Efficiency",
      "url": "https://arxiv.org/abs/2605.01566",
      "note": "by Wunderlich and colleagues, University of Göttingen, 2026. Scores are from their tests with Llama 3.1 models on the MMLU-Pro exam."
    }
  }
}
```
