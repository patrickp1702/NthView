/* NthView — courier validator — schemaVersion 1
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
  var THEMES = ["morning", "dusk", "lantern", "snow"];
  var COMPANIONS = ["dog", "cat", "bird"];
  var PROPS = ["house", "cottage", "tree", "pine", "lighthouse", "market", "windmill", "tower", "library", "bakery", "garden", "fountain", "lamp", "signpost", "crates", "rocks", "well", "dish"];
  var HAIR_STYLES = ["short", "long", "bun", "curly", "bob", "bald", "cap"];
  var ACCESSORIES = ["none", "glasses", "hat", "scarf", "apron", "headset", "bowtie", "flower"];
  var KINDS = ["letter", "parcel", "reply", "sort", "chain", "telegram", "weigh", "notice"];
  var KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var HEX = /^#[0-9a-fA-F]{6}$/;
  var MAX_PER_DISTRICT = 6;

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
    if (data.theme !== undefined) requireEnum(data, "theme", "$", THEMES, error);

    if (requireObject(data, "courier", "$", error)) {
      requireString(data.courier, "name", "courier", 1, 20, error);
      requireString(data.courier, "role", "courier", 1, 200, error);
    }
    if (data.companion !== undefined && isObject(data.companion, "companion", error)) {
      requireEnum(data.companion, "kind", "companion", COMPANIONS, error);
      requireString(data.companion, "name", "companion", 1, 20, error);
    }
    if (requireObject(data, "postmaster", "$", error)) {
      var pm = data.postmaster;
      requireString(pm, "name", "postmaster", 1, 30, error);
      if (pm.portrait !== undefined) checkPortrait(pm.portrait, "postmaster.portrait", error);
      if (requireObject(pm, "opening", "postmaster", error)) checkLetter(pm.opening, "postmaster.opening", error);
      if (requireObject(pm, "closing", "postmaster", error)) checkLetter(pm.closing, "postmaster.closing", error);
    }

    /* districts */
    var districtIds = [];
    if (requireArray(data, "districts", "$", 2, 6, error)) {
      data.districts.forEach(function (d, i) {
        var p = "districts[" + i + "]";
        if (!isObject(d, p, error)) return;
        checkId(d, p, districtIds, 30, "district", error);
        requireString(d, "name", p, 1, 30, error);
        requireString(d, "blurb", p, 1, 240, error);
        optionalHex(d, "color", p, error);
        if (requireArray(d, "props", p, 1, 6, error)) {
          var seen = [];
          d.props.forEach(function (pr, j) {
            var pp = p + ".props[" + j + "]";
            if (PROPS.indexOf(pr) === -1) error(pp, "must be one of " + PROPS.join(", ") + ", got " + describe(pr));
            else if (seen.indexOf(pr) !== -1) warn(pp, "prop " + describe(pr) + " is listed twice in this district");
            else seen.push(pr);
          });
        }
      });
    }

    /* residents */
    var residentIds = [], perDistrict = {};
    if (requireArray(data, "residents", "$", 3, 14, error)) {
      data.residents.forEach(function (r, i) {
        var p = "residents[" + i + "]";
        if (!isObject(r, p, error)) return;
        checkId(r, p, residentIds, 30, "resident", error);
        requireString(r, "name", p, 1, 20, error);
        requireString(r, "role", p, 1, 40, error);
        if (requireString(r, "district", p, 1, 30, error)) {
          if (districtIds.indexOf(r.district) === -1) error(p + ".district", "district id " + describe(r.district) + " is not defined in districts");
          else {
            perDistrict[r.district] = (perDistrict[r.district] || 0) + 1;
            if (perDistrict[r.district] === MAX_PER_DISTRICT + 1) error(p + ".district", "district " + describe(r.district) + " already has " + MAX_PER_DISTRICT + " residents; at most " + MAX_PER_DISTRICT + " fit in one district");
          }
        }
        requireString(r, "personality", p, 1, 160, error);
        if (requireObject(r, "portrait", p, error)) checkPortrait(r.portrait, p + ".portrait", error);
        requireString(r, "knows", p, 1, 400, error);
        requireString(r, "greeting", p, 1, 300, error);
        requireStringArray(r, "smallTalk", p, 1, 4, 240, error);
      });
      districtIds.forEach(function (id, i) { if (!perDistrict[id]) warn("districts[" + i + "]", "district " + describe(id) + " has no residents; its square will stand empty"); });
    }

    /* errands */
    var errandIds = [], used = {}, kinds = {}, nonNotice = 0;
    if (requireArray(data, "errands", "$", 3, 12, error)) {
      data.errands.forEach(function (e, i) {
        var p = "errands[" + i + "]";
        if (!isObject(e, p, error)) { errandIds.push(null); return; }
        var before = errandIds.slice();
        checkId(e, p, errandIds, 40, "errand", error);
        if (errandIds.length === before.length) errandIds.push(null);
        if (!requireEnum(e, "kind", p, KINDS, error)) return;
        kinds[e.kind] = true;
        if (e.kind !== "notice") nonNotice++;
        requireString(e, "title", p, 1, 60, error);
        requireString(e, "hint", p, 1, 200, error);
        requireString(e, "teaches", p, 1, 200, error);
        if (e.kind === "notice") optionalString(e, "done", p, 300, error);
        else requireString(e, "done", p, 1, 300, error);
        if (e.after !== undefined && requireString(e, "after", p, 1, 40, error)) {
          if (before.indexOf(e.after) === -1) {
            if (e.after === e.id) error(p + ".after", "an errand cannot wait for itself");
            else error(p + ".after", "errand id " + describe(e.after) + " is not an earlier errand (after must name an errand listed before this one)");
          }
        }
        var ref = function (key, label) {
          if (!requireString(e, key, p, 1, 30, error)) return false;
          if (residentIds.indexOf(e[key]) === -1) { error(p + "." + key, "resident id " + describe(e[key]) + " is not defined in residents"); return false; }
          used[e[key]] = true; return true;
        };
        var optRef = function (key) { if (e[key] === undefined) return false; return ref(key); };
        var distRef = function (obj, key, path) {
          if (!requireString(obj, key, path, 1, 30, error)) return false;
          if (districtIds.indexOf(obj[key]) === -1) { error(join(path, key), "district id " + describe(obj[key]) + " is not defined in districts"); return false; }
          return true;
        };

        switch (e.kind) {
          case "letter":
            ref("to");
            if (optRef("from") && e.from === e.to) error(p + ".from", "the letter cannot come from its own recipient " + describe(e.to));
            if (requireObject(e, "letter", p, error)) checkLetter(e.letter, p + ".letter", error);
            if (requireObject(e, "check", p, error)) {
              requireString(e.check, "question", p + ".check", 1, 300, error);
              checkOptions(e.check, "options", p + ".check", 2, 5, error);
            }
            break;
          case "parcel":
            requireString(e, "label", p, 1, 60, error);
            requireStringArray(e, "clues", p, 1, 5, 200, error);
            ref("owner");
            if (optRef("from") && e.from === e.owner) error(p + ".from", "the parcel cannot come from its own owner " + describe(e.owner));
            if (e.decoys !== undefined && requireArray(e, "decoys", p, 0, 6, error)) {
              var dseen = [];
              e.decoys.forEach(function (d, j) {
                var dp = p + ".decoys[" + j + "]";
                if (!isObject(d, dp, error)) return;
                if (requireString(d, "resident", dp, 1, 30, error)) {
                  if (residentIds.indexOf(d.resident) === -1) error(dp + ".resident", "resident id " + describe(d.resident) + " is not defined in residents");
                  else if (d.resident === e.owner) error(dp + ".resident", "the owner " + describe(e.owner) + " cannot also be a decoy");
                  else if (dseen.indexOf(d.resident) !== -1) error(dp + ".resident", "resident " + describe(d.resident) + " is already a decoy for this parcel");
                  else dseen.push(d.resident);
                }
                requireString(d, "why", dp, 1, 300, error);
              });
            }
            break;
          case "reply":
            ref("asker");
            requireString(e, "question", p, 1, 300, error);
            checkOptions(e, "cards", p, 2, 4, error);
            if (ref("to") && e.to === e.asker) error(p + ".to", "the reply must go to someone other than the asker " + describe(e.asker));
            break;
          case "sort":
            optionalString(e, "intro", p, 300, error);
            if (requireArray(e, "envelopes", p, 3, 10, error)) {
              var dests = {};
              e.envelopes.forEach(function (en, j) {
                var ep = p + ".envelopes[" + j + "]";
                if (!isObject(en, ep, error)) return;
                requireString(en, "label", ep, 1, 60, error);
                if (distRef(en, "district", ep)) dests[en.district] = true;
                requireString(en, "note", ep, 1, 240, error);
              });
              if (Object.keys(dests).length === 1) warn(p + ".envelopes", "every envelope goes to the same district; sorting needs at least two destinations to teach anything");
            }
            break;
          case "chain":
            requireString(e, "message", p, 1, 200, error);
            if (requireArray(e, "steps", p, 2, 6, error)) {
              var cseen = [];
              e.steps.forEach(function (s, j) {
                var sp = p + ".steps[" + j + "]";
                if (!isObject(s, sp, error)) return;
                if (requireString(s, "resident", sp, 1, 30, error)) {
                  if (residentIds.indexOf(s.resident) === -1) error(sp + ".resident", "resident id " + describe(s.resident) + " is not defined in residents");
                  else if (cseen.indexOf(s.resident) !== -1) error(sp + ".resident", "resident " + describe(s.resident) + " already appears earlier in this chain; each resident takes the message once");
                  else { cseen.push(s.resident); used[s.resident] = true; }
                }
                requireString(s, "says", sp, 1, 300, error);
                optionalString(s, "tooEarly", sp, 300, error);
              });
            }
            break;
          case "telegram":
            ref("to");
            var textOk = requireString(e, "text", p, 1, 400, error);
            if (requireArray(e, "gaps", p, 1, 4, error)) {
              e.gaps.forEach(function (g, j) {
                var gp = p + ".gaps[" + j + "]";
                if (!isObject(g, gp, error)) return;
                if (requireStringArray(g, "options", gp, 2, 4, 40, error)) {
                  var uniq = g.options.filter(function (o, k) { return g.options.indexOf(o) === k; });
                  if (uniq.length !== g.options.length) error(gp + ".options", "options must be unique");
                  if (requireInt(g, "answer", gp, -Infinity, Infinity, error) && (g.answer < 0 || g.answer >= g.options.length)) {
                    error(gp + ".answer", "index " + g.answer + " is out of range (" + g.options.length + " options, valid indexes are 0–" + (g.options.length - 1) + ")");
                  }
                }
                optionalString(g, "why", gp, 300, error);
              });
              if (textOk) {
                var count = e.text.split("___").length - 1;
                if (count !== e.gaps.length) error(p + ".text", "has " + count + " gap marker(s) ___ but " + e.gaps.length + " gap(s) are defined");
              }
            }
            break;
          case "weigh":
            requireString(e, "label", p, 1, 60, error);
            requireString(e, "prompt", p, 1, 300, error);
            requireString(e, "unit", p, 1, 12, error);
            var nOk = ["min", "max", "answer", "tolerance"].map(function (k) { return requireNumber(e, k, p, -Infinity, Infinity, error); });
            if (nOk[0] && nOk[1]) {
              if (e.min >= e.max) error(p + ".max", "must be greater than min (" + e.min + "), got " + e.max);
              else {
                if (nOk[2] && (e.answer < e.min || e.answer > e.max)) error(p + ".answer", "must be between min " + e.min + " and max " + e.max + ", got " + e.answer);
                if (nOk[3] && e.tolerance * 2 >= e.max - e.min) warn(p + ".tolerance", "tolerance " + e.tolerance + " covers half the range or more; almost any guess will count");
              }
            }
            if (nOk[3] && e.tolerance <= 0) error(p + ".tolerance", "must be greater than 0, got " + e.tolerance);
            if (e.step !== undefined && requireNumber(e, "step", p, -Infinity, Infinity, error) && e.step <= 0) error(p + ".step", "must be greater than 0, got " + e.step);
            requireString(e, "reveal", p, 1, 400, error);
            ref("to");
            break;
          case "notice":
            distRef(e, "district", p);
            requireString(e, "heading", p, 1, 60, error);
            requireStringArray(e, "paragraphs", p, 1, 3, 500, error);
            break;
        }
      });
      if (nonNotice === 0) error("errands", "every errand is a notice; at least one errand must be another kind, because the closing letter waits for those");
      var kindList = Object.keys(kinds);
      if (data.errands.length >= 6 && kindList.length <= 2) warn("errands", "only " + kindList.length + " errand kind(s) across " + data.errands.length + " errands; mix in more kinds for variety");
      if (Array.isArray(data.residents)) data.residents.forEach(function (r, i) {
        if (r && typeof r.id === "string" && residentIds.indexOf(r.id) !== -1 && !used[r.id] && !isDecoyOnly(data.errands, r.id)) warn("residents[" + i + "]", "resident " + describe(r.id) + " appears in no errand; they can still be talked to");
      });
    }

    if (data.glossary !== undefined && requireArray(data, "glossary", "$", 0, 16, error)) {
      data.glossary.forEach(function (g, i) {
        var p = "glossary[" + i + "]";
        if (isObject(g, p, error)) { requireString(g, "term", p, 1, 60, error); requireString(g, "meaning", p, 1, 200, error); }
      });
    }

    if (requireObject(data, "report", "$", error)) {
      var r = data.report;
      requireString(r, "heading", "report", 1, 60, error);
      optionalString(r, "intro", "report", 300, error);
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

  function isDecoyOnly(errands, id) {
    return errands.some(function (e) { return e && Array.isArray(e.decoys) && e.decoys.some(function (d) { return d && d.resident === id; }); });
  }

  function checkId(obj, path, ids, max, what, error) {
    if (!requireString(obj, "id", path, 1, max, error)) return false;
    if (!KEBAB.test(obj.id)) { error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(obj.id)); return false; }
    if (ids.indexOf(obj.id) !== -1) { error(path + ".id", "duplicate " + what + " id " + describe(obj.id) + "; ids must be unique"); return false; }
    ids.push(obj.id); return true;
  }

  function checkLetter(l, path, error) {
    optionalString(l, "heading", path, 80, error);
    requireStringArray(l, "paragraphs", path, 1, 5, 600, error);
    optionalString(l, "signoff", path, 80, error);
  }

  function checkPortrait(pt, path, error) {
    if (!isObject(pt, path, error)) return;
    ["skin", "hair", "top"].forEach(function (k) {
      if (requireString(pt, k, path, 1, 7, error) && !HEX.test(pt[k])) error(path + "." + k, "must be a #rrggbb hex colour, got " + describe(pt[k]));
    });
    requireEnum(pt, "hairStyle", path, HAIR_STYLES, error);
    if (pt.accessory !== undefined) requireEnum(pt, "accessory", path, ACCESSORIES, error);
  }

  function checkOptions(obj, key, path, min, max, error) {
    if (!requireArray(obj, key, path, min, max, error)) return;
    var correct = 0;
    obj[key].forEach(function (o, j) {
      var op = join(path, key) + "[" + j + "]";
      if (!isObject(o, op, error)) return;
      requireString(o, "text", op, 1, 200, error);
      requireString(o, "why", op, 1, 400, error);
      if (optionalBool(o, "correct", op, error) && o.correct === true) correct++;
    });
    if (correct !== 1) error(join(path, key), "must have exactly one option with correct: true, got " + correct);
  }

  function optionalHex(obj, key, path, error) {
    if (obj[key] === undefined) return true;
    if (!requireString(obj, key, path, 1, 7, error)) return false;
    if (!HEX.test(obj[key])) { error(join(path, key), "must be a #rrggbb hex colour, got " + describe(obj[key])); return false; }
    return true;
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
  function requireEnum(obj, key, parent, allowed, error) {
    var v = obj[key];
    if (allowed.indexOf(v) === -1) { error(join(parent, key), "must be one of " + allowed.join(", ") + ", got " + describe(v)); return false; }
    return true;
  }
  function requireNumber(obj, key, parent, min, max, error) {
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "number" || isNaN(v) || !isFinite(v)) { error(path, "must be a number, got " + describe(v)); return false; }
    if (v < min || v > max) { error(path, "must be between " + min + " and " + max + ", got " + v); return false; }
    return true;
  }
  function requireInt(obj, key, parent, min, max, error) {
    if (!requireNumber(obj, key, parent, min, max, error)) return false;
    if (obj[key] % 1 !== 0) { error(join(parent, key), "must be a whole number, got " + obj[key]); return false; }
    return true;
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
