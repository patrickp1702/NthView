/* NthView — mechanism renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first, and three.js for the stage (see NthView.libs).
 * The whole run is computed from tick 0 into typed arrays; the clock, the scroll and the stage only read it.
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";
  var SVG_NS = "http://www.w3.org/2000/svg";

  var THEMES = ["graphite", "paper", "blueprint", "terminal", "sand", "aurora"];

  /* Surfaces by role: page, panel, soft fill, highlight, chart grid and axis, text, accent, verdict
     colours and the type faces. Light and dark are designed separately, not inverted. */
  var SANS = "system-ui,-apple-system,'Segoe UI',Roboto,sans-serif";
  var MONO = "ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace";
  var PALETTES = {
    graphite: {
      light: "--nv-bg:#f2f4f7;--nv-fg:#10141a;--nv-muted:#4a5563;--nv-accent:#4338ca;--nv-border:#d5dae2;--nv-error:#b91c1c;--mx-panel:#ffffff;--mx-soft:#eef1f5;--mx-hi:#e8e9fb;--mx-grid:#e7eaef;--mx-axis:#6b7480;--mx-on-accent:#ffffff;--mx-bar:rgba(242,244,247,.9);--mx-ok:#136c3f;--mx-no:#b42318;--mx-head:" + SANS + ";--mx-body:" + SANS + ";--mx-head-ls:-.022em;--mx-head-w:760",
      dark: "--nv-bg:#0d1015;--nv-fg:#e8ecf2;--nv-muted:#a3adbb;--nv-accent:#a5b4fc;--nv-border:#2b323d;--nv-error:#f87171;--mx-panel:#151a21;--mx-soft:#1b2129;--mx-hi:#252b4f;--mx-grid:#232a34;--mx-axis:#7f8998;--mx-on-accent:#0d1015;--mx-bar:rgba(13,16,21,.88);--mx-ok:#6ee7a8;--mx-no:#fda4a4"
    },
    paper: {
      light: "--nv-bg:#f6f1e7;--nv-fg:#1f1a14;--nv-muted:#5b5144;--nv-accent:#1d4ea6;--nv-border:#dccfbb;--nv-error:#b91c1c;--mx-panel:#fffdf8;--mx-soft:#f2ebdf;--mx-hi:#e4e9f5;--mx-grid:#ece4d6;--mx-axis:#7b6f5e;--mx-on-accent:#ffffff;--mx-bar:rgba(246,241,231,.9);--mx-ok:#1f6b3a;--mx-no:#b02a1a;--mx-head:Georgia,'Iowan Old Style','Times New Roman',serif;--mx-body:Charter,'Bitstream Charter','Iowan Old Style',Georgia,serif;--mx-head-ls:-.005em;--mx-head-w:700",
      dark: "--nv-bg:#16130f;--nv-fg:#f3ece0;--nv-muted:#bdb09b;--nv-accent:#f2b46d;--nv-border:#3c352b;--nv-error:#f87171;--mx-panel:#1f1b15;--mx-soft:#28231c;--mx-hi:#3a2c1c;--mx-grid:#2d2820;--mx-axis:#918470;--mx-on-accent:#16130f;--mx-bar:rgba(22,19,15,.88);--mx-ok:#8fd6a5;--mx-no:#f7a08f"
    },
    blueprint: {
      light: "--nv-bg:#e7eef8;--nv-fg:#0b1c33;--nv-muted:#3b5272;--nv-accent:#1456ad;--nv-border:#c3d3ea;--nv-error:#b91c1c;--mx-panel:#fafcff;--mx-soft:#ebf1fa;--mx-hi:#d7e5f8;--mx-grid:#dfe8f5;--mx-axis:#5b7397;--mx-on-accent:#ffffff;--mx-bar:rgba(231,238,248,.9);--mx-ok:#12683f;--mx-no:#b42318;--mx-head:" + MONO + ";--mx-body:" + SANS + ";--mx-head-ls:-.01em;--mx-head-w:700;--mx-paper:rgba(20,86,173,.06)",
      dark: "--nv-bg:#0a1a31;--nv-fg:#e6f0ff;--nv-muted:#a6bddb;--nv-accent:#7cc4ff;--nv-border:#29486e;--nv-error:#fca5a5;--mx-panel:#0f2343;--mx-soft:#13294b;--mx-hi:#1b3b66;--mx-grid:#1b3557;--mx-axis:#7b94b8;--mx-on-accent:#0a1a31;--mx-bar:rgba(10,26,49,.88);--mx-ok:#7ee2ad;--mx-no:#fca5a5;--mx-paper:rgba(124,196,255,.05)"
    },
    terminal: {
      light: "--nv-bg:#edf1ec;--nv-fg:#0e1a11;--nv-muted:#435648;--nv-accent:#136c37;--nv-border:#cad6cc;--nv-error:#b91c1c;--mx-panel:#fbfcfa;--mx-soft:#eaf0ea;--mx-hi:#d8ecdc;--mx-grid:#e2e9e3;--mx-axis:#627566;--mx-on-accent:#ffffff;--mx-bar:rgba(237,241,236,.9);--mx-ok:#136c37;--mx-no:#b42318;--mx-head:" + MONO + ";--mx-body:" + SANS + ";--mx-head-ls:-.02em;--mx-head-w:700",
      dark: "--nv-bg:#050906;--nv-fg:#d6f3dc;--nv-muted:#8fb69a;--nv-accent:#4ade80;--nv-border:#1e3326;--nv-error:#ff8f8f;--mx-panel:#0a110c;--mx-soft:#0f1a12;--mx-hi:#12301b;--mx-grid:#15241a;--mx-axis:#628d6e;--mx-on-accent:#04140a;--mx-bar:rgba(5,9,6,.9);--mx-ok:#4ade80;--mx-no:#ff8f8f"
    },
    sand: {
      light: "--nv-bg:#f3ebdf;--nv-fg:#2a1c10;--nv-muted:#66503c;--nv-accent:#a3401a;--nv-border:#dccbb4;--nv-error:#a8261a;--mx-panel:#fffaf2;--mx-soft:#f0e6d8;--mx-hi:#f6dfcf;--mx-grid:#ece1d1;--mx-axis:#8a735c;--mx-on-accent:#ffffff;--mx-bar:rgba(243,235,223,.9);--mx-ok:#2f6b2a;--mx-no:#a8261a;--mx-head:'Avenir Next','Segoe UI Variable Display','Segoe UI',system-ui,sans-serif;--mx-body:" + SANS + ";--mx-head-ls:-.012em;--mx-head-w:700",
      dark: "--nv-bg:#18110b;--nv-fg:#f6ebdd;--nv-muted:#c9b29b;--nv-accent:#f3a46b;--nv-border:#3c2c20;--nv-error:#ffa08f;--mx-panel:#221811;--mx-soft:#2b2017;--mx-hi:#3d2617;--mx-grid:#30251b;--mx-axis:#96826d;--mx-on-accent:#18110b;--mx-bar:rgba(24,17,11,.88);--mx-ok:#a3d98f;--mx-no:#ffa08f"
    },
    aurora: {
      light: "--nv-bg:#edf4f7;--nv-fg:#0b1720;--nv-muted:#435d6b;--nv-accent:#0b6e86;--nv-border:#cfdee6;--nv-error:#b91c1c;--mx-panel:#ffffff;--mx-soft:#eaf2f6;--mx-hi:#dcecf2;--mx-grid:#e3ecf1;--mx-axis:#627c89;--mx-on-accent:#ffffff;--mx-bar:rgba(237,244,247,.88);--mx-ok:#11683f;--mx-no:#b42318;--mx-head:" + SANS + ";--mx-body:" + SANS + ";--mx-head-ls:-.025em;--mx-head-w:780;--mx-g1:rgba(45,212,191,.16);--mx-g2:rgba(139,92,246,.12)",
      dark: "--nv-bg:#060b16;--nv-fg:#e7f0ff;--nv-muted:#a1b4d0;--nv-accent:#5eead4;--nv-border:#23314e;--nv-error:#fda4af;--mx-panel:#0c1424;--mx-soft:#111b30;--mx-hi:#133236;--mx-grid:#1a243b;--mx-axis:#7183a5;--mx-on-accent:#04201b;--mx-bar:rgba(6,11,22,.86);--mx-ok:#6ee7b7;--mx-no:#fda4af;--mx-g1:rgba(45,212,191,.14);--mx-g2:rgba(167,139,250,.16)"
    }
  };
  /* Series hues, one set per brightness; each at least 3:1 against every theme's panel.
     The order is chosen so the first six stay apart for the common colour-vision deficiencies. */
  var HUES_LIGHT = "--h-blue:#2160c4;--h-orange:#b45309;--h-teal:#0a7a73;--h-pink:#b0307a;--h-violet:#6a48c2;--h-amber:#8a6100;--h-green:#3a751f;--h-red:#c0262d;--h-grey:#667080";
  var HUES_DARK = "--h-blue:#6aa5ff;--h-orange:#ff9a52;--h-teal:#34cfc2;--h-pink:#f57fba;--h-violet:#b49bff;--h-amber:#f0c04c;--h-green:#86d36a;--h-red:#ff7a7a;--h-grey:#98a3b3";
  var HUE_ORDER = ["blue", "orange", "teal", "pink", "violet", "amber", "green", "red", "grey"];

  function themeCss() {
    var out = [], S = ".nthview-mechanism";
    THEMES.forEach(function (t) {
      var p = PALETTES[t];
      out.push(S + "[data-theme=" + t + "]{" + p.light + ";" + HUES_LIGHT + ";color-scheme:light}");
      out.push("@media (prefers-color-scheme:dark){" + S + "[data-theme=" + t + "]:not([data-scheme=light]){" + p.dark + ";" + HUES_DARK + ";color-scheme:dark}}");
      out.push(S + "[data-theme=" + t + "][data-scheme=dark]{" + p.dark + ";" + HUES_DARK + ";color-scheme:dark}");
    });
    return out.join("\n");
  }

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
    "body:has(> .nthview-mechanism){margin:0}",
    /* tokens: 8-point spacing, three radii, one easing; glass surfaces are mixed from the panel colour */
    ".nthview-mechanism{--mx-mono:" + MONO + ";--mx-r1:6px;--mx-r2:10px;--mx-r3:16px;--mx-ease:cubic-bezier(.2,.7,.2,1);--mx-fast:150ms;--mx-mid:300ms;--mx-top:52px;--mx-dock:92px;--mx-glass:color-mix(in srgb,var(--mx-panel) 80%,transparent);--mx-glass-2:color-mix(in srgb,var(--mx-panel) 92%,transparent);--mx-glow:color-mix(in srgb,var(--nv-accent) 16%,transparent);--mx-glow-2:color-mix(in srgb,var(--h-violet) 12%,transparent);max-width:none;min-height:100vh;margin:0;padding:0;font-family:var(--mx-body);font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:clip;background:radial-gradient(70rem 40rem at 85% -10rem,var(--mx-glow),transparent 70%),radial-gradient(60rem 40rem at -10% 60%,var(--mx-glow-2),transparent 70%),var(--nv-bg);background-attachment:fixed}",
    ".nthview-mechanism button,.nthview-mechanism select,.nthview-mechanism input{font:inherit;color:inherit}",
    ".nthview-mechanism [hidden]{display:none!important}",
    ".nthview-mechanism code{font-family:var(--mx-mono);font-size:.875em;background:var(--mx-soft);border:1px solid var(--nv-border);padding:.05em .35em;border-radius:var(--mx-r1);overflow-wrap:anywhere}",
    ".nthview-mechanism strong{font-weight:700}",
    ".nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".nthview-wrap{position:relative;z-index:1;max-width:76rem;margin:0 auto;padding:0 1.25rem}",
    ".nthview-glass{background:var(--mx-glass);-webkit-backdrop-filter:blur(12px) saturate(1.2);backdrop-filter:blur(12px) saturate(1.2);border:1px solid var(--nv-border)}",
    /* the 3D stage and its labels sit behind everything */
    ".nthview-stage{position:fixed;inset:0;width:100vw;height:100vh;z-index:0;pointer-events:none;display:block;opacity:var(--mx-stage-o,1);transition:opacity .8s var(--mx-ease)}",
    ".nthview-plabels{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:var(--mx-label-o,1);transition:opacity .6s var(--mx-ease)}",
    ".nthview-plabel{position:absolute;left:0;top:0;padding:.125rem .5rem;border-radius:99px;font:600 11.5px/1.5 var(--mx-mono);white-space:nowrap;background:var(--mx-glass-2);border:1px solid var(--nv-border);color:var(--nv-fg);transition:opacity .4s var(--mx-ease);will-change:transform}",
    ".nthview-plabel i{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:.375rem;vertical-align:0}",
    ".nthview-plabel span{color:var(--nv-muted);font-weight:500;margin-right:.375rem;font-family:var(--mx-body)}",
    ".nthview-plabel.nthview-dim{opacity:.25}",
    /* buttons: one family */
    ".nthview-btn,.nthview-restart{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:44px;min-width:44px;border:1px solid var(--nv-border);background:var(--mx-glass-2);padding:.5rem .875rem;border-radius:var(--mx-r2);cursor:pointer;font-size:.875rem;font-weight:600;line-height:1.2;white-space:nowrap;transition:border-color var(--mx-fast) var(--mx-ease),background var(--mx-fast) var(--mx-ease),transform var(--mx-fast) var(--mx-ease)}",
    ".nthview-btn:hover,.nthview-restart:hover{border-color:var(--nv-muted)}",
    ".nthview-btn:active{transform:translateY(1px)}",
    ".nthview-btn:disabled{opacity:.4;cursor:default}",
    ".nthview-btn.nthview-primary{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--mx-on-accent)}",
    ".nthview-btn.nthview-primary:hover{border-color:var(--nv-fg)}",
    ".nthview-btn.nthview-icon{padding:0;width:44px}",
    ".nthview-btn.nthview-ghost{background:transparent;border-color:transparent;color:var(--nv-muted)}",
    ".nthview-btn.nthview-ghost:hover{color:var(--nv-fg);border-color:var(--nv-border)}",
    ".nthview-btn svg,.nthview-restart svg{width:18px;height:18px;flex:none}",
    ".nthview-sel{min-height:44px;max-width:100%;border:1px solid var(--nv-border);background:var(--mx-glass-2);border-radius:var(--mx-r2);padding:0 .5rem;font-size:.875rem;cursor:pointer}",
    /* top bar: title, chapter, progress */
    ".nthview-top{position:fixed;top:0;left:0;right:0;height:var(--mx-top);z-index:31;display:flex;align-items:center;gap:1rem;padding:0 .75rem 0 1.25rem;border-width:0 0 1px}",
    ".nthview-top-t{font-weight:700;font-size:.875rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:0 1 auto}",
    ".nthview-where{font:600 .75rem/1 var(--mx-mono);color:var(--nv-muted);letter-spacing:.04em;white-space:nowrap;margin-left:auto;overflow:hidden;text-overflow:ellipsis;min-width:0}",
    ".nthview-where b{color:var(--nv-accent)}",
    ".nthview-top .nthview-actions{display:flex;gap:.25rem;flex:none}",
    ".nthview-top .nthview-btn,.nthview-top .nthview-restart{min-height:36px;padding:.25rem .625rem;font-size:.8125rem}",
    ".nthview-progress{position:absolute;left:0;right:0;bottom:-1px;height:2px;background:var(--nv-accent);transform-origin:left;transform:scaleX(0)}",
    /* hero */
    ".nthview-hero{min-height:100vh;display:flex;align-items:center;padding:calc(var(--mx-top) + 2.5rem) 0 calc(var(--mx-dock) + 2rem)}",
    ".nthview-hero-in{max-width:40rem}",
    "@media (min-width:1000px){.nthview-hero-in{max-width:min(40rem,50vw)}}",
    ".nthview-kicker{font:600 .75rem/1.4 var(--mx-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--nv-accent)}",
    ".nthview-title{font-family:var(--mx-head);font-size:clamp(2.25rem,6vw,4.25rem);line-height:1.04;letter-spacing:var(--mx-head-ls);margin:.75rem 0 1rem;font-weight:var(--mx-head-w)}",
    ".nthview-sub{font-size:clamp(1.0625rem,1.6vw,1.25rem);line-height:1.5;color:var(--nv-muted);margin:0 0 1.5rem}",
    ".nthview-lead p{margin:0 0 1rem;font-size:1.0625rem}",
    ".nthview-scen-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(10.5rem,1fr));gap:.625rem;margin:1.5rem 0}",
    ".nthview-scen-card{text-align:left;border-radius:var(--mx-r2);padding:.75rem .875rem;cursor:pointer;display:grid;gap:.25rem;min-height:44px;transition:border-color var(--mx-fast) var(--mx-ease),transform var(--mx-fast) var(--mx-ease)}",
    ".nthview-scen-card:hover{border-color:var(--nv-muted);transform:translateY(-1px)}",
    ".nthview-scen-card b{font-size:.9375rem}",
    ".nthview-scen-card small{font-size:.8125rem;line-height:1.4;color:var(--nv-muted)}",
    ".nthview-scen-card[aria-pressed=true]{border-color:var(--nv-accent);box-shadow:inset 0 0 0 1px var(--nv-accent)}",
    ".nthview-toc{columns:2 15rem;column-gap:2rem;margin:1.5rem 0 0;padding:0;list-style:none;counter-reset:toc}",
    ".nthview-toc li{break-inside:avoid;counter-increment:toc}",
    ".nthview-toc button{display:flex;gap:.625rem;align-items:baseline;background:none;border:0;padding:.375rem 0;min-height:36px;cursor:pointer;text-align:left;font-size:.9375rem;color:var(--nv-fg)}",
    ".nthview-toc button::before{content:counter(toc,decimal-leading-zero);font:600 .75rem var(--mx-mono);color:var(--nv-accent)}",
    ".nthview-toc button:hover span{text-decoration:underline;text-underline-offset:3px}",
    ".nthview-cue{margin-top:2rem;font:500 .8125rem var(--mx-mono);color:var(--nv-muted);display:flex;align-items:center;gap:.5rem}",
    ".nthview-cue::before{content:'';width:1px;height:2rem;background:linear-gradient(var(--nv-accent),transparent);animation:nthview-cue 2s var(--mx-ease) infinite}",
    "@keyframes nthview-cue{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}",
    /* chapters */
    ".nthview-ch{position:relative;padding:7rem 0 3rem;scroll-margin-top:var(--mx-top)}",
    ".nthview-ch-head{max-width:44rem}",
    ".nthview-ch-num{font:600 .75rem/1.4 var(--mx-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--nv-accent)}",
    ".nthview-ch-num span{color:var(--nv-muted)}",
    ".nthview-ch-title{font-family:var(--mx-head);font-size:clamp(1.75rem,3.6vw,2.625rem);line-height:1.1;letter-spacing:var(--mx-head-ls);font-weight:var(--mx-head-w);margin:.5rem 0 1rem}",
    ".nthview-prose p{margin:0 0 1rem;font-size:1.0625rem;max-width:42rem}",
    ".nthview-goto{margin:.25rem 0 0;white-space:normal;text-align:left;justify-content:flex-start;max-width:100%}",
    /* scrollytelling: step cards beside a sticky panel of live figures */
    ".nthview-scrolly{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:3rem;align-items:start;margin-top:1.5rem}",
    ".nthview-steps{padding:8vh 0 22vh}",
    ".nthview-step{min-height:74vh;display:flex;align-items:center}",
    ".nthview-step-card{width:100%;border-left:3px solid var(--nv-border);border-radius:0 var(--mx-r3) var(--mx-r3) 0;padding:1rem 1.125rem;opacity:.42;transition:opacity .4s var(--mx-ease),border-color .4s var(--mx-ease),transform .4s var(--mx-ease);transform:translateX(-4px)}",
    ".nthview-step.nthview-on .nthview-step-card{opacity:1;border-left-color:var(--nv-accent);transform:none;box-shadow:0 20px 50px -28px rgba(0,0,0,.55)}",
    ".nthview-when{font:600 .75rem/1.4 var(--mx-mono);color:var(--nv-muted);display:flex;flex-wrap:wrap;gap:.25rem .625rem;align-items:center;margin-bottom:.375rem}",
    ".nthview-when b{color:var(--nv-accent)}",
    ".nthview-step h3{margin:0 0 .375rem;font-size:1.125rem;line-height:1.3}",
    ".nthview-step p{margin:0;font-size:1rem}",
    ".nthview-viz{position:sticky;top:calc(var(--mx-top) + 1.25rem);display:grid;gap:1rem;max-height:calc(100vh - var(--mx-top) - var(--mx-dock) - 2rem);overflow:auto;overscroll-behavior:contain;padding:2px;scrollbar-width:thin}",
    ".nthview-figgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,26rem),1fr));gap:1rem;margin-top:1.5rem}",
    /* pinned chapters: scrolling runs the clock */
    ".nthview-pin{position:relative}",
    ".nthview-pin-in{position:sticky;top:var(--mx-top);height:calc(100vh - var(--mx-top));display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:3rem;align-items:center;padding-bottom:var(--mx-dock)}",
    ".nthview-pin-l .nthview-mark{background:var(--mx-glass);-webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-radius:0 var(--mx-r2) var(--mx-r2) 0;padding:.625rem .875rem}",
    ".nthview-pin-l{display:grid;gap:1rem;align-content:start;align-self:stretch;padding-top:2.5rem}",
    ".nthview-bigtime{font:700 clamp(2.25rem,5vw,3.75rem)/1 var(--mx-mono);letter-spacing:-.02em;font-variant-numeric:tabular-nums}",
    ".nthview-bigtime small{display:block;font:500 .8125rem/1.4 var(--mx-body);color:var(--nv-muted);letter-spacing:0;margin-top:.5rem}",
    ".nthview-mark{font-size:1.0625rem;line-height:1.55;min-height:5.5em;margin:0;border-left:3px solid var(--nv-accent);padding:.25rem 0 .25rem 1rem;transition:opacity .3s var(--mx-ease)}",
    ".nthview-pinbar{position:relative;height:6px;border-radius:99px;background:var(--mx-grid);overflow:hidden}",
    ".nthview-pinbar span{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--nv-accent)}",
    ".nthview-pinhint{font:500 .75rem var(--mx-mono);color:var(--nv-muted)}",
    ".nthview-pin-r{display:grid;gap:1rem;max-height:calc(100vh - var(--mx-top) - var(--mx-dock) - 2rem);overflow:auto;padding:2px}",
    /* the dock: the clock, always at hand */
    ".nthview-dock{position:fixed;left:50%;bottom:12px;transform:translateX(-50%);z-index:30;width:min(70rem,calc(100% - 24px));border-radius:var(--mx-r3);padding:.5rem .625rem;display:grid;grid-template-columns:auto auto minmax(0,1fr) auto auto;grid-template-areas:'play time scrub nav opts';gap:.375rem .75rem;align-items:center;box-shadow:0 18px 48px -18px rgba(0,0,0,.55)}",
    ".nthview-d-play{grid-area:play}.nthview-d-time{grid-area:time}.nthview-d-scrub{grid-area:scrub}.nthview-d-nav{grid-area:nav}.nthview-d-opts{grid-area:opts}.nthview-d-more{grid-area:more;display:none}",
    ".nthview-d-nav,.nthview-d-opts{display:flex;gap:.375rem;align-items:center}",
    ".nthview-d-time{font:700 1rem/1.2 var(--mx-mono);font-variant-numeric:tabular-nums;min-width:8rem}",
    ".nthview-d-time small{display:block;font:500 .75rem/1.3 var(--mx-body);color:var(--nv-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:14rem}",
    ".nthview-d-scrub{position:relative;min-width:0;height:44px;display:flex;align-items:center}",
    ".nthview-range{-webkit-appearance:none;appearance:none;width:100%;height:44px;background:transparent;margin:0;cursor:pointer;--p:0%}",
    ".nthview-range::-webkit-slider-runnable-track{height:6px;border-radius:99px;background:linear-gradient(90deg,var(--nv-accent) 0 var(--p),var(--mx-grid) var(--p) 100%)}",
    ".nthview-range::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:var(--mx-panel);border:3px solid var(--nv-accent);margin-top:-8px;box-shadow:0 0 0 6px var(--mx-glow)}",
    ".nthview-range::-moz-range-track{height:6px;border-radius:99px;background:var(--mx-grid)}",
    ".nthview-range::-moz-range-progress{height:6px;border-radius:99px;background:var(--nv-accent)}",
    ".nthview-range::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:var(--mx-panel);border:3px solid var(--nv-accent)}",
    ".nthview-scrub-ev{position:absolute;left:11px;right:11px;top:6px;height:7px;pointer-events:none}",
    ".nthview-scrub-ev i{position:absolute;top:0;width:2px;height:7px;border-radius:1px;margin-left:-1px}",
    "@media (max-width:900px){.nthview-dock{grid-template-columns:auto minmax(0,1fr) auto auto;grid-template-areas:'play time nav more' 'scrub scrub scrub scrub' 'opts opts opts opts';bottom:8px;width:calc(100% - 16px);padding:.375rem .5rem;gap:.125rem .5rem}",
    "  .nthview-d-more{display:inline-flex}.nthview-dock:not(.nthview-open) .nthview-d-opts{display:none}.nthview-d-opts{flex-wrap:wrap;padding:.25rem 0}.nthview-d-scrub{height:32px}.nthview-range{height:32px}.nthview-scrub-ev{top:0}.nthview-d-time{min-width:0}.nthview-mechanism{--mx-dock:116px}}",
    ".nthview-seg{display:inline-flex;flex-wrap:wrap;border:1px solid var(--nv-border);border-radius:var(--mx-r2);background:var(--mx-soft);padding:3px;gap:2px;max-width:100%}",
    ".nthview-seg button{border:0;background:transparent;min-height:38px;padding:.25rem .75rem;border-radius:7px;cursor:pointer;font-size:.875rem;font-weight:550;color:var(--nv-muted);white-space:nowrap}",
    ".nthview-seg button:hover{color:var(--nv-fg)}",
    ".nthview-seg button[aria-pressed=true]{background:var(--mx-panel);color:var(--nv-fg);font-weight:700;box-shadow:0 1px 2px rgba(0,0,0,.12),inset 0 0 0 1px var(--nv-border)}",
    /* resume notice */
    ".nthview-resume{position:fixed;left:50%;bottom:calc(var(--mx-dock) + 8px);transform:translateX(-50%);z-index:35;display:flex;align-items:center;gap:.625rem;max-width:calc(100% - 2rem);padding:.625rem 1rem;border-radius:var(--mx-r2);font-size:.9375rem;box-shadow:0 12px 32px -12px rgba(0,0,0,.4);transition:opacity var(--mx-mid) var(--mx-ease)}",
    ".nthview-resume::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--nv-accent);flex:none}",
    ".nthview-resume.nthview-gone{opacity:0;pointer-events:none}",
    /* figure card */
    ".nthview-fig{position:relative;border-radius:var(--mx-r3);padding:1rem;min-width:0;margin:0;transition:filter var(--mx-mid) var(--mx-ease),opacity var(--mx-mid) var(--mx-ease)}",
    ".nthview-fig h3{font:600 .75rem/1.4 var(--mx-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--nv-muted);margin:0 0 .625rem}",
    ".nthview-legend{display:flex;flex-wrap:wrap;gap:.25rem 1rem;margin:0 0 .5rem;padding:0;list-style:none;font-size:.8125rem;color:var(--nv-muted)}",
    ".nthview-legend li{display:inline-flex;align-items:center;gap:.375rem;min-width:0}",
    ".nthview-legend b{color:var(--nv-fg);font-family:var(--mx-mono);font-weight:600;font-variant-numeric:tabular-nums}",
    ".nthview-sw{display:inline-block;width:14px;height:3px;border-radius:2px;background:currentColor;flex:none}",
    ".nthview-sw.nthview-dash{background:linear-gradient(90deg,currentColor 0 5px,transparent 5px 9px,currentColor 9px)}",
    ".nthview-sw.nthview-blk{height:10px;width:10px;border-radius:2px}",
    ".nthview-plot{position:relative;touch-action:pan-y;cursor:crosshair;-webkit-user-select:none;user-select:none}",
    ".nthview-plot svg{display:block;width:100%;overflow:visible}",
    ".nthview-mechanism svg text{font-family:var(--mx-body);font-size:12px;fill:var(--nv-muted);font-variant-numeric:tabular-nums}",
    ".nthview-mechanism svg .nthview-ylab{font-size:11.5px}",
    ".nthview-gl{stroke:var(--mx-grid);stroke-width:1}",
    ".nthview-base{stroke:var(--mx-axis);stroke-width:1}",
    ".nthview-cur{stroke:var(--nv-fg);stroke-width:1.5}",
    ".nthview-hov{stroke:var(--nv-muted);stroke-width:1;stroke-dasharray:3 3}",
    ".nthview-dot{stroke:var(--mx-panel);stroke-width:2}",
    ".nthview-thr{stroke-width:1.5;stroke-dasharray:6 4}",
    ".nthview-mechanism svg .nthview-thr-t{font-size:11.5px;font-weight:650;paint-order:stroke;stroke:var(--mx-panel);stroke-width:4px;stroke-linejoin:round}",
    ".nthview-tip{position:absolute;top:0;left:0;pointer-events:none;background:var(--mx-panel);border:1px solid var(--nv-border);border-radius:var(--mx-r2);padding:.375rem .625rem;font-size:.8125rem;line-height:1.45;box-shadow:0 8px 24px -10px rgba(0,0,0,.4);white-space:nowrap;z-index:3}",
    ".nthview-tip b{font-family:var(--mx-mono);font-weight:600}",
    ".nthview-tip-t{color:var(--nv-muted);font-family:var(--mx-mono)}",
    ".nthview-tip div{display:flex;align-items:center;gap:.375rem}",
    ".nthview-caption{font-size:.875rem;line-height:1.5;color:var(--nv-muted);margin:.75rem 0 0}",
    /* check: predict before the figures show */
    ".nthview-check{border:1px solid var(--nv-accent);border-radius:var(--mx-r3);padding:1rem 1.125rem;max-width:42rem;margin:1.5rem 0;background:color-mix(in srgb,var(--mx-hi) 85%,transparent)}",
    ".nthview-check h3{margin:0 0 .25rem;font:600 .75rem/1.4 var(--mx-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--nv-accent)}",
    ".nthview-check p{margin:0 0 .5rem}",
    ".nthview-check-q{font-weight:650;font-size:1.0625rem}",
    ".nthview-choices{display:grid;gap:.5rem;margin:.75rem 0}",
    ".nthview-choice{justify-content:flex-start;text-align:left;white-space:normal;font-weight:500;font-size:.9375rem;padding:.625rem .875rem}",
    ".nthview-mechanism .nthview-choice:disabled{opacity:1;cursor:default;color:var(--nv-muted)}",
    ".nthview-mechanism .nthview-choice[aria-pressed=true]:disabled,.nthview-mechanism .nthview-choice.nthview-right:disabled{color:var(--nv-fg)}",
    ".nthview-choice[aria-pressed=true]{border-color:var(--nv-accent);box-shadow:inset 0 0 0 1px var(--nv-accent)}",
    ".nthview-choice.nthview-right{border-color:var(--mx-ok);box-shadow:inset 0 0 0 1px var(--mx-ok)}",
    ".nthview-verdict{font-weight:700;margin:.5rem 0 .25rem}",
    ".nthview-ok{color:var(--mx-ok)}.nthview-no{color:var(--mx-no)}",
    ".nthview-veiled .nthview-fig{filter:blur(8px) saturate(.3);opacity:.45;pointer-events:none}",
    ".nthview-veil{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;z-index:4;padding:1rem}",
    ".nthview-veil span{background:var(--mx-panel);border:1px solid var(--nv-border);border-radius:99px;padding:.375rem .875rem;font-size:.875rem;font-weight:600;box-shadow:0 6px 18px -8px rgba(0,0,0,.35)}",
    ".nthview-figgrid,.nthview-pin-r{position:relative}",
    /* controls */
    ".nthview-ctl{border-radius:var(--mx-r3);padding:.5rem 1rem .75rem;margin:1.25rem 0;max-width:42rem}",
    ".nthview-ctl-h{display:flex;justify-content:space-between;align-items:center;gap:.5rem;font:600 .75rem/1.4 var(--mx-mono);text-transform:uppercase;letter-spacing:.1em;color:var(--nv-muted);min-height:44px}",
    ".nthview-ctl-h .nthview-btn{min-height:36px;text-transform:none;letter-spacing:0;font-family:var(--mx-body);font-size:.8125rem}",
    ".nthview-ctl-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(14rem,1fr));gap:0 1.5rem}",
    ".nthview-param{padding:.5rem 0;border-top:1px solid var(--nv-border)}",
    ".nthview-param-top{display:flex;justify-content:space-between;gap:1rem;align-items:baseline;font-size:.9375rem}",
    ".nthview-param-top label{font-weight:600}",
    ".nthview-param-top output{font-family:var(--mx-mono);font-weight:600;font-variant-numeric:tabular-nums;white-space:nowrap}",
    ".nthview-param-top output.nthview-tweaked::after{content:' • changed';font-family:var(--mx-body);font-weight:600;font-size:.75rem;color:var(--nv-accent)}",
    ".nthview-param small{display:block;color:var(--nv-muted);font-size:.8125rem;line-height:1.4}",
    ".nthview-switch{position:relative;display:inline-flex;align-items:center;gap:.75rem;min-height:44px;border:0;background:none;padding:0;cursor:pointer;font-size:.9375rem;font-weight:600}",
    ".nthview-switch i{position:relative;width:44px;height:26px;border-radius:99px;background:var(--mx-grid);box-shadow:inset 0 0 0 1px var(--nv-border);flex:none;transition:background var(--mx-fast) var(--mx-ease)}",
    ".nthview-switch i::after{content:'';position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:var(--mx-panel);box-shadow:0 1px 2px rgba(0,0,0,.3);transition:transform var(--mx-fast) var(--mx-ease)}",
    ".nthview-switch[aria-checked=true] i{background:var(--nv-accent)}",
    ".nthview-switch[aria-checked=true] i::after{transform:translateX(18px)}",
    ".nthview-param .nthview-seg{margin-top:.375rem}",
    /* the bench: free play */
    ".nthview-bench{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:2rem;align-items:start;margin-top:1.5rem}",
    ".nthview-bench .nthview-ctl{margin:0;max-width:none;position:sticky;top:calc(var(--mx-top) + 1rem);max-height:calc(100vh - var(--mx-top) - var(--mx-dock) - 2rem);overflow:auto}",
    ".nthview-bench-acts{display:flex;flex-wrap:wrap;gap:.5rem;margin:.75rem 0 .25rem}",
    /* drawer and pop-over */
    ".nthview-scrim{position:fixed;inset:0;background:rgba(0,0,0,.42);z-index:40;opacity:0;pointer-events:none;transition:opacity var(--mx-mid) var(--mx-ease)}",
    ".nthview-scrim.nthview-open{opacity:1;pointer-events:auto}",
    ".nthview-drawer{position:fixed;top:0;right:0;bottom:0;width:min(27rem,100%);background:var(--mx-panel);border-left:1px solid var(--nv-border);z-index:41;transform:translateX(100%);visibility:hidden;transition:transform var(--mx-mid) var(--mx-ease),visibility 0s linear var(--mx-mid);display:flex;flex-direction:column}",
    ".nthview-drawer.nthview-open{transform:none;visibility:visible;transition:transform var(--mx-mid) var(--mx-ease)}",
    ".nthview-drawer-h{display:flex;justify-content:space-between;align-items:center;gap:.5rem;padding:.5rem .5rem .5rem 1rem;border-bottom:1px solid var(--nv-border)}",
    ".nthview-drawer-h h2{margin:0;font-size:1rem}",
    ".nthview-drawer-b{overflow:auto;padding:1rem;flex:1;overscroll-behavior:contain}",
    ".nthview-drawer-b .nthview-ctl{margin:0 0 1rem;max-width:none}",
    ".nthview-drawer-b .nthview-ctl-grid{grid-template-columns:1fr}",
    ".nthview-drawer-b dt{font-weight:700;margin-top:1rem}",
    ".nthview-drawer-b dd{margin:.25rem 0 0;color:var(--nv-muted)}",
    ".nthview-term{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline dotted var(--nv-accent);text-decoration-thickness:2px;text-underline-offset:3px;cursor:help}",
    ".nthview-pop{position:absolute;z-index:45;width:max-content;max-width:min(22rem,calc(100vw - 2rem));background:var(--mx-panel);border:1px solid var(--nv-border);border-radius:var(--mx-r2);padding:.75rem 1rem;box-shadow:0 14px 36px -12px rgba(0,0,0,.45);font-size:.9375rem;line-height:1.5}",
    ".nthview-pop b{display:block;margin-bottom:.25rem}",
    /* tiles */
    ".nthview-tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));gap:.625rem}",
    ".nthview-tile{border:1px solid var(--nv-border);border-radius:var(--mx-r2);padding:.75rem;background:var(--mx-soft);min-width:0}",
    ".nthview-tile-l{font-size:.8125rem;color:var(--nv-muted);line-height:1.3}",
    ".nthview-tile-v{font-family:var(--mx-mono);font-size:1.625rem;font-weight:650;line-height:1.2;margin:.25rem 0 .125rem;font-variant-numeric:tabular-nums;overflow-wrap:anywhere}",
    ".nthview-tile-d{font-size:.8125rem;font-variant-numeric:tabular-nums;color:var(--nv-muted)}",
    ".nthview-tile-d.nthview-good{color:var(--mx-ok)}.nthview-tile-d.nthview-bad{color:var(--mx-no)}",
    ".nthview-spark{display:block;width:100%;height:30px;margin-top:.375rem;overflow:visible}",
    /* bars */
    ".nthview-bars{display:grid;gap:.5rem}",
    ".nthview-barrow{display:grid;grid-template-columns:minmax(4.5rem,8.5rem) minmax(0,1fr) 5.25rem;gap:.625rem;align-items:center;font-size:.875rem}",
    ".nthview-bartrack{position:relative;height:16px;background:var(--mx-soft);border-radius:4px;overflow:hidden;box-shadow:inset 0 0 0 1px var(--mx-grid)}",
    ".nthview-barfill{position:absolute;left:0;top:0;bottom:0;width:0;border-radius:4px;transition:width .25s var(--mx-ease)}",
    ".nthview-barval{text-align:right;font-family:var(--mx-mono);font-variant-numeric:tabular-nums;font-weight:600;white-space:nowrap}",
    ".nthview-scale{display:flex;justify-content:space-between;font-size:.75rem;color:var(--nv-muted);font-variant-numeric:tabular-nums}",
    ".nthview-bars .nthview-scale{margin-left:calc(min(8.5rem,30%) + .625rem);margin-right:5.875rem}",
    /* gauge */
    ".nthview-gauge-top{display:flex;align-items:baseline;gap:.25rem .75rem;flex-wrap:wrap}",
    ".nthview-gauge-v{font-family:var(--mx-mono);font-size:1.75rem;font-weight:650;line-height:1.1;font-variant-numeric:tabular-nums}",
    ".nthview-pill{display:inline-block;font-size:.75rem;font-weight:700;padding:.0625rem .5rem;border-radius:99px;border:1.5px solid currentColor;line-height:1.5}",
    ".nthview-gauge-track{position:relative;height:22px;border-radius:5px;overflow:hidden;margin:.75rem 0 .25rem;background:var(--mx-soft);box-shadow:inset 0 0 0 1px var(--mx-grid)}",
    ".nthview-gauge-zone{position:absolute;top:0;bottom:0;opacity:.24}",
    ".nthview-gauge-edge{position:absolute;top:0;bottom:0;width:2px;margin-left:-1px;opacity:.9}",
    ".nthview-gauge-fill{position:absolute;left:0;top:7px;bottom:7px;width:0;background:var(--nv-fg);border-radius:0 2px 2px 0;transition:width .25s var(--mx-ease)}",
    ".nthview-gauge-lab{font-size:.8125rem;color:var(--nv-muted)}",
    /* event timeline */
    ".nthview-evrow{display:grid;grid-template-columns:minmax(7rem,11rem) minmax(0,1fr);gap:0 .75rem;align-items:center;border-top:1px solid var(--mx-grid)}",
    ".nthview-evrow:first-child{border-top:0}",
    ".nthview-evname{display:flex;align-items:center;gap:.5rem;min-height:44px;background:none;border:0;padding:.25rem 0;cursor:pointer;font-size:.875rem;font-weight:600;text-align:left;line-height:1.25}",
    ".nthview-evname small{color:var(--nv-muted);font-weight:500;font-family:var(--mx-mono)}",
    ".nthview-evdot{width:10px;height:10px;border-radius:50%;flex:none}",
    ".nthview-evlast{grid-column:2;font-size:.75rem;color:var(--nv-muted);margin:-.375rem 0 .375rem}",
    ".nthview-evaxis{margin-left:calc(min(11rem,32%) + .75rem)}",
    "@media (max-width:560px){.nthview-evrow{grid-template-columns:minmax(0,1fr)}.nthview-evlast{grid-column:1}.nthview-evaxis{margin-left:0}.nthview-evname{min-height:36px}}",
    /* calculation table */
    ".nthview-calc-ev{font-size:.875rem;margin:0 0 .5rem;padding:.5rem .75rem;border-radius:var(--mx-r2);background:var(--mx-soft)}",
    ".nthview-calc-ev b{font-weight:700}",
    ".nthview-calc{width:100%;border-collapse:collapse;font-size:.875rem;table-layout:fixed}",
    ".nthview-calc col.nthview-c1{width:2rem}.nthview-calc col.nthview-c2{width:46%}.nthview-calc col.nthview-c4{width:6.5rem}",
    ".nthview-calc th{font-size:.75rem;text-transform:uppercase;letter-spacing:.06em;color:var(--nv-muted);text-align:left;font-weight:700;padding:.375rem .5rem}",
    ".nthview-calc td{padding:.5rem;border-top:1px solid var(--mx-grid);vertical-align:top;transition:background .4s var(--mx-ease)}",
    ".nthview-calc .nthview-n{color:var(--nv-muted);font-family:var(--mx-mono);width:1.75rem}",
    ".nthview-mechanism .nthview-calc .nthview-f{display:block;font-family:var(--mx-mono);font-size:.8125rem;color:var(--nv-muted);overflow-wrap:break-word;margin-top:.25rem;background:none;border:0;padding:0}",
    ".nthview-calc .nthview-res{text-align:right;font-family:var(--mx-mono);white-space:nowrap}",
    ".nthview-calc .nthview-res b{font-weight:700}",
    ".nthview-calc .nthview-res small{display:block;color:var(--nv-muted)}",
    ".nthview-calc tr.nthview-chg td{background:color-mix(in srgb,var(--nv-accent) 8%,transparent)}",
    ".nthview-calc tr.nthview-chg .nthview-res b{color:var(--nv-accent)}",
    ".nthview-calc tr.nthview-skip td{opacity:.6}",
    ".nthview-in{display:inline-block;margin:0 .625rem .125rem 0;font-family:var(--mx-mono);font-size:.75rem;color:var(--nv-muted);white-space:nowrap}",
    ".nthview-in b{color:var(--nv-fg);font-weight:600}",
    "@media (max-width:640px){.nthview-calc thead,.nthview-calc colgroup{display:none}.nthview-calc tr{display:grid;grid-template-columns:1.5rem minmax(0,1fr) auto;border-top:1px solid var(--mx-grid);padding:.375rem 0}.nthview-calc td{border:0;padding:.125rem .25rem}.nthview-calc td.nthview-ins{grid-column:2 / 4}.nthview-calc tr td:nth-child(4){grid-row:1;grid-column:3}}",
    /* small multiples and heat map */
    ".nthview-multi{display:grid;grid-template-columns:repeat(auto-fit,minmax(12.5rem,1fr));gap:.625rem}",
    ".nthview-mini{border:1px solid var(--nv-border);border-radius:var(--mx-r2);padding:.375rem .625rem .5rem;min-width:0}",
    ".nthview-mini.nthview-cur-s{border-color:var(--nv-accent);box-shadow:inset 0 0 0 1px var(--nv-accent)}",
    ".nthview-mini-h{display:flex;justify-content:space-between;align-items:center;gap:.5rem;width:100%;min-height:36px;background:none;border:0;padding:0;cursor:pointer;font-size:.8125rem;font-weight:650;text-align:left}",
    ".nthview-mini-h b{font-family:var(--mx-mono);font-variant-numeric:tabular-nums}",
    ".nthview-heat{display:grid;grid-template-columns:minmax(5rem,9rem) minmax(0,1fr);gap:0 .625rem}",
    ".nthview-heat-l{display:flex;flex-direction:column}",
    ".nthview-heat-l button{height:30px;display:flex;align-items:center;background:none;border:0;padding:0;cursor:pointer;font-size:.8125rem;font-weight:600;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-heat-l button[aria-pressed=true]{color:var(--nv-accent)}",
    ".nthview-heat-key{display:flex;align-items:center;gap:.5rem;margin-top:.625rem;font-size:.75rem;color:var(--nv-muted);font-variant-numeric:tabular-nums}",
    ".nthview-heat-key i{flex:0 1 10rem;height:10px;border-radius:3px;background:linear-gradient(90deg,var(--mx-soft),var(--nv-accent));box-shadow:inset 0 0 0 1px var(--mx-grid)}",
    /* state chips */
    ".nthview-chips{display:flex;flex-wrap:wrap;gap:.375rem}",
    ".nthview-chip{display:inline-flex;align-items:baseline;gap:.375rem;font:12.5px/1.6 var(--mx-mono);padding:.125rem .625rem;border-radius:var(--mx-r1);border:1px solid var(--nv-border);background:var(--mx-soft);white-space:nowrap}",
    ".nthview-chip span{color:var(--nv-muted)}",
    ".nthview-chip b{font-weight:700}",
    ".nthview-chip.nthview-flash{animation:nthview-flash 1s var(--mx-ease)}",
    "@keyframes nthview-flash{from{border-color:var(--c);box-shadow:0 0 0 3px color-mix(in srgb,var(--c) 30%,transparent)}to{border-color:var(--nv-border);box-shadow:none}}",
    /* calculation flow */
    ".nthview-flow{overflow-x:auto;scrollbar-width:thin}",
    ".nthview-flow svg{display:block;width:100%;min-width:34rem;height:auto;overflow:visible}",
    ".nthview-flow .nthview-fe{fill:none;stroke:var(--mx-axis);stroke-width:1.25;opacity:.45;transition:opacity .3s var(--mx-ease),stroke .3s}",
    ".nthview-flow .nthview-fe.nthview-hot{opacity:1;stroke-width:2}",
    ".nthview-flow .nthview-fn rect{fill:var(--mx-soft);stroke:var(--nv-border);stroke-width:1;transition:stroke .3s,fill .3s}",
    ".nthview-flow .nthview-fn.nthview-hot rect{stroke-width:2}",
    ".nthview-flow .nthview-fn.nthview-par rect{fill:transparent;stroke-dasharray:3 3}",
    ".nthview-mechanism .nthview-flow text.nthview-fl{font-size:11px;fill:var(--nv-muted)}",
    ".nthview-mechanism .nthview-flow text.nthview-fv{font:700 13px var(--mx-mono);fill:var(--nv-fg)}",
    ".nthview-flow .nthview-pk{filter:drop-shadow(0 0 4px currentColor)}",
    /* closing */
    ".nthview-closing{position:relative;z-index:1;padding:7rem 0 calc(var(--mx-dock) + 3rem)}",
    ".nthview-closing ul{padding-left:1.25rem;max-width:42rem}",
    ".nthview-closing li{margin:.5rem 0}",
    ".nthview-closing p{max-width:42rem;font-size:1.0625rem}",
    ".nthview-foot{margin-top:2rem;color:var(--nv-muted);font-size:.875rem;max-width:42rem}",
    /* reduced motion: the clock still runs, nothing eases */
    ".nthview-rm *,.nthview-rm *::before,.nthview-rm *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}",
    "@media (max-width:900px){.nthview-scrolly,.nthview-pin-in,.nthview-bench{grid-template-columns:minmax(0,1fr);gap:1rem}",
    "  .nthview-viz{top:calc(var(--mx-top) + .5rem);z-index:2;order:-1;display:flex;gap:.625rem;overflow-x:auto;overflow-y:hidden;max-height:none;scroll-snap-type:x mandatory;padding:2px 2px 6px;scrollbar-width:thin}",
    "  .nthview-viz > .nthview-fig{flex:0 0 calc(100% - 1.5rem);scroll-snap-align:start;max-height:46vh;overflow:auto;background:var(--mx-glass-2)}",
    "  .nthview-viz > .nthview-fig:only-child{flex-basis:100%}",
    "  .nthview-plabels{display:none}",
    "  .nthview-steps{padding:30vh 0 40vh}.nthview-step{min-height:58vh;align-items:flex-start}",
    "  .nthview-pin-in{align-content:start;padding-top:1rem;gap:.75rem}.nthview-pin-r{max-height:52vh}.nthview-mark{min-height:0}.nthview-bigtime{font-size:2rem}",
    "  .nthview-bench .nthview-ctl{position:static;max-height:none}.nthview-ch{padding-top:5rem}.nthview-top-t{display:none}.nthview-where{margin-left:0;flex:1}}",
    "@media (max-width:520px){.nthview-wrap{padding:0 1rem}.nthview-fig{padding:.75rem}.nthview-barrow{grid-template-columns:minmax(4rem,6.5rem) minmax(0,1fr) 4.75rem}.nthview-bars .nthview-scale{margin-left:calc(min(6.5rem,30%) + .625rem);margin-right:5.375rem}.nthview-heat{grid-template-columns:minmax(4.5rem,6.5rem) minmax(0,1fr)}.nthview-tile-v{font-size:1.25rem}.nthview-top .nthview-btn span{display:none}}"
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

  // ---- progress storage (identical in every view, §5.5) ------------------
  var STORE_VERSION = 1;
  function storageKey(data) {
    var s = JSON.stringify(data), h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return "nthview:mechanism:" + (h >>> 0).toString(36);
  }
  function loadState(key) {
    try { var raw = root.localStorage.getItem(key); if (!raw) return null; var st = JSON.parse(raw); return st && st.v === STORE_VERSION ? st : null; }
    catch (e) { return null; }
  }
  function saveState(key, state) {
    try { state.v = STORE_VERSION; state.savedAt = Date.now(); root.localStorage.setItem(key, JSON.stringify(state)); }
    catch (e) { /* storage unavailable or full: keep playing without saving */ }
  }
  function clearState(key) { try { root.localStorage.removeItem(key); } catch (e) {} }
  function restartButton(container, data, key) {
    var b = el("button", { type: "button", class: "nthview-restart", text: "Restart", title: "Start again from the beginning" });
    b.addEventListener("click", function () {
      if (!root.confirm("Start again from the beginning? Your progress here will be erased.")) return;
      clearState(key);
      NthView.build(container, data);
    });
    return b;
  }

  /* ---- expression compiler (same language as scripts/validate.js) ---- */
  var FUNCS = { min: [1, 8], max: [1, 8], abs: [1, 1], sqrt: [1, 1], pow: [2, 2], exp: [1, 1], log: [1, 1], floor: [1, 1], ceil: [1, 1], round: [1, 1], clamp: [3, 3], "if": [3, 3], noise: [1, 1] };
  var noiseSeed = 1;
  function noise(x) {
    var h = Math.imul((Math.floor(x * 1000) | 0) ^ 0x9e3779b9, 0x85ebca6b) ^ Math.imul(noiseSeed | 0, 0xc2b2ae35);
    h ^= h >>> 16; h = Math.imul(h, 0x7feb352d); h ^= h >>> 15; h = Math.imul(h, 0x846ca68b); h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  }
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
          if (!FUNCS.hasOwnProperty(t.v)) throw new Error("unknown function \"" + t.v + "\"");
          i++;
          var args = [];
          if (!eat(")")) {
            do { args.push(orExpr()); } while (eat(","));
            if (!eat(")")) throw new Error("missing ) after the arguments of " + t.v);
          }
          var ar = FUNCS[t.v];
          if (args.length < ar[0] || args.length > ar[1]) throw new Error(t.v + " takes " + ar[0] + " argument(s)");
          return callFn(t.v, args);
        }
        if (FUNCS.hasOwnProperty(t.v)) throw new Error("function \"" + t.v + "\" must be called with parentheses");
        if (t.v === "pi") return function () { return Math.PI; };
        if (ids.indexOf(t.v) === -1) ids.push(t.v);
        return function (env) { var x = env[t.v]; return typeof x === "number" ? x : 0; };
      }
      if (eat("(")) { var e = orExpr(); if (!eat(")")) throw new Error("missing )"); return e; }
      throw new Error("unexpected \"" + t.v + "\"");
    }
    function callFn(name, a) {
      var n = a.length;
      var f = {
        min: function (env) { var r = a[0](env); for (var j = 1; j < n; j++) { var x = a[j](env); if (x < r) r = x; } return r; },
        max: function (env) { var r = a[0](env); for (var j = 1; j < n; j++) { var x = a[j](env); if (x > r) r = x; } return r; },
        abs: function (env) { return Math.abs(a[0](env)); },
        sqrt: function (env) { return Math.sqrt(a[0](env)); },
        pow: function (env) { return Math.pow(a[0](env), a[1](env)); },
        exp: function (env) { return Math.exp(a[0](env)); },
        log: function (env) { return Math.log(a[0](env)); },
        floor: function (env) { return Math.floor(a[0](env) + 1e-9); },
        ceil: function (env) { return Math.ceil(a[0](env) - 1e-9); },
        round: function (env) { return Math.round(a[0](env)); },
        clamp: function (env) { return Math.min(a[2](env), Math.max(a[1](env), a[0](env))); },
        "if": function (env) { return a[0](env) ? a[1](env) : a[2](env); },
        noise: function (env) { return noise(a[0](env)); }
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
  function C(src) { var c = compileExpr(String(src)); return c.error ? { fn: function () { return 0; }, ids: [] } : c; }

  /* ---- the model and the engine ---- */
  function buildModel(data) {
    var M = { H: data.clock.horizon, unit: data.clock.unit, seed: typeof data.seed === "number" ? data.seed : 1, params: [], pi: {}, vars: [], vi: {}, rules: [], events: [], scen: [], meta: {} };
    (data.parameters || []).forEach(function (q) {
      var p = { id: q.id, label: q.label, description: q.description, min: q.min, max: q.max, def: q["default"], step: q.step || (q.max - q.min) / 100, control: q.control || "slider", options: q.options || null, format: q.format, unit: q.unit };
      M.pi[q.id] = M.params.length; M.params.push(p); M.meta[q.id] = p;
    });
    data.variables.forEach(function (v, i) {
      var x = { id: v.id, i: i, label: v.label, description: v.description, lo: typeof v.min === "number" ? v.min : -Infinity, hi: typeof v.max === "number" ? v.max : Infinity, init: C(v.initial), src: String(v.initial), format: v.format, unit: v.unit, color: v.color };
      M.vi[v.id] = i; M.vars.push(x); M.meta[v.id] = x;
    });
    data.variables.forEach(function (v, i) { if (!M.vars[i].color) M.vars[i].color = HUE_ORDER[i % HUE_ORDER.length]; });
    data.rules.forEach(function (r, i) {
      var c = C(r.expr);
      M.rules.push({ n: i + 1, v: M.vars[M.vi[r.target]], c: c, src: String(r.expr), when: r.when !== undefined ? C(r.when) : null, whenSrc: r.when !== undefined ? String(r.when) : null, label: r.label || "", note: r.note || "", ids: c.ids.concat(r.when !== undefined ? C(r.when).ids.filter(function (id) { return c.ids.indexOf(id) === -1; }) : []) });
    });
    var evColor = 0;
    function ev(e) {
      var o = { id: e.id, label: e.label, note: e.note || "", color: e.color || HUE_ORDER[(evColor++ + 3) % HUE_ORDER.length], at: null, every: null, when: null, once: e.once === true, set: [] };
      if (e.at !== undefined) { o.at = {}; (Array.isArray(e.at) ? e.at : [e.at]).forEach(function (k) { o.at[k] = true; }); }
      if (e.every) o.every = { period: e.every.period, from: e.every.from === undefined ? e.every.period : e.every.from, to: e.every.to === undefined ? M.H : e.every.to };
      if (e.when !== undefined) o.when = C(e.when);
      if (e.set) Object.keys(e.set).forEach(function (k) { o.set.push({ v: M.vars[M.vi[k]], c: C(e.set[k]), src: String(e.set[k]) }); });
      return o;
    }
    (data.events || []).forEach(function (e) { M.events.push(ev(e)); });
    data.scenarios.forEach(function (s) {
      M.scen.push({ id: s.id, label: s.label, description: s.description || "", params: s.parameters || {}, events: (s.events || []).map(ev) });
    });
    M.stage = data.stage && data.stage.variables ? data.stage.variables.slice() : null;
    M.allEventIds = [];
    M.events.concat.apply(M.events, M.scen.map(function (s) { return s.events; })).forEach(function (e) { if (M.allEventIds.indexOf(e.id) === -1) M.allEventIds.push(e.id); });
    return M;
  }
  function clampTo(v, x) { if (typeof x !== "number" || !isFinite(x)) x = 0; return x < v.lo ? v.lo : x > v.hi ? v.hi : x; }
  function baseParams(M, sc, tweaks) {
    var o = {};
    M.params.forEach(function (q) { o[q.id] = tweaks && tweaks.hasOwnProperty(q.id) ? tweaks[q.id] : sc.params.hasOwnProperty(q.id) ? sc.params[q.id] : q.def; });
    return o;
  }
  function freshEnv(M, params) {
    var env = { t: 0 };
    M.params.forEach(function (q) { env[q.id] = params[q.id]; });
    M.allEventIds.forEach(function (id) { env[id] = 0; });
    M.vars.forEach(function (v) { env[v.id] = 0; });
    return env;
  }
  /* One tick of the pipeline: events, then rules. rec (optional) records what was computed. */
  function stepTick(M, env, k, active, firedOnce, fired, rec) {
    env.t = k;
    for (var a = 0; a < active.length; a++) env[active[a].id] = 0;
    for (var j = 0; j < active.length; j++) {
      var e = active[j], go = false;
      if (e.at) go = e.at[k] === true;
      else if (e.every) go = k >= e.every.from && k <= e.every.to && (k - e.every.from) % e.every.period === 0;
      else if (!(e.once && firedOnce[e.id])) { var w = e.when.fn(env); go = typeof w === "number" && isFinite(w) && w !== 0; }
      if (!go) continue;
      env[e.id] = 1; firedOnce[e.id] = true;
      if (fired) fired[e.id][k] = 1;
      var sets = rec ? [] : null;
      for (var s = 0; s < e.set.length; s++) {
        var before = env[e.set[s].v.id];
        env[e.set[s].v.id] = clampTo(e.set[s].v, e.set[s].c.fn(env));
        if (sets) sets.push({ v: e.set[s].v, before: before, after: env[e.set[s].v.id] });
      }
      if (rec) rec.events.push({ e: e, sets: sets });
    }
    for (var r = 0; r < M.rules.length; r++) {
      var rule = M.rules[r], rr = rec ? rec.rules[r] : null;
      if (rr) { for (var q = 0; q < rule.ids.length; q++) rr.inputs[q] = typeof env[rule.ids[q]] === "number" ? env[rule.ids[q]] : 0; rr.before = env[rule.v.id]; }
      if (rule.when) { var wv = rule.when.fn(env); if (!(typeof wv === "number" && isFinite(wv) && wv !== 0)) { if (rr) { rr.skipped = true; rr.after = rr.before; } continue; } }
      env[rule.v.id] = clampTo(rule.v, rule.c.fn(env));
      if (rr) { rr.skipped = false; rr.after = env[rule.v.id]; }
    }
  }
  function simulate(M, sc, params) {
    var H = M.H, nv = M.vars.length, active = M.events.concat(sc.events), env = freshEnv(M, params), fired = {}, firedOnce = {};
    noiseSeed = M.seed;
    var vals = [], lo = new Float64Array(nv), hi = new Float64Array(nv);
    active.forEach(function (e) { fired[e.id] = new Uint8Array(H + 1); });
    for (var i = 0; i < nv; i++) {
      var v = M.vars[i];
      vals.push(new Float64Array(H + 1));
      env[v.id] = clampTo(v, v.init.fn(env));
      vals[i][0] = env[v.id]; lo[i] = hi[i] = env[v.id];
    }
    for (var k = 1; k <= H; k++) {
      stepTick(M, env, k, active, firedOnce, fired, null);
      for (var j = 0; j < nv; j++) { var x = env[M.vars[j].id]; vals[j][k] = x; if (x < lo[j]) lo[j] = x; if (x > hi[j]) hi[j] = x; }
    }
    var any = [];
    for (var t = 1; t <= H; t++) for (var a = 0; a < active.length; a++) if (fired[active[a].id][t]) { any.push(t); break; }
    return { sc: sc, params: params, vals: vals, lo: lo, hi: hi, active: active, fired: fired, firedAny: new Int32Array(any) };
  }
  /* Re-run tick k from the stored state of tick k − 1, recording every input and result. */
  function replay(M, run, k, rec) {
    var env = freshEnv(M, run.params), firedOnce = {};
    noiseSeed = M.seed;
    M.vars.forEach(function (v, i) { env[v.id] = run.vals[i][Math.max(0, k - 1)]; });
    run.active.forEach(function (e) { if (e.once) for (var t = 1; t < k; t++) if (run.fired[e.id][t]) { firedOnce[e.id] = true; break; } });
    rec.events.length = 0;
    stepTick(M, env, k, run.active, firedOnce, null, rec);
  }

  /* ---- formatting ---- */
  var UNIT_SEC = { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800 };
  var UNIT_ABBR = { second: "s", minute: "min", hour: "h", day: "d", week: "wk" };
  var COUNT_UNITS = { request: ["request", "requests"], round: ["round", "rounds"], step: ["step", "steps"] };
  var DUR_PARTS = [[604800, "wk"], [86400, "d"], [3600, "h"], [60, "min"], [1, "s"]];
  var DUR_TOP = { second: 3600, minute: 3600, hour: 86400, day: 86400, week: 604800 };
  function grp(s) { var p = s.split("."); p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","); return p.join("."); }
  function trimZ(s) { return s.indexOf(".") === -1 ? s : s.replace(/\.?0+$/, ""); }
  function autoNum(a) {
    if (a >= 1e15) return compactNum(a);
    if (a >= 100) return grp(String(Math.round(a)));
    if (a >= 10) return trimZ(a.toFixed(1));
    if (a >= 1) return trimZ(a.toFixed(2));
    if (a === 0) return "0";
    if (a >= 0.01) return trimZ(a.toFixed(2));
    if (a < 1e-9) return "0";
    return String(Number(a.toPrecision(2)));
  }
  function compactNum(a) {
    var u = [[1e12, "T"], [1e9, "B"], [1e6, "M"], [1e3, "k"]];
    for (var i = 0; i < u.length; i++) if (a >= u[i][0]) { var q = a / u[i][0]; return (q >= 100 ? String(Math.round(q)) : trimZ(q.toFixed(1))) + u[i][1]; }
    return autoNum(a);
  }
  function pctNum(a) {
    var p = a * 100;
    if (p === 0) return "0%";
    if (p >= 10) return grp(trimZ(p.toFixed(p >= 100 ? 0 : 1))) + "%";
    if (p >= 1) return trimZ(p.toFixed(1)) + "%";
    if (p >= 0.01) return trimZ(p.toFixed(2)) + "%";
    return String(Number(p.toPrecision(1))) + "%";
  }
  function bytesNum(a) {
    var u = ["B", "KiB", "MiB", "GiB", "TiB", "PiB"], i = 0;
    while (a >= 1024 && i < u.length - 1) { a /= 1024; i++; }
    return (i === 0 ? String(Math.round(a)) : trimZ(a.toFixed(a >= 100 ? 0 : 1))) + " " + u[i];
  }
  function fmtDur(v, unit, short) {
    if (typeof v !== "number" || !isFinite(v)) v = 0;
    if (COUNT_UNITS[unit]) { var n = Math.round(v * 100) / 100; return short ? grp(trimZ(String(n))) : grp(trimZ(String(n))) + " " + COUNT_UNITS[unit][Math.abs(n) === 1 ? 0 : 1]; }
    var neg = v < 0 ? "−" : "", base = UNIT_SEC[unit], a = Math.abs(v);
    if (a === 0) return "0 " + UNIT_ABBR[unit];
    if (a < 1) return neg + trimZ(a.toFixed(2)) + " " + UNIT_ABBR[unit];
    var rem = Math.round(a) * base, out = [];
    for (var i = 0; i < DUR_PARTS.length && out.length < 2; i++) {
      var p = DUR_PARTS[i];
      if (p[0] < base) break;
      if (p[0] > DUR_TOP[unit]) continue;
      if (rem >= p[0]) { var q = Math.floor(rem / p[0]); rem -= q * p[0]; out.push(q + " " + p[1]); }
      else if (out.length) break;
    }
    return neg + out.join(" ");
  }
  var CLOCK = "minute";
  function fmt(x, f, unit) {
    if (typeof x !== "number" || !isFinite(x)) x = 0;
    if (f === "duration") return fmtDur(x, CLOCK);
    var a = Math.abs(x), s;
    switch (f) {
      case "int": s = grp(String(Math.round(a))); break;
      case "dp1": s = grp(a.toFixed(1)); break;
      case "dp2": s = grp(a.toFixed(2)); break;
      case "percent": s = pctNum(a); break;
      case "bytes": s = bytesNum(a); break;
      case "compact": s = compactNum(a); break;
      case "plain": s = String(Number(a.toPrecision(4))); break;
      default: s = autoNum(a);
    }
    var neg = x < 0 && /[1-9]/.test(s);
    return (neg ? "−" : "") + s + (unit ? (/^[A-Za-z]/.test(unit) ? " " : "") + unit : "");
  }
  function fmtMeta(m, x) { return fmt(x, m.format, m.unit); }
  function niceCeil(x) {
    if (!(x > 0)) return 1;
    var p = Math.pow(10, Math.floor(Math.log(x) / Math.LN10)), q = x / p;
    return (q <= 1 + 1e-9 ? 1 : q <= 2 ? 2 : q <= 2.5 ? 2.5 : q <= 5 ? 5 : 10) * p;
  }
  function niceTicks(lo, hi, n) {
    var span = hi - lo; if (!(span > 0)) return [lo];
    var raw = span / n, p = Math.pow(10, Math.floor(Math.log(raw) / Math.LN10)), q = raw / p;
    var step = (q < 1.5 ? 1 : q < 3 ? 2 : q < 7 ? 5 : 10) * p, out = [];
    for (var v = Math.ceil(lo / step - 1e-9) * step; v <= hi + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-9 ? 0 : v);
    return out;
  }
  var TIME_STEPS = {
    second: [1, 2, 5, 10, 15, 30, 60, 120, 300, 600, 900, 1800, 3600, 7200, 21600, 43200, 86400],
    minute: [1, 2, 5, 10, 15, 30, 60, 120, 180, 240, 360, 720, 1440, 2880, 10080],
    hour: [1, 2, 3, 6, 12, 24, 48, 72, 168, 336, 720],
    day: [1, 2, 5, 7, 14, 28, 60, 91, 182, 365],
    week: [1, 2, 4, 8, 13, 26, 52, 104]
  };
  function timeTicks(w0, w1, n) {
    var span = w1 - w0, steps = TIME_STEPS[CLOCK], step = 0;
    if (!steps) { var t = niceTicks(w0, w1, n); return t.filter(function (x) { return x === Math.round(x); }); }
    for (var i = 0; i < steps.length; i++) if (span / steps[i] <= n) { step = steps[i]; break; }
    if (!step) step = steps[steps.length - 1] * Math.ceil(span / n / steps[steps.length - 1]);
    var out = [];
    for (var k = Math.ceil(w0 / step) * step; k <= w1; k += step) out.push(k);
    return out;
  }

  /* ---- SVG and icons ---- */
  function svgEl(tag, attrs) {
    var n = root.document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    return n;
  }
  var ICONS = {
    play: "M8 5.5v13l10.5-6.5z",
    pause: "M7.5 5h3v14h-3zM13.5 5h3v14h-3z",
    prev: "M6 5v14M18 6l-9 6 9 6z",
    next: "M18 5v14M6 6l9 6-9 6z",
    tune: "M4 7h10M18 7h2M4 17h4M12 17h8M16 4.5v5M10 14.5v5",
    book: "M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5",
    more: "M5 12h.01M12 12h.01M19 12h.01",
    sun: "M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6 4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    moon: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z",
    auto: "M12 3a9 9 0 1 0 0 18zM12 3a9 9 0 0 1 0 18",
    close: "M6 6l12 12M18 6L6 18",
    jump: "M5 12h12M13 6l6 6-6 6"
  };
  function icon(name) {
    var s = svgEl("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" });
    var filled = name === "play" || name === "pause" || name === "prev" || name === "next";
    s.appendChild(svgEl("path", filled ? { d: ICONS[name], fill: "currentColor", stroke: "currentColor", "stroke-width": name === "prev" || name === "next" ? "2" : "0", "stroke-linejoin": "round", "stroke-linecap": "round" } : { d: ICONS[name], fill: "none", stroke: "currentColor", "stroke-width": name === "more" ? "3.2" : "2", "stroke-linecap": "round", "stroke-linejoin": "round" }));
    return s;
  }
  function hue(h) { return "var(--h-" + h + ")"; }
  function pickTheme(data) {
    if (data.theme && THEMES.indexOf(data.theme) !== -1) return data.theme;
    var h = 0, s = String(data.title || "");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return THEMES[h % THEMES.length];
  }
  function r1(x) { return Math.round(x * 10) / 10; }

  // ---- view-specific rendering: data is already valid here ---------------
  /* ---- the stage: one glowing pillar per state variable, one arc per rule input, pulses on every tick ----
     Built with three.js (declared in NthView.libs). Without WebGL it returns null and the page works without it. */
  function makeStage(container, M, reduce) {
    var THREE = root.THREE, doc = root.document;
    if (!THREE) return null;
    var canvas = doc.createElement("canvas"), renderer;
    canvas.className = "nthview-stage";
    canvas.setAttribute("aria-hidden", "true");
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true }); } catch (e) { return null; }
    if (!renderer || !renderer.getContext()) return null;
    container.appendChild(canvas);
    var labels = doc.createElement("div");
    labels.className = "nthview-plabels";
    labels.setAttribute("aria-hidden", "true");
    container.appendChild(labels);
    var small = root.innerWidth < 700;
    renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, small ? 1.5 : 2));
    var scene = new THREE.Scene(), camera = new THREE.PerspectiveCamera(36, 1, 0.1, 200);
    scene.add(new THREE.AmbientLight(0xffffff, 0.72));
    var sun = new THREE.DirectionalLight(0xffffff, 0.85);
    sun.position.set(5, 10, 7);
    scene.add(sun);

    /* which variables stand on the stage */
    var ids = (M.stage && M.stage.length ? M.stage : M.vars.filter(function (v) { return M.rules.some(function (r) { return r.v === v; }); }).slice(0, 10).map(function (v) { return v.id; }));
    var n = ids.length, R = Math.max(2.4, Math.min(4.2, n * 0.36)), world = new THREE.Group();
    scene.add(world);
    var floor = new THREE.Mesh(new THREE.CircleGeometry(R + 1.1, 64), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.35, depthWrite: false }));
    floor.rotation.x = -Math.PI / 2;
    world.add(floor);
    var rim = new THREE.Mesh(new THREE.RingGeometry(R + 1.06, R + 1.12, 96), new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.6, side: THREE.DoubleSide, depthWrite: false }));
    rim.rotation.x = -Math.PI / 2; rim.position.y = 0.01;
    world.add(rim);
    var boxGeo = new THREE.BoxGeometry(0.62, 1, 0.62); boxGeo.translate(0, 0.5, 0);
    var padGeo = new THREE.CylinderGeometry(0.52, 0.56, 0.06, 32);
    var pillars = ids.map(function (id, i) {
      var v = M.vars[M.vi[id]], a = i / n * Math.PI * 2 - Math.PI / 2;
      var mat = new THREE.MeshStandardMaterial({ roughness: 0.38, metalness: 0.12, transparent: true, opacity: 1 });
      var m = new THREE.Mesh(boxGeo, mat), pad = new THREE.Mesh(padGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.55 }));
      var x = Math.cos(a) * R, z = Math.sin(a) * R;
      m.position.set(x, 0.03, z); pad.position.set(x, 0.03, z);
      m.scale.set(1, 0.04, 1);
      world.add(pad); world.add(m);
      var lab = doc.createElement("div");
      lab.className = "nthview-plabel";
      var dot = doc.createElement("i"), nm = doc.createElement("span"), val = doc.createElement("b");
      nm.textContent = v.label.length > 22 ? v.label.slice(0, 21) + "…" : v.label;
      lab.appendChild(dot); lab.appendChild(nm); lab.appendChild(val);
      labels.appendChild(lab);
      return { id: id, v: v, m: m, pad: pad, x: x, z: z, h: 0.04, target: 0.04, on: 1, onTarget: 1, lab: lab, dot: dot, val: val, last: "", norm: 1, glow: 0 };
    });
    var byId = {};
    pillars.forEach(function (p) { byId[p.id] = p; });

    /* arcs: from each input pillar a rule reads, to the pillar it sets */
    var edges = [], edgeKey = {};
    M.rules.forEach(function (r, ri) {
      var to = byId[r.v.id];
      if (!to) return;
      r.ids.forEach(function (id) {
        var from = byId[id];
        if (!from || from === to) return;
        var key = id + ">" + r.v.id;
        if (edgeKey[key]) { edgeKey[key].rules.push(ri); return; }
        var mid = new THREE.Vector3((from.x + to.x) / 2, 0, (from.z + to.z) / 2), d = Math.hypot(from.x - to.x, from.z - to.z);
        mid.multiplyScalar(0.35); mid.y = 2.2 + d * 0.45;
        var curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(from.x, 0.35, from.z), mid, new THREE.Vector3(to.x, 0.35, to.z));
        var pts = curve.getPoints(40), geo = new THREE.BufferGeometry().setFromPoints(pts);
        var line = new THREE.Line(geo, new THREE.LineBasicMaterial({ transparent: true, opacity: 0.18, depthWrite: false }));
        world.add(line);
        var e = { from: from, to: to, pts: pts, line: line, heat: 0, rules: [ri] };
        edgeKey[key] = e; edges.push(e);
      });
    });

    /* pulses travelling along arcs, and rings for events */
    var pulseGeo = new THREE.SphereGeometry(0.1, 14, 14), pulses = [];
    for (var i = 0; i < 48; i++) { var pm = new THREE.Mesh(pulseGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.95, depthWrite: false })); pm.visible = false; world.add(pm); pulses.push({ m: pm, e: null, t0: 0, dur: 650 }); }
    var ringGeo = new THREE.RingGeometry(0.62, 0.72, 48), rings = [];
    for (i = 0; i < 10; i++) { var rm = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })); rm.rotation.x = -Math.PI / 2; rm.visible = false; world.add(rm); rings.push({ m: rm, t0: 0 }); }
    var N = small ? 140 : 260, dpos = new Float32Array(N * 3);
    for (i = 0; i < N; i++) { dpos[i * 3] = (Math.random() - 0.5) * 34; dpos[i * 3 + 1] = Math.random() * 14 - 2; dpos[i * 3 + 2] = (Math.random() - 0.5) * 34; }
    var dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dpos, 3));
    var dustMat = new THREE.PointsMaterial({ size: 0.06, transparent: true, opacity: 0.55, depthWrite: false }), dust = new THREE.Points(dustGeo, dustMat);
    scene.add(dust);

    /* colours come from the theme tokens, so light and dark both read */
    var pal = {}, dimC = new THREE.Color(), accent = new THREE.Color(), tmp = new THREE.Color();
    function css(name) { var s = root.getComputedStyle(container).getPropertyValue(name).trim(); try { return new THREE.Color(s || "#888"); } catch (e) { return new THREE.Color("#888"); } }
    function recolor() {
      HUE_ORDER.forEach(function (h) { pal[h] = css("--h-" + h); });
      dimC.copy(css("--nv-border")); accent.copy(css("--nv-accent"));
      floor.material.color.copy(css("--mx-soft")); rim.material.color.copy(css("--mx-axis"));
      dustMat.color.copy(css("--nv-muted"));
      pillars.forEach(function (p) { p.pad.material.color.copy(dimC); p.dot.style.background = "var(--h-" + p.v.color + ")"; });
      edges.forEach(function (e) { e.line.material.color.copy(css("--nv-muted")); });
    }

    /* view placement per page mode: beside the hero, behind the step cards, under a pinned clock */
    var mode = "hero", off = { x: 0, y: 0, d: 1 }, goal = { x: 0, y: 0, d: 1 }, focusIds = null;
    function placeGoal() {
      var W = root.innerWidth, wide = W >= 1000;
      if (mode === "hero") { goal = wide ? { x: W * 0.27, y: root.innerHeight * 0.04, d: 1.9 } : { x: 0, y: -root.innerHeight * 0.22, d: 1.5 }; container.style.setProperty("--mx-stage-o", wide ? "1" : ".3"); container.style.setProperty("--mx-label-o", wide ? "1" : "0"); }
      else if (mode === "pin") { goal = wide ? { x: -W * 0.29, y: root.innerHeight * 0.17, d: 2.35 } : { x: 0, y: -root.innerHeight * 0.05, d: 1.3 }; container.style.setProperty("--mx-stage-o", wide ? ".95" : ".3"); container.style.setProperty("--mx-label-o", wide ? "1" : "0"); }
      else { goal = wide ? { x: -W * 0.24, y: 0, d: 1.8 } : { x: 0, y: 0, d: 1.6 }; container.style.setProperty("--mx-stage-o", wide ? ".42" : ".12"); container.style.setProperty("--mx-label-o", "0"); }
    }
    var Wv = 1, Hv = 1;
    function resize() {
      Wv = root.innerWidth; Hv = root.innerHeight;
      renderer.setSize(Wv, Hv, false);
      camera.aspect = Wv / Hv;
      placeGoal();
      camera.updateProjectionMatrix();
    }
    root.addEventListener("resize", function onR() { if (!canvas.isConnected) { root.removeEventListener("resize", onR); return; } resize(); });

    /* heights follow the run; scale each variable to the largest value it reaches in any scenario */
    var runNow = null;
    function setRuns(all, cur) {
      runNow = cur;
      pillars.forEach(function (p) {
        var m = 0;
        Object.keys(all).forEach(function (k) { var r = all[k]; m = Math.max(m, Math.abs(r.lo[p.v.i]), Math.abs(r.hi[p.v.i])); });
        p.norm = isFinite(p.v.hi) && p.v.hi > 0 ? Math.max(p.v.hi, 1e-9) : (m || 1);
      });
    }
    function update(k, from, r) {
      runNow = r;
      pillars.forEach(function (p) {
        var x = r.vals[p.v.i][k];
        p.target = 0.04 + Math.max(0, Math.min(1, Math.abs(x) / p.norm)) * 3.6;
        var s = fmtMeta(p.v, x);
        if (s !== p.last) { p.val.textContent = s; p.last = s; }
      });
      if (k <= from || k - from > 3) return;
      var now = performance.now(), order = 0;
      M.rules.forEach(function (rule, ri) {
        var to = byId[rule.v.id];
        if (!to) return;
        var a = r.vals[rule.v.i], ch = Math.abs(a[k] - a[k - 1]) > 1e-12;
        if (!ch) return;
        to.glow = 1;
        edges.forEach(function (e) {
          if (e.to !== to || e.rules.indexOf(ri) === -1) return;
          e.heat = 1;
          if (reduce) return;
          for (var j = 0; j < pulses.length; j++) if (!pulses[j].e) { pulses[j].e = e; pulses[j].t0 = now + order * 70; pulses[j].m.material.color.copy(pal[e.from.v.color] || accent); break; }
        });
        order++;
      });
      r.active.forEach(function (ev) {
        if (!r.fired[ev.id][k]) return;
        var spots = ev.set.map(function (s) { return byId[s.v.id]; }).filter(Boolean);
        if (!spots.length) spots = [{ x: 0, z: 0 }];
        spots.forEach(function (p) {
          for (var j = 0; j < rings.length; j++) if (!rings[j].m.visible) {
            var g = rings[j];
            g.m.visible = true; g.t0 = now; g.m.position.set(p.x, 0.05, p.z); g.m.material.color.copy(pal[ev.color] || accent);
            break;
          }
        });
      });
    }
    function focus(list) { focusIds = list && list.length ? list : null; }
    function setMode(m) { if (m === mode) return; mode = m; placeGoal(); }

    var spin = -0.35, last = performance.now(), v3 = new THREE.Vector3(), look = new THREE.Vector3(0, 1.1, 0);
    function frame(now) {
      if (!canvas.isConnected) return;
      root.requestAnimationFrame(frame);
      if (doc.hidden) return;
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduce) spin += dt * 0.06;
      var k = reduce ? 1 : 0.07;
      off.x += (goal.x - off.x) * k; off.y += (goal.y - off.y) * k; off.d += (goal.d - off.d) * k;
      var sy = root.scrollY || 0, ang = spin + sy * 0.00025, dist = (R * 2.35 + 5.5) * off.d;
      camera.position.set(Math.cos(ang) * dist, dist * 0.62, Math.sin(ang) * dist);
      camera.lookAt(look);
      camera.setViewOffset(Wv, Hv, -off.x, -off.y, Wv, Hv);
      dust.rotation.y = sy * 0.00008 + spin * 0.2;
      pillars.forEach(function (p) {
        p.onTarget = !focusIds || focusIds.indexOf(p.id) !== -1 ? 1 : 0.22;
        p.on += (p.onTarget - p.on) * (reduce ? 1 : 0.08);
        p.h += (p.target - p.h) * (reduce ? 1 : 0.16);
        p.glow = Math.max(0, p.glow - dt * 1.6);
        p.m.scale.set(1, p.h, 1);
        var col = pal[p.v.color] || accent;
        tmp.copy(dimC).lerp(col, p.on);
        p.m.material.color.copy(tmp);
        p.m.material.emissive.copy(col).multiplyScalar(0.18 * p.on + 0.55 * p.glow);
        p.m.material.opacity = 0.35 + 0.65 * p.on;
        v3.set(p.x, p.h + 0.45, p.z).applyMatrix4(world.matrixWorld).project(camera);
        p.sx = (v3.x + 1) / 2 * Wv; p.sy = (1 - v3.y) / 2 * Hv;
        p.shown = !(focusIds && p.onTarget < 1);
        if (p.lw === undefined || p.lastW !== p.last) { p.lw = p.lab.offsetWidth || 120; p.lastW = p.last; }
      });
      /* keep labels from covering each other: nudge a label up until it clears the ones placed before it */
      for (var a = 0; a < pillars.length; a++) {
        var pa = pillars[a];
        if (!pa.shown) continue;
        for (var tries = 0; tries < 6; tries++) {
          var hit = false;
          for (var b = 0; b < a; b++) {
            var pb = pillars[b];
            if (!pb.shown) continue;
            if (Math.abs(pa.sx - pb.sx) < (pa.lw + pb.lw) / 2 + 4 && Math.abs(pa.sy - pb.sy) < 24) { pa.sy = pb.sy - 26; hit = true; }
          }
          if (!hit) break;
        }
        pa.lab.style.transform = "translate(" + Math.round(pa.sx) + "px," + Math.round(pa.sy) + "px) translate(-50%,-100%)";
      }
      pillars.forEach(function (p) {
        p.lab.classList.toggle("nthview-dim", p.on < 0.6);
        p.lab.style.visibility = p.shown ? "visible" : "hidden";
      });
      edges.forEach(function (e) {
        e.heat = Math.max(0, e.heat - dt * 1.2);
        var on = !focusIds || focusIds.indexOf(e.to.id) !== -1 || focusIds.indexOf(e.from.id) !== -1;
        e.line.material.opacity = (on ? 0.2 : 0.06) + e.heat * 0.7;
        if (e.heat > 0.01) e.line.material.color.copy(pal[e.to.v.color] || accent);
      });
      pulses.forEach(function (p) {
        if (!p.e) return;
        var u = (now - p.t0) / p.dur;
        if (u < 0) { p.m.visible = false; return; }
        if (u >= 1) { p.e = null; p.m.visible = false; return; }
        var f = u * (p.e.pts.length - 1), i0 = Math.floor(f), t = f - i0, a = p.e.pts[i0], b = p.e.pts[Math.min(i0 + 1, p.e.pts.length - 1)];
        p.m.position.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, a.z + (b.z - a.z) * t);
        p.m.visible = true;
      });
      rings.forEach(function (g) {
        if (!g.m.visible) return;
        var u = (now - g.t0) / 1100;
        if (u >= 1) { g.m.visible = false; return; }
        var s = 1 + u * 3.2;
        g.m.scale.set(s, s, s);
        g.m.material.opacity = 0.9 * (1 - u);
      });
      renderer.render(scene, camera);
    }
    recolor();
    resize();
    root.requestAnimationFrame(frame);
    if (root.matchMedia) {
      var mq = root.matchMedia("(prefers-color-scheme: dark)"), onMq = function () { if (!canvas.isConnected) { if (mq.removeEventListener) mq.removeEventListener("change", onMq); return; } recolor(); };
      if (mq.addEventListener) mq.addEventListener("change", onMq);
    }
    return { setRuns: setRuns, update: update, focus: focus, mode: setMode, recolor: function () { root.setTimeout(recolor, 0); } };
  }

  function render(container, data) {
    var doc = root.document, gen = (container.__nthviewGen = (container.__nthviewGen || 0) + 1);
    function alive() { return container.__nthviewGen === gen; }
    var reduce = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var M = buildModel(data), H = M.H;
    CLOCK = M.unit;
    var clock = data.clock;
    var SPEEDS = clock.speeds || [H / 120, H / 30, H / 10].map(function (x) { return Math.max(0.1, Number(x.toPrecision(2))); });
    var WINDOWS = (clock.windows || []).map(function (w) { return { label: w.label, ticks: w.ticks }; }).concat([{ label: "All", ticks: H }]);
    var KEY = storageKey(data);
    var SECTIONS = data.sections;

    /* ---- state ---- */
    var S = { scen: 0, tick: clock.start || 0, speed: typeof clock.speed === "number" ? clock.speed : Math.min(1, SPEEDS.length - 1), win: typeof clock.window === "number" ? clock.window : WINDOWS.length - 1, tweaks: {}, checks: {}, section: "", scheme: "auto", done: false };
    var saved = loadState(KEY), resumed = false;
    if (saved) {
      M.scen.forEach(function (s, i) { if (s.id === saved.scen) S.scen = i; });
      if (typeof saved.tick === "number" && saved.tick >= 0 && saved.tick <= H) S.tick = Math.round(saved.tick);
      if (typeof saved.speed === "number" && saved.speed >= 0 && saved.speed < SPEEDS.length) S.speed = saved.speed | 0;
      if (typeof saved.win === "number" && saved.win >= 0 && saved.win < WINDOWS.length) S.win = saved.win | 0;
      if (saved.tweaks && typeof saved.tweaks === "object") M.scen.forEach(function (s) {
        var tw = saved.tweaks[s.id];
        if (!tw || typeof tw !== "object") return;
        Object.keys(tw).forEach(function (pid) { var q = M.meta[pid]; if (M.pi.hasOwnProperty(pid) && typeof tw[pid] === "number" && tw[pid] >= q.min && tw[pid] <= q.max) { (S.tweaks[s.id] = S.tweaks[s.id] || {})[pid] = tw[pid]; } });
      });
      if (saved.checks && typeof saved.checks === "object") SECTIONS.forEach(function (s) {
        var a = saved.checks[s.id];
        if (s.check && typeof a === "number" && a >= -1 && a < s.check.options.length) S.checks[s.id] = a | 0;
      });
      SECTIONS.forEach(function (s) { if (s.id === saved.section) S.section = s.id; });
      if (saved.scheme === "light" || saved.scheme === "dark") S.scheme = saved.scheme;
      S.done = saved.done === true;
      resumed = true;
    }
    var playing = false, pos = S.tick, raf = 0, lastFrame = 0;
    var runs = {};
    function curScen() { return M.scen[S.scen]; }
    function run() { return runs[curScen().id]; }
    function paramsOf(sc) { return baseParams(M, sc, S.tweaks[sc.id]); }
    function recompute() { M.scen.forEach(function (sc) { runs[sc.id] = simulate(M, sc, paramsOf(sc)); }); }
    recompute();

    var saveTimer = 0;
    function saveNow() {
      if (!alive()) return;
      clearTimeout(saveTimer); saveTimer = 0;
      saveState(KEY, { scen: curScen().id, tick: S.tick, speed: S.speed, win: S.win, tweaks: S.tweaks, checks: S.checks, section: S.section, scheme: S.scheme, done: S.done });
    }
    function queueSave() { if (!saveTimer) saveTimer = setTimeout(saveNow, playing || tweening ? 1000 : 150); }

    /* ---- shell ---- */
    container.setAttribute("data-theme", pickTheme(data));
    if (S.scheme !== "auto") container.setAttribute("data-scheme", S.scheme);
    if (reduce) container.classList.add("nthview-rm");

    /* rich text: **bold**, `code`, ((term)), {placeholder} */
    var GLOSS = {};
    (data.glossary || []).forEach(function (g) { GLOSS[g.term.trim().toLowerCase()] = g; });
    var live = [];
    function rich(text) {
      var frag = doc.createDocumentFragment();
      String(text).split(/(\*\*[^*]+\*\*|`[^`]+`|\(\([^)]+\)\)|\{[^{}]+\})/).forEach(function (part) {
        if (!part) return;
        if (part.slice(0, 2) === "**" && part.length > 4) { var b = el("strong"); b.appendChild(rich(part.slice(2, -2))); frag.appendChild(b); }
        else if (part[0] === "`" && part.length > 2) frag.appendChild(el("code", { text: part.slice(1, -1) }));
        else if (part.slice(0, 2) === "((") {
          var bits = part.slice(2, -2).split("|"), g = GLOSS[bits[bits.length - 1].trim().toLowerCase()];
          if (!g) { frag.appendChild(doc.createTextNode(bits[0])); return; }
          var tb = el("button", { type: "button", class: "nthview-term", "aria-expanded": "false", text: bits[0].trim() });
          tb.addEventListener("click", function (e) { e.stopPropagation(); openPop(tb, g); });
          frag.appendChild(tb);
        } else if (part[0] === "{") {
          var ph = part.slice(1, -1).split("|"), id = ph[0].trim(), f = ph[1] ? ph[1].trim() : null;
          var span = el("span", { class: "nthview-live" });
          live.push({ span: span, id: id, f: f, last: "" });
          frag.appendChild(span);
        } else frag.appendChild(doc.createTextNode(part));
      });
      return frag;
    }
    function para(text, cls) { var p = el("p", cls ? { class: cls } : {}); p.appendChild(rich(text)); return p; }
    function valueOf(id, k) {
      if (id === "t") return k;
      if (M.pi.hasOwnProperty(id)) return run().params[id];
      return run().vals[M.vi[id]][k];
    }
    function fmtLive(id, f, k) {
      if (id === "t") return fmtTime(k);
      var m = M.meta[id], x = valueOf(id, k);
      return f ? fmt(x, f, f === "duration" ? null : m.unit) : fmtMeta(m, x);
    }
    function paintLive() {
      for (var i = 0; i < live.length; i++) {
        var L = live[i], s = fmtLive(L.id, L.f, S.tick);
        if (s !== L.last) { L.span.textContent = s; L.last = s; }
      }
    }
    function fmtTime(k) { return COUNT_UNITS[CLOCK] ? COUNT_UNITS[CLOCK][0].replace(/^./, function (c) { return c.toUpperCase(); }) + " " + grp(String(k)) : fmtDur(k, CLOCK); }

    /* ---- the stage (three.js), drawn behind everything ---- */
    var stage = makeStage(container, M, reduce);

    /* ---- top bar ---- */
    var schemeBtn = el("button", { type: "button", class: "nthview-btn nthview-ghost" });
    var glossBtn = el("button", { type: "button", class: "nthview-btn nthview-ghost", "aria-haspopup": "dialog" }, [icon("book"), el("span", { text: "Glossary" })]);
    if (!data.glossary) glossBtn.hidden = true;
    var restart = restartButton(container, data, KEY);
    var where = el("div", { class: "nthview-where", "aria-live": "polite" });
    var progress = el("span", { class: "nthview-progress", "aria-hidden": "true" });
    var top = el("header", { class: "nthview-top nthview-glass" }, [el("div", { class: "nthview-top-t", text: data.title }), where, el("div", { class: "nthview-actions" }, [glossBtn, schemeBtn, restart]), progress]);
    container.appendChild(top);

    function paintScheme() {
      schemeBtn.textContent = "";
      var nm = S.scheme === "auto" ? "auto" : S.scheme === "light" ? "sun" : "moon";
      schemeBtn.appendChild(icon(nm));
      schemeBtn.appendChild(el("span", { text: S.scheme === "auto" ? "Auto" : S.scheme === "light" ? "Light" : "Dark" }));
      schemeBtn.setAttribute("aria-label", "Colour scheme: " + S.scheme + ". Change it");
      if (S.scheme === "auto") container.removeAttribute("data-scheme"); else container.setAttribute("data-scheme", S.scheme);
      if (stage) stage.recolor();
    }
    schemeBtn.addEventListener("click", function () { S.scheme = S.scheme === "auto" ? "light" : S.scheme === "light" ? "dark" : "auto"; paintScheme(); saveNow(); });

    /* ---- hero ---- */
    var hero = el("section", { class: "nthview-hero nthview-wrap", "data-ch": "-1" });
    var heroIn = el("div", { class: "nthview-hero-in" });
    heroIn.appendChild(el("div", { class: "nthview-kicker", text: data.kicker || "Mechanism" }));
    heroIn.appendChild(el("h1", { class: "nthview-title", text: data.title }));
    if (data.subtitle) heroIn.appendChild(el("p", { class: "nthview-sub", text: data.subtitle }));
    var lead = el("div", { class: "nthview-lead" });
    data.lead.forEach(function (t) { lead.appendChild(para(t)); });
    heroIn.appendChild(lead);
    var scenCards = el("div", { class: "nthview-scen-cards", role: "group", "aria-label": "Scenarios" });
    var scenCardBtns = M.scen.map(function (sc, i) {
      var b = el("button", { type: "button", class: "nthview-scen-card nthview-glass", "aria-pressed": "false" }, [el("b", { text: sc.label }), el("small", { text: sc.description || "" })]);
      b.addEventListener("click", function () { setScenario(i); });
      scenCards.appendChild(b);
      return b;
    });
    if (M.scen.length > 1) heroIn.appendChild(scenCards);
    var toc = el("ol", { class: "nthview-toc", "aria-label": "Chapters" });
    SECTIONS.forEach(function (s, i) {
      var b = el("button", { type: "button" }, [el("span", { text: s.title })]);
      b.addEventListener("click", function () { var t = chEls[i]; if (t) t.el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); });
      toc.appendChild(el("li", {}, [b]));
    });
    heroIn.appendChild(toc);
    heroIn.appendChild(el("p", { class: "nthview-cue", text: "Scroll: the clock, the stage and every figure follow the story." }));
    hero.appendChild(heroIn);
    container.appendChild(hero);

    /* ---- the dock: the clock, always at hand ---- */
    var dock = el("div", { class: "nthview-dock nthview-glass", role: "region", "aria-label": "Simulation clock" });
    var playBtn = el("button", { type: "button", class: "nthview-btn nthview-primary nthview-icon nthview-d-play", "aria-label": "Play", title: "Play or pause (Space)" });
    var timeEl = el("div", { class: "nthview-d-time" });
    var timeMain = el("span"), timeSub = el("small");
    timeEl.appendChild(timeMain); timeEl.appendChild(timeSub);
    var scrubWrap = el("div", { class: "nthview-d-scrub" });
    var scrubEv = el("div", { class: "nthview-scrub-ev", "aria-hidden": "true" });
    var scrub = el("input", { type: "range", class: "nthview-range", min: "0", max: String(H), step: "1", value: String(S.tick), "aria-label": "Clock position" });
    scrubWrap.appendChild(scrub); scrubWrap.appendChild(scrubEv);
    var prevBtn = el("button", { type: "button", class: "nthview-btn nthview-icon", "aria-label": "Previous event", title: "Previous event ([)" }, [icon("prev")]);
    var nextBtn = el("button", { type: "button", class: "nthview-btn nthview-icon", "aria-label": "Next event", title: "Next event (])" }, [icon("next")]);
    var moreBtn = el("button", { type: "button", class: "nthview-btn nthview-icon nthview-d-more", "aria-label": "Scenario and options", "aria-expanded": "false" }, [icon("more")]);
    var scenSel = el("select", { class: "nthview-sel", "aria-label": "Scenario" });
    M.scen.forEach(function (sc, i) { scenSel.appendChild(el("option", { value: String(i), text: sc.label })); });
    scenSel.addEventListener("change", function () { setScenario(+scenSel.value); });
    var speedSel = el("select", { class: "nthview-sel", "aria-label": "Speed" });
    SPEEDS.forEach(function (s, i) { speedSel.appendChild(el("option", { value: String(i), text: (COUNT_UNITS[CLOCK] ? grp(trimZ(String(s))) + " " + COUNT_UNITS[CLOCK][1] : fmtDur(s, CLOCK)) + " / s" })); });
    var winSel = el("select", { class: "nthview-sel", "aria-label": "Time window" });
    WINDOWS.forEach(function (w, i) { winSel.appendChild(el("option", { value: String(i), text: w.label === "All" ? "All (" + fmtDur(H, CLOCK) + ")" : "Window " + w.label })); });
    var tuneBtn = el("button", { type: "button", class: "nthview-btn", "aria-haspopup": "dialog" }, [icon("tune"), el("span", { text: "Tune" })]);
    if (!M.params.length) tuneBtn.hidden = true;
    dock.appendChild(playBtn);
    dock.appendChild(timeEl);
    dock.appendChild(scrubWrap);
    dock.appendChild(el("div", { class: "nthview-d-nav" }, [prevBtn, nextBtn]));
    dock.appendChild(moreBtn);
    dock.appendChild(el("div", { class: "nthview-d-opts" }, [scenSel, speedSel, winSel, tuneBtn]));
    moreBtn.addEventListener("click", function () { var o = !dock.classList.contains("nthview-open"); dock.classList.toggle("nthview-open", o); moreBtn.setAttribute("aria-expanded", String(o)); });
    speedSel.value = String(S.speed);
    winSel.value = String(S.win);
    speedSel.addEventListener("change", function () { S.speed = +speedSel.value; saveNow(); });
    winSel.addEventListener("change", function () { setWindow(+winSel.value); saveNow(); });

    /* ---- window over the time axis ---- */
    var W0 = 0;
    function span() { return Math.min(H, WINDOWS[S.win].ticks); }
    function win() { var s = span(); return [W0, Math.min(H, W0 + s)]; }
    function placeWindow(center) {
      var s = span(), old = W0;
      if (s >= H) W0 = 0;
      else if (center || S.tick < W0 || S.tick > W0 + s) W0 = Math.max(0, Math.min(H - s, Math.round(playing || tweening ? S.tick - s * 0.08 : S.tick - s / 2)));
      else if ((playing || tweening) && S.tick > W0 + s * 0.96) W0 = Math.max(0, Math.min(H - s, Math.round(S.tick - s * 0.08)));
      return W0 !== old;
    }
    function setWindow(i) { if (i === S.win) return; S.win = i; winSel.value = String(i); placeWindow(true); drawAll(); }

    /* ---- drawers: tune and glossary ---- */
    var scrim = el("div", { class: "nthview-scrim" });
    var drawer = el("div", { class: "nthview-drawer", role: "dialog", "aria-modal": "true", "aria-labelledby": "nthview-drawer-t-" + gen, tabindex: "-1" });
    var drawerTitle = el("h2", { id: "nthview-drawer-t-" + gen });
    var drawerClose = el("button", { type: "button", class: "nthview-btn nthview-ghost nthview-icon", "aria-label": "Close" }, [icon("close")]);
    var drawerBody = el("div", { class: "nthview-drawer-b" });
    drawer.appendChild(el("div", { class: "nthview-drawer-h" }, [drawerTitle, drawerClose]));
    drawer.appendChild(drawerBody);
    var drawerReturn = null;
    function openDrawer(kind, from) {
      drawerReturn = from || doc.activeElement;
      drawerBody.textContent = "";
      if (kind === "tune") {
        drawerTitle.textContent = "Tune: " + curScen().label;
        drawerBody.appendChild(controlCard(M.params.map(function (q) { return q.id; }), "All parameters"));
      } else {
        drawerTitle.textContent = "Glossary";
        var dl = el("dl");
        (data.glossary || []).forEach(function (g) { dl.appendChild(el("dt", { text: g.term })); dl.appendChild(el("dd", { text: g.definition })); });
        drawerBody.appendChild(dl);
      }
      drawer.classList.add("nthview-open"); scrim.classList.add("nthview-open");
      setTimeout(function () { drawerClose.focus(); }, 30);
    }
    function closeDrawer() {
      if (!drawer.classList.contains("nthview-open")) return;
      drawer.classList.remove("nthview-open"); scrim.classList.remove("nthview-open");
      ctlCards = ctlCards.filter(function (c) { return c.root.isConnected; });
      if (drawerReturn && drawerReturn.focus) drawerReturn.focus();
    }
    drawerClose.addEventListener("click", closeDrawer);
    scrim.addEventListener("click", closeDrawer);
    drawer.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); closeDrawer(); return; }
      if (e.key !== "Tab") return;
      var f = drawer.querySelectorAll("button,input,select,[tabindex='0']"), list = [];
      for (var i = 0; i < f.length; i++) if (!f[i].disabled && f[i].offsetParent !== null) list.push(f[i]);
      if (!list.length) return;
      if (e.shiftKey && doc.activeElement === list[0]) { e.preventDefault(); list[list.length - 1].focus(); }
      else if (!e.shiftKey && doc.activeElement === list[list.length - 1]) { e.preventDefault(); list[0].focus(); }
    });
    tuneBtn.addEventListener("click", function () { openDrawer("tune", tuneBtn); });
    glossBtn.addEventListener("click", function () { openDrawer("glossary", glossBtn); });

    /* glossary pop-over */
    var pop = null, popFor = null;
    function closePop() { if (pop && pop.parentNode) pop.parentNode.removeChild(pop); if (popFor) popFor.setAttribute("aria-expanded", "false"); pop = popFor = null; }
    function openPop(btn, g) {
      if (popFor === btn) { closePop(); return; }
      closePop();
      pop = el("div", { class: "nthview-pop", role: "note" }, [el("b", { text: g.term }), doc.createTextNode(g.definition)]);
      container.appendChild(pop);
      var r = btn.getBoundingClientRect(), c = container.getBoundingClientRect(), pw = pop.offsetWidth;
      var left = Math.max(8, Math.min(r.left - c.left, c.width - pw - 8));
      pop.style.left = left + "px"; pop.style.top = (r.bottom - c.top + 6) + "px";
      popFor = btn; btn.setAttribute("aria-expanded", "true");
    }
    container.addEventListener("click", function (e) { if (pop && !pop.contains(e.target)) closePop(); });

    /* ---- parameter controls (chapters, the bench and the tune drawer) ---- */
    var ctlCards = [];
    function stepOf(q) { return q.step || (q.max - q.min) / 100; }
    function snap(q, x) { var s = stepOf(q), v = Math.round((x - q.min) / s) * s + q.min; return Math.max(q.min, Math.min(q.max, Math.round(v * 1e9) / 1e9)); }
    function controlCard(ids, title) {
      var card = el("div", { class: "nthview-ctl nthview-glass", role: "group", "aria-label": title });
      var reset = el("button", { type: "button", class: "nthview-btn nthview-ghost", text: "Reset" });
      card.appendChild(el("div", { class: "nthview-ctl-h" }, [el("span", { text: title }), reset]));
      var grid = el("div", { class: "nthview-ctl-grid" });
      card.appendChild(grid);
      var items = ids.map(function (pid) {
        var q = M.meta[pid], row = el("div", { class: "nthview-param" }), uid = "nthview-p-" + gen + "-" + pid + "-" + (ctlCards.length);
        var out = el("output", { "for": uid });
        var item = { q: q, out: out, input: null, btns: null };
        if (q.control === "toggle") {
          var sw = el("button", { type: "button", class: "nthview-switch", role: "switch", "aria-checked": "false", id: uid }, [el("i"), el("span", { text: q.label })]);
          sw.addEventListener("click", function () { setParam(pid, run().params[pid] ? 0 : 1); });
          item.input = sw;
          row.appendChild(el("div", { class: "nthview-param-top" }, [sw, out]));
        } else if (q.control === "choice") {
          var g = el("div", { class: "nthview-seg", role: "group", "aria-label": q.label, id: uid });
          item.btns = q.options.map(function (o) {
            var b = el("button", { type: "button", text: o.label, "aria-pressed": "false" });
            b.addEventListener("click", function () { setParam(pid, o.value); });
            g.appendChild(b);
            return { b: b, v: o.value };
          });
          row.appendChild(el("div", { class: "nthview-param-top" }, [el("label", { "for": uid, text: q.label }), out]));
          row.appendChild(g);
        } else {
          var inp = el("input", { type: "range", class: "nthview-range", id: uid, min: String(q.min), max: String(q.max), step: String(stepOf(q)) });
          inp.addEventListener("input", function () { setParam(pid, snap(q, +inp.value)); });
          item.input = inp;
          row.appendChild(el("div", { class: "nthview-param-top" }, [el("label", { "for": uid, text: q.label }), out]));
          row.appendChild(inp);
        }
        if (q.description) row.appendChild(el("small", { text: q.description }));
        grid.appendChild(row);
        return item;
      });
      reset.addEventListener("click", function () {
        var tw = S.tweaks[curScen().id];
        if (!tw) return;
        ids.forEach(function (pid) { delete tw[pid]; });
        changed();
      });
      var c = { root: card, items: items, reset: reset, ids: ids };
      ctlCards.push(c);
      paintCard(c);
      return card;
    }
    function paintCard(c) {
      var p = run().params, tw = S.tweaks[curScen().id] || {}, any = false;
      c.items.forEach(function (it) {
        var q = it.q, v = p[q.id], t = tw.hasOwnProperty(q.id);
        if (t) any = true;
        var opt = it.btns ? it.btns.filter(function (b) { return Math.abs(b.v - v) < 1e-9; })[0] : null;
        it.out.textContent = q.control === "toggle" ? (v ? "On" : "Off") : opt ? opt.b.textContent : fmt(v, q.format, q.format === "duration" ? null : q.unit);
        it.out.classList.toggle("nthview-tweaked", t);
        if (q.control === "toggle") it.input.setAttribute("aria-checked", String(!!v));
        else if (it.btns) it.btns.forEach(function (b) { b.b.setAttribute("aria-pressed", String(Math.abs(b.v - v) < 1e-9)); });
        else {
          if (+it.input.value !== v) it.input.value = String(v);
          it.input.style.setProperty("--p", ((v - q.min) / (q.max - q.min) * 100) + "%");
          it.input.setAttribute("aria-valuetext", it.out.textContent);
        }
      });
      c.reset.disabled = !any;
    }
    function setParam(pid, v) {
      var sc = curScen(), base = sc.params.hasOwnProperty(pid) ? sc.params[pid] : M.meta[pid].def;
      var tw = S.tweaks[sc.id] = S.tweaks[sc.id] || {};
      if (Math.abs(v - base) < 1e-9) delete tw[pid]; else tw[pid] = v;
      changed();
    }
    var recomputeQueued = false;
    function changed() {
      saveNow();
      if (recomputeQueued) return;
      recomputeQueued = true;
      root.requestAnimationFrame(function () {
        recomputeQueued = false;
        if (!alive()) return;
        var sc = curScen();
        runs[sc.id] = simulate(M, sc, paramsOf(sc));
        refreshAll();
      });
    }

    /* ---- figures ---- */
    var figs = [];
    var io = root.IntersectionObserver ? new root.IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var f = en.target.__nthviewFig; if (!f) return;
        f.vis = en.isIntersecting;
        if (f.vis) { if (f.dirty) { f.dirty = false; f.draw(); } f.tick(S.tick); }
      });
    }, { rootMargin: "120px 0px" }) : null;
    var ro = root.ResizeObserver ? new root.ResizeObserver(function (entries) {
      entries.forEach(function (en) {
        var f = en.target.__nthviewFig; if (!f) return;
        var w = Math.round(en.contentRect.width);
        if (w && w !== f.w) { f.w = w; if (f.vis) { f.draw(); f.tick(S.tick); } else f.dirty = true; }
      });
      layoutSticky();
    }) : null;
    function register(f, sizeEl) {
      f.vis = !io; f.dirty = true; f.w = 0;
      f.root.__nthviewFig = f;
      if (sizeEl) { sizeEl.__nthviewFig = f; if (ro) ro.observe(sizeEl); f.sizeEl = sizeEl; }
      if (io) io.observe(f.root);
      figs.push(f);
      return f;
    }
    function drawAll() { figs.forEach(function (f) { if (f.vis) { f.dirty = false; f.draw(); f.tick(S.tick); } else f.dirty = true; }); }
    function tickAll() { for (var i = 0; i < figs.length; i++) if (figs[i].vis && !figs[i].dirty) figs[i].tick(S.tick); }
    function widthOf(f) { if (!f.w && f.sizeEl) f.w = Math.round(f.sizeEl.clientWidth) || 300; return f.w || 300; }

    function legendItem(color, label, dashed, block) {
      var b = el("b"), li = el("li", {}, [el("span", { class: "nthview-sw" + (dashed ? " nthview-dash" : "") + (block ? " nthview-blk" : ""), style: "color:" + hue(color) }), el("span", { text: label }), b]);
      return { li: li, b: b };
    }
    function card(f) {
      var c = el("figure", { class: "nthview-fig nthview-glass" });
      if (f.title) c.appendChild(el("h3", { text: f.title }));
      return c;
    }
    function caption(c, f) { if (f.caption) { var p = el("figcaption", { class: "nthview-caption" }); p.appendChild(rich(f.caption)); c.appendChild(p); } }
    function paramOrNum(x, params) { return typeof x === "string" ? params[x] : x; }

    /* A time plot: margins, a window-based x scale, a y scale, axes, cursor, hover and seek. */
    function Plot(host, opt) {
      var P = { mt: opt.mt === undefined ? 16 : opt.mt, mb: opt.noX ? 6 : 24, ml: opt.ml === undefined ? 46 : opt.ml, mr: 10, h: opt.h || 210, w: 300, w0: 0, w1: H, y0: 0, y1: 1 };
      var plot = el("div", { class: "nthview-plot" });
      var svg = svgEl("svg", { "aria-hidden": "true", focusable: "false" });
      var gGrid = svgEl("g"), gData = svgEl("g"), gTop = svgEl("g"), gCur = svgEl("g");
      svg.appendChild(gGrid); svg.appendChild(gData); svg.appendChild(gTop); svg.appendChild(gCur);
      var hov = svgEl("line", { class: "nthview-hov", visibility: "hidden" }), cur = svgEl("line", { class: "nthview-cur" });
      gCur.appendChild(hov); gCur.appendChild(cur);
      plot.appendChild(svg);
      var tip = el("div", { class: "nthview-tip", hidden: "" });
      plot.appendChild(tip);
      host.appendChild(plot);
      P.el = plot; P.svg = svg; P.gData = gData; P.gTop = gTop; P.gCur = gCur; P.tip = tip;
      P.x = function (k) { return P.ml + (k - P.w0) / Math.max(1, P.w1 - P.w0) * (P.w - P.ml - P.mr); };
      P.k = function (px) { return Math.max(P.w0, Math.min(P.w1, Math.round(P.w0 + (px - P.ml) / (P.w - P.ml - P.mr) * Math.max(1, P.w1 - P.w0)))); };
      P.y = function (v) { var t = (v - P.y0) / (P.y1 - P.y0 || 1); return P.mt + (1 - (t < 0 ? 0 : t > 1 ? 1 : t)) * (P.h - P.mt - P.mb); };
      P.frame = function (w, w0, w1, y0, y1, yf, yUnitless) {
        P.w = w; P.w0 = w0; P.w1 = w1; P.y0 = y0; P.y1 = y1;
        svg.setAttribute("viewBox", "0 0 " + w + " " + P.h); svg.setAttribute("height", String(P.h));
        while (gGrid.firstChild) gGrid.removeChild(gGrid.firstChild);
        while (gData.firstChild) gData.removeChild(gData.firstChild);
        while (gTop.firstChild) gTop.removeChild(gTop.firstChild);
        var bottom = P.h - P.mb;
        var yt = opt.yTicks || (P.h > 150 ? 4 : 2), ys = yf === "duration" ? durStep(y1 - y0, yt) : 0, yList = [];
        if (ys) for (var yv = Math.ceil(y0 / ys) * ys; yv <= y1 + 1e-9; yv += ys) yList.push(yv); else yList = niceTicks(y0, y1, yt);
        if (!opt.noY) yList.forEach(function (v) {
          var y = r1(P.y(v));
          gGrid.appendChild(svgEl("line", { class: v === 0 ? "nthview-base" : "nthview-gl", x1: P.ml, x2: w - P.mr, y1: y, y2: y }));
          var t = svgEl("text", { x: P.ml - 6, y: y + 4, "text-anchor": "end", class: "nthview-ylab" });
          t.textContent = v === 0 ? "0" : yf === "duration" ? fmtDur(v, CLOCK, true) : fmt(v, yf === "dp1" || yf === "dp2" || yf === "int" ? "number" : yf, null);
          gGrid.appendChild(t);
        });
        if (opt.noY || y0 !== 0) gGrid.appendChild(svgEl("line", { class: "nthview-base", x1: P.ml, x2: w - P.mr, y1: bottom, y2: bottom }));
        if (!opt.noX) {
          var n = Math.max(2, Math.floor((w - P.ml - P.mr) / 92));
          timeTicks(w0, w1, n).forEach(function (k) {
            var x = r1(P.x(k));
            gGrid.appendChild(svgEl("line", { class: "nthview-base", x1: x, x2: x, y1: bottom, y2: bottom + 4 }));
            var t = svgEl("text", { x: x, y: bottom + 17, "text-anchor": x < P.ml + 12 ? "start" : x > w - P.mr - 12 ? "end" : "middle" });
            t.textContent = COUNT_UNITS[CLOCK] || k === 0 ? grp(String(k)) : fmtDur(k, CLOCK);
            gGrid.appendChild(t);
          });
        }
        hov.setAttribute("y1", P.mt); hov.setAttribute("y2", bottom);
        cur.setAttribute("y1", P.mt - 4); cur.setAttribute("y2", bottom);
      };
      P.markers = function (r) {
        if (opt.markers === false) return;
        var n = 0;
        r.active.forEach(function (e) {
          var f = r.fired[e.id];
          for (var k = Math.max(1, P.w0); k <= P.w1 && n < 400; k++) if (f[k]) {
            var x = r1(P.x(k));
            gTop.appendChild(svgEl("path", { d: "M" + (x - 4) + " " + (P.mt - 9) + "h8l-4 6z", style: "fill:" + hue(e.color) }));
            n++;
          }
        });
      };
      P.cursor = function (k) {
        var vis = k >= P.w0 && k <= P.w1;
        cur.setAttribute("visibility", vis ? "visible" : "hidden");
        if (vis) { var x = r1(P.x(k)); cur.setAttribute("x1", x); cur.setAttribute("x2", x); }
        return vis;
      };
      var dragging = false;
      function local(e) { var r = svg.getBoundingClientRect(); return (e.clientX - r.left) * (P.w / (r.width || 1)); }
      function hover(e) {
        var px = local(e), k = P.k(px), x = r1(P.x(k));
        hov.setAttribute("x1", x); hov.setAttribute("x2", x); hov.setAttribute("visibility", "visible");
        if (opt.onHover) {
          opt.onHover(k);
          tip.hidden = false;
          var pw = plot.clientWidth, tw = tip.offsetWidth, sx = x * (pw / P.w);
          tip.style.transform = "translate(" + Math.round(sx + 12 + tw > pw ? Math.max(0, sx - tw - 12) : sx + 12) + "px," + Math.round(P.mt) + "px)";
        }
        return k;
      }
      function leave() { hov.setAttribute("visibility", "hidden"); tip.hidden = true; }
      plot.addEventListener("pointermove", function (e) { var k = hover(e); if (dragging) seek(k); });
      plot.addEventListener("pointerleave", function () { if (!dragging) leave(); });
      plot.addEventListener("pointerdown", function (e) {
        if (e.button !== 0) return;
        dragging = true;
        try { plot.setPointerCapture(e.pointerId); } catch (er) {}
        seek(hover(e));
      });
      function end() { dragging = false; }
      plot.addEventListener("pointerup", function (e) { end(); if (e.pointerType !== "mouse") leave(); });
      plot.addEventListener("pointercancel", function () { end(); leave(); });
      return P;
    }
    function tipRows(tip, rows) {
      tip.textContent = "";
      var t = el("div", { class: "nthview-tip-t" }); tip.appendChild(t);
      var out = rows.map(function (r) { var b = el("b"); tip.appendChild(el("div", {}, [el("span", { class: "nthview-sw" + (r.block ? " nthview-blk" : ""), style: "color:" + hue(r.color) }), el("span", { text: r.label }), b])); return b; });
      return { t: t, vals: out };
    }
    function durStep(span, n) { var st = TIME_STEPS[CLOCK]; if (!st) return 0; for (var i = 0; i < st.length; i++) if (span / st[i] <= n) return st[i]; return st[st.length - 1]; }
    function seriesDomain(f, r, list, stacked, axisF) {
      var lo = Infinity, hi = -Infinity;
      if (stacked) {
        for (var k = 0; k <= H; k++) { var s = 0; for (var j = 0; j < list.length; j++) s += Math.max(0, r.vals[list[j].vi][k]); if (s > hi) hi = s; }
        lo = 0;
      } else list.forEach(function (s) { lo = Math.min(lo, r.lo[s.vi]); hi = Math.max(hi, r.hi[s.vi]); });
      (f.thresholds || []).forEach(function (t) { var v = paramOrNum(t.value, r.params); hi = Math.max(hi, v); lo = Math.min(lo, v); });
      var y0 = typeof f.yMin === "number" ? f.yMin : Math.min(0, lo), y1 = typeof f.yMax === "number" ? f.yMax : (hi > y0 ? (y0 < 0 ? hi : niceCeil(hi)) : y0 + 1);
      if (y0 < 0 && typeof f.yMin !== "number") y0 = -niceCeil(-y0);
      if (y1 <= y0) y1 = y0 + 1;
      if (axisF === "duration" && TIME_STEPS[CLOCK] && typeof f.yMax !== "number") { var st = durStep(hi - y0, 4); if (st) y1 = Math.max(st, Math.ceil(hi / st - 1e-9) * st); }
      return [y0, y1];
    }

    /* line, step, area */
    function figSeries(f, host) {
      var c = card(f), list = f.series.map(function (s, i) { var v = M.vars[M.vi[s.var]]; return { vi: v.i, v: v, label: s.label || v.label, color: s.color || v.color || HUE_ORDER[i], dashed: !!s.dashed }; });
      var axisF = f.format || list[0].v.format;
      var leg = el("ul", { class: "nthview-legend" }), items = list.map(function (s) { var it = legendItem(s.color, s.label, s.dashed); leg.appendChild(it.li); return it; });
      c.appendChild(leg);
      if (f.yLabel) leg.appendChild(el("li", { style: "margin-left:auto", text: f.yLabel }));
      var tipEls = null, dots = [];
      var P = Plot(c, { markers: f.markers, onHover: function (k) { var r = run(); tipEls.t.textContent = fmtTime(k); list.forEach(function (s, i) { tipEls.vals[i].textContent = fmtMeta(s.v, r.vals[s.vi][k]); }); } });
      tipEls = tipRows(P.tip, list);
      caption(c, f);
      host.appendChild(c);
      var stacked = f.kind === "area" && f.stacked, cum = null;
      var F = { root: c };
      F.draw = function () {
        var r = run(), w = win(), d = seriesDomain(f, r, list, stacked, axisF);
        P.frame(widthOf(F), w[0], w[1], d[0], d[1], axisF);
        P.markers(r);
        (f.thresholds || []).forEach(function (t) {
          var v = paramOrNum(t.value, r.params), y = r1(P.y(v)), col = hue(t.color || "grey");
          P.gData.appendChild(svgEl("line", { class: "nthview-thr", x1: P.ml, x2: P.w - P.mr, y1: y, y2: y, style: "stroke:" + col }));
          var tx = svgEl("text", { class: "nthview-thr-t", x: P.ml + 6, y: y - 5, "text-anchor": "start", style: "fill:" + col });
          tx.textContent = t.label; P.gData.appendChild(tx);
        });
        var base = new Float64Array(w[1] - w[0] + 1);
        dots.forEach(function (d0) { if (d0.parentNode) d0.parentNode.removeChild(d0); });
        dots = [];
        cum = stacked ? [] : null;
        list.forEach(function (s, i) {
          var a = r.vals[s.vi], pts = [], top = stacked ? new Float64Array(base.length) : null;
          for (var k = w[0]; k <= w[1]; k++) {
            var v = stacked ? base[k - w[0]] + Math.max(0, a[k]) : a[k];
            if (top) top[k - w[0]] = v;
            var x = r1(P.x(k)), y = r1(P.y(v));
            if (f.kind === "step" && k > w[0]) pts.push(x + "," + pts[pts.length - 1].split(",")[1]);
            pts.push(x + "," + y);
          }
          var line = "M" + pts.join("L");
          if (f.kind === "area") {
            var back = [];
            for (var kb = w[1]; kb >= w[0]; kb--) back.push(r1(P.x(kb)) + "," + r1(P.y(stacked ? base[kb - w[0]] : Math.max(P.y0, 0))));
            P.gData.appendChild(svgEl("path", { d: line + "L" + back.join("L") + "Z", style: "fill:" + hue(s.color) + ";fill-opacity:" + (stacked ? ".55" : ".2") + ";stroke:none" }));
          }
          P.gData.appendChild(svgEl("path", { d: line, style: "fill:none;stroke:" + hue(s.color) + ";stroke-width:2;stroke-linejoin:round" + (s.dashed ? ";stroke-dasharray:6 4" : "") }));
          if (top) { cum.push(top); base = top; }
          var dot = svgEl("circle", { r: "4", class: "nthview-dot", style: "fill:" + hue(s.color) });
          P.gCur.appendChild(dot); dots.push(dot);
        });
      };
      F.tick = function (k) {
        var r = run(), vis = P.cursor(k), x = r1(P.x(k));
        list.forEach(function (s, i) {
          items[i].b.textContent = fmtMeta(s.v, r.vals[s.vi][k]);
          var d = dots[i]; if (!d) return;
          d.setAttribute("visibility", vis ? "visible" : "hidden");
          if (vis) { d.setAttribute("cx", x); d.setAttribute("cy", r1(P.y(cum ? cum[i][k - P.w0] : r.vals[s.vi][k]))); }
        });
      };
      return register(F, P.el);
    }

    /* stacked bars over time buckets */
    function figStacked(f, host) {
      var c = card(f), list = f.series.map(function (s, i) { var v = M.vars[M.vi[s.var]]; return { vi: v.i, v: v, label: s.label || v.label, color: s.color || v.color || HUE_ORDER[i] }; });
      var leg = el("ul", { class: "nthview-legend" }), items = list.map(function (s) { var it = legendItem(s.color, s.label, false, true); leg.appendChild(it.li); return it; });
      var bucketNote = el("li", { style: "margin-left:auto" });
      leg.appendChild(bucketNote);
      c.appendChild(leg);
      var tipEls = null, B = 1, sums = new Float64Array(list.length);
      function bucketOf(k) { return Math.floor(k / B) * B; }
      function agg(r, s, b0) {
        var a = r.vals[s.vi], n = 0, sum = 0, last = 0;
        for (var k = Math.max(0, b0); k < b0 + B && k <= H; k++) { sum += a[k]; last = a[k]; n++; }
        return f.agg === "mean" ? (n ? sum / n : 0) : f.agg === "last" ? last : sum;
      }
      var P = Plot(c, { onHover: function (k) { var r = run(), b0 = bucketOf(k); tipEls.t.textContent = fmtTime(b0) + " – " + fmtTime(Math.min(H, b0 + B)); list.forEach(function (s, i) { tipEls.vals[i].textContent = fmt(agg(r, s, b0), f.format || s.v.format); }); } });
      tipEls = tipRows(P.tip, list.map(function (s) { return { color: s.color, label: s.label, block: true }; }));
      caption(c, f);
      host.appendChild(c);
      var hl = svgEl("rect", { style: "fill:none;stroke:var(--nv-fg);stroke-width:1.5", rx: "2" });
      var F = { root: c };
      F.draw = function () {
        var r = run(), w = win(), sp = w[1] - w[0];
        B = f.bucket || (function () { var st = TIME_STEPS[CLOCK] || [1, 2, 5, 10, 20, 50, 100, 200, 500, 1000]; for (var i = 0; i < st.length; i++) if (sp / st[i] <= 30) return st[i]; return st[st.length - 1]; })();
        bucketNote.textContent = (f.agg === "mean" ? "mean per " : f.agg === "last" ? "last of each " : "per ") + (COUNT_UNITS[CLOCK] ? grp(String(B)) + " " + COUNT_UNITS[CLOCK][B === 1 ? 0 : 1] : fmtDur(B, CLOCK));
        var hi = 0;
        for (var b = 0; b <= H; b += B) { var tot = 0; for (var j = 0; j < list.length; j++) tot += Math.max(0, agg(r, list[j], b)); if (tot > hi) hi = tot; }
        P.frame(widthOf(F), w[0], w[1], 0, niceCeil(hi || 1), f.format || list[0].v.format);
        var gap = 1.5;
        for (var b0 = bucketOf(w[0]); b0 <= w[1]; b0 += B) {
          var xa = Math.max(P.ml, P.x(b0)), xb = Math.min(P.w - P.mr, P.x(Math.min(H, b0 + B))), acc = 0;
          if (xb - xa < 0.5) continue;
          for (var i = 0; i < list.length; i++) {
            var v = Math.max(0, agg(r, list[i], b0));
            if (v <= 0) continue;
            var ya = P.y(acc + v), yb = P.y(acc);
            P.gData.appendChild(svgEl("rect", { x: r1(xa + gap / 2), y: r1(ya), width: r1(Math.max(0.5, xb - xa - gap)), height: r1(Math.max(0, yb - ya)), style: "fill:" + hue(list[i].color) }));
            acc += v;
          }
        }
        P.gCur.appendChild(hl);
      };
      F.tick = function (k) {
        var r = run(), b0 = bucketOf(k);
        P.cursor(k);
        var tot = 0;
        list.forEach(function (s, i) { sums[i] = agg(r, s, b0); tot += Math.max(0, sums[i]); items[i].b.textContent = fmt(sums[i], f.format || s.v.format); });
        var xa = Math.max(P.ml, P.x(b0)), xb = Math.min(P.w - P.mr, P.x(Math.min(H, b0 + B)));
        var vis = b0 + B > P.w0 && b0 <= P.w1;
        hl.setAttribute("visibility", vis && tot > 0 ? "visible" : "hidden");
        if (vis) { hl.setAttribute("x", r1(xa)); hl.setAttribute("width", r1(Math.max(1, xb - xa))); hl.setAttribute("y", r1(P.y(tot))); hl.setAttribute("height", r1(Math.max(0, P.y(0) - P.y(tot)))); }
      };
      return register(F, P.el);
    }

    /* horizontal bars of the current values */
    function figBar(f, host) {
      var c = card(f), box = el("div", { class: "nthview-bars", role: "list" });
      var list = f.bars.map(function (b, i) {
        var v = M.vars[M.vi[b.var]], fill = el("span", { class: "nthview-barfill", style: "background:" + hue(b.color || v.color || HUE_ORDER[i]) }), val = el("span", { class: "nthview-barval" });
        box.appendChild(el("div", { class: "nthview-barrow", role: "listitem" }, [el("span", { text: b.label || v.label }), el("span", { class: "nthview-bartrack" }, [fill]), val]));
        return { v: v, fill: fill, val: val };
      });
      var lo = el("span", { text: "0" }), hiL = el("span");
      box.appendChild(el("div", { class: "nthview-scale", "aria-hidden": "true" }, [lo, hiL]));
      c.appendChild(box); caption(c, f); host.appendChild(c);
      var max = 1, F = { root: c };
      F.draw = function () {
        var r = run(), hi = 0;
        list.forEach(function (b) { hi = Math.max(hi, r.hi[b.v.i]); });
        max = typeof f.max === "number" ? f.max : niceCeil(hi || 1);
        hiL.textContent = fmt(max, f.format || list[0].v.format, f.unit || list[0].v.unit);
      };
      F.tick = function (k) {
        var r = run();
        list.forEach(function (b) { var x = r.vals[b.v.i][k]; b.fill.style.width = Math.max(0, Math.min(100, x / max * 100)) + "%"; b.val.textContent = fmtMeta(b.v, x); });
      };
      return register(F, null);
    }

    /* gauge: a bullet meter against zones */
    function figGauge(f, host) {
      var c = card(f), v = M.vars[M.vi[f.var]];
      var val = el("span", { class: "nthview-gauge-v" }), pill = el("span", { class: "nthview-pill" }), of = el("span", { class: "nthview-gauge-lab" });
      c.appendChild(el("div", { class: "nthview-gauge-top" }, [val, pill, of]));
      var track = el("div", { class: "nthview-gauge-track", role: "meter", "aria-label": f.label || v.label });
      var fill = el("div", { class: "nthview-gauge-fill" });
      c.appendChild(track);
      var lo = el("span"), lab = el("span", { text: f.label || "" }), hiL = el("span");
      c.appendChild(el("div", { class: "nthview-scale" }, [lo, lab, hiL]));
      caption(c, f); host.appendChild(c);
      var gmin = typeof f.min === "number" ? f.min : isFinite(v.lo) ? v.lo : 0, gmax = typeof f.max === "number" ? f.max : v.hi;
      var zones = [], F = { root: c };
      F.draw = function () {
        var p = run().params;
        track.textContent = "";
        zones = [];
        var prev = gmin;
        (f.zones || []).forEach(function (z, i) {
          var to = i === f.zones.length - 1 ? gmax : Math.max(prev, Math.min(gmax, paramOrNum(z.to, p)));
          var a = (prev - gmin) / (gmax - gmin) * 100, b = (to - gmin) / (gmax - gmin) * 100;
          track.appendChild(el("div", { class: "nthview-gauge-zone", style: "left:" + a + "%;width:" + Math.max(0, b - a) + "%;background:" + hue(z.color) }));
          if (i > 0) track.appendChild(el("div", { class: "nthview-gauge-edge", style: "left:" + a + "%;background:" + hue(z.color) }));
          zones.push({ from: prev, to: to, z: z });
          prev = to;
        });
        track.appendChild(fill);
        lo.textContent = fmt(gmin, f.format || v.format, null); hiL.textContent = fmt(gmax, f.format || v.format, null);
        track.setAttribute("aria-valuemin", String(gmin)); track.setAttribute("aria-valuemax", String(gmax));
      };
      F.tick = function (k) {
        var x = run().vals[v.i][k], pct = Math.max(0, Math.min(100, (x - gmin) / (gmax - gmin) * 100));
        fill.style.width = pct + "%";
        val.textContent = fmt(x, f.format || v.format, f.unit || v.unit);
        track.setAttribute("aria-valuenow", String(x)); track.setAttribute("aria-valuetext", val.textContent);
        var zn = null;
        zones.forEach(function (z, i) { if (x >= z.from && (x < z.to || i === zones.length - 1)) zn = z.z; });
        pill.hidden = !zn;
        if (zn) { pill.textContent = zn.label; pill.style.color = hue(zn.color); }
        of.textContent = "of " + fmt(gmax, f.format || v.format, null);
      };
      return register(F, null);
    }

    /* tiles with a delta and a sparkline */
    function figTile(f, host) {
      var c = card(f), box = el("div", { class: "nthview-tiles" });
      var list = f.items.map(function (it, i) {
        var v = M.vars[M.vi[it.var]], val = el("div", { class: "nthview-tile-v" }), d = el("div", { class: "nthview-tile-d" });
        var t = el("div", { class: "nthview-tile" }, [el("div", { class: "nthview-tile-l", text: it.label || v.label }), val, d]);
        var sp = null, sline = null, sdot = null;
        if (f.sparkline !== false) {
          sp = svgEl("svg", { class: "nthview-spark", viewBox: "0 0 100 30", preserveAspectRatio: "none", "aria-hidden": "true", focusable: "false" });
          sline = svgEl("path", { style: "fill:none;stroke:" + hue(it.color || v.color) + ";stroke-width:1.75;vector-effect:non-scaling-stroke" });
          sdot = svgEl("line", { style: "stroke:var(--nv-fg);stroke-width:1.25;vector-effect:non-scaling-stroke", y1: "0", y2: "30" });
          sp.appendChild(sline); sp.appendChild(sdot); t.appendChild(sp);
        }
        box.appendChild(t);
        return { it: it, v: v, val: val, d: d, sline: sline, sdot: sdot, fmtf: it.format || v.format, unit: it.unit !== undefined ? it.unit : v.unit };
      });
      c.appendChild(box); caption(c, f); host.appendChild(c);
      var F = { root: c };
      F.draw = function () {
        var r = run(), w = win();
        list.forEach(function (t) {
          if (!t.sline) return;
          var a = r.vals[t.v.i], lo = r.lo[t.v.i], hi = r.hi[t.v.i], pts = [], n = w[1] - w[0] || 1;
          var stepN = Math.max(1, Math.floor(n / 120));
          for (var k = w[0]; k <= w[1]; k += stepN) pts.push(r1((k - w[0]) / n * 100) + "," + r1(28 - (hi > lo ? (a[k] - lo) / (hi - lo) : 0) * 26));
          t.sline.setAttribute("d", "M" + pts.join("L"));
        });
      };
      F.tick = function (k) {
        var r = run(), w = win();
        list.forEach(function (t) {
          var a = r.vals[t.v.i], x = a[k], mode = t.it.delta || "start";
          t.val.textContent = fmt(x, t.fmtf, t.unit);
          if (mode === "none") t.d.textContent = "";
          else {
            var ref = mode === "tick" ? a[Math.max(0, k - 1)] : a[0], dv = x - ref, same = Math.abs(dv) < 1e-9;
            t.d.textContent = same ? "no change " + (mode === "tick" ? "this tick" : "since start") : (dv > 0 ? "▲ +" : "▼ ") + fmt(dv, t.fmtf === "duration" ? "duration" : t.fmtf, t.fmtf === "duration" ? null : t.unit) + (mode === "tick" ? " this tick" : " since start");
            var good = t.it.better ? (dv > 0) === (t.it.better === "up") : null;
            t.d.classList.toggle("nthview-good", !same && good === true);
            t.d.classList.toggle("nthview-bad", !same && good === false);
          }
          if (t.sdot) { var vis = k >= w[0] && k <= w[1], px = r1((k - w[0]) / ((w[1] - w[0]) || 1) * 100); t.sdot.setAttribute("visibility", vis ? "visible" : "hidden"); t.sdot.setAttribute("x1", px); t.sdot.setAttribute("x2", px); }
        });
      };
      return register(F, box);
    }

    /* event timeline */
    function figEvents(f, host) {
      var c = card(f), box = el("div");
      c.appendChild(box);
      var axisHost = el("div", { class: "nthview-evaxis" });
      c.appendChild(axisHost);
      caption(c, f); host.appendChild(c);
      var rows = [], axisP = Plot(axisHost, { h: 26, mt: 2, ml: 4, noY: true, markers: false });
      axisP.el.style.cursor = "pointer";
      var F = { root: c };
      function build() {
        box.textContent = ""; rows = [];
        var r = run(), ids = f.events || r.active.map(function (e) { return e.id; });
        ids.forEach(function (id) {
          var e = null;
          r.active.forEach(function (x) { if (x.id === id) e = x; });
          var count = el("small"), last = el("div", { class: "nthview-evlast" });
          var name = el("button", { type: "button", class: "nthview-evname", title: e && e.note ? e.note : "" }, [el("span", { class: "nthview-evdot", style: "background:" + hue(e ? e.color : "grey") }), el("span", { text: e ? e.label : id }), count]);
          var track = el("div");
          var P = Plot(track, { h: 26, mt: 4, ml: 4, noX: true, noY: true, markers: false });
          box.appendChild(el("div", { class: "nthview-evrow" }, [name, track, last]));
          var row = { id: id, e: e, P: P, count: count, last: last, track: track };
          name.addEventListener("click", function () {
            if (!row.e) return;
            var fr = run().fired[id];
            for (var k = S.tick + 1; k <= H; k++) if (fr[k]) { seek(k); return; }
            for (var k2 = 1; k2 <= S.tick; k2++) if (fr[k2]) { seek(k2); return; }
          });
          name.setAttribute("aria-label", (e ? e.label : id) + ": jump to its next occurrence");
          rows.push(row);
        });
        if (!rows.length) box.appendChild(el("p", { class: "nthview-caption", text: "No events in this scenario." }));
      }
      var builtFor = null;
      F.draw = function () {
        var r = run(), w = win(), width = widthOf(F);
        if (builtFor !== r.sc.id) { build(); builtFor = r.sc.id; }
        var tw = rows.length ? Math.round(rows[0].track.clientWidth) || width : width;
        rows.forEach(function (row) {
          row.P.frame(tw, w[0], w[1], 0, 1, null);
          if (!row.e) { row.count.textContent = "(not in this scenario)"; return; }
          var fr = r.fired[row.id], n = 0;
          for (var k = 1; k <= H; k++) if (fr[k]) {
            n++;
            if (k < w[0] || k > w[1]) continue;
            var x = r1(row.P.x(k));
            row.P.gData.appendChild(svgEl("rect", { x: r1(x - 2), y: 7, width: 4, height: 14, rx: 1.5, style: "fill:" + hue(row.e.color) }));
          }
          row.count.textContent = "×" + n;
          row.n = n;
        });
        axisP.frame(tw + 4, w[0], w[1], 0, 1, null);
      };
      F.tick = function (k) {
        var r = run();
        axisP.cursor(k);
        rows.forEach(function (row) {
          row.P.cursor(k);
          if (!row.e) { row.last.textContent = ""; return; }
          var fr = r.fired[row.id], lastK = -1;
          for (var j = k; j >= 1; j--) if (fr[j]) { lastK = j; break; }
          row.last.textContent = lastK < 0 ? (row.n ? "not yet" : "never in this run") : lastK === k ? "fires now" : "last at " + fmtTime(lastK);
        });
      };
      return register(F, box);
    }

    /* this tick's calculation */
    function figCalc(f, host) {
      var c = card(f), evLine = el("p", { class: "nthview-calc-ev", "aria-live": "off" });
      var heading = el("p", { class: "nthview-caption", style: "margin:0 0 .5rem" });
      c.appendChild(heading);
      if (f.showEvents !== false) c.appendChild(evLine);
      var table = el("table", { class: "nthview-calc" });
      table.appendChild(el("colgroup", {}, [el("col", { class: "nthview-c1" }), el("col", { class: "nthview-c2" }), el("col"), el("col", { class: "nthview-c4" })]));
      table.appendChild(el("thead", {}, [el("tr", {}, [el("th", { text: "#" }), el("th", { text: "Rule" }), el("th", { text: "Reads" }), el("th", { text: "Result", style: "text-align:right" })])]));
      var tb = el("tbody");
      table.appendChild(tb);
      c.appendChild(table); caption(c, f); host.appendChild(c);
      var rec = { events: [], rules: M.rules.map(function (r) { return { inputs: new Float64Array(r.ids.length), before: 0, after: 0, skipped: false }; }) };
      var rows = [];
      M.rules.forEach(function (rule, ri) {
        if (f.targets && f.targets.indexOf(rule.v.id) === -1) return;
        var ins = rule.ids.map(function (id) { var b = el("b"); return { id: id, b: b, span: el("span", { class: "nthview-in" }, [doc.createTextNode(id + " = "), b]) }; });
        var res = el("b"), sub = el("small");
        var ruleCell = el("td", {}, [el("strong", { text: rule.label || rule.v.label }), el("code", { class: "nthview-f", text: rule.v.id + " = " + rule.src + (rule.whenSrc ? "   when " + rule.whenSrc : "") })]);
        if (rule.note) ruleCell.title = rule.note;
        var tr = el("tr", {}, [el("td", { class: "nthview-n", text: String(rule.n) }), ruleCell, el("td", { class: "nthview-ins" }, ins.map(function (x) { return x.span; })), el("td", { class: "nthview-res" }, [res, sub])]);
        tb.appendChild(tr);
        rows.push({ ri: ri, rule: rule, tr: tr, ins: ins, res: res, sub: sub });
      });
      var F = { root: c };
      function metaFmt(id, x) { if (id === "t") return fmtTime(x); var m = M.meta[id]; if (m) return fmtMeta(m, x); return x ? "fired" : "0"; }
      F.draw = function () {};
      F.tick = function (k) {
        var r = run();
        if (k === 0) {
          heading.textContent = fmtTime(0) + ": every variable starts at its initial value; rules run from the next tick.";
          evLine.textContent = "No events at the start.";
          rows.forEach(function (row) {
            row.tr.classList.remove("nthview-chg"); row.tr.classList.remove("nthview-skip");
            row.ins.forEach(function (x) { x.b.textContent = "–"; });
            row.res.textContent = fmtMeta(row.rule.v, r.vals[row.rule.v.i][0]); row.sub.textContent = "initial";
          });
          return;
        }
        replay(M, r, k, rec);
        heading.textContent = "Tick " + grp(String(k)) + " (" + fmtTime(k) + "): events first, then each rule in order, each reading the values above it.";
        if (!rec.events.length) evLine.textContent = "No events on this tick.";
        else {
          evLine.textContent = "";
          rec.events.forEach(function (ev, i) {
            if (i) evLine.appendChild(doc.createTextNode(" · "));
            evLine.appendChild(el("b", { text: ev.e.label }));
            if (ev.sets.length) evLine.appendChild(doc.createTextNode(": " + ev.sets.map(function (s) { return s.v.id + " → " + fmtMeta(s.v, s.after); }).join(", ")));
          });
        }
        rows.forEach(function (row) {
          var rr = rec.rules[row.ri];
          row.ins.forEach(function (x, i) { x.b.textContent = metaFmt(x.id, rr.inputs[i]); });
          var ch = !rr.skipped && Math.abs(rr.after - rr.before) > 1e-12;
          row.tr.classList.toggle("nthview-chg", ch);
          row.tr.classList.toggle("nthview-skip", rr.skipped);
          row.res.textContent = fmtMeta(row.rule.v, rr.after);
          row.sub.textContent = rr.skipped ? "skipped" : ch ? "was " + fmtMeta(row.rule.v, rr.before) : "unchanged";
        });
      };
      return register(F, null);
    }

    /* small multiples, one per scenario, one shared scale */
    function figCompare(f, host) {
      var c = card(f), v = M.vars[M.vi[f.var]], grid = el("div", { class: "nthview-multi" });
      c.appendChild(grid); caption(c, f); host.appendChild(c);
      var ids = f.scenarios || M.scen.map(function (s) { return s.id; });
      var panels = ids.map(function (sid) {
        var si = 0; M.scen.forEach(function (s, i) { if (s.id === sid) si = i; });
        var b = el("b"), head = el("button", { type: "button", class: "nthview-mini-h", "aria-label": "Switch to " + M.scen[si].label }, [el("span", { text: M.scen[si].label }), b]);
        head.addEventListener("click", function () { setScenario(si); });
        var box = el("div", { class: "nthview-mini" }, [head]);
        grid.appendChild(box);
        var tipEl = null;
        var P = Plot(box, { h: 120, ml: 40, yTicks: 2, markers: false, onHover: function (k) { tipEl.t.textContent = fmtTime(k); tipEl.vals[0].textContent = fmtMeta(v, runs[sid].vals[v.i][k]); } });
        tipEl = tipRows(P.tip, [{ color: v.color, label: M.scen[si].label }]);
        var dot = svgEl("circle", { r: "3.5", class: "nthview-dot", style: "fill:" + hue(v.color) });
        return { sid: sid, si: si, box: box, b: b, P: P, dot: dot };
      });
      var F = { root: c };
      F.draw = function () {
        var w = win(), lo = 0, hi = -Infinity;
        panels.forEach(function (p) { var r = runs[p.sid]; lo = Math.min(lo, r.lo[v.i]); hi = Math.max(hi, r.hi[v.i]); });
        var y0 = typeof f.yMin === "number" ? f.yMin : lo, y1 = typeof f.yMax === "number" ? f.yMax : niceCeil(hi > y0 ? hi : y0 + 1);
        var width = Math.round(panels[0].P.el.clientWidth) || 200;
        panels.forEach(function (p) {
          var r = runs[p.sid], a = r.vals[v.i], pts = [];
          p.P.frame(width, w[0], w[1], y0, y1, f.format || v.format);
          p.P.markers(r);
          for (var k = w[0]; k <= w[1]; k++) pts.push(r1(p.P.x(k)) + "," + r1(p.P.y(a[k])));
          p.P.gData.appendChild(svgEl("path", { d: "M" + pts.join("L") + "L" + r1(p.P.x(w[1])) + "," + r1(p.P.y(Math.max(y0, 0))) + "L" + r1(p.P.x(w[0])) + "," + r1(p.P.y(Math.max(y0, 0))) + "Z", style: "fill:" + hue(v.color) + ";fill-opacity:.14;stroke:none" }));
          p.P.gData.appendChild(svgEl("path", { d: "M" + pts.join("L"), style: "fill:none;stroke:" + hue(v.color) + ";stroke-width:2" }));
          p.P.gCur.appendChild(p.dot);
        });
      };
      F.tick = function (k) {
        panels.forEach(function (p) {
          var x = runs[p.sid].vals[v.i][k], vis = p.P.cursor(k);
          p.b.textContent = fmtMeta(v, x);
          p.box.classList.toggle("nthview-cur-s", p.si === S.scen);
          p.dot.setAttribute("visibility", vis ? "visible" : "hidden");
          if (vis) { p.dot.setAttribute("cx", r1(p.P.x(k))); p.dot.setAttribute("cy", r1(p.P.y(x))); }
        });
      };
      return register(F, grid);
    }

    /* heat map: scenarios by time */
    function figHeatmap(f, host) {
      var c = card(f), v = M.vars[M.vi[f.var]], ids = f.scenarios || M.scen.map(function (s) { return s.id; });
      var labels = el("div", { class: "nthview-heat-l" }), right = el("div", { style: "min-width:0" });
      c.appendChild(el("div", { class: "nthview-heat" }, [labels, right]));
      var keyLo = el("span", { text: "0" }), keyHi = el("span");
      c.appendChild(el("div", { class: "nthview-heat-key", "aria-hidden": "true" }, [keyLo, el("i"), keyHi, el("span", { text: (f.agg || "mean") + " per cell" })]));
      caption(c, f); host.appendChild(c);
      var rowsMeta = ids.map(function (sid) {
        var si = 0; M.scen.forEach(function (s, i) { if (s.id === sid) si = i; });
        var b = el("button", { type: "button", text: M.scen[si].label, "aria-pressed": "false", title: "Switch to " + M.scen[si].label });
        b.addEventListener("click", function () { setScenario(si); });
        labels.appendChild(b);
        return { sid: sid, si: si, b: b };
      });
      var RH = 30, nb = f.buckets || 48, tipEls = null, cells = [];
      function cellVal(sid, b0, B) {
        var a = runs[sid].vals[v.i], s = 0, mx = -Infinity, last = 0, n = 0;
        for (var k = b0; k < b0 + B && k <= H; k++) { s += a[k]; if (a[k] > mx) mx = a[k]; last = a[k]; n++; }
        return f.agg === "max" ? (n ? mx : 0) : f.agg === "last" ? last : (n ? s / n : 0);
      }
      var B = 1, b00 = 0;
      var P = Plot(right, { h: rowsMeta.length * RH + 24, mt: 0, ml: 0, noY: true, markers: false, onHover: function (k) {
        var bi = Math.floor((k - b00) / B), b0 = b00 + bi * B;
        tipEls.t.textContent = fmtTime(b0) + " – " + fmtTime(Math.min(H, b0 + B));
        rowsMeta.forEach(function (rm, i) { tipEls.vals[i].textContent = fmtMeta(v, cellVal(rm.sid, b0, B)); });
      } });
      tipEls = tipRows(P.tip, rowsMeta.map(function (rm) { return { color: v.color, label: M.scen[rm.si].label, block: true }; }));
      var F = { root: c };
      F.draw = function () {
        var w = win(), sp = Math.max(1, w[1] - w[0] + 1);
        B = Math.max(1, Math.ceil(sp / nb)); b00 = w[0];
        var max = typeof f.max === "number" ? f.max : 0, vals = [];
        rowsMeta.forEach(function (rm, i) {
          vals[i] = [];
          for (var b0 = w[0]; b0 <= w[1]; b0 += B) { var x = cellVal(rm.sid, b0, B); vals[i].push(x); if (typeof f.max !== "number" && x > max) max = x; }
        });
        if (!(max > 0)) max = 1;
        P.frame(widthOf(F), w[0], w[1], 0, 1, null);
        cells = [];
        rowsMeta.forEach(function (rm, i) {
          var y = i * RH + 2;
          vals[i].forEach(function (x, j) {
            var b0 = w[0] + j * B, xa = P.x(b0), xb = P.x(Math.min(w[1], b0 + B));
            var t = Math.max(0, Math.min(1, x / max));
            P.gData.appendChild(svgEl("rect", { x: r1(xa + 0.5), y: y, width: r1(Math.max(0.5, xb - xa - 1)), height: RH - 4, rx: 1.5, style: t > 0 ? "fill:var(--nv-accent);fill-opacity:" + (0.12 + 0.88 * t).toFixed(3) : "fill:var(--mx-soft)" }));
          });
        });
        keyHi.textContent = fmtMeta(v, max);
      };
      F.tick = function (k) { P.cursor(k); rowsMeta.forEach(function (rm) { rm.b.setAttribute("aria-pressed", String(rm.si === S.scen)); }); };
      return register(F, right);
    }

    /* calculation flow: inputs on the left, each rule's target to the right of what it reads */
    function figFlow(f, host) {
      var c = card(f), box = el("div", { class: "nthview-flow" });
      c.appendChild(box); caption(c, f); host.appendChild(c);
      var rules = M.rules.filter(function (r) { return !f.targets || f.targets.indexOf(r.v.id) !== -1; });
      var nodes = {}, order = [], depth = {}, updated = {};
      function node(id) {
        if (nodes[id]) return nodes[id];
        var kind = M.vi.hasOwnProperty(id) ? "var" : M.pi.hasOwnProperty(id) ? "par" : id === "t" ? "t" : "ev";
        var n = { id: id, kind: kind, col: 0, row: 0, edges: [], hot: 0 };
        nodes[id] = n; order.push(n);
        return n;
      }
      M.rules.forEach(function (r) {
        var on = rules.indexOf(r) !== -1, d = 0;
        r.ids.forEach(function (id) { if (id !== r.v.id && updated[id]) d = Math.max(d, depth[id]); });
        if (on) {
          var tgt = node(r.v.id);
          depth[r.v.id] = Math.max(depth[r.v.id] || 0, d + 1);
          tgt.col = Math.max(tgt.col, depth[r.v.id]);
          r.ids.forEach(function (id) { if (id === r.v.id) return; var src = node(id); tgt.edges.push({ from: src, rule: r }); });
        } else if (updated[r.v.id] === undefined) depth[r.v.id] = d + 1;
        updated[r.v.id] = true;
      });
      /* inputs computed outside the figure sit one column left of their first reader */
      order.forEach(function (n) {
        if (n.kind === "var" && !rules.some(function (r) { return r.v.id === n.id; })) {
          var min = Infinity;
          order.forEach(function (m) { m.edges.forEach(function (e) { if (e.from === n) min = Math.min(min, m.col); }); });
          n.col = isFinite(min) ? Math.max(0, min - 1) : 0;
        } else if (n.kind !== "var") n.col = 0;
      });
      var cols = [];
      order.forEach(function (n) { (cols[n.col] = cols[n.col] || []).push(n); n.row = cols[n.col].length - 1; });
      var NW = 150, NH = 44, GX = 52, GY = 12, rowsMax = 0;
      cols.forEach(function (cl) { if (cl) rowsMax = Math.max(rowsMax, cl.length); });
      var Wt = cols.length * NW + (cols.length - 1) * GX, Ht = rowsMax * NH + (rowsMax - 1) * GY;
      var svg = svgEl("svg", { viewBox: "-4 -4 " + (Wt + 8) + " " + (Ht + 8), role: "img", "aria-label": "How each value is calculated from the ones before it" });
      var gE = svgEl("g"), gN = svgEl("g"), gP = svgEl("g");
      svg.appendChild(gE); svg.appendChild(gN); svg.appendChild(gP);
      box.appendChild(svg);
      function nx(n) { return n.col * (NW + GX); }
      function ny(n) { var cl = cols[n.col], off = (rowsMax - cl.length) * (NH + GY) / 2; return off + n.row * (NH + GY); }
      var edges = [];
      order.forEach(function (n) {
        var color = n.kind === "var" ? M.meta[n.id].color : n.kind === "ev" ? evColorOf(n.id) : "grey";
        n.color = color;
        n.edges.forEach(function (e) {
          var x1 = nx(e.from) + NW, y1 = ny(e.from) + NH / 2, x2 = nx(n), y2 = ny(n) + NH / 2, mx = (x1 + x2) / 2;
          if (x2 <= x1) { x1 = nx(e.from) + NW / 2; y1 = ny(e.from) + (y2 > y1 ? NH : 0); mx = x1; }
          var p = svgEl("path", { class: "nthview-fe", d: "M" + r1(x1) + " " + r1(y1) + "C" + r1(mx) + " " + r1(y1) + " " + r1(mx) + " " + r1(y2) + " " + r1(x2) + " " + r1(y2) });
          gE.appendChild(p);
          e.path = p; e.len = 0; edges.push(e);
        });
        var g = svgEl("g", { class: "nthview-fn" + (n.kind !== "var" ? " nthview-par" : ""), transform: "translate(" + nx(n) + "," + ny(n) + ")" });
        g.appendChild(svgEl("rect", { width: NW, height: NH, rx: 8, style: "stroke:" + hue(color) }));
        var lab = svgEl("text", { class: "nthview-fl", x: 10, y: 16 }), val = svgEl("text", { class: "nthview-fv", x: 10, y: 34 });
        var m = M.meta[n.id];
        lab.textContent = (m ? m.label : n.kind === "ev" ? evLabelOf(n.id) : "tick").slice(0, 24);
        g.appendChild(lab); g.appendChild(val);
        gN.appendChild(g);
        n.g = g; n.val = val; n.last = "";
      });
      var packets = [], pk = null;
      function launch(e, delay) {
        if (reduce || packets.length > 40) return;
        if (!e.len) e.len = e.path.getTotalLength();
        var dot = svgEl("circle", { r: 4.5, class: "nthview-pk", style: "fill:" + hue(e.from.color === "grey" ? "blue" : e.from.color) + ";color:" + hue(e.from.color === "grey" ? "blue" : e.from.color), visibility: "hidden" });
        gP.appendChild(dot);
        packets.push({ e: e, dot: dot, t0: performance.now() + delay, dur: 520 });
        if (!pk) pk = root.requestAnimationFrame(movePackets);
      }
      function movePackets(now) {
        pk = null;
        if (!alive()) return;
        for (var i = packets.length - 1; i >= 0; i--) {
          var p = packets[i], u = (now - p.t0) / p.dur;
          if (u < 0) continue;
          if (u >= 1) { if (p.dot.parentNode) p.dot.parentNode.removeChild(p.dot); packets.splice(i, 1); continue; }
          var pt = p.e.path.getPointAtLength(p.e.len * u);
          p.dot.setAttribute("visibility", "visible"); p.dot.setAttribute("cx", pt.x); p.dot.setAttribute("cy", pt.y);
        }
        if (packets.length) pk = root.requestAnimationFrame(movePackets);
      }
      var lastK = -1, F = { root: c };
      F.draw = function () { lastK = -1; };
      F.tick = function (k) {
        var r = run(), step = k - lastK === 1, ord = 0;
        order.forEach(function (n) {
          var s;
          if (n.kind === "var") s = fmtMeta(M.meta[n.id], r.vals[M.vi[n.id]][k]);
          else if (n.kind === "par") s = fmtMeta(M.meta[n.id], r.params[n.id]);
          else if (n.kind === "t") s = fmtTime(k);
          else s = r.fired[n.id] && r.fired[n.id][k] ? "fires now" : "–";
          if (s !== n.last) { n.val.textContent = s; n.last = s; }
          var ch = n.kind === "var" && k > 0 && Math.abs(r.vals[M.vi[n.id]][k] - r.vals[M.vi[n.id]][k - 1]) > 1e-12 && n.edges.length > 0;
          n.g.classList.toggle("nthview-hot", ch);
          n.edges.forEach(function (e) {
            e.path.classList.toggle("nthview-hot", ch);
            e.path.style.stroke = ch ? hue(n.color) : "";
            if (ch && step) launch(e, ord * 90);
          });
          if (ch) ord++;
        });
        lastK = k;
      };
      return register(F, box);
    }
    function evColorOf(id) { var c = "grey"; M.events.concat.apply(M.events, M.scen.map(function (s) { return s.events; })).forEach(function (e) { if (e.id === id) c = e.color; }); return c; }
    function evLabelOf(id) { var c = id; M.events.concat.apply(M.events, M.scen.map(function (s) { return s.events; })).forEach(function (e) { if (e.id === id) c = e.label; }); return c; }

    /* state chips that flash when their value changes */
    function figState(f, host) {
      var c = card(f), box = el("div", { class: "nthview-chips" });
      var list = f.vars.map(function (id) {
        var v = M.vars[M.vi[id]], b = el("b"), chip = el("span", { class: "nthview-chip", style: "--c:" + hue(v.color) }, [el("span", { text: v.label }), b]);
        b.style.color = hue(v.color);
        box.appendChild(chip);
        return { v: v, b: b, chip: chip, last: null };
      });
      c.appendChild(box); caption(c, f); host.appendChild(c);
      var F = { root: c };
      F.draw = function () { list.forEach(function (x) { x.last = null; }); };
      F.tick = function (k) {
        var r = run();
        list.forEach(function (x) {
          var s = fmtMeta(x.v, r.vals[x.v.i][k]);
          if (s === x.last) return;
          x.b.textContent = s;
          if (x.last !== null && !reduce) { x.chip.classList.remove("nthview-flash"); void x.chip.offsetWidth; x.chip.classList.add("nthview-flash"); }
          x.last = s;
        });
      };
      return register(F, null);
    }

    var BUILDERS = { line: figSeries, step: figSeries, area: figSeries, stacked: figStacked, bar: figBar, gauge: figGauge, tile: figTile, events: figEvents, calc: figCalc, compare: figCompare, heatmap: figHeatmap, flow: figFlow, state: figState };

    /* ---- chapters ---- */
    var main = el("main");
    container.appendChild(main);
    var chEls = [], checkPainters = [], stepEls = [], pins = [];
    function figVars(s) {
      var out = [];
      function add(id) { if (id && M.vi.hasOwnProperty(id) && out.indexOf(id) === -1) out.push(id); }
      (s.focus || []).forEach(add);
      (s.figures || []).forEach(function (f) {
        add(f["var"]);
        (f.series || []).forEach(function (x) { add(x["var"]); });
        (f.bars || []).forEach(function (x) { add(x["var"]); });
        (f.items || []).forEach(function (x) { add(x["var"]); });
        (f.vars || []).forEach(add);
        (f.targets || []).forEach(add);
      });
      return out;
    }
    SECTIONS.forEach(function (s, si) {
      var sec = el("section", { class: "nthview-ch", id: "nthview-s-" + gen + "-" + s.id, "aria-labelledby": "nthview-h-" + gen + "-" + s.id, "data-ch": String(si) });
      var wrap = el("div", { class: "nthview-wrap" });
      sec.appendChild(wrap);
      var head = el("div", { class: "nthview-ch-head nthview-prose" });
      var num = el("div", { class: "nthview-ch-num" }, [doc.createTextNode((si + 1 < 10 ? "0" : "") + (si + 1) + " "), el("span", { text: "/ " + (s.kicker || "Chapter") })]);
      head.appendChild(num);
      head.appendChild(el("h2", { class: "nthview-ch-title", id: "nthview-h-" + gen + "-" + s.id, text: s.title }));
      s.body.forEach(function (t) { head.appendChild(para(t)); });
      var figsBox = null;
      if (s["goto"]) {
        var g = s["goto"], gb = el("button", { type: "button", class: "nthview-btn nthview-goto" }, [icon("jump"), el("span", { text: g.label })]);
        gb.addEventListener("click", function () {
          if (g.scenario) M.scen.forEach(function (x, i) { if (x.id === g.scenario) setScenario(i); });
          if (g.window) WINDOWS.forEach(function (w, i) { if (w.label === g.window) setWindow(i); });
          tweenTo(g.tick);
          if (figsBox && root.innerWidth < 900) root.setTimeout(function () { figsBox.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); }, 0);
        });
        head.appendChild(gb);
      }
      if (s.controls && !s.bench) head.appendChild(controlCard(s.controls, "Try it"));
      wrap.appendChild(head);
      var x = { s: s, el: sec, figs: null, focus: figVars(s), mode: s.scrub ? "pin" : "side" };
      function buildFigs(host) { (s.figures || []).forEach(function (f) { BUILDERS[f.kind](f, host); }); }
      if (s.scrub) {
        sec.classList.add("nthview-pin");
        sec.style.height = ((s.scrub.screens || 4) * 100 + 100) + "vh";
        var big = el("div", { class: "nthview-bigtime" }), bigMain = el("span"), bigSub = el("small");
        big.appendChild(bigMain); big.appendChild(bigSub);
        var mark = el("p", { class: "nthview-mark", "aria-live": "polite" });
        var barFill = el("span");
        var left = el("div", { class: "nthview-pin-l" }, [big, mark, el("div", { class: "nthview-pinbar", "aria-hidden": "true" }, [barFill]), el("p", { class: "nthview-pinhint", text: "Keep scrolling: the clock runs from " + fmtTime(s.scrub.from) + " to " + fmtTime(s.scrub.to) + "." })]);
        figsBox = el("div", { class: "nthview-pin-r" });
        buildFigs(figsBox);
        var pinIn = el("div", { class: "nthview-pin-in nthview-wrap" }, [left, figsBox]);
        sec.appendChild(pinIn);
        var marks = (s.scrub.marks || []).map(function (m) { var p = el("span"); p.appendChild(rich(m.text)); return { at: m.at, node: p }; });
        pins.push({ x: x, s: s, head: wrap, bigMain: bigMain, bigSub: bigSub, mark: mark, marks: marks, bar: barFill, lastMark: null });
      } else if (s.steps) {
        var steps = el("div", { class: "nthview-steps" });
        figsBox = el("div", { class: "nthview-viz" });
        buildFigs(figsBox);
        s.steps.forEach(function (st, k) {
          var when = el("div", { class: "nthview-when" }, [el("b", { text: fmtTime(st.at) })]);
          var sc = null;
          if (st.scenario) M.scen.forEach(function (z) { if (z.id === st.scenario) sc = z; });
          if (sc) when.appendChild(el("span", { text: sc.label }));
          if (st.window) when.appendChild(el("span", { text: "window " + st.window }));
          var cardEl = el("div", { class: "nthview-step-card nthview-glass" }, [when, el("h3", { text: st.title })]);
          cardEl.appendChild(para(st.text));
          var stepEl = el("div", { class: "nthview-step", "data-step": String(k) }, [cardEl]);
          steps.appendChild(stepEl);
          stepEls.push({ el: stepEl, st: st, x: x });
        });
        wrap.appendChild(el("div", { class: "nthview-scrolly" }, [steps, figsBox]));
      } else if (s.bench) {
        figsBox = el("div", { class: "nthview-viz", style: "position:relative;top:0;max-height:none;overflow:visible" });
        buildFigs(figsBox);
        var ids = s.controls || M.params.map(function (q) { return q.id; });
        var ctl = controlCard(ids, "The bench");
        var fromStart = el("button", { type: "button", class: "nthview-btn nthview-primary" }, [icon("play"), el("span", { text: "Play from the start" })]);
        fromStart.addEventListener("click", function () { setTick(0); play(true); });
        var bench = el("div", { class: "nthview-bench" }, [el("div", {}, [ctl, el("div", { class: "nthview-bench-acts" }, [fromStart])]), figsBox]);
        wrap.appendChild(bench);
        x.mode = "side";
      } else if (s.figures) {
        figsBox = el("div", { class: "nthview-figgrid" });
        buildFigs(figsBox);
        wrap.appendChild(figsBox);
      }
      if (s.check) head.appendChild(checkCard(s, figsBox));
      x.figs = figsBox;
      main.appendChild(sec);
      chEls.push(x);
    });

    function checkCard(s, figsBox) {
      var ck = s.check, box = el("div", { class: "nthview-check", role: "group", "aria-label": "Predict first" });
      box.appendChild(el("h3", { text: "Predict first" }));
      box.appendChild(el("p", { class: "nthview-check-q", text: ck.prompt }));
      var choices = el("div", { class: "nthview-choices" });
      var btns = ck.options.map(function (o, i) {
        var b = el("button", { type: "button", class: "nthview-btn nthview-choice", "aria-pressed": "false", text: o.text });
        b.addEventListener("click", function () { S.checks[s.id] = i; paint(); saveNow(); });
        choices.appendChild(b);
        return b;
      });
      box.appendChild(choices);
      var skip = el("button", { type: "button", class: "nthview-btn nthview-ghost", text: "Skip and show the figures" });
      skip.addEventListener("click", function () { S.checks[s.id] = -1; paint(); saveNow(); });
      var again = el("button", { type: "button", class: "nthview-btn nthview-ghost", text: "Ask me again" });
      again.addEventListener("click", function () { delete S.checks[s.id]; paint(); saveNow(); btns[0].focus(); });
      var result = el("div", { "aria-live": "polite" });
      box.appendChild(result);
      box.appendChild(el("div", { class: "nthview-bench-acts" }, [skip, again]));
      var veil = figsBox ? el("div", { class: "nthview-veil" }, [el("span", { text: "Make a prediction to see this" })]) : null;
      function paint() {
        var a = S.checks.hasOwnProperty(s.id) ? S.checks[s.id] : null, answered = a !== null;
        var correct = 0; ck.options.forEach(function (o, i) { if (o.correct) correct = i; });
        btns.forEach(function (b, i) {
          b.setAttribute("aria-pressed", String(a === i));
          b.classList.toggle("nthview-right", answered && i === correct);
          b.disabled = answered;
        });
        skip.hidden = answered; again.hidden = !answered;
        if (figsBox) {
          figsBox.classList.toggle("nthview-veiled", !answered);
          if (!answered && !veil.parentNode) figsBox.appendChild(veil);
          if (answered && veil.parentNode) veil.parentNode.removeChild(veil);
          var figEls = figsBox.querySelectorAll(".nthview-fig");
          for (var i = 0; i < figEls.length; i++) { if (answered) figEls[i].removeAttribute("aria-hidden"); else figEls[i].setAttribute("aria-hidden", "true"); }
        }
        result.textContent = "";
        if (!answered) return;
        if (a >= 0) {
          result.appendChild(el("p", { class: "nthview-verdict " + (a === correct ? "nthview-ok" : "nthview-no"), text: a === correct ? "✓ Your prediction holds." : "✗ Not quite. The model does something else." }));
          result.appendChild(para(ck.options[a].why));
          if (a !== correct) { var p2 = para(ck.options[correct].why); p2.insertBefore(el("strong", { text: "What happens: " }), p2.firstChild); result.appendChild(p2); }
        } else {
          var p3 = para(ck.options[correct].why); p3.insertBefore(el("strong", { text: ck.options[correct].text + ". " }), p3.firstChild); result.appendChild(p3);
        }
        if (ck.reveal) { result.appendChild(para(ck.reveal)); paintLive(); }
      }
      checkPainters.push(paint);
      paint();
      return box;
    }

    /* closing */
    var cl = el("section", { class: "nthview-closing nthview-wrap", "data-ch": String(SECTIONS.length) });
    if (data.closing) {
      cl.appendChild(el("div", { class: "nthview-ch-num", text: "Wrap-up" }));
      cl.appendChild(el("h2", { class: "nthview-ch-title", text: data.closing.heading || "What the clock showed" }));
      data.closing.body.forEach(function (t) { cl.appendChild(para(t)); });
      if (data.closing.takeaways) { var ul = el("ul"); data.closing.takeaways.forEach(function (t) { var li = el("li"); li.appendChild(rich(t)); ul.appendChild(li); }); cl.appendChild(ul); }
    }
    cl.appendChild(el("p", { class: "nthview-foot", text: "Keys: Space plays or pauses, ← and → step one tick (Shift: ten), [ and ] jump between events, Home and End go to the start and the end. Your place is saved in this browser." }));
    main.appendChild(cl);
    container.appendChild(dock);
    container.appendChild(scrim); container.appendChild(drawer);

    /* ---- the clock ---- */
    function paintClock() {
      var k = S.tick, sc = curScen();
      timeMain.textContent = fmtTime(k) + (COUNT_UNITS[CLOCK] ? " of " + grp(String(H)) : "");
      timeSub.textContent = sc.label + (clock.label ? " · " + clock.label : "");
      if (+scrub.value !== k) scrub.value = String(k);
      scrub.style.setProperty("--p", (k / H * 100) + "%");
      scrub.setAttribute("aria-valuetext", fmtTime(k) + (clock.label ? " " + clock.label : "") + ", " + sc.label);
      var r = run(), fa = r.firedAny, hasPrev = false, hasNext = false;
      for (var i = 0; i < fa.length; i++) { if (fa[i] < k) hasPrev = true; if (fa[i] > k) { hasNext = true; break; } }
      prevBtn.disabled = !hasPrev; nextBtn.disabled = !hasNext;
      pins.forEach(function (p) { if (p.x.active) paintPin(p); });
    }
    function paintPlay() {
      playBtn.textContent = "";
      playBtn.appendChild(icon(playing ? "pause" : "play"));
      playBtn.setAttribute("aria-label", playing ? "Pause" : "Play");
    }
    function paintScrubEvents() {
      scrubEv.textContent = "";
      var r = run(), seen = {};
      r.active.forEach(function (e) {
        var fr = r.fired[e.id];
        for (var k = 1; k <= H; k++) if (fr[k]) {
          var p = Math.round(k / H * 400);
          if (seen[p]) continue;
          seen[p] = true;
          scrubEv.appendChild(el("i", { style: "left:" + (k / H * 100) + "%;background:" + hue(e.color) }));
        }
      });
    }
    function paintScenario() {
      scenSel.value = String(S.scen);
      scenCardBtns.forEach(function (b, i) { b.setAttribute("aria-pressed", String(i === S.scen)); });
      if (drawer.classList.contains("nthview-open") && drawerTitle.textContent.indexOf("Tune") === 0) drawerTitle.textContent = "Tune: " + curScen().label;
    }
    function refreshAll() {
      paintScenario();
      paintScrubEvents();
      ctlCards = ctlCards.filter(function (c) { return c.root.isConnected; });
      ctlCards.forEach(paintCard);
      if (stage) stage.setRuns(runs, run());
      placeWindow(false);
      drawAll();
      setTick(S.tick, false, true);
    }
    var lastSavedTick = -1, prevTick = S.tick;
    function setTick(k, fromPlay, force) {
      k = Math.max(0, Math.min(H, Math.round(k)));
      if (k === S.tick && !force) return;
      var from = S.tick;
      S.tick = k;
      if (!fromPlay) pos = k;
      if (placeWindow(false)) drawAll();
      paintClock();
      tickAll();
      paintLive();
      if (stage) stage.update(k, from, run());
      prevTick = k;
      if (lastSavedTick !== k) { lastSavedTick = k; queueSave(); }
    }
    function seek(k, center) {
      stopTween();
      if (center) { S.tick = Math.max(0, Math.min(H, Math.round(k))); pos = S.tick; if (placeWindow(true)) drawAll(); setTick(S.tick, false, true); return; }
      setTick(k);
    }
    function setScenario(i) {
      if (i === S.scen) return;
      S.scen = i;
      refreshAll();
      saveNow();
    }
    /* move the clock to a moment by running through the ticks in between, so everything animates */
    var tweening = false, tw = null;
    function stopTween() { tweening = false; tw = null; }
    function tweenTo(k) {
      k = Math.max(0, Math.min(H, Math.round(k)));
      if (playing) play(false);
      var d = Math.abs(k - S.tick);
      if (reduce || d <= 1) { stopTween(); setTick(k); saveNow(); return; }
      tw = { from: S.tick, to: k, t0: 0, dur: Math.max(450, Math.min(1400, 350 + d / H * 2600)) };
      if (!tweening) { tweening = true; root.requestAnimationFrame(tweenFrame); }
    }
    function tweenFrame(now) {
      if (!alive() || !tweening || !tw) { tweening = false; return; }
      if (!tw.t0) tw.t0 = now;
      var u = Math.min(1, (now - tw.t0) / tw.dur), e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
      setTick(tw.from + (tw.to - tw.from) * e);
      if (u < 1) root.requestAnimationFrame(tweenFrame);
      else { tweening = false; tw = null; saveNow(); }
    }
    function frame(now) {
      if (!alive()) return;
      if (!playing) { raf = 0; return; }
      var dt = lastFrame ? Math.min(0.25, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      pos += SPEEDS[S.speed] * dt;
      if (pos >= H) { pos = H; playing = false; }
      var k = Math.floor(pos);
      if (k !== S.tick) setTick(k, true);
      if (playing) raf = root.requestAnimationFrame(frame);
      else { raf = 0; paintPlay(); saveNow(); }
    }
    function play(on) {
      if (on === playing) return;
      stopTween();
      playing = on;
      if (playing) {
        if (S.tick >= H) { pos = 0; setTick(0); }
        pos = S.tick; lastFrame = 0;
        if (!raf) raf = root.requestAnimationFrame(frame);
      } else saveNow();
      paintPlay();
    }
    function jumpEvent(dir) {
      var fa = run().firedAny, k = S.tick;
      if (dir < 0) { for (var i = fa.length - 1; i >= 0; i--) if (fa[i] < k) { seek(fa[i], true); return; } }
      else for (var j = 0; j < fa.length; j++) if (fa[j] > k) { seek(fa[j], true); return; }
    }
    playBtn.addEventListener("click", function () { play(!playing); });
    prevBtn.addEventListener("click", function () { jumpEvent(-1); });
    nextBtn.addEventListener("click", function () { jumpEvent(1); });
    scrub.addEventListener("input", function () { stopTween(); var k = +scrub.value; pos = k; setTick(k); });

    function onKey(e) {
      if (!alive()) { doc.removeEventListener("keydown", onKey); return; }
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      if (drawer.classList.contains("nthview-open")) return;
      var t = e.target, tag = t && t.tagName ? t.tagName.toLowerCase() : "";
      var inForm = tag === "input" || tag === "select" || tag === "textarea" || (t && t.isContentEditable);
      var onButton = tag === "button";
      if (e.key === "Escape") { closePop(); return; }
      if (e.key === " " || e.key === "Spacebar") { if (inForm || onButton) return; e.preventDefault(); play(!playing); return; }
      if (inForm) return;
      if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); stopTween(); var d = (e.key === "ArrowRight" ? 1 : -1) * (e.shiftKey ? 10 : 1); pos = S.tick + d; setTick(S.tick + d); return; }
      if (e.key === "Home") { e.preventDefault(); seek(0, true); return; }
      if (e.key === "End") { e.preventDefault(); seek(H, true); return; }
      if (e.key === "[") { e.preventDefault(); jumpEvent(-1); return; }
      if (e.key === "]") { e.preventDefault(); jumpEvent(1); }
    }
    doc.addEventListener("keydown", onKey);
    function onHide() {
      if (!alive()) { doc.removeEventListener("visibilitychange", onHide); root.removeEventListener("pagehide", onHide); return; }
      if (doc.visibilityState === "hidden" || this === root) { if (playing) play(false); saveNow(); }
    }
    doc.addEventListener("visibilitychange", onHide);
    root.addEventListener("pagehide", onHide);

    /* ---- scroll: chapter, progress, stage mode, steps and pinned clocks ---- */
    var curCh = -2, quiet = resumed, activeStep = null;
    function paintPin(p) {
      var k = S.tick;
      p.bigMain.textContent = fmtTime(k);
      p.bigSub.textContent = curScen().label + (clock.label ? " · " + clock.label : "");
      var m = null;
      p.marks.forEach(function (mk) { if (mk.at <= k) m = mk; });
      if (!m && p.marks.length) m = p.marks[0];
      if (m !== p.lastMark) { p.mark.textContent = ""; if (m) p.mark.appendChild(m.node); p.lastMark = m; }
      var sp = p.s.scrub.to - p.s.scrub.from;
      p.bar.style.width = Math.max(0, Math.min(100, (k - p.s.scrub.from) / sp * 100)) + "%";
    }
    function onScroll() {
      if (!alive()) { root.removeEventListener("scroll", queueScroll); return; }
      scrollQueued = false;
      var vh = root.innerHeight, max = doc.documentElement.scrollHeight - vh, sy = root.scrollY || root.pageYOffset || 0;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, sy / max) : 0) + ")";
      var idx = -1;
      for (var i = 0; i < chEls.length; i++) if (chEls[i].el.getBoundingClientRect().top <= vh * 0.45) idx = i;
      if (idx !== curCh) {
        curCh = idx;
        var x = chEls[idx];
        where.textContent = "";
        if (x) {
          where.appendChild(el("b", { text: (idx + 1 < 10 ? "0" : "") + (idx + 1) + " / " + (chEls.length < 10 ? "0" : "") + chEls.length }));
          where.appendChild(doc.createTextNode("  " + x.s.title));
          if (S.section !== x.s.id) { S.section = x.s.id; queueSave(); }
        }
      }
      /* the end is the closing wrap-up after the last chapter: its top crosses the chapter line or the page bottoms out (§5.5 rule 8) */
      if (!S.done && (cl.getBoundingClientRect().top <= vh * 0.45 || (max > 0 && sy >= max - 2))) { S.done = true; saveNow(); }
      var x2 = chEls[curCh], pinNow = null;
      pins.forEach(function (p) {
        var r = p.x.el.getBoundingClientRect(), topH = top.offsetHeight, hh = p.head.offsetHeight + parseFloat(root.getComputedStyle(p.x.el).paddingTop);
        var on = r.top + hh <= topH + 4 && r.bottom >= vh * 0.6;
        p.x.active = on;
        if (!on) return;
        pinNow = p;
        if (quiet) return;
        var sc = p.s.scrub;
        if (sc.scenario) M.scen.forEach(function (z, zi) { if (z.id === sc.scenario && S.scen !== zi) setScenario(zi); });
        if (sc.window) WINDOWS.forEach(function (w, wi) { if (w.label === sc.window && S.win !== wi) setWindow(wi); });
        var u = Math.max(0, Math.min(1, (topH - r.top - hh) / Math.max(1, r.height - hh - vh + topH)));
        if (playing) play(false);
        stopTween();
        setTick(sc.from + (sc.to - sc.from) * u);
        paintPin(p);
      });
      if (stage) {
        var mode = curCh < 0 ? "hero" : pinNow ? "pin" : "side";
        stage.mode(mode);
        stage.focus(curCh < 0 ? (chEls[0] ? chEls[0].focus : null) : x2 ? x2.focus : null);
      }
    }
    var scrollQueued = false;
    function queueScroll() { if (scrollQueued) return; scrollQueued = true; root.requestAnimationFrame(onScroll); root.setTimeout(function () { if (scrollQueued) onScroll(); }, 140); }
    root.addEventListener("scroll", queueScroll, { passive: true });
    root.addEventListener("resize", function onResize() { if (!alive()) { root.removeEventListener("resize", onResize); return; } queueScroll(); layoutSticky(); });
    function wake() { quiet = false; doc.removeEventListener("wheel", wake); doc.removeEventListener("touchmove", wake); doc.removeEventListener("keydown", wake); doc.removeEventListener("pointerdown", wake); }
    doc.addEventListener("wheel", wake, { passive: true }); doc.addEventListener("touchmove", wake, { passive: true }); doc.addEventListener("keydown", wake); doc.addEventListener("pointerdown", wake);
    if (root.IntersectionObserver) {
      var stepIo = new root.IntersectionObserver(function (entries) {
        if (!alive()) { stepIo.disconnect(); return; }
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          var se = null;
          stepEls.forEach(function (z) { if (z.el === en.target) se = z; });
          if (!se || se === activeStep) return;
          if (activeStep) activeStep.el.classList.remove("nthview-on");
          activeStep = se;
          se.el.classList.add("nthview-on");
          if (stage) stage.focus(se.st.focus || se.x.focus);
          if (quiet) return;
          var st = se.st;
          if (st.scenario) M.scen.forEach(function (z, zi) { if (z.id === st.scenario) setScenario(zi); });
          if (st.window) WINDOWS.forEach(function (w, wi) { if (w.label === st.window) setWindow(wi); });
          tweenTo(st.at);
        });
      }, { rootMargin: root.innerWidth < 900 ? "-62% 0px -24% 0px" : "-42% 0px -48% 0px" });
      stepEls.forEach(function (z) { stepIo.observe(z.el); });
    }
    function layoutSticky() {
      if (!alive()) return;
      container.style.setProperty("--mx-dock", (dock.offsetHeight + 20) + "px");
    }

    /* ---- first paint ---- */
    lastSavedTick = S.tick;
    paintPlay();
    paintScheme();
    refreshAll();
    layoutSticky();
    if (ro) ro.observe(dock);
    queueScroll();

    if (resumed) {
      var target = null;
      chEls.forEach(function (x) { if (x.s.id === S.section) target = x; });
      if (target) root.setTimeout(function () { if (alive()) { target.el.scrollIntoView({ block: "start" }); queueScroll(); } }, 40);
      var note = el("div", { class: "nthview-resume nthview-glass", role: "status" }, [el("span", { text: "Welcome back, continuing" + (target ? " from “" + target.s.title + "”" : "") + " at " + fmtTime(S.tick) + ", " + curScen().label + "." })]);
      container.appendChild(note);
      var hide = function () {
        note.classList.add("nthview-gone");
        root.setTimeout(function () { if (note.parentNode) note.parentNode.removeChild(note); }, 400);
        doc.removeEventListener("pointerdown", hide); doc.removeEventListener("keydown", hide);
      };
      root.setTimeout(hide, 6000);
      root.setTimeout(function () { doc.addEventListener("pointerdown", hide); doc.addEventListener("keydown", hide); }, 400);
    }
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-mechanism");
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
    { kind: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", global: "THREE", name: "three.js r128" }
  ];

  NthView.THEMES = THEMES;
})(typeof globalThis !== "undefined" ? globalThis : window);
