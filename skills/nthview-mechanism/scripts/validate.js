/* NthView — mechanism validator — schemaVersion 1
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
  var THEMES = ["graphite", "paper", "blueprint", "terminal", "sand", "aurora"];
  var HUES = ["blue", "orange", "teal", "pink", "violet", "amber", "green", "red", "grey"];
  var FORMATS = ["number", "int", "dp1", "dp2", "percent", "duration", "bytes", "compact", "plain"];
  var UNITS = ["second", "minute", "hour", "day", "week", "request", "round", "step"];
  var KINDS = ["line", "step", "area", "bar", "stacked", "gauge", "tile", "events", "calc", "compare", "heatmap", "flow", "state"];
  var CONTROLS = ["slider", "toggle", "choice"];
  var FUNCS = { min: [1, 8], max: [1, 8], abs: [1, 1], sqrt: [1, 1], pow: [2, 2], exp: [1, 1], log: [1, 1], floor: [1, 1], ceil: [1, 1], round: [1, 1], clamp: [3, 3], "if": [3, 3], noise: [1, 1] };
  var RESERVED = ["t", "pi"];

  function checkRoot(data, error, warn) {
    requireString(data, "title", "$", 1, 120, error);
    optionalString(data, "subtitle", "$", 240, error);
    optionalString(data, "kicker", "$", 40, error);
    optionalEnum(data, "theme", "$", THEMES, error);
    if (data.seed !== undefined && !(isInt(data.seed) && data.seed >= 0 && data.seed <= 2147483647)) error("seed", "must be an integer from 0 to 2147483647, got " + describe(data.seed));

    var H = checkClock(data, error);
    var winLabels = isObject(data.clock) && Array.isArray(data.clock.windows) ? data.clock.windows.filter(isObject).map(function (w) { return w.label; }) : [];
    var NS = {};            // identifier namespace: id -> "parameter" | "variable" | "event"
    var M = { params: [], vars: [], rules: [], events: [], scen: [], expects: [], windows: winLabels, H: H, seed: isInt(data.seed) ? data.seed : 1, ok: true };
    var gloss = {};
    if (data.glossary !== undefined && requireArray(data, "glossary", "$", 1, 40, error)) {
      data.glossary.forEach(function (g, i) {
        var p = "glossary[" + i + "]";
        if (!isObject(g)) { error(p, "must be an object, got " + describe(g)); return; }
        if (requireString(g, "term", p, 1, 40, error)) {
          var k = g.term.trim().toLowerCase();
          if (gloss.hasOwnProperty(k)) error(p + ".term", "\"" + g.term + "\" is already defined at glossary[" + gloss[k].i + "] (terms are unique ignoring case)");
          else gloss[k] = { i: i, used: false };
        }
        requireString(g, "definition", p, 1, 300, error);
      });
    }

    checkParameters(data, M, NS, error);
    checkVariables(data, M, NS, error);
    checkEvents(data, M, NS, error);
    checkRules(data, M, NS, error);
    var scenIds = checkScenarios(data, M, NS, error);

    if (data.stage !== undefined) {
      var st = data.stage;
      if (!isObject(st)) error("stage", "must be an object, got " + describe(st));
      else {
        optionalString(st, "title", "stage", 60, error);
        if (st.variables !== undefined) varList(st, "variables", "stage", 2, 12, M, NS, error);
      }
    }
    var T = textChecker(gloss, NS, error);
    if (requireStringArray(data, "lead", "$", 1, 4, 700, error)) data.lead.forEach(function (s, i) { T(s, "lead[" + i + "]"); });

    var kinds = {};
    if (requireArray(data, "sections", "$", 1, 16, error)) {
      var seen = {}, figCount = 0;
      data.sections.forEach(function (s, i) {
        var n = checkSection(s, "sections[" + i + "]", seen, M, NS, scenIds, T, kinds, error);
        figCount += n;
      });
      if (figCount > 40) error("sections", "may hold at most 40 figures in total, got " + figCount);
    }

    if (data.closing !== undefined) {
      var c = data.closing, cp = "closing";
      if (!isObject(c)) error(cp, "must be an object, got " + describe(c));
      else {
        optionalString(c, "heading", cp, 80, error);
        if (requireStringArray(c, "body", cp, 1, 4, 700, error)) c.body.forEach(function (s, i) { T(s, cp + ".body[" + i + "]"); });
        if (c.takeaways !== undefined && requireStringArray(c, "takeaways", cp, 1, 8, 200, error)) c.takeaways.forEach(function (s, i) { T(s, cp + ".takeaways[" + i + "]"); });
      }
    }

    Object.keys(gloss).forEach(function (k) { if (!gloss[k].used) warn("glossary[" + gloss[k].i + "]", "term \"" + data.glossary[gloss[k].i].term + "\" is never marked with ((…)) in the text"); });

    // ---- warnings that need the whole model -------------------------------
    if (Array.isArray(data.scenarios) && data.scenarios.length === 1) warn("scenarios", "only one scenario; two or three (for example benign, attacker, mitigated) show the mechanism best");
    var kindList = Object.keys(kinds);
    if (kindList.length === 1 && kinds[kindList[0]] > 2) warn("sections", "every figure is a \"" + kindList[0] + "\"; mix kinds so each picture adds something");
    M.vars.forEach(function (v) {
      if (!v.changed) warn(v.path, "variable \"" + v.id + "\" is never changed by a rule or an event, so it stays at its initial value");
    });
    if (M.ok) M.params.forEach(function (p) {
      if (!p.used) warn(p.path, "parameter \"" + p.id + "\" is not used by any initial value, rule or event");
    });

    // ---- run every scenario: expect checks, non-finite values, silent events
    if (!M.ok || !scenIds.length || !H) return;
    try { runChecks(M, data, error, warn); }
    catch (e) { error("$", "the simulation could not run (" + e.message + "); fix the errors above and validate again"); }
  }

  function runChecks(M, data, error, warn) {
    var runs = {};
    M.scen.forEach(function (sc) {
      var r = simulate(M, sc, scenarioParams(M, sc, null));
      runs[sc.id] = r;
      Object.keys(r.bad).forEach(function (path) { warn(path, "evaluates to " + r.bad[path] + " in scenario \"" + sc.id + "\"; the view shows 0 instead"); });
    });
    M.events.forEach(function (e) {
      var any = M.scen.some(function (sc) { var f = runs[sc.id].fired[e.id]; return f && sum8(f) > 0; });
      if (!any) warn(e.path, "event \"" + e.id + "\" never fires within the horizon in any scenario");
    });
    M.scen.forEach(function (sc) {
      sc.events.forEach(function (e) {
        if (!sum8(runs[sc.id].fired[e.id])) warn(e.path, "event \"" + e.id + "\" never fires within the horizon of scenario \"" + sc.id + "\"");
      });
    });
    M.expects.forEach(function (x) {
      var run = runs[x.scenario.id], env = envAt(M, x.scenario, run, x.at);
      if (!x.fn(env)) error(x.path, "\"" + x.src + "\" is false in scenario \"" + x.scenario.id + "\" at tick " + x.at + " (" + x.ids.map(function (id) { return id + " = " + fmtNum(env[id]); }).join(", ") + "); check the rules, the tick or which option is correct");
    });
  }

  function sum8(a) { if (!a) return 0; var n = 0; for (var i = 0; i < a.length; i++) n += a[i]; return n; }

  function checkClock(data, error) {
    var c = data.clock, p = "clock";
    if (!isObject(c)) { error(p, "must be an object, got " + describe(c)); return 0; }
    requireEnum(c, "unit", p, UNITS, error);
    var H = 0;
    if (!isInt(c.horizon) || c.horizon < 10 || c.horizon > 5000) error(p + ".horizon", "must be an integer from 10 to 5000 ticks, got " + describe(c.horizon));
    else H = c.horizon;
    optionalString(c, "label", p, 40, error);
    if (c.start !== undefined && !(isInt(c.start) && c.start >= 0 && (!H || c.start <= H))) error(p + ".start", "must be an integer tick from 0 to the horizon" + (H ? " (" + H + ")" : "") + ", got " + describe(c.start));
    var ns = 3;
    if (c.speeds !== undefined && requireArray(c, "speeds", p, 1, 6, error)) {
      ns = c.speeds.length;
      c.speeds.forEach(function (s, i) {
        if (typeof s !== "number" || !isFinite(s) || s < 0.1 || s > 5000) error(p + ".speeds[" + i + "]", "must be a number of ticks per second from 0.1 to 5000, got " + describe(s));
        else if (i > 0 && typeof c.speeds[i - 1] === "number" && s <= c.speeds[i - 1]) error(p + ".speeds[" + i + "]", "must be greater than the speed before it (speeds go from slow to fast)");
      });
    }
    if (c.speed !== undefined && !(isInt(c.speed) && c.speed >= 0 && c.speed < ns)) error(p + ".speed", "must be an index into speeds (0–" + (ns - 1) + "), got " + describe(c.speed));
    if (c.windows !== undefined && requireArray(c, "windows", p, 1, 6, error)) {
      c.windows.forEach(function (w, i) {
        var wp = p + ".windows[" + i + "]";
        if (!isObject(w)) { error(wp, "must be an object, got " + describe(w)); return; }
        requireString(w, "label", wp, 1, 16, error);
        if (!isInt(w.ticks) || w.ticks < 5 || (H && w.ticks > H)) error(wp + ".ticks", "must be an integer from 5 to the horizon" + (H ? " (" + H + ")" : "") + ", got " + describe(w.ticks));
      });
    }
    if (c.window !== undefined) {
      var nw = Array.isArray(c.windows) ? c.windows.length : 0;
      if (!(isInt(c.window) && c.window >= 0 && c.window <= nw)) error(p + ".window", "must be an index into windows, or " + nw + " for the whole horizon, got " + describe(c.window));
    }
    return H;
  }

  function claimId(obj, p, kind, NS, error) {
    if (!requireString(obj, "id", p, 1, 24, error)) return false;
    var id = obj.id;
    if (!IDENT.test(id)) { error(p + ".id", "\"" + id + "\" must be camelCase: a lowercase letter, then letters and digits (no hyphens, underscores or spaces)"); return false; }
    if (FUNCS.hasOwnProperty(id) || RESERVED.indexOf(id) !== -1) { error(p + ".id", "\"" + id + "\" is reserved (a function name, t or pi)"); return false; }
    if (NS.hasOwnProperty(id)) { error(p + ".id", "\"" + id + "\" is already used by a " + NS[id] + "; parameters, variables and events share one namespace"); return false; }
    NS[id] = kind;
    return true;
  }

  function checkNumberFields(o, p, error) {
    optionalEnum(o, "format", p, FORMATS, error);
    optionalString(o, "unit", p, 16, error);
  }

  function checkParameters(data, M, NS, error) {
    if (data.parameters === undefined) return;
    if (!requireArray(data, "parameters", "$", 0, 16, error)) { M.ok = false; return; }
    data.parameters.forEach(function (q, i) {
      var p = "parameters[" + i + "]";
      if (!isObject(q)) { error(p, "must be an object, got " + describe(q)); M.ok = false; return; }
      var okId = claimId(q, p, "parameter", NS, error);
      requireString(q, "label", p, 1, 40, error);
      optionalString(q, "description", p, 200, error);
      checkNumberFields(q, p, error);
      var okN = requireNumber(q, "min", p, error) & requireNumber(q, "max", p, error) & requireNumber(q, "default", p, error);
      if (okN) {
        if (q.max <= q.min) { error(p + ".max", "must be greater than min (" + q.min + "), got " + q.max); okN = 0; }
        else if (q["default"] < q.min || q["default"] > q.max) { error(p + ".default", "must be between min (" + q.min + ") and max (" + q.max + "), got " + q["default"]); okN = 0; }
      }
      if (q.step !== undefined && !(typeof q.step === "number" && q.step > 0 && (!okN || q.step <= q.max - q.min))) error(p + ".step", "must be a number greater than 0 and at most max − min, got " + describe(q.step));
      optionalEnum(q, "control", p, CONTROLS, error);
      if (q.control === "toggle" && okN && (q.min !== 0 || q.max !== 1)) error(p + ".control", "a toggle needs min 0 and max 1 (off and on), got min " + q.min + " and max " + q.max);
      if (q.control === "choice") {
        if (requireArray(q, "options", p, 2, 6, error)) q.options.forEach(function (o, j) {
          var op = p + ".options[" + j + "]";
          if (!isObject(o)) { error(op, "must be an object, got " + describe(o)); return; }
          requireString(o, "label", op, 1, 20, error);
          if (requireNumber(o, "value", op, error) && okN && (o.value < q.min || o.value > q.max)) error(op + ".value", "must be between min (" + q.min + ") and max (" + q.max + "), got " + o.value);
        });
      } else if (q.options !== undefined) error(p + ".options", "is only allowed when control is \"choice\"");
      if (okId && okN) M.params.push({ id: q.id, min: q.min, max: q.max, def: q["default"], path: p, used: false });
      else M.ok = false;
    });
  }

  function checkVariables(data, M, NS, error) {
    if (!requireArray(data, "variables", "$", 1, 24, error)) { M.ok = false; return; }
    data.variables.forEach(function (v, i) {
      var p = "variables[" + i + "]";
      if (!isObject(v)) { error(p, "must be an object, got " + describe(v)); M.ok = false; return; }
      var okId = claimId(v, p, "variable", NS, error);
      requireString(v, "label", p, 1, 40, error);
      optionalString(v, "description", p, 200, error);
      checkNumberFields(v, p, error);
      optionalEnum(v, "color", p, HUES, error);
      var lo = -Infinity, hi = Infinity;
      if (v.min !== undefined) { if (requireNumber(v, "min", p, error)) lo = v.min; }
      if (v.max !== undefined) { if (requireNumber(v, "max", p, error)) hi = v.max; }
      if (lo !== -Infinity && hi !== Infinity && hi <= lo) error(p + ".max", "must be greater than min (" + lo + "), got " + hi);
      var scope = M.params.map(function (q) { return q.id; }).concat(M.vars.map(function (x) { return x.id; }));
      var c = exprAt(v, "initial", p, scope, error, M, function (id) {
        if (NS[id] === "variable") return "uses variable \"" + id + "\" before it is declared (an initial value may use parameters and variables listed before it)";
        if (NS[id] === "event") return "uses event \"" + id + "\"; initial values are computed at tick 0, before any event";
        return null;
      });
      if (okId) M.vars.push({ id: v.id, lo: lo, hi: hi, init: c, path: p, changed: false });
      else M.ok = false;
      if (!c) M.ok = false;
    });
  }

  function checkEventList(list, base, M, NS, local, error) {
    var out = [];
    list.forEach(function (e, i) {
      var p = base + "[" + i + "]";
      if (!isObject(e)) { error(p, "must be an object, got " + describe(e)); M.ok = false; return; }
      var okId;
      if (local) {
        okId = requireString(e, "id", p, 1, 24, error);
        if (okId && !IDENT.test(e.id)) { error(p + ".id", "\"" + e.id + "\" must be camelCase: a lowercase letter, then letters and digits (no hyphens, underscores or spaces)"); okId = false; }
        else if (okId && (FUNCS.hasOwnProperty(e.id) || RESERVED.indexOf(e.id) !== -1)) { error(p + ".id", "\"" + e.id + "\" is reserved (a function name, t or pi)"); okId = false; }
        else if (okId && local.hasOwnProperty(e.id)) { error(p + ".id", "\"" + e.id + "\" is already used by another event of this scenario"); okId = false; }
        else if (okId && NS.hasOwnProperty(e.id) && NS[e.id] !== "scenario event") { error(p + ".id", "\"" + e.id + "\" is already used by a " + NS[e.id] + "; parameters, variables and events share one namespace"); okId = false; }
        if (okId) { local[e.id] = true; NS[e.id] = "scenario event"; }
      } else okId = claimId(e, p, "event", NS, error);
      requireString(e, "label", p, 1, 40, error);
      optionalString(e, "note", p, 200, error);
      optionalEnum(e, "color", p, HUES, error);
      var H = M.H, ev = { id: e.id, path: p, at: null, every: null, when: null, once: e.once === true, set: [] };
      var kinds = ["at", "every", "when"].filter(function (k) { return e[k] !== undefined; });
      if (kinds.length !== 1) error(p, "needs exactly one of at, every or when, got " + (kinds.length ? kinds.join(" and ") : "none"));
      if (e.at !== undefined) {
        var at = Array.isArray(e.at) ? e.at : [e.at];
        if (!at.length || at.length > 200) error(p + ".at", "must be a tick or an array of 1–200 ticks, got " + (Array.isArray(e.at) ? at.length + " ticks" : describe(e.at)));
        else {
          var bad = false;
          at.forEach(function (k, j) { if (!isInt(k) || k < 1 || (H && k > H)) { if (!bad) error(p + ".at" + (Array.isArray(e.at) ? "[" + j + "]" : ""), "must be an integer tick from 1 to the horizon" + (H ? " (" + H + ")" : "") + ", got " + describe(k)); bad = true; } });
          if (!bad) { ev.at = {}; at.forEach(function (k) { ev.at[k] = true; }); }
        }
      }
      if (e.every !== undefined) {
        var w = e.every, wp = p + ".every";
        if (!isObject(w)) error(wp, "must be an object with period, from and to, got " + describe(w));
        else {
          var okW = true;
          if (!isInt(w.period) || w.period < 1 || (H && w.period > H)) { error(wp + ".period", "must be an integer number of ticks from 1 to the horizon, got " + describe(w.period)); okW = false; }
          var from = w.from === undefined ? w.period : w.from, to = w.to === undefined ? H : w.to;
          if (w.from !== undefined && (!isInt(w.from) || w.from < 1 || (H && w.from > H))) { error(wp + ".from", "must be an integer tick from 1 to the horizon, got " + describe(w.from)); okW = false; }
          if (w.to !== undefined && (!isInt(w.to) || (isInt(from) && w.to < from) || (H && w.to > H))) { error(wp + ".to", "must be an integer tick from \"from\" (" + from + ") to the horizon, got " + describe(w.to)); okW = false; }
          if (okW) ev.every = { period: w.period, from: from, to: to };
        }
      }
      var scope = M.params.map(function (q) { return q.id; }).concat(M.vars.map(function (x) { return x.id; }), ["t"]);
      if (e.when !== undefined) ev.when = exprAt(e, "when", p, scope, error, M, eventHint(NS));
      if (e.once !== undefined) {
        if (typeof e.once !== "boolean") error(p + ".once", "must be true or false, got " + describe(e.once));
        else if (e.when === undefined) error(p + ".once", "is only allowed with when");
      }
      if (e.set !== undefined) {
        if (!isObject(e.set)) error(p + ".set", "must be an object of variable id → expression, got " + describe(e.set));
        else {
          var keys = Object.keys(e.set);
          if (keys.length < 1 || keys.length > 8) error(p + ".set", "must set 1–8 variables, got " + keys.length);
          keys.forEach(function (k) {
            var vr = varById(M, k);
            if (!vr) { error(p + ".set." + k, "\"" + k + "\" is not a variable" + (NS[k] ? " (it is a " + NS[k] + "; only variables can be set)" : "")); return; }
            vr.changed = true;
            var c = exprAt(e.set, k, p + ".set", scope, error, M, eventHint(NS));
            if (c) ev.set.push({ v: vr, c: c, path: p + ".set." + k });
          });
        }
      }
      if (okId && kinds.length === 1 && (ev.at || ev.every || ev.when)) out.push(ev);
      else M.ok = false;
    });
    return out;
  }
  function eventHint(NS) {
    return function (id) { return NS[id] === "event" || NS[id] === "scenario event" ? "uses event \"" + id + "\"; event conditions and set values may use parameters, variables and t, not other events" : null; };
  }

  function checkEvents(data, M, NS, error) {
    if (data.events === undefined) return;
    if (!requireArray(data, "events", "$", 0, 24, error)) { M.ok = false; return; }
    M.events = checkEventList(data.events, "events", M, NS, null, error);
  }

  function checkScenarios(data, M, NS, error) {
    var ids = [];
    if (!requireArray(data, "scenarios", "$", 1, 6, error)) { M.ok = false; return ids; }
    data.scenarios.forEach(function (s, i) {
      var p = "scenarios[" + i + "]";
      if (!isObject(s)) { error(p, "must be an object, got " + describe(s)); M.ok = false; return; }
      var okId = requireString(s, "id", p, 1, 40, error);
      if (okId && !KEBAB.test(s.id)) { error(p + ".id", "\"" + s.id + "\" must be kebab-case (lowercase letters, digits and single hyphens)"); okId = false; }
      if (okId && ids.indexOf(s.id) !== -1) { error(p + ".id", "\"" + s.id + "\" is already used by another scenario"); okId = false; }
      requireString(s, "label", p, 1, 24, error);
      optionalString(s, "description", p, 240, error);
      var sc = { id: s.id, params: {}, events: [], path: p };
      if (s.parameters !== undefined) {
        if (!isObject(s.parameters)) error(p + ".parameters", "must be an object of parameter id → number, got " + describe(s.parameters));
        else Object.keys(s.parameters).forEach(function (k) {
          var q = paramById(M, k), x = s.parameters[k], kp = p + ".parameters." + k;
          if (!q) { error(kp, "\"" + k + "\" is not a parameter" + (NS[k] ? " (it is a " + NS[k] + ")" : "") + "; a scenario can only set parameters"); return; }
          if (typeof x !== "number" || !isFinite(x)) { error(kp, "must be a number, got " + describe(x)); return; }
          if (x < q.min || x > q.max) { error(kp, "must be between min (" + q.min + ") and max (" + q.max + ") of parameter \"" + k + "\", got " + x); return; }
          sc.params[k] = x;
        });
      }
      if (s.events !== undefined && requireArray(s, "events", p, 0, 24, error)) sc.events = checkEventList(s.events, p + ".events", M, NS, {}, error);
      if (okId) { ids.push(s.id); M.scen.push(sc); }
      else M.ok = false;
    });
    return ids;
  }

  function checkRules(data, M, NS, error) {
    // events of scenarios are checked later; their ids are still valid inside rules
    var scenEventIds = [];
    (Array.isArray(data.scenarios) ? data.scenarios : []).forEach(function (s) {
      if (isObject(s) && Array.isArray(s.events)) s.events.forEach(function (e) { if (isObject(e) && typeof e.id === "string" && IDENT.test(e.id) && scenEventIds.indexOf(e.id) === -1 && !NS.hasOwnProperty(e.id)) scenEventIds.push(e.id); });
    });
    if (!requireArray(data, "rules", "$", 1, 48, error)) { M.ok = false; return; }
    var rootEventIds = Object.keys(NS).filter(function (k) { return NS[k] === "event"; });
    var scope = M.params.map(function (q) { return q.id; }).concat(M.vars.map(function (x) { return x.id; }), rootEventIds, scenEventIds, ["t"]);
    data.rules.forEach(function (r, i) {
      var p = "rules[" + i + "]";
      if (!isObject(r)) { error(p, "must be an object, got " + describe(r)); M.ok = false; return; }
      optionalString(r, "label", p, 60, error);
      optionalString(r, "note", p, 240, error);
      var vr = null;
      if (requireString(r, "target", p, 1, 24, error)) {
        vr = varById(M, r.target);
        if (!vr) error(p + ".target", "\"" + r.target + "\" is not a variable" + (NS[r.target] ? " (it is a " + NS[r.target] + "; only variables can be updated)" : "") + " (variables: " + M.vars.map(function (x) { return x.id; }).join(", ") + ")");
        else vr.changed = true;
      }
      var c = exprAt(r, "expr", p, scope, error, M, null);
      var w = r.when !== undefined ? exprAt(r, "when", p, scope, error, M, null) : null;
      if (vr && c && (r.when === undefined || w)) M.rules.push({ v: vr, c: c, when: w, path: p });
      else M.ok = false;
    });
  }

  function checkSection(s, p, seen, M, NS, scenIds, T, kinds, error) {
    if (!isObject(s)) { error(p, "must be an object, got " + describe(s)); return 0; }
    if (requireString(s, "id", p, 1, 40, error)) {
      if (!KEBAB.test(s.id)) error(p + ".id", "\"" + s.id + "\" must be kebab-case (lowercase letters, digits and single hyphens)");
      else if (seen[s.id]) error(p + ".id", "\"" + s.id + "\" is already used by another section");
      else seen[s.id] = true;
    }
    optionalString(s, "kicker", p, 40, error);
    requireString(s, "title", p, 1, 100, error);
    if (requireStringArray(s, "body", p, 1, 6, 900, error)) s.body.forEach(function (t, i) { T(t, p + ".body[" + i + "]"); });
    if (s.controls !== undefined && requireArray(s, "controls", p, 1, s.bench === true ? 16 : 6, error)) {
      s.controls.forEach(function (id, i) {
        if (typeof id !== "string" || !paramById(M, id)) error(p + ".controls[" + i + "]", describe(id) + " is not a parameter id" + (M.params.length ? " (parameters: " + M.params.map(function (q) { return q.id; }).join(", ") + ")" : " (there are no parameters)"));
      });
    }
    if (s["goto"] !== undefined) {
      var g = s["goto"], gp = p + ".goto";
      if (!isObject(g)) error(gp, "must be an object, got " + describe(g));
      else {
        requireString(g, "label", gp, 1, 40, error);
        if (!isInt(g.tick) || g.tick < 0 || (M.H && g.tick > M.H)) error(gp + ".tick", "must be an integer tick from 0 to the horizon" + (M.H ? " (" + M.H + ")" : "") + ", got " + describe(g.tick));
        if (g.scenario !== undefined && scenIds.indexOf(g.scenario) === -1) error(gp + ".scenario", describe(g.scenario) + " is not a scenario id (scenarios: " + scenIds.join(", ") + ")");
        if (g.window !== undefined) {
          var wl = (M.windows || []).concat(["All"]);
          if (wl.indexOf(g.window) === -1) error(gp + ".window", describe(g.window) + " is not a clock window label (windows: " + wl.join(", ") + ")");
        }
      }
    }
    var modes = ["steps", "scrub", "bench"].filter(function (k) { return s[k] !== undefined && s[k] !== false; });
    if (modes.length > 1) error(p, "may have only one of steps, scrub and bench, got " + modes.join(" and "));
    if (s.focus !== undefined) varList(s, "focus", p, 1, 12, M, NS, error);
    if (s.bench !== undefined && typeof s.bench !== "boolean") error(p + ".bench", "must be true or false, got " + describe(s.bench));
    var winOk = function (o, op) { if (o.window !== undefined) { var wl = (M.windows || []).concat(["All"]); if (wl.indexOf(o.window) === -1) error(op + ".window", describe(o.window) + " is not a clock window label (windows: " + wl.join(", ") + ")"); } };
    var scenOk = function (o, op) { if (o.scenario !== undefined && scenIds.indexOf(o.scenario) === -1) error(op + ".scenario", describe(o.scenario) + " is not a scenario id (scenarios: " + scenIds.join(", ") + ")"); };
    var tickOk = function (o, key, op, lo, hi) { if (!isInt(o[key]) || o[key] < lo || o[key] > hi) { error(op + "." + key, "must be an integer tick from " + lo + " to " + hi + ", got " + describe(o[key])); return false; } return true; };
    if (s.steps !== undefined && requireArray(s, "steps", p, 1, 10, error)) {
      s.steps.forEach(function (st, i) {
        var sp = p + ".steps[" + i + "]";
        if (!isObject(st)) { error(sp, "must be an object, got " + describe(st)); return; }
        requireString(st, "title", sp, 1, 80, error);
        if (requireString(st, "text", sp, 1, 600, error)) T(st.text, sp + ".text");
        tickOk(st, "at", sp, 0, M.H || 0);
        scenOk(st, sp); winOk(st, sp);
        if (st.focus !== undefined) varList(st, "focus", sp, 1, 12, M, NS, error);
      });
    }
    if (s.scrub !== undefined) {
      var sc = s.scrub, sp2 = p + ".scrub";
      if (!isObject(sc)) error(sp2, "must be an object with from, to and marks, got " + describe(sc));
      else {
        var okF = tickOk(sc, "from", sp2, 0, M.H || 0), okT = tickOk(sc, "to", sp2, 0, M.H || 0);
        if (okF && okT && sc.to <= sc.from) error(sp2 + ".to", "must be greater than from (" + sc.from + "), got " + sc.to);
        scenOk(sc, sp2); winOk(sc, sp2);
        if (sc.screens !== undefined && !(isInt(sc.screens) && sc.screens >= 2 && sc.screens <= 10)) error(sp2 + ".screens", "must be an integer from 2 to 10, got " + describe(sc.screens));
        if (sc.marks !== undefined && requireArray(sc, "marks", sp2, 1, 12, error)) {
          var prevAt = -1;
          sc.marks.forEach(function (m, i) {
            var mp = sp2 + ".marks[" + i + "]";
            if (!isObject(m)) { error(mp, "must be an object, got " + describe(m)); return; }
            if (okF && okT && sc.to > sc.from && tickOk(m, "at", mp, sc.from, sc.to)) { if (m.at <= prevAt) error(mp + ".at", "must be later than the previous mark (" + prevAt + "), got " + m.at); prevAt = m.at; }
            if (requireString(m, "text", mp, 1, 300, error)) T(m.text, mp + ".text");
          });
        }
      }
    }
    var n = 0;
    if (s.figures !== undefined && requireArray(s, "figures", p, 1, 4, error)) {
      n = s.figures.length;
      s.figures.forEach(function (f, i) { checkFigure(f, p + ".figures[" + i + "]", M, NS, scenIds, T, kinds, error); });
    }
    if (s.check !== undefined) checkCheck(s.check, p + ".check", M, scenIds, s["goto"], T, error);
    return n;
  }

  function checkCheck(c, p, M, scenIds, go, T, error) {
    if (!isObject(c)) { error(p, "must be an object, got " + describe(c)); return; }
    requireString(c, "prompt", p, 1, 240, error);
    if (requireArray(c, "options", p, 2, 5, error)) {
      var correct = 0;
      c.options.forEach(function (o, i) {
        var op = p + ".options[" + i + "]";
        if (!isObject(o)) { error(op, "must be an object, got " + describe(o)); return; }
        requireString(o, "text", op, 1, 160, error);
        if (requireString(o, "why", op, 1, 400, error)) T(o.why, op + ".why");
        if (o.correct !== undefined && typeof o.correct !== "boolean") error(op + ".correct", "must be true or false, got " + describe(o.correct));
        if (o.correct === true) correct++;
      });
      if (correct !== 1) error(p + ".options", "must have exactly one option with \"correct\": true, got " + correct);
    }
    if (c.reveal !== undefined && requireString(c, "reveal", p, 1, 500, error)) T(c.reveal, p + ".reveal");
    if (c.expect !== undefined) {
      var x = c.expect, xp = p + ".expect";
      if (!isObject(x)) { error(xp, "must be an object with scenario, at and test, got " + describe(x)); return; }
      var sid = x.scenario !== undefined ? x.scenario : (isObject(go) && go.scenario !== undefined ? go.scenario : scenIds[0]);
      var sc = null;
      M.scen.forEach(function (s) { if (s.id === sid) sc = s; });
      if (x.scenario !== undefined && scenIds.indexOf(x.scenario) === -1) error(xp + ".scenario", describe(x.scenario) + " is not a scenario id (scenarios: " + scenIds.join(", ") + ")");
      var okAt = isInt(x.at) && x.at >= 0 && (!M.H || x.at <= M.H);
      if (!okAt) error(xp + ".at", "must be an integer tick from 0 to the horizon" + (M.H ? " (" + M.H + ")" : "") + ", got " + describe(x.at));
      var scope = M.params.map(function (q) { return q.id; }).concat(M.vars.map(function (v) { return v.id; }), ["t"]);
      var cc = exprAt(x, "test", xp, scope, error, M, null);
      if (cc && sc && okAt) M.expects.push({ fn: cc.fn, ids: cc.ids, scenario: sc, at: x.at, src: x.test, path: xp + ".test" });
    }
  }

  function checkFigure(f, p, M, NS, scenIds, T, kinds, error) {
    if (!isObject(f)) { error(p, "must be an object, got " + describe(f)); return; }
    if (!requireEnum(f, "kind", p, KINDS, error)) return;
    kinds[f.kind] = (kinds[f.kind] || 0) + 1;
    optionalString(f, "title", p, 80, error);
    if (f.caption !== undefined && requireString(f, "caption", p, 1, 300, error)) T(f.caption, p + ".caption");
    checkNumberFields(f, p, error);
    function varRef(o, key, op) {
      var id = o[key];
      if (typeof id !== "string" || !varById(M, id)) { error(op + "." + key, describe(id) + " is not a variable id" + (NS[id] ? " (it is a " + NS[id] + "; figures show variables)" : "") + " (variables: " + M.vars.map(function (x) { return x.id; }).join(", ") + ")"); return null; }
      return varById(M, id);
    }
    function seriesList(min, max) {
      if (!requireArray(f, "series", p, min, max, error)) return;
      f.series.forEach(function (s, i) {
        var sp = p + ".series[" + i + "]";
        if (!isObject(s)) { error(sp, "must be an object, got " + describe(s)); return; }
        varRef(s, "var", sp);
        optionalString(s, "label", sp, 30, error);
        optionalEnum(s, "color", sp, HUES, error);
        if (s.dashed !== undefined && typeof s.dashed !== "boolean") error(sp + ".dashed", "must be true or false, got " + describe(s.dashed));
      });
    }
    function scenList(key, min) {
      if (f[key] === undefined) return;
      if (!requireArray(f, key, p, min, 6, error)) return;
      var seen = {};
      f[key].forEach(function (id, i) {
        if (scenIds.indexOf(id) === -1) error(p + "." + key + "[" + i + "]", describe(id) + " is not a scenario id (scenarios: " + scenIds.join(", ") + ")");
        else if (seen[id]) error(p + "." + key + "[" + i + "]", "\"" + id + "\" is listed twice");
        seen[id] = true;
      });
    }
    function optNum(key) { if (f[key] !== undefined) requireNumber(f, key, p, error); }
    function optBool(key) { if (f[key] !== undefined && typeof f[key] !== "boolean") error(p + "." + key, "must be true or false, got " + describe(f[key])); }
    switch (f.kind) {
      case "line": case "step": case "area":
        seriesList(1, 6);
        optNum("yMin"); optNum("yMax");
        if (typeof f.yMin === "number" && typeof f.yMax === "number" && f.yMax <= f.yMin) error(p + ".yMax", "must be greater than yMin (" + f.yMin + "), got " + f.yMax);
        optionalString(f, "yLabel", p, 30, error);
        optBool("markers");
        if (f.kind === "area") optBool("stacked"); else if (f.stacked !== undefined) error(p + ".stacked", "is only allowed on an area figure");
        if (f.thresholds !== undefined && requireArray(f, "thresholds", p, 1, 3, error)) f.thresholds.forEach(function (h, i) {
          var hp = p + ".thresholds[" + i + "]";
          if (!isObject(h)) { error(hp, "must be an object, got " + describe(h)); return; }
          if (typeof h.value === "string") { if (!paramById(M, h.value)) error(hp + ".value", "\"" + h.value + "\" is not a parameter id; a threshold value is a number or a parameter id"); }
          else requireNumber(h, "value", hp, error);
          requireString(h, "label", hp, 1, 30, error);
          optionalEnum(h, "color", hp, HUES, error);
        });
        break;
      case "bar":
        if (requireArray(f, "bars", p, 1, 12, error)) f.bars.forEach(function (b, i) {
          var bp = p + ".bars[" + i + "]";
          if (!isObject(b)) { error(bp, "must be an object, got " + describe(b)); return; }
          varRef(b, "var", bp);
          optionalString(b, "label", bp, 30, error);
          optionalEnum(b, "color", bp, HUES, error);
        });
        optNum("max");
        if (typeof f.max === "number" && f.max <= 0) error(p + ".max", "must be greater than 0, got " + f.max);
        break;
      case "stacked":
        seriesList(2, 6);
        if (f.bucket !== undefined && (!isInt(f.bucket) || f.bucket < 1 || (M.H && f.bucket > M.H))) error(p + ".bucket", "must be an integer number of ticks from 1 to the horizon, got " + describe(f.bucket));
        optionalEnum(f, "agg", p, ["sum", "mean", "last"], error);
        optionalString(f, "yLabel", p, 30, error);
        break;
      case "gauge":
        var gv = varRef(f, "var", p);
        optNum("min"); optNum("max");
        optionalString(f, "label", p, 30, error);
        var gmin = typeof f.min === "number" ? f.min : gv && isFinite(gv.lo) ? gv.lo : 0;
        var gmax = typeof f.max === "number" ? f.max : gv && isFinite(gv.hi) ? gv.hi : null;
        if (gv && gmax === null) error(p + ".max", "is required when variable \"" + gv.id + "\" has no max");
        else if (gmax !== null && gmax <= gmin) error(p + ".max", "must be greater than the gauge minimum (" + gmin + "), got " + gmax);
        if (f.zones !== undefined && requireArray(f, "zones", p, 1, 4, error)) {
          var prev = gmin;
          f.zones.forEach(function (z, i) {
            var zp = p + ".zones[" + i + "]";
            if (!isObject(z)) { error(zp, "must be an object, got " + describe(z)); return; }
            if (typeof z.to === "string") { if (!paramById(M, z.to)) error(zp + ".to", "\"" + z.to + "\" is not a parameter id; a zone end is a number or a parameter id"); }
            else if (requireNumber(z, "to", zp, error)) { if (z.to <= prev) error(zp + ".to", "must be greater than the previous zone end (" + prev + "), got " + z.to); else prev = z.to; }
            requireEnum(z, "color", zp, HUES, error);
            requireString(z, "label", zp, 1, 20, error);
          });
        }
        break;
      case "tile":
        if (requireArray(f, "items", p, 1, 4, error)) f.items.forEach(function (it, i) {
          var ip = p + ".items[" + i + "]";
          if (!isObject(it)) { error(ip, "must be an object, got " + describe(it)); return; }
          varRef(it, "var", ip);
          optionalString(it, "label", ip, 30, error);
          checkNumberFields(it, ip, error);
          optionalEnum(it, "delta", ip, ["start", "tick", "none"], error);
          optionalEnum(it, "better", ip, ["up", "down"], error);
          optionalEnum(it, "color", ip, HUES, error);
        });
        optBool("sparkline");
        break;
      case "events":
        if (f.events !== undefined && requireArray(f, "events", p, 1, 12, error)) f.events.forEach(function (id, i) {
          if (typeof id !== "string" || (NS[id] !== "event" && NS[id] !== "scenario event")) error(p + ".events[" + i + "]", describe(id) + " is not an event id");
        });
        break;
      case "calc":
        if (f.targets !== undefined && requireArray(f, "targets", p, 1, 24, error)) f.targets.forEach(function (id, i) {
          var vr = varById(M, id);
          if (!vr) error(p + ".targets[" + i + "]", describe(id) + " is not a variable id");
          else if (!M.rules.some(function (r) { return r.v === vr; })) error(p + ".targets[" + i + "]", "variable \"" + id + "\" has no rule, so there is no calculation to show");
        });
        optBool("showEvents");
        break;
      case "compare":
        varRef(f, "var", p);
        scenList("scenarios", 2);
        if (f.scenarios === undefined && scenIds.length < 2) error(p, "needs at least two scenarios to compare; the document has " + scenIds.length);
        optNum("yMin"); optNum("yMax");
        break;
      case "flow":
        if (f.targets !== undefined && requireArray(f, "targets", p, 1, 16, error)) f.targets.forEach(function (id, i) {
          var vr = varById(M, id);
          if (!vr) error(p + ".targets[" + i + "]", describe(id) + " is not a variable id");
          else if (!M.rules.some(function (r) { return r.v === vr; })) error(p + ".targets[" + i + "]", "variable \"" + id + "\" has no rule, so there is no calculation to show");
        });
        break;
      case "state":
        varList(f, "vars", p, 1, 16, M, NS, error);
        break;
      case "heatmap":
        varRef(f, "var", p);
        scenList("scenarios", 1);
        if (f.buckets !== undefined && (!isInt(f.buckets) || f.buckets < 6 || f.buckets > 96)) error(p + ".buckets", "must be an integer from 6 to 96, got " + describe(f.buckets));
        optionalEnum(f, "agg", p, ["mean", "max", "last"], error);
        optNum("max");
        break;
    }
  }

  /* text mark-up: **bold**, `code`, ((term)) or ((shown|term)), {id} or {id|format} */
  function textChecker(gloss, NS, error) {
    return function (s, p) {
      if (typeof s !== "string") return;
      var re = /\(\(([^)]+)\)\)/g, m;
      while ((m = re.exec(s))) {
        var parts = m[1].split("|"), term = parts[parts.length - 1].trim().toLowerCase();
        if (!gloss.hasOwnProperty(term)) error(p, "((" + m[1] + ")) names \"" + parts[parts.length - 1].trim() + "\", which is not a glossary term");
        else gloss[term].used = true;
      }
      var pre = /\{([^{}]*)\}/g;
      while ((m = pre.exec(s))) {
        var bits = m[1].split("|"), id = bits[0].trim();
        if (id !== "t" && NS[id] !== "parameter" && NS[id] !== "variable") error(p, "placeholder {" + m[1] + "} names \"" + id + "\", which is not a variable, a parameter or t");
        if (bits.length > 2 || (bits.length === 2 && FORMATS.indexOf(bits[1].trim()) === -1)) error(p, "placeholder {" + m[1] + "} has an unknown format (formats: " + FORMATS.join(", ") + ")");
      }
    };
  }

  function varList(o, key, p, min, max, M, NS, error) {
    if (!requireArray(o, key, p, min, max, error)) return;
    var seen = {};
    o[key].forEach(function (id, i) {
      var ip = p + "." + key + "[" + i + "]";
      if (typeof id !== "string" || !varById(M, id)) error(ip, describe(id) + " is not a variable id" + (NS[id] ? " (it is a " + NS[id] + ")" : ""));
      else if (seen[id]) error(ip, "\"" + id + "\" is listed twice");
      seen[id] = true;
    });
  }
  function varById(M, id) { for (var i = 0; i < M.vars.length; i++) if (M.vars[i].id === id) return M.vars[i]; return null; }
  function paramById(M, id) { for (var i = 0; i < M.params.length; i++) if (M.params[i].id === id) return M.params[i]; return null; }

  function exprAt(obj, key, p, scope, error, M, explain) {
    var path = p + "." + key, src = obj[key];
    if (typeof src === "number") { if (!isFinite(src)) { error(path, "must be a finite number or an expression string"); return null; } src = String(src); }
    if (typeof src !== "string" || !src.trim()) { error(path, "must be an expression (a string such as \"tokens + 1\") or a number, got " + describe(obj[key])); return null; }
    var c = compileExpr(src);
    if (c.error) { error(path, "could not parse \"" + src + "\": " + c.error); return null; }
    var ok = true;
    c.ids.forEach(function (id) {
      if (scope.indexOf(id) !== -1) { var q = paramById(M, id); if (q) q.used = true; return; }
      var why = explain ? explain(id) : null;
      error(path, why || "uses unknown identifier \"" + id + "\" (known here: " + scope.join(", ") + ")");
      ok = false;
    });
    return ok ? c : null;
  }

  // ---- the simulation engine (same semantics as assets/view.js) ----------
  function scenarioParams(M, sc, tweaks) {
    var o = {};
    M.params.forEach(function (q) { o[q.id] = tweaks && tweaks.hasOwnProperty(q.id) ? tweaks[q.id] : sc.params.hasOwnProperty(q.id) ? sc.params[q.id] : q.def; });
    return o;
  }
  function clampTo(v, x) { return x < v.lo ? v.lo : x > v.hi ? v.hi : x; }
  function simulate(M, sc, params) {
    var H = M.H, env = {}, bad = {}, fired = {}, vals = {}, active = M.events.concat(sc.events), firedOnce = {};
    noiseSeed = M.seed;
    M.params.forEach(function (q) { env[q.id] = params[q.id]; });
    M.events.forEach(function (e) { env[e.id] = 0; });
    M.scen.forEach(function (s) { s.events.forEach(function (e) { env[e.id] = 0; }); });
    active.forEach(function (e) { fired[e.id] = new Uint8Array(H + 1); });
    env.t = 0;
    function num(x, path) { if (typeof x !== "number" || !isFinite(x)) { if (!bad.hasOwnProperty(path)) bad[path] = x; return 0; } return x; }
    M.vars.forEach(function (v) { vals[v.id] = new Float64Array(H + 1); env[v.id] = clampTo(v, num(v.init.fn(env), v.path + ".initial")); vals[v.id][0] = env[v.id]; });
    for (var k = 1; k <= H; k++) {
      env.t = k;
      for (var a = 0; a < active.length; a++) env[active[a].id] = 0;
      for (var j = 0; j < active.length; j++) {
        var e = active[j], go = false;
        if (e.at) go = e.at[k] === true;
        else if (e.every) go = k >= e.every.from && k <= e.every.to && (k - e.every.from) % e.every.period === 0;
        else if (!(e.once && firedOnce[e.id])) go = !!num(e.when.fn(env), e.path + ".when");
        if (!go) continue;
        env[e.id] = 1; fired[e.id][k] = 1; firedOnce[e.id] = true;
        for (var s = 0; s < e.set.length; s++) env[e.set[s].v.id] = clampTo(e.set[s].v, num(e.set[s].c.fn(env), e.set[s].path));
      }
      for (var r = 0; r < M.rules.length; r++) {
        var rule = M.rules[r];
        if (rule.when && !num(rule.when.fn(env), rule.path + ".when")) continue;
        env[rule.v.id] = clampTo(rule.v, num(rule.c.fn(env), rule.path + ".expr"));
      }
      for (var i = 0; i < M.vars.length; i++) vals[M.vars[i].id][k] = env[M.vars[i].id];
    }
    return { vals: vals, fired: fired, params: params, bad: bad };
  }
  function envAt(M, sc, run, k) {
    var env = { t: k };
    M.params.forEach(function (q) { env[q.id] = run.params[q.id]; });
    M.vars.forEach(function (v) { env[v.id] = run.vals[v.id][k]; });
    return env;
  }

  /* ---- expression compiler (shared shape with assets/view.js) ---- */
  var noiseSeed = 1;
  function noise(x) {
    var h = Math.imul((Math.floor(x * 1000) | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(noiseSeed | 0, 0xc2b2ae35);
    h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15; h = Math.imul(h, 0x846ca68b); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
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
      var n = a.length;
      var f = {
        min: function (env) { var r = a[0](env); for (var j = 1; j < n; j++) { var x = a[j](env); if (x < r) r = x; } return r; },
        max: function (env) { var r = a[0](env); for (var j = 1; j < n; j++) { var x = a[j](env); if (x > r) r = x; } return r; },
        abs: function (env) { return Math.abs(a[0](env)); },
        sqrt: function (env) { return Math.sqrt(a[0](env)); },
        pow: function (env) { return Math.pow(a[0](env), a[1](env)); },
        exp: function (env) { return Math.exp(a[0](env)); },
        log: function (env) { return Math.log(a[0](env)); },
        floor: function (env) { return Math.floor(a[0](env) + 1e-9); },
        ceil: function (env) { return Math.ceil(a[0](env) - 1e-9); },
        round: function (env) { return Math.round(a[0](env)); },
        clamp: function (env) { return Math.min(a[2](env), Math.max(a[1](env), a[0](env))); },
        "if": function (env) { return a[0](env) ? a[1](env) : a[2](env); },
        noise: function (env) { return noise(a[0](env)); }
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

  function fmtNum(x) { return typeof x === "number" && isFinite(x) ? String(Math.round(x * 1e6) / 1e6) : String(x); }

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
  function isObject(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
  function isInt(v) { return typeof v === "number" && isFinite(v) && Math.floor(v) === v; }
  function optionalString(obj, key, parent, max, error) {
    if (obj[key] === undefined) return true;
    return requireString(obj, key, parent, 1, max, error);
  }
  function requireNumber(obj, key, parent, error) {
    var v = obj[key];
    if (typeof v !== "number" || !isFinite(v)) { error(join(parent, key), "must be a finite number, got " + describe(v)); return 0; }
    return 1;
  }
  function requireEnum(obj, key, parent, list, error) {
    var v = obj[key];
    if (list.indexOf(v) === -1) { error(join(parent, key), "must be one of " + list.join(", ") + ", got " + describe(v)); return false; }
    return true;
  }
  function optionalEnum(obj, key, parent, list, error) {
    if (obj[key] === undefined) return true;
    return requireEnum(obj, key, parent, list, error);
  }
  function requireStringArray(obj, key, parent, min, max, len, error) {
    if (!requireArray(obj, key, parent, min, max, error)) return false;
    var ok = true;
    obj[key].forEach(function (s, i) {
      var path = join(parent, key) + "[" + i + "]";
      if (typeof s !== "string") { error(path, "must be a string, got " + describe(s)); ok = false; }
      else if (!s.trim()) { error(path, "must be a non-empty string"); ok = false; }
      else if (s.length > len) { error(path, "must be at most " + len + " characters, got " + s.length); ok = false; }
    });
    return ok;
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
