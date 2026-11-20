/* NthView — timeline validator — schemaVersion 1
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
  var DATE_RE = /^(-?\d{1,6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}))?)?)?$/;
  var URL_OK = /^https?:\/\/[^\s]+$/;
  var KINDS = ["order", "place", "cause", "choice", "sort", "reflect"];
  var CAUSE_KINDS = ["trigger", "condition"];
  var LONG_STRETCH = 8;

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
    optionalStringArray(data, "intro", "$", 1, 4, 600, error);
    if (data.reveal !== undefined && data.reveal !== "step" && data.reveal !== "open") {
      error("reveal", "must be \"step\" or \"open\", got " + describe(data.reveal));
    }
    optionalString(data, "timeZone", "$", 12, error);
    if (data.gaps !== undefined && typeof data.gaps !== "boolean") error("gaps", "must be true or false, got " + describe(data.gaps));

    var trackIds = [];
    if (data.tracks !== undefined && requireArray(data, "tracks", "$", 1, 3, error)) {
      data.tracks.forEach(function (t, i) {
        var p = "tracks[" + i + "]";
        if (!isObject(t, p, error)) return;
        uniqueId(t, p, trackIds, "track", error);
        requireString(t, "label", p, 1, 40, error);
        optionalString(t, "text", p, 200, error);
      });
    }

    var refCount = 0;
    if (data.references !== undefined && requireArray(data, "references", "$", 1, 20, error)) {
      refCount = data.references.length;
      data.references.forEach(function (r, i) {
        var p = "references[" + i + "]";
        if (!isObject(r, p, error)) return;
        requireString(r, "title", p, 1, 160, error);
        optionalString(r, "publisher", p, 80, error);
        if (optionalString(r, "url", p, 500, error) && r.url !== undefined && !URL_OK.test(r.url)) {
          error(p + ".url", "must start with http:// or https:// and contain no spaces, got " + describe(r.url));
        }
      });
    }

    // events: ids, dates in order, tracks, refs; causes checked once every id is known
    var ev = {}, order = [], prevKey = null;
    if (requireArray(data, "events", "$", 2, 80, error)) {
      var ids = [];
      data.events.forEach(function (e, i) {
        var p = "events[" + i + "]";
        if (!isObject(e, p, error)) return;
        if (uniqueId(e, p, ids, "event", error)) { ev[e.id] = { i: i, e: e }; order.push(e.id); }
        var key = checkDate(e.date, p + ".date", error);
        if (key && prevKey && compareKeys(key, prevKey, Math.min(key[5], prevKey[5])) < 0) {
          error(p + ".date", describe(e.date) + " is earlier than the event before it; list events in time order");
        }
        if (key) prevKey = key;
        if (e.end !== undefined) {
          var endKey = checkDate(e.end, p + ".end", error);
          if (endKey && key && compareKeys(endKey, key, Math.min(endKey[5], key[5])) <= 0) error(p + ".end", describe(e.end) + " must be later than date " + describe(e.date));
        }
        optionalString(e, "label", p, 40, error);
        requireString(e, "title", p, 1, 100, error);
        requireString(e, "text", p, 1, 600, error);
        optionalStringArray(e, "detail", p, 1, 6, 800, error);
        optionalBool(e, "turningPoint", p, error);
        if (e.track !== undefined) {
          if (!trackIds.length) error(p + ".track", "is set but the root has no tracks");
          else if (trackIds.indexOf(e.track) === -1) error(p + ".track", "track id " + describe(e.track) + " is not defined in tracks");
        } else if (trackIds.length) {
          warn(p + ".track", "event has no track while tracks are defined; it is shown in a neutral colour");
        }
        if (e.refs !== undefined && requireArray(e, "refs", p, 1, 4, error)) {
          e.refs.forEach(function (r, k) {
            if (!isIndex(r, refCount)) error(p + ".refs[" + k + "]", "must be an index into references (" + refCount + " defined), got " + describe(r));
          });
        }
      });
      data.events.forEach(function (e, i) {
        if (!e || typeof e !== "object" || e.causes === undefined) return;
        var p = "events[" + i + "]";
        if (!requireArray(e, "causes", p, 1, 4, error)) return;
        var seen = [];
        e.causes.forEach(function (c, k) {
          var cp = p + ".causes[" + k + "]";
          if (!isObject(c, cp, error)) return;
          if (requireString(c, "event", cp, 1, 40, error)) {
            if (!ev[c.event]) error(cp + ".event", "event id " + describe(c.event) + " is not defined in events");
            else if (ev[c.event].i >= i) error(cp + ".event", "cause " + describe(c.event) + " must be listed before the event it causes");
            else if (seen.indexOf(c.event) !== -1) error(cp + ".event", "cause " + describe(c.event) + " is listed twice");
            seen.push(c.event);
          }
          optionalString(c, "how", cp, 200, error);
          if (c.kind !== undefined && CAUSE_KINDS.indexOf(c.kind) === -1) error(cp + ".kind", "must be \"trigger\" or \"condition\", got " + describe(c.kind));
        });
      });
      if (data.events.length < 4) warn("events", "only " + data.events.length + " events; 8–25 make a timeline worth exploring");
    }

    if (data.eras !== undefined && requireArray(data, "eras", "$", 1, 8, error)) {
      var spans = [];
      data.eras.forEach(function (a, i) {
        var p = "eras[" + i + "]";
        if (!isObject(a, p, error)) return;
        requireString(a, "label", p, 1, 60, error);
        optionalString(a, "text", p, 300, error);
        var okFrom = eventRef(a, "from", p, ev, error), okTo = eventRef(a, "to", p, ev, error);
        if (okFrom && okTo) {
          var s = ev[a.from].i, t = ev[a.to].i;
          if (t < s) { error(p + ".to", "event " + describe(a.to) + " is listed before " + describe(a.from) + "; an era runs forwards"); return; }
          spans.forEach(function (o) {
            if (s <= o.t && o.s <= t) error(p, "overlaps eras[" + o.i + "]; eras must not overlap or nest");
          });
          spans.push({ s: s, t: t, i: i });
        }
      });
    }

    var placed = {}, qIds = [], afterCount = {};
    if (data.questions !== undefined && requireArray(data, "questions", "$", 0, 40, error)) {
      data.questions.forEach(function (q, i) {
        var p = "questions[" + i + "]";
        if (!isObject(q, p, error)) return;
        if (q.kind === "place" && typeof q.event === "string" && ev[q.event]) {
          if (placed[q.event] !== undefined) error(p + ".event", "event " + describe(q.event) + " is already the target of questions[" + placed[q.event] + "]; place each event at most once");
          else placed[q.event] = i;
        }
      });
      data.questions.forEach(function (q, i) {
        if (!q || typeof q !== "object" || Array.isArray(q)) return;
        checkQuestion(q, "questions[" + i + "]", qIds, ev, placed, error, warn);
        if (typeof q.after === "string" && ev[q.after]) afterCount[ev[q.after].i] = true;
      });
    }
    var qCount = Array.isArray(data.questions) ? data.questions.length : 0;
    if (!qCount) warn("questions", "no questions; the learner only reads. Mix in 4–10 questions so they recall and reason");
    if (order.length && qCount) {
      var run = 0;
      for (var k = 0; k < order.length; k++) {
        run = afterCount[k] ? 0 : run + 1;
        if (run === LONG_STRETCH + 1) warn("questions", "events[" + (k - LONG_STRETCH) + "] to events[" + k + "] pass with no question; break long stretches with one");
      }
    }

    if (data.wrap !== undefined && isObject(data.wrap, "wrap", error)) {
      optionalString(data.wrap, "heading", "wrap", 80, error);
      requireStringArray(data.wrap, "text", "wrap", 1, 4, 600, error);
      optionalStringArray(data.wrap, "takeaways", "wrap", 1, 8, 200, error);
    }
  }

  function checkQuestion(q, p, ids, ev, placed, error, warn) {
    uniqueId(q, p, ids, "question", error);
    if (KINDS.indexOf(q.kind) === -1) {
      error(p + ".kind", "must be one of " + KINDS.join(", ") + ", got " + describe(q.kind));
      return;
    }
    var at = eventRef(q, "after", p, ev, error) ? ev[q.after].i : -1;
    if (q.kind === "reflect") requireString(q, "prompt", p, 1, 300, error);
    else optionalString(q, "prompt", p, 300, error);
    optionalString(q, "hint", p, 300, error);
    requireString(q, "explain", p, 1, 800, error);
    if (at !== -1 && placed[q.after] !== undefined && q.kind !== "place") {
      error(p + ".after", "event " + describe(q.after) + " is hidden until questions[" + placed[q.after] + "] places it; attach this question to another event");
    }

    if (q.kind === "order") {
      if (requireArray(q, "events", p, 3, 6, error)) {
        var seen = [];
        q.events.forEach(function (id, k) {
          var ep = p + ".events[" + k + "]";
          if (!refString(id, ep, ev, error)) return;
          if (seen.indexOf(id) !== -1) error(ep, "event " + describe(id) + " appears twice");
          seen.push(id);
        });
        var dates = seen.filter(function (id) { return ev[id]; }).map(function (id) { return ev[id].e.date; });
        dates.forEach(function (d, k) { if (dates.indexOf(d) !== k) warn(p + ".events", "two events share the date " + describe(d) + "; their order is only the list order"); });
      }
    } else if (q.kind === "place") {
      if (eventRef(q, "event", p, ev, error)) {
        var ti = ev[q.event].i;
        if (q.after === q.event) error(p + ".after", "cannot be the event being placed; it is hidden until the question is answered");
        else if (at !== -1 && ti > at) error(p + ".event", "event " + describe(q.event) + " is listed after " + describe(q.after) + "; place only events that come at or before the question");
      }
      if (requireArray(q, "among", p, 2, 6, error)) {
        var amongSeen = [];
        q.among.forEach(function (id, k) {
          var ap = p + ".among[" + k + "]";
          if (!refString(id, ap, ev, error)) return;
          if (id === q.event) error(ap, "is the event being placed; list only its neighbours");
          else if (placed[id] !== undefined) error(ap, "event " + describe(id) + " is hidden by questions[" + placed[id] + "]; use visible events as neighbours");
          else if (at !== -1 && ev[id].i > at) error(ap, "event " + describe(id) + " is listed after " + describe(q.after) + "; neighbours must already be on the timeline");
          if (amongSeen.indexOf(id) !== -1) error(ap, "event " + describe(id) + " appears twice");
          amongSeen.push(id);
        });
      }
    } else if (q.kind === "cause") {
      var effect = q.ask === "effect";
      if (q.ask !== undefined && q.ask !== "cause" && q.ask !== "effect") error(p + ".ask", "must be \"cause\" or \"effect\", got " + describe(q.ask));
      var focusOk = eventRef(q, "event", p, ev, error);
      if (requireArray(q, "options", p, 2, 5, error)) {
        var right = 0, used = [];
        q.options.forEach(function (o, k) {
          var op = p + ".options[" + k + "]";
          if (!isObject(o, op, error)) return;
          optionalString(o, "why", op, 400, error);
          if (o.why === undefined) warn(op, "option has no \"why\"; explaining each option is what teaches");
          if (!requireString(o, "event", op, 1, 40, error)) return;
          if (!ev[o.event]) { error(op + ".event", "event id " + describe(o.event) + " is not defined in events"); return; }
          if (o.event === q.event) { error(op + ".event", "is the question's own event"); return; }
          if (used.indexOf(o.event) !== -1) error(op + ".event", "event " + describe(o.event) + " appears twice");
          used.push(o.event);
          if (focusOk && linked(effect ? ev[o.event].e : ev[q.event].e, effect ? q.event : o.event)) right++;
        });
        if (focusOk && right !== 1) {
          error(p + ".options", "exactly one option must be " + (effect ? "an event that lists " + describe(q.event) + " in its causes" : "listed in the causes of " + describe(q.event)) + ", found " + right);
        }
      }
    } else if (q.kind === "choice") {
      if (requireArray(q, "options", p, 2, 6, error)) {
        var correct = 0;
        q.options.forEach(function (o, k) {
          var op = p + ".options[" + k + "]";
          if (!isObject(o, op, error)) return;
          requireString(o, "text", op, 1, 200, error);
          optionalBool(o, "correct", op, error);
          optionalString(o, "why", op, 400, error);
          if (o.why === undefined) warn(op, "option has no \"why\"; explaining each option is what teaches");
          if (o.correct === true) correct++;
        });
        if (correct !== 1) error(p + ".options", "exactly one option must have \"correct\": true, found " + correct);
      }
    } else if (q.kind === "sort") {
      var bins = requireStringArray(q, "bins", p, 2, 3, 40, error) ? q.bins.length : 0;
      if (requireArray(q, "items", p, 2, 8, error)) {
        var hit = [];
        q.items.forEach(function (it, k) {
          var ip = p + ".items[" + k + "]";
          if (!isObject(it, ip, error)) return;
          if ((it.event === undefined) === (it.text === undefined)) error(ip, "needs exactly one of \"event\" or \"text\"");
          else if (it.event !== undefined) refString(it.event, ip + ".event", ev, error);
          else checkStr(it.text, ip + ".text", 1, 160, error);
          optionalString(it, "why", ip, 300, error);
          if (bins && !isIndex(it.bin, bins)) error(ip + ".bin", "must be an index into bins (" + bins + " defined, valid indexes are 0–" + (bins - 1) + "), got " + describe(it.bin));
          else hit[it.bin] = true;
        });
        for (var b = 0; b < bins; b++) if (!hit[b]) warn(p + ".bins[" + b + "]", "no item belongs to this bin");
      }
    }
  }

  // ---- dates and references -----------------------------------------------
  function checkDate(v, path, error) {
    if (typeof v !== "string") { error(path, "must be a date string such as \"2017-05-12\", got " + describe(v)); return null; }
    var m = DATE_RE.exec(v);
    if (!m) { error(path, "must look like YYYY, YYYY-MM, YYYY-MM-DD or YYYY-MM-DDThh:mm, got " + describe(v)); return null; }
    var y = parseInt(m[1], 10), mo = m[2] ? +m[2] : 0, d = m[3] ? +m[3] : 0, h = m[4] ? +m[4] : 0, mi = m[5] ? +m[5] : 0;
    if (m[2] && (mo < 1 || mo > 12)) { error(path, "month " + m[2] + " is out of range (01–12)"); return null; }
    if (m[3]) {
      var dim = [31, (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0 ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][mo - 1];
      if (d < 1 || d > dim) { error(path, "day " + m[3] + " is out of range for that month (01–" + dim + ")"); return null; }
    }
    if (m[4] && (h > 23 || mi > 59)) { error(path, "time " + m[4] + ":" + m[5] + " is out of range (00:00–23:59)"); return null; }
    return [y, mo, d, h, mi, m[4] ? 4 : m[3] ? 3 : m[2] ? 2 : 1];
  }
  /* compare only the parts both dates have: "2017-05-12" and "2017-05-12T15:00" are equal */
  function compareKeys(a, b, precision) {
    for (var i = 0; i < Math.min(precision + (precision === 4 ? 1 : 0), 5); i++) if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
    return 0;
  }
  function linked(effectEvent, causeId) {
    return Array.isArray(effectEvent.causes) && effectEvent.causes.some(function (c) { return c && c.event === causeId; });
  }
  function uniqueId(obj, path, ids, what, error) {
    if (!requireString(obj, "id", path, 1, 40, error)) return false;
    if (!KEBAB.test(obj.id)) { error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(obj.id)); return false; }
    if (ids.indexOf(obj.id) !== -1) { error(path + ".id", "duplicate " + what + " id " + describe(obj.id) + "; ids must be unique"); return false; }
    ids.push(obj.id);
    return true;
  }
  function refString(id, path, ev, error) {
    if (typeof id !== "string") { error(path, "must be an event id, got " + describe(id)); return false; }
    if (!ev[id]) { error(path, "event id " + describe(id) + " is not defined in events"); return false; }
    return true;
  }
  function eventRef(obj, key, parent, ev, error) {
    return refString(obj[key], join(parent, key), ev, error);
  }
  function isIndex(v, n) {
    return typeof v === "number" && v % 1 === 0 && v >= 0 && v < n;
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
