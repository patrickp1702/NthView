/* NthView — game validator — schemaVersion 1
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
  /* the engines in assets/engine-<name>.js (AGENTS.md §5.6) */
  var GAMES = ["islands", "runner", "stealth"];
  /* world dressing per game: world.<game> */
  var ISLAND_THEMES = ["lagoon", "aurora", "canyon", "snow"];
  var ISLAND_SCENERY = ["grove", "tower", "arena", "workshop", "canyon", "hall", "clock", "plain"];
  var RUNNER_THEMES = ["jungle", "haunted", "sand", "ice"];
  var CHASERS = ["monkey", "ghost", "jackal", "yeti"];
  var RUNNER_SCENERY = ["causeway", "canopy", "ruins", "cliffs", "waterfall", "bridges", "tunnel", "courtyard"];
  var ENCOUNTERS = ["gate", "ghost", "fire", "guardian", "bridge", "monkey", "vines", "idol", "ropebridge", "serpent"];
  var HAZARDS = ["none", "light", "normal", "heavy"];
  var STEALTH_THEMES = ["warehouse", "bunker", "lab", "rooftop"];
  var ROOMS = ["corridors", "pillars", "offices", "yard"];
  var BOSSES = ["sentinel", "sprinter", "brute", "warden"];
  var REWARDS = ["sprint", "knife", "smoke", "vest", "grenade", "pot"];
  var SOLDIERS = ["rookie", "rifleman", "scout", "blade", "sniper", "heavy", "shield", "officer", "drone", "medic", "prowler"];
  /* scored questions answered in the panel */
  var PANEL_SCORED = ["choice", "truefalse", "multi", "cloze", "order", "match", "sort", "rank", "estimate", "number", "text", "odd", "hotspot", "pads", "predict", "confidence"];
  /* explorations shown in the panel; they need a quiz */
  var PANEL_EXPLORE = ["compare", "bars", "switches", "flashcards", "story", "tune", "race"];
  /* scored tasks played in the world (each engine plays them its own way, or as a card) */
  var ROOM_SCORED = ["lanes", "gates", "torches", "planks", "harvest", "levers", "tiles"];
  /* the one world exploration (a vote); it needs a quiz */
  var ROOM_EXPLORE = ["collect"];
  var ACTIVITY_TYPES = PANEL_SCORED.concat(PANEL_EXPLORE, ROOM_SCORED, ROOM_EXPLORE);
  var REPLACES_QUIZ = PANEL_SCORED.concat(ROOM_SCORED);
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
    F(data, "$", "title:s1-60 subtitle:s160 strictMode:b?", error);
    requireEnum(data, "game", "$", GAMES, error);
    if (requireObject(data, "hero", "$", error)) F(data.hero, "hero", "name:s1-20", error);
    optionalInt(data, "lives", "$", 1, 9, error);
    if (requireObject(data, "intro", "$", error)) F(data.intro, "intro", "paragraphs:S1-4x400 steps:S?0-5x300 note:s300", error);

    var ids = [];
    if (requireArray(data, "levels", "$", 1, 500, error)) {
      var types = {};
      data.levels.forEach(function (st, i) {
        checkLevel(st, "levels[" + i + "]", ids, error, warn);
        if (st && st.activity && st.activity.type) types[st.activity.type] = true;
      });
      var n = data.levels.length;
      if (n < 3) warn("levels", "only " + n + " level(s); 5–7 make a fuller game");
      if (n > 60) warn("levels", n + " levels is a very long game (over 60); it works, but consider splitting the topic into a lesson");
      var typeCount = Object.keys(types).length;
      if (n >= 6 && typeCount <= 2) warn("levels", "only " + typeCount + " activity type(s) across " + n + " levels; mix in more types for variety");
    }
    if (data.world !== undefined && isObject(data.world, "world", error)) checkWorld(data.world, ids, error);

    if (requireObject(data, "finale", "$", error)) {
      var f = data.finale;
      F(f, "finale", "name:s1-40 lead:s1-400", error);
      if (requireArray(f, "questions", "finale", 1, 200, error)) {
        f.questions.forEach(function (q, i) { checkQuiz(q, "finale.questions[" + i + "]", error, warn); });
        if (optionalInt(f, "ask", "finale", 1, 50, error) && f.ask !== undefined && f.ask > f.questions.length) {
          warn("finale.ask", "asks for " + f.ask + " questions but the pool has " + f.questions.length + "; all " + f.questions.length + " will be asked");
        }
      } else {
        optionalInt(f, "ask", "finale", 1, 50, error);
      }
    }

    if (requireObject(data, "report", "$", error)) {
      var r = data.report;
      F(r, "report", "heading:s1-60 lessons:S1-40x200 glossaryIntro:s200", error);
      if (r.tiers !== undefined && isObject(r.tiers, "report.tiers", error)) F(r.tiers, "report.tiers", "perfect:s200 great:s200 pass:s200", error);
      if (r.glossaryColumns !== undefined) {
        if (!Array.isArray(r.glossaryColumns) || r.glossaryColumns.length !== 2) {
          error("report.glossaryColumns", "must be an array of exactly 2 strings, got " + describe(r.glossaryColumns));
        } else {
          r.glossaryColumns.forEach(function (c, i) { checkStr(c, "report.glossaryColumns[" + i + "]", 1, 30, error); });
        }
      }
      if (r.glossary !== undefined) each(r, "glossary", "report", 0, 40, "term:s1-60 meaning:s1-120", error);
      if (r.source !== undefined && isObject(r.source, "report.source", error)) {
        F(r.source, "report.source", "label:s1-200 note:s300", error);
        if (optionalString(r.source, "url", "report.source", 500, error) && r.source.url !== undefined &&
            !/^https?:\/\/\S+$/.test(r.source.url)) {
          error("report.source.url", "must start with http:// or https://, got " + describe(r.source.url));
        }
      }
    }
  }

  function checkLevel(st, path, ids, error, warn) {
    if (!isObject(st, path, error)) return;
    if (requireString(st, "id", path, 1, 30, error)) {
      if (!KEBAB.test(st.id)) error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(st.id));
      else if (ids.indexOf(st.id) !== -1) error(path + ".id", "duplicate level id " + describe(st.id) + "; ids must be unique");
      else ids.push(st.id);
    }
    F(st, path, "name:s1-40 lead:s1-600 body:S?0-3x600 remember:s1-300", error);
    if (st.color !== undefined && optionalString(st, "color", path, 7, error) && !HEX.test(st.color)) {
      error(path + ".color", "must be a #rrggbb hex colour, got " + describe(st.color));
    }

    var replaces = false, actType = null;
    if (st.activity !== undefined) {
      if (isObject(st.activity, path + ".activity", error)) {
        checkActivity(st.activity, path + ".activity", error, warn);
        actType = st.activity.type; replaces = REPLACES_QUIZ.indexOf(actType) !== -1;
      }
    } else {
      warn(path, "level has no activity; it asks only the quiz");
    }
    if (st.findings !== undefined && isObject(st.findings, path + ".findings", error)) {
      checkFindings(st.findings, path + ".findings", error, warn);
    }
    if (st.aside !== undefined && isObject(st.aside, path + ".aside", error)) F(st.aside, path + ".aside", "title:s1-60 text:s1-600", error);
    if (replaces) {
      if (st.quiz !== undefined) error(path + ".quiz", "must be omitted when activity.type is \"" + actType + "\" (that activity is the question)");
    } else if (st.quiz === undefined) {
      error(path + ".quiz", "is required when the activity is " + (actType ? "\"" + actType + "\"" : "absent") + " (only " + REPLACES_QUIZ.join(", ") + " replace the quiz)");
    } else if (requireObject(st, "quiz", path, error)) {
      checkQuiz(st.quiz, path + ".quiz", error, warn);
    }
    if (st.checks !== undefined && requireArray(st, "checks", path, 1, 10, error)) {
      st.checks.forEach(function (c, j) {
        var p = path + ".checks[" + j + "]";
        if (!isObject(c, p, error)) return;
        if (c.type !== undefined && ACTIVITY_TYPES.indexOf(c.type) !== -1 && PANEL_SCORED.indexOf(c.type) === -1) {
          error(p + ".type", "must be a scored panel type (" + PANEL_SCORED.join(", ") + "); \"" + c.type + "\" can only be the main activity");
          return;
        }
        checkActivity(c, p, error, warn);
      });
    }
  }

  /* world.<game>: optional dressing; every per-level entry is keyed by a level id */
  function checkWorld(w, ids, error) {
    Object.keys(w).forEach(function (g) { if (GAMES.indexOf(g) === -1) error("world." + g, "is not a game; world takes " + GAMES.join(", ")); });
    function enums(o, p, map) { Object.keys(map).forEach(function (k) { if (o[k] !== undefined) requireEnum(o, k, p, map[k], error); }); }
    function game(g, map, extra, levelMap, levelExtra) {
      var o = w[g], path = "world." + g;
      if (o === undefined || !isObject(o, path, error)) return;
      enums(o, path, map); if (extra) extra(o, path);
      if (o.levels === undefined || !isObject(o.levels, path + ".levels", error)) return;
      Object.keys(o.levels).forEach(function (id) {
        var p = path + ".levels." + id;
        if (ids.indexOf(id) === -1) { error(p, "is not a level id (" + (ids.length > 6 ? ids.slice(0, 6).join(", ") + ", …" : ids.join(", ")) + ")"); return; }
        if (isObject(o.levels[id], p, error)) { enums(o.levels[id], p, levelMap); if (levelExtra) levelExtra(o.levels[id], p); }
      });
    }
    game("islands", { theme: ISLAND_THEMES }, null, { scenery: ISLAND_SCENERY });
    game("runner", { theme: RUNNER_THEMES }, function (r, path) {
      if (r.chaser !== undefined && isObject(r.chaser, path + ".chaser", error)) { F(r.chaser, path + ".chaser", "name:s40", error); enums(r.chaser, path + ".chaser", { kind: CHASERS }); }
    }, { scenery: RUNNER_SCENERY, encounter: ENCOUNTERS, hazards: HAZARDS });
    game("stealth", { theme: STEALTH_THEMES }, function (h, path) {
      if (h.guards !== undefined && isObject(h.guards, path + ".guards", error)) F(h.guards, path + ".guards", "name:s40", error);
    }, { room: ROOMS, boss: BOSSES, reward: REWARDS }, function (o, p) {
      var okCount = optionalInt(o, "soldiers", p, 3, 5, error);
      if (o.squad !== undefined && requireArray(o, "squad", p, 3, 5, error)) {
        o.squad.forEach(function (kind, j) { if (SOLDIERS.indexOf(kind) === -1) error(p + ".squad[" + j + "]", "must be one of " + SOLDIERS.join(", ") + "; got " + describe(kind)); });
        if (okCount && o.soldiers !== undefined && o.soldiers !== o.squad.length) error(p + ".soldiers", "is " + o.soldiers + " but squad lists " + o.squad.length + " soldier(s); give one of them or make them agree");
      }
    });
  }

  function checkFindings(f, path, error, warn) {
    F(f, path, "caption:s200 text:s600 after:b?", error);
    each(f, "rows", path, 1, 8, "label:s1-80 value:n0~100 show:s1-12", error, function (row, p) { if (row.style !== undefined) requireEnum(row, "style", p, ROW_STYLES, error); });
    if (f.text === undefined) warn(path, "findings have no explanatory text under the bars");
  }

  /* a Quiz object; also the shape of `choice` (2–6 options, exactly one correct) */
  function checkQuiz(q, path, error, warn) {
    if (!isObject(q, path, error)) return;
    F(q, path, "question:s1-300 okText:s200", error);
    if (each(q, "options", path, 2, 6, "text:s1-200 correct:b? why:s300", error, function (o, p) { if (o.correct !== true && o.why === undefined) warn(p, "wrong option has no \"why\" feedback"); })) exactlyOne(q, path, error);
  }

  function kebabId(it, p, ids, label, error) {
    if (!requireString(it, "id", p, 1, 30, error)) return;
    if (!KEBAB.test(it.id)) error(p + ".id", "must be kebab-case, got " + describe(it.id));
    else if (ids.indexOf(it.id) !== -1) error(p + ".id", "duplicate " + label + " id " + describe(it.id));
    else ids.push(it.id);
  }

  /* field rules in a compact form, checked by the same helpers as everywhere else:
     key:s1-300 string of 1–300 chars; key:s300 optional string; key:S1-6x300 string array (S? optional);
     key:b boolean (b? optional); key:n0~100 number; key:i0~100 integer */
  function F(o, path, spec, error) {
    spec.split(" ").forEach(function (t) {
      var m = t.split(":"), k = m[0], c = m[1].charAt(0), q = m[1].charAt(1) === "?", r = m[1].slice(q ? 2 : 1), v = r.split(/[-x~]/).map(Number);
      if (c === "s") { if (v.length > 1) requireString(o, k, path, v[0], v[1], error); else optionalString(o, k, path, v[0], error); }
      else if (c === "S") (q ? optionalStringArray : requireStringArray)(o, k, path, v[0], v[1], v[2], error);
      else if (c === "b") { if (q) optionalBool(o, k, path, error); else if (typeof o[k] !== "boolean") error(join(path, k), "must be true or false, got " + describe(o[k])); }
      else { v = r.split("~").map(Number); (c === "n" ? requireNumber : requireInt)(o, k, path, v[0], v[1], error); }
    });
  }
  /* an array of objects: length, then each item's fields, then an optional per-item check */
  function each(o, key, path, min, max, spec, error, fn) {
    if (!requireArray(o, key, path, min, max, error)) return false;
    o[key].forEach(function (it, i) { var p = path + "." + key + "[" + i + "]"; if (!isObject(it, p, error)) return; if (spec) F(it, p, spec, error); if (fn) fn(it, p, i); });
    return true;
  }
  /* at least one item with key true and one without */
  function both(o, key, path, flag, label, error) {
    var y = 0, n = 0;
    (o[key] || []).forEach(function (it) { if (it && typeof it === "object") { if (it[flag] === true) y++; else if (it[flag] === false || flag === "correct") n++; } });
    if (y < 1) error(path + "." + key, "at least one " + label + " must have \"" + flag + "\": true, found 0");
    if (n < 1) error(path + "." + key, flag === "correct" ? "at least one option must be wrong (no \"correct\": true), found 0" : "at least one " + label + " must have \"" + flag + "\": false, found 0");
  }
  function exactlyOne(o, path, error) {
    var c = (o.options || []).filter(function (x) { return x && x.correct === true; }).length;
    if (c !== 1) error(path + ".options", "exactly one option must have \"correct\": true, found " + c);
  }

  function checkActivity(a, path, error, warn) {
    if (!requireEnum(a, "type", path, ACTIVITY_TYPES, error)) return;
    optionalString(a, "title", path, 60, error);
    var ids = [], t = a.type, BAR = "label:s1-80 value:n0~100 show:s1-12";
    switch (t) {
      case "choice":
      case "confidence":
        checkQuiz(a, path, error, warn);
        break;
      case "collect":
        F(a, path, "prompt:s1-400", error);
        if (requireStringArray(a, "items", path, 3, 9, 3, error)) {
          var counts = {}, best = 0;
          a.items.forEach(function (it) { counts[it] = (counts[it] || 0) + 1; if (counts[it] > best) best = counts[it]; });
          if (best * 2 <= a.items.length) warn(path + ".items", "no answer is a clear majority; the vote will look like a tie");
        }
        F(a, path, "resultTitle:s60 resultText:s1-200 resultNote:s300", error);
        break;
      case "pads":
        F(a, path, "prompt:s1-400", error);
        each(a, "options", path, 2, 4, null, error, function (o, p) {
          kebabId(o, p, ids, "pad", error);
          F(o, p, "label:s1-12 hint:s300", error);
          if (o.bars !== undefined) {
            if (!Array.isArray(o.bars) || o.bars.length !== 2) error(p + ".bars", "must be an array of exactly 2 numbers, got " + describe(o.bars));
            else o.bars.forEach(function (v, k) { if (typeof v !== "number" || v < 0 || v > 100) error(p + ".bars[" + k + "]", "must be a number from 0 to 100, got " + describe(v)); });
          }
          if (o.size !== undefined && (typeof o.size !== "number" || o.size < 0.5 || o.size > 4)) error(p + ".size", "must be a number from 0.5 to 4, got " + describe(o.size));
        });
        answerId(a, path, ids, "pad", error);
        break;
      case "story":
        F(a, path, "buttonLabel:s1-40 resetLabel:s40 frames:S2-8x300 caption:s300", error);
        break;
      case "tune":
        checkTune(a, path, error, warn);
        break;
      case "race":
        F(a, path, "buttonLabel:s1-40", error);
        each(a, "bars", path, 2, 4, BAR + " tag:s12", error);
        F(a, path, "caption:s300", error);
        break;
      case "truefalse":
        F(a, path, "statement:s1-300 answer:b why:s300 trueLabel:s20 falseLabel:s20", error);
        if (a.why === undefined) warn(path, "truefalse has no \"why\"; a one-line reason helps the learner");
        break;
      case "multi":
        F(a, path, "question:s1-300", error);
        if (each(a, "options", path, 3, 6, "text:s1-200 correct:b? why:s300", error)) both(a, "options", path, "correct", "option", error);
        break;
      case "order":
        F(a, path, "prompt:s1-300", error);
        each(a, "items", path, 3, 7, "text:s1-120 note:s200", error);
        break;
      case "match":
        F(a, path, "prompt:s1-300", error);
        each(a, "pairs", path, 3, 6, "left:s1-80", error, function (pr, p) {
          if (requireString(pr, "right", p, 1, 80, error)) { if (ids.indexOf(pr.right) !== -1) error(p + ".right", "duplicate right-hand text " + describe(pr.right) + "; every right side must be unique or the pairs are ambiguous"); ids.push(pr.right); }
        });
        break;
      case "sort":
        F(a, path, "prompt:s1-300", error);
        groupItems(a, path, "buckets", 2, 4, 30, "items", 3, 10, "text", 80, "bucket", error, warn);
        break;
      case "tiles":
        F(a, path, "prompt:s1-400", error);
        groupItems(a, path, "bins", 2, 3, 16, "items", 3, 8, "label", 12, "bin", error, warn);
        break;
      case "rank":
        F(a, path, "prompt:s1-300", error);
        if (each(a, "items", path, 3, 6, "text:s1-80 value:n0~100 show:s1-12", error)) {
          var vals = a.items.map(function (it) { return it && it.value; });
          for (var vi = 1; vi < vals.length; vi++) if (typeof vals[vi] === "number" && vals[vi] === vals[vi - 1]) { warn(path + ".items", "two neighbouring items share the value " + vals[vi] + "; the ranking between them is a coin toss"); break; }
        }
        F(a, path, "caption:s300", error);
        break;
      case "cloze":
        var gapCount = requireString(a, "text", path, 1, 600, error) ? a.text.split("___").length - 1 : 0;
        if (each(a, "gaps", path, 1, 6, null, error, function (g, p) {
          var okOpts = requireStringArray(g, "options", p, 2, 5, 40, error);
          if (requireInt(g, "answer", p, 0, 100, error) && okOpts && g.answer >= g.options.length) error(p + ".answer", "index " + g.answer + " is out of range (" + g.options.length + " options, valid indexes are 0–" + (g.options.length - 1) + ")");
        }) && typeof a.text === "string" && gapCount !== a.gaps.length) error(path + ".text", "has " + gapCount + " gap marker(s) \"___\" but gaps has " + a.gaps.length + " item(s); they must match");
        break;
      case "estimate":
        F(a, path, "question:s1-300", error);
        var okMin = requireNumber(a, "min", path, -1e9, 1e9, error), okMax = requireNumber(a, "max", path, -1e9, 1e9, error), okAns = requireNumber(a, "answer", path, -1e9, 1e9, error), okTol = requireNumber(a, "tolerance", path, 0, 1e9, error);
        if (okMin && okMax && a.min >= a.max) error(path + ".max", "must be greater than min (" + a.min + "), got " + a.max);
        if (okMin && okMax && okAns && (a.answer < a.min || a.answer > a.max)) error(path + ".answer", "must be between min and max (" + a.min + "–" + a.max + "), got " + a.answer);
        if (okMin && okMax && okTol && a.tolerance >= (a.max - a.min) / 2) warn(path + ".tolerance", "tolerance " + a.tolerance + " covers half the range; almost any guess will pass");
        if (a.step !== undefined && (typeof a.step !== "number" || !(a.step > 0))) error(path + ".step", "must be a number greater than 0, got " + describe(a.step));
        F(a, path, "unit:s12 reveal:s300", error);
        break;
      case "number":
        F(a, path, "question:s1-300 answer:n-1e12~1e12", error);
        if (a.tolerance !== undefined) requireNumber(a, "tolerance", path, 0, 1e12, error);
        F(a, path, "unit:s12 reveal:s300", error);
        break;
      case "text":
        F(a, path, "question:s1-300 answer:s1-80 accept:S?0-12x80 placeholder:s40 reveal:s300", error);
        if (typeof a.answer === "string" && !normText(a.answer)) error(path + ".answer", "must contain at least one letter or digit, got " + describe(a.answer));
        break;
      case "odd":
        F(a, path, "prompt:s1-300", error);
        var okItems = requireStringArray(a, "items", path, 3, 6, 80, error);
        if (requireInt(a, "answer", path, 0, 100, error) && okItems && a.answer >= a.items.length) error(path + ".answer", "index " + a.answer + " is out of range (" + a.items.length + " items, valid indexes are 0–" + (a.items.length - 1) + ")");
        F(a, path, "why:s300", error);
        break;
      case "hotspot":
        checkHotspot(a, path, error, warn);
        break;
      case "lanes":
      case "gates":
        F(a, path, "prompt:s1-400", error);
        checkIdList(a, t === "lanes" ? "options" : "paths", path, 2, 3, 16, error);
        break;
      case "torches":
        F(a, path, "prompt:s1-400", error);
        if (each(a, "items", path, 3, 8, null, error, function (it, p) { kebabId(it, p, ids, "torch", error); F(it, p, "label:s1-16 lit:b", error); })) both(a, "items", path, "lit", "torch", error);
        break;
      case "planks":
        F(a, path, "prompt:s1-400", error);
        if (each(a, "planks", path, 3, 8, "text:s1-80 answer:b why:s300", error, function (pl, p) {
          if (pl.answer === false && pl.why === undefined) warn(p, "false plank has no \"why\"; say what is wrong with the statement");
        })) both(a, "planks", path, "answer", "plank", error);
        break;
      case "harvest":
        F(a, path, "prompt:s1-400", error);
        if (each(a, "items", path, 4, 10, "label:s1-12 belongs:b", error)) both(a, "items", path, "belongs", "item", error);
        break;
      case "levers":
        F(a, path, "prompt:s1-400", error);
        each(a, "items", path, 3, 7, null, error, function (it, p) { kebabId(it, p, ids, "lever", error); F(it, p, "label:s1-12", error); });
        break;
      case "compare":
        F(a, path, "prompt:s300", error);
        ["before", "after"].forEach(function (k) {
          if (!requireObject(a, k, path, error)) return;
          F(a[k], path + "." + k, "label:s1-40 text:s1-400", error);
          each(a[k], "rows", path + "." + k, 1, 5, BAR, error);
        });
        F(a, path, "caption:s300", error);
        break;
      case "bars":
        F(a, path, "prompt:s1-400", error);
        each(a, "items", path, 2, 5, BAR, error);
        F(a, path, "revealText:s300 buttonLabel:s40", error);
        break;
      case "switches":
        checkSwitches(a, path, error, warn);
        break;
      case "predict":
        F(a, path, "question:s1-300", error);
        if (each(a, "options", path, 2, 4, "text:s1-200 correct:b? why:s300", error)) exactlyOne(a, path, error);
        F(a, path, "runLabel:s40 frames:S1-6x300 result:s1-300", error);
        break;
      case "flashcards":
        F(a, path, "prompt:s300", error);
        each(a, "cards", path, 2, 10, "front:s1-120 back:s1-300", error);
        break;
    }
  }

  /* `answer` must be one of the collected ids */
  function answerId(a, path, ids, label, error) {
    if (requireString(a, "answer", path, 1, 30, error) && ids.length && ids.indexOf(a.answer) === -1) {
      error(path + ".answer", describe(a.answer) + " is not one of the " + label + " ids (" + ids.join(", ") + ")");
    }
  }

  /* a list of {id, label[, hint]} objects with a root `answer` that must be one of the ids */
  function checkIdList(a, key, path, min, max, labelMax, error) {
    var ids = [];
    if (requireArray(a, key, path, min, max, error)) {
      a[key].forEach(function (it, i) {
        var p = path + "." + key + "[" + i + "]"; if (!isObject(it, p, error)) return;
        kebabId(it, p, ids, "", error);
        requireString(it, "label", p, 1, labelMax, error);
        optionalString(it, "hint", p, 300, error);
      });
    }
    answerId(a, path, ids, key.replace(/s$/, ""), error);
  }

  /* groups (buckets or bins) and items that each name one group */
  function groupItems(a, path, gKey, gMin, gMax, gLabel, iKey, iMin, iMax, textKey, textMax, refKey, error, warn) {
    var gIds = [];
    if (requireArray(a, gKey, path, gMin, gMax, error)) {
      a[gKey].forEach(function (g, i) {
        var p = path + "." + gKey + "[" + i + "]"; if (!isObject(g, p, error)) return;
        kebabId(g, p, gIds, refKey, error);
        requireString(g, "label", p, 1, gLabel, error);
      });
    }
    if (requireArray(a, iKey, path, iMin, iMax, error)) {
      var used = {};
      a[iKey].forEach(function (it, i) {
        var p = path + "." + iKey + "[" + i + "]"; if (!isObject(it, p, error)) return;
        requireString(it, textKey, p, 1, textMax, error);
        if (requireString(it, refKey, p, 1, 30, error) && gIds.length && gIds.indexOf(it[refKey]) === -1) error(p + "." + refKey, describe(it[refKey]) + " is not one of the " + gKey + " ids (" + gIds.join(", ") + ")");
        used[it[refKey]] = true;
      });
      gIds.forEach(function (id) { if (!used[id]) warn(path + "." + gKey, refKey + " \"" + id + "\" receives no items"); });
    }
  }

  /* a labelled diagram on a 100 × 60 grid built from rectangles and circles */
  function checkHotspot(a, path, error, warn) {
    requireString(a, "prompt", path, 1, 300, error);
    optionalBool(a, "hideLabels", path, error);
    var ids = [];
    if (requireArray(a, "parts", path, 3, 8, error)) {
      /* a diagram: every part has a position, or none has one and the parts are laid out in a ring */
      var placed = a.parts[0] && typeof a.parts[0] === "object" && a.parts[0].x !== undefined;
      a.parts.forEach(function (pt, i) {
        var p = path + ".parts[" + i + "]"; if (!isObject(pt, p, error)) return;
        kebabId(pt, p, ids, "part", error);
        requireString(pt, "label", p, 1, 24, error);
        optionalString(pt, "hint", p, 300, error);
        if (pt.color !== undefined && optionalString(pt, "color", p, 7, error) && !HEX.test(pt.color)) error(p + ".color", "must be a #rrggbb hex colour, got " + describe(pt.color));
        if (!placed) {
          ["shape", "x", "y", "w", "h", "r"].forEach(function (k) { if (pt[k] !== undefined) error(p + "." + k, "parts[0] has no position, so no part may have one; give every part x and y or none"); });
          return;
        }
        var shape = pt.shape === undefined ? "rect" : pt.shape;
        if (pt.shape !== undefined && !requireEnum(pt, "shape", p, ["rect", "circle"], error)) return;
        var okX = requireNumber(pt, "x", p, 0, 100, error), okY = requireNumber(pt, "y", p, 0, 60, error);
        if (shape === "rect") {
          var okW = requireNumber(pt, "w", p, 1, 100, error), okH = requireNumber(pt, "h", p, 1, 60, error);
          if (pt.r !== undefined) error(p + ".r", "is only allowed when shape is \"circle\"");
          if (okX && okW && pt.x + pt.w > 100) error(p + ".w", "x + w must be at most 100 (the diagram is 100 wide), got " + (pt.x + pt.w));
          if (okY && okH && pt.y + pt.h > 60) error(p + ".h", "y + h must be at most 60 (the diagram is 60 tall), got " + (pt.y + pt.h));
        } else {
          var okR = requireNumber(pt, "r", p, 1, 30, error);
          if (pt.w !== undefined || pt.h !== undefined) error(p, "w and h are only allowed when shape is \"rect\"; a circle uses r");
          if (okX && okY && okR && (pt.x - pt.r < 0 || pt.x + pt.r > 100 || pt.y - pt.r < 0 || pt.y + pt.r > 60)) error(p + ".r", "the circle must fit inside the 100 × 60 diagram (x ± r within 0–100, y ± r within 0–60)");
        }
      });
    }
    answerId(a, path, ids, "part", error);
    if (a.links !== undefined && optionalArray(a, "links", path, 0, 12, error)) {
      a.links.forEach(function (l, i) {
        var p = path + ".links[" + i + "]"; if (!isObject(l, p, error)) return;
        ["from", "to"].forEach(function (k) { if (requireString(l, k, p, 1, 30, error) && ids.length && ids.indexOf(l[k]) === -1) error(p + "." + k, describe(l[k]) + " is not one of the part ids (" + ids.join(", ") + ")"); });
      });
    }
  }

  /* a control or switch id usable inside expressions */
  function exprId(o, p, ids, label, error) {
    if (!requireString(o, "id", p, 1, 20, error)) return;
    if (!CONTROL_ID.test(o.id)) error(p + ".id", "must match ^[a-z][a-z0-9]*$, got " + describe(o.id));
    else if (ids.indexOf(o.id) !== -1) error(p + ".id", "duplicate " + label + " id " + describe(o.id));
    else ids.push(o.id);
  }
  function checkSwitches(a, path, error, warn) {
    F(a, path, "prompt:s300 caption:s300", error);
    var ids = [];
    each(a, "switches", path, 1, 4, null, error, function (sw, p) { exprId(sw, p, ids, "switch", error); F(sw, p, "label:s1-60 on:b", error); });
    if (each(a, "readout", path, 1, 6, "text:s1-300", error, function (r, p) {
        if (r.when !== undefined) {
          if (typeof r.when !== "string") error(p + ".when", "must be an expression string, got " + describe(r.when));
          else { var c = compileExpr(r.when); if (c.error) error(p + ".when", "expression " + describe(r.when) + " is invalid: " + c.error); else c.ids.forEach(function (id) { if (ids.indexOf(id) === -1) error(p + ".when", "expression uses unknown switch id \"" + id + "\" (switches: " + ids.join(", ") + ")"); }); }
        }
        if (r.tone !== undefined) requireEnum(r, "tone", p, TONES, error);
      }) && a.readout.every(function (r) { return r && r.when !== undefined; })) warn(path + ".readout", "every readout has a \"when\"; add a last one without it so some text always shows");
  }

  function checkTune(a, path, error, warn) {
    var ids = [];
    each(a, "controls", path, 1, 3, null, error, function (c, p) {
        exprId(c, p, ids, "control", error);
        F(c, p, "label:s1-60", error);
        var okMin = requireInt(c, "min", p, -1000, 1000, error);
        var okMax = requireInt(c, "max", p, -1000, 1000, error);
        var okVal = requireInt(c, "value", p, -1000, 1000, error);
        if (okMin && okMax && c.min >= c.max) error(p + ".max", "must be greater than min (" + c.min + "), got " + c.max);
        if (okMin && okMax && okVal && (c.value < c.min || c.value > c.max)) error(p + ".value", "must be between min and max (" + c.min + "–" + c.max + "), got " + c.value);
    });
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
        var c = compileExpr(m[1]);
        if (c.error) { error(p, "placeholder {" + m[1] + "} is invalid: " + c.error); continue; }
        c.ids.forEach(function (id) { if (ids.indexOf(id) === -1) error(p, "placeholder {" + m[1] + "} uses unknown control id \"" + id + "\""); });
      }
    }
    each(a, "readout", path, 1, 4, null, error, function (r, p) { expr(r, "when", p, false); if (requireString(r, "text", p, 1, 300, error)) templateExprs(r.text, p + ".text"); });
    if (a.visual !== undefined && isObject(a.visual, path + ".visual", error)) {
      requireEnum(a.visual, "kind", path + ".visual", ["circle", "grid"], error);
      expr(a.visual, "count", path + ".visual", true);
      expr(a.visual, "extra", path + ".visual", true);
      optionalBool(a.visual, "leader", path + ".visual", error);
      if (a.visual.leader !== undefined && a.visual.kind !== "grid") error(path + ".visual.leader", "is only allowed when kind is \"grid\"");
    }
    if (a.tally !== undefined && isObject(a.tally, path + ".tally", error)) {
      expr(a.tally, "count", path + ".tally", true);
      F(a.tally, path + ".tally", "icon:s1-2", error);
      optionalInt(a.tally, "max", path + ".tally", 1, 60, error);
    }
    if (a.outcomes !== undefined && isObject(a.outcomes, path + ".outcomes", error)) {
      var o = a.outcomes;
      F(o, path + ".outcomes", "buttonLabel:s1-40", error);
      each(o, "cases", path + ".outcomes", 1, 8, "text:s1-300", error, function (c, p) { expr(c, "when", p, true); requireEnum(c, "tone", p, TONES, error); });
      if (requireObject(o, "fallback", path + ".outcomes", error)) { F(o.fallback, path + ".outcomes.fallback", "text:s1-300", error); requireEnum(o.fallback, "tone", path + ".outcomes.fallback", TONES, error); }
    }
    optionalString(a, "caption", path, 300, error);
  }

  /* typed answers are compared case- and space-insensitively, ignoring punctuation (identical copy in assets/view.js) */
  function normText(s) {
    return String(s).toLowerCase().replace(/[.,;:!?'"()\[\]]/g, " ").replace(/\s+/g, " ").trim();
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

  /* shared with assets/view.js, which would otherwise carry a copy (AGENTS.md §5.2) */
  validate.compileExpr = compileExpr;
  validate.normText = normText;
  return { validate: validate, SUPPORTED_VERSIONS: SUPPORTED_VERSIONS, compileExpr: compileExpr, normText: normText };
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
