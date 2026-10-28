/* NthView — sequence validator — schemaVersion 1
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
  var THEMES = ["paper", "slate", "blueprint", "mint"];
  var KINDS = ["person", "browser", "app", "server", "service", "database", "device", "other"];
  var COLORS = ["slate", "amber", "green", "blue", "red", "teal", "violet", "pink"];
  var STEP_KINDS = ["sync", "async", "return", "self"];
  var SEVERITIES = ["info", "warning", "danger"];
  var FRAGMENT_KINDS = ["alt", "opt", "loop"];
  var MAX_HOLDS = 12;

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
    optionalString(data, "subtitle", "$", 300, error);
    if (data.theme !== undefined && THEMES.indexOf(data.theme) === -1) {
      error("theme", "must be one of " + THEMES.join(", ") + "; got " + describe(data.theme) + " (or omit it to derive one from the title)");
    }
    optionalString(data, "compareLabel", "$", 60, error);
    optionalStringArray(data, "closing", "$", 0, 4, 600, error);

    /* glossary first: every ((term)) in the text is checked against it */
    var terms = [], termUsed = {};
    if (optionalArray(data, "glossary", "$", 0, 40, error)) {
      (data.glossary || []).forEach(function (g, i) {
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
    function marks(text, path) {
      if (typeof text !== "string") return;
      var re = /\(\(([^()]*)\)\)/g, m;
      while ((m = re.exec(text))) {
        var parts = m[1].split("|"), term = parts[parts.length - 1].trim().toLowerCase();
        if (parts.length > 2 || !term || !parts[0].trim()) { error(path, "glossary mark ((" + m[1] + ")) must be ((term)) or ((shown text|term))"); continue; }
        if (terms.indexOf(term) === -1) error(path, "glossary mark ((" + m[1] + ")) names " + describe(parts[parts.length - 1].trim()) + ", which is not a glossary term" + (terms.length ? " (terms: " + terms.join(", ") + ")" : " (the document has no glossary)"));
        else termUsed[term] = true;
      }
    }
    marks(data.subtitle, "subtitle");
    if (Array.isArray(data.closing)) data.closing.forEach(function (t, i) { marks(t, "closing[" + i + "]"); });
    if (Array.isArray(data.glossary)) data.glossary.forEach(function (g, i) { if (g) marks(g.definition, "glossary[" + i + "].definition"); });

    /* zones */
    var zoneIds = [];
    if (optionalArray(data, "zones", "$", 0, 6, error)) {
      (data.zones || []).forEach(function (z, i) {
        var p = "zones[" + i + "]";
        if (!isObject(z, p, error)) return;
        checkId(z, p, zoneIds, "zone", error);
        requireString(z, "name", p, 1, 40, error);
        optionalString(z, "description", p, 200, error);
      });
    }

    /* participants */
    var pids = [], participants = Array.isArray(data.participants) ? data.participants : [];
    var initialHolds = {};
    if (requireArray(data, "participants", "$", 2, 8, error)) {
      participants.forEach(function (pt, i) {
        var p = "participants[" + i + "]";
        if (!isObject(pt, p, error)) return;
        checkId(pt, p, pids, "participant", error);
        requireString(pt, "name", p, 1, 32, error);
        optionalString(pt, "role", p, 60, error);
        if (pt.kind !== undefined && KINDS.indexOf(pt.kind) === -1) error(p + ".kind", "must be one of " + KINDS.join(", ") + "; got " + describe(pt.kind));
        if (pt.zone !== undefined) {
          if (typeof pt.zone !== "string") error(p + ".zone", "must be a zone id string, got " + describe(pt.zone));
          else if (zoneIds.indexOf(pt.zone) === -1) error(p + ".zone", "zone id " + describe(pt.zone) + " is not defined in zones" + (zoneIds.length ? " (zones: " + zoneIds.join(", ") + ")" : " (the document has no zones)"));
        }
        if (pt.holds !== undefined && checkItemList(pt.holds, p + ".holds", 0, MAX_HOLDS, error)) {
          var seen = [];
          pt.holds.forEach(function (h, k) {
            if (seen.indexOf(h) !== -1) error(p + ".holds[" + k + "]", "duplicate item " + describe(h) + "; each item is held once");
            seen.push(h);
          });
          if (typeof pt.id === "string") initialHolds[pt.id] = seen.slice();
        }
      });
      if (participants.length > 6) warn("participants", participants.length + " participants make narrow lanes on a phone; 2–6 read best");
    }
    /* zones that are empty or split */
    if (Array.isArray(data.zones)) {
      data.zones.forEach(function (z, i) {
        if (!z || typeof z.id !== "string") return;
        var idx = [];
        participants.forEach(function (pt, k) { if (pt && pt.zone === z.id) idx.push(k); });
        if (!idx.length) warn("zones[" + i + "]", "zone " + describe(z.id) + " has no participants");
        else if (idx[idx.length - 1] - idx[0] + 1 !== idx.length) warn("zones[" + i + "]", "the participants of zone " + describe(z.id) + " are not next to each other, so the zone is drawn as separate bands; reorder participants to keep it together");
      });
    }

    /* channels */
    var cids = [];
    if (requireArray(data, "channels", "$", 1, 8, error)) {
      data.channels.forEach(function (c, i) {
        var p = "channels[" + i + "]";
        if (!isObject(c, p, error)) return;
        checkId(c, p, cids, "channel", error);
        requireString(c, "name", p, 1, 60, error);
        if (COLORS.indexOf(c.color) === -1) error(p + ".color", "must be one of " + COLORS.join(", ") + "; got " + describe(c.color));
        optionalString(c, "description", p, 240, error);
      });
    }

    /* steps */
    var steps = Array.isArray(data.steps) ? data.steps : [];
    var N = steps.length, stepsOk = requireArray(data, "steps", "$", 2, 60, error);
    var usedP = {}, usedC = {}, anyCheck = false;
    if (stepsOk) {
      steps.forEach(function (s, i) {
        var p = "steps[" + i + "]";
        if (!isObject(s, p, error)) return;
        ["from", "to"].forEach(function (k) {
          if (typeof s[k] !== "string") error(p + "." + k, "must be a participant id string, got " + describe(s[k]));
          else if (pids.indexOf(s[k]) === -1) error(p + "." + k, "participant id " + describe(s[k]) + " is not defined in participants (ids: " + pids.join(", ") + ")");
          else usedP[s[k]] = true;
        });
        if (typeof s.channel !== "string") error(p + ".channel", "must be a channel id string, got " + describe(s.channel));
        else if (cids.indexOf(s.channel) === -1) error(p + ".channel", "channel id " + describe(s.channel) + " is not defined in channels (ids: " + cids.join(", ") + ")");
        else usedC[s.channel] = true;
        if (requireString(s, "payload", p, 1, 40, error) && s.payload.length > 24) warn(p + ".payload", "is " + s.payload.length + " characters; 24 or fewer fit on the arrow without crowding");
        requireString(s, "title", p, 1, 120, error);
        if (s.wire === undefined) warn(p + ".wire", "no wire block; showing what actually travels is what makes this view concrete");
        else optionalString(s, "wire", p, 3000, error);
        if (requireString(s, "why", p, 1, 800, error)) marks(s.why, p + ".why");
        if (s.kind !== undefined) {
          if (STEP_KINDS.indexOf(s.kind) === -1) error(p + ".kind", "must be one of " + STEP_KINDS.join(", ") + "; got " + describe(s.kind));
          else if (s.kind === "self" && typeof s.from === "string" && s.from !== s.to) error(p + ".kind", "is \"self\" but from " + describe(s.from) + " and to " + describe(s.to) + " differ; a self step has from equal to to");
          else if (s.kind !== "self" && typeof s.from === "string" && s.from === s.to) error(p + ".kind", "is " + describe(s.kind) + " but from and to are both " + describe(s.from) + "; use \"self\" or omit kind");
        }
        if (s.compare !== undefined && isObject(s.compare, p + ".compare", error)) {
          requireString(s.compare, "label", p + ".compare", 1, 60, error);
          if (requireString(s.compare, "text", p + ".compare", 1, 600, error)) marks(s.compare.text, p + ".compare.text");
        }
        if (s.detail !== undefined && requireArray(s, "detail", p, 1, 8, error)) {
          s.detail.forEach(function (d, k) {
            var dp = p + ".detail[" + k + "]";
            if (!isObject(d, dp, error)) return;
            requireString(d, "label", dp, 1, 40, error);
            if (requireString(d, "text", dp, 1, 600, error)) marks(d.text, dp + ".text");
          });
        }
        if (s.note !== undefined && isObject(s.note, p + ".note", error)) {
          if (SEVERITIES.indexOf(s.note.severity) === -1) error(p + ".note.severity", "must be one of " + SEVERITIES.join(", ") + "; got " + describe(s.note.severity));
          if (requireString(s.note, "text", p + ".note", 1, 300, error)) marks(s.note.text, p + ".note.text");
        }
        if (s.holds !== undefined) checkStepHolds(s, p, pids, error);
        if (s.check !== undefined) { anyCheck = true; checkCheck(s, p, pids, error, marks); }
      });
      if (N < 3) warn("steps", "only " + N + " steps; a sequence usually needs 4 or more to teach");
      if (N >= 6 && !anyCheck) warn("steps", "no step has a check; one or two light \"who sends next?\" checks help the learner predict");
      participants.forEach(function (pt, i) { if (pt && typeof pt.id === "string" && !usedP[pt.id]) warn("participants[" + i + "]", "participant " + describe(pt.id) + " never sends or receives a step"); });
      (Array.isArray(data.channels) ? data.channels : []).forEach(function (c, i) { if (c && typeof c.id === "string" && !usedC[c.id]) warn("channels[" + i + "]", "channel " + describe(c.id) + " is not used by any step"); });
    }

    /* fragments */
    var frags = [], fragsOk = true;
    if (optionalArray(data, "fragments", "$", 0, 20, error)) {
      (data.fragments || []).forEach(function (f, i) {
        var p = "fragments[" + i + "]";
        if (!isObject(f, p, error)) { fragsOk = false; return; }
        var ok = true;
        if (FRAGMENT_KINDS.indexOf(f.kind) === -1) { error(p + ".kind", "must be one of " + FRAGMENT_KINDS.join(", ") + "; got " + describe(f.kind)); ok = false; }
        optionalString(f, "label", p, 40, error);
        if (!checkIndex(f, "start", p, N, error)) ok = false;
        if (!checkIndex(f, "end", p, N, error)) ok = false;
        if (ok && f.end < f.start) { error(p + ".end", "step index " + f.end + " is before start " + f.start + "; end must be greater than or equal to start"); ok = false; }
        if (f.kind === "alt") {
          if (f.condition !== undefined) error(p + ".condition", "an alt fragment puts its conditions on branches[].condition, not on the fragment");
          if (requireArray(f, "branches", p, 2, 4, error)) {
            f.branches.forEach(function (b, k) {
              var bp = p + ".branches[" + k + "]";
              if (!isObject(b, bp, error)) { ok = false; return; }
              requireString(b, "condition", bp, 1, 80, error);
              if (!checkIndex(b, "start", bp, N, error)) ok = false;
              if (!checkIndex(b, "end", bp, N, error)) ok = false;
            });
            if (ok) {
              var br = f.branches;
              if (br[0].start !== f.start) { error(p + ".branches[0].start", "must equal the fragment start " + f.start + ", got " + br[0].start); ok = false; }
              if (br[br.length - 1].end !== f.end) { error(p + ".branches[" + (br.length - 1) + "].end", "must equal the fragment end " + f.end + ", got " + br[br.length - 1].end); ok = false; }
              br.forEach(function (b, k) {
                if (b.end < b.start) { error(p + ".branches[" + k + "].end", "step index " + b.end + " is before start " + b.start); ok = false; }
                if (k > 0 && b.start !== br[k - 1].end + 1) { error(p + ".branches[" + k + "].start", "must be " + (br[k - 1].end + 1) + " (the step after branch " + (k - 1) + " ends) so the branches follow each other, got " + b.start); ok = false; }
              });
            }
          } else ok = false;
        } else if (FRAGMENT_KINDS.indexOf(f.kind) !== -1) {
          requireString(f, "condition", p, 1, 80, error);
          if (f.branches !== undefined) error(p + ".branches", "only an alt fragment has branches; " + f.kind + " uses condition");
        }
        if (ok) frags.push({ i: i, f: f }); else fragsOk = false;
      });
      /* nesting: separate or contained; a fragment inside an alt lies inside one branch */
      frags.forEach(function (a) {
        frags.forEach(function (b) {
          if (a.i >= b.i) return;
          var A = a.f, B = b.f;
          var separate = A.end < B.start || B.end < A.start;
          var aInB = A.start >= B.start && A.end <= B.end, bInA = B.start >= A.start && B.end <= A.end;
          if (!separate && !aInB && !bInA) {
            error("fragments[" + b.i + "]", "steps " + B.start + "–" + B.end + " partly overlap fragments[" + a.i + "] (steps " + A.start + "–" + A.end + "); fragments must be nested or separate");
            fragsOk = false; return;
          }
          var outer = null, inner = null, innerI = -1, outerI = -1;
          if (bInA && !(aInB)) { outer = A; inner = B; innerI = b.i; outerI = a.i; }
          else if (aInB && !bInA) { outer = B; inner = A; innerI = a.i; outerI = b.i; }
          else if (aInB && bInA) { outer = A; inner = B; innerI = b.i; outerI = a.i; }
          if (outer && outer.kind === "alt") {
            var inOne = outer.branches.some(function (br) { return inner.start >= br.start && inner.end <= br.end; });
            if (!inOne) { error("fragments[" + innerI + "]", "steps " + inner.start + "–" + inner.end + " cross a branch boundary of the alt fragments[" + outerI + "]; a nested fragment must lie inside one branch"); fragsOk = false; }
          }
        });
      });
    }

    /* holds simulation: needs valid steps, participants and fragments */
    if (stepsOk && fragsOk && Array.isArray(data.participants)) {
      simulateHolds(data, initialHolds, error, warn);
    }

    if (Array.isArray(data.glossary)) {
      data.glossary.forEach(function (g, i) {
        if (g && typeof g.term === "string" && !termUsed[g.term.trim().toLowerCase()]) warn("glossary[" + i + "].term", "term " + describe(g.term) + " is never marked with ((...)) in the text; marking it lets the learner tap it for the definition");
      });
    }
  }

  function checkId(obj, path, list, what, error) {
    if (!requireString(obj, "id", path, 1, 40, error)) return;
    if (!KEBAB.test(obj.id)) error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(obj.id));
    else if (list.indexOf(obj.id) !== -1) error(path + ".id", "duplicate " + what + " id " + describe(obj.id) + "; ids must be unique");
    else list.push(obj.id);
  }
  function checkIndex(obj, key, parent, N, error) {
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "number" || !isFinite(v) || Math.floor(v) !== v) { error(path, "must be an integer step index, got " + describe(v)); return false; }
    if (v < 0 || v >= N) { error(path, "step index " + v + " is out of range (" + N + " steps, valid indexes are 0–" + (N - 1) + ")"); return false; }
    return true;
  }
  function checkItemList(v, path, min, max, error) {
    if (!Array.isArray(v)) { error(path, "must be an array of strings, got " + describe(v)); return false; }
    if (v.length < min) { error(path, "must have at least " + min + " item(s), got " + v.length); return false; }
    if (v.length > max) { error(path, "must have at most " + max + " item(s), got " + v.length); return false; }
    var ok = true;
    v.forEach(function (s, k) { if (!checkStr(s, path + "[" + k + "]", 1, 60, error)) ok = false; });
    return ok;
  }

  function checkStepHolds(s, p, pids, error) {
    var hp = p + ".holds";
    if (!isObject(s.holds, hp, error)) return;
    var keys = Object.keys(s.holds);
    if (!keys.length) error(hp, "must name at least one participant; omit holds when nothing changes");
    keys.forEach(function (id) {
      var ip = hp + "." + id, h = s.holds[id];
      if (pids.indexOf(id) === -1) { error(ip, "participant id " + describe(id) + " is not defined in participants (ids: " + pids.join(", ") + ")"); return; }
      if (!isObject(h, ip, error)) return;
      Object.keys(h).forEach(function (k) { if (k !== "add" && k !== "remove") error(ip + "." + k, "unknown key; a holds change has only add and remove"); });
      var a = h.add === undefined || checkItemList(h.add, ip + ".add", 0, MAX_HOLDS, error);
      var r = h.remove === undefined || checkItemList(h.remove, ip + ".remove", 0, MAX_HOLDS, error);
      if (a && r && !((h.add || []).length + (h.remove || []).length)) error(ip, "must add or remove at least one item");
      if (a && r && h.add && h.remove) h.add.forEach(function (x, k) { if (h.remove.indexOf(x) !== -1) error(ip + ".add[" + k + "]", describe(x) + " is both added and removed in this step"); });
    });
  }

  /* Holds are cumulative from participants[].holds. Removes apply before adds. A non-first
     branch of an alt starts from the state before the alt and does not carry forward; after
     the alt the state is that at the end of its first branch. Mirrors computeHolds in view.js. */
  function simulateHolds(data, initial, error, warn) {
    var steps = data.steps, N = steps.length, frags = data.fragments || [];
    var state = {};
    data.participants.forEach(function (pt) { if (pt && typeof pt.id === "string") state[pt.id] = (initial[pt.id] || []).slice(); });
    function clone(st) { var o = {}; Object.keys(st).forEach(function (k) { o[k] = st[k].slice(); }); return o; }
    var alts = frags.map(function (f, i) { return { f: f, i: i }; }).filter(function (x) { return x.f.kind === "alt"; });
    var startSnap = {}, firstEnd = {};
    for (var i = 0; i <= N; i++) {
      /* alts that ended at i-1, innermost first */
      alts.filter(function (x) { return x.f.end === i - 1; })
        .sort(function (a, b) { return (a.f.end - a.f.start) - (b.f.end - b.f.start) || b.i - a.i; })
        .forEach(function (x) { if (firstEnd[x.i]) state = clone(firstEnd[x.i]); });
      if (i === N) break;
      /* a later branch starts here */
      alts.forEach(function (x) {
        x.f.branches.forEach(function (br, k) {
          if (k > 0 && br.start === i) { if (k === 1) firstEnd[x.i] = clone(state); state = clone(startSnap[x.i]); }
        });
      });
      /* alts starting here, outermost first */
      alts.filter(function (x) { return x.f.start === i; })
        .sort(function (a, b) { return (b.f.end - b.f.start) - (a.f.end - a.f.start) || a.i - b.i; })
        .forEach(function (x) { startSnap[x.i] = clone(state); });
      var s = steps[i];
      if (!s || !s.holds || typeof s.holds !== "object") continue;
      Object.keys(s.holds).forEach(function (id) {
        var h = s.holds[id];
        if (!state[id] || !h || typeof h !== "object") return;
        (Array.isArray(h.remove) ? h.remove : []).forEach(function (x, k) {
          var at = state[id].indexOf(x);
          if (at === -1) error("steps[" + i + "].holds." + id + ".remove[" + k + "]", describe(x) + " is not held by " + describe(id) + " at this step (it holds: " + (state[id].length ? state[id].join(", ") : "nothing") + ")");
          else state[id].splice(at, 1);
        });
        (Array.isArray(h.add) ? h.add : []).forEach(function (x, k) {
          if (state[id].indexOf(x) !== -1) warn("steps[" + i + "].holds." + id + ".add[" + k + "]", describe(id) + " already holds " + describe(x) + "; it is not marked as new");
          else state[id].push(x);
        });
        if (state[id].length > MAX_HOLDS) warn("steps[" + i + "].holds." + id, describe(id) + " now holds " + state[id].length + " items; more than " + MAX_HOLDS + " crowd the strip, so remove what it no longer needs");
      });
    }
  }

  function checkCheck(s, p, pids, error, marks) {
    var cp = p + ".check", c = s.check;
    if (!isObject(c, cp, error)) return;
    if (c.type === "who") {
      optionalString(c, "prompt", cp, 200, error);
      if (c.why !== undefined && optionalString(c, "why", cp, 500, error)) marks(c.why, cp + ".why");
      if (typeof c.answer !== "string") error(cp + ".answer", "must be the id of the participant who sends this step, got " + describe(c.answer));
      else if (pids.indexOf(c.answer) === -1) error(cp + ".answer", "participant id " + describe(c.answer) + " is not defined in participants (ids: " + pids.join(", ") + ")");
      else if (typeof s.from === "string" && pids.indexOf(s.from) !== -1 && c.answer !== s.from) error(cp + ".answer", describe(c.answer) + " does not send this step; " + p + ".from is " + describe(s.from) + ", so the answer must be " + describe(s.from));
      if (c.options !== undefined) error(cp + ".options", "a \"who\" check takes its options from the participants; remove options or use type \"choice\"");
    } else if (c.type === "choice") {
      if (requireString(c, "prompt", cp, 1, 300, error)) marks(c.prompt, cp + ".prompt");
      if (c.answer !== undefined) error(cp + ".answer", "a \"choice\" check marks its answer with options[].correct; remove answer");
      if (requireArray(c, "options", cp, 2, 4, error)) {
        var correct = 0, texts = [];
        c.options.forEach(function (o, k) {
          var op = cp + ".options[" + k + "]";
          if (!isObject(o, op, error)) return;
          if (requireString(o, "text", op, 1, 200, error)) {
            marks(o.text, op + ".text");
            var key = o.text.trim().toLowerCase();
            if (texts.indexOf(key) !== -1) error(op + ".text", "duplicate option text " + describe(o.text));
            texts.push(key);
          }
          optionalBool(o, "correct", op, error);
          if (requireString(o, "why", op, 1, 500, error)) marks(o.why, op + ".why");
          if (o.correct === true) correct++;
        });
        if (correct !== 1) error(cp + ".options", "exactly one option must have \"correct\": true, found " + correct);
      }
    } else {
      error(cp + ".type", "must be \"who\" or \"choice\", got " + describe(c.type));
    }
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
  function optionalArray(obj, key, parent, min, max, error) {
    if (obj[key] === undefined) return true;
    return requireArray(obj, key, parent, min, max, error);
  }
  function optionalStringArray(obj, key, parent, min, max, maxChars, error) {
    if (obj[key] === undefined) return true;
    if (!requireArray(obj, key, parent, min, max, error)) return false;
    var ok = true;
    obj[key].forEach(function (s, i) { if (!checkStr(s, join(parent, key) + "[" + i + "]", 1, maxChars, error)) ok = false; });
    return ok;
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
