# AGENTS.md — the rulebook for every agent working on NthView

Read this file first and follow it exactly. It fixes the structure, file names,
APIs and output format that **every** view in this repository must use. The
structure is not a suggestion: a view that deviates from it is rejected, even
if it works. If a rule here needs to change, change this file first, in its own
commit, and then update every existing view to match.

---

## 0. Non-negotiables (read even if you read nothing else)

1. Every view is a folder `skills/nthview-<view>/` containing **exactly** these
   five files, with these exact names and locations:
   `SKILL.md`, `assets/view.js`, `scripts/validate.js`,
   `references/schema.md`, `examples/example.html`.
2. The SKILL.md frontmatter `name` is identical to the folder name.
3. One global object, `NthView`, with exactly two public functions:
   `NthView.validate(data)` and `NthView.build(container, data)`.
4. `validate` returns `{ valid, errors, warnings }` where each entry is
   `{ path, message }`. It never throws.
5. `build` calls `validate` first and renders the standard error panel on
   invalid data. It never renders a half-broken view.
6. **Single file.** The output depends on no sibling or local file: the
   view's own code is inlined. Third-party libraries and fonts may be loaded
   from the allowed CDNs (§5.4), pinned to a version and declared in
   `NthView.libs`. Nothing else is fetched at runtime.
7. Every data object carries an integer `schemaVersion`.
8. The deliverable is **one** standalone HTML file built with the exact
   template in §6. Scripts are inlined in the order validate.js, view.js,
   bootstrap.
9. **One view at a time.** Build only the view the user chose.
10. Every skill registers in the root gallery by running
    `node scripts/build-registry.js`. Never hand-edit `registry.js` or add
    cards to `index.html`. The script also rejects any folder that breaks §3.
11. Do not create views, plugin files or the router unless the current task
    asks for it.

---

## 1. The idea

NthView lets a person learn any concept or document in the view that suits
them. Think of a kaleidoscope: the same content, turned, appears in a new form.

- A **concept** is anything the user wants to learn: a topic name, pasted text,
  a document, or source code.
- A **view** is one way of presenting it (a quiz, a timeline, a concept map,
  flashcards, and so on). Each view is a separate, self-contained agent skill.
- The agent transforms the concept into the view's JSON, validates it, and
  produces one standalone HTML file the user opens in a browser.

Tagline: *"Learn anything, in the nth view that suits you."*

### The one-view-at-a-time principle

The user picks **one** view. Only that view is built. If they want another
view of the same content, they ask again and a new file is built from the same
content. Never build several views in one go unless the user explicitly asks.

Because of this, every view is independent: nothing in one view folder may
import, read or depend on another view folder.

### What exists today

Only this file and the README. Views are added one at a time in later tasks.

---

## 2. Repository layout

The repository root is also the future Claude Code plugin root. Packaging as a
plugin later means *adding* two files (§9), never moving anything.

```
NthView/
├── AGENTS.md                      # this rulebook
├── README.md                      # user-facing introduction
├── LICENSE                        # added when the license is chosen
├── index.html                     # gallery page: lists every skill (§7)
├── registry.js                    # GENERATED list the gallery reads — never edit
├── scripts/
│   ├── build-registry.js          # scans skills/, checks §3, writes registry.js
│   └── build-html.js              # assembles a standalone output file exactly as §6
├── skills/
│   ├── nthview-<view>/            # one folder per view (see §3)
│   │   ├── SKILL.md
│   │   ├── assets/
│   │   │   └── view.js
│   │   ├── scripts/
│   │   │   └── validate.js
│   │   ├── references/
│   │   │   └── schema.md
│   │   └── examples/
│   │       └── example.html
│   └── nthview/                   # router skill, later (§10)
│       └── SKILL.md
└── .claude-plugin/                # later (§9) — do not create yet
    ├── plugin.json
    └── marketplace.json
```

Nothing else goes at the repo root except the files above and standard
housekeeping (`.gitignore`, `CONTRIBUTING.md` if added). No `package.json`,
no `node_modules`, no bundler. The root `scripts/` folder holds repo tooling
only, never view code; the plugin layout permits it.

---

## 3. The view folder: exact structure

### 3.1 Required files

