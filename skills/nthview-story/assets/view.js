/* NthView — story renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first, and three.js r128 (see NthView.libs).
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
    ".nthview-story{--nv-bg:#fbf8f3;--nv-fg:#1d1b26;--nv-muted:#5d5a6b;--nv-accent:#6a4dd6;--nv-on-accent:#fff;--nv-border:#e2dcd2;--nv-card:#fff;--nv-soft:#f2ede5;--nv-good:#2b8a57;--nv-bad:#c4413a;max-width:78rem;font-family:'Atkinson Hyperlegible',system-ui,-apple-system,Segoe UI,Roboto,sans-serif}",
    "@media (prefers-color-scheme:dark){.nthview-story{--nv-bg:#13121a;--nv-fg:#ecebf4;--nv-muted:#aaa7ba;--nv-accent:#a892ff;--nv-on-accent:#15111f;--nv-border:#2d2b3a;--nv-card:#1d1c28;--nv-soft:#262534;--nv-good:#5fc48a;--nv-bad:#f07a70}}",
    ".nthview-story .nthview-head{margin:.1rem auto .7rem}",
    ".nthview-story .nthview-title{font:600 clamp(1.35rem,2.6vw,2rem)/1.15 Fredoka,'Atkinson Hyperlegible',system-ui,sans-serif;margin:0}",
    ".nthview-story .nthview-sub{margin:.25rem 0 0;color:var(--nv-muted)}",
    ".nthview-player{position:relative;margin:0 auto}",
    ".nthview-stage{position:relative;width:100%;background:#16142a;border-radius:14px;overflow:hidden;--u:5px;box-shadow:0 10px 30px rgba(20,16,40,.18);touch-action:manipulation;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}",
    ".nthview-stage canvas{position:absolute;inset:0;width:100%;height:100%;display:block}",
    ".nthview-layer{position:absolute;inset:0;pointer-events:none;overflow:hidden}",
    ".nthview-tag,.nthview-bubble,.nthview-win,.nthview-x,.nthview-lk{position:absolute;left:0;top:0;will-change:transform}",
    ".nthview-tag{background:rgba(255,255,255,.95);color:#1d1b26;border-radius:999px;padding:.12em .7em .18em;font:600 clamp(12.5px,calc(var(--u)*3),19px)/1.15 Fredoka,system-ui,sans-serif;white-space:nowrap;text-align:center;border:2px solid var(--c,#6a4dd6);box-shadow:0 2px 6px rgba(0,0,0,.18);transition:opacity .25s}",
    ".nthview-tag small{display:block;font:400 .74em/1.15 'Atkinson Hyperlegible',system-ui,sans-serif;color:#4a4757}",
    ".nthview-tag.is-dim{opacity:.7;font-size:clamp(11.5px,calc(var(--u)*2.4),16px)}",
    ".nthview-tag.is-dim small,.nthview-compact .nthview-tag small{display:none}",
    ".nthview-tag.is-focus{box-shadow:0 0 0 3px rgba(255,255,255,.7),0 3px 10px rgba(0,0,0,.25)}",
    ".nthview-tag.is-prop{border-radius:8px;border-style:dashed;font-size:clamp(11.5px,calc(var(--u)*2.6),17px)}",
    ".nthview-tag.is-place{background:rgba(29,27,38,.82);color:#fff;border:0;border-radius:6px;font-size:clamp(11.5px,calc(var(--u)*2.5),16px)}",
    ".nthview-val{display:block;font:700 1.2em/1.15 ui-monospace,SFMono-Regular,Menlo,monospace}",
    ".nthview-mark{display:inline-block;margin:.25em 0 .1em;padding:.05em .45em;border:2px solid currentColor;border-radius:4px;font:800 .9em/1.15 system-ui,sans-serif;letter-spacing:.06em;transform:rotate(-6deg);color:#c4413a}",
    ".nthview-mark.is-good{color:#2b8a57}.nthview-mark.is-info{color:#2d6cd0}",
    ".nthview-bubble{max-width:min(40%,24em);background:#fff;color:#1d1b26;border-radius:16px;padding:.4em .8em .5em;font:400 clamp(14px,calc(var(--u)*3.6),25px)/1.3 'Atkinson Hyperlegible',system-ui,sans-serif;box-shadow:0 4px 14px rgba(0,0,0,.24);border:2px solid var(--c,#6a4dd6);transition:opacity .3s}",
    ".nthview-bubble b{display:block;font:600 .74em/1.2 Fredoka,system-ui,sans-serif;color:#4a4757}",
    ".nthview-bubble::after{content:'';position:absolute;left:var(--tail,50%);bottom:-9px;margin-left:-9px;border:9px solid transparent;border-top-color:#fff;border-bottom:0}",
    ".nthview-bubble.is-old{opacity:.5}",
    ".nthview-win{width:min(38%,28em);background:#fffdf7;color:#1d1b26;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.28);overflow:hidden;font:400 clamp(13px,calc(var(--u)*3.2),21px)/1.35 'Atkinson Hyperlegible',system-ui,sans-serif;border:2px solid #d8d2c4;transition:opacity .35s,box-shadow .3s}",
    ".nthview-win header{background:#efe9dc;padding:.3em .7em;font:600 .8em/1.25 Fredoka,system-ui,sans-serif;display:flex;gap:.45em;align-items:center}",
    ".nthview-win header i{width:.6em;height:.6em;border-radius:50%;background:#e2574c;flex:none}.nthview-win header i+i{background:#e8b83a}.nthview-win header i+i+i{background:#3fae6a}",
    ".nthview-win header span{margin-left:auto;opacity:.7;font-weight:400}",
    ".nthview-wbody{padding:.5em .8em .65em}",
    ".nthview-win.is-code{background:#1c1b29;color:#e8e6f5;border-color:#34324a}.nthview-win.is-code header{background:#2a2840;color:#cfcbe8}",
    ".nthview-win pre{margin:0;font:400 clamp(11.5px,calc(var(--u)*2.7),17px)/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre;overflow:hidden}",
    ".nthview-win pre span{display:block;padding:0 .3em;border-radius:3px}",
    ".nthview-win pre span.is-hl{background:rgba(255,214,102,.2);box-shadow:inset 3px 0 0 #ffd666}",
    ".nthview-win.is-number .nthview-wbody{font:700 clamp(22px,calc(var(--u)*9),64px)/1.05 Fredoka,system-ui,sans-serif;text-align:center}",
    ".nthview-win.is-formula .nthview-wbody{font:italic 400 clamp(15px,calc(var(--u)*4.2),30px)/1.3 'Cambria Math',Cambria,'Times New Roman',serif;text-align:center}",
    ".nthview-win.is-focus{box-shadow:0 0 0 4px #ffd666,0 10px 30px rgba(0,0,0,.35)}",
    ".nthview-x{font:800 clamp(28px,calc(var(--u)*12),90px)/1 system-ui,sans-serif;color:#e2483d;text-shadow:0 2px 0 #fff,0 0 14px rgba(255,255,255,.75)}",
    ".nthview-lk{background:#fff;color:#1d1b26;border:2px solid var(--c);border-radius:999px;padding:.1em .6em;font:600 clamp(11.5px,calc(var(--u)*2.6),16px)/1.2 Fredoka,system-ui,sans-serif;white-space:nowrap}",
    ".nthview-cap{position:absolute;left:50%;bottom:calc(var(--u)*3.5);transform:translateX(-50%);width:min(88%,46em);background:rgba(16,14,28,.86);color:#fff;border-radius:12px;padding:.45em .9em .55em;font:400 clamp(16px,calc(var(--u)*4.3),30px)/1.32 'Atkinson Hyperlegible',system-ui,sans-serif;text-align:center;transition:opacity .3s,bottom .25s;text-wrap:balance}",
    ".nthview-cap:empty{opacity:0}",
    ".nthview-spot{position:absolute;inset:0;pointer-events:none;transition:opacity .7s;opacity:0;background:radial-gradient(circle at var(--sx,50%) var(--sy,50%),rgba(0,0,0,0) 0,rgba(0,0,0,0) var(--sr,120px),rgba(12,10,28,.42) calc(var(--sr,120px) * 1.9))}",
    ".nthview-spot.is-on{opacity:1}",
    ".nthview-chip{position:absolute;top:calc(var(--u)*3);left:calc(var(--u)*3);display:flex;align-items:center;gap:.5em;background:rgba(255,255,255,.95);color:#1d1b26;border-radius:999px;padding:.3em .85em .3em .55em;font:600 clamp(12px,calc(var(--u)*2.9),19px)/1.2 Fredoka,system-ui,sans-serif;box-shadow:0 3px 10px rgba(0,0,0,.2);transition:opacity .4s,transform .4s;opacity:0;transform:translateY(-8px);max-width:46%}",
    ".nthview-chip.is-on{opacity:1;transform:none}",
    ".nthview-chip svg{width:1.2em;height:1.2em;flex:none}",
    ".nthview-meet{left:auto;right:calc(var(--u)*3);flex-direction:column;align-items:stretch;border-radius:14px;padding:.35em .7em .4em .45em;gap:.3em}",
    ".nthview-meet div{display:flex;align-items:center;gap:.5em}",
    ".nthview-meet img{width:2.6em;height:2.6em;border-radius:50%;background:#efe9ff;flex:none}",
    ".nthview-meet small{display:block;font:400 .8em/1.15 'Atkinson Hyperlegible',system-ui,sans-serif;color:#4a4757}",
    ".nthview-tcard{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;text-align:center;background:radial-gradient(ellipse at center,rgba(16,14,28,.62),rgba(16,14,28,0) 72%);opacity:0;transition:opacity .5s;pointer-events:none;padding:0 8%}",
    ".nthview-tcard.is-on{opacity:1}",
    ".nthview-tcard span{font:600 clamp(12px,calc(var(--u)*3),20px)/1 Fredoka,system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase}",
    ".nthview-tcard strong{font:600 clamp(22px,calc(var(--u)*8),60px)/1.1 Fredoka,system-ui,sans-serif;text-shadow:0 3px 16px rgba(0,0,0,.45);margin-top:.2em}",
    ".nthview-bigplay{position:absolute;left:50%;top:46%;transform:translate(-50%,-50%);width:clamp(56px,calc(var(--u)*17),104px);height:clamp(56px,calc(var(--u)*17),104px);border-radius:50%;border:0;background:rgba(16,14,28,.74);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35)}",
    ".nthview-bigplay svg{width:44%;height:44%}",
    ".nthview-bigplay[hidden]{display:none}",
    ".nthview-ov{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:calc(var(--u)*4);background:rgba(16,14,28,.4);z-index:2}",
    ".nthview-ov[hidden]{display:none}",
    ".nthview-card{background:var(--nv-card);color:var(--nv-fg);border-radius:18px;max-width:42rem;width:100%;max-height:100%;overflow:auto;padding:clamp(.9rem,3vw,1.6rem);box-shadow:0 18px 50px rgba(0,0,0,.35);font-size:clamp(14px,calc(var(--u)*3.1),18px);line-height:1.5}",
    ".nthview-below .nthview-ov{position:static;background:none;padding:0;display:block}",
    ".nthview-below .nthview-card{box-shadow:none;border:1px solid var(--nv-border);max-height:none;font-size:1rem}",
    ".nthview-kicker{font:600 .78em/1.25 Fredoka,system-ui,sans-serif;letter-spacing:.09em;text-transform:uppercase;color:var(--nv-accent);margin:0 0 .35em}",
    ".nthview-card h2{font:600 1.5em/1.15 Fredoka,system-ui,sans-serif;margin:0 0 .35em}",
    ".nthview-card h3{font:600 1.05em/1.2 Fredoka,system-ui,sans-serif;margin:.9em 0 .3em}",
    ".nthview-card p{margin:.3em 0 .6em}",
    ".nthview-points{margin:.3em 0 .6em;padding-left:1.3em}.nthview-points li{margin:.3em 0}",
    ".nthview-card details{margin:.6em 0;border-top:1px solid var(--nv-border);padding-top:.5em}",
    ".nthview-card summary{cursor:pointer;font:600 1em/1.4 Fredoka,system-ui,sans-serif;min-height:32px}",
    ".nthview-card a{color:var(--nv-accent)}",
    ".nthview-row{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:.9rem;align-items:center}",
    ".nthview-cta,.nthview-ghost{font:600 1rem/1.1 Fredoka,system-ui,sans-serif;border-radius:999px;padding:.65em 1.15em;cursor:pointer;display:inline-flex;align-items:center;gap:.5em;min-height:44px}",
    ".nthview-cta{background:var(--nv-accent);color:var(--nv-on-accent);border:2px solid var(--nv-accent)}",
    ".nthview-ghost{background:transparent;color:var(--nv-fg);border:2px solid var(--nv-border)}",
    ".nthview-cta svg,.nthview-ghost svg{width:1.15em;height:1.15em;flex:none}",
    ".nthview-hint{color:var(--nv-muted);font-size:.86em;margin:.8em 0 0}",
    ".nthview-think{display:flex;gap:1rem;align-items:center;background:var(--nv-soft);border-radius:14px;padding:.8rem 1rem;margin:.4rem 0 .5rem}",
    ".nthview-think p{margin:0;font-size:1.08em}",
    ".nthview-think b{display:block;font:600 .82em/1.3 Fredoka,system-ui,sans-serif;color:var(--nv-accent);letter-spacing:.06em;text-transform:uppercase}",
    ".nthview-ring{flex:none;width:3em;height:3em}",
    ".nthview-ring circle{fill:none;stroke-width:4}",
    ".nthview-bar{display:flex;align-items:center;gap:.35rem;flex-wrap:wrap;padding:.5rem 0 0;color:var(--nv-fg);transition:opacity .3s}",
    ".nthview-btn{flex:none;min-width:44px;height:44px;border-radius:12px;border:1px solid var(--nv-border);background:var(--nv-card);color:var(--nv-fg);display:inline-flex;align-items:center;justify-content:center;gap:.35em;cursor:pointer;padding:0 .55rem;font:600 .9rem/1 Fredoka,system-ui,sans-serif}",
    ".nthview-btn svg{width:22px;height:22px;flex:none}",
    ".nthview-btn[aria-pressed=true],.nthview-btn.is-main{background:var(--nv-accent);color:var(--nv-on-accent);border-color:var(--nv-accent)}",
    ".nthview-btn .nthview-hl{display:none}",
    ".nthview-scrub{flex:1 1 10rem;min-width:7rem;height:44px;position:relative;display:flex;align-items:center;cursor:pointer;touch-action:none;border-radius:8px}",
    ".nthview-track{position:relative;display:flex;gap:2px;width:100%;height:8px}",
    ".nthview-seg{position:relative;height:100%;background:var(--nv-border);border-radius:2px;overflow:hidden;min-width:2px}",
    ".nthview-seg.is-ch{margin-left:6px}",
    ".nthview-seg i{position:absolute;left:0;top:0;bottom:0;width:0;background:var(--nv-accent)}",
    ".nthview-knob{position:absolute;top:50%;left:0;width:16px;height:16px;margin:-8px 0 0 -8px;border-radius:50%;background:var(--nv-accent);box-shadow:0 0 0 3px var(--nv-card);pointer-events:none}",
    ".nthview-chn{position:absolute;top:1px;font:600 10px/1 Fredoka,system-ui,sans-serif;color:var(--nv-muted)}",
    ".nthview-tip{position:absolute;bottom:100%;transform:translateX(-50%);background:var(--nv-fg);color:var(--nv-bg);font-size:.8rem;line-height:1.3;padding:.35em .6em;border-radius:8px;width:max-content;max-width:16rem;pointer-events:none;z-index:3}",
    ".nthview-tip[hidden]{display:none}",
    ".nthview-pos{font:600 .82rem/1.2 Fredoka,system-ui,sans-serif;color:var(--nv-muted);text-align:center;white-space:nowrap}",
    ".nthview-narrow .nthview-scrub{flex-basis:100%;order:-1}",
    ".nthview-narrow .nthview-pos{display:none}",
    ".nthview-below{margin-top:.6rem}.nthview-below[hidden]{display:none}",
    ".nthview-bcap{font-size:1.1rem;line-height:1.45;background:var(--nv-soft);border-radius:12px;padding:.65rem .9rem;margin:0 0 .5rem}",
    ".nthview-bcap:empty{display:none}",
    ".nthview-blines{margin:0 0 .5rem;padding:0;list-style:none}",
    ".nthview-blines li{border-left:4px solid var(--c);padding:.3rem .65rem;margin:.3rem 0;background:var(--nv-card);border-radius:0 10px 10px 0}",
    ".nthview-blines b{font:600 .85rem/1.2 Fredoka,system-ui,sans-serif;margin-right:.4em}",
    ".nthview-below .nthview-win{position:static;width:auto;transform:none!important;margin:.5rem 0;opacity:1!important}",
    ".nthview-fsnote{display:flex;gap:.5rem;align-items:center;margin:.5rem 0 0}",
    ".nthview-dlg{position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;background:rgba(10,8,22,.55);padding:max(.75rem,env(safe-area-inset-top)) .75rem}",
    ".nthview-dlg[hidden]{display:none}",
    ".nthview-dlgbox{background:var(--nv-card);color:var(--nv-fg);border-radius:18px;width:min(46rem,100%);max-height:100%;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.4)}",
    ".nthview-dlghead{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.6rem .6rem .5rem 1.1rem;border-bottom:1px solid var(--nv-border)}",
    ".nthview-dlghead h2{margin:0;font:600 1.2rem/1.2 Fredoka,system-ui,sans-serif}",
    ".nthview-dlgbody{overflow:auto;padding:.9rem 1.1rem 1.1rem}",
    ".nthview-dlgbody h3{font:600 1rem/1.2 Fredoka,system-ui,sans-serif;margin:.4rem 0 .5rem;color:var(--nv-muted);letter-spacing:.05em;text-transform:uppercase}",
    ".nthview-cast{display:grid;grid-template-columns:repeat(auto-fill,minmax(15.5rem,1fr));gap:.55rem;margin:0 0 1rem;padding:0;list-style:none}",
    ".nthview-cast li{display:flex;gap:.7rem;align-items:flex-start;background:var(--nv-soft);border-radius:12px;padding:.55rem;border-left:5px solid var(--c)}",
    ".nthview-cast img,.nthview-ico{width:64px;height:64px;flex:none;border-radius:12px;background:#e9e4f7}",
    ".nthview-ico{display:flex;align-items:center;justify-content:center;font:700 1.05rem/1 ui-monospace,monospace;color:#3b3550}",
    ".nthview-cast b{display:block;font:600 1.02rem/1.2 Fredoka,system-ui,sans-serif}",
    ".nthview-cast small{display:block;color:var(--nv-muted);margin:.1em 0 .25em}",
    ".nthview-cast p{margin:0;font-size:.95rem;line-height:1.4}",
    ".nthview-chlist{list-style:none;margin:0;padding:0}",
    ".nthview-chlist>li{border:1px solid var(--nv-border);border-radius:12px;margin:0 0 .5rem;overflow:hidden}",
    ".nthview-chhead{display:flex;align-items:center;gap:.6rem;padding:.5rem .7rem;background:var(--nv-soft);font:600 1rem/1.3 Fredoka,system-ui,sans-serif}",
    ".nthview-chhead span{margin-left:auto;color:var(--nv-muted);font:400 .85rem/1.2 'Atkinson Hyperlegible',system-ui,sans-serif;white-space:nowrap}",
    ".nthview-beats{list-style:none;margin:0;padding:.25rem .4rem .45rem}",
    ".nthview-beats button{display:flex;gap:.5em;width:100%;text-align:left;padding:.4rem .5rem;border:0;border-radius:8px;background:none;color:inherit;font:inherit;line-height:1.4;cursor:pointer;min-height:40px}",
    ".nthview-beats button:hover{background:var(--nv-soft)}",
    ".nthview-beats button[aria-current=step]{box-shadow:inset 4px 0 0 var(--nv-accent);font-weight:700;background:var(--nv-soft)}",
    ".nthview-beats em{font:600 .8rem/1.6 Fredoka,system-ui,sans-serif;color:var(--nv-muted);font-style:normal;min-width:1.6em}",
    ".nthview-tick{color:var(--nv-good);font-weight:700}",
    ".nthview-set fieldset{border:1px solid var(--nv-border);border-radius:12px;margin:0 0 .8rem;padding:.4rem .8rem .6rem}",
    ".nthview-set legend{font:600 .95rem/1.2 Fredoka,system-ui,sans-serif;padding:0 .3rem}",
    ".nthview-set label{display:flex;gap:.55rem;align-items:flex-start;padding:.3rem 0;cursor:pointer;line-height:1.35}",
    ".nthview-set label small{display:block;color:var(--nv-muted)}",
    ".nthview-set input{width:1.15rem;height:1.15rem;margin:.12rem 0 0;accent-color:var(--nv-accent);flex:none}",
    ".nthview-keys{display:grid;grid-template-columns:max-content 1fr;gap:.35rem .9rem;margin:0}",
    ".nthview-keys dt{text-align:right}.nthview-keys dd{margin:0}",
    ".nthview-keys kbd{font:600 .82rem/1 ui-monospace,monospace;border:1px solid var(--nv-border);border-bottom-width:3px;border-radius:6px;padding:.2em .45em;background:var(--nv-soft)}",
    ".nthview-resume{position:absolute;top:calc(var(--u)*3);left:50%;transform:translateX(-50%);background:rgba(16,14,28,.9);color:#fff;border-radius:999px;padding:.45em 1em;font-size:clamp(12px,calc(var(--u)*2.8),17px);z-index:3;pointer-events:none;transition:opacity .6s;white-space:nowrap;max-width:94%;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-resume.is-gone{opacity:0}",
    ".nthview-rotate{display:flex;gap:.7em;align-items:center;margin:.9rem auto 0;background:#fff;color:#1d1b26;border-radius:14px;padding:.65em .9em;box-shadow:0 6px 20px rgba(0,0,0,.35);max-width:24rem;font-size:15px;line-height:1.35}",
    ".nthview-rotate[hidden]{display:none}",
    ".nthview-rotate svg{width:2.2em;height:2.2em;flex:none}",
    ".nthview-rotate button{margin-left:auto;flex:none;color:#1d1b26;border-color:#d8d2c4}",
    ".nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".nthview-story.nthview-full{position:fixed;inset:0;z-index:2147483000;max-width:none;margin:0;padding:0;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}",
    ".nthview-full .nthview-head{display:none}",
    ".nthview-full .nthview-stage{border-radius:0;box-shadow:none}",
    ".nthview-full .nthview-bar{color:#fff;padding:.4rem .5rem}",
    ".nthview-full .nthview-btn{background:rgba(255,255,255,.12);border-color:rgba(255,255,255,.22);color:#fff}",
    ".nthview-full .nthview-btn[aria-pressed=true],.nthview-full .nthview-btn.is-main{background:#a892ff;border-color:#a892ff;color:#15111f}",
    ".nthview-full .nthview-pos,.nthview-full .nthview-chn{color:#ccc}",
    ".nthview-full .nthview-seg{background:rgba(255,255,255,.3)}",
    ".nthview-full .nthview-seg i,.nthview-full .nthview-knob{background:#a892ff}",
    ".nthview-full .nthview-knob{box-shadow:0 0 0 3px #000}",
    ".nthview-full.nthview-land .nthview-btn{height:40px;min-width:40px}",
    ".nthview-full.nthview-land .nthview-scrub{height:30px}",
    ".nthview-full.nthview-land .nthview-bar{position:absolute;left:0;right:0;bottom:0;z-index:4;padding:.6rem max(.6rem,env(safe-area-inset-right)) max(.45rem,env(safe-area-inset-bottom)) max(.6rem,env(safe-area-inset-left));background:linear-gradient(rgba(10,8,22,0),rgba(10,8,22,.88) 40%)}",
    ".nthview-full.nthview-land:not(.nthview-idle) .nthview-cap{bottom:calc(var(--barh,60px) + var(--u)*1.5)}",
    ".nthview-full.nthview-idle .nthview-bar{opacity:0;pointer-events:none}",
    ".nthview-full.nthview-idle .nthview-stage{cursor:none}",
    ".nthview-full .nthview-below{width:100%;padding:0 .6rem;color:#fff}",
    ".nthview-vchip{top:auto;bottom:calc(var(--u)*17)}",
    ".nthview-vchip[hidden]{display:none}",
    ".nthview-vprog,.nthview-eprog{display:block;width:100%;height:10px;margin:.5rem 0 .2rem;accent-color:var(--nv-accent)}",
    ".nthview-vprog[hidden],.nthview-eprog[hidden]{display:none}",
    ".nthview-set .nthview-row{margin:.2rem 0 .8rem}",
    ".nthview-exporting *{transition:none!important;animation:none!important}",
    ".nthview-exporting .nthview-stage .nthview-row,.nthview-exporting .nthview-stage .nthview-hint,.nthview-exporting .nthview-stage details,.nthview-exporting .nthview-bigplay,.nthview-exporting .nthview-resume{display:none!important}",
    ".nthview-exporting .nthview-cap{bottom:calc(var(--u)*3.5)!important}",
    "@media (prefers-reduced-motion:reduce){.nthview-story *{transition:none!important;animation:none!important}}"
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
    return "nthview:story:" + (h >>> 0).toString(36);
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
  var SVGNS = "http://www.w3.org/2000/svg";
  var ICONS = {
    play: ["M8 5v14l11-7z", 1], pause: ["M7 5h4v14H7zM13 5h4v14h-4z", 1],
    prev: ["M6 6v12M18 6l-9 6 9 6z", 0], next: ["M18 6v12M6 6l9 6-9 6z", 0],
    replay: ["M4 12a8 8 0 1 0 2.4-5.7M4 4v4.5h4.5", 0],
    full: ["M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5", 0], unfull: ["M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5", 0],
    voice: ["M4 9.5v5h3.5L12 18V6L7.5 9.5zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11", 0],
    mute: ["M4 9.5v5h3.5L12 18V6L7.5 9.5zM16 10l4 4M20 10l-4 4", 0],
    list: ["M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01", 0],
    cast: ["M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3.5 20a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17.5 14.2A5.5 5.5 0 0 1 20.5 20", 0],
    gear: ["M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4", 0],
    pin: ["M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z", 0],
    phone: ["M8 2.5h8a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 20V4A1.5 1.5 0 0 1 8 2.5zM11 18.5h2", 0],
    turn: ["M3 12a9 9 0 0 1 15.5-6.2M21 12a9 9 0 0 1-15.5 6.2M18.5 2v4h-4M5.5 22v-4h4", 0],
    close: ["M6 6l12 12M18 6L6 18", 0],
    download: ["M12 4v11M7 10l5 5 5-5M5 20h14", 0]
  };
  function icon(name) {
    var spec = ICONS[name], s = root.document.createElementNS(SVGNS, "svg"), p = root.document.createElementNS(SVGNS, "path");
    s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("aria-hidden", "true"); s.setAttribute("focusable", "false");
    p.setAttribute("d", spec[0]);
    if (spec[1]) p.setAttribute("fill", "currentColor");
    else { p.setAttribute("fill", "none"); p.setAttribute("stroke", "currentColor"); p.setAttribute("stroke-width", "2"); p.setAttribute("stroke-linecap", "round"); p.setAttribute("stroke-linejoin", "round"); }
    s.appendChild(p);
    return s;
  }

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function ease(x) { x = clamp01(x); return x * x * (3 - 2 * x); }
  function popIn(x) { x = clamp01(x); var c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function angDiff(a, b) { return ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; }
  function words(s) { return s && s.trim() ? s.trim().split(/\s+/).length : 0; }
  function rng(seed) { return function () { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; }; }
  function shade(hex, k) {
    var n = parseInt(hex.slice(1), 16), r = n >> 16, g = n >> 8 & 255, b = n & 255;
    function f(c) { return Math.round(k < 0 ? c * (1 + k) : c + (255 - c) * k); }
    return "#" + ((1 << 24) + (f(r) << 16) + (f(g) << 8) + f(b)).toString(16).slice(1);
  }

  /* cast presets: body colour, hat, accessory, face extras, narration pitch */
  var PRESETS = {
    courier: { body: "#e0782f", hat: "cap", hc: "#2f5fa8", acc: "bag", pitch: 1.1 },
    guard: { body: "#2f4a7a", hat: "peaked", hc: "#1f2c48", acc: "clipboard", pitch: .9 },
    clerk: { body: "#3f9b6a", hat: "hair", hc: "#5a3a22", acc: "apron", pitch: 1.05 },
    crook: { body: "#5d4373", hat: "tophat", hc: "#1d1a22", acc: "none", face: { mask: 1, tache: 1 }, pitch: .8 },
    scientist: { body: "#f1f1ee", hat: "goggles", hc: "#8a8a8a", acc: "none", pitch: 1 },
    doctor: { body: "#4fb3c4", hat: "hair", hc: "#3a2a1e", acc: "stethoscope", pitch: 1 },
    worker: { body: "#f0a429", hat: "hardhat", hc: "#f6d33a", acc: "vest", pitch: .95 },
    robot: { body: "#9aa7b4", hat: "antenna", hc: "#c4473a", acc: "none", head: "box", face: { robot: 1 }, pitch: .75 },
    chief: { body: "#3a4152", hat: "hair", hc: "#9a9a9a", acc: "tie", face: { tache: 1 }, pitch: .85 },
    messenger: { body: "#c4473a", hat: "winged", hc: "#e8c34a", acc: "scroll", pitch: 1.15 },
    teacher: { body: "#8a5a3c", hat: "bun", hc: "#4a2f1e", acc: "none", face: { glasses: 1 }, pitch: 1.05 },
    student: { body: "#2f9b8a", hat: "backcap", hc: "#e05a3a", acc: "backpack", pitch: 1.2 },
    citizen: { body: "#d9809a", hat: "hair", hc: "#3a2618", acc: "none", pitch: 1.05 },
    knight: { body: "#aab4c0", hat: "helmet", hc: "#c4473a", acc: "shieldarm", pitch: .85 },
    royal: { body: "#7a4fc4", hat: "crown", hc: "#e8c34a", acc: "robe", pitch: .95 },
    blob: { body: "#6cc46a", head: "blob", face: { blob: 1 }, pitch: 1.4 },
    spiky: { body: "#d9534f", head: "spiky", face: { blob: 1 }, pitch: 1.25 }
  };
  var SKINS = ["#f2c7a2", "#d9a07a", "#b97a55", "#8d5a3b", "#f0d3b8", "#c68a62"];
  var ACCENTS = ["#6a4dd6", "#e0782f", "#2f9b8a", "#c4413a", "#2d6cd0", "#b5489a", "#3f9b6a", "#8a6a2a", "#4a5a8a", "#d9534f"];

  /* places: a post, five standing marks, prop spots on a surface and on the ground (local x, z) */
  var MK = { left: [-3.4, .9], center: [-.3, 1.5], right: [3.2, .9], "back-left": [-1.9, -.8], "back-right": [1.7, -.8] };
  var ORDER = ["left", "right", "center", "back-left", "back-right"];
  var DOOR = [-8.6, 2.6];
  var GROUND = [[-1.4, 2.8], [1.6, 2.8], [-4.9, 2.4], [5, 2.4]];
  var SETS = {
    street: { post: [4.3, -1.3], floor: "#d3ccbf" },
    shop: { post: [3.3, -1.75], floor: "#e2d3b8", surf: [1.07, [2.5, -.55], [4.1, -.55]] },
    office: { post: [3.1, -1.85], floor: "#d8cfc2", surf: [.92, [2.4, -.6], [3.8, -.6]] },
    lab: { post: [3.1, -1.85], floor: "#dfe6ea", surf: [1, [2.3, -.6], [3.9, -.6]] },
    tower: { post: [2.6, -1.6], floor: "#cdc6aa" },
    "server-room": { post: [3.6, -1.6], floor: "#4a5163" },
    classroom: { post: [3.5, -2.5], floor: "#dccaa8", surf: [.92, [2.9, -1.2], [4.1, -1.2]] },
    gate: { post: [3.3, -1.4], floor: "#cbbfa6" },
    home: { post: [3.4, -1.9], floor: "#cfe0b0", surf: [.84, [2.7, -.7], [4.1, -.7]] },
    bank: { post: [3.4, -1.85], floor: "#ddd6c8", surf: [1.07, [2.6, -.6], [4.2, -.6]] },
    park: { post: [3.6, -1.4], floor: "#b2d897" },
    factory: { post: [4.6, -2.3], floor: "#c3c0b8", surf: [.94, [-.2, -1], [1.6, -1]] },
    organic: { post: [3.2, -1.6], floor: "#f0b9bf" },
    stage: { post: [3.2, -1.6], floor: "#d9d1f0" }
  };
  var WORLDS = {
    day: { sky: "#bfe3f5", fog: "#d4ecf6", ground: "#9fd18a", road: "#8d919b", hemi: ["#ffffff", "#8aa07a"], hi: .78, sun: "#fff1d6", si: .72, hill: "#7fbf72" },
    dusk: { sky: "#f0b29c", fog: "#efbfa9", ground: "#9ab27c", road: "#7d7480", hemi: ["#ffd9c2", "#6a5a7a"], hi: .74, sun: "#ffb37a", si: .7, hill: "#8a9a6c" },
    night: { sky: "#1c2340", fog: "#222a48", ground: "#3e5a4a", road: "#3a3d4a", hemi: ["#9fb0e0", "#2a2a40"], hi: .62, sun: "#b8c4ff", si: .5, hill: "#2f4a40", night: 1 },
    studio: { sky: "#e8e3f6", fog: "#e8e3f6", ground: "#ddd6f0", road: "#cdc4e8", hemi: ["#ffffff", "#b8b0d8"], hi: .82, sun: "#ffffff", si: .62, hill: "#cfc6ec", studio: 1 }
  };
  var WINDOWS = { card: 1, code: 1, formula: 1, number: 1 };
  var PCOL = {
    letter: "#f4efe2", parcel: "#c79a62", box: "#9b7650", gift: "#d9534f", lock: "#e8b83a", key: "#e8b83a", stamp: "#7a4a2a",
    gauge: "#e2574c", counter: "#2b2f3d", cabinet: "#9aa3ad", coin: "#f0c53a", document: "#fbfaf5", shield: "#4f7dd1",
    magnifier: "#4a4f62", clock: "#f7f4ec", server: "#2f3442", flag: "#e2574c", phone: "#22232b", laptop: "#9aa1ab",
    sign: "#f1e4c6", orb: "#8a7cf0", ticket: "#e8b83a", book: "#4f7dd1", bulb: "#fff4c2", hook: "#8c95a3"
  };
  /* held props: tilt to face the camera, and how much smaller they get in a hand */
  var HELD = { letter: [-1.2, .9], document: [0, .8], cabinet: [0, .5], server: [0, .5], counter: [0, .6], gauge: [0, .6], sign: [0, .55],
    flag: [0, .7], box: [0, .7], parcel: [0, .75], laptop: [0, .75] };
  var TONE = { good: "#3fae6a", bad: "#e2574c", info: "#4a8fe7" };

  /* ---------- compile: the story into timed segments ----------
     Authors write who, what and where. This walks the beats once, keeps the
     logical state (who stands where, who holds what, moods, open lids,
     values, links) and turns every beat into a list of timed segments plus a
     snapshot of the state before it, so any beat can be played, replayed or
     jumped to from its snapshot alone. */
  var SPACING = 22;
  function compile(data) {
    var places = data.places || [{ id: "stage", set: "stage", name: data.title.slice(0, 40) }];
    var PL = {}, n = places.length;
    places.forEach(function (p, i) { PL[p.id] = { id: p.id, name: p.name, set: p.set, i: i, x: (i - (n - 1) / 2) * SPACING, spec: SETS[p.set] }; });
    var cast = {}, props = {};
    data.cast.forEach(function (a) { cast[a.id] = a; });
    (data.props || []).forEach(function (p) { props[p.id] = p; });
    function wxz(pid, xz) { return { x: PL[pid].x + xz[0], z: xz[1] }; }
    function markXZ(pid, m) {
      if (m === "post") return wxz(pid, PL[pid].spec.post);
      if (m === "door") return wxz(pid, DOOR);
      if (MK[m]) return wxz(pid, MK[m]);
      var k = +String(m).slice(1) || 0;
      return wxz(pid, [-6.2 + k * 1.5, 3.3 - (k % 2) * .6]);
    }
    function slotXYZ(pid, k) {
      var sp = PL[pid].spec, s = sp.surf ? sp.surf.length - 1 : 0;
      if (k < s) return { x: PL[pid].x + sp.surf[k + 1][0], y: sp.surf[0], z: sp.surf[k + 1][1] };
      var g = GROUND[(k - s) % 4], extra = Math.floor((k - s) / 4);
      return { x: PL[pid].x + g[0] + extra * .7, y: 0, z: g[1] - extra * .5 };
    }

    var S = { a: {}, p: {}, links: [] };
    data.cast.forEach(function (a) { S.a[a.id] = { at: null, mark: null, x: 0, z: 0, f: 0, mood: "neutral", vis: 0, crowd: 0 }; });
    (data.props || []).forEach(function (p) {
      S.p[p.id] = { at: null, holder: p.heldBy || null, x: 0, y: 0, z: 0, slot: -1, vis: p.heldBy ? 1 : 0,
        open: p.kind === "laptop" ? 1 : 0, val: p.value === undefined ? null : p.value, text: p.text === undefined ? null : p.text, stamp: null };
    });
    var place = places[0].id, beats = [], snaps = [], seen = {}, chStart = [];

    data.chapters.forEach(function (ch, ci) {
      chStart.push(beats.length);
      ch.beats.forEach(function (b, bi) {
        snaps.push(JSON.parse(JSON.stringify(S)));
        var prev = place;
        if (b.at) place = b.at;
        beats.push(plan(b, ci, bi, bi === 0, place !== prev || beats.length === 0));
      });
    });
    snaps.push(JSON.parse(JSON.stringify(S)));
    return { PL: PL, places: places, beats: beats, snaps: snaps, chStart: chStart, cast: cast, props: props, markXZ: markXZ };

    function plan(b, ci, bi, first, moved) {
      var segs = [], pid = place, T0 = first ? 1.5 : 0, subjects = [], meet = [], lines = [];
      function A(id) { return S.a[id]; }
      function P(id) { return S.p[id]; }
      function here(id) { return A(id).vis && A(id).at === pid; }
      function subj(id) { if (id && (cast[id] || props[id]) && subjects.indexOf(id) === -1) subjects.push(id); }
      function freeMark(p2, id) {
        var occ = Object.keys(S.a).filter(function (k) { return k !== id && S.a[k].vis && S.a[k].at === p2; }).map(A);
        function taken(m) { var q = markXZ(p2, m); return occ.some(function (o) { var dx = o.x - q.x, dz = o.z - q.z; return dx * dx + dz * dz < 1.6; }); }
        if (cast[id].post === p2 && !taken("post")) return "post";
        for (var k = 0; k < ORDER.length; k++) if (!taken(ORDER[k])) return ORDER[k];
        for (k = 0; k < 10; k++) if (!taken("x" + k)) return "x" + k;
        return "center";
      }
      function walk(id, x1, z1, t, stumble) {
        var a = A(id), dx = x1 - a.x, dz = z1 - a.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d < .05) return t;
        var dur = stumble ? .45 : Math.max(.45, d / (d > 6 ? 3.8 : 2.9));
        segs.push({ k: "mv", id: id, x0: a.x, z0: a.z, x1: x1, z1: z1, d: d, st: stumble ? 1 : 0, t0: t, t1: t + dur });
        a.x = x1; a.z = z1;
        if (!stumble) a.f = Math.atan2(dx, dz);
        return t + dur;
      }
      function face(id, f1, t) {
        var a = A(id), d = angDiff(a.f, f1);
        if (Math.abs(d) < .06) return t;
        segs.push({ k: "fc", id: id, f0: a.f, f1: a.f + d, t0: t, t1: t + .4 });
        a.f += d;
        return t + .4;
      }
      function faceTo(id, q, t) { var a = A(id), f = Math.atan2(q.x - a.x, q.z - a.z); return face(id, f + angDiff(f, 0) * .4, t); }   /* turned a little toward the camera */
      function enter(id, t, mark, pop) {
        var a = A(id);
        if (a.vis && a.at === pid) return t;
        if (!seen[id]) { seen[id] = 1; meet.push({ id: id, t: t }); }
        var m = mark || freeMark(pid, id), q = markXZ(pid, m), d = pop ? q : markXZ(pid, "door");
        if (a.crowd) { segs.push({ k: "cr", id: id, n0: a.crowd, n1: 0, t0: t, t1: t }); a.crowd = 0; }
        segs.push({ k: "av", id: id, v0: 0, v1: 1, t0: t, t1: t + (pop ? .5 : .25), x: d.x, z: d.z, f: pop ? 0 : Math.PI / 2, pop: pop ? 1 : 0 });
        a.vis = 1; a.at = pid; a.mark = m; a.x = d.x; a.z = d.z; a.f = pop ? 0 : Math.PI / 2;
        return pop ? t + .5 : walk(id, q.x, q.z, t + .1);
      }
      function leave(id, t) {
        var a = A(id), d = markXZ(pid, "door");
        if (a.crowd) { segs.push({ k: "cr", id: id, n0: a.crowd, n1: 0, t0: t, t1: t + .4 }); a.crowd = 0; }
        var t1 = walk(id, d.x, d.z, t);
        segs.push({ k: "av", id: id, v0: 1, v1: 0, t0: t1 - .2, t1: t1 });
        a.vis = 0; a.at = null; a.mark = null;
        return t1;
      }
      function hand(id) { var a = A(id); return { x: a.x + Math.cos(a.f) * .55 + Math.sin(a.f) * .35, y: 1.1, z: a.z - Math.sin(a.f) * .55 + Math.cos(a.f) * .35 }; }
      function propPos(id) { var p = P(id); return p.holder ? hand(p.holder) : { x: p.x, y: p.y, z: p.z }; }
      function freeSlot(p2, skip) {
        var used = {};
        Object.keys(S.p).forEach(function (k) { var q = S.p[k]; if (k !== skip && q.vis && !q.holder && q.at === p2 && q.slot >= 0) used[q.slot] = 1; });
        for (var k = 0; k < 16; k++) if (!used[k]) return k;
        return 0;
      }
      function showProp(id, t, to) {
        var p = P(id);
        p.slot = -1;
        if (to && cast[to]) { t = enter(to, t); p.holder = to; p.at = null; }
        else if (to) { var q = markXZ(pid, to); p.holder = null; p.at = pid; p.x = q.x; p.y = 0; p.z = q.z + .6; }
        else if (!WINDOWS[props[id].kind]) { var k = freeSlot(pid, id), s = slotXYZ(pid, k); p.holder = null; p.at = pid; p.slot = k; p.x = s.x; p.y = s.y; p.z = s.z; }
        else { p.holder = null; p.at = pid; }
        segs.push({ k: "pv", id: id, v0: 0, v1: 1, t0: t, t1: t + .5, set: { holder: p.holder, at: p.at, x: p.x, y: p.y, z: p.z } });
        p.vis = 1;
        return t + .5;
      }
      function hideProp(id, t) {
        var p = P(id);
        if (!p.vis) return t;
        segs.push({ k: "pv", id: id, v0: 1, v1: 0, t0: t, t1: t + .4, clear: 1 });
        p.vis = 0; p.holder = null; p.at = null; p.slot = -1;
        return t + .4;
      }
      function transfer(id, to, t) {   /* to: { holder } or { x, y, z } */
        var p = P(id);
        if (!p.vis) { segs.push({ k: "pv", id: id, v0: 0, v1: 1, t0: t, t1: t + .3 }); p.vis = 1; }
        segs.push({ k: "ph", id: id, to: to, t0: t, t1: t + .9 });
        if (to.holder) { p.holder = to.holder; p.at = null; p.slot = -1; }
        else { p.holder = null; p.at = pid; p.x = to.x; p.y = to.y; p.z = to.z; p.slot = to.slot === undefined ? -1 : to.slot; }
        return t + .9;
      }
      function near(id, q, t, reach) {   /* walk up to a point unless already close */
        var a = A(id), dx = q.x - a.x, dz = q.z - a.z;
        if (dx * dx + dz * dz <= reach * reach) return t;
        var side = a.x < q.x ? -1 : 1;
        a.mark = null;
        return walk(id, q.x + side * (reach * .8), q.z + .4, t);
      }
      function beside(id, to, t) {   /* stand by another actor; in front of a counter when they are at its post */
        var a = A(id), o = A(to), spec = PL[pid].spec, gx, gz;
        if (o.mark === "post" && spec.surf) { var taken = Object.keys(S.a).some(function (k) { return k !== id && S.a[k].vis && S.a[k].at === pid && Math.abs(S.a[k].x - (o.x - 1.7)) < .8 && Math.abs(S.a[k].z - (o.z + 2.1)) < .8; }); gx = o.x + (taken ? .4 : -1.7); gz = o.z + (taken ? 2.5 : 2.1); }
        else { var side = a.x < o.x ? -1 : 1; gx = o.x + side * 1.45; gz = o.z + .35; }
        a.mark = null;
        return walk(id, gx, gz, t);
      }
      function faceGroup(t) {
        var ids = Object.keys(S.a).filter(here), tt = t;
        ids.forEach(function (id) {
          var a = A(id), cx = 0, cz = 0, k = 0;
          ids.forEach(function (o) { if (o !== id) { cx += A(o).x; cz += A(o).z; k++; } });
          var f = k ? Math.atan2(cx / k - a.x, cz / k - a.z) : 0;
          tt = Math.max(tt, face(id, f + angDiff(f, 0) * .35, t));   /* "cheat out": turned a little toward the camera, as on a stage */
        });
        return tt;
      }
      function fx(id, kind, t, dur, extra) { var s = { k: "fx", id: id, fx: kind, t0: t, t1: t + dur }; if (extra) s.o = extra; segs.push(s); }
      var MOODFX = { happy: "hop", surprised: "jump", angry: "shake", sad: "droop", worried: "shiver", scared: "shiver", smug: "lean", suspicious: "lean", thinking: "tilt", neutral: "nod" };

      function act(x, t) {
        var who = x.who, a = who ? A(who) : null;
        subj(who); subj(x.prop); subj(x.from);
        if (x.to && (cast[x.to] || props[x.to])) subj(x.to);
        if (who && x.act !== "show" && x.act !== "hide") t = enter(who, t);
        if (x.to && cast[x.to] && /^(give|reject|point|turn)$/.test(x.act)) t = enter(x.to, t);
        var q, s;
        switch (x.act) {
          case "walk":
            if (PL[x.to]) {
              if (x.to === pid) { var m0 = freeMark(pid, who); q = markXZ(pid, m0); a.mark = m0; return walk(who, q.x, q.z, t); }
              var t1 = leave(who, t), op = x.to, m2 = freeMark(op, who), dd = markXZ(op, "door"); q = markXZ(op, m2);
              segs.push({ k: "av", id: who, v0: 0, v1: 1, t0: t1 + .05, t1: t1 + .3, x: dd.x, z: dd.z, f: Math.PI / 2 });
              a.vis = 1; a.at = op; a.mark = m2; a.x = dd.x; a.z = dd.z;
              walk(who, q.x, q.z, t1 + .1);
              return t1;
            }
            if (MK[x.to] || x.to === "door" || x.to === "post") { q = markXZ(pid, x.to); a.mark = x.to; return walk(who, q.x, q.z, t); }
            if (cast[x.to]) { t = enter(x.to, t); t = beside(who, x.to, t); t = faceTo(who, A(x.to), t - .1); faceTo(x.to, a, t - .3); return t; }
            q = propPos(x.to); t = near(who, q, t, 1.3); return faceTo(who, q, t - .1);
          case "give":
            var o = A(x.to);
            var across = PL[pid].spec.surf && (a.mark === "post" || o.mark === "post") ? 20 : 5.3;   /* hand it over the counter */
            if ((o.x - a.x) * (o.x - a.x) + (o.z - a.z) * (o.z - a.z) > across) t = a.mark === "post" ? beside(x.to, who, t) : beside(who, x.to, t);
            t = faceTo(who, o, t); faceTo(x.to, a, t - .4);
            fx(who, "reach", t, .9); fx(x.to, "reach", t + .3, .8);
            return transfer(x.prop, { holder: x.to }, t) + .2;
          case "take":
            if (P(x.prop).holder === who) return t;
            if (!P(x.prop).vis) { P(x.prop).holder = who; P(x.prop).at = null; P(x.prop).slot = -1; segs.push({ k: "pv", id: x.prop, v0: 0, v1: 1, t0: t, t1: t + .5, set: { holder: who, at: null } }); P(x.prop).vis = 1; return t + .5; }
            q = propPos(x.prop);
            var atPost = a.mark === "post" && PL[pid].spec.surf;
            if (!atPost) t = P(x.prop).holder ? beside(who, P(x.prop).holder, t) : near(who, q, t, 1.6);
            t = faceTo(who, q, t); fx(who, "reach", t, .9);
            return transfer(x.prop, { holder: who }, t);
          case "drop":
            var dest;
            if (x.to && props[x.to]) { var pq = propPos(x.to); dest = { x: pq.x + .75, y: pq.y, z: pq.z + .15 }; }
            else if (x.to) { var mq = markXZ(pid, x.to); dest = { x: mq.x, y: 0, z: mq.z + .6 }; }
            else { var sk = freeSlot(pid, x.prop); dest = slotXYZ(pid, sk); dest.slot = sk; }
            if (!(a.mark === "post" && PL[pid].spec.surf)) t = near(who, dest, t, 1.7);
            t = faceTo(who, dest, t); fx(who, "reach", t, .9);
            return transfer(x.prop, dest, t);
          case "show":
            if (x.prop) return showProp(x.prop, t, x.to);
            if (here(who)) return t;
            return enter(who, t, x.to, true);
          case "hide":
            if (x.prop) return hideProp(x.prop, t);
            if (!a.vis) return t;
            if (a.crowd) { segs.push({ k: "cr", id: who, n0: a.crowd, n1: 0, t0: t, t1: t + .4 }); a.crowd = 0; }
            segs.push({ k: "av", id: who, v0: 1, v1: 0, t0: t, t1: t + .45, pop: 1 });
            a.vis = 0; a.at = null; a.mark = null;
            return t + .45;
          case "react":
            segs.push({ k: "md", id: who, m: x.mood, t0: t, t1: t });
            a.mood = x.mood; fx(who, MOODFX[x.mood], t, .8);
            return t + .8;
          case "point":
            q = cast[x.to] ? A(x.to) : propPos(x.to);
            t = faceTo(who, q, t); fx(who, "point", t, 1.1, { to: x.to });
            return t + 1.1;
          case "turn":
            return faceTo(who, cast[x.to] ? A(x.to) : propPos(x.to), t) + .1;
          case "stamp":
            q = propPos(x.prop);
            if (P(x.prop).holder && P(x.prop).holder !== who) { if (a.mark !== "post") t = beside(who, P(x.prop).holder, t); }
            else if (!P(x.prop).holder && !(a.mark === "post" && PL[pid].spec.surf)) t = near(who, q, t, 1.9);
            t = faceTo(who, q, t); fx(who, "stamp", t, 1);
            s = { text: x.text, tone: x.tone || "bad" };
            segs.push({ k: "st", id: x.prop, s: s, t0: t + .55, t1: t + .55 });
            P(x.prop).stamp = s;
            return t + 1.05;
          case "open": case "close":
            var o1 = x.act === "open" ? 1 : 0;
            segs.push({ k: "po", id: x.prop, o0: P(x.prop).open, o1: o1, t0: t, t1: t + .7 });
            P(x.prop).open = o1;
            return t + .8;
          case "set":
            var p = P(x.prop), isText = x.value === undefined;
            segs.push({ k: "pval", id: x.prop, txt: isText ? 1 : 0, v0: isText ? p.text : p.val, v1: isText ? x.text : x.value, t0: t, t1: t + (typeof x.value === "number" ? 1 : .35) });
            if (isText) p.text = x.text; else p.val = x.value;
            return t + .8;
          case "reject":
            o = A(x.to);
            t = faceTo(who, o, t); faceTo(x.to, a, t - .4);
            fx(who, "halt", t, 1.1);
            var dx = o.x - a.x, dz = o.z - a.z, dl = Math.sqrt(dx * dx + dz * dz) || 1;
            o.mark = null;
            walk(x.to, o.x + dx / dl * 1.1, o.z + dz / dl * 1.1 + .2, t + .3, true);
            segs.push({ k: "bx", id: x.to, t0: t + .25, t1: t + 1.6 });
            return t + 1.3;
          case "celebrate":
            segs.push({ k: "md", id: who, m: "happy", t0: t, t1: t });
            a.mood = "happy"; fx(who, "cheer", t, 1.4);
            segs.push({ k: "cf", id: who, t0: t, t1: t + 1.9 });
            return t + 1.4;
          case "crowd":
            segs.push({ k: "cr", id: who, n0: a.crowd, n1: x.count, t0: t, t1: t + 1.1 });
            a.crowd = x.count;
            return t + 1.2;
          case "link":
            var key = x.from + ">" + x.to;
            S.links = S.links.filter(function (l) { return l.key !== key; });
            var L = { key: key, from: x.from, to: x.to, label: x.label || "", tone: x.tone || "info" };
            S.links.push(L);
            segs.push({ k: "lk", L: L, v0: 0, v1: 1, t0: t, t1: t + .8 });
            return t + .9;
          case "unlink":
            var k2 = x.from + ">" + x.to, old = S.links.filter(function (l) { return l.key === k2; })[0];
            if (!old) return t;
            S.links = S.links.filter(function (l) { return l.key !== k2; });
            segs.push({ k: "lk", L: old, v0: 1, v1: 0, t0: t, t1: t + .5 });
            return t + .5;
        }
        return t;
      }

      /* blocking: exactly who and what is at the place now */
      var T = T0;
      if (b.with) {
        var want = {}, tEx = T, tIn = T;
        b.with.forEach(function (id) { want[id] = 1; });
        Object.keys(S.a).forEach(function (id) { if (here(id) && !want[id]) tEx = Math.max(tEx, leave(id, T)); });
        Object.keys(S.p).forEach(function (id) { var p = P(id); if (p.vis && !p.holder && p.at === pid && !want[id]) hideProp(id, T); });
        b.with.forEach(function (id) { if (cast[id] && !here(id)) tIn = Math.max(tIn, enter(id, T + .15)); });
        b.with.forEach(function (id) {
          if (!props[id]) return;
          var p = P(id);
          if (p.holder && here(p.holder)) { if (!p.vis) { segs.push({ k: "pv", id: id, v0: 0, v1: 1, t0: T + .2, t1: T + .6 }); p.vis = 1; } }
          else if (!(p.vis && !p.holder && p.at === pid)) showProp(id, T + .2);
        });
        T = Math.max(tEx, tIn, T);
      } else {
        /* the scene carries on; arriving at another place keeps whoever already stands there */
      }
      T = faceGroup(T);
      var blockEnd = T;
      (b.do || []).forEach(function (x) { T = act(x, T); });

      /* speech bubbles, one after another from the end of the blocking */
      var LT = Math.max(T0 + .5, blockEnd);
      (b.lines || []).forEach(function (ln) {
        LT = enter(ln.who, LT);
        var d = 1.3 + .34 * words(ln.text);
        lines.push({ who: ln.who, text: ln.text, t0: LT, t1: LT + d, tone: ln.tone, mood: ln.mood });
        if (ln.mood) { segs.push({ k: "md", id: ln.who, m: ln.mood, t0: LT, t1: LT }); A(ln.who).mood = ln.mood; }
        subj(ln.who);
        LT += d + .25;
      });
      var present = subjects.filter(function (id) { if (cast[id]) return here(id); var p = P(id); return p.vis && (p.holder ? here(p.holder) : p.at === pid); });
      var focus = b.focus ? (typeof b.focus === "string" ? [b.focus] : b.focus.slice()) : present.slice(0, 3);
      var shot = b.shot || "auto";
      if (shot === "auto") shot = first || moved ? "establishing" : !focus.length ? "wide" : focus.length === 1 ? "medium" : focus.length === 2 ? "two-shot" : "wide";
      var capT = 1.8 + .34 * words(b.caption);
      var dur = Math.max(T0 + 3.6, T + 1, lines.length ? LT + .4 : 0, T0 + capT) + (b.hold || 0);
      segs.sort(function (p, q) { return p.t0 - q.t0; });
      return { ci: ci, bi: bi, b: b, place: pid, first: first, moved: moved, segs: segs, lines: lines, meet: meet, focus: focus, explicitFocus: !!b.focus,
        shot: shot, cut: !!b.cut, dur: dur, T0: T0, links: S.links.slice() };
    }
  }

  /* ---------- the 3D world: toon materials, outlines, characters, props, sets ---------- */
  function makeWorld(THREE, data, C) {
    var doc = root.document, W = WORLDS[data.world || "day"];
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(W.sky);
    scene.fog = new THREE.Fog(W.fog, 34, 110);
    var hemi = new THREE.HemisphereLight(W.hemi[0], W.hemi[1], W.hi * .75); scene.add(hemi);
    var sun = new THREE.DirectionalLight(W.sun, W.si * 1.15); sun.position.set(-8, 16, 12); scene.add(sun);
    var grad = new THREE.DataTexture(new Uint8Array([120, 120, 120, 255, 196, 196, 196, 255, 255, 255, 255, 255]), 3, 1, THREE.RGBAFormat);
    grad.minFilter = grad.magFilter = THREE.NearestFilter; grad.generateMipmaps = false; grad.needsUpdate = true;
    var MATS = {};
    function toon(c) { if (!MATS[c]) MATS[c] = new THREE.MeshToonMaterial({ color: c, gradientMap: grad }); return MATS[c]; }
    function glow(c, k) { var id = "g" + c + (k || ""); if (!MATS[id]) MATS[id] = new THREE.MeshToonMaterial({ color: c, emissive: c, emissiveIntensity: k || .75, gradientMap: grad }); return MATS[id]; }
    var OUT = new THREE.MeshBasicMaterial({ color: W.night ? 0x0d0b18 : 0x2a2238, side: THREE.BackSide });
    var SHADOW = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .2, depthWrite: false });
    var G = {
      box: new THREE.BoxGeometry(1, 1, 1), sph: new THREE.SphereGeometry(1, 20, 14), lo: new THREE.SphereGeometry(1, 10, 7),
      cyl: new THREE.CylinderGeometry(1, 1, 1, 16), cyl6: new THREE.CylinderGeometry(1, 1, 1, 6), cone: new THREE.ConeGeometry(1, 1, 14),
      pyr: new THREE.ConeGeometry(1, 1, 4), circ: new THREE.CircleGeometry(1, 24), plane: new THREE.PlaneGeometry(1, 1),
      ring: new THREE.TorusGeometry(1, .22, 8, 24), arc: new THREE.TorusGeometry(1, .26, 8, 16, Math.PI),
      face: new THREE.SphereGeometry(1.012, 24, 16, Math.PI * .1, Math.PI * .8, Math.PI * .22, Math.PI * .52)
    };
    function mesh(geo, mat, sx, sy, sz, x, y, z, parent) { var m = new THREE.Mesh(geo, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); if (parent) parent.add(m); return m; }
    function ol(m, t) {
      t = t || .05;
      var o = new THREE.Mesh(m.geometry, OUT);
      o.scale.set(1 + t / Math.max(.02, Math.abs(m.scale.x)), 1 + t / Math.max(.02, Math.abs(m.scale.y)), 1 + t / Math.max(.02, Math.abs(m.scale.z)));
      m.add(o);
      return m;
    }
    /* box with its base at y, cylinder with its base at y, sphere centred at y */
    function B(w, h, d, c, x, y, z, p, o) { var m = mesh(G.box, typeof c === "string" ? toon(c) : c, w, h, d, x, y + h / 2, z, p); if (o) ol(m, o === true ? .07 : o); return m; }
    function Cy(r, h, c, x, y, z, p, o, geo) { var m = mesh(geo || G.cyl, typeof c === "string" ? toon(c) : c, r, h, r, x, y + h / 2, z, p); if (o) ol(m, o === true ? .06 : o); return m; }
    function Sp(r, c, x, y, z, p, o, sy) { var m = mesh(G.sph, typeof c === "string" ? toon(c) : c, r, r * (sy || 1), r, x, y, z, p); if (o) ol(m, o === true ? .06 : o); return m; }

    /* ---------- faces, drawn on a canvas ---------- */
    function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
    function ell(c, x, y, rx, ry) { c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); }
    function drawFace(cv, mood, blink, f, skin) {
      var c = cv.getContext("2d"), robot = f.robot, ink = robot ? "#7ff3ff" : "#231c2e";
      c.clearRect(0, 0, 256, 256);
      if (robot) { c.fillStyle = "#1b2433"; rr(c, 6, 20, 244, 216, 46); c.fill(); }
      var ex = f.blob ? 46 : 40, ey = 112, er = f.blob ? 17 : 14, lidC = skin;
      if (f.mask) { c.fillStyle = "#1d1a24"; rr(c, 30, ey - 30, 196, 56, 28); c.fill(); lidC = "#1d1a24"; }
      if (mood === "happy" && !robot) { c.fillStyle = "rgba(240,110,120,.45)"; ell(c, 66, 160, 18, 11); ell(c, 190, 160, 18, 11); }
      c.lineCap = "round"; c.lineJoin = "round"; c.strokeStyle = ink; c.fillStyle = ink;
      var eyeInk = f.mask ? "#fff" : ink;
      [-1, 1].forEach(function (s) {
        var x = 128 + s * ex;
        var lid = mood === "smug" ? .5 : mood === "suspicious" ? (s < 0 ? .35 : .65) : mood === "sad" ? .75 : 1;
        var big = mood === "surprised" || mood === "scared" ? 1.25 : 1;
        c.lineWidth = 7; c.strokeStyle = eyeInk; c.fillStyle = eyeInk;
        if (blink) { c.beginPath(); c.moveTo(x - er, ey); c.quadraticCurveTo(x, ey + er * .8, x + er, ey); c.stroke(); }
        else if (mood === "happy" && !robot) { c.beginPath(); c.moveTo(x - er, ey + 5); c.quadraticCurveTo(x, ey - er * 1.4, x + er, ey + 5); c.stroke(); }
        else {
          ell(c, x, ey, er * .85 * big, er * 1.15 * big);
          if (!robot && !f.mask) { c.fillStyle = "#fff"; ell(c, x - 4, ey - 7, 4.5, 4.5); }
          if (lid < 1) {
            c.fillStyle = robot ? "#1b2433" : lidC;
            c.fillRect(x - er * 1.5, ey - er * 2.2, er * 3, er * 2.3 * (1 - lid) + er * .1);
            c.lineWidth = 6; c.strokeStyle = eyeInk; c.beginPath();
            var ly = ey - er * 1.15 * big + er * 2.3 * big * (1 - lid);
            c.moveTo(x - er * 1.1, ly); c.lineTo(x + er * 1.1, ly); c.stroke();
          }
        }
        if (robot) return;
        var dIn = -2, dOut = 0;
        if (mood === "angry") { dIn = 12; dOut = -6; }
        else if (mood === "worried" || mood === "sad" || mood === "scared") { dIn = -10; dOut = 6; }
        else if (mood === "surprised") { dIn = -12; dOut = -10; }
        else if (mood === "suspicious") { if (s < 0) { dIn = 4; dOut = 4; } else { dIn = -10; dOut = -5; } }
        else if (mood === "smug") { if (s > 0) { dIn = -9; dOut = -3; } else { dIn = 3; dOut = 3; } }
        else if (mood === "thinking" && s > 0) { dIn = -8; dOut = -3; }
        c.lineWidth = 7; c.strokeStyle = f.mask ? "#fff" : ink; c.beginPath();
        c.moveTo(128 + s * (ex - 16), ey - 34 + dIn); c.lineTo(128 + s * (ex + 17), ey - 34 + dOut); c.stroke();
      });
      c.lineWidth = 7; c.strokeStyle = ink; c.fillStyle = ink;
      var my = 176;
      c.beginPath();
      switch (mood) {
        case "happy": c.moveTo(98, my - 10); c.quadraticCurveTo(128, my + 34, 158, my - 10); c.closePath(); c.fill(); break;
        case "sad": c.moveTo(106, my + 12); c.quadraticCurveTo(128, my - 14, 150, my + 12); c.stroke(); break;
        case "worried": c.moveTo(104, my + 4); c.bezierCurveTo(116, my - 8, 128, my + 14, 152, my - 2); c.stroke(); break;
        case "smug": c.moveTo(106, my + 2); c.quadraticCurveTo(136, my + 12, 156, my - 12); c.stroke(); break;
        case "suspicious": c.moveTo(112, my + 4); c.lineTo(146, my - 2); c.stroke(); break;
        case "surprised": ell(c, 128, my + 4, 13, 17); break;
        case "angry": c.moveTo(104, my + 10); c.quadraticCurveTo(128, my - 6, 152, my + 10); c.stroke(); break;
        case "thinking": ell(c, 146, my + 2, 8, 7); break;
        case "scared": ell(c, 128, my + 6, 21, 13); c.fillStyle = "#fff"; c.fillRect(112, my, 32, 4); break;
        default: c.moveTo(112, my); c.quadraticCurveTo(128, my + 6, 144, my); c.stroke();
      }
      if (f.tache && !robot) {
        c.fillStyle = "#2a2230"; c.beginPath();
        c.moveTo(128, my - 22); c.bezierCurveTo(112, my - 34, 92, my - 24, 84, my - 10); c.bezierCurveTo(100, my - 16, 114, my - 14, 128, my - 12);
        c.bezierCurveTo(142, my - 14, 156, my - 16, 172, my - 10); c.bezierCurveTo(164, my - 24, 144, my - 34, 128, my - 22); c.fill();
      }
      if (f.glasses) {
        c.lineWidth = 5; c.strokeStyle = "#2a2230";
        [-1, 1].forEach(function (s) { c.beginPath(); c.arc(128 + s * ex, ey, 24, 0, Math.PI * 2); c.stroke(); });
        c.beginPath(); c.moveTo(128 - ex + 24, ey - 4); c.quadraticCurveTo(128, ey - 12, 128 + ex - 24, ey - 4); c.stroke();
      }
      if ((mood === "worried" || mood === "scared") && !robot) {
        c.fillStyle = "#7cc4f0"; c.beginPath(); c.moveTo(200, 70); c.quadraticCurveTo(214, 96, 200, 102); c.quadraticCurveTo(186, 96, 200, 70); c.fill();
      }
    }

    /* ---------- characters ---------- */
    var HATS = { cap: .32, peaked: .4, tophat: .85, hair: .12, goggles: .2, hardhat: .38, antenna: .75, winged: .4, bun: .4, backcap: .32, helmet: .5, crown: .45 };
    function buildActor(a, idx) {
      var P = PRESETS[a.preset], col = a.color || P.body, skin = SKINS[idx % SKINS.length], dark = "#2d2838";
      var g = new THREE.Group(), inner = new THREE.Group(); g.add(inner);
      var sh = mesh(G.circ, SHADOW, .78, .78, 1, 0, .02, 0, g); sh.rotation.x = -Math.PI / 2;
      var A = { id: a.id, a: a, P: P, g: g, inner: inner, col: col, seed: idx * 1.37 + .4, mood: "", blink: false, nextBlink: 1 + idx * .7, clones: [] };
      var faceStyle = P.face || {}, cv = doc.createElement("canvas"); cv.width = cv.height = 256;
      A.cv = cv; A.tex = new THREE.CanvasTexture(cv); A.skin = skin; A.fstyle = faceStyle;
      var fmat = new THREE.MeshBasicMaterial({ map: A.tex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
      if (P.head === "blob" || P.head === "spiky") {
        var body = ol(mesh(G.sph, toon(col), .95, .9, .9, 0, 1.02, 0, inner), .06);
        mesh(G.face, fmat, 1, 1, 1, 0, 0, 0, body);
        [-1, 1].forEach(function (s) { ol(mesh(G.sph, toon(shade(col, -.35)), .26, .14, .32, s * .42, .12, .18, inner), .04); });
        if (P.head === "spiky") {
          var R = rng(idx + 7), up = new THREE.Vector3(0, 1, 0);
          for (var k = 0; k < 11; k++) {
            var yy = 1 - (k + .5) / 11 * 1.6, rad = Math.sqrt(Math.max(0, 1 - yy * yy)), th = k * 2.4 + R();
            var dir = new THREE.Vector3(Math.cos(th) * rad, yy, Math.sin(th) * rad);
            if (dir.z > .55 && Math.abs(dir.y) < .5) continue;   /* keep the face clear */
            var sp = ol(mesh(G.cone, toon(shade(col, -.18)), .16, .42, .16, dir.x * .9, 1.02 + dir.y * .86, dir.z * .86, inner), .03);
            sp.quaternion.setFromUnitVectors(up, dir);
          }
        }
        A.body = body; A.head = body; A.hand = new THREE.Vector3(.95, .98, .4); A.top = 2.1;
      } else {
        A.legs = [-1, 1].map(function (s) {
          var hip = new THREE.Group(); hip.position.set(s * .2, .92, 0); inner.add(hip);
          ol(mesh(G.cyl, toon(P.head === "box" ? shade(col, -.25) : dark), .085, .82, .085, 0, -.41, 0, hip), .035);
          ol(mesh(G.sph, toon("#2a2430"), .15, .09, .21, 0, -.86, .06, hip), .035);
          return hip;
        });
        var torso = new THREE.Group(); torso.position.y = .88; inner.add(torso); A.torso = torso;
        ol(mesh(G.sph, toon(col), .5, .62, .42, 0, .52, 0, torso), .05);
        A.arms = [-1, 1].map(function (s) {
          var shp = new THREE.Group(); shp.position.set(s * .5, .9, 0); torso.add(shp);
          ol(mesh(G.cyl, toon(col), .075, .6, .075, 0, -.3, 0, shp), .035);
          var hnd = ol(mesh(G.sph, toon(P.head === "box" ? "#6b7682" : skin), .115, .115, .115, 0, -.64, 0, shp), .03);
          shp.userData.hand = hnd;
          return shp;
        });
        var head = new THREE.Group(); head.position.y = 1.36; torso.add(head); A.head = head;
        if (P.head === "box") {
          ol(mesh(G.box, toon(col), .92, .8, .8, 0, .02, 0, head), .05);
          var fm = new THREE.MeshBasicMaterial({ map: A.tex, polygonOffset: true, polygonOffsetFactor: -2 });
          mesh(G.plane, fm, .78, .66, 1, 0, .02, .405, head);
        } else {
          var hs = ol(mesh(G.sph, toon(skin), .55, .55, .55, 0, 0, 0, head), .05);
          mesh(G.face, fmat, 1, 1, 1, 0, 0, 0, hs);
        }
        hat(P.hat, P.hc, head, A);
        accessory(P.acc, A, torso, col);
        A.top = 2.24 + .55 + (HATS[P.hat] || 0);
      }
      drawFace(cv, "neutral", false, faceStyle, skin); A.tex.needsUpdate = true; A.mood = "neutral";
      return A;
    }
    function hat(kind, c, head, A) {
      var hm = toon(c);
      switch (kind) {
        case "cap": case "backcap":
          ol(mesh(G.sph, hm, .58, .32, .58, 0, .27, -.04, head), .04);
          ol(mesh(G.box, hm, .5, .05, .34, 0, .3, kind === "cap" ? .48 : -.5, head), .03); break;
        case "peaked":
          ol(mesh(G.sph, hm, .57, .3, .57, 0, .27, 0, head), .04);
          ol(mesh(G.cyl, hm, .6, .16, .6, 0, .44, -.02, head), .04);
          ol(mesh(G.box, toon("#151b2a"), .5, .05, .3, 0, .3, .5, head), .03);
          mesh(G.box, glow("#e8c34a", .3), .16, .12, .04, 0, .44, .6, head); break;
        case "tophat":
          ol(mesh(G.cyl, hm, .72, .05, .72, 0, .4, 0, head), .04);
          ol(mesh(G.cyl, hm, .42, .72, .42, 0, .78, 0, head), .04);
          mesh(G.cyl, toon("#b03a4a"), .43, .1, .43, 0, .5, 0, head); break;
        case "hair": case "bun": case "goggles": case "crown":
          ol(mesh(G.sph, hm, .59, .42, .57, 0, .22, -.13, head), .04);
          if (kind === "bun") ol(mesh(G.sph, hm, .22, .22, .22, 0, .42, -.4, head), .04);
          if (kind === "goggles") {
            var band = mesh(G.ring, toon("#4a4f62"), .58, .58, .6, 0, .3, 0, head); band.rotation.x = Math.PI / 2 - .25;
            [-1, 1].forEach(function (s) { var l = ol(mesh(G.cyl, glow("#9fdcf0", .3), .14, .08, .14, s * .2, .42, .44, head), .03); l.rotation.x = Math.PI / 2 - .5; });
          }
          if (kind === "crown") {
            ol(mesh(G.cyl, toon(c), .4, .24, .4, 0, .52, 0, head), .03);
            for (var k = 0; k < 5; k++) { var an = k / 5 * Math.PI * 2; ol(mesh(G.cone, toon(c), .09, .2, .09, Math.sin(an) * .36, .73, Math.cos(an) * .36, head), .02); }
            mesh(G.sph, glow("#e2574c", .5), .07, .07, .07, 0, .54, .41, head);
          }
          break;
        case "hardhat":
          ol(mesh(G.sph, hm, .62, .36, .62, 0, .27, 0, head), .04);
          ol(mesh(G.cyl, hm, .74, .05, .74, 0, .27, .04, head), .03);
          mesh(G.box, toon(shade(c, -.15)), .12, .08, .9, 0, .52, 0, head); break;
        case "antenna":
          Cy(.03, .45, "#6b7682", 0, .42, 0, head);
          A.light = mesh(G.sph, glow(c, .9), .1, .1, .1, 0, .92, 0, head); break;
        case "winged":
          ol(mesh(G.sph, hm, .58, .32, .58, 0, .27, 0, head), .04);
          [-1, 1].forEach(function (s) { var w = ol(mesh(G.box, toon("#ffffff"), .06, .22, .4, s * .58, .38, -.05, head), .03); w.rotation.z = s * .5; w.rotation.x = -.4; }); break;
        case "helmet":
          ol(mesh(G.sph, toon("#b8c0c8"), .64, .52, .6, 0, .2, -.16, head), .04);
          ol(mesh(G.sph, toon(c), .1, .3, .32, 0, .7, -.1, head), .03); break;
      }
    }
    function accessory(kind, A, torso, col) {
      switch (kind) {
        case "bag":
          ol(mesh(G.box, toon("#8a5a2f"), .34, .38, .16, .46, .32, .2, torso), .035);
          var st = mesh(G.box, toon("#6a4224"), .07, 1.25, .06, .05, .62, .38, torso); st.rotation.z = -.75; break;
        case "clipboard":
          var cb = ol(mesh(G.box, toon("#9a6a3a"), .34, .44, .04, 0, -.7, .16, A.arms[0]), .03);
          mesh(G.box, toon("#ffffff"), .28, .34, .01, 0, -.02, .7, cb); break;
        case "apron": ol(mesh(G.box, toon("#f4f0e6"), .62, .62, .05, 0, .3, .38, torso), .03); break;
        case "stethoscope":
          var tr = mesh(G.ring, toon("#2a2f3a"), .26, .26, .26, 0, .92, .2, torso); tr.rotation.x = Math.PI / 2 - .5;
          mesh(G.cyl, toon("#c9ccd6"), .08, .04, .08, .14, .6, .44, torso).rotation.x = Math.PI / 2; break;
        case "vest": mesh(G.cyl, toon("#e8e8e8"), .52, .07, .45, 0, .45, 0, torso); mesh(G.cyl, toon("#e8e8e8"), .5, .07, .43, 0, .68, 0, torso); break;
        case "tie": ol(mesh(G.box, toon("#c4413a"), .12, .48, .04, 0, .56, .42, torso), .02); break;
        case "scroll": var sc = ol(mesh(G.cyl, toon("#efe2c0"), .07, .42, .07, 0, -.72, .1, A.arms[0]), .03); sc.rotation.x = Math.PI / 2; break;
        case "backpack": ol(mesh(G.box, toon("#e8b83a"), .56, .62, .3, 0, .48, -.42, torso), .035); break;
        case "shieldarm": var sd = ol(mesh(G.cyl, toon("#c4413a"), .34, .07, .34, -.08, -.6, .14, A.arms[0]), .03); sd.rotation.z = Math.PI / 2; break;
        case "robe":
          ol(mesh(G.box, toon(shade(col, -.3)), .95, 1.25, .06, 0, .1, -.4, torso), .03);
          mesh(G.ring, toon("#ffffff"), .44, .44, .44, 0, .98, 0, torso).rotation.x = Math.PI / 2; break;
      }
    }

    /* ---------- props: origin at the base, h = height ---------- */
    function buildProp(p) {
      var k = p.kind, c = p.color || PCOL[k], g = new THREE.Group(), Q = { id: p.id, p: p, g: g, h: .6, parts: {} };
      scene.add(g);
      if (WINDOWS[k]) { g.visible = false; Q.win = 1; Q.h = 0; return Q; }
      var pt = Q.parts, hinge;
      switch (k) {
        case "letter":
          B(.72, .05, .48, c, 0, 0, 0, g, .04);
          hinge = new THREE.Group(); hinge.position.set(0, .06, -.24); g.add(hinge);
          mesh(G.box, toon(shade(c, -.1)), .7, .02, .34, 0, 0, .17, hinge); pt.flap = hinge;
          Cy(.07, .03, "#c4413a", 0, .06, .02, g); Q.h = .1; break;
        case "parcel": case "box": case "gift":
          var s = k === "box" ? .7 : .58;
          B(s, s, s, c, 0, 0, 0, g, .05);
          hinge = new THREE.Group(); hinge.position.set(0, s, -s / 2); g.add(hinge);
          ol(mesh(G.box, toon(shade(c, k === "gift" ? -.1 : .08)), s + .06, .1, s + .06, 0, .05, s / 2, hinge), .04); pt.lid = hinge;
          if (k !== "box") {
            var rc = k === "gift" ? "#f6d33a" : "#efe2c0";
            B(s + .02, s + .02, .08, rc, 0, -.01, 0, g); B(.08, s + .02, s + .02, rc, 0, -.01, 0, g);
            if (k === "gift") { [-1, 1].forEach(function (q) { var bw = ol(mesh(G.sph, toon(rc), .13, .09, .07, q * .12, .14, s / 2, hinge), .02); bw.rotation.z = q * .5; }); }
          }
          Q.h = s + .1; break;
        case "lock":
          B(.52, .42, .26, c, 0, 0, 0, g, .05);
          var kh = mesh(G.cyl, toon("#2a2430"), .05, .3, .05, 0, .22, .13, g); kh.rotation.x = Math.PI / 2;
          hinge = new THREE.Group(); hinge.position.set(-.16, .42, 0); g.add(hinge);
          ol(mesh(G.arc, toon("#c9ccd6"), .16, .16, .2, .16, 0, 0, hinge), .03); pt.shackle = hinge;
          Q.h = .62; break;
        case "key":
          ol(mesh(G.ring, toon(c), .13, .13, .18, 0, .58, 0, g), .03);
          B(.06, .44, .06, c, 0, .02, 0, g, .03); B(.14, .06, .06, c, .07, .06, 0, g, .02); B(.1, .06, .06, c, .05, .17, 0, g, .02);
          Q.h = .75; break;
        case "stamp":
          B(.42, .12, .3, c, 0, .04, 0, g, .04); B(.4, .04, .28, "#c4413a", 0, 0, 0, g);
          Cy(.06, .3, "#5a3a22", 0, .16, 0, g, .03); Sp(.13, c, 0, .52, 0, g, .03); Q.h = .66; break;
        case "gauge":
          B(.44, .08, .44, "#4a4f62", 0, 0, 0, g, .04);
          Cy(.11, 1.12, "#eef3f7", 0, .1, 0, g, .05);
          pt.fill = mesh(G.cyl, toon(c), .07, 1, .07, 0, .14, 0, g); pt.fill.geometry = G.cyl;
          pt.bulb = Sp(.17, c, 0, .18, 0, g, .04);
          for (var tk = 1; tk < 5; tk++) B(.08, .02, .02, "#4a4f62", .13, .1 + tk * .22, .02, g);
          Q.h = 1.3; break;
        case "counter":
          B(.95, .55, .28, c, 0, .06, 0, g, .05); B(.82, .4, .02, glow("#173a2a", .5), 0, .13, .14, g);
          B(.12, .06, .2, "#4a4f62", -.3, 0, 0, g); B(.12, .06, .2, "#4a4f62", .3, 0, 0, g); Q.h = .65; break;
        case "cabinet":
          B(.78, 1.38, .62, c, 0, 0, 0, g, .05);
          for (var dr = 0; dr < 3; dr++) {
            var dg = new THREE.Group(); dg.position.set(0, .12 + dr * .43, .31); g.add(dg);
            ol(mesh(G.box, toon(shade(c, .08)), .68, .36, .06, 0, .18, 0, dg), .03); mesh(G.box, toon("#4a4f62"), .2, .05, .05, 0, .24, .04, dg);
            if (dr === 2) pt.drawer = dg;
          }
          Q.h = 1.4; break;
        case "coin":
          for (var cn = 0; cn < 3; cn++) Cy(.22, .065, c, (cn % 2) * .03, cn * .07, 0, g, .03);
          var cs = ol(mesh(G.cyl, toon(c), .2, .06, .2, .3, .2, 0, g), .03); cs.rotation.x = Math.PI / 2; Q.h = .42; break;
        case "document":
          var dc = B(.5, .7, .02, c, 0, 0, 0, g, .03); dc.rotation.x = -.15;
          for (var ln = 0; ln < 4; ln++) B(.36 - (ln === 3 ? .14 : 0), .03, .01, "#8a8796", -(ln === 3 ? .07 : 0), .48 - ln * .1, .02, g);
          Q.h = .72; break;
        case "shield":
          var sd = ol(mesh(G.cyl, toon(c), .42, .1, .42, 0, .48, 0, g), .05); sd.rotation.x = Math.PI / 2;
          B(.1, .5, .04, "#ffffff", 0, .23, .06, g); B(.42, .1, .04, "#ffffff", 0, .5, .06, g); Q.h = .92; break;
        case "magnifier":
          ol(mesh(G.ring, toon(c), .22, .22, .22, 0, .58, 0, g), .03);
          mesh(G.cyl, new THREE.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: .35 }), .21, .02, .21, 0, .58, 0, g).rotation.x = Math.PI / 2;
          var mh = Cy(.045, .36, "#5a3a22", .1, .0, 0, g, .03); mh.rotation.z = -.3; Q.h = .84; break;
        case "clock":
          var fc = ol(mesh(G.cyl, toon(c), .32, .08, .32, 0, .5, 0, g), .05); fc.rotation.x = Math.PI / 2;
          pt.mh = new THREE.Group(); pt.mh.position.set(0, .5, .06); g.add(pt.mh); mesh(G.box, toon("#2a2430"), .03, .24, .02, 0, .1, 0, pt.mh);
          pt.hh = new THREE.Group(); pt.hh.position.set(0, .5, .06); g.add(pt.hh); mesh(G.box, toon("#c4413a"), .04, .16, .02, 0, .07, 0, pt.hh);
          B(.08, .2, .08, "#4a4f62", 0, 0, 0, g); Q.h = .84; break;
        case "server":
          B(.7, 1.2, .6, c, 0, 0, 0, g, .05);
          pt.leds = [];
          for (var sv = 0; sv < 4; sv++) { B(.6, .02, .01, "#4a5163", 0, .2 + sv * .26, .305, g); pt.leds.push(B(.05, .05, .02, glow(sv % 2 ? "#5be07a" : "#ffc145", .9), .22, .26 + sv * .26, .31, g)); }
          Q.h = 1.22; break;
        case "flag":
          Cy(.03, 1.45, "#4a4f62", 0, 0, 0, g, .02); Sp(.06, "#e8c34a", 0, 1.48, 0, g);
          pt.cloth = new THREE.Group(); pt.cloth.position.set(0, 1.18, 0); g.add(pt.cloth); ol(mesh(G.box, toon(c), .62, .38, .02, .31, 0, 0, pt.cloth), .03);
          Q.h = 1.5; break;
        case "phone":
          B(.34, .62, .06, c, 0, 0, 0, g, .04); B(.28, .5, .01, glow("#cfe8ff", .55), 0, .06, .031, g); Q.h = .64; break;
        case "laptop":
          B(.72, .04, .5, c, 0, 0, 0, g, .04);
          hinge = new THREE.Group(); hinge.position.set(0, .04, -.24); g.add(hinge);
          ol(mesh(G.box, toon(shade(c, -.25)), .72, .46, .03, 0, .23, 0, hinge), .03);
          mesh(G.box, glow("#bfe3ff", .5), .62, .36, .01, 0, .23, .02, hinge); pt.screen = hinge; Q.h = .52; break;
        case "sign":
          Cy(.05, 1.3, "#7a5a3a", 0, 0, 0, g, .03); B(1.15, .5, .06, c, 0, .82, 0, g, .05); Q.h = 1.38; break;
        case "orb":
          pt.orb = Sp(.3, glow(c, .8), 0, .52, 0, g, .04);
          pt.halo = mesh(G.sph, new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: .22, depthWrite: false }), .44, .44, .44, 0, .52, 0, g); Q.h = .9; break;
        case "ticket":
          var tkt = B(.58, .32, .03, c, 0, 0, 0, g, .03); tkt.rotation.x = -.1;
          B(.02, .26, .01, "#8a6a2a", .15, .03, .02, g); Sp(.05, "#ffffff", -.1, .16, .02, g); Q.h = .34; break;
        case "book":
          B(.5, .06, .66, c, 0, 0, 0, g, .04); B(.46, .08, .62, "#fbfaf5", .01, .05, 0, g);
          hinge = new THREE.Group(); hinge.position.set(-.25, .13, 0); g.add(hinge);
          ol(mesh(G.box, toon(c), .5, .04, .66, .25, 0, 0, hinge), .03); pt.cover = hinge; Q.h = .2; break;
        case "bulb":
          Cy(.12, .2, "#8c95a3", 0, 0, 0, g, .03);
          pt.glass = Sp(.27, c, 0, .44, 0, g, .04); pt.on = glow("#ffe27a", 1.1); pt.off = toon(c); Q.h = .74; break;
        case "hook":
          Cy(.012, .8, "#4a4f62", 0, .62, 0, g); Cy(.04, .44, c, 0, .2, 0, g, .03);
          var hk = ol(mesh(G.arc, toon(c), .14, .14, .18, .14, .22, 0, g), .03); hk.rotation.z = Math.PI;
          var pnt = mesh(G.cone, toon(c), .05, .14, .05, .28, .28, 0, g); pnt.rotation.z = 0; Q.h = 1.4; break;
        default:
          Sp(.3, c, 0, .3, 0, g, .04);
      }
      return Q;
    }
    function updateProp(Q, r, tm) {
      var pt = Q.parts, o = r.open;
      if (pt.flap) pt.flap.rotation.x = -2.3 * o;
      if (pt.lid) { pt.lid.rotation.x = -1.9 * o; if (Q.p.kind === "gift") pt.lid.position.y = Q.h - .1 + .3 * o; }
      if (pt.shackle) { pt.shackle.position.y = .42 + .16 * o; pt.shackle.rotation.y = -1.4 * o; }
      if (pt.drawer) pt.drawer.position.z = .31 + .42 * o;
      if (pt.screen) pt.screen.rotation.x = lerp(Math.PI / 2 - .03, -.25, o);
      if (pt.cover) pt.cover.rotation.z = 2.7 * o;
      if (pt.glass) pt.glass.material = o > .5 ? pt.on : pt.off;
      if (pt.fill) {
        var v = typeof r.val === "number" ? clamp01(r.val) : .5, col = v < .5 ? "#3fae6a" : v < .8 ? "#e8b83a" : "#e2574c";
        pt.fill.scale.y = Math.max(.02, v * 1.02); pt.fill.position.y = .14 + pt.fill.scale.y / 2;
        pt.fill.material = toon(col); pt.bulb.material = toon(col);
      }
      if (pt.mh) { pt.mh.rotation.z = -tm * 1.6; pt.hh.rotation.z = -tm * .14; }
      if (pt.leds) pt.leds.forEach(function (l, i) { l.visible = Math.sin(tm * (3 + i) + i * 2) > -.3; });
      if (pt.cloth) pt.cloth.rotation.y = Math.sin(tm * 2.4) * .25;
      if (pt.orb) { pt.orb.position.y = .52 + Math.sin(tm * 1.8) * .06; pt.halo.position.y = pt.orb.position.y; pt.halo.scale.setScalar(.44 + Math.sin(tm * 3) * .03); }
    }

    /* ---------- sets ---------- */
    var anim = [];   /* little ambient motions: lamps, LEDs, smoke, cells */
    function buildSet(pl) {
      var g = new THREE.Group(); g.position.x = pl.x; scene.add(g);
      var sp = SETS[pl.set], s = pl.set, night = W.night;
      var win = night ? glow("#ffd98a", .7) : toon("#cfe8f5");
      B(19.4, .05, 10.5, sp.floor, 0, -.01, -1.7, g);
      function counter(x, wood, top) { B(3.8, 1.02, 1.1, wood, x, 0, -.55, g, true); B(4.05, .06, 1.25, top, x, 1.01, -.55, g, .04); }
      function tree(x, z, sc) { Cy(.22 * sc, 1.6 * sc, "#7a5a3a", x, 0, z, g, .05); Sp(1.2 * sc, W.studio ? "#b8a8e8" : "#5fae5a", x, 2.2 * sc, z, g, true); Sp(.8 * sc, W.studio ? "#c8b8f0" : "#72c06a", x + .5 * sc, 2.9 * sc, z + .2, g, .05); }
      function wall(c) { B(19, 4.2, .4, c, 0, 0, -5.8, g); }
      switch (s) {
        case "street":
          [[-5.6, "#e9b872", "#c4473a"], [0, "#9fc5e8", "#4a5a8a"], [5.6, "#f2a6a0", "#7a4a3a"]].forEach(function (h) {
            B(4.6, 4.2, 3, h[1], h[0], 0, -6.8, g, true);
            var rf = ol(mesh(G.pyr, toon(h[2]), 3.5, 1.6, 2.4, h[0], 5, -6.8, g), .06); rf.rotation.y = Math.PI / 4;
            B(1, 1.9, .1, "#6a4a3a", h[0], 0, -5.25, g, .04);
            [-1.3, 1.3].forEach(function (dx) { B(.8, .8, .08, win, h[0] + dx, 2.3, -5.26, g, .04); });
          });
          Cy(.08, 3.4, "#3a3d4a", 4.4, 0, -2.4, g, .04); var lamp = Sp(.26, glow("#fff2b0", night ? 1 : .35), 4.4, 3.55, -2.4, g, .04);
          B(.6, .8, .5, "#2f5fa8", -6.6, .6, -2.4, g, true); Cy(.07, .6, "#3a3d4a", -6.6, 0, -2.4, g);
          void lamp; break;
        case "shop":
          B(13, 4.6, 3.2, "#f3d9a4", 0, 0, -6.7, g, true);
          for (var aw = 0; aw < 7; aw++) { var st = B(1.86, .12, 1.5, aw % 2 ? "#ffffff" : "#e2574c", -5.6 + aw * 1.86, 3.5, -4.6, g); st.rotation.x = .35; }
          B(5, 2, .1, win, -2.6, .9, -5.05, g, .05); B(1.4, 2.4, .1, "#7a4a2a", 3.3, 0, -5.05, g, .04);
          counter(3.3, "#a86b3c", "#d49a5e");
          for (var j = 0; j < 4; j++) Cy(.16, .32, ["#e2574c", "#3fae6a", "#e8b83a", "#4a8fe7"][j], -5.6 + j * .5, 1.3, -4.9, g, .03);
          break;
        case "office":
          wall("#ece4d8");
          [-5, 0, 5].forEach(function (x) { B(2.2, 1.6, .08, win, x, 1.7, -5.58, g, .05); });
          B(3, .88, 1.3, "#8a6a4a", 3.1, 0, -.6, g, true); B(.7, .5, .7, "#4a4f62", 4.5, 0, -1.8, g, .04);
          B(1, 1.7, .8, "#9aa3ad", -6.4, 0, -4.6, g, true);
          Cy(.35, .5, "#c4683a", -8, 0, -3.8, g, .04); Sp(.6, "#4f9b5a", -8, 1.1, -3.8, g, true);
          break;
        case "lab":
          wall("#e3ecef");
          B(4, .96, 1.1, "#e8eef2", 3.1, 0, -.6, g, true); B(4.1, .05, 1.2, "#3d4a5c", 3.1, .96, -.6, g);
          B(6.4, .1, .7, "#b8c0c8", -4, 1.9, -5.3, g, .04);
          ["#5be07a", "#ff7ab0", "#7ac8ff", "#ffc145", "#b48aff"].forEach(function (c, i) { Cy(.17, .4, glow(c, .5), -6.6 + i * 1.3, 2, -5.3, g, .03); Sp(.12, glow(c, .5), -6.6 + i * 1.3, 2.5, -5.3, g); });
          [-7.6, -6.8].forEach(function (x, i) { Cy(.28, 2.4, glow(i ? "#7ac8ff" : "#5be07a", .45), x, 0, -3.6, g, .05); });
          break;
        case "tower":
          [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (q) { Cy(.13, 6, "#7a5a3a", -4.6 + q[0], 0, -5.2 + q[1], g, .04); });
          B(3, .25, 3, "#8a6a4a", -4.6, 6, -5.2, g, .05); B(2.4, 1.8, 2.4, "#c4473a", -4.6, 6.25, -5.2, g, true);
          var tr = ol(mesh(G.pyr, toon("#7a3a3a"), 2.1, 1.2, 2.1, -4.6, 8.65, -5.2, g), .06); tr.rotation.y = Math.PI / 4;
          Cy(.05, 1.6, "#4a4f62", -4.6, 9.2, -5.2, g);
          anim.push({ m: Sp(.15, glow("#ff5a4a", 1), -4.6, 10.9, -5.2, g), k: "blink" });
          for (var fx = -8; fx <= 8; fx += 1.6) B(.12, 1, .12, "#a08a6a", fx, 0, -7.4, g);
          B(16.2, .1, .08, "#a08a6a", 0, .8, -7.4, g);
          break;
        case "server-room":
          B(19, 4.6, .4, "#2c3140", 0, 0, -6.2, g);
          for (var r2 = 0; r2 < 6; r2++) {
            var rx = -6.4 + r2 * 2.5;
            B(1.4, 3, 1.1, "#1f2430", rx, 0, -4.7, g, true);
            for (var ld = 0; ld < 5; ld++) anim.push({ m: B(.08, .08, .02, glow(ld % 2 ? "#5be07a" : "#7ac8ff", 1), rx - .45 + (ld % 3) * .3, .5 + ld * .5, -4.14, g), k: "led", ph: r2 * 1.3 + ld });
          }
          B(15, .14, .6, "#5a6070", 0, 3.6, -4.7, g);
          break;
        case "classroom":
          wall("#f0e6d2");
          B(6.3, 2.9, .1, "#8a6a4a", -.5, .95, -5.5, g, .04); B(6, 2.6, .12, "#2f4a3a", -.5, 1.1, -5.42, g);
          [[-2.4, 2.4, 1.6], [-.8, 2.9, 1.1], [.6, 2.2, 1.8]].forEach(function (q) { B(q[2], .06, .02, "#e8f0e8", q[0], q[1], -5.34, g); });
          B(2.6, .9, 1.1, "#9a7a52", 3.5, 0, -1.2, g, true);
          [-7, 7].forEach(function (x) { B(1.2, .7, .8, "#c49a62", x, 0, -1.6, g, .05); B(1.2, .7, .8, "#c49a62", x, 0, .4, g, .05); });
          break;
        case "gate":
          [-1, 1].forEach(function (q) {
            B(6.2, 3.6, 1, "#b9a98a", q * 5.7, 0, -4.6, g, true);
            for (var cr = 0; cr < 4; cr++) B(.7, .5, 1, "#b9a98a", q * (3.2 + cr * 1.6), 3.6, -4.6, g, .05);
            B(.9, 4.6, 1.2, "#a39272", q * 2.1, 0, -4.6, g, true);
            B(1.6, 3.4, .2, "#7a5a3a", q * .82, 0, -4.6, g, .04);
          });
          B(5.2, .8, 1.2, "#a39272", 0, 4, -4.6, g, true);
          B(1.6, 2.6, 1.6, "#c4473a", 4.9, 0, -2.4, g, true); B(2, .2, 2, "#7a3a3a", 4.9, 2.6, -2.4, g, .05);
          break;
        case "home":
          B(7, 3.6, 4, "#f3e3c3", -2.6, 0, -6.2, g, true);
          var hr = ol(mesh(G.pyr, toon("#b5544a"), 5.4, 2, 3.4, -2.6, 4.6, -6.2, g), .06); hr.rotation.y = Math.PI / 4;
          B(1.1, 2, .1, "#6a4a3a", -2.6, 0, -4.15, g, .04); [-4.6, -.6].forEach(function (x) { B(1.1, 1, .08, win, x, 1.6, -4.16, g, .04); });
          B(.6, 1.4, .6, "#a0523f", -.9, 4.4, -6.8, g, .05);
          B(1.8, .8, 1, "#a07850", 3.4, 0, -.7, g, true);
          tree(6.8, -4.6, 1);
          for (var fp = 2; fp <= 9; fp += .9) B(.14, .8, .1, "#ffffff", fp, 0, -6.6, g);
          break;
        case "bank":
          B(14, 5.2, 3.4, "#e8e2d4", 0, 0, -7.1, g, true);
          B(14.6, .5, 3.8, "#d9d2c2", 0, 5.2, -7.1, g, .05); B(12, .6, 3.2, "#e8e2d4", 0, 5.7, -7.1, g, .05); B(8, .5, 2.6, "#d9d2c2", 0, 6.3, -7.1, g, .05);
          B(14.4, .22, 1.3, "#d3ccbc", 0, 0, -4.9, g, .04);
          [-5.5, -3.3, -1.1, 1.1, 3.3, 5.5].forEach(function (x) { Cy(.32, 4.3, "#f4f0e6", x, .22, -5.1, g, .05, G.cyl6); });
          B(14.2, .5, 1, "#e8e2d4", 0, 4.5, -5.1, g, .05);
          B(1.7, 2.9, .1, "#5a4a3a", 0, .22, -5.42, g, .04);
          var vault = ol(mesh(G.cyl, toon("#9aa3ad"), .9, .15, .9, -3.3, 2.1, -5.4, g), .05); vault.rotation.x = Math.PI / 2;
          counter(3.4, "#7a5a3a", "#ece8e0");
          break;
        case "park":
          [[-7.4, -5.2, 1], [-4.2, -6.6, 1.2], [5.8, -6.2, 1.1], [8, -4, .9]].forEach(function (q) { tree(q[0], q[1], q[2]); });
          B(2, .45, .6, "#8a5a3a", -5.6, .3, -2, g, .04); B(2, .6, .1, "#8a5a3a", -5.6, .75, -2.3, g, .04);
          var pond = mesh(G.cyl, toon("#7cc4e8"), 2.3, .04, 1.3, 4.4, .03, -3, g); void pond;
          ["#f2a6a0", "#f6d33a", "#b48aff"].forEach(function (c, i) { Sp(.14, c, -2 + i * .5, .15, -4.4, g); Sp(.14, c, 2 + i * .6, .15, -4.8, g); });
          break;
        case "factory":
          B(16, 4.4, 3, "#c9c2b4", 0, 0, -7.2, g, true);
          for (var sw = 0; sw < 5; sw++) { var tooth = ol(mesh(G.box, toon("#8a929e"), 3.2, .9, 3, -6.4 + sw * 3.2, 4.7, -7.2, g), .05); tooth.rotation.z = .25; }
          Cy(.5, 4.2, "#8a4a3a", 5.6, 4.4, -7.4, g, true);
          for (var sm = 0; sm < 3; sm++) anim.push({ m: Sp(.5, "#e8e4ea", 5.6, 9, -7.4, g, .04), k: "smoke", ph: sm / 3 });
          B(7, .8, 1.2, "#555b66", .7, 0, -1, g, true); B(7.1, .1, 1.02, "#2a2d33", .7, .82, -1, g);
          for (var rl = 0; rl < 7; rl++) { var rlr = mesh(G.cyl, toon("#8a929e"), .12, 1.06, .12, -2.4 + rl, .7, -1, g); rlr.rotation.x = Math.PI / 2; }
          B(2, 2.4, 1.8, "#e0a33a", 5.4, 0, -1.4, g, true); Cy(.18, 1.6, "#8a929e", 5.9, 2.4, -1.4, g, .04);
          break;
        case "organic":
          [[-6.4, 1.6, -5.4, "#f6a5b3"], [-2.8, 1.1, -6.6, "#f8c2a2"], [5.6, 1.9, -6, "#f29aa8"], [2, .9, -7.2, "#e8a0c8"], [8.2, 1.2, -3.8, "#f6b0a0"]].forEach(function (q) {
            Sp(q[1], q[3], q[0], q[1] * .9, q[2], g, true, .85);
            Sp(q[1] * .38, shade(q[3], -.3), q[0] + q[1] * .25, q[1] * .95, q[2] + q[1] * .62, g, .04);
          });
          var ves = ol(mesh(G.cyl, toon("#d9606e"), .9, 22, .9, 0, 3.8, -8.8, g), .06); ves.rotation.z = Math.PI / 2;
          for (var rb = 0; rb < 6; rb++) { var cell = mesh(G.cyl, toon("#b8323e"), .4, .14, .4, 0, 3.8, -7.95, g); cell.rotation.x = Math.PI / 2; anim.push({ m: cell, k: "flow", ph: rb / 6 }); }
          break;
        case "stage":
          Cy(7.6, .3, "#cfc3ef", 0, -.28, -1, g, true);
          for (var pn = 0; pn < 7; pn++) {
            var an = -1 + pn / 6 * 2, px = Math.sin(an) * 9, pz = -1 - Math.cos(an) * 7.5;
            var panel = B(2.4, 4 + (pn % 2) * 1.2, .3, ["#b8a8e8", "#f2b6c8", "#a8d8e8", "#f6d6a0"][pn % 4], px, 0, pz, g, .05); panel.rotation.y = -an;
          }
          [[-6, 4.6, -6, "#ffd666"], [6.4, 5.2, -5.6, "#7ac8ff"], [0, 6.2, -8, "#ff9ab8"]].forEach(function (q, i) { anim.push({ m: Sp(.4, glow(q[3], .5), q[0], q[1], q[2], g, .04), k: "bob", ph: i }); });
          break;
      }
      pl.g = g;
      return g;
    }
    function tickAnim(tm, rm) {
      anim.forEach(function (a) {
        var m = a.m;
        if (a.k === "blink") m.visible = Math.sin(tm * 3) > 0;
        else if (a.k === "led") m.visible = Math.sin(tm * 2.3 + a.ph * 1.7) > -.2;
        else if (rm) return;
        else if (a.k === "smoke") { var p = (tm * .18 + a.ph) % 1; m.position.y = 8.7 + p * 4; m.position.x = 5.6 + p * 1.6; m.scale.setScalar(.35 + p * .9); }
        else if (a.k === "flow") { m.position.x = -10 + ((tm * .12 + a.ph) % 1) * 20; }
        else if (a.k === "bob") m.position.y += Math.sin(tm * 1.3 + a.ph) * .004;
      });
    }

    /* ---------- the town: ground, road, fillers between places, hills, sky ---------- */
    var span = (C.places.length - 1) * SPACING + 40;
    var ground = mesh(G.plane, toon(W.ground), 420, 420, 1, 0, -.03, 0, scene); ground.rotation.x = -Math.PI / 2;
    if (!W.studio) {
      B(span, .02, 4.2, W.road, 0, -.02, 6.4, scene);
      for (var dx = -span / 2 + 1; dx < span / 2; dx += 3) B(1.3, .01, .14, "#efece2", dx, 0, 6.4, scene);
      B(span, .07, 1.4, "#d6d0c4", 0, -.02, 3.85, scene);
    } else B(span, .02, 5, W.road, 0, -.02, 6, scene);
    var R0 = rng(11);
    C.places.forEach(function (p, i) {
      buildSet(C.PL[p.id]);
      {
        [i === 0 ? C.PL[p.id].x - SPACING / 2 : null, C.PL[p.id].x + SPACING / 2].forEach(function (x) {
          if (x === null) return;
          if (W.studio) { Sp(.7, "#c8b8f0", x, 2.6, -3, scene, .05); return; }
          Cy(.25, 1.7, "#7a5a3a", x, 0, -4.5 - R0(), scene, .05); Sp(1.3, "#5fae5a", x, 2.3, -4.5, scene, true);
          Sp(.8, "#4f9b4a", x - .9, .6, -1.5, scene, .05); Sp(.6, "#6fbf62", x + .7, .5, -1, scene, .05);
          Cy(.08, 3.2, "#3a3d4a", x, 0, 3.3, scene, .04); Sp(.24, glow("#fff2b0", W.night ? 1 : .3), x, 3.3, 3.3, scene, .04);
        });
      }
    });
    for (var h = 0; h < 9; h++) { var hx = -80 + h * 20 + R0() * 8; mesh(G.lo, toon(shade(W.hill, (h % 3) * .06 - .04)), 16 + R0() * 10, 7 + R0() * 6, 9, hx, -1, -52 - R0() * 10, scene); }
    if (!W.night) for (var cl = 0; cl < 7; cl++) { var cg = new THREE.Group(); cg.position.set(-70 + cl * 24 + R0() * 10, 20 + R0() * 6, -60 - R0() * 20); scene.add(cg); for (var cp = 0; cp < 3; cp++) mesh(G.lo, new THREE.MeshBasicMaterial({ color: W.studio ? 0xffffff : 0xffffff, fog: false }), 3 + R0() * 2, 1.8, 2.4, cp * 2.6 - 2.6, R0(), 0, cg); anim.push({ m: cg, k: "none" }); }
    else {
      var sg = new THREE.BufferGeometry(), pos = [];
      for (var sn = 0; sn < 260; sn++) pos.push((R0() - .5) * 300, 15 + R0() * 60, -60 - R0() * 60);
      sg.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
      scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: .6, fog: false })));
    }

    /* ---------- links, confetti, a stamp tool ---------- */
    var beadGeo = G.lo, linkPool = {};
    function linkMesh(L) {
      if (linkPool[L.key]) return linkPool[L.key];
      var c = TONE[L.tone] || TONE.info, beads = [], pulses = [];
      for (var b = 0; b < 26; b++) { var m = mesh(beadGeo, glow(c, .35), .11, .11, .11, 0, 0, 0, scene); beads.push(m); }
      for (var q = 0; q < 3; q++) pulses.push(ol(mesh(G.sph, glow(c, 1), .24, .24, .24, 0, 0, 0, scene), .04));
      return (linkPool[L.key] = { beads: beads, pulses: pulses });
    }
    var confetti = [];
    var cfCols = ["#e2574c", "#ffd666", "#3fae6a", "#4a8fe7", "#b48aff", "#ff9ab8"];
    for (var cf = 0; cf < 36; cf++) { var cm = mesh(G.plane, new THREE.MeshBasicMaterial({ color: cfCols[cf % 6], side: THREE.DoubleSide }), .14, .09, 1, 0, -20, 0, scene); cm.visible = false; confetti.push(cm); }
    var tool = new THREE.Group(); scene.add(tool); tool.visible = false;
    B(.3, .1, .22, "#7a4a2a", 0, 0, 0, tool, .03); B(.28, .03, .2, "#c4413a", 0, -.03, 0, tool); Cy(.05, .2, "#5a3a22", 0, .1, 0, tool, .02); Sp(.1, "#7a4a2a", 0, .34, 0, tool, .02);

    return { scene: scene, buildActor: buildActor, buildProp: buildProp, updateProp: updateProp, drawFace: drawFace, tickAnim: tickAnim,
      linkMesh: linkMesh, linkPool: linkPool, confetti: confetti, tool: tool, G: G, toon: toon };
  }

  /* ---------- voices: the device's own (ranked and cast) or an opt-in neural voice ---------- */
  var TONE_SET = {   /* rate, pitch, loudness, pause factor */
    calm: [.93, 1, 1, 1.25], warm: [.97, 1.02, 1, 1.05], urgent: [1.1, 1.04, 1, .7], wry: [.98, .97, 1, 1.15],
    whisper: [.9, .96, .55, 1.2], excited: [1.1, 1.08, 1, .8], serious: [.92, .95, 1, 1.15], sad: [.88, .93, .9, 1.35]
  };
  var MOOD_TONE = { happy: "excited", sad: "sad", worried: "urgent", scared: "whisper", smug: "wry", suspicious: "serious", surprised: "excited", angry: "urgent", thinking: "calm" };
  var FEMALE = /\b(google us english|samantha|karen|moira|tessa|veena|fiona|victoria|allison|ava|susan|zoe|kate|serena|nicky|joelle|noelle|evelyn|catherine|ellen|aria|jenny|michelle|libby|sonia|natasha|clara|emma|ashley|cora|elizabeth|jane|nancy|sara|sarah|hazel|zira|heera|linda|monica|paulina|amelie|anna|alice|female|woman|ana|emily|isabella|olivia|sophia|maisie|molly|hannah|shelley|sandy|grandma|flo|kathy|princess|vicki|agnes)\b/i;
  var MALE = /\b(daniel|alex|aaron|arthur|fred|gordon|lee|oliver|rishi|thomas|tom|evan|nathan|reed|rocko|guy|davis|ryan|christopher|eric|roger|steffan|andrew|brian|jason|tony|william|liam|mark|david|george|james|richard|sean|jorge|diego|luca|xander|male|man|grandpa|eddy|ralph|junior|albert|bruce|jacques|thierry)\b/i;
  var NOVELTY = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|junior|ralph|fred|kathy|princess|deranged|hysterical|pipe organ|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;
  /* Kokoro voices, best first by the model card's grades; the narrator takes the head of its list */
  var KOKORO = { female: ["af_heart", "af_bella", "bf_emma", "af_nicole", "af_sarah", "af_kore", "af_aoede", "bf_isabella"],
    male: ["am_michael", "am_fenrir", "am_puck", "bm_george", "bm_fable", "am_echo", "bm_lewis", "am_eric"] };
  var KOKORO_MODEL = "onnx-community/Kokoro-82M-v1.0-ONNX";

  /* phrases with the silence after each: sentence ends breathe, "..." holds longer */
  function phrases(text) {
    var out = [], re = /([^.!?…]+(?:\.\.\.|…|[.!?]+)?)\s*/g, m;
    while ((m = re.exec(text))) {
      var p = m[1].trim();
      if (!p) continue;
      var gap = /(\.\.\.|…)$/.test(p) ? .7 : /\?$/.test(p) ? .42 : /[.!]$/.test(p) ? .34 : .2;
      out.push({ text: p.replace(/(\.\.\.|…)$/, ","), gap: gap });
    }
    if (out.length) out[out.length - 1].gap = 0;
    return out;
  }
  function rankVoices(list, lang) {
    var base = lang.split("-")[0], nav = ((root.navigator && root.navigator.language) || "").toLowerCase();
    var scored = list.map(function (v) {
      var l = (v.lang || "").toLowerCase().replace("_", "-"), n = v.name || "", s = 0;
      if (l === lang) s += 30; else if (l.split("-")[0] === base) s += 20; else s -= 100;
      if (l === nav) s += 4; else if (lang === base && l === base + "-us") s += 2;   /* the reader's own accent, else the widest one */
      if (/^(samantha|daniel|alex|ava|allison|susan|tom|serena|karen|moira|aria|jenny|guy|libby|sonia|ryan)\b/i.test(n.replace(/^(microsoft|google)\s+/i, ""))) s += 3;
      if (/online \(natural\)|natural/i.test(n)) s += 12;
      if (/neural/i.test(n)) s += 11;
      if (/premium/i.test(n)) s += 10;
      if (/enhanced/i.test(n)) s += 8;
      if (/siri/i.test(n)) s += 7;
      if (/^google/i.test(n)) s += 6;
      if (/compact|espeak/i.test(n)) s -= 4;
      if (NOVELTY.test(n.replace(/^microsoft\s+/i, ""))) s -= 200;
      if (v["default"]) s += 1;
      var g = FEMALE.test(n) ? "female" : MALE.test(n) ? "male" : "";
      return { v: v, s: s, g: g };
    }).filter(function (x) { return x.s > -50; });
    scored.sort(function (a, b) { return b.s - a.s; });
    return scored;
  }

  function makeVoice(data, actors, coarse, onStatus) {
    var synth = root.speechSynthesis && root.SpeechSynthesisUtterance ? root.speechSynthesis : null;
    var lang = (data.lang || "en").toLowerCase(), english = lang.split("-")[0] === "en";
    var nar = data.narrator || {}, narGender = nar.voice || "female", narTone = nar.tone || "warm";
    var V = { kind: "system", speed: 1, system: !!synth, english: english, status: "", progress: 0, ready: false, cached: false, names: {} };
    var tok = 0, busyUntil = 0, pending = 0, lastWho = "", lastEnd = 0, timer = 0;
    function now() { return (root.performance ? root.performance.now() : Date.now()) / 1000; }
    function gendersFor() {   /* each actor's kind of voice: as written, else alternating, starting opposite the narrator */
      var g = {}, k = 0;
      actors.forEach(function (a) { g[a.id] = a.voice || ((k++ % 2 === 0) === (narGender === "female") ? "male" : "female"); });
      return g;
    }
    /* --- the device's voices --- */
    var cast = {}, sysList = [];
    function castSystem() {
      if (!synth) return;
      var ranked = rankVoices(synth.getVoices() || [], lang), used = {}, gs = gendersFor();
      sysList = ranked;
      if (!ranked.length) return;
      function pick(g, avoid) {
        var best = null;
        ranked.forEach(function (r) { if (!best && !used[r.v.name] && (r.g === g || !r.g) && r.v !== avoid) best = r; });
        if (!best) ranked.forEach(function (r) { if (!best && (r.g === g || !r.g)) best = r; });
        return best || ranked[0];
      }
      var n = pick(narGender); used[n.v.name] = 1; cast[""] = { v: n.v, pitch: 1 };
      actors.forEach(function (a, i) {
        var r = pick(gs[a.id], n.v); used[r.v.name] = 1;
        var reuse = Object.keys(cast).some(function (k) { return cast[k].v === r.v; });
        cast[a.id] = { v: r.v, pitch: Math.max(.6, Math.min(1.5, (PRESETS[a.preset].pitch || 1) * (reuse ? 1 + ((i % 3) - 1) * .08 : 1))) };
      });
      V.names = {}; Object.keys(cast).forEach(function (k) { V.names[k] = cast[k].v.name; });
    }
    if (synth) { castSystem(); try { synth.onvoiceschanged = castSystem; } catch (e) {} }

    function sysSay(item, t) {
      var c = cast[item.who || ""] || { v: null, pitch: 1 }, tn = TONE_SET[item.tone] || TONE_SET.warm, list = phrases(item.text), k = 0;
      var my = ++tok;
      busyUntil = now() + 3 + words(item.text) / 2.4 / (tn[0] * V.speed);
      function next() {
        if (my !== tok) return;
        if (k >= list.length) { busyUntil = 0; return; }
        var ph = list[k++], u = new root.SpeechSynthesisUtterance(ph.text);
        if (c.v) { u.voice = c.v; u.lang = c.v.lang; } else u.lang = lang;
        u.rate = Math.min(1.8, tn[0] * V.speed); u.pitch = Math.min(2, c.pitch * tn[1]); u.volume = tn[2];
        u.onend = u.onerror = function () { if (my !== tok) return; timer = root.setTimeout(next, ph.gap * tn[3] * 1000 / V.speed); };
        busyUntil = Math.max(busyUntil, now() + 2 + words(ph.text) / 2 / u.rate);
        try { synth.speak(u); } catch (e) { busyUntil = 0; }
      }
      timer = root.setTimeout(next, t * 1000);
    }

    /* --- the neural voice: Kokoro in a worker, PCM played through Web Audio --- */
    var worker = null, ctx = null, jobs = [], working = null, made = {}, kCast = {}, sources = [], loadP = null, gain = null;
    function audio() {
      if (!ctx) { var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return null; ctx = new AC(); gain = ctx.createGain(); gain.connect(ctx.destination); }
      if (ctx.state === "suspended") { try { ctx.resume(); } catch (e) {} }
      return ctx;
    }
    V.unlock = function () { if (V.kind === "natural") audio(); };
    function castKokoro() {
      var gs = gendersFor(), used = {}, n = KOKORO[narGender][0];
      used[n] = 1; kCast[""] = { voice: n, rate: 1 };
      actors.forEach(function (a) {
        var pool = KOKORO[gs[a.id]], v = null;
        pool.forEach(function (x) { if (!v && !used[x]) v = x; });
        v = v || pool[1]; used[v] = 1;
        var p = PRESETS[a.preset].pitch || 1;
        kCast[a.id] = { voice: v, rate: Math.max(.94, Math.min(1.07, 1 + (p - 1) * .15)) };
      });
    }
    castKokoro();
    V.kokoroCast = kCast;
    V.lib = null;
    V.gpu = null; V.useGpu = true;
    V.sizeText = function () { return V.gpu && V.useGpu ? "about 330 MB" : "about 98 MB"; };
    try {
      if (root.navigator && root.navigator.gpu) root.navigator.gpu.requestAdapter().then(function (a) { V.gpu = !!a; onStatus(); }, function () { V.gpu = false; });
      else V.gpu = false;
    } catch (e) { V.gpu = false; }
    V.checkCache = function (cb) {
      try {
        root.caches.open("transformers-cache").then(function (c) { return c.keys(); }).then(function (ks) {
          var file = V.gpu && V.useGpu ? /\/onnx\/model\.onnx$/ : /\/onnx\/model_quantized\.onnx$/;
          V.cached = ks.some(function (r) { return /Kokoro-82M/.test(r.url) && file.test(r.url); });
          cb(V.cached);
        }, function () { cb(false); });
      } catch (e) { cb(false); }
    };
    V.load = function () {
      if (loadP) return loadP;
      loadP = new Promise(function (resolve, reject) {
        if (!english) return reject(new Error("the natural voice speaks English only"));
        if (!root.Worker || !root.Blob || !root.URL) return reject(new Error("this browser cannot run it"));
        var files = {};
        var code = [
          "var tts = null;",
          "onmessage = function (e) {",
          "  var d = e.data;",
          "  if (d.type === 'load') {",
          "    import(d.src).then(function (m) {",
          "      try { m.env.backends.onnx.logLevel = 'error'; } catch (e) {}",
          "      return m.KokoroTTS.from_pretrained(d.model, { dtype: d.dtype, device: d.device, progress_callback: function (p) { postMessage({ type: 'progress', p: { file: p.file, loaded: p.loaded, total: p.total, status: p.status } }); } });",
          "    }).then(function (t) { tts = t; postMessage({ type: 'ready' }); }, function (err) { postMessage({ type: 'fail', message: String(err && err.message || err) }); });",
          "  } else if (d.type === 'gen') {",
          "    tts.generate(d.text, { voice: d.voice, speed: d.speed }).then(function (a) {",
          "      postMessage({ type: 'audio', id: d.id, pcm: a.audio, rate: a.sampling_rate }, [a.audio.buffer]);",
          "    }, function (err) { postMessage({ type: 'error', id: d.id, message: String(err && err.message || err) }); });",
          "  }",
          "};"].join("\n");
        try { worker = new root.Worker(root.URL.createObjectURL(new root.Blob([code], { type: "text/javascript" }))); }
        catch (e) { return reject(e); }
        worker.onerror = function (e) { reject(new Error(e.message || "the voice worker stopped")); };
        worker.onmessage = function (e) {
          var d = e.data;
          if (d.type === "progress") {
            if (d.p.file && d.p.total) files[d.p.file] = [d.p.loaded || 0, d.p.total];
            var l = 0, tt = 0; Object.keys(files).forEach(function (f) { l += files[f][0]; tt += files[f][1]; });
            V.progress = tt ? l / tt : 0; onStatus();
          } else if (d.type === "ready") { V.ready = true; V.cached = true; V.progress = 1; onStatus(); resolve(); pump(); }
          else if (d.type === "fail") reject(new Error(d.message));
          else if (d.type === "audio" || d.type === "error") {
            var j = working; working = null;
            if (j) { if (d.type === "audio") j.done({ pcm: d.pcm, rate: d.rate }); else j.fail(new Error(d.message)); }
            pump();
          }
        };
        var g = V.gpu && V.useGpu;   /* the graphics chip runs fp32 about ten times faster than speech; WASM runs the small q8 model at about speech speed */
        V.device = g ? "webgpu" : "wasm";
        worker.postMessage({ type: "load", src: V.lib.src, model: KOKORO_MODEL, device: V.device, dtype: g ? "fp32" : "q8" });
      });
      loadP.then(null, function () { loadP = null; if (worker) { worker.terminate(); worker = null; } });
      return loadP;
    };
    var batch = 0, order = 0;
    function pump() {
      if (working || !V.ready || !jobs.length) return;
      jobs.sort(function (a, b) { return a.pri - b.pri; });
      working = jobs.shift();
      worker.postMessage({ type: "gen", id: 1, text: working.text, voice: working.voice, speed: working.speed });
    }
    /* one PCM clip per phrase, cached; urgent requests jump the queue */
    function clip(text, who, tone, urgent) {   /* urgent: in this batch's order, ahead of everything queued before */
      var c = kCast[who || ""] || kCast[""], tn = TONE_SET[tone] || TONE_SET.warm, speed = Math.round(tn[0] * V.speed * 100) / 100;
      var key = c.voice + "|" + speed + "|" + text, pri = urgent ? -1e9 - batch * 1000 + (order++) : (order++);
      if (made[key]) { if (made[key].job && pri < made[key].job.pri) made[key].job.pri = pri; return made[key].p; }
      var job = { text: text, voice: c.voice, speed: speed, pri: pri };
      var p = new Promise(function (res, rej) { job.done = res; job.fail = rej; });
      made[key] = { p: p, job: job };
      p.then(function () { made[key].job = null; }, function () { delete made[key]; });
      jobs.push(job);
      pump();
      return p;
    }
    V.clip = clip;
    function natSay(item, t) {
      var my = ++tok, c = kCast[item.who || ""] || kCast[""], tn = TONE_SET[item.tone] || TONE_SET.warm, list = phrases(item.text);
      pending++;
      var ac = audio(); if (!ac) { pending--; return; }
      var at = Math.max(ac.currentTime + .05, lastEnd) + t;
      batch++; order = 0;
      var ps = list.map(function (ph) { return clip(ph.text, item.who, item.tone, true); });
      var k = 0;
      function next() {
        if (my !== tok) { pending = Math.max(0, pending - 1); return; }
        if (k >= ps.length) { pending = Math.max(0, pending - 1); return; }
        var ph = list[k], pr = ps[k++];
        pr.then(function (a) {
          if (my !== tok) { pending = Math.max(0, pending - 1); return; }
          var buf = ac.createBuffer(1, a.pcm.length, a.rate); buf.copyToChannel ? buf.copyToChannel(a.pcm, 0) : buf.getChannelData(0).set(a.pcm);
          var src = ac.createBufferSource(), g = ac.createGain(); src.buffer = buf; src.playbackRate.value = c.rate; g.gain.value = tn[2];
          src.connect(g); g.connect(gain);
          var start = Math.max(at, ac.currentTime + .02); src.start(start); sources.push(src);
          at = start + a.pcm.length / a.rate / c.rate + ph.gap * tn[3] / V.speed; lastEnd = at;
          next();
        }, function () { next(); });
      }
      next();
    }
    /* --- the shared surface --- */
    V.say = function (item) {
      var t = item.who !== lastWho && lastWho !== null ? .35 : .1;
      lastWho = item.who || "";
      if (V.kind === "natural" && V.ready) natSay(item, t);
      else if (synth) sysSay(item, t);
    };
    V.ahead = function (items) {
      if (V.kind !== "natural" || !V.ready) return;
      items.forEach(function (it) { phrases(it.text).forEach(function (ph) { clip(ph.text, it.who, it.tone, false); }); });
    };
    V.queued = function () { return jobs.length + (working ? 1 : 0); };
    V.batch = function () { batch++; order = 0; };
    V.busy = function () {
      if (V.kind === "natural" && V.ready) return pending > 0 || (ctx && ctx.currentTime < lastEnd - .05);
      if (busyUntil && now() > busyUntil) busyUntil = 0;
      return busyUntil > 0;
    };
    V.hush = function () {
      tok++; root.clearTimeout(timer); busyUntil = 0; pending = 0; lastWho = null;
      if (synth) try { synth.cancel(); } catch (e) {}
      sources.forEach(function (s) { try { s.stop(); } catch (e) {} }); sources = [];
      if (ctx) lastEnd = ctx.currentTime;
    };
    V.narratorTone = narTone;
    V.phrases = phrases;
    V.TONE_SET = TONE_SET;
    V.dispose = function () { V.hush(); if (worker) worker.terminate(); worker = null; if (ctx) try { ctx.close(); } catch (e) {} ctx = null; };
    V.coarse = coarse;
    return V;
  }

  /* ---------- the player ---------- */
  var SPEEDS = [.75, 1, 1.25, 1.5];
  var PACES = ["chapter", "flow", "beat"];
  var teardown = null, pseudoWanted = false;

  function render(container, data) {
    if (teardown) teardown();
    var doc = root.document, THREE = root.THREE;
    var key = storageKey(data), saved = loadState(key);
    var C = compile(data), beats = C.beats, NB = beats.length, chapters = data.chapters;
    var mq = root.matchMedia ? root.matchMedia("(prefers-reduced-motion: reduce)") : null;
    var coarse = !!(root.matchMedia && root.matchMedia("(pointer: coarse)").matches);
    var st = { phase: "intro", i: 0, t: 0, playing: false, speed: 1, voice: false, pace: data.pace || "chapter", rm: !!(mq && mq.matches),
      seen: [], done: false, wt: 0, wstage: "think", atEnd: false, voiceKind: "system" };
    if (saved) {
      if (SPEEDS.indexOf(saved.speed) !== -1) st.speed = saved.speed;
      if (saved.voice === true) st.voice = true;
      if (typeof saved.gpu === "boolean") st.gpu = saved.gpu;
      if (saved.voiceKind === "natural" || saved.voiceKind === "system") st.voiceKind = saved.voiceKind;
      if (PACES.indexOf(saved.pace) !== -1) st.pace = saved.pace;
      if (typeof saved.rm === "boolean") st.rm = saved.rm;
      if (Array.isArray(saved.seen)) st.seen = saved.seen.filter(function (n) { return typeof n === "number" && n >= 0 && n < NB && Math.floor(n) === n; });
      st.done = saved.done === true;
      if (typeof saved.i === "number" && saved.i >= 0 && saved.i < NB && Math.floor(saved.i) === saved.i) {
        st.i = saved.i;
        if (saved.phase === "beat" || saved.phase === "end") st.phase = saved.phase;
        if (saved.phase === "wrap" && chapters[beats[st.i].ci].takeaway && beats[st.i].bi === chapters[beats[st.i].ci].beats.length - 1) { st.phase = "wrap"; st.wstage = "points"; }
      }
    }
    var resumed = !!saved && st.phase !== "intro";
    function persist() {
      saveState(key, { phase: st.phase, i: st.i, speed: st.speed, voice: st.voice, voiceKind: st.voiceKind, gpu: st.gpu, pace: st.pace, rm: st.rm, seen: st.seen, done: st.done });
    }

    /* ---------- DOM ---------- */
    var head = el("header", { class: "nthview-head" }, [el("h1", { class: "nthview-title", text: data.title })].concat(data.subtitle ? [el("p", { class: "nthview-sub", text: data.subtitle })] : []));
    var canvas = el("canvas", { "aria-hidden": "true" });
    var spot = el("div", { class: "nthview-spot" });
    var layer = el("div", { class: "nthview-layer", "aria-hidden": "true" });
    var chipText = el("span");
    var chip = el("div", { class: "nthview-chip", "aria-hidden": "true" }, [icon("pin"), chipText]);
    var meetEl = el("div", { class: "nthview-chip nthview-meet", "aria-hidden": "true" });
    var tcard = el("div", { class: "nthview-tcard", "aria-hidden": "true" }, [el("span"), el("strong")]);
    var cap = el("div", { class: "nthview-cap", "aria-hidden": "true" });
    var big = el("button", { type: "button", class: "nthview-bigplay", "aria-label": "Play" }, [icon("play")]);
    var ov = el("div", { class: "nthview-ov", hidden: "" });
    var sr = el("div", { class: "nthview-sr", "aria-live": "polite" });
    var stage = el("div", { class: "nthview-stage" }, [canvas, spot, layer, chip, meetEl, tcard, cap, big, ov, sr]);
    function btn(ic, label, extra) {
      var b = el("button", { type: "button", class: "nthview-btn" + (extra ? " " + extra : ""), "aria-label": label, title: label }, ic ? [icon(ic)] : []);
      return b;
    }
    var bPlay = btn("play", "Play (Space)", "is-main"), bPrev = btn("prev", "Previous beat (Left arrow)"), bNext = btn("next", "Next beat (Right arrow)"), bReplay = btn("replay", "Replay this beat (R)");
    var track = el("div", { class: "nthview-track" }), knob = el("div", { class: "nthview-knob" }), tip = el("div", { class: "nthview-tip", hidden: "" });
    var scrub = el("div", { class: "nthview-scrub", role: "slider", tabindex: "0", "aria-label": "Story position", "aria-valuemin": "1", "aria-valuemax": String(NB) }, [track, knob, tip]);
    var segs = beats.map(function (B, i) { var s = el("div", { class: "nthview-seg" + (B.bi === 0 && i > 0 ? " is-ch" : "") }, [el("i")]); s.style.flexGrow = B.dur.toFixed(2); track.appendChild(s); return s; });
    var chNums = chapters.map(function (c, ci) { var n = el("span", { class: "nthview-chn", text: String(ci + 1), "aria-hidden": "true" }); scrub.appendChild(n); return n; });
    var pos = el("span", { class: "nthview-pos", "aria-hidden": "true" });
    var bSpeed = btn(null, "Playback speed", ""); bSpeed.textContent = "1×";
    var bVoice = btn("voice", "Read aloud (V)"); bVoice.setAttribute("aria-pressed", "false");
    var bList = btn("list", "Chapters and transcript (T)"), bCast = btn("cast", "Who's who (C)"), bSet = btn("gear", "Settings (S)"), bFull = btn("full", "Full screen (F)");
    var bRestart = restartButton(container, data, key); bRestart.classList.add("nthview-btn");
    var bar = el("div", { class: "nthview-bar" }, [bPlay, bPrev, bNext, bReplay, scrub, pos, bSpeed, bVoice, bList, bCast, bSet, bFull, bRestart]);
    var bcap = el("p", { class: "nthview-bcap" }), blines = el("ul", { class: "nthview-blines" }), bwins = el("div");
    var below = el("div", { class: "nthview-below", hidden: "" }, [bcap, blines, bwins]);
    var rotDismissed = false;
    var rotBtn = el("button", { type: "button", class: "nthview-ghost", text: "Got it" });
    var rotate = el("div", { class: "nthview-rotate", hidden: "", role: "note" }, [icon("turn"), el("span", { text: "Turn your phone sideways for a bigger picture." }), rotBtn]);
    var player = el("div", { class: "nthview-player" }, [stage, below, bar, rotate]);
    var dlgTitle = el("h2", { id: "nthview-dlg-title" }), dlgBody = el("div", { class: "nthview-dlgbody" });
    var dlgClose = btn("close", "Close (Esc)");
    var dlg = el("div", { class: "nthview-dlg", hidden: "", role: "dialog", "aria-modal": "true", "aria-labelledby": "nthview-dlg-title" }, [
      el("div", { class: "nthview-dlgbox" }, [el("div", { class: "nthview-dlghead" }, [dlgTitle, dlgClose]), dlgBody])]);
    container.appendChild(head); container.appendChild(player); container.appendChild(dlg);

    /* ---------- three.js ---------- */
    var renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true }); }
    catch (e) {
      container.innerHTML = "";
      renderErrorPanel(container, { errors: [{ path: "$", message: "this story needs WebGL, which is turned off or unavailable in this browser" }] });
      return;
    }
    var Wd = makeWorld(THREE, data, C), scene = Wd.scene;
    var camera = new THREE.PerspectiveCamera(38, 16 / 9, .1, 320);
    var ACT = {}, PRP = {}, ra = {}, rp = {};
    data.cast.forEach(function (a, i) { var A = Wd.buildActor(a, i); A.color = a.color || ACCENTS[i % ACCENTS.length]; A.idx = i; scene.add(A.g); ACT[a.id] = A; ra[a.id] = { fxs: [] }; });
    (data.props || []).forEach(function (p) { PRP[p.id] = Wd.buildProp(p); rp[p.id] = {}; });
    var rl = [], bxs = [], cfs = [];
    var V = function (x, y, z) { return new THREE.Vector3(x, y, z); };

    /* ---------- evaluate: the state at time t of beat i, from its snapshot ---------- */
    var APPLY = {
      mv: function (s, p) {
        var r = ra[s.id], e = ease(p), tf = Math.atan2(s.x1 - s.x0, s.z1 - s.z0);
        r.x = lerp(s.x0, s.x1, e); r.z = lerp(s.z0, s.z1, e);
        if (s.st) { if (p < 1) r.stumble = Math.sin(p * Math.PI); return; }
        if (p < 1) { r.f += angDiff(r.f, tf) * Math.min(1, p * s.d / .45 + .25); r.walk = e * s.d; r.wd = 1; }
        else r.f = tf;
      },
      fc: function (s, p) { ra[s.id].f = lerp(s.f0, s.f1, ease(p)); },
      md: function (s) { ra[s.id].mood = s.m; },
      av: function (s, p) { var r = ra[s.id]; if (s.x !== undefined) { r.x = s.x; r.z = s.z; r.f = s.f; } r.vis = lerp(s.v0, s.v1, p); r.pop = s.pop; },
      pv: function (s, p) {
        var r = rp[s.id];
        if (s.set) { r.holder = s.set.holder; r.at = s.set.at; if (s.set.x !== undefined) { r.x = s.set.x; r.y = s.set.y; r.z = s.set.z; } }
        r.vis = lerp(s.v0, s.v1, p); r.popv = 1;
        if (s.clear && p >= 1) r.holder = null;
      },
      ph: function (s, p) {
        var r = rp[s.id];
        if (p >= 1) { r.fly = null; if (s.to.holder) r.holder = s.to.holder; else { r.holder = null; r.x = s.to.x; r.y = s.to.y; r.z = s.to.z; } r.bump = Math.max(r.bump, 0); }
        else { r.fly = { from: r.holder ? { holder: r.holder } : { x: r.x, y: r.y, z: r.z }, to: s.to, p: p }; r.bump = 1; }
      },
      po: function (s, p) { rp[s.id].open = lerp(s.o0, s.o1, ease(p)); },
      pval: function (s, p) {
        var r = rp[s.id];
        if (s.txt) { if (p >= .5) r.text = s.v1; }
        else if (typeof s.v1 === "number") r.val = lerp(typeof s.v0 === "number" ? s.v0 : 0, s.v1, ease(p));
        else if (p >= .5) r.val = s.v1;
        r.bump = Math.max(r.bump, p < 1 ? 1 : 0); r.changed = 1;
      },
      st: function (s) { rp[s.id].stamp = s.s; rp[s.id].changed = 1; },
      fx: function (s, p) { if (p < 1) ra[s.id].fxs.push({ fx: s.fx, p: p, o: s.o }); },
      cr: function (s, p) { ra[s.id].crowd = lerp(s.n0, s.n1, ease(p)); },
      lk: function (s, p) {
        var hit = null;
        rl.forEach(function (x) { if (x.L.key === s.L.key) hit = x; });
        if (!hit) { hit = { L: s.L, v: 0 }; rl.push(hit); }
        hit.v = s.v1 ? ease(p) : 1 - ease(p);
      },
      bx: function (s, p) { if (p < 1) bxs.push({ id: s.id, p: p }); },
      cf: function (s, p) { if (p < 1) cfs.push({ id: s.id, p: p }); }
    };
    function evaluate(i, t) {
      var s0 = C.snaps[i], B = beats[i];
      Object.keys(s0.a).forEach(function (id) {
        var s = s0.a[id], r = ra[id];
        r.at = s.at; r.x = s.x; r.z = s.z; r.f = s.f; r.mood = s.mood; r.vis = s.vis; r.crowd = s.crowd;
        r.walk = 0; r.wd = 0; r.pop = 0; r.stumble = 0; r.fxs.length = 0;
      });
      Object.keys(s0.p).forEach(function (id) {
        var s = s0.p[id], r = rp[id];
        r.at = s.at; r.holder = s.holder; r.x = s.x; r.y = s.y; r.z = s.z; r.vis = s.vis; r.open = s.open; r.val = s.val; r.text = s.text; r.stamp = s.stamp;
        r.fly = null; r.bump = 0; r.popv = 0; r.changed = 0;
      });
      rl = s0.links.map(function (L) { return { L: L, v: 1 }; });
      bxs = []; cfs = [];
      for (var k = 0; k < B.segs.length; k++) {
        var sg = B.segs[k];
        if (t < sg.t0) break;
        APPLY[sg.k](sg, sg.t1 > sg.t0 ? clamp01((t - sg.t0) / (sg.t1 - sg.t0)) : 1, t);
      }
      rl = rl.filter(function (x) { return x.v > .001; });
    }

    /* ---------- posing ---------- */
    var clock = 0, tmpV = V(0, 0, 0), tmpW = V(0, 0, 0);
    var FORM = [[-1.3, -1.1], [1.3, -1.1], [-2.5, .1], [2.5, .1], [0, -2.1], [-2.6, -2.2], [2.6, -2.2], [-3.8, -1]];
    function holding() { var h = {}; Object.keys(rp).forEach(function (id) { if (rp[id].holder && rp[id].vis > .01 && !PRP[id].win) h[rp[id].holder] = 1; }); return h; }
    function poseActor(A, r, hold, talking) {
      var rm = st.rm, tm = clock + A.seed, blob = !A.legs;
      var lift = 0, bob = rm ? 0 : Math.sin(tm * 2.1) * .025, pitch = 0, tiltZ = 0, lean = 0, jx = 0, leg = 0, swing = 0;
      var aL = [0, -.12], aR = [0, .12];
      if (r.wd) { var ph = r.walk * 2.7; leg = Math.sin(ph) * .62; swing = -leg * .8; lift = Math.abs(Math.cos(ph)) * (blob ? .28 : .07); }
      switch (r.mood) {
        case "sad": pitch = .3; lean = .06; break;
        case "happy": lift += rm ? 0 : Math.abs(Math.sin(tm * 3)) * .03; pitch = -.06; break;
        case "angry": lean = .14; aL = [-.2, -.35]; aR = [-.2, .35]; break;
        case "smug": tiltZ = .15; pitch = -.12; aL = [.1, -.25]; break;
        case "suspicious": tiltZ = -.13; lean = .05; break;
        case "thinking": tiltZ = .18; aR = [-2.3, -.55]; break;
        case "worried": aL = [-.55, .4]; aR = [-.55, -.4]; break;
        case "scared": aL = [-.9, .5]; aR = [-.9, -.5]; jx = rm ? 0 : Math.sin(tm * 50) * .015; break;
        case "surprised": aL = [-.2, -.7]; aR = [-.2, .7]; pitch = -.12; break;
      }
      if (hold) aR = [-.95, .05];
      r.fxs.forEach(function (f) {
        var p = f.p, k = Math.sin(Math.PI * p);
        switch (f.fx) {
          case "hop": lift += k * .32; break;
          case "jump": lift += k * .65; aL = [-.4, -1.1 * k]; aR = [-.4, 1.1 * k]; break;
          case "shake": tiltZ += Math.sin(p * 32) * .12 * k; break;
          case "shiver": jx += Math.sin(p * 70) * .04 * k; break;
          case "droop": pitch += .2 * k; break;
          case "lean": lean += .1 * k; break;
          case "tilt": tiltZ += .14 * k; break;
          case "nod": pitch += Math.sin(p * Math.PI * 4) * .14 * (1 - p); break;
          case "reach": aR = [lerp(aR[0], -1.35, k), .05]; break;
          case "point": aR = [-1.55, .08]; break;
          case "stamp": aR = [p < .5 ? -2.7 * ease(p * 2) : lerp(-2.7, -1.15, ease((p - .5) * 4)), .05]; break;
          case "halt": aR = [lerp(aR[0], -2.1, Math.min(1, p * 4)), .1]; lean -= .06 * k; break;
          case "cheer": aL = [-2.9 * k, -.3]; aR = [-2.9 * k, .3]; lift += Math.abs(Math.sin(p * Math.PI * 2)) * .42; break;
        }
      });
      if (talking && !rm) pitch += Math.sin(clock * 9) * .045;
      if (r.stumble) lean -= .3 * r.stumble;
      A.inner.position.set(jx, lift + bob * .5, 0);
      if (blob) {
        A.body.scale.set(.95 * (1 - bob), .9 * (1 + bob * 1.6 + (r.wd ? Math.sin(r.walk * 2.7) * .05 : 0)), .9 * (1 - bob));
        A.body.rotation.z = tiltZ; A.body.rotation.x = pitch * .5 + lean;
      } else {
        A.legs[0].rotation.x = leg; A.legs[1].rotation.x = -leg;
        A.arms[0].rotation.set(aL[0] + swing, 0, aL[1]); A.arms[1].rotation.set(aR[0] - (hold ? 0 : swing), 0, aR[1]);
        A.torso.rotation.x = lean; A.torso.position.y = .88 + bob;
        A.head.rotation.set(pitch, 0, tiltZ);
      }
      if (A.light) A.light.visible = Math.sin(clock * 4 + A.seed) > -.4;
      /* face */
      if (clock > A.nextBlink + .14) A.nextBlink = clock + 2 + ((A.idx * 7 + Math.floor(clock)) % 5) * .7;
      var blink = clock > A.nextBlink && clock < A.nextBlink + .14 && !rm;
      if (A.mood !== r.mood || A.blink !== blink) { A.mood = r.mood; A.blink = blink; Wd.drawFace(A.cv, r.mood, blink, A.fstyle, A.skin); A.tex.needsUpdate = true; }
    }
    function handPos(id, out) {
      var A = ACT[id];
      if (A.legs) A.arms[1].userData.hand.getWorldPosition(out);
      else out.copy(A.hand).applyMatrix4(A.inner.matrixWorld);
      return out;
    }
    function anchorPos(an, out) { if (an.holder) return handPos(an.holder, out); return out.set(an.x, an.y + .04, an.z); }
    function actorTop(id) { return ACT[id].top; }
    function poseAll(lineOn) {
      var hold = holding();
      Object.keys(ACT).forEach(function (id) {
        var A = ACT[id], r = ra[id], vis = r.vis;
        A.g.visible = vis > .01;
        if (A.g.visible) {
          A.g.position.set(r.x, .04, r.z); A.g.rotation.y = r.f;
          A.g.scale.setScalar(vis >= 1 ? 1 : r.pop ? Math.max(.001, popIn(vis)) : Math.max(.001, vis));
          poseActor(A, r, hold[id], lineOn[id]);
        }
        /* crowd copies */
        var n = A.g.visible ? r.crowd : 0;
        for (var k = 0; k < 8; k++) {
          var c = A.clones[k];
          if (k >= Math.ceil(n - .001)) { if (c) c.visible = false; continue; }
          if (!c) { c = A.g.clone(true); A.clones[k] = c; scene.add(c); }
          var f = FORM[k], cs = Math.cos(r.f), sn = Math.sin(r.f), sc = clamp01(n - k);
          c.visible = true; c.position.set(r.x + cs * f[0] + sn * f[1], .04, r.z - sn * f[0] + cs * f[1]); c.rotation.y = r.f;
          c.scale.setScalar(Math.max(.001, popIn(sc)));
          c.children[1].position.y = st.rm ? 0 : Math.abs(Math.sin(clock * 3.2 + k * 1.7)) * .14;
        }
        A.g.updateMatrixWorld(true);
      });
    }
    var tmpA = V(0, 0, 0), tmpB = V(0, 0, 0);
    function placeProps() {
      Wd.tool.visible = false;
      Object.keys(PRP).forEach(function (id) {
        var Q = PRP[id], r = rp[id];
        var hv = r.holder ? (ra[r.holder].vis > .01 ? 1 : 0) : 1;
        r.eff = r.vis * hv;
        if (Q.win) return;
        Q.g.visible = r.eff > .01;
        if (!Q.g.visible) return;
        var held = !!r.holder && !r.fly, hs = HELD[Q.p.kind] || [0, .85];
        if (r.fly) {
          anchorPos(r.fly.from, tmpA); anchorPos(r.fly.to, tmpB);
          var e = ease(r.fly.p);
          Q.g.position.lerpVectors(tmpA, tmpB, e); Q.g.position.y += Math.sin(Math.PI * r.fly.p) * .9;
          Q.g.rotation.set(0, 0, 0);
          Q.g.scale.setScalar(lerp(r.fly.from.holder ? hs[1] : 1, r.fly.to.holder ? hs[1] : 1, e));
        } else if (held) {
          handPos(r.holder, Q.g.position); Q.g.position.y -= Q.h * hs[1] * .35;
          Q.g.rotation.set(hs[0], ra[r.holder].f, 0, "YXZ");
          Q.g.scale.setScalar(hs[1]);
        } else {
          Q.g.position.set(r.x, r.y + .04, r.z); Q.g.rotation.set(0, 0, 0); Q.g.scale.setScalar(1);
        }
        if (r.eff < 1) Q.g.scale.multiplyScalar(Math.max(.001, r.popv ? popIn(r.eff) : r.eff));
        Wd.updateProp(Q, r, clock);
      });
      /* the stamp tool appears in the stamping hand */
      Object.keys(ra).forEach(function (id) {
        ra[id].fxs.forEach(function (f) { if (f.fx === "stamp" && ra[id].vis > .5) { Wd.tool.visible = true; handPos(id, Wd.tool.position); Wd.tool.rotation.set(0, ra[id].f, 0); } });
      });
    }
    function pointOf(id, out) {   /* a world point for an actor (chest) or a prop (middle) */
      if (ACT[id]) return out.set(ra[id].x, 1.5, ra[id].z);
      var Q = PRP[id], r = rp[id];
      if (Q.win) return r.holder ? out.set(ra[r.holder].x, 1.6, ra[r.holder].z) : null;
      if (!Q.g.visible) return r.holder ? out.set(ra[r.holder].x, 1.4, ra[r.holder].z) : null;
      return out.copy(Q.g.position).setY(Q.g.position.y + Q.h * .5);
    }
    function drawLinks() {
      var live = {};
      rl.forEach(function (x) {
        var L = x.L, M = Wd.linkMesh(L);
        live[L.key] = 1;
        var a = pointOf(L.from, tmpA), b = pointOf(L.to, tmpB);
        var ok = a && b && (ACT[L.from] ? ra[L.from].vis > .01 : rp[L.from].eff > .01 || PRP[L.from].win) && (ACT[L.to] ? ra[L.to].vis > .01 : rp[L.to].eff > .01 || PRP[L.to].win);
        M.beads.concat(M.pulses).forEach(function (m) { m.visible = false; });
        if (!ok) { M.mid = null; return; }
        var d = a.distanceTo(b), lift = 1.2 + d * .22, n = M.beads.length;
        var mx = (a.x + b.x) / 2, my = Math.max(a.y, b.y) + lift, mz = (a.z + b.z) / 2;
        function at(t, out) { var u = 1 - t; return out.set(u * u * a.x + 2 * u * t * mx + t * t * b.x, u * u * a.y + 2 * u * t * my + t * t * b.y, u * u * a.z + 2 * u * t * mz + t * t * b.z); }
        for (var k = 0; k < n; k++) { var tt = k / (n - 1); if (tt > x.v) break; M.beads[k].visible = true; at(tt, M.beads[k].position); }
        if (x.v >= 1) M.pulses.forEach(function (m, q) { m.visible = true; at(((st.rm ? .5 : clock * .35) + q / 3) % 1, m.position); });
        M.mid = at(.5, M.mid || V(0, 0, 0));
      });
      Object.keys(Wd.linkPool).forEach(function (k) { if (!live[k]) { var M = Wd.linkPool[k]; M.beads.concat(M.pulses).forEach(function (m) { m.visible = false; }); M.mid = null; } });
    }
    var cfSeed = rng(5), cfVel = Wd.confetti.map(function () { return [(cfSeed() - .5) * 4, 3 + cfSeed() * 3, (cfSeed() - .5) * 3, cfSeed() * 6]; });
    function drawConfetti() {
      var c = !st.rm && cfs[0];
      Wd.confetti.forEach(function (m, k) {
        if (!c) { m.visible = false; return; }
        var r = ra[c.id], el2 = c.p * 1.9, v = cfVel[k];
        m.visible = true;
        m.position.set(r.x + v[0] * el2, 2.6 + v[1] * el2 - 4.2 * el2 * el2, r.z + v[2] * el2);
        m.rotation.set(v[3] + el2 * 8, el2 * 6, v[3]);
      });
    }

    /* ---------- camera direction ---------- */
    var cam = { pos: V(0, 6, 22), look: V(0, 1.4, 0), fromPos: V(0, 6, 22), fromLook: V(0, 1.4, 0), trans: 0, arc: 0 };
    var shotPos = V(0, 0, 0), shotLook = V(0, 0, 0);
    var TAN_H = Math.tan(19 * Math.PI / 180) * 16 / 9;
    function focusPoints(B) {
      var pts = [];
      var ids = B.focus.length ? B.focus : Object.keys(ra).filter(function (id) { return ra[id].vis > .5 && ra[id].at === B.place; });
      ids.forEach(function (id) { var p = pointOf(id, V(0, 0, 0)); if (p) { p.isActor = !!ACT[id]; p.id = id; pts.push(p); } });
      if (!pts.length) Object.keys(ra).forEach(function (id) { if (ra[id].vis > .5 && ra[id].at === B.place) { var p = V(ra[id].x, 1.5, ra[id].z); p.isActor = true; p.id = id; pts.push(p); } });
      if (!pts.length) { var pl = C.PL[B.place]; pts.push(V(pl.x, 1.4, .4)); }
      return pts;
    }
    function shot(kind, pts, p, B) {
      var cx = 0, cz = 0, minX = 1e9, maxX = -1e9, pl = C.PL[B.place];
      pts.forEach(function (q) { cx += q.x; cz += q.z; minX = Math.min(minX, q.x); maxX = Math.max(maxX, q.x); });
      cx /= pts.length; cz /= pts.length;
      var spread = maxX - minX, s0 = pts[0], s1 = pts[1], drift = st.rm ? .5 : p, d, w;
      switch (kind) {
        case "establishing":
          shotPos.set(pl.x + 7.5 - drift * 3.5, 8.6 - drift * 2.2, 19.5 - drift * 3); shotLook.set(pl.x + .3, 1.3, -1.2); break;
        case "aerial":
          var an = (drift - .5) * .5;
          shotPos.set(cx + Math.sin(an) * 7, 16, cz + 11 + Math.cos(an)); shotLook.set(cx, .4, cz - .5); break;
        case "crane-up":
          var e = ease(drift);
          shotPos.set(cx + lerp(1.6, 0, e), lerp(1.1, 11, e), cz + lerp(5, 14.5, e)); shotLook.set(cx, lerp(1.9, .8, e), cz); break;
        case "close-up":
          var hy = s0.isActor ? (ACT[s0.id].top - .85) : s0.y + .15, side = 1;
          Object.keys(ra).forEach(function (id) { if (id !== s0.id && ra[id].vis > .5 && ra[id].at === B.place && Math.abs(ra[id].x - s0.x) < 3) side = ra[id].x > s0.x ? -1 : 1; });
          shotPos.set(s0.x + side * 1.3, hy + .35, s0.z + (s0.isActor ? 5.4 : 3.4) - drift * .6); shotLook.set(s0.x + side * .25, hy - .2, s0.z); break;
        case "over-shoulder":
          var other = s1;
          if (!other) Object.keys(ra).forEach(function (id) { if (!other && id !== s0.id && ra[id].vis > .5 && ra[id].at === B.place) other = V(ra[id].x, 1.5, ra[id].z); });
          if (!other) other = V(s0.x + 2.5, 1.5, s0.z);
          var dx = other.x - s0.x, dz = other.z - s0.z, dl = Math.sqrt(dx * dx + dz * dz) || 1;
          shotPos.set(other.x + dx / dl * 1.7 + (dz / dl) * -.2, 2.5, Math.max(other.z + dz / dl * 1.7 + 1.1, s0.z + 1.6)); shotLook.set(s0.x, 1.8, s0.z); break;
        case "follow":
          shotPos.set(s0.x - 2.4, 2.9, s0.z + 6.6); shotLook.set(s0.x + .7, 1.5, s0.z); break;
        case "low":
          shotPos.set(s0.x + 1.5, .55, s0.z + 4.4 - drift * .4); shotLook.set(s0.x, 2.25, s0.z); break;
        case "wide":
          w = Math.max(spread + 6, 12); d = w / 2 / TAN_H;
          shotPos.set(cx + (drift - .5) * .9, 3.4 + w * .14, cz + d); shotLook.set(cx, 1.3, cz); break;
        default:   /* medium, two-shot */
          w = Math.max(spread + (kind === "two-shot" ? 3.8 : 4), 7.6); d = w / 2 / TAN_H * (1 - drift * .06);
          shotPos.set(cx + .7, 2.6, cz + d); shotLook.set(cx, 1.75, cz);
      }
    }
    function cameraFor(dt) {
      if (st.phase === "beat") {
        var B = beats[st.i], pts = focusPoints(B), p = clamp01(st.t / B.dur);
        shot(B.shot, pts, p, B);
        if (cam.trans > 0 && st.t < cam.trans) {
          var b = ease(st.t / cam.trans);
          cam.pos.lerpVectors(cam.fromPos, shotPos, b); cam.pos.y += Math.sin(Math.PI * b) * cam.arc;
          cam.look.lerpVectors(cam.fromLook, shotLook, b);
        } else { cam.pos.copy(shotPos); cam.look.copy(shotLook); }
      } else {
        var Bq = beats[st.i], pl = C.PL[Bq.place], k = 1 - Math.exp(-dt * 1.6);
        if (st.phase === "intro") { shot("establishing", [V(pl.x, 1.4, 0)], st.rm ? .5 : (clock * .02) % 1, Bq); }
        else if (st.phase === "end") { var a1 = st.rm ? 0 : clock * .05; shotPos.set(Math.sin(a1) * 10, 17, 24 + Math.cos(a1) * 3); shotLook.set(0, 0, -2); }
        else { var a2 = st.rm ? 0 : Math.sin(clock * .12) * .5; shotPos.set(pl.x + Math.sin(a2) * 13, 6.5, Math.cos(a2) * 13 + 2); shotLook.set(pl.x, 1.4, -.5); }
        cam.pos.lerp(shotPos, k); cam.look.lerp(shotLook, k);
      }
      camera.position.copy(cam.pos); camera.lookAt(cam.look);
    }
    function startTransition(B, cut) {
      cam.fromPos.copy(cam.pos); cam.fromLook.copy(cam.look);
      cam.trans = cut || st.rm ? 0 : B.moved ? 2 : 1.1;
      cam.arc = B.moved && !cut ? 4 : 0;
    }

    /* ---------- overlays: tags, bubbles, windows, labels ---------- */
    var SW = 800, SH = 450, compact = false, sizesDirty = true;
    function project(v) { tmpW.copy(v).project(camera); return { x: (tmpW.x + 1) / 2 * SW, y: (1 - tmpW.y) / 2 * SH, ok: tmpW.z < 1 && tmpW.z > -1 }; }
    function place(node, x, y, ax, ay) { node.style.transform = "translate(" + Math.round(x) + "px," + Math.round(y) + "px) translate(" + ax + "%," + ay + "%)"; }
    var tags = {};
    data.cast.forEach(function (a) {
      var t = el("div", { class: "nthview-tag" }, [root.document.createTextNode(a.name), el("small", { text: a.role })]);
      t.style.setProperty("--c", ACT[a.id].color); layer.appendChild(t); tags[a.id] = t;
    });
    var ptags = {}, wins = {};
    (data.props || []).forEach(function (p) {
      if (WINDOWS[p.kind]) { wins[p.id] = makeWin(p); return; }
      var t = el("div", { class: "nthview-tag is-prop" }); t.style.setProperty("--c", p.color || PCOL[p.kind]); layer.appendChild(t); ptags[p.id] = t; t._key = "";
    });
    function makeWin(p) {
      var w = el("div", { class: "nthview-win is-" + p.kind });
      var hdr = el("header", {}, p.kind === "code" ? [el("i"), el("i"), el("i"), el("b", { text: p.title || p.label }), el("span", { text: p.lang || "" })] : [el("b", { text: p.title || p.label })]);
      var body = el("div", { class: "nthview-wbody" });
      if (p.kind === "code") {
        var pre = el("pre");
        p.code.split("\n").forEach(function (ln, k) { pre.appendChild(el("span", { class: (p.highlight || []).indexOf(k + 1) !== -1 ? "is-hl" : "", text: ln || " " })); });
        body.appendChild(pre);
      }
      w.appendChild(hdr); w.appendChild(body);
      w._body = body; w._p = p; w._txt = null;
      layer.appendChild(w);
      return w;
    }
    var placeTags = C.places.map(function (p) { var t = el("div", { class: "nthview-tag is-place", text: p.name }); layer.appendChild(t); return t; });
    var bubbles = [], xMarks = [el("div", { class: "nthview-x", text: "✕" }), el("div", { class: "nthview-x", text: "✕" })], lkLabels = {};
    xMarks.forEach(function (x) { layer.appendChild(x); });
    Array.prototype.forEach.call(layer.children, function (n) { n.style.display = "none"; });
    function measure(node) { if (sizesDirty || node._w === undefined) { node._w = node.offsetWidth; node._h = node.offsetHeight; } }
    var lastBeatUI = -1;
    function beatDom() {   /* per-beat overlay content: caption, bubbles, transcript for screen readers */
      var B = beats[st.i];
      bubbles.forEach(function (b) { b.remove(); });
      bubbles = B.lines.map(function (ln) {
        var A = ACT[ln.who], b = el("div", { class: "nthview-bubble" }, [el("b", { text: A.a.name }), root.document.createTextNode(ln.text)]);
        b.style.setProperty("--c", A.color); layer.appendChild(b); b._ln = ln; return b;
      });
      cap.textContent = B.b.caption; bcap.textContent = B.b.caption;
      blines.textContent = "";
      sr.textContent = "Chapter " + (B.ci + 1) + ", beat " + (B.bi + 1) + ": " + B.b.caption;
      sizesDirty = true; lastBeatUI = st.i;
    }
    function overlays() {
      var beat = st.phase === "beat", B = beats[st.i], t = beat ? st.t : B.dur, lineOn = {};
      var showText = beat || st.phase === "wrap";
      /* bubbles */
      var shown = [];
      bubbles.forEach(function (b, k) {
        var ln = b._ln, on = beat && t >= ln.t0 && ra[ln.who].vis > .5;
        if (on && t < ln.t1) lineOn[ln.who] = 1;
        b.style.display = on && !compact ? "" : "none";
        b.classList.toggle("is-old", on && k < bubbles.length - 1 && t >= (bubbles[k + 1] && bubbles[k + 1]._ln.t0));
        if (on) shown.push(b);
      });
      if (compact) {
        var want = B.lines.filter(function (ln) { return beat && t >= ln.t0; }).length;
        if (blines.childNodes.length !== want) {
          blines.textContent = "";
          B.lines.slice(0, want).forEach(function (ln) { var li = el("li", {}, [el("b", { text: ACT[ln.who].a.name }), root.document.createTextNode(ln.text)]); li.style.setProperty("--c", ACT[ln.who].color); blines.appendChild(li); });
        }
      }
      return { lineOn: lineOn, shown: shown, t: t, showText: showText };
    }
    function placeOverlays(info) {
      var beat = st.phase === "beat", B = beats[st.i], t = info.t, focusSet = {};
      (beat ? B.focus : []).forEach(function (id) { focusSet[id] = 1; });
      var anyFocus = beat && B.focus.length > 0;
      /* actor tags */
      var rects = [];
      Object.keys(tags).forEach(function (id) {
        var tg = tags[id], r = ra[id], on = r.vis > .6 && !info.lineOn[id] && st.phase !== "end";
        var bubbleUp = info.shown.some(function (b) { return b._ln.who === id; });
        if (bubbleUp) on = false;
        var q = on ? project(tmpV.set(r.x, actorTop(id) + .15, r.z)) : null;
        if (!q || !q.ok || q.x < -40 || q.x > SW + 40 || q.y < -SH * .5 || q.y > SH) { tg.style.display = "none"; return; }
        tg.style.display = "";
        tg.classList.toggle("is-focus", !!focusSet[id]);
        tg.classList.toggle("is-dim", anyFocus && !focusSet[id]);
        measure(tg);
        rects.push({ n: tg, x: q.x, y: q.y, w: tg._w, h: tg._h, pri: focusSet[id] ? 0 : 1 });
      });
      /* prop tags */
      Object.keys(ptags).forEach(function (id) {
        var tg = ptags[id], r = rp[id], Q = PRP[id];
        var on = r.eff > .6 && Q.g.visible && st.phase !== "end" && (focusSet[id] || !r.holder || r.bump || r.changed || r.stamp && beat);
        if (!on) { tg.style.display = "none"; return; }
        var val = r.val === null || r.val === undefined ? "" : typeof r.val === "number" ? Math.round(r.val * 100) + "%" : String(r.val);
        var txt = Q.p.kind === "sign" || Q.p.kind === "document" ? (r.text || "") : "";
        var k2 = Q.p.label + "|" + val + "|" + txt + "|" + (r.stamp ? r.stamp.text + r.stamp.tone : "");
        if (tg._key !== k2) {
          tg._key = k2; tg.textContent = Q.p.label;
          if (val) tg.appendChild(el("span", { class: "nthview-val", text: val }));
          if (txt) tg.appendChild(el("small", { text: txt }));
          if (r.stamp) tg.appendChild(el("span", { class: "nthview-mark is-" + r.stamp.tone, text: r.stamp.text }));
          tg._w = undefined;
        }
        var q = project(tmpV.copy(Q.g.position).setY(Q.g.position.y + Q.h * Q.g.scale.y + .25));
        if (!q.ok || q.x < -40 || q.x > SW + 40 || q.y < 0 || q.y > SH) { tg.style.display = "none"; return; }
        tg.style.display = "";
        tg.classList.toggle("is-focus", !!focusSet[id]);
        measure(tg);
        rects.push({ n: tg, x: q.x, y: q.y, w: tg._w, h: tg._h, pri: focusSet[id] ? 0 : 2 });
      });
      /* keep tags from piling on each other: focused first, then push the rest up */
      rects.sort(function (a, b) { return a.pri - b.pri || b.y - a.y; });
      var placed = [];
      rects.forEach(function (r) {
        var y = r.y, guard = 0;
        for (var k = 0; k < placed.length && guard < 8; k++) {
          var o = placed[k];
          if (Math.abs(o.x - r.x) < (o.w + r.w) / 2 + 4 && y > o.y - o.h - 2 && y - r.h < o.y + 2) { y = o.y - o.h - 4; k = -1; guard++; }
        }
        r.y = y; placed.push(r);
        place(r.n, Math.max(r.w / 2 + 4, Math.min(SW - r.w / 2 - 4, r.x)), Math.max(r.h + 2, y), -50, -100);
      });
      /* bubbles above heads */
      info.shown.forEach(function (b, k) {
        var r = ra[b._ln.who], q = project(tmpV.set(r.x, actorTop(b._ln.who) + .25, r.z));
        if (!q.ok) { b.style.display = "none"; return; }
        measure(b);
        var x = Math.max(b._w / 2 + 6, Math.min(SW - b._w / 2 - 6, q.x)), y = Math.max(b._h + 6, q.y);
        for (var j = 0; j < k; j++) { var o = info.shown[j]; if (o._y !== undefined && Math.abs(o._x - x) < (o._w + b._w) / 2 && Math.abs(o._y - y) < b._h) { o._y = y - b._h - 8; place(o, o._x, Math.max(o._h + 6, o._y), -50, -100); } }
        b._x = x; b._y = y;
        b.style.setProperty("--tail", (50 + (q.x - x) / b._w * 100).toFixed(1) + "%");
        place(b, x, y, -50, -100);
      });
      /* windows: beside whoever holds them, else in the corner away from the focus */
      var focusX = SW / 2, fpts = beat ? focusPoints(B) : [];
      if (fpts.length) { focusX = 0; fpts.forEach(function (p) { focusX += project(p).x; }); focusX /= fpts.length; }
      var corner = 0;
      Object.keys(wins).forEach(function (id) {
        var w = wins[id], r = rp[id], on = r.eff > .5 && info.showText && st.phase !== "end" && (r.holder ? ra[r.holder].at === B.place : r.at === B.place);
        var txt = w._p.kind === "number" ? (r.val || "") : w._p.kind === "code" ? null : (r.text || "");
        if (txt !== null && w._txt !== txt) { w._txt = txt; w._body.textContent = txt; w._w = undefined; }
        w.classList.toggle("is-focus", !!focusSet[id]);
        if (compact) { if (on && w.parentNode !== bwins) bwins.appendChild(w); if (!on && w.parentNode === bwins) layer.appendChild(w); w.style.display = on ? "" : "none"; return; }
        if (w.parentNode !== layer) layer.appendChild(w);
        w.style.display = on ? "" : "none";
        w.style.opacity = on ? String(Math.min(1, r.eff)) : "0";
        if (!on) return;
        measure(w);
        var capTop = SH - (cap.offsetHeight || 60) - SH * .05, x, y;
        if (r.holder && ra[r.holder].vis > .5) {
          var q = project(tmpV.set(ra[r.holder].x, 2.2, ra[r.holder].z)), right = q.x < SW / 2;
          x = right ? q.x + SW * .05 : q.x - SW * .05 - w._w; y = q.y - w._h / 2;
        } else {
          var left = corner === 0 ? focusX > SW / 2 : focusX <= SW / 2;
          x = left ? SW * .03 : SW * .97 - w._w; y = SH * .13; corner++;
        }
        x = Math.max(8, Math.min(SW - w._w - 8, x)); y = Math.max(8, Math.min(capTop - w._h - 6, y));
        place(w, x, y, 0, 0); w._cx = x + w._w / 2; w._cy = y + w._h / 2;
      });
      /* place names in wide views */
      var wideView = !beat || /establishing|aerial|wide|crane-up/.test(B.shot);
      placeTags.forEach(function (tg, k) {
        var pl = C.PL[C.places[k].id], q = project(tmpV.set(pl.x, 5.6, -4.8)), dist = camera.position.distanceTo(tmpV);
        var on = wideView && q.ok && q.x > 20 && q.x < SW - 20 && q.y > 10 && q.y < SH * .7 && dist < 60 && st.phase !== "wrap";
        tg.style.display = on ? "" : "none";
        if (on) place(tg, q.x, q.y, -50, -100);
      });
      /* red crosses */
      xMarks.forEach(function (x, k) {
        var b = bxs[k];
        if (!b || ra[b.id].vis < .5) { x.style.display = "none"; return; }
        var q = project(tmpV.set(ra[b.id].x, actorTop(b.id) - .9, ra[b.id].z));
        x.style.display = q.ok ? "" : "none";
        x.style.opacity = String(Math.min(1, b.p * 5, (1 - b.p) * 4));
        place(x, q.x, q.y, -50, -50);
      });
      /* link labels */
      Object.keys(Wd.linkPool).forEach(function (k) {
        var M = Wd.linkPool[k], lb = lkLabels[k], L = null;
        rl.forEach(function (x) { if (x.L.key === k && x.v >= 1) L = x.L; });
        if (!lb && L && L.label) { lb = lkLabels[k] = el("div", { class: "nthview-lk", text: L.label }); lb.style.setProperty("--c", TONE[L.tone] || TONE.info); layer.appendChild(lb); }
        if (!lb) return;
        if (!L || !M.mid) { lb.style.display = "none"; return; }
        var q = project(M.mid);
        lb.style.display = q.ok ? "" : "none";
        place(lb, q.x, q.y - 8, -50, -100);
      });
      /* spotlight on the focus */
      var spotOn = beat && B.focus.length > 0 && !/establishing|aerial|crane-up/.test(B.shot) && t > B.T0 + .2;
      if (spotOn) {
        var sx = 0, sy = 0, rad = 0, pts2 = [];
        B.focus.forEach(function (id) {
          if (wins[id]) { if (wins[id].style.display !== "none" && !compact && wins[id]._cx !== undefined) pts2.push({ x: wins[id]._cx, y: wins[id]._cy + SH * .05, r: Math.hypot(wins[id]._w, wins[id]._h) / 2 - SH * .2 }); return; }
          var p = pointOf(id, V(0, 0, 0)); if (p) pts2.push(project(p));
        });
        if (pts2.length) {
          pts2.forEach(function (p) { sx += p.x; sy += p.y; }); sx /= pts2.length; sy /= pts2.length;
          pts2.forEach(function (p) { rad = Math.max(rad, Math.hypot(p.x - sx, p.y - sy) + (p.r || 0)); });
          rad += SH * .26;
          spot.style.setProperty("--sx", Math.round(sx) + "px"); spot.style.setProperty("--sy", Math.round(sy - SH * .05) + "px"); spot.style.setProperty("--sr", Math.round(rad) + "px");
        } else spotOn = false;
      }
      spot.classList.toggle("is-on", !!spotOn);
      /* chips: where we are, who we meet, chapter title */
      chip.classList.toggle("is-on", beat && (B.moved || B.first) && t > B.T0 && t < B.T0 + 3.4);
      if (chipText.textContent !== C.PL[B.place].name) chipText.textContent = C.PL[B.place].name;
      var meets = beat ? B.meet.filter(function (m) { return t >= m.t && t < m.t + 3.8; }) : [];
      var mk = meets.map(function (m) { return m.id; }).join(",");
      if (meetEl._k !== mk) {
        meetEl._k = mk; meetEl.textContent = "";
        meets.forEach(function (m) {
          var a = ACT[m.id].a, img = el("img", { alt: "", src: portrait(m.id) });
          meetEl.appendChild(el("div", {}, [img, el("span", {}, [root.document.createTextNode("Meet " + a.name), el("small", { text: a.role })])]));
        });
      }
      meetEl.classList.toggle("is-on", meets.length > 0);
      var tc = beat && B.first && t < B.T0 + .2;
      if (tc) { tcard.firstChild.textContent = "Chapter " + (B.ci + 1) + " of " + chapters.length; tcard.lastChild.textContent = chapters[B.ci].title; }
      tcard.classList.toggle("is-on", tc);
      cap.style.display = info.showText && beat && !compact ? "" : "none";
      sizesDirty = false;
    }

    /* ---------- portraits for the cast card, rendered from the real models ---------- */
    var portraits = {};
    function portrait(id) {
      if (portraits[id]) return portraits[id];
      try {
        var rt = new THREE.WebGLRenderTarget(128, 128), pc = new THREE.PerspectiveCamera(30, 1, .1, 50), ps = new THREE.Scene();
        ps.add(new THREE.HemisphereLight(0xffffff, 0x8a80a0, .9)); var dl = new THREE.DirectionalLight(0xffffff, .7); dl.position.set(-2, 4, 6); ps.add(dl);
        var obj, parent, save = {};
        if (ACT[id]) {
          var A = ACT[id]; obj = A.g; Wd.drawFace(A.cv, "happy", false, A.fstyle, A.skin); A.tex.needsUpdate = true; A.mood = "";
          pc.position.set(0, A.legs ? 2.05 : 1.2, A.legs ? 5.4 : 4.6); pc.lookAt(0, A.legs ? 1.75 : 1.05, 0);
        } else { var Q = PRP[id]; obj = Q.g; var hh = Math.max(.5, Q.h); pc.position.set(0, hh * .55 + .1, hh * 2.6 + .6); pc.lookAt(0, hh * .45, 0); }
        parent = obj.parent; save.p = obj.position.clone(); save.r = obj.rotation.clone(); save.s = obj.scale.clone(); save.v = obj.visible;
        obj.position.set(0, 0, 0); obj.rotation.set(0, ACT[id] ? 0 : -.5, 0); obj.scale.set(1, 1, 1); obj.visible = true;
        ps.add(obj); obj.updateMatrixWorld(true);
        renderer.setRenderTarget(rt); renderer.setClearColor(0x000000, 0); renderer.clear(); renderer.render(ps, pc);
        var px = new Uint8Array(128 * 128 * 4); renderer.readRenderTargetPixels(rt, 0, 0, 128, 128, px);
        renderer.setRenderTarget(null); renderer.setClearColor(scene.background, 1);
        parent.add(obj); obj.position.copy(save.p); obj.rotation.copy(save.r); obj.scale.copy(save.s); obj.visible = save.v;
        var cv = doc.createElement("canvas"); cv.width = cv.height = 128;
        var cx = cv.getContext("2d"), img = cx.createImageData(128, 128);
        for (var y = 0; y < 128; y++) img.data.set(px.subarray((127 - y) * 512, (128 - y) * 512), y * 512);
        cx.putImageData(img, 0, 0);
        rt.dispose();
        portraits[id] = cv.toDataURL("image/png");
      } catch (e) { portraits[id] = ""; }
      return portraits[id];
    }

    /* ---------- narration (optional, off by default) ---------- */
    var speech = { lines: {}, last: null, cut: null };
    var VO = makeVoice(data, data.cast, coarse, function () { voiceStatus(); });
    VO.lib = (NthView.libs || []).filter(function (l) { return l.kind === "module"; })[0];
    VO.speed = st.speed;
    if (st.gpu === false) VO.useGpu = false;
    if (st.voiceKind === "natural" && VO.english) VO.kind = "natural";
    var synth = VO.system || VO.english ? true : null;
    function itemsOf(i) {
      var B = beats[i], out = [{ key: "n" + i, text: B.b.say || B.b.caption, who: "", tone: B.b.tone || VO.narratorTone }];
      B.lines.forEach(function (ln, k) { out.push({ key: "l" + i + "-" + k, text: ln.text, who: ln.who, tone: ln.tone || MOOD_TONE[ln.mood] || "warm" }); });
      return out;
    }
    function wrapItems(ci) {
      var tk = chapters[ci].takeaway; if (!tk) return [];
      var o = [];
      if (tk.think) o.push({ key: "t" + ci, text: "Pause to think. ... " + tk.think, who: "", tone: "calm" });
      o.push({ key: "p" + ci, text: "Here's what to take away. ... " + tk.points.join(" ... "), who: "", tone: "calm" });
      return o;
    }
    function endItems() { var rc = data.recap; return rc ? [{ key: "r", text: "So, to sum up. ... " + rc.points.join(" ... "), who: "", tone: "warm" }] : []; }
    function say(item) { if (!st.voice) return; ensureNatural(); speech.last = item; VO.say(item); }
    function busy() { if (!st.voice) return false; if (VO.kind === "natural" && !VO.ready && naturalLoading) return true; return VO.busy(); }
    function hush() { speech.cut = busy() ? speech.last : null; VO.hush(); }
    var aheadI = 0;
    function speakBeat() { speech.lines = {}; var it = itemsOf(st.i); say(it[0]); VO.ahead(it.slice(1)); aheadI = st.i; keepAhead(); }
    function keepAhead() {   /* the neural voice keeps a few beats generated ahead of the picture */
      if (VO.kind !== "natural" || !VO.ready || !st.voice) return;
      while (VO.queued() < 2 && aheadI < Math.min(NB - 1, st.i + 4)) {
        aheadI++;
        VO.ahead(itemsOf(aheadI).concat(lastOfChapter(aheadI - 1) ? wrapItems(beats[aheadI - 1].ci) : []));
      }
    }
    var naturalLoading = false, naturalError = "", sampleNext = false;
    function ensureNatural() {
      if (VO.kind !== "natural" || VO.ready || naturalLoading) return;
      if (!VO.lib) { naturalFail(new Error("no voice library is declared")); return; }
      naturalLoading = true; naturalError = ""; voiceStatus();
      VO.load().then(function () {
        naturalLoading = false; voiceStatus();
        root.setTimeout(function () { VO.cached = false; VO.checkCache(function (ok) { if (!ok) { naturalError = "Ready. This browser could not keep the voice files, so it downloads them again next time" + (VO.device === "webgpu" ? "; switching off the graphics chip uses the smaller 98 MB voice, which browsers keep more easily." : "."); voiceStatus(); } }); }, 4000); if (sampleNext && !st.playing) { sampleNext = false; say({ text: "This is the natural voice. And every character gets their own.", who: "", tone: "warm" }); } if (st.playing && st.phase === "beat" && !speech.lines.started) { VO.hush(); speakBeat(); } }, naturalFail);
    }
    function naturalFail(err) {
      naturalLoading = false; naturalError = "The natural voice could not load (" + (err && err.message || err) + "). Using the device voice instead.";
      VO.kind = "system"; st.voiceKind = "system"; persist(); voiceStatus();
    }
    var vchip = el("div", { class: "nthview-resume nthview-vchip", role: "status", hidden: "" });
    stage.appendChild(vchip);
    var voiceUI = null;
    function voiceStatus() {
      var txt = naturalLoading ? "Loading the natural voice… " + Math.round(VO.progress * 100) + "%" : "";
      vchip.hidden = !txt || !st.voice; vchip.textContent = txt;
      if (voiceUI) voiceUI();
    }

    /* ---------- playback ---------- */
    function chapterOf(i) { return beats[i].ci; }
    function lastOfChapter(i) { return beats[i].bi === chapters[beats[i].ci].beats.length - 1; }
    function markSeen(i) { if (st.seen.indexOf(i) === -1) st.seen.push(i); }
    function gotoBeat(i, cut) {
      hush();
      st.phase = "beat"; st.i = Math.max(0, Math.min(NB - 1, i)); st.t = 0; st.atEnd = false; speech.lines = {}; speech.cut = null;
      hideOverlay();
      startTransition(beats[st.i], cut);
      beatDom();
      if (st.playing && st.voice) speakBeat();
      ui(); persist();
    }
    function endOfBeat() {
      var B = beats[st.i];
      markSeen(st.i);
      if (lastOfChapter(st.i)) {
        if (chapters[B.ci].takeaway) return enterWrap();
        if (st.i === NB - 1) return enterEnd();
      }
      if (st.pace === "beat" || (st.pace === "chapter" && lastOfChapter(st.i))) { st.playing = false; st.atEnd = true; st.t = B.dur; hush(); ui(); persist(); return; }
      gotoBeat(st.i + 1, false);
    }
    function enterWrap() {
      hush();
      var tk = chapters[beats[st.i].ci].takeaway;
      st.phase = "wrap"; st.wt = 0; st.wstage = tk.think ? "think" : "points";
      showWrap();
      if (st.voice && st.playing) { var wi = wrapItems(beats[st.i].ci); say(wi[0]); VO.ahead(wi.slice(1)); }
      ui(); persist();
    }
    function revealPoints() {
      var tk = chapters[beats[st.i].ci].takeaway;
      st.wstage = "points"; st.wt = 0;
      showWrap();
      if (st.voice) { var wi2 = wrapItems(beats[st.i].ci); say(wi2[wi2.length - 1]); }
      if (st.pace !== "flow") { st.playing = false; }
      ui(); persist();
    }
    function continueOn() {
      var ci = beats[st.i].ci;
      if (ci >= chapters.length - 1) return enterEnd();
      st.playing = true; gotoBeat(C.chStart[ci + 1], false);
    }
    function enterEnd() {
      hush();
      markSeen(st.i);
      st.phase = "end"; st.playing = false; st.done = true; st.i = NB - 1;
      showEnd();
      if (st.voice && endItems().length) say(endItems()[0]);
      ui(); persist();
    }
    function play() {
      wake(); dismissResume();
      if (st.phase === "end") return;
      if (st.phase === "intro") { st.playing = true; gotoBeat(st.i, true); return; }
      if (st.phase === "wrap") {
        if (st.wstage === "points") return continueOn();
        st.playing = true; showWrap(); ui(); return;
      }
      if (st.atEnd) { st.playing = true; st.atEnd = false; var B = beats[st.i]; if (lastOfChapter(st.i) && !chapters[B.ci].takeaway && st.i === NB - 1) return enterEnd(); gotoBeat(st.i + 1, false); return; }
      st.playing = true;
      VO.unlock();
      if (st.voice) { if (speech.cut) { var c2 = speech.cut; speech.cut = null; say(c2); } else if (st.t < .3) speakBeat(); }
      ui();
    }
    function pause() { st.playing = false; hush(); if (st.phase === "wrap" && st.wstage === "think") showWrap(); ui(); }
    function toggle() { if (st.playing) pause(); else play(); }
    function next() {
      dismissResume();
      if (st.phase === "intro") return play();
      if (st.phase === "wrap") return continueOn();
      if (st.phase === "end") return;
      if (lastOfChapter(st.i)) { markSeen(st.i); if (chapters[beats[st.i].ci].takeaway) return enterWrap(); if (st.i === NB - 1) return enterEnd(); }
      gotoBeat(st.i + 1, true);
    }
    function prev() {
      dismissResume();
      if (st.phase === "wrap" || st.phase === "end") return gotoBeat(st.i, true);
      if (st.phase === "beat" && st.t > 1.5) return gotoBeat(st.i, true);
      gotoBeat(st.i - 1, true);
    }
    function replay() { dismissResume(); st.playing = true; gotoBeat(st.phase === "intro" ? 0 : st.i, true); }
    function jumpChapter(d) { var ci = Math.max(0, Math.min(chapters.length - 1, chapterOf(st.i) + d)); gotoBeat(C.chStart[ci], true); }
    function step(dt) {
      if (!st.playing) return;
      if (st.phase === "beat") {
        var B = beats[st.i], nt = st.t + dt * st.speed;
        if (busy()) {   /* hold the picture until the voice catches up (narration and visuals stay together) */
          var gate = B.dur;
          for (var k = 0; k < B.lines.length; k++) if (!speech.lines[k] && B.lines[k].t0 > st.t - 1e-6) { gate = B.lines[k].t0; break; }
          if (nt >= gate) nt = Math.max(st.t, gate - .001);
        }
        B.lines.forEach(function (ln, k) { if (!speech.lines[k] && nt >= ln.t0) { speech.lines[k] = 1; say(itemsOf(st.i)[k + 1]); sr.textContent = ACT[ln.who].a.name + ": " + ln.text; } });
        st.t = nt;
        keepAhead();
        if (st.t >= B.dur && !busy()) endOfBeat();
      } else if (st.phase === "wrap") {
        var tk = chapters[beats[st.i].ci].takeaway;
        st.wt += dt;
        if (st.wstage === "think") { updateRing(1 - st.wt / (tk.seconds || 8)); if (st.wt >= (tk.seconds || 8) && !busy()) revealPoints(); }
        else if (st.pace === "flow" && st.wt >= 2 + words(tk.points.join(" ")) * .3 && !busy()) continueOn();
      }
    }

    /* ---------- overlay screens: intro, takeaways, end ---------- */
    var ring = null;
    function hideOverlay() { ov.hidden = true; ov.textContent = ""; ring = null; }
    function card(children) { ov.textContent = ""; var c = el("div", { class: "nthview-card" }, children); ov.appendChild(c); ov.hidden = false; return c; }
    function cta(label, ic, fn, ghost) { var b = el("button", { type: "button", class: ghost ? "nthview-ghost" : "nthview-cta" }, ic ? [icon(ic), root.document.createTextNode(label)] : [root.document.createTextNode(label)]); b.addEventListener("click", fn); return b; }
    var totalMin = Math.max(1, Math.round((beats.reduce(function (s, B) { return s + B.dur; }, 0) + chapters.reduce(function (s, c) { return s + (c.takeaway ? (c.takeaway.think ? (c.takeaway.seconds || 8) : 0) + 4 : 0); }, 0)) / 60));
    function showIntro() {
      var kids = [el("p", { class: "nthview-kicker", text: "Animated story · " + chapters.length + " chapter" + (chapters.length > 1 ? "s" : "") + " · about " + totalMin + " min" }),
        el("h2", { text: data.title })];
      if (data.summary) kids.push(el("p", { text: data.summary }));
      if (data.audience) kids.push(el("p", { class: "nthview-hint", text: "For: " + data.audience }));
      var phone = coarse || compact, bP = cta(phone ? "Play here" : "Play", "play", function () { play(); }, phone), bF = cta("Play full screen", "full", function () { enterFull(); play(); }, !phone);
      var row = el("div", { class: "nthview-row" }, phone ? [bF, bP] : [bP, bF]);
      row.appendChild(cta("Who's who", "cast", function (e) { openCast(e.currentTarget); }, true));
      kids.push(row);
      kids.push(el("p", { class: "nthview-hint", text: "Space plays and pauses. The arrow keys move between beats. Pause any time: the picture holds still." }));
      card(kids);
    }
    function updateRing(f) { if (ring) ring.style.strokeDashoffset = String((1 - clamp01(f)) * 113.1); }
    function showWrap() {
      var ci = beats[st.i].ci, tk = chapters[ci].takeaway, last = ci === chapters.length - 1;
      var kids = [el("p", { class: "nthview-kicker", text: "Chapter " + (ci + 1) + " of " + chapters.length + " · " + chapters[ci].title })];
      if (tk.think) {
        var svg = root.document.createElementNS(SVGNS, "svg"); svg.setAttribute("viewBox", "0 0 44 44"); svg.setAttribute("class", "nthview-ring"); svg.setAttribute("aria-hidden", "true");
        var bg = root.document.createElementNS(SVGNS, "circle"); bg.setAttribute("cx", "22"); bg.setAttribute("cy", "22"); bg.setAttribute("r", "18"); bg.setAttribute("stroke", "currentColor"); bg.setAttribute("opacity", ".15");
        var fg = root.document.createElementNS(SVGNS, "circle"); fg.setAttribute("cx", "22"); fg.setAttribute("cy", "22"); fg.setAttribute("r", "18"); fg.setAttribute("stroke", "var(--nv-accent)");
        fg.setAttribute("stroke-dasharray", "113.1"); fg.setAttribute("transform", "rotate(-90 22 22)"); fg.setAttribute("stroke-linecap", "round");
        svg.appendChild(bg); svg.appendChild(fg); ring = st.wstage === "think" ? fg : null;
        if (st.wstage !== "think") fg.style.strokeDashoffset = "0";
        kids.push(el("div", { class: "nthview-think" }, [svg, el("p", {}, [el("b", { text: "Pause to think" }), root.document.createTextNode(tk.think)])]));
      }
      if (st.wstage === "think") {
        kids.push(el("div", { class: "nthview-row" }, [cta(st.playing ? "Show the takeaways" : "Start the pause", st.playing ? "next" : "play", function () { if (st.playing) revealPoints(); else play(); }, !st.playing)]));
      } else {
        kids.push(el("h2", { text: "Key takeaways" }));
        kids.push(el("ul", { class: "nthview-points" }, tk.points.map(function (p) { return el("li", { text: p }); })));
        kids.push(el("div", { class: "nthview-row" }, [
          cta(last ? "See the recap" : "Next: " + chapters[ci + 1].title, "play", function () { continueOn(); }),
          cta("Replay chapter", "replay", function () { st.playing = true; gotoBeat(C.chStart[ci], true); }, true)]));
        if (st.pace === "flow") kids.push(el("p", { class: "nthview-hint", text: "Continuing on its own in a moment. Pause to stay here." }));
      }
      card(kids);
      sr.textContent = (tk.think && st.wstage === "think" ? "Pause to think: " + tk.think : "Key takeaways: " + tk.points.join(" "));
    }
    function showEnd() {
      var rc = data.recap, kids = [el("p", { class: "nthview-kicker", text: "The end · " + data.title }), el("h2", { text: rc ? rc.title || "Key takeaways" : "Key takeaways" })];
      var pts = rc ? rc.points : [];
      if (!rc) chapters.forEach(function (c) { if (c.takeaway) pts = pts.concat(c.takeaway.points.slice(0, 1)); });
      kids.push(el("ol", { class: "nthview-points" }, pts.map(function (p) { return el("li", { text: p }); })));
      var each = chapters.filter(function (c) { return c.takeaway; });
      if (each.length) kids.push(el("details", {}, [el("summary", { text: "Every chapter's takeaways" })].concat(each.map(function (c) { return el("div", {}, [el("h3", { text: c.title }), el("ul", { class: "nthview-points" }, c.takeaway.points.map(function (p) { return el("li", { text: p }); }))]); }))));
      if (data.next) kids.push(el("p", {}, [el("strong", { text: data.next })]));
      if (data.sources && data.sources.length) {
        kids.push(el("details", {}, [el("summary", { text: "Sources" }), el("ul", { class: "nthview-points" }, data.sources.map(function (s) {
          var li = el("li", {}, [s.url ? el("a", { href: s.url, target: "_blank", rel: "noopener noreferrer", text: s.title }) : el("span", { text: s.title })]);
          if (s.note) li.appendChild(el("span", { text: " — " + s.note }));
          return li;
        }))]));
      }
      kids.push(el("div", { class: "nthview-row" }, [
        cta("Watch again", "replay", function () { clearState(key); NthView.build(container, data); }),
        cta("Chapters", "list", function (e) { openList(e.currentTarget); }, true), cta("Who's who", "cast", function (e) { openCast(e.currentTarget); }, true),
        cta("Download as MP4…", "download", function (e) { openExport(e.currentTarget); }, true)]));
      card(kids);
      sr.textContent = "The end. " + pts.join(" ");
    }

    /* ---------- dialogs: who's who, chapters and transcript, settings ---------- */
    var lastFocus = null, resumeAfter = false;
    function openDlg(title, body, opener) {
      resumeAfter = st.playing; if (st.playing) pause();
      dlgTitle.textContent = title; dlgBody.textContent = ""; dlgBody.appendChild(body);
      dlg.hidden = false; lastFocus = opener || doc.activeElement; dlgClose.focus();
      container.classList.remove("nthview-idle");
    }
    function closeDlg(resume) {
      if (dlg.hidden) return;
      if (exporting) { exporting.cancel = true; return; }
      dlg.hidden = true;
      if (lastFocus && lastFocus.focus && doc.contains(lastFocus)) lastFocus.focus();
      if (resume !== false && resumeAfter) play();
      resumeAfter = false;
    }
    dlgClose.addEventListener("click", function () { closeDlg(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeDlg(); });
    function openCast(opener) {
      var wrap = el("div");
      wrap.appendChild(el("h3", { text: "The cast" }));
      wrap.appendChild(el("ul", { class: "nthview-cast" }, data.cast.map(function (a) {
        var li = el("li", {}, [el("img", { alt: "", src: portrait(a.id) }), el("div", {}, [el("b", { text: a.name }), el("small", { text: a.role }), el("p", { text: a.stands || "" })])]);
        li.style.setProperty("--c", ACT[a.id].color); return li;
      })));
      if (data.props && data.props.length) {
        wrap.appendChild(el("h3", { text: "Props and what they stand for" }));
        wrap.appendChild(el("ul", { class: "nthview-cast" }, data.props.map(function (p) {
          var pic = WINDOWS[p.kind] ? el("span", { class: "nthview-ico", "aria-hidden": "true", text: { card: "Aa", code: "</>", formula: "f(x)", number: "#" }[p.kind] }) : el("img", { alt: "", src: portrait(p.id) });
          var li = el("li", {}, [pic, el("div", {}, [el("b", { text: p.label }), el("p", { text: p.means || "" })])]);
          li.style.setProperty("--c", p.color || PCOL[p.kind] || "#6a4dd6"); return li;
        })));
      }
      if (data.places && data.places.length > 1) {
        wrap.appendChild(el("h3", { text: "Places" }));
        wrap.appendChild(el("ul", { class: "nthview-points" }, data.places.map(function (p) { return el("li", { text: p.name }); })));
      }
      openDlg("Who's who", wrap, opener);
    }
    function openList(opener) {
      var list = el("ol", { class: "nthview-chlist" });
      chapters.forEach(function (c, ci) {
        var n = c.beats.length, s0 = C.chStart[ci], seenAll = true, sec = 0;
        for (var k = 0; k < n; k++) { if (st.seen.indexOf(s0 + k) === -1) seenAll = false; sec += beats[s0 + k].dur; }
        var headEl = el("div", { class: "nthview-chhead" }, [el("span", { class: seenAll ? "nthview-tick" : "", text: seenAll ? "✓" : String(ci + 1) }), root.document.createTextNode(c.title), el("span", { text: Math.max(1, Math.round(sec / 6) / 10) + " min" })]);
        headEl.firstChild.style.marginLeft = "0";
        var ul = el("ul", { class: "nthview-beats" });
        c.beats.forEach(function (b, bi) {
          var i = s0 + bi, bt = el("button", { type: "button" }, [el("em", { text: (ci + 1) + "." + (bi + 1) }), el("span", { text: b.caption })]);
          if (i === st.i && st.phase === "beat") bt.setAttribute("aria-current", "step");
          bt.addEventListener("click", function () { closeDlg(false); st.playing = true; gotoBeat(i, true); });
          ul.appendChild(el("li", {}, [bt]));
        });
        if (c.takeaway) {
          var tb = el("button", { type: "button" }, [el("em", { text: "★" }), el("span", { text: "Takeaways: " + c.takeaway.points[0] })]);
          tb.addEventListener("click", function () { closeDlg(false); st.i = s0 + n - 1; st.playing = false; enterWrap(); st.wstage = "points"; showWrap(); persist(); });
          ul.appendChild(el("li", {}, [tb]));
        }
        list.appendChild(el("li", {}, [headEl, ul]));
      });
      var endB = cta("Go to the recap", "next", function () { closeDlg(false); enterEnd(); }, true);
      openDlg("Chapters and transcript", el("div", {}, [list, endB]), opener);
    }
    function radio(name, val, cur, label, note, fn) {
      var inp = el("input", { type: "radio", name: name, value: String(val) }); if (val === cur) inp.checked = true;
      inp.addEventListener("change", function () { if (inp.checked) fn(val); });
      return el("label", {}, [inp, el("span", {}, [root.document.createTextNode(label)].concat(note ? [el("small", { text: note })] : []))]);
    }
    function check(cur, label, note, fn, disabled) {
      var inp = el("input", { type: "checkbox" }); inp.checked = cur; if (disabled) inp.disabled = true;
      inp.addEventListener("change", function () { fn(inp.checked); });
      return el("label", {}, [inp, el("span", {}, [root.document.createTextNode(label)].concat(note ? [el("small", { text: note })] : []))]);
    }
    function openSettings(opener) {
      var f1 = el("fieldset", {}, [el("legend", { text: "Auto-play" }),
        radio("nv-pace", "chapter", st.pace, "Pause after each chapter", "Plays beat after beat and stops on each chapter's takeaways (recommended).", setPace),
        radio("nv-pace", "flow", st.pace, "Play straight through", "Only the short think pauses hold the picture.", setPace),
        radio("nv-pace", "beat", st.pace, "Step by step", "Stops after every beat; press Play or → for the next one.", setPace)]);
      var f2 = el("fieldset", {}, [el("legend", { text: "Speed" })].concat(SPEEDS.map(function (s) { return radio("nv-speed", s, st.speed, s + "×", s === 1 ? "Normal" : "", setSpeed); })));
      var f3 = el("fieldset", {}, [el("legend", { text: "Sound and motion" }),
        check(st.rm, "Reduce motion", "Cuts instead of camera moves; no drifting, bobbing or confetti.", function (v) { st.rm = v; persist(); })]);
      var keys = [["Space", "Play or pause"], ["← →", "Previous or next beat"], ["Shift + ← →", "Previous or next chapter"], ["R", "Replay this beat"], ["F", "Full screen"], ["V", "Read aloud on or off"], ["C", "Who's who"], ["T", "Chapters and transcript"], ["+ −", "Faster or slower"], ["Esc", "Close or leave full screen"]];
      var dl = el("dl", { class: "nthview-keys" });
      keys.forEach(function (k) { dl.appendChild(el("dt", {}, [el("kbd", { text: k[0] })])); dl.appendChild(el("dd", { text: k[1] })); });
      var f4 = el("fieldset", {}, [el("legend", { text: "Keyboard" }), dl]);
      openDlg("Settings", el("div", { class: "nthview-set" }, [exportRow(), voiceFieldset(), f1, f2, f3, f4]), opener);
    }
    function setPace(v) { st.pace = v; persist(); }
    function setSpeed(v) { st.speed = v; VO.speed = v; bSpeed.textContent = String(v).replace(/^0/, "") + "×"; persist(); }
    function setVoice(v) {
      st.voice = !!v && !!synth;
      VO.unlock();
      if (st.voice) { if (st.playing && st.phase === "beat") { VO.hush(); speakBeat(); } else say({ text: "Read aloud is on.", who: "", tone: "warm" }); }
      else VO.hush();
      voiceStatus(); ui(); persist();
    }
    function setVoiceKind(k) {
      VO.hush(); sampleNext = k === "natural" && !VO.ready;
      st.voiceKind = k; VO.kind = k; naturalError = "";
      if (k === "natural") { st.voice = true; VO.unlock(); ensureNatural(); if (VO.ready) say({ text: "This is the natural voice. Each character gets their own.", who: "", tone: "warm" }); }
      voiceStatus(); ui(); persist();
    }
    function voiceFieldset() {
      var narName = VO.names[""] ? " (" + VO.names[""] + ")" : "";
      function natNote() {
        var size = VO.sizeText(); return !VO.english ? "Speaks English only, so it is not available for this story." : VO.ready ? "Loaded. Each character speaks with their own voice." : VO.cached ? "Already downloaded on this device; loads in a few seconds." : "A neural voice that runs on this device. Downloads " + size + " once, the first time, then works from the browser's cache." + (coarse ? " Heavy on a phone: slow to load and to speak." : ""); }
      var bar = el("progress", { max: "1", value: String(VO.progress), class: "nthview-vprog" });
      var stat = el("p", { class: "nthview-hint", role: "status" });
      var f = el("fieldset", {}, [el("legend", { text: "Voice" }),
        check(st.voice, "Read the story aloud", "The picture waits for the voice, and every character speaks.", function (v) { setVoice(v); }, !VO.system && !(VO.kind === "natural")),
        radio("nv-vk", "system", st.voiceKind, "Device voice" + narName, VO.system ? "Built into this device. Nothing to download." : "This browser has no built-in voice.", setVoiceKind),
        radio("nv-vk", "natural", st.voiceKind, "Natural voice (Kokoro)", natNote(), function (k) { setVoiceKind(k); }),
        bar, stat]);
      var gpuRow = check(VO.useGpu, "Use the graphics chip", "About ten times faster than speech, but a 330 MB download. Off: 98 MB, about as fast as speech, so the picture sometimes waits.", function (v) {
        VO.useGpu = v; st.gpu = v; VO.cached = false; persist(); VO.checkCache(function () { if (voiceUI) voiceUI(); }); if (voiceUI) voiceUI();
      }, VO.ready);
      f.insertBefore(gpuRow, bar);
      if (!VO.english) f.querySelectorAll("input[type=radio]")[1].disabled = true;
      var noteEl = f.querySelectorAll("label small")[2];
      voiceUI = function () {
        if (!doc.contains(f) && f._live) { voiceUI = null; return; }
        if (doc.contains(f)) f._live = true;
        if (noteEl) noteEl.textContent = natNote();
        Array.prototype.forEach.call(f.querySelectorAll("input[name=nv-vk]"), function (r) { r.checked = r.value === st.voiceKind; });
        gpuRow.hidden = !VO.gpu || !VO.english; gpuRow.querySelector("input").disabled = VO.ready || naturalLoading;
        bar.hidden = !naturalLoading; bar.value = VO.progress;
        stat.textContent = naturalError || (naturalLoading ? "Downloading and starting the natural voice… " + Math.round(VO.progress * 100) + "%" : VO.ready && st.voiceKind === "natural" ? "Natural voice ready." : "");
      };
      voiceUI();
      if (!VO.cached && VO.english) VO.checkCache(function () { if (voiceUI) voiceUI(); });
      return f;
    }
    function trap(e) {
      var f = Array.prototype.filter.call(dlg.querySelectorAll("button,input,a[href],summary,[tabindex='0']"), function (n) { return !n.disabled && n.offsetParent !== null; });
      if (!f.length) return;
      var i = f.indexOf(doc.activeElement);
      if (e.shiftKey && (i <= 0)) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    }

    /* ---------- download as MP4: rendered offline, frame by frame ---------- */
    var exporting = null, exportSize = null;
    function exportRow() {
      var b = cta("Download as MP4…", "download", function () { openExport(b); }, true);
      return el("div", { class: "nthview-row nthview-exprow" }, [b]);
    }
    function slug() { return (data.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60).replace(/-+$/, "")) || "story"; }
    function storyMinutes() { return Math.max(1, Math.round(totalMin)); }
    function openExport(opener) {
      var webc = !!(root.VideoEncoder && root.VideoFrame), mrec = !!(root.MediaRecorder && root.HTMLCanvasElement && root.HTMLCanvasElement.prototype.captureStream);
      var natural = st.voiceKind === "natural" && VO.english;
      var size = coarse ? 720 : 720, wrap = el("div", { class: "nthview-set" });
      wrap.appendChild(el("p", { text: webc ? "The whole story, about " + storyMinutes() + " min, rendered frame by frame into one video file. It usually takes less time than watching it." : "This browser has no WebCodecs, so the video is recorded in real time: it takes the story's full length, about " + storyMinutes() + " min, and keeps this tab busy." }));
      if (!webc && !mrec) wrap.appendChild(el("p", { class: "nthview-hint", text: "This browser can neither encode nor record video, so there is no download here. Try a recent Chrome, Edge, Firefox or Safari." }));
      var f1 = el("fieldset", {}, [el("legend", { text: "Size" }),
        radio("nv-res", 720, size, "720p (1280 × 720)", "Smaller file, faster.", function (v) { size = v; }),
        radio("nv-res", 1080, size, "1080p (1920 × 1080)", coarse ? "Slow on a phone." : "Sharper, about twice as slow.", function (v) { size = v; })]);
      wrap.appendChild(f1);
      var f2 = el("fieldset", {}, [el("legend", { text: "Sound" })]);
      if (natural) f2.appendChild(el("p", { text: "With sound: the natural voice narrates and every character speaks." + (VO.ready ? "" : VO.cached ? " It starts first; it is already downloaded." : " It loads first (" + VO.sizeText() + " the first time).") }));
      else {
        f2.appendChild(el("p", { text: "Silent, with the captions and speech bubbles burned in. The browser cannot record the device's built-in voice." }));
        if (VO.english && VO.lib) f2.appendChild(cta("Use the natural voice for sound", "voice", function () { setVoiceKind("natural"); openExport(opener); }, true));
      }
      wrap.appendChild(f2);
      if (coarse) wrap.appendChild(el("p", { class: "nthview-hint", text: "On a phone, exporting is slow and drains the battery; 720p is the better choice." }));
      var prog = el("progress", { max: "1", value: "0", class: "nthview-eprog", hidden: "" }), stat = el("p", { role: "status", class: "nthview-hint" });
      var go = cta("Make the video", "download", function () {
        go.disabled = true; prog.hidden = false;
        runExport({ h: size, audio: natural, webc: webc }, function (p, msg) { prog.value = p; stat.textContent = msg; }).then(function (r) {
          stat.textContent = r; go.disabled = false; prog.hidden = true;
        }, function (err) { stat.textContent = "The export stopped: " + (err && err.message || err); go.disabled = false; prog.hidden = true; });
      });
      if (!webc && !mrec) go.disabled = true;
      var stop = cta("Cancel", "close", function () { if (exporting) exporting.cancel = true; }, true);
      wrap.appendChild(el("div", { class: "nthview-row nthview-erow" }, [go, stop]));
      wrap.appendChild(prog); wrap.appendChild(stat);
      openDlg("Download as MP4", wrap, opener);
    }
    function loadLazy(entry) {
      return new Promise(function (resolve, reject) {
        if (!entry) return reject(new Error("no exporter library is declared"));
        if (root[entry.global]) return resolve(root[entry.global]);
        var s = el("script", { src: entry.src }), t = root.setTimeout(function () { reject(new Error(entry.name + " did not load from " + entry.src + "; it needs internet access")); }, 25000);
        s.onload = function () { root.clearTimeout(t); if (root[entry.global]) resolve(root[entry.global]); else reject(new Error(entry.name + " did not start")); };
        s.onerror = function () { root.clearTimeout(t); reject(new Error(entry.name + " did not load from " + entry.src + "; it needs internet access")); };
        doc.head.appendChild(s);
      });
    }
    function yieldUI() { return new Promise(function (r) { root.setTimeout(r, 0); }); }
    /* the export timeline: every beat, with holds where the voice runs past the picture, every takeaway card and the recap */
    function exportPlan(len) {
      var segs = [], T = 0;
      beats.forEach(function (B, i) {
        var items = itemsOf(i), aud = [], holds = [], e = 0, v = 0, free = 0, end;
        if (len) {
          aud.push({ item: items[0], at: .1 }); free = .1 + len(items[0]);
          B.lines.forEach(function (ln, k) {
            var reach = e + (ln.t0 - v), start = Math.max(reach, free + .35);
            if (start > reach + .001) holds.push({ v: ln.t0, h: start - reach });
            aud.push({ item: items[k + 1], at: start }); e = start; v = ln.t0; free = start + len(items[k + 1]);
          });
          var reachEnd = e + (B.dur - v); end = Math.max(reachEnd, free + .45);
          if (end > reachEnd + .001) holds.push({ v: B.dur, h: end - reachEnd });
        } else end = B.dur;
        segs.push({ k: "beat", i: i, t0: T, len: end, holds: holds, aud: aud }); T += end;
        if (lastOfChapter(i) && chapters[B.ci].takeaway) {
          var tk = chapters[B.ci].takeaway, wi = wrapItems(B.ci), th = 0, pt;
          if (tk.think) th = Math.max(tk.seconds || 8, len ? len(wi[0]) + .8 : 0);
          pt = Math.max(3 + words(tk.points.join(" ")) * .3, len ? len(wi[wi.length - 1]) + 1 : 0);
          var wa = len ? (tk.think ? [{ item: wi[0], at: .3 }, { item: wi[1], at: th + .2 }] : [{ item: wi[0], at: .2 }]) : [];
          segs.push({ k: "wrap", i: i, t0: T, len: th + pt, think: th, aud: wa }); T += th + pt;
        }
      });
      var ei = endItems(), el2 = Math.max(7, len && ei.length ? len(ei[0]) + 1.5 : 0);
      segs.push({ k: "end", i: NB - 1, t0: T, len: el2, aud: len && ei.length ? [{ item: ei[0], at: .4 }] : [] }); T += el2;
      return { segs: segs, total: T };
    }
    function visualAt(sg, e) {
      var acc = 0, vp = 0;
      for (var k = 0; k < sg.holds.length; k++) {
        var hd = sg.holds[k];
        if (e < acc + (hd.v - vp)) return vp + (e - acc);
        acc += hd.v - vp; vp = hd.v;
        if (e < acc + hd.h) return hd.v;
        acc += hd.h;
      }
      return Math.min(beats[sg.i].dur, vp + (e - acc));
    }
    /* paint the stage into a 2D canvas: the WebGL frame, the spotlight, then every overlay as laid out */
    var rangeP = null;
    function rrect(cx, x, y, w, h, r) { cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r); cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath(); }
    function paintText(cx, t, ox, oy, a) {
      var s = t.nodeValue;
      if (!s || !/\S/.test(s)) return;
      var cs = root.getComputedStyle(t.parentNode), up = cs.textTransform === "uppercase", re = /\S+/g, m;
      cx.globalAlpha = a; cx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
      if ("letterSpacing" in cx) cx.letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
      cx.fillStyle = cs.color; cx.textBaseline = "middle";
      rangeP = rangeP || doc.createRange();
      while ((m = re.exec(s))) {
        rangeP.setStart(t, m.index); rangeP.setEnd(t, m.index + m[0].length);
        var q = rangeP.getClientRects()[0];
        if (q) cx.fillText(up ? m[0].toUpperCase() : m[0], q.left - ox, q.top - oy + q.height * .54);
      }
    }
    function paintNode(cx, n, ox, oy, a) {
      if (n.nodeType === 3) return paintText(cx, n, ox, oy, a);
      if (n.nodeType !== 1) return;
      var cs = root.getComputedStyle(n), tag = n.tagName.toLowerCase();
      if (cs.display === "none" || cs.visibility === "hidden" || tag === "button" || tag === "details" || tag === "progress") return;
      var al = a * parseFloat(cs.opacity || "1");
      if (al < .02) return;
      var r = n.getBoundingClientRect(), x = r.left - ox, y = r.top - oy, w = r.width, h = r.height;
      if (tag === "svg") {
        if (n.getAttribute("class") === "nthview-ring") {
          var fg = n.lastChild, off = parseFloat(fg.style.strokeDashoffset || "0") || 0, f = 1 - off / 113.1, cxx = x + w / 2, cyy = y + h / 2, rr = w * 18 / 44;
          cx.globalAlpha = al; cx.lineWidth = w * 4 / 44; cx.lineCap = "round";
          cx.strokeStyle = "rgba(128,128,128,.25)"; cx.beginPath(); cx.arc(cxx, cyy, rr, 0, Math.PI * 2); cx.stroke();
          cx.strokeStyle = root.getComputedStyle(container).getPropertyValue("--nv-accent").trim() || "#6a4dd6";
          if (f > .005) { cx.beginPath(); cx.arc(cxx, cyy, rr, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2); cx.stroke(); }
        }
        return;
      }
      cx.globalAlpha = al;
      var rad = Math.min(parseFloat(cs.borderTopLeftRadius) || 0, h / 2, w / 2), bg = cs.backgroundColor;
      if (n === tcard) {
        var g = cx.createRadialGradient(x + w / 2, y + h / 2, 0, x + w / 2, y + h / 2, Math.max(w, h) * .5);
        g.addColorStop(0, "rgba(16,14,28,.62)"); g.addColorStop(.72, "rgba(16,14,28,0)"); cx.fillStyle = g; cx.fillRect(x, y, w, h);
      } else if (bg && bg !== "transparent" && !/rgba\(0, 0, 0, 0\)/.test(bg)) { cx.fillStyle = bg; rrect(cx, x, y, w, h, rad); cx.fill(); }
      var bw = parseFloat(cs.borderTopWidth) || 0;
      if (bw > 0 && cs.borderTopStyle !== "none") {
        cx.lineWidth = bw; cx.strokeStyle = cs.borderTopColor; cx.setLineDash(cs.borderTopStyle === "dashed" ? [bw * 3, bw * 2] : []);
        rrect(cx, x + bw / 2, y + bw / 2, w - bw, h - bw, Math.max(0, rad - bw / 2)); cx.stroke(); cx.setLineDash([]);
      }
      if (n.classList.contains("is-hl")) { cx.fillStyle = "#ffd666"; cx.fillRect(x, y, 3, h); }
      if (n.classList.contains("nthview-bubble")) {
        var tl = x + w * (parseFloat(n.style.getPropertyValue("--tail")) || 50) / 100;
        cx.fillStyle = "#fff"; cx.beginPath(); cx.moveTo(tl - 9, y + h - 1); cx.lineTo(tl + 9, y + h - 1); cx.lineTo(tl, y + h + 9); cx.closePath(); cx.fill();
      }
      if (tag === "img") {
        if (n.complete && n.naturalWidth) { cx.save(); if (rad >= w / 2 - 1) { cx.beginPath(); cx.arc(x + w / 2, y + h / 2, w / 2, 0, Math.PI * 2); cx.clip(); } cx.drawImage(n, x, y, w, h); cx.restore(); }
        return;
      }
      if (tag === "li" && n.parentNode.classList.contains("nthview-points")) {
        var fs = parseFloat(cs.fontSize), lh = parseFloat(cs.lineHeight) || fs * 1.5;
        cx.font = cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily; cx.fillStyle = cs.color; cx.textBaseline = "middle"; cx.textAlign = "right";
        cx.fillText(n.parentNode.tagName === "OL" ? (Array.prototype.indexOf.call(n.parentNode.children, n) + 1) + "." : "•", x - fs * .35, y + lh / 2);
        cx.textAlign = "left";
      }
      for (var c = n.firstChild; c; c = c.nextSibling) paintNode(cx, c, ox, oy, al);
      cx.globalAlpha = 1;
    }
    function paintStage(cx, W, H) {
      var o = stage.getBoundingClientRect();
      cx.globalAlpha = 1; cx.drawImage(canvas, 0, 0, W, H);
      if (spot.classList.contains("is-on")) {
        var sx = parseFloat(spot.style.getPropertyValue("--sx")) || W / 2, sy = parseFloat(spot.style.getPropertyValue("--sy")) || H / 2, sr2 = parseFloat(spot.style.getPropertyValue("--sr")) || 120;
        var g = cx.createRadialGradient(sx, sy, sr2, sx, sy, sr2 * 1.9); g.addColorStop(0, "rgba(12,10,28,0)"); g.addColorStop(1, "rgba(12,10,28,.42)");
        cx.fillStyle = g; cx.fillRect(0, 0, W, H);
      }
      [layer, chip, meetEl, tcard, cap, ov].forEach(function (n) { paintNode(cx, n, o.left, o.top, 1); });
      cx.globalAlpha = 1;
    }
    function exportFrame(plan, et, dt, seen) {
      var sg = null;
      for (var k = 0; k < plan.segs.length; k++) { var q = plan.segs[k]; if (et < q.t0 + q.len || k === plan.segs.length - 1) { sg = q; break; } }
      var e = et - sg.t0;
      if (sg.k === "beat") {
        if (seen.seg !== sg) { seen.seg = sg; st.phase = "beat"; st.i = sg.i; hideOverlay(); startTransition(beats[sg.i], seen.first || beats[sg.i].cut); seen.first = false; beatDom(); }
        st.t = visualAt(sg, e);
      } else if (sg.k === "wrap") {
        var stage2 = sg.think && e < sg.think ? "think" : "points";
        if (seen.seg !== sg || seen.ws !== stage2) { seen.seg = sg; seen.ws = stage2; st.phase = "wrap"; st.i = sg.i; st.wstage = stage2; showWrap(); }
        if (stage2 === "think") updateRing(1 - e / sg.think);
      } else if (seen.seg !== sg) { seen.seg = sg; st.phase = "end"; st.i = NB - 1; showEnd(); }
      clock = et;
      draw(dt);
    }
    async function runExport(o, report) {
      if (exporting) throw new Error("an export is already running");
      var job = exporting = { cancel: false }, W = o.h === 1080 ? 1920 : 1280, H = o.h === 1080 ? 1080 : 720, FPS = 30;
      var keep = { phase: st.phase, i: st.i, t: st.t, wstage: st.wstage, speed: VO.speed };
      var len = null, clips = {};
      try {
        var Mux = null;
        if (o.webc) { report(0, "Loading the encoder…"); Mux = await loadLazy((NthView.libs || []).filter(function (l) { return l.lazy && l.global === "Mp4Muxer"; })[0]); }
        if (o.audio) {
          report(0, "Loading the natural voice…");
          ensureNatural(); await VO.load();
          var all = [];
          beats.forEach(function (B, i) { all = all.concat(itemsOf(i)); if (lastOfChapter(i)) all = all.concat(wrapItems(B.ci)); });
          all = all.concat(endItems());
          VO.speed = 1;
          for (var a = 0; a < all.length; a++) {
            if (job.cancel) throw new Error("cancelled");
            report(a / all.length * .35, "Preparing the voices: " + (a + 1) + " of " + all.length);
            var it = all[a], ps = VO.phrases(it.text), tn = VO.TONE_SET[it.tone] || VO.TONE_SET.warm, c = VO.kokoroCast[it.who || ""] || VO.kokoroCast[""], parts = [], d = 0;
            for (var p = 0; p < ps.length; p++) { var cl = await VO.clip(ps[p].text, it.who, it.tone, true); parts.push({ pcm: cl.pcm, rate: cl.rate, at: d }); d += cl.pcm.length / cl.rate / c.rate + ps[p].gap * tn[3]; }
            clips[it.key] = { parts: parts, len: d, crate: c.rate, gain: tn[2] };
          }
          len = function (item) { return clips[item.key] ? clips[item.key].len : 0; };
        }
        var plan = exportPlan(len), frames = Math.ceil(plan.total * FPS), base = o.audio ? .35 : 0;
        hush(); exportSize = { w: W, h: H }; container.classList.add("nthview-exporting"); layout();
        var cv = el("canvas"); cv.width = W; cv.height = H;
        var cx = cv.getContext("2d"), seen = { first: true };
        var out = { video: 0 }, blob, ext = "mp4";
        if (o.webc) {
          var vcfg = null, cands = ["avc1.640028", "avc1.4d0028", "avc1.42e01f", "avc1.42001f"];
          for (var ci2 = 0; ci2 < cands.length && !vcfg; ci2++) {
            var cfg = { codec: cands[ci2], width: W, height: H, bitrate: H >= 1080 ? 3.5e6 : 1.6e6, framerate: FPS, avc: { format: "avc" } };
            try { if ((await root.VideoEncoder.isConfigSupported(cfg)).supported) vcfg = cfg; } catch (er) {}
          }
          if (!vcfg) throw new Error("this browser cannot encode H.264 video");
          var acfg = null, acodec = "aac";
          if (o.audio && root.AudioEncoder) {
            var aa = { codec: "mp4a.40.2", sampleRate: 48000, numberOfChannels: 1, bitrate: 128000 }, ob = { codec: "opus", sampleRate: 48000, numberOfChannels: 1, bitrate: 96000 };
            try { if ((await root.AudioEncoder.isConfigSupported(aa)).supported) acfg = aa; } catch (er) {}
            if (!acfg) { try { if ((await root.AudioEncoder.isConfigSupported(ob)).supported) { acfg = ob; acodec = "opus"; } } catch (er) {} }
          }
          var muxer = new Mux.Muxer({ target: new Mux.ArrayBufferTarget(), video: { codec: "avc", width: W, height: H, frameRate: FPS },
            audio: acfg ? { codec: acodec, numberOfChannels: 1, sampleRate: 48000 } : undefined, fastStart: "in-memory", firstTimestampBehavior: "offset" });
          var failed = null;
          var venc = new root.VideoEncoder({ output: function (ch, meta) { muxer.addVideoChunk(ch, meta); }, error: function (er) { failed = er; } });
          venc.configure(vcfg);
          var t0 = Date.now();
          for (var f = 0; f < frames; f++) {
            if (job.cancel) throw new Error("cancelled");
            if (failed) throw failed;
            exportFrame(plan, f / FPS, 1 / FPS, seen);
            paintStage(cx, W, H);
            var vf = new root.VideoFrame(cv, { timestamp: Math.round(f * 1e6 / FPS), duration: Math.round(1e6 / FPS) });
            venc.encode(vf, { keyFrame: f % (FPS * 2) === 0 }); vf.close();
            while (venc.encodeQueueSize > 6) await new Promise(function (r) { root.setTimeout(r, 4); });
            if (f % 6 === 0) { var el3 = (Date.now() - t0) / 1000, left = f ? el3 / f * (frames - f) : 0; report(base + (1 - base) * .95 * f / frames, "Rendering: " + Math.round(f / FPS) + " of " + Math.round(plan.total) + " s" + (f > 30 ? ", about " + Math.ceil(left) + " s left" : "")); await yieldUI(); }
          }
          await venc.flush(); venc.close();
          if (failed) throw failed;
          if (acfg) {
            report(.97, "Encoding the sound…");
            var SR = 48000, mix = new Float32Array(Math.ceil(plan.total * SR));
            plan.segs.forEach(function (sg) {
              sg.aud.forEach(function (au) {
                var c2 = clips[au.item.key]; if (!c2) return;
                c2.parts.forEach(function (pt) {
                  var start = (sg.t0 + au.at + pt.at) * SR, step = pt.rate / SR * c2.crate, n = Math.floor(pt.pcm.length / step);
                  for (var j = 0; j < n; j++) { var sp = j * step, i0 = Math.floor(sp), fr = sp - i0, v = pt.pcm[i0] * (1 - fr) + (pt.pcm[i0 + 1] || 0) * fr, di = Math.floor(start) + j; if (di < mix.length) mix[di] += v * c2.gain; }
                });
              });
            });
            var aerr = null, aenc = new root.AudioEncoder({ output: function (ch, meta) { muxer.addAudioChunk(ch, meta); }, error: function (er) { aerr = er; } });
            aenc.configure(acfg);
            for (var s0 = 0; s0 < mix.length; s0 += 4800) {
              var nfr = Math.min(4800, mix.length - s0);
              var ad = new root.AudioData({ format: "f32-planar", sampleRate: SR, numberOfFrames: nfr, numberOfChannels: 1, timestamp: Math.round(s0 * 1e6 / SR), data: mix.subarray(s0, s0 + nfr) });
              aenc.encode(ad); ad.close();
              if (aenc.encodeQueueSize > 20) await new Promise(function (r) { root.setTimeout(r, 2); });
            }
            await aenc.flush(); aenc.close();
            if (aerr) throw aerr;
          }
          muxer.finalize();
          blob = new Blob([muxer.target.buffer], { type: "video/mp4" });
        } else {
          blob = await recordRealtime(plan, cv, cx, W, H, FPS, clips, o.audio, job, report, seen);
          ext = /mp4/.test(blob.type) ? "mp4" : "webm";
        }
        var url = root.URL.createObjectURL(blob), aEl = el("a", { href: url, download: slug() + "." + ext });
        container.appendChild(aEl); aEl.click(); aEl.remove();
        root.setTimeout(function () { root.URL.revokeObjectURL(url); }, 120000);
        report(1, "");
        return "Saved " + slug() + "." + ext + " (" + (blob.size / 1048576).toFixed(1) + " MB, " + Math.round(plan.total) + " s" + (o.audio ? ", with sound" : ", silent with captions") + ").";
      } finally {
        exporting = null; exportSize = null; VO.speed = keep.speed;
        container.classList.remove("nthview-exporting");
        st.phase = keep.phase; st.i = keep.i; st.t = keep.t; st.wstage = keep.wstage; st.playing = false;
        hideOverlay();
        if (st.phase === "beat") { beatDom(); startTransition(beats[st.i], true); }
        else if (st.phase === "wrap") showWrap(); else if (st.phase === "end") showEnd(); else showIntro();
        layout(); ui();
      }
    }
    /* without WebCodecs: play it in real time into MediaRecorder */
    function recordRealtime(plan, cv, cx, W, H, FPS, clips, withAudio, job, report, seen) {
      return new Promise(function (resolve, reject) {
        var stream = cv.captureStream(FPS), ac = null;
        if (withAudio) {
          var AC = root.AudioContext || root.webkitAudioContext; ac = new AC(); var dest = ac.createMediaStreamDestination();
          dest.stream.getAudioTracks().forEach(function (tr) { stream.addTrack(tr); });
          var at0 = ac.currentTime + .3;
          plan.segs.forEach(function (sg) { sg.aud.forEach(function (au) { var c2 = clips[au.item.key]; if (!c2) return; c2.parts.forEach(function (pt) {
            var b = ac.createBuffer(1, pt.pcm.length, pt.rate); b.getChannelData(0).set(pt.pcm);
            var s = ac.createBufferSource(), g = ac.createGain(); s.buffer = b; s.playbackRate.value = c2.crate; g.gain.value = c2.gain; s.connect(g); g.connect(dest); s.start(at0 + sg.t0 + au.at + pt.at);
          }); }); });
        }
        var mime = ["video/mp4;codecs=avc1.42E01E,mp4a.40.2", "video/mp4", "video/webm;codecs=vp9,opus", "video/webm"].filter(function (m) { return root.MediaRecorder.isTypeSupported(m); })[0] || "";
        var rec = new root.MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: H >= 1080 ? 8e6 : 5e6 } : {}), parts = [];
        rec.ondataavailable = function (e) { if (e.data && e.data.size) parts.push(e.data); };
        rec.onstop = function () { if (ac) ac.close(); if (job.cancel) reject(new Error("cancelled")); else resolve(new Blob(parts, { type: (mime || "video/webm").split(";")[0] })); };
        var start = (root.performance.now() / 1000) + .3, last = start;
        rec.start(1000);
        (function tick() {
          var now = root.performance.now() / 1000, et = Math.max(0, now - start);
          if (job.cancel || et >= plan.total) { rec.stop(); return; }
          exportFrame(plan, et, Math.min(.1, now - last), seen); last = now;
          paintStage(cx, W, H);
          report(et / plan.total, "Recording in real time: " + Math.round(et) + " of " + Math.round(plan.total) + " s");
          root.setTimeout(tick, 1000 / FPS);
        })();
      });
    }

    /* ---------- full screen: the real thing where allowed, a viewport fill where not (iPhone) ---------- */
    var pseudo = false;
    function fsEl() { return doc.fullscreenElement || doc.webkitFullscreenElement || null; }
    function isFull() { return pseudo || fsEl() === container; }
    function lockLandscape() { try { var o = root.screen && root.screen.orientation; if (o && o.lock) { var pr = o.lock("landscape"); if (pr && pr.catch) pr.catch(function () {}); } } catch (e) {} }
    function setPseudo(on) {
      pseudo = on; pseudoWanted = on;
      doc.documentElement.style.overflow = on ? "hidden" : "";
      if (on) root.scrollTo(0, 0);
      layout();
    }
    function enterFull() {
      var req = container.requestFullscreen || container.webkitRequestFullscreen;
      if (req) {
        try {
          var pr = req.call(container, { navigationUI: "hide" });
          if (pr && pr.then) pr.then(lockLandscape, function () { if (!fsEl()) setPseudo(true); });
          else lockLandscape();
          root.setTimeout(function () { if (alive && !fsEl() && !pseudo) setPseudo(true); }, 1200);   /* a request that never settles */
          return;
        } catch (e) { /* fall through to the viewport fill */ }
      }
      setPseudo(true);
    }
    function exitFull() {
      if (pseudo) setPseudo(false);
      if (fsEl()) { var ex = doc.exitFullscreen || doc.webkitExitFullscreen; try { var pr = ex.call(doc); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
      try { root.screen.orientation.unlock(); } catch (e) {}
    }
    function toggleFull() { if (isFull()) exitFull(); else enterFull(); }

    /* ---------- layout ---------- */
    function layout() {
      if (!alive) return;
      var full = isFull(), vw = root.innerWidth, vh = root.innerHeight, land = vw >= vh, sw, sh;
      container.classList.toggle("nthview-full", full);
      container.classList.toggle("nthview-land", full && land);
      if (exportSize) sw = exportSize.w;
      else if (full) { sw = land ? Math.min(vw, vh * 16 / 9) : vw; }
      else {
        var cs = root.getComputedStyle(container), cw = container.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        sw = Math.min(cw, Math.max(300, (vh - 160) * 16 / 9));
      }
      sw = Math.max(200, Math.floor(sw)); sh = Math.round(sw * 9 / 16);
      SW = sw; SH = sh;
      stage.style.width = sw + "px"; stage.style.height = sh + "px"; player.style.width = sw + "px";
      stage.style.setProperty("--u", (sh / 100).toFixed(2) + "px");
      compact = sh < 300 && !exportSize;
      container.classList.toggle("nthview-compact", compact);
      container.classList.toggle("nthview-narrow", sw < 680);
      below.hidden = !compact;
      var host = compact ? below : stage;
      if (ov.parentNode !== host) { if (compact) below.insertBefore(ov, below.firstChild); else stage.insertBefore(ov, sr); }
      renderer.setPixelRatio(exportSize ? 1 : Math.min(root.devicePixelRatio || 1, sh < 520 ? 1.5 : 2));
      renderer.setSize(sw, sh, false);
      camera.aspect = sw / sh; camera.updateProjectionMatrix();
      container.style.setProperty("--barh", bar.offsetHeight + "px");
      rotate.hidden = !(full && !land && coarse && !rotDismissed);
      bFull.replaceChild(icon(full ? "unfull" : "full"), bFull.firstChild);
      bFull.setAttribute("aria-label", full ? "Leave full screen (F)" : "Full screen (F)"); bFull.title = bFull.getAttribute("aria-label");
      sizesDirty = true; scrubLayout = true;
      if (lastBeatUI !== -2) ui();
    }
    rotBtn.addEventListener("click", function () { rotDismissed = true; layout(); });

    /* ---------- controls ---------- */
    var scrubLayout = true, dragging = false, dragWas = false;
    function ui() {
      var playing = st.playing;
      bPlay.replaceChild(icon(playing ? "pause" : "play"), bPlay.firstChild);
      bPlay.setAttribute("aria-label", playing ? "Pause (Space)" : "Play (Space)"); bPlay.title = bPlay.getAttribute("aria-label");
      var introBig = st.phase === "intro" && compact;   /* the intro card sits under the stage: offer the start on the stage too */
      big.hidden = !(st.phase === "beat" && !playing) && !introBig;
      big.setAttribute("aria-label", introBig ? (coarse ? "Play full screen" : "Play") : st.atEnd ? "Play the next beat" : "Play");
      bVoice.setAttribute("aria-pressed", String(st.voice)); bVoice.replaceChild(icon(st.voice ? "voice" : "mute"), bVoice.firstChild);
      bSpeed.textContent = String(st.speed).replace(/^0/, "") + "×";
      var B = beats[st.i];
      pos.textContent = st.phase === "end" ? "The end" : "Ch " + (B.ci + 1) + "/" + chapters.length + " · " + (B.bi + 1) + "/" + chapters[B.ci].beats.length;
      scrub.setAttribute("aria-valuenow", String(st.i + 1));
      scrub.setAttribute("aria-valuetext", "Chapter " + (B.ci + 1) + ", beat " + (B.bi + 1) + ": " + B.b.caption);
      bPrev.disabled = st.phase === "intro" || (st.i === 0 && st.phase === "beat" && st.t < 1.5);
      if (!playing) container.classList.remove("nthview-idle");
      if (st.phase === "beat" && lastBeatUI !== st.i) beatDom();
    }
    var segX = [];
    function drawScrub() {
      if (scrubLayout) {
        segX = segs.map(function (s) { return [s.offsetLeft, s.offsetWidth]; });
        chNums.forEach(function (n, ci) { var sx = segX[C.chStart[ci]]; n.style.left = sx[0] + "px"; });
        scrubLayout = false;
      }
      var cur = st.phase === "end" ? NB : st.i, frac = st.phase === "beat" ? clamp01(st.t / beats[st.i].dur) : st.phase === "intro" ? 0 : 1;
      segs.forEach(function (s, i) { var w = i < cur ? 100 : i > cur ? 0 : frac * 100; if (s._w !== w) { s._w = w; s.firstChild.style.width = w + "%"; } });
      var kx = cur >= NB ? segX[NB - 1][0] + segX[NB - 1][1] : segX[cur][0] + segX[cur][1] * frac;
      knob.style.left = Math.round(kx) + "px";
    }
    function beatAtX(x) {
      for (var i = 0; i < segX.length; i++) if (x < segX[i][0] + segX[i][1] + 1) return i;
      return NB - 1;
    }
    function scrubX(e) { var r = track.getBoundingClientRect(); return e.clientX - r.left; }
    scrub.addEventListener("pointerdown", function (e) {
      dragging = true; dragWas = st.playing || st.phase === "intro"; st.playing = false; hush();
      try { scrub.setPointerCapture(e.pointerId); } catch (er) {}
      var i = beatAtX(scrubX(e)); if (i !== st.i || st.phase !== "beat") gotoBeat(i, true);
      e.preventDefault();
    });
    scrub.addEventListener("pointermove", function (e) {
      var x = scrubX(e), i = beatAtX(x);
      if (dragging) { if (i !== st.i) gotoBeat(i, true); }
      if (e.pointerType === "mouse" || dragging) {
        var B = beats[i]; tip.hidden = false; tip.textContent = "Ch " + (B.ci + 1) + " · " + chapters[B.ci].title + ": " + B.b.caption;
        tip.style.left = Math.max(60, Math.min(track.offsetWidth - 60, x)) + "px";
      }
    });
    function endDrag() { if (!dragging) return; dragging = false; tip.hidden = true; if (dragWas) play(); else ui(); }
    scrub.addEventListener("pointerup", endDrag); scrub.addEventListener("pointercancel", endDrag);
    scrub.addEventListener("pointerleave", function () { if (!dragging) tip.hidden = true; });
    scrub.addEventListener("keydown", function (e) {
      var k = e.key, h = true;
      if (k === "ArrowRight" || k === "ArrowUp") next();
      else if (k === "ArrowLeft" || k === "ArrowDown") prev();
      else if (k === "Home") gotoBeat(0, true);
      else if (k === "End") gotoBeat(NB - 1, true);
      else if (k === "PageDown") jumpChapter(1);
      else if (k === "PageUp") jumpChapter(-1);
      else h = false;
      if (h) { e.preventDefault(); e.stopPropagation(); }
    });
    bPlay.addEventListener("click", toggle); big.addEventListener("click", function () { if (st.phase === "intro" && coarse) enterFull(); play(); });
    bPrev.addEventListener("click", prev); bNext.addEventListener("click", next); bReplay.addEventListener("click", replay);
    bSpeed.addEventListener("click", function () { setSpeed(SPEEDS[(SPEEDS.indexOf(st.speed) + 1) % SPEEDS.length]); });
    bVoice.addEventListener("click", function () { setVoice(!st.voice); });
    bList.addEventListener("click", function () { openList(bList); });
    bCast.addEventListener("click", function () { openCast(bCast); });
    bSet.addEventListener("click", function () { openSettings(bSet); });
    bFull.addEventListener("click", toggleFull);
    stage.addEventListener("click", function (e) {
      if (e.target !== canvas && e.target !== layer && !layer.contains(e.target) && e.target !== stage) return;
      var wasIdle = container.classList.contains("nthview-idle");
      wake();
      if (isFull() && wasIdle) return;
      if (st.phase === "beat") toggle();
      else if (st.phase === "intro") play();
    });

    var idleTimer = 0, resumeEl = null;
    function wake() {
      container.classList.remove("nthview-idle");
      root.clearTimeout(idleTimer);
      idleTimer = root.setTimeout(function () { if (alive && st.playing && isFull() && dlg.hidden && !dragging) container.classList.add("nthview-idle"); }, 2800);
    }
    function dismissResume() { if (resumeEl) { var r = resumeEl; resumeEl = null; r.classList.add("is-gone"); root.setTimeout(function () { r.remove(); }, 700); } }
    function onKey(e) {
      if (!alive) return;
      if (!dlg.hidden) {
        if (e.key === "Escape") { e.preventDefault(); closeDlg(); }
        else if (e.key === "Tab") trap(e);
        return;
      }
      var tg = e.target, tn = tg && tg.tagName;
      if (tn === "INPUT" || tn === "TEXTAREA" || tn === "SELECT" || (tg && tg.isContentEditable)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (tg && tg !== doc.body && tg !== doc.documentElement && !container.contains(tg)) return;
      var k = e.key, h = true;
      if ((k === " " || k === "Enter") && (tn === "BUTTON" || tn === "A" || tn === "SUMMARY")) return;
      if (k === " " || k === "k" || k === "K") toggle();
      else if (k === "ArrowRight") { if (e.shiftKey) jumpChapter(1); else next(); }
      else if (k === "ArrowLeft") { if (e.shiftKey) jumpChapter(-1); else prev(); }
      else if (k === "r" || k === "R") replay();
      else if (k === "f" || k === "F") toggleFull();
      else if (k === "v" || k === "V") setVoice(!st.voice);
      else if (k === "c" || k === "C") openCast(bCast);
      else if (k === "t" || k === "T") openList(bList);
      else if (k === "s" || k === "S") openSettings(bSet);
      else if (k === "+" || k === "=") setSpeed(SPEEDS[Math.min(SPEEDS.length - 1, SPEEDS.indexOf(st.speed) + 1)]);
      else if (k === "-" || k === "_") setSpeed(SPEEDS[Math.max(0, SPEEDS.indexOf(st.speed) - 1)]);
      else if (k === "Escape" && pseudo) setPseudo(false);
      else h = false;
      if (h) { e.preventDefault(); wake(); }
    }
    function onMove() { if (isFull()) wake(); }
    function onVis() { if (doc.hidden && st.playing) pause(); }
    var ro = root.ResizeObserver ? new root.ResizeObserver(function () { layout(); }) : null;
    doc.addEventListener("keydown", onKey);
    root.addEventListener("resize", layout);
    root.addEventListener("orientationchange", layout);
    function onFs() { if (fsEl() === container && pseudo) { pseudo = false; pseudoWanted = false; doc.documentElement.style.overflow = ""; } layout(); }
    doc.addEventListener("fullscreenchange", onFs); doc.addEventListener("webkitfullscreenchange", onFs);
    doc.addEventListener("visibilitychange", onVis);
    container.addEventListener("pointermove", onMove); container.addEventListener("touchstart", onMove, { passive: true });
    if (ro) ro.observe(container);

    /* ---------- the loop ---------- */
    var alive = true, raf = 0, lastNow = 0;
    function frame(now) {
      if (!alive) return;
      if (!doc.contains(stage)) { teardown(); return; }
      raf = root.requestAnimationFrame(frame);
      var dt = lastNow ? Math.min(.1, Math.max(0, (now - lastNow) / 1000)) : 0; lastNow = now;
      if (doc.hidden) return;
      if (exporting) return;
      clock += dt;
      step(dt);
      draw(dt);
    }
    function draw(dt) {
      var B = beats[st.i], t = st.phase === "beat" ? st.t : st.phase === "intro" ? Math.min(B.dur, B.T0 + 1.6) : B.dur;
      evaluate(st.i, t);
      var info = overlays();
      poseAll(info.lineOn);
      placeProps();
      drawLinks(); drawConfetti();
      Wd.tickAnim(clock, st.rm);
      cameraFor(dt);
      renderer.render(scene, camera);
      placeOverlays(info);
      drawScrub();
    }
    teardown = function () {
      if (!alive) return;
      alive = false; teardown = null;
      root.cancelAnimationFrame(raf); root.clearTimeout(idleTimer); hush();
      doc.removeEventListener("keydown", onKey);
      root.removeEventListener("resize", layout); root.removeEventListener("orientationchange", layout);
      doc.removeEventListener("fullscreenchange", onFs); doc.removeEventListener("webkitfullscreenchange", onFs);
      doc.removeEventListener("visibilitychange", onVis);
      container.removeEventListener("pointermove", onMove); container.removeEventListener("touchstart", onMove);
      if (ro) ro.disconnect();
      if (pseudo) doc.documentElement.style.overflow = "";
      container.classList.remove("nthview-full", "nthview-land", "nthview-idle", "nthview-compact", "nthview-narrow");
      if (exporting) exporting.cancel = true;
      VO.dispose();
      try { renderer.dispose(); } catch (e) {}
    };

    /* ---------- start, or pick up where the learner left off ---------- */
    if (pseudoWanted) { pseudo = true; doc.documentElement.style.overflow = "hidden"; }
    layout();
    if (st.phase === "beat") { beatDom(); startTransition(beats[st.i], true); }
    if (st.phase === "intro") showIntro();
    else if (st.phase === "wrap") showWrap();
    else if (st.phase === "end") showEnd();
    if (saved && st.phase === "end" && saved.done !== true) { st.done = true; persist(); }
    if (resumed) {
      var Bq = beats[st.i], where = st.phase === "end" ? "the recap" : st.phase === "wrap" ? "the takeaways of chapter " + (Bq.ci + 1) : "chapter " + (Bq.ci + 1) + ", beat " + (Bq.bi + 1);
      resumeEl = el("div", { class: "nthview-resume", role: "status", text: "Welcome back, continuing from " + where + "." });
      stage.appendChild(resumeEl);
      root.setTimeout(dismissResume, 5000);
    }
    /* start the camera on its first shot */
    evaluate(st.i, st.phase === "beat" ? 0 : beats[st.i].dur);
    poseAll({}); placeProps();
    if (st.phase === "beat") { shot(beats[st.i].shot, focusPoints(beats[st.i]), 0, beats[st.i]); cam.pos.copy(shotPos); cam.look.copy(shotLook); }
    else if (st.phase === "intro") { shot("establishing", [V(C.PL[beats[0].place].x, 1.4, 0)], .5, beats[0]); cam.pos.copy(shotPos); cam.look.copy(shotLook); }
    ui();
    raf = root.requestAnimationFrame(frame);
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    if (teardown) teardown();
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-story");
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
    var missing = (NthView.libs || []).filter(function (l) { return l.kind === "script" && !l.lazy && !root[l.global]; });
    if (missing.length) {
      var errs = missing.map(function (l) { return { path: "$", message: l.name + " did not load from " + l.src + ". This file needs internet access the first time it opens." }; });
      renderErrorPanel(container, { errors: errs });
      return { valid: false, errors: errs, warnings: result.warnings };
    }
    render(container, data);
    return result;
  };

  NthView.libs = [
    { kind: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", global: "THREE", name: "three.js r128" },
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400&family=Fredoka:wght@500;600&display=swap", name: "Google Fonts (Atkinson Hyperlegible, Fredoka)" },
    /* on demand only (AGENTS.md §5.4 rules 7-11): the MP4 muxer when the learner exports, the neural voice when they pick it */
    { kind: "script", lazy: true, src: "https://cdn.jsdelivr.net/npm/mp4-muxer@5.2.2/build/mp4-muxer.js", global: "Mp4Muxer", name: "mp4-muxer 5.2.2" },
    { kind: "module", src: "https://cdn.jsdelivr.net/npm/kokoro-js@1.2.1/dist/kokoro.web.js", name: "kokoro-js 1.2.1 (Kokoro-82M, q8)",
      weights: "https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX", size: "about 98 MB (q8, WASM) or 330 MB (fp32, WebGPU)" }
  ];
})(typeof globalThis !== "undefined" ? globalThis : window);
