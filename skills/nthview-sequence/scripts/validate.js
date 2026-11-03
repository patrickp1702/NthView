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
  var FRAGMENT_KINDS = ["alt", "opt", "loop", "group"];
  var MAX_HOLDS = 12;
  var MAX_DEPTH = 6, WARN_DEPTH = 3, MAX_INNER_LANES = 8;
  var ROOT_ONLY = ["schemaVersion", "title", "theme", "compareLabel", "zones", "closing"];

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

    /* zones live at the top level only; inner participants may name them */
    var ctx = { error: error, warn: warn, zoneIds: [], ids: {}, terms: {}, termList: [], termUsed: {}, members: [], usedIds: {}, chanUsed: {} };
    if (optionalArray(data, "zones", "$", 0, 6, error)) {
      (data.zones || []).forEach(function (z, i) {
        var p = "zones[" + i + "]";
        if (!isObject(z, p, error)) return;
        checkId(z, p, ctx.zoneIds, "zone", error);
        requireString(z, "name", p, 1, 40, error);
        optionalString(z, "description", p, 200, error);
      });
    }

    var top = checkSeq(data, "$", 0, null, null, ctx);
    top.marks(data.subtitle, "subtitle");
    if (Array.isArray(data.closing)) data.closing.forEach(function (t, i) { top.marks(t, "closing[" + i + "]"); });

    /* zones that are empty or split (top-level participants) */
    var participants = Array.isArray(data.participants) ? data.participants : [];
    if (Array.isArray(data.zones)) {
      data.zones.forEach(function (z, i) {
        if (!z || typeof z.id !== "string") return;
        var idx = [];
        participants.forEach(function (pt, k) { if (pt && pt.zone === z.id) idx.push(k); });
        if (!idx.length) warn("zones[" + i + "]", "zone " + describe(z.id) + " has no participants");
        else if (idx[idx.length - 1] - idx[0] + 1 !== idx.length) warn("zones[" + i + "]", "the participants of zone " + describe(z.id) + " are not next to each other, so the zone is drawn as separate bands; reorder participants to keep it together");
      });
    }
    ctx.termList.forEach(function (t) {
      if (!ctx.termUsed[t.key]) warn(t.path, "term " + describe(t.term) + " is never marked with ((...)) in the text; marking it lets the learner tap it for the definition");
    });
    ctx.members.forEach(function (m) {
      if (!ctx.usedIds[m.id]) warn(m.path, "member " + describe(m.id) + " never sends or receives a step at any level; an inner sequence shows what members do");
    });
  }

  /* One sequence level: the top level (base "$", depth 0) or a step's inner sequence
     (base "steps[i].inner", depth 1+). Every rule applies at every level. */
  function checkSeq(seq, base, depth, parent, init, ctx) {
    var error = ctx.error, warn = ctx.warn, inner = depth > 0;
    function at(x) { return base === "$" ? x : base + "." + x; }

    if (inner) {
      ROOT_ONLY.forEach(function (k) {
        if (seq[k] !== undefined) error(at(k), "is only allowed at the top level of the document, not in an inner sequence (an inner sequence takes its heading from its parent step)");
      });
      optionalString(seq, "subtitle", base, 300, error);
    }

    /* glossary first: every ((term)) at this level is checked against it and the levels around it */
    var terms = parent ? parent.terms.slice() : [];
    if (optionalArray(seq, "glossary", base, 0, 40, error)) {
      (seq.glossary || []).forEach(function (g, i) {
        var p = at("glossary[" + i + "]");
        if (!isObject(g, p, error)) return;
        if (requireString(g, "term", p, 1, 40, error)) {
          var key = g.term.trim().toLowerCase(), prev = ctx.terms[key];
          if (prev && prev.base === base) error(p + ".term", "duplicate glossary term " + describe(g.term) + "; terms must be unique (ignoring case)");
          else if (prev) error(p + ".term", "glossary term " + describe(g.term) + " is already defined at " + prev.path + "; terms are unique across the whole document, inner sequences included");
          else { ctx.terms[key] = { base: base, path: p + ".term" }; terms.push(key); ctx.termList.push({ term: g.term, key: key, path: p + ".term" }); }
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
        else ctx.termUsed[term] = true;
      }
    }
    if (inner) marks(seq.subtitle, at("subtitle"));
    if (Array.isArray(seq.glossary)) seq.glossary.forEach(function (g, i) { if (g) marks(g.definition, at("glossary[" + i + "].definition")); });

    /* participants: ids unique across the whole tree; groups carry 2–12 members */
    var own = Array.isArray(seq.participants) ? seq.participants : [];
    var visible = {}, hereMember = {}, groupsHere = [];
    if (parent) Object.keys(parent.visible).forEach(function (k) { visible[k] = true; });
    var state0 = {};
    if (init) Object.keys(init).forEach(function (k) { state0[k] = init[k].slice(); });
    var pOk = inner ? optionalArray(seq, "participants", base, 0, 8, error) : requireArray(seq, "participants", base, 2, 8, error);
    if (pOk) {
      own.forEach(function (pt, i) {
        var p = at("participants[" + i + "]");
        if (!isObject(pt, p, error)) return;
        var idOk = checkTreeId(pt, p, ctx);
        requireString(pt, "name", p, 1, 32, error);
        optionalString(pt, "role", p, 60, error);
        var isGroup = pt.kind === "group";
        if (pt.kind !== undefined && !isGroup && KINDS.indexOf(pt.kind) === -1) error(p + ".kind", "must be one of " + KINDS.concat(["group"]).join(", ") + "; got " + describe(pt.kind));
        if (idOk) { visible[pt.id] = true; state0[pt.id] = []; }
        if (isGroup) {
          var memberIds = [];
          requireArray(pt, "members", p, 2, 12, error);
          if (Array.isArray(pt.members)) {
            pt.members.forEach(function (m, k) {
              var mp = p + ".members[" + k + "]";
              if (!isObject(m, mp, error)) return;
              var mOk = checkTreeId(m, mp, ctx);
              requireString(m, "name", mp, 1, 32, error);
              optionalString(m, "role", mp, 60, error);
              if (m.kind !== undefined && KINDS.indexOf(m.kind) === -1) error(mp + ".kind", m.kind === "group" ? "a member cannot itself be a group; declare it as a participant of an inner sequence to give it members" : "must be one of " + KINDS.join(", ") + "; got " + describe(m.kind));
              ["holds", "members", "zone"].forEach(function (x) { if (m[x] !== undefined) error(mp + "." + x, "a member has only id, name, role and kind; it starts holding nothing and sits in its group's zone"); });
              if (mOk) { visible[m.id] = true; state0[m.id] = []; memberIds.push(m.id); if (idOk) hereMember[m.id] = pt.id; ctx.members.push({ id: m.id, path: mp }); }
            });
          }
          if (idOk) groupsHere.push({ id: pt.id, path: p, members: memberIds });
        } else if (pt.members !== undefined) {
          error(p + ".members", "only a participant with kind \"group\" has members; set kind to \"group\" or remove members");
        }
        if (pt.zone !== undefined) {
          if (typeof pt.zone !== "string") error(p + ".zone", "must be a zone id string, got " + describe(pt.zone));
          else if (ctx.zoneIds.indexOf(pt.zone) === -1) error(p + ".zone", "zone id " + describe(pt.zone) + " is not defined in zones" + (ctx.zoneIds.length ? " (zones: " + ctx.zoneIds.join(", ") + ")" : " (the document has no zones)"));
        }
        if (pt.holds !== undefined && checkItemList(pt.holds, p + ".holds", 0, MAX_HOLDS, error)) {
          var seen = [];
          pt.holds.forEach(function (h, k) {
            if (seen.indexOf(h) !== -1) error(p + ".holds[" + k + "]", "duplicate item " + describe(h) + "; each item is held once");
            seen.push(h);
          });
          if (idOk) state0[pt.id] = seen.slice();
        }
      });
      if (!inner && own.length > 6) warn("participants", own.length + " participants make narrow lanes on a phone; 2–6 read best");
    }
    var vis = Object.keys(visible);
    function unknownP(id) {
      return "participant id " + describe(id) + (inner ? " is not visible in this inner sequence (its own participants, group members and the participants of the sequences around it: " : " is not defined in participants" + (groupsHere.length ? " or their members" : "") + " (ids: ") + vis.join(", ") + ")";
    }

    /* channels: inherited from the enclosing sequences, extended here */
    var chans = parent ? parent.channels.slice() : [], ownC = [];
    var cOk = inner ? optionalArray(seq, "channels", base, 0, 8, error) : requireArray(seq, "channels", base, 1, 8, error);
    if (cOk) {
      (seq.channels || []).forEach(function (c, i) {
        var p = at("channels[" + i + "]");
        if (!isObject(c, p, error)) return;
        if (requireString(c, "id", p, 1, 40, error)) {
          if (!KEBAB.test(c.id)) error(p + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(c.id));
          else if (ownC.indexOf(c.id) !== -1) error(p + ".id", "duplicate channel id " + describe(c.id) + "; ids must be unique");
          else if (chans.indexOf(c.id) !== -1) error(p + ".id", "channel id " + describe(c.id) + " is already defined by an enclosing sequence; inner sequences inherit those channels, so reuse it or pick a new id");
          else { chans.push(c.id); ownC.push({ id: c.id, path: p }); }
        }
        requireString(c, "name", p, 1, 60, error);
        if (COLORS.indexOf(c.color) === -1) error(p + ".color", "must be one of " + COLORS.join(", ") + "; got " + describe(c.color));
        optionalString(c, "description", p, 240, error);
      });
    }

    /* steps */
    var steps = Array.isArray(seq.steps) ? seq.steps : [];
    var N = steps.length, stepsOk = requireArray(seq, "steps", base, 2, 60, error);
    var usedHere = {}, anyCheck = false, inners = [];
    if (stepsOk) {
      steps.forEach(function (s, i) {
        var p = at("steps[" + i + "]");
        if (!isObject(s, p, error)) return;
        ["from", "to"].forEach(function (k) {
          if (typeof s[k] !== "string") error(p + "." + k, "must be a participant id string, got " + describe(s[k]));
          else if (!visible[s[k]]) error(p + "." + k, unknownP(s[k]));
          else { usedHere[s[k]] = true; ctx.usedIds[s[k]] = true; }
        });
        if (typeof s.channel !== "string") error(p + ".channel", "must be a channel id string, got " + describe(s.channel));
        else if (chans.indexOf(s.channel) === -1) error(p + ".channel", "channel id " + describe(s.channel) + " is not defined in channels" + (inner ? " here or in an enclosing sequence" : "") + " (ids: " + chans.join(", ") + ")");
        else ctx.chanUsed[s.channel] = true;
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
        if (s.holds !== undefined) checkStepHolds(s, p, visible, unknownP, error);
        if (s.check !== undefined) { anyCheck = true; checkCheck(s, p, visible, unknownP, error, marks); }
        if (s.inner !== undefined && isObject(s.inner, p + ".inner", error)) {
          if (depth + 1 > MAX_DEPTH) error(p + ".inner", "is nested " + (depth + 1) + " levels deep; at most " + MAX_DEPTH + " levels are allowed, so move these steps up a level");
          else {
            if (depth + 1 > WARN_DEPTH) warn(p + ".inner", "is nested " + (depth + 1) + " levels deep; more than " + WARN_DEPTH + " levels are hard to follow");
            inners.push(i);
          }
        }
      });
      if (N < 3) warn(at("steps"), "only " + N + " steps; a sequence usually needs 4 or more to teach");
      if (N >= 6 && !anyCheck) warn(at("steps"), "no step has a check; one or two light \"who sends next?\" checks help the learner predict");
      own.forEach(function (pt, i) {
        if (!pt || typeof pt.id !== "string") return;
        if (pt.kind === "group") {
          var touched = usedHere[pt.id] || (Array.isArray(pt.members) && pt.members.some(function (m) { return m && usedHere[m.id]; }));
          if (!touched) warn(at("participants[" + i + "]"), "group " + describe(pt.id) + ": no step at its level sends to or from it or any of its members");
        } else if (!usedHere[pt.id]) warn(at("participants[" + i + "]"), "participant " + describe(pt.id) + " never sends or receives a step");
      });
      if (inner) {
        var lanes = {};
        own.forEach(function (pt) { if (pt && typeof pt.id === "string") lanes[pt.id] = true; });
        Object.keys(usedHere).forEach(function (id) { lanes[hereMember[id] || id] = true; });
        var nl = Object.keys(lanes).length;
        if (nl > MAX_INNER_LANES) warn(base, "shows " + nl + " lanes at once; more than " + MAX_INNER_LANES + " get narrow, so gather some parties into a group or move them into a deeper inner sequence");
      }
    }

    /* fragments */
    var frags = [], fragsOk = true;
    if (optionalArray(seq, "fragments", base, 0, 20, error)) {
      (seq.fragments || []).forEach(function (f, i) {
        var p = at("fragments[" + i + "]");
        if (!isObject(f, p, error)) { fragsOk = false; return; }
        var ok = true;
        if (FRAGMENT_KINDS.indexOf(f.kind) === -1) { error(p + ".kind", "must be one of " + FRAGMENT_KINDS.join(", ") + "; got " + describe(f.kind)); ok = false; }
        if (f.kind === "group") {
          requireString(f, "label", p, 1, 80, error);
          if (optionalString(f, "summary", p, 200, error)) marks(f.summary, p + ".summary");
          optionalBool(f, "collapsed", p, error);
        } else {
          optionalString(f, "label", p, 40, error);
          ["summary", "collapsed"].forEach(function (x) { if (f[x] !== undefined) error(p + "." + x, "only a group fragment has " + x + "; remove it or use kind \"group\""); });
        }
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
        } else if (f.kind === "group") {
          if (f.condition !== undefined) error(p + ".condition", "a group fragment has a label, not a condition");
          if (f.branches !== undefined) error(p + ".branches", "only an alt fragment has branches");
          if (ok && f.end === f.start) { error(p + ".end", "a group needs at least 2 consecutive steps, but start and end are both " + f.start + "; widen it or remove the fragment"); ok = false; }
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
            error(at("fragments[" + b.i + "]"), "steps " + B.start + "–" + B.end + " partly overlap fragments[" + a.i + "] (steps " + A.start + "–" + A.end + "); fragments must be nested or separate");
            fragsOk = false; return;
          }
          var outer = null, innerF = null, innerI = -1, outerI = -1;
          if (bInA && !(aInB)) { outer = A; innerF = B; innerI = b.i; outerI = a.i; }
          else if (aInB && !bInA) { outer = B; innerF = A; innerI = a.i; outerI = b.i; }
          else if (aInB && bInA) { outer = A; innerF = B; innerI = b.i; outerI = a.i; }
          if (outer && outer.kind === "alt") {
            var inOne = outer.branches.some(function (br) { return innerF.start >= br.start && innerF.end <= br.end; });
            if (!inOne) { error(at("fragments[" + innerI + "]"), "steps " + innerF.start + "–" + innerF.end + " cross a branch boundary of the alt fragments[" + outerI + "]; a nested fragment must lie inside one branch"); fragsOk = false; }
          }
        });
      });
      if (stepsOk && N > 0) {
        var covered = 0;
        for (var si = 0; si < N; si++) {
          if (frags.some(function (x) { return x.f.kind === "group" && x.f.collapsed !== false && si >= x.f.start && si <= x.f.end; })) covered++;
        }
        if (covered === N) warn(at("fragments"), inner ? "every step of this inner sequence is inside a collapsed group; it has nothing to read until the learner expands one" : "every step is inside a collapsed group; the main level has nothing to read");
      }
    }

    /* holds simulation: needs valid steps and fragments, and a known starting state */
    var before = null;
    if (stepsOk && fragsOk && (!inner || init)) before = simulateHolds(seq, state0, at, error, warn);

    var lv = { terms: terms, visible: visible, channels: chans, marks: marks };

    /* inner sequences: each starts from the holds just before its parent step */
    inners.forEach(function (i) {
      checkSeq(steps[i].inner, at("steps[" + i + "].inner"), depth + 1, lv, before ? before[i] : null, ctx);
    });

    /* channels declared here and never used here or deeper */
    ownC.forEach(function (c) {
      if (!ctx.chanUsed[c.id]) warn(c.path, "channel " + describe(c.id) + " is not used by any step");
    });
    return lv;
  }

  function checkId(obj, path, list, what, error) {
    if (!requireString(obj, "id", path, 1, 40, error)) return;
    if (!KEBAB.test(obj.id)) error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(obj.id));
    else if (list.indexOf(obj.id) !== -1) error(path + ".id", "duplicate " + what + " id " + describe(obj.id) + "; ids must be unique");
    else list.push(obj.id);
  }
  /* participant and member ids are unique across the whole document */
  function checkTreeId(obj, path, ctx) {
    var error = ctx.error;
    if (!requireString(obj, "id", path, 1, 40, error)) return false;
    if (!KEBAB.test(obj.id)) { error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(obj.id)); return false; }
    if (ctx.ids[obj.id]) { error(path + ".id", "duplicate participant id " + describe(obj.id) + ", already used at " + ctx.ids[obj.id] + "; participant and member ids must be unique across the whole document"); return false; }
    ctx.ids[obj.id] = path + ".id";
    return true;
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

  function checkStepHolds(s, p, visible, unknownP, error) {
    var hp = p + ".holds";
    if (!isObject(s.holds, hp, error)) return;
    var keys = Object.keys(s.holds);
    if (!keys.length) error(hp, "must name at least one participant; omit holds when nothing changes");
    keys.forEach(function (id) {
      var ip = hp + "." + id, h = s.holds[id];
      if (!visible[id]) { error(ip, unknownP(id)); return; }
      if (!isObject(h, ip, error)) return;
      Object.keys(h).forEach(function (k) { if (k !== "add" && k !== "remove") error(ip + "." + k, "unknown key; a holds change has only add and remove"); });
      var a = h.add === undefined || checkItemList(h.add, ip + ".add", 0, MAX_HOLDS, error);
      var r = h.remove === undefined || checkItemList(h.remove, ip + ".remove", 0, MAX_HOLDS, error);
      if (a && r && !((h.add || []).length + (h.remove || []).length)) error(ip, "must add or remove at least one item");
      if (a && r && h.add && h.remove) h.add.forEach(function (x, k) { if (h.remove.indexOf(x) !== -1) error(ip + ".add[" + k + "]", describe(x) + " is both added and removed in this step"); });
    });
  }

  /* Holds are cumulative from the starting state. Removes apply before adds. A non-first
     branch of an alt starts from the state before the alt and does not carry forward; after
     the alt the state is that at the end of its first branch. Returns the state just before
     each step (an inner sequence starts from it). Mirrors computeHolds in view.js. */
  function simulateHolds(seq, initial, at, error, warn) {
    var steps = seq.steps, N = steps.length, frags = seq.fragments || [];
    function clone(st) { var o = {}; Object.keys(st).forEach(function (k) { o[k] = st[k].slice(); }); return o; }
    var state = clone(initial), before = [];
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
      before.push(clone(state));
      var s = steps[i];
      if (!s || !s.holds || typeof s.holds !== "object") continue;
      Object.keys(s.holds).forEach(function (id) {
        var h = s.holds[id];
        if (!state[id] || !h || typeof h !== "object") return;
        (Array.isArray(h.remove) ? h.remove : []).forEach(function (x, k) {
          var pos = state[id].indexOf(x);
          if (pos === -1) error(at("steps[" + i + "].holds." + id + ".remove[" + k + "]"), describe(x) + " is not held by " + describe(id) + " at this step (it holds: " + (state[id].length ? state[id].join(", ") : "nothing") + ")");
          else state[id].splice(pos, 1);
        });
        (Array.isArray(h.add) ? h.add : []).forEach(function (x, k) {
          if (state[id].indexOf(x) !== -1) warn(at("steps[" + i + "].holds." + id + ".add[" + k + "]"), describe(id) + " already holds " + describe(x) + "; it is not marked as new");
          else state[id].push(x);
        });
        if (state[id].length > MAX_HOLDS) warn(at("steps[" + i + "].holds." + id), describe(id) + " now holds " + state[id].length + " items; more than " + MAX_HOLDS + " crowd the strip, so remove what it no longer needs");
      });
    }
    return before;
  }

  function checkCheck(s, p, visible, unknownP, error, marks) {
    var cp = p + ".check", c = s.check;
    if (!isObject(c, cp, error)) return;
    if (c.type === "who") {
      optionalString(c, "prompt", cp, 200, error);
      if (c.why !== undefined && optionalString(c, "why", cp, 500, error)) marks(c.why, cp + ".why");
      if (typeof c.answer !== "string") error(cp + ".answer", "must be the id of the participant who sends this step, got " + describe(c.answer));
      else if (!visible[c.answer]) error(cp + ".answer", unknownP(c.answer));
      else if (typeof s.from === "string" && visible[s.from] && c.answer !== s.from) error(cp + ".answer", describe(c.answer) + " does not send this step; " + p + ".from is " + describe(s.from) + ", so the answer must be " + describe(s.from));
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
