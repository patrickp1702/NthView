/* NthView — detective validator — schemaVersion 1
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
  var THEMES = ["noir", "parchment", "neon", "newsroom", "forensic"];
  var CAST_KINDS = ["witness", "expert", "suspect"];
  var SKINS = ["porcelain", "fair", "tan", "olive", "brown", "deep"];
  var HAIRS = ["short", "long", "bob", "bun", "curly", "buzz", "bald", "ponytail"];
  var HAIR_COLORS = ["black", "brown", "auburn", "blonde", "red", "grey", "white"];
  var OUTFITS = ["suit", "shirt", "apron", "chef", "labcoat", "hoodie", "uniform", "cardigan"];
  var ACCESSORIES = ["none", "glasses", "fedora", "cap", "headscarf", "earrings", "headset"];
  var FACIAL = ["none", "beard", "moustache", "stubble"];
  var EXPRESSIONS = ["neutral", "smile", "worried", "stern"];
  var LOC_TYPES = ["examine", "interview", "document", "compare", "timeline", "ledger", "lock", "lab"];
  var SCENES = ["kitchen", "office", "storeroom", "lab", "street", "room"];
  var OBJECTS = ["fridge", "dial", "alarm", "certificate", "drawer", "bin", "sink", "shelf", "box", "laptop", "phone", "note", "door", "jar", "clipboard", "camera", "cabinet", "plant"];
  var DOC_TYPES = ["memo", "email", "policy", "log", "letter", "label", "report"];
  var CLUE_KINDS = ["physical", "testimony", "document", "record", "test"];
  var VISUALS = ["gauge", "dish", "beaker"];
  var HEX = /^#[0-9a-fA-F]{6}$/;

  function checkRoot(data, error, warn) {
    requireString(data, "title", "$", 1, 80, error);
    optionalString(data, "subtitle", "$", 200, error);
    optionalString(data, "caseNumber", "$", 16, error);
    if (data.theme !== undefined && THEMES.indexOf(data.theme) === -1) {
      error("theme", "must be one of " + THEMES.join(", ") + "; got " + describe(data.theme) + " (or omit it to derive one from the title)");
    }

    if (requireObject(data, "briefing", "$", error)) {
      var b = data.briefing;
      optionalString(b, "heading", "briefing", 60, error);
      requireStringArray(b, "paragraphs", "briefing", 1, 5, 600, error);
      requireString(b, "question", "briefing", 1, 200, error);
      optionalString(b, "stakes", "briefing", 200, error);
    }
    if (requireObject(data, "detective", "$", error)) {
      requireString(data.detective, "title", "detective", 1, 120, error);
      optionalString(data.detective, "description", "detective", 400, error);
    }

    /* collect ids first so cross references can be checked in any order */
    var castIds = idList(data.cast), hypIds = idList(data.hypotheses), clueIds = idList(data.clues);

    if (requireArray(data, "cast", "$", 1, 10, error)) {
      var seenCast = [];
      data.cast.forEach(function (c, i) { checkPerson(c, "cast[" + i + "]", seenCast, error); });
    }

    var correctId = null;
    if (requireArray(data, "hypotheses", "$", 2, 6, error)) {
      var seenHyp = [], correct = 0, popular = 0;
      data.hypotheses.forEach(function (h, i) {
        var p = "hypotheses[" + i + "]";
        if (!isObject(h, p, error)) return;
        checkId(h, p, seenHyp, "hypothesis", error);
        requireString(h, "title", p, 1, 80, error);
        requireString(h, "statement", p, 1, 300, error);
        optionalBool(h, "correct", p, error);
        optionalBool(h, "popular", p, error);
        requireString(h, "why", p, 1, 600, error);
        optionalString(h, "tempting", p, 400, error);
        if (h.holder !== undefined && castIds.indexOf(h.holder) === -1) error(p + ".holder", "cast id " + describe(h.holder) + " is not defined in cast");
        if (h.correct === true) {
          correct++; correctId = h.id;
          if (h.popular === true) error(p + ".popular", "the correct hypothesis cannot be marked popular; popular marks a tempting wrong theory");
        } else {
          if (h.tempting === undefined) error(p + ".tempting", "is required on a wrong hypothesis (say honestly why people believe it)");
          if (h.popular === true) popular++;
        }
      });
      if (correct !== 1) error("hypotheses", "exactly one hypothesis must have \"correct\": true, found " + correct);
      if (data.hypotheses.length < 3) warn("hypotheses", "only " + data.hypotheses.length + " hypotheses; 3–5 give the board more to eliminate");
      if (correct === 1 && popular === 0) warn("hypotheses", "no wrong hypothesis is marked \"popular\": true; flag the theory most people believe");
    }

    var ruledOut = {};
    if (requireArray(data, "clues", "$", 2, 40, error)) {
      var seenClue = [], anyHerring = false;
      data.clues.forEach(function (c, i) {
        var p = "clues[" + i + "]";
        if (!isObject(c, p, error)) return;
        checkId(c, p, seenClue, "clue", error);
        requireString(c, "title", p, 1, 60, error);
        if (c.kind !== undefined && CLUE_KINDS.indexOf(c.kind) === -1) error(p + ".kind", "must be one of " + CLUE_KINDS.join(", ") + ", got " + describe(c.kind));
        requireString(c, "text", p, 1, 300, error);
        requireString(c, "proves", p, 1, 300, error);
        requireString(c, "why", p, 1, 400, error);
        optionalBool(c, "redHerring", p, error);
        if (c.redHerring === true) anyHerring = true;
        var against = [];
        if (c.rulesOut !== undefined && requireArray(c, "rulesOut", p, 0, 5, error)) {
          c.rulesOut.forEach(function (r, k) {
            var rp = p + ".rulesOut[" + k + "]";
            if (!isObject(r, rp, error)) return;
            requireString(r, "because", rp, 1, 300, error);
            if (typeof r.hypothesis !== "string" || hypIds.indexOf(r.hypothesis) === -1) { error(rp + ".hypothesis", "hypothesis id " + describe(r.hypothesis) + " is not defined in hypotheses"); return; }
            if (r.hypothesis === correctId) error(rp + ".hypothesis", "rules out " + describe(r.hypothesis) + ", which is the correct hypothesis; no clue may contradict the right explanation");
            if (against.indexOf(r.hypothesis) !== -1) error(rp + ".hypothesis", "hypothesis " + describe(r.hypothesis) + " is listed twice in this clue's rulesOut");
            against.push(r.hypothesis);
            ruledOut[r.hypothesis] = true;
          });
          if (c.redHerring === true && c.rulesOut.length) error(p + ".rulesOut", "a red herring rules nothing out; remove rulesOut or remove \"redHerring\": true");
        }
        if (c.supports !== undefined && requireArray(c, "supports", p, 0, 6, error)) {
          c.supports.forEach(function (h, k) {
            var sp = p + ".supports[" + k + "]";
            if (typeof h !== "string" || hypIds.indexOf(h) === -1) error(sp, "hypothesis id " + describe(h) + " is not defined in hypotheses");
            else if (against.indexOf(h) !== -1) error(sp, "hypothesis " + describe(h) + " is both supported and ruled out by this clue");
          });
          if (c.redHerring === true && c.supports.length) error(p + ".supports", "a red herring supports nothing; remove supports or remove \"redHerring\": true");
        }
        if (c.redHerring !== true && !(c.rulesOut && c.rulesOut.length) && !(c.supports && c.supports.length)) {
          warn(p, "clue " + describe(c.id) + " neither rules out nor supports any hypothesis and is not a red herring; it will do nothing on the board");
        }
      });
      if (!anyHerring) warn("clues", "no clue is marked \"redHerring\": true; a red herring teaches the difference between evidence and noise");
    }
    if (Array.isArray(data.hypotheses) && correctId !== null) {
      data.hypotheses.forEach(function (h, i) {
        if (h && typeof h === "object" && h.correct !== true && typeof h.id === "string" && !ruledOut[h.id]) {
          error("hypotheses[" + i + "]", "wrong hypothesis " + describe(h.id) + " is not ruled out by any clue; add it to some clue's rulesOut so the learner can eliminate it");
        }
      });
    }

    var revealed = {};
    if (requireArray(data, "locations", "$", 2, 14, error)) {
      var seenLoc = [], types = {};
      data.locations.forEach(function (loc, i) {
        var p = "locations[" + i + "]";
        if (!isObject(loc, p, error)) return;
        checkLocation(loc, p, seenLoc, castIds, clueIds, revealed, error, warn);
        if (typeof loc.type === "string") types[loc.type] = true;
      });
      var nTypes = Object.keys(types).length;
      if (nTypes < 4) warn("locations", "only " + nTypes + " interaction type(s) used; 4 or more keep the investigation varied");
      if (Array.isArray(data.clues)) {
        data.clues.forEach(function (c, i) {
          if (c && typeof c.id === "string" && !revealed[c.id]) error("clues[" + i + "]", "clue " + describe(c.id) + " is never revealed by any location; reference it from a hotspot, question, line, spot, event, mismatch, lock or lab outcome");
        });
      }
      checkReachability(data, error);
    }

    if (data.board !== undefined && isObject(data.board, "board", error)) {
      optionalString(data.board, "heading", "board", 60, error);
      optionalString(data.board, "intro", "board", 300, error);
    }
    if (data.accusation !== undefined && isObject(data.accusation, "accusation", error)) {
      optionalString(data.accusation, "prompt", "accusation", 200, error);
      optionalString(data.accusation, "intro", "accusation", 400, error);
    }
    if (requireObject(data, "epilogue", "$", error)) {
      var e = data.epilogue;
      optionalString(e, "heading", "epilogue", 60, error);
      requireString(e, "concept", "epilogue", 1, 60, error);
      requireStringArray(e, "paragraphs", "epilogue", 1, 5, 600, error);
      optionalStringArray(e, "takeaways", "epilogue", 0, 10, 200, error);
    }
  }

  function idList(arr) {
    var out = [];
    if (Array.isArray(arr)) arr.forEach(function (x) { if (x && typeof x === "object" && typeof x.id === "string") out.push(x.id); });
    return out;
  }
  function checkId(obj, path, seen, what, error) {
    if (!requireString(obj, "id", path, 1, 40, error)) return false;
    if (!KEBAB.test(obj.id)) { error(path + ".id", "must be kebab-case (lowercase letters, digits, single hyphens), got " + describe(obj.id)); return false; }
    if (seen.indexOf(obj.id) !== -1) { error(path + ".id", "duplicate " + what + " id " + describe(obj.id) + "; ids must be unique"); return false; }
    seen.push(obj.id);
    return true;
  }
  function oneOf(obj, key, path, list, error) {
    if (obj[key] === undefined) return;
    if (list.indexOf(obj[key]) === -1) error(join(path, key), "must be one of " + list.join(", ") + ", got " + describe(obj[key]));
  }
  function clueRef(v, path, clueIds, revealed, error) {
    if (typeof v !== "string" || clueIds.indexOf(v) === -1) { error(path, "clue id " + describe(v) + " is not defined in clues"); return false; }
    if (revealed) revealed[v] = true;
    return true;
  }

  function checkPerson(c, p, seen, error) {
    if (!isObject(c, p, error)) return;
    checkId(c, p, seen, "cast", error);
    requireString(c, "name", p, 1, 40, error);
    requireString(c, "role", p, 1, 60, error);
    if (CAST_KINDS.indexOf(c.kind) === -1) error(p + ".kind", "must be one of " + CAST_KINDS.join(", ") + ", got " + describe(c.kind));
    optionalString(c, "bio", p, 240, error);
    if (c.portrait !== undefined && isObject(c.portrait, p + ".portrait", error)) {
      var pp = p + ".portrait", pt = c.portrait;
      oneOf(pt, "skin", pp, SKINS, error);
      oneOf(pt, "hair", pp, HAIRS, error);
      oneOf(pt, "hairColor", pp, HAIR_COLORS, error);
      oneOf(pt, "outfit", pp, OUTFITS, error);
      oneOf(pt, "accessory", pp, ACCESSORIES, error);
      oneOf(pt, "facialHair", pp, FACIAL, error);
      oneOf(pt, "expression", pp, EXPRESSIONS, error);
      if (pt.outfitColor !== undefined && (typeof pt.outfitColor !== "string" || !HEX.test(pt.outfitColor))) error(pp + ".outfitColor", "must be a colour like \"#3366cc\", got " + describe(pt.outfitColor));
    }
  }

  function checkLocation(loc, p, seen, castIds, clueIds, revealed, error, warn) {
    checkId(loc, p, seen, "location", error);
    requireString(loc, "name", p, 1, 50, error);
    requireString(loc, "summary", p, 1, 200, error);
    optionalString(loc, "intro", p, 600, error);
    if (loc.host !== undefined && castIds.indexOf(loc.host) === -1) error(p + ".host", "cast id " + describe(loc.host) + " is not defined in cast");
    if (loc.requires !== undefined && requireArray(loc, "requires", p, 0, 5, error)) {
      loc.requires.forEach(function (r, k) { clueRef(r, p + ".requires[" + k + "]", clueIds, null, error); });
      if (loc.requires.length && loc.lockedNote === undefined) warn(p + ".lockedNote", "a location with requires should say in lockedNote what to look for first");
    }
    optionalString(loc, "lockedNote", p, 200, error);
    if (LOC_TYPES.indexOf(loc.type) === -1) { error(p + ".type", "must be one of " + LOC_TYPES.join(", ") + ", got " + describe(loc.type)); return; }
    var withClue = 0;
    function ref(v, path) { if (v === undefined) return; if (clueRef(v, path, clueIds, revealed, error)) withClue++; }

    switch (loc.type) {
      case "examine":
        if (SCENES.indexOf(loc.scene) === -1) error(p + ".scene", "must be one of " + SCENES.join(", ") + ", got " + describe(loc.scene));
        if (requireArray(loc, "hotspots", p, 2, 8, error)) {
          var hs = [];
          loc.hotspots.forEach(function (h, k) {
            var hp = p + ".hotspots[" + k + "]";
            if (!isObject(h, hp, error)) return;
            checkId(h, hp, hs, "hotspot", error);
            requireString(h, "label", hp, 1, 30, error);
            if (OBJECTS.indexOf(h.object) === -1) error(hp + ".object", "must be one of " + OBJECTS.join(", ") + ", got " + describe(h.object));
            requireNumber(h, "x", hp, 5, 95, error);
            requireNumber(h, "y", hp, 10, 90, error);
            requireString(h, "note", hp, 1, 400, error);
            ref(h.clue, hp + ".clue");
          });
          if (!withClue) error(p + ".hotspots", "no hotspot reveals a clue; give at least one a \"clue\"");
        }
        break;

      case "interview":
        if (castIds.indexOf(loc.person) === -1) error(p + ".person", "cast id " + describe(loc.person) + " is not defined in cast");
        requireString(loc, "opening", p, 1, 400, error);
        if (requireArray(loc, "questions", p, 1, 10, error)) {
          var qs = [], qIds = idList(loc.questions), unlocked = {};
          loc.questions.forEach(function (q, k) {
            var qp = p + ".questions[" + k + "]";
            if (!isObject(q, qp, error)) return;
            checkId(q, qp, qs, "question", error);
            requireString(q, "ask", qp, 1, 160, error);
            requireString(q, "answer", qp, 1, 500, error);
            ref(q.clue, qp + ".clue");
            optionalBool(q, "redHerring", qp, error);
            optionalString(q, "note", qp, 300, error);
            if (q.redHerring === true) {
              if (q.note === undefined) error(qp + ".note", "is required on a red-herring answer (explain in the debrief why it leads nowhere)");
              if (q.clue !== undefined) error(qp + ".clue", "a red-herring answer reveals no clue; mark a red-herring clue with \"redHerring\": true instead");
            }
            if (q.requires !== undefined && requireArray(q, "requires", qp, 0, 5, error)) q.requires.forEach(function (r, m) { clueRef(r, qp + ".requires[" + m + "]", clueIds, null, error); });
            if (q.unlocks !== undefined && requireArray(q, "unlocks", qp, 0, 5, error)) {
              q.unlocks.forEach(function (u, m) {
                if (typeof u !== "string" || qIds.indexOf(u) === -1) error(qp + ".unlocks[" + m + "]", "question id " + describe(u) + " is not defined in this interview's questions");
                else if (u === q.id) error(qp + ".unlocks[" + m + "]", "a question cannot unlock itself");
                else unlocked[u] = true;
              });
            }
          });
          if (!loc.questions.some(function (q) { return q && typeof q === "object" && !unlocked[q.id] && !(q.requires && q.requires.length); })) {
            error(p + ".questions", "no question is available at the start; at least one must have no requires and not be unlocked by another");
          }
        }
        break;

      case "document":
        if (DOC_TYPES.indexOf(loc.docType) === -1) error(p + ".docType", "must be one of " + DOC_TYPES.join(", ") + ", got " + describe(loc.docType));
        requireString(loc, "docTitle", p, 1, 80, error);
        optionalString(loc, "prompt", p, 200, error);
        if (loc.meta !== undefined && requireArray(loc, "meta", p, 0, 6, error)) {
          loc.meta.forEach(function (m, k) { var mp = p + ".meta[" + k + "]"; if (!isObject(m, mp, error)) return; requireString(m, "label", mp, 1, 20, error); requireString(m, "value", mp, 1, 80, error); });
        }
        if (requireArray(loc, "lines", p, 2, 16, error)) {
          loc.lines.forEach(function (l, k) {
            var lp = p + ".lines[" + k + "]";
            if (!isObject(l, lp, error)) return;
            requireString(l, "text", lp, 1, 300, error);
            optionalString(l, "note", lp, 300, error);
            ref(l.clue, lp + ".clue");
          });
          if (!withClue) error(p + ".lines", "no line reveals a clue; give at least one line a \"clue\"");
        }
        break;

      case "compare":
        optionalString(loc, "prompt", p, 200, error);
        optionalString(loc, "sameNote", p, 200, error);
        var nLabels = -1;
        if (requireStringArray(loc, "rowLabels", p, 2, 10, 40, error)) nLabels = loc.rowLabels.length;
        ["left", "right"].forEach(function (side) {
          if (!requireObject(loc, side, p, error)) return;
          var sp = p + "." + side, ex = loc[side];
          requireString(ex, "label", sp, 1, 60, error);
          optionalString(ex, "caption", sp, 200, error);
          if (requireStringArray(ex, "rows", sp, 2, 10, 80, error) && nLabels !== -1 && ex.rows.length !== nLabels) {
            error(sp + ".rows", "has " + ex.rows.length + " row(s) but rowLabels has " + nLabels + "; both exhibits need one value per row label");
          }
        });
        if (requireArray(loc, "spots", p, 1, 5, error)) {
          var rowsSeen = [];
          loc.spots.forEach(function (s, k) {
            var sp = p + ".spots[" + k + "]";
            if (!isObject(s, sp, error)) return;
            if (requireInt(s, "row", sp, 0, 99, error) && nLabels !== -1) {
              if (s.row >= nLabels) error(sp + ".row", "index " + s.row + " is out of range (" + nLabels + " rows, valid indexes are 0–" + (nLabels - 1) + ")");
              else if (rowsSeen.indexOf(s.row) !== -1) error(sp + ".row", "row " + s.row + " is listed twice in spots");
              rowsSeen.push(s.row);
            }
            requireString(s, "note", sp, 1, 300, error);
            ref(s.clue, sp + ".clue");
          });
          if (!withClue) error(p + ".spots", "no spot reveals a clue; give at least one spot a \"clue\"");
        }
        break;

      case "timeline":
        optionalString(loc, "prompt", p, 200, error);
        if (requireArray(loc, "events", p, 3, 8, error)) {
          var evs = [], texts = [];
          loc.events.forEach(function (ev, k) {
            var ep = p + ".events[" + k + "]";
            if (!isObject(ev, ep, error)) return;
            checkId(ev, ep, evs, "event", error);
            requireString(ev, "time", ep, 1, 30, error);
            requireString(ev, "text", ep, 1, 160, error);
            if (typeof ev.text === "string") { var t = ev.text.trim().toLowerCase(); if (texts.indexOf(t) !== -1) error(ep + ".text", "duplicate event text " + describe(ev.text) + "; two identical events make the order ambiguous"); texts.push(t); }
          });
        }
        if (loc.clue === undefined) error(p + ".clue", "is required on a timeline (the clue revealed when the order is rebuilt)");
        else ref(loc.clue, p + ".clue");
        requireString(loc, "solvedNote", p, 1, 400, error);
        break;

      case "ledger":
        optionalString(loc, "prompt", p, 200, error);
        optionalString(loc, "rule", p, 200, error);
        optionalString(loc, "okNote", p, 200, error);
        var nCols = -1, nRows = -1;
        if (requireStringArray(loc, "columns", p, 2, 6, 30, error)) nCols = loc.columns.length;
        if (requireArray(loc, "rows", p, 2, 12, error)) {
          nRows = loc.rows.length;
          loc.rows.forEach(function (r, k) {
            var rp = p + ".rows[" + k + "]";
            if (!Array.isArray(r)) { error(rp, "must be an array of cell strings, got " + describe(r)); return; }
            if (nCols !== -1 && r.length !== nCols) error(rp, "has " + r.length + " cell(s) but there are " + nCols + " columns");
            r.forEach(function (cell, m) { checkStr(cell, rp + "[" + m + "]", 1, 40, error); });
          });
        }
        if (requireArray(loc, "mismatches", p, 1, 3, error)) {
          var mrows = [];
          loc.mismatches.forEach(function (m, k) {
            var mp = p + ".mismatches[" + k + "]";
            if (!isObject(m, mp, error)) return;
            if (requireInt(m, "row", mp, 0, 99, error) && nRows !== -1) {
              if (m.row >= nRows) error(mp + ".row", "index " + m.row + " is out of range (" + nRows + " rows, valid indexes are 0–" + (nRows - 1) + ")");
              else if (mrows.indexOf(m.row) !== -1) error(mp + ".row", "row " + m.row + " is listed twice in mismatches");
              mrows.push(m.row);
            }
            if (m.cell !== undefined && requireInt(m, "cell", mp, 0, 99, error) && nCols !== -1 && m.cell >= nCols) {
              error(mp + ".cell", "index " + m.cell + " is out of range (" + nCols + " columns, valid indexes are 0–" + (nCols - 1) + ")");
            }
            requireString(m, "note", mp, 1, 300, error);
            ref(m.clue, mp + ".clue");
          });
          if (!withClue) error(p + ".mismatches", "no mismatch reveals a clue; give at least one mismatch a \"clue\"");
        }
        break;

      case "lock":
        requireString(loc, "prompt", p, 1, 300, error);
        var alpha = "0123456789";
        if (loc.alphabet !== undefined) {
          if (checkStr(loc.alphabet, p + ".alphabet", 2, 36, error)) {
            var dup = null;
            for (var a = 0; a < loc.alphabet.length; a++) if (loc.alphabet.indexOf(loc.alphabet[a]) !== a) dup = loc.alphabet[a];
            if (dup !== null) error(p + ".alphabet", "character " + describe(dup) + " appears more than once; each dial symbol must be unique");
            else if (/\s/.test(loc.alphabet)) error(p + ".alphabet", "must not contain spaces");
            alpha = loc.alphabet;
          }
        }
        if (requireString(loc, "answer", p, 2, 8, error)) {
          for (var c = 0; c < loc.answer.length; c++) {
            if (alpha.indexOf(loc.answer[c]) === -1) { error(p + ".answer", "symbol " + describe(loc.answer[c]) + " is not on the dials (alphabet " + describe(alpha) + ")"); break; }
          }
        }
        requireStringArray(loc, "hints", p, 1, 4, 200, error);
        requireString(loc, "openText", p, 1, 400, error);
        if (loc.clue === undefined) error(p + ".clue", "is required on a lock (the clue behind it)");
        else ref(loc.clue, p + ".clue");
        break;

      case "lab":
        requireString(loc, "prompt", p, 1, 300, error);
        if (VISUALS.indexOf(loc.visual) === -1) error(p + ".visual", "must be one of " + VISUALS.join(", ") + ", got " + describe(loc.visual));
        requireString(loc, "meterLabel", p, 1, 40, error);
        var controls = null;
        if (requireArray(loc, "controls", p, 1, 3, error)) {
          var cs = [], ok = true;
          loc.controls.forEach(function (ct, k) {
            var cp = p + ".controls[" + k + "]";
            if (!isObject(ct, cp, error)) { ok = false; return; }
            if (!checkId(ct, cp, cs, "control", error)) ok = false;
            requireString(ct, "label", cp, 1, 40, error);
            if (!requireStringArray(ct, "options", cp, 2, 4, 30, error)) ok = false;
          });
          if (ok) controls = loc.controls;
        }
        if (requireArray(loc, "outcomes", p, 1, 64, error)) {
          loc.outcomes.forEach(function (o, k) {
            var op = p + ".outcomes[" + k + "]";
            if (!isObject(o, op, error)) return;
            requireNumber(o, "level", op, 0, 100, error);
            requireString(o, "reading", op, 1, 40, error);
            requireString(o, "text", op, 1, 300, error);
            ref(o.clue, op + ".clue");
            if (o.when !== undefined && isObject(o.when, op + ".when", error) && controls) {
              Object.keys(o.when).forEach(function (key) {
                var ct = controls.filter(function (x) { return x.id === key; })[0];
                if (!ct) { error(op + ".when." + key, "control id " + describe(key) + " is not defined in this lab's controls"); return; }
                var v = o.when[key];
                if (typeof v !== "number" || v % 1 !== 0 || v < 0 || v >= ct.options.length) error(op + ".when." + key, "must be an option index 0–" + (ct.options.length - 1) + " for control " + describe(key) + ", got " + describe(v));
              });
            }
          });
          if (!withClue) error(p + ".outcomes", "no outcome reveals a clue; give at least one outcome a \"clue\"");
          if (controls) checkLabCoverage(loc, p, controls, error, warn);
        }
        break;
    }
  }

  /* every combination of control options must match an outcome (first match wins) */
  function labCombos(controls) {
    var combos = [{}];
    controls.forEach(function (ct) {
      var next = [];
      combos.forEach(function (c) { ct.options.forEach(function (_, k) { var n = {}; Object.keys(c).forEach(function (x) { n[x] = c[x]; }); n[ct.id] = k; next.push(n); }); });
      combos = next;
    });
    return combos;
  }
  function labMatch(outcomes, combo) {
    for (var i = 0; i < outcomes.length; i++) {
      var o = outcomes[i];
      if (!o || typeof o !== "object") continue;
      var w = o.when && typeof o.when === "object" ? o.when : {};
      if (Object.keys(w).every(function (k) { return combo[k] === w[k]; })) return i;
    }
    return -1;
  }
  function checkLabCoverage(loc, p, controls, error, warn) {
    var shown = {};
    labCombos(controls).forEach(function (combo) {
      var m = labMatch(loc.outcomes, combo);
      if (m === -1) {
        error(p + ".outcomes", "no outcome matches " + controls.map(function (ct) { return ct.label + " = " + ct.options[combo[ct.id]]; }).join(", ") + "; add an outcome for it or a catch-all outcome without \"when\"");
      } else shown[m] = true;
    });
    loc.outcomes.forEach(function (o, k) {
      if (!shown[k]) {
        if (o && o.clue !== undefined) error(p + ".outcomes[" + k + "]", "is never shown because an earlier outcome always matches first, so its clue can never be found");
        else warn(p + ".outcomes[" + k + "]", "is never shown because an earlier outcome always matches first");
      }
    });
  }

  /* fixpoint over locks: which clues, locations and questions can the learner ever reach? */
  function checkReachability(data, error) {
    var locs = data.locations.filter(function (l) { return l && typeof l === "object"; });
    var found = {}, open = {}, asked = {}, changed = true;
    function has(list) { return !Array.isArray(list) || list.every(function (c) { return found[c]; }); }
    function give(c) { if (typeof c === "string" && !found[c]) { found[c] = true; changed = true; } }
    while (changed) {
      changed = false;
      locs.forEach(function (loc) {
        if (!has(loc.requires)) return;
        if (!open[loc.id]) { open[loc.id] = true; changed = true; }
        switch (loc.type) {
          case "examine": arr(loc.hotspots).forEach(function (h) { give(h && h.clue); }); break;
          case "document": arr(loc.lines).forEach(function (l) { give(l && l.clue); }); break;
          case "compare": arr(loc.spots).forEach(function (s) { give(s && s.clue); }); break;
          case "ledger": arr(loc.mismatches).forEach(function (m) { give(m && m.clue); }); break;
          case "timeline": case "lock": give(loc.clue); break;
          case "lab":
            if (Array.isArray(loc.controls) && loc.controls.every(function (c) { return c && Array.isArray(c.options); })) {
              labCombos(loc.controls).forEach(function (combo) { var m = labMatch(arr(loc.outcomes), combo); if (m !== -1) give(loc.outcomes[m].clue); });
            }
            break;
          case "interview":
            var qs = arr(loc.questions).filter(function (q) { return q && typeof q === "object"; });
            var unlockedBy = {};
            qs.forEach(function (q) { arr(q.unlocks).forEach(function (u) { (unlockedBy[u] = unlockedBy[u] || []).push(q.id); }); });
            qs.forEach(function (q) {
              var key = loc.id + "/" + q.id;
              if (asked[key]) return;
              var gate = unlockedBy[q.id];
              var visible = !gate || gate.some(function (g) { return asked[loc.id + "/" + g]; });
              if (visible && has(q.requires)) { asked[key] = true; changed = true; give(q.clue); }
            });
            break;
        }
      });
    }
    data.locations.forEach(function (loc, i) {
      if (!loc || typeof loc !== "object") return;
      var p = "locations[" + i + "]";
      if (!open[loc.id]) {
        error(p + ".requires", "location " + describe(loc.id) + " can never be opened: required clue(s) " + arr(loc.requires).filter(function (c) { return !found[c]; }).map(describe).join(", ") + " can never be found first");
        return;
      }
      if (loc.type === "interview") arr(loc.questions).forEach(function (q, k) {
        if (q && typeof q === "object" && typeof q.id === "string" && !asked[loc.id + "/" + q.id]) error(p + ".questions[" + k + "]", "question " + describe(q.id) + " can never be asked (nothing reachable unlocks it, or a clue it requires can never be found)");
      });
    });
    arr(data.clues).forEach(function (c, i) {
      if (c && typeof c.id === "string" && !found[c.id] && isRevealedSomewhere(data, c.id)) {
        error("clues[" + i + "]", "clue " + describe(c.id) + " can never be found: every place that reveals it is locked behind a clue that cannot be found first");
      }
    });
  }
  function isRevealedSomewhere(data, id) {
    return data.locations.some(function (loc) {
      if (!loc || typeof loc !== "object") return false;
      if (loc.clue === id) return true;
      return [loc.hotspots, loc.lines, loc.spots, loc.mismatches, loc.questions, loc.outcomes].some(function (list) {
        return arr(list).some(function (x) { return x && x.clue === id; });
      });
    });
  }
  function arr(v) { return Array.isArray(v) ? v : []; }

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
    if (v.trim().length < min) { error(path, min > 1 ? "must be at least " + min + " characters" : "must be a non-empty string"); return false; }
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
  function requireNumber(obj, key, parent, min, max, error) {
    var v = obj[key], path = join(parent, key);
    if (typeof v !== "number" || !isFinite(v)) { error(path, "must be a number, got " + describe(v)); return false; }
    if (v < min || v > max) { error(path, "must be between " + min + " and " + max + ", got " + v); return false; }
    return true;
  }
  function requireInt(obj, key, parent, min, max, error) {
    if (!requireNumber(obj, key, parent, min, max, error)) return false;
    if (obj[key] % 1 !== 0) { error(join(parent, key), "must be a whole number, got " + obj[key]); return false; }
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
