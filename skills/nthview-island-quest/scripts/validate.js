/* NthView — island-quest validator — schemaVersion 1
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
  var THEMES = ["grove", "tower", "arena", "workshop", "canyon", "hall", "clock", "plain"];
  var ACTIVITY_TYPES = ["collect", "pads", "story", "tune", "race"];
  var TONES = ["ok", "note", "no"];
  var ROW_STYLES = ["normal", "grey", "dashed"];
  var KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var CONTROL_ID = /^[a-z][a-z0-9]*$/;
  var HEX = /^#[0-9a-fA-F]{6}$/;

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
    requireString(data, "title", "$", 1, 60, error);
    optionalString(data, "subtitle", "$", 160, error);
    if (requireObject(data, "companion", "$", error)) {
      requireString(data.companion, "name", "companion", 1, 20, error);
    }
    optionalInt(data, "coins", "$", 1, 99, error);

    if (requireObject(data, "intro", "$", error)) {
      requireStringArray(data.intro, "paragraphs", "intro", 1, 4, 400, error);
      optionalStringArray(data.intro, "steps", "intro", 0, 5, 300, error);
      optionalString(data.intro, "note", "intro", 300, error);
    }

    if (requireArray(data, "islands", "$", 3, 9, error)) {
      var ids = [];
      data.islands.forEach(function (isl, i) { checkIsland(isl, "islands[" + i + "]", ids, error, warn); });
      if (data.islands.length < 5) warn("islands", "only " + data.islands.length + " islands; 5–7 make a fuller quest");
      if (data.islands.length > 7) warn("islands", data.islands.length + " islands; the ring gets crowded above 7");
    }

    if (requireObject(data, "finale", "$", error)) {
      requireString(data.finale, "name", "finale", 1, 40, error);
      requireString(data.finale, "lead", "finale", 1, 400, error);
      if (requireArray(data.finale, "questions", "finale", 1, 6, error)) {
        data.finale.questions.forEach(function (q, i) { checkQuiz(q, "finale.questions[" + i + "]", error, warn); });
      }
    }

    if (requireObject(data, "report", "$", error)) {
      var r = data.report;
      requireString(r, "heading", "report", 1, 60, error);
      if (r.tiers !== undefined && isObject(r.tiers, "report.tiers", error)) {
        ["perfect", "great", "pass"].forEach(function (k) { optionalString(r.tiers, k, "report.tiers", 200, error); });
      }
      requireStringArray(r, "lessons", "report", 1, 12, 200, error);
      optionalString(r, "glossaryIntro", "report", 200, error);
      if (r.glossaryColumns !== undefined) {
        if (!Array.isArray(r.glossaryColumns) || r.glossaryColumns.length !== 2) {
          error("report.glossaryColumns", "must be an array of exactly 2 strings, got " + describe(r.glossaryColumns));
        } else {
          r.glossaryColumns.forEach(function (c, i) { checkStr(c, "report.glossaryColumns[" + i + "]", 1, 30, error); });
        }
      }
      if (r.glossary !== undefined && optionalArray(r, "glossary", "report", 0, 12, error)) {
        r.glossary.forEach(function (g, i) {
          var p = "report.glossary[" + i + "]";
          if (isObject(g, p, error)) { requireString(g, "term", p, 1, 60, error); requireString(g, "meaning", p, 1, 120, error); }
        });
      }
      if (r.source !== undefined && isObject(r.source, "report.source", error)) {
        requireString(r.source, "label", "report.source", 1, 200, error);
        if (optionalString(r.source, "url", "report.source", 500, error) && r.source.url !== undefined &&
            !/^https?:\/\/\S+$/.test(r.source.url)) {
          error("report.source.url", "must start with http:// or https://, got " + describe(r.source.url));
        }
        optionalString(r.source, "note", "report.source", 300, error);
      }
    }
  }

  function checkIsland(isl, path, ids, error, warn) {
    if (!isObject(isl, path, error)) return;
    if (requireString(isl, "id", path, 1, 30, error)) {
      if (!KEBAB.test(isl.id)) error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(isl.id));
      else if (ids.indexOf(isl.id) !== -1) error(path + ".id", "duplicate island id " + describe(isl.id) + "; ids must be unique");
      else ids.push(isl.id);
    }
    requireString(isl, "name", path, 1, 40, error);
    requireEnum(isl, "theme", path, THEMES, error);
    if (isl.color !== undefined && optionalString(isl, "color", path, 7, error) && !HEX.test(isl.color)) {
      error(path + ".color", "must be a #rrggbb hex colour, got " + describe(isl.color));
    }
    requireString(isl, "lead", path, 1, 600, error);
    optionalStringArray(isl, "body", path, 0, 3, 600, error);

    var isPads = false;
    if (isl.activity !== undefined) {
      if (isObject(isl.activity, path + ".activity", error)) {
        checkActivity(isl.activity, path + ".activity", error, warn);
        isPads = isl.activity.type === "pads";
      }
    } else {
      warn(path, "island has no activity; it will be a read-only lesson");
    }
    if (isl.findings !== undefined && isObject(isl.findings, path + ".findings", error)) {
      checkFindings(isl.findings, path + ".findings", error, warn);
    }
    if (isl.aside !== undefined && isObject(isl.aside, path + ".aside", error)) {
      requireString(isl.aside, "title", path + ".aside", 1, 60, error);
      requireString(isl.aside, "text", path + ".aside", 1, 600, error);
    }
    if (isPads) {
      if (isl.quiz !== undefined) error(path + ".quiz", "must be omitted when activity.type is \"pads\" (the pads are the question)");
    } else if (requireObject(isl, "quiz", path, error)) {
      checkQuiz(isl.quiz, path + ".quiz", error, warn);
    }
    requireString(isl, "remember", path, 1, 300, error);
  }

  function checkFindings(f, path, error, warn) {
    optionalString(f, "caption", path, 200, error);
    if (requireArray(f, "rows", path, 1, 8, error)) {
      f.rows.forEach(function (row, i) {
        var p = path + ".rows[" + i + "]";
        if (!isObject(row, p, error)) return;
        requireString(row, "label", p, 1, 80, error);
        requireNumber(row, "value", p, 0, 100, error);
        requireString(row, "show", p, 1, 12, error);
        if (row.style !== undefined) requireEnum(row, "style", p, ROW_STYLES, error);
      });
    }
    optionalString(f, "text", path, 600, error);
    optionalBool(f, "after", path, error);
    if (f.text === undefined) warn(path, "findings have no explanatory text under the bars");
  }

  function checkQuiz(q, path, error, warn) {
    if (!isObject(q, path, error)) return;
    requireString(q, "question", path, 1, 300, error);
    if (requireArray(q, "options", path, 2, 4, error)) {
      var correct = 0;
      q.options.forEach(function (o, i) {
        var p = path + ".options[" + i + "]";
        if (!isObject(o, p, error)) return;
        requireString(o, "text", p, 1, 200, error);
        optionalBool(o, "correct", p, error);
        optionalString(o, "why", p, 300, error);
        if (o.correct === true) correct++;
        else if (o.why === undefined) warn(p, "wrong option has no \"why\" feedback");
      });
      if (correct !== 1) error(path + ".options", "exactly one option must have \"correct\": true, found " + correct);
    }
    optionalString(q, "okText", path, 200, error);
  }

  function checkActivity(a, path, error, warn) {
    if (!requireEnum(a, "type", path, ACTIVITY_TYPES, error)) return;
    optionalString(a, "title", path, 60, error);
    switch (a.type) {
      case "collect":
        requireString(a, "prompt", path, 1, 400, error);
        if (requireStringArray(a, "items", path, 3, 9, 3, error)) {
          var counts = {}, best = 0;
          a.items.forEach(function (it) { counts[it] = (counts[it] || 0) + 1; if (counts[it] > best) best = counts[it]; });
          if (best * 2 <= a.items.length) warn(path + ".items", "no answer is a clear majority; the vote will look like a tie");
        }
        optionalString(a, "resultTitle", path, 60, error);
        requireString(a, "resultText", path, 1, 200, error);
        optionalString(a, "resultNote", path, 300, error);
        break;
      case "pads":
        requireString(a, "prompt", path, 1, 400, error);
        var padIds = [];
        if (requireArray(a, "options", path, 2, 4, error)) {
          a.options.forEach(function (o, i) {
            var p = path + ".options[" + i + "]";
            if (!isObject(o, p, error)) return;
            if (requireString(o, "id", p, 1, 30, error)) {
              if (!KEBAB.test(o.id)) error(p + ".id", "must be kebab-case, got " + describe(o.id));
              else if (padIds.indexOf(o.id) !== -1) error(p + ".id", "duplicate pad id " + describe(o.id));
              else padIds.push(o.id);
            }
            requireString(o, "label", p, 1, 12, error);
            optionalString(o, "hint", p, 300, error);
            if (o.bars !== undefined) {
              if (!Array.isArray(o.bars) || o.bars.length !== 2) error(p + ".bars", "must be an array of exactly 2 numbers, got " + describe(o.bars));
              else o.bars.forEach(function (v, k) { if (typeof v !== "number" || v < 0 || v > 100) error(p + ".bars[" + k + "]", "must be a number from 0 to 100, got " + describe(v)); });
            }
            if (o.size !== undefined && (typeof o.size !== "number" || o.size < 0.5 || o.size > 4)) {
              error(p + ".size", "must be a number from 0.5 to 4, got " + describe(o.size));
            }
          });
        }
        if (requireString(a, "answer", path, 1, 30, error) && padIds.length && padIds.indexOf(a.answer) === -1) {
          error(path + ".answer", describe(a.answer) + " is not one of the pad ids (" + padIds.join(", ") + ")");
        }
        break;
      case "story":
        requireString(a, "buttonLabel", path, 1, 40, error);
        optionalString(a, "resetLabel", path, 40, error);
        requireStringArray(a, "frames", path, 2, 8, 300, error);
        optionalString(a, "caption", path, 300, error);
        break;
      case "tune":
        checkTune(a, path, error, warn);
        break;
      case "race":
        requireString(a, "buttonLabel", path, 1, 40, error);
        if (requireArray(a, "bars", path, 2, 4, error)) {
          a.bars.forEach(function (b, i) {
            var p = path + ".bars[" + i + "]";
            if (!isObject(b, p, error)) return;
            requireString(b, "label", p, 1, 80, error);
            requireNumber(b, "value", p, 0, 100, error);
            requireString(b, "show", p, 1, 12, error);
            optionalString(b, "tag", p, 12, error);
          });
        }
        optionalString(a, "caption", path, 300, error);
        break;
    }
  }

  function checkTune(a, path, error, warn) {
    var ids = [];
    if (requireArray(a, "controls", path, 1, 3, error)) {
      a.controls.forEach(function (c, i) {
        var p = path + ".controls[" + i + "]";
        if (!isObject(c, p, error)) return;
        if (requireString(c, "id", p, 1, 20, error)) {
          if (!CONTROL_ID.test(c.id)) error(p + ".id", "must match ^[a-z][a-z0-9]*$, got " + describe(c.id));
          else if (ids.indexOf(c.id) !== -1) error(p + ".id", "duplicate control id " + describe(c.id));
          else ids.push(c.id);
        }
        requireString(c, "label", p, 1, 60, error);
        var okMin = requireInt(c, "min", p, -1000, 1000, error);
        var okMax = requireInt(c, "max", p, -1000, 1000, error);
        var okVal = requireInt(c, "value", p, -1000, 1000, error);
        if (okMin && okMax && c.min >= c.max) error(p + ".max", "must be greater than min (" + c.min + "), got " + c.max);
        if (okMin && okMax && okVal && (c.value < c.min || c.value > c.max)) error(p + ".value", "must be between min and max (" + c.min + "–" + c.max + "), got " + c.value);
      });
    }
    function expr(obj, key, p, required) {
      if (obj[key] === undefined) { if (required) error(p + "." + key, "is required"); return; }
      if (typeof obj[key] !== "string") { error(p + "." + key, "must be an expression string, got " + describe(obj[key])); return; }
      var c = compileExpr(obj[key]);
      if (c.error) { error(p + "." + key, "expression " + describe(obj[key]) + " is invalid: " + c.error); return; }
      c.ids.forEach(function (id) { if (ids.indexOf(id) === -1) error(p + "." + key, "expression uses unknown control id \"" + id + "\" (controls: " + ids.join(", ") + ")"); });
    }
    function templateExprs(text, p) {
      var re = /\{([^}]*)\}/g, m;
      while ((m = re.exec(text))) {
        if (/^(top|count|total)$/.test(m[1])) continue;
        var c = compileExpr(m[1]);
        if (c.error) { error(p, "placeholder {" + m[1] + "} is invalid: " + c.error); continue; }
        c.ids.forEach(function (id) { if (ids.indexOf(id) === -1) error(p, "placeholder {" + m[1] + "} uses unknown control id \"" + id + "\""); });
      }
    }
    if (requireArray(a, "readout", path, 1, 4, error)) {
      a.readout.forEach(function (r, i) {
        var p = path + ".readout[" + i + "]";
        if (!isObject(r, p, error)) return;
        expr(r, "when", p, false);
        if (requireString(r, "text", p, 1, 300, error)) templateExprs(r.text, p + ".text");
      });
    }
    if (a.visual !== undefined && isObject(a.visual, path + ".visual", error)) {
      requireEnum(a.visual, "kind", path + ".visual", ["circle", "grid"], error);
      expr(a.visual, "count", path + ".visual", true);
      expr(a.visual, "extra", path + ".visual", true);
      optionalBool(a.visual, "leader", path + ".visual", error);
      if (a.visual.leader !== undefined && a.visual.kind !== "grid") error(path + ".visual.leader", "is only allowed when kind is \"grid\"");
    }
    if (a.tally !== undefined && isObject(a.tally, path + ".tally", error)) {
      expr(a.tally, "count", path + ".tally", true);
      requireString(a.tally, "icon", path + ".tally", 1, 2, error);
      optionalInt(a.tally, "max", path + ".tally", 1, 60, error);
    }
    if (a.outcomes !== undefined && isObject(a.outcomes, path + ".outcomes", error)) {
      var o = a.outcomes;
      requireString(o, "buttonLabel", path + ".outcomes", 1, 40, error);
      if (requireArray(o, "cases", path + ".outcomes", 1, 8, error)) {
        o.cases.forEach(function (c, i) {
          var p = path + ".outcomes.cases[" + i + "]";
          if (!isObject(c, p, error)) return;
          expr(c, "when", p, true);
          requireString(c, "text", p, 1, 300, error);
          requireEnum(c, "tone", p, TONES, error);
        });
      }
      if (requireObject(o, "fallback", path + ".outcomes", error)) {
        requireString(o.fallback, "text", path + ".outcomes.fallback", 1, 300, error);
        requireEnum(o.fallback, "tone", path + ".outcomes.fallback", TONES, error);
      }
    }
    optionalString(a, "caption", path, 300, error);
  }

  // ---- expression compiler (identical copy lives in assets/view.js) -------
  function compileExpr(src) {
    if (typeof src !== "string" || !src.trim()) return { error: "empty expression" };
    var re = /\s*(?:(\d+(?:\.\d+)?)|([a-z][a-z0-9]*)|(==|!=|<=|>=|&&|\|\||[-+*\/%()<>!]))/y;
    var toks = [], pos = 0, m;
    while (pos < src.length) {
      re.lastIndex = pos; m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(pos))) break; return { error: "unexpected character \"" + src[pos] + "\"" }; }
      if (m[1] !== undefined) toks.push({ t: "num", v: parseFloat(m[1]) });
      else if (m[2] !== undefined) toks.push({ t: "id", v: m[2] });
      else toks.push({ t: "op", v: m[3] });
      pos = re.lastIndex;
    }
    var i = 0, ids = [];
    function eat(v) { var t = toks[i]; if (t && t.t === "op" && t.v === v) { i++; return true; } return false; }
    function primary() {
      var t = toks[i];
      if (!t) throw new Error("unexpected end of expression");
      if (t.t === "num") { i++; return function () { return t.v; }; }
      if (t.t === "id") { i++; if (ids.indexOf(t.v) === -1) ids.push(t.v); return function (env) { return env[t.v]; }; }
      if (eat("(")) { var e = orExpr(); if (!eat(")")) throw new Error("missing )"); return e; }
      throw new Error("unexpected \"" + t.v + "\"");
    }
    function unary() {
      if (eat("!")) { var a = unary(); return function (env) { return a(env) ? 0 : 1; }; }
      if (eat("-")) { var b = unary(); return function (env) { return -b(env); }; }
      return primary();
    }
    function bin(next, ops) {
      return function () {
        var l = next();
        for (;;) {
          var t = toks[i];
          if (!t || t.t !== "op" || !Object.prototype.hasOwnProperty.call(ops, t.v)) return l;
          i++;
          var r = next();
          l = (function (f, a, b) { return function (env) { return f(a(env), b(env)); }; })(ops[t.v], l, r);
        }
      };
    }
    var mul = bin(unary, { "*": function (a, b) { return a * b; }, "/": function (a, b) { return b === 0 ? 0 : a / b; }, "%": function (a, b) { return b === 0 ? 0 : a % b; } });
    var add = bin(mul, { "+": function (a, b) { return a + b; }, "-": function (a, b) { return a - b; } });
    var cmp = bin(add, {
      "==": function (a, b) { return a === b ? 1 : 0; }, "!=": function (a, b) { return a !== b ? 1 : 0; },
      "<": function (a, b) { return a < b ? 1 : 0; }, "<=": function (a, b) { return a <= b ? 1 : 0; },
      ">": function (a, b) { return a > b ? 1 : 0; }, ">=": function (a, b) { return a >= b ? 1 : 0; }
    });
    var and = bin(cmp, { "&&": function (a, b) { return a && b ? 1 : 0; } });
    var orExpr = bin(and, { "||": function (a, b) { return a || b ? 1 : 0; } });
    try {
      var fn = orExpr();
      if (i < toks.length) throw new Error("unexpected \"" + toks[i].v + "\"");
      return { fn: fn, ids: ids };
    } catch (e) { return { error: e.message }; }
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
  function isObject(v, path, error) {
    if (v === null || typeof v !== "object" || Array.isArray(v)) { error(path, "must be an object, got " + describe(v)); return false; }
    return true;
  }
  function checkStr(v, path, min, max, error) {
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (v.trim().length < min) { error(path, "must be a non-empty string"); return false; }
    if (v.length > max) { error(path, "must be at most " + max + " characters, got " + v.length); return false; }
    return true;
  }
  function requireString(obj, key, parent, min, max, error) {
    return checkStr(obj[key], join(parent, key), min, max, error);
  }
  function optionalString(obj, key, parent, max, error) {
    if (obj[key] === undefined) return true;
    return checkStr(obj[key], join(parent, key), 1, max, error);
  }
  function requireObject(obj, key, parent, error) {
    return isObject(obj[key], join(parent, key), error);
  }
  function requireArray(obj, key, parent, min, max, error) {
    var path = join(parent, key), v = obj[key];
    if (!Array.isArray(v)) { error(path, "must be an array, got " + describe(v)); return false; }
    if (v.length < min) { error(path, "must have at least " + min + " item(s), got " + v.length); return false; }
    if (max !== null && v.length > max) { error(path, "must have at most " + max + " item(s), got " + v.length); return false; }
    return true;
  }
  function optionalArray(obj, key, parent, min, max, error) {
    if (obj[key] === undefined) return false;
    return requireArray(obj, key, parent, min, max, error);
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
  function requireNumber(obj, key, parent, min, max, error) {
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "number" || isNaN(v)) { error(path, "must be a number, got " + describe(v)); return false; }
    if (v < min || v > max) { error(path, "must be between " + min + " and " + max + ", got " + v); return false; }
    return true;
  }
  function requireInt(obj, key, parent, min, max, error) {
    if (!requireNumber(obj, key, parent, min, max, error)) return false;
    if (obj[key] % 1 !== 0) { error(join(parent, key), "must be a whole number, got " + obj[key]); return false; }
    return true;
  }
  function optionalInt(obj, key, parent, min, max, error) {
    if (obj[key] === undefined) return true;
    return requireInt(obj, key, parent, min, max, error);
  }
  function optionalBool(obj, key, parent, error) {
    if (obj[key] === undefined) return true;
    if (typeof obj[key] !== "boolean") { error(join(parent, key), "must be true or false, got " + describe(obj[key])); return false; }
    return true;
  }
  function requireEnum(obj, key, parent, values, error) {
    var path = join(parent, key), v = obj[key];
    if (values.indexOf(v) === -1) { error(path, "must be one of " + values.join(", ") + "; got " + describe(v)); return false; }
    return true;
  }

  return { validate: validate, SUPPORTED_VERSIONS: SUPPORTED_VERSIONS, compileExpr: compileExpr };
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
