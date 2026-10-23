# Decomposing a system for the Zoom Map

This guide is the long form of SKILL.md step 1 and the content guidance. It
describes how to turn a codebase, a product or a long document into the tree
the view needs, how big each part should be, and how to write the three
registers of text (one-liner, summary, deeper). It is loaded on demand; the
data format itself is in `schema.md`.

## 1. The ladder

A Zoom Map is a ladder of abstraction. Each rung answers a different
question, and the reader may stop at any of them:

| Rung | Question it answers | What goes there |
| :- | :- | :- |
| L0 The big idea | What is this, in one sentence? | `root.oneLiner`, `root.summary`, 3–5 chip `facts`, one before/after `snippet` |
| L1 Pillars | What are the few ideas it rests on? | the root's children, `kind: "pillar"`, each with a role `tag` |
| L2 Lifecycle | What happens, in what order, when it runs? | one `pipelines` entry with 4–8 steps and a `rule` |
| L3 Concepts | How does each idea work? | concepts (`level: 3`) with facts, snippets, tables, and the mechanism in `deeper` |
| L4 Under the hood | How do the layers fit? | the level's own `stack` and `facts` (no nodes needed) |
| L5 File map | Which file does what? | `fileMap: true`; the files come from every node's `files` |

Six rungs is the proven shape. A small system may drop L4; a system with a
build pipeline and a request pipeline may put both on L2. Never add a rung
that has nothing on it: the validator warns, and the nav shows an empty entry.

## 2. Finding the pillars

Pillars are the three to seven ideas a newcomer must hold to understand
anything else. They are **ideas, not folders**:

- Good: "One Markdown document", "Blocks that produce data", "One expression
  grammar", "Blocks that show data", "Structure and two ways to look".
- Bad: "src/", "components/", "utils/", "tests/".

Ways to find them:

1. **Read the README's first paragraph and the entry point.** The nouns that
   recur are candidates.
2. **Ask what the system would stop being without it.** A pillar is
   load-bearing; a folder is not.
3. **Follow the data.** Where it is written, how it is transformed, where it
   is read, how it is shown. Each stage is often a pillar.
4. **Count.** Fewer than three and the overview is empty; more than seven and
   nothing reads at a glance. Merge or promote until the count fits.

