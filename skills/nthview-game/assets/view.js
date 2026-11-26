/* NthView — game renderer (shared core) — schemaVersion 1
 * Requires scripts/validate.js to be loaded first, and one engine,
 * assets/engine-<game>.js, after this file (AGENTS.md §5.6).
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
    ".nthview .nthview-error-panel li{overflow-wrap:anywhere}",
    ".nthview.nthview-game.nthview-play{max-width:none;margin:0;padding:0;position:relative;width:100%;height:100vh;height:100dvh;min-height:420px;overflow:hidden;",
    "  --display:\"Avenir Next\",\"Segoe UI\",system-ui,sans-serif;--body:\"Segoe UI\",system-ui,-apple-system,sans-serif;",
    "  --hud-bg:rgba(8,11,17,.72);--hud-ink:#f2f5fb;--gold:#ffc83d;",
    "  --panel:rgba(250,251,253,.96);--panel-solid:#fafbfd;--ink:#171c26;--muted:#586175;--line:#d9dee8;--chip:#eef1f6;--accent:#c96a10;--accent-ink:#9a4f08;--star:#8a5a00;--ok:#1f7a45;--no:#b83a2c;--on-accent:#fff;",
    "  background:#07090d;color:var(--ink);font-family:var(--body);-webkit-tap-highlight-color:transparent}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-game.nthview-play{--panel:rgba(19,23,32,.96);--panel-solid:#131720;--ink:#eef1f7;--muted:#a7b0c2;--line:#2f3747;--chip:#1c222e;--accent:#ffb23e;--accent-ink:#ffb23e;--star:#ffc83d;--ok:#6fd39a;--no:#ff8f7a;--on-accent:#1b1304}}",
    "body:has(> .nthview-game.nthview-play){margin:0;overflow:hidden;background:#07090d}",

    ".nthview .nthview-hidden{display:none!important}",
    ".nthview-game button{font:inherit;color:inherit;cursor:pointer}",
    ".nthview-game button:disabled{cursor:default}",
    ".nthview .nthview-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none;cursor:pointer}",
    ".nthview .nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".nthview .nthview-col{position:absolute;top:0;bottom:0;left:50%;width:min(560px,100%);transform:translateX(-50%);pointer-events:none;z-index:5}",
    /* HUD: minimal, like the game */
    ".nthview .nthview-hud{position:absolute;top:0;left:0;right:0;padding:max(10px,env(safe-area-inset-top)) 10px 0;display:flex;align-items:flex-start;gap:8px;color:var(--hud-ink)}",
    ".nthview .nthview-hchip{background:var(--hud-bg);border:1px solid rgba(255,255,255,.14);border-radius:14px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
    ".nthview .nthview-pausebtn{width:44px;height:44px;flex:none;display:grid;place-items:center;pointer-events:auto;color:var(--hud-ink);padding:0}",
    ".nthview .nthview-hleft{display:flex;flex-direction:column;gap:6px;align-items:flex-start;flex:none}",
    ".nthview .nthview-restart{pointer-events:auto;font-size:.72rem;font-weight:700;padding:5px 10px;min-height:28px;border-radius:10px;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.2)}",
    ".nthview .nthview-card .nthview-restart{background:var(--chip);color:var(--ink);border-color:var(--line);font-size:.85rem;padding:9px 14px;min-height:40px}",
    ".nthview .nthview-resume{position:absolute;left:50%;top:84px;transform:translateX(-50%);z-index:25;background:var(--panel-solid);color:var(--ink);border:2px solid var(--accent);border-radius:14px;padding:9px 16px;font-weight:700;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:calc(100% - 32px);text-align:center;pointer-events:none;transition:opacity .4s}",
    ".nthview .nthview-resume.nthview-gone{opacity:0}",
    ".nthview .nthview-hmid{flex:1;min-width:0;padding:6px 10px 7px}",
    ".nthview .nthview-hkick{font-family:var(--display);font-weight:900;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}",
    ".nthview .nthview-hname{font-family:var(--display);font-weight:700;font-size:.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview .nthview-hbar{height:4px;border-radius:2px;background:rgba(255,255,255,.18);margin-top:5px;overflow:hidden}",
    ".nthview .nthview-hbar i{display:block;height:100%;width:0;background:var(--gold);border-radius:2px;transition:width .4s}",
    ".nthview .nthview-hright{padding:6px 10px;display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:none}",
    ".nthview .nthview-hstats{display:flex;gap:8px;font-size:.8rem;font-weight:700;white-space:nowrap}",
    ".nthview .nthview-hstats b{color:var(--gold)}",
    ".nthview .nthview-hstats span.nthview-bump{animation:nthview-bump .3s ease-out}",
    "@keyframes nthview-bump{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}",
    /* callout: the room trial's prompt, at the bottom so the room stays visible */
    ".nthview .nthview-callout{position:absolute;left:8px;right:8px;bottom:max(8px,env(safe-area-inset-bottom));max-height:30%;overflow-y:auto;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:10px 12px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:opacity .3s,transform .3s;pointer-events:auto}",
    ".nthview .nthview-callout.nthview-off{opacity:0;transform:translateY(8px);pointer-events:none;visibility:hidden}",
    ".nthview .nthview-ckick{font-family:var(--display);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);font-weight:700}",
    ".nthview .nthview-ctext{font-size:.93rem;line-height:1.35;margin-top:2px}",
    ".nthview .nthview-cbig{font-family:var(--display);font-weight:700;font-size:1.08rem;line-height:1.25;margin-top:6px;text-align:center}",
    ".nthview .nthview-cbig:empty{display:none}",
    ".nthview .nthview-clegend{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}",
    ".nthview .nthview-clegend:empty{display:none}",
    ".nthview .nthview-cfb{margin-top:6px;font-size:.88rem;line-height:1.35}",
    ".nthview .nthview-cfb:empty{display:none}",
    ".nthview .nthview-cfb.nthview-ok{color:#8ff0b4}",
    ".nthview .nthview-cfb.nthview-no{color:#ffb4a8}",
    ".nthview .nthview-cact{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}",
    ".nthview .nthview-cact:empty{display:none}",
    ".nthview .nthview-callout :focus-visible{outline:3px solid #fff;outline-offset:2px}",
    /* labels over things in the room */
    ".nthview .nthview-toast{position:absolute;left:50%;top:100px;transform:translate(-50%,0) scale(.92);opacity:0;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:9px 16px;transition:opacity .25s,transform .25s;max-width:calc(100% - 40px);text-align:center;font-weight:700;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
    ".nthview .nthview-toast.nthview-show{opacity:1;transform:translate(-50%,0) scale(1)}",
    /* the alarm banner and the guard guide */
    /* one-time powers */
    "@media (max-width:680px){body:has(.nthview-lesson-bar) .nthview-game .nthview-panel{padding-bottom:calc(72px + env(safe-area-inset-bottom))}body:has(.nthview-lesson-bar) .nthview-game .nthview-overlay{padding-bottom:76px}body:has(.nthview-lesson-bar) .nthview-game .nthview-card .nthview-sticky{padding-right:76px}body:has(.nthview-lesson-bar) .nthview-game .nthview-callout{bottom:72px}}",
    /* gems fly from a takedown to the counter */
    ".nthview .nthview-vignette{position:absolute;inset:0;pointer-events:none;z-index:4;opacity:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(220,30,20,.75) 100%)}",
    ".nthview .nthview-vignette.nthview-hit{animation:nthview-hit .8s ease-out}",
    "@keyframes nthview-hit{0%{opacity:0}15%{opacity:1}100%{opacity:0}}",
    ".nthview .nthview-fade{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .35s;z-index:30}",
    ".nthview .nthview-fade.nthview-white{background:#fdfaf0}",
    ".nthview .nthview-fade.nthview-on{opacity:1}",
    /* bottom sheet */
    ".nthview .nthview-panel{position:absolute;left:0;right:0;bottom:0;max-height:64%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;background:var(--panel);color:var(--ink);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:22px 22px 0 0;border-top:3px solid var(--accent);padding:16px 18px calc(22px + env(safe-area-inset-bottom));box-shadow:0 -12px 40px rgba(0,0,0,.35);transform:translateY(calc(100% + 64px));visibility:hidden;transition:transform .38s cubic-bezier(.2,.8,.2,1),visibility 0s linear .38s;pointer-events:auto;user-select:text}",
    ".nthview .nthview-panel.nthview-open{transform:none;visibility:visible;transition:transform .38s cubic-bezier(.2,.8,.2,1),visibility 0s}",
    ".nthview .nthview-panel:focus{outline:none}",
    ".nthview .nthview-panel.nthview-compact{max-height:52%}",
    "@media (max-height:560px){.nthview .nthview-panel{max-height:84%}.nthview .nthview-panel.nthview-compact{max-height:70%}}",
    "@media (min-width:700px) and (min-height:700px){.nthview .nthview-panel{bottom:16px;border-radius:22px;border:1px solid var(--line);border-top:3px solid var(--accent)}}",
    ".nthview .nthview-kicker{color:var(--muted);margin:0;font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}",
    ".nthview .nthview-panel h2,.nthview .nthview-card h2{font-family:var(--display);font-weight:700;font-size:1.65rem;line-height:1.1;margin:4px 0 10px;overflow-wrap:anywhere}",
    ".nthview .nthview-panel p,.nthview .nthview-card p{line-height:1.55;overflow-wrap:anywhere}",
    ".nthview .nthview-lead{font-size:1.06rem}",
    ".nthview .nthview-box{background:var(--chip);border:1px solid var(--line);border-radius:16px;padding:12px 14px;margin:14px 0}",
    ".nthview .nthview-box.nthview-task{border:2px solid var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--panel-solid))}",
    ".nthview .nthview-box-title{font-family:var(--display);font-weight:700;font-size:1.02rem;margin:0 0 8px}",
    ".nthview .nthview-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
    ".nthview .nthview-cap{font-size:.84rem;color:var(--muted);margin:10px 0 0}",
    ".nthview .nthview-readout{font-weight:700;font-size:1.04rem;margin-top:12px}",
    ".nthview .nthview-btn{background:var(--panel-solid);border:2px solid var(--accent);border-radius:14px;padding:11px 18px;font-weight:700;line-height:1.2;min-height:46px}",
    ".nthview .nthview-btn.nthview-primary{background:var(--accent);color:var(--on-accent);border-color:transparent}",
    ".nthview .nthview-btn:disabled{opacity:.45}",
    ".nthview .nthview-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;align-items:center}",
    ".nthview .nthview-keyhint{font-size:.8rem;color:var(--muted)}",
    ".nthview .nthview-q{font-weight:700;font-size:1.06rem;margin:6px 0 10px}",
    ".nthview .nthview-opts{display:grid;gap:9px}",
    ".nthview .nthview-opts.nthview-two{grid-template-columns:1fr 1fr}",
    ".nthview .nthview-opt{text-align:left;background:var(--panel-solid);border:2px solid var(--line);border-radius:14px;padding:13px 15px;line-height:1.35;min-height:52px;box-shadow:0 3px 0 var(--line);transition:transform .08s,box-shadow .08s,border-color .15s;display:flex;align-items:center;gap:10px}",
    ".nthview .nthview-opt:hover:not(:disabled){border-color:var(--accent)}",
    ".nthview .nthview-opt:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 var(--line)}",
    ".nthview .nthview-opt[aria-pressed=true],.nthview .nthview-opt.nthview-sel{border-color:var(--accent);box-shadow:0 3px 0 var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--panel-solid))}",
    ".nthview .nthview-opt.nthview-right{border-color:var(--ok);box-shadow:0 3px 0 var(--ok);background:color-mix(in srgb,var(--ok) 15%,var(--panel-solid))}",
    ".nthview .nthview-opt.nthview-wrong{border-color:var(--no);box-shadow:0 3px 0 var(--no);background:color-mix(in srgb,var(--no) 10%,var(--panel-solid))}",
    ".nthview .nthview-opt:disabled.nthview-wrong{opacity:.65;text-decoration:line-through}",
    ".nthview .nthview-opt.nthview-center{justify-content:center;text-align:center;font-family:var(--display);font-weight:700;font-size:1.15rem;min-height:72px}",
    ".nthview .nthview-tick{width:24px;height:24px;border-radius:7px;border:2px solid var(--line);flex:none;display:grid;place-items:center;font-weight:900;font-size:.9rem}",
    ".nthview .nthview-opt[aria-pressed=true] .nthview-tick{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}",
    ".nthview .nthview-fb{margin-top:12px;line-height:1.5}",
    ".nthview .nthview-fb.nthview-ok{color:var(--ok);font-weight:700}",
    ".nthview .nthview-fb.nthview-no{color:var(--no)}",
    ".nthview .nthview-fb .nthview-reveal{display:block;margin-top:6px;color:var(--ink);font-weight:700}",
    ".nthview .nthview-remember{border:2px solid var(--accent);border-radius:16px;padding:12px 14px;margin-top:14px}",
    ".nthview .nthview-stars{font-size:1.5rem;color:var(--star);letter-spacing:2px;margin:0 0 4px}",
    ".nthview .nthview-num{width:28px;height:28px;border-radius:50%;background:var(--chip);border:1.5px solid var(--line);display:grid;place-items:center;font-weight:800;flex:none;font-size:.9rem}",
    ".nthview .nthview-opt[aria-pressed=true] .nthview-num{background:var(--accent);color:var(--on-accent);border-color:transparent}",
    ".nthview .nthview-note{display:block;font-size:.84rem;color:var(--muted)}",
    ".nthview .nthview-txt{flex:1;min-width:0;overflow-wrap:anywhere}",
    ".nthview .nthview-seq{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px;min-height:34px}",
    ".nthview .nthview-slot{border:2px dashed var(--line);border-radius:10px;padding:5px 10px;font-size:.88rem;min-width:44px;text-align:center}",
    ".nthview .nthview-slot.nthview-filled{border-style:solid;border-color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--panel-solid));font-weight:700}",
    ".nthview .nthview-chips{display:flex;flex-wrap:wrap;gap:6px}",
    ".nthview .nthview-chip{border:2px solid var(--line);background:var(--panel-solid);border-radius:999px;padding:7px 13px;font-weight:700;font-size:.9rem;min-height:38px}",
    ".nthview .nthview-chip[aria-pressed=true]{background:var(--accent);border-color:transparent;color:var(--on-accent)}",
    ".nthview .nthview-chip.nthview-right{border-color:var(--ok)}",
    ".nthview .nthview-chip.nthview-wrong{border-color:var(--no)}",
    ".nthview .nthview-cols{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".nthview .nthview-badge{display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:50%;background:var(--accent);color:var(--on-accent);font-weight:800;font-size:.8rem;flex:none}",
    ".nthview .nthview-bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-top:10px}",
    ".nthview .nthview-bin{border:2px dashed var(--line);border-radius:14px;padding:10px;min-height:76px;text-align:center;background:var(--panel-solid);display:flex;flex-direction:column;gap:4px;align-items:center}",
    ".nthview .nthview-bin b{font-family:var(--display)}",
    ".nthview .nthview-bin.nthview-target{border-style:solid;border-color:var(--accent)}",
    ".nthview .nthview-stamp{display:inline-block;background:var(--chip);border-radius:8px;padding:2px 8px;font-size:.82rem}",
    ".nthview .nthview-stamp.nthview-right{outline:2px solid var(--ok)}",
    ".nthview .nthview-stamp.nthview-wrong{outline:2px solid var(--no)}",
    ".nthview .nthview-cloze{line-height:2.1;font-size:1.05rem;margin:4px 0}",
    ".nthview .nthview-gap{display:inline-block;min-width:4.5em;border-bottom:3px solid var(--accent);padding:0 6px;text-align:center;font-weight:700;border-radius:4px 4px 0 0;background:color-mix(in srgb,var(--accent) 10%,transparent)}",
    ".nthview .nthview-gap.nthview-active{background:color-mix(in srgb,var(--accent) 30%,transparent)}",
    ".nthview .nthview-gap.nthview-right{border-color:var(--ok)}",
    ".nthview .nthview-gap.nthview-wrong{border-color:var(--no)}",
    ".nthview .nthview-gaprow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0}",
    ".nthview .nthview-gaprow>span{font-size:.82rem;color:var(--muted);min-width:3.6em}",
    ".nthview .nthview-range{width:100%;accent-color:var(--accent);height:34px}",
    ".nthview .nthview-bignum{font-family:var(--display);font-weight:700;font-size:2.2rem;text-align:center;line-height:1.1}",
    ".nthview .nthview-input{font:inherit;font-size:1.1rem;width:100%;border:2px solid var(--line);border-radius:12px;padding:11px 13px;background:var(--panel-solid);color:inherit}",
    ".nthview .nthview-input:focus{border-color:var(--accent);outline:none}",
    ".nthview .nthview-input.nthview-wrong{border-color:var(--no)}",
    ".nthview .nthview-input.nthview-right{border-color:var(--ok)}",
    ".nthview .nthview-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}",
    ".nthview .nthview-keys button{border:2px solid var(--line);background:var(--panel-solid);border-radius:12px;min-height:46px;font-weight:700;font-size:1.1rem}",
    ".nthview .nthview-frow{margin:10px 0}",
    ".nthview .nthview-flabel{font-size:.93rem;margin-bottom:4px}",
    ".nthview .nthview-fline{display:flex;align-items:center;gap:10px}",
    ".nthview .nthview-track{flex:1;height:14px;border-radius:7px;background:color-mix(in srgb,var(--ink) 10%,transparent);position:relative}",
    ".nthview .nthview-track .nthview-bar{height:100%;border-radius:7px;background:var(--accent);transition:width 1.2s ease-out;width:0}",
    ".nthview .nthview-bar.nthview-grey{background:#a29a8c}",
    ".nthview .nthview-bar.nthview-dashed{background:repeating-linear-gradient(90deg,var(--accent) 0 9px,transparent 9px 15px)}",
    ".nthview .nthview-track .nthview-mark{position:absolute;top:-5px;height:24px;width:4px;border-radius:2px;background:var(--ok);transform:translateX(-50%);box-shadow:0 0 0 2px var(--panel-solid)}",
    ".nthview .nthview-fline b{min-width:5.4ch;text-align:right}",
    ".nthview .nthview-stepper{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0}",
    ".nthview .nthview-stepper .nthview-ctl{display:flex;align-items:center;gap:10px}",
    ".nthview .nthview-stepper button{width:44px;height:44px;border-radius:12px;border:2px solid var(--line);background:var(--panel-solid);font-size:1.3rem;font-weight:700}",
    ".nthview .nthview-stepper b{min-width:2ch;text-align:center;font-size:1.35rem}",
    ".nthview .nthview-pile{font-size:1.2rem;letter-spacing:2px;line-height:1.4;min-height:1.4em;margin-top:6px;word-break:break-all}",
    ".nthview .nthview-gridvis{display:grid;gap:4px;margin-top:8px;justify-content:start}",
    ".nthview .nthview-gridvis i{width:16px;height:16px;border-radius:4px;background:var(--accent);display:block}",
    ".nthview .nthview-story{display:grid;gap:8px;margin-top:10px}",
    ".nthview .nthview-story p{margin:0;padding:10px 12px;border-radius:12px;background:var(--panel-solid);border:1px solid var(--line);animation:nthview-in .35s ease-out}",
    "@keyframes nthview-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".nthview .nthview-sw{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)}",
    ".nthview .nthview-toggle{width:56px;height:32px;border-radius:16px;border:0;background:#a29a8c;position:relative;flex:none;padding:0}",
    ".nthview .nthview-toggle::after{content:\"\";position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}",
    ".nthview .nthview-toggle[aria-checked=true]{background:var(--accent)}",
    ".nthview .nthview-toggle[aria-checked=true]::after{transform:translateX(24px)}",
    ".nthview .nthview-lamp{display:inline-block;width:12px;height:12px;border-radius:50%;background:#a29a8c;margin-right:8px;vertical-align:middle}",
    ".nthview .nthview-lamp.nthview-ok{background:var(--ok);box-shadow:0 0 8px var(--ok)}",
    ".nthview .nthview-lamp.nthview-no{background:var(--no);box-shadow:0 0 8px var(--no)}",
    ".nthview .nthview-lamp.nthview-note{background:var(--gold);box-shadow:0 0 8px var(--gold)}",
    ".nthview .nthview-seg{display:inline-flex;flex-wrap:wrap;gap:5px}",
    ".nthview .nthview-seg button{border:2px solid var(--line);background:var(--panel-solid);border-radius:10px;padding:7px 12px;font-size:.88rem;font-weight:700;min-height:38px}",
    ".nthview .nthview-seg button[aria-pressed=true]{background:var(--accent);border-color:transparent;color:var(--on-accent)}",
    ".nthview .nthview-card3{perspective:900px;margin-top:10px}",
    ".nthview .nthview-flip{position:relative;min-height:150px;transition:transform .5s;transform-style:preserve-3d}",
    ".nthview .nthview-flip.nthview-flipped{transform:rotateY(180deg)}",
    ".nthview .nthview-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:grid;place-items:center;text-align:center;padding:16px;border-radius:16px;background:var(--panel-solid);border:2px solid var(--accent);font-family:var(--display);font-weight:700;font-size:1.2rem;overflow:auto}",
    ".nthview .nthview-face.nthview-back{transform:rotateY(180deg);font-family:var(--body);font-weight:400;font-size:1rem}",
    ".nthview .nthview-padsgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px}",
    ".nthview .nthview-padcard{flex-direction:column;justify-content:flex-end;text-align:center;min-height:150px;padding:10px}",
    ".nthview .nthview-padvis{display:flex;align-items:flex-end;justify-content:center;gap:6px;height:84px;width:100%}",
    ".nthview .nthview-padvis i{display:block;width:18px;border-radius:4px 4px 0 0;background:var(--accent)}",
    ".nthview .nthview-padvis i.nthview-grey{background:#a29a8c}",
    ".nthview .nthview-padvis svg{display:block}",
    ".nthview .nthview-padname{font-family:var(--display);font-weight:700}",
    ".nthview .nthview-diagram{width:100%;height:auto;display:block;border-radius:14px;background:var(--panel-solid);border:1px solid var(--line);touch-action:manipulation}",
    ".nthview .nthview-diagram .nthview-part{cursor:pointer;transition:opacity .2s}",
    ".nthview .nthview-diagram .nthview-part:focus{outline:none}",
    ".nthview .nthview-diagram .nthview-part:focus-visible .nthview-shape,.nthview .nthview-diagram .nthview-part:hover .nthview-shape{stroke:var(--accent);stroke-width:1.2}",
    ".nthview .nthview-diagram .nthview-part.nthview-dim{opacity:.35}",
    ".nthview .nthview-diagram .nthview-part.nthview-right .nthview-shape{stroke:var(--ok);stroke-width:1.6}",
    ".nthview .nthview-diagram text{font:700 3.2px var(--body);pointer-events:none}",
    ".nthview .nthview-conf{margin-top:12px}",
    /* overlays */
    ".nthview .nthview-overlay{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;padding:16px 12px;background:rgba(8,6,4,.42);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);overflow-y:auto;pointer-events:auto}",
    ".nthview .nthview-card{background:var(--panel-solid);color:var(--ink);border-radius:22px;padding:22px 22px 24px;max-width:560px;width:100%;margin:auto 0;flex:none;box-shadow:0 20px 60px rgba(0,0,0,.4);border-top:4px solid var(--accent);user-select:text}",
    ".nthview .nthview-card h1{font-family:var(--display);font-weight:900;font-size:clamp(2rem,8.5vw,3.2rem);line-height:1;letter-spacing:.01em;margin:0 0 12px;overflow-wrap:anywhere}",
    ".nthview .nthview-big{font-size:1.06rem}",
    /* the intro is long on a phone: keep Start in reach while the story scrolls */
    ".nthview .nthview-card .nthview-sticky{position:sticky;bottom:0;z-index:1;background:var(--panel-solid);margin:16px -22px -24px;padding:12px 22px 16px;border-radius:0 0 22px 22px;box-shadow:0 -12px 14px -12px rgba(0,0,0,.3)}",
    ".nthview .nthview-card ol,.nthview .nthview-card ul,.nthview .nthview-panel ul{padding-left:1.3rem;line-height:1.5}",
    ".nthview .nthview-card li,.nthview .nthview-panel li{margin:6px 0}",
    ".nthview .nthview-small{font-size:.88rem;color:var(--muted)}",
    ".nthview .nthview-scorecard{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 6px}",
    ".nthview .nthview-scorecard div{flex:1;min-width:96px;background:var(--chip);border:1px solid var(--line);border-radius:14px;padding:10px 12px;font-size:.85rem}",
    ".nthview .nthview-scorecard b{display:block;font-family:var(--display);font-size:1.45rem;white-space:nowrap}",
    "@media (max-width:480px){.nthview .nthview-scorecard div{min-width:calc(50% - 5px)}}",
    ".nthview .nthview-results{list-style:none;padding:0!important;margin:8px 0}",
    ".nthview .nthview-results li{display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--line);margin:0!important}",
    ".nthview .nthview-results .nthview-rs{color:var(--star);white-space:nowrap;font-size:.95rem;min-width:3.4em}",
    ".nthview .nthview-results .nthview-rt{flex:1;min-width:0}",
    ".nthview-game details.nthview-more{margin:12px 0;border:1px solid var(--line);border-radius:14px;padding:8px 12px;background:var(--chip)}",
    ".nthview-game details.nthview-more summary{cursor:pointer;font-weight:700;padding:4px 0}",
    ".nthview-game table.nthview-t{border-collapse:collapse;width:100%;font-size:.93rem;margin-top:8px}",
    ".nthview-game table.nthview-t th,.nthview-game table.nthview-t td{padding:7px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}",
    ".nthview .nthview-menu{display:grid;gap:10px;margin-top:12px}",
    ".nthview .nthview-menu .nthview-btn{width:100%}",
    ".nthview-game a{color:var(--accent-ink)}",
    "@media (prefers-reduced-motion:reduce){.nthview .nthview-panel,.nthview .nthview-toast,.nthview .nthview-track .nthview-bar,.nthview .nthview-flip,.nthview .nthview-toggle::after,.nthview .nthview-callout{transition:none}.nthview .nthview-vignette.nthview-hit,.nthview .nthview-hstats span.nthview-bump{animation-duration:.01s}}"
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

  function hasWebGL() {
    try {
      var c = root.document.createElement("canvas");
      var gl = c.getContext("webgl2") || c.getContext("webgl") || c.getContext("experimental-webgl");
      var lose = gl && gl.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext(); /* release the probe context right away */
      return !!gl;
    } catch (e) { return false; }
  }
  function renderNoWebGL(container) {
    container.appendChild(el("div", { class: "nthview-error-panel", role: "alert" }, [
      el("h2", { text: "This view needs 3D graphics" }),
      el("p", { text: "The game is drawn with WebGL, which this browser has turned off or does not support." }),
      el("p", { text: "Turn on hardware acceleration in the browser settings, or open this file in another browser, then reload." })
    ]));
  }

  // ---- progress storage (identical in every view, §5.5) ------------------
  var STORE_VERSION = 1;
  function storageKey(data) {
    var s = JSON.stringify(data), h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return "nthview:game:" + (h >>> 0).toString(36);
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
  /* Core and engines (AGENTS.md §5.6). assets/engine-<game>.js registers
     NthView.engines.<game> = function (core) { ...; return E; }. `core` (built
     in render) carries the data, the shared state S, the DOM, the card helpers
     and the flow calls reached(k, notes), mistake(k, cost, note), showSolved(k).
     E gives words, taskHelp, worldTypes and the hooks start, enter, play, solved,
     finaleStart, finaleStep, finaleEnd; every other hook is optional (see the
     calls to E.* below). An in-world type an engine does not list in worldTypes
     is asked as a card: E.asCard(activity) turns it into card activities. */
  var PANEL_EXPLORE = ["compare", "bars", "switches", "flashcards", "story", "tune", "race"];

  function rich(text) {
    var frag = root.document.createDocumentFragment();
    String(text).split(/(\*\*[^*]+\*\*)/).forEach(function (part) {
      if (!part) return;
      if (/^\*\*[^*]+\*\*$/.test(part)) frag.appendChild(el("b", { text: part.slice(2, -2) }));
      else frag.appendChild(root.document.createTextNode(part));
    });
    return frag;
  }
  function plain(text) { return String(text).replace(/\*\*([^*]+)\*\*/g, "$1"); }
  function p(cls, text) { var n = el("p", cls ? { class: cls } : {}); n.appendChild(rich(text)); return n; }
  function btn(label, cls, onClick) {
    var b = el("button", { type: "button", class: "nthview-btn" + (cls ? " " + cls : ""), text: label });
    b.addEventListener("click", onClick); return b;
  }
  function starsText(st) { return "★".repeat(st) + "☆".repeat(Math.max(0, 3 - st)); }
  function fillTemplate(text, env, exprs) {
    return String(text).replace(/\{([^}]*)\}/g, function (m, inner) {
      if (env && Object.prototype.hasOwnProperty.call(env, inner)) return String(env[inner]);
      if (exprs) { var c = exprs(inner); if (c) return String(c); }
      return m;
    });
  }
  /* deterministic random numbers seeded by a string */
  function seeded(str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return function () { h += 0x6D2B79F5; var t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  /* deterministic shuffle that never returns the original order */
  function shuffledIdx(n, seed) {
    var idx = [], i; for (i = 0; i < n; i++) idx.push(i);
    var rnd = seeded(seed);
    for (i = n - 1; i > 0; i--) { var j = Math.floor(rnd() * (i + 1)); var t = idx[i]; idx[i] = idx[j]; idx[j] = t; }
    var same = idx.every(function (v, k) { return v === k; });
    if (same && n > 1) idx.push(idx.shift());
    return idx;
  }
  /* the answer normaliser and the expression parser live in scripts/validate.js and are shared (AGENTS.md §5.2) */
  function normText(s) { return NthView.validate.normText(s); }
  function compileExpr(src) { return NthView.validate.compileExpr(src); }
  function evalExpr(src, env) { var c = compileExpr(src); return c.fn ? c.fn(env) : 0; }
  function render(container, data) {
    var THREE = root.THREE, doc = root.document;
    var GAME = data.game, N = data.levels.length, STRICT = data.strictMode === true;
    var START_LIVES = data.lives || 3, hero = data.hero.name;
    var WD = (data.world && data.world[GAME]) || {};
    var mqReduce = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)");
    var settings = { reduced: !!(mqReduce && mqReduce.matches), sound: true };
    var LV = data.levels.map(function (s, i) {
      var type = s.activity ? s.activity.type : null;
      return { idx: i, data: s, id: s.id, name: s.name, type: type, world: (WD.levels && WD.levels[s.id]) || {}, color: s.color || null };
    });

    /* ---------- DOM scaffold: the engine draws on the canvas and adds its own HUD pieces ---------- */
    var svgNS = "http://www.w3.org/2000/svg";
    function icon(d, size) {
      var s = doc.createElementNS(svgNS, "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("width", String(size || 22)); s.setAttribute("height", String(size || 22)); s.setAttribute("aria-hidden", "true");
      var pth = doc.createElementNS(svgNS, "path"); pth.setAttribute("d", d); pth.setAttribute("fill", "currentColor"); s.appendChild(pth); return s;
    }
    var canvas = el("canvas", { class: "nthview-canvas", tabindex: "0" });
    var col = el("div", { class: "nthview-col" });
    var pauseBtn = el("button", { type: "button", class: "nthview-hchip nthview-pausebtn", "aria-label": "Pause" }, [icon("M6 4h4v16H6zM14 4h4v16h-4z", 20)]);
    var hKick = el("div", { class: "nthview-hkick" }), hName = el("div", { class: "nthview-hname", text: data.title }), hFill = el("i");
    var hMid = el("div", { class: "nthview-hchip nthview-hmid" }, [hKick, hName, el("div", { class: "nthview-hbar", "aria-hidden": "true" }, [hFill])]);
    var starOut = el("b", { text: "0" }), lifeOut = el("b", { text: "0" });
    var hStats = el("div", { class: "nthview-hstats" }, [el("span", { title: "Stars" }, [doc.createTextNode("★ "), starOut])]);
    var hRight = el("div", { class: "nthview-hchip nthview-hright" }, [hStats]);
    var KEY = storageKey(data), SAVED = loadState(KEY);
    var hud = el("div", { class: "nthview-hud" }, [el("div", { class: "nthview-hleft" }, [pauseBtn, restartButton(container, data, KEY)]), hMid, hRight]);
    var cKick = el("div", { class: "nthview-ckick" }), cText = el("div", { class: "nthview-ctext" }), cBig = el("div", { class: "nthview-cbig", "aria-live": "polite" }), cLegend = el("div", { class: "nthview-clegend" }), cFb = el("div", { class: "nthview-cfb", "aria-live": "polite" }), cAct = el("div", { class: "nthview-cact" });
    var callout = el("div", { class: "nthview-callout nthview-off" }, [cKick, cText, cBig, cLegend, cFb, cAct]);
    var toastEl = el("div", { class: "nthview-toast", role: "status", "aria-live": "polite" });
    var srLive = el("div", { class: "nthview-sr", "aria-live": "assertive" });
    var pbody = el("div");
    var panel = el("section", { class: "nthview-panel", "aria-label": "Lesson", tabindex: "-1" }, [pbody]);
    [hud, toastEl, callout, panel, srLive].forEach(function (n) { col.appendChild(n); });
    var vignette = el("div", { class: "nthview-vignette", "aria-hidden": "true" });
    var fadeEl = el("div", { class: "nthview-fade", "aria-hidden": "true" });
    var overlay = el("div", { class: "nthview-overlay nthview-hidden" });
    var ocard = el("div", { class: "nthview-card", role: "dialog", "aria-modal": "true" });
    overlay.appendChild(ocard);
    [canvas, vignette, col, overlay, fadeEl].forEach(function (n) { container.appendChild(n); });

    /* ---------- state & score ---------- */
    function freshResults() { return LV.map(function () { return { mistakes: 0, done: false, stars: 0, notes: [] }; }); }
    var S = { mode: "intro", k: 0, lives: START_LIVES, outs: 0, paused: false, runSeed: 0, results: freshResults(), finale: { list: [], i: 0, mistakes: 0, done: false }, steps: [], stepI: 0, trialNotes: [], done: false };
    var saveTimer = 0, E = null;
    function snapshot() {
      return { phase: S.mode === "report" ? "report" : S.k >= N ? "finale" : "level", k: Math.min(S.k, N), lives: S.lives, outs: S.outs, runSeed: S.runSeed,
        results: S.results.map(function (r) { return { m: r.mistakes, d: r.done ? 1 : 0, s: r.stars }; }),
        finale: { m: S.finale.mistakes, done: S.finale.done ? 1 : 0, i: S.finale.i },
        settings: { reduced: settings.reduced, sound: settings.sound }, w: E && E.save ? E.save() : null, done: S.done };
    }
    function saveNow() { clearTimeout(saveTimer); saveTimer = 0; if (S.mode !== "intro" && canvas.isConnected) saveState(KEY, snapshot()); }
    function persist() { if (!saveTimer) saveTimer = setTimeout(saveNow, 250); }
    function intIn(v, lo, hi) { return typeof v === "number" && v % 1 === 0 && v >= lo && v <= hi; }
    /* apply a saved record field by field; anything that no longer fits the data is ignored */
    function restoreState(sv) {
      if (sv.settings && typeof sv.settings === "object") ["reduced", "sound"].forEach(function (k2) { if (typeof sv.settings[k2] === "boolean") settings[k2] = sv.settings[k2]; });
      if (Array.isArray(sv.results)) sv.results.forEach(function (r, i) {
        if (i >= N || !r || typeof r !== "object") return; var o = S.results[i];
        if (intIn(r.m, 0, 999)) o.mistakes = r.m; if (r.d === 1 || r.d === 0) o.done = !!r.d; if (intIn(r.s, 0, 3)) o.stars = r.s;
      });
      if (intIn(sv.lives, 0, 9)) S.lives = sv.lives;
      if (STRICT && S.lives <= 0) S.lives = START_LIVES;
      if (intIn(sv.outs, 0, 1e5)) S.outs = sv.outs;
      if (intIn(sv.runSeed, 0, 1e6)) S.runSeed = sv.runSeed;
      if (sv.done === true) S.done = true;   /* a finished game stays finished until Restart or play again (§5.5 rule 8) */
      if (sv.finale && typeof sv.finale === "object") { if (intIn(sv.finale.m, 0, 999)) S.finale.mistakes = sv.finale.m; if (intIn(sv.finale.i, 0, 50)) S.finale.i = sv.finale.i; }
      var k = intIn(sv.k, 0, N) ? sv.k : 0, phase = ["level", "finale", "report"].indexOf(sv.phase) !== -1 ? sv.phase : "level";
      while (phase === "level" && k < N && S.results[k].done) k++;
      if (phase === "level" && k >= N) phase = "finale";
      if (phase !== "level" && !S.results.every(function (r) { return r.done; })) { phase = "level"; k = 0; while (k < N && S.results[k].done) k++; if (k >= N) phase = "finale"; }
      return { k: Math.min(k, N - 1), phase: phase };
    }
    function totalStars() { var t = 0; for (var i = 0; i < S.results.length; i++) t += S.results[i].stars; return t; }
    function starsFor(m) { return m <= 0 ? 3 : m === 1 ? 2 : 1; }
    function bump(node) { node.classList.remove("nthview-bump"); void node.offsetWidth; node.classList.add("nthview-bump"); }
    function renderScore() { starOut.textContent = String(totalStars()); lifeOut.textContent = String(S.lives); if (E && E.score) E.score(); }
    function renderHud() {
      var k = Math.min(S.k, N - 1), fin = S.k >= N;
      hKick.textContent = fin ? E.words.finale : E.words.Level + " " + (k + 1) + " / " + N;
      hName.textContent = fin ? data.finale.name : LV[k].name;
      hFill.style.width = (100 * (fin ? 1 : k / N)) + "%";
    }
    function hudProgress(text, frac) { hName.textContent = text; hFill.style.width = (100 * frac) + "%"; }
    var toastTimer = 0;
    function toast(msg, ms) { toastEl.textContent = msg; toastEl.classList.add("nthview-show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("nthview-show"); }, ms || 2000); }
    function say(msg) { srLive.textContent = ""; setTimeout(function () { srLive.textContent = msg; }, 30); }
    function hitFlash() { vignette.classList.remove("nthview-hit"); void vignette.offsetWidth; vignette.classList.add("nthview-hit"); }

    /* ---------- sound (synthesised, no files); an engine adds its own kinds ---------- */
    var actx = null;
    function sfx(kind) {
      if (!settings.sound) return;
      try {
        var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return;
        if (!actx) { var ua = root.navigator && root.navigator.userActivation; if (ua && !ua.hasBeenActive) return; actx = new AC(); }
        if (actx.state === "suspended") actx.resume();
        var t0 = actx.currentTime;
        var tone = function (f, st, dur, type, vol, f2) {
          var o = actx.createOscillator(), g = actx.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t0 + st);
          if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + st + dur);
          g.gain.setValueAtTime(0, t0 + st); g.gain.linearRampToValueAtTime(vol || .06, t0 + st + .012); g.gain.exponentialRampToValueAtTime(.0001, t0 + st + dur);
          o.connect(g); g.connect(actx.destination); o.start(t0 + st); o.stop(t0 + st + dur + .03);
        };
        if (E && E.sounds && E.sounds[kind]) { E.sounds[kind](tone); return; }
        switch (kind) {
          case "ok": [523, 659, 784].forEach(function (f, i) { tone(f, i * .08, .28); }); break;
          case "no": tone(180, 0, .3, "sawtooth", .04, 120); tone(140, .12, .32, "sawtooth", .03); break;
          case "win": [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * .1, .45); }); break;
          case "open": tone(440, 0, .07, "triangle", .03); break;
          case "pick": tone(660, 0, .08, "triangle", .04); tone(990, .05, .1, "triangle", .03); break;
          case "key": [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, i * .07, .22, "triangle", .04); }); break;
        }
      } catch (e) { /* audio is optional */ }
    }

    function box(title, cls) { var d = el("div", { class: "nthview-box" + (cls ? " " + cls : "") }); if (title) d.appendChild(el("p", { class: "nthview-box-title", text: title })); return d; }
    function barRow(label, value, show, style) {
      var bar = el("div", { class: "nthview-bar" + (style === "grey" ? " nthview-grey" : style === "dashed" ? " nthview-dashed" : "") }); bar.style.width = value + "%";
      return el("div", { class: "nthview-frow" }, [el("div", { class: "nthview-flabel", text: label }), el("div", { class: "nthview-fline" }, [el("div", { class: "nthview-track" }, [bar]), el("b", { text: show })])]);
    }
    function findingsBox(f) {
      var d = box("What the numbers say"); var cap = el("p", { class: "nthview-cap", text: f.caption || "Out of 100" }); cap.style.marginTop = "0"; d.appendChild(cap);
      f.rows.forEach(function (r) { d.appendChild(barRow(r.label, r.value, r.show, r.style)); });
      if (f.text) { var t = p("", f.text); t.style.margin = "10px 0 0"; d.appendChild(t); }
      return d;
    }
    function optBtn(text, cls) { var b = el("button", { type: "button", class: "nthview-opt" + (cls ? " " + cls : "") }); b.appendChild(rich(text)); return b; }
    function primaryBtn(label, fn) { var b = btn(label, "nthview-primary", fn); b.setAttribute("data-primary", "true"); return b; }
    function checkRow(label, fn) { var row = el("div", { class: "nthview-actions" }); var b = primaryBtn(label || "Check", fn); row.appendChild(b); row.button = b; return row; }
    function stepper(host, label, min, max, val, onChange) {
      var out = el("b", { "aria-live": "polite", text: String(val) });
      var minus = el("button", { type: "button", "aria-label": "Less: " + label, text: "−" }), plus = el("button", { type: "button", "aria-label": "More: " + label, text: "+" });
      host.appendChild(el("div", { class: "nthview-stepper" }, [el("span", { text: label }), el("span", { class: "nthview-ctl" }, [minus, out, plus])]));
      var set = function (v) { val = Math.max(min, Math.min(max, v)); out.textContent = String(val); minus.disabled = val <= min; plus.disabled = val >= max; onChange(val); };
      minus.addEventListener("click", function () { set(val - 1); }); plus.addEventListener("click", function () { set(val + 1); }); set(val);
    }
    function segControl(labels, current, onPick, ariaLabel) {
      var seg = el("div", { class: "nthview-seg", role: "group", "aria-label": ariaLabel || "" }), btns = [];
      labels.forEach(function (l, i) { var b = el("button", { type: "button", "aria-pressed": String(current === i), text: l }); b.addEventListener("click", function () { btns.forEach(function (x, k) { x.setAttribute("aria-pressed", String(k === i)); }); onPick(i); }); btns.push(b); seg.appendChild(b); });
      seg.buttons = btns; return seg;
    }
    function disableAll(node) { Array.prototype.forEach.call(node.querySelectorAll("button,input"), function (x) { x.disabled = true; }); }

    /* a question context: scoring, feedback, reveal and the Continue button */
    function qctx(k, onDone) {
      var fb = el("div", { class: "nthview-fb", "aria-live": "polite" }), cont = el("div", { class: "nthview-actions nthview-hidden" });
      var ctx = { finished: false, wrongs: 0, fbWrap: el("div", {}, [fb, cont]) };
      var contBtn = primaryBtn("Continue", function () { ctx.finish(); }); cont.appendChild(contBtn);
      ctx.wrong = function (cost, msg, reveal, final) {
        if (ctx.finished) return;
        ctx.wrongs++;
        if (k >= 0) { S.results[k].mistakes += cost; S.results[k].notes.push(plain(msg)); loseLife(cost); } else S.finale.mistakes += cost;
        reactWrong(); sfx("no");
        fb.className = "nthview-fb nthview-no"; fb.textContent = ""; fb.appendChild(rich(msg));
        if (!STRICT || final) {
          var rv = reveal ? reveal() : null;
          if (rv && (!STRICT || final)) fb.appendChild(el("span", { class: "nthview-reveal", text: rv }));
          cont.classList.remove("nthview-hidden"); contBtn.textContent = !STRICT && !final ? "Continue (or pick again)" : "Continue";
        }
      };
      ctx.right = function (msg, extraMistakes) {
        if (ctx.finished) return; ctx.finished = true;
        if (extraMistakes && k >= 0) S.results[k].mistakes += extraMistakes;
        fb.className = "nthview-fb nthview-ok"; fb.textContent = ""; fb.appendChild(rich(msg || "Correct!"));
        reactRight(); ctx.rightDone = true; cont.classList.remove("nthview-hidden"); contBtn.textContent = "Continue";
        contBtn.disabled = false; setTimeout(function () { contBtn.disabled = false; if (contBtn.isConnected) contBtn.focus({ preventScroll: true }); }, 0);
      };
      var called = false;
      ctx.finish = function () { if (ctx.rightDone) { if (!called) { called = true; onDone(); } return; } if (ctx.finished) return; ctx.finished = true; called = true; onDone(); };
      ctx.note = function (msg, tone) { fb.className = "nthview-fb" + (tone ? " nthview-" + tone : ""); fb.textContent = msg; };
      return ctx;
    }

    function wChoice(host, q, ctx, title) {
      var w = box(title || null); w.appendChild(p("nthview-q", q.question));
      var list = el("div", { class: "nthview-opts" }), btns = [], ci = 0;
      q.options.forEach(function (o, i) {
        if (o.correct) ci = i;
        var b = optBtn(o.text); btns.push(b);
        b.addEventListener("click", function () {
          if (ctx.finished) return;
          btns.forEach(function (x) { x.classList.remove("nthview-sel"); });
          if (o.correct) { b.classList.add("nthview-right"); disableAll(list); ctx.right(q.okText || "Correct!"); }
          else { b.classList.add("nthview-wrong"); if (STRICT) b.disabled = true; ctx.wrong(1, o.why || "Not quite.", function () { btns[ci].classList.add("nthview-right"); return "The answer: " + plain(q.options[ci].text); }); }
        });
        list.appendChild(b);
      });
      w.appendChild(list); w.appendChild(ctx.fbWrap); host.appendChild(w);
    }
    var ACT = {
      choice: function (host, a, ctx) { wChoice(host, a, ctx, a.title); },
      truefalse: function (host, a, ctx) {
        var w = box(a.title || "True or false?"); w.appendChild(p("nthview-q", a.statement));
        var grid = el("div", { class: "nthview-opts nthview-two" }), btns = [];
        [true, false].forEach(function (v) {
          var b = optBtn(v ? (a.trueLabel || "True") : (a.falseLabel || "False"), "nthview-center"); btns.push(b);
          b.addEventListener("click", function () {
            if (ctx.finished) return;
            if (v === a.answer) { b.classList.add("nthview-right"); disableAll(grid); ctx.right(a.why ? "Right. " + a.why : "Right!"); }
            else { b.classList.add("nthview-wrong"); if (STRICT) b.disabled = true; ctx.wrong(1, STRICT ? "Not quite. Think about the lesson again." : "Not quite. " + (a.why || ""), function () { btns[a.answer ? 0 : 1].classList.add("nthview-right"); return "It is " + (a.answer ? (a.trueLabel || "true") : (a.falseLabel || "false")).toLowerCase() + "."; }); }
          });
          grid.appendChild(b);
        });
        w.appendChild(grid); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      multi: function (host, a, ctx) {
        var w = box(a.title || "Pick all that apply"); w.appendChild(p("nthview-q", a.question));
        var list = el("div", { class: "nthview-opts" }), on = a.options.map(function () { return false; }), btns = [];
        a.options.forEach(function (o, i) {
          var b = el("button", { type: "button", class: "nthview-opt", "aria-pressed": "false" }, [el("span", { class: "nthview-tick", "aria-hidden": "true", text: "" })]); b.appendChild(el("span", { class: "nthview-txt", text: plain(o.text) }));
          b.addEventListener("click", function () { if (ctx.finished) return; on[i] = !on[i]; b.setAttribute("aria-pressed", String(on[i])); b.firstChild.textContent = on[i] ? "✓" : ""; btns.forEach(function (x) { x.classList.remove("nthview-right", "nthview-wrong"); }); sfx("open"); });
          btns.push(b); list.appendChild(b);
        });
        w.appendChild(list);
        var row = checkRow("Check my picks", function () {
          if (ctx.finished) return;
          if (!on.some(Boolean)) { ctx.note("Pick at least one first.", "no"); return; }
          var wrong = []; a.options.forEach(function (o, i) { if (on[i] !== !!o.correct) wrong.push(i); });
          if (!wrong.length) { btns.forEach(function (b, i) { if (on[i]) b.classList.add("nthview-right"); }); disableAll(list); row.button.disabled = true; ctx.right("That's the full set!"); return; }
          var missed = wrong.filter(function (i) { return a.options[i].correct; }).length, extra = wrong.length - missed, why = wrong.map(function (i) { return !a.options[i].correct && a.options[i].why; }).filter(Boolean)[0];
          ctx.wrong(1, (wrong.length === 1 ? "One pick is off." : wrong.length + " picks are off.") + (missed ? " You missed " + missed + "." : "") + (extra ? " " + extra + " should not be picked." : "") + (why && !STRICT ? " " + why : ""), function () {
            btns.forEach(function (b, i) { b.classList.toggle("nthview-right", !!a.options[i].correct); b.classList.toggle("nthview-wrong", on[i] && !a.options[i].correct); });
            return "Green ones are the right set.";
          });
        });
        w.appendChild(row); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      order: function (host, a, ctx) { tapOrder(host, a, ctx, false); },
      rank: function (host, a, ctx) { tapOrder(host, a, ctx, true); },
      match: function (host, a, ctx) {
        var n = a.pairs.length, perm = shuffledIdx(n, "match" + a.prompt), pairOf = {}, selLeft = null;
        var w = box(a.title || "Match the pairs"); w.appendChild(p("nthview-q", a.prompt));
        var leftCol = el("div", { class: "nthview-opts", role: "group", "aria-label": "Left items" }), rightCol = el("div", { class: "nthview-opts", role: "group", "aria-label": "Right items" });
        var leftBtns = [], rightBtns = [], row;
        function leftFor(k2) { for (var i in pairOf) if (pairOf[i] === k2) return Number(i); return null; }
        function draw(marks) {
          leftBtns.forEach(function (b, i) { b.className = "nthview-opt" + (selLeft === i ? " nthview-sel" : "") + (marks ? (marks[i] ? " nthview-right" : " nthview-wrong") : ""); b.textContent = ""; b.appendChild(el("span", { class: "nthview-badge", text: String(i + 1) })); b.appendChild(el("span", { class: "nthview-txt", text: a.pairs[i].left })); b.setAttribute("aria-pressed", String(selLeft === i)); });
          rightBtns.forEach(function (b, k2) { var li = leftFor(k2); b.className = "nthview-opt" + (li !== null && marks ? (marks[li] ? " nthview-right" : " nthview-wrong") : ""); b.textContent = ""; if (li !== null) b.appendChild(el("span", { class: "nthview-badge", text: String(li + 1) })); b.appendChild(el("span", { class: "nthview-txt", text: a.pairs[perm[k2]].right })); b.setAttribute("aria-label", a.pairs[perm[k2]].right + (li !== null ? ", paired with " + (li + 1) : ", not paired")); });
          if (row) row.button.disabled = Object.keys(pairOf).length < n || ctx.finished;
        }
        a.pairs.forEach(function (pr, i) {
          var lb = el("button", { type: "button", class: "nthview-opt" }); lb.addEventListener("click", function () { if (ctx.finished) return; selLeft = selLeft === i ? null : i; sfx("open"); draw(); }); leftBtns.push(lb); leftCol.appendChild(lb);
          var rb = el("button", { type: "button", class: "nthview-opt" }); rb.addEventListener("click", function () { if (ctx.finished) return; var li = leftFor(i); if (selLeft !== null) { if (li !== null) delete pairOf[li]; pairOf[selLeft] = i; selLeft = null; sfx("pick"); } else if (li !== null) delete pairOf[li]; draw(); }); rightBtns.push(rb); rightCol.appendChild(rb);
        });
        w.appendChild(el("div", { class: "nthview-cols" }, [leftCol, rightCol]));
        w.appendChild(p("nthview-cap", "Tap an item on the left, then its partner on the right. Tap a paired item on the right to undo."));
        row = checkRow("Check the pairs", function () {
          var marks = a.pairs.map(function (_, i) { return pairOf[i] !== undefined && perm[pairOf[i]] === i; }), right = marks.filter(Boolean).length;
          if (right === n) { draw(marks); ctx.right("All " + n + " pairs matched!"); disableAll(w); return; }
          draw(marks);
          ctx.wrong(1, right + " of " + n + " pairs are right.", function () { pairOf = {}; a.pairs.forEach(function (_, i) { pairOf[i] = perm.indexOf(i); }); draw(a.pairs.map(function () { return true; })); return "These are the right pairs."; });
          if (STRICT) { a.pairs.forEach(function (_, i) { if (!marks[i]) delete pairOf[i]; }); setTimeout(function () { draw(); }, 900); }
        });
        w.appendChild(row); w.appendChild(ctx.fbWrap); draw(); host.appendChild(w);
      },
      sort: function (host, a, ctx) {
        var w = box(a.title || "Sort them"); w.appendChild(p("nthview-q", a.prompt));
        var choice = a.items.map(function () { return -1; }), rows = [];
        var bins = el("div", { class: "nthview-bins", "aria-hidden": "true" }), binEls = a.buckets.map(function () { var d = el("div", { class: "nthview-bin" }); bins.appendChild(d); return d; });
        function drawBins(marks) { binEls.forEach(function (d, k2) { d.textContent = ""; d.appendChild(el("b", { text: a.buckets[k2].label })); var any = false; a.items.forEach(function (it, i) { if (choice[i] === k2) { any = true; d.appendChild(el("span", { class: "nthview-stamp" + (marks ? (marks[i] ? " nthview-right" : " nthview-wrong") : ""), text: plain(it.text) })); } }); d.classList.toggle("nthview-target", any); }); }
        var list = el("div", { class: "nthview-opts" });
        a.items.forEach(function (it, i) {
          var r2 = el("div", { class: "nthview-box" }); r2.style.margin = "0"; r2.style.padding = "8px 10px"; r2.appendChild(p("", it.text)); r2.firstChild.style.margin = "0 0 6px";
          var seg = segControl(a.buckets.map(function (b) { return b.label; }), -1, function (k2) { if (ctx.finished) return; choice[i] = k2; sfx("open"); drawBins(); }, "Group for " + plain(it.text));
          r2.appendChild(seg); rows.push(r2); list.appendChild(r2);
        });
        w.appendChild(bins); w.appendChild(list); drawBins();
        var row = checkRow("Check the groups", function () {
          if (choice.indexOf(-1) !== -1) { ctx.note("Choose a group for every item first.", "no"); return; }
          var marks = a.items.map(function (it, i) { return a.buckets[choice[i]].id === it.bucket; }), right = marks.filter(Boolean).length;
          drawBins(marks);
          if (right === a.items.length) { disableAll(w); ctx.right("Every item is in the right group!"); return; }
          ctx.wrong(1, right + " of " + a.items.length + " are in the right group.", function () {
            a.items.forEach(function (it, i) { choice[i] = a.buckets.map(function (b) { return b.id; }).indexOf(it.bucket); }); drawBins(a.items.map(function () { return true; }));
            return "The groups now show the right answer.";
          });
        });
        w.appendChild(row); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      cloze: function (host, a, ctx) {
        var w = box(a.title || "Fill the gaps"), parts = a.text.split("___"), chosen = a.gaps.map(function () { return -1; }), gapEls = [], active = 0;
        var para = el("p", { class: "nthview-cloze" });
        parts.forEach(function (pt, i) { para.appendChild(rich(pt)); if (i < a.gaps.length) { var g = el("button", { type: "button", class: "nthview-gap", "aria-label": "Gap " + (i + 1) }); g.addEventListener("click", function () { active = i; draw(); }); gapEls.push(g); para.appendChild(g); } });
        w.appendChild(para);
        var chipsHost = el("div");
        function draw(marks) {
          gapEls.forEach(function (g, i) { g.textContent = chosen[i] >= 0 ? a.gaps[i].options[chosen[i]] : "  ?  "; g.className = "nthview-gap" + (i === active ? " nthview-active" : "") + (marks ? (marks[i] ? " nthview-right" : " nthview-wrong") : ""); });
          chipsHost.textContent = "";
          a.gaps.forEach(function (gp, i) {
            var r2 = el("div", { class: "nthview-gaprow" }, [el("span", { text: "Gap " + (i + 1) })]), chips = el("div", { class: "nthview-chips" });
            gp.options.forEach(function (o, k2) { var c = el("button", { type: "button", class: "nthview-chip", "aria-pressed": String(chosen[i] === k2), text: o }); c.addEventListener("click", function () { if (ctx.finished) return; chosen[i] = k2; active = Math.min(a.gaps.length - 1, i + 1); sfx("open"); draw(); }); chips.appendChild(c); });
            r2.appendChild(chips); chipsHost.appendChild(r2);
          });
        }
        w.appendChild(chipsHost); draw();
        var row = checkRow("Check the gaps", function () {
          if (chosen.indexOf(-1) !== -1) { ctx.note("Fill every gap first.", "no"); return; }
          var marks = a.gaps.map(function (g, i) { return chosen[i] === g.answer; }), right = marks.filter(Boolean).length;
          draw(marks);
          if (right === a.gaps.length) { disableAll(w); ctx.right("Every gap is right!"); return; }
          ctx.wrong(1, right + " of " + a.gaps.length + " gaps are right.", function () { a.gaps.forEach(function (g, i) { chosen[i] = g.answer; }); draw(a.gaps.map(function () { return true; })); return "The gaps now show the right words."; });
        });
        w.appendChild(row); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      estimate: function (host, a, ctx) {
        var w = box(a.title || "Make an estimate"); w.appendChild(p("nthview-q", a.question));
        var step = a.step || 1, unit = a.unit ? " " + a.unit : "", val = Math.round((a.min + a.max) / 2 / step) * step;
        var big = el("div", { class: "nthview-bignum", "aria-live": "polite" });
        var range = el("input", { type: "range", class: "nthview-range", min: String(a.min), max: String(a.max), step: String(step), value: String(val), "aria-label": "Your estimate" });
        var minus = el("button", { type: "button", class: "nthview-chip", "aria-label": "Lower", text: "−" }), plus = el("button", { type: "button", class: "nthview-chip", "aria-label": "Higher", text: "+" });
        var bar = el("div", { class: "nthview-bar" }), track = el("div", { class: "nthview-track" }, [bar]); bar.style.transition = "none";
        function frac(v) { return Math.max(0, Math.min(1, (v - a.min) / (a.max - a.min))); }
        function set(v) { val = Math.max(a.min, Math.min(a.max, Math.round(v / step) * step)); val = Math.round(val * 1e6) / 1e6; range.value = String(val); big.textContent = val + unit; bar.style.width = frac(val) * 100 + "%"; }
        range.addEventListener("input", function () { if (!ctx.finished) set(Number(range.value)); });
        minus.addEventListener("click", function () { if (!ctx.finished) set(val - step); }); plus.addEventListener("click", function () { if (!ctx.finished) set(val + step); });
        w.appendChild(big); w.appendChild(range); w.appendChild(el("div", { class: "nthview-row" }, [minus, plus, el("span", { class: "nthview-cap", text: "from " + a.min + " to " + a.max + unit })])); w.appendChild(el("div", { class: "nthview-fline" }, [track])); set(val);
        function mark() { var mk = el("span", { class: "nthview-mark" }); mk.style.left = frac(a.answer) * 100 + "%"; track.appendChild(mk); }
        var row = checkRow("Lock in my estimate", function () {
          var diff = val - a.answer;
          if (Math.abs(diff) <= a.tolerance) { mark(); disableAll(w); ctx.right("Close enough! The answer is " + a.answer + unit + "." + (a.reveal ? " " + a.reveal : "")); return; }
          ctx.wrong(1, diff > 0 ? "Too high." : "Too low.", function () { mark(); return "The answer is " + a.answer + unit + "." + (a.reveal ? " " + a.reveal : ""); });
        });
        w.appendChild(row); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      number: function (host, a, ctx) {
        var w = box(a.title || "Work it out"); w.appendChild(p("nthview-q", a.question));
        var input = el("input", { type: "text", inputmode: "decimal", class: "nthview-input", "aria-label": "Your answer" + (a.unit ? " in " + a.unit : ""), placeholder: a.unit ? "Number in " + a.unit : "Type a number", autocomplete: "off" });
        var keys = el("div", { class: "nthview-keys", role: "group", "aria-label": "Number keys" });
        ["7", "8", "9", "⌫", "4", "5", "6", "−", "1", "2", "3", ".", "0", "00", ",", "C"].forEach(function (kk) {
          if (kk === ",") { keys.appendChild(el("span")); return; }
          var b = el("button", { type: "button", text: kk, "aria-label": kk === "⌫" ? "Delete" : kk === "−" ? "Minus" : kk === "C" ? "Clear" : kk });
          b.addEventListener("click", function () { if (ctx.finished) return; var v = input.value; if (kk === "⌫") v = v.slice(0, -1); else if (kk === "C") v = ""; else if (kk === "−") v = v.charAt(0) === "-" ? v.slice(1) : "-" + v; else v += kk; input.value = v; input.classList.remove("nthview-wrong"); });
          keys.appendChild(b);
        });
        w.appendChild(input); w.appendChild(keys);
        var row = checkRow("Check my answer", function () {
          var v = parseFloat(String(input.value).replace(/\s/g, "").replace(",", "."));
          if (isNaN(v)) { ctx.note("Type a number first.", "no"); return; }
          if (Math.abs(v - a.answer) <= (a.tolerance || 0) + 1e-9) { input.classList.add("nthview-right"); disableAll(w); input.disabled = true; ctx.right("Right: " + a.answer + (a.unit ? " " + a.unit : "") + "." + (a.reveal ? " " + a.reveal : "")); return; }
          input.classList.add("nthview-wrong");
          ctx.wrong(1, "Not quite.", function () { return "The answer is " + a.answer + (a.unit ? " " + a.unit : "") + "." + (a.reveal ? " " + a.reveal : ""); });
        });
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); row.button.click(); } });
        w.appendChild(row); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      text: function (host, a, ctx) {
        var w = box(a.title || "Type the answer"); w.appendChild(p("nthview-q", a.question));
        var input = el("input", { type: "text", class: "nthview-input", "aria-label": "Your answer", placeholder: a.placeholder || "Type your answer", autocomplete: "off", autocapitalize: "off", spellcheck: "false" });
        var ok = [a.answer].concat(a.accept || []).map(normText);
        w.appendChild(input);
        var row = checkRow("Check my answer", function () {
          var v = normText(input.value);
          if (!v) { ctx.note("Type an answer first.", "no"); return; }
          if (ok.indexOf(v) !== -1) { input.classList.add("nthview-right"); input.disabled = true; disableAll(w); ctx.right("Right: " + a.answer + "." + (a.reveal ? " " + a.reveal : "")); return; }
          input.classList.add("nthview-wrong");
          ctx.wrong(1, "“" + input.value.trim() + "” is not it.", function () { return "The answer is " + a.answer + "." + (a.reveal ? " " + a.reveal : ""); });
        });
        input.addEventListener("input", function () { input.classList.remove("nthview-wrong"); });
        input.addEventListener("keydown", function (e) { if (e.key === "Enter") { e.preventDefault(); row.button.click(); } });
        w.appendChild(row); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      odd: function (host, a, ctx) {
        var w = box(a.title || "Spot the odd one out"); w.appendChild(p("nthview-q", a.prompt));
        var grid = el("div", { class: "nthview-opts nthview-two" }), btns = [];
        a.items.forEach(function (it, i) {
          var b = optBtn(it, "nthview-center"); btns.push(b);
          b.addEventListener("click", function () {
            if (ctx.finished) return;
            if (i === a.answer) { b.classList.add("nthview-right"); disableAll(grid); ctx.right(a.why || "That's the odd one!"); }
            else { b.classList.add("nthview-wrong"); if (STRICT) b.disabled = true; ctx.wrong(1, plain(it) + " belongs with the others.", function () { btns[a.answer].classList.add("nthview-right"); return "The odd one: " + plain(a.items[a.answer]) + "." + (a.why ? " " + a.why : ""); }); }
          });
          grid.appendChild(b);
        });
        w.appendChild(grid); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      hotspot: function (host, a, ctx) {
        var w = box(a.title || "Find it on the plan"); w.appendChild(p("nthview-q", a.prompt));
        var svg = doc.createElementNS(svgNS, "svg"); svg.setAttribute("viewBox", "0 0 100 60"); svg.setAttribute("class", "nthview-diagram"); svg.setAttribute("role", "group"); svg.setAttribute("aria-label", "Diagram with " + a.parts.length + " parts");
        function sv(tag, attrs) { var n = doc.createElementNS(svgNS, tag); Object.keys(attrs).forEach(function (k2) { n.setAttribute(k2, attrs[k2]); }); return n; }
        var byId = {}, ctr = {}, parts = a.parts[0].x !== undefined ? a.parts : a.parts.map(function (pt, i) { var ang = -Math.PI / 2 + 2 * Math.PI * i / a.parts.length; return Object.assign({}, pt, { shape: "circle", r: 8, x: 50 + 34 * Math.cos(ang), y: 30 + 20 * Math.sin(ang) }); });
        parts.forEach(function (pt) { ctr[pt.id] = pt.shape === "circle" ? [pt.x, pt.y] : [pt.x + pt.w / 2, pt.y + pt.h / 2]; });
        (a.links || []).forEach(function (l) { svg.appendChild(sv("line", { x1: ctr[l.from][0], y1: ctr[l.from][1], x2: ctr[l.to][0], y2: ctr[l.to][1], stroke: "currentColor", "stroke-width": ".5", "stroke-dasharray": "1.5 1", opacity: ".6" })); });
        var accent = getComputedStyle(container).getPropertyValue("--accent").trim() || "#c9831f";
        parts.forEach(function (pt, i) {
          var gEl = sv("g", { class: "nthview-part", tabindex: "0", role: "button", "aria-label": a.hideLabels ? "Part " + (i + 1) : pt.label });
          var fill = pt.color || accent, shape = pt.shape === "circle" ? sv("circle", { cx: pt.x, cy: pt.y, r: pt.r, fill: fill, "fill-opacity": ".35", stroke: fill, "stroke-width": ".6", class: "nthview-shape" }) : sv("rect", { x: pt.x, y: pt.y, width: pt.w, height: pt.h, rx: "1.6", fill: fill, "fill-opacity": ".28", stroke: fill, "stroke-width": ".6", class: "nthview-shape" });
          gEl.appendChild(shape);
          var lbl = sv("text", { x: ctr[pt.id][0], y: ctr[pt.id][1] + 1.1, "text-anchor": "middle", fill: "currentColor" }); lbl.textContent = a.hideLabels ? String(i + 1) : pt.label; gEl.appendChild(lbl);
          function pick() {
            if (ctx.finished) return;
            if (pt.id === a.answer) { gEl.classList.add("nthview-right"); lbl.textContent = pt.label; ctx.right("Yes: " + pt.label + "."); return; }
            if (STRICT) gEl.classList.add("nthview-dim");
            ctx.wrong(1, (a.hideLabels ? "That is " + pt.label + ". " : "") + (pt.hint || "Not that part."), function () { var c = byId[a.answer]; c.g.classList.add("nthview-right"); c.l.textContent = c.pt.label; return "The right part: " + c.pt.label + "."; });
          }
          gEl.addEventListener("click", pick); gEl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(); } });
          byId[pt.id] = { g: gEl, l: lbl, pt: pt }; svg.appendChild(gEl);
        });
        svg.style.color = "var(--ink)";
        w.appendChild(svg); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      pads: function (host, a, ctx) {
        var w = box(a.title || "Choose a pad"); w.appendChild(p("nthview-q", a.prompt));
        var grid = el("div", { class: "nthview-padsgrid" }), btns = {};
        var maxSize = 0; a.options.forEach(function (o) { if (o.size) maxSize = Math.max(maxSize, o.size); });
        a.options.forEach(function (o) {
          var vis = el("div", { class: "nthview-padvis", "aria-hidden": "true" });
          if (o.bars) { var g1 = el("i", { class: "nthview-grey" }), g2 = el("i"); g1.style.height = Math.max(3, o.bars[0] * .82) + "px"; g2.style.height = Math.max(3, o.bars[1] * .82) + "px"; vis.appendChild(g1); vis.appendChild(g2); }
          else if (o.size) { var hpx = Math.max(14, 80 * o.size / Math.max(maxSize, 1)), fig = doc.createElementNS(svgNS, "svg"); fig.setAttribute("viewBox", "0 0 20 40"); fig.setAttribute("width", String(hpx / 2)); fig.setAttribute("height", String(hpx)); var pth = doc.createElementNS(svgNS, "path"); pth.setAttribute("d", "M10 1a5 5 0 1 1 0 10a5 5 0 1 1 0-10M4 13h12l2 13h-3l-1 13h-8l-1-13H2z"); pth.setAttribute("fill", "currentColor"); fig.appendChild(pth); vis.appendChild(fig); }
          var b = el("button", { type: "button", class: "nthview-opt nthview-padcard" }, [vis, el("span", { class: "nthview-padname", text: o.label })]); btns[o.id] = b;
          b.addEventListener("click", function () {
            if (ctx.finished) return;
            if (o.id === a.answer) { b.classList.add("nthview-right"); disableAll(grid); ctx.right("Right: " + o.label + "."); }
            else { b.classList.add("nthview-wrong"); if (STRICT) b.disabled = true; ctx.wrong(1, o.hint || "Not this one.", function () { btns[a.answer].classList.add("nthview-right"); return "The right pad: " + a.options.filter(function (x) { return x.id === a.answer; })[0].label + "."; }); }
          });
          grid.appendChild(b);
        });
        w.appendChild(grid); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      predict: function (host, a, ctx) {
        var w = box(a.title || "Predict, then watch"); w.appendChild(p("nthview-q", a.question));
        var list = el("div", { class: "nthview-opts" }), frames = el("div", { class: "nthview-story" }), picked = null, btns = [], ran = false;
        a.options.forEach(function (o, i) {
          var b = optBtn(o.text); b.setAttribute("aria-pressed", "false"); btns.push(b);
          b.addEventListener("click", function () { if (ran) return; picked = i; btns.forEach(function (x, k2) { x.setAttribute("aria-pressed", String(k2 === i)); }); row.button.disabled = false; sfx("open"); });
          list.appendChild(b);
        });
        w.appendChild(list);
        var row = checkRow(a.runLabel || "Run it and watch", function () {
          if (picked === null || ran) return; ran = true; row.button.disabled = true; disableAll(list); sfx("pick");
          var i = 0; (function show() {
            if (i < a.frames.length) { frames.appendChild(p("", a.frames[i])); i++; setTimeout(show, settings.reduced ? 120 : 950); return; }
            var right = !!a.options[picked].correct, ci = a.options.map(function (o) { return !!o.correct; }).indexOf(true);
            btns[ci].classList.add("nthview-right"); if (!right) btns[picked].classList.add("nthview-wrong");
            if (right) ctx.right("Your prediction was right! " + a.result);
            else ctx.wrong(1, "Not what you predicted. " + (a.options[picked].why || ""), function () { return a.result; }, true);
          })();
        }); row.button.disabled = true;
        w.appendChild(row); w.appendChild(frames); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      confidence: function (host, a, ctx) {
        var w = box(a.title || "How sure are you?"); w.appendChild(p("nthview-q", a.question));
        var list = el("div", { class: "nthview-opts" }), picked = null, conf = 1, btns = [], ci = 0;
        a.options.forEach(function (o, i) {
          if (o.correct) ci = i;
          var b = optBtn(o.text); b.setAttribute("aria-pressed", "false"); btns.push(b);
          b.addEventListener("click", function () { if (ctx.finished || b.disabled) return; picked = i; btns.forEach(function (x, k2) { x.setAttribute("aria-pressed", String(k2 === i)); x.classList.remove("nthview-wrong"); }); row.button.disabled = false; sfx("open"); });
          list.appendChild(b);
        });
        w.appendChild(list);
        var seg = segControl(["I'm sure", "I think so", "Just guessing"], conf, function (i) { conf = i; }, "How sure are you");
        var cwrap = el("div", { class: "nthview-conf" }, [p("nthview-cap", "How sure are you? Sure and right is best; sure and wrong costs more."), seg]);
        w.appendChild(cwrap);
        var row = checkRow("Lock in my answer", function () {
          if (picked === null || ctx.finished) return; var o = a.options[picked];
          if (o.correct) { btns[picked].classList.add("nthview-right"); disableAll(w); ctx.right((a.okText || "Correct!") + (conf === 0 ? " Sure and right: full marks." : conf === 1 ? " Right, and you half knew it." : " Right, but a guess."), conf); return; }
          btns[picked].classList.add("nthview-wrong"); if (STRICT) btns[picked].disabled = true; btns[picked].setAttribute("aria-pressed", "false"); picked = null; row.button.disabled = true;
          ctx.wrong(conf === 0 ? 2 : 1, (conf === 0 ? "Sure, but wrong: that costs double. " : "Not quite. ") + (o.why || ""), function () { btns[ci].classList.add("nthview-right"); return "The answer: " + plain(a.options[ci].text) + "."; });
        }); row.button.disabled = true;
        w.appendChild(row); w.appendChild(ctx.fbWrap); host.appendChild(w);
      },
      /* explorations (unscored; a quiz follows) */
      story: function (host, a) {
        var w = box(a.title || "What happens"), story = el("div", { class: "nthview-story" }), step = 1, row = el("div", { class: "nthview-actions" });
        var next = btn(a.buttonLabel, "nthview-primary", function () { step++; sfx("open"); draw(); }), reset = btn(a.resetLabel || "Start over", "", function () { step = 1; draw(); });
        function draw() { story.textContent = ""; a.frames.slice(0, step).forEach(function (f) { story.appendChild(p("", f)); }); next.disabled = step >= a.frames.length; }
        row.appendChild(next); row.appendChild(reset); w.appendChild(story); w.appendChild(row); if (a.caption) w.appendChild(p("nthview-cap", a.caption)); host.appendChild(w); draw();
      },
      tune: function (host, a) {
        var w = box(a.title || "Try it"); host.appendChild(w);
        var env = {}; a.controls.forEach(function (c) { env[c.id] = c.value; });
        var exprs = function (src) { var c = compileExpr(src); return c.fn ? String(Math.round(c.fn(env) * 100) / 100) : null; };
        var readout = el("p", { class: "nthview-readout", "aria-live": "polite" }), pile = el("div", { class: "nthview-pile", "aria-hidden": "true" }), vis = el("div", { class: "nthview-gridvis", "aria-hidden": "true" }), fb = el("p", { class: "nthview-fb", "aria-live": "polite" }), ready = false;
        function upd() {
          var r = null; for (var i = 0; i < a.readout.length; i++) { var c = a.readout[i]; if (c.when === undefined || evalExpr(c.when, env)) { r = c; break; } }
          readout.textContent = r ? fillTemplate(r.text, null, exprs) : "";
          if (a.tally) { var n = Math.max(0, Math.round(evalExpr(a.tally.count, env))); pile.textContent = a.tally.icon.repeat(Math.min(n, a.tally.max || 30)); }
          if (a.visual) {
            vis.textContent = ""; var cnt = Math.max(0, Math.min(12, Math.round(evalExpr(a.visual.count, env)))), ex = Math.max(0, Math.min(a.visual.kind === "grid" ? 6 : 36, Math.round(evalExpr(a.visual.extra, env))));
            if (a.visual.kind === "grid") { vis.style.gridTemplateColumns = "repeat(" + Math.max(1, cnt) + ",16px)"; for (var y = 0; y < Math.max(1, ex); y++) for (var x = 0; x < Math.max(1, cnt); x++) vis.appendChild(el("i")); if (a.visual.leader) { var ld = el("i"); ld.style.background = "var(--gold)"; vis.appendChild(ld); } }
            else { vis.style.gridTemplateColumns = "repeat(12,16px)"; for (var q = 0; q < cnt; q++) vis.appendChild(el("i")); for (var e2 = 0; e2 < ex; e2++) { var sl = el("i"); sl.style.background = "var(--line)"; sl.style.height = "8px"; vis.appendChild(sl); } }
          }
          fb.textContent = ""; fb.className = "nthview-fb";
        }
        a.controls.forEach(function (c) { stepper(w, c.label, c.min, c.max, c.value, function (v) { env[c.id] = v; if (ready) { sfx("open"); upd(); } }); });
        w.appendChild(readout); if (a.tally) w.appendChild(pile); if (a.visual) w.appendChild(vis);
        if (a.outcomes) {
          var r2 = el("div", { class: "nthview-actions" });
          r2.appendChild(btn(a.outcomes.buttonLabel, "", function () {
            var hit = null; for (var i = 0; i < a.outcomes.cases.length; i++) if (evalExpr(a.outcomes.cases[i].when, env)) { hit = a.outcomes.cases[i]; break; }
            hit = hit || a.outcomes.fallback; fb.className = "nthview-fb" + (hit.tone === "ok" ? " nthview-ok" : hit.tone === "no" ? " nthview-no" : ""); fb.textContent = hit.text; sfx(hit.tone === "ok" ? "ok" : "open");
          }));
          w.appendChild(r2); w.appendChild(fb);
        }
        if (a.caption) w.appendChild(p("nthview-cap", a.caption));
        ready = true; upd();
      },
      race: function (host, a) {
        var w = box(a.title || "Race"), bars = [], row = el("div", { class: "nthview-actions" });
        row.appendChild(btn(a.buttonLabel, "nthview-primary", function () {
          bars.forEach(function (b) { b.bar.style.transition = "none"; b.bar.style.width = "0%"; b.val.textContent = ""; }); sfx("open");
          requestAnimationFrame(function () { requestAnimationFrame(function () { bars.forEach(function (b) { b.bar.style.transition = ""; b.bar.style.width = b.value + "%"; }); setTimeout(function () { bars.forEach(function (b) { b.val.textContent = b.show; }); sfx("pick"); }, settings.reduced ? 0 : 1250); }); });
        }));
        w.appendChild(row);
        a.bars.forEach(function (b) { var r = barRow(b.label, 0, "", "normal"); bars.push({ bar: r.querySelector(".nthview-bar"), val: r.querySelector("b"), value: b.value, show: b.show }); w.appendChild(r); });
        if (a.caption) w.appendChild(p("nthview-cap", a.caption)); host.appendChild(w);
      },
      compare: function (host, a) {
        var w = box(a.title || "Before and after"); if (a.prompt) w.appendChild(p("", a.prompt));
        var sides = [a.before, a.after], which = 0, body2 = el("div");
        var seg = segControl([a.before.label, a.after.label], 0, function (i) { which = i; sfx("open"); draw(true); }, "Before or after");
        function draw(anim) {
          var side = sides[which]; body2.textContent = ""; var t = p("", side.text); t.style.marginTop = "8px"; body2.appendChild(t);
          side.rows.forEach(function (r) { var rr = barRow(r.label, anim ? 0 : r.value, r.show, which === 0 ? "grey" : "normal"); body2.appendChild(rr); if (anim) requestAnimationFrame(function () { requestAnimationFrame(function () { rr.querySelector(".nthview-bar").style.width = r.value + "%"; }); }); });
        }
        w.appendChild(seg); w.appendChild(body2); if (a.caption) w.appendChild(p("nthview-cap", a.caption)); host.appendChild(w); draw(false);
      },
      bars: function (host, a) {
        var w = box(a.title || "Guess the bars"); w.appendChild(p("", a.prompt)); var rows = [], revealed = false;
        a.items.forEach(function (it, i) {
          var r = barRow(it.label, 50, "50", "normal"), bar = r.querySelector(".nthview-bar"), val = r.querySelector("b"), track = r.querySelector(".nthview-track"); bar.style.transition = "none";
          var range = el("input", { type: "range", class: "nthview-range", min: "0", max: "100", step: "1", value: "50", "aria-label": "Your guess for " + it.label });
          range.addEventListener("input", function () { bar.style.width = range.value + "%"; val.textContent = range.value; });
          r.appendChild(range); rows.push({ range: range, track: track, val: val }); w.appendChild(r);
        });
        var fb = el("div", { class: "nthview-fb", "aria-live": "polite" });
        w.appendChild(checkRow(a.buttonLabel || "Reveal the real numbers", function () {
          if (revealed) return; revealed = true; sfx("pick");
          rows.forEach(function (r, i) { r.range.disabled = true; var mk = el("span", { class: "nthview-mark" }); mk.style.left = a.items[i].value + "%"; r.track.appendChild(mk); r.val.textContent = a.items[i].show; });
          fb.className = "nthview-fb nthview-ok"; fb.textContent = a.revealText || "The green marks show the real values.";
        }));
        w.lastChild.button.removeAttribute("data-primary");
        w.appendChild(fb); host.appendChild(w);
      },
      switches: function (host, a) {
        var w = box(a.title || "Flip the switches"); if (a.prompt) w.appendChild(p("", a.prompt));
        var env = {}; a.switches.forEach(function (s) { env[s.id] = s.on ? 1 : 0; });
        var readout = el("p", { class: "nthview-readout", "aria-live": "polite" }), lamp = el("span", { class: "nthview-lamp", "aria-hidden": "true" });
        function upd() { var r = null; for (var i = 0; i < a.readout.length; i++) { var c = a.readout[i]; if (c.when === undefined || evalExpr(c.when, env)) { r = c; break; } } readout.textContent = ""; readout.appendChild(lamp); readout.appendChild(doc.createTextNode(r ? r.text : "")); lamp.className = "nthview-lamp" + (r && r.tone ? " nthview-" + r.tone : ""); }
        a.switches.forEach(function (s) {
          var tg = el("button", { type: "button", class: "nthview-toggle", role: "switch", "aria-checked": String(!!s.on), "aria-label": s.label });
          tg.addEventListener("click", function () { env[s.id] = env[s.id] ? 0 : 1; tg.setAttribute("aria-checked", String(!!env[s.id])); sfx("open"); upd(); });
          w.appendChild(el("div", { class: "nthview-sw" }, [el("span", { text: s.label }), tg]));
        });
        w.appendChild(readout); if (a.caption) w.appendChild(p("nthview-cap", a.caption)); host.appendChild(w); upd();
      },
      flashcards: function (host, a) {
        var w = box(a.title || "Flip the cards"); if (a.prompt) w.appendChild(p("", a.prompt));
        var i = 0, flipped = false, known = {}, front = el("div", { class: "nthview-face" }), back = el("div", { class: "nthview-face nthview-back" });
        var card = el("div", { class: "nthview-flip" }, [front, back]), holder = el("div", { class: "nthview-card3" }, [card]), counter = el("p", { class: "nthview-cap", "aria-live": "polite" });
        var flipBtn = btn("Flip", "nthview-primary", function () { flipped = !flipped; card.classList.toggle("nthview-flipped", flipped); sfx("open"); });
        var prev = btn("Previous", "", function () { i = (i + a.cards.length - 1) % a.cards.length; draw(); }), next = btn("Next", "", function () { i = (i + 1) % a.cards.length; draw(); });
        var got = btn("Got it", "", function () { known[i] = !known[i]; draw(); sfx("pick"); });
        function draw() { flipped = false; card.classList.remove("nthview-flipped"); front.textContent = ""; front.appendChild(rich(a.cards[i].front)); back.textContent = ""; back.appendChild(rich(a.cards[i].back)); counter.textContent = "Card " + (i + 1) + " of " + a.cards.length + " · " + Object.keys(known).filter(function (k2) { return known[k2]; }).length + " marked as known"; got.textContent = known[i] ? "Got it ✓" : "Got it"; got.setAttribute("aria-pressed", String(!!known[i])); }
        card.addEventListener("click", function () { flipBtn.click(); });
        w.appendChild(holder); w.appendChild(el("div", { class: "nthview-actions" }, [flipBtn, prev, next, got])); w.appendChild(counter); host.appendChild(w); draw();
      }
    };
    /* order and rank: tap the cards in sequence */
    function tapOrder(host, a, ctx, isRank) {
      var n = a.items.length, perm = shuffledIdx(n, (isRank ? "rank" : "order") + a.prompt), seq = [];
      var w = box(a.title || (isRank ? "Rank them" : "Put them in order")); w.appendChild(p("nthview-q", a.prompt));
      var slots = el("div", { class: "nthview-seq", "aria-live": "polite" }), list = el("div", { class: "nthview-opts" }), reveal = el("div"), btns = {};
      function draw(marks) {
        slots.textContent = "";
        for (var i = 0; i < n; i++) { var idx = seq[i]; slots.appendChild(el("span", { class: "nthview-slot" + (idx !== undefined ? " nthview-filled" : "") + (marks && idx !== undefined ? (marks[i] ? " nthview-right" : " nthview-wrong") : ""), text: idx !== undefined ? (i + 1) + ". " + plain(a.items[idx].text) : String(i + 1) })); }
        perm.forEach(function (idx) { var b = btns[idx], pos = seq.indexOf(idx); b.setAttribute("aria-pressed", String(pos !== -1)); b.firstChild.textContent = pos !== -1 ? String(pos + 1) : "·"; b.classList.toggle("nthview-right", !!(marks && pos !== -1 && marks[pos])); b.classList.toggle("nthview-wrong", !!(marks && pos !== -1 && !marks[pos])); });
        row.button.disabled = seq.length < n || ctx.finished;
      }
      perm.forEach(function (idx) {
        var b = el("button", { type: "button", class: "nthview-opt", "aria-pressed": "false" }, [el("span", { class: "nthview-num", "aria-hidden": "true", text: "·" }), el("span", { class: "nthview-txt", text: plain(a.items[idx].text) })]);
        b.addEventListener("click", function () { if (ctx.finished) return; var pos = seq.indexOf(idx); if (pos === -1) seq.push(idx); else seq.splice(pos, 1); sfx("open"); draw(); });
        btns[idx] = b; list.appendChild(b);
      });
      var clear = btn("Clear", "", function () { if (ctx.finished) return; seq = []; draw(); });
      function showRight() { reveal.textContent = ""; var d = box(isRank ? "The real numbers" : "The right order"); a.items.forEach(function (it, i) { if (isRank) d.appendChild(barRow((i + 1) + ". " + plain(it.text), it.value, it.show, "normal")); else { var pp = p("", (i + 1) + ". " + it.text); pp.style.margin = "4px 0"; d.appendChild(pp); if (it.note) d.appendChild(el("span", { class: "nthview-note", text: it.note })); } }); if (isRank && a.caption) d.appendChild(p("nthview-cap", a.caption)); reveal.appendChild(d); }
      var row = checkRow(isRank ? "Check my ranking" : "Check the order", function () {
        var marks = seq.map(function (idx, pos) { return idx === pos; }), right = marks.filter(Boolean).length;
        draw(marks);
        if (right === n) { disableAll(w); showRight(); ctx.right(isRank ? "Ranked perfectly!" : "Perfect order!"); return; }
        ctx.wrong(1, right + " of " + n + " are in the right place" + (STRICT ? ". Tap a card to take it out and try again." : "."), function () { seq = a.items.map(function (_, i) { return i; }); draw(seq.map(function () { return true; })); showRight(); return isRank ? "Here is the real ranking." : "Here is the right order."; });
      });
      row.appendChild(clear);
      w.appendChild(slots); w.appendChild(p("nthview-cap", "Tap the cards in " + (isRank ? "rank" : "the right") + " order. Tap a card again to take it out.")); w.appendChild(list); w.appendChild(row); w.appendChild(ctx.fbWrap); w.appendChild(reveal); host.appendChild(w); draw();
    }

    /* ======================================================================
       Flow: lesson -> room (soldiers, boss) -> secret box -> question -> key
       -> door -> cleared -> next lesson ... -> the vault -> report
       ====================================================================== */

    /* ======================================================================
       Flow, shared by every engine:
       enter(k) -> lesson card (the world waits) -> play(k) -> reached(k) ->
       question cards -> solve(k) -> engine.solved(k) -> cleared page -> enter(k+1)
       ... -> finale questions -> report
       ====================================================================== */
    function openPanel(compact, label) {
      panel.classList.toggle("nthview-compact", !!compact); panel.setAttribute("aria-label", label || "Lesson");
      panel.classList.add("nthview-open"); panel.scrollTop = 0; ui();
      setTimeout(function () { var f = pbody.querySelector("h2") ? panel : null; if (f) f.focus({ preventScroll: true }); }, 60);
    }
    function closePanel() { panel.classList.remove("nthview-open"); ui(); if (!overlayOpen()) canvas.focus({ preventScroll: true }); }
    function panelOpen() { return panel.classList.contains("nthview-open"); }
    function ui() { if (E && E.ui) E.ui(); }
    function showCallout(kick, text, big) { cKick.textContent = kick || ""; cText.textContent = ""; if (text) cText.appendChild(rich(text)); cBig.textContent = big || ""; cLegend.textContent = ""; cFb.textContent = ""; cFb.className = "nthview-cfb"; cAct.textContent = ""; callout.classList.remove("nthview-off"); callout.scrollTop = 0; }
    function hideCallout() { callout.classList.add("nthview-off"); }
    function accentFor(k) { var c = k >= 0 && k < N ? LV[k].color : null; if (c) panel.style.setProperty("--accent", c); else panel.style.removeProperty("--accent"); }
    function page(kicker, title) { accentFor(S.k); pbody.textContent = ""; pbody.appendChild(el("p", { class: "nthview-kicker", text: kicker })); pbody.appendChild(el("h2", { text: title })); }
    function actions(list) { var r = el("div", { class: "nthview-actions" }); list.forEach(function (x) { r.appendChild(x); }); pbody.appendChild(r); return r; }
    function keyHint(text) { return el("span", { class: "nthview-keyhint", text: text }); }
    function loseLife(n) {
      if (!STRICT || n <= 0 || S.outOn) return;
      S.lives = Math.max(0, S.lives - n); renderScore(); bump(lifeChip); persist();
      if (S.lives <= 0) livesOut();
    }
    function reactWrong() { hitFlash(); if (E.wrong) E.wrong(); }
    function reactRight() { sfx("ok"); if (E.right) E.right(); }
    /* a mistake made in the world (a wrong crate, gate, pad ...): scored like a wrong answer */
    function mistake(k, cost, note) {
      if (k >= 0 && k < N) { S.results[k].mistakes += cost; if (note) S.results[k].notes.push(plain(note)); }
      loseLife(cost); hitFlash(); sfx("no"); persist();
    }
    /* quiz mode: the last life going is counted, and play goes on with a fresh set */
    function livesOut() {
      S.outOn = true; S.outs++; saveNow();
      setTimeout(function () {
        openOverlay("out"); ocard.textContent = "";
        ocard.appendChild(el("h1", { text: E.words.outTitle }));
        ocard.appendChild(p("nthview-big", E.words.outText));
        ocard.appendChild(el("p", { class: "nthview-readout", text: "So far: " + S.outs }));
        ocard.appendChild(p("nthview-small", hero + " gets a fresh set of " + E.words.lives[1] + ". Nothing you answered is lost."));
        var go = primaryBtn("Resume", function () { S.outOn = false; S.lives = START_LIVES; renderScore(); persist(); closeOverlay(); if (!panelOpen()) canvas.focus({ preventScroll: true }); });
        ocard.appendChild(el("div", { class: "nthview-actions" }, [go, keyHint("Enter"), restartButton(container, data, KEY)]));
        ocard.lastChild.lastChild.style.marginLeft = "auto";
        setTimeout(function () { go.focus({ preventScroll: true }); }, 60);
      }, 500);
    }

    function introCard() {
      openOverlay("intro"); ocard.textContent = "";
      ocard.appendChild(el("h1", { text: data.title })); if (data.subtitle) ocard.appendChild(p("nthview-kicker", data.subtitle));
      data.intro.paragraphs.forEach(function (t) { ocard.appendChild(p("nthview-big", t)); });
      if (data.intro.steps && data.intro.steps.length) { ocard.appendChild(p("", "**How it works**")); ocard.appendChild(el("ol", {}, data.intro.steps.map(function (s) { var li = el("li"); li.appendChild(rich(s)); return li; }))); }
      E.words.intro.forEach(function (t) { ocard.appendChild(p("nthview-small", t)); });
      ocard.appendChild(p("nthview-small", STRICT ? "Quiz mode: a wrong answer costs one of your " + E.words.lives[1] + " and the answer stays hidden until you find it." : "Learning mode: a wrong answer shows the right one and costs a star, never the game. Every lesson waits until you have read it."));
      if (data.intro.note) ocard.appendChild(p("nthview-small", data.intro.note));
      var go = primaryBtn("Start", function () { closeOverlay(); sfx("open"); enter(0); });
      ocard.appendChild(el("div", { class: "nthview-actions nthview-sticky" }, [go, keyHint("Enter"), restartButton(container, data, KEY)]));
      ocard.lastChild.lastChild.style.marginLeft = "auto";
      setTimeout(function () { go.focus({ preventScroll: true }); }, 60);
    }
    /* move to level k (k === N is the finale); the engine readies its world, then the lesson (or the finale card) shows */
    function enter(k) {
      S.k = k; S.trialNotes = []; S.mode = "enter"; renderHud(); hideCallout(); persist();
      E.enter(k, function () { if (k >= N) showFinaleIntro(); else showLesson(k); });
    }
    function lessonNodes(k, findings) {
      var s = LV[k].data, out = [p("nthview-lead", s.lead)];
      (s.body || []).forEach(function (t) { out.push(p("", t)); });
      if (findings && s.findings && !s.findings.after) out.push(findingsBox(s.findings));
      return out;
    }
    function inWorld(type) { return E.worldTypes.indexOf(type) !== -1; }
    function showLesson(k) {
      S.mode = "lesson"; S.k = k; renderHud(); hideCallout(); persist();
      var b = LV[k];
      page(E.words.Level + " " + (k + 1) + " of " + N, b.name);
      lessonNodes(k, true).forEach(function (n) { pbody.appendChild(n); });
      var ahead = E.ahead ? E.ahead(k) : null; if (ahead) pbody.appendChild(ahead);
      actions([primaryBtn(E.words.begin + " ▸", startPlay), keyHint(E.words.beginHint)]);
      openPanel(false, "Lesson: " + b.name);
    }
    function startPlay() { closePanel(); S.mode = "play"; sfx("open"); persist(); E.play(S.k); }
    /* the engine says the learner reached the question; notes are what an in-world task showed */
    function reached(k, notes) {
      S.trialNotes = notes || []; S.steps = buildSteps(LV[k]); S.stepI = 0; S.mode = "ask"; hideCallout();
      if (S.steps.length) showStep(k, 0); else solve(k);
    }
    function buildSteps(b) {
      var s = b.data, steps = [];
      if (!s.activity) steps.push({ quiz: s.quiz });
      else if (b.type === "collect") steps.push({ collect: s.activity, quiz: s.quiz });
      else if (!inWorld(b.type)) (E.asCard ? E.asCard(s.activity) : [s.activity]).forEach(function (a, i) { steps.push({ act: a, quiz: i ? null : s.quiz }); });
      (s.checks || []).forEach(function (c) { steps.push({ act: c }); });
      return steps;
    }
    function showStep(k, i) {
      var steps = S.steps;
      if (i >= steps.length) { solve(k); return; }
      S.mode = "ask"; S.stepI = i;
      var step = steps[i];
      page(E.words.Level + " " + (k + 1) + " · " + E.words.ask(k) + (steps.length > 1 ? " · question " + (i + 1) + " of " + steps.length : ""), i === 0 ? E.words.ask(k) : "One more question");
      if (i === 0) pbody.appendChild(p("nthview-lead", E.words.askLead(k)));
      var host = el("div"); pbody.appendChild(host);
      var next = function () { showStep(k, i + 1); };
      if (step.collect) {
        var counts = {}; step.collect.items.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
        var top = Object.keys(counts).sort(function (x, y) { return counts[y] - counts[x]; })[0];
        var d = box(step.collect.resultTitle || "The vote");
        if (!inWorld("collect")) d.appendChild(p("", step.collect.prompt));
        d.appendChild(el("div", { class: "nthview-chips" }, step.collect.items.map(function (x) { return el("span", { class: "nthview-chip", "aria-pressed": String(x === top), text: x }); })));
        d.appendChild(el("p", { class: "nthview-readout", text: fillTemplate(step.collect.resultText, { top: top, count: counts[top], total: step.collect.items.length }) }));
        if (step.collect.resultNote) d.appendChild(p("nthview-cap", step.collect.resultNote));
        host.appendChild(d);
      }
      if (step.act && PANEL_EXPLORE.indexOf(step.act.type) !== -1) ACT[step.act.type](host, step.act);
      if (step.quiz) wChoice(host, step.quiz, qctx(k, next), "Question");
      else if (step.act && PANEL_EXPLORE.indexOf(step.act.type) === -1) ACT[step.act.type](host, step.act, qctx(k, next));
      /* the lesson stays one tap away while answering: reading comes before speed */
      var again = el("details", { class: "nthview-more" }, [el("summary", { text: "Read the lesson again" })]);
      lessonNodes(k, true).forEach(function (n) { again.appendChild(n); });
      pbody.appendChild(again);
      openPanel(false, E.words.ask(k));
    }
    function solve(k) {
      var r = S.results[k]; r.done = true; r.stars = starsFor(r.mistakes);
      renderScore(); persist(); closePanel(); S.mode = "solved"; sfx("key");
      E.solved(k, r.stars);
    }
    /* the cleared page; the engine calls it once its world has celebrated */
    function showSolved(k) {
      var b = LV[k], s = b.data, r = S.results[k];
      S.mode = "cleared"; renderHud();
      page(E.words.Level + " " + (k + 1) + " of " + N + " · cleared", E.words.cleared);
      pbody.appendChild(el("p", { class: "nthview-stars", "aria-label": r.stars + " of 3 stars", text: starsText(r.stars) }));
      var extra = E.solvedExtra ? E.solvedExtra(k) : null; if (extra) pbody.appendChild(extra);
      if (S.trialNotes && S.trialNotes.length && !STRICT) { var tb = box("What the task showed"); tb.appendChild(el("ul", {}, S.trialNotes.map(function (n) { var li = el("li"); li.appendChild(rich(n)); return li; }))); pbody.appendChild(tb); }
      if (s.findings && s.findings.after) pbody.appendChild(findingsBox(s.findings));
      if (s.aside) { var ad = box(s.aside.title); var at = p("", s.aside.text); at.style.margin = "0"; ad.appendChild(at); pbody.appendChild(ad); }
      var rem = el("div", { class: "nthview-remember" }, [el("p", { class: "nthview-box-title", text: "Remember" })]); var rt = p("", s.remember); rt.style.margin = "0"; rem.appendChild(rt); pbody.appendChild(rem);
      var nxt = k < N - 1 ? primaryBtn("Next: " + LV[k + 1].name, function () { closePanel(); enter(k + 1); }) : primaryBtn("On to " + data.finale.name, function () { closePanel(); enter(N); });
      actions([nxt, keyHint("Enter")]);
      openPanel(false, E.words.cleared);
    }
    function pickFinale() {
      var qs = data.finale.questions, n = Math.min(data.finale.ask || 5, qs.length), idx = shuffledIdx(qs.length, data.title + ":finale:" + S.runSeed);
      if (qs.length === 1) idx = [0];
      return idx.slice(0, n).map(function (i) { return qs[i]; });
    }
    function showFinaleIntro() {
      S.mode = "finale"; S.k = N; renderHud(); S.finale.list = pickFinale(); persist();
      var n = S.finale.list.length;
      page(E.words.finale, data.finale.name);
      pbody.appendChild(p("nthview-lead", data.finale.lead));
      pbody.appendChild(p("nthview-cap", E.words.finaleCap(n)));
      actions([primaryBtn(E.words.finaleGo + " ▸", startFinale), keyHint("Enter")]);
      openPanel(false, E.words.finale);
    }
    function startFinale() {
      closePanel(); S.mode = "finaleplay"; renderHud();
      var from = Math.min(S.finale.i || 0, Math.max(0, S.finale.list.length - 1));
      E.finaleStart(function () { finaleQ(from); });
    }
    function finaleQ(i) {
      /* paused, or held up by the world (a capture): keep the question for later */
      if (S.mode !== "finaleplay" || S.paused || overlayOpen()) { if (["report", "end"].indexOf(S.mode) === -1) S.pendingQ = i; return; }
      var list = S.finale.list;
      hudProgress(data.finale.name + " · " + Math.min(i + 1, list.length) + " of " + list.length, i / list.length);
      if (i >= list.length) { S.finale.done = true; S.finale.i = list.length; persist(); closePanel(); E.finaleEnd(reachedExit); return; }
      S.finale.i = i; persist();
      page(data.finale.name + " · question " + (i + 1) + " of " + list.length, E.words.finaleAsk);
      var host = el("div"); pbody.appendChild(host);
      wChoice(host, list[i], qctx(-1, function () { closePanel(); sfx("pick"); E.finaleStep(i, function () { finaleQ(i + 1); }); }), null);
      openPanel(true, E.words.finaleAsk);
    }
    function reachedExit() {
      if (S.mode !== "finaleplay") return;
      S.mode = "end"; hudProgress(data.finale.name, 1); sfx("win"); fade(true, true);
      setTimeout(function () { showReport(); fade(false, true); }, 900);
    }
    function resultsList(host, items, render1) {
      var ul = el("ul", { class: "nthview-results" }), shown = 0, more = btn("Show more", "", function () { add(); });
      function add() { var end = Math.min(items.length, shown + 50); for (; shown < end; shown++) ul.appendChild(render1(items[shown], shown)); more.classList.toggle("nthview-hidden", shown >= items.length); more.textContent = "Show " + Math.min(50, items.length - shown) + " more"; }
      host.appendChild(ul); host.appendChild(more); add();
    }
    function takeaway(s2) { var res = S.results[s2.idx]; return el("li", {}, [el("span", { class: "nthview-rs", "aria-label": res.stars + " stars", text: starsText(res.stars) }), el("span", { class: "nthview-rt" }, [el("b", { text: (s2.idx + 1) + ". " + s2.name }), el("span", { class: "nthview-note", text: plain(s2.data.remember) })])]); }
    function showReport() {
      S.done = true;   /* the end is the report after the finale; live and restored games both pass here (§5.5 rule 8) */
      S.mode = "report"; S.k = N; panel.classList.remove("nthview-open"); hideCallout(); openOverlay("report"); ocard.textContent = ""; saveNow();
      ocard.appendChild(el("div", { class: "nthview-actions" }, [restartButton(container, data, KEY)])); ocard.lastChild.style.cssText = "margin:0 0 8px;justify-content:flex-end";
      var r = data.report, tiers = r.tiers || {}, fin = starsFor(S.finale.mistakes), st = totalStars() + fin, max = 3 * (N + 1);
      var firstTry = S.results.filter(function (x) { return x.mistakes === 0; }).length;
      ocard.appendChild(el("h1", { text: r.heading }));
      var cells = [["★ Stars", st + " / " + max], ["First try", firstTry + " / " + N]].concat(E.reportStats ? E.reportStats() : []);
      if (STRICT) cells.push([E.words.lives[2] + " left", S.lives + " / " + START_LIVES], [E.words.outTitle.replace(/!$/, ""), String(S.outs)]);
      ocard.appendChild(el("div", { class: "nthview-scorecard" }, cells.map(function (c) { return el("div", {}, [doc.createTextNode(c[0]), el("b", { text: c[1] })]); })));
      ocard.appendChild(p("nthview-big", st === max ? (tiers.perfect || "Every answer right first time.") : st >= max * .8 ? (tiers.great || "A great game.") : (tiers.pass || "You made it! Play it again to earn more stars.")));
      ocard.appendChild(p("", "**What you learned**"));
      ocard.appendChild(el("ol", {}, r.lessons.map(function (l) { var li = el("li"); li.appendChild(rich(l)); return li; })));
      var det = el("details", { class: "nthview-more" }); if (N <= 12) det.setAttribute("open", "");
      det.appendChild(el("summary", { text: "Every " + E.words.level + " and its takeaway (" + N + ")" }));
      resultsList(det, LV, takeaway);
      ocard.appendChild(det);
      if (r.glossary && r.glossary.length) {
        if (r.glossaryIntro) ocard.appendChild(p("", r.glossaryIntro));
        var cols = r.glossaryColumns || ["In this game", "In the source"];
        var table = el("table", { class: "nthview-t" }, [el("tr", {}, [el("th", { text: cols[0] }), el("th", { text: cols[1] })])]);
        r.glossary.forEach(function (g) { table.appendChild(el("tr", {}, [el("td", { text: g.term }), el("td", { text: g.meaning })])); });
        ocard.appendChild(table);
      }
      if (r.source) {
        var sp2 = el("p", { class: "nthview-small" }); sp2.appendChild(doc.createTextNode("Source: "));
        if (r.source.url) sp2.appendChild(el("a", { href: r.source.url, target: "_blank", rel: "noopener noreferrer", text: r.source.label })); else sp2.appendChild(el("b", { text: r.source.label }));
        if (r.source.note) sp2.appendChild(doc.createTextNode(" " + r.source.note)); ocard.appendChild(sp2);
      }
      var again = primaryBtn("Play it again", restartAll);
      ocard.appendChild(el("div", { class: "nthview-actions" }, [again]));
      if (E.reportEnd) E.reportEnd();
      setTimeout(function () { again.focus({ preventScroll: true }); }, 60);
    }
    function restartAll() {
      clearState(KEY); closeOverlay(); S.done = false; S.runSeed++; S.lives = START_LIVES; S.outs = 0;
      S.results = freshResults(); S.finale = { list: [], i: 0, mistakes: 0, done: false };
      if (E.reset) E.reset();
      renderScore(); fade(true); setTimeout(function () { fade(false); enter(0); }, 380);
    }
    function fade(on, white) { fadeEl.classList.toggle("nthview-white", !!white); fadeEl.classList.toggle("nthview-on", !!on); }

    /* ---------- overlays: intro, pause, out of lives, report; engines add their own ---------- */
    var overlayKind = null;
    function openOverlay(kind) { overlayKind = kind; overlay.classList.remove("nthview-hidden"); ocard.setAttribute("aria-label", kind); ui(); }
    function closeOverlay() { overlayKind = null; overlay.classList.add("nthview-hidden"); ui(); }
    function overlayOpen() { return overlayKind !== null; }
    function toggleBtn(label, on, fn) { var b = el("button", { type: "button", class: "nthview-btn", "aria-pressed": String(on), text: label + (on ? ": on" : ": off") }); b.addEventListener("click", function () { on = !on; b.setAttribute("aria-pressed", String(on)); b.textContent = label + (on ? ": on" : ": off"); fn(on); }); return b; }
    function pause() {
      if (S.paused || overlayOpen() || ["report", "intro", "end"].indexOf(S.mode) !== -1 || (E.canPause && !E.canPause())) return;
      S.paused = true; openOverlay("pause"); ocard.textContent = "";
      var k = Math.min(S.k, N - 1), inLevel = S.k < N;
      ocard.appendChild(el("h2", { text: "Paused" }));
      ocard.appendChild(p("nthview-small", (inLevel ? E.words.Level + " " + (k + 1) + " of " + N + ": " + LV[k].name : data.finale.name) + " · ★ " + totalStars() + (E.pauseInfo ? E.pauseInfo() : "") + (STRICT ? " · " + S.lives + " " + E.words.lives[1] + " · quiz mode" : "")));
      var resumeB = primaryBtn("Resume", resume);
      var menu = el("div", { class: "nthview-menu" }, [resumeB]);
      if (inLevel && ["lesson", "ask", "solved", "cleared", "enter", "finale"].indexOf(S.mode) === -1) menu.appendChild(btn("Read this " + E.words.level + "'s lesson again", "", function () { closeOverlay(); S.paused = false; if (E.replay) E.replay(k); showLesson(k); }));
      menu.appendChild(toggleBtn("Reduced motion", settings.reduced, function (v) { settings.reduced = v; persist(); }));
      menu.appendChild(toggleBtn("Sound", settings.sound, function (v) { settings.sound = v; persist(); }));
      if (E.pauseMenu) E.pauseMenu(menu, toggleBtn);
      menu.appendChild(restartButton(container, data, KEY));
      ocard.appendChild(menu);
      if (E.pauseExtra) E.pauseExtra(ocard);
      var done = LV.filter(function (s2, i) { return S.results[i].done; });
      var det = el("details", { class: "nthview-more" }); det.appendChild(el("summary", { text: "Review so far (" + done.length + " of " + N + ")" }));
      if (done.length) resultsList(det, done, takeaway);
      else det.appendChild(p("nthview-small", "Nothing cleared yet. The takeaways collect here as you play."));
      ocard.appendChild(det);
      setTimeout(function () { resumeB.focus({ preventScroll: true }); }, 60);
    }
    function flushFinale() { if (S.pendingQ !== undefined && S.pendingQ !== null && S.mode === "finaleplay") { var q = S.pendingQ; S.pendingQ = null; finaleQ(q); } }
    function resume() {
      if (!S.paused) return; S.paused = false; closeOverlay();
      if (E.resume) E.resume();
      flushFinale();
      if (!panelOpen()) canvas.focus({ preventScroll: true });
    }
    pauseBtn.addEventListener("click", function () { if (S.paused) resume(); else pause(); });

    /* ---------- keys: the core handles cards and pausing, the engine moves ---------- */
    function onKey(e) {
      if (!canvas.isConnected) { root.removeEventListener("keydown", onKey); root.removeEventListener("keyup", onKeyUp); return; }
      var key = e.key.toLowerCase(), tag = e.target && e.target.tagName, typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (key === "escape" || (key === "p" && !typing)) {
        if (S.paused) { e.preventDefault(); resume(); }
        else if (!overlayOpen()) { e.preventDefault(); pause(); }
        return;
      }
      if (overlayOpen()) {
        if (key === "enter" && tag !== "BUTTON" && tag !== "A") { var ob = ocard.querySelector("[data-primary]"); if (ob) { e.preventDefault(); ob.click(); } }
        return;
      }
      if (S.paused || typing) return;
      if (key === "enter" && tag !== "BUTTON" && tag !== "A" && tag !== "SUMMARY") {
        if (panelOpen()) { var pb = pbody.querySelector("[data-primary]:not([disabled]):not(.nthview-hidden)"); var cont = pbody.querySelector(".nthview-actions:not(.nthview-hidden) [data-primary]"); var tgt = cont && !cont.disabled ? cont : pb; if (tgt) { e.preventDefault(); tgt.click(); } return; }
      }
      if (tag === "BUTTON" && (key === " " || key === "enter")) return;
      if (panelOpen() && !(E.keysWithPanel && E.keysWithPanel())) return;
      if (E.key && E.key(e, key)) e.preventDefault();
    }
    function onKeyUp(e) { if (E.keyUp) E.keyUp(e, String(e.key).toLowerCase()); }
    root.addEventListener("keydown", onKey); root.addEventListener("keyup", onKeyUp);
    root.addEventListener("pagehide", saveNow);
    if (mqReduce && mqReduce.addEventListener) mqReduce.addEventListener("change", function (e) { settings.reduced = e.matches; });

    /* ---------- the engine ---------- */
    var G = {
      THREE, doc, data, N, hero, STRICT, START_LIVES, settings, S, LV, WD, SAVED,
      el, p, rich, plain, btn, primaryBtn, keyHint, box, icon, seeded, shuffledIdx, starsText, fillTemplate,
      container, canvas, col, hud, hMid, hRight, hStats, panel, pbody, ocard,
      callout, cKick, cText, cBig, cLegend, cFb, cAct, showCallout, hideCallout,
      toast, say, sfx, hitFlash, fade, bump, persist, saveNow, renderScore, renderHud, hudProgress,
      openPanel, closePanel, panelOpen, page, actions, openOverlay, closeOverlay, overlayOpen,
      pause, resume, restartButton: function () { return restartButton(container, data, KEY); }, resultsList,
      enter, showLesson, reached, mistake, showSolved, inWorld, totalStars, flushFinale
    };
    E = NthView.engines[GAME](G);
    G.E = E;
    canvas.setAttribute("aria-label", E.words.canvas);
    container.classList.add("nthview-eng-" + GAME);
    var lifeChip = el("span", { title: E.words.lives[2] + " left" }, [doc.createTextNode(E.words.lives[0] + " "), lifeOut]);
    if (STRICT) hStats.appendChild(lifeChip);

    /* ---------- start ---------- */
    var resumeAt = SAVED ? restoreState(SAVED) : null;
    if (SAVED && SAVED.w && E.load) E.load(SAVED.w);
    renderScore();
    if (!resumeAt) { S.mode = "intro"; renderHud(); E.start(0); introCard(); }
    else {
      var at = resumeAt.phase === "level" ? resumeAt.k : N;
      S.k = at; renderHud(); E.start(at);
      if (resumeAt.phase === "report") { S.finale.done = true; showReport(); }
      else enter(at);
      var note = el("div", { class: "nthview-resume", role: "status", text: "Welcome back, continuing from " + (resumeAt.phase === "level" ? E.words.level + " " + (resumeAt.k + 1) + " of " + N : resumeAt.phase === "finale" ? data.finale.name : "the report") + "." });
      container.appendChild(note);
      var hideNote = function () { note.classList.add("nthview-gone"); setTimeout(function () { if (note.parentNode) note.parentNode.removeChild(note); }, 500); root.removeEventListener("pointerdown", hideNote); root.removeEventListener("keydown", hideNote); };
      setTimeout(hideNote, 4500); root.addEventListener("pointerdown", hideNote); root.addEventListener("keydown", hideNote);
    }
  }


  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-game");
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
    var engine = NthView.engines && NthView.engines[data.game];
    if (typeof engine !== "function") {
      var errE = [{ path: NthView.ENGINE_FIELD, message: "\"" + data.game + "\" engine is not in this file. Rebuild the file with scripts/build-html.js." }];
      renderErrorPanel(container, { errors: errE });
      return { valid: false, errors: errE, warnings: result.warnings };
    }
    if (!hasWebGL()) {
      renderNoWebGL(container);
      return { valid: false, errors: [{ path: "$", message: "WebGL is unavailable in this browser, so the game cannot be drawn." }], warnings: result.warnings };
    }
    /* a rebuild may follow another game: drop its engine and theme classes */
    Array.prototype.slice.call(container.classList).forEach(function (c) { if (/^nthview-(eng|theme)-/.test(c)) container.classList.remove(c); });
    container.classList.add("nthview-play");
    if (engine.css && !root.document.getElementById(STYLE_ID + "-" + data.game)) {
      var st = root.document.createElement("style"); st.id = STYLE_ID + "-" + data.game; st.textContent = engine.css; root.document.head.appendChild(st);
    }
    render(container, data);
    return result;
  };
  NthView.ENGINE_FIELD = "game";

  NthView.libs = [
    { kind: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", global: "THREE", name: "three.js r128" },
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Cinzel:wght@600;700;900&family=Rubik:wght@400;500;700;900&display=swap", name: "Google Fonts" }
  ];
})(typeof globalThis !== "undefined" ? globalThis : window);
