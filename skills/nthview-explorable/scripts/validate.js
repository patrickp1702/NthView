/* NthView — explorable validator — schemaVersion 1
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
  var KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var IDENT = /^[a-z][a-zA-Z0-9]*$/;
  var THEMES = ["lab", "chalk", "nebula", "paper", "sunlit", "mint"];
  var HUES = ["accent", "accent2", "blue", "teal", "green", "lime", "amber", "orange", "red", "pink", "violet", "grey"];
  var FORMATS = ["auto", "int", "dp1", "dp2", "pct", "pct1", "compact", "times"];
  var KINDS = ["bars", "line", "scatter", "agents", "grid", "gauge", "number", "stack", "flow", "timeline", "compare"];
  var CONTROL_KINDS = ["slider", "stepper", "toggle", "choice", "play", "button"];
  var FUNCS = { min: [1, 8], max: [1, 8], abs: [1, 1], sqrt: [1, 1], pow: [2, 2], exp: [1, 1], log: [1, 1], sin: [1, 1], cos: [1, 1], floor: [1, 1], round: [1, 1], clamp: [3, 3], "if": [3, 3] };
  var RESERVED = ["pi", "i", "u", "v", "n", "k", "row", "col", "rows", "cols", "value"];
  var LOCALS = {
    scatter: ["i", "u", "v", "n"],
    grid: ["row", "col", "rows", "cols", "i", "u"],
    timeline: ["k"],
    timelineLabel: ["k", "value"]
  };

  function checkRoot(data, error, warn) {
    requireString(data, "title", "$", 1, 80, error);
    optionalString(data, "subtitle", "$", 200, error);
    if (data.theme !== undefined && THEMES.indexOf(data.theme) === -1) {
      error("theme", "must be one of " + THEMES.join(", ") + "; got " + describe(data.theme) + " (or omit it to derive one from the title)");
    }
    optionalInt(data, "seed", "$", 0, 2147483647, error);

    /* glossary first: every ((term)) in the text is checked against it */
    var terms = [], termUsed = {};
    if (requireArray(data, "glossary", "$", 1, 30, error)) {
      data.glossary.forEach(function (g, i) {
        var p = "glossary[" + i + "]";
        if (!isObject(g, p, error)) return;
        if (requireString(g, "term", p, 1, 40, error)) {
          var key = g.term.trim().toLowerCase();
          if (terms.indexOf(key) !== -1) error(p + ".term", "duplicate glossary term " + describe(g.term) + "; terms must be unique (ignoring case)");
          else terms.push(key);
        }
        requireString(g, "definition", p, 1, 300, error);
      });
    }

    /* model: variables, then formulas in order */
    var M = { vars: [], varIds: [], formulas: [], ids: [], ok: true };
    if (requireObject(data, "model", "$", error)) checkModel(data.model, M, error, warn);
    else M.ok = false;

    var T = makeText(terms, termUsed, M, error);

    if (requireObject(data, "intro", "$", error)) {
      optionalString(data.intro, "kicker", "intro", 40, error);
      if (requireStringArray(data.intro, "body", "intro", 1, 4, 600, error)) data.intro.body.forEach(function (s, i) { T.terms(s, "intro.body[" + i + "]"); });
      if (optionalString(data.intro, "question", "intro", 200, error) && data.intro.question) T.terms(data.intro.question, "intro.question");
    }

    if (requireArray(data, "steps", "$", 4, 12, error)) {
      var stepIds = [], kindsUsed = [];
      data.steps.forEach(function (s, i) { checkStep(s, "steps[" + i + "]", stepIds, kindsUsed, M, T, error, warn); });
      if (data.steps.length >= 5 && kindsUsed.length <= 2) warn("steps", "only " + kindsUsed.length + " visualisation kind(s) across " + data.steps.length + " steps; varying the picture keeps the lab alive");
    }

    if (requireObject(data, "wrapUp", "$", error)) {
      var w = data.wrapUp;
      optionalString(w, "heading", "wrapUp", 80, error);
      if (requireStringArray(w, "body", "wrapUp", 1, 4, 600, error)) w.body.forEach(function (s, i) { T.terms(s, "wrapUp.body[" + i + "]"); });
      if (optionalStringArray(w, "takeaways", "wrapUp", 1, 12, 200, error) && w.takeaways) w.takeaways.forEach(function (s, i) { T.terms(s, "wrapUp.takeaways[" + i + "]"); });
      if (optionalStringArray(w, "next", "wrapUp", 1, 6, 200, error) && w.next) w.next.forEach(function (s, i) { T.terms(s, "wrapUp.next[" + i + "]"); });
    }

    if (Array.isArray(data.glossary)) {
      data.glossary.forEach(function (g, i) {
        if (g && typeof g.term === "string" && !termUsed[g.term.trim().toLowerCase()]) warn("glossary[" + i + "].term", "term " + describe(g.term) + " is never marked with ((...)) in the text; marking it lets the learner tap it for the definition");
      });
    }
  }

  /* ---- model ---- */
  function checkModel(m, M, error, warn) {
    var taken = [];
    function checkId(obj, p) {
      if (!requireString(obj, "id", p, 1, 24, error)) return false;
      if (!IDENT.test(obj.id)) { error(p + ".id", "must start with a lowercase letter and contain only letters and digits (camelCase), got " + describe(obj.id)); return false; }
      if (FUNCS.hasOwnProperty(obj.id) || RESERVED.indexOf(obj.id) !== -1) { error(p + ".id", describe(obj.id) + " is reserved (functions " + Object.keys(FUNCS).join(", ") + " and names " + RESERVED.join(", ") + " cannot be ids)"); return false; }
      if (taken.indexOf(obj.id) !== -1) { error(p + ".id", "duplicate id " + describe(obj.id) + "; variable and formula ids share one namespace"); return false; }
      taken.push(obj.id);
      return true;
    }
    if (requireArray(m, "variables", "model", 1, 24, error)) {
      m.variables.forEach(function (v, i) {
        var p = "model.variables[" + i + "]";
        if (!isObject(v, p, error)) { M.ok = false; return; }
        var idOk = checkId(v, p);
        requireString(v, "label", p, 1, 40, error);
        var okMin = requireNumber(v, "min", p, -1e12, 1e12, error);
        var okMax = requireNumber(v, "max", p, -1e12, 1e12, error);
        var okDef = requireNumber(v, "default", p, -1e12, 1e12, error);
        if (okMin && okMax && v.min >= v.max) { error(p + ".max", "must be greater than min (" + v.min + "), got " + v.max); okMax = false; }
        if (okMin && okMax && okDef && (v.default < v.min || v.default > v.max)) error(p + ".default", "must be between min and max (" + v.min + "–" + v.max + "), got " + v.default);
        if (v.step !== undefined) {
          if (typeof v.step !== "number" || !isFinite(v.step) || v.step <= 0) error(p + ".step", "must be a positive number, got " + describe(v.step));
          else if (okMin && okMax && v.step > v.max - v.min) error(p + ".step", "must be at most max − min (" + (v.max - v.min) + "), got " + v.step);
          else if (okMin && okDef && !onGrid(v.default - v.min, v.step)) warn(p + ".default", "default " + v.default + " is not on the slider grid (min " + v.min + " + multiples of step " + v.step + "); the slider will snap away from it");
        }
        checkFormatFields(v, p, error);
        if (idOk) { M.varIds.push(v.id); M.ids.push(v.id); }
        if (idOk && okMin && okMax && okDef) M.vars.push(v);
        else M.ok = false;
      });
    } else M.ok = false;
    if (optionalArray(m, "formulas", "model", 0, 40, error)) {
      m.formulas.forEach(function (f, i) {
        var p = "model.formulas[" + i + "]";
        if (!isObject(f, p, error)) { M.ok = false; return; }
        var idOk = checkId(f, p);
        optionalString(f, "label", p, 40, error);
        checkFormatFields(f, p, error);
        var c = exprAt(f, "expr", p, true, M.ids, error, function (id) {
          return m.formulas.some(function (g, j) { return j >= i && g && g.id === id; }) ? "uses formula \"" + id + "\" before it is defined (formulas are evaluated in list order; move it earlier)" : null;
        });
        if (idOk) M.ids.push(f.id);
        if (idOk && c) M.formulas.push({ id: f.id, fn: c.fn, path: p + ".expr" });
        else M.ok = false;
      });
    } else if (m.formulas !== undefined) M.ok = false;
    if (M.ok) {
      var bad = {};
      evalEnv(M, {}, bad);
      M.formulas.forEach(function (f) { if (bad.hasOwnProperty(f.id)) warn(f.path, "evaluates to " + bad[f.id] + " at the default values; the view shows 0 instead"); });
    }
  }
  function onGrid(d, step) { var q = d / step; return Math.abs(q - Math.round(q)) < 1e-6; }
  function checkFormatFields(o, p, error) {
    optionalEnum(o, "format", p, FORMATS, error);
    optionalString(o, "prefix", p, 4, error);
    optionalString(o, "unit", p, 16, error);
  }
  function baseEnv(M, overrides) {
    var env = {};
    M.vars.forEach(function (v) { env[v.id] = overrides && overrides.hasOwnProperty(v.id) ? overrides[v.id] : v.default; });
    return env;
  }
  /* same rule as the renderer: a formula that is not a finite number counts as 0 from then on */
  function evalEnv(M, overrides, bad) {
    var env = baseEnv(M, overrides);
    M.formulas.forEach(function (f) { var x = f.fn(env); if (!isFinite(x)) { if (bad) bad[f.id] = x; x = 0; } env[f.id] = x; });
    return env;
  }
  function applySet(M, env, set) {
    var next = {}, clamped = [];
    M.vars.forEach(function (v) { next[v.id] = env[v.id]; });
    Object.keys(set).forEach(function (id) {
      var c = compileExpr(set[id]), v = M.vars.filter(function (x) { return x.id === id; })[0];
      if (c.error || !v) return;
      var raw = c.fn(env), val = Math.round(Math.min(v.max, Math.max(v.min, isFinite(raw) ? raw : v.min)) * 1e9) / 1e9;
      if (raw < v.min || raw > v.max) clamped.push(id + " (" + fmtNum(raw) + " → " + val + ")");
      next[id] = val;
    });
    return { vars: next, clamped: clamped };
  }

  /* ---- expressions in context ---- */
  function exprAt(obj, key, p, required, scope, error, explain) {
    var path = join(p, key);
    if (obj[key] === undefined) { if (required) error(path, "is required"); return null; }
    if (typeof obj[key] === "number" && isFinite(obj[key])) obj = { v: String(obj[key]) }, key = "v";
    if (typeof obj[key] !== "string") { error(path, "must be an expression string, got " + describe(obj[key])); return null; }
    return checkExprSrc(obj[key], path, scope, error, explain);
  }
  function checkExprSrc(src, path, scope, error, explain) {
    var c = compileExpr(src);
    if (c.error) { error(path, "expression " + describe(src) + " is invalid: " + c.error); return null; }
    var bad = false;
    c.ids.forEach(function (id) {
      if (scope.indexOf(id) !== -1) return;
      bad = true;
      var why = explain && explain(id);
      error(path, why || ("expression " + describe(src) + " uses unknown identifier \"" + id + "\" (known here: " + (scope.length ? scope.join(", ") : "none") + ")"));
    });
    return bad ? null : c;
  }

  /* ---- rich text: **bold**, ((term)), {expr} placeholders, [[variable]] scrubbers ---- */
  function makeText(terms, termUsed, M, error) {
    function termsIn(s, p) {
      var re = /\(\(([^()]+)\)\)/g, m;
      while ((m = re.exec(s))) {
        var parts = m[1].split("|"), term = parts[parts.length - 1].trim().toLowerCase();
        if (parts.length > 2 || !term) { error(p, "glossary mark ((" + m[1] + ")) must be ((term)) or ((shown text|term))"); continue; }
        if (terms.indexOf(term) === -1) error(p, "glossary mark ((" + m[1] + ")) names \"" + parts[parts.length - 1].trim() + "\", which is not a glossary term" + (terms.length ? " (terms: " + terms.join(", ") + ")" : ""));
        else termUsed[term] = true;
      }
    }
    function placeholders(s, p, scope, collect) {
      var re = /\{([^{}]*)\}/g, m;
      while ((m = re.exec(s))) {
        var inner = m[1], bar = inner.lastIndexOf("|"), fmt = null;
        if (bar !== -1) { fmt = inner.slice(bar + 1).trim(); inner = inner.slice(0, bar); }
        if (fmt !== null && FORMATS.indexOf(fmt) === -1) { error(p, "placeholder {" + m[1] + "} has unknown format \"" + fmt + "\" (formats: " + FORMATS.join(", ") + ")"); continue; }
        var c = compileExpr(inner);
        if (c.error) { error(p, "placeholder {" + m[1] + "} is invalid: " + c.error); continue; }
        c.ids.forEach(function (id) { if (scope.indexOf(id) === -1) error(p, "placeholder {" + m[1] + "} uses unknown identifier \"" + id + "\" (known here: " + scope.join(", ") + ")"); });
        if (collect) collect.push({ fn: c.fn, ids: c.ids, path: p, src: m[1] });
      }
    }
    function scrubbers(s, p) {
      var re = /\[\[([^\]]*)\]\]/g, m;
      while ((m = re.exec(s))) {
        if (M.varIds.indexOf(m[1].trim()) === -1) error(p, "scrubber [[" + m[1] + "]] must name a model variable (variables: " + M.varIds.join(", ") + ")");
      }
    }
    return {
      terms: termsIn,
      live: function (s, p, collect, scope) { termsIn(s, p); placeholders(s, p, scope || M.ids, collect); },
      body: function (s, p, collect) { termsIn(s, p); placeholders(s, p, M.ids, collect); scrubbers(s, p); return /\[\[/.test(s); }
    };
  }

  /* ---- steps ---- */
  function checkStep(s, path, stepIds, kindsUsed, M, T, error, warn) {
    if (!isObject(s, path, error)) return;
    if (requireString(s, "id", path, 1, 40, error)) {
      if (!KEBAB.test(s.id)) error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(s.id));
      else if (stepIds.indexOf(s.id) !== -1) error(path + ".id", "duplicate step id " + describe(s.id) + "; ids must be unique");
      else stepIds.push(s.id);
    }
    requireString(s, "title", path, 1, 80, error);
    optionalString(s, "kicker", path, 40, error);
    var live = [], hasScrubber = false;
    if (requireStringArray(s, "body", path, 1, 5, 700, error)) s.body.forEach(function (t, i) { if (T.body(t, path + ".body[" + i + "]", live)) hasScrubber = true; });
    if (optionalString(s, "takeaway", path, 240, error) && s.takeaway) T.live(s.takeaway, path + ".takeaway", live);

    /* start values */
    var start = {}, startOk = true;
    if (s.start !== undefined) {
      if (!isObject(s.start, path + ".start", error)) startOk = false;
      else Object.keys(s.start).forEach(function (id) {
        var p = path + ".start." + id, v = varById(M, id), val = s.start[id];
        if (M.varIds.indexOf(id) === -1) { error(p, "\"" + id + "\" is not a model variable (variables: " + M.varIds.join(", ") + ")"); startOk = false; return; }
        if (typeof val !== "number" || !isFinite(val)) { error(p, "must be a number, got " + describe(val)); startOk = false; return; }
        if (!v) { startOk = false; return; }
        if (val < v.min || val > v.max) { error(p, "must be between " + v.min + " and " + v.max + " (the variable's range), got " + val); startOk = false; return; }
        start[id] = val;
      });
    }
    var canEval = M.ok && startOk;
    var env = canEval ? evalEnv(M, start) : null;
    var checks = [];

    /* visuals */
    if (requireArray(s, "visuals", path, 1, 3, error)) {
      s.visuals.forEach(function (v, i) {
        var kind = checkVisual(v, path + ".visuals[" + i + "]", M, T, checks, error, warn);
        if (kind && kindsUsed.indexOf(kind) === -1) kindsUsed.push(kind);
      });
    }

    /* controls */
    var nControls = 0;
    if (optionalArray(s, "controls", path, 0, 6, error)) {
      nControls = s.controls.length;
      s.controls.forEach(function (c, i) { checkControl(c, path + ".controls[" + i + "]", M, error); });
    }
    if (!nControls && !hasScrubber) warn(path, "no controls and no [[variable]] scrubber in the body; the learner has nothing to tinker with");

    /* predict then observe */
    if (s.predict === undefined) warn(path, "no predict block; asking for a prediction before showing the answer is the heart of this view");
    else if (isObject(s.predict, path + ".predict", error)) {
      var pr = s.predict, pp = path + ".predict";
      if (requireString(pr, "prompt", pp, 1, 240, error)) T.terms(pr.prompt, pp + ".prompt");
      if (requireArray(pr, "options", pp, 2, 5, error)) {
        var correct = 0, texts = [];
        pr.options.forEach(function (o, i) {
          var op = pp + ".options[" + i + "]";
          if (!isObject(o, op, error)) return;
          if (requireString(o, "text", op, 1, 160, error)) {
            T.terms(o.text, op + ".text");
            var key = o.text.trim().toLowerCase();
            if (texts.indexOf(key) !== -1) warn(op + ".text", "duplicate option text " + describe(o.text));
            texts.push(key);
          }
          optionalBool(o, "correct", op, error);
          if (requireString(o, "why", op, 1, 400, error)) T.terms(o.why, op + ".why");
          if (o.correct === true) correct++;
        });
        if (correct !== 1) error(pp + ".options", "exactly one option must have \"correct\": true, found " + correct);
      }
      optionalBool(pr, "lock", pp, error);
      if (requireString(pr, "notice", pp, 1, 500, error)) T.live(pr.notice, pp + ".notice", live);
      var setOk = true, set = null;
      if (pr.set !== undefined) {
        if (!isObject(pr.set, pp + ".set", error)) setOk = false;
        else {
          set = pr.set;
          if (!Object.keys(set).length) { error(pp + ".set", "must assign at least one variable, or be omitted"); setOk = false; }
          Object.keys(set).forEach(function (id) {
            if (M.varIds.indexOf(id) === -1) { error(pp + ".set." + id, "\"" + id + "\" is not a model variable (variables: " + M.varIds.join(", ") + "); only variables can be set, not formulas"); setOk = false; return; }
            if (!exprAt(set, id, pp + ".set", true, M.ids, error)) setOk = false;
          });
        }
      }
      var expect = exprAt(pr, "expect", pp, false, M.ids, error);
      if (canEval && setOk) {
        var after = set ? applySet(M, env, set) : { vars: baseEnv(M, start), clamped: [] };
        if (after.clamped.length) warn(pp + ".set", "from the step's start values these are clamped to the variable range: " + after.clamped.join(", "));
        if (expect) {
          var env2 = evalEnv(M, after.vars);
          if (!expect.fn(env2)) {
            error(pp + ".expect", "\"" + pr.expect + "\" is false after applying predict.set to the step's start values (" + expect.ids.map(function (id) { return id + " = " + fmtNum(env2[id]); }).join(", ") + "); check the set values, the formulas or which option is correct");
          }
        }
      }
    }

    /* challenge */
    if (s.challenge !== undefined && isObject(s.challenge, path + ".challenge", error)) {
      var ch = s.challenge, cp = path + ".challenge";
      if (requireString(ch, "prompt", cp, 1, 240, error)) T.terms(ch.prompt, cp + ".prompt");
      var when = exprAt(ch, "when", cp, true, M.ids, error);
      if (requireString(ch, "success", cp, 1, 300, error)) T.live(ch.success, cp + ".success", live);
      if (optionalString(ch, "hint", cp, 240, error) && ch.hint) T.terms(ch.hint, cp + ".hint");
      if (when && canEval && when.fn(env)) warn(cp + ".when", "is already true at the step's start values, so the challenge is solved before the learner does anything");
    }

    /* numeric sanity at the step's start values */
    if (canEval) {
      live.forEach(function (c) { var x = c.fn(env); if (!isFinite(x)) warn(c.path, "placeholder {" + c.src + "} evaluates to " + x + " at the step's start values; the view shows 0"); });
      checks.forEach(function (c) {
        var e = env, x;
        if (c.locals) { e = Object.create(env); Object.keys(c.locals).forEach(function (k) { e[k] = c.locals[k]; }); }
        if (c.set) { var e2 = applySet(M, env, c.set).vars; e = evalEnv(M, e2); }
        x = c.fn(e);
        if (!isFinite(x)) warn(c.path, "evaluates to " + x + " at the step's start values; the view shows 0");
      });
    }
  }
  function varById(M, id) { for (var i = 0; i < M.vars.length; i++) if (M.vars[i].id === id) return M.vars[i]; return null; }

  /* ---- visuals ---- */
  function checkVisual(v, path, M, T, checks, error, warn) {
    if (!isObject(v, path, error)) return null;
    if (!requireEnum(v, "kind", path, KINDS, error)) return null;
    optionalString(v, "title", path, 60, error);
    if (optionalString(v, "caption", path, 240, error) && v.caption) T.live(v.caption, path + ".caption", null);
    checkFormatFields(v, path, error);
    var scope = M.ids;
    function ex(obj, key, p, required, locals, sampleLocals) {
      var sc = locals ? scope.concat(locals) : scope;
      var c = exprAt(obj, key, p, required, sc, error, locals ? null : function (id) {
        return RESERVED.indexOf(id) !== -1 ? "\"" + id + "\" is only available inside " + localHome(id) + "; here only model ids are known (" + scope.join(", ") + ")" : null;
      });
      if (c) checks.push({ fn: c.fn, path: join(p, key), locals: sampleLocals || null });
      return c;
    }
    function hue(obj, p) { optionalEnum(obj, "color", p, HUES, error); }
    function states(list, p) {
      var ids = [];
      if (!requireArray(v, "states", path, 2, 5, error)) return null;
      v.states.forEach(function (st, i) {
        var sp = path + ".states[" + i + "]";
        if (!isObject(st, sp, error)) return;
        if (requireString(st, "id", sp, 1, 24, error)) {
          if (!KEBAB.test(st.id)) error(sp + ".id", "must be kebab-case, got " + describe(st.id));
          else if (ids.indexOf(st.id) !== -1) error(sp + ".id", "duplicate state id " + describe(st.id));
          else ids.push(st.id);
        }
        requireString(st, "label", sp, 1, 24, error);
        if (st.color === undefined) error(sp + ".color", "is required (one of " + HUES.join(", ") + ")");
        else hue(st, sp);
      });
      return ids;
    }
    function rules(ids, allowSplit, min, max) {
      var kinds = allowSplit ? ["contact", "timer", "split"] : ["contact", "timer"];
      if (!requireArray(v, "rules", path, min, max, error)) return;
      v.rules.forEach(function (r, i) {
        var rp = path + ".rules[" + i + "]";
        if (!isObject(r, rp, error)) return;
        if (!requireEnum(r, "kind", rp, kinds, error)) return;
        function sid(key, required) {
          if (r[key] === undefined) { if (required) error(rp + "." + key, "is required for a " + r.kind + " rule"); return; }
          if (ids && ids.indexOf(r[key]) === -1) error(rp + "." + key, "state " + describe(r[key]) + " is not defined in states (" + ids.join(", ") + ")");
        }
        sid("from", true);
        sid("to", r.kind !== "split");
        if (r.kind === "contact") sid("with", true);
        else if (r.with !== undefined) error(rp + ".with", "is only allowed on a contact rule");
        if (r.kind !== "split" && r.to !== undefined && r.to === r.from) error(rp + ".to", "equals from (" + describe(r.from) + "); a rule that changes a state into itself does nothing");
        ex(r, "chance", rp, true);
      });
    }

    switch (v.kind) {
      case "bars":
        if (requireArray(v, "bars", path, 1, 12, error)) v.bars.forEach(function (b, i) {
          var bp = path + ".bars[" + i + "]";
          if (!isObject(b, bp, error)) return;
          requireString(b, "label", bp, 1, 24, error);
          ex(b, "value", bp, true); hue(b, bp); ex(b, "alert", bp, false);
        });
        ex(v, "max", path, false);
        optionalBool(v, "horizontal", path, error);
        break;
      case "line":
        var xid = null;
        if (requireObject(v, "x", path, error)) {
          var xp = path + ".x";
          if (requireString(v.x, "id", xp, 1, 12, error)) {
            if (!IDENT.test(v.x.id)) error(xp + ".id", "must start with a lowercase letter and contain only letters and digits, got " + describe(v.x.id));
            else if (scope.indexOf(v.x.id) !== -1) error(xp + ".id", describe(v.x.id) + " is already a model id; pick another name for the x axis so it does not hide it");
            else if (FUNCS.hasOwnProperty(v.x.id) || v.x.id === "pi") error(xp + ".id", describe(v.x.id) + " is reserved");
            else xid = v.x.id;
          }
          ex(v.x, "from", xp, true); ex(v.x, "to", xp, true);
          requireString(v.x, "label", xp, 1, 30, error);
          optionalEnum(v.x, "format", xp, FORMATS, error);
        }
        if (requireArray(v, "series", path, 1, 4, error)) v.series.forEach(function (s, i) {
          var sp = path + ".series[" + i + "]";
          if (!isObject(s, sp, error)) return;
          requireString(s, "label", sp, 1, 30, error);
          var loc = {}; if (xid) loc[xid] = 1;
          if (xid) ex(s, "y", sp, true, [xid], loc); else if (s.y === undefined) error(sp + ".y", "is required");
          hue(s, sp); optionalBool(s, "dashed", sp, error);
        });
        ex(v, "yMin", path, false); ex(v, "yMax", path, false);
        optionalBool(v, "logY", path, error);
        ex(v, "marker", path, false);
        optionalString(v, "markerLabel", path, 24, error);
        if (v.markerLabel !== undefined && v.marker === undefined) error(path + ".markerLabel", "needs marker");
        optionalInt(v, "samples", path, 20, 400, error);
        optionalString(v, "yLabel", path, 30, error);
        break;
      case "scatter":
        var sl = { i: 0, u: 0.5, v: 0.5, n: 0 };
        ex(v, "count", path, true);
        ex(v, "x", path, true, LOCALS.scatter, sl); ex(v, "y", path, true, LOCALS.scatter, sl);
        ["xMin", "xMax", "yMin", "yMax"].forEach(function (k) { ex(v, k, path, false); });
        optionalString(v, "xLabel", path, 30, error); optionalString(v, "yLabel", path, 30, error);
        optionalEnum(v, "xFormat", path, FORMATS, error); optionalEnum(v, "yFormat", path, FORMATS, error);
        hue(v, path);
        ex(v, "highlight", path, false, LOCALS.scatter, sl);
        optionalEnum(v, "highlightColor", path, HUES, error);
        optionalString(v, "highlightLabel", path, 40, error);
        if ((v.highlightColor !== undefined || v.highlightLabel !== undefined) && v.highlight === undefined) error(path + ".highlight", "is required when highlightColor or highlightLabel is set");
        if (v.highlight !== undefined && (v.highlightColor || "red") === (v.color || "grey")) warn(path + ".highlightColor", "is the same hue as color (" + (v.color || "grey") + "), so highlighted points look like the others");
        break;
      case "agents":
        var aids = states();
        if (requireObject(v, "initial", path, error)) {
          var keys = Object.keys(v.initial);
          if (!keys.length) error(path + ".initial", "must give a count for at least one state");
          keys.forEach(function (k) {
            if (aids && aids.indexOf(k) === -1) error(path + ".initial." + k, "state \"" + k + "\" is not defined in states (" + aids.join(", ") + ")");
            ex(v.initial, k, path + ".initial", true);
          });
        }
        rules(aids, true, 1, 6);
        ex(v, "speed", path, false); ex(v, "radius", path, false); ex(v, "still", path, false);
        optionalInt(v, "ticks", path, 100, 5000, error);
        optionalInt(v, "max", path, 10, 800, error);
        optionalBool(v, "history", path, error);
        break;
      case "grid":
        requireInt(v, "rows", path, 4, 60, error); requireInt(v, "cols", path, 4, 60, error);
        var gids = states();
        ex(v, "cell", path, true, LOCALS.grid, { row: 0, col: 0, rows: v.rows || 10, cols: v.cols || 10, i: 0, u: 0.5 });
        if (v.rules !== undefined) rules(gids, false, 0, 4);
        if (v.neighbors !== undefined && v.neighbors !== 4 && v.neighbors !== 8) error(path + ".neighbors", "must be 4 or 8, got " + describe(v.neighbors));
        optionalInt(v, "ticks", path, 10, 1000, error);
        optionalInt(v, "speed", path, 1, 30, error);
        break;
      case "gauge":
        ex(v, "value", path, true); ex(v, "min", path, false); ex(v, "max", path, true);
        optionalString(v, "label", path, 30, error);
        if (optionalArray(v, "zones", path, 1, 4, error)) {
          var last = -Infinity;
          v.zones.forEach(function (z, i) {
            var zp = path + ".zones[" + i + "]";
            if (!isObject(z, zp, error)) return;
            if (requireNumber(z, "to", zp, -1e12, 1e12, error)) {
              if (z.to <= last) error(zp + ".to", "must be greater than the previous zone's to (" + last + "), got " + z.to);
              last = z.to;
            }
            if (z.color === undefined) error(zp + ".color", "is required (one of " + HUES.join(", ") + ")"); else hue(z, zp);
            requireString(z, "label", zp, 1, 20, error);
          });
        }
        break;
      case "number":
        if (requireArray(v, "items", path, 1, 4, error)) v.items.forEach(function (it, i) {
          var ip = path + ".items[" + i + "]";
          if (!isObject(it, ip, error)) return;
          requireString(it, "label", ip, 1, 30, error);
          ex(it, "value", ip, true); checkFormatFields(it, ip, error); hue(it, ip);
        });
        break;
      case "stack":
        if (requireArray(v, "parts", path, 2, 6, error)) v.parts.forEach(function (pt, i) {
          var pp = path + ".parts[" + i + "]";
          if (!isObject(pt, pp, error)) return;
          requireString(pt, "label", pp, 1, 24, error);
          ex(pt, "value", pp, true); hue(pt, pp);
        });
        optionalEnum(v, "shape", path, ["bar", "donut"], error);
        break;
      case "flow":
        var okStages = requireArray(v, "stages", path, 2, 5, error);
        if (okStages) v.stages.forEach(function (st, i) {
          var sp = path + ".stages[" + i + "]";
          if (!isObject(st, sp, error)) return;
          requireString(st, "label", sp, 1, 24, error);
          ex(st, "value", sp, true); hue(st, sp);
        });
        if (requireArray(v, "links", path, 1, 4, error)) {
          if (okStages && v.links.length !== v.stages.length - 1) error(path + ".links", "must have one link between each pair of neighbouring stages: " + (v.stages.length - 1) + " for " + v.stages.length + " stages, got " + v.links.length);
          v.links.forEach(function (l, i) {
            var lp = path + ".links[" + i + "]";
            if (!isObject(l, lp, error)) return;
            ex(l, "rate", lp, true);
            optionalString(l, "label", lp, 24, error);
          });
        }
        ex(v, "maxRate", path, false);
        break;
      case "timeline":
        ex(v, "frames", path, true);
        ex(v, "value", path, true, LOCALS.timeline, { k: 1 });
        if (requireString(v, "label", path, 1, 100, error)) T.live(v.label, path + ".label", null, scope.concat(LOCALS.timelineLabel));
        optionalEnum(v, "display", path, ["dots", "bars"], error);
        optionalInt(v, "frameMs", path, 200, 3000, error);
        optionalBool(v, "autoplay", path, error);
        hue(v, path);
        break;
      case "compare":
        if (requireArray(v, "scenarios", path, 2, 2, error)) v.scenarios.forEach(function (sc, i) {
          var sp = path + ".scenarios[" + i + "]";
          if (!isObject(sc, sp, error)) return;
          requireString(sc, "label", sp, 1, 30, error);
          hue(sc, sp);
          if (requireObject(sc, "set", sp, error)) {
            if (!Object.keys(sc.set).length) error(sp + ".set", "must assign at least one variable");
            Object.keys(sc.set).forEach(function (id) {
              if (M.varIds.indexOf(id) === -1) error(sp + ".set." + id, "\"" + id + "\" is not a model variable (variables: " + M.varIds.join(", ") + ")");
              else ex(sc.set, id, sp + ".set", true);
            });
          }
        });
        if (requireArray(v, "metrics", path, 1, 4, error)) v.metrics.forEach(function (mt, i) {
          var mp = path + ".metrics[" + i + "]";
          if (!isObject(mt, mp, error)) return;
          requireString(mt, "label", mp, 1, 30, error);
          var c = exprAt(mt, "value", mp, true, scope, error);
          if (c && Array.isArray(v.scenarios)) v.scenarios.forEach(function (sc) { if (sc && sc.set && typeof sc.set === "object") checks.push({ fn: c.fn, path: mp + ".value", set: validSet(M, sc.set) }); });
          checkFormatFields(mt, mp, error);
          optionalEnum(mt, "better", mp, ["higher", "lower"], error);
        });
        break;
    }
    return v.kind;
  }
  function validSet(M, set) {
    var out = {};
    Object.keys(set).forEach(function (id) { if (varById(M, id) && typeof set[id] === "string" && !compileExpr(set[id]).error && compileExpr(set[id]).ids.every(function (x) { return M.ids.indexOf(x) !== -1; })) out[id] = set[id]; });
    return out;
  }
  function localHome(id) {
    var homes = [];
    if (LOCALS.scatter.indexOf(id) !== -1) homes.push("scatter x/y/highlight");
    if (LOCALS.grid.indexOf(id) !== -1) homes.push("grid cell");
    if (id === "k") homes.push("timeline value and label");
    if (id === "value") homes.push("timeline label");
    return homes.join(", ") || "nowhere (reserved)";
  }

  /* ---- controls ---- */
  function checkControl(c, path, M, error) {
    if (!isObject(c, path, error)) return;
    if (!requireEnum(c, "kind", path, CONTROL_KINDS, error)) return;
    optionalString(c, "label", path, 40, error);
    var v = null;
    if (c.kind === "button") {
      requireString(c, "label", path, 1, 40, error);
      if (c["var"] !== undefined) error(path + ".var", "is not used by a button; put the assignments in set");
      if (requireObject(c, "set", path, error)) {
        if (!Object.keys(c.set).length) error(path + ".set", "must assign at least one variable");
        Object.keys(c.set).forEach(function (id) {
          if (M.varIds.indexOf(id) === -1) error(path + ".set." + id, "\"" + id + "\" is not a model variable (variables: " + M.varIds.join(", ") + ")");
          else exprAt(c.set, id, path + ".set", true, M.ids, error);
        });
      }
    } else {
      if (requireString(c, "var", path, 1, 24, error)) {
        v = varById(M, c["var"]);
        if (M.varIds.indexOf(c["var"]) === -1) error(path + ".var", "\"" + c["var"] + "\" is not a model variable (variables: " + M.varIds.join(", ") + ")" + (M.ids.indexOf(c["var"]) !== -1 ? "; formulas cannot be controlled" : ""));
      }
      if (c.set !== undefined) error(path + ".set", "is only used by a button control");
    }
    if (c.kind === "choice") {
      if (requireArray(c, "options", path, 2, 6, error)) c.options.forEach(function (o, i) {
        var op = path + ".options[" + i + "]";
        if (!isObject(o, op, error)) return;
        requireString(o, "label", op, 1, 24, error);
        if (requireNumber(o, "value", op, -1e12, 1e12, error) && v && (o.value < v.min || o.value > v.max)) error(op + ".value", "must be within the variable's range (" + v.min + "–" + v.max + "), got " + o.value);
      });
    } else if (c.options !== undefined) error(path + ".options", "is only used by a choice control");
    if (c.kind === "play") {
      optionalNumber(c, "duration", path, 1, 30, error);
      optionalBool(c, "loop", path, error);
    } else {
      if (c.duration !== undefined) error(path + ".duration", "is only used by a play control");
      if (c.loop !== undefined) error(path + ".loop", "is only used by a play control");
    }
  }

  // ---- expression compiler (identical copy lives in assets/view.js) -------
  function compileExpr(src) {
    if (typeof src !== "string" || !src.trim()) return { error: "empty expression" };
    var re = /\s*(?:(\d+(?:\.\d+)?(?:[eE][-+]?\d+)?|\.\d+)|([A-Za-z][A-Za-z0-9]*)|(==|!=|<=|>=|&&|\|\||[-+*\/%()<>!,]))/y;
    var toks = [], pos = 0, m;
    while (pos < src.length) {
      re.lastIndex = pos; m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(pos))) break; return { error: "unexpected character \"" + src.slice(pos).trim()[0] + "\"" }; }
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
      if (t.t === "id") {
        i++;
        var next = toks[i];
        if (next && next.t === "op" && next.v === "(") {
          if (!FUNCS.hasOwnProperty(t.v)) throw new Error("unknown function \"" + t.v + "\" (functions: " + Object.keys(FUNCS).join(", ") + ")");
          i++;
          var args = [];
          if (!eat(")")) {
            do { args.push(orExpr()); } while (eat(","));
            if (!eat(")")) throw new Error("missing ) after the arguments of " + t.v);
          }
          var ar = FUNCS[t.v];
          if (args.length < ar[0] || args.length > ar[1]) throw new Error(t.v + " takes " + (ar[0] === ar[1] ? ar[0] : ar[0] + "–" + ar[1]) + " argument(s), got " + args.length);
          return callFn(t.v, args);
        }
        if (FUNCS.hasOwnProperty(t.v)) throw new Error("function \"" + t.v + "\" must be called with parentheses, e.g. " + t.v + "(…)");
        if (t.v === "pi") return function () { return Math.PI; };
        if (ids.indexOf(t.v) === -1) ids.push(t.v);
        return function (env) { var x = env[t.v]; return typeof x === "number" ? x : 0; };
      }
      if (eat("(")) { var e = orExpr(); if (!eat(")")) throw new Error("missing )"); return e; }
      throw new Error("unexpected \"" + t.v + "\"");
    }
    function callFn(name, a) {
      var f = {
        min: function (env) { return Math.min.apply(null, a.map(function (g) { return g(env); })); },
        max: function (env) { return Math.max.apply(null, a.map(function (g) { return g(env); })); },
        abs: function (env) { return Math.abs(a[0](env)); },
        sqrt: function (env) { return Math.sqrt(a[0](env)); },
        pow: function (env) { return Math.pow(a[0](env), a[1](env)); },
        exp: function (env) { return Math.exp(a[0](env)); },
        log: function (env) { return Math.log(a[0](env)); },
        sin: function (env) { return Math.sin(a[0](env)); },
        cos: function (env) { return Math.cos(a[0](env)); },
        floor: function (env) { return Math.floor(a[0](env)); },
        round: function (env) { return Math.round(a[0](env)); },
        clamp: function (env) { return Math.min(a[2](env), Math.max(a[1](env), a[0](env))); },
        "if": function (env) { return a[0](env) ? a[1](env) : a[2](env); }
      };
      return f[name];
    }
    function unary() {
      if (eat("!")) { var a = unary(); return function (env) { return a(env) ? 0 : 1; }; }
      if (eat("-")) { var b = unary(); return function (env) { return -b(env); }; }
      if (eat("+")) return unary();
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
      "==": function (a, b) { return Math.abs(a - b) < 1e-9 ? 1 : 0; }, "!=": function (a, b) { return Math.abs(a - b) < 1e-9 ? 0 : 1; },
      "<": function (a, b) { return a < b ? 1 : 0; }, "<=": function (a, b) { return a <= b ? 1 : 0; },
      ">": function (a, b) { return a > b ? 1 : 0; }, ">=": function (a, b) { return a >= b ? 1 : 0; }
    });
    var and = bin(cmp, { "&&": function (a, b) { return a && b ? 1 : 0; } });
    var orExpr = bin(and, { "||": function (a, b) { return a || b ? 1 : 0; } });
    try {
      if (!toks.length) throw new Error("empty expression");
      var fn = orExpr();
      if (i < toks.length) throw new Error("unexpected \"" + toks[i].v + "\"");
      return { fn: fn, ids: ids };
    } catch (e) { return { error: e.message }; }
  }
  function fmtNum(x) { return typeof x === "number" && isFinite(x) ? String(Math.round(x * 1e4) / 1e4) : String(x); }

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
    if (typeof v !== "number" || !isFinite(v)) { error(path, "must be a number, got " + describe(v)); return false; }
    if (v < min || v > max) { error(path, "must be between " + min + " and " + max + ", got " + v); return false; }
    return true;
  }
  function optionalNumber(obj, key, parent, min, max, error) {
    if (obj[key] === undefined) return true;
    return requireNumber(obj, key, parent, min, max, error);
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
  function optionalEnum(obj, key, parent, values, error) {
    if (obj[key] === undefined) return true;
    return requireEnum(obj, key, parent, values, error);
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
