/* NthView — timeline renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first.
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
    "html:has(.nthview-timeline){background:#f6f5f1}body:has(.nthview-timeline){margin:0}",
    "@media (prefers-color-scheme:dark){html:has(.nthview-timeline){background:#0e1015}}",
    ".nthview-timeline{--nv-bg:#f6f5f1;--nv-fg:#17191e;--nv-muted:#596070;--nv-accent:#3450c8;--nv-border:#dedbd2;",
    "  --tl-surface:#fff;--tl-soft:#eeece6;--tl-ok:#17803d;--tl-bad:#b42318;--tl-ok-bg:#e7f5ec;--tl-bad-bg:#fdecea;",
    "  --tl-t0:#c2410c;--tl-t1:#0f766e;--tl-t2:#7c3aed;--tl-tn:#596070;--tl-e0:#3450c8;--tl-e1:#b7791f;--tl-e2:#0e7490;--tl-e3:#a21caf;",
    "  --tl-sans:'IBM Plex Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;--tl-mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;",
    "  max-width:none;padding:0;font-family:var(--tl-sans);min-height:100vh}",
    "@media (prefers-color-scheme:dark){.nthview-timeline{--nv-bg:#0e1015;--nv-fg:#e8e9ee;--nv-muted:#a1a7b5;--nv-accent:#8fa3ff;--nv-border:#2a2f3b;",
    "  --tl-surface:#171a22;--tl-soft:#1e222c;--tl-ok:#4ade80;--tl-bad:#f87171;--tl-ok-bg:#12261a;--tl-bad-bg:#2a1414;",
    "  --tl-t0:#fb923c;--tl-t1:#2dd4bf;--tl-t2:#c4b5fd;--tl-tn:#a1a7b5;--tl-e0:#8fa3ff;--tl-e1:#f6c453;--tl-e2:#67e8f9;--tl-e3:#f0abfc}}",
    ".nthview-timeline>.nthview-error-panel{max-width:46rem;margin:1rem auto}",
    ".nthview-tl{max-width:66rem;margin:0 auto;padding:0 1rem 4rem}",
    ".nthview-tl button{font:inherit;color:inherit;cursor:pointer}",
    ".nthview-tl code{font-family:var(--tl-mono);font-size:.88em;background:var(--tl-soft);padding:0 .25em;border-radius:.25rem;overflow-wrap:anywhere}",
    ".nthview-tl p{margin:.4rem 0}",
    /* sticky bar */
    ".nthview-tl-bar{position:sticky;top:0;z-index:20;margin:0 -1rem;padding:.5rem 1rem .55rem;background:color-mix(in srgb,var(--nv-bg) 90%,transparent);",
    "  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);border-bottom:1px solid var(--nv-border)}",
    ".nthview-tl-barrow{display:flex;align-items:center;gap:.6rem;min-width:0}",
    ".nthview-tl-bartitle{flex:1;min-width:0;font-weight:700;font-size:.92rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-tl-count{font:500 .78rem var(--tl-mono);color:var(--nv-muted);white-space:nowrap}",
    ".nthview-restart{border:1px solid var(--nv-border);background:var(--tl-surface);border-radius:999px;padding:.25rem .75rem;font-size:.82rem!important;font-weight:600}",
    ".nthview-restart:hover{border-color:var(--nv-accent)}",
    ".nthview-tl-mini{position:relative;height:1.1rem;margin-top:.35rem}",
    ".nthview-tl-minibase{position:absolute;left:0;right:0;top:.45rem;height:3px;border-radius:3px;background:var(--nv-border)}",
    ".nthview-tl-minibar{position:absolute;left:0;right:0;top:.1rem;height:1rem}",
    ".nthview-tl-minibar>i{position:absolute;top:.15rem;width:2px;height:.7rem;margin-left:-1px;border-radius:1px;background:var(--tc,var(--tl-tn));opacity:.85}",
    ".nthview-tl-minibar>i.nthview-tl-off{opacity:.25}",
    ".nthview-tl-minibar>b{position:absolute;top:.35rem;height:7px;border-radius:4px;background:var(--ec);opacity:.35}",
    ".nthview-tl-minimark{position:absolute;top:0;width:.85rem;height:.85rem;margin-left:-.425rem;border-radius:50%;background:var(--nv-accent);border:2px solid var(--nv-bg);transition:left .25s}",
    ".nthview-tl-now{font:500 .74rem var(--tl-mono);color:var(--nv-muted);margin-top:.1rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    /* hero */
    ".nthview-tl-hero{padding:2rem 0 1rem;max-width:46rem}",
    ".nthview-tl-kicker{font:500 .78rem var(--tl-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--nv-accent);margin:0}",
    ".nthview-tl-hero h1{font-size:clamp(1.7rem,5.5vw,2.7rem);line-height:1.12;margin:.35rem 0 .5rem;letter-spacing:-.01em}",
    ".nthview-tl-sub{font-size:1.1rem;color:var(--nv-muted);margin:0 0 .8rem!important}",
    ".nthview-tl-how{font-size:.9rem;color:var(--nv-muted);border-left:3px solid var(--nv-accent);padding-left:.7rem;margin:1rem 0!important}",
    ".nthview-tl-legend{display:flex;flex-wrap:wrap;gap:.45rem;margin:1rem 0 .3rem;padding:0;list-style:none}",
    ".nthview-tl-filter{display:inline-flex;align-items:center;gap:.4rem;border:1px solid var(--nv-border);background:var(--tl-surface);border-radius:999px;padding:.3rem .8rem;font-size:.88rem!important;text-align:left}",
    ".nthview-tl-filter[aria-pressed=true]{border-color:var(--nv-fg);box-shadow:inset 0 0 0 1px var(--nv-fg)}",
    ".nthview-tl-sw{width:.7rem;height:.7rem;border-radius:50%;background:var(--tc,var(--tl-tn));flex:none}",
    ".nthview-tl-legtext{font-size:.85rem;color:var(--nv-muted);margin:.2rem 0!important}",
    ".nthview-tl-keys{font-size:.82rem;color:var(--nv-muted)}",
    /* the list and its spine */
    ".nthview-tl-list{list-style:none;margin:1rem 0 0;padding:0;position:relative}",
    ".nthview-tl-list>li{position:relative;padding:0 0 1rem 2.6rem;scroll-margin-top:6.5rem}",
    ".nthview-tl-list>li::before{content:'';position:absolute;left:calc(.95rem - 1px);top:0;bottom:0;width:2px;background:var(--rail,var(--nv-border))}",
    ".nthview-tl-list>li.nthview-tl-inera::before{width:4px;left:calc(.95rem - 2px);opacity:.75}",
    ".nthview-tl-list>li[hidden]{display:none}",
    ".nthview-tl-gapli{padding-bottom:.6rem!important}",
    ".nthview-tl-gap{font:500 .76rem var(--tl-mono);color:var(--nv-muted);margin:0!important;padding:.1rem 0}",
    ".nthview-tl-gap::before{content:'\\2193  '}",
    ".nthview-tl-era{padding-top:.8rem!important;padding-bottom:1rem!important}",
    ".nthview-tl-era h2{margin:0;font-size:1.15rem;color:var(--ec);letter-spacing:.01em}",
    ".nthview-tl-era h2::before{content:'';display:inline-block;width:.6rem;height:.6rem;border-radius:2px;background:var(--ec);margin-right:.5rem;vertical-align:.1rem}",
    ".nthview-tl-era p{color:var(--nv-muted);font-size:.92rem;margin:.2rem 0 0!important}",
    ".nthview-tl-dot{position:absolute;left:calc(.95rem - 7px);top:1.05rem;width:14px;height:14px;border-radius:50%;background:var(--nv-bg);border:3px solid var(--tc,var(--tl-tn));z-index:1}",
    ".nthview-tl-tp .nthview-tl-dot{width:20px;height:20px;left:calc(.95rem - 10px);top:.9rem;background:var(--tc,var(--tl-tn));box-shadow:0 0 0 4px var(--nv-bg),0 0 0 6px var(--tc,var(--tl-tn))}",
    ".nthview-tl-card{background:var(--tl-surface);border:1px solid var(--nv-border);border-left:4px solid var(--tc,var(--tl-tn));border-radius:.6rem;padding:.75rem .95rem .8rem;min-width:0;overflow-wrap:break-word}",
    ".nthview-tl-tp .nthview-tl-card{box-shadow:0 1px 0 var(--nv-border),0 6px 22px -14px var(--tc,var(--tl-tn))}",
    ".nthview-tl-card:focus{outline:none}.nthview-tl-flash .nthview-tl-card{animation:nthview-tl-flash 1.6s}",
    "@keyframes nthview-tl-flash{0%,40%{box-shadow:0 0 0 4px var(--nv-accent)}100%{box-shadow:0 0 0 0 transparent}}",
    ".nthview-tl-meta{display:flex;flex-wrap:wrap;align-items:center;gap:.3rem .6rem;font:500 .8rem var(--tl-mono);color:var(--nv-muted)}",
    ".nthview-tl-meta time{color:var(--nv-fg)}",
    ".nthview-tl-chip{font:600 .7rem var(--tl-sans);text-transform:uppercase;letter-spacing:.05em;color:var(--tc,var(--tl-tn));border:1px solid currentColor;border-radius:999px;padding:0 .45rem}",
    ".nthview-tl-tpchip{font:600 .7rem var(--tl-sans);text-transform:uppercase;letter-spacing:.05em;background:var(--nv-fg);color:var(--nv-bg);border-radius:999px;padding:.05rem .5rem}",
    ".nthview-tl-card h3{font-size:1.08rem;line-height:1.3;margin:.3rem 0 .1rem}",
    ".nthview-tl-more{border:0;background:none;padding:.2rem 0;color:var(--nv-accent);font-weight:600;font-size:.9rem!important}",
    ".nthview-tl-detail{border-top:1px dashed var(--nv-border);margin-top:.4rem;padding-top:.2rem;font-size:.95rem}",
    ".nthview-tl-links{margin-top:.5rem;font-size:.86rem}",
    ".nthview-tl-links>span{display:block;font:600 .7rem var(--tl-sans);text-transform:uppercase;letter-spacing:.06em;color:var(--nv-muted);margin-top:.35rem}",
    ".nthview-tl-links ul{list-style:none;margin:.15rem 0 0;padding:0}",
    ".nthview-tl-links li{margin:.15rem 0;color:var(--nv-muted)}",
    ".nthview-tl-jump{border:0;background:none;padding:0;color:var(--nv-accent);font-weight:600;text-align:left;text-decoration:underline;text-decoration-thickness:1px;text-underline-offset:2px}",
    ".nthview-tl-ck{font:600 .66rem var(--tl-sans);text-transform:uppercase;letter-spacing:.05em;border-radius:.2rem;padding:0 .3rem;margin-right:.3rem;background:var(--tl-soft);color:var(--nv-fg)}",
    ".nthview-tl-src{font-size:.82rem;color:var(--nv-muted);margin-top:.45rem!important}",
    ".nthview-tl-src a,.nthview-tl-refs a{color:var(--nv-accent)}",
    ".nthview-tl-new .nthview-tl-card{animation:nthview-tl-flash 2.4s}",
    /* questions */
    ".nthview-tl-qli .nthview-tl-dot{border-radius:3px;transform:rotate(45deg);border-color:var(--nv-accent);background:var(--nv-accent)}",
    ".nthview-tl-q{background:var(--tl-surface);border:2px solid var(--nv-accent);border-radius:.8rem;padding:.9rem 1rem 1rem;min-width:0}",
    ".nthview-tl-q:focus{outline:none}",
    ".nthview-tl-qkind{font:500 .74rem var(--tl-mono);text-transform:uppercase;letter-spacing:.06em;color:var(--nv-accent);margin:0!important}",
    ".nthview-tl-qp{font-size:1.06rem;font-weight:700;margin:.25rem 0 .6rem!important}",
    ".nthview-tl-opts{list-style:none;margin:0;padding:0;display:grid;gap:.45rem}",
    ".nthview-tl-opt{display:block;width:100%;text-align:left;border:1px solid var(--nv-border);background:var(--nv-bg);border-radius:.55rem;padding:.6rem .75rem;line-height:1.4}",
    "button.nthview-tl-opt:hover{border-color:var(--nv-accent)}",
    ".nthview-tl-opt small{display:block;font:500 .76rem var(--tl-mono);color:var(--nv-muted)}",
    ".nthview-tl-opt.nthview-tl-right{border-color:var(--tl-ok);background:var(--tl-ok-bg)}",
    ".nthview-tl-opt.nthview-tl-wrong{border-color:var(--tl-bad);background:var(--tl-bad-bg)}",
    ".nthview-tl-why{display:block;font-size:.9rem;color:var(--nv-muted);margin-top:.25rem}",
    ".nthview-tl-mark{font-weight:700;margin-right:.35rem}.nthview-tl-right .nthview-tl-mark{color:var(--tl-ok)}.nthview-tl-wrong .nthview-tl-mark{color:var(--tl-bad)}",
    ".nthview-tl-row{display:flex;align-items:center;gap:.5rem}",
    ".nthview-tl-row>span{flex:1;min-width:0}",
    ".nthview-tl-mv{flex:none;width:2.4rem;height:2.4rem;border:1px solid var(--nv-border);background:var(--tl-surface);border-radius:.45rem;font-size:1rem!important}",
    ".nthview-tl-mv:disabled{opacity:.35;cursor:default}",
    ".nthview-tl-pe{border:1px dashed var(--nv-accent);border-radius:.55rem;padding:.6rem .75rem;margin-bottom:.6rem}",
    ".nthview-tl-pe small{display:block;font:500 .76rem var(--tl-mono);color:var(--nv-muted)}",
    ".nthview-tl-slot{display:block;width:100%;border:1px dashed var(--nv-border);background:none;border-radius:.45rem;padding:.35rem .6rem;color:var(--nv-accent);font-size:.86rem!important;font-weight:600;text-align:left}",
    ".nthview-tl-slot:hover{border-color:var(--nv-accent);background:var(--tl-soft)}",
    ".nthview-tl-nb{padding:.25rem .2rem .25rem .75rem;border-left:3px solid var(--nv-border);font-size:.92rem}",
    ".nthview-tl-nb small{font:500 .76rem var(--tl-mono);color:var(--nv-muted);margin-right:.4rem}",
    ".nthview-tl-bins{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.35rem}",
    ".nthview-tl-bin{border:1px solid var(--nv-border);background:var(--tl-surface);border-radius:999px;padding:.2rem .7rem;font-size:.84rem!important}",
    ".nthview-tl-bin[aria-pressed=true]{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--nv-bg)}",
    ".nthview-tl-q textarea{width:100%;min-height:5.5rem;font:inherit;color:inherit;background:var(--nv-bg);border:1px solid var(--nv-border);border-radius:.5rem;padding:.55rem .65rem;resize:vertical}",
    ".nthview-tl-acts{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:.8rem}",
    ".nthview-tl-btn{border:1px solid var(--nv-accent);background:var(--nv-accent);color:var(--nv-bg)!important;border-radius:.5rem;padding:.45rem 1rem;font-weight:600}",
    ".nthview-tl-btn:disabled{opacity:.45;cursor:default}",
    ".nthview-tl-ghost{border:1px solid var(--nv-border);background:none;border-radius:.5rem;padding:.45rem .9rem}",
    ".nthview-tl-hint{font-size:.92rem;background:var(--tl-soft);border-radius:.45rem;padding:.45rem .65rem;margin-top:.6rem!important}",
    ".nthview-tl-res{margin-top:.8rem;border-radius:.55rem;padding:.65rem .8rem;background:var(--tl-soft)}",
    ".nthview-tl-res:focus{outline:none}",
    ".nthview-tl-res h4{margin:0;font-size:.98rem}",
    ".nthview-tl-res.nthview-tl-right h4{color:var(--tl-ok)}.nthview-tl-res.nthview-tl-wrong h4{color:var(--tl-bad)}",
    ".nthview-tl-gate{color:var(--nv-muted);font-size:.92rem}",
    ".nthview-tl-gate::before{background:repeating-linear-gradient(var(--nv-border) 0 6px,transparent 6px 12px)!important}",
    ".nthview-tl-gate p{border:1px dashed var(--nv-border);border-radius:.6rem;padding:.6rem .8rem;margin:0!important}",
    /* end card */
    ".nthview-tl-end{margin:1.5rem auto 0;max-width:46rem;background:var(--tl-surface);border:1px solid var(--nv-border);border-radius:.9rem;padding:1.2rem 1.2rem 1.3rem}",
    ".nthview-tl-end h2{margin:0 0 .4rem;font-size:1.45rem}",
    ".nthview-tl-end h3{margin:1.1rem 0 .3rem;font-size:.8rem;text-transform:uppercase;letter-spacing:.07em;color:var(--nv-muted)}",
    ".nthview-tl-end ul,.nthview-tl-end ol{margin:.2rem 0;padding-left:1.2rem}",
    ".nthview-tl-end li{margin:.25rem 0}",
    ".nthview-tl-score{font:500 .9rem var(--tl-mono)}",
    ".nthview-tl-review{list-style:none;padding:0!important}",
    ".nthview-tl-review li{display:flex;gap:.2rem;align-items:baseline}",
    ".nthview-tl-refs{font-size:.9rem}",
    ".nthview-tl-refs span{color:var(--nv-muted)}",
    ".nthview-resume{position:fixed;left:50%;bottom:1rem;transform:translateX(-50%);z-index:30;max-width:calc(100% - 2rem);background:var(--nv-fg);color:var(--nv-bg);",
    "  padding:.55rem 1rem;border-radius:999px;font-size:.88rem;font-weight:600;box-shadow:0 6px 24px rgba(0,0,0,.25);transition:opacity .5s}",
    /* wide screens: two tracks sit on either side of a centred line */
    "@media (min-width:760px){",
    "  .nthview-tl-two .nthview-tl-list>li{padding:0 0 1.1rem}",
    "  .nthview-tl-two .nthview-tl-list>li::before{left:calc(50% - 1px)}",
    "  .nthview-tl-two .nthview-tl-list>li.nthview-tl-inera::before{left:calc(50% - 2px)}",
    "  .nthview-tl-two .nthview-tl-l{width:50%;padding-right:2.2rem!important}",
    "  .nthview-tl-two .nthview-tl-r{width:50%;margin-left:50%;padding-left:2.2rem!important}",
    "  .nthview-tl-two .nthview-tl-l::before{left:auto!important;right:-1px}",
    "  .nthview-tl-two .nthview-tl-l.nthview-tl-inera::before{right:-2px}",
    "  .nthview-tl-two .nthview-tl-r::before{left:-1px!important}",
    "  .nthview-tl-two .nthview-tl-r.nthview-tl-inera::before{left:-2px!important}",
    "  .nthview-tl-two .nthview-tl-l .nthview-tl-dot{left:auto;right:-7px}",
    "  .nthview-tl-two .nthview-tl-r .nthview-tl-dot{left:-7px}",
    "  .nthview-tl-two .nthview-tl-tp.nthview-tl-l .nthview-tl-dot{right:-10px}.nthview-tl-two .nthview-tl-tp.nthview-tl-r .nthview-tl-dot{left:-10px}",
    "  .nthview-tl-two .nthview-tl-l .nthview-tl-card{border-left-width:1px;border-right:4px solid var(--tc,var(--tl-tn))}",
    "  .nthview-tl-two .nthview-tl-gapli,.nthview-tl-two .nthview-tl-era,.nthview-tl-two .nthview-tl-gate{text-align:center}",
    "  .nthview-tl-two .nthview-tl-gap{display:inline-block;background:var(--nv-bg);position:relative;padding:.1rem .5rem}",
    "  .nthview-tl-two .nthview-tl-era h2,.nthview-tl-two .nthview-tl-era p{display:block;width:max-content;max-width:min(30rem,90%);margin-left:auto!important;margin-right:auto!important;background:var(--nv-bg);position:relative;padding:0 .6rem}",
    "  .nthview-tl-two .nthview-tl-gate p{max-width:30rem;margin:0 auto!important;background:var(--nv-bg);position:relative}",
    "  .nthview-tl-two .nthview-tl-qli{padding-top:.3rem}",
    "  .nthview-tl-two .nthview-tl-qli .nthview-tl-dot{display:none}",
    "  .nthview-tl-two .nthview-tl-q{max-width:40rem;margin:0 auto;position:relative}",
    "  .nthview-tl-one .nthview-tl-list,.nthview-tl-one .nthview-tl-end{max-width:46rem}",
    "  .nthview-tl-one .nthview-tl-end{margin-left:0}",
    "}",
    "@media (prefers-reduced-motion:reduce){.nthview-tl *{animation:none!important;transition:none!important}}"
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
    return "nthview:timeline:" + (h >>> 0).toString(36);
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

  // ---- text and dates ----------------------------------------------------
  /* **bold** and `code`, built as nodes so data can never inject markup */
  function inline(text) {
    var frag = root.document.createDocumentFragment();
    String(text).split(/(\*\*[^*]+\*\*|`[^`]+`)/).forEach(function (part) {
      if (!part) return;
      if (/^\*\*[^*]+\*\*$/.test(part)) frag.appendChild(el("strong", { text: part.slice(2, -2) }));
      else if (/^`[^`]+`$/.test(part)) frag.appendChild(el("code", { text: part.slice(1, -1) }));
      else frag.appendChild(root.document.createTextNode(part));
    });
    return frag;
  }
  function para(text, cls) { var p = el("p", cls ? { class: cls } : {}); p.appendChild(inline(text)); return p; }
  function span(text, cls) { var s = el("span", cls ? { class: cls } : {}); s.appendChild(inline(text)); return s; }

  var MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  function parseDate(s) {
    var m = /^(-?\d{1,6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}))?)?)?$/.exec(s);
    return { y: parseInt(m[1], 10), mo: m[2] ? +m[2] : 0, d: m[3] ? +m[3] : 0, h: m[4] ? +m[4] : 0, mi: m[5] ? +m[5] : 0, p: m[4] ? 4 : m[3] ? 3 : m[2] ? 2 : 1 };
  }
  function yearText(y) { return y < 0 ? (-y) + " BCE" : String(y); }
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function fmtDate(t, tz) {
    if (t.p === 1) return yearText(t.y);
    if (t.p === 2) return MONTHS[t.mo - 1] + " " + yearText(t.y);
    var s = t.d + " " + MONTHS[t.mo - 1] + " " + yearText(t.y);
    return t.p === 4 ? s + ", " + two(t.h) + ":" + two(t.mi) + (tz ? " " + tz : "") : s;
  }
  function fmtSpan(a, b, tz) {
    if (a.p === 3 && b.p === 3 && a.y === b.y) {
      if (a.mo === b.mo) return a.d + "–" + b.d + " " + MONTHS[a.mo - 1] + " " + yearText(a.y);
      return a.d + " " + MONTHS[a.mo - 1] + " – " + b.d + " " + MONTHS[b.mo - 1] + " " + yearText(a.y);
    }
    if (a.p === 1 && b.p === 1) return yearText(a.y) + "–" + yearText(b.y);
    return fmtDate(a, tz) + " – " + fmtDate(b, tz);
  }
  function toMs(t, p) {
    p = p || t.p;
    var d = new Date(0);
    d.setUTCFullYear(t.y, p > 1 ? t.mo - 1 : 0, p > 2 ? t.d : 1);
    d.setUTCHours(p > 3 ? t.h : 0, p > 3 ? t.mi : 0, 0, 0);
    return d.getTime();
  }
  function plural(n, w) { return n.toLocaleString("en") + " " + w + (n === 1 ? "" : "s") + " later"; }
  /* elapsed time between neighbours, at the coarser of the two precisions */
  function gapText(a, b) {
    var p = Math.min(a.p, b.p);
    if (p === 1) { var dy = b.y - a.y; return dy > 0 ? plural(dy, "year") : ""; }
    var months = (b.y - a.y) * 12 + (b.mo - a.mo);
    if (p === 2) return months <= 0 ? "" : months < 24 ? plural(months, "month") : plural(Math.round(months / 12), "year");
    if (p === 4) {
      var mins = Math.round((toMs(b, 4) - toMs(a, 4)) / 60000);
      if (mins <= 0) return "";
      if (mins < 60) return mins + " min later";
      if (mins < 1440) return Math.floor(mins / 60) + " h" + (mins % 60 ? " " + (mins % 60) + " min" : "") + " later";
    }
    var days = Math.round((toMs(b, 3) - toMs(a, 3)) / 86400000);
    if (days <= 0) return p === 3 ? "Same day" : "";
    if (days === 1) return "Next day";
    if (days < 14) return plural(days, "day");
    if (days < 61) return plural(Math.round(days / 7), "week");
    if (b.d < a.d) months--;
    if (days < 730) return plural(Math.max(months, 2), "month");
    return plural(Math.round(days / 365.25), "year");
  }
  function hashOf(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  var KIND_LABEL = { order: "Put in order", place: "Where does it fit?", cause: "Cause and effect", choice: "Quick check", sort: "Sort it", reflect: "Think it through" };
  var DEFAULT_PROMPT = { order: "Put these in time order, earliest first.", place: "Where does this event belong?", choice: "Choose one.", sort: "Put each item in the right group." };
  var CAUSE_LABEL = { trigger: "Trigger", condition: "Condition" };

  // ---- view-specific rendering: data is already valid here ---------------
  function render(container, data) {
    var key = storageKey(data);
    var doc = root.document;
    var tz = data.timeZone || "";
    var stepMode = data.reveal !== "open";
    var showGaps = data.gaps !== false;
    var tracks = data.tracks || [];
    var questions = data.questions || [];
    var refs = data.references || [];
    var reduce = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);

    var evById = {}, trackIdx = {};
    tracks.forEach(function (t, i) { trackIdx[t.id] = i; });
    data.events.forEach(function (e, i) {
      evById[e.id] = { e: e, i: i, t: parseDate(e.date), end: e.end ? parseDate(e.end) : null, effects: [] };
    });
    data.events.forEach(function (e) {
      (e.causes || []).forEach(function (c) { evById[c.event].effects.push({ id: e.id, c: c }); });
    });
    var placeOf = {};
    questions.forEach(function (q) { if (q.kind === "place") placeOf[q.event] = q; });
    function label(id) { var x = evById[id]; return x.e.label || (x.end ? fmtSpan(x.t, x.end, tz) : fmtDate(x.t, tz)); }
    function tcolor(e) { return e.track !== undefined ? "var(--tl-t" + trackIdx[e.track] + ")" : "var(--tl-tn)"; }

    // ---- state, restored field by field --------------------------------
    var saved = loadState(key) || {};
    var state = { ans: {}, open: {}, track: null, at: null, done: saved.done === true };
    var qById = {};
    questions.forEach(function (q) { qById[q.id] = q; });
    if (saved.ans && typeof saved.ans === "object") {
      Object.keys(saved.ans).forEach(function (id) { var a = cleanAnswer(qById[id], saved.ans[id]); if (a) state.ans[id] = a; });
    }
    if (saved.open && typeof saved.open === "object") Object.keys(saved.open).forEach(function (id) { if (evById[id]) state.open[id] = true; });
    if (typeof saved.track === "string" && trackIdx[saved.track] !== undefined) state.track = saved.track;
    if (typeof saved.at === "string" && evById[saved.at]) state.at = saved.at;
    function persist() { saveState(key, { ans: state.ans, open: state.open, track: state.track, at: state.at, done: state.done }); }

    function cleanAnswer(q, a) {
      if (!q || !a || typeof a !== "object") return null;
      var s = a.s === "right" || a.s === "wrong" || a.s === "skip" || a.s === "seen" ? a.s : undefined;
      var out = { s: s };
      if (q.kind === "order") {
        var ids = q.events.slice().sort();
        if (!Array.isArray(a.cur) || a.cur.slice().sort().join("|") !== ids.join("|")) return null;
        out.cur = a.cur.slice();
        if (Array.isArray(a.first) && a.first.slice().sort().join("|") === ids.join("|")) out.first = a.first.slice();
        if (s && !out.first) out.first = out.cur.slice();
      } else if (q.kind === "sort") {
        out.cur = {};
        if (a.cur && typeof a.cur === "object") Object.keys(a.cur).forEach(function (k) {
          var b = a.cur[k];
          if (q.items[k] && typeof b === "number" && b >= 0 && b < q.bins.length) out.cur[k] = b;
        });
        if (s && Object.keys(out.cur).length !== q.items.length && s !== "skip") return null;
      } else if (q.kind === "reflect") {
        out.text = typeof a.text === "string" ? a.text.slice(0, 4000) : "";
        if (s && s !== "seen") out.s = "seen";
      } else {
        var n = q.kind === "place" ? q.among.length + 1 : q.options.length;
        out.pick = typeof a.pick === "number" && a.pick % 1 === 0 && a.pick >= 0 && a.pick < n ? a.pick : -1;
        if ((s === "right" || s === "wrong") && out.pick === -1) return null;
        if (s === "right" || s === "wrong") out.s = out.pick === answerOf(q) ? "right" : "wrong";
      }
      if (!out.s) delete out.s;
      return out;
    }
    function answerOf(q) {
      if (q.kind === "place") {
        var target = evById[q.event].i;
        return q.among.filter(function (id) { return evById[id].i < target; }).length;
      }
      if (q.kind === "choice") { for (var i = 0; i < q.options.length; i++) if (q.options[i].correct === true) return i; }
      if (q.kind === "cause") {
        for (var k = 0; k < q.options.length; k++) {
          var o = q.options[k];
          var hit = q.ask === "effect" ? (evById[o.event].e.causes || []).some(function (c) { return c.event === q.event; })
            : (evById[q.event].e.causes || []).some(function (c) { return c.event === o.event; });
          if (hit) return k;
        }
      }
      return -1;
    }
    function promptOf(q) {
      if (q.prompt) return q.prompt;
      if (q.kind !== "cause") return DEFAULT_PROMPT[q.kind];
      return (q.ask === "effect" ? "What did “" : "What led to “") + evById[q.event].e.title.replace(/\*\*|`/g, "") + (q.ask === "effect" ? "” lead to?" : "”?");
    }
    function settled(q) { var a = state.ans[q.id]; return !!(a && a.s); }

    // ---- page frame ------------------------------------------------------
    var shell = el("div", { class: "nthview-tl " + (tracks.length === 2 ? "nthview-tl-two" : "nthview-tl-one") });
    container.appendChild(shell);

    var countNode = el("span", { class: "nthview-tl-count", "aria-live": "polite" });
    var miniBar = el("div", { class: "nthview-tl-minibar", "aria-hidden": "true" });
    var miniMark = el("span", { class: "nthview-tl-minimark", "aria-hidden": "true" });
    var nowNode = el("div", { class: "nthview-tl-now" });
    var bar = el("header", { class: "nthview-tl-bar" }, [
      el("div", { class: "nthview-tl-barrow" }, [el("span", { class: "nthview-tl-bartitle", text: data.title }), countNode, restartButton(container, data, key)]),
      el("div", { class: "nthview-tl-mini" }, [el("span", { class: "nthview-tl-minibase" }), miniBar, miniMark]),
      nowNode
    ]);
    shell.appendChild(bar);

    // proportional overview: where each event really falls in time
    var t0 = toMs(evById[data.events[0].id].t), t1 = t0;
    data.events.forEach(function (e) { var x = evById[e.id]; t1 = Math.max(t1, toMs(x.end || x.t)); });
    var span0 = t1 - t0 || 1;
    function pos(ms) { return Math.max(0, Math.min(100, (ms - t0) / span0 * 100)); }
    (data.eras || []).forEach(function (a, k) {
      var s = pos(toMs(evById[a.from].t)), x = evById[a.to], f = pos(toMs(x.end || x.t));
      miniBar.appendChild(el("b", { style: "left:" + s + "%;width:" + Math.max(f - s, .6) + "%;--ec:var(--tl-e" + (k % 4) + ")" }));
    });
    var ticks = {};
    data.events.forEach(function (e) {
      ticks[e.id] = el("i", { style: "left:" + pos(toMs(evById[e.id].t)) + "%;--tc:" + tcolor(e) });
      miniBar.appendChild(ticks[e.id]);
    });

    // hero
    var gradable = questions.filter(function (q) { return q.kind !== "reflect"; }).length;
    var first = evById[data.events[0].id], last = evById[data.events[data.events.length - 1].id];
    var range = fmtDate(first.t, "").replace(/, \d\d:\d\d.*$/, "") + " – " + fmtDate(last.end || last.t, "").replace(/, \d\d:\d\d.*$/, "");
    var hero = el("section", { class: "nthview-tl-hero" }, [
      el("p", { class: "nthview-tl-kicker", text: "Timeline · " + range }),
      el("h1", { text: data.title })
    ]);
    if (data.subtitle) hero.appendChild(para(data.subtitle, "nthview-tl-sub"));
    (data.intro || []).forEach(function (t) { hero.appendChild(para(t)); });
    hero.appendChild(el("p", { class: "nthview-tl-how", text: data.events.length + " events" + (questions.length ? " and " + questions.length + " questions. " +
      (stepMode ? "Questions sit between the events; answer or skip each one to reveal what happens next." : "Questions sit between the events; answer them in any order.") : ". Read from top to bottom.") +
      " Every answer is explained." }));
    var filterBtns = [];
    if (tracks.length) {
      var legend = el("ul", { class: "nthview-tl-legend", "aria-label": "Show events from" });
      [{ id: null, label: "All events" }].concat(tracks).forEach(function (t) {
        var b = el("button", { type: "button", class: "nthview-tl-filter", "aria-pressed": String(state.track === t.id) });
        if (t.id !== null) b.appendChild(el("span", { class: "nthview-tl-sw", style: "--tc:var(--tl-t" + trackIdx[t.id] + ")" }));
        b.appendChild(doc.createTextNode(t.label));
        b.addEventListener("click", function () { state.track = t.id; persist(); update(); });
        filterBtns.push({ b: b, id: t.id });
        legend.appendChild(el("li", {}, [b]));
      });
      hero.appendChild(legend);
      tracks.forEach(function (t) { if (t.text) hero.appendChild(el("p", { class: "nthview-tl-legtext" }, [el("strong", { text: t.label + ": " }), inline(t.text)])); });
    }
    var anyKind = data.events.some(function (e) { return (e.causes || []).some(function (c) { return c.kind; }); });
    if (anyKind) hero.appendChild(el("p", { class: "nthview-tl-keys" }, [el("span", { class: "nthview-tl-ck", text: "Trigger" }), doc.createTextNode("the immediate spark   "),
      el("span", { class: "nthview-tl-ck", text: "Condition" }), doc.createTextNode("a longer-standing state that made it possible")]));
    shell.appendChild(hero);

    // ---- the stream: eras, gaps, events and questions in order ------------
    var list = el("ol", { class: "nthview-tl-list" });
    shell.appendChild(list);
    var stream = [];
    var eraOf = {};
    (data.eras || []).forEach(function (a, k) { for (var i = evById[a.from].i; i <= evById[a.to].i; i++) eraOf[i] = k; });
    var qAfter = {};
    questions.forEach(function (q) { (qAfter[q.after] = qAfter[q.after] || []).push(q); });
    var inEra = -1;
    data.events.forEach(function (e, i) {
      var x = evById[e.id];
      var era = eraOf[i] !== undefined ? eraOf[i] : -1;
      if (era !== -1 && (data.eras[era].from === e.id)) {
        var a = data.eras[era];
        var head = el("li", { class: "nthview-tl-era", style: "--ec:var(--tl-e" + (era % 4) + ")" }, [el("h2", { text: a.label })]);
        if (a.text) head.appendChild(para(a.text));
        list.appendChild(head);
        stream.push({ type: "era", node: head });
      }
      inEra = era;
      var gapNode = el("li", { class: "nthview-tl-gapli", "aria-hidden": "true" }, [el("p", { class: "nthview-tl-gap" })]);
      list.appendChild(gapNode);
      stream.push({ type: "gap", node: gapNode, era: inEra, ev: x });
      x.gap = gapNode;
      x.node = eventNode(x);
      list.appendChild(x.node);
      stream.push({ type: "event", node: x.node, era: inEra, ev: x });
      (qAfter[e.id] || []).forEach(function (q) {
        var qn = questionNode(q);
        list.appendChild(qn.li);
        stream.push({ type: "question", node: qn.li, era: inEra, q: q, qn: qn });
      });
    });
    stream.forEach(function (s) {
      if (s.era !== undefined && s.era !== -1) { s.node.classList.add("nthview-tl-inera"); s.node.style.setProperty("--rail", "var(--tl-e" + (s.era % 4) + ")"); }
    });
    var gate = el("li", { class: "nthview-tl-gate" }, [el("p", {})]);
    list.appendChild(gate);
    var endNode = el("section", { class: "nthview-tl-end", "aria-labelledby": "nthview-tl-endh" });
    shell.appendChild(endNode);

    function eventNode(x) {
      var e = x.e;
      var side = tracks.length === 2 ? (e.track !== undefined && trackIdx[e.track] === 0 ? " nthview-tl-l" : " nthview-tl-r") : "";
      var li = el("li", { class: "nthview-tl-ev" + side + (e.turningPoint ? " nthview-tl-tp" : ""), id: "nthview-ev-" + e.id, style: "--tc:" + tcolor(e) });
      li.appendChild(el("span", { class: "nthview-tl-dot", "aria-hidden": "true" }));
      var card = el("article", { class: "nthview-tl-card", tabindex: "-1", "aria-labelledby": "nthview-evh-" + e.id });
      var meta = el("div", { class: "nthview-tl-meta" });
      var time = el("time", { text: label(e.id) });
      if (/^\d{4}(-\d\d(-\d\d(T\d\d:\d\d)?)?)?$/.test(e.date)) time.setAttribute("datetime", e.date + (e.date.length > 10 && tz === "UTC" ? "Z" : ""));
      meta.appendChild(time);
      if (e.track !== undefined) meta.appendChild(el("span", { class: "nthview-tl-chip", text: tracks[trackIdx[e.track]].label }));
      if (e.turningPoint) meta.appendChild(el("span", { class: "nthview-tl-tpchip", text: "Turning point" }));
      card.appendChild(meta);
      var h = el("h3", { id: "nthview-evh-" + e.id });
      h.appendChild(inline(e.title));
      card.appendChild(h);
      card.appendChild(para(e.text));
      if (e.detail) {
        var det = el("div", { class: "nthview-tl-detail", id: "nthview-evd-" + e.id }, e.detail.map(function (t) { return para(t); }));
        var more = el("button", { type: "button", class: "nthview-tl-more", "aria-controls": det.id });
        var sync = function () { var o = !!state.open[e.id]; det.hidden = !o; more.setAttribute("aria-expanded", String(o)); more.textContent = o ? "Show less" : "Read more"; };
        more.addEventListener("click", function () { if (state.open[e.id]) delete state.open[e.id]; else state.open[e.id] = true; sync(); persist(); });
        sync();
        card.appendChild(more);
        card.appendChild(det);
      }
      if (e.causes) {
        card.appendChild(linkBlock("Because of", e.causes.map(function (c) { return { id: c.event, how: c.how, kind: c.kind }; })));
      }
      x.effectsBox = el("div", {});
      card.appendChild(x.effectsBox);
      if (e.refs) {
        var src = el("p", { class: "nthview-tl-src" }, [doc.createTextNode(e.refs.length > 1 ? "Sources: " : "Source: ")]);
        e.refs.forEach(function (r, k) {
          if (k) src.appendChild(doc.createTextNode(" · "));
          var ref = refs[r];
          src.appendChild(ref.url ? el("a", { href: ref.url, target: "_blank", rel: "noopener noreferrer", text: ref.title + " ↗" }) : el("span", { text: ref.title }));
        });
        card.appendChild(src);
      }
      li.appendChild(card);
      return li;
    }
    function linkBlock(title, items) {
      var box = el("div", { class: "nthview-tl-links" }, [el("span", { text: title })]);
      box.appendChild(el("ul", {}, items.map(function (it) {
        var row = el("li", {});
        if (it.kind) row.appendChild(el("span", { class: "nthview-tl-ck", text: CAUSE_LABEL[it.kind] }));
        var b = el("button", { type: "button", class: "nthview-tl-jump" });
        b.appendChild(inline(evById[it.id].e.title));
        b.addEventListener("click", function () { jumpTo(evById[it.id].node); });
        row.appendChild(b);
        row.appendChild(doc.createTextNode(" · " + label(it.id)));
        if (it.how) { row.appendChild(doc.createTextNode(" — ")); row.appendChild(inline(it.how)); }
        return row;
      })));
      return box;
    }

    // ---- questions ---------------------------------------------------------
    function questionNode(q) {
      var li = el("li", { class: "nthview-tl-qli", id: "nthview-q-" + q.id });
      li.appendChild(el("span", { class: "nthview-tl-dot", "aria-hidden": "true" }));
      var card = el("section", { class: "nthview-tl-q", tabindex: "-1", "aria-labelledby": "nthview-qh-" + q.id });
      li.appendChild(card);
      var qn = { li: li, card: card };
      qn.draw = function (focusSel) { drawQuestion(q, card); if (focusSel) { var f = card.querySelector(focusSel); if (f) f.focus(); } };
      qn.draw();
      return qn;
    }
    function ans(q) {
      if (!state.ans[q.id]) {
        var a = {};
        if (q.kind === "order") a.cur = shuffled(q);
        if (q.kind === "sort") a.cur = {};
        if (q.kind === "reflect") a.text = "";
        if (q.kind === "choice" || q.kind === "cause" || q.kind === "place") a.pick = -1;
        state.ans[q.id] = a;
      }
      return state.ans[q.id];
    }
    function shuffled(q) {
      var ids = q.events.slice(), h = hashOf(q.id);
      for (var i = ids.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0; var j = h % (i + 1), t = ids[i]; ids[i] = ids[j]; ids[j] = t; }
      var right = correctOrder(q);
      if (ids.join("|") === right.join("|")) ids.push(ids.shift());
      return ids;
    }
    function correctOrder(q) { return q.events.slice().sort(function (a, b) { return evById[a].i - evById[b].i; }); }
    function settle(q, s, extra) {
      var a = ans(q);
      Object.keys(extra || {}).forEach(function (k) { a[k] = extra[k]; });
      a.s = s;
      persist();
      if (q.kind === "place") evById[q.event].node.classList.add("nthview-tl-new");
      streamOf(q).qn.draw(".nthview-tl-res");
      update();
      if (endInView()) markDone();
    }
    function streamOf(q) { for (var i = 0; i < stream.length; i++) if (stream[i].q === q) return stream[i]; return null; }

    function drawQuestion(q, card) {
      card.innerHTML = "";
      var a = state.ans[q.id] || {};
      var done = !!a.s;
      card.appendChild(el("p", { class: "nthview-tl-qkind", text: KIND_LABEL[q.kind] }));
      var h = el("h3", { class: "nthview-tl-qp", id: "nthview-qh-" + q.id });
      h.appendChild(inline(promptOf(q)));
      card.appendChild(h);
      var body = el("div", {});
      card.appendChild(body);
      var acts = el("div", { class: "nthview-tl-acts" });
      ({ order: drawOrder, place: drawPlace, cause: drawPick, choice: drawPick, sort: drawSort, reflect: drawReflect })[q.kind](q, a, done, body, acts);
      if (!done) {
        if (q.hint) {
          var hint = para(q.hint, "nthview-tl-hint");
          hint.hidden = true;
          var hb = el("button", { type: "button", class: "nthview-tl-ghost", "aria-expanded": "false", text: "Hint" });
          hb.addEventListener("click", function () { hint.hidden = !hint.hidden; hb.setAttribute("aria-expanded", String(!hint.hidden)); });
          acts.appendChild(hb);
          card.appendChild(acts);
          card.appendChild(hint);
        }
        if (q.kind !== "reflect") {
          var skip = el("button", { type: "button", class: "nthview-tl-ghost", text: "Skip and show the answer" });
          skip.addEventListener("click", function () { settle(q, "skip"); });
          acts.appendChild(skip);
        }
        if (acts.childNodes.length && !acts.parentNode) card.appendChild(acts);
        return;
      }
      var res = el("div", { class: "nthview-tl-res" + (a.s === "right" ? " nthview-tl-right" : a.s === "wrong" ? " nthview-tl-wrong" : ""), tabindex: "-1", role: "status" });
      res.appendChild(el("h4", { text: a.s === "right" ? "✓ Right" : a.s === "wrong" ? "✗ Not quite" : a.s === "seen" ? "One good answer" : "Skipped: here is the answer" }));
      res.appendChild(para(q.explain));
      card.appendChild(res);
      var more = el("div", { class: "nthview-tl-acts" });
      if (q.kind === "place") {
        var see = el("button", { type: "button", class: "nthview-tl-ghost", text: "See it on the timeline" });
        see.addEventListener("click", function () { jumpTo(evById[q.event].node); });
        more.appendChild(see);
      }
      var next = el("button", { type: "button", class: "nthview-tl-ghost", text: "Continue ↓" });
      next.addEventListener("click", function () {
        var s0 = streamOf(q), i = stream.indexOf(s0) + 1;
        while (i < stream.length && (stream[i].node.hidden || stream[i].type === "gap")) i++;
        var target = i < stream.length ? stream[i].node : endNode;
        if (target.hidden) return;
        target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
        var f = target.querySelector(".nthview-tl-card,.nthview-tl-q") || target.querySelector("h2");
        if (f) { if (!f.hasAttribute("tabindex")) f.setAttribute("tabindex", "-1"); try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
      });
      more.appendChild(next);
      card.appendChild(more);
    }
    function pickRow(text, small) {
      var b = el("span", {});
      if (small) b.appendChild(el("small", { text: small }));
      b.appendChild(inline(text));
      return b;
    }
    function drawPick(q, a, done, body) {
      var right = answerOf(q);
      var ul = el("ul", { class: "nthview-tl-opts" });
      q.options.forEach(function (o, k) {
        var text = q.kind === "cause" ? evById[o.event].e.title : o.text;
        var small = q.kind === "cause" ? label(o.event) : "";
        if (!done) {
          var b = el("button", { type: "button", class: "nthview-tl-opt" });
          b.appendChild(pickRow(text, small));
          b.addEventListener("click", function () { settle(q, k === right ? "right" : "wrong", { pick: k }); });
          ul.appendChild(el("li", {}, [b]));
          return;
        }
        var isRight = k === right, mine = k === a.pick;
        var row = el("div", { class: "nthview-tl-opt" + (isRight ? " nthview-tl-right" : mine ? " nthview-tl-wrong" : "") });
        if (small) row.appendChild(el("small", { text: small }));
        if (isRight || mine) row.appendChild(el("span", { class: "nthview-tl-mark", text: isRight ? "✓" : "✗" }));
        row.appendChild(inline(text));
        if (mine) row.appendChild(el("span", { class: "nthview-tl-why", text: "Your answer." }));
        if (o.why) row.appendChild(span(o.why, "nthview-tl-why"));
        ul.appendChild(el("li", {}, [row]));
      });
      if (q.kind === "cause") {
        var focus = evById[q.event];
        body.appendChild(el("div", { class: "nthview-tl-pe" }, [pickRow(focus.e.title, label(q.event))]));
      }
      body.appendChild(ul);
    }
    function drawOrder(q, a, done, body, acts) {
      var cur = done ? correctOrder(q) : ans(q).cur;
      var mine = a.first || a.cur;
      var ol = el("ol", { class: "nthview-tl-opts" });
      cur.forEach(function (id, k) {
        var x = evById[id];
        if (done) {
          var ok = a.s !== "skip" && mine[k] === id;
          var row = el("div", { class: "nthview-tl-opt" + (a.s === "skip" ? "" : ok ? " nthview-tl-right" : " nthview-tl-wrong") }, [el("small", { text: (k + 1) + ". " + label(id) })]);
          if (a.s !== "skip") row.appendChild(el("span", { class: "nthview-tl-mark", text: ok ? "✓" : "✗" }));
          row.appendChild(inline(x.e.title));
          if (a.s !== "skip" && !ok) row.appendChild(el("span", { class: "nthview-tl-why", text: "You put it " + ordinal(mine.indexOf(id) + 1) + "." }));
          ol.appendChild(el("li", {}, [row]));
          return;
        }
        var title = x.e.title.replace(/\*\*|`/g, "");
        var up = el("button", { type: "button", class: "nthview-tl-mv", "aria-label": "Move \u201c" + title + "\u201d up", "data-mv": id + ":up", text: "↑" });
        var dn = el("button", { type: "button", class: "nthview-tl-mv", "aria-label": "Move \u201c" + title + "\u201d down", "data-mv": id + ":dn", text: "↓" });
        if (k === 0) up.disabled = true;
        if (k === cur.length - 1) dn.disabled = true;
        function move(d) {
          var c = ans(q).cur, i = c.indexOf(id), j = i + d;
          if (j < 0 || j >= c.length) return;
          c[i] = c[j]; c[j] = id;
          persist();
          var sel = "[data-mv=\"" + id + ":" + (d < 0 ? "up" : "dn") + "\"]";
          streamOf(q).qn.draw(sel);
          var f = streamOf(q).qn.card.querySelector(sel);
          if (f && f.disabled) { var other = streamOf(q).qn.card.querySelector("[data-mv=\"" + id + ":" + (d < 0 ? "dn" : "up") + "\"]"); if (other) other.focus(); }
        }
        up.addEventListener("click", function () { move(-1); });
        dn.addEventListener("click", function () { move(1); });
        var t = el("span", {});
        t.appendChild(inline(x.e.title));
        ol.appendChild(el("li", {}, [el("div", { class: "nthview-tl-opt nthview-tl-row" }, [el("small", { text: String(k + 1) }), t, up, dn])]));
      });
      body.appendChild(ol);
      if (done) {
        if (a.s !== "skip") {
          var n = correctOrder(q).filter(function (id, k) { return mine[k] === id; }).length;
          body.appendChild(el("p", { class: "nthview-tl-score", text: n + " of " + cur.length + " in the right place. The correct order, with dates:" }));
          body.insertBefore(body.lastChild, ol);
        }
        return;
      }
      var check = el("button", { type: "button", class: "nthview-tl-btn", text: "Check order" });
      check.addEventListener("click", function () {
        var c = ans(q).cur;
        settle(q, c.join("|") === correctOrder(q).join("|") ? "right" : "wrong", { first: c.slice() });
      });
      acts.appendChild(check);
      body.parentNode.appendChild(acts);
    }
    function ordinal(n) { return n + (n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"); }
    function drawPlace(q, a, done, body) {
      var target = evById[q.event];
      var among = q.among.slice().sort(function (p, r) { return evById[p].i - evById[r].i; });
      var right = answerOf(q);
      if (!done) {
        var pe = el("div", { class: "nthview-tl-pe" }, [el("small", { text: "Date hidden" })]);
        var h = el("strong", {});
        h.appendChild(inline(target.e.title));
        pe.appendChild(h);
        pe.appendChild(para(target.e.text));
        body.appendChild(pe);
      }
      var ul = el("ul", { class: "nthview-tl-opts" });
      function slot(g) {
        var text = g === 0 ? "Before " + plain(among[0]) : g === among.length ? "After " + plain(among[among.length - 1]) : "Between " + plain(among[g - 1]) + " and " + plain(among[g]);
        if (!done) {
          var b = el("button", { type: "button", class: "nthview-tl-slot", "aria-label": "Put it here: " + text, text: "＋ Put it here" });
          b.addEventListener("click", function () { settle(q, g === right ? "right" : "wrong", { pick: g }); });
          ul.appendChild(el("li", {}, [b]));
        } else if (g === right) {
          var row = el("div", { class: "nthview-tl-opt nthview-tl-right" }, [el("small", { text: label(q.event) }), el("span", { class: "nthview-tl-mark", text: "✓" })]);
          row.appendChild(inline(target.e.title));
          if (a.pick === g) row.appendChild(el("span", { class: "nthview-tl-why", text: "You put it here." }));
          ul.appendChild(el("li", {}, [row]));
        } else if (g === a.pick) {
          ul.appendChild(el("li", {}, [el("div", { class: "nthview-tl-opt nthview-tl-wrong" }, [el("span", { class: "nthview-tl-mark", text: "✗" }), el("span", { text: "You put it here." })])]));
        }
      }
      among.forEach(function (id, k) {
        slot(k);
        var nb = el("li", { class: "nthview-tl-nb" }, [el("small", { text: label(id) })]);
        nb.appendChild(inline(evById[id].e.title));
        ul.appendChild(nb);
      });
      slot(among.length);
      body.appendChild(ul);
    }
    function plain(id) { return "\u201c" + evById[id].e.title.replace(/\*\*|`/g, "") + "\u201d"; }
    function drawSort(q, a, done, body, acts) {
      var cur = ans(q).cur;
      var ul = el("ul", { class: "nthview-tl-opts" });
      q.items.forEach(function (it, k) {
        var text = it.event ? evById[it.event].e.title : it.text;
        var row = el("div", { class: "nthview-tl-opt" });
        if (it.event) row.appendChild(el("small", { text: label(it.event) }));
        if (done) {
          var ok = a.s !== "skip" && cur[k] === it.bin;
          if (a.s !== "skip") { row.classList.add(ok ? "nthview-tl-right" : "nthview-tl-wrong"); row.appendChild(el("span", { class: "nthview-tl-mark", text: ok ? "✓" : "✗" })); }
          row.appendChild(inline(text));
          row.appendChild(el("span", { class: "nthview-tl-why" }, [el("strong", { text: q.bins[it.bin] + (a.s !== "skip" && !ok ? " (you chose " + q.bins[cur[k]] + ")" : "") + (it.why ? ". " : "") }), it.why ? inline(it.why) : doc.createTextNode("")]));
        } else {
          row.appendChild(inline(text));
          var group = el("div", { class: "nthview-tl-bins", role: "group", "aria-label": "Group for " + String(text).replace(/\*\*|`/g, "") });
          q.bins.forEach(function (bn, b) {
            var btn = el("button", { type: "button", class: "nthview-tl-bin", "aria-pressed": String(cur[k] === b), "data-bin": k + ":" + b, text: bn });
            btn.addEventListener("click", function () { ans(q).cur[k] = b; persist(); streamOf(q).qn.draw("[data-bin=\"" + k + ":" + b + "\"]"); });
            group.appendChild(btn);
          });
          row.appendChild(group);
        }
        ul.appendChild(el("li", {}, [row]));
      });
      body.appendChild(ul);
      if (done) return;
      var all = Object.keys(cur).length === q.items.length;
      var check = el("button", { type: "button", class: "nthview-tl-btn", text: all ? "Check" : "Check (" + Object.keys(cur).length + " of " + q.items.length + " sorted)" });
      check.disabled = !all;
      check.addEventListener("click", function () {
        var ok = q.items.every(function (it, k) { return cur[k] === it.bin; });
        settle(q, ok ? "right" : "wrong");
      });
      acts.appendChild(check);
      body.parentNode.appendChild(acts);
    }
    function drawReflect(q, a, done, body, acts) {
      var id = "nthview-qt-" + q.id;
      body.appendChild(el("label", { for: id, class: "nthview-tl-why", text: done ? "Your notes" : "Jot down your answer (optional, saved in this browser), then compare." }));
      var ta = el("textarea", { id: id });
      ta.value = (state.ans[q.id] && state.ans[q.id].text) || "";
      ta.addEventListener("input", function () { ans(q).text = ta.value.slice(0, 4000); persist(); });
      body.appendChild(ta);
      if (done) return;
      var show = el("button", { type: "button", class: "nthview-tl-btn", text: "Show an answer" });
      show.addEventListener("click", function () { settle(q, "seen"); });
      acts.appendChild(show);
      body.parentNode.appendChild(acts);
    }

    // ---- visibility, gaps, links, progress ----------------------------------
    var currentId = null;
    function update() {
      var gated = false, hiddenEv = 0, hiddenQ = 0, lastVisible = null;
      var gateAfter = null;
      stream.forEach(function (s) {
        var vis = !gated;
        if (s.type === "event" || s.type === "gap") {
          var q = placeOf[s.ev.e.id];
          if (q && !settled(q)) vis = false;
          if (state.track && s.ev.e.track !== state.track) vis = false;
          if (gated && s.type === "event" && !(q && !settled(q))) hiddenEv++;
        }
        if (s.type === "question" && gated) hiddenQ++;
        if (s.type === "event") {
          s.ev.visible = vis;
          s.node.hidden = !vis;
          ticks[s.ev.e.id].classList.toggle("nthview-tl-off", !vis);
        } else if (s.type === "gap") {
          var txt = "";
          if (vis && lastVisible && showGaps) txt = gapText(lastVisible.t, s.ev.t);
          s.node.firstChild.textContent = txt;
          s.node.hidden = !vis || !txt;
          if (vis) lastVisible = s.ev;
        } else {
          s.node.hidden = !vis;
        }
        if (s.type === "question" && stepMode && !gated && !settled(s.q)) { gated = true; gateAfter = s; }
      });
      // reverse links only to events the learner can already see
      data.events.forEach(function (e) {
        var x = evById[e.id];
        x.effectsBox.innerHTML = "";
        var vis = x.effects.filter(function (f) { return evById[f.id].visible; });
        if (vis.length) x.effectsBox.appendChild(linkBlock("Led to", vis.map(function (f) { return { id: f.id, how: f.c.how, kind: f.c.kind }; })));
      });
      gate.hidden = !gateAfter;
      if (gateAfter) {
        list.insertBefore(gate, gateAfter.node.nextSibling);
        gate.firstChild.textContent = "🔒 Answer or skip the question above to continue" + (hiddenEv || hiddenQ ? ": " + [hiddenEv ? hiddenEv + " more event" + (hiddenEv === 1 ? "" : "s") : "", hiddenQ ? hiddenQ + " more question" + (hiddenQ === 1 ? "" : "s") : ""].filter(Boolean).join(" and ") + " ahead." : ".");
      }
      filterBtns.forEach(function (f) { f.b.setAttribute("aria-pressed", String(state.track === f.id)); });
      var answered = questions.filter(settled).length;
      countNode.textContent = questions.length ? answered + "/" + questions.length + " answered" : data.events.length + " events";
      drawEnd(!gateAfter);
      computeCurrent();
    }

    function drawEnd(reached) {
      endNode.innerHTML = "";
      endNode.hidden = !reached;
      if (!reached) return;
      var w = data.wrap || {};
      var hh = el("h2", { id: "nthview-tl-endh", text: w.heading || "What the timeline shows" });
      endNode.appendChild(hh);
      (w.text || ["You reached the end of the timeline. Scroll back up to revisit any event, or follow the cause links to trace how one thing led to another."]).forEach(function (t) { endNode.appendChild(para(t)); });
      if (w.takeaways) {
        endNode.appendChild(el("h3", { text: "Takeaways" }));
        endNode.appendChild(el("ul", {}, w.takeaways.map(function (t) { var li = el("li", {}); li.appendChild(inline(t)); return li; })));
      }
      if (questions.length) {
        var open = questions.filter(function (q) { return !settled(q); });
        var right = questions.filter(function (q) { return state.ans[q.id] && state.ans[q.id].s === "right"; }).length;
        var skipped = questions.filter(function (q) { return state.ans[q.id] && state.ans[q.id].s === "skip"; }).length;
        endNode.appendChild(el("h3", { text: "Your answers" }));
        endNode.appendChild(el("p", { class: "nthview-tl-score", text: open.length ? open.length + " question" + (open.length === 1 ? " is" : "s are") + " still open." :
          (gradable ? right + " of " + gradable + " right first time" + (skipped ? ", " + skipped + " skipped" : "") + "." : "All questions answered.") + " Every explanation stays open above." }));
        endNode.appendChild(el("ul", { class: "nthview-tl-review" }, questions.map(function (q) {
          var a = state.ans[q.id] || {};
          var mark = !a.s ? "○" : a.s === "right" ? "✓" : a.s === "wrong" ? "✗" : a.s === "seen" ? "✎" : "–";
          var b = el("button", { type: "button", class: "nthview-tl-jump" });
          b.appendChild(inline(promptOf(q)));
          b.addEventListener("click", function () { jumpTo(streamOf(q).node, ".nthview-tl-q"); });
          return el("li", {}, [el("span", { class: "nthview-tl-mark", text: mark, "aria-label": !a.s ? "open" : a.s }), b]);
        })));
      }
      if (refs.length) {
        endNode.appendChild(el("h3", { text: "Sources" }));
        endNode.appendChild(el("ol", { class: "nthview-tl-refs" }, refs.map(function (r) {
          var li = el("li", {}, [r.url ? el("a", { href: r.url, target: "_blank", rel: "noopener noreferrer", text: r.title }) : el("span", { text: r.title, style: "color:inherit" })]);
          if (r.publisher) li.appendChild(el("span", { text: " — " + r.publisher }));
          return li;
        })));
      }
      var top = el("button", { type: "button", class: "nthview-tl-ghost", text: "Back to the top" });
      top.addEventListener("click", function () { root.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" }); });
      var again = el("button", { type: "button", class: "nthview-tl-ghost", text: "Start again" });
      again.addEventListener("click", function () { clearState(key); NthView.build(container, data); root.scrollTo(0, 0); });
      endNode.appendChild(el("div", { class: "nthview-tl-acts" }, [top, again]));
    }
    function allSettled() { return questions.every(settled); }
    /* §5.5 rule 8: finished once the end card is on screen with every question settled */
    function markDone() {
      if (state.done || endNode.hidden || !allSettled()) return;
      state.done = true;
      persist();
    }

    function jumpTo(node, focusSel) {
      if (node.hidden && state.track) { state.track = null; persist(); update(); }
      if (node.hidden) return;
      node.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      var f = node.querySelector(focusSel || ".nthview-tl-card");
      if (f) { try { f.focus({ preventScroll: true }); } catch (e) { f.focus(); } }
      node.classList.remove("nthview-tl-flash");
      void node.offsetWidth;
      node.classList.add("nthview-tl-flash");
    }

    // "you are here": the last visible event above the reading line
    function computeCurrent() {
      var line = bar.getBoundingClientRect().bottom + root.innerHeight * 0.25, cur = null;
      for (var i = 0; i < data.events.length; i++) {
        var x = evById[data.events[i].id];
        if (!x.visible) continue;
        if (!cur) cur = x;
        if (x.node.getBoundingClientRect().top <= line) cur = x; else break;
      }
      if (!cur) return;
      miniMark.style.left = pos(toMs(cur.t)) + "%";
      nowNode.textContent = "Now: " + label(cur.e.id) + " · " + cur.e.title.replace(/\*\*|`/g, "");
      if (cur.e.id !== currentId) {
        currentId = cur.e.id;
        if (scrolled && state.at !== currentId) { state.at = currentId; persist(); }
      }
    }
    var scrolled = false, timer = null;
    function onScroll() {
      if (!container.contains(shell)) { root.removeEventListener("scroll", onScroll); return; }
      scrolled = true;
      if (timer) return;
      timer = setTimeout(function () { timer = null; computeCurrent(); if (endInView()) markDone(); }, 150);
    }
    function endInView() {
      if (endNode.hidden) return false;
      var r = endNode.getBoundingClientRect();
      return r.top < root.innerHeight - 40 && r.bottom > 0;
    }
    root.addEventListener("scroll", onScroll, { passive: true });
    if (typeof root.IntersectionObserver === "function") {
      var io = new root.IntersectionObserver(function (entries) {
        if (!container.contains(shell)) { io.disconnect(); return; }
        if (entries.some(function (en) { return en.isIntersecting; })) markDone();
      }, { threshold: 0.15 });
      io.observe(endNode);
    }

    update();
    if (endInView()) markDone();

    // ---- resume ------------------------------------------------------------
    var resumed = !!(saved.v && (Object.keys(state.ans).length || state.at));
    if (resumed) {
      var target = state.at && evById[state.at].visible ? evById[state.at] : null;
      if (target) setTimeout(function () { target.node.scrollIntoView({ block: "start" }); computeCurrent(); }, 0);
      var answered = questions.filter(settled).length;
      var where = target ? label(target.e.id) + " · " + target.e.title.replace(/\*\*|`/g, "") : "where you left off";
      var note = el("div", { class: "nthview-resume", role: "status", text: "Welcome back, continuing at " + where + (questions.length ? " (" + answered + " of " + questions.length + " answered)." : ".") });
      shell.appendChild(note);
      var gone = false;
      var hide = function () {
        if (gone) return; gone = true; note.style.opacity = "0";
        setTimeout(function () { if (note.parentNode) note.parentNode.removeChild(note); }, 600);
        doc.removeEventListener("pointerdown", hide); doc.removeEventListener("keydown", hide);
      };
      setTimeout(hide, 6000);
      doc.addEventListener("pointerdown", hide); doc.addEventListener("keydown", hide);
    }
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-timeline");
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
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=IBM+Plex+Sans:wght@400;600;700&display=swap",
      name: "Google Fonts" }
  ];
})(typeof globalThis !== "undefined" ? globalThis : window);
