/* NthView — dataflow validator — schemaVersion 1
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
  var THEMES = ["graphite", "paper", "blueprint", "amber"];
  var KINDS = ["person", "browser", "app", "client", "server", "service", "database", "gateway", "network", "bank", "model", "device", "document", "queue", "cloud", "generic"];
  var MESSAGE_KINDS = ["request", "response", "error", "notification", "local", "transport"];
  var TONES = ["neutral", "attention"];
  var URL_RE = /^https?:\/\//;
  var MAX_PAYLOAD = 4000, WARN_PAYLOAD = 1500;
  var MAX_TOPICS = 60;

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
    optionalString(data, "kicker", "$", 80, error);
    optionalString(data, "heading", "$", 120, error);
    requireString(data, "lead", "$", 1, 800, error);
    optionalString(data, "startLabel", "$", 40, error, 1);
    optionalString(data, "versionsLabel", "$", 24, error, 1);
    optionalString(data, "footer", "$", 300, error);
    optionalEnum(data, "theme", "$", THEMES, error);

    if (data.facts !== undefined && requireArray(data, "facts", "$", 0, 8, error)) {
      data.facts.forEach(function (f, i) {
        var p = "facts[" + i + "]";
        if (!isObject(f)) { error(p, "must be an object, got " + describe(f)); return; }
        requireString(f, "term", p, 1, 40, error);
        requireString(f, "text", p, 1, 240, error);
      });
    }

    /* versions */
    var versions = [], VI = {};
    var hasVersions = false;
    if (data.versions !== undefined && requireArray(data, "versions", "$", 0, 8, error)) {
      var defaults = 0;
      data.versions.forEach(function (v, i) {
        var p = "versions[" + i + "]";
        if (!isObject(v)) { error(p, "must be an object, got " + describe(v)); return; }
        if (requireId(v, "id", p, error)) {
          if (VI[v.id] !== undefined) error(p + ".id", "duplicate version id " + JSON.stringify(v.id));
          else { VI[v.id] = i; versions.push(v); }
        }
        requireString(v, "label", p, 1, 20, error);
        optionalString(v, "date", p, 40, error);
        optionalString(v, "note", p, 200, error);
        if (v["default"] !== undefined && typeof v["default"] !== "boolean") error(p + ".default", "must be a boolean, got " + describe(v["default"]));
        if (v["default"] === true) defaults++;
      });
      if (defaults > 1) error("versions", "at most one version may have default: true, got " + defaults);
      hasVersions = data.versions.length > 0;
    }
    var versionRefs = 0;
    function checkVersionRef(obj, key, parent) {
      return checkVersionId(obj[key], join(parent, key));
    }
    function checkVersionId(v, path) {
      if (typeof v !== "string") { error(path, "must be a version id string, got " + describe(v)); return false; }
      if (!hasVersions) { error(path, "refers to version " + JSON.stringify(v) + " but the document declares no versions"); return false; }
      if (VI[v] === undefined) { error(path, "version id " + JSON.stringify(v) + " is not defined in versions"); return false; }
      versionRefs++;
      return true;
    }

    /* zones */
    var ZI = {}, zoneUsed = {};
    if (data.zones !== undefined && requireArray(data, "zones", "$", 0, 10, error)) {
      data.zones.forEach(function (z, i) {
        var p = "zones[" + i + "]";
        if (!isObject(z)) { error(p, "must be an object, got " + describe(z)); return; }
        if (requireId(z, "id", p, error)) {
          if (ZI[z.id]) error(p + ".id", "duplicate zone id " + JSON.stringify(z.id)); else ZI[z.id] = true;
        }
        requireString(z, "name", p, 1, 40, error);
        optionalString(z, "subtitle", p, 60, error);
        if (z.remote !== undefined && typeof z.remote !== "boolean") error(p + ".remote", "must be a boolean, got " + describe(z.remote));
      });
    }

    /* entities */
    var EI = {}, entityUsed = {};
    if (requireArray(data, "entities", "$", 2, 40, error)) {
      data.entities.forEach(function (e, i) {
        var p = "entities[" + i + "]";
        if (!isObject(e)) { error(p, "must be an object, got " + describe(e)); return; }
        if (requireId(e, "id", p, error)) {
          if (EI[e.id]) error(p + ".id", "duplicate entity id " + JSON.stringify(e.id)); else EI[e.id] = true;
        }
        requireString(e, "name", p, 1, 32, error);
        optionalString(e, "subtitle", p, 40, error);
        optionalEnum(e, "kind", p, KINDS, error);
        if (e.zone !== undefined) {
          if (typeof e.zone !== "string") error(p + ".zone", "must be a zone id string, got " + describe(e.zone));
          else if (!ZI[e.zone]) error(p + ".zone", "zone id " + JSON.stringify(e.zone) + " is not defined in zones");
          else zoneUsed[e.zone] = true;
        }
      });
    }
    function checkEntityRef(obj, key, parent) {
      var path = join(parent, key), v = obj[key];
      if (typeof v !== "string") { error(path, "must be an entity id string, got " + describe(v)); return false; }
      if (!EI[v]) { error(path, "entity id " + JSON.stringify(v) + " is not defined in entities"); return false; }
      entityUsed[v] = true;
      return true;
    }

    /* links */
    var LINKS = {}, linkUsed = {};
    function pairKey(a, b) { return a < b ? a + "|" + b : b + "|" + a; }
    if (data.links !== undefined && requireArray(data, "links", "$", 0, 80, error)) {
      data.links.forEach(function (l, i) {
        var p = "links[" + i + "]";
        if (!isObject(l)) { error(p, "must be an object, got " + describe(l)); return; }
        var okF = checkEntityRef(l, "from", p), okT = checkEntityRef(l, "to", p);
        optionalString(l, "label", p, 24, error);
        if (okF && okT) {
          if (l.from === l.to) error(p + ".to", "must differ from from (" + JSON.stringify(l.from) + ")");
          else {
            var k = pairKey(l.from, l.to);
            if (LINKS[k] !== undefined) error(p, "duplicate link between " + JSON.stringify(l.from) + " and " + JSON.stringify(l.to) + " (already links[" + LINKS[k] + "])");
            else LINKS[k] = i;
          }
        }
      });
    }

    /* sections and topics */
    var TI = {}, topicCount = 0, stepCount = 0, checkCount = 0;
    if (requireArray(data, "sections", "$", 1, 12, error)) {
      data.sections.forEach(function (s, si) {
        var sp = "sections[" + si + "]";
        if (!isObject(s)) { error(sp, "must be an object, got " + describe(s)); return; }
        requireString(s, "title", sp, 1, 60, error);
        if (!requireArray(s, "topics", sp, 1, MAX_TOPICS, error)) return;
        s.topics.forEach(function (t, ti) {
          topicCount++;
          checkTopic(t, sp + ".topics[" + ti + "]");
        });
      });
      if (topicCount > MAX_TOPICS) error("sections", "must have at most " + MAX_TOPICS + " topics in all, got " + topicCount);
      if (topicCount < 2) warn("sections", "fewer than 2 topics in all; the sidebar will be very short");
    }

    function checkTopic(t, p) {
      if (!isObject(t)) { error(p, "must be an object, got " + describe(t)); return; }
      if (requireId(t, "id", p, error)) {
        if (TI[t.id]) error(p + ".id", "duplicate topic id " + JSON.stringify(t.id)); else TI[t.id] = true;
      }
      requireString(t, "title", p, 1, 60, error);
      requireString(t, "subtitle", p, 1, 80, error);
      optionalString(t, "tag", p, 20, error);
      var okFrom = t.availableFrom !== undefined && checkVersionRef(t, "availableFrom", p);
      var okTo = t.removedIn !== undefined && checkVersionRef(t, "removedIn", p);
      if (okFrom && okTo && VI[t.removedIn] <= VI[t.availableFrom]) error(p + ".removedIn", "must be a later version than availableFrom (" + JSON.stringify(t.availableFrom) + ")");

      if (!isObject(t.article)) error(p + ".article", "must be an object, got " + describe(t.article));
      else checkArticle(t.article, p + ".article");

      var touched = {};
      if (requireArray(t, "steps", p, 1, 30, error)) {
        var msgTotal = 0;
        t.steps.forEach(function (st, i) { msgTotal += checkStep(st, p + ".steps[" + i + "]", touched); });
        if (t.steps.length > 12) warn(p + ".steps", "more than 12 steps (" + t.steps.length + "); consider splitting the topic");
        if (msgTotal > 60) warn(p + ".steps", "more than 60 messages in this topic (" + msgTotal + "); the flow table gets long");
        if (Object.keys(touched).length > 8) warn(p, "the steps touch " + Object.keys(touched).length + " entities; the network diagram will be crowded");
      }
    }

    function checkArticle(a, p) {
      if (requireArray(a, "body", p, 1, 8, error)) {
        a.body.forEach(function (b, i) {
          if (typeof b !== "string") error(p + ".body[" + i + "]", "must be a string, got " + describe(b));
          else if (!b.trim()) error(p + ".body[" + i + "]", "must be a non-empty string");
          else if (b.length > 1500) error(p + ".body[" + i + "]", "must be at most 1500 characters, got " + b.length);
        });
      }
      optionalString(a, "referencesLabel", p, 24, error, 1);
      if (a.references !== undefined && requireArray(a, "references", p, 0, 10, error)) {
        a.references.forEach(function (r, i) {
          var rp = p + ".references[" + i + "]";
          if (!isObject(r)) { error(rp, "must be an object, got " + describe(r)); return; }
          requireString(r, "label", rp, 1, 60, error);
          requireUrl(r, "url", rp, error);
        });
      }
      if (a.versionNotes !== undefined && requireArray(a, "versionNotes", p, 0, 8, error)) {
        var seen = {};
        a.versionNotes.forEach(function (n, i) {
          var np = p + ".versionNotes[" + i + "]";
          if (!isObject(n)) { error(np, "must be an object, got " + describe(n)); return; }
          if (checkVersionRef(n, "version", np)) {
            if (seen[n.version]) error(np + ".version", "a second note for version " + JSON.stringify(n.version) + "; one note per version");
            seen[n.version] = true;
          }
          optionalString(n, "heading", np, 80, error, 1);
          if (requireArray(n, "items", np, 1, 8, error)) {
            n.items.forEach(function (it, j) {
              if (typeof it !== "string" || !it.trim()) error(np + ".items[" + j + "]", "must be a non-empty string, got " + describe(it));
              else if (it.length > 300) error(np + ".items[" + j + "]", "must be at most 300 characters, got " + it.length);
            });
          }
        });
      }
      if (a.boxes !== undefined && requireArray(a, "boxes", p, 0, 4, error)) {
        a.boxes.forEach(function (b, i) {
          var bp = p + ".boxes[" + i + "]";
          if (!isObject(b)) { error(bp, "must be an object, got " + describe(b)); return; }
          requireString(b, "title", bp, 1, 60, error);
          optionalEnum(b, "tone", bp, TONES, error);
          if (requireArray(b, "items", bp, 1, 8, error)) {
            b.items.forEach(function (it, j) {
              var ip = bp + ".items[" + j + "]";
              if (!isObject(it)) { error(ip, "must be an object, got " + describe(it)); return; }
              requireString(it, "text", ip, 1, 240, error);
              optionalString(it, "tag", ip, 30, error);
              if (it.url !== undefined) requireUrl(it, "url", ip, error);
            });
          }
        });
      }
    }

    function checkStepFields(st, p, touched, isOverride) {
      var count = 0;
      if (!isOverride || st.title !== undefined) requireString(st, "title", p, 1, 80, error);
      if (!isOverride || st.explanation !== undefined) requireString(st, "explanation", p, 1, 700, error);
      optionalString(st, "tag", p, 20, error);
      if (st.focus !== undefined && requireArray(st, "focus", p, 0, 12, error)) {
        st.focus.forEach(function (f, i) { if (checkEntityRef(st.focus, i, p + ".focus")) touched[f] = true; });
      }
      if (st.messages !== undefined && requireArray(st, "messages", p, 0, 20, error)) {
        st.messages.forEach(function (m, i) { checkMessage(m, p + ".messages[" + i + "]", touched); });
        count = st.messages.length;
      }
      return count;
    }

    function checkStep(st, p, touched) {
      stepCount++;
      if (!isObject(st)) { error(p, "must be an object, got " + describe(st)); return 0; }
      var count = checkStepFields(st, p, touched, false);
      if (!st.messages || st.messages.length === 0) warn(p, "step has no messages; the flow table shows nothing for it");
      if (st.check !== undefined) { checkCount++; checkCheck(st.check, p + ".check"); }
      if (st.versions !== undefined) {
        var vp = p + ".versions";
        if (!isObject(st.versions)) error(vp, "must be an object keyed by version id, got " + describe(st.versions));
        else Object.keys(st.versions).forEach(function (k) {
          var ok = checkVersionId(k, vp + "." + k);
          var ov = st.versions[k], op = vp + "." + k;
          if (ok && !isObject(ov)) { error(op, "must be an object, got " + describe(ov)); return; }
          if (isObject(ov)) {
            Object.keys(ov).forEach(function (f) {
              if (["title", "explanation", "tag", "focus", "messages"].indexOf(f) === -1) error(op + "." + f, "unknown override field; allowed: title, explanation, tag, focus, messages");
            });
            count = Math.max(count, checkStepFields(ov, op, touched, true));
          }
        });
      }
      return count;
    }

    function checkMessage(m, p, touched) {
      if (!isObject(m)) { error(p, "must be an object, got " + describe(m)); return; }
      var okF = checkEntityRef(m, "from", p), okT = checkEntityRef(m, "to", p);
      if (okF) touched[m.from] = true;
      if (okT) touched[m.to] = true;
      if (okF && okT && m.from !== m.to) {
        var k = pairKey(m.from, m.to);
        if (LINKS[k] === undefined) warn(p, "no link declared between " + JSON.stringify(m.from) + " and " + JSON.stringify(m.to) + "; it is drawn dashed and unlabelled");
        else linkUsed[k] = true;
      }
      requireString(m, "name", p, 1, 60, error);
      optionalString(m, "info", p, 120, error);
      optionalEnum(m, "kind", p, MESSAGE_KINDS, error);
      optionalString(m, "size", p, 12, error);
      if (m.payload !== undefined) {
        var pp = p + ".payload", text = null;
        if (typeof m.payload === "string") text = m.payload;
        else if (m.payload !== null && typeof m.payload === "object") { try { text = JSON.stringify(m.payload, null, 2); } catch (e) { error(pp, "could not be serialised as JSON"); } }
        else error(pp, "must be a string, object or array, got " + describe(m.payload));
        if (text !== null) {
          if (text.length > MAX_PAYLOAD) error(pp, "must be at most " + MAX_PAYLOAD + " characters when serialised, got " + text.length);
          else if (text.length > WARN_PAYLOAD) warn(pp, "payload is " + text.length + " characters; over " + WARN_PAYLOAD + " it is hard to read in the panel");
        }
      }
      if (m.annotations !== undefined && requireArray(m, "annotations", p, 0, 12, error)) {
        m.annotations.forEach(function (a, i) {
          var ap = p + ".annotations[" + i + "]";
          if (!isObject(a)) { error(ap, "must be an object, got " + describe(a)); return; }
          requireString(a, "field", ap, 1, 60, error);
          requireString(a, "text", ap, 1, 300, error);
        });
      }
      if (m.tags !== undefined && requireArray(m, "tags", p, 0, 4, error)) {
        m.tags.forEach(function (t, i) {
          if (typeof t !== "string" || !t.trim()) error(p + ".tags[" + i + "]", "must be a non-empty string, got " + describe(t));
          else if (t.length > 20) error(p + ".tags[" + i + "]", "must be at most 20 characters, got " + t.length);
        });
      }
      if (m.versions !== undefined && requireArray(m, "versions", p, 1, 8, error)) {
        var seen = {};
        m.versions.forEach(function (v, i) {
          if (checkVersionRef(m.versions, i, p + ".versions")) {
            if (seen[v]) error(p + ".versions[" + i + "]", "duplicate version id " + JSON.stringify(v));
            seen[v] = true;
          }
        });
      }
    }

    function checkCheck(c, p) {
      if (!isObject(c)) { error(p, "must be an object, got " + describe(c)); return; }
      if (requireString(c, "prompt", p, 1, 300, error) && !/\?\s*$/.test(c.prompt)) warn(p + ".prompt", "does not end with a question mark");
      if (!requireArray(c, "options", p, 2, 4, error)) return;
      var correct = 0, texts = {};
      c.options.forEach(function (o, i) {
        var op = p + ".options[" + i + "]";
        if (!isObject(o)) { error(op, "must be an object, got " + describe(o)); return; }
        if (requireString(o, "text", op, 1, 200, error)) {
          var key = o.text.trim().toLowerCase();
          if (texts[key]) error(op + ".text", "duplicate option text " + JSON.stringify(o.text));
          texts[key] = true;
        }
        if (o.correct !== undefined && typeof o.correct !== "boolean") error(op + ".correct", "must be a boolean, got " + describe(o.correct));
        if (o.correct === true) correct++;
        requireString(o, "why", op, 1, 400, error);
      });
      if (correct !== 1) error(p + ".options", "exactly one option must have correct: true, got " + correct);
    }

    /* jumps */
    if (data.jumps !== undefined && requireArray(data, "jumps", "$", 0, 4, error)) {
      var seenJ = {};
      data.jumps.forEach(function (j, i) {
        var jp = "jumps[" + i + "]";
        if (typeof j !== "string") error(jp, "must be a topic id string, got " + describe(j));
        else if (!TI[j]) error(jp, "topic id " + JSON.stringify(j) + " is not defined in sections");
        else if (seenJ[j]) error(jp, "duplicate topic id " + JSON.stringify(j));
        seenJ[j] = true;
      });
    }

    /* further */
    if (data.further !== undefined) {
      var fp = "further";
      if (!isObject(data.further)) error(fp, "must be an object, got " + describe(data.further));
      else {
        optionalString(data.further, "title", fp, 60, error, 1);
        if (requireArray(data.further, "items", fp, 1, 10, error)) {
          data.further.items.forEach(function (it, i) {
            var ip = fp + ".items[" + i + "]";
            if (!isObject(it)) { error(ip, "must be an object, got " + describe(it)); return; }
            requireString(it, "title", ip, 1, 60, error);
            optionalString(it, "subtitle", ip, 80, error);
            requireUrl(it, "url", ip, error);
          });
        }
      }
    }

    /* document-wide warnings */
    if (Array.isArray(data.entities)) data.entities.forEach(function (e, i) {
      if (isObject(e) && typeof e.id === "string" && EI[e.id] && !entityUsed[e.id]) warn("entities[" + i + "]", "entity " + JSON.stringify(e.id) + " is never used by a message or focus");
    });
    if (Array.isArray(data.zones)) data.zones.forEach(function (z, i) {
      if (isObject(z) && typeof z.id === "string" && ZI[z.id] && !zoneUsed[z.id]) warn("zones[" + i + "]", "zone " + JSON.stringify(z.id) + " has no entities");
    });
    if (Array.isArray(data.links)) data.links.forEach(function (l, i) {
      if (isObject(l) && typeof l.from === "string" && typeof l.to === "string" && EI[l.from] && EI[l.to] && l.from !== l.to && !linkUsed[pairKey(l.from, l.to)]) warn("links[" + i + "]", "no message travels between " + JSON.stringify(l.from) + " and " + JSON.stringify(l.to));
    });
    if (hasVersions && versionRefs === 0) warn("versions", "declared but nothing references a version; the time machine changes nothing");
    if (stepCount >= 10 && checkCount === 0) warn("sections", stepCount + " steps and no check; add a prediction question or two");
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
    if (typeof key === "number") return parent + "[" + key + "]";
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
  // ---- extra helpers for this view ---------------------------------------
  function isObject(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
  function optionalString(obj, key, parent, max, error, min) {
    if (obj[key] === undefined) return true;
    return requireString(obj, key, parent, min || 0, max, error);
  }
  function optionalEnum(obj, key, parent, allowed, error) {
    var v = obj[key];
    if (v === undefined) return true;
    if (allowed.indexOf(v) === -1) { error(join(parent, key), "must be one of " + allowed.join(", ") + ", got " + describe(v)); return false; }
    return true;
  }
  function requireId(obj, key, parent, error) {
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "string") { error(path, "must be a string id, got " + describe(v)); return false; }
    if (!KEBAB.test(v) || v.length > 40) { error(path, "must be lowercase kebab-case, 1–40 characters, got " + JSON.stringify(v)); return false; }
    return true;
  }
  function requireUrl(obj, key, parent, error) {
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "string") { error(path, "must be a URL string, got " + describe(v)); return false; }
    if (!URL_RE.test(v) || v.length > 500) { error(path, "must start with https:// or http:// and be at most 500 characters, got " + JSON.stringify(v.slice(0, 40))); return false; }
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
