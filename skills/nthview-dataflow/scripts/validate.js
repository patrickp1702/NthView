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
  var COLORS = ["slate", "amber", "green", "blue", "red", "teal", "violet", "pink"];
  var FRAGMENT_KINDS = ["alt", "opt", "loop", "group"];
  var SEVERITIES = ["info", "warning", "danger"];
  var HERO_ONLY = ["kicker", "heading", "facts", "startLabel", "jumps"];
  var MARK_RE = /\(\(([^()]*)\)\)/g;
  var MAX_HOLDS = 12;
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
    /* rich strings are collected as they are checked; their ((term)) marks are checked at the end */
    var richList = [];
    function rich(obj, key, parent) { if (typeof obj[key] === "string") richList.push([join(parent, key), obj[key]]); }
    /* one exchange (root steps) or topics (sections): exactly one of the two */
    var single = data.sections === undefined && data.steps !== undefined;
    if (data.sections !== undefined && data.steps !== undefined) error("steps", "not allowed together with sections; a document is either topics (sections) or one exchange (steps)");
    if (single) HERO_ONLY.forEach(function (k) { if (data[k] !== undefined) error(k, "only allowed with sections; a single exchange (root steps) has no overview page"); });
    if (!single && data.fragments !== undefined) error("fragments", "only allowed with root steps; put fragments on the topic they frame");

    requireString(data, "title", "$", 1, 120, error);
    optionalString(data, "kicker", "$", 80, error);
    optionalString(data, "heading", "$", 120, error);
    if (single) optionalString(data, "lead", "$", 800, error, 1); else requireString(data, "lead", "$", 1, 800, error);
    rich(data, "lead", "$");
    optionalString(data, "startLabel", "$", 40, error, 1);
    optionalString(data, "versionsLabel", "$", 24, error, 1);
    optionalString(data, "footer", "$", 300, error); rich(data, "footer", "$");
    optionalString(data, "compareLabel", "$", 60, error, 1);
    optionalEnum(data, "theme", "$", THEMES, error);
    optionalEnum(data, "defaultMode", "$", ["network", "sequence"], error);

    if (data.facts !== undefined && requireArray(data, "facts", "$", 0, 8, error)) {
      data.facts.forEach(function (f, i) {
        var p = "facts[" + i + "]";
        if (!isObject(f)) { error(p, "must be an object, got " + describe(f)); return; }
        requireString(f, "term", p, 1, 40, error);
        requireString(f, "text", p, 1, 240, error); rich(f, "text", p);
      });
    }
    if (data.closing !== undefined && requireArray(data, "closing", "$", 0, 4, error)) {
      data.closing.forEach(function (c, i) { requireString(data.closing, i, "closing", 1, 600, error); rich(data.closing, i, "closing"); });
    }
    /* glossary: terms unique ignoring case; marks are checked once every rich string is known */
    var GL = {}, glUsed = {};
    if (data.glossary !== undefined && requireArray(data, "glossary", "$", 0, 40, error)) {
      data.glossary.forEach(function (g, i) {
        var p = "glossary[" + i + "]";
        if (!isObject(g)) { error(p, "must be an object, got " + describe(g)); return; }
        if (requireString(g, "term", p, 1, 40, error)) {
          var k = g.term.trim().toLowerCase();
          if (GL[k] !== undefined) error(p + ".term", "duplicate term " + JSON.stringify(g.term) + " (terms are unique ignoring case)"); else GL[k] = i;
        }
        requireString(g, "definition", p, 1, 300, error); rich(g, "definition", p);
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
        optionalString(v, "note", p, 200, error); rich(v, "note", p);
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

    function checkItems(obj, key, parent, min, max) {
      if (!requireArray(obj, key, parent, min, max, error)) return false;
      var seen = {}, ok = true;
      obj[key].forEach(function (item, i) {
        var ip = join(parent, key) + "[" + i + "]";
        if (typeof item !== "string" || !item.trim()) { error(ip, "must be a non-empty string, got " + describe(item)); ok = false; }
        else if (item.length > 60) { error(ip, "must be at most 60 characters, got " + item.length); ok = false; }
        else if (seen[item]) { error(ip, "duplicate item " + JSON.stringify(item)); ok = false; }
        seen[item] = true;
      });
      return ok;
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
        if (e.holds !== undefined) checkItems(e, "holds", p, 0, MAX_HOLDS);
        if (e.members !== undefined) requireArray(e, "members", p, 2, 12, error);
        if (e.zone !== undefined) {
          if (typeof e.zone !== "string") error(p + ".zone", "must be a zone id string, got " + describe(e.zone));
          else if (!ZI[e.zone]) error(p + ".zone", "zone id " + JSON.stringify(e.zone) + " is not defined in zones");
          else zoneUsed[e.zone] = true;
        }
      });
    }
    /* groups: members are other entities, each in one group at most, never a group themselves */
    var memberOf = {};
    if (Array.isArray(data.entities)) data.entities.forEach(function (e, i) {
      if (!isObject(e) || !Array.isArray(e.members) || e.members.length < 2 || e.members.length > 12) return;
      var seen = {};
      e.members.forEach(function (m, k) {
        var mp = "entities[" + i + "].members[" + k + "]";
        if (typeof m !== "string") { error(mp, "must be an entity id string, got " + describe(m)); return; }
        if (!EI[m]) { error(mp, "entity id " + JSON.stringify(m) + " is not defined in entities"); return; }
        if (m === e.id) { error(mp, "a group cannot be its own member"); return; }
        if (seen[m]) { error(mp, "duplicate member " + JSON.stringify(m)); return; }
        seen[m] = true;
        if (memberOf[m]) error(mp, JSON.stringify(m) + " is already a member of " + JSON.stringify(memberOf[m]) + "; an entity belongs to one group at most");
        else memberOf[m] = e.id;
        data.entities.forEach(function (x) { if (isObject(x) && x.id === m && x.members !== undefined) error(mp, JSON.stringify(m) + " is a group itself; groups do not nest"); });
      });
    });
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

    /* channels */
    var CI = {}, channelUsed = {};
    if (data.channels !== undefined && requireArray(data, "channels", "$", 0, 8, error)) {
      data.channels.forEach(function (c, i) {
        var p = "channels[" + i + "]";
        if (!isObject(c)) { error(p, "must be an object, got " + describe(c)); return; }
        if (requireId(c, "id", p, error)) {
          if (CI[c.id]) error(p + ".id", "duplicate channel id " + JSON.stringify(c.id)); else CI[c.id] = true;
        }
        requireString(c, "name", p, 1, 40, error);
        if (c.color === undefined) error(p + ".color", "must be one of " + COLORS.join(", ") + ", got undefined (missing)");
        else optionalEnum(c, "color", p, COLORS, error);
        optionalString(c, "description", p, 200, error);
      });
    }
    function checkChannelRef(obj, key, parent) {
      var path = join(parent, key), v = obj[key];
      if (typeof v !== "string") { error(path, "must be a channel id string, got " + describe(v)); return false; }
      if (!CI[v]) { error(path, "channel id " + JSON.stringify(v) + " is not defined in channels"); return false; }
      channelUsed[v] = true;
      return true;
    }
    if (Array.isArray(data.links)) data.links.forEach(function (l, i) { if (isObject(l) && l.channel !== undefined) checkChannelRef(l, "channel", "links[" + i + "]"); });

    /* sections and topics, or one exchange */
    var TI = {}, topicCount = 0, stepCount = 0, checkCount = 0;
    if (single) {
      if (requireArray(data, "steps", "$", 1, 60, error)) checkSeq(data, "$", 0, startHolds(null));
    } else if (requireArray(data, "sections", "$", 1, 12, error)) {
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

      if (t.holds !== undefined) {
        if (!isObject(t.holds)) error(p + ".holds", "must be an object keyed by entity id, got " + describe(t.holds));
        else Object.keys(t.holds).forEach(function (id) {
          if (!EI[id]) error(p + ".holds." + id, "entity id " + JSON.stringify(id) + " is not defined in entities");
          checkItems(t.holds, id, p + ".holds", 0, MAX_HOLDS);
        });
      }
      if (requireArray(t, "steps", p, 1, 30, error)) checkSeq(t, p, 0, startHolds(t));
    }
    function startHolds(t) {
      var held = {};
      Object.keys(EI).forEach(function (id) {
        var e = null;
        data.entities.forEach(function (x) { if (isObject(x) && x.id === id) e = x; });
        var start = (t && isObject(t.holds) && Array.isArray(t.holds[id])) ? t.holds[id] : (e && Array.isArray(e.holds) ? e.holds : []);
        held[id] = start.slice();
      });
      return held;
    }

    /* A sequence of steps: a topic, the root of a single exchange, or an inner sequence (depth ≥ 1).
       Its steps array is already known to be an array. */
    function checkSeq(seq, p, depth, held0) {
      var touched = {}, msgTotal = 0, base = p === "$" ? "steps" : p + ".steps";
      seq.steps.forEach(function (st, i) { msgTotal += checkStep(st, base + "[" + i + "]", touched, depth); });
      var what = depth ? "inner sequence" : "topic";
      if (depth === 0 && seq.steps.length > (single ? 30 : 12)) warn(base, "more than " + (single ? 30 : 12) + " steps (" + seq.steps.length + "); consider " + (single ? "folding runs into groups or inner sequences" : "splitting the topic"));
      if (msgTotal > 60) warn(base, "more than 60 messages in this " + what + " (" + msgTotal + "); the flow table gets long");
      if (Object.keys(touched).length > 8) warn(p, "the steps touch " + Object.keys(touched).length + " entities; the diagram will be crowded");
      if (seq.fragments !== undefined) checkFragments(seq, p, !depth && single ? 20 : 12);
      if (depth === 0) checkHoldings(seq, p, held0);
    }

    /* Holdings are cumulative: walk the messages each version shows and make sure every removed item is held.
       In an alt, every branch after the first starts from the state before the fragment and does not carry
       forward. An inner sequence starts from the state just before its parent step; its changes stay inside. */
    function checkHoldings(t, p, held0) {
      var versionIds = hasVersions ? versions.map(function (v) { return v.id; }) : [null];
      /* the same problem is reported once, naming the versions only when it does not occur in all of them */
      var found = {}, order = [];
      function report(kind, path, message, vid) {
        var key = kind + " " + path;
        if (!found[key]) { found[key] = { kind: kind, path: path, message: message, versions: [] }; order.push(key); }
        if (vid) found[key].versions.push(vid);
      }
      function clone(h) { var o = {}; Object.keys(h).forEach(function (id) { o[id] = h[id].slice(); }); return o; }
      function walk(seq, sp, held, vid) {
        var plan = altPlan(seq.fragments);
        seq.steps.forEach(function (st, si) {
          (plan[si] || []).forEach(function (a) { held = a(held, clone); });
          if (!isObject(st)) return;
          var stp = (sp === "$" ? "steps" : sp + ".steps") + "[" + si + "]";
          var ov = (vid && isObject(st.versions) && isObject(st.versions[vid])) ? st.versions[vid] : null;
          var msgs = ov && Array.isArray(ov.messages) ? ov.messages : (Array.isArray(st.messages) ? st.messages : []);
          var base = ov && Array.isArray(ov.messages) ? stp + ".versions." + vid + ".messages" : stp + ".messages";
          if (isObject(st.inner) && Array.isArray(st.inner.steps)) walk(st.inner, stp + ".inner", clone(held), vid);
          msgs.forEach(function (m, mi) {
            if (!isObject(m) || !isObject(m.holds)) return;
            if (vid && Array.isArray(m.versions) && m.versions.indexOf(vid) === -1) return;
            Object.keys(m.holds).forEach(function (id) {
              var ch = m.holds[id], hp = base + "[" + mi + "].holds." + id;
              if (!isObject(ch) || !held[id]) return;
              (Array.isArray(ch.remove) ? ch.remove : []).forEach(function (item, k) {
                var at = held[id].indexOf(item);
                if (at === -1) report("error", hp + ".remove[" + k + "]", JSON.stringify(item) + " is not held by " + JSON.stringify(id) + " at this point", vid);
                else held[id].splice(at, 1);
              });
              (Array.isArray(ch.add) ? ch.add : []).forEach(function (item, k) {
                if (held[id].indexOf(item) !== -1) report("warn", hp + ".add[" + k + "]", JSON.stringify(id) + " already holds " + JSON.stringify(item), vid);
                else held[id].push(item);
              });
              if (held[id].length > MAX_HOLDS) report("warn", hp, JSON.stringify(id) + " holds " + held[id].length + " items here; more than " + MAX_HOLDS + " is hard to read", vid);
            });
          });
        });
      }
      versionIds.forEach(function (vid) { walk(t, p, clone(held0), vid); });
      order.forEach(function (key) {
        var f = found[key], suffix = f.versions.length && f.versions.length < versionIds.length ? " (in version " + f.versions.map(JSON.stringify).join(", ") + ")" : "";
        (f.kind === "error" ? error : warn)(f.path, f.message + suffix);
      });
    }

    function checkFragments(t, p, max) {
      if (!requireArray(t, "fragments", p, 0, max, error)) return;
      var n = t.steps.length, spans = [], folded = [];
      function stepIndex(obj, key, parent) {
        var path = join(parent, key), v = obj[key];
        if (typeof v !== "number" || v % 1 !== 0) { error(path, "must be an integer step index, got " + describe(v)); return false; }
        if (v < 0 || v >= n) { error(path, "step index " + v + " is out of range (" + n + " steps, valid indexes are 0–" + (n - 1) + ")"); return false; }
        return true;
      }
      t.fragments.forEach(function (f, i) {
        var fp = join(p, "fragments") + "[" + i + "]";
        if (!isObject(f)) { error(fp, "must be an object, got " + describe(f)); return; }
        if (FRAGMENT_KINDS.indexOf(f.kind) === -1) { error(fp + ".kind", "must be one of " + FRAGMENT_KINDS.join(", ") + ", got " + describe(f.kind)); return; }
        var grp = f.kind === "group";
        if (grp) requireString(f, "label", fp, 1, 80, error); else optionalString(f, "label", fp, 40, error);
        var ok = stepIndex(f, "start", fp) & stepIndex(f, "end", fp);
        if (ok && f.end < f.start) { error(fp + ".end", "must not be before start (" + f.start + ")"); ok = false; }
        if (ok && grp && f.end === f.start) { error(fp + ".end", "a group covers 2 or more steps; must be after start (" + f.start + ")"); ok = false; }
        if (grp) {
          optionalString(f, "summary", fp, 200, error); rich(f, "summary", fp);
          if (f.collapsed !== undefined && typeof f.collapsed !== "boolean") error(fp + ".collapsed", "must be a boolean, got " + describe(f.collapsed));
          if (f.condition !== undefined) error(fp + ".condition", "not allowed on group");
          if (f.branches !== undefined) error(fp + ".branches", "only allowed on alt");
          if (ok && f.collapsed !== false) folded.push(f);
        } else {
          if (f.summary !== undefined) error(fp + ".summary", "only allowed on group");
          if (f.collapsed !== undefined) error(fp + ".collapsed", "only allowed on group");
        }
        if (f.kind === "alt") {
          if (f.condition !== undefined) error(fp + ".condition", "not allowed on alt; put conditions on the branches");
          if (requireArray(f, "branches", fp, 2, 4, error) && ok) {
            var expect = f.start;
            f.branches.forEach(function (b, k) {
              var bp = fp + ".branches[" + k + "]";
              if (!isObject(b)) { error(bp, "must be an object, got " + describe(b)); return; }
              requireString(b, "condition", bp, 1, 80, error);
              if (!(stepIndex(b, "start", bp) & stepIndex(b, "end", bp))) return;
              if (b.end < b.start) error(bp + ".end", "must not be before start (" + b.start + ")");
              if (b.start !== expect) error(bp + ".start", "branches must be contiguous: expected " + expect + ", got " + b.start);
              expect = b.end + 1;
              spans.push({ s: b.start, e: b.end, path: bp, branch: true, parent: i });
            });
            if (expect !== f.end + 1) error(fp + ".branches", "the last branch must end at the fragment's end (" + f.end + ")");
          }
        } else if (!grp) {
          if (f.branches !== undefined) error(fp + ".branches", "only allowed on alt");
          requireString(f, "condition", fp, 1, 80, error);
        }
        if (ok) spans.push({ s: f.start, e: f.end, path: fp, alt: f.kind === "alt", idx: i });
      });
      spans.forEach(function (a, i) {
        spans.forEach(function (b, j) {
          if (j <= i || a.branch || b.branch) return;
          var sep = a.e < b.s || b.e < a.s, aInB = a.s >= b.s && a.e <= b.e, bInA = b.s >= a.s && b.e <= a.e;
          if (!sep && !aInB && !bInA) error(b.path, "overlaps " + a.path + " partly; fragments are either separate or nested");
          var outer = aInB && !(a.s === b.s && a.e === b.e) ? b : (bInA ? a : null), inner = outer === b ? a : outer === a ? b : null;
          if (outer && inner && outer.alt) {
            var inside = spans.some(function (br) { return br.branch && br.parent === outer.idx && inner.s >= br.s && inner.e <= br.e; });
            if (!inside) error(inner.path, "lies inside alt " + outer.path + " but crosses its branches");
          }
        });
      });
      var all = true;
      for (var s = 0; s < n; s++) if (!folded.some(function (f) { return s >= f.start && s <= f.end; })) { all = false; break; }
      if (all && n) warn(join(p, "fragments"), "every step sits in a collapsed group; the learner has nothing to read until they expand one");
    }

    function checkArticle(a, p) {
      if (requireArray(a, "body", p, 1, 8, error)) {
        a.body.forEach(function (b, i) {
          if (typeof b !== "string") error(p + ".body[" + i + "]", "must be a string, got " + describe(b));
          else if (!b.trim()) error(p + ".body[" + i + "]", "must be a non-empty string");
          else if (b.length > 1500) error(p + ".body[" + i + "]", "must be at most 1500 characters, got " + b.length);
          rich(a.body, i, p + ".body");
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
              rich(n.items, j, np + ".items");
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
              requireString(it, "text", ip, 1, 240, error); rich(it, "text", ip);
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
      rich(st, "explanation", p);
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

    function checkStep(st, p, touched, depth) {
      stepCount++;
      if (!isObject(st)) { error(p, "must be an object, got " + describe(st)); return 0; }
      var count = checkStepFields(st, p, touched, false);
      if (!st.messages || st.messages.length === 0) warn(p, "step has no messages; the flow table shows nothing for it");
      if (st.check !== undefined) { checkCount++; checkCheck(st.check, p + ".check", st); }
      if (st.compare !== undefined) {
        if (!isObject(st.compare)) error(p + ".compare", "must be an object, got " + describe(st.compare));
        else { requireString(st.compare, "label", p + ".compare", 1, 60, error); requireString(st.compare, "text", p + ".compare", 1, 600, error); rich(st.compare, "text", p + ".compare"); }
      }
      if (st.note !== undefined) {
        if (!isObject(st.note)) error(p + ".note", "must be an object, got " + describe(st.note));
        else {
          if (SEVERITIES.indexOf(st.note.severity) === -1) error(p + ".note.severity", "must be one of " + SEVERITIES.join(", ") + ", got " + describe(st.note.severity));
          requireString(st.note, "text", p + ".note", 1, 300, error); rich(st.note, "text", p + ".note");
        }
      }
      if (st.detail !== undefined && requireArray(st, "detail", p, 1, 8, error)) {
        st.detail.forEach(function (d, i) {
          var dp = p + ".detail[" + i + "]";
          if (!isObject(d)) { error(dp, "must be an object, got " + describe(d)); return; }
          requireString(d, "label", dp, 1, 40, error);
          requireString(d, "text", dp, 1, 600, error); rich(d, "text", dp);
        });
      }
      if (st.inner !== undefined) {
        var ip = p + ".inner", inn = st.inner;
        if (!isObject(inn)) error(ip, "must be an object, got " + describe(inn));
        else if (depth + 1 > 6) error(ip, "nested " + (depth + 1) + " levels deep; at most 6 are allowed");
        else {
          if (depth + 1 > 3) warn(ip, "nested " + (depth + 1) + " levels deep; more than 3 is hard to follow");
          ["participants", "entities", "channels", "glossary", "zones"].forEach(function (k) { if (inn[k] !== undefined) error(ip + "." + k, "not allowed in an inner sequence; declare " + k + " at the root and use them here"); });
          optionalString(inn, "subtitle", ip, 300, error); rich(inn, "subtitle", ip);
          if (requireArray(inn, "steps", ip, 2, 30, error)) checkSeq(inn, ip, depth + 1, null);
        }
      }
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
          requireString(a, "text", ap, 1, 300, error); rich(a, "text", ap);
        });
      }
      if (m.tags !== undefined && requireArray(m, "tags", p, 0, 4, error)) {
        m.tags.forEach(function (t, i) {
          if (typeof t !== "string" || !t.trim()) error(p + ".tags[" + i + "]", "must be a non-empty string, got " + describe(t));
          else if (t.length > 20) error(p + ".tags[" + i + "]", "must be at most 20 characters, got " + t.length);
        });
      }
      if (m.channel !== undefined) checkChannelRef(m, "channel", p);
      if (m.holds !== undefined) {
        if (!isObject(m.holds)) error(p + ".holds", "must be an object keyed by entity id, got " + describe(m.holds));
        else Object.keys(m.holds).forEach(function (id) {
          var hp = p + ".holds." + id, ch = m.holds[id];
          if (!EI[id]) { error(hp, "entity id " + JSON.stringify(id) + " is not defined in entities"); return; }
          if (!isObject(ch)) { error(hp, "must be an object with add and/or remove, got " + describe(ch)); return; }
          Object.keys(ch).forEach(function (k) { if (k !== "add" && k !== "remove") error(hp + "." + k, "unknown field; only add and remove are allowed"); });
          if (ch.add === undefined && ch.remove === undefined) error(hp, "must have add or remove");
          if (ch.add !== undefined) checkItems(ch, "add", hp, 0, MAX_HOLDS);
          if (ch.remove !== undefined) checkItems(ch, "remove", hp, 0, MAX_HOLDS);
          if (Array.isArray(ch.add) && Array.isArray(ch.remove)) ch.add.forEach(function (item, k) { if (ch.remove.indexOf(item) !== -1) error(hp + ".add[" + k + "]", JSON.stringify(item) + " is both added and removed"); });
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

    function checkCheck(c, p, st) {
      if (!isObject(c)) { error(p, "must be an object, got " + describe(c)); return; }
      if (c.type !== undefined && c.type !== "choice" && c.type !== "who") { error(p + ".type", "must be choice or who, got " + describe(c.type)); return; }
      if (c.type === "who") {
        /* "who sends the next message?": the options are the parties on the diagram, the answer is the sender */
        if (optionalString(c, "prompt", p, 200, error, 1) && c.prompt !== undefined && !/\?\s*$/.test(c.prompt)) warn(p + ".prompt", "does not end with a question mark");
        rich(c, "prompt", p);
        optionalString(c, "why", p, 400, error); rich(c, "why", p);
        if (c.options !== undefined) error(p + ".options", "not allowed on a who check; the parties on the diagram are the options");
        var first = Array.isArray(st.messages) && isObject(st.messages[0]) ? st.messages[0] : null;
        if (typeof c.answer !== "string") error(p + ".answer", "must be an entity id string, got " + describe(c.answer));
        else if (!EI[c.answer]) error(p + ".answer", "entity id " + JSON.stringify(c.answer) + " is not defined in entities");
        else if (!first) error(p + ".answer", "a who check needs a step with a message; this step sends none");
        else if (first.from !== c.answer) error(p + ".answer", "must be the sender of the step's first message (" + JSON.stringify(first.from) + "), got " + JSON.stringify(c.answer));
        return;
      }
      if (c.answer !== undefined) error(p + ".answer", "only allowed on a who check");
      if (requireString(c, "prompt", p, 1, 300, error) && !/\?\s*$/.test(c.prompt)) warn(p + ".prompt", "does not end with a question mark");
      rich(c, "prompt", p);
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
        rich(o, "text", op);
        if (o.correct !== undefined && typeof o.correct !== "boolean") error(op + ".correct", "must be a boolean, got " + describe(o.correct));
        if (o.correct === true) correct++;
        requireString(o, "why", op, 1, 400, error); rich(o, "why", op);
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
    if (Array.isArray(data.channels)) data.channels.forEach(function (c, i) {
      if (isObject(c) && typeof c.id === "string" && CI[c.id] && !channelUsed[c.id]) warn("channels[" + i + "]", "channel " + JSON.stringify(c.id) + " is used by no link or message");
    });
    if (hasVersions && versionRefs === 0) warn("versions", "declared but nothing references a version; the time machine changes nothing");
    if (stepCount >= 10 && checkCount === 0) warn(single ? "steps" : "sections", stepCount + " steps and no check; add a prediction question or two");
    /* glossary marks: ((term)) or ((shown text|term)) must name a glossary term */
    richList.forEach(function (r) {
      var m; MARK_RE.lastIndex = 0;
      while ((m = MARK_RE.exec(r[1]))) {
        var term = m[1].split("|").pop().trim(), k = term.toLowerCase();
        if (!term) error(r[0], "has an empty glossary mark " + JSON.stringify(m[0]));
        else if (GL[k] === undefined) error(r[0], "glossary term " + JSON.stringify(term) + " is not defined in glossary");
        else glUsed[k] = true;
      }
    });
    if (Array.isArray(data.glossary)) data.glossary.forEach(function (g, i) {
      if (isObject(g) && typeof g.term === "string" && GL[g.term.trim().toLowerCase()] === i && !glUsed[g.term.trim().toLowerCase()]) warn("glossary[" + i + "]", "term " + JSON.stringify(g.term) + " is never marked with ((...)) in the text");
    });
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
  /* Holdings across an alt: before each step, the actions that apply there. A fragment's first step saves the
     state; every later branch first keeps the end of branch one, then starts again from the saved state; the
     step after the fragment returns to the end of branch one. Inner fragments end before outer ones. */
  function altPlan(frags) {
    var at = {};
    function add(s, prio, fn) { (at[s] = at[s] || []).push({ p: prio, fn: fn }); }
    (Array.isArray(frags) ? frags : []).forEach(function (f) {
      if (!isObject(f) || f.kind !== "alt" || !Array.isArray(f.branches) || typeof f.start !== "number" || typeof f.end !== "number") return;
      var st = {};
      add(f.start, 3, function (h, clone) { st.start = clone(h); return h; });
      f.branches.forEach(function (b, k) {
        if (k && isObject(b) && typeof b.start === "number") add(b.start, 2, function (h, clone) { if (k === 1) st.end0 = clone(h); return st.start ? clone(st.start) : h; });
      });
      add(f.end + 1, 1 - 1 / (f.end - f.start + 2), function (h, clone) { return st.end0 ? clone(st.end0) : h; });
    });
    Object.keys(at).forEach(function (s) { at[s] = at[s].sort(function (a, b) { return a.p - b.p; }).map(function (x) { return x.fn; }); });
    return at;
  }
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
