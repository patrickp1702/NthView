# Scenario Quiz data schema — schemaVersion 1

## Overview
The data describes a teaching quiz wrapped in a story. The learner is first
shown a scenario (an organisation, a codebase, a situation) and given a role
in it. Then come questions, one at a time: a situation they must decide, or a
plain question about the concept. Each has several options, exactly one
right; every option carries its own explanation, so a wrong pick teaches as
much as a right one. After the first pick the right answer is named and the
options stay live, so the learner can tap any other option and read why it is
right or wrong before moving on. Only "Next" advances; "Skip" is allowed. At
the end the learner gets a full review of every question and every option,
with their first pick remembered. Nothing is scored against them.

Text fields accept one inline mark-up: `**bold**`. Nothing else is interpreted.
Character limits count JavaScript string length, so one emoji counts as 2.

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `1` | Format version |
| `title` | string | yes | 1–80 chars | Shown on the intro and in the page title |
| `subtitle` | string | no | ≤200 chars | One line under the title |
| `theme` | string | no | one of `midnight`, `sunrise`, `forest`, `paper`, `neon`, `ocean`, `ember`, `lavender` | Visual theme (see Themes). When omitted, one is derived from the title so different documents look different |
| `scenario` | object | yes | see Scenario | The world and the learner's role in it |
| `questions` | array | yes | 1–40 Question objects | Asked in order |
| `summary` | object | yes | see Summary | The end screen |

## Themes
Every theme sets the backdrop gradient and drifting colour fields, glass card
surfaces, accent pair, typography and corner radius, and has both a light and a
dark variant chosen by the reader's system setting.

| Theme | Mood | Type | Suits |
| :- | :- | :- | :- |
| `midnight` | Deep indigo with violet and cyan light | Space Grotesk / Inter | Technology, security, systems |
| `sunrise` | Warm cream with coral and amber | Fraunces / Inter | Workplaces, people, everyday life |
| `forest` | Deep green with moss and gold | Lora / Inter | Health, environment, calm topics |
| `paper` | Editorial off-white, ink and red | Fraunces / Lora | Law, policy, history, reading-heavy |
| `neon` | Black with cyan and magenta glow | Space Grotesk | Games, youth audiences, high energy |
| `ocean` | Airy blue and aqua | Inter | Finance, data, clarity |
| `ember` | Charcoal with orange and gold | Space Grotesk / Inter | Risk, safety, incidents, urgency |
| `lavender` | Soft purple and pink pastels | Nunito | Children, wellbeing, playful topics |

## Scenario object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤60 chars, default "The scenario" | Label above the setting |
| `setting` | string[] | yes | 1–6 items, each 1–600 chars | Paragraphs that paint the organisation, code or situation |
| `role` | object | yes | see below | Who the learner is |
| `goal` | string | no | ≤300 chars | One line on what the learner is trying to achieve |

Role: `title` (string, 1–120, e.g. "You are Sam, the new centre coordinator"),
`description` (string, ≤600, optional detail on duties, pressures, who is
around).

## Question object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `id` | string | yes | kebab-case, 1–40 chars, unique | Stable key |
| `situation` | string | no | ≤900 chars | The concrete moment the learner faces. Omit for a general question |
| `prompt` | string | yes | 1–400 chars | The question itself, e.g. "What do you do?" |
| `options` | array | yes | 2–8 Option objects, exactly one `correct`, at most one `trap` | |
| `takeaway` | string | yes | 1–300 chars | The one line to remember, shown after answering and in the review |

## Option object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `text` | string | yes | 1–240 chars | The choice as the learner reads it |
| `correct` | boolean | no | default `false` | Exactly one option per question is `true` |
| `why` | string | yes | 1–600 chars | Why this is right (if correct) or why it is not (if wrong) |
| `tempting` | string | no | ≤400 chars | What makes people choose it; acknowledges the learner's reasoning before `why`. Recommended on every wrong option, required on the trap |
| `trap` | boolean | no | default `false` | Marks the famous wrong answer most people pick. At most one per question; never on the correct option |

## Summary object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `heading` | string | no | ≤80 chars, default "What you've learned" | |
| `closing` | string[] | yes | 1–5 items, each 1–600 chars | Paragraphs that tie the scenario together |
| `takeaways` | string[] | no | 0–20 items, each 1–200 chars | Overrides the automatic list built from each question's `takeaway` |

## Cross-field rules
- `questions[i].id` must be unique.
- Every question has exactly one option with `correct: true`.
- At most one option per question has `trap: true`; it must not be the
  correct option, and it must have `tempting`.

## Warnings (non-blocking)
- Fewer than 4 questions.
- A question with only 2 options (hard to make the wrong one instructive).
- A wrong option without `tempting`.
- No question marks a `trap` (the "famous wrong answer" is the most
  instructive part).
- Options whose `text` is identical.

## Complete example
In `references/complete-example.md`. Read it only when a table above leaves
the shape of something unclear.
