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
    /* tokens: colour (control borders and state marks keep 3:1), a 4/8 spacing scale, a type scale, radii, motion */
    ".nthview-compare{--nv-bg:#f6f5f2;--nv-surface:#fff;--nv-sunken:#efede8;--nv-fg:#1b1a17;--nv-muted:#5b574f;--nv-border:#e0ddd5;--nv-control:#8a8477;--nv-accent:#3446c9;--nv-accent-soft:#e9ecfc;--nv-on-accent:#fff;--nv-ok:#12703a;--nv-ok-soft:#e2f2e7;--nv-bad:#b0370c;--nv-bad-soft:#fbeae2;",
    "  --nv-shadow:0 1px 2px rgba(20,18,14,.06),0 6px 20px -8px rgba(20,18,14,.12);--nv-shadow-lg:0 24px 60px -20px rgba(0,0,0,.35);",
    "  --s1:4px;--s2:8px;--s3:12px;--s4:16px;--s5:24px;--s6:32px;--s7:48px;",
    "  --t-xs:.8125rem;--t-sm:.9375rem;--t-md:1.0625rem;--t-lg:1.25rem;--t-xl:1.5rem;--t-2xl:clamp(1.6rem,1.1rem + 2.4vw,2.35rem);",
    "  --r1:8px;--r2:12px;--r3:16px;--ease:cubic-bezier(.2,0,0,1);--dur:200ms;--measure:68ch;",
    "  max-width:78rem;padding:0 var(--s4) var(--s7);min-height:100vh;font-size:var(--t-md);line-height:1.6;overflow-wrap:break-word;-webkit-text-size-adjust:100%}",
    "@media (prefers-color-scheme:dark){.nthview-compare{--nv-bg:#111214;--nv-surface:#1a1c20;--nv-sunken:#23252a;--nv-fg:#ecebe7;--nv-muted:#aaa69e;--nv-border:#2f3238;--nv-control:#71747c;--nv-accent:#a3afff;--nv-accent-soft:#252c52;--nv-on-accent:#11131c;--nv-ok:#63d394;--nv-ok-soft:#14291d;--nv-bad:#ff9d6b;--nv-bad-soft:#33211a;--nv-shadow:0 1px 0 rgba(255,255,255,.03);--nv-shadow-lg:0 24px 60px -16px rgba(0,0,0,.7)}}",
    ".nthview-compare .nthview-c-blue{--oc:#2453c2;--ocs:#e8eefc}.nthview-compare .nthview-c-teal{--oc:#0c7065;--ocs:#e1f3f0}.nthview-compare .nthview-c-amber{--oc:#965400;--ocs:#fbf0dc}",
    ".nthview-compare .nthview-c-rose{--oc:#b3163c;--ocs:#fce8ed}.nthview-compare .nthview-c-violet{--oc:#6a30c8;--ocs:#f0eafd}.nthview-compare .nthview-c-green{--oc:#16753a;--ocs:#e3f3e8}",
    "@media (prefers-color-scheme:dark){.nthview-compare .nthview-c-blue{--oc:#86adff;--ocs:#1a2540}.nthview-compare .nthview-c-teal{--oc:#5fd6c8;--ocs:#11302c}.nthview-compare .nthview-c-amber{--oc:#f7c04a;--ocs:#33280f}.nthview-compare .nthview-c-rose{--oc:#ff8aa0;--ocs:#371a22}.nthview-compare .nthview-c-violet{--oc:#bba6ff;--ocs:#271e3f}.nthview-compare .nthview-c-green{--oc:#6ddc94;--ocs:#13291c}}",
    /* base rules carry no specificity (:where) so every component rule below wins over them */
    ":where(.nthview-compare) :where(h1,h2,h3){line-height:1.25;margin:0;letter-spacing:-.01em}",
    ":where(.nthview-compare) :where(p){margin:0 0 var(--s3)}:where(.nthview-compare) :where(p:last-child){margin-bottom:0}",
    ":where(.nthview-compare) :where(button){font:inherit;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent}",
    /* keeps the focused control clear of the sticky step bar (WCAG 2.4.11) */
    ".nthview-compare button,.nthview-compare a,.nthview-compare textarea,.nthview-compare input,.nthview-compare h2[tabindex]{scroll-margin:7rem 0 2rem}",
    ":where(.nthview-compare) :where(a){color:var(--nv-accent);text-underline-offset:2px}",
    ":where(.nthview-compare) :where(b,strong){font-weight:650}",
    /* header and step bar */
    ".nthview-head{display:flex;gap:var(--s4);align-items:flex-start;justify-content:space-between;padding:var(--s5) 0 var(--s4)}",
    ".nthview-title{font-size:var(--t-2xl);font-weight:750;max-width:26ch}",
    ".nthview-sub{color:var(--nv-muted);margin:var(--s2) 0 0;font-size:var(--t-md);max-width:var(--measure)}",
    ".nthview-compact .nthview-head{padding:var(--s3) 0}",
    ".nthview-head>div{min-width:0}",
    ".nthview-compact .nthview-title{font-size:var(--t-lg);max-width:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-compact .nthview-sub{display:none}",
    ".nthview-restart{flex:none;min-height:44px;padding:0 var(--s4);border:1px solid var(--nv-control);background:var(--nv-surface);border-radius:999px;font-size:var(--t-sm);font-weight:600}",
    ".nthview-restart:hover{background:var(--nv-sunken)}",
    ".nthview-steps{position:sticky;top:0;z-index:10;display:grid;grid-template-columns:repeat(5,1fr);margin:0 calc(-1 * var(--s4));padding:0 var(--s2);background:var(--nv-bg);border-bottom:1px solid var(--nv-border)}",
    ".nthview-step{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;min-height:58px;padding:var(--s2) 2px;border:0;background:none;color:var(--nv-muted);font-size:var(--t-xs);font-weight:600;line-height:1.2;border-bottom:3px solid transparent;margin-bottom:-1px}",
    ".nthview-step svg{width:22px;height:22px}",
    ".nthview-step:hover{color:var(--nv-fg)}",
    ".nthview-step[aria-selected=true]{color:var(--nv-accent);border-bottom-color:var(--nv-accent);font-weight:750}",
    ".nthview-step-ic{position:relative;display:inline-flex}",
    ".nthview-step-badge{position:absolute;top:-6px;left:14px;min-width:18px;height:18px;border-radius:999px;padding:0 5px;font-size:11px;font-weight:700;line-height:18px;text-align:center;background:var(--nv-accent);color:var(--nv-on-accent);border:2px solid var(--nv-bg)}",
    ".nthview-step-badge.nthview-on{background:var(--nv-ok);color:var(--nv-surface)}",
    "@media (min-width:720px){.nthview-steps{display:flex;gap:var(--s1);padding:0}.nthview-step{flex-direction:row;gap:var(--s2);padding:0 var(--s4);font-size:var(--t-sm);min-height:52px}.nthview-step-badge{position:static;border:0;margin-left:var(--s1)}}",
    /* sections and motion */
    ".nthview-panel{padding-top:var(--s5)}",
    ".nthview-enter{animation:nthview-in var(--dur) var(--ease)}",
    "@keyframes nthview-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".nthview-resume{display:flex;align-items:center;gap:var(--s3);background:var(--nv-accent-soft);border-radius:var(--r2);padding:var(--s3) var(--s4);margin:var(--s4) 0 0;font-size:var(--t-sm);font-weight:600;transition:opacity .4s}",
    ".nthview-resume svg{width:20px;height:20px;flex:none;color:var(--nv-accent)}",
    ".nthview-resume-hide{opacity:0}",
    ".nthview-card{background:var(--nv-surface);border:1px solid var(--nv-border);border-radius:var(--r3);padding:var(--s5);box-shadow:var(--nv-shadow)}",
    ".nthview-stack>*+*{margin-top:var(--s4)}",
    ".nthview-grid{display:grid;gap:var(--s4);grid-template-columns:repeat(auto-fit,minmax(min(100%,17rem),1fr))}",
    ".nthview-h2{font-size:var(--t-xl);font-weight:700;margin:var(--s7) 0 var(--s4)}",
    ".nthview-h2:first-child{margin-top:0}",
    ".nthview-h3{font-size:var(--t-lg);margin:0 0 var(--s3)}",
    ".nthview-lede{color:var(--nv-muted);max-width:var(--measure);margin:0 0 var(--s5)}",
    ".nthview-prose{max-width:var(--measure)}",
    ".nthview-kicker{display:block;font-size:var(--t-xs);font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:var(--nv-muted);margin:0 0 var(--s2)}",
    ".nthview-muted{color:var(--nv-muted)}",
    ".nthview-small{font-size:var(--t-sm)}",
    ".nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    /* buttons */
    ".nthview-btn{display:inline-flex;align-items:center;justify-content:center;gap:var(--s2);min-height:48px;padding:var(--s2) var(--s5);border-radius:var(--r2);border:1px solid var(--nv-control);background:var(--nv-surface);font-weight:650;font-size:var(--t-md);line-height:1.3;text-align:center;transition:background var(--dur),transform var(--dur) var(--ease)}",
    ".nthview-btn svg{width:20px;height:20px;flex:none}",
    ".nthview-btn:hover:not([disabled]){background:var(--nv-sunken)}",
    ".nthview-btn:active:not([disabled]){transform:scale(.98)}",
    ".nthview-btn[disabled]{opacity:.4;cursor:not-allowed}",
    ".nthview-primary{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--nv-on-accent)}",
    ".nthview-primary:hover:not([disabled]){background:var(--nv-accent);filter:brightness(1.1)}",
    ".nthview-link{border:0;background:none;color:var(--nv-accent);font-weight:600;min-height:44px;padding:0 var(--s2);text-decoration:underline;text-underline-offset:3px}",
    ".nthview-actions{display:flex;flex-wrap:wrap;gap:var(--s3);align-items:center;margin-top:var(--s5)}",
    "@media (max-width:479px){.nthview-actions .nthview-btn{flex:1 1 100%}}",
    ".nthview-next{display:flex;justify-content:flex-end;margin-top:var(--s7);padding-top:var(--s5);border-top:1px solid var(--nv-border)}",
    "@media (max-width:479px){.nthview-next .nthview-btn{width:100%}}",
    /* start screen */
    ".nthview-hero{padding:var(--s6) var(--s5)}",
    ".nthview-focus{font-size:var(--t-xl);font-weight:700;line-height:1.3;margin:0 0 var(--s4);max-width:32ch}",
    ".nthview-meta{display:flex;flex-wrap:wrap;gap:var(--s2) var(--s5);margin:0 0 var(--s5);padding:0;list-style:none;color:var(--nv-muted);font-size:var(--t-sm);font-weight:600}",
    ".nthview-meta li{display:inline-flex;align-items:center;gap:var(--s2)}",
    ".nthview-meta svg{width:18px;height:18px}",
    ".nthview-names{display:flex;flex-wrap:wrap;gap:var(--s2);margin:0 0 var(--s4)}",
    ".nthview-name{display:inline-flex;align-items:center;gap:var(--s2);padding:var(--s1) var(--s3);border-radius:999px;background:var(--ocs);color:var(--oc);font-weight:650;font-size:var(--t-sm)}",
    ".nthview-vs{align-self:center;color:var(--nv-muted);font-size:var(--t-sm)}",
    ".nthview-dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--oc);flex:none}",
    ".nthview-optcard{border-top:4px solid var(--oc)}",
    ".nthview-optcard h3{color:var(--oc);font-size:var(--t-lg)}",
    ".nthview-aka{font-size:var(--t-sm);color:var(--nv-muted);margin:var(--s1) 0 var(--s3)}",
    ".nthview-details{margin-top:var(--s6);border-top:1px solid var(--nv-border);padding-top:var(--s2)}",
    ".nthview-details summary{cursor:pointer;min-height:44px;display:flex;align-items:center;font-weight:650}",
    ".nthview-sources{margin:var(--s2) 0 0;padding-left:1.2rem;font-size:var(--t-sm)}.nthview-sources li{margin:var(--s2) 0}",
    /* compare toolbar */
    ".nthview-toolbar{display:flex;flex-wrap:wrap;gap:var(--s3);align-items:center;margin:0 0 var(--s4)}",
    ".nthview-seg{display:inline-flex;flex-wrap:wrap;padding:3px;border-radius:var(--r2);background:var(--nv-sunken);border:1px solid var(--nv-control)}",
    ".nthview-seg button{min-height:42px;padding:0 var(--s4);border:0;border-radius:calc(var(--r2) - 3px);background:none;color:var(--nv-muted);font-weight:650;font-size:var(--t-sm);transition:background var(--dur),color var(--dur)}",
    ".nthview-seg button:hover{color:var(--nv-fg)}",
    ".nthview-seg button[aria-pressed=true]{background:var(--nv-accent);color:var(--nv-on-accent)}",
    ".nthview-toggle{display:inline-flex;align-items:center;gap:var(--s2);min-height:48px;padding:0 var(--s3);border:1px solid var(--nv-control);border-radius:var(--r2);background:var(--nv-surface);font-size:var(--t-sm);font-weight:600}",
    ".nthview-toggle i{position:relative;width:36px;height:20px;border-radius:999px;background:var(--nv-control);flex:none;transition:background var(--dur)}",
    ".nthview-toggle i:after{content:'';position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--nv-surface);transition:transform var(--dur) var(--ease)}",
    ".nthview-toggle[aria-pressed=true] i{background:var(--nv-accent)}.nthview-toggle[aria-pressed=true] i:after{transform:translateX(16px)}",
    ".nthview-toolbar .nthview-more-btn{margin-left:auto;min-height:48px;font-size:var(--t-sm);padding:0 var(--s4)}",
    "@media (max-width:479px){.nthview-toolbar .nthview-more-btn{margin-left:0}}",
    ".nthview-hint{font-size:var(--t-sm);color:var(--nv-muted);margin:0 0 var(--s4);max-width:var(--measure)}",
    ".nthview-meter{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s3);padding:var(--s3) var(--s4);border-radius:var(--r2);background:var(--nv-accent-soft);margin:0 0 var(--s3)}",
    ".nthview-meter p{margin:0;flex:1 1 10rem;font-size:var(--t-sm);font-weight:650}",
    ".nthview-meter .nthview-btn{min-height:44px;font-size:var(--t-sm);padding:0 var(--s4)}",
    ".nthview-bar{height:6px;border-radius:999px;background:var(--nv-sunken);overflow:hidden;flex:1 1 100%;box-shadow:inset 0 0 0 1px var(--nv-border)}",
    ".nthview-bar i{display:block;height:100%;background:var(--nv-accent);border-radius:999px;transition:width .3s var(--ease)}",
    ".nthview-chips{display:flex;flex-wrap:wrap;gap:var(--s2)}",
    ".nthview-chip{display:inline-flex;align-items:center;gap:var(--s2);min-height:44px;padding:0 var(--s4);border:1px solid var(--nv-control);border-radius:999px;background:var(--nv-surface);font-size:var(--t-sm);font-weight:600}",
    ".nthview-chip svg{width:16px;height:16px}",
    ".nthview-chip:hover:not([disabled]){background:var(--nv-sunken)}",
    ".nthview-chip[aria-pressed=true]{border-color:var(--oc,var(--nv-accent));background:var(--ocs,var(--nv-accent-soft));color:var(--oc,var(--nv-fg));box-shadow:inset 0 0 0 1px var(--oc,var(--nv-accent));font-weight:700}",
    ".nthview-chip[aria-pressed=true]:before{content:'\\2713';font-weight:800}",
    ".nthview-chip[disabled]{cursor:default}",
    ".nthview-active{display:flex;flex-wrap:wrap;gap:var(--s2);margin:0 0 var(--s4)}",
    ".nthview-active .nthview-chip{background:var(--nv-accent-soft);border-color:var(--nv-accent);color:var(--nv-fg)}",
    ".nthview-pill{display:inline-flex;align-items:center;gap:var(--s1);font-size:var(--t-xs);font-weight:700;border-radius:999px;padding:2px var(--s2);background:var(--nv-sunken);color:var(--nv-muted)}",
    ".nthview-pill.nthview-alike{background:var(--nv-ok-soft);color:var(--nv-ok)}",
    ".nthview-fieldset{border:0;padding:0;margin:0 0 var(--s5)}",
    ".nthview-fieldset legend{font-weight:700;margin-bottom:var(--s2);padding:0}",
    ".nthview-fieldset .nthview-muted{margin:var(--s2) 0}",
    /* marks */
    ".nthview-mark{display:inline-flex;align-items:center;gap:var(--s1);font-size:var(--t-xs);font-weight:700;border-radius:999px;padding:1px var(--s2) 1px var(--s1);background:var(--nv-sunken);color:var(--nv-muted);white-space:nowrap;vertical-align:1px}",
    ".nthview-mark svg{width:16px;height:16px;flex:none}",
    ".nthview-m-yes{background:var(--nv-ok-soft);color:var(--nv-ok)}.nthview-m-no{background:var(--nv-bad-soft);color:var(--nv-bad)}",
    ".nthview-m-low,.nthview-m-medium,.nthview-m-high{background:var(--nv-accent-soft);color:var(--nv-accent)}",
    /* cells: one button shape for table, cards and lists */
    ".nthview-cell{position:relative;display:block;width:100%;text-align:left;border:1px solid transparent;border-radius:var(--r1);background:none;padding:var(--s2) var(--s6) var(--s2) var(--s2);min-height:44px;transition:background var(--dur),border-color var(--dur)}",
    ".nthview-cell:hover{background:var(--nv-sunken);border-color:var(--nv-border)}",
    ".nthview-cell .nthview-mark{margin-bottom:var(--s1)}",
    ".nthview-cell .nthview-ctxt{display:block}",
    ".nthview-cell .nthview-chev{position:absolute;right:var(--s2);top:50%;margin-top:-9px;width:18px;height:18px;color:var(--nv-muted)}",
    ".nthview-cell.nthview-covered{display:flex;align-items:center;justify-content:center;gap:var(--s2);padding:var(--s3);border:2px dashed var(--nv-control);background:var(--nv-sunken);color:var(--nv-muted);font-weight:650;min-height:52px}",
    ".nthview-cell.nthview-covered:hover{border-color:var(--nv-accent);color:var(--nv-accent)}",
    ".nthview-cell.nthview-justrevealed{animation:nthview-flash 1s var(--ease)}",
    "@keyframes nthview-flash{from{background:var(--nv-accent-soft)}to{background:transparent}}",
    /* table */
    ".nthview-tablewrap{overflow:auto;max-height:calc(100vh - 5rem);border:1px solid var(--nv-border);border-radius:var(--r3);background:var(--nv-surface);box-shadow:var(--nv-shadow)}",
    ".nthview-matrix{border-collapse:separate;border-spacing:0;width:100%;min-width:40rem;table-layout:fixed;font-size:var(--t-sm);line-height:1.5}",
    ".nthview-matrix th,.nthview-matrix td{padding:var(--s3) var(--s4);text-align:left;vertical-align:top;border-bottom:1px solid var(--nv-border)}",
    ".nthview-matrix td{padding:var(--s2)}",
    ".nthview-matrix tbody tr:last-child>*{border-bottom:0}",
    ".nthview-matrix thead th{position:sticky;top:0;z-index:2;background:var(--nv-surface);font-size:var(--t-md);border-bottom:3px solid var(--oc,var(--nv-border));padding-top:var(--s4)}",
    ".nthview-matrix thead th span{display:flex;align-items:center;gap:var(--s2);color:var(--oc)}",
    ".nthview-matrix thead th:first-child{left:0;z-index:3;width:13rem;font-size:var(--t-xs);text-transform:uppercase;letter-spacing:.06em;color:var(--nv-muted)}",
    ".nthview-matrix tbody th{position:sticky;left:0;z-index:1;background:var(--nv-surface);font-size:var(--t-sm);border-right:1px solid var(--nv-border)}",
    ".nthview-matrix tbody th small{display:block;font-weight:400;color:var(--nv-muted);margin-top:var(--s1);font-size:var(--t-xs);line-height:1.45}",
    ".nthview-matrix tbody th .nthview-pill{margin-top:var(--s2)}",
    ".nthview-matrix tr.nthview-alikerow>*{background:var(--nv-sunken)}",
    /* cards per criterion and per option */
    ".nthview-dimhead{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s2) var(--s3);margin:0 0 var(--s1)}",
    ".nthview-dimhead h3{font-size:var(--t-lg)}",
    ".nthview-num{font-size:var(--t-xs);font-weight:700;color:var(--nv-muted);margin-left:auto}",
    ".nthview-why{font-size:var(--t-sm);color:var(--nv-muted);margin:0 0 var(--s3);max-width:var(--measure)}",
    ".nthview-rows{list-style:none;margin:0;padding:0}",
    ".nthview-row{padding:var(--s2) 0 var(--s2) var(--s3);border-top:1px solid var(--nv-border);border-left:3px solid var(--oc)}",
    ".nthview-rowname{display:block;color:var(--oc);font-weight:700;font-size:var(--t-sm);margin:var(--s1) 0 0 var(--s2)}",
    ".nthview-takeaway{margin:var(--s3) 0 0;padding:var(--s3) var(--s4);border-radius:var(--r2);background:var(--nv-sunken);font-size:var(--t-sm)}",
    ".nthview-dl{margin:var(--s3) 0 0}",
    ".nthview-dl dt{font-weight:700;font-size:var(--t-xs);text-transform:uppercase;letter-spacing:.05em;color:var(--nv-muted);margin-top:var(--s4)}",
    ".nthview-dl dd{margin:var(--s1) 0 0 calc(-1 * var(--s2))}",
    ".nthview-empty{padding:var(--s5);border:1px dashed var(--nv-control);border-radius:var(--r2);color:var(--nv-muted)}",
    /* sheet (dialog) */
    ".nthview-sheetbg{position:fixed;inset:0;z-index:50;background:rgba(10,10,12,.5);display:flex;align-items:center;justify-content:center;padding:var(--s4);animation:nthview-fade var(--dur) var(--ease)}",
    "@keyframes nthview-fade{from{opacity:0}to{opacity:1}}",
    ".nthview-sheet{background:var(--nv-surface);color:var(--nv-fg);border-radius:var(--r3);max-width:36rem;width:100%;max-height:88vh;overflow:auto;padding:var(--s5);border-top:5px solid var(--oc,var(--nv-accent));box-shadow:var(--nv-shadow-lg);animation:nthview-up 240ms var(--ease)}",
    "@keyframes nthview-up{from{transform:translateY(24px);opacity:.6}to{transform:none;opacity:1}}",
    "@media (max-width:599px){.nthview-sheetbg{align-items:flex-end;padding:0}.nthview-sheet{border-radius:var(--r3) var(--r3) 0 0;max-height:86vh;padding-bottom:max(var(--s5),env(safe-area-inset-bottom))}}",
    ".nthview-sheet-head{display:flex;justify-content:space-between;gap:var(--s4);align-items:flex-start;margin-bottom:var(--s3)}",
    ".nthview-sheet-head h2{font-size:var(--t-lg)}",
    ".nthview-sheet-head small{display:block;color:var(--oc,var(--nv-muted));font-weight:700;font-size:var(--t-xs);text-transform:uppercase;letter-spacing:.06em;margin-bottom:var(--s1)}",
    ".nthview-close{flex:none;width:44px;height:44px;border-radius:999px;border:1px solid var(--nv-control);background:var(--nv-surface);display:inline-flex;align-items:center;justify-content:center}",
    ".nthview-close svg{width:20px;height:20px}",
    ".nthview-predict{display:grid;grid-template-columns:repeat(auto-fit,minmax(6.5rem,1fr));gap:var(--s2);margin:var(--s3) 0}",
    ".nthview-verdict{display:flex;gap:var(--s2);align-items:center;border-radius:var(--r2);padding:var(--s3) var(--s4);margin:0 0 var(--s4);font-weight:650;font-size:var(--t-sm)}",
    ".nthview-verdict svg{width:20px;height:20px;flex:none}",
    ".nthview-v-ok{background:var(--nv-ok-soft);color:var(--nv-ok)}.nthview-v-bad{background:var(--nv-bad-soft);color:var(--nv-bad)}.nthview-v-meh{background:var(--nv-sunken)}",
    ".nthview-celltext{font-size:var(--t-lg);font-weight:600;line-height:1.4;margin:var(--s2) 0 var(--s3)}",
    /* choose and recap */
    ".nthview-sitcard{border-left:4px solid var(--oc)}",
    ".nthview-sitcard h3{display:flex;align-items:center;gap:var(--s2);font-size:var(--t-lg);margin:0 0 var(--s3)}",
    ".nthview-sits{list-style:none;margin:0;padding:0}",
    ".nthview-sits li{padding:var(--s3) 0;border-top:1px solid var(--nv-border)}",
    ".nthview-sits li:first-child{border-top:0;padding-top:0}",
    ".nthview-sits b{display:block;font-weight:600}",
    ".nthview-sits span{display:block;color:var(--nv-muted);font-size:var(--t-sm);margin-top:var(--s1)}",
    ".nthview-big{border:0;background:var(--nv-accent);color:var(--nv-on-accent)}",
    ".nthview-big .nthview-kicker{color:inherit;opacity:.85}",
    ".nthview-big p{font-size:var(--t-lg);line-height:1.5;font-weight:500;max-width:var(--measure)}",
    ".nthview-list{list-style:none;margin:0;padding:0}",
    ".nthview-list li{position:relative;padding:var(--s3) 0 var(--s3) var(--s6);border-top:1px solid var(--nv-border)}",
    ".nthview-list li:first-child{border-top:0}",
    ".nthview-list li svg{position:absolute;left:0;top:calc(var(--s3) + 2px);width:22px;height:22px}",
    ".nthview-alike-ic{color:var(--nv-ok)}.nthview-diff-ic{color:var(--nv-accent)}",
    ".nthview-crit{margin:0}",
    ".nthview-crit>div{display:grid;grid-template-columns:minmax(8rem,13rem) minmax(0,var(--measure));gap:var(--s1) var(--s5);padding:var(--s3) 0;border-top:1px solid var(--nv-border)}",
    ".nthview-crit dt{font-weight:700}.nthview-crit dd{margin:0}",
    "@media (max-width:599px){.nthview-crit>div{grid-template-columns:1fr}}",
    ".nthview-myth p{margin:0}",
    ".nthview-myth .nthview-claim{display:flex;gap:var(--s2);color:var(--nv-bad);font-weight:650;margin-bottom:var(--s3)}",
    ".nthview-myth svg{width:20px;height:20px;flex:none;margin-top:3px}",
    ".nthview-myth .nthview-fact{display:flex;gap:var(--s2)}",
    ".nthview-myth .nthview-fact svg{color:var(--nv-ok)}",
    /* practice */
    ".nthview-qtop,.nthview-qcard,.nthview-qfoot,.nthview-end{max-width:48rem;margin-left:auto;margin-right:auto}",
    ".nthview-qtop{display:flex;flex-wrap:wrap;align-items:center;gap:var(--s2) var(--s3);margin:0 0 var(--s4)}",
    ".nthview-qcount{font-weight:700}",
    ".nthview-qtop .nthview-bar{order:3}",
    ".nthview-qtop .nthview-link{margin-left:auto}",
    ".nthview-qcard h2{font-size:var(--t-xl);margin:var(--s2) 0 var(--s4);max-width:var(--measure)}",
    ".nthview-situation{background:var(--nv-sunken);border-radius:var(--r2);padding:var(--s4);margin:0;max-width:var(--measure)}",
    ".nthview-choices{display:grid;gap:var(--s3);margin:0}",
    ".nthview-choice{display:flex;gap:var(--s3);align-items:flex-start;text-align:left;width:100%;min-height:56px;padding:var(--s3) var(--s4);border:1.5px solid var(--nv-control);border-radius:var(--r2);background:var(--nv-surface);transition:border-color var(--dur),background var(--dur),box-shadow var(--dur)}",
    ".nthview-choice:hover{background:var(--nv-sunken)}",
    ".nthview-choice[aria-pressed=true]{border-color:var(--nv-accent);background:var(--nv-accent-soft);box-shadow:inset 0 0 0 1px var(--nv-accent)}",
    ".nthview-key{flex:none;width:28px;height:28px;border-radius:var(--r1);border:1.5px solid var(--nv-control);display:inline-flex;align-items:center;justify-content:center;font-size:var(--t-xs);font-weight:700;color:var(--nv-muted);margin-top:1px}",
    ".nthview-choice[aria-pressed=true] .nthview-key{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--nv-on-accent)}",
    ".nthview-key svg{width:16px;height:16px}",
    ".nthview-ctext{flex:1;padding-top:2px}",
    ".nthview-ctext small{display:block;color:var(--nv-muted);margin-top:var(--s1)}",
    ".nthview-choice.nthview-right{border-color:var(--nv-ok);background:var(--nv-ok-soft)}",
    ".nthview-choice.nthview-right .nthview-key{background:var(--nv-ok);border-color:var(--nv-ok);color:var(--nv-surface)}",
    ".nthview-choice.nthview-wrong{border-color:var(--nv-bad);background:var(--nv-bad-soft)}",
    ".nthview-choice.nthview-wrong .nthview-key{background:var(--nv-bad);border-color:var(--nv-bad);color:var(--nv-surface)}",
    ".nthview-choice.nthview-viewing{box-shadow:0 0 0 2px var(--nv-surface),0 0 0 4px var(--nv-fg)}",
    ".nthview-owner{display:inline-flex;align-items:center;gap:var(--s2);font-size:var(--t-xs);font-weight:700;color:var(--oc);margin-top:var(--s1)}",
    ".nthview-confirm{margin-top:var(--s5)}",
    ".nthview-confirm p{font-size:var(--t-sm);color:var(--nv-muted);margin:0 0 var(--s3)}",
    ".nthview-confirm .nthview-actions{margin-top:0}",
    ".nthview-fb{margin-top:var(--s5);border-radius:var(--r2);padding:var(--s4) var(--s5) var(--s5);background:var(--nv-sunken)}",
    ".nthview-fb-in{animation:nthview-in var(--dur) var(--ease)}",
    ".nthview-fbhead{display:flex;align-items:center;gap:var(--s3);margin:0 0 var(--s3)}",
    ".nthview-fbhead h3{font-size:var(--t-lg)}",
    ".nthview-fbicon{flex:none;width:32px;height:32px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;color:var(--nv-surface);background:var(--nv-accent)}",
    ".nthview-fbicon svg{width:18px;height:18px}",
    ".nthview-fb-ok{background:var(--nv-ok-soft)}.nthview-fb-ok h3{color:var(--nv-ok)}.nthview-fb-ok .nthview-fbicon{background:var(--nv-ok)}",
    ".nthview-fb-bad{background:var(--nv-bad-soft)}.nthview-fb-bad h3{color:var(--nv-bad)}.nthview-fb-bad .nthview-fbicon{background:var(--nv-bad)}",
    ".nthview-fb p{max-width:var(--measure)}",
    ".nthview-note{border-left:3px solid currentColor;padding-left:var(--s3)}",
    ".nthview-fb .nthview-actions{margin-top:var(--s4)}",
    ".nthview-qfoot{display:flex;justify-content:space-between;gap:var(--s3);margin-top:var(--s3)}",
    ".nthview-stmt{border:1.5px solid var(--nv-border);border-radius:var(--r2);padding:var(--s4);margin:0 0 var(--s3)}",
    ".nthview-stmt>p{margin:0 0 var(--s3);font-weight:600}",
    ".nthview-stmt.nthview-right{border-color:var(--nv-ok);background:var(--nv-ok-soft)}",
    ".nthview-stmt.nthview-wrong{border-color:var(--nv-bad);background:var(--nv-bad-soft)}",
    ".nthview-stmt .nthview-explain{margin:var(--s3) 0 0;font-size:var(--t-sm);font-weight:400}",
    ".nthview-verd{display:inline-flex;align-items:center;gap:var(--s1);font-weight:700}",
    ".nthview-verd svg{width:16px;height:16px}",
    ".nthview-stmt.nthview-right .nthview-verd{color:var(--nv-ok)}.nthview-stmt.nthview-wrong .nthview-verd{color:var(--nv-bad)}",
    ".nthview-textarea{width:100%;min-height:8rem;font:inherit;color:inherit;background:var(--nv-bg);border:1.5px solid var(--nv-control);border-radius:var(--r2);padding:var(--s3) var(--s4);resize:vertical}",
    ".nthview-ticks{list-style:none;padding:0;margin:var(--s2) 0 0}",
    ".nthview-ticks label{display:flex;gap:var(--s3);align-items:flex-start;padding:var(--s2) 0;min-height:44px;cursor:pointer}",
    ".nthview-ticks input{width:22px;height:22px;margin:2px 0 0;flex:none;accent-color:var(--nv-accent)}",
    ".nthview-qlist{list-style:none;margin:0;padding:0}",
    ".nthview-qlist li{border-top:1px solid var(--nv-border)}",
    ".nthview-qlist li:first-child{border-top:0}",
    ".nthview-qlist button{display:flex;gap:var(--s3);align-items:flex-start;width:100%;text-align:left;border:0;background:none;padding:var(--s3) var(--s1);min-height:48px;border-radius:var(--r1)}",
    ".nthview-qlist button:hover{background:var(--nv-sunken)}",
    ".nthview-badge{flex:none;min-width:4.5rem;text-align:center;font-size:var(--t-xs);font-weight:700;border-radius:999px;padding:2px var(--s2);background:var(--nv-sunken);color:var(--nv-muted);margin-top:2px}",
    ".nthview-b-ok{background:var(--nv-ok-soft);color:var(--nv-ok)}.nthview-b-bad{background:var(--nv-bad-soft);color:var(--nv-bad)}.nthview-b-now{background:var(--nv-accent-soft);color:var(--nv-accent)}",
    ".nthview-score{display:flex;align-items:baseline;gap:var(--s3);flex-wrap:wrap;margin:var(--s4) 0 0}",
    ".nthview-score b{font-size:clamp(2.4rem,8vw,3.4rem);font-weight:800;color:var(--nv-accent);line-height:1}",
    ".nthview-tally{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--s2);margin:var(--s4) 0}",
    ".nthview-tally div{background:var(--nv-sunken);border-radius:var(--r2);padding:var(--s3)}",
    ".nthview-tally b{display:block;font-size:var(--t-xl);line-height:1.2}",
    ".nthview-tally span{font-size:var(--t-xs);color:var(--nv-muted);font-weight:600}",
    /* phones */
    "@media (max-width:599px){.nthview-card{padding:var(--s4)}.nthview-hero{padding:var(--s5) var(--s4)}.nthview-h2{margin-top:var(--s6)}.nthview-matrix{min-width:34rem}.nthview-matrix thead th:first-child{width:8rem}.nthview-matrix th,.nthview-matrix td{padding:var(--s3);hyphens:auto}.nthview-matrix td{padding:var(--s1)}.nthview-head{padding-top:var(--s4)}.nthview-qcard h2{font-size:var(--t-lg)}}",
    "@media (max-width:359px){.nthview-compare{padding:0 var(--s3) var(--s7)}.nthview-steps{margin:0 calc(-1 * var(--s3));padding:0}.nthview-step{font-size:11px}.nthview-seg button{padding:0 var(--s3)}}",
    "@media (prefers-reduced-motion:reduce){.nthview-compare *,.nthview-compare *:before,.nthview-compare *:after{animation:none!important;transition:none!important}}",
    "@media print{.nthview-steps,.nthview-restart,.nthview-toolbar,.nthview-next{display:none}}"
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
    { id: "overview", label: "Start", long: "Start", icon: "start" },
    { id: "compare", label: "Compare", long: "Compare", icon: "grid" },
    { id: "choose", label: "Choose", long: "When to choose", icon: "fork" },
    { id: "practice", label: "Practise", long: "Practise", icon: "target" },
    { id: "recap", label: "Recap", long: "Recap", icon: "list" }
  ];
  var MARK_LABEL = { yes: "Yes", partly: "Partly", no: "No", low: "Low", medium: "Medium", high: "High", na: "N/A" };
  var FEATURE = ["yes", "partly", "no"], DEGREE = ["low", "medium", "high"];
  var KIND_LABEL = { sort: "Sort the statements", cell: "Fill the hidden cell", pick: "Choose for the situation", choice: "Choose one", explain: "In your own words" };
  var SVG_NS = "http://www.w3.org/2000/svg";
  var STROKE = { fill: "none", stroke: "currentColor", "stroke-width": "2", "stroke-linecap": "round", "stroke-linejoin": "round" };
  var PATHS = {
    start: "M4 11.5 12 5l8 6.5V20a1 1 0 0 1-1 1h-4.5v-5.5h-5V21H5a1 1 0 0 1-1-1z",
    grid: "M4 5h16v14H4zM4 10h16M10 5v14M15 5v14",
    fork: "M12 21v-7M12 14 6.5 8.5M12 14l5.5-5.5M6 4v5h5M18 4v5h-5",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8.5 12l2.5 2.5 4.5-5",
    list: "M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01",
    check: "M5 12.5l4.5 4.5L19 7.5",
    cross: "M6 6l12 12M18 6 6 18",
    chev: "M9 6l6 6-6 6",
    arrow: "M5 12h14M13 6l6 6-6 6",
    clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2",
    alike: "M7 12h10M7 8h10M7 16h10",
    diff: "M8 7 4 12l4 5M16 7l4 5-4 5",
    info: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01"
  };

  function svgEl(parts, vb) {
    var s = root.document.createElementNS(SVG_NS, "svg");
    s.setAttribute("viewBox", vb || "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    parts.forEach(function (pt) {
      var n = root.document.createElementNS(SVG_NS, pt[0]);
      Object.keys(pt[1]).forEach(function (k) { n.setAttribute(k, pt[1][k]); });
      s.appendChild(n);
    });
    return s;
  }
  function icon(name, cls) {
    var s = svgEl([["path", Object.assign({ d: PATHS[name] }, STROKE)]]);
    if (cls) s.setAttribute("class", cls);
    return s;
  }
  function markIcon(m) {
    var line = { fill: "none", stroke: "currentColor", "stroke-width": "2.2", "stroke-linecap": "round", "stroke-linejoin": "round" };
    if (m === "yes") return svgEl([["path", Object.assign({ d: "M3 8.5l3.2 3.2L13 4.8" }, line)]], "0 0 16 16");
    if (m === "no") return svgEl([["path", Object.assign({ d: "M4 4l8 8M12 4l-8 8" }, line)]], "0 0 16 16");
    if (m === "partly") return svgEl([["circle", { cx: "8", cy: "8", r: "5.5", fill: "none", stroke: "currentColor", "stroke-width": "1.8" }], ["path", { d: "M8 2.5a5.5 5.5 0 0 1 0 11z", fill: "currentColor" }]], "0 0 16 16");
    if (m === "na") return svgEl([["path", Object.assign({ d: "M4 8h8" }, line)]], "0 0 16 16");
    var n = m === "low" ? 1 : m === "medium" ? 2 : 3, bars = [];
    for (var i = 0; i < 3; i++) bars.push(["rect", { x: String(2 + i * 4.6), y: String(10 - i * 3.5), width: "3.2", height: String(4 + i * 3.5), rx: "1", fill: "currentColor", opacity: i < n ? "1" : ".3" }]);
    return svgEl(bars, "0 0 16 16");
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
  function plain(text) { return String(text).replace(/\*\*/g, ""); }
  function p(text, cls) { var n = el("p", cls ? { class: cls } : {}); n.appendChild(rich(text)); return n; }
  function span(text, cls) { var n = el("span", cls ? { class: cls } : {}); n.appendChild(rich(text)); return n; }
  function btn(label, cls, onClick, attrs, iconAfter) {
    var b = el("button", Object.assign({ type: "button", class: "nthview-btn" + (cls ? " " + cls : "") }, attrs || {}), [el("span", { text: label })]);
    if (iconAfter) b.appendChild(icon(iconAfter));
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
  function article(name) { return (/^[aeiou]/i.test(name) ? "an " : "a ") + name.charAt(0).toLowerCase() + name.slice(1); }

  // ---- view-specific rendering: data is already valid here ---------------
  function render(container, data) {
    var doc = root.document;
    var key = storageKey(data);
    var reduceMotion = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var Q = data.questions, N = Q.length;

    /* ---------- lookups ---------- */
    var opt = {}, dim = {}, dimIndex = {}, cell = {};
    var used = data.options.map(function (o) { return o.colour; });
    var free = COLOURS.filter(function (c) { return used.indexOf(c) === -1; });
    data.options.forEach(function (o) { opt[o.id] = { o: o, colour: o.colour || free.shift(), short: o.short || o.name }; });
    data.dimensions.forEach(function (d, i) { dim[d.id] = d; dimIndex[d.id] = i; });
    data.cells.forEach(function (c) { cell[c.option + "|" + c.dimension] = c; });
    function oc(id) { return "nthview-c-" + opt[id].colour; }
    function scaleOf(dimId) {
      var ms = data.options.map(function (o) { return cell[o.id + "|" + dimId].mark; });
      if (ms.some(function (m) { return DEGREE.indexOf(m) !== -1; })) return DEGREE;
      if (ms.some(function (m) { return FEATURE.indexOf(m) !== -1; })) return FEATURE;
      return null;
    }
    var minutes = Math.max(5, Math.round((data.cells.length * 20 + N * 60 + data.whenToChoose.length * 10) / 300) * 5);

    /* ---------- state ---------- */
    var state = { tab: "overview", layout: null, filter: "all", hidden: [], cover: false, revealed: {}, q: 0, answers: {}, done: false, seen: {} };
    function persist() {
      saveState(key, { tab: state.tab, layout: state.layout, filter: state.filter, hidden: state.hidden, cover: state.cover, revealed: state.revealed, q: state.q, answers: state.answers, done: state.done, seen: state.seen });
    }

    /* ---------- frame: header, step bar, panel ---------- */
    var headText = el("div", {}, [el("h1", { class: "nthview-title", text: data.title })]);
    if (data.subtitle) headText.appendChild(p(data.subtitle, "nthview-sub"));
    var head = el("header", { class: "nthview-head" }, [headText, restartButton(container, data, key)]);
    var steps = el("div", { class: "nthview-steps", role: "tablist", "aria-label": "Sections" });
    var stepBtns = {};
    TABS.forEach(function (t, i) {
      var ic = el("span", { class: "nthview-step-ic" }, [icon(t.icon), el("span", { class: "nthview-step-badge", "aria-hidden": "true" })]);
      var b = el("button", { type: "button", role: "tab", id: "nthview-tab-" + t.id, class: "nthview-step", "aria-controls": "nthview-panel", "aria-selected": "false", tabindex: "-1" }, [ic, el("span", { text: t.label })]);
      b.addEventListener("click", function () { go(t.id); });
      b.addEventListener("keydown", function (e) {
        var n = null;
        if (e.key === "ArrowRight") n = TABS[(i + 1) % TABS.length];
        else if (e.key === "ArrowLeft") n = TABS[(i + TABS.length - 1) % TABS.length];
        else if (e.key === "Home") n = TABS[0];
        else if (e.key === "End") n = TABS[TABS.length - 1];
        if (n) { e.preventDefault(); go(n.id); stepBtns[n.id].focus(); }
      });
      stepBtns[t.id] = b; steps.appendChild(b);
    });
    var notice = el("div");
    var panel = el("div", { id: "nthview-panel", role: "tabpanel", class: "nthview-panel" });
    var live = el("div", { class: "nthview-sr", role: "status", "aria-live": "polite" });
    container.appendChild(head); container.appendChild(steps); container.appendChild(notice); container.appendChild(panel); container.appendChild(live);
    function say(t) { live.textContent = ""; setTimeout(function () { live.textContent = t; }, 30); }
    function toPanelTop() {
      if (steps.getBoundingClientRect().top > 0) return;
      root.scrollTo(0, Math.max(0, panel.getBoundingClientRect().top + root.scrollY - steps.offsetHeight - 8));
    }

    function go(tab, opts) {
      opts = opts || {};
      state.tab = tab;
      state.seen[tab] = true;
      container.classList.toggle("nthview-compact", tab !== "overview");
      TABS.forEach(function (t) {
        var on = t.id === tab;
        stepBtns[t.id].setAttribute("aria-selected", on ? "true" : "false");
        stepBtns[t.id].setAttribute("tabindex", on ? "0" : "-1");
      });
      panel.setAttribute("aria-labelledby", "nthview-tab-" + tab);
      draw(!opts.initial);
      if (!opts.initial) { persist(); toPanelTop(); }
    }
    function draw(animate) {
      var body = el("div", { class: animate && !reduceMotion ? "nthview-enter" : "" });
      var host = panel; panel = body;
      ({ overview: drawOverview, compare: drawCompare, choose: drawChoose, practice: drawPractice, recap: drawRecap })[state.tab]();
      panel = host; panel.innerHTML = ""; panel.appendChild(body);
      updateSteps();
    }
    /* the step bar shows where the learner is and what is done: a check per visited section, the practice count */
    function updateSteps() {
      var n = answeredCount();
      TABS.forEach(function (t) {
        var b = stepBtns[t.id], badge = b.querySelector(".nthview-step-badge"), label = t.long;
        if (t.id === "practice") {
          badge.textContent = state.done ? "✓" : String(n);
          badge.className = "nthview-step-badge" + (state.done ? " nthview-on" : "");
          badge.style.display = n || state.done ? "" : "none";
          label += state.done ? ", finished" : ", " + n + " of " + N + " answered";
        } else {
          badge.textContent = "✓"; badge.className = "nthview-step-badge nthview-on";
          badge.style.display = state.seen[t.id] && t.id !== state.tab ? "" : "none";
          if (state.seen[t.id] && t.id !== state.tab) label += ", visited";
        }
        b.setAttribute("aria-label", label);
      });
    }
    function h2(text) { return el("h2", { class: "nthview-h2", text: text }); }
    function nameTag(id) { return el("span", { class: "nthview-name " + oc(id) }, [el("span", { class: "nthview-dot", "aria-hidden": "true" }), el("span", { text: opt[id].o.name })]); }
    function owner(id) { return el("span", { class: "nthview-owner " + oc(id) }, [el("span", { class: "nthview-dot", "aria-hidden": "true" }), el("span", { text: opt[id].o.name })]); }
    function nextBar(label, tab) {
      panel.appendChild(el("div", { class: "nthview-next" }, [btn(label, "nthview-primary", function () { go(tab); }, {}, "arrow")]));
    }

    /* ---------- start: what this is, how long, one obvious next step ---------- */
    function drawOverview() {
      var hero = el("section", { class: "nthview-card nthview-hero", "aria-label": "About this comparison" });
      hero.appendChild(el("span", { class: "nthview-kicker", text: "Compare and contrast" }));
      if (data.focus) hero.appendChild(p(data.focus, "nthview-focus"));
      var names = el("div", { class: "nthview-names" });
      data.options.forEach(function (o, i) { if (i) names.appendChild(el("span", { class: "nthview-vs", "aria-hidden": "true", text: "vs" })); names.appendChild(nameTag(o.id)); });
      hero.appendChild(names);
      hero.appendChild(el("ul", { class: "nthview-meta", "aria-label": "At a glance" }, [
        el("li", {}, [icon("grid"), el("span", { text: data.dimensions.length + " criteria" })]),
        el("li", {}, [icon("target"), el("span", { text: N + " practice questions" })]),
        el("li", {}, [icon("clock"), el("span", { text: "About " + minutes + " minutes" })])
      ]));
      var started = Object.keys(state.revealed).length > 0 || answeredCount() > 0;
      var primary = started
        ? btn("Continue where you left off", "nthview-primary", function () { go(state.done ? "recap" : answeredCount() ? "practice" : "compare"); }, {}, "arrow")
        : btn("Predict, then compare the " + data.options.length, "nthview-primary", function () { state.cover = true; go("compare"); }, {}, "arrow");
      hero.appendChild(el("div", { class: "nthview-actions" }, [primary, btn(started ? "Read the comparison" : "Just read the comparison", "", function () { state.cover = false; go("compare"); })]));
      hero.appendChild(p("Guessing before you read makes it stick. You can switch between reading, predicting and practising at any time; your progress is saved in this browser.", "nthview-muted nthview-small"));
      panel.appendChild(hero);

      if (data.intro && data.intro.length) {
        panel.appendChild(h2("Why compare them"));
        var pr = el("div", { class: "nthview-prose" });
        data.intro.forEach(function (t) { pr.appendChild(p(t)); });
        panel.appendChild(pr);
      }
      panel.appendChild(h2("The options"));
      var g = el("div", { class: "nthview-grid" });
      data.options.forEach(function (o) {
        var c = el("article", { class: "nthview-card nthview-optcard " + oc(o.id) }, [el("h3", { text: o.name })]);
        if (o.aka) c.appendChild(el("p", { class: "nthview-aka", text: "Also called " + o.aka }));
        c.appendChild(p(o.summary));
        g.appendChild(c);
      });
      panel.appendChild(g);
      panel.appendChild(p("Compared on " + data.dimensions.map(function (d) { return d.name.toLowerCase(); }).join(", ") + ".", "nthview-muted nthview-small"));
      panel.lastChild.style.marginTop = "var(--s4)";
      if (data.sources && data.sources.length) {
        var det = el("details", { class: "nthview-details" }, [el("summary", { text: "Sources (" + data.sources.length + ")" })]);
        var ul = el("ul", { class: "nthview-sources" });
        data.sources.forEach(function (s) {
          var li = el("li");
          if (s.url) li.appendChild(el("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", text: s.label }));
          else li.textContent = s.label;
          ul.appendChild(li);
        });
        det.appendChild(ul); panel.appendChild(det);
      }
      nextBar("Next: compare them", "compare");
    }

    /* ---------- compare: two visible controls, the rest in View options ---------- */
    function autoLayout() { return container.clientWidth < 720 ? "dimension" : "table"; }
    function visibleOptions() { return data.options.filter(function (o) { return state.hidden.indexOf(o.id) === -1; }); }
    function visibleDims() {
      return data.dimensions.filter(function (d) { return state.filter === "all" || (state.filter === "diff" ? !d.alike : !!d.alike); });
    }
    function seg(label, items, current, onPick) {
      var s = el("div", { class: "nthview-seg", role: "group", "aria-label": label });
      items.forEach(function (it) {
        var b = el("button", { type: "button", "aria-pressed": it[0] === current ? "true" : "false", text: it[1] });
        b.addEventListener("click", function () { onPick(it[0], b); });
        s.appendChild(b);
      });
      return s;
    }
    function drawCompare() {
      var layout = state.layout || autoLayout();
      var bar = el("div", { class: "nthview-toolbar" });
      bar.appendChild(seg("Mode", [["read", "Read"], ["predict", "Predict"]], state.cover ? "predict" : "read", function (v) {
        state.cover = v === "predict"; redraw(".nthview-seg [aria-pressed=true]"); say(state.cover ? "Predict mode: cells are covered." : "Read mode: all cells shown.");
      }));
      var diff = el("button", { type: "button", class: "nthview-toggle", "aria-pressed": state.filter === "diff" ? "true" : "false" }, [el("i", { "aria-hidden": "true" }), el("span", { text: "Differences only" })]);
      diff.addEventListener("click", function () { state.filter = state.filter === "diff" ? "all" : "diff"; redraw(".nthview-toggle"); say(state.filter === "diff" ? "Showing only criteria where the options differ." : "Showing all criteria."); });
      bar.appendChild(diff);
      var more = btn("View options", "nthview-more-btn", function () { openViewSheet(); }, { "aria-haspopup": "dialog" });
      bar.appendChild(more);
      panel.appendChild(bar);

      var actives = [];
      if (state.filter === "alike") actives.push(["Shared criteria only", function () { state.filter = "all"; }]);
      if (state.hidden.length) actives.push(["Only " + visibleOptions().map(function (o) { return opt[o.id].short; }).join(" and "), function () { state.hidden = []; }]);
      if (state.layout) actives.push([{ table: "Table", dimension: "Cards by criterion", option: "Cards by option" }[state.layout], function () { state.layout = null; }]);
      if (actives.length) {
        var ac = el("div", { class: "nthview-active", role: "group", "aria-label": "Active view options" });
        actives.forEach(function (a) {
          var b = el("button", { type: "button", class: "nthview-chip", "aria-label": a[0] + ", remove" }, [el("span", { text: a[0] }), icon("cross")]);
          b.addEventListener("click", function () { a[1](); redraw(".nthview-more-btn"); });
          ac.appendChild(b);
        });
        panel.appendChild(ac);
      }

      if (state.cover) {
        var total = data.cells.length, n = Object.keys(state.revealed).length;
        var m = el("div", { class: "nthview-meter" }, [el("p", { text: n + " of " + total + " cells revealed" })]);
        m.appendChild(btn("Reveal all", "", function () { data.cells.forEach(function (c) { var k = c.option + "|" + c.dimension; if (!(k in state.revealed)) state.revealed[k] = "show"; }); redraw(".nthview-seg [aria-pressed=true]"); }));
        if (n) m.appendChild(btn("Cover again", "", function () { state.revealed = {}; redraw(".nthview-seg [aria-pressed=true]"); }));
        m.appendChild(el("div", { class: "nthview-bar", role: "progressbar", "aria-label": "Cells revealed", "aria-valuemin": "0", "aria-valuemax": String(total), "aria-valuenow": String(n) }, [el("i", { style: "width:" + Math.round(100 * n / total) + "%" })]));
        panel.appendChild(m);
        panel.appendChild(p("Select a covered cell, make your prediction, then see the answer and why.", "nthview-hint"));
      } else {
        panel.appendChild(p(layout === "table" ? "Select any cell for the detail and the evidence behind it." : "Each card compares the options on one criterion. Select a row for the detail behind it.", "nthview-hint"));
      }

      var opts = visibleOptions(), dims = visibleDims();
      if (!dims.length) panel.appendChild(el("p", { class: "nthview-empty", text: state.filter === "alike" ? "No criterion is marked as shared; every one shows a difference." : "Every criterion is shared." }));
      else if (layout === "table") drawTable(opts, dims);
      else if (layout === "dimension") drawByDimension(opts, dims);
      else drawByOption(opts, dims);
      nextBar("Next: when to choose which", "choose");
    }
    function openViewSheet() {
      openSheet(null, "View options", null, function (body) {
        function again(sel) { redraw(); openViewSheet(); var b = sheetOpen && sheetOpen.bg.querySelector(sel); if (b) b.focus(); }
        var lay = el("fieldset", { class: "nthview-fieldset" }, [el("legend", { text: "Layout" })]);
        lay.appendChild(seg("Layout", [["auto", "Auto"], ["table", "Table"], ["dimension", "By criterion"], ["option", "By option"]], state.layout || "auto", function (v) { state.layout = v === "auto" ? null : v; again('[aria-label="Layout"] [aria-pressed=true]'); }));
        lay.appendChild(p("Auto shows a table on wide screens and one card per criterion on phones.", "nthview-muted nthview-small"));
        body.appendChild(lay);
        var show = el("fieldset", { class: "nthview-fieldset" }, [el("legend", { text: "Criteria" })]);
        show.appendChild(seg("Criteria", [["all", "All"], ["diff", "Differences"], ["alike", "Shared"]], state.filter, function (v) { state.filter = v; again('[aria-label="Criteria"] [aria-pressed=true]'); }));
        body.appendChild(show);
        if (data.options.length > 2) {
          var fs = el("fieldset", { class: "nthview-fieldset" }, [el("legend", { text: "Options shown" })]);
          fs.appendChild(p("Hide one to compare a pair side by side.", "nthview-muted nthview-small"));
          var chips = el("div", { class: "nthview-chips" });
          data.options.forEach(function (o, i) {
            var on = state.hidden.indexOf(o.id) === -1;
            var b = el("button", { type: "button", class: "nthview-chip " + oc(o.id), "aria-pressed": on ? "true" : "false" }, [el("span", { text: opt[o.id].short })]);
            b.addEventListener("click", function () {
              if (on && visibleOptions().length <= 2) { say("At least two options stay in view."); return; }
              if (on) state.hidden.push(o.id); else state.hidden = state.hidden.filter(function (x) { return x !== o.id; });
              again(".nthview-fieldset:nth-of-type(3) .nthview-chip:nth-child(" + (i + 1) + ")");
            });
            chips.appendChild(b);
          });
          fs.appendChild(chips); body.appendChild(fs);
        }
        body.appendChild(btn("Done", "nthview-primary", closeSheet));
      }, panel.querySelector(".nthview-more-btn"));
    }
    function redraw(focusSel) {
      var y = root.scrollY; draw(false); persist(); root.scrollTo(0, y);
      if (focusSel) { var f = panel.querySelector(focusSel); if (f) f.focus({ preventScroll: true }); }
    }
    function isCovered(c) { return state.cover && !((c.option + "|" + c.dimension) in state.revealed); }
    var justRevealed = null;
    function cellButton(c) {
      var o = opt[c.option], d = dim[c.dimension], k = c.option + "|" + c.dimension, b;
      if (isCovered(c)) {
        b = el("button", { type: "button", class: "nthview-cell nthview-covered", "data-k": k, "aria-label": "Covered: " + o.o.name + ", " + d.name + ". Predict, then reveal." }, [el("span", { "aria-hidden": "true", text: "?" }), el("span", { text: "Predict" })]);
      } else {
        b = el("button", { type: "button", class: "nthview-cell" + (justRevealed === k ? " nthview-justrevealed" : ""), "data-k": k, "aria-label": o.o.name + ", " + d.name + ": " + (c.mark ? MARK_LABEL[c.mark] + ". " : "") + plain(c.text) + ". Open the detail." });
        var m = markBadge(c.mark); if (m) b.appendChild(m);
        b.appendChild(span(c.text, "nthview-ctxt"));
        b.appendChild(icon("chev", "nthview-chev"));
      }
      b.addEventListener("click", function () { openCell(c, b); });
      return b;
    }
    function drawTable(opts, dims) {
      var wrap = el("div", { class: "nthview-tablewrap", tabindex: "0", role: "region", "aria-label": "Comparison table" });
      var t = el("table", { class: "nthview-matrix" });
      t.appendChild(el("caption", { class: "nthview-sr", text: data.title }));
      var hr = el("tr", {}, [el("th", { scope: "col", text: "Criterion" })]);
      opts.forEach(function (o) { hr.appendChild(el("th", { scope: "col", class: oc(o.id) }, [el("span", {}, [el("span", { class: "nthview-dot", "aria-hidden": "true" }), el("span", { text: o.name })])])); });
      t.appendChild(el("thead", {}, [hr]));
      var tb = el("tbody");
      dims.forEach(function (d) {
        var th = el("th", { scope: "row" }, [el("span", { text: d.name })]);
        if (d.why) th.appendChild(el("small", { text: d.why }));
        if (d.alike) th.appendChild(el("span", { class: "nthview-pill nthview-alike", text: "Alike" }));
        var tr = el("tr", d.alike ? { class: "nthview-alikerow" } : {}, [th]);
        opts.forEach(function (o) { tr.appendChild(el("td", {}, [cellButton(cell[o.id + "|" + d.id])])); });
        tb.appendChild(tr);
      });
      t.appendChild(tb); wrap.appendChild(t); panel.appendChild(wrap);
      var takes = dims.filter(function (d) { return d.takeaway; });
      if (takes.length && !state.cover) { panel.appendChild(h2("In short, criterion by criterion")); panel.appendChild(critList(takes)); }
    }
    function drawByDimension(opts, dims) {
      var st = el("div", { class: "nthview-stack" });
      dims.forEach(function (d) {
        var c = el("section", { class: "nthview-card", "aria-label": d.name });
        var h = el("div", { class: "nthview-dimhead" }, [el("h3", { text: d.name })]);
        if (d.alike) h.appendChild(el("span", { class: "nthview-pill nthview-alike", text: "Alike" }));
        h.appendChild(el("span", { class: "nthview-num", text: (dimIndex[d.id] + 1) + " of " + data.dimensions.length }));
        c.appendChild(h);
        if (d.why) c.appendChild(p(d.why, "nthview-why"));
        var ul = el("ul", { class: "nthview-rows" });
        opts.forEach(function (o) {
          ul.appendChild(el("li", { class: "nthview-row " + oc(o.id) }, [el("span", { class: "nthview-rowname", text: opt[o.id].short }), cellButton(cell[o.id + "|" + d.id])]));
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
    function critList(dims) {
      var dl = el("dl", { class: "nthview-crit" });
      dims.forEach(function (d) { var dd = el("dd"); dd.appendChild(rich(d.takeaway)); dl.appendChild(el("div", {}, [el("dt", { text: d.name + (d.alike ? " (alike)" : "") }), dd])); });
      return dl;
    }

    /* ---------- sheet: cell detail, predict then reveal, view options, question list ---------- */
    var sheetOpen = null;
    function openSheet(colourCls, title, kicker, build, returnTo) {
      if (sheetOpen) { if (sheetOpen.bg.parentNode) sheetOpen.bg.parentNode.removeChild(sheetOpen.bg); returnTo = returnTo || sheetOpen.returnTo; sheetOpen = null; }
      var titleId = "nthview-sheet-title";
      var box = el("div", { class: "nthview-sheet " + (colourCls || ""), role: "dialog", "aria-modal": "true", "aria-labelledby": titleId });
      var close = el("button", { type: "button", class: "nthview-close", "aria-label": "Close" }, [icon("cross")]);
      var ht = el("div", {}, kicker ? [el("small", { text: kicker })] : []);
      ht.appendChild(el("h2", { id: titleId, text: title }));
      box.appendChild(el("div", { class: "nthview-sheet-head" }, [ht, close]));
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
      var target = s.returnTo;
      if (target && !container.contains(target)) {
        var k = target.getAttribute && target.getAttribute("data-k");
        target = k ? panel.querySelector('[data-k="' + k + '"]') : target.className && panel.querySelector("." + String(target.className).split(" ").pop());
      }
      if (target && target.focus) target.focus();
    }
    function openCell(c, from) {
      var k = c.option + "|" + c.dimension, d = dim[c.dimension], o = opt[c.option].o;
      openSheet(oc(c.option), d.name, o.name, function (body) {
        if (isCovered(c)) {
          var sc = scaleOf(c.dimension);
          if (d.why) body.appendChild(p(d.why, "nthview-muted nthview-small"));
          body.appendChild(p(sc ? "What is your prediction?" : "Say your answer to yourself, then reveal it."));
          if (sc) {
            var row = el("div", { class: "nthview-predict", role: "group", "aria-label": "Your prediction" });
            sc.concat(["na"]).forEach(function (m) {
              if (m === "na" && !data.cells.some(function (x) { return x.dimension === c.dimension && x.mark === "na"; })) return;
              var b = btn(MARK_LABEL[m], "", function () { reveal(m); });
              b.insertBefore(markIcon(m), b.firstChild);
              row.appendChild(b);
            });
            body.appendChild(row);
          }
          body.appendChild(el("div", { class: "nthview-actions", style: "margin-top:var(--s2)" }, [btn(sc ? "Not sure, show me" : "Reveal", sc ? "" : "nthview-primary", function () { reveal("?"); })]));
        } else showCell(body, c, state.revealed[k]);
        function reveal(pred) {
          state.revealed[k] = pred; justRevealed = k; persist();
          body.innerHTML = ""; showCell(body, c, pred);
          refreshBehind();
          var f = body.querySelector(".nthview-primary") || body.querySelector("button"); if (f) f.focus();
          var v = body.querySelector(".nthview-verdict"); say((v ? v.textContent + " " : "") + o.name + ", " + d.name + ": " + plain(c.text));
        }
      }, from);
    }
    function showCell(body, c, pred) {
      var d = dim[c.dimension];
      if (pred && pred !== "show" && pred !== "?" && c.mark) {
        var ok = pred === c.mark;
        body.appendChild(el("p", { class: "nthview-verdict " + (ok ? "nthview-v-ok" : "nthview-v-bad") }, [icon(ok ? "check" : "cross"), el("span", { text: ok ? "Your prediction matched." : "You predicted " + MARK_LABEL[pred] + "." })]));
      } else if (pred === "?") body.appendChild(el("p", { class: "nthview-verdict nthview-v-meh", text: "Here it is. Try predicting the next one." }));
      var m = markBadge(c.mark); if (m) body.appendChild(m);
      body.appendChild(p(c.text, "nthview-celltext"));
      if (c.detail) body.appendChild(p(c.detail));
      if (d.takeaway) { var t = el("p", { class: "nthview-takeaway" }, [el("b", { text: "In short: " })]); t.appendChild(rich(d.takeaway)); body.appendChild(t); }
      var acts = el("div", { class: "nthview-actions" }), next = state.cover ? nextCovered(c) : null;
      if (next) acts.appendChild(btn("Next covered cell", "nthview-primary", function () { openCell(next, panel.querySelector('[data-k="' + next.option + "|" + next.dimension + '"]') || sheetOpen.returnTo); }, {}, "arrow"));
      acts.appendChild(btn("Close", next ? "" : "nthview-primary", closeSheet));
      body.appendChild(acts);
    }
    function nextCovered(after) {
      var list = [];
      visibleDims().forEach(function (d) { visibleOptions().forEach(function (o) { list.push(cell[o.id + "|" + d.id]); }); });
      var i = list.indexOf(after);
      for (var j = 1; j <= list.length; j++) { var c = list[(i + j) % list.length]; if (isCovered(c)) return c; }
      return null;
    }
    function refreshBehind() {
      if (state.tab !== "compare") return;
      var y = root.scrollY, keep = sheetOpen;
      if (keep && keep.bg.parentNode) keep.bg.parentNode.removeChild(keep.bg);
      draw(false); if (keep) container.appendChild(keep.bg); root.scrollTo(0, y);
      justRevealed = null;
      if (keep && keep.returnTo && keep.returnTo.getAttribute) { var k = keep.returnTo.getAttribute("data-k"); var nb = k && panel.querySelector('[data-k="' + k + '"]'); if (nb) keep.returnTo = nb; }
    }

    /* ---------- when to choose ---------- */
    function drawChoose() {
      panel.appendChild(h2("When to choose which"));
      panel.appendChild(p("Each situation names the option that fits it, and why. Practise has more of these, with the reasons the others fall short.", "nthview-lede"));
      var g = el("div", { class: "nthview-grid" });
      data.options.forEach(function (o) {
        var items = data.whenToChoose.filter(function (w) { return w.option === o.id; });
        if (!items.length) return;
        var c = el("section", { class: "nthview-card nthview-sitcard " + oc(o.id), "aria-label": "Choose " + article(o.name) }, [el("h3", {}, [el("span", { class: "nthview-dot", "aria-hidden": "true" }), el("span", { text: "Choose " + article(o.name) + " when" })])]);
        var ul = el("ul", { class: "nthview-sits" });
        items.forEach(function (w) { var li = el("li"); var b = el("b"); b.appendChild(rich(w.situation)); li.appendChild(b); if (w.why) li.appendChild(span(w.why)); ul.appendChild(li); });
        c.appendChild(ul); g.appendChild(c);
      });
      panel.appendChild(g);
      nextBar(state.done ? "Next: the recap" : answeredCount() ? "Continue practising" : "Next: practise telling them apart", state.done ? "recap" : "practice");
    }

    /* ---------- recap ---------- */
    function drawRecap() {
      panel.appendChild(h2("Recap"));
      if (data.bigIdea) { var b = el("section", { class: "nthview-card nthview-big", "aria-label": "The big idea" }, [el("span", { class: "nthview-kicker", text: "The big idea" })]); b.appendChild(p(data.bigIdea)); panel.appendChild(b); }
      var g = el("div", { class: "nthview-grid", style: "margin-top:var(--s4)" });
      if (data.similarities && data.similarities.length) g.appendChild(listCard("How they are alike", data.similarities, "alike"));
      if (data.differences && data.differences.length) g.appendChild(listCard("How they differ", data.differences, "diff"));
      if (g.childNodes.length) panel.appendChild(g);
      var takes = data.dimensions.filter(function (d) { return d.takeaway; });
      if (takes.length) { panel.appendChild(h2("Criterion by criterion")); panel.appendChild(critList(takes)); }
      if (data.misconceptions && data.misconceptions.length) {
        panel.appendChild(h2("Common mix-ups"));
        var mg = el("div", { class: "nthview-grid" });
        data.misconceptions.forEach(function (m) {
          var c = el("article", { class: "nthview-card nthview-myth" });
          c.appendChild(el("p", { class: "nthview-claim" }, [icon("cross"), el("span", {}, [el("span", { class: "nthview-sr", text: "Myth: " }), rich(m.claim)])]));
          c.appendChild(el("p", { class: "nthview-fact" }, [icon("check"), el("span", {}, [el("span", { class: "nthview-sr", text: "Fact: " }), rich(m.truth)])]));
          mg.appendChild(c);
        });
        panel.appendChild(mg);
      }
      if (state.done) nextBar("Review your practice", "practice");
      else nextBar(answeredCount() ? "Finish the practice" : "Test yourself", "practice");
    }
    function listCard(title, items, kind) {
      var c = el("section", { class: "nthview-card", "aria-label": title }, [el("h3", { class: "nthview-h3", text: title })]);
      var ul = el("ul", { class: "nthview-list" });
      items.forEach(function (t) { var li = el("li", {}, [icon(kind, "nthview-" + kind + "-ic")]); li.appendChild(rich(t)); ul.appendChild(li); });
      c.appendChild(ul); return c;
    }

    /* ---------- practice: question, check, feedback with why, continue ---------- */
    function isAnswered(q) {
      var a = state.answers[q.id];
      if (!a) return false;
      if (a.skipped) return true;
      if (q.kind === "explain") return !!a.shown;
      if (q.kind === "sort") return !!a.checked;
      return a.pick !== undefined && a.pick !== null;
    }
    function answeredCount() { return Q.filter(isAnswered).length; }
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
      var q = Q[state.q], i = state.q, n = answeredCount();
      var all = el("button", { type: "button", class: "nthview-link nthview-all", text: "All questions", "aria-haspopup": "dialog" });
      all.addEventListener("click", function () { openSheet(null, "All questions", answeredCount() + " of " + N + " answered", function (body) { body.appendChild(reviewList(Q, true)); }, all); });
      panel.appendChild(el("div", { class: "nthview-qtop" }, [
        el("span", { class: "nthview-qcount", text: "Question " + (i + 1) + " of " + N }),
        el("span", { class: "nthview-pill", text: KIND_LABEL[q.kind] }),
        all,
        el("div", { class: "nthview-bar", role: "progressbar", "aria-label": "Questions answered", "aria-valuemin": "0", "aria-valuemax": String(N), "aria-valuenow": String(n) }, [el("i", { style: "width:" + Math.round(100 * n / N) + "%" })])
      ]));
      var card = el("section", { class: "nthview-card nthview-qcard", "aria-label": "Question " + (i + 1) });
      ({ sort: qSort, cell: qCell, pick: qPick, choice: qChoice, explain: qExplain })[q.kind](card, q, state.answers[q.id] || {});
      panel.appendChild(card);
      var done = isAnswered(q) && !(state.answers[q.id] || {}).skipped;
      var foot = el("div", { class: "nthview-qfoot" });
      var prev = el("button", { type: "button", class: "nthview-link", text: "Previous question" });
      if (i === 0) prev.style.visibility = "hidden";
      prev.addEventListener("click", function () { state.q = i - 1; redrawQ(); });
      foot.appendChild(prev);
      if (!done) { var sk = el("button", { type: "button", class: "nthview-link", text: "Skip for now" }); sk.addEventListener("click", function () { state.answers[q.id] = { skipped: true }; advance(); }); foot.appendChild(sk); }
      else if (i < N - 1) { var nx = el("button", { type: "button", class: "nthview-link", text: "Next question" }); nx.addEventListener("click", advance); foot.appendChild(nx); }
      panel.appendChild(foot);
    }
    function advance() { state.q = Math.min(N, state.q + 1); redrawQ(); }
    function redrawQ() {
      closeSheet();
      draw(true); persist(); toPanelTop();
      var t = panel.querySelector(".nthview-qcard h2, .nthview-end h2");
      if (t) { t.setAttribute("tabindex", "-1"); t.focus({ preventScroll: true }); }
    }
    function answer(q, fields) {
      var a = state.answers[q.id] && !state.answers[q.id].skipped ? state.answers[q.id] : {};
      Object.keys(fields).forEach(function (k) { a[k] = fields[k]; });
      state.answers[q.id] = a; persist();
    }
    var justChecked = false;
    function afterCheck(msg) {
      justChecked = true; draw(false); justChecked = false;
      var c = panel.querySelector(".nthview-fb .nthview-primary"); if (c) c.focus();
      say(msg);
    }
    function qTitle(card, text) { var h = el("h2"); h.appendChild(rich(text)); card.appendChild(h); }
    function confirmRow(card, ready, onCheck, hint) {
      var row = el("div", { class: "nthview-confirm" }, [p(hint || "How sure are you? Confident mistakes get extra attention in your review.")]);
      var a1 = btn("Check, I'm sure", "nthview-primary", function () { onCheck(true); }), a2 = btn("Check, not sure", "", function () { onCheck(false); });
      if (!ready) { a1.setAttribute("disabled", "disabled"); a2.setAttribute("disabled", "disabled"); }
      row.appendChild(el("div", { class: "nthview-actions" }, [a1, a2]));
      card.appendChild(row);
    }
    function feedback(card, ok, sure, heading, nodes) {
      var fb = el("div", { class: "nthview-fb" + (justChecked ? " nthview-fb-in" : "") + (ok === true ? " nthview-fb-ok" : ok === false ? " nthview-fb-bad" : "") });
      fb.appendChild(el("div", { class: "nthview-fbhead" }, [el("span", { class: "nthview-fbicon", "aria-hidden": "true" }, [icon(ok === false ? "cross" : "check")]), el("h3", { text: heading })]));
      if (ok === false && sure === true) fb.appendChild(el("p", { class: "nthview-note" }, [el("b", { text: "You were sure. " }), doc.createTextNode("Confident mistakes are the ones feedback fixes best, so this one is on your review list.")]));
      if (ok === true && sure === false) fb.appendChild(el("p", { class: "nthview-note" }, [el("b", { text: "Right, though you were unsure. " }), doc.createTextNode("Read why, so next time you know.")]));
      nodes.forEach(function (n) { fb.appendChild(n); });
      fb.appendChild(el("div", { class: "nthview-actions" }, [btn(state.q === N - 1 ? "See your results" : "Continue", "nthview-primary", advance, {}, "arrow")]));
      card.appendChild(fb);
    }
    /* one list of choices: before checking, select one; after, select any to read why */
    function choiceList(card, q, a, items, rightIndex, whyOf) {
      var answered = a.pick !== undefined && a.pick !== null;
      var sel = answered ? null : a.sel;
      var list = el("div", { class: "nthview-choices", role: "group", "aria-label": answered ? "Choices; select one to read why" : "Choices" });
      items.forEach(function (it, j) {
        var cls = "nthview-choice" + (it.colour ? " " + it.colour : "");
        var keyNode = el("span", { class: "nthview-key", "aria-hidden": "true", text: String(j + 1) });
        if (answered && j === rightIndex) { cls += " nthview-right"; keyNode.textContent = ""; keyNode.appendChild(icon("check")); }
        else if (answered && it.value === a.pick) { cls += " nthview-wrong"; keyNode.textContent = ""; keyNode.appendChild(icon("cross")); }
        if (answered && a.viewing === it.value) cls += " nthview-viewing";
        var b = el("button", { type: "button", class: cls, "aria-pressed": (answered ? a.viewing : sel) === it.value ? "true" : "false" }, [keyNode]);
        var tx = el("span", { class: "nthview-ctext" }); tx.appendChild(rich(it.text));
        if (answered && it.owner) tx.appendChild(owner(it.owner));
        b.appendChild(tx);
        if (answered) b.setAttribute("aria-label", plain(it.text) + (j === rightIndex ? ", the right answer" : it.value === a.pick ? ", your answer" : "") + ". Show why.");
        b.addEventListener("click", function () {
          answer(q, answered ? { viewing: it.value } : { sel: it.value }); draw(false);
          var again = panel.querySelectorAll(".nthview-choice")[j]; if (again) again.focus();
          if (answered) say("Now explaining: " + plain(it.text));
        });
        list.appendChild(b);
      });
      card.appendChild(list);
      if (!answered) {
        confirmRow(card, sel !== undefined && sel !== null, function (sure) {
          answer(q, { pick: sel, sure: sure, viewing: sel }); delete state.answers[q.id].sel; persist();
          afterCheck(isRight(q, sel) ? "Right. " + plain(whyOf(rightIndex) || "") : "Not quite. The answer is " + plain(items[rightIndex].text) + ".");
        });
        return;
      }
      var ok = isRight(q, a.pick), view = a.viewing !== undefined ? a.viewing : a.pick;
      var vi = items.map(function (x) { return x.value; }).indexOf(view);
      var nodes = [];
      if (vi !== -1 && vi !== rightIndex) {
        var yours = el("p", {}, [el("b", { text: view === a.pick ? "Your answer: " : "About this choice: " })]); yours.appendChild(rich(items[vi].text)); nodes.push(yours);
        var w = whyOf(vi); if (w) nodes.push(p(w));
        var ans = el("p", {}, [el("b", { text: "The answer: " })]); ans.appendChild(rich(items[rightIndex].text)); nodes.push(ans);
      }
      var rw = whyOf(rightIndex); if (rw) nodes.push(p(rw));
      if (items.length > 2) nodes.push(p("Select any other choice above to read why it is right or wrong.", "nthview-muted nthview-small"));
      feedback(card, ok, a.sure, ok ? "Right" : "Not quite", nodes);
    }
    function qCell(card, q, a) {
      var o = opt[q.option].o, d = dim[q.dimension];
      card.appendChild(owner(q.option));
      qTitle(card, q.prompt || o.name + ": " + d.name.charAt(0).toLowerCase() + d.name.slice(1) + "?");
      if (d.why) card.appendChild(p(d.why, "nthview-why"));
      var order = shuffled(data.options.map(function (x) { return x.id; }), q.id);
      var items = order.map(function (id) { return { value: id, text: cell[id + "|" + q.dimension].text, owner: id }; });
      var c = cell[q.option + "|" + q.dimension];
      choiceList(card, q, a, items, order.indexOf(q.option), function (j) {
        if (j === order.indexOf(q.option)) return q.why || c.detail || d.takeaway || null;
        var oc2 = cell[order[j] + "|" + q.dimension];
        return "That is " + opt[order[j]].o.name + " on " + d.name.toLowerCase() + "." + (oc2.detail ? " " + oc2.detail : "");
      });
    }
    function qPick(card, q, a) {
      card.appendChild(el("span", { class: "nthview-kicker", text: "The situation" }));
      var s = el("div", { class: "nthview-situation" }); s.appendChild(rich(q.situation)); card.appendChild(s);
      qTitle(card, q.prompt || "Which would you choose?");
      var items = data.options.map(function (o) { return { value: o.id, text: o.name, colour: oc(o.id) }; });
      var ri = data.options.map(function (o) { return o.id; }).indexOf(q.answer);
      choiceList(card, q, a, items, ri, function (j) {
        if (j === ri) return q.why;
        return (q.notes && q.notes[data.options[j].id]) || null;
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
      card.appendChild(p("Select every option a statement is true of. Choose None if it fits none of them.", "nthview-why"));
      var sel = (a.sel || []).slice(), checked = !!a.checked;
      q.statements.forEach(function (s, i) {
        var mine = sel[i] || null;
        var ok = checked && sameSet(mine || [], s.answer);
        var box = el("div", { class: "nthview-stmt" + (checked ? (ok ? " nthview-right" : " nthview-wrong") : ""), role: "group", "aria-label": "Statement " + (i + 1) + (checked ? (ok ? ", right" : ", not quite") : "") });
        var pp = el("p"); pp.appendChild(rich(s.text)); box.appendChild(pp);
        var chips = el("div", { class: "nthview-chips" });
        data.options.forEach(function (o) {
          var on = !!mine && mine.indexOf(o.id) !== -1;
          var b = el("button", { type: "button", class: "nthview-chip " + oc(o.id), "aria-pressed": on ? "true" : "false" }, [el("span", { text: opt[o.id].short })]);
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
          var f = el("p", { class: "nthview-explain" }, [el("span", { class: "nthview-verd" }, [icon(ok ? "check" : "cross"), el("span", { text: ok ? "Right: " + ans + "." : "It is true of " + ans + "." })]), doc.createTextNode(" ")]);
          f.appendChild(rich(s.why)); box.appendChild(f);
        }
        card.appendChild(box);
      });
      function setSel(i, v, from) {
        sel[i] = v; answer(q, { sel: sel });
        var chipIndex = Array.prototype.indexOf.call(from.parentNode.children, from);
        draw(false);
        var nb = panel.querySelectorAll(".nthview-stmt")[i]; if (nb) { var c = nb.querySelectorAll(".nthview-chip")[chipIndex]; if (c) c.focus(); }
      }
      if (!checked) {
        var done = q.statements.filter(function (s, i) { return sel[i] !== null && sel[i] !== undefined; }).length;
        confirmRow(card, done === q.statements.length, function (sure) {
          answer(q, { checked: true, sure: sure });
          var n2 = q.statements.filter(function (s, i) { return sameSet(sel[i] || [], s.answer); }).length;
          afterCheck(n2 + " of " + q.statements.length + " sorted right.");
        }, done === q.statements.length ? null : done + " of " + q.statements.length + " sorted. Sort every statement to check.");
      } else {
        var n = q.statements.filter(function (s, i) { return sameSet(sel[i] || [], s.answer); }).length;
        feedback(card, n === q.statements.length, a.sure, n + " of " + q.statements.length + " sorted right", [p("Each statement above now says which options it is true of, and why.", "nthview-muted nthview-small")]);
      }
    }
    function qExplain(card, q, a) {
      qTitle(card, q.prompt);
      var id = "nthview-ex-" + q.id;
      card.appendChild(el("label", { for: id, class: "nthview-why", style: "display:block", text: "Write your answer first. Nobody grades it; putting it in your own words is the practice." }));
      var ta = el("textarea", { id: id, class: "nthview-textarea", maxlength: "2000" });
      ta.value = a.text || "";
      var t = null;
      ta.addEventListener("input", function () { clearTimeout(t); t = setTimeout(function () { answer(q, { text: ta.value }); }, 300); });
      ta.addEventListener("blur", function () { answer(q, { text: ta.value }); });
      card.appendChild(ta);
      if (!a.shown) {
        card.appendChild(el("div", { class: "nthview-actions" }, [btn("Compare with a model answer", "nthview-primary", function () {
          answer(q, { text: ta.value, shown: true, ticks: [] });
          draw(false); var f = panel.querySelector(".nthview-ticks input"); if (f) f.focus(); say("Model answer shown. Tick the points you covered.");
        })]));
        return;
      }
      var ul = el("ul", { class: "nthview-ticks" }), ticks = (a.ticks || []).slice();
      q.points.forEach(function (pt, j) {
        var cb = el("input", { type: "checkbox", id: id + "-" + j });
        cb.checked = ticks.indexOf(j) !== -1;
        cb.addEventListener("change", function () { ticks = ticks.filter(function (x) { return x !== j; }); if (cb.checked) ticks.push(j); answer(q, { ticks: ticks }); say(ticks.length + " of " + q.points.length + " points covered."); });
        var lab = el("label", { for: id + "-" + j }, [cb]); lab.appendChild(span(pt)); ul.appendChild(el("li", {}, [lab]));
      });
      feedback(card, null, null, "A model answer", [p(q.model), el("span", { class: "nthview-kicker", style: "margin-top:var(--s4)", text: "Tick the points your answer covered" }), ul]);
    }

    /* ---------- end of practice: the view's end (§5.5 rule 8) ---------- */
    function drawEnd() {
      state.done = true;
      var scored = Q.filter(function (q) { return q.kind !== "explain"; });
      var ok = scored.filter(function (q) { return result(q) === "ok"; }).length;
      var missed = scored.filter(function (q) { return result(q) === "bad"; });
      var skipped = Q.filter(function (q) { return (state.answers[q.id] || {}).skipped; }).length;
      var confident = missed.filter(function (q) { return state.answers[q.id].sure === true; });
      var wrap = el("div", { class: "nthview-end nthview-stack" });
      var top = el("section", { class: "nthview-card nthview-hero", "aria-label": "Your results" }, [el("span", { class: "nthview-kicker", text: "Practice complete" }), el("h2", { text: "You have compared them from every side", style: "font-size:var(--t-xl)" })]);
      if (scored.length) top.appendChild(el("div", { class: "nthview-score" }, [el("b", { text: ok + "/" + scored.length }), el("span", { class: "nthview-muted", text: "right first time" })]));
      top.appendChild(el("div", { class: "nthview-tally" }, [tally(ok, "right"), tally(missed.length, "to revisit"), tally(skipped, "skipped")]));
      top.appendChild(p("Nothing here is graded against you. The list below shows where the options still blur.", "nthview-muted nthview-small"));
      wrap.appendChild(top);
      if (data.bigIdea) { var b = el("section", { class: "nthview-card nthview-big", "aria-label": "The big idea" }, [el("span", { class: "nthview-kicker", text: "The big idea" })]); b.appendChild(p(data.bigIdea)); wrap.appendChild(b); }
      var revisit = confident.concat(missed.filter(function (q) { return confident.indexOf(q) === -1; }));
      if (revisit.length) {
        var cc = el("section", { class: "nthview-card" }, [el("h3", { class: "nthview-h3", text: "Revisit these first" }), p(confident.length ? "Confident mistakes come first: you were sure, and it was not so." : "Open each one to read why again.", "nthview-muted nthview-small")]);
        cc.appendChild(reviewList(revisit)); wrap.appendChild(cc);
      }
      var all = el("details", { class: "nthview-card" }, [el("summary", { class: "nthview-h3", style: "cursor:pointer;min-height:44px;display:flex;align-items:center;margin:0", text: "Show every question (" + N + ")" })]);
      all.appendChild(reviewList(Q)); wrap.appendChild(all);
      wrap.appendChild(el("div", { class: "nthview-actions" }, [
        btn("Read the recap", "nthview-primary", function () { go("recap"); }, {}, "arrow"),
        btn("Practise again", "", function () {
          clearState(key);
          state.answers = {}; state.q = 0; state.done = false; redrawQ();
        })
      ]));
      panel.appendChild(wrap);
    }
    function tally(n, label) { return el("div", {}, [el("b", { text: String(n) }), el("span", { text: label })]); }
    function reviewList(qs, current) {
      var ul = el("ul", { class: "nthview-qlist" });
      qs.forEach(function (q) {
        var j = Q.indexOf(q), r = result(q), a = state.answers[q.id];
        var now = current && j === state.q;
        var label = now ? "Current" : r === "ok" ? "Right" : r === "bad" ? (a.sure ? "Sure, missed" : "Missed") : r === "seen" ? "Done" : a && a.skipped ? "Skipped" : "Open";
        var b = el("button", { type: "button" }, [el("span", { class: "nthview-badge" + (now ? " nthview-b-now" : r === "ok" ? " nthview-b-ok" : r === "bad" ? " nthview-b-bad" : ""), text: label }), el("span", { text: (j + 1) + ". " + shortTitle(q) })]);
        if (now) b.setAttribute("aria-current", "step");
        b.addEventListener("click", function () { state.q = j; redrawQ(); });
        ul.appendChild(el("li", {}, [b]));
      });
      return ul;
    }
    function shortTitle(q) {
      var t = plain(q.kind === "pick" ? q.situation : q.kind === "cell" ? (q.prompt || opt[q.option].o.name + ": " + dim[q.dimension].name + "?") : (q.prompt || KIND_LABEL[q.kind]));
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
      if (saved.seen && typeof saved.seen === "object") TABS.forEach(function (t) { if (saved.seen[t.id] === true) state.seen[t.id] = true; });
      state.done = saved.done === true;
      var lbl = TABS.filter(function (t) { return t.id === state.tab; })[0].long;
      resumeText = "Welcome back, continuing in " + (state.tab === "practice" ? (state.q < N ? "Practise at question " + (state.q + 1) + " of " + N : "your practice results") : lbl) + ".";
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

    go(state.tab, { initial: true }); /* opening saves nothing; the first action does */
    if (resumeText) {
      var n = el("div", { class: "nthview-resume", role: "status" }, [icon("info"), el("span", { text: resumeText })]);
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
