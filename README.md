# NthView  -  A kaleidoscope for learning.

NthView is a collection of agent skills for learning any concept in the
format you prefer. Every concept can be seen in many dimensions — as a
quiz, a game, a short video, code graph etc — and you pick the
one that works for you.

## How it works

1. You ask to learn a concept and choose a view.
2. The agent loads that view's skill and prepares the content as data.
3. It creates a single HTML file with that view.
4. Open the HTML file and start learning.

## Views

One concept, many dimensions, one view at a time.

- **Island Quest** (`skills/nthview-island-quest`) — a playable 3D island
  adventure: one lesson per island (3 to 60, laid out in rings), 25 kinds of
  hands-on activity, four world themes, then a final exam and report card.
  Demo: `skills/nthview-island-quest/examples/example.html`.

- **Scenario Quiz** (`skills/nthview-scenario-quiz`) — a story-based decision
  quiz: you are given a role in a scenario, face a sequence of choices, and
  every option explains why it is right, wrong or tempting; ends with a full
  review. Demo: `skills/nthview-scenario-quiz/examples/example.html`.

- **Explorable Lab** (`skills/nthview-explorable`) — learn by tinkering: a
  guided sequence of live, slider-driven models with predict-then-observe
  prompts and eleven visualisation kinds. Demo: `skills/nthview-explorable/examples/example.html`.
- **Detective Case** (`skills/nthview-detective`) — learn by deduction: the
  concept's facts are clues, misconceptions are suspects, and you crack the
  case on an evidence board. Demo: `skills/nthview-detective/examples/example.html`.
- **Concept Map** (`skills/nthview-concept-map`) — learn by structure: tour a
  living map of the idea, then rebuild it from memory with hints and
  explanations for every slip. Demo: `skills/nthview-concept-map/examples/example.html`.

- **Zoom Map** (`skills/nthview-zoom-map`) — understand a big system or
  codebase top down: a zoomable map of pillars, concepts, mechanisms and
  files, linked to a ladder document with collapsed detail. Demo: `skills/nthview-zoom-map/examples/example.html`.

- **Courier** (`skills/nthview-courier`) — a cosy mail-carrier game on a
  tiny planet: districts are the concept's parts, residents personify its
  ideas, and every delivery is a learning errand with explained choices.
  Demo: `skills/nthview-courier/examples/example.html`.

Open `index.html` for the gallery of all views.

## Install as a Claude Code plugin

```
/plugin marketplace add patrickp1702/NthView
/plugin install nthview@nthview-marketplace
```

Then ask Claude to explain or teach anything: the `nthview` skill picks the
view (or asks), or call a view directly, for example `/nthview:nthview-island-quest`.
To try a local checkout without publishing: `claude --plugin-dir /path/to/NthView`.
Node (or Bun or Deno) is recommended: the skills use it to validate data and
assemble files. Without any of them the skills do that work by hand, which is
slower and may slip, but the output still checks itself when opened.

## Using with other agents

The `skills/` folders follow the open Agent Skills format, so any agent that
reads `SKILL.md` skills (Codex CLI, Cursor, GitHub Copilot, Gemini CLI and
others) can use them. The `.claude-plugin/` manifests are for Claude Code only
and are ignored elsewhere.

1. Clone this repository and keep it whole: the skills call the build tools
   in the root `scripts/` folder as `${CLAUDE_SKILL_DIR}/../../scripts/`.
2. Symlink (or copy) the folders under `skills/` into your agent's skills
   directory, for example `~/.codex/skills/`, `.cursor/skills/`,
   `.github/skills/` or `.agents/skills/`. Symlinks keep the path to
   `scripts/` intact; a copied view folder still works but loses the
   assembler and the lesson builder, and the agent builds by hand instead.
3. `${CLAUDE_SKILL_DIR}` in the commands means "the folder holding this
   SKILL.md". Claude Code fills it in; other agents replace it with that path,
   which every skill says in its own text.
