/* NthView — hunter renderer — schemaVersion 1
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
    ".nthview-hunter .nthview-error-panel li{overflow-wrap:anywhere}",
    ".nthview.nthview-hunter.nthview-hunter-game{max-width:none;margin:0;padding:0;position:relative;width:100%;height:100vh;height:100dvh;min-height:420px;overflow:hidden;",
    "  --display:\"Rubik\",\"Avenir Next\",\"Segoe UI\",system-ui,sans-serif;--body:\"Rubik\",\"Segoe UI\",system-ui,-apple-system,sans-serif;",
    "  --hud-bg:rgba(8,11,17,.72);--hud-ink:#f2f5fb;--gold:#ffc83d;--gem:#49e3c3;",
    "  --panel:rgba(250,251,253,.96);--panel-solid:#fafbfd;--ink:#171c26;--muted:#586175;--line:#d9dee8;--chip:#eef1f6;--accent:#c96a10;--accent-ink:#9a4f08;--star:#8a5a00;--ok:#1f7a45;--no:#b83a2c;--on-accent:#fff;",
    "  background:#07090d;color:var(--ink);font-family:var(--body);-webkit-tap-highlight-color:transparent}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-hunter.nthview-hunter-game{--panel:rgba(19,23,32,.96);--panel-solid:#131720;--ink:#eef1f7;--muted:#a7b0c2;--line:#2f3747;--chip:#1c222e;--accent:#ffb23e;--accent-ink:#ffb23e;--star:#ffc83d;--ok:#6fd39a;--no:#ff8f7a;--on-accent:#1b1304}}",
    ".nthview.nthview-hunter.nthview-theme-bunker{--accent:#5c7a16;--accent-ink:#476010;--panel:rgba(250,251,246,.96);--panel-solid:#fafbf6;--chip:#eff2e6;--line:#dadfcc}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-hunter.nthview-theme-bunker{--accent:#b5d455;--accent-ink:#b5d455;--panel:rgba(22,25,17,.96);--panel-solid:#161911;--chip:#20251a;--line:#363d2a;--on-accent:#141a04}}",
    ".nthview.nthview-hunter.nthview-theme-lab{--accent:#0b8a8a;--accent-ink:#086a6a;--panel:rgba(247,252,252,.96);--panel-solid:#f7fcfc;--chip:#e8f3f3;--line:#cfe2e2}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-hunter.nthview-theme-lab{--accent:#5fe0d6;--accent-ink:#5fe0d6;--panel:rgba(13,24,26,.96);--panel-solid:#0d181a;--chip:#152528;--line:#27403f;--on-accent:#04201e}}",
    ".nthview.nthview-hunter.nthview-theme-rooftop{--accent:#6247d6;--accent-ink:#4a33b0;--panel:rgba(250,249,255,.96);--panel-solid:#faf9ff;--chip:#eeecfa;--line:#d9d5ef}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-hunter.nthview-theme-rooftop{--accent:#b0a2ff;--accent-ink:#b0a2ff;--panel:rgba(18,16,32,.96);--panel-solid:#121020;--chip:#1d1a33;--line:#322d55;--on-accent:#120c33}}",
    "body:has(> .nthview-hunter.nthview-hunter-game){margin:0;overflow:hidden;background:#07090d}",
    ".nthview-hunter .nthview-hidden{display:none!important}",
    ".nthview-hunter button{font:inherit;color:inherit;cursor:pointer}",
    ".nthview-hunter button:disabled{cursor:default}",
    ".nthview-hunter .nthview-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none;cursor:pointer}",
    ".nthview-hunter .nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".nthview-hunter .nthview-col{position:absolute;top:0;bottom:0;left:50%;width:min(560px,100%);transform:translateX(-50%);pointer-events:none;z-index:5}",
    /* HUD: minimal, like the game */
    ".nthview-hunter .nthview-hud{position:absolute;top:0;left:0;right:0;padding:max(10px,env(safe-area-inset-top)) 10px 0;display:flex;align-items:flex-start;gap:8px;color:var(--hud-ink)}",
    ".nthview-hunter .nthview-hchip{background:var(--hud-bg);border:1px solid rgba(255,255,255,.14);border-radius:14px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
    ".nthview-hunter .nthview-pausebtn{width:44px;height:44px;flex:none;display:grid;place-items:center;pointer-events:auto;color:var(--hud-ink);padding:0}",
    ".nthview-hunter .nthview-hleft{display:flex;flex-direction:column;gap:6px;align-items:flex-start;flex:none}",
    ".nthview-hunter .nthview-restart{pointer-events:auto;font-size:.72rem;font-weight:700;padding:5px 10px;min-height:28px;border-radius:10px;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.2)}",
    ".nthview-hunter .nthview-card .nthview-restart{background:var(--chip);color:var(--ink);border-color:var(--line);font-size:.85rem;padding:9px 14px;min-height:40px}",
    ".nthview-hunter .nthview-resume{position:absolute;left:50%;top:84px;transform:translateX(-50%);z-index:25;background:var(--panel-solid);color:var(--ink);border:2px solid var(--accent);border-radius:14px;padding:9px 16px;font-weight:700;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:calc(100% - 32px);text-align:center;pointer-events:none;transition:opacity .4s}",
    ".nthview-hunter .nthview-resume.nthview-gone{opacity:0}",
    ".nthview-hunter .nthview-hmid{flex:1;min-width:0;padding:6px 10px 7px}",
    ".nthview-hunter .nthview-hkick{font-family:var(--display);font-weight:900;font-size:.7rem;letter-spacing:.12em;text-transform:uppercase;color:var(--gold)}",
    ".nthview-hunter .nthview-hname{font-family:var(--display);font-weight:700;font-size:.86rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-hunter .nthview-hbar{height:4px;border-radius:2px;background:rgba(255,255,255,.18);margin-top:5px;overflow:hidden}",
    ".nthview-hunter .nthview-hbar i{display:block;height:100%;width:0;background:var(--gold);border-radius:2px;transition:width .4s}",
    ".nthview-hunter .nthview-hright{padding:6px 10px;display:flex;flex-direction:column;align-items:flex-end;gap:4px;flex:none}",
    ".nthview-hunter .nthview-targets{display:flex;gap:3px;align-items:center;min-height:18px}",
    ".nthview-hunter .nthview-tgt{width:11px;height:11px;border-radius:50%;background:#ff5a4a;box-shadow:0 0 6px rgba(255,90,74,.7)}",
    ".nthview-hunter .nthview-tgt.nthview-bossdot{width:16px;height:16px;border-radius:4px;transform:rotate(45deg);background:var(--gold);box-shadow:0 0 8px rgba(255,200,61,.8);margin:0 2px}",
    ".nthview-hunter .nthview-tgt.nthview-down{background:rgba(255,255,255,.22);box-shadow:none}",
    ".nthview-hunter .nthview-hstats{display:flex;gap:8px;font-size:.8rem;font-weight:700;white-space:nowrap}",
    ".nthview-hunter .nthview-hstats b{color:var(--gold)}",
    ".nthview-hunter .nthview-hstats .nthview-gemc b{color:var(--gem)}",
    ".nthview-hunter .nthview-hstats span.nthview-bump{animation:nthview-bump .3s ease-out}",
    "@keyframes nthview-bump{0%{transform:scale(1)}40%{transform:scale(1.35)}100%{transform:scale(1)}}",
    "@media (max-width:380px){.nthview-hunter .nthview-hstats{gap:5px;font-size:.7rem}.nthview-hunter .nthview-hright{padding:6px 7px}.nthview-hunter .nthview-hud{gap:6px;padding:8px 8px 0}.nthview-hunter .nthview-tgt{width:10px;height:10px}.nthview-hunter .nthview-tgt.nthview-bossdot{width:13px;height:13px}.nthview-hunter .nthview-toast{font-size:.86rem;padding:7px 12px}}",
    /* callout: the room trial's prompt, at the bottom so the room stays visible */
    ".nthview-hunter .nthview-callout{position:absolute;left:8px;right:8px;bottom:max(8px,env(safe-area-inset-bottom));max-height:30%;overflow-y:auto;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:10px 12px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:opacity .3s,transform .3s;pointer-events:auto}",
    ".nthview-hunter .nthview-callout.nthview-off{opacity:0;transform:translateY(8px);pointer-events:none;visibility:hidden}",
    ".nthview-hunter .nthview-ckick{font-family:var(--display);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);font-weight:700}",
    ".nthview-hunter .nthview-ctext{font-size:.93rem;line-height:1.35;margin-top:2px}",
    ".nthview-hunter .nthview-cbig{font-family:var(--display);font-weight:700;font-size:1.08rem;line-height:1.25;margin-top:6px;text-align:center}",
    ".nthview-hunter .nthview-cbig:empty{display:none}",
    ".nthview-hunter .nthview-clegend{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}",
    ".nthview-hunter .nthview-clegend:empty{display:none}",
    ".nthview-hunter .nthview-clegend button{border-radius:10px;padding:5px 9px;background:rgba(255,255,255,.1);border:1.5px solid rgba(255,255,255,.22);color:var(--hud-ink);font-weight:700;font-size:.84rem;line-height:1.2;min-height:34px;text-align:left;overflow-wrap:anywhere}",
    ".nthview-hunter .nthview-clegend button.nthview-ok{border-color:#6fe39b;background:rgba(80,200,120,.25)}",
    ".nthview-hunter .nthview-clegend button.nthview-no{border-color:#ff7a6a;background:rgba(230,70,50,.25)}",
    ".nthview-hunter .nthview-clegend button.nthview-lit{border-color:var(--gold);background:rgba(255,200,61,.22)}",
    ".nthview-hunter .nthview-cfb{margin-top:6px;font-size:.88rem;line-height:1.35}",
    ".nthview-hunter .nthview-cfb:empty{display:none}",
    ".nthview-hunter .nthview-cfb.nthview-ok{color:#8ff0b4}",
    ".nthview-hunter .nthview-cfb.nthview-no{color:#ffb4a8}",
    ".nthview-hunter .nthview-cact{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}",
    ".nthview-hunter .nthview-cact:empty{display:none}",
    ".nthview-hunter .nthview-cact button{border-radius:12px;padding:8px 14px;min-height:40px;font-weight:700;background:var(--gold);color:#1b1304;border:0}",
    ".nthview-hunter .nthview-callout :focus-visible{outline:3px solid #fff;outline-offset:2px}",
    /* labels over things in the room */
    ".nthview-hunter .nthview-labels{position:absolute;inset:0;pointer-events:none;z-index:4}",
    ".nthview-hunter .nthview-spot{position:absolute;transform:translate(-50%,0);pointer-events:auto;max-width:86px;padding:2px 6px;border-radius:9px;background:rgba(8,11,17,.82);color:#fff;border:1.5px solid rgba(255,255,255,.35);font-size:.68rem;font-weight:700;line-height:1.15;text-align:center;overflow-wrap:anywhere}",
    ".nthview-hunter .nthview-spot.nthview-ok{border-color:#6fe39b;background:rgba(20,90,50,.9)}",
    ".nthview-hunter .nthview-spot.nthview-no{border-color:#ff7a6a;background:rgba(120,30,20,.9)}",
    ".nthview-hunter .nthview-spot.nthview-lit{border-color:var(--gold);color:var(--gold)}",
    ".nthview-hunter .nthview-spot.nthview-gone{opacity:.35}",
    ".nthview-hunter .nthview-spot:focus-visible{outline:3px solid #fff;outline-offset:2px}",
    ".nthview-hunter .nthview-toast{position:absolute;left:50%;top:100px;transform:translate(-50%,0) scale(.92);opacity:0;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:9px 16px;transition:opacity .25s,transform .25s;max-width:calc(100% - 40px);text-align:center;font-weight:700;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
    ".nthview-hunter .nthview-toast.nthview-show{opacity:1;transform:translate(-50%,0) scale(1)}",
    /* the alarm banner and the guard guide */
    ".nthview-hunter .nthview-alarm{position:absolute;left:10px;right:10px;top:94px;display:flex;gap:10px;align-items:center;justify-content:center;background:rgba(190,24,16,.88);color:#fff;border:1px solid rgba(255,255,255,.35);border-radius:12px;padding:6px 12px;font-size:.84rem;line-height:1.25;animation:nthview-alarm .7s ease-in-out infinite alternate;pointer-events:none}",
    ".nthview-hunter .nthview-alarm b{font-family:var(--display);font-weight:900;letter-spacing:.14em}",
    "@keyframes nthview-alarm{from{background:rgba(190,24,16,.9)}to{background:rgba(120,10,6,.75)}}",
    ".nthview-hunter.nthview-alarmed .nthview-grade{background:radial-gradient(ellipse 75% 70% at 50% 46%,transparent 48%,rgba(150,0,0,.6) 100%)}",
    ".nthview-hunter.nthview-alarmed .nthview-toast{top:150px}",
    ".nthview-hunter .nthview-squad{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}",
    ".nthview-hunter .nthview-gchip{display:inline-flex;align-items:center;gap:6px;background:var(--panel-solid);border:1px solid var(--line);border-radius:999px;padding:3px 10px 3px 5px;font-size:.84rem;font-weight:700}",
    ".nthview-hunter .nthview-gchip.nthview-gboss{border-color:var(--gold)}",
    ".nthview-hunter .nthview-gdot{width:16px;height:16px;border-radius:50%;border:3px solid;flex:none;display:inline-block;vertical-align:-3px}",
    ".nthview-hunter .nthview-gline{margin:6px 0!important;font-size:.93rem}",
    ".nthview-hunter .nthview-gline .nthview-gdot{margin-right:7px}",
    "@media (prefers-reduced-motion:reduce){.nthview-hunter .nthview-alarm{animation:none}}",
    /* one-time powers */
    ".nthview-hunter .nthview-powers{position:absolute;left:0;right:0;bottom:max(12px,env(safe-area-inset-bottom));display:flex;justify-content:center;gap:10px;pointer-events:none}",
    ".nthview-hunter .nthview-power{pointer-events:auto;position:relative;width:54px;height:54px;border-radius:50%;background:rgba(8,11,17,.6);border:2px solid rgba(255,255,255,.4);color:#fff;display:grid;place-items:center;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);padding:0}",
    ".nthview-hunter .nthview-power i{position:absolute;right:-4px;top:-4px;min-width:20px;height:20px;border-radius:10px;background:var(--gold);color:#1b1304;font-size:.72rem;font-weight:900;font-style:normal;display:grid;place-items:center;padding:0 5px}",
    ".nthview-hunter .nthview-power.nthview-armed{border-color:var(--gold);background:rgba(255,200,61,.3);box-shadow:0 0 14px rgba(255,200,61,.6)}",
    ".nthview-hunter .nthview-power.nthview-passive{border-style:dashed;cursor:default}",
    ".nthview-hunter .nthview-power.nthview-psel{border-color:#fff;box-shadow:0 0 0 3px rgba(255,255,255,.35)}",
    ".nthview-hunter .nthview-power.nthview-psel.nthview-armed{border-color:var(--gold)}",
    "@media (max-width:400px){.nthview-hunter .nthview-powers{gap:6px}.nthview-hunter .nthview-power{width:46px;height:46px}}",
    ".nthview-hunter .nthview-hud :focus-visible,.nthview-hunter .nthview-powers :focus-visible{outline:3px solid #fff;outline-offset:2px;box-shadow:0 0 0 7px rgba(0,0,0,.6)}",
    "@media (max-width:680px){body:has(.nthview-lesson-bar) .nthview-hunter .nthview-powers{padding-right:64px}body:has(.nthview-lesson-bar) .nthview-hunter .nthview-panel{padding-bottom:calc(72px + env(safe-area-inset-bottom))}body:has(.nthview-lesson-bar) .nthview-hunter .nthview-overlay{padding-bottom:76px}body:has(.nthview-lesson-bar) .nthview-hunter .nthview-card .nthview-sticky{padding-right:76px}body:has(.nthview-lesson-bar) .nthview-hunter .nthview-callout{bottom:72px}}",
    /* gems fly from a takedown to the counter */
    ".nthview-hunter .nthview-gem{position:absolute;left:0;top:0;width:12px;height:12px;background:var(--gem);transform:rotate(45deg);border-radius:2px;box-shadow:0 0 8px var(--gem);pointer-events:none;z-index:6;opacity:0;will-change:transform,opacity}",
    ".nthview-hunter .nthview-grade{position:absolute;inset:0;pointer-events:none;z-index:3;background:radial-gradient(ellipse 75% 70% at 50% 46%,transparent 52%,rgba(0,0,0,.55) 100%)}",
    ".nthview-hunter .nthview-vignette{position:absolute;inset:0;pointer-events:none;z-index:4;opacity:0;background:radial-gradient(ellipse at center,transparent 45%,rgba(220,30,20,.75) 100%)}",
    ".nthview-hunter .nthview-vignette.nthview-hit{animation:nthview-hit .8s ease-out}",
    "@keyframes nthview-hit{0%{opacity:0}15%{opacity:1}100%{opacity:0}}",
    ".nthview-hunter .nthview-fade{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .35s;z-index:30}",
    ".nthview-hunter .nthview-fade.nthview-white{background:#fdfaf0}",
    ".nthview-hunter .nthview-fade.nthview-on{opacity:1}",
    ".nthview-hunter .nthview-prize{display:flex;gap:10px;align-items:center}",
    ".nthview-hunter .nthview-prize svg{flex:none;color:var(--accent-ink)}",
    /* bottom sheet */
    ".nthview-hunter .nthview-panel{position:absolute;left:0;right:0;bottom:0;max-height:64%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;background:var(--panel);color:var(--ink);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:22px 22px 0 0;border-top:3px solid var(--accent);padding:16px 18px calc(22px + env(safe-area-inset-bottom));box-shadow:0 -12px 40px rgba(0,0,0,.35);transform:translateY(calc(100% + 64px));visibility:hidden;transition:transform .38s cubic-bezier(.2,.8,.2,1),visibility 0s linear .38s;pointer-events:auto;user-select:text}",
    ".nthview-hunter .nthview-panel.nthview-open{transform:none;visibility:visible;transition:transform .38s cubic-bezier(.2,.8,.2,1),visibility 0s}",
    ".nthview-hunter .nthview-panel:focus{outline:none}",
    ".nthview-hunter .nthview-panel.nthview-compact{max-height:52%}",
    "@media (max-height:560px){.nthview-hunter .nthview-panel{max-height:84%}.nthview-hunter .nthview-panel.nthview-compact{max-height:70%}}",
    "@media (min-width:700px) and (min-height:700px){.nthview-hunter .nthview-panel{bottom:16px;border-radius:22px;border:1px solid var(--line);border-top:3px solid var(--accent)}}",
    ".nthview-hunter .nthview-kicker{color:var(--muted);margin:0;font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}",
    ".nthview-hunter .nthview-panel h2,.nthview-hunter .nthview-card h2{font-family:var(--display);font-weight:700;font-size:1.65rem;line-height:1.1;margin:4px 0 10px;overflow-wrap:anywhere}",
    ".nthview-hunter .nthview-panel p,.nthview-hunter .nthview-card p{line-height:1.55;overflow-wrap:anywhere}",
    ".nthview-hunter .nthview-lead{font-size:1.06rem}",
    ".nthview-hunter .nthview-box{background:var(--chip);border:1px solid var(--line);border-radius:16px;padding:12px 14px;margin:14px 0}",
    ".nthview-hunter .nthview-box.nthview-task{border:2px solid var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--panel-solid))}",
    ".nthview-hunter .nthview-box-title{font-family:var(--display);font-weight:700;font-size:1.02rem;margin:0 0 8px}",
    ".nthview-hunter .nthview-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
    ".nthview-hunter .nthview-cap{font-size:.84rem;color:var(--muted);margin:10px 0 0}",
    ".nthview-hunter .nthview-readout{font-weight:700;font-size:1.04rem;margin-top:12px}",
    ".nthview-hunter .nthview-btn{background:var(--panel-solid);border:2px solid var(--accent);border-radius:14px;padding:11px 18px;font-weight:700;line-height:1.2;min-height:46px}",
    ".nthview-hunter .nthview-btn.nthview-primary{background:var(--accent);color:var(--on-accent);border-color:transparent}",
    ".nthview-hunter .nthview-btn:disabled{opacity:.45}",
    ".nthview-hunter .nthview-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;align-items:center}",
    ".nthview-hunter .nthview-keyhint{font-size:.8rem;color:var(--muted)}",
    ".nthview-hunter .nthview-legend{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:8px 0}",
    ".nthview-hunter .nthview-legend span{border:2px solid var(--accent);border-radius:12px;padding:8px 6px;text-align:center;font-weight:700;background:var(--panel-solid);overflow-wrap:anywhere;min-height:2.8em}",
    ".nthview-hunter .nthview-legend span.nthview-empty{border-style:dashed;border-color:var(--line);color:var(--muted);font-weight:400}",
    ".nthview-hunter .nthview-legend small{display:block;font-size:.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-weight:700}",
    ".nthview-hunter .nthview-q{font-weight:700;font-size:1.06rem;margin:6px 0 10px}",
    ".nthview-hunter .nthview-opts{display:grid;gap:9px}",
    ".nthview-hunter .nthview-opts.nthview-two{grid-template-columns:1fr 1fr}",
    ".nthview-hunter .nthview-opt{text-align:left;background:var(--panel-solid);border:2px solid var(--line);border-radius:14px;padding:13px 15px;line-height:1.35;min-height:52px;box-shadow:0 3px 0 var(--line);transition:transform .08s,box-shadow .08s,border-color .15s;display:flex;align-items:center;gap:10px}",
    ".nthview-hunter .nthview-opt:hover:not(:disabled){border-color:var(--accent)}",
    ".nthview-hunter .nthview-opt:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 var(--line)}",
    ".nthview-hunter .nthview-opt[aria-pressed=true],.nthview-hunter .nthview-opt.nthview-sel{border-color:var(--accent);box-shadow:0 3px 0 var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--panel-solid))}",
    ".nthview-hunter .nthview-opt.nthview-right{border-color:var(--ok);box-shadow:0 3px 0 var(--ok);background:color-mix(in srgb,var(--ok) 15%,var(--panel-solid))}",
    ".nthview-hunter .nthview-opt.nthview-wrong{border-color:var(--no);box-shadow:0 3px 0 var(--no);background:color-mix(in srgb,var(--no) 10%,var(--panel-solid))}",
    ".nthview-hunter .nthview-opt:disabled.nthview-wrong{opacity:.65;text-decoration:line-through}",
    ".nthview-hunter .nthview-opt.nthview-center{justify-content:center;text-align:center;font-family:var(--display);font-weight:700;font-size:1.15rem;min-height:72px}",
    ".nthview-hunter .nthview-tick{width:24px;height:24px;border-radius:7px;border:2px solid var(--line);flex:none;display:grid;place-items:center;font-weight:900;font-size:.9rem}",
    ".nthview-hunter .nthview-opt[aria-pressed=true] .nthview-tick{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}",
    ".nthview-hunter .nthview-fb{margin-top:12px;line-height:1.5}",
    ".nthview-hunter .nthview-fb.nthview-ok{color:var(--ok);font-weight:700}",
    ".nthview-hunter .nthview-fb.nthview-no{color:var(--no)}",
    ".nthview-hunter .nthview-fb .nthview-reveal{display:block;margin-top:6px;color:var(--ink);font-weight:700}",
    ".nthview-hunter .nthview-remember{border:2px solid var(--accent);border-radius:16px;padding:12px 14px;margin-top:14px}",
    ".nthview-hunter .nthview-stars{font-size:1.5rem;color:var(--star);letter-spacing:2px;margin:0 0 4px}",
    ".nthview-hunter .nthview-num{width:28px;height:28px;border-radius:50%;background:var(--chip);border:1.5px solid var(--line);display:grid;place-items:center;font-weight:800;flex:none;font-size:.9rem}",
    ".nthview-hunter .nthview-opt[aria-pressed=true] .nthview-num{background:var(--accent);color:var(--on-accent);border-color:transparent}",
    ".nthview-hunter .nthview-note{display:block;font-size:.84rem;color:var(--muted)}",
    ".nthview-hunter .nthview-txt{flex:1;min-width:0;overflow-wrap:anywhere}",
    ".nthview-hunter .nthview-seq{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px;min-height:34px}",
    ".nthview-hunter .nthview-slot{border:2px dashed var(--line);border-radius:10px;padding:5px 10px;font-size:.88rem;min-width:44px;text-align:center}",
    ".nthview-hunter .nthview-slot.nthview-filled{border-style:solid;border-color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--panel-solid));font-weight:700}",
    ".nthview-hunter .nthview-chips{display:flex;flex-wrap:wrap;gap:6px}",
    ".nthview-hunter .nthview-chip{border:2px solid var(--line);background:var(--panel-solid);border-radius:999px;padding:7px 13px;font-weight:700;font-size:.9rem;min-height:38px}",
    ".nthview-hunter .nthview-chip[aria-pressed=true]{background:var(--accent);border-color:transparent;color:var(--on-accent)}",
    ".nthview-hunter .nthview-chip.nthview-right{border-color:var(--ok)}",
    ".nthview-hunter .nthview-chip.nthview-wrong{border-color:var(--no)}",
    ".nthview-hunter .nthview-cols{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".nthview-hunter .nthview-badge{display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:50%;background:var(--accent);color:var(--on-accent);font-weight:800;font-size:.8rem;flex:none}",
    ".nthview-hunter .nthview-bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-top:10px}",
    ".nthview-hunter .nthview-bin{border:2px dashed var(--line);border-radius:14px;padding:10px;min-height:76px;text-align:center;background:var(--panel-solid);display:flex;flex-direction:column;gap:4px;align-items:center}",
    ".nthview-hunter .nthview-bin b{font-family:var(--display)}",
    ".nthview-hunter .nthview-bin.nthview-target{border-style:solid;border-color:var(--accent)}",
    ".nthview-hunter .nthview-stamp{display:inline-block;background:var(--chip);border-radius:8px;padding:2px 8px;font-size:.82rem}",
    ".nthview-hunter .nthview-stamp.nthview-right{outline:2px solid var(--ok)}",
    ".nthview-hunter .nthview-stamp.nthview-wrong{outline:2px solid var(--no)}",
    ".nthview-hunter .nthview-cloze{line-height:2.1;font-size:1.05rem;margin:4px 0}",
    ".nthview-hunter .nthview-gap{display:inline-block;min-width:4.5em;border-bottom:3px solid var(--accent);padding:0 6px;text-align:center;font-weight:700;border-radius:4px 4px 0 0;background:color-mix(in srgb,var(--accent) 10%,transparent)}",
    ".nthview-hunter .nthview-gap.nthview-active{background:color-mix(in srgb,var(--accent) 30%,transparent)}",
    ".nthview-hunter .nthview-gap.nthview-right{border-color:var(--ok)}",
    ".nthview-hunter .nthview-gap.nthview-wrong{border-color:var(--no)}",
    ".nthview-hunter .nthview-gaprow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0}",
    ".nthview-hunter .nthview-gaprow>span{font-size:.82rem;color:var(--muted);min-width:3.6em}",
    ".nthview-hunter .nthview-range{width:100%;accent-color:var(--accent);height:34px}",
    ".nthview-hunter .nthview-bignum{font-family:var(--display);font-weight:700;font-size:2.2rem;text-align:center;line-height:1.1}",
    ".nthview-hunter .nthview-input{font:inherit;font-size:1.1rem;width:100%;border:2px solid var(--line);border-radius:12px;padding:11px 13px;background:var(--panel-solid);color:inherit}",
    ".nthview-hunter .nthview-input:focus{border-color:var(--accent);outline:none}",
    ".nthview-hunter .nthview-input.nthview-wrong{border-color:var(--no)}",
    ".nthview-hunter .nthview-input.nthview-right{border-color:var(--ok)}",
    ".nthview-hunter .nthview-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}",
    ".nthview-hunter .nthview-keys button{border:2px solid var(--line);background:var(--panel-solid);border-radius:12px;min-height:46px;font-weight:700;font-size:1.1rem}",
    ".nthview-hunter .nthview-frow{margin:10px 0}",
    ".nthview-hunter .nthview-flabel{font-size:.93rem;margin-bottom:4px}",
    ".nthview-hunter .nthview-fline{display:flex;align-items:center;gap:10px}",
    ".nthview-hunter .nthview-track{flex:1;height:14px;border-radius:7px;background:color-mix(in srgb,var(--ink) 10%,transparent);position:relative}",
    ".nthview-hunter .nthview-track .nthview-bar{height:100%;border-radius:7px;background:var(--accent);transition:width 1.2s ease-out;width:0}",
    ".nthview-hunter .nthview-bar.nthview-grey{background:#a29a8c}",
    ".nthview-hunter .nthview-bar.nthview-dashed{background:repeating-linear-gradient(90deg,var(--accent) 0 9px,transparent 9px 15px)}",
    ".nthview-hunter .nthview-track .nthview-mark{position:absolute;top:-5px;height:24px;width:4px;border-radius:2px;background:var(--ok);transform:translateX(-50%);box-shadow:0 0 0 2px var(--panel-solid)}",
    ".nthview-hunter .nthview-fline b{min-width:5.4ch;text-align:right}",
    ".nthview-hunter .nthview-stepper{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0}",
    ".nthview-hunter .nthview-stepper .nthview-ctl{display:flex;align-items:center;gap:10px}",
    ".nthview-hunter .nthview-stepper button{width:44px;height:44px;border-radius:12px;border:2px solid var(--line);background:var(--panel-solid);font-size:1.3rem;font-weight:700}",
    ".nthview-hunter .nthview-stepper b{min-width:2ch;text-align:center;font-size:1.35rem}",
    ".nthview-hunter .nthview-pile{font-size:1.2rem;letter-spacing:2px;line-height:1.4;min-height:1.4em;margin-top:6px;word-break:break-all}",
    ".nthview-hunter .nthview-gridvis{display:grid;gap:4px;margin-top:8px;justify-content:start}",
    ".nthview-hunter .nthview-gridvis i{width:16px;height:16px;border-radius:4px;background:var(--accent);display:block}",
    ".nthview-hunter .nthview-story{display:grid;gap:8px;margin-top:10px}",
    ".nthview-hunter .nthview-story p{margin:0;padding:10px 12px;border-radius:12px;background:var(--panel-solid);border:1px solid var(--line);animation:nthview-in .35s ease-out}",
    "@keyframes nthview-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".nthview-hunter .nthview-sw{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)}",
    ".nthview-hunter .nthview-toggle{width:56px;height:32px;border-radius:16px;border:0;background:#a29a8c;position:relative;flex:none;padding:0}",
    ".nthview-hunter .nthview-toggle::after{content:\"\";position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}",
    ".nthview-hunter .nthview-toggle[aria-checked=true]{background:var(--accent)}",
    ".nthview-hunter .nthview-toggle[aria-checked=true]::after{transform:translateX(24px)}",
    ".nthview-hunter .nthview-lamp{display:inline-block;width:12px;height:12px;border-radius:50%;background:#a29a8c;margin-right:8px;vertical-align:middle}",
    ".nthview-hunter .nthview-lamp.nthview-ok{background:var(--ok);box-shadow:0 0 8px var(--ok)}",
    ".nthview-hunter .nthview-lamp.nthview-no{background:var(--no);box-shadow:0 0 8px var(--no)}",
    ".nthview-hunter .nthview-lamp.nthview-note{background:var(--gold);box-shadow:0 0 8px var(--gold)}",
    ".nthview-hunter .nthview-seg{display:inline-flex;flex-wrap:wrap;gap:5px}",
    ".nthview-hunter .nthview-seg button{border:2px solid var(--line);background:var(--panel-solid);border-radius:10px;padding:7px 12px;font-size:.88rem;font-weight:700;min-height:38px}",
    ".nthview-hunter .nthview-seg button[aria-pressed=true]{background:var(--accent);border-color:transparent;color:var(--on-accent)}",
    ".nthview-hunter .nthview-card3{perspective:900px;margin-top:10px}",
    ".nthview-hunter .nthview-flip{position:relative;min-height:150px;transition:transform .5s;transform-style:preserve-3d}",
    ".nthview-hunter .nthview-flip.nthview-flipped{transform:rotateY(180deg)}",
    ".nthview-hunter .nthview-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:grid;place-items:center;text-align:center;padding:16px;border-radius:16px;background:var(--panel-solid);border:2px solid var(--accent);font-family:var(--display);font-weight:700;font-size:1.2rem;overflow:auto}",
    ".nthview-hunter .nthview-face.nthview-back{transform:rotateY(180deg);font-family:var(--body);font-weight:400;font-size:1rem}",
    ".nthview-hunter .nthview-padsgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px}",
    ".nthview-hunter .nthview-padcard{flex-direction:column;justify-content:flex-end;text-align:center;min-height:150px;padding:10px}",
    ".nthview-hunter .nthview-padvis{display:flex;align-items:flex-end;justify-content:center;gap:6px;height:84px;width:100%}",
    ".nthview-hunter .nthview-padvis i{display:block;width:18px;border-radius:4px 4px 0 0;background:var(--accent)}",
    ".nthview-hunter .nthview-padvis i.nthview-grey{background:#a29a8c}",
    ".nthview-hunter .nthview-padvis svg{display:block}",
    ".nthview-hunter .nthview-padname{font-family:var(--display);font-weight:700}",
    ".nthview-hunter .nthview-diagram{width:100%;height:auto;display:block;border-radius:14px;background:var(--panel-solid);border:1px solid var(--line);touch-action:manipulation}",
    ".nthview-hunter .nthview-diagram .nthview-part{cursor:pointer;transition:opacity .2s}",
    ".nthview-hunter .nthview-diagram .nthview-part:focus{outline:none}",
    ".nthview-hunter .nthview-diagram .nthview-part:focus-visible .nthview-shape,.nthview-hunter .nthview-diagram .nthview-part:hover .nthview-shape{stroke:var(--accent);stroke-width:1.2}",
    ".nthview-hunter .nthview-diagram .nthview-part.nthview-dim{opacity:.35}",
    ".nthview-hunter .nthview-diagram .nthview-part.nthview-right .nthview-shape{stroke:var(--ok);stroke-width:1.6}",
    ".nthview-hunter .nthview-diagram text{font:700 3.2px var(--body);pointer-events:none}",
    ".nthview-hunter .nthview-conf{margin-top:12px}",
    /* overlays */
    ".nthview-hunter .nthview-overlay{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;padding:16px 12px;background:rgba(8,6,4,.42);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);overflow-y:auto;pointer-events:auto}",
    ".nthview-hunter .nthview-card{background:var(--panel-solid);color:var(--ink);border-radius:22px;padding:22px 22px 24px;max-width:560px;width:100%;margin:auto 0;flex:none;box-shadow:0 20px 60px rgba(0,0,0,.4);border-top:4px solid var(--accent);user-select:text}",
    ".nthview-hunter .nthview-card h1{font-family:var(--display);font-weight:900;font-size:clamp(2rem,8.5vw,3.2rem);line-height:1;letter-spacing:.01em;margin:0 0 12px;overflow-wrap:anywhere}",
    ".nthview-hunter .nthview-big{font-size:1.06rem}",
    /* the intro is long on a phone: keep Start in reach while the story scrolls */
    ".nthview-hunter .nthview-card .nthview-sticky{position:sticky;bottom:0;z-index:1;background:var(--panel-solid);margin:16px -22px -24px;padding:12px 22px 16px;border-radius:0 0 22px 22px;box-shadow:0 -12px 14px -12px rgba(0,0,0,.3)}",
    ".nthview-hunter .nthview-card ol,.nthview-hunter .nthview-card ul,.nthview-hunter .nthview-panel ul{padding-left:1.3rem;line-height:1.5}",
    ".nthview-hunter .nthview-card li,.nthview-hunter .nthview-panel li{margin:6px 0}",
    ".nthview-hunter .nthview-small{font-size:.88rem;color:var(--muted)}",
    ".nthview-hunter .nthview-scorecard{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 6px}",
    ".nthview-hunter .nthview-scorecard div{flex:1;min-width:96px;background:var(--chip);border:1px solid var(--line);border-radius:14px;padding:10px 12px;font-size:.85rem}",
    ".nthview-hunter .nthview-scorecard b{display:block;font-family:var(--display);font-size:1.45rem;white-space:nowrap}",
    "@media (max-width:480px){.nthview-hunter .nthview-scorecard div{min-width:calc(50% - 5px)}}",
    ".nthview-hunter .nthview-results{list-style:none;padding:0!important;margin:8px 0}",
    ".nthview-hunter .nthview-results li{display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--line);margin:0!important}",
    ".nthview-hunter .nthview-results .nthview-rs{color:var(--star);white-space:nowrap;font-size:.95rem;min-width:3.4em}",
    ".nthview-hunter .nthview-results .nthview-rt{flex:1;min-width:0}",
    ".nthview-hunter details.nthview-more{margin:12px 0;border:1px solid var(--line);border-radius:14px;padding:8px 12px;background:var(--chip)}",
    ".nthview-hunter details.nthview-more summary{cursor:pointer;font-weight:700;padding:4px 0}",
    ".nthview-hunter table.nthview-t{border-collapse:collapse;width:100%;font-size:.93rem;margin-top:8px}",
    ".nthview-hunter table.nthview-t th,.nthview-hunter table.nthview-t td{padding:7px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}",
    ".nthview-hunter .nthview-menu{display:grid;gap:10px;margin-top:12px}",
    ".nthview-hunter .nthview-menu .nthview-btn{width:100%}",
    ".nthview-hunter a{color:var(--accent-ink)}",
    "@media (prefers-reduced-motion:reduce){.nthview-hunter .nthview-panel,.nthview-hunter .nthview-toast,.nthview-hunter .nthview-track .nthview-bar,.nthview-hunter .nthview-flip,.nthview-hunter .nthview-toggle::after,.nthview-hunter .nthview-callout{transition:none}.nthview-hunter .nthview-vignette.nthview-hit,.nthview-hunter .nthview-hstats span.nthview-bump{animation-duration:.01s}}"
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
      el("p", { text: "The rooms are drawn with WebGL, which this browser has turned off or does not support." }),
      el("p", { text: "Turn on hardware acceleration in the browser settings, or open this file in another browser, then reload." })
    ]));
  }

  // ---- progress storage (identical in every view, §5.5) ------------------
  var STORE_VERSION = 1;
  function storageKey(data) {
    var s = JSON.stringify(data), h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return "nthview:hunter:" + (h >>> 0).toString(36);
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
  var THEMES = ["warehouse", "bunker", "lab", "rooftop"];
  var ROOMS = ["corridors", "pillars", "offices", "yard"];
  var BOSSES = ["sentinel", "sprinter", "brute", "warden"];
  var REWARDS = ["sprint", "knife", "smoke", "vest", "grenade", "pot"];
  var PANEL_SCORED = ["choice", "truefalse", "multi", "cloze", "order", "match", "sort", "rank", "estimate", "number", "text", "odd", "hotspot", "pads", "predict", "confidence"];
  var PANEL_EXPLORE = ["compare", "bars", "switches", "flashcards", "story", "tune", "race"];
  var ROOM_SCORED = ["lanes", "gates", "torches", "planks", "harvest", "levers", "tiles"];
  var ROOM_TYPES = ROOM_SCORED.concat(["collect"]);
  var SOLDIERS = ["rookie", "rifleman", "scout", "blade", "sniper", "heavy", "shield", "officer", "drone", "medic", "prowler"];
  /* every kind of guard: how he looks and how he behaves. Speeds are cells per second, times seconds, angles radians.
     speed: patrol; run: chasing; half and range: the flashlight; react: how long the hunter may stay in the light
     before the guard strikes; search: how long he looks around once he has lost the hunter; probes: extra places he checks */
  var GUARD = {
    rookie: { name: "Rookie", line: "A recruit with a pistol. Slow to react and quick to give up the chase.", body: 0x8fa6c8, trim: 0xf2f5fa, gear: 0x3b4a66, ring: 0x8fc0ff, head: "cap", weapon: "pistol", scale: .94, speed: 1.05, run: 2.0, half: .42, range: 2.9, react: .95, search: 2.2, probes: 0, turn: 3 },
    rifleman: { name: "Rifleman", line: "The regular guard: a steady light and a steady aim.", body: 0x2f4575, trim: 0x9fb4e0, gear: 0x566587, ring: 0x5f86ff, head: "helmet", weapon: "rifle", scale: 1, speed: 1.25, run: 2.5, half: .48, range: 3.4, react: .6, search: 3.2, probes: 1, turn: 3.4 },
    scout: { name: "Scout", line: "Light and quick. He runs fast and keeps searching for a long time.", body: 0x4f9a4a, trim: 0xd23c3c, gear: 0x2f5a2c, ring: 0x6fe06a, head: "bandana", weapon: "smg", scale: .96, speed: 1.8, run: 3.3, half: .38, range: 3.0, react: .55, search: 3.4, probes: 2, turn: 5 },
    blade: { name: "Blade", line: "No gun, only a sword and a lantern. Very fast: he must reach you to strike, so never let him.", body: 0x1b1c25, trim: 0xd61f3a, gear: 0x0f1016, ring: 0xff3355, head: "hood", weapon: "sword", scale: 1, speed: 1.5, run: 4.2, half: .95, range: 2.2, react: .35, search: 2.8, probes: 1, turn: 6, melee: true, cone: 0xffb060 },
    sniper: { name: "Sniper", line: "A long, thin beam that reaches across the room. He aims slowly and walks slowly.", body: 0x5a6634, trim: 0x8a9550, gear: 0x39411f, ring: 0xb7d94a, head: "boonie", weapon: "longrifle", scale: 1, speed: .8, run: 1.5, half: .2, range: 6.5, react: .8, search: 3, probes: 0, turn: 2, cone: 0xd8ffb0, pauseMul: 3 },
    heavy: { name: "Heavy", line: "Armoured and slow. He needs two hits: strike, get out of sight, strike again.", body: 0x4b4f58, trim: 0xff8a1f, gear: 0x2a2d33, ring: 0xff9a3a, head: "heavy", weapon: "minigun", scale: 1.2, speed: .85, run: 1.7, half: .6, range: 3.6, react: .5, search: 3, probes: 0, turn: 2.4, hp: 2 },
    shield: { name: "Shield", line: "His shield stops any attack from the front. Get behind him.", body: 0x1e63b0, trim: 0x9fd0ff, gear: 0x123a66, ring: 0x4aa8ff, head: "visor", weapon: "pistol", scale: 1.04, speed: 1.0, run: 2.2, half: .5, range: 3.2, react: .6, search: 3, probes: 1, turn: 2.8, frontProof: true },
    officer: { name: "Officer", line: "Blows the alarm the moment he sees you, and every guard comes running.", body: 0x24242c, trim: 0xe0b23c, gear: 0x8a1c1c, ring: 0xffd24a, head: "peaked", weapon: "pistol", scale: 1.02, speed: 1.1, run: 2.3, half: .5, range: 3.4, react: .5, search: 3.4, probes: 1, turn: 3.4, alarm: true },
    drone: { name: "Drone", line: "A flying camera with a round light. It cannot shoot, but it raises the alarm.", body: 0xdfe5ec, trim: 0xff3b30, gear: 0x444b57, ring: 0x58e0ff, head: "none", weapon: "none", scale: 1, speed: 1.5, run: 3.0, half: Math.PI, range: 1.7, react: .45, search: 3, probes: 2, turn: 8, alarm: true, drone: true, noGun: true, cone: 0x8fe8ff },
    prowler: { name: "Prowler", line: "The toughest soldier: a sprinter who turns round at any moment, whips about when he searches, and runs almost as fast as you. Break his line of sight early.", body: 0xf2d21b, trim: 0x15171b, gear: 0x15171b, ring: 0xfff04a, head: "band", weapon: "smg", scale: .98, legs: 0x15171b, speed: 2.3, run: 4.7, half: .46, range: 3.4, react: .35, search: 3.8, probes: 3, turn: 9, jumpy: true, track: 1.5 },
    medic: { name: "Medic", line: "Wakes fallen guards. Deal with him first.", body: 0xf0f2f4, trim: 0x1fbf8f, gear: 0xc9d2d8, ring: 0x3fe0b0, head: "cap", weapon: "pistol", scale: .98, speed: 1.3, run: 2.4, half: .45, range: 3.0, react: .75, search: 2.6, probes: 1, turn: 3.4, medic: true }
  };
  /* the four bosses: larger, with a gold star, and every one of them raises the alarm */
  var BOSS = {
    sentinel: { name: "The Sentinel", line: "His searchlight is twice as wide and reaches much further. Come at him from directly behind.", body: 0xb8321f, trim: 0xffc83d, gear: 0x5a1a10, ring: 0xffb020, head: "helmet", weapon: "rifle", lamp: true, scale: 1.3, speed: 1.05, run: 2.3, half: .98, range: 5.0, react: .45, search: 3.5, probes: 1, turn: 2.6, alarm: true, cone: 0xffe2a8 },
    sprinter: { name: "The Sprinter", line: "He patrols at double speed and turns round without warning. Strike just after he turns away.", body: 0xe0661a, trim: 0xffc83d, gear: 0x6b2c08, ring: 0xffb020, head: "bandana", weapon: "smg", scale: 1.26, speed: 2.6, run: 3.6, half: .5, range: 3.4, react: .4, search: 3, probes: 2, turn: 6.5, alarm: true, cone: 0xffe2a8 },
    brute: { name: "The Brute", line: "He takes two hits. The first one staggers him, then he sweeps his light in a full circle: hit, hide, hit again.", body: 0x3a2a2a, trim: 0xffc83d, gear: 0x8a1c1c, ring: 0xffb020, head: "heavy", weapon: "minigun", scale: 1.42, speed: .95, run: 1.9, half: .62, range: 3.7, react: .45, search: 3, probes: 0, turn: 2.8, hp: 2, alarm: true, cone: 0xffe2a8 },
    warden: { name: "The Warden", line: "A shield protects him while any soldier still stands. Take down every soldier first.", body: 0x4a2f8a, trim: 0xffc83d, gear: 0x2a1a55, ring: 0xffb020, head: "peaked", weapon: "pistol", scale: 1.3, speed: 1.15, run: 2.4, half: .56, range: 3.9, react: .4, search: 3.2, probes: 1, turn: 3, alarm: true, cone: 0xffe2a8 }
  };
  var BOSS_INFO = BOSS;
  /* the squad a block gets when it names none: easy kinds first, the special ones later in the game */
  function defaultSquad(i, n, seed) {
    var pool = i === 0 ? ["rookie", "rookie", "rookie", "rifleman"] : ["rookie", "rifleman", "rifleman"], rnd = seeded("squad:" + seed), out = [], count = {}, cap = { officer: 1, drone: 1, medic: 1, heavy: 1, sniper: 1, prowler: 1, blade: 2, shield: 2 };
    if (i >= 1) pool.push("rifleman", "scout");
    if (i >= 2) pool.push("blade", "shield");
    if (i >= 3) pool.push("sniper", "medic");
    if (i >= 4) pool.push("heavy", "officer", "drone");
    if (i >= 5) pool.push("prowler");
    if (i >= 6) pool = pool.slice(2);
    for (var t = 0; out.length < n && t < 200; t++) {
      var k = pool[Math.floor(rnd() * pool.length)];
      if (cap[k] && (count[k] || 0) >= cap[k]) continue;
      if (i >= 2 && out.length === n - 1 && out.every(function (x) { return x === "rookie" || x === "rifleman"; }) && (k === "rookie" || k === "rifleman") && t < 150) continue;
      count[k] = (count[k] || 0) + 1; out.push(k);
    }
    while (out.length < n) out.push("rifleman");
    return out;
  }
  var POWER_INFO = {
    sprint: { name: "Sprint", help: "Double speed for six seconds.", icon: "M13 2 4 14h6l-1 8 9-12h-6z" },
    knife: { name: "Throwing knife", help: "Flies at the guard you are facing, or else the nearest one in plain sight, and takes him down from a distance.", icon: "M21 3 9 12l3 3zM8 13l-5 5 3 3 5-5z" },
    smoke: { name: "Smoke grenade", help: "Tap it, then tap where it should land; Space throws it ahead of you. For six seconds nobody sees into the smoke or through it.", icon: "M7 18a4 4 0 0 1-.6-7.9A5 5 0 0 1 16 8.5a4.5 4.5 0 0 1 1 8.9V18z" },
    vest: { name: "Vest", help: "Worn at once: it takes the next hit for you.", icon: "M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" },
    grenade: { name: "Grenade", help: "Flies at the guard you are facing, or else the nearest one in plain sight, and takes down everyone near the blast. It is loud: the rest come to look.", icon: "M10 2h5v2h-1.5v2.2a7 7 0 1 1-3 0V4H10zM12 9a5 5 0 1 0 0 10 5 5 0 0 0 0-10z" },
    pot: { name: "Flower pot", help: "Stand still disguised as a flower pot for eight seconds. Lights pass over you; moving or striking ends it.", icon: "M12 2c1.7 0 3 1.3 3 3 0 .5-.1 1-.4 1.4.4-.2.9-.4 1.4-.4 1.7 0 3 1.3 3 3s-1.3 3-3 3h-3v2h5l-1.5 8h-9L6 14h5v-2H8c-1.700 0-3-1.300-3-3s1.300-3 3-3c.5 0 1 .1 1.400.4C9.100 6 9 5.500 9 5c0-1.700 1.300-3 3-3z" }
  };
  var TYPE_HELP = {
    lanes: "Walk to the crate with the right answer.",
    gates: "Walk through the archway with the right answer.",
    torches: "Step on a lamp to switch it on or off. Light only the ones that belong, then check.",
    planks: "For each statement, step on the True plate or the False plate.",
    harvest: "Pick up the badges that belong and leave the rest, then say you are done.",
    levers: "Step on the floor switches in the right order.",
    tiles: "Carry each file to the bin of its group.",
    collect: "Walk over every token to collect it."
  };
  /* the room palette per theme: the game keeps these dark tones in both colour schemes */
  var WORLD = {
    warehouse: { void: 0x05070b, floorA: "#2b3342", floorB: "#313a4b", grout: "#141922", wallTop: "#8792a8", wallSide: "#4a556b", wallBase: "#2a3140", glowLine: "#ffb23e", crate: "#b47a36", crateDark: "#6f4517", crateLine: "#4d2e0d", barrel: "#3f6a8a", metal: "#59657a", door: "#56698f", hunter: 0x2a3650, sash: 0x2fe0c4, sky: 0x9fb4d8, ground: 0x232a38, sun: 0xcfdcff, accent: 0xffb23e },
    bunker: { void: 0x060804, floorA: "#333a2a", floorB: "#3a4230", grout: "#191d13", wallTop: "#b9af8d", wallSide: "#6a6347", wallBase: "#3a3626", glowLine: "#c8f060", crate: "#62732e", crateDark: "#3a4718", crateLine: "#222b0c", barrel: "#7a4a2a", metal: "#6b6a55", door: "#7a8052", hunter: 0x2c3620, sash: 0xffb23e, sky: 0xc9cfa8, ground: 0x2a2f22, sun: 0xfff0cc, accent: 0xc8f060 },
    lab: { void: 0x03080a, floorA: "#22424a", floorB: "#284c55", grout: "#0f2227", wallTop: "#dde9ec", wallSide: "#8ba3a9", wallBase: "#4f666b", glowLine: "#5fe0d6", crate: "#2f86cf", crateDark: "#1b5890", crateLine: "#dff0ff", barrel: "#d8dde2", metal: "#7f979d", door: "#8fb0b6", hunter: 0x1d3238, sash: 0xff5fa2, sky: 0xcfeef2, ground: 0x1d3338, sun: 0xe6fbff, accent: 0x5fe0d6 },
    rooftop: { void: 0x03030a, floorA: "#262842", floorB: "#2c2e4c", grout: "#12132a", wallTop: "#a5766a", wallSide: "#6a433b", wallBase: "#3a2420", glowLine: "#b0a2ff", crate: "#8f96a8", crateDark: "#565d6e", crateLine: "#2b2f3a", barrel: "#b0463a", metal: "#6d7386", door: "#7d6690", hunter: 0x282850, sash: 0xffd23e, sky: 0x8f96d8, ground: 0x1f2036, sun: 0xcfc8ff, accent: 0xb0a2ff }
  };
  /* text with **bold** -> fragment of text and <b> nodes; never innerHTML */
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
  /* typed answers are compared case- and space-insensitively, ignoring punctuation (identical copy in scripts/validate.js) */
  function normText(s) {
    return String(s).toLowerCase().replace(/[.,;:!?'"()\[\]]/g, " ").replace(/\s+/g, " ").trim();
  }

  // ---- expression compiler (identical copy lives in scripts/validate.js) --
  function compileExpr(src) {
    if (typeof src !== "string" || !src.trim()) return { error: "empty expression" };
    var re = /\s*(?:(\d+(?:\.\d+)?)|([a-z][a-z0-9]*)|(==|!=|<=|>=|&&|\|\||[-+*\/%()<>!]))/y;
    var toks = [], pos = 0, m;
    while (pos < src.length) {
      re.lastIndex = pos; m = re.exec(src);
      if (!m) { if (/^\s*$/.test(src.slice(pos))) break; return { error: "unexpected character \"" + src[pos] + "\"" }; }
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
      if (t.t === "id") { i++; if (ids.indexOf(t.v) === -1) ids.push(t.v); return function (env) { return env[t.v]; }; }
      if (eat("(")) { var e = orExpr(); if (!eat(")")) throw new Error("missing )"); return e; }
      throw new Error("unexpected \"" + t.v + "\"");
    }
    function unary() {
      if (eat("!")) { var a = unary(); return function (env) { return a(env) ? 0 : 1; }; }
      if (eat("-")) { var b = unary(); return function (env) { return -b(env); }; }
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
      "==": function (a, b) { return a === b ? 1 : 0; }, "!=": function (a, b) { return a !== b ? 1 : 0; },
      "<": function (a, b) { return a < b ? 1 : 0; }, "<=": function (a, b) { return a <= b ? 1 : 0; },
      ">": function (a, b) { return a > b ? 1 : 0; }, ">=": function (a, b) { return a >= b ? 1 : 0; }
    });
    var and = bin(cmp, { "&&": function (a, b) { return a && b ? 1 : 0; } });
    var orExpr = bin(and, { "||": function (a, b) { return a || b ? 1 : 0; } });
    try {
      var fn = orExpr();
      if (i < toks.length) throw new Error("unexpected \"" + toks[i].v + "\"");
      return { fn: fn, ids: ids };
    } catch (e) { return { error: e.message }; }
  }
  function evalExpr(src, env) { var c = compileExpr(src); return c.fn ? c.fn(env) : 0; }

  // ---- room generator: pure and deterministic, so a restart is the same room ----
  /* cells are 1 m squares centred on whole numbers; 0 floor, 1 wall, 2 crate */
  var GW = 11, GH = 21, START_X = 5, START_Z = GH - 2, DOOR_X = 5, ZR = GH - 6;   /* guards never patrol below row ZR, so the way in is quiet */
  function makeRoom(seed, style, nGuards) {
    for (var attempt = 0; attempt < 40; attempt++) {
      var r = tryRoom(seed + ":" + attempt, style, nGuards);
      if (r) return r;
    }
    return tryRoom(seed, "open", nGuards);
  }
  function tryRoom(seed, style, nGuards) {
    var rnd = seeded(seed), g = new Uint8Array(GW * GH), x, z, i;
    function idx(cx, cz) { return cz * GW + cx; }
    function ri(a, b) { return a + Math.floor(rnd() * (b - a + 1)); }
    function reserved(cx, cz) { return (Math.abs(cx - START_X) <= 1 && cz >= START_Z - 1) || (Math.abs(cx - DOOR_X) <= 1 && cz === 1) || (cx === DOOR_X && cz === 2); }
    function set(cx, cz, v) { if (cx < 1 || cx > GW - 2 || cz < 1 || cz > GH - 2 || reserved(cx, cz)) return; g[idx(cx, cz)] = v; }
    function bar(x0, z0, w, h, v) { for (var a = 0; a < w; a++) for (var b = 0; b < h; b++) set(x0 + a, z0 + b, v); }
    function floor(cx, cz) { return cx >= 0 && cz >= 0 && cx < GW && cz < GH && g[idx(cx, cz)] === 0; }
    for (z = 0; z < GH; z++) for (x = 0; x < GW; x++) if (x === 0 || z === 0 || x === GW - 1 || z === GH - 1) g[idx(x, z)] = 1;

    if (style === "corridors") {
      [3, 6, 9, 12, 15].forEach(function (zr) {
        var mode = rnd(), g1 = ri(1, 3), g2 = ri(6, 8);
        for (x = 1; x <= 9; x++) {
          var gap = x === g1 || x === g1 + 1 || x === g2 || x === g2 + 1;
          if (mode < .22 && x > 5) gap = true; else if (mode < .44 && x < 5) gap = true;
          if (!gap) set(x, zr, 1);
        }
      });
      [1, 4, 7, 10, 13].forEach(function (zb) { if (rnd() < .6) set(ri(2, 8), zb + ri(0, 1), rnd() < .5 ? 1 : 2); });
    } else if (style === "pillars") {
      [3, 7, 11, 15].forEach(function (zr) {
        [2, 7].forEach(function (xb) { if (rnd() < .9) { bar(xb, zr, 2, 2, 1); if (rnd() < .25) set(xb === 2 ? 1 : 9, zr + ri(0, 1), 2); } });
      });
      [5, 9, 13].forEach(function (zr) { var q = rnd(); if (q < .55) bar(ri(4, 6), zr, 1, 2, 1); else if (q < .85) bar(4, zr, 3, 1, 1); });
    } else if (style === "offices") {
      [6, 11, 16].forEach(function (zr) { var a = ri(1, 3), b = ri(6, 8); for (x = 1; x <= 9; x++) if (!(x === a || x === a + 1 || x === b || x === b + 1)) set(x, zr, 1); });
      [[1, 5], [7, 10], [12, 15]].forEach(function (band) { var xv = ri(4, 6), gz = ri(band[0], band[1] - 1); for (z = band[0]; z <= band[1]; z++) if (z !== gz && z !== gz + 1) set(xv, z, 1); });
      for (i = 0; i < 5; i++) set(ri(1, 9), ri(2, GH - 5), 2);
    } else if (style === "yard") {
      var pieces = [[1, 1], [2, 1], [1, 2], [2, 2], [3, 1], [1, 3]], placed = 0, tries = 0;
      while (placed < 12 && tries++ < 120) {
        var pc = pieces[ri(0, pieces.length - 1)], px = ri(1, 10 - pc[0]), pz = ri(2, GH - 4 - pc[1]), ok = true;
        for (z = pz - 1; z <= pz + pc[1] && ok; z++) for (x = px - 1; x <= px + pc[0]; x++) if (x >= 1 && x <= 9 && z >= 1 && z <= GH - 2 && g[idx(x, z)]) { ok = false; break; }
        if (ok) { bar(px, pz, pc[0], pc[1], rnd() < .3 ? 1 : 2); placed++; }
      }
    }
    if (style !== "open" && style !== "yard") {
      var extra = ri(3, 5);
      for (i = 0; i < extra; i++) { x = ri(1, 9); z = ri(2, GH - 5); if (floor(x, z)) set(x, z, 2); }
    } else if (style === "open") {
      [[2, 4], [8, 4], [2, 10], [8, 10], [5, 7], [2, 15], [8, 15], [5, 13]].forEach(function (c) { set(c[0], c[1], 2); });
    }

    /* everything the hunter cannot reach becomes wall; the door must be reachable */
    var seen = new Uint8Array(GW * GH), stack = [idx(START_X, START_Z)], open = 0;
    seen[stack[0]] = 1;
    while (stack.length) {
      var c = stack.pop(), cx = c % GW, cz = (c - cx) / GW; open++;
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(function (d) { var nx = cx + d[0], nz = cz + d[1]; if (floor(nx, nz) && !seen[idx(nx, nz)]) { seen[idx(nx, nz)] = 1; stack.push(idx(nx, nz)); } });
    }
    if (!seen[idx(DOOR_X, 1)] || open < 90) return null;
    for (i = 0; i < g.length; i++) if (g[i] === 0 && !seen[i]) g[i] = 1;

    /* patrol candidates: straight runs of floor, and rings round a 2 x 2 block */
    var cands = [], s0;
    function line(x0, z0, x1, z1) {
      var len = Math.max(x1 - x0, z1 - z0) + 1, cut = len > 6 ? len - 6 : 0, off = cut ? ri(0, cut) : 0, cells = [], k;
      if (x1 > x0) { x0 += off; x1 = x0 + len - cut - 1; for (k = x0; k <= x1; k++) cells.push([k, z0]); }
      else { z0 += off; z1 = z0 + len - cut - 1; for (k = z0; k <= z1; k++) cells.push([x0, k]); }
      return { kind: "line", pts: [{ x: x0, z: z0 }, { x: x1, z: z1 }], cells: cells };
    }
    for (z = 1; z <= ZR; z++) { s0 = -1; for (x = 1; x <= GW - 1; x++) { if (floor(x, z)) { if (s0 < 0) s0 = x; } else { if (s0 >= 0 && x - s0 >= 4) cands.push(line(s0, z, x - 1, z)); s0 = -1; } } }
    for (x = 1; x <= 9; x++) { s0 = -1; for (z = 1; z <= ZR + 1; z++) { if (z <= ZR && floor(x, z)) { if (s0 < 0) s0 = z; } else { if (s0 >= 0 && z - s0 >= 4) cands.push(line(x, s0, x, z - 1)); s0 = -1; } } }
    for (z = 2; z <= ZR - 2; z++) for (x = 2; x <= 7; x++) {
      if (!(g[idx(x, z)] && g[idx(x + 1, z)] && g[idx(x, z + 1)] && g[idx(x + 1, z + 1)])) continue;
      var ring = [], okRing = true, a, b;
      for (b = z - 1; b <= z + 2 && okRing; b++) for (a = x - 1; a <= x + 2; a++) { if (a >= x && a <= x + 1 && b >= z && b <= z + 1) continue; if (!floor(a, b)) { okRing = false; break; } ring.push([a, b]); }
      if (okRing) cands.push({ kind: "loop", pts: [{ x: x - 1, z: z - 1 }, { x: x + 2, z: z - 1 }, { x: x + 2, z: z + 2 }, { x: x - 1, z: z + 2 }], cells: ring });
    }
    var order = [], chosen = [], j;
    for (i = 0; i < cands.length; i++) order.push(i);
    for (i = order.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); var t = order[i]; order[i] = order[j]; order[j] = t; }
    function near(cells, gap) {
      for (var q = 0; q < chosen.length; q++) for (var m = 0; m < chosen[q].cells.length; m++) for (var n = 0; n < cells.length; n++)
        if (Math.abs(chosen[q].cells[m][0] - cells[n][0]) <= gap && Math.abs(chosen[q].cells[m][1] - cells[n][1]) <= gap) return true;
      return false;
    }
    [2, 1].forEach(function (gap) {
      for (i = 0; i < order.length && chosen.length < nGuards; i++) { var cd = cands[order[i]]; if (chosen.indexOf(cd) === -1 && !near(cd.cells, gap)) chosen.push(cd); }
    });
    /* not enough runs: post sentries who stand and turn */
    for (i = 0; i < 60 && chosen.length < nGuards; i++) {
      x = ri(1, 9); z = ri(2, ZR);
      if (!floor(x, z) || near([[x, z]], 2)) continue;
      var dirs = [];
      if (floor(x + 1, z) && floor(x + 2, z)) dirs.push(0);
      if (floor(x, z + 1) && floor(x, z + 2)) dirs.push(Math.PI / 2);
      if (floor(x - 1, z) && floor(x - 2, z)) dirs.push(Math.PI);
      if (floor(x, z - 1) && floor(x, z - 2)) dirs.push(-Math.PI / 2);
      if (dirs.length >= 2) chosen.push({ kind: "sentry", pts: [{ x: x, z: z }], dirs: dirs, cells: [[x, z]] });
    }
    if (chosen.length < nGuards) return null;
    /* the boss takes the post nearest the door */
    var best = 0, bestZ = 1e9;
    chosen.forEach(function (r, k) { var s = 0; r.cells.forEach(function (cl) { s += cl[1]; }); s /= r.cells.length; if (s < bestZ) { bestZ = s; best = k; } });
    if (chosen.length) { var boss = chosen.splice(best, 1)[0]; chosen.unshift(boss); }
    chosen.forEach(function (r) { r.phase = rnd(); r.dir = rnd() < .5 ? 1 : -1; r.pause = .5 + rnd() * .8; r.seed = Math.floor(rnd() * 1e6); });

    /* places for the room trials: spread out so their labels do not collide */
    var spots = [], pool = [];
    for (z = 2; z <= ZR - 3; z++) for (x = 1; x <= 9; x++) if (floor(x, z) && !(x === DOOR_X && z <= 2)) pool.push([x, z]);   /* the task card covers the rows below */
    for (i = pool.length - 1; i > 0; i--) { j = Math.floor(rnd() * (i + 1)); var t2 = pool[i]; pool[i] = pool[j]; pool[j] = t2; }
    [[3, 2], [2, 2], [2, 1]].forEach(function (lim) {
      pool.forEach(function (pc2) {
        if (spots.length >= 12) return;
        for (var q = 0; q < spots.length; q++) if (Math.abs(spots[q].x - pc2[0]) < lim[0] && Math.abs(spots[q].z - pc2[1]) < lim[1]) return;
        spots.push({ x: pc2[0], z: pc2[1] });
      });
    });
    return { grid: g, routes: chosen, spots: spots, style: style };
  }

  function render(container, data) {
    var THREE = root.THREE, doc = root.document;
    var N = data.blocks.length;
    var STRICT = data.strictMode === true;
    var themeName = data.theme || "warehouse";
    var TH = WORLD[themeName];
    var START_PICKS = data.picks || 3;
    var hero = data.hunter.name, guardsName = data.guards.name;
    THEMES.forEach(function (k) { container.classList.remove("nthview-theme-" + k); });
    container.classList.add("nthview-hunter-game", "nthview-theme-" + themeName);
    var mqReduce = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)");
    var settings = { reduced: !!(mqReduce && mqReduce.matches), sound: true, lights: true };

    var BLOCKS = data.blocks.map(function (s, i) {
      var type = s.activity ? s.activity.type : null;
      return { idx: i, data: s, id: s.id, name: s.name, room: s.room || ROOMS[i % ROOMS.length], boss: s.boss || BOSSES[i % BOSSES.length],
        squad: s.squad || defaultSquad(i, s.soldiers || 3 + (i % 3), data.title + "|" + s.id), reward: s.reward || REWARDS[i % REWARDS.length], type: type, inRoom: !!type && ROOM_TYPES.indexOf(type) !== -1, color: s.color || null };
    });

    /* ---------- DOM scaffold ---------- */
    var svgNS = "http://www.w3.org/2000/svg";
    function icon(d, size) {
      var s = doc.createElementNS(svgNS, "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("width", String(size || 22)); s.setAttribute("height", String(size || 22)); s.setAttribute("aria-hidden", "true");
      var pth = doc.createElementNS(svgNS, "path"); pth.setAttribute("d", d); pth.setAttribute("fill", "currentColor"); s.appendChild(pth); return s;
    }
    var canvas = el("canvas", { class: "nthview-canvas", tabindex: "0", "aria-label": "The room, seen from above. Tap or click the floor to move there, tap a guard to hunt him. Arrow keys or W A S D also move. P pauses." });
    var col = el("div", { class: "nthview-col" });
    var pauseBtn = el("button", { type: "button", class: "nthview-hchip nthview-pausebtn", "aria-label": "Pause" }, [icon("M6 4h4v16H6zM14 4h4v16h-4z", 20)]);
    var hKick = el("div", { class: "nthview-hkick" }), hName = el("div", { class: "nthview-hname", text: data.title }), hFill = el("i");
    var hMid = el("div", { class: "nthview-hchip nthview-hmid" }, [hKick, hName, el("div", { class: "nthview-hbar", "aria-hidden": "true" }, [hFill])]);
    var targetRow = el("div", { class: "nthview-targets", role: "img" });
    var gemOut = el("b", { text: "0" }), starOut = el("b", { text: "0" }), pickOut = el("b", { text: "0" });
    var gemChip = el("span", { class: "nthview-gemc", title: "Gems" }, [doc.createTextNode("◆ "), gemOut]);
    var pickChip = el("span", { title: "Lockpicks left" }, [doc.createTextNode("⚿ "), pickOut]);
    var hStats = el("div", { class: "nthview-hstats" }, [gemChip, el("span", { title: "Stars" }, [doc.createTextNode("★ "), starOut])].concat(STRICT ? [pickChip] : []));
    var hRight = el("div", { class: "nthview-hchip nthview-hright" }, [targetRow, hStats]);
    var KEY = storageKey(data), SAVED = loadState(KEY);
    if (SAVED && SAVED.settings && SAVED.settings.lights === false) settings.lights = false;
    var hud = el("div", { class: "nthview-hud" }, [el("div", { class: "nthview-hleft" }, [pauseBtn, restartButton(container, data, KEY)]), hMid, hRight]);
    var cKick = el("div", { class: "nthview-ckick" }), cText = el("div", { class: "nthview-ctext" }), cBig = el("div", { class: "nthview-cbig", "aria-live": "polite" }), cLegend = el("div", { class: "nthview-clegend" }), cFb = el("div", { class: "nthview-cfb", "aria-live": "polite" }), cAct = el("div", { class: "nthview-cact" });
    var callout = el("div", { class: "nthview-callout nthview-off" }, [cKick, cText, cBig, cLegend, cFb, cAct]);
    var toastEl = el("div", { class: "nthview-toast", role: "status", "aria-live": "polite" });
    var srLive = el("div", { class: "nthview-sr", "aria-live": "assertive" });
    var powerBar = el("div", { class: "nthview-powers", role: "group", "aria-label": "One-time powers" });
    var pbody = el("div");
    var panel = el("section", { class: "nthview-panel", "aria-label": "Lesson", tabindex: "-1" }, [pbody]);
    [hud, toastEl, powerBar, callout, panel, srLive].forEach(function (n) { col.appendChild(n); });
    var labels = el("div", { class: "nthview-labels" });
    var vignette = el("div", { class: "nthview-vignette", "aria-hidden": "true" });
    var grade = el("div", { class: "nthview-grade", "aria-hidden": "true" });
    var fadeEl = el("div", { class: "nthview-fade", "aria-hidden": "true" });
    var overlay = el("div", { class: "nthview-overlay nthview-hidden" });
    var ocard = el("div", { class: "nthview-card", role: "dialog", "aria-modal": "true" });
    overlay.appendChild(ocard);
    var gemEls = [];
    for (var gi = 0; gi < 10; gi++) { var ge = el("span", { class: "nthview-gem", "aria-hidden": "true" }); gemEls.push(ge); }
    [canvas, grade, labels, vignette, col, overlay, fadeEl].concat(gemEls).forEach(function (n) { container.appendChild(n); });

    /* ---------- state & score ---------- */
    function freshResults() { return BLOCKS.map(function () { return { mistakes: 0, done: false, stars: 0, notes: [], deaths: 0, cleared: false, skipped: false }; }); }
    var S = {
      mode: "intro", k: 0, picks: START_PICKS, gems: 0, paused: false, deaths: 0, skips: 0, alarms: 0, runSeed: 0,
      inv: { sprint: 0, knife: 0, smoke: 0, vest: 0, grenade: 0, pot: 0 }, invStart: { sprint: 0, knife: 0, smoke: 0, vest: 0, grenade: 0, pot: 0 }, sel: null,
      results: freshResults(), finale: { list: [], i: 0, mistakes: 0, done: false }, steps: [], stepI: 0, trialNotes: [], done: false
    };
    var saveTimer = 0;
    function snapshot() {
      var phase = S.mode === "report" ? "report" : S.mode === "finale" || S.mode === "vault" ? "finale" : "block";
      var midRoom = (S.mode === "play" || S.mode === "dead") && S.gems0 !== undefined;   /* an unfinished attempt is replayed, so its gems are not kept */
      return { phase: phase, k: Math.min(S.k, N), picks: S.picks, gems: midRoom ? S.gems0 : S.gems, deaths: S.deaths, skips: S.skips, alarms: S.alarms, runSeed: S.runSeed,
        inv: { sprint: S.invStart.sprint, knife: S.invStart.knife, smoke: S.invStart.smoke, vest: S.invStart.vest, grenade: S.invStart.grenade, pot: S.invStart.pot },
        results: S.results.map(function (r) { return { m: r.mistakes, d: r.done ? 1 : 0, s: r.stars, x: r.deaths, c: r.cleared ? 1 : 0, q: r.skipped ? 1 : 0 }; }),
        finale: { m: S.finale.mistakes, done: S.finale.done ? 1 : 0, i: S.finale.i },
        settings: { reduced: settings.reduced, sound: settings.sound, lights: settings.lights }, done: S.done };
    }
    function saveNow() { clearTimeout(saveTimer); saveTimer = 0; if (S.mode !== "intro" && canvas.isConnected) saveState(KEY, snapshot()); }
    function persist() { if (!saveTimer) saveTimer = setTimeout(saveNow, 250); }
    function intIn(v, lo, hi) { return typeof v === "number" && v % 1 === 0 && v >= lo && v <= hi; }
    /* apply a saved record field by field; anything that no longer fits the data is ignored */
    function restoreState(sv) {
      if (sv.settings && typeof sv.settings === "object") ["reduced", "sound", "lights"].forEach(function (k2) { if (typeof sv.settings[k2] === "boolean") settings[k2] = sv.settings[k2]; });
      if (Array.isArray(sv.results)) sv.results.forEach(function (r, i) {
        if (i >= N || !r || typeof r !== "object") return; var o = S.results[i];
        if (intIn(r.m, 0, 999)) o.mistakes = r.m; if (r.d === 1 || r.d === 0) o.done = !!r.d; if (intIn(r.s, 0, 3)) o.stars = r.s;
        if (intIn(r.x, 0, 1e5)) o.deaths = r.x; if (r.c === 1 || r.c === 0) o.cleared = !!r.c; if (r.q === 1 || r.q === 0) o.skipped = !!r.q;
      });
      if (intIn(sv.picks, 0, 9)) S.picks = sv.picks;
      if (STRICT && S.picks <= 0) S.picks = START_PICKS;
      if (intIn(sv.gems, 0, 1e7)) S.gems = sv.gems;
      if (intIn(sv.deaths, 0, 1e5)) S.deaths = sv.deaths;
      if (intIn(sv.skips, 0, 1e5)) S.skips = sv.skips;
      if (intIn(sv.alarms, 0, 1e5)) S.alarms = sv.alarms;
      if (intIn(sv.runSeed, 0, 1e6)) S.runSeed = sv.runSeed;
      if (sv.done === true) S.done = true;   /* a finished run stays finished until Restart or play again (§5.5 rule 8) */
      if (sv.inv && typeof sv.inv === "object") REWARDS.forEach(function (p2) { if (intIn(sv.inv[p2], 0, 99)) { S.inv[p2] = sv.inv[p2]; S.invStart[p2] = sv.inv[p2]; } });
      if (sv.finale && typeof sv.finale === "object") { if (intIn(sv.finale.m, 0, 999)) S.finale.mistakes = sv.finale.m; if (intIn(sv.finale.i, 0, 50)) S.finale.i = sv.finale.i; }
      var k = intIn(sv.k, 0, N) ? sv.k : 0, phase = ["block", "finale", "report"].indexOf(sv.phase) !== -1 ? sv.phase : "block";
      while (phase === "block" && k < N && S.results[k].done) k++;
      if (phase === "block" && k >= N) phase = "finale";
      if (phase !== "block" && !S.results.every(function (r) { return r.done; })) { phase = "block"; k = 0; while (k < N && S.results[k].done) k++; if (k >= N) phase = "finale"; }
      return { k: Math.min(k, N - 1), phase: phase };
    }
    function totalStars() { var t = 0; for (var i = 0; i < S.results.length; i++) t += S.results[i].stars; return t; }
    function starsFor(m) { return m <= 0 ? 3 : m === 1 ? 2 : 1; }
    function bump(node) { node.classList.remove("nthview-bump"); void node.offsetWidth; node.classList.add("nthview-bump"); }
    function renderScore() { starOut.textContent = String(totalStars()); gemOut.textContent = String(S.gems); pickOut.textContent = String(S.picks); }
    function renderHud() {
      var k = Math.min(S.k, N - 1), fin = S.mode === "finale" || S.mode === "vault" || S.mode === "report";
      hKick.textContent = fin ? "Final room" : "Block " + (k + 1) + " / " + N;
      hName.textContent = fin ? data.finale.name : BLOCKS[k].name;
      hFill.style.width = (100 * (fin ? 1 : k / N)) + "%";
    }
    var toastTimer = 0;
    function toast(msg, ms) { toastEl.textContent = msg; toastEl.classList.add("nthview-show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("nthview-show"); }, ms || 2000); }
    function say(msg) { srLive.textContent = ""; setTimeout(function () { srLive.textContent = msg; }, 30); }
    function hitFlash() { vignette.classList.remove("nthview-hit"); void vignette.offsetWidth; vignette.classList.add("nthview-hit"); }

    /* ---------- sound (synthesised, no files) ---------- */
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
        switch (kind) {
          case "gem": tone(1175, 0, .07, "triangle", .035); tone(1760, .05, .1, "triangle", .03); break;
          case "slash": tone(1400, 0, .12, "sawtooth", .045, 220); tone(180, .02, .16, "square", .03, 70); break;
          case "shot": tone(160, 0, .22, "square", .08, 45); tone(2200, 0, .05, "sawtooth", .04, 400); break;
          case "alert": tone(660, 0, .09, "square", .035); tone(990, .09, .14, "square", .035); break;
          case "huh": tone(330, 0, .12, "triangle", .035, 440); break;
          case "boom": tone(110, 0, .5, "sawtooth", .09, 35); tone(60, 0, .7, "square", .07, 28); tone(900, 0, .08, "square", .04, 200); break;
          case "siren": [0, .32, .64].forEach(function (st) { tone(620, st, .16, "square", .045, 880); tone(880, st + .16, .16, "square", .045, 620); }); break;
          case "clang": tone(900, 0, .18, "square", .04, 500); tone(1350, 0, .12, "triangle", .03); break;
          case "ok": [523, 659, 784].forEach(function (f, i) { tone(f, i * .08, .28); }); break;
          case "no": tone(180, 0, .3, "sawtooth", .04, 120); tone(140, .12, .32, "sawtooth", .03); break;
          case "door": tone(70, 0, .9, "sawtooth", .035, 50); tone(105, .2, .6, "square", .015); break;
          case "key": [784, 988, 1175, 1568].forEach(function (f, i) { tone(f, i * .07, .22, "triangle", .04); }); break;
          case "power": tone(440, 0, .1, "triangle", .04, 880); tone(880, .09, .16, "triangle", .035, 1320); break;
          case "win": [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * .1, .45); }); break;
          case "open": tone(440, 0, .07, "triangle", .03); break;
          case "pick": tone(660, 0, .08, "triangle", .04); tone(990, .05, .1, "triangle", .03); break;
        }
      } catch (e) { /* audio is optional */ }
    }

    /* ---------- renderer, camera, light ---------- */
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
    var pixelRatio = Math.min(root.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.3;
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    /* graphics tier: 2 = every flashlight is a real light that casts shadows; 0 = drawn light cones only (older phones, or when frames get slow) */
    var MAXG = 6, tier = (renderer.capabilities.maxTextures || 8) >= 16 && settings.lights ? 2 : 0;
    function VW() { return Math.max(1, container.clientWidth); }
    function VH() { return Math.max(1, container.clientHeight); }
    function lin(c) { return new THREE.Color(c).convertSRGBToLinear(); }
    var scene = new THREE.Scene(); scene.background = lin(TH.void); scene.fog = new THREE.Fog(lin(TH.void), 40, 90);
    var camera = new THREE.PerspectiveCamera(30, 1, .5, 240);
    var CX = (GW - 1) / 2, CZ = (GH - 1) / 2, WALL_H = 1, TILT = 25 * Math.PI / 180;
    var _v = new THREE.Vector3(), _hit = new THREE.Vector3(), _ndc = new THREE.Vector2(), _scr = { x: 0, y: 0 };
    var raycaster = new THREE.Raycaster(), floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    var CORNERS = [[-.5, 0, -.5], [GW - .5, 0, -.5], [-.5, 0, GH - .5], [GW - .5, 0, GH - .5], [-.5, WALL_H, -.5], [GW - .5, WALL_H, -.5], [-.5, WALL_H, GH - .5], [GW - .5, WALL_H, GH - .5]];
    var bb = { x0: 0, x1: 0, y0: 0, y1: 0 }, camBaseX = CX, labelsDirty = true;
    function placeCamera(d) { camera.position.set(CX, d * Math.cos(TILT), CZ + d * Math.sin(TILT)); camera.lookAt(CX, 0, CZ); camera.updateMatrixWorld(); }
    function measure() {
      bb.x0 = bb.y0 = 1e9; bb.x1 = bb.y1 = -1e9;
      for (var i = 0; i < CORNERS.length; i++) { _v.set(CORNERS[i][0], CORNERS[i][1], CORNERS[i][2]).project(camera); if (_v.x < bb.x0) bb.x0 = _v.x; if (_v.x > bb.x1) bb.x1 = _v.x; if (_v.y < bb.y0) bb.y0 = _v.y; if (_v.y > bb.y1) bb.y1 = _v.y; }
    }
    /* the whole room always fits the portrait column, below the HUD */
    function fitCamera() {
      var w = VW(), h = VH(), colW = Math.min(560, w), top = 92, bot = 12;
      camera.clearViewOffset(); camera.aspect = w / h; camera.updateProjectionMatrix();
      var availW = (colW - 8) / w * 2, availH = Math.max(140, h - top - bot) / h * 2, lo = 6, hi = 200;
      for (var i = 0; i < 24; i++) { var mid = (lo + hi) / 2; placeCamera(mid); measure(); if (bb.x1 - bb.x0 <= availW && bb.y1 - bb.y0 <= availH) hi = mid; else lo = mid; }
      placeCamera(hi); measure();
      var cyPx = (1 - (bb.y0 + bb.y1) / 2) / 2 * h, want = top + (h - top - bot) / 2;
      camera.setViewOffset(w, h, 0, Math.round(cyPx - want), w, h);
      scene.fog.near = hi + 8; scene.fog.far = hi + 60; camBaseX = camera.position.x; labelsDirty = true;
    }
    function toScreen(x, y, z, out) { _v.set(x, y, z).project(camera); out.x = (_v.x + 1) / 2 * VW(); out.y = (1 - _v.y) / 2 * VH(); return out; }
    function toFloor(clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      _ndc.set((clientX - r.left) / r.width * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
      raycaster.setFromCamera(_ndc, camera);
      return raycaster.ray.intersectPlane(floorPlane, _hit);
    }
    /* a dim, cool room so that the flashlights are the brightest thing in it */
    scene.add(new THREE.HemisphereLight(lin(TH.sky), lin(TH.ground), .42));
    var sun = new THREE.DirectionalLight(lin(TH.sun), .42);
    sun.position.set(CX - 6, 17, CZ - 7); sun.target.position.set(CX, 0, CZ); scene.add(sun); scene.add(sun.target);
    sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); sun.shadow.bias = -.0008; sun.shadow.normalBias = .03;
    sun.shadow.camera.left = -9; sun.shadow.camera.right = 9; sun.shadow.camera.top = GH / 2 + 4; sun.shadow.camera.bottom = -GH / 2 - 4; sun.shadow.camera.near = 2; sun.shadow.camera.far = 44;
    /* one real spotlight per guard, made once so the shaders never have to be rebuilt in the middle of a room */
    var LAMPS = [];
    for (var li = 0; li < MAXG; li++) {
      var lp = new THREE.SpotLight(0xffffff, 0, 6, .5, .45, 1.3);
      lp.castShadow = true; lp.shadow.mapSize.set(512, 512); lp.shadow.bias = -.002; lp.shadow.camera.near = .12; lp.shadow.autoUpdate = false; lp.visible = tier >= 2;
      scene.add(lp); scene.add(lp.target); LAMPS.push(lp);
    }
    var heroLight = new THREE.PointLight(lin(TH.sash), 1.5, 3.2, 1.5); scene.add(heroLight);
    var flashLight = new THREE.PointLight(lin(0xffc070), 0, 5, 1.4); scene.add(flashLight);

    /* ---------- shared geometry, materials, textures ---------- */
    function capsule() {
      var pts = [], i;
      for (i = 0; i <= 6; i++) { var a = -Math.PI / 2 + i / 6 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a) * .5, -.5 + Math.sin(a) * .5)); }
      for (i = 0; i <= 6; i++) { var a2 = i / 6 * Math.PI / 2; pts.push(new THREE.Vector2(Math.cos(a2) * .5, .5 + Math.sin(a2) * .5)); }
      return new THREE.LatheGeometry(pts, 14);
    }
    var GEO = { box: new THREE.BoxGeometry(1, 1, 1), cyl: new THREE.CylinderGeometry(.5, .5, 1, 20), cone: new THREE.ConeGeometry(.5, 1, 16), sph: new THREE.SphereGeometry(.5, 18, 12), oct: new THREE.OctahedronGeometry(.5), cap: capsule(),
      disc: new THREE.CircleGeometry(.5, 32), ring: new THREE.RingGeometry(.36, .5, 40), arc: new THREE.RingGeometry(.3, .62, 28, 1, -.9, 1.8), torus: new THREE.TorusGeometry(.4, .09, 10, 24), plane: new THREE.PlaneGeometry(1, 1) };
    var MATS = {};
    function lam(c, rough, metal) { var k = "s" + c + ":" + rough + ":" + metal; return MATS[k] || (MATS[k] = new THREE.MeshStandardMaterial({ color: lin(c), roughness: rough === undefined ? .7 : rough, metalness: metal || 0 })); }
    function glow(c) { return MATS["g" + c] || (MATS["g" + c] = new THREE.MeshBasicMaterial({ color: lin(c), toneMapped: false })); }
    function setCol(mat, c) { mat.color.set(c).convertSRGBToLinear(); }
    function mesh(parent, geo, mat, x, y, z, sx, sy, sz) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz); if (parent) parent.add(m); return m; }
    var maxAniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    function canvasTex(w, h, draw, data) { var c = doc.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); var t = new THREE.CanvasTexture(c); t.anisotropy = maxAniso; if (!data) t.encoding = THREE.sRGBEncoding; return t; }
    function speckle(g, r, x0, y0, w, h, n, lo, hi) { for (var i = 0; i < n; i++) { g.fillStyle = "rgba(" + (r() < .5 ? "0,0,0," : "255,255,255,") + (lo + r() * (hi - lo)).toFixed(3) + ")"; g.fillRect(x0 + r() * w, y0 + r() * h, 1 + r() * 2, 1 + r() * 2); } }
    /* floor: four by four worn concrete tiles, with a matching height map so the joints catch the light */
    function drawFloor(g, w, bump) {
      var n = 4, s = w / n, r = seeded("floor:" + themeName), i, x, y;
      for (y = 0; y < n; y++) for (x = 0; x < n; x++) {
        g.fillStyle = bump ? "rgb(150,150,150)" : (r() < .5 ? TH.floorA : TH.floorB); g.fillRect(x * s, y * s, s, s);
        if (!bump) { var gr = g.createRadialGradient(x * s + s / 2, y * s + s / 2, s * .1, x * s + s / 2, y * s + s / 2, s * .78); gr.addColorStop(0, "rgba(255,255,255,.06)"); gr.addColorStop(1, "rgba(0,0,0,.2)"); g.fillStyle = gr; g.fillRect(x * s, y * s, s, s); }
      }
      speckle(g, r, 0, 0, w, w, 9000, bump ? .05 : .02, bump ? .16 : .07);
      if (!bump) {
        for (i = 0; i < 8; i++) { var bx = r() * w, by = r() * w, br = 20 + r() * 50, sg = g.createRadialGradient(bx, by, 2, bx, by, br); sg.addColorStop(0, "rgba(0,0,0,.2)"); sg.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = sg; g.fillRect(bx - br, by - br, br * 2, br * 2); }
        g.strokeStyle = "rgba(255,255,255,.07)"; g.lineWidth = 1;
        for (i = 0; i < 30; i++) { var sx2 = r() * w, sy2 = r() * w, an = r() * 6.28, ln = 8 + r() * 30; g.beginPath(); g.moveTo(sx2, sy2); g.lineTo(sx2 + Math.cos(an) * ln, sy2 + Math.sin(an) * ln); g.stroke(); }
      }
      g.strokeStyle = bump ? "rgb(30,30,30)" : TH.grout; g.lineWidth = bump ? 7 : 5;
      for (i = 0; i <= n; i++) { g.beginPath(); g.moveTo(i * s, 0); g.lineTo(i * s, w); g.stroke(); g.beginPath(); g.moveTo(0, i * s); g.lineTo(w, i * s); g.stroke(); }
      if (!bump) { g.strokeStyle = "rgba(255,255,255,.08)"; g.lineWidth = 1.5; for (y = 0; y < n; y++) for (x = 0; x < n; x++) { g.beginPath(); g.moveTo(x * s + 5, y * s + s - 5); g.lineTo(x * s + 5, y * s + 5); g.lineTo(x * s + s - 5, y * s + 5); g.stroke(); } }
    }
    var floorTex = canvasTex(512, 512, function (g, w) { drawFloor(g, w, false); }), floorBump = canvasTex(512, 512, function (g, w) { drawFloor(g, w, true); }, true);
    [floorTex, floorBump].forEach(function (t) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(GW / 4, GH / 4); });
    /* walls: the left half of the sheet is a side face (trim, panel, baseboard), the right half the top of a block */
    function drawWall(g, lit) {
      var r = seeded("wall:" + themeName), i;
      if (lit) { g.fillStyle = "#000"; g.fillRect(0, 0, 512, 256); g.fillStyle = TH.glowLine; g.fillRect(0, 24, 256, 6); return; }
      var gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, TH.wallSide); gr.addColorStop(.7, TH.wallSide); gr.addColorStop(1, TH.wallBase);
      g.fillStyle = gr; g.fillRect(0, 0, 256, 256);
      g.fillStyle = TH.wallTop; g.fillRect(0, 0, 256, 18); g.fillStyle = "rgba(0,0,0,.4)"; g.fillRect(0, 18, 256, 5); g.fillStyle = TH.glowLine; g.fillRect(0, 24, 256, 6);
      g.fillStyle = TH.wallBase; g.fillRect(0, 212, 256, 44); g.fillStyle = "rgba(0,0,0,.35)"; g.fillRect(0, 208, 256, 4);
      g.fillStyle = "rgba(0,0,0,.3)"; g.fillRect(0, 34, 3, 172); g.fillRect(253, 34, 3, 172); g.fillStyle = "rgba(255,255,255,.07)"; g.fillRect(3, 34, 2, 172);
      g.fillStyle = "rgba(255,255,255,.22)"; [[16, 50], [240, 50], [16, 190], [240, 190]].forEach(function (p2) { g.beginPath(); g.arc(p2[0], p2[1], 3.2, 0, 6.3); g.fill(); });
      speckle(g, r, 0, 0, 256, 256, 2600, .02, .08);
      g.fillStyle = TH.wallTop; g.fillRect(256, 0, 256, 256);
      g.strokeStyle = "rgba(0,0,0,.26)"; g.lineWidth = 10; g.strokeRect(261, 5, 246, 246); g.strokeStyle = "rgba(255,255,255,.22)"; g.lineWidth = 3; g.strokeRect(271, 15, 226, 226);
      speckle(g, r, 256, 0, 256, 256, 2600, .02, .07);
    }
    var wallTex = canvasTex(512, 256, function (g) { drawWall(g, false); }), wallGlow = canvasTex(512, 256, function (g) { drawWall(g, true); });
    var crateTex = canvasTex(256, 256, function (g, w) {
      var r = seeded("crate:" + themeName), i;
      g.fillStyle = TH.crate; g.fillRect(0, 0, w, w);
      for (i = 0; i < 5; i++) { g.fillStyle = "rgba(0,0,0," + (.04 + r() * .1).toFixed(3) + ")"; g.fillRect(0, i * w / 5, w, w / 5 - 3); g.fillStyle = TH.crateLine; g.fillRect(0, (i + 1) * w / 5 - 3, w, 3); }
      g.strokeStyle = "rgba(0,0,0,.12)"; g.lineWidth = 1; for (i = 0; i < 60; i++) { var gy = r() * w, gx = r() * w; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + 20 + r() * 60, gy + (r() - .5) * 3); g.stroke(); }
      g.strokeStyle = TH.crateDark; g.lineWidth = 30; g.strokeRect(15, 15, w - 30, w - 30); g.lineWidth = 22; g.beginPath(); g.moveTo(26, 26); g.lineTo(w - 26, w - 26); g.stroke();
      g.strokeStyle = "rgba(255,255,255,.14)"; g.lineWidth = 2; g.strokeRect(2, 2, w - 4, w - 4); g.strokeRect(31, 31, w - 62, w - 62);
      g.fillStyle = "#59616e"; [[4, 4], [w - 40, 4], [4, w - 40], [w - 40, w - 40]].forEach(function (p2) { g.fillRect(p2[0], p2[1], 36, 36); }); g.fillStyle = "rgba(255,255,255,.35)"; [[14, 14], [w - 30, 14], [14, w - 30], [w - 30, w - 30]].forEach(function (p2) { g.beginPath(); g.arc(p2[0] + 8, p2[1] + 8, 4, 0, 6.3); g.fill(); });
      speckle(g, r, 0, 0, w, w, 1800, .02, .08);
    });
    var doorTex = canvasTex(256, 256, function (g, w) {
      g.fillStyle = TH.door; g.fillRect(0, 0, w, w); g.fillStyle = "rgba(0,0,0,.28)"; g.fillRect(124, 0, 8, w); g.strokeStyle = "rgba(0,0,0,.3)"; g.lineWidth = 6; g.strokeRect(14, 14, 100, 150); g.strokeRect(142, 14, 100, 150);
      g.strokeStyle = "rgba(255,255,255,.18)"; g.lineWidth = 2; g.strokeRect(20, 20, 88, 138); g.strokeRect(148, 20, 88, 138);
      for (var i = -2; i < 12; i++) { g.fillStyle = i % 2 ? "#15171b" : "#f2c230"; g.beginPath(); g.moveTo(i * 32, 256); g.lineTo(i * 32 + 32, 256); g.lineTo(i * 32 + 64, 196); g.lineTo(i * 32 + 32, 196); g.fill(); }
    });
    var matTex = canvasTex(256, 256, function (g, w) {
      g.clearRect(0, 0, w, w); g.strokeStyle = "rgba(255,255,255,.9)"; g.lineWidth = 16; g.lineJoin = "miter";
      for (var i = 0; i < 3; i++) { g.globalAlpha = .35 + i * .25; g.beginPath(); g.moveTo(40, 226 - i * 70); g.lineTo(128, 160 - i * 70); g.lineTo(216, 226 - i * 70); g.stroke(); }
    });
    var softTex = canvasTex(64, 64, function (g, w) { var gr = g.createRadialGradient(w / 2, w / 2, 2, w / 2, w / 2, w / 2); gr.addColorStop(0, "rgba(255,255,255,1)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(0, 0, w, w); });
    function markTex(ch, bg) { return canvasTex(64, 64, function (g, w) { g.fillStyle = bg; g.beginPath(); g.arc(w / 2, w / 2, w / 2 - 3, 0, Math.PI * 2); g.fill(); g.lineWidth = 4; g.strokeStyle = "#fff"; g.stroke(); g.fillStyle = "#fff"; g.font = "900 44px Arial, sans-serif"; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ch, w / 2, w / 2 + 3); }); }
    function markMat(ch, bg) { return new THREE.SpriteMaterial({ map: markTex(ch, bg), depthTest: false, toneMapped: false }); }
    var MARK = { "!": markMat("!", "#e0372b"), "?": markMat("?", "#d99a12"), "+": markMat("+", "#17a67c"), "z": markMat("…", "#56627a") };
    var matFloor = new THREE.MeshStandardMaterial({ map: floorTex, bumpMap: floorBump, bumpScale: .03, roughness: .82, metalness: .06 });
    var matWall = new THREE.MeshStandardMaterial({ map: wallTex, emissiveMap: wallGlow, emissive: new THREE.Color(0xffffff), emissiveIntensity: 1.1, roughness: .78, metalness: .04 });
    var matCrate = new THREE.MeshStandardMaterial({ map: crateTex, bumpMap: crateTex, bumpScale: .025, roughness: .8, metalness: .02 });
    var matDoor = new THREE.MeshStandardMaterial({ map: doorTex, roughness: .45, metalness: .5 });
    var matProp = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .55, metalness: .3 });
    var matFig = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: .6, metalness: .12 });
    var poolMat = new THREE.MeshBasicMaterial({ map: softTex, color: lin(TH.sky), transparent: true, opacity: .16, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false });
    function addMat(c, o, map) { return new THREE.MeshBasicMaterial({ color: lin(c), map: map || null, transparent: true, opacity: o === undefined ? 1 : o, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }); }

    /* bake many primitive parts into one mesh: a whole figure, or every crate in a room, costs one draw call */
    var _m4 = new THREE.Matrix4(), _n3 = new THREE.Matrix3(), _eu = new THREE.Euler(), _qt = new THREE.Quaternion(), _p3 = new THREE.Vector3(), _s3 = new THREE.Vector3(), _up = new THREE.Vector3(0, 1, 0), _c1 = new THREE.Color(), NI = {};
    function flat(name) { return NI[name] || (NI[name] = GEO[name].index ? GEO[name].toNonIndexed() : GEO[name]); }
    function Bake() { this.p = []; this.n = []; this.c = []; this.u = []; }
    Bake.prototype.put = function (name, col) {
      var g = flat(name), pos = g.attributes.position, nor = g.attributes.normal, uv = g.attributes.uv;
      _n3.getNormalMatrix(_m4); _c1.set(col).convertSRGBToLinear();
      for (var i = 0; i < pos.count; i++) {
        _v.fromBufferAttribute(pos, i).applyMatrix4(_m4); this.p.push(_v.x, _v.y, _v.z);
        _v.fromBufferAttribute(nor, i).applyMatrix3(_n3).normalize(); this.n.push(_v.x, _v.y, _v.z);
        this.c.push(_c1.r, _c1.g, _c1.b); this.u.push(uv.getX(i), uv.getY(i));
      }
      return this;
    };
    Bake.prototype.add = function (name, col, x, y, z, sx, sy, sz, rx, ry, rz) {
      _p3.set(x, y, z); _eu.set(rx || 0, ry || 0, rz || 0); _qt.setFromEuler(_eu); _s3.set(sx, sy === undefined ? sx : sy, sz === undefined ? sx : sz);
      _m4.compose(_p3, _qt, _s3); return this.put(name, col);
    };
    /* a rounded limb from one point to another */
    Bake.prototype.limb = function (col, x0, y0, z0, x1, y1, z1, r) {
      _s3.set(x1 - x0, y1 - y0, z1 - z0); var len = _s3.length(); _qt.setFromUnitVectors(_up, _s3.normalize());
      _p3.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2); _s3.set(r * 2, (len + r * 2) / 2, r * 2); _m4.compose(_p3, _qt, _s3); return this.put("cap", col);
    };
    Bake.prototype.mesh = function (mat, shadow) {
      var geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(this.p, 3)); geo.setAttribute("normal", new THREE.Float32BufferAttribute(this.n, 3));
      geo.setAttribute("color", new THREE.Float32BufferAttribute(this.c, 3)); geo.setAttribute("uv", new THREE.Float32BufferAttribute(this.u, 2));
      var m = new THREE.Mesh(geo, mat); m.castShadow = shadow !== false; m.receiveShadow = true; m.userData.own = true; return m;
    };
    /* wall blocks carry their own texture coordinates: sides on the left half of the sheet, tops on the right */
    var FACES = [
      [0, 1, 0, -.5, .5, .5, .5, .5, .5, .5, .5, -.5, -.5, .5, -.5],
      [0, 0, 1, -.5, -.5, .5, .5, -.5, .5, .5, .5, .5, -.5, .5, .5],
      [0, 0, -1, .5, -.5, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5],
      [1, 0, 0, .5, -.5, .5, .5, -.5, -.5, .5, .5, -.5, .5, .5, .5],
      [-1, 0, 0, -.5, -.5, -.5, -.5, -.5, .5, -.5, .5, .5, -.5, .5, -.5]
    ], FUV = [0, 0, 1, 0, 1, 1, 0, 1], FORD = [0, 1, 2, 0, 2, 3];
    function pushBox(B, x, y, z, sx, sy, sz, top, side, skip) {
      for (var f = 0; f < 5; f++) {
        if (skip && skip[f]) continue;
        var F = FACES[f]; _c1.set(f === 0 ? top : side).convertSRGBToLinear();
        for (var q = 0; q < 6; q++) {
          var k = FORD[q], o = 3 + k * 3; B.p.push(x + F[o] * sx, y + F[o + 1] * sy, z + F[o + 2] * sz); B.n.push(F[0], F[1], F[2]); B.c.push(_c1.r, _c1.g, _c1.b);
          B.u.push((f === 0 ? .504 : .004) + FUV[k * 2] * .492, FUV[k * 2 + 1]);
        }
      }
    }
    var ground = mesh(scene, GEO.plane, new THREE.MeshStandardMaterial({ color: lin(0x262626), map: (function () { var t = floorTex.clone(); t.repeat.set(65, 65); t.needsUpdate = true; return t; })(), roughness: .95, metalness: 0 }), CX, -.03, CZ, 260, 260, 1); ground.rotation.x = -Math.PI / 2;
    var floorMesh = mesh(scene, GEO.plane, matFloor, CX, 0, CZ, GW, GH, 1); floorMesh.rotation.x = -Math.PI / 2; floorMesh.receiveShadow = true;
    /* the rest of the building, dim, as filler beside the portrait column on wide screens */
    (function () {
      var B = new Bake(), rnd = seeded("around:" + themeName), top = new THREE.Color(TH.wallTop).multiplyScalar(.1).getHex(), side = new THREE.Color(TH.wallSide).multiplyScalar(.09).getHex();
      for (var z = -7; z <= GH + 6; z++) for (var x = -18; x <= GW + 17; x++) {
        if (rnd() < .8) continue;
        var w = 1 + Math.floor(rnd() * 3), d = 1 + Math.floor(rnd() * 2), h = .3 + rnd() * 1.1;
        if (x + w > -2 && x < GW + 1 && z + d > -2 && z < GH + 1) continue;
        pushBox(B, x + w / 2, h / 2, z + d / 2, w, h, d, top, side, null);
      }
      var m = B.mesh(matProp, false); m.userData.own = false; scene.add(m);
    })();

    /* ---------- figures: people facing +x, each baked into a body and two legs ---------- */
    var SKIN = 0xe2b690, GUN = 0x16181d, HP = Math.PI / 2;
    function headgear(b, S) {
      var k = S.head;
      if (k === "cap") { b.add("cyl", S.trim, 0, 1.075, 0, .31, .08, .31); b.add("box", S.trim, .17, 1.05, 0, .17, .025, .24); }
      else if (k === "helmet") { b.add("sph", S.gear, 0, 1.0, 0, .38, .32, .38); b.add("cyl", S.gear, 0, .985, 0, .4, .03, .4); }
      else if (k === "bandana") { b.add("sph", 0x2a1c12, 0, 1.05, 0, .28, .18, .28); b.add("cyl", S.trim, 0, 1.03, 0, .32, .07, .32); b.add("box", S.trim, -.2, 1.0, .06, .16, .03, .07, 0, .5, 0); }
      else if (k === "hood") { b.add("sph", S.body, -.01, 1.0, 0, .39, .37, .39); b.add("cone", S.body, -.1, 1.13, 0, .2, .18, .2, 0, 0, .5); b.add("box", S.trim, .13, .97, 0, .08, .05, .27); }
      else if (k === "boonie") { b.add("cyl", S.trim, 0, 1.06, 0, .54, .025, .54); b.add("cyl", S.body, 0, 1.1, 0, .3, .1, .3); }
      else if (k === "heavy") { b.add("sph", S.gear, 0, .99, 0, .43, .39, .43); b.add("box", S.trim, .17, .97, 0, .06, .07, .3); }
      else if (k === "visor") { b.add("sph", S.gear, 0, 1.0, 0, .39, .33, .39); b.add("box", S.trim, .16, .96, 0, .04, .13, .28); }
      else if (k === "band") { b.add("sph", 0x2a1c12, 0, 1.05, 0, .29, .2, .29); b.add("cyl", 0xffffff, 0, 1.02, 0, .325, .05, .325); b.add("box", 0x101216, .14, .975, 0, .07, .05, .27); b.add("box", S.trim, 0, .58, 0, .31, .045, .47); b.add("box", S.trim, 0, .7, 0, .31, .045, .47); }
      else if (k === "peaked") { b.add("cyl", S.body, 0, 1.06, 0, .31, .06, .31); b.add("cyl", S.gear, 0, 1.085, 0, .325, .035, .325); b.add("cyl", S.body, 0, 1.12, 0, .4, .04, .4); b.add("box", 0x0d0d10, .19, 1.045, 0, .14, .02, .25); b.add("sph", S.trim, .16, 1.095, 0, .07); }
    }
    function weapon(b, S, lens) {
      var k = S.weapon;
      if (k === "pistol") { b.add("box", GUN, .43, .6, .09, .2, .075, .05); b.add("cyl", 0x30343c, .45, .545, .09, .055, .13, .055, 0, 0, HP); lens.push([.53, .545, .09, .06]); }
      else if (k === "rifle" || k === "smg") { var L = k === "rifle" ? .58 : .42; b.add("box", GUN, .2 + L / 2, .6, .09, L, .075, .06); b.add("box", GUN, .1, .62, .13, .2, .09, .06); b.add("box", GUN, .38, .53, .09, .06, .13, .05); b.add("cyl", 0x30343c, .18 + L, .55, .09, .06, .14, .06, 0, 0, HP); lens.push([.26 + L, .55, .09, .065]); }
      else if (k === "longrifle") { b.add("box", GUN, .58, .61, .09, 1.0, .055, .05); b.add("box", 0x3a2a1a, .1, .62, .13, .24, .1, .06); b.add("cyl", 0x20232a, .42, .685, .09, .065, .24, .065, 0, 0, HP); b.add("cyl", 0x30343c, 1.02, .58, .09, .05, .12, .05, 0, 0, HP); lens.push([1.09, .58, .09, .05]); }
      else if (k === "minigun") { b.add("cyl", 0x2b2e35, .5, .56, .11, .17, .62, .17, 0, 0, HP); b.add("cyl", 0x101216, .86, .56, .11, .12, .12, .12, 0, 0, HP); b.add("box", 0x30343c, .3, .47, .11, .2, .08, .1); b.add("box", S.trim, -.21, .66, 0, .17, .32, .36); lens.push([.93, .56, .11, .08]); }
      else if (k === "sword") { b.add("box", 0x2a2d33, .35, .5, -.12, .1, .15, .1); lens.push([.35, .5, -.12, .09]); }
    }
    function buildFigure(S, kind) {
      var g = new THREE.Group(), me = kind === "hunter", boss = kind === "boss", b = new Bake(), lens = [], legs = S.legs || 0x1a1d24, f = { g: g, legL: null, legR: null, body: null, ring: null, star: null, glows: [] };
      if (S.drone) {
        b.add("sph", S.body, 0, 1.2, 0, .4, .17, .4); b.add("box", S.gear, 0, 1.2, 0, .84, .035, .06, 0, Math.PI / 4, 0); b.add("box", S.gear, 0, 1.2, 0, .84, .035, .06, 0, -Math.PI / 4, 0);
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(function (q) { b.add("cyl", S.gear, q[0] * .29, 1.235, q[1] * .29, .09, .07, .09); b.add("cyl", 0x9aa4b2, q[0] * .29, 1.28, q[1] * .29, .3, .008, .3); });
        b.add("sph", 0x15171b, 0, 1.1, 0, .2); lens.push([.07, 1.06, 0, .08]);
      } else {
        b.add("cap", S.body, 0, .64, 0, .3, .2, .46); b.add("box", 0x14161b, 0, .46, 0, .27, .06, .43);
        if (!me && S.head !== "cap" && S.head !== "bandana" && S.head !== "boonie" && S.head !== "band") b.add("box", S.gear, .012, .665, 0, .3, .2, .4);
        var sh = boss ? S.trim : S.gear, ss = boss ? .25 : .18;
        b.add("sph", sh, 0, .79, .255, ss); b.add("sph", sh, 0, .79, -.255, ss);
        b.limb(S.body, 0, .78, .26, .2, .62, .2, .06); b.limb(S.body, .2, .62, .2, .31, .585, .11, .055);
        b.limb(S.body, 0, .78, -.26, .16, .64, -.2, .06); b.limb(S.body, .16, .64, -.2, .32, .6, -.01, .055);
        b.add("sph", me ? 0x1a1d24 : SKIN, .31, .585, .1, .1); b.add("sph", me ? 0x1a1d24 : SKIN, .33, .6, -.02, .1);
        b.add("cyl", me ? 0x1a1d24 : SKIN, 0, .86, 0, .13, .08, .13); b.add("sph", me ? 0x2a2f3a : SKIN, .012, .97, 0, .3);
        if (me) {
          b.add("sph", S.body, -.01, 1.0, 0, .39, .37, .39); b.add("cone", S.body, -.1, 1.13, 0, .2, .18, .2, 0, 0, .5);
          b.add("box", S.trim, .13, .97, 0, .08, .045, .27); b.add("cyl", S.trim, 0, .84, 0, .3, .05, .34); b.add("box", S.trim, -.2, .74, .1, .22, .04, .09, 0, .3, -.5);
          b.add("box", S.trim, 0, .46, 0, .28, .03, .44); b.add("box", 0x15171b, -.17, .7, -.1, .05, .5, .06, 0, 0, -.5);
        } else {
          headgear(b, S); weapon(b, S, lens);
          if (S.frontProof) { b.add("box", S.trim, .4, .6, -.04, .05, .66, .6); b.add("box", S.gear, .43, .6, -.04, .02, .5, .44); b.add("box", 0xe9f6ff, .445, .74, -.04, .012, .09, .3); }
          if (S.head === "peaked") { b.add("box", S.body, -.03, .5, 0, .33, .22, .5); b.add("cyl", 0x9aa4b2, -.15, 1.02, -.17, .018, .52, .018); b.add("box", S.trim, 0, .84, .255, .16, .02, .12); b.add("box", S.trim, 0, .84, -.255, .16, .02, .12); }
          if (S.medic) { b.add("box", 0xffffff, -.21, .66, 0, .17, .3, .34); b.add("box", S.trim, -.3, .66, 0, .012, .2, .07); b.add("box", S.trim, -.3, .66, 0, .012, .07, .2); b.add("box", S.trim, 0, 1.118, 0, .18, .01, .055); b.add("box", S.trim, 0, 1.118, 0, .055, .01, .18); }
          if (S.head === "helmet" && !S.lamp) b.add("box", S.gear, -.2, .66, 0, .14, .28, .32);
          if (S.lamp) { b.add("cyl", 0x2a2d33, .08, .93, -.3, .22, .24, .22, 0, 0, HP); lens.push([.21, .93, -.3, .17]); }
        }
        var mk = function (zs) { var lb = new Bake(); lb.add("cap", legs, 0, -.19, 0, .13, .19, .13); lb.add("box", 0x0c0d10, .035, -.4, 0, .19, .085, .135); var m = lb.mesh(matFig); m.position.set(0, .44, zs * .105); g.add(m); return m; };
        f.legL = mk(-1); f.legR = mk(1);
      }
      f.body = b.mesh(matFig); g.add(f.body);
      lens.forEach(function (q) { f.glows.push(mesh(g, GEO.sph, glow(me ? TH.sash : (S.cone || 0xfff0b8)), q[0], q[1], q[2], q[3])); });
      if (me) f.glows.push(mesh(g, GEO.torus, glow(TH.sash), 0, .845, 0, .36, .36, .2)), f.glows[f.glows.length - 1].rotation.x = HP;
      else {
        f.ring = mesh(g, GEO.disc, new THREE.MeshBasicMaterial({ map: softTex, color: lin(S.ring), transparent: true, opacity: .6, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), 0, .03, 0, 1.3); f.ring.rotation.x = -HP; f.ring.userData.ownMat = true;
        if (boss) f.star = mesh(g, GEO.oct, glow(0xffc83d), 0, 1.36, 0, .19);
      }
      /* a sword is its own part so that it can swing: the hunter's, and the blade's */
      if (me || S.weapon === "sword") {
        var pv = new THREE.Group(), edge = me ? TH.sash : S.trim; pv.position.set(.2, .62, .2);
        mesh(pv, GEO.box, lam(0xe6edf5, .22, .9), .52, 0, 0, .8, .026, .08).castShadow = true; mesh(pv, GEO.box, glow(edge), .52, .018, 0, .8, .008, .022);
        mesh(pv, GEO.box, lam(0x2a1c12, .7, 0), .04, 0, 0, .17, .05, .055); mesh(pv, GEO.box, lam(edge, .5, .3), .13, 0, 0, .035, .055, .22);
        pv.rotation.y = -.4; g.add(pv); f.sword = pv;
      }
      f.scale = (S.scale || 1) * 1.22; g.scale.setScalar(f.scale);   /* drawn a little larger than life so each kind reads clearly from above */
      return f;
    }
    function animWalk(f, phase, moving, running) {
      if (!f.legL) { f.body.position.y = Math.sin(T * 3 + phase) * .04; return; }
      var s = moving ? Math.sin(phase) * (running ? .85 : .55) : 0; f.legL.rotation.z = s; f.legR.rotation.z = -s;
      f.body.position.y = moving ? Math.abs(Math.sin(phase)) * .025 : 0; f.body.rotation.z = moving && running ? -.14 : 0;
    }
    function poseFall(f, k) { var e = k * k * (3 - 2 * k); if (f.legL) { f.g.rotation.z = -e * HP; f.g.position.y = e * .16 * f.scale; } else { f.g.rotation.z = e * .5; f.g.position.y = -e * 1.02; } }

    /* ---------- the room ---------- */
    var RAYS = 40, HR = .26;
    var room = null, grid = new Uint8Array(GW * GH), roomGroup = null, guards = [], doorSlab = null, doorLamp = null, doorGlow = null, doorOpen = 0, doorWant = 0;
    var H = { x: START_X, z: START_Z, a: -Math.PI / 2, alive: true, fig: buildFigure({ body: TH.hunter, trim: TH.sash, gear: TH.sash, scale: 1 }, "hunter"), path: new Float32Array(128), pathN: 0, pathI: 0, target: null, moving: false, repath: 0,
      sprintT: 0, potT: 0, safeT: 0, aim: null, atk: null, swing: -.4, swingV: -.4, kbx: 0, kbz: 0, walk: 0, fall: 0, bounceT: 0, vx: 0, vz: -1 };
    scene.add(H.fig.g);
    var heroGlow = mesh(scene, GEO.disc, new THREE.MeshBasicMaterial({ map: softTex, color: lin(TH.sash), transparent: true, opacity: .4, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false }), 0, .02, 0, 1.9); heroGlow.rotation.x = -HP;
    /* a smoke cloud: a handful of soft sprites over a dark patch */
    var smokeFx = new THREE.Group(); smokeFx.visible = false; scene.add(smokeFx);
    var smokeBits = [];
    (function () {
      var sm = new THREE.SpriteMaterial({ map: softTex, color: lin(0xaab4c2), transparent: true, opacity: .62, depthWrite: false });
      mesh(smokeFx, GEO.disc, new THREE.MeshBasicMaterial({ map: softTex, color: 0x000000, transparent: true, opacity: .5, depthWrite: false }), 0, .02, 0, 4.2).rotation.x = -HP;
      for (var q = 0; q < 7; q++) { var sp2 = new THREE.Sprite(sm), a = q / 6 * 6.283; sp2.position.set(q ? Math.cos(a) * 1.05 : 0, .7 + (q % 3) * .25, q ? Math.sin(a) * 1.05 : 0); sp2.scale.setScalar(2.4); smokeFx.add(sp2); smokeBits.push(sp2); }
    })();
    var bomb = mesh(scene, GEO.sph, new THREE.MeshStandardMaterial({ color: lin(0x3f5a2a), roughness: .5, metalness: .4 }), 0, .6, 0, .2); bomb.visible = false; bomb.castShadow = true;
    var boomRing = mesh(scene, GEO.ring, addMat(0xffa040, 0), 0, .05, 0, 1); boomRing.rotation.x = -HP; var boomT = 0;
    /* the flower-pot disguise */
    var potObj = (function () {
      var b = new Bake();
      b.add("cyl", 0xb5562b, 0, .2, 0, .5, .4, .5); b.add("cyl", 0xc96a3a, 0, .42, 0, .6, .07, .6); b.add("cyl", 0x3a2a1c, 0, .46, 0, .5, .02, .5);
      b.add("cyl", 0x2f8a3a, 0, .68, 0, .05, .46, .05); b.add("sph", 0x2f9a40, .14, .62, .04, .26, .1, .16, 0, 0, .5); b.add("sph", 0x2f9a40, -.14, .7, -.04, .26, .1, .16, 0, 0, -.5); b.add("sph", 0x37a84a, .02, .56, -.15, .16, .09, .24, .5, 0, 0);
      [0, 1, 2, 3, 4].forEach(function (q) { var a = q / 5 * 6.283; b.add("sph", 0xff6fa8, Math.cos(a) * .1, .95, Math.sin(a) * .1, .15, .08, .15); });
      b.add("sph", 0xffd23e, 0, .97, 0, .11);
      var m = b.mesh(matProp); m.userData.own = false; m.visible = false; m.scale.setScalar(1.25); scene.add(m); return m;
    })();
    var tapRing = mesh(scene, GEO.ring, addMat(0xffffff, 0), 0, .03, 0, .5); tapRing.rotation.x = -HP; var tapT = 0;
    var goalRing = mesh(scene, GEO.ring, addMat(0xffc83d, .9), 0, .035, 0, .9); goalRing.rotation.x = -HP; goalRing.visible = false;
    var SLASH = [mesh(scene, GEO.arc, addMat(0xffffff, 0), 0, .66, 0, 1), mesh(scene, GEO.arc, addMat(TH.sash, 0), 0, .7, 0, 1)], slashT = [0, 0];
    SLASH.forEach(function (m) { m.rotation.x = -HP; m.position.y = 1.15; m.material.depthTest = false; m.renderOrder = 9; });
    /* a white flash where a cut or a shot lands */
    var hitSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: 0xffffff, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false })); hitSpr.visible = false; scene.add(hitSpr); var hitT = 0;
    var tracer = mesh(scene, GEO.box, addMat(0xfff2a8, 0), 0, .6, 0, 1, .05, .05); var tracerT = 0;
    var knife = mesh(scene, GEO.box, glow(0xe9eff7), 0, .6, 0, .3, .04, .08); knife.visible = false; var KN = { on: false, x: 0, z: 0, G: null };
    var PUFFS = [], puffI = 0;
    for (var pi2 = 0; pi2 < 8; pi2++) { var ps = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: lin(0xcfd6e0), transparent: true, opacity: 0, depthWrite: false })); ps.visible = false; scene.add(ps); PUFFS.push({ s: ps, t: 0, vx: 0, vz: 0 }); }
    function puff(x, y, z, n, col) { for (var i = 0; i < n; i++) { var P2 = PUFFS[puffI++ % PUFFS.length], a = i / n * 6.28 + x; P2.s.position.set(x, y, z); P2.s.material.color.set(col || 0xcfd6e0).convertSRGBToLinear(); P2.vx = Math.cos(a) * .9; P2.vz = Math.sin(a) * .9; P2.t = .5; P2.s.visible = true; } }
    var boxObj = new THREE.Group(); boxObj.visible = false; scene.add(boxObj);
    mesh(boxObj, GEO.box, lam(0x2a303c, .4, .7), 0, .17, 0, .56, .34, .44).castShadow = true;
    var boxLid = mesh(boxObj, GEO.box, lam(0x4a5468, .35, .8), 0, .37, 0, .6, .07, .48);
    mesh(boxObj, GEO.box, glow(0xffc83d), 0, .2, .225, .13, .15, .02); mesh(boxObj, GEO.box, glow(0xffc83d), 0, .34, 0, .62, .012, .5);
    var BOX = { on: false, x: 0, z: 0, fall: 0, open: 0 };
    var keyObj = new THREE.Group(); keyObj.visible = false; scene.add(keyObj);
    mesh(keyObj, GEO.torus, glow(0xffc83d), -.2, 0, 0, .36); mesh(keyObj, GEO.box, glow(0xffc83d), .16, 0, 0, .5, .09, .09); mesh(keyObj, GEO.box, glow(0xffc83d), .32, -.1, 0, .09, .18, .09);
    var keyGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: lin(0xffc83d), transparent: true, opacity: .7, blending: THREE.AdditiveBlending, depthWrite: false })); keyGlow.scale.setScalar(1.6); keyObj.add(keyGlow);
    var KEYFLY = { on: false, t: 0, x0: 0, z0: 0, done: null };

    function solid(cx, cz) { return cx < 0 || cz < 0 || cx >= GW || cz >= GH || grid[cz * GW + cx] !== 0; }
    function cellOf(v) { return Math.floor(v + .5); }
    function freeAt(x, z, r) {
      var x0 = cellOf(x - r), x1 = cellOf(x + r), z0 = cellOf(z - r), z1 = cellOf(z + r);
      for (var cz = z0; cz <= z1; cz++) for (var cx = x0; cx <= x1; cx++) if (solid(cx, cz)) return false;
      return true;
    }
    /* distance a ray travels before it meets a wall or crate (grid DDA, no allocation) */
    function castRay(ox, oz, ang, maxD) {
      var dx = Math.cos(ang), dz = Math.sin(ang), px = ox + .5, pz = oz + .5, cx = Math.floor(px), cz = Math.floor(pz);
      var stepX = dx > 0 ? 1 : -1, stepZ = dz > 0 ? 1 : -1, tDX = dx !== 0 ? Math.abs(1 / dx) : 1e9, tDZ = dz !== 0 ? Math.abs(1 / dz) : 1e9;
      var tMX = dx > 0 ? (cx + 1 - px) * tDX : dx < 0 ? (px - cx) * tDX : 1e9, tMZ = dz > 0 ? (cz + 1 - pz) * tDZ : dz < 0 ? (pz - cz) * tDZ : 1e9, t = 0;
      for (var n = 0; n < 40; n++) {
        if (tMX < tMZ) { t = tMX; tMX += tDX; cx += stepX; } else { t = tMZ; tMZ += tDZ; cz += stepZ; }
        if (t >= maxD) return maxD;
        if (solid(cx, cz)) return t;
      }
      return maxD;
    }
    function los(ax, az, bx, bz, d) { return castRay(ax, az, Math.atan2(bz - az, bx - ax), d) >= d - .02; }
    function angDiff(a, b) { var d = a - b; return Math.atan2(Math.sin(d), Math.cos(d)); }
    function clearWalk(ax, az, bx, bz) {
      var dx = bx - ax, dz = bz - az, d = Math.sqrt(dx * dx + dz * dz), n = Math.ceil(d / .2);
      for (var s = 1; s <= n; s++) if (!freeAt(ax + dx * s / n, az + dz * s / n, HR)) return false;
      return true;
    }
    /* shortest path on the grid (Dijkstra, eight directions, no corner cutting), then straightened */
    var NCELL = GW * GH, pDist = new Float32Array(NCELL), pPrev = new Int16Array(NCELL), pDone = new Uint8Array(NCELL), pCells = new Int16Array(NCELL);
    var NBX = [1, -1, 0, 0, 1, 1, -1, -1], NBZ = [0, 0, 1, -1, 1, -1, 1, -1];
    function findPath(sx, sz, tx, tz, out) {
      var scx = cellOf(sx), scz = cellOf(sz), tcx = cellOf(tx), tcz = cellOf(tz), sc = scz * GW + scx, tc = tcz * GW + tcx, i, c, best, bd;
      if (solid(tcx, tcz) || solid(scx, scz)) return 0;
      if (sc === tc) { out[0] = tx; out[1] = tz; return 1; }
      for (i = 0; i < NCELL; i++) { pDist[i] = 1e9; pPrev[i] = -1; pDone[i] = 0; }
      pDist[sc] = 0;
      for (;;) {
        best = -1; bd = 1e9;
        for (i = 0; i < NCELL; i++) if (!pDone[i] && pDist[i] < bd) { bd = pDist[i]; best = i; }
        if (best < 0 || best === tc) break;
        pDone[best] = 1;
        var bx = best % GW, bz = (best - bx) / GW;
        for (i = 0; i < 8; i++) {
          var nx = bx + NBX[i], nz = bz + NBZ[i];
          if (solid(nx, nz)) continue;
          c = nz * GW + nx;
          if (pDone[c] || (i >= 4 && (solid(nx, bz) || solid(bx, nz)))) continue;
          var nd = bd + (i >= 4 ? 1.4142 : 1);
          if (nd < pDist[c]) { pDist[c] = nd; pPrev[c] = best; }
        }
      }
      if (best !== tc) return 0;
      var n = 0; c = tc; while (c !== sc && c >= 0 && n < NCELL) { pCells[n++] = c; c = pPrev[c]; }
      var px = sx, pz = sz, m = 0, at = n - 1, exact = freeAt(tx, tz, HR);
      while (at >= 0 && m < 60) {
        var far = at, fx = 0, fz = 0;
        for (i = 0; i <= at; i++) {
          var qx = pCells[i] % GW, qz = (pCells[i] - qx) / GW;
          fx = i === 0 && exact ? tx : qx; fz = i === 0 && exact ? tz : qz;
          if (i === at || clearWalk(px, pz, fx, fz)) { far = i; break; }
        }
        out[m * 2] = fx; out[m * 2 + 1] = fz; m++; px = fx; pz = fz; at = far - 1;
      }
      return m;
    }
    function nearestFloor(x, z, out) {
      var bd = 1e9;
      for (var cz = 0; cz < GH; cz++) for (var cx = 0; cx < GW; cx++) { if (grid[cz * GW + cx]) continue; var d = (cx - x) * (cx - x) + (cz - z) * (cz - z); if (d < bd) { bd = d; out.x = cx; out.z = cz; } }
      return bd < 1e9;
    }


    function disposeRoom() {
      if (!roomGroup) return;
      scene.remove(roomGroup);
      roomGroup.traverse(function (o) { if (o.geometry && o.userData.own) o.geometry.dispose(); if (o.material && o.userData.ownMat) o.material.dispose(); });
      roomGroup = null; guards = [];
    }
    function setTier(n) { tier = n; LAMPS.forEach(function (l) { l.visible = n >= 2; }); guards.forEach(function (G) { lampOn(G, G.cone.visible); }); }
    /* a guard's real light follows his drawn cone: off when he is down, stunned or has given up */
    function lampOn(G, on) {
      G.cone.visible = on; if (!G.lamp) return;
      G.lamp.intensity = on && tier >= 2 ? G.cfg.lampI || 4.2 : 0; G.lamp.shadow.autoUpdate = on && tier >= 2; if (on) G.lamp.shadow.needsUpdate = true;
      G.cone.material.opacity = tier >= 2 ? .55 : 1;
    }
    function buildRoom(k) {
      disposeRoom();
      var vault = k >= N, b = vault ? null : BLOCKS[k], i, x, z;
      room = vault ? makeRoom(data.title + "|vault", "open", 0) : makeRoom(data.title + "|" + b.id, b.room, b.squad.length + 1);
      grid.set(room.grid);
      roomGroup = new THREE.Group(); scene.add(roomGroup);
      var W = new Bake(), Cr = new Bake(), Pr = new Bake(), rnd = seeded("decor:" + (vault ? "vault" : b.id)), metal = TH.metal, isWall = function (ax, az) { return ax >= 0 && az >= 0 && ax < GW && az < GH && room.grid[az * GW + ax] === 1 && !(ax === DOOR_X && az === 0); };
      for (z = 0; z < GH; z++) for (x = 0; x < GW; x++) {
        var v = room.grid[z * GW + x];
        if (x === DOOR_X && z === 0) continue;
        if (v === 1) {
          pushBox(W, x, WALL_H / 2, z, 1, WALL_H, 1, 0xffffff, 0xffffff, [false, isWall(x, z + 1), isWall(x, z - 1), isWall(x + 1, z), isWall(x - 1, z)]);
          /* things on top of the walls: vents, pipes and small lamps, so the blocks do not look bare from above */
          var q = rnd();
          if (q < .1) { Pr.add("box", metal, x, WALL_H + .04, z, .52, .08, .52); Pr.add("box", 0x15171b, x, WALL_H + .085, z, .4, .01, .4); }
          else if (q < .26 && isWall(x + 1, z)) { Pr.add("cyl", metal, x + .5, WALL_H + .07, z - .22, .11, 1.0, .11, 0, 0, HP); Pr.add("cyl", 0x30343c, x + .1, WALL_H + .07, z - .22, .14, .06, .14, 0, 0, HP); }
          else if (q < .36 && isWall(x, z + 1) && z > 0 && z < GH - 2) { Pr.add("cyl", metal, x + .24, WALL_H + .07, z + .5, .1, 1.0, .1, HP, 0, 0); }
          else if (q < .5 && !isWall(x, z + 1) && z < GH - 1) {
            Pr.add("box", 0x20232a, x, WALL_H + .03, z + .34, .3, .07, .16); mesh(roomGroup, GEO.box, glow(0xffffff), x, WALL_H + .04, z + .43, .22, .05, .04);
            var pool = mesh(roomGroup, GEO.disc, poolMat, x, .016, z + 1.05, 1.7, 1.7, 1); pool.rotation.x = -HP;
          }
        } else if (v === 2) {
          if ((x * 7 + z * 13) % 5 === 0) {
            Pr.add("cyl", TH.barrel, x, .4, z, .68, .8, .68); Pr.add("cyl", 0x20232a, x, .24, z, .71, .05, .71); Pr.add("cyl", 0x20232a, x, .58, z, .71, .05, .71); Pr.add("cyl", 0x30343c, x, .805, z, .6, .012, .6); Pr.add("cyl", 0x15171b, x + .16, .815, z + .1, .1, .014, .1);
          } else {
            var hh = .62 + ((x * 3 + z * 5) % 3) * .07; Cr.add("box", 0xffffff, x, hh / 2, z, .86, hh, .86, 0, (((x * 7 + z * 13) % 9) - 4) * .03, 0);
            if ((x + z) % 4 === 0) Cr.add("box", 0xffffff, x + .08, hh + .19, z - .06, .5, .38, .5, 0, .4, 0);
          }
        }
      }
      /* a thin glowing strip along every wall edge that faces the floor, and a pool of cool light under each wall lamp */
      var Ne = new Bake();
      for (z = 0; z < GH; z++) for (x = 0; x < GW; x++) {
        if (!isWall(x, z)) continue;
        if (z < GH - 1 && room.grid[(z + 1) * GW + x] !== 1) Ne.add("box", 0xffffff, x, WALL_H + .012, z + .485, 1, .024, .035);
        if (z > 0 && room.grid[(z - 1) * GW + x] !== 1 && !(x === DOOR_X && z === 1)) Ne.add("box", 0xffffff, x, WALL_H + .012, z - .485, 1, .024, .035);
        if (x < GW - 1 && room.grid[z * GW + x + 1] !== 1) Ne.add("box", 0xffffff, x + .485, WALL_H + .012, z, .035, .024, 1);
        if (x > 0 && room.grid[z * GW + x - 1] !== 1) Ne.add("box", 0xffffff, x - .485, WALL_H + .012, z, .035, .024, 1);
      }
      if (Ne.p.length) roomGroup.add(Ne.mesh(glow(TH.glowLine), false));
      roomGroup.add(W.mesh(matWall));
      if (Cr.p.length) roomGroup.add(Cr.mesh(matCrate));
      if (Pr.p.length) roomGroup.add(Pr.mesh(matProp));
      doorSlab = mesh(roomGroup, GEO.box, matDoor, DOOR_X, .44, 0, .98, .88, .34); doorSlab.castShadow = true;
      doorLamp = mesh(roomGroup, GEO.box, new THREE.MeshBasicMaterial({ color: lin(0xff3b2f), toneMapped: false }), DOOR_X, .94, .16, .62, .07, .1); doorLamp.userData.ownMat = true;
      doorGlow = mesh(roomGroup, GEO.plane, addMat(0x9dffc0, 0), DOOR_X, .02, .1, 1, 1.4, 1); doorGlow.rotation.x = -HP; doorGlow.userData.ownMat = true;
      var mat2 = mesh(roomGroup, GEO.plane, new THREE.MeshBasicMaterial({ map: matTex, color: lin(TH.accent), transparent: true, opacity: .5, depthWrite: false, toneMapped: false }), DOOR_X, .012, 1.05, .9, .9, 1); mat2.rotation.x = -HP; mat2.userData.ownMat = true;
      var pad = mesh(roomGroup, GEO.ring, new THREE.MeshBasicMaterial({ color: lin(TH.sash), transparent: true, opacity: .35, depthWrite: false, toneMapped: false }), START_X, .012, START_Z, .9); pad.rotation.x = -HP; pad.userData.ownMat = true;
      doorOpen = 0; doorWant = 0; grid[DOOR_X] = 1;
      guards = [];
      room.routes.forEach(function (rt, gi2) {
        var boss = gi2 === 0, key = boss ? b.boss : b.squad[gi2 - 1], cfg = boss ? BOSS[key] : GUARD[key];
        var G = { boss: boss, type: key, power: boss ? key : null, cfg: cfg, route: rt, x: 0, z: 0, a: 0, state: "patrol", t: 0, wi: 0, alive: true, hp: 1, speed: 1, run: 2, half: cfg.half, range: cfg.range, turn: cfg.turn, react: cfg.react,
          path: new Float32Array(128), pn: 0, pi: 0, lost: 0, aim: 0, lx: 0, lz: 0, ldx: 0, ldz: 0, phase: 0, probes: 0, boost: 1, base: 0, fall: 0, walk: 0, moved: false, ran: false, cool: 0, patient: null, wait: 0, revived: false,
          rnd: seeded(String(rt.seed)), leg: 0, flipAt: -1, di: 0, dirn: 1, jt: 1, recoil: 0, swing: 0, back: "patrol", seenT: 0, fig: buildFigure(cfg, boss ? "boss" : "guard"), cone: null, pos: null, mark: null, dome: null, shielded: false, lamp: LAMPS[gi2] || null };
        roomGroup.add(G.fig.g);
        var geo = new THREE.BufferGeometry(), pos = new Float32Array((RAYS + 2) * 3), colr = new Float32Array((RAYS + 2) * 3), ind = [];
        for (i = 0; i < RAYS + 2; i++) { var f = i === 0 ? .34 : .07; colr[i * 3] = colr[i * 3 + 1] = colr[i * 3 + 2] = f; pos[i * 3 + 1] = .04; }
        for (i = 1; i <= RAYS; i++) ind.push(0, i + 1, i);
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3)); geo.setAttribute("color", new THREE.BufferAttribute(colr, 3)); geo.setIndex(ind);
        G.cone = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, toneMapped: false }));
        G.cone.frustumCulled = false; G.cone.userData.own = true; G.cone.userData.ownMat = true; G.pos = pos; roomGroup.add(G.cone);
        G.mark = new THREE.Sprite(MARK["!"]); G.mark.scale.setScalar(.6); G.mark.visible = false; roomGroup.add(G.mark);
        if (boss && key === "warden") { G.dome = mesh(roomGroup, GEO.sph, addMat(0x6fd0ff, .3), 0, .6, 0, 1.7); G.dome.userData.ownMat = true; }
        if (G.lamp) { G.lamp.color.set(cfg.cone || 0xfff0b8).convertSRGBToLinear(); G.lamp.angle = Math.min(1.3, cfg.drone ? .95 : cfg.half * 1.04 + .04); G.lamp.distance = cfg.drone ? 3.4 : cfg.range * 1.3; G.lamp.penumbra = cfg.drone ? .3 : .45; G.lamp.shadow.camera.far = G.lamp.distance; }
        guards.push(G);
      });
      for (i = guards.length; i < MAXG; i++) { LAMPS[i].intensity = 0; LAMPS[i].shadow.autoUpdate = false; }
      resetRoom(k);
    }
    /* put everyone back at their posts: the same room, so a new attempt is a fair one */
    function resetRoom(k) {
      var b = k < N ? BLOCKS[k] : null, res = b ? S.results[k] : null, ease = res ? Math.max(.6, 1 - .1 * res.deaths) : 1, slow = res ? Math.min(.3, .06 * res.deaths) : 0;
      H.x = START_X; H.z = START_Z; H.a = -Math.PI / 2; H.alive = true; H.pathN = 0; H.pathI = 0; H.target = null; H.moving = false; H.sprintT = 0; H.potT = 0; H.safeT = 0; H.aim = null; H.atk = null; H.swing = H.swingV = -.4; H.kbx = H.kbz = 0; H.fall = 0; H.vx = 0; H.vz = -1;
      poseFall(H.fig, 0); H.fig.g.visible = true; potObj.visible = false; SMOKE.t = 0; smokeFx.visible = false; PROJ.on = false; bomb.visible = false; KN.on = false; knife.visible = false; BOX.on = false; boxObj.visible = false; keyObj.visible = false; KEYFLY.on = false; goalRing.visible = false;
      doorOpen = 0; doorWant = 0; grid[DOOR_X] = 1; if (doorLamp) setCol(doorLamp.material, 0xff3b2f);
      ALARM.t = 0; alarmUi();
      guards.forEach(function (G, gi2) {
        var rt = G.route, c = G.cfg;
        G.alive = true; G.hp = c.hp || 1; G.fall = 0; G.lost = 0; G.aim = 0; G.pn = 0; G.rnd = seeded(String(rt.seed)); G.leg = 0; G.flipAt = -1; G.di = 0; G.dirn = rt.dir; G.jt = .8 + G.rnd() * 1.5; G.recoil = 0; G.swing = 0; G.seenT = 0; G.boost = 1; G.cool = 0; G.patient = null; G.wait = 0; G.revived = false;
        G.speed = c.speed * ease; G.run = c.run * ease; G.react = c.react + slow;
        poseFall(G.fig, 0); G.fig.g.scale.setScalar(G.fig.scale); G.fig.ring.visible = true; if (G.fig.star) G.fig.star.visible = true; lampOn(G, true); setCol(G.cone.material, c.cone || 0xfff0b8); G.mark.visible = false;
        if (rt.kind === "sentry") { G.x = rt.pts[0].x; G.z = rt.pts[0].z; G.a = rt.dirs[0]; G.state = "pause"; G.t = rt.pause + 1; }
        else if (rt.kind === "loop") { var c0 = Math.floor(rt.phase * 4) % 4; G.x = rt.pts[c0].x; G.z = rt.pts[c0].z; G.wi = (c0 + rt.dir + 4) % 4; G.a = Math.atan2(rt.pts[G.wi].z - G.z, rt.pts[G.wi].x - G.x); G.state = "patrol"; }
        else { G.x = rt.pts[0].x + (rt.pts[1].x - rt.pts[0].x) * rt.phase; G.z = rt.pts[0].z + (rt.pts[1].z - rt.pts[0].z) * rt.phase; G.wi = rt.dir > 0 ? 1 : 0; G.a = Math.atan2(rt.pts[G.wi].z - G.z, rt.pts[G.wi].x - G.x); G.state = "patrol"; }
        /* nobody may be looking at the way in when the room starts */
        var dx = START_X - G.x, dz = START_Z - G.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d <= G.range + 1 && Math.abs(angDiff(Math.atan2(dz, dx), G.a)) <= G.half + .2 && G.half < 3) { G.a += Math.PI; if (rt.kind === "line") G.wi = 1 - G.wi; }
        if (res && res.cleared) { if (gi2 === 0) { G.alive = false; G.fall = 1; poseFall(G.fig, 1); lampOn(G, false); G.fig.ring.visible = false; if (G.fig.star) G.fig.star.visible = false; } else surrender(G); }
        G.shielded = false;
      });
      refreshShield();
      if (res && res.cleared) dropBox(guards.length ? guards[0].x : START_X, guards.length ? guards[0].z : START_Z - 3, true);
      renderTargets(); syncFigures(0);
    }

    /* ======================================================================
       Guards. Routine: patrol, pause, turn. When the hunter stands in a
       guard's light the guard NOTICES him and a reaction time starts; if it
       runs out with the hunter still in the light the guard strikes (a shot,
       or a charge for those without a gun). If the hunter gets out of the
       light first, the guard CHASES: he runs to where he last saw the hunter,
       then on in the direction the hunter was heading, and SEARCHES there
       before he gives up and walks back to his post.
       ====================================================================== */
    var ALARM = { t: 0, x: 0, z: 0, tick: 0 };
    var alarmEl = el("div", { class: "nthview-alarm nthview-hidden", role: "status" }, [el("b", { text: "ALARM" }), el("span", { text: "Every guard is coming. Break the line of sight and hide." })]);
    col.appendChild(alarmEl);
    function alarmUi() { var on = ALARM.t > 0; alarmEl.classList.toggle("nthview-hidden", !on); container.classList.toggle("nthview-alarmed", on); }
    function soldiersLeft() { var n = 0; for (var i = 1; i < guards.length; i++) if (guards[i].alive && guards[i].state !== "surrender") n++; return n; }
    function refreshShield() {
      var Bs = guards[0]; if (!Bs || Bs.power !== "warden") return;
      var was = Bs.shielded; Bs.shielded = Bs.alive && soldiersLeft() > 0; if (Bs.dome) Bs.dome.visible = Bs.shielded;
      if (was && !Bs.shielded && Bs.alive && S.mode === "play") { toast("The Warden's shield is down."); sfx("power"); }
    }
    function renderTargets() {
      targetRow.textContent = ""; var left = 0;
      guards.forEach(function (G, i) {
        var up = G.alive && G.state !== "surrender"; if (up) left++;
        var dot = el("span", { class: "nthview-tgt" + (i === 0 ? " nthview-bossdot" : "") + (up ? "" : " nthview-down"), title: G.cfg.name });
        if (up && i > 0) { dot.style.background = "#" + new THREE.Color(G.cfg.ring).getHexString(); dot.style.boxShadow = "0 0 6px #" + new THREE.Color(G.cfg.ring).getHexString(); }
        targetRow.appendChild(dot);
      });
      targetRow.setAttribute("aria-label", guards.length ? left + " of " + guards.length + " guards left" : "No guards here");
    }
    function setMark(G, kind) { G.mark.visible = !!kind; if (kind) G.mark.material = MARK[kind]; }
    function surrender(G) { G.state = "surrender"; G.fig.ring.visible = false; lampOn(G, false); setMark(G, null); G.fig.g.scale.set(G.fig.scale, G.fig.scale * .72, G.fig.scale); }
    function aware(G) { return G.state === "chase" || G.state === "fire" || G.state === "slash"; }
    function busy(G) { return G.state === "notice" || G.state === "fire" || G.state === "chase" || G.state === "slash" || G.state === "struck" || G.state === "stun" || G.state === "sweep" || G.state === "surrender"; }
    function coneCol(G, c) { setCol(G.cone.material, c); if (G.lamp) G.lamp.color.set(c).convertSRGBToLinear(); }
    function calm(G) { coneCol(G, G.cfg.cone || 0xfff0b8); setMark(G, null); G.boost = 1; G.aim = 0; }
    function pathTo(G, x, z) { if (!freeAt(x, z, HR)) { if (!nearestFloor(x, z, _np)) return 0; x = _np.x; z = _np.z; } G.pn = findPath(G.x, G.z, x, z, G.path); G.pi = 0; return G.pn; }
    function turnTo(G, want, rate) { var d = angDiff(want, G.a); if (Math.abs(d) <= rate) { G.a = want; return true; } G.a += d > 0 ? rate : -rate; return false; }
    /* walk toward a point, turning first; true on arrival */
    function walkTo(G, tx, tz, speed, dt) {
      var dx = tx - G.x, dz = tz - G.z, d = Math.sqrt(dx * dx + dz * dz), step = speed * dt;
      if (d <= step || d < .02) { G.x = tx; G.z = tz; return true; }
      var want = Math.atan2(dz, dx);
      turnTo(G, want, G.turn * (speed > G.speed * 1.2 ? 2.2 : 1) * dt);
      if (Math.abs(angDiff(want, G.a)) < .6) { G.x += dx / d * step; G.z += dz / d * step; G.moved = true; G.leg += step; }
      return false;
    }
    function followPath(G, speed, dt) {
      if (G.pi >= G.pn) return true;
      if (walkTo(G, G.path[G.pi * 2], G.path[G.pi * 2 + 1], speed, dt)) G.pi++;
      return G.pi >= G.pn;
    }
    function newLeg(G) {
      G.leg = 0; G.flipAt = -1;
      if (G.power === "sprinter" && G.route.kind === "line" && G.rnd() < .55) { var a = G.route.pts[0], b2 = G.route.pts[1]; G.flipAt = (.35 + G.rnd() * .4) * (Math.abs(b2.x - a.x) + Math.abs(b2.z - a.z)); }
    }
    function goHome(G) {
      var rt = G.route, pt = rt.kind === "sentry" ? rt.pts[0] : rt.pts[G.wi];
      calm(G); G.state = pathTo(G, pt.x, pt.z) ? "return" : (rt.kind === "sentry" ? "pause" : "patrol"); G.t = 1;
    }
    /* he has seen the hunter: remember where, and which way the hunter was going */
    function sight(G) { G.lx = H.x; G.lz = H.z; G.ldx = H.vx; G.ldz = H.vz; G.lost = 0; if (ALARM.t > 0) { ALARM.x = H.x; ALARM.z = H.z; } }
    function notice(G) {
      G.state = "notice"; G.t = G.react * (ALARM.t > 0 ? .7 : 1); G.aim = 0; G.patient = null; setMark(G, "!"); sight(G); sfx("alert");
      if (G.cfg.alarm) raiseAlarm(G);
      if (!S.seenHint) { S.seenHint = true; toast("Seen! Get out of his light before he strikes.", 2600); }
    }
    function startChase(G, x, z, dx, dz) {
      G.state = "chase"; G.phase = 0; G.lx = x; G.lz = z; G.ldx = dx; G.ldz = dz; G.aim = 0; G.lost = 0; G.probes = G.cfg.probes + (ALARM.t > 0 ? 1 : 0); setMark(G, "?"); coneCol(G, 0xffb347);
      if (!pathTo(G, x, z)) startSearch(G, G.cfg.search);
    }
    function startSearch(G, secs) { G.state = "search"; G.t = secs * (ALARM.t > 0 ? 1.4 : 1); G.base = G.a; setMark(G, "?"); coneCol(G, 0xffd27a); }
    function raiseAlarm(G) {
      var fresh = ALARM.t <= 0;
      ALARM.t = 10; ALARM.x = H.x; ALARM.z = H.z; ALARM.tick = 0; alarmUi();
      if (fresh) { sfx("siren"); say("Alarm! " + G.cfg.name + " has raised the alarm."); kick(.04); }
      guards.forEach(function (o) {
        if (o === G || !o.alive || busy(o) || o.state === "heal") return;
        o.patient = null; startChase(o, ALARM.x, ALARM.z, 0, 0); o.boost = o.cfg.melee ? 1.08 : 1.3;
      });
    }
    /* smoke hides: nobody sees into the cloud, or through it */
    var SMOKE = { t: 0, x: 0, z: 0, r: 1.9 };
    function smoked(G) {
      if (SMOKE.t <= 0) return false;
      var hx = H.x - SMOKE.x, hz = H.z - SMOKE.z; if (hx * hx + hz * hz <= SMOKE.r * SMOKE.r) return true;
      var ax = H.x - G.x, az = H.z - G.z, k = ((SMOKE.x - G.x) * ax + (SMOKE.z - G.z) * az) / (ax * ax + az * az || 1);
      if (k <= 0 || k >= 1) return false;
      var px = G.x + ax * k - SMOKE.x, pz = G.z + az * k - SMOKE.z; return px * px + pz * pz < SMOKE.r * SMOKE.r * .8;
    }
    function inLight(G, dx, dz, d) { return d <= G.range && (G.half > 3 || Math.abs(angDiff(Math.atan2(dz, dx), G.a)) <= G.half) && los(G.x, G.z, H.x, H.z, d) && !smoked(G); }
    /* the prowler: at any moment he may turn round, or snap a look to one side */
    function twitch(G, dt) {
      G.jt -= dt; if (G.jt > 0) return false;
      G.jt = .8 + G.rnd() * 2; var rt = G.route;
      if (G.rnd() < .5 && rt.kind !== "sentry") { if (rt.kind === "loop") { G.dirn = -G.dirn; G.wi = (G.wi + G.dirn + 4) % 4; } else G.wi = 1 - G.wi; newLeg(G); return false; }
      G.back = G.state; G.state = "glance"; G.t = .5; G.base = G.a + (G.rnd() < .5 ? 1 : -1) * (1.3 + G.rnd() * 1.5); return true;
    }
    function updateGuard(G, dt) {
      G.moved = false; G.ran = false;
      if (!G.alive) { if (G.fall < 1) { G.fall = Math.min(1, G.fall + dt * 3.2); poseFall(G.fig, G.fall); } return; }
      if (G.state === "surrender" || (S.mode !== "play" && S.mode !== "dead")) return;
      var dx = H.x - G.x, dz = H.z - G.z, d = Math.sqrt(dx * dx + dz * dz), rt = G.route, c = G.cfg;
      var lit = H.alive && S.mode === "play" && H.potT <= 0 && G.state !== "stun" && G.state !== "struck" && inLight(G, dx, dz, d);
      if (G.cool > 0) G.cool -= dt;
      if (G.recoil > 0) G.recoil -= dt;
      if (lit) G.seenT = c.track || 0; else if (G.seenT > 0) G.seenT -= dt;
      if (lit && !busy(G)) notice(G);
      switch (G.state) {
        case "notice":
          turnTo(G, Math.atan2(dz, dx), G.turn * 2.2 * dt);
          if (lit) {
            sight(G); G.t -= dt; coneCol(G, G.t < G.react * .5 ? 0xff5a3c : 0xff9a3c);
            if (G.t <= 0) { if (c.melee || c.noGun) startChase(G, H.x, H.z, H.vx, H.vz); else { G.state = "fire"; G.t = 0; } }
          } else { G.lost += dt; if (G.lost > .22 || !H.alive) { if (H.alive && S.mode === "play") startChase(G, G.lx, G.lz, G.ldx, G.ldz); else goHome(G); } }
          break;
        case "fire":
          if (H.alive) turnTo(G, Math.atan2(dz, dx), G.turn * 2.4 * dt);
          coneCol(G, 0xff3b30); setMark(G, "!");
          if (lit) { sight(G); G.t -= dt; if (G.t <= 0) { shoot(G, true); G.t = .5; } }
          else { G.lost += dt; if (G.lost > .3) { if (H.alive && S.mode === "play") startChase(G, G.lx, G.lz, G.ldx, G.ldz); else goHome(G); } }
          break;
        case "chase":
          G.ran = true;
          if (lit) {
            sight(G); setMark(G, "!"); coneCol(G, 0xff5a3c);
            if (c.melee || c.noGun) { G.wait -= dt; if (G.wait <= 0) { G.wait = .2; pathTo(G, H.x, H.z); G.phase = 0; } }
            else { G.aim += dt; if (G.aim >= G.react * .6) { G.state = "fire"; G.t = 0; break; } }
          } else {
            G.aim = Math.max(0, G.aim - dt); setMark(G, "?"); coneCol(G, 0xffb347);
            if (G.seenT > 0 && H.alive && H.potT <= 0) { G.wait -= dt; if (G.wait <= 0) { G.wait = .25; G.lx = H.x; G.lz = H.z; G.ldx = H.vx; G.ldz = H.vz; G.phase = 0; pathTo(G, H.x, H.z); } }
          }
          if (followPath(G, G.run * G.boost, dt)) {
            if (G.phase === 0 && (G.ldx || G.ldz)) {
              /* nobody at the last place he saw the hunter: carry on the way the hunter was heading */
              G.phase = 1; var gl = Math.sqrt(G.ldx * G.ldx + G.ldz * G.ldz) || 1;
              if (!pathTo(G, G.lx + G.ldx / gl * 3.5, G.lz + G.ldz / gl * 3.5)) startSearch(G, c.search);
            } else startSearch(G, c.search);
          }
          break;
        case "search":
          G.t -= dt;
          if (c.jumpy) { G.jt -= dt; if (G.jt <= 0) { G.jt = .3 + G.rnd() * .5; G.base = G.rnd() * 6.283; } turnTo(G, G.base, G.turn * 2 * dt); }
          else G.a = G.base + Math.sin((c.search - G.t) * 2.6) * 1.25;
          if (G.t <= 0) {
            if (G.probes > 0) {
              G.probes--; var pa = G.rnd() * 6.28, pr = 2 + G.rnd() * 2.5, px = ALARM.t > 0 ? ALARM.x : G.x + Math.cos(pa) * pr, pz = ALARM.t > 0 ? ALARM.z : G.z + Math.sin(pa) * pr;
              if (pathTo(G, px, pz)) { G.state = "probe"; break; }
            }
            goHome(G);
          }
          break;
        case "probe": G.ran = true; if (followPath(G, G.run * .8 * G.boost, dt)) startSearch(G, c.search * .6); break;
        case "seek": G.ran = true; if (followPath(G, G.run * .8, dt)) startSearch(G, c.search * .7); break;
        case "glance": turnTo(G, G.base, G.turn * 2 * dt); G.t -= dt; if (G.t <= 0) G.state = G.back; break;
        case "struck": break;
        case "slash":
          /* the blade's swing: it lands when the swing ends, if the hunter is still within reach */
          G.t -= dt; G.swing = 1 - Math.max(0, G.t) / .22;
          if (G.t <= 0) {
            G.swing = 0; G.state = "chase"; G.wait = 0;
            if (H.alive && S.mode === "play" && !H.atk && H.potT <= 0 && d < 1.05) { slashFx(0, H.x, H.z, G.a); hurt(G, "blade"); if (H.alive) knockBack(G, 1.2); }
          }
          break;
        case "patrol":
          if (c.jumpy && twitch(G, dt)) break;
          if (rt.kind === "sentry") { G.state = "pause"; G.t = rt.pause + 1; break; }
          if (walkTo(G, rt.pts[G.wi].x, rt.pts[G.wi].z, G.speed, dt)) {
            if (rt.kind === "loop") { G.wi = (G.wi + G.dirn + 4) % 4; newLeg(G); }
            else { G.state = "pause"; G.t = (G.power === "sprinter" ? .25 : rt.pause) * (c.pauseMul || 1); }
          } else if (G.flipAt > 0 && G.leg >= G.flipAt) { G.wi = 1 - G.wi; newLeg(G); }
          break;
        case "pause":
          G.t -= dt;
          if (G.t <= 0) {
            if (rt.kind === "sentry") { G.di = (G.di + 1) % rt.dirs.length; G.state = "turn"; }
            else { G.wi = 1 - G.wi; G.state = "patrol"; newLeg(G); }
          }
          break;
        case "turn": if (turnTo(G, rt.dirs[G.di], G.turn * .6 * dt)) { G.state = "pause"; G.t = (rt.pause + 1.4) * (c.pauseMul || 1); } break;
        case "return": if (followPath(G, G.speed * 1.15, dt)) { G.state = rt.kind === "sentry" ? "pause" : "patrol"; G.t = 1; newLeg(G); } break;
        case "stun": G.t -= dt; if (G.t <= 0) { G.state = "sweep"; G.t = 3.2; lampOn(G, true); } break;
        case "sweep": G.t -= dt; G.a += 1.97 * dt; if (lit) { notice(G); break; } if (G.t <= 0) goHome(G); break;
        case "revive":
          if (!G.patient || G.patient.alive) { G.patient = null; goHome(G); break; }
          G.ran = true; if (followPath(G, G.run * .8, dt)) { G.state = "heal"; G.t = 2.6; setMark(G, "+"); }
          break;
        case "heal":
          G.t -= dt; if (lit) { notice(G); break; }
          if (!G.patient || G.patient.alive) { G.patient = null; goHome(G); break; }
          if (G.t <= 0) { wake(G.patient); G.patient = null; goHome(G); }
          break;
      }
      /* a blade who has seen the hunter cuts him down when he gets there, unless the hunter is behind him */
      if (c.melee && aware(G) && G.state !== "slash" && H.alive && S.mode === "play" && !H.atk && H.potT <= 0 && d < .8 && H.safeT <= 0 && Math.abs(angDiff(Math.atan2(dz, dx), G.a)) < 1.25) swing(G);
      if (G.moved) G.walk += dt * (G.ran ? 15 : 9) * Math.max(1, G.speed);
    }
    function wake(D) {
      D.alive = true; D.hp = D.cfg.hp || 1; D.fall = 0; D.revived = true; poseFall(D.fig, 0); D.fig.ring.visible = true; lampOn(D, true); calm(D); startSearch(D, 2);
      renderTargets(); refreshShield(); sfx("power"); toast("A medic woke " + (D.cfg.name === "Officer" ? "an" : "a") + " " + D.cfg.name + ". Take the medic down first.", 3000);
    }
    function hurt(G, how) {
      if (H.safeT > 0) return;
      if (S.inv.vest > 0) { S.inv.vest--; renderPowers(); H.safeT = 1.8; hitFlash(); toast("The vest took the " + how + ". Get away!", 2200); say("The vest took the " + how + "."); return; }
      die(G, how);
    }
    function shoot(G, hit) {
      var gx = G.x + Math.cos(G.a) * .5, gz = G.z + Math.sin(G.a) * .5, tx = hit ? H.x : G.lx, tz = hit ? H.z : G.lz;
      tracer.position.set((gx + tx) / 2, .6, (gz + tz) / 2); tracer.rotation.y = -Math.atan2(tz - gz, tx - gx); tracer.scale.x = Math.max(.2, Math.sqrt((tx - gx) * (tx - gx) + (tz - gz) * (tz - gz)));
      tracer.material.opacity = 1; tracerT = .12; flashLight.position.set(gx, .7, gz); flashLight.intensity = 3; G.recoil = .14; sfx("shot"); puff(tx, .5, tz, 2, 0xffe0a0);
      if (hit) { hitSpr.position.set(H.x, .8, H.z); hitSpr.visible = true; hitT = .16; hurt(G, "shot"); }
    }
    /* a blade who has reached the hunter swings; the cut lands at the end of the swing */
    function swing(G) { G.state = "slash"; G.t = .22; G.swing = 0; G.a = Math.atan2(H.z - G.z, H.x - G.x); setMark(G, "!"); sfx("slash"); }
    function alarmOthers(G) {
      var any = false;
      guards.forEach(function (o) {
        if (o === G || !o.alive || busy(o) || o.state === "heal" || o.state === "revive") return;
        var dx = o.x - G.x, dz = o.z - G.z; if (dx * dx + dz * dz <= 25) {
          if (o.cfg.medic && !G.boss && !G.cfg.drone && !G.revived && !o.patient) { o.patient = G; o.state = "revive"; setMark(o, "+"); if (!pathTo(o, G.x, G.z)) { o.patient = null; goHome(o); } }
          else if (pathTo(o, G.x, G.z)) { o.state = "seek"; o.probes = 0; setMark(o, "?"); coneCol(o, 0xffd27a); }
          any = true;
        }
      });
      if (any) { sfx("huh"); if (!G.boss && !S.heardHint) { S.heardHint = true; toast("The others heard that. Get out of sight!", 2600); } }
    }
    function knockBack(G, dist) {
      var dx = H.x - G.x, dz = H.z - G.z, d = Math.sqrt(dx * dx + dz * dz) || 1;
      for (var s = dist; s > 0; s -= .15) if (freeAt(H.x + dx / d * s, H.z + dz / d * s, HR)) { H.x += dx / d * s; H.z += dz / d * s; break; }
      H.pathN = 0; H.moving = false; H.target = null; H.bounceT = .5;
    }
    /* the hunter has reached a guard. It is a takedown unless something about this guard stops it. */
    function strike(G) {
      if (H.atk || G.state === "struck") return;
      var front = Math.abs(angDiff(Math.atan2(H.z - G.z, H.x - G.x), G.a)) < 1.2;
      if (G.shielded) { if (H.bounceT <= 0) { knockBack(G, 1); sfx("clang"); toast("Shielded! Take down the soldiers first."); } return; }
      if (G.state === "stun") { if (H.bounceT <= 0) knockBack(G, .6); return; }
      if (!G.cfg.drone) {
        if (G.cfg.frontProof && front) { if (H.bounceT <= 0) { knockBack(G, 1); sfx("clang"); toast("His shield stops you. Get behind him."); if (!busy(G)) notice(G); G.t = Math.min(G.t, .25); } return; }
        if (aware(G) && front) {   /* never run at a guard who is already after you */
          if (H.bounceT > 0 || G.state === "slash") return;
          if (G.cfg.melee) swing(G); else { G.state = "fire"; G.t = .5; G.a = Math.atan2(H.z - G.z, H.x - G.x); shoot(G, true); if (H.alive) knockBack(G, 1); }
          return;
        }
      }
      startAttack(G);
    }
    /* the takedown: the hunter steps in and cuts twice with his sword, then the guard goes down */
    function startAttack(G) {
      H.atk = { G: G, t: 0, c: 0 }; H.pathN = 0; H.target = null; H.moving = false; H.safeT = Math.max(H.safeT, .5); H.a = Math.atan2(G.z - H.z, G.x - H.x);
      G.state = "struck"; setMark(G, null); lampOn(G, false); endPot();
    }
    function updateAttack(dt) {
      var A = H.atk, G = A.G, dx = G.x - H.x, dz = G.z - H.z, d = Math.sqrt(dx * dx + dz * dz) || 1, k;
      A.t += dt; H.a = Math.atan2(dz, dx);
      if (d > .62) { var st = Math.min(d - .62, 6 * dt); if (freeAt(H.x + dx / d * st, H.z + dz / d * st, HR)) { H.x += dx / d * st; H.z += dz / d * st; } }
      if (A.c === 0) { A.c = 1; sfx("slash"); slashFx(0, G.x, G.z, H.a - .55); }
      if (A.c === 1 && A.t >= .18) { A.c = 2; sfx("slash"); slashFx(1, G.x, G.z, H.a + .55); puff(G.x, .6, G.z, 3); kick(.03); G.a += .6; }
      k = Math.max(0, Math.min(1, A.t < .18 ? A.t / .16 : (A.t - .18) / .16)); k = k * k * (3 - 2 * k);
      H.swing = A.t < .18 ? -1.75 + 3.2 * k : 1.45 - 3.2 * k;
      if (A.t >= .36) { H.atk = null; if (G.hp > 1) stagger(G, true); else takedown(G); }
    }
    function stagger(G, push) {
      G.hp--; G.state = "stun"; G.t = 1.1; lampOn(G, false); setMark(G, null); if (push) knockBack(G, .9); sfx("clang"); kick(.05);
      toast((G.boss ? G.cfg.name : "The " + G.cfg.name) + " staggers. Hide, then hit him again!", 2400);
    }
    /* the arc a blade leaves in the air; two of them make the hunter's double cut */
    function slashFx(i, x, z, ang) {
      SLASH[i].position.x = x - Math.cos(ang) * .35; SLASH[i].position.z = z - Math.sin(ang) * .35; SLASH[i].rotation.z = -ang; SLASH[i].material.opacity = 1; slashT[i] = .26;
      hitSpr.position.set(x, .8, z); hitSpr.visible = true; hitT = .16;
    }
    function takedown(G) {
      G.alive = false; G.state = "down"; G.fall = 0; G.fig.ring.visible = false; lampOn(G, false); setMark(G, null); if (G.dome) G.dome.visible = false; if (G.fig.star) G.fig.star.visible = false;
      if (!settings.reduced) slowT = G.boss ? .5 : .22;
      puff(G.x, .5, G.z, 4); kick(G.boss ? .06 : .03);
      if (!G.revived) { var n = G.boss ? 8 : 3; S.gems += n; flyGems(G.x, G.z, n); }
      guards.forEach(function (o) { if (o.patient === G) o.patient = null; });
      if (H.target === G) { H.target = null; H.pathN = 0; H.moving = false; }
      alarmOthers(G); renderTargets(); refreshShield();
      say(G.cfg.name + " is down.");
      if (G.boss) bossDown(G);
    }
    function dropBox(x, z, quiet) {
      BOX.on = true; BOX.x = x; BOX.z = z; BOX.fall = quiet ? 1 : 0; BOX.open = 0; boxObj.visible = true; boxObj.position.set(x, quiet ? 0 : 2.6, z); boxLid.position.y = .37; boxLid.rotation.z = 0;
      goalRing.visible = true; goalRing.position.set(x, .035, z);
    }
    function bossDown(G) {
      var k = S.k, left = soldiersLeft();
      for (var i = 1; i < guards.length; i++) if (guards[i].alive) surrender(guards[i]);
      ALARM.t = 0; alarmUi(); renderTargets();
      if (!left) { S.gems += 5; setTimeout(function () { toast("Clean sweep! +5 gems", 1800); renderScore(); bump(gemChip); }, 900); }
      S.results[k].cleared = true; S.mode = "clear"; H.aim = null; endPot(); renderPowers();
      dropBox(G.x, G.z, false);
      setTimeout(function () { if (S.mode === "clear") { toast(G.cfg.name + " is down" + (left ? " and the guards give up" : "") + ". Take the secret box.", 3200); } }, settings.reduced ? 100 : 900);
      persist();
    }
    function die(G, how) {
      if (!H.alive) return;
      H.alive = false; H.fall = 0; H.pathN = 0; H.moving = false; H.target = null; H.atk = null; S.mode = "dead"; S.killer = G; S.killHow = how;
      var kd = Math.sqrt((H.x - G.x) * (H.x - G.x) + (H.z - G.z) * (H.z - G.z)) || 1; H.kbx = (H.x - G.x) / kd * 2.4; H.kbz = (H.z - G.z) / kd * 2.4; H.a = Math.atan2(G.z - H.z, G.x - H.x); endPot();
      S.deaths++; S.results[S.k].deaths++; hitFlash(); kick(.09); if (!settings.reduced) slowT = .5;
      say(hero + " was caught."); saveNow();
      setTimeout(function () { if (S.mode === "dead") deathCard(G); }, settings.reduced ? 350 : 1200);
    }

    /* ---------- the hunter ---------- */
    var KEYS = { up: false, down: false, left: false, right: false }, _np = { x: 0, z: 0 };
    function canMove() { return (S.mode === "play" || S.mode === "clear" || S.mode === "trial" || S.mode === "exit") && !S.paused && H.alive; }
    function goTo(x, z, ring) {
      if (!freeAt(x, z, HR)) { if (!nearestFloor(x, z, _np)) return false; x = _np.x; z = _np.z; }
      var n = findPath(H.x, H.z, x, z, H.path);
      if (!n) return false;
      H.pathN = n; H.pathI = 0; H.moving = true;
      if (ring) { tapRing.position.set(x, .03, z); tapT = .5; }
      return true;
    }
    function guardNear(x, z, r) {
      var best = null, bd = r * r;
      for (var i = 0; i < guards.length; i++) { var G = guards[i]; if (!G.alive || G.state === "surrender") continue; var d = (G.x - x) * (G.x - x) + (G.z - z) * (G.z - z); if (d < bd) { bd = d; best = G; } }
      return best;
    }
    /* what a thrown knife or grenade goes for: the guard the hunter is facing, or else the nearest one in plain sight */
    function pickTarget() {
      var best = null, bd = 1e9, face = null, fd = 1e9;
      for (var i = 0; i < guards.length; i++) {
        var G = guards[i]; if (!G.alive || G.state === "surrender" || G.state === "struck") continue;
        var dx = G.x - H.x, dz = G.z - H.z, d = Math.sqrt(dx * dx + dz * dz);
        if (d > 7.5 || !los(H.x, H.z, G.x, G.z, d)) continue;
        if (d < bd) { bd = d; best = G; }
        if (Math.abs(angDiff(Math.atan2(dz, dx), H.a)) < .5 && d < fd) { fd = d; face = G; }
      }
      return face || best;
    }
    var PROJ = { on: false, kind: "", x0: 0, z0: 0, x1: 0, z1: 0, t: 0 };
    function launch(kind, x, z) { PROJ.on = true; PROJ.kind = kind; PROJ.x0 = H.x; PROJ.z0 = H.z; PROJ.x1 = x; PROJ.z1 = z; PROJ.t = 0; bomb.visible = true; setCol(bomb.material, kind === "grenade" ? 0x3f5a2a : 0xaab4c2); sfx("slash"); }
    function throwAt(kind) {
      if (KN.on || PROJ.on) return;
      var G = pickTarget(); if (!G) { toast("No guard in plain sight."); return; }
      endPot(); S.inv[kind]--; renderPowers(); H.a = Math.atan2(G.z - H.z, G.x - H.x); H.pathN = 0; H.target = null;
      if (kind === "knife") { KN.on = true; KN.x = H.x; KN.z = H.z; KN.G = G; knife.visible = true; sfx("slash"); } else launch("grenade", G.x, G.z);
    }
    function throwSmoke(x, z) {
      if (PROJ.on || !S.inv.smoke) return;
      var dx = x - H.x, dz = z - H.z, d = Math.sqrt(dx * dx + dz * dz) || 1, m = Math.min(d, 6.5); x = H.x + dx / d * m; z = H.z + dz / d * m;
      if (!freeAt(x, z, .1) && nearestFloor(x, z, _np)) { x = _np.x; z = _np.z; }
      endPot(); S.inv.smoke--; H.aim = null; renderPowers(); H.a = Math.atan2(dz, dx); launch("smoke", x, z);
    }
    function smokeAhead() { var r = Math.max(.8, Math.min(3.2, castRay(H.x, H.z, H.a, 3.7) - .5)); throwSmoke(H.x + Math.cos(H.a) * r, H.z + Math.sin(H.a) * r); }
    function explode(x, z) {
      sfx("boom"); kick(.1); flashLight.position.set(x, .8, z); flashLight.intensity = 7; puff(x, .5, z, 8, 0xffc070); boomRing.position.set(x, .05, z); boomT = .4;
      if (S.mode !== "play") return;
      var hit = guards.filter(function (G) { return G.alive && G.state !== "surrender" && (G.x - x) * (G.x - x) + (G.z - z) * (G.z - z) <= 3.3; });
      hit.forEach(function (G) {
        if (!G.alive || G.state === "surrender") return;
        if (G.shielded) { toast("The Warden's shield holds."); return; }
        if (H.atk && H.atk.G === G) H.atk = null;
        if (G.hp > 1) stagger(G, false); else takedown(G);
      });
      /* everyone heard that */
      guards.forEach(function (o) { if (!o.alive || busy(o) || o.state === "heal" || o.state === "revive") return; if (pathTo(o, x, z)) { o.state = "seek"; o.probes = 0; setMark(o, "?"); coneCol(o, 0xffd27a); } });
    }
    function updateProj(dt) {
      if (SMOKE.t > 0) { SMOKE.t -= dt; if (SMOKE.t <= 0) { smokeFx.visible = false; if (S.mode === "play") toast("The smoke clears."); } }
      if (H.potT > 0) { H.potT -= dt; if (H.potT <= 0) { endPot(); toast("The disguise is over."); } }
      if (!PROJ.on) return;
      PROJ.t += dt / .45; var k = Math.min(1, PROJ.t);
      bomb.position.set(PROJ.x0 + (PROJ.x1 - PROJ.x0) * k, .55 + Math.sin(k * Math.PI) * 1.5, PROJ.z0 + (PROJ.z1 - PROJ.z0) * k); bomb.rotation.x += dt * 12;
      if (k >= 1) {
        PROJ.on = false; bomb.visible = false;
        if (PROJ.kind === "grenade") explode(PROJ.x1, PROJ.z1);
        else { SMOKE.t = 6; SMOKE.x = PROJ.x1; SMOKE.z = PROJ.z1; smokeFx.position.set(SMOKE.x, 0, SMOKE.z); smokeFx.visible = true; sfx("power"); puff(SMOKE.x, .5, SMOKE.z, 6); say("Smoke. Nobody can see into it."); }
      }
    }
    /* the flower-pot disguise ends when it runs out, or when the hunter moves, strikes or throws */
    function endPot() { if (H.potT > 0 || potObj.visible) { H.potT = 0; potObj.visible = false; H.fig.g.visible = true; } }
    function tapAt(x, z) {
      if (!canMove()) return;
      if (S.mode === "play" && H.aim === "smoke") { throwSmoke(x, z); return; }
      endPot();
      if (S.mode === "play") {
        var G = guardNear(x, z, .85);
        if (G) { H.target = G; H.repath = 0; tapRing.position.set(G.x, .03, G.z); tapT = .5; return; }
      }
      H.target = null;
      if (S.mode === "exit" && Math.abs(x - DOOR_X) < .8 && z < .9) { goTo(DOOR_X, 0, true); return; }
      if (S.mode === "clear" && BOX.on && Math.abs(x - BOX.x) < .8 && Math.abs(z - BOX.z) < .8) { goTo(BOX.x, BOX.z, true); return; }
      goTo(x, z, true);
    }
    function updateHero(dt) {
      if (!H.alive) {
        if (H.fall < 1) { H.fall = Math.min(1, H.fall + dt * 3); poseFall(H.fig, H.fall); var kx2 = H.kbx * dt * (1 - H.fall), kz2 = H.kbz * dt * (1 - H.fall); if (freeAt(H.x + kx2, H.z + kz2, HR)) { H.x += kx2; H.z += kz2; } }
        return;
      }
      if (H.sprintT > 0) H.sprintT -= dt;
      if (H.safeT > 0) H.safeT -= dt;
      if (H.bounceT > 0) H.bounceT -= dt;
      if (H.atk) { if (S.mode === "play") updateAttack(dt); else H.atk = null; H.moving = false; return; }
      var auto = S.mode === "vault" && !S.paused;
      if (!canMove() && !auto) { H.moving = false; return; }
      var speed = 5 * (H.sprintT > 0 ? 1.9 : 1), kx = (KEYS.right ? 1 : 0) - (KEYS.left ? 1 : 0), kz = (KEYS.down ? 1 : 0) - (KEYS.up ? 1 : 0), step, ox = H.x, oz = H.z;
      if ((kx || kz) && !auto) {
        var kl = Math.sqrt(kx * kx + kz * kz); step = speed * dt; H.pathN = 0; H.target = null; H.moving = true; H.a = Math.atan2(kz, kx); endPot();
        if (freeAt(H.x + kx / kl * step, H.z, HR)) H.x += kx / kl * step;
        if (freeAt(H.x, H.z + kz / kl * step, HR)) H.z += kz / kl * step;
      } else {
        if (H.target) {
          if (!H.target.alive || H.target.state === "surrender") { H.target = null; H.pathN = 0; }
          else {
            H.repath -= dt;
            if (H.repath <= 0) { H.repath = .18; var n = findPath(H.x, H.z, H.target.x, H.target.z, H.path); H.pathN = n; H.pathI = 0; }
            var td = Math.sqrt((H.target.x - H.x) * (H.target.x - H.x) + (H.target.z - H.z) * (H.target.z - H.z));
            if (td < 1.9) speed *= 1.7;   /* the lunge */
          }
        }
        if (H.pathI < H.pathN) {
          var tx = H.path[H.pathI * 2], tz = H.path[H.pathI * 2 + 1], dx = tx - H.x, dz = tz - H.z, d = Math.sqrt(dx * dx + dz * dz); step = speed * dt;
          if (d <= step) { H.x = tx; H.z = tz; H.pathI++; } else { H.x += dx / d * step; H.z += dz / d * step; H.a = Math.atan2(dz, dx); }
          H.moving = true;
        } else H.moving = false;
      }
      if (H.moving) { H.walk += dt * 22; var mx = H.x - ox, mz = H.z - oz; if (mx * mx + mz * mz > 1e-7) { H.vx = mx; H.vz = mz; } }
      var i, G, gd;
      if (S.mode === "play") {
        if (H.potT <= 0) for (i = 0; i < guards.length; i++) { G = guards[i]; if (!G.alive || G.state === "surrender") continue; gd = (G.x - H.x) * (G.x - H.x) + (G.z - H.z) * (G.z - H.z); if (gd < .4) { strike(G); break; } }
      } else if (S.mode === "clear" && BOX.on && BOX.fall >= 1) {
        if ((BOX.x - H.x) * (BOX.x - H.x) + (BOX.z - H.z) * (BOX.z - H.z) < .36) takeBox();
      } else if (S.mode === "exit" && H.z < .3) { H.pathN = 0; H.moving = false; leaveRoom(); }
      else if (auto && S.finale.done && H.z < .3) { H.pathN = 0; H.moving = false; reachedExit(); }
    }
    function updateKnife(dt) {
      if (!KN.on) return;
      var G = KN.G, dx = G.x - KN.x, dz = G.z - KN.z, d = Math.sqrt(dx * dx + dz * dz), step = 15 * dt;
      if (d <= step + .3) {
        KN.on = false; knife.visible = false;
        if (G.alive && S.mode === "play") {
          if (G.shielded) { sfx("clang"); toast("The shield stops the knife."); }
          else if (G.cfg.frontProof && Math.abs(angDiff(Math.atan2(H.z - G.z, H.x - G.x), G.a)) < 1.2) { sfx("clang"); toast("His shield stops the knife."); if (!busy(G)) notice(G); }
          else if (G.state === "struck") { /* the hunter got there first */ }
          else if (G.hp > 1) stagger(G, false);
          else { slashFx(0, G.x, G.z, Math.atan2(G.z - H.z, G.x - H.x)); takedown(G); }
        }
        return;
      }
      KN.x += dx / d * step; KN.z += dz / d * step; knife.position.set(KN.x, .6, KN.z); knife.rotation.y = -Math.atan2(dz, dx);
    }
    function updateAlarm(dt) {
      if (ALARM.t <= 0) return;
      ALARM.t -= dt; ALARM.tick -= dt;
      if (ALARM.t <= 0 || S.mode !== "play") { ALARM.t = 0; alarmUi(); return; }
      if (ALARM.tick <= 0) {
        /* the guards talk to each other: everyone who is chasing without a sighting heads for the newest one */
        ALARM.tick = 1;
        for (var i = 0; i < guards.length; i++) { var G = guards[i]; if (G.alive && G.state === "chase" && G.aim <= 0 && (Math.abs(G.lx - ALARM.x) + Math.abs(G.lz - ALARM.z)) > 1.5) { G.lx = ALARM.x; G.lz = ALARM.z; G.ldx = 0; G.ldz = 0; G.phase = 0; pathTo(G, ALARM.x, ALARM.z); } }
      }
    }

    /* ---------- one-time powers ---------- */
    /* the powers the hunter can use himself; the vest works on its own */
    function usable() { return REWARDS.filter(function (p2) { return p2 !== "vest" && S.inv[p2] > 0; }); }
    function renderPowers() {
      powerBar.textContent = "";
      var show = S.mode === "play" || S.mode === "lesson", act = usable();
      if (act.indexOf(S.sel) === -1) S.sel = act[0] || null;
      REWARDS.forEach(function (p2, i) {
        if (!S.inv[p2]) return;
        var info = POWER_INFO[p2], passive = p2 === "vest", on = (p2 === "smoke" && H.aim === "smoke") || (p2 === "pot" && H.potT > 0) || (p2 === "sprint" && H.sprintT > 0);
        var b = el("button", { type: "button", class: "nthview-power" + (passive ? " nthview-passive" : "") + (on ? " nthview-armed" : "") + (p2 === S.sel ? " nthview-psel" : ""), title: info.name + ": " + info.help, "aria-label": info.name + ", " + S.inv[p2] + " left" + (p2 === S.sel ? ", selected" : "") + ". " + info.help + (passive ? "" : " Key " + (i + 1) + ".") }, [icon(info.icon, 26), el("i", { text: String(S.inv[p2]) })]);
        b.addEventListener("click", function () { if (!passive) S.sel = p2; usePower(p2, true); });
        powerBar.appendChild(b);
      });
      powerBar.classList.toggle("nthview-hidden", !show || !powerBar.firstChild);
    }
    /* Q and E walk through the powers; Space uses the selected one */
    function cyclePower(step) {
      var act = usable(); if (!act.length) return;
      S.sel = act[(act.indexOf(S.sel) + step + act.length) % act.length]; renderPowers(); toast(POWER_INFO[S.sel].name + " selected. Space uses it.", 1600);
    }
    function usePower(p2, tapped) {
      if (S.mode !== "play" || S.paused || !H.alive || !S.inv[p2] || H.atk) { if (S.mode === "lesson" && S.inv[p2]) toast(POWER_INFO[p2].name + ": " + POWER_INFO[p2].help, 4200); return; }
      if (p2 === "sprint") { if (H.sprintT > 0) return; endPot(); S.inv.sprint--; H.sprintT = 6; sfx("power"); toast("Sprint! Six seconds of double speed."); }
      else if (p2 === "knife" || p2 === "grenade") throwAt(p2);
      else if (p2 === "smoke") {
        if (tapped) { H.aim = H.aim === "smoke" ? null : "smoke"; toast(H.aim ? "Tap where the smoke should land." : "Smoke put away."); }
        else { H.aim = null; smokeAhead(); }
      } else if (p2 === "pot") {
        if (H.potT > 0) return;
        S.inv.pot--; H.potT = 8; H.pathN = 0; H.target = null; H.moving = false; H.aim = null; potObj.visible = true; potObj.position.set(H.x, 0, H.z); H.fig.g.visible = false; sfx("power");
        toast("You are a flower pot. Stay still: the lights pass over you.", 3000); say(hero + " is disguised as a flower pot for eight seconds.");
      } else { toast("The vest is on: it takes the next hit for you."); }
      renderPowers(); canvas.focus({ preventScroll: true });
    }
    function copyInv(from, to) { REWARDS.forEach(function (p2) { to[p2] = from[p2]; }); }

    /* ---------- effects ---------- */
    var slowT = 0, shakeT = 0, shakeA = 0, T = 0, gemTimer = 0;
    function kick(a) { if (settings.reduced) return; shakeA = a; shakeT = .25; }
    function flyGems(x, z, n) {
      renderScoreSoon(n);
      if (settings.reduced) return;
      var from = toScreen(x, .5, z, _scr), sx = from.x, sy = from.y, cr = container.getBoundingClientRect(), tr = gemChip.getBoundingClientRect(), ex = tr.left - cr.left + 6, ey = tr.top - cr.top + 4;
      for (var i = 0; i < Math.min(n, gemEls.length); i++) (function (g, i2) {
        g.style.transition = "none"; g.style.opacity = "1"; g.style.transform = "translate(" + (sx + Math.cos(i2 * 2.4) * 22) + "px," + (sy + Math.sin(i2 * 2.4) * 22) + "px) rotate(45deg)";
        setTimeout(function () { g.style.transition = "transform .55s cubic-bezier(.5,0,.3,1),opacity .2s linear .45s"; g.style.transform = "translate(" + ex + "px," + ey + "px) rotate(45deg) scale(.6)"; g.style.opacity = "0"; }, 180 + i2 * 45);
      })(gemEls[i], i);
    }
    function renderScoreSoon(n) { clearTimeout(gemTimer); gemTimer = setTimeout(function () { renderScore(); bump(gemChip); sfx("gem"); }, settings.reduced ? 0 : 650); }
    /* copy the simulation into the scene: figures, lights, cones, markers */
    function syncFigures(dt) {
      var i, G, ca, sa;
      H.fig.g.position.x = H.x; H.fig.g.position.z = H.z; H.fig.g.rotation.y = -H.a; animWalk(H.fig, H.walk, H.moving && H.alive, true);
      if (H.atk) H.swingV = H.swing; else H.swingV += (-.4 - H.swingV) * Math.min(1, dt * 12);
      H.fig.sword.rotation.y = H.swingV; H.fig.sword.rotation.z = H.atk ? -.05 : .1; H.fig.body.rotation.y = H.atk ? H.swingV * .35 : 0;
      heroGlow.position.x = H.x; heroGlow.position.z = H.z; heroGlow.material.opacity = H.safeT > 0 ? .9 : H.sprintT > 0 ? .7 : .4; heroLight.position.set(H.x, .9, H.z);
      if (smokeFx.visible) { var sk = Math.min(1, SMOKE.t * 1.5, (6 - SMOKE.t) * 4); for (i = 0; i < smokeBits.length; i++) { smokeBits[i].scale.setScalar((2.2 + Math.sin(T * 1.3 + i * 1.7) * .35) * (.4 + .6 * sk)); smokeBits[i].material.rotation = T * .25 + i; } smokeBits[0].material.opacity = .62 * Math.max(0, sk); }
      if (boomT > 0) { boomT -= dt; boomRing.material.opacity = Math.max(0, boomT * 2.5); boomRing.scale.setScalar(1 + (.4 - boomT) * 9); }
      for (i = 0; i < guards.length; i++) {
        G = guards[i]; ca = Math.cos(G.a); sa = Math.sin(G.a);
        G.fig.g.position.x = G.x; G.fig.g.position.z = G.z; G.fig.g.rotation.y = -G.a; if (G.alive) animWalk(G.fig, G.walk, G.moved, G.ran);
        if (G.recoil > 0) G.fig.body.position.x = -G.recoil * .9; else if (G.fig.body.position.x) G.fig.body.position.x = 0;
        if (G.fig.sword) G.fig.sword.rotation.y = G.state === "slash" ? -1.7 + 3.1 * G.swing : -.4;
        if (G.fig.star && G.fig.star.visible) G.fig.star.rotation.y = T * 2;
        if (G.mark.visible) G.mark.position.set(G.x, (G.cfg.drone ? 1.75 : 1.5) * G.fig.scale, G.z);
        if (G.dome && G.dome.visible) { G.dome.position.x = G.x; G.dome.position.z = G.z; G.dome.material.opacity = .22 + Math.sin(T * 4) * .08; }
        if (G.cone.visible) {
          var pos = G.pos, a0 = G.a - G.half, da = G.half * 2 / RAYS;
          pos[0] = G.x; pos[2] = G.z;
          for (var r = 0; r <= RAYS; r++) { var ang = a0 + da * r, dist = castRay(G.x, G.z, ang, G.range), o = (r + 1) * 3; pos[o] = G.x + Math.cos(ang) * dist; pos[o + 2] = G.z + Math.sin(ang) * dist; }
          G.cone.geometry.attributes.position.needsUpdate = true;
          if (G.lamp && tier >= 2) {
            if (G.cfg.drone) { G.lamp.position.set(G.x, 1.2, G.z); G.lamp.target.position.set(G.x + ca * .01, 0, G.z + sa * .01); }
            else { G.lamp.position.set(G.x + ca * .3, .62 * G.fig.scale, G.z + sa * .3); G.lamp.target.position.set(G.x + ca * G.range * .8, .1, G.z + sa * G.range * .8); }
          }
        }
      }
      for (i = 0; i < PUFFS.length; i++) { var P2 = PUFFS[i]; if (P2.t > 0) { P2.t -= dt; P2.s.position.x += P2.vx * dt; P2.s.position.z += P2.vz * dt; P2.s.position.y += dt * .5; P2.s.material.opacity = Math.max(0, P2.t * 1.2); P2.s.scale.setScalar(.3 + (.5 - P2.t) * 1.4); if (P2.t <= 0) P2.s.visible = false; } }
      if (flashLight.intensity > 0) flashLight.intensity = Math.max(0, flashLight.intensity - dt * 30);
      if (tapT > 0) { tapT -= dt; tapRing.material.opacity = Math.max(0, tapT * 2); tapRing.scale.setScalar(.5 + (.5 - tapT) * .9); }
      for (i = 0; i < 2; i++) if (slashT[i] > 0) { slashT[i] -= dt; SLASH[i].material.opacity = Math.max(0, slashT[i] / .26); SLASH[i].scale.setScalar(1.7 + (.26 - slashT[i]) * 4); }
      if (hitT > 0) { hitT -= dt; hitSpr.material.opacity = Math.max(0, hitT / .16) * .9; hitSpr.scale.setScalar(1.2 + (.16 - hitT) * 9); if (hitT <= 0) hitSpr.visible = false; }
      if (tracerT > 0) { tracerT -= dt; tracer.material.opacity = Math.max(0, tracerT / .12); }
      if (goalRing.visible) { var gs = .8 + Math.sin(T * 5) * .12; goalRing.scale.setScalar(gs); }
      if (BOX.on && BOX.fall < 1) { BOX.fall = Math.min(1, BOX.fall + dt * 2.2); var e = BOX.fall, y = e < .7 ? 2.6 * (1 - (e / .7) * (e / .7)) : Math.sin((e - .7) / .3 * Math.PI) * .18; boxObj.position.y = y; if (e >= 1) boxObj.position.y = 0; }
      if (BOX.on && BOX.open > 0 && BOX.open < 1) { BOX.open = Math.min(1, BOX.open + dt * 2.5); boxLid.rotation.z = BOX.open * 1.2; boxLid.position.y = .37 + BOX.open * .1; }
      if (KEYFLY.on) {
        KEYFLY.t = Math.min(1, KEYFLY.t + dt * (settings.reduced ? 4 : 1.1)); var kt = KEYFLY.t, ke = kt * kt * (3 - 2 * kt);
        keyObj.position.set(KEYFLY.x0 + (DOOR_X - KEYFLY.x0) * ke, .5 + Math.sin(kt * Math.PI) * 1.6 + ke * .1, KEYFLY.z0 + (.3 - KEYFLY.z0) * ke); keyObj.rotation.y = T * 6;
        if (kt >= 1) { KEYFLY.on = false; keyObj.visible = false; var fn = KEYFLY.done; KEYFLY.done = null; if (fn) fn(); }
      }
      if (doorOpen !== doorWant) { doorOpen += (doorWant > doorOpen ? 1 : -1) * Math.min(Math.abs(doorWant - doorOpen), dt * 1.4); doorSlab.position.y = .44 - doorOpen * .9; doorGlow.material.opacity = doorOpen * .5; }
    }
    function openDoor() { doorWant = 1; grid[DOOR_X] = 0; setCol(doorLamp.material, 0x3dff8a); sfx("door"); goalRing.visible = true; goalRing.position.set(DOOR_X, .035, .9); }

    /* ======================================================================
       Room trials: the eight in-room activity types. They are played in the
       quiet room after the boss has fallen, so nothing is timed and reading
       never overlaps with danger. Spots are places on the floor; walking onto
       one (or pressing its label) chooses it.
       ====================================================================== */
    var TR = null, trialGroup = null;
    var SPOT_COL = { idle: 0x4aa3ff, lit: 0xffc83d, ok: 0x3ddc84, no: 0xff5a4a, off: 0x596274 };
    var TRIAL_TITLE = { lanes: "Pick the right crate", gates: "Choose the archway", torches: "Light the right lamps", planks: "True or false?", harvest: "Collect what belongs", levers: "Step in order", tiles: "File them", collect: "Collect the tokens" };
    function showCallout(kick, text) { cKick.textContent = kick || ""; cText.textContent = ""; if (text) cText.appendChild(rich(text)); cBig.textContent = ""; cLegend.textContent = ""; cFb.textContent = ""; cFb.className = "nthview-cfb"; cAct.textContent = ""; callout.classList.remove("nthview-off"); callout.scrollTop = 0; }
    function hideCallout() { callout.classList.add("nthview-off"); }
    function setFb(msg, tone) { cFb.className = "nthview-cfb" + (tone ? " nthview-" + tone : ""); cFb.textContent = ""; cFb.appendChild(rich(msg)); }
    function cButton(label, fn) { var b = el("button", { type: "button", text: label }); b.addEventListener("click", fn); cAct.appendChild(b); return b; }
    function setSpot(sp, state, text) {
      sp.state = state; setCol(sp.baseMat, SPOT_COL[state]);
      if (sp.bulbMat) setCol(sp.bulbMat, state === "lit" || state === "ok" ? 0xffe9a0 : 0x2c3340);
      [sp.labelEl, sp.legendEl].forEach(function (n) { n.classList.toggle("nthview-ok", state === "ok"); n.classList.toggle("nthview-no", state === "no"); n.classList.toggle("nthview-lit", state === "lit"); n.classList.toggle("nthview-gone", state === "off"); });
      if (text !== undefined) { sp.labelEl.textContent = text; sp.legendEl.textContent = text; }
    }
    function buildSpot(sp, kind) {
      var g = new THREE.Group(); g.position.set(sp.x, 0, sp.z);
      sp.baseMat = new THREE.MeshBasicMaterial({ color: lin(SPOT_COL.idle), toneMapped: false });
      var base = mesh(g, GEO.cyl, sp.baseMat, 0, .02, 0, kind === "plate" ? .92 : .8, .04, kind === "plate" ? .92 : .8); base.userData.ownMat = true;
      if (kind === "crate") mesh(g, GEO.box, matCrate, 0, .28, 0, .5).castShadow = true;
      else if (kind === "arch") { var st = lam(TH.wallTop); mesh(g, GEO.box, st, -.4, .45, 0, .1, .9, .12); mesh(g, GEO.box, st, .4, .45, 0, .1, .9, .12); mesh(g, GEO.box, st, 0, .93, 0, .92, .1, .14); }
      else if (kind === "lamp") { mesh(g, GEO.cyl, lam(0x3a4252), 0, .3, 0, .07, .6, .07); sp.bulbMat = new THREE.MeshBasicMaterial({ color: lin(0x2c3340), toneMapped: false }); mesh(g, GEO.sph, sp.bulbMat, 0, .68, 0, .24).userData.ownMat = true; }
      else if (kind === "bin") { mesh(g, GEO.box, lam(0x2f3644), 0, .16, 0, .62, .3, .62).castShadow = true; }
      else if (kind === "badge") { sp.token = mesh(g, GEO.oct, glow(0xffc83d), 0, .4, 0, .3, .12, .3); }
      sp.g = g; trialGroup.add(g);
    }
    function placeLabels() {
      labelsDirty = false;
      if (!TR) return;
      TR.spots.forEach(function (sp) { var p2 = toScreen(sp.x, 0, sp.z + .56, _scr); sp.labelEl.style.left = Math.round(p2.x) + "px"; sp.labelEl.style.top = Math.round(p2.y) + "px"; });
    }
    function startTrial(k) {
      var b = BLOCKS[k], a = b.data.activity, type = b.type, defs = [];
      if (type === "lanes") a.options.forEach(function (o) { defs.push({ label: o.label, kind: "crate", o: o }); });
      else if (type === "gates") a.paths.forEach(function (o) { defs.push({ label: o.label, kind: "arch", o: o }); });
      else if (type === "torches") a.items.forEach(function (o) { defs.push({ label: o.label, kind: "lamp", o: o }); });
      else if (type === "planks") defs = [{ label: "True", kind: "plate", v: true }, { label: "False", kind: "plate", v: false }];
      else if (type === "harvest") a.items.forEach(function (o) { defs.push({ label: o.label, kind: "badge", o: o }); });
      else if (type === "levers") shuffledIdx(a.items.length, "levers" + a.prompt).forEach(function (i) { defs.push({ label: a.items[i].label, kind: "plate", idx: i }); });
      else if (type === "tiles") a.bins.forEach(function (o) { defs.push({ label: o.label, kind: "bin", o: o }); });
      else a.items.forEach(function (o) { defs.push({ label: o, kind: "badge" }); });
      var free = room.spots.filter(function (s) { return (s.x - H.x) * (s.x - H.x) + (s.z - H.z) * (s.z - H.z) > 1.4; });
      if (free.length < defs.length) free = room.spots.slice();
      trialGroup = new THREE.Group(); scene.add(trialGroup);
      TR = { k: k, type: type, a: a, spots: [], notes: [], step: 0, done: false, left: 0 };
      S.mode = "trial"; H.pathN = 0; H.target = null; renderPowers();
      showCallout("Secret box · " + (a.title || TRIAL_TITLE[type]), a.prompt);
      defs.slice(0, free.length).forEach(function (d, i) {
        var sp = { x: free[i].x, z: free[i].z, def: d, armed: true, on: false, gone: false, state: "idle", bulbMat: null, token: null };
        var text = type === "collect" || type === "planks" ? d.label : (i + 1) + " · " + d.label;
        sp.labelEl = el("button", { type: "button", class: "nthview-spot", text: text, "aria-label": "Walk to " + d.label });
        sp.legendEl = el("button", { type: "button", text: text, "aria-label": "Walk to " + d.label });
        var walk = function () { if (TR && !TR.done && canMove()) { H.target = null; goTo(sp.x, sp.z, true); canvas.focus({ preventScroll: true }); } };
        sp.labelEl.addEventListener("click", walk); sp.legendEl.addEventListener("click", walk);
        labels.appendChild(sp.labelEl); cLegend.appendChild(sp.legendEl);
        buildSpot(sp, d.kind); TR.spots.push(sp);
      });
      placeLabels();
      if (type === "torches") cButton("Check the lamps", checkLamps);
      else if (type === "harvest") { TR.left = a.items.filter(function (o) { return o.belongs; }).length; if (!STRICT) cButton("Show me the rest", function () { revealHarvest(); }); }
      else if (type === "collect") { TR.left = TR.spots.length; cButton("Collect the rest for me", function () { TR.spots.forEach(function (sp) { if (!sp.gone) { sp.gone = true; if (sp.token) sp.token.visible = false; setSpot(sp, "off"); } }); finishTrial(300); }); }
      trialPrompt();
      say((a.title || TRIAL_TITLE[type]) + ". " + plain(a.prompt) + " " + TYPE_HELP[type]);
    }
    function trialPrompt() {
      var a = TR.a;
      if (TR.type === "planks") { cKick.textContent = "Secret box · statement " + (TR.step + 1) + " of " + a.planks.length; cBig.textContent = plain(a.planks[TR.step].text); }
      else if (TR.type === "tiles") { cKick.textContent = "Secret box · file " + (TR.step + 1) + " of " + a.items.length; cBig.textContent = "Carrying: " + a.items[TR.step].label; }
      else if (TR.type === "levers") cBig.textContent = TR.step ? TR.step + " of " + a.items.length + " in place" : "";
    }
    function trialWrong(cost, msg, note) {
      S.results[TR.k].mistakes += cost; S.results[TR.k].notes.push(plain(note || msg)); TR.notes.push(note || msg);
      setFb(msg, "no"); sfx("no"); hitFlash(); kick(.03); losePick(cost);
    }
    function flashSpot(sp, state) { setSpot(sp, state); setTimeout(function () { if (TR && TR.spots.indexOf(sp) !== -1 && !TR.done && sp.state === state) setSpot(sp, "idle"); }, 800); }
    function checkLamps() {
      if (!TR || TR.done) return;
      var wrong = TR.spots.filter(function (sp) { return sp.on !== sp.def.o.lit; });
      if (!wrong.length) { TR.spots.forEach(function (sp) { setSpot(sp, sp.on ? "ok" : "off"); }); setFb("Exactly the right lamps!", "ok"); sfx("ok"); finishTrial(900); return; }
      if (STRICT) { trialWrong(1, wrong.length + (wrong.length === 1 ? " lamp is" : " lamps are") + " wrong. Change them and check again."); return; }
      wrong.forEach(function (sp) { TR.notes.push(sp.def.label + (sp.def.o.lit ? " should be lit." : " should stay dark.")); });
      trialWrong(wrong.length, wrong.length + (wrong.length === 1 ? " lamp was" : " lamps were") + " wrong. The room now shows the right ones.", wrong.length + " lamps wrong");
      TR.notes.pop();
      TR.spots.forEach(function (sp) { sp.on = sp.def.o.lit; setSpot(sp, wrong.indexOf(sp) !== -1 ? "no" : sp.on ? "ok" : "off"); });
      cAct.textContent = ""; TR.done = true; cButton("Continue", function () { TR.done = false; finishTrial(0); }).focus({ preventScroll: true });
    }
    function revealHarvest() {
      if (!TR || TR.done) return;
      var missed = TR.spots.filter(function (sp) { return sp.def.o.belongs && !sp.gone; });
      missed.forEach(function (sp) { sp.gone = true; setSpot(sp, "lit"); TR.notes.push(sp.def.label + " belongs too."); });
      if (missed.length) { trialWrong(missed.length, "You missed " + missed.length + ". They are lit up now.", "missed " + missed.length); TR.notes.pop(); }
      cAct.textContent = ""; TR.done = true; cButton("Continue", function () { TR.done = false; finishTrial(0); }).focus({ preventScroll: true });
    }
    function onSpot(sp) {
      var a = TR.a, type = TR.type, d = sp.def, right;
      if (type === "lanes" || type === "gates") {
        if (sp.state === "no") return;
        if (d.o.id === a.answer) { setSpot(sp, "ok"); setFb("Right: " + d.label + ".", "ok"); sfx("ok"); finishTrial(900); return; }
        setSpot(sp, "no"); right = TR.spots.filter(function (s) { return s.def.o.id === a.answer; })[0];
        trialWrong(1, (d.o.hint || "Not this one.") + (!STRICT && right ? " The answer is " + right.def.label + ": walk there." : ""), d.label + ": " + (d.o.hint || "not the answer."));
        if (!STRICT && right) setSpot(right, "lit");
      } else if (type === "torches") {
        sp.on = !sp.on; setSpot(sp, sp.on ? "lit" : "idle"); sfx("open");
      } else if (type === "planks") {
        var pl = a.planks[TR.step];
        if (d.v === pl.answer) { flashSpot(sp, "ok"); setFb("Right." + (pl.why ? " " + pl.why : ""), "ok"); sfx("pick"); TR.step++; }
        else { flashSpot(sp, "no"); trialWrong(1, "Not quite: it is " + (pl.answer ? "true" : "false") + "." + (pl.why ? " " + pl.why : ""), "“" + plain(pl.text) + "” is " + (pl.answer ? "true" : "false") + "." + (pl.why ? " " + pl.why : "")); if (!STRICT) TR.step++; }
        if (TR.step >= a.planks.length) finishTrial(1200); else trialPrompt();
      } else if (type === "harvest") {
        if (sp.gone || sp.state === "no") return;
        if (d.o.belongs) { sp.gone = true; if (sp.token) sp.token.visible = false; setSpot(sp, "ok"); sfx("pick"); TR.left--; setFb(d.label + " belongs. " + (TR.left ? TR.left + " more to find." : "That is all of them!"), "ok"); if (!TR.left) finishTrial(900); }
        else { setSpot(sp, "no"); trialWrong(1, d.label + " does not belong.", d.label + " does not belong."); }
      } else if (type === "levers") {
        if (sp.state === "ok") return;
        if (d.idx === TR.step) { TR.step++; setSpot(sp, "ok", "✓" + TR.step + " · " + d.label); sfx("pick"); setFb(d.label + " is number " + TR.step + ".", "ok"); trialPrompt(); if (TR.step >= a.items.length) finishTrial(900); }
        else {
          flashSpot(sp, "no"); right = TR.spots.filter(function (s) { return s.def.idx === TR.step; })[0];
          trialWrong(1, d.label + " is not next." + (!STRICT ? " Next is " + right.def.label + "." : ""), "Step " + (TR.step + 1) + " is " + right.def.label + ", not " + d.label + ".");
          if (!STRICT) setSpot(right, "lit");
        }
      } else if (type === "tiles") {
        var it = a.items[TR.step], good = a.bins.filter(function (bn) { return bn.id === it.bin; })[0];
        if (d.o.id === it.bin) { flashSpot(sp, "ok"); setFb(it.label + " goes in " + d.label + ".", "ok"); sfx("pick"); TR.step++; }
        else { flashSpot(sp, "no"); trialWrong(1, it.label + " does not go in " + d.label + "." + (!STRICT ? " It belongs in " + good.label + "." : ""), it.label + " belongs in " + good.label + "."); if (!STRICT) TR.step++; }
        if (TR.step >= a.items.length) finishTrial(1200); else trialPrompt();
      } else {
        if (sp.gone) return;
        sp.gone = true; if (sp.token) sp.token.visible = false; setSpot(sp, "off"); sfx("gem"); TR.left--;
        setFb(TR.left ? TR.left + " left to collect." : "All collected!", "ok"); if (!TR.left) finishTrial(700);
      }
    }
    function updateTrial() {
      if (!TR || TR.done) return;
      for (var i = 0; i < TR.spots.length; i++) {
        var sp = TR.spots[i], d = (sp.x - H.x) * (sp.x - H.x) + (sp.z - H.z) * (sp.z - H.z);
        if (sp.token && sp.token.visible) sp.token.rotation.y = T * 2.4;
        if (sp.armed && d < .3) { sp.armed = false; onSpot(sp); if (!TR || TR.done) return; }
        else if (!sp.armed && d > .85) sp.armed = true;
      }
    }
    function clearTrial() {
      if (trialGroup) { scene.remove(trialGroup); trialGroup.traverse(function (o) { if (o.material && o.userData.ownMat) o.material.dispose(); }); trialGroup = null; }
      labels.textContent = ""; hideCallout(); TR = null;
    }
    function finishTrial(delay) {
      if (!TR || TR.done) return;
      TR.done = true; H.pathN = 0;
      var k = TR.k, tr = TR;
      setTimeout(function () {
        if (TR !== tr) return;
        S.trialNotes = tr.notes.slice(); clearTrial(); S.mode = "stop";
        S.steps = buildSteps(BLOCKS[k]); S.stepI = 0;
        if (S.steps.length) showStep(k, 0); else solve(k);
      }, delay);
    }
    /* ======================================================================
       Panel widgets. Scored widgets report through a question context:
       ctx.wrong(cost, message, reveal) and ctx.right(message).
       Lenient mode reveals the answer and offers Continue; strict mode
       keeps the answer hidden until it is found.
       ====================================================================== */
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
        if (k >= 0) { S.results[k].mistakes += cost; S.results[k].notes.push(plain(msg)); losePick(cost); } else S.finale.mistakes += cost;
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
        var byId = {}, ctr = {};
        a.parts.forEach(function (pt) { ctr[pt.id] = pt.shape === "circle" ? [pt.x, pt.y] : [pt.x + pt.w / 2, pt.y + pt.h / 2]; });
        (a.links || []).forEach(function (l) { svg.appendChild(sv("line", { x1: ctr[l.from][0], y1: ctr[l.from][1], x2: ctr[l.to][0], y2: ctr[l.to][1], stroke: "currentColor", "stroke-width": ".5", "stroke-dasharray": "1.5 1", opacity: ".6" })); });
        var accent = getComputedStyle(container).getPropertyValue("--accent").trim() || "#c9831f";
        a.parts.forEach(function (pt, i) {
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
    function openPanel(compact, label) {
      panel.classList.toggle("nthview-compact", !!compact); panel.setAttribute("aria-label", label || "Lesson");
      panel.classList.add("nthview-open"); panel.scrollTop = 0; renderPowers();
      setTimeout(function () { var f = pbody.querySelector("h2") ? panel : null; if (f) f.focus({ preventScroll: true }); }, 60);
    }
    function closePanel() { panel.classList.remove("nthview-open"); if (!overlayOpen()) canvas.focus({ preventScroll: true }); }
    function panelOpen() { return panel.classList.contains("nthview-open"); }
    function accentFor(k) { var c = k >= 0 && k < N ? BLOCKS[k].color : null; if (c) panel.style.setProperty("--accent", c); else panel.style.removeProperty("--accent"); }
    function page(kicker, title) { accentFor(S.mode === "vault" || S.mode === "finale" ? -1 : S.k); pbody.textContent = ""; pbody.appendChild(el("p", { class: "nthview-kicker", text: kicker })); pbody.appendChild(el("h2", { text: title })); }
    function actions(list) { var r = el("div", { class: "nthview-actions" }); list.forEach(function (x) { r.appendChild(x); }); pbody.appendChild(r); return r; }
    function keyHint(text) { return el("span", { class: "nthview-keyhint", text: text }); }
    function losePick(n) {
      if (!STRICT || n <= 0 || S.alarmOn) return;
      S.picks = Math.max(0, S.picks - n); renderScore(); bump(pickChip); persist();
      if (S.picks <= 0) alarm();
    }
    function reactWrong() { hitFlash(); kick(.03); }
    function reactRight() { sfx("ok"); }

    function introCard() {
      openOverlay("intro"); ocard.textContent = "";
      ocard.appendChild(el("h1", { text: data.title })); if (data.subtitle) ocard.appendChild(p("nthview-kicker", data.subtitle));
      data.intro.paragraphs.forEach(function (t) { ocard.appendChild(p("nthview-big", t)); });
      if (data.intro.steps && data.intro.steps.length) { ocard.appendChild(p("", "**How it works**")); ocard.appendChild(el("ol", {}, data.intro.steps.map(function (s) { var li = el("li"); li.appendChild(rich(s)); return li; }))); }
      ocard.appendChild(p("nthview-small", "Tap or click the floor and " + hero + " runs there. Tap a guard to hunt him. Step into a light and its owner notices: get out of it before he strikes and he must chase and search. Keys: arrows or W A S D move, Space uses the selected power, Q and E switch powers, P pauses."));
      ocard.appendChild(p("nthview-small", (STRICT ? "Quiz mode: a wrong answer breaks a lockpick and the answer stays hidden until you find it. " : "Learning mode: a wrong answer shows the right one and costs a star, never the game. ") + "A guard who keeps " + hero + " in his light long enough strikes, and then only that room starts again."));
      if (data.intro.note) ocard.appendChild(p("nthview-small", data.intro.note));
      var go = primaryBtn("Start", function () { closeOverlay(); sfx("open"); showLesson(0); });
      ocard.appendChild(el("div", { class: "nthview-actions nthview-sticky" }, [go, keyHint("Enter"), restartButton(container, data, KEY)]));
      ocard.lastChild.lastChild.style.marginLeft = "auto";
      setTimeout(function () { go.focus({ preventScroll: true }); }, 60);
    }
    function showLesson(k) {
      S.mode = "lesson"; S.k = k; renderHud(); hideCallout(); persist();
      var b = BLOCKS[k], s = b.data, info = BOSS[b.boss], res = S.results[k];
      page("Block " + (k + 1) + " of " + N, b.name);
      pbody.appendChild(p("nthview-lead", s.lead)); (s.body || []).forEach(function (t) { pbody.appendChild(p("", t)); });
      if (s.findings && !s.findings.after) pbody.appendChild(findingsBox(s.findings));
      var ahead = box(res.cleared ? "The room is clear" : "In this room: " + b.squad.length + " soldiers and " + info.name, "nthview-task");
      if (!res.cleared) ahead.appendChild(squadChips(b));
      var task = b.inRoom ? "the secret box sets a task in the room. " + TYPE_HELP[b.type] : "the secret box asks about this lesson" + ((s.checks || []).length ? ", " + (1 + s.checks.length) + " questions" : "") + ".";
      var at = p("", res.cleared ? "The boss is already down. Take the secret box: " + task : info.line + " When he falls, " + task); at.style.margin = "0"; ahead.appendChild(at);
      pbody.appendChild(ahead);
      if (!res.cleared) {
        /* the first time a kind of soldier turns up, say what he does */
        var seen = {}; for (var q = 0; q < k; q++) BLOCKS[q].squad.forEach(function (t) { seen[t] = true; });
        var fresh = b.squad.filter(function (t, i2, arr) { return !seen[t] && arr.indexOf(t) === i2; });
        if (fresh.length) { var nb = box(k === 0 ? "Who is on guard" : "New here"); fresh.forEach(function (t) { nb.appendChild(guardLine(GUARD[t])); }); pbody.appendChild(nb); }
        if (k === 0) pbody.appendChild(p("nthview-cap", "Step into a light and its owner notices you. Get out of the light before he strikes and he will chase you and search where you went. Stay hidden and he gives up."));
      }
      var have = REWARDS.filter(function (p2) { return S.inv[p2] > 0; });
      if (have.length && !res.cleared) pbody.appendChild(p("nthview-cap", "You carry: " + have.map(function (p2) { return POWER_INFO[p2].name + " ×" + S.inv[p2]; }).join(", ") + ". Use them from the round buttons while you play."));
      actions([primaryBtn(res.cleared ? "Go on ▸" : "Begin ▸", startPlay), keyHint("Enter · tap the floor to move · tap a guard to hunt him")]);
      openPanel(false, "Lesson: " + b.name);
    }
    function hexOf(c) { return "#" + ("000000" + c.toString(16)).slice(-6); }
    function guardDot(cfg) { var d = el("i", { class: "nthview-gdot", "aria-hidden": "true" }); d.style.background = hexOf(cfg.body); d.style.borderColor = hexOf(cfg.ring); return d; }
    /* one line of the guard guide: the uniform colour, the name, what he does */
    function guardLine(cfg) { var r = el("p", { class: "nthview-gline" }, [guardDot(cfg), el("b", { text: cfg.name })]); r.appendChild(doc.createTextNode(" " + cfg.line)); return r; }
    function squadChips(b) {
      var counts = {}, order = [], row = el("div", { class: "nthview-squad" });
      b.squad.forEach(function (t) { if (!counts[t]) { counts[t] = 0; order.push(t); } counts[t]++; });
      order.forEach(function (t) { row.appendChild(el("span", { class: "nthview-gchip" }, [guardDot(GUARD[t]), doc.createTextNode(GUARD[t].name + (counts[t] > 1 ? " ×" + counts[t] : ""))])); });
      row.appendChild(el("span", { class: "nthview-gchip nthview-gboss" }, [guardDot(BOSS[b.boss]), doc.createTextNode(BOSS[b.boss].name)]));
      return row;
    }
    function startPlay() {
      var res = S.results[S.k];
      closePanel(); S.mode = res.cleared ? "clear" : "play"; S.gems0 = S.gems; sfx("open"); renderPowers(); persist();
      if (res.cleared) toast("Take the secret box.", 2400);
      else if (S.k === 0 && !res.deaths) toast("Come at a guard from behind. Stay out of the light.", 3600);
      S.heardHint = S.k > 0;
      say(res.cleared ? "The room is clear. Take the secret box." : "Block " + (S.k + 1) + ". " + guards.length + " guards. Stay out of the flashlights.");
    }
    function takeBox() {
      H.pathN = 0; H.moving = false; goalRing.visible = false; sfx("pick"); S.mode = "stop"; toastEl.classList.remove("nthview-show");
      var k = S.k, b = BLOCKS[k];
      if (b.inRoom) { startTrial(k); return; }
      S.trialNotes = []; S.steps = buildSteps(b); S.stepI = 0;
      if (S.steps.length) showStep(k, 0); else solve(k);
    }
    function buildSteps(b) {
      var s = b.data, steps = [];
      if (!s.activity) steps.push({ quiz: s.quiz });
      else if (b.type === "collect") steps.push({ collect: s.activity, quiz: s.quiz });
      else if (!b.inRoom) steps.push({ act: s.activity, quiz: s.quiz });
      (s.checks || []).forEach(function (c) { steps.push({ act: c }); });
      return steps;
    }
    function showStep(k, i) {
      var steps = S.steps;
      if (i >= steps.length) { solve(k); return; }
      S.mode = "stop"; S.stepI = i;
      var step = steps[i];
      page("Block " + (k + 1) + " · the secret box" + (steps.length > 1 ? " · question " + (i + 1) + " of " + steps.length : ""), i === 0 ? "The secret box" : "One more question");
      if (i === 0) pbody.appendChild(p("nthview-lead", "The box is locked with a question about this lesson. Answer it and the key is yours."));
      var host = el("div"); pbody.appendChild(host);
      var next = function () { showStep(k, i + 1); };
      if (step.collect) {
        var counts = {}; step.collect.items.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
        var top = Object.keys(counts).sort(function (x, y) { return counts[y] - counts[x]; })[0];
        var d = box(step.collect.resultTitle || "The vote");
        d.appendChild(el("div", { class: "nthview-chips" }, step.collect.items.map(function (x) { return el("span", { class: "nthview-chip", "aria-pressed": String(x === top), text: x }); })));
        d.appendChild(el("p", { class: "nthview-readout", text: fillTemplate(step.collect.resultText, { top: top, count: counts[top], total: step.collect.items.length }) }));
        if (step.collect.resultNote) d.appendChild(p("nthview-cap", step.collect.resultNote));
        host.appendChild(d);
      }
      if (step.act && PANEL_EXPLORE.indexOf(step.act.type) !== -1) ACT[step.act.type](host, step.act);
      if (step.quiz) wChoice(host, step.quiz, qctx(k, next), "Question");
      else if (step.act && PANEL_EXPLORE.indexOf(step.act.type) === -1) ACT[step.act.type](host, step.act, qctx(k, next));
      openPanel(false, "The secret box");
    }
    function solve(k) {
      var r = S.results[k], b = BLOCKS[k]; r.done = true; r.stars = starsFor(r.mistakes);
      if (k < N - 1) { var n = r.stars === 3 ? 2 : 1; S.inv[b.reward] = Math.min(3, S.inv[b.reward] + n); S.prize = { power: b.reward, n: n }; }   /* at most three of each are carried */
      else { S.gems += 10; S.prize = { power: null, n: 10 }; }
      copyInv(S.inv, S.invStart); S.gems0 = S.gems;
      renderScore(); persist(); closePanel(); S.mode = "key"; sfx("key");
      if (!BOX.on) dropBox(H.x, H.z, true);
      goalRing.visible = false; BOX.open = .01;
      keyObj.visible = true; KEYFLY.on = true; KEYFLY.t = 0; KEYFLY.x0 = BOX.x; KEYFLY.z0 = BOX.z;
      KEYFLY.done = function () {
        openDoor(); S.mode = "exit"; renderPowers();
        toast("The key fits. Tap the door to leave.", 3200); say("The door is open. Go to the door at the top of the room, or press Enter.");
      };
    }
    function leaveRoom() { S.mode = "solved"; goalRing.visible = false; showSolved(S.k); }
    function showSolved(k) {
      var b = BLOCKS[k], s = b.data, r = S.results[k];
      page("Block " + (k + 1) + " of " + N + " · cleared", "Room cleared");
      pbody.appendChild(el("p", { class: "nthview-stars", "aria-label": r.stars + " of 3 stars", text: starsText(r.stars) }));
      if (S.prize) {
        var pz = box("In the secret box", "nthview-task"), info = S.prize.power ? POWER_INFO[S.prize.power] : null;
        var line = p("", info ? "**" + info.name + (S.prize.n > 1 ? " ×" + S.prize.n : "") + "**. " + info.help + (S.prize.n > 1 ? " Two of them, for answering without a mistake." : "") : "**" + S.prize.n + " gems** for the last room."); line.style.margin = "0";
        pz.appendChild(el("div", { class: "nthview-prize" }, info ? [icon(info.icon, 34), line] : [line])); pbody.appendChild(pz);
      }
      if (S.trialNotes && S.trialNotes.length && !STRICT) { var tb = box("What the task showed"); tb.appendChild(el("ul", {}, S.trialNotes.map(function (n) { var li = el("li"); li.appendChild(rich(n)); return li; }))); pbody.appendChild(tb); }
      if (s.findings && s.findings.after) pbody.appendChild(findingsBox(s.findings));
      if (s.aside) { var ad = box(s.aside.title); var at = p("", s.aside.text); at.style.margin = "0"; ad.appendChild(at); pbody.appendChild(ad); }
      var rem = el("div", { class: "nthview-remember" }, [el("p", { class: "nthview-box-title", text: "Remember" })]); var rt = p("", s.remember); rt.style.margin = "0"; rem.appendChild(rt); pbody.appendChild(rem);
      var nxt = k < N - 1 ? primaryBtn("Next: " + BLOCKS[k + 1].name, function () { nextBlock(k + 1); }) : primaryBtn("On to " + data.finale.name, function () { nextBlock(N); });
      actions([nxt, keyHint("Enter")]);
      openPanel(false, "Room cleared");
    }
    function nextBlock(k) {
      fade(true); S.trialNotes = []; S.prize = null;
      setTimeout(function () {
        panel.classList.remove("nthview-open"); clearTrial(); buildRoom(k); fade(false);
        if (k >= N) showFinaleIntro(); else showLesson(k);
      }, 380);
    }
    function pickFinale() {
      var qs = data.finale.questions, n = Math.min(data.finale.ask || 5, qs.length), idx = shuffledIdx(qs.length, data.title + ":finale:" + S.runSeed);
      if (qs.length === 1) idx = [0];
      return idx.slice(0, n).map(function (i) { return qs[i]; });
    }
    function showFinaleIntro() {
      S.mode = "finale"; S.k = N; renderHud(); renderTargets(); S.finale.list = pickFinale(); persist();
      page("Final room", data.finale.name);
      pbody.appendChild(p("nthview-lead", data.finale.lead));
      pbody.appendChild(p("nthview-cap", "No guards here. The vault door has " + S.finale.list.length + " lock" + (S.finale.list.length > 1 ? "s" : "") + ", one question each."));
      actions([primaryBtn("Crack the vault ▸", startVault), keyHint("Enter")]);
      openPanel(false, "Final room");
    }
    function startVault() {
      closePanel(); S.mode = "vault"; renderHud(); renderPowers(); goTo(DOOR_X, 1, false);
      var from = Math.min(S.finale.i || 0, Math.max(0, S.finale.list.length - 1));
      setTimeout(function () { finaleQ(from); }, settings.reduced ? 300 : 1500);
    }
    function finaleQ(i) {
      if (S.mode !== "vault") return;
      if (S.paused || overlayOpen()) { S.pendingQ = i; return; }
      var list = S.finale.list;
      hName.textContent = data.finale.name + " · lock " + Math.min(i + 1, list.length) + " of " + list.length; hFill.style.width = (100 * i / list.length) + "%";
      if (i >= list.length) {
        S.finale.done = true; S.finale.i = list.length; persist(); closePanel(); openDoor(); goalRing.visible = false;
        toast("The vault is open!", 1800); say("The vault is open."); setTimeout(function () { if (S.mode === "vault") goTo(DOOR_X, 0, false); }, settings.reduced ? 200 : 900); return;
      }
      S.finale.i = i; persist();
      page(data.finale.name + " · lock " + (i + 1) + " of " + list.length, "The vault lock");
      var host = el("div"); pbody.appendChild(host);
      wChoice(host, list[i], qctx(-1, function () { closePanel(); sfx("pick"); setTimeout(function () { finaleQ(i + 1); }, settings.reduced ? 200 : 700); }), null);
      openPanel(true, "Vault lock question");
    }
    function reachedExit() {
      if (S.mode !== "vault") return;
      S.mode = "report"; sfx("win"); fade(true, true);
      setTimeout(function () { showReport(); fade(false, true); }, 900);
    }
    function resultsList(host, items, render1) {
      var ul = el("ul", { class: "nthview-results" }), shown = 0, more = btn("Show more", "", function () { add(); });
      function add() { var end = Math.min(items.length, shown + 50); for (; shown < end; shown++) ul.appendChild(render1(items[shown], shown)); more.classList.toggle("nthview-hidden", shown >= items.length); more.textContent = "Show " + Math.min(50, items.length - shown) + " more"; }
      host.appendChild(ul); host.appendChild(more); add();
    }
    function showReport() {
      S.done = true;   /* the end is the final report after the vault; live and restored runs both pass here (§5.5 rule 8) */
      S.mode = "report"; panel.classList.remove("nthview-open"); hideCallout(); renderPowers(); openOverlay("report"); ocard.textContent = ""; saveNow();
      ocard.appendChild(el("div", { class: "nthview-actions" }, [restartButton(container, data, KEY)])); ocard.lastChild.style.cssText = "margin:0 0 8px;justify-content:flex-end";
      var r = data.report, tiers = r.tiers || {}, fin = starsFor(S.finale.mistakes), st = totalStars() + fin, max = 3 * (N + 1);
      var firstTry = S.results.filter(function (x) { return x.mistakes === 0; }).length;
      ocard.appendChild(el("h1", { text: r.heading }));
      ocard.appendChild(el("div", { class: "nthview-scorecard" }, [
        el("div", {}, [doc.createTextNode("★ Stars"), el("b", { text: st + " / " + max })]),
        el("div", {}, [doc.createTextNode("First try"), el("b", { text: firstTry + " / " + N })]),
        el("div", {}, [doc.createTextNode("◆ Gems"), el("b", { text: String(S.gems) })]),
        el("div", {}, [doc.createTextNode("Caught"), el("b", { text: String(S.deaths) })])
      ].concat(S.skips ? [el("div", {}, [doc.createTextNode("Rooms skipped"), el("b", { text: String(S.skips) })])] : [])
        .concat(STRICT ? [el("div", {}, [doc.createTextNode("Lockpicks left"), el("b", { text: S.picks + " / " + START_PICKS })]), el("div", {}, [doc.createTextNode("Jammed locks"), el("b", { text: String(S.alarms) })])] : [])));
      ocard.appendChild(p("nthview-big", st === max ? (tiers.perfect || "Every answer right first time.") : st >= max * .8 ? (tiers.great || "A great mission.") : (tiers.pass || "Mission complete! Play it again to earn more stars.")));
      ocard.appendChild(p("", "**What you learned**"));
      ocard.appendChild(el("ol", {}, r.lessons.map(function (l) { var li = el("li"); li.appendChild(rich(l)); return li; })));
      var det = el("details", { class: "nthview-more" }); if (N <= 12) det.setAttribute("open", "");
      det.appendChild(el("summary", { text: "Every block and its takeaway (" + N + ")" }));
      resultsList(det, BLOCKS, function (s2, i) { var res = S.results[i]; return el("li", {}, [el("span", { class: "nthview-rs", "aria-label": res.stars + " stars", text: starsText(res.stars) }), el("span", { class: "nthview-rt" }, [el("b", { text: (i + 1) + ". " + s2.name }), el("span", { class: "nthview-note", text: plain(s2.data.remember) })])]); });
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
      setTimeout(function () { again.focus({ preventScroll: true }); }, 60);
    }
    /* spotted: only this room starts again, and it gets a little easier each time */
    function deathCard(G) {
      var k = S.k, res = S.results[k];
      openOverlay("spotted"); ocard.textContent = "";
      ocard.appendChild(el("h1", { text: "Caught!" }));
      var who = G ? (G.boss ? G.cfg.name : (G.cfg.name === "Officer" ? "An " : "A ") + G.cfg.name.toLowerCase()) : "A guard";
      ocard.appendChild(p("nthview-big", who + (S.killHow === "blade" ? " reached " + hero + " with his sword." : " kept " + hero + " in the light long enough to fire.") + " Only this room starts again; the lesson and your answers are safe."));
      ocard.appendChild(p("nthview-small", "Next time, leave the light at once: a guard who loses sight of you has to chase and search, and you can hide."));
      ocard.appendChild(el("p", { class: "nthview-readout", text: "Caught " + res.deaths + (res.deaths === 1 ? " time" : " times") + " in this room" }));
      if (res.deaths >= 2) ocard.appendChild(p("nthview-small", "The guards are getting tired: they walk and react a little slower now."));
      var go = primaryBtn("Try again", function () { retryRoom(false); });
      var row = el("div", { class: "nthview-actions" }, [go, keyHint("Enter")]);
      ocard.appendChild(row);
      var row2 = el("div", { class: "nthview-actions" }, []);
      if (res.deaths >= 3) row2.appendChild(btn("Skip to the question", "", skipRoom));
      row2.appendChild(btn("Read the lesson again", "", function () { retryRoom(true); }));
      row2.appendChild(restartButton(container, data, KEY));
      ocard.appendChild(row2);
      setTimeout(function () { go.focus({ preventScroll: true }); }, 60);
    }
    function retryRoom(lesson) {
      closeOverlay(); copyInv(S.invStart, S.inv); if (S.gems0 !== undefined) S.gems = S.gems0; renderScore();
      resetRoom(S.k);
      if (lesson) showLesson(S.k); else { S.mode = "play"; renderPowers(); persist(); canvas.focus({ preventScroll: true }); }
    }
    function skipRoom() {
      var k = S.k, res = S.results[k];
      closeOverlay(); copyInv(S.invStart, S.inv); if (S.gems0 !== undefined) S.gems = S.gems0;
      res.skipped = true; res.cleared = true; S.skips++; renderScore(); resetRoom(k); S.mode = "clear"; renderPowers(); persist();
      toast("Room skipped. Take the secret box.", 2600);
    }
    /* quiz mode: the last lockpick snapping trips the alarm; it is counted and play goes on */
    function alarm() {
      S.alarmOn = true; S.alarms++; saveNow(); sfx("alert");
      setTimeout(function () {
        openOverlay("alarm"); ocard.textContent = "";
        ocard.appendChild(el("h1", { text: "Lock jammed!" }));
        ocard.appendChild(p("nthview-big", "The last lockpick snapped and the lock jammed."));
        ocard.appendChild(el("p", { class: "nthview-readout", text: "Jams so far: " + S.alarms }));
        ocard.appendChild(p("nthview-small", hero + " frees it and gets a fresh set of lockpicks. Nothing you answered is lost."));
        var go = primaryBtn("Resume", function () { S.alarmOn = false; S.picks = START_PICKS; renderScore(); persist(); closeOverlay(); if (!panelOpen()) canvas.focus({ preventScroll: true }); });
        ocard.appendChild(el("div", { class: "nthview-actions" }, [go, keyHint("Enter"), restartButton(container, data, KEY)]));
        ocard.lastChild.lastChild.style.marginLeft = "auto";
        setTimeout(function () { go.focus({ preventScroll: true }); }, 60);
      }, 500);
    }
    function restartAll() {
      clearState(KEY); closeOverlay(); S.done = false; S.runSeed++; S.gems = 0; S.gems0 = 0; S.picks = START_PICKS; S.deaths = 0; S.skips = 0; S.alarms = 0;
      REWARDS.forEach(function (p2) { S.inv[p2] = 0; S.invStart[p2] = 0; });
      S.results = freshResults(); S.finale = { list: [], i: 0, mistakes: 0, done: false };
      renderScore(); nextBlock(0);
    }
    function fade(on, white) { fadeEl.classList.toggle("nthview-white", !!white); fadeEl.classList.toggle("nthview-on", !!on); }

    /* ---------- overlays: intro, pause, spotted, alarm, report ---------- */
    var overlayKind = null;
    function openOverlay(kind) { overlayKind = kind; overlay.classList.remove("nthview-hidden"); ocard.setAttribute("aria-label", kind); }
    function closeOverlay() { overlayKind = null; overlay.classList.add("nthview-hidden"); }
    function overlayOpen() { return overlayKind !== null; }
    function toggleBtn(label, on, fn) { var b = el("button", { type: "button", class: "nthview-btn", "aria-pressed": String(on), text: label + (on ? ": on" : ": off") }); b.addEventListener("click", function () { on = !on; b.setAttribute("aria-pressed", String(on)); b.textContent = label + (on ? ": on" : ": off"); fn(on); }); return b; }
    function pause() {
      if (S.paused || overlayOpen() || S.mode === "report" || S.mode === "dead" || S.mode === "intro") return;
      S.paused = true; openOverlay("pause"); ocard.textContent = "";
      var k = Math.min(S.k, N - 1), inBlock = S.k < N;
      ocard.appendChild(el("h2", { text: "Paused" }));
      ocard.appendChild(p("nthview-small", (inBlock ? "Block " + (k + 1) + " of " + N + ": " + BLOCKS[k].name : data.finale.name) + " · ★ " + totalStars() + " · ◆ " + S.gems + " · caught " + S.deaths + (STRICT ? " · " + S.picks + " lockpicks · quiz mode" : "")));
      var resumeB = primaryBtn("Resume", resume);
      var menu = el("div", { class: "nthview-menu" }, [resumeB]);
      if (inBlock && (S.mode === "play" || S.mode === "lesson")) menu.appendChild(btn("Read this block's lesson again", "", function () { closeOverlay(); S.paused = false; copyInv(S.invStart, S.inv); if (S.gems0 !== undefined) S.gems = S.gems0; renderScore(); resetRoom(k); showLesson(k); }));
      menu.appendChild(toggleBtn("Reduced motion", settings.reduced, function (v) { settings.reduced = v; persist(); }));
      menu.appendChild(toggleBtn("Sound", settings.sound, function (v) { settings.sound = v; persist(); }));
      menu.appendChild(toggleBtn("Real flashlights and shadows", tier >= 2, function (v) { settings.lights = v; setTier(v ? 2 : 0); persist(); }));
      menu.appendChild(restartButton(container, data, KEY));
      ocard.appendChild(menu);
      var kinds = {}; BLOCKS.forEach(function (b2) { b2.squad.forEach(function (t) { kinds[t] = true; }); });
      var gd = el("details", { class: "nthview-more" }); gd.appendChild(el("summary", { text: "Guard guide" }));
      SOLDIERS.filter(function (t) { return kinds[t]; }).forEach(function (t) { gd.appendChild(guardLine(GUARD[t])); });
      BOSSES.forEach(function (t) { if (BLOCKS.some(function (b2) { return b2.boss === t; })) gd.appendChild(guardLine(BOSS[t])); });
      ocard.appendChild(gd);
      var done = BLOCKS.filter(function (s2, i) { return S.results[i].done; });
      var det = el("details", { class: "nthview-more" }); det.appendChild(el("summary", { text: "Review so far (" + done.length + " of " + N + " blocks)" }));
      if (done.length) resultsList(det, done, function (s2) { var res = S.results[s2.idx]; return el("li", {}, [el("span", { class: "nthview-rs", text: starsText(res.stars) }), el("span", { class: "nthview-rt" }, [el("b", { text: (s2.idx + 1) + ". " + s2.name }), el("span", { class: "nthview-note", text: plain(s2.data.remember) })])]); });
      else det.appendChild(p("nthview-small", "Nothing cleared yet. The takeaways collect here as you play."));
      ocard.appendChild(det);
      setTimeout(function () { resumeB.focus({ preventScroll: true }); }, 60);
    }
    function resume() {
      if (!S.paused) return; S.paused = false; closeOverlay(); last = 0; schedule();
      KEYS.up = KEYS.down = KEYS.left = KEYS.right = false;
      if (S.pendingQ !== undefined && S.pendingQ !== null) { var q = S.pendingQ; S.pendingQ = null; finaleQ(q); }
      if (!panelOpen()) canvas.focus({ preventScroll: true });
    }
    pauseBtn.addEventListener("click", function () { if (S.paused) resume(); else pause(); });

    /* ======================================================================
       The frame loop. Fixed temporaries, clamped delta time, no allocation.
       ====================================================================== */
    var rafId = 0, last = 0, alive = true, perfAcc = 0, perfN = 0, pausedFrames = 0, shadowsOn = true;
    function step(dt) {
      T += dt;
      var g = dt, i;
      if (H.atk && !settings.reduced) g = dt * .45; else if (slowT > 0) { slowT -= dt; g = dt * .3; }
      updateHero(g);
      for (i = 0; i < guards.length; i++) updateGuard(guards[i], g);
      updateKnife(g); updateProj(g); updateAlarm(g);
      if (S.mode === "trial") updateTrial();
      syncFigures(g);
      if (shakeT > 0) { shakeT -= dt; camera.position.x = camBaseX + Math.sin(T * 70) * shakeA * Math.max(0, shakeT / .25) * 3; } else camera.position.x = camBaseX;
      if (labelsDirty) placeLabels();
    }
    function frame(now) {
      rafId = 0;
      if (!alive) return;
      if (!canvas.isConnected) { dispose(); return; }
      var dt = last ? Math.min(.05, Math.max(0, (now - last) / 1000)) : 1 / 60; last = now;
      if (!S.paused) { pausedFrames = 0; step(dt); }
      if (!S.paused || pausedFrames++ < 2) renderer.render(scene, camera);
      perfAcc += dt; perfN++;
      if (perfN >= 120) {
        var avg = perfAcc / perfN;
        if (avg > .026) {
          /* too slow: first fewer pixels, then the flashlights stop being real lights, then no shadows at all */
          if (pixelRatio > 1.5) { pixelRatio = 1.5; renderer.setPixelRatio(pixelRatio); renderer.setSize(VW(), VH(), false); }
          else if (tier >= 2) setTier(0);
          else if (pixelRatio > 1) { pixelRatio = 1; renderer.setPixelRatio(pixelRatio); renderer.setSize(VW(), VH(), false); }
          else if (shadowsOn) { shadowsOn = false; sun.castShadow = false; }
        }
        perfAcc = 0; perfN = 0;
      }
      schedule();
    }
    function schedule() { if (!rafId && alive && !doc.hidden) rafId = root.requestAnimationFrame(frame); }
    function onVisibility() {
      if (doc.hidden) { saveNow(); if (rafId) { root.cancelAnimationFrame(rafId); rafId = 0; } if (S.mode === "play" && !S.paused) pause(); }
      else { last = 0; schedule(); }
    }
    function dispose() {
      alive = false; if (rafId) root.cancelAnimationFrame(rafId);
      root.removeEventListener("keydown", onKey); root.removeEventListener("keyup", onKeyUp); root.removeEventListener("blur", onBlur);
      doc.removeEventListener("visibilitychange", onVisibility); root.removeEventListener("pagehide", saveNow);
      if (ro) ro.disconnect(); else root.removeEventListener("resize", onResize);
      renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss();
    }

    /* ---------- input: tap to move is the whole control scheme; keys are an extra ---------- */
    var KEYMAP = { arrowleft: "left", a: "left", arrowright: "right", d: "right", arrowup: "up", w: "up", arrowdown: "down", s: "down" };
    function onKey(e) {
      if (!canvas.isConnected) return;
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
      if (key === "enter" && tag !== "BUTTON" && tag !== "A") {
        if (panelOpen()) { var pb = pbody.querySelector("[data-primary]:not([disabled]):not(.nthview-hidden)"); var cont = pbody.querySelector(".nthview-actions:not(.nthview-hidden) [data-primary]"); var tgt = cont && !cont.disabled ? cont : pb; if (tgt) { e.preventDefault(); tgt.click(); } return; }
        if (S.mode === "exit") { e.preventDefault(); H.target = null; goTo(DOOR_X, 0, true); return; }
        if (S.mode === "clear" && BOX.on) { e.preventDefault(); H.target = null; goTo(BOX.x, BOX.z, true); return; }
      }
      if (tag === "BUTTON" && (key === " " || key === "enter")) return;
      if (panelOpen()) return;
      if (KEYMAP[key]) { if (canMove()) { e.preventDefault(); KEYS[KEYMAP[key]] = true; } return; }
      if (S.mode === "play" && !e.repeat) {
        var hot = { "1": "sprint", "2": "knife", "3": "smoke", "4": "grenade", "5": "pot" }[key];
        if (hot) { e.preventDefault(); if (S.inv[hot]) { S.sel = hot; usePower(hot, false); } return; }
        if (key === " ") { e.preventDefault(); if (S.sel && S.inv[S.sel]) usePower(S.sel, false); else if (usable().length) cyclePower(0); else toast("Nothing to use yet. Every boss's box holds a power."); return; }
        if (key === "q" || key === "e") { e.preventDefault(); cyclePower(key === "q" ? -1 : 1); }
      }
    }
    function onKeyUp(e) { var k2 = KEYMAP[String(e.key).toLowerCase()]; if (k2) KEYS[k2] = false; }
    function onBlur() { KEYS.up = KEYS.down = KEYS.left = KEYS.right = false; }
    root.addEventListener("keydown", onKey); root.addEventListener("keyup", onKeyUp); root.addEventListener("blur", onBlur);
    var dragging = false, dragAt = 0;
    canvas.addEventListener("pointerdown", function (e) {
      if (S.paused || !canMove()) return;
      var pt = toFloor(e.clientX, e.clientY); if (!pt) return;
      dragging = true; dragAt = Date.now(); tapAt(pt.x, pt.z);
    });
    canvas.addEventListener("pointermove", function (e) {
      if (!dragging || S.paused || !canMove() || H.target || H.aim) return;
      var now = Date.now(); if (now - dragAt < 140) return; dragAt = now;
      var pt = toFloor(e.clientX, e.clientY); if (pt) goTo(pt.x, pt.z, false);
    });
    canvas.addEventListener("pointerup", function () { dragging = false; });
    canvas.addEventListener("pointercancel", function () { dragging = false; });
    doc.addEventListener("visibilitychange", onVisibility);
    root.addEventListener("pagehide", saveNow);
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); saveNow(); toast("The graphics were reset by the browser. Reload the page to continue; your progress is saved.", 8000); });
    function onResize() { renderer.setSize(VW(), VH(), false); fitCamera(); }
    var ro = root.ResizeObserver ? new root.ResizeObserver(onResize) : null;
    if (ro) ro.observe(container); else root.addEventListener("resize", onResize);
    if (mqReduce && mqReduce.addEventListener) mqReduce.addEventListener("change", function (e) { settings.reduced = e.matches; });

    /* ---------- start ---------- */
    renderer.setSize(VW(), VH(), false); fitCamera();
    var resumeAt = SAVED ? restoreState(SAVED) : null;
    S.gems0 = S.gems; renderScore();
    buildRoom(resumeAt ? (resumeAt.phase === "block" ? resumeAt.k : N) : 0);
    if (!resumeAt) { S.mode = "intro"; renderHud(); renderPowers(); introCard(); }
    else {
      if (resumeAt.phase === "report") { S.finale.done = true; S.k = N; renderHud(); showReport(); }
      else if (resumeAt.phase === "finale") { S.k = N; showFinaleIntro(); }
      else showLesson(resumeAt.k);
      var note = el("div", { class: "nthview-resume", role: "status", text: "Welcome back, continuing from " + (resumeAt.phase === "block" ? "block " + (resumeAt.k + 1) + " of " + N : resumeAt.phase === "finale" ? data.finale.name : "the report") + "." });
      container.appendChild(note);
      var hideNote = function () { note.classList.add("nthview-gone"); setTimeout(function () { if (note.parentNode) note.parentNode.removeChild(note); }, 500); root.removeEventListener("pointerdown", hideNote); root.removeEventListener("keydown", hideNote); };
      setTimeout(hideNote, 4500); root.addEventListener("pointerdown", hideNote); root.addEventListener("keydown", hideNote);
    }
    syncFigures(0); renderer.render(scene, camera);
    schedule();
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-hunter");
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
    if (!hasWebGL()) {
      renderNoWebGL(container);
      return { valid: false, errors: [{ path: "$", message: "WebGL is unavailable in this browser, so the rooms cannot be drawn." }], warnings: result.warnings };
    }
    render(container, data);
    return result;
  };

  NthView.libs = [
    { kind: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", global: "THREE", name: "three.js r128" },
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700;900&display=swap", name: "Google Fonts (Rubik)" }
  ];
  NthView.THEMES = THEMES.slice();
})(typeof globalThis !== "undefined" ? globalThis : window);
