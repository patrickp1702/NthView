/* NthView — system-evolution validator — schemaVersion 1
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

  var LEVELS = ["beginner", "intermediate", "advanced"];
  var METRIC_FORMATS = ["number", "compact", "percent", "duration"];
  var BETTER = ["lower", "higher", "none"];
  var SHAPES = ["dot", "square", "ring", "diamond"];
  var TONES = ["blue", "orange", "amber", "purple", "green", "red", "teal", "grey", "pink"];
  var KINDS = ["users", "botnet", "client", "phone", "person", "staff", "document", "vehicle", "bed", "junction",
    "database", "storage", "server", "service", "api", "gateway", "load-balancer", "firewall", "shield",
    "rate-limiter", "detector", "auth", "mfa", "cache", "queue", "worker", "dns", "cdn", "network", "proxy",
    "monitor", "log", "building", "hospital", "warehouse", "factory", "store", "signal", "router", "attacker", "generic"];
  var BLOCK_KINDS = ["server", "service", "api", "gateway", "load-balancer", "firewall", "shield",
    "rate-limiter", "detector", "auth", "mfa", "cache", "queue", "worker", "dns", "cdn", "network", "proxy",
    "monitor", "log", "building", "hospital", "warehouse", "factory", "store", "signal", "router", "attacker", "generic",
    "database", "storage"];
  var ICONS = ["users", "user", "bot", "laptop", "phone", "server", "app", "code", "door", "split", "wall", "shield",
    "gauge", "eye", "key", "lock", "bolt", "stack", "gear", "database", "box", "globe", "cloud", "relay", "chart",
    "doc", "building", "cross", "bed", "truck", "factory", "shop", "signal", "network", "mask", "clock", "alert",
    "check", "x", "heart", "money", "percent", "fingerprint", "list", "dot"];
  var LINK_STYLES = ["solid", "dashed"];
  var ARROWS = ["forward", "both", "none"];
  var STEP_TYPES = ["context", "problem", "technique", "solution", "tradeoff", "case", "recap"];
  var STATUSES = ["ok", "busy", "overloaded", "failed", "off", "dim"];
  var BADGE_TONES = ["neutral", "good", "warn", "bad", "info"];
  var LINK_STATES = ["active", "faint", "down"];
  var OUTCOMES = ["ok", "fail", "blocked", "held"];
  var VALUE_LEVELS = ["good", "warn", "bad", "none"];
  var CALLOUT_KINDS = ["key", "tip", "warn"];
  var CHANGE_MARKS = ["add", "change", "remove"];
  var ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;

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
    optionalString(data, "summary", "$", 0, 200, error);
    if (data.breadcrumb !== undefined && requireArray(data, "breadcrumb", "$", 0, 3, error)) {
      data.breadcrumb.forEach(function (b, i) { checkStringValue(b, "breadcrumb[" + i + "]", 1, 40, error); });
    }
    optionalInteger(data, "minutes", "$", 1, 600, error);
    optionalEnum(data, "level", "$", LEVELS, error);
    optionalString(data, "note", "$", 0, 240, error);

    var objectiveIds = {};
    if (requireArray(data, "objectives", "$", 1, 8, error)) {
      data.objectives.forEach(function (o, i) {
        var p = "objectives[" + i + "]";
        if (!isObject(o)) { error(p, "must be an object, got " + describe(o)); return; }
        uniqueId(o, p, objectiveIds, "objective", error);
        requireString(o, "text", p, 1, 120, error);
      });
    }

    var metricIds = {}, metrics = [];
    if (requireArray(data, "metrics", "$", 1, 6, error)) {
      data.metrics.forEach(function (m, i) {
        var p = "metrics[" + i + "]";
        if (!isObject(m)) { error(p, "must be an object, got " + describe(m)); return; }
        if (uniqueId(m, p, metricIds, "metric", error)) metrics.push(m);
        requireString(m, "label", p, 1, 24, error);
        optionalEnum(m, "icon", p, ICONS, error);
        optionalString(m, "unit", p, 0, 12, error);
        optionalEnum(m, "format", p, METRIC_FORMATS, error);
        optionalInteger(m, "decimals", p, 0, 3, error);
        optionalEnum(m, "better", p, BETTER, error);
        var okWarn = optionalNumber(m, "warn", p, error);
        var okBad = optionalNumber(m, "bad", p, error);
        var better = m.better || "none";
        if ((m.warn !== undefined || m.bad !== undefined) && better === "none") {
          error(p + (m.warn !== undefined ? ".warn" : ".bad"), "thresholds need better set to \"lower\" or \"higher\", got " + describe(m.better));
        }
        if (okWarn && okBad && m.warn !== undefined && m.bad !== undefined) {
          if (better === "lower" && m.warn > m.bad) error(p + ".warn", "must be at most bad (" + m.bad + ") when better is \"lower\", got " + m.warn);
          if (better === "higher" && m.warn < m.bad) error(p + ".warn", "must be at least bad (" + m.bad + ") when better is \"higher\", got " + m.warn);
        }
      });
    }

    var packetIds = {}, packetUsed = {};
    if (data.packets !== undefined && requireArray(data, "packets", "$", 0, 8, error)) {
      data.packets.forEach(function (k, i) {
        var p = "packets[" + i + "]";
        if (!isObject(k)) { error(p, "must be an object, got " + describe(k)); return; }
        uniqueId(k, p, packetIds, "packet", error);
        requireString(k, "label", p, 1, 24, error);
        optionalEnum(k, "shape", p, SHAPES, error);
        optionalEnum(k, "tone", p, TONES, error);
      });
    }

    var compIds = {}, compShown = {}, cells = {};
    if (requireArray(data, "components", "$", 1, 30, error)) {
      data.components.forEach(function (c, i) {
        var p = "components[" + i + "]";
        if (!isObject(c)) { error(p, "must be an object, got " + describe(c)); return; }
        uniqueId(c, p, compIds, "component", error);
        if (requireEnum(c, "kind", p, KINDS, error)) {
          if (c.count !== undefined && c.kind !== "users" && c.kind !== "botnet") {
            error(p + ".count", "is only allowed on users and botnet components, this one is " + JSON.stringify(c.kind));
          }
          if (BLOCK_KINDS.indexOf(c.kind) !== -1 && typeof c.label === "string" && c.label.length > 16) {
            warn(p + ".label", "a block label longer than 16 characters wraps tightly (" + c.label.length + " characters)");
          }
        }
        requireString(c, "label", p, 1, 24, error);
        optionalString(c, "sublabel", p, 0, 28, error);
        optionalEnum(c, "tone", p, TONES, error);
        optionalEnum(c, "icon", p, ICONS, error);
        optionalInteger(c, "count", p, 3, 24, error);
        if (c.at !== undefined) {
          var at = c.at;
          if (!Array.isArray(at) || at.length !== 2 || !isInt(at[0]) || !isInt(at[1]) ||
              at[0] < 0 || at[0] > 15 || at[1] < 0 || at[1] > 15) {
            error(p + ".at", "must be [col, row] with two integers 0–15, got " + describeValue(at));
          } else {
            var key = at[0] + "," + at[1];
            if (cells[key]) error(p + ".at", "cell [" + key + "] is already taken by component \"" + cells[key] + "\"");
            else cells[key] = typeof c.id === "string" ? c.id : "?";
          }
        }
      });
    }

    var linkIds = {}, linkById = {}, linkShown = {};
    if (data.links !== undefined && requireArray(data, "links", "$", 0, 60, error)) {
      data.links.forEach(function (l, i) {
        var p = "links[" + i + "]";
        if (!isObject(l)) { error(p, "must be an object, got " + describe(l)); return; }
        if (uniqueId(l, p, linkIds, "link", error)) linkById[l.id] = l;
        var f = refString(l, "from", p, compIds, "component", error);
        var t = refString(l, "to", p, compIds, "component", error);
        if (f && t && l.from === l.to) error(p + ".to", "must differ from from (both are \"" + l.to + "\")");
        optionalString(l, "label", p, 0, 40, error);
        optionalEnum(l, "style", p, LINK_STYLES, error);
        optionalEnum(l, "arrow", p, ARROWS, error);
      });
    }

    var stepIds = {}, taught = {}, metricValues = {};
    if (requireArray(data, "steps", "$", 2, 30, error)) {
      if (data.steps.length < 4) warn("steps", "fewer than 4 steps (" + data.steps.length + "); the view shines with a longer story");
      data.steps.forEach(function (s, i) {
        var p = "steps[" + i + "]";
        if (!isObject(s)) { error(p, "must be an object, got " + describe(s)); return; }
        uniqueId(s, p, stepIds, "step", error);
        requireEnum(s, "type", p, STEP_TYPES, error);
        requireString(s, "short", p, 1, 20, error);
        requireString(s, "title", p, 1, 90, error);
        var textLen = 0;
        if (requireArray(s, "body", p, 1, 4, error)) {
          s.body.forEach(function (b, j) { if (checkStringValue(b, p + ".body[" + j + "]", 1, 600, error)) textLen += b.length; });
        }
        if (s.callouts !== undefined && requireArray(s, "callouts", p, 0, 2, error)) {
          s.callouts.forEach(function (c, j) {
            var q = p + ".callouts[" + j + "]";
            if (!isObject(c)) { error(q, "must be an object, got " + describe(c)); return; }
            requireEnum(c, "kind", q, CALLOUT_KINDS, error);
            optionalString(c, "title", q, 1, 24, error);
            if (requireString(c, "text", q, 1, 320, error)) textLen += c.text.length;
          });
        }
        if (s.takeaways !== undefined && requireArray(s, "takeaways", p, 0, 8, error)) {
          s.takeaways.forEach(function (t, j) { if (checkStringValue(t, p + ".takeaways[" + j + "]", 1, 200, error)) textLen += t.length; });
        }
        if (textLen > 900) warn(p, "body, callouts and takeaways add up to " + textLen + " characters; keep a step under about 900 so it stays next to the diagram");
        if (s.changes !== undefined && requireArray(s, "changes", p, 0, 6, error)) {
          s.changes.forEach(function (c, j) {
            var q = p + ".changes[" + j + "]";
            if (!isObject(c)) { error(q, "must be an object, got " + describe(c)); return; }
            requireEnum(c, "mark", q, CHANGE_MARKS, error);
            requireString(c, "text", q, 1, 140, error);
          });
        }
        if (s.objectives !== undefined && requireArray(s, "objectives", p, 0, 4, error)) {
          s.objectives.forEach(function (o, j) {
            var q = p + ".objectives[" + j + "]";
            if (typeof o !== "string") { error(q, "must be an objective id string, got " + describe(o)); return; }
            if (!objectiveIds[o]) error(q, "objective id \"" + o + "\" is not defined in objectives");
            else taught[o] = true;
          });
        }

        // components shown in this step
        var present = {};
        if (!isObject(s.components)) {
          error(p + ".components", "must be an object of component id → state, got " + describe(s.components));
        } else {
          var keys = Object.keys(s.components);
          if (keys.length === 0) error(p + ".components", "must show at least one component");
          if (keys.length > 14) warn(p + ".components", "shows " + keys.length + " components; more than 14 crowds the diagram");
          keys.forEach(function (k) {
            var q = p + ".components." + k;
            if (!compIds[k]) { error(q, "component id \"" + k + "\" is not defined in components"); return; }
            present[k] = true; compShown[k] = true;
            var st = s.components[k];
            if (!isObject(st)) { error(q, "must be an object (use {} for defaults), got " + describe(st)); return; }
            optionalEnum(st, "status", q, STATUSES, error);
            if (st.load !== undefined && (typeof st.load !== "number" || !isFinite(st.load) || st.load < 0 || st.load > 100)) {
              error(q + ".load", "must be a number 0–100, got " + describe(st.load));
            }
            optionalString(st, "badge", q, 1, 28, error);
            optionalEnum(st, "badgeTone", q, BADGE_TONES, error);
            optionalString(st, "label", q, 1, 24, error);
            optionalString(st, "sublabel", q, 0, 28, error);
          });
        }

        // links shown in this step
        var linksHere = {};
        if (s.links !== undefined) {
          if (!isObject(s.links)) {
            error(p + ".links", "must be an object of link id → state, got " + describe(s.links));
          } else {
            Object.keys(s.links).forEach(function (k) {
              var q = p + ".links." + k;
              var l = linkById[k];
              if (!l) { error(q, "link id \"" + k + "\" is not defined in links"); return; }
              linksHere[k] = true; linkShown[k] = true;
              if (compIds[l.from] && !present[l.from]) error(q, "link starts at \"" + l.from + "\", which this step does not show in components");
              if (compIds[l.to] && !present[l.to]) error(q, "link ends at \"" + l.to + "\", which this step does not show in components");
              var st = s.links[k];
              if (!isObject(st)) { error(q, "must be an object (use {} for defaults), got " + describe(st)); return; }
              optionalEnum(st, "state", q, LINK_STATES, error);
              optionalString(st, "label", q, 0, 40, error);
            });
          }
        }

        // flows
        if (s.flows !== undefined && requireArray(s, "flows", p, 0, 12, error)) {
          s.flows.forEach(function (f, j) {
            var q = p + ".flows[" + j + "]";
            if (!isObject(f)) { error(q, "must be an object, got " + describe(f)); return; }
            var list = null;
            if (f.link !== undefined && f.path !== undefined) error(q, "has both link and path; give one");
            else if (f.link !== undefined) {
              if (typeof f.link !== "string") error(q + ".link", "must be a link id string, got " + describe(f.link));
              else list = [f.link];
            } else if (f.path !== undefined) {
              if (requireArray(f, "path", q, 1, 6, error)) {
                var okp = true;
                f.path.forEach(function (x, n) { if (typeof x !== "string") { error(q + ".path[" + n + "]", "must be a link id string, got " + describe(x)); okp = false; } });
                if (okp) list = f.path;
              }
            } else error(q, "needs link or path");
            if (list) {
              var known = true;
              list.forEach(function (lid, n) {
                var lp = f.link !== undefined ? q + ".link" : q + ".path[" + n + "]";
                if (!linkById[lid]) { error(lp, "link id \"" + lid + "\" is not defined in links"); known = false; }
                else if (!linksHere[lid]) { error(lp, "link \"" + lid + "\" is not shown in this step's links"); known = false; }
              });
              if (known) {
                for (var n = 1; n < list.length; n++) {
                  var a = linkById[list[n - 1]], b = linkById[list[n]];
                  if (!compIds[a.from] || !compIds[a.to] || !compIds[b.from] || !compIds[b.to]) continue;
                  var shared = [a.from, a.to].filter(function (x) { return x === b.from || x === b.to; });
                  if (shared.length !== 1) {
                    error(q + ".path[" + n + "]", "link \"" + b.id + "\" must share exactly one component with \"" + a.id + "\", they share " + shared.length);
                  }
                }
              }
            }
            if (refString(f, "packet", q, packetIds, "packet", error)) packetUsed[f.packet] = true;
            optionalInteger(f, "rate", q, 1, 5, error);
            optionalEnum(f, "outcome", q, OUTCOMES, error);
            optionalBoolean(f, "reverse", q, error);
          });
        }

        if (s.focus !== undefined && requireArray(s, "focus", p, 0, 30, error)) {
          s.focus.forEach(function (x, j) {
            var q = p + ".focus[" + j + "]";
            if (typeof x !== "string") error(q, "must be a component id string, got " + describe(x));
            else if (!compIds[x]) error(q, "component id \"" + x + "\" is not defined in components");
            else if (!present[x]) error(q, "component \"" + x + "\" is not shown in this step's components");
          });
        }

        // metrics: one value for every metric
        if (!isObject(s.metrics)) {
          error(p + ".metrics", "must be an object of metric id → value, got " + describe(s.metrics));
        } else {
          metrics.forEach(function (m) {
            if (!(m.id in s.metrics)) error(p + ".metrics." + m.id, "is missing; every step needs a value for every metric");
          });
          Object.keys(s.metrics).forEach(function (k) {
            var q = p + ".metrics." + k;
            if (!metricIds[k]) { error(q, "metric id \"" + k + "\" is not defined in metrics"); return; }
            var v = s.metrics[k], raw = v;
            if (isObject(v)) {
              raw = v.value;
              optionalEnum(v, "level", q, VALUE_LEVELS, error);
              Object.keys(v).forEach(function (kk) { if (kk !== "value" && kk !== "level") error(q + "." + kk, "is not a known field (use value and level)"); });
            }
            if (typeof raw === "number") {
              if (!isFinite(raw)) error(q + (isObject(v) ? ".value" : ""), "must be a finite number, got " + describe(raw));
            } else if (typeof raw === "string") {
              if (raw.trim().length < 1 || raw.length > 16) error(q + (isObject(v) ? ".value" : ""), "a text value must be 1–16 characters, got " + raw.length);
            } else {
              error(q + (isObject(v) ? ".value" : ""), "must be a number, a short string or { value, level }, got " + describe(raw));
            }
            if (!metricValues[k]) metricValues[k] = [];
            metricValues[k].push(JSON.stringify(raw));
          });
        }

        if (s.breakdown !== undefined) {
          checkBreakdown(s.breakdown, p + ".breakdown", error);
          if (s.type !== "recap" && s.type !== "case") warn(p + ".breakdown", "a breakdown usually belongs on the recap or a case step");
        }
      });

      var last = data.steps[data.steps.length - 1];
      if (isObject(last) && last.type !== "recap") warn("steps[" + (data.steps.length - 1) + "].type", "the last step is usually a recap, got " + describe(last.type));
    }

    Object.keys(objectiveIds).forEach(function (id) {
      if (!taught[id]) error("objectives[" + objectiveIds[id].index + "]", "objective \"" + id + "\" is not taught by any step (list it in a step's objectives)");
    });
    Object.keys(compIds).forEach(function (id) {
      if (!compShown[id]) warn("components[" + compIds[id].index + "]", "component \"" + id + "\" is not shown in any step");
    });
    Object.keys(linkIds).forEach(function (id) {
      if (!linkShown[id]) warn("links[" + linkIds[id].index + "]", "link \"" + id + "\" is not shown in any step");
    });
    Object.keys(packetIds).forEach(function (id) {
      if (!packetUsed[id]) warn("packets[" + packetIds[id].index + "]", "packet \"" + id + "\" is not used by any flow");
    });
    if (Array.isArray(data.steps) && data.steps.length > 1) {
      Object.keys(metricValues).forEach(function (id) {
        var vals = metricValues[id];
        if (vals.length === data.steps.length && vals.every(function (v) { return v === vals[0]; })) {
          warn("metrics[" + metricIds[id].index + "]", "metric \"" + id + "\" has the same value at every step");
        }
      });
    }

    if (data.sources !== undefined && requireArray(data, "sources", "$", 0, 12, error)) {
      data.sources.forEach(function (s, i) {
        var p = "sources[" + i + "]";
        if (!isObject(s)) { error(p, "must be an object, got " + describe(s)); return; }
        requireString(s, "label", p, 1, 160, error);
        if (s.url !== undefined) {
          if (typeof s.url !== "string" || !/^https:\/\/[^\s]+$/.test(s.url) || s.url.length > 500) {
            error(p + ".url", "must be an https:// URL of at most 500 characters, got " + describe(s.url));
          }
        }
      });
    }
  }

  function checkBreakdown(b, p, error) {
    if (!isObject(b)) { error(p, "must be an object, got " + describe(b)); return; }
    requireString(b, "title", p, 1, 48, error);
    optionalString(b, "unit", p, 0, 12, error);
    optionalString(b, "note", p, 0, 140, error);
    var sum = 0, rowsOk = false;
    if (requireArray(b, "rows", p, 1, 8, error)) {
      rowsOk = true;
      b.rows.forEach(function (r, i) {
        var q = p + ".rows[" + i + "]";
        if (!isObject(r)) { error(q, "must be an object, got " + describe(r)); rowsOk = false; return; }
        requireString(r, "label", q, 1, 48, error);
        if (typeof r.value !== "number" || !isFinite(r.value)) { error(q + ".value", "must be a finite number, got " + describe(r.value)); rowsOk = false; }
        else sum += r.value;
        optionalBoolean(r, "highlight", q, error);
      });
    }
    if (!isObject(b.total)) { error(p + ".total", "must be an object { label, value }, got " + describe(b.total)); return; }
    requireString(b.total, "label", p + ".total", 1, 32, error);
    if (typeof b.total.value !== "number" || !isFinite(b.total.value)) {
      error(p + ".total.value", "must be a finite number, got " + describe(b.total.value));
      return;
    }
    if (rowsOk && Math.abs(sum - b.total.value) > 1e-6 * Math.max(1, Math.abs(b.total.value))) {
      error(p + ".total.value", "the rows add up to " + round(sum) + ", not " + b.total.value);
    }
  }

  function round(x) { return Math.round(x * 1e6) / 1e6; }

  function isObject(v) { return v !== null && typeof v === "object" && !Array.isArray(v); }
  function isInt(v) { return typeof v === "number" && isFinite(v) && Math.floor(v) === v; }
  function describeValue(v) { try { return JSON.stringify(v); } catch (e) { return describe(v); } }

  function uniqueId(obj, parent, seen, what, error) {
    var path = join(parent, "id"), v = obj.id;
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (!ID_RE.test(v)) { error(path, "must be lowercase kebab-case (like \"login-api\"), got " + JSON.stringify(v)); return false; }
    if (seen[v]) { error(path, "duplicate " + what + " id \"" + v + "\" (also used at index " + seen[v].index + ")"); return false; }
    var m = /\[(\d+)\]$/.exec(parent);
    seen[v] = { index: m ? Number(m[1]) : 0 };
    return true;
  }
  function refString(obj, key, parent, ids, what, error) {
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "string") { error(path, "must be a " + what + " id string, got " + describe(v)); return false; }
    if (!ids[v]) { error(path, what + " id \"" + v + "\" is not defined in " + what + "s"); return false; }
    return true;
  }
  function checkStringValue(v, path, min, max, error) {
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (v.trim().length < min) { error(path, "must be a non-empty string"); return false; }
    if (v.length > max) { error(path, "must be at most " + max + " characters, got " + v.length); return false; }
    return true;
  }
  function optionalString(obj, key, parent, min, max, error) {
    if (obj[key] === undefined) return true;
    var path = join(parent, key), v = obj[key];
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (min > 0 && v.trim().length < min) { error(path, "must be a non-empty string"); return false; }
    if (v.length > max) { error(path, "must be at most " + max + " characters, got " + v.length); return false; }
    return true;
  }
  function requireEnum(obj, key, parent, allowed, error) {
    var path = join(parent, key), v = obj[key];
    if (allowed.indexOf(v) === -1) {
      error(path, "must be one of " + allowed.map(function (a) { return JSON.stringify(a); }).join(", ") + ", got " + describe(v));
      return false;
    }
    return true;
  }
  function optionalEnum(obj, key, parent, allowed, error) {
    if (obj[key] === undefined) return true;
    return requireEnum(obj, key, parent, allowed, error);
  }
  function optionalInteger(obj, key, parent, min, max, error) {
    if (obj[key] === undefined) return true;
    var path = join(parent, key), v = obj[key];
    if (!isInt(v)) { error(path, "must be an integer, got " + describe(v)); return false; }
    if (v < min || v > max) { error(path, "must be between " + min + " and " + max + ", got " + v); return false; }
    return true;
  }
  function optionalNumber(obj, key, parent, error) {
    if (obj[key] === undefined) return true;
    if (typeof obj[key] !== "number" || !isFinite(obj[key])) { error(join(parent, key), "must be a finite number, got " + describe(obj[key])); return false; }
    return true;
  }
  function optionalBoolean(obj, key, parent, error) {
    if (obj[key] === undefined) return true;
    if (typeof obj[key] !== "boolean") { error(join(parent, key), "must be true or false, got " + describe(obj[key])); return false; }
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