| Path | Role | Public surface |
| :- | :- | :- |
| `SKILL.md` | The procedure the agent follows to turn content into this view. Fixed section order (§4). Under 500 lines. | Frontmatter `name`, `description` |
| `references/schema.md` | **Single source of truth** for the view's JSON. Fixed section order (§5.1). | The documented fields and rules |
| `scripts/validate.js` | Implements every rule in `schema.md`. Node CLI + browser. Skeleton in §5.2. | `NthView.validate(data)` |
| `assets/view.js` | Renders the view. Skeleton in §5.3. | `NthView.build(container, data)` |
| `examples/example.html` | The schema's complete example, built with the §6 template. Opens from disk with no console errors. | none |

### 3.2 Permitted additions

Only these, and nothing else:

- Extra documentation files in `references/` (for example
  `references/content-guidance.md`) when `SKILL.md` would otherwise exceed
  500 lines. Each must be linked from `SKILL.md`.
- Extra samples in `examples/` named `example-<topic>.html`, each built with
  the §6 template.

### 3.3 Forbidden

- Renaming, moving or splitting any of the five required files
  (no `render.js`, no `schema.json`, no `validator.js`, no `index.html`).
- Any other folder inside the view (`src/`, `lib/`, `css/`, `tests/`,
  `templates/`, `dist/`).
- Any file that is not `.md`, `.js` or `.html`. No images, fonts, JSON
  fixtures or CSS files. Styles live inside `view.js`; the example data lives
  inside `schema.md` and `example.html`.
- Shared code between views. If two views need the same helper, each carries
  its own copy. Independence beats DRY here, because each view must install
  alone.
- A `package.json`, build step, bundler, transpiler, TypeScript, or ES module
  syntax (`import`/`export`) anywhere in the view.

### 3.4 Why this layout

The Agent Skills specification defines three optional folders and we use each
for its intended purpose: `scripts/` for executable code (the validator),
`references/` for documentation loaded on demand (the schema), and `assets/`
for static resources that end up in the output (the renderer). `examples/` is
an NthView addition the spec permits. Fixing the names means an agent that has
seen one view can work on any other without reading the folder first.

---

## 4. SKILL.md: fixed template

Every view's `SKILL.md` uses this frontmatter and these headings, in this
order, with no headings added or removed. Fill in the parts in angle brackets.

```markdown
---
name: nthview-<view>
description: <One sentence: what this view produces for the learner>. Use when <the user asks for a <view>, or says words like "<trigger>", "<trigger>", "<trigger>">; not for <what it is bad at>.
---

# NthView — <View name>

## Overview
<Two or three sentences: what the learner sees and why it helps them learn.>

## When to use
- <Content shape or learning goal this view fits>
- <...>

Do not use when:
- <Content shape it fits badly; name the better view if one exists>

## Procedure

### 1. Understand the content
<What to extract from the topic, text, document or code for this view.>

### 2. Prepare the JSON
Follow `references/schema.md` exactly. Set `"schemaVersion": <n>`.
<View-specific guidance on choosing and shaping content.>

### 3. Validate
Write the JSON to a file and run:

    node scripts/validate.js <path-to-json>

Fix every error and re-run until it prints `valid`. Address warnings where
reasonable.

### 4. Build the HTML file
Produce one standalone file using the template in AGENTS.md §6:
- the JSON in `<script type="application/json" id="nthview-data">`, with
  every `<` in the serialised JSON replaced by `\u003c`,
- the full contents of `scripts/validate.js`, then `assets/view.js`, inlined,
- the bootstrap script that calls `NthView.build(document.getElementById("app"), data)`.
Name the file `<concept-slug>-<view>.html`.

### 5. Deliver
Hand the user the single file. Build no other view unless asked.

## Content guidance
<How to pick good content for this view: how many items, length limits,
difficulty mix, ordering, what to avoid.>

## Common mistakes
- <Mistake> → <fix>
- <...>

## Files
- `references/schema.md` — the JSON format (single source of truth)
- `scripts/validate.js` — `NthView.validate(data)`, Node CLI and browser
- `assets/view.js` — `NthView.build(container, data)`
- `examples/example.html` — a working standalone sample
```

Rules for the frontmatter `description`:

