/* NthView — story validator — schemaVersion 1
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
  var HEX = /^#[0-9a-fA-F]{6}$/;
  var URL_OK = /^https?:\/\/[^\s]+$/;
  var LANG_RE = /^[A-Za-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;
  var PRESETS = ["courier", "guard", "clerk", "crook", "scientist", "doctor", "worker", "robot", "chief", "messenger",
    "teacher", "student", "citizen", "knight", "royal", "blob", "spiky"];
  var SETS = ["street", "shop", "office", "lab", "tower", "server-room", "classroom", "gate", "home", "bank", "park",
    "factory", "organic", "stage"];
  var WORLDS = ["day", "dusk", "night", "studio"];
  var PACES = ["chapter", "flow", "beat"];
  var SHOTS = ["auto", "establishing", "wide", "medium", "two-shot", "close-up", "over-shoulder", "aerial", "crane-up", "follow", "low"];
  var MOODS = ["neutral", "happy", "sad", "worried", "smug", "suspicious", "surprised", "angry", "thinking", "scared"];
  var MARKS = ["left", "center", "right", "back-left", "back-right", "door", "post"];
  var TONES = ["good", "bad", "info"];
  /* what each prop kind takes (schema.md "Kinds, and what they take") */
  var VALUE_NUM = ["gauge"];
  var VALUE_STR = ["counter", "clock", "phone", "laptop", "coin", "ticket", "server", "number"];
  var TEXT_KINDS = { card: 240, formula: 120, sign: 40, document: 160 };
  var NEEDS = { number: "value", card: "text", formula: "text", sign: "text" };
  var WINDOWS = ["card", "code", "formula", "number"];
  var OPENS = ["letter", "parcel", "box", "gift", "lock", "cabinet", "book", "bulb", "laptop"];
  var KINDS = ["letter", "parcel", "box", "gift", "lock", "key", "stamp", "gauge", "counter", "cabinet", "coin", "document",
    "shield", "magnifier", "clock", "server", "flag", "phone", "laptop", "sign", "orb", "ticket", "book", "bulb", "hook",
    "card", "code", "formula", "number"];
  /* per act: required fields and what `to` may name (a = actor, p = prop, l = place, m = mark) */
  var ACTS = {
    walk: { need: ["who", "to"], to: "aplm" },
    give: { need: ["who", "prop", "to"], to: "a" },
    take: { need: ["who", "prop"], to: "" },
    drop: { need: ["who", "prop"], to: "pm" },
    show: { need: [], to: "am" },
    hide: { need: [], to: "" },
    react: { need: ["who", "mood"], to: "" },
    point: { need: ["who", "to"], to: "ap" },
    turn: { need: ["who", "to"], to: "ap" },
    stamp: { need: ["who", "prop", "text"], to: "" },
    open: { need: ["prop"], to: "" },
    close: { need: ["prop"], to: "" },
    set: { need: ["prop"], to: "" },
    reject: { need: ["who", "to"], to: "a" },
    celebrate: { need: ["who"], to: "" },
    crowd: { need: ["who", "count"], to: "" },
    link: { need: ["from", "to"], to: "ap" },
    unlink: { need: ["from", "to"], to: "ap" }
  };
  var ACTION_KEYS = ["act", "who", "prop", "to", "from", "mood", "value", "text", "tone", "count", "label"];

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
    optionalString(data, "summary", "$", 400, error);
    optionalString(data, "audience", "$", 80, error);
    optionalString(data, "next", "$", 120, error);
    if (data.lang !== undefined && optionalString(data, "lang", "$", 20, error) && !LANG_RE.test(data.lang)) {
      error("lang", "must be a BCP 47 language tag such as \"en\" or \"en-GB\", got " + describe(data.lang));
    }
    optionalEnum(data, "world", "$", WORLDS, error);
    optionalEnum(data, "pace", "$", PACES, error);

    var actors = {}, props = {}, places = {}, chapterIds = {};
    var names = {};   /* actor + prop namespace */

    /* places */
    if (data.places !== undefined && requireArray(data, "places", "$", 1, 6, error)) {
      data.places.forEach(function (p, i) {
        var path = "places[" + i + "]";
        if (!isObject(p, path, error)) return;
        if (requireId(p, path, error)) {
          if (places[p.id]) error(path + ".id", "place id \"" + p.id + "\" is used twice");
          else places[p.id] = p;
        }
        requireEnum(p, "set", path, SETS, error);
        requireString(p, "name", path, 1, 40, error);
      });
    }
    var defaultPlace = data.places && data.places.length && data.places[0] && data.places[0].id;

    /* cast */
    if (requireArray(data, "cast", "$", 1, 10, error)) {
      if (data.cast.length > 7) warn("cast", "has " + data.cast.length + " actors; more than 7 are hard to keep apart");
      data.cast.forEach(function (a, i) {
        var path = "cast[" + i + "]";
        if (!isObject(a, path, error)) return;
        if (requireId(a, path, error)) {
          if (names[a.id]) error(path + ".id", "id \"" + a.id + "\" is already used by an actor or prop");
          else { names[a.id] = "actor"; actors[a.id] = a; }
        }
        requireString(a, "name", path, 1, 24, error);
        requireString(a, "role", path, 1, 40, error);
        requireEnum(a, "preset", path, PRESETS, error);
        optionalString(a, "stands", path, 160, error);
        if (a.stands === undefined) warn(path + ".stands", "is missing, so the \"Who's who\" card cannot say what this actor stands for");
        optionalColor(a, "color", path, error);
        if (a.post !== undefined && optionalString(a, "post", path, 40, error) && !places[a.post]) {
          error(path + ".post", "place id \"" + a.post + "\" is not defined in places");
        }
      });
    }

    /* props */
    if (data.props !== undefined && requireArray(data, "props", "$", 0, 30, error)) {
      data.props.forEach(function (p, i) {
        var path = "props[" + i + "]";
        if (!isObject(p, path, error)) return;
        if (requireId(p, path, error)) {
          if (names[p.id]) error(path + ".id", "id \"" + p.id + "\" is already used by an actor or prop");
          else { names[p.id] = "prop"; props[p.id] = p; }
        }
        var kindOk = requireEnum(p, "kind", path, KINDS, error);
        requireString(p, "label", path, 1, 30, error);
        optionalString(p, "means", path, 160, error);
        if (p.means === undefined) warn(path + ".means", "is missing, so the \"Who's who\" card cannot say what this prop stands for");
        optionalColor(p, "color", path, error);
        optionalString(p, "title", path, 40, error);
        optionalString(p, "lang", path, 20, error);
        if (!kindOk) return;
        checkKindFields(p, path, p.kind, error, warn, true);
        if (p.kind === "code") {
          if (requireString(p, "code", path, 1, 600, error)) {
            var lines = p.code.split("\n");
            if (lines.length > 12) error(path + ".code", "must have at most 12 lines, got " + lines.length);
            lines.forEach(function (ln, k) {
              if (ln.length > 48) warn(path + ".code", "line " + (k + 1) + " has " + ln.length + " characters; more than 48 are hard to read on a phone");
            });
            if (p.highlight !== undefined) {
              if (!Array.isArray(p.highlight)) error(path + ".highlight", "must be an array of line numbers, got " + describe(p.highlight));
              else p.highlight.forEach(function (n, k) {
                if (!isInt(n) || n < 1 || n > lines.length) {
                  error(path + ".highlight[" + k + "]", "line " + describe(n) + " is out of range (the code has " + lines.length + " line(s), valid numbers are 1–" + lines.length + ")");
                }
              });
            }
          }
        } else {
          if (p.code !== undefined) error(path + ".code", "is only allowed on a prop of kind \"code\", this one is \"" + p.kind + "\"");
          if (p.highlight !== undefined) error(path + ".highlight", "is only allowed on a prop of kind \"code\", this one is \"" + p.kind + "\"");
        }
      });
      /* heldBy after all actors are known */
      data.props.forEach(function (p, i) {
        if (!p || typeof p !== "object" || p.heldBy === undefined) return;
        if (typeof p.heldBy !== "string" || !actors[p.heldBy]) {
          error("props[" + i + "].heldBy", "actor id " + describe(p.heldBy) + " is not defined in cast");
        }
      });
    }

    /* chapters, beats, actions; a light presence simulation feeds the warnings */
    var appears = {};   /* id -> true once it is on stage */
    Object.keys(props).forEach(function (id) { if (props[id].heldBy) appears[id] = true; });
    var where = {};      /* actor id -> place id */
    var seconds = 0;
    var place = defaultPlace || "stage";
    function kindOf(id) { return names[id] || (places[id] ? "place" : (MARKS.indexOf(id) !== -1 ? "mark" : null)); }

    if (requireArray(data, "chapters", "$", 1, 12, error)) {
      data.chapters.forEach(function (c, ci) {
        var cpath = "chapters[" + ci + "]";
        if (!isObject(c, cpath, error)) return;
        if (requireId(c, cpath, error)) {
          if (chapterIds[c.id]) error(cpath + ".id", "chapter id \"" + c.id + "\" is used twice");
          else chapterIds[c.id] = true;
        }
        requireString(c, "title", cpath, 1, 60, error);
        if (c.takeaway === undefined) warn(cpath + ".takeaway", "is missing; a chapter that ends on a takeaway is easier to remember");
        else if (isObject(c.takeaway, cpath + ".takeaway", error)) {
          var tk = c.takeaway, tpath = cpath + ".takeaway";
          optionalString(tk, "think", tpath, 200, error);
          if (tk.seconds !== undefined && (!isInt(tk.seconds) || tk.seconds < 3 || tk.seconds > 30)) {
            error(tpath + ".seconds", "must be an integer from 3 to 30, got " + describe(tk.seconds));
          }
          if (requireArray(tk, "points", tpath, 1, 4, error)) {
            tk.points.forEach(function (pt, k) { stringItem(pt, tpath + ".points[" + k + "]", 1, 140, error); });
            seconds += (tk.think ? (tk.seconds || 8) : 0) + 2 + tk.points.join(" ").split(/\s+/).length * .3;
          }
        }
        if (!requireArray(c, "beats", cpath, 1, 12, error)) return;
        if (c.beats.length > 8) warn(cpath + ".beats", "has " + c.beats.length + " beats; more than 8 makes a long chapter, consider splitting it");
        c.beats.forEach(function (b, bi) {
          var path = cpath + ".beats[" + bi + "]";
          if (!isObject(b, path, error)) return;
          if (requireString(b, "caption", path, 1, 160, error) && words(b.caption) > 22) {
            warn(path + ".caption", "has " + words(b.caption) + " words; keep it under 22 so it can be read while watching");
          }
          if (optionalString(b, "say", path, 400, error) && b.say !== undefined && words(b.say) > 70) {
            warn(path + ".say", "has " + words(b.say) + " words; keep narration under 70 per beat");
          }
          if (b.at !== undefined && optionalString(b, "at", path, 40, error)) {
            if (!places[b.at]) error(path + ".at", "place id \"" + b.at + "\" is not defined in places");
            else place = b.at;
          }
          if (b.shot !== undefined) optionalEnum(b, "shot", path, SHOTS, error);
          if (b.cut !== undefined && typeof b.cut !== "boolean") error(path + ".cut", "must be true or false, got " + describe(b.cut));
          if (b.hold !== undefined && (typeof b.hold !== "number" || !isFinite(b.hold) || b.hold < 0 || b.hold > 20)) {
            error(path + ".hold", "must be a number of seconds from 0 to 20, got " + describe(b.hold));
          }
          /* with */
          if (b.with !== undefined && requireArray(b, "with", path, 0, 12, error)) {
            var seen = {}, nA = 0, nP = 0, nW = 0;
            b.with.forEach(function (id, k) {
              var wp = path + ".with[" + k + "]";
              if (typeof id !== "string" || !names[id]) { error(wp, describe(id) + " is not an actor or prop id"); return; }
              if (seen[id]) { error(wp, "\"" + id + "\" is listed twice"); return; }
              seen[id] = true; appears[id] = true;
              if (names[id] === "actor") nA++;
              else if (WINDOWS.indexOf(props[id].kind) !== -1) nW++;
              else if (!props[id].heldBy) nP++;
            });
            if (nA > 6) error(path + ".with", "has " + nA + " actors; a place holds at most 6");
            if (nP > 4) error(path + ".with", "has " + nP + " standing props; a place holds at most 4 (props held by an actor do not count)");
            if (nW > 2) error(path + ".with", "has " + nW + " windows (card, code, formula, number); at most 2 fit on screen");
            Object.keys(where).forEach(function (a) { if (where[a] === place && !seen[a]) delete where[a]; });
            Object.keys(seen).forEach(function (id) { if (names[id] === "actor") where[id] = place; });
          }
          /* focus */
          if (b.focus !== undefined) {
            var fl = typeof b.focus === "string" ? [b.focus] : b.focus;
            if (!Array.isArray(fl) || fl.length < 1 || fl.length > 3) error(path + ".focus", "must be an id or an array of 1–3 ids, got " + describe(b.focus));
            else fl.forEach(function (id, k) {
              if (typeof id !== "string" || !names[id]) error(path + ".focus" + (typeof b.focus === "string" ? "" : "[" + k + "]"), describe(id) + " is not an actor or prop id");
            });
          }
          /* lines */
          var lineWords = 0;
          if (b.lines !== undefined && requireArray(b, "lines", path, 0, 3, error)) {
            b.lines.forEach(function (ln, k) {
              var lp = path + ".lines[" + k + "]";
              if (!isObject(ln, lp, error)) return;
              if (typeof ln.who !== "string" || !actors[ln.who]) error(lp + ".who", "actor id " + describe(ln.who) + " is not defined in cast");
              else present(ln.who, lp + ".who");
              if (requireString(ln, "text", lp, 1, 120, error)) lineWords += words(ln.text);
              if (ln.mood !== undefined) optionalEnum(ln, "mood", lp, MOODS, error);
            });
          }
          /* actions */
          var nAct = 0;
          if (b.do !== undefined && requireArray(b, "do", path, 0, 6, error)) {
            b.do.forEach(function (a, k) {
              var ap = path + ".do[" + k + "]";
              if (!isObject(a, ap, error)) return;
              nAct++;
              checkAction(a, ap);
            });
          }
          seconds += Math.max(3.2, 1.5 + .33 * words(b.caption || "") + (b.lines ? b.lines.length * .8 : 0) + .3 * lineWords + nAct * .9) + (typeof b.hold === "number" ? b.hold : 0);
        });
      });
    }

    function present(id, p2) {
      if (actors[id] && where[id] !== place) warn(p2, "\"" + id + "\" is not at " + place + " in this beat; the player brings them in");
      if (actors[id]) { where[id] = place; appears[id] = true; }
    }
    function checkAction(a, ap) {
      if (!requireEnum(a, "act", ap, Object.keys(ACTS), error)) return;
      var spec = ACTS[a.act];
      Object.keys(a).forEach(function (k) {
        if (ACTION_KEYS.indexOf(k) === -1) error(ap + "." + k, "is not an action field (allowed: " + ACTION_KEYS.join(", ") + ")");
      });
      spec.need.forEach(function (f) {
        if (a[f] === undefined) error(ap + "." + f, "is required for act \"" + a.act + "\"");
      });
      if (a.who !== undefined) {
        if (typeof a.who !== "string" || !actors[a.who]) error(ap + ".who", "actor id " + describe(a.who) + " is not defined in cast");
        else if (a.act !== "show") present(a.who, ap + ".who");
      }
      if (a.prop !== undefined && (typeof a.prop !== "string" || !props[a.prop])) error(ap + ".prop", "prop id " + describe(a.prop) + " is not defined in props");
      if (a.from !== undefined) {
        if (a.act !== "link" && a.act !== "unlink") error(ap + ".from", "is only used by link and unlink");
        else if (typeof a.from !== "string" || !names[a.from]) error(ap + ".from", describe(a.from) + " is not an actor or prop id");
      }
      if (a.act === "show" || a.act === "hide") {
        if ((a.who === undefined) === (a.prop === undefined)) error(ap, "act \"" + a.act + "\" needs exactly one of who and prop");
      }
      if (a.to !== undefined) {
        var k = typeof a.to === "string" ? kindOf(a.to) : null;
        var letter = { actor: "a", prop: "p", place: "l", mark: "m" }[k];
        var allowed = spec.to;
        if (a.act === "show" && a.who !== undefined) allowed = "m";
        if (!allowed) error(ap + ".to", "is not used by act \"" + a.act + "\"");
        else if (!letter || allowed.indexOf(letter) === -1) {
          var what = allowed.split("").map(function (c) { return { a: "an actor", p: "a prop", l: "a place", m: "a mark" }[c]; }).join(" or ");
          error(ap + ".to", describe(a.to) + " must name " + what);
        } else if ((a.act === "give" || a.act === "reject") && a.to === a.who) {
          error(ap + ".to", "must be someone other than who (\"" + a.who + "\")");
        }
        if (letter === "a" && actors[a.to] && a.act !== "link" && a.act !== "unlink") present(a.to, ap + ".to");
        if (a.act === "walk" && letter === "l") where[a.who] = a.to;
      }
      if (a.mood !== undefined) optionalEnum(a, "mood", ap, MOODS, error);
      if (a.tone !== undefined) optionalEnum(a, "tone", ap, TONES, error);
      optionalString(a, "label", ap, 30, error);
      if (a.count !== undefined && (!isInt(a.count) || a.count < 0 || a.count > 8)) error(ap + ".count", "must be an integer from 0 to 8, got " + describe(a.count));
      var prop = typeof a.prop === "string" ? props[a.prop] : null;
      if (a.act === "stamp" && a.text !== undefined) requireString(a, "text", ap, 1, 14, error);
      if (a.act === "set" && prop) {
        if (a.value === undefined && a.text === undefined) error(ap, "act \"set\" needs value or text");
        else checkKindFields(a, ap, prop.kind, error, warn, false);
      }
      if ((a.act === "open" || a.act === "close") && prop && OPENS.indexOf(prop.kind) === -1) {
        warn(ap + ".prop", "a " + prop.kind + " has no open state; nothing will change");
      }
      if (a.act === "show") { if (a.prop) appears[a.prop] = true; if (a.who && actors[a.who]) { appears[a.who] = true; where[a.who] = place; } }
      if (a.act === "hide" && a.who && where[a.who] === place) delete where[a.who];
      if ((a.act === "give" || a.act === "take") && a.prop) appears[a.prop] = true;
    }

    Object.keys(names).forEach(function (id) {
      if (!appears[id]) warn(names[id] === "actor" ? "cast" : "props", "\"" + id + "\" never appears in any beat");
    });

    if (data.recap === undefined) warn("recap", "is missing; the end card is where the whole story comes together");
    else if (isObject(data.recap, "recap", error)) {
      optionalString(data.recap, "title", "recap", 60, error);
      if (requireArray(data.recap, "points", "recap", 1, 6, error)) {
        data.recap.points.forEach(function (pt, k) { stringItem(pt, "recap.points[" + k + "]", 1, 160, error); });
      }
    }
    if (data.sources !== undefined && requireArray(data, "sources", "$", 0, 12, error)) {
      data.sources.forEach(function (s, i) {
        var path = "sources[" + i + "]";
        if (!isObject(s, path, error)) return;
        requireString(s, "title", path, 1, 140, error);
        if (s.url !== undefined && optionalString(s, "url", path, 300, error) && !URL_OK.test(s.url)) {
          error(path + ".url", "must start with http:// or https://, got " + describe(s.url));
        }
        optionalString(s, "note", path, 160, error);
      });
    }
    if (seconds > 480) warn("chapters", "the story runs about " + Math.round(seconds / 60) + " minutes; more than 8 is long for one sitting, consider splitting it into parts");
  }

  /* value / text against the kind table; onProp: required fields apply */
  function checkKindFields(o, path, kind, error, warn, onProp) {
    if (o.value !== undefined) {
      if (VALUE_NUM.indexOf(kind) !== -1) {
        if (typeof o.value !== "number" || !isFinite(o.value) || o.value < 0 || o.value > 1) error(path + ".value", "a " + kind + " takes a number from 0 to 1, got " + describe(o.value));
      } else if (VALUE_STR.indexOf(kind) !== -1) {
        var max = kind === "number" ? 16 : 24;
        if (typeof o.value !== "string" || !o.value.trim()) error(path + ".value", "a " + kind + " takes a non-empty string, got " + describe(o.value));
        else if (o.value.length > max) error(path + ".value", "must be at most " + max + " characters, got " + o.value.length);
      } else error(path + ".value", "a " + kind + " takes no value");
    }
    if (o.text !== undefined) {
      if (TEXT_KINDS[kind]) {
        if (typeof o.text !== "string") error(path + ".text", "must be a string, got " + describe(o.text));
        else if (!o.text.trim() && kind !== "document") error(path + ".text", "must be a non-empty string");
        else if (o.text.length > TEXT_KINDS[kind]) error(path + ".text", "must be at most " + TEXT_KINDS[kind] + " characters, got " + o.text.length);
      } else if (onProp) warn(path + ".text", "a " + kind + " does not show text; it is ignored");
      else error(path + ".text", "a " + kind + " takes no text");
    }
    if (onProp && NEEDS[kind] && o[NEEDS[kind]] === undefined) error(path + "." + NEEDS[kind], "is required for a prop of kind \"" + kind + "\"");
  }

  function words(s) { return typeof s === "string" && s.trim() ? s.trim().split(/\s+/).length : 0; }
  function isInt(v) { return typeof v === "number" && isFinite(v) && Math.floor(v) === v; }
  function isObject(v, path, error) {
    if (v === null || typeof v !== "object" || Array.isArray(v)) { error(path, "expected an object, got " + describe(v)); return false; }
    return true;
  }
  function requireId(obj, parent, error) {
    if (!requireString(obj, "id", parent, 1, 40, error)) return false;
    if (!KEBAB.test(obj.id)) { error(join(parent, "id"), "must be lowercase kebab-case (letters, digits, single hyphens), got " + describe(obj.id)); return false; }
    if (MARKS.indexOf(obj.id) !== -1 && parent.indexOf("chapters") !== 0) { error(join(parent, "id"), "\"" + obj.id + "\" is a mark name (" + MARKS.join(", ") + "); pick another id"); return false; }
    return true;
  }
  function optionalString(obj, key, parent, max, error) {
    if (obj[key] === undefined) return true;
    return requireString(obj, key, parent, 1, max, error);
  }
  function stringItem(v, path, min, max, error) {
    if (typeof v !== "string") { error(path, "must be a string, got " + describe(v)); return false; }
    if (v.trim().length < min) { error(path, "must be a non-empty string"); return false; }
    if (v.length > max) { error(path, "must be at most " + max + " characters, got " + v.length); return false; }
    return true;
  }
  function requireEnum(obj, key, parent, list, error) {
    var v = obj[key];
    if (list.indexOf(v) === -1) { error(join(parent, key), "must be one of " + list.join(", ") + "; got " + describe(v)); return false; }
    return true;
  }
  function optionalEnum(obj, key, parent, list, error) {
    if (obj[key] === undefined) return true;
    return requireEnum(obj, key, parent, list, error);
  }
  function optionalColor(obj, key, parent, error) {
    if (obj[key] === undefined) return true;
    if (typeof obj[key] !== "string" || !HEX.test(obj[key])) { error(join(parent, key), "must be a colour like \"#2563eb\", got " + describe(obj[key])); return false; }
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
