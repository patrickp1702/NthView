---
name: nthview-courier
description: Turns a concept, process or system into Courier, a cosy 3D tiny-planet game where the learner is a mail carrier; districts are the concept's parts, residents personify its ideas or roles, and each errand (letters, mystery parcels, replies, sorting, chains, telegrams, weighing, notices) teaches one idea, ending in a closing letter and a review. Use when the user asks for a game, a world to explore, "who does what", roles or handoffs in a system, or something cosy; not for dense reference, long timelines, or content without distinct roles.
---

# NthView — Courier

## Overview
The learner walks a small courier around a tiny planet they can circle in
half a minute. The post office stands on the north pole; the concept's main
parts are districts around the planet, and its ideas or roles are residents
with names, faces and plain-spoken jobs. Errands are learning tasks: letters
carry the explanation and the recipient asks one check question, mystery
parcels must be matched to the right resident from clues, reply cards, a
sorting table, a chain message, a telegram with gaps, a scale for estimates,
and notice boards. There are no waypoints by default and nothing is scored:
every wrong choice is answered with why, stamps collect in the bag, and
finishing earns a closing letter that recaps every idea and a review of what
was mixed up. The output is a single HTML file that loads three.js r128 and
two Google Fonts from CDNs, so it needs internet access the first time it
opens.

## When to use
- A system or process made of actors with distinct jobs (network protocols,
  an organisation, the immune system, a supply chain, a court case)
- A concept whose parts hand things to each other in an order (requests,
  approvals, signals, enzymes, a recipe)
- Content where "who does what" and "what belongs where" are the hard parts
- Beginners, children, or anyone who asked for a game, a world, or something
  cosy rather than a quiz
- Situated learning: the same ideas met again in letters, parcels, sorting
  and chains (spaced retrieval through errands)

Do not use when:
- The content is a flat list of facts with no roles (use a quiz or flashcards)
- The learner needs a long ordered story or many lessons (use
  `nthview-island-quest`) or a judgement-heavy scenario (use
  `nthview-scenario-quiz`)
- The user needs the architecture top down (use `nthview-zoom-map`)
- Fewer than three distinct ideas exist (the planet needs three residents)

## Procedure

### 1. Understand the content
Read the topic, text, document or code. List the 3–14 ideas, roles or actors
that do something distinct, and group them into 2–6 parts of the concept
(these become districts). For each idea note: what it does in one plain
sentence, a property that tells it apart from its neighbours (parcel clues),
a common confusion with another idea (decoys and wrong options), any order it
takes part in (a chain), a number worth estimating, and a gap-fill sentence
with the key term. Pick the learner's role line and a postmaster who frames
the round.

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": 1`.
- Cast residents as people with a job, not as definitions: Della the
  directory keeper, not "DNS". Put the real term in **bold** inside `knows`
  and map every story word to its real term in `glossary`.
- Choose each errand's kind from the shape of the idea with the table in
  `references/errands.md`; use at least five kinds, and include a letter, a
  parcel and one post-office errand (sort, telegram or weigh).
- Order `errands` so the explanations come before the retrieval tasks: a
  letter that explains an idea before the parcel or sort that tests it. Use
  `after` sparingly, only when one errand truly needs another first.
- Every errand needs `hint` (words, never coordinates), `teaches` (one line,
  recapped in the closing letter) and `done` (what the resident says).
- Pick a world `theme` from the table in `references/schema.md`.

### 3. Validate
Write the JSON to a file and run:

    node ${CLAUDE_SKILL_DIR}/scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable (a district with no residents, a resident in no errand, too few
errand kinds, a tolerance that covers half the range).

If `node` is not installed, try `bun` or `deno run -A` with the same
script; both run it unchanged. If no JavaScript runtime exists, do the
validator's job yourself: check the JSON against every table, cross-field
rule and warning in `references/schema.md`, which is exactly what
`scripts/validate.js` implements, and fix what you find. Say that the check
was done by hand; the file also validates itself when opened and shows an
error panel if anything was missed.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6. The
repository tool does this exactly, including the CDN tags for three.js and
the fonts declared in `assets/view.js`:

    node ${CLAUDE_SKILL_DIR}/../../scripts/build-html.js ${CLAUDE_SKILL_DIR} <path-to-json> <out-dir>/<concept-slug>-courier.html

Where the files go: inside the NthView repository, `docs/` for a document
(JSON next to HTML) and `lessons/<lesson>/chapters/` for a lesson chapter built
by `scripts/build-lesson.js`. Anywhere else, such as a project using NthView
as a plugin, write to the current folder or where the user asks; do not create
or reuse a `docs/` folder there, it may hold the project's own documentation.
Never write inside `skills/`.

If building by hand: the JSON in `<script type="application/json"
id="nthview-data">` with every `<` replaced by the six characters `\u003c`,
the two library tags from `NthView.libs`, then `scripts/validate.js` and
`assets/view.js` inlined verbatim, then the three-line bootstrap that calls
`NthView.build(document.getElementById("app"), data)`.

The hand build is the fallback when no JavaScript runtime is available; the
tool does nothing beyond that template, so the result is identical.

### 5. Deliver
Hand the user the single file and say it needs internet access the first time
it opens (for three.js and the fonts). Build no other view unless asked.

## Content guidance
- **Size**: 5–9 residents in 3–5 districts and 8–10 errands make a round of
  about twenty minutes. The hard limits are 14 residents, 6 per district,
  6 districts and 12 errands.
- **Districts** are the concept's main parts; their `blurb` says what belongs
  there, because a wrong sorting bin answers with it. Pick 2–4 `props` that
  suit the mood; the first is the landmark in the square.
- **Residents**: `knows` is the idea in two plain sentences, in the first
  person. `greeting` and `smallTalk` add one extra fact each, so repeat visits
  reinforce the idea instead of repeating it.
- **Letters** explain; keep them to two short paragraphs, signed. The check
  question applies the letter to a small situation, and wrong options are the
  confusions a beginner really has.
- **Parcels** test transfer: clues describe properties, never the name. Give
  decoys to the two or three residents a learner is most likely to try.
- **Chains** are processes; 3–5 steps, each `tooEarly` saying what must happen
  first without naming the next person outright.
- **Telegrams** gap the key terms (1–3 gaps); **weigh** needs a real number
  with a source, said in `reveal`; **notices** carry lore that has no check.
- **Tone**: warm, concrete, a little funny. Nobody fails; wrong answers are
  explained, never punished.
- **Labels**: names are short (≤12 characters reads best on the name tags);
  district names ≤18 characters fit the signs.

## Common mistakes
- A resident who is a definition ("DNS is a system that…") → give them a job
  and a voice, and put the term in **bold** inside `knows`.
- Parcel clues that name the owner → describe what the owner cares about.
- `chain.steps` listed in a shuffled order → list them in the correct order;
  the learner chooses the order by walking.
- A `telegram.text` whose number of `___` differs from `gaps` → one marker per gap.
- `after` pointing at a later errand → move the errand or drop `after`.
- Every errand a letter → mix kinds; retrieval (parcels, sorting, chains)
  is where the learning sticks.
- Hand-editing the HTML → change the JSON, re-validate, rebuild.

## Files
- `references/schema.md` — the JSON format (single source of truth), the theme table and the complete Packet Town example
- `references/errands.md` — how to cast residents and which errand kind fits which idea, with a snippet for each kind
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`; declares the CDN libraries in `NthView.libs`
- `examples/example.html` — Packet Town, a working standalone sample built from the schema example