- Third person. Says what the view **produces** and **when** to use it.
- Contains the trigger words a user would actually say.
- Does **not** summarise the procedure (an agent may follow the description
  instead of the body).
- Under 1024 characters, ideally under 500.

---

## 5. Data, validator and renderer

### 5.1 `references/schema.md`: fixed template

```markdown
# <View> data schema — schemaVersion <n>

## Overview
<What the data describes, in two sentences.>

## Root object

| Field | Type | Required | Constraints | Description |
| :- | :- | :- | :- | :- |
| `schemaVersion` | integer | yes | must be `<n>` | Format version |
| `title` | string | yes | 1–120 chars | Shown as the page heading |
| `<field>` | ... | ... | ... | ... |

## <Nested type> object
<One table per nested object type, same columns.>

## Cross-field rules
- <e.g. `items[i].answer` must be an index into `items[i].options`>
- <e.g. every `edges[i].from` and `edges[i].to` must match a `nodes[j].id`>

## Warnings (non-blocking)
- <e.g. fewer than 3 items>
- <e.g. a label longer than 80 characters>

## Complete example
```json
{ ...a complete, valid object that exercises every field... }
```
```

Rules:

- Every field appears in a table with all five columns filled in.
- `schemaVersion` is always first, always a required integer, starting at `1`.
- `title` (string, required) is always present at the root so every view has
  a page heading.
- The example must pass the validator with zero errors and is the exact data
  used in `examples/example.html`. A long example is fine: `scripts/build-html.js
  --example` reads it from this file, so it stays the single copy.
- The validator implements the rules written here and nothing more. If the
  validator needs a rule, add it to this file first.

### 5.2 `scripts/validate.js`: fixed skeleton

Copy this skeleton. Change only the view name in the header comment, the
`SUPPORTED_VERSIONS` list, and the body of `checkRoot`. Everything else stays
byte-for-byte identical across views so agents can trust it.

```js
/* NthView — <view> validator — schemaVersion 1
 * Usage (Node): node validate.js data.json
 * Browser: defines window.NthView.validate
 */
(function (root, factory) {
  var api = factory();
  root.NthView = root.NthView || {};
  root.NthView.validate = api.validate;
  root.NthView.SUPPORTED_VERSIONS = api.SUPPORTED_VERSIONS;
  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var SUPPORTED_VERSIONS = [1];

  function validate(data) {
    var errors = [];
    var warnings = [];
    function error(path, message) { errors.push({ path: path, message: message }); }
    function warn(path, message) { warnings.push({ path: path, message: message }); }

    if (data === null || typeof data !== "object" || Array.isArray(data)) {
      error("$", "expected an object, got " + describe(data));
      return result();
    }
    if (SUPPORTED_VERSIONS.indexOf(data.schemaVersion) === -1) {
      error("schemaVersion", "expected " + SUPPORTED_VERSIONS.join(" or ") +
        ", got " + describe(data.schemaVersion) +
        " (this validator understands version " + SUPPORTED_VERSIONS.join(", ") + ")");
      return result();
    }

    checkRoot(data, error, warn);
    return result();

    function result() {
      return { valid: errors.length === 0, errors: errors, warnings: warnings };
    }
  }

  // ---- view-specific rules: mirror references/schema.md exactly ----------
  function checkRoot(data, error, warn) {
    requireString(data, "title", "$", 1, 120, error);
    // ...one check per field and per cross-field rule in schema.md...
  }

  // ---- shared helpers (identical in every view) --------------------------
  function describe(v) {
    if (v === null) return "null";
    if (v === undefined) return "undefined (missing)";
    if (Array.isArray(v)) return "array";
    if (typeof v === "string") return JSON.stringify(v);
    if (typeof v === "object") return "object";
    return String(v);
  }
  function join(parent, key) {
    return parent === "$" ? key : parent + "." + key;
  }
  function requireString(obj, key, parent, min, max, error) {
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (v.trim().length < min) { error(path, "must be a non-empty string"); return false; }
    if (v.length > max) { error(path, "must be at most " + max + " characters, got " + v.length); return false; }
    return true;
  }
  function requireArray(obj, key, parent, min, max, error) {
    var path = join(parent, key), v = obj[key];
    if (!Array.isArray(v)) { error(path, "must be an array, got " + describe(v)); return false; }
    if (v.length < min) { error(path, "must have at least " + min + " item(s), got " + v.length); return false; }
    if (max !== null && v.length > max) { error(path, "must have at most " + max + " item(s), got " + v.length); return false; }
    return true;
  }

  return { validate: validate, SUPPORTED_VERSIONS: SUPPORTED_VERSIONS };
});

/* ---- Node CLI (skipped in the browser) ---------------------------------- */
if (typeof require !== "undefined" && typeof module !== "undefined" && require.main === module) {
  var fs = require("fs");
  var file = process.argv[2];
  if (!file) {
    console.error("usage: node validate.js <data.json>");
    process.exit(2);
  }
  var parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (e) {
    console.error("$: could not read or parse JSON (" + e.message + ")");
    process.exit(1);
  }
  var r = module.exports.validate(parsed);
  r.errors.forEach(function (e) { console.error("error    " + e.path + ": " + e.message); });
  r.warnings.forEach(function (w) { console.error("warning  " + w.path + ": " + w.message); });
  console.log(r.valid ? "valid" : "invalid: " + r.errors.length + " error(s)");
  process.exit(r.valid ? 0 : 1);
}
```

