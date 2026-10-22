/* NthView — scenario-quiz validator — schemaVersion 1
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
  var THEMES = ["midnight", "sunrise", "forest", "paper", "neon", "ocean", "ember", "lavender"];

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
    requireString(data, "title", "$", 1, 80, error);
    optionalString(data, "subtitle", "$", 200, error);
    if (data.theme !== undefined && THEMES.indexOf(data.theme) === -1) {
      error("theme", "must be one of " + THEMES.join(", ") + "; got " + describe(data.theme) + " (or omit it to derive one from the title)");
    }

    if (requireObject(data, "scenario", "$", error)) {
      var sc = data.scenario;
      optionalString(sc, "heading", "scenario", 60, error);
      requireStringArray(sc, "setting", "scenario", 1, 6, 600, error);
      if (requireObject(sc, "role", "scenario", error)) {
        requireString(sc.role, "title", "scenario.role", 1, 120, error);
        optionalString(sc.role, "description", "scenario.role", 600, error);
      }
      optionalString(sc, "goal", "scenario", 300, error);
    }

    if (requireArray(data, "questions", "$", 1, 40, error)) {
      var ids = [], anyTrap = false;
      data.questions.forEach(function (q, i) {
        if (checkQuestion(q, "questions[" + i + "]", ids, error, warn)) anyTrap = true;
      });
      if (data.questions.length < 4) warn("questions", "only " + data.questions.length + " question(s); 6–12 give a scenario room to teach");
      if (!anyTrap && data.questions.length) warn("questions", "no option is marked \"trap\": true; marking the common wrong answer is the most instructive part");
    }

    if (requireObject(data, "summary", "$", error)) {
      optionalString(data.summary, "heading", "summary", 80, error);
      requireStringArray(data.summary, "closing", "summary", 1, 5, 600, error);
      optionalStringArray(data.summary, "takeaways", "summary", 0, 20, 200, error);
    }
  }

  function checkQuestion(q, path, ids, error, warn) {
    if (!isObject(q, path, error)) return false;
    if (requireString(q, "id", path, 1, 40, error)) {
      if (!KEBAB.test(q.id)) error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(q.id));
      else if (ids.indexOf(q.id) !== -1) error(path + ".id", "duplicate question id " + describe(q.id) + "; ids must be unique");
      else ids.push(q.id);
    }
    optionalString(q, "situation", path, 900, error);
    requireString(q, "prompt", path, 1, 400, error);
    requireString(q, "takeaway", path, 1, 300, error);
    var hasTrap = false;
    if (requireArray(q, "options", path, 2, 8, error)) {
      var correct = 0, traps = 0, texts = [];
      q.options.forEach(function (o, i) {
        var p = path + ".options[" + i + "]";
        if (!isObject(o, p, error)) return;
        requireString(o, "text", p, 1, 240, error);
        optionalBool(o, "correct", p, error);
        requireString(o, "why", p, 1, 600, error);
        optionalString(o, "tempting", p, 400, error);
        optionalBool(o, "trap", p, error);
        if (o.correct === true) correct++;
        if (o.trap === true) {
          traps++;
          if (o.correct === true) error(p + ".trap", "the trap must be a wrong option, but this option is marked correct");
          if (o.tempting === undefined) error(p + ".tempting", "is required on the trap option (say what makes people pick it)");
        } else if (o.correct !== true && o.tempting === undefined) {
          warn(p, "wrong option has no \"tempting\" note; acknowledging why people pick it teaches better");
        }
        if (typeof o.text === "string") {
          var key = o.text.trim().toLowerCase();
          if (texts.indexOf(key) !== -1) warn(p + ".text", "duplicate option text " + describe(o.text));
          texts.push(key);
        }
      });
      if (correct !== 1) error(path + ".options", "exactly one option must have \"correct\": true, found " + correct);
      if (traps > 1) error(path + ".options", "at most one option may have \"trap\": true, found " + traps);
      hasTrap = traps === 1;
      if (q.options.length === 2) warn(path + ".options", "only 2 options; 3–6 make the wrong answers more instructive");
    }
    return hasTrap;
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
    if (obj[key] === undefined) return true;
    if (typeof obj[key] !== "boolean") { error(join(parent, key), "must be true or false, got " + describe(obj[key])); return false; }
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
