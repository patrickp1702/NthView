/* NthView — sequence renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first. No libraries: plain DOM, CSS and inline SVG.
 * A document is a tree: any step may carry an inner sequence, rendered as its own level.
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";

  var THEMES = ["paper", "slate", "blueprint", "mint"];

  /* Surfaces per theme, by role: page, panel, soft fill, highlight, borders, text, accent, the wire
     pane (a dark terminal in every theme) and the display face. Light and dark are designed
     separately, not inverted. Flat colours only. */
  var PALETTES = {
    paper: {
      light: "--nv-bg:#f6f1e7;--nv-fg:#1f1a14;--nv-muted:#5e5447;--nv-accent:#9a3f12;--nv-border:#ddd2bf;--nv-error:#b91c1c;--sq-panel:#fffdf8;--sq-soft:#f4ede1;--sq-hi:#f7e4d4;--sq-line:#ebe3d4;--sq-on-accent:#fff;--sq-zone-a:#efe6d6;--sq-zone-b:#f3ece0;--sq-bar:rgba(246,241,231,.9);--sq-term:#2b241c;--sq-term-head:#372e24;--sq-term-fg:#f4ebdb;--sq-term-muted:#bfb09a;--sq-term-key:#f5b98f;--sq-term-note:#9fd3b8;--sq-head:Georgia,'Iowan Old Style','Times New Roman',serif;--sq-head-ls:-.005em",
      dark: "--nv-bg:#16130f;--nv-fg:#f3ece0;--nv-muted:#bdb09c;--nv-accent:#f2a474;--nv-border:#3c352c;--nv-error:#f87171;--sq-panel:#201c16;--sq-soft:#29241d;--sq-hi:#3b2b1f;--sq-line:#2f2a22;--sq-on-accent:#1a1510;--sq-zone-a:#29231b;--sq-zone-b:#2e281f;--sq-bar:rgba(22,19,15,.88);--sq-term:#100d0a;--sq-term-head:#1b1712;--sq-term-fg:#efe6d6;--sq-term-muted:#ac9e88;--sq-term-key:#f5b98f;--sq-term-note:#9fd3b8"
    },
    slate: {
      light: "--nv-bg:#eef1f5;--nv-fg:#0f141a;--nv-muted:#525c69;--nv-accent:#4338ca;--nv-border:#d6dce4;--nv-error:#b91c1c;--sq-panel:#ffffff;--sq-soft:#f4f6f9;--sq-hi:#e8e9fb;--sq-line:#e5e9ef;--sq-on-accent:#fff;--sq-zone-a:#e8ecf1;--sq-zone-b:#f0f3f7;--sq-bar:rgba(238,241,245,.88);--sq-term:#101623;--sq-term-head:#192233;--sq-term-fg:#e6edf6;--sq-term-muted:#9aa8bb;--sq-term-key:#a9b6fd;--sq-term-note:#86e0b4;--sq-head:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--sq-head-ls:-.02em",
      dark: "--nv-bg:#0d1117;--nv-fg:#e8edf3;--nv-muted:#a3aebc;--nv-accent:#a9b6fd;--nv-border:#2c3440;--nv-error:#f87171;--sq-panel:#161b22;--sq-soft:#1c222b;--sq-hi:#252a4d;--sq-line:#222933;--sq-on-accent:#0d1117;--sq-zone-a:#1b222c;--sq-zone-b:#202833;--sq-bar:rgba(13,17,23,.86);--sq-term:#080b10;--sq-term-head:#10151c;--sq-term-fg:#e6edf3;--sq-term-muted:#8f9cad;--sq-term-key:#a9b6fd;--sq-term-note:#86e0b4"
    },
    blueprint: {
      light: "--nv-bg:#e8eff9;--nv-fg:#0b1c33;--nv-muted:#3d5474;--nv-accent:#1456ad;--nv-border:#c6d6ec;--nv-error:#b91c1c;--sq-panel:#fbfdff;--sq-soft:#edf3fb;--sq-hi:#d9e6f9;--sq-line:#dbe5f3;--sq-on-accent:#fff;--sq-zone-a:#e0eaf7;--sq-zone-b:#e9f0fa;--sq-bar:rgba(232,239,249,.88);--sq-term:#0b1f3a;--sq-term-head:#122b4e;--sq-term-fg:#e3eeff;--sq-term-muted:#9ab0d2;--sq-term-key:#8fd0ff;--sq-term-note:#9be3c0;--sq-head:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;--sq-head-ls:-.01em;--sq-grid:rgba(20,86,173,.07)",
      dark: "--nv-bg:#0a1a31;--nv-fg:#e6f0ff;--nv-muted:#a7bedc;--nv-accent:#7cc4ff;--nv-border:#29496f;--nv-error:#fca5a5;--sq-panel:#0f2444;--sq-soft:#13294b;--sq-hi:#1b3b66;--sq-line:#1b3557;--sq-on-accent:#0a1a31;--sq-zone-a:#143057;--sq-zone-b:#183560;--sq-bar:rgba(10,26,49,.86);--sq-term:#06132a;--sq-term-head:#0c1d39;--sq-term-fg:#e3eeff;--sq-term-muted:#90a8cb;--sq-term-key:#8fd0ff;--sq-term-note:#9be3c0;--sq-grid:rgba(124,196,255,.06)"
    },
    mint: {
      light: "--nv-bg:#eaf5ef;--nv-fg:#0d2a21;--nv-muted:#42625a;--nv-accent:#0a7154;--nv-border:#cbe0d5;--nv-error:#b91c1c;--sq-panel:#fbfefc;--sq-soft:#eff8f3;--sq-hi:#d6efe4;--sq-line:#dcece3;--sq-on-accent:#fff;--sq-zone-a:#dfefe7;--sq-zone-b:#e8f4ee;--sq-bar:rgba(234,245,239,.88);--sq-term:#0e251e;--sq-term-head:#15332a;--sq-term-fg:#e1f5ec;--sq-term-muted:#97beaf;--sq-term-key:#83e4c3;--sq-term-note:#f3cf86;--sq-head:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;--sq-head-ls:-.02em",
      dark: "--nv-bg:#0b1713;--nv-fg:#e2f3eb;--nv-muted:#9fc0b2;--nv-accent:#62d6b0;--nv-border:#284039;--nv-error:#f87171;--sq-panel:#12221c;--sq-soft:#172a23;--sq-hi:#1c3a2f;--sq-line:#1d322a;--sq-on-accent:#0b1713;--sq-zone-a:#182d25;--sq-zone-b:#1c332a;--sq-bar:rgba(11,23,19,.86);--sq-term:#07110d;--sq-term-head:#0d1b16;--sq-term-fg:#e1f5ec;--sq-term-muted:#8fb5a6;--sq-term-key:#83e4c3;--sq-term-note:#f3cf86"
    }
  };
  /* Channel and severity hues, shared by every theme: strong ink and a tint behind it. */
  var HUES_LIGHT = "--h-slate:#4a5563;--t-slate:#e6e9ee;--h-amber:#8f4c06;--t-amber:#fbecd6;--h-green:#136840;--t-green:#dcf0e4;--h-blue:#1d4fb8;--t-blue:#e2e9fb;--h-red:#b42323;--t-red:#fbe3e3;--h-teal:#0d6469;--t-teal:#d8eeee;--h-violet:#6140b5;--t-violet:#ece6fa;--h-pink:#a12e69;--t-pink:#f8e2ed";
  var HUES_DARK = "--h-slate:#aeb8c4;--t-slate:#272d35;--h-amber:#f0b061;--t-amber:#38291a;--h-green:#72d09d;--t-green:#15301f;--h-blue:#97b7ff;--t-blue:#1b2846;--h-red:#ff9b9b;--t-red:#3b1c1d;--h-teal:#72d4d7;--t-teal:#12302f;--h-violet:#c0abff;--t-violet:#281f45;--h-pink:#f6a3cd;--t-pink:#38192b";
  /* Party identity: an ink (avatar glyph, lifeline, ring) and a tint (avatar disc, holds card) per hue.
     Inks are at least 3:1 against the panel and against their own tint (WCAG 1.4.11). */
  var IDENT_LIGHT = "--p0:#2459d6;--q0:#dfe8fd;--p1:#c2410c;--q1:#fde6d6;--p2:#0f766e;--q2:#d3f0eb;--p3:#be185d;--q3:#fbdeeb;--p4:#4d7c0f;--q4:#e4f0d0;--p5:#7c3aed;--q5:#ece3fd;--p6:#0369a1;--q6:#d7ecf8;--p7:#a16207;--q7:#f6ebc8";
  var IDENT_DARK = "--p0:#86adff;--q0:#1c2a4b;--p1:#ff9e6b;--q1:#3a2316;--p2:#4fd1c0;--q2:#11332f;--p3:#f483b5;--q3:#3a1828;--p4:#a8d862;--q4:#22310f;--p5:#b9a0ff;--q5:#2a2148;--p6:#5fc4f5;--q6:#112d3e;--p7:#f0c24a;--q7:#352a0e";
  /* One shadow system: raised controls, cards, overlays */
  var SHADOW_LIGHT = "--sq-sh1:0 1px 2px rgba(16,24,40,.06),0 1px 1px rgba(16,24,40,.04);--sq-sh2:0 1px 2px rgba(16,24,40,.05),0 8px 24px -12px rgba(16,24,40,.18);--sq-sh3:0 18px 40px -12px rgba(16,24,40,.32),0 2px 6px rgba(16,24,40,.08)";
  var SHADOW_DARK = "--sq-sh1:0 1px 2px rgba(0,0,0,.4);--sq-sh2:0 1px 2px rgba(0,0,0,.35),0 10px 28px -14px rgba(0,0,0,.7);--sq-sh3:0 20px 44px -12px rgba(0,0,0,.75),0 2px 6px rgba(0,0,0,.4)";
  var NIDENT = 8;

  function themeCss() {
    var out = [];
    THEMES.forEach(function (t) {
      var p = PALETTES[t];
      out.push(".nthview-sequence[data-theme=" + t + "]{" + p.light + ";" + HUES_LIGHT + ";" + IDENT_LIGHT + ";" + SHADOW_LIGHT + "}");
      out.push("@media (prefers-color-scheme:dark){.nthview-sequence[data-theme=" + t + "]{" + p.dark + ";" + HUES_DARK + ";" + IDENT_DARK + ";" + SHADOW_DARK + "}}");
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
    "body:has(> .nthview-sequence){margin:0}",
    /* tokens: 8-point spacing, three radii, one easing, durations of 150/250/400 ms */
    ".nthview-sequence{--sq-mono:ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace;--sq-r1:6px;--sq-r2:10px;--sq-r3:16px;--sq-ease:cubic-bezier(.2,0,0,1);--sq-ease-in:cubic-bezier(.05,.7,.1,1);--sq-fast:150ms;--sq-mid:250ms;--sq-slow:400ms;--sq-lane-min:7.5rem;--sq-bar-h:0px;position:relative;max-width:none;min-height:100vh;padding:1.5rem 1rem 6rem;font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}",
    ".nthview-sequence>*:not(.nthview-scrim):not(.nthview-drawer):not(.nthview-pop):not(.nthview-bar){max-width:68rem;margin-left:auto;margin-right:auto}",
    ".nthview-sequence button{font:inherit;color:inherit}",
    ".nthview-sequence [tabindex='-1']:focus{outline:none}",
    ".nthview-sequence [hidden]{display:none!important}",
    ".nthview-sequence code{font-family:var(--sq-mono);font-size:.875em;background:var(--sq-soft);border:1px solid var(--sq-line);padding:.05em .35em;border-radius:var(--sq-r1);overflow-wrap:anywhere}",
    ".nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".nthview-narrow{display:none}",
    /* buttons: one family */
    ".nthview-tbtn,.nthview-restart,.nthview-nav,.nthview-ghost{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;min-height:40px;border:1px solid var(--nv-border);background:var(--sq-panel);padding:.5rem 1rem;border-radius:var(--sq-r2);cursor:pointer;font-size:.875rem;font-weight:550;white-space:nowrap;box-shadow:var(--sq-sh1);transition:border-color var(--sq-fast) var(--sq-ease),background var(--sq-fast) var(--sq-ease),transform var(--sq-fast) var(--sq-ease)}",
    ".nthview-tbtn:hover,.nthview-restart:hover,.nthview-nav:hover,.nthview-ghost:hover{border-color:var(--nv-muted)}",
    ".nthview-nav:active,.nthview-tbtn:active,.nthview-ghost:active{transform:translateY(1px)}",
    ".nthview-nav{font-size:.9375rem;padding:.5rem 1.125rem}",
    ".nthview-nav:disabled{opacity:.45;cursor:default;box-shadow:none}",
    ".nthview-nav.nthview-primary{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--sq-on-accent);font-weight:650}",
    ".nthview-nav.nthview-primary:hover{border-color:var(--nv-fg)}",
    ".nthview-ghost{background:transparent;box-shadow:none;color:var(--nv-muted)}",
    ".nthview-i{width:16px;height:16px;flex:none}",
    /* header: the page title, then the sticky bar */
    ".nthview-head{margin-bottom:1.5rem}",
    ".nthview-eyebrow{display:flex;flex-wrap:wrap;gap:.25rem .5rem;margin:0 0 .5rem;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--nv-muted);font-weight:650}",
    ".nthview-eyebrow span+span::before{content:'·';margin-right:.5rem}",
    ".nthview-title{font-family:var(--sq-head);font-size:2rem;line-height:1.15;margin:0 0 .5rem;letter-spacing:var(--sq-head-ls);font-weight:700;max-width:44rem}",
    ".nthview-sub{margin:0;color:var(--nv-muted);max-width:70ch;font-size:1.0625rem}",
    ".nthview-bar{position:sticky;top:0;z-index:20;margin:0 -1rem 1.5rem;padding:.5rem 1rem;background:var(--sq-bar);-webkit-backdrop-filter:saturate(1.4) blur(12px);backdrop-filter:saturate(1.4) blur(12px);border-bottom:1px solid var(--nv-border)}",
    ".nthview-bar-in{max-width:68rem;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem}",
    ".nthview-seg{display:inline-flex;border:1px solid var(--nv-border);border-radius:var(--sq-r2);background:var(--sq-soft);padding:3px;gap:2px}",
    ".nthview-seg button{border:0;background:transparent;min-height:34px;padding:.25rem .875rem;border-radius:7px;cursor:pointer;font-size:.875rem;font-weight:550;color:var(--nv-muted);white-space:nowrap;transition:background var(--sq-fast) var(--sq-ease),color var(--sq-fast) var(--sq-ease)}",
    ".nthview-seg button:hover{color:var(--nv-fg)}",
    ".nthview-seg button[aria-pressed=true]{background:var(--sq-panel);color:var(--nv-fg);font-weight:650;box-shadow:var(--sq-sh1)}",
    ".nthview-meter{flex:1 1 14rem;min-width:0;display:flex;align-items:center;gap:.75rem}",
    ".nthview-progress{flex:1;height:6px;background:var(--sq-line);border-radius:99px;overflow:hidden;min-width:4rem}",
    ".nthview-progress span{display:block;height:100%;background:var(--nv-accent);border-radius:99px;transition:width var(--sq-slow) var(--sq-ease)}",
    ".nthview-meter-t{font-size:.8125rem;color:var(--nv-muted);white-space:nowrap;font-variant-numeric:tabular-nums}",
    ".nthview-meter-t b{color:var(--nv-fg);font-weight:650}",
    ".nthview-bar .nthview-tbtn,.nthview-bar .nthview-restart{min-height:36px;padding:.25rem .75rem}",
    /* resume notice */
    ".nthview-resume{display:flex;align-items:center;gap:.5rem;margin:0 0 1rem;padding:.625rem 1rem;border-radius:var(--sq-r2);background:var(--sq-hi);border:1px solid var(--nv-border);font-size:.9375rem;box-shadow:var(--sq-sh1);transition:opacity var(--sq-slow) var(--sq-ease)}",
    ".nthview-resume::before{content:'';width:8px;height:8px;border-radius:50%;background:var(--nv-accent);flex:none}",
    ".nthview-resume.nthview-resume-hide{opacity:0}",
    /* avatars: the party's colour identity (--pc ink, --pq tint) */
    ".nthview-ava{--ava:44px;position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none;width:var(--ava);height:var(--ava);border-radius:50%;background:var(--pq,var(--sq-soft));color:var(--pc,var(--nv-muted));box-shadow:inset 0 0 0 1.5px var(--pc,var(--nv-border));transition:box-shadow var(--sq-mid) var(--sq-ease),transform var(--sq-mid) var(--sq-ease),opacity var(--sq-mid) var(--sq-ease),filter var(--sq-mid) var(--sq-ease)}",
    ".nthview-ava svg{width:56%;height:56%}",
    ".nthview-ava.nthview-ava-sm{--ava:22px;box-shadow:inset 0 0 0 1.25px var(--pc,var(--nv-border))}",
    ".nthview-ava.nthview-ava-md{--ava:30px}",
    ".nthview-ava.nthview-ava-grp{border-radius:30%}",
    ".nthview-stack{display:inline-flex;align-items:center}",
    ".nthview-stack .nthview-ava{--ava:20px;margin-left:-6px;border:2px solid var(--sq-panel);box-shadow:none}",
    ".nthview-stack .nthview-ava:first-child{margin-left:0}",
    ".nthview-stack .nthview-more{margin-left:.25rem;font-size:.75rem;font-weight:650;color:var(--nv-muted)}",
    /* stage: zones, lanes with avatars, lifelines, the flight */
    ".nthview-stage{position:relative;background:var(--sq-panel);border:1px solid var(--nv-border);border-radius:var(--sq-r3);overflow:hidden;box-shadow:var(--sq-sh2)}",
    ".nthview-sequence[data-theme=blueprint] .nthview-stage,.nthview-sequence[data-theme=blueprint] .nthview-dpanel{background-image:linear-gradient(var(--sq-grid) 1px,transparent 1px),linear-gradient(90deg,var(--sq-grid) 1px,transparent 1px);background-size:24px 24px}",
    ".nthview-stage-scroll{overflow-x:auto;overflow-y:hidden;overscroll-behavior-x:contain;-webkit-overflow-scrolling:touch;scrollbar-width:thin}",
    ".nthview-sequence .nthview-stage-scroll:focus-visible{outline-offset:-3px}",
    ".nthview-stage-in{position:relative;padding:1rem .75rem 0;min-width:calc(var(--sq-lanes,4) * var(--sq-lane-min) + 1.5rem)}",
    ".nthview-stage-more{margin:0;padding:.375rem .75rem;border-top:1px dashed var(--nv-border);font-size:.8125rem;color:var(--nv-muted);text-align:center}",
    ".nthview-zonebg{position:absolute;inset:0;display:grid;pointer-events:none;padding:0 .75rem}",
    ".nthview-zoneband{margin:0 3px;border-radius:var(--sq-r2) var(--sq-r2) 0 0}",
    ".nthview-zoneband.nthview-za{background:var(--sq-zone-a)}",
    ".nthview-zoneband.nthview-zb{background:var(--sq-zone-b)}",
    ".nthview-zonerow,.nthview-lanes,.nthview-rails{position:relative;display:grid;gap:0}",
    ".nthview-zonerow{align-items:end}",
    ".nthview-zonelabel{font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--nv-muted);text-align:center;padding:0 .375rem .5rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:650}",
    ".nthview-lane{position:relative;display:flex;flex-direction:column;align-items:center;margin:0 .25rem;text-align:center;padding:.25rem .25rem .5rem;min-width:0;transition:color var(--sq-mid) var(--sq-ease)}",
    ".nthview-lane .nthview-lane-ava{margin-bottom:.625rem}",
    ".nthview-lane b{display:block;max-width:100%;font-size:.875rem;font-weight:650;line-height:1.25;overflow:hidden;overflow-wrap:break-word;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;transition:color var(--sq-mid) var(--sq-ease)}",
    ".nthview-lane small{display:block;max-width:100%;font-size:.75rem;color:var(--nv-muted);line-height:1.3;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;margin-top:.125rem}",
    ".nthview-lane-tag{position:absolute;bottom:-.5rem;left:50%;transform:translateX(-50%);font-size:.6875rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;padding:0 .4rem;border-radius:99px;background:var(--sq-panel);color:var(--nv-fg);border:1px solid var(--nv-border);line-height:1.5;white-space:nowrap;opacity:0;transition:opacity var(--sq-mid) var(--sq-ease)}",
    ".nthview-lane.nthview-on .nthview-lane-tag{opacity:1}",
    ".nthview-lane.nthview-on .nthview-lane-ava{box-shadow:inset 0 0 0 1.5px var(--pc),0 0 0 3px var(--sq-panel),0 0 0 5.5px var(--pc);transform:scale(1.06)}",
    ".nthview-stage.nthview-live .nthview-lane:not(.nthview-on) .nthview-lane-ava,.nthview-stage.nthview-live .nthview-lane:not(.nthview-on) .nthview-stack{opacity:.45;filter:saturate(.4)}",
    ".nthview-stage.nthview-live .nthview-lane:not(.nthview-on) b{color:var(--nv-muted);font-weight:550}",
    ".nthview-lane.nthview-arrive .nthview-lane-ava{animation:nthview-arrive 320ms var(--sq-ease)}",
    "@keyframes nthview-arrive{0%{transform:scale(1.06)}45%{transform:scale(1.14)}100%{transform:scale(1.06)}}",
    ".nthview-lane .nthview-stack{margin-top:.25rem}",
    ".nthview-lane .nthview-inside{display:inline-block;margin-top:.25rem;font-size:.6875rem;font-weight:650;color:var(--nv-muted);line-height:1.4}",
    ".nthview-grouprow{position:relative;display:grid;align-items:end}",
    ".nthview-grouplabel{margin:0 .375rem .375rem;font-size:.6875rem;font-weight:700;color:var(--nv-fg);text-align:center;border:1px dashed var(--nv-muted);border-bottom:0;border-radius:var(--sq-r2) var(--sq-r2) 0 0;padding:.125rem .375rem .25rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-track{position:relative;height:92px}",
    ".nthview-rails{position:absolute;inset:0}",
    ".nthview-rail{position:relative}",
    ".nthview-rail::before{content:'';position:absolute;left:50%;top:0;bottom:0;border-left:2px dotted var(--pc,var(--nv-border));opacity:.55;transition:opacity var(--sq-mid) var(--sq-ease)}",
    ".nthview-stage.nthview-live .nthview-rail:not(.nthview-on)::before{opacity:.25}",
    ".nthview-flight{position:absolute;top:58px;height:0;border-top:3px solid currentColor;border-radius:2px;transition:left var(--sq-slow) var(--sq-ease),width var(--sq-slow) var(--sq-ease)}",
    ".nthview-flight.nthview-k-return{border-top-style:dashed}",
    ".nthview-head-tip{position:absolute;top:-9.5px;width:16px;height:16px}",
    ".nthview-fwd .nthview-head-tip{right:-4px}",
    ".nthview-rev .nthview-head-tip{left:-4px;transform:scaleX(-1)}",
    ".nthview-packet{position:absolute;top:52.5px;width:14px;height:14px;margin-left:-7px;border-radius:50%;background:currentColor;box-shadow:0 0 0 3px var(--sq-panel),0 0 0 6px var(--sq-hi);transition:left var(--sq-slow) var(--sq-ease),opacity var(--sq-fast) var(--sq-ease);opacity:0;pointer-events:none}",
    ".nthview-packet.nthview-go{opacity:1}",
    ".nthview-loop{position:absolute;top:38px;width:40px;height:32px;border:3px solid currentColor;border-left:0;border-radius:0 16px 16px 0}",
    ".nthview-loop .nthview-head-tip{left:-8px;bottom:-9.5px;top:auto;transform:scaleX(-1)}",
    ".nthview-payload{position:absolute;top:14px;display:inline-flex;align-items:center;gap:.375rem;font-family:var(--sq-mono);font-size:.8125rem;font-weight:600;white-space:nowrap;max-width:96%;overflow:hidden;text-overflow:ellipsis;padding:.1875rem .625rem .1875rem .25rem;border-radius:99px;background:var(--sq-panel);border:1.5px solid currentColor;box-shadow:var(--sq-sh1);line-height:1.4}",
    ".nthview-payload b{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 .3rem;border-radius:99px;background:currentColor;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:.6875rem;font-weight:750}",
    ".nthview-payload b span{color:var(--sq-panel)}",
    ".nthview-payload>span{color:var(--nv-fg);overflow:hidden;text-overflow:ellipsis}",
    ".nthview-payload.nthview-in{animation:nthview-fade-in var(--sq-mid) var(--sq-ease) 120ms both}",
    ".nthview-waiting{position:absolute;left:0;right:0;top:0;height:92px;display:flex;align-items:center;justify-content:center;padding:0 1rem;text-align:center;font-size:.875rem;color:var(--nv-muted);pointer-events:none}",
    ".nthview-waiting span{background:var(--sq-panel);padding:.25rem .75rem;border-radius:99px;border:1px dashed var(--nv-border)}",
    /* stage footer: the legend of channels and arrow kinds, the current ones emphasised */
    ".nthview-sfoot{display:flex;flex-wrap:wrap;align-items:center;gap:.375rem 1.25rem;padding:.625rem 1rem;border-top:1px solid var(--sq-line);background:var(--sq-soft);font-size:.8125rem;color:var(--nv-muted)}",
    ".nthview-legend{display:flex;flex-wrap:wrap;gap:.25rem .875rem;margin:0;padding:0;list-style:none}",
    ".nthview-legend li{display:flex;align-items:center;gap:.375rem;transition:color var(--sq-fast) var(--sq-ease)}",
    ".nthview-legend i{display:inline-block;width:18px;border-top:3px solid currentColor;border-radius:2px}",
    ".nthview-legend li.nthview-cur{color:var(--nv-fg);font-weight:650}",
    ".nthview-legend li span{color:inherit}",
    ".nthview-kindleg svg{width:28px;height:10px}",
    ".nthview-sfoot .nthview-sep{width:1px;align-self:stretch;background:var(--nv-border)}",
    /* controls and chip rail */
    ".nthview-controls{display:flex;align-items:center;gap:.75rem;margin:1rem 0}",
    ".nthview-chips{display:flex;flex-wrap:wrap;gap:6px;flex:1;justify-content:center}",
    ".nthview-chip{position:relative;min-width:32px;height:32px;padding:0 .375rem;font-size:.8125rem;font-weight:600;font-variant-numeric:tabular-nums;border:1px solid var(--nv-border);background:var(--sq-panel);color:var(--nv-muted);border-radius:99px;cursor:pointer;transition:background var(--sq-fast) var(--sq-ease),border-color var(--sq-fast) var(--sq-ease),color var(--sq-fast) var(--sq-ease),transform var(--sq-fast) var(--sq-ease)}",
    ".nthview-chip:hover{border-color:var(--nv-accent);color:var(--nv-fg)}",
    ".nthview-chip.nthview-seen{background:var(--sq-hi);border-color:transparent;color:var(--nv-fg)}",
    ".nthview-chip[aria-current=step]{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--sq-on-accent);transform:scale(1.08);box-shadow:var(--sq-sh1)}",
    ".nthview-chip.nthview-alt-chip{border-style:dashed;border-color:var(--h-violet)}",
    ".nthview-chip.nthview-has-check::after{content:'';position:absolute;top:-2px;right:-2px;width:9px;height:9px;border-radius:50%;background:var(--h-amber);border:2px solid var(--sq-panel)}",
    ".nthview-chip.nthview-check-done::after{background:var(--h-green)}",
    ".nthview-chip.nthview-has-inner::before{content:'';position:absolute;left:50%;bottom:3px;width:12px;margin-left:-6px;border-top:2px solid currentColor;border-radius:2px;opacity:.75}",
    ".nthview-chip.nthview-chip-group{border:1.5px dashed var(--h-teal);color:var(--h-teal);padding:0 .625rem;font-weight:700}",
    ".nthview-chip.nthview-chip-group.nthview-seen{background:var(--t-teal);border-style:solid}",
    ".nthview-chip.nthview-chip-group[aria-current=step]{background:var(--h-teal);border-color:var(--h-teal);color:var(--sq-panel)}",
    /* cards */
    ".nthview-card,.nthview-check,.nthview-recap,.nthview-gcard{position:relative;background:var(--sq-panel);border:1px solid var(--nv-border);border-radius:var(--sq-r3);padding:1.5rem;box-shadow:var(--sq-sh2)}",
    ".nthview-card.nthview-fade,.nthview-gcard.nthview-fade{animation:nthview-fade-in var(--sq-slow) var(--sq-ease) both}",
    "@keyframes nthview-fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".nthview-cardhead{display:flex;align-items:flex-start;gap:1rem;margin-bottom:.75rem}",
    ".nthview-stepno{flex:none;display:inline-flex;align-items:center;justify-content:center;min-width:2.5rem;height:2.5rem;padding:0 .5rem;border-radius:99px;font-weight:750;font-size:1rem;font-variant-numeric:tabular-nums;background:var(--sq-soft);color:var(--nv-fg);border:2px solid currentColor;line-height:1}",
    ".nthview-stepno span{color:var(--nv-fg)}",
    ".nthview-cardhead-t{flex:1;min-width:0}",
    ".nthview-idx{display:block;font-size:.75rem;font-weight:650;letter-spacing:.06em;text-transform:uppercase;color:var(--nv-muted);margin:0 0 .125rem}",
    ".nthview-card h2,.nthview-check h2,.nthview-recap h2,.nthview-gcard h2{font-family:var(--sq-head);font-size:1.375rem;line-height:1.3;margin:0;font-weight:700;letter-spacing:var(--sq-head-ls)}",
    ".nthview-meta{display:flex;align-items:center;flex-wrap:wrap;gap:.5rem;margin:0 0 1rem}",
    ".nthview-badge{display:inline-flex;align-items:center;gap:.375rem;font-size:.75rem;padding:.125rem .625rem;border-radius:99px;font-weight:650;background:var(--t-slate);color:var(--h-slate);line-height:1.6}",
    ".nthview-badge i{width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block}",
    ".nthview-badge.nthview-plain{background:transparent;border:1px solid var(--nv-border);color:var(--nv-muted);font-weight:550}",
    ".nthview-badge svg{width:22px;height:8px}",
    ".nthview-route{display:flex;flex-wrap:wrap;align-items:center;gap:.375rem .5rem;font-size:.9375rem;color:var(--nv-muted);margin:0 0 .75rem}",
    ".nthview-route b{display:inline-flex;align-items:center;gap:.375rem;color:var(--nv-fg);font-weight:650}",
    ".nthview-route .nthview-arr{font-weight:700;color:var(--nv-fg)}",
    ".nthview-route code{font-size:.8125rem}",
    ".nthview-frag{display:flex;flex-wrap:wrap;gap:.375rem .625rem;align-items:center;font-size:.8125rem;color:var(--nv-muted);margin:0 0 .5rem}",
    ".nthview-frag b{font-family:var(--sq-mono);font-size:.75rem;border-radius:var(--sq-r1);padding:0 .4rem;background:var(--t-violet);color:var(--h-violet)}",
    ".nthview-frag.nthview-fk-loop b{background:var(--t-teal);color:var(--h-teal)}",
    ".nthview-frag.nthview-fk-opt b{background:var(--t-blue);color:var(--h-blue)}",
    ".nthview-altnote{border:1px dashed var(--h-violet);background:var(--t-violet);color:var(--nv-fg);border-radius:var(--sq-r2);padding:.625rem 1rem;margin:0 0 1rem;font-size:.9375rem}",
    /* the wire: a real request pane */
    ".nthview-wirebox{margin:0 0 1rem;border-radius:var(--sq-r2);overflow:hidden;background:var(--sq-term);color:var(--sq-term-fg);box-shadow:var(--sq-sh1);border:1px solid var(--sq-term-head)}",
    ".nthview-wirehead{display:flex;align-items:center;gap:.5rem;padding:.375rem .875rem;background:var(--sq-term-head);font-size:.75rem;color:var(--sq-term-muted);letter-spacing:.02em}",
    ".nthview-wirehead i{width:8px;height:8px;border-radius:50%;flex:none}",
    ".nthview-wirehead b{color:var(--sq-term-fg);font-weight:650}",
    ".nthview-wirehead span:last-child{margin-left:auto}",
    ".nthview-wire{font-family:var(--sq-mono);font-size:.8125rem;line-height:1.7;margin:0;padding:.875rem 1rem 1rem;white-space:pre-wrap;overflow-wrap:anywhere;tab-size:2;color:var(--sq-term-fg)}",
    ".nthview-wire code{background:none;border:0;padding:0;font-size:1em;color:inherit;border-radius:0}",
    ".nthview-wire .nthview-w-k{color:var(--sq-term-key)}",
    ".nthview-wire .nthview-w-c{color:var(--sq-term-muted)}",
    ".nthview-wire .nthview-w-n{color:var(--sq-term-note)}",
    ".nthview-wire .nthview-w-v{font-weight:700}",
    ".nthview-why{margin:0;max-width:70ch;font-size:1.0625rem;line-height:1.65}",
    ".nthview-callout{display:flex;gap:.75rem;margin-top:1rem;padding:.875rem 1rem;border-radius:var(--sq-r2);font-size:.9375rem;color:var(--nv-fg)}",
    ".nthview-callout svg{flex:none;width:20px;height:20px;margin-top:.125rem}",
    ".nthview-callout h3{margin:0 0 .125rem;font-size:.8125rem;font-weight:750;letter-spacing:.02em}",
    ".nthview-callout p{margin:0}",
    ".nthview-compare{background:var(--t-amber);border:1px solid var(--t-amber);box-shadow:inset 3px 0 0 var(--h-amber)}",
    ".nthview-compare svg,.nthview-compare h3{color:var(--h-amber)}",
    ".nthview-note{background:var(--t-blue);box-shadow:inset 3px 0 0 var(--h-blue)}",
    ".nthview-note svg,.nthview-note h3{color:var(--h-blue)}",
    ".nthview-note.nthview-sev-warning{background:var(--t-amber);box-shadow:inset 3px 0 0 var(--h-amber)}",
    ".nthview-note.nthview-sev-warning svg,.nthview-note.nthview-sev-warning h3{color:var(--h-amber)}",
    ".nthview-note.nthview-sev-danger{background:var(--t-red);box-shadow:inset 3px 0 0 var(--h-red)}",
    ".nthview-note.nthview-sev-danger svg,.nthview-note.nthview-sev-danger h3{color:var(--h-red)}",
    ".nthview-sevb-info{background:var(--t-blue);color:var(--h-blue)}",
    ".nthview-sevb-warning{background:var(--t-amber);color:var(--h-amber)}",
    ".nthview-sevb-danger{background:var(--t-red);color:var(--h-red)}",
    ".nthview-details{margin-top:1rem;border:1px solid var(--nv-border);border-radius:var(--sq-r2);background:var(--sq-panel)}",
    ".nthview-details summary{min-height:44px;padding:.625rem 1rem;cursor:pointer;font-size:.9375rem;font-weight:650;list-style:none;display:flex;align-items:center;gap:.625rem;border-radius:var(--sq-r2)}",
    ".nthview-details summary:hover{background:var(--sq-soft)}",
    ".nthview-details summary::-webkit-details-marker{display:none}",
    ".nthview-details summary::before{content:'';width:7px;height:7px;border-right:2px solid var(--nv-muted);border-bottom:2px solid var(--nv-muted);transform:rotate(-45deg);transition:transform var(--sq-mid) var(--sq-ease);margin:0 .125rem}",
    ".nthview-details[open] summary::before{transform:rotate(45deg)}",
    ".nthview-details summary small{margin-left:auto;font-weight:500;color:var(--nv-muted);font-size:.8125rem}",
    ".nthview-drows{margin:0;padding:.25rem 1rem .75rem;border-top:1px solid var(--sq-line)}",
    ".nthview-drow{display:grid;grid-template-columns:10rem 1fr;gap:1rem;padding:.625rem 0;border-bottom:1px solid var(--sq-line)}",
    ".nthview-drow:last-child{border-bottom:0}",
    ".nthview-drow dt{font-size:.8125rem;font-weight:650;color:var(--nv-muted);padding-top:.125rem}",
    ".nthview-drow dd{margin:0;font-size:.9375rem}",
    /* inner sequence entry: "there is more here" */
    ".nthview-innerbox{margin-top:1rem;padding:1rem;border:1px solid var(--nv-border);border-radius:var(--sq-r2);background:var(--sq-hi);display:flex;flex-wrap:wrap;gap:.75rem 1rem;align-items:center}",
    ".nthview-innerbox .nthview-layers{flex:none;width:40px;height:40px;color:var(--nv-accent)}",
    ".nthview-innerbox div{flex:1 1 14rem;min-width:0}",
    ".nthview-innerbox p{margin:0;font-size:.9375rem}",
    ".nthview-innerbox p b{display:block;font-size:1rem}",
    ".nthview-innerbox .nthview-nav{white-space:normal;text-align:left}",
    /* holds: one card per party, in its colour */
    ".nthview-holds{margin-top:1.5rem;padding-top:1.25rem;border-top:1px solid var(--sq-line)}",
    ".nthview-holds-head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:.5rem 1rem;margin:0 0 .75rem}",
    ".nthview-holds h3,.nthview-recap h3{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--nv-muted);margin:0;font-weight:700}",
    ".nthview-hgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:.75rem}",
    ".nthview-hcard{border:1px solid var(--nv-border);border-radius:var(--sq-r2);background:var(--sq-panel);padding:.625rem .75rem .75rem;box-shadow:inset 0 3px 0 var(--pc,var(--nv-border))}",
    ".nthview-hcard.nthview-hchanged{background:var(--sq-soft)}",
    ".nthview-hcard h4{margin:0 0 .5rem;font-size:.875rem;font-weight:650;display:flex;align-items:center;gap:.5rem;min-width:0}",
    ".nthview-hcard h4 .nthview-hname{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;min-width:0}",
    ".nthview-hdelta{flex:none;font-size:.75rem;font-weight:700;font-variant-numeric:tabular-nums;color:var(--nv-fg);background:var(--sq-hi);border-radius:99px;padding:0 .4rem}",
    ".nthview-pills{display:flex;flex-wrap:wrap;gap:.375rem}",
    ".nthview-pill{position:relative;font-family:var(--sq-mono);font-size:.75rem;padding:.125rem .5rem;border-radius:var(--sq-r1);background:var(--sq-soft);color:var(--nv-fg);border:1px solid var(--sq-line);overflow-wrap:anywhere;line-height:1.5}",
    ".nthview-hchanged .nthview-pill{background:var(--sq-panel)}",
    ".nthview-pill.nthview-new{background:var(--sq-hi);border-color:var(--nv-accent);font-weight:650}",
    ".nthview-pill.nthview-new::before{content:'+ ';color:var(--nv-accent);font-weight:800}",
    ".nthview-fresh .nthview-pill.nthview-new{animation:nthview-glow 500ms var(--sq-ease) 250ms both}",
    "@keyframes nthview-glow{from{box-shadow:0 0 0 5px var(--sq-hi);transform:scale(1.04)}to{box-shadow:0 0 0 0 var(--sq-hi);transform:none}}",
    ".nthview-pill.nthview-gone{background:transparent;border:1px dashed var(--nv-border);color:var(--nv-muted)}",
    ".nthview-pill.nthview-gone::after{content:'';position:absolute;left:.375rem;right:.375rem;top:50%;border-top:1.5px solid currentColor}",
    ".nthview-fresh .nthview-pill.nthview-gone{animation:nthview-dim 450ms var(--sq-ease) 250ms both}",
    ".nthview-fresh .nthview-pill.nthview-gone::after{transform-origin:left;animation:nthview-strike 400ms var(--sq-ease) 250ms both}",
    "@keyframes nthview-dim{from{color:var(--nv-fg)}to{color:var(--nv-muted)}}",
    "@keyframes nthview-strike{from{transform:scaleX(0)}to{transform:scaleX(1)}}",
    ".nthview-none{font-size:.8125rem;color:var(--nv-muted)}",
    ".nthview-toggle{display:inline-flex;align-items:center;gap:.5rem;font-size:.875rem;color:var(--nv-muted);cursor:pointer;min-height:36px}",
    ".nthview-toggle input{accent-color:var(--nv-accent);width:18px;height:18px;margin:0}",
    ".nthview-toggle-row{margin-top:1rem}",
    ".nthview-hint{font-size:.8125rem;color:var(--nv-muted);margin:1rem 0 0}",
    /* checks: a moment of prediction */
    ".nthview-check{margin-bottom:1rem;background:var(--sq-panel);border:1.5px solid var(--h-amber);box-shadow:var(--sq-sh2),inset 0 4px 0 var(--h-amber)}",
    ".nthview-check-top{display:flex;align-items:center;gap:.625rem;margin:0 0 .75rem}",
    ".nthview-check-ico{flex:none;display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:var(--t-amber);color:var(--h-amber)}",
    ".nthview-check-ico svg{width:18px;height:18px}",
    ".nthview-check-label{font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--h-amber);font-weight:750;margin:0}",
    ".nthview-check h2{margin-bottom:1rem}",
    ".nthview-opts{list-style:none;margin:0;padding:0;display:grid;gap:.625rem}",
    ".nthview-opts.nthview-who{grid-template-columns:repeat(auto-fit,minmax(10rem,1fr))}",
    ".nthview-opt{width:100%;min-height:56px;text-align:left;display:flex;align-items:center;gap:.75rem;border:1.5px solid var(--nv-border);background:var(--sq-panel);padding:.625rem 1rem;border-radius:var(--sq-r2);cursor:pointer;font-size:1rem;line-height:1.4;box-shadow:var(--sq-sh1);transition:border-color var(--sq-fast) var(--sq-ease),transform var(--sq-fast) var(--sq-ease),box-shadow var(--sq-fast) var(--sq-ease),background var(--sq-fast) var(--sq-ease)}",
    ".nthview-opt:not([aria-disabled]):hover{border-color:var(--nv-accent);transform:translateY(-1px);box-shadow:var(--sq-sh2)}",
    ".nthview-opt[aria-disabled]{cursor:default;box-shadow:none}",
    ".nthview-opt .nthview-key{flex:none;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border-radius:50%;font-size:.8125rem;font-weight:750;border:1.5px solid var(--nv-border);color:var(--nv-muted)}",
    ".nthview-opt .nthview-opt-n{display:flex;flex-direction:column;min-width:0}",
    ".nthview-opt .nthview-opt-n small{font-size:.75rem;color:var(--nv-muted)}",
    ".nthview-opt.nthview-right{border-color:var(--h-green);background:var(--t-green)}",
    ".nthview-opt.nthview-wrong{border-color:var(--h-red);background:var(--t-red)}",
    ".nthview-opt.nthview-dim{color:var(--nv-muted);background:var(--sq-soft);border-color:var(--sq-line)}",
    ".nthview-opt-tag{margin-left:auto;display:inline-flex;align-items:center;gap:.25rem;font-size:.75rem;font-weight:750;white-space:nowrap}",
    ".nthview-opt-tag svg{width:16px;height:16px}",
    ".nthview-right .nthview-opt-tag{color:var(--h-green)}",
    ".nthview-wrong .nthview-opt-tag{color:var(--h-red)}",
    ".nthview-revealing .nthview-opt-tag{animation:nthview-pop 300ms var(--sq-ease-in) both}",
    "@keyframes nthview-pop{from{opacity:0;transform:scale(.6)}to{opacity:1;transform:none}}",
    ".nthview-fb{margin-top:1rem;padding:.875rem 1rem;border-radius:var(--sq-r2);background:var(--t-green);box-shadow:inset 3px 0 0 var(--h-green)}",
    ".nthview-fb.nthview-no{background:var(--sq-soft);box-shadow:inset 3px 0 0 var(--nv-accent)}",
    ".nthview-revealing .nthview-fb{animation:nthview-fade-in var(--sq-slow) var(--sq-ease) 80ms both}",
    ".nthview-fb h3{margin:0 0 .25rem;font-size:1rem}",
    ".nthview-fb p{margin:.375rem 0 0;font-size:.9375rem}",
    ".nthview-check-actions{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin-top:1rem}",
    ".nthview-check-actions .nthview-hint{margin:0;flex:1 1 16rem}",
    /* collapsed group: a stack of folded pages */
    ".nthview-gcard{border:1.5px dashed var(--h-teal);margin-bottom:12px;box-shadow:var(--sq-sh2),6px 6px 0 -1px var(--sq-panel),6px 6px 0 0 var(--nv-border),12px 12px 0 -1px var(--sq-panel),12px 12px 0 0 var(--sq-line)}",
    ".nthview-gcard-label{display:inline-flex;align-items:center;gap:.5rem;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:var(--h-teal);font-weight:750;margin:0 0 .5rem}",
    ".nthview-gcard h2{margin-bottom:.5rem}",
    ".nthview-gcard .nthview-why{margin-bottom:1rem}",
    ".nthview-gparties{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin:0 0 .25rem;font-size:.9375rem}",
    ".nthview-gparties b{display:inline-flex;align-items:center;gap:.375rem;font-weight:600}",
    ".nthview-ghead{display:flex;flex-wrap:wrap;align-items:center;gap:.25rem .75rem;margin:0 0 .75rem;padding:.375rem .5rem .375rem 1rem;border:1px dashed var(--h-teal);border-radius:var(--sq-r2);background:var(--t-teal);font-size:.875rem}",
    ".nthview-ghead b{color:var(--h-teal);text-transform:uppercase;letter-spacing:.08em;font-size:.6875rem}",
    ".nthview-ghead span{font-weight:650}",
    ".nthview-ghead .nthview-ghead-n{font-weight:500;color:var(--nv-fg);font-size:.8125rem}",
    ".nthview-ghead .nthview-ghost{margin-left:auto;min-height:32px;padding:.125rem .75rem;background:var(--sq-panel);color:var(--nv-fg);border-color:var(--nv-border)}",
    /* breadcrumb: the path into the tree */
    ".nthview-crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem 1rem;margin:0 0 1rem;padding:.625rem .75rem;background:var(--sq-panel);border:1px solid var(--nv-border);border-radius:var(--sq-r3);box-shadow:var(--sq-sh1);font-size:.875rem}",
    ".nthview-crumbs ol{display:flex;flex-wrap:wrap;align-items:center;gap:.25rem;margin:0;padding:0;list-style:none;flex:1 1 16rem;min-width:0}",
    ".nthview-crumbs li{display:flex;align-items:center;gap:.25rem;min-width:0;max-width:100%}",
    ".nthview-crumbs li+li::before{content:'';flex:none;width:7px;height:7px;border-right:2px solid var(--nv-muted);border-top:2px solid var(--nv-muted);transform:rotate(45deg);margin:0 .375rem 0 .125rem}",
    ".nthview-crumb{display:inline-flex;align-items:center;gap:.375rem;border:1px solid transparent;background:var(--sq-soft);color:var(--nv-fg);min-height:32px;padding:.125rem .625rem;border-radius:99px;cursor:pointer;max-width:17rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:550;transition:border-color var(--sq-fast) var(--sq-ease)}",
    ".nthview-crumb:hover{border-color:var(--nv-accent)}",
    ".nthview-crumb svg{width:14px;height:14px;flex:none}",
    ".nthview-crumb>span:last-child,.nthview-crumb-cur>span:last-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}",
    ".nthview-crumb-n{font-variant-numeric:tabular-nums;font-weight:750;color:var(--nv-accent)}",
    ".nthview-crumb-cur{display:inline-flex;align-items:center;gap:.375rem;font-weight:700;min-height:32px;padding:.125rem .75rem;border-radius:99px;background:var(--sq-hi);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}",
    ".nthview-crumbs .nthview-up{min-height:36px}",
    ".nthview-crumbs-info{flex-basis:100%;margin:0;color:var(--nv-muted);font-size:.875rem;padding:0 .25rem}",
    /* recap */
    ".nthview-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(8rem,1fr));gap:.75rem;margin:1rem 0 1.5rem}",
    ".nthview-stat{border:1px solid var(--sq-line);background:var(--sq-soft);border-radius:var(--sq-r2);padding:.75rem 1rem}",
    ".nthview-stat b{display:block;font-family:var(--sq-head);font-size:1.5rem;line-height:1.2;font-variant-numeric:tabular-nums}",
    ".nthview-stat span{font-size:.8125rem;color:var(--nv-muted)}",
    ".nthview-recap>h3{margin:1.5rem 0 .75rem}",
    ".nthview-recap-list{margin:0 0 1rem;padding:0;list-style:none;display:grid;grid-template-columns:minmax(0,1fr);gap:.125rem}",
    ".nthview-recap-list button{width:100%;display:grid;grid-template-columns:2.5rem minmax(0,1fr);gap:.75rem;align-items:start;text-align:left;border:0;background:transparent;padding:.5rem;border-radius:var(--sq-r2);cursor:pointer;transition:background var(--sq-fast) var(--sq-ease)}",
    ".nthview-recap-list button:hover{background:var(--sq-soft)}",
    ".nthview-recap-n{display:inline-flex;align-items:center;justify-content:center;min-width:2rem;height:1.625rem;padding:0 .375rem;border-radius:99px;font-size:.75rem;font-weight:750;font-variant-numeric:tabular-nums;border:2px solid currentColor;justify-self:start}",
    ".nthview-recap-n span{color:var(--nv-fg)}",
    ".nthview-recap-t{display:block;font-weight:600;overflow-wrap:break-word}",
    ".nthview-recap-route{display:flex;flex-wrap:wrap;align-items:center;gap:.25rem .375rem;font-size:.8125rem;color:var(--nv-muted);margin-top:.125rem}",
    ".nthview-recap-route code{font-size:.75rem}",
    ".nthview-recap-alt{font-size:.6875rem;border:1px dashed var(--h-violet);color:var(--h-violet);border-radius:var(--sq-r1);padding:0 .3rem}",
    ".nthview-recap-checks{margin:0 0 1rem;padding:0;list-style:none;display:grid;gap:.375rem;font-size:.9375rem}",
    ".nthview-recap-checks li>span:first-child{font-weight:650}",
    ".nthview-ok-t{color:var(--h-green);font-weight:700;white-space:nowrap}",
    ".nthview-no-t{color:var(--h-red);font-weight:700;white-space:nowrap}",
    ".nthview-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1.5rem}",
    ".nthview-recap-inner{margin:.125rem 0 .25rem 1.75rem;padding:0 0 0 .75rem;border-left:2px solid var(--nv-border)}",
    ".nthview-recap-glabel{font-size:.75rem;color:var(--h-teal);font-weight:750;padding:.75rem .5rem .125rem;letter-spacing:.04em;text-transform:uppercase}",
    ".nthview-recap-ingroup{border-left:2px dashed var(--h-teal);margin-left:.5rem}",
    ".nthview-recap-list .nthview-recap-open{display:inline-flex;width:auto;margin:.125rem 0 .5rem 3.25rem;font-size:.8125rem;min-height:32px;padding:.25rem .75rem;border:1px solid var(--nv-border);border-radius:99px;color:var(--nv-fg);background:var(--sq-panel);white-space:normal;text-align:left;max-width:calc(100% - 3.25rem)}",
    /* diagram */
    ".nthview-dtools{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin:0 0 .75rem;padding:.5rem 0;position:sticky;top:var(--sq-bar-h);z-index:5;background:var(--nv-bg)}",
    ".nthview-zoomg{display:inline-flex;align-items:center;border:1px solid var(--nv-border);border-radius:var(--sq-r2);background:var(--sq-panel);box-shadow:var(--sq-sh1);overflow:hidden}",
    ".nthview-zoomg .nthview-tbtn{border:0;border-radius:0;box-shadow:none;min-width:40px;padding:.25rem .625rem;font-size:1rem}",
    ".nthview-zoomg .nthview-tbtn+.nthview-tbtn,.nthview-zoomg .nthview-zoomv+.nthview-tbtn{border-left:1px solid var(--sq-line)}",
    ".nthview-dtools .nthview-zoomv{font-size:.8125rem;font-variant-numeric:tabular-nums;color:var(--nv-muted);min-width:3.5rem;text-align:center;border-left:1px solid var(--sq-line);align-self:stretch;display:flex;align-items:center;justify-content:center}",
    ".nthview-dtools .nthview-spacer{flex:1}",
    ".nthview-dtools .nthview-tostep{gap:.3em}",
    ".nthview-dtools .nthview-expand[aria-pressed=true]{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--sq-on-accent)}",
    ".nthview-dwrap{position:relative;display:flex;gap:.5rem}",
    ".nthview-dpanel{flex:1;min-width:0;background:var(--sq-panel);border:1px solid var(--nv-border);border-radius:var(--sq-r3);overflow:auto;max-height:75vh;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;touch-action:pan-x pan-y;box-shadow:var(--sq-sh2)}",
    ".nthview-dpanel svg{display:block;margin:0 auto}",
    ".nthview-dpanel svg.nthview-zooming{transition:width var(--sq-mid) var(--sq-ease),height var(--sq-mid) var(--sq-ease)}",
    ".nthview-mini{position:relative;flex:none;width:14px;border-radius:99px;background:var(--sq-soft);border:1px solid var(--sq-line);cursor:pointer;max-height:75vh}",
    ".nthview-mini i{position:absolute;left:50%;width:6px;height:2px;margin-left:-3px;border-radius:2px;background:var(--nv-muted);opacity:.6}",
    ".nthview-mini i.nthview-cur{width:10px;height:4px;margin-left:-5px;margin-top:-1px;background:var(--nv-accent);opacity:1}",
    ".nthview-mini b{position:absolute;left:1px;right:1px;border-radius:99px;border:1.5px solid var(--nv-accent);background:var(--sq-hi);opacity:.55;transition:top 80ms linear}",
    ".nthview-dtip{position:absolute;z-index:6;pointer-events:none;max-width:20rem;padding:.5rem .75rem;border-radius:var(--sq-r2);background:var(--nv-fg);color:var(--nv-bg);font-size:.8125rem;line-height:1.4;box-shadow:var(--sq-sh3)}",
    ".nthview-dtip b{display:block;font-weight:700}",
    ".nthview-dsvg text{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;fill:var(--nv-fg)}",
    ".nthview-dsvg .nthview-mono{font-family:var(--sq-mono)}",
    ".nthview-dsvg .nthview-muted-t{fill:var(--nv-muted)}",
    ".nthview-dsvg .nthview-band{transition:transform var(--sq-slow) var(--sq-ease)}",
    ".nthview-arrow{cursor:pointer}",
    ".nthview-sequence .nthview-arrow:focus,.nthview-sequence .nthview-arrow:focus-visible{outline:none}",
    ".nthview-arrow .nthview-hit{fill:transparent;stroke:none;transition:fill var(--sq-fast) var(--sq-ease)}",
    ".nthview-arrow:hover .nthview-hit{fill:var(--sq-soft)}",
    ".nthview-arrow:focus-visible .nthview-hit{stroke:var(--nv-accent);stroke-width:2;stroke-dasharray:5 4}",
    ".nthview-arrow.nthview-cur .nthview-line{stroke-width:3.5}",
    ".nthview-arrow.nthview-cur .nthview-lbl{stroke-width:2.5}",
    ".nthview-dlegend{margin-top:1rem;font-size:.875rem;color:var(--nv-muted);display:grid;gap:.5rem}",
    ".nthview-dlegend p{margin:0;max-width:80ch}",
    ".nthview-dlegend .nthview-legend{font-size:.8125rem}",
    ".nthview-kinds{display:flex;flex-wrap:wrap;gap:.375rem 1.25rem;margin:0;padding:0;list-style:none;font-size:.8125rem}",
    ".nthview-kinds li{display:flex;align-items:center;gap:.5rem}",
    ".nthview-kinds svg{width:40px;height:12px;color:var(--nv-fg)}",
    ".nthview-ref{cursor:pointer}",
    ".nthview-sequence .nthview-ref:focus{outline:none}",
    ".nthview-ref .nthview-ref-box{transition:filter var(--sq-fast) var(--sq-ease)}",
    ".nthview-ref:hover .nthview-ref-box{filter:brightness(.96)}",
    ".nthview-ref:focus-visible .nthview-ref-box,.nthview-ref.nthview-cur .nthview-ref-box{stroke-width:3}",
    ".nthview-ref:focus-visible>path:first-child{opacity:.8}",
    /* glossary */
    ".nthview-term{border-bottom:1.5px dotted currentColor;cursor:help;text-decoration:none}",
    ".nthview-term:hover{color:var(--nv-accent)}",
    ".nthview-pop{position:absolute;z-index:30;max-width:min(22rem,calc(100% - 24px));background:var(--sq-panel);color:var(--nv-fg);border:1px solid var(--nv-border);border-radius:var(--sq-r2);padding:.75rem 1rem;font-size:.9375rem;box-shadow:var(--sq-sh3);animation:nthview-fade-in var(--sq-mid) var(--sq-ease) both}",
    ".nthview-pop b{display:block;margin-bottom:.25rem}",
    ".nthview-scrim{position:fixed;inset:0;background:rgba(0,0,0,.38);opacity:0;pointer-events:none;transition:opacity var(--sq-mid) var(--sq-ease);z-index:40}",
    ".nthview-scrim.nthview-open{opacity:1;pointer-events:auto}",
    ".nthview-drawer{position:fixed;top:0;right:0;bottom:0;width:min(26rem,92vw);background:var(--sq-panel);color:var(--nv-fg);border-left:1px solid var(--nv-border);z-index:41;transform:translateX(105%);transition:transform var(--sq-slow) var(--sq-ease),visibility 0s linear var(--sq-slow);overflow:auto;padding:1.25rem 1.5rem 6rem;visibility:hidden;box-shadow:var(--sq-sh3)}",
    ".nthview-drawer.nthview-open{transform:none;visibility:visible;transition:transform var(--sq-slow) var(--sq-ease),visibility 0s}",
    ".nthview-drawer-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:.75rem}",
    ".nthview-drawer-head h2{margin:0;font-size:1.25rem;font-family:var(--sq-head)}",
    ".nthview-gloss dt{font-weight:700;margin-top:1rem}",
    ".nthview-gloss dd{margin:.25rem 0 0;color:var(--nv-muted)}",
    /* small screens */
    "@media (max-width:700px){",
    "  .nthview-sequence{--sq-lane-min:4.75rem;padding:1rem 1rem 6rem;font-size:16px}",
    "  .nthview-wide{display:none}",
    "  .nthview-narrow{display:inline}",
    "  .nthview-head{margin-bottom:1rem}",
    "  .nthview-eyebrow{font-size:.75rem}",
    "  .nthview-title{font-size:1.5rem}",
    "  .nthview-sub{font-size:1rem}",
    "  .nthview-bar{margin-bottom:1rem;padding:.5rem 1rem}",
    "  .nthview-bar-in{gap:.5rem}",
    "  .nthview-seg{flex:1 1 auto}",
    "  .nthview-seg button{flex:1;min-height:40px;padding:.25rem .5rem;font-size:.9375rem}",
    "  .nthview-bar .nthview-tbtn,.nthview-bar .nthview-restart{min-height:44px;min-width:44px;font-size:.9375rem;padding:.25rem .75rem}",
    "  .nthview-meter{order:3;flex-basis:100%}",
    "  .nthview-meter-t{font-size:.8125rem}",
    "  .nthview-stage-in{padding:.875rem .5rem 0}",
    "  .nthview-lane{margin:0 .125rem}",
    "  .nthview-lane .nthview-lane-ava{--ava:38px}",
    "  .nthview-lane small{display:none}",
    "  .nthview-lane b{font-size:.8125rem;line-height:1.2;hyphens:auto}",
    "  .nthview-lane .nthview-inside{font-size:.75rem}",
    "  .nthview-zonelabel{font-size:.75rem;letter-spacing:0;text-transform:none;line-height:1.25;white-space:normal;overflow-wrap:break-word;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}",
    "  .nthview-grouplabel{font-size:.75rem}",
    "  .nthview-track{height:100px}",
    "  .nthview-waiting{height:100px;font-size:.9375rem}",
    "  .nthview-payload{top:8px;font-size:.8125rem;white-space:normal;max-width:min(96%,15rem);line-height:1.3}",
    "  .nthview-payload>span{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}",
    "  .nthview-flight{top:68px}",
    "  .nthview-packet{top:62.5px}",
    "  .nthview-loop{top:50px;height:30px}",
    "  .nthview-stage-more{font-size:.875rem}",
    "  .nthview-sfoot{padding:.625rem .75rem;font-size:.875rem;gap:.375rem .875rem}",
    "  .nthview-sfoot .nthview-sep{display:none}",
    "  .nthview-sfoot.nthview-has-cur li:not(.nthview-cur){display:none}",
    "  .nthview-controls{flex-wrap:wrap;gap:.5rem}",
    "  .nthview-chips{order:3;flex-basis:100%;gap:8px}",
    "  .nthview-chip{min-width:44px;height:44px;font-size:.9375rem}",
    "  .nthview-controls .nthview-nav{flex:1;min-height:48px;font-size:1rem}",
    "  .nthview-card,.nthview-check,.nthview-recap,.nthview-gcard{padding:1.125rem 1rem;border-radius:var(--sq-r2)}",
    "  .nthview-gcard{margin-right:12px}",
    "  .nthview-cardhead{gap:.75rem}",
    "  .nthview-stepno{min-width:2.25rem;height:2.25rem;font-size:.9375rem}",
    "  .nthview-idx{font-size:.8125rem}",
    "  .nthview-card h2,.nthview-check h2,.nthview-recap h2,.nthview-gcard h2{font-size:1.25rem}",
    "  .nthview-badge{font-size:.8125rem}",
    "  .nthview-route{font-size:1rem}",
    "  .nthview-route code{font-size:.875rem}",
    "  .nthview-frag{font-size:.875rem}",
    "  .nthview-frag b{font-size:.8125rem}",
    "  .nthview-wirehead{font-size:.8125rem;padding:.375rem .75rem}",
    "  .nthview-wire{font-size:.8125rem;padding:.75rem;white-space:pre;overflow-wrap:normal;overflow-x:auto}",
    "  .nthview-why{font-size:1rem}",
    "  .nthview-callout{font-size:1rem;padding:.75rem .875rem}",
    "  .nthview-callout h3{font-size:.875rem}",
    "  .nthview-drow{grid-template-columns:1fr;gap:.125rem}",
    "  .nthview-drow dt{font-size:.875rem}",
    "  .nthview-drow dd{font-size:1rem}",
    "  .nthview-details summary{font-size:1rem;min-height:48px}",
    "  .nthview-details summary small{display:none}",
    "  .nthview-holds h3,.nthview-recap h3{font-size:.8125rem}",
    "  .nthview-hgrid{grid-template-columns:repeat(auto-fill,minmax(min(100%,9.5rem),1fr))}",
    "  .nthview-hcard h4{font-size:.9375rem}",
    "  .nthview-pill{font-size:.8125rem;padding:.125rem .5rem}",
    "  .nthview-hdelta{font-size:.8125rem}",
    "  .nthview-none{font-size:.875rem}",
    "  .nthview-toggle{font-size:.9375rem;min-height:44px}",
    "  .nthview-toggle input{width:20px;height:20px}",
    "  .nthview-hint,.nthview-dlegend{font-size:.875rem}",
    "  .nthview-legend,.nthview-kinds,.nthview-dlegend .nthview-legend{font-size:.875rem}",
    "  .nthview-check-label{font-size:.8125rem}",
    "  .nthview-opt{flex-wrap:wrap;min-height:56px;font-size:1rem}",
    "  .nthview-opt>span:not(.nthview-key):not(.nthview-opt-tag):not(.nthview-ava){flex:1 1 0;min-width:0}",
    "  .nthview-opt .nthview-opt-n small{font-size:.8125rem}",
    "  .nthview-opt .nthview-key{font-size:.875rem}",
    "  .nthview-opt-tag{flex-basis:100%;justify-content:flex-end;font-size:.8125rem}",
    "  .nthview-ghost{min-height:44px;font-size:.9375rem}",
    "  .nthview-gcard-label{font-size:.8125rem}",
    "  .nthview-ghead{font-size:.9375rem}",
    "  .nthview-ghead b{font-size:.75rem}",
    "  .nthview-ghead .nthview-ghead-n{font-size:.875rem}",
    "  .nthview-ghead .nthview-ghost{min-height:40px}",
    "  .nthview-stat b{font-size:1.25rem}",
    "  .nthview-stat span{font-size:.875rem}",
    "  .nthview-stats{grid-template-columns:repeat(2,minmax(0,1fr))}",
    "  .nthview-recap-n{font-size:.8125rem}",
    "  .nthview-recap-route{font-size:.875rem}",
    "  .nthview-recap-route code{font-size:.8125rem}",
    "  .nthview-recap-alt{font-size:.75rem}",
    "  .nthview-recap-inner{margin-left:.75rem}",
    "  .nthview-recap-list .nthview-recap-open{margin-left:.75rem;min-height:44px;font-size:.875rem;max-width:calc(100% - .75rem)}",
    "  .nthview-dtools .nthview-tbtn,.nthview-zoomg .nthview-tbtn{min-width:44px;min-height:44px}",
    "  .nthview-dtools .nthview-zoomv{font-size:.875rem;min-width:3rem}",
    "  .nthview-dpanel{max-height:calc(100vh - 9rem);max-height:calc(100svh - 9rem);overscroll-behavior:auto}",
    "  .nthview-mini{width:10px;max-height:calc(100svh - 9rem)}",
    "  .nthview-crumbs{font-size:.9375rem;padding:.625rem}",
    "  .nthview-crumb,.nthview-crumb-cur{min-height:40px;max-width:13rem}",
    "  .nthview-crumbs .nthview-up{flex:1 1 100%;min-height:44px;font-size:.9375rem}",
    "  .nthview-crumbs-info{font-size:.9375rem}",
    "  .nthview-innerbox .nthview-nav{flex:1 1 100%;min-height:48px}",
    "  .nthview-pop{font-size:1rem}",
    "  .nthview-drawer{top:auto;left:0;width:auto;max-height:82vh;max-height:82svh;border-left:0;border-top:1px solid var(--nv-border);border-radius:var(--sq-r3) var(--sq-r3) 0 0;transform:translateY(105%);padding:1rem 1.25rem 6rem}",
    "  .nthview-drawer::before{content:'';display:block;width:40px;height:4px;border-radius:99px;background:var(--nv-border);margin:0 auto .75rem}",
    "  .nthview-gloss dd{font-size:1rem}",
    "}",
    "@media (prefers-reduced-motion:reduce){",
    "  .nthview-sequence *,.nthview-sequence *::before,.nthview-sequence *::after{transition:none!important;animation:none!important}",
    "}"
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
    return "nthview:sequence:" + (h >>> 0).toString(36);
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

  // ---- view-specific rendering: data is already valid here ---------------
  var SVG_NS = "http://www.w3.org/2000/svg";
  var LETTERS = "ABCD";
  var KIND_NAMES = { sync: "call", async: "async message", "return": "reply", self: "self step" };

  /* SVG element builder, the el() of the diagram */
  function sv(tag, attrs, children) {
    var n = root.document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { n.appendChild(c); });
    return n;
  }

  var GLYPHS = {
    person: [["circle", { cx: 12, cy: 8, r: 3.6 }], ["path", { d: "M4.5 20.5c.8-3.9 3.8-6 7.5-6s6.7 2.1 7.5 6" }]],
    browser: [["rect", { x: 3, y: 4.5, width: 18, height: 15, rx: 2 }], ["path", { d: "M3 9h18M6 6.8h.01M8.4 6.8h.01" }]],
    app: [["rect", { x: 3.5, y: 3.5, width: 17, height: 17, rx: 3.5 }], ["path", { d: "M9.5 9.5 7 12l2.5 2.5M14.5 9.5 17 12l-2.5 2.5" }]],
    server: [["rect", { x: 4, y: 3.5, width: 16, height: 7, rx: 1.5 }], ["rect", { x: 4, y: 13.5, width: 16, height: 7, rx: 1.5 }], ["path", { d: "M7.5 7h.01M7.5 17h.01M11 7h5M11 17h5" }]],
    service: [["path", { d: "M7.5 18.5h9.2a3.8 3.8 0 0 0 .6-7.55A5.5 5.5 0 0 0 6.7 10.2a4.2 4.2 0 0 0 .8 8.3z" }]],
    database: [["ellipse", { cx: 12, cy: 6, rx: 7, ry: 2.8 }], ["path", { d: "M5 6v12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8V6M5 12c0 1.55 3.13 2.8 7 2.8s7-1.25 7-2.8" }]],
    device: [["rect", { x: 7, y: 2.5, width: 10, height: 19, rx: 2.2 }], ["path", { d: "M10.5 18.5h3" }]],
    other: [["circle", { cx: 12, cy: 12, r: 8 }], ["circle", { cx: 12, cy: 12, r: 2.2 }]],
    group: [["rect", { x: 2.5, y: 2.5, width: 19, height: 19, rx: 3 }], ["rect", { x: 6, y: 6, width: 5, height: 5, rx: 1 }], ["rect", { x: 13, y: 6, width: 5, height: 5, rx: 1 }], ["rect", { x: 6, y: 13, width: 5, height: 5, rx: 1 }], ["rect", { x: 13, y: 13, width: 5, height: 5, rx: 1 }]]
  };
  function glyph(kind, attrs) {
    var s = sv("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", focusable: "false" });
    Object.keys(attrs || {}).forEach(function (k) { s.setAttribute(k, attrs[k]); });
    (GLYPHS[kind] || GLYPHS.other).forEach(function (pt) { s.appendChild(sv(pt[0], pt[1])); });
    return s;
  }
  function icon(name) {
    var paths = {
      info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01",
      warning: "M12 3.5 2.8 19.5h18.4L12 3.5zM12 10v4.5M12 17h.01",
      danger: "M8.2 3h7.6L21 8.2v7.6L15.8 21H8.2L3 15.8V8.2L8.2 3zM12 8v5M12 16h.01",
      close: "M6 6l12 12M18 6 6 18",
      check: "M5 12.5 10 17.5 19 7",
      cross: "M7 7l10 10M17 7 7 17",
      predict: "M9.2 9.3a2.9 2.9 0 1 1 4.3 2.5c-.9.5-1.5 1.2-1.5 2.2v.4M12 17.6h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
      history: "M3.5 12a8.5 8.5 0 1 0 2.6-6.1M3.5 4v4.2h4.2M12 7.5V12l3 2",
      layers: "M12 3 2.5 8 12 13l9.5-5L12 3zM2.5 12.5 12 17.5l9.5-5M2.5 16.5 12 21.5l9.5-5",
      home: "M4 11 12 4l8 7M6.5 9.5V20h11V9.5",
      back: "M15 5l-7 7 7 7",
      book: "M4.5 5.5A2.5 2.5 0 0 1 7 3h12.5v15H7a2.5 2.5 0 0 0-2.5 2.5v-15zM4.5 20.5A2.5 2.5 0 0 0 7 23h12.5",
      chev: "M9 5l7 7-7 7",
      folder: "M3.5 6.5A1.5 1.5 0 0 1 5 5h4.5l2 2.5H19a1.5 1.5 0 0 1 1.5 1.5v8.5A1.5 1.5 0 0 1 19 19H5a1.5 1.5 0 0 1-1.5-1.5v-11z"
    };
    return sv("svg", { class: "nthview-i", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", focusable: "false" }, [sv("path", { d: paths[name] })]);
  }
  /* the arrow kind as a tiny line sample, for legends and badges */
  function kindSample(k) {
    var s = sv("svg", { viewBox: "0 0 40 12", "aria-hidden": "true", focusable: "false" });
    if (k === "self") {
      s.appendChild(sv("path", { d: "M6 3h18a3.5 3.5 0 0 1 0 7H12", fill: "none", stroke: "currentColor", "stroke-width": 2 }));
      s.appendChild(sv("path", { d: "M14 7 9.5 10 14 12.5", fill: "none", stroke: "currentColor", "stroke-width": 1.6 }));
      return s;
    }
    s.appendChild(sv("line", { x1: 2, y1: 6, x2: 34, y2: 6, stroke: "currentColor", "stroke-width": 2, "stroke-dasharray": k === "return" ? "5 4" : "none" }));
    s.appendChild(k === "sync" ? sv("path", { d: "M30 1.5 39 6 30 10.5z", fill: "currentColor" }) : sv("path", { d: "M31 1.5 39 6 31 10.5", fill: "none", stroke: "currentColor", "stroke-width": 2 }));
    return s;
  }
  /* arrowheads drawn in a 12x12 box pointing right */
  function headTip(kind) {
    var filled = kind !== "async" && kind !== "return";
    return sv("svg", { class: "nthview-head-tip", viewBox: "0 0 12 12", "aria-hidden": "true", focusable: "false" }, [
      filled ? sv("path", { d: "M1 1.5 11 6 1 10.5z", fill: "currentColor" }) : sv("path", { d: "M2 1.5 11 6 2 10.5", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linejoin": "round", "stroke-linecap": "round" })
    ]);
  }

  function pickTheme(data) {
    if (data.theme && THEMES.indexOf(data.theme) !== -1) return data.theme;
    var h = 0, s = String(data.title || "");
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return THEMES[h % THEMES.length];
  }
  function stepKind(s) { return s.kind || (s.from === s.to ? "self" : "sync"); }
  function pad2(n, w) { var s = String(n); while (s.length < w) s = "0" + s; return s; }
  function clip(text, n) { text = String(text); return text.length > n ? text.slice(0, n - 1) + "…" : text; }
  function cloneState(st) { var o = {}; Object.keys(st).forEach(function (k) { o[k] = st[k].slice(); }); return o; }

  /* Holds of one level: cumulative from the level's starting state; removes before adds; a non-first
     alt branch starts from the state before the alt and does not carry forward. `before[i]` is the state
     just before step i, where that step's inner sequence starts. Mirrors validate.js. */
  function computeHolds(seq, init) {
    var steps = seq.steps, N = steps.length, frags = seq.fragments || [];
    var state = cloneState(init), clone = cloneState;
    var alts = frags.map(function (f, i) { return { f: f, i: i }; }).filter(function (x) { return x.f.kind === "alt"; });
    var startSnap = {}, firstEnd = {}, before = [], after = [], added = [], removed = [];
    for (var i = 0; i <= N; i++) {
      alts.filter(function (x) { return x.f.end === i - 1; })
        .sort(function (a, b) { return (a.f.end - a.f.start) - (b.f.end - b.f.start) || b.i - a.i; })
        .forEach(function (x) { if (firstEnd[x.i]) state = clone(firstEnd[x.i]); });
      if (i === N) break;
      alts.forEach(function (x) {
        x.f.branches.forEach(function (br, k) {
          if (k > 0 && br.start === i) { if (k === 1) firstEnd[x.i] = clone(state); state = clone(startSnap[x.i]); }
        });
      });
      alts.filter(function (x) { return x.f.start === i; })
        .sort(function (a, b) { return (b.f.end - b.f.start) - (a.f.end - a.f.start) || a.i - b.i; })
        .forEach(function (x) { startSnap[x.i] = clone(state); });
      before.push(clone(state));
      var s = steps[i], add = {}, rem = {};
      if (s.holds) {
        Object.keys(s.holds).forEach(function (id) {
          var h = s.holds[id];
          if (!state[id]) return;
          (h.remove || []).forEach(function (x) { var at = state[id].indexOf(x); if (at !== -1) { state[id].splice(at, 1); (rem[id] = rem[id] || []).push(x); } });
          (h.add || []).forEach(function (x) { if (state[id].indexOf(x) === -1) { state[id].push(x); (add[id] = add[id] || []).push(x); } });
        });
      }
      after.push(clone(state)); added.push(add); removed.push(rem);
    }
    return { before: before, after: after, added: added, removed: removed, final: clone(state) };
  }

  /* For each step: the fragments around it, outermost first, with the alt branch it sits in. */
  function fragmentInfo(seq) {
    var frags = (seq.fragments || []).map(function (f, i) { return { f: f, i: i }; });
    frags.sort(function (a, b) { return a.f.start - b.f.start || (b.f.end - b.f.start) - (a.f.end - a.f.start) || a.i - b.i; });
    return seq.steps.map(function (s, k) {
      return frags.filter(function (x) { return k >= x.f.start && k <= x.f.end; }).map(function (x) {
        var branch = -1;
        if (x.f.kind === "alt") x.f.branches.forEach(function (b, bi) { if (k >= b.start && k <= b.end) branch = bi; });
        return { f: x.f, i: x.i, branch: branch };
      });
    });
  }

  /* The tree of sequences. Participant ids are unique across the tree, so one map serves every level.
     Columns follow one global order: the top-level participants, each followed by its group members and
     by the own participants of inner sequences whose parent step is addressed to it. */
  function buildModel(data) {
    var PMAP = {}, LEVELS = {}, GLOSS = {}, KIDS = {}, PARENT = {}, RANK = {};
    function kid(parentId, id) { (KIDS[parentId] = KIDS[parentId] || []).push(id); PARENT[id] = parentId; }
    function level(seq, parent, parentIdx, init) {
      var path = parent ? parent.path.concat([parentIdx]) : [];
      var Lv = { key: path.join("."), path: path, seq: seq, parent: parent, parentIdx: parentIdx, depth: path.length, S: seq.steps, N: seq.steps.length, own: seq.participants || [] };
      var anchor = parent ? parent.S[parentIdx].to : null;
      var st = cloneState(init || {});
      Lv.own.forEach(function (p) {
        PMAP[p.id] = { p: p, level: Lv.key, group: null, isGroup: p.kind === "group" };
        if (anchor) kid(anchor, p.id);
        st[p.id] = (p.holds || []).slice();
        (p.kind === "group" ? p.members : []).forEach(function (m) { PMAP[m.id] = { p: m, level: Lv.key, group: p.id, isGroup: false }; kid(p.id, m.id); st[m.id] = []; });
      });
      (seq.glossary || []).forEach(function (g) { GLOSS[g.term.trim().toLowerCase()] = g; });
      Lv.C = {};
      if (parent) Object.keys(parent.C).forEach(function (k) { Lv.C[k] = parent.C[k]; });
      (seq.channels || []).forEach(function (c) { Lv.C[c.id] = c; });
      Lv.FRAG = fragmentInfo(seq);
      Lv.init = st;
      Lv.HOLDS = computeHolds(seq, st);
      LEVELS[Lv.key] = Lv;
      Lv.S.forEach(function (s, i) { if (s.inner) level(s.inner, Lv, i, Lv.HOLDS.before[i]); });
      return Lv;
    }
    var ROOT = level(data, null, 0, {});
    var n = 0;
    function dfs(id) { RANK[id] = n++; (KIDS[id] || []).forEach(dfs); }
    ROOT.own.forEach(function (p) { dfs(p.id); });
    Object.keys(PMAP).forEach(function (id) { if (RANK[id] === undefined) RANK[id] = n++; });
    function byRank(a, b) { return RANK[a] - RANK[b]; }
    Object.keys(LEVELS).forEach(function (k) {
      var Lv = LEVELS[k], set = {};
      /* a member of a group declared at this level is drawn on its group's lane */
      Lv.resolve = function (id) { var m = PMAP[id]; return m.group && PMAP[m.group].level === Lv.key ? m.group : id; };
      Lv.own.forEach(function (p) { set[p.id] = true; });
      Lv.S.forEach(function (s) { set[Lv.resolve(s.from)] = true; set[Lv.resolve(s.to)] = true; });
      Lv.lanes = Object.keys(set).sort(byRank);
      Lv.LI = {};
      Lv.lanes.forEach(function (id, i) { Lv.LI[id] = i; });
      Lv.laneOf = function (id) { return Lv.LI[Lv.resolve(id)]; };
      var cand = {};
      Lv.lanes.forEach(function (id) { cand[id] = true; });
      Lv.S.forEach(function (s) { if (s.holds) Object.keys(s.holds).forEach(function (id) { cand[id] = true; }); });
      Lv.holders = Object.keys(cand).sort(byRank).filter(function (id) {
        return (Lv.init[id] || []).length || Lv.S.some(function (s) { return s.holds && s.holds[id] && (s.holds[id].add || []).length; });
      });
      var used = {};
      Lv.S.forEach(function (s) { used[s.channel] = true; });
      Lv.channelsUsed = Object.keys(Lv.C).filter(function (c) { return used[c]; }).map(function (c) { return Lv.C[c]; });
    });
    /* Colour identity: one hue per party for the whole document, so a party keeps its colour at every
       level. Greedy over who is drawn together: parties sharing a level's lanes weigh 10, parties that
       meet only in an expanded diagram weigh 1; ties go to the least used hue, then document order. */
    var COLOR = {}, near = {}, uses = [];
    for (var u = 0; u < NIDENT; u++) uses.push(0);
    function addW(a, b, w) { if (a === b) return; near[a] = near[a] || {}; near[a][b] = Math.max(near[a][b] || 0, w); }
    Object.keys(LEVELS).forEach(function (k) {
      var Lv = LEVELS[k], all = {};
      Lv.lanes.forEach(function (a) { Lv.lanes.forEach(function (b) { addW(a, b, 10); }); });
      (function walk(x) { x.lanes.forEach(function (id) { all[id] = true; }); x.S.forEach(function (s, i) { if (s.inner) walk(LEVELS[x.key ? x.key + "." + i : String(i)]); }); })(Lv);
      var al = Object.keys(all);
      al.forEach(function (a) { al.forEach(function (b) { addW(a, b, 1); }); });
    });
    Object.keys(PMAP).sort(byRank).forEach(function (id) {
      var best = 0, bestScore = Infinity;
      for (var c = 0; c < NIDENT; c++) {
        var score = 0;
        Object.keys(near[id] || {}).forEach(function (o) { if (COLOR[o] === c) score += near[id][o]; });
        score = score * 1000 + uses[c];
        if (score < bestScore) { bestScore = score; best = c; }
      }
      COLOR[id] = best; uses[best]++;
    });
    return { ROOT: ROOT, LEVELS: LEVELS, PMAP: PMAP, GLOSS: GLOSS, RANK: RANK, PARENT: PARENT, byRank: byRank, COLOR: COLOR };
  }

  function render(container, data) {
    var doc = root.document;
    var reduceMotion = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var M = buildModel(data), PMAP = M.PMAP, LEVELS = M.LEVELS, GLOSS = M.GLOSS, PARENT = M.PARENT, byRank = M.byRank;
    var zones = data.zones || [], ZI = {};
    zones.forEach(function (z) { ZI[z.id] = z; });
    var levelKeys = Object.keys(LEVELS), innerCount = levelKeys.length - 1;
    var anyCompare = levelKeys.some(function (k) { return LEVELS[k].S.some(function (s) { return !!s.compare; }); });
    var anyFold = innerCount > 0 || levelKeys.some(function (k) { return (LEVELS[k].seq.fragments || []).some(function (f) { return f.kind === "group"; }); });
    var key = storageKey(data);
    var state = { path: [], step: 0, mode: "step", zoom: "fit", expand: false, compare: false, details: false, checks: {}, groups: {}, summarySeen: false, recapSeen: {}, seen: {}, holdsChanged: false, done: false };
    /* the level being shown, and shortcuts into it */
    var L, S, N, C, FRAG, HOLDS, holders;
    function useLevel() {
      L = LEVELS[state.path.join(".")] || M.ROOT;
      state.path = L.path.slice();
      S = L.S; N = L.N; C = L.C; FRAG = L.FRAG; HOLDS = L.HOLDS; holders = L.holders;
    }
    useLevel();
    container.setAttribute("data-theme", pickTheme(data));

    function hue(c) { return "var(--h-" + c + ")"; }
    function tint(c) { return "var(--t-" + c + ")"; }
    function chColor(s) { return C[s.channel].color; }
    function pOf(id) { return PMAP[id].p; }
    function nameOf(id) { return PMAP[id].p.name; }
    function kindOf(id) { return PMAP[id].p.kind || "other"; }
    function ckey(Lv, i) { return Lv.key ? Lv.key + "." + i : String(i); }
    function numLabel(Lv, i) { return Lv.path.map(function (x) { return x + 1; }).concat([i + 1]).join("."); }
    function innerOf(Lv, i) { return LEVELS[ckey(Lv, i)]; }
    function parentStep(Lv) { return Lv.parent.S[Lv.parentIdx]; }
    function zoneOf(id) { var p = PMAP[id].p; return p.zone || (PARENT[id] !== undefined ? zoneOf(PARENT[id]) : null); }
    /* contiguous runs of the same zone over an ordered list of ids */
    function zoneRuns(ids) {
      var runs = [];
      ids.forEach(function (id, i) {
        var z = zoneOf(id), last = runs[runs.length - 1];
        if (last && last.zone === z) last.n++; else runs.push({ zone: z, start: i, n: 1 });
      });
      return runs;
    }
    /* bands of group members over an ordered list of ids: [{g, c0, c1, depth}] */
    function groupBands(ids) {
      var cols = {};
      ids.forEach(function (id, c) {
        var x = id;
        while (x !== undefined) {
          var g = PMAP[x] && PMAP[x].group;
          if (g) (cols[g] = cols[g] || []).push(c);
          x = PARENT[x];
        }
      });
      var bands = Object.keys(cols).map(function (g) {
        var cs = cols[g], own = ids.indexOf(g);
        if (own !== -1) cs = cs.concat([own]);
        return { g: g, c0: Math.min.apply(null, cs), c1: Math.max.apply(null, cs), hasOwn: own !== -1 };
      });
      bands.forEach(function (b) { b.depth = bands.filter(function (o) { return o !== b && o.c0 <= b.c0 && o.c1 >= b.c1 && (o.c1 - o.c0 > b.c1 - b.c0 || o.g < b.g); }).length; });
      return bands;
    }

    /* ---------- collapsible groups (fragments of kind "group") ---------- */
    function gkey(Lv, fi) { return Lv.key + "#g" + fi; }
    function isOpen(Lv, fi) { var k = gkey(Lv, fi); return state.groups[k] !== undefined ? state.groups[k] : Lv.seq.fragments[fi].collapsed === false; }
    function groupFrags(Lv) { return (Lv.seq.fragments || []).map(function (f, i) { return { f: f, i: i }; }).filter(function (x) { return x.f.kind === "group"; }); }
    function outerFirst(a, b) { return a.f.start - b.f.start || (b.f.end - b.f.start) - (a.f.end - a.f.start) || a.i - b.i; }
    /* what the learner moves through: single steps, or a collapsed group as one unit */
    function unitsOf(Lv, all) {
      var gs = groupFrags(Lv), out = [], i = 0;
      function pick(x) { return x.f.start === i && !(all || isOpen(Lv, x.i)); }
      while (i < Lv.N) {
        var c = gs.filter(pick).sort(outerFirst)[0];
        if (c) { out.push({ g: c.f, gi: c.i, start: i, end: c.f.end }); i = c.f.end + 1; }
        else { out.push({ start: i, end: i }); i++; }
      }
      return out;
    }
    function unitAt(us, i) { for (var k = 0; k < us.length; k++) if (i >= us[k].start && i <= us[k].end) return k; return -1; }
    function reveal(Lv, i) { groupFrags(Lv).forEach(function (x) { if (i >= x.f.start && i <= x.f.end && !isOpen(Lv, x.i)) state.groups[gkey(Lv, x.i)] = true; }); }
    function partiesOf(Lv, a, b) {
      var set = {};
      for (var i = a; i <= b; i++) { set[Lv.resolve(Lv.S[i].from)] = true; set[Lv.resolve(Lv.S[i].to)] = true; }
      return Object.keys(set).sort(byRank);
    }

    /* ---------- progress (§5.5) ---------- */
    function untouched() { return !state.done && !state.path.length && state.step === 0 && state.mode === "step" && !Object.keys(state.checks).length && !Object.keys(state.groups).length && !state.compare && !state.details && !state.expand && !state.holdsChanged && state.zoom === "fit" && Object.keys(state.seen).every(function (k) { return k === "0"; }); }
    function persist() {
      if (untouched()) { clearState(key); return; }
      saveState(key, { path: state.path.slice(), step: state.step, mode: state.mode, zoom: state.zoom, expand: state.expand, compare: state.compare, details: state.details, checks: state.checks, groups: state.groups, summarySeen: state.summarySeen, recapSeen: state.recapSeen, seen: state.seen, holdsChanged: state.holdsChanged, done: state.done });
    }
    function resumeNotice(text) {
      var n = el("div", { class: "nthview-resume", role: "status" }, [el("span", { text: text })]);
      function hide() {
        container.removeEventListener("pointerdown", hide, true); container.removeEventListener("keydown", hide, true);
        if (!n.parentNode) return;
        n.classList.add("nthview-resume-hide");
        setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, reduceMotion ? 0 : 450);
      }
      container.addEventListener("pointerdown", hide, true); container.addEventListener("keydown", hide, true);
      setTimeout(hide, 8000);
      return n;
    }

    /* ---------- rich text: **bold**, `code`, ((term)), ((shown|term)) ---------- */
    function rich(text) {
      var frag = doc.createDocumentFragment();
      String(text).split(/(\*\*[^*]+\*\*|`[^`]+`|\(\([^()]+\)\))/).forEach(function (part) {
        if (!part) return;
        if (/^\*\*[^*]+\*\*$/.test(part)) { var b = el("b"); b.appendChild(rich(part.slice(2, -2))); frag.appendChild(b); return; }
        if (/^`[^`]+`$/.test(part)) { frag.appendChild(el("code", { text: part.slice(1, -1) })); return; }
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
        frag.appendChild(doc.createTextNode(part));
      });
      return frag;
    }
    function para(cls, text) { var n = el("p", cls ? { class: cls } : {}); n.appendChild(rich(text)); return n; }

    /* ---------- header ---------- */
    var status = el("div", { class: "nthview-sr", "aria-live": "polite" });
    var RN = M.ROOT.N;
    var eyebrow = el("p", { class: "nthview-eyebrow" }, [el("span", { text: "Sequence" }), el("span", { text: RN + " steps" }), el("span", { text: M.ROOT.lanes.length + " parties" })]);
    if (innerCount) eyebrow.appendChild(el("span", { text: innerCount + " inner sequence" + (innerCount > 1 ? "s" : "") }));
    var headText = el("div", { class: "nthview-head-text" }, [eyebrow, el("h1", { class: "nthview-title", text: data.title })]);
    if (data.subtitle) headText.appendChild(para("nthview-sub", data.subtitle));
    function modeBtn(wide, narrow, pressed) { return el("button", { type: "button", "aria-pressed": pressed, "aria-label": wide }, [el("span", { class: "nthview-wide", text: wide }), el("span", { class: "nthview-narrow", "aria-hidden": "true", text: narrow })]); }
    var bStep = modeBtn("Step by step", "Steps", "true");
    var bDiag = modeBtn("Full diagram", "Diagram", "false");
    bStep.addEventListener("click", function () { setMode("step", true); });
    bDiag.addEventListener("click", function () { setMode("diagram", true); });
    var progBar = el("span");
    var prog = el("div", { class: "nthview-progress", role: "progressbar", "aria-label": "Progress through the sequence", "aria-valuemin": "0", "aria-valuemax": String(N) }, [progBar]);
    var meterT = el("span", { class: "nthview-meter-t" });
    var barIn = el("div", { class: "nthview-bar-in" }, [el("div", { class: "nthview-seg", role: "group", "aria-label": "View mode" }, [bStep, bDiag]), el("div", { class: "nthview-meter" }, [prog, meterT])]);
    var glossBtn = null;
    if (Object.keys(GLOSS).length) {
      glossBtn = el("button", { type: "button", class: "nthview-tbtn", "aria-expanded": "false", "aria-label": "Glossary" }, [icon("book"), el("span", { class: "nthview-wide", text: "Glossary" })]);
      barIn.appendChild(glossBtn);
    }
    barIn.appendChild(restartButton(container, data, key));
    var header = el("header", { class: "nthview-head" }, [headText]);
    var bar = el("div", { class: "nthview-bar" }, [barIn]);
    container.appendChild(header);
    container.appendChild(bar);
    var resumeSlot = el("div");
    container.appendChild(resumeSlot);
    /* "Step 3 of 10 · about 4 min left": about half a minute per remaining step */
    function setMeter(i) {
      meterT.textContent = "";
      var done = i >= N, left = Math.max(0, N - i), mins = Math.round(left * 0.5);
      meterT.appendChild(el("b", { text: done ? "Recap" : (L.depth ? "Step " + numLabel(L, i) : "Step " + (i + 1)) + " of " + N }));
      meterT.appendChild(doc.createTextNode(done ? " · all " + N + " steps seen" + (L.depth ? " here" : "") : " · " + (left <= 1 ? "almost done" : mins < 1 ? "under a minute left" : "about " + mins + " min left")));
      progBar.style.width = Math.round(Math.min(i + 1, N) / N * 100) + "%";
      prog.setAttribute("aria-valuenow", String(Math.min(i + 1, N)));
      prog.setAttribute("aria-valuetext", meterT.textContent);
    }
    function measureBar() { container.style.setProperty("--sq-bar-h", bar.offsetHeight + "px"); }
    var touchFirst = !!(root.matchMedia && root.matchMedia("(hover: none) and (pointer: coarse)").matches);

    /* ---------- breadcrumb: where the learner is in the tree ---------- */
    var crumbs = el("nav", { class: "nthview-crumbs", "aria-label": "Where you are in the sequence", hidden: "" });
    container.appendChild(crumbs);
    function buildCrumbs() {
      crumbs.textContent = "";
      if (!L.depth) { crumbs.hidden = true; return; }
      crumbs.hidden = false;
      var chain = [], x;
      for (x = L; x; x = x.parent) chain.unshift(x);
      var ol = el("ol");
      chain.forEach(function (lv, k) {
        var num = k === 0 ? "" : numLabel(lv.parent, lv.parentIdx);
        var full = k === 0 ? "The main sequence" : "Step " + num + ": " + parentStep(lv).title;
        function label(node) {
          if (k === 0) { node.appendChild(icon("home")); node.appendChild(el("span", { text: "Main" })); return node; }
          node.appendChild(el("span", { class: "nthview-crumb-n", text: num }));
          node.appendChild(el("span", { text: clip(parentStep(lv).title, 34) }));
          return node;
        }
        if (k === chain.length - 1) { ol.appendChild(el("li", {}, [label(el("span", { class: "nthview-crumb-cur", "aria-current": "location", title: full }))])); return; }
        var b = label(el("button", { type: "button", class: "nthview-crumb", title: "Go to " + full, "aria-label": "Go to " + full })), target = chain[k + 1];
        b.addEventListener("click", function () { gotoLevel(lv.path, target.parentIdx, { reveal: true }); });
        ol.appendChild(el("li", {}, [b]));
      });
      var up = el("button", { type: "button", class: "nthview-tbtn nthview-up" }, [icon("back"), el("span", { text: "Back to step " + numLabel(L.parent, L.parentIdx) })]);
      up.addEventListener("click", upLevel);
      crumbs.appendChild(ol);
      crumbs.appendChild(up);
      crumbs.appendChild(el("p", { class: "nthview-crumbs-info", text: "Inside step " + numLabel(L.parent, L.parentIdx) + ": how it is carried out, " + N + " steps between " + L.lanes.length + " parties." + (touchFirst ? "" : " Escape or Backspace goes back up.") }));
      if (L.seq.subtitle) crumbs.appendChild(para("nthview-crumbs-info", L.seq.subtitle));
    }

    /* ---------- party identity: avatars in the party's colour ---------- */
    function paint(n, id) { var c = M.COLOR[id]; n.style.setProperty("--pc", "var(--p" + c + ")"); n.style.setProperty("--pq", "var(--q" + c + ")"); return n; }
    function avatar(id, size) {
      var a = el("span", { class: "nthview-ava" + (size ? " nthview-ava-" + size : "") + (PMAP[id].isGroup ? " nthview-ava-grp" : ""), "aria-hidden": "true" }, [glyph(kindOf(id))]);
      return paint(a, id);
    }
    function memberStack(id, max) {
      var p = pOf(id), st = el("span", { class: "nthview-stack", "aria-hidden": "true" });
      p.members.slice(0, max).forEach(function (m) { st.appendChild(avatar(m.id)); });
      if (p.members.length > max) st.appendChild(el("span", { class: "nthview-more", text: "+" + (p.members.length - max) }));
      return st;
    }
    function who(id) { return el("b", {}, [avatar(id, "sm"), el("span", { text: nameOf(id) })]); }

    /* ---------- step mode: stage, rebuilt for each level ---------- */
    var stage = el("div", { class: "nthview-stage" });
    /* lanes keep a readable width (--sq-lane-min); when they do not fit, they scroll sideways inside the stage */
    var stageScroll = el("div", { class: "nthview-stage-scroll" });
    var stageIn = el("div", { class: "nthview-stage-in" });
    stageScroll.appendChild(stageIn); stage.appendChild(stageScroll);
    var stageMore = el("p", { class: "nthview-stage-more", hidden: "" });
    var flight = el("div", { class: "nthview-flight" });
    var packet = el("div", { class: "nthview-packet" });
    var loop = el("div", { class: "nthview-loop" });
    var payload = el("div", { class: "nthview-payload" });
    var waiting = el("div", { class: "nthview-waiting" });
    /* the waiting note sits over the track but outside the scroller, so it stays in view however far the lanes scroll */
    stage.appendChild(waiting); stage.appendChild(stageMore);
    var sfoot = el("div", { class: "nthview-sfoot" });
    stage.appendChild(sfoot);
    var laneEls = [], railEls = [], track = null, nLanes = 0, stageKey = null;
    function buildStage() {
      stageKey = L.key;
      stageIn.textContent = "";
      var ids = L.lanes;
      nLanes = ids.length;
      var cols = "repeat(" + nLanes + ",minmax(0,1fr))";
      stageIn.style.setProperty("--sq-lanes", String(nLanes));
      stageMore.textContent = nLanes + " parties: swipe or scroll sideways to see them all. The view follows each message.";
      var runs = zoneRuns(ids);
      if (runs.some(function (r) { return r.zone; })) {
        var zbg = el("div", { class: "nthview-zonebg", "aria-hidden": "true" }); zbg.style.gridTemplateColumns = cols;
        var zrow = el("div", { class: "nthview-zonerow" }); zrow.style.gridTemplateColumns = cols;
        var zk = 0;
        runs.forEach(function (r) {
          var band = el("div"), lab = el("div", { class: "nthview-zonelabel" });
          band.style.gridColumn = lab.style.gridColumn = (r.start + 1) + " / span " + r.n;
          if (r.zone) {
            band.className = "nthview-zoneband " + (zk++ % 2 ? "nthview-zb" : "nthview-za");
            lab.textContent = ZI[r.zone].name;
            if (ZI[r.zone].description) lab.title = ZI[r.zone].description;
          }
          zbg.appendChild(band); zrow.appendChild(lab);
        });
        stageIn.appendChild(zbg); stageIn.appendChild(zrow);
      }
      var bands = groupBands(ids);
      if (bands.length) {
        var grow = el("div", { class: "nthview-grouprow" }); grow.style.gridTemplateColumns = cols;
        bands.forEach(function (b) {
          var lab = el("div", { class: "nthview-grouplabel", title: nameOf(b.g) + ": the parties inside it", text: nameOf(b.g) + (b.hasOwn ? "" : " · inside") });
          lab.style.gridColumn = (b.c0 + 1) + " / span " + (b.c1 - b.c0 + 1);
          lab.style.gridRow = String(b.depth + 1);
          grow.appendChild(lab);
        });
        stageIn.appendChild(grow);
      }
      var lanes = el("div", { class: "nthview-lanes" }); lanes.style.gridTemplateColumns = cols;
      laneEls = ids.map(function (id) {
        var p = pOf(id), grp = PMAP[id].isGroup;
        var tag = el("span", { class: "nthview-lane-tag", "aria-hidden": "true" });
        var la = avatar(id); la.classList.add("nthview-lane-ava"); la.appendChild(tag);
        var l = el("div", { class: "nthview-lane" + (grp ? " nthview-lane-group" : ""), title: p.name + (p.role ? " — " + p.role : "") + (grp ? " (" + p.members.length + " parties inside)" : "") }, [la, el("b", { text: p.name })]);
        paint(l, id);
        if (p.role) l.appendChild(el("small", { text: p.role }));
        if (grp) { l.appendChild(memberStack(id, 4)); l.appendChild(el("span", { class: "nthview-inside", text: p.members.length + " inside" })); }
        l.__tag = tag;
        lanes.appendChild(l); return l;
      });
      stageIn.appendChild(lanes);
      track = el("div", { class: "nthview-track", "aria-hidden": "true" });
      var rails = el("div", { class: "nthview-rails" }); rails.style.gridTemplateColumns = cols;
      railEls = ids.map(function (id) { var r = paint(el("div", { class: "nthview-rail" }), id); rails.appendChild(r); return r; });
      track.appendChild(rails);
      [flight, packet, loop, payload].forEach(function (n) { track.appendChild(n); });
      stageIn.appendChild(track);
      stageScroll.scrollLeft = 0;
    }
    function placeWaiting() { waiting.style.top = (stageScroll.offsetTop + track.offsetTop) + "px"; waiting.style.height = track.offsetHeight + "px"; }
    function updateStageOverflow() {
      var over = stageScroll.scrollWidth > stageScroll.clientWidth + 1;
      stageMore.hidden = !over;
      if (over) { stageScroll.setAttribute("tabindex", "0"); stageScroll.setAttribute("role", "region"); stageScroll.setAttribute("aria-label", "Participants, scrollable sideways"); }
      else { stageScroll.removeAttribute("tabindex"); stageScroll.removeAttribute("role"); stageScroll.removeAttribute("aria-label"); }
      return over;
    }
    /* When the lanes are wider than the stage, bring the sender, the receiver and the payload label into view.
       If the two lanes are further apart than the visible width, land on the receiver (where the arrowhead is)
       and keep the label inside the visible part. */
    var lastFlight = null;
    function revealFlight(from, to, animate) {
      lastFlight = [from, to];
      if (!updateStageOverflow()) return;
      var sr = stageScroll.getBoundingClientRect(), sl = stageScroll.scrollLeft, vw = stageScroll.clientWidth;
      function box(n) { var b = n.getBoundingClientRect(); return { l: b.left - sr.left + sl, r: b.right - sr.left + sl }; }
      var lo = Math.min(from, to), hi = Math.max(from, to), a = box(laneEls[lo]), b = box(laneEls[hi]);
      var left = a.l, right = b.r, pl = payload.hidden ? null : box(payload);
      if (pl) { left = Math.min(left, pl.l); right = Math.max(right, pl.r); }
      var target = sl;
      if (left < sl + 4 || right > sl + vw - 4) {
        if (right - left <= vw - 16) target = (left + right) / 2 - vw / 2;
        else { var rc = box(laneEls[to]); target = to >= from ? rc.r + 8 - vw : rc.l - 8; }
        target = Math.max(0, Math.min(stageScroll.scrollWidth - vw, target));
      }
      if (pl && (pl.l < target + 4 || pl.r > target + vw - 4)) {
        var w = pl.r - pl.l, x = Math.max(target + 4, Math.min(target + vw - w - 4, pl.l));
        payload.style.left = (x - track.offsetLeft - stageIn.clientLeft) + "px";
      }
      if (target === sl) return;
      if (stageScroll.scrollTo) stageScroll.scrollTo({ left: target, behavior: animate && !reduceMotion ? "smooth" : "auto" }); else stageScroll.scrollLeft = target;
    }

    var back = el("button", { type: "button", class: "nthview-nav", text: "Back" });
    var next = el("button", { type: "button", class: "nthview-nav nthview-primary", text: "Next" });
    var chipsBox = el("div", { class: "nthview-chips", role: "group", "aria-label": "Steps" });
    var chips = [];
    /* one chip per unit: a collapsed group folds its steps' chips into one */
    var chipsSig = null;
    function buildChips() {
      var us = unitsOf(L, false), sig = L.key + "|" + us.map(function (u) { return u.start + "-" + u.end; }).join(",");
      if (sig === chipsSig) { refreshChips(); return; }
      chipsSig = sig;
      chipsBox.textContent = ""; chips = [];
      us.forEach(function (u) {
        var c;
        if (u.g) {
          var a = u.start + 1, b = u.end + 1;
          c = el("button", { type: "button", class: "nthview-chip nthview-chip-group", text: a + "–" + b, title: "Steps " + a + "–" + b + ": " + u.g.label, "aria-label": "Steps " + a + " to " + b + ": " + u.g.label + " (collapsed group)" });
        } else {
          var i = u.start, s = S[i];
          var inAltSide = FRAG[i].some(function (x) { return x.f.kind === "alt" && x.branch > 0; });
          c = el("button", { type: "button", class: "nthview-chip" + (s.check ? " nthview-has-check" : "") + (inAltSide ? " nthview-alt-chip" : "") + (s.inner ? " nthview-has-inner" : ""), text: String(i + 1), "aria-label": "Step " + (i + 1) + ": " + s.title + (inAltSide ? " (alternative path)" : "") + (s.check ? " (has a check)" : "") + (s.inner ? " (has an inner sequence)" : "") });
          c.title = (i + 1) + ". " + s.title + (s.check ? (state.checks[ckey(L, i)] ? " · check answered" : " · check first") : "") + (s.inner ? " · opens an inner sequence" : "");
        }
        c.addEventListener("click", function () { go(u.start); });
        chipsBox.appendChild(c); chips.push({ node: c, u: u });
      });
      var endChip = el("button", { type: "button", class: "nthview-chip", text: "End", "aria-label": L.depth ? "Recap of this inner sequence" : "Recap of the whole sequence" });
      endChip.addEventListener("click", function () { go(N); });
      endChip.title = L.depth ? "Recap of this inner sequence" : "Recap of the whole sequence";
      chipsBox.appendChild(endChip); chips.push({ node: endChip, u: { start: N, end: N } });
      refreshChips();
    }
    /* read, unread and check states on the chip rail */
    function refreshChips() {
      chips.forEach(function (c) {
        var u = c.u, seen = false;
        if (u.start >= N) seen = L.depth ? !!state.recapSeen[L.key] : state.summarySeen;
        else for (var j = u.start; j <= u.end; j++) if (state.seen[ckey(L, j)]) seen = true;
        c.node.classList.toggle("nthview-seen", seen);
        if (!u.g && u.start < N && S[u.start].check) c.node.classList.toggle("nthview-check-done", !!state.checks[ckey(L, u.start)]);
      });
    }
    function chipNodes() { return chips.map(function (c) { return c.node; }); }
    back.addEventListener("click", function () { if (state.step > 0) go(state.step - 1); });
    next.addEventListener("click", function () {
      if (state.step >= N) return;
      var us = unitsOf(L, false), u = us[unitAt(us, state.step)];
      var ck = ckey(L, u.start);
      if (!u.g && S[u.start].check && !state.checks[ck]) { state.checks[ck] = { skipped: true }; persist(); renderStep(true); status.textContent = "Check skipped. Step " + (u.start + 1) + " shown."; return; }
      go(u.end + 1);
    });
    var controls = el("div", { class: "nthview-controls" }, [back, chipsBox, next]);
    var cardSlot = el("div", { "aria-live": "off" });
    var cmpBox = null, cmpToggle = null;
    if (anyCompare) {
      cmpBox = el("input", { type: "checkbox" });
      cmpBox.addEventListener("change", function () { state.compare = cmpBox.checked; persist(); renderStep(false); });
      cmpToggle = el("label", { class: "nthview-toggle" }, [cmpBox, el("span", { text: data.compareLabel || "Show the comparison" })]);
    }
    var hint = el("p", { class: "nthview-hint", text: (touchFirst ? "Tap Next or a step number to move. " : "Arrow keys step through, Home and End jump" + (innerCount ? ", Escape or Backspace leaves an inner sequence" : "") + ". ") + "Each party keeps its colour everywhere; the colour of an arrow is its channel, and a dashed arrow is a reply." });
    var stepMode = el("section", { class: "nthview-stepmode", "aria-label": "Step by step" }, [stage, controls]);
    if (cmpToggle) { cmpToggle.classList.add("nthview-toggle-row"); stepMode.appendChild(cmpToggle); }
    stepMode.appendChild(cardSlot);
    stepMode.appendChild(hint);
    container.appendChild(stepMode);

    function channelLegend(list) {
      var ul = el("ul", { class: "nthview-legend", "aria-label": "Channels" });
      list.forEach(function (c) {
        var li = el("li", { title: c.description || c.name }, [el("i"), el("span", { text: c.name })]);
        li.style.color = hue(c.color); li.__ch = c.id;
        ul.appendChild(li);
      });
      return ul;
    }
    function kindLegend(list) {
      var ul = el("ul", { class: "nthview-legend nthview-kindleg", "aria-label": "Arrow kinds" });
      list.forEach(function (k) { var li = el("li", {}, [kindSample(k), el("span", { text: KIND_NAMES[k] })]); li.__k = k; ul.appendChild(li); });
      return ul;
    }
    var legCh = null, legK = null;
    function setupLevel() {
      buildCrumbs();
      if (stageKey !== L.key) buildStage();
      sfoot.textContent = "";
      var kinds = {};
      S.forEach(function (s) { kinds[stepKind(s)] = true; });
      legCh = channelLegend(L.depth ? L.channelsUsed : data.channels);
      legK = kindLegend(["sync", "async", "return", "self"].filter(function (k) { return kinds[k]; }));
      sfoot.appendChild(legCh); sfoot.appendChild(el("span", { class: "nthview-sep", "aria-hidden": "true" })); sfoot.appendChild(legK);
      prog.setAttribute("aria-valuemax", String(N));
    }
    function markLegend(s) {
      if (!legCh) return;
      Array.prototype.forEach.call(legCh.childNodes, function (li) { li.classList.toggle("nthview-cur", !!s && li.__ch === s.channel); });
      Array.prototype.forEach.call(legK.childNodes, function (li) { li.classList.toggle("nthview-cur", !!s && li.__k === stepKind(s)); });
      sfoot.classList.toggle("nthview-has-cur", !!s);
    }

    /* ---------- step mode: flight ---------- */
    function laneX(i) { return (i + 0.5) / nLanes * 100; }
    var arriveT = 0;
    function showFlight(s, animate) {
      var k = stepKind(s), color = hue(chColor(s)), idx = S.indexOf(s);
      var a = L.laneOf(s.from), b = L.laneOf(s.to);
      [flight, packet, loop, payload].forEach(function (n) { n.style.color = color; });
      waiting.hidden = true;
      stage.classList.add("nthview-live");
      payload.textContent = "";
      payload.appendChild(el("b", {}, [el("span", { text: numLabel(L, idx) })]));
      payload.appendChild(el("span", { text: s.payload }));
      payload.hidden = false;
      payload.classList.remove("nthview-in");
      if (animate && !reduceMotion) { void payload.offsetWidth; payload.classList.add("nthview-in"); }
      laneEls.forEach(function (l, j) {
        var on = j === a || j === b;
        l.classList.toggle("nthview-on", on); l.classList.toggle("nthview-sender", j === a); l.classList.remove("nthview-arrive");
        l.__tag.textContent = !on ? "" : a === b ? "on its own" : j === a ? "sends" : "receives";
      });
      railEls.forEach(function (r, j) { r.classList.toggle("nthview-on", j === a || j === b); });
      markLegend(s);
      clearTimeout(arriveT);
      if (animate && !reduceMotion && a !== b) arriveT = setTimeout(function () { var l = laneEls[b]; if (l) { l.classList.add("nthview-arrive"); arriveT = setTimeout(function () { l.classList.remove("nthview-arrive"); }, 360); } }, 380);
      if (k === "self" || a === b) {
        flight.hidden = true; packet.classList.remove("nthview-go"); packet.hidden = true;
        loop.hidden = false; loop.textContent = ""; loop.appendChild(headTip("sync"));
        loop.style.left = laneX(a) + "%";
        placeLabel(laneX(a) + 2, true);
        revealFlight(a, a, animate);
        return;
      }
      loop.hidden = true; flight.hidden = false; packet.hidden = false;
      var fwd = b > a, lo = Math.min(a, b), hi = Math.max(a, b);
      flight.className = "nthview-flight nthview-k-" + k + " " + (fwd ? "nthview-fwd" : "nthview-rev");
      flight.textContent = ""; flight.appendChild(headTip(k));
      placeLabel((laneX(lo) + laneX(hi)) / 2, false);
      revealFlight(a, b, animate);
      if (!animate || reduceMotion) {
        flight.style.transition = "none"; packet.style.transition = "none";
        flight.style.left = laneX(lo) + "%"; flight.style.width = (laneX(hi) - laneX(lo)) + "%";
        packet.classList.remove("nthview-go");
        void flight.offsetWidth;
        flight.style.transition = ""; packet.style.transition = "";
        return;
      }
      /* grow from the sender to the receiver in 400 ms; the packet rides the tip, then fades */
      flight.style.transition = "none"; packet.style.transition = "none";
      flight.style.left = laneX(a) + "%"; flight.style.width = "0%";
      packet.style.left = laneX(a) + "%"; packet.classList.add("nthview-go");
      void flight.offsetWidth;
      flight.style.transition = ""; packet.style.transition = "";
      setTimeout(function () {
        flight.style.left = laneX(lo) + "%"; flight.style.width = (laneX(hi) - laneX(lo)) + "%";
        packet.style.left = laneX(b) + "%";
        setTimeout(function () { packet.classList.remove("nthview-go"); }, 430);
      }, 20);
    }
    var lastLabel = null;
    function placeLabel(pct, leftAligned) {
      lastLabel = [pct, leftAligned];
      payload.style.left = "0px"; payload.style.transform = "none";
      var tw = track.clientWidth || 1, w = payload.offsetWidth, x = pct / 100 * tw;
      if (leftAligned) x = x + 40; else x = x - w / 2;
      if (leftAligned && x + w > tw - 4) x = pct / 100 * tw - 12 - w;
      x = Math.max(4, Math.min(tw - w - 4, x));
      payload.style.left = x + "px";
    }
    function hideFlight() {
      lastLabel = null;
      flight.hidden = true; packet.hidden = true; loop.hidden = true; payload.hidden = true;
      stage.classList.remove("nthview-live");
      laneEls.forEach(function (l) { l.classList.remove("nthview-on", "nthview-sender", "nthview-arrive"); l.__tag.textContent = ""; });
      railEls.forEach(function (r) { r.classList.remove("nthview-on"); });
      markLegend(null);
    }

    /* ---------- the step card ---------- */
    function badge(text, c, extra) {
      var b = el("span", { class: "nthview-badge" + (extra ? " " + extra : "") }, [el("i"), el("span", { text: text })]);
      if (c) { b.style.background = tint(c); b.style.color = hue(c); }
      return b;
    }
    function setWaiting(text) { waiting.textContent = ""; waiting.appendChild(el("span", { text: text })); }
    /* holds as a living state panel: one card per party in its colour; new items glow once, given-up items are struck */
    function holdsStrip(i, atEnd, fresh) {
      var st = atEnd ? HOLDS.final : HOLDS.after[i], add = atEnd ? {} : HOLDS.added[i], rem = atEnd ? {} : HOLDS.removed[i];
      var onlyChanged = !atEnd && state.holdsChanged;
      var box = el("section", { class: "nthview-holds" + (fresh ? " nthview-fresh" : ""), "aria-label": atEnd ? "Final holdings" : "What each party holds after this step" });
      var head = el("div", { class: "nthview-holds-head" }, [el("h3", { text: atEnd ? (L.depth ? "Where everyone ends up in this inner sequence" : "Where everyone ends up") : "What each party holds now" })]);
      if (!atEnd) {
        var cb = el("input", { type: "checkbox" });
        cb.checked = state.holdsChanged;
        cb.addEventListener("change", function () { state.holdsChanged = cb.checked; persist(); var f = renderStep(false); var again = cardSlot.querySelector(".nthview-holds input"); if (again) again.focus({ preventScroll: true }); else if (f) f.focus({ preventScroll: true }); });
        head.appendChild(el("label", { class: "nthview-toggle" }, [cb, el("span", { text: "Only what changed in this step" })]));
      }
      box.appendChild(head);
      var grid = el("div", { class: "nthview-hgrid" }), shown = 0;
      holders.forEach(function (id) {
        var items = st[id] || [], a = add[id] || [], r = rem[id] || [], changed = a.length + r.length > 0;
        if (onlyChanged && !changed) return;
        var pills = el("div", { class: "nthview-pills" });
        items.forEach(function (x) {
          var isNew = a.indexOf(x) !== -1;
          if (onlyChanged && !isNew) return;
          var pill = el("span", { class: "nthview-pill" + (isNew ? " nthview-new" : ""), text: x });
          if (isNew) pill.appendChild(el("span", { class: "nthview-sr", text: " (new at this step)" }));
          pills.appendChild(pill);
        });
        r.forEach(function (x) {
          var pill = el("span", { class: "nthview-pill nthview-gone", text: x });
          pill.appendChild(el("span", { class: "nthview-sr", text: " (given up at this step)" }));
          pills.appendChild(pill);
        });
        if (!pills.childNodes.length) pills.appendChild(el("span", { class: "nthview-none", text: "nothing yet" }));
        var h4 = el("h4", { title: nameOf(id) }, [avatar(id, "sm"), el("span", { class: "nthview-hname", text: nameOf(id) })]);
        if (changed) h4.appendChild(el("span", { class: "nthview-hdelta", title: (a.length ? a.length + " new" : "") + (a.length && r.length ? ", " : "") + (r.length ? r.length + " given up" : ""), text: (a.length ? "+" + a.length : "") + (a.length && r.length ? " " : "") + (r.length ? "−" + r.length : "") }));
        grid.appendChild(paint(el("div", { class: "nthview-hcard" + (changed ? " nthview-hchanged" : "") }, [h4, pills]), id));
        shown++;
      });
      if (!shown) grid.appendChild(el("p", { class: "nthview-none", text: "Nothing changes hands at this step." }));
      box.appendChild(grid);
      return box;
    }
    /* the wire, shown exactly; field names, annotations and trailing comments get a quieter tint */
    function wireLines(text) {
      var code = el("code"), lines = String(text).split("\n");
      lines.forEach(function (line, n) {
        if (n) code.appendChild(doc.createTextNode("\n"));
        var m;
        if (/^\s*[→←⇢⇠✓✗]/.test(line)) { code.appendChild(el("span", { class: "nthview-w-n", text: line })); return; }
        var tail = "", tm = /(\s{2,}\([^()]*\)\s*)$/.exec(line);
        if (tm) { tail = tm[1]; line = line.slice(0, line.length - tail.length); }
        if (n === 0 && (m = /^((?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s|HTTP\/[\d.]+\s+\d{3}\b|\d{3}\s)(.*)$/.exec(line))) {
          code.appendChild(el("span", { class: "nthview-w-v", text: m[1] })); code.appendChild(doc.createTextNode(m[2]));
        } else if ((m = /^(\s*[?&]?)([A-Za-z_][\w.\-]*)(\s*:(?=\s|$)\s?|\s*=\s?|\s{2,})(.*)$/.exec(line))) {
          code.appendChild(doc.createTextNode(m[1])); code.appendChild(el("span", { class: "nthview-w-k", text: m[2] })); code.appendChild(doc.createTextNode(m[3] + m[4]));
        } else code.appendChild(doc.createTextNode(line));
        if (tail) code.appendChild(el("span", { class: "nthview-w-c", text: tail }));
      });
      return code;
    }
    function callout(cls, iconName, title, text, role) {
      var body = el("div", {}, [el("h3", { text: title })]), p = el("p"); p.appendChild(rich(text)); body.appendChild(p);
      return el("div", { class: "nthview-callout " + cls, role: role || "note" }, [icon(iconName), body]);
    }
    function stepCard(i, fresh) {
      var s = S[i], c = chColor(s), k = stepKind(s);
      var card = el("article", { class: "nthview-card", "aria-labelledby": "nthview-step-title" });
      var no = el("span", { class: "nthview-stepno", "aria-hidden": "true" }, [el("span", { text: numLabel(L, i) })]);
      no.style.color = hue(c);
      var ht = el("div", { class: "nthview-cardhead-t" }, [el("span", { class: "nthview-idx", text: (L.depth ? "Inner step " + (i + 1) : "Step " + (i + 1)) + " of " + N }), el("h2", { id: "nthview-step-title", tabindex: "-1", text: s.title })]);
      card.appendChild(el("div", { class: "nthview-cardhead" }, [no, ht]));
      var route = el("p", { class: "nthview-route" });
      route.appendChild(who(s.from));
      if (k === "self") route.appendChild(el("span", { text: "works on its own" }));
      else { route.appendChild(el("span", { class: "nthview-arr", "aria-label": k === "return" ? "replies to" : "to", text: k === "return" ? "⇢" : "→" })); route.appendChild(who(s.to)); }
      route.appendChild(el("span", { "aria-hidden": "true", text: "·" }));
      route.appendChild(el("span", {}, [doc.createTextNode("carries "), el("code", { text: s.payload })]));
      card.appendChild(route);
      var meta = el("div", { class: "nthview-meta" }, [badge(C[s.channel].name, c)]);
      var kb = el("span", { class: "nthview-badge nthview-plain" }, [kindSample(k), el("span", { text: KIND_NAMES[k] })]);
      meta.appendChild(kb);
      if (s.note) meta.appendChild(el("span", { class: "nthview-badge nthview-sevb-" + s.note.severity, text: s.note.severity === "danger" ? "Security-critical" : s.note.severity === "warning" ? "Watch out" : "Note" }));
      if (s.inner) meta.appendChild(el("span", { class: "nthview-badge nthview-plain", text: "has an inner sequence" }));
      card.appendChild(meta);
      FRAG[i].forEach(function (x) {
        var f = x.f;
        if (f.kind === "group") return;
        var line = el("p", { class: "nthview-frag nthview-fk-" + f.kind }, [el("b", { text: f.kind })]);
        if (f.label) line.appendChild(el("span", { text: f.label }));
        var cond = f.kind === "alt" ? f.branches[x.branch].condition : f.condition;
        line.appendChild(el("span", { text: "[" + cond + "]" }));
        if (f.kind === "alt") line.appendChild(el("span", { text: "branch " + (x.branch + 1) + " of " + f.branches.length }));
        if (f.kind === "loop") line.appendChild(el("span", { text: "repeats" }));
        if (f.kind === "opt") line.appendChild(el("span", { text: "only sometimes" }));
        card.appendChild(line);
        if (f.kind === "alt" && x.branch > 0 && i === f.branches[x.branch].start) {
          var resume = f.end + 1 < N ? "The main path resumes at step " + (f.end + 2) + ", as if branch 1 had happened." : "The sequence ends after this branch.";
          card.appendChild(el("p", { class: "nthview-altnote", text: "Alternative path, taken only when [" + cond + "]. " + resume }));
        }
      });
      if (s.wire) {
        var dot = el("i"); dot.style.background = hue(c);
        var wh = el("div", { class: "nthview-wirehead", "aria-hidden": "true" }, [dot, el("b", { text: k === "self" ? "What " + nameOf(s.from) + " works out" : "On the wire" }), el("span", { text: k === "self" ? "local" : nameOf(s.from) + " → " + nameOf(s.to) })]);
        var w = el("pre", { class: "nthview-wire", "aria-label": "What travels" }, [wireLines(s.wire)]);
        card.appendChild(el("div", { class: "nthview-wirebox" }, [wh, w]));
      }
      card.appendChild(para("nthview-why", s.why));
      if (s.inner) {
        var IL = innerOf(L, i);
        var ob = el("button", { type: "button", class: "nthview-nav nthview-primary nthview-open-inner", "aria-label": "Open the inner sequence · " + IL.lanes.length + " parties · " + IL.N + " steps" }, [el("span", { text: "Open the inner sequence" }), icon("chev")]);
        ob.addEventListener("click", function () { openInner(i); });
        var lay = icon("layers"); lay.setAttribute("class", "nthview-layers");
        card.appendChild(el("div", { class: "nthview-innerbox" }, [lay, el("div", {}, [el("p", {}, [el("b", { text: "There is more inside this step" }), doc.createTextNode(IL.N + " steps between " + IL.lanes.length + " parties show how it is carried out. Open them, then come back here.")])]), ob]));
      }
      if (s.compare && state.compare) card.appendChild(callout("nthview-compare", "history", s.compare.label, s.compare.text));
      if (s.note) card.appendChild(callout("nthview-note nthview-sev-" + s.note.severity, s.note.severity, s.note.severity === "danger" ? "Security-critical" : s.note.severity === "warning" ? "Watch out" : "Good to know", s.note.text));
      if (s.detail) {
        var det = el("details", { class: "nthview-details" });
        if (state.details) det.setAttribute("open", "");
        det.appendChild(el("summary", {}, [el("span", { text: "What's involved in this step" }), el("small", { text: s.detail.length + " " + (s.detail.length === 1 ? "note" : "notes") })]));
        var dl = el("dl", { class: "nthview-drows" });
        s.detail.forEach(function (d) { var dd = el("dd"); dd.appendChild(rich(d.text)); dl.appendChild(el("div", { class: "nthview-drow" }, [el("dt", { text: d.label }), dd])); });
        det.appendChild(dl);
        det.addEventListener("toggle", function () { state.details = det.open; persist(); });
        card.appendChild(det);
      }
      if (holders.length) card.appendChild(holdsStrip(i, false, fresh));
      return card;
    }

    /* ---------- groups in step mode: a summary card, or a header with Collapse ---------- */
    function groupRange(Lv, f) { return numLabel(Lv, f.start) + "–" + numLabel(Lv, f.end); }
    function groupCard(u) {
      var n = u.end - u.start + 1, k = gkey(L, u.gi);
      var box = el("section", { class: "nthview-gcard", tabindex: "0", "aria-labelledby": "nthview-step-title" });
      box.appendChild(el("p", { class: "nthview-gcard-label" }, [icon("folder"), el("span", { text: "Group · steps " + groupRange(L, u.g) + " · " + n + " steps folded" })]));
      box.appendChild(el("h2", { id: "nthview-step-title", text: u.g.label }));
      if (u.g.summary) box.appendChild(para("nthview-why", u.g.summary));
      var route = el("p", { class: "nthview-gparties" }, [el("span", { class: "nthview-idx", text: "Between" })]);
      partiesOf(L, u.start, u.end).forEach(function (id) { route.appendChild(who(id)); });
      box.appendChild(route);
      var ex = el("button", { type: "button", class: "nthview-nav nthview-primary" }, [el("span", { text: "Expand the " + n + " steps" }), icon("chev")]);
      function expand() {
        state.groups[k] = true; D = null; persist();
        var f = renderStep(true);
        status.textContent = u.g.label + " expanded: " + n + " steps.";
        if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 30);
      }
      ex.addEventListener("click", expand);
      box.addEventListener("keydown", function (e) { if (e.key === "Enter" && e.target === box) { e.preventDefault(); expand(); } });
      box.appendChild(el("div", { class: "nthview-check-actions" }, [ex, el("p", { class: "nthview-hint", text: "Folded so the main story stays in view. Expand to go one by one, or press Next to move past the group." })]));
      return box;
    }
    function groupHead(x, i) {
      var f = x.f, n = f.end - f.start + 1;
      var col = el("button", { type: "button", class: "nthview-ghost", text: "Collapse", "aria-label": "Collapse the group " + f.label });
      col.addEventListener("click", function () {
        state.groups[gkey(L, x.i)] = false; state.step = f.start; D = null; persist();
        var fo = renderStep(true);
        status.textContent = f.label + " collapsed.";
        if (fo) setTimeout(function () { fo.focus({ preventScroll: true }); }, 30);
      });
      return el("div", { class: "nthview-ghead", role: "group", "aria-label": "Group " + f.label }, [el("b", { text: "Group" }), el("span", { text: f.label }), el("span", { class: "nthview-ghead-n", text: "step " + (i - f.start + 1) + " of " + n + " · steps " + groupRange(L, f) }), col]);
    }

    /* ---------- checks: learning first, a wrong pick explains and reveals ---------- */
    var CHEER = ["Nice, you called it.", "Spot on.", "Exactly right.", "Yes, that is the one."];
    var NUDGE = ["Not quite, and that is how it sticks.", "Close. Here is the twist.", "Good guess. Here is what really happens."];
    function checkPanel(i, revealing) {
      var s = S[i], ck = s.check, ans = state.checks[ckey(L, i)];
      var box = el("section", { class: "nthview-check" + (revealing ? " nthview-revealing" : ""), "aria-label": "Check before step " + numLabel(L, i) });
      box.appendChild(el("div", { class: "nthview-check-top" }, [el("span", { class: "nthview-check-ico", "aria-hidden": "true" }, [icon("predict")]), el("p", { class: "nthview-check-label", text: ans ? "Your prediction · step " + numLabel(L, i) : "Predict · before step " + numLabel(L, i) })]));
      var h = el("h2", { tabindex: "-1" }); h.appendChild(rich(ck.type === "who" ? (ck.prompt || "Who sends the next message?") : ck.prompt)); box.appendChild(h);
      var opts = el("ul", { class: "nthview-opts" + (ck.type === "who" ? " nthview-who" : "") });
      var correctIdx = ck.type === "who" ? L.laneOf(ck.answer) : ck.options.map(function (o) { return !!o.correct; }).indexOf(true);
      var list = ck.type === "who" ? L.lanes : ck.options;
      list.forEach(function (o, j) {
        var b = el("button", { type: "button", class: "nthview-opt" });
        if (ck.type === "who") {
          b.appendChild(avatar(o, "md"));
          var nm = el("span", { class: "nthview-opt-n" }, [el("span", { text: nameOf(o) })]);
          if (pOf(o).role) nm.appendChild(el("small", { text: pOf(o).role }));
          b.appendChild(nm);
        } else { b.appendChild(el("span", { class: "nthview-key", "aria-hidden": "true", text: LETTERS[j] })); var t = el("span"); t.appendChild(rich(o.text)); b.appendChild(t); }
        function tag(text, ok) { return el("span", { class: "nthview-opt-tag" }, [icon(ok ? "check" : "cross"), el("span", { text: text })]); }
        if (ans && !ans.skipped) {
          if (j === correctIdx) { b.classList.add("nthview-right"); b.appendChild(tag(j === ans.picked ? "Your pick, right" : "Right answer", true)); }
          else if (j === ans.picked) { b.classList.add("nthview-wrong"); b.appendChild(tag("Your pick", false)); }
          else b.classList.add("nthview-dim");
        } else if (ans && ans.skipped) { if (j === correctIdx) { b.classList.add("nthview-right"); b.appendChild(tag("Right answer", true)); } else b.classList.add("nthview-dim"); }
        if (ans) b.setAttribute("aria-disabled", "true");
        else b.addEventListener("click", function () { answer(i, j, j === correctIdx); });
        opts.appendChild(el("li", {}, [b]));
      });
      box.appendChild(opts);
      if (ans) {
        var fb = el("div", { class: "nthview-fb" + (ans.correct ? "" : " nthview-no"), role: "status" });
        var right = ck.type === "who" ? nameOf(L.lanes[correctIdx]) : ck.options[correctIdx].text;
        var line = ans.skipped ? "Here is the answer." : ans.correct ? CHEER[i % CHEER.length] : NUDGE[i % NUDGE.length];
        fb.appendChild(el("h3", { text: line }));
        if (!ans.correct) fb.appendChild(para("", "**The answer:** " + right));
        if (ck.type === "choice") {
          if (!ans.skipped && !ans.correct) fb.appendChild(para("", "**Your pick:** " + ck.options[ans.picked].why));
          fb.appendChild(para("", (ans.correct ? "" : "**Why the answer is right:** ") + ck.options[correctIdx].why));
        } else {
          if (!ans.skipped && !ans.correct) fb.appendChild(para("", nameOf(L.lanes[ans.picked]) + " does not send this one; " + nameOf(L.lanes[correctIdx]) + " does."));
          if (ck.why) fb.appendChild(para("", ck.why));
        }
        box.appendChild(fb);
      } else {
        var skip = el("button", { type: "button", class: "nthview-ghost", text: "Just show me the step" });
        skip.addEventListener("click", function () { state.checks[ckey(L, i)] = { skipped: true }; persist(); renderStep(true); });
        box.appendChild(el("div", { class: "nthview-check-actions" }, [el("p", { class: "nthview-hint", text: "Take a guess. A wrong one is fine: you get the explanation and the step straight away." }), skip]));
      }
      return { node: box, focus: h };
    }
    function answer(i, j, ok) {
      state.checks[ckey(L, i)] = { picked: j, correct: ok };
      persist();
      status.textContent = ok ? "Right." : "Not quite; the answer and the step are shown.";
      renderStep(true, true, true);
    }

    /* ---------- recap: the steps of this level, inner sequences indented under their step ---------- */
    function recapList(Lv, nested) {
      var ol = el("ol", { class: "nthview-recap-list" + (nested ? " nthview-recap-inner" : "") });
      var gs = groupFrags(Lv);
      Lv.S.forEach(function (s, i) {
        gs.filter(function (x) { return x.f.start === i; }).sort(outerFirst).forEach(function (x) {
          ol.appendChild(el("li", { class: "nthview-recap-glabel", text: "Group: " + x.f.label + " · " + (x.f.end - x.f.start + 1) + " steps" }));
        });
        var k = stepKind(s), route = el("span", { class: "nthview-recap-route" });
        route.appendChild(avatar(s.from, "sm")); route.appendChild(el("span", { text: nameOf(s.from) }));
        if (k === "self") route.appendChild(el("span", { text: "on its own ·" }));
        else { route.appendChild(el("span", { text: k === "return" ? "⇢" : "→" })); route.appendChild(avatar(s.to, "sm")); route.appendChild(el("span", { text: nameOf(s.to) + " ·" })); }
        route.appendChild(el("code", { text: s.payload }));
        if (Lv.FRAG[i].some(function (x) { return x.f.kind === "alt" && x.branch > 0; })) route.appendChild(el("span", { class: "nthview-recap-alt", text: "alternative" }));
        var nb = el("span", { class: "nthview-recap-n" }, [el("span", { text: numLabel(Lv, i) })]); nb.style.color = hue(Lv.C[s.channel].color);
        var b = el("button", { type: "button", "aria-label": "Step " + numLabel(Lv, i) + ": " + s.title }, [nb, el("span", {}, [el("span", { class: "nthview-recap-t", text: s.title }), route])]);
        b.addEventListener("click", function () { gotoLevel(Lv.path, i, { reveal: true }); });
        var inGroup = gs.some(function (x) { return i >= x.f.start && i <= x.f.end; });
        var li = el("li", inGroup ? { class: "nthview-recap-ingroup" } : {}, [b]);
        if (s.inner) {
          var IL = innerOf(Lv, i);
          li.appendChild(recapList(IL, true));
          var rb = el("button", { type: "button", class: "nthview-ghost nthview-recap-open", text: "Recap of the inner sequence of step " + numLabel(Lv, i) });
          rb.addEventListener("click", function () { gotoLevel(IL.path, IL.N); });
          li.appendChild(rb);
        }
        ol.appendChild(li);
      });
      return ol;
    }
    function recap() {
      var inner = L.depth > 0;
      var box = el("section", { class: "nthview-recap", "aria-labelledby": "nthview-recap-title" });
      box.appendChild(el("h2", { id: "nthview-recap-title", tabindex: "-1", text: inner ? "Inside step " + numLabel(L.parent, L.parentIdx) + ": " + parentStep(L).title : "The whole sequence" }));
      var nestedHere = S.some(function (s) { return !!s.inner; });
      box.appendChild(el("p", { class: "nthview-sub", text: "Select a line to revisit that step" + (nestedHere ? "; indented lines are inner sequences." : ".") }));
      var checked = [], nInner = 0;
      (function walk(Lv) { Lv.S.forEach(function (s, i) { if (s.check) checked.push({ Lv: Lv, i: i }); if (s.inner) { nInner++; walk(innerOf(Lv, i)); } }); })(L);
      var right = 0, wrong = 0, skipped = 0, open = 0;
      checked.forEach(function (c) { var a = state.checks[ckey(c.Lv, c.i)]; if (!a) open++; else if (a.skipped) skipped++; else if (a.correct) right++; else wrong++; });
      function stat(n, t) { return el("div", { class: "nthview-stat" }, [el("b", { text: String(n) }), el("span", { text: t })]); }
      var stats = el("div", { class: "nthview-stats" }, [stat(N, N === 1 ? "step" : "steps"), stat(L.lanes.length, "parties")]);
      if (nInner) stats.appendChild(stat(nInner, nInner === 1 ? "inner sequence" : "inner sequences"));
      if (checked.length) stats.appendChild(stat(right + " / " + checked.length, "predicted right"));
      box.appendChild(stats);
      box.appendChild(recapList(L, false));
      if (holders.length) box.appendChild(holdsStrip(N - 1, true));
      if (checked.length) {
        box.appendChild(el("h3", { text: "Your checks" }));
        box.appendChild(el("p", { text: right + " of " + checked.length + " right first time" + (wrong ? ", " + wrong + " learned on the way" : "") + (skipped ? ", " + skipped + " skipped" : "") + (open ? ", " + open + " not reached" : "") + ". Nothing here is a score; the checks are there to make you predict." }));
        var cl = el("ul", { class: "nthview-recap-checks" });
        checked.forEach(function (c) {
          var s = c.Lv.S[c.i], a = state.checks[ckey(c.Lv, c.i)], li = el("li");
          li.appendChild(el("span", { text: "Step " + numLabel(c.Lv, c.i) + ": " }));
          li.appendChild(rich(s.check.type === "who" ? (s.check.prompt || "Who sends the next message?") : s.check.prompt));
          li.appendChild(doc.createTextNode(" "));
          li.appendChild(el("span", { class: !a || a.skipped ? "" : a.correct ? "nthview-ok-t" : "nthview-no-t", text: !a ? "(not reached)" : a.skipped ? "(skipped)" : a.correct ? "Right" : "Not quite" }));
          cl.appendChild(li);
        });
        box.appendChild(cl);
      }
      if (!inner) (data.closing || []).forEach(function (t) { box.appendChild(para("", t)); });
      var toDiag = el("button", { type: "button", class: "nthview-nav" + (inner ? "" : " nthview-primary"), text: "See the full diagram" });
      toDiag.addEventListener("click", function () { setMode("diagram", true); });
      var acts = el("div", { class: "nthview-actions" });
      if (inner) {
        var up = el("button", { type: "button", class: "nthview-nav nthview-primary", text: "Back to step " + numLabel(L.parent, L.parentIdx) + ": " + clip(parentStep(L).title, 48) });
        up.addEventListener("click", upLevel);
        acts.appendChild(up); acts.appendChild(toDiag);
      } else {
        var again = el("button", { type: "button", class: "nthview-nav", text: "Start again" });
        again.addEventListener("click", function () {
          clearState(key);
          state.done = false; state.checks = {}; state.groups = {}; state.summarySeen = false; state.recapSeen = {}; state.seen = {}; state.holdsChanged = false; state.compare = false; state.details = false; state.zoom = "fit"; state.expand = false;
          if (cmpBox) cmpBox.checked = false;
          D = null;
          gotoLevel([], 0);
        });
        acts.appendChild(toDiag); acts.appendChild(again);
      }
      box.appendChild(acts);
      return box;
    }

    /* ---------- step mode render ---------- */
    function renderStep(animate, keepCheckFocus, revealing) {
      if (stageKey !== L.key) setupLevel();
      var us = unitsOf(L, false), u = null;
      if (state.step < N) { u = us[unitAt(us, state.step)]; state.step = u.start; }
      var i = state.step;
      if (i < N) {
        var sk = ckey(L, i), showsStep = !!u.g || !S[i].check || !!state.checks[sk];
        if (showsStep && !state.seen[sk]) { state.seen[sk] = true; persist(); }
      }
      closePop();
      updateStageOverflow();
      buildChips();
      chips.forEach(function (c) { if (c.u.start === i) c.node.setAttribute("aria-current", "step"); else c.node.removeAttribute("aria-current"); });
      setMeter(i);
      back.disabled = i === 0;
      next.disabled = i >= N;
      cardSlot.textContent = "";
      var focusEl = null;
      if (i >= N) {
        hideFlight(); waiting.hidden = true;
        next.textContent = "Next";
        var r = recap(); cardSlot.appendChild(r); focusEl = r.querySelector("h2");
        if (cmpToggle) cmpToggle.hidden = true;
        status.textContent = L.depth ? "Recap of the inner sequence of step " + numLabel(L.parent, L.parentIdx) + "." : "Recap of the whole sequence.";
        return focusEl;
      }
      if (cmpToggle) { cmpToggle.hidden = false; cmpBox.checked = state.compare; }
      groupFrags(L).filter(function (x) { return i >= x.f.start && i <= x.f.end && isOpen(L, x.i) && !(u.g && x.f === u.g); }).sort(outerFirst).forEach(function (x) { cardSlot.appendChild(groupHead(x, i)); });
      if (u.g) {
        next.textContent = u.end >= N - 1 ? "Recap" : "Next";
        hideFlight();
        var inv = partiesOf(L, u.start, u.end);
        inv.forEach(function (id) { var l = laneEls[L.LI[id]]; if (l) l.classList.add("nthview-on"); });
        setWaiting("Steps " + groupRange(L, u.g) + " are folded into one group. Expand it to see each message."); stage.classList.add("nthview-live");
        waiting.hidden = false; placeWaiting();
        var gc = groupCard(u); if (animate) gc.classList.add("nthview-fade"); cardSlot.appendChild(gc);
        status.textContent = "Steps " + groupRange(L, u.g) + ": " + u.g.label + ", a collapsed group.";
        return gc;
      }
      var s = S[i], ck = ckey(L, i);
      var pending = s.check && !state.checks[ck];
      next.textContent = pending ? "Show step" : i === N - 1 ? "Recap" : "Next";
      if (s.check) {
        var cp = checkPanel(i, revealing); cardSlot.appendChild(cp.node);
        if (pending || keepCheckFocus) focusEl = cp.focus;
      }
      if (pending) { hideFlight(); setWaiting("Predict first: answer the check below to see this message."); waiting.hidden = false; placeWaiting(); status.textContent = "Step " + numLabel(L, i) + " of " + N + ": a check comes first."; return focusEl; }
      showFlight(s, animate);
      var card = stepCard(i, animate && !reduceMotion);
      if (animate) { card.classList.add("nthview-fade"); if (s.from !== s.to && !revealing) card.style.animationDelay = "160ms"; }
      cardSlot.appendChild(card);
      var wire = card.querySelector(".nthview-wire");
      if (wire && wire.scrollWidth > wire.clientWidth + 1) { wire.setAttribute("tabindex", "0"); wire.setAttribute("role", "region"); }
      if (!focusEl) focusEl = card.querySelector("h2");
      if (!keepCheckFocus) status.textContent = "Step " + numLabel(L, i) + " of " + N + ": " + s.title;
      return focusEl;
    }

    /* the end is the closing summary after the last message of the top-level exchange (§5.5 rule 8) */
    function markSeen() { if (state.step >= N) { if (L.depth) state.recapSeen[L.key] = true; else { state.summarySeen = true; state.done = true; } } }
    function go(i, opts) {
      opts = opts || {};
      i = Math.max(0, Math.min(N, i));
      if (opts.reveal && i < N) reveal(L, i);
      if (i < N) { var us = unitsOf(L, false); i = us[unitAt(us, i)].start; }
      var moved = i !== state.step;
      state.step = i;
      markSeen();
      persist();
      if (state.mode === "diagram") { highlightDiagram(true); return; }
      var f = renderStep(moved || opts.animate);
      if (f && opts.focus !== false && moved) setTimeout(function () { if (!stepMode.contains(doc.activeElement) || doc.activeElement === doc.body || chipNodes().indexOf(doc.activeElement) === -1) f.focus({ preventScroll: true }); }, 30);
    }

    /* ---------- moving between levels ---------- */
    function gotoLevel(path, step, opts) {
      opts = opts || {};
      state.path = path.slice(); useLevel();
      state.step = Math.max(0, Math.min(N, step));
      if (opts.reveal && state.step < N) reveal(L, state.step);
      markSeen();
      setupLevel();
      if (state.mode === "diagram") {
        persist();
        buildDiagram(); highlightDiagram(true);
        focusDiagram();
      } else {
        var f = renderStep(true);
        persist();
        var top = (crumbs.hidden ? stage : crumbs).getBoundingClientRect().top - bar.offsetHeight;
        if (top < 0) root.scrollTo(0, Math.max(0, (root.pageYOffset || 0) + top - 8));
        if (f) setTimeout(function () { f.focus({ preventScroll: true }); }, 30);
      }
      status.textContent = L.depth ? "Inside step " + numLabel(L.parent, L.parentIdx) + ": " + parentStep(L).title + ". " + N + " steps." : "Main sequence.";
    }
    function openInner(i) { gotoLevel(state.path.concat([i]), 0); }
    function upLevel() {
      if (!state.path.length) return false;
      var p = state.path.slice(), idx = p.pop();
      gotoLevel(p, idx, { reveal: true });
      return true;
    }

    /* ---------- full diagram ---------- */
    var zoomOut = el("button", { type: "button", class: "nthview-tbtn", "aria-label": "Zoom out", text: "−" });
    var zoomIn = el("button", { type: "button", class: "nthview-tbtn", "aria-label": "Zoom in", text: "+" });
    var zoomFit = el("button", { type: "button", class: "nthview-tbtn", text: "Fit" });
    var zoomVal = el("span", { class: "nthview-zoomv", "aria-live": "polite" });
    var zoomG = el("div", { class: "nthview-zoomg", role: "group", "aria-label": "Zoom" }, [zoomOut, zoomVal, zoomIn, zoomFit]);
    var bExpand = el("button", { type: "button", class: "nthview-tbtn nthview-expand", "aria-pressed": "false", text: "Expand all", title: "Draw every inner sequence and group in place" });
    bExpand.addEventListener("click", function () {
      state.expand = !state.expand; persist();
      buildDiagram(); highlightDiagram(true);
      status.textContent = state.expand ? "Every inner sequence and group is drawn in place." : "Inner sequences and groups are folded again.";
    });
    var toStep = el("button", { type: "button", class: "nthview-tbtn nthview-tostep" });
    toStep.addEventListener("click", function () { setMode("step", true); });
    var dpanel = el("div", { class: "nthview-dpanel", tabindex: "0", role: "region", "aria-label": "Sequence diagram, scrollable" });
    /* "where am I" on long diagrams: a rail with one tick per step and the visible window */
    var mini = el("div", { class: "nthview-mini", "aria-hidden": "true", title: "Where you are in the diagram: select to jump" });
    var miniWin = el("b"), miniTicks = [];
    var dtip = el("div", { class: "nthview-dtip", hidden: "", "aria-hidden": "true" });
    var dwrap = el("div", { class: "nthview-dwrap" }, [dpanel, mini, dtip]);
    var dtools = el("div", { class: "nthview-dtools" }, [zoomG]);
    if (anyFold) dtools.appendChild(bExpand);
    dtools.appendChild(el("span", { class: "nthview-spacer" }));
    dtools.appendChild(toStep);
    var dChannels = el("div");
    var diagMode = el("section", { class: "nthview-diagmode", "aria-label": "Full diagram", hidden: "" }, [dtools, dwrap, diagramLegend()]);
    container.appendChild(diagMode);
    var D = null; /* { svg, w, h, units[], key, expand } */

    function diagramLegend() {
      var box = el("div", { class: "nthview-dlegend" });
      box.appendChild(dChannels);
      var kinds = el("ul", { class: "nthview-kinds", "aria-label": "Arrow kinds" });
      [["sync", "call: the sender waits"], ["async", "async message: no waiting"], ["return", "reply"], ["self", "on its own"]].forEach(function (k) {
        kinds.appendChild(el("li", {}, [kindSample(k[0]), el("span", { text: k[1] })]));
      });
      box.appendChild(kinds);
      box.appendChild(el("p", { text: "Each party keeps its colour: its avatar, its dotted lifeline and the bars on it, which show when it is busy. Arrow colours are channels. Frames mark alt (one branch or another), opt (only sometimes) and loop (repeats). Shaded bands are trust zones. The highlighted band is the current step; select any arrow to open that step." }));
      if (anyFold) box.appendChild(el("p", { text: "A frame marked ref, with a chevron, is a step with an inner sequence: select it to open that sequence's own diagram. A stacked frame marked group folds a run of steps; select it to unfold them. Expand all draws every inner sequence and group in place, with the parties inside a group in a shaded band under its name." }));
      box.appendChild(el("p", { text: "Zoom with the − and + buttons, a pinch on a touch screen, or Ctrl and the scroll wheel; drag or scroll to move around." }));
      return box;
    }

    function wrapText(text, maxChars, maxLines) {
      var words = String(text).replace(/\*\*|`/g, "").replace(/\(\(([^()|]*)\|?[^()]*\)\)/g, "$1").split(/\s+/), lines = [], cur = "";
      words.forEach(function (w) {
        if (!w) return;
        if ((cur + " " + w).trim().length > maxChars && cur) { lines.push(cur); cur = w; } else cur = (cur + " " + w).trim();
      });
      if (cur) lines.push(cur);
      if (lines.length > maxLines) { lines = lines.slice(0, maxLines); lines[maxLines - 1] = lines[maxLines - 1].replace(/\s*\S*$/, "") + " …"; }
      return lines;
    }

    /* The diagram of the current level. Collapsed: a step with an inner sequence is a ref frame and a
       collapsed group is one frame. Expand all: inner steps are drawn inside their ref frame, extra parties
       get lifelines (members in a band under their group), groups are unfolded, to any depth. */
    function buildDiagram() {
      var EXP = state.expand, B = L;
      var COL = 184, PADX = 28, HEADH = 74, CW = 7.25;
      var set = {};
      B.lanes.forEach(function (id) { set[id] = true; });
      if (EXP) (function walkIds(Lv, top) {
        if (!top) Lv.own.forEach(function (p) { set[p.id] = true; });
        Lv.S.forEach(function (s, i) { set[s.from] = true; set[s.to] = true; if (s.inner) walkIds(innerOf(Lv, i), false); });
      })(B, true);
      var ids = Object.keys(set).sort(byRank), nP = ids.length, CI = {};
      ids.forEach(function (id, c) { CI[id] = c; });
      function colOf(id) { if (CI[id] !== undefined) return CI[id]; var g = PMAP[id].group; return g && CI[g] !== undefined ? CI[g] : 0; }
      function cx(c) { return PADX + COL * (c + 0.5); }
      var W = PADX * 2 + nP * COL;
      var zrun = zoneRuns(ids), hasZones = zrun.some(function (r) { return r.zone; });
      var bands = groupBands(ids), bandRows = bands.reduce(function (m, b) { return Math.max(m, b.depth + 1); }, 0);
      var ZONEH = hasZones ? 24 : 0, BANDH = bandRows * 22, HEADY = ZONEH + 10 + BANDH;
      var y = HEADY + HEADH + 22;
      var rows = [], boxes = [], frames = [], stack = [], units = [], usedCh = {};
      function relNum(Lv, i) { return Lv.path.slice(B.path.length).map(function (x) { return x + 1; }).concat([i + 1]).join("."); }
      function touch(x0, x1) { var t = stack[stack.length - 1]; if (t) { t.lo = Math.min(t.lo, x0); t.hi = Math.max(t.hi, x1); } }
      function openFrame(fr) { fr.y0 = y; fr.lo = Infinity; fr.hi = -Infinity; fr.guards = []; stack.push(fr); frames.push(fr); }
      function closeFrame() {
        var fr = stack.pop();
        y += 10; fr.y1 = y;
        if (fr.lo === Infinity) { fr.lo = cx(0); fr.hi = cx(0); }
        fr.x0 = fr.lo - 14; fr.x1 = fr.hi + 14;
        var need = 260;
        fr.guards.forEach(function (g) { need = Math.max(need, g.text.length * 6.3 + 40); });
        if (fr.tag) need = Math.max(need, fr.tag.length * 7 + 60 + (fr.type === "inner" ? 170 : 0));
        if (fr.x1 - fr.x0 < need) { var grow = (need - (fr.x1 - fr.x0)) / 2; fr.x0 -= grow; fr.x1 += grow; }
        if (fr.x0 < 4) { fr.x1 += 4 - fr.x0; fr.x0 = 4; }
        touch(fr.x0, fr.x1);
      }
      function wideBox(lo, hi, min) {
        if (hi - lo < min) { var g = (min - (hi - lo)) / 2; lo -= g; hi += g; }
        if (lo < 8) { hi += 8 - lo; lo = 8; }
        return [lo, hi];
      }
      function stepRow(Lv, i, depth) {
        var s = Lv.S[i], a = colOf(s.from), b = colOf(s.to), k = stepKind(s);
        var selfish = k === "self" || a === b, num = relNum(Lv, i);
        var nb = Math.max(15, num.length * 6.4 + 8), span = Math.abs(cx(b) - cx(a));
        var txt = clip(s.payload, selfish ? 40 : Math.max(26, Math.floor((span - 40) / CW)));
        var w = txt.length * CW + nb + 15 + (s.inner ? 20 : 0);
        var lx = selfish ? cx(a) + 50 : Math.max(4, (cx(a) + cx(b)) / 2 - w / 2);
        var row = { Lv: Lv, i: i, s: s, a: a, b: b, k: k, selfish: selfish, num: num, nb: nb, txt: txt, w: w, lx: lx, col: hue(Lv.C[s.channel].color), tint: tint(Lv.C[s.channel].color) };
        usedCh[s.channel] = Lv.C[s.channel];
        row.y = y; row.h = selfish ? 66 : 52; row.arrowY = y + (selfish ? 24 : 34);
        row.x0 = Math.min(cx(a), cx(b), lx) - 14; row.x1 = Math.max(cx(a), cx(b) + (selfish ? 46 : 0), lx + w) + 6;
        y += row.h;
        if (s.note) {
          var lines = wrapText(s.note.text, 52, 5), nw = 344;
          if (!selfish) nw = Math.max(nw, span + 40);
          var nx = selfish ? cx(a) - 24 : (cx(a) + cx(b)) / 2 - nw / 2;
          nx = Math.max(8, nx);
          row.note = { y: y + 2, lines: lines, h: lines.length * 15 + 14, x: nx, w: nw };
          row.x0 = Math.min(row.x0, nx); row.x1 = Math.max(row.x1, nx + nw);
          y += row.note.h + 10;
        }
        rows.push(row); touch(row.x0, row.x1);
        if (Lv === B) units.push({ start: i, end: i, row: row, xm: selfish ? cx(a) : (cx(a) + cx(b)) / 2 });
        if (s.inner) {
          var IL = innerOf(Lv, i);
          if (EXP) {
            var fr = { type: "inner", Lv: IL, num: num, tag: "ref  " + num + "  " + clip(s.title, 44) };
            openFrame(fr); y += 30;
            walk(IL);
            closeFrame(); y += 6;
          } else {
            var xs = wideBox(Math.min(cx(a), cx(b)) - 60, Math.max(cx(a), cx(b)) + 60 + (selfish ? 40 : 0), 330);
            var bx = { type: "ref", Lv: Lv, i: i, IL: IL, num: num, x0: xs[0], x1: xs[1], y: y + 2, h: 46 };
            boxes.push(bx); touch(bx.x0, bx.x1); y += 56;
          }
        }
      }
      function groupBox(Lv, u) {
        var cs = [];
        for (var j = u.start; j <= u.end; j++) cs.push(colOf(Lv.S[j].from), colOf(Lv.S[j].to));
        var xs = wideBox(cx(Math.min.apply(null, cs)) - 50, cx(Math.max.apply(null, cs)) + 50, 330);
        var bx = { type: "group", Lv: Lv, u: u, x0: xs[0], x1: xs[1], y: y + 4, h: 50, range: relNum(Lv, u.start) + "–" + relNum(Lv, u.end) };
        boxes.push(bx); touch(bx.x0, bx.x1); y += 62;
        if (Lv === B) units.push({ start: u.start, end: u.end, box: bx, xm: (bx.x0 + bx.x1) / 2 });
      }
      function walk(Lv) {
        var frs = (Lv.seq.fragments || []).map(function (f, fi) { return { f: f, i: fi }; });
        function inside(a, b) { return a !== b && a.f.start >= b.f.start && a.f.end <= b.f.end && (a.f.start !== b.f.start || a.f.end !== b.f.end || a.i > b.i); }
        function levels(x) { var m = 0; frs.forEach(function (o) { if (inside(o, x)) m = Math.max(m, 1 + levels(o)); }); return m; }
        frs.forEach(function (x) { x.lv = levels(x); });
        var us = unitsOf(Lv, EXP);
        var folded = us.filter(function (u) { return u.g; }).map(function (u) { return frs[u.gi]; });
        var drawn = frs.filter(function (x) { return folded.indexOf(x) === -1 && !folded.some(function (g) { return inside(x, g); }); });
        us.forEach(function (u) {
          var i = u.start;
          drawn.forEach(function (x) {
            if (x.f.kind !== "alt" || !x.frame) return;
            x.f.branches.forEach(function (br, k) { if (k > 0 && br.start === i) { x.frame.guards.push({ y: y + 4, text: br.condition, divider: y - 4 }); y += 26; } });
          });
          drawn.filter(function (x) { return x.f.start === i; }).sort(function (a, b) { return b.lv - a.lv || a.i - b.i; }).forEach(function (x) {
            var f = x.f, fr = { type: f.kind === "group" ? "group" : "frag", f: f, Lv: Lv, fi: x.i, tag: f.kind + (f.label ? "  " + f.label : "") };
            x.frame = fr;
            openFrame(fr); y += 24;
            if (f.kind !== "group") { fr.guards.push({ y: y, text: f.kind === "alt" ? f.branches[0].condition : f.condition }); y += 16; }
            else y += 4;
          });
          if (u.g) groupBox(Lv, u); else stepRow(Lv, i);
          drawn.filter(function (x) { return x.f.end === u.end; }).forEach(function () { closeFrame(); });
        });
      }
      walk(B);
      var right = W;
      rows.forEach(function (r) { right = Math.max(right, r.x1 + 8); });
      boxes.concat(frames).forEach(function (b) { right = Math.max(right, b.x1 + 8); });
      W = right;
      var bottomHeads = rows.length + boxes.length > 8;
      var lifeEnd = y + 14;
      var H = lifeEnd + (bottomHeads ? HEADH + 16 : 12);

      var where = B.depth ? "inner sequence of step " + numLabel(B.parent, B.parentIdx) : "sequence";
      var svgEl = sv("svg", { class: "nthview-dsvg", viewBox: "0 0 " + W + " " + H, role: "group", "aria-label": "Diagram of the " + where + ": " + B.N + " steps between " + B.lanes.length + " parties" + (EXP ? ", every inner sequence and group drawn in place" : "") });
      svgEl.appendChild(sv("title", { text: (B.depth ? "Step " + numLabel(B.parent, B.parentIdx) + ", " + parentStep(B).title : data.title) + ": sequence diagram" }));
      var gBack = sv("g"), gZones = sv("g", { "aria-hidden": "true" }), gBand = sv("g", { "aria-hidden": "true" }), gBands = sv("g", { "aria-hidden": "true" }), gFrFill = sv("g", { "aria-hidden": "true" }), gLife = sv("g", { "aria-hidden": "true" }), gFr = sv("g", { "aria-hidden": "true" }), gAct = sv("g", { "aria-hidden": "true" }), gFrTop = sv("g"), gBox = sv("g"), gNotes = sv("g", { "aria-hidden": "true" }), gArr = sv("g"), gHead = sv("g", { "aria-hidden": "true" });
      [gBack, gZones, gBand, gBands, gFrFill, gLife, gFr, gAct, gFrTop, gBox, gNotes, gArr, gHead].forEach(function (g) { svgEl.appendChild(g); });
      gBack.appendChild(sv("rect", { x: 0, y: 0, width: W, height: H, fill: "var(--sq-panel)", "fill-opacity": container.getAttribute("data-theme") === "blueprint" ? ".55" : "1" }));
      /* the current step: a soft band across the whole diagram, moved by highlightDiagram */
      var band = sv("g", { class: "nthview-band" }), bandRect = sv("rect", { x: 0, y: 0, width: W, height: 10, fill: "var(--nv-accent)", "fill-opacity": ".09" }), bandMark = sv("rect", { x: 0, y: 0, width: 4, height: 10, fill: "var(--nv-accent)" });
      band.appendChild(bandRect); band.appendChild(bandMark); gBand.appendChild(band);

      /* zones */
      var zk = 0;
      zrun.forEach(function (r) {
        if (!r.zone) return;
        var x0 = cx(r.start) - COL / 2 + 5, w = r.n * COL - 10;
        if (r.start + r.n === nP) w = Math.max(w, W - x0 - 6);
        gZones.appendChild(sv("rect", { x: x0, y: 6, width: w, height: H - 12, rx: 14, fill: zk++ % 2 ? "var(--sq-zone-b)" : "var(--sq-zone-a)" }));
        gZones.appendChild(sv("text", { x: x0 + (r.n * COL - 10) / 2, y: 22, "text-anchor": "middle", "font-size": 10.5, "font-weight": 600, "letter-spacing": "1.2", class: "nthview-muted-t", text: clip(ZI[r.zone].name.toUpperCase(), Math.floor((r.n * COL - 10) / 8)) }));
      });
      /* group bands: the parties inside a group, under its name */
      bands.forEach(function (b) {
        var inset = 9 + b.depth * 5, x0 = cx(b.c0) - COL / 2 + inset, x1 = cx(b.c1) + COL / 2 - inset, top = ZONEH + 8 + b.depth * 22;
        gBands.appendChild(sv("rect", { x: x0, y: top, width: x1 - x0, height: lifeEnd - top + 6, rx: 12, fill: "var(--q" + M.COLOR[b.g] + ")", "fill-opacity": ".45", stroke: "var(--p" + M.COLOR[b.g] + ")", "stroke-width": 1.2, "stroke-dasharray": "5 4" }));
        gBands.appendChild(sv("text", { x: (x0 + x1) / 2, y: top + 15, "text-anchor": "middle", "font-size": 11.5, "font-weight": 700, text: clip(nameOf(b.g) + (b.hasOwn ? "" : " · inside"), Math.floor((x1 - x0) / 7)) }));
      });

      /* participant heads and lifelines */
      function head(c, top) {
        var id = ids[c], p = pOf(id), grp = PMAP[id].isGroup, w = COL - 22, x0 = cx(c) - w / 2, hh = HEADH - 8, ci = M.COLOR[id];
        var ink = "var(--p" + ci + ")", tn = "var(--q" + ci + ")", r = 15, acx = x0 + 11 + r, acy = top + hh / 2, tx = acx + r + 9, room = x0 + w - 8 - tx;
        var g = sv("g");
        g.appendChild(sv("rect", { x: x0, y: top, width: w, height: hh, rx: 12, fill: "var(--sq-panel)", stroke: grp ? ink : "var(--nv-border)", "stroke-width": grp ? 1.6 : 1.2, "stroke-dasharray": grp ? "5 3" : "none" }));
        g.appendChild(sv("path", { d: "M" + (x0 + 14) + " " + (top + 1.5) + "H" + (x0 + w - 14), stroke: ink, "stroke-width": 3, "stroke-linecap": "round" }));
        g.appendChild(grp ? sv("rect", { x: acx - r, y: acy - r, width: 2 * r, height: 2 * r, rx: 9, fill: tn, stroke: ink, "stroke-width": 1.5 }) : sv("circle", { cx: acx, cy: acy, r: r, fill: tn, stroke: ink, "stroke-width": 1.5 }));
        var gl = glyph(kindOf(id), { x: acx - 9, y: acy - 9, width: 18, height: 18 }); gl.style.color = ink;
        g.appendChild(gl);
        var nameLines = wrapText(p.name, Math.floor(room / 7.3), 2);
        var extra = grp ? [p.members.length + " inside"] : [];
        var roleRoom = 3 - nameLines.length - extra.length, roleLines = p.role && roleRoom > 0 ? wrapText(p.role, Math.floor(room / 5.9), roleRoom) : [];
        var total = nameLines.length * 15 + (roleLines.length + extra.length) * 13, ty = top + (hh - total) / 2 + 11;
        nameLines.forEach(function (t) { g.appendChild(sv("text", { x: tx, y: ty, "font-size": 13, "font-weight": 650, text: t })); ty += 15; });
        roleLines.forEach(function (t) { g.appendChild(sv("text", { x: tx, y: ty, "font-size": 10.5, class: "nthview-muted-t", text: t })); ty += 13; });
        extra.forEach(function (t) {
          g.appendChild(sv("text", { x: tx, y: ty, "font-size": 10.5, "font-weight": 700, class: "nthview-muted-t", text: t }));
          p.members.slice(0, Math.max(0, Math.floor((room - 50) / 9))).forEach(function (m, k) { g.appendChild(sv("circle", { cx: tx + 54 + k * 9, cy: ty - 3.5, r: 4, fill: "var(--q" + M.COLOR[m.id] + ")", stroke: "var(--p" + M.COLOR[m.id] + ")", "stroke-width": 1.2 })); });
          ty += 13;
        });
        g.appendChild(sv("title", { text: p.name + (p.role ? ": " + p.role : "") + (grp ? " (" + p.members.length + " parties inside)" : "") }));
        gHead.appendChild(g);
      }
      ids.forEach(function (id, c) {
        head(c, HEADY);
        gLife.appendChild(sv("line", { x1: cx(c), y1: HEADY + HEADH - 8, x2: cx(c), y2: lifeEnd, stroke: "var(--p" + M.COLOR[id] + ")", "stroke-opacity": ".6", "stroke-width": 2, "stroke-linecap": "round", "stroke-dasharray": "0.5 6" }));
        if (bottomHeads) head(c, lifeEnd);
      });

      /* activation bars: each run of consecutive drawn steps a party takes part in */
      ids.forEach(function (id, c) {
        var startR = -1;
        for (var r = 0; r <= rows.length; r++) {
          var involved = r < rows.length && (rows[r].a === c || rows[r].b === c);
          if (involved && startR === -1) startR = r;
          if (!involved && startR !== -1) {
            var a = rows[startR], b = rows[r - 1];
            var y0 = a.arrowY - 10, y1 = (b.selfish ? b.arrowY + 26 : b.arrowY) + 10;
            gAct.appendChild(sv("rect", { x: cx(c) - 5, y: y0, width: 10, height: Math.max(16, y1 - y0), rx: 4, fill: "var(--q" + M.COLOR[id] + ")", stroke: "var(--p" + M.COLOR[id] + ")", "stroke-width": 1.3 }));
            startR = -1;
          }
        }
        rows.forEach(function (row) { if (row.selfish && row.a === c) gAct.appendChild(sv("rect", { x: cx(c) + 1, y: row.arrowY + 4, width: 10, height: 26, rx: 4, fill: "var(--sq-panel)", stroke: "var(--p" + M.COLOR[id] + ")", "stroke-width": 1.3 })); });
      });

      function button(g, label, act) {
        g.setAttribute("role", "button"); g.setAttribute("tabindex", "0"); g.setAttribute("aria-label", label);
        g.addEventListener("click", function (e) { e.stopPropagation(); act(); });
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); act(); } });
      }
      /* frames: alt/opt/loop, unfolded groups and, with Expand all, inner sequences */
      frames.forEach(function (fr) {
        var x0 = fr.x0, x1 = Math.min(W - 4, fr.x1), y0 = fr.y0, y1 = fr.y1;
        var hn = fr.type === "inner" ? null : fr.type === "group" ? "teal" : fr.f.kind === "alt" ? "violet" : fr.f.kind === "loop" ? "teal" : "blue";
        var col = hn ? hue(hn) : "var(--nv-accent)", fill = hn ? tint(hn) : "var(--sq-hi)";
        gFrFill.appendChild(sv("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 10, fill: fill, "fill-opacity": fr.type === "frag" ? ".35" : ".45" }));
        gFr.appendChild(sv("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 10, fill: "none", stroke: col, "stroke-width": fr.type === "frag" ? 1.4 : 1.8, "stroke-dasharray": fr.type === "group" ? "7 4" : "none" }));
        var tw = Math.min(x1 - x0 - 10, fr.tag.length * 7 + 22);
        var tab = sv("g");
        tab.appendChild(sv("path", { d: "M" + x0 + " " + (y0 + 10) + "a10 10 0 0 1 10 -10H" + (x0 + tw) + "v12a8 8 0 0 1 -8 8H" + x0 + "z", fill: col }));
        tab.appendChild(sv("text", { x: x0 + 7, y: y0 + 14.5, "font-size": 11.5, "font-weight": 700, style: "fill:var(--sq-panel)", text: clip(fr.tag, Math.floor((tw - 12) / 7)) }));
        gFrTop.appendChild(tab);
        if (fr.type === "inner") {
          tab.setAttribute("class", "nthview-ref");
          tab.appendChild(sv("text", { x: x0 + tw + 8, y: y0 + 14.5, "font-size": 11, class: "nthview-muted-t", text: fr.Lv.lanes.length + " parties · " + fr.Lv.N + " steps · open" }));
          button(tab, "Open the diagram of the inner sequence of step " + numLabel(fr.Lv.parent, fr.Lv.parentIdx), function () { gotoLevel(fr.Lv.path, 0); });
        } else if (fr.type === "group" && !EXP) {
          var mx = x1 - 26, my = y0 + 4;
          var cb = sv("g", { class: "nthview-ref" }, [sv("rect", { class: "nthview-ref-box", x: mx, y: my, width: 20, height: 18, rx: 4, fill: "var(--sq-panel)", stroke: col, "stroke-width": 1.4 }), sv("path", { d: "M" + (mx + 5) + " " + (my + 9) + "h10", stroke: col, "stroke-width": 2, "stroke-linecap": "round" })]);
          button(cb, "Collapse the group " + fr.f.label, function () {
            state.groups[gkey(fr.Lv, fr.fi)] = false;
            if (fr.Lv === L && state.step >= fr.f.start && state.step <= fr.f.end) state.step = fr.f.start;
            persist(); buildDiagram(); highlightDiagram(false); focusDiagram();
          });
          gFrTop.appendChild(cb);
        }
        fr.guards.forEach(function (g) {
          if (g.divider !== undefined) gFr.appendChild(sv("line", { x1: x0, y1: g.divider, x2: x1, y2: g.divider, stroke: col, "stroke-width": 1.2, "stroke-dasharray": "6 4" }));
          var gt = "[" + clip(g.text, Math.floor((x1 - x0 - 24) / 6.3)) + "]";
          gFrTop.appendChild(sv("rect", { x: x0 + 6, y: g.y - 4, width: Math.min(x1 - x0 - 12, gt.length * 6.3 + 8), height: 16, rx: 8, fill: "var(--sq-panel)" }));
          gFrTop.appendChild(sv("text", { x: x0 + 10, y: g.y + 8, "font-size": 11.5, "font-style": "italic", style: "fill:" + col, text: gt }));
        });
      });

      /* folded boxes: a step's inner sequence (ref) or a collapsed group */
      boxes.forEach(function (bx) {
        var g = sv("g", { class: "nthview-ref" }), col = bx.type === "ref" ? "var(--nv-accent)" : "var(--h-teal)";
        var x0 = bx.x0, x1 = bx.x1, w = x1 - x0, room = Math.floor((w - 80) / 6.8);
        /* folded pages behind the box: there is more here */
        [6, 3].forEach(function (o) { g.appendChild(sv("rect", { x: x0 + o, y: bx.y + o, width: w, height: bx.h, rx: 10, fill: "var(--sq-panel)", stroke: col, "stroke-opacity": ".45", "stroke-width": 1.2 })); });
        g.appendChild(sv("rect", { class: "nthview-ref-box", x: x0, y: bx.y, width: w, height: bx.h, rx: 10, fill: bx.type === "ref" ? "var(--sq-hi)" : "var(--t-teal)", stroke: col, "stroke-width": 1.6, "stroke-dasharray": bx.type === "group" ? "7 4" : "none" }));
        var tag = bx.type === "ref" ? "ref" : "group", tw = tag.length * 7 + 18;
        g.appendChild(sv("path", { d: "M" + x0 + " " + (bx.y + 10) + "a10 10 0 0 1 10 -10H" + (x0 + tw) + "v11a7 7 0 0 1 -7 7H" + x0 + "z", fill: col }));
        g.appendChild(sv("text", { x: x0 + 6, y: bx.y + 13, "font-size": 11, "font-weight": 700, style: "fill:var(--sq-panel)", text: tag }));
        var line1, line2, label;
        if (bx.type === "ref") {
          var st = bx.Lv.S[bx.i];
          line1 = bx.num + "  " + st.title;
          line2 = bx.IL.lanes.length + " parties · " + bx.IL.N + " steps · select to open";
          label = "Step " + bx.num + " has an inner sequence: " + st.title + ", " + bx.IL.lanes.length + " parties, " + bx.IL.N + " steps. Open its diagram.";
          button(g, label, function () { gotoLevel(bx.IL.path, 0); });
        } else {
          var n = bx.u.end - bx.u.start + 1;
          line1 = bx.u.g.label;
          line2 = "steps " + bx.range + " · " + n + " steps · " + partiesOf(bx.Lv, bx.u.start, bx.u.end).map(nameOf).join(", ");
          label = "Group " + bx.u.g.label + ", steps " + bx.range + ", collapsed. Expand it.";
          button(g, label, function () {
            state.groups[gkey(bx.Lv, bx.u.gi)] = true; persist();
            buildDiagram(); highlightDiagram(false); focusDiagram();
          });
        }
        g.appendChild(sv("text", { x: x0 + tw + 10, y: bx.y + 20, "font-size": 12.5, "font-weight": 650, text: clip(line1, room - 4) }));
        g.appendChild(sv("text", { x: x0 + tw + 10, y: bx.y + 37, "font-size": 11, class: "nthview-muted-t", text: clip(line2, room) }));
        /* the chevron marker: select to go in (ref) or to unfold (group) */
        var px = x1 - 22, py = bx.y + bx.h / 2;
        g.appendChild(sv("circle", { cx: px, cy: py, r: 11, fill: col }));
        g.appendChild(sv("path", { d: bx.type === "ref" ? "M" + (px - 2.5) + " " + (py - 5) + "l5 5-5 5" : "M" + (px - 5) + " " + (py - 2.5) + "l5 5 5-5", fill: "none", stroke: "var(--sq-panel)", "stroke-width": 2.2, "stroke-linecap": "round", "stroke-linejoin": "round" }));
        g.appendChild(sv("title", { text: label }));
        gBox.appendChild(g);
        bx.node = g;
      });

      /* arrows */
      rows.forEach(function (row) {
        var s = row.s, k = row.k, a = row.a, b = row.b, col = row.col, top = row.Lv === B;
        var who = row.selfish ? nameOf(s.from) + " on its own" : nameOf(s.from) + " to " + nameOf(s.to);
        var g = sv("g", { class: "nthview-arrow", role: "button", tabindex: "-1", "aria-label": "Step " + row.num + ": " + who + ", " + s.payload + ". " + s.title + (s.inner ? ". Has an inner sequence" : "") + ". Open in step mode." });
        g.appendChild(sv("rect", { class: "nthview-hit", x: row.x0, y: row.y + 2, width: row.x1 - row.x0, height: row.h - 4, rx: 6 }));
        var ly;
        if (row.selfish) {
          var x = cx(a) + 6, yy = row.arrowY;
          g.appendChild(sv("path", { class: "nthview-line", d: "M" + x + " " + yy + "h34a13 13 0 0 1 0 26H" + (x + 12), fill: "none", stroke: col, "stroke-width": 2, "stroke-dasharray": k === "return" ? "7 5" : "none" }));
          g.appendChild(sv("path", { d: "M" + (x + 13) + " " + (yy + 21.5) + " " + (x + 5) + " " + (yy + 26) + " " + (x + 13) + " " + (yy + 30.5) + "z", fill: col }));
          ly = yy + 17;
        } else {
          var dir = b > a ? 1 : -1, x1 = cx(a) + dir * 5, x2 = cx(b) - dir * 6, yy2 = row.arrowY;
          g.appendChild(sv("line", { class: "nthview-line", x1: x1, y1: yy2, x2: x2 - dir * 2, y2: yy2, stroke: col, "stroke-width": 2, "stroke-dasharray": k === "return" ? "7 5" : "none" }));
          if (k === "sync") g.appendChild(sv("path", { d: "M" + x2 + " " + yy2 + "l" + (-dir * 11) + " -5.5v11z", fill: col }));
          else g.appendChild(sv("path", { d: "M" + (x2 - dir * 10) + " " + (yy2 - 5.5) + "L" + x2 + " " + yy2 + "L" + (x2 - dir * 10) + " " + (yy2 + 5.5), fill: "none", stroke: col, "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" }));
          ly = yy2 - 12;
        }
        var bx = row.lx, lg = sv("g");
        lg.appendChild(sv("rect", { class: "nthview-lbl", x: bx, y: ly - 13, width: row.w, height: 19, rx: 9.5, fill: row.tint, stroke: col, "stroke-width": 1.2 }));
        lg.appendChild(sv("rect", { x: bx + 2.5, y: ly - 11, width: row.nb, height: 15, rx: 7.5, fill: col }));
        lg.appendChild(sv("text", { x: bx + 2.5 + row.nb / 2, y: ly, "text-anchor": "middle", "font-size": row.num.length > 1 ? 8.5 : 9.5, "font-weight": 700, style: "fill:var(--sq-panel)", text: row.num }));
        lg.appendChild(sv("text", { x: bx + row.nb + 9, y: ly + 0.5, "font-size": 12, class: "nthview-mono", text: row.txt }));
        if (s.inner) {
          var mx = bx + row.w - 12, my = ly - 3.5;
          lg.appendChild(sv("circle", { cx: mx, cy: my, r: 7, fill: col }));
          lg.appendChild(sv("path", { d: "M" + (mx - 1.5) + " " + (my - 3.5) + "l3.5 3.5-3.5 3.5", fill: "none", stroke: "var(--sq-panel)", "stroke-width": 1.8, "stroke-linecap": "round", "stroke-linejoin": "round" }));
        }
        g.appendChild(lg);
        g.appendChild(sv("title", { text: row.num + ". " + s.title }));
        function open() {
          if (top) { state.step = row.i; reveal(L, row.i); persist(); setMode("step", true); return; }
          state.mode = "step";
          gotoLevel(row.Lv.path, row.i, { reveal: true });
          setMode("step", true);
        }
        g.addEventListener("click", open);
        if (canHover) {
          g.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") showTip(e, row.num, s.title, row.selfish ? nameOf(s.from) + " on its own" : nameOf(s.from) + (k === "return" ? " replies to " : " → ") + nameOf(s.to)); });
          g.addEventListener("pointermove", function (e) { if (e.pointerType === "mouse") moveTip(e); });
          g.addEventListener("pointerleave", hideTip);
        }
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); open(); } });
        if (top) g.addEventListener("focus", function () { if (state.step !== row.i && state.mode === "diagram") { state.step = row.i; persist(); highlightDiagram(false); } });
        gArr.appendChild(g);
        row.node = g;
      });

      /* notes: folded-corner boxes under their step */
      rows.forEach(function (row) {
        var n = row.note; if (!n) return;
        var c = row.s.note.severity === "danger" ? "red" : row.s.note.severity === "warning" ? "amber" : "blue";
        gNotes.appendChild(sv("path", { d: "M" + (n.x + 3) + " " + (n.y + 4) + "h" + (n.w - 12) + "l12 12v" + (n.h - 12) + "H" + (n.x + 3) + "z", fill: "var(--nv-fg)", "fill-opacity": ".07" }));
        gNotes.appendChild(sv("path", { d: "M" + n.x + " " + n.y + "h" + (n.w - 14) + "l14 14v" + (n.h - 14) + "H" + n.x + "z", fill: tint(c), stroke: hue(c), "stroke-width": 1.1, "stroke-linejoin": "round" }));
        gNotes.appendChild(sv("path", { d: "M" + (n.x + n.w - 14) + " " + n.y + "v10a4 4 0 0 0 4 4h10", fill: "var(--sq-panel)", "fill-opacity": ".6", stroke: hue(c), "stroke-width": 1.1, "stroke-linejoin": "round" }));
        gNotes.appendChild(sv("rect", { x: n.x, y: n.y, width: 3, height: n.h, fill: hue(c) }));
        n.lines.forEach(function (line, k) {
          gNotes.appendChild(sv("text", { x: n.x + 10, y: n.y + 18 + k * 15, "font-size": 11.5, text: line }));
        });
      });
      units.forEach(function (u) {
        u.node = u.row ? u.row.node : u.box.node;
        u.y = u.row ? u.row.y : u.box.y; u.h = u.row ? u.row.h : u.box.h;
        if (u.box) u.node.setAttribute("tabindex", "-1");
        if (u.box) u.node.addEventListener("focus", function () { if (state.mode === "diagram" && (state.step < u.start || state.step > u.end)) { state.step = u.start; persist(); highlightDiagram(false); } });
      });
      dpanel.textContent = "";
      dpanel.appendChild(svgEl);
      dChannels.textContent = "";
      dChannels.appendChild(channelLegend(Object.keys(usedCh).map(function (c) { return usedCh[c]; })));
      D = { svg: svgEl, w: W, h: H, units: units, key: B.key, expand: EXP, band: band, bandRect: bandRect, bandMark: bandMark };
      hideTip();
      buildMini();
      bExpand.setAttribute("aria-pressed", String(EXP));
      applyZoom();
    }

    /* hover tooltips (mouse only): the step's number, title and route */
    var canHover = !!(root.matchMedia && root.matchMedia("(hover: hover) and (pointer: fine)").matches);
    function showTip(e, num, title, route) {
      dtip.textContent = "";
      dtip.appendChild(el("b", { text: "Step " + num + " · " + title }));
      dtip.appendChild(el("span", { text: route }));
      dtip.hidden = false; moveTip(e);
    }
    function moveTip(e) {
      if (dtip.hidden) return;
      var r = dwrap.getBoundingClientRect(), w = dtip.offsetWidth, h = dtip.offsetHeight;
      var x = Math.min(r.width - w - 8, Math.max(8, e.clientX - r.left + 14)), y = e.clientY - r.top + 18;
      if (y + h > r.height - 8) y = e.clientY - r.top - h - 12;
      dtip.style.left = x + "px"; dtip.style.top = Math.max(8, y) + "px";
    }
    function hideTip() { dtip.hidden = true; }
    /* the "where am I" rail: ticks per step and the visible window; shown when the diagram is taller than its panel */
    function buildMini() {
      mini.textContent = ""; miniTicks = [];
      D.units.forEach(function (u) {
        var t = el("i"); t.style.top = ((u.y + u.h / 2) / D.h * 100) + "%";
        if (u.row) t.style.background = u.row.col;
        mini.appendChild(t); miniTicks.push(t);
      });
      mini.appendChild(miniWin);
      updateMini();
    }
    function updateMini() {
      if (!D) return;
      var sh = dpanel.scrollHeight, ch = dpanel.clientHeight;
      mini.hidden = !(sh > ch + 40) || state.mode !== "diagram";
      if (mini.hidden) return;
      mini.style.height = ch + "px";
      miniWin.style.top = (dpanel.scrollTop / sh * 100) + "%";
      miniWin.style.height = Math.max(6, ch / sh * 100) + "%";
    }
    dpanel.addEventListener("scroll", function () { updateMini(); hideTip(); }, { passive: true });
    mini.addEventListener("click", function (e) {
      var r = mini.getBoundingClientRect(), f = (e.clientY - r.top) / r.height;
      dpanel.scrollTop = Math.max(0, f * dpanel.scrollHeight - dpanel.clientHeight / 2);
    });
    function fitZoom() { var pw = dpanel.clientWidth || container.clientWidth || 800; return Math.max(state.expand ? 0.5 : 0.7, Math.min(1.25, (pw - 2) / D.w)); }
    function currentZoom() { return state.zoom === "fit" ? fitZoom() : state.zoom; }
    function applyZoom() {
      if (!D) return;
      var z = currentZoom();
      D.svg.setAttribute("width", String(Math.round(D.w * z)));
      D.svg.setAttribute("height", String(Math.round(D.h * z)));
      D.svg.style.width = Math.round(D.w * z) + "px"; D.svg.style.height = Math.round(D.h * z) + "px";
      zoomVal.textContent = Math.round(z * 100) + "%";
      zoomFit.setAttribute("aria-pressed", String(state.zoom === "fit"));
    }
    /* button zoom eases over 250 ms; pinch and Ctrl+wheel follow the fingers directly */
    var zoomT = 0;
    function setZoom(z) {
      state.zoom = z === "fit" ? "fit" : Math.round(Math.max(0.4, Math.min(2.5, z)) * 10) / 10;
      if (D && !reduceMotion) D.svg.classList.add("nthview-zooming");
      applyZoom(); persist();
      clearTimeout(zoomT);
      zoomT = setTimeout(function () { if (D) D.svg.classList.remove("nthview-zooming"); highlightDiagram(true); updateMini(); }, reduceMotion ? 0 : 270);
    }
    zoomIn.addEventListener("click", function () { setZoom(currentZoom() + 0.2); });
    zoomOut.addEventListener("click", function () { setZoom(currentZoom() - 0.2); });
    zoomFit.addEventListener("click", function () { setZoom("fit"); });
    /* pinch (touch) and Ctrl+wheel (trackpad pinch) zoom the diagram inside its panel, keeping the point under the fingers still */
    function zoomAt(z, cx, cy, save) {
      if (!D) return;
      var old = currentZoom(), r0 = D.svg.getBoundingClientRect();
      var ux = (cx - r0.left) / old, uy = (cy - r0.top) / old;
      state.zoom = Math.round(Math.max(0.4, Math.min(2.5, z)) * 100) / 100;
      applyZoom();
      var r1 = D.svg.getBoundingClientRect();
      dpanel.scrollLeft += r1.left + ux * state.zoom - cx;
      dpanel.scrollTop += r1.top + uy * state.zoom - cy;
      if (save) persist();
    }
    var pinch = null;
    function tdist(t) { var dx = t[0].clientX - t[1].clientX, dy = t[0].clientY - t[1].clientY; return Math.sqrt(dx * dx + dy * dy) || 1; }
    dpanel.addEventListener("touchstart", function (e) {
      if (e.touches.length === 2) { e.preventDefault(); pinch = { d: tdist(e.touches), z: currentZoom() }; }
    }, { passive: false });
    dpanel.addEventListener("touchmove", function (e) {
      if (!pinch || e.touches.length !== 2) return;
      e.preventDefault();
      zoomAt(pinch.z * tdist(e.touches) / pinch.d, (e.touches[0].clientX + e.touches[1].clientX) / 2, (e.touches[0].clientY + e.touches[1].clientY) / 2, false);
    }, { passive: false });
    function endPinch(e) { if (pinch && e.touches.length < 2) { pinch = null; persist(); } }
    dpanel.addEventListener("touchend", endPinch);
    dpanel.addEventListener("touchcancel", endPinch);
    dpanel.addEventListener("wheel", function (e) {
      if (!e.ctrlKey) return;
      e.preventDefault();
      zoomAt(currentZoom() * Math.exp(-e.deltaY / 300), e.clientX, e.clientY, true);
    }, { passive: false });
    /* Safari sends its own pinch events; stop them zooming the whole page while the fingers are on the diagram */
    ["gesturestart", "gesturechange"].forEach(function (t) { dpanel.addEventListener(t, function (e) { e.preventDefault(); }, { passive: false }); });

    function curUnit() { if (!D || !D.units.length) return -1; var k = unitAt(D.units, Math.min(state.step, N - 1)); return k === -1 ? 0 : k; }
    function highlightDiagram(scroll) {
      if (!D) return;
      var k = curUnit();
      D.units.forEach(function (u, j) {
        u.node.classList.toggle("nthview-cur", j === k && state.step < N);
        u.node.setAttribute("tabindex", j === k ? "0" : "-1");
      });
      var cu = k !== -1 && state.step < N ? D.units[k] : null;
      D.band.style.display = cu ? "" : "none";
      if (cu) {
        var first = !D.bandPlaced; D.bandPlaced = true;
        if (first) D.band.style.transition = "none";
        var by = cu.y + (cu.box ? -4 : 2), bh = cu.h + (cu.box ? 8 : -4) + (cu.row && cu.row.note ? cu.row.note.h + 10 : 0);
        D.band.style.transform = "translate(0px," + by + "px)";
        D.bandRect.setAttribute("height", String(bh)); D.bandMark.setAttribute("height", String(bh));
        if (first) { void D.band.getBoundingClientRect(); D.band.style.transition = ""; }
      }
      miniTicks.forEach(function (t, j) { t.classList.toggle("nthview-cur", j === k && state.step < N); });
      updateMini();
      toStep.textContent = "";
      if (state.step < N) { toStep.appendChild(doc.createTextNode("Open step " + numLabel(L, state.step))); toStep.appendChild(el("span", { class: "nthview-wide", text: "in step mode" })); }
      else toStep.textContent = L.depth ? "Back to the inner recap" : "Back to the recap";
      setMeter(state.step);
      if (scroll && state.step < N && k !== -1) {
        var z = currentZoom(), u = D.units[k], top = u.y * z, ph = dpanel.clientHeight;
        if (top < dpanel.scrollTop + 20 || top + u.h * z > dpanel.scrollTop + ph - 20) dpanel.scrollTop = Math.max(0, top - ph / 3);
        var xm = u.xm * z, pw = dpanel.clientWidth;
        if (xm < dpanel.scrollLeft + 40 || xm > dpanel.scrollLeft + pw - 40) dpanel.scrollLeft = Math.max(0, xm - pw / 2);
      }
    }
    function focusDiagram() {
      var k = curUnit();
      var cur = k === -1 ? null : D.units[k].node;
      setTimeout(function () { if (cur && state.mode === "diagram") cur.focus({ preventScroll: true }); }, 30);
    }
    function diagGo(k) {
      if (!D || !D.units.length) return;
      k = Math.max(0, Math.min(D.units.length - 1, k));
      state.step = D.units[k].start; persist();
      highlightDiagram(true);
      D.units[k].node.focus({ preventScroll: true });
    }

    function setMode(m, fromUser) {
      state.mode = m;
      bStep.setAttribute("aria-pressed", String(m === "step"));
      bDiag.setAttribute("aria-pressed", String(m === "diagram"));
      stepMode.hidden = m !== "step";
      diagMode.hidden = m !== "diagram";
      setupLevel();
      if (m === "diagram") {
        if (!D || D.key !== L.key || D.expand !== state.expand) buildDiagram(); else applyZoom();
        persist();
        if (fromUser && root.matchMedia && root.matchMedia("(max-width: 700px)").matches) {
          var top = dtools.getBoundingClientRect().top + (root.pageYOffset || 0);
          top -= bar.offsetHeight;
          if (top > (root.pageYOffset || 0) + 8) root.scrollTo(0, Math.max(0, top - 4));
        }
        highlightDiagram(true);
        status.textContent = "Full diagram. Arrow keys move between steps; Enter opens one.";
        focusDiagram();
      } else {
        if (fromUser && state.step < N) { var us = unitsOf(L, false), u = us[unitAt(us, state.step)]; if (u.g && state.step !== u.start) reveal(L, state.step); }
        var f = renderStep(true);
        persist();
        setTimeout(function () { if (f) f.focus({ preventScroll: true }); }, 30);
      }
    }
    function onResize() {
      if (!container.isConnected) return;
      measureBar();
      if (D && state.zoom === "fit" && state.mode === "diagram") applyZoom();
      if (D && state.mode === "diagram") updateMini();
      if (state.mode === "step") {
        updateStageOverflow();
        if (lastLabel) { placeLabel(lastLabel[0], lastLabel[1]); if (lastFlight) revealFlight(lastFlight[0], lastFlight[1], false); }
        if (!waiting.hidden) placeWaiting();
      }
    }
    if (container.__nthviewSeqResize) root.removeEventListener("resize", container.__nthviewSeqResize);
    container.__nthviewSeqResize = onResize;
    root.addEventListener("resize", onResize);

    /* ---------- glossary drawer + popovers ---------- */
    var pop = null, popFor = null, popSeq = 0;
    function closePop() { if (pop && pop.parentNode) pop.parentNode.removeChild(pop); if (popFor) popFor.setAttribute("aria-expanded", "false"); pop = null; popFor = null; }
    function openPop(btn, g) {
      if (popFor === btn) { closePop(); return; }
      closePop();
      var id = "nthview-pop-" + (++popSeq);
      pop = el("div", { class: "nthview-pop", role: "note", id: id }, [el("b", { text: g.term })]);
      pop.appendChild(rich(g.definition));
      container.appendChild(pop);
      var r = btn.getBoundingClientRect(), w = container.getBoundingClientRect(), pw = pop.offsetWidth;
      var left = Math.max(12, Math.min(r.left - w.left, w.width - pw - 12));
      pop.style.left = left + "px"; pop.style.top = (r.bottom - w.top + 8) + "px";
      btn.setAttribute("aria-expanded", "true"); btn.setAttribute("aria-describedby", id); popFor = btn;
    }
    container.addEventListener("click", function (e) { if (pop && !pop.contains(e.target) && e.target !== popFor) closePop(); });
    var drawer = null, scrim = null, drawerReturn = null, closeBtn = null;
    if (glossBtn) {
      scrim = el("div", { class: "nthview-scrim", "aria-hidden": "true" });
      drawer = el("aside", { class: "nthview-drawer", role: "dialog", "aria-modal": "true", "aria-label": "Glossary", tabindex: "-1" });
      closeBtn = el("button", { type: "button", class: "nthview-tbtn", "aria-label": "Close glossary" }, [icon("close")]);
      closeBtn.firstChild.setAttribute("width", "16"); closeBtn.firstChild.setAttribute("height", "16");
      drawer.appendChild(el("div", { class: "nthview-drawer-head" }, [el("h2", { text: "Glossary" }), closeBtn]));
      var dl = el("dl", { class: "nthview-gloss" });
      Object.keys(GLOSS).forEach(function (k) { var g = GLOSS[k]; dl.appendChild(el("dt", { text: g.term })); var dd = el("dd"); dd.appendChild(rich(g.definition)); dl.appendChild(dd); });
      drawer.appendChild(dl);
      container.appendChild(scrim); container.appendChild(drawer);
      glossBtn.addEventListener("click", function () { drawerReturn = doc.activeElement; drawer.classList.add("nthview-open"); scrim.classList.add("nthview-open"); glossBtn.setAttribute("aria-expanded", "true"); setTimeout(function () { closeBtn.focus(); }, 50); });
      closeBtn.addEventListener("click", closeGlossary);
      scrim.addEventListener("click", closeGlossary);
      drawer.addEventListener("keydown", function (e) {
        if (e.key !== "Tab") return;
        var f = drawer.querySelectorAll("button,[tabindex='0']"), first = f[0], lastF = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { lastF.focus(); e.preventDefault(); }
        else if (!e.shiftKey && doc.activeElement === lastF) { first.focus(); e.preventDefault(); }
      });
    }
    function closeGlossary() {
      if (!drawer || !drawer.classList.contains("nthview-open")) return false;
      drawer.classList.remove("nthview-open"); scrim.classList.remove("nthview-open"); glossBtn.setAttribute("aria-expanded", "false");
      if (drawerReturn && drawerReturn.focus) drawerReturn.focus();
      return true;
    }

    /* ---------- keyboard ---------- */
    /* keys work from the page body too, so the learner need not click into the view first;
       arrows stay within the current level, Escape and Backspace go up one level */
    function onKey(e) {
      if (!container.isConnected || !(e.target === doc.body || e.target === doc.documentElement || container.contains(e.target))) return;
      if (e.key === "Escape") {
        if (closeGlossary() || pop) { closePop(); e.preventDefault(); return; }
        if (state.path.length) { e.preventDefault(); upLevel(); }
        return;
      }
      if (drawer && drawer.classList.contains("nthview-open")) return;
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "Backspace") { if (state.path.length) { e.preventDefault(); upLevel(); } return; }
      var diag = state.mode === "diagram", d = 0;
      if (e.key === "ArrowRight" || (diag && e.key === "ArrowDown")) d = 1;
      else if (e.key === "ArrowLeft" || (diag && e.key === "ArrowUp")) d = -1;
      else if (e.key === "Home") { e.preventDefault(); if (diag) diagGo(0); else go(0); return; }
      else if (e.key === "End") { e.preventDefault(); if (diag) diagGo(D ? D.units.length - 1 : 0); else go(N); return; }
      if (!d) return;
      e.preventDefault();
      if (diag) diagGo(curUnit() + d);
      else if (d > 0) next.click(); else if (state.step > 0) go(state.step - 1);
    }
    if (container.__nthviewSeqKeys) doc.removeEventListener("keydown", container.__nthviewSeqKeys);
    container.__nthviewSeqKeys = onKey;
    doc.addEventListener("keydown", onKey);

    container.appendChild(status);

    /* ---------- restore saved progress; fields that no longer fit are ignored ---------- */
    var saved = loadState(key);
    if (saved) {
      var path = [], lv = M.ROOT, full = true;
      if (Array.isArray(saved.path)) {
        for (var pi = 0; pi < saved.path.length; pi++) {
          var x = saved.path[pi];
          if (Number.isInteger(x) && x >= 0 && x < lv.N && lv.S[x].inner) { path.push(x); lv = innerOf(lv, x); } else { full = false; break; }
        }
      }
      state.path = path; useLevel();
      if (full && Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= N) state.step = saved.step;
      else if (!full && Number.isInteger(saved.path[path.length]) && saved.path[path.length] >= 0 && saved.path[path.length] < N) state.step = saved.path[path.length];
      if (saved.mode === "step" || saved.mode === "diagram") state.mode = saved.mode;
      if (saved.zoom === "fit" || (typeof saved.zoom === "number" && saved.zoom >= 0.4 && saved.zoom <= 2.5)) state.zoom = saved.zoom;
      state.compare = saved.compare === true; state.details = saved.details === true; state.summarySeen = saved.summarySeen === true; state.expand = saved.expand === true;
      state.holdsChanged = saved.holdsChanged === true;
      state.done = saved.done === true || state.summarySeen;   /* summarySeen: the closing summary was reached in an earlier visit */
      if (saved.seen && typeof saved.seen === "object") Object.keys(saved.seen).forEach(function (k) {
        var parts = k.split("."), last = parts.pop(), lvl = LEVELS[parts.join(".")], i = parseInt(last, 10);
        if (lvl && String(i) === last && i >= 0 && i < lvl.N && saved.seen[k] === true) state.seen[k] = true;
      });
      if (saved.recapSeen && typeof saved.recapSeen === "object") Object.keys(saved.recapSeen).forEach(function (k) { if (LEVELS[k] && k && saved.recapSeen[k] === true) state.recapSeen[k] = true; });
      if (saved.groups && typeof saved.groups === "object") {
        Object.keys(saved.groups).forEach(function (k) {
          var m = /^(.*)#g(\d+)$/.exec(k), lvl = m && LEVELS[m[1]], f = lvl && (lvl.seq.fragments || [])[+m[2]];
          if (f && f.kind === "group" && String(+m[2]) === m[2] && typeof saved.groups[k] === "boolean") state.groups[k] = saved.groups[k];
        });
      }
      if (saved.checks && typeof saved.checks === "object") {
        Object.keys(saved.checks).forEach(function (k) {
          var parts = k.split("."), last = parts.pop(), lvl = LEVELS[parts.join(".")], i = parseInt(last, 10), a = saved.checks[k];
          if (!lvl || String(i) !== last || !a || typeof a !== "object") return;
          var s = lvl.S[i];
          if (!s || !s.check) return;
          if (a.skipped === true) { state.checks[k] = { skipped: true }; return; }
          var n = s.check.type === "who" ? lvl.lanes.length : s.check.options.length;
          if (!Number.isInteger(a.picked) || a.picked < 0 || a.picked >= n) return;
          var ok = s.check.type === "who" ? lvl.lanes[a.picked] === lvl.resolve(s.check.answer) : !!s.check.options[a.picked].correct;
          state.checks[k] = { picked: a.picked, correct: ok };
        });
      }
    }
    setupLevel();
    measureBar();
    if (state.mode === "diagram") setMode("diagram"); else { renderStep(false); }
    markSeen();
    if (saved && state.done && saved.done !== true) persist();
    if (saved && !untouched()) {
      var whereTxt = L.depth
        ? (state.step >= N ? "the recap of the inner sequence of step " + numLabel(L.parent, L.parentIdx) : "step " + numLabel(L, state.step) + ", inside step " + numLabel(L.parent, L.parentIdx))
        : (state.step >= N ? "the recap" : "step " + (state.step + 1) + " of " + N);
      resumeSlot.appendChild(resumeNotice("Welcome back, continuing from " + whereTxt + (state.mode === "diagram" ? " in the full diagram" : "") + "."));
    }
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-sequence");
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

  NthView.THEMES = THEMES;
})(typeof globalThis !== "undefined" ? globalThis : window);