Behavioural rules the skeleton enforces and every view must keep:

- Never throws. Bad root input yields one error at `$`.
- Unknown `schemaVersion` is rejected before anything else is checked.
- All problems are reported in one pass; do not stop at the first error.
- Cross-field problems (dangling ids, out-of-range indexes) are **errors**.
- Exit codes: `0` valid, `1` invalid or unreadable file, `2` usage error.
- The CLI prints exactly `valid` on success so a skill can grep for it.

### 5.3 `assets/view.js`: fixed skeleton

Copy this skeleton. Change only the view name, `CSS`, and the body of
`render`. The `build` function, the error panel and the style injection stay
identical across views.

```js
/* NthView — <view> renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first.
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";

  var CSS = [
    ".nthview{--nv-bg:#fff;--nv-fg:#111;--nv-muted:#555;--nv-accent:#2563eb;--nv-border:#ddd;--nv-error:#b91c1c;",
    "  color-scheme:light dark;background:var(--nv-bg);color:var(--nv-fg);",
    "  font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:60rem;margin:0 auto;padding:1rem;box-sizing:border-box}",
    "@media (prefers-color-scheme:dark){.nthview{--nv-bg:#111;--nv-fg:#eee;--nv-muted:#aaa;--nv-accent:#60a5fa;--nv-border:#333;--nv-error:#f87171}}",
    ".nthview *{box-sizing:border-box}",
    ".nthview :focus-visible{outline:3px solid var(--nv-accent);outline-offset:2px}",
    ".nthview-error-panel{border:2px solid var(--nv-error);border-radius:.5rem;padding:1rem}",
    ".nthview-error-panel h2{margin:0 0 .5rem;color:var(--nv-error)}",
    ".nthview-error-panel code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}",
    /* ---- view-specific styles below, every class prefixed nthview- ---- */
  ].join("\n");

  function injectStyles() {
    if (root.document.getElementById(STYLE_ID)) return;
    var style = root.document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    root.document.head.appendChild(style);
  }

  function el(tag, attrs, children) {
    var node = root.document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  function renderErrorPanel(container, result) {
    var items = result.errors.map(function (e) {
      return el("li", {}, [el("code", { text: e.path }), root.document.createTextNode(": " + e.message)]);
    });
    container.appendChild(el("div", { class: "nthview-error-panel", role: "alert" }, [
      el("h2", { text: "This view could not be built" }),
      el("p", { text: "The data has " + result.errors.length + " problem(s). Fix them and rebuild the file." }),
      el("ul", {}, items)
    ]));
  }

  // ---- view-specific rendering: data is already valid here ---------------
  function render(container, data) {
    container.appendChild(el("h1", { class: "nthview-title", text: data.title }));
    // ...build the view from data using el(); keep every class prefixed nthview-...
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-<view>");
    injectStyles();

    if (typeof NthView.validate !== "function") {
      renderErrorPanel(container, { errors: [{ path: "$", message: "validate.js must be inlined before view.js" }] });
      return { valid: false, errors: [], warnings: [] };
    }
    var result = NthView.validate(data);
    if (!result.valid) {
      renderErrorPanel(container, result);
      return result;
    }
    render(container, data);
    return result;
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
```

