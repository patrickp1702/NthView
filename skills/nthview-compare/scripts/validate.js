/* NthView — compare validator — schemaVersion 1
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
  var COLOURS = ["blue", "teal", "amber", "rose", "violet", "green"];
  var MARKS = ["yes", "partly", "no", "low", "medium", "high", "na"];
  var FEATURE_MARKS = ["yes", "partly", "no"];
  var DEGREE_MARKS = ["low", "medium", "high"];
  var KINDS = ["sort", "cell", "pick", "choice", "explain"];

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
    optionalString(data, "focus", "$", 240, error);
    optionalStringArray(data, "intro", "$", 0, 4, 600, error);

    /* options */
    var optIds = [], optNames = {};
    if (requireArray(data, "options", "$", 2, 4, error)) {
      var colours = {};
      data.options.forEach(function (o, i) {
        var path = "options[" + i + "]";
        if (!isObject(o, path, error)) return;
        if (requireId(o, "id", path, error)) {
          if (optIds.indexOf(o.id) !== -1) error(path + ".id", "duplicate option id \"" + o.id + "\"; option ids must be unique");
          else { optIds.push(o.id); optNames[o.id] = o.name; }
        }
        requireString(o, "name", path, 1, 60, error);
        optionalString(o, "short", path, 16, error, 1);
        optionalString(o, "aka", path, 120, error);
        requireString(o, "summary", path, 1, 300, error);
        if (o.colour !== undefined) {
          if (COLOURS.indexOf(o.colour) === -1) error(path + ".colour", "must be one of " + COLOURS.join(", ") + "; got " + describe(o.colour));
          else if (colours[o.colour] !== undefined) error(path + ".colour", "\"" + o.colour + "\" is already used by options[" + colours[o.colour] + "]; give each option its own colour");
          else colours[o.colour] = i;
        }
      });
    }

    /* dimensions */
    var dimIds = [], alikeCount = 0;
    if (requireArray(data, "dimensions", "$", 3, 10, error)) {
      data.dimensions.forEach(function (d, i) {
        var path = "dimensions[" + i + "]";
        if (!isObject(d, path, error)) return;
        if (requireId(d, "id", path, error)) {
          if (dimIds.indexOf(d.id) !== -1) error(path + ".id", "duplicate dimension id \"" + d.id + "\"; dimension ids must be unique");
          else dimIds.push(d.id);
        }
        requireString(d, "name", path, 1, 60, error);
        optionalString(d, "why", path, 300, error);
        optionalString(d, "takeaway", path, 300, error);
        optionalBool(d, "alike", path, error);
        if (d.alike === true) alikeCount++;
      });
      if (alikeCount && alikeCount === data.dimensions.length) warn("dimensions", "every dimension is marked alike; a comparison needs at least one difference");
    }

    /* cells */
    var grid = {}, anyMark = false, dimMarks = {}, dimTexts = {};
    if (requireArray(data, "cells", "$", 1, null, error)) {
      data.cells.forEach(function (c, i) {
        var path = "cells[" + i + "]";
        if (!isObject(c, path, error)) return;
        var okO = requireString(c, "option", path, 1, 40, error);
        var okD = requireString(c, "dimension", path, 1, 40, error);
        if (okO && optIds.length && optIds.indexOf(c.option) === -1) { error(path + ".option", "option id \"" + c.option + "\" is not defined in options"); okO = false; }
        if (okD && dimIds.length && dimIds.indexOf(c.dimension) === -1) { error(path + ".dimension", "dimension id \"" + c.dimension + "\" is not defined in dimensions"); okD = false; }
        var okT = requireString(c, "text", path, 1, 200, error);
        if (c.mark !== undefined && MARKS.indexOf(c.mark) === -1) error(path + ".mark", "must be one of " + MARKS.join(", ") + "; got " + describe(c.mark));
        else if (c.mark !== undefined) anyMark = true;
        optionalString(c, "detail", path, 800, error);
        if (okO && okD) {
          var k = c.option + "|" + c.dimension;
          if (grid[k] !== undefined) error(path, "duplicate cell for option \"" + c.option + "\" and dimension \"" + c.dimension + "\" (already at cells[" + grid[k] + "])");
          else grid[k] = i;
          (dimMarks[c.dimension] = dimMarks[c.dimension] || []).push(c.mark);
          if (okT) (dimTexts[c.dimension] = dimTexts[c.dimension] || []).push(c.text.trim().toLowerCase());
        }
      });
      if (optIds.length && dimIds.length) {
        dimIds.forEach(function (d) {
          optIds.forEach(function (o) {
            if (grid[o + "|" + d] === undefined) error("cells", "missing the cell for option \"" + o + "\" and dimension \"" + d + "\"; every option needs one cell on every dimension");
          });
          var ms = dimMarks[d] || [];
          var hasF = ms.some(function (m) { return FEATURE_MARKS.indexOf(m) !== -1; });
          var hasD = ms.some(function (m) { return DEGREE_MARKS.indexOf(m) !== -1; });
          if (hasF && hasD) warn("cells", "dimension \"" + d + "\" mixes feature marks (yes/partly/no) with degree marks (low/medium/high); pick one scale per dimension");
        });
      }
      if (!anyMark) warn("cells", "no cell has a mark; marks make the matrix readable at a glance");
    }

    /* whenToChoose */
    var chosen = {};
    if (requireArray(data, "whenToChoose", "$", 2, 12, error)) {
      data.whenToChoose.forEach(function (w, i) {
        var path = "whenToChoose[" + i + "]";
        if (!isObject(w, path, error)) return;
        requireString(w, "situation", path, 1, 200, error);
        if (requireString(w, "option", path, 1, 40, error)) {
          if (optIds.length && optIds.indexOf(w.option) === -1) error(path + ".option", "option id \"" + w.option + "\" is not defined in options");
          else chosen[w.option] = true;
        }
        optionalString(w, "why", path, 400, error);
      });
    }

    optionalStringArray(data, "similarities", "$", 0, 8, 240, error);
    optionalStringArray(data, "differences", "$", 0, 8, 240, error);
    optionalString(data, "bigIdea", "$", 400, error);
    if (!(Array.isArray(data.similarities) && data.similarities.length) && !(Array.isArray(data.differences) && data.differences.length)) {
      warn("$", "no similarities and no differences; the recap is built from them");
    }

    if (data.misconceptions !== undefined && requireArray(data, "misconceptions", "$", 0, 8, error)) {
      data.misconceptions.forEach(function (m, i) {
        var path = "misconceptions[" + i + "]";
        if (!isObject(m, path, error)) return;
        requireString(m, "claim", path, 1, 200, error);
        requireString(m, "truth", path, 1, 500, error);
      });
    }

    if (data.sources !== undefined && requireArray(data, "sources", "$", 0, 12, error)) {
      data.sources.forEach(function (s, i) {
        var path = "sources[" + i + "]";
        if (!isObject(s, path, error)) return;
        requireString(s, "label", path, 1, 200, error);
        if (s.url !== undefined && optionalString(s, "url", path, 500, error) && !/^https?:\/\//.test(s.url)) {
          error(path + ".url", "must start with https:// or http://, got " + describe(s.url));
        }
      });
    }

    /* questions */
    if (requireArray(data, "questions", "$", 1, 40, error)) {
      var qIds = [], kinds = {}, ctx = { optIds: optIds, dimIds: dimIds, dimTexts: dimTexts, chosen: chosen };
      data.questions.forEach(function (q, i) {
        var path = "questions[" + i + "]";
        if (!isObject(q, path, error)) return;
        if (requireId(q, "id", path, error)) {
          if (qIds.indexOf(q.id) !== -1) error(path + ".id", "duplicate question id \"" + q.id + "\"; question ids must be unique");
          else qIds.push(q.id);
        }
        if (KINDS.indexOf(q.kind) === -1) { error(path + ".kind", "must be one of " + KINDS.join(", ") + "; got " + describe(q.kind)); return; }
        kinds[q.kind] = true;
        CHECKS[q.kind](q, path, ctx, error, warn);
      });
      var nKinds = Object.keys(kinds).length;
      if (data.questions.length < 4) warn("questions", "only " + data.questions.length + " question(s); 8–14 give the learner room to discriminate");
      if (nKinds < 3) warn("questions", "only " + nKinds + " kind(s) of question; mix at least three so the learner meets the contrast from several sides");
      if (!kinds.pick) warn("questions", "no pick question; the learner never practises when to choose which");
    }
    optIds.forEach(function (o) {
      if (!chosen[o]) warn("options", "option \"" + o + "\" is never the right answer of a pick question or a whenToChoose entry");
    });
  }

  var CHECKS = {
    sort: function (q, path, ctx, error, warn) {
      optionalString(q, "prompt", path, 300, error);
      if (!requireArray(q, "statements", path, 2, 8, error)) return;
      var answers = [];
      q.statements.forEach(function (s, j) {
        var sp = path + ".statements[" + j + "]";
        if (!isObject(s, sp, error)) return;
        requireString(s, "text", sp, 1, 200, error);
        requireString(s, "why", sp, 1, 400, error);
        if (!Array.isArray(s.answer)) { error(sp + ".answer", "must be an array of option ids (empty for \"none of them\"), got " + describe(s.answer)); return; }
        var seen = [];
        s.answer.forEach(function (a, k) {
          if (typeof a !== "string" || (ctx.optIds.length && ctx.optIds.indexOf(a) === -1)) error(sp + ".answer[" + k + "]", "option id " + describe(a) + " is not defined in options");
          else if (seen.indexOf(a) !== -1) error(sp + ".answer[" + k + "]", "option id \"" + a + "\" is listed twice");
          else seen.push(a);
        });
        answers.push(seen.slice().sort().join("|"));
      });
      if (answers.length === q.statements.length && answers.every(function (a) { return a === answers[0]; })) {
        warn(path + ".statements", "every statement has the same answer; nothing to discriminate");
      }
    },
    cell: function (q, path, ctx, error) {
      optionalString(q, "prompt", path, 300, error);
      optionalString(q, "why", path, 500, error);
      if (requireString(q, "option", path, 1, 40, error) && ctx.optIds.length && ctx.optIds.indexOf(q.option) === -1) error(path + ".option", "option id \"" + q.option + "\" is not defined in options");
      if (requireString(q, "dimension", path, 1, 40, error)) {
        if (ctx.dimIds.length && ctx.dimIds.indexOf(q.dimension) === -1) error(path + ".dimension", "dimension id \"" + q.dimension + "\" is not defined in dimensions");
        else {
          var t = ctx.dimTexts[q.dimension] || [];
          var dup = t.filter(function (x, k) { return t.indexOf(x) !== k; });
          if (dup.length) error(path + ".dimension", "the cells on dimension \"" + q.dimension + "\" share the text \"" + dup[0] + "\", so the hidden cell has no single right choice; make their texts distinct or ask about another dimension");
        }
      }
    },
    pick: function (q, path, ctx, error) {
      requireString(q, "situation", path, 1, 500, error);
      optionalString(q, "prompt", path, 300, error);
      requireString(q, "why", path, 1, 500, error);
      var okA = requireString(q, "answer", path, 1, 40, error);
      if (okA && ctx.optIds.length && ctx.optIds.indexOf(q.answer) === -1) { error(path + ".answer", "option id \"" + q.answer + "\" is not defined in options"); okA = false; }
      if (okA) ctx.chosen[q.answer] = true;
      if (q.notes !== undefined) {
        if (q.notes === null || typeof q.notes !== "object" || Array.isArray(q.notes)) { error(path + ".notes", "must be an object keyed by option id, got " + describe(q.notes)); return; }
        Object.keys(q.notes).forEach(function (k) {
          var np = path + ".notes." + k;
          if (ctx.optIds.length && ctx.optIds.indexOf(k) === -1) error(np, "option id \"" + k + "\" is not defined in options");
          else if (k === q.answer) error(np, "a note is for an option that falls short; \"" + k + "\" is the answer, explain it in why");
          checkStr(q.notes[k], np, 1, 300, error);
        });
      }
    },
    choice: function (q, path, ctx, error) {
      requireString(q, "prompt", path, 1, 300, error);
      if (!requireArray(q, "choices", path, 2, 6, error)) return;
      var nCorrect = 0;
      q.choices.forEach(function (c, j) {
        var cp = path + ".choices[" + j + "]";
        if (!isObject(c, cp, error)) return;
        requireString(c, "text", cp, 1, 200, error);
        requireString(c, "why", cp, 1, 400, error);
        optionalBool(c, "correct", cp, error);
        if (c.correct === true) nCorrect++;
      });
      if (nCorrect !== 1) error(path + ".choices", "must have exactly one choice with \"correct\": true, got " + nCorrect);
    },
    explain: function (q, path, ctx, error) {
      requireString(q, "prompt", path, 1, 300, error);
      requireString(q, "model", path, 1, 800, error);
      requireStringArray(q, "points", path, 1, 5, 160, error);
    }
  };

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

  // ---- view-specific helpers ---------------------------------------------
  function isObject(v, path, error) {
    if (v === null || typeof v !== "object" || Array.isArray(v)) { error(path, "expected an object, got " + describe(v)); return false; }
    return true;
  }
  function checkStr(v, path, min, max, error) {
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (v.trim().length < min) { error(path, "must be a non-empty string"); return false; }
    if (v.length > max) { error(path, "must be at most " + max + " characters, got " + v.length); return false; }
    return true;
  }
  function optionalString(obj, key, parent, max, error, min) {
    if (obj[key] === undefined) return false;
    return checkStr(obj[key], join(parent, key), min || 0, max, error);
  }
  function requireId(obj, key, parent, error) {
    if (!requireString(obj, key, parent, 1, 40, error)) return false;
    if (!KEBAB.test(obj[key])) { error(join(parent, key), "must be lowercase kebab-case (a-z, 0-9, single hyphens), got " + describe(obj[key])); return false; }
    return true;
  }
  function requireStringArray(obj, key, parent, min, max, maxChars, error) {
    if (!requireArray(obj, key, parent, min, max, error)) return false;
    var ok = true;
    obj[key].forEach(function (s, i) { if (!checkStr(s, join(parent, key) + "[" + i + "]", 1, maxChars, error)) ok = false; });
    return ok;
  }
  function optionalStringArray(obj, key, parent, min, max, maxChars, error) {
    if (obj[key] === undefined) return true;
    return requireStringArray(obj, key, parent, min, max, maxChars, error);
  }
  function optionalBool(obj, key, parent, error) {
    if (obj[key] !== undefined && typeof obj[key] !== "boolean") error(join(parent, key), "must be true or false, got " + describe(obj[key]));
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
