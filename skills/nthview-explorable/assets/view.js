/* NthView — explorable renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first. Fonts come from Google Fonts (see NthView.libs).
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";

  var THEMES = ["lab", "chalk", "nebula", "paper", "sunlit", "mint"];

  /* Hue tokens a data file may name. One set per brightness so every hue reads on that side. */
  var HUES_ON_LIGHT = "--h-blue:#2563eb;--h-teal:#0f8b80;--h-green:#15803d;--h-lime:#4d7c0f;--h-amber:#b45309;--h-orange:#c2410c;--h-red:#dc2626;--h-pink:#db2777;--h-violet:#7c3aed;--h-grey:#6b7280;--ok:#15803d;--no:#c81e1e;--warn:#a15c07;--field:rgba(255,255,255,.55);--dot:rgba(20,30,60,.10)";
  var HUES_ON_DARK = "--h-blue:#60a5fa;--h-teal:#2dd4bf;--h-green:#4ade80;--h-lime:#a3e635;--h-amber:#fbbf24;--h-orange:#fb923c;--h-red:#f87171;--h-pink:#f472b6;--h-violet:#a78bfa;--h-grey:#9ca3af;--ok:#4ade80;--no:#fb7185;--warn:#fbbf24;--field:rgba(0,0,0,.28);--dot:rgba(255,255,255,.07)";

  /* Each theme: native palette, then the variant for the other colour scheme.
     A variant stays on one side of brightness: ink is near-black on light, near-white on dark. */
  var PALETTES = {
    lab: { dark: true,
      base: "--bg1:#060c18;--bg2:#0c1a32;--blob1:#0e7490;--blob2:#1d4ed8;--blob3:#0f766e;--surface:rgba(12,22,42,.66);--surface-2:rgba(18,32,60,.92);--line:rgba(150,200,255,.17);--ink:#f4f8ff;--muted:#b4c3dc;--accent:#38d9ff;--accent-2:#5eead4;--on-accent:#04111f;--display:'Space Grotesk',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1.1rem",
      alt: "--bg1:#eef6fb;--bg2:#d9e9f5;--blob1:#bae6fd;--blob2:#c7d2fe;--blob3:#99f6e4;--surface:rgba(255,255,255,.86);--surface-2:rgba(255,255,255,.98);--line:rgba(10,40,80,.15);--ink:#0b1220;--muted:#3b4b63;--accent:#0369a1;--accent-2:#0f766e;--on-accent:#fff" },
    chalk: { dark: true,
      base: "--bg1:#121d17;--bg2:#1c2c23;--blob1:#166534;--blob2:#365314;--blob3:#713f12;--surface:rgba(20,34,27,.72);--surface-2:rgba(28,46,37,.94);--line:rgba(255,255,235,.17);--ink:#f7f5e8;--muted:#c8ccb6;--accent:#fde047;--accent-2:#fb8a6e;--on-accent:#142019;--display:'Kalam','Comic Sans MS',cursive;--body:'Atkinson Hyperlegible',system-ui,sans-serif;--radius:.8rem",
      alt: "--bg1:#f5f2e4;--bg2:#e7e1c8;--blob1:#d9f99d;--blob2:#fef08a;--blob3:#fed7aa;--surface:rgba(255,253,244,.9);--surface-2:rgba(255,255,250,.98);--line:rgba(40,40,10,.17);--ink:#17140a;--muted:#4c4934;--accent:#8a5a00;--accent-2:#b93c16;--on-accent:#fff" },
    nebula: { dark: true,
      base: "--bg1:#0c0517;--bg2:#1d0a33;--blob1:#6d28d9;--blob2:#be185d;--blob3:#1e40af;--surface:rgba(26,12,46,.66);--surface-2:rgba(36,18,62,.92);--line:rgba(255,255,255,.16);--ink:#fbf7ff;--muted:#cdbde6;--accent:#c79bff;--accent-2:#f472b6;--on-accent:#12061f;--display:'Sora',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1.4rem",
      alt: "--bg1:#f7f2ff;--bg2:#fbe6f3;--blob1:#ddd6fe;--blob2:#fbcfe8;--blob3:#c7d2fe;--surface:rgba(255,255,255,.88);--surface-2:rgba(255,255,255,.98);--line:rgba(60,20,110,.15);--ink:#140a22;--muted:#56476e;--accent:#7e22ce;--accent-2:#be185d;--on-accent:#fff" },
    paper: { dark: false,
      base: "--bg1:#f8f4ea;--bg2:#eee6d3;--blob1:#e7dfca;--blob2:#f3d5c8;--blob3:#d5e0ea;--surface:rgba(255,253,247,.93);--surface-2:#fffdf8;--line:rgba(50,40,20,.17);--ink:#15130e;--muted:#574f3e;--accent:#1d4ed8;--accent-2:#b91c1c;--on-accent:#fff;--display:'Fraunces',Georgia,serif;--body:'Source Serif 4',Georgia,serif;--radius:.55rem",
      alt: "--bg1:#17150f;--bg2:#25211a;--blob1:#3f3a2e;--blob2:#4a2a1f;--blob3:#22324a;--surface:rgba(32,28,21,.74);--surface-2:rgba(42,37,28,.94);--line:rgba(255,255,255,.15);--ink:#f6f2e8;--muted:#cfc6b2;--accent:#93b4ff;--accent-2:#f38b82;--on-accent:#17150f" },
    sunlit: { dark: false,
      base: "--bg1:#fff6ec;--bg2:#ffe1cc;--blob1:#ffd2a8;--blob2:#ffe89c;--blob3:#ffc6d4;--surface:rgba(255,252,248,.9);--surface-2:rgba(255,255,255,.98);--line:rgba(120,60,20,.15);--ink:#17110c;--muted:#5f4332;--accent:#c2410c;--accent-2:#b26a00;--on-accent:#fff;--display:'Bricolage Grotesque',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1.3rem",
      alt: "--bg1:#1d110a;--bg2:#36190e;--blob1:#9a3412;--blob2:#a16207;--blob3:#9f1239;--surface:rgba(42,22,14,.68);--surface-2:rgba(54,29,18,.92);--line:rgba(255,255,255,.16);--ink:#fff7f0;--muted:#e5c8b4;--accent:#ff8a5c;--accent-2:#ffc15e;--on-accent:#1f120b" },
    mint: { dark: false,
      base: "--bg1:#effbf6;--bg2:#d9f2ea;--blob1:#b4efd5;--blob2:#bfe4ff;--blob3:#dff6bf;--surface:rgba(255,255,255,.88);--surface-2:rgba(255,255,255,.98);--line:rgba(10,70,60,.15);--ink:#0a1a16;--muted:#34584e;--accent:#0f766e;--accent-2:#2563eb;--on-accent:#fff;--display:'Nunito',system-ui,sans-serif;--body:'Nunito',system-ui,sans-serif;--radius:1.6rem",
      alt: "--bg1:#06201b;--bg2:#0b2e29;--blob1:#0f766e;--blob2:#1e40af;--blob3:#3f6212;--surface:rgba(8,36,31,.68);--surface-2:rgba(12,48,42,.92);--line:rgba(255,255,255,.16);--ink:#f0fffa;--muted:#b3d7cc;--accent:#4fd1b5;--accent-2:#86b6ff;--on-accent:#06201b" }
  };

  function themeCss() {
    var out = [], S = ".nthview-explorable";
    THEMES.forEach(function (t) {
      var p = PALETTES[t], nativeHues = p.dark ? HUES_ON_DARK : HUES_ON_LIGHT, altHues = p.dark ? HUES_ON_LIGHT : HUES_ON_DARK;
      var other = p.dark ? "light" : "dark", self = p.dark ? "dark" : "light";
      out.push(S + "[data-theme=" + t + "]{" + p.base + ";" + nativeHues + "}");
      out.push("@media (prefers-color-scheme:" + other + "){" + S + "[data-theme=" + t + "]:not([data-scheme=" + self + "]){" + p.alt + ";" + altHues + "}}");
      out.push(S + "[data-theme=" + t + "][data-scheme=" + other + "]{" + p.alt + ";" + altHues + "}");
    });
    return out.join("\n");
  }

  var GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";
  var X = ".nthview-explorable ";

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
    ".nthview.nthview-explorable{--mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;max-width:none;margin:0;padding:0;min-height:100vh;position:relative;isolation:isolate;background:var(--bg1,var(--nv-bg));color:var(--ink,var(--nv-fg));font-family:var(--body,system-ui,sans-serif);line-height:1.6;--nv-accent:var(--accent);-webkit-font-smoothing:antialiased;overflow-x:clip}",
    ".nthview-explorable[data-scheme=light]{color-scheme:light}.nthview-explorable[data-scheme=dark]{color-scheme:dark}",
    "body:has(> .nthview-explorable){margin:0}",
    X + ".nthview-shell{position:relative}",
    ".nthview-explorable > .nthview-error-panel{margin:1rem;max-width:60rem}",
    ".nthview-explorable .nthview-error-panel code{overflow-wrap:anywhere}",
    X + ".nthview-backdrop{position:fixed;inset:0;z-index:-1;overflow:hidden;background:linear-gradient(160deg,var(--bg1),var(--bg2));pointer-events:none}",
    X + ".nthview-blob{position:absolute;width:56vmax;height:56vmax;border-radius:50%;filter:blur(80px);opacity:.48;animation:nthview-drift 32s ease-in-out infinite alternate;will-change:transform}",
    X + ".nthview-blob:nth-child(1){background:var(--blob1);top:-22vmax;left:-16vmax}",
    X + ".nthview-blob:nth-child(2){background:var(--blob2);top:18vmax;right:-18vmax;animation-duration:38s;animation-delay:-9s}",
    X + ".nthview-blob:nth-child(3){background:var(--blob3);bottom:-26vmax;left:22%;width:44vmax;height:44vmax;animation-duration:46s;animation-delay:-18s}",
    X + ".nthview-dots{position:absolute;inset:0;background-image:radial-gradient(var(--dot) 1.2px,transparent 1.3px);background-size:26px 26px;-webkit-mask-image:radial-gradient(ellipse at 50% 30%,#000 30%,transparent 80%);mask-image:radial-gradient(ellipse at 50% 30%,#000 30%,transparent 80%)}",
    X + ".nthview-grain{position:absolute;inset:0;opacity:.08;background-image:" + GRAIN + ";mix-blend-mode:overlay}",
    "@keyframes nthview-drift{from{transform:translate(0,0) scale(1)}to{transform:translate(8vmax,6vmax) scale(1.16)}}",
    X + "button{font:inherit;color:inherit;cursor:pointer}",
    X + "button:disabled{cursor:not-allowed}",
    X + "p{margin:.45rem 0 .9rem}",
    X + "h1,.nthview-explorable h2,.nthview-explorable h3{font-family:var(--display);letter-spacing:-.015em}",
    X + "h1{font-weight:800;font-size:clamp(2.2rem,6.4vw,4rem);line-height:1.02;margin:.3rem 0 .7rem;background:linear-gradient(135deg,var(--ink) 0%,var(--ink) 50%,var(--accent) 100%);-webkit-background-clip:text;background-clip:text;color:transparent;overflow-wrap:break-word}",
    X + "h2{font-weight:800;font-size:clamp(1.55rem,3.6vw,2.2rem);line-height:1.12;margin:.2rem 0 .9rem}",
    X + "h3{font-size:1.08rem;margin:0 0 .4rem;font-weight:700}",
    X + ".nthview-muted{color:var(--muted)}",
    X + ".nthview-small{font-size:.88rem}",
    X + ".nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    X + ".nthview-eyebrow{font-size:.74rem;text-transform:uppercase;letter-spacing:.15em;color:var(--accent);font-weight:800;margin:0 0 .45rem;font-family:var(--body)}",
    X + "b{font-weight:700}",
    /* top bar */
    X + ".nthview-top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:.7rem 1rem;flex-wrap:wrap;padding:.6rem clamp(.8rem,3vw,1.6rem);background:color-mix(in srgb,var(--bg1) 72%,transparent);backdrop-filter:blur(16px) saturate(1.3);-webkit-backdrop-filter:blur(16px) saturate(1.3);border-bottom:1px solid var(--line)}",
    X + ".nthview-brand{display:flex;align-items:center;gap:.55rem;min-width:0;flex:1 1 12rem}",
    X + ".nthview-logo{flex:none;width:2rem;height:2rem;border-radius:.65rem;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);box-shadow:0 8px 22px -10px var(--accent)}",
    X + ".nthview-logo svg{width:1.2rem;height:1.2rem}",
    X + ".nthview-brand span{display:block;font-size:.68rem;text-transform:uppercase;letter-spacing:.14em;color:var(--muted);font-weight:700;line-height:1.2}",
    X + ".nthview-brand strong{display:block;font-family:var(--display);font-size:.98rem;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    X + ".nthview-brand > div{min-width:0}",
    X + ".nthview-rail{display:flex;align-items:center;gap:.3rem;flex:2 1 14rem;min-width:0;order:3;width:100%}",
    "@media (min-width:860px){" + X + ".nthview-rail{order:0;width:auto}}",
    X + ".nthview-seg{flex:1 1 0;min-width:.9rem;max-width:3.4rem;height:1.6rem;border:0;background:none;padding:0;display:grid;align-items:center;position:relative}",
    X + ".nthview-seg::before{content:'';display:block;height:6px;border-radius:3px;background:var(--line);transition:background .3s,height .3s}",
    X + ".nthview-seg.nthview-done::before{background:color-mix(in srgb,var(--accent) 55%,var(--line))}",
    X + ".nthview-seg.nthview-now::before{background:linear-gradient(90deg,var(--accent),var(--accent-2));height:8px;box-shadow:0 0 14px -2px var(--accent)}",
    X + ".nthview-seg.nthview-hit::after{content:'';position:absolute;right:-1px;top:2px;width:.42rem;height:.42rem;border-radius:50%;background:var(--ok)}",
    X + ".nthview-seg:hover::before{background:var(--accent)}",
    X + ".nthview-railtext{font-size:.78rem;color:var(--muted);font-weight:700;white-space:nowrap;font-family:var(--mono)}",
    X + ".nthview-tools{display:flex;gap:.4rem;align-items:center}",
    X + ".nthview-tool{display:inline-flex;align-items:center;gap:.35rem;border:1px solid var(--line);background:var(--surface);border-radius:999px;padding:.38rem .75rem;font-size:.82rem;font-weight:700;transition:border-color .2s,transform .2s}",
    X + ".nthview-tool:hover{border-color:var(--accent);transform:translateY(-1px)}",
    X + ".nthview-tool svg{width:1rem;height:1rem}",
    "@media (max-width:520px){" + X + ".nthview-tool .nthview-tlabel{display:none}" + X + ".nthview-tool{padding:.42rem}}",
    /* stage + transitions */
    X + ".nthview-frame{max-width:76rem;margin:0 auto;padding:clamp(1rem,3vw,2.2rem) clamp(1rem,3vw,1.6rem) 5rem}",
    X + ".nthview-stage{position:relative}",
    X + ".nthview-screen{transition:opacity .4s ease,transform .5s cubic-bezier(.2,.8,.2,1),filter .4s ease}",
    X + ".nthview-enter{opacity:0;transform:translateY(24px) scale(.985);filter:blur(6px)}",
    X + ".nthview-enter.nthview-fromleft{transform:translateX(-28px) scale(.985)}",
    X + ".nthview-enter.nthview-fromright{transform:translateX(28px) scale(.985)}",
    X + ".nthview-leave{position:absolute;inset:0 0 auto 0;opacity:0;transform:translateY(-14px) scale(.99);filter:blur(4px);pointer-events:none}",
    X + ".nthview-rise{animation:nthview-rise .6s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*70ms)}",
    "@keyframes nthview-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}",
    "@keyframes nthview-pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}",
    "@keyframes nthview-spin{to{transform:rotate(360deg)}}",
    "@keyframes nthview-sheen{from{background-position:-200% 0}to{background-position:200% 0}}",
    "@keyframes nthview-glow{0%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 50%,transparent),0 24px 60px -34px rgba(0,0,0,.5)}100%{box-shadow:0 0 0 14px transparent,0 24px 60px -34px rgba(0,0,0,.5)}}",
    "@keyframes nthview-burst{to{transform:translate(var(--dx),var(--dy)) scale(.3);opacity:0}}",
    /* cards */
    X + ".nthview-card{position:relative;background:var(--surface);backdrop-filter:blur(18px) saturate(1.25);-webkit-backdrop-filter:blur(18px) saturate(1.25);border:1px solid var(--line);border-radius:var(--radius);padding:1.1rem 1.2rem;margin:0 0 1rem;box-shadow:0 24px 60px -34px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.07)}",
    X + ".nthview-card.nthview-glowing{animation:nthview-glow 1s ease-out 2}",
    X + ".nthview-label{font-size:.72rem;text-transform:uppercase;letter-spacing:.13em;color:var(--muted);margin:0 0 .5rem;font-weight:800}",
    X + ".nthview-vhead{display:flex;align-items:flex-start;justify-content:space-between;gap:.6rem;margin-bottom:.55rem}",
    X + ".nthview-vhead h3{margin:0;font-size:1rem}",
    X + ".nthview-vkind{font-size:.66rem;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);font-family:var(--mono)}",
    X + ".nthview-caption{font-size:.86rem;color:var(--muted);margin:.6rem 0 0}",
    X + ".nthview-fig{position:relative;width:100%}",
    X + ".nthview-fig svg{display:block;width:100%;height:auto;overflow:visible}",
    X + ".nthview-fig canvas{display:block;width:100%;border-radius:calc(var(--radius) * .6);background:var(--field);border:1px solid var(--line)}",
    X + ".nthview-legend{display:flex;flex-wrap:wrap;gap:.35rem .9rem;margin:.6rem 0 0;padding:0;list-style:none;font-size:.82rem}",
    X + ".nthview-legend li{display:inline-flex;align-items:center;gap:.4rem}",
    X + ".nthview-legend i{width:.7rem;height:.7rem;border-radius:50%;flex:none}",
    X + ".nthview-legend i.nthview-dash{border-radius:2px;height:3px;width:1rem}",
    X + ".nthview-legend b{font-family:var(--mono);font-weight:700;font-variant-numeric:tabular-nums}",
    X + ".nthview-mini{display:flex;gap:.3rem;flex:none}",
    X + ".nthview-icon-btn{width:2rem;height:2rem;border-radius:.6rem;display:grid;place-items:center;border:1px solid var(--line);background:var(--surface-2);transition:border-color .2s,background .2s}",
    X + ".nthview-icon-btn:hover:not(:disabled){border-color:var(--accent)}",
    X + ".nthview-icon-btn svg{width:.95rem;height:.95rem}",
    X + ".nthview-status-line{font-size:.8rem;color:var(--muted);font-family:var(--mono);margin:.45rem 0 0;min-height:1.2em}",
    /* SVG chart parts */
    X + ".nthview-axis{stroke:var(--line);stroke-width:1}",
    X + ".nthview-gridline{stroke:var(--line);stroke-width:1;stroke-dasharray:2 4}",
    X + ".nthview-tick{fill:var(--muted);font-size:10px;font-family:var(--mono)}",
    X + ".nthview-axislabel{fill:var(--muted);font-size:10.5px;font-weight:700;font-family:var(--body)}",
    X + ".nthview-marker{stroke:var(--ink);stroke-width:1.2;stroke-dasharray:3 3;opacity:.7}",
    X + ".nthview-badge-bg{fill:var(--surface-2);stroke:var(--line)}",
    X + ".nthview-badge-text{fill:var(--ink);font-size:10.5px;font-weight:700;font-family:var(--mono)}",
    /* bars */
    X + ".nthview-bars{display:flex;align-items:stretch;gap:.5rem;height:13rem;padding-top:1.3rem}",
    X + ".nthview-barcol{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;gap:.35rem}",
    X + ".nthview-bartrack{flex:1;width:100%;max-width:4.2rem;position:relative;border-radius:.55rem .55rem .25rem .25rem;background:color-mix(in srgb,var(--line) 45%,transparent)}",
    X + ".nthview-barfill{position:absolute;left:0;right:0;bottom:0;border-radius:.55rem .55rem .25rem .25rem;transition:height .45s cubic-bezier(.2,.8,.2,1),background .3s;box-shadow:0 10px 26px -14px currentColor}",
    X + ".nthview-barval{position:absolute;left:50%;transform:translateX(-50%);margin-bottom:.2rem;font-family:var(--mono);font-size:.78rem;font-weight:700;white-space:nowrap;transition:bottom .45s cubic-bezier(.2,.8,.2,1)}",
    X + ".nthview-barlabel{font-size:.78rem;text-align:center;line-height:1.2;color:var(--muted);font-weight:600;overflow-wrap:anywhere}",
    X + ".nthview-hbars{display:grid;gap:.55rem}",
    X + ".nthview-hbar{display:grid;grid-template-columns:minmax(4.5rem,8rem) 1fr auto;gap:.6rem;align-items:center;font-size:.85rem}",
    X + ".nthview-hbar .nthview-bartrack{height:.95rem;max-width:none;border-radius:.5rem}",
    X + ".nthview-hbar .nthview-barfill{top:0;bottom:0;right:auto;border-radius:.5rem;transition:width .45s cubic-bezier(.2,.8,.2,1),background .3s}",
    X + ".nthview-hbar b{font-family:var(--mono);font-size:.8rem}",
    X + ".nthview-alert{color:var(--no);font-weight:800}",
    /* gauge + numbers */
    X + ".nthview-needle{transition:transform .5s cubic-bezier(.3,1.4,.5,1);transform-box:view-box;transform-origin:100px 100px}",
    X + ".nthview-gauge-value{fill:var(--ink);font-family:var(--mono);font-weight:700;font-size:22px}",
    X + ".nthview-gauge-zone{font-family:var(--body);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}",
    X + ".nthview-numbers{display:grid;grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));gap:.7rem}",
    X + ".nthview-num{background:var(--surface-2);border:1px solid var(--line);border-radius:calc(var(--radius) * .7);padding:.75rem .85rem}",
    X + ".nthview-num b{display:block;font-family:var(--mono);font-size:clamp(1.35rem,3.6vw,1.9rem);line-height:1.1;letter-spacing:-.02em;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}",
    X + ".nthview-num b.nthview-long{font-size:clamp(1.05rem,2.6vw,1.35rem)}",
    X + "[tabindex='-1']:focus{outline:none}",
    X + ".nthview-num span{display:block;font-size:.8rem;color:var(--muted);margin-top:.25rem;font-weight:600}",
    /* stack */
    X + ".nthview-stackbar{display:flex;height:2.6rem;border-radius:.7rem;overflow:hidden;border:1px solid var(--line);background:var(--field)}",
    X + ".nthview-stackseg{height:100%;transition:width .45s cubic-bezier(.2,.8,.2,1);position:relative;display:grid;place-items:center;font-family:var(--mono);font-size:.78rem;font-weight:700;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.45);overflow:hidden;white-space:nowrap}",
    X + ".nthview-stackseg + .nthview-stackseg{box-shadow:inset 2px 0 0 var(--surface)}",
    X + ".nthview-donut-arc{transition:stroke-dasharray .45s ease,stroke-dashoffset .45s ease}",
    /* flow */
    X + ".nthview-flow{display:flex;align-items:stretch;gap:0}",
    X + ".nthview-flow.nthview-col{flex-direction:column}",
    X + ".nthview-stagebox{flex:1 1 0;min-width:0;background:var(--surface-2);border:1px solid var(--line);border-top:3px solid currentColor;border-radius:calc(var(--radius) * .6);padding:.6rem .55rem;text-align:center;display:flex;flex-direction:column;justify-content:center}",
    X + ".nthview-col .nthview-stagebox{border-top-width:1px;border-left:4px solid currentColor;flex-direction:row;justify-content:space-between;align-items:center;text-align:left;gap:.6rem}",
    X + ".nthview-stagebox b{display:block;font-family:var(--mono);font-size:1.15rem;color:var(--ink);line-height:1.15;font-variant-numeric:tabular-nums}",
    X + ".nthview-stagebox span{display:block;font-size:.76rem;color:var(--muted);font-weight:700;line-height:1.25}",
    X + ".nthview-pipe{flex:0 0 3rem;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem}",
    X + ".nthview-col .nthview-pipe{flex:0 0 2.6rem;flex-direction:row;gap:.6rem}",
    X + ".nthview-pipe i{display:block;width:100%;height:10px;background-repeat:repeat-x;border-radius:5px}",
    X + ".nthview-col .nthview-pipe i{width:10px;height:100%;background-repeat:repeat-y;flex:none}",
    X + ".nthview-pipe em{font-style:normal;font-size:.68rem;font-weight:800;color:var(--muted);font-family:var(--mono);white-space:nowrap;text-align:center}",
    /* timeline */
    X + ".nthview-strip{display:flex;gap:.3rem;overflow-x:auto;padding:.2rem 0 .5rem;scrollbar-width:thin}",
    X + ".nthview-frame-cell{flex:1 0 2.4rem;min-width:2.4rem;border:1px solid var(--line);background:var(--surface-2);border-radius:.6rem;padding:.3rem .2rem;text-align:center;font-family:var(--mono);font-size:.7rem;line-height:1.2;position:relative;overflow:hidden;transition:border-color .2s,opacity .3s}",
    X + ".nthview-frame-cell.nthview-future{opacity:.45}",
    X + ".nthview-frame-cell.nthview-current{border-color:var(--accent);box-shadow:0 0 0 2px color-mix(in srgb,var(--accent) 40%,transparent)}",
    X + ".nthview-frame-cell i{position:absolute;left:0;right:0;bottom:0;opacity:.25;transition:height .4s ease}",
    X + ".nthview-frame-cell span{position:relative;display:block;color:var(--muted)}",
    X + ".nthview-frame-cell b{position:relative;display:block;font-size:.78rem;overflow:hidden;text-overflow:ellipsis}",
    X + ".nthview-tl-stage{min-height:7.5rem;border-radius:calc(var(--radius) * .6);background:var(--field);border:1px solid var(--line);padding:.6rem;display:flex;flex-wrap:wrap;align-content:flex-start;gap:3px}",
    X + ".nthview-tl-dot{width:var(--s,10px);height:var(--s,10px);border-radius:50%;animation:nthview-pop .35s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--d,0) * 4ms)}",
    X + ".nthview-tl-more{font-family:var(--mono);font-size:.78rem;color:var(--muted);align-self:center;margin-left:.3rem}",
    X + ".nthview-tl-narr{font-weight:600;margin:.55rem 0 .3rem;min-height:1.6em}",
    X + ".nthview-tl-ctrl{display:flex;gap:.4rem;align-items:center}",
    X + ".nthview-tl-ctrl input{flex:1;min-width:0}",
    /* compare */
    X + ".nthview-cmp{display:grid;grid-template-columns:1fr 1fr;gap:.6rem}",
    X + ".nthview-cmp-head{display:flex;align-items:center;gap:.45rem;font-weight:800;font-size:.9rem;padding:.45rem .6rem;border-radius:.7rem;background:var(--surface-2);border:1px solid var(--line);border-top:3px solid currentColor;min-width:0}",
    X + ".nthview-cmp-head span{color:var(--ink);overflow-wrap:anywhere}",
    X + ".nthview-metric{grid-column:1 / -1;display:grid;grid-template-columns:1fr 1fr;gap:.6rem;border-top:1px dashed var(--line);padding-top:.55rem}",
    X + ".nthview-metric > p{grid-column:1 / -1;margin:0;font-size:.8rem;font-weight:800;color:var(--muted);text-transform:uppercase;letter-spacing:.08em;display:flex;justify-content:space-between;gap:.5rem;flex-wrap:wrap}",
    X + ".nthview-metric > p em{font-style:normal;color:var(--accent);text-transform:none;letter-spacing:0;font-family:var(--mono)}",
    X + ".nthview-mcell b{display:block;font-family:var(--mono);font-size:clamp(1.05rem,3vw,1.4rem);font-variant-numeric:tabular-nums;overflow-wrap:anywhere}",
    X + ".nthview-mcell i{display:block;height:.45rem;border-radius:.3rem;margin-top:.3rem;transition:width .45s cubic-bezier(.2,.8,.2,1);min-width:2px}",
    X + ".nthview-win{display:inline-block;margin-left:.3rem;font-size:.62rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;padding:.05rem .4rem;border-radius:999px;background:color-mix(in srgb,var(--ok) 20%,transparent);color:var(--ok);vertical-align:middle;font-family:var(--body)}",
    /* step layout */
    X + ".nthview-step{display:flex;flex-direction:column}",
    X + ".nthview-colstory,.nthview-explorable .nthview-colbench{display:contents}",
    X + ".nthview-story{order:1}" + X + ".nthview-visuals{order:2}" + X + ".nthview-predict{order:3}" + X + ".nthview-controls{order:4}" + X + ".nthview-after{order:5}" + X + ".nthview-step > .nthview-nav{order:6}",
    "@media (min-width:980px){" + X + ".nthview-step{display:grid;grid-template-columns:minmax(0,.92fr) minmax(0,1.08fr);gap:0 2.2rem;align-items:start}" + X + ".nthview-step > .nthview-nav{grid-column:1 / -1}" + X + ".nthview-colstory,.nthview-explorable .nthview-colbench{display:block}" + X + ".nthview-colbench{position:sticky;top:4.6rem;max-height:calc(100vh - 5.2rem);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;padding:.5rem .5rem .2rem;margin:-.5rem -.5rem 0}}",
    X + ".nthview-story p{font-size:1.06rem}",
    X + ".nthview-kicker{display:inline-flex;align-items:center;gap:.5rem;font-family:var(--mono);font-size:.76rem;font-weight:700;color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,transparent);border:1px solid color-mix(in srgb,var(--accent) 30%,transparent);border-radius:999px;padding:.2rem .7rem;margin-bottom:.7rem}",
    /* live text */
    X + ".nthview-live{font-family:var(--mono);font-weight:700;font-size:.94em;color:var(--accent);background:color-mix(in srgb,var(--accent) 10%,transparent);border-radius:.35rem;padding:0 .25rem;font-variant-numeric:tabular-nums;white-space:nowrap}",
    X + ".nthview-scrub{font-family:var(--mono);font-weight:700;font-size:.94em;color:var(--accent);border-bottom:2px dashed var(--accent);cursor:ew-resize;padding:0 .15rem;border-radius:.2rem;touch-action:none;user-select:none;-webkit-user-select:none;white-space:nowrap;transition:background .15s}",
    X + ".nthview-scrub:hover,.nthview-explorable .nthview-scrub:focus-visible,.nthview-explorable .nthview-scrub.nthview-dragging{background:color-mix(in srgb,var(--accent) 16%,transparent)}",
    X + ".nthview-scrub[aria-disabled=true]{cursor:not-allowed;opacity:.6;border-bottom-style:dotted}",
    X + ".nthview-scrub::before{content:'\\2039 ';opacity:.55}" + X + ".nthview-scrub::after{content:' \\203A';opacity:.55}",
    X + ".nthview-term{border-bottom:1.5px dotted var(--accent);cursor:help;border-radius:.15rem}",
    X + ".nthview-term:hover{color:var(--accent)}",
    X + ".nthview-pop{position:absolute;z-index:40;max-width:min(20rem,calc(100vw - 2rem));background:var(--surface-2);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);border:1px solid var(--line);border-radius:calc(var(--radius) * .7);padding:.75rem .9rem;box-shadow:0 24px 50px -20px rgba(0,0,0,.55);font-size:.9rem;line-height:1.5;animation:nthview-pop .25s ease both}",
    X + ".nthview-pop b{display:block;font-family:var(--display);color:var(--accent);margin-bottom:.15rem}",
    /* predict */
    X + ".nthview-predict{border:1.5px solid color-mix(in srgb,var(--accent) 40%,var(--line))}",
    X + ".nthview-predict .nthview-eyebrow{display:flex;align-items:center;gap:.4rem}",
    X + ".nthview-predict .nthview-eyebrow svg{width:1rem;height:1rem}",
    X + ".nthview-ask{font-family:var(--display);font-weight:700;font-size:1.12rem;line-height:1.35;margin:.1rem 0 .8rem}",
    X + ".nthview-opts{display:grid;gap:.5rem;margin:0;padding:0;list-style:none}",
    X + ".nthview-opt{display:flex;gap:.75rem;align-items:flex-start;width:100%;text-align:left;background:var(--surface-2);border:1.5px solid var(--line);border-radius:calc(var(--radius) * .7);padding:.7rem .85rem;line-height:1.4;transition:border-color .18s,transform .18s,box-shadow .18s,opacity .3s}",
    X + ".nthview-opt:hover:not(:disabled){border-color:var(--accent);transform:translateY(-2px);box-shadow:0 14px 34px -22px var(--accent)}",
    X + ".nthview-opt:disabled{cursor:default}",
    X + ".nthview-key{flex:none;width:1.7rem;height:1.7rem;border-radius:.55rem;display:grid;place-items:center;font-family:var(--mono);font-weight:700;font-size:.82rem;background:var(--surface);border:1px solid var(--line)}",
    X + ".nthview-opt:hover:not(:disabled) .nthview-key{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);border-color:transparent}",
    X + ".nthview-opt.nthview-picked{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 30%,transparent)}",
    X + ".nthview-opt.nthview-right{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,var(--surface-2))}",
    X + ".nthview-opt.nthview-right .nthview-key{background:var(--ok);color:#fff;border-color:transparent}",
    X + ".nthview-opt.nthview-wrong{border-color:var(--no);background:color-mix(in srgb,var(--no) 12%,var(--surface-2))}",
    X + ".nthview-opt.nthview-wrong .nthview-key{background:var(--no);color:#fff;border-color:transparent}",
    X + ".nthview-opt.nthview-dim{opacity:.55}",
    X + ".nthview-observing{margin:.8rem 0 0;height:2.4rem;border-radius:.8rem;display:flex;align-items:center;gap:.6rem;padding:0 .8rem;font-weight:700;font-size:.9rem;background:linear-gradient(90deg,transparent,color-mix(in srgb,var(--accent) 22%,transparent),transparent) var(--surface-2);background-size:200% 100%;animation:nthview-sheen 1.3s linear infinite;border:1px solid var(--line)}",
    X + ".nthview-observing svg{width:1.1rem;height:1.1rem;animation:nthview-spin 1.2s linear infinite;color:var(--accent)}",
    X + ".nthview-verdict{margin-top:.9rem;border-radius:calc(var(--radius) * .8);padding:.85rem 1rem;border:1.5px solid var(--line);background:var(--surface-2)}",
    X + ".nthview-verdict.nthview-ok{border-color:color-mix(in srgb,var(--ok) 60%,transparent);background:color-mix(in srgb,var(--ok) 11%,var(--surface-2))}",
    X + ".nthview-verdict.nthview-no{border-color:color-mix(in srgb,var(--no) 60%,transparent);background:color-mix(in srgb,var(--no) 10%,var(--surface-2))}",
    X + ".nthview-verdict h3{display:flex;align-items:center;gap:.55rem;margin-bottom:.35rem;font-size:1.1rem}",
    X + ".nthview-ok h3{color:var(--ok)}" + X + ".nthview-no h3{color:var(--no)}",
    X + ".nthview-vicon{flex:none;width:1.8rem;height:1.8rem;border-radius:50%;display:grid;place-items:center;color:#fff;animation:nthview-pop .45s cubic-bezier(.2,.8,.2,1) both}",
    X + ".nthview-ok .nthview-vicon{background:var(--ok)}" + X + ".nthview-no .nthview-vicon{background:var(--no)}",
    X + ".nthview-vicon svg{width:1rem;height:1rem}",
    X + ".nthview-verdict p{margin:.3rem 0 0;font-size:.95rem}",
    X + ".nthview-notice{margin-top:.9rem;border-radius:calc(var(--radius) * .8);padding:.9rem 1rem .9rem 1.15rem;position:relative;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 16%,var(--surface-2)),color-mix(in srgb,var(--accent-2) 12%,var(--surface-2)));border:1px solid var(--line)}",
    X + ".nthview-notice::before{content:'';position:absolute;left:0;top:12%;bottom:12%;width:4px;border-radius:2px;background:linear-gradient(var(--accent),var(--accent-2))}",
    X + ".nthview-notice p{margin:.2rem 0 0}",
    X + ".nthview-reveal{animation:nthview-rise .55s cubic-bezier(.2,.8,.2,1) both}",
    /* controls */
    X + ".nthview-controls{transition:opacity .3s}",
    X + ".nthview-controls.nthview-locked .nthview-ctl{opacity:.45;filter:saturate(.4)}",
    X + ".nthview-lockmsg{display:flex;align-items:center;gap:.5rem;font-size:.86rem;font-weight:700;color:var(--muted);margin:-.1rem 0 .7rem}",
    X + ".nthview-lockmsg svg{width:1rem;height:1rem;flex:none}",
    X + ".nthview-ctls{display:grid;grid-template-columns:repeat(auto-fit,minmax(13rem,1fr));gap:.9rem 1.2rem}",
    X + ".nthview-ctl{min-width:0;transition:opacity .3s,filter .3s}",
    X + ".nthview-ctl-top{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;margin-bottom:.3rem}",
    X + ".nthview-ctl-top label,.nthview-explorable .nthview-ctl-top span{font-size:.86rem;font-weight:700}",
    X + ".nthview-ctl-top output{font-family:var(--mono);font-weight:700;color:var(--accent);font-size:.9rem;font-variant-numeric:tabular-nums;white-space:nowrap}",
    X + ".nthview-range{-webkit-appearance:none;appearance:none;width:100%;height:1.6rem;background:transparent;margin:0;--p:50%}",
    X + ".nthview-range::-webkit-slider-runnable-track{height:6px;border-radius:3px;background:linear-gradient(90deg,var(--accent) 0,var(--accent-2) var(--p),var(--line) var(--p))}",
    X + ".nthview-range::-moz-range-track{height:6px;border-radius:3px;background:linear-gradient(90deg,var(--accent) 0,var(--accent-2) var(--p),var(--line) var(--p))}",
    X + ".nthview-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:1.25rem;height:1.25rem;border-radius:50%;margin-top:-.42rem;background:var(--surface-2);border:3px solid var(--accent);box-shadow:0 4px 12px -4px var(--accent);transition:transform .15s}",
    X + ".nthview-range::-moz-range-thumb{width:1rem;height:1rem;border-radius:50%;background:var(--surface-2);border:3px solid var(--accent)}",
    X + ".nthview-range:active::-webkit-slider-thumb{transform:scale(1.18)}",
    X + ".nthview-range:disabled{cursor:not-allowed}",
    X + ".nthview-ends{display:flex;justify-content:space-between;font-size:.7rem;color:var(--muted);font-family:var(--mono)}",
    X + ".nthview-stepper{display:flex;align-items:center;gap:.4rem}",
    X + ".nthview-stepper output{flex:1;text-align:center;font-family:var(--mono);font-weight:700;font-size:1.05rem;color:var(--ink)}",
    X + ".nthview-sbtn{width:2.4rem;height:2.4rem;border-radius:.7rem;border:1px solid var(--line);background:var(--surface-2);font-size:1.25rem;font-weight:700;line-height:1;display:grid;place-items:center;transition:border-color .2s}",
    X + ".nthview-sbtn:hover:not(:disabled){border-color:var(--accent);color:var(--accent)}",
    X + ".nthview-switch{display:flex;align-items:center;justify-content:space-between;gap:.8rem;width:100%;border:1px solid var(--line);background:var(--surface-2);border-radius:.8rem;padding:.55rem .7rem;text-align:left;font-weight:700;font-size:.88rem}",
    X + ".nthview-switch i{flex:none;width:2.6rem;height:1.5rem;border-radius:999px;background:var(--line);position:relative;transition:background .25s}",
    X + ".nthview-switch i::after{content:'';position:absolute;top:.2rem;left:.2rem;width:1.1rem;height:1.1rem;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.3);transition:transform .25s cubic-bezier(.3,1.4,.5,1)}",
    X + ".nthview-switch[aria-checked=true] i{background:linear-gradient(90deg,var(--accent),var(--accent-2))}",
    X + ".nthview-switch[aria-checked=true] i::after{transform:translateX(1.1rem)}",
    X + ".nthview-seg-group{display:flex;flex-wrap:wrap;gap:.3rem;padding:.25rem;border-radius:.85rem;background:var(--field);border:1px solid var(--line)}",
    X + ".nthview-choice{flex:1 1 auto;border:0;background:transparent;border-radius:.6rem;padding:.42rem .6rem;font-size:.84rem;font-weight:700;color:var(--muted);transition:background .2s,color .2s}",
    X + ".nthview-choice[aria-checked=true]{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);box-shadow:0 6px 16px -8px var(--accent)}",
    X + ".nthview-choice:hover:not(:disabled):not([aria-checked=true]){color:var(--ink);background:var(--surface-2)}",
    X + ".nthview-playrow{display:flex;align-items:center;gap:.5rem}",
    X + ".nthview-playrow input{flex:1;min-width:0}",
    X + ".nthview-ctl-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem;align-items:center}",
    /* buttons */
    X + ".nthview-btn{display:inline-flex;align-items:center;gap:.45rem;border:1.5px solid var(--accent);background:var(--surface);color:var(--accent);border-radius:999px;padding:.62rem 1.15rem;font-weight:800;font-size:.92rem;transition:transform .18s,box-shadow .18s,filter .18s}",
    X + ".nthview-btn svg{width:1rem;height:1rem}",
    X + ".nthview-btn:hover:not(:disabled){transform:translateY(-2px)}",
    X + ".nthview-btn:disabled{opacity:.5}",
    X + ".nthview-btn.nthview-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);border-color:transparent;box-shadow:0 14px 34px -14px var(--accent)}",
    X + ".nthview-btn.nthview-primary:hover:not(:disabled){filter:brightness(1.06);box-shadow:0 18px 40px -14px var(--accent)}",
    X + ".nthview-btn.nthview-ghost{border-color:transparent;background:transparent;color:var(--muted);padding-left:.4rem;padding-right:.4rem;font-weight:700}",
    X + ".nthview-btn.nthview-ghost:hover:not(:disabled){color:var(--ink);transform:none;text-decoration:underline}",
    X + ".nthview-btn.nthview-small-btn{padding:.42rem .85rem;font-size:.84rem}",
    X + ".nthview-nav{display:flex;justify-content:space-between;align-items:center;gap:.7rem;flex-wrap:wrap;margin-top:1.4rem;padding-top:1rem;border-top:1px solid var(--line)}",
    X + ".nthview-nav .nthview-primary{margin-left:auto}",
    X + ".nthview-hintkeys{font-size:.78rem;color:var(--muted);margin-top:.6rem}",
    X + "kbd{font-family:var(--mono);font-size:.75em;border:1px solid var(--line);border-bottom-width:2px;border-radius:.3rem;padding:0 .3rem;background:var(--surface-2)}",
    /* challenge + takeaway */
    X + ".nthview-challenge{border-style:dashed;border-width:1.5px}",
    X + ".nthview-challenge.nthview-solved{border-style:solid;border-color:color-mix(in srgb,var(--ok) 60%,transparent);background:color-mix(in srgb,var(--ok) 9%,var(--surface))}",
    X + ".nthview-chal-top{display:flex;justify-content:space-between;align-items:center;gap:.5rem;margin-bottom:.3rem}",
    X + ".nthview-pill{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.07em;border-radius:999px;padding:.15rem .6rem;background:var(--surface-2);border:1px solid var(--line);color:var(--muted);white-space:nowrap}",
    X + ".nthview-solved .nthview-pill{background:var(--ok);color:#fff;border-color:transparent;animation:nthview-pop .4s ease both}",
    X + ".nthview-takeaway{border-left:4px solid var(--accent)}",
    X + ".nthview-takeaway p:last-child{margin-bottom:0;font-family:var(--display);font-weight:700;font-size:1.05rem}",
    X + "details summary{cursor:pointer;font-weight:700;color:var(--accent);font-size:.88rem}",
    X + ".nthview-burst{position:absolute;left:50%;top:50%;width:0;height:0;pointer-events:none}",
    X + ".nthview-burst i{position:absolute;width:.45rem;height:.45rem;border-radius:50%;animation:nthview-burst .8s cubic-bezier(.2,.8,.2,1) forwards}",
    /* intro + wrap */
    X + ".nthview-hero{display:grid;gap:1.5rem;align-items:center;margin-bottom:1.4rem}",
    "@media (min-width:900px){" + X + ".nthview-hero{grid-template-columns:1.2fr .8fr}}",
    X + ".nthview-hero p.nthview-lede{font-size:1.18rem;color:var(--muted);max-width:40rem}",
    X + ".nthview-emblem{width:min(100%,22rem);margin:0 auto;aspect-ratio:1}",
    X + ".nthview-emblem svg{width:100%;height:100%}",
    X + ".nthview-orbit{transform-origin:150px 150px;animation:nthview-spin 26s linear infinite}",
    X + ".nthview-orbit.nthview-o2{animation-duration:40s;animation-direction:reverse}",
    X + ".nthview-orbit.nthview-o3{animation-duration:16s}",
    X + ".nthview-bigq{font-family:var(--display);font-size:clamp(1.2rem,2.6vw,1.5rem);font-weight:700;line-height:1.3;margin:0}",
    X + ".nthview-steplist{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(14rem,1fr));gap:.6rem}",
    X + ".nthview-stepcard{width:100%;height:100%;text-align:left;display:flex;gap:.7rem;align-items:flex-start;background:var(--surface);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1px solid var(--line);border-radius:calc(var(--radius) * .8);padding:.8rem .9rem;transition:border-color .2s,transform .2s}",
    X + ".nthview-stepcard:hover{border-color:var(--accent);transform:translateY(-2px)}",
    X + ".nthview-stepcard b{display:block;font-family:var(--display);font-size:.98rem;line-height:1.25}",
    X + ".nthview-stepcard span{display:block;font-size:.78rem;color:var(--muted)}",
    X + ".nthview-stepnum{flex:none;width:1.9rem;height:1.9rem;border-radius:.6rem;display:grid;place-items:center;font-family:var(--mono);font-weight:700;font-size:.8rem;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent)}",
    X + ".nthview-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(9rem,1fr));gap:.8rem;margin:1rem 0 1.4rem}",
    X + ".nthview-tile{background:var(--surface);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:var(--radius);padding:1rem 1.1rem;box-shadow:0 24px 60px -34px rgba(0,0,0,.5)}",
    X + ".nthview-tile b{display:block;font-family:var(--display);font-size:2.3rem;line-height:1;letter-spacing:-.02em;background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}",
    X + ".nthview-tile span{font-size:.85rem;color:var(--muted)}",
    X + ".nthview-wrapgrid{display:grid;gap:1rem}",
    "@media (min-width:900px){" + X + ".nthview-wrapgrid{grid-template-columns:1fr 1fr}}",
    X + ".nthview-ol{padding-left:1.3rem;margin:.2rem 0}",
    X + ".nthview-ol li{margin:.45rem 0;padding-left:.2rem}",
    X + ".nthview-ol li::marker{color:var(--accent);font-weight:800;font-family:var(--mono)}",
    X + ".nthview-gloss{margin:0}",
    X + ".nthview-gloss dt{font-family:var(--display);font-weight:700;color:var(--accent);margin-top:.7rem}",
    X + ".nthview-gloss dd{margin:.15rem 0 0}",
    X + ".nthview-drawer{position:fixed;top:0;right:0;bottom:0;z-index:50;width:min(26rem,100%);background:var(--surface-2);backdrop-filter:blur(22px);-webkit-backdrop-filter:blur(22px);border-left:1px solid var(--line);box-shadow:-30px 0 60px -30px rgba(0,0,0,.6);padding:1.2rem 1.3rem 2rem;overflow-y:auto;transform:translateX(105%);transition:transform .4s cubic-bezier(.2,.8,.2,1);visibility:hidden}",
    X + ".nthview-drawer.nthview-open{transform:none;visibility:visible}",
    X + ".nthview-drawer-head{display:flex;justify-content:space-between;align-items:center;gap:1rem}",
    X + ".nthview-drawer-head h2{margin:0;font-size:1.5rem}",
    X + ".nthview-scrim{position:fixed;inset:0;z-index:45;background:rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .3s}",
    X + ".nthview-scrim.nthview-open{opacity:1;pointer-events:auto}",
    X + ".nthview-confetti{position:fixed;inset:0;pointer-events:none;z-index:60;overflow:hidden}",
    X + ".nthview-confetti i{position:absolute;top:-3vh;width:.55rem;height:.85rem;border-radius:.15rem;animation:nthview-fall linear forwards}",
    "@keyframes nthview-fall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}",
    "@media (prefers-reduced-motion:reduce){" + X + ".nthview-blob," + X + ".nthview-rise," + X + ".nthview-orbit," + X + ".nthview-reveal," + X + ".nthview-observing," + X + ".nthview-observing svg," + X + ".nthview-card.nthview-glowing," + X + ".nthview-tl-dot," + X + ".nthview-vicon," + X + ".nthview-pop{animation:none}" + X + ".nthview-screen," + X + ".nthview-barfill," + X + ".nthview-stackseg," + X + ".nthview-needle," + X + ".nthview-mcell i," + X + ".nthview-drawer," + X + ".nthview-donut-arc{transition:none}}"
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
  var LETTERS = "ABCDE";
  var SERIES = ["accent", "accent2", "violet", "amber", "pink", "green"];
  var FUNCS = { min: [1, 8], max: [1, 8], abs: [1, 1], sqrt: [1, 1], pow: [2, 2], exp: [1, 1], log: [1, 1], sin: [1, 1], cos: [1, 1], floor: [1, 1], round: [1, 1], clamp: [3, 3], "if": [3, 3] };

  // ---- expression compiler (identical copy lives in scripts/validate.js) --
  function compileExpr(src) {
    if (typeof src !== "string" || !src.trim()) return { error: "empty expression" };
    var re = /\s*(?:(\d+(?:\.\d+)?(?:[eE][-+]?\d+)?|\.\d+)|([A-Za-z][A-Za-z0-9]*)|(==|!=|<=|>=|&&|\|\||[-+*\/%()<>!,]))/y;
    var toks = [], pos = 0, m;
    while (pos < src.length) {
      re.lastIndex = pos; m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(pos))) break; return { error: "unexpected character \"" + src.slice(pos).trim()[0] + "\"" }; }
      if (m[1] !== undefined) toks.push({ t: "num", v: parseFloat(m[1]) });
      else if (m[2] !== undefined) toks.push({ t: "id", v: m[2] });
      else toks.push({ t: "op", v: m[3] });
      pos = re.lastIndex;
    }
    var i = 0, ids = [];
    function eat(v) { var t = toks[i]; if (t && t.t === "op" && t.v === v) { i++; return true; } return false; }
    function primary() {
      var t = toks[i];
      if (!t) throw new Error("unexpected end of expression");
      if (t.t === "num") { i++; return function () { return t.v; }; }
      if (t.t === "id") {
        i++;
        var next = toks[i];
        if (next && next.t === "op" && next.v === "(") {
          if (!FUNCS.hasOwnProperty(t.v)) throw new Error("unknown function \"" + t.v + "\" (functions: " + Object.keys(FUNCS).join(", ") + ")");
          i++;
          var args = [];
          if (!eat(")")) {
            do { args.push(orExpr()); } while (eat(","));
            if (!eat(")")) throw new Error("missing ) after the arguments of " + t.v);
          }
          var ar = FUNCS[t.v];
          if (args.length < ar[0] || args.length > ar[1]) throw new Error(t.v + " takes " + (ar[0] === ar[1] ? ar[0] : ar[0] + "–" + ar[1]) + " argument(s), got " + args.length);
          return callFn(t.v, args);
        }
        if (FUNCS.hasOwnProperty(t.v)) throw new Error("function \"" + t.v + "\" must be called with parentheses, e.g. " + t.v + "(…)");
        if (t.v === "pi") return function () { return Math.PI; };
        if (ids.indexOf(t.v) === -1) ids.push(t.v);
        return function (env) { var x = env[t.v]; return typeof x === "number" ? x : 0; };
      }
      if (eat("(")) { var e = orExpr(); if (!eat(")")) throw new Error("missing )"); return e; }
      throw new Error("unexpected \"" + t.v + "\"");
    }
    function callFn(name, a) {
      var f = {
        min: function (env) { return Math.min.apply(null, a.map(function (g) { return g(env); })); },
        max: function (env) { return Math.max.apply(null, a.map(function (g) { return g(env); })); },
        abs: function (env) { return Math.abs(a[0](env)); },
        sqrt: function (env) { return Math.sqrt(a[0](env)); },
        pow: function (env) { return Math.pow(a[0](env), a[1](env)); },
        exp: function (env) { return Math.exp(a[0](env)); },
        log: function (env) { return Math.log(a[0](env)); },
        sin: function (env) { return Math.sin(a[0](env)); },
        cos: function (env) { return Math.cos(a[0](env)); },
        floor: function (env) { return Math.floor(a[0](env)); },
        round: function (env) { return Math.round(a[0](env)); },
        clamp: function (env) { return Math.min(a[2](env), Math.max(a[1](env), a[0](env))); },
        "if": function (env) { return a[0](env) ? a[1](env) : a[2](env); }
      };
      return f[name];
    }
    function unary() {
      if (eat("!")) { var a = unary(); return function (env) { return a(env) ? 0 : 1; }; }
      if (eat("-")) { var b = unary(); return function (env) { return -b(env); }; }
      if (eat("+")) return unary();
      return primary();
    }
    function bin(next, ops) {
      return function () {
        var l = next();
        for (;;) {
          var t = toks[i];
          if (!t || t.t !== "op" || !Object.prototype.hasOwnProperty.call(ops, t.v)) return l;
          i++;
          var r = next();
          l = (function (f, a, b) { return function (env) { return f(a(env), b(env)); }; })(ops[t.v], l, r);
        }
      };
    }
    var mul = bin(unary, { "*": function (a, b) { return a * b; }, "/": function (a, b) { return b === 0 ? 0 : a / b; }, "%": function (a, b) { return b === 0 ? 0 : a % b; } });
    var add = bin(mul, { "+": function (a, b) { return a + b; }, "-": function (a, b) { return a - b; } });
    var cmp = bin(add, {
      "==": function (a, b) { return Math.abs(a - b) < 1e-9 ? 1 : 0; }, "!=": function (a, b) { return Math.abs(a - b) < 1e-9 ? 0 : 1; },
      "<": function (a, b) { return a < b ? 1 : 0; }, "<=": function (a, b) { return a <= b ? 1 : 0; },
      ">": function (a, b) { return a > b ? 1 : 0; }, ">=": function (a, b) { return a >= b ? 1 : 0; }
    });
    var and = bin(cmp, { "&&": function (a, b) { return a && b ? 1 : 0; } });
    var orExpr = bin(and, { "||": function (a, b) { return a || b ? 1 : 0; } });
    try {
      if (!toks.length) throw new Error("empty expression");
      var fn = orExpr();
      if (i < toks.length) throw new Error("unexpected \"" + toks[i].v + "\"");
      return { fn: fn, ids: ids };
    } catch (e) { return { error: e.message }; }
  }

  /* ---- deterministic randomness: the same seed always gives the same run ---- */
  function mulberry32(a) {
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function gauss(rnd) { var a = rnd() || 1e-9, b = rnd(); return Math.sqrt(-2 * Math.log(a)) * Math.cos(2 * Math.PI * b); }

  /* ---- number formatting ---- */
  function grp(s) { var p = s.split("."); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); return p.join("."); }
  function trim(s) { return s.indexOf(".") === -1 ? s : s.replace(/\.?0+$/, ""); }
  function autoNum(a) {
    if (a >= 1e15) return compactNum(a);
    if (a >= 100) return grp(String(Math.round(a)));
    if (a >= 10) return trim(a.toFixed(1));
    if (a >= 1) return trim(a.toFixed(2));
    if (a === 0) return "0";
    if (a >= 0.01) return trim(a.toFixed(2));
    return String(Number(a.toPrecision(2)));
  }
  function compactNum(a) {
    var u = [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "k"]];
    for (var i = 0; i < u.length; i++) if (a >= u[i][0]) { var q = a / u[i][0]; return (q >= 100 ? String(Math.round(q)) : trim(q.toFixed(1))) + u[i][1]; }
    return autoNum(a);
  }
  function fmt(x, f, prefix, unit) {
    if (typeof x !== "number" || !isFinite(x)) x = 0;
    var a = Math.abs(x), s;
    switch (f) {
      case "int": s = grp(String(Math.round(a))); break;
      case "dp1": s = grp(a.toFixed(1)); break;
      case "dp2": s = grp(a.toFixed(2)); break;
      case "pct": s = grp((a * 100).toFixed(0)) + "%"; break;
      case "pct1": s = grp((a * 100).toFixed(1)) + "%"; break;
      case "compact": s = compactNum(a); break;
      case "times": s = "×" + autoNum(a); break;
      default: s = autoNum(a);
    }
    var neg = x < 0 && /[1-9]/.test(s);
    return (neg ? "−" : "") + (prefix || "") + s + (unit ? (/^[A-Za-z]/.test(unit) ? " " : "") + unit : "");
  }

  function svgEl(tag, attrs) {
    var n = root.document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  function svgRoot(viewBox, cls) {
    var s = svgEl("svg", { viewBox: viewBox, "aria-hidden": "true", focusable: "false" });
    if (cls) s.setAttribute("class", cls);
    return s;
  }
  var ICON_PATHS = {
    flask: "M9 3h6M10 3v6.2L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9.2V3M7.5 14h9",
    play: "M8 5.5v13l10.5-6.5z",
    pause: "M8 5h3v14H8zM13 5h3v14h-3z",
    restart: "M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5",
    dice: "M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zM8.5 8.5h.01M15.5 15.5h.01M12 12h.01M15.5 8.5h.01M8.5 15.5h.01",
    prev: "M15 5l-7 7 7 7",
    next: "M9 5l7 7-7 7",
    book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5",
    sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    moon: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
    auto: "M12 3a9 9 0 1 0 0 18zM12 3a9 9 0 0 1 0 18",
    bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z",
    lock: "M6 11h12v10H6zM8.5 11V7.5a3.5 3.5 0 0 1 7 0V11",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 12h.01",
    check: "M5 12.5l4.5 4.5L19 7.5",
    cross: "M7 7l10 10M17 7L7 17",
    close: "M6 6l12 12M18 6L6 18",
    spark: "M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"
  };
  function icon(name, filled) {
    var s = svgRoot("0 0 24 24");
    s.appendChild(svgEl("path", filled ? { d: ICON_PATHS[name], fill: "currentColor" } : { d: ICON_PATHS[name], fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" }));
    return s;
  }
  function hueVar(h) { return h === "accent" ? "var(--accent)" : h === "accent2" ? "var(--accent-2)" : "var(--h-" + h + ")"; }
  function niceCeil(x) {
    if (!(x > 0)) return 1;
    var p = Math.pow(10, Math.floor(Math.log(x) / Math.LN10)), q = x / p;
    return (q <= 1 ? 1 : q <= 2 ? 2 : q <= 2.5 ? 2.5 : q <= 5 ? 5 : 10) * p;
  }
  function ticks(lo, hi, n) {
    var span = hi - lo; if (!(span > 0)) return [lo];
    var raw = span / n, p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), q = raw / p;
    var step = (q < 1.5 ? 1 : q < 3 ? 2 : q < 7 ? 5 : 10) * p, out = [];
    for (var v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    return out;
  }
  function pickTheme(data) {
    if (data.theme && THEMES.indexOf(data.theme) !== -1) return data.theme;
    var h = 0, s = String(data.title || "");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return THEMES[h % THEMES.length];
  }

  function render(container, data) {
    var doc = root.document;
    var reduceMotion = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var STEPS = data.steps, N = STEPS.length, SEED = typeof data.seed === "number" ? data.seed : 1;
    var VARS = data.model.variables, FORMULAS = data.model.formulas || [];
    var VAR = {}, META = {};
    VARS.forEach(function (v) { VAR[v.id] = v; META[v.id] = v; });
    FORMULAS.forEach(function (f) { META[f.id] = f; });
    var GLOSS = {};
    data.glossary.forEach(function (g) { GLOSS[g.term.trim().toLowerCase()] = g; });
    container.setAttribute("data-theme", pickTheme(data));

    /* ---------- model ---------- */
    var cache = {};
    function C(src) { src = String(src); return cache[src] || (cache[src] = compileExpr(src)); }
    function ev(src, env) { if (src === undefined) return 0; var c = C(src); if (c.error) return 0; var x = c.fn(env); return typeof x === "number" && isFinite(x) ? x : 0; }
    function withLocals(env, locals) { var e = Object.create(env); Object.keys(locals).forEach(function (k) { e[k] = locals[k]; }); return e; }
    var vars = {};
    function defaults(start) { var o = {}; VARS.forEach(function (v) { o[v.id] = start && start.hasOwnProperty(v.id) ? start[v.id] : v["default"]; }); return o; }
    function computeEnv(overrides) {
      var e = {};
      VARS.forEach(function (v) { e[v.id] = overrides && overrides.hasOwnProperty(v.id) ? overrides[v.id] : vars[v.id]; });
      FORMULAS.forEach(function (f) { e[f.id] = ev(f.expr, e); });
      return e;
    }
    function clampVar(id, x) { var v = VAR[id]; return Math.round(Math.min(v.max, Math.max(v.min, isFinite(x) ? x : v.min)) * 1e9) / 1e9; }
    function targetsFor(set, env) { var t = {}; Object.keys(set).forEach(function (id) { t[id] = clampVar(id, ev(set[id], env)); }); return t; }
    var subs = [], ENV = null;
    function notify() { ENV = computeEnv(); subs.slice().forEach(function (f) { f(ENV); }); }
    function setVars(obj) { Object.keys(obj).forEach(function (id) { vars[id] = clampVar(id, obj[id]); }); notify(); }
    function watch(fn) { subs.push(fn); }
    function fmtId(id, x) { var m = META[id] || {}; return fmt(x, m.format, m.prefix, m.unit); }
    function fmtV(v, x) { return fmt(x, v.format, v.prefix, v.unit); }

    /* ---------- animation loop: tasks drop themselves when their owner node leaves the page ---------- */
    var tasks = [], running = false, last = 0;
    function addTask(owner, fn) { tasks.push({ owner: owner, fn: fn }); if (!running) { running = true; last = 0; root.requestAnimationFrame(loop); } }
    function loop(now) {
      if (!wrap.isConnected) { running = false; tasks = []; return; }
      var dt = last ? Math.min(0.1, (now - last) / 1000) : 0.016; last = now;
      tasks = tasks.filter(function (t) { return t.owner.isConnected && t.fn(dt, now) !== false; });
      if (tasks.length) root.requestAnimationFrame(loop); else running = false;
    }
    function ease(k) { return k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; }
    var tweenId = 0;
    function tween(owner, target, ms, done) {
      var id = ++tweenId, from = {}, t = 0;
      Object.keys(target).forEach(function (k) { from[k] = vars[k]; });
      if (reduceMotion || ms <= 0) { setVars(target); if (done) done(); return; }
      addTask(owner, function (dt) {
        if (id !== tweenId) return false;
        t += dt * 1000; var k = ease(Math.min(1, t / ms)), o = {};
        Object.keys(target).forEach(function (key) { o[key] = from[key] + (target[key] - from[key]) * k; });
        if (k >= 1) o = target;
        setVars(o);
        if (k >= 1) { if (done) done(); return false; }
      });
    }

    /* ---------- colours for canvas (re-read when the scheme flips) ---------- */
    var colorCache = {};
    function color(h) {
      if (colorCache[h]) return colorCache[h];
      var name = h === "accent" ? "--accent" : h === "accent2" ? "--accent-2" : "--h-" + h;
      return (colorCache[h] = (root.getComputedStyle(container).getPropertyValue(name) || "#888").trim());
    }
    var redrawers = [];
    function schemeChanged() { colorCache = {}; redrawers = redrawers.filter(function (r) { return r.owner.isConnected; }); redrawers.forEach(function (r) { r.fn(); }); }
    if (root.matchMedia) {
      var mq = root.matchMedia("(prefers-color-scheme: dark)");
      var onMq = function () { if (!wrap.isConnected) { if (mq.removeEventListener) mq.removeEventListener("change", onMq); return; } schemeChanged(); };
      if (mq.addEventListener) mq.addEventListener("change", onMq);
    }

    /* ---------- shell ---------- */
    var wrap = el("div", { class: "nthview-shell" });
    var backdrop = el("div", { class: "nthview-backdrop", "aria-hidden": "true" }, [el("div", { class: "nthview-blob" }), el("div", { class: "nthview-blob" }), el("div", { class: "nthview-blob" }), el("div", { class: "nthview-dots" }), el("div", { class: "nthview-grain" })]);
    var status = el("div", { class: "nthview-sr", "aria-live": "polite" });
    var top = el("header", { class: "nthview-top" });
    var brandText = el("div", {}, [el("span", { text: "Explorable lab" }), el("strong", { text: data.title })]);
    top.appendChild(el("div", { class: "nthview-brand" }, [el("span", { class: "nthview-logo", "aria-hidden": "true" }, [icon("flask")]), brandText]));
    var rail = el("nav", { class: "nthview-rail", "aria-label": "Steps" });
    var segs = STEPS.map(function (s, i) {
      var b = el("button", { type: "button", class: "nthview-seg", "aria-label": "Step " + (i + 1) + ": " + s.title });
      b.addEventListener("click", function () { go(i); });
      rail.appendChild(b); return b;
    });
    var railText = el("span", { class: "nthview-railtext", "aria-hidden": "true" });
    rail.appendChild(railText);
    top.appendChild(rail);
    var glossBtn = el("button", { type: "button", class: "nthview-tool", "aria-haspopup": "dialog", "aria-expanded": "false" }, [icon("book"), el("span", { class: "nthview-tlabel", text: "Glossary" })]);
    var schemeBtn = el("button", { type: "button", class: "nthview-tool" });
    top.appendChild(el("div", { class: "nthview-tools" }, [glossBtn, schemeBtn]));
    var frame = el("main", { class: "nthview-frame" });
    var stage = el("div", { class: "nthview-stage" });
    frame.appendChild(stage);
    wrap.appendChild(backdrop); wrap.appendChild(top); wrap.appendChild(frame); wrap.appendChild(status);
    container.appendChild(wrap);

    /* colour scheme toggle: auto -> light -> dark */
    var schemes = ["auto", "light", "dark"], scheme = 0;
    function paintScheme() {
      var s = schemes[scheme], nextS = schemes[(scheme + 1) % 3];
      if (s === "auto") container.removeAttribute("data-scheme"); else container.setAttribute("data-scheme", s);
      schemeBtn.textContent = "";
      schemeBtn.appendChild(icon(s === "auto" ? "auto" : s === "light" ? "sun" : "moon"));
      schemeBtn.appendChild(el("span", { class: "nthview-tlabel", text: s === "auto" ? "Auto" : s === "light" ? "Light" : "Dark" }));
      schemeBtn.setAttribute("aria-label", "Colour scheme: " + s + (s === "auto" ? " (follows your system)" : "") + ". Switch to " + nextS + ".");
    }
    schemeBtn.addEventListener("click", function () { scheme = (scheme + 1) % 3; paintScheme(); schemeChanged(); });
    paintScheme();

    /* glossary drawer + term popovers */
    var scrim = el("div", { class: "nthview-scrim", "aria-hidden": "true" });
    var drawer = el("aside", { class: "nthview-drawer", role: "dialog", "aria-modal": "true", "aria-label": "Glossary", tabindex: "-1" });
    var closeBtn = el("button", { type: "button", class: "nthview-icon-btn", "aria-label": "Close glossary" }, [icon("close")]);
    drawer.appendChild(el("div", { class: "nthview-drawer-head" }, [el("h2", { text: "Glossary" }), closeBtn]));
    drawer.appendChild(glossaryList());
    wrap.appendChild(scrim); wrap.appendChild(drawer);
    var drawerReturn = null;
    function openGlossary() { drawerReturn = doc.activeElement; drawer.classList.add("nthview-open"); scrim.classList.add("nthview-open"); glossBtn.setAttribute("aria-expanded", "true"); setTimeout(function () { closeBtn.focus(); }, 50); }
    function closeGlossary() { if (!drawer.classList.contains("nthview-open")) return; drawer.classList.remove("nthview-open"); scrim.classList.remove("nthview-open"); glossBtn.setAttribute("aria-expanded", "false"); if (drawerReturn && drawerReturn.focus) drawerReturn.focus(); }
    glossBtn.addEventListener("click", openGlossary);
    closeBtn.addEventListener("click", closeGlossary);
    scrim.addEventListener("click", closeGlossary);
    drawer.addEventListener("keydown", function (e) {
      if (e.key !== "Tab") return;
      var f = drawer.querySelectorAll("button,[tabindex='0']"), first = f[0], lastF = f[f.length - 1];
      if (e.shiftKey && doc.activeElement === first) { lastF.focus(); e.preventDefault(); }
      else if (!e.shiftKey && doc.activeElement === lastF) { first.focus(); e.preventDefault(); }
    });
    function glossaryList() {
      var dl = el("dl", { class: "nthview-gloss" });
      data.glossary.forEach(function (g) { dl.appendChild(el("dt", { text: g.term })); var dd = el("dd"); dd.appendChild(rich(g.definition, null)); dl.appendChild(dd); });
      return dl;
    }
    var pop = null, popFor = null;
    function closePop() { if (pop && pop.parentNode) pop.parentNode.removeChild(pop); if (popFor) popFor.setAttribute("aria-expanded", "false"); pop = null; popFor = null; }
    var popSeq = 0;
    function openPop(btn, g) {
      if (popFor === btn) { closePop(); return; }
      closePop();
      var id = "nthview-pop-" + (++popSeq);
      pop = el("div", { class: "nthview-pop", role: "note", id: id }, [el("b", { text: g.term })]);
      pop.appendChild(rich(g.definition, null));
      wrap.appendChild(pop);
      var r = btn.getBoundingClientRect(), w = wrap.getBoundingClientRect(), pw = pop.offsetWidth;
      var left = Math.max(12, Math.min(r.left - w.left, w.width - pw - 12));
      pop.style.left = left + "px"; pop.style.top = (r.bottom - w.top + 8) + "px";
      btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-describedby", id); popFor = btn;
    }
    wrap.addEventListener("click", function (e) { if (pop && !pop.contains(e.target) && e.target !== popFor && !(popFor && popFor.contains(e.target))) closePop(); });

    /* ---------- rich text: **bold**, ((term)), {expr|fmt}, [[variable]] ---------- */
    var scrubbers = [];
    function rich(text, live, opts) {
      var frag = doc.createDocumentFragment();
      var re = /(\*\*[^*]+\*\*|\(\([^()]+\)\)|\[\[[^\]]+\]\]|\{[^{}]+\})/;
      String(text).split(re).forEach(function (part) {
        if (!part) return;
        if (/^\*\*[^*]+\*\*$/.test(part)) { var bold = el("b"); bold.appendChild(rich(part.slice(2, -2), live, opts)); frag.appendChild(bold); return; }
        var tm = part.match(/^\(\(([^()]+)\)\)$/);
        if (tm) {
          var bits = tm[1].split("|"), g = GLOSS[bits[bits.length - 1].trim().toLowerCase()];
          if (g) {
            var tb = el("span", { role: "button", tabindex: "0", class: "nthview-term", "aria-expanded": "false", text: bits[0].trim() });
            tb.addEventListener("click", function (e) { e.stopPropagation(); openPop(tb, g); });
            tb.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); openPop(tb, g); } });
            frag.appendChild(tb); return;
          }
          frag.appendChild(doc.createTextNode(bits[0])); return;
        }
        if (live && /^\[\[[^\]]+\]\]$/.test(part) && opts && opts.scrub && VAR[part.slice(2, -2).trim()]) { frag.appendChild(scrubber(VAR[part.slice(2, -2).trim()], live)); return; }
        if (live && /^\{[^{}]+\}$/.test(part)) {
          var inner = part.slice(1, -1), bar = inner.lastIndexOf("|"), f = null;
          if (bar !== -1) { f = inner.slice(bar + 1).trim(); inner = inner.slice(0, bar); }
          var src = inner.trim(), c = C(src);
          if (!c.error) {
            var span = el("span", { class: "nthview-live" });
            var meta = META[src];
            live.push(function (env) { var x = ev(src, env); span.textContent = f ? fmt(x, f) : meta ? fmtId(src, x) : fmt(x); });
            frag.appendChild(span); return;
          }
        }
        frag.appendChild(doc.createTextNode(part));
      });
      return frag;
    }
    function para(text, live, cls, opts) { var n = el("p", cls ? { class: cls } : {}); n.appendChild(rich(text, live, opts)); return n; }
    function stepOf(v) { return v.step || (v.max - v.min) / 100; }
    function snap(v, x) { var s = stepOf(v); return clampVar(v.id, v.min + Math.round((x - v.min) / s) * s); }

    function scrubber(v, live) {
      var s = el("span", { class: "nthview-scrub", role: "slider", tabindex: "0", "aria-label": v.label, "aria-valuemin": String(v.min), "aria-valuemax": String(v.max) });
      var startX = 0, startV = 0, dragging = false;
      function locked() { return s.getAttribute("aria-disabled") === "true"; }
      live.push(function (env) { var x = env[v.id]; s.textContent = fmtV(v, x); s.setAttribute("aria-valuenow", String(x)); s.setAttribute("aria-valuetext", fmtV(v, x)); });
      s.addEventListener("pointerdown", function (e) { if (locked()) return; dragging = true; startX = e.clientX; startV = vars[v.id]; s.classList.add("nthview-dragging"); if (s.setPointerCapture) s.setPointerCapture(e.pointerId); e.preventDefault(); });
      s.addEventListener("pointermove", function (e) { if (!dragging) return; var dx = e.clientX - startX; var o = {}; o[v.id] = snap(v, startV + dx * (v.max - v.min) / 240); setVars(o); });
      function end() { dragging = false; s.classList.remove("nthview-dragging"); }
      s.addEventListener("pointerup", end); s.addEventListener("pointercancel", end);
      s.addEventListener("keydown", function (e) {
        if (locked()) return;
        var st = stepOf(v), x = vars[v.id], o = {};
        if (e.key === "ArrowRight" || e.key === "ArrowUp") x += st;
        else if (e.key === "ArrowLeft" || e.key === "ArrowDown") x -= st;
        else if (e.key === "PageUp") x += st * 10;
        else if (e.key === "PageDown") x -= st * 10;
        else if (e.key === "Home") x = v.min;
        else if (e.key === "End") x = v.max;
        else return;
        e.preventDefault(); e.stopPropagation(); o[v.id] = snap(v, x); setVars(o);
      });
      scrubbers.push(s);
      return s;
    }

    /* ---------- small helpers ---------- */
    function btn(label, cls, onClick, iconName) {
      var b = el("button", { type: "button", class: "nthview-btn" + (cls ? " " + cls : "") });
      if (iconName) b.appendChild(icon(iconName, iconName === "play" || iconName === "pause"));
      b.appendChild(doc.createTextNode(label));
      b.addEventListener("click", onClick); return b;
    }
    function iconBtn(name, label, onClick) {
      var b = el("button", { type: "button", class: "nthview-icon-btn", "aria-label": label, title: label }, [icon(name, name === "play" || name === "pause")]);
      b.addEventListener("click", onClick); return b;
    }
    function setIcon(b, name, label) { b.textContent = ""; b.appendChild(icon(name, name === "play" || name === "pause")); b.setAttribute("aria-label", label); b.setAttribute("title", label); }
    function rise(node, i) { node.classList.add("nthview-rise"); node.style.setProperty("--i", String(i)); return node; }
    function legend(items) {
      var ul = el("ul", { class: "nthview-legend" });
      items.forEach(function (it) {
        var i = el("i", { class: it.dash ? "nthview-dash" : "" }); i.style.background = hueVar(it.hue);
        var li = el("li", {}, [i, el("span", { text: it.label })]);
        if (it.value) { it.value.textContent = ""; li.appendChild(it.value); }
        ul.appendChild(li);
      });
      return ul;
    }
    function throttle(fn, ms) { var t = 0, pending = null; return function (x) { pending = x; var now = Date.now(); if (now - t > ms) { t = now; fn(pending); } else if (!fn._q) { fn._q = setTimeout(function () { fn._q = null; t = Date.now(); fn(pending); }, ms); } }; }
    function burst(host) {
      if (reduceMotion) return;
      var b = el("div", { class: "nthview-burst", "aria-hidden": "true" });
      var cols = ["var(--accent)", "var(--accent-2)", "var(--ok)", "var(--warn)"];
      for (var i = 0; i < 16; i++) {
        var d = doc.createElement("i"), a = i / 16 * Math.PI * 2, r = 50 + (i % 3) * 18;
        d.style.background = cols[i % 4]; d.style.setProperty("--dx", Math.cos(a) * r + "px"); d.style.setProperty("--dy", Math.sin(a) * r + "px");
        b.appendChild(d);
      }
      host.appendChild(b); setTimeout(function () { if (b.parentNode) b.parentNode.removeChild(b); }, 900);
    }
    function confetti() {
      if (reduceMotion) return;
      var box = el("div", { class: "nthview-confetti", "aria-hidden": "true" });
      var colors = ["var(--accent)", "var(--accent-2)", "var(--ok)", "var(--warn)", "var(--h-pink)"];
      for (var i = 0; i < 70; i++) {
        var c = doc.createElement("i");
        c.style.left = (Math.random() * 100) + "vw"; c.style.background = colors[i % colors.length];
        c.style.animationDuration = (2.6 + Math.random() * 1.8) + "s"; c.style.animationDelay = (Math.random() * .6) + "s";
        c.style.transform = "rotate(" + Math.random() * 360 + "deg)";
        box.appendChild(c);
      }
      wrap.appendChild(box);
      setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 5200);
    }
    function whenVisible(node, fn) {
      if (!root.IntersectionObserver) { setTimeout(fn, 0); return; }
      var io = new root.IntersectionObserver(function (entries) {
        if (node.isConnected && entries.some(function (e) { return e.isIntersecting; })) { io.disconnect(); fn(); }
      }, { threshold: 0.35 });
      io.observe(node);
    }
    function narrow() { return !(root.matchMedia && root.matchMedia("(min-width: 980px)").matches); }
    function scrollToNode(node, block) {
      var r = node.getBoundingClientRect(), topBar = top.getBoundingClientRect().height + 12;
      var y = block === "center" ? root.scrollY + r.top - Math.max(topBar, (root.innerHeight - r.height) / 2) : root.scrollY + r.top - topBar;
      root.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? "auto" : "smooth" });
    }
    function canvasFit(canvas, aspect, draw, owner) {
      var dpr = Math.min(2, root.devicePixelRatio || 1);
      function fit() {
        var w = canvas.clientWidth || 400;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(w * aspect * dpr);
        draw();
      }
      if (root.ResizeObserver) { var ro = new root.ResizeObserver(function () { if (!owner.isConnected) { ro.disconnect(); return; } fit(); }); ro.observe(canvas); }
      else root.addEventListener("resize", function h() { if (!owner.isConnected) { root.removeEventListener("resize", h); return; } fit(); });
      redrawers.push({ owner: owner, fn: draw });
      setTimeout(fit, 0);
    }

    /* =====================================================================
       Visualisations. Each returns { node, update(env), text(env) }.
       ===================================================================== */
    var KIND_NAMES = { bars: "Bar chart", line: "Curve", scatter: "Scatter", agents: "Simulation", grid: "Cell field", gauge: "Gauge", number: "Readout", stack: "Proportions", flow: "Flow", timeline: "Replay", compare: "Side by side" };

    function visualCard(v, si, vi) {
      var card = el("figure", { class: "nthview-card nthview-vis", role: "group", style: "margin:0 0 1rem" });
      var head = el("div", { class: "nthview-vhead" });
      var titles = el("div", {}, [el("span", { class: "nthview-vkind", text: KIND_NAMES[v.kind] })]);
      if (v.title) titles.appendChild(el("h3", { text: v.title }));
      head.appendChild(titles);
      var mini = el("div", { class: "nthview-mini" });
      head.appendChild(mini);
      card.appendChild(head);
      var fig = el("div", v.kind === "timeline" ? { class: "nthview-fig" } : { class: "nthview-fig", role: "img" });
      card.appendChild(fig);
      card.setAttribute("aria-label", (v.title || KIND_NAMES[v.kind]));
      var impl = BUILDERS[v.kind](v, fig, mini, card, { seed: SEED + si * 1000 + vi * 97 });
      var live = [];
      if (v.caption) { var cap = el("figcaption", { class: "nthview-caption" }); cap.appendChild(rich(v.caption, live)); card.appendChild(cap); }
      var label = throttle(function (env) { if (impl.text && v.kind !== "timeline") fig.setAttribute("aria-label", impl.text(env)); }, 400);
      watch(function (env) { impl.update(env); live.forEach(function (f) { f(env); }); label(env); });
      return card;
    }

    var BUILDERS = {};

    /* ---- bars ---- */
    BUILDERS.bars = function (v, fig) {
      var rows = v.bars.map(function (b, i) {
        var hue = b.color || SERIES[i % SERIES.length];
        var fill = el("div", { class: "nthview-barfill" }); fill.style.background = "linear-gradient(180deg," + hueVar(hue) + ",color-mix(in srgb," + hueVar(hue) + " 70%,transparent))"; fill.style.color = hueVar(hue);
        var val = el("b", { class: "nthview-barval" });
        var track = el("div", { class: "nthview-bartrack" }, [fill]);
        if (v.horizontal) { var row = el("div", { class: "nthview-hbar" }, [el("span", { text: b.label }), track, val]); return { node: row, fill: fill, val: val, hue: hue, b: b }; }
        track.appendChild(val);
        return { node: el("div", { class: "nthview-barcol" }, [track, el("span", { class: "nthview-barlabel", text: b.label })]), fill: fill, val: val, hue: hue, b: b };
      });
      fig.appendChild(el("div", { class: v.horizontal ? "nthview-hbars" : "nthview-bars" }, rows.map(function (r) { return r.node; })));
      return {
        update: function (env) {
          var vals = rows.map(function (r) { return ev(r.b.value, env); });
          var max = v.max !== undefined ? ev(v.max, env) : niceCeil(Math.max.apply(null, vals.map(Math.abs).concat([1e-9])) * 1.05);
          rows.forEach(function (r, i) {
            var pct = Math.max(0, Math.min(100, max > 0 ? vals[i] / max * 100 : 0)) + "%";
            var alert = r.b.alert !== undefined && ev(r.b.alert, env);
            if (v.horizontal) r.fill.style.width = pct; else { r.fill.style.height = pct; r.val.style.bottom = pct; }
            var h = alert ? "red" : r.hue;
            r.fill.style.background = "linear-gradient(" + (v.horizontal ? "90deg" : "180deg") + "," + hueVar(h) + ",color-mix(in srgb," + hueVar(h) + " 70%,transparent))";
            r.fill.style.color = hueVar(h);
            r.val.textContent = (alert ? "! " : "") + fmtV(v, vals[i]);
            r.val.className = "nthview-barval" + (alert ? " nthview-alert" : "");
            if (v.horizontal) r.val.className = alert ? "nthview-alert" : "";
          });
        },
        text: function (env) { return (v.title || "Bar chart") + ": " + rows.map(function (r) { return r.b.label + " " + fmtV(v, ev(r.b.value, env)); }).join(", "); }
      };
    };

    /* ---- line ---- */
    BUILDERS.line = function (v, fig) {
      var W = 400, H = 240, L = 46, R = 14, T = v.yLabel ? 30 : 14, B = 36;
      var s = svgRoot("0 0 " + W + " " + H);
      var gGrid = svgEl("g"), gPaths = svgEl("g"), gMark = svgEl("g");
      var defs = svgEl("defs"), gid = "nthview-lg-" + Math.random().toString(36).slice(2, 8);
      var grad = svgEl("linearGradient", { id: gid, x1: "0", y1: "0", x2: "0", y2: "1" });
      var hue0 = v.series[0].color || SERIES[0];
      grad.appendChild(svgEl("stop", { offset: "0", "stop-color": hueVar(hue0), "stop-opacity": ".32" }));
      grad.appendChild(svgEl("stop", { offset: "1", "stop-color": hueVar(hue0), "stop-opacity": "0" }));
      defs.appendChild(grad); s.appendChild(defs);
      s.appendChild(gGrid);
      var area = svgEl("path", { fill: "url(#" + gid + ")" }); gPaths.appendChild(area);
      var paths = v.series.map(function (se, i) {
        var hue = se.color || SERIES[i % SERIES.length];
        var p = svgEl("path", { fill: "none", stroke: hueVar(hue), "stroke-width": "2.6", "stroke-linejoin": "round", "stroke-linecap": "round" });
        if (se.dashed) p.setAttribute("stroke-dasharray", "6 5");
        gPaths.appendChild(p); return { p: p, se: se, hue: hue };
      });
      s.appendChild(gPaths); s.appendChild(gMark);
      fig.appendChild(s);
      var vals = paths.map(function (pp) { return { se: pp.se, hue: pp.hue, value: el("b"), dash: pp.se.dashed, label: pp.se.label }; });
      var lg = legend(vals); fig.appendChild(lg);
      var nS = v.samples || 100;
      function line(x1, y1, x2, y2, cls) { return svgEl("line", { x1: x1, y1: y1, x2: x2, y2: y2, class: cls }); }
      function text(x, y, t, cls, anchor) { var n = svgEl("text", { x: x, y: y, class: cls, "text-anchor": anchor || "middle" }); n.textContent = t; return n; }
      return {
        update: function (env) {
          var x0 = ev(v.x.from, env), x1 = ev(v.x.to, env); if (x1 <= x0) x1 = x0 + 1;
          var xs = [], ys = paths.map(function () { return []; }), lo = Infinity, hi = -Infinity;
          for (var i = 0; i <= nS; i++) {
            var x = x0 + (x1 - x0) * i / nS, loc = {}; loc[v.x.id] = x; xs.push(x);
            var e = withLocals(env, loc);
            paths.forEach(function (pp, j) { var y = ev(pp.se.y, e); ys[j].push(y); if (!v.logY || y > 0) { lo = Math.min(lo, y); hi = Math.max(hi, y); } });
          }
          var yMin, yMax, log = !!v.logY;
          if (log) {
            yMin = v.yMin !== undefined ? Math.max(1e-12, ev(v.yMin, env)) : Math.pow(10, Math.floor(Math.log(Math.max(lo, 1e-12)) / Math.LN10));
            yMax = v.yMax !== undefined ? ev(v.yMax, env) : Math.pow(10, Math.ceil(Math.log(Math.max(hi, yMin * 10)) / Math.LN10));
            if (yMax <= yMin) yMax = yMin * 10;
          } else {
            yMin = v.yMin !== undefined ? ev(v.yMin, env) : Math.min(0, lo === Infinity ? 0 : lo);
            yMax = v.yMax !== undefined ? ev(v.yMax, env) : niceCeil(Math.max(hi === -Infinity ? 1 : hi, yMin + 1e-9) * 1.04);
            if (yMax <= yMin) yMax = yMin + 1;
          }
          function sx(x) { return L + (x - x0) / (x1 - x0) * (W - L - R); }
          function sy(y) {
            var k = log ? (Math.log(Math.max(y, yMin * 1e-3)) - Math.log(yMin)) / (Math.log(yMax) - Math.log(yMin)) : (y - yMin) / (yMax - yMin);
            return T + (1 - Math.max(-0.05, Math.min(1.05, k))) * (H - T - B);
          }
          gGrid.textContent = "";
          var yt = log ? (function () { var o = []; for (var p = Math.log(yMin) / Math.LN10; p <= Math.log(yMax) / Math.LN10 + 1e-9; p++) o.push(Math.pow(10, Math.round(p))); while (o.length > 7) o = o.filter(function (_, i) { return i % 2 === 0; }); return o; })() : ticks(yMin, yMax, 4);
          yt.forEach(function (y) { gGrid.appendChild(line(L, sy(y), W - R, sy(y), "nthview-gridline")); gGrid.appendChild(text(L - 6, sy(y) + 3.5, fmt(y, v.format === "pct" || v.format === "pct1" ? v.format : log ? "compact" : v.format, v.prefix), "nthview-tick", "end")); });
          ticks(x0, x1, 5).forEach(function (x) { gGrid.appendChild(text(sx(x), H - B + 15, fmt(x, v.x.format), "nthview-tick")); });
          gGrid.appendChild(line(L, H - B, W - R, H - B, "nthview-axis"));
          gGrid.appendChild(text((L + W - R) / 2, H - 4, v.x.label, "nthview-axislabel"));
          if (v.yLabel) gGrid.appendChild(text(6, 11, v.yLabel, "nthview-axislabel", "start"));
          paths.forEach(function (pp, j) {
            var d = "";
            xs.forEach(function (x, i) { var y = ys[j][i]; if (log && y <= 0) return; d += (d ? "L" : "M") + sx(x).toFixed(1) + " " + sy(y).toFixed(1); });
            pp.p.setAttribute("d", d);
            if (j === 0) area.setAttribute("d", d ? d + "L" + sx(x1).toFixed(1) + " " + (H - B) + "L" + sx(x0).toFixed(1) + " " + (H - B) + "Z" : "");
          });
          gMark.textContent = "";
          var mx = v.marker !== undefined ? ev(v.marker, env) : null;
          if (mx !== null && mx >= x0 && mx <= x1) {
            gMark.appendChild(line(sx(mx), T - 2, sx(mx), H - B, "nthview-marker"));
            var loc2 = {}; loc2[v.x.id] = mx; var e2 = withLocals(env, loc2);
            paths.forEach(function (pp, j) {
              var y = ev(pp.se.y, e2); vals[j].value.textContent = fmtV(v, y);
              if (log && y <= 0) return;
              gMark.appendChild(svgEl("circle", { cx: sx(mx), cy: sy(y), r: "5", fill: hueVar(pp.hue), stroke: "var(--surface-2)", "stroke-width": "2" }));
            });
            var lab = (v.markerLabel ? v.markerLabel + " " : "") + fmt(mx, v.x.format);
            var bw = lab.length * 6.4 + 12, bx = Math.max(L, Math.min(W - R - bw, sx(mx) - bw / 2));
            gMark.appendChild(svgEl("rect", { x: bx, y: T - 19, width: bw, height: 17, rx: 8, class: "nthview-badge-bg" }));
            gMark.appendChild(text(bx + bw / 2, T - 7, lab, "nthview-badge-text"));
          } else {
            paths.forEach(function (pp, j) { vals[j].value.textContent = fmtV(v, ys[j][ys[j].length - 1]); });
          }
        },
        text: function () { return (v.title || "Line chart") + ": " + vals.map(function (x) { return x.label + " " + x.value.textContent; }).join(", ") + (v.marker !== undefined ? " at the marker" : " at the right edge"); }
      };
    };

    /* ---- scatter ---- */
    BUILDERS.scatter = function (v, fig, mini, card, o) {
      var W = 400, H = 260, L = 42, R = 12, T = v.yLabel ? 26 : 12, B = 36, MAX = 1000;
      var rnd = mulberry32(o.seed), U = [], V = [], G = [];
      for (var i = 0; i < MAX; i++) { U.push(rnd()); V.push(rnd()); G.push(gauss(rnd)); }
      var s = svgRoot("0 0 " + W + " " + H), gAx = svgEl("g"), gPts = svgEl("g");
      s.appendChild(gAx); s.appendChild(gPts); fig.appendChild(s);
      var pool = [];
      var hl = el("b"), base = v.color || (v.highlight !== undefined ? "grey" : "accent"), hh = v.highlightColor || "red";
      var items = [{ hue: base, label: v.highlight !== undefined ? "Other points" : "Points" }];
      if (v.highlight !== undefined) items.push({ hue: hh, label: v.highlightLabel || "Highlighted", value: hl });
      fig.appendChild(legend(items));
      function text(x, y, t, cls, anchor) { var n = svgEl("text", { x: x, y: y, class: cls, "text-anchor": anchor || "middle" }); n.textContent = t; return n; }
      var lastText = "";
      return {
        update: function (env) {
          var n = Math.max(1, Math.min(MAX, Math.round(ev(v.count, env))));
          var xMin = v.xMin !== undefined ? ev(v.xMin, env) : 0, xMax = v.xMax !== undefined ? ev(v.xMax, env) : 1;
          var yMin = v.yMin !== undefined ? ev(v.yMin, env) : 0, yMax = v.yMax !== undefined ? ev(v.yMax, env) : 1;
          if (xMax <= xMin) xMax = xMin + 1; if (yMax <= yMin) yMax = yMin + 1;
          function sx(x) { return L + (Math.max(xMin, Math.min(xMax, x)) - xMin) / (xMax - xMin) * (W - L - R); }
          function sy(y) { return T + (1 - (Math.max(yMin, Math.min(yMax, y)) - yMin) / (yMax - yMin)) * (H - T - B); }
          gAx.textContent = "";
          ticks(yMin, yMax, 4).forEach(function (y) { gAx.appendChild(svgEl("line", { x1: L, y1: sy(y), x2: W - R, y2: sy(y), class: "nthview-gridline" })); gAx.appendChild(text(L - 6, sy(y) + 3.5, fmt(y, v.yFormat), "nthview-tick", "end")); });
          ticks(xMin, xMax, 5).forEach(function (x) { gAx.appendChild(text(sx(x), H - B + 15, fmt(x, v.xFormat), "nthview-tick")); });
          gAx.appendChild(svgEl("line", { x1: L, y1: H - B, x2: W - R, y2: H - B, class: "nthview-axis" }));
          if (v.xLabel) gAx.appendChild(text((L + W - R) / 2, H - 4, v.xLabel, "nthview-axislabel"));
          if (v.yLabel) gAx.appendChild(text(6, 11, v.yLabel, "nthview-axislabel", "start"));
          var hits = 0;
          for (var i = 0; i < n; i++) {
            var e = withLocals(env, { i: i, u: U[i], v: V[i], n: G[i] });
            var c = pool[i];
            if (!c) { c = pool[i] = svgEl("circle", { r: "3.4" }); gPts.appendChild(c); }
            c.style.display = "";
            var on = v.highlight !== undefined && ev(v.highlight, e);
            if (on) hits++;
            c.setAttribute("cx", sx(ev(v.x, e)).toFixed(1)); c.setAttribute("cy", sy(ev(v.y, e)).toFixed(1));
            c.setAttribute("fill", hueVar(on ? hh : base)); c.setAttribute("fill-opacity", on ? ".95" : ".55");
          }
          for (var j = n; j < pool.length; j++) pool[j].style.display = "none";
          hl.textContent = hits + " of " + n;
          lastText = (v.title || "Scatter") + ": " + n + " points" + (v.highlight !== undefined ? ", " + hits + " " + (v.highlightLabel || "highlighted") : "");
        },
        text: function () { return lastText; }
      };
    };

    /* ---- shared state machinery for agents and grid ---- */
    function compileRules(v, sIdx, env) {
      return (v.rules || []).map(function (r) {
        return { kind: r.kind, from: sIdx[r.from], to: r.to !== undefined ? sIdx[r.to] : sIdx[r.from], w: r["with"] !== undefined ? sIdx[r["with"]] : -1, chance: Math.max(0, Math.min(1, ev(r.chance, env))), src: r.chance };
      });
    }
    function simChrome(mini, onPlay, onRestart, onNew) {
      var playB = iconBtn("pause", "Pause", onPlay);
      mini.appendChild(playB);
      mini.appendChild(iconBtn("restart", "Restart this run", onRestart));
      mini.appendChild(iconBtn("dice", "New random run", onNew));
      return playB;
    }

    /* ---- agents ---- */
    BUILDERS.agents = function (v, fig, mini, card, o) {
      var W = 400, H = 250, states = v.states, sIdx = {};
      states.forEach(function (s, i) { sIdx[s.id] = i; });
      var canvas = el("canvas", { "aria-hidden": "true" }); canvas.style.aspectRatio = "8 / 5";
      var hist = el("canvas", { "aria-hidden": "true" }); hist.style.aspectRatio = "8 / 1.1"; hist.style.marginTop = ".5rem";
      fig.appendChild(canvas); if (v.history !== false) fig.appendChild(hist);
      var counts = states.map(function () { return el("b"); });
      fig.appendChild(legend(states.map(function (s, i) { return { hue: s.color, label: s.label, value: counts[i] }; })));
      var line = el("p", { class: "nthview-status-line" }); fig.appendChild(line);
      var ctx = canvas.getContext("2d"), hctx = hist.getContext("2d");
      var sim = null, run = 0, playing = !reduceMotion, initKey = "", restartT = null, acc = 0, seen = false;
      whenVisible(card, function () { seen = true; start(); });
      var infectious = {};
      (v.rules || []).forEach(function (r) { if (r.kind === "contact") infectious[sIdx[r["with"]]] = true; });
      var playB = simChrome(mini, function () { playing = !playing; paintPlay(); if (playing) start(); }, function () { build(ENV); playing = true; paintPlay(); start(); }, function () { run++; build(ENV); playing = true; paintPlay(); start(); });
      function paintPlay() { setIcon(playB, playing ? "pause" : "play", playing ? "Pause" : "Play"); }
      paintPlay();
      function params(env) {
        return { speed: v.speed !== undefined ? Math.max(0, Math.min(6, ev(v.speed, env))) : 1.2, radius: v.radius !== undefined ? Math.max(2, Math.min(30, ev(v.radius, env))) : 9, still: v.still !== undefined ? Math.max(0, Math.min(1, ev(v.still, env))) : 0, rules: compileRules(v, sIdx, env) };
      }
      function initial(env) { return states.map(function (s) { return v.initial[s.id] !== undefined ? Math.max(0, Math.round(ev(v.initial[s.id], env))) : 0; }); }
      function build(env) {
        var rnd = mulberry32(o.seed + run * 7919), A = [], init = initial(env), cap = v.max || 400, p = params(env);
        init.forEach(function (c, si) { for (var k = 0; k < c && A.length < cap; k++) A.push({ x: rnd() * W, y: rnd() * H, h: rnd() * Math.PI * 2, s: si, still: false }); });
        var idx = A.map(function (_, i) { return i; });
        for (var i = idx.length - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)), t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
        for (i = 0; i < Math.round(p.still * A.length); i++) A[idx[i]].still = true;
        sim = { A: A, rnd: rnd, p: p, tick: 0, quiet: 0, hist: [], done: false, cap: cap };
        initKey = init.join(",") + "|" + p.still;
        sample(); draw();
      }
      function step() {
        var A = sim.A, p = sim.p, rnd = sim.rnd, cs = Math.max(4, p.radius), grid = {}, R2 = p.radius * p.radius;
        sim.tick++;
        A.forEach(function (a) {
          if (a.still) return;
          a.h += (rnd() - .5) * .7; a.x += Math.cos(a.h) * p.speed; a.y += Math.sin(a.h) * p.speed;
          if (a.x < 0) { a.x = -a.x; a.h = Math.PI - a.h; } if (a.x > W) { a.x = 2 * W - a.x; a.h = Math.PI - a.h; }
          if (a.y < 0) { a.y = -a.y; a.h = -a.h; } if (a.y > H) { a.y = 2 * H - a.y; a.h = -a.h; }
        });
        A.forEach(function (a, i) { var k = Math.floor(a.x / cs) + "," + Math.floor(a.y / cs); (grid[k] || (grid[k] = [])).push(i); });
        var snapS = A.map(function (a) { return a.s; }), changed = 0, born = [];
        A.forEach(function (a, i) {
          for (var r = 0; r < p.rules.length; r++) {
            var ru = p.rules[r];
            if (snapS[i] !== ru.from) continue;
            if (ru.kind === "timer") { if (rnd() < ru.chance) { a.s = ru.to; changed++; break; } }
            else if (ru.kind === "split") { if (A.length + born.length < sim.cap && rnd() < ru.chance) { born.push({ x: a.x, y: a.y, h: rnd() * 6.283, s: ru.to, still: a.still }); changed++; } }
            else {
              var cx = Math.floor(a.x / cs), cy = Math.floor(a.y / cs), hit = 0;
              for (var dx = -1; dx <= 1; dx++) for (var dy = -1; dy <= 1; dy++) {
                var Lst = grid[(cx + dx) + "," + (cy + dy)]; if (!Lst) continue;
                for (var q = 0; q < Lst.length; q++) { var b = A[Lst[q]]; if (Lst[q] !== i && snapS[Lst[q]] === ru.w) { var ddx = b.x - a.x, ddy = b.y - a.y; if (ddx * ddx + ddy * ddy <= R2) hit++; } }
              }
              if (hit && rnd() < 1 - Math.pow(1 - ru.chance, hit)) { a.s = ru.to; changed++; break; }
            }
          }
        });
        born.forEach(function (b) { A.push(b); });
        sim.quiet = changed ? 0 : sim.quiet + 1;
        if (sim.tick % 3 === 0) sample();
        var active = sim.A.some(function (a) { return infectious[a.s]; });
        if (sim.tick >= (v.ticks || 900) || sim.quiet > 240 || (!active && Object.keys(infectious).length && sim.quiet > 30)) sim.done = true;
      }
      function sample() { var c = states.map(function () { return 0; }); sim.A.forEach(function (a) { c[a.s]++; }); sim.hist.push(c); if (sim.hist.length > 400) sim.hist = sim.hist.filter(function (_, i) { return i % 2 === 0; }); sim.counts = c; }
      function draw() {
        if (!sim) return;
        var cw = canvas.width, ch = canvas.height; if (!cw) return;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cw, ch);
        var k = cw / W; ctx.setTransform(k, 0, 0, k, 0, 0);
        var rr = Math.max(2.6, Math.min(4.2, 3.6 * Math.sqrt(220 / Math.max(60, sim.A.length))));
        sim.A.forEach(function (a) {
          var c = color(states[a.s].color);
          if (infectious[a.s]) { ctx.globalAlpha = .22; ctx.fillStyle = c; ctx.beginPath(); ctx.arc(a.x, a.y, sim.p.radius, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }
          ctx.fillStyle = c; ctx.beginPath(); ctx.arc(a.x, a.y, a.still ? rr * .85 : rr, 0, 6.283); ctx.fill();
          if (a.still) { ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(a.x, a.y, rr + 2, 0, 6.283); ctx.stroke(); }
        });
        counts.forEach(function (b, i) { b.textContent = String(sim.counts[i]); });
        if (v.history !== false && hist.width) {
          var hw = hist.width, hh = hist.height, Hs = sim.hist, tot = sim.A.length || 1, span = Math.max(Hs.length, 60);
          hctx.setTransform(1, 0, 0, 1, 0, 0); hctx.clearRect(0, 0, hw, hh);
          for (var t = 0; t < Hs.length; t++) {
            var y0 = hh, xw = hw / span;
            for (var si = states.length - 1; si >= 0; si--) { var hgt = Hs[t][si] / tot * hh; hctx.fillStyle = color(states[si].color); hctx.fillRect(t * xw, y0 - hgt, xw + .6, hgt); y0 -= hgt; }
          }
        }
        line.textContent = (sim.done ? "Settled after " : "Tick ") + sim.tick + (sim.done ? " ticks" : "") + " · run " + (run + 1) + (playing || sim.done ? "" : " · paused");
      }
      canvasFit(canvas, 5 / 8, draw, card); canvasFit(hist, 1.1 / 8, draw, card);
      var looping = false;
      function start() {
        if (looping || !sim || sim.done || !seen) { draw(); return; }
        looping = true;
        addTask(card, function (dt) {
          if (!playing || !sim || sim.done) { looping = false; draw(); return false; }
          acc += dt * 75; var n = Math.min(5, Math.floor(acc)); acc -= n;
          for (var i = 0; i < n && !sim.done; i++) step();
          draw();
        });
      }
      return {
        update: function (env) {
          var p = params(env), init = initial(env), key = init.join(",") + "|" + p.still;
          if (!sim) { build(env); start(); return; }
          sim.p.speed = p.speed; sim.p.radius = p.radius; sim.p.rules = p.rules;
          if (key !== initKey) {
            clearTimeout(restartT);
            restartT = setTimeout(function () { if (!card.isConnected) return; build(ENV); start(); }, 280);
          }
        },
        text: function () { return (v.title || "Simulation") + ", tick " + (sim ? sim.tick : 0) + ": " + states.map(function (s, i) { return s.label + " " + (sim && sim.counts ? sim.counts[i] : 0); }).join(", "); }
      };
    };

    /* ---- grid ---- */
    BUILDERS.grid = function (v, fig, mini, card, o) {
      var rows = v.rows, cols = v.cols, states = v.states, sIdx = {}, nb = v.neighbors || 8;
      states.forEach(function (s, i) { sIdx[s.id] = i; });
      var canvas = el("canvas", { "aria-hidden": "true" }); canvas.style.aspectRatio = cols + " / " + rows;
      if (cols / rows < 1.2) canvas.style.maxWidth = "28rem";
      fig.appendChild(canvas);
      var counts = states.map(function () { return el("b"); });
      fig.appendChild(legend(states.map(function (s, i) { return { hue: s.color, label: s.label, value: counts[i] }; })));
      var line = el("p", { class: "nthview-status-line" }); fig.appendChild(line);
      var ctx = canvas.getContext("2d"), hasRules = !!(v.rules && v.rules.length);
      var seen = false;
      whenVisible(card, function () { seen = true; start(); });
      var quiet = 0, cells = null, gen = 0, done = false, run = 0, playing = !reduceMotion, key = "", restartT = null, acc = 0, rules = [];
      var playB = hasRules ? simChrome(mini, function () { playing = !playing; paint(); if (playing) start(); }, function () { build(ENV); playing = true; paint(); start(); }, function () { run++; build(ENV); playing = true; paint(); start(); }) : null;
      function paint() { if (playB) setIcon(playB, playing ? "pause" : "play", playing ? "Pause" : "Play"); }
      paint();
      function seedCells(env) {
        var rnd = mulberry32(o.seed + run * 7919), out = new Array(rows * cols);
        for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
          var i = r * cols + c, e = withLocals(env, { row: r, col: c, rows: rows, cols: cols, i: i, u: rnd() });
          out[i] = Math.max(0, Math.min(states.length - 1, Math.round(ev(v.cell, e))));
        }
        return out;
      }
      function build(env) { cells = seedCells(env); key = cells.join(""); gen = 0; quiet = 0; done = !hasRules; rules = compileRules(v, sIdx, env); count(); draw(); }
      var rndStep = null;
      function step() {
        if (!rndStep) rndStep = mulberry32(o.seed + run * 7919 + 1);
        var s = cells.slice(), changed = 0;
        for (var i = 0; i < s.length; i++) {
          var r0 = Math.floor(i / cols), c0 = i % cols;
          for (var q = 0; q < rules.length; q++) {
            var ru = rules[q];
            if (s[i] !== ru.from) continue;
            if (ru.kind === "timer") { if (rndStep() < ru.chance) { cells[i] = ru.to; changed++; break; } }
            else {
              var hit = 0;
              for (var dr = -1; dr <= 1; dr++) for (var dc = -1; dc <= 1; dc++) {
                if (!dr && !dc) continue; if (nb === 4 && dr && dc) continue;
                var rr = r0 + dr, cc = c0 + dc;
                if (rr < 0 || cc < 0 || rr >= rows || cc >= cols) continue;
                if (s[rr * cols + cc] === ru.w) hit++;
              }
              if (hit && rndStep() < 1 - Math.pow(1 - ru.chance, hit)) { cells[i] = ru.to; changed++; break; }
            }
          }
        }
        gen++;
        quiet = changed ? 0 : quiet + 1;
        if (quiet >= 10) done = true;
        if (gen >= (v.ticks || 160)) done = true;
        count();
      }
      var tally = [];
      function count() { tally = states.map(function () { return 0; }); cells.forEach(function (x) { tally[x]++; }); }
      function draw() {
        if (!cells || !canvas.width) return;
        var cw = canvas.width, ch = canvas.height, w = cw / cols, h = ch / rows, gap = Math.max(1, w * .12);
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cw, ch);
        var cache = states.map(function (s) { return color(s.color); });
        for (var i = 0; i < cells.length; i++) { ctx.fillStyle = cache[cells[i]]; ctx.fillRect((i % cols) * w + gap / 2, Math.floor(i / cols) * h + gap / 2, w - gap, h - gap); }
        counts.forEach(function (b, i) { b.textContent = String(tally[i]); });
        line.textContent = hasRules ? (done ? "Settled after " + gen + " generations" : "Generation " + gen) + " · run " + (run + 1) + (playing || done ? "" : " · paused") : rows + " × " + cols + " cells";
      }
      canvasFit(canvas, rows / cols, draw, card);
      var looping = false;
      function start() {
        if (!hasRules || looping || done || !seen) { draw(); return; }
        looping = true;
        addTask(card, function (dt) {
          if (!playing || done) { looping = false; draw(); return false; }
          acc += dt * (v.speed || 10); var n = Math.min(3, Math.floor(acc)); acc -= n;
          for (var i = 0; i < n && !done; i++) step();
          draw();
        });
      }
      return {
        update: function (env) {
          if (!cells) { build(env); start(); return; }
          rules = compileRules(v, sIdx, env);
          var fresh = seedCells(env).join("");
          if (fresh === key) return;
          if (!hasRules) { build(env); return; }
          clearTimeout(restartT);
          restartT = setTimeout(function () { if (!card.isConnected) return; rndStep = null; build(ENV); start(); }, 280);
        },
        text: function () { return (v.title || "Cell field") + ": " + states.map(function (s, i) { return s.label + " " + (tally[i] || 0); }).join(", ") + " of " + rows * cols + " cells"; }
      };
    };

    /* ---- gauge ---- */
    BUILDERS.gauge = function (v, fig) {
      var s = svgRoot("0 0 200 136"), cx = 100, cy = 100, r = 78;
      s.style.maxWidth = "24rem"; s.style.margin = "0 auto";
      var gZones = svgEl("g"); s.appendChild(gZones);
      var track = svgEl("path", { d: arc(0, 1), fill: "none", stroke: "var(--line)", "stroke-width": "14", "stroke-linecap": "round" });
      s.insertBefore(track, gZones);
      var needle = svgEl("g", { class: "nthview-needle" });
      needle.appendChild(svgEl("path", { d: "M100 100 L100 30", stroke: "var(--ink)", "stroke-width": "3.2", "stroke-linecap": "round" }));
      needle.appendChild(svgEl("circle", { cx: "100", cy: "100", r: "7", fill: "var(--ink)" }));
      needle.appendChild(svgEl("circle", { cx: "100", cy: "100", r: "3", fill: "var(--surface-2)" }));
      s.appendChild(needle);
      var val = svgEl("text", { x: "100", y: "133", "text-anchor": "middle", class: "nthview-gauge-value" });
      var lo = svgEl("text", { x: "18", y: "118", "text-anchor": "middle", class: "nthview-tick" }), hi = svgEl("text", { x: "182", y: "118", "text-anchor": "middle", class: "nthview-tick" });
      s.appendChild(val); s.appendChild(lo); s.appendChild(hi);
      fig.appendChild(s);
      var zoneLine = el("p", { style: "text-align:center;margin:.3rem 0 0;font-weight:800" });
      fig.appendChild(zoneLine);
      if (v.label) fig.appendChild(el("p", { class: "nthview-muted nthview-small", style: "text-align:center;margin:0", text: v.label }));
      function pt(k) { var a = Math.PI * (1 - k); return [cx + r * Math.cos(a), cy - r * Math.sin(a)]; }
      function arc(k0, k1) { var a = pt(k0), b = pt(k1); return "M" + a[0].toFixed(2) + " " + a[1].toFixed(2) + " A" + r + " " + r + " 0 0 1 " + b[0].toFixed(2) + " " + b[1].toFixed(2); }
      var lastZone = "";
      return {
        update: function (env) {
          var mn = v.min !== undefined ? ev(v.min, env) : 0, mx = ev(v.max, env); if (mx <= mn) mx = mn + 1;
          var x = ev(v.value, env), k = Math.max(0, Math.min(1, (x - mn) / (mx - mn)));
          gZones.textContent = "";
          var prev = mn, zone = null;
          (v.zones || []).forEach(function (z, i) {
            var a = Math.max(0, Math.min(1, (prev - mn) / (mx - mn))), b = i === v.zones.length - 1 ? 1 : Math.max(0, Math.min(1, (z.to - mn) / (mx - mn)));
            if (b > a) gZones.appendChild(svgEl("path", { d: arc(a, b), fill: "none", stroke: hueVar(z.color), "stroke-width": "14", "stroke-opacity": ".9" }));
            if (!zone && (x <= z.to || i === v.zones.length - 1)) zone = z;
            prev = z.to;
          });
          needle.style.transform = "rotate(" + (k * 180 - 90) + "deg)";
          val.textContent = fmtV(v, x); lo.textContent = fmtV(v, mn); hi.textContent = fmtV(v, mx);
          zoneLine.textContent = zone ? zone.label : ""; zoneLine.style.color = zone ? hueVar(zone.color) : "";
          lastZone = zone ? zone.label : "";
        },
        text: function (env) { return (v.title || v.label || "Gauge") + ": " + fmtV(v, ev(v.value, env)) + (lastZone ? ", " + lastZone : ""); }
      };
    };

    /* ---- number readout ---- */
    BUILDERS.number = function (v, fig) {
      var items = v.items.map(function (it) {
        var b = el("b"); if (it.color) b.style.color = hueVar(it.color);
        fig.appendChild(el("div", { class: "nthview-num" }, [b, el("span", { text: it.label })]));
        return { it: it, b: b };
      });
      fig.className += " nthview-numbers";
      function f(it, x) { return fmt(x, it.format || v.format, it.prefix !== undefined ? it.prefix : v.prefix, it.unit !== undefined ? it.unit : v.unit); }
      return {
        update: function (env) { items.forEach(function (x) { var t = f(x.it, ev(x.it.value, env)); x.b.textContent = t; x.b.className = t.length > 9 ? "nthview-long" : ""; }); },
        text: function (env) { return items.map(function (x) { return x.it.label + ": " + f(x.it, ev(x.it.value, env)); }).join(", "); }
      };
    };

    /* ---- stack ---- */
    BUILDERS.stack = function (v, fig) {
      var parts = v.parts.map(function (p, i) { return { p: p, hue: p.color || SERIES[i % SERIES.length], value: el("b") }; });
      var donut = v.shape === "donut", segs = [], circ = 2 * Math.PI * 52, center = null;
      if (donut) {
        var s = svgRoot("0 0 140 140"); s.style.maxWidth = "13rem"; s.style.margin = "0 auto";
        s.appendChild(svgEl("circle", { cx: "70", cy: "70", r: "52", fill: "none", stroke: "var(--line)", "stroke-width": "20" }));
        segs = parts.map(function (pt) { var c = svgEl("circle", { cx: "70", cy: "70", r: "52", fill: "none", stroke: hueVar(pt.hue), "stroke-width": "20", transform: "rotate(-90 70 70)", class: "nthview-donut-arc" }); s.appendChild(c); return c; });
        center = svgEl("text", { x: "70", y: "76", "text-anchor": "middle", class: "nthview-gauge-value" }); s.appendChild(center);
        fig.appendChild(s);
      } else {
        var bar = el("div", { class: "nthview-stackbar" });
        segs = parts.map(function (pt) { var d = el("div", { class: "nthview-stackseg" }); d.style.background = hueVar(pt.hue); bar.appendChild(d); return d; });
        fig.appendChild(bar);
      }
      fig.appendChild(legend(parts.map(function (pt) { return { hue: pt.hue, label: pt.p.label, value: pt.value }; })));
      return {
        update: function (env) {
          var vals = parts.map(function (pt) { return Math.max(0, ev(pt.p.value, env)); }), tot = vals.reduce(function (a, b) { return a + b; }, 0) || 1, acc = 0;
          parts.forEach(function (pt, i) {
            var share = vals[i] / tot;
            pt.value.textContent = Math.abs(tot - 1) < 1e-6 ? fmtV(v, vals[i]) : fmtV(v, vals[i]) + " · " + fmt(share, "pct");
            if (donut) { segs[i].setAttribute("stroke-dasharray", (share * circ).toFixed(2) + " " + circ.toFixed(2)); segs[i].setAttribute("stroke-dashoffset", (-acc * circ).toFixed(2)); }
            else { segs[i].style.width = (share * 100) + "%"; segs[i].textContent = share > .12 ? fmt(share, "pct") : ""; }
            acc += share;
          });
          if (center) center.textContent = fmt(vals[0] / tot, "pct");
        },
        text: function (env) { var vals = parts.map(function (pt) { return Math.max(0, ev(pt.p.value, env)); }), tot = vals.reduce(function (a, b) { return a + b; }, 0) || 1; return (v.title || "Proportions") + ": " + parts.map(function (pt, i) { return pt.p.label + " " + fmt(vals[i] / tot, "pct"); }).join(", "); }
      };
    };

    /* ---- flow ---- */
    BUILDERS.flow = function (v, fig, mini, card) {
      var box = el("div", { class: "nthview-flow" });
      var stages = v.stages.map(function (s, i) {
        var hue = s.color || SERIES[i % SERIES.length], b = el("b");
        var n = el("div", { class: "nthview-stagebox" }, [el("span", { text: s.label }), b]); n.style.color = hueVar(hue);
        return { s: s, b: b, node: n, hue: hue };
      });
      var pipes = v.links.map(function (l, i) {
        var bar = el("i"), em = el("em");
        var nodeP = el("div", { class: "nthview-pipe" }, [bar, em]);
        return { l: l, bar: bar, em: em, node: nodeP, off: 0, speed: 0, hue: stages[i + 1].hue };
      });
      stages.forEach(function (st, i) { box.appendChild(st.node); if (pipes[i]) box.appendChild(pipes[i].node); });
      fig.appendChild(box);
      var colMode = false;
      function layout() { var w = fig.clientWidth || 400; var c = w < stages.length * 96 + (stages.length - 1) * 48; if (c !== colMode) { colMode = c; box.classList.toggle("nthview-col", c); } }
      if (root.ResizeObserver) { var ro = new root.ResizeObserver(function () { if (!card.isConnected) { ro.disconnect(); return; } layout(); }); ro.observe(fig); }
      setTimeout(layout, 0);
      var looping = false;
      function paintPipe(p) {
        var g = p.size;
        p.bar.style.backgroundImage = "radial-gradient(circle," + hueVar(p.hue) + " " + (g * .32) + "px,transparent " + (g * .36) + "px)";
        p.bar.style.backgroundSize = colMode ? "10px " + g + "px" : g + "px 10px";
        p.bar.style.backgroundPosition = colMode ? "0 " + p.off + "px" : p.off + "px 0";
      }
      function animate() {
        if (looping || reduceMotion) return;
        looping = true;
        addTask(card, function (dt) { pipes.forEach(function (p) { p.off = (p.off + p.speed * dt) % 1000; paintPipe(p); }); });
      }
      return {
        update: function (env) {
          stages.forEach(function (st) { st.b.textContent = fmtV(v, ev(st.s.value, env)); });
          var rates = pipes.map(function (p) { return Math.max(0, ev(p.l.rate, env)); });
          var mr = v.maxRate !== undefined ? ev(v.maxRate, env) : Math.max.apply(null, rates.concat([1e-9]));
          pipes.forEach(function (p, i) {
            var k = mr > 0 ? Math.max(0, Math.min(1, rates[i] / mr)) : 0;
            p.speed = 12 + 90 * k; p.size = 22 - 10 * k; if (rates[i] <= 0) p.speed = 0;
            p.bar.style.opacity = String(.25 + .75 * k);
            p.em.textContent = (p.l.label ? p.l.label + " " : "") + fmt(rates[i], v.format === "pct" || v.format === "pct1" ? "dp2" : v.format);
            paintPipe(p);
          });
          animate();
        },
        text: function (env) { return (v.title || "Flow") + ": " + stages.map(function (st) { return st.s.label + " " + fmtV(v, ev(st.s.value, env)); }).join(" → "); }
      };
    };

    /* ---- timeline ---- */
    BUILDERS.timeline = function (v, fig, mini, card) {
      var strip = el("div", { class: "nthview-strip", "aria-hidden": "true" });
      var stageBox = el("div", { class: "nthview-tl-stage", "aria-hidden": "true" });
      var narr = el("p", { class: "nthview-tl-narr", "aria-live": "off" });
      var scrub = el("input", { type: "range", class: "nthview-range", min: "0", max: "1", step: "1", value: "0", "aria-label": "Frame" });
      var hue = v.color || "accent";
      var playB = iconBtn("play", "Play", function () { if (playing) { playing = false; paintPlay(); } else { if (cur >= n - 1) setFrame(0); playing = true; paintPlay(); loop2(); } });
      var prevB = iconBtn("prev", "Previous frame", function () { playing = false; paintPlay(); setFrame(cur - 1); });
      var nextB = iconBtn("next", "Next frame", function () { playing = false; paintPlay(); setFrame(cur + 1); });
      fig.appendChild(strip); fig.appendChild(stageBox); fig.appendChild(narr);
      fig.appendChild(el("div", { class: "nthview-tl-ctrl" }, [prevB, playB, nextB, scrub]));
      var dotEls = [], moreEl = null;
      var n = 2, values = [], cur = 0, playing = v.autoplay !== false && !reduceMotion, t = 0, cells = [], dots = 0, env0 = null, started = false;
      function paintPlay() { setIcon(playB, playing ? "pause" : "play", playing ? "Pause replay" : "Play replay"); }
      paintPlay();
      scrub.addEventListener("input", function () { playing = false; paintPlay(); setFrame(parseInt(scrub.value, 10)); });
      var labelLive = [];
      function narrate() {
        narr.textContent = "";
        labelLive = [];
        narr.appendChild(rich(v.label, labelLive));
        var e = withLocals(env0, { k: cur, value: values[cur] });
        labelLive.forEach(function (f) { f(e); });
      }
      function setFrame(k) {
        cur = Math.max(0, Math.min(n - 1, k)); scrub.value = String(cur);
        scrub.setAttribute("aria-valuetext", "Frame " + (cur + 1) + " of " + n + ": " + fmtV(v, values[cur]));
        scrub.style.setProperty("--p", (n > 1 ? cur / (n - 1) * 100 : 0) + "%");
        cells.forEach(function (c, i) { c.node.className = "nthview-frame-cell" + (i === cur ? " nthview-current" : i > cur ? " nthview-future" : ""); });
        var want = Math.max(0, Math.round(values[cur])), cap = 240, show = Math.min(cap, want);
        var size = show > 160 ? 7 : show > 80 ? 9 : show > 30 ? 11 : 14;
        if (v.display === "bars") {
          stageBox.textContent = ""; dots = -1;
          var mx = Math.max.apply(null, values.map(Math.abs).concat([1e-9]));
          var barsW = el("div", { style: "display:flex;align-items:flex-end;gap:4px;width:100%;height:6.3rem" });
          values.forEach(function (x, i) { var b = el("div", { style: "flex:1;border-radius:4px 4px 2px 2px;transition:height .35s ease,opacity .3s;min-height:2px" }); b.style.height = Math.max(0, x / mx * 100) + "%"; b.style.background = hueVar(hue); b.style.opacity = i <= cur ? (i === cur ? "1" : ".55") : ".15"; barsW.appendChild(b); });
          stageBox.appendChild(barsW);
        } else {
          if (dots < 0) { stageBox.textContent = ""; dotEls = []; dots = 0; }
          if (moreEl && moreEl.parentNode) moreEl.parentNode.removeChild(moreEl);
          while (dotEls.length > show) stageBox.removeChild(dotEls.pop());
          for (var i = dotEls.length; i < show; i++) { var d = el("span", { class: "nthview-tl-dot" }); d.style.background = hueVar(hue); d.style.setProperty("--d", String((i - dots) % 60)); stageBox.appendChild(d); dotEls.push(d); }
          dots = show;
          stageBox.style.setProperty("--s", size + "px");
          moreEl = want > cap ? el("span", { class: "nthview-tl-more", text: "+ " + fmt(want - cap, "compact") + " more" }) : !show ? el("span", { class: "nthview-tl-more", text: "none" }) : null;
          if (moreEl) stageBox.appendChild(moreEl);
        }
        narrate();
      }
      function loop2() {
        addTask(card, function (dt) {
          if (!playing) return false;
          t += dt * 1000;
          if (t >= (v.frameMs || 700)) { t = 0; if (cur >= n - 1) { playing = false; paintPlay(); return false; } setFrame(cur + 1); }
        });
      }
      return {
        update: function (env) {
          env0 = env;
          var nn = Math.max(2, Math.min(40, Math.round(ev(v.frames, env))));
          values = []; for (var k = 0; k < nn; k++) values.push(ev(v.value, withLocals(env, { k: k })));
          var mx = Math.max.apply(null, values.map(Math.abs).concat([1e-9]));
          if (nn !== n || !cells.length) {
            n = nn; scrub.max = String(n - 1); strip.textContent = ""; cells = [];
            for (k = 0; k < n; k++) { var fill = el("i"); fill.style.background = hueVar(hue); var bb = el("b"); var c = el("div", { class: "nthview-frame-cell" }, [fill, el("span", { text: String(k) }), bb]); strip.appendChild(c); cells.push({ node: c, fill: fill, b: bb }); }
          }
          cells.forEach(function (c, i) { c.b.textContent = fmt(values[i], "compact"); c.fill.style.height = Math.max(0, values[i] / mx * 100) + "%"; });
          if (!started) { started = true; setFrame(playing ? 0 : n - 1); if (playing) whenVisible(card, function () { setTimeout(function () { if (card.isConnected && playing) loop2(); }, 300); }); }
          else setFrame(Math.min(cur, n - 1));
        },
        text: function () { return (v.title || "Replay") + ": " + values.map(function (x, i) { return i + ": " + fmtV(v, x); }).join(", "); }
      };
    };

    /* ---- compare ---- */
    BUILDERS.compare = function (v, fig) {
      var grid = el("div", { class: "nthview-cmp" });
      var heads = v.scenarios.map(function (sc, i) {
        var hue = sc.color || SERIES[i];
        var h = el("div", { class: "nthview-cmp-head" }, [el("i", { style: "width:.65rem;height:.65rem;border-radius:50%;flex:none;background:" + hueVar(hue) }), el("span", { text: sc.label })]);
        h.style.color = hueVar(hue); grid.appendChild(h); return hue;
      });
      var rows = v.metrics.map(function (mt) {
        var ratio = el("em"), cells = [0, 1].map(function (i) { var b = el("b"), bar = el("i"); bar.style.background = hueVar(heads[i]); return { b: b, bar: bar, node: el("div", { class: "nthview-mcell" }, [b, bar]) }; });
        var lab = el("p", {}, [el("span", { text: mt.label }), ratio]);
        grid.appendChild(el("div", { class: "nthview-metric" }, [lab, cells[0].node, cells[1].node]));
        return { mt: mt, cells: cells, ratio: ratio };
      });
      fig.appendChild(grid);
      function f(mt, x) { return fmt(x, mt.format || v.format, mt.prefix !== undefined ? mt.prefix : v.prefix, mt.unit !== undefined ? mt.unit : v.unit); }
      var lastText = "";
      return {
        update: function (env) {
          var envs = v.scenarios.map(function (sc) { return computeEnv(targetsFor(sc.set, env)); });
          var parts = [];
          rows.forEach(function (r) {
            var a = ev(r.mt.value, envs[0]), b = ev(r.mt.value, envs[1]), mx = Math.max(Math.abs(a), Math.abs(b), 1e-12);
            [a, b].forEach(function (x, i) {
              var c = r.cells[i]; c.b.textContent = f(r.mt, x); c.bar.style.width = Math.abs(x) / mx * 100 + "%";
              var win = r.mt.better && a !== b && ((r.mt.better === "higher") === (x === Math.max(a, b)));
              if (win) c.b.appendChild(el("span", { class: "nthview-win", text: "better" }));
            });
            var lo = Math.min(Math.abs(a), Math.abs(b)), hi = Math.max(Math.abs(a), Math.abs(b));
            var B = v.scenarios[1].label;
            r.ratio.textContent = lo > 1e-12 && hi / lo >= 1.05 ? B + ": " + fmt(hi / lo, "times") + " " + (Math.abs(b) > Math.abs(a) ? "higher" : "lower") : lo <= 1e-12 && hi > 0 ? "zero in " + (Math.abs(b) > Math.abs(a) ? v.scenarios[0].label : B) : "about equal";
            parts.push(r.mt.label + ": " + v.scenarios[0].label + " " + f(r.mt, a) + ", " + v.scenarios[1].label + " " + f(r.mt, b));
          });
          lastText = (v.title || "Comparison") + ". " + parts.join(". ");
        },
        text: function () { return lastText; }
      };
    };

    /* =====================================================================
       Controls
       ===================================================================== */
    function controlNode(c, ctlState, owner) {
      var v = c.kind === "button" ? null : VAR[c["var"]];
      var label = c.label || (v ? v.label : "");
      var box = el("div", { class: "nthview-ctl" });
      var uid = "nthview-c-" + Math.random().toString(36).slice(2, 8);
      var inputs = [];
      function topRow(outEl, asLabel) {
        var lab = asLabel ? el("label", { for: uid, text: label }) : el("span", { id: uid + "-l", text: label });
        return el("div", { class: "nthview-ctl-top" }, outEl ? [lab, outEl] : [lab]);
      }
      function set(x) { var o = {}; o[v.id] = x; setVars(o); }
      if (c.kind === "slider" || c.kind === "play") {
        var out = el("output", { for: uid });
        var range = el("input", { type: "range", class: "nthview-range", id: uid, min: String(v.min), max: String(v.max), step: String(stepOf(v)) });
        range.addEventListener("input", function () { if (c.kind === "play") stopPlay(); set(parseFloat(range.value)); });
        inputs.push(range);
        box.appendChild(topRow(out, true));
        if (c.kind === "play") {
          var playing = false;
          var pb = iconBtn("play", "Play " + label, function () { if (playing) stopPlay(); else startPlay(); });
          inputs.push(pb);
          var stopPlay = function () { playing = false; setIcon(pb, "play", "Play " + label); };
          var startPlay = function () {
            playing = true; setIcon(pb, "pause", "Pause " + label);
            if (vars[v.id] >= v.max - 1e-9) set(v.min);
            var dur = (c.duration || 6) * 1000;
            addTask(owner, function (dt) {
              if (!playing) return false;
              var x = vars[v.id] + (v.max - v.min) * dt * 1000 / dur;
              if (x >= v.max) { if (c.loop) x = v.min; else { set(v.max); stopPlay(); return false; } }
              set(x);
            });
          };
          if (reduceMotion) pb.setAttribute("title", "Play " + label + " (instant under reduced motion)");
          box.appendChild(el("div", { class: "nthview-playrow" }, [pb, range]));
        } else box.appendChild(range);
        box.appendChild(el("div", { class: "nthview-ends", "aria-hidden": "true" }, [el("span", { text: fmtV(v, v.min) }), el("span", { text: fmtV(v, v.max) })]));
        watch(function (env) { var x = env[v.id]; out.textContent = fmtV(v, x); range.value = String(x); range.setAttribute("aria-valuetext", fmtV(v, x)); range.style.setProperty("--p", ((x - v.min) / (v.max - v.min) * 100) + "%"); });
      } else if (c.kind === "stepper") {
        var o2 = el("output", { "aria-live": "polite" });
        var minus = el("button", { type: "button", class: "nthview-sbtn", "aria-label": "Decrease " + label, text: "−" });
        var plus = el("button", { type: "button", class: "nthview-sbtn", "aria-label": "Increase " + label, text: "+" });
        minus.addEventListener("click", function () { set(snap(v, vars[v.id] - stepOf(v))); });
        plus.addEventListener("click", function () { set(snap(v, vars[v.id] + stepOf(v))); });
        inputs.push(minus, plus);
        box.appendChild(topRow(null, false));
        box.appendChild(el("div", { class: "nthview-stepper", role: "group", "aria-labelledby": uid + "-l" }, [minus, o2, plus]));
        watch(function (env) { var x = env[v.id]; o2.textContent = fmtV(v, x); minus.disabled = ctlState.locked || x <= v.min + 1e-9; plus.disabled = ctlState.locked || x >= v.max - 1e-9; });
      } else if (c.kind === "toggle") {
        var sw = el("button", { type: "button", class: "nthview-switch", role: "switch", "aria-checked": "false" }, [el("span", { text: label }), el("i", { "aria-hidden": "true" })]);
        sw.addEventListener("click", function () { set(vars[v.id] > (v.min + v.max) / 2 ? v.min : v.max); });
        inputs.push(sw); box.appendChild(sw);
        watch(function (env) { sw.setAttribute("aria-checked", String(env[v.id] > (v.min + v.max) / 2)); });
      } else if (c.kind === "choice") {
        box.appendChild(topRow(null, false));
        var group = el("div", { class: "nthview-seg-group", role: "radiogroup", "aria-labelledby": uid + "-l" });
        var opts = c.options.map(function (op, i) {
          var b = el("button", { type: "button", class: "nthview-choice", role: "radio", "aria-checked": "false", tabindex: "-1", text: op.label });
          b.addEventListener("click", function () { set(op.value); });
          b.addEventListener("keydown", function (e) {
            var d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
            if (!d) return; e.preventDefault(); e.stopPropagation();
            var j = (i + d + c.options.length) % c.options.length; set(c.options[j].value); opts[j].focus();
          });
          group.appendChild(b); inputs.push(b); return b;
        });
        box.appendChild(group);
        watch(function (env) {
          var x = env[v.id], best = -1, bd = Infinity;
          c.options.forEach(function (op, i) { var d = Math.abs(op.value - x); if (d < bd) { bd = d; best = i; } });
          opts.forEach(function (b, i) { var on = i === best && bd < 1e-6; b.setAttribute("aria-checked", String(on)); b.setAttribute("tabindex", (on || (bd >= 1e-6 && i === 0)) ? "0" : "-1"); });
        });
      } else if (c.kind === "button") {
        var b2 = btn(c.label, "nthview-small-btn", function () { tween(owner, targetsFor(c.set, ENV), 450); }, "spark");
        inputs.push(b2); box.appendChild(b2);
      }
      return { node: box, inputs: inputs };
    }

    /* =====================================================================
       Screens
       ===================================================================== */
    var screen = null, current = -2, record = {};
    STEPS.forEach(function (s) { record[s.id] = { visited: false, vars: null, pick: -1, revealed: false, skipped: false, solved: false }; });

    function show(node, focusEl, dir) {
      var old = screen; screen = node;
      node.classList.add("nthview-screen", "nthview-enter");
      if (dir) node.classList.add(dir > 0 ? "nthview-fromright" : "nthview-fromleft");
      stage.appendChild(node);
      if (old) {
        old.classList.add("nthview-leave"); old.setAttribute("aria-hidden", "true");
        setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, reduceMotion ? 0 : 460);
      }
      void node.offsetWidth;
      setTimeout(function () {
        node.classList.remove("nthview-enter", "nthview-fromright", "nthview-fromleft");
        if (focusEl) focusEl.focus({ preventScroll: true });
        var y = container.getBoundingClientRect().top + root.scrollY;
        if (root.scrollY > y + 10) root.scrollTo({ top: Math.max(0, y), behavior: reduceMotion ? "auto" : "smooth" });
      }, 30);
    }
    function paintRail() {
      segs.forEach(function (b, i) {
        var r = record[STEPS[i].id];
        b.className = "nthview-seg" + (i === current ? " nthview-now" : r.visited ? " nthview-done" : "") + (r.revealed && !r.skipped && r.pick >= 0 && STEPS[i].predict.options[r.pick].correct ? " nthview-hit" : "");
        if (i === current) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
      });
      railText.textContent = current >= 0 && current < N ? (current + 1) + "/" + N : current < 0 ? "intro" : "done";
    }

    function go(i) {
      closePop(); closeGlossary();
      if (current >= 0 && current < N) record[STEPS[current].id].vars = Object.assign({}, vars);
      var dir = i > current ? 1 : -1;
      current = i; subs = []; scrubbers = [];
      var scr = i < 0 ? introScreen() : i >= N ? wrapScreen() : stepScreen(i);
      paintRail();
      show(scr.node, scr.focus, dir);
      notify();
    }

    /* ---------- intro ---------- */
    function emblem() {
      var s = svgRoot("0 0 300 300");
      s.appendChild(svgEl("circle", { cx: "150", cy: "150", r: "128", fill: "none", stroke: "var(--line)", "stroke-width": "1.5" }));
      s.appendChild(svgEl("circle", { cx: "150", cy: "150", r: "92", fill: "none", stroke: "var(--line)", "stroke-width": "1.5", "stroke-dasharray": "3 6" }));
      s.appendChild(svgEl("circle", { cx: "150", cy: "150", r: "54", fill: "none", stroke: "var(--line)", "stroke-width": "1.5" }));
      [[128, "nthview-o1", 7, "var(--accent)"], [92, "nthview-o2", 5, "var(--accent-2)"], [54, "nthview-o3", 4.5, "var(--h-pink)"]].forEach(function (o, k) {
        var g = svgEl("g", { class: "nthview-orbit " + o[1] });
        for (var j = 0; j < 3 + k; j++) { var a = j / (3 + k) * Math.PI * 2 + k; g.appendChild(svgEl("circle", { cx: (150 + o[0] * Math.cos(a)).toFixed(1), cy: (150 + o[0] * Math.sin(a)).toFixed(1), r: String(o[2] - j * .6), fill: o[3], opacity: String(1 - j * .15) })); }
        s.appendChild(g);
      });
      var core = svgEl("path", { d: "M110 190 C130 120 150 180 170 130 S200 100 196 110", fill: "none", stroke: "var(--accent)", "stroke-width": "6", "stroke-linecap": "round" });
      s.appendChild(svgEl("circle", { cx: "150", cy: "150", r: "34", fill: "color-mix(in srgb,var(--accent) 18%,transparent)" }));
      s.appendChild(core);
      return el("div", { class: "nthview-emblem", "aria-hidden": "true" }, [s]);
    }
    function introScreen() {
      var s = el("section", { "aria-label": "Introduction" });
      var hero = el("div", { class: "nthview-hero" });
      var left = el("div");
      left.appendChild(rise(el("p", { class: "nthview-eyebrow", text: data.intro.kicker || "Explorable explanation" }), 0));
      var h1 = el("h1", { text: data.title, tabindex: "-1" }); left.appendChild(rise(h1, 1));
      if (data.subtitle) left.appendChild(rise(para(data.subtitle, null, "nthview-lede"), 2));
      var go1 = btn("Start exploring", "nthview-primary", function () { go(0); }, "next");
      go1.style.marginLeft = "0";
      left.appendChild(rise(el("div", { class: "nthview-nav", style: "border:0;padding:0;margin-top:1rem" }, [go1]), 3));
      left.appendChild(rise(el("p", { class: "nthview-hintkeys" }, [doc.createTextNode(N + " steps. Each one asks you to predict, then lets you play with a live model. Keys: "), el("kbd", { text: "←" }), doc.createTextNode(" "), el("kbd", { text: "→" }), doc.createTextNode(" move between steps, "), el("kbd", { text: "1" }), doc.createTextNode("–"), el("kbd", { text: String(Math.min(5, maxOpts())) }), doc.createTextNode(" pick a prediction.")]), 4));
      hero.appendChild(left); hero.appendChild(rise(emblem(), 2));
      s.appendChild(hero);
      var card = el("div", { class: "nthview-card" });
      if (data.intro.question) { card.appendChild(el("p", { class: "nthview-label", text: "The question" })); var q = el("p", { class: "nthview-bigq" }); q.appendChild(rich(data.intro.question, null)); card.appendChild(q); }
      data.intro.body.forEach(function (t) { card.appendChild(para(t, null)); });
      s.appendChild(rise(card, 5));
      var list = el("ol", { class: "nthview-steplist", "aria-label": "Steps" });
      STEPS.forEach(function (st, i) {
        var b = el("button", { type: "button", class: "nthview-stepcard" }, [el("span", { class: "nthview-stepnum", text: String(i + 1) }), el("div", {}, [el("b", { text: st.title }), el("span", { text: st.kicker || (st.visuals.length + " live view" + (st.visuals.length > 1 ? "s" : "")) })])]);
        b.addEventListener("click", function () { go(i); });
        list.appendChild(rise(el("li", {}, [b]), 6 + i));
      });
      s.appendChild(el("p", { class: "nthview-label", style: "margin-top:1.2rem", text: "The lab bench" }));
      s.appendChild(list);
      VARS.forEach(function (v) { vars[v.id] = v["default"]; });
      return { node: s, focus: h1 };
    }
    function maxOpts() { var m = 2; STEPS.forEach(function (s) { if (s.predict) m = Math.max(m, s.predict.options.length); }); return m; }

    /* ---------- step ---------- */
    var keyPick = null;
    function stepScreen(i) {
      var st = STEPS[i], rec = record[st.id], pr = st.predict;
      /* model state: restore what the learner left, or start fresh */
      var fresh = defaults(st.start);
      Object.keys(fresh).forEach(function (k) { vars[k] = rec.vars ? rec.vars[k] : fresh[k]; });
      rec.visited = true;
      var s = el("section", { class: "nthview-step", "aria-label": "Step " + (i + 1) + " of " + N + ": " + st.title });
      var colS = el("div", { class: "nthview-colstory" }), colB = el("div", { class: "nthview-colbench" });
      s.appendChild(colS); s.appendChild(colB);
      var live = [];
      var story = el("div", { class: "nthview-story" });
      story.appendChild(el("span", { class: "nthview-kicker", text: "Step " + (i + 1) + " of " + N + (st.kicker ? " · " + st.kicker : "") }));
      var h2 = el("h2", { text: st.title, tabindex: "-1" }); story.appendChild(h2);
      st.body.forEach(function (t) { story.appendChild(para(t, live, null, { scrub: true })); });
      var myScrubbers = scrubbers.slice();
      colS.appendChild(story);

      /* visuals */
      var visBox = el("div", { class: "nthview-visuals" });
      var cards = st.visuals.map(function (v, vi) { var c = visualCard(v, i, vi); visBox.appendChild(c); return c; });
      colB.appendChild(visBox);

      /* controls */
      var ctlState = { locked: !!pr && pr.lock !== false && !rec.revealed };
      var ctlCard = el("div", { class: "nthview-card nthview-controls" });
      var allInputs = [];
      var lockMsg = el("p", { class: "nthview-lockmsg" }, [icon("lock"), el("span", { text: "Make your prediction first. Then the controls are yours." })]);
      ctlCard.appendChild(el("p", { class: "nthview-label", text: "Your controls" }));
      ctlCard.appendChild(lockMsg);
      var grid = el("div", { class: "nthview-ctls" });
      (st.controls || []).forEach(function (c) { var cn = controlNode(c, ctlState, s); grid.appendChild(cn.node); allInputs = allInputs.concat(cn.inputs); });
      ctlCard.appendChild(grid);
      var resetB = btn("Reset this step", "nthview-ghost nthview-small-btn", function () { tween(s, defaults(st.start), 500); status.textContent = "Model reset to this step's starting values."; }, "restart");
      ctlCard.appendChild(el("div", { class: "nthview-ctl-actions" }, [resetB]));
      if ((st.controls || []).length || myScrubbers.length) colB.appendChild(ctlCard);
      function paintLock() {
        ctlCard.classList.toggle("nthview-locked", ctlState.locked);
        lockMsg.style.display = ctlState.locked ? "" : "none";
        allInputs.forEach(function (x) { x.disabled = ctlState.locked; });
        resetB.disabled = ctlState.locked;
        myScrubbers.forEach(function (x) { x.setAttribute("aria-disabled", String(ctlState.locked)); });
        if (!ctlState.locked && ENV) notify();
      }
      paintLock();
      if (!(st.controls || []).length && !myScrubbers.length) lockMsg.style.display = "none";

      /* after: challenge, takeaway, nav */
      var after = el("div", { class: "nthview-after" });
      var afterLive = [];
      var chal = null, tk = null;
      if (st.challenge) {
        var ch = st.challenge;
        var pill = el("span", { class: "nthview-pill", text: "Not yet" });
        chal = el("div", { class: "nthview-card nthview-challenge", role: "group", "aria-label": "Challenge" });
        chal.appendChild(el("div", { class: "nthview-chal-top" }, [el("p", { class: "nthview-eyebrow", style: "margin:0;display:flex;gap:.4rem;align-items:center" }, [icon("target"), doc.createTextNode("Challenge")]), pill]));
        chal.appendChild(para(ch.prompt, null, null));
        if (ch.hint) { var det = el("details", {}, [el("summary", { text: "Need a hint?" })]); det.appendChild(para(ch.hint, null, "nthview-small")); chal.appendChild(det); }
        var success = el("div", { style: "display:none" }); success.appendChild(para(ch.success, afterLive, null));
        chal.appendChild(success);
        watch(function (env) {
          var ok = !!ev(ch.when, env);
          if (ok && !rec.solved && chal.style.display !== "none") { rec.solved = true; burst(chal); status.textContent = "Challenge solved."; }
          if (rec.solved) { chal.classList.add("nthview-solved"); pill.textContent = "Solved"; success.style.display = ""; }
        });
        after.appendChild(chal);
      }
      if (st.takeaway) { tk = el("div", { class: "nthview-card nthview-takeaway" }, [el("p", { class: "nthview-label", text: "Take it with you" })]); tk.appendChild(para(st.takeaway, afterLive)); after.appendChild(tk); }
      function paintAfter() { var on = !pr || rec.revealed; if (chal) chal.style.display = on ? "" : "none"; if (tk) tk.style.display = on ? "" : "none"; }
      paintAfter();
      var nav = el("div", { class: "nthview-nav" });
      nav.appendChild(btn(i === 0 ? "Introduction" : "Back", "nthview-ghost", function () { go(i - 1); }, "prev"));
      var nextB = btn(i === N - 1 ? "Wrap up" : "Next: " + STEPS[i + 1].title, "nthview-primary", function () { go(i + 1); }, "next");
      nav.appendChild(nextB);
      colS.appendChild(after);

      /* predict then observe */
      keyPick = null;
      if (pr) {
        var pc = el("div", { class: "nthview-card nthview-predict", role: "group", "aria-label": "Predict" });
        pc.appendChild(el("p", { class: "nthview-eyebrow" }, [icon("bulb"), doc.createTextNode("Predict first")]));
        var ask = el("p", { class: "nthview-ask" }); ask.appendChild(rich(pr.prompt, null)); pc.appendChild(ask);
        var list = el("ul", { class: "nthview-opts" });
        var obtns = pr.options.map(function (o, j) {
          var b = el("button", { type: "button", class: "nthview-opt", "aria-label": LETTERS[j] + ". " + o.text }, [el("span", { class: "nthview-key", "aria-hidden": "true", text: LETTERS[j] }), el("span", {}, [rich(o.text, null)])]);
          b.addEventListener("click", function () { pick(j); });
          list.appendChild(el("li", {}, [b])); return b;
        });
        pc.appendChild(list);
        var skipB = btn("Skip the prediction and just play", "nthview-ghost nthview-small-btn", function () { rec.skipped = true; reveal(false); });
        var pcActions = el("div", { class: "nthview-ctl-actions" }, [skipB]);
        pc.appendChild(pcActions);
        var outcome = el("div"); pc.appendChild(outcome);
        colS.insertBefore(pc, after);
        pc.classList.add("nthview-predict");
        var correctIdx = 0; pr.options.forEach(function (o, j) { if (o.correct) correctIdx = j; });

        var observeAndReveal = function (animate) {
          var startVals = defaults(st.start);
          var targets = pr.set ? targetsFor(pr.set, computeEnv(startVals)) : null;
          var obs = el("div", { class: "nthview-observing", role: "status" }, [icon("spark"), el("span", { text: targets ? "Running the model…" : "Look at the model…" })]);
          outcome.textContent = ""; outcome.appendChild(obs);
          cards.forEach(function (c) { c.classList.remove("nthview-glowing"); void c.offsetWidth; if (!reduceMotion) c.classList.add("nthview-glowing"); });
          if (animate && narrow() && cards[0]) scrollToNode(cards[0], "start");
          if (!animate || reduceMotion) { setVars(startVals); if (targets) setVars(targets); showResult(); return; }
          tween(s, startVals, 350, function () {
            setTimeout(function () {
              if (!s.isConnected) return;
              if (targets) tween(s, targets, 1300, function () { setTimeout(showResult, 250); }); else setTimeout(showResult, 600);
            }, 150);
          });
        };
        var showResult = function (quiet) {
          if (!s.isConnected) return;
          rec.revealed = true;
          outcome.textContent = "";
          paintOptions();
          if (!rec.skipped) {
            var o = pr.options[rec.pick], right = !!o.correct;
            var v = el("div", { class: "nthview-verdict nthview-reveal " + (right ? "nthview-ok" : "nthview-no") });
            var h3 = el("h3", { tabindex: "-1" }, [el("span", { class: "nthview-vicon" }, [icon(right ? "check" : "cross")]), doc.createTextNode(right ? "You called it" : "Not quite. " + LETTERS[correctIdx] + " is what happens")]);
            v.appendChild(h3); v.appendChild(para(o.why, null));
            if (!right) v.appendChild(para("**" + LETTERS[correctIdx] + ":** " + pr.options[correctIdx].why, null, "nthview-small"));
            outcome.appendChild(v);
            status.textContent = (right ? "You called it. " : "Not quite. " + LETTERS[correctIdx] + " is what happens. ") + "What to notice is shown below the prediction.";
          }
          var nb = el("div", { class: "nthview-notice nthview-reveal", tabindex: "-1" }, [el("p", { class: "nthview-label", text: "What to notice" })]);
          var noticeLive = [];
          nb.appendChild(para(pr.notice, noticeLive));
          noticeLive.forEach(function (f) { live.push(f); });
          outcome.appendChild(nb);
          var replay = btn("Replay the observation", "nthview-ghost nthview-small-btn", function () { observeAndReveal(true); }, "restart");
          if (pr.set) outcome.appendChild(el("div", { class: "nthview-ctl-actions" }, [replay]));
          ctlState.locked = false; paintLock(); paintAfter(); paintRail();
          notify();
          var hf = outcome.querySelector("h3") || outcome.querySelector(".nthview-notice");
          if (hf && !quiet) setTimeout(function () { hf.focus({ preventScroll: true }); if (narrow()) setTimeout(function () { if (s.isConnected) scrollToNode(outcome, "start"); }, 900); }, 60);
        };
        var paintOptions = function () {
          obtns.forEach(function (b, j) {
            b.disabled = rec.revealed || rec.pick >= 0 || rec.skipped;
            b.classList.toggle("nthview-picked", j === rec.pick);
            if (rec.revealed && !rec.skipped) {
              b.classList.toggle("nthview-right", j === correctIdx);
              b.classList.toggle("nthview-wrong", j === rec.pick && j !== correctIdx);
              b.classList.toggle("nthview-dim", j !== correctIdx && j !== rec.pick);
            } else if (rec.revealed) b.classList.toggle("nthview-right", j === correctIdx);
            b.setAttribute("aria-label", LETTERS[j] + ". " + pr.options[j].text + (j === rec.pick ? ". Your prediction" : "") + (rec.revealed && j === correctIdx ? ". What happens" : ""));
          });
          pcActions.style.display = rec.revealed || rec.pick >= 0 || rec.skipped ? "none" : "";
        };
        var reveal = function (animate) { paintOptions(); observeAndReveal(animate); };
        var pick = function (j) {
          if (rec.revealed || rec.pick >= 0 || rec.skipped) return;
          rec.pick = j; paintOptions();
          status.textContent = "You predicted " + LETTERS[j] + ". Watch the model.";
          reveal(true);
        };
        keyPick = function (j) { if (j < pr.options.length) pick(j); };
        if (rec.revealed) { paintOptions(); showResult(true); } else paintOptions();
      }

      s.appendChild(nav);
      watch(function (env) { live.forEach(function (f) { f(env); }); afterLive.forEach(function (f) { f(env); }); });
      return { node: s, focus: h2 };
    }

    /* ---------- wrap-up ---------- */
    function wrapScreen() {
      var w = data.wrapUp, s = el("section", { "aria-label": "Wrap-up" });
      s.appendChild(rise(el("p", { class: "nthview-eyebrow", text: "Lab notes" }), 0));
      var h1 = el("h1", { text: w.heading || "What you discovered", tabindex: "-1" }); s.appendChild(rise(h1, 1));
      var made = 0, right = 0, visited = 0, solved = 0, chals = 0;
      STEPS.forEach(function (st) { var r = record[st.id]; if (r.visited) visited++; if (st.challenge) { chals++; if (r.solved) solved++; } if (st.predict && r.pick >= 0) { made++; if (st.predict.options[r.pick].correct) right++; } });
      var tiles = [[visited, "of " + N + " steps explored"], [made, "predictions made"], [right, "predictions that held up"]];
      if (chals) tiles.push([solved, "of " + chals + " challenges solved"]);
      var row = el("div", { class: "nthview-tiles" });
      var counters = tiles.map(function (t, i) { var b = el("b", { text: "0" }); row.appendChild(rise(el("div", { class: "nthview-tile" }, [b, el("span", { text: t[1] })]), 2 + i)); return [b, t[0]]; });
      s.appendChild(row);
      w.body.forEach(function (t, i) { s.appendChild(rise(para(t, null), 6 + i)); });
      var gridW = el("div", { class: "nthview-wrapgrid" });
      var takes = w.takeaways || STEPS.filter(function (st) { return st.takeaway; }).map(function (st) { return st.takeaway; });
      var takeLive = [];
      if (takes.length) {
        var c1 = el("div", { class: "nthview-card" }, [el("p", { class: "nthview-label", text: "Takeaways" })]);
        c1.appendChild(el("ol", { class: "nthview-ol" }, takes.map(function (t) { var li = el("li"); li.appendChild(rich(t, w.takeaways ? null : takeLive)); return li; })));
        gridW.appendChild(rise(c1, 9));
      }
      var c2 = el("div", { class: "nthview-card" }, [el("p", { class: "nthview-label", text: "Glossary" }), glossaryList()]);
      gridW.appendChild(rise(c2, 10));
      s.appendChild(gridW);
      if (w.next) {
        var c3 = el("div", { class: "nthview-card" }, [el("p", { class: "nthview-label", text: "Keep tinkering" })]);
        c3.appendChild(el("ul", { class: "nthview-ol" }, w.next.map(function (t) { var li = el("li"); li.appendChild(rich(t, null)); return li; })));
        s.appendChild(rise(c3, 11));
      }
      s.appendChild(el("div", { class: "nthview-nav" }, [
        btn("Back to the last step", "nthview-ghost", function () { go(N - 1); }, "prev"),
        btn("Explore again from scratch", "nthview-primary", function () { STEPS.forEach(function (st) { record[st.id] = { visited: false, vars: null, pick: -1, revealed: false, skipped: false, solved: false }; }); go(0); }, "restart")
      ]));
      watch(function (env) { takeLive.forEach(function (f) { f(env); }); });
      setTimeout(function () {
        counters.forEach(function (c) {
          if (reduceMotion || !c[1]) { c[0].textContent = String(c[1]); return; }
          var t = 0; addTask(s, function (dt) { t += dt; var k = Math.min(1, t / .9); c[0].textContent = String(Math.round(c[1] * (1 - Math.pow(1 - k, 3)))); if (k >= 1) return false; });
        });
        confetti();
      }, reduceMotion ? 0 : 350);
      return { node: s, focus: h1 };
    }

    /* ---------- keyboard ---------- */
    var onKey = function (e) {
      if (!wrap.isConnected) { doc.removeEventListener("keydown", onKey); return; }
      if (e.key === "Escape") { if (pop) { var f = popFor; closePop(); if (f) f.focus(); } else closeGlossary(); return; }
      if (drawer.classList.contains("nthview-open")) return;
      var t = e.target, tag = t && t.tagName;
      if (/^(INPUT|TEXTAREA|SELECT)$/.test(tag) || (t && t.getAttribute && /^(slider|radio)$/.test(t.getAttribute("role") || ""))) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight" && current < N) { go(current + 1); e.preventDefault(); }
      else if (e.key === "ArrowLeft" && current > -1) { go(current - 1); e.preventDefault(); }
      else if (/^[1-5]$/.test(e.key) && keyPick && current >= 0 && current < N) { keyPick(parseInt(e.key, 10) - 1); e.preventDefault(); }
    };
    doc.addEventListener("keydown", onKey);

    go(-1);
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-explorable");
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
    render(container, data);
    return result;
  };

  NthView.libs = [
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&family=Kalam:wght@700&family=Nunito:wght@500;700;800;900&family=Sora:wght@600;800&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600;8..60,700&family=Space+Grotesk:wght@500;700&display=swap", name: "Google Fonts (Atkinson Hyperlegible, Bricolage Grotesque, Fraunces, Inter, JetBrains Mono, Kalam, Nunito, Sora, Source Serif 4, Space Grotesk)" }
  ];
})(typeof globalThis !== "undefined" ? globalThis : window);
