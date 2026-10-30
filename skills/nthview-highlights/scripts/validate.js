/* NthView — highlights validator — schemaVersion 1
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
  var THEMES = ["midnight", "sunrise", "ocean", "forest", "berry", "paper"];
  var KINDS = ["cover", "topic", "list", "quote", "number", "recap", "cta"];
  var ACCENTS = ["violet", "coral", "teal", "amber", "blue", "rose", "lime", "slate"];
  var ID = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var TAG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

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
    optionalString(data, "kicker", "$", 60, error);
    optionalEnum(data, "theme", "$", THEMES, error);
    optionalStringArray(data, "tags", "$", 0, 10, 30, error, function (t, p) {
      if (!TAG.test(t)) error(p, "must be lowercase kebab-case, got " + JSON.stringify(t));
    });

    if (!requireArray(data, "cards", "$", 3, 24, error)) return;
    var ids = {}, kinds = {};
    data.cards.forEach(function (c, i) {
      var p = "cards[" + i + "]";
      if (!isObject(c)) { error(p, "must be an object, got " + describe(c)); return; }
      if (requireString(c, "id", p, 1, 40, error)) {
        if (!ID.test(c.id)) error(p + ".id", "must be lowercase kebab-case, got " + JSON.stringify(c.id));
        else if (ids[c.id]) error(p + ".id", "duplicate card id " + JSON.stringify(c.id) + " (first used at " + ids[c.id] + ")");
        else ids[c.id] = p;
      }
      var kind = c.kind === undefined ? "topic" : c.kind;
      if (c.kind !== undefined && KINDS.indexOf(c.kind) === -1) { error(p + ".kind", "must be one of " + KINDS.join(", ") + ", got " + describe(c.kind)); kind = "topic"; }
      kinds[kind] = (kinds[kind] || 0) + 1;
      optionalString(c, "kicker", p, 40, error);
      requireString(c, "headline", p, 1, 90, error);
      optionalString(c, "body", p, 320, error);
      optionalStringArray(c, "points", p, 0, 6, 90, error);
      optionalStringArray(c, "tags", p, 0, 6, 24, error, function (t, tp) {
        if (!TAG.test(t)) error(tp, "must be lowercase kebab-case, got " + JSON.stringify(t));
      });
      optionalEnum(c, "accent", p, ACCENTS, error);
      optionalString(c, "href", p, 200, error);
      if (c.href !== undefined && /^\s*javascript:/i.test(c.href)) error(p + ".href", "must be a page or http(s) link, not a script");
      optionalString(c, "cta", p, 40, error);
      if (c.cta !== undefined && c.href === undefined) error(p + ".cta", "needs href on the same card");
      if (c.quote !== undefined) {
        var qp = p + ".quote";
        if (!isObject(c.quote)) error(qp, "must be an object, got " + describe(c.quote));
        else { requireString(c.quote, "text", qp, 1, 200, error); optionalString(c.quote, "by", qp, 60, error); }
      }
      if (c.number !== undefined) {
        var np = p + ".number";
        if (!isObject(c.number)) error(np, "must be an object, got " + describe(c.number));
        else { requireString(c.number, "value", np, 1, 12, error); requireString(c.number, "label", np, 1, 80, error); }
      }
      // kind-specific requirements
      if (kind === "list" && (!Array.isArray(c.points) || c.points.length < 2)) error(p + ".points", "a list card needs at least 2 points");
      if (kind === "quote" && c.quote === undefined) error(p + ".quote", "a quote card needs a quote object");
      if (kind === "number" && c.number === undefined) error(p + ".number", "a number card needs a number object");
      if (kind === "cta" && c.href === undefined) error(p + ".href", "a cta card needs href");
      if (kind === "topic" && c.body === undefined && (!Array.isArray(c.points) || !c.points.length)) warn(p, "a topic card with neither body nor points shows only its headline");
      if (c.body !== undefined && Array.isArray(c.points) && c.points.length > 3) warn(p, "body plus more than 3 points may overflow the card on a phone");
    });

    if (!kinds.cover) warn("cards", "no cover card; the first card is shown as the cover");
    else if ((data.cards[0].kind || "topic") !== "cover") warn("cards[0]", "the cover card is not first");
    if (!kinds.recap && !kinds.cta) warn("cards", "no recap or cta card at the end; consider closing with one");
    if (data.cards.length < 5) warn("cards", "fewer than 5 cards; highlights usually run 6–10");
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
  // ---- extra helpers this view needs -------------------------------------
  function isObject(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
  function optionalString(obj, key, parent, max, error) {
    if (obj[key] === undefined) return true;
    return requireString(obj, key, parent, 1, max, error);
  }
  function optionalEnum(obj, key, parent, allowed, error) {
    if (obj[key] === undefined) return true;
    if (allowed.indexOf(obj[key]) === -1) { error(join(parent, key), "must be one of " + allowed.join(", ") + ", got " + describe(obj[key])); return false; }
    return true;
  }
  function optionalStringArray(obj, key, parent, min, max, itemMax, error, each) {
    if (obj[key] === undefined) return true;
    if (!requireArray(obj, key, parent, min, max, error)) return false;
    var ok = true;
    obj[key].forEach(function (s, i) {
      var p = join(parent, key) + "[" + i + "]";
      if (typeof s !== "string" || !s.trim()) { error(p, "must be a non-empty string, got " + describe(s)); ok = false; return; }
      if (s.length > itemMax) { error(p, "must be at most " + itemMax + " characters, got " + s.length); ok = false; return; }
      if (each) each(s, p);
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
