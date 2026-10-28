/* NthView — sequence renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first. No libraries: plain DOM, CSS and inline SVG.
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";

  var THEMES = ["paper", "slate", "blueprint", "mint"];

  /* Surfaces per theme, light then dark. Flat colours only. */
  var PALETTES = {
    paper: {
      light: "--nv-bg:#f4efe6;--nv-fg:#1d1a16;--nv-muted:#5f574c;--nv-accent:#8a3b12;--nv-border:#dcd2c2;--nv-error:#b91c1c;--sq-panel:#fffdf8;--sq-soft:#f7f2e9;--sq-hi:#f3e1cf;--sq-on-accent:#fff;--sq-zone-a:#efe7da;--sq-zone-b:#f1ece2;--sq-head:Georgia,'Iowan Old Style','Times New Roman',serif",
      dark: "--nv-bg:#1a1814;--nv-fg:#f1ebe0;--nv-muted:#b9ae9d;--nv-accent:#f2a474;--nv-border:#3b362e;--nv-error:#f87171;--sq-panel:#23201b;--sq-soft:#2b2822;--sq-hi:#3d2e22;--sq-on-accent:#1a1814;--sq-zone-a:#2b2721;--sq-zone-b:#312c25"
    },
    slate: {
      light: "--nv-bg:#e9ecef;--nv-fg:#11161c;--nv-muted:#56606d;--nv-accent:#2f3583;--nv-border:#d0d6dc;--nv-error:#b91c1c;--sq-panel:#ffffff;--sq-soft:#f4f6f8;--sq-hi:#e6e8f6;--sq-on-accent:#fff;--sq-zone-a:#e2e6ea;--sq-zone-b:#eceff2;--sq-head:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
      dark: "--nv-bg:#121519;--nv-fg:#e9edf2;--nv-muted:#a3adba;--nv-accent:#a4abff;--nv-border:#313844;--nv-error:#f87171;--sq-panel:#1b1f25;--sq-soft:#21262d;--sq-hi:#272b48;--sq-on-accent:#121519;--sq-zone-a:#20252c;--sq-zone-b:#262b33"
    },
    blueprint: {
      light: "--nv-bg:#e6eef9;--nv-fg:#0c1d33;--nv-muted:#41587a;--nv-accent:#1557b0;--nv-border:#c1d2e8;--nv-error:#b91c1c;--sq-panel:#fbfdff;--sq-soft:#eef4fb;--sq-hi:#d8e6f8;--sq-on-accent:#fff;--sq-zone-a:#dde8f6;--sq-zone-b:#e6eef9;--sq-head:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
      dark: "--nv-bg:#0c2240;--nv-fg:#e6f0ff;--nv-muted:#a2b9d8;--nv-accent:#7cc4ff;--nv-border:#2b4b75;--nv-error:#fca5a5;--sq-panel:#10294b;--sq-soft:#0e2645;--sq-hi:#1b3d68;--sq-on-accent:#0c2240;--sq-zone-a:#143258;--sq-zone-b:#183862"
    },
    mint: {
      light: "--nv-bg:#e8f4ee;--nv-fg:#0f2a22;--nv-muted:#486659;--nv-accent:#0b7a5c;--nv-border:#cbe1d6;--nv-error:#b91c1c;--sq-panel:#fbfefc;--sq-soft:#f0f8f4;--sq-hi:#d4eee3;--sq-on-accent:#fff;--sq-zone-a:#deeee6;--sq-zone-b:#e7f3ed;--sq-head:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif",
      dark: "--nv-bg:#0e1b17;--nv-fg:#e3f3ec;--nv-muted:#9dbfb2;--nv-accent:#62d6b0;--nv-border:#2a3f37;--nv-error:#f87171;--sq-panel:#142520;--sq-soft:#182b25;--sq-hi:#1d3a30;--sq-on-accent:#0e1b17;--sq-zone-a:#1a2d27;--sq-zone-b:#1f342d"
    }
  };
  /* Channel and severity hues, shared by every theme: strong ink and a tint behind it. */
  var HUES_LIGHT = "--h-slate:#4a5563;--t-slate:#e4e8ec;--h-amber:#975008;--t-amber:#fbecd7;--h-green:#146a41;--t-green:#dcefe4;--h-blue:#1d4fb8;--t-blue:#e1e9fb;--h-red:#b42323;--t-red:#fbe2e2;--h-teal:#0e676c;--t-teal:#d9efef;--h-violet:#6140b5;--t-violet:#ebe5fa;--h-pink:#a42f6b;--t-pink:#f8e1ec";
  var HUES_DARK = "--h-slate:#aab4c0;--t-slate:#2a3038;--h-amber:#f0b061;--t-amber:#3a2a14;--h-green:#72d09d;--t-green:#163326;--h-blue:#93b4ff;--t-blue:#1c2a4a;--h-red:#ff9393;--t-red:#3f1d1d;--h-teal:#72d4d7;--t-teal:#133536;--h-violet:#bda7ff;--t-violet:#2a2347;--h-pink:#f6a0cb;--t-pink:#3b1d2d";

  function themeCss() {
    var out = [];
    THEMES.forEach(function (t) {
      var p = PALETTES[t];
      out.push(".nthview-sequence[data-theme=" + t + "]{" + p.light + ";" + HUES_LIGHT + "}");
      out.push("@media (prefers-color-scheme:dark){.nthview-sequence[data-theme=" + t + "]{" + p.dark + ";" + HUES_DARK + "}}");
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
    ".nthview-sequence{--sq-mono:ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace;position:relative;max-width:none;min-height:100vh;padding:1.25rem 1rem 3rem;font-size:15px;line-height:1.55}",
    ".nthview-sequence>*:not(.nthview-scrim):not(.nthview-drawer):not(.nthview-pop){max-width:66rem;margin-left:auto;margin-right:auto}",
    ".nthview-sequence button{font:inherit;color:inherit}",
    ".nthview-sequence [tabindex='-1']:focus{outline:none}",
    ".nthview-sequence code{font-family:var(--sq-mono);font-size:.88em;background:var(--sq-soft);border:1px solid var(--nv-border);padding:0 .3em;border-radius:.3em;overflow-wrap:anywhere}",
    /* header */
    ".nthview-head{display:flex;flex-wrap:wrap;gap:.75rem 1.25rem;align-items:flex-start;justify-content:space-between;margin-bottom:.9rem}",
    ".nthview-head-text{flex:1 1 22rem;min-width:0}",
    ".nthview-eyebrow{margin:0 0 .15rem;font-size:.72rem;letter-spacing:.12em;text-transform:uppercase;color:var(--nv-muted);font-weight:600}",
    ".nthview-title{font-family:var(--sq-head);font-size:1.6rem;line-height:1.2;margin:0 0 .35rem;letter-spacing:-.01em;font-weight:650}",
    ".nthview-sub{margin:0;color:var(--nv-muted);max-width:68ch}",
    ".nthview-toolbar{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}",
    ".nthview-seg{display:inline-flex;border:1px solid var(--nv-border);border-radius:.55rem;background:var(--sq-panel);padding:2px}",
    ".nthview-seg button{border:0;background:transparent;padding:.4rem .75rem;border-radius:.4rem;cursor:pointer;font-size:.88rem;color:var(--nv-muted);white-space:nowrap}",
    ".nthview-seg button[aria-pressed=true]{background:var(--nv-accent);color:var(--sq-on-accent);font-weight:600}",
    ".nthview-tbtn,.nthview-restart{border:1px solid var(--nv-border);background:var(--sq-panel);padding:.42rem .75rem;border-radius:.55rem;cursor:pointer;font-size:.88rem;white-space:nowrap}",
    ".nthview-tbtn:hover,.nthview-restart:hover,.nthview-seg button:hover{border-color:var(--nv-muted)}",
    ".nthview-progress{height:3px;background:var(--nv-border);border-radius:2px;overflow:hidden;margin:0 0 .9rem}",
    ".nthview-progress span{display:block;height:100%;background:var(--nv-accent);transition:width .35s ease}",
    /* stage: zones, lanes, track */
    ".nthview-stage{position:relative;background:var(--sq-panel);border:1px solid var(--nv-border);border-radius:.7rem;padding:.7rem .6rem .35rem;overflow:hidden}",
    ".nthview-zonebg{position:absolute;inset:0;display:grid;pointer-events:none;padding:0 .6rem}",
    ".nthview-zoneband{border-left:1px dashed var(--nv-border);border-right:1px dashed var(--nv-border)}",
    ".nthview-zoneband.nthview-za{background:var(--sq-zone-a)}",
    ".nthview-zoneband.nthview-zb{background:var(--sq-zone-b)}",
    ".nthview-zonerow,.nthview-lanes,.nthview-rails{position:relative;display:grid;gap:0}",
    ".nthview-zonelabel{font-size:.68rem;letter-spacing:.08em;text-transform:uppercase;color:var(--nv-muted);text-align:center;padding:0 .3rem .35rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600}",
    ".nthview-lane{margin:0 .25rem;text-align:center;padding:.45rem .3rem;border:1px solid var(--nv-border);border-radius:.55rem;background:var(--sq-panel);min-width:0;transition:background .2s,border-color .2s,color .2s}",
    ".nthview-lane svg{width:22px;height:22px;display:block;margin:0 auto .15rem;color:var(--nv-muted)}",
    ".nthview-lane b{display:block;font-size:.84rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-lane small{display:block;font-size:.7rem;color:var(--nv-muted);line-height:1.3;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}",
    ".nthview-lane.nthview-on{background:var(--sq-hi);border-color:var(--nv-accent)}",
    ".nthview-lane.nthview-on svg{color:var(--nv-accent)}",
    ".nthview-lane.nthview-sender b::before{content:'\\25B8\\00a0';color:var(--nv-accent)}",
    ".nthview-track{position:relative;height:78px}",
    ".nthview-rails{position:absolute;inset:0}",
    ".nthview-rail{position:relative}",
    ".nthview-rail::before{content:'';position:absolute;left:50%;top:0;bottom:0;border-left:1px dashed var(--nv-border)}",
    ".nthview-flight{position:absolute;top:44px;height:0;border-top:2px solid currentColor;transition:left .55s ease-in-out,width .55s ease-in-out}",
    ".nthview-flight.nthview-k-return{border-top-style:dashed}",
    ".nthview-head-tip{position:absolute;top:-7px;width:12px;height:12px}",
    ".nthview-fwd .nthview-head-tip{right:-3px}",
    ".nthview-rev .nthview-head-tip{left:-3px;transform:scaleX(-1)}",
    ".nthview-packet{position:absolute;top:38px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:currentColor;box-shadow:0 0 0 3px var(--sq-panel);transition:left .55s ease-in-out,opacity .3s;opacity:0}",
    ".nthview-packet.nthview-go{opacity:1}",
    ".nthview-loop{position:absolute;top:24px;width:34px;height:26px;border:2px solid currentColor;border-left:0;border-radius:0 13px 13px 0}",
    ".nthview-loop .nthview-head-tip{left:-6px;bottom:-7px;top:auto;transform:scaleX(-1)}",
    ".nthview-payload{position:absolute;top:12px;font-family:var(--sq-mono);font-size:.74rem;white-space:nowrap;max-width:96%;overflow:hidden;text-overflow:ellipsis;padding:0 .35rem;border-radius:.3rem;background:var(--sq-panel)}",
    ".nthview-waiting{position:absolute;left:0;right:0;top:32px;text-align:center;font-size:.8rem;color:var(--nv-muted)}",
    /* controls */
    ".nthview-controls{display:flex;align-items:center;gap:.6rem;margin:.8rem 0}",
    ".nthview-nav{border:1px solid var(--nv-border);background:var(--sq-panel);padding:.5rem 1rem;border-radius:.55rem;cursor:pointer;white-space:nowrap}",
    ".nthview-nav:hover{border-color:var(--nv-muted)}",
    ".nthview-nav:disabled{opacity:.45;cursor:default}",
    ".nthview-nav.nthview-primary{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--sq-on-accent);font-weight:600}",
    ".nthview-chips{display:flex;flex-wrap:wrap;gap:4px;flex:1;justify-content:center}",
    ".nthview-chip{position:relative;min-width:28px;height:28px;padding:0 .3rem;font-family:var(--sq-mono);font-size:.72rem;border:1px solid var(--nv-border);background:var(--sq-panel);color:var(--nv-muted);border-radius:.4rem;cursor:pointer}",
    ".nthview-chip[aria-current=step]{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--sq-on-accent)}",
    ".nthview-chip.nthview-alt-chip{border-style:dashed}",
    ".nthview-chip.nthview-has-check::after{content:'';position:absolute;top:-3px;right:-3px;width:7px;height:7px;border-radius:50%;background:var(--h-amber);border:1px solid var(--sq-panel)}",
    ".nthview-chip.nthview-check-done::after{background:var(--h-green)}",
    /* card */
    ".nthview-card,.nthview-check,.nthview-recap{background:var(--sq-panel);border:1px solid var(--nv-border);border-radius:.7rem;padding:1.1rem 1.2rem}",
    ".nthview-card.nthview-fade{animation:nthview-fade .3s ease}",
    "@keyframes nthview-fade{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}",
    ".nthview-meta{display:flex;align-items:center;flex-wrap:wrap;gap:.4rem .5rem;margin-bottom:.55rem}",
    ".nthview-idx{font-family:var(--sq-mono);font-size:.78rem;color:var(--nv-muted)}",
    ".nthview-badge{display:inline-flex;align-items:center;gap:.35rem;font-size:.75rem;padding:.12rem .55rem;border-radius:.35rem;font-weight:600;background:var(--t-slate);color:var(--h-slate);line-height:1.5}",
    ".nthview-badge i{width:8px;height:8px;border-radius:50%;background:currentColor;display:inline-block}",
    ".nthview-badge.nthview-plain{background:transparent;border:1px solid var(--nv-border);color:var(--nv-muted);font-weight:500}",
    ".nthview-route{display:flex;flex-wrap:wrap;align-items:center;gap:.3rem .5rem;font-size:.85rem;color:var(--nv-muted);margin:0 0 .35rem}",
    ".nthview-route b{color:var(--nv-fg);font-weight:600}",
    ".nthview-route svg{width:16px;height:16px;vertical-align:-3px;margin-right:.2rem}",
    ".nthview-route code{font-size:.8rem}",
    ".nthview-card h2,.nthview-check h2,.nthview-recap h2{font-family:var(--sq-head);font-size:1.22rem;line-height:1.3;margin:.1rem 0 .7rem;font-weight:650;letter-spacing:-.005em}",
    ".nthview-frag{display:flex;flex-wrap:wrap;gap:.35rem .6rem;align-items:baseline;font-size:.82rem;color:var(--nv-muted);margin:0 0 .5rem}",
    ".nthview-frag b{font-family:var(--sq-mono);font-size:.74rem;border:1px solid var(--nv-border);border-radius:.3rem;padding:0 .35rem;color:var(--nv-fg)}",
    ".nthview-altnote{border:1px dashed var(--h-violet);background:var(--t-violet);color:var(--nv-fg);border-radius:.5rem;padding:.55rem .8rem;margin:0 0 .75rem;font-size:.9rem}",
    ".nthview-wire{font-family:var(--sq-mono);font-size:.8rem;line-height:1.65;background:var(--sq-soft);border:1px solid var(--nv-border);border-left:3px solid var(--h-slate);border-radius:0 .45rem .45rem 0;padding:.75rem .9rem;margin:0;white-space:pre-wrap;overflow-wrap:anywhere;tab-size:2}",
    ".nthview-why{margin:.8rem 0 0;max-width:74ch}",
    ".nthview-compare{margin-top:.8rem;padding:.7rem .9rem;border-radius:.5rem;background:var(--t-amber);color:var(--nv-fg);border-left:3px solid var(--h-amber);font-size:.92rem}",
    ".nthview-compare>b:first-child{color:var(--h-amber)}",
    ".nthview-note{display:flex;gap:.6rem;margin-top:.8rem;padding:.65rem .85rem;border-radius:.5rem;font-size:.92rem;border:1px solid currentColor;background:var(--t-blue);color:var(--h-blue)}",
    ".nthview-note>div{color:var(--nv-fg)}",
    ".nthview-note svg{flex:none;width:18px;height:18px;margin-top:.15rem}",
    ".nthview-note.nthview-sev-warning{background:var(--t-amber);color:var(--h-amber)}",
    ".nthview-note.nthview-sev-danger{background:var(--t-red);color:var(--h-red)}",
    ".nthview-sevb-info{background:var(--t-blue);color:var(--h-blue)}",
    ".nthview-sevb-warning{background:var(--t-amber);color:var(--h-amber)}",
    ".nthview-sevb-danger{background:var(--t-red);color:var(--h-red)}",
    ".nthview-details{margin-top:.9rem;border:1px solid var(--nv-border);border-radius:.5rem;background:var(--sq-soft)}",
    ".nthview-details summary{padding:.6rem .85rem;cursor:pointer;font-size:.88rem;font-weight:600;color:var(--nv-accent);list-style:none;display:flex;align-items:center;gap:.5rem}",
    ".nthview-details summary::-webkit-details-marker{display:none}",
    ".nthview-details summary::before{content:'';border-left:5px solid currentColor;border-top:4px solid transparent;border-bottom:4px solid transparent;transition:transform .15s}",
    ".nthview-details[open] summary::before{transform:rotate(90deg)}",
    ".nthview-drows{margin:0;padding:.1rem .85rem .6rem;border-top:1px solid var(--nv-border)}",
    ".nthview-drow{display:grid;grid-template-columns:9.5rem 1fr;gap:.6rem;padding:.5rem 0;border-bottom:1px dashed var(--nv-border)}",
    ".nthview-drow:last-child{border-bottom:0}",
    ".nthview-drow dt{font-size:.78rem;color:var(--nv-muted);padding-top:.1rem}",
    ".nthview-drow dd{margin:0;font-size:.9rem}",
    ".nthview-holds{margin-top:1rem;padding-top:.85rem;border-top:1px solid var(--nv-border)}",
    ".nthview-holds h3,.nthview-recap h3{font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;color:var(--nv-muted);margin:0 0 .55rem;font-weight:600}",
    ".nthview-hgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(10.5rem,1fr));gap:.7rem}",
    ".nthview-hcol h4{margin:0 0 .3rem;font-size:.82rem;font-weight:600;display:flex;align-items:center;gap:.3rem}",
    ".nthview-hcol h4 svg{width:15px;height:15px;color:var(--nv-muted)}",
    ".nthview-pills{display:flex;flex-wrap:wrap;gap:.25rem}",
    ".nthview-pill{font-family:var(--sq-mono);font-size:.7rem;padding:.08rem .45rem;border-radius:.3rem;background:var(--t-slate);color:var(--nv-fg);border:1px solid transparent;overflow-wrap:anywhere}",
    ".nthview-pill.nthview-new{background:var(--sq-hi);border-color:var(--nv-accent);color:var(--nv-fg);font-weight:600}",
    ".nthview-pill.nthview-new::before{content:'+ ';color:var(--nv-accent)}",
    ".nthview-pill.nthview-gone{background:transparent;border:1px dashed var(--nv-border);color:var(--nv-muted);text-decoration:line-through}",
    ".nthview-none{font-size:.78rem;color:var(--nv-muted)}",
    ".nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".nthview-toggle{display:inline-flex;align-items:center;gap:.5rem;font-size:.88rem;color:var(--nv-muted);cursor:pointer;margin-top:.9rem}",
    ".nthview-toggle input{accent-color:var(--nv-accent);width:16px;height:16px}",
    ".nthview-hint{font-size:.8rem;color:var(--nv-muted);margin:.7rem 0 0}",
    ".nthview-legend{display:flex;flex-wrap:wrap;gap:.35rem 1rem;margin:.7rem 0 0;padding:0;list-style:none;font-size:.8rem;color:var(--nv-muted)}",
    ".nthview-legend li{display:flex;align-items:center;gap:.4rem}",
    ".nthview-legend i{display:inline-block;width:22px;border-top:3px solid currentColor}",
    /* checks */
    ".nthview-check{margin-bottom:.8rem;border-color:var(--h-amber)}",
    ".nthview-check-label{font-size:.72rem;letter-spacing:.1em;text-transform:uppercase;color:var(--h-amber);font-weight:700;margin:0 0 .2rem}",
    ".nthview-opts{list-style:none;margin:0;padding:0;display:grid;gap:.45rem}",
    ".nthview-opts.nthview-who{grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr))}",
    ".nthview-opt{width:100%;text-align:left;display:flex;align-items:center;gap:.6rem;border:1px solid var(--nv-border);background:var(--sq-soft);padding:.6rem .8rem;border-radius:.5rem;cursor:pointer}",
    ".nthview-opt:hover{border-color:var(--nv-accent)}",
    ".nthview-opt svg{width:20px;height:20px;flex:none;color:var(--nv-muted)}",
    ".nthview-opt .nthview-key{font-family:var(--sq-mono);font-size:.75rem;border:1px solid var(--nv-border);border-radius:.3rem;padding:0 .35rem;flex:none}",
    ".nthview-opt.nthview-right{border-color:var(--h-green);background:var(--t-green)}",
    ".nthview-opt.nthview-wrong{border-color:var(--h-red);background:var(--t-red)}",
    ".nthview-opt-tag{margin-left:auto;font-size:.72rem;font-weight:700;white-space:nowrap}",
    ".nthview-right .nthview-opt-tag{color:var(--h-green)}",
    ".nthview-wrong .nthview-opt-tag{color:var(--h-red)}",
    ".nthview-fb{margin-top:.75rem;padding:.7rem .9rem;border-radius:.5rem;border-left:3px solid var(--h-green);background:var(--t-green)}",
    ".nthview-fb.nthview-no{border-left-color:var(--h-red);background:var(--t-red)}",
    ".nthview-fb h3{margin:0 0 .25rem;font-size:.95rem}",
    ".nthview-fb p{margin:.25rem 0 0;font-size:.92rem}",
    ".nthview-check-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.75rem}",
    ".nthview-ghost{border:1px solid var(--nv-border);background:transparent;padding:.42rem .8rem;border-radius:.5rem;cursor:pointer;font-size:.88rem;color:var(--nv-muted)}",
    /* recap */
    ".nthview-recap-list{margin:0 0 1rem;padding:0;list-style:none;counter-reset:none;display:grid;gap:.2rem}",
    ".nthview-recap-list button{width:100%;display:grid;grid-template-columns:2rem 1fr;gap:.5rem;text-align:left;border:0;background:transparent;padding:.4rem .5rem;border-radius:.4rem;cursor:pointer}",
    ".nthview-recap-list button:hover{background:var(--sq-soft)}",
    ".nthview-recap-n{font-family:var(--sq-mono);font-size:.78rem;color:var(--nv-muted);padding-top:.1rem}",
    ".nthview-recap-route{display:block;font-size:.8rem;color:var(--nv-muted)}",
    ".nthview-recap-route i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:.35rem;vertical-align:0}",
    ".nthview-recap-route code{font-size:.76rem}",
    ".nthview-recap-alt{font-size:.7rem;border:1px dashed var(--h-violet);color:var(--h-violet);border-radius:.3rem;padding:0 .3rem;margin-left:.35rem}",
    ".nthview-recap-checks{margin:0 0 1rem;padding-left:1.1rem;font-size:.9rem}",
    ".nthview-recap-checks li{margin:.25rem 0}",
    ".nthview-ok-t{color:var(--h-green);font-weight:600}",
    ".nthview-no-t{color:var(--h-red);font-weight:600}",
    ".nthview-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}",
    /* diagram */
    ".nthview-dtools{display:flex;flex-wrap:wrap;align-items:center;gap:.45rem;margin:0 0 .6rem}",
    ".nthview-dtools .nthview-zoomv{font-family:var(--sq-mono);font-size:.8rem;color:var(--nv-muted);min-width:3.2rem;text-align:center}",
    ".nthview-dtools .nthview-spacer{flex:1}",
    ".nthview-dpanel{background:var(--sq-panel);border:1px solid var(--nv-border);border-radius:.7rem;overflow:auto;max-height:75vh;overscroll-behavior:contain;-webkit-overflow-scrolling:touch}",
    ".nthview-dpanel svg{display:block}",
    ".nthview-dsvg text{font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;fill:var(--nv-fg)}",
    ".nthview-dsvg .nthview-mono{font-family:var(--sq-mono)}",
    ".nthview-dsvg .nthview-muted-t{fill:var(--nv-muted)}",
    ".nthview-arrow{cursor:pointer}",
    ".nthview-sequence .nthview-arrow:focus,.nthview-sequence .nthview-arrow:focus-visible{outline:none}",
    ".nthview-arrow .nthview-hit{fill:transparent;stroke:none}",
    ".nthview-arrow:hover .nthview-hit{fill:var(--sq-soft)}",
    ".nthview-arrow:focus-visible .nthview-hit{stroke:var(--nv-accent);stroke-width:1.5;stroke-dasharray:4 3}",
    ".nthview-arrow.nthview-cur .nthview-hit{fill:var(--sq-hi)}",
    ".nthview-arrow.nthview-cur .nthview-line{stroke-width:3}",
    ".nthview-arrow.nthview-cur .nthview-lbl{stroke:var(--nv-accent);stroke-width:1.5}",
    ".nthview-dlegend{margin-top:.6rem;font-size:.8rem;color:var(--nv-muted)}",
    ".nthview-dlegend p{margin:.35rem 0 0}",
    ".nthview-kinds{display:flex;flex-wrap:wrap;gap:.35rem 1.1rem;margin:.45rem 0 0;padding:0;list-style:none}",
    ".nthview-kinds li{display:flex;align-items:center;gap:.4rem}",
    ".nthview-kinds svg{width:40px;height:12px;color:var(--nv-fg)}",
    /* glossary */
    ".nthview-term{border-bottom:1.5px dotted currentColor;cursor:help;text-decoration:none}",
    ".nthview-term:hover{color:var(--nv-accent)}",
    ".nthview-pop{position:absolute;z-index:30;max-width:min(22rem,calc(100% - 24px));background:var(--sq-panel);color:var(--nv-fg);border:1px solid var(--nv-border);border-radius:.55rem;padding:.6rem .8rem;font-size:.88rem;box-shadow:0 8px 24px rgba(0,0,0,.18)}",
    ".nthview-pop b{display:block;margin-bottom:.15rem}",
    ".nthview-scrim{position:fixed;inset:0;background:rgba(0,0,0,.35);opacity:0;pointer-events:none;transition:opacity .2s;z-index:40}",
    ".nthview-scrim.nthview-open{opacity:1;pointer-events:auto}",
    ".nthview-drawer{position:fixed;top:0;right:0;bottom:0;width:min(24rem,92vw);background:var(--sq-panel);color:var(--nv-fg);border-left:1px solid var(--nv-border);z-index:41;transform:translateX(105%);transition:transform .25s ease;overflow:auto;padding:1rem 1.1rem;visibility:hidden}",
    ".nthview-drawer.nthview-open{transform:none;visibility:visible}",
    ".nthview-drawer-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:.6rem}",
    ".nthview-drawer-head h2{margin:0;font-size:1.1rem;font-family:var(--sq-head)}",
    ".nthview-gloss dt{font-weight:700;margin-top:.7rem}",
    ".nthview-gloss dd{margin:.15rem 0 0;color:var(--nv-muted)}",
    /* progress storage (§5.5): Restart control and resume notice */
    ".nthview-resume{margin:0 0 .8rem;padding:.5rem .8rem;border-radius:.5rem;background:var(--sq-hi);border:1px solid var(--nv-accent);font-size:.88rem;transition:opacity .4s}",
    ".nthview-resume.nthview-resume-hide{opacity:0}",
    ".nthview-sequence [hidden]{display:none!important}",
    /* small screens */
    "@media (max-width:700px){",
    "  .nthview-sequence{padding:.9rem .75rem 2.5rem}",
    "  .nthview-title{font-size:1.3rem}",
    "  .nthview-lane{margin:0 .12rem;padding:.35rem .15rem}",
    "  .nthview-lane small{display:none}",
    "  .nthview-lane b{font-size:.72rem}",
    "  .nthview-zonelabel{font-size:.6rem;letter-spacing:.04em}",
    "  .nthview-controls{flex-wrap:wrap}",
    "  .nthview-chips{order:3;flex-basis:100%}",
    "  .nthview-controls .nthview-nav{flex:1}",
    "  .nthview-card,.nthview-check,.nthview-recap{padding:.85rem .8rem}",
    "  .nthview-drow{grid-template-columns:1fr;gap:.1rem}",
    "  .nthview-wire{font-size:.74rem;padding:.6rem .65rem}",
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
    other: [["circle", { cx: 12, cy: 12, r: 8 }], ["circle", { cx: 12, cy: 12, r: 2.2 }]]
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
      close: "M6 6l12 12M18 6 6 18"
    };
    return sv("svg", { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round", "aria-hidden": "true", focusable: "false" }, [sv("path", { d: paths[name] })]);
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

  /* Holds: cumulative from participants[].holds; removes before adds; a non-first alt branch
     starts from the state before the alt and does not carry forward. Mirrors validate.js. */
  function computeHolds(data) {
    var steps = data.steps, N = steps.length, frags = data.fragments || [];
    var state = {};
    data.participants.forEach(function (pt) { state[pt.id] = (pt.holds || []).slice(); });
    function clone(st) { var o = {}; Object.keys(st).forEach(function (k) { o[k] = st[k].slice(); }); return o; }
    var alts = frags.map(function (f, i) { return { f: f, i: i }; }).filter(function (x) { return x.f.kind === "alt"; });
    var startSnap = {}, firstEnd = {}, after = [], added = [], removed = [];
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
    return { after: after, added: added, removed: removed, final: clone(state) };
  }

  /* For each step: the fragments around it, outermost first, with the alt branch it sits in. */
  function fragmentInfo(data) {
    var frags = (data.fragments || []).map(function (f, i) { return { f: f, i: i }; });
    frags.sort(function (a, b) { return a.f.start - b.f.start || (b.f.end - b.f.start) - (a.f.end - a.f.start) || a.i - b.i; });
    return data.steps.map(function (s, k) {
      return frags.filter(function (x) { return k >= x.f.start && k <= x.f.end; }).map(function (x) {
        var branch = -1;
        if (x.f.kind === "alt") x.f.branches.forEach(function (b, bi) { if (k >= b.start && k <= b.end) branch = bi; });
        return { f: x.f, i: x.i, branch: branch };
      });
    });
  }

  function render(container, data) {
    var doc = root.document;
    var reduceMotion = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var P = data.participants, S = data.steps, N = S.length, C = {};
    var PI = {}; P.forEach(function (p, i) { PI[p.id] = i; });
    data.channels.forEach(function (c) { C[c.id] = c; });
    var GLOSS = {}; (data.glossary || []).forEach(function (g) { GLOSS[g.term.trim().toLowerCase()] = g; });
    var HOLDS = computeHolds(data), FRAG = fragmentInfo(data);
    var anyCompare = S.some(function (s) { return !!s.compare; });
    var holders = P.filter(function (p) {
      if ((p.holds || []).length) return true;
      return S.some(function (s) { return s.holds && s.holds[p.id] && (s.holds[p.id].add || []).length; });
    });
    var key = storageKey(data);
    var state = { step: 0, mode: "step", zoom: "fit", compare: false, details: false, checks: {}, summarySeen: false };
    container.setAttribute("data-theme", pickTheme(data));

    function hue(c) { return "var(--h-" + c + ")"; }
    function tint(c) { return "var(--t-" + c + ")"; }
    function chColor(s) { return C[s.channel].color; }
    function nameOf(id) { return P[PI[id]].name; }

    /* ---------- progress (§5.5) ---------- */
    function untouched() { return state.step === 0 && state.mode === "step" && !Object.keys(state.checks).length && !state.compare && !state.details && state.zoom === "fit"; }
    function persist() {
      if (untouched()) return;
      saveState(key, { step: state.step, mode: state.mode, zoom: state.zoom, compare: state.compare, details: state.details, checks: state.checks, summarySeen: state.summarySeen });
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
    var headText = el("div", { class: "nthview-head-text" }, [el("p", { class: "nthview-eyebrow", text: "Sequence · " + N + " steps · " + P.length + " parties" }), el("h1", { class: "nthview-title", text: data.title })]);
    if (data.subtitle) headText.appendChild(para("nthview-sub", data.subtitle));
    var bStep = el("button", { type: "button", "aria-pressed": "true", text: "Step by step" });
    var bDiag = el("button", { type: "button", "aria-pressed": "false", text: "Full diagram" });
    bStep.addEventListener("click", function () { setMode("step"); });
    bDiag.addEventListener("click", function () { setMode("diagram"); });
    var toolbar = el("div", { class: "nthview-toolbar" }, [el("div", { class: "nthview-seg", role: "group", "aria-label": "View mode" }, [bStep, bDiag])]);
    var glossBtn = null;
    if ((data.glossary || []).length) {
      glossBtn = el("button", { type: "button", class: "nthview-tbtn", "aria-expanded": "false", text: "Glossary" });
      toolbar.appendChild(glossBtn);
    }
    toolbar.appendChild(restartButton(container, data, key));
    var header = el("header", { class: "nthview-head" }, [headText, toolbar]);
    var progBar = el("span");
    var prog = el("div", { class: "nthview-progress", role: "progressbar", "aria-label": "Progress through the sequence", "aria-valuemin": "0", "aria-valuemax": String(N) }, [progBar]);
    container.appendChild(header);
    var resumeSlot = el("div");
    container.appendChild(resumeSlot);
    container.appendChild(prog);

    /* ---------- step mode: stage ---------- */
    var cols = "repeat(" + P.length + ",minmax(0,1fr))";
    var stage = el("div", { class: "nthview-stage" });
    var zones = data.zones || [], ZI = {}; zones.forEach(function (z, i) { ZI[z.id] = z; });
    /* contiguous runs of the same zone */
    var runs = [];
    P.forEach(function (p, i) {
      var z = p.zone || null, last = runs[runs.length - 1];
      if (last && last.zone === z) last.n++; else runs.push({ zone: z, start: i, n: 1 });
    });
    if (zones.length) {
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
      stage.appendChild(zbg); stage.appendChild(zrow);
    }
    var lanes = el("div", { class: "nthview-lanes" }); lanes.style.gridTemplateColumns = cols;
    var laneEls = P.map(function (p) {
      var l = el("div", { class: "nthview-lane", title: p.name + (p.role ? " — " + p.role : "") }, [glyph(p.kind || "other"), el("b", { text: p.name })]);
      if (p.role) l.appendChild(el("small", { text: p.role }));
      lanes.appendChild(l); return l;
    });
    stage.appendChild(lanes);
    var track = el("div", { class: "nthview-track", "aria-hidden": "true" });
    var rails = el("div", { class: "nthview-rails" }); rails.style.gridTemplateColumns = cols;
    P.forEach(function () { rails.appendChild(el("div", { class: "nthview-rail" })); });
    track.appendChild(rails);
    var flight = el("div", { class: "nthview-flight" });
    var packet = el("div", { class: "nthview-packet" });
    var loop = el("div", { class: "nthview-loop" });
    var payload = el("div", { class: "nthview-payload" });
    var waiting = el("div", { class: "nthview-waiting", text: "Answer the check below to see this message." });
    [flight, packet, loop, payload, waiting].forEach(function (n) { track.appendChild(n); });
    stage.appendChild(track);

    var back = el("button", { type: "button", class: "nthview-nav", text: "Back" });
    var next = el("button", { type: "button", class: "nthview-nav nthview-primary", text: "Next" });
    var chipsBox = el("div", { class: "nthview-chips", role: "group", "aria-label": "Steps" });
    var chips = S.map(function (s, i) {
      var inAltSide = FRAG[i].some(function (x) { return x.f.kind === "alt" && x.branch > 0; });
      var c = el("button", { type: "button", class: "nthview-chip" + (s.check ? " nthview-has-check" : "") + (inAltSide ? " nthview-alt-chip" : ""), text: String(i + 1), "aria-label": "Step " + (i + 1) + ": " + s.title + (inAltSide ? " (alternative path)" : "") + (s.check ? " (has a check)" : "") });
      c.addEventListener("click", function () { go(i); });
      chipsBox.appendChild(c); return c;
    });
    var endChip = el("button", { type: "button", class: "nthview-chip", text: "End", "aria-label": "Recap of the whole sequence" });
    endChip.addEventListener("click", function () { go(N); });
    chipsBox.appendChild(endChip); chips.push(endChip);
    back.addEventListener("click", function () { go(state.step - 1); });
    next.addEventListener("click", function () {
      var s = S[state.step];
      if (s && s.check && !state.checks[state.step]) { state.checks[state.step] = { skipped: true }; persist(); renderStep(true); status.textContent = "Check skipped. Step " + (state.step + 1) + " shown."; return; }
      go(state.step + 1);
    });
    var controls = el("div", { class: "nthview-controls" }, [back, chipsBox, next]);
    var cardSlot = el("div", { "aria-live": "off" });
    var cmpBox = null, cmpToggle = null;
    if (anyCompare) {
      cmpBox = el("input", { type: "checkbox" });
      cmpBox.addEventListener("change", function () { state.compare = cmpBox.checked; persist(); renderStep(false); });
      cmpToggle = el("label", { class: "nthview-toggle" }, [cmpBox, el("span", { text: data.compareLabel || "Show the comparison" })]);
    }
    var hint = el("p", { class: "nthview-hint", text: "Arrow keys step through, Home and End jump. The colour of an arrow is its channel; a dashed arrow is a reply." });
    var legend = channelLegend();
    var stepMode = el("section", { class: "nthview-stepmode", "aria-label": "Step by step" }, [stage, controls, cardSlot]);
    if (cmpToggle) stepMode.appendChild(cmpToggle);
    stepMode.appendChild(legend);
    stepMode.appendChild(hint);
    container.appendChild(stepMode);

    function channelLegend() {
      var ul = el("ul", { class: "nthview-legend", "aria-label": "Channels" });
      data.channels.forEach(function (c) {
        var li = el("li", { title: c.description || c.name }, [el("i"), el("span", { text: c.name })]);
        li.querySelector("i").style.color = hue(c.color);
        ul.appendChild(li);
      });
      return ul;
    }

    /* ---------- step mode: flight ---------- */
    function laneX(i) { return (i + 0.5) / P.length * 100; }
    function showFlight(s, animate) {
      var k = stepKind(s), color = hue(chColor(s));
      var a = PI[s.from], b = PI[s.to];
      [flight, packet, loop, payload].forEach(function (n) { n.style.color = color; });
      waiting.hidden = true;
      payload.textContent = s.payload; payload.hidden = false;
      laneEls.forEach(function (l, i) { l.classList.toggle("nthview-on", i === a || i === b); l.classList.toggle("nthview-sender", i === a); });
      if (k === "self") {
        flight.hidden = true; packet.classList.remove("nthview-go"); packet.hidden = true;
        loop.hidden = false; loop.textContent = ""; loop.appendChild(headTip("sync"));
        loop.style.left = laneX(a) + "%";
        placeLabel(laneX(a) + 2, true);
        return;
      }
      loop.hidden = true; flight.hidden = false; packet.hidden = false;
      var fwd = b > a, lo = Math.min(a, b), hi = Math.max(a, b);
      flight.className = "nthview-flight nthview-k-" + k + " " + (fwd ? "nthview-fwd" : "nthview-rev");
      flight.textContent = ""; flight.appendChild(headTip(k));
      placeLabel((laneX(lo) + laneX(hi)) / 2, false);
      if (!animate || reduceMotion) {
        flight.style.transition = "none"; packet.style.transition = "none";
        flight.style.left = laneX(lo) + "%"; flight.style.width = (laneX(hi) - laneX(lo)) + "%";
        packet.classList.remove("nthview-go");
        void flight.offsetWidth;
        flight.style.transition = ""; packet.style.transition = "";
        return;
      }
      /* grow from the sender to the receiver; the packet rides along */
      flight.style.transition = "none"; packet.style.transition = "none";
      flight.style.left = laneX(a) + "%"; flight.style.width = "0%";
      packet.style.left = laneX(a) + "%"; packet.classList.add("nthview-go");
      void flight.offsetWidth;
      flight.style.transition = ""; packet.style.transition = "";
      setTimeout(function () {
        flight.style.left = laneX(lo) + "%"; flight.style.width = (laneX(hi) - laneX(lo)) + "%";
        packet.style.left = laneX(b) + "%";
        setTimeout(function () { packet.classList.remove("nthview-go"); }, 700);
      }, 20);
    }
    function placeLabel(pct, leftAligned) {
      payload.style.left = "0px"; payload.style.transform = "none";
      var tw = track.clientWidth || 1, w = payload.offsetWidth, x = pct / 100 * tw;
      if (leftAligned) x = x + 26; else x = x - w / 2;
      if (leftAligned && x + w > tw - 4) x = pct / 100 * tw - 10 - w;
      x = Math.max(4, Math.min(tw - w - 4, x));
      payload.style.left = x + "px";
    }
    function hideFlight() {
      flight.hidden = true; packet.hidden = true; loop.hidden = true; payload.hidden = true;
      laneEls.forEach(function (l) { l.classList.remove("nthview-on", "nthview-sender"); });
    }

    /* ---------- the step card ---------- */
    function badge(text, c, extra) {
      var b = el("span", { class: "nthview-badge" + (extra ? " " + extra : "") }, [el("i"), el("span", { text: text })]);
      if (c) { b.style.background = tint(c); b.style.color = hue(c); }
      return b;
    }
    function holdsStrip(i, atEnd) {
      var box = el("div", { class: "nthview-holds" }, [el("h3", { text: atEnd ? "Where everyone ends up" : "What each party holds now" })]);
      var grid = el("div", { class: "nthview-hgrid" });
      var st = atEnd ? HOLDS.final : HOLDS.after[i], add = atEnd ? {} : HOLDS.added[i], rem = atEnd ? {} : HOLDS.removed[i];
      holders.forEach(function (p) {
        var items = st[p.id] || [], pills = el("div", { class: "nthview-pills" });
        items.forEach(function (x) {
          var isNew = (add[p.id] || []).indexOf(x) !== -1;
          var pill = el("span", { class: "nthview-pill" + (isNew ? " nthview-new" : ""), text: x });
          if (isNew) pill.appendChild(el("span", { class: "nthview-sr", text: " (new at this step)" }));
          pills.appendChild(pill);
        });
        (rem[p.id] || []).forEach(function (x) {
          var pill = el("span", { class: "nthview-pill nthview-gone", text: x });
          pill.appendChild(el("span", { class: "nthview-sr", text: " (given up at this step)" }));
          pills.appendChild(pill);
        });
        if (!pills.childNodes.length) pills.appendChild(el("span", { class: "nthview-none", text: "nothing yet" }));
        grid.appendChild(el("div", { class: "nthview-hcol" }, [el("h4", {}, [glyph(p.kind || "other"), el("span", { text: p.name })]), pills]));
      });
      box.appendChild(grid);
      return box;
    }
    function stepCard(i) {
      var s = S[i], c = chColor(s), k = stepKind(s);
      var card = el("article", { class: "nthview-card", "aria-labelledby": "nthview-step-title" });
      var meta = el("div", { class: "nthview-meta" }, [el("span", { class: "nthview-idx", text: pad2(i + 1, 2) + " / " + pad2(N, 2) }), badge(C[s.channel].name, c)]);
      meta.appendChild(el("span", { class: "nthview-badge nthview-plain", text: KIND_NAMES[k] }));
      if (s.note) meta.appendChild(el("span", { class: "nthview-badge nthview-sevb-" + s.note.severity, text: s.note.severity === "danger" ? "Security-critical" : s.note.severity === "warning" ? "Watch out" : "Note" }));
      card.appendChild(meta);
      var route = el("p", { class: "nthview-route" });
      var fp = P[PI[s.from]], tp = P[PI[s.to]];
      var fromB = el("b", {}, [glyph(fp.kind || "other"), doc.createTextNode(fp.name)]);
      route.appendChild(fromB);
      if (k === "self") route.appendChild(el("span", { text: "works on its own" }));
      else { route.appendChild(el("span", { text: k === "return" ? "replies to" : "→" })); route.appendChild(el("b", {}, [glyph(tp.kind || "other"), doc.createTextNode(tp.name)])); }
      route.appendChild(el("span", { text: "·" }));
      route.appendChild(el("span", {}, [doc.createTextNode("carries "), el("code", { text: s.payload })]));
      card.appendChild(route);
      FRAG[i].forEach(function (x) {
        var f = x.f, line = el("p", { class: "nthview-frag" }, [el("b", { text: f.kind })]);
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
      card.appendChild(el("h2", { id: "nthview-step-title", tabindex: "-1", text: s.title }));
      if (s.wire) { var w = el("pre", { class: "nthview-wire", "aria-label": "What travels" }, [el("code", { text: s.wire })]); w.firstChild.style.cssText = "background:none;border:0;padding:0;font-size:1em"; w.style.borderLeftColor = hue(c); card.appendChild(w); }
      card.appendChild(para("nthview-why", s.why));
      if (s.compare && state.compare) {
        var cmp = el("div", { class: "nthview-compare" }, [el("b", { text: s.compare.label + ": " })]);
        cmp.appendChild(rich(s.compare.text)); card.appendChild(cmp);
      }
      if (s.note) {
        var nd = el("div"); nd.appendChild(rich(s.note.text));
        card.appendChild(el("div", { class: "nthview-note nthview-sev-" + s.note.severity, role: "note" }, [icon(s.note.severity), nd]));
      }
      if (s.detail) {
        var det = el("details", { class: "nthview-details" });
        if (state.details) det.setAttribute("open", "");
        det.appendChild(el("summary", { text: "What's involved in this step" }));
        var dl = el("dl", { class: "nthview-drows" });
        s.detail.forEach(function (d) { var dd = el("dd"); dd.appendChild(rich(d.text)); dl.appendChild(el("div", { class: "nthview-drow" }, [el("dt", { text: d.label }), dd])); });
        det.appendChild(dl);
        det.addEventListener("toggle", function () { state.details = det.open; persist(); });
        card.appendChild(det);
      }
      if (holders.length) card.appendChild(holdsStrip(i, false));
      return card;
    }

    /* ---------- checks: learning first, a wrong pick explains and reveals ---------- */
    function checkPanel(i) {
      var s = S[i], ck = s.check, ans = state.checks[i];
      var box = el("section", { class: "nthview-check", "aria-label": "Check before step " + (i + 1) });
      box.appendChild(el("p", { class: "nthview-check-label", text: ans ? "Check · step " + (i + 1) : "Before you see step " + (i + 1) }));
      var h = el("h2", { tabindex: "-1" }); h.appendChild(rich(ck.type === "who" ? (ck.prompt || "Who sends the next message?") : ck.prompt)); box.appendChild(h);
      var opts = el("ul", { class: "nthview-opts" + (ck.type === "who" ? " nthview-who" : "") });
      var correctIdx = ck.type === "who" ? PI[ck.answer] : ck.options.map(function (o) { return !!o.correct; }).indexOf(true);
      var list = ck.type === "who" ? P : ck.options;
      list.forEach(function (o, j) {
        var b = el("button", { type: "button", class: "nthview-opt" });
        if (ck.type === "who") { b.appendChild(glyph(o.kind || "other")); b.appendChild(el("span", { text: o.name })); }
        else { b.appendChild(el("span", { class: "nthview-key", "aria-hidden": "true", text: LETTERS[j] })); var t = el("span"); t.appendChild(rich(o.text)); b.appendChild(t); }
        if (ans && !ans.skipped) {
          if (j === correctIdx) { b.classList.add("nthview-right"); b.appendChild(el("span", { class: "nthview-opt-tag", text: j === ans.picked ? "Your pick, right" : "Right answer" })); }
          else if (j === ans.picked) { b.classList.add("nthview-wrong"); b.appendChild(el("span", { class: "nthview-opt-tag", text: "Your pick" })); }
        } else if (ans && ans.skipped && j === correctIdx) { b.classList.add("nthview-right"); b.appendChild(el("span", { class: "nthview-opt-tag", text: "Right answer" })); }
        if (ans) b.setAttribute("aria-disabled", "true");
        else b.addEventListener("click", function () { answer(i, j, j === correctIdx); });
        opts.appendChild(el("li", {}, [b]));
      });
      box.appendChild(opts);
      if (ans) {
        var fb = el("div", { class: "nthview-fb" + (ans.correct ? "" : " nthview-no"), role: "status" });
        var right = ck.type === "who" ? P[correctIdx].name : ck.options[correctIdx].text;
        fb.appendChild(el("h3", { text: ans.skipped ? "Skipped. The answer: " + right : ans.correct ? "Right." : "Not quite. The answer: " + right }));
        if (ck.type === "choice") {
          if (!ans.skipped && !ans.correct) fb.appendChild(para("", "**Your pick:** " + ck.options[ans.picked].why));
          fb.appendChild(para("", (ans.correct ? "" : "**Why the answer is right:** ") + ck.options[correctIdx].why));
        } else {
          if (!ans.skipped && !ans.correct) fb.appendChild(para("", P[ans.picked].name + " does not send this one; " + P[correctIdx].name + " does."));
          if (ck.why) fb.appendChild(para("", ck.why));
        }
        box.appendChild(fb);
      } else {
        box.appendChild(el("p", { class: "nthview-hint", text: "Take a guess. A wrong one is fine: you get the explanation and the step straight away." }));
        var skip = el("button", { type: "button", class: "nthview-ghost", text: "Just show me the step" });
        skip.addEventListener("click", function () { state.checks[i] = { skipped: true }; persist(); renderStep(true); });
        box.appendChild(el("div", { class: "nthview-check-actions" }, [skip]));
      }
      return { node: box, focus: h };
    }
    function answer(i, j, ok) {
      state.checks[i] = { picked: j, correct: ok };
      persist();
      status.textContent = ok ? "Right." : "Not quite; the answer and the step are shown.";
      renderStep(true, true);
    }

    /* ---------- recap ---------- */
    function recap() {
      var box = el("section", { class: "nthview-recap", "aria-labelledby": "nthview-recap-title" });
      box.appendChild(el("h2", { id: "nthview-recap-title", tabindex: "-1", text: "The whole sequence" }));
      box.appendChild(el("p", { class: "nthview-sub", text: N + " steps between " + P.length + " parties. Select a line to revisit that step." }));
      var ol = el("ol", { class: "nthview-recap-list" });
      S.forEach(function (s, i) {
        var k = stepKind(s), route = el("span", { class: "nthview-recap-route" });
        var dot = el("i"); dot.style.background = hue(chColor(s)); route.appendChild(dot);
        route.appendChild(doc.createTextNode(k === "self" ? nameOf(s.from) + " (on its own) · " : nameOf(s.from) + (k === "return" ? " ⇢ " : " → ") + nameOf(s.to) + " · "));
        route.appendChild(el("code", { text: s.payload }));
        if (FRAG[i].some(function (x) { return x.f.kind === "alt" && x.branch > 0; })) route.appendChild(el("span", { class: "nthview-recap-alt", text: "alternative" }));
        var b = el("button", { type: "button" }, [el("span", { class: "nthview-recap-n", text: pad2(i + 1, 2) }), el("span", {}, [el("span", { text: s.title }), route])]);
        b.addEventListener("click", function () { go(i); });
        ol.appendChild(el("li", {}, [b]));
      });
      box.appendChild(ol);
      if (holders.length) box.appendChild(holdsStrip(N - 1, true));
      var checked = S.map(function (s, i) { return s.check ? i : -1; }).filter(function (i) { return i >= 0; });
      if (checked.length) {
        var right = 0, wrong = 0, skipped = 0, open = 0;
        checked.forEach(function (i) { var a = state.checks[i]; if (!a) open++; else if (a.skipped) skipped++; else if (a.correct) right++; else wrong++; });
        box.appendChild(el("h3", { text: "Your checks" }));
        box.appendChild(el("p", { text: right + " of " + checked.length + " right first time" + (wrong ? ", " + wrong + " learned on the way" : "") + (skipped ? ", " + skipped + " skipped" : "") + (open ? ", " + open + " not reached" : "") + ". Nothing here is a score; the checks are there to make you predict." }));
        var cl = el("ul", { class: "nthview-recap-checks" });
        checked.forEach(function (i) {
          var s = S[i], a = state.checks[i], li = el("li");
          li.appendChild(el("span", { text: "Step " + (i + 1) + ": " }));
          li.appendChild(rich(s.check.type === "who" ? (s.check.prompt || "Who sends the next message?") : s.check.prompt));
          li.appendChild(doc.createTextNode(" "));
          li.appendChild(el("span", { class: !a || a.skipped ? "" : a.correct ? "nthview-ok-t" : "nthview-no-t", text: !a ? "(not reached)" : a.skipped ? "(skipped)" : a.correct ? "Right" : "Not quite" }));
          cl.appendChild(li);
        });
        box.appendChild(cl);
      }
      (data.closing || []).forEach(function (t) { box.appendChild(para("", t)); });
      var toDiag = el("button", { type: "button", class: "nthview-nav nthview-primary", text: "See the full diagram" });
      toDiag.addEventListener("click", function () { setMode("diagram"); });
      var again = el("button", { type: "button", class: "nthview-nav", text: "Start again" });
      again.addEventListener("click", function () { clearState(key); state.checks = {}; state.summarySeen = false; state.compare = false; state.details = false; state.zoom = "fit"; if (cmpBox) cmpBox.checked = false; buildDiagram(); go(0); });
      box.appendChild(el("div", { class: "nthview-actions" }, [toDiag, again]));
      return box;
    }

    /* ---------- step mode render ---------- */
    function renderStep(animate, keepCheckFocus) {
      var i = state.step;
      closePop();
      chips.forEach(function (c, k) {
        if (k === i) c.setAttribute("aria-current", "step"); else c.removeAttribute("aria-current");
        if (k < N && S[k].check) c.classList.toggle("nthview-check-done", !!state.checks[k]);
      });
      progBar.style.width = Math.round(Math.min(i + 1, N) / N * 100) + "%";
      prog.setAttribute("aria-valuenow", String(Math.min(i + 1, N)));
      back.disabled = i === 0;
      next.disabled = i >= N;
      cardSlot.textContent = "";
      var focusEl = null;
      if (i >= N) {
        hideFlight(); waiting.hidden = true;
        next.textContent = "Next";
        var r = recap(); cardSlot.appendChild(r); focusEl = r.querySelector("h2");
        if (cmpToggle) cmpToggle.hidden = true;
        status.textContent = "Recap of the whole sequence.";
        return focusEl;
      }
      if (cmpToggle) { cmpToggle.hidden = false; cmpBox.checked = state.compare; }
      var s = S[i];
      var pending = s.check && !state.checks[i];
      next.textContent = pending ? "Show step" : i === N - 1 ? "Recap" : "Next";
      if (s.check) {
        var cp = checkPanel(i); cardSlot.appendChild(cp.node);
        if (pending || keepCheckFocus) focusEl = cp.focus;
      }
      if (pending) { hideFlight(); waiting.hidden = false; status.textContent = "Step " + (i + 1) + " of " + N + ": a check comes first."; return focusEl; }
      showFlight(s, animate);
      var card = stepCard(i); if (animate) card.classList.add("nthview-fade"); cardSlot.appendChild(card);
      if (!focusEl) focusEl = card.querySelector("h2");
      if (!keepCheckFocus) status.textContent = "Step " + (i + 1) + " of " + N + ": " + s.title;
      return focusEl;
    }

    function go(i, opts) {
      opts = opts || {};
      i = Math.max(0, Math.min(N, i));
      var moved = i !== state.step;
      state.step = i;
      if (i >= N) state.summarySeen = true;
      persist();
      if (state.mode === "diagram") { highlightDiagram(true); return; }
      var f = renderStep(moved || opts.animate);
      if (f && opts.focus !== false && moved) setTimeout(function () { if (!stepMode.contains(doc.activeElement) || doc.activeElement === doc.body || chips.indexOf(doc.activeElement) === -1) f.focus({ preventScroll: true }); }, 30);
    }

    /* ---------- full diagram ---------- */
    var zoomOut = el("button", { type: "button", class: "nthview-tbtn", "aria-label": "Zoom out", text: "−" });
    var zoomIn = el("button", { type: "button", class: "nthview-tbtn", "aria-label": "Zoom in", text: "+" });
    var zoomFit = el("button", { type: "button", class: "nthview-tbtn", text: "Fit" });
    var zoomVal = el("span", { class: "nthview-zoomv", "aria-live": "polite" });
    var toStep = el("button", { type: "button", class: "nthview-tbtn" });
    toStep.addEventListener("click", function () { setMode("step"); });
    var dpanel = el("div", { class: "nthview-dpanel", tabindex: "0", role: "region", "aria-label": "Sequence diagram, scrollable" });
    var diagMode = el("section", { class: "nthview-diagmode", "aria-label": "Full diagram", hidden: "" }, [
      el("div", { class: "nthview-dtools" }, [zoomOut, zoomVal, zoomIn, zoomFit, el("span", { class: "nthview-spacer" }), toStep]),
      dpanel,
      diagramLegend()
    ]);
    container.appendChild(diagMode);
    var D = null; /* { svg, w, h, arrows[], rows[] } */

    function diagramLegend() {
      var box = el("div", { class: "nthview-dlegend" });
      box.appendChild(channelLegend());
      var kinds = el("ul", { class: "nthview-kinds", "aria-label": "Arrow kinds" });
      [["sync", "call: the sender waits"], ["async", "async message: no waiting"], ["return", "reply"]].forEach(function (k) {
        var s = sv("svg", { viewBox: "0 0 40 12", "aria-hidden": "true", focusable: "false" });
        s.appendChild(sv("line", { x1: 2, y1: 6, x2: 34, y2: 6, stroke: "currentColor", "stroke-width": 2, "stroke-dasharray": k[0] === "return" ? "5 4" : "none" }));
        s.appendChild(k[0] === "sync" ? sv("path", { d: "M30 1.5 39 6 30 10.5z", fill: "currentColor" }) : sv("path", { d: "M31 1.5 39 6 31 10.5", fill: "none", stroke: "currentColor", "stroke-width": 2 }));
        kinds.appendChild(el("li", {}, [s, el("span", { text: k[1] })]));
      });
      box.appendChild(kinds);
      box.appendChild(el("p", { text: "Thin bars on a lifeline show when that party is busy: each run of consecutive steps it takes part in. Frames mark alt (one branch or another), opt (only sometimes) and loop (repeats). Shaded bands are trust zones. Select any arrow to open that step." }));
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
    function clip(text, n) { text = String(text); return text.length > n ? text.slice(0, n - 1) + "…" : text; }

    function buildDiagram() {
      var COL = 184, PADX = 28, HEADH = 70, ZONEH = zones.length ? 24 : 0, CW = 7.25;
      var nP = P.length;
      function cx(i) { return PADX + COL * (i + 0.5); }
      var W = PADX * 2 + nP * COL;
      /* label geometry first: a self step's label sits right of its loop and may widen the canvas */
      var labels = S.map(function (s) {
        var k = stepKind(s), a = PI[s.from], b = PI[s.to];
        var span = Math.abs(cx(b) - cx(a));
        var txt = clip(s.payload, k === "self" ? 40 : Math.max(26, Math.floor((span - 40) / CW)));
        var w = txt.length * CW + 30;
        if (k === "self") { var bx = cx(a) + 50; W = Math.max(W, bx + w + 12); return { txt: txt, w: w, x: bx }; }
        return { txt: txt, w: w, mid: (cx(a) + cx(b)) / 2 };
      });
      labels.forEach(function (l) { if (l.mid !== undefined) l.x = Math.max(4, Math.min(W - l.w - 4, l.mid - l.w / 2)); });
      var frags = (data.fragments || []).map(function (f, i) { return { f: f, i: i }; });
      /* nesting height: how many levels sit inside each fragment */
      function inside(a, b) { return a !== b && a.f.start >= b.f.start && a.f.end <= b.f.end && (a.f.start !== b.f.start || a.f.end !== b.f.end || a.i > b.i); }
      function levels(x) { var m = 0; frags.forEach(function (y) { if (inside(y, x)) m = Math.max(m, 1 + levels(y)); }); return m; }
      frags.forEach(function (x) { x.lv = levels(x); });

      var y = ZONEH + 10 + HEADH + 22, rows = [], fy = {};
      S.forEach(function (s, i) {
        var row = {};
        /* fragments opening here, outermost first */
        frags.filter(function (x) { return x.f.start === i; }).sort(function (a, b) { return b.lv - a.lv || a.i - b.i; }).forEach(function (x) {
          fy[x.i] = { y0: y, guards: [] }; y += 24;
          fy[x.i].guards.push({ y: y, text: x.f.kind === "alt" ? x.f.branches[0].condition : x.f.condition }); y += 16;
        });
        frags.forEach(function (x) {
          if (x.f.kind !== "alt") return;
          x.f.branches.forEach(function (br, k) { if (k > 0 && br.start === i) { fy[x.i].guards.push({ y: y + 4, text: br.condition, divider: y - 4 }); y += 26; } });
        });
        var k = stepKind(s), a = PI[s.from], b = PI[s.to], L = labels[i];
        row.y = y; row.h = k === "self" ? 66 : 52; row.arrowY = y + (k === "self" ? 24 : 34);
        row.x0 = Math.min(cx(a), cx(b), L.x) - 14; row.x1 = Math.max(cx(a), cx(b) + (k === "self" ? 46 : 0), L.x + L.w) + 6;
        y += row.h;
        if (s.note) {
          var lines = wrapText(s.note.text, 52, 5), nw = 344;
          if (k !== "self") nw = Math.max(nw, Math.abs(cx(b) - cx(a)) + 40);
          var nx = k === "self" ? cx(a) - 24 : (cx(a) + cx(b)) / 2 - nw / 2;
          nx = Math.max(8, Math.min(W - nw - 8, nx));
          row.note = { y: y + 2, lines: lines, h: lines.length * 15 + 14, x: nx, w: nw };
          row.x0 = Math.min(row.x0, nx); row.x1 = Math.max(row.x1, nx + nw);
          y += row.note.h + 10;
        }
        rows.push(row);
        frags.filter(function (x) { return x.f.end === i; }).sort(function (a, b) { return a.lv - b.lv || b.i - a.i; }).forEach(function (x) { y += 10; fy[x.i].y1 = y; });
      });
      var bottomHeads = N > 8;
      var lifeEnd = y + 14;
      var H = lifeEnd + (bottomHeads ? HEADH + 16 : 12);

      var svgEl = sv("svg", { class: "nthview-dsvg", viewBox: "0 0 " + W + " " + H, role: "group", "aria-label": "Sequence diagram of " + N + " steps between " + nP + " parties" });
      svgEl.appendChild(sv("title", { text: data.title + ": full sequence diagram" }));
      var gBack = sv("g"), gZones = sv("g", { "aria-hidden": "true" }), gLife = sv("g", { "aria-hidden": "true" }), gFr = sv("g", { "aria-hidden": "true" }), gAct = sv("g", { "aria-hidden": "true" }), gFrTop = sv("g", { "aria-hidden": "true" }), gNotes = sv("g", { "aria-hidden": "true" }), gArr = sv("g"), gHead = sv("g", { "aria-hidden": "true" });
      [gBack, gZones, gLife, gFr, gAct, gFrTop, gNotes, gArr, gHead].forEach(function (g) { svgEl.appendChild(g); });
      gBack.appendChild(sv("rect", { x: 0, y: 0, width: W, height: H, fill: "var(--sq-panel)" }));

      /* zones */
      var zk = 0;
      runs.forEach(function (r) {
        if (!r.zone) return;
        var x0 = cx(r.start) - COL / 2 + 5, w = r.n * COL - 10;
        if (r.start + r.n === nP) w = Math.max(w, W - x0 - 6);
        gZones.appendChild(sv("rect", { x: x0, y: 6, width: w, height: H - 12, rx: 10, fill: zk++ % 2 ? "var(--sq-zone-b)" : "var(--sq-zone-a)", stroke: "var(--nv-border)", "stroke-dasharray": "5 4" }));
        gZones.appendChild(sv("text", { x: x0 + (r.n * COL - 10) / 2, y: 22, "text-anchor": "middle", "font-size": 10.5, "font-weight": 600, "letter-spacing": "1.2", class: "nthview-muted-t", text: clip(ZI[r.zone].name.toUpperCase(), Math.floor((r.n * COL - 10) / 8)) }));
      });

      /* participant heads and lifelines */
      function head(i, top) {
        var p = P[i], w = COL - 22, x0 = cx(i) - w / 2, tx = x0 + 38, room = w - 44;
        var g = sv("g");
        g.appendChild(sv("rect", { x: x0, y: top, width: w, height: HEADH - 8, rx: 8, fill: "var(--sq-panel)", stroke: "var(--nv-fg)", "stroke-width": 1.3 }));
        var gl = glyph(p.kind || "other", { x: x0 + 9, y: top + (HEADH - 8) / 2 - 11, width: 22, height: 22 }); gl.style.color = "var(--nv-muted)";
        g.appendChild(gl);
        var nameLines = wrapText(p.name, Math.floor(room / 7.3), 2);
        var roleLines = p.role ? wrapText(p.role, Math.floor(room / 5.7), 3 - nameLines.length) : [];
        var total = nameLines.length * 15 + roleLines.length * 13, ty = top + (HEADH - 8 - total) / 2 + 11;
        nameLines.forEach(function (t) { g.appendChild(sv("text", { x: tx, y: ty, "font-size": 13, "font-weight": 650, text: t })); ty += 15; });
        roleLines.forEach(function (t) { g.appendChild(sv("text", { x: tx, y: ty, "font-size": 10.5, class: "nthview-muted-t", text: t })); ty += 13; });
        g.appendChild(sv("title", { text: p.name + (p.role ? ": " + p.role : "") }));
        gHead.appendChild(g);
      }
      P.forEach(function (p, i) {
        head(i, ZONEH + 10);
        gLife.appendChild(sv("line", { x1: cx(i), y1: ZONEH + 10 + HEADH - 8, x2: cx(i), y2: lifeEnd, stroke: "var(--nv-muted)", "stroke-width": 1.2, "stroke-dasharray": "4 5" }));
        if (bottomHeads) head(i, lifeEnd);
      });

      /* activation bars: each run of consecutive steps a party takes part in */
      P.forEach(function (p, pi) {
        var startI = -1;
        for (var i = 0; i <= N; i++) {
          var involved = i < N && (PI[S[i].from] === pi || PI[S[i].to] === pi);
          if (involved && startI === -1) startI = i;
          if (!involved && startI !== -1) {
            var a = rows[startI], b = rows[i - 1];
            var y0 = a.arrowY - 10, y1 = (stepKind(S[i - 1]) === "self" ? b.arrowY + 26 : b.arrowY) + 10;
            gAct.appendChild(sv("rect", { x: cx(pi) - 5, y: y0, width: 10, height: Math.max(16, y1 - y0), fill: "var(--sq-soft)", stroke: "var(--nv-fg)", "stroke-width": 1 }));
            startI = -1;
          }
        }
        S.forEach(function (s, i) {
          if (stepKind(s) === "self" && PI[s.from] === pi) gAct.appendChild(sv("rect", { x: cx(pi) + 1, y: rows[i].arrowY + 4, width: 10, height: 26, fill: "var(--sq-hi)", stroke: "var(--nv-fg)", "stroke-width": 1 }));
        });
      });

      /* fragments: frame below the bars, tab and guards above them */
      frags.forEach(function (x) {
        var f = x.f, lo = Infinity, hi = -Infinity;
        for (var i = f.start; i <= f.end; i++) { lo = Math.min(lo, rows[i].x0); hi = Math.max(hi, rows[i].x1); }
        var padF = 14 + 10 * x.lv;
        var x0 = Math.max(4, lo - padF), x1 = Math.min(W - 4, hi + padF);
        var need = 260;
        fy[x.i].guards.forEach(function (g) { need = Math.max(need, g.text.length * 6.3 + 40); });
        need = Math.min(need, W - 8);
        if (x1 - x0 < need) { var grow = (need - (x1 - x0)) / 2; x0 = x0 - grow; x1 = x1 + grow; if (x0 < 4) { x1 += 4 - x0; x0 = 4; } if (x1 > W - 4) { x0 = Math.max(4, x0 - (x1 - W + 4)); x1 = W - 4; } }
        var y0 = fy[x.i].y0, y1 = fy[x.i].y1;
        var col = f.kind === "alt" ? "var(--h-violet)" : f.kind === "loop" ? "var(--h-teal)" : "var(--h-blue)";
        gFr.appendChild(sv("rect", { x: x0, y: y0, width: x1 - x0, height: y1 - y0, rx: 4, fill: "none", stroke: col, "stroke-width": 1.4 }));
        var tag = f.kind + (f.label ? "  " + f.label : ""), tw = Math.min(x1 - x0 - 10, tag.length * 7 + 22);
        gFrTop.appendChild(sv("path", { d: "M" + x0 + " " + y0 + "h" + tw + "v12l-8 8H" + x0 + "z", fill: col }));
        gFrTop.appendChild(sv("text", { x: x0 + 7, y: y0 + 14.5, "font-size": 11.5, "font-weight": 700, style: "fill:var(--sq-panel)", text: clip(tag, Math.floor((tw - 12) / 7)) }));
        fy[x.i].guards.forEach(function (g) {
          if (g.divider !== undefined) gFr.appendChild(sv("line", { x1: x0, y1: g.divider, x2: x1, y2: g.divider, stroke: col, "stroke-width": 1.2, "stroke-dasharray": "6 4" }));
          var gt = "[" + clip(g.text, Math.floor((x1 - x0 - 24) / 6.3)) + "]";
          gFrTop.appendChild(sv("rect", { x: x0 + 6, y: g.y - 4, width: Math.min(x1 - x0 - 12, gt.length * 6.3 + 8), height: 16, rx: 3, fill: "var(--sq-panel)", opacity: ".92" }));
          gFrTop.appendChild(sv("text", { x: x0 + 10, y: g.y + 8, "font-size": 11.5, "font-style": "italic", style: "fill:" + col, text: gt }));
        });
      });

      /* arrows */
      var arrows = S.map(function (s, i) {
        var k = stepKind(s), a = PI[s.from], b = PI[s.to], row = rows[i], col = hue(chColor(s)), L = labels[i];
        var g = sv("g", { class: "nthview-arrow", role: "button", tabindex: "-1", "aria-label": "Step " + (i + 1) + ": " + (k === "self" ? nameOf(s.from) + " on its own" : nameOf(s.from) + " to " + nameOf(s.to)) + ", " + s.payload + ". " + s.title + ". Open in step mode." });
        g.appendChild(sv("rect", { class: "nthview-hit", x: row.x0, y: row.y + 2, width: row.x1 - row.x0, height: row.h - 4, rx: 6 }));
        var ly;
        if (k === "self") {
          var x = cx(a) + 6, yy = row.arrowY;
          g.appendChild(sv("path", { class: "nthview-line", d: "M" + x + " " + yy + "h34a13 13 0 0 1 0 26H" + (x + 12), fill: "none", stroke: col, "stroke-width": 2 }));
          g.appendChild(sv("path", { d: "M" + (x + 13) + " " + (yy + 21.5) + " " + (x + 5) + " " + (yy + 26) + " " + (x + 13) + " " + (yy + 30.5) + "z", fill: col }));
          ly = yy + 17;
        } else {
          var dir = b > a ? 1 : -1, x1 = cx(a) + dir * 5, x2 = cx(b) - dir * 6, yy2 = row.arrowY;
          g.appendChild(sv("line", { class: "nthview-line", x1: x1, y1: yy2, x2: x2 - dir * 2, y2: yy2, stroke: col, "stroke-width": 2, "stroke-dasharray": k === "return" ? "7 5" : "none" }));
          if (k === "sync") g.appendChild(sv("path", { d: "M" + x2 + " " + yy2 + "l" + (-dir * 11) + " -5.5v11z", fill: col }));
          else g.appendChild(sv("path", { d: "M" + (x2 - dir * 10) + " " + (yy2 - 5.5) + "L" + x2 + " " + yy2 + "L" + (x2 - dir * 10) + " " + (yy2 + 5.5), fill: "none", stroke: col, "stroke-width": 2, "stroke-linecap": "round", "stroke-linejoin": "round" }));
          ly = yy2 - 12;
        }
        var bx = L.x, lg = sv("g");
        lg.appendChild(sv("rect", { class: "nthview-lbl", x: bx, y: ly - 13, width: L.w, height: 19, rx: 9.5, fill: "var(--sq-panel)", stroke: col, "stroke-width": 1 }));
        lg.appendChild(sv("circle", { cx: bx + 10, cy: ly - 3.5, r: 7.5, fill: col }));
        lg.appendChild(sv("text", { x: bx + 10, y: ly, "text-anchor": "middle", "font-size": i >= 9 ? 8.5 : 9.5, "font-weight": 700, style: "fill:var(--sq-panel)", text: String(i + 1) }));
        lg.appendChild(sv("text", { x: bx + 22, y: ly + 0.5, "font-size": 12, class: "nthview-mono", text: L.txt }));
        g.appendChild(lg);
        g.appendChild(sv("title", { text: (i + 1) + ". " + s.title }));
        function open() { state.step = i; persist(); setMode("step"); }
        g.addEventListener("click", open);
        g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.stopPropagation(); open(); } });
        g.addEventListener("focus", function () { if (state.step !== i && state.mode === "diagram") { state.step = i; persist(); highlightDiagram(false); } });
        gArr.appendChild(g);
        return g;
      });

      /* notes: folded-corner boxes under their step */
      S.forEach(function (s, i) {
        var n = rows[i].note; if (!n) return;
        var c = s.note.severity === "danger" ? "red" : s.note.severity === "warning" ? "amber" : "blue";
        gNotes.appendChild(sv("path", { d: "M" + n.x + " " + n.y + "h" + (n.w - 12) + "l12 12v" + (n.h - 12) + "H" + n.x + "z", fill: tint(c), stroke: hue(c), "stroke-width": 1.1 }));
        gNotes.appendChild(sv("path", { d: "M" + (n.x + n.w - 12) + " " + n.y + "v12h12", fill: "none", stroke: hue(c), "stroke-width": 1.1 }));
        n.lines.forEach(function (line, k) {
          gNotes.appendChild(sv("text", { x: n.x + 10, y: n.y + 18 + k * 15, "font-size": 11.5, text: line }));
        });
      });
      dpanel.textContent = "";
      dpanel.appendChild(svgEl);
      D = { svg: svgEl, w: W, h: H, arrows: arrows, rows: rows };
      applyZoom();
    }

    function fitZoom() { var pw = dpanel.clientWidth || container.clientWidth || 800; return Math.max(0.7, Math.min(1.25, (pw - 2) / D.w)); }
    function currentZoom() { return state.zoom === "fit" ? fitZoom() : state.zoom; }
    function applyZoom() {
      if (!D) return;
      var z = currentZoom();
      D.svg.setAttribute("width", String(Math.round(D.w * z)));
      D.svg.setAttribute("height", String(Math.round(D.h * z)));
      zoomVal.textContent = Math.round(z * 100) + "%";
      zoomFit.setAttribute("aria-pressed", String(state.zoom === "fit"));
    }
    function setZoom(z) { state.zoom = z === "fit" ? "fit" : Math.round(Math.max(0.4, Math.min(2.5, z)) * 10) / 10; applyZoom(); persist(); highlightDiagram(true); }
    zoomIn.addEventListener("click", function () { setZoom(currentZoom() + 0.2); });
    zoomOut.addEventListener("click", function () { setZoom(currentZoom() - 0.2); });
    zoomFit.addEventListener("click", function () { setZoom("fit"); });

    function highlightDiagram(scroll) {
      if (!D) return;
      var i = Math.min(state.step, N - 1);
      D.arrows.forEach(function (g, k) {
        g.classList.toggle("nthview-cur", k === i && state.step < N);
        g.setAttribute("tabindex", k === i ? "0" : "-1");
      });
      toStep.textContent = state.step < N ? "Open step " + (state.step + 1) + " in step mode" : "Back to the recap";
      progBar.style.width = Math.round(Math.min(state.step + 1, N) / N * 100) + "%";
      if (scroll && state.step < N) {
        var z = currentZoom(), r = D.rows[i], top = r.y * z, ph = dpanel.clientHeight;
        if (top < dpanel.scrollTop + 20 || top + r.h * z > dpanel.scrollTop + ph - 20) dpanel.scrollTop = Math.max(0, top - ph / 3);
        var a = PI[S[i].from], b = PI[S[i].to], xm = (28 + ((a + b) / 2 + 0.5) * 184) * z, pw = dpanel.clientWidth;
        if (xm < dpanel.scrollLeft + 40 || xm > dpanel.scrollLeft + pw - 40) dpanel.scrollLeft = Math.max(0, xm - pw / 2);
      }
    }

    function setMode(m) {
      state.mode = m;
      bStep.setAttribute("aria-pressed", String(m === "step"));
      bDiag.setAttribute("aria-pressed", String(m === "diagram"));
      stepMode.hidden = m !== "step";
      diagMode.hidden = m !== "diagram";
      persist();
      if (m === "diagram") {
        if (!D) buildDiagram(); else applyZoom();
        highlightDiagram(true);
        status.textContent = "Full diagram. Arrow keys move between steps; Enter opens one.";
        var cur = D.arrows[Math.min(state.step, N - 1)];
        setTimeout(function () { if (cur && state.mode === "diagram") cur.focus({ preventScroll: true }); }, 30);
      } else {
        var f = renderStep(true);
        setTimeout(function () { if (f) f.focus({ preventScroll: true }); }, 30);
      }
    }
    function onResize() { if (D && state.zoom === "fit" && state.mode === "diagram" && container.isConnected) applyZoom(); }
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
      data.glossary.forEach(function (g) { dl.appendChild(el("dt", { text: g.term })); var dd = el("dd"); dd.appendChild(rich(g.definition)); dl.appendChild(dd); });
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
    /* keys work from the page body too, so the learner need not click into the view first */
    function onKey(e) {
      if (!container.isConnected || !(e.target === doc.body || e.target === doc.documentElement || container.contains(e.target))) return;
      if (e.key === "Escape") { if (closeGlossary() || pop) { closePop(); e.preventDefault(); } return; }
      if (drawer && drawer.classList.contains("nthview-open")) return;
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      var diag = state.mode === "diagram", d = 0;
      if (e.key === "ArrowRight" || (diag && e.key === "ArrowDown")) d = 1;
      else if (e.key === "ArrowLeft" || (diag && e.key === "ArrowUp")) d = -1;
      else if (e.key === "Home") { e.preventDefault(); go(0); if (diag) D.arrows[0].focus({ preventScroll: true }); return; }
      else if (e.key === "End") { e.preventDefault(); go(diag ? N - 1 : N); if (diag) D.arrows[N - 1].focus({ preventScroll: true }); return; }
      if (!d) return;
      e.preventDefault();
      if (diag) { var to = Math.max(0, Math.min(N - 1, Math.min(state.step, N - 1) + d)); go(to); D.arrows[to].focus({ preventScroll: true }); }
      else if (d > 0) next.click(); else if (state.step > 0) go(state.step - 1);
    }
    if (container.__nthviewSeqKeys) doc.removeEventListener("keydown", container.__nthviewSeqKeys);
    container.__nthviewSeqKeys = onKey;
    doc.addEventListener("keydown", onKey);

    container.appendChild(status);

    /* ---------- restore saved progress; fields that no longer fit are ignored ---------- */
    var saved = loadState(key);
    if (saved) {
      if (Number.isInteger(saved.step) && saved.step >= 0 && saved.step <= N) state.step = saved.step;
      if (saved.mode === "step" || saved.mode === "diagram") state.mode = saved.mode;
      if (saved.zoom === "fit" || (typeof saved.zoom === "number" && saved.zoom >= 0.4 && saved.zoom <= 2.5)) state.zoom = saved.zoom;
      state.compare = saved.compare === true; state.details = saved.details === true; state.summarySeen = saved.summarySeen === true;
      if (saved.checks && typeof saved.checks === "object") {
        Object.keys(saved.checks).forEach(function (k) {
          var i = parseInt(k, 10), a = saved.checks[k], s = S[i];
          if (!s || !s.check || String(i) !== k || !a || typeof a !== "object") return;
          if (a.skipped === true) { state.checks[i] = { skipped: true }; return; }
          var n = s.check.type === "who" ? P.length : s.check.options.length;
          if (!Number.isInteger(a.picked) || a.picked < 0 || a.picked >= n) return;
          var ok = s.check.type === "who" ? P[a.picked].id === s.check.answer : !!s.check.options[a.picked].correct;
          state.checks[i] = { picked: a.picked, correct: ok };
        });
      }
    }
    if (state.mode === "diagram") setMode("diagram"); else { renderStep(false); }
    if (saved && !untouched()) {
      var where = state.step >= N ? "the recap" : "step " + (state.step + 1) + " of " + N;
      resumeSlot.appendChild(resumeNotice("Welcome back, continuing from " + where + (state.mode === "diagram" ? " in the full diagram" : "") + "."));
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
