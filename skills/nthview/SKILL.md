---
name: nthview
description: Entry point for NthView. Turns any concept, paper, article or document into one learning view (a single HTML document) or a multi-chapter lesson that mixes views, recommending the view that suits each use case and handing the work to the nthview-<view> skills. Use when the user wants to learn, understand or teach something with NthView, asks for a lesson, course, series or chapters, or has not said which view they want.
---

# NthView — the parent skill

## Overview
NthView has several views, each a separate skill that turns content into one
standalone HTML file. This skill is the front door: it works out whether the
user wants one document or a lesson of several chapters, recommends the view
that fits each piece of content, asks at most two questions, and then follows
the chosen view skills to build the files. The detailed instructions for each
view live in that view's own `SKILL.md`; this file only carries the knowledge
needed to choose well and to assemble a lesson.

## When to use
- The user asks to learn, understand, explain or teach a topic, paper or
  document and has not named a view
- The user asks for a lesson, course, series, chapters or "a full treatment"
- The user names a view but the content plainly suits another, so a
  recommendation is worth one sentence before proceeding

Do not use when:
- The user names a view and just wants that one document: load that view's
  skill directly

## Procedure

### 1. Understand the content
Read what the user wants to learn. Note its size (one idea or many), its
shape (facts, a process, a system of causes, judgement calls, numbers that
compare), and the audience (child, layperson, practitioner).

### 2. Prepare the JSON
First settle the format, then the view. Ask only what the user has not said.
- **Document or lesson?** One idea, or the user said "a doc" or "a page": one
  document. Several ideas that build on each other, or the user said lesson,
  course, chapters: a lesson of 3–10 chapters.
- **Which view?** Recommend from the table below and say why in one line.
  For a lesson, also ask: the same view for every chapter, or the best view
  per chapter (recommended). Offer the recommended plan as a list of chapter
  titles with a view each, and let the user adjust.
- Then follow the chosen view's `SKILL.md` for each document or chapter:
  it defines the JSON format, validation and content guidance. One chapter
  is exactly one view; a second angle on the same idea is another chapter.

### 3. Validate
Each view's validator checks its own JSON:

    node skills/<view>/scripts/validate.js <path-to-json>

For a lesson, also keep `lesson.json` valid (see `references/lesson-format.md`).

### 4. Build the HTML file
- **Document:** build with the view's tool into the root `docs/` folder,
  JSON next to HTML:

      node scripts/build-html.js skills/<view> docs/<slug>.json docs/<slug>.html

- **Lesson:** create `lessons/<lesson-slug>/lesson.json` and one
  `chapters/NN-<slug>.json` per chapter, then build everything, including the
  contents page and the previous/next bar on every chapter:

      node scripts/build-lesson.js lessons/<lesson-slug>

Both register the result in the gallery (`index.html`) automatically.

### 5. Deliver
Hand over the file (or the lesson's `index.html`) and say which views were
used. Build only what was asked for.

## Content guidance

### Which view for which use case
Minimal guidance only; each view's `SKILL.md` has the detail.

| Use case | Prefer | Also works |
| :- | :- | :- |
| A system of causes and effects, "how it all fits together" | Concept Map | Explorable Lab |
| Something with numbers or a model worth playing with | Explorable Lab | Island Quest |
| Judgement calls, rules, ethics, "what would you do" | Scenario Quiz | Detective Case |
| A puzzle with misconceptions to rule out, a story with a reveal | Detective Case | Scenario Quiz |
| A paper or article with 5–7 separable findings | Island Quest | Concept Map |
| Beginners, children, anyone asking for a game | Island Quest | Detective Case |
| Consolidating several ideas at the end of a lesson | Island Quest | Scenario Quiz |
| An overview before diving in, or a recap after | Concept Map | Explorable Lab |

Skill names: `nthview-concept-map`, `nthview-explorable`,
`nthview-scenario-quiz`, `nthview-detective`, `nthview-island-quest`.

### Shaping a lesson
- 3–10 chapters, each with one learning objective and one view.
- A pattern that works: open with structure or a hook (Concept Map or
  Detective Case), build intuition (Explorable Lab), apply it (Scenario
  Quiz), consolidate (Island Quest). Vary it to fit the content.
- Reuse the same cast, setting or example across chapters when the views
  allow it; the lesson reads as one story.
- Chapter files are numbered `01-`, `02-`, … so the order is visible on disk.

## Common mistakes
- Asking more than two questions → decide the rest yourself and state it.
- Two views in one chapter → split into two chapters.
- Building a lesson when the user asked for a doc, or the reverse.
- Writing chapter JSON without reading that view's `SKILL.md` → the
  validator will reject it; read the skill first.
- Forgetting to run the build tool → the gallery and the lesson bar come
  from it, not from hand-written HTML.

## Files
- `references/lesson-format.md` — the `lesson.json` format, folder layout and build commands
- `../nthview-concept-map/SKILL.md`, `../nthview-explorable/SKILL.md`, `../nthview-scenario-quiz/SKILL.md`, `../nthview-detective/SKILL.md`, `../nthview-island-quest/SKILL.md` — the view skills this one hands off to