Rules the skeleton enforces and every view must keep:

1. Extends `NthView`, never replaces it.
2. `build` validates first, clears the container, injects styles once, and
   returns the validation result.
3. Error panel markup is fixed: `.nthview-error-panel[role=alert]` with an
   `h2`, a `p`, and a `ul` of `<code>path</code>: message`.
4. All CSS lives in the `CSS` string. Every class is prefixed `nthview-` and
   scoped under `.nthview`. Colours come from the `--nv-*` custom properties
   so light and dark mode share one rule set.
5. DOM is built with `el()` and `textContent`, never with `innerHTML` from
   data, so content cannot inject markup.
6. No `fetch`, `XMLHttpRequest`, `import`, and no local resources
   (`src="./x.js"`, `href="x.css"`, `url(./img.png)`). The only external
   resources are the CDN entries declared in `NthView.libs` (§5.4).
7. Responsive from 320px up; no horizontal page scroll.
8. Keyboard: every interactive element is a real `button`, `a`, `input` or
   has `tabindex="0"` plus a key handler; visible focus comes from the shared
   `:focus-visible` rule; correct roles and `aria-*` attributes.
9. Re-running `build()` replaces the previous render.
10. ES2018 or lower, no module syntax, no build step.

### 5.4 External libraries (CDN)

A view that genuinely needs a library (3D, charts, maths typesetting) or a
web font may load it from a CDN. The output stays one shareable file; the
browser fetches the library when the file opens. Declare every such resource
on the global, directly after `NthView.build` is defined:

```js
NthView.libs = [
  { kind: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js",
    global: "THREE", name: "three.js r128" },
  { kind: "style", href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible&display=swap",
    name: "Google Fonts" }
];
```

Rules:

1. Allowed hosts, and no others: `cdnjs.cloudflare.com`, `cdn.jsdelivr.net`,
   `unpkg.com`, `fonts.googleapis.com`, `fonts.gstatic.com`. Always `https`.
2. Pin the version in the URL (`three.js/r128/`, `chart.js/4.4.1/`). Never
   `latest`.
3. For every `script` entry, `build()` checks that `root[global]` exists and,
   if not, renders the standard error panel with one error at `$`:
   `"<name> did not load from <src>. This file needs internet access the
   first time it opens."` It never throws and never renders a broken scene.
4. The HTML template (§6) carries one tag per entry, before the inlined
   scripts. `scripts/build-html.js` writes them from `NthView.libs`.
5. `SKILL.md` names each library and states that the file needs internet
   access to load it.
6. Prefer no library when plain JavaScript and CSS do the job. A view with
   no libraries omits `NthView.libs` entirely.

---

## 6. The standalone HTML file: fixed template

Every view's output, including `examples/example.html`, is this file with the
four placeholders filled in. No other structure is permitted.

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <title>{{title}} — NthView</title>
</head>
<body>
  <div id="app"></div>

{{one tag per entry in NthView.libs, in order, or nothing when the view has none:
  <link rel="stylesheet" href="…">   for kind "style"
  <script src="…"></script>          for kind "script"}}

  <script type="application/json" id="nthview-data">
{{serialised JSON, with every "<" replaced by "\u003c"}}
  </script>

  <script>
{{full contents of scripts/validate.js, verbatim}}
  </script>
  <script>
{{full contents of assets/view.js, verbatim}}
  </script>
  <script>
    (function () {
      var data = JSON.parse(document.getElementById("nthview-data").textContent);
      NthView.build(document.getElementById("app"), data);
    })();
  </script>