Give every pillar a `tag` that names its role in two or three words ("Source
of truth", "Assembly line", "Front door for people"). The tag is the kicker
above the label on the map and on the pillar card in the doc; it is often
what the reader remembers.

Give each pillar a `color`. The eight roles (`red`, `orange`, `gold`,
`green`, `teal`, `blue`, `violet`, `pink`) are assigned by position when
omitted, but choosing them lets related pillars share a family and lets the
subject's own colour code carry over.

## 3. Concepts under each pillar

A concept is one thing a reader can learn in one sitting: a kind of block, a
rule, a component, a stage. Two to five per pillar; fifteen to forty nodes in
all. Each concept gets:

- `title` under 32 characters (the region label), `heading` when the
  section wants the full phrase ("dataNodes — the three kinds").
- `level: 3`, so it sits on the concepts rung. Without it a concept defaults
  to its depth (2), which is the pillars rung.
- `oneLiner`: one sentence, what it is.
- `summary`: one to three paragraphs, how it works, in the reader's words.
- The evidence the material offers: `snippet` (code with a `result` when the
  reader should see what it produces), `table` (a reference table), `facts`
  (claims, as strings or as label/text cards), `note` (one highlighted
  callout starting with a bold lead), `stack` (layers).
- `deeper`: the mechanism, see §5.
- `files`: the files that implement it.

Order concepts in reading order; the map numbers them and the doc follows the
same order.

## 4. Mechanisms

A mechanism is a sub-part of a concept that deserves its own label and
snippet: the three kinds of a block, the two strategies a control can drive,
the rule that converts a string into a typed value. Make it a child with
`kind: "mechanism"` and leave `level` unset: it inherits the concept's level
and renders as a sub-section inside the concept's doc section, and as a
nested region on the map.

Zero to four mechanisms per concept. If a concept needs more, it is two
concepts. If a mechanism is a single sentence, it is a fact, not a node.

Mechanisms may hold `files` too (the stage runner under the pipeline kind,
the request library under the fetch kind), which is how a file map stays
accurate without a separate "misc" bucket.

## 5. The three registers of text

Every node carries up to three kinds of text, and the view shows them at
different zoom levels and in different places. Keep them distinct:

| Register | Field | Length | Says | Where it shows |
| :- | :- | :- | :- | :- |
| One-liner | `oneLiner` | one sentence, under 110 characters | **what** it is | under the label on the map; the lead of the doc section; the screen-reader label |
| Summary | `summary` | 1–3 short paragraphs | **how** it works, as the reader experiences it | the focused leaf card; the doc section body; the About panel of a focused region |
| Deeper | `deeper.text` | as long as it needs, with `deeper.title` completing "Go deeper — …" | **why** it is built that way and what is underneath | a collapsed accordion in the doc and on the leaf card |

Rules of thumb:

- The one-liner must stand alone: it is often the only text a reader sees on
  a small region. Start with the noun, not with "This".
- The summary may repeat the one-liner's claim but must add the how. Use
  `**bold**` for the one term the paragraph is about, `` `code` `` for
  identifiers, `((term))` for glossary terms, `[[node-id]]` to point at
  another node.
- The deeper text names the files it talks about at the end ("Files:
  `DagRunner.ts`, `graph.ts`") so the reader can jump from mechanism to code.
- Never put the mechanism in the summary: it makes the section long for the
  reader who only wanted the how, and leaves the accordion empty.

## 6. Snippets, results and tables

- One or two snippets per concept, under 15 lines each, taken from the
  subject itself. `label` names the file or context ("what you write ·
  sales.floboard.md"). `lang` drives light highlighting (`js`, `json`, `md`,
  `bash`, `html`, `text`).
- Use `result` for a before/after: the code on the left, what it produces on
  the right, an arrow between. `resultLabel` names the right panel ("what a
  viewer sees", "rendered").
- A `table` is for reference material the reader will scan, not read:
  filters and what they do, error families and examples, layers and files.
  Two to four columns; mark-up works inside cells.
- `stack` draws layers top first; use it once, on the "under the hood" rung.

## 7. The pipeline and the relations

**Pipeline.** Find the one path the system follows when it runs: open a
document, serve a request, build an artifact. Four to eight steps, each with
a short `label` ("Read", "Scan", "Check"), one line of `text`, and a `node`
pointing at the concept or pillar where the step happens. The map draws the
pipeline as numbered arrows between the regions those nodes fall in at the
current zoom, so a step tied to a mechanism still shows at the overview on
its pillar. Finish with the one `rule` that ties the steps together.

**Relations.** Six to fifteen directed links, read as sentences: *from* —
*label* → *to*. Prefer links that cross pillar boundaries ("publishes into",
"reads from", "gates", "is reused by"): they are drawn between pillars on the
overview and between concepts when zoomed in, so they are what makes the
overview more than five boxes. Add `text` saying why the link holds; it is
listed under Connections in both nodes' sections. A relation may not join a
node to its own ancestor or descendant; containment already says that.

## 8. Files and the file map

List every file worth knowing exactly once, under the node it implements,
with a one-line `role`. The view shows them as chips on regions, as a list on
the leaf card and in the doc section, and collects them all on the file-map
rung as a table (File, What it does, Concept) with a "Show on map" button per
row.

- Paths are free text: `lint/{index.ts, codes.ts}` and `fixtures/*.floboard.md`
  are fine when that is how the reader would say it.
- Set `group` on every file when the subject has packages
  ("packages/floboard/js · the engine"); the file map is then grouped by
  package. When no file has a group, it is grouped by pillar.
- Keep it under about 60 files for a readable map; the validator allows 500.

## 9. Glossary

Six to twelve terms a newcomer would look up: the system's own nouns
(dataNode, registry), the one rule with a name (whole-value rule), the two
modes. Reference each at least once with `((term))` or `((shown text|term))`
so it opens in a pop-over where it is used; the doc also ends with the full
glossary and the map has a glossary drawer.

## 10. A worked example in miniature

For a small CLI tool that reads a config, runs plugins and writes a report:

```json
{
  "levels": [
    { "name": "The big idea", "meaning": "What the tool does in one line." },
    { "name": "Three pillars", "meaning": "Config, plugins, report." },
    { "name": "A run", "meaning": "What happens when you type the command." },
    { "name": "Concepts", "meaning": "One section per concept." },
    { "name": "File map", "meaning": "Which file does what.", "fileMap": true }
  ],
  "root": { "id": "tool", "kind": "system", "title": "Lintish", "oneLiner": "One command, every plugin, one report.",
    "children": [
      { "id": "config", "kind": "pillar", "tag": "Source of truth", "title": "One config file", "oneLiner": "…",
        "children": [ { "id": "config-schema", "kind": "concept", "level": 3, "title": "The schema", "oneLiner": "…", "files": [ { "path": "src/config.ts", "role": "…" } ] } ] },
      { "id": "plugins", "kind": "pillar", "tag": "Workers", "title": "Plugins", "oneLiner": "…",
        "children": [ { "id": "plugin-api", "kind": "concept", "level": 3, "title": "The plugin API", "oneLiner": "…",
          "children": [ { "id": "hooks", "kind": "mechanism", "title": "Hooks", "oneLiner": "…" } ] } ] },
      { "id": "report", "kind": "pillar", "tag": "Output", "title": "The report", "oneLiner": "…",
        "children": [ { "id": "formats", "kind": "concept", "level": 3, "title": "Formats", "oneLiner": "…" } ] }
    ] },
  "pipelines": [ { "id": "run", "title": "A run", "level": 2, "steps": [
    { "label": "Load", "node": "config" }, { "label": "Resolve", "node": "plugin-api" }, { "label": "Run", "node": "hooks" }, { "label": "Write", "node": "formats" } ] } ],
  "relations": [ { "from": "config-schema", "to": "plugin-api", "label": "selects" }, { "from": "hooks", "to": "formats", "label": "feed" } ]
}
```

Add `schemaVersion`, `title`, the one-liners and summaries, and it validates.
The complete, full-size example is in `schema.md`.
