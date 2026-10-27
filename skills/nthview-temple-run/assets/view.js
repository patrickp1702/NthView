/* NthView — temple-run renderer — schemaVersion 1
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
    ".nthview-temple-run .nthview-error-panel li{overflow-wrap:anywhere}",
    ".nthview.nthview-temple-run.nthview-tr-game{max-width:none;margin:0;padding:0;position:relative;width:100%;height:100vh;height:100dvh;min-height:420px;overflow:hidden;",
    "  --display:\"Cinzel\",\"Trajan Pro\",Georgia,serif;--body:\"Atkinson Hyperlegible\",\"Segoe UI\",system-ui,sans-serif;",
    "  --hud-bg:rgba(14,11,7,.58);--hud-ink:#fff6e3;--gold:#ffcf5a;--flame:#ffb02e;",
    "  --panel:rgba(255,250,240,.95);--panel-solid:#fffaf0;--ink:#2a2116;--muted:#6b5a43;--line:#e3d5bb;--chip:#f5ecda;--accent:#c9831f;--ok:#2f8a4c;--no:#b8402f;--on-accent:#1d1408;",
    "  background:#0b0906;color:var(--ink);font-family:var(--body);-webkit-tap-highlight-color:transparent}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-temple-run.nthview-tr-game{--panel:rgba(28,24,18,.95);--panel-solid:#1c1812;--ink:#f5ecdc;--muted:#c4b496;--line:#4a3f2e;--chip:#2a241a;--accent:#f2b33d;--ok:#6fd39a;--no:#ff8f7a}}",
    ".nthview.nthview-temple-run.nthview-theme-haunted{--panel:rgba(244,246,255,.95);--panel-solid:#f4f6ff;--ink:#1b2140;--muted:#545e86;--line:#d3d9ee;--chip:#e9edfb;--accent:#3b7dd8;--ok:#227a5a;--no:#b23a55;--hud-bg:rgba(8,12,30,.6);--hud-ink:#eef2ff;--flame:#8fd0ff}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-temple-run.nthview-theme-haunted{--panel:rgba(14,18,36,.95);--panel-solid:#0e1224;--ink:#e8ecff;--muted:#a5b0d8;--line:#2c3560;--chip:#1a2140;--accent:#7cc4ff;--ok:#6ee7b7;--no:#fb7185}}",
    ".nthview.nthview-temple-run.nthview-theme-sand{--panel:rgba(255,248,236,.95);--panel-solid:#fff8ec;--ink:#3a2412;--muted:#7a5534;--line:#ecd6b8;--chip:#f8e9d2;--accent:#d0701f;--ok:#2d7d46;--no:#b3341f}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-temple-run.nthview-theme-sand{--panel:rgba(38,24,14,.95);--panel-solid:#26180e;--ink:#fbeee0;--muted:#d9b494;--line:#5b3d26;--chip:#362314;--accent:#f59e4a;--ok:#74d69b;--no:#ff9278}}",
    ".nthview.nthview-temple-run.nthview-theme-ice{--panel:rgba(246,251,255,.95);--panel-solid:#f6fbff;--ink:#10263a;--muted:#4a6680;--line:#cfe0ee;--chip:#e8f2fa;--accent:#1f8fb8;--ok:#1f7a5c;--no:#b3405a;--hud-bg:rgba(10,26,40,.55);--flame:#ffc04a}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-temple-run.nthview-theme-ice{--panel:rgba(12,24,38,.95);--panel-solid:#0c1826;--ink:#eaf6ff;--muted:#a3bdd2;--line:#274258;--chip:#15283c;--accent:#67d4f0;--ok:#6ee7c0;--no:#ff8aa0}}",
    "body:has(> .nthview-temple-run.nthview-tr-game){margin:0;overflow:hidden;background:#0b0906}",
    ".nthview-temple-run .nthview-hidden{display:none!important}",
    ".nthview-temple-run button{font:inherit;color:inherit;cursor:pointer}",
    ".nthview-temple-run button:disabled{cursor:default}",
    ".nthview-temple-run .nthview-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none}",
    ".nthview-temple-run .nthview-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".nthview-temple-run .nthview-col{position:absolute;top:0;bottom:0;left:50%;width:min(560px,100%);transform:translateX(-50%);pointer-events:none;z-index:5}",
    /* HUD */
    ".nthview-temple-run .nthview-hud{position:absolute;top:0;left:0;right:0;padding:10px 10px 0;display:flex;align-items:flex-start;gap:8px;color:var(--hud-ink)}",
    ".nthview-temple-run .nthview-hchip{background:var(--hud-bg);border:1px solid rgba(255,255,255,.16);border-radius:14px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
    ".nthview-temple-run .nthview-pausebtn{width:44px;height:44px;flex:none;display:grid;place-items:center;pointer-events:auto;color:var(--hud-ink);padding:0}",
    ".nthview-temple-run .nthview-hleft{display:flex;flex-direction:column;gap:6px;align-items:flex-start;flex:none}",
    ".nthview-temple-run .nthview-restart{pointer-events:auto;font-size:.72rem;font-weight:700;padding:4px 8px;border-radius:10px;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.2)}",
    ".nthview-temple-run .nthview-card .nthview-restart{background:var(--chip);color:var(--ink);border-color:var(--line);font-size:.85rem;padding:9px 14px;min-height:40px}",
    ".nthview-temple-run .nthview-resume{position:absolute;left:50%;top:84px;transform:translateX(-50%);z-index:25;background:var(--panel-solid);color:var(--ink);border:2px solid var(--accent);border-radius:14px;padding:9px 16px;font-weight:700;box-shadow:0 8px 30px rgba(0,0,0,.3);max-width:calc(100% - 32px);text-align:center;pointer-events:none;transition:opacity .4s}",
    ".nthview-temple-run .nthview-resume.nthview-gone{opacity:0}",
    ".nthview-temple-run .nthview-hmid{flex:1;min-width:0;padding:6px 10px 7px}",
    ".nthview-temple-run .nthview-hname{font-family:var(--display);font-weight:700;font-size:.82rem;letter-spacing:.04em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-temple-run .nthview-hbar{height:4px;border-radius:2px;background:rgba(255,255,255,.18);margin-top:5px;overflow:hidden}",
    ".nthview-temple-run .nthview-hbar i{display:block;height:100%;width:0;background:var(--gold);border-radius:2px}",
    ".nthview-temple-run .nthview-hbar.nthview-thin{height:2px;margin-top:3px}",
    ".nthview-temple-run .nthview-hbar.nthview-thin i{background:rgba(255,255,255,.75)}",
    ".nthview-temple-run .nthview-hright{padding:6px 10px;display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex:none}",
    ".nthview-temple-run .nthview-torches{display:flex;gap:3px;align-items:flex-end;min-height:20px}",
    ".nthview-temple-run .nthview-torch{width:12px;height:20px;position:relative}",
    ".nthview-temple-run .nthview-torch::before{content:\"\";position:absolute;left:4px;bottom:0;width:4px;height:10px;border-radius:1px;background:#8a5a2b}",
    ".nthview-temple-run .nthview-torch::after{content:\"\";position:absolute;left:1px;top:0;width:10px;height:12px;border-radius:50% 50% 45% 45%/60% 60% 40% 40%;background:radial-gradient(circle at 50% 70%,#fff3b0,var(--flame) 55%,rgba(255,80,0,.6));box-shadow:0 0 8px var(--flame)}",
    ".nthview-temple-run .nthview-torch.nthview-out::after{background:#4a4036;box-shadow:none;opacity:.55}",
    ".nthview-temple-run .nthview-torch.nthview-flicker::after{animation:nthview-flick .8s ease-out}",
    "@keyframes nthview-flick{0%,100%{opacity:1;transform:none}20%{opacity:.2;transform:scale(.6)}40%{opacity:1;transform:scale(1.25)}60%{opacity:.3}80%{opacity:1}}",
    ".nthview-temple-run .nthview-hstats{display:flex;gap:8px;font-size:.8rem;font-weight:700;white-space:nowrap}",
    ".nthview-temple-run .nthview-hstats b{color:var(--gold)}",
    "@media (max-width:380px){.nthview-temple-run .nthview-hstats{gap:5px;font-size:.7rem}.nthview-temple-run .nthview-danger span{display:none}.nthview-temple-run .nthview-hright{padding:6px 7px}.nthview-temple-run .nthview-hud{gap:6px;padding:8px 8px 0}}",
    ".nthview-temple-run .nthview-danger{display:flex;align-items:center;gap:6px;margin-top:5px;font-size:.68rem;opacity:.9;white-space:nowrap}",
    ".nthview-temple-run .nthview-danger .nthview-hbar{flex:1;margin:0;height:3px}",
    ".nthview-temple-run .nthview-danger .nthview-hbar i{background:linear-gradient(90deg,#ffb02e,#e5332a);transition:width .4s}",
    ".nthview-temple-run .nthview-turnhint{position:absolute;top:96px;left:50%;transform:translateX(-50%);font-size:2.6rem;line-height:1;color:var(--gold);text-shadow:0 2px 12px rgba(0,0,0,.6);opacity:0;transition:opacity .2s}",
    ".nthview-temple-run .nthview-turnhint.nthview-show{opacity:.95}",
    /* callout for encounters and track trials */
    ".nthview-temple-run .nthview-callout{position:absolute;top:90px;left:10px;right:10px;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.18);border-radius:16px;padding:10px 12px;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);transition:opacity .3s,transform .3s}",
    ".nthview-temple-run .nthview-callout.nthview-off{opacity:0;transform:translateY(-8px)}",
    ".nthview-temple-run .nthview-ckick{font-family:var(--display);font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;color:var(--gold);font-weight:700}",
    ".nthview-temple-run .nthview-ctext{font-size:.95rem;line-height:1.35;margin-top:2px}",
    ".nthview-temple-run .nthview-cbig{font-family:var(--display);font-weight:700;font-size:1.12rem;line-height:1.25;margin-top:6px;text-align:center}",
    ".nthview-temple-run .nthview-lanes{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}",
    ".nthview-temple-run .nthview-lane{border-radius:10px;padding:6px 4px;text-align:center;background:rgba(255,255,255,.1);font-weight:700;font-size:.88rem;line-height:1.2;min-height:2.3em;display:grid;place-items:center;border:1.5px solid transparent;overflow-wrap:anywhere}",
    ".nthview-temple-run .nthview-lane.nthview-empty{background:transparent;opacity:.4}",
    ".nthview-temple-run .nthview-lane.nthview-ok{border-color:#6fe39b;background:rgba(80,200,120,.25)}",
    ".nthview-temple-run .nthview-lane.nthview-no{border-color:#ff7a6a;background:rgba(230,70,50,.25)}",
    ".nthview-temple-run .nthview-cfb{margin-top:6px;font-size:.88rem;line-height:1.35}",
    ".nthview-temple-run .nthview-cfb.nthview-ok{color:#8ff0b4}",
    ".nthview-temple-run .nthview-cfb.nthview-no{color:#ffb4a8}",
    ".nthview-temple-run .nthview-toast{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%) scale(.92);opacity:0;background:var(--hud-bg);color:var(--hud-ink);border:1px solid rgba(255,255,255,.2);border-radius:14px;padding:9px 16px;transition:opacity .25s,transform .25s;max-width:calc(100% - 40px);text-align:center;font-weight:700;backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}",
    ".nthview-temple-run .nthview-toast.nthview-show{opacity:1;transform:translate(-50%,-50%) scale(1)}",
    /* on-screen arrows */
    ".nthview-temple-run .nthview-pad{position:absolute;left:0;right:0;bottom:max(14px,env(safe-area-inset-bottom));display:flex;justify-content:center;gap:12px;pointer-events:none}",
    ".nthview-temple-run .nthview-pad button{pointer-events:auto;width:56px;height:56px;border-radius:50%;background:rgba(14,11,7,.32);border:1.5px solid rgba(255,255,255,.35);color:#fff;display:grid;place-items:center;touch-action:none;backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}",
    ".nthview-temple-run .nthview-pad button:active{background:rgba(255,207,90,.4)}",
    ".nthview-temple-run .nthview-grade{position:absolute;inset:0;pointer-events:none;z-index:3;background:radial-gradient(ellipse 80% 70% at 50% 42%,transparent 55%,rgba(30,16,0,.38) 100%),linear-gradient(180deg,rgba(255,196,110,.16),transparent 38%,transparent 70%,rgba(40,24,6,.22))}",
    ".nthview-temple-run.nthview-theme-haunted .nthview-grade{background:radial-gradient(ellipse 80% 70% at 50% 42%,transparent 50%,rgba(0,4,24,.5) 100%),linear-gradient(180deg,rgba(90,140,255,.14),transparent 40%,transparent 70%,rgba(0,8,30,.3))}",
    ".nthview-temple-run.nthview-theme-sand .nthview-grade{background:radial-gradient(ellipse 80% 70% at 50% 42%,transparent 55%,rgba(60,24,0,.36) 100%),linear-gradient(180deg,rgba(255,170,80,.2),transparent 40%,transparent 70%,rgba(70,30,0,.2))}",
    ".nthview-temple-run.nthview-theme-ice .nthview-grade{background:radial-gradient(ellipse 80% 70% at 50% 42%,transparent 55%,rgba(10,30,50,.32) 100%),linear-gradient(180deg,rgba(190,230,255,.18),transparent 40%,transparent 70%,rgba(20,40,60,.18))}",
    ".nthview-temple-run .nthview-vignette{position:absolute;inset:0;pointer-events:none;z-index:4;opacity:0;background:radial-gradient(ellipse at center,transparent 52%,rgba(210,30,10,.7) 100%)}",
    ".nthview-temple-run .nthview-vignette.nthview-hit{animation:nthview-hit .7s ease-out}",
    "@keyframes nthview-hit{0%{opacity:0}15%{opacity:1}100%{opacity:0}}",
    ".nthview-temple-run .nthview-fade{position:absolute;inset:0;background:#000;opacity:0;pointer-events:none;transition:opacity .35s;z-index:30}",
    ".nthview-temple-run .nthview-fade.nthview-white{background:#fff8e6}",
    ".nthview-temple-run .nthview-fade.nthview-on{opacity:1}",
    /* bottom sheet */
    ".nthview-temple-run .nthview-panel{position:absolute;left:0;right:0;bottom:0;max-height:64%;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;background:var(--panel);color:var(--ink);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border-radius:22px 22px 0 0;border-top:3px solid var(--accent);padding:16px 18px calc(22px + env(safe-area-inset-bottom));box-shadow:0 -12px 40px rgba(0,0,0,.35);transform:translateY(105%);transition:transform .38s cubic-bezier(.2,.8,.2,1);pointer-events:auto;user-select:text}",
    ".nthview-temple-run .nthview-panel.nthview-open{transform:none}",
    ".nthview-temple-run .nthview-panel:focus{outline:none}",
    ".nthview-temple-run .nthview-panel.nthview-compact{max-height:52%}",
    "@media (max-height:560px){.nthview-temple-run .nthview-panel{max-height:84%}.nthview-temple-run .nthview-panel.nthview-compact{max-height:70%}}",
    "@media (min-width:700px) and (min-height:700px){.nthview-temple-run .nthview-panel{bottom:16px;border-radius:22px;border:1px solid var(--line);border-top:3px solid var(--accent)}}",
    ".nthview-temple-run .nthview-kicker{color:var(--muted);margin:0;font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase}",
    ".nthview-temple-run .nthview-panel h2,.nthview-temple-run .nthview-card h2{font-family:var(--display);font-weight:700;font-size:1.65rem;line-height:1.1;margin:4px 0 10px;overflow-wrap:anywhere}",
    ".nthview-temple-run .nthview-panel p,.nthview-temple-run .nthview-card p{line-height:1.55;overflow-wrap:anywhere}",
    ".nthview-temple-run .nthview-lead{font-size:1.06rem}",
    ".nthview-temple-run .nthview-box{background:var(--chip);border:1px solid var(--line);border-radius:16px;padding:12px 14px;margin:14px 0}",
    ".nthview-temple-run .nthview-box.nthview-task{border:2px solid var(--accent);background:color-mix(in srgb,var(--accent) 9%,var(--panel-solid))}",
    ".nthview-temple-run .nthview-box-title{font-family:var(--display);font-weight:700;font-size:1.02rem;margin:0 0 8px}",
    ".nthview-temple-run .nthview-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
    ".nthview-temple-run .nthview-cap{font-size:.84rem;color:var(--muted);margin:10px 0 0}",
    ".nthview-temple-run .nthview-readout{font-weight:700;font-size:1.04rem;margin-top:12px}",
    ".nthview-temple-run .nthview-btn{background:var(--panel-solid);border:2px solid var(--accent);border-radius:14px;padding:11px 18px;font-weight:700;line-height:1.2;min-height:46px}",
    ".nthview-temple-run .nthview-btn.nthview-primary{background:var(--accent);color:var(--on-accent);border-color:transparent}",
    ".nthview-temple-run .nthview-btn:disabled{opacity:.45}",
    ".nthview-temple-run .nthview-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:16px;align-items:center}",
    ".nthview-temple-run .nthview-keyhint{font-size:.8rem;color:var(--muted)}",
    ".nthview-temple-run .nthview-q{font-weight:700;font-size:1.06rem;margin:6px 0 10px}",
    ".nthview-temple-run .nthview-opts{display:grid;gap:9px}",
    ".nthview-temple-run .nthview-opts.nthview-two{grid-template-columns:1fr 1fr}",
    ".nthview-temple-run .nthview-opt{text-align:left;background:var(--panel-solid);border:2px solid var(--line);border-radius:14px;padding:13px 15px;line-height:1.35;min-height:52px;box-shadow:0 3px 0 var(--line);transition:transform .08s,box-shadow .08s,border-color .15s;display:flex;align-items:center;gap:10px}",
    ".nthview-temple-run .nthview-opt:hover:not(:disabled){border-color:var(--accent)}",
    ".nthview-temple-run .nthview-opt:active:not(:disabled){transform:translateY(2px);box-shadow:0 1px 0 var(--line)}",
    ".nthview-temple-run .nthview-opt[aria-pressed=true],.nthview-temple-run .nthview-opt.nthview-sel{border-color:var(--accent);box-shadow:0 3px 0 var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--panel-solid))}",
    ".nthview-temple-run .nthview-opt.nthview-right{border-color:var(--ok);box-shadow:0 3px 0 var(--ok);background:color-mix(in srgb,var(--ok) 15%,var(--panel-solid))}",
    ".nthview-temple-run .nthview-opt.nthview-wrong{border-color:var(--no);box-shadow:0 3px 0 var(--no);background:color-mix(in srgb,var(--no) 10%,var(--panel-solid))}",
    ".nthview-temple-run .nthview-opt:disabled.nthview-wrong{opacity:.65;text-decoration:line-through}",
    ".nthview-temple-run .nthview-opt.nthview-center{justify-content:center;text-align:center;font-family:var(--display);font-weight:700;font-size:1.15rem;min-height:72px}",
    ".nthview-temple-run .nthview-tick{width:24px;height:24px;border-radius:7px;border:2px solid var(--line);flex:none;display:grid;place-items:center;font-weight:900;font-size:.9rem}",
    ".nthview-temple-run .nthview-opt[aria-pressed=true] .nthview-tick{background:var(--accent);border-color:var(--accent);color:var(--on-accent)}",
    ".nthview-temple-run .nthview-fb{margin-top:12px;line-height:1.5}",
    ".nthview-temple-run .nthview-fb.nthview-ok{color:var(--ok);font-weight:700}",
    ".nthview-temple-run .nthview-fb.nthview-no{color:var(--no)}",
    ".nthview-temple-run .nthview-fb .nthview-reveal{display:block;margin-top:6px;color:var(--ink);font-weight:700}",
    ".nthview-temple-run .nthview-remember{border:2px solid var(--accent);border-radius:16px;padding:12px 14px;margin-top:14px}",
    ".nthview-temple-run .nthview-stars{font-size:1.5rem;color:var(--gold);letter-spacing:2px;margin:0 0 4px;text-shadow:0 1px 0 rgba(0,0,0,.3)}",
    ".nthview-temple-run .nthview-num{width:28px;height:28px;border-radius:50%;background:var(--chip);border:1.5px solid var(--line);display:grid;place-items:center;font-weight:800;flex:none;font-size:.9rem}",
    ".nthview-temple-run .nthview-opt[aria-pressed=true] .nthview-num{background:var(--accent);color:var(--on-accent);border-color:transparent}",
    ".nthview-temple-run .nthview-note{display:block;font-size:.84rem;color:var(--muted)}",
    ".nthview-temple-run .nthview-txt{flex:1;min-width:0;overflow-wrap:anywhere}",
    ".nthview-temple-run .nthview-seq{display:flex;flex-wrap:wrap;gap:6px;margin:4px 0 10px;min-height:34px}",
    ".nthview-temple-run .nthview-slot{border:2px dashed var(--line);border-radius:10px;padding:5px 10px;font-size:.88rem;min-width:44px;text-align:center}",
    ".nthview-temple-run .nthview-slot.nthview-filled{border-style:solid;border-color:var(--accent);background:color-mix(in srgb,var(--accent) 12%,var(--panel-solid));font-weight:700}",
    ".nthview-temple-run .nthview-chips{display:flex;flex-wrap:wrap;gap:6px}",
    ".nthview-temple-run .nthview-chip{border:2px solid var(--line);background:var(--panel-solid);border-radius:999px;padding:7px 13px;font-weight:700;font-size:.9rem;min-height:38px}",
    ".nthview-temple-run .nthview-chip[aria-pressed=true]{background:var(--accent);border-color:transparent;color:var(--on-accent)}",
    ".nthview-temple-run .nthview-chip.nthview-right{border-color:var(--ok)}",
    ".nthview-temple-run .nthview-chip.nthview-wrong{border-color:var(--no)}",
    ".nthview-temple-run .nthview-cols{display:grid;grid-template-columns:1fr 1fr;gap:8px}",
    ".nthview-temple-run .nthview-badge{display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:50%;background:var(--accent);color:var(--on-accent);font-weight:800;font-size:.8rem;flex:none}",
    ".nthview-temple-run .nthview-bins{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px;margin-top:10px}",
    ".nthview-temple-run .nthview-bin{border:2px dashed var(--line);border-radius:14px;padding:10px;min-height:76px;text-align:center;background:var(--panel-solid);display:flex;flex-direction:column;gap:4px;align-items:center}",
    ".nthview-temple-run .nthview-bin b{font-family:var(--display)}",
    ".nthview-temple-run .nthview-bin.nthview-target{border-style:solid;border-color:var(--accent)}",
    ".nthview-temple-run .nthview-stamp{display:inline-block;background:var(--chip);border-radius:8px;padding:2px 8px;font-size:.82rem}",
    ".nthview-temple-run .nthview-stamp.nthview-right{outline:2px solid var(--ok)}",
    ".nthview-temple-run .nthview-stamp.nthview-wrong{outline:2px solid var(--no)}",
    ".nthview-temple-run .nthview-cloze{line-height:2.1;font-size:1.05rem;margin:4px 0}",
    ".nthview-temple-run .nthview-gap{display:inline-block;min-width:4.5em;border-bottom:3px solid var(--accent);padding:0 6px;text-align:center;font-weight:700;border-radius:4px 4px 0 0;background:color-mix(in srgb,var(--accent) 10%,transparent)}",
    ".nthview-temple-run .nthview-gap.nthview-active{background:color-mix(in srgb,var(--accent) 30%,transparent)}",
    ".nthview-temple-run .nthview-gap.nthview-right{border-color:var(--ok)}",
    ".nthview-temple-run .nthview-gap.nthview-wrong{border-color:var(--no)}",
    ".nthview-temple-run .nthview-gaprow{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:8px 0}",
    ".nthview-temple-run .nthview-gaprow>span{font-size:.82rem;color:var(--muted);min-width:3.6em}",
    ".nthview-temple-run .nthview-range{width:100%;accent-color:var(--accent);height:34px}",
    ".nthview-temple-run .nthview-bignum{font-family:var(--display);font-weight:700;font-size:2.2rem;text-align:center;line-height:1.1}",
    ".nthview-temple-run .nthview-input{font:inherit;font-size:1.1rem;width:100%;border:2px solid var(--line);border-radius:12px;padding:11px 13px;background:var(--panel-solid);color:inherit}",
    ".nthview-temple-run .nthview-input:focus{border-color:var(--accent);outline:none}",
    ".nthview-temple-run .nthview-input.nthview-wrong{border-color:var(--no)}",
    ".nthview-temple-run .nthview-input.nthview-right{border-color:var(--ok)}",
    ".nthview-temple-run .nthview-keys{display:grid;grid-template-columns:repeat(4,1fr);gap:6px;margin-top:8px}",
    ".nthview-temple-run .nthview-keys button{border:2px solid var(--line);background:var(--panel-solid);border-radius:12px;min-height:46px;font-weight:700;font-size:1.1rem}",
    ".nthview-temple-run .nthview-frow{margin:10px 0}",
    ".nthview-temple-run .nthview-flabel{font-size:.93rem;margin-bottom:4px}",
    ".nthview-temple-run .nthview-fline{display:flex;align-items:center;gap:10px}",
    ".nthview-temple-run .nthview-track{flex:1;height:14px;border-radius:7px;background:color-mix(in srgb,var(--ink) 10%,transparent);position:relative}",
    ".nthview-temple-run .nthview-track .nthview-bar{height:100%;border-radius:7px;background:var(--accent);transition:width 1.2s ease-out;width:0}",
    ".nthview-temple-run .nthview-bar.nthview-grey{background:#a29a8c}",
    ".nthview-temple-run .nthview-bar.nthview-dashed{background:repeating-linear-gradient(90deg,var(--accent) 0 9px,transparent 9px 15px)}",
    ".nthview-temple-run .nthview-track .nthview-mark{position:absolute;top:-5px;height:24px;width:4px;border-radius:2px;background:var(--ok);transform:translateX(-50%);box-shadow:0 0 0 2px var(--panel-solid)}",
    ".nthview-temple-run .nthview-fline b{min-width:5.4ch;text-align:right}",
    ".nthview-temple-run .nthview-stepper{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0}",
    ".nthview-temple-run .nthview-stepper .nthview-ctl{display:flex;align-items:center;gap:10px}",
    ".nthview-temple-run .nthview-stepper button{width:44px;height:44px;border-radius:12px;border:2px solid var(--line);background:var(--panel-solid);font-size:1.3rem;font-weight:700}",
    ".nthview-temple-run .nthview-stepper b{min-width:2ch;text-align:center;font-size:1.35rem}",
    ".nthview-temple-run .nthview-pile{font-size:1.2rem;letter-spacing:2px;line-height:1.4;min-height:1.4em;margin-top:6px;word-break:break-all}",
    ".nthview-temple-run .nthview-gridvis{display:grid;gap:4px;margin-top:8px;justify-content:start}",
    ".nthview-temple-run .nthview-gridvis i{width:16px;height:16px;border-radius:4px;background:var(--accent);display:block}",
    ".nthview-temple-run .nthview-story{display:grid;gap:8px;margin-top:10px}",
    ".nthview-temple-run .nthview-story p{margin:0;padding:10px 12px;border-radius:12px;background:var(--panel-solid);border:1px solid var(--line);animation:nthview-in .35s ease-out}",
    "@keyframes nthview-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}",
    ".nthview-temple-run .nthview-sw{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--line)}",
    ".nthview-temple-run .nthview-toggle{width:56px;height:32px;border-radius:16px;border:0;background:#a29a8c;position:relative;flex:none;padding:0}",
    ".nthview-temple-run .nthview-toggle::after{content:\"\";position:absolute;top:3px;left:3px;width:26px;height:26px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}",
    ".nthview-temple-run .nthview-toggle[aria-checked=true]{background:var(--accent)}",
    ".nthview-temple-run .nthview-toggle[aria-checked=true]::after{transform:translateX(24px)}",
    ".nthview-temple-run .nthview-lamp{display:inline-block;width:12px;height:12px;border-radius:50%;background:#a29a8c;margin-right:8px;vertical-align:middle}",
    ".nthview-temple-run .nthview-lamp.nthview-ok{background:var(--ok);box-shadow:0 0 8px var(--ok)}",
    ".nthview-temple-run .nthview-lamp.nthview-no{background:var(--no);box-shadow:0 0 8px var(--no)}",
    ".nthview-temple-run .nthview-lamp.nthview-note{background:var(--gold);box-shadow:0 0 8px var(--gold)}",
    ".nthview-temple-run .nthview-seg{display:inline-flex;flex-wrap:wrap;gap:5px}",
    ".nthview-temple-run .nthview-seg button{border:2px solid var(--line);background:var(--panel-solid);border-radius:10px;padding:7px 12px;font-size:.88rem;font-weight:700;min-height:38px}",
    ".nthview-temple-run .nthview-seg button[aria-pressed=true]{background:var(--accent);border-color:transparent;color:var(--on-accent)}",
    ".nthview-temple-run .nthview-card3{perspective:900px;margin-top:10px}",
    ".nthview-temple-run .nthview-flip{position:relative;min-height:150px;transition:transform .5s;transform-style:preserve-3d}",
    ".nthview-temple-run .nthview-flip.nthview-flipped{transform:rotateY(180deg)}",
    ".nthview-temple-run .nthview-face{position:absolute;inset:0;backface-visibility:hidden;-webkit-backface-visibility:hidden;display:grid;place-items:center;text-align:center;padding:16px;border-radius:16px;background:var(--panel-solid);border:2px solid var(--accent);font-family:var(--display);font-weight:700;font-size:1.2rem;overflow:auto}",
    ".nthview-temple-run .nthview-face.nthview-back{transform:rotateY(180deg);font-family:var(--body);font-weight:400;font-size:1rem}",
    ".nthview-temple-run .nthview-padsgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:10px}",
    ".nthview-temple-run .nthview-padcard{flex-direction:column;justify-content:flex-end;text-align:center;min-height:150px;padding:10px}",
    ".nthview-temple-run .nthview-padvis{display:flex;align-items:flex-end;justify-content:center;gap:6px;height:84px;width:100%}",
    ".nthview-temple-run .nthview-padvis i{display:block;width:18px;border-radius:4px 4px 0 0;background:var(--accent)}",
    ".nthview-temple-run .nthview-padvis i.nthview-grey{background:#a29a8c}",
    ".nthview-temple-run .nthview-padvis svg{display:block}",
    ".nthview-temple-run .nthview-padname{font-family:var(--display);font-weight:700}",
    ".nthview-temple-run .nthview-diagram{width:100%;height:auto;display:block;border-radius:14px;background:var(--panel-solid);border:1px solid var(--line);touch-action:manipulation}",
    ".nthview-temple-run .nthview-diagram .nthview-part{cursor:pointer;transition:opacity .2s}",
    ".nthview-temple-run .nthview-diagram .nthview-part:focus{outline:none}",
    ".nthview-temple-run .nthview-diagram .nthview-part:focus-visible .nthview-shape,.nthview-temple-run .nthview-diagram .nthview-part:hover .nthview-shape{stroke:var(--accent);stroke-width:1.2}",
    ".nthview-temple-run .nthview-diagram .nthview-part.nthview-dim{opacity:.35}",
    ".nthview-temple-run .nthview-diagram .nthview-part.nthview-right .nthview-shape{stroke:var(--ok);stroke-width:1.6}",
    ".nthview-temple-run .nthview-diagram text{font:700 3.2px var(--body);pointer-events:none}",
    ".nthview-temple-run .nthview-conf{margin-top:12px}",
    /* overlays */
    ".nthview-temple-run .nthview-overlay{position:absolute;inset:0;z-index:20;display:flex;flex-direction:column;align-items:center;padding:16px 12px;background:rgba(8,6,4,.42);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);overflow-y:auto;pointer-events:auto}",
    ".nthview-temple-run .nthview-card{background:var(--panel-solid);color:var(--ink);border-radius:22px;padding:22px 22px 24px;max-width:560px;width:100%;margin:auto 0;flex:none;box-shadow:0 20px 60px rgba(0,0,0,.4);border-top:4px solid var(--accent);user-select:text}",
    ".nthview-temple-run .nthview-card h1{font-family:var(--display);font-weight:900;font-size:clamp(2rem,8.5vw,3.2rem);line-height:1;letter-spacing:.01em;margin:0 0 12px;overflow-wrap:anywhere}",
    ".nthview-temple-run .nthview-big{font-size:1.06rem}",
    ".nthview-temple-run .nthview-card ol,.nthview-temple-run .nthview-card ul,.nthview-temple-run .nthview-panel ul{padding-left:1.3rem;line-height:1.5}",
    ".nthview-temple-run .nthview-card li,.nthview-temple-run .nthview-panel li{margin:6px 0}",
    ".nthview-temple-run .nthview-small{font-size:.88rem;color:var(--muted)}",
    ".nthview-temple-run .nthview-scorecard{display:flex;gap:10px;flex-wrap:wrap;margin:10px 0 6px}",
    ".nthview-temple-run .nthview-scorecard div{flex:1;min-width:96px;background:var(--chip);border:1px solid var(--line);border-radius:14px;padding:10px 12px;font-size:.85rem}",
    ".nthview-temple-run .nthview-scorecard b{display:block;font-family:var(--display);font-size:1.45rem}",
    ".nthview-temple-run .nthview-results{list-style:none;padding:0!important;margin:8px 0}",
    ".nthview-temple-run .nthview-results li{display:flex;gap:10px;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--line);margin:0!important}",
    ".nthview-temple-run .nthview-results .nthview-rs{color:var(--gold);white-space:nowrap;font-size:.95rem;min-width:3.4em}",
    ".nthview-temple-run .nthview-results .nthview-rt{flex:1;min-width:0}",
    ".nthview-temple-run details.nthview-more{margin:12px 0;border:1px solid var(--line);border-radius:14px;padding:8px 12px;background:var(--chip)}",
    ".nthview-temple-run details.nthview-more summary{cursor:pointer;font-weight:700;padding:4px 0}",
    ".nthview-temple-run table.nthview-t{border-collapse:collapse;width:100%;font-size:.93rem;margin-top:8px}",
    ".nthview-temple-run table.nthview-t th,.nthview-temple-run table.nthview-t td{padding:7px 8px;border-bottom:1px solid var(--line);text-align:left;vertical-align:top}",
    ".nthview-temple-run .nthview-menu{display:grid;gap:10px;margin-top:12px}",
    ".nthview-temple-run .nthview-menu .nthview-btn{width:100%}",
    ".nthview-temple-run a{color:var(--accent)}",
    "@media (prefers-reduced-motion:reduce){.nthview-temple-run .nthview-panel,.nthview-temple-run .nthview-toast,.nthview-temple-run .nthview-track .nthview-bar,.nthview-temple-run .nthview-flip,.nthview-temple-run .nthview-toggle::after,.nthview-temple-run .nthview-callout{transition:none}.nthview-temple-run .nthview-vignette.nthview-hit,.nthview-temple-run .nthview-torch.nthview-flicker::after{animation-duration:.01s}}"
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
      el("p", { text: "The temple run is drawn with WebGL, which this browser has turned off or does not support." }),
      el("p", { text: "Turn on hardware acceleration in the browser settings, or open this file in another browser, then reload." })
    ]));
  }


  // ---- progress storage (identical in every view, §5.5) ------------------
  var STORE_VERSION = 1;
  function storageKey(data) {
    var s = JSON.stringify(data), h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return "nthview:temple-run:" + (h >>> 0).toString(36);
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
  var THEMES = ["jungle", "haunted", "sand", "ice"];
  var ENCOUNTERS = ["gate", "ghost", "fire", "guardian", "bridge", "monkey", "vines", "idol", "ropebridge", "serpent"];
  var SCENERIES = ["causeway", "canopy", "ruins", "cliffs", "waterfall", "bridges", "tunnel", "courtyard"];
  var PANEL_SCORED = ["choice", "truefalse", "multi", "cloze", "order", "match", "sort", "rank", "estimate", "number", "text", "odd", "hotspot", "pads", "predict", "confidence"];
  var PANEL_EXPLORE = ["compare", "bars", "switches", "flashcards", "story", "tune", "race"];
  var TRACK_SCORED = ["lanes", "gates", "torches", "planks", "harvest", "levers", "tiles"];
  var TRACK_TYPES = TRACK_SCORED.concat(["collect"]);
  var REPLACES_QUIZ = PANEL_SCORED.concat(TRACK_SCORED);
  var ENCOUNTER_INFO = {
    gate: { name: "A sealed gate", line: "Stone bars block the way. A carved voice rumbles a question.", ok: "The bars grind up into the lintel.", no: "The bars rattle and dust pours down." },
    ghost: { name: "A lantern ghost", line: "A pale ghost drifts onto the path, lantern raised.", ok: "The ghost bows and fades into mist.", no: "The ghost shrieks and its lantern flares." },
    fire: { name: "A wall of fire", line: "Flames leap up across the path.", ok: "The flames sink to embers.", no: "The fire roars higher." },
    guardian: { name: "A stone guardian", line: "A statue steps down from its plinth and crosses its spear.", ok: "The guardian lowers its spear and steps aside.", no: "The spear slams down; the eyes glow red." },
    bridge: { name: "A turning bridge", line: "The bridge over the chasm has swung away.", ok: "The bridge grinds round into place.", no: "The bridge shudders the wrong way." },
    monkey: { name: "The demon monkey king", line: "A huge masked monkey leaps onto the path and beats its chest.", ok: "The monkey king screeches and swings off into the trees.", no: "The monkey king roars and laughs." },
    vines: { name: "A wall of vines", line: "Thick vines knot themselves across the path.", ok: "The vines wither and pull back.", no: "The vines lash and tighten." },
    idol: { name: "The golden idol", line: "A giant golden face rises from the ground, eyes burning.", ok: "The idol's eyes dim and it floats away into the sky.", no: "The idol's eyes flash red." },
    ropebridge: { name: "A broken rope bridge", line: "Planks are missing from the rope bridge ahead.", ok: "The missing planks fly into place.", no: "The bridge sways and a plank snaps." },
    serpent: { name: "The stone serpent", line: "A great stone serpent rises from the chasm and hisses.", ok: "The serpent sinks back into the deep.", no: "The serpent hisses and lunges." }
  };
  var CHASER_DEFAULT = { jungle: "monkey", haunted: "ghost", sand: "jackal", ice: "yeti" };
  var TYPE_HELP = {
    lanes: "Run through the lane with the right answer.",
    gates: "Run through the right gate.",
    torches: "Run through a brazier to light it; steer around the ones that should stay dark.",
    planks: "Step on a plank if its statement is true; jump over it if it is false.",
    harvest: "Grab the tokens that belong; dodge the others.",
    levers: "Run through the levers in the right order.",
    tiles: "Step on the tile of the group each orb belongs to.",
    collect: "Run through every glowing token to collect it."
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

  /* 3D look of each world theme: sky, fog, light, materials, props and ambient effects */
  var WORLD = {
    jungle: { skyTop: "#4f93d2", skyHor: "#dfe8d0", skyBot: "#87a58a", fog: "#cdd9c3", fogNear: 26, fogFar: 135, sun: "#fff0c4", sunDir: [-0.45, 0.42, -0.78], sunI: 1.05, sunS: 1.0,
      hemiSky: "#fff4d8", hemiGround: "#4a5a34", hemiI: 0.78, stone: "#b9a37a", stoneDark: "#786548", path: "#cdb88c", moss: "#5d7f34", leaf: ["#3f7d2c", "#5b9a36", "#2e6323", "#76a63c"],
      trunk: "#5a4330", rock: "#8a7d6a", water: "#cdeef3", glow: "#ffd36b", eye: "#ff3b2a", abyss: "#7f9c80", mountain: "#86a397", fire: "#ff9a2e", fireCore: "#ffe08a",
      particle: "fireflies", pColor: "#f6ff9a", trees: "broad", statue: "monkey", sky: "sun", runnerScarf: "#b8402f" },
    haunted: { skyTop: "#060a20", skyHor: "#2c3c6c", skyBot: "#0c1330", fog: "#26345e", fogNear: 12, fogFar: 100, sun: "#d6e2ff", sunDir: [0.4, 0.38, -0.82], sunI: 0.62, sunS: 0.8,
      hemiSky: "#93a8ff", hemiGround: "#1a1a32", hemiI: 0.72, stone: "#77809b", stoneDark: "#424a66", path: "#868fa8", moss: "#3e6466", leaf: ["#2b3b40", "#344a52", "#202b31", "#3b4c46"],
      trunk: "#2d2832", rock: "#4d546c", water: "#a9c8ff", glow: "#9fe0ff", eye: "#7ff7ff", abyss: "#1b2546", mountain: "#1e2a4e", fire: "#3fd6ff", fireCore: "#c8fbff",
      particle: "wisps", pColor: "#9fe8ff", trees: "dead", statue: "gargoyle", sky: "moon", runnerScarf: "#3b7dd8" },
    sand: { skyTop: "#3c8ccf", skyHor: "#f5dcaa", skyBot: "#e3b47c", fog: "#efd09f", fogNear: 24, fogFar: 130, sun: "#fff1cc", sunDir: [-0.2, 0.62, -0.76], sunI: 1.15, sunS: 1.1,
      hemiSky: "#fff3d8", hemiGround: "#8a5a32", hemiI: 0.82, stone: "#d49b5d", stoneDark: "#9b6237", path: "#e3b47a", moss: "#a08c46", leaf: ["#5b8a37", "#70a03e", "#4b7a2f", "#88aa4a"],
      trunk: "#8a6a42", rock: "#b37b4b", water: "#7fd8d0", glow: "#ffcf5a", eye: "#ffd23a", abyss: "#c9915c", mountain: "#cf9e6c", fire: "#ff8a2a", fireCore: "#ffe08a",
      particle: "sand", pColor: "#f3d29a", trees: "palm", statue: "jackal", sky: "sun", runnerScarf: "#1f8fb8" },
    ice: { skyTop: "#6a9bd4", skyHor: "#e6eff8", skyBot: "#b9cbdb", fog: "#dde7f1", fogNear: 20, fogFar: 120, sun: "#ffffff", sunDir: [0.3, 0.4, -0.86], sunI: 0.95, sunS: 0.9,
      hemiSky: "#ffffff", hemiGround: "#7f93aa", hemiI: 0.9, stone: "#aac0d3", stoneDark: "#6f86a0", path: "#cbdae7", moss: "#f4f8fc", leaf: ["#2f5a4f", "#3b6a5a", "#264a42", "#4a7a66"],
      trunk: "#4a3a30", rock: "#8fa5b9", water: "#d3f1fb", glow: "#a8ecff", eye: "#4fe0ff", abyss: "#a9bccd", mountain: "#bccbdb", fire: "#ff9a3a", fireCore: "#ffe6a0",
      particle: "snow", pColor: "#ffffff", trees: "pine", statue: "warrior", sky: "sun", runnerScarf: "#c2304a" }
  };
  /* side scenery kits per stretch scenery, with weights */
  var KITS = {
    causeway: [["trees", 3], ["wall", 3], ["pillars", 3], ["void", 1], ["statues", 1]],
    canopy: [["trees", 7], ["wall", 1], ["void", 1]],
    ruins: [["pillars", 4], ["statues", 3], ["wall", 2], ["trees", 1]],
    cliffs: [["cliff", 6], ["void", 2], ["trees", 1]],
    waterfall: [["waterfall", 5], ["cliff", 2], ["trees", 2]],
    bridges: [["void", 5], ["trees", 2], ["pillars", 1]],
    tunnel: [["wall", 7], ["statues", 2]],
    courtyard: [["obelisks", 4], ["statues", 3], ["pillars", 2]]
  };
  var HAZARD_W = {
    causeway: { root: 2, trunk: 2, gap: 2, fire: 2, branch: 1, rubble: 2, flames: 1 },
    canopy: { root: 4, trunk: 3, branch: 3, gap: 1, rubble: 1 },
    ruins: { gap: 3, rubble: 3, fire: 2, trunk: 1, flames: 1 },
    cliffs: { gap: 2, rubble: 2, root: 1, fire: 1 },
    waterfall: { trunk: 2, root: 2, gap: 2, branch: 1 },
    bridges: { gap: 3, fire: 1, rubble: 1 },
    tunnel: { fire: 3, flames: 2, rubble: 2, gap: 1 },
    courtyard: { rubble: 2, flames: 2, fire: 2, trunk: 1 }
  };
  var HAZARD_P = { none: 0, light: 0.32, normal: 0.5, heavy: 0.72 };
  var LANE = 1.7, HALF = 2.75, RUN_LEN = 90;

  function pickW(list, rnd) { var tot = 0, i; for (i = 0; i < list.length; i++) tot += list[i][1]; var r = rnd() * tot; for (i = 0; i < list.length; i++) { r -= list[i][1]; if (r <= 0) return list[i][0]; } return list[0][0]; }
  function pickObj(obj, rnd) { return pickW(Object.keys(obj).map(function (k) { return [k, obj[k]]; }), rnd); }

  /* ======================================================================
     The game. Everything below is driven by `data`.
     ====================================================================== */
  function render(container, data) {
    var THREE = root.THREE, doc = root.document;
    var N = data.stretches.length;
    var STRICT = data.strictMode === true;
    var themeName = data.theme || "jungle";
    var W3 = WORLD[themeName];
    var chaserKind = data.chaser.kind || CHASER_DEFAULT[themeName];
    var START_TORCHES = data.torches || 3;
    var hero = data.runner.name, chaserName = data.chaser.name;
    THEMES.forEach(function (k) { container.classList.remove("nthview-theme-" + k); });
    container.classList.add("nthview-tr-game", "nthview-theme-" + themeName);
    var mqReduce = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)");
    var coarse = !!(root.matchMedia && root.matchMedia("(hover: none) and (pointer: coarse)").matches);
    var settings = { reduced: !!(mqReduce && mqReduce.matches), buttons: coarse, sound: true };

    var STRETCHES = data.stretches.map(function (s, i) {
      var type = s.activity ? s.activity.type : null;
      return { idx: i, data: s, id: s.id, name: s.name, scenery: s.scenery || SCENERIES[i % SCENERIES.length], encounter: s.encounter || ENCOUNTERS[i % ENCOUNTERS.length],
        hazards: s.hazards || "normal", type: type, track: !!type && TRACK_TYPES.indexOf(type) !== -1, color: s.color || null };
    });

    /* ---------- DOM scaffold ---------- */
    var svgNS = "http://www.w3.org/2000/svg";
    function icon(d, size) {
      var s = doc.createElementNS(svgNS, "svg"); s.setAttribute("viewBox", "0 0 24 24"); s.setAttribute("width", String(size || 22)); s.setAttribute("height", String(size || 22)); s.setAttribute("aria-hidden", "true");
      var pth = doc.createElementNS(svgNS, "path"); pth.setAttribute("d", d); pth.setAttribute("fill", "currentColor"); s.appendChild(pth); return s;
    }
    var ICON = { pause: "M6 4h4v16H6zM14 4h4v16h-4z", left: "M15.5 4 7 12l8.5 8 1.5-1.6L10.2 12 17 5.6z", right: "M8.5 4 17 12l-8.5 8L7 18.4 13.8 12 7 5.6z", up: "M4 15.5 12 7l8 8.5-1.6 1.5L12 10.2 5.6 17z", down: "M4 8.5 12 17l8-8.5L18.4 7 12 13.8 5.6 7z" };
    var canvas = el("canvas", { class: "nthview-canvas", tabindex: "0", "aria-label": "Temple run. Left and right arrows change lane and take turns, up jumps, down slides, P pauses." });
    var col = el("div", { class: "nthview-col" });
    var pauseBtn = el("button", { type: "button", class: "nthview-hchip nthview-pausebtn", "aria-label": "Pause" }, [icon(ICON.pause, 20)]);
    var hName = el("div", { class: "nthview-hname", text: data.title });
    var hFill = el("i"), hFill2 = el("i"), dFill = el("i");
    var hMid = el("div", { class: "nthview-hchip nthview-hmid" }, [hName, el("div", { class: "nthview-hbar", "aria-hidden": "true" }, [hFill]), el("div", { class: "nthview-hbar nthview-thin", "aria-hidden": "true" }, [hFill2]),
      el("div", { class: "nthview-danger", "aria-hidden": "true" }, [el("span", { text: chaserName.length > 22 ? "Chasers" : chaserName.charAt(0).toUpperCase() + chaserName.slice(1) }), el("div", { class: "nthview-hbar" }, [dFill])])]);
    var torchRow = el("div", { class: "nthview-torches", role: "img" });
    var starOut = el("b", { text: "0" }), coinOut = el("b", { text: "0" }), capOut = el("b", { text: "0" });
    var hRight = el("div", { class: "nthview-hchip nthview-hright" }, [torchRow, el("div", { class: "nthview-hstats" }, [el("span", {}, [doc.createTextNode("★ "), starOut]), el("span", {}, [doc.createTextNode("◉ "), coinOut]), el("span", { title: "Times captured", "aria-label": "times captured" }, [doc.createTextNode("✋ "), capOut])])]);
    var KEY = storageKey(data), SAVED = loadState(KEY);
    var hud = el("div", { class: "nthview-hud" }, [el("div", { class: "nthview-hleft" }, [pauseBtn, restartButton(container, data, KEY)]), hMid, hRight]);
    var cKick = el("div", { class: "nthview-ckick" }), cText = el("div", { class: "nthview-ctext" }), cBig = el("div", { class: "nthview-cbig" }), cLanes = el("div", { class: "nthview-lanes" }), cFb = el("div", { class: "nthview-cfb", "aria-live": "polite" });
    var callout = el("div", { class: "nthview-callout nthview-off", "aria-live": "polite" }, [cKick, cText, cBig, cLanes, cFb]);
    var turnHint = el("div", { class: "nthview-turnhint", "aria-hidden": "true" });
    var toastEl = el("div", { class: "nthview-toast", role: "status", "aria-live": "polite" });
    var srLive = el("div", { class: "nthview-sr", "aria-live": "assertive" });
    var padBtns = {};
    var pad = el("div", { class: "nthview-pad" }, ["left", "up", "down", "right"].map(function (k) {
      var b = el("button", { type: "button", "aria-label": { left: "Move left or turn left", up: "Jump", down: "Slide", right: "Move right or turn right" }[k] }, [icon(ICON[k], 26)]);
      b.addEventListener("pointerdown", function (e) { e.preventDefault(); act(k); });
      b.addEventListener("click", function (e) { if (e.detail === 0) act(k); });
      padBtns[k] = b; return b;
    }));
    var pbody = el("div");
    var panel = el("section", { class: "nthview-panel", "aria-label": "Lesson", tabindex: "-1" }, [pbody]);
    [hud, callout, turnHint, toastEl, pad, panel, srLive].forEach(function (n) { col.appendChild(n); });
    var vignette = el("div", { class: "nthview-vignette", "aria-hidden": "true" });
    var grade = el("div", { class: "nthview-grade", "aria-hidden": "true" });
    var fadeEl = el("div", { class: "nthview-fade", "aria-hidden": "true" });
    var overlay = el("div", { class: "nthview-overlay nthview-hidden" });
    var ocard = el("div", { class: "nthview-card", role: "dialog", "aria-modal": "true" });
    overlay.appendChild(ocard);
    [canvas, grade, vignette, col, overlay, fadeEl].forEach(function (n) { container.appendChild(n); });

    /* ---------- state & score ---------- */
    var S = {
      mode: "intro", k: 0, torches: START_TORCHES, coins: 0, stumbles: 0, paused: false, caughtCount: 0, runSeed: 0,
      results: STRETCHES.map(function () { return { mistakes: 0, done: false, stars: 0, notes: [] }; }),
      finale: { list: [], i: 0, mistakes: 0, done: false }
    };
    var saveTimer = 0;
    function snapshot() {
      var phase = S.mode === "report" || S.mode === "exit" ? "report" : S.mode === "finale" || S.mode === "sprint" ? "finale" : "stretch";
      return { phase: phase, k: Math.min(S.k, N), torches: S.torches, coins: S.coins, caught: S.caughtCount, runSeed: S.runSeed,
        results: S.results.map(function (r) { return { m: r.mistakes, d: r.done ? 1 : 0, s: r.stars }; }),
        finale: { m: S.finale.mistakes, done: S.finale.done ? 1 : 0, i: S.finale.i },
        settings: { reduced: settings.reduced, buttons: settings.buttons, sound: settings.sound } };
    }
    function saveNow() { clearTimeout(saveTimer); saveTimer = 0; if (S.mode !== "intro" && canvas.isConnected) saveState(KEY, snapshot()); }
    function persist() { if (!saveTimer) saveTimer = setTimeout(saveNow, 250); }
    function intIn(v, lo, hi) { return typeof v === "number" && v % 1 === 0 && v >= lo && v <= hi; }
    /* apply a saved record field by field; anything that no longer fits the data is ignored */
    function restoreState(sv) {
      if (sv.settings && typeof sv.settings === "object") ["reduced", "buttons", "sound"].forEach(function (k2) { if (typeof sv.settings[k2] === "boolean") settings[k2] = sv.settings[k2]; });
      if (Array.isArray(sv.results)) sv.results.forEach(function (r, i) { if (i >= N || !r || typeof r !== "object") return; if (intIn(r.m, 0, 999)) S.results[i].mistakes = r.m; if (r.d === 1 || r.d === 0) S.results[i].done = !!r.d; if (intIn(r.s, 0, 3)) S.results[i].stars = r.s; });
      if (intIn(sv.torches, 0, 9)) S.torches = sv.torches;
      if (STRICT && S.torches <= 0) S.torches = START_TORCHES;
      if (intIn(sv.coins, 0, 1e7)) S.coins = sv.coins;
      if (intIn(sv.caught, 0, 1e5)) S.caughtCount = sv.caught;
      if (intIn(sv.runSeed, 0, 1e6)) S.runSeed = sv.runSeed;
      if (sv.finale && typeof sv.finale === "object") { if (intIn(sv.finale.m, 0, 999)) S.finale.mistakes = sv.finale.m; if (intIn(sv.finale.i, 0, 50)) S.finale.i = sv.finale.i; }
      var k = intIn(sv.k, 0, N) ? sv.k : 0, phase = ["stretch", "finale", "report"].indexOf(sv.phase) !== -1 ? sv.phase : "stretch";
      while (phase === "stretch" && k < N && S.results[k].done) k++;
      if (phase === "stretch" && k >= N) phase = "finale";
      if (phase === "report" && !S.results.every(function (r) { return r.done; })) { phase = "stretch"; k = 0; while (k < N && S.results[k].done) k++; if (k >= N) phase = "finale"; }
      return { k: Math.min(k, N - 1), phase: phase };
    }
    function totalStars() { var t = 0; for (var i = 0; i < S.results.length; i++) t += S.results[i].stars; return t; }
    function starsFor(m) { return m <= 0 ? 3 : m === 1 ? 2 : 1; }
    function renderTorches() {
      torchRow.textContent = "";
      var n = Math.max(START_TORCHES, S.torches);
      for (var i = 0; i < n; i++) torchRow.appendChild(el("span", { class: "nthview-torch" + (i < S.torches ? "" : " nthview-out") }));
      torchRow.setAttribute("aria-label", S.torches + " of " + START_TORCHES + " torches");
    }
    function renderScore() { starOut.textContent = String(totalStars()); coinOut.textContent = String(S.coins); capOut.textContent = String(S.caughtCount); }
    function renderHud() {
      var k = Math.min(S.k, N - 1);
      hName.textContent = S.mode === "sprint" || S.mode === "finale" || S.mode === "exit" ? data.finale.name : "Stretch " + (k + 1) + " of " + N + " · " + STRETCHES[k].name;
      hFill.style.width = (100 * (S.mode === "sprint" || S.mode === "exit" || S.mode === "report" ? 1 : k / N)) + "%";
    }
    var toastTimer = 0;
    function toast(msg, ms) { toastEl.textContent = msg; toastEl.classList.add("nthview-show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("nthview-show"); }, ms || 1800); }
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
          case "coin": tone(1046, 0, .08, "triangle", .04); tone(1568, .05, .12, "triangle", .035); break;
          case "jump": tone(300, 0, .18, "triangle", .05, 620); break;
          case "slide": tone(220, 0, .22, "sawtooth", .02, 120); break;
          case "turn": tone(520, 0, .07, "triangle", .03); break;
          case "stumble": tone(120, 0, .25, "square", .05, 60); tone(90, .05, .3, "sawtooth", .04); break;
          case "ok": [523, 659, 784].forEach(function (f, i) { tone(f, i * .08, .28); }); break;
          case "no": tone(180, 0, .3, "sawtooth", .04, 120); tone(140, .12, .32, "sawtooth", .03); break;
          case "roar": tone(90, 0, .6, "sawtooth", .05, 55); tone(140, .05, .45, "square", .02, 70); break;
          case "grind": tone(70, 0, 1.1, "sawtooth", .035, 50); tone(105, .2, .8, "square", .015); break;
          case "win": [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * .1, .45); }); break;
          case "open": tone(440, 0, .07, "triangle", .03); break;
          case "pick": tone(660, 0, .08, "triangle", .04); tone(990, .05, .1, "triangle", .03); break;
        }
      } catch (e) { /* audio is optional */ }
    }

    /* ---------- renderer, camera, sky ---------- */
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, powerPreference: "high-performance" });
    var pixelRatio = Math.min(root.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(pixelRatio);
    var VW = function () { return container.clientWidth || 400; }, VH = function () { return container.clientHeight || 700; };
    renderer.setSize(VW(), VH(), false);
    var scene = new THREE.Scene();
    var fogCol = new THREE.Color(W3.fog);
    scene.background = fogCol.clone();
    scene.fog = new THREE.Fog(fogCol, W3.fogNear, W3.fogFar);
    var BASE_FOV = 62, DESIGN_ASPECT = 0.5625;
    var camera = new THREE.PerspectiveCamera(BASE_FOV, VW() / VH(), 0.1, 700);
    function fitCamera() {
      var a = VW() / VH(); camera.aspect = a;
      /* keep the horizontal field of a 9:16 phone on narrower screens; wider screens just see more scenery at the sides */
      if (a < DESIGN_ASPECT) { var hf = 2 * Math.atan(Math.tan(BASE_FOV * Math.PI / 360) * DESIGN_ASPECT); camera.fov = Math.min(84, 2 * Math.atan(Math.tan(hf / 2) / a) * 180 / Math.PI); }
      else camera.fov = BASE_FOV;
      camera.updateProjectionMatrix();
    }
    fitCamera();
    var hemi = new THREE.HemisphereLight(W3.hemiSky, W3.hemiGround, W3.hemiI * .72); scene.add(hemi);
    var sunLight = new THREE.DirectionalLight(W3.sun, W3.sunI * 1.3); sunLight.position.set(W3.sunDir[0] * 100, W3.sunDir[1] * 100, W3.sunDir[2] * 100); scene.add(sunLight);
    var sunDirV = new THREE.Vector3(W3.sunDir[0], W3.sunDir[1], W3.sunDir[2]).normalize();
    var skyMat = new THREE.ShaderMaterial({
      uniforms: { top: { value: new THREE.Color(W3.skyTop) }, hor: { value: new THREE.Color(W3.skyHor) }, bot: { value: new THREE.Color(W3.skyBot) }, sunC: { value: new THREE.Color(W3.sun) }, sunD: { value: sunDirV }, sunS: { value: W3.sunS }, moon: { value: W3.sky === "moon" ? 1 : 0 } },
      vertexShader: "varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }",
      fragmentShader: "uniform vec3 top; uniform vec3 hor; uniform vec3 bot; uniform vec3 sunC; uniform vec3 sunD; uniform float sunS; uniform float moon; varying vec3 vDir;" +
        "void main(){ vec3 d = normalize(vDir); float h = d.y; vec3 c = h > 0.0 ? mix(hor, top, pow(clamp(h, 0.0, 1.0), 0.55)) : mix(hor, bot, pow(clamp(-h, 0.0, 1.0), 0.45));" +
        "float s = max(dot(d, normalize(sunD)), 0.0); float disc = smoothstep(mix(0.9986, 0.9993, moon), mix(0.9991, 0.9996, moon), s);" +
        "c = mix(c, sunC, disc * sunS); c += sunC * (pow(s, 14.0) * mix(0.32, 0.12, moon) + pow(s, 120.0) * 0.25) * sunS; gl_FragColor = vec4(c, 1.0); }",
      side: THREE.BackSide, depthWrite: false, fog: false
    });
    var sky = new THREE.Mesh(new THREE.SphereGeometry(500, 32, 16), skyMat); sky.renderOrder = -10; scene.add(sky);
    var starPts = null;
    if (W3.sky === "moon") {
      var sp = [], rs = seeded("stars"); for (var si = 0; si < 700; si++) { var th = rs() * Math.PI * 2, ph = rs() * Math.PI * 0.42; sp.push(450 * Math.sin(ph) * Math.cos(th), 450 * Math.cos(ph) + 10, 450 * Math.sin(ph) * Math.sin(th)); }
      var sg = new THREE.BufferGeometry(); sg.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
      starPts = new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 1.3, sizeAttenuation: false, fog: false, transparent: true, opacity: .85 })); starPts.renderOrder = -9; scene.add(starPts);
    }

    /* ---------- materials ---------- */
    var matStatic = new THREE.MeshLambertMaterial({ vertexColors: true });
    var matGlow = new THREE.MeshBasicMaterial({ vertexColors: true });
    var matFire = new THREE.MeshBasicMaterial({ color: W3.fire, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    var matFireCore = new THREE.MeshBasicMaterial({ color: W3.fireCore, transparent: true, opacity: .75, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
    function canvasTex(w, h, draw) { var c = doc.createElement("canvas"); c.width = w; c.height = h; draw(c.getContext("2d"), w, h); var t = new THREE.CanvasTexture(c); return t; }
    var waterTex = canvasTex(64, 256, function (x, w, h) {
      var g = x.createLinearGradient(0, 0, w, 0); g.addColorStop(0, "rgba(255,255,255,.55)"); g.addColorStop(.5, "rgba(255,255,255,.95)"); g.addColorStop(1, "rgba(255,255,255,.55)");
      x.fillStyle = g; x.fillRect(0, 0, w, h); var r = seeded("water");
      for (var i = 0; i < 70; i++) { x.fillStyle = "rgba(120,170,190," + (0.15 + r() * .3) + ")"; x.fillRect(r() * w, r() * h, 1 + r() * 4, 12 + r() * 40); }
    });
    waterTex.wrapS = waterTex.wrapT = THREE.RepeatWrapping; waterTex.repeat.set(1, 3);
    var matWater = new THREE.MeshBasicMaterial({ map: waterTex, color: W3.water, transparent: true, opacity: .82, depthWrite: false, side: THREE.DoubleSide });
    var blobTex = canvasTex(64, 64, function (x) { var g = x.createRadialGradient(32, 32, 2, 32, 32, 31); g.addColorStop(0, "rgba(0,0,0,.72)"); g.addColorStop(1, "rgba(0,0,0,0)"); x.fillStyle = g; x.fillRect(0, 0, 64, 64); });
    var matBlob = new THREE.MeshBasicMaterial({ map: blobTex, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    var softTex = canvasTex(128, 128, function (x) { var g = x.createRadialGradient(64, 64, 4, 64, 64, 63); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(.4, "rgba(255,255,255,.45)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
    var glowSpriteMat = new THREE.SpriteMaterial({ map: softTex, color: W3.glow, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .8 });

    /* ---------- geometry builder: merges many primitives into one vertex-coloured mesh ---------- */
    function ni(g) { return g.index ? g.toNonIndexed() : g; }
    var GEO = {
      box: new THREE.BoxGeometry(1, 1, 1).toNonIndexed(),
      cyl5: new THREE.CylinderGeometry(1, 1, 1, 5, 1).toNonIndexed(),
      cyl7: new THREE.CylinderGeometry(1, 1, 1, 7, 1).toNonIndexed(),
      cyl10: new THREE.CylinderGeometry(1, 1, 1, 10, 1).toNonIndexed(),
      taper: new THREE.CylinderGeometry(.62, 1, 1, 7, 1).toNonIndexed(),
      cone5: new THREE.ConeGeometry(1, 1, 5, 1).toNonIndexed(),
      cone7: new THREE.ConeGeometry(1, 1, 7, 1).toNonIndexed(),
      cone4: new THREE.ConeGeometry(1, 1, 4, 1).toNonIndexed(),
      ico: ni(new THREE.IcosahedronGeometry(1, 0)),
      ico1: ni(new THREE.IcosahedronGeometry(1, 1)),
      dode: ni(new THREE.DodecahedronGeometry(1, 0)),
      octa: ni(new THREE.OctahedronGeometry(1, 0)),
      arch: new THREE.TorusGeometry(1, .16, 5, 12, Math.PI).toNonIndexed(),
      ring: new THREE.TorusGeometry(1, .1, 5, 16).toNonIndexed(),
      plane: new THREE.PlaneGeometry(1, 1)
    };
    var _m4 = new THREE.Matrix4(), _q4 = new THREE.Quaternion(), _e4 = new THREE.Euler(), _p4 = new THREE.Vector3(), _s4 = new THREE.Vector3(), _c4 = new THREE.Color();
    function Builder(seed) { this.p = []; this.c = []; this.rnd = seeded(seed); this.mirror = false; this.aoLo = -26; this.aoHi = 2; this.aoMin = .38; this.contact = 0; }
    Builder.prototype.add = function (g, x, y, z, sx, sy, sz, rx, ry, rz, col, jit) {
      _e4.set(rx || 0, ry || 0, rz || 0); _q4.setFromEuler(_e4); _p4.set(x, y, z); _s4.set(sx, sy, sz); _m4.compose(_p4, _q4, _s4);
      var a = g.attributes.position.array, e = _m4.elements, n = a.length, P = this.p, C = this.c, mir = this.mirror;
      _c4.set(col); var j = jit === undefined ? .1 : jit, cr = _c4.r, cg = _c4.g, cb = _c4.b;
      var lo = this.aoLo, span = this.aoHi - this.aoLo, mn = this.aoMin, ct = this.contact;
      for (var i = 0; i < n; i += 9) {
        var f = 1 + (this.rnd() - .5) * j * 2;
        for (var v = 0; v < 3; v++) {
          var vi = i + ((mir && v > 0) ? (3 - v) * 3 : v * 3);
          var vx = a[vi], vy = a[vi + 1], vz = a[vi + 2];
          var wx = e[0] * vx + e[4] * vy + e[8] * vz + e[12], wy = e[1] * vx + e[5] * vy + e[9] * vz + e[13], wz = e[2] * vx + e[6] * vy + e[10] * vz + e[14];
          if (mir) wx = -wx;
          P.push(wx, wy, wz);
          var s = (wy - lo) / span; s = s < 0 ? 0 : s > 1 ? 1 : s; var sh = mn + (1 - mn) * s;
          if (ct && wy < .7 && wy > -.6) sh *= .72 + .28 * Math.max(0, wy) / .7;
          C.push(cr * f * sh, cg * f * sh, cb * f * sh);
        }
      }
      return this;
    };
    Builder.prototype.empty = function () { return this.p.length === 0; };
    Builder.prototype.mesh = function (mat) {
      var g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.Float32BufferAttribute(this.p, 3));
      g.setAttribute("color", new THREE.Float32BufferAttribute(this.c, 3));
      g.computeVertexNormals(); g.computeBoundingSphere();
      var m = new THREE.Mesh(g, mat || matStatic); m.matrixAutoUpdate = false; m.updateMatrix(); return m;
    };
    function mix(a, b, t) { _c4.set(a); var c2 = new THREE.Color(b); _c4.lerp(c2, t); return "#" + _c4.getHexString(); }

    /* ---------- labels drawn on canvas textures ---------- */
    var FONT_BODY = "\"Atkinson Hyperlegible\", \"Segoe UI\", system-ui, sans-serif";
    function wrapLines(x, text, maxW, maxLines) {
      var words = String(text).split(/\s+/), lines = [], cur = "";
      words.forEach(function (w) { var t = cur ? cur + " " + w : w; if (x.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
      if (cur) lines.push(cur); return lines.slice(0, maxLines);
    }
    /* a pooled board: one canvas, redrawn only when its text changes */
    function makeBoard(w, h) {
      var c = doc.createElement("canvas"); c.width = w; c.height = h;
      var tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
      var mat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, fog: false, side: THREE.DoubleSide });
      var mesh = new THREE.Mesh(GEO.plane, mat); mesh.renderOrder = 5;
      mesh.userData.draw = function (text, accent, sub) {
        var x = c.getContext("2d"); x.clearRect(0, 0, w, h);
        var r = h * .22; x.fillStyle = "rgba(16,12,8,.82)"; x.beginPath(); x.moveTo(r, 4); x.lineTo(w - r, 4); x.quadraticCurveTo(w - 4, 4, w - 4, r); x.lineTo(w - 4, h - r); x.quadraticCurveTo(w - 4, h - 4, w - r, h - 4); x.lineTo(r, h - 4); x.quadraticCurveTo(4, h - 4, 4, h - r); x.lineTo(4, r); x.quadraticCurveTo(4, 4, r, 4); x.fill();
        x.lineWidth = 8; x.strokeStyle = accent || "#ffcf5a"; x.stroke();
        x.fillStyle = "#fff8e8"; x.textAlign = "center"; x.textBaseline = "middle";
        var size = Math.round(h * (sub ? .3 : .42)); x.font = "700 " + size + "px " + FONT_BODY;
        var lines = wrapLines(x, text, w * .88, sub ? 2 : 2);
        if (lines.length > 1 || x.measureText(lines[0] || "").width > w * .88) { size = Math.round(size * .78); x.font = "700 " + size + "px " + FONT_BODY; lines = wrapLines(x, text, w * .9, 3); }
        var lh = size * 1.12, y0 = h / 2 - (lines.length - 1) * lh / 2 - (sub ? h * .1 : 0);
        lines.forEach(function (l, i) { x.fillText(l, w / 2, y0 + i * lh, w * .92); });
        if (sub) { x.font = "700 " + Math.round(h * .17) + "px " + FONT_BODY; x.fillStyle = accent || "#ffcf5a"; x.fillText(sub, w / 2, h - h * .17); }
        tex.needsUpdate = true;
      };
      return mesh;
    }

    /* ---------- far environment: abyss, mountains, mist, particles ---------- */
    var abyss = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1400), new THREE.MeshBasicMaterial({ color: W3.abyss }));
    abyss.rotation.x = -Math.PI / 2; abyss.position.y = -34; scene.add(abyss);
    var mountains = (function () {
      var b = new Builder("mountains"); b.aoLo = -60; b.aoHi = 60; b.aoMin = .75;
      var rr = seeded("mtn" + themeName);
      for (var i = 0; i < 34; i++) {
        var a = i / 34 * Math.PI * 2 + rr() * .1, d = 330 + rr() * 60, h = 50 + rr() * 90, w = 40 + rr() * 50;
        b.add(themeName === "sand" ? GEO.cone5 : GEO.cone7, Math.cos(a) * d, -40 + h / 2, Math.sin(a) * d, w, h, w * (.7 + rr() * .5), 0, rr() * 3, 0, mix(W3.mountain, W3.skyHor, rr() * .35), .05);
      }
      /* far temples on the horizon: stepped pyramids in the jungle and desert, spires at night, peaks of ice */
      for (var z = 0; z < 7; z++) {
        var za = z / 7 * Math.PI * 2 + .4, zd = 300 + rr() * 30, zx = Math.cos(za) * zd, zz = Math.sin(za) * zd, zc = mix(W3.mountain, W3.skyHor, .25 + rr() * .2), zs = 18 + rr() * 14;
        if (themeName === "haunted") { b.add(GEO.box, zx, -10 + zs, zz, zs * .5, zs * 2.6, zs * .5, 0, rr(), 0, zc, .03); b.add(GEO.cone4, zx, -10 + zs * 3.1, zz, zs * .45, zs * 1.2, zs * .45, 0, rr(), 0, zc, .03); }
        else if (themeName === "ice") b.add(GEO.cone5, zx, -40 + zs * 2.4, zz, zs * 1.2, zs * 5, zs * 1.2, 0, rr(), 0, mix(zc, "#ffffff", .3), .04);
        else for (var st2 = 0; st2 < 5; st2++) b.add(GEO.box, zx, -20 + st2 * zs * .45, zz, zs * (2.6 - st2 * .45), zs * .46, zs * (2.6 - st2 * .45), 0, za, 0, mix(zc, W3.skyHor, st2 * .04), .03);
      }
      var m = b.mesh(new THREE.MeshBasicMaterial({ vertexColors: true, fog: false })); m.matrixAutoUpdate = true; m.renderOrder = -8; scene.add(m); return m;
    })();
    var mistTex = canvasTex(128, 128, function (x) { var g = x.createRadialGradient(64, 64, 6, 64, 64, 63); g.addColorStop(0, "rgba(255,255,255,.9)"); g.addColorStop(1, "rgba(255,255,255,0)"); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
    var mistMat = new THREE.MeshBasicMaterial({ map: mistTex, color: W3.fog, transparent: true, opacity: themeName === "haunted" ? .55 : .42, depthWrite: false });
    var mists = [];
    (function () { var r = seeded("mist"); for (var i = 0; i < 14; i++) { var m = new THREE.Mesh(GEO.plane, mistMat); m.rotation.x = -Math.PI / 2; var s = 40 + r() * 50; m.scale.set(s, s, 1); m.userData = { ox: (r() - .5) * 200, oz: (r() - .5) * 200, y: -6 - r() * 16, v: .6 + r() * 1.2 }; m.renderOrder = 2; scene.add(m); mists.push(m); } })();
    var PCOUNT = W3.particle === "sand" ? 360 : 260;
    var pGeo = new THREE.BufferGeometry(), pArr = new Float32Array(PCOUNT * 3), pVel = new Float32Array(PCOUNT * 3);
    (function () { var r = seeded("p"); for (var i = 0; i < PCOUNT; i++) { pArr[i * 3] = (r() - .5) * 40; pArr[i * 3 + 1] = r() * 14 - 3; pArr[i * 3 + 2] = (r() - .5) * 60; pVel[i * 3] = (r() - .5); pVel[i * 3 + 1] = (r() - .5); pVel[i * 3 + 2] = (r() - .5); } })();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    var pMat = new THREE.PointsMaterial({ color: W3.pColor, size: W3.particle === "snow" ? .16 : W3.particle === "sand" ? .07 : .14, map: softTex, transparent: true, depthWrite: false,
      blending: W3.particle === "fireflies" || W3.particle === "wisps" ? THREE.AdditiveBlending : THREE.NormalBlending, opacity: W3.particle === "sand" ? .7 : .95 });
    var particles = new THREE.Points(pGeo, pMat); particles.frustumCulled = false; scene.add(particles);
    var pOrigin = new THREE.Vector3();

    /* ---------- prefab library ---------- */
    var SIDE_KITS = ["trees", "pillars", "statues", "wall", "cliff", "waterfall", "void", "obelisks"];
    /* a flame: a tall soft outer tongue, a bright core and a glow, all additive; pivot at the base */
    var flameGeo = new THREE.ConeGeometry(1, 1, 7, 1, true); flameGeo.translate(0, .5, 0);
    var flameGlowMat = new THREE.SpriteMaterial({ map: softTex, color: W3.fire, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .55, fog: false });
    /* fire sprites: a painted flame tongue (outer) and a hot core, both additive, plus a soft glow */
    var flameTex = canvasTex(64, 128, function (x, w, h) {
      var g = x.createRadialGradient(w / 2, h * .78, 2, w / 2, h * .62, h * .62); g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(.35, "rgba(255,255,255,.8)"); g.addColorStop(1, "rgba(255,255,255,0)");
      x.fillStyle = g; x.beginPath(); x.moveTo(w / 2, 2); x.bezierCurveTo(w * .78, h * .3, w * .98, h * .62, w * .8, h * .86); x.quadraticCurveTo(w / 2, h, w * .2, h * .86); x.bezierCurveTo(w * .02, h * .62, w * .22, h * .3, w / 2, 2); x.fill();
    });
    var flameOuterMat = new THREE.SpriteMaterial({ map: flameTex, color: W3.fire, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .95, fog: false });
    var flameCoreMat = new THREE.SpriteMaterial({ map: flameTex, color: W3.fireCore, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .9, fog: false });
    function addFlame(group, x, y, z, s, list) {
      var f = new THREE.Group(); f.position.set(x, y, z); f.scale.set(s, s, s);
      var outer = new THREE.Sprite(flameOuterMat); outer.scale.set(.62, 1.15, 1); outer.position.y = .5; f.add(outer);
      var core = new THREE.Sprite(flameCoreMat); core.scale.set(.32, .6, 1); core.position.y = .3; f.add(core);
      var glow = new THREE.Sprite(flameGlowMat); glow.scale.set(1.3, 1.3, 1); glow.position.y = .35; f.add(glow);
      f.userData.base = s; f.userData.ph = (x * 3.1 + z * 1.7) % 6.28; group.add(f); list.push(f); return f;
    }
    function rockAt(b, x, y, z, s, col) { b.add(GEO.dode, x, y, z, s, s * (.6 + b.rnd() * .4), s * (.8 + b.rnd() * .4), b.rnd() * 3, b.rnd() * 3, b.rnd() * 3, col || W3.rock, .14); }
    function stoneCol(b, t) { return mix(W3.stone, W3.stoneDark, t === undefined ? b.rnd() * .35 : t); }
    function floorRow(b, zc, lanes) {
      for (var l = -1; l <= 1; l++) {
        if (lanes && lanes.indexOf(l) === -1) continue;
        b.add(GEO.box, l * LANE + (b.rnd() - .5) * .03, -.26 + (b.rnd() - .5) * .025, zc + (b.rnd() - .5) * .04, LANE - .07, .5, 1.93, 0, (b.rnd() - .5) * .02, 0, mix(W3.path, W3.stoneDark, b.rnd() * .22), .05);
      }
    }
    function curbs(b, z0, len, sides) {
      for (var z = 0; z < len - .01; z += 2) {
        (sides || [-1, 1]).forEach(function (s) {
          var c = mix(W3.stone, W3.moss, b.rnd() < .35 ? .45 : .08), zc = z0 - z - 1, carved = ((z / 2) % 2) === 0;
          b.add(GEO.box, s * (HALF + .25), .08, zc, .52, .66, 1.94, 0, 0, 0, c, .07);
          b.add(GEO.box, s * (HALF + .25), .44, zc, .6, .1, 1.98, 0, 0, 0, mix(c, W3.stone, .4), .05);
          if (carved) { b.add(GEO.box, s * (HALF - .02), .1, zc, .04, .32, 1.2, 0, 0, 0, mix(W3.stone, W3.stoneDark, .45), .04); b.add(GEO.box, s * (HALF - .035), .1, zc, .03, .14, .14, 0, 0, .785, mix(W3.stone, W3.stoneDark, .15), .02); }
          else b.add(GEO.box, s * (HALF + .53), -.05, zc, .04, .36, 1.3, 0, 0, 0, mix(W3.stone, W3.stoneDark, .4), .04);
          if (b.rnd() < .45) b.add(GEO.box, s * (HALF + .5), -.1 - b.rnd() * .3, z0 - z - .5 - b.rnd(), .07, .5 + b.rnd() * .7, .5 + b.rnd() * .8, 0, 0, 0, W3.moss, .2);
        });
      }
    }
    function body(b, z0, len, w, depth) {
      b.add(GEO.box, 0, -1.6, z0 - len / 2, w || 6.0, depth || 2.2, len, 0, 0, 0, W3.stoneDark, .05);
      for (var z = 1.2; z < len; z += 2.5) [-1, 1].forEach(function (s) { b.add(GEO.box, s * ((w || 6) / 2 + .04), -1.15, z0 - z, .1, .5, .9, 0, 0, 0, mix(W3.stone, W3.stoneDark, .25), .06); });
    }
    function pier(b, z, w) { b.add(GEO.box, 0, -16.5, z, w || 3.2, 27, w || 3.2, 0, 0, 0, W3.stoneDark, .06); b.add(GEO.box, 0, -2.95, z, (w || 3.2) + 1, .5, (w || 3.2) + 1, 0, 0, 0, W3.stone, .05); }
    function terrace(b, z0, len, x1) { b.add(GEO.box, (3.0 + x1) / 2, -.26, z0 - len / 2, x1 - 3.0, .52, len, 0, 0, 0, mix(W3.path, W3.stoneDark, .3), .05); b.add(GEO.box, (3.0 + x1) / 2, -1.9, z0 - len / 2, x1 - 3.0, 2.8, len, 0, 0, 0, W3.stoneDark, .05); b.add(GEO.box, (3 + x1) / 2, -17, z0 - len / 2, 2.6, 28, 2.6, 0, 0, 0, W3.stoneDark, .05); }

    function tree(b, gb, x, z, s, kind) {
      var top = (x < 9 ? 7 : 2) + b.rnd() * 6 * s, H = top + 30, r = (.3 + .22 * s);
      if (kind === "palm") {
        var px = x, py = -30, seg = 7, tilt = (b.rnd() - .5) * .5, segH = (top + 30) / seg;
        for (var i = 0; i < seg; i++) { var t = tilt * (i / seg); b.add(GEO.cyl7, px, py + segH / 2, z, r * (1 - i * .06), segH * 1.02, r * (1 - i * .06), 0, 0, t, mix(W3.trunk, "#c9a870", i % 2 ? .25 : 0), .06); px -= Math.sin(t) * segH; py += Math.cos(t) * segH; }
        for (var f = 0; f < 7; f++) { var a = f / 7 * Math.PI * 2 + b.rnd(), tl = .35 + b.rnd() * .45, L = 3.2 * s + 1; b.add(GEO.box, px + Math.cos(tl) * Math.cos(a) * L / 2, py - Math.sin(tl) * L / 2, z - Math.cos(tl) * Math.sin(a) * L / 2, L, .06, .75, 0, a, -tl, W3.leaf[f % W3.leaf.length], .12); }
        return;
      }
      if (kind === "pine") {
        b.add(GEO.cyl5, x, (top - 30) / 2, z, r * .8, H, r * .8, 0, 0, 0, W3.trunk, .06);
        for (var k = 0; k < 4; k++) { var cy = top - 1.5 - k * 2.3 * s, cr = (1.1 + k * .75) * s; b.add(GEO.cone7, x, cy, z, cr, 2.8 * s, cr, 0, b.rnd(), 0, W3.leaf[k % W3.leaf.length], .1); b.add(GEO.cone7, x, cy + .55 * s, z, cr * .7, 1.5 * s, cr * .7, 0, b.rnd(), 0, "#f5f9fc", .04); }
        return;
      }
      b.add(GEO.cyl7, x, (top - 30) / 2, z, r, H, r, 0, b.rnd(), 0, W3.trunk, .08);
      if (kind === "dead") {
        for (var d = 0; d < 4; d++) { var ang = b.rnd() * 6.28, tl2 = .6 + b.rnd() * .6, L2 = 2 + b.rnd() * 2.5 * s; b.add(GEO.cyl5, x + Math.cos(ang) * Math.sin(tl2) * L2 / 2, top - .5 - d * .8 + Math.cos(tl2) * L2 / 2, z + Math.sin(ang) * Math.sin(tl2) * L2 / 2, r * .35, L2, r * .35, Math.sin(ang) * tl2, 0, -Math.cos(ang) * tl2, W3.trunk, .08); }
        if (gb && b.rnd() < .5) { gb.add(GEO.box, x + .9, top - 2.2, z, .28, .4, .28, 0, 0, 0, W3.glow, 0); b.add(GEO.box, x + .9, top - 1.6, z, .04, .9, .04, 0, 0, 0, "#222", 0); }
        return;
      }
      var blobs = 3 + Math.floor(b.rnd() * 3), near = x < 9;
      for (var j = 0; j < blobs; j++) { var rr = (2 + b.rnd() * 1.5) * s * (near ? .8 : 1); b.add(GEO.ico, x + (near ? b.rnd() * 2.2 : (b.rnd() - .5) * 3) * s, top + (b.rnd() - .3) * 1.6 * s, z + (b.rnd() - .5) * 3 * s, rr, rr * .72, rr, b.rnd(), b.rnd(), b.rnd(), W3.leaf[j % W3.leaf.length], .14); }
      for (var v = 0; v < 3; v++) { var vl = 2 + b.rnd() * 4; b.add(GEO.box, x + (b.rnd() - .5) * 3 * s, top - 1 - vl / 2, z + (b.rnd() - .5) * 3 * s, .07, vl, .07, 0, 0, 0, mix(W3.moss, W3.trunk, .3), .1); }
    }
    function statue(b, gb, x, z, face) {
      var c = stoneCol(b, .1), dk = mix(W3.stone, W3.stoneDark, .5), k = W3.statue;
      b.contact = 1;
      b.add(GEO.box, x, .45, z, 1.8, .9, 1.8, 0, 0, 0, dk, .05);
      b.add(GEO.box, x, 1.6, z, 1.15, 1.4, .95, 0, 0, 0, c, .08);
      b.add(GEO.box, x + face * .35, 1.05, z, .9, .5, 1.05, 0, 0, 0, c, .08);
      b.add(GEO.box, x, 2.78, z, .95, .95, .9, 0, 0, 0, c, .08);
      if (k === "monkey") { [-1, 1].forEach(function (s) { b.add(GEO.cyl7, x, 2.9, z + s * .62, .28, .12, .28, Math.PI / 2, 0, 0, c, .06); }); b.add(GEO.box, x + face * .5, 2.55, z, .2, .35, .55, 0, 0, 0, dk, .05); }
      else if (k === "gargoyle") { [-1, 1].forEach(function (s) { b.add(GEO.cone5, x, 3.5, z + s * .32, .14, .7, .14, s * .3, 0, 0, dk, .05); b.add(GEO.box, x - face * .3, 2.1, z + s * .85, .2, 1.3, .9, s * .5, 0, 0, dk, .06); }); }
      else if (k === "jackal") { [-1, 1].forEach(function (s) { b.add(GEO.cone4, x, 3.62, z + s * .28, .2, .9, .14, 0, 0, 0, c, .05); }); b.add(GEO.box, x + face * .72, 2.62, z, .7, .34, .4, 0, 0, 0, c, .05); }
      else { b.add(GEO.box, x, 3.42, z, .3, .5, 1.1, 0, 0, 0, dk, .05); b.add(GEO.cyl5, x + face * .7, 2.4, z + .6, .06, 3.6, .06, 0, 0, 0, dk, .05); }
      b.contact = 0;
      [-1, 1].forEach(function (s) { gb.add(GEO.box, x + face * .48, 2.86, z + s * .2, .05, .1, .14, 0, 0, 0, W3.eye, 0); });
    }
    function cliffWall(b, x0, x1, z0, len, topY) {
      var n = Math.ceil((x1 - x0) / 3) * Math.ceil(len / 4);
      for (var i = 0; i < n; i++) { var s = 2.6 + b.rnd() * 2.8; rockAt(b, x0 + b.rnd() * (x1 - x0), -30 + b.rnd() * (topY + 30), z0 - b.rnd() * len, s, mix(W3.rock, W3.stoneDark, b.rnd() * .5)); }
      for (var j = 0; j < 4; j++) rockAt(b, x0 + 1 + b.rnd() * (x1 - x0 - 1), topY - 1 + b.rnd() * 2, z0 - b.rnd() * len, 3 + b.rnd() * 2, mix(W3.rock, W3.stone, .3));
      for (var t = 0; t < 5; t++) { var tr = 1 + b.rnd() * 1.6; b.add(GEO.ico, x0 + b.rnd() * (x1 - x0), topY + 1.5 + b.rnd(), z0 - b.rnd() * len, tr, tr * .6, tr, 0, b.rnd(), 0, W3.leaf[t % 4], .15); }
    }
    /* one side of the path (built for the right side, mirrored for the left) */
    function buildSide(kit, v, side) {
      var b = new Builder(kit + v + side + themeName), gb = new Builder("g" + kit + v + side); b.mirror = gb.mirror = side < 0;
      var g = new THREE.Group(), flames = [], water = null, len = 10, i;
      var trees = W3.trees;
      switch (kit) {
        case "trees":
          var tz = -2 - b.rnd() * 6;
          tree(b, gb, 5.6 + b.rnd(), tz, .9 + b.rnd() * .4, trees);
          if (trees !== "pine" && trees !== "palm") for (i = 0; i < 3; i++) b.add(GEO.arch, 4.3, .02, tz + (i - 1) * .9, 1.5 + i * .3, .38, .75, 0, (i - 1) * .35, 0, mix(W3.trunk, "#1a1208", .35), .1);
          tree(b, gb, 9 + b.rnd() * 4, -1 - b.rnd() * 8, 1.1 + b.rnd() * .5, trees);
          if (v) tree(b, gb, 15 + b.rnd() * 5, -b.rnd() * 10, 1.5, trees);
          tree(b, gb, 22 + b.rnd() * 6, -b.rnd() * 10, 1.9, trees);
          break;
        case "void":
          tree(b, gb, 17 + b.rnd() * 5, -2 - b.rnd() * 6, 1.6, trees);
          if (v) { for (i = 0; i < 4; i++) b.add(GEO.box, 26, -20 + i * 6, -5, 7 - i * 1.4, 6, 7 - i * 1.4, 0, .3, 0, stoneCol(b, .3 + i * .05), .05); b.add(GEO.cone4, 26, 6, -5, 2.2, 3, 2.2, 0, .3 + .785, 0, W3.stone, .05); }
          else tree(b, gb, 27, -6, 2.2, trees);
          break;
        case "pillars":
          terrace(b, 0, len, 6.4);
          b.contact = 1;
          for (i = 0; i < 2; i++) { var pz = -2.5 - i * 5, ph = (v ? 2.2 : 3.2) + b.rnd() * 2; b.add(GEO.box, 4.4, .3, pz, 1.3, .6, 1.3, 0, 0, 0, stoneCol(b), .05); b.add(GEO.cyl10, 4.4, .6 + ph / 2, pz, .5, ph, .5, 0, 0, 0, stoneCol(b, .1), .06); if (b.rnd() < .5) b.add(GEO.box, 4.4, .7 + ph, pz, 1.25, .4, 1.25, 0, 0, 0, stoneCol(b), .05); else b.add(GEO.box, 4.5, .75 + ph, pz, .9, .5, .7, .3, .4, .5, stoneCol(b), .05); b.add(GEO.box, 4.4, .6 + ph * .6, pz, .55, .25, .55, 0, 0, 0, W3.moss, .2); }
          b.add(GEO.cyl10, 5.6, .45, -5, .45, 2.6, .45, Math.PI / 2, .3, 0, stoneCol(b), .06);
          rockAt(b, 5.2, .2, -8.6, .5); rockAt(b, 3.6, .15, -6.2, .35);
          b.contact = 0;
          tree(b, gb, 12 + b.rnd() * 4, -5, 1.3, trees);
          break;
        case "statues":
          terrace(b, 0, len, 6.6);
          statue(b, gb, 4.8, -5, -1);
          b.contact = 1; rockAt(b, 5.4, .2, -1.4, .45); b.contact = 0;
          tree(b, gb, 12 + b.rnd() * 5, -3 - b.rnd() * 4, 1.4, trees);
          break;
        case "wall":
          terrace(b, 0, len, 4.4);
          var wh = v ? 7.2 : 5.4;
          b.add(GEO.box, 3.75, wh / 2, -5, .7, wh, 10, 0, 0, 0, stoneCol(b, .15), .05);
          for (i = 0; i < 3; i++) { var cz = -1.7 - i * 3.3; b.add(GEO.box, 3.38, wh * .5, cz, .06, wh * .6, 2.4, 0, 0, 0, mix(W3.stone, W3.stoneDark, .45), .05); b.add(GEO.box, 3.34, wh * .55, cz, .06, .5, .5, 0, 0, .785, mix(W3.stone, W3.stoneDark, .2), .04); b.add(GEO.box, 3.34, wh * .32, cz, .06, .16, 1.6, 0, 0, 0, mix(W3.stone, W3.stoneDark, .2), .04); }
          b.add(GEO.box, 3.7, wh + .15, -5, 1.0, .3, 10, 0, 0, 0, stoneCol(b, 0), .05);
          for (i = 0; i < 6; i++) { var ml = .5 + b.rnd() * 1.6; b.add(GEO.box, 3.36, wh - ml / 2, -.5 - b.rnd() * 9, .08, ml, .4 + b.rnd() * .6, 0, 0, 0, W3.moss, .2); }
          tree(b, gb, 7 + b.rnd() * 2, -3 - b.rnd() * 5, 1.1, trees);
          tree(b, gb, 14 + b.rnd() * 6, -b.rnd() * 9, 1.6, trees);
          break;
        case "cliff":
          cliffWall(b, 5, 17, 0, len, v ? 22 : 14);
          break;
        case "waterfall":
          cliffWall(b, 8.5, 19, 0, len, 20);
          water = new THREE.Mesh(GEO.plane, matWater); water.scale.set(3.4, 54, 1); water.position.set(side * 7.6, -7, -5); water.rotation.y = side > 0 ? -Math.PI / 2 : Math.PI / 2; water.renderOrder = 3; g.add(water);
          for (i = 0; i < 4; i++) b.add(GEO.ico, 7.8, 19.6, -3.6 - i * .9, .7, .35, .7, 0, b.rnd(), 0, "#ffffff", .05);
          tree(b, gb, 5, -1, .8, trees);
          break;
        case "obelisks":
          terrace(b, 0, len, 6.2);
          b.contact = 1;
          b.add(GEO.box, 4.6, .4, -5, 1.4, .8, 1.4, 0, 0, 0, stoneCol(b, .3), .05);
          b.add(GEO.box, 4.6, 3.6, -5, .8, 5.6, .8, 0, 0, 0, stoneCol(b, .05), .06);
          b.add(GEO.cone4, 4.6, 6.9, -5, .62, 1, .62, 0, .785, 0, W3.glow, .02);
          [-1.6, -8.4].forEach(function (bz) { b.add(GEO.cyl7, 3.9, .5, bz, .18, 1.0, .18, 0, 0, 0, W3.stoneDark, .04); b.add(GEO.cyl7, 3.9, 1.1, bz, .48, .3, .48, 0, 0, 0, W3.stoneDark, .04); addFlame(g, side * 3.9, 1.2, bz, .9, flames); });
          b.contact = 0;
          tree(b, gb, 12, -6, 1.3, trees);
          break;
      }
      if (!b.empty()) g.add(b.mesh());
      if (!gb.empty()) g.add(gb.mesh(matGlow));
      g.userData.flames = flames; g.userData.water = water;
      return g;
    }
    /* path pieces; each returns a group, its length and its hazards */
    function buildPiece(name) {
      var b = new Builder(name + themeName), gb = new Builder("g" + name), g = new THREE.Group(), flames = [], i;
      var mir = /L$/.test(name); b.mirror = gb.mirror = mir;
      var base = name.replace(/[LR]$/, "").replace(/\d$/, "");
      switch (base) {
        case "straight":
          for (i = 0; i < 5; i++) floorRow(b, -1 - i * 2);
          body(b, 0, 10); curbs(b, 0, 10); pier(b, -5);
          break;
        case "trial":
          for (i = 0; i < 5; i++) floorRow(b, -1 - i * 2);
          body(b, 0, 10); curbs(b, 0, 10); pier(b, -5);
          [-1, 1].forEach(function (s) { b.add(GEO.cyl7, s * 3.0, .75, -5, .14, 1.1, .14, 0, 0, 0, W3.stoneDark, .04); b.add(GEO.cyl7, s * 3.0, 1.38, -5, .34, .22, .34, 0, 0, 0, W3.stoneDark, .04); addFlame(g, s * (mir ? -3 : 3), 1.45, -5, .7, flames); });
          break;
        case "gap":
          [-1, -3, -9].forEach(function (z) { floorRow(b, z); });
          b.add(GEO.box, 0, -1.6, -2, 6, 2.2, 4, 0, 0, 0, W3.stoneDark, .05); b.add(GEO.box, 0, -1.6, -9, 6, 2.2, 2, 0, 0, 0, W3.stoneDark, .05);
          curbs(b, 0, 4); curbs(b, -8, 2); pier(b, -2.2);
          for (i = 0; i < 6; i++) rockAt(b, (b.rnd() - .5) * 5, -.4 - b.rnd() * .6, i < 3 ? -4.1 : -7.9, .35 + b.rnd() * .3, W3.stoneDark);
          break;
        case "bridge":
          for (i = 0; i < 5; i++) floorRow(b, -1 - i * 2);
          b.add(GEO.box, 0, -.95, -5, 5.9, .9, 10, 0, 0, 0, W3.stoneDark, .05);
          b.add(GEO.arch, 0, -6.2, -5, 5.2, 5.2, 16, 0, Math.PI / 2, 0, W3.stoneDark, .05);
          for (i = 0; i <= 5; i++) [-1, 1].forEach(function (s) { b.add(GEO.box, s * 2.95, .45, -i * 2, .32, .9, .32, 0, 0, 0, stoneCol(b), .05); });
          [-1, 1].forEach(function (s) { b.add(GEO.box, s * 2.95, .95, -5, .26, .14, 10, 0, 0, 0, stoneCol(b, .05), .04); b.add(GEO.box, s * 2.95, .02, -5, .3, .1, 10, 0, 0, 0, stoneCol(b, .3), .04); });
          break;
        case "rope":
          for (i = 0; i < 15; i++) b.add(GEO.box, (b.rnd() - .5) * .1, -.08, -.35 - i * .66, 5.4 - b.rnd() * .3, .12, .52, 0, (b.rnd() - .5) * .05, 0, mix(W3.trunk, "#b58a55", .3 + b.rnd() * .4), .1);
          [-1, 1].forEach(function (s) { b.add(GEO.cyl5, s * 2.75, -.16, -5, .05, 10, .05, Math.PI / 2, 0, 0, "#6b5a40", 0); b.add(GEO.cyl5, s * 2.95, 1.0, -5, .05, 10, .05, Math.PI / 2, 0, 0, "#7a6648", 0); for (var q = 0; q < 5; q++) b.add(GEO.cyl5, s * 2.85, .42, -1 - q * 2, .025, 1.1, .025, 0, 0, s * .1, "#6b5a40", 0); });
          [-1, 1].forEach(function (s) { b.add(GEO.cyl7, s * 2.95, .5, -.1, .13, 1.3, .13, 0, 0, 0, W3.trunk, .06); });
          break;
        case "ledge":
          floorRow(b, -1); floorRow(b, -9); [-3, -5, -7].forEach(function (z) { floorRow(b, z, [-1]); });
          b.add(GEO.box, 0, -1.6, -1, 6, 2.2, 2, 0, 0, 0, W3.stoneDark, .05); b.add(GEO.box, 0, -1.6, -9, 6, 2.2, 2, 0, 0, 0, W3.stoneDark, .05); b.add(GEO.box, -1.7, -1.6, -5, 2.4, 2.2, 6, 0, 0, 0, W3.stoneDark, .05);
          curbs(b, 0, 2); curbs(b, -8, 2); curbs(b, -2, 6, [-1]);
          for (i = 0; i < 5; i++) rockAt(b, -.6 + b.rnd() * .5, -.35 - b.rnd() * .5, -2.3 - b.rnd() * 5.4, .3 + b.rnd() * .3, W3.stoneDark);
          cliffWall(b, -16, -3.6, 0, 10, 16);
          pier(b, -1); pier(b, -9);
          break;
        case "corner":
          for (var cx = -1; cx <= 1; cx++) for (var cz = 0; cz < 3; cz++) b.add(GEO.box, cx * 2, -.26 + (b.rnd() - .5) * .02, -1 - cz * 2, 1.94, .5, 1.94, 0, 0, 0, mix(W3.path, W3.stoneDark, b.rnd() * .22), .05);
          b.add(GEO.box, 0, -1.6, -3, 6.4, 2.2, 6.4, 0, 0, 0, W3.stoneDark, .05); pier(b, -3, 3.6);
          b.add(GEO.box, 0, 2.2, -6.5, 7.2, 5, .9, 0, 0, 0, stoneCol(b, .12), .05);
          b.add(GEO.box, -3.45, 2.2, -2.7, .9, 5, 6.6, 0, 0, 0, stoneCol(b, .12), .05);
          b.add(GEO.box, 0, 4.9, -6.4, 7.6, .5, 1.3, 0, 0, 0, stoneCol(b, 0), .04);
          b.add(GEO.box, 0, 2.7, -6.0, 3.0, 3.0, .2, 0, 0, 0, mix(W3.stone, W3.stoneDark, .35), .04);
          b.add(GEO.box, 0, 2.2, -5.85, .5, 1.0, .25, 0, 0, 0, mix(W3.stone, W3.stoneDark, .15), .04);
          b.add(GEO.box, 0, 1.55, -5.85, 1.5, .25, .2, 0, 0, 0, mix(W3.stone, W3.stoneDark, .6), .04);
          [-1, 1].forEach(function (s) { gb.add(GEO.box, s * .7, 3.25, -5.86, .5, .26, .1, 0, 0, 0, W3.eye, 0); });
          for (i = 0; i < 7; i++) { var ml2 = .4 + b.rnd() * 1.4; b.add(GEO.box, (b.rnd() - .5) * 6.4, 4.6 - ml2 / 2, -6.02, .4 + b.rnd() * .5, ml2, .06, 0, 0, 0, W3.moss, .2); }
          [-2.6, 2.6].forEach(function (fx) { addFlame(g, fx, 5.2, -6.4, .8, flames); });
          break;
        case "site":
        case "siteChasm":
          var chasm = base === "siteChasm";
          for (i = 0; i < 16; i++) { var zc = -1 - i * 2; if (chasm && zc < -20 && zc > -28) continue; for (var l = -2; l <= 2; l++) b.add(GEO.box, l * 1.62, -.26 + (b.rnd() - .5) * .02, zc, 1.56, .5, 1.93, 0, 0, 0, mix(W3.path, W3.stoneDark, b.rnd() * .22 + (Math.abs(l) === 2 ? .15 : 0)), .05); }
          b.add(GEO.box, 0, -1.6, chasm ? -10 : -16, 8.4, 2.2, chasm ? 20 : 32, 0, 0, 0, W3.stoneDark, .05);
          if (chasm) { b.add(GEO.box, 0, -1.6, -30, 8.4, 2.2, 4, 0, 0, 0, W3.stoneDark, .05); for (i = 0; i < 8; i++) rockAt(b, (b.rnd() - .5) * 7, -.5 - b.rnd(), i < 4 ? -20.2 : -27.8, .4 + b.rnd() * .4, W3.stoneDark); }
          pier(b, -6, 4); if (!chasm) pier(b, -22, 4); else pier(b, -30, 4);
          for (i = 0; i < 16; i++) [-1, 1].forEach(function (s) { if (chasm && i >= 10 && i < 14) return; b.add(GEO.box, s * 4.35, .05, -1 - i * 2, .5, .6, 1.94, 0, 0, 0, mix(W3.stone, W3.moss, b.rnd() < .3 ? .4 : .05), .06); });
          [-1, 1].forEach(function (s) {
            b.contact = 1;
            b.add(GEO.box, s * 3.7, .5, -12, 1.2, 1, 1.2, 0, 0, 0, W3.stoneDark, .04); b.add(GEO.cyl7, s * 3.7, 1.6, -12, .2, 1.4, .2, 0, 0, 0, W3.stoneDark, .04); b.add(GEO.cyl7, s * 3.7, 2.35, -12, .6, .3, .6, 0, 0, 0, W3.stoneDark, .04);
            b.contact = 0;
            addFlame(g, s * 3.7, 2.45, -12, 1.1, flames);
            b.add(GEO.box, s * 3.9, 2.6, chasm ? -19 : -26, .9, 5.2, .9, 0, 0, 0, stoneCol(b, .1), .05);
          });
          gb.add(GEO.box, 0, .02, -18, 7.6, .04, .16, 0, 0, 0, W3.glow, 0);
          for (i = 0; i < 9; i++) gb.add(GEO.box, -3.6 + i * .9, .02, -17.6, .22, .04, .22, 0, .785, 0, W3.glow, 0);
          break;
        case "start":
          for (i = 0; i < 6; i++) floorRow(b, -1 - i * 2);
          body(b, 0, 12); curbs(b, 0, 12); pier(b, -6);
          b.add(GEO.box, 0, 3.2, 1.2, 9, 6.4, 1.2, 0, 0, 0, stoneCol(b, .3), .04);
          b.add(GEO.box, 0, 2.0, .55, 3.4, 4, .1, 0, 0, 0, "#120d08", 0);
          b.add(GEO.box, 0, 6.7, 1.2, 10, .7, 1.8, 0, 0, 0, stoneCol(b, 0), .04);
          [-1, 1].forEach(function (s) { statue(b, gb, s * 3.8, .2, -s); });
          break;
        case "sprint":
          for (i = 0; i < 5; i++) floorRow(b, -1 - i * 2);
          body(b, 0, 10); pier(b, -5);
          [-1, 1].forEach(function (s) { b.add(GEO.box, s * 3.3, 2.6, -5, .8, 5.6, 10, 0, 0, 0, stoneCol(b, .25), .05); for (var q = 0; q < 2; q++) b.add(GEO.box, s * 2.88, 2.6, -2.5 - q * 5, .1, 3.6, 1.6, 0, 0, 0, mix(W3.stone, W3.stoneDark, .5), .04); addFlame(g, s * 2.75, 2.2, -2.5, .55, flames); });
          b.add(GEO.box, 0, 5.6, -1, 7.4, .5, .9, 0, 0, 0, stoneCol(b, .1), .05); b.add(GEO.box, 0, 5.6, -6, 7.4, .5, .9, 0, 0, 0, stoneCol(b, .1), .05);
          break;
        case "exit":
          for (i = 0; i < 15; i++) floorRow(b, -1 - i * 2);
          body(b, 0, 30); curbs(b, 0, 30); pier(b, -8); pier(b, -24);
          [-1, 1].forEach(function (s) { b.add(GEO.box, s * 4.2, 4.5, -12, 1.6, 9, 1.6, 0, 0, 0, stoneCol(b, .1), .05); });
          b.add(GEO.box, 0, 9.4, -12, 10.4, 1.2, 1.9, 0, 0, 0, stoneCol(b, 0), .05);
          var lightPlane = new THREE.Mesh(GEO.plane, new THREE.MeshBasicMaterial({ color: "#fff6d8", transparent: true, opacity: .92, fog: false, depthWrite: false })); lightPlane.scale.set(6.8, 8.8, 1); lightPlane.position.set(0, 4.4, -12.3); g.add(lightPlane);
          var halo = new THREE.Sprite(glowSpriteMat); halo.scale.set(26, 20, 1); halo.position.set(0, 4.6, -12.6); g.add(halo);
          break;
        case "canopy":
          [-1, 1].forEach(function (sd) { b.add(GEO.cyl7, sd * 3.2, 7.4, -5 + sd * 2, .28, 8.5, .28, 0, 0, sd * (Math.PI / 2 - .25), W3.trunk, .08); });
          for (i = 0; i < 9; i++) { var cr = 1.4 + b.rnd() * 1.4; b.add(GEO.ico, (b.rnd() - .5) * 9, 8 + b.rnd() * 1.5, -b.rnd() * 10, cr, cr * .55, cr, b.rnd(), b.rnd(), 0, W3.leaf[i % 4], .14); }
          for (i = 0; i < 10; i++) { var vl2 = 1.5 + b.rnd() * 2; var vx2 = (b.rnd() - .5) * 8; if (Math.abs(vx2) < 2.2 && vl2 > 2.4) vl2 = 2.4; b.add(GEO.box, vx2, 7.6 - vl2 / 2, -b.rnd() * 10, .06, vl2, .06, 0, 0, 0, mix(W3.moss, W3.trunk, .25), .1); if (b.rnd() < .6) b.add(GEO.ico, vx2, 7.6 - vl2, 0 - b.rnd() * 10, .16, .22, .16, 0, 0, 0, W3.leaf[1], .1); }
          break;
        case "arch":
          [-1, 1].forEach(function (s) { b.add(GEO.box, s * 3.45, 2.6, -5, .9, 5.2, .9, 0, 0, 0, stoneCol(b, .12), .05); });
          b.add(GEO.box, 0, 5.5, -5, 8, .9, 1.3, 0, 0, 0, stoneCol(b, .05), .05);
          for (i = 0; i < 5; i++) b.add(GEO.box, -2.4 + i * 1.2, 5.5, -4.33, .5, .5, .06, 0, 0, .785, mix(W3.stone, W3.stoneDark, .4), .04);
          for (i = 0; i < 4; i++) { var vl = 1 + b.rnd() * 2; b.add(GEO.box, -3 + b.rnd() * 6, 5 - vl / 2, -4.4 - b.rnd() * 1.2, .07, vl, .07, 0, 0, 0, W3.moss, .2); }
          break;
        case "hz:root":
          b.contact = 1;
          b.add(GEO.arch, 0, -.05, 0, 3.1, .62, 3.4, 0, 0, 0, mix(W3.trunk, W3.moss, .2), .12);
          b.add(GEO.arch, .5, -.08, .45, 1.6, .38, 2.2, 0, .5, 0, W3.trunk, .12);
          b.add(GEO.arch, -1.2, -.08, -.4, 1.2, .3, 1.8, 0, -.4, 0, W3.trunk, .12);
          b.add(GEO.cyl7, 3.3, -.4, 0, .5, 2, .5, 0, 0, .9, W3.trunk, .1); b.add(GEO.cyl7, -3.3, -.4, 0, .5, 2, .5, 0, 0, -.9, W3.trunk, .1);
          break;
        case "hz:trunk":
          b.contact = 1;
          b.add(GEO.cyl10, 0, .42, 0, .44, 7.2, .44, 0, 0, Math.PI / 2, W3.trunk, .1);
          b.add(GEO.cyl10, 0, .42, 0, .3, 7.24, .3, 0, 0, Math.PI / 2, mix(W3.trunk, "#e0c090", .4), .05);
          for (i = 0; i < 3; i++) b.add(GEO.cyl5, -2 + i * 2, .8, -.1, .09, .8, .09, .5, 0, .4, W3.trunk, .08);
          for (i = 0; i < 4; i++) b.add(GEO.box, -2.6 + i * 1.7, .86, 0, .9, .06, .5, 0, 0, 0, W3.moss, .2);
          break;
        case "hz:fire":
          [-1, 1].forEach(function (s) { b.add(GEO.box, s * 3.25, 1.7, 0, .7, 3.4, .7, 0, 0, 0, stoneCol(b, .1), .05); b.add(GEO.box, s * 2.86, 1.5, 0, .2, .5, .5, 0, 0, 0, W3.stoneDark, .04); gb.add(GEO.box, s * 2.8, 1.5, 0, .1, .26, .3, 0, 0, 0, W3.fire, 0); });
          b.add(GEO.box, 0, 3.55, 0, 7.4, .6, .9, 0, 0, 0, stoneCol(b, 0), .05);
          b.add(GEO.box, 0, 1.45, 0, 5.4, .12, .12, 0, 0, 0, "#2a1a10", .05);
          for (i = 0; i < 8; i++) addFlame(g, -2.45 + i * .7, 1.42, 0, .75, flames);
          break;
        case "hz:branch":
          b.add(GEO.cyl7, 3.9, -12, 0, .55, 30, .55, 0, 0, 0, W3.trunk, .08);
          b.add(GEO.cyl7, .4, 1.5, 0, .26, 7.4, .26, 0, 0, Math.PI / 2 + .04, W3.trunk, .08);
          for (i = 0; i < 6; i++) { var rr2 = .5 + b.rnd() * .5; b.add(GEO.ico, -2.6 + i * 1.1, 1.75 + b.rnd() * .3, (b.rnd() - .5) * .5, rr2, rr2 * .6, rr2, 0, b.rnd(), 0, W3.leaf[i % 4], .14); }
          for (i = 0; i < 4; i++) b.add(GEO.box, -2 + i * 1.3, 1.1, (b.rnd() - .5) * .3, .05, .7, .05, 0, 0, 0, W3.moss, .1);
          break;
        case "hz:rubble":
          b.contact = 1;
          b.add(GEO.cyl10, 0, .48, 0, .5, 1.5, .5, 0, 0, Math.PI / 2, stoneCol(b), .06);
          b.add(GEO.box, .1, .4, -.5, 1.2, .8, .7, 0, .4, .1, stoneCol(b), .07);
          rockAt(b, -.45, .28, .45, .42, stoneCol(b)); rockAt(b, .5, .35, .3, .38, stoneCol(b)); rockAt(b, 0, .95, -.2, .3, stoneCol(b));
          break;
        case "hz:flames":
          b.add(GEO.box, 0, .02, 0, 1.5, .06, 1.6, 0, 0, 0, "#1a120c", 0);
          for (i = 0; i < 3; i++) b.add(GEO.box, -.5 + i * .5, .05, 0, .08, .04, 1.4, 0, 0, 0, W3.stoneDark, 0);
          gb.add(GEO.box, 0, .04, 0, 1.2, .02, 1.3, 0, 0, 0, W3.fire, 0);
          addFlame(g, 0, .05, 0, 2.2, flames); addFlame(g, -.35, .05, .3, 1.6, flames); addFlame(g, .35, .05, -.3, 1.7, flames);
          break;
      }
      if (!b.empty()) g.add(b.mesh());
      if (!gb.empty()) g.add(gb.mesh(matGlow));
      g.userData.flames = flames;
      return g;
    }

    /* object pools: prefabs are built once and recycled, never rebuilt in the frame loop */
    var POOL = {};
    function take(name) {
      var list = POOL[name] || (POOL[name] = []), o = list.pop();
      if (!o) {
        var m = /^side:([a-z]+):(\d):(-?1)$/.exec(name);
        o = m ? buildSide(m[1], +m[2], +m[3]) : buildPiece(name);
        o.userData.pool = name; scene.add(o);
      }
      o.visible = true; return o;
    }
    function give(o) { if (!o) return; o.visible = false; (POOL[o.userData.pool] || (POOL[o.userData.pool] = [])).push(o); }
    /* warm the pools with the pieces every run needs, so the first minutes never stall */
    function prewarm() {
      var used = {}; STRETCHES.forEach(function (s) { used[s.scenery] = 1; });
      var names = ["straight0", "straight1", "straight2", "trial", "gap", "cornerR", "cornerL", "site", "siteChasm", "start", "hz:root", "hz:trunk", "hz:fire", "hz:branch", "hz:rubble", "hz:flames"];
      Object.keys(used).forEach(function (sc) { KITS[sc].forEach(function (k) { [0, 1].forEach(function (v) { [-1, 1].forEach(function (sd) { names.push("side:" + k[0] + ":" + v + ":" + sd); }); }); }); });
      if (used.bridges || used.waterfall) names.push("bridge", "rope");
      if (used.cliffs) names.push("ledgeR", "ledgeL");
      if (used.tunnel) names.push("arch");
      if (used.canopy || used.causeway || used.waterfall) names.push("canopy");
      names.forEach(function (nm) { give(take(nm)); });
    }

    /* ======================================================================
       The path: a list of straight legs joined by 90-degree corners.
       Heading 0 runs toward -Z, 1 toward +X, 3 toward -X; 2 is never used,
       so the path is a staircase that can never cross itself.
       ====================================================================== */
    var DIRX = [0, 1, 0, -1], DIRZ = [-1, 0, 1, 0];
    var legs = [], corners = [], tiles = [], hazards = [], sites = {};
    var gen = null;
    function legAt(d) { for (var i = legs.length - 1; i > 0; i--) if (d >= legs[i].d0) return legs[i]; return legs[0]; }
    function pathPos(d, lat, out) {
      var L = legAt(d), s = d - L.d0, dx = DIRX[L.h], dz = DIRZ[L.h];
      out.x = L.x0 + dx * s - dz * lat; out.z = L.z0 + dz * s + dx * lat; return L;
    }
    function headingYaw(h) { return -h * Math.PI / 2; }
    function place(o, x, z, h, y) { o.position.set(x, y || 0, z); o.rotation.set(0, headingYaw(h), 0); }
    function localToWorld(t, lx, lz, out) { /* t: {x, z, h} tile origin */ var dx = DIRX[t.h], dz = DIRZ[t.h]; out.x = t.x + dx * (-lz) - dz * lx; out.z = t.z + dz * (-lz) + dx * lx; return out; }

    /* coins: one instanced mesh, recycled slots */
    var COIN_CAP = 220;
    var coinMat = new THREE.MeshPhongMaterial({ color: "#ffc02a", emissive: "#4a2a00", specular: "#fff4c0", shininess: 70 });
    var coinGeo = new THREE.CylinderGeometry(.3, .3, .07, 14); coinGeo.rotateX(Math.PI / 2);
    var coinMesh = new THREE.InstancedMesh(coinGeo, coinMat, COIN_CAP); coinMesh.frustumCulled = false; scene.add(coinMesh);
    var coins = [], coinFree = [], _cm = new THREE.Matrix4(), _cq = new THREE.Quaternion(), _cs = new THREE.Vector3(1, 1, 1), _cp = new THREE.Vector3(), _zero = new THREE.Matrix4().makeScale(0, 0, 0), _yAxis = new THREE.Vector3(0, 1, 0);
    for (var ci = 0; ci < COIN_CAP; ci++) { coinFree.push(ci); coinMesh.setMatrixAt(ci, _zero); }
    function addCoin(d, lat, y) {
      if (!coinFree.length) return null; var idx = coinFree.pop(), p = {};
      pathPos(d, lat, p); var c = { d: d, lat: lat, y: y, x: p.x, z: p.z, idx: idx, alive: true }; coins.push(c); return c;
    }
    function freeCoin(c) { if (c.idx < 0) return; coinMesh.setMatrixAt(c.idx, _zero); coinFree.push(c.idx); c.idx = -1; c.alive = false; }

    function newGen(k, fresh) {
      gen = { x: 0, z: 0, h: 0, d: 0, k: k, phase: fresh ? "start" : "run", runLeft: RUN_LEN, sinceCorner: 0, sinceHazard: 3, inStretch: 0, trialLeft: 0, rnd: seeded(data.title + "|" + k), done: false };
      legs = [{ d0: 0, x0: 0, z0: 0, h: 0 }]; corners = []; hazards = []; sites = {};
    }
    function clearWorld() {
      tiles.forEach(function (t) { t.parts.forEach(give); t.coins.forEach(freeCoin); });
      tiles = []; coins = []; trialProps.forEach(releaseProp); trialProps = [];
      Object.keys(liveEnc).forEach(function (k) { liveEnc[k].g.visible = false; encPool[liveEnc[k].style].push(liveEnc[k]); delete liveEnc[k]; });
    }
    function trialRows(st) {
      var a = st.data.activity; if (!st.track) return 0;
      switch (st.type) { case "lanes": case "gates": return 1; case "torches": case "levers": case "tiles": return a.items.length; case "planks": return a.planks.length; case "harvest": return Math.ceil(a.items.length / 2); case "collect": return a.items.length; }
      return 0;
    }
    var ROW_GAP = { lanes: 0, gates: 0, torches: 9, planks: 8, harvest: 10, levers: 10, tiles: 11, collect: 6.5 };
    function trialLength(st) { return Math.ceil((22 + trialRows(st) * (ROW_GAP[st.type] || 8) + 8) / 10) * 10; }

    function newTile(kind, len, pinned) {
      var t = { kind: kind, d0: gen.d, d1: gen.d + len, x: gen.x, z: gen.z, h: gen.h, parts: [], coins: [], k: gen.k, pinned: !!pinned };
      tiles.push(t); return t;
    }
    function advance(len) { gen.x += DIRX[gen.h] * len; gen.z += DIRZ[gen.h] * len; gen.d += len; }
    function addPart(t, name, lx, lz) {
      var o = take(name), w = localToWorld(t, lx || 0, lz || 0, {}); place(o, w.x, w.z, t.h); t.parts.push(o); return o;
    }
    function sides(t, st) {
      [-1, 1].forEach(function (sd) { var kit = pickW(KITS[st.scenery], gen.rnd); addPart(t, "side:" + kit + ":" + (gen.rnd() < .5 ? 0 : 1) + ":" + sd); });
      if (st.scenery === "tunnel") addPart(t, "arch");
      else if (W3.trees !== "dead" && (st.scenery === "canopy" || ((st.scenery === "causeway" || st.scenery === "waterfall") && gen.rnd() < .4))) addPart(t, "canopy");
    }
    function emitStraight(st, allowHazard) {
      var r = gen.rnd, sc = st.scenery, piece = "straight" + Math.floor(r() * 3), hz = null;
      var special = null;
      if (allowHazard && gen.inStretch > 1 && gen.sinceCorner > 0) {
        if (sc === "bridges" && r() < .45) special = r() < .55 ? "bridge" : "rope";
        else if (sc === "waterfall" && r() < .15) special = "bridge";
        else if (sc === "cliffs" && r() < .2 && gen.sinceHazard > 0 && st.hazards !== "none") special = r() < .5 ? "ledgeR" : "ledgeL";
      }
      if (special) piece = special;
      else if (allowHazard && gen.inStretch > 1 && gen.sinceCorner > 0 && gen.sinceHazard > 0 && r() < HAZARD_P[st.hazards]) { hz = pickObj(HAZARD_W[sc], r); if (hz === "gap") piece = "gap"; }
      var t = newTile(piece, 10);
      addPart(t, piece);
      if (piece === "straight0" || piece === "straight1" || piece === "straight2" || piece === "gap") sides(t, st);
      else if (piece === "bridge" || piece === "rope") { if (r() < .5) addPart(t, "side:void:" + (r() < .5 ? 0 : 1) + ":" + (r() < .5 ? 1 : -1)); }
      else if (piece === "ledgeR") addPart(t, "side:" + pickW([["trees", 1], ["void", 2]], r) + ":0:1");
      else if (piece === "ledgeL") addPart(t, "side:" + pickW([["trees", 1], ["void", 2]], r) + ":0:-1");
      var mid = t.d0 + 5, blocked = [];
      if (piece === "ledgeR" || piece === "ledgeL") { var free = piece === "ledgeR" ? -1 : 1; blocked = [-1, 0, 1].filter(function (l) { return l !== free; }); hazards.push({ d: t.d0 + 2, end: t.d0 + 8.2, kind: "block", lanes: blocked, label: "the ledge", done: false }); gen.sinceHazard = 0; }
      else if (hz === "gap") { hazards.push({ d: t.d0 + 6, end: t.d0 + 6, kind: "gap", done: false, label: "the gap" }); gen.sinceHazard = 0; }
      else if (hz === "root" || hz === "trunk") { addPart(t, "hz:" + hz, 0, -5); hazards.push({ d: mid, end: mid, kind: "jump", done: false, label: hz === "root" ? "the root" : "the log" }); gen.sinceHazard = 0; }
      else if (hz === "fire") { addPart(t, "hz:fire", 0, -5); hazards.push({ d: mid, end: mid, kind: "slide", done: false, label: "the fire" }); gen.sinceHazard = 0; }
      else if (hz === "branch") { addPart(t, r() < .5 ? "hz:branch" : "hz:branchL", 0, -5); hazards.push({ d: mid, end: mid, kind: "slide", done: false, label: "the branch" }); gen.sinceHazard = 0; }
      else if (hz === "rubble" || hz === "flames") {
        var n = r() < .45 ? 2 : 1, lanes = [-1, 0, 1]; while (blocked.length < n) { var l = lanes.splice(Math.floor(r() * lanes.length), 1)[0]; blocked.push(l); }
        blocked.forEach(function (l) { addPart(t, "hz:" + hz, l * LANE, -5); });
        hazards.push({ d: mid - .7, end: mid + .7, kind: "block", lanes: blocked, label: hz === "rubble" ? "the rubble" : "the flames", done: false }); gen.sinceHazard = 0;
      } else gen.sinceHazard++;
      /* coins */
      if (st.hazards !== "none" || r() < .6) {
        if (hz === "root" || hz === "trunk" || hz === "gap") { for (var a = 0; a < 6; a++) { var dd = (hz === "gap" ? t.d0 + 6 : mid) - 3 + a * 1.2, arc = 1 - Math.pow((dd - (hz === "gap" ? t.d0 + 6 : mid)) / 3.2, 2); t.coins.push(addCoin(dd, 0, .8 + Math.max(0, arc) * 1.1)); } }
        else if (r() < .55 && !special) { var freeL = [-1, 0, 1].filter(function (l) { return blocked.indexOf(l) === -1; }); var cl = freeL[Math.floor(r() * freeL.length)]; for (var c = 0; c < 5; c++) t.coins.push(addCoin(t.d0 + 1.5 + c * 1.6, cl * LANE, hz === "fire" || hz === "branch" ? .45 : .8)); }
      }
      t.coins = t.coins.filter(Boolean);
      advance(10); gen.sinceCorner++; gen.inStretch++;
    }
    function emitCorner() {
      var dir = gen.h === 1 ? -1 : gen.h === 3 ? 1 : (gen.rnd() < .5 ? -1 : 1);
      var t = newTile("corner", 6); addPart(t, dir > 0 ? "cornerR" : "cornerL");
      var px = gen.x + DIRX[gen.h] * 3, pz = gen.z + DIRZ[gen.h] * 3, nh = (gen.h + (dir > 0 ? 1 : 3)) % 4, dc = gen.d + 3;
      legs.push({ d0: dc, x0: px, z0: pz, h: nh }); corners.push({ d: dc, dir: dir, queued: false, done: false, h: nh });
      gen.x = px + DIRX[nh] * 3; gen.z = pz + DIRZ[nh] * 3; gen.h = nh; gen.d += 6; gen.sinceCorner = 0;
    }
    function emitNext() {
      var st = STRETCHES[Math.min(gen.k, N - 1)], t, i;
      switch (gen.phase) {
        case "start":
          t = newTile("start", 22); addPart(t, "start"); addPart(t, "straight0", 0, -12); [-1, 1].forEach(function (sd) { addPart(t, "side:" + pickW(KITS[st.scenery], gen.rnd) + ":0:" + sd, 0, -12); }); advance(22); gen.phase = gen.k >= N ? "sprint" : "run"; gen.inStretch = 0; break;
        case "run":
          if (gen.runLeft <= 0) { emitStraight(st, false); gen.phase = st.track ? "trial" : "site"; gen.trialLeft = st.track ? trialLength(st) / 10 : 0; gen.trialD0 = gen.d; break; }
          if (gen.sinceCorner >= 3 && gen.inStretch > 1 && gen.runLeft > 20 && (gen.sinceCorner >= 7 || gen.rnd() < .28)) { emitCorner(); gen.runLeft -= 6; break; }
          emitStraight(st, true); gen.runLeft -= 10; break;
        case "trial":
          t = newTile("trial", 10, true); addPart(t, st.type === "planks" ? "rope" : "trial"); if (st.type !== "planks") sides(t, st); advance(10);
          if (--gen.trialLeft <= 0) gen.phase = "site";
          break;
        case "site":
          var chasm = st.encounter === "bridge" || st.encounter === "ropebridge";
          t = newTile("site", 32, true); addPart(t, chasm ? "siteChasm" : "site");
          [-1, 1].forEach(function (sd) { addPart(t, "side:" + pickW(KITS[st.scenery], gen.rnd) + ":1:" + sd, 0, -10); addPart(t, "side:" + pickW(KITS[st.scenery], gen.rnd) + ":0:" + sd, 0, -20); });
          var e = takeEncounter(st.encounter), w = localToWorld(t, 0, -24, {}); place(e.g, w.x, w.z, t.h); e.reset(); liveEnc[gen.k] = e; t.enc = e;
          sites[gen.k] = { k: gen.k, d0: t.d0, stopD: t.d0 + 18, trialD0: st.track ? gen.trialD0 : null, tile: t, enc: e, announced: false };
          advance(32);
          gen.k++; gen.inStretch = 0; gen.sinceCorner = 0; gen.runLeft = RUN_LEN;
          if (gen.k >= N) gen.phase = "sprint"; else { gen.phase = "run"; gen.rnd = seeded(data.title + "|" + gen.k); }
          break;
        case "sprint":
          if (S.finale.done) { t = newTile("exit", 30); addPart(t, "exit"); gen.exitD = t.d0 + 12; advance(30); gen.phase = "outro"; break; }
          t = newTile("sprint", 10); addPart(t, "sprint"); advance(10); break;
        case "outro":
          t = newTile("straight", 10); addPart(t, "straight0"); [-1, 1].forEach(function (sd) { addPart(t, "side:void:" + (gen.d % 20 < 10 ? 0 : 1) + ":" + sd); }); advance(10); break;
      }
    }
    function horizon() { return (S.mode === "sprint" || S.mode === "finale") && !S.finale.done ? 55 : 190; }
    function updateWorld() {
      var guard = 0;
      while (gen.d < R.d + horizon() && guard++ < 6) emitNext();
      while (tiles.length && tiles[0].d1 < R.d - 40 && !tiles[0].pinned) {
        var t = tiles.shift(); t.parts.forEach(give); t.coins.forEach(freeCoin);
        if (t.enc && liveEnc[t.k] === t.enc) { t.enc.g.visible = false; encPool[t.enc.style].push(t.enc); delete liveEnc[t.k]; }
        var w = 0; for (var ci2 = 0; ci2 < coins.length; ci2++) if (coins[ci2].alive) coins[w++] = coins[ci2]; coins.length = w;
      }
      while (hazards.length && hazards[0].end < R.d - 20) hazards.shift();
      while (corners.length && corners[0].done && corners[0].d < R.d - 30) corners.shift();
      while (legs.length > 2 && legs[1].d0 < R.d - 120) legs.shift();
    }

    /* ---------- characters: articulated low-poly figures ---------- */
    var MATS = {};
    function lam(c) { return MATS[c] || (MATS[c] = new THREE.MeshLambertMaterial({ color: c })); }
    function glowM(c) { return MATS["g" + c] || (MATS["g" + c] = new THREE.MeshBasicMaterial({ color: c })); }
    function mesh(parent, geo, mat, x, y, z, sx, sy, sz, rx, ry, rz) { var m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); if (rx || ry || rz) m.rotation.set(rx || 0, ry || 0, rz || 0); parent.add(m); return m; }
    function grp(parent, x, y, z) { var g = new THREE.Group(); g.position.set(x || 0, y || 0, z || 0); if (parent) parent.add(g); return g; }
    function blobShadow(size) { var m = new THREE.Mesh(GEO.plane, matBlob); m.rotation.x = -Math.PI / 2; m.scale.set(size, size, 1); m.renderOrder = 1; scene.add(m); return m; }

    /* merge the static leaf meshes under each joint into one vertex-coloured mesh: a figure costs ~10 draw calls, not ~30 */
    function mergeChildren(node) {
      var lamb = [], basic = [];
      node.children.forEach(function (c) {
        if (c.isMesh && !c.children.length && c.geometry.attributes.position && !c.geometry.index && !c.material.transparent) { if (c.material.isMeshLambertMaterial) lamb.push(c); else if (c.material.isMeshBasicMaterial && !c.material.map) basic.push(c); }
        else if (!c.isMesh) mergeChildren(c);
      });
      [[lamb, matStatic], [basic, matGlow]].forEach(function (pair) {
        if (pair[0].length < 2) return;
        var b = new Builder("m"); b.aoMin = 1;
        pair[0].forEach(function (m) { b.add(m.geometry, m.position.x, m.position.y, m.position.z, m.scale.x, m.scale.y, m.scale.z, m.rotation.x, m.rotation.y, m.rotation.z, "#" + m.material.color.getHexString(), .04); node.remove(m); });
        var mm = b.mesh(pair[1]); node.add(mm);
      });
    }
    function buildRunner() {
      var g = grp(scene), J = { g: g };
      var skin = lam("#d29a6c"), shirt = lam(themeName === "ice" ? "#9a6a44" : "#cbb487"), pants = lam("#5b4a36"), boots = lam("#3a2a1e"), hat = lam("#7a5532"), pack = lam("#6e4a2a"), scarf = lam(W3.runnerScarf);
      J.hips = grp(g, 0, .98, 0);
      J.torso = grp(J.hips, 0, 0, 0);
      mesh(J.torso, GEO.box, shirt, 0, .32, 0, .5, .6, .3);
      mesh(J.torso, GEO.box, boots, 0, .03, 0, .53, .09, .32);
      mesh(J.torso, GEO.box, scarf, 0, .6, -.01, .4, .1, .33);
      mesh(J.torso, GEO.box, pack, 0, .34, .24, .4, .46, .2);
      mesh(J.torso, GEO.cyl7, lam("#8a6a44"), 0, .62, .25, .1, .42, .1, 0, 0, Math.PI / 2);
      J.head = grp(J.torso, 0, .7, 0);
      mesh(J.head, GEO.box, skin, 0, .13, 0, .25, .28, .25);
      mesh(J.head, GEO.box, lam("#3b2a1c"), 0, .2, -.128, .17, .035, .01);
      mesh(J.head, GEO.cyl10, hat, 0, .29, 0, .3, .035, .3);
      mesh(J.head, GEO.cyl10, hat, 0, .37, 0, .165, .15, .165);
      mesh(J.head, GEO.cyl10, lam("#3a2a1e"), 0, .315, 0, .17, .03, .17);
      [-1, 1].forEach(function (s) {
        var sh = grp(J.torso, s * .31, .55, 0); mesh(sh, GEO.box, shirt, 0, -.15, 0, .14, .34, .15);
        var el2 = grp(sh, 0, -.32, 0); mesh(el2, GEO.box, skin, 0, -.14, 0, .12, .29, .12); mesh(el2, GEO.box, skin, 0, -.31, -.01, .13, .1, .14);
        var hp = grp(J.hips, s * .13, 0, 0); mesh(hp, GEO.box, pants, 0, -.21, 0, .18, .44, .2);
        var kn = grp(hp, 0, -.43, 0); mesh(kn, GEO.box, pants, 0, -.19, 0, .16, .4, .17); mesh(kn, GEO.box, boots, 0, -.43, -.05, .18, .12, .3);
        J[s < 0 ? "armL" : "armR"] = sh; J[s < 0 ? "foreL" : "foreR"] = el2; J[s < 0 ? "legL" : "legR"] = hp; J[s < 0 ? "kneeL" : "kneeR"] = kn;
      });
      J.shadow = blobShadow(1.3); mergeChildren(g);
      return J;
    }

    function buildChaser(kind) {
      var g = grp(scene), J = { g: g, kind: kind, parts: [] };
      if (kind === "ghost") {
        var cloth = new THREE.MeshLambertMaterial({ color: "#d8ecff", emissive: "#3a5f8a", transparent: true, opacity: .78, depthWrite: false });
        J.body = grp(g, 0, .25, 0);
        mesh(J.body, GEO.cone7, cloth, 0, .85, 0, .62, 1.7, .62, Math.PI, 0, 0);
        mesh(J.body, GEO.ico, cloth, 0, 1.72, 0, .36, .4, .36);
        mesh(J.body, GEO.ico, lam("#0c1424"), 0, 1.7, -.2, .22, .24, .12);
        [-1, 1].forEach(function (s) { mesh(J.body, GEO.box, glowM("#9ff6ff"), s * .08, 1.74, -.3, .05, .07, .02); });
        J.armR = grp(J.body, .34, 1.3, -.05); mesh(J.armR, GEO.cone5, cloth, 0, -.25, 0, .13, .55, .13, Math.PI, 0, 0);
        J.lantern = mesh(J.armR, GEO.box, glowM("#ffd36b"), 0, -.62, -.12, .16, .22, .16);
        var ls = new THREE.Sprite(glowSpriteMat); ls.scale.set(1.3, 1.3, 1); ls.position.set(0, -.62, -.12); J.armR.add(ls);
        for (var w = 0; w < 3; w++) J.parts.push(mesh(J.body, GEO.cone5, cloth, -.25 + w * .25, -.2, .3, .12, .6, .12, -1.2, 0, 0));
        J.shadow = blobShadow(1.1); mergeChildren(g); return J;
      }
      var fur = kind === "yeti" ? "#e7edf1" : kind === "jackal" ? "#1d1813" : "#3a2a20", furM = lam(fur), dark = lam(kind === "yeti" ? "#4b5a78" : "#140e0a");
      var eye = glowM(kind === "jackal" ? "#ffd23a" : kind === "yeti" ? "#69e3ff" : "#ff3b2a");
      if (kind === "yeti") {
        J.hips = grp(g, 0, 1.0, 0); J.torso = grp(J.hips, 0, 0, 0);
        mesh(J.torso, GEO.ico, furM, 0, .55, 0, .62, .72, .5); mesh(J.torso, GEO.ico, furM, 0, .2, 0, .5, .45, .44);
        J.head = grp(J.torso, 0, 1.2, -.08); mesh(J.head, GEO.ico, furM, 0, 0, 0, .34, .34, .32); mesh(J.head, GEO.box, dark, 0, -.02, -.26, .34, .3, .1);
        [-1, 1].forEach(function (s) { mesh(J.head, GEO.box, eye, s * .08, .04, -.32, .06, .04, .02); mesh(J.head, GEO.cone5, lam("#cfd8dc"), s * .26, .22, 0, .06, .28, .06, 0, 0, -s * .6); });
        [-1, 1].forEach(function (s) {
          var sh = grp(J.torso, s * .62, .85, 0); mesh(sh, GEO.box, furM, 0, -.32, 0, .26, .7, .26); var f2 = grp(sh, 0, -.66, 0); mesh(f2, GEO.box, furM, 0, -.3, -.04, .22, .62, .22); mesh(f2, GEO.box, dark, 0, -.66, -.06, .22, .14, .26);
          var hp = grp(J.hips, s * .26, 0, 0); mesh(hp, GEO.box, furM, 0, -.26, 0, .3, .52, .3); var kn = grp(hp, 0, -.5, 0); mesh(kn, GEO.box, furM, 0, -.22, 0, .28, .46, .28); mesh(kn, GEO.box, dark, 0, -.48, -.08, .3, .1, .4);
          J[s < 0 ? "armL" : "armR"] = sh; J[s < 0 ? "foreL" : "foreR"] = f2; J[s < 0 ? "legL" : "legR"] = hp; J[s < 0 ? "kneeL" : "kneeR"] = kn;
        });
        J.shadow = blobShadow(1.8); mergeChildren(g); return J;
      }
      /* quadrupeds: demon monkey (skull mask) and jackal spirit */
      var jackal = kind === "jackal";
      J.body = grp(g, 0, jackal ? .72 : .66, 0);
      if (jackal) { mesh(J.body, GEO.box, furM, 0, 0, 0, .42, .42, 1.0); mesh(J.body, GEO.box, lam("#d9a520"), 0, .12, -.52, .44, .14, .14); }
      else { mesh(J.body, GEO.dode, furM, 0, .05, .05, .42, .4, .55); mesh(J.body, GEO.dode, furM, 0, .2, -.3, .4, .38, .36); }
      J.head = grp(J.body, 0, jackal ? .32 : .36, jackal ? -.66 : -.55);
      if (jackal) {
        mesh(J.head, GEO.box, furM, 0, 0, 0, .3, .3, .34); mesh(J.head, GEO.box, furM, 0, -.06, -.3, .16, .14, .34);
        [-1, 1].forEach(function (s) { mesh(J.head, GEO.cone4, furM, s * .1, .3, .05, .07, .32, .05); mesh(J.head, GEO.box, eye, s * .09, .05, -.17, .05, .04, .02); });
      } else {
        mesh(J.head, GEO.dode, furM, 0, 0, .04, .27, .27, .25);
        mesh(J.head, GEO.box, lam("#efe6d2"), 0, -.01, -.18, .34, .36, .1);
        mesh(J.head, GEO.box, lam("#efe6d2"), 0, -.19, -.16, .22, .1, .12);
        [-1, 1].forEach(function (s) { mesh(J.head, GEO.box, dark, s * .085, .05, -.235, .1, .1, .02); mesh(J.head, GEO.box, eye, s * .085, .05, -.245, .04, .04, .01); mesh(J.head, GEO.cyl7, furM, s * .3, .08, .02, .1, .05, .1, 0, 0, Math.PI / 2); });
        mesh(J.head, GEO.box, dark, 0, -.17, -.225, .14, .03, .01);
      }
      [-1, 1].forEach(function (s) {
        var sh = grp(J.body, s * (jackal ? .16 : .3), jackal ? -.05 : .18, jackal ? -.38 : -.3); mesh(sh, GEO.box, furM, 0, -.2, 0, jackal ? .1 : .13, jackal ? .4 : .46, jackal ? .1 : .13);
        var f2 = grp(sh, 0, jackal ? -.38 : -.44, 0); mesh(f2, GEO.box, furM, 0, -.12, 0, .1, jackal ? .3 : .36, .1);
        var hp = grp(J.body, s * (jackal ? .16 : .2), jackal ? -.05 : -.1, jackal ? .38 : .3); mesh(hp, GEO.box, furM, 0, -.18, 0, jackal ? .12 : .15, .38, jackal ? .14 : .16);
        var kn = grp(hp, 0, -.36, 0); mesh(kn, GEO.box, furM, 0, -.13, .04, .1, .3, .1);
        J[s < 0 ? "armL" : "armR"] = sh; J[s < 0 ? "foreL" : "foreR"] = f2; J[s < 0 ? "legL" : "legR"] = hp; J[s < 0 ? "kneeL" : "kneeR"] = kn;
      });
      J.tail = grp(J.body, 0, .1, jackal ? .5 : .32); mesh(J.tail, GEO.box, furM, 0, .2, .18, .06, .06, .5, -.7, 0, 0);
      J.shadow = blobShadow(1.2); mergeChildren(g);
      return J;
    }
    /* procedural animation; ph is the stride phase, sp the speed (0 = standing) */
    function animChaser(J, ph, sp, t) {
      var amp = Math.min(1, sp / 6), s = Math.sin(ph), c = Math.cos(ph);
      if (J.kind === "ghost") { J.body.position.y = .3 + Math.sin(t * 2.4 + ph * .1) * .12; J.body.rotation.x = -.25 * amp; J.armR.rotation.x = -.9 + Math.sin(t * 3) * .15; J.parts.forEach(function (w, i) { w.rotation.x = -1.2 + Math.sin(t * 6 + i) * .25; }); return; }
      if (J.kind === "yeti") {
        J.hips.position.y = 1.0 + Math.abs(c) * .1 * amp; J.torso.rotation.x = -.28 * amp; J.legL.rotation.x = s * .8 * amp; J.legR.rotation.x = -s * .8 * amp;
        J.kneeL.rotation.x = -Math.max(0, Math.sin(ph + 1.5)) * 1.0 * amp; J.kneeR.rotation.x = -Math.max(0, Math.sin(ph + 1.5 + Math.PI)) * 1.0 * amp;
        J.armL.rotation.x = -s * .9 * amp - .2; J.armR.rotation.x = s * .9 * amp - .2; J.foreL.rotation.x = .5; J.foreR.rotation.x = .5;
        if (!amp) { J.armL.rotation.z = -.2 - Math.sin(t * 2) * .1; J.armR.rotation.z = .2 + Math.sin(t * 2) * .1; J.armL.rotation.x = -.4; J.armR.rotation.x = -.4; }
        return;
      }
      var a = amp || 0;
      J.body.position.y = (J.kind === "jackal" ? .72 : .66) + Math.abs(s) * .12 * a; J.body.rotation.x = s * .14 * a;
      J.armL.rotation.x = s * 1.0 * a; J.armR.rotation.x = Math.sin(ph + .4) * 1.0 * a; J.foreL.rotation.x = -.4 * a; J.foreR.rotation.x = -.4 * a;
      J.legL.rotation.x = -s * .9 * a; J.legR.rotation.x = -Math.sin(ph + .4) * .9 * a; J.kneeL.rotation.x = .5 * a; J.kneeR.rotation.x = .5 * a;
      J.tail.rotation.x = Math.sin(t * 4) * .3;
      if (!a) { J.armL.rotation.x = -.3 + Math.sin(t * 6) * .25; J.armR.rotation.x = -.3 - Math.sin(t * 6) * .25; J.head.rotation.y = Math.sin(t * 1.7) * .4; } else J.head.rotation.y = 0;
    }

    /* ---------- encounters: who or what blocks the way at the end of a stretch ---------- */
    var encPool = {}, liveEnc = {};
    function ease(k) { return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
    function buildEncounter(style) {
      var g = new THREE.Group(), E = { g: g, style: style, st: "off", k: 0, react: 0, prog: 0, flames: [] }, b = new Builder("enc" + style), gb = new Builder("encg" + style), i;
      var gold = new THREE.MeshLambertMaterial({ color: "#e2a83a", emissive: "#6a4000" });
      switch (style) {
        case "gate":
          [-1, 1].forEach(function (s) { b.add(GEO.box, s * 3.1, 2.7, 0, 1.0, 5.4, 1.1, 0, 0, 0, stoneCol(b, .1), .05); });
          b.add(GEO.box, 0, 5.75, 0, 7.6, 1.0, 1.4, 0, 0, 0, stoneCol(b, 0), .05);
          gb.add(GEO.octa, 0, 5.75, .72, .4, .4, .05, 0, 0, 0, W3.glow, 0);
          E.bars = grp(g); var bb = new Builder("bars"); for (i = 0; i < 7; i++) bb.add(GEO.box, -2.4 + i * .8, 2.2, 0, .16, 4.4, .16, 0, 0, 0, "#3b3530", .05);
          [1.2, 3.0].forEach(function (y) { bb.add(GEO.box, 0, y, 0, 5.2, .18, .18, 0, 0, 0, "#3b3530", .05); }); for (i = 0; i < 7; i++) bb.add(GEO.cone4, -2.4 + i * .8, -.15, 0, .12, .4, .12, Math.PI, 0, 0, "#3b3530", 0);
          E.bars.add(bb.mesh());
          break;
        case "fire":
          for (i = 0; i < 9; i++) b.add(GEO.box, -2.6 + i * .65, .05, 0, .5, .1, .5, 0, .4, 0, "#2a1a10", .1);
          for (i = 0; i < 9; i++) gb.add(GEO.box, -2.6 + i * .65, .12, 0, .3, .04, .3, 0, .4, 0, W3.fire, 0);
          E.fireG = grp(g); for (i = 0; i < 9; i++) addFlame(E.fireG, -2.6 + i * .65, 0, (i % 2) * .3 - .15, 2.6 + (i % 3) * .5, E.flames);
          break;
        case "vines":
          [-1, 1].forEach(function (s) { b.add(GEO.box, s * 3.1, 2.6, 0, .9, 5.2, .9, 0, 0, 0, stoneCol(b, .1), .05); });
          b.add(GEO.box, 0, 5.4, 0, 7.2, .7, 1, 0, 0, 0, stoneCol(b, 0), .05);
          E.vines = grp(g, 0, 5.05, 0); var vb = new Builder("vines");
          for (i = 0; i < 16; i++) { var vx = -2.6 + i * .35, vl = 4.4 + vb.rnd() * .6; vb.add(GEO.cyl5, vx, -vl / 2, (vb.rnd() - .5) * .3, .09, vl, .09, 0, 0, (vb.rnd() - .5) * .15, mix(W3.trunk, W3.leaf[0], .5), .1); }
          for (i = 0; i < 26; i++) { var lr = .25 + vb.rnd() * .3; vb.add(GEO.ico, -2.6 + vb.rnd() * 5.2, -vb.rnd() * 4.6, (vb.rnd() - .5) * .4, lr, lr * .6, lr, 0, vb.rnd(), 0, W3.leaf[i % 4], .14); }
          for (i = 0; i < 6; i++) vb.add(GEO.cyl5, 0, -1 - i * .7, 0, .07, 6.6, .07, 0, 0, Math.PI / 2 + (vb.rnd() - .5) * .5, mix(W3.trunk, W3.leaf[2], .4), .1);
          E.vines.add(vb.mesh());
          break;
        case "bridge":
          b.add(GEO.cyl7, 0, -16, 0, 1.3, 31, 1.3, 0, 0, 0, W3.stoneDark, .05);
          b.add(GEO.cyl7, 0, -.75, 0, 1.6, .5, 1.6, 0, 0, 0, W3.stone, .05);
          E.slab = grp(g); var sb = new Builder("slab");
          sb.add(GEO.box, 0, -.27, 0, 5.4, .55, 8.6, 0, 0, 0, mix(W3.path, W3.stoneDark, .15), .06); sb.add(GEO.box, 0, -.8, 0, 4.6, .6, 8.0, 0, 0, 0, W3.stoneDark, .05);
          [-1, 1].forEach(function (s) { sb.add(GEO.box, s * 2.8, .2, 0, .3, .5, 8.6, 0, 0, 0, W3.stone, .05); });
          E.slab.add(sb.mesh());
          break;
        case "ropebridge":
          [-1, 1].forEach(function (s) { [-4.3, 4.3].forEach(function (z) { b.add(GEO.cyl7, s * 2.9, .1, z, .15, 2.2, .15, 0, 0, 0, W3.trunk, .06); }); b.add(GEO.cyl5, s * 2.9, .95, 0, .05, 8.6, .05, Math.PI / 2, 0, 0, "#7a6648", 0); b.add(GEO.cyl5, s * 2.7, -.18, 0, .05, 8.6, .05, Math.PI / 2, 0, 0, "#6b5a40", 0); });
          E.planks = []; var miss = [2, 3, 5, 6, 7, 9];
          for (i = 0; i < 12; i++) {
            var pm = mesh(g, GEO.box, lam(mix(W3.trunk, "#b58a55", .3 + (i % 3) * .15)), 0, -.12, -3.85 + i * .7, 5.3, .12, .5);
            if (miss.indexOf(i) !== -1) E.planks.push({ m: pm, z: -3.85 + i * .7, rx: (i * 1.7) % 1.2 - .6, ry: (i * 2.3) % 1.4 - .7, ox: ((i * 3.1) % 4) - 2 });
          }
          break;
        case "ghost":
          E.ch = buildChaser("ghost"); scene.remove(E.ch.g); scene.remove(E.ch.shadow); g.add(E.ch.g); E.ch.g.scale.set(2.3, 2.3, 2.3); E.ch.g.rotation.y = Math.PI;
          E.mat = E.ch.body.children[0].material;
          break;
        case "monkey":
          E.ch = buildChaser("monkey"); scene.remove(E.ch.g); scene.remove(E.ch.shadow); g.add(E.ch.g); E.ch.g.scale.set(2.6, 2.6, 2.6); E.ch.g.rotation.y = Math.PI;
          b.add(GEO.box, 0, .4, 0, 2.6, .8, 2.2, 0, 0, 0, stoneCol(b, .25), .05);
          break;
        case "guardian":
          E.fig = grp(g); var fb = new Builder("guard"), sc = stoneCol(fb, .05), dk = mix(W3.stone, W3.stoneDark, .45);
          fb.add(GEO.box, 0, .4, 0, 2.2, .8, 1.6, 0, 0, 0, dk, .05);
          [-1, 1].forEach(function (s) { fb.add(GEO.box, s * .42, 1.6, 0, .55, 1.6, .6, 0, 0, 0, sc, .07); fb.add(GEO.box, s * 1.0, 3.3, 0, .45, 1.5, .45, 0, 0, s * .15, sc, .07); });
          fb.add(GEO.box, 0, 3.3, 0, 1.6, 1.9, .9, 0, 0, 0, sc, .07); fb.add(GEO.box, 0, 2.5, 0, 1.7, .3, 1.0, 0, 0, 0, dk, .05);
          fb.add(GEO.box, 0, 4.7, 0, .85, .9, .8, 0, 0, 0, sc, .07); fb.add(GEO.box, 0, 5.25, 0, 1.0, .28, .95, 0, 0, 0, dk, .05); fb.add(GEO.box, 0, 5.6, .1, .2, .6, .9, 0, 0, 0, dk, .05);
          E.fig.add(fb.mesh());
          E.eyes = new THREE.MeshBasicMaterial({ color: W3.eye }); [-1, 1].forEach(function (s) { mesh(E.fig, GEO.box, E.eyes, s * .2, 4.8, .41, .16, .08, .03); });
          E.spear = grp(E.fig, 1.0, 2.6, .5); var spb = new Builder("spear"); spb.add(GEO.cyl5, 0, 0, 0, .07, 6.6, .07, 0, 0, 0, "#5a4330", 0); spb.add(GEO.cone4, 0, 3.6, 0, .2, .7, .1, 0, 0, 0, "#c9c2b0", 0); E.spear.add(spb.mesh()); E.spear.rotation.z = .95;
          break;
        case "idol":
          E.fig = grp(g, 0, 3.2, 0);
          mesh(E.fig, GEO.box, gold, 0, 0, 0, 2.8, 3.2, 1.0); mesh(E.fig, GEO.box, gold, 0, 1.75, 0, 3.2, .4, 1.1); mesh(E.fig, GEO.box, gold, 0, .7, .5, 2.6, .34, .2);
          mesh(E.fig, GEO.box, gold, 0, -.1, .62, .5, 1.0, .4); mesh(E.fig, GEO.box, lam("#7a4f12"), 0, -1.0, .52, 1.4, .3, .1); [-1, 1].forEach(function (s) { mesh(E.fig, GEO.box, gold, s * 1.62, .1, 0, .3, 1.4, .6); });
          E.eyes = new THREE.MeshBasicMaterial({ color: W3.glow }); [-1, 1].forEach(function (s) { mesh(E.fig, GEO.box, E.eyes, s * .6, .3, .53, .5, .22, .05); });
          var halo2 = new THREE.Sprite(glowSpriteMat); halo2.scale.set(7, 7, 1); halo2.position.set(0, 0, -.6); E.fig.add(halo2);
          break;
        case "serpent":
          E.fig = grp(g); var srb = new Builder("serp"), scol = mix(W3.stone, W3.moss, .25), sdk = mix(W3.stone, W3.stoneDark, .5);
          for (i = 0; i < 9; i++) { var t2 = i / 8, sx2 = 6 - t2 * 6.5, sy2 = -6 + Math.sin(t2 * Math.PI * .9) * 9; srb.add(GEO.cyl10, sx2, sy2, -.4, .85 - t2 * .2, 2.0, .85 - t2 * .2, 0, 0, -1.2 + t2 * 1.6, scol, .08); }
          for (i = 0; i < 6; i++) srb.add(GEO.cyl10, -4 + i * 1.6, .35, 1.2, .55, 1.8, .55, 0, 0, Math.PI / 2, scol, .08);
          E.fig.add(srb.mesh());
          E.head = grp(E.fig, -.6, 3.2, .2); var hb = new Builder("shead");
          hb.add(GEO.box, 0, 0, 0, 1.3, .9, 1.7, 0, 0, 0, scol, .06); hb.add(GEO.box, 0, -.55, .3, 1.1, .3, 1.3, .25, 0, 0, sdk, .05); hb.add(GEO.cone7, 0, .1, -.3, 1.9, .3, 1.4, Math.PI / 2, 0, 0, scol, .06);
          [-1, 1].forEach(function (s) { hb.add(GEO.cone4, s * .3, -.7, .8, .07, .35, .07, Math.PI, 0, 0, "#efe6d2", 0); }); E.head.add(hb.mesh());
          E.eyes = new THREE.MeshBasicMaterial({ color: W3.eye }); [-1, 1].forEach(function (s) { mesh(E.head, GEO.box, E.eyes, s * .45, .2, .7, .2, .14, .2); });
          break;
      }
      if (!b.empty()) g.add(b.mesh());
      if (!gb.empty()) g.add(gb.mesh(matGlow));
      E.eyeBase = new THREE.Color(style === "idol" ? W3.glow : W3.eye);
      E.reset = function () { E.st = "off"; E.k = 0; E.react = 0; E.prog = 0; pose(E, 0); };
      E.enter = function () { if (E.st === "off") { E.st = "in"; E.k = 0; } };
      E.clear = function () { if (E.st !== "out" && E.st !== "gone") { if (E.st === "off") E.st = "idle"; E.st = "out"; E.k = 0; } };
      E.hit = function () { E.react = 1; };
      scene.add(g);
      return E;
    }
    var _red = new THREE.Color("#ff2a1a");
    function pose(E, t) {
      var inK = E.st === "off" ? 0 : E.st === "in" ? ease(E.k) : 1, outK = E.st === "out" ? ease(E.k) : E.st === "gone" ? 1 : 0, r = E.react, sh = settings.reduced ? 0 : 1;
      switch (E.style) {
        case "gate": E.bars.position.y = 4.4 * (1 - inK) + inK * 4.4 * Math.max(outK, E.prog * .3); E.bars.position.x = Math.sin(t * 55) * .05 * r * sh; break;
        case "fire": var fs = Math.max(.03, inK * (1 - outK * .95)) * (1 + r * .6); E.fireG.scale.set(1, fs, 1); E.fireG.visible = fs > .04; break;
        case "vines": E.vines.scale.y = Math.max(.02, inK * (1 - outK) * (1 - E.prog * .3)); E.vines.rotation.z = Math.sin(t * 13) * .07 * r * sh; break;
        case "bridge": E.slab.rotation.y = Math.PI / 2 * (1 - Math.max(outK, E.prog * .3)) + Math.sin(t * 18) * .14 * r * sh; break;
        case "ropebridge": E.planks.forEach(function (pl, i) { var kk = Math.max(outK, E.prog * (i % 2 ? .0 : 1) * .5); kk = Math.min(1, kk); pl.m.position.set(pl.ox * (1 - kk), -.12 - 4 * (1 - kk), pl.z); pl.m.rotation.set(pl.rx * (1 - kk), pl.ry * (1 - kk), 0); pl.m.visible = kk > .01 || inK < 2; }); g0(E).rotation.z = Math.sin(t * 9) * .03 * r * sh; break;
        case "ghost": E.ch.g.position.set(0, -3 + inK * 3 + outK * 7 + Math.sin(t * 2) * .2, r * 1.6); E.mat.opacity = .8 * inK * (1 - outK); E.ch.g.visible = inK > .01 && outK < .99; animChaser(E.ch, 0, 0, t); break;
        case "monkey": var arc = Math.sin(inK * Math.PI); E.ch.g.position.set(5 * (1 - inK) - 8 * outK, .8 + arc * 3 * (1 - inK > .01 ? 1 : 0) + Math.sin(outK * Math.PI) * 4, r * .8); E.ch.g.scale.setScalar(2.6 * (1 - outK * .9) * (1 + r * .12)); E.ch.g.visible = inK > .01 && outK < .99; animChaser(E.ch, t * 9, r > .1 ? 8 : 0, t); break;
        case "guardian": E.fig.position.set(outK * 3.6, -5.6 * (1 - inK) - outK * .6, 0); E.fig.rotation.y = outK * -1.1; E.spear.rotation.z = .95 - r * .7 * sh - outK * .9; E.eyes.color.copy(E.eyeBase).lerp(_red, r); break;
        case "idol": E.fig.position.y = -5 + inK * 8.2 + outK * 26 + Math.sin(t * 1.5) * .25; E.fig.rotation.y = Math.sin(t * .7) * .15 + Math.sin(t * 40) * .05 * r * sh; E.fig.scale.setScalar(1 - outK * .7); E.eyes.color.copy(E.eyeBase).lerp(_red, r); E.fig.visible = outK < .99; break;
        case "serpent": E.fig.position.y = -12 * (1 - inK) - outK * 14; E.head.rotation.y = Math.sin(t * 1.3) * .25; E.head.position.z = .2 + r * 1.6 * sh; E.eyes.color.copy(E.eyeBase).lerp(_red, r); E.fig.visible = inK > .01 && outK < .99; break;
      }
      if (E.flames.length) for (var i = 0; i < E.flames.length; i++) { var f = E.flames[i]; f.scale.y = f.userData.base * (.85 + Math.sin(t * 13 + f.userData.ph) * .15); }
    }
    function g0(E) { return E.g; }
    function takeEncounter(style) { var list = encPool[style] || (encPool[style] = []); var e = list.pop() || buildEncounter(style); e.g.visible = true; return e; }
    function updateEncounter(E, dt, t) {
      if (E.st === "in") { E.k = Math.min(1, E.k + dt / 1.1); if (E.k >= 1) E.st = "idle"; }
      else if (E.st === "out") { E.k = Math.min(1, E.k + dt / 1.6); if (E.k >= 1) E.st = "gone"; }
      E.react = Math.max(0, E.react - dt * 1.2);
      pose(E, t);
    }

    /* ---------- trial props: the track-side objects of the runner-native activities ---------- */
    var trialProps = [], propPool = {};
    function buildProp(kind) {
      var g = new THREE.Group(), P = { g: g, kind: kind, t: 0, fx: 0 }, b = new Builder("prop" + kind), bw = 1.7, bh = .64, by = 2.7;
      switch (kind) {
        case "rune":
          P.mat = new THREE.MeshLambertMaterial({ color: W3.stone, emissive: W3.glow, emissiveIntensity: .35 });
          P.core = mesh(g, GEO.octa, P.mat, 0, 1.5, 0, .42, .68, .42);
          mesh(g, GEO.ring, glowM(W3.glow), 0, .06, 0, .62, .62, .62, -Math.PI / 2, 0, 0);
          break;
        case "gateway":
          [-1, 1].forEach(function (s) { b.add(GEO.box, s * .76, 1.45, 0, .26, 2.9, .34, 0, 0, 0, stoneCol(b, .1), .05); });
          b.add(GEO.box, 0, 3.0, 0, 1.9, .36, .44, 0, 0, 0, stoneCol(b, 0), .05);
          P.mat = new THREE.MeshBasicMaterial({ color: W3.glow, transparent: true, opacity: .32, depthWrite: false, side: THREE.DoubleSide });
          P.core = mesh(g, GEO.plane, P.mat, 0, 1.4, 0, 1.24, 2.75, 1); by = 3.55;
          break;
        case "brazier":
          b.add(GEO.cyl7, 0, .55, 0, .13, 1.1, .13, 0, 0, 0, W3.stoneDark, .04); b.add(GEO.cyl7, 0, 1.18, 0, .42, .26, .42, 0, 0, 0, W3.stoneDark, .04); b.add(GEO.box, 0, .05, 0, .7, .1, .7, 0, 0, 0, W3.stone, .04);
          P.flames = []; P.core = grp(g); addFlame(P.core, 0, 1.25, 0, 1.0, P.flames); P.core.visible = false; by = 2.6;
          P.mat = new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0, depthWrite: false }); P.ring = mesh(g, GEO.ring, P.mat, 0, .1, 0, .7, .7, .7, -Math.PI / 2, 0, 0);
          break;
        case "plank":
          P.mat = new THREE.MeshLambertMaterial({ color: mix(W3.trunk, "#e0b070", .45), emissive: W3.glow, emissiveIntensity: .25 });
          P.core = mesh(g, GEO.box, P.mat, 0, -.06, 0, 5.3, .14, .8); bw = 3.7; bh = 1.0; by = 3.0;
          break;
        case "token":
          P.mat = new THREE.MeshLambertMaterial({ color: "#ffd25a", emissive: "#8a5200", emissiveIntensity: .7 });
          P.core = mesh(g, GEO.cyl10, P.mat, 0, 1.15, 0, .46, .08, .46, Math.PI / 2, 0, 0); bw = 1.4; bh = .6; by = 2.15;
          break;
        case "lever":
          b.add(GEO.box, 0, .25, 0, .6, .5, .6, 0, 0, 0, W3.stoneDark, .04); b.add(GEO.box, 0, .52, 0, .7, .06, .2, 0, 0, 0, W3.stone, .03);
          P.core = grp(g, 0, .5, 0); P.mat = new THREE.MeshLambertMaterial({ color: "#c9a05a", emissive: "#3a2400" }); mesh(P.core, GEO.cyl5, lam("#5a4330"), 0, .55, 0, .06, 1.1, .06); mesh(P.core, GEO.ico, P.mat, 0, 1.12, 0, .14, .14, .14); P.core.rotation.x = .6; by = 2.3;
          break;
        case "tile":
          P.mat = new THREE.MeshLambertMaterial({ color: W3.stone, emissive: W3.glow, emissiveIntensity: .3 });
          P.core = mesh(g, GEO.box, P.mat, 0, .03, 0, 1.55, .06, 1.7); bw = 1.55; bh = .58; by = 1.2;
          break;
        case "orb":
          P.mat = new THREE.MeshBasicMaterial({ color: W3.glow });
          P.core = mesh(g, GEO.ico1, P.mat, 0, 2.6, 0, .36, .36, .36); var hs = new THREE.Sprite(glowSpriteMat); P.core.add(hs); hs.scale.set(2.4, 2.4, 1); bw = 2.0; by = 3.5;
          break;
      }
      if (!b.empty()) g.add(b.mesh());
      P.board = makeBoard(kind === "plank" ? 1024 : 512, kind === "plank" ? 280 : 192); P.board.scale.set(bw, bh, 1); P.board.position.set(0, by, kind === "tile" ? -.9 : 0); g.add(P.board);
      scene.add(g); return P;
    }
    function takeProp(kind) { var l = propPool[kind] || (propPool[kind] = []), P = l.pop() || buildProp(kind); P.g.visible = true; P.fx = 0; P.state = "idle"; P.g.scale.set(1, 1, 1); trialProps.push(P); return P; }
    function releaseProp(P) { P.g.visible = false; (propPool[P.kind] || (propPool[P.kind] = [])).push(P); }
    function setPropState(P, state) {
      P.state = state; P.fx = 1;
      var c = state === "ok" ? "#5ee08f" : state === "no" ? "#ff5a4a" : state === "reveal" ? "#5ee08f" : state === "dim" ? "#555555" : W3.glow;
      if (P.kind === "rune" || P.kind === "plank" || P.kind === "tile" || P.kind === "token") { P.mat.emissive.set(c); P.mat.emissiveIntensity = state === "dim" ? .05 : P.kind === "plank" ? .45 : .8; }
      if (P.kind === "gateway" || P.kind === "orb") { P.mat.color.set(c); if (P.kind === "gateway") P.mat.opacity = state === "dim" ? .08 : .5; }
      if (P.kind === "lever") { P.mat.emissive.set(state === "ok" || state === "reveal" ? "#2a8a4a" : state === "no" ? "#8a1a10" : "#3a2400"); }
      if (P.kind === "brazier") { P.mat.color.set(c); P.mat.opacity = state === "idle" ? 0 : .9; }
    }
    function propAt(P, d, lat, y) { var p = {}; var L = pathPos(d, lat, p); place(P.g, p.x, p.z, L.h, y || 0); P.d = d; P.board.visible = true; }

    /* sparkles for successes: a few pooled additive sprites */
    var sparks = [];
    for (var spi = 0; spi < 8; spi++) { var spr = new THREE.Sprite(glowSpriteMat); spr.visible = false; scene.add(spr); sparks.push({ s: spr, t: 0 }); }
    function sparkle(x, y, z, size) { var sp2 = sparks.shift(); sparks.push(sp2); sp2.s.position.set(x, y, z); sp2.t = 1; sp2.size = size || 3; sp2.s.visible = true; }
    function updateSparks(dt) { for (var i = 0; i < sparks.length; i++) { var s = sparks[i]; if (s.t <= 0) continue; s.t -= dt * 1.8; if (s.t <= 0) { s.s.visible = false; continue; } var k = 1 - s.t; s.s.scale.set(s.size * (.4 + k), s.size * (.4 + k), 1); } }

    /* ---------- runner state, chasers ---------- */
    var runner = buildRunner();
    var R = { d: 11, lat: 0, lane: 0, y: 0, vy: 0, slide: 0, stumbleT: 0, speed: 0, yaw: 0, ph: 0, snapX: 0, snapZ: 0, blocked: null, startD: 11, airborne: false };
    var chasers = [buildChaser(chaserKind), buildChaser(chaserKind), buildChaser(chaserKind)];
    chasers.forEach(function (J, i) { var sc = chaserKind === "yeti" ? .62 + i * .04 : chaserKind === "ghost" ? .58 + i * .04 : .86 + i * .05; J.g.scale.setScalar(sc); J.shadow.scale.multiplyScalar(sc); });
    var CH_LAT = [-.85, .35, 1.05], CH_OFF = [0, .9, .45];
    var CH = { gap: 9, ph: 0, pounce: 0 };
    var _rp = { x: 0, z: 0 }, _cp2 = { x: 0, z: 0 };
    function chaserTarget() {
      var g = 3.0 - .4 * S.stumbles - (STRICT ? (START_TORCHES - S.torches) * .15 : 0);
      if (S.mode === "stop" || S.mode === "lesson" || S.mode === "solved") g = 2.6;
      return Math.max(1.9, Math.min(3.1, g));
    }
    function lunge(by) { CH.gap = Math.max(1.2, CH.gap - by * .15); }

    function laneIndex() { return Math.max(-1, Math.min(1, Math.round(R.lat / LANE))); }
    function isRunning() { return (S.mode === "run" || S.mode === "sprint" || S.mode === "exit") && !S.paused; }
    function nextCorner() { for (var i = 0; i < corners.length; i++) if (!corners[i].done) return corners[i]; return null; }
    var shake = 0;
    function act(k) {
      if (!isRunning() || S.mode === "exit") return;
      if (k === "left" || k === "right") {
        var dir = k === "left" ? -1 : 1, c = nextCorner();
        if (c && !c.queued && c.d - R.d < 13 && c.d - R.d > -1.2 && c.dir === dir) { c.queued = true; sfx("turn"); turnHint.classList.remove("nthview-show"); return; }
        var nl = Math.max(-1, Math.min(1, R.lane + dir));
        if (R.blocked && R.blocked.indexOf(nl) !== -1) { toast("No room on " + (R.blockedLabel || "the ledge") + "!", 900); return; }
        R.lane = nl;
      } else if (k === "up") {
        if (R.y <= .02) { R.vy = 7.4; R.slide = 0; sfx("jump"); }
      } else if (k === "down") {
        if (R.y > .05) R.vy = Math.min(R.vy, -13); R.slide = .78; sfx("slide");
      }
    }
    function stumble(reason) {
      if (R.stumbleT > 0) return;
      R.stumbleT = .62; R.speed *= .5; S.stumbles++; lunge(9); hitFlash(); if (!settings.reduced) shake = .35; sfx("stumble");
      say(hero + " stumbled on " + reason + ".");
      if (S.stumbles >= 3) { caught("Three stumbles let them catch up."); return; }
      toast("Stumbled on " + reason + "!", 1100);
    }
    function checkHazards(prevD) {
      for (var i = 0; i < hazards.length; i++) {
        var h = hazards[i]; if (h.done) continue;
        if (h.d > R.d) break;
        if (h.kind === "block") {
          if (R.d > h.end) { h.done = true; if (R.blocked === h.lanes) R.blocked = null; continue; }
          if (!h.entered) {
            h.entered = true;
            if (h.lanes.indexOf(laneIndex()) !== -1 && h.lanes.indexOf(R.lane) !== -1) { stumble(h.label); }
            var free = [-1, 0, 1].filter(function (l) { return h.lanes.indexOf(l) === -1; });
            if (h.lanes.indexOf(R.lane) !== -1) { var best = free[0]; free.forEach(function (l) { if (Math.abs(l - R.lane) < Math.abs(best - R.lane)) best = l; }); R.lane = best; }
            if (h.end - h.d > 3) { R.blocked = h.lanes; R.blockedLabel = h.label; }
          }
          continue;
        }
        h.done = true;
        if (h.kind === "jump" && R.y < .5) stumble(h.label);
        else if (h.kind === "gap" && R.y < .18) stumble(h.label);
        else if (h.kind === "slide" && R.slide <= 0) stumble(h.label);
      }
    }
    function checkCoins() {
      for (var i = 0; i < coins.length; i++) {
        var c = coins[i]; if (!c.alive) continue;
        var dd = c.d - R.d; if (dd > 2) continue; if (dd < -1.2) continue;
        if (Math.abs(dd) < .9 && Math.abs(c.lat - R.lat) < .95 && Math.abs((c.y - .6) - R.y) < 1.1) { freeCoin(c); S.coins++; renderScore(); sfx("coin"); persist(); }
      }
    }
    function updateCoinsVisual(t) {
      _cq.setFromAxisAngle(_yAxis, t * 3);
      for (var i = 0; i < coins.length; i++) {
        var c = coins[i]; if (!c.alive || c.idx < 0) continue;
        if (c.d < R.d - 15 || c.d > R.d + 160) { coinMesh.setMatrixAt(c.idx, _zero); continue; }
        _cp.set(c.x, c.y + Math.sin(t * 3 + c.d) * .08, c.z); _cm.compose(_cp, _cq, _cs); coinMesh.setMatrixAt(c.idx, _cm);
      }
      coinMesh.instanceMatrix.needsUpdate = true;
    }

    /* ---------- trials: the runner-native activities ---------- */
    var TR = null;
    function laneSet(n) { return n === 3 ? [-1, 0, 1] : n === 2 ? [-1, 1] : [0]; }
    function startPass(site, passNo) {
      var st = STRETCHES[site.k], a = st.data.activity, rnd = seeded(st.id + ":pass" + passNo), type = st.type;
      var keep = TR && TR.k === site.k ? TR : null;
      TR = { k: site.k, type: type, act: a, pass: passNo, rows: [], next: 0, mistakes: 0, charged: false, notes: [], step: 0, picked: [], removed: keep ? keep.removed : [], sorted: keep ? keep.sorted : {}, got: keep ? keep.got : {} };
      var d = site.trialD0 + 22, gap = ROW_GAP[type] || 8, i;
      function shuffle(arr) { var out = arr.slice(); for (var q = out.length - 1; q > 0; q--) { var j = Math.floor(rnd() * (q + 1)); var t = out[q]; out[q] = out[j]; out[j] = t; } return out; }
      function lanesFor(n) { return shuffle(laneSet(n)); }
      switch (type) {
        case "lanes": case "gates":
          var list = type === "lanes" ? a.options : a.paths, live = list.filter(function (o) { return TR.removed.indexOf(o.id) === -1; }), ls = live.length >= 3 ? [-1, 0, 1] : [-1, 1];
          live = shuffle(live);
          TR.rows.push({ d: d + 2, items: live.map(function (o, j) { return { lane: ls[j], id: o.id, label: o.label, ok: o.id === a.answer, hint: o.hint, kind: type === "lanes" ? "rune" : "gateway" }; }) });
          break;
        case "torches":
          shuffle(a.items).forEach(function (it, j) { TR.rows.push({ d: d + j * gap, items: [{ lane: [-1, 1, 0][Math.floor(rnd() * 3)], id: it.id, label: it.label, want: it.lit, kind: "brazier" }] }); });
          break;
        case "planks":
          shuffle(a.planks).forEach(function (pl, j) { TR.rows.push({ d: d + j * gap, plank: pl, items: [{ lane: 0, label: pl.text, kind: "plank" }] }); });
          break;
        case "harvest":
          var good = shuffle(a.items.filter(function (x) { return x.belongs; })), bad = shuffle(a.items.filter(function (x) { return !x.belongs; })), seq = [];
          while (good.length || bad.length) { var pair = []; if (good.length) pair.push(good.shift()); if (bad.length) pair.push(bad.shift()); seq.push(pair); }
          seq.forEach(function (pair, j) { var ls2 = lanesFor(3); TR.rows.push({ d: d + j * gap, items: pair.map(function (it, q) { return { lane: ls2[q], label: it.label, belongs: it.belongs, kind: "token" }; }) }); });
          break;
        case "levers":
          a.items.forEach(function (it, j) {
            var others = a.items.filter(function (x, q) { return q !== j; }), pick = shuffle(others).slice(0, Math.min(2, others.length)), set = shuffle([it].concat(pick)), ls3 = laneSet(set.length);
            TR.rows.push({ d: d + j * gap, step: j, items: set.map(function (x, q) { return { lane: ls3[q], id: x.id, label: x.label, ok: x.id === it.id, kind: "lever" }; }) });
          });
          break;
        case "tiles":
          var binLanes = laneSet(a.bins.length), binOrder = shuffle(a.bins);
          var todo = a.items.filter(function (it, j) { return !TR.sorted[j]; }).map(function (it) { return it; });
          shuffle(todo).forEach(function (it, j) {
            var idx = a.items.indexOf(it);
            TR.rows.push({ d: d + j * gap, item: it, idx: idx, items: [{ lane: 0, label: it.label, kind: "orb" }].concat(binOrder.map(function (bn, q) { return { lane: binLanes[q], label: bn.label, id: bn.id, ok: bn.id === it.bin, kind: "tile" }; })) });
          });
          break;
        case "collect":
          a.items.forEach(function (tok, j) { if (TR.got[j]) return; TR.rows.push({ d: d + TR.rows.length * gap, items: [{ lane: [-1, 0, 1][Math.floor(rnd() * 3)], label: tok, idx: j, kind: "token" }] }); });
          break;
      }
      TR.rows.forEach(function (row) { row.items.forEach(function (it) { var P = takeProp(it.kind); it.prop = P; propAt(P, row.d, it.kind === "orb" || it.kind === "plank" ? 0 : it.lane * LANE); P.board.userData.draw(it.label, it.kind === "orb" ? W3.glow : "#ffcf5a"); if (it.kind === "brazier") { P.core.visible = false; setPropState(P, "idle"); } else setPropState(P, "idle"); if (it.kind === "lever") P.core.rotation.x = .6; }); });
      showTrialCallout();
    }
    function endPassProps() { trialProps.forEach(releaseProp); trialProps = []; }
    function trialMistake(note, revealFn) {
      TR.mistakes++; TR.notes.push(STRICT ? note.split(" — ")[0] : note); reactWrong();
      if (STRICT) { if (!TR.charged) { TR.charged = true; S.results[TR.k].mistakes++; loseTorch(1); } }
      else { S.results[TR.k].mistakes++; loseTorch(1); if (revealFn) revealFn(); }
      setFb(STRICT ? note.split(" — ")[0] : note, "no");
    }
    function rowItemAt(row, lane) { for (var i = 0; i < row.items.length; i++) if (row.items[i].lane === lane && row.items[i].kind !== "orb" && row.items[i].kind !== "plank") return row.items[i]; return null; }
    function popProp(it) { if (!it || !it.prop) return; var P = it.prop; sparkle(P.g.position.x, P.g.position.y + 1.5, P.g.position.z, 2.6); }
    function resolveRow(row) {
      var lane = laneIndex(), a = TR.act, it = rowItemAt(row, lane), right, i;
      switch (TR.type) {
        case "lanes": case "gates":
          var correct = row.items.filter(function (x) { return x.ok; })[0];
          if (it && it.ok) { setPropState(it.prop, "ok"); popProp(it); reactRight(); setFb("Right: " + it.label + ".", "ok"); TR.done = true; liveEnc[TR.k] && (liveEnc[TR.k].prog = 1); }
          else {
            if (it) { setPropState(it.prop, "no"); if (STRICT) TR.removed.push(it.id); }
            trialMistake(it ? (it.label + " is not it." + (it.hint ? " " + it.hint : "")) : "You ran past without choosing a lane.", function () { setPropState(correct.prop, "reveal"); TR.revealed = "The right one was " + correct.label + "."; setFb((it ? it.label + " is not it. " + (it.hint || "") + " " : "") + "The right one: " + correct.label + ".", "no"); });
            if (!STRICT) TR.done = true;
          }
          break;
        case "torches":
          var b2 = row.items[0], lit = lane === b2.lane; b2.lit = lit;
          if (lit) { b2.prop.core.visible = true; sfx("pick"); }
          if (lit === b2.want) { if (!STRICT) { setPropState(b2.prop, "ok"); setFb(b2.label + (lit ? " lit." : " left dark."), "ok"); } }
          else if (STRICT) { TR.wrongT = (TR.wrongT || 0) + 1; }
          else trialMistake(b2.label + (b2.want ? " should be lit." : " should stay dark."), function () { b2.prop.core.visible = b2.want; b2.lit = b2.want; setPropState(b2.prop, "reveal"); });
          break;
        case "planks":
          var pl = row.plank, trusted = R.y < .3, P = row.items[0].prop;
          if (trusted === pl.answer) { setPropState(P, "ok"); if (!STRICT) setFb((pl.answer ? "True: " : "False, jumped: ") + pl.text, "ok"); }
          else {
            setPropState(P, "no"); if (trusted && !pl.answer) R.stumbleT = Math.max(R.stumbleT, .4);
            trialMistake(pl.text + (pl.answer ? ": that one was true" : ": that one was false") + (pl.why ? " — " + pl.why : "."), null);
          }
          break;
        case "harvest":
          row.items.forEach(function (x) {
            if (x === it) { if (x.belongs) { setPropState(x.prop, "ok"); popProp(x); TR.picked.push(x.label); sfx("pick"); } else { setPropState(x.prop, "no"); trialMistake(x.label + " does not belong.", null); } }
            else if (x.belongs) { if (!STRICT) { setPropState(x.prop, "reveal"); trialMistake("You missed " + x.label + "; it belongs.", null); } else { TR.missed = (TR.missed || 0) + 1; TR.charged || (TR.mistakes++, TR.notes.push("You missed a token that belongs.")); setPropState(x.prop, "dim"); } }
            else setPropState(x.prop, "dim");
          });
          break;
        case "levers":
          if (TR.broken) { row.items.forEach(function (x) { setPropState(x.prop, "dim"); }); break; }
          var want = row.items.filter(function (x) { return x.ok; })[0];
          if (it && it.ok) { it.prop.core.rotation.x = -.6; setPropState(it.prop, "ok"); sfx("pick"); TR.step++; if (liveEnc[TR.k]) liveEnc[TR.k].prog = TR.step / a.items.length; setFb(it.label + ": step " + TR.step + " of " + a.items.length + ".", "ok"); }
          else {
            if (it) setPropState(it.prop, "no");
            trialMistake((it ? it.label + " is not next." : "You ran past the levers.") + " — Step " + (row.step + 1) + " is " + want.label + ".", function () { want.prop.core.rotation.x = -.6; setPropState(want.prop, "reveal"); TR.step++; });
            if (STRICT) TR.broken = true;
          }
          break;
        case "tiles":
          var bin = row.items.filter(function (x) { return x.ok; })[0];
          if (it && it.ok) { setPropState(it.prop, "ok"); popProp(it); TR.sorted[row.idx] = true; sfx("pick"); setFb(row.item.label + " → " + it.label + ".", "ok"); }
          else { if (it) setPropState(it.prop, "no"); trialMistake(row.item.label + (it ? " does not go in " + it.label + "." : " needs a tile.") + " — It goes in " + bin.label + ".", function () { setPropState(bin.prop, "reveal"); TR.sorted[row.idx] = true; }); }
          setPropState(row.items[0].prop, "dim");
          break;
        case "collect":
          var tk = row.items[0];
          if (lane === tk.lane) { TR.got[tk.idx] = true; setPropState(tk.prop, "ok"); popProp(tk); sfx("pick"); tk.prop.g.visible = false; var n = Object.keys(TR.got).length; setFb(n + " of " + a.items.length + " votes collected.", "ok"); }
          else setPropState(tk.prop, "dim");
          break;
      }
      showTrialCallout();
    }
    /* the pass ends at the stop line: decide whether the encounter lets the runner through */
    function finishPass() {
      var a = TR.act, ok = true, i;
      switch (TR.type) {
        case "lanes": case "gates": ok = !!TR.done; break;
        case "torches":
          var wrong = TR.rows.filter(function (r) { return !!r.items[0].lit !== r.items[0].want; });
          if (STRICT && wrong.length) { ok = false; if (!TR.charged) { TR.charged = true; S.results[TR.k].mistakes++; loseTorch(1); reactWrong(); } TR.notes.push(wrong.length + (wrong.length > 1 ? " braziers are" : " brazier is") + " wrong: " + wrong.map(function (r) { return r.items[0].label; }).join(", ") + ". Some should be lit, some should stay dark."); wrong.forEach(function (r) { setPropState(r.items[0].prop, "no"); }); }
          break;
        case "planks": ok = TR.mistakes === 0 || !STRICT; break;
        case "harvest":
          if (STRICT && TR.missed && !TR.charged) { TR.charged = true; S.results[TR.k].mistakes++; loseTorch(1); reactWrong(); }
          ok = !STRICT || TR.mistakes === 0; break;
        case "levers": ok = !STRICT || (TR.step >= a.items.length && !TR.broken); break;
        case "tiles": ok = !STRICT || a.items.every(function (it, j) { return TR.sorted[j]; }); break;
        case "collect": a.items.forEach(function (t2, j) { TR.got[j] = true; }); ok = true; break;
      }
      return ok;
    }
    function nextRow() { for (var i = TR.next; i < TR.rows.length; i++) return TR.rows[i]; return null; }
    function laneName(l) { return l < 0 ? "Left" : l > 0 ? "Right" : "Middle"; }
    function showTrialCallout() {
      if (!TR) return; var st = STRETCHES[TR.k], a = TR.act, row = nextRow();
      cKick.textContent = ENCOUNTER_INFO[st.encounter].name + " · " + (TR.pass > 1 ? "try " + TR.pass : "trial");
      cText.textContent = ""; cText.appendChild(rich(a.prompt));
      cBig.textContent = ""; cLanes.textContent = "";
      if (!row) { cBig.textContent = TR.type === "collect" ? "" : "Run on to " + ENCOUNTER_INFO[st.encounter].name.replace(/^(A|The) /, "the ") + "."; return; }
      if (TR.type === "planks") { cBig.textContent = "“" + row.plank.text + "”"; var h2 = el("div", { class: "nthview-lane nthview-empty", text: "True: step on" }); var h3 = el("div", { class: "nthview-lane nthview-empty", text: "False: jump ↑" }); cLanes.appendChild(h2); cLanes.appendChild(el("div")); cLanes.appendChild(h3); return; }
      if (TR.type === "tiles") cBig.textContent = "Where does " + row.item.label + " go?";
      if (TR.type === "levers") cBig.textContent = "Step " + (row.step + 1) + " of " + a.items.length;
      if (TR.type === "torches") cBig.textContent = row.items[0].label + ": light it or pass it?";
      [-1, 0, 1].forEach(function (l) { var x = rowItemAt(row, l); cLanes.appendChild(el("div", { class: "nthview-lane" + (x ? "" : " nthview-empty"), text: x ? x.label : TR.type === "torches" ? "pass by" : "—" })); });
    }
    function setFb(msg, tone) { cFb.className = "nthview-cfb nthview-" + tone; cFb.textContent = msg; }

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
        if (k >= 0) { S.results[k].mistakes += cost; S.results[k].notes.push(plain(msg)); loseTorch(cost); } else S.finale.mistakes += cost;
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
        cont.classList.add("nthview-hidden"); reactRight(); setTimeout(onDone, 1000);
      };
      ctx.finish = function () { if (ctx.finished) return; ctx.finished = true; onDone(); };
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
        var w = box(a.title || "Find it on the carving"); w.appendChild(p("nthview-q", a.prompt));
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
       Flow: lesson -> run -> encounter -> solved -> next lesson ... -> sprint -> report
       ====================================================================== */
    var viewShift = 0, viewShiftT = 0;
    function openPanel(compact, label) {
      panel.classList.toggle("nthview-compact", !!compact); panel.setAttribute("aria-label", label || "Lesson");
      panel.classList.add("nthview-open"); panel.scrollTop = 0; viewShiftT = compact ? .12 : .22; updatePad();
      setTimeout(function () { var f = pbody.querySelector("h2") ? panel : null; if (f) f.focus({ preventScroll: true }); }, 60);
    }
    function closePanel() { panel.classList.remove("nthview-open"); viewShiftT = 0; updatePad(); if (!overlayOpen()) canvas.focus({ preventScroll: true }); }
    function panelOpen() { return panel.classList.contains("nthview-open"); }
    function updatePad() { pad.classList.toggle("nthview-hidden", !settings.buttons || panelOpen() || overlayOpen() || !(S.mode === "run" || S.mode === "sprint")); }
    function showCallout(kick, text, big) { cKick.textContent = kick || ""; cText.textContent = ""; if (text) cText.appendChild(rich(text)); cBig.textContent = big || ""; cLanes.textContent = ""; cFb.textContent = ""; callout.classList.remove("nthview-off"); }
    function hideCallout() { callout.classList.add("nthview-off"); }
    function accentFor(k) { var c = k >= 0 && k < N ? STRETCHES[k].color : null; if (c) panel.style.setProperty("--accent", c); else panel.style.removeProperty("--accent"); }
    function page(kicker, title) { accentFor(S.mode === "sprint" || S.mode === "finale" ? -1 : S.k); pbody.textContent = ""; pbody.appendChild(el("p", { class: "nthview-kicker", text: kicker })); pbody.appendChild(el("h2", { text: title })); }
    function actions(list) { var r = el("div", { class: "nthview-actions" }); list.forEach(function (x) { r.appendChild(x); }); pbody.appendChild(r); return r; }
    function keyHint(text) { return el("span", { class: "nthview-keyhint", text: text }); }
    function loseTorch(n) {
      if (n <= 0) return; S.torches = Math.max(0, S.torches - n); renderTorches(); persist();
      var t = torchRow.children[Math.min(torchRow.children.length - 1, S.torches)]; if (t) { t.classList.remove("nthview-flicker"); void t.offsetWidth; t.classList.add("nthview-flicker"); }
      if (STRICT && S.torches <= 0) caught("The last torch went out.");
    }
    function reactWrong() { var e = liveEnc[S.k]; if (e && S.mode !== "sprint") e.hit(); lunge(2.6); hitFlash(); if (!settings.reduced) shake = .26; sfx("roar"); }
    function reactRight() { CH.gap = Math.min(3.6, CH.gap + .8); sfx("ok"); R.boost = 1.2; }

    function introCard() {
      openOverlay("intro"); ocard.textContent = "";
      ocard.appendChild(el("h1", { text: data.title })); if (data.subtitle) ocard.appendChild(p("nthview-kicker", data.subtitle));
      data.intro.paragraphs.forEach(function (t) { ocard.appendChild(p("nthview-big", t)); });
      if (data.intro.steps && data.intro.steps.length) { ocard.appendChild(p("", "**How it works**")); ocard.appendChild(el("ol", {}, data.intro.steps.map(function (s) { var li = el("li"); li.appendChild(rich(s)); return li; }))); }
      ocard.appendChild(p("nthview-small", "Keys: ← → change lane and take corners, ↑ or Space jumps, ↓ slides, P pauses. On a phone, swipe, or use the arrow buttons."));
      ocard.appendChild(p("nthview-small", STRICT ? "Quiz mode: a wrong answer costs a torch and the answer stays hidden until you find it. If " + chaserName + " catch you, the capture is counted and you resume." : "Learning mode: a wrong answer shows the right one and costs a star, never the run. If " + chaserName + " catch you, the capture is counted and you resume."));
      if (data.intro.note) ocard.appendChild(p("nthview-small", data.intro.note));
      var go = primaryBtn("Start", function () { closeOverlay(); sfx("open"); showLesson(0); });
      ocard.appendChild(el("div", { class: "nthview-actions" }, [go, keyHint("Enter"), restartButton(container, data, KEY)]));
      ocard.lastChild.lastChild.style.marginLeft = "auto";
      setTimeout(function () { go.focus({ preventScroll: true }); }, 60);
    }
    function showLesson(k) {
      S.mode = "lesson"; S.k = k; renderHud(); hideCallout(); updatePad(); persist();
      var st = STRETCHES[k], s = st.data, info = ENCOUNTER_INFO[st.encounter];
      page("Stretch " + (k + 1) + " of " + N, st.name);
      pbody.appendChild(p("nthview-lead", s.lead)); (s.body || []).forEach(function (t) { pbody.appendChild(p("", t)); });
      if (s.findings && !s.findings.after) pbody.appendChild(findingsBox(s.findings));
      var ahead = box("Ahead: " + info.name.charAt(0).toLowerCase() + info.name.slice(1), "nthview-task");
      var at = p("", st.track ? "It sets a trial on the track. " + TYPE_HELP[st.type] : "At the end of this stretch it will ask you about this lesson." + ((s.checks || []).length ? " " + (1 + s.checks.length) + " questions." : "")); at.style.margin = "0"; ahead.appendChild(at);
      pbody.appendChild(ahead);
      var run = primaryBtn("Run ▸", startRun);
      actions([run, keyHint("Enter · ↑ jump · ↓ slide · ← → lanes and corners")]);
      openPanel(false, "Lesson: " + st.name);
    }
    function startRun() {
      closePanel(); S.mode = "run"; S.stumbles = 0; R.startD = R.d; renderHud(); updatePad(); sfx("open"); persist();
      tiles.forEach(function (t) { if (t.k < S.k) t.pinned = false; });
      var prev = liveEnc[S.k - 1]; if (prev && prev.st !== "gone") prev.clear();
      say(hero + " runs. Stretch " + (S.k + 1) + ".");
    }
    function arrive(site) {
      R.speed = 0; R.d = site.stopD; S.mode = "stop"; updatePad();
      var st = STRETCHES[site.k];
      site.enc.enter();
      var trialNotes = [];
      if (TR && TR.k === site.k) {
        var ok = finishPass(); trialNotes = TR.notes.slice();
        if (!ok) { var tr = TR; setTimeout(function () { if (S.mode === "stop") showRetry(site, tr); }, 900); return; }
        endPassProps(); S.trialNotes = trialNotes; if (st.type === "collect") S.collected = st.data.activity.items.slice(); TR = null;
      } else S.trialNotes = [];
      hideCallout();
      S.steps = buildSteps(st); S.stepI = 0;
      setTimeout(function () { if (S.mode !== "stop") return; if (S.steps.length) showStep(site.k, 0); else solve(site.k); }, st.track ? 500 : 1100);
    }
    function showRetry(site, tr) {
      endPassProps(); hideCallout();
      var st = STRETCHES[site.k], info = ENCOUNTER_INFO[st.encounter];
      page("Stretch " + (site.k + 1) + " · trial", "Not yet");
      pbody.appendChild(p("nthview-lead", info.no + " " + info.name + " sends " + hero + " back to the start of the trial."));
      if (tr.notes.length) pbody.appendChild(el("ul", {}, tr.notes.filter(function (n, i, arr) { return arr.indexOf(n) === i; }).map(function (n) { var li = el("li"); li.appendChild(rich(n)); return li; })));
      pbody.appendChild(p("nthview-cap", st.data.activity.prompt));
      actions([primaryBtn("Run the trial again", function () { retryPass(site, tr); }), keyHint("Enter")]);
      openPanel(false, "Trial result");
    }
    function retryPass(site, tr) {
      closePanel(); fade(true);
      setTimeout(function () {
        R.d = site.trialD0 + 3; R.speed = 4; R.lane = 0; R.lat = 0; R.y = 0; R.vy = 0; R.slide = 0; site.enc.prog = 0;
        TR = tr; startPass(site, tr.pass + 1); snapCamera(); S.mode = "run"; updatePad(); fade(false);
      }, 380);
    }
    function buildSteps(st) {
      var s = st.data, steps = [];
      if (!s.activity) steps.push({ quiz: s.quiz });
      else if (st.type === "collect") steps.push({ collect: s.activity, quiz: s.quiz });
      else if (!st.track) steps.push({ act: s.activity, quiz: s.quiz });
      (s.checks || []).forEach(function (c) { steps.push({ act: c }); });
      return steps;
    }
    function showStep(k, i) {
      var st = STRETCHES[k], steps = S.steps, info = ENCOUNTER_INFO[st.encounter];
      if (i >= steps.length) { solve(k); return; }
      S.mode = "stop"; S.stepI = i;
      var step = steps[i];
      page("Stretch " + (k + 1) + " · " + info.name + (steps.length > 1 ? " · question " + (i + 1) + " of " + steps.length : ""), i === 0 ? info.name : "One more question");
      if (i === 0) pbody.appendChild(p("nthview-lead", info.line + " It will let " + hero + " pass if you answer."));
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
      openPanel(false, info.name);
    }
    function solve(k) {
      var r = S.results[k]; r.done = true; r.stars = starsFor(r.mistakes); renderScore(); persist();
      var e = liveEnc[k]; if (e) e.clear();
      closePanel(); S.mode = "solved"; sfx("grind"); CH.gap = 9;
      var st = STRETCHES[k]; say(ENCOUNTER_INFO[st.encounter].ok);
      showCallout(ENCOUNTER_INFO[st.encounter].name, ENCOUNTER_INFO[st.encounter].ok, starsText(r.stars));
      setTimeout(function () { hideCallout(); showSolved(k); }, settings.reduced ? 500 : 1700);
    }
    function showSolved(k) {
      var st = STRETCHES[k], s = st.data, r = S.results[k];
      page("Stretch " + (k + 1) + " of " + N + " · cleared", "The way is open");
      pbody.appendChild(el("p", { class: "nthview-stars", "aria-label": r.stars + " of 3 stars", text: starsText(r.stars) }));
      if (S.trialNotes && S.trialNotes.length && !STRICT) { var tb = box("What the trial showed"); tb.appendChild(el("ul", {}, S.trialNotes.map(function (n) { var li = el("li"); li.appendChild(rich(n)); return li; }))); pbody.appendChild(tb); }
      if (s.findings && s.findings.after) pbody.appendChild(findingsBox(s.findings));
      if (s.aside) { var ad = box(s.aside.title); var at = p("", s.aside.text); at.style.margin = "0"; ad.appendChild(at); pbody.appendChild(ad); }
      var rem = el("div", { class: "nthview-remember" }, [el("p", { class: "nthview-box-title", text: "Remember" })]); var rt = p("", s.remember); rt.style.margin = "0"; rem.appendChild(rt); pbody.appendChild(rem);
      var nxt = k < N - 1 ? primaryBtn("Next: " + STRETCHES[k + 1].name, function () { showLesson(k + 1); }) : primaryBtn("On to " + data.finale.name, showFinaleIntro);
      actions([nxt, keyHint("Enter")]);
      openPanel(false, "Stretch cleared");
    }
    function pickFinale() {
      var qs = data.finale.questions, n = Math.min(data.finale.ask || 5, qs.length), idx = shuffledIdx(qs.length, data.title + ":finale:" + S.runSeed);
      if (qs.length === 1) idx = [0];
      return idx.slice(0, n).map(function (i) { return qs[i]; });
    }
    function showFinaleIntro() {
      S.mode = "finale"; S.k = N; renderHud(); S.finale.list = pickFinale(); var from = Math.min(S.finale.i || 0, S.finale.list.length - 1); persist();
      page("Final sprint", data.finale.name);
      pbody.appendChild(p("nthview-lead", data.finale.lead));
      pbody.appendChild(p("nthview-cap", S.finale.list.length + " question" + (S.finale.list.length > 1 ? "s" : "") + " while you run. Right answers are bursts of speed."));
      actions([primaryBtn("Sprint! ▸", startSprint), keyHint("Enter")]);
      openPanel(false, "Final sprint");
    }
    function startSprint() {
      closePanel(); S.mode = "sprint"; tiles.forEach(function (t) { t.pinned = false; }); var e = liveEnc[N - 1]; if (e && e.st !== "gone") e.clear(); renderHud(); updatePad();
      var from = Math.min(S.finale.i || 0, Math.max(0, S.finale.list.length - 1));
      setTimeout(function () { finaleQ(from); }, settings.reduced ? 300 : 1400);
    }
    function finaleQ(i) {
      if (S.mode !== "sprint" || S.paused) { if (S.mode === "sprint") S.pendingQ = i; return; }
      var list = S.finale.list;
      if (i >= list.length) { S.finale.done = true; S.finale.i = list.length; persist(); closePanel(); toast("Run for the light!", 1600); say("Run for the light!"); updatePad(); return; }
      S.finale.i = i; hFill2.style.width = (100 * i / list.length) + "%"; persist();
      page(data.finale.name + " · question " + (i + 1) + " of " + list.length, "Keep running!");
      var host = el("div"); pbody.appendChild(host);
      wChoice(host, list[i], qctx(-1, function () { finaleQ(i + 1); }), null);
      openPanel(true, "Final sprint question");
    }
    function reachedExit() {
      S.mode = "exit"; hFill2.style.width = "100%"; sfx("win"); fade(true, true);
      setTimeout(function () { showReport(); fade(false, true); }, 900);
    }
    function resultsList(host, items, render1) {
      var ul = el("ul", { class: "nthview-results" }), shown = 0, more = btn("Show more", "", function () { add(); });
      function add() { var end = Math.min(items.length, shown + 50); for (; shown < end; shown++) ul.appendChild(render1(items[shown], shown)); more.classList.toggle("nthview-hidden", shown >= items.length); more.textContent = "Show " + Math.min(50, items.length - shown) + " more"; }
      host.appendChild(ul); host.appendChild(more); add();
    }
    function showReport() {
      S.mode = "report"; closePanel(); hideCallout(); updatePad(); openOverlay("report"); ocard.textContent = ""; saveNow();
      ocard.appendChild(el("div", { class: "nthview-actions" }, [restartButton(container, data, KEY)])); ocard.lastChild.style.cssText = "margin:0 0 8px;justify-content:flex-end";
      var r = data.report, tiers = r.tiers || {}, fin = starsFor(S.finale.mistakes), st = totalStars() + fin, max = 3 * (N + 1);
      var firstTry = S.results.filter(function (x) { return x.mistakes === 0; }).length;
      ocard.appendChild(el("h1", { text: r.heading }));
      ocard.appendChild(el("div", { class: "nthview-scorecard" }, [
        el("div", {}, [doc.createTextNode("★ Stars"), el("b", { text: st + " / " + max })]),
        el("div", {}, [doc.createTextNode("First try"), el("b", { text: firstTry + " / " + N })]),
        el("div", {}, [doc.createTextNode("◉ Coins"), el("b", { text: String(S.coins) })]),
        el("div", {}, [doc.createTextNode("✋ Captured"), el("b", { text: String(S.caughtCount) })])
      ].concat(STRICT ? [el("div", {}, [doc.createTextNode("Torches left"), el("b", { text: S.torches + " / " + START_TORCHES })])] : [])));
      ocard.appendChild(p("nthview-big", st === max ? (tiers.perfect || "Every answer right first time.") : st >= max * .8 ? (tiers.great || "A great run.") : (tiers.pass || "You made it out! Run it again to earn more stars.")));
      ocard.appendChild(p("", "**What you learned**"));
      ocard.appendChild(el("ol", {}, r.lessons.map(function (l) { var li = el("li"); li.appendChild(rich(l)); return li; })));
      var det = el("details", { class: "nthview-more" }); if (N <= 12) det.setAttribute("open", "");
      det.appendChild(el("summary", { text: "Every stretch and its takeaway (" + N + ")" }));
      resultsList(det, STRETCHES, function (s2, i) { var res = S.results[i]; return el("li", {}, [el("span", { class: "nthview-rs", "aria-label": res.stars + " stars", text: starsText(res.stars) }), el("span", { class: "nthview-rt" }, [el("b", { text: (i + 1) + ". " + s2.name }), el("span", { class: "nthview-note", text: plain(s2.data.remember) })])]); });
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
      var again = primaryBtn("Run it again", restartAll);
      ocard.appendChild(el("div", { class: "nthview-actions" }, [again]));
      setTimeout(function () { again.focus({ preventScroll: true }); }, 60);
    }
    /* being caught never blocks: the capture plays, a card counts it, and Resume continues from just before */
    var capture = null;
    function caught(reason) {
      if (S.mode === "caught") return;
      capture = { mode: S.mode, panel: panelOpen(), compact: panel.classList.contains("nthview-compact"), callout: !callout.classList.contains("nthview-off"), d: R.d };
      S.mode = "caught"; S.caughtCount++; renderScore(); CH.pounce = 1; R.speed = 0; panel.classList.remove("nthview-open"); viewShiftT = 0; hideCallout(); updatePad(); sfx("roar"); hitFlash(); if (!settings.reduced) shake = .4;
      saveNow();
      setTimeout(function () {
        openOverlay("caught"); ocard.textContent = "";
        ocard.appendChild(el("h1", { text: "Captured" }));
        ocard.appendChild(p("nthview-big", chaserName.charAt(0).toUpperCase() + chaserName.slice(1) + " caught " + hero + ". " + reason));
        ocard.appendChild(el("p", { class: "nthview-readout", text: "Captured " + S.caughtCount + (S.caughtCount === 1 ? " time" : " times") + " so far" }));
        ocard.appendChild(p("nthview-small", hero + " wriggles free and runs on from just before the spot" + (STRICT && S.torches <= 0 ? ", with the torches lit again" : "") + ". Nothing you answered is lost."));
        var go = primaryBtn("Resume", resumeCapture);
        ocard.appendChild(el("div", { class: "nthview-actions" }, [go, keyHint("Enter"), restartButton(container, data, KEY)]));
        ocard.lastChild.lastChild.style.marginLeft = "auto";
        setTimeout(function () { go.focus({ preventScroll: true }); }, 60);
      }, settings.reduced ? 250 : 1200);
    }
    function resumeCapture() {
      if (!capture) return; var c = capture; capture = null;
      closeOverlay(); CH.pounce = 0; CH.gap = 9; S.stumbles = 0; R.stumbleT = 0;
      if (STRICT && S.torches <= 0) { S.torches = START_TORCHES; renderTorches(); }
      S.mode = c.mode;
      if (c.mode === "run" || c.mode === "sprint") {
        var site = sites[S.k];
        R.d = Math.max(R.startD, c.d - 6, site && site.trialD0 !== null && TR && TR.k === site.k ? site.trialD0 : -1e9);
        R.speed = 0; R.y = 0; R.vy = 0; R.slide = 0; R.lane = laneIndex(); hazards.forEach(function (h) { if (h.d >= R.d - .5 && h.d <= c.d + 1) h.done = true; });
        if (c.callout) callout.classList.remove("nthview-off");
        if (S.mode === "sprint" && !S.finale.done && !panelOpen()) finaleQ(S.finale.i);
      }
      if (c.panel) { panel.classList.toggle("nthview-compact", c.compact); panel.classList.add("nthview-open"); viewShiftT = c.compact ? .12 : .22; }
      updatePad(); persist(); if (!panelOpen()) canvas.focus({ preventScroll: true });
    }
    function restartStretch(k) {
      fade(true);
      setTimeout(function () {
        closePanel(); hideCallout(); clearWorld(); TR = null; S.paused = false;
        newGen(k, true);
        R.d = 11; R.lat = 0; R.lane = 0; R.y = 0; R.vy = 0; R.slide = 0; R.stumbleT = 0; R.speed = 0; R.snapX = R.snapZ = 0; R.blocked = null; R.yaw = 0;
        S.stumbles = 0; if (STRICT) S.torches = START_TORCHES; renderTorches(); CH.gap = 9; CH.pounce = 0; S.finale.done = false; S.finale.i = 0;
        S.results[k].notes = []; S.results[k].done = false;
        updateWorld(); snapCamera(); fade(false); showLesson(k);
      }, 380);
    }
    function restartAll() {
      clearState(KEY); closeOverlay(); S.runSeed++; S.coins = 0; S.torches = START_TORCHES; S.caughtCount = 0;
      S.results = STRETCHES.map(function () { return { mistakes: 0, done: false, stars: 0, notes: [] }; }); S.finale = { list: [], i: 0, mistakes: 0, done: false };
      renderScore(); hFill2.style.width = "0%"; restartStretch(0);
    }
    function fade(on, white) { fadeEl.classList.toggle("nthview-white", !!white); fadeEl.classList.toggle("nthview-on", !!on); }

    /* ---------- overlays: intro, pause, caught, report ---------- */
    var overlayKind = null;
    function openOverlay(kind) { overlayKind = kind; overlay.classList.remove("nthview-hidden"); ocard.setAttribute("aria-label", kind); updatePad(); }
    function closeOverlay() { overlayKind = null; overlay.classList.add("nthview-hidden"); updatePad(); }
    function overlayOpen() { return overlayKind !== null; }
    function toggleBtn(label, on, fn) { var b = el("button", { type: "button", class: "nthview-btn", "aria-pressed": String(on), text: label + (on ? ": on" : ": off") }); b.addEventListener("click", function () { on = !on; b.setAttribute("aria-pressed", String(on)); b.textContent = label + (on ? ": on" : ": off"); fn(on); }); return b; }
    function pause() {
      if (S.paused || overlayOpen() || S.mode === "report" || S.mode === "caught") return;
      S.paused = true; openOverlay("pause"); ocard.textContent = "";
      ocard.appendChild(el("h2", { text: "Paused" }));
      ocard.appendChild(p("nthview-small", (S.mode === "sprint" ? data.finale.name : "Stretch " + (Math.min(S.k, N - 1) + 1) + " of " + N + ": " + STRETCHES[Math.min(S.k, N - 1)].name) + " · ★ " + totalStars() + (STRICT ? " · " + S.torches + " torches · quiz mode" : "")));
      var resumeB = primaryBtn("Resume", resume);
      var menu = el("div", { class: "nthview-menu" }, [resumeB]);
      if (S.k < N && S.mode !== "sprint") menu.appendChild(btn("Restart this stretch", "", function () { closeOverlay(); S.paused = false; restartStretch(Math.min(S.k, N - 1)); }));
      menu.appendChild(toggleBtn("On-screen arrows", settings.buttons, function (v) { settings.buttons = v; persist(); }));
      menu.appendChild(toggleBtn("Reduced motion", settings.reduced, function (v) { settings.reduced = v; persist(); }));
      menu.appendChild(toggleBtn("Sound", settings.sound, function (v) { settings.sound = v; persist(); }));
      menu.appendChild(restartButton(container, data, KEY));
      ocard.appendChild(menu);
      var done = STRETCHES.filter(function (s2, i) { return S.results[i].done; });
      var det = el("details", { class: "nthview-more" }); det.appendChild(el("summary", { text: "Review so far (" + done.length + " of " + N + " stretches)" }));
      if (done.length) resultsList(det, done, function (s2) { var res = S.results[s2.idx]; return el("li", {}, [el("span", { class: "nthview-rs", text: starsText(res.stars) }), el("span", { class: "nthview-rt" }, [el("b", { text: (s2.idx + 1) + ". " + s2.name }), el("span", { class: "nthview-note", text: plain(s2.data.remember) })])]); });
      else det.appendChild(p("nthview-small", "Nothing cleared yet. The takeaways collect here as you run."));
      ocard.appendChild(det);
      setTimeout(function () { resumeB.focus({ preventScroll: true }); }, 60);
    }
    function resume() {
      if (!S.paused) return; S.paused = false; closeOverlay(); last = 0; updatePad(); schedule();
      if (S.pendingQ !== undefined && S.pendingQ !== null) { var q = S.pendingQ; S.pendingQ = null; finaleQ(q); }
      if (!panelOpen()) canvas.focus({ preventScroll: true });
    }
    pauseBtn.addEventListener("click", function () { if (S.paused) resume(); else pause(); });

    /* ======================================================================
       The frame loop. Fixed temporaries, clamped delta time, no allocation.
       ====================================================================== */
    var camPos = new THREE.Vector3(0, 3, 8), camLook = new THREE.Vector3(), camLookS = new THREE.Vector3(0, 1, -6), camYaw = 0, T = 0;
    var TRIAL_SPEED = { lanes: 6.5, gates: 6.5, torches: 6.2, planks: 5.0, harvest: 6.2, levers: 6.0, tiles: 5.6, collect: 7.0 };
    var SPEED_CAP = 15;
    function angDiff(a, b) { var d = a - b; return Math.atan2(Math.sin(d), Math.cos(d)); }
    function pulled() { return S.mode === "lesson" || S.mode === "stop" || S.mode === "solved" || S.mode === "finale" || S.mode === "caught" || S.mode === "intro"; }
    /* the camera rides the path itself a few metres behind the runner, so it follows corners and never ends up behind a wall */
    function camTargets(out, look) {
      var pb = pulled(), dist = pb ? 7.4 : 5.4, hgt = pb ? 3.6 : 2.85, la = pb ? 12 : 8;
      pathPos(R.d - dist, R.lat * .45, _cp2);
      out.set(_cp2.x, hgt + R.y * .35, _cp2.z);
      pathPos(R.d, R.lat * .6, _rp);
      var fx = -Math.sin(camYaw), fz = -Math.cos(camYaw);
      look.set(_rp.x + R.snapX + fx * la, pb ? 1.5 : 1.05 + R.y * .3, _rp.z + R.snapZ + fz * la);
    }
    var _ct = new THREE.Vector3(), _lt = new THREE.Vector3();
    function snapCamera() { camYaw = headingYaw(legAt(R.d + 3).h); R.yaw = camYaw; camTargets(camPos, camLookS); camera.position.copy(camPos); camera.lookAt(camLookS); }

    function step(dt, now) {
      T += dt; var t = T;
      updateWorld();
      var site = sites[S.k], st = STRETCHES[Math.min(S.k, N - 1)];
      /* ---- speed ---- */
      var target = 0;
      if (S.mode === "run") {
        target = Math.min(SPEED_CAP, 9.2 + Math.min(5, S.k * .28) + Math.min(1.6, (R.d - R.startD) / RUN_LEN * 1.6));
        if (site) {
          if (site.trialD0 !== null && R.d >= site.trialD0 - 8) target = TRIAL_SPEED[st.type] || 6;
          var rem = site.stopD - R.d; if (rem < 18) target = Math.min(target, Math.sqrt(Math.max(0, 2 * 6.5 * rem)) + .25);
        }
      } else if (S.mode === "sprint") target = S.finale.done ? 20 : 14;
      else if (S.mode === "exit") target = 12;
      if (R.boost > 0) { R.boost -= dt; if (S.mode === "sprint") target += 4; }
      if (R.stumbleT > 0) target *= .55;
      if (target < R.speed) R.speed = Math.max(target, R.speed - 16 * dt); else R.speed = Math.min(target, R.speed + 5.5 * dt);
      var prevD = R.d;
      R.d += R.speed * dt;
      if (S.mode === "run" && site && R.d >= site.stopD - .03) { R.d = site.stopD; arrive(site); }
      /* ---- vertical motion, lanes ---- */
      R.vy -= 24 * dt; R.y += R.vy * dt; if (R.y <= 0) { R.y = 0; R.vy = 0; }
      if (R.slide > 0) R.slide -= dt; if (R.stumbleT > 0) R.stumbleT -= dt;
      R.lat += (R.lane * LANE - R.lat) * (1 - Math.exp(-dt * 13));
      /* ---- corners ---- */
      var c = nextCorner();
      if (c && R.d >= c.d && prevD < c.d + 50) {
        c.done = true;
        var oldLeg = legAt(c.d - .001), odx = DIRX[oldLeg.h], odz = DIRZ[oldLeg.h], so = R.d - oldLeg.d0;
        var ox = oldLeg.x0 + odx * so - odz * R.lat, oz = oldLeg.z0 + odz * so + odx * R.lat; pathPos(R.d, R.lat, _rp);
        R.snapX += ox - _rp.x; R.snapZ += oz - _rp.z;
        if (!c.queued && (S.mode === "run")) stumble("the turn");
        turnHint.classList.remove("nthview-show");
      } else if (c && c.d - R.d < 24 && !c.queued && S.mode === "run") {
        if (!c.hinted) { c.hinted = true; turnHint.textContent = c.dir < 0 ? "↰" : "↱"; say("Turn " + (c.dir < 0 ? "left" : "right") + " ahead"); }
        turnHint.classList.toggle("nthview-show", c.d - R.d < 20);
      }
      R.snapX *= Math.exp(-dt * 7); R.snapZ *= Math.exp(-dt * 7);
      /* ---- hazards, coins, encounter, trial ---- */
      if (S.mode === "run" || S.mode === "sprint") { checkHazards(prevD); checkCoins(); }
      if (S.mode === "run" && site) {
        var annD = site.trialD0 !== null ? site.trialD0 - 30 : site.stopD - 60;
        if (!site.announced && R.d >= annD) {
          site.announced = true; site.enc.enter(); sfx(st.encounter === "gate" || st.encounter === "bridge" ? "grind" : "roar");
          var info = ENCOUNTER_INFO[st.encounter];
          showCallout(info.name + " ahead", info.line, st.track ? TYPE_HELP[st.type] : "Run to it. It asks about this stretch."); say(info.name + " ahead. " + info.line);
        }
        if (site.trialD0 !== null && (!TR || TR.k !== site.k) && R.d >= site.trialD0) startPass(site, 1);
        if (TR && TR.k === site.k) { while (TR && TR.next < TR.rows.length && R.d >= TR.rows[TR.next].d) { var row = TR.rows[TR.next++]; resolveRow(row); } }
      }
      if (S.mode === "sprint" && S.finale.done && gen.exitD && R.d >= gen.exitD - 1) reachedExit();
      hFill2.style.width = (S.mode === "run" && site ? Math.max(0, Math.min(100, 100 * (R.d - R.startD) / Math.max(1, site.stopD - R.startD))) : S.mode === "lesson" ? 0 : S.mode === "sprint" ? 100 * S.finale.i / Math.max(1, S.finale.list.length) : 100) + "%";
      /* ---- runner ---- */
      var leg = pathPos(R.d, R.lat, _rp), wantYaw = headingYaw(leg.h);
      R.yaw += angDiff(wantYaw, R.yaw) * (1 - Math.exp(-dt * 12));
      runner.g.position.set(_rp.x + R.snapX, R.y, _rp.z + R.snapZ); runner.g.rotation.y = R.yaw;
      runner.shadow.position.set(runner.g.position.x, .03, runner.g.position.z); var shs = Math.max(.5, 1.3 - R.y * .35); runner.shadow.scale.set(shs, shs, 1);
      poseRunner(dt, t);
      /* ---- chasers ---- */
      if (CH.pounce > 0) CH.gap += (0.4 - CH.gap) * (1 - Math.exp(-dt * 6));
      else CH.gap += (chaserTarget() - CH.gap) * (1 - Math.exp(-dt * (CH.gap > 3.2 ? .9 : .35)));
      var chSpeed = S.mode === "run" || S.mode === "sprint" || S.mode === "exit" ? R.speed : 0;
      CH.ph += dt * (3 + chSpeed * .62);
      dFill.style.width = Math.max(0, Math.min(100, (3.4 - CH.gap) / 2.2 * 100)) + "%";
      for (var i = 0; i < chasers.length; i++) {
        var J = chasers[i], cd = R.d - CH.gap - CH_OFF[i] + (CH.pounce > 0 ? CH_OFF[i] * .8 : 0), cl = (CH.pounce > 0 ? R.lat * .6 + CH_LAT[i] * .4 : CH_LAT[i] + Math.sin(t * .8 + i * 2) * .25);
        var cleg = pathPos(cd, cl, _cp2), cy = headingYaw(cleg.h);
        J.yaw = J.yaw === undefined ? cy : J.yaw + angDiff(cy, J.yaw) * (1 - Math.exp(-dt * 8));
        J.g.position.set(_cp2.x, 0, _cp2.z); J.g.rotation.y = J.yaw; J.g.visible = cd > (legs[0].d0 + .5) && S.mode !== "report" && CH.gap + CH_OFF[i] < 4.2;
        J.shadow.position.set(_cp2.x, .03, _cp2.z); J.shadow.visible = J.g.visible;
        animChaser(J, CH.ph + i * 1.9, chSpeed, t + i);
      }
      /* ---- encounters, props, flames ---- */
      for (var ek in liveEnc) updateEncounter(liveEnc[ek], dt, t);
      for (var ti = 0; ti < tiles.length; ti++) { var tp = tiles[ti].parts; for (var pi = 0; pi < tp.length; pi++) { var fl = tp[pi].userData.flames; if (fl && fl.length) for (var fi = 0; fi < fl.length; fi++) fl[fi].scale.y = fl[fi].userData.base * (.82 + Math.sin(t * 12 + fl[fi].userData.ph) * .14 + Math.sin(t * 31 + fi) * .05); } }
      for (var q = 0; q < trialProps.length; q++) {
        var P = trialProps[q]; if (!P.g.visible) continue;
        if (P.board.visible && P.d !== undefined && P.d < R.d + 2.2) P.board.visible = false;
        if ((P.kind === "token" || P.kind === "orb") && P.d !== undefined && P.d < R.d - .4) { P.g.visible = false; continue; }
        if (P.kind === "rune" || P.kind === "orb") P.core.rotation.y = t * 1.6; if (P.kind === "rune") P.core.position.y = 1.5 + Math.sin(t * 2.5 + q) * .12;
        if (P.kind === "token") P.core.rotation.z = t * 3;
        if (P.kind === "brazier" && P.core.visible) { var bf = P.flames[0]; bf.scale.y = bf.userData.base * (.85 + Math.sin(t * 13 + q) * .15); }
        if (P.fx > 0) { P.fx = Math.max(0, P.fx - dt * 2); if (P.state === "ok" && (P.kind === "rune" || P.kind === "token")) P.g.scale.setScalar(1 + (1 - P.fx) * .25); }
      }
      updateSparks(dt);
      waterTex.offset.y -= dt * 1.1;
      updateCoinsVisual(t);
      updateCamera(dt, t);
      updateAmbient(dt, t);
    }
    var _rPose = {};
    function lerpRot(o, x, k) { o.rotation.x += (x - o.rotation.x) * k; }
    function poseRunner(dt, t) {
      var J = runner, k = 1 - Math.exp(-dt * 16), sp = R.speed, moving = sp > .3, ph;
      R.ph += dt * (1.7 + sp * .13) * Math.PI * 2 * (moving ? 1 : 0); ph = R.ph;
      var s = Math.sin(ph), aLx, aRx, lLx, lRx, kLx, kRx, tor = 0, hy = .98, fL = -.5, fR = -.5;
      if (R.y > .05) { lLx = .95; kLx = -1.5; lRx = .25; kRx = -.9; aLx = 2.4; aRx = 2.0; tor = -.1; fL = -.3; fR = -.3; }
      else if (R.slide > 0) { lLx = 1.45; kLx = -.15; lRx = 1.25; kRx = -.5; aLx = -.7; aRx = -.5; tor = .95; hy = .42; }
      else if (moving) { lLx = s * .95; lRx = -s * .95; kLx = -Math.max(0, Math.sin(ph - 1.3)) * 1.5 - .1; kRx = -Math.max(0, Math.sin(ph - 1.3 + Math.PI)) * 1.5 - .1; aLx = -s * 1.0; aRx = s * 1.0; tor = -.2; hy = .98 + Math.abs(Math.cos(ph)) * .07; fL = -.9; fR = -.9; }
      else { lLx = 0; lRx = 0; kLx = 0; kRx = 0; aLx = Math.sin(t * 1.4) * .05; aRx = -aLx; tor = Math.sin(t * 1.8) * .03; hy = .98 + Math.sin(t * 2) * .01; fL = -.25; fR = -.25; }
      if (R.stumbleT > 0) { var sk = Math.sin(R.stumbleT * 9); tor = -.75 + sk * .1; aLx = 2.6 + sk; aRx = -1 - sk; }
      if (S.mode === "caught") { tor = .4; aLx = 3; aRx = 3; }
      lerpRot(J.legL, lLx, k); lerpRot(J.legR, lRx, k); lerpRot(J.kneeL, kLx, k); lerpRot(J.kneeR, kRx, k); lerpRot(J.armL, aLx, k); lerpRot(J.armR, aRx, k); lerpRot(J.foreL, fL, k); lerpRot(J.foreR, fR, k); lerpRot(J.torso, tor, k);
      J.hips.position.y += (hy - J.hips.position.y) * k;
      J.head.rotation.y = !moving && pulled() ? Math.sin(t * .6) * .35 : 0;
    }
    function updateCamera(dt, t) {
      var wantYaw = headingYaw(legAt(R.d + (pulled() ? 0 : 2.5)).h), dy = angDiff(wantYaw, camYaw);
      camYaw += dy * (1 - Math.exp(-dt * (settings.reduced ? 4 : 5.5)));
      camTargets(_ct, _lt);
      var kp = 1 - Math.exp(-dt * (pulled() ? 2.6 : 7));
      camPos.lerp(_ct, kp); camLookS.lerp(_lt, 1 - Math.exp(-dt * 8));
      camera.position.copy(camPos);
      if (!settings.reduced && (S.mode === "run" || S.mode === "sprint") && R.y === 0 && R.speed > 1) { camera.position.y += Math.abs(Math.sin(R.ph)) * .07 - .035; camera.position.x += Math.sin(R.ph) * .025; }
      if (shake > 0) { shake = Math.max(0, shake - dt); if (!settings.reduced) { camera.position.x += (Math.random() - .5) * shake * .5; camera.position.y += (Math.random() - .5) * shake * .4; } }
      camera.lookAt(camLookS);
      if (!settings.reduced) camera.rotateZ(Math.max(-.12, Math.min(.12, dy * .22)) + (R.lane * LANE - R.lat) * -.012);
      viewShift += (viewShiftT - viewShift) * (1 - Math.exp(-dt * 5));
      if (viewShift > .002) camera.setViewOffset(VW(), VH(), 0, VH() * viewShift, VW(), VH()); else if (camera.view && camera.view.enabled) camera.clearViewOffset();
    }
    function wrap(v, c, half) { var d = v - c; if (d > half) return v - half * 2; if (d < -half) return v + half * 2; return v; }
    function updateAmbient(dt, t) {
      var cp = camera.position;
      sky.position.copy(cp); if (starPts) starPts.position.copy(cp);
      mountains.position.set(cp.x, 0, cp.z); abyss.position.set(cp.x, -34, cp.z);
      for (var i = 0; i < mists.length; i++) { var m = mists[i], u = m.userData; m.position.set(wrap(cp.x + u.ox + t * u.v, cp.x, 110), u.y, wrap(cp.z + u.oz + t * u.v * .4, cp.z, 110)); u.ox = m.position.x - cp.x - t * u.v; u.oz = m.position.z - cp.z - t * u.v * .4; }
      var kind = W3.particle, rm = settings.reduced ? .4 : 1;
      for (var j = 0; j < PCOUNT; j++) {
        var o = j * 3, vx = pVel[o], vy = pVel[o + 1], vz = pVel[o + 2];
        if (kind === "snow") { pArr[o] += (vx * .6 + Math.sin(t + j) * .3) * dt * rm; pArr[o + 1] -= (1.2 + vy * .4) * dt * rm; pArr[o + 2] += vz * .5 * dt * rm; }
        else if (kind === "sand") { pArr[o] += (5 + vx * 2) * dt * rm; pArr[o + 1] += vy * .4 * dt * rm; pArr[o + 2] += (1 + vz) * dt * rm; }
        else if (kind === "wisps") { pArr[o] += Math.sin(t * .5 + j) * .25 * dt; pArr[o + 1] += (.25 + vy * .1) * dt * rm; pArr[o + 2] += Math.cos(t * .4 + j) * .25 * dt; }
        else { pArr[o] += Math.sin(t * .7 + j * 1.3) * .35 * dt * rm; pArr[o + 1] += Math.cos(t * .9 + j) * .2 * dt * rm; pArr[o + 2] += Math.sin(t * .6 + j * .7) * .35 * dt * rm; }
        pArr[o] = wrap(pArr[o], cp.x, 22); pArr[o + 2] = wrap(pArr[o + 2], cp.z, 30);
        var ly = pArr[o + 1] - cp.y; if (ly < -6) pArr[o + 1] += 16; else if (ly > 10) pArr[o + 1] -= 16;
      }
      pGeo.attributes.position.needsUpdate = true;
    }

    /* ---------- loop control: pauses when hidden, resumes cleanly ---------- */
    var rafId = 0, last = 0, alive = true, perfAcc = 0, perfN = 0, pausedFrames = 0;
    function frame(now) {
      rafId = 0;
      if (!alive) return;
      if (!canvas.isConnected) { dispose(); return; }
      var dt = last ? Math.min(.05, Math.max(0, (now - last) / 1000)) : 1 / 60; last = now;
      if (!S.paused) { pausedFrames = 0; step(dt, now); }
      if (!S.paused || pausedFrames++ < 2) renderer.render(scene, camera);
      perfAcc += dt; perfN++;
      if (perfN >= 120) { var avg = perfAcc / perfN; if (avg > .026 && pixelRatio > 1) { pixelRatio = Math.max(1, pixelRatio - .25); renderer.setPixelRatio(pixelRatio); renderer.setSize(VW(), VH(), false); } perfAcc = 0; perfN = 0; }
      schedule();
    }
    function schedule() { if (!rafId && alive && !doc.hidden) rafId = root.requestAnimationFrame(frame); }
    function onVisibility() {
      if (doc.hidden) { saveNow(); if (rafId) { root.cancelAnimationFrame(rafId); rafId = 0; } if ((S.mode === "run" || S.mode === "sprint") && !S.paused) pause(); }
      else { last = 0; schedule(); }
    }
    function dispose() {
      alive = false; if (rafId) root.cancelAnimationFrame(rafId);
      root.removeEventListener("keydown", onKey); doc.removeEventListener("visibilitychange", onVisibility); root.removeEventListener("pagehide", saveNow);
      if (ro) ro.disconnect(); else root.removeEventListener("resize", onResize);
      renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss();
    }

    /* ---------- input ---------- */
    var KEYMAP = { arrowleft: "left", a: "left", arrowright: "right", d: "right", arrowup: "up", w: "up", " ": "up", arrowdown: "down", s: "down" };
    function onKey(e) {
      if (!canvas.isConnected) return;
      var key = e.key.toLowerCase(), tag = e.target && e.target.tagName, typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
      if (key === "escape" || (key === "p" && !typing)) {
        if (S.paused) { e.preventDefault(); resume(); return; }
        if (S.mode !== "intro" && S.mode !== "report" && S.mode !== "caught" && !overlayOpen()) { e.preventDefault(); pause(); }
        return;
      }
      if (S.paused || typing || overlayOpen()) return;
      if (key === "enter" && tag !== "BUTTON" && tag !== "A" && panelOpen()) { var pb = pbody.querySelector("[data-primary]:not([disabled]):not(.nthview-hidden)"); var cont = pbody.querySelector(".nthview-actions:not(.nthview-hidden) [data-primary]"); var tgt = cont && !cont.disabled ? cont : pb; if (tgt) { e.preventDefault(); tgt.click(); } return; }
      if (tag === "BUTTON" && (key === " " || key === "enter")) return;
      if (isRunning() && KEYMAP[key]) { e.preventDefault(); if (!e.repeat) act(KEYMAP[key]); }
    }
    root.addEventListener("keydown", onKey);
    var sw = null;
    canvas.addEventListener("pointerdown", function (e) { sw = { x: e.clientX, y: e.clientY, used: false }; });
    canvas.addEventListener("pointermove", function (e) {
      if (!sw || sw.used) return; var dx = e.clientX - sw.x, dy = e.clientY - sw.y;
      if (Math.max(Math.abs(dx), Math.abs(dy)) > 26) { sw.used = true; act(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? "left" : "right") : (dy < 0 ? "up" : "down")); }
    });
    canvas.addEventListener("pointerup", function () { sw = null; });
    canvas.addEventListener("pointercancel", function () { sw = null; });
    doc.addEventListener("visibilitychange", onVisibility);
    root.addEventListener("pagehide", saveNow);
    canvas.addEventListener("webglcontextlost", function (e) { e.preventDefault(); saveNow(); toast("The graphics were reset by the browser. Reload the page to continue; your progress is saved.", 8000); });
    function onResize() { renderer.setSize(VW(), VH(), false); fitCamera(); }
    var ro = root.ResizeObserver ? new root.ResizeObserver(onResize) : null;
    if (ro) ro.observe(container); else root.addEventListener("resize", onResize);
    if (mqReduce && mqReduce.addEventListener) mqReduce.addEventListener("change", function (e) { settings.reduced = e.matches; });

    /* ---------- start ---------- */
    renderTorches(); renderScore(); renderHud(); updatePad();
    prewarm();
    var resumeAt = SAVED ? restoreState(SAVED) : null;
    renderTorches(); renderScore();
    newGen(resumeAt ? (resumeAt.phase === "stretch" ? resumeAt.k : N) : 0, true); updateWorld(); snapCamera();
    if (!resumeAt) { S.mode = "intro"; introCard(); }
    else {
      S.mode = "lesson";
      if (resumeAt.phase === "report") { S.finale.done = true; S.k = N; showReport(); }
      else if (resumeAt.phase === "finale") { S.k = N; showFinaleIntro(); }
      else showLesson(resumeAt.k);
      var note = el("div", { class: "nthview-resume", role: "status", text: "Welcome back, continuing from " + (resumeAt.phase === "stretch" ? "stretch " + (resumeAt.k + 1) + " of " + N : resumeAt.phase === "finale" ? data.finale.name : "the report") + "." });
      container.appendChild(note);
      var hideNote = function () { note.classList.add("nthview-gone"); setTimeout(function () { if (note.parentNode) note.parentNode.removeChild(note); }, 500); root.removeEventListener("pointerdown", hideNote); root.removeEventListener("keydown", hideNote); };
      setTimeout(hideNote, 4500); root.addEventListener("pointerdown", hideNote); root.addEventListener("keydown", hideNote);
    }
    renderer.render(scene, camera);
    schedule();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () { trialProps.forEach(function (P) { if (P.label) P.board.userData.draw(P.label); }); });
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-temple-run");
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
      return { valid: false, errors: [{ path: "$", message: "WebGL is unavailable in this browser, so the temple cannot be drawn." }], warnings: result.warnings };
    }
    render(container, data);
    return result;
  };

  NthView.libs = [
    { kind: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", global: "THREE", name: "three.js r128" },
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Cinzel:wght@600;700;900&display=swap", name: "Google Fonts (Atkinson Hyperlegible, Cinzel)" }
  ];
  NthView.THEMES = THEMES.slice();
})(typeof globalThis !== "undefined" ? globalThis : window);
