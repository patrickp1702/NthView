/* NthView — concept-map validator — schemaVersion 1
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
  var KEBAB = /^[a-z0-9]+(-[a-z0-9]+)*$/;
  var THEMES = ["nebula", "blueprint", "atlas", "botanic", "prism"];
  var COLORS = ["red", "orange", "gold", "green", "teal", "blue", "violet", "pink"];
  var TASK_TYPES = ["place", "relation", "connect", "spot", "order", "label"];

  function checkRoot(data, error, warn) {
    requireString(data, "title", "$", 1, 80, error);
    optionalString(data, "subtitle", "$", 200, error);
    if (data.theme !== undefined && THEMES.indexOf(data.theme) === -1) {
      error("theme", "must be one of " + THEMES.join(", ") + "; got " + describe(data.theme) + " (or omit it to derive one from the title)");
    }
    optionalStringArray(data, "intro", "$", 1, 3, 500, error);

    /* ---- clusters ---- */
    var clusterIds = {}, usedColors = {};
    requireArray(data, "clusters", "$", 2, 8, error);
    if (Array.isArray(data.clusters)) {
      data.clusters.forEach(function (c, i) {
        var p = "clusters[" + i + "]";
        if (!isObject(c, p, error)) return;
        if (checkId(c, p, error)) {
          if (clusterIds[c.id]) error(p + ".id", "duplicate cluster id " + describe(c.id) + "; ids must be unique");
          else clusterIds[c.id] = { index: i, count: 0, touched: false };
        }
        requireString(c, "name", p, 1, 40, error);
        optionalString(c, "description", p, 240, error);
        if (c.color !== undefined) {
          if (COLORS.indexOf(c.color) === -1) error(p + ".color", "must be one of " + COLORS.join(", ") + "; got " + describe(c.color));
          else if (usedColors[c.color] !== undefined) warn(p + ".color", "colour " + describe(c.color) + " is also used by clusters[" + usedColors[c.color] + "]; give each cluster its own colour so they stay distinct");
          else usedColors[c.color] = i;
        }
      });
    }

    /* ---- nodes ---- */
    var nodeIds = {}, nodeLabels = {};
    requireArray(data, "nodes", "$", 6, 60, error);
    if (Array.isArray(data.nodes)) {
      data.nodes.forEach(function (n, i) {
        var p = "nodes[" + i + "]";
        if (!isObject(n, p, error)) return;
        if (checkId(n, p, error)) {
          if (nodeIds[n.id]) error(p + ".id", "duplicate node id " + describe(n.id) + "; ids must be unique");
          else nodeIds[n.id] = { index: i, degree: 0, label: typeof n.label === "string" ? n.label : n.id, cluster: n.cluster };
        }
        if (requireString(n, "label", p, 1, 48, error)) {
          var key = n.label.trim().toLowerCase();
          if (nodeLabels[key] !== undefined) warn(p + ".label", "same label as nodes[" + nodeLabels[key] + "]; learners cannot tell the two apart");
          else nodeLabels[key] = i;
        }
        requireString(n, "definition", p, 1, 240, error);
        optionalString(n, "note", p, 800, error);
        optionalString(n, "example", p, 300, error);
        if (requireString(n, "cluster", p, 1, 40, error) && !clusterIds[n.cluster]) {
          error(p + ".cluster", "cluster id " + describe(n.cluster) + " is not defined in clusters");
        } else if (clusterIds[n.cluster]) clusterIds[n.cluster].count++;
      });
    }
    Object.keys(clusterIds).forEach(function (id) {
      if (clusterIds[id].count === 0 && Array.isArray(data.nodes)) warn("clusters[" + clusterIds[id].index + "]", "cluster " + describe(id) + " has no nodes");
    });

    if (data.root === undefined || typeof data.root !== "string") error("root", "must be a node id string, got " + describe(data.root));
    else if (Array.isArray(data.nodes) && !nodeIds[data.root]) error("root", "node id " + describe(data.root) + " is not defined in nodes");

    /* ---- edges ---- */
    var edgeIds = {}, pairs = {};
    requireArray(data, "edges", "$", 5, 120, error);
    if (Array.isArray(data.edges)) {
      data.edges.forEach(function (e, i) {
        var p = "edges[" + i + "]";
        if (!isObject(e, p, error)) return;
        var idOk = checkId(e, p, error);
        if (idOk) {
          if (edgeIds[e.id]) error(p + ".id", "duplicate edge id " + describe(e.id) + "; ids must be unique");
          else if (nodeIds[e.id]) error(p + ".id", "edge id " + describe(e.id) + " is also a node id; node and edge ids must differ so tour focus lists are unambiguous");
        }
        var fromOk = checkRef(e, "from", p, nodeIds, "nodes", error);
        var toOk = checkRef(e, "to", p, nodeIds, "nodes", error);
        if (requireString(e, "relation", p, 1, 32, error) && e.relation.length > 24) {
          warn(p + ".relation", "relation label is " + e.relation.length + " characters; 24 or fewer keep the map readable");
        }
        requireString(e, "explanation", p, 1, 400, error);
        if (fromOk && toOk) {
          if (e.from === e.to) error(p + ".to", "an edge cannot connect node " + describe(e.from) + " to itself");
          else {
            var key = e.from + ">" + e.to;
            if (pairs[key] !== undefined) error(p, "duplicate edge from " + describe(e.from) + " to " + describe(e.to) + " (same as edges[" + pairs[key] + "]); merge them into one relation");
            else pairs[key] = i;
            nodeIds[e.from].degree++; nodeIds[e.to].degree++;
          }
        }
        if (idOk && !edgeIds[e.id]) edgeIds[e.id] = { index: i, from: e.from, to: e.to, relation: e.relation };
      });
      Object.keys(nodeIds).forEach(function (id) {
        if (nodeIds[id].degree === 0) warn("nodes[" + nodeIds[id].index + "]", "node " + describe(id) + " has no edges; an unconnected concept teaches no structure");
      });
      if (!isConnected(nodeIds, edgeIds)) warn("edges", "the map falls apart into separate pieces; link every part to the rest");
    }

    /* ---- tour ---- */
    if (requireArray(data, "tour", "$", 1, 20, error)) {
      data.tour.forEach(function (s, i) {
        var p = "tour[" + i + "]";
        if (!isObject(s, p, error)) return;
        requireString(s, "title", p, 1, 80, error);
        requireString(s, "text", p, 1, 500, error);
        if (requireArray(s, "focus", p, 1, 40, error)) {
          var seen = {};
          s.focus.forEach(function (id, j) {
            var fp = p + ".focus[" + j + "]";
            if (typeof id !== "string") { error(fp, "must be a node or edge id string, got " + describe(id)); return; }
            if (seen[id]) { error(fp, "id " + describe(id) + " is listed twice"); return; }
            seen[id] = true;
            if (nodeIds[id]) { if (clusterIds[nodeIds[id].cluster]) clusterIds[nodeIds[id].cluster].touched = true; }
            else if (!edgeIds[id]) error(fp, "id " + describe(id) + " is not defined in nodes or edges");
          });
        }
      });
      if (data.tour.length < 3) warn("tour", "only " + data.tour.length + " tour step(s); 4–8 steps let each region be seen on its own");
      Object.keys(clusterIds).forEach(function (id) {
        if (clusterIds[id].count && !clusterIds[id].touched) warn("tour", "no tour step focuses on a node of cluster " + describe(id));
      });
    }

    /* ---- rebuild ---- */
    if (requireObject(data, "rebuild", "$", error)) {
      optionalString(data.rebuild, "intro", "rebuild", 300, error);
      if (requireArray(data.rebuild, "tasks", "rebuild", 1, 30, error)) {
        checkTasks(data.rebuild.tasks, nodeIds, edgeIds, data.root, error, warn);
      }
    }

    /* ---- reflection ---- */
    if (requireObject(data, "reflection", "$", error)) {
      var r = data.reflection;
      optionalString(r, "prompt", "reflection", 200, error);
      optionalString(r, "closing", "reflection", 500, error);
      var keys = {};
      if (Array.isArray(r.keyEdges) && r.keyEdges.length !== 3) {
        error("reflection.keyEdges", "must have exactly 3 items, got " + r.keyEdges.length);
      } else if (requireArray(r, "keyEdges", "reflection", 3, 3, error)) {
        r.keyEdges.forEach(function (k, i) {
          var p = "reflection.keyEdges[" + i + "]";
          if (!isObject(k, p, error)) return;
          if (checkRef(k, "edge", p, edgeIds, "edges", error)) {
            if (keys[k.edge]) error(p + ".edge", "edge " + describe(k.edge) + " is listed twice; pick three different edges");
            keys[k.edge] = true;
          }
          requireString(k, "why", p, 1, 500, error);
        });
      }
      if (r.candidates !== undefined && requireArray(r, "candidates", "reflection", 4, 24, error)) {
        var cand = {};
        r.candidates.forEach(function (id, i) {
          var p = "reflection.candidates[" + i + "]";
          if (typeof id !== "string") { error(p, "must be an edge id string, got " + describe(id)); return; }
          if (!edgeIds[id]) { error(p, "edge id " + describe(id) + " is not defined in edges"); return; }
          if (cand[id]) error(p, "edge id " + describe(id) + " is listed twice");
          cand[id] = true;
        });
        Object.keys(keys).forEach(function (id) {
          if (!cand[id]) error("reflection.candidates", "must include every key edge, but " + describe(id) + " is missing");
        });
      }
    }

    /* ---- glossary + summary ---- */
    if (data.glossary !== undefined && requireArray(data, "glossary", "$", 0, 80, error)) {
      data.glossary.forEach(function (g, i) {
        var p = "glossary[" + i + "]";
        if (!isObject(g, p, error)) return;
        requireString(g, "term", p, 1, 60, error);
        requireString(g, "meaning", p, 1, 300, error);
      });
    }
    if (data.summary !== undefined && isObject(data.summary, "summary", error)) {
      optionalString(data.summary, "heading", "summary", 80, error);
      requireStringArray(data.summary, "paragraphs", "summary", 1, 4, 600, error);
    }
  }

  function checkTasks(tasks, nodeIds, edgeIds, rootId, error, warn) {
    var ids = {}, types = {}, nodeOwner = {}, edgeOwner = {};
    var hides = [];   // per task: { edges: {id:true}, labels: {id:true}, loose: {nodeId:true} }
    var shows = [];   // per task: list of { path, edge } or { path, node } the task needs visible
    tasks.forEach(function (t, i) {
      var p = "rebuild.tasks[" + i + "]";
      var hide = { edges: {}, labels: {}, loose: {} }, show = [];
      hides.push(hide); shows.push(show);
      if (!isObject(t, p, error)) return;
      if (checkId(t, p, error)) {
        if (ids[t.id]) error(p + ".id", "duplicate task id " + describe(t.id) + "; ids must be unique");
        ids[t.id] = true;
      }
      if (TASK_TYPES.indexOf(t.type) === -1) {
        error(p + ".type", "must be one of " + TASK_TYPES.join(", ") + "; got " + describe(t.type));
        return;
      }
      types[t.type] = true;
      optionalString(t, "prompt", p, 240, error);
      requireString(t, "hint", p, 1, 300, error);
      requireString(t, "why", p, 1, 500, error);

      function ownNode(id, path) {
        if (nodeOwner[id] !== undefined) error(path, "node " + describe(id) + " is already taken apart by rebuild.tasks[" + nodeOwner[id] + "]; each node is taken apart by at most one task");
        else nodeOwner[id] = i;
      }
      function ownEdge(id, path) {
        if (edgeOwner[id] !== undefined) error(path, "edge " + describe(id) + " is already taken apart by rebuild.tasks[" + edgeOwner[id] + "]; each edge is taken apart by at most one task");
        else edgeOwner[id] = i;
      }

      if (t.type === "place") {
        var placed = nodeList(t, "nodes", p, 1, 6, nodeIds, error);
        placed.forEach(function (x) {
          if (x.id === rootId) { error(x.path, "the root concept " + describe(rootId) + " stays on the map and cannot be placed"); return; }
          ownNode(x.id, x.path);
          hide.loose[x.id] = true;
          Object.keys(edgeIds).forEach(function (eid) { if (edgeIds[eid].from === x.id || edgeIds[eid].to === x.id) hide.edges[eid] = true; });
        });
      } else if (t.type === "order") {
        var steps = nodeList(t, "nodes", p, 3, 8, nodeIds, error);
        var inSet = {};
        steps.forEach(function (x) { ownNode(x.id, x.path); inSet[x.id] = true; });
        Object.keys(edgeIds).forEach(function (eid) { if (inSet[edgeIds[eid].from] && inSet[edgeIds[eid].to]) hide.edges[eid] = true; });
        for (var k = 1; k < steps.length; k++) {
          var a = steps[k - 1].id, b = steps[k].id, linked = false;
          Object.keys(edgeIds).forEach(function (eid) { var e = edgeIds[eid]; if ((e.from === a && e.to === b) || (e.from === b && e.to === a)) linked = true; });
          if (!linked) warn(steps[k].path, "no edge links " + describe(a) + " and " + describe(b) + "; consecutive steps of a process are usually connected");
        }
      } else if (t.type === "label") {
        if (checkRef(t, "node", p, nodeIds, "nodes", error)) {
          ownNode(t.node, p + ".node");
          checkOptions(t, p, nodeIds[t.node].label, "the node's label", error, warn);
        }
      } else if (t.type === "relation") {
        if (checkRef(t, "edge", p, edgeIds, "edges", error)) {
          ownEdge(t.edge, p + ".edge");
          hide.labels[t.edge] = true;
          show.push({ path: p + ".edge", edge: t.edge });
          checkOptions(t, p, edgeIds[t.edge].relation, "the edge's relation", error, warn);
        }
      } else if (t.type === "connect") {
        if (checkRef(t, "edge", p, edgeIds, "edges", error)) {
          ownEdge(t.edge, p + ".edge");
          hide.edges[t.edge] = true;
          show.push({ path: p + ".edge", node: edgeIds[t.edge].from }, { path: p + ".edge", node: edgeIds[t.edge].to });
        }
      } else if (t.type === "spot") {
        var target = checkRef(t, "edge", p, edgeIds, "edges", error);
        if (target) {
          ownEdge(t.edge, p + ".edge");
          hide.labels[t.edge] = true;
          show.push({ path: p + ".edge", edge: t.edge });
        }
        if (requireString(t, "wrongRelation", p, 1, 32, error) && target &&
            t.wrongRelation.trim().toLowerCase() === String(edgeIds[t.edge].relation).trim().toLowerCase()) {
          error(p + ".wrongRelation", "must differ from the edge's real relation " + describe(edgeIds[t.edge].relation) + "; it is the deliberate mistake the learner spots");
        }
        if (requireArray(t, "candidates", p, 2, 6, error)) {
          var cs = {};
          t.candidates.forEach(function (id, j) {
            var cp = p + ".candidates[" + j + "]";
            if (typeof id !== "string") { error(cp, "must be an edge id string, got " + describe(id)); return; }
            if (!edgeIds[id]) { error(cp, "edge id " + describe(id) + " is not defined in edges"); return; }
            if (cs[id]) { error(cp, "edge id " + describe(id) + " is listed twice"); return; }
            cs[id] = true;
            if (id !== t.edge) show.push({ path: cp, edge: id, label: true });
          });
          if (target && !cs[t.edge]) error(p + ".candidates", "must include the mislabelled edge " + describe(t.edge));
        }
      }
    });

    /* every element a task shows must still be on the map when it runs */
    shows.forEach(function (list, i) {
      list.forEach(function (s) {
        for (var j = i + 1; j < hides.length; j++) {
          var h = hides[j];
          if (s.edge && h.edges[s.edge]) {
            error(s.path, "edge " + describe(s.edge) + " is still taken apart by the later rebuild.tasks[" + j + "] when this task runs; move this task after it");
            return;
          }
          if (s.label && h.labels[s.edge]) {
            error(s.path, "the label of edge " + describe(s.edge) + " is still blank or false (rebuild.tasks[" + j + "] restores it later) when this task runs; a candidate must show its real label");
            return;
          }
          if (s.node && h.loose[s.node]) {
            error(s.path, "node " + describe(s.node) + " is still loose (rebuild.tasks[" + j + "] places it later) when this task runs; move this task after it");
            return;
          }
        }
      });
    });

    var n = Object.keys(types).length;
    if (tasks.length >= 4 && n < 3) warn("rebuild.tasks", "only " + n + " task type(s); mixing at least three kinds keeps retrieval varied");
  }

  function nodeList(t, key, p, min, max, nodeIds, error) {
    var out = [];
    if (!requireArray(t, key, p, min, max, error)) return out;
    var seen = {};
    t[key].forEach(function (id, j) {
      var np = p + "." + key + "[" + j + "]";
      if (typeof id !== "string") { error(np, "must be a node id string, got " + describe(id)); return; }
      if (!nodeIds[id]) { error(np, "node id " + describe(id) + " is not defined in nodes"); return; }
      if (seen[id]) { error(np, "node id " + describe(id) + " is listed twice"); return; }
      seen[id] = true;
      out.push({ id: id, path: np });
    });
    return out;
  }

  function checkOptions(t, p, truth, what, error, warn) {
    if (!requireArray(t, "options", p, 2, 6, error)) return;
    var correct = 0, labels = {};
    t.options.forEach(function (o, i) {
      var op = p + ".options[" + i + "]";
      if (!isObject(o, op, error)) return;
      var ok = requireString(o, "label", op, 1, 48, error);
      optionalBool(o, "correct", op, error);
      optionalString(o, "why", op, 400, error);
      if (ok) {
        var key = o.label.trim().toLowerCase();
        if (labels[key]) error(op + ".label", "duplicate option label " + describe(o.label));
        labels[key] = true;
        if (o.correct === true && typeof truth === "string" && key !== truth.trim().toLowerCase()) {
          error(op + ".label", "the correct option must read exactly " + describe(truth) + " (" + what + "), got " + describe(o.label));
        }
      }
      if (o.correct === true) correct++;
      else if (o.why === undefined) warn(op, "wrong option has no \"why\"; the task's \"why\" is shown instead");
    });
    if (correct !== 1) error(p + ".options", "exactly one option must have \"correct\": true, found " + correct);
  }

  function checkId(obj, p, error) {
    if (!requireString(obj, "id", p, 1, 40, error)) return false;
    if (!KEBAB.test(obj.id)) { error(p + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(obj.id)); return false; }
    return true;
  }
  function checkRef(obj, key, p, table, tableName, error) {
    var v = obj[key], path = join(p, key);
    if (typeof v !== "string") { error(path, "must be an id string, got " + describe(v)); return false; }
    if (!table[v]) { error(path, (tableName === "nodes" ? "node" : "edge") + " id " + describe(v) + " is not defined in " + tableName); return false; }
    return true;
  }
  function isConnected(nodeIds, edgeIds) {
    var ids = Object.keys(nodeIds);
    if (!ids.length) return true;
    var adj = {};
    ids.forEach(function (id) { adj[id] = []; });
    Object.keys(edgeIds).forEach(function (eid) {
      var e = edgeIds[eid];
      if (adj[e.from] && adj[e.to]) { adj[e.from].push(e.to); adj[e.to].push(e.from); }
    });
    var seen = {}, stack = [ids[0]], count = 0;
    seen[ids[0]] = true;
    while (stack.length) {
      var cur = stack.pop(); count++;
      adj[cur].forEach(function (nb) { if (!seen[nb]) { seen[nb] = true; stack.push(nb); } });
    }
    return count === ids.length;
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
