/* NthView — compare renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first. No external libraries.
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";

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
    ".nthview-compare{--nv-bg:#f7f7f5;--nv-surface:#fff;--nv-soft:#f0efeb;--nv-fg:#1c1b19;--nv-muted:#5d5a54;--nv-border:#dedbd4;--nv-accent:#3b5bdb;--nv-ok:#15803d;--nv-ok-soft:#e5f4ea;--nv-bad:#c2410c;--nv-bad-soft:#fdeee4;--nv-shadow:0 1px 2px rgba(0,0,0,.05),0 4px 14px rgba(0,0,0,.05);max-width:76rem;padding:1rem 1rem 3rem;min-height:100vh;overflow-wrap:break-word}",
    "@media (prefers-color-scheme:dark){.nthview-compare{--nv-bg:#121316;--nv-surface:#1b1d22;--nv-soft:#23262d;--nv-fg:#ebe9e4;--nv-muted:#a6a39c;--nv-border:#30333b;--nv-accent:#8ea2ff;--nv-ok:#4ade80;--nv-ok-soft:#13291c;--nv-bad:#fb923c;--nv-bad-soft:#2e1c12;--nv-shadow:none}}",
    ".nthview-compare .nthview-c-blue{--oc:#2563eb;--ocs:#e8effd}.nthview-compare .nthview-c-teal{--oc:#0f766e;--ocs:#e2f4f2}.nthview-compare .nthview-c-amber{--oc:#b45309;--ocs:#fbf0df}",
    ".nthview-compare .nthview-c-rose{--oc:#be123c;--ocs:#fce7ec}.nthview-compare .nthview-c-violet{--oc:#6d28d9;--ocs:#efe9fc}.nthview-compare .nthview-c-green{--oc:#15803d;--ocs:#e5f4ea}",
    "@media (prefers-color-scheme:dark){.nthview-compare .nthview-c-blue{--oc:#7aa7ff;--ocs:#18243d}.nthview-compare .nthview-c-teal{--oc:#4fd1c5;--ocs:#10302d}.nthview-compare .nthview-c-amber{--oc:#fbbf24;--ocs:#33270f}.nthview-compare .nthview-c-rose{--oc:#fb7185;--ocs:#361820}.nthview-compare .nthview-c-violet{--oc:#b39dfa;--ocs:#261d3d}.nthview-compare .nthview-c-green{--oc:#4ade80;--ocs:#13291c}}",
    ".nthview-compare h1,.nthview-compare h2,.nthview-compare h3{line-height:1.2;margin:0}",
    ".nthview-compare p{margin:.4rem 0}",
    ".nthview-compare button{font:inherit;color:inherit;cursor:pointer}",
    ".nthview-compare a{color:var(--nv-accent)}",
    ".nthview-head{display:flex;gap:1rem;align-items:flex-start;justify-content:space-between;margin:.25rem 0 .75rem}",
    ".nthview-title{font-size:clamp(1.35rem,4vw,2.1rem);letter-spacing:-.01em}",
    ".nthview-sub{color:var(--nv-muted);margin:.35rem 0 0}",
    ".nthview-restart{flex:none;border:1px solid var(--nv-border);background:var(--nv-surface);border-radius:999px;padding:.4rem .9rem;font-size:.9rem;min-height:2.5rem}",
    ".nthview-restart:hover{border-color:var(--nv-accent)}",
    ".nthview-tabs{position:sticky;top:0;z-index:5;display:flex;gap:.25rem;overflow-x:auto;scrollbar-width:none;background:var(--nv-bg);border-bottom:1px solid var(--nv-border);margin:0 -1rem 1rem;padding:.4rem 1rem 0}",
    ".nthview-tabs::-webkit-scrollbar{display:none}",
    ".nthview-tab{flex:none;border:0;background:none;padding:.55rem .8rem .65rem;border-bottom:3px solid transparent;color:var(--nv-muted);font-weight:600;min-height:2.75rem;display:flex;gap:.4rem;align-items:center}",
    ".nthview-tab[aria-selected=true]{color:var(--nv-fg);border-bottom-color:var(--nv-accent)}",
    ".nthview-tab .nthview-count{font-size:.75rem;font-weight:700;background:var(--nv-soft);border-radius:999px;padding:.05rem .45rem;color:var(--nv-muted)}",
    ".nthview-resume{background:var(--nv-surface);border:1px solid var(--nv-border);border-left:4px solid var(--nv-accent);border-radius:.6rem;padding:.6rem .9rem;margin:0 0 1rem;font-weight:600;transition:opacity .4s}",
    ".nthview-resume-hide{opacity:0}",
    ".nthview-card{background:var(--nv-surface);border:1px solid var(--nv-border);border-radius:.9rem;padding:1rem 1.1rem;box-shadow:var(--nv-shadow)}",
    ".nthview-grid{display:grid;gap:.85rem;grid-template-columns:repeat(auto-fit,minmax(15rem,1fr))}",
    ".nthview-stack>*+*{margin-top:1rem}",
    ".nthview-h2{font-size:1.2rem;margin:1.6rem 0 .7rem}",
    ".nthview-kicker{font-size:.75rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--nv-muted);margin:0 0 .3rem}",
    ".nthview-focus{font-size:clamp(1.1rem,3vw,1.4rem);font-weight:650;margin:.2rem 0 .6rem}",
    ".nthview-muted{color:var(--nv-muted)}",
    ".nthview-small{font-size:.88rem}",
    ".nthview-optcard{border-top:5px solid var(--oc)}",
    ".nthview-optcard h3{color:var(--oc);font-size:1.1rem}",
    ".nthview-aka{font-size:.85rem;color:var(--nv-muted);margin:.15rem 0 .35rem}",
    ".nthview-dot{display:inline-block;width:.7rem;height:.7rem;border-radius:50%;background:var(--oc);flex:none}",
    ".nthview-way{display:flex;flex-direction:column;align-items:flex-start;gap:.3rem;text-align:left;border:1px solid var(--nv-border);background:var(--nv-surface);border-radius:.9rem;padding:.9rem 1rem;min-height:3rem;box-shadow:var(--nv-shadow)}",
    ".nthview-way:hover{border-color:var(--nv-accent)}",
    ".nthview-way b{font-size:1.02rem}",
    ".nthview-way span{color:var(--nv-muted);font-size:.9rem}",
    ".nthview-way.nthview-rec{border:2px solid var(--nv-accent)}",
    ".nthview-pill{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.04em;text-transform:uppercase;border-radius:999px;padding:.1rem .5rem;background:var(--nv-soft);color:var(--nv-muted)}",
    ".nthview-pill.nthview-alike{background:var(--nv-ok-soft);color:var(--nv-ok)}",
    ".nthview-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0}",
    ".nthview-chip{border:1px solid var(--nv-border);background:var(--nv-surface);border-radius:999px;padding:.35rem .75rem;min-height:2.5rem;display:inline-flex;gap:.4rem;align-items:center;font-size:.92rem}",
    ".nthview-chip[aria-pressed=true]{border-color:var(--oc,var(--nv-accent));background:var(--ocs,var(--nv-soft));font-weight:650}",
    ".nthview-chip[aria-pressed=false]{opacity:.7}",
    ".nthview-chip[aria-pressed=false] .nthview-dot{background:transparent;border:2px solid var(--oc)}",
    ".nthview-controls{display:flex;flex-wrap:wrap;gap:.6rem 1.2rem;align-items:center;margin:0 0 1rem}",
    ".nthview-seg{display:inline-flex;border:1px solid var(--nv-border);border-radius:.6rem;overflow:hidden;background:var(--nv-surface)}",
    ".nthview-seg button{border:0;background:none;padding:.4rem .75rem;min-height:2.5rem;font-size:.9rem;color:var(--nv-muted)}",
    ".nthview-seg button+button{border-left:1px solid var(--nv-border)}",
    ".nthview-seg button[aria-pressed=true]{background:var(--nv-accent);color:var(--nv-bg);font-weight:650}",
    ".nthview-ctl-label{font-size:.78rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--nv-muted);display:block;margin-bottom:.2rem}",
    ".nthview-switch{display:inline-flex;align-items:center;gap:.5rem;border:1px solid var(--nv-border);background:var(--nv-surface);border-radius:999px;padding:.35rem .8rem;min-height:2.5rem;font-size:.9rem}",
    ".nthview-switch[aria-pressed=true]{border-color:var(--nv-accent);background:var(--nv-soft);font-weight:650}",
    ".nthview-switch i{width:2rem;height:1.1rem;border-radius:999px;background:var(--nv-border);position:relative;flex:none}",
    ".nthview-switch i:after{content:'';position:absolute;top:.15rem;left:.15rem;width:.8rem;height:.8rem;border-radius:50%;background:var(--nv-surface);transition:left .15s}",
    ".nthview-switch[aria-pressed=true] i{background:var(--nv-accent)}.nthview-switch[aria-pressed=true] i:after{left:1.05rem}",
    ".nthview-testbar{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;background:var(--nv-soft);border-radius:.7rem;padding:.6rem .8rem;margin:0 0 1rem}",
    ".nthview-testbar p{margin:0;flex:1 1 14rem}",
    ".nthview-btn{border:1px solid var(--nv-border);background:var(--nv-surface);border-radius:.6rem;padding:.5rem 1rem;min-height:2.75rem;font-weight:600}",
    ".nthview-btn:hover:not([disabled]){border-color:var(--nv-accent)}",
    ".nthview-btn[disabled]{opacity:.45;cursor:not-allowed}",
    ".nthview-primary{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--nv-bg)}",
    ".nthview-tablewrap{overflow:auto;max-width:100%;max-height:calc(100vh - 4rem);border:1px solid var(--nv-border);border-radius:.9rem;background:var(--nv-surface);box-shadow:var(--nv-shadow)}",
    ".nthview-matrix{border-collapse:separate;border-spacing:0;width:100%;min-width:34rem;table-layout:fixed}",
    ".nthview-matrix th,.nthview-matrix td{padding:.65rem .75rem;text-align:left;vertical-align:top;border-bottom:1px solid var(--nv-border)}",
    ".nthview-matrix tr:last-child>*{border-bottom:0}",
    ".nthview-matrix thead th{position:sticky;top:0;background:var(--nv-surface);z-index:2;border-bottom:3px solid var(--oc,var(--nv-border));color:var(--oc,var(--nv-fg));font-size:.98rem}",
    ".nthview-matrix tbody th{position:sticky;left:0;background:var(--nv-surface);z-index:1;font-size:.95rem;border-right:1px solid var(--nv-border)}",
    ".nthview-matrix thead th:first-child{left:0;z-index:3;width:10rem;border-bottom-color:var(--nv-border)}",
    ".nthview-matrix tbody th small{display:block;font-weight:400;color:var(--nv-muted);margin-top:.2rem}",
    ".nthview-matrix tr.nthview-alikerow td{background:var(--nv-soft)}",
    ".nthview-cellbtn{display:block;width:100%;text-align:left;border:1px solid transparent;background:none;border-radius:.5rem;padding:.3rem .35rem;margin:-.3rem -.35rem;min-height:2.5rem}",
    ".nthview-cellbtn:hover{border-color:var(--nv-border);background:var(--nv-soft)}",
    ".nthview-cellbtn .nthview-more{display:block;font-size:.8rem;color:var(--nv-accent);margin-top:.15rem}",
    ".nthview-covered{display:flex;align-items:center;justify-content:center;gap:.4rem;border:2px dashed var(--nv-border)!important;background:var(--nv-soft)!important;color:var(--nv-muted);font-weight:650;margin:0;min-height:3rem}",
    ".nthview-mark{display:inline-flex;align-items:center;gap:.3rem;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.04em;border-radius:999px;padding:.05rem .5rem .05rem .35rem;margin:0 0 .25rem;background:var(--nv-soft);color:var(--nv-muted);white-space:nowrap}",
    ".nthview-mark svg{width:1rem;height:1rem;flex:none}",
    ".nthview-m-yes{background:var(--nv-ok-soft);color:var(--nv-ok)}.nthview-m-no{background:var(--nv-bad-soft);color:var(--nv-bad)}",
    ".nthview-m-high,.nthview-m-medium,.nthview-m-low{color:var(--nv-accent)}",
    ".nthview-dimcard h3{font-size:1.08rem;display:flex;flex-wrap:wrap;gap:.5rem;align-items:center}",
    ".nthview-rows{list-style:none;margin:.6rem 0 0;padding:0}",
    ".nthview-row{display:grid;grid-template-columns:minmax(6rem,9rem) 1fr;gap:.25rem .8rem;padding:.6rem 0 .6rem .7rem;border-top:1px solid var(--nv-border);border-left:4px solid var(--oc);margin-left:-.1rem}",
    ".nthview-row>b{color:var(--oc);font-size:.95rem}",
    "@media (max-width:30rem){.nthview-row{grid-template-columns:1fr}}",
    ".nthview-takeaway{margin:.7rem 0 0;padding:.55rem .75rem;border-radius:.6rem;background:var(--nv-soft);font-size:.95rem}",
    ".nthview-dl{margin:.6rem 0 0}",
    ".nthview-dl dt{font-weight:700;font-size:.85rem;color:var(--nv-muted);margin-top:.7rem}",
    ".nthview-dl dd{margin:.15rem 0 0}",
    ".nthview-sheetbg{position:fixed;inset:0;z-index:50;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;padding:1rem}",
    ".nthview-sheet{background:var(--nv-surface);color:var(--nv-fg);border-radius:1rem;max-width:34rem;width:100%;max-height:88vh;overflow:auto;padding:1.1rem 1.2rem 1.2rem;border-top:6px solid var(--oc,var(--nv-accent));box-shadow:0 10px 40px rgba(0,0,0,.3)}",
    "@media (max-width:40rem){.nthview-sheetbg{align-items:flex-end;padding:0}.nthview-sheet{border-radius:1rem 1rem 0 0;max-height:85vh}}",
    ".nthview-sheet-head{display:flex;justify-content:space-between;gap:1rem;align-items:flex-start}",
    ".nthview-sheet h2{font-size:1.15rem}",
    ".nthview-close{border:1px solid var(--nv-border);background:none;border-radius:999px;width:2.5rem;height:2.5rem;flex:none;font-size:1.2rem;line-height:1}",
    ".nthview-predict{display:flex;flex-wrap:wrap;gap:.45rem;margin:.6rem 0}",
    ".nthview-verdict{border-radius:.6rem;padding:.55rem .75rem;margin:.6rem 0;font-weight:600}",
    ".nthview-v-ok{background:var(--nv-ok-soft);color:var(--nv-ok)}.nthview-v-bad{background:var(--nv-bad-soft);color:var(--nv-bad)}.nthview-v-meh{background:var(--nv-soft)}",
    ".nthview-sitgroup{border-left:5px solid var(--oc)}",
    ".nthview-sitgroup h3{color:var(--oc);font-size:1.05rem;margin-bottom:.3rem}",
    ".nthview-sits{margin:.3rem 0 0;padding-left:1.1rem}",
    ".nthview-sits li{margin:.5rem 0}",
    ".nthview-sits li span{display:block;color:var(--nv-muted);font-size:.92rem}",
    ".nthview-list{margin:.4rem 0 0;padding-left:1.2rem}.nthview-list li{margin:.35rem 0}",
    ".nthview-mix dt{font-weight:700;margin-top:.8rem}.nthview-mix dt:before{content:'\\2715  ';color:var(--nv-bad)}",
    ".nthview-mix dd{margin:.2rem 0 0;padding-left:1.25rem}",
    ".nthview-big{font-size:1.12rem;font-weight:600;border-left:5px solid var(--nv-accent)}",
    ".nthview-qhead{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:.5rem;margin:0 0 .8rem}",
    ".nthview-qdots{display:flex;flex-wrap:wrap;gap:.3rem}",
    ".nthview-qdot{width:1.9rem;height:1.9rem;border-radius:50%;border:2px solid var(--nv-border);background:var(--nv-surface);font-size:.75rem;font-weight:700;padding:0;color:var(--nv-muted)}",
    ".nthview-qdot[aria-current=step]{border-color:var(--nv-accent);color:var(--nv-fg)}",
    ".nthview-qdot.nthview-q-ok{background:var(--nv-ok-soft);border-color:var(--nv-ok);color:var(--nv-ok)}",
    ".nthview-qdot.nthview-q-bad{background:var(--nv-bad-soft);border-color:var(--nv-bad);color:var(--nv-bad)}",
    ".nthview-qdot.nthview-q-seen{background:var(--nv-soft)}",
    ".nthview-qcard h2{font-size:1.15rem;margin:.2rem 0 .6rem}",
    ".nthview-situation{background:var(--nv-soft);border-radius:.6rem;padding:.7rem .85rem;margin:.2rem 0 .8rem}",
    ".nthview-choices{display:grid;gap:.5rem;margin:.5rem 0}",
    ".nthview-choice{display:flex;gap:.7rem;align-items:flex-start;text-align:left;border:2px solid var(--nv-border);background:var(--nv-surface);border-radius:.7rem;padding:.65rem .8rem;min-height:3rem;width:100%}",
    ".nthview-choice:hover{border-color:var(--oc,var(--nv-accent))}",
    ".nthview-choice[aria-pressed=true]{border-color:var(--nv-accent);background:var(--nv-soft)}",
    ".nthview-choice .nthview-key{flex:none;width:1.6rem;height:1.6rem;border-radius:50%;background:var(--nv-soft);display:inline-flex;align-items:center;justify-content:center;font-size:.8rem;font-weight:700}",
    ".nthview-choice .nthview-ctext{flex:1}",
    ".nthview-choice .nthview-ctext small{display:block;color:var(--nv-muted);margin-top:.15rem}",
    ".nthview-choice.nthview-right{border-color:var(--nv-ok);background:var(--nv-ok-soft)}",
    ".nthview-choice.nthview-wrong{border-color:var(--nv-bad);background:var(--nv-bad-soft)}",
    ".nthview-choice.nthview-viewing{box-shadow:0 0 0 3px var(--nv-accent)}",
    ".nthview-owner{display:inline-flex;align-items:center;gap:.35rem;font-size:.8rem;font-weight:700;color:var(--oc);margin-top:.25rem}",
    ".nthview-checks{display:flex;flex-wrap:wrap;gap:.5rem;margin:.8rem 0 0}",
    ".nthview-fb{margin:.9rem 0 0;border-radius:.7rem;padding:.75rem .9rem;background:var(--nv-soft)}",
    ".nthview-fb h3{font-size:1rem;margin:0 0 .3rem}",
    ".nthview-fb.nthview-fb-ok{background:var(--nv-ok-soft)}.nthview-fb.nthview-fb-ok h3{color:var(--nv-ok)}",
    ".nthview-fb.nthview-fb-bad{background:var(--nv-bad-soft)}.nthview-fb.nthview-fb-bad h3{color:var(--nv-bad)}",
    ".nthview-sure{font-weight:700}",
    ".nthview-stmt{border:1px solid var(--nv-border);border-radius:.7rem;padding:.7rem .8rem;margin:.55rem 0}",
    ".nthview-stmt p{margin:0 0 .4rem;font-weight:600}",
    ".nthview-stmt.nthview-right{border-color:var(--nv-ok);background:var(--nv-ok-soft)}",
    ".nthview-stmt.nthview-wrong{border-color:var(--nv-bad);background:var(--nv-bad-soft)}",
    ".nthview-stmt .nthview-chips{margin:0}",
    ".nthview-textarea{width:100%;min-height:7rem;font:inherit;color:inherit;background:var(--nv-bg);border:1px solid var(--nv-border);border-radius:.6rem;padding:.6rem .7rem;resize:vertical}",
    ".nthview-ticks{list-style:none;padding:0;margin:.5rem 0}",
    ".nthview-ticks label{display:flex;gap:.6rem;align-items:flex-start;padding:.4rem 0;min-height:2.5rem}",
    ".nthview-ticks input{width:1.2rem;height:1.2rem;margin-top:.15rem;flex:none}",
    ".nthview-qnav{display:flex;justify-content:space-between;gap:.5rem;margin:1rem 0 0;flex-wrap:wrap}",
    ".nthview-score{font-size:clamp(2rem,8vw,3rem);font-weight:800;color:var(--nv-accent);line-height:1}",
    ".nthview-review{list-style:none;padding:0;margin:.5rem 0}",
    ".nthview-review li{display:flex;gap:.6rem;align-items:flex-start;padding:.5rem 0;border-top:1px solid var(--nv-border)}",
    ".nthview-review li button{border:0;background:none;padding:0;text-align:left;color:var(--nv-accent);text-decoration:underline;min-height:1.5rem}",
    ".nthview-badge{flex:none;font-size:.75rem;font-weight:700;border-radius:999px;padding:.05rem .5rem;background:var(--nv-soft)}",
    ".nthview-badge.nthview-b-ok{background:var(--nv-ok-soft);color:var(--nv-ok)}.nthview-badge.nthview-b-bad{background:var(--nv-bad-soft);color:var(--nv-bad)}",
    ".nthview-sources{margin:.4rem 0 0;padding-left:1.2rem;font-size:.9rem}",
    ".nthview-empty{padding:1rem;border:1px dashed var(--nv-border);border-radius:.7rem;color:var(--nv-muted)}",
    ".nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    "@media (max-width:40rem){.nthview-compare{padding:.75rem .75rem 3rem}.nthview-tabs{margin:0 -.75rem .9rem;padding:.3rem .75rem 0}.nthview-tab{padding:.5rem .55rem .6rem}.nthview-card{padding:.85rem .9rem}.nthview-head{gap:.5rem}.nthview-matrix thead th:first-child{width:7rem}.nthview-matrix th,.nthview-matrix td{padding:.5rem .55rem;hyphens:auto}}",
    "@media (prefers-reduced-motion:reduce){.nthview-compare *{transition:none!important}}",
    "@media print{.nthview-tabs,.nthview-restart,.nthview-controls{display:none}}"
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
    return "nthview:compare:" + (h >>> 0).toString(36);
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

  // ---- view-specific helpers ---------------------------------------------
  var COLOURS = ["blue", "teal", "amber", "rose", "violet", "green"];
  var TABS = [
    { id: "overview", label: "Overview" },
    { id: "compare", label: "Compare" },
    { id: "choose", label: "When to choose" },
    { id: "practice", label: "Practice" },
    { id: "recap", label: "Recap" }
  ];
  var MARK_LABEL = { yes: "Yes", partly: "Partly", no: "No", low: "Low", medium: "Medium", high: "High", na: "N/A" };
  var FEATURE = ["yes", "partly", "no"], DEGREE = ["low", "medium", "high"];
  var KIND_LABEL = { sort: "Sort the statements", cell: "Fill the hidden cell", pick: "Which would you choose?", choice: "Choose one", explain: "In your own words" };
  var SVG_NS = "http://www.w3.org/2000/svg";

  function svg(parts) {
    var s = root.document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", "0 0 16 16"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    parts.forEach(function (pt) {
      var n = root.document.createElementNS(SVG_NS, pt[0]);
      Object.keys(pt[1]).forEach(function (k) { n.setAttribute(k, pt[1][k]); });
      s.appendChild(n);
    });
    return s;
  }
  function markIcon(m) {
    var line = { fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" };
    if (m === "yes") return svg([["path", Object.assign({ d: "M3 8.5l3.2 3.2L13 4.8" }, line)]]);
    if (m === "no") return svg([["path", Object.assign({ d: "M4 4l8 8M12 4l-8 8" }, line)]]);
    if (m === "partly") return svg([["circle", { cx: "8", cy: "8", r: "5.5", fill: "none", stroke: "currentColor", "stroke-width": "1.8" }], ["path", { d: "M8 2.5a5.5 5.5 0 0 1 0 11z", fill: "currentColor" }]]);
    if (m === "na") return svg([["path", Object.assign({ d: "M4 8h8" }, line)]]);
    var n = m === "low" ? 1 : m === "medium" ? 2 : 3, bars = [];
    for (var i = 0; i < 3; i++) bars.push(["rect", { x: String(2 + i * 4.6), y: String(10 - i * 3.5), width: "3.2", height: String(4 + i * 3.5), rx: "1", fill: "currentColor", opacity: i < n ? "1" : ".25" }]);
    return svg(bars);
  }
  function markBadge(m) {
    if (!m) return null;
    return el("span", { class: "nthview-mark nthview-m-" + m }, [markIcon(m), el("span", { text: MARK_LABEL[m] })]);
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
  function p(text, cls) { var n = el("p", cls ? { class: cls } : {}); n.appendChild(rich(text)); return n; }
  function span(text, cls) { var n = el("span", cls ? { class: cls } : {}); n.appendChild(rich(text)); return n; }
  function btn(label, cls, onClick, attrs) {
    var b = el("button", Object.assign({ type: "button", class: "nthview-btn" + (cls ? " " + cls : ""), text: label }, attrs || {}));
    b.addEventListener("click", onClick); return b;
  }
  function seeded(seed) {
    var h = 2166136261;
    for (var i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
  }
  function shuffled(arr, seed) {
    var r = seeded(seed), a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(r() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
    return a;
  }
  function sameSet(a, b) {
    if (a.length !== b.length) return false;
    return a.every(function (x) { return b.indexOf(x) !== -1; });
  }

  // ---- view-specific rendering: data is already valid here ---------------
  function render(container, data) {
    var doc = root.document;
    var key = storageKey(data);
    var reduceMotion = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var Q = data.questions, N = Q.length;

    /* ---------- lookups ---------- */
    var opt = {}, dim = {}, cell = {};
    var used = data.options.map(function (o) { return o.colour; });
    var free = COLOURS.filter(function (c) { return used.indexOf(c) === -1; });
    data.options.forEach(function (o) { opt[o.id] = { o: o, colour: o.colour || free.shift(), short: o.short || o.name }; });
    data.dimensions.forEach(function (d) { dim[d.id] = d; });
    data.cells.forEach(function (c) { cell[c.option + "|" + c.dimension] = c; });
    function oc(id) { return "nthview-c-" + opt[id].colour; }
    function scaleOf(dimId) {
      var ms = data.options.map(function (o) { return cell[o.id + "|" + dimId].mark; });
      if (ms.some(function (m) { return DEGREE.indexOf(m) !== -1; })) return DEGREE;
      if (ms.some(function (m) { return FEATURE.indexOf(m) !== -1; })) return FEATURE;
      return null;
    }

    /* ---------- state ---------- */
    var state = { tab: "overview", layout: null, filter: "all", hidden: [], cover: false, revealed: {}, q: 0, answers: {}, done: false };
    function persist() {
      saveState(key, { tab: state.tab, layout: state.layout, filter: state.filter, hidden: state.hidden, cover: state.cover, revealed: state.revealed, q: state.q, answers: state.answers, done: state.done });
    }

    /* ---------- frame ---------- */
    var head = el("div", { class: "nthview-head" }, [
      el("div", {}, [el("h1", { class: "nthview-title", text: data.title, tabindex: "-1" })].concat(data.subtitle ? [p(data.subtitle, "nthview-sub")] : [])),
      restartButton(container, data, key)
    ]);
    var tabbar = el("div", { class: "nthview-tabs", role: "tablist", "aria-label": "Sections" });
    var tabBtns = {};
    TABS.forEach(function (t) {
      var b = el("button", { type: "button", role: "tab", id: "nthview-tab-" + t.id, class: "nthview-tab", "aria-controls": "nthview-panel", "aria-selected": "false", tabindex: "-1" }, [el("span", { text: t.label })]);
      if (t.id === "practice") b.appendChild(el("span", { class: "nthview-count", "aria-hidden": "true" }));
      b.addEventListener("click", function () { go(t.id); });
      b.addEventListener("keydown", function (e) {
        var i = TABS.indexOf(t), n = null;
        if (e.key === "ArrowRight") n = TABS[(i + 1) % TABS.length];
        else if (e.key === "ArrowLeft") n = TABS[(i + TABS.length - 1) % TABS.length];
        else if (e.key === "Home") n = TABS[0];
        else if (e.key === "End") n = TABS[TABS.length - 1];
        if (n) { e.preventDefault(); go(n.id); tabBtns[n.id].focus(); }
      });
      tabBtns[t.id] = b; tabbar.appendChild(b);
    });
    var notice = el("div");
    var panel = el("div", { id: "nthview-panel", role: "tabpanel" });
    var live = el("div", { class: "nthview-sr", "aria-live": "polite" });
    container.appendChild(head); container.appendChild(tabbar); container.appendChild(notice); container.appendChild(panel); container.appendChild(live);
    function say(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }

    function go(tab, keepScroll, initial) {
      state.tab = tab;
      TABS.forEach(function (t) {
        var on = t.id === tab;
        tabBtns[t.id].setAttribute("aria-selected", on ? "true" : "false");
        tabBtns[t.id].setAttribute("tabindex", on ? "0" : "-1");
      });
      panel.setAttribute("aria-labelledby", "nthview-tab-" + tab);
      var tb = tabBtns[tab];
      if (tb.offsetLeft < tabbar.scrollLeft || tb.offsetLeft + tb.offsetWidth > tabbar.scrollLeft + tabbar.clientWidth) tabbar.scrollLeft = tb.offsetLeft - 16;
      draw();
      if (!initial) persist();
      if (!keepScroll && tabbar.getBoundingClientRect().top < 0) tabbar.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
    }
    function draw() {
      panel.innerHTML = "";
      ({ overview: drawOverview, compare: drawCompare, choose: drawChoose, practice: drawPractice, recap: drawRecap })[state.tab]();
      updateCount();
    }
    function updateCount() {
      var n = Q.filter(function (q) { return isAnswered(q); }).length;
      tabBtns.practice.querySelector(".nthview-count").textContent = n + "/" + N;
      tabBtns.practice.setAttribute("aria-label", "Practice, " + n + " of " + N + " answered");
    }
    function h2(text) { return el("h2", { class: "nthview-h2", text: text }); }
    function optName(id, cls) {
      return el("span", { class: "nthview-owner " + oc(id) + (cls ? " " + cls : "") }, [el("span", { class: "nthview-dot", "aria-hidden": "true" }), el("span", { text: opt[id].o.name })]);
    }

    /* ---------- overview ---------- */
    function drawOverview() {
      var top = el("div", { class: "nthview-card" });
      top.appendChild(el("p", { class: "nthview-kicker", text: "Comparing " + data.options.length + " options on " + data.dimensions.length + " criteria" }));
      if (data.focus) top.appendChild(p(data.focus, "nthview-focus"));
      (data.intro || []).forEach(function (t) { top.appendChild(p(t)); });
      panel.appendChild(top);

      panel.appendChild(h2("The options"));
      var g = el("div", { class: "nthview-grid" });
      data.options.forEach(function (o) {
        var c = el("div", { class: "nthview-card nthview-optcard " + oc(o.id) }, [el("h3", { text: o.name })]);
        if (o.aka) c.appendChild(el("p", { class: "nthview-aka", text: "Also called " + o.aka }));
        c.appendChild(p(o.summary));
        g.appendChild(c);
      });
      panel.appendChild(g);

      panel.appendChild(h2("Compared on"));
      var chips = el("div", { class: "nthview-chips" });
      data.dimensions.forEach(function (d) { chips.appendChild(el("span", { class: "nthview-pill" + (d.alike ? " nthview-alike" : ""), text: d.name + (d.alike ? " · alike" : "") })); });
      panel.appendChild(chips);

      panel.appendChild(h2("Choose a way in"));
      var ways = el("div", { class: "nthview-grid" });
      function way(title, sub, rec, fn) {
        var b = el("button", { type: "button", class: "nthview-way" + (rec ? " nthview-rec" : "") }, [el("b", { text: title }), el("span", { text: sub })]);
        b.addEventListener("click", fn); ways.appendChild(b);
      }
      way("Predict first", "The grid is covered. Guess each cell, then reveal it. Guessing first makes the reading stick.", true, function () { state.cover = true; go("compare"); });
      way("Read the comparison", "The full grid, one card per criterion or per option, with details on every cell.", false, function () { state.cover = false; go("compare"); });
      way("When to choose which", "Situations matched to the option that fits them.", false, function () { go("choose"); });
      way("Practise", N + " questions that make you tell the options apart, each explained.", false, function () { go("practice"); });
      panel.appendChild(ways);

      if (data.sources && data.sources.length) {
        panel.appendChild(h2("Sources"));
        var ul = el("ul", { class: "nthview-sources" });
        data.sources.forEach(function (s) {
          var li = el("li");
          if (s.url) li.appendChild(el("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", text: s.label }));
          else li.textContent = s.label;
          ul.appendChild(li);
        });
        panel.appendChild(ul);
      }
    }

    /* ---------- compare ---------- */
    function autoLayout() { return container.clientWidth < 640 ? "dimension" : "table"; }
    function visibleOptions() { return data.options.filter(function (o) { return state.hidden.indexOf(o.id) === -1; }); }
    function visibleDims() {
      return data.dimensions.filter(function (d) { return state.filter === "all" || (state.filter === "diff" ? !d.alike : !!d.alike); });
    }
    function seg(label, items, current, onPick) {
      var wrap = el("div", {}, [el("span", { class: "nthview-ctl-label", text: label })]);
      var s = el("div", { class: "nthview-seg", role: "group", "aria-label": label });
      items.forEach(function (it) {
        var b = el("button", { type: "button", "aria-pressed": it[0] === current ? "true" : "false", text: it[1] });
        b.addEventListener("click", function () { onPick(it[0]); });
        s.appendChild(b);
      });
      wrap.appendChild(s); return wrap;
    }
    function drawCompare() {
      var layout = state.layout || autoLayout();
      var ctl = el("div", { class: "nthview-controls" });
      ctl.appendChild(seg("Layout", [["table", "Table"], ["dimension", "By criterion"], ["option", "By option"]], layout, function (v) { state.layout = v; redraw(); }));
      ctl.appendChild(seg("Show", [["all", "All"], ["diff", "Differences"], ["alike", "Shared"]], state.filter, function (v) { state.filter = v; redraw(); }));
      var sw = el("button", { type: "button", class: "nthview-switch", "aria-pressed": state.cover ? "true" : "false" }, [el("i", { "aria-hidden": "true" }), el("span", { text: "Predict mode" })]);
      sw.addEventListener("click", function () { state.cover = !state.cover; redraw(); say(state.cover ? "Predict mode on: cells are covered." : "Predict mode off: all cells shown."); });
      ctl.appendChild(el("div", {}, [el("span", { class: "nthview-ctl-label", text: "Self-test" }), sw]));
      panel.appendChild(ctl);

      if (data.options.length > 2) {
        var chips = el("div", { class: "nthview-chips", role: "group", "aria-label": "Options shown" });
        data.options.forEach(function (o) {
          var on = state.hidden.indexOf(o.id) === -1;
          var b = el("button", { type: "button", class: "nthview-chip " + oc(o.id), "aria-pressed": on ? "true" : "false" }, [el("span", { class: "nthview-dot", "aria-hidden": "true" }), el("span", { text: opt[o.id].short })]);
          b.addEventListener("click", function () {
            if (on && visibleOptions().length <= 2) { say("At least two options stay in view."); return; }
            if (on) state.hidden.push(o.id); else state.hidden = state.hidden.filter(function (x) { return x !== o.id; });
            redraw();
          });
          chips.appendChild(b);
        });
        panel.appendChild(el("div", {}, [el("span", { class: "nthview-ctl-label", text: "Options shown (tap to focus on two)" }), chips]));
      }

      if (state.cover) {
        var total = data.cells.length, n = Object.keys(state.revealed).length;
        var bar = el("div", { class: "nthview-testbar" }, [el("p", { text: n + " of " + total + " cells revealed. Tap a covered cell, predict its mark, then see the answer." })]);
        bar.appendChild(btn("Reveal all", "", function () { data.cells.forEach(function (c) { var k = c.option + "|" + c.dimension; if (!(k in state.revealed)) state.revealed[k] = "show"; }); redraw(); }));
        bar.appendChild(btn("Cover again", "", function () { state.revealed = {}; redraw(); }));
        panel.appendChild(bar);
      }

      var opts = visibleOptions(), dims = visibleDims();
      if (!dims.length) { panel.appendChild(el("p", { class: "nthview-empty", text: state.filter === "alike" ? "No criterion is marked as shared; every one shows a difference." : "Every criterion is shared." })); return; }
      if (layout === "table") drawTable(opts, dims);
      else if (layout === "dimension") drawByDimension(opts, dims);
      else drawByOption(opts, dims);
    }
    function redraw() {
      var y = root.scrollY; draw(); persist(); root.scrollTo(0, y);
    }
    function isCovered(c) { return state.cover && !((c.option + "|" + c.dimension) in state.revealed); }
    function cellContent(c, withMore) {
      var frag = doc.createDocumentFragment();
      var m = markBadge(c.mark); if (m) { frag.appendChild(m); frag.appendChild(el("br")); }
      frag.appendChild(span(c.text));
      if (withMore && c.detail) frag.appendChild(el("span", { class: "nthview-more", text: "More" }));
      return frag;
    }
    function cellButton(c) {
      var o = opt[c.option], d = dim[c.dimension];
      if (isCovered(c)) {
        var cb = el("button", { type: "button", class: "nthview-cellbtn nthview-covered", "aria-label": "Covered: " + o.o.name + ", " + d.name + ". Predict and reveal." }, [el("span", { "aria-hidden": "true", text: "?" }), el("span", { text: "Predict" })]);
        cb.addEventListener("click", function () { openCell(c, cb); });
        return cb;
      }
      var b = el("button", { type: "button", class: "nthview-cellbtn", "aria-label": o.o.name + ", " + d.name + ": " + (c.mark ? MARK_LABEL[c.mark] + ". " : "") + c.text + (c.detail ? " More detail." : "") });
      b.appendChild(cellContent(c, true));
      b.addEventListener("click", function () { openCell(c, b); });
      return b;
    }
    function drawTable(opts, dims) {
      var wrap = el("div", { class: "nthview-tablewrap", tabindex: "0", role: "region", "aria-label": "Comparison table, scrolls sideways when narrow" });
      var t = el("table", { class: "nthview-matrix" });
      t.appendChild(el("caption", { class: "nthview-sr", text: data.title }));
      var hr = el("tr", {}, [el("th", { scope: "col", text: "Criterion" })]);
      opts.forEach(function (o) { hr.appendChild(el("th", { scope: "col", class: oc(o.id), text: o.name })); });
      t.appendChild(el("thead", {}, [hr]));
      var tb = el("tbody");
      dims.forEach(function (d) {
        var th = el("th", { scope: "row" }, [el("span", { text: d.name })]);
        if (d.alike) th.appendChild(el("small", {}, [el("span", { class: "nthview-pill nthview-alike", text: "Alike" })]));
        if (d.why) th.appendChild(el("small", { text: d.why }));
        var tr = el("tr", d.alike ? { class: "nthview-alikerow" } : {}, [th]);
        opts.forEach(function (o) { tr.appendChild(el("td", {}, [cellButton(cell[o.id + "|" + d.id])])); });
        tb.appendChild(tr);
      });
      t.appendChild(tb); wrap.appendChild(t); panel.appendChild(wrap);
      var takes = dims.filter(function (d) { return d.takeaway; });
      if (takes.length && !state.cover) {
        panel.appendChild(h2("In short, criterion by criterion"));
        var ul = el("ul", { class: "nthview-list" });
        takes.forEach(function (d) { var li = el("li"); li.appendChild(el("b", { text: d.name + ": " })); li.appendChild(rich(d.takeaway)); ul.appendChild(li); });
        panel.appendChild(ul);
      }
    }
    function drawByDimension(opts, dims) {
      var st = el("div", { class: "nthview-stack" });
      dims.forEach(function (d) {
        var c = el("section", { class: "nthview-card nthview-dimcard", "aria-label": d.name });
        var h = el("h3", {}, [el("span", { text: d.name })]);
        if (d.alike) h.appendChild(el("span", { class: "nthview-pill nthview-alike", text: "Alike" }));
        c.appendChild(h);
        if (d.why) c.appendChild(p(d.why, "nthview-muted nthview-small"));
        var ul = el("ul", { class: "nthview-rows" });
        opts.forEach(function (o) {
          ul.appendChild(el("li", { class: "nthview-row " + oc(o.id) }, [el("b", { text: opt[o.id].short }), el("div", {}, [cellButton(cell[o.id + "|" + d.id])])]));
        });
        c.appendChild(ul);
        if (d.takeaway && !state.cover) { var tk = el("p", { class: "nthview-takeaway" }, [el("b", { text: "In short: " })]); tk.appendChild(rich(d.takeaway)); c.appendChild(tk); }
        st.appendChild(c);
      });
      panel.appendChild(st);
    }
    function drawByOption(opts, dims) {
      var g = el("div", { class: "nthview-grid" });
      opts.forEach(function (o) {
        var c = el("section", { class: "nthview-card nthview-optcard " + oc(o.id), "aria-label": o.name }, [el("h3", { text: o.name })]);
        c.appendChild(p(o.summary, "nthview-small nthview-muted"));
        var dl = el("dl", { class: "nthview-dl" });
        dims.forEach(function (d) {
          dl.appendChild(el("dt", { text: d.name }));
          dl.appendChild(el("dd", {}, [cellButton(cell[o.id + "|" + d.id])]));
        });
        c.appendChild(dl); g.appendChild(c);
      });
      panel.appendChild(g);
    }

    /* ---------- cell sheet (detail, or predict then reveal) ---------- */
    var sheetOpen = null;
    function openSheet(colourCls, title, build, returnTo) {
      closeSheet();
      var titleId = "nthview-sheet-title";
      var box = el("div", { class: "nthview-sheet " + (colourCls || ""), role: "dialog", "aria-modal": "true", "aria-labelledby": titleId, tabindex: "-1" });
      var close = el("button", { type: "button", class: "nthview-close", "aria-label": "Close", text: "×" });
      box.appendChild(el("div", { class: "nthview-sheet-head" }, [el("h2", { id: titleId, text: title }), close]));
      var body = el("div"); box.appendChild(body);
      var bg = el("div", { class: "nthview-sheetbg" }, [box]);
      sheetOpen = { bg: bg, returnTo: returnTo };
      close.addEventListener("click", closeSheet);
      bg.addEventListener("click", function (e) { if (e.target === bg) closeSheet(); });
      bg.addEventListener("keydown", function (e) {
        if (e.key === "Escape") { e.preventDefault(); closeSheet(); return; }
        if (e.key !== "Tab") return;
        var f = Array.prototype.filter.call(box.querySelectorAll("button,a[href],input,textarea"), function (x) { return !x.disabled; });
        if (!f.length) return;
        if (e.shiftKey && doc.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && doc.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      });
      container.appendChild(bg);
      build(body);
      (body.querySelector("button") || close).focus();
    }
    function closeSheet() {
      if (!sheetOpen) return;
      var s = sheetOpen; sheetOpen = null;
      if (s.bg.parentNode) s.bg.parentNode.removeChild(s.bg);
      var k = s.returnTo && s.returnTo.getAttribute && s.returnTo.getAttribute("data-k");
      var target = k ? panel.querySelector('[data-k="' + k + '"]') : s.returnTo;
      if (target && target.focus) target.focus();
    }
    function openCell(c, from) {
      var k = c.option + "|" + c.dimension, d = dim[c.dimension], o = opt[c.option].o;
      from.setAttribute("data-k", k);
      openSheet(oc(c.option), o.name + " · " + d.name, function (body) {
        if (isCovered(c)) {
          var sc = scaleOf(c.dimension);
          body.appendChild(p(d.why || "Predict before you look.", "nthview-muted nthview-small"));
          body.appendChild(el("p", { class: "nthview-kicker", text: sc ? "Your prediction" : "Ready?" }));
          var row = el("div", { class: "nthview-predict" });
          (sc ? sc.concat(["na"]) : []).forEach(function (m) {
            if (m === "na" && !data.cells.some(function (x) { return x.dimension === c.dimension && x.mark === "na"; })) return;
            row.appendChild(btn(MARK_LABEL[m], "", function () { reveal(m); }));
          });
          row.appendChild(btn(sc ? "Not sure, show me" : "Reveal", sc ? "" : "nthview-primary", function () { reveal("?"); }));
          body.appendChild(row);
        } else showCell(body, c, state.revealed[k]);
        function reveal(pred) {
          state.revealed[k] = pred; persist();
          body.innerHTML = ""; showCell(body, c, pred);
          var b2 = body.querySelector("button"); (b2 || box()).focus();
          refreshBehind();
        }
        function box() { return body.parentNode; }
      }, from);
    }
    function showCell(body, c, pred) {
      var d = dim[c.dimension];
      if (pred && pred !== "show" && pred !== "?" && c.mark) {
        var ok = pred === c.mark;
        body.appendChild(el("p", { class: "nthview-verdict " + (ok ? "nthview-v-ok" : "nthview-v-bad"), role: "status", text: ok ? "Your prediction matched: " + MARK_LABEL[c.mark] + "." : "You predicted " + MARK_LABEL[pred] + "; it is " + MARK_LABEL[c.mark] + "." }));
      } else if (pred === "?") body.appendChild(el("p", { class: "nthview-verdict nthview-v-meh", role: "status", text: "Here it is. Try predicting the next one." }));
      var m = markBadge(c.mark); if (m) body.appendChild(m);
      body.appendChild(p(c.text));
      if (c.detail) body.appendChild(p(c.detail));
      if (d.takeaway) { var t = el("p", { class: "nthview-takeaway" }, [el("b", { text: "In short: " })]); t.appendChild(rich(d.takeaway)); body.appendChild(t); }
      if (state.cover) {
        var next = nextCovered(c);
        if (next) body.appendChild(el("div", { class: "nthview-checks" }, [btn("Next covered cell", "nthview-primary", function () {
          var from = panel.querySelector('[data-k="' + c.option + "|" + c.dimension + '"]') || panel;
          closeSheet(); var b = findCellBtn(next) || from; openCell(next, b);
        })]));
      }
    }
    function nextCovered(after) {
      var opts = visibleOptions(), dims = visibleDims(), list = [];
      dims.forEach(function (d) { opts.forEach(function (o) { list.push(cell[o.id + "|" + d.id]); }); });
      var i = list.indexOf(after);
      for (var j = 1; j <= list.length; j++) { var c = list[(i + j) % list.length]; if (isCovered(c)) return c; }
      return null;
    }
    function findCellBtn(c) {
      var btns = panel.querySelectorAll(".nthview-cellbtn"), opts = visibleOptions(), dims = visibleDims(), layout = state.layout || autoLayout();
      var di = dims.indexOf(dim[c.dimension]), oi = opts.indexOf(opt[c.option].o), idx;
      if (layout === "option") idx = oi * dims.length + di; else idx = di * opts.length + oi;
      return btns[idx] || null;
    }
    function refreshBehind() {
      if (state.tab !== "compare") return;
      var y = root.scrollY; var keep = sheetOpen; if (keep && keep.bg.parentNode) keep.bg.parentNode.removeChild(keep.bg);
      draw(); if (keep) container.appendChild(keep.bg); root.scrollTo(0, y);
      if (keep && keep.returnTo) { var k = keep.returnTo.getAttribute("data-k"); var nb = null; data.cells.some(function (c) { if (c.option + "|" + c.dimension === k) { nb = findCellBtn(c); return true; } return false; }); if (nb) { nb.setAttribute("data-k", k); keep.returnTo = nb; } }
    }

    /* ---------- when to choose ---------- */
    function drawChoose() {
      panel.appendChild(p("Each situation names the option that fits it. Practice has more of these, with the reasons why the others fall short.", "nthview-muted"));
      var g = el("div", { class: "nthview-stack" });
      data.options.forEach(function (o) {
        var items = data.whenToChoose.filter(function (w) { return w.option === o.id; });
        if (!items.length) return;
        var c = el("section", { class: "nthview-card nthview-sitgroup " + oc(o.id), "aria-label": "Choose " + o.name }, [el("h3", { text: "Choose " + (/^[aeiou]/i.test(o.name) ? "an " : "a ") + o.name.charAt(0).toLowerCase() + o.name.slice(1) + " when" })]);
        var ul = el("ul", { class: "nthview-sits" });
        items.forEach(function (w) { var li = el("li"); li.appendChild(rich(w.situation)); if (w.why) li.appendChild(span(w.why)); ul.appendChild(li); });
        c.appendChild(ul); g.appendChild(c);
      });
      panel.appendChild(g);
    }

    /* ---------- recap ---------- */
    function drawRecap() {
      if (data.bigIdea) { var b = el("div", { class: "nthview-card nthview-big" }, [el("p", { class: "nthview-kicker", text: "The big idea" })]); b.appendChild(p(data.bigIdea)); panel.appendChild(b); }
      if (data.similarities && data.similarities.length) { panel.appendChild(h2("How they are alike")); panel.appendChild(listOf(data.similarities)); }
      if (data.differences && data.differences.length) { panel.appendChild(h2("How they differ")); panel.appendChild(listOf(data.differences)); }
      var takes = data.dimensions.filter(function (d) { return d.takeaway; });
      if (takes.length) {
        panel.appendChild(h2("With regard to each criterion"));
        var ul = el("ul", { class: "nthview-list" });
        takes.forEach(function (d) { var li = el("li"); li.appendChild(el("b", { text: d.name + (d.alike ? " (alike): " : ": ") })); li.appendChild(rich(d.takeaway)); ul.appendChild(li); });
        panel.appendChild(ul);
      }
      if (data.misconceptions && data.misconceptions.length) {
        panel.appendChild(h2("Common mix-ups"));
        var dl = el("dl", { class: "nthview-mix" });
        data.misconceptions.forEach(function (m) { var dt = el("dt"); dt.appendChild(rich(m.claim)); dl.appendChild(dt); var dd = el("dd"); dd.appendChild(rich(m.truth)); dl.appendChild(dd); });
        panel.appendChild(dl);
      }
      panel.appendChild(el("div", { class: "nthview-checks" }, [btn(state.done ? "Review your practice" : "Test yourself", "nthview-primary", function () { go("practice"); }), btn("Back to the grid", "", function () { go("compare"); })]));
    }
    function listOf(items) { var ul = el("ul", { class: "nthview-list" }); items.forEach(function (t) { var li = el("li"); li.appendChild(rich(t)); ul.appendChild(li); }); return ul; }

    /* ---------- practice ---------- */
    function isAnswered(q) {
      var a = state.answers[q.id];
      if (!a) return false;
      if (a.skipped) return true;
      if (q.kind === "explain") return !!a.shown;
      if (q.kind === "sort") return !!a.checked;
      return a.pick !== undefined && a.pick !== null;
    }
    function result(q) {
      var a = state.answers[q.id];
      if (!a || a.skipped || !isAnswered(q)) return null;
      if (q.kind === "explain") return "seen";
      if (q.kind === "sort") return q.statements.every(function (s, i) { return sameSet(a.sel[i] || [], s.answer); }) ? "ok" : "bad";
      return isRight(q, a.pick) ? "ok" : "bad";
    }
    function isRight(q, pick) {
      if (q.kind === "cell" || q.kind === "pick") return pick === (q.kind === "cell" ? q.option : q.answer);
      if (q.kind === "choice") return !!(q.choices[pick] && q.choices[pick].correct);
      return false;
    }
    function drawPractice() {
      if (state.q >= N) { drawEnd(); return; }
      var q = Q[state.q], i = state.q;
      var dots = el("div", { class: "nthview-qdots", role: "group", "aria-label": "Questions" });
      Q.forEach(function (qq, j) {
        var r = result(qq), a = state.answers[qq.id];
        var d = el("button", { type: "button", class: "nthview-qdot" + (r === "ok" ? " nthview-q-ok" : r === "bad" ? " nthview-q-bad" : (r === "seen" || (a && a.skipped)) ? " nthview-q-seen" : ""), text: String(j + 1), "aria-label": "Question " + (j + 1) + (r === "ok" ? ", right" : r === "bad" ? ", missed" : a && a.skipped ? ", skipped" : r === "seen" ? ", done" : "") });
        if (j === i) d.setAttribute("aria-current", "step");
        d.addEventListener("click", function () { state.q = j; redrawQ(); });
        dots.appendChild(d);
      });
      panel.appendChild(el("div", { class: "nthview-qhead" }, [el("span", { class: "nthview-kicker", text: "Question " + (i + 1) + " of " + N + " · " + KIND_LABEL[q.kind] }), dots]));
      var card = el("section", { class: "nthview-card nthview-qcard", "aria-label": "Question " + (i + 1) });
      ({ sort: qSort, cell: qCell, pick: qPick, choice: qChoice, explain: qExplain })[q.kind](card, q, state.answers[q.id] || {});
      panel.appendChild(card);
      var done = isAnswered(q) && !(state.answers[q.id] || {}).skipped;
      var nav = el("div", { class: "nthview-qnav" });
      nav.appendChild(btn("Previous", "", function () { state.q = i - 1; redrawQ(); }, i === 0 ? { disabled: "disabled" } : {}));
      var right = el("div", { class: "nthview-checks", style: "margin:0" });
      if (!done) right.appendChild(btn("Skip", "", function () { state.answers[q.id] = { skipped: true }; advance(); }));
      right.appendChild(btn(i === N - 1 ? "Finish" : "Next", done ? "nthview-primary" : "", function () { advance(); }));
      nav.appendChild(right);
      panel.appendChild(nav);
    }
    function advance() { state.q = Math.min(N, state.q + 1); redrawQ(true); }
    function redrawQ(focusTop) {
      draw(); persist();
      var t = panel.querySelector(".nthview-qcard h2, .nthview-end h2");
      if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
      if (focusTop && tabbar.getBoundingClientRect().top < 0) tabbar.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
    }
    function answer(q, fields) {
      var a = state.answers[q.id] && !state.answers[q.id].skipped ? state.answers[q.id] : {};
      Object.keys(fields).forEach(function (k) { a[k] = fields[k]; });
      state.answers[q.id] = a; persist();
    }
    function qTitle(card, text) { var h = el("h2"); h.appendChild(rich(text)); card.appendChild(h); }
    function checkButtons(card, ready, onCheck) {
      var row = el("div", { class: "nthview-checks" });
      var a1 = btn("Check, I'm sure", "nthview-primary", function () { onCheck(true); }), a2 = btn("Check, not sure", "", function () { onCheck(false); });
      if (!ready) { a1.setAttribute("disabled", "disabled"); a2.setAttribute("disabled", "disabled"); }
      row.appendChild(a1); row.appendChild(a2); card.appendChild(row);
    }
    function feedback(card, ok, sure, heading, bodyNodes) {
      var fb = el("div", { class: "nthview-fb " + (ok ? "nthview-fb-ok" : "nthview-fb-bad"), role: "status" });
      fb.appendChild(el("h3", { text: heading }));
      if (!ok && sure === true) fb.appendChild(el("p", { class: "nthview-sure", text: "You were sure, which makes this one worth a second look: confident mistakes are the ones feedback fixes best." }));
      if (ok && sure === false) fb.appendChild(el("p", { class: "nthview-sure", text: "Right, even though you were unsure. Read why, so next time you know it." }));
      bodyNodes.forEach(function (n) { fb.appendChild(n); });
      card.appendChild(fb);
    }
    /* one list of choices: before answering, tap to select; after, tap to read why */
    function choiceList(card, q, a, items, rightIndex, whyOf, after) {
      var answered = a.pick !== undefined && a.pick !== null;
      var sel = answered ? null : a.sel;
      var list = el("div", { class: "nthview-choices", role: "group", "aria-label": "Choices" });
      items.forEach(function (it, j) {
        var cls = "nthview-choice" + (it.colour ? " " + it.colour : "");
        if (answered) {
          if (j === rightIndex) cls += " nthview-right";
          else if (it.value === a.pick) cls += " nthview-wrong";
          if (a.viewing === it.value) cls += " nthview-viewing";
        }
        var b = el("button", { type: "button", class: cls, "aria-pressed": !answered && sel === it.value ? "true" : "false" }, [el("span", { class: "nthview-key", "aria-hidden": "true", text: String(j + 1) })]);
        var tx = el("span", { class: "nthview-ctext" }); tx.appendChild(rich(it.text));
        if (it.sub) tx.appendChild(el("small", { text: it.sub }));
        if (answered && it.owner) tx.appendChild(optName(it.owner));
        b.appendChild(tx);
        if (answered) b.setAttribute("aria-label", it.text + (j === rightIndex ? ", the right answer" : it.value === a.pick ? ", your answer" : "") + ". Show why.");
        b.addEventListener("click", function () {
          if (answered) { answer(q, { viewing: it.value }); redrawQ(); return; }
          answer(q, { sel: it.value }); draw();
          var again = panel.querySelectorAll(".nthview-choice")[j]; if (again) again.focus();
        });
        list.appendChild(b);
      });
      card.appendChild(list);
      if (!answered) {
        checkButtons(card, sel !== undefined && sel !== null, function (sure) { answer(q, { pick: sel, sure: sure, viewing: sel }); delete state.answers[q.id].sel; persist(); redrawQ(); say(isRight(q, sel) ? "Right." : "Not quite."); });
        return;
      }
      var ok = isRight(q, a.pick), view = a.viewing !== undefined ? a.viewing : a.pick;
      var vi = items.map(function (x) { return x.value; }).indexOf(view);
      var nodes = [];
      if (vi !== -1 && vi !== rightIndex) {
        nodes.push(el("p", {}, [el("b", { text: (view === a.pick ? "Your answer: " : "About this one: ") })].concat([rich(items[vi].text)])));
        var w = whyOf(vi); if (w) nodes.push(p(w));
        nodes.push(el("p", {}, [el("b", { text: "The answer: " }), rich(items[rightIndex].text)]));
      }
      var rw = whyOf(rightIndex); if (rw) nodes.push(p(rw));
      (after || []).forEach(function (n) { nodes.push(n); });
      nodes.push(p("Tap any choice to read about it.", "nthview-muted nthview-small"));
      feedback(card, ok, a.sure, ok ? "Right" : "Not quite", nodes);
    }
    function qCell(card, q, a) {
      var o = opt[q.option].o, d = dim[q.dimension];
      card.appendChild(optName(q.option));
      qTitle(card, q.prompt || o.name + ": " + d.name + "?");
      if (d.why) card.appendChild(p(d.why, "nthview-muted nthview-small"));
      var order = shuffled(data.options.map(function (x) { return x.id; }), q.id);
      var items = order.map(function (id) { var c = cell[id + "|" + q.dimension]; return { value: id, text: c.text, owner: id }; });
      var c = cell[q.option + "|" + q.dimension];
      choiceList(card, q, a, items, order.indexOf(q.option), function (j) {
        if (j === order.indexOf(q.option)) return q.why || c.detail || d.takeaway || null;
        var oc2 = cell[order[j] + "|" + q.dimension];
        return "That is " + opt[order[j]].o.name + " on " + d.name.toLowerCase() + "." + (oc2.detail ? " " + oc2.detail : "");
      });
    }
    function qPick(card, q, a) {
      card.appendChild(el("p", { class: "nthview-kicker", text: "Situation" }));
      var s = el("div", { class: "nthview-situation" }); s.appendChild(rich(q.situation)); card.appendChild(s);
      qTitle(card, q.prompt || "Which would you choose?");
      var items = data.options.map(function (o) { return { value: o.id, text: o.name, colour: oc(o.id) }; });
      var ri = data.options.map(function (o) { return o.id; }).indexOf(q.answer);
      choiceList(card, q, a, items, ri, function (j) {
        if (j === ri) return q.why;
        var id = data.options[j].id;
        return (q.notes && q.notes[id]) || null;
      });
    }
    function qChoice(card, q, a) {
      qTitle(card, q.prompt);
      var items = shuffled(q.choices.map(function (c, j) { return { value: j, text: c.text }; }), q.id);
      var ri = -1; items.forEach(function (it, j) { if (q.choices[it.value].correct) ri = j; });
      choiceList(card, q, a, items, ri, function (j) { return q.choices[items[j].value].why; });
    }
    function qSort(card, q, a) {
      qTitle(card, q.prompt || "Which does each statement describe?");
      card.appendChild(p("Mark every option a statement is true of; choose None if it fits none of them.", "nthview-muted nthview-small"));
      var sel = (a.sel || []).slice(), checked = !!a.checked;
      q.statements.forEach(function (s, i) {
        var mine = sel[i] || null;
        var ok = checked && sameSet(mine || [], s.answer);
        var box = el("div", { class: "nthview-stmt" + (checked ? (ok ? " nthview-right" : " nthview-wrong") : ""), role: "group", "aria-label": "Statement " + (i + 1) });
        var pp = el("p"); pp.appendChild(rich(s.text)); box.appendChild(pp);
        var chips = el("div", { class: "nthview-chips" });
        data.options.forEach(function (o) {
          var on = !!mine && mine.indexOf(o.id) !== -1;
          var b = el("button", { type: "button", class: "nthview-chip " + oc(o.id), "aria-pressed": on ? "true" : "false" }, [el("span", { class: "nthview-dot", "aria-hidden": "true" }), el("span", { text: opt[o.id].short })]);
          if (checked) b.setAttribute("disabled", "disabled");
          b.addEventListener("click", function () { var m = (mine || []).filter(function (x) { return x !== o.id; }); if (!on) m.push(o.id); setSel(i, m, b); });
          chips.appendChild(b);
        });
        var none = el("button", { type: "button", class: "nthview-chip", "aria-pressed": mine && !mine.length ? "true" : "false", text: "None" });
        if (checked) none.setAttribute("disabled", "disabled");
        none.addEventListener("click", function () { setSel(i, mine && !mine.length ? null : [], none); });
        chips.appendChild(none);
        box.appendChild(chips);
        if (checked) {
          var ans = s.answer.length === 0 ? "none of them" : s.answer.length === data.options.length ? "all of them" : s.answer.map(function (id) { return opt[id].o.name; }).join(" and ");
          var f = el("p", { class: "nthview-small", style: "margin-top:.5rem;font-weight:400" }, [el("b", { text: (ok ? "Right: " : "It is true of ") + (ok ? "" : ans + ". ") })]);
          if (ok) f.firstChild.textContent = "Right, " + ans + ". ";
          f.appendChild(rich(s.why)); box.appendChild(f);
        }
        card.appendChild(box);
      });
      function setSel(i, v, from) {
        sel[i] = v; answer(q, { sel: sel });
        var chipIndex = Array.prototype.indexOf.call(from.parentNode.children, from);
        draw();
        var nb = panel.querySelectorAll(".nthview-stmt")[i]; if (nb) { var c = nb.querySelectorAll(".nthview-chip")[chipIndex]; if (c) c.focus(); }
      }
      if (!checked) {
        var ready = q.statements.every(function (s, i) { return sel[i] !== null && sel[i] !== undefined; });
        checkButtons(card, ready, function (sure) { answer(q, { checked: true, sure: sure }); redrawQ(); var r = result(q); say(r === "ok" ? "All right." : "Some statements need another look."); });
        if (!ready) card.appendChild(p("Sort every statement to check.", "nthview-muted nthview-small"));
      } else {
        var n = q.statements.filter(function (s, i) { return sameSet(sel[i] || [], s.answer); }).length;
        feedback(card, n === q.statements.length, a.sure, n + " of " + q.statements.length + " sorted right", []);
      }
    }
    function qExplain(card, q, a) {
      qTitle(card, q.prompt);
      var id = "nthview-ex-" + q.id;
      card.appendChild(el("label", { for: id, class: "nthview-small nthview-muted", text: "Write your answer first; nobody grades it. Then compare." }));
      var ta = el("textarea", { id: id, class: "nthview-textarea", maxlength: "2000" });
      ta.value = a.text || "";
      var t = null;
      ta.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { answer(q, { text: ta.value }); updateCount(); }, 300); });
      ta.addEventListener("blur", function () { answer(q, { text: ta.value }); });
      card.appendChild(ta);
      if (!a.shown) {
        card.appendChild(el("div", { class: "nthview-checks" }, [btn("Compare with a model answer", "nthview-primary", function () { answer(q, { text: ta.value, shown: true, ticks: [] }); redrawQ(); })]));
        return;
      }
      var fb = el("div", { class: "nthview-fb" }, [el("h3", { text: "A model answer" })]);
      fb.appendChild(p(q.model));
      fb.appendChild(el("p", { class: "nthview-kicker", style: "margin-top:.8rem", text: "Tick the points your answer covered" }));
      var ul = el("ul", { class: "nthview-ticks" }), ticks = (a.ticks || []).slice();
      q.points.forEach(function (pt, j) {
        var cb = el("input", { type: "checkbox", id: id + "-" + j });
        cb.checked = ticks.indexOf(j) !== -1;
        cb.addEventListener("change", function () { ticks = ticks.filter(function (x) { return x !== j; }); if (cb.checked) ticks.push(j); answer(q, { ticks: ticks }); say(ticks.length + " of " + q.points.length + " points covered."); });
        var lab = el("label", { for: id + "-" + j }, [cb]); lab.appendChild(span(pt)); ul.appendChild(el("li", {}, [lab]));
      });
      fb.appendChild(ul);
      card.appendChild(fb);
    }

    /* ---------- end of practice: the view's end (§5.5 rule 8) ---------- */
    function drawEnd() {
      state.done = true;
      var scored = Q.filter(function (q) { return q.kind !== "explain"; });
      var ok = scored.filter(function (q) { return result(q) === "ok"; }).length;
      var skipped = Q.filter(function (q) { return (state.answers[q.id] || {}).skipped; }).length;
      var confident = Q.filter(function (q) { return result(q) === "bad" && state.answers[q.id].sure === true; });
      var wrap = el("div", { class: "nthview-end nthview-stack" });
      var top = el("div", { class: "nthview-card" }, [el("p", { class: "nthview-kicker", text: "Practice complete" }), el("h2", { text: "You have compared them from every side" })]);
      if (scored.length) top.appendChild(el("p", {}, [el("span", { class: "nthview-score", text: ok + "/" + scored.length }), doc.createTextNode(" right first time" + (skipped ? ", " + skipped + " skipped" : "") + ".")]));
      top.appendChild(p("Nothing here is graded against you; the review shows where the options still blur.", "nthview-muted"));
      wrap.appendChild(top);
      if (data.bigIdea) { var b = el("div", { class: "nthview-card nthview-big" }, [el("p", { class: "nthview-kicker", text: "The big idea" })]); b.appendChild(p(data.bigIdea)); wrap.appendChild(b); }
      if (confident.length) {
        var cc = el("div", { class: "nthview-card" }, [el("h3", { text: "Worth another look: you were sure, and it was not so" })]);
        cc.appendChild(reviewList(confident)); wrap.appendChild(cc);
      }
      var all = el("div", { class: "nthview-card" }, [el("h3", { text: "Every question" })]);
      all.appendChild(reviewList(Q)); wrap.appendChild(all);
      wrap.appendChild(el("div", { class: "nthview-checks" }, [
        btn("Read the recap", "nthview-primary", function () { go("recap"); }),
        btn("Practise again", "", function () {
          clearState(key);
          state.answers = {}; state.q = 0; state.done = false; redrawQ(true);
        })
      ]));
      panel.appendChild(wrap);
    }
    function reviewList(qs) {
      var ul = el("ul", { class: "nthview-review" });
      qs.forEach(function (q) {
        var j = Q.indexOf(q), r = result(q), a = state.answers[q.id];
        var label = r === "ok" ? "Right" : r === "bad" ? "Missed" : r === "seen" ? "Done" : a && a.skipped ? "Skipped" : "Open";
        var b = el("button", { type: "button", text: (j + 1) + ". " + shortTitle(q) });
        b.addEventListener("click", function () { state.q = j; redrawQ(true); });
        ul.appendChild(el("li", {}, [el("span", { class: "nthview-badge" + (r === "ok" ? " nthview-b-ok" : r === "bad" ? " nthview-b-bad" : ""), text: label }), b]));
      });
      return ul;
    }
    function shortTitle(q) {
      var t = q.kind === "pick" ? q.situation : q.kind === "cell" ? (q.prompt || opt[q.option].o.name + ": " + dim[q.dimension].name + "?") : (q.prompt || KIND_LABEL[q.kind]);
      t = t.replace(/\*\*/g, "");
      return t.length > 90 ? t.slice(0, 88) + "…" : t;
    }

    /* ---------- keyboard: number keys pick a choice in practice ---------- */
    container.addEventListener("keydown", function (e) {
      if (sheetOpen || state.tab !== "practice" || e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      if (/^[1-6]$/.test(e.key)) {
        var c = panel.querySelectorAll(".nthview-choice")[parseInt(e.key, 10) - 1];
        if (c) { e.preventDefault(); c.click(); }
      }
    });

    /* ---------- restore saved progress (§5.5); fields that no longer fit are ignored ---------- */
    var saved = loadState(key), resumeText = null;
    if (saved) {
      if (TABS.some(function (t) { return t.id === saved.tab; })) state.tab = saved.tab;
      if (["table", "dimension", "option"].indexOf(saved.layout) !== -1) state.layout = saved.layout;
      if (["all", "diff", "alike"].indexOf(saved.filter) !== -1) state.filter = saved.filter;
      if (Array.isArray(saved.hidden)) {
        var h = saved.hidden.filter(function (id) { return !!opt[id]; });
        if (data.options.length - h.length >= 2) state.hidden = h;
      }
      state.cover = saved.cover === true;
      if (saved.revealed && typeof saved.revealed === "object") Object.keys(saved.revealed).forEach(function (k) { if (cell[k] && typeof saved.revealed[k] === "string") state.revealed[k] = saved.revealed[k]; });
      if (saved.answers && typeof saved.answers === "object") Q.forEach(function (q) { var a = restoreAnswer(q, saved.answers[q.id]); if (a) state.answers[q.id] = a; });
      if (Number.isInteger(saved.q) && saved.q >= 0 && saved.q <= N) state.q = saved.q;
      state.done = saved.done === true;
      var where = state.tab === "practice" ? (state.q < N ? "practice, question " + (state.q + 1) + " of " + N : "the end of practice") : TABS.filter(function (t) { return t.id === state.tab; })[0].label.toLowerCase();
      resumeText = "Welcome back, continuing from " + (state.tab === "practice" ? where : "the " + where + " section") + ".";
    }
    function restoreAnswer(q, a) {
      if (!a || typeof a !== "object") return null;
      if (a.skipped === true) return { skipped: true };
      var r = {};
      if (typeof a.sure === "boolean") r.sure = a.sure;
      function valid(v) { return q.kind === "choice" ? Number.isInteger(v) && v >= 0 && v < q.choices.length : typeof v === "string" && !!opt[v]; }
      if (q.kind === "sort") {
        if (!Array.isArray(a.sel)) return null;
        r.sel = q.statements.map(function (s, i) { var v = a.sel[i]; return Array.isArray(v) ? v.filter(function (id) { return !!opt[id]; }) : null; });
        r.checked = a.checked === true && r.sel.every(function (v) { return v !== null; });
        return r;
      }
      if (q.kind === "explain") {
        r.text = typeof a.text === "string" ? a.text.slice(0, 2000) : "";
        r.shown = a.shown === true;
        r.ticks = Array.isArray(a.ticks) ? a.ticks.filter(function (j) { return Number.isInteger(j) && j >= 0 && j < q.points.length; }) : [];
        return r;
      }
      if (valid(a.pick)) { r.pick = a.pick; if (valid(a.viewing)) r.viewing = a.viewing; }
      else if (valid(a.sel)) r.sel = a.sel;
      else return null;
      return r;
    }

    go(state.tab, true, true); /* opening saves nothing; the first action does */
    if (resumeText) {
      var n = el("div", { class: "nthview-resume", role: "status", text: resumeText });
      notice.appendChild(n);
      var hide = function () {
        container.removeEventListener("pointerdown", hide, true); container.removeEventListener("keydown", hide, true);
        if (!n.parentNode) return;
        n.classList.add("nthview-resume-hide");
        setTimeout(function () { if (n.parentNode) n.parentNode.removeChild(n); }, reduceMotion ? 0 : 450);
      };
      container.addEventListener("pointerdown", hide, true); container.addEventListener("keydown", hide, true);
      setTimeout(hide, 8000);
    }
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-compare");
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
})(typeof globalThis !== "undefined" ? globalThis : window);