</body>
</html>
```

Rules:

1. `id="nthview-data"` and `id="app"` are fixed names.
2. After serialising the JSON, replace every `<` with `\u003c`
   (`JSON.stringify(data).replace(/</g, "\\u003c")`). This is a valid JSON
   escape, so the data is unchanged after parsing, and it neutralises both
   `</script>` and `<!--`, which would otherwise end the script block early.
   Do not use `<\/script>` or `<\!--`: the second is not valid JSON.
3. The two scripts are copied **verbatim** and in that order. Never minify,
   edit or link them.
4. The bootstrap script is exactly the three lines shown.
5. The only `src=`, `href=` and `url(` values are the CDN entries from
   `NthView.libs`, `data:` URIs, or hyperlinks the view renders from the
   data. Never a relative or local path: the file must work when it is the
   only file on the machine.
6. Output file name: `<concept-slug>-<view>.html`, lowercase kebab-case.
7. One file, one view.

The repo tool assembles this template exactly, including the library tags
and the `\u003c` escaping, and is the recommended way to build any output:

```bash
node scripts/build-html.js skills/nthview-<view> data.json out.html
```

Pass `--example` instead of `data.json` to use the complete example from the
view's `references/schema.md`.

---

## 7. The gallery and the registry

`index.html` at the repo root is the gallery: it lists every skill with its
title, name and description, and offers **Open demo**, **Skill file** and
**Schema** links. It must work when opened straight from disk or from any
static host, so it cannot scan folders itself. Instead it reads one generated
file.

### 7.1 How registration works

```
skills/<name>/SKILL.md  ──(frontmatter name + description)──▶  scripts/build-registry.js  ──▶  registry.js  ──▶  index.html
```

1. The **single source of truth** is each skill's `SKILL.md` frontmatter.
   The gallery shows exactly the `description` written there, so write it for
   both the agent and the human reader.
2. `node scripts/build-registry.js` scans every `skills/*/SKILL.md`, checks
   the folder against §3, and writes `registry.js`:

   ```js
   window.NthViewRegistry = { "skills": [
     { "name": "nthview-quiz", "title": "Quiz", "kind": "view",
       "description": "...", "path": "skills/nthview-quiz",
       "skill": "skills/nthview-quiz/SKILL.md",
       "schema": "skills/nthview-quiz/references/schema.md",
       "demo": "skills/nthview-quiz/examples/example.html" }
   ] };
   ```

   `title` is derived from the folder name (`nthview-concept-map` → "Concept
   Map"). `kind` is `view` for `nthview-*` folders and `skill` for anything
   else (the router). `demo` and `schema` are `null` for non-views.
3. `index.html` loads `registry.js` with a plain `<script src>` (allowed from
   `file://`, unlike `fetch`) and renders one card per entry, views first.

### 7.2 Rules

- **Registering a skill = running the script.** After adding or changing any
  `SKILL.md`, run `node scripts/build-registry.js` and commit the updated
  `registry.js` together with the skill. The script exits non-zero and writes
  nothing if any folder breaks §3, so it doubles as the structure checker.
- **Never hand-edit `registry.js`.** It is generated and overwritten.
- **Never add per-view markup to `index.html`.** The page is generic and
  changes only when the gallery itself changes.
- `node scripts/build-registry.js --check` exits 1 when `registry.js` is
  stale. Run it before finishing any task that touched `skills/`.
- The frontmatter `description` must be a **single line** (the registry
  parser reads one `key: value` line per field; no YAML folding).
- Every view must have `examples/example.html`, because the gallery's
  "Open demo" link points at it; the script refuses a view without one.
- `index.html` follows the same standards as a view: no external resources
  (it needs none), light and dark mode, responsive, keyboard accessible, content rendered with
  `textContent` so a description can never inject markup.

---

## 8. Procedure every SKILL.md drives

The five numbered steps in §4 are mandatory and ordered. In short:

1. **Understand** the content the user wants to learn.
2. **Transform** it into the view's JSON exactly as `schema.md` defines.
3. **Validate** with `node scripts/validate.js` and fix every error.
4. **Build** one standalone HTML file with the §6 template.
5. **Deliver** that one file. Build nothing else unless asked.

---

## 9. Packaging as a Claude Code plugin (later)

The repo already has the plugin's standard layout. Add exactly these two files
when the time comes; touch nothing else.

`.claude-plugin/plugin.json`:

```json
{
  "name": "nthview",
  "version": "0.1.0",
  "description": "Learn anything, in the nth view that suits you. Skills that turn any concept into one shareable, single-file HTML view.",
  "author": { "name": "NthView contributors" },
  "repository": "https://github.com/<owner>/NthView",
  "license": "<SPDX id>",
  "keywords": ["learning", "education", "skills", "html", "single-file"]
}
```

`.claude-plugin/marketplace.json`:

```json
{
  "name": "nthview-marketplace",
  "owner": { "name": "NthView contributors" },
  "description": "Marketplace for the NthView learning-view skills",
  "plugins": [
    {
      "name": "nthview",
      "source": "./",
      "description": "Learn anything, in the nth view that suits you.",
      "category": "learning"
    }
  ]
}
```

Notes:

- `skills/` is scanned by default; no `skills` key is needed. `index.html`,
  `registry.js` and `scripts/` at the root are ignored by the plugin loader.
- Validate with `claude plugin validate .` before committing.
- Plugin names starting with `claude-` or `anthropic-` are refused, and a
  `CLAUDE.md` at the plugin root triggers a validator warning. That is why
  this file is `AGENTS.md`.
- Inside the plugin, skills are namespaced: `/nthview:nthview-quiz`. The
  router would be `/nthview:nthview`; decide on its name when it is built.
- Each view folder is also installable alone by copying it into
  `.claude/skills/` or `~/.claude/skills/`.

---

## 10. The router skill (later)

A skill named `nthview` at `skills/nthview/SKILL.md` will help a user pick a
view when they have not chosen one: it asks about the content and the goal,
recommends one view, and hands off to that view's skill. It builds nothing
itself and is added only after at least two views exist.

---

## 11. Checklist for adding a new view

Copy into the task; every box must be ticked.

**Structure (§3)**
- [ ] Folder `skills/nthview-<view>/` with exactly the five required files.
- [ ] No extra folders; no files other than `.md`, `.js`, `.html`.
- [ ] Nothing shared with or imported from another view.

**SKILL.md (§4)**
- [ ] Frontmatter `name` equals the folder name.
- [ ] `description` states what it produces and when to use it, third person,
      with trigger words, no procedure summary, under 1024 chars.
- [ ] Headings match the §4 template exactly, in order. Under 500 lines.

**schema.md (§5.1)**
- [ ] Headings match the template. Every field in a five-column table.
- [ ] `schemaVersion` (integer, required) and `title` (string, required) at
      the root.
- [ ] Cross-field rules and warnings listed.
- [ ] Complete example passes the validator with zero errors.

**validate.js (§5.2)**
- [ ] Built from the skeleton; only header, versions and `checkRoot` changed.
- [ ] Implements every schema rule and no others.
- [ ] Tested: schema example → `valid`; at least three broken variants → the
      expected `path: message` each; non-object input → one error at `$`;
      wrong `schemaVersion` → rejected.
- [ ] Runs in Node as a CLI with the exit codes in §5.2.

**view.js (§5.3)**
- [ ] Built from the skeleton; only header, `CSS` and `render` changed.
- [ ] Error panel verified by feeding invalid data.
- [ ] No `fetch(`, `XMLHttpRequest` or `import`; every URL is an allowed
      CDN host declared in `NthView.libs` (§5.4), version pinned.
- [ ] With a CDN library blocked, the page shows the error panel, not a
      blank screen.
- [ ] Checked at 320px and desktop width; both colour schemes; keyboard-only.
- [ ] Re-running `build()` replaces the render.

**example.html (§6)**
- [ ] Byte-for-byte follows the §6 template with the schema example.
- [ ] Opens from the filesystem with no console errors and renders correctly.

**Gallery registration (§7)**
- [ ] `node scripts/build-registry.js` runs with zero errors and lists the
      new view.
- [ ] `registry.js` is committed with the view; `index.html` was not edited.
- [ ] Opening `index.html` shows the new card; "Open demo" opens the example.
- [ ] `node scripts/build-registry.js --check` exits 0.

**Repo**
- [ ] README *Views* section lists the new view in one line.
- [ ] No other view folder was modified. Only one view was built.

Quick conformance commands:

```bash
node scripts/build-registry.js
```

```bash
node skills/nthview-<view>/scripts/validate.js /path/to/data.json
```

```bash
node scripts/build-registry.js --check
```

The first command checks the folder structure, forbidden calls and every URL
against the allowed CDN hosts, and must print no errors.

---

## 12. Conventions

### Naming
- Skill folders and `name`: `nthview-<view>`, lowercase, hyphens only, no
  consecutive hyphens. `<view>` is one word or hyphenated words
  (`quiz`, `concept-map`).
- Global: `NthView`, with public `validate` and `build` only. Helpers stay in
  the closure. `SUPPORTED_VERSIONS` is the one permitted extra property.
- CSS: `.nthview` on the container, every other class `nthview-<element>`,
  colours via `--nv-*` custom properties, style element id `nthview-style`.
- HTML ids: `nthview-data` for the data, `app` for the mount point.
- JSON keys `camelCase`; ids inside data are lowercase kebab-case strings.
- Output file: `<concept-slug>-<view>.html`.

### Dependencies
- No npm packages, bundlers or build steps. No `package.json` in the repo.
- CDN libraries and fonts only as §5.4 allows: allowed hosts, pinned
  versions, declared in `NthView.libs`, checked in `build()`.
- No analytics, tracking, or data fetched at runtime. The JSON is embedded.
- Node is used only to run the repo scripts; it is not a dependency of the
  output.
- Prefer inline SVG built via `el()` or Unicode over images and icon fonts.

### Error-message style
- Format: `path: message`. Path from the root with `.` and `[n]`; root is `$`.
- One sentence: what is wrong, then what was expected. Include the actual
  value when it helps. Examples:

```
items[3].answer: index 4 is out of range (4 options, valid indexes are 0–3)
items[1].question: must be a non-empty string
edges[2].to: node id "step-9" is not defined in nodes
schemaVersion: expected 1, got 2 (this validator understands version 1)
$: expected an object, got array
```

- Errors block; warnings advise. Never put a blocking problem in warnings.
- The in-page error panel shows the same strings the CLI prints.
- Avoid `invalid data`, `bad input`, `error in items`.

### Working in this repo
- One view per task. Do not scaffold future views.
- `schema.md`, `validate.js`, `view.js` and `example.html` change together.
- Any change under `skills/` ends with `node scripts/build-registry.js` and a
  committed `registry.js`.
- Root tooling lives in `scripts/` and runs on plain Node with no packages.
- Bump `schemaVersion` only for breaking changes; add the new number to
  `SUPPORTED_VERSIONS` and handle the old shape in `render` if feasible.
- Any change to a skeleton, template or rule in this file is made here first,
  in its own commit, then applied to every existing view.

---

## 13. Conventions borrowed from the reference repos

| Convention | Source |
| :- | :- |
| Skill = folder with `SKILL.md` plus optional `scripts/`, `references/`, `assets/`; `name` matches folder, 1–64 lowercase chars and hyphens, no leading/trailing/double hyphen; `description` 1–1024 chars saying what and when; `SKILL.md` under 500 lines; relative file references one level deep; progressive disclosure | Agent Skills specification (agentskills.io) |
| Self-contained skill folders under `skills/`; root `README.md`; minimal `name` + `description` frontmatter as in the template skill; `.claude-plugin/` at the repo root so the skills repo doubles as a plugin marketplace | anthropics/skills |
| Description leads with use case and trigger words, third person, never summarises the workflow; body sections *Overview*, *When to use*, *Common mistakes*; heavy reference moved to separate files; scripts invoked through their interpreter (`node scripts/x.js`); test a skill against failing scenarios | obra/superpowers (`writing-skills`) |
| Plugin root holds `skills/<name>/SKILL.md`; `.claude-plugin/plugin.json` with only `name` required, kebab-case, no `claude-`/`anthropic-` prefixes; `skills/` scanned by default; `.claude-plugin/marketplace.json` with `name`, `owner`, `plugins[]`, relative `source` starting with `./`; `CLAUDE.md` at plugin root warns; `claude plugin validate` | Claude Code plugin and marketplace references |
| Optional frontmatter such as `argument-hint`, `disable-model-invocation`, `allowed-tools`; listing text truncated at 1,536 chars; plugin skills namespaced `/<plugin>:<skill>` | Claude Code skills documentation |

Everything in §§3–6 that goes beyond these sources (the fixed five files, the
`NthView` global, the validator shape, the skeletons, the error panel, the
CDN rules, the HTML template) is NthView's own contract, fixed so every view behaves
identically for users and agents.
