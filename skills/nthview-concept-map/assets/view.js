/* NthView — concept-map renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first. Fonts come from Google Fonts (see NthView.libs).
 * The force-directed layout, hulls, camera and minimap are plain JavaScript; no library is used.
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";

  var THEMES = ["nebula", "blueprint", "atlas", "botanic", "prism"];
  /* default colour role per cluster index: neighbours in this list are far apart on the colour wheel */
  var ROLES = ["teal", "violet", "gold", "red", "blue", "green", "orange", "pink"];

  /* Cluster colour sets. Light sets are dark enough for text on a near-white surface,
     dark sets light enough for text on a near-black one; the eight hues stay apart. */
  var KSETS = {
    vividDark: "--k-red:#ff8a80;--k-orange:#ffab5e;--k-gold:#ffd54f;--k-green:#7ee08a;--k-teal:#5eead4;--k-blue:#7cb4ff;--k-violet:#c4a5ff;--k-pink:#ff8fc8",
    vividLight: "--k-red:#c62828;--k-orange:#c2410c;--k-gold:#8f6400;--k-green:#2e7d32;--k-teal:#00796b;--k-blue:#1d4ed8;--k-violet:#7c3aed;--k-pink:#be185d",
    mutedDark: "--k-red:#f2a08f;--k-orange:#f3b57c;--k-gold:#e9cf78;--k-green:#a9d38a;--k-teal:#8fd8ca;--k-blue:#9dbdf0;--k-violet:#c9b2ee;--k-pink:#eda5c6",
    mutedLight: "--k-red:#a63d2f;--k-orange:#a8521a;--k-gold:#7f6210;--k-green:#47732a;--k-teal:#24736a;--k-blue:#2f5d9c;--k-violet:#6a4a99;--k-pink:#a0406b"
  };

  /* Each theme: native palette, then the variant for the other colour scheme. */
  var PALETTES = {
    nebula: { dark: true,
      base: "--bg1:#070818;--bg2:#1a1145;--blob1:#5b21b6;--blob2:#0e7490;--blob3:#9d174d;--dot:rgba(220,220,255,.26);--surface:rgba(17,15,46,.68);--surface-2:rgba(28,24,70,.95);--node:rgba(24,21,62,.93);--line:rgba(255,255,255,.14);--ink:#f7f7ff;--muted:#c3c1ea;--accent:#a78bfa;--accent-2:#22d3ee;--on-accent:#0b0a22;--ok:#4ade80;--no:#fb7185;--warn:#fbbf24;--edge:rgba(210,210,255,.46);--shadow:rgba(0,0,0,.55);--display:'Outfit',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1.1rem;" + KSETS.vividDark,
      alt: "--bg1:#f4f2ff;--bg2:#e2e7ff;--blob1:#ddd6fe;--blob2:#bae6fd;--blob3:#fbcfe8;--dot:rgba(40,30,120,.2);--surface:rgba(255,255,255,.8);--surface-2:rgba(255,255,255,.97);--node:rgba(255,255,255,.96);--line:rgba(30,20,90,.14);--ink:#12111f;--muted:#4a4770;--accent:#6d28d9;--accent-2:#0e7490;--on-accent:#fff;--ok:#15803d;--no:#be123c;--warn:#a16207;--edge:rgba(40,30,110,.46);--shadow:rgba(40,30,110,.25);" + KSETS.vividLight },
    blueprint: { dark: true,
      base: "--bg1:#051426;--bg2:#0a2747;--blob1:#1d4ed8;--blob2:#0891b2;--blob3:#312e81;--dot:rgba(125,211,252,.15);--surface:rgba(6,24,46,.72);--surface-2:rgba(10,34,62,.96);--node:rgba(8,30,56,.94);--line:rgba(125,211,252,.22);--ink:#f0f8ff;--muted:#a8c6e6;--accent:#38bdf8;--accent-2:#a5f3fc;--on-accent:#04121f;--ok:#4ade80;--no:#fb7185;--warn:#fcd34d;--edge:rgba(165,220,255,.5);--shadow:rgba(0,0,0,.55);--display:'Space Grotesk',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:.55rem;" + KSETS.vividDark,
      alt: "--bg1:#eef5fc;--bg2:#d9e8f7;--blob1:#bfdbfe;--blob2:#a5f3fc;--blob3:#c7d2fe;--dot:rgba(3,60,120,.13);--surface:rgba(255,255,255,.82);--surface-2:rgba(255,255,255,.97);--node:rgba(255,255,255,.96);--line:rgba(3,60,120,.18);--ink:#0b1726;--muted:#38506b;--accent:#0369a1;--accent-2:#0e7490;--on-accent:#fff;--ok:#15803d;--no:#be123c;--warn:#a16207;--edge:rgba(10,50,100,.5);--shadow:rgba(10,50,100,.22);" + KSETS.vividLight },
    atlas: { dark: false,
      base: "--bg1:#f6f0e2;--bg2:#ebdfc6;--blob1:#ecd9b4;--blob2:#d5e2cf;--blob3:#efcfbf;--dot:rgba(90,60,20,.12);--surface:rgba(255,251,242,.85);--surface-2:rgba(255,253,247,.98);--node:rgba(255,252,245,.97);--line:rgba(70,50,20,.16);--ink:#1b150c;--muted:#5b4d36;--accent:#9a3412;--accent-2:#0f766e;--on-accent:#fff;--ok:#2f6f4f;--no:#b4231f;--warn:#8a5a00;--edge:rgba(60,40,15,.46);--shadow:rgba(70,50,20,.22);--display:'Fraunces',Georgia,serif;--body:'Inter',system-ui,sans-serif;--radius:.75rem;" + KSETS.mutedLight,
      alt: "--bg1:#16120c;--bg2:#2a2216;--blob1:#5c3d1a;--blob2:#1f4a3f;--blob3:#5e2a1d;--dot:rgba(240,220,180,.11);--surface:rgba(30,24,16,.74);--surface-2:rgba(42,34,22,.96);--node:rgba(36,29,19,.95);--line:rgba(255,240,210,.15);--ink:#faf4e8;--muted:#d6c8ab;--accent:#fb923c;--accent-2:#5eead4;--on-accent:#1b150c;--ok:#7fcfa2;--no:#f08a86;--warn:#e3b654;--edge:rgba(250,235,205,.42);--shadow:rgba(0,0,0,.55);" + KSETS.mutedDark },
    botanic: { dark: false,
      base: "--bg1:#f0f7ee;--bg2:#d9ecdc;--blob1:#c8e9cc;--blob2:#f4e4b5;--blob3:#cbe4ee;--dot:rgba(20,70,40,.13);--surface:rgba(252,255,251,.83);--surface-2:rgba(255,255,255,.98);--node:rgba(255,255,255,.96);--line:rgba(20,70,40,.15);--ink:#0f1a12;--muted:#3e5a46;--accent:#15803d;--accent-2:#b45309;--on-accent:#fff;--ok:#15803d;--no:#b91c1c;--warn:#a16207;--edge:rgba(20,60,35,.46);--shadow:rgba(20,70,40,.2);--display:'Outfit',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1.4rem;" + KSETS.mutedLight,
      alt: "--bg1:#0b1710;--bg2:#15301f;--blob1:#166534;--blob2:#854d0e;--blob3:#155e75;--dot:rgba(200,240,210,.11);--surface:rgba(12,30,20,.72);--surface-2:rgba(18,42,28,.96);--node:rgba(16,38,25,.95);--line:rgba(220,255,230,.14);--ink:#f2fbf4;--muted:#b9d8c2;--accent:#4ade80;--accent-2:#fbbf24;--on-accent:#0b1710;--ok:#6ee7b7;--no:#fb7185;--warn:#fcd34d;--edge:rgba(215,245,225,.42);--shadow:rgba(0,0,0,.55);" + KSETS.mutedDark },
    prism: { dark: false,
      base: "--bg1:#fbfbfe;--bg2:#eef0f8;--blob1:#ffd1e6;--blob2:#cdeeff;--blob3:#fff0bf;--dot:rgba(20,20,60,.1);--surface:rgba(255,255,255,.8);--surface-2:rgba(255,255,255,.98);--node:rgba(255,255,255,.97);--line:rgba(20,20,60,.13);--ink:#101018;--muted:#4b4d63;--accent:#db2777;--accent-2:#2563eb;--on-accent:#fff;--ok:#15803d;--no:#be123c;--warn:#a16207;--edge:rgba(30,30,70,.42);--shadow:rgba(30,30,80,.2);--display:'Space Grotesk',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1rem;" + KSETS.vividLight,
      alt: "--bg1:#0b0b12;--bg2:#181828;--blob1:#9d174d;--blob2:#1e40af;--blob3:#a16207;--dot:rgba(255,255,255,.1);--surface:rgba(20,20,32,.72);--surface-2:rgba(30,30,46,.96);--node:rgba(26,26,40,.95);--line:rgba(255,255,255,.14);--ink:#f8f8fc;--muted:#c2c3d6;--accent:#f472b6;--accent-2:#60a5fa;--on-accent:#0b0b12;--ok:#4ade80;--no:#fb7185;--warn:#fbbf24;--edge:rgba(230,230,250,.45);--shadow:rgba(0,0,0,.55);" + KSETS.vividDark }
  };

  var PATTERNS = {
    nebula: "background-image:radial-gradient(circle,var(--dot) 1px,transparent 1.6px),radial-gradient(circle,var(--dot) 1.3px,transparent 2.2px);background-size:34px 34px,97px 89px",
    blueprint: "background-image:linear-gradient(var(--dot) 1px,transparent 1px),linear-gradient(90deg,var(--dot) 1px,transparent 1px),linear-gradient(var(--dot) 1px,transparent 1px),linear-gradient(90deg,var(--dot) 1px,transparent 1px);background-size:24px 24px,24px 24px,120px 120px,120px 120px",
    atlas: "background-image:linear-gradient(var(--dot) 1px,transparent 1px),linear-gradient(90deg,var(--dot) 1px,transparent 1px);background-size:44px 44px",
    botanic: "background-image:radial-gradient(circle,var(--dot) 1.3px,transparent 2px);background-size:26px 26px",
    prism: "background-image:radial-gradient(circle,var(--dot) 1px,transparent 1.6px);background-size:20px 20px"
  };

  function themeCss() {
    var out = [];
    THEMES.forEach(function (t) {
      var p = PALETTES[t], sel = ".nthview-concept-map[data-theme=" + t + "]";
      out.push(sel + "{" + p.base + "}");
      out.push("@media (prefers-color-scheme:" + (p.dark ? "light" : "dark") + "){" + sel + "{" + p.alt + "}}");
      out.push(sel + " .nthview-pattern{" + PATTERNS[t] + "}");
    });
    return out.join("\n");
  }

  var GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
  var M = ".nthview-concept-map";

  var CSS = [
    ".nthview{--nv-bg:#fff;--nv-fg:#111;--nv-muted:#555;--nv-accent:#2563eb;--nv-border:#ddd;--nv-error:#b91c1c;",
    "  color-scheme:light dark;background:var(--nv-bg);color:var(--nv-fg);",
    "  font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:60rem;margin:0 auto;padding:1rem;box-sizing:border-box}",
    "@media (prefers-color-scheme:dark){.nthview{--nv-bg:#111;--nv-fg:#eee;--nv-muted:#aaa;--nv-accent:#60a5fa;--nv-border:#333;--nv-error:#f87171}}",
    ".nthview *{box-sizing:border-box}",
    ".nthview :focus-visible{outline:3px solid var(--nv-accent);outline-offset:2px}",
    ".nthview-error-panel{border:2px solid var(--nv-error);border-radius:.5rem;padding:1rem}",
    ".nthview-error-panel h2{margin:0 0 .5rem;color:var(--nv-error)}",
    ".nthview-error-panel code{font-family:ui-monospace,SFMono-Regular,Menlo,monospace}",
    /* ---- view-specific styles below, every class prefixed nthview- ---- */
    themeCss(),
    M + "[data-theme]{max-width:none;margin:0;padding:0;position:relative;height:100vh;height:100dvh;min-height:22rem;overflow:hidden;isolation:isolate;background:var(--bg1);color:var(--ink);font-family:var(--body);line-height:1.5;--nv-accent:var(--accent);-webkit-tap-highlight-color:transparent}",
    "body:has(> .nthview-concept-map){margin:0}",
    M + " > .nthview-error-panel{position:relative;z-index:20;max-width:48rem;margin:2rem auto;background:var(--nv-bg);color:var(--nv-fg)}",
    M + " [hidden]{display:none !important}",
    M + " button{font:inherit;color:inherit;cursor:pointer}",
    M + " button:disabled{cursor:default}",
    M + " p{margin:.35rem 0 .75rem}",
    M + " .nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    /* backdrop */
    M + " .nthview-backdrop{position:absolute;inset:0;z-index:0;overflow:hidden;background:radial-gradient(120% 90% at 20% 0%,var(--bg2),var(--bg1) 70%)}",
    M + " .nthview-blob{position:absolute;width:60vmax;height:60vmax;border-radius:50%;filter:blur(90px);opacity:.42;animation:nthview-drift 34s ease-in-out infinite alternate;will-change:transform}",
    M + " .nthview-blob:nth-child(1){background:var(--blob1);top:-24vmax;left:-18vmax}",
    M + " .nthview-blob:nth-child(2){background:var(--blob2);top:18vmax;right:-20vmax;animation-duration:41s;animation-delay:-9s}",
    M + " .nthview-blob:nth-child(3){background:var(--blob3);bottom:-28vmax;left:22%;width:46vmax;height:46vmax;animation-duration:47s;animation-delay:-20s}",
    M + " .nthview-pattern{position:absolute;inset:0;opacity:.9;mask-image:radial-gradient(ellipse at center,#000 30%,transparent 85%);-webkit-mask-image:radial-gradient(ellipse at center,#000 30%,transparent 85%)}",
    M + " .nthview-grain{position:absolute;inset:0;opacity:.08;background-image:" + GRAIN + ";mix-blend-mode:overlay;pointer-events:none}",
    "@keyframes nthview-drift{from{transform:translate(0,0) scale(1)}to{transform:translate(8vmax,6vmax) scale(1.16)}}",
    /* viewport + world */
    M + " .nthview-viewport{position:absolute;inset:0;z-index:1;overflow:hidden;touch-action:none;cursor:grab;outline:none}",
    M + " .nthview-viewport.nthview-panning{cursor:grabbing}",
    M + " .nthview-viewport:focus-visible{box-shadow:inset 0 0 0 3px var(--accent)}",
    M + " .nthview-world{position:absolute;left:0;top:0;width:0;height:0;transform-origin:0 0}",
    M + " .nthview-svg{position:absolute;left:0;top:0;overflow:visible;pointer-events:none}",
    M + " .nthview-layer{position:absolute;left:0;top:0;width:0;height:0}",
    /* hulls */
    M + " .nthview-hull{fill:var(--c);fill-opacity:.11;stroke:var(--c);stroke-opacity:.5;stroke-width:1.5;transition:opacity .45s,fill-opacity .3s}",
    M + " .nthview-hull.nthview-empty{stroke-dasharray:6 6;fill-opacity:.05}",
    M + " .nthview-hull.nthview-target{fill-opacity:.26;stroke-width:3;stroke-opacity:.9}",
    M + " .nthview-hull.nthview-dim,.nthview-concept-map .nthview-hlabel.nthview-dim{opacity:.25}",
    M + " .nthview-hlabel{position:absolute;left:0;top:0;white-space:nowrap;font:700 11px/1 var(--display);letter-spacing:.14em;text-transform:uppercase;color:var(--c);pointer-events:none;transition:opacity .45s;text-shadow:0 1px 0 var(--bg1),0 0 12px var(--bg1)}",
    /* edges */
    M + " .nthview-edge{fill:none;stroke:var(--edge);stroke-width:1.6;transition:stroke .3s,stroke-width .3s}",
    M + " .nthview-arrow{fill:var(--edge);transition:fill .3s}",
    M + " .nthview-flow{fill:none;stroke:var(--accent-2);stroke-width:2.6;stroke-linecap:round;stroke-dasharray:2 13;opacity:0;transition:opacity .4s}",
    M + " .nthview-eg{transition:opacity .45s}",
    M + " .nthview-eg.nthview-dim,.nthview-concept-map .nthview-elabel.nthview-dim{opacity:.14}",
    M + " .nthview-eg.nthview-lit .nthview-edge,.nthview-concept-map .nthview-eg.nthview-key .nthview-edge,.nthview-concept-map .nthview-eg.nthview-now .nthview-edge{stroke:var(--accent);stroke-width:2.4}",
    M + " .nthview-eg.nthview-lit .nthview-arrow,.nthview-concept-map .nthview-eg.nthview-key .nthview-arrow,.nthview-concept-map .nthview-eg.nthview-now .nthview-arrow{fill:var(--accent)}",
    M + " .nthview-eg.nthview-lit .nthview-flow,.nthview-concept-map .nthview-eg.nthview-key .nthview-flow,.nthview-concept-map.nthview-celebrate .nthview-flow{opacity:1;animation:nthview-flowing 1.1s linear infinite}",
    M + " .nthview-eg.nthview-picked .nthview-edge{stroke:var(--accent-2);stroke-width:2.6}",
    M + " .nthview-eg.nthview-grow .nthview-edge{stroke-dasharray:1;stroke-dashoffset:1;animation:nthview-drawline .9s cubic-bezier(.3,.7,.3,1) forwards;animation-delay:var(--d,0ms)}",
    M + " .nthview-eg.nthview-grow .nthview-arrow{opacity:0;animation:nthview-fadein .3s ease forwards;animation-delay:calc(var(--d,0ms) + 700ms)}",
    "@keyframes nthview-flowing{to{stroke-dashoffset:-15}}",
    "@keyframes nthview-drawline{to{stroke-dashoffset:0}}",
    "@keyframes nthview-fadein{to{opacity:1}}",
    M + " .nthview-elabel{position:absolute;left:0;top:0;white-space:nowrap;font:600 11.5px/1.15 var(--body);letter-spacing:.01em;color:var(--muted);background:var(--surface-2);border:1px solid var(--line);border-radius:999px;padding:.2rem .55rem;box-shadow:0 6px 16px -10px var(--shadow);transition:opacity .45s,color .2s,border-color .2s,background .2s}",
    M + " .nthview-elabel:hover{color:var(--ink);border-color:var(--accent)}",
    M + " .nthview-elabel.nthview-lit,.nthview-concept-map .nthview-elabel.nthview-key{color:var(--ink);border-color:var(--accent);background:color-mix(in srgb,var(--accent) 16%,var(--surface-2))}",
    M + " .nthview-elabel.nthview-q{color:var(--on-accent);background:linear-gradient(135deg,var(--accent),var(--accent-2));border-color:transparent;font-weight:800;min-width:1.8rem;text-align:center;animation:nthview-pulse 1.8s ease-out infinite}",
    M + " .nthview-elabel.nthview-cand{color:var(--ink);border:1.5px dashed var(--accent);background:var(--surface-2);font-weight:700;padding:.28rem .65rem}",
    M + " .nthview-elabel.nthview-cand:hover,.nthview-concept-map .nthview-elabel.nthview-cand:focus-visible{background:color-mix(in srgb,var(--accent) 20%,var(--surface-2))}",
    M + " .nthview-elabel.nthview-picked{color:var(--on-accent);background:var(--accent-2);border-color:transparent}",
    M + " .nthview-elabel.nthview-cleared{border-style:solid;border-color:var(--ok);opacity:.75}",
    M + " .nthview-elabel.nthview-fixed{animation:nthview-popin .5s cubic-bezier(.2,.8,.2,1)}",
    M + ".nthview-far .nthview-elabel:not(.nthview-lit):not(.nthview-q):not(.nthview-cand):not(.nthview-key):not(.nthview-picked):not(.nthview-now){opacity:0;pointer-events:none}",
    M + " .nthview-agglabel{position:absolute;left:0;top:0;white-space:nowrap;font:700 11px/1 var(--body);color:var(--muted);background:var(--surface);border:1px dashed var(--line);border-radius:999px;padding:.2rem .5rem;pointer-events:none}",
    M + " .nthview-agg{fill:none;stroke:var(--edge);stroke-width:2.2;stroke-dasharray:5 5}",
    M + " .nthview-aggarrow{fill:var(--edge)}",
    M + " .nthview-rubber{stroke:var(--accent);stroke-width:2.5;stroke-dasharray:6 6;animation:nthview-flowing .6s linear infinite}",
    /* nodes */
    M + " .nthview-node{position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;text-align:center;padding:.3rem .75rem .3rem 1.25rem;border-radius:calc(var(--radius) * .8);background:var(--node);border:1.5px solid color-mix(in srgb,var(--c) 60%,var(--line));color:var(--ink);font:600 14px/1.2 var(--body);box-shadow:0 10px 26px -16px var(--shadow),0 0 0 0 transparent;transition:opacity .45s,box-shadow .25s,border-color .25s,background .25s,scale .25s;touch-action:none;user-select:none;-webkit-user-select:none}",
    M + " .nthview-node::before{content:'';position:absolute;left:.5rem;top:50%;width:.45rem;height:.45rem;margin-top:-.225rem;border-radius:50%;background:var(--c);box-shadow:0 0 10px var(--c)}",
    M + " .nthview-nlabel{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;overflow-wrap:break-word}",
    M + " .nthview-node:hover{box-shadow:0 14px 34px -14px var(--shadow),0 0 0 4px color-mix(in srgb,var(--c) 22%,transparent);scale:1.04}",
    M + " .nthview-node:focus-visible{outline:3px solid var(--accent);outline-offset:3px;scale:1.04}",
    M + " .nthview-node.nthview-root{font:700 16px/1.2 var(--display);border:2px solid var(--accent);background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 28%,var(--node)),color-mix(in srgb,var(--accent-2) 20%,var(--node)));box-shadow:0 0 0 6px color-mix(in srgb,var(--accent) 14%,transparent),0 18px 44px -18px var(--accent)}",
    M + " .nthview-node.nthview-root::after{content:'';position:absolute;inset:-6px;border-radius:inherit;border:2px solid var(--accent);opacity:0;animation:nthview-halo 3.2s ease-out infinite;pointer-events:none}",
    "@keyframes nthview-halo{0%{opacity:.55;transform:scale(1)}100%{opacity:0;transform:scale(1.25)}}",
    M + " .nthview-node.nthview-dim{opacity:.2}",
    M + " .nthview-node.nthview-lit{border-color:var(--c);box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 28%,transparent),0 16px 40px -14px var(--c)}",
    M + " .nthview-node.nthview-open{border-color:var(--accent);box-shadow:0 0 0 5px color-mix(in srgb,var(--accent) 35%,transparent)}",
    M + " .nthview-node.nthview-loose{--c:var(--muted);border-style:dashed;border-color:var(--accent);background:var(--surface-2);cursor:grab;animation:nthview-bob 2.4s ease-in-out infinite}",
    M + " .nthview-node.nthview-loose.nthview-later{opacity:.35;animation:none;cursor:default;border-color:var(--line)}",
    M + " .nthview-node.nthview-dragging{cursor:grabbing;scale:1.08;z-index:5;animation:none;box-shadow:0 26px 50px -18px var(--shadow)}",
    M + " .nthview-node.nthview-sel{box-shadow:0 0 0 5px color-mix(in srgb,var(--accent) 45%,transparent),0 16px 40px -14px var(--accent);animation:none}",
    M + " .nthview-node.nthview-blank{border-style:dashed;border-color:var(--accent);color:var(--accent);font-weight:800;font-size:20px}",
    M + " .nthview-node.nthview-now{box-shadow:0 0 0 5px color-mix(in srgb,var(--accent) 30%,transparent),0 16px 40px -14px var(--accent)}",
    M + " .nthview-node.nthview-src{border-color:var(--accent);box-shadow:0 0 0 6px color-mix(in srgb,var(--accent) 45%,transparent)}",
    M + " .nthview-node.nthview-hinted{animation:nthview-pulse 1.6s ease-out infinite}",
    M + " .nthview-node.nthview-shake{animation:nthview-shake .45s ease}",
    M + " .nthview-node.nthview-fixed{animation:nthview-popin .55s cubic-bezier(.2,.8,.2,1)}",
    M + " .nthview-node.nthview-grow{opacity:0;animation:nthview-nodein .6s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:var(--d,0ms)}",
    M + " .nthview-badge{position:absolute;top:-.6rem;right:-.6rem;min-width:1.35rem;height:1.35rem;padding:0 .3rem;border-radius:999px;display:grid;place-items:center;font:800 11px/1 var(--display);color:var(--on-accent);background:linear-gradient(135deg,var(--accent),var(--accent-2));box-shadow:0 4px 10px -4px var(--shadow)}",
    M + " .nthview-bubble{position:absolute;left:0;top:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border-radius:999px;border:2px dashed var(--c);background:color-mix(in srgb,var(--c) 16%,var(--node));color:var(--ink);font:700 14px/1.2 var(--display);box-shadow:0 14px 34px -16px var(--shadow);padding:.4rem 1rem}",
    M + " .nthview-bubble small{font:600 11.5px/1.2 var(--body);color:var(--muted)}",
    M + " .nthview-bubble:hover{background:color-mix(in srgb,var(--c) 26%,var(--node))}",
    "@keyframes nthview-nodein{from{opacity:0;scale:.55}to{opacity:1;scale:1}}",
    "@keyframes nthview-popin{0%{scale:.7}60%{scale:1.12}100%{scale:1}}",
    "@keyframes nthview-bob{0%,100%{translate:0 0}50%{translate:0 -4px}}",
    "@keyframes nthview-shake{0%,100%{translate:0 0}20%{translate:-7px 0}40%{translate:6px 0}60%{translate:-4px 0}80%{translate:3px 0}}",
    "@keyframes nthview-pulse{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 55%,transparent)}70%{box-shadow:0 0 0 12px transparent}100%{box-shadow:0 0 0 0 transparent}}",
    /* glass panels + HUD */
    M + " .nthview-glass{background:var(--surface);backdrop-filter:blur(18px) saturate(1.3);-webkit-backdrop-filter:blur(18px) saturate(1.3);border:1px solid var(--line);border-radius:var(--radius);box-shadow:0 30px 80px -40px var(--shadow),inset 0 1px 0 rgba(255,255,255,.07)}",
    M + " .nthview-top{position:absolute;z-index:6;left:12px;right:12px;top:12px;display:flex;align-items:center;gap:.6rem;pointer-events:none}",
    M + " .nthview-top > *{pointer-events:auto}",
    M + " .nthview-brand{display:flex;align-items:center;gap:.6rem;min-width:0;padding:.45rem .9rem .45rem .55rem;flex:0 1 auto}",
    M + " .nthview-logo{flex:none;width:1.9rem;height:1.9rem;border-radius:.6rem;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent)}",
    M + " .nthview-logo svg{width:1.2rem;height:1.2rem}",
    M + " .nthview-brandtext{min-width:0;display:flex;flex-direction:column;line-height:1.15}",
    M + " .nthview-brandtext small{font-size:.66rem;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);font-weight:700}",
    M + " .nthview-brandtext b{font-family:var(--display);font-size:.98rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    M + " .nthview-steps{display:flex;gap:.25rem;list-style:none;margin:0 auto;padding:.3rem;flex:none}",
    M + " .nthview-steps li{display:flex;align-items:center;gap:.4rem;padding:.32rem .75rem;border-radius:999px;font-size:.8rem;font-weight:700;color:var(--muted);transition:background .3s,color .3s}",
    M + " .nthview-steps li span{width:1.25rem;height:1.25rem;border-radius:50%;display:grid;place-items:center;font-size:.7rem;background:var(--surface-2);border:1px solid var(--line)}",
    M + " .nthview-steps li.nthview-on{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent)}",
    M + " .nthview-steps li.nthview-on span{background:transparent;border-color:color-mix(in srgb,var(--on-accent) 40%,transparent)}",
    M + " .nthview-steps li.nthview-past{color:var(--ink)}",
    M + " .nthview-steps li.nthview-past span{background:var(--ok);color:#fff;border-color:transparent}",
    M + " .nthview-tools{display:flex;gap:.4rem;flex:none}",
    M + " .nthview-chipbtn{display:inline-flex;align-items:center;gap:.4rem;padding:.55rem .85rem;font-size:.84rem;font-weight:700;border-radius:999px}",
    M + " .nthview-chipbtn:hover{border-color:var(--accent)}",
    /* legend */
    M + " .nthview-legend{position:absolute;z-index:3;left:16px;width:380px;bottom:16px;display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;pointer-events:none}",
    M + " .nthview-legend > *{pointer-events:auto}",
    M + " .nthview-lchip{display:inline-flex;align-items:center;gap:.4rem;padding:.3rem .35rem .3rem .65rem;font-size:.8rem;font-weight:600;border-radius:999px;white-space:nowrap}",
    M + " .nthview-lchip > button{border:0;background:none;padding:.1rem .25rem;border-radius:999px;display:inline-flex;align-items:center;gap:.4rem;font-weight:600}",
    M + " .nthview-lchip > button:hover{color:var(--c)}",
    M + " .nthview-ldot{width:.6rem;height:.6rem;border-radius:50%;background:var(--c);box-shadow:0 0 8px var(--c);flex:none}",
    M + " .nthview-lchip .nthview-ltoggle{width:1.45rem;height:1.45rem;justify-content:center;background:var(--surface-2);border:1px solid var(--line);font-weight:800;padding:0}",
    /* zoom + minimap */
    M + " .nthview-corner{position:absolute;z-index:3;right:16px;bottom:16px;display:flex;align-items:flex-end;gap:.5rem}",
    M + " .nthview-zoom{display:flex;flex-direction:column;padding:.25rem;gap:.15rem}",
    M + " .nthview-zoom button{width:2.4rem;height:2.4rem;border:0;background:none;border-radius:calc(var(--radius) * .6);display:grid;place-items:center;font-size:1.2rem;font-weight:700}",
    M + " .nthview-zoom button:hover{background:var(--surface-2);color:var(--accent)}",
    M + " .nthview-zoom svg{width:1.1rem;height:1.1rem}",
    M + " .nthview-mini{width:176px;height:128px;padding:0;overflow:hidden;cursor:crosshair;touch-action:none}",
    M + " .nthview-mini svg{width:100%;height:100%;display:block}",
    M + " .nthview-mini .nthview-mhull{fill:var(--c);fill-opacity:.25;stroke:var(--c);stroke-opacity:.6}",
    M + " .nthview-mini .nthview-mdot{fill:var(--c)}",
    M + " .nthview-mini .nthview-mview{fill:color-mix(in srgb,var(--accent) 12%,transparent);stroke:var(--accent);stroke-width:2;vector-effect:non-scaling-stroke}",
    /* guide panel */
    M + " .nthview-guide{position:absolute;z-index:4;left:16px;top:84px;width:380px;max-height:calc(100% - 112px - var(--nv-legend,0px));overflow:auto;overscroll-behavior:contain;padding:1.15rem 1.25rem 1.2rem;scrollbar-width:thin}",
    M + " .nthview-grab{display:none}",
    M + " .nthview-swap{animation:nthview-swapin .45s cubic-bezier(.2,.8,.2,1)}",
    "@keyframes nthview-swapin{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}",
    M + " .nthview-eyebrow{font-size:.72rem;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);font-weight:800;margin:0 0 .35rem;display:flex;align-items:center;gap:.5rem;flex-wrap:wrap}",
    M + " .nthview-kind{display:inline-flex;align-items:center;gap:.35rem;font-size:.7rem;letter-spacing:.06em;color:var(--ink);background:var(--surface-2);border:1px solid var(--line);border-radius:999px;padding:.15rem .55rem}",
    M + " .nthview-guide h2,.nthview-concept-map .nthview-details h3{font-family:var(--display);font-weight:700;font-size:1.35rem;line-height:1.2;letter-spacing:-.01em;margin:.2rem 0 .6rem;outline:none}",
    M + " .nthview-guide h3{font-family:var(--display);font-size:1.02rem;margin:1rem 0 .4rem}",
    M + " .nthview-muted{color:var(--muted)}",
    M + " .nthview-small{font-size:.88rem}",
    M + " .nthview-track{height:4px;border-radius:2px;background:var(--line);overflow:hidden;margin:.15rem 0 .8rem}",
    M + " .nthview-bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));border-radius:2px;transition:width .5s ease}",
    M + " .nthview-dots{display:flex;gap:.3rem;flex-wrap:wrap;margin:.1rem 0 .8rem}",
    M + " .nthview-dot{width:.5rem;height:.5rem;border-radius:50%;background:var(--line);transition:background .3s,transform .3s}",
    M + " .nthview-dot.nthview-on{background:var(--accent);transform:scale(1.3)}",
    M + " .nthview-dot.nthview-past{background:color-mix(in srgb,var(--accent) 55%,var(--line))}",
    M + " .nthview-actions{display:flex;gap:.55rem;flex-wrap:wrap;align-items:center;margin-top:1rem}",
    M + " .nthview-btn{border:1.5px solid var(--accent);background:var(--surface-2);color:var(--accent);border-radius:999px;padding:.62rem 1.15rem;font-weight:800;font-size:.92rem;transition:transform .18s,box-shadow .18s,filter .18s}",
    M + " .nthview-btn:hover:not(:disabled){transform:translateY(-2px)}",
    M + " .nthview-btn:disabled{opacity:.45}",
    M + " .nthview-btn.nthview-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);border-color:transparent;box-shadow:0 12px 30px -14px var(--accent)}",
    M + " .nthview-btn.nthview-ghost{border-color:transparent;background:transparent;color:var(--muted);padding-left:.45rem;padding-right:.45rem;font-weight:600}",
    M + " .nthview-btn.nthview-ghost:hover{color:var(--ink);text-decoration:underline;transform:none}",
    M + " .nthview-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.4rem 0 .6rem}",
    M + " .nthview-chip{display:inline-flex;align-items:center;gap:.4rem;border:1px solid var(--line);background:var(--surface-2);border-radius:999px;padding:.32rem .7rem;font-size:.84rem;font-weight:600;text-align:left}",
    M + " .nthview-chip:hover:not(:disabled){border-color:var(--c,var(--accent))}",
    M + " .nthview-chip:disabled{opacity:.42;text-decoration:line-through}",
    M + ".nthview-phase-rebuild .nthview-legend,.nthview-concept-map.nthview-phase-reflect .nthview-legend,.nthview-concept-map.nthview-phase-intro .nthview-legend{display:none}",
    M + " .nthview-chip[aria-pressed=true]{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);border-color:transparent}",
    M + " .nthview-chip.nthview-clchip{border-color:color-mix(in srgb,var(--c) 55%,var(--line));padding:.45rem .8rem}",
    M + " .nthview-chip.nthview-clchip:hover:not(:disabled){background:color-mix(in srgb,var(--c) 16%,var(--surface-2))}",
    M + " .nthview-opts{display:grid;gap:.45rem;margin:.5rem 0 .4rem;padding:0;list-style:none}",
    M + " .nthview-opt{width:100%;text-align:left;display:flex;gap:.7rem;align-items:center;background:var(--surface-2);border:1.5px solid var(--line);border-radius:calc(var(--radius) * .7);padding:.62rem .8rem;font-weight:600;line-height:1.3;transition:border-color .18s,transform .18s,background .18s}",
    M + " .nthview-opt:hover:not(:disabled){border-color:var(--accent);transform:translateX(3px)}",
    M + " .nthview-opt .nthview-key{flex:none;width:1.6rem;height:1.6rem;border-radius:.5rem;display:grid;place-items:center;font:800 .8rem var(--display);border:1px solid var(--line);background:var(--surface)}",
    M + " .nthview-opt.nthview-no{border-color:var(--no);background:color-mix(in srgb,var(--no) 12%,var(--surface-2));opacity:.8}",
    M + " .nthview-opt.nthview-no .nthview-key{background:var(--no);color:#fff;border-color:transparent}",
    M + " .nthview-opt.nthview-yes{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,var(--surface-2))}",
    M + " .nthview-opt.nthview-yes .nthview-key{background:var(--ok);color:#fff;border-color:transparent}",
    M + " .nthview-sentence{display:flex;flex-wrap:wrap;align-items:center;gap:.35rem;margin:.3rem 0 .7rem;font-weight:700}",
    M + " .nthview-sentence .nthview-term{border-radius:.5rem;padding:.2rem .5rem;background:color-mix(in srgb,var(--c,var(--accent)) 16%,var(--surface-2));border:1px solid color-mix(in srgb,var(--c,var(--accent)) 50%,var(--line))}",
    M + " .nthview-sentence .nthview-rel{font-style:italic;color:var(--accent);font-weight:700}",
    M + " .nthview-sentence .nthview-blankterm{border:1.5px dashed var(--accent);border-radius:.5rem;padding:.2rem .7rem;color:var(--accent)}",
    M + " .nthview-hintbox{border-left:3px solid var(--warn);background:color-mix(in srgb,var(--warn) 12%,transparent);border-radius:.5rem;padding:.55rem .8rem;margin:.6rem 0;font-size:.92rem}",
    M + " .nthview-fb{border-radius:calc(var(--radius) * .75);padding:.8rem .95rem;margin:.7rem 0 .2rem;border:1.5px solid var(--line);background:var(--surface-2);animation:nthview-swapin .4s cubic-bezier(.2,.8,.2,1)}",
    M + " .nthview-fb.nthview-fbno{border-color:color-mix(in srgb,var(--warn) 65%,transparent);background:color-mix(in srgb,var(--warn) 10%,var(--surface-2))}",
    M + " .nthview-fb.nthview-fbok{border-color:color-mix(in srgb,var(--ok) 65%,transparent);background:color-mix(in srgb,var(--ok) 11%,var(--surface-2))}",
    M + " .nthview-fb b.nthview-fbh{display:flex;align-items:center;gap:.5rem;font-family:var(--display);font-size:1.02rem;margin-bottom:.25rem}",
    M + " .nthview-fb p{margin:.25rem 0}",
    M + " .nthview-ic{flex:none;width:1.5rem;height:1.5rem;border-radius:50%;display:grid;place-items:center;color:#fff}",
    M + " .nthview-ic svg{width:.95rem;height:.95rem}",
    M + " .nthview-ic.nthview-icok{background:var(--ok)} .nthview-concept-map .nthview-ic.nthview-icno{background:var(--warn)}",
    M + " .nthview-order{list-style:none;margin:.5rem 0;padding:0;display:grid;gap:.4rem;counter-reset:nvo}",
    M + " .nthview-oitem{counter-increment:nvo;display:flex;align-items:center;gap:.5rem;background:var(--surface-2);border:1.5px solid var(--line);border-radius:calc(var(--radius) * .7);padding:.45rem .5rem;touch-action:none;user-select:none;-webkit-user-select:none;transition:border-color .2s,box-shadow .2s}",
    M + " .nthview-oitem::before{content:counter(nvo);flex:none;width:1.5rem;height:1.5rem;border-radius:50%;display:grid;place-items:center;font:800 .78rem var(--display);background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent)}",
    M + " .nthview-oitem.nthview-off{border-color:var(--warn);background:color-mix(in srgb,var(--warn) 10%,var(--surface-2))}",
    M + " .nthview-oitem.nthview-on{border-color:var(--ok)}",
    M + " .nthview-oitem.nthview-dragging{box-shadow:0 16px 36px -14px var(--shadow);border-color:var(--accent);scale:1.02;cursor:grabbing}",
    M + " .nthview-otext{flex:1;font-weight:600;line-height:1.25;cursor:grab}",
    M + " .nthview-handle{flex:none;width:.8rem;height:1.2rem;cursor:grab;background-image:radial-gradient(circle,var(--muted) 1.2px,transparent 1.6px);background-size:5px 5px;opacity:.7}",
    M + " .nthview-ibtn{flex:none;width:2rem;height:2rem;border-radius:.55rem;border:1px solid var(--line);background:var(--surface);display:grid;place-items:center;font-weight:800}",
    M + " .nthview-ibtn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}",
    M + " .nthview-ibtn:disabled{opacity:.35}",
    M + " .nthview-selects{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:.6rem 0}",
    M + " .nthview-selects label{display:grid;gap:.2rem;font-size:.78rem;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}",
    M + " .nthview-selects select{font:inherit;font-size:.9rem;text-transform:none;letter-spacing:0;color:var(--ink);background:var(--surface-2);border:1.5px solid var(--line);border-radius:.6rem;padding:.45rem .5rem;min-width:0;width:100%}",
    M + " .nthview-cards{display:grid;gap:.6rem;margin:.5rem 0}",
    M + " .nthview-card{background:var(--surface-2);border:1px solid var(--line);border-radius:calc(var(--radius) * .75);padding:.75rem .9rem}",
    M + " .nthview-card p{margin:.3rem 0 0;font-size:.92rem}",
    M + " .nthview-card .nthview-eyebrow{margin:0 0 .25rem;font-size:.7rem}",
    M + " .nthview-tag{display:inline-block;font-size:.66rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;border-radius:999px;padding:.12rem .5rem;background:color-mix(in srgb,var(--ok) 20%,transparent);color:var(--ink)}",
    M + " .nthview-tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin:.6rem 0 .8rem}",
    M + " .nthview-tile{background:var(--surface-2);border:1px solid var(--line);border-radius:calc(var(--radius) * .7);padding:.5rem .55rem;text-align:center}",
    M + " .nthview-tile b{display:block;font:800 1.45rem/1.05 var(--display);background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}",
    M + " .nthview-tile span{font-size:.7rem;color:var(--muted);font-weight:600}",
    M + " .nthview-gloss{margin:.4rem 0 0;display:grid;gap:.5rem}",
    M + " .nthview-gloss dt{font-weight:800;font-family:var(--display)}",
    M + " .nthview-gloss dd{margin:0 0 .3rem;color:var(--muted);font-size:.92rem}",
    /* details panel */
    M + " .nthview-details{position:absolute;z-index:5;right:16px;top:84px;width:340px;max-height:calc(100% - 100px - var(--nv-corner,0px));overflow:auto;overscroll-behavior:contain;padding:1.1rem 1.2rem 1.2rem;transform:translateX(calc(100% + 2rem));visibility:hidden;transition:transform .45s cubic-bezier(.2,.8,.2,1),visibility 0s linear .45s;scrollbar-width:thin}",
    M + " .nthview-details.nthview-open{transform:none;visibility:visible;transition:transform .45s cubic-bezier(.2,.8,.2,1)}",
    M + " .nthview-close{position:sticky;top:0;float:right;margin:-.3rem -.4rem 0 .5rem;width:2.2rem;height:2.2rem;border-radius:50%;border:1px solid var(--line);background:var(--surface-2);display:grid;place-items:center;font-size:1.1rem;z-index:1}",
    M + " .nthview-close:hover{border-color:var(--accent);color:var(--accent)}",
    M + " .nthview-cl{display:inline-flex;align-items:center;gap:.4rem;font-size:.74rem;font-weight:800;text-transform:uppercase;letter-spacing:.1em;color:var(--c)}",
    M + " .nthview-def{font-size:1.02rem;font-weight:600}",
    M + " .nthview-example{border-left:3px solid var(--c,var(--accent));padding:.45rem .75rem;background:color-mix(in srgb,var(--c,var(--accent)) 10%,transparent);border-radius:.45rem;font-size:.92rem}",
    M + " .nthview-links{list-style:none;padding:0;margin:.4rem 0 0;display:grid;gap:.4rem}",
    M + " .nthview-links details{background:var(--surface-2);border:1px solid var(--line);border-radius:.7rem;padding:.45rem .7rem}",
    M + " .nthview-links summary{cursor:pointer;font-size:.9rem;font-weight:600;list-style:none}",
    M + " .nthview-links summary::-webkit-details-marker{display:none}",
    M + " .nthview-links summary i{font-style:italic;color:var(--accent)}",
    M + " .nthview-links details p{font-size:.88rem;color:var(--muted);margin:.35rem 0 .1rem}",
    M + " .nthview-linkbtn{border:0;background:none;padding:0;color:var(--accent);font-weight:700;text-decoration:underline;text-underline-offset:2px}",
    /* intro overlay */
    M + " .nthview-intro{position:absolute;inset:0;z-index:8;display:grid;place-items:center;padding:1rem;overflow:auto;background:color-mix(in srgb,var(--bg1) 40%,transparent);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);transition:opacity .6s ease}",
    M + " .nthview-intro.nthview-gone{opacity:0;pointer-events:none}",
    M + " .nthview-introcard{width:min(42rem,100%);padding:clamp(1.2rem,4vw,2.2rem);animation:nthview-swapin .8s cubic-bezier(.2,.8,.2,1) both}",
    M + " .nthview-introcard h1{font-family:var(--display);font-weight:800;font-size:clamp(2rem,6vw,3.3rem);line-height:1.03;letter-spacing:-.025em;margin:.2rem 0 .6rem;background:linear-gradient(120deg,var(--ink) 0%,var(--ink) 45%,var(--accent) 80%,var(--accent-2) 100%);-webkit-background-clip:text;background-clip:text;color:transparent;outline:none}",
    M + " .nthview-lede{font-size:1.08rem;color:var(--muted)}",
    M + " .nthview-phases{display:grid;grid-template-columns:repeat(3,1fr);gap:.6rem;margin:1.1rem 0 .4rem;padding:0;list-style:none}",
    M + " .nthview-phases li{background:var(--surface-2);border:1px solid var(--line);border-radius:calc(var(--radius) * .75);padding:.75rem .8rem;font-size:.86rem;color:var(--muted);animation:nthview-swapin .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i) * 90ms + 200ms)}",
    M + " .nthview-phases b{display:block;color:var(--ink);font-family:var(--display);font-size:1rem;margin:.2rem 0 .15rem}",
    M + " .nthview-phases i{font-style:normal;font:800 .72rem var(--display);color:var(--on-accent);background:linear-gradient(135deg,var(--accent),var(--accent-2));border-radius:999px;padding:.1rem .45rem}",
    M + " .nthview-stats{display:flex;flex-wrap:wrap;gap:.4rem;margin:.6rem 0}",
    M + " .nthview-stats span{font-size:.8rem;font-weight:700;border:1px solid var(--line);border-radius:999px;padding:.22rem .65rem;background:var(--surface-2)}",
    M + " .nthview-status{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}",
    /* narrow screens: bottom sheets */
    "@media (max-width:899px){" +
      M + " .nthview-top{left:8px;right:8px;top:8px;gap:.4rem}" +
      M + " .nthview-brand{flex:1 1 auto;padding:.35rem .7rem .35rem .4rem}" +
      M + " .nthview-steps{margin:0;padding:.22rem}" +
      M + " .nthview-steps li{padding:.25rem;font-size:0;gap:0}" +
      M + " .nthview-steps li span{font-size:.68rem}" +
      M + " .nthview-chipbtn{padding:.5rem .6rem}" +
      M + " .nthview-chipbtn .nthview-cbtext{display:none}" +
      M + " .nthview-legend{left:0;right:0;width:auto;top:64px;bottom:auto;flex-wrap:nowrap;overflow-x:auto;padding:0 8px 4px;scrollbar-width:none}" +
      M + " .nthview-legend::-webkit-scrollbar{display:none}" +
      M + " .nthview-guide{left:0;right:0;bottom:0;top:auto;width:auto;max-height:min(52%,30rem);border-radius:var(--radius) var(--radius) 0 0;padding:.4rem 1rem 1rem;border-bottom:0}" +
      M + " .nthview-guide.nthview-min{max-height:3.4rem;overflow:hidden}" +
      M + " .nthview-grab{display:flex;justify-content:center;width:100%;border:0;background:none;padding:.35rem 0 .5rem;margin:0}" +
      M + " .nthview-grab span{width:2.6rem;height:.3rem;border-radius:999px;background:var(--line)}" +
      M + " .nthview-details{left:0;right:0;bottom:0;top:auto;width:auto;max-height:62%;border-radius:var(--radius) var(--radius) 0 0;transform:translateY(105%)}" +
      M + " .nthview-corner{right:8px;bottom:calc(var(--nv-sheet,0px) + 8px)}" +
      M + " .nthview-mini{display:none}" +
      M + " .nthview-tiles{grid-template-columns:repeat(2,1fr)}" +
    "}",
    "@media (max-width:560px){" + M + " .nthview-phases{grid-template-columns:1fr}" + M + " .nthview-brandtext small{display:none}" + M + " .nthview-selects{grid-template-columns:1fr}}",
    "@media (prefers-reduced-motion:reduce){" + M + " .nthview-blob," + M + " .nthview-node," + M + " .nthview-elabel," + M + " .nthview-flow," + M + " .nthview-rubber," + M + " .nthview-introcard," + M + " .nthview-phases li," + M + " .nthview-swap," + M + " .nthview-fb," + M + " .nthview-node::after{animation:none !important}" + M + " .nthview-details," + M + " .nthview-intro," + M + " .nthview-bar," + M + " .nthview-node," + M + " .nthview-hull," + M + " .nthview-eg{transition:none !important}}"
  ].join("\n");

  function injectStyles() {
    if (root.document.getElementById(STYLE_ID)) return;
    var style = root.document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = CSS;
    root.document.head.appendChild(style);
  }

  function el(tag, attrs, children) {
    var node = root.document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }

  function renderErrorPanel(container, result) {
    var items = result.errors.map(function (e) {
      return el("li", {}, [el("code", { text: e.path }), root.document.createTextNode(": " + e.message)]);
    });
    container.appendChild(el("div", { class: "nthview-error-panel", role: "alert" }, [
      el("h2", { text: "This view could not be built" }),
      el("p", { text: "The data has " + result.errors.length + " problem(s). Fix them and rebuild the file." }),
      el("ul", {}, items)
    ]));
  }

  // ---- view-specific rendering: data is already valid here ---------------
  var SVG_NS = "http://www.w3.org/2000/svg";
  var LETTERS = "ABCDEF";
  var KIND = {
    place: "Sort into clusters", relation: "Name the link", connect: "Draw the missing link",
    spot: "Spot the wrong link", order: "Put the process in order", label: "Name the concept"
  };

  function svgEl(tag, attrs) {
    var n = root.document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function icon(name) {
    var s = svgEl("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" });
    var paths = {
      check: ["M5 12.5l4.5 4.5L19 7.5", "stroke"],
      bulb: ["M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z", "stroke"],
      plus: ["M12 5v14M5 12h14", "stroke"],
      minus: ["M5 12h14", "stroke"],
      fit: ["M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5", "stroke"],
      book: ["M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 5v16M8 7h7", "stroke"],
      map: ["M5 6a2 2 0 1 0 4 0 2 2 0 1 0-4 0M15 8a2 2 0 1 0 4 0 2 2 0 1 0-4 0M9 17a2 2 0 1 0 4 0 2 2 0 1 0-4 0M8.6 7.2l6.5 1M16 9.8l-4.2 5.6M7.4 8l2.4 7.2", "stroke"]
    };
    var p = paths[name];
    s.appendChild(svgEl("path", { d: p[0], fill: "none", stroke: "currentColor", "stroke-width": name === "map" ? "2" : "2.4", "stroke-linecap": "round", "stroke-linejoin": "round" }));
    return s;
  }
  function rich(text) {
    var frag = root.document.createDocumentFragment();
    String(text).split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
      if (!part) return;
      if (/^\*\*[^*]+\*\*$/.test(part)) frag.appendChild(el("b", { text: part.slice(2, -2) }));
      else frag.appendChild(root.document.createTextNode(part));
    });
    return frag;
  }
  function p(cls, text) { var n = el("p", cls ? { class: cls } : {}); n.appendChild(rich(text)); return n; }
  function btn(label, cls, onClick) {
    var b = el("button", { type: "button", class: "nthview-btn" + (cls ? " " + cls : ""), text: label });
    b.addEventListener("click", onClick); return b;
  }
  function hash(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; } return h >>> 0; }
  function mulberry32(a) {
    return function () { a = (a + 0x6D2B79F5) >>> 0; var t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function shuffled(list, seedStr, avoidIdentity) {
    var rnd = mulberry32(hash(seedStr)), out = list.slice();
    for (var tries = 0; tries < 6; tries++) {
      for (var i = out.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = out[i]; out[i] = out[j]; out[j] = t; }
      if (!avoidIdentity || out.some(function (x, k) { return x !== list[k]; })) return out;
    }
    out.push(out.shift());
    return out;
  }
  function pickTheme(data) {
    if (data.theme && THEMES.indexOf(data.theme) !== -1) return data.theme;
    return THEMES[hash(String(data.title || "")) % THEMES.length];
  }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }
  function r1(v) { return Math.round(v * 10) / 10; }

  /* ---------- node sizing (deterministic, independent of font loading) ---------- */
  function nodeSize(label, isRoot) {
    var cw = isRoot ? 9.4 : 8.1, pad = isRoot ? 50 : 44, L = label.length, maxW = isRoot ? 240 : 204;
    var one = L * cw + pad;
    if (one <= maxW) return { w: Math.max(isRoot ? 136 : 92, Math.ceil(one)), h: isRoot ? 54 : 42, lines: 1 };
    var lines = Math.min(3, Math.ceil((L * cw * 1.15) / (maxW - pad)));
    return { w: maxW, h: (isRoot ? 30 : 22) + lines * (isRoot ? 20 : 17), lines: lines };
  }

  /* ======================================================================
     Force-directed layout, seeded so the same data always gives the same map.
     1. Clusters become discs sized by their members. The root's cluster sits
        in the middle; the others start on a ring, ordered so strongly linked
        clusters are neighbours, then repel until no two discs overlap while
        linked clusters attract.
     2. Nodes are laid out with Fruchterman-Reingold forces (repulsion k²/d
        inside a cluster, short-range repulsion across clusters, attraction
        d²/k along edges, much weaker across clusters) plus a pull towards
        their cluster's centre and a wall at its rim. The root is pinned.
     3. A rectangle pass removes node overlaps, leaving room for edge labels,
        alternating with a pass that pushes nodes off edges running under them.
     4. Whole clusters are shifted apart until their padded boxes no longer
        overlap (so hulls never cross), then nudged back towards the centre
        as far as they can go without touching, to keep the map compact.
     5. After layout, each edge picks the smallest bend that keeps its curve
        clear of every other node (see computeBends in render).
     ====================================================================== */
  function runLayout(nodes, edges, clusters, rootNode, seed) {
    var rnd = mulberry32(seed), N = nodes.length, K = clusters.length, i, j, it, n, m, a, b, dx, dy, d, f, k;
    var GAP = 44;
    nodes.forEach(function (x) { x.rad = Math.sqrt(x.w * x.h) / 2; });
    /* 1. clusters as discs sized by their members, laid out first */
    clusters.forEach(function (c) {
      var area = 0;
      c.members.forEach(function (x) { area += (x.w + 34) * (x.h + 40); });
      c.r = Math.max(60, Math.sqrt(area / Math.PI) * 1.08);
    });
    var link = clusters.map(function () { return clusters.map(function () { return 0; }); });
    edges.forEach(function (e) { var p = e.from.cluster.idx, q = e.to.cluster.idx; if (p !== q) { link[p][q]++; link[q][p]++; } });
    var first = rootNode.cluster, order = [first.idx], rest = clusters.map(function (c) { return c.idx; }).filter(function (x) { return x !== first.idx; });
    while (rest.length) {
      var last = order[order.length - 1], best = 0, bestScore = -1;
      rest.forEach(function (ci, q) { var s = link[last][ci] * 2 + link[first.idx][ci]; if (s > bestScore) { bestScore = s; best = q; } });
      order.push(rest.splice(best, 1)[0]);
    }
    var ring = order.slice(1), off = -Math.PI / 2 + (rnd() - .5) * .6;
    first.x = 0; first.y = 0;
    ring.forEach(function (ci, q) {
      var c = clusters[ci], ang = off + q * 2 * Math.PI / ring.length, R = first.r + c.r + GAP;
      c.x = Math.cos(ang) * R * .9; c.y = Math.sin(ang) * R;
    });
    for (it = 0; it < 400; it++) {
      for (i = 0; i < K; i++) {
        a = clusters[i];
        if (a === first) continue;
        var fx2 = -a.x * .028, fy2 = -a.y * .022;
        for (j = 0; j < K; j++) {
          if (i === j) continue;
          b = clusters[j]; dx = a.x - b.x; dy = a.y - b.y; d = Math.sqrt(dx * dx + dy * dy) || .01;
          var want = a.r + b.r + GAP;
          if (d < want) { fx2 += dx / d * (want - d) * .5; fy2 += dy / d * (want - d) * .5; }
          else if (link[i][j]) { fx2 -= dx / d * (d - want) * .01 * Math.min(4, link[i][j]); fy2 -= dy / d * (d - want) * .01 * Math.min(4, link[i][j]); }
        }
        a.x += fx2; a.y += fy2;
      }
    }
    /* 2. nodes inside their cluster: Fruchterman–Reingold plus containment */
    nodes.forEach(function (x) {
      var c = x.cluster, ang = rnd() * Math.PI * 2, rr = Math.sqrt(rnd()) * c.r * .6;
      x.x = c.x + Math.cos(ang) * rr; x.y = c.y + Math.sin(ang) * rr;
    });
    rootNode.x = first.x; rootNode.y = first.y;
    var fx = new Array(N), fy = new Array(N), IT = 420;
    for (it = 0; it < IT; it++) {
      var temp = 55 * Math.pow(1 - it / IT, 1.5) + .4;
      for (i = 0; i < N; i++) { fx[i] = 0; fy[i] = 0; }
      for (i = 0; i < N; i++) {
        n = nodes[i];
        for (j = i + 1; j < N; j++) {
          m = nodes[j]; dx = n.x - m.x; dy = n.y - m.y; d = dx * dx + dy * dy;
          if (d < .01) { dx = rnd() - .5; dy = rnd() - .5; d = dx * dx + dy * dy; }
          d = Math.sqrt(d);
          if (n.cluster === m.cluster) { k = 46 + (n.rad + m.rad) * .75; f = k * k / d; }
          else if (d < 220) f = (220 - d) * 1.2; else continue;
          fx[i] += dx / d * f; fy[i] += dy / d * f; fx[j] -= dx / d * f; fy[j] -= dy / d * f;
        }
      }
      for (i = 0; i < edges.length; i++) {
        a = edges[i].from; b = edges[i].to;
        dx = b.x - a.x; dy = b.y - a.y; d = Math.sqrt(dx * dx + dy * dy) || .01;
        k = 46 + (a.rad + b.rad) * .75;
        f = d * d / k * (a.cluster === b.cluster ? 1 : .08);
        fx[a.lidx] += dx / d * f; fy[a.lidx] += dy / d * f; fx[b.lidx] -= dx / d * f; fy[b.lidx] -= dy / d * f;
      }
      for (i = 0; i < N; i++) {
        n = nodes[i];
        if (n === rootNode) continue;
        var c2 = n.cluster; dx = c2.x - n.x; dy = c2.y - n.y; d = Math.sqrt(dx * dx + dy * dy);
        fx[i] += dx * .6; fy[i] += dy * .6;
        if (d > c2.r * .8) { fx[i] += dx / d * (d - c2.r * .8) * 4; fy[i] += dy / d * (d - c2.r * .8) * 4; }
        d = Math.sqrt(fx[i] * fx[i] + fy[i] * fy[i]);
        if (d > 0) { var s2 = Math.min(d, temp) / d; n.x += fx[i] * s2; n.y += fy[i] * s2; }
      }
    }
    /* 3. remove node overlaps inside clusters, leaving room for edge labels */
    var labelGap = {};
    edges.forEach(function (e) {
      var key = Math.min(e.from.lidx, e.to.lidx) * N + Math.max(e.from.lidx, e.to.lidx);
      labelGap[key] = Math.max(labelGap[key] || 0, e.d.relation.length * 6.6 + 34);
    });
    function separateNodes(passes) {
      for (var pass = 0; pass < passes; pass++) {
        var moved = false;
        for (i = 0; i < N; i++) {
          for (j = i + 1; j < N; j++) {
            n = nodes[i]; m = nodes[j];
            var same = n.cluster === m.cluster, px = same ? 28 : 60, py = same ? 32 : 60, lg = labelGap[i * N + j];
            if (lg) { px = Math.max(px, lg); py = Math.max(py, 44); }
            dx = m.x - n.x; dy = m.y - n.y;
            var ox = (n.w + m.w) / 2 + px - Math.abs(dx), oy = (n.h + m.h) / 2 + py - Math.abs(dy);
            if (ox <= 0 || oy <= 0) continue;
            moved = true;
            var sx = dx === 0 ? (i % 2 ? 1 : -1) : dx > 0 ? 1 : -1, sy = dy === 0 ? (j % 2 ? 1 : -1) : dy > 0 ? 1 : -1;
            var wn = n === rootNode ? 0 : m === rootNode ? 1 : .5, wm = 1 - wn;
            if (ox / (n.w + m.w) < oy / (n.h + m.h)) { n.x -= sx * ox * wn; m.x += sx * ox * wm; }
            else { n.y -= sy * oy * wn; m.y += sy * oy * wm; }
          }
        }
        if (!moved) return;
      }
    }
    separateNodes(200);
    /* 3b. push nodes off edges that run underneath them, so every arrow and label stays visible */
    function clearEdges(passes, sameOnly) {
      for (var pass = 0; pass < passes; pass++) {
        var moved = false;
        for (var q = 0; q < edges.length; q++) {
          var ea = edges[q].from, eb = edges[q].to, vx = eb.x - ea.x, vy = eb.y - ea.y, L2 = vx * vx + vy * vy;
          if (L2 < 1) continue;
          var L = Math.sqrt(L2), nx = -vy / L, ny = vx / L;
          for (i = 0; i < N; i++) {
            n = nodes[i];
            if (n === ea || n === eb) continue;
            if (sameOnly && n.cluster !== ea.cluster && n.cluster !== eb.cluster) continue;
            var t = ((n.x - ea.x) * vx + (n.y - ea.y) * vy) / L2;
            if (t <= 0.04 || t >= 0.96) continue;
            var dist = (n.x - ea.x) * nx + (n.y - ea.y) * ny, need = Math.abs(nx) * n.w / 2 + Math.abs(ny) * n.h / 2 + 14;
            if (Math.abs(dist) >= need) continue;
            moved = true;
            var push = (need - Math.abs(dist)) * (dist >= 0 ? 1 : -1);
            if (n !== rootNode) { n.x += nx * push * .7; n.y += ny * push * .7; }
            if (ea !== rootNode) { ea.x -= nx * push * .15; ea.y -= ny * push * .15; }
            if (eb !== rootNode) { eb.x -= nx * push * .15; eb.y -= ny * push * .15; }
          }
        }
        if (!moved) return;
      }
    }
    for (var round = 0; round < 3; round++) { clearEdges(40); separateNodes(120); }
    /* 4. move whole clusters apart until their padded boxes no longer overlap, so hulls never cross */
    function cbox(c) {
      var bx = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
      c.members.forEach(function (x) { bx.x0 = Math.min(bx.x0, x.x - x.w / 2); bx.x1 = Math.max(bx.x1, x.x + x.w / 2); bx.y0 = Math.min(bx.y0, x.y - x.h / 2); bx.y1 = Math.max(bx.y1, x.y + x.h / 2); });
      return bx;
    }
    function shift(c, sx, sy) { c.members.forEach(function (x) { x.x += sx; x.y += sy; }); }
    var live = clusters.filter(function (c) { return c.members.length; });
    function separateClusters() {
    for (var pass2 = 0; pass2 < 120; pass2++) {
      var any = false;
      for (i = 0; i < live.length; i++) {
        for (j = i + 1; j < live.length; j++) {
          var A = live[i], B = live[j], ba = cbox(A), bb = cbox(B), PAD = 58;
          var ox2 = Math.min(ba.x1, bb.x1) - Math.max(ba.x0, bb.x0) + PAD, oy2 = Math.min(ba.y1, bb.y1) - Math.max(ba.y0, bb.y0) + PAD;
          if (ox2 <= 0 || oy2 <= 0) continue;
          any = true;
          var ax = (ba.x0 + ba.x1) / 2, ay = (ba.y0 + ba.y1) / 2, bx2 = (bb.x0 + bb.x1) / 2, by2 = (bb.y0 + bb.y1) / 2;
          var wa = A === first ? 0 : B === first ? 1 : .5, wb = 1 - wa;
          if (ox2 < oy2) { var s3 = bx2 >= ax ? 1 : -1; shift(A, -s3 * ox2 * wa, 0); shift(B, s3 * ox2 * wb, 0); }
          else { var s4 = by2 >= ay ? 1 : -1; shift(A, 0, -s4 * oy2 * wa); shift(B, 0, -0 + s4 * oy2 * wb); }
        }
      }
      if (!any) return;
    }
    }
    separateClusters();
    /* 5. pull clusters back towards the centre while they stay apart, to keep the map compact */
    for (var pass3 = 0; pass3 < 40; pass3++) {
      live.forEach(function (c) {
        if (c === first) return;
        var bx = cbox(c), cx2 = (bx.x0 + bx.x1) / 2, cy2 = (bx.y0 + bx.y1) / 2, stepX = -cx2 * .06, stepY = -cy2 * .08;
        shift(c, stepX, stepY);
        var clash = live.some(function (o) {
          if (o === c) return false;
          var bo = cbox(o), bc = cbox(c);
          return Math.min(bc.x1, bo.x1) - Math.max(bc.x0, bo.x0) + 58 > 0 && Math.min(bc.y1, bo.y1) - Math.max(bc.y0, bo.y0) + 58 > 0;
        });
        if (clash) shift(c, -stepX, -stepY);
      });
    }
    clearEdges(30, true); separateNodes(60); separateClusters();
    nodes.forEach(function (x) { x.x = Math.round(x.x); x.y = Math.round(x.y); });
  }


  /* ---------- geometry helpers ---------- */
  function convexHull(pts) {
    if (pts.length < 3) return pts.slice();
    var s = pts.slice().sort(function (a, b) { return a.x - b.x || a.y - b.y; });
    function cross(o, a, b) { return (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x); }
    var lower = [], upper = [], i;
    for (i = 0; i < s.length; i++) { while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], s[i]) <= 0) lower.pop(); lower.push(s[i]); }
    for (i = s.length - 1; i >= 0; i--) { while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], s[i]) <= 0) upper.pop(); upper.push(s[i]); }
    upper.pop(); lower.pop();
    return lower.concat(upper);
  }
  function smoothPath(poly) {
    var n = poly.length;
    if (!n) return "";
    function mid(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
    var start = mid(poly[n - 1], poly[0]), d = "M" + r1(start.x) + "," + r1(start.y);
    for (var i = 0; i < n; i++) { var m = mid(poly[i], poly[(i + 1) % n]); d += "Q" + r1(poly[i].x) + "," + r1(poly[i].y) + " " + r1(m.x) + "," + r1(m.y); }
    return d + "Z";
  }
  function roundRectPts(x, y, w, h, pad, out) {
    var hw = w / 2, hh = h / 2;
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(function (c) {
      for (var a = 0; a <= 2; a++) {
        var ang = Math.atan2(c[1], c[0]) + (a - 1) * Math.PI / 4;
        out.push({ x: x + c[0] * hw + Math.cos(ang) * pad, y: y + c[1] * hh + Math.sin(ang) * pad });
      }
    });
  }
  function inPoly(pt, poly) {
    var inside = false;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[i], b = poly[j];
      if ((a.y > pt.y) !== (b.y > pt.y) && pt.x < (b.x - a.x) * (pt.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  }
  function polyDist(pt, poly) {
    var best = Infinity;
    for (var i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      var a = poly[j], b = poly[i], vx = b.x - a.x, vy = b.y - a.y, L2 = vx * vx + vy * vy || 1;
      var t = Math.max(0, Math.min(1, ((pt.x - a.x) * vx + (pt.y - a.y) * vy) / L2));
      best = Math.min(best, Math.hypot(a.x + vx * t - pt.x, a.y + vy * t - pt.y));
    }
    return best;
  }
  function clipRect(b, tx, ty) {
    var dx = tx - b.x, dy = ty - b.y;
    if (!dx && !dy) return { x: b.x, y: b.y };
    var hw = b.w / 2 + 4, hh = b.h / 2 + 4;
    var s = Math.min(hw / (Math.abs(dx) || 1e-9), hh / (Math.abs(dy) || 1e-9));
    return { x: b.x + dx * s, y: b.y + dy * s };
  }
  function edgeGeom(a, b, bend) {
    var dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
    var cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
    if (bend) { cx -= dy / len * bend; cy += dx / len * bend; }
    var s = clipRect(a, cx, cy), t = clipRect(b, cx, cy);
    if (!bend) { cx = (s.x + t.x) / 2; cy = (s.y + t.y) / 2; }
    var ang = Math.atan2(t.y - cy, t.x - cx), A = 10, W = 5.2;
    var ex = t.x - Math.cos(ang) * A * .6, ey = t.y - Math.sin(ang) * A * .6;
    var bx = t.x - Math.cos(ang) * A, by = t.y - Math.sin(ang) * A;
    return {
      d: "M" + r1(s.x) + "," + r1(s.y) + "Q" + r1(cx) + "," + r1(cy) + " " + r1(ex) + "," + r1(ey),
      a: "M" + r1(t.x) + "," + r1(t.y) + "L" + r1(bx - Math.sin(ang) * W) + "," + r1(by + Math.cos(ang) * W) + "L" + r1(bx + Math.sin(ang) * W) + "," + r1(by - Math.cos(ang) * W) + "Z",
      lx: r1(.25 * s.x + .5 * cx + .25 * t.x), ly: r1(.25 * s.y + .5 * cy + .25 * t.y),
      overlap: Math.abs(dx) < (a.w + b.w) / 2 && Math.abs(dy) < (a.h + b.h) / 2
    };
  }

  function render(container, data) {
    var doc = root.document;
    var gen = (container.__nthviewGen || 0) + 1;
    container.__nthviewGen = gen;
    function alive() { return container.__nthviewGen === gen; }
    var reduceMotion = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    function raf(fn) { return root.requestAnimationFrame(fn); }
    container.setAttribute("data-theme", pickTheme(data));
    container.classList.remove("nthview-far", "nthview-celebrate");

    /* ---------- model ---------- */
    var clusters = data.clusters.map(function (c, i) {
      return { id: c.id, name: c.name, desc: c.description, color: c.color || ROLES[i % ROLES.length], idx: i, members: [] };
    });
    var CL = {}; clusters.forEach(function (c) { CL[c.id] = c; });
    var nodes = data.nodes.map(function (d, i) {
      var isRoot = d.id === data.root, sz = nodeSize(d.label, isRoot);
      var n = { id: d.id, d: d, lidx: i, cluster: CL[d.cluster], isRoot: isRoot, w: sz.w, h: sz.h, lines: sz.lines, out: [], inc: [] };
      n.cluster.members.push(n);
      return n;
    });
    var ND = {}; nodes.forEach(function (n) { ND[n.id] = n; });
    var edges = data.edges.map(function (d, i) {
      var e = { id: d.id, d: d, idx: i, from: ND[d.from], to: ND[d.to] };
      e.from.out.push(e); e.to.inc.push(e);
      return e;
    });
    var ED = {}; edges.forEach(function (e) { ED[e.id] = e; });
    edges.forEach(function (e) { e.curved = edges.some(function (r) { return r.from === e.to && r.to === e.from; }); });
    var rootNode = ND[data.root];
    var tasks = data.rebuild.tasks;
    var BIG = nodes.length >= 30;
    var seedStr = data.title + "|" + nodes.map(function (n) { return n.id; }).join(",");
    runLayout(nodes, edges, clusters, rootNode, hash(seedStr));
    /* each edge takes the smallest bend whose curve clears every other node */
    function computeBends() {
      edges.forEach(function (e) {
        var a = e.from, b = e.to, dx = b.x - a.x, dy = b.y - a.y, len = Math.sqrt(dx * dx + dy * dy) || 1;
        var tries = e.curved ? [34, 64, 100, 140] : [0, 36, -36, 72, -72, 110, -110, 150, -150], best = tries[0], bestHits = Infinity;
        for (var q = 0; q < tries.length; q++) {
          var off = tries[q], cx = (a.x + b.x) / 2 - dy / len * off, cy = (a.y + b.y) / 2 + dx / len * off, hits = 0;
          for (var t = .08; t < .93; t += .05) {
            var u = 1 - t, x = u * u * a.x + 2 * u * t * cx + t * t * b.x, y = u * u * a.y + 2 * u * t * cy + t * t * b.y;
            for (var r = 0; r < nodes.length; r++) {
              var n = nodes[r];
              if (n === a || n === b) continue;
              if (Math.abs(x - n.x) < n.w / 2 + 8 && Math.abs(y - n.y) < n.h / 2 + 8) hits++;
            }
          }
          if (hits < bestHits) { bestHits = hits; best = off; }
          if (!hits) break;
        }
        e.bend = best;
      });
    }
    computeBends();

    var S = {
      phase: "intro", tour: 0, task: -1, done: {}, slips: [], skipped: [], collapsed: {},
      sel: null, src: null, picks: [], revealed: false, detailsFor: null, lastBox: null, lastMaxK: 1.25, ts: null
    };
    var cam = { x: 0, y: 0, k: 1 };

    /* ---------- DOM scaffold ---------- */
    var pattern = el("div", { class: "nthview-pattern" });
    var backdrop = el("div", { class: "nthview-backdrop", "aria-hidden": "true" }, [el("div", { class: "nthview-blob" }), el("div", { class: "nthview-blob" }), el("div", { class: "nthview-blob" }), pattern, el("div", { class: "nthview-grain" })]);
    var svg = svgEl("svg", { class: "nthview-svg", width: "1", height: "1", "aria-hidden": "true", focusable: "false" });
    var gHull = svgEl("g"), gEdge = svgEl("g"), gAgg = svgEl("g"), rubber = svgEl("line", { class: "nthview-rubber", x1: "0", y1: "0", x2: "0", y2: "0" });
    rubber.style.display = "none";
    svg.appendChild(gHull); svg.appendChild(gAgg); svg.appendChild(gEdge); svg.appendChild(rubber);
    var hullLayer = el("div", { class: "nthview-layer" }), aggLayer = el("div", { class: "nthview-layer" }), labelLayer = el("div", { class: "nthview-layer" }), nodeLayer = el("div", { class: "nthview-layer" });
    var world = el("div", { class: "nthview-world" }, [svg, hullLayer, aggLayer, labelLayer, nodeLayer]);
    var viewport = el("div", { class: "nthview-viewport", tabindex: "0", role: "region", "aria-roledescription": "concept map",
      "aria-label": "Concept map of " + data.title + ". Tab moves between concepts, Enter opens one. Arrow keys pan, plus and minus zoom, 0 fits the map." }, [world]);
    var status = el("div", { class: "nthview-status", "aria-live": "polite" });
    function announce(t) { status.textContent = ""; setTimeout(function () { status.textContent = t; }, 30); }

    /* top bar */
    var logo = el("span", { class: "nthview-logo", "aria-hidden": "true" }, [icon("map")]);
    var brand = el("div", { class: "nthview-brand nthview-glass" }, [logo, el("span", { class: "nthview-brandtext" }, [el("small", { text: "Concept map" }), el("b", { text: data.title })])]);
    var STEP_NAMES = ["Explore", "Rebuild", "Reflect", "Review"];
    var stepEls = STEP_NAMES.map(function (s, i) { return el("li", {}, [el("span", { text: String(i + 1) }), root.document.createTextNode(s)]); });
    var steps = el("ol", { class: "nthview-steps nthview-glass", "aria-label": "Stages" }, stepEls);
    var tools = el("div", { class: "nthview-tools" });
    var glossBtn = null;
    if (data.glossary && data.glossary.length) {
      glossBtn = el("button", { type: "button", class: "nthview-chipbtn nthview-glass", "aria-label": "Glossary" }, [icon("book"), el("span", { class: "nthview-cbtext", text: "Glossary" })]);
      glossBtn.querySelector("svg").setAttribute("width", "16"); glossBtn.querySelector("svg").setAttribute("height", "16");
      glossBtn.addEventListener("click", function () { openGlossary(); });
      tools.appendChild(glossBtn);
    }
    var top = el("header", { class: "nthview-top" }, [brand, steps, tools]);
    function setPhase(ph) {
      ["intro", "tour", "explore", "rebuild", "reflect", "end"].forEach(function (x) { container.classList.toggle("nthview-phase-" + x, x === ph); });
      S.phase = ph;
      setTimeout(syncSheet, 0);
    }
    function setStage(i) {
      stepEls.forEach(function (li, k) {
        li.classList.toggle("nthview-on", k === i); li.classList.toggle("nthview-past", k < i);
        if (k === i) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      });
    }

    /* legend */
    var legend = el("div", { class: "nthview-legend", role: "list", "aria-label": "Clusters" });
    clusters.forEach(function (c) {
      var go = el("button", { type: "button", "aria-label": "Show cluster " + c.name }, [el("span", { class: "nthview-ldot", "aria-hidden": "true" }), root.document.createTextNode(c.name)]);
      go.addEventListener("click", function () { showCluster(c); });
      var chip = el("div", { class: "nthview-lchip nthview-glass", role: "listitem", style: "--c:var(--k-" + c.color + ")" }, [go]);
      if (BIG) {
        var tg = el("button", { type: "button", class: "nthview-ltoggle", "aria-pressed": "false", "aria-label": "Collapse " + c.name, text: "−" });
        tg.addEventListener("click", function () { toggleCollapse(c); });
        chip.appendChild(tg); c.toggle = tg;
      }
      c.chip = chip;
      legend.appendChild(chip);
    });
    if (BIG) {
      var allBtn = el("button", { type: "button", class: "nthview-lchip nthview-glass", style: "padding:.35rem .75rem", text: "Collapse all" });
      allBtn.addEventListener("click", function () {
        var anyOpen = clusters.some(function (c) { return !S.collapsed[c.id] && c !== rootNode.cluster; });
        clusters.forEach(function (c) { if (c !== rootNode.cluster) S.collapsed[c.id] = anyOpen; });
        syncCollapse(); fitAll(600);
      });
      legend.appendChild(allBtn);
    }

    /* zoom + minimap */
    function zoomBtn(name, label, fn) { var b = el("button", { type: "button", "aria-label": label, title: label }, [icon(name)]); b.addEventListener("click", fn); return b; }
    var zoom = el("div", { class: "nthview-zoom nthview-glass" }, [
      zoomBtn("plus", "Zoom in", function () { zoomBy(1.3); }),
      zoomBtn("minus", "Zoom out", function () { zoomBy(1 / 1.3); }),
      zoomBtn("fit", "Fit the map", function () { refit(500, true); })
    ]);
    var corner = el("div", { class: "nthview-corner" }, [zoom]);
    var mini = null, miniSvg, miniView, miniG, miniBox;
    if (nodes.length >= 16) {
      miniSvg = svgEl("svg", { preserveAspectRatio: "xMidYMid meet", "aria-hidden": "true" });
      miniG = svgEl("g"); miniView = svgEl("rect", { class: "nthview-mview", rx: "6" });
      miniSvg.appendChild(miniG); miniSvg.appendChild(miniView);
      mini = el("div", { class: "nthview-mini nthview-glass", "aria-hidden": "true", title: "Minimap: click to move there" }, [miniSvg]);
      corner.insertBefore(mini, zoom);
    }

    /* guide + details panels */
    var grab = el("button", { type: "button", class: "nthview-grab", "aria-label": "Minimise or expand the panel" }, [el("span")]);
    var guideBody = el("div");
    var guide = el("aside", { class: "nthview-guide nthview-glass", "aria-label": "Guide" }, [grab, guideBody]);
    guide.hidden = true;
    grab.addEventListener("click", function () { guide.classList.toggle("nthview-min"); setTimeout(syncSheet, 30); });
    var closeBtn = el("button", { type: "button", class: "nthview-close", "aria-label": "Close details", text: "×" });
    var detailsBody = el("div");
    var details = el("aside", { class: "nthview-details nthview-glass", "aria-label": "Details", "aria-hidden": "true" }, [closeBtn, detailsBody]);
    closeBtn.addEventListener("click", function () { closeDetails(true); });
    var intro = el("div", { class: "nthview-intro" });

    container.appendChild(backdrop); container.appendChild(viewport); container.appendChild(legend); container.appendChild(corner);
    container.appendChild(guide); container.appendChild(details); container.appendChild(top); container.appendChild(intro); container.appendChild(status);

    /* ---------- map elements ---------- */
    clusters.forEach(function (c) {
      c.hull = svgEl("path", { class: "nthview-hull", style: "--c:var(--k-" + c.color + ")" });
      gHull.appendChild(c.hull);
      c.hlab = el("div", { class: "nthview-hlabel", style: "--c:var(--k-" + c.color + ")", text: c.name });
      hullLayer.appendChild(c.hlab);
      if (BIG) {
        c.bubble = { isBubble: true, id: "cluster:" + c.id, cluster: c, w: 176, h: 70, x: 0, y: 0 };
        var bb = el("button", { type: "button", class: "nthview-bubble", style: "--c:var(--k-" + c.color + ");width:176px;height:70px", "aria-label": c.name + ", collapsed cluster of " + c.members.length + " concepts. Press to expand." }, [el("span", { text: c.name }), el("small", { text: c.members.length + " concepts" })]);
        bb.hidden = true;
        bb.addEventListener("click", function () { toggleCollapse(c, false); });
        c.bubble.el = bb;
        nodeLayer.appendChild(bb);
      }
      if (mini) { c.mhull = svgEl("path", { class: "nthview-mhull", style: "--c:var(--k-" + c.color + ")" }); miniG.appendChild(c.mhull); }
    });
    edges.forEach(function (e) {
      e.g = svgEl("g", { class: "nthview-eg" });
      e.path = svgEl("path", { class: "nthview-edge" }); e.flow = svgEl("path", { class: "nthview-flow" }); e.arrow = svgEl("path", { class: "nthview-arrow" });
      e.g.appendChild(e.path); e.g.appendChild(e.flow); e.g.appendChild(e.arrow); gEdge.appendChild(e.g);
      e.lab = el("button", { type: "button", class: "nthview-elabel", tabindex: "-1", text: e.d.relation });
      e.lab.addEventListener("click", function (ev) { ev.stopPropagation(); onEdgeActivate(e); });
      labelLayer.appendChild(e.lab);
    });
    var tabOrder = nodes.slice().sort(function (a, b) {
      if (a.isRoot !== b.isRoot) return a.isRoot ? -1 : 1;
      return a.cluster.idx - b.cluster.idx || a.y - b.y || a.x - b.x;
    });
    tabOrder.forEach(function (n) {
      n.labEl = el("span", { class: "nthview-nlabel", text: n.d.label });
      n.el = el("button", { type: "button", class: "nthview-node" + (n.isRoot ? " nthview-root" : ""), "data-id": n.id,
        style: "--c:var(--k-" + n.cluster.color + ");width:" + n.w + "px;height:" + n.h + "px" }, [n.labEl]);
      n.el.addEventListener("click", function () { if (n.suppress) { n.suppress = false; return; } onNodeActivate(n); });
      n.el.addEventListener("focus", function () { ensureVisible(n); });
      n.el.addEventListener("pointerdown", function (ev) { nodePointerDown(ev, n); });
      nodeLayer.appendChild(n.el);
      if (mini) { n.mdot = svgEl("circle", { class: "nthview-mdot", r: "9", style: "--c:var(--k-" + n.cluster.color + ")" }); miniG.appendChild(n.mdot); }
      setNodeAria(n);
    });
    function setNodeAria(n) {
      var s = n.blank ? "Blank concept to name" : n.d.label;
      s += ", " + (n.loose ? "loose, not yet placed in a cluster" : "in " + n.cluster.name);
      if (n.isRoot) s += ", central idea";
      n.el.setAttribute("aria-label", s);
    }

    /* ---------- positions, drawing ---------- */
    function pos(n) { return n.isBubble ? n : n.drag || n.anim || (n.loose ? n.dock : { x: n.x, y: n.y }); }
    function boxOf(n) { var q = pos(n); return { x: q.x, y: q.y, w: n.w, h: n.h }; }
    function nodeVisible(n) { return !S.collapsed[n.cluster.id]; }
    function placeEl(n) { var q = pos(n); n.el.style.transform = "translate(" + r1(q.x - n.w / 2) + "px," + r1(q.y - n.h / 2) + "px)"; }
    function homeCentroid(c) {
      var x = 0, y = 0; c.members.forEach(function (n) { x += n.x; y += n.y; });
      return { x: x / Math.max(1, c.members.length), y: y / Math.max(1, c.members.length) };
    }
    function bubbleOf(c) { return c.bubble; }

    function drawHull(c) {
      if (S.collapsed[c.id]) {
        c.hull.style.display = "none"; c.hlab.hidden = true; c.poly = null;
        var cen = homeCentroid(c); c.bubble.x = cen.x; c.bubble.y = cen.y;
        c.bubble.el.hidden = false;
        c.bubble.el.style.transform = "translate(" + r1(cen.x - c.bubble.w / 2) + "px," + r1(cen.y - c.bubble.h / 2) + "px)";
        if (c.mhull) c.mhull.setAttribute("d", "");
        return;
      }
      if (c.bubble) c.bubble.el.hidden = true;
      var vis = c.members.filter(function (n) { return !n.loose; }), pts = [];
      if (!vis.length) {
        var ce = homeCentroid(c);
        for (var a = 0; a < 12; a++) pts.push({ x: ce.x + Math.cos(a * Math.PI / 6) * 80, y: ce.y + Math.sin(a * Math.PI / 6) * 60 });
        c.hull.classList.add("nthview-empty");
      } else {
        vis.forEach(function (n) { var q = pos(n); roundRectPts(q.x, q.y, n.w, n.h, 24, pts); });
        c.hull.classList.remove("nthview-empty");
      }
      var poly = convexHull(pts);
      c.poly = poly;
      var d = smoothPath(poly);
      c.hull.style.display = ""; c.hull.setAttribute("d", d);
      if (c.mhull) c.mhull.setAttribute("d", d);
      var topPt = poly[0];
      poly.forEach(function (q) { if (q.y < topPt.y) topPt = q; });
      var minX = Infinity, maxX = -Infinity;
      poly.forEach(function (q) { if (q.y < topPt.y + 30) { minX = Math.min(minX, q.x); maxX = Math.max(maxX, q.x); } });
      c.hlab.hidden = false;
      c.hlab.style.transform = "translate(" + r1((minX + maxX) / 2) + "px," + r1(topPt.y - 4) + "px) translate(-50%,-100%)";
    }

    function drawEdges() {
      var agg = {};
      edges.forEach(function (e) {
        var fv = nodeVisible(e.from), tv = nodeVisible(e.to);
        var hide = e.cut || e.from.loose || e.to.loose;
        if (hide || (!fv && !tv && e.from.cluster === e.to.cluster)) { setEdgeShown(e, false); return; }
        if (!fv || !tv) {
          setEdgeShown(e, false);
          var a = fv ? e.from : bubbleOf(e.from.cluster), b = tv ? e.to : bubbleOf(e.to.cluster), key = a.id + ">" + b.id;
          (agg[key] = agg[key] || { a: a, b: b, list: [] }).list.push(e);
          return;
        }
        var g = edgeGeom(boxOf(e.from), boxOf(e.to), e.bend || 0);
        if (g.overlap) { setEdgeShown(e, false); return; }
        setEdgeShown(e, true);
        e.path.setAttribute("d", g.d); e.flow.setAttribute("d", g.d); e.arrow.setAttribute("d", g.a);
        e.lx = g.lx; e.ly = g.ly;
        e.lab.style.transform = "translate(" + g.lx + "px," + g.ly + "px) translate(-50%,-50%)";
      });
      gAgg.textContent = ""; aggLayer.textContent = "";
      Object.keys(agg).forEach(function (k) {
        var A = agg[k], g = edgeGeom(boxOf(A.a), boxOf(A.b), 0);
        if (g.overlap) return;
        gAgg.appendChild(svgEl("path", { class: "nthview-agg", d: g.d }));
        gAgg.appendChild(svgEl("path", { class: "nthview-aggarrow", d: g.a }));
        var t = A.list.length === 1 ? A.list[0].d.relation : A.list.length + " links";
        var lab = el("span", { class: "nthview-agglabel", text: t });
        lab.style.transform = "translate(" + g.lx + "px," + g.ly + "px) translate(-50%,-50%)";
        aggLayer.appendChild(lab);
      });
    }
    function setEdgeShown(e, on) { e.g.style.display = on ? "" : "none"; e.lab.hidden = !on; e.shown = on; }

    function redraw() {
      nodes.forEach(function (n) { var v = nodeVisible(n); n.el.hidden = !v; if (v) placeEl(n); });
      clusters.forEach(drawHull);
      drawEdges();
      if (mini) nodes.forEach(function (n) { var q = n.isBubble ? n : pos(n); n.mdot.setAttribute("cx", r1(q.x)); n.mdot.setAttribute("cy", r1(q.y)); n.mdot.style.display = nodeVisible(n) ? "" : "none"; });
    }
    var redrawQueued = false;
    function queueRedraw() { if (redrawQueued) return; redrawQueued = true; raf(function () { redrawQueued = false; if (alive()) redraw(); }); }

    /* tween nodes to new display positions, redrawing edges and hulls as they move */
    function glide(list, done) {
      list = list.filter(Boolean);
      if (!list.length) { if (done) done(); return; }
      if (reduceMotion) { list.forEach(function (n) { delete n.anim; }); redraw(); if (done) done(); return; }
      var froms = list.map(function (n) { var q = n.anim || n.prev || pos(n); return { x: q.x, y: q.y }; });
      list.forEach(function (n) { delete n.prev; });
      var t0 = null, dur = 620;
      list.forEach(function (n, i) { n.anim = { x: froms[i].x, y: froms[i].y }; });
      function step(ts) {
        if (!alive()) return;
        if (t0 === null) t0 = ts;
        var u = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - u, 3);
        list.forEach(function (n, i) {
          var to = n.loose ? n.dock : { x: n.x, y: n.y };
          n.anim = { x: froms[i].x + (to.x - froms[i].x) * e, y: froms[i].y + (to.y - froms[i].y) * e };
        });
        redraw();
        if (u < 1) raf(step);
        else { list.forEach(function (n) { delete n.anim; }); redraw(); if (done) done(); }
      }
      raf(step);
    }

    /* ---------- camera ---------- */
    function vpSize() { return { w: viewport.clientWidth || 1, h: viewport.clientHeight || 1 }; }
    function isWide() { return vpSize().w >= 900; }
    function applyCam() {
      world.style.transform = "translate(" + r1(cam.x) + "px," + r1(cam.y) + "px) scale(" + Math.round(cam.k * 1000) / 1000 + ")";
      container.classList.toggle("nthview-far", cam.k < .6);
      pattern.style.backgroundPosition = r1(cam.x * .3) + "px " + r1(cam.y * .3) + "px";
      if (mini && miniBox) {
        var v = vpSize();
        miniView.setAttribute("x", r1(-cam.x / cam.k)); miniView.setAttribute("y", r1(-cam.y / cam.k));
        miniView.setAttribute("width", r1(v.w / cam.k)); miniView.setAttribute("height", r1(v.h / cam.k));
      }
    }
    function safeRect() {
      var v = vpSize(), l = 12, t = top.offsetTop + top.offsetHeight + 10, r = 12, b = 12;
      if (isWide()) {
        if (!guide.hidden) l = guide.offsetLeft + guide.offsetWidth + 14;
        if (details.classList.contains("nthview-open")) r = v.w - details.offsetLeft + 14;
        b = mini ? corner.offsetHeight + 20 : 12;
      } else {
        if (legend.offsetHeight) t = Math.max(t, legend.offsetTop + legend.offsetHeight + 6);
        var sheet = 0;
        if (!guide.hidden) sheet = guide.offsetHeight;
        if (details.classList.contains("nthview-open")) sheet = Math.max(sheet, details.offsetHeight);
        b = sheet + 10;
        r = 56;
      }
      var w = v.w - l - r, h = v.h - t - b;
      if (w < 120) { l = 12; w = v.w - 24; }
      if (h < 120) { t = 12; h = v.h - 24; }
      return { x: l, y: t, w: w, h: h };
    }
    function camFor(box, maxK) {
      var s = safeRect(), pad = Math.min(46, s.w * .08);
      var bw = Math.max(box.x1 - box.x0, 40), bh = Math.max(box.y1 - box.y0, 40);
      var k = clamp(Math.min((s.w - pad * 2) / bw, (s.h - pad * 2) / bh), .14, maxK || 1.25);
      var cx = (box.x0 + box.x1) / 2, cy = (box.y0 + box.y1) / 2;
      return { k: k, x: s.x + s.w / 2 - cx * k, y: s.y + s.h / 2 - cy * k };
    }
    var camAnim = null;
    function stopCam() { if (camAnim) camAnim.stop = true; camAnim = null; }
    function flyTo(t, dur) {
      stopCam();
      if (reduceMotion || !dur) { cam = t; applyCam(); return; }
      var v = vpSize(), vcx = v.w / 2, vcy = v.h / 2;
      var a = { cx: (vcx - cam.x) / cam.k, cy: (vcy - cam.y) / cam.k, k: cam.k };
      var b = { cx: (vcx - t.x) / t.k, cy: (vcy - t.y) / t.k, k: t.k };
      var dist = Math.sqrt(Math.pow(b.cx - a.cx, 2) + Math.pow(b.cy - a.cy, 2)) * Math.min(a.k, b.k);
      var bump = Math.min(.3, dist / (v.w * 2.5));
      var anim = { stop: false }, t0 = null;
      camAnim = anim;
      function step(ts) {
        if (anim.stop || !alive()) return;
        if (t0 === null) t0 = ts;
        var u = Math.min(1, (ts - t0) / dur), e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        var k = Math.exp(Math.log(a.k) + (Math.log(b.k) - Math.log(a.k)) * e) * (1 - bump * Math.sin(Math.PI * e));
        var cx = a.cx + (b.cx - a.cx) * e, cy = a.cy + (b.cy - a.cy) * e;
        cam = { k: k, x: vcx - cx * k, y: vcy - cy * k };
        applyCam();
        if (u < 1) raf(step); else { cam = t; applyCam(); camAnim = null; }
      }
      raf(step);
    }
    function fitBox(box, maxK, dur) { S.lastBox = box; S.lastMaxK = maxK || 1.25; flyTo(camFor(box, maxK), dur === undefined ? 900 : dur); }
    function refit(dur, all) { if (all || !S.lastBox) fitAll(dur); else flyTo(camFor(S.lastBox, S.lastMaxK), dur); }
    function boxFor(list) {
      var b = { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity };
      list.forEach(function (n) {
        if (!n) return;
        var q = n.isBubble ? n : (n.loose ? n.dock : { x: n.x, y: n.y });
        b.x0 = Math.min(b.x0, q.x - n.w / 2); b.x1 = Math.max(b.x1, q.x + n.w / 2);
        b.y0 = Math.min(b.y0, q.y - n.h / 2 - (n.isBubble ? 0 : 18)); b.y1 = Math.max(b.y1, q.y + n.h / 2);
      });
      if (b.x0 === Infinity) return { x0: -100, y0: -100, x1: 100, y1: 100 };
      return b;
    }
    function shownThing(n) { return nodeVisible(n) ? n : bubbleOf(n.cluster); }
    function allBox() { return boxFor(nodes.map(shownThing)); }
    function fitAll(dur) { fitBox(allBox(), 1.1, dur); }
    function zoomAt(px, py, f) {
      stopCam();
      var k = clamp(cam.k * f, .14, 2.6), mx = (px - cam.x) / cam.k, my = (py - cam.y) / cam.k;
      cam = { k: k, x: px - mx * k, y: py - my * k }; applyCam();
    }
    function zoomBy(f) { var s = safeRect(); zoomAt(s.x + s.w / 2, s.y + s.h / 2, f); }
    function ensureVisible(n) {
      if (!nodeVisible(n)) return;
      var q = pos(n), s = safeRect(), sx = q.x * cam.k + cam.x, sy = q.y * cam.k + cam.y, m = 30;
      if (sx > s.x + m && sx < s.x + s.w - m && sy > s.y + m && sy < s.y + s.h - m) return;
      var k = Math.max(cam.k, .75);
      flyTo({ k: k, x: s.x + s.w / 2 - q.x * k, y: s.y + s.h / 2 - q.y * k }, 450);
    }

    /* ---------- pointer: pan, pinch, wheel, drag ---------- */
    var pointers = {}, gesture = null;
    function local(ev) { var r = viewport.getBoundingClientRect(); return { x: ev.clientX - r.left, y: ev.clientY - r.top }; }
    function toMap(pt) { return { x: (pt.x - cam.x) / cam.k, y: (pt.y - cam.y) / cam.k }; }
    viewport.addEventListener("pointerdown", function (ev) {
      if (ev.target.closest && ev.target.closest(".nthview-node,.nthview-elabel,.nthview-bubble")) return;
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      pointers[ev.pointerId] = local(ev);
      try { viewport.setPointerCapture(ev.pointerId); } catch (e1) { /* ignore */ }
      stopCam();
      var ids = Object.keys(pointers);
      if (ids.length === 2) {
        var p1 = pointers[ids[0]], p2 = pointers[ids[1]];
        gesture = { type: "pinch", d0: Math.hypot(p1.x - p2.x, p1.y - p2.y) || 1, m0: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 }, cam0: { x: cam.x, y: cam.y, k: cam.k } };
      } else {
        gesture = { type: "pan", sx: pointers[ev.pointerId].x, sy: pointers[ev.pointerId].y, cam0: { x: cam.x, y: cam.y, k: cam.k }, moved: false };
      }
    });
    viewport.addEventListener("pointermove", function (ev) {
      if (S.src && S.phase === "rebuild") {
        var mp = toMap(local(ev)), sp = pos(S.src);
        rubber.setAttribute("x1", r1(sp.x)); rubber.setAttribute("y1", r1(sp.y)); rubber.setAttribute("x2", r1(mp.x)); rubber.setAttribute("y2", r1(mp.y));
        rubber.style.display = "";
      }
      if (!pointers[ev.pointerId] || !gesture) return;
      pointers[ev.pointerId] = local(ev);
      if (gesture.type === "pan") {
        var q = pointers[ev.pointerId], dx = q.x - gesture.sx, dy = q.y - gesture.sy;
        if (Math.abs(dx) + Math.abs(dy) > 4) { gesture.moved = true; viewport.classList.add("nthview-panning"); }
        cam = { k: gesture.cam0.k, x: gesture.cam0.x + dx, y: gesture.cam0.y + dy }; applyCam();
      } else {
        var ids = Object.keys(pointers);
        if (ids.length < 2) return;
        var a = pointers[ids[0]], b = pointers[ids[1]], d = Math.hypot(a.x - b.x, a.y - b.y), m = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
        var c0 = gesture.cam0, k = clamp(c0.k * d / gesture.d0, .14, 2.6);
        var mx = (gesture.m0.x - c0.x) / c0.k, my = (gesture.m0.y - c0.y) / c0.k;
        cam = { k: k, x: m.x - mx * k, y: m.y - my * k }; applyCam();
      }
    });
    function endPointer(ev) {
      if (!pointers[ev.pointerId]) return;
      var g = gesture, pt = pointers[ev.pointerId];
      delete pointers[ev.pointerId];
      viewport.classList.remove("nthview-panning");
      if (Object.keys(pointers).length === 0) gesture = null;
      else if (g && g.type === "pinch") { var rest = pointers[Object.keys(pointers)[0]]; gesture = { type: "pan", sx: rest.x, sy: rest.y, cam0: { x: cam.x, y: cam.y, k: cam.k }, moved: true }; }
      if (g && g.type === "pan" && !g.moved && ev.type === "pointerup") backgroundTap(toMap(pt));
    }
    viewport.addEventListener("pointerup", endPointer);
    viewport.addEventListener("pointercancel", endPointer);
    viewport.addEventListener("wheel", function (ev) {
      ev.preventDefault();
      var pt = local(ev), dy = ev.deltaMode === 1 ? ev.deltaY * 16 : ev.deltaY;
      zoomAt(pt.x, pt.y, Math.exp(-dy * (ev.ctrlKey ? .01 : .0016)));
    }, { passive: false });
    viewport.addEventListener("keydown", function (ev) {
      if (ev.target !== viewport) return;
      var step = 70, used = true;
      if (ev.key === "ArrowLeft") { stopCam(); cam.x += step; applyCam(); }
      else if (ev.key === "ArrowRight") { stopCam(); cam.x -= step; applyCam(); }
      else if (ev.key === "ArrowUp") { stopCam(); cam.y += step; applyCam(); }
      else if (ev.key === "ArrowDown") { stopCam(); cam.y -= step; applyCam(); }
      else if (ev.key === "+" || ev.key === "=" || ev.code === "Equal" || ev.code === "NumpadAdd") zoomBy(1.25);
      else if (ev.key === "-" || ev.key === "_" || ev.code === "Minus" || ev.code === "NumpadSubtract") zoomBy(1 / 1.25);
      else if (ev.key === "0") refit(500, true);
      else used = false;
      if (used) ev.preventDefault();
    });
    container.addEventListener("keydown", function (ev) {
      if (ev.key !== "Escape") return;
      if (S.src) { clearSource(); ev.preventDefault(); return; }
      if (S.sel) { selectLoose(null); ev.preventDefault(); return; }
      if (details.classList.contains("nthview-open")) { closeDetails(true); ev.preventDefault(); }
    });

    function nodePointerDown(ev, n) {
      if (ev.pointerType === "mouse" && ev.button !== 0) return;
      var mode = canDrag(n);
      if (!mode) return;
      ev.stopPropagation();
      var start = local(ev), orig = pos(n), moved = false, pid = ev.pointerId;
      try { n.el.setPointerCapture(pid); } catch (e1) { /* ignore */ }
      stopCam();
      function move(e2) {
        if (e2.pointerId !== pid) return;
        var q = local(e2), dx = (q.x - start.x) / cam.k, dy = (q.y - start.y) / cam.k;
        if (!moved && Math.abs(dx) + Math.abs(dy) < 6 / cam.k) return;
        if (!moved) { moved = true; n.el.classList.add("nthview-dragging"); }
        n.drag = { x: orig.x + dx, y: orig.y + dy };
        if (mode === "place") highlightTarget(clusterAt(n.drag));
        queueRedraw();
      }
      function up(e2) {
        if (e2.pointerId !== pid) return;
        n.el.removeEventListener("pointermove", move); n.el.removeEventListener("pointerup", up); n.el.removeEventListener("pointercancel", up);
        n.el.classList.remove("nthview-dragging");
        if (!moved) return;
        n.suppress = true; setTimeout(function () { n.suppress = false; }, 400);
        var at = n.drag; delete n.drag;
        highlightTarget(null);
        if (mode === "move") { n.x = at.x; n.y = at.y; computeBends(); redraw(); return; }
        var c = clusterAt(at);
        n.prev = at;
        if (c) attemptPlace(n, c);
        else {
          glide([n]);
          S.ts.fb.textContent = "";
          S.ts.fb.appendChild(p("nthview-small nthview-muted", "Drop it onto a cluster's shaded area, or tap it and then a cluster button."));
          syncSheet();
        }
      }
      n.el.addEventListener("pointermove", move); n.el.addEventListener("pointerup", up); n.el.addEventListener("pointercancel", up);
    }
    function canDrag(n) {
      if (S.phase === "tour" || S.phase === "explore" || S.phase === "end") return "move";
      if (S.phase === "rebuild" && n.loose && S.ts && S.ts.task.type === "place" && S.ts.task.nodes.indexOf(n.id) !== -1) return "place";
      return null;
    }
    function clusterAt(pt) {
      var best = null, bestArea = Infinity;
      clusters.forEach(function (c) {
        if (!c.poly || !inPoly(pt, c.poly)) return;
        var b = boxFor(c.members.filter(function (n) { return !n.loose; })), area = (b.x1 - b.x0) * (b.y1 - b.y0);
        if (area < bestArea) { bestArea = area; best = c; }
      });
      if (best) return best;
      var near = null, nd = 44 / cam.k;
      clusters.forEach(function (c) { if (!c.poly) return; var d = polyDist(pt, c.poly); if (d < nd) { nd = d; near = c; } });
      return near;
    }
    function highlightTarget(c) { clusters.forEach(function (x) { x.hull.classList.toggle("nthview-target", x === c); }); }
    function backgroundTap(mp) {
      if (S.phase === "rebuild" && S.sel) { var c = clusterAt(mp); if (c) attemptPlace(S.sel, c); return; }
      if (S.phase === "rebuild" && S.src) { clearSource(); return; }
    }

    /* ---------- minimap ---------- */
    function setupMini() {
      if (!mini) return;
      var b = boxFor(nodes), pad = 120;
      nodes.forEach(function (n) { if (n.dock) { b.x0 = Math.min(b.x0, n.dock.x - n.w); b.x1 = Math.max(b.x1, n.dock.x + n.w); b.y1 = Math.max(b.y1, n.dock.y + n.h); } });
      miniBox = { x: b.x0 - pad, y: b.y0 - pad, w: b.x1 - b.x0 + pad * 2, h: b.y1 - b.y0 + pad * 2 };
      miniSvg.setAttribute("viewBox", r1(miniBox.x) + " " + r1(miniBox.y) + " " + r1(miniBox.w) + " " + r1(miniBox.h));
      applyCam();
    }
    if (mini) {
      var miniDrag = false;
      var miniGo = function (ev) {
        var r = miniSvg.getBoundingClientRect(), sc = Math.min(r.width / miniBox.w, r.height / miniBox.h);
        var ox = r.left + (r.width - miniBox.w * sc) / 2, oy = r.top + (r.height - miniBox.h * sc) / 2;
        var mx = miniBox.x + (ev.clientX - ox) / sc, my = miniBox.y + (ev.clientY - oy) / sc, v = vpSize();
        stopCam(); cam = { k: cam.k, x: v.w / 2 - mx * cam.k, y: v.h / 2 - my * cam.k }; applyCam();
      };
      mini.addEventListener("pointerdown", function (ev) { miniDrag = true; try { mini.setPointerCapture(ev.pointerId); } catch (e1) { /* ignore */ } miniGo(ev); });
      mini.addEventListener("pointermove", function (ev) { if (miniDrag) miniGo(ev); });
      mini.addEventListener("pointerup", function () { miniDrag = false; });
      mini.addEventListener("pointercancel", function () { miniDrag = false; });
    }

    /* ---------- collapse (30+ nodes) ---------- */
    function collapseAllowed() { return BIG && (S.phase === "tour" || S.phase === "explore" || S.phase === "end"); }
    function toggleCollapse(c, force) {
      if (!collapseAllowed() && force !== false) return;
      var to = force === undefined ? !S.collapsed[c.id] : force;
      if (to && details.classList.contains("nthview-open") && S.detailsFor && S.detailsFor.cluster === c) closeDetails(false);
      S.collapsed[c.id] = to;
      syncCollapse();
      announce(c.name + (to ? " collapsed" : " expanded"));
      if (!to) fitBox(boxFor(c.members), 1.1, 700);
    }
    function syncCollapse() {
      clusters.forEach(function (c) {
        if (!c.toggle) return;
        var on = !!S.collapsed[c.id];
        c.toggle.textContent = on ? "+" : "−";
        c.toggle.setAttribute("aria-pressed", String(on));
        c.toggle.setAttribute("aria-label", (on ? "Expand " : "Collapse ") + c.name);
        c.toggle.disabled = !collapseAllowed();
      });
      redraw();
    }
    function expandFor(list) { var changed = false; list.forEach(function (n) { if (S.collapsed[n.cluster.id]) { S.collapsed[n.cluster.id] = false; changed = true; } }); if (changed) syncCollapse(); }
    function expandAll() { var any = Object.keys(S.collapsed).some(function (k) { return S.collapsed[k]; }); S.collapsed = {}; if (any || BIG) syncCollapse(); }
    function showCluster(c) {
      if (S.collapsed[c.id]) { fitBox(boxFor([c.bubble]), 1, 700); return; }
      fitBox(boxFor(c.members.filter(function (n) { return S.phase !== "rebuild" || !n.loose; }).concat(c.members.length ? [] : [rootNode])), 1.15, 700);
      if (c.desc && (S.phase === "explore" || S.phase === "tour" || S.phase === "end")) openClusterDetails(c);
    }

    /* ---------- focus styling ---------- */
    function setFocus(nodeSet, edgeSet) {
      var any = !!nodeSet;
      nodes.forEach(function (n) { n.el.classList.toggle("nthview-dim", any && !nodeSet[n.id]); n.el.classList.toggle("nthview-lit", any && !!nodeSet[n.id]); });
      edges.forEach(function (e) {
        var on = any && !!edgeSet[e.id];
        e.g.classList.toggle("nthview-dim", any && !on); e.g.classList.toggle("nthview-lit", on);
        e.lab.classList.toggle("nthview-dim", any && !on); e.lab.classList.toggle("nthview-lit", on);
      });
      clusters.forEach(function (c) {
        var on = !any || c.members.some(function (n) { return nodeSet[n.id]; });
        c.hull.classList.toggle("nthview-dim", !on); c.hlab.classList.toggle("nthview-dim", !on);
      });
    }
    function focusSets(ids) {
      var ns = {}, es = {}, explicitEdges = false;
      ids.forEach(function (id) { if (ND[id]) ns[id] = true; else if (ED[id]) { es[id] = true; explicitEdges = true; } });
      if (!explicitEdges) edges.forEach(function (e) { if (ns[e.from.id] && ns[e.to.id]) es[e.id] = true; });
      Object.keys(es).forEach(function (id) { ns[ED[id].from.id] = true; ns[ED[id].to.id] = true; });
      return { ns: ns, es: es };
    }
    function clearMarks() {
      nodes.forEach(function (n) { n.el.classList.remove("nthview-now", "nthview-sel", "nthview-src", "nthview-hinted", "nthview-open"); });
      edges.forEach(function (e) { e.g.classList.remove("nthview-now", "nthview-key", "nthview-picked"); e.lab.classList.remove("nthview-now", "nthview-cand", "nthview-cleared", "nthview-key", "nthview-picked"); e.lab.setAttribute("tabindex", "-1"); e.lab.removeAttribute("aria-pressed"); e.lab.removeAttribute("aria-label"); });
    }

    /* ---------- grow-in animation ---------- */
    function growMap() {
      if (reduceMotion) return;
      var depth = {}, queue = [rootNode]; depth[rootNode.id] = 0;
      while (queue.length) {
        var cur = queue.shift();
        cur.out.concat(cur.inc).forEach(function (e) { var o = e.from === cur ? e.to : e.from; if (depth[o.id] === undefined) { depth[o.id] = depth[cur.id] + 1; queue.push(o); } });
      }
      var maxD = 0;
      nodes.forEach(function (n) { if (depth[n.id] === undefined) depth[n.id] = 4; maxD = Math.max(maxD, depth[n.id]); });
      var stepMs = Math.min(260, 1500 / Math.max(1, maxD));
      nodes.forEach(function (n) { n.el.style.setProperty("--d", (depth[n.id] * stepMs + (n.lidx % 5) * 30) + "ms"); n.el.classList.add("nthview-grow"); });
      edges.forEach(function (e) {
        var d = Math.max(depth[e.from.id], depth[e.to.id]) * stepMs + 120;
        e.g.style.setProperty("--d", d + "ms"); e.path.setAttribute("pathLength", "1"); e.g.classList.add("nthview-grow");
      });
      setTimeout(function () {
        if (!alive()) return;
        nodes.forEach(function (n) { n.el.classList.remove("nthview-grow"); });
        edges.forEach(function (e) { e.g.classList.remove("nthview-grow"); e.path.removeAttribute("pathLength"); });
      }, maxD * stepMs + 1500);
    }

    /* ---------- details panel ---------- */
    function openDetails(kids, forNode) {
      detailsBody.textContent = "";
      kids.forEach(function (k) { if (k) detailsBody.appendChild(k); });
      nodes.forEach(function (n) { n.el.classList.toggle("nthview-open", n === forNode); });
      S.detailsFor = forNode || null;
      details.classList.add("nthview-open"); details.setAttribute("aria-hidden", "false");
      details.scrollTop = 0;
      syncSheet();
      var h = detailsBody.querySelector("h3");
      setTimeout(function () { if (h) h.focus({ preventScroll: true }); }, 60);
    }
    function closeDetails(restoreFocus) {
      if (!details.classList.contains("nthview-open")) return;
      details.classList.remove("nthview-open"); details.setAttribute("aria-hidden", "true");
      var n = S.detailsFor; S.detailsFor = null;
      nodes.forEach(function (x) { x.el.classList.remove("nthview-open"); });
      syncSheet();
      if (restoreFocus && n && !n.el.hidden) n.el.focus({ preventScroll: true });
    }
    function clusterTag(c) { return el("span", { class: "nthview-cl", style: "--c:var(--k-" + c.color + ")" }, [el("span", { class: "nthview-ldot", "aria-hidden": "true" }), root.document.createTextNode(c.name)]); }
    function linkSentence(e, fromSide) {
      var s = el("summary");
      if (fromSide) { s.appendChild(el("i", { text: e.d.relation })); s.appendChild(root.document.createTextNode(" → " + e.to.d.label)); }
      else { s.appendChild(root.document.createTextNode(e.from.d.label + " ")); s.appendChild(el("i", { text: e.d.relation })); s.appendChild(root.document.createTextNode(" → this")); }
      return s;
    }
    function openNodeDetails(n) {
      var kids = [clusterTag(n.cluster), el("h3", { tabindex: "-1", text: n.d.label })];
      if (n.isRoot) kids.push(el("span", { class: "nthview-tag", text: "Central idea" }));
      kids.push(p("nthview-def", n.d.definition));
      if (n.d.note) kids.push(p("", n.d.note));
      if (n.d.example) { var ex = el("div", { class: "nthview-example", style: "--c:var(--k-" + n.cluster.color + ")" }); ex.appendChild(rich("**Example:** " + n.d.example)); kids.push(ex); }
      var links = n.out.map(function (e) { return [e, true]; }).concat(n.inc.map(function (e) { return [e, false]; }));
      if (links.length) {
        kids.push(el("p", { class: "nthview-eyebrow", style: "margin-top:1rem", text: "Links (" + links.length + ")" }));
        var ul = el("ul", { class: "nthview-links" });
        links.forEach(function (pair) {
          var e = pair[0], other = pair[1] ? e.to : e.from;
          var det = el("details", {}, [linkSentence(e, pair[1])]);
          det.appendChild(p("", e.d.explanation));
          var go = el("button", { type: "button", class: "nthview-linkbtn", text: "Open " + other.d.label });
          go.addEventListener("click", function () { expandFor([other]); openNodeDetails(other); ensureVisible(other); });
          det.appendChild(go);
          det.addEventListener("toggle", function () { if (det.open) focusEdge(e); });
          ul.appendChild(el("li", {}, [det]));
        });
        kids.push(ul);
      }
      openDetails(kids, n);
      setTimeout(function () { if (alive()) ensureVisible(n); }, 80);
    }
    function openEdgeDetails(e) {
      var sent = el("div", { class: "nthview-sentence" }, [term(e.from), el("span", { class: "nthview-rel", text: e.d.relation }), el("span", { text: "→", "aria-hidden": "true" }), term(e.to)]);
      var a = el("button", { type: "button", class: "nthview-linkbtn", text: "Open " + e.from.d.label });
      a.addEventListener("click", function () { openNodeDetails(e.from); });
      var b = el("button", { type: "button", class: "nthview-linkbtn", text: "Open " + e.to.d.label });
      b.addEventListener("click", function () { openNodeDetails(e.to); });
      openDetails([el("p", { class: "nthview-eyebrow", text: "Link" }), el("h3", { tabindex: "-1", text: e.from.d.label + " " + e.d.relation + " " + e.to.d.label }), sent, p("", e.d.explanation), el("div", { class: "nthview-actions" }, [a, b])], null);
      focusEdge(e);
    }
    function openClusterDetails(c) {
      var list = el("div", { class: "nthview-chips" });
      c.members.forEach(function (n) { var b2 = el("button", { type: "button", class: "nthview-chip", style: "--c:var(--k-" + c.color + ")", text: n.d.label }); b2.addEventListener("click", function () { openNodeDetails(n); }); list.appendChild(b2); });
      openDetails([el("p", { class: "nthview-eyebrow", text: "Cluster" }), el("h3", { tabindex: "-1", text: c.name }), clusterTag(c), c.desc ? p("", c.desc) : null, list], null);
    }
    function openGlossary() {
      var dl = el("dl", { class: "nthview-gloss" });
      data.glossary.forEach(function (g) { dl.appendChild(el("dt", { text: g.term })); var dd = el("dd"); dd.appendChild(rich(g.meaning)); dl.appendChild(dd); });
      openDetails([el("p", { class: "nthview-eyebrow", text: "Glossary" }), el("h3", { tabindex: "-1", text: "Key terms" }), dl], null);
    }
    function focusEdge(e) {
      if (S.phase !== "explore" && S.phase !== "end" && S.phase !== "tour") return;
      expandFor([e.from, e.to]);
      var ns = {}, es = {}; ns[e.from.id] = ns[e.to.id] = true; es[e.id] = true;
      setFocus(ns, es);
      fitBox(boxFor([e.from, e.to]), 1.1, 700);
    }
    function term(n) { return el("span", { class: "nthview-term", style: "--c:var(--k-" + n.cluster.color + ")", text: n.d.label }); }

    /* ---------- guide panel ---------- */
    function setGuide(kids, focusEl) {
      guideBody.textContent = "";
      kids.forEach(function (k) { if (k) guideBody.appendChild(k); });
      guideBody.classList.remove("nthview-swap"); void guideBody.offsetWidth; guideBody.classList.add("nthview-swap");
      guide.hidden = false; guide.classList.remove("nthview-min"); guide.scrollTop = 0;
      syncSheet();
      if (focusEl) setTimeout(function () { if (alive()) focusEl.focus({ preventScroll: true }); }, 40);
    }
    function syncSheet() {
      var h = isWide() ? 0 : Math.max(guide.hidden ? 0 : guide.offsetHeight, details.classList.contains("nthview-open") ? details.offsetHeight : 0);
      container.style.setProperty("--nv-sheet", h + "px");
      container.style.setProperty("--nv-corner", isWide() ? (corner.offsetHeight + 16) + "px" : "0px");
      container.style.setProperty("--nv-legend", isWide() ? legend.offsetHeight + "px" : "0px");
    }
    function revealFb() {
      setTimeout(function () {
        if (!alive() || !S.ts) return;
        var target = S.ts.acts || S.ts.fb, gr = guide.getBoundingClientRect(), tr = target.getBoundingClientRect();
        if (tr.bottom > gr.bottom - 8) guide.scrollTop += tr.bottom - gr.bottom + 16;
      }, 60);
    }
    function eyebrow(t, extra) { var e = el("p", { class: "nthview-eyebrow" }, [root.document.createTextNode(t)]); if (extra) e.appendChild(extra); return e; }
    function heading(t) { var h = el("h2", { tabindex: "-1" }); h.appendChild(rich(t)); return h; }
    function progressBar(i, n) { var bar = el("div", { class: "nthview-bar" }); bar.style.width = Math.round(i / n * 100) + "%"; return el("div", { class: "nthview-track", role: "progressbar", "aria-label": "Progress", "aria-valuemin": "0", "aria-valuemax": String(n), "aria-valuenow": String(i) }, [bar]); }
    function feedback(ok, title, texts) {
      var ic = el("span", { class: "nthview-ic " + (ok ? "nthview-icok" : "nthview-icno"), "aria-hidden": "true" }, [icon(ok ? "check" : "bulb")]);
      var box = el("div", { class: "nthview-fb " + (ok ? "nthview-fbok" : "nthview-fbno"), role: "status" }, [el("b", { class: "nthview-fbh" }, [ic, root.document.createTextNode(title)])]);
      texts.forEach(function (t) { if (t) box.appendChild(p("", t)); });
      return box;
    }

    /* ---------- intro ---------- */
    function showIntro() {
      setPhase("intro"); setStage(0);
      clearMarks(); setFocus(null); closeDetails(false);
      guide.hidden = true;
      intro.hidden = false; intro.classList.remove("nthview-gone");
      intro.textContent = "";
      var card = el("div", { class: "nthview-introcard nthview-glass", role: "dialog", "aria-modal": "false", "aria-label": "Introduction" });
      card.appendChild(el("p", { class: "nthview-eyebrow", text: "Concept map" }));
      var h1 = el("h1", { tabindex: "-1", text: data.title });
      card.appendChild(h1);
      if (data.subtitle) card.appendChild(p("nthview-lede", data.subtitle));
      (data.intro || []).forEach(function (t) { card.appendChild(p("", t)); });
      card.appendChild(el("div", { class: "nthview-stats" }, [el("span", { text: nodes.length + " concepts" }), el("span", { text: edges.length + " links" }), el("span", { text: clusters.length + " clusters" })]));
      var phases = [
        ["1", "See it whole", "A guided tour of " + data.tour.length + " stop" + (data.tour.length === 1 ? "" : "s") + " lights up one region at a time."],
        ["2", "Rebuild it", "The map comes apart. Put " + tasks.length + " piece" + (tasks.length === 1 ? "" : "s") + " back from memory, with hints."],
        ["3", "Reflect", "Pick the three links that matter most, then compare."]
      ];
      card.appendChild(el("ol", { class: "nthview-phases" }, phases.map(function (ph, i) { return el("li", { style: "--i:" + i }, [el("i", { text: ph[0] }), el("b", { text: ph[1] }), el("span", { text: ph[2] })]); })));
      card.appendChild(p("nthview-small nthview-muted", "Nothing is scored. Every slip comes with an explanation, and you can skip anything."));
      var start = btn("Start the tour", "nthview-primary", function () { leaveIntro(); showTour(0); });
      var free = btn("Explore on my own", "", function () { leaveIntro(); showExplore(); });
      card.appendChild(el("div", { class: "nthview-actions" }, [start, free]));
      intro.appendChild(card);
      restoreAll(); clearBadges();
      redraw(); setupMini();
      cam = camFor(allBox(), 1.1); applyCam();
      fitAll(0);
      growMap();
      setTimeout(function () { if (alive()) start.focus({ preventScroll: true }); }, 60);
    }
    function leaveIntro() {
      intro.classList.add("nthview-gone");
      setTimeout(function () { if (alive()) intro.hidden = true; }, reduceMotion ? 0 : 600);
    }

    /* ---------- tour ---------- */
    function showTour(i) {
      setPhase("tour"); S.tour = i; setStage(0);
      var st = data.tour[i], fs = focusSets(st.focus);
      expandFor(Object.keys(fs.ns).map(function (id) { return ND[id]; }));
      clearMarks(); setFocus(fs.ns, fs.es); syncCollapse();
      var dots = el("div", { class: "nthview-dots", "aria-hidden": "true" }, data.tour.map(function (_, k) { return el("span", { class: "nthview-dot" + (k === i ? " nthview-on" : k < i ? " nthview-past" : "") }); }));
      var h = heading(st.title);
      var chips = el("div", { class: "nthview-chips", "aria-label": "Concepts in this stop" });
      Object.keys(fs.ns).forEach(function (id) {
        var n = ND[id], b = el("button", { type: "button", class: "nthview-chip", style: "--c:var(--k-" + n.cluster.color + ")" }, [el("span", { class: "nthview-ldot", "aria-hidden": "true" }), root.document.createTextNode(n.d.label)]);
        b.addEventListener("click", function () { openNodeDetails(n); });
        chips.appendChild(b);
      });
      var last = i === data.tour.length - 1;
      var next = btn(last ? "Finish the tour" : "Next stop", "nthview-primary", function () { if (last) showExplore(true); else showTour(i + 1); });
      var acts = el("div", { class: "nthview-actions" });
      if (i > 0) acts.appendChild(btn("Back", "", function () { showTour(i - 1); }));
      acts.appendChild(next);
      if (!last) acts.appendChild(btn("Skip the tour", "nthview-ghost", function () { showExplore(true); }));
      var body = p("", st.text);
      setGuide([eyebrow("Guided tour · stop " + (i + 1) + " of " + data.tour.length), dots, h, body, chips, p("nthview-small nthview-muted", "Tap a concept on the map or above to read more."), acts], h);
      announce("Tour stop " + (i + 1) + ": " + st.title);
      fitBox(boxFor(Object.keys(fs.ns).map(function (id) { return ND[id]; })), 1.05, 1000);
    }

    /* ---------- free exploration ---------- */
    function showExplore(afterTour) {
      setPhase("explore"); setStage(0);
      clearMarks(); setFocus(null); restoreAll(); syncCollapse(); redraw();
      var h = heading(afterTour ? "Now the whole map" : "The whole map");
      var kids = [eyebrow("Explore"), h,
        p("", "Tap any concept to read its definition and links. Drag the background to pan, scroll or pinch to zoom, and drag a concept to move it."),
        BIG ? p("nthview-small nthview-muted", "Big map: collapse clusters from the legend to see the outline first.") : null,
        p("nthview-small nthview-muted", "When you feel you could draw it yourself, take it apart and rebuild it from memory."),
        el("div", { class: "nthview-actions" }, [btn("Rebuild it from memory", "nthview-primary", startRebuild), btn("Replay the tour", "", function () { showTour(0); })])];
      setGuide(kids, h);
      fitAll(900);
    }

    /* ---------- rebuild ---------- */
    function computeDocks() {
      var b = boxFor(nodes.map(function (n) { return n; }).filter(function () { return true; }));
      var loose = [];
      tasks.forEach(function (t) { if (t.type === "place") t.nodes.forEach(function (id) { loose.push(ND[id]); }); });
      if (!loose.length) return;
      var width = Math.max(b.x1 - b.x0, 560), gap = 26, rows = [[]], rowW = 0;
      loose.forEach(function (n) {
        if (rowW + n.w > width && rows[rows.length - 1].length) { rows.push([]); rowW = 0; }
        rows[rows.length - 1].push(n); rowW += n.w + gap;
      });
      var cx = (b.x0 + b.x1) / 2, y = b.y1 + 120;
      rows.forEach(function (row) {
        var tw = row.reduce(function (s, n) { return s + n.w + gap; }, -gap), x = cx - tw / 2;
        row.forEach(function (n) { n.dock = { x: Math.round(x + n.w / 2), y: Math.round(y) }; x += n.w + gap; });
        y += 74;
      });
    }
    function clearBadges() { nodes.forEach(function (n) { var b = n.el.querySelector(".nthview-badge"); if (b) n.el.removeChild(b); }); }
    function restoreAll() {
      nodes.forEach(function (n) {
        n.loose = false; n.blank = false; n.labEl.textContent = n.d.label; n.el.classList.remove("nthview-loose", "nthview-later", "nthview-blank"); setNodeAria(n);
      });
      edges.forEach(function (e) { e.cut = false; e.lab.textContent = e.d.relation; e.lab.classList.remove("nthview-q"); });
    }
    /* take apart every element of every task not yet done */
    function applyDisassembly() {
      restoreAll();
      tasks.forEach(function (t, i) {
        if (S.done[t.id]) return;
        var current = i === S.task;
        if (t.type === "place") t.nodes.forEach(function (id) { var n = ND[id]; if (S.ts && S.ts.placed && S.ts.placed[id] && current) return; n.loose = true; n.el.classList.add("nthview-loose"); n.el.classList.toggle("nthview-later", !current); setNodeAria(n); });
        else if (t.type === "label") { var n = ND[t.node]; n.blank = true; n.labEl.textContent = "?"; n.el.classList.add("nthview-blank"); setNodeAria(n); }
        else if (t.type === "order") { var set = {}; t.nodes.forEach(function (id) { set[id] = true; }); edges.forEach(function (e) { if (set[e.from.id] && set[e.to.id]) e.cut = true; }); }
        else if (t.type === "relation") { ED[t.edge].lab.textContent = "?"; ED[t.edge].lab.classList.add("nthview-q"); }
        else if (t.type === "connect") ED[t.edge].cut = true;
        else if (t.type === "spot") ED[t.edge].lab.textContent = t.wrongRelation;
      });
    }
    function startRebuild() {
      closeDetails(false);
      setPhase("rebuild"); expandAll(); S.task = -1; S.done = {}; S.slips = []; S.skipped = []; S.ts = null; setStage(1);
      clearMarks(); setFocus(null); clearBadges();
      nodes.forEach(function (n) { n.prev = { x: n.x, y: n.y }; });
      computeDocks(); setupMini();
      applyDisassembly();
      var moving = nodes.filter(function (n) { return n.loose; });
      nodes.forEach(function (n) { if (!n.loose) delete n.prev; });
      glide(moving);
      redraw();
      var counts = {};
      tasks.forEach(function (t) { counts[t.type] = (counts[t.type] || 0) + 1; });
      var chips = el("div", { class: "nthview-chips" }, Object.keys(counts).map(function (k) { return el("span", { class: "nthview-chip", text: KIND[k] + (counts[k] > 1 ? " ×" + counts[k] : "") }); }));
      var h = heading("The map has come apart");
      var go = btn("Start rebuilding", "nthview-primary", function () { showTask(0); });
      setGuide([eyebrow("Rebuild"), h, p("", data.rebuild.intro || "Some concepts have floated loose, some labels are blank, and a few links are missing or wrong. Put it back together from memory, one piece at a time."), chips,
        p("nthview-small nthview-muted", "Hints are there when you want them. A slip just shows you why; nothing is scored."), el("div", { class: "nthview-actions" }, [go])], h);
      announce("The map has come apart. " + tasks.length + " pieces to rebuild.");
      var all = boxFor(nodes);
      fitBox(all, 1, 1000);
    }
    function promptFor(t) {
      if (t.prompt) return t.prompt;
      if (t.type === "place") return t.nodes.length > 1 ? "Drag each loose concept into the cluster it belongs to." : "Drag the loose concept into the cluster it belongs to.";
      if (t.type === "relation") return "What is the link from **" + ED[t.edge].from.d.label + "** to **" + ED[t.edge].to.d.label + "**?";
      if (t.type === "connect") return "One link is missing. Which two concepts does it join?";
      if (t.type === "spot") return "One of the highlighted links says the wrong thing. Which one?";
      if (t.type === "order") return "Put these steps in the order they happen.";
      return "Which concept belongs in the blank?";
    }
    function taskBox(t) {
      var list = [];
      function nb(n) { list.push(n); n.out.concat(n.inc).forEach(function (e) { list.push(e.from === n ? e.to : e.from); }); }
      if (t.type === "place") return boxFor(nodes);
      if (t.type === "label") nb(ND[t.node]);
      if (t.type === "order") t.nodes.forEach(function (id) { list.push(ND[id]); });
      if (t.type === "relation" || t.type === "connect") { list.push(ED[t.edge].from, ED[t.edge].to); nb(ED[t.edge].from); }
      if (t.type === "spot") t.candidates.forEach(function (id) { list.push(ED[id].from, ED[id].to); });
      return boxFor(list.filter(function (n) { return !n.loose; }));
    }
    function showTask(i) {
      if (i >= tasks.length) { showReflect(); return; }
      S.task = i; selectLoose(null); clearSource();
      var t = tasks[i];
      S.ts = { task: t, solved: false, placed: {}, slipsHere: 0 };
      applyDisassembly(); clearMarks(); setFocus(null); redraw();
      var kids = [], h = heading(promptFor(t));
      kids.push(eyebrow("Rebuild · task " + (i + 1) + " of " + tasks.length + " ", el("span", { class: "nthview-kind", text: KIND[t.type] })));
      kids.push(progressBar(i, tasks.length));
      kids.push(h);
      var body = el("div"), fb = el("div", { "aria-live": "polite" }), hintArea = el("div"), acts = el("div", { class: "nthview-actions" });
      S.ts.body = body; S.ts.fb = fb; S.ts.acts = acts;
      if (t.type === "place") buildPlace(t, body);
      else if (t.type === "relation") buildChoice(t, body, ED[t.edge]);
      else if (t.type === "label") buildChoice(t, body, null);
      else if (t.type === "connect") buildConnect(t, body);
      else if (t.type === "spot") buildSpot(t, body);
      else if (t.type === "order") buildOrder(t, body);
      kids.push(body);
      var hintBtn = btn("Show a hint", "", function () {
        hintArea.textContent = ""; hintArea.appendChild(el("div", { class: "nthview-hintbox" }, [rich("**Hint:** " + t.hint)]));
        hintBtn.disabled = true;
        if (t.type === "connect") ED[t.edge].from.el.classList.add("nthview-hinted");
        syncSheet();
      });
      var skip = btn("Skip, show me", "nthview-ghost", function () { S.skipped.push({ task: t, index: i }); solve("skip"); });
      S.ts.hintBtn = hintBtn; S.ts.skip = skip;
      acts.appendChild(hintBtn); acts.appendChild(skip);
      kids.push(hintArea, fb, acts);
      setGuide(kids, h);
      announce("Task " + (i + 1) + ": " + KIND[t.type]);
      fitBox(taskBox(t), 1.15, 900);
    }
    function slip(record, title, texts) {
      S.slips.push(record); S.ts.slipsHere++;
      S.ts.fb.textContent = "";
      S.ts.fb.appendChild(feedback(false, title, texts));
      syncSheet(); revealFb();
      announce(title);
    }
    /* mark the task done, restore its piece, explain, offer Next */
    function solve(how) {
      var t = S.ts.task, i = S.task;
      if (S.ts.solved) return;
      S.ts.solved = true; S.done[t.id] = true;
      selectLoose(null); clearSource();
      if (S.ts.stateLine) S.ts.stateLine.hidden = true;
      var moved = [];
      if (t.type === "place") t.nodes.forEach(function (id) { var n = ND[id]; if (n.loose) { n.prev = pos(n); moved.push(n); } });
      applyDisassembly(); clearMarks();
      glide(moved, function () { moved.forEach(function (n) { n.el.classList.add("nthview-fixed"); }); });
      redraw();
      var extra = [], ns = {}, es = {};
      if (t.type === "place") t.nodes.forEach(function (id) { ns[id] = true; ND[id].el.classList.add("nthview-now"); });
      if (t.type === "relation" || t.type === "connect" || t.type === "spot") {
        var e = ED[t.edge]; es[e.id] = true; e.g.classList.add("nthview-now"); e.lab.classList.add("nthview-now", "nthview-fixed");
        extra.push("**" + e.from.d.label + " " + e.d.relation + " " + e.to.d.label + ".** " + e.d.explanation);
        if (t.type === "connect" && !reduceMotion) { e.path.setAttribute("pathLength", "1"); e.g.style.setProperty("--d", "0ms"); e.g.classList.add("nthview-grow"); setTimeout(function () { e.g.classList.remove("nthview-grow"); e.path.removeAttribute("pathLength"); }, 1300); }
      }
      if (t.type === "label") { var n = ND[t.node]; n.el.classList.add("nthview-now", "nthview-fixed"); extra.push("**" + n.d.label + ":** " + n.d.definition); }
      if (t.type === "order") {
        t.nodes.forEach(function (id, k) {
          var n2 = ND[id]; n2.el.classList.add("nthview-now");
          var old = n2.el.querySelector(".nthview-badge"); if (old) old.parentNode.removeChild(old);
          n2.el.appendChild(el("span", { class: "nthview-badge", "aria-hidden": "true", text: String(k + 1) }));
        });
        extra.push(t.nodes.map(function (id) { return ND[id].d.label; }).join(" → "));
      }
      S.ts.fb.textContent = "";
      var title = how === "skip" ? "Here is the answer" : S.ts.slipsHere ? "Got it now" : "Exactly right";
      S.ts.fb.appendChild(feedback(true, title, extra.concat([t.why])));
      S.ts.acts.textContent = "";
      var last = i === tasks.length - 1;
      var next = btn(last ? "On to reflection" : "Next task", "nthview-primary", function () { showTask(i + 1); });
      S.ts.acts.appendChild(next);
      S.ts.body.querySelectorAll("button,select").forEach(function (b) { b.disabled = true; });
      syncSheet(); revealFb();
      announce(title);
      setTimeout(function () { if (alive()) next.focus({ preventScroll: true }); }, 80);
    }

    /* place: drag (or tap) loose nodes into clusters */
    function buildPlace(t, body) {
      var looseRow = el("div", { class: "nthview-chips", role: "group", "aria-label": "Loose concepts" });
      var clRow = el("div", { class: "nthview-chips", role: "group", "aria-label": "Clusters" });
      S.ts.looseBtns = {};
      t.nodes.forEach(function (id) {
        var n = ND[id], b = el("button", { type: "button", class: "nthview-chip", "aria-pressed": "false", text: n.d.label });
        b.addEventListener("click", function () { selectLoose(S.sel === n ? null : n); });
        S.ts.looseBtns[id] = b; looseRow.appendChild(b);
        n.el.classList.add("nthview-now");
      });
      clusters.forEach(function (c) {
        var b = el("button", { type: "button", class: "nthview-chip nthview-clchip", style: "--c:var(--k-" + c.color + ")" }, [el("span", { class: "nthview-ldot", "aria-hidden": "true" }), root.document.createTextNode(c.name)]);
        b.addEventListener("click", function () {
          if (!S.sel) { S.ts.fb.textContent = ""; S.ts.fb.appendChild(p("nthview-small nthview-muted", "First pick a loose concept, then the cluster.")); return; }
          attemptPlace(S.sel, c);
        });
        clRow.appendChild(b);
      });
      body.appendChild(p("nthview-small nthview-muted", "Drag a loose concept from below the map onto its cluster, or tap it and then tap a cluster here."));
      body.appendChild(el("p", { class: "nthview-eyebrow", text: "Loose concepts" })); body.appendChild(looseRow);
      body.appendChild(el("p", { class: "nthview-eyebrow", text: "Clusters" })); body.appendChild(clRow);
    }
    function selectLoose(n) {
      if (S.sel) S.sel.el.classList.remove("nthview-sel");
      S.sel = n || null;
      if (S.ts && S.ts.looseBtns) Object.keys(S.ts.looseBtns).forEach(function (id) { S.ts.looseBtns[id].setAttribute("aria-pressed", String(!!n && n.id === id)); });
      if (n) { n.el.classList.add("nthview-sel"); announce(n.d.label + " picked up. Now choose its cluster."); }
    }
    function attemptPlace(n, c) {
      var t = S.ts && S.ts.task;
      if (!t || t.type !== "place" || !n.loose || S.ts.solved) return;
      if (!n.prev) n.prev = pos(n);
      if (c === n.cluster) {
        S.ts.placed[n.id] = true; n.loose = false;
        n.el.classList.remove("nthview-loose", "nthview-later", "nthview-sel"); setNodeAria(n);
        if (S.sel === n) selectLoose(null);
        var b = S.ts.looseBtns[n.id]; if (b) { b.disabled = true; b.setAttribute("aria-pressed", "false"); }
        glide([n], function () { n.el.classList.add("nthview-fixed"); });
        var left = t.nodes.filter(function (id) { return ND[id].loose; });
        if (!left.length) solve("ok");
        else {
          S.ts.fb.textContent = "";
          S.ts.fb.appendChild(feedback(true, n.d.label + " belongs in " + c.name, [n.d.definition]));
          syncSheet(); revealFb(); announce(n.d.label + " placed in " + c.name);
        }
      } else {
        glide([n]);
        n.el.classList.remove("nthview-shake"); void n.el.offsetWidth; n.el.classList.add("nthview-shake");
        slip({ task: t, kind: "place", chose: n.d.label + " in " + c.name, answer: n.d.label + " in " + n.cluster.name, why: t.why },
          "Not " + c.name, ["**" + n.d.label + ":** " + n.d.definition, "Think about its role in the system: which group does that put it in?"]);
      }
    }

    /* relation + label: choose from options */
    function buildChoice(t, body, e) {
      if (e) {
        e.g.classList.add("nthview-now"); e.lab.classList.add("nthview-now");
        body.appendChild(el("div", { class: "nthview-sentence", "aria-label": e.from.d.label + ", blank link, " + e.to.d.label }, [term(e.from), el("span", { class: "nthview-blankterm", text: "?" }), el("span", { text: "→", "aria-hidden": "true" }), term(e.to)]));
      } else {
        var n = ND[t.node];
        n.el.classList.add("nthview-now");
        var clues = n.inc.slice(0, 3).map(function (x) { return x.from.d.label + " " + x.d.relation + " ▢"; }).concat(n.out.slice(0, 3).map(function (x) { return "▢ " + x.d.relation + " " + x.to.d.label; }));
        body.appendChild(p("nthview-small nthview-muted", "It sits in **" + n.cluster.name + "**." + (clues.length ? " Its links read:" : "")));
        if (clues.length) body.appendChild(el("ul", { class: "nthview-small", style: "margin:.2rem 0 .6rem;padding-left:1.1rem" }, clues.map(function (c) { return el("li", { text: c }); })));
      }
      var opts = shuffled(t.options, t.id);
      var list = el("ul", { class: "nthview-opts" });
      opts.forEach(function (o, k) {
        var b = el("button", { type: "button", class: "nthview-opt" }, [el("span", { class: "nthview-key", "aria-hidden": "true", text: LETTERS[k] }), el("span", { text: o.label })]);
        b.addEventListener("click", function () {
          if (S.ts.solved) return;
          if (o.correct) { b.classList.add("nthview-yes"); solve("ok"); return; }
          b.classList.add("nthview-no"); b.disabled = true;
          var whyText = o.why || t.why;
          slip({ task: t, kind: t.type, chose: o.label, answer: e ? e.d.relation : ND[t.node].d.label, why: whyText }, "Not “" + o.label + "”", [whyText, "Try another."]);
        });
        list.appendChild(el("li", {}, [b]));
      });
      body.appendChild(list);
    }

    /* connect: tap source, then target (or use the two menus) */
    function buildConnect(t, body) {
      var e = ED[t.edge];
      body.appendChild(el("div", { class: "nthview-sentence" }, [el("span", { class: "nthview-blankterm", text: "?" }), el("span", { class: "nthview-rel", text: e.d.relation }), el("span", { text: "→", "aria-hidden": "true" }), el("span", { class: "nthview-blankterm", text: "?" })]));
      var stateLine = p("nthview-small", "Tap the concept the link **starts from** on the map.");
      S.ts.stateLine = stateLine;
      body.appendChild(stateLine);
      var sorted = nodes.filter(function (n) { return !n.loose; }).slice().sort(function (a, b) { return a.d.label.localeCompare(b.d.label); });
      function select(label) {
        var s = el("select", {}, [el("option", { value: "", text: "Choose…" })].concat(sorted.map(function (n) { return el("option", { value: n.id, text: n.d.label }); })));
        return { wrap: el("label", {}, [root.document.createTextNode(label), s]), s: s };
      }
      var a = select("From"), b = select("To");
      var linkBtn = btn("Link them", "", function () { if (a.s.value && b.s.value) tryConnect(ND[a.s.value], ND[b.s.value]); });
      body.appendChild(el("details", { class: "nthview-small" }, [el("summary", { text: "Or choose from lists", style: "cursor:pointer;color:var(--accent);font-weight:700" }), el("div", { class: "nthview-selects" }, [a.wrap, b.wrap]), linkBtn]));
    }
    function setSource(n) {
      clearSource();
      S.src = n; n.el.classList.add("nthview-src");
      if (S.ts && S.ts.stateLine) { S.ts.stateLine.textContent = ""; S.ts.stateLine.appendChild(rich("From **" + n.d.label + "**. Now tap where the link **points to**. (Tap it again or press Escape to cancel.)")); }
      announce("From " + n.d.label + ". Now choose where it points.");
    }
    function clearSource() {
      if (S.src) S.src.el.classList.remove("nthview-src");
      S.src = null; rubber.style.display = "none";
      if (S.ts && S.ts.stateLine && !S.ts.solved) { S.ts.stateLine.textContent = ""; S.ts.stateLine.appendChild(rich("Tap the concept the link **starts from** on the map.")); }
    }
    function tryConnect(a, b) {
      var t = S.ts.task, e = ED[t.edge];
      clearSource();
      if (a === e.from && b === e.to) { solve("ok"); return; }
      var msg, title;
      if (a === e.to && b === e.from) { title = "Right pair, wrong direction"; msg = "The arrow runs from **" + e.from.d.label + "** to **" + e.to.d.label + "**: ask which one acts on the other."; }
      else if (a === b) { title = "Pick two different concepts"; msg = "A link joins two concepts."; }
      else { title = "Not " + a.d.label + " → " + b.d.label; msg = existing(a, b) ? "Those two are linked already, by a different relation." : "Read it aloud: “" + a.d.label + " " + e.d.relation + " " + b.d.label + "”. Does that hold?"; }
      [a, b].forEach(function (n) { n.el.classList.remove("nthview-shake"); void n.el.offsetWidth; n.el.classList.add("nthview-shake"); });
      slip({ task: t, kind: "connect", chose: a.d.label + " → " + b.d.label, answer: e.from.d.label + " " + e.d.relation + " " + e.to.d.label, why: t.why }, title, [msg]);
    }
    function existing(a, b) { return a.out.some(function (e) { return e.to === b && !e.cut; }) || b.out.some(function (e) { return e.to === a && !e.cut; }); }

    /* spot: one candidate edge is mislabelled */
    function buildSpot(t, body) {
      var list = el("ul", { class: "nthview-opts" });
      S.ts.spotBtns = {};
      t.candidates.forEach(function (id, k) {
        var e = ED[id], rel = id === t.edge ? t.wrongRelation : e.d.relation;
        var b = el("button", { type: "button", class: "nthview-opt" }, [el("span", { class: "nthview-key", "aria-hidden": "true", text: LETTERS[k] }), el("span", { text: e.from.d.label + " — " + rel + " → " + e.to.d.label })]);
        b.addEventListener("click", function () { pickSpot(e); });
        S.ts.spotBtns[id] = b;
        list.appendChild(el("li", {}, [b]));
        e.lab.classList.add("nthview-cand"); e.lab.setAttribute("tabindex", "0");
        e.lab.setAttribute("aria-label", "Candidate link: " + e.from.d.label + " " + rel + " " + e.to.d.label);
      });
      var ns = {}, es = {};
      t.candidates.forEach(function (id) { es[id] = true; ns[ED[id].from.id] = ns[ED[id].to.id] = true; });
      setFocus(ns, es);
      body.appendChild(p("nthview-small nthview-muted", "Tap the suspicious label on the map, or choose here:"));
      body.appendChild(list);
    }
    function pickSpot(e) {
      var t = S.ts.task;
      if (S.ts.solved) return;
      if (e.id === t.edge) { S.ts.spotBtns[e.id].classList.add("nthview-yes"); solve("ok"); return; }
      var b = S.ts.spotBtns[e.id]; b.classList.add("nthview-no"); b.disabled = true;
      e.lab.classList.remove("nthview-cand"); e.lab.classList.add("nthview-cleared"); e.lab.setAttribute("tabindex", "-1");
      slip({ task: t, kind: "spot", chose: e.from.d.label + " " + e.d.relation + " " + e.to.d.label, answer: ED[t.edge].from.d.label + " " + ED[t.edge].d.relation + " " + ED[t.edge].to.d.label, why: e.d.explanation },
        "That link is right", ["**" + e.from.d.label + " " + e.d.relation + " " + e.to.d.label + ".** " + e.d.explanation, "Look again at the others."]);
    }

    /* order: rearrange a process */
    function buildOrder(t, body) {
      var ol = el("ol", { class: "nthview-order", "aria-label": "Steps, first to last" });
      t.nodes.forEach(function (id) { ND[id].el.classList.add("nthview-now"); });
      function renumber() {
        var items = Array.prototype.slice.call(ol.children);
        items.forEach(function (li, k) {
          li.querySelector(".nthview-up").disabled = S.ts.solved || k === 0;
          li.querySelector(".nthview-down").disabled = S.ts.solved || k === items.length - 1;
          li.querySelector(".nthview-up").setAttribute("aria-label", "Move " + ND[li.getAttribute("data-id")].d.label + " up, now step " + (k + 1));
          li.querySelector(".nthview-down").setAttribute("aria-label", "Move " + ND[li.getAttribute("data-id")].d.label + " down, now step " + (k + 1));
        });
      }
      function clearOff() { Array.prototype.forEach.call(ol.children, function (li) { li.classList.remove("nthview-off"); }); }
      shuffled(t.nodes, t.id, true).forEach(function (id) {
        var n = ND[id];
        var up = el("button", { type: "button", class: "nthview-ibtn nthview-up", text: "↑" }), down = el("button", { type: "button", class: "nthview-ibtn nthview-down", text: "↓" });
        var li = el("li", { class: "nthview-oitem", "data-id": id }, [el("span", { class: "nthview-handle", "aria-hidden": "true" }), el("span", { class: "nthview-otext", text: n.d.label }), up, down]);
        up.addEventListener("click", function () { if (li.previousElementSibling) { ol.insertBefore(li, li.previousElementSibling); clearOff(); renumber(); (up.disabled ? down : up).focus(); } });
        down.addEventListener("click", function () { if (li.nextElementSibling) { ol.insertBefore(li.nextElementSibling, li); clearOff(); renumber(); (down.disabled ? up : down).focus(); } });
        li.addEventListener("pointerdown", function (ev) {
          if (ev.target.closest("button") || S.ts.solved) return;
          ev.preventDefault();
          var pid = ev.pointerId; try { li.setPointerCapture(pid); } catch (e1) { /* ignore */ }
          li.classList.add("nthview-dragging"); clearOff();
          function mv(e2) {
            if (e2.pointerId !== pid) return;
            var prev = li.previousElementSibling, next = li.nextElementSibling;
            if (prev && e2.clientY < prev.getBoundingClientRect().top + prev.offsetHeight / 2) ol.insertBefore(li, prev);
            else if (next && e2.clientY > next.getBoundingClientRect().top + next.offsetHeight / 2) ol.insertBefore(next, li);
          }
          function upx(e2) {
            if (e2.pointerId !== pid) return;
            li.classList.remove("nthview-dragging"); renumber();
            li.removeEventListener("pointermove", mv); li.removeEventListener("pointerup", upx); li.removeEventListener("pointercancel", upx);
          }
          li.addEventListener("pointermove", mv); li.addEventListener("pointerup", upx); li.addEventListener("pointercancel", upx);
        });
        ol.appendChild(li);
      });
      S.ts.renumber = renumber;
      renumber();
      var check = btn("Check the order", "nthview-primary", function () {
        var now = Array.prototype.map.call(ol.children, function (li) { return li.getAttribute("data-id"); });
        var wrong = 0;
        Array.prototype.forEach.call(ol.children, function (li, k) { var ok = now[k] === t.nodes[k]; li.classList.toggle("nthview-off", !ok); li.classList.toggle("nthview-on", ok); if (!ok) wrong++; });
        if (!wrong) { solve("ok"); renumber(); return; }
        slip({ task: t, kind: "order", chose: now.map(function (id) { return ND[id].d.label; }).join(" → "), answer: t.nodes.map(function (id) { return ND[id].d.label; }).join(" → "), why: t.why },
          wrong === 1 ? "One step is out of place" : "The highlighted steps are out of place", ["Ask of each step: what must already have happened for this one to start?"]);
      });
      body.appendChild(p("nthview-small nthview-muted", "Drag the steps, or use the arrow buttons. The first step goes on top."));
      body.appendChild(ol);
      body.appendChild(el("div", { class: "nthview-actions", style: "margin-top:.4rem" }, [check]));
    }

    /* ---------- map activation ---------- */
    function onNodeActivate(n) {
      if (S.phase === "intro") return;
      if (S.phase === "tour" || S.phase === "explore" || S.phase === "end") { openNodeDetails(n); return; }
      if (S.phase !== "rebuild" || !S.ts || S.ts.solved) return;
      var t = S.ts.task;
      if (t.type === "place") {
        if (n.loose && t.nodes.indexOf(n.id) !== -1) selectLoose(S.sel === n ? null : n);
        else if (S.sel && !n.loose) attemptPlace(S.sel, n.cluster);
        return;
      }
      if (t.type === "connect") {
        if (n.loose) return;
        if (!S.src) setSource(n);
        else if (S.src === n) clearSource();
        else tryConnect(S.src, n);
      }
    }
    function onEdgeActivate(e) {
      if (S.phase === "explore" || S.phase === "end" || S.phase === "tour") { openEdgeDetails(e); return; }
      if (S.phase === "rebuild" && S.ts && !S.ts.solved && S.ts.task.type === "spot" && S.ts.task.candidates.indexOf(e.id) !== -1 && e.lab.classList.contains("nthview-cand")) { pickSpot(e); return; }
      if (S.phase === "reflect" && !S.revealed && S.cands.indexOf(e) !== -1) togglePick(e);
    }

    /* ---------- reflection ---------- */
    function showReflect() {
      setPhase("reflect"); S.task = tasks.length; S.ts = null; S.picks = []; S.revealed = false; setStage(2);
      restoreAll(); clearMarks(); setFocus(null); redraw();
      var r = data.reflection;
      S.cands = shuffled(r.candidates || edges.map(function (e) { return e.id; }), data.title + "|reflect").map(function (id) { return ED[id]; });
      var h = heading(r.prompt || "Which three links matter most?");
      var counter = el("p", { class: "nthview-small nthview-muted", "aria-live": "polite" });
      var list = el("ul", { class: "nthview-opts" });
      S.pickBtns = {};
      S.cands.forEach(function (e) {
        var b = el("button", { type: "button", class: "nthview-opt", "aria-pressed": "false" }, [el("span", { class: "nthview-key", "aria-hidden": "true", text: "+" }), el("span", { text: e.from.d.label + " — " + e.d.relation + " → " + e.to.d.label })]);
        b.addEventListener("click", function () { togglePick(e); });
        S.pickBtns[e.id] = b;
        list.appendChild(el("li", {}, [b]));
        e.lab.classList.add("nthview-cand"); e.lab.setAttribute("tabindex", "0"); e.lab.setAttribute("aria-pressed", "false");
        e.lab.setAttribute("aria-label", "Pick link: " + e.from.d.label + " " + e.d.relation + " " + e.to.d.label);
      });
      var compare = btn("Compare with the key links", "nthview-primary", revealKeys);
      S.compareBtn = compare; S.counter = counter;
      updatePicks();
      var acts = el("div", { class: "nthview-actions" }, [compare, btn("Skip, show me", "nthview-ghost", revealKeys)]);
      S.reflectActs = acts;
      setGuide([eyebrow("Reflect"), h, p("", (r.prompt ? "" : "If you could keep only three links from this map, which would they be? ") + "There is no wrong pick: afterwards you will see which three the map was built around, and why. Pick from the list or tap the labels on the map."), counter, list, acts], h);
      fitAll(900);
    }
    function togglePick(e) {
      if (S.revealed) return;
      var i = S.picks.indexOf(e);
      if (i !== -1) S.picks.splice(i, 1);
      else { if (S.picks.length >= 3) { announce("You have picked three. Unpick one first."); return; } S.picks.push(e); }
      updatePicks();
    }
    function updatePicks() {
      S.cands.forEach(function (e) {
        var on = S.picks.indexOf(e) !== -1;
        S.pickBtns[e.id].setAttribute("aria-pressed", String(on));
        S.pickBtns[e.id].querySelector(".nthview-key").textContent = on ? String(S.picks.indexOf(e) + 1) : "+";
        S.pickBtns[e.id].classList.toggle("nthview-yes", on);
        e.lab.classList.toggle("nthview-picked", on); e.lab.setAttribute("aria-pressed", String(on));
        e.g.classList.toggle("nthview-picked", on);
      });
      S.counter.textContent = S.picks.length + " of 3 picked";
      S.compareBtn.disabled = S.picks.length !== 3;
    }
    function revealKeys() {
      S.revealed = true;
      var r = data.reflection, keyIds = r.keyEdges.map(function (k) { return k.edge; });
      clearMarks();
      var ns = {}, es = {};
      r.keyEdges.forEach(function (k) { var e = ED[k.edge]; es[e.id] = true; ns[e.from.id] = ns[e.to.id] = true; });
      S.picks.forEach(function (e) { es[e.id] = true; ns[e.from.id] = ns[e.to.id] = true; e.g.classList.add("nthview-picked"); e.lab.classList.add("nthview-picked"); });
      setFocus(ns, es);
      keyIds.forEach(function (id) { ED[id].g.classList.add("nthview-key"); ED[id].lab.classList.add("nthview-key"); });
      var cards = el("div", { class: "nthview-cards" });
      r.keyEdges.forEach(function (k, i) {
        var e = ED[k.edge], c = el("div", { class: "nthview-card" });
        var eb = el("p", { class: "nthview-eyebrow", text: "Key link " + (i + 1) + " " });
        if (S.picks.indexOf(e) !== -1) eb.appendChild(el("span", { class: "nthview-tag", text: "You picked this too" }));
        c.appendChild(eb);
        c.appendChild(el("div", { class: "nthview-sentence" }, [term(e.from), el("span", { class: "nthview-rel", text: e.d.relation }), el("span", { text: "→", "aria-hidden": "true" }), term(e.to)]));
        c.appendChild(p("", k.why));
        cards.appendChild(c);
      });
      var others = S.picks.filter(function (e) { return keyIds.indexOf(e.id) === -1; });
      var h = heading("The three links the map is built around");
      var kids = [eyebrow("Reflect"), h, cards];
      if (others.length) kids.push(p("nthview-small nthview-muted", "Your other pick" + (others.length > 1 ? "s" : "") + " (" + others.map(function (e) { return e.from.d.label + " " + e.d.relation + " " + e.to.d.label; }).join("; ") + ") " + (others.length > 1 ? "matter" : "matters") + " too. Compare: would the rest of the map still make sense without " + (others.length > 1 ? "them" : "it") + "? Without a key link, it would not."));
      if (r.closing) kids.push(p("", r.closing));
      kids.push(el("div", { class: "nthview-actions" }, [btn("See your review", "nthview-primary", showEnd)]));
      setGuide(kids, h);
      fitBox(boxFor(Object.keys(ns).map(function (id) { return ND[id]; })), 1.1, 900);
      announce("Key links revealed.");
    }

    /* ---------- end screen ---------- */
    function showEnd() {
      setPhase("end"); setStage(3);
      restoreAll(); clearMarks(); setFocus(null); syncCollapse(); redraw();
      data.reflection.keyEdges.forEach(function (k) { ED[k.edge].g.classList.add("nthview-key"); ED[k.edge].lab.classList.add("nthview-key"); });
      if (!reduceMotion) { container.classList.add("nthview-celebrate"); setTimeout(function () { container.classList.remove("nthview-celebrate"); }, 3200); }
      var sm = data.summary || {};
      var h = heading(sm.heading || "The map, rebuilt");
      var kids = [eyebrow("Review"), h];
      (sm.paragraphs || []).forEach(function (t) { kids.push(p("", t)); });
      var solved = tasks.length - S.skipped.length;
      kids.push(el("div", { class: "nthview-tiles" }, [[nodes.length, "concepts"], [edges.length, "links"], [solved, "rebuilt"], [S.slips.length, "slips"]].map(function (x) { return el("div", { class: "nthview-tile" }, [el("b", { text: String(x[0]) }), el("span", { text: x[1] })]); })));
      kids.push(el("h3", { text: "Your slips, explained" }));
      if (!S.slips.length) kids.push(p("nthview-muted", !solved ? "You skipped every task, so there are no slips; each answer and its explanation is below." : S.skipped.length ? "No slips on the tasks you tried." : "No slips at all. The structure is yours."));
      else {
        var cards = el("div", { class: "nthview-cards" });
        S.slips.forEach(function (s) {
          var c = el("div", { class: "nthview-card" }, [el("p", { class: "nthview-eyebrow", text: KIND[s.kind] })]);
          c.appendChild(p("", "**You tried:** " + s.chose));
          c.appendChild(p("", "**The map says:** " + s.answer));
          c.appendChild(p("nthview-muted", s.why));
          cards.appendChild(c);
        });
        kids.push(cards);
      }
      if (S.skipped.length) {
        kids.push(el("h3", { text: "Skipped, with the answers" }));
        var sc = el("div", { class: "nthview-cards" });
        S.skipped.forEach(function (s) {
          var c = el("div", { class: "nthview-card" }, [el("p", { class: "nthview-eyebrow", text: KIND[s.task.type] })]);
          c.appendChild(p("", "**" + stripMarks(promptFor(s.task)) + "** " + answerText(s.task)));
          c.appendChild(p("nthview-muted", s.task.why));
          sc.appendChild(c);
        });
        kids.push(sc);
      }
      kids.push(el("h3", { text: "The key links" }));
      kids.push(el("ul", { class: "nthview-small", style: "padding-left:1.1rem;margin:.3rem 0" }, data.reflection.keyEdges.map(function (k) { var e = ED[k.edge]; return el("li", { text: e.from.d.label + " " + e.d.relation + " " + e.to.d.label }); })));
      if (data.glossary && data.glossary.length) {
        kids.push(el("h3", { text: "Glossary" }));
        var dl = el("dl", { class: "nthview-gloss" });
        data.glossary.forEach(function (g) { dl.appendChild(el("dt", { text: g.term })); var dd = el("dd"); dd.appendChild(rich(g.meaning)); dl.appendChild(dd); });
        kids.push(dl);
      }
      kids.push(el("div", { class: "nthview-actions" }, [btn("Explore the finished map", "nthview-primary", function () { guide.classList.add("nthview-min"); if (isWide()) { setGuide([eyebrow("Review"), heading("The finished map"), p("", "Tap any concept or link to revisit it."), el("div", { class: "nthview-actions" }, [btn("Back to the review", "", showEnd), btn("Start again", "nthview-ghost", function () { showIntro(); })])]); } syncSheet(); fitAll(700); }), btn("Start again", "", function () { showIntro(); })]));
      setGuide(kids, h);
      fitAll(1000);
      announce("Review. " + S.slips.length + " slips explained.");
    }
    function stripMarks(s) { return String(s).replace(/\*\*/g, ""); }
    function answerText(t) {
      if (t.type === "place") return t.nodes.map(function (id) { return ND[id].d.label + " belongs in " + ND[id].cluster.name; }).join("; ") + ".";
      if (t.type === "relation" || t.type === "connect" || t.type === "spot") { var e = ED[t.edge]; return e.from.d.label + " " + e.d.relation + " " + e.to.d.label + "."; }
      if (t.type === "order") return t.nodes.map(function (id) { return ND[id].d.label; }).join(" → ") + ".";
      return "It is " + ND[t.node].d.label + ".";
    }

    /* ---------- resize ---------- */
    var resizeTimer = null, lastWide = isWide();
    function onResize() {
      if (!alive()) { root.removeEventListener("resize", onResize); return; }
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!alive()) return;
        syncSheet();
        var w = isWide();
        if (w !== lastWide) { lastWide = w; refit(0); } else refit(300);
      }, 120);
    }
    root.addEventListener("resize", onResize);
    if (typeof root.ResizeObserver === "function") {
      var ro = new root.ResizeObserver(function () { if (!alive()) { ro.disconnect(); return; } syncSheet(); });
      ro.observe(guide); ro.observe(details);
    }

    showIntro();
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-concept-map");
    injectStyles();

    if (typeof NthView.validate !== "function") {
      renderErrorPanel(container, { errors: [{ path: "$", message: "validate.js must be inlined before view.js" }] });
      return { valid: false, errors: [], warnings: [] };
    }
    var result = NthView.validate(data);
    if (!result.valid) {
      renderErrorPanel(container, result);
      return result;
    }
    var missing = (NthView.libs || []).filter(function (l) { return l.kind === "script" && !root[l.global]; });
    if (missing.length) {
      var errs = missing.map(function (l) { return { path: "$", message: l.name + " did not load from " + l.src + ". This file needs internet access the first time it opens." }; });
      renderErrorPanel(container, { errors: errs });
      return { valid: false, errors: errs, warnings: result.warnings };
    }
    render(container, data);
    return result;
  };

  NthView.libs = [
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;600;700;800&family=Outfit:wght@500;700;800&family=Space+Grotesk:wght@500;700&display=swap", name: "Google Fonts (Fraunces, Inter, Outfit, Space Grotesk)" }
  ];
})(typeof globalThis !== "undefined" ? globalThis : window);
