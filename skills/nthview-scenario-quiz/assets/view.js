/* NthView — scenario-quiz renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first. Fonts come from Google Fonts (see NthView.libs).
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";

  var THEMES = ["midnight", "sunrise", "forest", "paper", "neon", "ocean", "ember", "lavender"];

  /* Each theme: native palette, then the variant for the other colour scheme. */
  var PALETTES = {
    midnight: { dark: true,
      base: "--bg1:#0b1022;--bg2:#1a1f4a;--blob1:#4338ca;--blob2:#0e7490;--blob3:#9d174d;--surface:rgba(16,20,44,.62);--surface-2:rgba(22,27,56,.88);--line:rgba(255,255,255,.16);--ink:#fafbff;--muted:#c3c8e8;--accent:#8b7cff;--accent-2:#22d3ee;--on-accent:#0b1022;--ok:#4ade80;--no:#fb7185;--warn:#fbbf24;--display:'Space Grotesk',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1.25rem",
      alt: "--blob1:#c7d2fe;--blob2:#bae6fd;--blob3:#fbcfe8;--bg1:#eef0ff;--bg2:#dfe4ff;--surface:rgba(255,255,255,.88);--surface-2:rgba(255,255,255,.97);--line:rgba(20,30,80,.14);--ink:#111318;--muted:#3f4670;--accent:#5b4df0;--accent-2:#0891b2;--on-accent:#fff;--ok:#15803d;--no:#be123c;--warn:#a16207" },
    sunrise: { dark: false,
      base: "--bg1:#fff4e6;--bg2:#ffd9c2;--blob1:#ffd4b8;--blob2:#ffe6a8;--blob3:#ffc2d9;--surface:rgba(255,252,247,.9);--surface-2:rgba(255,255,255,.98);--line:rgba(120,60,20,.14);--ink:#111318;--muted:#5f3f2e;--accent:#ff6b35;--accent-2:#ffb347;--on-accent:#fff;--ok:#2e8b57;--no:#c0392b;--warn:#b7791f;--display:'Fraunces',Georgia,serif;--body:'Inter',system-ui,sans-serif;--radius:1.25rem",
      alt: "--blob1:#9a3412;--blob2:#a16207;--blob3:#9f1239;--bg1:#2a1510;--bg2:#4a2418;--surface:rgba(40,18,12,.64);--surface-2:rgba(52,24,16,.88);--line:rgba(255,255,255,.16);--ink:#fafbff;--muted:#e2c6b6;--accent:#ff8c5a;--accent-2:#ffc46b;--on-accent:#2a1510;--ok:#6fd39b;--no:#ff8a80;--warn:#f6c768" },
    forest: { dark: true,
      base: "--bg1:#0f1f1a;--bg2:#1d3a2f;--blob1:#0f766e;--blob2:#3f6212;--blob3:#92400e;--surface:rgba(12,30,24,.64);--surface-2:rgba(18,40,32,.88);--line:rgba(255,255,255,.15);--ink:#fafbff;--muted:#bcd8ca;--accent:#34d399;--accent-2:#a3e635;--on-accent:#0f1f1a;--ok:#4ade80;--no:#fb7185;--warn:#fbbf24;--display:'Lora',Georgia,serif;--body:'Inter',system-ui,sans-serif;--radius:1.1rem",
      alt: "--blob1:#bbf7d0;--blob2:#d9f99d;--blob3:#fde68a;--bg1:#eef7f1;--bg2:#d6ecdd;--surface:rgba(255,255,255,.9);--surface-2:rgba(255,255,255,.98);--line:rgba(10,60,40,.14);--ink:#111318;--muted:#2f5a48;--accent:#0f8a5f;--accent-2:#65a30d;--on-accent:#fff;--ok:#15803d;--no:#b91c1c;--warn:#a16207" },
    paper: { dark: false,
      base: "--bg1:#f7f3ea;--bg2:#ebe4d4;--blob1:#e9e1cf;--blob2:#f1d3c6;--blob3:#d6dfe9;--surface:rgba(255,253,248,.94);--surface-2:#fff;--line:rgba(40,30,10,.16);--ink:#111318;--muted:#55503f;--accent:#b4231f;--accent-2:#d97706;--on-accent:#fff;--ok:#2f6f4f;--no:#b4231f;--warn:#8a5a00;--display:'Fraunces',Georgia,serif;--body:'Lora',Georgia,serif;--radius:.6rem",
      alt: "--blob1:#44403c;--blob2:#7c2d12;--blob3:#334155;--bg1:#1b1813;--bg2:#2a251c;--surface:rgba(28,24,18,.7);--surface-2:rgba(38,33,25,.9);--line:rgba(255,255,255,.14);--ink:#fafbff;--muted:#cfc5b2;--accent:#f0655f;--accent-2:#f3a53a;--on-accent:#1b1813;--ok:#7fcfa2;--no:#f08a86;--warn:#e3b654" },
    neon: { dark: true,
      base: "--bg1:#05060f;--bg2:#120a2a;--blob1:#0e7490;--blob2:#9d174d;--blob3:#4c1d95;--surface:rgba(8,10,28,.68);--surface-2:rgba(14,16,40,.9);--line:rgba(0,229,255,.3);--ink:#fafbff;--muted:#b3c0dc;--accent:#00e5ff;--accent-2:#ff2bd6;--on-accent:#05060f;--ok:#39ff88;--no:#ff4d6d;--warn:#ffd400;--display:'Space Grotesk',system-ui,sans-serif;--body:'Space Grotesk',system-ui,sans-serif;--radius:.9rem",
      alt: "--blob1:#a5f3fc;--blob2:#fbcfe8;--blob3:#ddd6fe;--bg1:#f0f4ff;--bg2:#e4e9ff;--surface:rgba(255,255,255,.9);--surface-2:#fff;--line:rgba(60,20,140,.16);--ink:#111318;--muted:#4b4a68;--accent:#7c3aed;--accent-2:#db2777;--on-accent:#fff;--ok:#15803d;--no:#be123c;--warn:#a16207" },
    ocean: { dark: false,
      base: "--bg1:#e9f6ff;--bg2:#cfe8ff;--blob1:#bcd8ff;--blob2:#b9f1f7;--blob3:#d9ccff;--surface:rgba(255,255,255,.9);--surface-2:rgba(255,255,255,.98);--line:rgba(10,50,100,.14);--ink:#111318;--muted:#3a5270;--accent:#0a7cff;--accent-2:#22b8cf;--on-accent:#fff;--ok:#0f9d58;--no:#d93025;--warn:#b06000;--display:'Inter',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1.4rem",
      alt: "--blob1:#1e3a8a;--blob2:#155e75;--blob3:#4c1d95;--bg1:#061a2e;--bg2:#0c2f4f;--surface:rgba(8,30,52,.64);--surface-2:rgba(12,40,66,.88);--line:rgba(255,255,255,.16);--ink:#fafbff;--muted:#b7cce0;--accent:#4da3ff;--accent-2:#4dd4e8;--on-accent:#061a2e;--ok:#5ad186;--no:#ff7b72;--warn:#f2c14e" },
    ember: { dark: true,
      base: "--bg1:#140b08;--bg2:#2e1410;--blob1:#9a3412;--blob2:#a16207;--blob3:#881337;--surface:rgba(30,14,10,.66);--surface-2:rgba(42,20,14,.88);--line:rgba(255,255,255,.15);--ink:#fafbff;--muted:#dcbdaf;--accent:#ff6a2b;--accent-2:#ffb020;--on-accent:#140b08;--ok:#6fd39b;--no:#ff6b6b;--warn:#ffc857;--display:'Space Grotesk',system-ui,sans-serif;--body:'Inter',system-ui,sans-serif;--radius:1rem",
      alt: "--blob1:#fed7aa;--blob2:#fde68a;--blob3:#fecdd3;--bg1:#fff1ea;--bg2:#ffdccd;--surface:rgba(255,252,249,.9);--surface-2:rgba(255,255,255,.98);--line:rgba(90,30,10,.15);--ink:#111318;--muted:#623a2c;--accent:#d94a12;--accent-2:#d9870f;--on-accent:#fff;--ok:#1f7a4d;--no:#b3261e;--warn:#9a6700" },
    lavender: { dark: false,
      base: "--bg1:#f6f1ff;--bg2:#ffe6f3;--blob1:#e2d9ff;--blob2:#ffd3e8;--blob3:#d6f7fb;--surface:rgba(255,255,255,.9);--surface-2:rgba(255,255,255,.98);--line:rgba(80,40,120,.14);--ink:#111318;--muted:#584874;--accent:#7c5cff;--accent-2:#ff6fb5;--on-accent:#fff;--ok:#22a06b;--no:#e5484d;--warn:#b7791f;--display:'Nunito',system-ui,sans-serif;--body:'Nunito',system-ui,sans-serif;--radius:1.6rem",
      alt: "--blob1:#4c1d95;--blob2:#9d174d;--blob3:#155e75;--bg1:#1a1230;--bg2:#2a1a3e;--surface:rgba(30,20,52,.66);--surface-2:rgba(40,28,66,.88);--line:rgba(255,255,255,.16);--ink:#fafbff;--muted:#cdbfe6;--accent:#a78bfa;--accent-2:#f9a8d4;--on-accent:#1a1230;--ok:#6ee7b7;--no:#fb7185;--warn:#fcd34d" }
  };

  function themeCss() {
    var out = [];
    THEMES.forEach(function (t) {
      var p = PALETTES[t];
      out.push(".nthview-scenario-quiz[data-theme=" + t + "]{" + p.base + "}");
      out.push("@media (prefers-color-scheme:" + (p.dark ? "light" : "dark") + "){.nthview-scenario-quiz[data-theme=" + t + "]{" + p.alt + "}}");
    });
    return out.join("\n");
  }

  var GRAIN = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 0 0.5 0 0 0 .6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")";

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
    ".nthview.nthview-scenario-quiz{max-width:none;margin:0;padding:0;min-height:100vh;position:relative;isolation:isolate;background:var(--bg1);color:var(--ink);font-family:var(--body);line-height:1.55;--nv-accent:var(--accent)}",
    "body:has(> .nthview-scenario-quiz){margin:0}",
    ".nthview-scenario-quiz .nthview-backdrop{position:absolute;inset:0;z-index:-1;overflow:hidden;background:linear-gradient(160deg,var(--bg1),var(--bg2))}",
    ".nthview-scenario-quiz .nthview-blob{position:absolute;width:58vmax;height:58vmax;border-radius:50%;filter:blur(80px);opacity:.5;animation:nthview-drift 30s ease-in-out infinite alternate;will-change:transform}",
    ".nthview-scenario-quiz .nthview-blob:nth-child(1){background:var(--blob1);top:-22vmax;left:-16vmax}",
    ".nthview-scenario-quiz .nthview-blob:nth-child(2){background:var(--blob2);top:20vmax;right:-14vmax;animation-duration:36s;animation-delay:-9s}",
    ".nthview-scenario-quiz .nthview-blob:nth-child(3){background:var(--blob3);top:28vmax;left:38%;width:42vmax;height:42vmax;animation-duration:44s;animation-delay:-18s}",
    ".nthview-scenario-quiz .nthview-blob:nth-child(4){background:var(--blob2);bottom:-20vmax;left:-14vmax;width:48vmax;height:48vmax;animation-duration:38s;animation-delay:-5s}",
    ".nthview-scenario-quiz .nthview-blob:nth-child(5){background:var(--blob1);bottom:-24vmax;right:-10vmax;animation-duration:42s;animation-delay:-21s}",
    ".nthview-scenario-quiz .nthview-grain{position:absolute;inset:0;opacity:.09;background-image:" + GRAIN + ";mix-blend-mode:overlay;pointer-events:none}",
    "@keyframes nthview-drift{from{transform:translate(0,0) scale(1)}to{transform:translate(9vmax,7vmax) scale(1.18)}}",
    ".nthview-scenario-quiz .nthview-frame{max-width:48rem;margin:0 auto;padding:clamp(1rem,4vw,2.5rem) 1rem 4rem}",
    ".nthview-scenario-quiz .nthview-stage > section > p{background:var(--surface);border:1px solid var(--line);border-radius:calc(var(--radius) * .7);padding:.7rem 1rem;backdrop-filter:blur(14px)}",
    ".nthview-scenario-quiz .nthview-stage > section > p.nthview-eyebrow{background:none;border:0;padding:0;backdrop-filter:none}",
    ".nthview-scenario-quiz button{font:inherit;color:inherit;cursor:pointer}",
    ".nthview-scenario-quiz button:disabled{cursor:default}",
    ".nthview-scenario-quiz p{margin:.4rem 0 .9rem}",
    ".nthview-scenario-quiz h1{font-family:var(--display);font-weight:800;font-size:clamp(2.2rem,6vw,3.6rem);line-height:1.02;letter-spacing:-.025em;margin:.2rem 0 .6rem;background:linear-gradient(135deg,var(--ink) 0%,var(--ink) 55%,var(--accent) 100%);-webkit-background-clip:text;background-clip:text;color:transparent}",
    ".nthview-scenario-quiz h2{font-family:var(--display);font-weight:700;font-size:clamp(1.35rem,3.2vw,1.75rem);line-height:1.22;letter-spacing:-.01em;margin:.8rem 0 1rem}",
    ".nthview-scenario-quiz h3{font-family:var(--display);font-size:1.1rem;margin:1rem 0 .4rem}",
    ".nthview-scenario-quiz .nthview-muted{color:var(--muted)}",
    ".nthview-scenario-quiz .nthview-small{font-size:.9rem}",
    ".nthview-scenario-quiz .nthview-status{position:absolute;left:-9999px}",
    /* stage + transitions */
    ".nthview-scenario-quiz .nthview-stage{position:relative}",
    ".nthview-scenario-quiz .nthview-screen{transition:opacity .36s ease,transform .42s cubic-bezier(.2,.8,.2,1),filter .36s ease}",
    ".nthview-scenario-quiz .nthview-enter{opacity:0;transform:translateY(22px) scale(.985);filter:blur(6px)}",
    ".nthview-scenario-quiz .nthview-leave{position:absolute;inset:0 0 auto 0;opacity:0;transform:translateY(-16px) scale(.99);filter:blur(4px);pointer-events:none}",
    ".nthview-scenario-quiz .nthview-reveal{overflow:hidden;max-height:0;opacity:0;transform:translateY(10px);transition:max-height .55s ease,opacity .4s ease .08s,transform .45s ease .05s}",
    ".nthview-scenario-quiz .nthview-reveal.nthview-open{max-height:120rem;opacity:1;transform:none}",
    ".nthview-scenario-quiz .nthview-rise{animation:nthview-rise .55s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i,0)*70ms)}",
    "@keyframes nthview-rise{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}",
    "@keyframes nthview-pop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08)}100%{transform:scale(1);opacity:1}}",
    "@keyframes nthview-draw{to{stroke-dashoffset:0}}",
    "@keyframes nthview-pulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 45%,transparent)}50%{box-shadow:0 0 0 7px transparent}}",
    "@keyframes nthview-fall{to{transform:translateY(110vh) rotate(720deg);opacity:0}}",
    "@media (prefers-reduced-motion:reduce){.nthview-scenario-quiz .nthview-screen,.nthview-scenario-quiz .nthview-reveal,.nthview-scenario-quiz .nthview-bar,.nthview-scenario-quiz .nthview-opt{transition:none}.nthview-scenario-quiz .nthview-blob,.nthview-scenario-quiz .nthview-rise,.nthview-scenario-quiz .nthview-dot,.nthview-scenario-quiz .nthview-icon svg path,.nthview-scenario-quiz .nthview-icon{animation:none}}",
    /* header */
    ".nthview-scenario-quiz .nthview-top{display:flex;justify-content:space-between;align-items:center;gap:.8rem;flex-wrap:wrap;margin-bottom:.7rem}",
    ".nthview-scenario-quiz .nthview-chip{display:inline-flex;align-items:center;gap:.4rem;background:var(--surface);backdrop-filter:blur(12px);border:1px solid var(--line);border-radius:999px;padding:.28rem .8rem;font-size:.82rem;font-weight:600;letter-spacing:.01em}",
    ".nthview-scenario-quiz .nthview-chip .nthview-dotc{width:.5rem;height:.5rem;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-2))}",
    ".nthview-scenario-quiz .nthview-eyebrow{font-size:.74rem;text-transform:uppercase;letter-spacing:.14em;color:var(--accent);font-weight:700;margin:0 0 .5rem}",
    ".nthview-scenario-quiz .nthview-dots{display:flex;gap:.35rem;flex-wrap:wrap;margin:.4rem 0 .5rem}",
    ".nthview-scenario-quiz .nthview-dot{width:.55rem;height:.55rem;border-radius:50%;background:var(--line);transition:background .3s,transform .3s}",
    ".nthview-scenario-quiz .nthview-dot.nthview-done{background:var(--accent)}",
    ".nthview-scenario-quiz .nthview-dot.nthview-now{background:var(--accent-2);transform:scale(1.35);animation:nthview-pulse 1.8s ease-out infinite}",
    ".nthview-scenario-quiz .nthview-track{height:5px;border-radius:3px;background:var(--line);overflow:hidden;margin:.2rem 0 1.2rem}",
    ".nthview-scenario-quiz .nthview-bar{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));border-radius:3px;transition:width .5s ease}",
    /* cards */
    ".nthview-scenario-quiz .nthview-card{position:relative;background:var(--surface);backdrop-filter:blur(18px) saturate(1.25);-webkit-backdrop-filter:blur(18px) saturate(1.25);border:1px solid var(--line);border-radius:var(--radius);padding:1.25rem 1.35rem;margin:.9rem 0;box-shadow:0 24px 60px -32px rgba(0,0,0,.45),inset 0 1px 0 rgba(255,255,255,.08)}",
    ".nthview-scenario-quiz .nthview-label{font-size:.74rem;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);margin:0 0 .4rem;font-weight:700}",
    ".nthview-scenario-quiz .nthview-scene{border-left:4px solid var(--accent);overflow:hidden}",
    ".nthview-scenario-quiz .nthview-scene p:last-child{margin-bottom:0}",
    ".nthview-scenario-quiz .nthview-scene .nthview-art{position:absolute;right:-1.5rem;top:-1.5rem;width:11rem;height:11rem;opacity:.16;pointer-events:none}",
    ".nthview-scenario-quiz .nthview-art-intro{position:absolute;right:-2rem;bottom:-2.5rem;width:16rem;height:16rem;opacity:.14;pointer-events:none}",
    /* role badge */
    ".nthview-scenario-quiz .nthview-badge{display:flex;gap:1rem;align-items:center;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 22%,var(--surface)),color-mix(in srgb,var(--accent-2) 18%,var(--surface)));backdrop-filter:blur(18px);border:1px solid var(--line);border-radius:var(--radius);padding:1rem 1.2rem;margin:1rem 0 1.2rem;box-shadow:0 24px 60px -32px rgba(0,0,0,.45)}",
    ".nthview-scenario-quiz .nthview-avatar{flex:none;width:3.6rem;height:3.6rem;border-radius:50%;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);box-shadow:0 10px 30px -10px var(--accent)}",
    ".nthview-scenario-quiz .nthview-avatar svg{width:2rem;height:2rem}",
    ".nthview-scenario-quiz .nthview-badge b{display:block;font-family:var(--display);font-size:1.15rem;line-height:1.25}",
    /* options */
    ".nthview-scenario-quiz .nthview-opts{display:grid;gap:.6rem;margin:.4rem 0 1rem;padding:0;list-style:none}",
    ".nthview-scenario-quiz .nthview-opt{position:relative;display:flex;gap:.9rem;align-items:flex-start;width:100%;text-align:left;background:var(--surface);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);border:1.5px solid var(--line);border-radius:calc(var(--radius) * .8);padding:.9rem 1rem;line-height:1.42;transition:border-color .18s,background .18s,transform .18s,box-shadow .18s}",
    ".nthview-scenario-quiz .nthview-opt:hover:not(:disabled),.nthview-scenario-quiz .nthview-opt:focus-visible{border-color:var(--accent);background:var(--surface-2);transform:translateY(-2px);box-shadow:0 16px 40px -22px var(--accent)}",
    ".nthview-scenario-quiz .nthview-opt:disabled{opacity:.95}",
    ".nthview-scenario-quiz .nthview-key{flex:none;width:1.9rem;height:1.9rem;border-radius:.6rem;display:grid;place-items:center;font-family:var(--display);font-weight:800;font-size:.9rem;background:var(--surface-2);border:1px solid var(--line);transition:background .2s,color .2s}",
    ".nthview-scenario-quiz .nthview-opt:hover:not(:disabled) .nthview-key{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);border-color:transparent}",
    ".nthview-scenario-quiz .nthview-opt.nthview-right{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 16%,var(--surface))}",
    ".nthview-scenario-quiz .nthview-opt.nthview-right .nthview-key{background:var(--ok);color:#fff;border-color:transparent}",
    ".nthview-scenario-quiz .nthview-opt.nthview-wrong{border-color:var(--no);background:color-mix(in srgb,var(--no) 16%,var(--surface))}",
    ".nthview-scenario-quiz .nthview-opt.nthview-wrong .nthview-key{background:var(--no);color:#fff;border-color:transparent}",
    ".nthview-scenario-quiz .nthview-opt.nthview-viewing{box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 55%,transparent),0 16px 40px -22px var(--accent)}",
    ".nthview-scenario-quiz .nthview-hint{font-size:.9rem;color:var(--muted);margin:-.3rem 0 .9rem}",
    ".nthview-scenario-quiz .nthview-tags{display:flex;gap:.4rem;flex-wrap:wrap;margin-left:auto;align-self:center}",
    ".nthview-scenario-quiz .nthview-tag{font-size:.68rem;font-weight:800;text-transform:uppercase;letter-spacing:.06em;border-radius:999px;padding:.15rem .55rem;white-space:nowrap}",
    ".nthview-scenario-quiz .nthview-tag-you{background:var(--surface-2);border:1px solid var(--line)}",
    ".nthview-scenario-quiz .nthview-tag-trap{background:color-mix(in srgb,var(--warn) 22%,transparent);color:var(--warn)}",
    ".nthview-scenario-quiz .nthview-tag-ok{background:color-mix(in srgb,var(--ok) 20%,transparent);color:var(--ok)}",
    /* feedback */
    ".nthview-scenario-quiz .nthview-feedback{position:relative;border-radius:var(--radius);padding:1.2rem 1.3rem 1.2rem 1.3rem;border:1.5px solid var(--line);background:var(--surface);backdrop-filter:blur(18px);-webkit-backdrop-filter:blur(18px);box-shadow:0 24px 60px -32px rgba(0,0,0,.45)}",
    ".nthview-scenario-quiz .nthview-feedback.nthview-ok{border-color:color-mix(in srgb,var(--ok) 60%,transparent);background:color-mix(in srgb,var(--ok) 12%,var(--surface))}",
    ".nthview-scenario-quiz .nthview-feedback.nthview-no{border-color:color-mix(in srgb,var(--no) 60%,transparent);background:color-mix(in srgb,var(--no) 12%,var(--surface))}",
    ".nthview-scenario-quiz .nthview-fbhead{display:flex;align-items:center;gap:.8rem;margin-bottom:.6rem}",
    ".nthview-scenario-quiz .nthview-fbhead h3{margin:0;font-size:1.3rem}",
    ".nthview-scenario-quiz .nthview-ok .nthview-fbhead h3{color:var(--ok)}",
    ".nthview-scenario-quiz .nthview-no .nthview-fbhead h3{color:var(--no)}",
    ".nthview-scenario-quiz .nthview-icon{flex:none;width:2.4rem;height:2.4rem;border-radius:50%;display:grid;place-items:center;color:#fff;animation:nthview-pop .5s cubic-bezier(.2,.8,.2,1) both}",
    ".nthview-scenario-quiz .nthview-ok .nthview-icon{background:var(--ok)}",
    ".nthview-scenario-quiz .nthview-no .nthview-icon{background:var(--no)}",
    ".nthview-scenario-quiz .nthview-icon svg{width:1.3rem;height:1.3rem}",
    ".nthview-scenario-quiz .nthview-icon svg path{stroke-dasharray:40;stroke-dashoffset:40;animation:nthview-draw .5s ease .25s forwards}",
    ".nthview-scenario-quiz .nthview-feedback p:last-child{margin-bottom:0}",
    ".nthview-scenario-quiz .nthview-takeaway{position:relative;border-radius:var(--radius);padding:1rem 1.2rem 1rem 1.3rem;margin:.9rem 0;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 18%,var(--surface)),color-mix(in srgb,var(--accent-2) 14%,var(--surface)));border:1px solid var(--line);backdrop-filter:blur(14px)}",
    ".nthview-scenario-quiz .nthview-takeaway::before{content:'';position:absolute;left:0;top:14%;bottom:14%;width:4px;border-radius:2px;background:linear-gradient(var(--accent),var(--accent-2))}",
    ".nthview-scenario-quiz .nthview-takeaway p{margin:0}",
    ".nthview-scenario-quiz .nthview-takeaway p:not(.nthview-label){font-family:var(--display);font-size:1.08rem;font-weight:600}",
    ".nthview-scenario-quiz details{margin:.9rem 0}",
    ".nthview-scenario-quiz summary{cursor:pointer;font-weight:700;color:var(--accent);list-style:none;display:inline-flex;align-items:center;gap:.4rem}",
    ".nthview-scenario-quiz summary::-webkit-details-marker{display:none}",
    ".nthview-scenario-quiz summary::before{content:'';width:.5rem;height:.5rem;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(-45deg);transition:transform .2s;margin-right:.2rem}",
    ".nthview-scenario-quiz details[open] summary::before{transform:rotate(45deg)}",
    ".nthview-scenario-quiz .nthview-explain{list-style:none;padding:0;margin:.7rem 0 0;display:grid;gap:.6rem}",
    ".nthview-scenario-quiz .nthview-explain li{border:1px solid var(--line);border-radius:calc(var(--radius) * .8);padding:.8rem 1rem;background:var(--surface);backdrop-filter:blur(12px)}",
    ".nthview-scenario-quiz .nthview-explain li.nthview-right{border-color:color-mix(in srgb,var(--ok) 60%,transparent);background:color-mix(in srgb,var(--ok) 10%,var(--surface))}",
    ".nthview-scenario-quiz .nthview-explain .nthview-head{display:flex;gap:.6rem;align-items:center;flex-wrap:wrap;margin-bottom:.3rem}",
    ".nthview-scenario-quiz .nthview-explain p{margin:.35rem 0 0;font-size:.95rem}",
    /* buttons */
    ".nthview-scenario-quiz .nthview-actions{display:flex;gap:.8rem;flex-wrap:wrap;align-items:center;margin-top:1.1rem}",
    ".nthview-scenario-quiz .nthview-btn{position:relative;border:1.5px solid var(--accent);background:var(--surface);backdrop-filter:blur(12px);color:var(--accent);border-radius:999px;padding:.75rem 1.4rem;font-weight:800;letter-spacing:.01em;transition:transform .18s,box-shadow .18s,filter .18s}",
    ".nthview-scenario-quiz .nthview-btn:hover{transform:translateY(-2px)}",
    ".nthview-scenario-quiz .nthview-btn.nthview-primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:var(--on-accent);border-color:transparent;box-shadow:0 14px 34px -14px var(--accent)}",
    ".nthview-scenario-quiz .nthview-btn.nthview-primary:hover{filter:brightness(1.06);box-shadow:0 18px 40px -14px var(--accent)}",
    ".nthview-scenario-quiz .nthview-btn.nthview-ghost{border-color:transparent;background:transparent;backdrop-filter:none;color:var(--muted);padding-left:.5rem;padding-right:.5rem;font-weight:600}",
    ".nthview-scenario-quiz .nthview-btn.nthview-ghost:hover{color:var(--ink);text-decoration:underline;transform:none}",
    /* summary */
    ".nthview-scenario-quiz .nthview-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(9.5rem,1fr));gap:.8rem;margin:1rem 0 1.4rem}",
    ".nthview-scenario-quiz .nthview-tile{background:var(--surface);backdrop-filter:blur(16px);border:1px solid var(--line);border-radius:var(--radius);padding:1rem 1.1rem;box-shadow:0 24px 60px -32px rgba(0,0,0,.45)}",
    ".nthview-scenario-quiz .nthview-tile b{display:block;font-family:var(--display);font-size:2.2rem;line-height:1;letter-spacing:-.02em;background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}",
    ".nthview-scenario-quiz .nthview-review{border-top:1px solid var(--line);padding-top:.8rem;margin-top:1.6rem}",
    ".nthview-scenario-quiz .nthview-review .nthview-card{scroll-margin-top:1rem}",
    ".nthview-scenario-quiz .nthview-confetti{position:fixed;inset:0;pointer-events:none;z-index:5;overflow:hidden}",
    ".nthview-scenario-quiz .nthview-confetti i{position:absolute;top:-3vh;width:.6rem;height:.9rem;border-radius:.15rem;animation:nthview-fall linear forwards}",
    ".nthview-scenario-quiz .nthview-ol{padding-left:1.3rem}",
    ".nthview-scenario-quiz .nthview-ol li{margin:.45rem 0;padding-left:.2rem}",
    ".nthview-scenario-quiz .nthview-ol li::marker{color:var(--accent);font-weight:800;font-family:var(--display)}"
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
  var LETTERS = "ABCDEFGH";
  var SVG_NS = "http://www.w3.org/2000/svg";

  function svg(viewBox, parts, attrs) {
    var s = root.document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", viewBox); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    parts.forEach(function (pt) {
      var n = root.document.createElementNS(SVG_NS, pt[0]);
      Object.keys(pt[1]).forEach(function (k) { n.setAttribute(k, pt[1][k]); });
      s.appendChild(n);
    });
    return s;
  }
  var ICONS = {
    check: function () { return svg("0 0 24 24", [["path", { d: "M5 12.5l4.5 4.5L19 7.5", fill: "none", stroke: "currentColor", "stroke-width": "3", "stroke-linecap": "round", "stroke-linejoin": "round" }]]); },
    cross: function () { return svg("0 0 24 24", [["path", { d: "M7 7l10 10M17 7L7 17", fill: "none", stroke: "currentColor", "stroke-width": "3", "stroke-linecap": "round" }]]); },
    person: function () { return svg("0 0 24 24", [["path", { d: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.4 0-8 2.5-8 5.5V21h16v-1.5c0-3-3.6-5.5-8-5.5z", fill: "currentColor" }]]); },
    art: function () {
      return svg("0 0 200 200", [
        ["circle", { cx: "140", cy: "60", r: "58", fill: "none", stroke: "var(--accent)", "stroke-width": "10" }],
        ["circle", { cx: "140", cy: "60", r: "34", fill: "none", stroke: "var(--accent-2)", "stroke-width": "8" }],
        ["circle", { cx: "140", cy: "60", r: "10", fill: "var(--accent)" }],
        ["path", { d: "M10 190 L70 110 L110 150 L190 70", fill: "none", stroke: "var(--accent-2)", "stroke-width": "10", "stroke-linecap": "round", "stroke-linejoin": "round" }],
        ["circle", { cx: "70", cy: "110", r: "9", fill: "var(--accent)" }],
        ["circle", { cx: "110", cy: "150", r: "9", fill: "var(--accent)" }]
      ]);
    }
  };

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
  function tag(cls, text) { return el("span", { class: "nthview-tag " + cls, text: text }); }
  function pickTheme(data) {
    if (data.theme && THEMES.indexOf(data.theme) !== -1) return data.theme;
    var h = 0, s = String(data.title || "");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return THEMES[h % THEMES.length];
  }

  function render(container, data) {
    var doc = root.document;
    var reduceMotion = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var Q = data.questions, N = Q.length;
    var state = { index: -1, answers: {}, screen: null, answered: false };
    container.setAttribute("data-theme", pickTheme(data));

    var backdrop = el("div", { class: "nthview-backdrop", "aria-hidden": "true" }, [el("div", { class: "nthview-blob" }), el("div", { class: "nthview-blob" }), el("div", { class: "nthview-blob" }), el("div", { class: "nthview-blob" }), el("div", { class: "nthview-blob" }), el("div", { class: "nthview-grain" })]);
    var frame = el("div", { class: "nthview-frame" });
    var stage = el("div", { class: "nthview-stage" });
    var status = el("div", { class: "nthview-status", "aria-live": "polite" });
    frame.appendChild(stage); container.appendChild(backdrop); container.appendChild(frame); container.appendChild(status);

    /* ---------- screen transitions ---------- */
    function show(screen, focusEl) {
      var old = state.screen;
      state.screen = screen;
      screen.classList.add("nthview-screen", "nthview-enter");
      stage.appendChild(screen);
      if (old) {
        old.classList.add("nthview-leave");
        old.setAttribute("aria-hidden", "true");
        setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, reduceMotion ? 0 : 440);
      }
      /* force a style flush so the enter state is painted, then release it on a timer
         (not an animation frame, which some embedded browsers throttle heavily) */
      void screen.offsetWidth;
      setTimeout(function () {
        screen.classList.remove("nthview-enter");
        if (focusEl) focusEl.focus({ preventScroll: true });
        if (container.getBoundingClientRect().top < 0 || root.scrollY > 40) root.scrollTo({ top: Math.max(0, container.getBoundingClientRect().top + root.scrollY), behavior: reduceMotion ? "auto" : "smooth" });
      }, 30);
    }
    function reveal(node) {
      node.classList.add("nthview-reveal");
      void node.offsetWidth;
      setTimeout(function () { node.classList.add("nthview-open"); }, 30);
    }
    function rise(node, i) { node.classList.add("nthview-rise"); node.style.setProperty("--i", String(i)); return node; }
    function countUp(node, to) {
      if (reduceMotion || to === 0) { node.textContent = String(to); return; }
      var t0 = null, dur = 900;
      function step(ts) { if (!t0) t0 = ts; var k = Math.min(1, (ts - t0) / dur); k = 1 - Math.pow(1 - k, 3); node.textContent = String(Math.round(to * k)); if (k < 1) root.requestAnimationFrame(step); }
      root.requestAnimationFrame(step);
    }
    function confetti() {
      if (reduceMotion) return;
      var box = el("div", { class: "nthview-confetti", "aria-hidden": "true" });
      var colors = ["var(--accent)", "var(--accent-2)", "var(--ok)", "var(--warn)"];
      for (var i = 0; i < 70; i++) {
        var c = doc.createElement("i");
        c.style.left = (Math.random() * 100) + "vw"; c.style.background = colors[i % colors.length];
        c.style.animationDuration = (2.6 + Math.random() * 1.8) + "s"; c.style.animationDelay = (Math.random() * .6) + "s";
        c.style.transform = "rotate(" + Math.random() * 360 + "deg)"; c.style.opacity = String(.7 + Math.random() * .3);
        box.appendChild(c);
      }
      container.appendChild(box);
      setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 5200);
    }

    /* ---------- pieces ---------- */
    function roleBadge() {
      var r = data.scenario.role;
      var text = el("div"); text.appendChild(el("span", { class: "nthview-label", text: "Your role" })); text.appendChild(el("b", { text: r.title }));
      if (r.description) { var d = el("span", { class: "nthview-small nthview-muted" }); d.appendChild(rich(r.description)); text.appendChild(d); }
      return el("div", { class: "nthview-badge" }, [el("div", { class: "nthview-avatar" }, [ICONS.person()]), text]);
    }
    function chip(text, dot) { var c = el("span", { class: "nthview-chip" }); if (dot) c.appendChild(el("span", { class: "nthview-dotc", "aria-hidden": "true" })); c.appendChild(doc.createTextNode(text)); return c; }
    function progress(i) {
      var wrap = el("div");
      if (N <= 20) {
        var dots = el("div", { class: "nthview-dots", "aria-hidden": "true" });
        for (var k = 0; k < N; k++) dots.appendChild(el("span", { class: "nthview-dot" + (k < i ? " nthview-done" : k === i ? " nthview-now" : "") }));
        wrap.appendChild(dots);
      }
      var bar = el("div", { class: "nthview-bar" }); bar.style.width = Math.round((i / N) * 100) + "%";
      wrap.appendChild(el("div", { class: "nthview-track", role: "progressbar", "aria-valuemin": "0", "aria-valuemax": String(N), "aria-valuenow": String(i), "aria-label": "Progress" }, [bar]));
      return wrap;
    }
    function optionExplanation(q, o, i, picked) {
      var li = el("li", { class: o.correct ? "nthview-right" : "" });
      var head = el("div", { class: "nthview-head" }, [el("span", { class: "nthview-key", text: LETTERS[i] }), el("span", {}, [rich(o.text)])]);
      var tags = el("span", { class: "nthview-tags" });
      if (o.correct) tags.appendChild(tag("nthview-tag-ok", "Right answer"));
      if (o.trap) tags.appendChild(tag("nthview-tag-trap", "Common pick"));
      if (picked === i) tags.appendChild(tag("nthview-tag-you", "Your pick"));
      head.appendChild(tags); li.appendChild(head);
      if (o.tempting && !o.correct) li.appendChild(p("nthview-muted", "**Why it tempts:** " + o.tempting));
      li.appendChild(p("", (o.correct ? "**Why it's right:** " : "**Why not:** ") + o.why));
      return li;
    }
    function allOptions(q, picked) {
      return el("ul", { class: "nthview-explain" }, q.options.map(function (o, i) { return optionExplanation(q, o, i, picked); }));
    }
    function takeawayBox(text) { var tk = el("div", { class: "nthview-takeaway" }, [el("p", { class: "nthview-label", text: "Remember" })]); tk.appendChild(p("", text)); return tk; }

    /* ---------- intro ---------- */
    function introScreen() {
      var s = el("section", { "aria-label": "Scenario" });
      s.appendChild(rise(el("p", { class: "nthview-eyebrow", text: "Scenario quiz" }), 0));
      var h1 = el("h1", { text: data.title, tabindex: "-1" }); s.appendChild(rise(h1, 1));
      if (data.subtitle) s.appendChild(rise(p("nthview-muted", data.subtitle), 2));
      var card = el("div", { class: "nthview-card" });
      card.appendChild(el("p", { class: "nthview-label", text: data.scenario.heading || "The scenario" }));
      data.scenario.setting.forEach(function (t) { card.appendChild(p("", t)); });
      var art = ICONS.art(); art.setAttribute("class", "nthview-art-intro"); card.appendChild(art);
      s.appendChild(rise(card, 3));
      s.appendChild(rise(roleBadge(), 4));
      if (data.scenario.goal) s.appendChild(rise(p("", "**Your goal:** " + data.scenario.goal), 5));
      s.appendChild(rise(p("nthview-small nthview-muted", N + " decisions ahead. Pick what you would really do; every option explains itself, and nothing is scored. Keys 1–8 choose, Enter continues."), 6));
      s.appendChild(rise(el("div", { class: "nthview-actions" }, [btn("Begin", "nthview-primary", function () { go(0); })]), 7));
      return { node: s, focus: h1 };
    }

    /* ---------- question ---------- */
    function questionScreen(i) {
      var q = Q[i];
      var s = el("section", { "aria-label": "Question " + (i + 1) + " of " + N });
      s.appendChild(el("div", { class: "nthview-top" }, [chip("Decision " + (i + 1) + " of " + N, true), chip(data.scenario.role.title)]));
      s.appendChild(progress(i));
      var k = 0;
      if (q.situation) {
        var scene = el("div", { class: "nthview-card nthview-scene" }, [el("p", { class: "nthview-label", text: "The situation" })]);
        scene.appendChild(p("", q.situation)); var art = ICONS.art(); art.setAttribute("class", "nthview-art"); scene.appendChild(art);
        s.appendChild(rise(scene, k++));
      }
      var h2 = el("h2", { tabindex: "-1" }); h2.appendChild(rich(q.prompt)); s.appendChild(rise(h2, k++));
      var list = el("ul", { class: "nthview-opts", role: "list" });
      var buttons = q.options.map(function (o, j) {
        var b = el("button", { type: "button", class: "nthview-opt", "aria-label": LETTERS[j] + ". " + o.text }, [el("span", { class: "nthview-key", "aria-hidden": "true", text: LETTERS[j] }), el("span", {}, [rich(o.text)])]);
        b.addEventListener("click", function () { choose(j); });
        list.appendChild(rise(el("li", {}, [b]), k + j)); return b;
      });
      s.appendChild(list); k += q.options.length;
      var skip = btn("Skip, I know this one", "nthview-ghost", function () { state.answers[q.id] = { skipped: true }; status.textContent = "Skipped."; go(i + 1); });
      var actions = el("div", { class: "nthview-actions" }, [skip]);
      s.appendChild(rise(actions, k));
      var after = el("div"); s.appendChild(after);
      state.answered = false;

      var correctIdx = -1; q.options.forEach(function (x, m) { if (x.correct) correctIdx = m; });
      var fb = null, h3 = null, firstPick = -1;

      /* fill the feedback panel with option m's explanation */
      function explain(m) {
        var o = q.options[m], isFirst = m === firstPick;
        fb.className = "nthview-feedback " + (o.correct ? "nthview-ok" : "nthview-no");
        fb.textContent = "";
        var heading = o.correct ? (isFirst ? "Correct" : LETTERS[m] + " is the right one") : (isFirst ? "Not this one. " + LETTERS[correctIdx] + " is right." : LETTERS[m] + " is not right either");
        h3 = el("h3", { tabindex: "-1", text: heading });
        fb.appendChild(el("div", { class: "nthview-fbhead" }, [el("span", { class: "nthview-icon" }, [o.correct ? ICONS.check() : ICONS.cross()]), h3]));
        if (o.correct) {
          fb.appendChild(p("", o.why));
          var trap = q.options.filter(function (x) { return x.trap; })[0];
          if (trap && firstPick !== q.options.indexOf(trap)) fb.appendChild(p("nthview-small nthview-muted", "Most people pick \"" + trap.text + "\". Tap it to see why that goes wrong."));
        } else {
          if (o.tempting) fb.appendChild(p("", "**Why that seems right:** " + o.tempting));
          fb.appendChild(p("", "**Why it isn't:** " + o.why));
          fb.appendChild(p("nthview-small", "**The right answer is " + LETTERS[correctIdx] + ":** " + q.options[correctIdx].text + " Tap it to read why."));
        }
        buttons.forEach(function (b, k2) { b.classList.toggle("nthview-viewing", k2 === m); b.setAttribute("aria-pressed", String(k2 === m)); });
        status.textContent = heading + " Explanation shown below.";
      }

      function choose(j) {
        if (state.answered) { explain(j); setTimeout(function () { h3.focus({ preventScroll: true }); }, 50); return; }
        state.answered = true; firstPick = j;
        var o = q.options[j];
        state.answers[q.id] = { picked: j, correct: !!o.correct };
        buttons.forEach(function (b, m) {
          if (m === correctIdx) b.classList.add("nthview-right");
          else if (m === j) b.classList.add("nthview-wrong");
          var tags = el("span", { class: "nthview-tags" });
          if (m === j) tags.appendChild(tag("nthview-tag-you", "Your pick"));
          if (q.options[m].trap) tags.appendChild(tag("nthview-tag-trap", "Common pick"));
          if (tags.childNodes.length) b.appendChild(tags);
          b.setAttribute("aria-label", LETTERS[m] + ". " + q.options[m].text + (m === correctIdx ? ". Right answer" : "") + (m === j ? ". Your pick" : ""));
        });
        actions.removeChild(skip);
        var wrap = el("div");
        wrap.appendChild(el("p", { class: "nthview-hint", text: "Tap any other option to see why it is right or wrong. Your first pick is what the review remembers." }));
        fb = el("div", { class: "nthview-feedback" }); wrap.appendChild(fb);
        explain(j);
        wrap.appendChild(takeawayBox(q.takeaway));
        var isLast = i === N - 1;
        var next = btn(isLast ? "See the full review" : "Next decision", "nthview-primary", function () { go(i + 1); });
        wrap.appendChild(el("div", { class: "nthview-actions" }, [next]));
        after.appendChild(wrap); reveal(wrap);
        setTimeout(function () { h3.focus({ preventScroll: true }); fb.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" }); }, reduceMotion ? 0 : 160);
        state.nextBtn = next;
      }
      state.choose = choose;
      return { node: s, focus: h2 };
    }

    /* ---------- summary ---------- */
    function summaryScreen() {
      var s = el("section", { "aria-label": "Summary" });
      var right = 0, wrong = 0, skipped = 0;
      Q.forEach(function (q) { var a = state.answers[q.id]; if (!a || a.skipped) skipped++; else if (a.correct) right++; else wrong++; });
      s.appendChild(rise(el("p", { class: "nthview-eyebrow", text: "You made it through" }), 0));
      var h1 = el("h1", { text: data.summary.heading || "What you've learned", tabindex: "-1" }); s.appendChild(rise(h1, 1));
      var tiles = [[N, "decisions explored"], [right, "right first time"], [wrong, "learned the hard way"], [skipped, "skipped"]];
      var tileRow = el("div", { class: "nthview-tiles" });
      var counters = tiles.map(function (t, i) { var b = el("b", { text: "0" }); tileRow.appendChild(rise(el("div", { class: "nthview-tile" }, [b, el("span", { class: "nthview-small nthview-muted", text: t[1] })]), 2 + i)); return [b, t[0]]; });
      s.appendChild(tileRow);
      data.summary.closing.forEach(function (t, i) { s.appendChild(rise(p("", t), 6 + i)); });
      var takeaways = data.summary.takeaways || Q.map(function (q) { return q.takeaway; });
      if (takeaways.length) {
        var card = el("div", { class: "nthview-card" }, [el("p", { class: "nthview-label", text: "The takeaways" })]);
        card.appendChild(el("ol", { class: "nthview-ol" }, takeaways.map(function (t) { var li = el("li"); li.appendChild(rich(t)); return li; })));
        s.appendChild(rise(card, 9));
      }
      var review = el("div", { class: "nthview-review" });
      review.appendChild(el("h3", { text: "Every decision, every option" }));
      review.appendChild(p("nthview-small nthview-muted", "Read why each choice is right, wrong, or tempting. The ones marked \"Common pick\" are what most people choose."));
      Q.forEach(function (q, i) {
        var a = state.answers[q.id] || { skipped: true };
        var card = el("div", { class: "nthview-card", id: "nthview-review-" + q.id });
        var top = el("div", { class: "nthview-top" }, [chip("Decision " + (i + 1), true)]);
        top.appendChild(a.skipped ? tag("nthview-tag-you", "Skipped") : a.correct ? tag("nthview-tag-ok", "You got it") : tag("nthview-tag-trap", "You picked " + LETTERS[a.picked]));
        card.appendChild(top);
        if (q.situation) card.appendChild(p("nthview-muted", q.situation));
        var h = el("h3"); h.appendChild(rich(q.prompt)); card.appendChild(h);
        card.appendChild(allOptions(q, a.skipped ? -1 : a.picked));
        card.appendChild(takeawayBox(q.takeaway));
        review.appendChild(card);
      });
      s.appendChild(review);
      s.appendChild(el("div", { class: "nthview-actions" }, [btn("Start again", "nthview-primary", function () { state.answers = {}; go(-1); }), btn("Back to top", "nthview-ghost", function () { root.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); h1.focus(); })]));
      setTimeout(function () { counters.forEach(function (c) { countUp(c[0], c[1]); }); confetti(); }, reduceMotion ? 0 : 350);
      return { node: s, focus: h1 };
    }

    /* ---------- navigation + keyboard ---------- */
    function go(i) {
      state.index = i; state.nextBtn = null; state.choose = null;
      var scr = i < 0 ? introScreen() : i >= N ? summaryScreen() : questionScreen(i);
      show(scr.node, scr.focus);
    }
    container.addEventListener("keydown", function (e) {
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (state.index < 0 || state.index >= N) return;
      if (/^[1-8]$/.test(e.key) && state.choose) { var k = parseInt(e.key, 10) - 1; if (k < Q[state.index].options.length) { state.choose(k); e.preventDefault(); } }
      else if (e.key === "Enter" && state.answered && state.nextBtn && e.target && e.target.tagName !== "BUTTON" && e.target.tagName !== "SUMMARY") { state.nextBtn.click(); e.preventDefault(); }
    });
    container.setAttribute("tabindex", "-1");
    go(-1);
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-scenario-quiz");
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
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;600;700&family=Lora:wght@400;600;700&family=Nunito:wght@500;700;900&family=Space+Grotesk:wght@500;700&display=swap", name: "Google Fonts (Fraunces, Inter, Lora, Nunito, Space Grotesk)" }
  ];
  NthView.THEMES = THEMES;
})(typeof globalThis !== "undefined" ? globalThis : window);
