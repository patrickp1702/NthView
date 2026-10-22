---
name: nthview-scenario-quiz
description: Teaches a concept through a story-based decision quiz: the learner is placed in a role inside a scenario (an organisation, a codebase, a situation), faces a sequence of decisions and questions with several options, and gets a full explanation of why each option is right, wrong or tempting, ending in a complete review. Use when the user wants to understand a concept by making choices, asks for a quiz that teaches rather than tests, wants "what would you do" situations, or wants to see the common mistakes people make; not for drilling facts or grading someone.
---

# NthView — Scenario Quiz

## Overview
The learner reads a scenario, is told who they are in it, and then works
through a sequence of moments. Each moment has one right choice and several
wrong ones that real people pick; every option explains itself, so a wrong
pick teaches more than a right one. After the first pick the right answer is
named and the options stay live: the learner taps any other option to read
why it is right or wrong, as many as they care about, before pressing "Next".
"Skip" is always allowed, and the end screen reviews every question and every
option with the first pick remembered.
The purpose is learning, not evaluation: nothing is scored against the
learner. The output is one self-contained HTML file; it loads its typefaces
from Google Fonts and falls back to system fonts offline.

The interface is cinematic rather than form-like: a full-screen animated
gradient backdrop, glass cards, gradient display type, an ID-badge role card,
staggered reveals, drawn check and cross icons, chapter dots and a confetti
finish, in the spirit of the best consumer learning products (Duolingo's
feedback rhythm, Brilliant's clean interactivity, Headspace's warmth, Linear
and Stripe's gradients and glass). Eight named themes keep documents from
looking alike.

## When to use
- Concepts that are really about judgement: compliance, security hygiene,
  code review, clinical protocols, ethics, management decisions
- The user asks to "learn by deciding", for a role-play, or for the common
  mistakes and misconceptions around a topic
- A plain explanation exists but the user does not trust that they would
  apply it correctly

Do not use when:
- The content is a list of facts or definitions to memorise (a flashcard or
  plain quiz view fits better)
- There is no realistic situation in which the learner would have to decide
- The user wants a score or certificate; this view deliberately has none

## Procedure

### 1. Understand the content
Identify the 6–12 judgement calls that define the concept: the moments where
people get it wrong, and what they wrongly believe when they do. For each,
note the right move, the famous wrong move and why it is popular, and two or
three other plausible wrong moves that are close enough to make the learner
think. Then invent a scenario where all of these moments can happen to one
person: an organisation, a team, a codebase, a day in a job. Choose the role
the learner will play so that every decision is theirs to make.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- Choose a `theme` that matches the mood of the scenario (the table in
  `references/schema.md` maps each theme to the topics it suits). Vary it
  across documents; if you omit it, one is derived from the title.
- `scenario.setting` paints the world in 2–3 paragraphs; `scenario.role`
  tells the learner who they are ("You are Sam, the new coordinator").
- One question per judgement call, in an order that builds (early questions
  define, later ones apply and combine). Use `situation` for a concrete
  moment and omit it for a general question.
- 3–6 options per question (2–8 allowed), exactly one `correct`. Give every
  option a `why`. Give every wrong option a `tempting` note that honestly
  acknowledges why someone would pick it. Mark the one most people choose
  with `trap: true`.
- Make at least one wrong option "almost right" so the learner has to weigh
  two reasonable answers.
- `takeaway` is the single sentence to remember.

### 3. Validate
Write the JSON to a file and run:

    node skills/nthview-scenario-quiz/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Act on warnings: a wrong
option without `tempting`, or no `trap` marked, usually means the teaching is
thinner than it should be.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly:

    node scripts/build-html.js skills/nthview-scenario-quiz <path-to-json> docs/<concept-slug>-scenario-quiz.html

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `\u003c`,
then `scripts/validate.js` and `assets/view.js` inlined verbatim, then the
three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`, with the one Google
Fonts tag from `NthView.libs` before the scripts.

Generated quizzes go in the repo-root `docs/` folder (or `lessons/<lesson>/chapters/` when it is a lesson chapter built by `scripts/build-lesson.js`) (or wherever the user
asks); never inside `skills/`.

### 5. Deliver
Hand the user the single file. It needs internet access once to load the
fonts and degrades to system fonts without it. Build no other view unless
asked.

## Content guidance
- **Scenario first.** The learner should be able to picture the place and
  their job before the first question. Name people; give them a manager who
  is away so the decisions land on the learner.
- **Situations over abstractions.** "A man not on the pickup list arrives"
  teaches more than "What is safeguarding?". Use a general question only to
  define a term, and follow it with a situation that applies it.
- **The trap is the lesson.** The `trap` option should be what a sensible,
  busy person would actually do. Its `tempting` note must be fair, never a
  straw man, and its `why` must show the consequence.
- **Near-miss options.** Include one option that is right in spirit but wrong
  in degree ("mention it privately" when the risk calls for a report), and
  explain the difference.
- **Explanations teach, not scold.** `why` on a wrong option acknowledges
  the reasoning, then shows what it misses. Keep each `why` to three or four
  sentences.
- **Callbacks.** Later questions can refer to earlier moments ("the fire-drill
  log in a different costume"); it makes the review read as one story.
- **Summary** restates the concept in plain words, in two paragraphs at most.
- **Length.** 8–10 questions with 4–5 options each is the sweet spot.

## Common mistakes
- Two options that are both defensible → make one clearly better and explain
  the difference in both `why` texts.
- `trap: true` on the correct option → the trap is always a wrong option.
- Trap without `tempting` → the validator rejects it; write the honest reason.
- Lecturing `why` texts with no acknowledgement → start wrong-option
  explanations by granting what is reasonable about the choice.
- Scenario that drifts: a question the role could never face → cut it or
  change the role.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth) and the complete compliance example
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; the eight themes live in its `PALETTES` table; fonts declared in `NthView.libs`
- `examples/example.html` — the compliance quiz, a working standalone sample built from the schema example
