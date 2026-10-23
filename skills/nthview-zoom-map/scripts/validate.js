/* NthView — zoom-map validator — schemaVersion 1
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
  var THEMES = ["blueprint", "paper", "graphite", "aurora", "porcelain"];
  var KINDS = ["system", "pillar", "concept", "mechanism", "file"];
  var COLORS = ["red", "orange", "gold", "green", "teal", "blue", "violet", "pink"];
  var KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var LANG = /^[a-z0-9+#-]+$/;
  /* which kinds may sit directly under which */
  var ALLOWED_CHILDREN = {
    system: ["pillar"],
    pillar: ["concept", "file"],
    concept: ["concept", "mechanism", "file"],
    mechanism: ["mechanism", "file"],
    file: []
  };
  var CONTENT_KEYS = ["summary", "facts", "snippet", "table", "stack", "note", "deeper"];
  var ROOT_KEYS = ["schemaVersion", "title", "subtitle", "theme", "levels", "root", "pipelines", "relations", "glossary", "footer"];
  var NODE_KEYS = ["id", "title", "kind", "oneLiner", "tag", "heading", "color", "level", "files", "children"].concat(CONTENT_KEYS);
  var LEVEL_KEYS = ["label", "name", "meaning", "heading", "fileMap"].concat(CONTENT_KEYS);
  var PIPE_KEYS = ["id", "title", "steps", "rule", "level", "at"].concat(CONTENT_KEYS);
  var MAX_NODES = 250, MAX_FILES = 500, MAX_DEPTH = 6;

  function checkRoot(data, error, warn) {
    var rich = [];               /* mark-up fields, checked for ((term)) and [[id]] once every id is known */
    function markup(obj, key, parent, max, required) {
      var ok = required ? requireString(obj, key, parent, 1, max, error) : optionalString(obj, key, parent, max, error);
      if (ok && typeof obj[key] === "string") rich.push({ text: obj[key], path: join(parent, key) });
    }

    unknownKeys(data, ROOT_KEYS, "$", warn);
    requireString(data, "title", "$", 1, 120, error);
    optionalString(data, "subtitle", "$", 200, error);
    if (data.theme !== undefined && THEMES.indexOf(data.theme) === -1) {
      error("theme", "must be one of " + THEMES.join(", ") + ", got " + describe(data.theme));
    }
    markup(data, "footer", "$", 400, false);

    /* ---- levels ---- */
    var L = null;
    var levelUse = [];
    if (requireArray(data, "levels", "$", 2, 8, error)) {
      L = data.levels.length;
      var fileMaps = 0;
      data.levels.forEach(function (lv, i) {
        var p = "levels[" + i + "]";
        levelUse.push(false);
        if (!isObject(lv)) { error(p, "must be an object, got " + describe(lv)); return; }
        unknownKeys(lv, LEVEL_KEYS, p, warn);
        optionalString(lv, "label", p, 8, error);
        if (typeof lv.label === "string" && !lv.label.trim()) error(p + ".label", "must not be blank when given");
        requireString(lv, "name", p, 1, 40, error);
        requireString(lv, "meaning", p, 1, 200, error);
        optionalString(lv, "heading", p, 120, error);
        if (lv.fileMap !== undefined) {
          if (typeof lv.fileMap !== "boolean") error(p + ".fileMap", "must be true or false, got " + describe(lv.fileMap));
          else if (lv.fileMap) { fileMaps++; levelUse[i] = true; if (fileMaps === 2) error(p + ".fileMap", "only one level may hold the file map; an earlier level already sets fileMap: true"); }
        }
        if (checkContent(lv, p)) levelUse[i] = true;
      });
    }

    /* ---- glossary (collected first so mark-up can refer to it) ---- */
    var terms = {};
    if (data.glossary !== undefined && requireArray(data, "glossary", "$", 0, 120, error)) {
      data.glossary.forEach(function (g, i) {
        var p = "glossary[" + i + "]";
        if (!isObject(g)) { error(p, "must be an object, got " + describe(g)); return; }
        unknownKeys(g, ["term", "meaning"], p, warn);
        if (requireString(g, "term", p, 1, 60, error)) {
          var key = g.term.trim().toLowerCase();
          if (terms[key]) error(p + ".term", "\"" + g.term + "\" is already defined at " + terms[key]);
          else terms[key] = p;
        }
        markup(g, "meaning", p, 500, true);
      });
    }

    /* ---- the node tree ---- */
    var ids = {};                /* id -> { path, parent id, kind } */
    var nodeCount = 0, fileCount = 0, maxDepth = 0, deepest = null;
    var tooDeepReported = false;
    if (data.root === undefined) error("root", "is required: the system node, with the pillars as its children");
    else if (!isObject(data.root)) error("root", "must be a Node object, got " + describe(data.root));
    else walk(data.root, "root", 0, null, 0);

    function walk(n, p, depth, parent, parentLevel) {
      if (!isObject(n)) { error(p, "must be a Node object, got " + describe(n)); return; }
      nodeCount++;
      if (nodeCount === MAX_NODES + 1) error(p, "the tree has more than " + MAX_NODES + " nodes; split the system into several maps or merge small nodes");
      if (depth > maxDepth) { maxDepth = depth; deepest = p; }
      unknownKeys(n, NODE_KEYS, p, warn);

      var idOk = false;
      if (requireString(n, "id", p, 1, 48, error)) {
        if (!KEBAB.test(n.id)) error(p + ".id", "must be kebab-case (lowercase letters, digits and single hyphens), got " + describe(n.id));
        else if (ids[n.id]) error(p + ".id", "\"" + n.id + "\" is already used by " + ids[n.id].path);
        else { ids[n.id] = { path: p, parent: parent ? parent.id : null, kind: n.kind }; idOk = true; }
      }
      if (requireString(n, "title", p, 1, 60, error) && n.title.length > 32) {
        warn(p + ".title", "is " + n.title.length + " characters; titles over 32 characters are clipped on small regions");
      }
      if (requireString(n, "oneLiner", p, 1, 160, error) && n.oneLiner.length > 110) {
        warn(p + ".oneLiner", "is " + n.oneLiner.length + " characters; one-liners over 110 characters are clipped on small regions");
      }
      optionalString(n, "tag", p, 40, error);
      optionalString(n, "heading", p, 120, error);

      var kindOk = KINDS.indexOf(n.kind) !== -1;
      if (!kindOk) error(p + ".kind", "must be one of " + KINDS.join(", ") + ", got " + describe(n.kind));
      else if (depth === 0 && n.kind !== "system") error(p + ".kind", "the root must be the \"system\" node, got " + describe(n.kind));
      else if (parent && kindOk && KINDS.indexOf(parent.kind) !== -1) {
        var allowed = ALLOWED_CHILDREN[parent.kind];
        if (allowed.indexOf(n.kind) === -1) {
          error(p + ".kind", "a " + n.kind + " cannot sit directly under a " + parent.kind + " (expected " + allowed.join(" or ") + ")");
        }
      }

      if (n.color !== undefined) {
        if (COLORS.indexOf(n.color) === -1) error(p + ".color", "must be one of " + COLORS.join(", ") + ", got " + describe(n.color));
        else if (n.kind !== "pillar") error(p + ".color", "only pillars carry a colour; this node inherits its pillar's colour");
      }

      /* level: explicit or derived, never lower than the parent's */
      var level = depth === 0 ? 0 : Math.max(parentLevel, L ? Math.min(depth, L - 1) : depth);
      if (n.level !== undefined) {
        if (typeof n.level !== "number" || n.level % 1 !== 0) error(p + ".level", "must be an integer index into levels, got " + describe(n.level));
        else if (L !== null && (n.level < 0 || n.level >= L)) error(p + ".level", "level " + n.level + " is out of range (" + L + " levels, valid indexes are 0–" + (L - 1) + ")");
        else if (depth === 0 && n.level !== 0) error(p + ".level", "the root is always on level 0, got " + n.level);
        else if (depth > 0 && n.level < parentLevel) error(p + ".level", "level " + n.level + " is lower than its parent's level " + parentLevel + "; a node never sits above its parent on the ladder");
        else if (n.kind === "pillar" && n.level === 0) error(p + ".level", "a pillar cannot share level 0 with the big idea");
        else level = n.level;
      }
      if (L !== null && level >= 0 && level < L) levelUse[level] = true;

      checkContent(n, p);

      if (n.files !== undefined) {
        if (n.kind === "file") error(p + ".files", "a file node is itself a file; list paths on its parent instead");
        else if (requireArray(n, "files", p, 1, 80, error)) {
          var seen = {};
          n.files.forEach(function (f, i) {
            var fp = p + ".files[" + i + "]";
            if (!isObject(f)) { error(fp, "must be an object with path and role, got " + describe(f)); return; }
            unknownKeys(f, ["path", "role", "group"], fp, warn);
            fileCount++;
            if (fileCount === MAX_FILES + 1) error(fp, "more than " + MAX_FILES + " files are listed in all; keep the files that explain the system");
            if (requireString(f, "path", fp, 1, 200, error)) {
              if (seen[f.path]) error(fp + ".path", "\"" + f.path + "\" is already listed at " + seen[f.path]);
              else seen[f.path] = fp;
            }
            markup(f, "role", fp, 300, true);
            optionalString(f, "group", fp, 80, error);
          });
        }
      }

      if (n.children !== undefined) {
        if (n.kind === "file") error(p + ".children", "a file node has no children");
        else {
          var min = depth === 0 ? 2 : 1, max = depth === 0 ? 12 : 16;
          if (requireArray(n, "children", p, min, max, error)) {
            if (depth === 0 && (n.children.length < 3 || n.children.length > 7)) {
              warn(p + ".children", "has " + n.children.length + " pillars; 3–7 read best on the overview");
            } else if (depth > 0 && n.children.length > 9) {
              warn(p + ".children", "has " + n.children.length + " children; more than 9 make small regions, consider grouping them");
            }
            if (depth + 1 > MAX_DEPTH) {
              if (!tooDeepReported) error(p + ".children", "the tree is deeper than " + MAX_DEPTH + " levels below the root; merge levels so the ladder stays climbable");
              tooDeepReported = true;
            } else {
              n.children.forEach(function (c, i) { walk(c, p + ".children[" + i + "]", depth + 1, idOk || n.id ? n : null, level); });
            }
          }
        }
      } else if (depth === 0) {
        error(p + ".children", "is required: the root holds the pillars (2–12)");
      }

      if (n.kind === "pillar" && !(Array.isArray(n.children) && n.children.length)) {
        warn(p, "pillar \"" + (n.title || n.id) + "\" has no children; zooming into it shows only its own card");
      } else if ((n.kind === "concept" || n.kind === "mechanism") && n.summary === undefined && n.facts === undefined && n.children === undefined) {
        warn(p, (n.kind) + " \"" + (n.title || n.id) + "\" has no summary, facts or children; an empty region teaches nothing");
      }
    }

    if (isObject(data.root) && Array.isArray(data.root.children) && maxDepth < 2) {
      error("root", "the tree must be at least 2 levels deep: give at least one pillar some concepts (children)");
    }
    if (nodeCount > 200 && nodeCount <= MAX_NODES) warn("root", "the tree has " + nodeCount + " nodes; more than 200 make the doc long and the map dense");
    if (fileCount > 400 && fileCount <= MAX_FILES) warn("root", fileCount + " files are listed; more than 400 make the file map hard to scan");

    function isAncestor(a, b) {                      /* true when node a contains node b */
      var cur = ids[b] ? ids[b].parent : null;
      while (cur) { if (cur === a) return true; cur = ids[cur] ? ids[cur].parent : null; }
      return false;
    }
    function nodeRef(obj, key, p) {
      if (obj[key] === undefined) return false;
      if (typeof obj[key] !== "string") { error(join(p, key), "must be a node id, got " + describe(obj[key])); return false; }
      if (!ids[obj[key]]) { error(join(p, key), "node id \"" + obj[key] + "\" is not defined in the tree"); return false; }
      return true;
    }

    /* ---- pipelines ---- */
    var pipeIds = {};
    var pipeCount = 0;
    if (data.pipelines !== undefined && requireArray(data, "pipelines", "$", 0, 12, error)) {
      pipeCount = data.pipelines.length;
      data.pipelines.forEach(function (pl, i) {
        var p = "pipelines[" + i + "]";
        if (!isObject(pl)) { error(p, "must be an object, got " + describe(pl)); return; }
        unknownKeys(pl, PIPE_KEYS, p, warn);
        if (requireString(pl, "id", p, 1, 48, error)) {
          if (!KEBAB.test(pl.id)) error(p + ".id", "must be kebab-case (lowercase letters, digits and single hyphens), got " + describe(pl.id));
          else if (ids[pl.id]) error(p + ".id", "\"" + pl.id + "\" is already used by the node at " + ids[pl.id].path);
          else if (pipeIds[pl.id]) error(p + ".id", "\"" + pl.id + "\" is already used by " + pipeIds[pl.id]);
          else pipeIds[pl.id] = p;
        }
        requireString(pl, "title", p, 1, 80, error);
        markup(pl, "rule", p, 600, false);
        if (pl.level !== undefined && pl.at !== undefined) error(p, "sets both level and at; keep one (at places it inside a node's section)");
        if (pl.level !== undefined) {
          if (typeof pl.level !== "number" || pl.level % 1 !== 0) error(p + ".level", "must be an integer index into levels, got " + describe(pl.level));
          else if (L !== null && (pl.level < 0 || pl.level >= L)) error(p + ".level", "level " + pl.level + " is out of range (" + L + " levels, valid indexes are 0–" + (L - 1) + ")");
          else levelUse[pl.level] = true;
        } else if (pl.at === undefined && L !== null) levelUse[Math.min(1, L - 1)] = true;
        nodeRef(pl, "at", p);
        checkContent(pl, p);
        if (requireArray(pl, "steps", p, 2, 12, error)) {
          pl.steps.forEach(function (s, j) {
            var sp = p + ".steps[" + j + "]";
            if (!isObject(s)) { error(sp, "must be an object, got " + describe(s)); return; }
            unknownKeys(s, ["node", "label", "text", "tag"], sp, warn);
            nodeRef(s, "node", sp);
            if (s.node === undefined) requireString(s, "label", sp, 1, 40, error);
            else optionalString(s, "label", sp, 40, error);
            markup(s, "text", sp, 200, false);
            optionalString(s, "tag", sp, 30, error);
          });
        }
      });
    }

    /* ---- relations ---- */
    var relCount = 0;
    if (data.relations !== undefined && requireArray(data, "relations", "$", 0, 300, error)) {
      relCount = data.relations.length;
      var relSeen = {};
      data.relations.forEach(function (r, i) {
        var p = "relations[" + i + "]";
        if (!isObject(r)) { error(p, "must be an object, got " + describe(r)); return; }
        unknownKeys(r, ["from", "to", "label", "text"], p, warn);
        var a = nodeRef(r, "from", p);
        if (r.from === undefined) error(p + ".from", "is required: the node id the arrow starts from");
        var b = nodeRef(r, "to", p);
        if (r.to === undefined) error(p + ".to", "is required: the node id the arrow points to");
        if (a && b) {
          if (r.from === r.to) error(p + ".to", "points back to its own start \"" + r.from + "\"; a relation joins two different nodes");
          else if (isAncestor(r.from, r.to)) error(p, "\"" + r.from + "\" contains \"" + r.to + "\"; a relation must join two regions that do not contain each other");
          else if (isAncestor(r.to, r.from)) error(p, "\"" + r.to + "\" contains \"" + r.from + "\"; a relation must join two regions that do not contain each other");
        }
        if (requireString(r, "label", p, 1, 32, error) && a && b) {
          var k = r.from + " -> " + r.to + " : " + r.label.trim().toLowerCase();
          if (relSeen[k]) warn(p, "repeats " + relSeen[k] + " (same from, to and label)");
          else relSeen[k] = p;
        }
        markup(r, "text", p, 300, false);
      });
    }
    if (!relCount && !pipeCount && isObject(data.root)) warn("relations", "there are no relations and no pipelines, so the map shows no connectors");

    if (L !== null) {
      levelUse.forEach(function (used, i) {
        if (!used && isObject(data.levels[i])) warn("levels[" + i + "]", "level \"" + (data.levels[i].name || i) + "\" has nothing on it (no node, pipeline, content or file map)");
      });
    }

    /* ---- mark-up references ---- */
    rich.forEach(function (r) {
      var text = r.text.replace(/`[^`]*`/g, "");
      var m, re = /\(\(([^()]+)\)\)/g;
      while ((m = re.exec(text))) {
        var bits = m[1].split("|"), term = bits[bits.length - 1].trim().toLowerCase();
        if (!terms[term]) error(r.path, "glossary term \"" + bits[bits.length - 1].trim() + "\" in ((…)) is not defined in glossary");
      }
      var re2 = /\[\[([^\[\]]+)\]\]/g;
      while ((m = re2.exec(text))) {
        var parts = m[1].split("|"), id = parts[parts.length - 1].trim();
        if (!ids[id]) error(r.path, "node id \"" + id + "\" in [[…]] is not defined in the tree");
      }
    });

    /* ---- content fields shared by nodes, levels and pipelines ---- */
    function checkContent(obj, p) {
      var any = false;
      CONTENT_KEYS.forEach(function (k) { if (obj[k] !== undefined) any = true; });
      markup(obj, "summary", p, 3000, false);
      markup(obj, "note", p, 800, false);
      if (obj.facts !== undefined && requireArray(obj, "facts", p, 1, 12, error)) {
        obj.facts.forEach(function (f, i) {
          var fp = p + ".facts[" + i + "]";
          if (typeof f === "string") {
            if (!f.trim()) error(fp, "must be a non-empty string");
            else if (f.length > 300) error(fp, "must be at most 300 characters, got " + f.length);
            else rich.push({ text: f, path: fp });
          } else if (isObject(f)) {
            unknownKeys(f, ["label", "text"], fp, warn);
            requireString(f, "label", fp, 1, 60, error);
            markup(f, "text", fp, 500, true);
          } else error(fp, "must be a string or an object with label and text, got " + describe(f));
        });
      }
      if (obj.snippet !== undefined) {
        if (Array.isArray(obj.snippet)) {
          if (obj.snippet.length < 1 || obj.snippet.length > 4) error(p + ".snippet", "must hold 1–4 snippets, got " + obj.snippet.length);
          else obj.snippet.forEach(function (s, i) { checkSnippet(s, p + ".snippet[" + i + "]"); });
        } else checkSnippet(obj.snippet, p + ".snippet");
      }
      if (obj.table !== undefined) {
        var tp = p + ".table", t = obj.table;
        if (!isObject(t)) error(tp, "must be an object with columns and rows, got " + describe(t));
        else {
          unknownKeys(t, ["columns", "rows", "caption"], tp, warn);
          var cols = null;
          if (requireArray(t, "columns", tp, 2, 6, error)) {
            cols = t.columns.length;
            t.columns.forEach(function (c, i) { if (typeof c !== "string" || !c.trim() || c.length > 40) error(tp + ".columns[" + i + "]", "must be a string of 1–40 characters, got " + describe(c)); });
          }
          if (requireArray(t, "rows", tp, 1, 60, error)) {
            t.rows.forEach(function (row, i) {
              var rp = tp + ".rows[" + i + "]";
              if (!Array.isArray(row)) { error(rp, "must be an array of cells, got " + describe(row)); return; }
              if (cols !== null && row.length !== cols) error(rp, "has " + row.length + " cell(s) but the table has " + cols + " columns");
              row.forEach(function (cell, j) {
                if (typeof cell !== "string") error(rp + "[" + j + "]", "must be a string, got " + describe(cell));
                else if (cell.length > 400) error(rp + "[" + j + "]", "must be at most 400 characters, got " + cell.length);
                else rich.push({ text: cell, path: rp + "[" + j + "]" });
              });
            });
          }
          markup(t, "caption", tp, 300, false);
        }
      }
      if (obj.stack !== undefined && requireArray(obj, "stack", p, 2, 8, error)) {
        obj.stack.forEach(function (layer, i) {
          var lp = p + ".stack[" + i + "]";
          if (!isObject(layer)) { error(lp, "must be an object with name and items, got " + describe(layer)); return; }
          unknownKeys(layer, ["name", "caption", "items"], lp, warn);
          requireString(layer, "name", lp, 1, 60, error);
          optionalString(layer, "caption", lp, 120, error);
          if (requireArray(layer, "items", lp, 1, 20, error)) {
            layer.items.forEach(function (it, j) { if (typeof it !== "string" || !it.trim() || it.length > 80) error(lp + ".items[" + j + "]", "must be a string of 1–80 characters, got " + describe(it)); });
          }
        });
      }
      if (obj.deeper !== undefined) {
        var dp = p + ".deeper";
        if (!isObject(obj.deeper)) error(dp, "must be an object with text (and an optional title), got " + describe(obj.deeper));
        else {
          unknownKeys(obj.deeper, ["title", "text"], dp, warn);
          optionalString(obj.deeper, "title", dp, 100, error);
          markup(obj.deeper, "text", dp, 5000, true);
        }
      }
      return any;
    }
    function checkSnippet(s, sp) {
      if (!isObject(s)) { error(sp, "must be an object with code, got " + describe(s)); return; }
      unknownKeys(s, ["code", "lang", "label", "caption", "result", "resultLabel"], sp, warn);
      if (typeof s.code !== "string") error(sp + ".code", "must be a string, got " + describe(s.code));
      else if (!s.code.trim()) error(sp + ".code", "must be a non-empty string");
      else if (s.code.length > 5000) error(sp + ".code", "must be at most 5000 characters, got " + s.code.length);
      if (optionalString(s, "lang", sp, 20, error) && typeof s.lang === "string" && !LANG.test(s.lang)) {
        error(sp + ".lang", "must be lowercase letters, digits, +, # or -, got " + describe(s.lang));
      }
      optionalString(s, "label", sp, 100, error);
      markup(s, "caption", sp, 400, false);
      markup(s, "result", sp, 1500, false);
      optionalString(s, "resultLabel", sp, 100, error);
    }
  }

  function isObject(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
  function optionalString(obj, key, parent, max, error) {
    if (obj[key] === undefined) return true;
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (v.length > max) { error(path, "must be at most " + max + " characters, got " + v.length); return false; }
    return true;
  }
  function unknownKeys(obj, known, parent, warn) {
    Object.keys(obj).forEach(function (k) {
      if (known.indexOf(k) === -1) warn(join(parent, k), "is not a known field and is ignored (known: " + known.join(", ") + ")");
    });
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
