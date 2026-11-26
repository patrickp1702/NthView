/* NthView — game engine islands — schemaVersion 1
 * A walk across an archipelago: each level is an island with its lesson
 * and, for the in-world types, a task played on the island itself.
 * Registered on NthView.engines; needs assets/view.js (AGENTS.md §5.6).
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  NthView.engines = NthView.engines || {};

  var CSS = [
    ".nthview.nthview-game.nthview-eng-islands{",
    "  --sky:#bfe0f2;--sky-top:#5aa5dc;--sea:#2b88aa;--sand:#e2c68e;--stone:#a8936a;--panel:rgba(255,255,255,.95);--panel-solid:#fff;--ink:#17203d;--muted:#4a557a;--line:#c9d3e3;",
    "  --chip:#eef3f8;--ok:#1f8a5b;--no:#b23a48;--coin:#e0a91b;--star:#b87800;--gold:#ffd76a;--cta:#5aa2e6;",
    "  --display:\"Bricolage Grotesque\",\"Avenir Next\",\"Segoe UI\",system-ui,sans-serif;--body:\"Atkinson Hyperlegible\",\"Segoe UI\",system-ui,sans-serif;",
    "  background:var(--sky);color:var(--ink);font-family:var(--body);-webkit-tap-highlight-color:transparent}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-game.nthview-eng-islands{--sky:#141b34;--sky-top:#080d20;--sea:#0f3b47;--sand:#b9a072;--stone:#8d7a55;--panel:rgba(22,30,58,.95);--panel-solid:#161e3a;--ink:#eef1fa;--muted:#a9b2cf;--line:#33406b;--chip:#222c52;--ok:#5ed6a3;--no:#ff8a98;--coin:#f4c55b;--star:#ffd76a;--cta:#60a5fa}}",
    ".nthview.nthview-game.nthview-eng-islands.nthview-theme-aurora{--sky:#2a2f6e;--sky-top:#141846;--cta:#8b8cf5;--sea:#17395c;--sand:#d8d3ea;--stone:#746f9c;--panel:rgba(245,244,255,.95);--panel-solid:#f6f5ff;--ink:#1a1a3f;--muted:#4f4f7e;--line:#cfccee;--chip:#ebe9fb}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-game.nthview-eng-islands.nthview-theme-aurora{--sky:#070b24;--sky-top:#02041a;--cta:#a5b4fc;--sea:#061a2e;--sand:#9b95bd;--stone:#4b4772;--panel:rgba(14,16,42,.95);--panel-solid:#0e102a;--ink:#eeedff;--muted:#aaa8d8;--line:#2f3166;--chip:#1b1e4a;--ok:#6ee7b7;--no:#fb7185;--coin:#fcd34d;--star:#fde68a}}",
    ".nthview.nthview-game.nthview-eng-islands.nthview-theme-canyon{--sky:#f6dcc0;--sky-top:#7fb2d8;--cta:#e0954f;--sea:#23867b;--sand:#d39a5e;--stone:#8a4a2a;--panel:rgba(255,250,243,.95);--panel-solid:#fffaf3;--ink:#3b2314;--muted:#7a5236;--line:#ead6c2;--chip:#f7eadb;--ok:#2d8a4e;--no:#b8322f}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-game.nthview-eng-islands.nthview-theme-canyon{--sky:#2b1522;--sky-top:#12070f;--cta:#f6b36a;--sea:#0e4a46;--sand:#a85f33;--stone:#5a2d18;--panel:rgba(40,22,18,.95);--panel-solid:#28160f;--ink:#fbeee2;--muted:#d6b39a;--line:#5a3a2a;--chip:#3a241a;--ok:#6ed19a;--no:#ff8f82;--coin:#f6c45a;--star:#ffd36a}}",
    ".nthview.nthview-game.nthview-eng-islands.nthview-theme-snow{--sky:#dde8f2;--sky-top:#8db4d8;--cta:#6aa6e8;--sea:#36607e;--sand:#e8eef5;--stone:#8ea0b4;--panel:rgba(255,255,255,.95);--panel-solid:#fff;--ink:#162433;--muted:#4e6378;--line:#cfdbe7;--chip:#eef3f8;--ok:#1f7a8c;--no:#b3405a}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-game.nthview-eng-islands.nthview-theme-snow{--sky:#0d1726;--sky-top:#050b15;--cta:#93c5fd;--sea:#102a3f;--sand:#c9d4e0;--stone:#56687d;--panel:rgba(16,26,42,.95);--panel-solid:#101a2a;--ink:#eef4fb;--muted:#a5b6c8;--line:#2c3f56;--chip:#1a2a3e;--ok:#67d4e4;--no:#ff8aa0;--coin:#f4c55b;--star:#ffd76a}}",
    ".nthview .nthview-mini{display:block;margin-top:8px;width:112px;height:112px;border-radius:50%;border:2px solid var(--line);background:color-mix(in srgb,var(--panel-solid) 70%,transparent);pointer-events:none}",
    ".nthview .nthview-garrow{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--chip);color:var(--accent,var(--ink));flex:none}",
    ".nthview .nthview-garrow svg{display:block}",
    ".nthview .nthview-joy{position:absolute;left:18px;bottom:18px;width:124px;height:124px;border-radius:50%;border:2px solid var(--line);background:color-mix(in srgb,var(--panel-solid) 55%,transparent);z-index:6;touch-action:none;display:none}",
    ".nthview .nthview-knob{position:absolute;left:50%;top:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:var(--ink);opacity:.55}",
    "@media (hover:none) and (pointer:coarse){.nthview .nthview-joy{display:block}}",
    ".nthview .nthview-cact button{border-radius:12px;padding:8px 14px;min-height:40px;font-weight:700;background:var(--gold);color:#1b1304;border:0}",
    ".nthview-game.nthview-eng-islands{--hud-bg:rgba(16,22,46,.62)}",
    ".nthview-eng-islands .nthview-mini{width:84px;height:84px;margin-top:4px}",
    ".nthview-eng-islands .nthview-callout{padding-left:62px;min-height:64px;border-color:var(--accent,rgba(255,255,255,.18))}",
    ".nthview-eng-islands .nthview-garrow{position:absolute;left:10px;top:10px;width:42px;height:42px;color:var(--accent,#fff);background:rgba(255,255,255,.1)}",
    ".nthview-eng-islands .nthview-cact button.nthview-alt{background:rgba(255,255,255,.14);color:var(--hud-ink)}",
    "@media (hover:none) and (pointer:coarse){.nthview-eng-islands .nthview-callout{left:150px}}",
    ".nthview-eng-islands .nthview-joy{z-index:5}"
  ].join("\n");

  var PALETTES = {
    lagoon: { light: ["#3d8fd6", "#a77fd1", "#c99312", "#1fa874", "#e0679e", "#9aa3b8", "#7ea31c", "#d9534f", "#2aa198"],
      dark: ["#6eb6f2", "#b48ad8", "#f4c55b", "#5ed6a3", "#f28db8", "#e8e6da", "#c6e46a", "#ff8a98", "#6fd3c7"] },
    aurora: { light: ["#22d3ee", "#a78bfa", "#f472b6", "#a3e635", "#fbbf24", "#60a5fa", "#2dd4bf", "#fb7185", "#e879f9"],
      dark: ["#67e8f9", "#c4b5fd", "#f9a8d4", "#bef264", "#fde047", "#93c5fd", "#5eead4", "#fda4af", "#f0abfc"] },
    canyon: { light: ["#d97706", "#c2410c", "#0e7490", "#65a30d", "#b91c1c", "#7c3aed", "#ca8a04", "#0f766e", "#be185d"],
      dark: ["#fbbf24", "#fb923c", "#22d3ee", "#a3e635", "#f87171", "#c4b5fd", "#fde047", "#5eead4", "#f472b6"] },
    snow: { light: ["#2563eb", "#7c3aed", "#db2777", "#059669", "#d97706", "#0891b2", "#4f46e5", "#e11d48", "#0d9488"],
      dark: ["#93c5fd", "#c4b5fd", "#f9a8d4", "#6ee7b7", "#fcd34d", "#67e8f9", "#a5b4fc", "#fda4af", "#5eead4"] }
  };
  /* 3D lighting and sky extras per world theme: [day, night] intensities. By day a sunlit top face gets about
     1.0-1.1x its colour (hemisphere + sun), so sand, snow and sea keep their colour instead of washing out to white;
     emissive glow is scaled down by day (emi) so accents read as paint, not neon */
  var THEME3D = {
    lagoon: { hemi: [0xffffff, 0x445566], sun: 0xffffff, sunI: [.52, .55], hemiI: [.62, .7], emi: [.55, 1], stars: "dark", extra: "clouds" },
    aurora: { hemi: [0x9fb0ff, 0x1a1a3a], sun: 0xb9c6ff, sunI: [.5, .55], hemiI: [.62, .7], emi: [.7, 1], stars: "always", extra: "aurora" },
    canyon: { hemi: [0xffe3c4, 0x6b3a1e], sun: 0xffd6a3, sunI: [.55, .5], hemiI: [.6, .65], emi: [.55, 1], stars: "dark", extra: "mesas" },
    snow: { hemi: [0xffffff, 0x90a4b8], sun: 0xeef5ff, sunI: [.45, .5], hemiI: [.64, .75], emi: [.55, 1], stars: "dark", extra: "snow" }
  };
  var R_HUB = 16, R_ISLE = 11, RING_R0 = 50, RING_STEP = 36, RING_CAP = 7, NEIGHBOUR_GAP = 40;
  function layoutRings(N) {
    var rings = [], left = N, k = 1, slots = [];
    while (left > 0) {
      var m = Math.min(RING_CAP * k, left), r = RING_R0 + RING_STEP * (k - 1);
      rings.push({ r: r, m: m, first: N - left });
      for (var j = 0; j < m; j++) {
        var a = Math.PI + j * 2 * Math.PI / m;
        slots.push({ ring: k - 1, r: r, m: m, slot: j, angle: a, x: Math.sin(a) * r, z: Math.cos(a) * r });
      }
      left -= m; k++;
    }
    return { rings: rings, slots: slots, outer: rings[rings.length - 1].r + R_ISLE };
  }
  function angDiff(a, b) { var d = a - b; return Math.abs(Math.atan2(Math.sin(d), Math.cos(d))); }
  var SCENERY = ["grove", "tower", "arena", "workshop", "canyon", "hall", "clock", "plain"];
  /* the in-world types this world plays, and the Island Quest props that play them */
  var WORLD_TYPES = ["lanes", "gates", "torches", "levers", "tiles", "collect"];
  var PROPMAP = { lanes: "pads", gates: "fork", torches: "beacons", levers: "steps", tiles: "gather", collect: "collect" };
  var TYPE_HELP = {
    lanes: "Stand on the pad with the right answer, then choose it.",
    gates: "Walk through the gate with the right answer.",
    torches: "Walk up to each beacon to light it or put it out, then check.",
    levers: "Step on the pads in the right order.",
    tiles: "Carry each orb to the bin of its group.",
    collect: "Walk into every orb to collect it."
  };
  var SOUNDS = {
    coin: function (tone) { tone(988, 0, .1, "triangle"); tone(1319, .07, .16, "triangle"); },
    step: function (tone) { tone(330, 0, .05, "triangle", .02); },
    thunder: function (tone) { tone(55, 0, 1.4, "sawtooth", .05); tone(42, .25, 1.6, "sawtooth", .04); }
  };
  function spreadX(i, n, gap) { return (i - (n - 1) / 2) * gap; }

  NthView.engines.islands = function (core) {
    var THREE = core.THREE, doc = core.doc, data = core.data, N = core.N, STRICT = core.STRICT, S = core.S, settings = core.settings;
    var container = core.container, canvas = core.canvas, col = core.col;
    var el = core.el, p = core.p, btn = core.btn, primaryBtn = core.primaryBtn, keyHint = core.keyHint, box = core.box, shuffledIdx = core.shuffledIdx, starsText = core.starsText;
    var toast = function (m) { core.toast(m, 3400); }, say = core.say, sfx = core.sfx, fade = core.fade, persist = core.persist;
    var W0 = core.WD, themeName = W0.theme || "lagoon", hero = core.hero;
    var T3 = THEME3D[themeName], PAL = PALETTES[themeName];
    container.classList.add("nthview-theme-" + themeName);
    var coarse = !!(root.matchMedia && root.matchMedia("(pointer: coarse)").matches);
    var isDark = function () { return !!(root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)").matches); };
    var css = function (n) { return getComputedStyle(container).getPropertyValue(n).trim(); };
    S.coins = 0;

    /* every level is an island; more than 50 are split into archipelagos visited one after another */
    var NCH = Math.ceil(N / 50), CHUNK = Math.ceil(N / NCH);
    function chunkOf(k) { return Math.min(NCH - 1, Math.floor(Math.min(k, N - 1) / CHUNK)); }
    var STATIONS = core.LV.map(function (b, i) {
      return { id: b.id, name: b.name, idx: i, data: b.data, type: b.type, scenery: b.world.scenery || SCENERY[i % SCENERY.length],
        lightColor: b.color || PAL.light[i % PAL.light.length], darkColor: b.color || PAL.dark[i % PAL.dark.length] };
    });
    function isDone(s) { return !!S.results[s.idx].done; }
    function isUnlocked(s) { return s.idx <= S.k || isDone(s); }

    /* ---------- this game's HUD pieces: minimap, coins, guide arrow, stick ---------- */
    var miniPx = 224, mini = el("canvas", { class: "nthview-mini", width: String(miniPx), height: String(miniPx), "aria-hidden": "true" });
    core.hRight.appendChild(mini);
    var coinOut = el("b", { text: "0" });
    core.hStats.appendChild(el("span", { title: "Coins" }, [doc.createTextNode("◉ "), coinOut]));
    var svgNS = "http://www.w3.org/2000/svg";
    var gSvg = doc.createElementNS(svgNS, "svg"); gSvg.setAttribute("viewBox", "0 0 24 24"); gSvg.setAttribute("width", "24"); gSvg.setAttribute("height", "24");
    var gPath = doc.createElementNS(svgNS, "path"); gPath.setAttribute("d", "M12 2 L21 13 H15.5 V22 H8.5 V13 H3 Z"); gPath.setAttribute("fill", "currentColor"); gSvg.appendChild(gPath);
    var gArrow = el("div", { class: "nthview-garrow", "aria-hidden": "true" }, [gSvg]);
    core.callout.insertBefore(gArrow, core.callout.firstChild);
    var knob = el("div", { class: "nthview-knob" });
    var joy = el("div", { class: "nthview-joy", "aria-hidden": "true" }, [knob]);
    container.appendChild(joy);

    /* ---------- renderer & scene ---------- */
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, 2));
    var W = function () { return container.clientWidth || 800; }, H = function () { return container.clientHeight || 600; };
    renderer.setSize(W(), H(), false);
    var scene = new THREE.Scene();
    var WORLD_R = layoutRings(CHUNK).outer, LAYOUT = null;
    var camera = new THREE.PerspectiveCamera(60, W() / H(), .1, Math.max(900, WORLD_R * 4));
    var hemi = new THREE.HemisphereLight(T3.hemi[0], T3.hemi[1], .9); scene.add(hemi);
    var sun = new THREE.DirectionalLight(T3.sun, .8); sun.position.set(40, 80, 30); scene.add(sun);
    /* one shared uniform scales every emissive glow (day vs night) without recompiling the materials */
    var emiScale = { value: 1 };
    var emiHook = function (shader) {
      shader.uniforms.nvEmi = emiScale;
      shader.fragmentShader = shader.fragmentShader.replace("uniform vec3 emissive;", "uniform vec3 emissive;\nuniform float nvEmi;").replace("#include <emissivemap_fragment>", "#include <emissivemap_fragment>\n\ttotalEmissiveRadiance *= nvEmi;");
    };
    var std = function (o) { var m = new THREE.MeshStandardMaterial(o); m.onBeforeCompile = emiHook; return m; };
    var M = function (c, o) { return std(Object.assign({ color: c, roughness: .75, metalness: .05, flatShading: true }, o || {})); };
    var glow = function (c, i, o) { return M(c, Object.assign({ emissive: c, emissiveIntensity: i === undefined ? .6 : i }, o || {})); };
    var sandMat = M("#e2c68e"), stoneMat = M("#a8936a");
    var seaMat = new THREE.MeshStandardMaterial({ color: "#2b88aa", roughness: .35, metalness: .1, flatShading: true, transparent: true, opacity: .95 });
    var seaSize = Math.max(700, WORLD_R * 2 + 320);
    var seaGeo = new THREE.PlaneGeometry(seaSize, seaSize, 90, 90);
    var sea = new THREE.Mesh(seaGeo, seaMat); sea.rotation.x = -Math.PI / 2; sea.position.y = -1.6; scene.add(sea);
    var seaPos = seaGeo.attributes.position;
    var starGeo = new THREE.BufferGeometry(); var sp = [];
    for (var si = 0; si < 900; si++) { var th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * .45, rr = Math.max(400, WORLD_R * 2.2); sp.push(rr * Math.sin(ph) * Math.cos(th), rr * Math.cos(ph) + 20, rr * Math.sin(ph) * Math.sin(th)); }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false, fog: false })); scene.add(stars);
    /* sky dome: a vertical gradient from the horizon (the fog colour, so the far sea melts into it) to the zenith; it follows the camera */
    var domeGeo = new THREE.SphereGeometry(camera.far * .85, 32, 16), domeCol = new Float32Array(domeGeo.attributes.position.count * 3);
    domeGeo.setAttribute("color", new THREE.BufferAttribute(domeCol, 3));
    var dome = new THREE.Mesh(domeGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false }));
    dome.renderOrder = -1; dome.frustumCulled = false; scene.add(dome);
    function paintDome(horizon, zenith) {
      var a = new THREE.Color(horizon), b = new THREE.Color(zenith), c = new THREE.Color(), pos = domeGeo.attributes.position, R = camera.far * .85;
      for (var v = 0; v < pos.count; v++) { var k = Math.pow(Math.max(0, pos.getY(v) / R), .6); c.copy(a).lerp(b, k); domeCol[v * 3] = c.r; domeCol[v * 3 + 1] = c.g; domeCol[v * 3 + 2] = c.b; }
      domeGeo.attributes.color.needsUpdate = true;
    }

    /* ---------- labels (canvas textures) ---------- */
    var FONT = "\"Bricolage Grotesque\", \"Avenir Next\", system-ui, sans-serif";
    function makeLabel(text, color, num) {
      var cw = 1280, ch = 200, c = doc.createElement("canvas"); c.width = cw; c.height = ch;
      var x = c.getContext("2d"); var font = function (s) { return "800 " + s + "px " + FONT; };
      x.font = font(80); var tw = x.measureText(text).width; var lead = num != null ? 118 : 48; var w = Math.min(cw - 16, tw + lead + 56), l = (cw - w) / 2, r = 80;
      x.fillStyle = "rgba(12,16,34,.76)"; x.beginPath(); x.moveTo(l + r, 20); x.lineTo(l + w - r, 20); x.arc(l + w - r, 100, r, -Math.PI / 2, Math.PI / 2); x.lineTo(l + r, 180); x.arc(l + r, 100, r, Math.PI / 2, Math.PI * 1.5); x.fill();
      if (num != null) { x.fillStyle = color; x.beginPath(); x.arc(l + 74, 100, 44, 0, Math.PI * 2); x.fill(); x.fillStyle = "#10152b"; x.font = font(num > 99 ? 46 : 58); x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(String(num), l + 74, 104); x.textAlign = "left"; x.font = font(80); }
      x.fillStyle = "#ffffff"; x.textBaseline = "middle"; x.fillText(text, l + lead, 104, cw - lead - l - 30);
      var tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false })); s.scale.set(15, 2.34, 1); return s;
    }
    function makeTag(text, color, size) {
      var c = doc.createElement("canvas"); c.width = 256; c.height = 256; var x = c.getContext("2d");
      x.fillStyle = "rgba(12,16,34,.8)"; x.beginPath(); x.arc(128, 128, 118, 0, Math.PI * 2); x.fill();
      x.fillStyle = color; x.beginPath(); x.arc(128, 128, 100, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#10152b"; x.font = "800 " + (text.length > 6 ? 40 : text.length > 2 ? 70 : 130) + "px " + FONT; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, 128, 136, 190);
      var tex = new THREE.CanvasTexture(c); var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, fog: false })); s.scale.set(size || 1.3, size || 1.3, 1); return s;
    }
    /* a small floating sign: wide pill with text, used by field tasks */
    function makeSign(text, color, width) {
      var lb = makeLabel(text, color || "#ffffff"); var w = width || 6; lb.scale.set(w, w * .156, 1); return lb;
    }

    /* ---------- sky extras per world theme ---------- */
    var skyUpdaters = [];
    (function () {
      if (T3.extra === "clouds" || T3.extra === "mesas") {
        var cloudMat = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 1, flatShading: true, transparent: true, opacity: .85 });
        var clouds = [];
        for (var i = 0; i < 7; i++) {
          var cg = new THREE.Group(); var a = i / 7 * Math.PI * 2, d = WORLD_R * .6 + Math.random() * WORLD_R * .8;
          for (var k = 0; k < 3; k++) { var cs = new THREE.Mesh(new THREE.IcosahedronGeometry(3 + Math.random() * 3, 0), cloudMat); cs.position.set((k - 1) * 4.2, Math.random() * 1.2, (Math.random() - .5) * 2); cg.add(cs); }
          cg.position.set(Math.cos(a) * d, 38 + Math.random() * 14, Math.sin(a) * d); scene.add(cg); clouds.push({ g: cg, v: .4 + Math.random() * .5 });
        }
        skyUpdaters.push(function (t, dt) { if (settings.reduced) return; clouds.forEach(function (c) { c.g.position.x += c.v * dt; if (c.g.position.x > WORLD_R * 1.6) c.g.position.x = -WORLD_R * 1.6; }); });
        if (T3.extra === "mesas") {
          var mesaMat = M("#8a4a2a");
          for (var mi = 0; mi < 9; mi++) { var ma = mi / 9 * Math.PI * 2 + .3, md = WORLD_R + 120 + Math.random() * 60; var mesa = new THREE.Mesh(new THREE.CylinderGeometry(14 + Math.random() * 10, 20 + Math.random() * 14, 18 + Math.random() * 22, 7), mesaMat); mesa.position.set(Math.cos(ma) * md, 5, Math.sin(ma) * md); scene.add(mesa); }
        }
      }
      if (T3.extra === "aurora") {
        var curtains = [];
        for (var ci = 0; ci < 3; ci++) {
          var c = doc.createElement("canvas"); c.width = 64; c.height = 256; var x = c.getContext("2d");
          var gr = x.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, "rgba(120,255,200,0)"); gr.addColorStop(.35, ci === 1 ? "rgba(170,120,255,.55)" : "rgba(90,255,190,.55)"); gr.addColorStop(.7, "rgba(90,180,255,.3)"); gr.addColorStop(1, "rgba(90,180,255,0)");
          x.fillStyle = gr; x.fillRect(0, 0, 64, 256);
          var tex = new THREE.CanvasTexture(c);
          var mesh = new THREE.Mesh(new THREE.PlaneGeometry(WORLD_R * 2.4, 70, 24, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, fog: false }));
          var ca = Math.PI * 1.1 + ci * .5; var cd = WORLD_R * 1.8 + ci * 40;
          mesh.position.set(Math.sin(ca) * cd, 95 + ci * 12, Math.cos(ca) * cd); mesh.lookAt(0, 60, 0); scene.add(mesh); curtains.push(mesh);
        }
        skyUpdaters.push(function (t) {
          if (settings.reduced) return;
          curtains.forEach(function (m, i) { var pos = m.geometry.attributes.position; for (var v = 0; v < pos.count; v++) { var px = pos.getX(v); pos.setZ(v, Math.sin(px * .02 + t * .5 + i) * 6); } pos.needsUpdate = true; m.material.opacity = .7 + Math.sin(t * .6 + i) * .2; });
        });
      }
      if (T3.extra === "snow") {
        var sn = 1400, sg = new THREE.BufferGeometry(), sa = new Float32Array(sn * 3);
        for (var fi = 0; fi < sn; fi++) { sa[fi * 3] = (Math.random() - .5) * 120; sa[fi * 3 + 1] = Math.random() * 40; sa[fi * 3 + 2] = (Math.random() - .5) * 120; }
        sg.setAttribute("position", new THREE.BufferAttribute(sa, 3));
        var snow = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: .35, transparent: true, opacity: .9 })); scene.add(snow);
        skyUpdaters.push(function (t, dt, pp) {
          snow.position.set(pp.x, 0, pp.z); if (settings.reduced) return;
          var arr = sg.attributes.position.array;
          for (var q = 0; q < sn; q++) { arr[q * 3 + 1] -= dt * (2.5 + (q % 5) * .4); arr[q * 3] += Math.sin(t + q) * dt * .4; if (arr[q * 3 + 1] < -1) arr[q * 3 + 1] = 40; }
          sg.attributes.position.needsUpdate = true;
        });
      }
    })();

    function applyTheme() {
      var dark = isDark();
      var sky = css("--sky") || "#bfe0f2"; scene.background = new THREE.Color(sky); scene.fog = new THREE.Fog(sky, 70, Math.max(300, WORLD_R * 2.2));
      paintDome(sky, css("--sky-top") || sky);
      seaMat.color.set(css("--sea") || "#2b88aa"); sandMat.color.set(css("--sand") || "#e2c68e"); stoneMat.color.set(css("--stone") || "#a8936a");
      stars.visible = T3.stars === "always" || dark; hemi.intensity = dark ? T3.hemiI[1] : T3.hemiI[0]; sun.intensity = dark ? T3.sunI[1] : T3.sunI[0];
      emiScale.value = dark ? T3.emi[1] : T3.emi[0];
      CH.forEach(function (s) {
        s.color = dark ? s.darkColor : s.lightColor; s.beacon.material.color.set(s.color);
        if (s.lampMesh) s.lampMesh.material.color.set(s.color);
        if (s.recolor) s.recolor(s.color);
      });
      refreshWorld();
    }

    /* ---------- confetti ---------- */
    var bursts = [];
    function burst(x, y, z, color, n) {
      n = n || 110;
      var geo = new THREE.BufferGeometry(); var pos = new Float32Array(n * 3); var vel = [];
      for (var i = 0; i < n; i++) { pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; var a = Math.random() * Math.PI * 2, up = 4 + Math.random() * 7, out = 2 + Math.random() * 5; vel.push(Math.cos(a) * out, up, Math.sin(a) * out); }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      var pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: color, size: .38, transparent: true, opacity: 1 }));
      scene.add(pts); bursts.push({ pts: pts, vel: vel, t: 0 });
    }
    function updateBursts(dt) {
      for (var i = bursts.length - 1; i >= 0; i--) {
        var b = bursts[i]; b.t += dt; var a = b.pts.geometry.attributes.position; var arr = a.array;
        for (var k = 0; k < b.vel.length / 3; k++) { b.vel[k * 3 + 1] -= 12 * dt; arr[k * 3] += b.vel[k * 3] * dt; arr[k * 3 + 1] += b.vel[k * 3 + 1] * dt; arr[k * 3 + 2] += b.vel[k * 3 + 2] * dt; if (arr[k * 3 + 1] < 0) { arr[k * 3 + 1] = 0; b.vel[k * 3 + 1] *= -.3; } }
        a.needsUpdate = true; b.pts.material.opacity = Math.max(0, 1 - b.t / 2); if (b.t > 2) { scene.remove(b.pts); bursts.splice(i, 1); }
      }
    }

    /* ---------- player (the coach) and the companion ---------- */
    var player = new THREE.Group(); scene.add(player);
    var body = new THREE.Mesh(new THREE.IcosahedronGeometry(.75, 1), M("#f4f6fb", { emissive: "#ffffff", emissiveIntensity: .15, roughness: .4 })); body.position.y = 1.1; player.add(body);
    var visor = new THREE.Mesh(new THREE.BoxGeometry(.9, .22, .3), M("#1b2440", { emissive: "#6eb6f2", emissiveIntensity: .8 })); visor.position.set(0, 1.25, .62); player.add(visor);
    var halo = new THREE.Mesh(new THREE.TorusGeometry(.55, .07, 6, 24), glow("#ffd76a", .8)); halo.rotation.x = Math.PI / 2; halo.position.y = 2.25; player.add(halo);
    var carryGroup = new THREE.Group(); carryGroup.position.y = 3.1; player.add(carryGroup);
    player.position.set(0, 0, 6.5);
    var yaw = 0, pitch = .34;
    var robo = new THREE.Group(); scene.add(robo);
    (function () {
      var bd = new THREE.Mesh(new THREE.BoxGeometry(.75, .65, .6), M("#e8e6da", { roughness: .5 })); bd.position.y = .75; robo.add(bd);
      var hd = new THREE.Mesh(new THREE.BoxGeometry(.6, .45, .55), M("#e8e6da", { roughness: .5 })); hd.position.y = 1.35; robo.add(hd);
      [-.15, .15].forEach(function (sx) { var eye = new THREE.Mesh(new THREE.BoxGeometry(.12, .12, .06), glow("#6eb6f2", 1)); eye.position.set(sx, 1.4, .29); robo.add(eye); });
      var ant = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .4, 5), stoneMat); ant.position.y = 1.75; robo.add(ant);
      var tip = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), glow("#f4c55b", 1)); tip.position.y = 1.98; robo.add(tip); robo.userData.tip = tip;
      var feet = new THREE.Mesh(new THREE.BoxGeometry(.6, .2, .5), M("#9aa3b8")); feet.position.y = .35; robo.add(feet);
    })();
    robo.position.set(0, 0, 8.2); var roboJump = 0;

    function figure(sc, color) {
      var f = new THREE.Group();
      var b = new THREE.Mesh(new THREE.CylinderGeometry(.55, .75, 2, 8), M(color || "#c8cdd8")); b.position.y = 1; f.add(b);
      var h = new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 0), glow(color || "#c8cdd8", .3)); h.position.y = 2.6; f.add(h);
      f.scale.setScalar(sc); return f;
    }
    function makePad(s, lx, lz, opt) {
      var pad = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, .18, 20), M("#f4f1e8", { emissive: s.color, emissiveIntensity: 0 })); pad.position.set(lx, .09, lz); s.g.add(pad);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, .08, 6, 28), glow(s.color, .5)); ring.rotation.x = Math.PI / 2; ring.position.set(lx, .2, lz); s.g.add(ring);
      var tag = makeTag(opt.label, "#ffffff", 1.9); tag.position.set(lx, 1.6, lz); s.g.add(tag);
      var w = s.toWorld(lx, lz); return { mesh: pad, ring: ring, tag: tag, id: opt.id, label: opt.label, why: opt.hint || "", x: w.x, z: w.z };
    }
    function pillar(s, lx, lz, h, color) {
      var m = new THREE.Mesh(new THREE.BoxGeometry(.9, h, .9), M(color || "#c8cdd8", { emissive: s.color, emissiveIntensity: 0 })); m.position.set(lx, h / 2, lz); s.g.add(m); return m;
    }
    var THEMES = {
      grove: function (s) {
        var trees = [];
        for (var i = 0; i < 8; i++) {
          var a = i / 8 * Math.PI * 2 + .2, t = new THREE.Group();
          var cone = new THREE.Mesh(new THREE.ConeGeometry(.95, 3.4, 6), glow(s.color, .25)); cone.position.y = 2.6; t.add(cone);
          var trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18, .24, 1, 6), stoneMat); trunk.position.y = .5; t.add(trunk);
          t.position.set(Math.cos(a) * 7.6, 0, Math.sin(a) * 7.6); s.g.add(t); trees.push(t);
        }
        if (s.data.activity && s.data.activity.type === "collect") {
          var ballot = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.2), M("#f4f1e8")); ballot.position.y = .8; s.g.add(ballot);
          var slot = new THREE.Mesh(new THREE.BoxGeometry(1.2, .06, .2), M("#1b2440")); slot.position.y = 1.62; s.g.add(slot);
          s.pulse = function () { ballot.scale.setScalar(1.12); };
          updaters.push(function () { ballot.scale.lerp(new THREE.Vector3(1, 1, 1), .1); });
        }
        updaters.push(function (t) { if (!settings.reduced) trees.forEach(function (tr, i) { tr.rotation.z = Math.sin(t * 1.2 + i) * .03; }); });
      },
      tower: function (s) {
        var rings = [];
        var core = new THREE.Mesh(new THREE.CylinderGeometry(.5, .9, 12, 8), stoneMat); core.position.set(0, 6, -1); s.g.add(core);
        for (var i = 0; i < 9; i++) { var r = new THREE.Mesh(new THREE.TorusGeometry(2.6 - i * .18, .22, 6, 28), glow(s.color, .9 - i * .09)); r.rotation.x = Math.PI / 2; r.position.set(0, 1 + i * 1.25, -1); s.g.add(r); rings.push(r); }
        var top = new THREE.Mesh(new THREE.OctahedronGeometry(.7, 0), M("#888888", { emissive: "#333333" })); top.position.set(0, 12.8, -1); s.g.add(top);
        updaters.push(function (t) { if (settings.reduced) return; rings.forEach(function (r, i) { r.rotation.z = t * .4 * (i % 2 ? 1 : -1); r.material.emissiveIntensity = .15 + .75 * Math.max(0, Math.sin(t * 1.6 - i * .55)) * (1 - i / 11); }); });
      },
      arena: function (s) {
        var floor = new THREE.Mesh(new THREE.TorusGeometry(6.2, .25, 6, 40), glow(s.color, .4)); floor.rotation.x = Math.PI / 2; floor.position.y = .1; s.g.add(floor);
      },
      workshop: function (s) {
        var stand = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5, .3, 10), stoneMat); stand.position.set(0, .15, 1.5); s.g.add(stand);
      },
      canyon: function (s) {
        var wall = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 1.2), stoneMat); wall.position.set(0, .6, 7.5); s.g.add(wall);
      },
      hall: function (s) {
        for (var i = -1; i <= 1; i += 2) { var col = new THREE.Mesh(new THREE.CylinderGeometry(.35, .4, 6, 8), M("#c8cdd8")); col.position.set(i * 6.5, 3, 6.5); s.g.add(col); }
        var beam = new THREE.Mesh(new THREE.BoxGeometry(13.8, .5, .6), M("#c8cdd8")); beam.position.set(0, 6.2, 6.5); s.g.add(beam);
      },
      clock: function (s) {
        var stand = new THREE.Mesh(new THREE.BoxGeometry(8, .8, 1.6), stoneMat); stand.position.set(0, .4, 2); s.g.add(stand);
      },
      plain: function () {}
    };
    var PROPS = {
      collect: function (s, act) {
        var n = act.items.length;
        s.task = { type: "collect", total: n, collected: [], items: [], };
        act.items.forEach(function (L, i) {
          var a = i / n * Math.PI * 2 + .4, d = 4.6 + (i % 2) * 1.6, lx = Math.cos(a) * d, lz = Math.sin(a) * d;
          var o = new THREE.Mesh(new THREE.SphereGeometry(.42, 12, 10), glow(s.color, 1)); o.position.set(lx, 1, lz); s.g.add(o);
          var tag = makeTag(L, "#ffffff", 1.2); tag.position.set(lx, 2.1, lz); s.g.add(tag); var w = s.toWorld(lx, lz);
          s.task.items.push({ mesh: o, tag: tag, L: L, x: w.x, z: w.z, got: false, ph: i });
        });
        updaters.push(function (t) { if (settings.reduced) return; s.task.items.forEach(function (it) { if (!it.got) { it.mesh.position.y = 1 + Math.sin(t * 2.5 + it.ph) * .18; it.tag.position.y = 2.1 + Math.sin(t * 2.5 + it.ph) * .18; } }); });
      },
      pads: function (s, act) {
        var k = act.options.length, spread = 4.6;
        s.task = { type: "pad", answer: act.answer, onPad: null, pads: [] };
        act.options.forEach(function (opt, i) {
          var x = spreadX(i, k, spread);
          s.task.pads.push(makePad(s, x, -3.4, opt));
          if (opt.bars) {
            var a = new THREE.Mesh(new THREE.BoxGeometry(1.3, Math.max(.2, opt.bars[0] / 10), 1.3), M("#9aa3b8")); a.position.set(x - .8, Math.max(.2, opt.bars[0] / 10) / 2, 1.5); s.g.add(a);
            var b = new THREE.Mesh(new THREE.BoxGeometry(1.3, Math.max(.2, opt.bars[1] / 10), 1.3), glow(s.color, .45)); b.position.set(x + .8, Math.max(.2, opt.bars[1] / 10) / 2, 1.5); s.g.add(b);
            var lb = makeLabel(opt.label, s.color); lb.scale.set(7, 1.09, 1); lb.position.set(x, Math.max(opt.bars[1] / 10, 1) + 1.4, 1.5); s.g.add(lb);
          }
          if (opt.size) {
            var f = figure(opt.size); f.position.set(x, 0, 1.5); s.g.add(f);
            var l1 = makeLabel(opt.label, "#ffffff"); l1.scale.set(6, .94, 1); l1.position.set(x, 3.2 * opt.size + .8, 1.5); s.g.add(l1);
            (function (fig, big) { updaters.push(function (t) { if (settings.reduced) return; if (big) fig.rotation.y = Math.sin(t * .4) * .3; else fig.position.y = Math.abs(Math.sin(t * 3 + x)) * .25; }); })(f, opt.size >= 2);
          }
        });
      },
      fork: function (s, act) {
        var k = act.paths.length;
        var post = new THREE.Mesh(new THREE.CylinderGeometry(.15, .18, 3, 6), stoneMat); post.position.set(0, 1.5, -.5); s.g.add(post);
        s.task = { type: "fork", answer: act.answer, paths: [], home: s.toWorld(0, -4), cool: 0 };
        act.paths.forEach(function (pt, i) {
          var ang = (i - (k - 1) / 2) * (k === 2 ? .9 : .7);
          var ex = Math.sin(ang) * 7.2, ez = Math.cos(ang) * 7.2;
          var plank = new THREE.Mesh(new THREE.BoxGeometry(1.8, .12, 7), M("#d9c9a4")); plank.position.set(Math.sin(ang) * 3.6, .08, Math.cos(ang) * 3.6); plank.rotation.y = -ang; s.g.add(plank);
          var gate = new THREE.Mesh(new THREE.TorusGeometry(1.5, .14, 6, 24), glow(s.color, .5)); gate.position.set(ex, 1.6, ez); gate.rotation.y = -ang; s.g.add(gate);
          var sign = makeSign(pt.label, "#ffffff", 4); sign.position.set(ex, 3.6, ez); s.g.add(sign);
          var arrowSign = makeSign(pt.label, s.color, 3.2); arrowSign.position.set(Math.sin(ang) * 1.3, 2.6 + i * .5, -.5 + Math.cos(ang) * 1.3); s.g.add(arrowSign);
          var w = s.toWorld(ex, ez); s.task.paths.push({ id: pt.id, label: pt.label, hint: pt.hint || "", x: w.x, z: w.z, gate: gate });
        });
        s.api = { solved: function () { s.task.paths.forEach(function (pt) { pt.gate.material.emissiveIntensity = pt.id === act.answer ? 1 : .05; }); } };
      },
      beacons: function (s, act) {
        var n = act.items.length;
        s.task = { type: "beacons", items: [], near: null };
        act.items.forEach(function (it, i) {
          var a = Math.PI * .1 + i / (n - 1) * Math.PI * .8; var lx = Math.cos(a) * 6.4, lz = 1 + Math.sin(a) * 5.6;
          var bowl = new THREE.Mesh(new THREE.CylinderGeometry(.75, .45, .8, 8), stoneMat); bowl.position.set(lx, 1.2, lz); s.g.add(bowl);
          var leg = new THREE.Mesh(new THREE.CylinderGeometry(.12, .16, 1, 5), stoneMat); leg.position.set(lx, .5, lz); s.g.add(leg);
          var flame = new THREE.Mesh(new THREE.ConeGeometry(.5, 1.4, 6), glow(s.color, 1, { transparent: true, opacity: .95 })); flame.position.set(lx, 2.2, lz); flame.visible = false; s.g.add(flame);
          var sign = makeSign(it.label, "#ffffff", 4.2); sign.position.set(lx, 3.4, lz); s.g.add(sign);
          var w = s.toWorld(lx, lz); s.task.items.push({ id: it.id, label: it.label, want: it.lit, on: false, x: w.x, z: w.z, flame: flame, bowl: bowl });
        });
        updaters.push(function (t) { if (settings.reduced) return; s.task.items.forEach(function (it, i) { if (it.on) { it.flame.scale.y = 1 + Math.sin(t * 9 + i) * .18; it.flame.rotation.y = t * 2; } }); });
      },
      steps: function (s, act) {
        var n = act.items.length, perm = shuffledIdx(n, s.id + ":steps");
        s.task = { type: "steps", order: act.items.map(function (it) { return it.id; }), pos: 0, pads: [], standing: null };
        act.items.forEach(function (it, i) {
          var slot = perm[i]; var a = Math.PI * .05 + slot / (n - 1) * Math.PI * .9; var lx = Math.cos(a) * 5.8, lz = 1.5 + Math.sin(a) * 4.6;
          var pd = makePad(s, lx, lz, { id: it.id, label: it.label }); pd.ring.scale.setScalar(.8); pd.mesh.scale.setScalar(.8); pd.tag.scale.setScalar(1.6); s.task.pads.push(pd);
        });
      },
      gather: function (s, act) {
        s.task = { type: "gather", items: [], bins: [], carrying: null, sorted: 0, total: act.items.length, nearBin: null, binnedIdx: [] };
        act.bins.forEach(function (b, i) {
          var bx = spreadX(i, act.bins.length, 4.2), bz = 5.5;
          var bin = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.3, 2.4), M("#c8cdd8", { emissive: s.color, emissiveIntensity: .1 })); bin.position.set(bx, .65, bz); s.g.add(bin);
          var sign = makeSign(b.label, s.color, 4.6); sign.position.set(bx, 2.4, bz); s.g.add(sign);
          var w = s.toWorld(bx, bz); s.task.bins.push({ id: b.id, label: b.label, x: w.x, z: w.z, mesh: bin, count: 0 });
        });
        act.items.forEach(function (it, i) {
          var a = Math.PI * 1.05 + i / act.items.length * Math.PI * .9; var d = 4 + (i % 2) * 2.2; var lx = Math.cos(a) * d, lz = 1 + Math.sin(a) * d;
          var o = new THREE.Mesh(new THREE.IcosahedronGeometry(.45, 0), glow(s.color, .9)); o.position.set(lx, 1, lz); s.g.add(o);
          var tag = makeSign(it.label, "#ffffff", 3.4); tag.position.set(lx, 2.1, lz); s.g.add(tag);
          var w = s.toWorld(lx, lz); s.task.items.push({ label: it.label, bin: it.bin, x: w.x, z: w.z, mesh: o, tag: tag, where: "ground", ph: i });
        });
        updaters.push(function (t) { if (settings.reduced) return; s.task.items.forEach(function (it) { if (it.where === "ground") { it.mesh.position.y = 1 + Math.sin(t * 2.5 + it.ph) * .18; it.mesh.rotation.y = t; } }); });
      }
    };
    /* ---------- the archipelago of chunk c: islands, causeways, walk graph, hub, scenery, field props ---------- */
    var world = null, chunk = -1, CH = [], islands, bridges, coinPickups = [], nodes, adj, hubRing, crown = [], obelisk, updaters = [];
    function buildWorld(c) {
      if (world) { scene.remove(world); world.traverse(function (o) { if (o.geometry) o.geometry.dispose(); if (o.material && o.material.map) o.material.map.dispose(); }); }
      world = new THREE.Group(); scene.add(world); chunk = c; updaters = [];
      CH = STATIONS.slice(c * CHUNK, Math.min(N, (c + 1) * CHUNK)); LAYOUT = layoutRings(CH.length);
      /* ---------- world: islands, causeways, walk graph ---------- */
      islands = [{ x: 0, z: 0, r: R_HUB }]; bridges = [];
      var rockSpots = [], postSpots = [], lampSpots = [];
      function island(x, z, r) {
        var g = new THREE.Mesh(new THREE.CylinderGeometry(r, r * .72, 7, 30), sandMat); g.position.set(x, -3.5, z); world.add(g);
        for (var i = 0; i < 7; i++) {
          var a = Math.random() * Math.PI * 2, d = r * (.82 + Math.random() * .12);
          rockSpots.push({ x: x + Math.cos(a) * d, z: z + Math.sin(a) * d, s: .5 + Math.random() * .7, rx: Math.random(), ry: Math.random() });
        }
      }
      island(0, 0, R_HUB);

      coinPickups = [];
      /* graph nodes: {x,z}; edges: adjacency lists of {to,w} */
      nodes = []; adj = [];
      function addNode(x, z) { nodes.push({ x: x, z: z }); adj.push([]); return nodes.length - 1; }
      function link(a, b) { var w = Math.hypot(nodes[a].x - nodes[b].x, nodes[a].z - nodes[b].z); adj[a].push({ to: b, w: w }); adj[b].push({ to: a, w: w }); }
      hubRing = []; /* {angle, node, inner} */

      CH.forEach(function (s, i) {
        var slot = LAYOUT.slots[i];
        s.color = isDark() ? s.darkColor : s.lightColor;
        s.ring = slot.ring; s.angle = slot.angle; s.slot = slot.slot; s.ringSize = slot.m;
        s.dir = { x: Math.sin(s.angle), z: Math.cos(s.angle) };
        s.x = slot.x; s.z = slot.z;
        s.toWorld = function (lx, lz) { return { x: s.x + lx * Math.cos(s.angle) + lz * Math.sin(s.angle), z: s.z - lx * Math.sin(s.angle) + lz * Math.cos(s.angle) }; };
        islands.push({ x: s.x, z: s.z, r: R_ISLE }); island(s.x, s.z, R_ISLE);
        s.g = new THREE.Group(); s.g.position.set(s.x, 0, s.z); s.g.rotation.y = s.angle; world.add(s.g);
        s.lamps = []; s.nodes = [];
        var arrive = s.toWorld(0, -6); s.arrive = addNode(arrive.x, arrive.z); s.nodes.push(s.arrive);
        s.beacon = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, 60, 12, 1, true), new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: .1, depthWrite: false, fog: false }));
        s.beacon.position.set(s.x, 30, s.z); world.add(s.beacon);
        s.label = makeLabel(s.name, s.color, s.idx + 1); s.label.position.set(s.x, 10.5, s.z); world.add(s.label);
        s.beaconBase = .04;
      });

      /* a causeway between two landmasses; p/q are centres, rp/rq radii; owner colours the lamps */
      function causeway(p, q, rp, rq, owner, nodeP, nodeQ) {
        var dx = q.x - p.x, dz = q.z - p.z, L = Math.hypot(dx, dz), ux = dx / L, uz = dz / L, ang = Math.atan2(ux, uz);
        var a0 = rp - 1.5, a1 = L - rq + 1.5, len = a1 - a0;
        /* top sits 5 cm below the island surface so the overlap under the shore never z-fights */
        var b = new THREE.Mesh(new THREE.BoxGeometry(3.4, .5, len), stoneMat);
        b.position.set(p.x + ux * (a0 + len / 2), -.3, p.z + uz * (a0 + len / 2)); b.rotation.y = ang; world.add(b);
        var sideX = Math.cos(ang), sideZ = -Math.sin(ang);
        for (var k = 1.2; k <= len - .5; k += 3.4) {
          [-1, 1].forEach(function (side) {
            var px = p.x + ux * (a0 + k) + sideX * side * 1.6, pz = p.z + uz * (a0 + k) + sideZ * side * 1.6;
            postSpots.push({ x: px, z: pz }); lampSpots.push({ x: px, z: pz, owner: owner });
          });
        }
        [.28, .5, .72].forEach(function (f, k) {
          var dd = a0 + len * f, side = (k % 2 ? 1 : -1) * .7;
          var c = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .1, 18), glow("#f4c55b", .7, { metalness: .5, roughness: .3 })); c.rotation.x = Math.PI / 2;
          var wx = p.x + ux * dd + sideX * side, wz = p.z + uz * dd + sideZ * side; c.position.set(wx, 1.2, wz); world.add(c); coinPickups.push({ mesh: c, x: wx, z: wz, got: false });
        });
        var br = { ax: p.x + ux * (rp - 3), az: p.z + uz * (rp - 3), bx: p.x + ux * (L - rq + 3), bz: p.z + uz * (L - rq + 3) };
        bridges.push(br);
        var nP = nodeP !== undefined ? nodeP : addNode(br.ax, br.az);
        var nQ = nodeQ !== undefined ? nodeQ : addNode(br.bx, br.bz);
        link(nP, nQ);
        return { bridge: br, nP: nP, nQ: nQ };
      }
      /* spokes inward and neighbour causeways */
      CH.forEach(function (s) {
        if (s.ring === 0) {
          var hr = addNode(s.dir.x * 11.5, s.dir.z * 11.5), hi = addNode(s.dir.x * 4.3, s.dir.z * 4.3); link(hr, hi);
          hubRing.push({ angle: s.angle, node: hr, inner: hi });
          var cw = causeway({ x: 0, z: 0 }, { x: s.x, z: s.z }, R_HUB, R_ISLE, s, hr);
          s.nodes.push(cw.nQ); s.spoke = cw.bridge;
        } else {
          var best = null, bd = 99;
          CH.forEach(function (o) { if (o.ring === s.ring - 1) { var d = angDiff(o.angle, s.angle); if (d < bd) { bd = d; best = o; } } });
          s.parent = best;
          var cw2 = causeway({ x: best.x, z: best.z }, { x: s.x, z: s.z }, R_ISLE, R_ISLE, s);
          best.nodes.push(cw2.nP); s.nodes.push(cw2.nQ); s.spoke = cw2.bridge;
        }
      });
      CH.forEach(function (s) {
        if (s.ringSize < 2) return;
        var nextSlot = (s.slot + 1) % s.ringSize; if (s.ringSize === 2 && s.slot === 1) return;
        var o = CH.filter(function (c) { return c.ring === s.ring && c.slot === nextSlot; })[0]; if (!o) return;
        var gap = Math.hypot(o.x - s.x, o.z - s.z) - 2 * R_ISLE; if (gap > NEIGHBOUR_GAP) return;
        var cw = causeway({ x: s.x, z: s.z }, { x: o.x, z: o.z }, R_ISLE, R_ISLE, s);
        s.nodes.push(cw.nP); o.nodes.push(cw.nQ);
      });
      /* on-island connections: every node of an island reaches every other */
      CH.forEach(function (s) { for (var a = 0; a < s.nodes.length; a++) for (var b = a + 1; b < s.nodes.length; b++) link(s.nodes[a], s.nodes[b]); });
      hubRing.sort(function (a, b) { return a.angle - b.angle; });
      for (var hi2 = 0; hi2 < hubRing.length; hi2++) { if (hubRing.length > 1) link(hubRing[hi2].node, hubRing[(hi2 + 1) % hubRing.length].node); }

      /* instanced rocks, posts and lamps (one draw call each, lamps per island colour) */
      (function () {
        var dummy = new THREE.Object3D();
        /* no rocks on the pathway: drop any within 3 units of a causeway, extended 8 units into each shore */
        rockSpots = rockSpots.filter(function (r) {
          return !bridges.some(function (b) {
            var vx = b.bx - b.ax, vz = b.bz - b.az, L = Math.hypot(vx, vz) || 1, ux = vx / L, uz = vz / L;
            var ext = { ax: b.ax - ux * 8, az: b.az - uz * 8, bx: b.bx + ux * 8, bz: b.bz + uz * 8 };
            return segDist(r.x, r.z, ext) < 3;
          });
        });
        var rocks = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(1, 0), stoneMat, rockSpots.length);
        rockSpots.forEach(function (r, i) { dummy.position.set(r.x, .2, r.z); dummy.rotation.set(r.rx, r.ry, 0); dummy.scale.setScalar(r.s); dummy.updateMatrix(); rocks.setMatrixAt(i, dummy.matrix); });
        world.add(rocks);
        var posts = new THREE.InstancedMesh(new THREE.CylinderGeometry(.09, .09, 1, 5), stoneMat, postSpots.length);
        postSpots.forEach(function (r, i) { dummy.position.set(r.x, .5, r.z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); posts.setMatrixAt(i, dummy.matrix); });
        world.add(posts);
        CH.forEach(function (s) {
          var mine = lampSpots.filter(function (l) { return l.owner === s; }); if (!mine.length) return;
          var lm = new THREE.InstancedMesh(new THREE.SphereGeometry(.14, 8, 6), new THREE.MeshBasicMaterial({ color: s.color }), mine.length);
          mine.forEach(function (l, i) { dummy.position.set(l.x, 1.05, l.z); dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1); dummy.updateMatrix(); lm.setMatrixAt(i, dummy.matrix); });
          world.add(lm); s.lampMesh = lm;
        });
      })();


      /* ---------- centre (the finale hub) ---------- */
      var crownR = Math.max(2.55, CH.length * .62 / (2 * Math.PI)), pillarW = Math.min(.55, 2 * Math.PI * crownR / CH.length * .6);
      var plinth = new THREE.Mesh(new THREE.CylinderGeometry(crownR + .7, crownR + 1.3, .6, 8), stoneMat); plinth.position.y = .3; world.add(plinth);
      obelisk = new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 0), M("#9aa3b8", { emissive: "#222222", metalness: .3, roughness: .3 })); obelisk.position.y = 3.8; obelisk.scale.y = 1.8; world.add(obelisk);
      crown = CH.map(function (s, i) {
        var a = i / CH.length * Math.PI * 2; var h = .7 + 2.4 * (1 - Math.exp(-(i + .6) / Math.max(2.1, CH.length / 3)));
        var pm = new THREE.Mesh(new THREE.BoxGeometry(pillarW, h, pillarW), M("#8a93a8", { emissive: "#000000" })); pm.position.set(Math.sin(a) * crownR, .6 + h / 2, Math.cos(a) * crownR); world.add(pm); return { p: pm, s: s };
      });
      var examLabel = makeLabel(c === NCH - 1 ? data.finale.name : "Harbour: sail on", "#ffffff"); examLabel.position.set(0, 9.6, 0); world.add(examLabel);


      /* ---------- scenery per island theme ---------- */

      /* ---------- occasional weather and ambient life: random per load, never on every island ---------- */
      (function () {
        if (settings.reduced) return;
        var weatherKinds = themeName === "snow" ? ["snow"] : themeName === "canyon" ? ["rain", "storm"] : ["rain", "storm", "snow"];
        var maxWeather = Math.max(1, Math.round(CH.length * .3)), weathered = 0;
        CH.slice().sort(function () { return Math.random() - .5; }).forEach(function (s) {
          if (weathered < maxWeather && Math.random() < .3) { weathered++; addWeather(s, weatherKinds[Math.floor(Math.random() * weatherKinds.length)]); }
        });
        if (Math.random() < .7) addFlock();
        if (CH.length > 10 && Math.random() < .5) addFlock();
        CH.forEach(function (s) { if (Math.random() < .3) addFireflies(s); if (Math.random() < .25) addBugs(s); });

        function addWeather(s, kind) {
          var cloud = new THREE.Group();
          var cmat = new THREE.MeshStandardMaterial({ color: kind === "storm" ? "#5a6070" : kind === "snow" ? "#e8edf5" : "#9aa3b3", roughness: 1, flatShading: true, transparent: true, opacity: .92 });
          for (var k = 0; k < 4; k++) { var puff = new THREE.Mesh(new THREE.IcosahedronGeometry(2.2 + Math.random() * 1.6, 0), cmat); puff.position.set((k - 1.5) * 3.2, Math.random() * .8, (Math.random() - .5) * 2.5); cloud.add(puff); }
          cloud.position.set(s.x, 17, s.z); world.add(cloud);
          var n = kind === "snow" ? 140 : 170, geo = new THREE.BufferGeometry(), arr = new Float32Array(n * 3);
          for (var i = 0; i < n; i++) { var a = Math.random() * Math.PI * 2, d = Math.random() * 7.5; arr[i * 3] = s.x + Math.cos(a) * d; arr[i * 3 + 1] = Math.random() * 16; arr[i * 3 + 2] = s.z + Math.sin(a) * d; }
          geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
          var pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: kind === "snow" ? 0xffffff : 0xbfe3ff, size: kind === "snow" ? .32 : .16, transparent: true, opacity: kind === "snow" ? .9 : .6 })); world.add(pts);
          var bolt = null, flashT = 0, nextFlash = 5 + Math.random() * 9;
          if (kind === "storm") {
            var bp = [], px = s.x + (Math.random() - .5) * 6, pz = s.z + (Math.random() - .5) * 6, y = 15;
            while (y > .5) { var ny = Math.max(.5, y - 2 - Math.random() * 2), nx = px + (Math.random() - .5) * 2.4, nz = pz + (Math.random() - .5) * 2.4; bp.push(px, y, pz, nx, ny, nz); px = nx; pz = nz; y = ny; }
            var bg = new THREE.BufferGeometry(); bg.setAttribute("position", new THREE.Float32BufferAttribute(bp, 3));
            bolt = new THREE.LineSegments(bg, new THREE.LineBasicMaterial({ color: 0xfff6c8, transparent: true, opacity: 0, fog: false })); world.add(bolt);
          }
          updaters.push(function (t, dt) {
            var p = geo.attributes.position.array;
            for (var q = 0; q < n; q++) { p[q * 3 + 1] -= dt * (kind === "snow" ? 2.2 + (q % 4) * .4 : 14 + (q % 5) * 2); if (kind === "snow") p[q * 3] += Math.sin(t * 1.3 + q) * dt * .6; if (p[q * 3 + 1] < 0) p[q * 3 + 1] = 16; }
            geo.attributes.position.needsUpdate = true;
            cloud.position.x = s.x + Math.sin(t * .3) * .8;
            if (bolt) {
              nextFlash -= dt;
              if (nextFlash <= 0) { nextFlash = 6 + Math.random() * 10; flashT = .22; sfx("thunder"); }
              if (flashT > 0) { flashT -= dt; var on = Math.floor(flashT * 40) % 2 === 0; bolt.material.opacity = on ? 1 : .2; cmat.emissive.set(on ? "#cfd8ff" : "#000000"); }
              else { bolt.material.opacity = 0; cmat.emissive.set("#000000"); }
            }
          });
        }
        function addFlock() {
          var g = new THREE.Group(), birds = [], count = 5 + Math.floor(Math.random() * 3);
          var bmat = new THREE.MeshBasicMaterial({ color: isDark() ? 0xdde3f0 : 0x2a3350 });
          for (var i = 0; i < count; i++) {
            var b = new THREE.Group();
            [-1, 1].forEach(function (side) { var w = new THREE.Mesh(new THREE.BoxGeometry(1.1, .05, .3), bmat); w.position.x = side * .55; w.userData.side = side; b.add(w); });
            b.position.set((i % 2 ? 1 : -1) * Math.ceil(i / 2) * 1.6, -Math.ceil(i / 2) * .3, -Math.ceil(i / 2) * 1.4); g.add(b); birds.push(b);
          }
          var R = WORLD_R * (.5 + Math.random() * .5), H = 22 + Math.random() * 10, ang = Math.random() * Math.PI * 2, speed = (.08 + Math.random() * .05) * (Math.random() < .5 ? 1 : -1);
          world.add(g);
          updaters.push(function (t, dt) {
            ang += speed * dt; g.position.set(Math.cos(ang) * R, H + Math.sin(t * .7) * 1.5, Math.sin(ang) * R);
            g.rotation.y = Math.atan2(-Math.sin(ang) * speed, Math.cos(ang) * speed) ;
            birds.forEach(function (b, i) { b.children.forEach(function (w) { w.rotation.z = w.userData.side * Math.sin(t * 9 + i) * .6; }); });
          });
        }
        function addFireflies(s) {
          var n = 7 + Math.floor(Math.random() * 5), geo = new THREE.BufferGeometry(), arr = new Float32Array(n * 3), seeds = [];
          for (var i = 0; i < n; i++) seeds.push({ a: Math.random() * Math.PI * 2, d: 2 + Math.random() * 7, h: 1 + Math.random() * 2.5, p: Math.random() * 10 });
          geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
          var mat = new THREE.PointsMaterial({ color: 0xfff1a8, size: .28, transparent: true, opacity: .9, fog: false });
          world.add(new THREE.Points(geo, mat));
          updaters.push(function (t) {
            for (var i = 0; i < n; i++) { var sd = seeds[i], a = sd.a + t * .25 + Math.sin(t * .7 + sd.p) * .5; arr[i * 3] = s.x + Math.cos(a) * (sd.d + Math.sin(t + sd.p) * .8); arr[i * 3 + 1] = sd.h + Math.sin(t * 1.6 + sd.p) * .5; arr[i * 3 + 2] = s.z + Math.sin(a) * (sd.d + Math.cos(t * .9 + sd.p) * .8); }
            geo.attributes.position.needsUpdate = true; mat.opacity = (isDark() ? .5 : .3) + .4 * Math.abs(Math.sin(t * 2.2));
          });
        }
        function addBugs(s) {
          var bugs = [], n = 3 + Math.floor(Math.random() * 3), bmat = M("#2a2420", { roughness: .6 });
          for (var i = 0; i < n; i++) {
            var b = new THREE.Mesh(new THREE.SphereGeometry(.16, 6, 5), bmat); b.scale.set(1, .6, 1.5);
            var a = Math.random() * Math.PI * 2, d = Math.random() * R_ISLE * .6; b.position.set(s.x + Math.cos(a) * d, .1, s.z + Math.sin(a) * d); world.add(b);
            bugs.push({ m: b, h: Math.random() * Math.PI * 2, turn: 0, pause: Math.random() * 2 });
          }
          updaters.push(function (t, dt) {
            bugs.forEach(function (bug) {
              bug.pause -= dt; if (bug.pause > 0) return;
              bug.turn -= dt; if (bug.turn <= 0) { bug.turn = .8 + Math.random() * 2; bug.h += (Math.random() - .5) * 1.6; if (Math.random() < .25) bug.pause = .5 + Math.random() * 1.5; }
              var nx = bug.m.position.x + Math.sin(bug.h) * dt * 1.1, nz = bug.m.position.z + Math.cos(bug.h) * dt * 1.1;
              if (Math.hypot(nx - s.x, nz - s.z) > R_ISLE * .7) { bug.h += Math.PI; return; }
              bug.m.position.x = nx; bug.m.position.z = nz; bug.m.rotation.y = bug.h;
            });
          });
        }
      })();

      CH.forEach(function (s) {
        (THEMES[s.scenery] || THEMES.plain)(s);
        var act = s.data.activity; s.task = null;
        if (act && PROPMAP[act.type]) PROPS[PROPMAP[act.type]](s, act);
      });
      refreshWorld();
    }
    function segDist(px, pz, b) { var vx = b.bx - b.ax, vz = b.bz - b.az; var t = ((px - b.ax) * vx + (pz - b.az) * vz) / (vx * vx + vz * vz); t = Math.max(0, Math.min(1, t)); return Math.hypot(px - (b.ax + vx * t), pz - (b.az + vz * t)); }
    function walkable(x, z) {
      for (var i = 0; i < islands.length; i++) if (Math.hypot(x - islands[i].x, z - islands[i].z) < islands[i].r - .9) return true;
      for (var j = 0; j < bridges.length; j++) if (segDist(x, z, bridges[j]) < 1.3) return true;
      return false;
    }
    var marker = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 4), glow("#ffd76a", .9)); marker.rotation.x = Math.PI; scene.add(marker);
    function refreshWorld() {
      CH.forEach(function (s) { var done = isDone(s), next = s === goal; s.isNext = next; s.beaconBase = done ? .36 : next ? .3 : .04; s.label.material.opacity = (done || next) ? 1 : .6; });
      crown.forEach(function (c) { var on = isDone(c.s); c.p.material.color.set(on ? c.s.color : "#8a93a8"); c.p.material.emissive.set(on ? c.s.color : "#000000"); c.p.material.emissiveIntensity = on ? .6 : 0; });
      var all = CH.every(isDone); obelisk.material.emissive.set(all ? "#ffffff" : "#222222"); obelisk.material.emissiveIntensity = all ? .6 : .4;
    }

    var mctx = mini.getContext("2d");
    function drawMini(t) {
      if (!mctx) return; var MW = mini.width, cx = MW / 2, k = MW / 2 / (WORLD_R + 4); mctx.clearRect(0, 0, MW, MW);
      var ink = css("--ink") || "#17203d", sand = css("--sand") || "#e3cf9f", tgt = goal;
      mctx.strokeStyle = ink; mctx.globalAlpha = .35; mctx.lineWidth = Math.max(2, 5 * k / .9); mctx.lineCap = "round";
      bridges.forEach(function (b) { mctx.beginPath(); mctx.moveTo(cx + b.ax * k, cx - b.az * k); mctx.lineTo(cx + b.bx * k, cx - b.bz * k); mctx.stroke(); });
      mctx.globalAlpha = 1;
      var isle = function (x, z, r, fill, stroke) { mctx.beginPath(); mctx.arc(cx + x * k, cx - z * k, Math.max(2.5, r * k), 0, Math.PI * 2); mctx.fillStyle = fill; mctx.fill(); if (stroke) { mctx.lineWidth = 3; mctx.strokeStyle = stroke; mctx.stroke(); } };
      isle(0, 0, R_HUB, sand, CH.every(isDone) ? "#ffd76a" : null);
      CH.forEach(function (s) { var done = !!isDone(s); isle(s.x, s.z, R_ISLE, done ? s.color : sand, s.isNext ? "#ffd76a" : null); if (!done && !s.isNext) { mctx.globalAlpha = .35; isle(s.x, s.z, R_ISLE, ink, null); mctx.globalAlpha = 1; } });
      if (tgt === "hub" && S.mode !== "report") { mctx.beginPath(); mctx.arc(cx, cx, 5 + Math.sin(t * 4) * 2, 0, Math.PI * 2); mctx.fillStyle = "#ffd76a"; mctx.fill(); }
      var pp = player.position; mctx.save(); mctx.translate(cx + pp.x * k, cx - pp.z * k); mctx.rotate(Math.PI - yaw);
      mctx.fillStyle = ink; mctx.beginPath(); mctx.moveTo(0, -9); mctx.lineTo(6, 6); mctx.lineTo(0, 3); mctx.lineTo(-6, 6); mctx.closePath(); mctx.fill(); mctx.restore();
    }


    /* ======================================================================
       Field tasks: the in-world activity types, played on the island by
       walking. A wrong move is scored by the core like a wrong answer.
       ====================================================================== */
    var active = null, notes = [];
    function miss(s, note, msg) { notes.push(note); core.mistake(s.idx, 1, note); toast(msg || note); guideKey = ""; }
    function fieldDone(s, delay) {
      if (active !== s) return;
      active = null; burst(s.x, 4, s.z, s.color, 80); roboJump = 1;
      setTimeout(function () { core.reached(s.idx, notes.slice()); }, delay || 700);
    }
    function choosePad(s, pad) {
      if (active !== s || pad.wrong) return;
      if (pad.id === s.task.answer) { pad.ring.material.emissiveIntensity = 1; fieldDone(s); return; }
      pad.wrong = true; pad.mesh.material.color.set("#8a93a8");
      var right = s.task.pads.filter(function (pd) { return pd.id === s.task.answer; })[0];
      miss(s, pad.label + ": " + (pad.why || "not the answer."), (pad.why || "Not this one.") + (STRICT ? "" : " The right pad is lit: " + right.label + "."));
      if (!STRICT) right.ring.material.emissiveIntensity = 1.4;
    }
    function chooseFork(s, path) {
      if (active !== s) return;
      if (path.id === s.task.answer) { path.gate.material.emissiveIntensity = 1; fieldDone(s); return; }
      var right = s.task.paths.filter(function (pt) { return pt.id === s.task.answer; })[0];
      miss(s, path.label + ": " + (path.hint || "not that way."), (path.hint || "Not that way.") + (STRICT ? " Back to the signpost." : " The right gate glows: " + right.label + "."));
      if (!STRICT) right.gate.material.emissiveIntensity = 1.4;
      player.position.set(s.task.home.x, 0, s.task.home.z); robo.position.set(s.task.home.x, 0, s.task.home.z + 1.5); s.task.cool = .8;
    }
    function applyBeacon(s, it, on) { it.on = on; it.flame.visible = on; it.bowl.material = on ? glow(s.color, .6) : stoneMat; }
    function setBeacon(s, it, on) { if (active !== s) return; applyBeacon(s, it, on); sfx(on ? "pick" : "step"); guideKey = ""; }
    function checkBeacons(s) {
      if (active !== s) return; var task = s.task;
      var wrong = task.items.filter(function (it) { return it.on !== it.want; });
      if (!wrong.length) { task.items.forEach(function (it) { if (it.on) burst(it.x, 3, it.z, s.color, 30); }); fieldDone(s); return; }
      if (STRICT) { miss(s, wrong.length + " beacons wrong", wrong.length + " beacon" + (wrong.length > 1 ? "s are" : " is") + " wrong. Change them and check again."); return; }
      wrong.forEach(function (it) { notes.push(it.label + (it.want ? " should be lit." : " should stay dark.")); applyBeacon(s, it, it.want); });
      core.mistake(s.idx, wrong.length, wrong.length + " beacons wrong");
      toast(wrong.length + " beacon" + (wrong.length > 1 ? "s were" : " was") + " wrong. They show the right way now."); fieldDone(s, 1600);
    }
    function dropOrb(s) {
      var task = s.task, it = task.carrying, bin = task.nearBin; if (!it || !bin || active !== s) return;
      if (it.bin === bin.id) {
        task.carrying = null; carryGroup.remove(it.mesh); binItem(s, it, bin); sfx("pick"); burst(bin.x, 2, bin.z, s.color, 30); guideKey = "";
        if (task.sorted >= task.total) fieldDone(s); else toast("Yes! " + it.label + " goes in " + bin.label + ". " + (task.total - task.sorted) + " to go.");
      } else {
        var good = task.bins.filter(function (b) { return b.id === it.bin; })[0];
        miss(s, it.label + " belongs in " + good.label + ".", it.label + " doesn't belong in " + bin.label + "." + (STRICT ? " Try another bin." : " It goes in " + good.label + "."));
      }
    }
    function binItem(s, it, bin) {
      var task = s.task; it.where = "binned"; task.sorted++; bin.count++;
      it.mesh.position.set(bin.mesh.position.x + ((bin.count % 3) - 1) * .6, 1.5 + Math.floor((bin.count - 1) / 3) * .5, bin.mesh.position.z); s.g.add(it.mesh);
    }
    /* per frame, while the learner stands on the active island */
    function fieldTick(near, pp, t, dt) {
      var task = near.task;
      if (task.type === "collect") {
        task.items.forEach(function (it) {
          if (it.got || Math.hypot(pp.x - it.x, pp.z - it.z) >= 1.4) return;
          it.got = true; near.g.remove(it.mesh); near.g.remove(it.tag); task.collected++; if (near.pulse) near.pulse(); sfx("pick"); burst(it.x, 1.5, it.z, near.color, 30); guideKey = "";
          if (task.collected >= task.total) { sfx("win"); toast("All " + task.total + " collected!"); fieldDone(near); }
        });
      } else if (task.type === "pad") {
        var on = null; task.pads.forEach(function (pd) { var hit = Math.hypot(pp.x - pd.x, pp.z - pd.z) < 1.9; pd.mesh.material.emissiveIntensity += ((hit ? .7 : 0) - pd.mesh.material.emissiveIntensity) * .2; if (hit) on = pd; });
        if (on !== task.onPad) { task.onPad = on; guideKey = ""; if (on) sfx("step"); }
      } else if (task.type === "steps") {
        var st = null; task.pads.forEach(function (pd) { if (Math.hypot(pp.x - pd.x, pp.z - pd.z) < 1.6) st = pd; });
        if (st !== task.standing) {
          task.standing = st;
          if (st && !st.ok) {
            var want = task.pads.filter(function (pd) { return pd.id === task.order[task.pos]; })[0];
            if (st === want) { st.ok = true; task.pos++; st.mesh.material.emissiveIntensity = .8; st.ring.material.emissiveIntensity = 1; sfx("pick"); burst(st.x, 1.5, st.z, near.color, 20); guideKey = ""; if (task.pos >= task.order.length) fieldDone(near); }
            else {
              miss(near, "Step " + (task.pos + 1) + " is " + want.label + ", not " + st.label + ".", st.label + " is not next." + (STRICT ? " Start again from the first step." : " Next is " + want.label + ": it is lit."));
              if (STRICT) { task.pos = 0; task.pads.forEach(function (pd) { pd.ok = false; pd.mesh.material.emissiveIntensity = 0; pd.ring.material.emissiveIntensity = .5; }); }
              else want.ring.material.emissiveIntensity = 1.4;
            }
          }
        }
      } else if (task.type === "beacons") {
        var nb = null, nd = 2.4; task.items.forEach(function (it) { var d = Math.hypot(pp.x - it.x, pp.z - it.z); if (d < nd) { nd = d; nb = it; } });
        if (nb !== task.near) { task.near = nb; guideKey = ""; }
      } else if (task.type === "gather") {
        if (!task.carrying) task.items.forEach(function (it) { if (task.carrying || it.where !== "ground" || Math.hypot(pp.x - it.x, pp.z - it.z) >= 1.4) return; it.where = "carried"; task.carrying = it; near.g.remove(it.mesh); near.g.remove(it.tag); it.mesh.position.set(0, 0, 0); carryGroup.add(it.mesh); sfx("pick"); guideKey = ""; toast("Picked up " + it.label + ". Carry it to the right bin."); });
        var bn = null, bd = 2.8; task.bins.forEach(function (b) { var d = Math.hypot(pp.x - b.x, pp.z - b.z); if (d < bd) { bd = d; bn = b; } });
        if (bn !== task.nearBin) { task.nearBin = bn; guideKey = ""; }
        if (task.carrying && !settings.reduced) { task.carrying.mesh.rotation.y = t * 2; task.carrying.mesh.position.y = Math.sin(t * 3) * .1; }
      } else if (task.type === "fork") {
        if (task.cool > 0) { task.cool -= dt; return; }
        task.paths.forEach(function (pt) { if (Math.hypot(pp.x - pt.x, pp.z - pt.z) < 1.7 && task.cool <= 0) chooseFork(near, pt); });
      }
    }

    /* ---------- walking over the causeway graph ---------- */
    var auto = null, faceTarget = null, goal = null, arrived = null;
    function landNodes(pp) {
      for (var i = 0; i < CH.length; i++) { var s = CH[i]; if (Math.hypot(pp.x - s.x, pp.z - s.z) < R_ISLE) return s.nodes; }
      if (Math.hypot(pp.x, pp.z) < R_HUB) return hubRing.map(function (h) { return h.node; });
      var best = null, bd = 1e9;
      for (var j = 0; j < bridges.length; j++) { var d = segDist(pp.x, pp.z, bridges[j]); if (d < bd) { bd = d; best = bridges[j]; } }
      if (best && best.nodes) return best.nodes;
      return nodes.map(function (_, k) { return k; });
    }
    function nearestOf(list, pp) { var best = list[0], bd = 1e9; list.forEach(function (n) { var d = Math.hypot(nodes[n].x - pp.x, nodes[n].z - pp.z); if (d < bd) { bd = d; best = n; } }); return best; }
    function dijkstra(src, targets) {
      var dist = nodes.map(function () { return Infinity; }), prev = nodes.map(function () { return -1; }), seen = nodes.map(function () { return false; });
      dist[src] = 0;
      for (;;) {
        var u = -1, ud = Infinity; for (var i = 0; i < nodes.length; i++) if (!seen[i] && dist[i] < ud) { ud = dist[i]; u = i; }
        if (u === -1) break; seen[u] = true;
        adj[u].forEach(function (e) { var nd = ud + e.w; if (nd < dist[e.to]) { dist[e.to] = nd; prev[e.to] = u; } });
      }
      var end = targets[0]; targets.forEach(function (t) { if (dist[t] < dist[end]) end = t; });
      var path = []; for (var v = end; v !== -1; v = prev[v]) path.unshift(v); return path;
    }
    function buildRoute(target) {
      var pp = player.position, src = nearestOf(landNodes(pp), pp);
      var targets = target === "hub" ? hubRing.map(function (h) { return h.inner; }) : [target.arrive];
      var path = dijkstra(src, targets);
      return path.map(function (n) { return { x: nodes[n].x, z: nodes[n].z }; });
    }
    function startWalk(target) { var pts = buildRoute(target); auto = { pts: pts, target: target, speed: Math.min(16, 9 + pts.length * .4) }; guideKey = ""; sfx("open"); }
    function stopWalk() { if (auto) { auto = null; guideKey = ""; } }
    function goalPlace() { return goal === "hub" ? { x: 0, z: 0 } : { x: goal.x, z: goal.z }; }
    /* the learner reached the place the core is waiting for */
    function checkArrival() {
      if (!arrived || auto || core.panelOpen() || core.overlayOpen() || S.paused) return;
      var at = goal === "hub" ? nearby === "summit" : nearby === goal;
      if (!at) return;
      var fn = arrived; arrived = null; faceTarget = goalPlace();
      if (goal === "hub" && chunk < chunkOf(S.k) && S.k < N) { sail(chunkOf(S.k), fn); return; }
      setTimeout(fn, 250);
    }
    /* the harbour of an archipelago: the next islands are built and the learner lands at their hub */
    function sail(c, then) {
      fade(true); toast("Setting sail for the next islands…");
      setTimeout(function () { buildWorld(c); player.position.set(0, 0, 6.5); robo.position.set(0, 0, 8.2); fade(false); goal = S.k < N ? STATIONS[S.k] : "hub"; arrived = then; guideKey = ""; }, 600);
    }

    /* ---------- the guide: one line at the bottom says where to go and what to do ---------- */
    var guideKey = "", guidePrimary = null, arrowTarget = null, nearby = null;
    function setGuide(small, big, actions, accent, arrow) {
      core.showCallout(small, null, big);
      actions.forEach(function (a, i) { var b = el("button", { type: "button", text: a.label }); if (i) b.className = "nthview-alt"; b.addEventListener("click", a.fn); core.cAct.appendChild(b); });
      guidePrimary = actions[0] ? actions[0].fn : null;
      core.callout.style.setProperty("--accent", accent);
      arrowTarget = arrow; gArrow.classList.toggle("nthview-hidden", !arrow);
    }
    function reviewIsland(s) {
      var r = S.results[s.idx];
      core.page("Island " + (s.idx + 1) + " · done " + starsText(r.stars), s.name);
      core.pbody.appendChild(p("nthview-lead", s.data.lead)); (s.data.body || []).forEach(function (t) { core.pbody.appendChild(p("", t)); });
      var rem = el("div", { class: "nthview-remember" }, [el("p", { class: "nthview-box-title", text: "Remember" })]); rem.appendChild(p("", s.data.remember)); core.pbody.appendChild(rem);
      core.actions([primaryBtn("Back to the islands", core.closePanel), keyHint("Enter")]);
      core.openPanel(false, "Island " + (s.idx + 1));
    }
    function fieldGuide(here, task) {
      switch (task.type) {
        case "pad": return { key: "pad" + (task.onPad ? task.onPad.id : ""), small: task.onPad ? "Standing on the pad" : "Stand on a pad to choose", big: task.onPad ? task.onPad.label : here.data.activity.prompt, actions: task.onPad ? [{ label: "Choose this one", fn: function () { choosePad(here, task.onPad); } }] : [] };
        case "collect": return { key: "collect" + task.collected, small: "Collected: " + task.collected + " of " + task.total, big: task.collected ? "Keep going, walk into the rest" : "Walk into every orb", actions: [] };
        case "steps": return { key: "steps" + task.pos, small: "In order: " + task.pos + " of " + task.order.length, big: task.pos ? "Which pad comes next?" : "Step on the pads in the right order", actions: [] };
        case "beacons":
          var lit = task.items.filter(function (it) { return it.on; }).length, acts = [];
          if (task.near) acts.push({ label: (task.near.on ? "Put out " : "Light ") + task.near.label, fn: function () { setBeacon(here, task.near, !task.near.on); } });
          if (lit) acts.push({ label: "Check the beacons", fn: function () { checkBeacons(here); } });
          return { key: "beacons" + lit + (task.near ? task.near.id + task.near.on : ""), small: lit + " beacon" + (lit === 1 ? "" : "s") + " lit", big: task.near ? task.near.label : "Walk up to a beacon", actions: acts };
        case "gather":
          if (task.carrying && task.nearBin) return { key: "drop" + task.nearBin.id, small: "Carrying " + task.carrying.label, big: "Drop it into " + task.nearBin.label + "?", actions: [{ label: "Drop it here", fn: function () { dropOrb(here); } }] };
          if (task.carrying) return { key: "carry", small: "Carrying " + task.carrying.label, big: "Walk to the right bin", actions: [] };
          return { key: "gather" + task.sorted, small: "Sorted: " + task.sorted + " of " + task.total, big: "Walk into an orb to pick it up", actions: [] };
        case "fork": return { key: "fork", small: "At the fork", big: "Walk through the gate you choose", actions: [] };
      }
      return null;
    }
    function updateGuide() {
      var show = S.mode !== "intro" && S.mode !== "report" && !core.panelOpen() && !core.overlayOpen();
      if (!show) { if (guideKey) { core.hideCallout(); guideKey = ""; } return; }
      var here = nearby && nearby !== "summit" ? nearby : null, tgt = goal, toHub = tgt === "hub";
      var tName = toHub ? (lastChunk() ? data.finale.name : "The harbour") : tgt ? tgt.name : "", tPos = tgt ? goalPlace() : null, tColor = toHub || !tgt ? "#ffd76a" : tgt.color;
      var fg = active && here === active && !auto ? fieldGuide(here, active.task) : null;
      var mode = auto ? "walking" : fg ? "field" : arrived ? (here && isDone(here) && here !== tgt ? "at-done" : here && !isUnlocked(here) ? "at-locked" : "go") : here && isDone(here) ? "at-done" : "idle";
      var key = mode + "|" + tName + "|" + (here ? here.id : String(nearby)) + "|" + (fg ? fg.key : "") + S.mode;
      if (key === guideKey) { pointArrow(); return; }
      guideKey = key;
      var walkBtn = { label: "Walk me there", fn: function () { startWalk(tgt); } };
      var next = toHub ? (lastChunk() ? "The summit" : "To the next islands") : tgt ? "Next up: island " + (tgt.idx + 1) + " of " + N : "";
      if (mode === "walking") setGuide("On the way to", auto.target === "hub" ? tName : auto.target.name, [{ label: "Stop walking", fn: stopWalk }], auto.target === "hub" ? "#ffd76a" : auto.target.color, null);
      else if (mode === "field") setGuide(fg.small, fg.big, fg.actions, here.color, null);
      else if (mode === "at-done") setGuide("Island " + (here.idx + 1) + ", done " + starsText(S.results[here.idx].stars), here.name, (tgt ? [walkBtn] : []).concat([{ label: "Read it again", fn: function () { reviewIsland(here); } }]), here.color, tPos);
      else if (mode === "at-locked") setGuide("Not open yet", "Finish island " + (S.k + 1) + " first", [walkBtn], tColor, tPos);
      else if (mode === "go") setGuide(next, tName, [walkBtn], tColor, tPos);
      else if (S.mode === "finaleplay" || S.mode === "end") setGuide(data.finale.name, "Answer at the summit", [], "#ffd76a", null);
      else setGuide(hero + " is exploring", "Walk on when you are ready", [], "#ffd76a", null);
      pointArrow();
    }
    function pointArrow() {
      if (!arrowTarget) return;
      var pp = player.position, ta = Math.atan2(arrowTarget.x - pp.x, arrowTarget.z - pp.z), fa = Math.atan2(-Math.sin(yaw), -Math.cos(yaw)), rel = fa - ta;
      rel = Math.atan2(Math.sin(rel), Math.cos(rel)); gSvg.style.transform = "rotate(" + rel + "rad)";
    }

    /* ---------- input: keys and stick move, drag looks, a tap walks to an island ---------- */
    var keys = {};
    var MOVE_KEYS = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
    function canWalk() { return S.mode !== "intro" && S.mode !== "report" && !core.panelOpen() && !core.overlayOpen() && !S.paused; }
    function onKey(e, k) {
      if (!canWalk()) return false;
      if (MOVE_KEYS.indexOf(k) !== -1) { keys[k] = true; return true; }
      if ((k === "e" || k === "enter") && guidePrimary && e.target.tagName !== "BUTTON") { guidePrimary(); return true; }
      return false;
    }
    function onBlur() { keys = {}; }
    root.addEventListener("blur", onBlur);
    var drag = null, raycaster = new THREE.Raycaster(), ndc = new THREE.Vector2();
    canvas.addEventListener("pointerdown", function (e) { drag = { id: e.pointerId, x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY }; canvas.setPointerCapture(e.pointerId); canvas.focus({ preventScroll: true }); });
    canvas.addEventListener("pointermove", function (e) { if (!drag || drag.id !== e.pointerId) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; yaw -= dx * .006; pitch = Math.max(.05, Math.min(1.1, pitch + dy * .004)); });
    var ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), groundHit = new THREE.Vector3();
    function clickScene(e) {
      if (!canWalk()) return;
      var r = canvas.getBoundingClientRect(); ndc.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(ndc, camera);
      if (!raycaster.ray.intersectPlane(ground, groundHit)) return;
      var gx = groundHit.x, gz = groundHit.z, tapped = null;
      for (var i = 0; i < CH.length; i++) if (Math.hypot(gx - CH[i].x, gz - CH[i].z) < R_ISLE) { tapped = CH[i]; break; }
      if (!tapped && Math.hypot(gx, gz) < R_HUB) tapped = "hub";
      if (!tapped || tapped === nearby || (tapped === "hub" && nearby === "summit")) return;
      if (tapped === "hub") { if (goal === "hub") startWalk("hub"); else toast(lastChunk() ? data.finale.name + " opens after the last island." : "The harbour opens after the last island here."); return; }
      if (isUnlocked(tapped)) startWalk(tapped); else toast(tapped.name + " opens after island " + (S.k + 1) + ".");
    }
    var endDrag = function (e) { if (drag && drag.id === e.pointerId) { if (e.type === "pointerup" && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) < 6) clickScene(e); drag = null; } };
    canvas.addEventListener("pointerup", endDrag); canvas.addEventListener("pointercancel", endDrag);
    var joyVec = { x: 0, y: 0 }, joyId = null;
    function joyMove(e) { var r = joy.getBoundingClientRect(); var x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2); var l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } joyVec.x = x; joyVec.y = y; knob.style.transform = "translate(" + x * 36 + "px," + y * 36 + "px)"; }
    joy.addEventListener("pointerdown", function (e) { joyId = e.pointerId; joy.setPointerCapture(e.pointerId); joyMove(e); });
    joy.addEventListener("pointermove", function (e) { if (e.pointerId === joyId) joyMove(e); });
    var joyEnd = function (e) { if (e.pointerId !== joyId) return; joyId = null; joyVec.x = joyVec.y = 0; knob.style.transform = ""; };
    joy.addEventListener("pointerup", joyEnd); joy.addEventListener("pointercancel", joyEnd);

    /* ---------- loop ---------- */
    var clock = new THREE.Clock(), frame = 0, camTarget = new THREE.Vector3(), alive = true, rafId = 0, lastSave = 0;
    function tick() {
      rafId = 0;
      if (!alive || !canvas.isConnected) { alive = false; renderer.dispose(); root.removeEventListener("blur", onBlur); doc.removeEventListener("visibilitychange", onVisibility); return; }
      var dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime; frame++;
      if (S.paused) { rafId = root.requestAnimationFrame(tick); return; }
      var pp = player.position, mx = 0, mz = 0;
      if (canWalk()) {
        var f = 0, r = 0;
        if (keys.w || keys.arrowup) f += 1; if (keys.s || keys.arrowdown) f -= 1;
        if (keys.a) r -= 1; if (keys.d) r += 1;
        if (keys.arrowleft) yaw += dt * 2.2; if (keys.arrowright) yaw -= dt * 2.2;
        f += -joyVec.y; r += joyVec.x;
        var len = Math.hypot(f, r);
        if (len > .15 && auto) stopWalk();
        if (auto) {
          var w = auto.pts[0];
          if (!w) { auto = null; guideKey = ""; }
          else {
            var dx = w.x - pp.x, dz = w.z - pp.z, d = Math.hypot(dx, dz), step = auto.speed * dt;
            if (d <= step) { pp.x = w.x; pp.z = w.z; auto.pts.shift(); if (!auto.pts.length) { var tg = auto.target; auto = null; guideKey = ""; faceTarget = tg === "hub" ? { x: 0, z: 0 } : { x: tg.x, z: tg.z }; } }
            else { mx = dx / d * step; mz = dz / d * step; pp.x += mx; pp.z += mz; var want = Math.atan2(-mx, -mz); var dy = want - yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); yaw += dy * Math.min(1, dt * 2.5); }
          }
        } else if (len > .05) {
          faceTarget = null;
          var nn = Math.min(1, len); f /= len; r /= len;
          var spd = 11 * nn * dt, fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
          mx = (fx * f + rx * r) * spd; mz = (fz * f + rz * r) * spd;
          if (walkable(pp.x + mx, pp.z + mz)) { pp.x += mx; pp.z += mz; } else if (walkable(pp.x + mx, pp.z)) { pp.x += mx; mz = 0; } else if (walkable(pp.x, pp.z + mz)) { pp.z += mz; mx = 0; } else { mx = mz = 0; }
        }
      }
      var moving = !!(mx || mz);
      if (moving) { var targ = Math.atan2(mx, mz); var dd = targ - player.rotation.y; dd = Math.atan2(Math.sin(dd), Math.cos(dd)); player.rotation.y += dd * Math.min(1, dt * 10); body.position.y = 1.1 + Math.abs(Math.sin(t * 9)) * .12; }
      else body.position.y += (1.1 + Math.sin(t * 2) * .06 - body.position.y) * .1;
      /* after a walk, turn the hero and the camera to face the island centre */
      if (faceTarget && !auto && !moving) {
        var fx2 = faceTarget.x - pp.x, fz2 = faceTarget.z - pp.z;
        if (Math.hypot(fx2, fz2) > .5) {
          var wantFace = Math.atan2(fx2, fz2), dFace = Math.atan2(Math.sin(wantFace - player.rotation.y), Math.cos(wantFace - player.rotation.y));
          var wantYaw = Math.atan2(-fx2, -fz2), dYaw = Math.atan2(Math.sin(wantYaw - yaw), Math.cos(wantYaw - yaw));
          player.rotation.y += dFace * Math.min(1, dt * 6); yaw += dYaw * Math.min(1, dt * 3);
          if (Math.abs(dFace) < .01 && Math.abs(dYaw) < .01) faceTarget = null;
        } else faceTarget = null;
      }
      halo.rotation.z = t * 1.5;
      var bx = -Math.sin(player.rotation.y) * 1.9, bz = -Math.cos(player.rotation.y) * 1.9, tx = pp.x + bx, tz = pp.z + bz, rdx = tx - robo.position.x, rdz = tz - robo.position.z, rd = Math.hypot(rdx, rdz);
      if (rd > .05) { var rk = Math.min(1, dt * (rd > 6 ? 8 : 3.5)); robo.position.x += rdx * rk; robo.position.z += rdz * rk; var rw = Math.atan2(rdx, rdz) - robo.rotation.y; robo.rotation.y += Math.atan2(Math.sin(rw), Math.cos(rw)) * Math.min(1, dt * 6); }
      if (roboJump > 0) { roboJump = Math.max(0, roboJump - dt * 1.2); robo.position.y = Math.abs(Math.sin(roboJump * Math.PI * 3)) * 1.2 * roboJump; } else robo.position.y = rd > .6 && !settings.reduced ? Math.abs(Math.sin(t * 10)) * .15 : 0;
      robo.userData.tip.material.emissiveIntensity = .6 + .4 * Math.sin(t * 4);
      coinPickups.forEach(function (c, ci) {
        if (c.got) return; c.mesh.rotation.z = t * 2.4; c.mesh.position.y = 1.2 + Math.sin(t * 3 + c.x) * .12;
        if (Math.hypot(pp.x - c.x, pp.z - c.z) < 1.3) { c.got = true; world.remove(c.mesh); coinsGot.push(ci); S.coins++; core.renderScore(); persist(); sfx("coin"); burst(c.x, 1.4, c.z, "#f4c55b", 25); }
      });
      var near = null;
      if (Math.hypot(pp.x, pp.z) < 5) near = "summit";
      else for (var i = 0; i < CH.length; i++) if (Math.hypot(pp.x - CH[i].x, pp.z - CH[i].z) < R_ISLE) { near = CH[i]; break; }
      if (near !== nearby) { nearby = near; guideKey = ""; }
      if (active && near === active && canWalk()) fieldTick(near, pp, t, dt);
      checkArrival();
      updateGuide();
      if (S.mode !== "intro" && Date.now() - lastSave > 2500) { lastSave = Date.now(); persist(); }
      var dist = 10.5; camTarget.set(pp.x, pp.y + 1.8, pp.z);
      camera.position.set(pp.x + Math.sin(yaw) * dist * Math.cos(pitch), pp.y + 1.8 + dist * Math.sin(pitch), pp.z + Math.cos(yaw) * dist * Math.cos(pitch));
      camera.lookAt(camTarget); dome.position.copy(camera.position);
      if (!settings.reduced) { for (var vi = 0; vi < seaPos.count; vi++) { var sx = seaPos.getX(vi), sy = seaPos.getY(vi); seaPos.setZ(vi, Math.sin(sx * .05 + t * .9) * .55 + Math.cos(sy * .07 + t * .7) * .45); } seaPos.needsUpdate = true; if (frame % 4 === 0) seaGeo.computeVertexNormals(); }
      obelisk.rotation.y = t * .4;
      var mp = goal ? goalPlace() : null;
      marker.visible = !!mp && S.mode !== "report";
      if (mp) marker.position.set(mp.x, (goal === "hub" ? 11.6 : 13.6) + (settings.reduced ? 0 : Math.sin(t * 2.5) * .5), mp.z);
      marker.rotation.y = t * 1.2;
      CH.forEach(function (s) { s.label.position.y = 10.5 + (settings.reduced ? 0 : Math.sin(t * 1.3 + s.angle) * .25); s.beacon.material.opacity = s.beaconBase + (s === goal && !settings.reduced ? Math.sin(t * 3) * .12 : 0); });
      updaters.forEach(function (u) { u(t, dt); }); skyUpdaters.forEach(function (u) { u(t, dt, pp); }); updateBursts(dt);
      if (frame % 3 === 0) drawMini(t);
      renderer.render(scene, camera);
      schedule();
    }
    function schedule() { if (!rafId && alive && !doc.hidden) rafId = root.requestAnimationFrame(tick); }
    function onVisibility() { if (doc.hidden) { core.saveNow(); if (rafId) { root.cancelAnimationFrame(rafId); rafId = 0; } } else { clock.getDelta(); schedule(); } }
    doc.addEventListener("visibilitychange", onVisibility);
    function onResize() { renderer.setSize(W(), H(), false); camera.aspect = W() / H(); camera.updateProjectionMatrix(); }
    if (root.ResizeObserver) new root.ResizeObserver(onResize).observe(container); else root.addEventListener("resize", onResize);
    var mq = root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)");
    if (mq) { if (mq.addEventListener) mq.addEventListener("change", applyTheme); else if (mq.addListener) mq.addListener(applyTheme); }

    /* planks and harvest are not played on the islands: they become cards with the same scoring */
    function asCard(a) {
      if (a.type === "harvest") return [{ type: "multi", title: a.title, question: a.prompt, options: a.items.map(function (o) { return { text: o.label, correct: o.belongs }; }) }];
      if (a.type === "planks") return a.planks.map(function (o, i) { return { type: "truefalse", title: i ? "True or false?" : a.prompt, statement: o.text, answer: o.answer, why: o.why }; });
      return [a];
    }
    /* what the level will ask, in words that suit the islands */
    function taskText(k) {
      var b = core.LV[k], s = b.data;
      if (b.type && core.inWorld(b.type)) return TYPE_HELP[b.type];
      return "Then a question about this lesson" + ((s.checks || []).length ? ", " + (1 + s.checks.length) + " in all" : "") + ".";
    }
    /* ---------- flow hooks ---------- */
    function lastChunk() { return chunk === NCH - 1; }
    var coinsGot = [], savedSpot = null;
    function enter(k, done) {
      notes = []; active = null;
      var c = k >= N ? NCH - 1 : chunkOf(k);
      goal = c !== chunk ? "hub" : k >= N ? "hub" : STATIONS[k]; arrived = done; guideKey = "";
      if (k > 0 && k < N && goal !== "hub") toast("Next: " + STATIONS[k].name + ". Walk there, or press “Walk me there”.");
    }
    function play(k) {
      var s = STATIONS[k];
      if (s.task && core.inWorld(s.type)) { active = s; notes = []; guideKey = ""; say(taskText(k)); return; }
      core.reached(k, []);
    }
    function solved(k) {
      var s = STATIONS[k]; refreshWorld(); burst(s.x, 5, s.z, s.color, 120); roboJump = 1; sfx("win");
      setTimeout(function () { core.showSolved(k); }, settings.reduced ? 300 : 1100);
    }
    function lightCrown(n) { crown.forEach(function (c, i) { if (i < n) { c.p.material.color.set("#ffd76a"); c.p.material.emissive.set("#ffd76a"); c.p.material.emissiveIntensity = .9; } }); }
    return {
      words: {
        level: "island", Level: "Island", finale: "The summit", finaleGo: "Begin", finaleAsk: "At the summit", cleared: "Island complete",
        lives: ["♥", "hearts", "Hearts"], outTitle: "Out of hearts!", outText: "The last heart is gone.",
        begin: "Begin", beginHint: "Enter",
        canvas: "3D islands. Use W A S D or the arrow keys to move and drag to look, or tap an island to walk there. The guide at the bottom walks you to the next lesson.",
        intro: [coarse ? "To move: use the stick at the bottom left, drag the scene to look around, or tap an island to walk there." : "To move: W A S D or the arrow keys, drag to look around, or click an island to walk there. P pauses.",
          "Every island holds one short lesson. Walk to the next one; the lesson waits until you have read it."],
        ask: function () { return "The island's challenge"; },
        askLead: function (k) { return "Show what you learned on " + STATIONS[k].name + "."; },
        finaleCap: function (n) { return n + " question" + (n > 1 ? "s" : "") + " at the summit. Each right answer lights part of the crown."; }
      },
      taskHelp: TYPE_HELP, worldTypes: WORLD_TYPES, sounds: SOUNDS, asCard: asCard,
      start: function (k) {
        buildWorld(k >= N ? NCH - 1 : chunkOf(k));
        if (savedSpot && savedSpot.c === chunk && walkable(savedSpot.x, savedSpot.z)) { player.position.set(savedSpot.x, 0, savedSpot.z); yaw = savedSpot.yaw; coinsGot.forEach(function (i) { var c = coinPickups[i]; if (c && !c.got) { c.got = true; world.remove(c.mesh); } }); }
        else coinsGot = [];
        robo.position.set(player.position.x, 0, player.position.z + 1.7);
        applyTheme(); onResize(); schedule();
      },
      enter: enter,
      ahead: function (k) { var b = box("On this island", "nthview-task"), t = p("", taskText(k)); t.style.margin = "0"; b.appendChild(t); return b; },
      play: play,
      solved: solved,
      finaleStart: function (next) { setTimeout(next, 400); },
      finaleStep: function (i, next) { lightCrown(Math.round(crown.length * (i + 1) / S.finale.list.length)); burst(0, 7, 0, "#ffd76a", 60); setTimeout(next, settings.reduced ? 200 : 700); },
      finaleEnd: function (next) { burst(0, 8, 0, "#ffd76a", 200); roboJump = 1; setTimeout(next, settings.reduced ? 300 : 1300); },
      wrong: function () { roboJump = .5; },
      ui: function () { guideKey = "x"; updateGuide(); joy.classList.toggle("nthview-hidden", core.panelOpen() || core.overlayOpen()); },
      score: function () { coinOut.textContent = String(S.coins); },
      reset: function () { S.coins = 0; coinsGot = []; buildWorld(0); player.position.set(0, 0, 6.5); },
      resume: function () { keys = {}; clock.getDelta(); },
      key: onKey, keyUp: function (e, k) { delete keys[k]; },
      pauseInfo: function () { return " · ◉ " + S.coins; },
      reportStats: function () { return [["◉ Coins", String(S.coins)]]; },
      save: function () { var pp = player.position; return { coins: S.coins, c: chunk, x: Math.round(pp.x * 100) / 100, z: Math.round(pp.z * 100) / 100, yaw: Math.round(yaw * 100) / 100, got: coinsGot.slice() }; },
      load: function (w) {
        if (typeof w.coins === "number" && w.coins >= 0 && w.coins < 1e6) S.coins = Math.floor(w.coins);
        if ([w.c, w.x, w.z, w.yaw].every(function (v) { return typeof v === "number" && isFinite(v); })) savedSpot = { c: w.c, x: w.x, z: w.z, yaw: w.yaw };
        if (Array.isArray(w.got)) coinsGot = w.got.filter(function (i) { return typeof i === "number" && i >= 0 && i < 1e4; });
      }
    };
  };
  NthView.engines.islands.css = CSS;
})(typeof globalThis !== "undefined" ? globalThis : window);
