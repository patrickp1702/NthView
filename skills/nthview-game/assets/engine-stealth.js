/* NthView — game engine stealth — schemaVersion 1
 * Seen from above, the hero sneaks through one room of patrolling guards per
 * level. The boss's secret box holds the level's question or a room task.
 * Registered on NthView.engines; needs assets/view.js (AGENTS.md §5.6).
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  NthView.engines = NthView.engines || {};

  var CSS = [
    ".nthview.nthview-game.nthview-eng-stealth{--display:\"Rubik\",\"Avenir Next\",\"Segoe UI\",system-ui,sans-serif;--body:\"Rubik\",\"Segoe UI\",system-ui,-apple-system,sans-serif;--gem:#49e3c3}",
    ".nthview.nthview-game.nthview-theme-bunker{--accent:#5c7a16;--accent-ink:#476010;--panel:rgba(250,251,246,.96);--panel-solid:#fafbf6;--chip:#eff2e6;--line:#dadfcc}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-game.nthview-theme-bunker{--accent:#b5d455;--accent-ink:#b5d455;--panel:rgba(22,25,17,.96);--panel-solid:#161911;--chip:#20251a;--line:#363d2a;--on-accent:#141a04}}",
    ".nthview.nthview-game.nthview-theme-lab{--accent:#0b8a8a;--accent-ink:#086a6a;--panel:rgba(247,252,252,.96);--panel-solid:#f7fcfc;--chip:#e8f3f3;--line:#cfe2e2}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-game.nthview-theme-lab{--accent:#5fe0d6;--accent-ink:#5fe0d6;--panel:rgba(13,24,26,.96);--panel-solid:#0d181a;--chip:#152528;--line:#27403f;--on-accent:#04201e}}",
    ".nthview.nthview-game.nthview-theme-rooftop{--accent:#6247d6;--accent-ink:#4a33b0;--panel:rgba(250,249,255,.96);--panel-solid:#faf9ff;--chip:#eeecfa;--line:#d9d5ef}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-game.nthview-theme-rooftop{--accent:#b0a2ff;--accent-ink:#b0a2ff;--panel:rgba(18,16,32,.96);--panel-solid:#121020;--chip:#1d1a33;--line:#322d55;--on-accent:#120c33}}",
    ".nthview .nthview-targets{display:flex;gap:3px;align-items:center;min-height:18px}",
    ".nthview .nthview-tgt{width:11px;height:11px;border-radius:50%;background:#ff5a4a;box-shadow:0 0 6px rgba(255,90,74,.7)}",
    ".nthview .nthview-tgt.nthview-bossdot{width:16px;height:16px;border-radius:4px;transform:rotate(45deg);background:var(--gold);box-shadow:0 0 8px rgba(255,200,61,.8);margin:0 2px}",
    ".nthview .nthview-tgt.nthview-down{background:rgba(255,255,255,.22);box-shadow:none}",
    ".nthview .nthview-hstats .nthview-gemc b{color:var(--gem)}",
    "@media (max-width:380px){.nthview .nthview-hstats{gap:5px;font-size:.7rem}.nthview .nthview-hright{padding:6px 7px}.nthview .nthview-hud{gap:6px;padding:8px 8px 0}.nthview .nthview-tgt{width:10px;height:10px}.nthview .nthview-tgt.nthview-bossdot{width:13px;height:13px}.nthview .nthview-toast{font-size:.86rem;padding:7px 12px}}",
    ".nthview .nthview-labels{position:absolute;inset:0;pointer-events:none;z-index:4}",
    ".nthview .nthview-spot{position:absolute;transform:translate(-50%,0);pointer-events:auto;max-width:86px;padding:2px 6px;border-radius:9px;background:rgba(8,11,17,.82);color:#fff;border:1.5px solid rgba(255,255,255,.35);font-size:.68rem;font-weight:700;line-height:1.15;text-align:center;overflow-wrap:anywhere}",
    ".nthview .nthview-spot.nthview-ok{border-color:#6fe39b;background:rgba(20,90,50,.9)}",
    ".nthview .nthview-spot.nthview-no{border-color:#ff7a6a;background:rgba(120,30,20,.9)}",
    ".nthview .nthview-spot.nthview-lit{border-color:var(--gold);color:var(--gold)}",
    ".nthview .nthview-spot.nthview-gone{opacity:.35}",
    ".nthview .nthview-spot:focus-visible{outline:3px solid #fff;outline-offset:2px}",
    ".nthview .nthview-alarm{position:absolute;left:10px;right:10px;top:94px;display:flex;gap:10px;align-items:center;justify-content:center;background:rgba(190,24,16,.88);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:12px;padding:6px 12px;font-size:.84rem;line-height:1.25;animation:nthview-alarm .7s ease-in-out infinite alternate;pointer-events:none}",
    ".nthview .nthview-alarm b{font-family:var(--display);font-weight:900;letter-spacing:.14em}",
    "@keyframes nthview-alarm{from{background:rgba(190,24,16,.9)}to{background:rgba(120,10,6,.75)}}",
    ".nthview-game.nthview-alarmed .nthview-grade{background:radial-gradient(ellipse 75% 70% at 50% 46%,transparent 48%,rgba(150,0,0,.6) 100%)}",
    ".nthview-game.nthview-alarmed .nthview-toast{top:150px}",
    ".nthview .nthview-squad{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}",
    ".nthview .nthview-gchip{display:inline-flex;align-items:center;gap:6px;background:var(--panel-solid);border:1px solid var(--line);border-radius:999px;padding:3px 10px 3px 5px;font-size:.84rem;font-weight:700}",
    ".nthview .nthview-gchip.nthview-gboss{border-color:var(--gold)}",
    ".nthview .nthview-gdot{width:16px;height:16px;border-radius:50%;border:3px solid;flex:none;display:inline-block;vertical-align:-3px}",
    ".nthview .nthview-gline{margin:6px 0!important;font-size:.93rem}",
    ".nthview .nthview-gline .nthview-gdot{margin-right:7px}",
    "@media (prefers-reduced-motion:reduce){.nthview .nthview-alarm{animation:none}}",
    ".nthview .nthview-powers{position:absolute;left:0;right:0;bottom:max(12px,env(safe-area-inset-bottom));display:flex;justify-content:center;gap:10px;pointer-events:none}",
    ".nthview .nthview-power{pointer-events:auto;position:relative;width:54px;height:54px;border-radius:50%;background:rgba(8,11,17,.6);border:2px solid rgba(255,255,255,.4);color:#fff;display:grid;place-items:center;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);padding:0}",
    ".nthview .nthview-power i{position:absolute;right:-4px;top:-4px;min-width:20px;height:20px;border-radius:10px;background:var(--gold);color:#1b1304;font-size:.72rem;font-weight:900;font-style:normal;display:grid;place-items:center;padding:0 5px}",
    ".nthview .nthview-power.nthview-armed{border-color:var(--gold);background:rgba(255,200,61,.3);box-shadow:0 0 14px rgba(255,200,61,.6)}",
    ".nthview .nthview-power.nthview-passive{border-style:dashed;cursor:default}",
    ".nthview .nthview-power.nthview-psel{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.35)}",
    ".nthview .nthview-power.nthview-psel.nthview-armed{border-color:var(--gold)}",
    "@media (max-width:400px){.nthview .nthview-powers{gap:6px}.nthview .nthview-power{width:46px;height:46px}}",
    ".nthview .nthview-hud :focus-visible,.nthview .nthview-powers :focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 7px rgba(0,0,0,.6)}",
    "@media (max-width:680px){body:has(.nthview-lesson-bar) .nthview-game .nthview-powers{padding-right:64px}}",
    ".nthview .nthview-gem{position:absolute;left:0;top:0;width:12px;height:12px;background:var(--gem);transform:rotate(45deg);border-radius:2px;box-shadow:0 0 8px var(--gem);pointer-events:none;z-index:6;opacity:0;will-change:transform,opacity}",
    ".nthview .nthview-grade{position:absolute;inset:0;pointer-events:none;z-index:3;background:radial-gradient(ellipse 75% 70% at 50% 46%,transparent 52%,rgba(0,0,0,.55) 100%)}",
    ".nthview .nthview-prize{display:flex;gap:10px;align-items:center}",
    ".nthview .nthview-prize svg{flex:none;color:var(--accent-ink)}",
    ".nthview .nthview-clegend button{border-radius:10px;padding:5px 9px;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.22);color:var(--hud-ink);font-weight:700;font-size:.84rem;line-height:1.2;min-height:34px;text-align:left;overflow-wrap:anywhere}",
    ".nthview .nthview-clegend button.nthview-ok{border-color:#6fe39b;background:rgba(80,200,120,.25)}",
    ".nthview .nthview-clegend button.nthview-no{border-color:#ff7a6a;background:rgba(230,70,50,.25)}",
    ".nthview .nthview-clegend button.nthview-lit{border-color:var(--gold);background:rgba(255,200,61,.22)}",
    ".nthview .nthview-cact button{border-radius:12px;padding:8px 14px;min-height:40px;font-weight:700;background:var(--gold);color:#1b1304;border:0}",
    ".nthview .nthview-labels{position:absolute;inset:0;pointer-events:none;z-index:4}"
  ].join("\n");

  var THEMES = ["warehouse", "bunker", "lab", "rooftop"];
  var ROOMS = ["corridors", "pillars", "offices", "yard"];
  var BOSSES = ["sentinel", "sprinter", "brute", "warden"];
  var REWARDS = ["sprint", "knife", "smoke", "vest", "grenade", "pot"];
  var SOLDIERS = ["rookie", "rifleman", "scout", "blade", "sniper", "heavy", "shield", "officer", "drone", "medic", "prowler"];
  /* every kind of guard: how he looks and how he behaves. Speeds are cells per second, times seconds, angles radians.
     speed: patrol; run: chasing; half and range: the flashlight; react: how long the hunter may stay in the light
     before the guard strikes; search: how long he looks around once he has lost the hunter; probes: extra places he checks */
  var GUARD = {
    rookie: { name: "Rookie", line: "A recruit with a pistol. Slow to react and quick to give up the chase.", body: 0x8fa6c8, trim: 0xf2f5fa, gear: 0x3b4a66, ring: 0x8fc0ff, head: "cap", weapon: "pistol", scale: .94, speed: 1.05, run: 2.0, half: .42, range: 2.9, react: .95, search: 2.2, probes: 0, turn: 3 },
    rifleman: { name: "Rifleman", line: "The regular guard: a steady light and a steady aim.", body: 0x2f4575, trim: 0x9fb4e0, gear: 0x566587, ring: 0x5f86ff, head: "helmet", weapon: "rifle", scale: 1, speed: 1.25, run: 2.5, half: .48, range: 3.4, react: .6, search: 3.2, probes: 1, turn: 3.4 },
    scout: { name: "Scout", line: "Light and quick. He runs fast and keeps searching for a long time.", body: 0x4f9a4a, trim: 0xd23c3c, gear: 0x2f5a2c, ring: 0x6fe06a, head: "bandana", weapon: "smg", scale: .96, speed: 1.8, run: 3.3, half: .38, range: 3.0, react: .55, search: 3.4, probes: 2, turn: 5 },
    blade: { name: "Blade", line: "No gun, only a sword and a lantern. Very fast: he must reach you to strike, so never let him.", body: 0x1b1c25, trim: 0xd61f3a, gear: 0x0f1016, ring: 0xff3355, head: "hood", weapon: "sword", scale: 1, speed: 1.5, run: 4.2, half: .95, range: 2.2, react: .35, search: 2.8, probes: 1, turn: 6, melee: true, cone: 0xffb060 },
    sniper: { name: "Sniper", line: "A long, thin beam that reaches across the room. He aims slowly and walks slowly.", body: 0x5a6634, trim: 0x8a9550, gear: 0x39411f, ring: 0xb7d94a, head: "boonie", weapon: "longrifle", scale: 1, speed: .8, run: 1.5, half: .2, range: 6.5, react: .8, search: 3, probes: 0, turn: 2, cone: 0xd8ffb0, pauseMul: 3 },
    heavy: { name: "Heavy", line: "Armoured and slow. He needs two hits: strike, get out of sight, strike again.", body: 0x4b4f58, trim: 0xff8a1f, gear: 0x2a2d33, ring: 0xff9a3a, head: "heavy", weapon: "minigun", scale: 1.2, speed: .85, run: 1.7, half: .6, range: 3.6, react: .5, search: 3, probes: 0, turn: 2.4, hp: 2 },
    shield: { name: "Shield", line: "His shield stops any attack from the front. Get behind him.", body: 0x1e63b0, trim: 0x9fd0ff, gear: 0x123a66, ring: 0x4aa8ff, head: "visor", weapon: "pistol", scale: 1.04, speed: 1.0, run: 2.2, half: .5, range: 3.2, react: .6, search: 3, probes: 1, turn: 2.8, frontProof: true },
    officer: { name: "Officer", line: "Blows the alarm the moment he sees you, and every guard comes running.", body: 0x24242c, trim: 0xe0b23c, gear: 0x8a1c1c, ring: 0xffd24a, head: "peaked", weapon: "pistol", scale: 1.02, speed: 1.1, run: 2.3, half: .5, range: 3.4, react: .5, search: 3.4, probes: 1, turn: 3.4, alarm: true },
    drone: { name: "Drone", line: "A flying camera with a round light. It cannot shoot, but it raises the alarm.", body: 0xdfe5ec, trim: 0xff3b30, gear: 0x444b57, ring: 0x58e0ff, head: "none", weapon: "none", scale: 1, speed: 1.5, run: 3.0, half: Math.PI, range: 1.7, react: .45, search: 3, probes: 2, turn: 8, alarm: true, drone: true, noGun: true, cone: 0x8fe8ff },
    prowler: { name: "Prowler", line: "The toughest soldier: a sprinter who turns round at any moment, whips about when he searches, and runs almost as fast as you. Break his line of sight early.", body: 0xf2d21b, trim: 0x15171b, gear: 0x15171b, ring: 0xfff04a, head: "band", weapon: "smg", scale: .98, legs: 0x15171b, speed: 2.3, run: 4.7, half: .46, range: 3.4, react: .35, search: 3.8, probes: 3, turn: 9, jumpy: true, track: 1.5 },
    medic: { name: "Medic", line: "Wakes fallen guards. Deal with him first.", body: 0xf0f2f4, trim: 0x1fbf8f, gear: 0xc9d2d8, ring: 0x3fe0b0, head: "cap", weapon: "pistol", scale: .98, speed: 1.3, run: 2.4, half: .45, range: 3.0, react: .75, search: 2.6, probes: 1, turn: 3.4, medic: true }
  };
  /* the four bosses: larger, with a gold star, and every one of them raises the alarm */
  var BOSS = {
    sentinel: { name: "The Sentinel", line: "His searchlight is twice as wide and reaches much further. Come at him from directly behind.", body: 0xb8321f, trim: 0xffc83d, gear: 0x5a1a10, ring: 0xffb020, head: "helmet", weapon: "rifle", lamp: true, scale: 1.3, speed: 1.05, run: 2.3, half: .98, range: 5.0, react: .45, search: 3.5, probes: 1, turn: 2.6, alarm: true, cone: 0xffe2a8 },
    sprinter: { name: "The Sprinter", line: "He patrols at double speed and turns round without warning. Strike just after he turns away.", body: 0xe0661a, trim: 0xffc83d, gear: 0x6b2c08, ring: 0xffb020, head: "bandana", weapon: "smg", scale: 1.26, speed: 2.6, run: 3.6, half: .5, range: 3.4, react: .4, search: 3, probes: 2, turn: 6.5, alarm: true, cone: 0xffe2a8 },
    brute: { name: "The Brute", line: "He takes two hits. The first one staggers him, then he sweeps his light in a full circle: hit, hide, hit again.", body: 0x3a2a2a, trim: 0xffc83d, gear: 0x8a1c1c, ring: 0xffb020, head: "heavy", weapon: "minigun", scale: 1.42, speed: .95, run: 1.9, half: .62, range: 3.7, react: .45, search: 3, probes: 0, turn: 2.8, hp: 2, alarm: true, cone: 0xffe2a8 },
    warden: { name: "The Warden", line: "A shield protects him while any soldier still stands. Take down every soldier first.", body: 0x4a2f8a, trim: 0xffc83d, gear: 0x2a1a55, ring: 0xffb020, head: "peaked", weapon: "pistol", scale: 1.3, speed: 1.15, run: 2.4, half: .56, range: 3.9, react: .4, search: 3.2, probes: 1, turn: 3, alarm: true, cone: 0xffe2a8 }
  };
  /* the squad a block gets when it names none: easy kinds first, the special ones later in the game */
  function defaultSquad(i, n, seed) {
    var pool = i === 0 ? ["rookie", "rookie", "rookie", "rifleman"] : ["rookie", "rifleman", "rifleman"], rnd = seeded("squad:" + seed), out = [], count = {}, cap = { officer: 1, drone: 1, medic: 1, heavy: 1, sniper: 1, prowler: 1, blade: 2, shield: 2 };
    if (i >= 1) pool.push("rifleman", "scout");
    if (i >= 2) pool.push("blade", "shield");
    if (i >= 3) pool.push("sniper", "medic");
    if (i >= 4) pool.push("heavy", "officer", "drone");
    if (i >= 5) pool.push("prowler");
    if (i >= 6) pool = pool.slice(2);
    for (var t = 0; out.length < n && t < 200; t++) {
      var k = pool[Math.floor(rnd() * pool.length)];
      if (cap[k] && (count[k] || 0) >= cap[k]) continue;
      if (i >= 2 && out.length === n - 1 && out.every(function (x) { return x === "rookie" || x === "rifleman"; }) && (k === "rookie" || k === "rifleman") && t < 150) continue;
      count[k] = (count[k] || 0) + 1; out.push(k);
    }
    while (out.length < n) out.push("rifleman");
    return out;
  }
  var POWER_INFO = {
    sprint: { name: "Sprint", help: "Double speed for six seconds.", icon: "M13 2 4 14h6l-1 8 9-12h-6z" },
    knife: { name: "Throwing knife", help: "Flies at the guard you are facing, or else the nearest one in plain sight, and takes him down from a distance.", icon: "M21 3 9 12l3 3zM8 13l-5 5 3 3 5-5z" },
    smoke: { name: "Smoke grenade", help: "Tap it, then tap where it should land; Space throws it ahead of you. For six seconds nobody sees into the smoke or through it.", icon: "M7 18a4 4 0 0 1-.6-7.9A5 5 0 0 1 16 8.5a4.5 4.5 0 0 1 1 8.9V18z" },
    vest: { name: "Vest", help: "Worn at once: it takes the next hit for you.", icon: "M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" },
    grenade: { name: "Grenade", help: "Flies at the guard you are facing, or else the nearest one in plain sight, and takes down everyone near the blast. It is loud: the rest come to look.", icon: "M10 2h5v2h-1.5v2.2a7 7 0 1 1-3 0V4H10zM12 9a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" },
    pot: { name: "Flower pot", help: "Stand still disguised as a flower pot for eight seconds. Lights pass over you; moving or striking ends it.", icon: "M12 2c1.7 0 3 1.3 3 3 0 .5-.1 1-.4 1.4.4-.2.9-.4 1.4-.4 1.7 0 3 1.3 3 3s-1.3 3-3 3h-3v2h5l-1.5 8h-9L6 14h5v-2H8c-1.700 0-3-1.300-3-3s1.300-3 3-3c.5 0 1 .1 1.400.4C9.100 6 9 5.500 9 5c0-1.700 1.300-3 3-3z" }
  };
  var ROOM_TYPES = ["lanes", "gates", "torches", "planks", "harvest", "levers", "tiles", "collect"];
  var TYPE_HELP = {
    lanes: "Walk to the crate with the right answer.",
    gates: "Walk through the archway with the right answer.",
    torches: "Step on a lamp to switch it on or off. Light only the ones that belong, then check.",
    planks: "For each statement, step on the True plate or the False plate.",
    harvest: "Pick up the badges that belong and leave the rest, then say you are done.",
    levers: "Step on the floor switches in the right order.",
    tiles: "Carry each file to the bin of its group.",
    collect: "Walk over every token to collect it."
  };
  /* the room palette per theme: the game keeps these dark tones in both colour schemes */
  var WORLD = {
    warehouse: { void: 0x05070b, floorA: "#2b3342", floorB: "#313a4b", grout: "#141922", wallTop: "#8792a8", wallSide: "#4a556b", wallBase: "#2a3140", glowLine: "#ffb23e", crate: "#b47a36", crateDark: "#6f4517", crateLine: "#4d2e0d", barrel: "#3f6a8a", metal: "#59657a", door: "#56698f", hunter: 0x2a3650, sash: 0x2fe0c4, sky: 0x9fb4d8, ground: 0x232a38, sun: 0xcfdcff, accent: 0xffb23e },
    bunker: { void: 0x060804, floorA: "#333a2a", floorB: "#3a4230", grout: "#191d13", wallTop: "#b9af8d", wallSide: "#6a6347", wallBase: "#3a3626", glowLine: "#c8f060", crate: "#62732e", crateDark: "#3a4718", crateLine: "#222b0c", barrel: "#7a4a2a", metal: "#6b6a55", door: "#7a8052", hunter: 0x2c3620, sash: 0xffb23e, sky: 0xc9cfa8, ground: 0x2a2f22, sun: 0xfff0cc, accent: 0xc8f060 },
    lab: { void: 0x03080a, floorA: "#22424a", floorB: "#284c55", grout: "#0f2227", wallTop: "#dde9ec", wallSide: "#8ba3a9", wallBase: "#4f666b", glowLine: "#5fe0d6", crate: "#2f86cf", crateDark: "#1b5890", crateLine: "#dff0ff", barrel: "#d8dde2", metal: "#7f979d", door: "#8fb0b6", hunter: 0x1d3238, sash: 0xff5fa2, sky: 0xcfeef2, ground: 0x1d3338, sun: 0xe6fbff, accent: 0x5fe0d6 },
    rooftop: { void: 0x03030a, floorA: "#262842", floorB: "#2c2e4c", grout: "#12132a", wallTop: "#a5766a", wallSide: "#6a433b", wallBase: "#3a2420", glowLine: "#b0a2ff", crate: "#8f96a8", crateDark: "#565d6e", crateLine: "#2b2f3a", barrel: "#b0463a", metal: "#6d7386", door: "#7d6690", hunter: 0x282850, sash: 0xffd23e, sky: 0x8f96d8, ground: 0x1f2036, sun: 0xcfc8ff, accent: 0xb0a2ff }
  };
  /* text with **bold** -> fragment of text and <b> nodes; never innerHTML */
  var SOUNDS = {
    gem: function (tone) { tone(1175, 0, .07, "triangle", .035); tone(1760, .05, .1, "triangle", .03); },
    slash: function (tone) { tone(1400, 0, .12, "sawtooth", .045, 220); tone(180, .02, .16, "square", .03, 70); },
    shot: function (tone) { tone(160, 0, .22, "square", .08, 45); tone(2200, 0, .05, "sawtooth", .04, 400); },
    alert: function (tone) { tone(660, 0, .09, "square", .035); tone(990, .09, .14, "square", .035); },
    huh: function (tone) { tone(330, 0, .12, "triangle", .035, 440); },
    boom: function (tone) { tone(110, 0, .5, "sawtooth", .09, 35); tone(60, 0, .7, "square", .07, 28); tone(900, 0, .08, "square", .04, 200); },
    siren: function (tone) { [0, .32, .64].forEach(function (st) { tone(620, st, .16, "square", .045, 880); tone(880, st + .16, .16, "square", .045, 620); }); },
    clang: function (tone) { tone(900, 0, .18, "square", .04, 500); tone(1350, 0, .12, "triangle", .03); },
    door: function (tone) { tone(70, 0, .9, "sawtooth", .035, 50); tone(105, .2, .6, "square", .015); },
    power: function (tone) { tone(440, 0, .1, "triangle", .04, 880); tone(880, .09, .16, "triangle", .035, 1320); }
  };
  function seeded(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h += 0x6D2B79F5; var t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }


  // ---- room generator: pure and deterministic, so a restart is the same room ----
  /* cells are 1 m squares centred on whole numbers; 0 floor, 1 wall, 2 crate */
  var GW = 11, GH = 21, START_X = 5, START_Z = GH - 2, DOOR_X = 5, ZR = GH - 6;   /* guards never patrol below row ZR, so the way in is quiet */
  function makeRoom(seed, style, nGuards) {
    for (var attempt = 0; attempt < 40; attempt++) {
      var r = tryRoom(seed + ":" + attempt, style, nGuards);
      if (r) return r;
    }
    return tryRoom(seed, "open", nGuards);
  }
  function tryRoom(seed, style, nGuards) {
    var rnd = seeded(seed), g = new Uint8Array(GW * GH), x, z, i;
    function idx(cx, cz) { return cz * GW + cx; }
    function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
    function reserved(cx, cz) { return (Math.abs(cx - START_X) <= 1 && cz >= START_Z - 1) || (Math.abs(cx - DOOR_X) <= 1 && cz === 1) || (cx === DOOR_X && cz === 2); }
    function set(cx, cz, v) { if (cx < 1 || cx > GW - 2 || cz < 1 || cz > GH - 2 || reserved(cx, cz)) return; g[idx(cx, cz)] = v; }
    function bar(x0, z0, w, h, v) { for (var a = 0; a < w; a++) for (var b = 0; b < h; b++) set(x0 + a, z0 + b, v); }
    function floor(cx, cz) { return cx >= 0 && cz >= 0 && cx < GW && cz < GH && g[idx(cx, cz)] === 0; }
    for (z = 0; z < GH; z++) for (x = 0; x < GW; x++) if (x === 0 || z === 0 || x === GW - 1 || z === GH - 1) g[idx(x, z)] = 1;

    if (style === "corridors") {
      [3, 6, 9, 12, 15].forEach(function (zr) {
        var mode = rnd(), g1 = ri(1, 3), g2 = ri(6, 8);
        for (x = 1; x <= 9; x++) {
          var gap = x === g1 || x === g1 + 1 || x === g2 || x === g2 + 1;
          if (mode < .22 && x > 5) gap = true; else if (mode < .44 && x < 5) gap = true;
          if (!gap) set(x, zr, 1);
        }
      });
      [1, 4, 7, 10, 13].forEach(function (zb) { if (rnd() < .6) set(ri(2, 8), zb + ri(0, 1), rnd() < .5 ? 1 : 2); });
    } else if (style === "pillars") {
      [3, 7, 11, 15].forEach(function (zr) {
        [2, 7].forEach(function (xb) { if (rnd() < .9) { bar(xb, zr, 2, 2, 1); if (rnd() < .25) set(xb === 2 ? 1 : 9, zr + ri(0, 1), 2); } });
      });
      [5, 9, 13].forEach(function (zr) { var q = rnd(); if (q < .55) bar(ri(4, 6), zr, 1, 2, 1); else if (q < .85) bar(4, zr, 3, 1, 1); });
    } else if (style === "offices") {
      [6, 11, 16].forEach(function (zr) { var a = ri(1, 3), b = ri(6, 8); for (x = 1; x <= 9; x++) if (!(x === a || x === a + 1 || x === b || x === b + 1)) set(x, zr, 1); });
      [[1, 5], [7, 10], [12, 15]].forEach(function (band) { var xv = ri(4, 6), gz = ri(band[0], band[1] - 1); for (z = band[0]; z <= band[1]; z++) if (z !== gz && z !== gz + 1) set(xv, z, 1); });
      for (i = 0; i < 5; i++) set(ri(1, 9), ri(2, GH - 5), 2);
    } else if (style === "yard") {
      var pieces = [[1, 1], [2, 1], [1, 2], [2, 2], [3, 1], [1, 3]], placed = 0, tries = 0;
      while (placed < 12 && tries++ < 120) {
        var pc = pieces[ri(0, pieces.length - 1)], px = ri(1, 10 - pc[0]), pz = ri(2, GH - 4 - pc[1]), ok = true;
        for (z = pz - 1; z <= pz + pc[1] && ok; z++) for (x = px - 1; x <= px + pc[0]; x++) if (x >= 1 && x <= 9 && z >= 1 && z <= GH - 2 && g[idx(x, z)]) { ok = false; break; }
        if (ok) { bar(px, pz, pc[0], pc[1], rnd() < .3 ? 1 : 2); placed++; }
      }
    }
    if (style !== "open" && style !== "yard") {
      var extra = ri(3, 5);
      for (i = 0; i < extra; i++) { x = ri(1, 9); z = ri(2, GH - 5); if (floor(x, z)) set(x, z, 2); }
    } else if (style === "open") {
      [[2, 4], [8, 4], [2, 10], [8, 10], [5, 7], [2, 15], [8, 15], [5, 13]].forEach(function (c) { set(c[0], c[1], 2); });
    }

    /* everything the hunter cannot reach becomes wall; the door must be reachable */
    var seen = new Uint8Array(GW * GH), stack = [idx(START_X, START_Z)], open = 0;
    seen[stack[0]] = 1;
    while (stack.length) {
      var c = stack.pop(), cx = c % GW, cz = (c - cx) / GW; open++;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nx = cx + d[0], nz = cz + d[1]; if (floor(nx, nz) && !seen[idx(nx, nz)]) { seen[idx(nx, nz)] = 1; stack.push(idx(nx, nz)); } });
    }
    if (!seen[idx(DOOR_X, 1)] || open < 90) return null;
    for (i = 0; i < g.length; i++) if (g[i] === 0 && !seen[i]) g[i] = 1;

    /* patrol candidates: straight runs of floor, and rings round a 2 x 2 block */
    var cands = [], s0;
    function line(x0, z0, x1, z1) {
      var len = Math.max(x1 - x0, z1 - z0) + 1, cut = len > 6 ? len - 6 : 0, off = cut ? ri(0, cut) : 0, cells = [], k;
      if (x1 > x0) { x0 += off; x1 = x0 + len - cut - 1; for (k = x0; k <= x1; k++) cells.push([k, z0]); }
      else { z0 += off; z1 = z0 + len - cut - 1; for (k = z0; k <= z1; k++) cells.push([x0, k]); }
      return { kind: "line", pts: [{ x: x0, z: z0 }, { x: x1, z: z1 }], cells: cells };
    }
    for (z = 1; z <= ZR; z++) { s0 = -1; for (x = 1; x <= GW - 1; x++) { if (floor(x, z)) { if (s0 < 0) s0 = x; } else { if (s0 >= 0 && x - s0 >= 4) cands.push(line(s0, z, x - 1, z)); s0 = -1; } } }
    for (x = 1; x <= 9; x++) { s0 = -1; for (z = 1; z <= ZR + 1; z++) { if (z <= ZR && floor(x, z)) { if (s0 < 0) s0 = z; } else { if (s0 >= 0 && z - s0 >= 4) cands.push(line(x, s0, x, z - 1)); s0 = -1; } } }
    for (z = 2; z <= ZR - 2; z++) for (x = 2; x <= 7; x++) {
      if (!(g[idx(x, z)] && g[idx(x + 1, z)] && g[idx(x, z + 1)] && g[idx(x + 1, z + 1)])) continue;
      var ring = [], okRing = true, a, b;
      for (b = z - 1; b <= z + 2 && okRing; b++) for (a = x - 1; a <= x + 2; a++) { if (a >= x && a <= x + 1 && b >= z && b <= z + 1) continue; if (!floor(a, b)) { okRing = false; break; } ring.push([a, b]); }
      if (okRing) cands.push({ kind: "loop", pts: [{ x: x - 1, z: z - 1 }, { x: x + 2, z: z - 1 }, { x: x + 2, z: z + 2 }, { x: x - 1, z: z + 2 }], cells: ring });
    }
    var order = [], chosen = [], j;
    for (i = 0; i < cands.length; i++) order.push(i);
    for (i = order.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); var t = order[i]; order[i] = order[j]; order[j] = t; }
    function near(cells, gap) {
      for (var q = 0; q < chosen.length; q++) for (var m = 0; m < chosen[q].cells.length; m++) for (var n = 0; n < cells.length; n++)
        if (Math.abs(chosen[q].cells[m][0] - cells[n][0]) <= gap && Math.abs(chosen[q].cells[m][1] - cells[n][1]) <= gap) return true;
      return false;
    }
    [2, 1].forEach(function (gap) {
      for (i = 0; i < order.length && chosen.length < nGuards; i++) { var cd = cands[order[i]]; if (chosen.indexOf(cd) === -1 && !near(cd.cells, gap)) chosen.push(cd); }
    });
    /* not enough runs: post sentries who stand and turn */
    for (i = 0; i < 60 && chosen.length < nGuards; i++) {
      x = ri(1, 9); z = ri(2, ZR);
      if (!floor(x, z) || near([[x, z]], 2)) continue;
      var dirs = [];
      if (floor(x + 1, z) && floor(x + 2, z)) dirs.push(0);
      if (floor(x, z + 1) && floor(x, z + 2)) dirs.push(Math.PI / 2);
      if (floor(x - 1, z) && floor(x - 2, z)) dirs.push(Math.PI);
      if (floor(x, z - 1) && floor(x, z - 2)) dirs.push(-Math.PI / 2);
      if (dirs.length >= 2) chosen.push({ kind: "sentry", pts: [{ x: x, z: z }], dirs: dirs, cells: [[x, z]] });
    }
    if (chosen.length < nGuards) return null;
    /* the boss takes the post nearest the door */
    var best = 0, bestZ = 1e9;
    chosen.forEach(function (r, k) { var s = 0; r.cells.forEach(function (cl) { s += cl[1]; }); s /= r.cells.length; if (s < bestZ) { bestZ = s; best = k; } });
    if (chosen.length) { var boss = chosen.splice(best, 1)[0]; chosen.unshift(boss); }
    chosen.forEach(function (r) { r.phase = rnd(); r.dir = rnd() < .5 ? 1 : -1; r.pause = .5 + rnd() * .8; r.seed = Math.floor(rnd() * 1e6); });

    /* places for the room trials: spread out so their labels do not collide */
    var spots = [], pool = [];
    for (z = 2; z <= ZR - 3; z++) for (x = 1; x <= 9; x++) if (floor(x, z) && !(x === DOOR_X && z <= 2)) pool.push([x, z]);   /* the task card covers the rows below */
    for (i = pool.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); var t2 = pool[i]; pool[i] = pool[j]; pool[j] = t2; }
    [[3, 2], [2, 2], [2, 1]].forEach(function (lim) {
      pool.forEach(function (pc2) {
        if (spots.length >= 12) return;
        for (var q = 0; q < spots.length; q++) if (Math.abs(spots[q].x - pc2[0]) < lim[0] && Math.abs(spots[q].z - pc2[1]) < lim[1]) return;
        spots.push({ x: pc2[0], z: pc2[1] });
      });
    });
    return { grid: g, routes: chosen, spots: spots, style: style };
  }


  NthView.engines.stealth = function (core) {
    var THREE = core.THREE, doc = core.doc, data = core.data, N = core.N, STRICT = core.STRICT, S = core.S, settings = core.settings;
    var container = core.container, canvas = core.canvas, col = core.col, ocard = core.ocard;
    var el = core.el, p = core.p, rich = core.rich, plain = core.plain, btn = core.btn, primaryBtn = core.primaryBtn, keyHint = core.keyHint, box = core.box, icon = core.icon, shuffledIdx = core.shuffledIdx;
    var toast = core.toast, say = core.say, sfx = core.sfx, hitFlash = core.hitFlash, fade = core.fade, bump = core.bump, persist = core.persist, saveNow = core.saveNow, renderScore = core.renderScore;
    var callout = core.callout, cKick = core.cKick, cText = core.cText, cBig = core.cBig, cLegend = core.cLegend, cFb = core.cFb, cAct = core.cAct;
    var openOverlay = core.openOverlay, closeOverlay = core.closeOverlay, overlayOpen = core.overlayOpen, panelOpen = core.panelOpen, pause = core.pause;
    var W = core.WD, themeName = W.theme || "warehouse", TH = WORLD[themeName], hero = core.hero, guardsName = (W.guards && W.guards.name) || "the guards";
    container.classList.add("nthview-theme-" + themeName);

    var BLOCKS = core.LV.map(function (b, i) {
      var w = b.world;
      return { idx: i, data: b.data, id: b.id, name: b.name, room: w.room || ROOMS[i % ROOMS.length], boss: w.boss || BOSSES[i % BOSSES.length],
        squad: w.squad || defaultSquad(i, w.soldiers || 3 + (i % 3), data.title + "|" + b.id), reward: w.reward || REWARDS[i % REWARDS.length], type: b.type, inRoom: ROOM_TYPES.indexOf(b.type) !== -1, color: b.color };
    });
    /* what only this game remembers per block: being caught, a cleared room, a skipped room */
    function freshHR() { return BLOCKS.map(function () { return { deaths: 0, cleared: false, skipped: false }; }); }
    var ROOMREC = freshHR();
    function freshInv() { return { sprint: 0, knife: 0, smoke: 0, vest: 0, grenade: 0, pot: 0 }; }
    S.gems = 0; S.deaths = 0; S.skips = 0; S.inv = freshInv(); S.invStart = freshInv(); S.sel = null;

    /* ---------- this game's HUD pieces ---------- */
    var targetRow = el("div", { class: "nthview-targets", role: "img" });
    var gemOut = el("b", { text: "0" });
    var gemChip = el("span", { class: "nthview-gemc", title: "Gems" }, [doc.createTextNode("◆ "), gemOut]);
    core.hRight.insertBefore(targetRow, core.hStats); core.hStats.insertBefore(gemChip, core.hStats.firstChild);
    var powerBar = el("div", { class: "nthview-powers", role: "group", "aria-label": "One-time powers" });
    col.insertBefore(powerBar, core.callout);
    var grade = el("div", { class: "nthview-grade", "aria-hidden": "true" });
    var labels = el("div", { class: "nthview-labels" });
    container.insertBefore(grade, col); container.insertBefore(labels, col);
    var gemEls = [];
    for (var gi = 0; gi < 10; gi++) { var ge = el("span", { class: "nthview-gem", "aria-hidden": "true" }); gemEls.push(ge); container.appendChild(ge); }
    function copyInv(from, to) { REWARDS.forEach(function (p2) { to[p2] = from[p2]; }); }
    var lightsWanted = true;
    if (core.SAVED && core.SAVED.w && core.SAVED.w.lights === false) lightsWanted = false;

    /* ---------- renderer, camera, light ---------- */
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
    var pixelRatio = Math.min(root.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    /* graphics tier: 2 = every flashlight is a real light that casts shadows; 0 = drawn light cones only (older phones, or when frames get slow) */
    var MAXG = 6, tier = (renderer.capabilities.maxTextures || 8) >= 16 && lightsWanted ? 2 : 0;
    function VW() { return Math.max(1, container.clientWidth); }
    function VH() { return Math.max(1, container.clientHeight); }
    function lin(c) { return new THREE.Color(c).convertSRGBToLinear(); }
    var scene = new THREE.Scene(); scene.background = lin(TH.void); scene.fog = new THREE.Fog(lin(TH.void), 40, 90);
    var camera = new THREE.PerspectiveCamera(30, 1, .5, 240);
    var CX = (GW - 1) / 2, CZ = (GH - 1) / 2, WALL_H = 1, TILT = 25 * Math.PI / 180;
    var _v = new THREE.Vector3(), _hit = new THREE.Vector3(), _ndc = new THREE.Vector2(), _scr = { x: 0, y: 0 };
    var raycaster = new THREE.Raycaster(), floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    var CORNERS = [[-.5, 0, -.5], [GW - .5, 0, -.5], [-.5, 0, GH - .5], [GW - .5, 0, GH - .5], [-.5, WALL_H, -.5], [GW - .5, WALL_H, -.5], [-.5, WALL_H, GH - .5], [GW - .5, WALL_H, GH - .5]];
    var bb = { x0: 0, x1: 0, y0: 0, y1: 0 }, camBaseX = CX, labelsDirty = true;
    function placeCamera(d) { camera.position.set(CX, d * Math.cos(TILT), CZ + d * Math.sin(TILT)); camera.lookAt(CX, 0, CZ); camera.updateMatrixWorld(); }
    function measure() {
      bb.x0 = bb.y0 = 1e9; bb.x1 = bb.y1 = -1e9;
      for (var i = 0; i < CORNERS.length; i++) { _v.set(CORNERS[i][0], CORNERS[i][1], CORNERS[i][2]).project(camera); if (_v.x < bb.x0) bb.x0 = _v.x; if (_v.x > bb.x1) bb.x1 = _v.x; if (_v.y < bb.y0) bb.y0 = _v.y; if (_v.y > bb.y1) bb.y1 = _v.y; }
    }
    /* the whole room always fits the portrait column, below the HUD */
    function fitCamera() {
      var w = VW(), h = VH(), colW = Math.min(560, w), top = 92, bot = 12;
      camera.clearViewOffset(); camera.aspect = w / h; camera.updateProjectionMatrix();
      var availW = (colW - 8) / w * 2, availH = Math.max(140, h - top - bot) / h * 2, lo = 6, hi = 200;
      for (var i = 0; i < 24; i++) { var mid = (lo + hi) / 2; placeCamera(mid); measure(); if (bb.x1 - bb.x0 <= availW && bb.y1 - bb.y0 <= availH) hi = mid; else lo = mid; }
      placeCamera(hi); measure();
      var cyPx = (1 - (bb.y0 + bb.y1) / 2) / 2 * h, want = top + (h - top - bot) / 2;
      camera.setViewOffset(w, h, 0, Math.round(cyPx - want), w, h);
      scene.fog.near = hi + 8; scene.fog.far = hi + 60; camBaseX = camera.position.x; labelsDirty = true;
    }
    function toScreen(x, y, z, out) { _v.set(x, y, z).project(camera); out.x = (_v.x + 1) / 2 * VW(); out.y = (1 - _v.y) / 2 * VH(); return out; }
    function toFloor(clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      _ndc.set((clientX - r.left) / r.width * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(_ndc, camera);
      return raycaster.ray.intersectPlane(floorPlane, _hit);
    }
    /* a dim, cool room so that the flashlights are the brightest thing in it */
    scene.add(new THREE.HemisphereLight(lin(TH.sky), lin(TH.ground), .42));
    var sun = new THREE.DirectionalLight(lin(TH.sun), .42);
    sun.position.set(CX - 6, 17, CZ - 7); sun.target.position.set(CX, 0, CZ); scene.add(sun); scene.add(sun.target);
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0008; sun.shadow.normalBias = .03;
    sun.shadow.camera.left = -9; sun.shadow.camera.right = 9; sun.shadow.camera.top = GH / 2 + 4; sun.shadow.camera.bottom = -GH / 2 - 4; sun.shadow.camera.near = 2; sun.shadow.camera.far = 44;
    /* one real spotlight per guard, made once so the shaders never have to be rebuilt in the middle of a room */
    var LAMPS = [];
    for (var li = 0; li < MAXG; li++) {
      var lp = new THREE.SpotLight(0xffffff, 0, 6, .5, .45, 1.3);
      lp.castShadow = true; lp.shadow.mapSize.set(512, 512); lp.shadow.bias = -.002; lp.shadow.camera.near = .12; lp.shadow.autoUpdate = false; lp.visible = tier >= 2;
      scene.add(lp); scene.add(lp.target); LAMPS.push(lp);
    }
    var heroLight = new THREE.PointLight(lin(TH.sash), 1.5, 3.2, 1.5); scene.add(heroLight);
    var flashLight = new THREE.PointLight(lin(0xffc070), 0, 5, 1.4); scene.add(flashLight);

    /* ---------- shared geometry, materials, textures ---------- */
    function capsule() {
      var pts = [], i;
      for (i = 0; i <= 6; i++) { var a = -Math.PI / 2 + i / 6 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a) * .5, -.5 + Math.sin(a) * .5)); }
      for (i = 0; i <= 6; i++) { var a2 = i / 6 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a2) * .5, .5 + Math.sin(a2) * .5)); }
      return new THREE.LatheGeometry(pts, 14);
    }
    var GEO = { box: new THREE.BoxGeometry(1, 1, 1), cyl: new THREE.CylinderGeometry(.5, .5, 1, 20), cone: new THREE.ConeGeometry(.5, 1, 16), sph: new THREE.SphereGeometry(.5, 18, 12), oct: new THREE.OctahedronGeometry(.5), cap: capsule(),
      disc: new THREE.CircleGeometry(.5, 32), ring: new THREE.RingGeometry(.36, .5, 40), arc: new THREE.RingGeometry(.3, .62, 28, 1, -.9, 1.8), torus: new THREE.TorusGeometry(.4, .09, 10, 24), plane: new THREE.PlaneGeometry(1, 1) };
    var MATS = {};
    function lam(c, rough, metal) { var k = "s" + c + ":" + rough + ":" + metal; return MATS[k] || (MATS[k] = new THREE.MeshStandardMaterial({ color: lin(c), roughness: rough === undefined ? .7 : rough, metalness: metal || 0 })); }
    function glow(c) { return MATS["g" + c] || (MATS["g" + c] = new THREE.MeshBasicMaterial({ color: lin(c), toneMapped: false })); }
    function setCol(mat, c) { mat.color.set(c).convertSRGBToLinear(); }
    function mesh(parent, geo, mat, x, y, z, sx, sy, sz) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz); if (parent) parent.add(m); return m; }
    var maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    function canvasTex(w, h, draw, data) { var c = doc.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); var t = new THREE.CanvasTexture(c); t.anisotropy = maxAniso; if (!data) t.encoding = THREE.sRGBEncoding; return t; }
    function speckle(g, r, x0, y0, w, h, n, lo, hi) { for (var i = 0; i < n; i++) { g.fillStyle = "rgba(" + (r() < .5 ? "0,0,0," : "255,255,255,") + (lo + r() * (hi - lo)).toFixed(3) + ")"; g.fillRect(x0 + r() * w, y0 + r() * h, 1 + r() * 2, 1 + r() * 2); } }
    /* floor: four by four worn concrete tiles, with a matching height map so the joints catch the light */
    function drawFloor(g, w, bump) {
      var n = 4, s = w / n, r = seeded("floor:" + themeName), i, x, y;
      for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
        g.fillStyle = bump ? "rgb(150,150,150)" : (r() < .5 ? TH.floorA : TH.floorB); g.fillRect(x * s, y * s, s, s);
        if (!bump) { var gr = g.createRadialGradient(x * s + s / 2, y * s + s / 2, s * .1, x * s + s / 2, y * s + s / 2, s * .78); gr.addColorStop(0, "rgba(255,255,255,.06)"); gr.addColorStop(1, "rgba(0,0,0,.2)"); g.fillStyle = gr; g.fillRect(x * s, y * s, s, s); }
      }
      speckle(g, r, 0, 0, w, w, 9000, bump ? .05 : .02, bump ? .16 : .07);
      if (!bump) {
        for (i = 0; i < 8; i++) { var bx = r() * w, by = r() * w, br = 20 + r() * 50, sg = g.createRadialGradient(bx, by, 2, bx, by, br); sg.addColorStop(0, "rgba(0,0,0,.2)"); sg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sg; g.fillRect(bx - br, by - br, br * 2, br * 2); }
        g.strokeStyle = "rgba(255,255,255,.07)"; g.lineWidth = 1;
        for (i = 0; i < 30; i++) { var sx2 = r() * w, sy2 = r() * w, an = r() * 6.28, ln = 8 + r() * 30; g.beginPath(); g.moveTo(sx2, sy2); g.lineTo(sx2 + Math.cos(an) * ln, sy2 + Math.sin(an) * ln); g.stroke(); }
      }
      g.strokeStyle = bump ? "rgb(30,30,30)" : TH.grout; g.lineWidth = bump ? 7 : 5;
      for (i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, w); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
      if (!bump) { g.strokeStyle = "rgba(255,255,255,.08)"; g.lineWidth = 1.5; for (y = 0; y < n; y++) for (x = 0; x < n; x++) { g.beginPath(); g.moveTo(x * s + 5, y * s + s - 5); g.lineTo(x * s + 5, y * s + 5); g.lineTo(x * s + s - 5, y * s + 5); g.stroke(); } }
    }
    var floorTex = canvasTex(512, 512, function (g, w) { drawFloor(g, w, false); }), floorBump = canvasTex(512, 512, function (g, w) { drawFloor(g, w, true); }, true);
    [floorTex, floorBump].forEach(function (t) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(GW / 4, GH / 4); });
    /* walls: the left half of the sheet is a side face (trim, panel, baseboard), the right half the top of a block */
    function drawWall(g, lit) {
      var r = seeded("wall:" + themeName), i;
      if (lit) { g.fillStyle = "#000"; g.fillRect(0, 0, 512, 256); g.fillStyle = TH.glowLine; g.fillRect(0, 24, 256, 6); return; }
      var gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, TH.wallSide); gr.addColorStop(.7, TH.wallSide); gr.addColorStop(1, TH.wallBase);
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
      g.fillStyle = TH.wallTop; g.fillRect(0, 0, 256, 18); g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(0, 18, 256, 5); g.fillStyle = TH.glowLine; g.fillRect(0, 24, 256, 6);
      g.fillStyle = TH.wallBase; g.fillRect(0, 212, 256, 44); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, 208, 256, 4);
      g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(0, 34, 3, 172); g.fillRect(253, 34, 3, 172); g.fillStyle = "rgba(255,255,255,.07)"; g.fillRect(3, 34, 2, 172);
      g.fillStyle = "rgba(255,255,255,.22)"; [[16, 50], [240, 50], [16, 190], [240, 190]].forEach(function (p2) { g.beginPath(); g.arc(p2[0], p2[1], 3.2, 0, 6.3); g.fill(); });
      speckle(g, r, 0, 0, 256, 256, 2600, .02, .08);
      g.fillStyle = TH.wallTop; g.fillRect(256, 0, 256, 256);
      g.strokeStyle = "rgba(0,0,0,.26)"; g.lineWidth = 10; g.strokeRect(261, 5, 246, 246); g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 3; g.strokeRect(271, 15, 226, 226);
      speckle(g, r, 256, 0, 256, 256, 2600, .02, .07);
    }
    var wallTex = canvasTex(512, 256, function (g) { drawWall(g, false); }), wallGlow = canvasTex(512, 256, function (g) { drawWall(g, true); });
    var crateTex = canvasTex(256, 256, function (g, w) {
      var r = seeded("crate:" + themeName), i;
      g.fillStyle = TH.crate; g.fillRect(0, 0, w, w);
      for (i = 0; i < 5; i++) { g.fillStyle = "rgba(0,0,0," + (.04 + r() * .1).toFixed(3) + ")"; g.fillRect(0, i * w / 5, w, w / 5 - 3); g.fillStyle = TH.crateLine; g.fillRect(0, (i + 1) * w / 5 - 3, w, 3); }
      g.strokeStyle = "rgba(0,0,0,.12)"; g.lineWidth = 1; for (i = 0; i < 60; i++) { var gy = r() * w, gx = r() * w; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + 20 + r() * 60, gy + (r() - .5) * 3); g.stroke(); }
      g.strokeStyle = TH.crateDark; g.lineWidth = 30; g.strokeRect(15, 15, w - 30, w - 30); g.lineWidth = 22; g.beginPath(); g.moveTo(26, 26); g.lineTo(w - 26, w - 26); g.stroke();
      g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 2; g.strokeRect(2, 2, w - 4, w - 4); g.strokeRect(31, 31, w - 62, w - 62);
      g.fillStyle = "#59616e"; [[4, 4], [w - 40, 4], [4, w - 40], [w - 40, w - 40]].forEach(function (p2) { g.fillRect(p2[0], p2[1], 36, 36); }); g.fillStyle = "rgba(255,255,255,.35)"; [[14, 14], [w - 30, 14], [14, w - 30], [w - 30, w - 30]].forEach(function (p2) { g.beginPath(); g.arc(p2[0] + 8, p2[1] + 8, 4, 0, 6.3); g.fill(); });
      speckle(g, r, 0, 0, w, w, 1800, .02, .08);
    });
    var doorTex = canvasTex(256, 256, function (g, w) {
      g.fillStyle = TH.door; g.fillRect(0, 0, w, w); g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(124, 0, 8, w); g.strokeStyle = "rgba(0,0,0,.3)"; g.lineWidth = 6; g.strokeRect(14, 14, 100, 150); g.strokeRect(142, 14, 100, 150);
      g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 2; g.strokeRect(20, 20, 88, 138); g.strokeRect(148, 20, 88, 138);
      for (var i = -2; i < 12; i++) { g.fillStyle = i % 2 ? "#15171b" : "#f2c230"; g.beginPath(); g.moveTo(i * 32, 256); g.lineTo(i * 32 + 32, 256); g.lineTo(i * 32 + 64, 196); g.lineTo(i * 32 + 32, 196); g.fill(); }
    });
    var matTex = canvasTex(256, 256, function (g, w) {
      g.clearRect(0, 0, w, w); g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 16; g.lineJoin = "miter";
      for (var i = 0; i < 3; i++) { g.globalAlpha = .35 + i * .25; g.beginPath(); g.moveTo(40, 226 - i * 70); g.lineTo(128, 160 - i * 70); g.lineTo(216, 226 - i * 70); g.stroke(); }
    });
    var softTex = canvasTex(64, 64, function (g, w) { var gr = g.createRadialGradient(w / 2, w / 2, 2, w / 2, w / 2, w / 2); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
    function markTex(ch, bg) { return canvasTex(64, 64, function (g, w) { g.fillStyle = bg; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 3, 0, Math.PI * 2); g.fill(); g.lineWidth = 4; g.strokeStyle = "#fff"; g.stroke(); g.fillStyle = "#fff"; g.font = "900 44px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ch, w / 2, w / 2 + 3); }); }
    function markMat(ch, bg) { return new THREE.SpriteMaterial({ map: markTex(ch, bg), depthTest: false, toneMapped: false }); }
    var MARK = { "!": markMat("!", "#e0372b"), "?": markMat("?", "#d99a12"), "+": markMat("+", "#17a67c"), "z": markMat("…", "#56627a") };
    var matFloor = new THREE.MeshStandardMaterial({ map: floorTex, bumpMap: floorBump, bumpScale: .03, roughness: .82, metalness: .06 });
    var matWall = new THREE.MeshStandardMaterial({ map: wallTex, emissiveMap: wallGlow, emissive: new THREE.Color(0xffffff), emissiveIntensity: 1.1, roughness: .78, metalness: .04 });
    var matCrate = new THREE.MeshStandardMaterial({ map: crateTex, bumpMap: crateTex, bumpScale: .025, roughness: .8, metalness: .02 });
    var matDoor = new THREE.MeshStandardMaterial({ map: doorTex, roughness: .45, metalness: .5 });
    var matProp = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .55, metalness: .3 });
    var matFig = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .6, metalness: .12 });
    var poolMat = new THREE.MeshBasicMaterial({ map: softTex, color: lin(TH.sky), transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    function addMat(c, o, map) { return new THREE.MeshBasicMaterial({ color: lin(c), map: map || null, transparent: true, opacity: o === undefined ? 1 : o, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }); }

    /* bake many primitive parts into one mesh: a whole figure, or every crate in a room, costs one draw call */
    var _m4 = new THREE.Matrix4(), _n3 = new THREE.Matrix3(), _eu = new THREE.Euler(), _qt = new THREE.Quaternion(), _p3 = new THREE.Vector3(), _s3 = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _c1 = new THREE.Color(), NI = {};
    function flat(name) { return NI[name] || (NI[name] = GEO[name].index ? GEO[name].toNonIndexed() : GEO[name]); }
    function Bake() { this.p = []; this.n = []; this.c = []; this.u = []; }
    Bake.prototype.put = function (name, col) {
      var g = flat(name), pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
      _n3.getNormalMatrix(_m4); _c1.set(col).convertSRGBToLinear();
      for (var i = 0; i < pos.count; i++) {
        _v.fromBufferAttribute(pos, i).applyMatrix4(_m4); this.p.push(_v.x, _v.y, _v.z);
        _v.fromBufferAttribute(nor, i).applyMatrix3(_n3).normalize(); this.n.push(_v.x, _v.y, _v.z);
        this.c.push(_c1.r, _c1.g, _c1.b); this.u.push(uv.getX(i), uv.getY(i));
      }
      return this;
    };
    Bake.prototype.add = function (name, col, x, y, z, sx, sy, sz, rx, ry, rz) {
      _p3.set(x, y, z); _eu.set(rx || 0, ry || 0, rz || 0); _qt.setFromEuler(_eu); _s3.set(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz);
      _m4.compose(_p3, _qt, _s3); return this.put(name, col);
    };
    /* a rounded limb from one point to another */
    Bake.prototype.limb = function (col, x0, y0, z0, x1, y1, z1, r) {
      _s3.set(x1 - x0, y1 - y0, z1 - z0); var len = _s3.length(); _qt.setFromUnitVectors(_up, _s3.normalize());
      _p3.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); _s3.set(r * 2, (len + r * 2) / 2, r * 2); _m4.compose(_p3, _qt, _s3); return this.put("cap", col);
    };
    Bake.prototype.mesh = function (mat, shadow) {
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(this.p, 3)); geo.setAttribute("normal", new THREE.Float32BufferAttribute(this.n, 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(this.c, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(this.u, 2));
      var m = new THREE.Mesh(geo, mat); m.castShadow = shadow !== false; m.receiveShadow = true; m.userData.own = true; return m;
    };
    /* wall blocks carry their own texture coordinates: sides on the left half of the sheet, tops on the right */
    var FACES = [
      [0, 1, 0, -.5, .5, .5, .5, .5, .5, .5, .5, -.5, -.5, .5, -.5],
      [0, 0, 1, -.5, -.5, .5, .5, -.5, .5, .5, .5, .5, -.5, .5, .5],
      [0, 0, -1, .5, -.5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5],
      [1, 0, 0, .5, -.5, .5, .5, -.5, -.5, .5, .5, -.5, .5, .5, .5],
      [-1, 0, 0, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5, .5, -.5]
    ], FUV = [0, 0, 1, 0, 1, 1, 0, 1], FORD = [0, 1, 2, 0, 2, 3];
    function pushBox(B, x, y, z, sx, sy, sz, top, side, skip) {
      for (var f = 0; f < 5; f++) {
        if (skip && skip[f]) continue;
        var F = FACES[f]; _c1.set(f === 0 ? top : side).convertSRGBToLinear();
        for (var q = 0; q < 6; q++) {
          var k = FORD[q], o = 3 + k * 3; B.p.push(x + F[o] * sx, y + F[o + 1] * sy, z + F[o + 2] * sz); B.n.push(F[0], F[1], F[2]); B.c.push(_c1.r, _c1.g, _c1.b);
          B.u.push((f === 0 ? .504 : .004) + FUV[k * 2] * .492, FUV[k * 2 + 1]);
        }
      }
    }
    var ground = mesh(scene, GEO.plane, new THREE.MeshStandardMaterial({ color: lin(0x262626), map: (function () { var t = floorTex.clone(); t.repeat.set(65, 65); t.needsUpdate = true; return t; })(), roughness: .95, metalness: 0 }), CX, -.03, CZ, 260, 260, 1); ground.rotation.x = -Math.PI / 2;
    var floorMesh = mesh(scene, GEO.plane, matFloor, CX, 0, CZ, GW, GH, 1); floorMesh.rotation.x = -Math.PI / 2; floorMesh.receiveShadow = true;
    /* the rest of the building, dim, as filler beside the portrait column on wide screens */
    (function () {
      var B = new Bake(), rnd = seeded("around:" + themeName), top = new THREE.Color(TH.wallTop).multiplyScalar(.1).getHex(), side = new THREE.Color(TH.wallSide).multiplyScalar(.09).getHex();
      for (var z = -7; z <= GH + 6; z++) for (var x = -18; x <= GW + 17; x++) {
        if (rnd() < .8) continue;
        var w = 1 + Math.floor(rnd() * 3), d = 1 + Math.floor(rnd() * 2), h = .3 + rnd() * 1.1;
        if (x + w > -2 && x < GW + 1 && z + d > -2 && z < GH + 1) continue;
        pushBox(B, x + w / 2, h / 2, z + d / 2, w, h, d, top, side, null);
      }
      var m = B.mesh(matProp, false); m.userData.own = false; scene.add(m);
    })();

    /* ---------- figures: people facing +x, each baked into a body and two legs ---------- */
    var SKIN = 0xe2b690, GUN = 0x16181d, HP = Math.PI / 2;
    function headgear(b, S) {
      var k = S.head;
      if (k === "cap") { b.add("cyl", S.trim, 0, 1.075, 0, .31, .08, .31); b.add("box", S.trim, .17, 1.05, 0, .17, .025, .24); }
      else if (k === "helmet") { b.add("sph", S.gear, 0, 1.0, 0, .38, .32, .38); b.add("cyl", S.gear, 0, .985, 0, .4, .03, .4); }
      else if (k === "bandana") { b.add("sph", 0x2a1c12, 0, 1.05, 0, .28, .18, .28); b.add("cyl", S.trim, 0, 1.03, 0, .32, .07, .32); b.add("box", S.trim, -.2, 1.0, .06, .16, .03, .07, 0, .5, 0); }
      else if (k === "hood") { b.add("sph", S.body, -.01, 1.0, 0, .39, .37, .39); b.add("cone", S.body, -.1, 1.13, 0, .2, .18, .2, 0, 0, .5); b.add("box", S.trim, .13, .97, 0, .08, .05, .27); }
      else if (k === "boonie") { b.add("cyl", S.trim, 0, 1.06, 0, .54, .025, .54); b.add("cyl", S.body, 0, 1.1, 0, .3, .1, .3); }
      else if (k === "heavy") { b.add("sph", S.gear, 0, .99, 0, .43, .39, .43); b.add("box", S.trim, .17, .97, 0, .06, .07, .3); }
      else if (k === "visor") { b.add("sph", S.gear, 0, 1.0, 0, .39, .33, .39); b.add("box", S.trim, .16, .96, 0, .04, .13, .28); }
      else if (k === "band") { b.add("sph", 0x2a1c12, 0, 1.05, 0, .29, .2, .29); b.add("cyl", 0xffffff, 0, 1.02, 0, .325, .05, .325); b.add("box", 0x101216, .14, .975, 0, .07, .05, .27); b.add("box", S.trim, 0, .58, 0, .31, .045, .47); b.add("box", S.trim, 0, .7, 0, .31, .045, .47); }
      else if (k === "peaked") { b.add("cyl", S.body, 0, 1.06, 0, .31, .06, .31); b.add("cyl", S.gear, 0, 1.085, 0, .325, .035, .325); b.add("cyl", S.body, 0, 1.12, 0, .4, .04, .4); b.add("box", 0x0d0d10, .19, 1.045, 0, .14, .02, .25); b.add("sph", S.trim, .16, 1.095, 0, .07); }
    }
    function weapon(b, S, lens) {
      var k = S.weapon;
      if (k === "pistol") { b.add("box", GUN, .43, .6, .09, .2, .075, .05); b.add("cyl", 0x30343c, .45, .545, .09, .055, .13, .055, 0, 0, HP); lens.push([.53, .545, .09, .06]); }
      else if (k === "rifle" || k === "smg") { var L = k === "rifle" ? .58 : .42; b.add("box", GUN, .2 + L / 2, .6, .09, L, .075, .06); b.add("box", GUN, .1, .62, .13, .2, .09, .06); b.add("box", GUN, .38, .53, .09, .06, .13, .05); b.add("cyl", 0x30343c, .18 + L, .55, .09, .06, .14, .06, 0, 0, HP); lens.push([.26 + L, .55, .09, .065]); }
      else if (k === "longrifle") { b.add("box", GUN, .58, .61, .09, 1.0, .055, .05); b.add("box", 0x3a2a1a, .1, .62, .13, .24, .1, .06); b.add("cyl", 0x20232a, .42, .685, .09, .065, .24, .065, 0, 0, HP); b.add("cyl", 0x30343c, 1.02, .58, .09, .05, .12, .05, 0, 0, HP); lens.push([1.09, .58, .09, .05]); }
      else if (k === "minigun") { b.add("cyl", 0x2b2e35, .5, .56, .11, .17, .62, .17, 0, 0, HP); b.add("cyl", 0x101216, .86, .56, .11, .12, .12, .12, 0, 0, HP); b.add("box", 0x30343c, .3, .47, .11, .2, .08, .1); b.add("box", S.trim, -.21, .66, 0, .17, .32, .36); lens.push([.93, .56, .11, .08]); }
      else if (k === "sword") { b.add("box", 0x2a2d33, .35, .5, -.12, .1, .15, .1); lens.push([.35, .5, -.12, .09]); }
    }
    function buildFigure(S, kind) {
      var g = new THREE.Group(), me = kind === "hunter", boss = kind === "boss", b = new Bake(), lens = [], legs = S.legs || 0x1a1d24, f = { g: g, legL: null, legR: null, body: null, ring: null, star: null, glows: [] };
      if (S.drone) {
        b.add("sph", S.body, 0, 1.2, 0, .4, .17, .4); b.add("box", S.gear, 0, 1.2, 0, .84, .035, .06, 0, Math.PI / 4, 0); b.add("box", S.gear, 0, 1.2, 0, .84, .035, .06, 0, -Math.PI / 4, 0);
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { b.add("cyl", S.gear, q[0] * .29, 1.235, q[1] * .29, .09, .07, .09); b.add("cyl", 0x9aa4b2, q[0] * .29, 1.28, q[1] * .29, .3, .008, .3); });
        b.add("sph", 0x15171b, 0, 1.1, 0, .2); lens.push([.07, 1.06, 0, .08]);
      } else {
        b.add("cap", S.body, 0, .64, 0, .3, .2, .46); b.add("box", 0x14161b, 0, .46, 0, .27, .06, .43);
        if (!me && S.head !== "cap" && S.head !== "bandana" && S.head !== "boonie" && S.head !== "band") b.add("box", S.gear, .012, .665, 0, .3, .2, .4);
        var sh = boss ? S.trim : S.gear, ss = boss ? .25 : .18;
        b.add("sph", sh, 0, .79, .255, ss); b.add("sph", sh, 0, .79, -.255, ss);
        b.limb(S.body, 0, .78, .26, .2, .62, .2, .06); b.limb(S.body, .2, .62, .2, .31, .585, .11, .055);
        b.limb(S.body, 0, .78, -.26, .16, .64, -.2, .06); b.limb(S.body, .16, .64, -.2, .32, .6, -.01, .055);
        b.add("sph", me ? 0x1a1d24 : SKIN, .31, .585, .1, .1); b.add("sph", me ? 0x1a1d24 : SKIN, .33, .6, -.02, .1);
        b.add("cyl", me ? 0x1a1d24 : SKIN, 0, .86, 0, .13, .08, .13); b.add("sph", me ? 0x2a2f3a : SKIN, .012, .97, 0, .3);
        if (me) {
          b.add("sph", S.body, -.01, 1.0, 0, .39, .37, .39); b.add("cone", S.body, -.1, 1.13, 0, .2, .18, .2, 0, 0, .5);
          b.add("box", S.trim, .13, .97, 0, .08, .045, .27); b.add("cyl", S.trim, 0, .84, 0, .3, .05, .34); b.add("box", S.trim, -.2, .74, .1, .22, .04, .09, 0, .3, -.5);
          b.add("box", S.trim, 0, .46, 0, .28, .03, .44); b.add("box", 0x15171b, -.17, .7, -.1, .05, .5, .06, 0, 0, -.5);
        } else {
          headgear(b, S); weapon(b, S, lens);
          if (S.frontProof) { b.add("box", S.trim, .4, .6, -.04, .05, .66, .6); b.add("box", S.gear, .43, .6, -.04, .02, .5, .44); b.add("box", 0xe9f6ff, .445, .74, -.04, .012, .09, .3); }
          if (S.head === "peaked") { b.add("box", S.body, -.03, .5, 0, .33, .22, .5); b.add("cyl", 0x9aa4b2, -.15, 1.02, -.17, .018, .52, .018); b.add("box", S.trim, 0, .84, .255, .16, .02, .12); b.add("box", S.trim, 0, .84, -.255, .16, .02, .12); }
          if (S.medic) { b.add("box", 0xffffff, -.21, .66, 0, .17, .3, .34); b.add("box", S.trim, -.3, .66, 0, .012, .2, .07); b.add("box", S.trim, -.3, .66, 0, .012, .07, .2); b.add("box", S.trim, 0, 1.118, 0, .18, .01, .055); b.add("box", S.trim, 0, 1.118, 0, .055, .01, .18); }
          if (S.head === "helmet" && !S.lamp) b.add("box", S.gear, -.2, .66, 0, .14, .28, .32);
          if (S.lamp) { b.add("cyl", 0x2a2d33, .08, .93, -.3, .22, .24, .22, 0, 0, HP); lens.push([.21, .93, -.3, .17]); }
        }
        var mk = function (zs) { var lb = new Bake(); lb.add("cap", legs, 0, -.19, 0, .13, .19, .13); lb.add("box", 0x0c0d10, .035, -.4, 0, .19, .085, .135); var m = lb.mesh(matFig); m.position.set(0, .44, zs * .105); g.add(m); return m; };
        f.legL = mk(-1); f.legR = mk(1);
      }
      f.body = b.mesh(matFig); g.add(f.body);
      lens.forEach(function (q) { f.glows.push(mesh(g, GEO.sph, glow(me ? TH.sash : (S.cone || 0xfff0b8)), q[0], q[1], q[2], q[3])); });
      if (me) f.glows.push(mesh(g, GEO.torus, glow(TH.sash), 0, .845, 0, .36, .36, .2)), f.glows[f.glows.length - 1].rotation.x = HP;
      else {
        f.ring = mesh(g, GEO.disc, new THREE.MeshBasicMaterial({ map: softTex, color: lin(S.ring), transparent: true, opacity: .6, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), 0, .03, 0, 1.3); f.ring.rotation.x = -HP; f.ring.userData.ownMat = true;
        if (boss) f.star = mesh(g, GEO.oct, glow(0xffc83d), 0, 1.36, 0, .19);
      }
      /* a sword is its own part so that it can swing: the hunter's, and the blade's */
      if (me || S.weapon === "sword") {
        var pv = new THREE.Group(), edge = me ? TH.sash : S.trim; pv.position.set(.2, .62, .2);
        mesh(pv, GEO.box, lam(0xe6edf5, .22, .9), .52, 0, 0, .8, .026, .08).castShadow = true; mesh(pv, GEO.box, glow(edge), .52, .018, 0, .8, .008, .022);
        mesh(pv, GEO.box, lam(0x2a1c12, .7, 0), .04, 0, 0, .17, .05, .055); mesh(pv, GEO.box, lam(edge, .5, .3), .13, 0, 0, .035, .055, .22);
        pv.rotation.y = -.4; g.add(pv); f.sword = pv;
      }
      f.scale = (S.scale || 1) * 1.22; g.scale.setScalar(f.scale);   /* drawn a little larger than life so each kind reads clearly from above */
      return f;
    }
    function animWalk(f, phase, moving, running) {
      if (!f.legL) { f.body.position.y = Math.sin(T * 3 + phase) * .04; return; }
      var s = moving ? Math.sin(phase) * (running ? .85 : .55) : 0; f.legL.rotation.z = s; f.legR.rotation.z = -s;
      f.body.position.y = moving ? Math.abs(Math.sin(phase)) * .025 : 0; f.body.rotation.z = moving && running ? -.14 : 0;
    }
    function poseFall(f, k) { var e = k * k * (3 - 2 * k); if (f.legL) { f.g.rotation.z = -e * HP; f.g.position.y = e * .16 * f.scale; } else { f.g.rotation.z = e * .5; f.g.position.y = -e * 1.02; } }

    /* ---------- the room ---------- */
    var RAYS = 40, HR = .26;
    var room = null, grid = new Uint8Array(GW * GH), roomGroup = null, guards = [], doorSlab = null, doorLamp = null, doorGlow = null, doorOpen = 0, doorWant = 0;
    var H = { x: START_X, z: START_Z, a: -Math.PI / 2, alive: true, fig: buildFigure({ body: TH.hunter, trim: TH.sash, gear: TH.sash, scale: 1 }, "hunter"), path: new Float32Array(128), pathN: 0, pathI: 0, target: null, moving: false, repath: 0,
      sprintT: 0, potT: 0, safeT: 0, aim: null, atk: null, swing: -.4, swingV: -.4, kbx: 0, kbz: 0, walk: 0, fall: 0, bounceT: 0, vx: 0, vz: -1 };
    scene.add(H.fig.g);
    var heroGlow = mesh(scene, GEO.disc, new THREE.MeshBasicMaterial({ map: softTex, color: lin(TH.sash), transparent: true, opacity: .4, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), 0, .02, 0, 1.9); heroGlow.rotation.x = -HP;
    /* a smoke cloud: a handful of soft sprites over a dark patch */
    var smokeFx = new THREE.Group(); smokeFx.visible = false; scene.add(smokeFx);
    var smokeBits = [];
    (function () {
      var sm = new THREE.SpriteMaterial({ map: softTex, color: lin(0xaab4c2), transparent: true, opacity: .62, depthWrite: false });
      mesh(smokeFx, GEO.disc, new THREE.MeshBasicMaterial({ map: softTex, color: 0x000000, transparent: true, opacity: .5, depthWrite: false }), 0, .02, 0, 4.2).rotation.x = -HP;
      for (var q = 0; q < 7; q++) { var sp2 = new THREE.Sprite(sm), a = q / 6 * 6.283; sp2.position.set(q ? Math.cos(a) * 1.05 : 0, .7 + (q % 3) * .25, q ? Math.sin(a) * 1.05 : 0); sp2.scale.setScalar(2.4); smokeFx.add(sp2); smokeBits.push(sp2); }
    })();
    var bomb = mesh(scene, GEO.sph, new THREE.MeshStandardMaterial({ color: lin(0x3f5a2a), roughness: .5, metalness: .4 }), 0, .6, 0, .2); bomb.visible = false; bomb.castShadow = true;
    var boomRing = mesh(scene, GEO.ring, addMat(0xffa040, 0), 0, .05, 0, 1); boomRing.rotation.x = -HP; var boomT = 0;
    /* the flower-pot disguise */
    var potObj = (function () {
      var b = new Bake();
      b.add("cyl", 0xb5562b, 0, .2, 0, .5, .4, .5); b.add("cyl", 0xc96a3a, 0, .42, 0, .6, .07, .6); b.add("cyl", 0x3a2a1c, 0, .46, 0, .5, .02, .5);
      b.add("cyl", 0x2f8a3a, 0, .68, 0, .05, .46, .05); b.add("sph", 0x2f9a40, .14, .62, .04, .26, .1, .16, 0, 0, .5); b.add("sph", 0x2f9a40, -.14, .7, -.04, .26, .1, .16, 0, 0, -.5); b.add("sph", 0x37a84a, .02, .56, -.15, .16, .09, .24, .5, 0, 0);
      [0, 1, 2, 3, 4].forEach(function (q) { var a = q / 5 * 6.283; b.add("sph", 0xff6fa8, Math.cos(a) * .1, .95, Math.sin(a) * .1, .15, .08, .15); });
      b.add("sph", 0xffd23e, 0, .97, 0, .11);
      var m = b.mesh(matProp); m.userData.own = false; m.visible = false; m.scale.setScalar(1.25); scene.add(m); return m;
    })();
    var tapRing = mesh(scene, GEO.ring, addMat(0xffffff, 0), 0, .03, 0, .5); tapRing.rotation.x = -HP; var tapT = 0;
    var goalRing = mesh(scene, GEO.ring, addMat(0xffc83d, .9), 0, .035, 0, .9); goalRing.rotation.x = -HP; goalRing.visible = false;
    var SLASH = [mesh(scene, GEO.arc, addMat(0xffffff, 0), 0, .66, 0, 1), mesh(scene, GEO.arc, addMat(TH.sash, 0), 0, .7, 0, 1)], slashT = [0, 0];
    SLASH.forEach(function (m) { m.rotation.x = -HP; m.position.y = 1.15; m.material.depthTest = false; m.renderOrder = 9; });
    /* a white flash where a cut or a shot lands */
    var hitSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false })); hitSpr.visible = false; scene.add(hitSpr); var hitT = 0;
    var tracer = mesh(scene, GEO.box, addMat(0xfff2a8, 0), 0, .6, 0, 1, .05, .05); var tracerT = 0;
    var knife = mesh(scene, GEO.box, glow(0xe9eff7), 0, .6, 0, .3, .04, .08); knife.visible = false; var KN = { on: false, x: 0, z: 0, G: null };
    var PUFFS = [], puffI = 0;
    for (var pi2 = 0; pi2 < 8; pi2++) { var ps = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: lin(0xcfd6e0), transparent: true, opacity: 0, depthWrite: false })); ps.visible = false; scene.add(ps); PUFFS.push({ s: ps, t: 0, vx: 0, vz: 0 }); }
    function puff(x, y, z, n, col) { for (var i = 0; i < n; i++) { var P2 = PUFFS[puffI++ % PUFFS.length], a = i / n * 6.28 + x; P2.s.position.set(x, y, z); P2.s.material.color.set(col || 0xcfd6e0).convertSRGBToLinear(); P2.vx = Math.cos(a) * .9; P2.vz = Math.sin(a) * .9; P2.t = .5; P2.s.visible = true; } }
    var boxObj = new THREE.Group(); boxObj.visible = false; scene.add(boxObj);
    mesh(boxObj, GEO.box, lam(0x2a303c, .4, .7), 0, .17, 0, .56, .34, .44).castShadow = true;
    var boxLid = mesh(boxObj, GEO.box, lam(0x4a5468, .35, .8), 0, .37, 0, .6, .07, .48);
    mesh(boxObj, GEO.box, glow(0xffc83d), 0, .2, .225, .13, .15, .02); mesh(boxObj, GEO.box, glow(0xffc83d), 0, .34, 0, .62, .012, .5);
    var BOX = { on: false, x: 0, z: 0, fall: 0, open: 0 };
    var keyObj = new THREE.Group(); keyObj.visible = false; scene.add(keyObj);
    mesh(keyObj, GEO.torus, glow(0xffc83d), -.2, 0, 0, .36); mesh(keyObj, GEO.box, glow(0xffc83d), .16, 0, 0, .5, .09, .09); mesh(keyObj, GEO.box, glow(0xffc83d), .32, -.1, 0, .09, .18, .09);
    var keyGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: lin(0xffc83d), transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false })); keyGlow.scale.setScalar(1.6); keyObj.add(keyGlow);
    var KEYFLY = { on: false, t: 0, x0: 0, z0: 0, done: null };

    function solid(cx, cz) { return cx < 0 || cz < 0 || cx >= GW || cz >= GH || grid[cz * GW + cx] !== 0; }
    function cellOf(v) { return Math.floor(v + .5); }
    function freeAt(x, z, r) {
      var x0 = cellOf(x - r), x1 = cellOf(x + r), z0 = cellOf(z - r), z1 = cellOf(z + r);
      for (var cz = z0; cz <= z1; cz++) for (var cx = x0; cx <= x1; cx++) if (solid(cx, cz)) return false;
      return true;
    }
    /* distance a ray travels before it meets a wall or crate (grid DDA, no allocation) */
    function castRay(ox, oz, ang, maxD) {
      var dx = Math.cos(ang), dz = Math.sin(ang), px = ox + .5, pz = oz + .5, cx = Math.floor(px), cz = Math.floor(pz);
      var stepX = dx > 0 ? 1 : -1, stepZ = dz > 0 ? 1 : -1, tDX = dx !== 0 ? Math.abs(1 / dx) : 1e9, tDZ = dz !== 0 ? Math.abs(1 / dz) : 1e9;
      var tMX = dx > 0 ? (cx + 1 - px) * tDX : dx < 0 ? (px - cx) * tDX : 1e9, tMZ = dz > 0 ? (cz + 1 - pz) * tDZ : dz < 0 ? (pz - cz) * tDZ : 1e9, t = 0;
      for (var n = 0; n < 40; n++) {
        if (tMX < tMZ) { t = tMX; tMX += tDX; cx += stepX; } else { t = tMZ; tMZ += tDZ; cz += stepZ; }
        if (t >= maxD) return maxD;
        if (solid(cx, cz)) return t;
      }
      return maxD;
    }
    function los(ax, az, bx, bz, d) { return castRay(ax, az, Math.atan2(bz - az, bx - ax), d) >= d - .02; }
    function angDiff(a, b) { var d = a - b; return Math.atan2(Math.sin(d), Math.cos(d)); }
    function clearWalk(ax, az, bx, bz) {
      var dx = bx - ax, dz = bz - az, d = Math.sqrt(dx * dx + dz * dz), n = Math.ceil(d / .2);
      for (var s = 1; s <= n; s++) if (!freeAt(ax + dx * s / n, az + dz * s / n, HR)) return false;
      return true;
    }
    /* shortest path on the grid (Dijkstra, eight directions, no corner cutting), then straightened */
    var NCELL = GW * GH, pDist = new Float32Array(NCELL), pPrev = new Int16Array(NCELL), pDone = new Uint8Array(NCELL), pCells = new Int16Array(NCELL);
    var NBX = [1, -1, 0, 0, 1, 1, -1, -1], NBZ = [0, 0, 1, -1, 1, -1, 1, -1];
    function findPath(sx, sz, tx, tz, out) {
      var scx = cellOf(sx), scz = cellOf(sz), tcx = cellOf(tx), tcz = cellOf(tz), sc = scz * GW + scx, tc = tcz * GW + tcx, i, c, best, bd;
      if (solid(tcx, tcz) || solid(scx, scz)) return 0;
      if (sc === tc) { out[0] = tx; out[1] = tz; return 1; }
      for (i = 0; i < NCELL; i++) { pDist[i] = 1e9; pPrev[i] = -1; pDone[i] = 0; }
      pDist[sc] = 0;
      for (;;) {
        best = -1; bd = 1e9;
        for (i = 0; i < NCELL; i++) if (!pDone[i] && pDist[i] < bd) { bd = pDist[i]; best = i; }
        if (best < 0 || best === tc) break;
        pDone[best] = 1;
        var bx = best % GW, bz = (best - bx) / GW;
        for (i = 0; i < 8; i++) {
          var nx = bx + NBX[i], nz = bz + NBZ[i];
          if (solid(nx, nz)) continue;
          c = nz * GW + nx;
          if (pDone[c] || (i >= 4 && (solid(nx, bz) || solid(bx, nz)))) continue;
          var nd = bd + (i >= 4 ? 1.4142 : 1);
          if (nd < pDist[c]) { pDist[c] = nd; pPrev[c] = best; }
        }
      }
      if (best !== tc) return 0;
      var n = 0; c = tc; while (c !== sc && c >= 0 && n < NCELL) { pCells[n++] = c; c = pPrev[c]; }
      var px = sx, pz = sz, m = 0, at = n - 1, exact = freeAt(tx, tz, HR);
      while (at >= 0 && m < 60) {
        var far = at, fx = 0, fz = 0;
        for (i = 0; i <= at; i++) {
          var qx = pCells[i] % GW, qz = (pCells[i] - qx) / GW;
          fx = i === 0 && exact ? tx : qx; fz = i === 0 && exact ? tz : qz;
          if (i === at || clearWalk(px, pz, fx, fz)) { far = i; break; }
        }
        out[m * 2] = fx; out[m * 2 + 1] = fz; m++; px = fx; pz = fz; at = far - 1;
      }
      return m;
    }
    function nearestFloor(x, z, out) {
      var bd = 1e9;
      for (var cz = 0; cz < GH; cz++) for (var cx = 0; cx < GW; cx++) { if (grid[cz * GW + cx]) continue; var d = (cx - x) * (cx - x) + (cz - z) * (cz - z); if (d < bd) { bd = d; out.x = cx; out.z = cz; } }
      return bd < 1e9;
    }


    function disposeRoom() {
      if (!roomGroup) return;
      scene.remove(roomGroup);
      roomGroup.traverse(function (o) { if (o.geometry && o.userData.own) o.geometry.dispose(); if (o.material && o.userData.ownMat) o.material.dispose(); });
      roomGroup = null; guards = [];
    }
    function setTier(n) { tier = n; LAMPS.forEach(function (l) { l.visible = n >= 2; }); guards.forEach(function (G) { lampOn(G, G.cone.visible); }); }
    /* a guard's real light follows his drawn cone: off when he is down, stunned or has given up */
    function lampOn(G, on) {
      G.cone.visible = on; if (!G.lamp) return;
      G.lamp.intensity = on && tier >= 2 ? G.cfg.lampI || 4.2 : 0; G.lamp.shadow.autoUpdate = on && tier >= 2; if (on) G.lamp.shadow.needsUpdate = true;
      G.cone.material.opacity = tier >= 2 ? .55 : 1;
    }
    function buildRoom(k) {
      disposeRoom();
      var vault = k >= N, b = vault ? null : BLOCKS[k], i, x, z;
      room = vault ? makeRoom(data.title + "|vault", "open", 0) : makeRoom(data.title + "|" + b.id, b.room, b.squad.length + 1);
      grid.set(room.grid);
      roomGroup = new THREE.Group(); scene.add(roomGroup);
      var W = new Bake(), Cr = new Bake(), Pr = new Bake(), rnd = seeded("decor:" + (vault ? "vault" : b.id)), metal = TH.metal, isWall = function (ax, az) { return ax >= 0 && az >= 0 && ax < GW && az < GH && room.grid[az * GW + ax] === 1 && !(ax === DOOR_X && az === 0); };
      for (z = 0; z < GH; z++) for (x = 0; x < GW; x++) {
        var v = room.grid[z * GW + x];
        if (x === DOOR_X && z === 0) continue;
        if (v === 1) {
          pushBox(W, x, WALL_H / 2, z, 1, WALL_H, 1, 0xffffff, 0xffffff, [false, isWall(x, z + 1), isWall(x, z - 1), isWall(x + 1, z), isWall(x - 1, z)]);
          /* things on top of the walls: vents, pipes and small lamps, so the blocks do not look bare from above */
          var q = rnd();
          if (q < .1) { Pr.add("box", metal, x, WALL_H + .04, z, .52, .08, .52); Pr.add("box", 0x15171b, x, WALL_H + .085, z, .4, .01, .4); }
          else if (q < .26 && isWall(x + 1, z)) { Pr.add("cyl", metal, x + .5, WALL_H + .07, z - .22, .11, 1.0, .11, 0, 0, HP); Pr.add("cyl", 0x30343c, x + .1, WALL_H + .07, z - .22, .14, .06, .14, 0, 0, HP); }
          else if (q < .36 && isWall(x, z + 1) && z > 0 && z < GH - 2) { Pr.add("cyl", metal, x + .24, WALL_H + .07, z + .5, .1, 1.0, .1, HP, 0, 0); }
          else if (q < .5 && !isWall(x, z + 1) && z < GH - 1) {
            Pr.add("box", 0x20232a, x, WALL_H + .03, z + .34, .3, .07, .16); mesh(roomGroup, GEO.box, glow(0xffffff), x, WALL_H + .04, z + .43, .22, .05, .04);
            var pool = mesh(roomGroup, GEO.disc, poolMat, x, .016, z + 1.05, 1.7, 1.7, 1); pool.rotation.x = -HP;
          }
        } else if (v === 2) {
          if ((x * 7 + z * 13) % 5 === 0) {
            Pr.add("cyl", TH.barrel, x, .4, z, .68, .8, .68); Pr.add("cyl", 0x20232a, x, .24, z, .71, .05, .71); Pr.add("cyl", 0x20232a, x, .58, z, .71, .05, .71); Pr.add("cyl", 0x30343c, x, .805, z, .6, .012, .6); Pr.add("cyl", 0x15171b, x + .16, .815, z + .1, .1, .014, .1);
          } else {
            var hh = .62 + ((x * 3 + z * 5) % 3) * .07; Cr.add("box", 0xffffff, x, hh / 2, z, .86, hh, .86, 0, (((x * 7 + z * 13) % 9) - 4) * .03, 0);
            if ((x + z) % 4 === 0) Cr.add("box", 0xffffff, x + .08, hh + .19, z - .06, .5, .38, .5, 0, .4, 0);
          }
        }
      }
      /* a thin glowing strip along every wall edge that faces the floor, and a pool of cool light under each wall lamp */
      var Ne = new Bake();
      for (z = 0; z < GH; z++) for (x = 0; x < GW; x++) {
        if (!isWall(x, z)) continue;
        if (z < GH - 1 && room.grid[(z + 1) * GW + x] !== 1) Ne.add("box", 0xffffff, x, WALL_H + .012, z + .485, 1, .024, .035);
        if (z > 0 && room.grid[(z - 1) * GW + x] !== 1 && !(x === DOOR_X && z === 1)) Ne.add("box", 0xffffff, x, WALL_H + .012, z - .485, 1, .024, .035);
        if (x < GW - 1 && room.grid[z * GW + x + 1] !== 1) Ne.add("box", 0xffffff, x + .485, WALL_H + .012, z, .035, .024, 1);
        if (x > 0 && room.grid[z * GW + x - 1] !== 1) Ne.add("box", 0xffffff, x - .485, WALL_H + .012, z, .035, .024, 1);
      }
      if (Ne.p.length) roomGroup.add(Ne.mesh(glow(TH.glowLine), false));
      roomGroup.add(W.mesh(matWall));
      if (Cr.p.length) roomGroup.add(Cr.mesh(matCrate));
      if (Pr.p.length) roomGroup.add(Pr.mesh(matProp));
      doorSlab = mesh(roomGroup, GEO.box, matDoor, DOOR_X, .44, 0, .98, .88, .34); doorSlab.castShadow = true;
      doorLamp = mesh(roomGroup, GEO.box, new THREE.MeshBasicMaterial({ color: lin(0xff3b2f), toneMapped: false }), DOOR_X, .94, .16, .62, .07, .1); doorLamp.userData.ownMat = true;
      doorGlow = mesh(roomGroup, GEO.plane, addMat(0x9dffc0, 0), DOOR_X, .02, .1, 1, 1.4, 1); doorGlow.rotation.x = -HP; doorGlow.userData.ownMat = true;
      var mat2 = mesh(roomGroup, GEO.plane, new THREE.MeshBasicMaterial({ map: matTex, color: lin(TH.accent), transparent: true, opacity: .5, depthWrite: false, toneMapped: false }), DOOR_X, .012, 1.05, .9, .9, 1); mat2.rotation.x = -HP; mat2.userData.ownMat = true;
      var pad = mesh(roomGroup, GEO.ring, new THREE.MeshBasicMaterial({ color: lin(TH.sash), transparent: true, opacity: .35, depthWrite: false, toneMapped: false }), START_X, .012, START_Z, .9); pad.rotation.x = -HP; pad.userData.ownMat = true;
      doorOpen = 0; doorWant = 0; grid[DOOR_X] = 1;
      guards = [];
      room.routes.forEach(function (rt, gi2) {
        var boss = gi2 === 0, key = boss ? b.boss : b.squad[gi2 - 1], cfg = boss ? BOSS[key] : GUARD[key];
        var G = { boss: boss, type: key, power: boss ? key : null, cfg: cfg, route: rt, x: 0, z: 0, a: 0, state: "patrol", t: 0, wi: 0, alive: true, hp: 1, speed: 1, run: 2, half: cfg.half, range: cfg.range, turn: cfg.turn, react: cfg.react,
          path: new Float32Array(128), pn: 0, pi: 0, lost: 0, aim: 0, lx: 0, lz: 0, ldx: 0, ldz: 0, phase: 0, probes: 0, boost: 1, base: 0, fall: 0, walk: 0, moved: false, ran: false, cool: 0, patient: null, wait: 0, revived: false,
          rnd: seeded(String(rt.seed)), leg: 0, flipAt: -1, di: 0, dirn: 1, jt: 1, recoil: 0, swing: 0, back: "patrol", seenT: 0, fig: buildFigure(cfg, boss ? "boss" : "guard"), cone: null, pos: null, mark: null, dome: null, shielded: false, lamp: LAMPS[gi2] || null };
        roomGroup.add(G.fig.g);
        var geo = new THREE.BufferGeometry(), pos = new Float32Array((RAYS + 2) * 3), colr = new Float32Array((RAYS + 2) * 3), ind = [];
        for (i = 0; i < RAYS + 2; i++) { var f = i === 0 ? .34 : .07; colr[i * 3] = colr[i * 3 + 1] = colr[i * 3 + 2] = f; pos[i * 3 + 1] = .04; }
        for (i = 1; i <= RAYS; i++) ind.push(0, i + 1, i);
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(colr, 3)); geo.setIndex(ind);
        G.cone = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
        G.cone.frustumCulled = false; G.cone.userData.own = true; G.cone.userData.ownMat = true; G.pos = pos; roomGroup.add(G.cone);
        G.mark = new THREE.Sprite(MARK["!"]); G.mark.scale.setScalar(.6); G.mark.visible = false; roomGroup.add(G.mark);
        if (boss && key === "warden") { G.dome = mesh(roomGroup, GEO.sph, addMat(0x6fd0ff, .3), 0, .6, 0, 1.7); G.dome.userData.ownMat = true; }
        if (G.lamp) { G.lamp.color.set(cfg.cone || 0xfff0b8).convertSRGBToLinear(); G.lamp.angle = Math.min(1.3, cfg.drone ? .95 : cfg.half * 1.04 + .04); G.lamp.distance = cfg.drone ? 3.4 : cfg.range * 1.3; G.lamp.penumbra = cfg.drone ? .3 : .45; G.lamp.shadow.camera.far = G.lamp.distance; }
        guards.push(G);
      });
      for (i = guards.length; i < MAXG; i++) { LAMPS[i].intensity = 0; LAMPS[i].shadow.autoUpdate = false; }
      resetRoom(k);
    }
    /* put everyone back at their posts: the same room, so a new attempt is a fair one */
    function resetRoom(k) {
      var b = k < N ? BLOCKS[k] : null, res = b ? ROOMREC[k] : null, ease = res ? Math.max(.6, 1 - .1 * res.deaths) : 1, slow = res ? Math.min(.3, .06 * res.deaths) : 0;
      H.x = START_X; H.z = START_Z; H.a = -Math.PI / 2; H.alive = true; H.pathN = 0; H.pathI = 0; H.target = null; H.moving = false; H.sprintT = 0; H.potT = 0; H.safeT = 0; H.aim = null; H.atk = null; H.swing = H.swingV = -.4; H.kbx = H.kbz = 0; H.fall = 0; H.vx = 0; H.vz = -1;
      poseFall(H.fig, 0); H.fig.g.visible = true; potObj.visible = false; SMOKE.t = 0; smokeFx.visible = false; PROJ.on = false; bomb.visible = false; KN.on = false; knife.visible = false; BOX.on = false; boxObj.visible = false; keyObj.visible = false; KEYFLY.on = false; goalRing.visible = false;
      doorOpen = 0; doorWant = 0; grid[DOOR_X] = 1; if (doorLamp) setCol(doorLamp.material, 0xff3b2f);
      ALARM.t = 0; alarmUi();
      guards.forEach(function (G, gi2) {
        var rt = G.route, c = G.cfg;
        G.alive = true; G.hp = c.hp || 1; G.fall = 0; G.lost = 0; G.aim = 0; G.pn = 0; G.rnd = seeded(String(rt.seed)); G.leg = 0; G.flipAt = -1; G.di = 0; G.dirn = rt.dir; G.jt = .8 + G.rnd() * 1.5; G.recoil = 0; G.swing = 0; G.seenT = 0; G.boost = 1; G.cool = 0; G.patient = null; G.wait = 0; G.revived = false;
        G.speed = c.speed * ease; G.run = c.run * ease; G.react = c.react + slow;
        poseFall(G.fig, 0); G.fig.g.scale.setScalar(G.fig.scale); G.fig.ring.visible = true; if (G.fig.star) G.fig.star.visible = true; lampOn(G, true); setCol(G.cone.material, c.cone || 0xfff0b8); G.mark.visible = false;
        if (rt.kind === "sentry") { G.x = rt.pts[0].x; G.z = rt.pts[0].z; G.a = rt.dirs[0]; G.state = "pause"; G.t = rt.pause + 1; }
        else if (rt.kind === "loop") { var c0 = Math.floor(rt.phase * 4) % 4; G.x = rt.pts[c0].x; G.z = rt.pts[c0].z; G.wi = (c0 + rt.dir + 4) % 4; G.a = Math.atan2(rt.pts[G.wi].z - G.z, rt.pts[G.wi].x - G.x); G.state = "patrol"; }
        else { G.x = rt.pts[0].x + (rt.pts[1].x - rt.pts[0].x) * rt.phase; G.z = rt.pts[0].z + (rt.pts[1].z - rt.pts[0].z) * rt.phase; G.wi = rt.dir > 0 ? 1 : 0; G.a = Math.atan2(rt.pts[G.wi].z - G.z, rt.pts[G.wi].x - G.x); G.state = "patrol"; }
        /* nobody may be looking at the way in when the room starts */
        var dx = START_X - G.x, dz = START_Z - G.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d <= G.range + 1 && Math.abs(angDiff(Math.atan2(dz, dx), G.a)) <= G.half + .2 && G.half < 3) { G.a += Math.PI; if (rt.kind === "line") G.wi = 1 - G.wi; }
        if (res && res.cleared) { if (gi2 === 0) { G.alive = false; G.fall = 1; poseFall(G.fig, 1); lampOn(G, false); G.fig.ring.visible = false; if (G.fig.star) G.fig.star.visible = false; } else surrender(G); }
        G.shielded = false;
      });
      refreshShield();
      if (res && res.cleared) dropBox(guards.length ? guards[0].x : START_X, guards.length ? guards[0].z : START_Z - 3, true);
      renderTargets(); syncFigures(0);
    }

    /* ======================================================================
       Guards. Routine: patrol, pause, turn. When the hunter stands in a
       guard's light the guard NOTICES him and a reaction time starts; if it
       runs out with the hunter still in the light the guard strikes (a shot,
       or a charge for those without a gun). If the hunter gets out of the
       light first, the guard CHASES: he runs to where he last saw the hunter,
       then on in the direction the hunter was heading, and SEARCHES there
       before he gives up and walks back to his post.
       ====================================================================== */
    var ALARM = { t: 0, x: 0, z: 0, tick: 0 };
    var alarmEl = el("div", { class: "nthview-alarm nthview-hidden", role: "status" }, [el("b", { text: "ALARM" }), el("span", { text: "Every guard is coming. Break the line of sight and hide." })]);
    col.appendChild(alarmEl);
    function alarmUi() { var on = ALARM.t > 0; alarmEl.classList.toggle("nthview-hidden", !on); container.classList.toggle("nthview-alarmed", on); }
    function soldiersLeft() { var n = 0; for (var i = 1; i < guards.length; i++) if (guards[i].alive && guards[i].state !== "surrender") n++; return n; }
    function refreshShield() {
      var Bs = guards[0]; if (!Bs || Bs.power !== "warden") return;
      var was = Bs.shielded; Bs.shielded = Bs.alive && soldiersLeft() > 0; if (Bs.dome) Bs.dome.visible = Bs.shielded;
      if (was && !Bs.shielded && Bs.alive && S.mode === "play") { toast("The Warden's shield is down."); sfx("power"); }
    }
    function renderTargets() {
      targetRow.textContent = ""; var left = 0;
      guards.forEach(function (G, i) {
        var up = G.alive && G.state !== "surrender"; if (up) left++;
        var dot = el("span", { class: "nthview-tgt" + (i === 0 ? " nthview-bossdot" : "") + (up ? "" : " nthview-down"), title: G.cfg.name });
        if (up && i > 0) { dot.style.background = "#" + new THREE.Color(G.cfg.ring).getHexString(); dot.style.boxShadow = "0 0 6px #" + new THREE.Color(G.cfg.ring).getHexString(); }
        targetRow.appendChild(dot);
      });
      targetRow.setAttribute("aria-label", guards.length ? left + " of " + guards.length + " guards left" : "No guards here");
    }
    function setMark(G, kind) { G.mark.visible = !!kind; if (kind) G.mark.material = MARK[kind]; }
    function surrender(G) { G.state = "surrender"; G.fig.ring.visible = false; lampOn(G, false); setMark(G, null); G.fig.g.scale.set(G.fig.scale, G.fig.scale * .72, G.fig.scale); }
    function aware(G) { return G.state === "chase" || G.state === "fire" || G.state === "slash"; }
    function busy(G) { return G.state === "notice" || G.state === "fire" || G.state === "chase" || G.state === "slash" || G.state === "struck" || G.state === "stun" || G.state === "sweep" || G.state === "surrender"; }
    function coneCol(G, c) { setCol(G.cone.material, c); if (G.lamp) G.lamp.color.set(c).convertSRGBToLinear(); }
    function calm(G) { coneCol(G, G.cfg.cone || 0xfff0b8); setMark(G, null); G.boost = 1; G.aim = 0; }
    function pathTo(G, x, z) { if (!freeAt(x, z, HR)) { if (!nearestFloor(x, z, _np)) return 0; x = _np.x; z = _np.z; } G.pn = findPath(G.x, G.z, x, z, G.path); G.pi = 0; return G.pn; }
    function turnTo(G, want, rate) { var d = angDiff(want, G.a); if (Math.abs(d) <= rate) { G.a = want; return true; } G.a += d > 0 ? rate : -rate; return false; }
    /* walk toward a point, turning first; true on arrival */
    function walkTo(G, tx, tz, speed, dt) {
      var dx = tx - G.x, dz = tz - G.z, d = Math.sqrt(dx * dx + dz * dz), step = speed * dt;
      if (d <= step || d < .02) { G.x = tx; G.z = tz; return true; }
      var want = Math.atan2(dz, dx);
      turnTo(G, want, G.turn * (speed > G.speed * 1.2 ? 2.2 : 1) * dt);
      if (Math.abs(angDiff(want, G.a)) < .6) { G.x += dx / d * step; G.z += dz / d * step; G.moved = true; G.leg += step; }
      return false;
    }
    function followPath(G, speed, dt) {
      if (G.pi >= G.pn) return true;
      if (walkTo(G, G.path[G.pi * 2], G.path[G.pi * 2 + 1], speed, dt)) G.pi++;
      return G.pi >= G.pn;
    }
    function newLeg(G) {
      G.leg = 0; G.flipAt = -1;
      if (G.power === "sprinter" && G.route.kind === "line" && G.rnd() < .55) { var a = G.route.pts[0], b2 = G.route.pts[1]; G.flipAt = (.35 + G.rnd() * .4) * (Math.abs(b2.x - a.x) + Math.abs(b2.z - a.z)); }
    }
    function goHome(G) {
      var rt = G.route, pt = rt.kind === "sentry" ? rt.pts[0] : rt.pts[G.wi];
      calm(G); G.state = pathTo(G, pt.x, pt.z) ? "return" : (rt.kind === "sentry" ? "pause" : "patrol"); G.t = 1;
    }
    /* he has seen the hunter: remember where, and which way the hunter was going */
    function sight(G) { G.lx = H.x; G.lz = H.z; G.ldx = H.vx; G.ldz = H.vz; G.lost = 0; if (ALARM.t > 0) { ALARM.x = H.x; ALARM.z = H.z; } }
    function notice(G) {
      G.state = "notice"; G.t = G.react * (ALARM.t > 0 ? .7 : 1); G.aim = 0; G.patient = null; setMark(G, "!"); sight(G); sfx("alert");
      if (G.cfg.alarm) raiseAlarm(G);
      if (!S.seenHint) { S.seenHint = true; toast("Seen! Get out of his light before he strikes.", 2600); }
    }
    function startChase(G, x, z, dx, dz) {
      G.state = "chase"; G.phase = 0; G.lx = x; G.lz = z; G.ldx = dx; G.ldz = dz; G.aim = 0; G.lost = 0; G.probes = G.cfg.probes + (ALARM.t > 0 ? 1 : 0); setMark(G, "?"); coneCol(G, 0xffb347);
      if (!pathTo(G, x, z)) startSearch(G, G.cfg.search);
    }
    function startSearch(G, secs) { G.state = "search"; G.t = secs * (ALARM.t > 0 ? 1.4 : 1); G.base = G.a; setMark(G, "?"); coneCol(G, 0xffd27a); }
    function raiseAlarm(G) {
      var fresh = ALARM.t <= 0;
      ALARM.t = 10; ALARM.x = H.x; ALARM.z = H.z; ALARM.tick = 0; alarmUi();
      if (fresh) { sfx("siren"); say("Alarm! " + G.cfg.name + " has raised the alarm."); kick(.04); }
      guards.forEach(function (o) {
        if (o === G || !o.alive || busy(o) || o.state === "heal") return;
        o.patient = null; startChase(o, ALARM.x, ALARM.z, 0, 0); o.boost = o.cfg.melee ? 1.08 : 1.3;
      });
    }
    /* smoke hides: nobody sees into the cloud, or through it */
    var SMOKE = { t: 0, x: 0, z: 0, r: 1.9 };
    function smoked(G) {
      if (SMOKE.t <= 0) return false;
      var hx = H.x - SMOKE.x, hz = H.z - SMOKE.z; if (hx * hx + hz * hz <= SMOKE.r * SMOKE.r) return true;
      var ax = H.x - G.x, az = H.z - G.z, k = ((SMOKE.x - G.x) * ax + (SMOKE.z - G.z) * az) / (ax * ax + az * az || 1);
      if (k <= 0 || k >= 1) return false;
      var px = G.x + ax * k - SMOKE.x, pz = G.z + az * k - SMOKE.z; return px * px + pz * pz < SMOKE.r * SMOKE.r * .8;
    }
    function inLight(G, dx, dz, d) { return d <= G.range && (G.half > 3 || Math.abs(angDiff(Math.atan2(dz, dx), G.a)) <= G.half) && los(G.x, G.z, H.x, H.z, d) && !smoked(G); }
    /* the prowler: at any moment he may turn round, or snap a look to one side */
    function twitch(G, dt) {
      G.jt -= dt; if (G.jt > 0) return false;
      G.jt = .8 + G.rnd() * 2; var rt = G.route;
      if (G.rnd() < .5 && rt.kind !== "sentry") { if (rt.kind === "loop") { G.dirn = -G.dirn; G.wi = (G.wi + G.dirn + 4) % 4; } else G.wi = 1 - G.wi; newLeg(G); return false; }
      G.back = G.state; G.state = "glance"; G.t = .5; G.base = G.a + (G.rnd() < .5 ? 1 : -1) * (1.3 + G.rnd() * 1.5); return true;
    }
    function updateGuard(G, dt) {
      G.moved = false; G.ran = false;
      if (!G.alive) { if (G.fall < 1) { G.fall = Math.min(1, G.fall + dt * 3.2); poseFall(G.fig, G.fall); } return; }
      if (G.state === "surrender" || (S.mode !== "play" && S.mode !== "dead")) return;
      var dx = H.x - G.x, dz = H.z - G.z, d = Math.sqrt(dx * dx + dz * dz), rt = G.route, c = G.cfg;
      var lit = H.alive && S.mode === "play" && H.potT <= 0 && G.state !== "stun" && G.state !== "struck" && inLight(G, dx, dz, d);
      if (G.cool > 0) G.cool -= dt;
      if (G.recoil > 0) G.recoil -= dt;
      if (lit) G.seenT = c.track || 0; else if (G.seenT > 0) G.seenT -= dt;
      if (lit && !busy(G)) notice(G);
      switch (G.state) {
        case "notice":
          turnTo(G, Math.atan2(dz, dx), G.turn * 2.2 * dt);
          if (lit) {
            sight(G); G.t -= dt; coneCol(G, G.t < G.react * .5 ? 0xff5a3c : 0xff9a3c);
            if (G.t <= 0) { if (c.melee || c.noGun) startChase(G, H.x, H.z, H.vx, H.vz); else { G.state = "fire"; G.t = 0; } }
          } else { G.lost += dt; if (G.lost > .22 || !H.alive) { if (H.alive && S.mode === "play") startChase(G, G.lx, G.lz, G.ldx, G.ldz); else goHome(G); } }
          break;
        case "fire":
          if (H.alive) turnTo(G, Math.atan2(dz, dx), G.turn * 2.4 * dt);
          coneCol(G, 0xff3b30); setMark(G, "!");
          if (lit) { sight(G); G.t -= dt; if (G.t <= 0) { shoot(G, true); G.t = .5; } }
          else { G.lost += dt; if (G.lost > .3) { if (H.alive && S.mode === "play") startChase(G, G.lx, G.lz, G.ldx, G.ldz); else goHome(G); } }
          break;
        case "chase":
          G.ran = true;
          if (lit) {
            sight(G); setMark(G, "!"); coneCol(G, 0xff5a3c);
            if (c.melee || c.noGun) { G.wait -= dt; if (G.wait <= 0) { G.wait = .2; pathTo(G, H.x, H.z); G.phase = 0; } }
            else { G.aim += dt; if (G.aim >= G.react * .6) { G.state = "fire"; G.t = 0; break; } }
          } else {
            G.aim = Math.max(0, G.aim - dt); setMark(G, "?"); coneCol(G, 0xffb347);
            if (G.seenT > 0 && H.alive && H.potT <= 0) { G.wait -= dt; if (G.wait <= 0) { G.wait = .25; G.lx = H.x; G.lz = H.z; G.ldx = H.vx; G.ldz = H.vz; G.phase = 0; pathTo(G, H.x, H.z); } }
          }
          if (followPath(G, G.run * G.boost, dt)) {
            if (G.phase === 0 && (G.ldx || G.ldz)) {
              /* nobody at the last place he saw the hunter: carry on the way the hunter was heading */
              G.phase = 1; var gl = Math.sqrt(G.ldx * G.ldx + G.ldz * G.ldz) || 1;
              if (!pathTo(G, G.lx + G.ldx / gl * 3.5, G.lz + G.ldz / gl * 3.5)) startSearch(G, c.search);
            } else startSearch(G, c.search);
          }
          break;
        case "search":
          G.t -= dt;
          if (c.jumpy) { G.jt -= dt; if (G.jt <= 0) { G.jt = .3 + G.rnd() * .5; G.base = G.rnd() * 6.283; } turnTo(G, G.base, G.turn * 2 * dt); }
          else G.a = G.base + Math.sin((c.search - G.t) * 2.6) * 1.25;
          if (G.t <= 0) {
            if (G.probes > 0) {
              G.probes--; var pa = G.rnd() * 6.28, pr = 2 + G.rnd() * 2.5, px = ALARM.t > 0 ? ALARM.x : G.x + Math.cos(pa) * pr, pz = ALARM.t > 0 ? ALARM.z : G.z + Math.sin(pa) * pr;
              if (pathTo(G, px, pz)) { G.state = "probe"; break; }
            }
            goHome(G);
          }
          break;
        case "probe": G.ran = true; if (followPath(G, G.run * .8 * G.boost, dt)) startSearch(G, c.search * .6); break;
        case "seek": G.ran = true; if (followPath(G, G.run * .8, dt)) startSearch(G, c.search * .7); break;
        case "glance": turnTo(G, G.base, G.turn * 2 * dt); G.t -= dt; if (G.t <= 0) G.state = G.back; break;
        case "struck": break;
        case "slash":
          /* the blade's swing: it lands when the swing ends, if the hunter is still within reach */
          G.t -= dt; G.swing = 1 - Math.max(0, G.t) / .22;
          if (G.t <= 0) {
            G.swing = 0; G.state = "chase"; G.wait = 0;
            if (H.alive && S.mode === "play" && !H.atk && H.potT <= 0 && d < 1.05) { slashFx(0, H.x, H.z, G.a); hurt(G, "blade"); if (H.alive) knockBack(G, 1.2); }
          }
          break;
        case "patrol":
          if (c.jumpy && twitch(G, dt)) break;
          if (rt.kind === "sentry") { G.state = "pause"; G.t = rt.pause + 1; break; }
          if (walkTo(G, rt.pts[G.wi].x, rt.pts[G.wi].z, G.speed, dt)) {
            if (rt.kind === "loop") { G.wi = (G.wi + G.dirn + 4) % 4; newLeg(G); }
            else { G.state = "pause"; G.t = (G.power === "sprinter" ? .25 : rt.pause) * (c.pauseMul || 1); }
          } else if (G.flipAt > 0 && G.leg >= G.flipAt) { G.wi = 1 - G.wi; newLeg(G); }
          break;
        case "pause":
          G.t -= dt;
          if (G.t <= 0) {
            if (rt.kind === "sentry") { G.di = (G.di + 1) % rt.dirs.length; G.state = "turn"; }
            else { G.wi = 1 - G.wi; G.state = "patrol"; newLeg(G); }
          }
          break;
        case "turn": if (turnTo(G, rt.dirs[G.di], G.turn * .6 * dt)) { G.state = "pause"; G.t = (rt.pause + 1.4) * (c.pauseMul || 1); } break;
        case "return": if (followPath(G, G.speed * 1.15, dt)) { G.state = rt.kind === "sentry" ? "pause" : "patrol"; G.t = 1; newLeg(G); } break;
        case "stun": G.t -= dt; if (G.t <= 0) { G.state = "sweep"; G.t = 3.2; lampOn(G, true); } break;
        case "sweep": G.t -= dt; G.a += 1.97 * dt; if (lit) { notice(G); break; } if (G.t <= 0) goHome(G); break;
        case "revive":
          if (!G.patient || G.patient.alive) { G.patient = null; goHome(G); break; }
          G.ran = true; if (followPath(G, G.run * .8, dt)) { G.state = "heal"; G.t = 2.6; setMark(G, "+"); }
          break;
        case "heal":
          G.t -= dt; if (lit) { notice(G); break; }
          if (!G.patient || G.patient.alive) { G.patient = null; goHome(G); break; }
          if (G.t <= 0) { wake(G.patient); G.patient = null; goHome(G); }
          break;
      }
      /* a blade who has seen the hunter cuts him down when he gets there, unless the hunter is behind him */
      if (c.melee && aware(G) && G.state !== "slash" && H.alive && S.mode === "play" && !H.atk && H.potT <= 0 && d < .8 && H.safeT <= 0 && Math.abs(angDiff(Math.atan2(dz, dx), G.a)) < 1.25) swing(G);
      if (G.moved) G.walk += dt * (G.ran ? 15 : 9) * Math.max(1, G.speed);
    }
    function wake(D) {
      D.alive = true; D.hp = D.cfg.hp || 1; D.fall = 0; D.revived = true; poseFall(D.fig, 0); D.fig.ring.visible = true; lampOn(D, true); calm(D); startSearch(D, 2);
      renderTargets(); refreshShield(); sfx("power"); toast("A medic woke " + (D.cfg.name === "Officer" ? "an" : "a") + " " + D.cfg.name + ". Take the medic down first.", 3000);
    }
    function hurt(G, how) {
      if (H.safeT > 0) return;
      if (S.inv.vest > 0) { S.inv.vest--; renderPowers(); H.safeT = 1.8; hitFlash(); toast("The vest took the " + how + ". Get away!", 2200); say("The vest took the " + how + "."); return; }
      die(G, how);
    }
    function shoot(G, hit) {
      var gx = G.x + Math.cos(G.a) * .5, gz = G.z + Math.sin(G.a) * .5, tx = hit ? H.x : G.lx, tz = hit ? H.z : G.lz;
      tracer.position.set((gx + tx) / 2, .6, (gz + tz) / 2); tracer.rotation.y = -Math.atan2(tz - gz, tx - gx); tracer.scale.x = Math.max(.2, Math.sqrt((tx - gx) * (tx - gx) + (tz - gz) * (tz - gz)));
      tracer.material.opacity = 1; tracerT = .12; flashLight.position.set(gx, .7, gz); flashLight.intensity = 3; G.recoil = .14; sfx("shot"); puff(tx, .5, tz, 2, 0xffe0a0);
      if (hit) { hitSpr.position.set(H.x, .8, H.z); hitSpr.visible = true; hitT = .16; hurt(G, "shot"); }
    }
    /* a blade who has reached the hunter swings; the cut lands at the end of the swing */
    function swing(G) { G.state = "slash"; G.t = .22; G.swing = 0; G.a = Math.atan2(H.z - G.z, H.x - G.x); setMark(G, "!"); sfx("slash"); }
    function alarmOthers(G) {
      var any = false;
      guards.forEach(function (o) {
        if (o === G || !o.alive || busy(o) || o.state === "heal" || o.state === "revive") return;
        var dx = o.x - G.x, dz = o.z - G.z; if (dx * dx + dz * dz <= 25) {
          if (o.cfg.medic && !G.boss && !G.cfg.drone && !G.revived && !o.patient) { o.patient = G; o.state = "revive"; setMark(o, "+"); if (!pathTo(o, G.x, G.z)) { o.patient = null; goHome(o); } }
          else if (pathTo(o, G.x, G.z)) { o.state = "seek"; o.probes = 0; setMark(o, "?"); coneCol(o, 0xffd27a); }
          any = true;
        }
      });
      if (any) { sfx("huh"); if (!G.boss && !S.heardHint) { S.heardHint = true; toast("The others heard that. Get out of sight!", 2600); } }
    }
    function knockBack(G, dist) {
      var dx = H.x - G.x, dz = H.z - G.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
      for (var s = dist; s > 0; s -= .15) if (freeAt(H.x + dx / d * s, H.z + dz / d * s, HR)) { H.x += dx / d * s; H.z += dz / d * s; break; }
      H.pathN = 0; H.moving = false; H.target = null; H.bounceT = .5;
    }
    /* the hunter has reached a guard. It is a takedown unless something about this guard stops it. */
    function strike(G) {
      if (H.atk || G.state === "struck") return;
      var front = Math.abs(angDiff(Math.atan2(H.z - G.z, H.x - G.x), G.a)) < 1.2;
      if (G.shielded) { if (H.bounceT <= 0) { knockBack(G, 1); sfx("clang"); toast("Shielded! Take down the soldiers first."); } return; }
      if (G.state === "stun") { if (H.bounceT <= 0) knockBack(G, .6); return; }
      if (!G.cfg.drone) {
        if (G.cfg.frontProof && front) { if (H.bounceT <= 0) { knockBack(G, 1); sfx("clang"); toast("His shield stops you. Get behind him."); if (!busy(G)) notice(G); G.t = Math.min(G.t, .25); } return; }
        if (aware(G) && front) {   /* never run at a guard who is already after you */
          if (H.bounceT > 0 || G.state === "slash") return;
          if (G.cfg.melee) swing(G); else { G.state = "fire"; G.t = .5; G.a = Math.atan2(H.z - G.z, H.x - G.x); shoot(G, true); if (H.alive) knockBack(G, 1); }
          return;
        }
      }
      startAttack(G);
    }
    /* the takedown: the hunter steps in and cuts twice with his sword, then the guard goes down */
    function startAttack(G) {
      H.atk = { G: G, t: 0, c: 0 }; H.pathN = 0; H.target = null; H.moving = false; H.safeT = Math.max(H.safeT, .5); H.a = Math.atan2(G.z - H.z, G.x - H.x);
      G.state = "struck"; setMark(G, null); lampOn(G, false); endPot();
    }
    function updateAttack(dt) {
      var A = H.atk, G = A.G, dx = G.x - H.x, dz = G.z - H.z, d = Math.sqrt(dx * dx + dz * dz) || 1, k;
      A.t += dt; H.a = Math.atan2(dz, dx);
      if (d > .62) { var st = Math.min(d - .62, 6 * dt); if (freeAt(H.x + dx / d * st, H.z + dz / d * st, HR)) { H.x += dx / d * st; H.z += dz / d * st; } }
      if (A.c === 0) { A.c = 1; sfx("slash"); slashFx(0, G.x, G.z, H.a - .55); }
      if (A.c === 1 && A.t >= .18) { A.c = 2; sfx("slash"); slashFx(1, G.x, G.z, H.a + .55); puff(G.x, .6, G.z, 3); kick(.03); G.a += .6; }
      k = Math.max(0, Math.min(1, A.t < .18 ? A.t / .16 : (A.t - .18) / .16)); k = k * k * (3 - 2 * k);
      H.swing = A.t < .18 ? -1.75 + 3.2 * k : 1.45 - 3.2 * k;
      if (A.t >= .36) { H.atk = null; if (G.hp > 1) stagger(G, true); else takedown(G); }
    }
    function stagger(G, push) {
      G.hp--; G.state = "stun"; G.t = 1.1; lampOn(G, false); setMark(G, null); if (push) knockBack(G, .9); sfx("clang"); kick(.05);
      toast((G.boss ? G.cfg.name : "The " + G.cfg.name) + " staggers. Hide, then hit him again!", 2400);
    }
    /* the arc a blade leaves in the air; two of them make the hunter's double cut */
    function slashFx(i, x, z, ang) {
      SLASH[i].position.x = x - Math.cos(ang) * .35; SLASH[i].position.z = z - Math.sin(ang) * .35; SLASH[i].rotation.z = -ang; SLASH[i].material.opacity = 1; slashT[i] = .26;
      hitSpr.position.set(x, .8, z); hitSpr.visible = true; hitT = .16;
    }
    function takedown(G) {
      G.alive = false; G.state = "down"; G.fall = 0; G.fig.ring.visible = false; lampOn(G, false); setMark(G, null); if (G.dome) G.dome.visible = false; if (G.fig.star) G.fig.star.visible = false;
      if (!settings.reduced) slowT = G.boss ? .5 : .22;
      puff(G.x, .5, G.z, 4); kick(G.boss ? .06 : .03);
      if (!G.revived) { var n = G.boss ? 8 : 3; S.gems += n; flyGems(G.x, G.z, n); }
      guards.forEach(function (o) { if (o.patient === G) o.patient = null; });
      if (H.target === G) { H.target = null; H.pathN = 0; H.moving = false; }
      alarmOthers(G); renderTargets(); refreshShield();
      say(G.cfg.name + " is down.");
      if (G.boss) bossDown(G);
    }
    function dropBox(x, z, quiet) {
      BOX.on = true; BOX.x = x; BOX.z = z; BOX.fall = quiet ? 1 : 0; BOX.open = 0; boxObj.visible = true; boxObj.position.set(x, quiet ? 0 : 2.6, z); boxLid.position.y = .37; boxLid.rotation.z = 0;
      goalRing.visible = true; goalRing.position.set(x, .035, z);
    }
    function bossDown(G) {
      var k = S.k, left = soldiersLeft();
      for (var i = 1; i < guards.length; i++) if (guards[i].alive) surrender(guards[i]);
      ALARM.t = 0; alarmUi(); renderTargets();
      if (!left) { S.gems += 5; setTimeout(function () { toast("Clean sweep! +5 gems", 1800); renderScore(); bump(gemChip); }, 900); }
      ROOMREC[k].cleared = true; S.mode = "clear"; H.aim = null; endPot(); renderPowers();
      dropBox(G.x, G.z, false);
      setTimeout(function () { if (S.mode === "clear") { toast(G.cfg.name + " is down" + (left ? " and the guards give up" : "") + ". Take the secret box.", 3200); } }, settings.reduced ? 100 : 900);
      persist();
    }
    function die(G, how) {
      if (!H.alive) return;
      H.alive = false; H.fall = 0; H.pathN = 0; H.moving = false; H.target = null; H.atk = null; S.mode = "dead"; S.killer = G; S.killHow = how;
      var kd = Math.sqrt((H.x - G.x) * (H.x - G.x) + (H.z - G.z) * (H.z - G.z)) || 1; H.kbx = (H.x - G.x) / kd * 2.4; H.kbz = (H.z - G.z) / kd * 2.4; H.a = Math.atan2(G.z - H.z, G.x - H.x); endPot();
      S.deaths++; ROOMREC[S.k].deaths++; hitFlash(); kick(.09); if (!settings.reduced) slowT = .5;
      say(hero + " was caught."); saveNow();
      setTimeout(function () { if (S.mode === "dead") deathCard(G); }, settings.reduced ? 350 : 1200);
    }

    /* ---------- the hunter ---------- */
    var KEYS = { up: false, down: false, left: false, right: false }, _np = { x: 0, z: 0 };
    function canMove() { return (S.mode === "play" || S.mode === "clear" || S.mode === "trial" || S.mode === "exit") && !S.paused && H.alive; }
    function goTo(x, z, ring) {
      if (!freeAt(x, z, HR)) { if (!nearestFloor(x, z, _np)) return false; x = _np.x; z = _np.z; }
      var n = findPath(H.x, H.z, x, z, H.path);
      if (!n) return false;
      H.pathN = n; H.pathI = 0; H.moving = true;
      if (ring) { tapRing.position.set(x, .03, z); tapT = .5; }
      return true;
    }
    function guardNear(x, z, r) {
      var best = null, bd = r * r;
      for (var i = 0; i < guards.length; i++) { var G = guards[i]; if (!G.alive || G.state === "surrender") continue; var d = (G.x - x) * (G.x - x) + (G.z - z) * (G.z - z); if (d < bd) { bd = d; best = G; } }
      return best;
    }
    /* what a thrown knife or grenade goes for: the guard the hunter is facing, or else the nearest one in plain sight */
    function pickTarget() {
      var best = null, bd = 1e9, face = null, fd = 1e9;
      for (var i = 0; i < guards.length; i++) {
        var G = guards[i]; if (!G.alive || G.state === "surrender" || G.state === "struck") continue;
        var dx = G.x - H.x, dz = G.z - H.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d > 7.5 || !los(H.x, H.z, G.x, G.z, d)) continue;
        if (d < bd) { bd = d; best = G; }
        if (Math.abs(angDiff(Math.atan2(dz, dx), H.a)) < .5 && d < fd) { fd = d; face = G; }
      }
      return face || best;
    }
    var PROJ = { on: false, kind: "", x0: 0, z0: 0, x1: 0, z1: 0, t: 0 };
    function launch(kind, x, z) { PROJ.on = true; PROJ.kind = kind; PROJ.x0 = H.x; PROJ.z0 = H.z; PROJ.x1 = x; PROJ.z1 = z; PROJ.t = 0; bomb.visible = true; setCol(bomb.material, kind === "grenade" ? 0x3f5a2a : 0xaab4c2); sfx("slash"); }
    function throwAt(kind) {
      if (KN.on || PROJ.on) return;
      var G = pickTarget(); if (!G) { toast("No guard in plain sight."); return; }
      endPot(); S.inv[kind]--; renderPowers(); H.a = Math.atan2(G.z - H.z, G.x - H.x); H.pathN = 0; H.target = null;
      if (kind === "knife") { KN.on = true; KN.x = H.x; KN.z = H.z; KN.G = G; knife.visible = true; sfx("slash"); } else launch("grenade", G.x, G.z);
    }
    function throwSmoke(x, z) {
      if (PROJ.on || !S.inv.smoke) return;
      var dx = x - H.x, dz = z - H.z, d = Math.sqrt(dx * dx + dz * dz) || 1, m = Math.min(d, 6.5); x = H.x + dx / d * m; z = H.z + dz / d * m;
      if (!freeAt(x, z, .1) && nearestFloor(x, z, _np)) { x = _np.x; z = _np.z; }
      endPot(); S.inv.smoke--; H.aim = null; renderPowers(); H.a = Math.atan2(dz, dx); launch("smoke", x, z);
    }
    function smokeAhead() { var r = Math.max(.8, Math.min(3.2, castRay(H.x, H.z, H.a, 3.7) - .5)); throwSmoke(H.x + Math.cos(H.a) * r, H.z + Math.sin(H.a) * r); }
    function explode(x, z) {
      sfx("boom"); kick(.1); flashLight.position.set(x, .8, z); flashLight.intensity = 7; puff(x, .5, z, 8, 0xffc070); boomRing.position.set(x, .05, z); boomT = .4;
      if (S.mode !== "play") return;
      var hit = guards.filter(function (G) { return G.alive && G.state !== "surrender" && (G.x - x) * (G.x - x) + (G.z - z) * (G.z - z) <= 3.3; });
      hit.forEach(function (G) {
        if (!G.alive || G.state === "surrender") return;
        if (G.shielded) { toast("The Warden's shield holds."); return; }
        if (H.atk && H.atk.G === G) H.atk = null;
        if (G.hp > 1) stagger(G, false); else takedown(G);
      });
      /* everyone heard that */
      guards.forEach(function (o) { if (!o.alive || busy(o) || o.state === "heal" || o.state === "revive") return; if (pathTo(o, x, z)) { o.state = "seek"; o.probes = 0; setMark(o, "?"); coneCol(o, 0xffd27a); } });
    }
    function updateProj(dt) {
      if (SMOKE.t > 0) { SMOKE.t -= dt; if (SMOKE.t <= 0) { smokeFx.visible = false; if (S.mode === "play") toast("The smoke clears."); } }
      if (H.potT > 0) { H.potT -= dt; if (H.potT <= 0) { endPot(); toast("The disguise is over."); } }
      if (!PROJ.on) return;
      PROJ.t += dt / .45; var k = Math.min(1, PROJ.t);
      bomb.position.set(PROJ.x0 + (PROJ.x1 - PROJ.x0) * k, .55 + Math.sin(k * Math.PI) * 1.5, PROJ.z0 + (PROJ.z1 - PROJ.z0) * k); bomb.rotation.x += dt * 12;
      if (k >= 1) {
        PROJ.on = false; bomb.visible = false;
        if (PROJ.kind === "grenade") explode(PROJ.x1, PROJ.z1);
        else { SMOKE.t = 6; SMOKE.x = PROJ.x1; SMOKE.z = PROJ.z1; smokeFx.position.set(SMOKE.x, 0, SMOKE.z); smokeFx.visible = true; sfx("power"); puff(SMOKE.x, .5, SMOKE.z, 6); say("Smoke. Nobody can see into it."); }
      }
    }
    /* the flower-pot disguise ends when it runs out, or when the hunter moves, strikes or throws */
    function endPot() { if (H.potT > 0 || potObj.visible) { H.potT = 0; potObj.visible = false; H.fig.g.visible = true; } }
    function tapAt(x, z) {
      if (!canMove()) return;
      if (S.mode === "play" && H.aim === "smoke") { throwSmoke(x, z); return; }
      endPot();
      if (S.mode === "play") {
        var G = guardNear(x, z, .85);
        if (G) { H.target = G; H.repath = 0; tapRing.position.set(G.x, .03, G.z); tapT = .5; return; }
      }
      H.target = null;
      if (S.mode === "exit" && Math.abs(x - DOOR_X) < .8 && z < .9) { goTo(DOOR_X, 0, true); return; }
      if (S.mode === "clear" && BOX.on && Math.abs(x - BOX.x) < .8 && Math.abs(z - BOX.z) < .8) { goTo(BOX.x, BOX.z, true); return; }
      goTo(x, z, true);
    }
    function updateHero(dt) {
      if (!H.alive) {
        if (H.fall < 1) { H.fall = Math.min(1, H.fall + dt * 3); poseFall(H.fig, H.fall); var kx2 = H.kbx * dt * (1 - H.fall), kz2 = H.kbz * dt * (1 - H.fall); if (freeAt(H.x + kx2, H.z + kz2, HR)) { H.x += kx2; H.z += kz2; } }
        return;
      }
      if (H.sprintT > 0) H.sprintT -= dt;
      if (H.safeT > 0) H.safeT -= dt;
      if (H.bounceT > 0) H.bounceT -= dt;
      if (H.atk) { if (S.mode === "play") updateAttack(dt); else H.atk = null; H.moving = false; return; }
      var auto = S.mode === "finaleplay" && !S.paused;
      if (!canMove() && !auto) { H.moving = false; return; }
      var speed = 5 * (H.sprintT > 0 ? 1.9 : 1), kx = (KEYS.right ? 1 : 0) - (KEYS.left ? 1 : 0), kz = (KEYS.down ? 1 : 0) - (KEYS.up ? 1 : 0), step, ox = H.x, oz = H.z;
      if ((kx || kz) && !auto) {
        var kl = Math.sqrt(kx * kx + kz * kz); step = speed * dt; H.pathN = 0; H.target = null; H.moving = true; H.a = Math.atan2(kz, kx); endPot();
        if (freeAt(H.x + kx / kl * step, H.z, HR)) H.x += kx / kl * step;
        if (freeAt(H.x, H.z + kz / kl * step, HR)) H.z += kz / kl * step;
      } else {
        if (H.target) {
          if (!H.target.alive || H.target.state === "surrender") { H.target = null; H.pathN = 0; }
          else {
            H.repath -= dt;
            if (H.repath <= 0) { H.repath = .18; var n = findPath(H.x, H.z, H.target.x, H.target.z, H.path); H.pathN = n; H.pathI = 0; }
            var td = Math.sqrt((H.target.x - H.x) * (H.target.x - H.x) + (H.target.z - H.z) * (H.target.z - H.z));
            if (td < 1.9) speed *= 1.7;   /* the lunge */
          }
        }
        if (H.pathI < H.pathN) {
          var tx = H.path[H.pathI * 2], tz = H.path[H.pathI * 2 + 1], dx = tx - H.x, dz = tz - H.z, d = Math.sqrt(dx * dx + dz * dz); step = speed * dt;
          if (d <= step) { H.x = tx; H.z = tz; H.pathI++; } else { H.x += dx / d * step; H.z += dz / d * step; H.a = Math.atan2(dz, dx); }
          H.moving = true;
        } else H.moving = false;
      }
      if (H.moving) { H.walk += dt * 22; var mx = H.x - ox, mz = H.z - oz; if (mx * mx + mz * mz > 1e-7) { H.vx = mx; H.vz = mz; } }
      var i, G, gd;
      if (S.mode === "play") {
        if (H.potT <= 0) for (i = 0; i < guards.length; i++) { G = guards[i]; if (!G.alive || G.state === "surrender") continue; gd = (G.x - H.x) * (G.x - H.x) + (G.z - H.z) * (G.z - H.z); if (gd < .4) { strike(G); break; } }
      } else if (S.mode === "clear" && BOX.on && BOX.fall >= 1) {
        if ((BOX.x - H.x) * (BOX.x - H.x) + (BOX.z - H.z) * (BOX.z - H.z) < .36) takeBox();
      } else if (S.mode === "exit" && H.z < .3) { H.pathN = 0; H.moving = false; leaveRoom(); }
      else if (auto && S.finale.done && H.z < .3) { H.pathN = 0; H.moving = false; reachedExit(); }
    }
    function updateKnife(dt) {
      if (!KN.on) return;
      var G = KN.G, dx = G.x - KN.x, dz = G.z - KN.z, d = Math.sqrt(dx * dx + dz * dz), step = 15 * dt;
      if (d <= step + .3) {
        KN.on = false; knife.visible = false;
        if (G.alive && S.mode === "play") {
          if (G.shielded) { sfx("clang"); toast("The shield stops the knife."); }
          else if (G.cfg.frontProof && Math.abs(angDiff(Math.atan2(H.z - G.z, H.x - G.x), G.a)) < 1.2) { sfx("clang"); toast("His shield stops the knife."); if (!busy(G)) notice(G); }
          else if (G.state === "struck") { /* the hunter got there first */ }
          else if (G.hp > 1) stagger(G, false);
          else { slashFx(0, G.x, G.z, Math.atan2(G.z - H.z, G.x - H.x)); takedown(G); }
        }
        return;
      }
      KN.x += dx / d * step; KN.z += dz / d * step; knife.position.set(KN.x, .6, KN.z); knife.rotation.y = -Math.atan2(dz, dx);
    }
    function updateAlarm(dt) {
      if (ALARM.t <= 0) return;
      ALARM.t -= dt; ALARM.tick -= dt;
      if (ALARM.t <= 0 || S.mode !== "play") { ALARM.t = 0; alarmUi(); return; }
      if (ALARM.tick <= 0) {
        /* the guards talk to each other: everyone who is chasing without a sighting heads for the newest one */
        ALARM.tick = 1;
        for (var i = 0; i < guards.length; i++) { var G = guards[i]; if (G.alive && G.state === "chase" && G.aim <= 0 && (Math.abs(G.lx - ALARM.x) + Math.abs(G.lz - ALARM.z)) > 1.5) { G.lx = ALARM.x; G.lz = ALARM.z; G.ldx = 0; G.ldz = 0; G.phase = 0; pathTo(G, ALARM.x, ALARM.z); } }
      }
    }

    /* ---------- one-time powers ---------- */
    /* the powers the hunter can use himself; the vest works on its own */
    function usable() { return REWARDS.filter(function (p2) { return p2 !== "vest" && S.inv[p2] > 0; }); }
    function renderPowers() {
      powerBar.textContent = "";
      var show = S.mode === "play" || S.mode === "lesson", act = usable();
      if (act.indexOf(S.sel) === -1) S.sel = act[0] || null;
      REWARDS.forEach(function (p2, i) {
        if (!S.inv[p2]) return;
        var info = POWER_INFO[p2], passive = p2 === "vest", on = (p2 === "smoke" && H.aim === "smoke") || (p2 === "pot" && H.potT > 0) || (p2 === "sprint" && H.sprintT > 0);
        var b = el("button", { type: "button", class: "nthview-power" + (passive ? " nthview-passive" : "") + (on ? " nthview-armed" : "") + (p2 === S.sel ? " nthview-psel" : ""), title: info.name + ": " + info.help, "aria-label": info.name + ", " + S.inv[p2] + " left" + (p2 === S.sel ? ", selected" : "") + ". " + info.help + (passive ? "" : " Key " + (i + 1) + ".") }, [icon(info.icon, 26), el("i", { text: String(S.inv[p2]) })]);
        b.addEventListener("click", function () { if (!passive) S.sel = p2; usePower(p2, true); });
        powerBar.appendChild(b);
      });
      powerBar.classList.toggle("nthview-hidden", !show || !powerBar.firstChild);
    }
    /* Q and E walk through the powers; Space uses the selected one */
    function cyclePower(step) {
      var act = usable(); if (!act.length) return;
      S.sel = act[(act.indexOf(S.sel) + step + act.length) % act.length]; renderPowers(); toast(POWER_INFO[S.sel].name + " selected. Space uses it.", 1600);
    }
    function usePower(p2, tapped) {
      if (S.mode !== "play" || S.paused || !H.alive || !S.inv[p2] || H.atk) { if (S.mode === "lesson" && S.inv[p2]) toast(POWER_INFO[p2].name + ": " + POWER_INFO[p2].help, 4200); return; }
      if (p2 === "sprint") { if (H.sprintT > 0) return; endPot(); S.inv.sprint--; H.sprintT = 6; sfx("power"); toast("Sprint! Six seconds of double speed."); }
      else if (p2 === "knife" || p2 === "grenade") throwAt(p2);
      else if (p2 === "smoke") {
        if (tapped) { H.aim = H.aim === "smoke" ? null : "smoke"; toast(H.aim ? "Tap where the smoke should land." : "Smoke put away."); }
        else { H.aim = null; smokeAhead(); }
      } else if (p2 === "pot") {
        if (H.potT > 0) return;
        S.inv.pot--; H.potT = 8; H.pathN = 0; H.target = null; H.moving = false; H.aim = null; potObj.visible = true; potObj.position.set(H.x, 0, H.z); H.fig.g.visible = false; sfx("power");
        toast("You are a flower pot. Stay still: the lights pass over you.", 3000); say(hero + " is disguised as a flower pot for eight seconds.");
      } else { toast("The vest is on: it takes the next hit for you."); }
      renderPowers(); canvas.focus({ preventScroll: true });
    }
    function copyInv(from, to) { REWARDS.forEach(function (p2) { to[p2] = from[p2]; }); }

    /* ---------- effects ---------- */
    var slowT = 0, shakeT = 0, shakeA = 0, T = 0, gemTimer = 0;
    function kick(a) { if (settings.reduced) return; shakeA = a; shakeT = .25; }
    function flyGems(x, z, n) {
      renderScoreSoon(n);
      if (settings.reduced) return;
      var from = toScreen(x, .5, z, _scr), sx = from.x, sy = from.y, cr = container.getBoundingClientRect(), tr = gemChip.getBoundingClientRect(), ex = tr.left - cr.left + 6, ey = tr.top - cr.top + 4;
      for (var i = 0; i < Math.min(n, gemEls.length); i++) (function (g, i2) {
        g.style.transition = "none"; g.style.opacity = "1"; g.style.transform = "translate(" + (sx + Math.cos(i2 * 2.4) * 22) + "px," + (sy + Math.sin(i2 * 2.4) * 22) + "px) rotate(45deg)";
        setTimeout(function () { g.style.transition = "transform .55s cubic-bezier(.5,0,.3,1),opacity .2s linear .45s"; g.style.transform = "translate(" + ex + "px," + ey + "px) rotate(45deg) scale(.6)"; g.style.opacity = "0"; }, 180 + i2 * 45);
      })(gemEls[i], i);
    }
    function renderScoreSoon(n) { clearTimeout(gemTimer); gemTimer = setTimeout(function () { renderScore(); bump(gemChip); sfx("gem"); }, settings.reduced ? 0 : 650); }
    /* copy the simulation into the scene: figures, lights, cones, markers */
    function syncFigures(dt) {
      var i, G, ca, sa;
      H.fig.g.position.x = H.x; H.fig.g.position.z = H.z; H.fig.g.rotation.y = -H.a; animWalk(H.fig, H.walk, H.moving && H.alive, true);
      if (H.atk) H.swingV = H.swing; else H.swingV += (-.4 - H.swingV) * Math.min(1, dt * 12);
      H.fig.sword.rotation.y = H.swingV; H.fig.sword.rotation.z = H.atk ? -.05 : .1; H.fig.body.rotation.y = H.atk ? H.swingV * .35 : 0;
      heroGlow.position.x = H.x; heroGlow.position.z = H.z; heroGlow.material.opacity = H.safeT > 0 ? .9 : H.sprintT > 0 ? .7 : .4; heroLight.position.set(H.x, .9, H.z);
      if (smokeFx.visible) { var sk = Math.min(1, SMOKE.t * 1.5, (6 - SMOKE.t) * 4); for (i = 0; i < smokeBits.length; i++) { smokeBits[i].scale.setScalar((2.2 + Math.sin(T * 1.3 + i * 1.7) * .35) * (.4 + .6 * sk)); smokeBits[i].material.rotation = T * .25 + i; } smokeBits[0].material.opacity = .62 * Math.max(0, sk); }
      if (boomT > 0) { boomT -= dt; boomRing.material.opacity = Math.max(0, boomT * 2.5); boomRing.scale.setScalar(1 + (.4 - boomT) * 9); }
      for (i = 0; i < guards.length; i++) {
        G = guards[i]; ca = Math.cos(G.a); sa = Math.sin(G.a);
        G.fig.g.position.x = G.x; G.fig.g.position.z = G.z; G.fig.g.rotation.y = -G.a; if (G.alive) animWalk(G.fig, G.walk, G.moved, G.ran);
        if (G.recoil > 0) G.fig.body.position.x = -G.recoil * .9; else if (G.fig.body.position.x) G.fig.body.position.x = 0;
        if (G.fig.sword) G.fig.sword.rotation.y = G.state === "slash" ? -1.7 + 3.1 * G.swing : -.4;
        if (G.fig.star && G.fig.star.visible) G.fig.star.rotation.y = T * 2;
        if (G.mark.visible) G.mark.position.set(G.x, (G.cfg.drone ? 1.75 : 1.5) * G.fig.scale, G.z);
        if (G.dome && G.dome.visible) { G.dome.position.x = G.x; G.dome.position.z = G.z; G.dome.material.opacity = .22 + Math.sin(T * 4) * .08; }
        if (G.cone.visible) {
          var pos = G.pos, a0 = G.a - G.half, da = G.half * 2 / RAYS;
          pos[0] = G.x; pos[2] = G.z;
          for (var r = 0; r <= RAYS; r++) { var ang = a0 + da * r, dist = castRay(G.x, G.z, ang, G.range), o = (r + 1) * 3; pos[o] = G.x + Math.cos(ang) * dist; pos[o + 2] = G.z + Math.sin(ang) * dist; }
          G.cone.geometry.attributes.position.needsUpdate = true;
          if (G.lamp && tier >= 2) {
            if (G.cfg.drone) { G.lamp.position.set(G.x, 1.2, G.z); G.lamp.target.position.set(G.x + ca * .01, 0, G.z + sa * .01); }
            else { G.lamp.position.set(G.x + ca * .3, .62 * G.fig.scale, G.z + sa * .3); G.lamp.target.position.set(G.x + ca * G.range * .8, .1, G.z + sa * G.range * .8); }
          }
        }
      }
      for (i = 0; i < PUFFS.length; i++) { var P2 = PUFFS[i]; if (P2.t > 0) { P2.t -= dt; P2.s.position.x += P2.vx * dt; P2.s.position.z += P2.vz * dt; P2.s.position.y += dt * .5; P2.s.material.opacity = Math.max(0, P2.t * 1.2); P2.s.scale.setScalar(.3 + (.5 - P2.t) * 1.4); if (P2.t <= 0) P2.s.visible = false; } }
      if (flashLight.intensity > 0) flashLight.intensity = Math.max(0, flashLight.intensity - dt * 30);
      if (tapT > 0) { tapT -= dt; tapRing.material.opacity = Math.max(0, tapT * 2); tapRing.scale.setScalar(.5 + (.5 - tapT) * .9); }
      for (i = 0; i < 2; i++) if (slashT[i] > 0) { slashT[i] -= dt; SLASH[i].material.opacity = Math.max(0, slashT[i] / .26); SLASH[i].scale.setScalar(1.7 + (.26 - slashT[i]) * 4); }
      if (hitT > 0) { hitT -= dt; hitSpr.material.opacity = Math.max(0, hitT / .16) * .9; hitSpr.scale.setScalar(1.2 + (.16 - hitT) * 9); if (hitT <= 0) hitSpr.visible = false; }
      if (tracerT > 0) { tracerT -= dt; tracer.material.opacity = Math.max(0, tracerT / .12); }
      if (goalRing.visible) { var gs = .8 + Math.sin(T * 5) * .12; goalRing.scale.setScalar(gs); }
      if (BOX.on && BOX.fall < 1) { BOX.fall = Math.min(1, BOX.fall + dt * 2.2); var e = BOX.fall, y = e < .7 ? 2.6 * (1 - (e / .7) * (e / .7)) : Math.sin((e - .7) / .3 * Math.PI) * .18; boxObj.position.y = y; if (e >= 1) boxObj.position.y = 0; }
      if (BOX.on && BOX.open > 0 && BOX.open < 1) { BOX.open = Math.min(1, BOX.open + dt * 2.5); boxLid.rotation.z = BOX.open * 1.2; boxLid.position.y = .37 + BOX.open * .1; }
      if (KEYFLY.on) {
        KEYFLY.t = Math.min(1, KEYFLY.t + dt * (settings.reduced ? 4 : 1.1)); var kt = KEYFLY.t, ke = kt * kt * (3 - 2 * kt);
        keyObj.position.set(KEYFLY.x0 + (DOOR_X - KEYFLY.x0) * ke, .5 + Math.sin(kt * Math.PI) * 1.6 + ke * .1, KEYFLY.z0 + (.3 - KEYFLY.z0) * ke); keyObj.rotation.y = T * 6;
        if (kt >= 1) { KEYFLY.on = false; keyObj.visible = false; var fn = KEYFLY.done; KEYFLY.done = null; if (fn) fn(); }
      }
      if (doorOpen !== doorWant) { doorOpen += (doorWant > doorOpen ? 1 : -1) * Math.min(Math.abs(doorWant - doorOpen), dt * 1.4); doorSlab.position.y = .44 - doorOpen * .9; doorGlow.material.opacity = doorOpen * .5; }
    }
    function openDoor() { doorWant = 1; grid[DOOR_X] = 0; setCol(doorLamp.material, 0x3dff8a); sfx("door"); goalRing.visible = true; goalRing.position.set(DOOR_X, .035, .9); }

    /* ======================================================================
       Room trials: the eight in-room activity types. They are played in the
       quiet room after the boss has fallen, so nothing is timed and reading
       never overlaps with danger. Spots are places on the floor; walking onto
       one (or pressing its label) chooses it.
       ====================================================================== */
    var TR = null, trialGroup = null;
    var SPOT_COL = { idle: 0x4aa3ff, lit: 0xffc83d, ok: 0x3ddc84, no: 0xff5a4a, off: 0x596274 };
    var TRIAL_TITLE = { lanes: "Pick the right crate", gates: "Choose the archway", torches: "Light the right lamps", planks: "True or false?", harvest: "Collect what belongs", levers: "Step in order", tiles: "File them", collect: "Collect the tokens" };
    var showCallout = core.showCallout, hideCallout = core.hideCallout;
    function setFb(msg, tone) { cFb.className = "nthview-cfb" + (tone ? " nthview-" + tone : ""); cFb.textContent = ""; cFb.appendChild(rich(msg)); }
    function cButton(label, fn) { var b = el("button", { type: "button", text: label }); b.addEventListener("click", fn); cAct.appendChild(b); return b; }
    function setSpot(sp, state, text) {
      sp.state = state; setCol(sp.baseMat, SPOT_COL[state]);
      if (sp.bulbMat) setCol(sp.bulbMat, state === "lit" || state === "ok" ? 0xffe9a0 : 0x2c3340);
      [sp.labelEl, sp.legendEl].forEach(function (n) { n.classList.toggle("nthview-ok", state === "ok"); n.classList.toggle("nthview-no", state === "no"); n.classList.toggle("nthview-lit", state === "lit"); n.classList.toggle("nthview-gone", state === "off"); });
      if (text !== undefined) { sp.labelEl.textContent = text; sp.legendEl.textContent = text; }
    }
    function buildSpot(sp, kind) {
      var g = new THREE.Group(); g.position.set(sp.x, 0, sp.z);
      sp.baseMat = new THREE.MeshBasicMaterial({ color: lin(SPOT_COL.idle), toneMapped: false });
      var base = mesh(g, GEO.cyl, sp.baseMat, 0, .02, 0, kind === "plate" ? .92 : .8, .04, kind === "plate" ? .92 : .8); base.userData.ownMat = true;
      if (kind === "crate") mesh(g, GEO.box, matCrate, 0, .28, 0, .5).castShadow = true;
      else if (kind === "arch") { var st = lam(TH.wallTop); mesh(g, GEO.box, st, -.4, .45, 0, .1, .9, .12); mesh(g, GEO.box, st, .4, .45, 0, .1, .9, .12); mesh(g, GEO.box, st, 0, .93, 0, .92, .1, .14); }
      else if (kind === "lamp") { mesh(g, GEO.cyl, lam(0x3a4252), 0, .3, 0, .07, .6, .07); sp.bulbMat = new THREE.MeshBasicMaterial({ color: lin(0x2c3340), toneMapped: false }); mesh(g, GEO.sph, sp.bulbMat, 0, .68, 0, .24).userData.ownMat = true; }
      else if (kind === "bin") { mesh(g, GEO.box, lam(0x2f3644), 0, .16, 0, .62, .3, .62).castShadow = true; }
      else if (kind === "badge") { sp.token = mesh(g, GEO.oct, glow(0xffc83d), 0, .4, 0, .3, .12, .3); }
      sp.g = g; trialGroup.add(g);
    }
    function placeLabels() {
      labelsDirty = false;
      if (!TR) return;
      TR.spots.forEach(function (sp) { var p2 = toScreen(sp.x, 0, sp.z + .56, _scr); sp.labelEl.style.left = Math.round(p2.x) + "px"; sp.labelEl.style.top = Math.round(p2.y) + "px"; });
    }
    function startTrial(k) {
      var b = BLOCKS[k], a = b.data.activity, type = b.type, defs = [];
      if (type === "lanes") a.options.forEach(function (o) { defs.push({ label: o.label, kind: "crate", o: o }); });
      else if (type === "gates") a.paths.forEach(function (o) { defs.push({ label: o.label, kind: "arch", o: o }); });
      else if (type === "torches") a.items.forEach(function (o) { defs.push({ label: o.label, kind: "lamp", o: o }); });
      else if (type === "planks") defs = [{ label: "True", kind: "plate", v: true }, { label: "False", kind: "plate", v: false }];
      else if (type === "harvest") a.items.forEach(function (o) { defs.push({ label: o.label, kind: "badge", o: o }); });
      else if (type === "levers") shuffledIdx(a.items.length, "levers" + a.prompt).forEach(function (i) { defs.push({ label: a.items[i].label, kind: "plate", idx: i }); });
      else if (type === "tiles") a.bins.forEach(function (o) { defs.push({ label: o.label, kind: "bin", o: o }); });
      else a.items.forEach(function (o) { defs.push({ label: o, kind: "badge" }); });
      var free = room.spots.filter(function (s) { return (s.x - H.x) * (s.x - H.x) + (s.z - H.z) * (s.z - H.z) > 1.4; });
      if (free.length < defs.length) free = room.spots.slice();
      trialGroup = new THREE.Group(); scene.add(trialGroup);
      TR = { k: k, type: type, a: a, spots: [], notes: [], step: 0, done: false, left: 0 };
      S.mode = "trial"; H.pathN = 0; H.target = null; renderPowers();
      showCallout("Secret box · " + (a.title || TRIAL_TITLE[type]), a.prompt);
      defs.slice(0, free.length).forEach(function (d, i) {
        var sp = { x: free[i].x, z: free[i].z, def: d, armed: true, on: false, gone: false, state: "idle", bulbMat: null, token: null };
        var text = type === "collect" || type === "planks" ? d.label : (i + 1) + " · " + d.label;
        sp.labelEl = el("button", { type: "button", class: "nthview-spot", text: text, "aria-label": "Walk to " + d.label });
        sp.legendEl = el("button", { type: "button", text: text, "aria-label": "Walk to " + d.label });
        var walk = function () { if (TR && !TR.done && canMove()) { H.target = null; goTo(sp.x, sp.z, true); canvas.focus({ preventScroll: true }); } };
        sp.labelEl.addEventListener("click", walk); sp.legendEl.addEventListener("click", walk);
        labels.appendChild(sp.labelEl); cLegend.appendChild(sp.legendEl);
        buildSpot(sp, d.kind); TR.spots.push(sp);
      });
      placeLabels();
      if (type === "torches") cButton("Check the lamps", checkLamps);
      else if (type === "harvest") { TR.left = a.items.filter(function (o) { return o.belongs; }).length; if (!STRICT) cButton("Show me the rest", function () { revealHarvest(); }); }
      else if (type === "collect") { TR.left = TR.spots.length; cButton("Collect the rest for me", function () { TR.spots.forEach(function (sp) { if (!sp.gone) { sp.gone = true; if (sp.token) sp.token.visible = false; setSpot(sp, "off"); } }); finishTrial(300); }); }
      trialPrompt();
      say((a.title || TRIAL_TITLE[type]) + ". " + plain(a.prompt) + " " + TYPE_HELP[type]);
    }
    function trialPrompt() {
      var a = TR.a;
      if (TR.type === "planks") { cKick.textContent = "Secret box · statement " + (TR.step + 1) + " of " + a.planks.length; cBig.textContent = plain(a.planks[TR.step].text); }
      else if (TR.type === "tiles") { cKick.textContent = "Secret box · file " + (TR.step + 1) + " of " + a.items.length; cBig.textContent = "Carrying: " + a.items[TR.step].label; }
      else if (TR.type === "levers") cBig.textContent = TR.step ? TR.step + " of " + a.items.length + " in place" : "";
    }
    function trialWrong(cost, msg, note) {
      TR.notes.push(note || msg); setFb(msg, "no"); kick(.03); core.mistake(TR.k, cost, note || msg);
    }
    function flashSpot(sp, state) { setSpot(sp, state); setTimeout(function () { if (TR && TR.spots.indexOf(sp) !== -1 && !TR.done && sp.state === state) setSpot(sp, "idle"); }, 800); }
    function checkLamps() {
      if (!TR || TR.done) return;
      var wrong = TR.spots.filter(function (sp) { return sp.on !== sp.def.o.lit; });
      if (!wrong.length) { TR.spots.forEach(function (sp) { setSpot(sp, sp.on ? "ok" : "off"); }); setFb("Exactly the right lamps!", "ok"); sfx("ok"); finishTrial(900); return; }
      if (STRICT) { trialWrong(1, wrong.length + (wrong.length === 1 ? " lamp is" : " lamps are") + " wrong. Change them and check again."); return; }
      wrong.forEach(function (sp) { TR.notes.push(sp.def.label + (sp.def.o.lit ? " should be lit." : " should stay dark.")); });
      trialWrong(wrong.length, wrong.length + (wrong.length === 1 ? " lamp was" : " lamps were") + " wrong. The room now shows the right ones.", wrong.length + " lamps wrong");
      TR.notes.pop();
      TR.spots.forEach(function (sp) { sp.on = sp.def.o.lit; setSpot(sp, wrong.indexOf(sp) !== -1 ? "no" : sp.on ? "ok" : "off"); });
      cAct.textContent = ""; TR.done = true; cButton("Continue", function () { TR.done = false; finishTrial(0); }).focus({ preventScroll: true });
    }
    function revealHarvest() {
      if (!TR || TR.done) return;
      var missed = TR.spots.filter(function (sp) { return sp.def.o.belongs && !sp.gone; });
      missed.forEach(function (sp) { sp.gone = true; setSpot(sp, "lit"); TR.notes.push(sp.def.label + " belongs too."); });
      if (missed.length) { trialWrong(missed.length, "You missed " + missed.length + ". They are lit up now.", "missed " + missed.length); TR.notes.pop(); }
      cAct.textContent = ""; TR.done = true; cButton("Continue", function () { TR.done = false; finishTrial(0); }).focus({ preventScroll: true });
    }
    function onSpot(sp) {
      var a = TR.a, type = TR.type, d = sp.def, right;
      if (type === "lanes" || type === "gates") {
        if (sp.state === "no") return;
        if (d.o.id === a.answer) { setSpot(sp, "ok"); setFb("Right: " + d.label + ".", "ok"); sfx("ok"); finishTrial(900); return; }
        setSpot(sp, "no"); right = TR.spots.filter(function (s) { return s.def.o.id === a.answer; })[0];
        trialWrong(1, (d.o.hint || "Not this one.") + (!STRICT && right ? " The answer is " + right.def.label + ": walk there." : ""), d.label + ": " + (d.o.hint || "not the answer."));
        if (!STRICT && right) setSpot(right, "lit");
      } else if (type === "torches") {
        sp.on = !sp.on; setSpot(sp, sp.on ? "lit" : "idle"); sfx("open");
      } else if (type === "planks") {
        var pl = a.planks[TR.step];
        if (d.v === pl.answer) { flashSpot(sp, "ok"); setFb("Right." + (pl.why ? " " + pl.why : ""), "ok"); sfx("pick"); TR.step++; }
        else { flashSpot(sp, "no"); trialWrong(1, "Not quite: it is " + (pl.answer ? "true" : "false") + "." + (pl.why ? " " + pl.why : ""), "“" + plain(pl.text) + "” is " + (pl.answer ? "true" : "false") + "." + (pl.why ? " " + pl.why : "")); if (!STRICT) TR.step++; }
        if (TR.step >= a.planks.length) finishTrial(1200); else trialPrompt();
      } else if (type === "harvest") {
        if (sp.gone || sp.state === "no") return;
        if (d.o.belongs) { sp.gone = true; if (sp.token) sp.token.visible = false; setSpot(sp, "ok"); sfx("pick"); TR.left--; setFb(d.label + " belongs. " + (TR.left ? TR.left + " more to find." : "That is all of them!"), "ok"); if (!TR.left) finishTrial(900); }
        else { setSpot(sp, "no"); trialWrong(1, d.label + " does not belong.", d.label + " does not belong."); }
      } else if (type === "levers") {
        if (sp.state === "ok") return;
        if (d.idx === TR.step) { TR.step++; setSpot(sp, "ok", "✓" + TR.step + " · " + d.label); sfx("pick"); setFb(d.label + " is number " + TR.step + ".", "ok"); trialPrompt(); if (TR.step >= a.items.length) finishTrial(900); }
        else {
          flashSpot(sp, "no"); right = TR.spots.filter(function (s) { return s.def.idx === TR.step; })[0];
          trialWrong(1, d.label + " is not next." + (!STRICT ? " Next is " + right.def.label + "." : ""), "Step " + (TR.step + 1) + " is " + right.def.label + ", not " + d.label + ".");
          if (!STRICT) setSpot(right, "lit");
        }
      } else if (type === "tiles") {
        var it = a.items[TR.step], good = a.bins.filter(function (bn) { return bn.id === it.bin; })[0];
        if (d.o.id === it.bin) { flashSpot(sp, "ok"); setFb(it.label + " goes in " + d.label + ".", "ok"); sfx("pick"); TR.step++; }
        else { flashSpot(sp, "no"); trialWrong(1, it.label + " does not go in " + d.label + "." + (!STRICT ? " It belongs in " + good.label + "." : ""), it.label + " belongs in " + good.label + "."); if (!STRICT) TR.step++; }
        if (TR.step >= a.items.length) finishTrial(1200); else trialPrompt();
      } else {
        if (sp.gone) return;
        sp.gone = true; if (sp.token) sp.token.visible = false; setSpot(sp, "off"); sfx("gem"); TR.left--;
        setFb(TR.left ? TR.left + " left to collect." : "All collected!", "ok"); if (!TR.left) finishTrial(700);
      }
    }
    function updateTrial() {
      if (!TR || TR.done) return;
      for (var i = 0; i < TR.spots.length; i++) {
        var sp = TR.spots[i], d = (sp.x - H.x) * (sp.x - H.x) + (sp.z - H.z) * (sp.z - H.z);
        if (sp.token && sp.token.visible) sp.token.rotation.y = T * 2.4;
        if (sp.armed && d < .3) { sp.armed = false; onSpot(sp); if (!TR || TR.done) return; }
        else if (!sp.armed && d > .85) sp.armed = true;
      }
    }
    function clearTrial() {
      if (trialGroup) { scene.remove(trialGroup); trialGroup.traverse(function (o) { if (o.material && o.userData.ownMat) o.material.dispose(); }); trialGroup = null; }
      labels.textContent = ""; hideCallout(); TR = null;
    }
    function finishTrial(delay) {
      if (!TR || TR.done) return;
      TR.done = true; H.pathN = 0;
      var k = TR.k, tr = TR;
      setTimeout(function () {
        if (TR !== tr) return;
        clearTrial(); S.mode = "stop"; core.reached(k, tr.notes.slice());
      }, delay);
    }

    /* ======================================================================
       Flow hooks: lesson (core) -> room (soldiers, boss) -> secret box ->
       room task or question cards (core) -> key -> door -> cleared page (core)
       ====================================================================== */
    function guardsAhead(k) {
      var b = BLOCKS[k], info = BOSS[b.boss], res = ROOMREC[k];
      var ahead = box(res.cleared ? "The room is clear" : "In this room: " + b.squad.length + " soldiers and " + info.name, "nthview-task");
      if (!res.cleared) ahead.appendChild(squadChips(b));
      var task = b.inRoom ? "the secret box sets a task in the room. " + TYPE_HELP[b.type] : "the secret box asks about this lesson" + ((b.data.checks || []).length ? ", " + (1 + b.data.checks.length) + " questions" : "") + ".";
      var at = p("", res.cleared ? "The boss is already down. Take the secret box: " + task : info.line + " When he falls, " + task); at.style.margin = "0"; ahead.appendChild(at);
      var out = el("div", {}, [ahead]);
      if (!res.cleared) {
        /* the first time a kind of soldier turns up, say what he does */
        var seen = {}; for (var q = 0; q < k; q++) BLOCKS[q].squad.forEach(function (t) { seen[t] = true; });
        var fresh = b.squad.filter(function (t, i2, arr) { return !seen[t] && arr.indexOf(t) === i2; });
        if (fresh.length) { var nb = box(k === 0 ? "Who is on guard" : "New here"); fresh.forEach(function (t) { nb.appendChild(guardLine(GUARD[t])); }); out.appendChild(nb); }
        if (k === 0) out.appendChild(p("nthview-cap", "Step into a light and its owner notices you. Get out of the light before he strikes and he will chase you and search where you went. Stay hidden and he gives up."));
      }
      var have = REWARDS.filter(function (p2) { return S.inv[p2] > 0; });
      if (have.length && !res.cleared) out.appendChild(p("nthview-cap", "You carry: " + have.map(function (p2) { return POWER_INFO[p2].name + " ×" + S.inv[p2]; }).join(", ") + ". Use them from the round buttons while you play."));
      return out;
    }
    function hexOf(c) { return "#" + ("000000" + c.toString(16)).slice(-6); }
    function guardDot(cfg) { var d = el("i", { class: "nthview-gdot", "aria-hidden": "true" }); d.style.background = hexOf(cfg.body); d.style.borderColor = hexOf(cfg.ring); return d; }
    /* one line of the guard guide: the uniform colour, the name, what he does */
    function guardLine(cfg) { var r = el("p", { class: "nthview-gline" }, [guardDot(cfg), el("b", { text: cfg.name })]); r.appendChild(doc.createTextNode(" " + cfg.line)); return r; }
    function squadChips(b) {
      var counts = {}, order = [], row = el("div", { class: "nthview-squad" });
      b.squad.forEach(function (t) { if (!counts[t]) { counts[t] = 0; order.push(t); } counts[t]++; });
      order.forEach(function (t) { row.appendChild(el("span", { class: "nthview-gchip" }, [guardDot(GUARD[t]), doc.createTextNode(GUARD[t].name + (counts[t] > 1 ? " ×" + counts[t] : ""))])); });
      row.appendChild(el("span", { class: "nthview-gchip nthview-gboss" }, [guardDot(BOSS[b.boss]), doc.createTextNode(BOSS[b.boss].name)]));
      return row;
    }
    function startPlay(k) {
      var res = ROOMREC[k];
      S.mode = res.cleared ? "clear" : "play"; S.gems0 = S.gems; renderPowers(); persist();
      if (res.cleared) toast("Take the secret box.", 2400);
      else if (k === 0 && !res.deaths) toast("Come at a guard from behind. Stay out of the light.", 3600);
      S.heardHint = k > 0;
      say(res.cleared ? "The room is clear. Take the secret box." : "Block " + (k + 1) + ". " + guards.length + " guards. Stay out of the flashlights.");
    }
    function takeBox() {
      H.pathN = 0; H.moving = false; goalRing.visible = false; sfx("pick"); S.mode = "stop"; core.hideCallout();
      var k = S.k, b = BLOCKS[k];
      if (b.inRoom) { startTrial(k); return; }
      core.reached(k, []);
    }
    function solved(k, stars) {
      var b = BLOCKS[k];
      if (k < N - 1) { var n = stars === 3 ? 2 : 1; S.inv[b.reward] = Math.min(3, S.inv[b.reward] + n); S.prize = { power: b.reward, n: n }; }   /* at most three of each are carried */
      else { S.gems += 10; S.prize = { power: null, n: 10 }; }
      copyInv(S.inv, S.invStart); S.gems0 = S.gems; renderScore(); persist();
      S.mode = "key";
      if (!BOX.on) dropBox(H.x, H.z, true);
      goalRing.visible = false; BOX.open = .01;
      keyObj.visible = true; KEYFLY.on = true; KEYFLY.t = 0; KEYFLY.x0 = BOX.x; KEYFLY.z0 = BOX.z;
      KEYFLY.done = function () {
        openDoor(); S.mode = "exit"; renderPowers();
        toast("The key fits. Tap the door to leave.", 3200); say("The door is open. Go to the door at the top of the room, or press Enter.");
      };
    }
    function leaveRoom() { S.mode = "solved"; goalRing.visible = false; core.showSolved(S.k); }
    function prizeBox() {
      if (!S.prize) return null;
      var pz = box("In the secret box", "nthview-task"), info = S.prize.power ? POWER_INFO[S.prize.power] : null;
      var line = p("", info ? "**" + info.name + (S.prize.n > 1 ? " ×" + S.prize.n : "") + "**. " + info.help + (S.prize.n > 1 ? " Two of them, for answering without a mistake." : "") : "**" + S.prize.n + " gems** for the last room."); line.style.margin = "0";
      pz.appendChild(el("div", { class: "nthview-prize" }, info ? [icon(info.icon, 34), line] : [line]));
      return pz;
    }
    function enterBlock(k, done) {
      fade(true); S.prize = null;
      setTimeout(function () { clearTrial(); buildRoom(k); fade(false); done(); }, 380);
    }
    var exitDone = null;
    function finaleStart(next) {
      S.mode = "finaleplay"; renderPowers(); goTo(DOOR_X, 1, false);
      setTimeout(next, settings.reduced ? 300 : 1500);
    }
    function finaleEnd(next) {
      openDoor(); goalRing.visible = false; exitDone = next;
      toast("The vault is open!", 1800); say("The vault is open."); setTimeout(function () { if (S.mode === "finaleplay") goTo(DOOR_X, 0, false); }, settings.reduced ? 200 : 900);
    }
    function reachedExit() { var fn = exitDone; exitDone = null; if (fn) fn(); }
    /* spotted: only this room starts again, and it gets a little easier each time */
    function deathCard(G) {
      var k = S.k, res = ROOMREC[k];
      openOverlay("spotted"); ocard.textContent = "";
      ocard.appendChild(el("h1", { text: "Caught!" }));
      var who = G ? (G.boss ? G.cfg.name : (G.cfg.name === "Officer" ? "An " : "A ") + G.cfg.name.toLowerCase()) : "A guard";
      ocard.appendChild(p("nthview-big", who + (S.killHow === "blade" ? " reached " + hero + " with his sword." : " kept " + hero + " in the light long enough to fire.") + " Only this room starts again; the lesson and your answers are safe."));
      ocard.appendChild(p("nthview-small", "Next time, leave the light at once: a guard who loses sight of you has to chase and search, and you can hide."));
      ocard.appendChild(el("p", { class: "nthview-readout", text: "Caught " + res.deaths + (res.deaths === 1 ? " time" : " times") + " in this room" }));
      if (res.deaths >= 2) ocard.appendChild(p("nthview-small", "The guards are getting tired: they walk and react a little slower now."));
      var go = primaryBtn("Try again", function () { retryRoom(false); });
      ocard.appendChild(el("div", { class: "nthview-actions" }, [go, keyHint("Enter")]));
      var row2 = el("div", { class: "nthview-actions" }, []);
      if (res.deaths >= 3) row2.appendChild(btn("Skip to the question", "", skipRoom));
      row2.appendChild(btn("Read the lesson again", "", function () { retryRoom(true); }));
      row2.appendChild(core.restartButton());
      ocard.appendChild(row2);
      setTimeout(function () { go.focus({ preventScroll: true }); }, 60);
    }
    function undoAttempt() { copyInv(S.invStart, S.inv); if (S.gems0 !== undefined) S.gems = S.gems0; renderScore(); }
    function retryRoom(lesson) {
      closeOverlay(); undoAttempt(); resetRoom(S.k);
      if (lesson) core.showLesson(S.k); else { S.mode = "play"; renderPowers(); persist(); canvas.focus({ preventScroll: true }); }
    }
    function skipRoom() {
      var k = S.k, res = ROOMREC[k];
      closeOverlay(); undoAttempt();
      res.skipped = true; res.cleared = true; S.skips++; resetRoom(k); S.mode = "clear"; renderPowers(); persist();
      toast("Room skipped. Take the secret box.", 2600);
    }

    /* ======================================================================
       The frame loop. Fixed temporaries, clamped delta time, no allocation.
       ====================================================================== */
    var rafId = 0, last = 0, alive = true, perfAcc = 0, perfN = 0, pausedFrames = 0, shadowsOn = true;
    function step(dt) {
      T += dt;
      var g = dt, i;
      if (H.atk && !settings.reduced) g = dt * .45; else if (slowT > 0) { slowT -= dt; g = dt * .3; }
      updateHero(g);
      for (i = 0; i < guards.length; i++) updateGuard(guards[i], g);
      updateKnife(g); updateProj(g); updateAlarm(g);
      if (S.mode === "trial") updateTrial();
      syncFigures(g);
      if (shakeT > 0) { shakeT -= dt; camera.position.x = camBaseX + Math.sin(T * 70) * shakeA * Math.max(0, shakeT / .25) * 3; } else camera.position.x = camBaseX;
      if (labelsDirty) placeLabels();
    }
    function frame(now) {
      rafId = 0;
      if (!alive) return;
      if (!canvas.isConnected) { dispose(); return; }
      var dt = last ? Math.min(.05, Math.max(0, (now - last) / 1000)) : 1 / 60; last = now;
      if (!S.paused) { pausedFrames = 0; step(dt); }
      if (!S.paused || pausedFrames++ < 2) renderer.render(scene, camera);
      perfAcc += dt; perfN++;
      if (perfN >= 120) {
        var avg = perfAcc / perfN;
        if (avg > .026) {
          /* too slow: first fewer pixels, then the flashlights stop being real lights, then no shadows at all */
          if (pixelRatio > 1.5) { pixelRatio = 1.5; renderer.setPixelRatio(pixelRatio); renderer.setSize(VW(), VH(), false); }
          else if (tier >= 2) setTier(0);
          else if (pixelRatio > 1) { pixelRatio = 1; renderer.setPixelRatio(pixelRatio); renderer.setSize(VW(), VH(), false); }
          else if (shadowsOn) { shadowsOn = false; sun.castShadow = false; }
        }
        perfAcc = 0; perfN = 0;
      }
      schedule();
    }
    function schedule() { if (!rafId && alive && !doc.hidden) rafId = root.requestAnimationFrame(frame); }
    function onVisibility() {
      if (doc.hidden) { saveNow(); if (rafId) { root.cancelAnimationFrame(rafId); rafId = 0; } if (S.mode === "play" && !S.paused) pause(); }
      else { last = 0; schedule(); }
    }
    function dispose() {
      alive = false; if (rafId) root.cancelAnimationFrame(rafId);
      root.removeEventListener("blur", onBlur);
      doc.removeEventListener("visibilitychange", onVisibility);
      if (ro) ro.disconnect(); else root.removeEventListener("resize", onResize);
      renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss();
    }

    /* ---------- input: tap to move is the whole control scheme; keys are an extra ---------- */
    var KEYMAP = { arrowleft: "left", a: "left", arrowright: "right", d: "right", arrowup: "up", w: "up", arrowdown: "down", s: "down" };
    function onKey(e, key) {
      if (key === "enter" && e.target.tagName !== "BUTTON" && e.target.tagName !== "A") {
        if (S.mode === "exit") { H.target = null; goTo(DOOR_X, 0, true); return true; }
        if (S.mode === "clear" && BOX.on) { H.target = null; goTo(BOX.x, BOX.z, true); return true; }
      }
      if (KEYMAP[key]) { if (canMove()) { KEYS[KEYMAP[key]] = true; return true; } return false; }
      if (S.mode === "play" && !e.repeat) {
        var hot = { "1": "sprint", "2": "knife", "3": "smoke", "4": "grenade", "5": "pot" }[key];
        if (hot) { if (S.inv[hot]) { S.sel = hot; usePower(hot, false); } return true; }
        if (key === " ") { if (S.sel && S.inv[S.sel]) usePower(S.sel, false); else if (usable().length) cyclePower(0); else toast("Nothing to use yet. Every boss's box holds a power."); return true; }
        if (key === "q" || key === "e") { cyclePower(key === "q" ? -1 : 1); return true; }
      }
      return false;
    }
    function onKeyUp(e, key) { var k2 = KEYMAP[key]; if (k2) KEYS[k2] = false; }
    function onBlur() { KEYS.up = KEYS.down = KEYS.left = KEYS.right = false; }
    root.addEventListener("blur", onBlur);
    var dragging = false, dragAt = 0;
    canvas.addEventListener("pointerdown", function (e) {
      if (S.paused || !canMove()) return;
      var pt = toFloor(e.clientX, e.clientY); if (!pt) return;
      dragging = true; dragAt = Date.now(); tapAt(pt.x, pt.z);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!dragging || S.paused || !canMove() || H.target || H.aim) return;
      var now = Date.now(); if (now - dragAt < 140) return; dragAt = now;
      var pt = toFloor(e.clientX, e.clientY); if (pt) goTo(pt.x, pt.z, false);
    });
    canvas.addEventListener("pointerup", function () { dragging = false; });
    canvas.addEventListener("pointercancel", function () { dragging = false; });
    doc.addEventListener("visibilitychange", onVisibility);
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); saveNow(); toast("The graphics were reset by the browser. Reload the page to continue; your progress is saved.", 8000); });
    function onResize() { renderer.setSize(VW(), VH(), false); fitCamera(); }
    var ro = root.ResizeObserver ? new root.ResizeObserver(onResize) : null;
    if (ro) ro.observe(container); else root.addEventListener("resize", onResize);

    /* ---------- what the core asks of this engine ---------- */
    return {
      words: {
        level: "block", Level: "Block", finale: "Final room", finaleGo: "Crack the vault", finaleAsk: "The vault lock", cleared: "Room cleared",
        lives: ["⚿", "lockpicks", "Lockpicks"], outTitle: "Lock jammed!", outText: "The last lockpick snapped and the lock jammed.",
        begin: "Begin", beginHint: "Enter · tap the floor to move · tap a guard to hunt him",
        canvas: "The room, seen from above. Tap or click the floor to move there, tap a guard to hunt him. Arrow keys or W A S D also move. P pauses.",
        intro: [hero + " must slip past " + guardsName + ". Tap or click the floor and " + hero + " runs there. Tap a guard to hunt him. Step into a light and its owner notices: get out of it before he strikes and he must chase and search. Keys: arrows or W A S D move, Space uses the selected power, Q and E switch powers, P pauses.",
          "A guard who keeps " + hero + " in his light long enough strikes, and then only that room starts again."],
        ask: function () { return "The secret box"; },
        askLead: function () { return "The box is locked with a question about this lesson. Answer it and the key is yours."; },
        finaleCap: function (n) { return "No guards here. The vault door has " + n + " lock" + (n > 1 ? "s" : "") + ", one question each."; }
      },
      taskHelp: TYPE_HELP, worldTypes: ROOM_TYPES, sounds: SOUNDS,
      start: function (k) { renderer.setSize(VW(), VH(), false); fitCamera(); S.gems0 = S.gems; buildRoom(k); renderTargets(); renderPowers(); syncFigures(0); renderer.render(scene, camera); schedule(); },
      enter: enterBlock,
      ahead: guardsAhead,
      play: startPlay,
      solved: solved,
      solvedExtra: prizeBox,
      finaleStart: finaleStart,
      finaleStep: function (i, next) { setTimeout(next, settings.reduced ? 200 : 700); },
      finaleEnd: finaleEnd,
      wrong: function () { kick(.03); },
      ui: renderPowers,
      score: function () { gemOut.textContent = String(S.gems); },
      replay: function (k) { undoAttempt(); resetRoom(k); },
      reset: function () { S.gems = 0; S.gems0 = 0; S.deaths = 0; S.skips = 0; ROOMREC = freshHR(); S.inv = freshInv(); S.invStart = freshInv(); },
      resume: function () { last = 0; schedule(); onBlur(); },
      canPause: function () { return S.mode !== "dead"; },
      key: onKey, keyUp: onKeyUp,
      pauseInfo: function () { return " · ◆ " + S.gems + " · caught " + S.deaths; },
      pauseMenu: function (menu, toggle) { menu.appendChild(toggle("Real flashlights and shadows", tier >= 2, function (v) { lightsWanted = v; setTier(v ? 2 : 0); persist(); })); },
      pauseExtra: function (card) {
        var kinds = {}; BLOCKS.forEach(function (b2) { b2.squad.forEach(function (t) { kinds[t] = true; }); });
        var gd = el("details", { class: "nthview-more" }); gd.appendChild(el("summary", { text: "Guard guide" }));
        SOLDIERS.filter(function (t) { return kinds[t]; }).forEach(function (t) { gd.appendChild(guardLine(GUARD[t])); });
        BOSSES.forEach(function (t) { if (BLOCKS.some(function (b2) { return b2.boss === t; })) gd.appendChild(guardLine(BOSS[t])); });
        card.appendChild(gd);
      },
      reportStats: function () { return [["◆ Gems", String(S.gems)], ["Caught", String(S.deaths)]].concat(S.skips ? [["Rooms skipped", String(S.skips)]] : []); },
      reportEnd: renderPowers,
      /* an unfinished attempt is replayed, so its gems and powers are not kept */
      save: function () {
        var mid = (S.mode === "play" || S.mode === "dead") && S.gems0 !== undefined;
        return { gems: mid ? S.gems0 : S.gems, deaths: S.deaths, skips: S.skips, lights: lightsWanted, inv: Object.assign({}, S.invStart),
          rooms: ROOMREC.map(function (r) { return [r.deaths, r.cleared ? 1 : 0, r.skipped ? 1 : 0]; }) };
      },
      load: function (w) {
        function intIn(v, lo, hi) { return typeof v === "number" && v % 1 === 0 && v >= lo && v <= hi; }
        if (intIn(w.gems, 0, 1e7)) S.gems = w.gems;
        if (intIn(w.deaths, 0, 1e5)) S.deaths = w.deaths;
        if (intIn(w.skips, 0, 1e5)) S.skips = w.skips;
        if (w.inv && typeof w.inv === "object") REWARDS.forEach(function (p2) { if (intIn(w.inv[p2], 0, 99)) { S.inv[p2] = w.inv[p2]; S.invStart[p2] = w.inv[p2]; } });
        if (Array.isArray(w.rooms)) w.rooms.forEach(function (r, i) { if (i < N && Array.isArray(r)) { if (intIn(r[0], 0, 1e5)) ROOMREC[i].deaths = r[0]; ROOMREC[i].cleared = r[1] === 1; ROOMREC[i].skipped = r[2] === 1; } });
      }
    };
  };
  NthView.engines.stealth.css = CSS;
})(typeof globalThis !== "undefined" ? globalThis : window);
