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
    /* page: tokens, a 4px spacing scale, one accent, lane hues, success and error */
    "html:has(.nthview-timeline){background:#f7f6f3;scroll-padding-top:5rem}body:has(.nthview-timeline){margin:0}",
    "@media (prefers-color-scheme:dark){html:has(.nthview-timeline){background:#0f1116}}",
    ".nthview-timeline{--nv-bg:#f7f6f3;--nv-fg:#16181d;--nv-muted:#565d6a;--nv-accent:#3446c4;--nv-border:#dfdcd4;",
    "  --tl-surface:#fff;--tl-soft:#efede8;--tl-accent-soft:#eaedfb;--tl-on-accent:#fff;--tl-ok:#146c38;--tl-ok-bg:#e6f4ea;--tl-bad:#b3261e;--tl-bad-bg:#fcebe9;",
    "  --tl-t0:#b8460c;--tl-t1:#0e7268;--tl-t2:#7339df;--tl-tn:#565d6a;--tl-e0:#3446c4;--tl-e1:#8f6200;--tl-e2:#0b6f8a;--tl-e3:#9c1aa8;",
    "  --tl-shadow:0 1px 2px rgba(22,24,29,.06),0 4px 16px -8px rgba(22,24,29,.12);",
    "  --s1:.25rem;--s2:.5rem;--s3:.75rem;--s4:1rem;--s5:1.5rem;--s6:2rem;--s7:3rem;--r1:.5rem;--r2:.75rem;--r3:1rem;--tap:2.75rem;",
    "  --tl-sans:'IBM Plex Sans',system-ui,-apple-system,Segoe UI,Roboto,sans-serif;--tl-mono:'IBM Plex Mono',ui-monospace,SFMono-Regular,Menlo,monospace;",
    "  max-width:none;padding:0;font:1.0625rem/1.6 var(--tl-sans);min-height:100vh;-webkit-text-size-adjust:100%}",
    "@media (prefers-color-scheme:dark){.nthview-timeline{--nv-bg:#0f1116;--nv-fg:#e9eaef;--nv-muted:#a3a9b6;--nv-accent:#9aa8ff;--nv-border:#2b2f3a;",
    "  --tl-surface:#171a21;--tl-soft:#1f232c;--tl-accent-soft:#1d2242;--tl-on-accent:#0f1116;--tl-ok:#62d48d;--tl-ok-bg:#11261a;--tl-bad:#ff8f86;--tl-bad-bg:#2c1717;",
    "  --tl-t0:#ff9f5c;--tl-t1:#41d6c2;--tl-t2:#c8b8ff;--tl-tn:#a3a9b6;--tl-e0:#9aa8ff;--tl-e1:#f0c04f;--tl-e2:#6fdcf2;--tl-e3:#f2a7fb;",
    "  --tl-shadow:0 1px 2px rgba(0,0,0,.4),0 6px 20px -10px rgba(0,0,0,.6)}}",
    ".nthview-timeline>.nthview-error-panel{max-width:46rem;margin:1rem auto}",
    ".nthview-tl{max-width:64rem;margin:0 auto;padding:0 var(--s4) var(--s7)}",
    "@media (max-width:360px){.nthview-tl{padding-left:var(--s3);padding-right:var(--s3)}}",
    ".nthview-tl button,.nthview-tl input,.nthview-tl textarea{font:inherit;color:inherit}",
    ".nthview-tl button{cursor:pointer;-webkit-tap-highlight-color:transparent}",
    ".nthview-tl code{font-family:var(--tl-mono);font-size:.88em;background:var(--tl-soft);padding:0 .25em;border-radius:.25rem;overflow-wrap:anywhere}",
    ".nthview-tl p{margin:0 0 var(--s3)}.nthview-tl p:last-child{margin-bottom:0}",
    ".nthview-tl a{color:var(--nv-accent);text-underline-offset:2px}",
    ".nthview-tl-sr{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;margin:-1px;padding:0;border:0}",
    ".nthview-tl-ic{width:1.15em;height:1.15em;flex:none;vertical-align:-.2em}",
    /* buttons: one primary, one secondary, one quiet; every target at least 44px */
    ".nthview-tl-btn,.nthview-tl-sec,.nthview-tl-quiet{display:inline-flex;align-items:center;justify-content:center;gap:var(--s2);min-height:var(--tap);",
    "  padding:0 var(--s4);border-radius:var(--r1);font-weight:600!important;font-size:1rem!important;line-height:1.2;text-align:center;transition:background .15s,border-color .15s,transform .1s}",
    ".nthview-tl-btn{background:var(--nv-accent);color:var(--tl-on-accent)!important;border:1px solid var(--nv-accent)}",
    ".nthview-tl-btn:hover{filter:brightness(1.08)}.nthview-tl-btn:active,.nthview-tl-sec:active{transform:translateY(1px)}",
    ".nthview-tl-btn:disabled{background:var(--tl-soft);border-color:var(--nv-border);color:var(--nv-muted)!important;cursor:not-allowed;filter:none;transform:none}",
    ".nthview-tl-sec{background:var(--tl-surface);border:1px solid var(--nv-border)}",
    ".nthview-tl-sec:hover{border-color:var(--nv-accent)}",
    ".nthview-tl-quiet{background:none;border:1px solid transparent;color:var(--nv-accent)!important;padding:0 var(--s2)}",
    ".nthview-tl-quiet:hover{background:var(--tl-accent-soft)}",
    ".nthview-tl-acts{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s2) var(--s3);margin-top:var(--s4)}",
    "@media (max-width:559px){.nthview-tl-acts .nthview-tl-btn{flex:1 1 100%}}",
    /* sticky bar: one slim opaque row (where am I, how much is left, contents, restart) */
    ".nthview-tl-bar{position:sticky;top:0;z-index:20;margin:0 calc(var(--s4) * -1);padding:var(--s1) var(--s4) 0;background:var(--nv-bg);border-bottom:1px solid var(--nv-border)}",
    "@media (max-width:360px){.nthview-tl-bar{margin:0 calc(var(--s3) * -1);padding-left:var(--s3);padding-right:var(--s3)}}",
    "@media (max-height:480px){.nthview-tl-bar{position:relative}}",
    ".nthview-tl-barrow{display:flex;align-items:center;gap:var(--s2);min-width:0;min-height:3rem}",
    ".nthview-tl-menu{flex:none;padding:0 var(--s3)}",
    ".nthview-tl-where{flex:1;min-width:0;line-height:1.25}",
    ".nthview-tl-where b,.nthview-tl-where span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-tl-where b{font-size:.875rem;font-weight:600}",
    ".nthview-tl-where span{font:500 .8125rem var(--tl-mono);color:var(--nv-muted)}",
    ".nthview-tl-count{flex:none;font:600 .875rem var(--tl-sans);color:var(--nv-muted);white-space:nowrap}",
    ".nthview-restart{flex:none;min-height:var(--tap);padding:0 var(--s3);border:1px solid var(--nv-border);background:var(--tl-surface);border-radius:var(--r1);font-size:.9375rem!important;font-weight:600}",
    ".nthview-restart:hover{border-color:var(--nv-accent)}",
    "@media (max-width:420px){.nthview-tl-menu .nthview-tl-lbl,.nthview-tl-count .nthview-tl-lbl{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}}",
    ".nthview-tl-prog{height:4px;margin:var(--s1) calc(var(--s4) * -1) 0;background:var(--tl-soft);overflow:hidden}",
    ".nthview-tl-prog i{display:block;height:100%;width:0;background:var(--nv-accent);border-radius:0 2px 2px 0;transition:width .4s ease}",
    /* first screen */
    ".nthview-tl-hero{padding:var(--s6) 0 var(--s5);max-width:42rem}",
    ".nthview-tl-kicker{display:inline-flex;align-items:center;gap:var(--s2);font:600 .8125rem var(--tl-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--nv-accent);margin:0 0 var(--s3)!important}",
    ".nthview-tl-hero h1{font-size:clamp(1.85rem,6.4vw,2.9rem);line-height:1.1;margin:0 0 var(--s3);letter-spacing:-.015em;font-weight:700;text-wrap:balance}",
    ".nthview-tl-sub{font-size:1.1875rem;line-height:1.45;color:var(--nv-muted);margin:0 0 var(--s5)!important;text-wrap:pretty}",
    ".nthview-tl-facts{display:flex;flex-wrap:wrap;gap:var(--s2) var(--s4);list-style:none;margin:0 0 var(--s5);padding:0;font-size:.9375rem;color:var(--nv-muted)}",
    ".nthview-tl-facts li{display:inline-flex;align-items:center;gap:var(--s2)}",
    ".nthview-tl-facts b{color:var(--nv-fg);font-weight:600}",
    ".nthview-tl-start{display:flex;flex-wrap:wrap;gap:var(--s3);align-items:center;margin-bottom:var(--s6)}",
    ".nthview-tl-start .nthview-tl-btn{min-height:3rem;padding:0 var(--s5);font-size:1.0625rem!important;box-shadow:var(--tl-shadow)}",
    "@media (max-width:559px){.nthview-tl-start .nthview-tl-btn{flex:1 1 100%}}",
    ".nthview-tl-intro{max-width:65ch}",
    ".nthview-tl-lanes{display:flex;flex-wrap:wrap;gap:var(--s2) var(--s4);list-style:none;margin:var(--s4) 0 0;padding:0;font-size:.9375rem}",
    ".nthview-tl-lanes li{display:inline-flex;align-items:center;gap:var(--s2)}",
    ".nthview-tl-sw{width:.75rem;height:.75rem;border-radius:50%;background:var(--tc,var(--tl-tn));flex:none}",
    ".nthview-tl-how{margin-top:var(--s5);border:1px solid var(--nv-border);border-radius:var(--r2);background:var(--tl-surface)}",
    ".nthview-tl-how summary{display:flex;align-items:center;gap:var(--s2);min-height:var(--tap);padding:0 var(--s4);cursor:pointer;font-weight:600;list-style:none}",
    ".nthview-tl-how summary::-webkit-details-marker{display:none}",
    ".nthview-tl-how summary .nthview-tl-ic:last-child{margin-left:auto;transition:transform .2s}",
    ".nthview-tl-how[open] summary .nthview-tl-ic:last-child{transform:rotate(180deg)}",
    ".nthview-tl-how ul{margin:0;padding:0 var(--s4) var(--s4) 2.25rem;font-size:.9375rem;color:var(--nv-muted)}",
    ".nthview-tl-how li{margin:0 0 var(--s2)}.nthview-tl-how li b{color:var(--nv-fg)}",
    /* the line: phone puts the spine at the left edge; wide screens add a date gutter */
    ".nthview-timeline{--spine:1rem;--pad:2.75rem}",
    "@media (min-width:760px){.nthview-timeline{--spine:9.75rem;--pad:11.75rem}}",
    "@media (max-width:360px){.nthview-timeline{--spine:.75rem;--pad:2.25rem}.nthview-tl-qbody,.nthview-tl-card{padding-left:var(--s3)!important;padding-right:var(--s3)!important}.nthview-tl-opt{padding-left:var(--s3);padding-right:var(--s3)}}",
    ".nthview-tl-list{list-style:none;margin:0;padding:0;position:relative}",
    ".nthview-tl-list>li{position:relative;padding:0 0 var(--s4) var(--pad)}",
    ".nthview-tl-list>li::before{content:'';position:absolute;left:calc(var(--spine) - 1px);top:0;bottom:0;width:2px;background:var(--rail,var(--nv-border))}",
    ".nthview-tl-list>li.nthview-tl-inera::before{width:3px;left:calc(var(--spine) - 1.5px)}",
    ".nthview-tl-list>li[hidden]{display:none}",
    ".nthview-tl-list>li>*{max-width:44rem}",
    ".nthview-tl-in{animation:nthview-tl-in .45s ease both}",
    "@keyframes nthview-tl-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    ".nthview-tl-gapli{padding-bottom:var(--s3)!important}",
    ".nthview-tl-gap{display:inline-flex;align-items:center;gap:var(--s1);font:500 .8125rem var(--tl-mono);color:var(--nv-muted);margin:0!important;padding:.15rem .6rem;border:1px solid var(--nv-border);border-radius:999px;background:var(--nv-bg)}",
    "@media (min-width:760px){.nthview-tl-gapli{padding-left:0!important}.nthview-tl-gap{position:relative;left:var(--spine);transform:translateX(-50%)}}",
    ".nthview-tl-era{padding-top:var(--s5)!important;padding-bottom:var(--s5)!important}",
    ".nthview-tl-era>div{border-top:3px solid var(--ec);padding-top:var(--s3)}",
    ".nthview-tl-era small{display:block;font:600 .8125rem var(--tl-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--ec)}",
    ".nthview-tl-era h2{margin:var(--s1) 0 var(--s1);font-size:1.5rem;line-height:1.2;letter-spacing:-.01em}",
    ".nthview-tl-era .nthview-tl-range{font:500 .875rem var(--tl-mono);color:var(--nv-muted);margin:0 0 var(--s2)!important}",
    ".nthview-tl-era p{color:var(--nv-muted);max-width:60ch}",
    ".nthview-tl-era .nthview-tl-dot{border-radius:3px;background:var(--ec);border-color:var(--ec);top:calc(var(--s5) + 2px)}",
    ".nthview-tl-dot{position:absolute;left:calc(var(--spine) - 8px);top:1.35rem;width:16px;height:16px;border-radius:50%;background:var(--nv-bg);border:3px solid var(--tc,var(--tl-tn));z-index:1}",
    ".nthview-tl-tp .nthview-tl-dot{width:22px;height:22px;left:calc(var(--spine) - 11px);top:1.2rem;background:var(--tc,var(--tl-tn));box-shadow:0 0 0 4px var(--nv-bg)}",
    ".nthview-tl-when{display:none}",
    "@media (min-width:760px){",
    "  .nthview-tl-when{display:block;position:absolute;left:0;top:1.05rem;width:calc(var(--spine) - 1.5rem);text-align:right;font:600 .875rem/1.35 var(--tl-mono);color:var(--nv-fg)}",
    "  .nthview-tl-when span{display:block;font-weight:500;color:var(--nv-muted);font-size:.8125rem}",
    "  .nthview-tl-card .nthview-tl-date{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}",
    "}",
    /* event card */
    ".nthview-tl-card{position:relative;background:var(--tl-surface);border:1px solid var(--nv-border);border-radius:var(--r2);padding:var(--s4) var(--s4) var(--s4) calc(var(--s4) + 2px);box-shadow:var(--tl-shadow);overflow-wrap:break-word}",
    ".nthview-tl-card::before{content:'';position:absolute;left:-1px;top:var(--s3);bottom:var(--s3);width:4px;border-radius:0 4px 4px 0;background:var(--tc,var(--tl-tn))}",
    ".nthview-tl-card:focus{outline:none}.nthview-tl-card:focus-visible{outline:3px solid var(--nv-accent)}",
    ".nthview-tl-flash .nthview-tl-card,.nthview-tl-flash .nthview-tl-q{animation:nthview-tl-flash 1.6s}",
    "@keyframes nthview-tl-flash{0%,40%{box-shadow:0 0 0 4px var(--nv-accent)}100%{box-shadow:var(--tl-shadow)}}",
    ".nthview-tl-meta{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s1) var(--s2);margin-bottom:var(--s2)}",
    ".nthview-tl-date{font:600 .875rem var(--tl-mono);color:var(--nv-fg)}",
    ".nthview-tl-chip{display:inline-flex;align-items:center;gap:.35rem;font:600 .8125rem var(--tl-sans);color:var(--tc,var(--tl-tn))}",
    ".nthview-tl-chip::before{content:'';width:.5rem;height:.5rem;border-radius:50%;background:currentColor}",
    ".nthview-tl-tpchip{display:inline-flex;align-items:center;gap:.3rem;font:600 .75rem var(--tl-sans);letter-spacing:.04em;text-transform:uppercase;background:var(--nv-fg);color:var(--nv-bg);border-radius:999px;padding:.1rem .55rem}",
    ".nthview-tl-card h3{font-size:1.1875rem;line-height:1.3;margin:0 0 var(--s2);letter-spacing:-.005em;text-wrap:balance}",
    ".nthview-tl-card>p,.nthview-tl-detail p{max-width:65ch}",
    ".nthview-tl-more{margin-top:var(--s2);margin-left:calc(var(--s2) * -1)}",
    ".nthview-tl-more .nthview-tl-ic{transition:transform .2s}.nthview-tl-more[aria-expanded=true] .nthview-tl-ic{transform:rotate(180deg)}",
    ".nthview-tl-detail{border-left:3px solid var(--tl-soft);padding-left:var(--s3);margin-top:var(--s2);color:var(--nv-fg)}",
    ".nthview-tl-links{margin-top:var(--s4);padding-top:var(--s3);border-top:1px solid var(--nv-border)}",
    ".nthview-tl-links h4{margin:0 0 var(--s1);font:600 .8125rem var(--tl-sans);letter-spacing:.06em;text-transform:uppercase;color:var(--nv-muted)}",
    ".nthview-tl-links ul{list-style:none;margin:0 0 var(--s2);padding:0}",
    ".nthview-tl-link{display:flex;align-items:flex-start;gap:var(--s2);width:calc(100% + var(--s4));min-height:var(--tap);padding:var(--s2);margin:0 calc(var(--s2) * -1);border:0;background:none;border-radius:var(--r1);text-align:left;font-size:.9375rem!important;line-height:1.4}",
    ".nthview-tl-link:hover:not(:disabled){background:var(--tl-accent-soft)}",
    ".nthview-tl-link>.nthview-tl-ic{color:var(--nv-accent);margin-top:.1rem}",
    ".nthview-tl-link b{display:block;color:var(--nv-accent);font-weight:600}",
    ".nthview-tl-link span{display:block;color:var(--nv-muted)}",
    ".nthview-tl-ck{display:inline-block!important;font:600 .6875rem var(--tl-sans);letter-spacing:.05em;text-transform:uppercase;border:1px solid var(--nv-border);border-radius:.25rem;padding:0 .3rem;margin-right:.35rem;color:var(--nv-fg)!important;vertical-align:.08em}",
    ".nthview-tl-src{font-size:.875rem;color:var(--nv-muted);margin-top:var(--s3)!important}",
    /* questions: a checkpoint on the same line, select then check */
    ".nthview-tl-qli .nthview-tl-dot{top:1.25rem;width:26px;height:26px;left:calc(var(--spine) - 13px);background:var(--nv-accent);border-color:var(--nv-accent);color:var(--tl-on-accent);display:flex;align-items:center;justify-content:center;font:700 .8125rem var(--tl-sans)}",
    ".nthview-tl-qli.nthview-tl-done .nthview-tl-dot{background:var(--nv-bg);color:var(--nv-accent)}",
    ".nthview-tl-q{background:var(--tl-surface);border:1px solid var(--nv-border);border-radius:var(--r3);box-shadow:var(--tl-shadow);overflow:hidden}",
    ".nthview-tl-q:focus{outline:none}",
    ".nthview-tl-qhead{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s1) var(--s3);padding:var(--s3) var(--s4);background:var(--tl-accent-soft);color:var(--nv-accent);font:600 .8125rem var(--tl-sans);letter-spacing:.06em;text-transform:uppercase}",
    ".nthview-tl-qhead span:last-child{margin-left:auto;letter-spacing:0;text-transform:none;font-weight:500;color:var(--nv-muted)}",
    ".nthview-tl-qbody{padding:var(--s4)}",
    ".nthview-tl-qp{font-size:1.1875rem;line-height:1.35;font-weight:700;margin:0 0 var(--s4)!important;text-wrap:pretty}",
    ".nthview-tl-focus{border:1px dashed var(--nv-border);border-radius:var(--r2);padding:var(--s3) var(--s4);margin-bottom:var(--s4);background:var(--nv-bg)}",
    ".nthview-tl-focus small,.nthview-tl-opt small{display:block;font:500 .8125rem var(--tl-mono);color:var(--nv-muted)}",
    ".nthview-tl-focus>strong{display:block;font-size:1.0625rem}",
    ".nthview-tl-focus p{margin:var(--s1) 0 0!important;color:var(--nv-muted);font-size:.9375rem}",
    ".nthview-tl-opts{list-style:none;margin:0;padding:0;border:0;display:grid;gap:var(--s2);min-width:0}",
    ".nthview-tl-opts legend{padding:0}",
    ".nthview-tl-opt{position:relative;display:flex;align-items:flex-start;gap:var(--s3);width:100%;min-height:3rem;text-align:left;border:1px solid var(--nv-border);background:var(--nv-bg);border-radius:var(--r2);padding:var(--s3) var(--s4);line-height:1.45}",
    "label.nthview-tl-opt{cursor:pointer;transition:border-color .15s,background .15s}",
    "label.nthview-tl-opt:hover{border-color:var(--nv-accent)}",
    "label.nthview-tl-opt:has(input:checked){border-color:var(--nv-accent);background:var(--tl-accent-soft);box-shadow:inset 0 0 0 1px var(--nv-accent)}",
    "label.nthview-tl-opt:has(input:focus-visible){outline:3px solid var(--nv-accent);outline-offset:2px}",
    ".nthview-tl-opt input{position:absolute;opacity:0;width:1px;height:1px;margin:0}",
    ".nthview-tl-radio{flex:none;width:1.25rem;height:1.25rem;margin-top:.15rem;border:2px solid var(--nv-muted);border-radius:50%}",
    "label.nthview-tl-opt:has(input:checked) .nthview-tl-radio{border-color:var(--nv-accent);background:var(--nv-accent);box-shadow:inset 0 0 0 3px var(--tl-accent-soft)}",
    ".nthview-tl-optbody{flex:1;min-width:0}",
    ".nthview-tl-opt.nthview-tl-right{border-color:var(--tl-ok);background:var(--tl-ok-bg)}",
    ".nthview-tl-opt.nthview-tl-wrong{border-color:var(--tl-bad);background:var(--tl-bad-bg)}",
    ".nthview-tl-mark{flex:none;width:1.5rem;height:1.5rem;border-radius:50%;display:flex!important;align-items:center;justify-content:center;margin-top:.05rem;background:var(--tl-soft);color:var(--nv-muted)!important}",
    ".nthview-tl-right .nthview-tl-mark{background:var(--tl-ok);color:var(--tl-ok-bg)!important}.nthview-tl-wrong .nthview-tl-mark{background:var(--tl-bad);color:var(--tl-bad-bg)!important}",
    ".nthview-tl-mark .nthview-tl-ic{width:1rem;height:1rem;stroke-width:3}",
    ".nthview-tl-tag{display:block;font:600 .75rem var(--tl-sans);letter-spacing:.04em;text-transform:uppercase;color:var(--nv-muted)}",
    ".nthview-tl-right .nthview-tl-tag{color:var(--tl-ok)}.nthview-tl-wrong .nthview-tl-tag{color:var(--tl-bad)}",
    ".nthview-tl-why{display:block;font-size:.9375rem;color:var(--nv-muted);margin-top:var(--s1)}",
    ".nthview-tl-row{display:flex;align-items:center;gap:var(--s2)}",
    ".nthview-tl-row .nthview-tl-optbody{align-self:center}",
    ".nthview-tl-num{flex:none;width:1.75rem;height:1.75rem;border-radius:50%;background:var(--tl-soft);display:flex;align-items:center;justify-content:center;font:600 .875rem var(--tl-mono)}",
    ".nthview-tl-mv{flex:none;width:var(--tap);height:var(--tap);display:flex;align-items:center;justify-content:center;border:1px solid var(--nv-border);background:var(--tl-surface);border-radius:var(--r1)}",
    ".nthview-tl-mv:hover:not(:disabled){border-color:var(--nv-accent);color:var(--nv-accent)}",
    ".nthview-tl-mv:disabled{opacity:.3;cursor:not-allowed}",
    "@media (max-width:380px){.nthview-tl-row{flex-wrap:wrap}.nthview-tl-row .nthview-tl-optbody{flex:1 1 calc(100% - 2.5rem)}.nthview-tl-row .nthview-tl-mv:first-of-type{margin-left:auto}}",
    ".nthview-tl-nb{display:flex;flex-direction:column;padding:var(--s1) var(--s3);margin-left:var(--s3);border-left:3px solid var(--nv-border);font-size:.9375rem;line-height:1.4}",
    ".nthview-tl-nb small{flex:none;font:500 .8125rem var(--tl-mono);color:var(--nv-muted)}",
    "label.nthview-tl-slot{min-height:var(--tap);padding:var(--s2) var(--s4);border-style:dashed;color:var(--nv-accent);font-weight:600;font-size:.9375rem;align-items:center}",
    ".nthview-tl-sortitem{display:block}",
    ".nthview-tl-bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(5.5rem,1fr));gap:var(--s2);margin:var(--s3) 0 0;padding:0;border:0;min-width:0}",
    ".nthview-tl-bins .nthview-tl-bin{justify-content:center;padding:0 var(--s2);text-align:center}",
    ".nthview-tl-bin{position:relative;display:inline-flex;align-items:center;min-height:var(--tap);padding:0 var(--s4);border:1px solid var(--nv-border);border-radius:999px;background:var(--tl-surface);font-size:.9375rem;font-weight:600;cursor:pointer}",
    ".nthview-tl-bin:hover{border-color:var(--nv-accent)}",
    ".nthview-tl-bin input{position:absolute;opacity:0;width:1px;height:1px;margin:0}",
    ".nthview-tl-bin:has(input:checked){background:var(--nv-accent);border-color:var(--nv-accent);color:var(--tl-on-accent)}",
    ".nthview-tl-bin:has(input:focus-visible){outline:3px solid var(--nv-accent);outline-offset:2px}",
    ".nthview-tl-q textarea{display:block;width:100%;min-height:6.5rem;margin-top:var(--s2);background:var(--nv-bg);border:1px solid var(--nv-border);border-radius:var(--r2);padding:var(--s3);resize:vertical;line-height:1.5}",
    ".nthview-tl-q textarea:focus-visible{outline:3px solid var(--nv-accent);outline-offset:1px}",
    ".nthview-tl-label{display:block;font-size:.9375rem;color:var(--nv-muted)}",
    ".nthview-tl-hint{display:flex;gap:var(--s2);font-size:.9375rem;background:var(--tl-soft);border-radius:var(--r1);padding:var(--s3);margin-top:var(--s3)!important}",
    ".nthview-tl-fb{margin-top:var(--s4);border-radius:var(--r2);padding:var(--s4);background:var(--tl-soft);border:1px solid var(--nv-border)}",
    ".nthview-tl-fb:focus{outline:none}.nthview-tl-fb:focus-visible{outline:3px solid var(--nv-accent)}",
    ".nthview-tl-fb.nthview-tl-right{background:var(--tl-ok-bg);border-color:var(--tl-ok)}.nthview-tl-fb.nthview-tl-wrong{background:var(--tl-bad-bg);border-color:var(--tl-bad)}",
    ".nthview-tl-fb h4{display:flex;align-items:center;gap:var(--s2);margin:0 0 var(--s2);font-size:1.0625rem}",
    ".nthview-tl-fb.nthview-tl-right h4{color:var(--tl-ok)}.nthview-tl-fb.nthview-tl-wrong h4{color:var(--tl-bad)}",
    ".nthview-tl-fb .nthview-tl-mark{width:1.75rem;height:1.75rem;background:var(--nv-muted);color:var(--nv-bg)!important}",
    ".nthview-tl-fb.nthview-tl-right .nthview-tl-mark{background:var(--tl-ok);color:var(--tl-ok-bg)!important}.nthview-tl-fb.nthview-tl-wrong .nthview-tl-mark{background:var(--tl-bad);color:var(--tl-bad-bg)!important}",
    ".nthview-tl-fbin{animation:nthview-tl-in .35s ease both}",
    ".nthview-tl-score{font-weight:600;margin:0 0 var(--s3)!important}",
    /* locked stretch */
    ".nthview-tl-gate::before{background:repeating-linear-gradient(var(--nv-border) 0 6px,transparent 6px 12px)!important}",
    ".nthview-tl-gate>div{display:flex;gap:var(--s3);align-items:flex-start;border:1px dashed var(--nv-border);border-radius:var(--r2);padding:var(--s4);color:var(--nv-muted);background:var(--nv-bg)}",
    ".nthview-tl-gate>div>.nthview-tl-ic{width:1.5rem;height:1.5rem;margin-top:.1rem}",
    ".nthview-tl-gate b{display:block;color:var(--nv-fg)}",
    ".nthview-tl-gate .nthview-tl-acts{margin-top:var(--s2)}",
    /* end recap */
    ".nthview-tl-end{margin:var(--s5) 0 0 var(--pad);max-width:44rem;background:var(--tl-surface);border:1px solid var(--nv-border);border-radius:var(--r3);box-shadow:var(--tl-shadow);padding:var(--s5)}",
    "@media (max-width:759px){.nthview-tl-end{margin-left:0;padding:var(--s5) var(--s4)}}",
    ".nthview-tl-end:focus{outline:none}",
    ".nthview-tl-end>small{display:inline-flex;align-items:center;gap:var(--s2);font:600 .8125rem var(--tl-sans);letter-spacing:.08em;text-transform:uppercase;color:var(--tl-ok)}",
    ".nthview-tl-end h2{margin:var(--s2) 0 var(--s4);font-size:1.75rem;line-height:1.2;letter-spacing:-.01em}",
    ".nthview-tl-end h3{margin:var(--s5) 0 var(--s3);font-size:1.0625rem}",
    ".nthview-tl-end p{max-width:65ch}",
    ".nthview-tl-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(6.5rem,1fr));gap:var(--s2);margin:0 0 var(--s4);padding:0;list-style:none}",
    ".nthview-tl-stats li{background:var(--tl-soft);border-radius:var(--r2);padding:var(--s3)}",
    ".nthview-tl-stats b{display:block;font-size:1.5rem;line-height:1.1;font-variant-numeric:tabular-nums}",
    ".nthview-tl-stats span{font-size:.875rem;color:var(--nv-muted)}",
    ".nthview-tl-take{margin:0;padding:0;list-style:none;counter-reset:tk;display:grid;gap:var(--s2)}",
    ".nthview-tl-take li{counter-increment:tk;display:flex;gap:var(--s3);align-items:flex-start;background:var(--nv-bg);border-radius:var(--r2);padding:var(--s3)}",
    ".nthview-tl-take li::before{content:counter(tk);flex:none;width:1.75rem;height:1.75rem;border-radius:50%;background:var(--nv-accent);color:var(--tl-on-accent);display:flex;align-items:center;justify-content:center;font:700 .875rem var(--tl-sans)}",
    ".nthview-tl-review{list-style:none;margin:0;padding:0}",
    ".nthview-tl-review .nthview-tl-link{align-items:center}",
    ".nthview-tl-refs{margin:var(--s5) 0 0}",
    ".nthview-tl-refs summary{min-height:var(--tap);display:flex;align-items:center;gap:var(--s2);cursor:pointer;font-weight:600}",
    ".nthview-tl-refs ol{margin:var(--s2) 0 0;padding-left:1.4rem;font-size:.9375rem}",
    ".nthview-tl-refs li{margin:0 0 var(--s2)}.nthview-tl-refs li span{color:var(--nv-muted)}",
    /* contents sheet: bottom sheet on phones, side panel on wide screens */
    ".nthview-tl-sheet{border:0;padding:0;color:var(--nv-fg);background:var(--tl-surface);width:100%;max-width:100%;max-height:88vh;margin:auto 0 0;border-radius:var(--r3) var(--r3) 0 0;box-shadow:0 -10px 40px rgba(0,0,0,.25);overflow:auto;overscroll-behavior:contain}",
    ".nthview-tl-sheet::backdrop{background:rgba(10,12,16,.45)}",
    "@media (min-width:760px){.nthview-tl-sheet{width:min(26rem,100%);height:100%;max-height:100%;margin:0 0 0 auto;border-radius:0}}",
    ".nthview-tl-sheet[open]{animation:nthview-tl-in .25s ease both}",
    ".nthview-tl-sheethead{position:sticky;top:0;z-index:1;display:flex;align-items:center;justify-content:space-between;gap:var(--s3);padding:var(--s2) var(--s2) var(--s2) var(--s4);background:var(--tl-surface);border-bottom:1px solid var(--nv-border)}",
    ".nthview-tl-sheethead h2{margin:0;font-size:1.1875rem}",
    ".nthview-tl-sheetbody{padding:var(--s4)}",
    ".nthview-tl-sheetbody h3{margin:var(--s5) 0 var(--s2);font:600 .8125rem var(--tl-sans);letter-spacing:.07em;text-transform:uppercase;color:var(--nv-muted)}",
    ".nthview-tl-sheetbody h3:first-child{margin-top:0}",
    ".nthview-tl-x{width:var(--tap);padding:0}",
    ".nthview-tl-map{position:relative;height:2.25rem;margin:var(--s2) 0 var(--s1)}",
    ".nthview-tl-map::before{content:'';position:absolute;left:0;right:0;top:1rem;height:4px;border-radius:2px;background:var(--tl-soft)}",
    ".nthview-tl-map b{position:absolute;top:.85rem;height:10px;border-radius:5px;background:var(--ec);opacity:.3}",
    ".nthview-tl-map i{position:absolute;top:.55rem;width:2px;height:1.2rem;margin-left:-1px;border-radius:1px;background:var(--tc,var(--tl-tn))}",
    ".nthview-tl-map i.nthview-tl-off{opacity:.25}",
    ".nthview-tl-map em{position:absolute;top:.4rem;width:1.5rem;height:1.5rem;margin-left:-.75rem;border-radius:50%;background:var(--nv-accent);border:3px solid var(--tl-surface);box-shadow:0 0 0 1px var(--nv-accent)}",
    ".nthview-tl-mapends{display:flex;justify-content:space-between;font:500 .8125rem var(--tl-mono);color:var(--nv-muted)}",
    ".nthview-tl-cap{font-size:.875rem;color:var(--nv-muted);margin-top:var(--s2)!important}",
    ".nthview-tl-toc{list-style:none;margin:0;padding:0}",
    ".nthview-tl-toc .nthview-tl-tochead{font-weight:700;font-size:.9375rem;margin:var(--s3) 0 var(--s1);color:var(--ec)}",
    ".nthview-tl-toc .nthview-tl-link{margin:0;width:100%}",
    ".nthview-tl-toc .nthview-tl-link[aria-current]{background:var(--tl-accent-soft)}",
    ".nthview-tl-toc .nthview-tl-link:disabled{cursor:not-allowed}",
    ".nthview-tl-toc .nthview-tl-link:disabled>.nthview-tl-ic{color:var(--nv-muted)}",
    ".nthview-tl-toc .nthview-tl-link b{color:var(--nv-fg);font-weight:500}",
    ".nthview-tl-toc .nthview-tl-link:disabled b{color:var(--nv-muted)}",
    ".nthview-tl-filters{display:flex;flex-wrap:wrap;gap:var(--s2);border:0;margin:0;padding:0;min-width:0}",
    ".nthview-tl-resume{position:fixed;left:50%;bottom:max(var(--s4),env(safe-area-inset-bottom));transform:translateX(-50%);z-index:30;width:max-content;max-width:calc(100% - 2rem);background:var(--nv-fg);color:var(--nv-bg);",
    "  padding:var(--s3) var(--s4);border-radius:var(--r2);font-size:.9375rem;font-weight:600;box-shadow:0 8px 28px rgba(0,0,0,.3);transition:opacity .5s}",
    "@media (prefers-reduced-motion:reduce){.nthview-tl *,.nthview-tl-sheet{animation:none!important;transition:none!important}}"
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

  // ---- text, icons and dates ---------------------------------------------
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
  function plainText(text) { return String(text).replace(/\*\*|`/g, ""); }

  var ICONS = {
    clock: "M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    cal: "M8 3v3M16 3v3M4 9h16M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z",
    list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
    help: "M9.1 9a3 3 0 0 1 5.8 1c0 2-3 2.5-3 4.5M12 18h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
    close: "M6 6l12 12M18 6L6 18",
    check: "M5 12.5l4.5 4.5L19 7",
    cross: "M7 7l10 10M17 7L7 17",
    lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z",
    down: "M12 5v14M6 13l6 6 6-6",
    up: "M12 19V5M6 11l6-6 6 6",
    chev: "M6 9l6 6 6-6",
    back: "M19 12H5M11 6l-6 6 6 6",
    next: "M5 12h14M13 6l6 6-6 6",
    flag: "M5 21V4M5 4h11l-2 4 2 4H5",
    bulb: "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z",
    eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    pen: "M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4",
    dash: "M6 12h12"
  };
  function icon(name) {
    var NS = "http://www.w3.org/2000/svg";
    var s = root.document.createElementNS(NS, "svg");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    s.setAttribute("fill", "none"); s.setAttribute("stroke", "currentColor"); s.setAttribute("stroke-width", "2");
    s.setAttribute("stroke-linecap", "round"); s.setAttribute("stroke-linejoin", "round"); s.setAttribute("class", "nthview-tl-ic");
    var p = root.document.createElementNS(NS, "path");
    p.setAttribute("d", ICONS[name]);
    s.appendChild(p);
    return s;
  }
  /* a button with an icon and a text span; text() reaches the span */
  function button(cls, text, iconName, iconAfter) {
    var b = el("button", { type: "button", class: cls });
    var t = el("span", { text: text });
    if (iconName && !iconAfter) b.appendChild(icon(iconName));
    b.appendChild(t);
    if (iconName && iconAfter) b.appendChild(icon(iconName));
    b.label = t;
    return b;
  }

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
  function shortDate(t) {
    if (t.p === 1) return yearText(t.y);
    if (t.p === 2) return MONTHS[t.mo - 1].slice(0, 3) + " " + yearText(t.y);
    return t.d + " " + MONTHS[t.mo - 1].slice(0, 3) + " " + yearText(t.y);
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
    var eras = data.eras || [];
    var reduce = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var behavior = reduce ? "auto" : "smooth";

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
    var eraOf = {};
    eras.forEach(function (a, k) { for (var i = evById[a.from].i; i <= evById[a.to].i; i++) eraOf[i] = k; });
    function label(id) { var x = evById[id]; return x.e.label || (x.end ? fmtSpan(x.t, x.end, tz) : fmtDate(x.t, tz)); }
    function tcolor(e) { return e.track !== undefined ? "var(--tl-t" + trackIdx[e.track] + ")" : "var(--tl-tn)"; }
    function ecolor(k) { return "var(--tl-e" + (k % 4) + ")"; }

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
      return (q.ask === "effect" ? "What did \u201c" : "What led to \u201c") + plainText(evById[q.event].e.title) + (q.ask === "effect" ? "\u201d lead to?" : "\u201d?");
    }
    function settled(q) { var a = state.ans[q.id]; return !!(a && a.s); }

    // ---- page frame: sticky bar ------------------------------------------
    var shell = el("div", { class: "nthview-tl" });
    container.appendChild(shell);

    var menuBtn = button("nthview-tl-sec nthview-tl-menu", "Contents", "list");
    menuBtn.label.className = "nthview-tl-lbl";
    menuBtn.setAttribute("aria-haspopup", "dialog");
    menuBtn.setAttribute("aria-label", "Contents and progress");
    var whereTop = el("b", { text: data.title });
    var whereSub = el("span", { text: "" });
    var countNode = el("span", { class: "nthview-tl-count" });
    var progFill = el("i", {});
    var prog = el("div", { class: "nthview-tl-prog", role: "progressbar", "aria-valuemin": "0" }, [progFill]);
    var bar = el("header", { class: "nthview-tl-bar" }, [
      el("div", { class: "nthview-tl-barrow" }, [menuBtn, el("div", { class: "nthview-tl-where" }, [whereTop, whereSub]), countNode, restartButton(container, data, key)]),
      prog
    ]);
    shell.appendChild(bar);
    /* WCAG 2.4.11 (technique C43): keep focused and jumped-to items clear of the sticky bar */
    function syncPadding() {
      if (!container.contains(shell)) return;
      var sticky = root.getComputedStyle(bar).position === "sticky";
      doc.documentElement.style.scrollPaddingTop = sticky ? (bar.offsetHeight + 12) + "px" : "";
    }
    if (typeof root.ResizeObserver === "function") new root.ResizeObserver(syncPadding).observe(bar);
    root.addEventListener("resize", syncPadding);

    // ---- first screen: what this is, how long, one obvious action --------
    var first = evById[data.events[0].id], last = evById[data.events[data.events.length - 1].id];
    var range = shortDate(first.t) + " – " + shortDate(last.end || last.t);
    var minutes = Math.max(5, Math.round((data.events.length * 0.5 + questions.length * 1.2) / 5) * 5);
    var hero = el("section", { class: "nthview-tl-hero", "aria-labelledby": "nthview-tl-title" }, [
      el("p", { class: "nthview-tl-kicker" }, [icon("flag"), doc.createTextNode("Interactive timeline")]),
      el("h1", { id: "nthview-tl-title", text: data.title })
    ]);
    if (data.subtitle) hero.appendChild(para(data.subtitle, "nthview-tl-sub"));
    function fact(ic, strong, rest) { return el("li", {}, [icon(ic), el("span", {}, [el("b", { text: strong }), doc.createTextNode(rest)])]); }
    var facts = el("ul", { class: "nthview-tl-facts", "aria-label": "At a glance" }, [
      fact("clock", "About " + minutes + " min", ""),
      fact("cal", range, ""),
      fact("list", String(data.events.length), " events")
    ]);
    if (questions.length) facts.appendChild(fact("help", String(questions.length), " questions"));
    hero.appendChild(facts);
    var startBtn = button("nthview-tl-btn", "Start the timeline", "down", true);
    hero.appendChild(el("div", { class: "nthview-tl-start" }, [startBtn]));
    var intro = el("div", { class: "nthview-tl-intro" });
    (data.intro || []).forEach(function (t) { intro.appendChild(para(t)); });
    if (tracks.length) {
      intro.appendChild(el("ul", { class: "nthview-tl-lanes", "aria-label": "Colour key" }, tracks.map(function (t) {
        return el("li", {}, [el("span", { class: "nthview-tl-sw", style: "--tc:var(--tl-t" + trackIdx[t.id] + ")" }), el("span", { text: t.label })]);
      })));
    }
    hero.appendChild(intro);
    var how = el("details", { class: "nthview-tl-how" });
    how.appendChild(el("summary", {}, [icon("help"), el("span", { text: "How this timeline works" }), icon("chev")]));
    var howList = el("ul", {});
    function howItem(strong, rest) { howList.appendChild(el("li", {}, [el("b", { text: strong }), doc.createTextNode(" " + rest)])); }
    howItem("Read from top to bottom.", "Each card is one dated event; the pill between cards shows how much time passed.");
    if (questions.length) howItem(stepMode ? "Questions unlock the story." : "Questions sit between events.", (stepMode ? "Answer or skip each question to reveal what happens next." : "Answer them in any order.") + " Pick an answer, press Check, and read why, right or wrong.");
    if (data.events.some(function (e) { return e.causes; })) howItem("Follow the causes.", "\u201cWhy it happened\u201d and \u201cWhat it led to\u201d link events; select one to jump there." + (data.events.some(function (e) { return (e.causes || []).some(function (c) { return c.kind; }); }) ? " A trigger is the immediate spark; a condition is a longer-standing state that made it possible." : ""));
    tracks.forEach(function (t) { howItem(t.label + ":", t.text || "one lane of the story, in its own colour."); });
    howItem("Contents", "(top left) shows where you are and the whole span of time, lets you jump to any event you have reached, and can show one lane only.");
    howItem("Progress is saved", "in this browser. Restart erases it.");
    how.appendChild(howList);
    hero.appendChild(how);
    shell.appendChild(hero);

    // ---- the stream: eras, gaps, events and questions in order ------------
    var list = el("ol", { class: "nthview-tl-list", "aria-label": "Timeline" });
    shell.appendChild(list);
    var stream = [];
    var qAfter = {};
    questions.forEach(function (q) { (qAfter[q.after] = qAfter[q.after] || []).push(q); });
    var qNum = {}, qCount = 0;
    data.events.forEach(function (e, i) {
      var x = evById[e.id];
      var era = eraOf[i] !== undefined ? eraOf[i] : -1;
      if (era !== -1 && eras[era].from === e.id) {
        var a = eras[era], to = evById[a.to];
        var box = el("div", {}, [el("small", { text: "Part " + (era + 1) + " of " + eras.length }), el("h2", { text: a.label }),
          el("p", { class: "nthview-tl-range", text: shortDate(x.t) + " – " + shortDate(to.end || to.t) })]);
        if (a.text) box.appendChild(para(a.text));
        var head = el("li", { class: "nthview-tl-era", style: "--ec:" + ecolor(era) }, [el("span", { class: "nthview-tl-dot", "aria-hidden": "true" }), box]);
        list.appendChild(head);
        stream.push({ type: "era", node: head, era: era, ev: x });
      }
      var gapNode = el("li", { class: "nthview-tl-gapli", "aria-hidden": "true" }, [el("p", { class: "nthview-tl-gap" })]);
      list.appendChild(gapNode);
      stream.push({ type: "gap", node: gapNode, era: era, ev: x });
      x.node = eventNode(x);
      list.appendChild(x.node);
      stream.push({ type: "event", node: x.node, era: era, ev: x });
      (qAfter[e.id] || []).forEach(function (q) {
        qNum[q.id] = ++qCount;
        var s = { type: "question", era: era, q: q };
        s.node = el("li", { class: "nthview-tl-qli", id: "nthview-q-" + q.id }, [el("span", { class: "nthview-tl-dot", "aria-hidden": "true", text: String(qCount) })]);
        s.card = el("section", { class: "nthview-tl-q", tabindex: "-1", "aria-labelledby": "nthview-qh-" + q.id });
        s.node.appendChild(s.card);
        list.appendChild(s.node);
        stream.push(s);
      });
    });
    stream.forEach(function (s) {
      if (s.era !== -1) { s.node.classList.add("nthview-tl-inera"); s.node.style.setProperty("--rail", ecolor(s.era)); }
      if (s.type === "question") drawQuestion(s.q);
    });
    var gateNode = el("li", { class: "nthview-tl-gate" });
    list.appendChild(gateNode);
    var endNode = el("section", { class: "nthview-tl-end", tabindex: "-1", "aria-labelledby": "nthview-tl-endh" });
    shell.appendChild(endNode);

    function eventNode(x) {
      var e = x.e;
      var li = el("li", { class: "nthview-tl-ev" + (e.turningPoint ? " nthview-tl-tp" : ""), id: "nthview-ev-" + e.id, style: "--tc:" + tcolor(e) });
      var lab = label(e.id), comma = lab.indexOf(", ");
      var when = el("div", { class: "nthview-tl-when", "aria-hidden": "true" }, [doc.createTextNode(comma > 0 ? lab.slice(0, comma) : lab)]);
      if (comma > 0) when.appendChild(el("span", { text: lab.slice(comma + 2) }));
      li.appendChild(when);
      li.appendChild(el("span", { class: "nthview-tl-dot", "aria-hidden": "true" }));
      var card = el("article", { class: "nthview-tl-card", tabindex: "-1", "aria-labelledby": "nthview-evh-" + e.id });
      var meta = el("div", { class: "nthview-tl-meta" });
      var time = el("time", { class: "nthview-tl-date", text: lab });
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
        var more = button("nthview-tl-quiet nthview-tl-more", "Read more", "chev", true);
        more.insertBefore(el("span", { class: "nthview-tl-sr", text: " about " + plainText(e.title) }), more.lastChild);
        more.setAttribute("aria-controls", det.id);
        var sync = function () { var o = !!state.open[e.id]; det.hidden = !o; more.setAttribute("aria-expanded", String(o)); more.label.textContent = o ? "Show less" : "Read more"; };
        more.addEventListener("click", function () { if (state.open[e.id]) delete state.open[e.id]; else state.open[e.id] = true; sync(); persist(); });
        sync();
        card.appendChild(more);
        card.appendChild(det);
      }
      x.linksBox = el("div", {});
      card.appendChild(x.linksBox);
      if (e.refs) {
        var src = el("p", { class: "nthview-tl-src" }, [doc.createTextNode(e.refs.length > 1 ? "Sources: " : "Source: ")]);
        e.refs.forEach(function (r, k) {
          if (k) src.appendChild(doc.createTextNode(" · "));
          var ref = refs[r];
          src.appendChild(ref.url ? el("a", { href: ref.url, target: "_blank", rel: "noopener noreferrer" }, [doc.createTextNode(ref.title), el("span", { class: "nthview-tl-sr", text: " (opens in a new tab)" })]) : el("span", { text: ref.title }));
        });
        card.appendChild(src);
      }
      li.appendChild(card);
      return li;
    }
    function linkList(title, items, dir) {
      var box = el("div", { class: "nthview-tl-links" }, [el("h4", { text: title })]);
      box.appendChild(el("ul", {}, items.map(function (it) {
        var b = el("button", { type: "button", class: "nthview-tl-link" }, [icon(dir)]);
        var body = el("span", {});
        var head = el("b", {});
        if (it.kind) head.appendChild(el("span", { class: "nthview-tl-ck", text: CAUSE_LABEL[it.kind] }));
        head.appendChild(inline(evById[it.id].e.title));
        body.appendChild(head);
        var sub = el("span", { text: label(it.id) + (it.how ? " — " : "") });
        if (it.how) sub.appendChild(inline(it.how));
        body.appendChild(sub);
        b.appendChild(body);
        b.addEventListener("click", function () { jumpTo(evById[it.id].node); });
        return el("li", {}, [b]);
      })));
      return box;
    }

    // ---- questions: select, check, explained feedback, continue ----------
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
    function streamOf(q) { for (var i = 0; i < stream.length; i++) if (stream[i].q === q) return stream[i]; return null; }
    function settle(q, s, extra) {
      var a = ans(q);
      Object.keys(extra || {}).forEach(function (k) { a[k] = extra[k]; });
      a.s = s;
      persist();
      drawQuestion(q, ".nthview-tl-fb", true);
      update(true);
      if (endInView()) markDone();
    }

    function drawQuestion(q, focusSel, fresh) {
      var s = streamOf(q), card = s.card;
      card.innerHTML = "";
      var a = state.ans[q.id] || {};
      var done = !!a.s;
      s.node.classList.toggle("nthview-tl-done", done);
      card.appendChild(el("div", { class: "nthview-tl-qhead" }, [el("span", { text: KIND_LABEL[q.kind] }), el("span", { text: "Question " + qNum[q.id] + " of " + questions.length })]));
      var body = el("div", { class: "nthview-tl-qbody" });
      card.appendChild(body);
      var h = el("h3", { class: "nthview-tl-qp", id: "nthview-qh-" + q.id });
      h.appendChild(inline(promptOf(q)));
      body.appendChild(h);
      var acts = el("div", { class: "nthview-tl-acts" });
      ({ order: drawOrder, place: drawPlace, cause: drawPick, choice: drawPick, sort: drawSort, reflect: drawReflect })[q.kind](q, a, done, body, acts);
      if (!done) {
        if (q.kind !== "reflect") {
          var skip = button("nthview-tl-quiet", "Skip and show the answer");
          skip.addEventListener("click", function () { settle(q, "skip"); });
          acts.appendChild(skip);
        }
        body.appendChild(acts);
        if (q.hint) {
          var hint = el("p", { class: "nthview-tl-hint", id: "nthview-qhint-" + q.id }, [icon("bulb"), span(q.hint)]);
          hint.hidden = true;
          var hb = button("nthview-tl-quiet", "Show a hint", "bulb");
          hb.setAttribute("aria-expanded", "false");
          hb.setAttribute("aria-controls", hint.id);
          hb.addEventListener("click", function () { hint.hidden = !hint.hidden; hb.setAttribute("aria-expanded", String(!hint.hidden)); hb.label.textContent = hint.hidden ? "Show a hint" : "Hide the hint"; });
          acts.appendChild(hb);
          body.appendChild(hint);
        }
      } else {
        var tone = a.s === "right" ? " nthview-tl-right" : a.s === "wrong" ? " nthview-tl-wrong" : "";
        var fb = el("div", { class: "nthview-tl-fb" + tone + (fresh ? " nthview-tl-fbin" : ""), tabindex: "-1", role: "status" });
        var headText = a.s === "right" ? "Correct" : a.s === "wrong" ? "Not quite: here is why" : a.s === "seen" ? "Compare with this answer" : "Here is the answer";
        fb.appendChild(el("h4", {}, [el("span", { class: "nthview-tl-mark" }, [icon(a.s === "right" ? "check" : a.s === "wrong" ? "cross" : a.s === "seen" ? "pen" : "eye")]), doc.createTextNode(headText)]));
        fb.appendChild(para(q.explain));
        body.appendChild(fb);
        var after = el("div", { class: "nthview-tl-acts" });
        var cont = button("nthview-tl-btn", "Continue", "down", true);
        cont.setAttribute("data-next", q.id);
        cont.addEventListener("click", function () { goNext(q); });
        after.appendChild(cont);
        if (q.kind === "place") {
          var see = button("nthview-tl-sec", "See it on the timeline");
          see.addEventListener("click", function () { jumpTo(evById[q.event].node); });
          after.appendChild(see);
        }
        body.appendChild(after);
      }
      if (focusSel) { var f = card.querySelector(focusSel); if (f) { try { f.focus({ preventScroll: !fresh }); } catch (e) { f.focus(); } } }
    }
    function nextAfter(q) {
      var i = stream.indexOf(streamOf(q)) + 1;
      while (i < stream.length && (stream[i].node.hidden || stream[i].type === "gap")) i++;
      return i < stream.length ? stream[i] : null;
    }
    /* a Continue label must say where it goes */
    function syncContinue() {
      Array.prototype.forEach.call(list.querySelectorAll("[data-next]"), function (b) {
        var n = nextAfter(qById[b.getAttribute("data-next")]);
        b.label.textContent = !n ? (endNode.hidden ? "Continue" : "See the recap") : n.type === "question" ? "Next question" : "Continue the story";
      });
    }
    function goNext(q) {
      var n = nextAfter(q);
      if (!n) { if (!endNode.hidden) { endNode.scrollIntoView({ behavior: behavior, block: "start" }); focusQuiet(endNode); } return; }
      jumpTo(n.node, n.type === "question" ? ".nthview-tl-q" : ".nthview-tl-card", "start");
    }
    function focusQuiet(node) { try { node.focus({ preventScroll: true }); } catch (e) { node.focus(); } }

    function radio(name, checked, onPick) {
      var input = el("input", { type: "radio", name: name });
      input.checked = !!checked;
      input.addEventListener("change", function () { if (input.checked) onPick(); });
      return input;
    }
    function checkButton(text, enabled, onCheck) {
      var b = button("nthview-tl-btn", text, "check");
      b.disabled = !enabled;
      b.addEventListener("click", onCheck);
      return b;
    }
    function resultRow(cls, mark, tag, small, text, why) {
      var row = el("div", { class: "nthview-tl-opt" + cls }, [el("span", { class: "nthview-tl-mark" }, [icon(mark)])]);
      var b = el("span", { class: "nthview-tl-optbody" });
      if (tag) b.appendChild(el("span", { class: "nthview-tl-tag", text: tag }));
      if (small) b.appendChild(el("small", { text: small }));
      b.appendChild(inline(text));
      if (why) b.appendChild(span(why, "nthview-tl-why"));
      row.appendChild(b);
      return row;
    }

    function drawPick(q, a, done, body, acts) {
      var right = answerOf(q);
      if (q.kind === "cause") {
        body.appendChild(el("div", { class: "nthview-tl-focus" }, [el("small", { text: label(q.event) }), el("strong", {}, [inline(evById[q.event].e.title)])]));
      }
      if (done) {
        var ul = el("ul", { class: "nthview-tl-opts", "aria-label": "Answers explained" });
        q.options.forEach(function (o, k) {
          var isRight = k === right, mine = k === a.pick && a.s !== "skip";
          var tag = isRight && mine ? "Your answer · correct" : isRight ? "Correct answer" : mine ? "Your answer" : "";
          ul.appendChild(el("li", {}, [resultRow(isRight ? " nthview-tl-right" : mine ? " nthview-tl-wrong" : "", isRight ? "check" : mine ? "cross" : "dash", tag,
            q.kind === "cause" ? label(o.event) : "", q.kind === "cause" ? evById[o.event].e.title : o.text, o.why)]));
        });
        body.appendChild(ul);
        return;
      }
      var check = checkButton("Check", a.pick >= 0, function () { var p = ans(q).pick; settle(q, p === right ? "right" : "wrong", { pick: p }); });
      var fs = el("fieldset", { class: "nthview-tl-opts" }, [el("legend", { class: "nthview-tl-sr", text: plainText(promptOf(q)) })]);
      q.options.forEach(function (o, k) {
        var input = radio("nthview-r-" + q.id, a.pick === k, function () { ans(q).pick = k; persist(); check.disabled = false; });
        var b = el("span", { class: "nthview-tl-optbody" });
        if (q.kind === "cause") b.appendChild(el("small", { text: label(o.event) }));
        b.appendChild(inline(q.kind === "cause" ? evById[o.event].e.title : o.text));
        fs.appendChild(el("label", { class: "nthview-tl-opt" }, [input, el("span", { class: "nthview-tl-radio", "aria-hidden": "true" }), b]));
      });
      body.appendChild(fs);
      acts.appendChild(check);
    }
    function drawOrder(q, a, done, body, acts) {
      if (done) {
        var mine = a.first || a.cur;
        var right = correctOrder(q);
        if (a.s !== "skip") {
          var n = right.filter(function (id, k) { return mine[k] === id; }).length;
          body.appendChild(el("p", { class: "nthview-tl-score", text: n + " of " + right.length + " in the right place. Here is the real order, with dates:" }));
        }
        var ol = el("ol", { class: "nthview-tl-opts", "aria-label": "Correct order" });
        right.forEach(function (id, k) {
          var ok = a.s !== "skip" && mine[k] === id;
          var tag = a.s === "skip" ? "" : ok ? "Right place" : "You put it " + ordinal(mine.indexOf(id) + 1);
          ol.appendChild(el("li", {}, [resultRow(a.s === "skip" ? "" : ok ? " nthview-tl-right" : " nthview-tl-wrong", a.s === "skip" ? "dash" : ok ? "check" : "cross", tag,
            (k + 1) + ". " + label(id), evById[id].e.title, "")]));
        });
        body.appendChild(ol);
        return;
      }
      var cur = ans(q).cur;
      body.appendChild(el("p", { class: "nthview-tl-label", text: "Use the arrow buttons to move each event up or down, earliest at the top." }));
      var ol2 = el("ol", { class: "nthview-tl-opts", "aria-label": "Your order" });
      cur.forEach(function (id, k) {
        var title = plainText(evById[id].e.title);
        var up = el("button", { type: "button", class: "nthview-tl-mv", "aria-label": "Move \u201c" + title + "\u201d up", "data-mv": id + ":up" }, [icon("up")]);
        var dn = el("button", { type: "button", class: "nthview-tl-mv", "aria-label": "Move \u201c" + title + "\u201d down", "data-mv": id + ":dn" }, [icon("down")]);
        up.disabled = k === 0;
        dn.disabled = k === cur.length - 1;
        function move(d) {
          var c = ans(q).cur, i = c.indexOf(id), j = i + d;
          if (j < 0 || j >= c.length) return;
          c[i] = c[j]; c[j] = id;
          persist();
          var sel = "[data-mv=\"" + id + ":" + (d < 0 ? "up" : "dn") + "\"]";
          drawQuestion(q, sel);
          var f = streamOf(q).card.querySelector(sel);
          if (f && f.disabled) { var other = streamOf(q).card.querySelector("[data-mv=\"" + id + ":" + (d < 0 ? "dn" : "up") + "\"]"); if (other) other.focus(); }
        }
        up.addEventListener("click", function () { move(-1); });
        dn.addEventListener("click", function () { move(1); });
        var t = el("span", { class: "nthview-tl-optbody" });
        t.appendChild(inline(evById[id].e.title));
        ol2.appendChild(el("li", {}, [el("div", { class: "nthview-tl-opt nthview-tl-row" }, [el("span", { class: "nthview-tl-num", "aria-hidden": "true", text: String(k + 1) }), t, up, dn])]));
      });
      body.appendChild(ol2);
      acts.appendChild(checkButton("Check my order", true, function () {
        var c = ans(q).cur;
        settle(q, c.join("|") === correctOrder(q).join("|") ? "right" : "wrong", { first: c.slice() });
      }));
    }
    function ordinal(n) { return n + (n % 10 === 1 && n % 100 !== 11 ? "st" : n % 10 === 2 && n % 100 !== 12 ? "nd" : n % 10 === 3 && n % 100 !== 13 ? "rd" : "th"); }
    function plainQ(id) { return "\u201c" + plainText(evById[id].e.title) + "\u201d"; }
    function drawPlace(q, a, done, body, acts) {
      var target = evById[q.event];
      var among = q.among.slice().sort(function (p, r) { return evById[p].i - evById[r].i; });
      var right = answerOf(q);
      if (!done) body.appendChild(el("div", { class: "nthview-tl-focus" }, [el("small", { text: "Date hidden" }), el("strong", {}, [inline(target.e.title)]), para(target.e.text)]));
      var box = done ? el("ul", { class: "nthview-tl-opts", "aria-label": "Where it belongs" }) : el("fieldset", { class: "nthview-tl-opts" }, [el("legend", { class: "nthview-tl-sr", text: "Choose where it goes" })]);
      var check = checkButton("Check", a.pick >= 0, function () { var p = ans(q).pick; settle(q, p === right ? "right" : "wrong", { pick: p }); });
      function slot(g) {
        var text = g === 0 ? "Before " + plainQ(among[0]) : g === among.length ? "After " + plainQ(among[among.length - 1]) : "Between " + plainQ(among[g - 1]) + " and " + plainQ(among[g]);
        if (!done) {
          var input = radio("nthview-r-" + q.id, a.pick === g, function () { ans(q).pick = g; persist(); check.disabled = false; });
          box.appendChild(el("label", { class: "nthview-tl-opt nthview-tl-slot" }, [input, el("span", { class: "nthview-tl-radio", "aria-hidden": "true" }),
            el("span", { class: "nthview-tl-optbody", "aria-hidden": "true", text: "Put it here" }), el("span", { class: "nthview-tl-sr", text: text })]));
        } else if (g === right) {
          box.appendChild(el("li", {}, [resultRow(" nthview-tl-right", "check", a.pick === g ? "Your answer · correct" : "Correct place", label(q.event), target.e.title, "")]));
        } else if (g === a.pick && a.s !== "skip") {
          box.appendChild(el("li", {}, [resultRow(" nthview-tl-wrong", "cross", "Your answer", "", "You put it here.", "")]));
        }
      }
      among.forEach(function (id, k) {
        slot(k);
        var nb = el(done ? "li" : "div", { class: "nthview-tl-nb" }, [el("small", { text: label(id) })]);
        if (!done) nb.setAttribute("aria-hidden", "true");
        nb.appendChild(span(evById[id].e.title));
        box.appendChild(nb);
      });
      slot(among.length);
      body.appendChild(box);
      if (!done) acts.appendChild(check);
    }
    function drawSort(q, a, done, body, acts) {
      var cur = ans(q).cur;
      var ul = el("ul", { class: "nthview-tl-opts" });
      var check = checkButton("Check", false, function () {
        var ok = q.items.every(function (it, k) { return cur[k] === it.bin; });
        settle(q, ok ? "right" : "wrong");
      });
      function syncCheck() {
        var n = Object.keys(cur).length;
        check.disabled = n !== q.items.length;
        check.label.textContent = n === q.items.length ? "Check" : "Check (" + n + " of " + q.items.length + " sorted)";
      }
      q.items.forEach(function (it, k) {
        var text = it.event ? evById[it.event].e.title : it.text;
        if (done) {
          var ok = a.s !== "skip" && cur[k] === it.bin;
          var tag = q.bins[it.bin] + (a.s !== "skip" && !ok && cur[k] !== undefined ? " · you chose " + q.bins[cur[k]] : "");
          ul.appendChild(el("li", {}, [resultRow(a.s === "skip" ? "" : ok ? " nthview-tl-right" : " nthview-tl-wrong", a.s === "skip" ? "dash" : ok ? "check" : "cross", tag,
            it.event ? label(it.event) : "", text, it.why)]));
          return;
        }
        var row = el("div", { class: "nthview-tl-opt nthview-tl-sortitem" });
        var b = el("span", { class: "nthview-tl-optbody" });
        if (it.event) b.appendChild(el("small", { text: label(it.event) }));
        b.appendChild(inline(text));
        row.appendChild(b);
        var group = el("fieldset", { class: "nthview-tl-bins" }, [el("legend", { class: "nthview-tl-sr", text: "Group for " + plainText(text) })]);
        q.bins.forEach(function (bn, bi) {
          var input = radio("nthview-r-" + q.id + "-" + k, cur[k] === bi, function () { cur[k] = bi; persist(); syncCheck(); });
          group.appendChild(el("label", { class: "nthview-tl-bin" }, [input, el("span", { text: bn })]));
        });
        row.appendChild(group);
        ul.appendChild(el("li", {}, [row]));
      });
      body.appendChild(ul);
      if (done) return;
      syncCheck();
      acts.appendChild(check);
    }
    function drawReflect(q, a, done, body, acts) {
      var id = "nthview-qt-" + q.id;
      body.appendChild(el("label", { for: id, class: "nthview-tl-label", text: done ? "Your notes (saved in this browser)" : "Think it through, or jot down your answer (optional, saved in this browser). Then compare." }));
      var ta = el("textarea", { id: id });
      ta.value = (state.ans[q.id] && state.ans[q.id].text) || "";
      ta.addEventListener("input", function () { ans(q).text = ta.value.slice(0, 4000); persist(); });
      body.appendChild(ta);
      if (done) return;
      var show = button("nthview-tl-btn", "Reveal an answer", "eye");
      show.addEventListener("click", function () { settle(q, "seen"); });
      acts.appendChild(show);
    }

    // ---- visibility, gaps, links, progress ----------------------------------
    var currentId = null, gateQ = null;
    function update(animate) {
      var gated = false, hiddenEv = 0, hiddenQ = 0, lastVisible = null;
      gateQ = null;
      stream.forEach(function (s) {
        var vis = !gated;
        if (s.type === "event" || s.type === "gap") {
          var q = placeOf[s.ev.e.id];
          var pending = q && !settled(q);
          if (pending) vis = false;
          if (state.track && s.ev.e.track !== state.track) vis = false;
          if (gated && s.type === "event" && !pending) hiddenEv++;
        }
        if (s.type === "question" && gated) hiddenQ++;
        var was = !s.node.hidden;
        if (s.type === "event") s.ev.visible = vis;
        if (s.type === "gap") {
          var txt = "";
          if (vis && lastVisible && showGaps) txt = gapText(lastVisible.t, s.ev.t);
          s.node.firstChild.textContent = txt;
          s.node.hidden = !vis || !txt;
          if (vis) lastVisible = s.ev;
        } else {
          s.node.hidden = !vis;
        }
        if (animate && !reduce && !was && !s.node.hidden) { s.node.classList.remove("nthview-tl-in"); void s.node.offsetWidth; s.node.classList.add("nthview-tl-in"); }
        if (s.type === "question" && stepMode && !gated && !settled(s.q)) { gated = true; gateQ = s; }
      });
      data.events.forEach(function (e) {
        var x = evById[e.id];
        x.linksBox.innerHTML = "";
        if (e.causes) x.linksBox.appendChild(linkList("Why it happened", e.causes.map(function (c) { return { id: c.event, how: c.how, kind: c.kind }; }), "back"));
        var vis = x.effects.filter(function (f) { return evById[f.id].visible; });
        if (vis.length) x.linksBox.appendChild(linkList("What it led to", vis.map(function (f) { return { id: f.id, how: f.c.how, kind: f.c.kind }; }), "next"));
      });
      gateNode.hidden = !gateQ;
      if (gateQ) {
        list.insertBefore(gateNode, gateQ.node.nextSibling);
        gateNode.innerHTML = "";
        var ahead = [hiddenEv ? hiddenEv + " more event" + (hiddenEv === 1 ? "" : "s") : "", hiddenQ ? hiddenQ + " more question" + (hiddenQ === 1 ? "" : "s") : ""].filter(Boolean).join(" and ");
        var toQ = button("nthview-tl-sec", "Go to question " + qNum[gateQ.q.id], "up");
        var gq = gateQ;
        toQ.addEventListener("click", function () { jumpTo(gq.node, ".nthview-tl-q", "start"); });
        gateNode.appendChild(el("div", {}, [icon("lock"), el("div", {}, [el("b", { text: "The rest of the story is locked" + (ahead ? ": " + ahead + " ahead" : "") }),
          el("span", { text: "Answer or skip question " + qNum[gq.q.id] + " to unlock it." }), el("div", { class: "nthview-tl-acts" }, [toQ])])]));
      }
      var answered = questions.filter(settled).length;
      if (questions.length) {
        countNode.innerHTML = "";
        countNode.appendChild(doc.createTextNode(answered + "/" + questions.length));
        countNode.appendChild(el("span", { class: "nthview-tl-lbl", text: " answered" }));
        prog.setAttribute("aria-label", "Questions answered");
        prog.setAttribute("aria-valuemax", String(questions.length));
        prog.setAttribute("aria-valuenow", String(answered));
        progFill.style.width = (answered / questions.length * 100) + "%";
      } else {
        prog.setAttribute("aria-label", "Events read");
        prog.setAttribute("aria-valuemax", String(data.events.length));
      }
      startBtn.label.textContent = state.at || answered ? "Continue where you left off" : "Start the timeline";
      drawEnd(!gateQ);
      syncContinue();
      computeCurrent();
    }

    function drawEnd(reached) {
      endNode.innerHTML = "";
      endNode.hidden = !reached;
      if (!reached) return;
      var w = data.wrap || {};
      var open = questions.filter(function (q) { return !settled(q); });
      endNode.appendChild(el("small", {}, [icon("flag"), doc.createTextNode(open.length ? "End of the timeline" : "Timeline complete")]));
      endNode.appendChild(el("h2", { id: "nthview-tl-endh", text: w.heading || "What the timeline shows" }));
      var gradable = questions.filter(function (q) { return q.kind !== "reflect"; });
      var right = gradable.filter(function (q) { return state.ans[q.id] && state.ans[q.id].s === "right"; }).length;
      var stats = el("ul", { class: "nthview-tl-stats" }, [
        el("li", {}, [el("b", { text: String(data.events.length) }), el("span", { text: "events" })]),
        el("li", {}, [el("b", { text: spanText() }), el("span", { text: "of history" })])
      ]);
      if (questions.length) {
        stats.appendChild(el("li", {}, [el("b", { text: (questions.length - open.length) + "/" + questions.length }), el("span", { text: "questions answered" })]));
        if (gradable.length) stats.appendChild(el("li", {}, [el("b", { text: right + "/" + gradable.length }), el("span", { text: "right first time" })]));
      }
      endNode.appendChild(stats);
      (w.text || ["You reached the end of the timeline. Scroll back up to revisit any event, or follow the cause links to trace how one thing led to another."]).forEach(function (t) { endNode.appendChild(para(t)); });
      if (w.takeaways) {
        endNode.appendChild(el("h3", { text: "Remember" }));
        endNode.appendChild(el("ol", { class: "nthview-tl-take" }, w.takeaways.map(function (t) { return el("li", {}, [span(t)]); })));
      }
      var tps = data.events.filter(function (e) { return e.turningPoint; });
      if (tps.length) {
        endNode.appendChild(el("h3", { text: "The turning points" }));
        endNode.appendChild(el("ul", { class: "nthview-tl-review" }, tps.map(function (e) {
          var b = el("button", { type: "button", class: "nthview-tl-link" }, [icon("flag"), el("span", {}, [el("b", {}, [inline(e.title)]), el("span", { text: label(e.id) })])]);
          b.addEventListener("click", function () { jumpTo(evById[e.id].node); });
          return el("li", {}, [b]);
        })));
      }
      if (questions.length) {
        endNode.appendChild(el("h3", { text: open.length ? open.length + " question" + (open.length === 1 ? " is" : "s are") + " still open" : "Review your answers" }));
        endNode.appendChild(el("ul", { class: "nthview-tl-review" }, questions.slice().sort(function (p, r) { return qNum[p.id] - qNum[r.id]; }).map(function (q) {
          var a = state.ans[q.id] || {};
          var st = !a.s ? ["dash", "Open", ""] : a.s === "right" ? ["check", "Right", " nthview-tl-right"] : a.s === "wrong" ? ["cross", "Not quite: read the explanation again", " nthview-tl-wrong"] : a.s === "seen" ? ["pen", "Reflected", ""] : ["eye", "Skipped", ""];
          var b = el("button", { type: "button", class: "nthview-tl-link" + st[2] }, [el("span", { class: "nthview-tl-mark" }, [icon(st[0])]),
            el("span", {}, [el("b", {}, [doc.createTextNode(qNum[q.id] + ". "), inline(promptOf(q))]), el("span", { text: st[1] })])]);
          b.addEventListener("click", function () { jumpTo(streamOf(q).node, ".nthview-tl-q", "start"); });
          return el("li", {}, [b]);
        })));
      }
      if (refs.length) {
        var det = el("details", { class: "nthview-tl-refs" }, [el("summary", {}, [icon("list"), doc.createTextNode("Sources (" + refs.length + ")")])]);
        det.appendChild(el("ol", {}, refs.map(function (r) {
          var li = el("li", {}, [r.url ? el("a", { href: r.url, target: "_blank", rel: "noopener noreferrer" }, [doc.createTextNode(r.title), el("span", { class: "nthview-tl-sr", text: " (opens in a new tab)" })]) : el("span", { text: r.title, style: "color:inherit" })]);
          if (r.publisher) li.appendChild(el("span", { text: " — " + r.publisher }));
          return li;
        })));
        endNode.appendChild(det);
      }
      var top = button("nthview-tl-sec", "Back to the top", "up");
      top.addEventListener("click", function () { root.scrollTo({ top: 0, behavior: behavior }); focusQuiet(startBtn); });
      var again = button("nthview-tl-quiet", "Start again");
      again.addEventListener("click", function () { clearState(key); NthView.build(container, data); root.scrollTo(0, 0); });
      endNode.appendChild(el("div", { class: "nthview-tl-acts" }, [top, again]));
    }
    function spanText() {
      var a = first.t, b = last.end || last.t;
      var days = Math.round((toMs(b, 3) - toMs(a, 3)) / 86400000);
      if (days >= 730) return Math.round(days / 365.25) + " years";
      if (days >= 61) return Math.round(days / 30.44) + " months";
      if (days >= 14) return Math.round(days / 7) + " weeks";
      return Math.max(days, 1) + " day" + (days > 1 ? "s" : "");
    }
    function allSettled() { return questions.every(settled); }
    /* §5.5 rule 8: finished once the end card is on screen with every question settled */
    function markDone() {
      if (state.done || endNode.hidden || !allSettled()) return;
      state.done = true;
      persist();
    }

    function jumpTo(node, focusSel, block) {
      if (node.hidden && state.track) { state.track = null; persist(); update(); }
      if (node.hidden) return;
      node.scrollIntoView({ behavior: behavior, block: block || "center" });
      var f = node.querySelector(focusSel || ".nthview-tl-card");
      /* an era header has nothing to focus: move focus to the first card after it */
      if (!f && node.classList.contains("nthview-tl-era")) {
        for (var n = node.nextElementSibling; n && !f; n = n.nextElementSibling) if (!n.hidden) f = n.querySelector(".nthview-tl-card,.nthview-tl-q");
      }
      if (f) focusQuiet(f);
      node.classList.remove("nthview-tl-flash");
      void node.offsetWidth;
      node.classList.add("nthview-tl-flash");
    }
    startBtn.addEventListener("click", function () {
      var target = null;
      if (state.at && evById[state.at].visible) target = evById[state.at].node;
      if (gateQ && (questions.filter(settled).length || state.at)) target = gateQ.node;
      if (!target) for (var i = 0; i < stream.length; i++) if (!stream[i].node.hidden && stream[i].type !== "gap") { target = stream[i].node; break; }
      if (target) jumpTo(target, target.classList.contains("nthview-tl-qli") ? ".nthview-tl-q" : ".nthview-tl-card", "start");
    });

    // ---- contents sheet ------------------------------------------------------
    var sheet = el("dialog", { class: "nthview-tl-sheet", "aria-labelledby": "nthview-tl-sheeth" });
    shell.appendChild(sheet);
    var t0 = toMs(first.t), t1 = t0;
    data.events.forEach(function (e) { var x = evById[e.id]; t1 = Math.max(t1, toMs(x.end || x.t)); });
    var span0 = t1 - t0 || 1;
    function pos(ms) { return Math.max(0, Math.min(100, (ms - t0) / span0 * 100)); }
    function closeSheet() { if (typeof sheet.close === "function" && sheet.open) sheet.close(); else sheet.removeAttribute("open"); menuBtn.focus(); }
    function eventIsGated(y) {
      if (!gateQ) return false;
      for (var i = 0; i < stream.length; i++) { if (stream[i] === gateQ) return true; if (stream[i].type === "event" && stream[i].ev === y) return false; }
      return false;
    }
    function openSheet() {
      sheet.innerHTML = "";
      var x = button("nthview-tl-quiet nthview-tl-x", "", "close");
      x.setAttribute("aria-label", "Close contents");
      x.addEventListener("click", closeSheet);
      sheet.appendChild(el("div", { class: "nthview-tl-sheethead" }, [el("h2", { id: "nthview-tl-sheeth", text: "Contents" }), x]));
      var b = el("div", { class: "nthview-tl-sheetbody" });
      sheet.appendChild(b);
      var answered = questions.filter(settled).length;
      var seen = data.events.filter(function (e) { return !eventIsGated(evById[e.id]) && !(placeOf[e.id] && !settled(placeOf[e.id])); }).length;
      b.appendChild(el("h3", { text: "Your progress" }));
      b.appendChild(el("p", { text: (questions.length ? answered + " of " + questions.length + " questions answered · " : "") + seen + " of " + data.events.length + " events unlocked" }));
      b.appendChild(el("h3", { text: "The whole span of time" }));
      var map = el("div", { class: "nthview-tl-map", "aria-hidden": "true" });
      eras.forEach(function (a, k) {
        var s = pos(toMs(evById[a.from].t)), y = evById[a.to], f = pos(toMs(y.end || y.t));
        map.appendChild(el("b", { style: "left:" + s + "%;width:" + Math.max(f - s, 1) + "%;--ec:" + ecolor(k) }));
      });
      data.events.forEach(function (e) {
        map.appendChild(el("i", { class: evById[e.id].visible ? "" : "nthview-tl-off", style: "left:" + pos(toMs(evById[e.id].t)) + "%;--tc:" + tcolor(e) }));
      });
      if (currentId) map.appendChild(el("em", { style: "left:" + pos(toMs(evById[currentId].t)) + "%" }));
      b.appendChild(map);
      b.appendChild(el("div", { class: "nthview-tl-mapends", "aria-hidden": "true" }, [el("span", { text: shortDate(first.t) }), el("span", { text: shortDate(last.end || last.t) })]));
      b.appendChild(el("p", { class: "nthview-tl-cap", text: "Each tick is an event placed by its real date" + (currentId ? "; the dot is where you are" : "") + ". Clusters show where things moved fast." }));
      if (tracks.length) {
        b.appendChild(el("h3", { id: "nthview-tl-showh", text: "Show" }));
        var fs = el("fieldset", { class: "nthview-tl-filters", "aria-labelledby": "nthview-tl-showh" });
        [{ id: null, label: "All events" }].concat(tracks).forEach(function (t) {
          var input = radio("nthview-tl-lane", state.track === t.id, function () { state.track = t.id; persist(); update(); });
          var lab = el("label", { class: "nthview-tl-bin" }, [input]);
          if (t.id !== null) lab.appendChild(el("span", { class: "nthview-tl-sw", style: "--tc:var(--tl-t" + trackIdx[t.id] + ");margin-right:.4rem" }));
          lab.appendChild(el("span", { text: t.label }));
          fs.appendChild(lab);
        });
        b.appendChild(fs);
      }
      b.appendChild(el("h3", { text: "Events" }));
      var toc = el("ul", { class: "nthview-tl-toc" });
      var lastEra = -2;
      data.events.forEach(function (e, i) {
        var era = eraOf[i] !== undefined ? eraOf[i] : -1;
        if (era !== lastEra && era !== -1) toc.appendChild(el("li", { class: "nthview-tl-tochead", style: "--ec:" + ecolor(era), text: "Part " + (era + 1) + " · " + eras[era].label }));
        lastEra = era;
        var y = evById[e.id];
        var pending = placeOf[e.id] && !settled(placeOf[e.id]);
        var locked = pending || eventIsGated(y);
        var row = el("button", { type: "button", class: "nthview-tl-link" }, [icon(locked ? "lock" : "next"),
          el("span", {}, [el("b", {}, [locked ? doc.createTextNode(pending ? "Hidden until you place it" : "Locked") : inline(e.title)]),
            el("span", { text: locked ? (pending ? "A question asks where it belongs" : "Answer the question before it to unlock") : label(e.id) })])]);
        if (locked) row.disabled = true;
        if (e.id === currentId) row.setAttribute("aria-current", "step");
        row.addEventListener("click", function () { closeSheet(); jumpTo(y.node); });
        toc.appendChild(el("li", {}, [row]));
      });
      b.appendChild(toc);
      if (typeof sheet.showModal === "function") sheet.showModal(); else sheet.setAttribute("open", "");
      var cur = sheet.querySelector("[aria-current]");
      if (cur) cur.scrollIntoView({ block: "center" });
      focusQuiet(x);
    }
    menuBtn.addEventListener("click", openSheet);
    sheet.addEventListener("click", function (ev) { if (ev.target === sheet) closeSheet(); });

    // "you are here": the last visible event above the reading line
    function computeCurrent() {
      var line = bar.getBoundingClientRect().bottom + root.innerHeight * 0.3, cur = null, n = 0, k = 0;
      for (var i = 0; i < data.events.length; i++) {
        var x = evById[data.events[i].id];
        if (!x.visible) continue;
        n++;
        if (!cur) { cur = x; k = n; }
        if (x.node.getBoundingClientRect().top <= line) { cur = x; k = n; }
      }
      var heroGone = hero.getBoundingClientRect().bottom < bar.getBoundingClientRect().bottom + 40;
      if (!cur || !heroGone) { whereTop.textContent = data.title; whereSub.textContent = range; return; }
      var era = eraOf[cur.i];
      whereTop.textContent = era !== undefined ? "Part " + (era + 1) + " of " + eras.length + " · " + eras[era].label : data.title;
      whereSub.textContent = label(cur.e.id) + " · event " + (cur.i + 1) + " of " + data.events.length;
      if (!questions.length) progFill.style.width = ((cur.i + 1) / data.events.length * 100) + "%", prog.setAttribute("aria-valuenow", String(cur.i + 1));
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
      timer = setTimeout(function () { timer = null; computeCurrent(); if (endInView()) markDone(); }, 120);
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
    syncPadding();
    if (endInView()) markDone();

    // ---- resume ------------------------------------------------------------
    var resumed = !!(saved.v && (Object.keys(state.ans).length || state.at));
    if (resumed) {
      var target = state.at && evById[state.at].visible ? evById[state.at] : null;
      if (target) setTimeout(function () { target.node.scrollIntoView({ block: "start" }); computeCurrent(); }, 0);
      var answered = questions.filter(settled).length;
      var tally = questions.length ? " (" + answered + " of " + questions.length + " answered)." : ".";
      var note = el("div", { class: "nthview-tl-resume nthview-resume", role: "status", text: target ? "Welcome back, continuing at " + label(target.e.id) + " · " + plainText(target.e.title) + tally : "Welcome back, your progress is restored" + tally });
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
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap",
      name: "Google Fonts" }
  ];
})(typeof globalThis !== "undefined" ? globalThis : window);
