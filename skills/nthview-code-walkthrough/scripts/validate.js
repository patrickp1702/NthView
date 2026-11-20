/* NthView — code-walkthrough validator — schemaVersion 1
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
  var KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var LANGS = ["c", "cpp", "csharp", "java", "kotlin", "swift", "go", "rust", "js", "ts",
    "python", "ruby", "php", "shell", "sql", "html", "css", "json", "yaml", "text"];
  var KINDS = ["choice", "spot", "predict", "fill", "order"];
  var MAX_LINE = 160, WARN_COLS = 80, TAB = 4;

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
    optionalString(data, "subtitle", "$", 200, error);
    optionalStringArray(data, "intro", "$", 0, 4, 700, error);
    optionalString(data, "goal", "$", 300, error);

    var snippets = {};
    if (requireArray(data, "snippets", "$", 1, 4, error)) {
      data.snippets.forEach(function (s, i) {
        var sn = checkSnippet(s, "snippets[" + i + "]", error, warn);
        if (sn) {
          if (snippets[sn.id]) error("snippets[" + i + "].id", "duplicate snippet id \"" + sn.id + "\"");
          else snippets[sn.id] = sn;
        }
      });
    }
    var single = Array.isArray(data.snippets) && data.snippets.length === 1;

    var stepIds = {}, subgoals = [], lastSubgoal = null, noteLinks = [];
    var ctx = { ids: {}, kinds: {}, n: 0, snippets: snippets };
    if (requireArray(data, "steps", "$", 1, 60, error)) {
      data.steps.forEach(function (st, i) {
        var p = "steps[" + i + "]";
        if (!isObject(st)) { error(p, "must be an object, got " + describe(st)); return; }
        if (requireId(st, "id", p, error)) {
          if (stepIds[st.id]) error(p + ".id", "duplicate step id \"" + st.id + "\"");
          stepIds[st.id] = true;
        }
        requireString(st, "title", p, 1, 80, error);
        optionalString(st, "subgoal", p, 60, error);
        if (requireArray(st, "note", p, 1, 5, error)) {
          st.note.forEach(function (n, j) { stringItem(n, p + ".note[" + j + "]", 800, error); });
        }
        var sn = resolveSnippet(st, p, snippets, single, data, error);
        var range = null;
        if (st.lines === undefined) error(p + ".lines", "must be an array [first, last], got undefined (missing)");
        else range = checkRange(st.lines, p + ".lines", sn, error);
        if (range && range[1] - range[0] + 1 > 15) {
          warn(p + ".lines", "covers " + (range[1] - range[0] + 1) + " lines; a step that focuses on 1–8 lines is easier to follow");
        }
        if (st.focus !== undefined && requireArray(st, "focus", p, 0, 6, error)) {
          st.focus.forEach(function (f, j) {
            var fp = p + ".focus[" + j + "]";
            if (!isObject(f)) { error(fp, "must be an object, got " + describe(f)); return; }
            var okLine = requireLine(f, "line", fp, sn, error);
            if (requireString(f, "text", fp, 1, MAX_LINE, error) && okLine && sn) {
              var line = sn.lines[f.line - sn.start];
              if (line.indexOf(f.text) === -1) error(fp + ".text", JSON.stringify(f.text) + " does not occur on line " + f.line + " of snippet \"" + sn.id + "\"");
            }
            if (okLine && range && (f.line < range[0] || f.line > range[1])) {
              warn(fp + ".line", "line " + f.line + " is outside the step's lines " + range[0] + "–" + range[1]);
            }
          });
        }
        if (st.watch !== undefined && requireArray(st, "watch", p, 0, 8, error)) {
          st.watch.forEach(function (w, j) {
            var wp = p + ".watch[" + j + "]";
            if (!isObject(w)) { error(wp, "must be an object, got " + describe(w)); return; }
            requireString(w, "name", wp, 1, 40, error);
            requireString(w, "value", wp, 1, 80, error);
            optionalString(w, "note", wp, 160, error);
          });
        }
        if (st.checks !== undefined && requireArray(st, "checks", p, 0, 4, error)) {
          var before = 0;
          st.checks.forEach(function (c, j) {
            if (checkCheck(c, p + ".checks[" + j + "]", sn, ctx, error, warn) && c.ask === "before") before++;
          });
          if (before > 1) error(p + ".checks", "at most one check per step may have ask \"before\", got " + before);
        }
        if (typeof st.subgoal === "string") {
          if (st.subgoal.length > 48) warn(p + ".subgoal", "a subgoal label of " + st.subgoal.length + " characters; keep it a short action phrase such as \"Read the claimed length\"");
          if (st.subgoal !== lastSubgoal) subgoals.push(st.subgoal);
          lastSubgoal = st.subgoal;
        }
        if (Array.isArray(st.note)) noteLinks.push({ path: p + ".note", note: st.note });
      });
    }
    var firstSn = Array.isArray(data.snippets) && isObject(data.snippets[0]) ? snippets[data.snippets[0].id] || null : null;
    if (data.opening !== undefined) {
      if (checkCheck(data.opening, "opening", single ? firstSn : undefined, ctx, error, warn) && data.opening.ask !== undefined) {
        error("opening.ask", "is not used on the opening check; remove it");
      }
    }
    if (isObject(data.summary)) {
      optionalString(data.summary, "heading", "summary", 80, error);
      if (requireArray(data.summary, "points", "summary", 1, 8, error)) {
        data.summary.points.forEach(function (s, j) { stringItem(s, "summary.points[" + j + "]", 300, error); });
      }
      optionalString(data.summary, "closing", "summary", 700, error);
      if (data.summary.checks !== undefined && requireArray(data.summary, "checks", "summary", 0, 3, error)) {
        data.summary.checks.forEach(function (c, j) {
          if (checkCheck(c, "summary.checks[" + j + "]", single ? firstSn : undefined, ctx, error, warn) && c.ask !== undefined) {
            error("summary.checks[" + j + "].ask", "is not used on wrap-up checks; remove it");
          }
        });
      }
    } else {
      error("summary", "must be an object, got " + describe(data.summary));
    }

    if (data.sources !== undefined && requireArray(data, "sources", "$", 0, 8, error)) {
      data.sources.forEach(function (s, i) {
        var p = "sources[" + i + "]";
        if (!isObject(s)) { error(p, "must be an object, got " + describe(s)); return; }
        requireString(s, "label", p, 1, 160, error);
        if (requireString(s, "href", p, 1, 400, error) && !/^https?:\/\/[^\s]+$/.test(s.href)) {
          error(p + ".href", "must be an http or https URL, got " + JSON.stringify(s.href));
        }
        optionalString(s, "note", p, 200, error);
      });
    }

    noteLinks.forEach(function (n) {
      n.note.forEach(function (para, j) {
        if (typeof para !== "string") return;
        var m, re = /\[\[([^\]]*)\]\]/g;
        while ((m = re.exec(para))) {
          if (!stepIds[m[1]]) error(n.path + "[" + j + "]", "link [[" + m[1] + "]] does not name a step id");
        }
      });
    });
    if (subgoals.length > 8) warn("steps", subgoals.length + " subgoal groups; 3–6 short subgoals per walkthrough are easier to hold in mind");

    if (Array.isArray(data.steps) && data.steps.length > 0) {
      if (data.steps.length < 3) warn("steps", "only " + data.steps.length + " step(s); a walkthrough usually needs 4–20");
      if (ctx.n < 3) warn("steps", "only " + ctx.n + " check(s) in total; attach 3 or more so the learner can test themselves");
      var nk = Object.keys(ctx.kinds).length;
      if (ctx.n >= 6 && nk < 3) warn("steps", "the checks use " + nk + " kind(s); mix at least 3 of " + KINDS.join(", "));
    }
  }

  function checkSnippet(s, p, error, warn) {
    if (!isObject(s)) { error(p, "must be an object, got " + describe(s)); return null; }
    var ok = requireId(s, "id", p, error);
    optionalString(s, "title", p, 80, error);
    optionalString(s, "path", p, 160, error);
    optionalString(s, "caption", p, 300, error);
    if (LANGS.indexOf(s.lang) === -1) error(p + ".lang", "must be one of " + LANGS.join(", ") + ", got " + describe(s.lang));
    var start = 1;
    if (s.startLine !== undefined) {
      if (!isInt(s.startLine) || s.startLine < 1) { error(p + ".startLine", "must be an integer of 1 or more, got " + describe(s.startLine)); ok = false; }
      else start = s.startLine;
    }
    if (!requireString(s, "code", p, 1, 12000, error)) return null;
    var lines = splitLines(s.code);
    if (lines.length > 200) { error(p + ".code", "must have at most 200 lines, got " + lines.length); ok = false; }
    var wide = 0;
    lines.forEach(function (l, i) {
      if (l.length > MAX_LINE) { error(p + ".code", "line " + (start + i) + " is " + l.length + " characters; at most " + MAX_LINE + " allowed"); ok = false; }
      else if (columns(l) > WARN_COLS) wide++;
    });
    if (wide) warn(p + ".code", wide + " line(s) are wider than " + WARN_COLS + " columns (tabs count as " + TAB + "); phones will scroll or wrap them");
    return ok ? { id: s.id, start: start, lines: lines } : null;
  }

  function resolveSnippet(st, p, snippets, single, data, error) {
    if (st.snippet === undefined) {
      if (single) return snippets[data.snippets[0].id] || null;
      error(p + ".snippet", "is required when there is more than one snippet");
      return null;
    }
    if (typeof st.snippet !== "string") { error(p + ".snippet", "must be a snippet id string, got " + describe(st.snippet)); return null; }
    if (!snippets[st.snippet]) {
      if (Array.isArray(data.snippets) && data.snippets.some(function (s) { return isObject(s) && s.id === st.snippet; })) return null;
      error(p + ".snippet", "snippet id \"" + st.snippet + "\" is not defined in snippets");
      return null;
    }
    return snippets[st.snippet];
  }

  function checkRange(v, p, sn, error) {
    if (!Array.isArray(v) || v.length !== 2 || !isInt(v[0]) || !isInt(v[1])) {
      error(p, "must be an array of two integers [first, last], got " + describe(v)); return null;
    }
    if (v[0] > v[1]) { error(p, "first line " + v[0] + " is after last line " + v[1]); return null; }
    if (!sn) return null;
    var lo = sn.start, hi = sn.start + sn.lines.length - 1;
    if (v[0] < lo || v[1] > hi) {
      error(p, "lines " + v[0] + "–" + v[1] + " are out of range (snippet \"" + sn.id + "\" has lines " + lo + "–" + hi + ")"); return null;
    }
    return v;
  }

  function requireLine(obj, key, p, sn, error) {
    var v = obj[key], path = join(p, key);
    if (!isInt(v)) { error(path, "must be an integer line number, got " + describe(v)); return false; }
    if (!sn) return false;
    var lo = sn.start, hi = sn.start + sn.lines.length - 1;
    if (v < lo || v > hi) { error(path, "line " + v + " is out of range (snippet \"" + sn.id + "\" has lines " + lo + "–" + hi + ")"); return false; }
    return true;
  }

  function checkCheck(c, p, sn, ctx, error, warn) {
    if (!isObject(c)) { error(p, "must be an object, got " + describe(c)); return false; }
    if (requireId(c, "id", p, error)) {
      if (ctx.ids[c.id]) error(p + ".id", "duplicate check id \"" + c.id + "\"");
      ctx.ids[c.id] = true;
    }
    if (c.ask !== undefined && c.ask !== "before" && c.ask !== "after") {
      error(p + ".ask", "must be \"before\" or \"after\", got " + describe(c.ask));
    }
    if (KINDS.indexOf(c.kind) === -1) error(p + ".kind", "must be one of " + KINDS.join(", ") + ", got " + describe(c.kind));
    else ctx.kinds[c.kind] = true;
    ctx.n++;
    requireString(c, "prompt", p, 1, 300, error);
    optionalString(c, "hint", p, 300, error);
    requireString(c, "explain", p, 1, 800, error);
    if (c.kind === "choice") checkChoice(c, p, error, warn);
    else if (c.kind === "spot") checkSpot(c, p, sn, ctx.snippets, error);
    else if (c.kind === "predict") checkPredict(c, p, error);
    else if (c.kind === "fill") checkFill(c, p, error, warn);
    else if (c.kind === "order") checkOrder(c, p, error);
    return true;
  }

  function checkChoice(c, p, error, warn) {
    if (!requireArray(c, "options", p, 2, 6, error)) return;
    var correct = 0, seen = {};
    c.options.forEach(function (o, i) {
      var op = p + ".options[" + i + "]";
      if (!isObject(o)) { error(op, "must be an object, got " + describe(o)); return; }
      if (requireString(o, "text", op, 1, 200, error)) {
        if (seen[o.text]) warn(op + ".text", "duplicates another option's text");
        seen[o.text] = true;
      }
      if (o.correct !== undefined && typeof o.correct !== "boolean") error(op + ".correct", "must be a boolean, got " + describe(o.correct));
      if (o.correct === true) correct++;
      optionalString(o, "why", op, 400, error);
      if (o.correct !== true && o.why === undefined) warn(op + ".why", "a wrong option without why; say why someone picks it and what it misses");
    });
    if (correct !== 1) error(p + ".options", "exactly one option must have correct: true, got " + correct);
  }

  function checkSpot(c, p, stepSn, snippets, error) {
    var sn = stepSn;
    if (c.snippet !== undefined) {
      if (typeof c.snippet !== "string" || !snippets[c.snippet]) { error(p + ".snippet", "snippet id " + describe(c.snippet) + " is not defined in snippets"); sn = null; }
      else sn = snippets[c.snippet];
    } else if (sn === undefined) error(p + ".snippet", "is required here because there is more than one snippet");
    if (c.select !== undefined && c.select !== "one" && c.select !== "all") error(p + ".select", "must be \"one\" or \"all\", got " + describe(c.select));
    var range = null;
    if (sn) range = c.lines === undefined ? [sn.start, sn.start + sn.lines.length - 1] : checkRange(c.lines, p + ".lines", sn, error);
    else if (c.lines !== undefined) checkRange(c.lines, p + ".lines", null, error);
    if (requireArray(c, "answer", p, 1, 8, error)) {
      c.answer.forEach(function (n, i) {
        var ap = p + ".answer[" + i + "]";
        if (!isInt(n)) error(ap, "must be an integer line number, got " + describe(n));
        else if (range && (n < range[0] || n > range[1])) error(ap, "line " + n + " is outside the lines shown, " + range[0] + "–" + range[1]);
      });
    }
    if (c.miss !== undefined && requireArray(c, "miss", p, 0, 12, error)) {
      c.miss.forEach(function (m, i) {
        var mp = p + ".miss[" + i + "]";
        if (!isObject(m)) { error(mp, "must be an object, got " + describe(m)); return; }
        if (!isInt(m.line)) error(mp + ".line", "must be an integer line number, got " + describe(m.line));
        else if (range && (m.line < range[0] || m.line > range[1])) error(mp + ".line", "line " + m.line + " is outside the lines shown, " + range[0] + "–" + range[1]);
        else if (Array.isArray(c.answer) && c.answer.indexOf(m.line) !== -1) error(mp + ".line", "line " + m.line + " is a correct answer; miss is for wrong lines");
        requireString(m, "text", mp, 1, 300, error);
      });
    }
  }

  function checkPredict(c, p, error) {
    requireString(c, "answer", p, 1, 80, error);
    optionalStringArray(c, "accept", p, 0, 8, 80, error);
    if (c.caseSensitive !== undefined && typeof c.caseSensitive !== "boolean") error(p + ".caseSensitive", "must be a boolean, got " + describe(c.caseSensitive));
  }

  function checkFill(c, p, error, warn) {
    var codeOk = requireString(c, "code", p, 1, 1200, error);
    if (codeOk) {
      var lines = splitLines(c.code);
      if (lines.length > 8) error(p + ".code", "must have at most 8 lines, got " + lines.length);
      lines.forEach(function (l, i) { if (l.length > MAX_LINE) error(p + ".code", "line " + (i + 1) + " is " + l.length + " characters; at most " + MAX_LINE + " allowed"); });
    }
    if (!requireArray(c, "blanks", p, 1, 4, error)) return;
    var pos = 0;
    c.blanks.forEach(function (b, i) {
      var bp = p + ".blanks[" + i + "]";
      if (!isObject(b)) { error(bp, "must be an object, got " + describe(b)); return; }
      if (requireString(b, "text", bp, 1, 60, error) && codeOk) {
        var at = c.code.indexOf(b.text, pos);
        if (at === -1) { error(bp + ".text", JSON.stringify(b.text) + " does not occur in code after the previous blank"); }
        else {
          if (c.code.slice(at, at + b.text.length).indexOf("\n") !== -1) error(bp + ".text", "must not span lines");
          pos = at + b.text.length;
        }
      }
      if (b.options !== undefined && requireArray(b, "options", bp, 2, 6, error)) {
        var has = false, seen = {};
        b.options.forEach(function (o, j) {
          if (stringItem(o, bp + ".options[" + j + "]", 60, error)) {
            if (o === b.text) has = true;
            if (seen[o]) error(bp + ".options[" + j + "]", "duplicates another option " + JSON.stringify(o));
            seen[o] = true;
          }
        });
        if (typeof b.text === "string" && !has) error(bp + ".options", "must include the blank's text " + JSON.stringify(b.text));
      }
      optionalStringArray(b, "accept", bp, 0, 6, 60, error);
      if (b.options === undefined && typeof b.text === "string" && b.text.length > 24) warn(bp + ".text", "a typed blank of " + b.text.length + " characters is slow on a phone; give options");
    });
  }

  function checkOrder(c, p, error) {
    var seen = {};
    if (requireArray(c, "lines", p, 3, 7, error)) {
      c.lines.forEach(function (l, i) {
        if (stringItem(l, p + ".lines[" + i + "]", MAX_LINE, error)) {
          if (seen[l]) warn(p + ".lines[" + i + "]", "duplicates another line; either order of the two is accepted");
          seen[l] = true;
        }
      });
    }
    var pairs = {};
    if (c.distractors !== undefined && requireArray(c, "distractors", p, 0, 2, error)) {
      c.distractors.forEach(function (d, i) {
        var dp = p + ".distractors[" + i + "]";
        if (!isObject(d)) { error(dp, "must be an object, got " + describe(d)); return; }
        if (requireString(d, "text", dp, 1, MAX_LINE, error) && seen[d.text]) error(dp + ".text", "is identical to a correct line");
        requireString(d, "why", dp, 1, 300, error);
        if (!isInt(d.pairedWith) || !Array.isArray(c.lines) || d.pairedWith < 0 || d.pairedWith >= c.lines.length) {
          error(dp + ".pairedWith", "must be an index into lines (0–" + ((Array.isArray(c.lines) ? c.lines.length : 1) - 1) + "), got " + describe(d.pairedWith));
        } else if (pairs[d.pairedWith]) {
          error(dp + ".pairedWith", "line " + d.pairedWith + " already has a distractor paired with it");
        } else pairs[d.pairedWith] = true;
      });
    }
  }

  // ---- view-specific helpers ----------------------------------------------
  function splitLines(code) { return code.replace(/\r\n?/g, "\n").replace(/\n$/, "").split("\n"); }
  function columns(line) {
    var n = 0;
    for (var i = 0; i < line.length; i++) n = line[i] === "\t" ? n + TAB - (n % TAB) : n + 1;
    return n;
  }
  function isObject(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
  function isInt(v) { return typeof v === "number" && isFinite(v) && Math.floor(v) === v; }
  function requireId(obj, key, parent, error) {
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (!KEBAB.test(v) || v.length > 40) { error(path, "must be a lowercase kebab-case id of at most 40 characters, got " + JSON.stringify(v)); return false; }
    return true;
  }
  function optionalString(obj, key, parent, max, error) {
    if (obj[key] === undefined) return true;
    return requireString(obj, key, parent, 1, max, error);
  }
  function stringItem(v, path, max, error) {
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (v.trim().length < 1) { error(path, "must be a non-empty string"); return false; }
    if (v.length > max) { error(path, "must be at most " + max + " characters, got " + v.length); return false; }
    return true;
  }
  function optionalStringArray(obj, key, parent, min, maxItems, maxLen, error) {
    if (obj[key] === undefined) return true;
    if (!requireArray(obj, key, parent, min, maxItems, error)) return false;
    var ok = true;
    obj[key].forEach(function (s, i) { if (!stringItem(s, join(parent, key) + "[" + i + "]", maxLen, error)) ok = false; });
    return ok;
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
