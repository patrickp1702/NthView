/* NthView — island-quest renderer — schemaVersion 1
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
    ".nthview.nthview-island-quest{max-width:none;margin:0;padding:0;position:relative;width:100%;height:100vh;min-height:480px;overflow:hidden;",
    "  --sky:#cfe3ee;--sea:#4d93a6;--sand:#e3cf9f;--stone:#b9a77d;--panel:rgba(255,255,255,.95);--panel-solid:#fff;--ink:#17203d;--muted:#4a557a;--line:#c9d3e3;",
    "  --chip:#eef3f8;--ok:#1f8a5b;--no:#b23a48;--coin:#e0a91b;--star:#d98f00;--gold:#ffd76a;",
    "  --display:\"Bricolage Grotesque\",\"Avenir Next\",\"Segoe UI\",system-ui,sans-serif;--body:\"Atkinson Hyperlegible\",\"Segoe UI\",system-ui,sans-serif;",
    "  background:var(--sky);color:var(--ink);font-family:var(--body);-webkit-tap-highlight-color:transparent}",
    "@media (prefers-color-scheme:dark){.nthview.nthview-island-quest{--sky:#141b34;--sea:#0f3b47;--sand:#b9a072;--stone:#8d7a55;--panel:rgba(22,30,58,.95);--panel-solid:#161e3a;--ink:#eef1fa;--muted:#a9b2cf;--line:#33406b;--chip:#222c52;--ok:#5ed6a3;--no:#ff8a98;--coin:#f4c55b;--star:#ffd76a}}",
    "body:has(> .nthview-island-quest){margin:0;overflow:hidden}",
    ".nthview-island-quest .nthview-hidden{display:none!important}",
    ".nthview-island-quest button{font:inherit;color:inherit;cursor:pointer}",
    ".nthview-island-quest button:disabled{cursor:default}",
    ".nthview-island-quest .nthview-canvas{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;outline:none}",
    ".nthview-island-quest .nthview-sr{position:absolute;left:-9999px}",
    /* HUD */
    ".nthview-island-quest .nthview-hud{position:absolute;top:0;left:0;right:0;padding:12px 14px 0;display:flex;justify-content:space-between;align-items:flex-start;gap:12px;pointer-events:none;z-index:5}",
    ".nthview-island-quest .nthview-chip{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:8px 14px;pointer-events:auto}",
    ".nthview-island-quest .nthview-brand{font-family:var(--display);font-weight:800;font-size:1.1rem;letter-spacing:-.01em}",
    ".nthview-island-quest .nthview-tray{display:flex;gap:6px;margin-top:8px;pointer-events:auto;flex-wrap:wrap;max-width:200px}",
    ".nthview-island-quest .nthview-gem{width:22px;height:22px;border-radius:50%;border:2px solid var(--line);display:grid;place-items:center;font-family:var(--display);font-weight:800;font-size:.72rem;color:var(--muted);background:var(--panel)}",
    ".nthview-island-quest .nthview-gem.nthview-on{border-color:transparent;color:#10152b}",
    ".nthview-island-quest .nthview-mini{display:block;margin-top:8px;width:112px;height:112px;border-radius:50%;border:2px solid var(--line);background:color-mix(in srgb,var(--panel-solid) 70%,transparent);pointer-events:none}",
    ".nthview-island-quest .nthview-hud-right{display:flex;flex-direction:column;align-items:flex-end;gap:8px}",
    ".nthview-island-quest .nthview-score{display:flex;align-items:center;gap:8px;font-size:1rem}",
    ".nthview-island-quest .nthview-score b{font-family:var(--display);font-size:1.15rem}",
    ".nthview-island-quest .nthview-coin{width:16px;height:16px;border-radius:50%;background:var(--coin);box-shadow:inset 0 0 0 3px color-mix(in srgb,var(--coin) 60%,#000);display:inline-block;flex:none}",
    ".nthview-island-quest .nthview-star{color:var(--star);font-size:1.15rem;line-height:1}",
    ".nthview-island-quest .nthview-hud-row{display:flex;gap:8px;pointer-events:auto}",
    ".nthview-island-quest .nthview-hud-row button{font-size:.88rem;padding:6px 12px}",
    /* guide */
    ".nthview-island-quest .nthview-guide{position:absolute;left:50%;transform:translateX(-50%);bottom:20px;display:flex;align-items:center;gap:14px;background:var(--panel-solid);border:2px solid var(--accent,var(--line));border-radius:22px;padding:10px 12px;z-index:6;max-width:calc(100% - 24px);box-shadow:0 10px 34px rgba(0,0,0,.25)}",
    ".nthview-island-quest .nthview-garrow{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--chip);color:var(--accent,var(--ink));flex:none}",
    ".nthview-island-quest .nthview-garrow svg{display:block}",
    ".nthview-island-quest .nthview-gtext{min-width:0}",
    ".nthview-island-quest .nthview-gsmall{font-size:.85rem;color:var(--muted)}",
    ".nthview-island-quest .nthview-gbig{font-family:var(--display);font-weight:800;font-size:1.15rem;line-height:1.15}",
    ".nthview-island-quest .nthview-gactions{display:flex;gap:8px;flex-wrap:wrap}",
    "@media (hover:none) and (pointer:coarse){.nthview-island-quest .nthview-guide{left:auto;right:12px;transform:none;bottom:14px;max-width:calc(100% - 168px);flex-wrap:wrap;gap:10px}}",
    ".nthview-island-quest .nthview-toast{position:absolute;left:50%;top:100px;transform:translate(-50%,-10px);opacity:0;background:var(--panel-solid);border:1px solid var(--line);border-radius:14px;padding:10px 18px;z-index:9;transition:opacity .3s,transform .3s;pointer-events:none;max-width:calc(100% - 32px);text-align:center}",
    ".nthview-island-quest .nthview-toast.nthview-show{opacity:1;transform:translate(-50%,0)}",
    ".nthview-island-quest .nthview-joy{position:absolute;left:18px;bottom:18px;width:124px;height:124px;border-radius:50%;border:2px solid var(--line);background:color-mix(in srgb,var(--panel-solid) 55%,transparent);z-index:6;touch-action:none;display:none}",
    ".nthview-island-quest .nthview-knob{position:absolute;left:50%;top:50%;width:52px;height:52px;margin:-26px 0 0 -26px;border-radius:50%;background:var(--ink);opacity:.55}",
    "@media (hover:none) and (pointer:coarse){.nthview-island-quest .nthview-joy{display:block}}",
    ".nthview-island-quest .nthview-btn{background:var(--panel-solid);border:1.5px solid var(--accent,var(--line));border-radius:12px;padding:9px 16px;font-weight:700;line-height:1.2}",
    ".nthview-island-quest .nthview-btn.nthview-primary{background:var(--accent,var(--nv-accent));color:#10152b;border-color:transparent}",
    ".nthview-island-quest .nthview-btn:disabled{opacity:.45}",
    /* panel */
    ".nthview-island-quest .nthview-panel{position:absolute;top:0;right:0;bottom:0;width:min(470px,100%);background:var(--panel);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-left:1px solid var(--line);z-index:8;overflow-y:auto;padding:18px 24px 28px;transform:translateX(105%);transition:transform .35s cubic-bezier(.2,.8,.2,1)}",
    ".nthview-island-quest .nthview-panel.nthview-open{transform:none}",
    "@media (max-width:640px){.nthview-island-quest .nthview-panel{top:auto;width:100%;max-height:80%;border-left:0;border-top:1px solid var(--line);border-radius:20px 20px 0 0;transform:translateY(105%);padding:16px 18px 24px}}",
    ".nthview-island-quest .nthview-close{position:sticky;top:0;float:right;background:var(--chip);border:1px solid var(--line);border-radius:10px;padding:6px 12px;font-size:.9rem;z-index:2}",
    ".nthview-island-quest .nthview-kicker{color:var(--muted);margin:2px 0 0;font-size:.95rem}",
    ".nthview-island-quest .nthview-panel h2{font-family:var(--display);font-weight:800;font-size:2rem;line-height:1.02;letter-spacing:-.02em;margin:4px 0 12px;max-width:13ch;color:var(--ink)}",
    ".nthview-island-quest .nthview-panel h2::after{content:\"\";display:block;width:56px;height:6px;border-radius:3px;background:var(--accent);margin-top:10px}",
    ".nthview-island-quest .nthview-panel p{line-height:1.6;max-width:60ch}",
    ".nthview-island-quest .nthview-lead{font-size:1.08rem}",
    ".nthview-island-quest .nthview-box{background:var(--chip);border:1px solid var(--line);border-radius:16px;padding:14px 16px;margin:18px 0}",
    ".nthview-island-quest .nthview-box.nthview-task{border:2px solid var(--accent);background:color-mix(in srgb,var(--accent) 10%,var(--panel-solid))}",
    ".nthview-island-quest .nthview-box-title{font-family:var(--display);font-weight:700;font-size:1.08rem;margin:0 0 8px}",
    ".nthview-island-quest .nthview-row{display:flex;gap:8px;align-items:center;flex-wrap:wrap}",
    ".nthview-island-quest .nthview-cap{font-size:.84rem;color:var(--muted);margin:10px 0 0}",
    ".nthview-island-quest .nthview-readout{font-family:var(--display);font-weight:700;font-size:1.05rem;margin-top:12px}",
    ".nthview-island-quest .nthview-robots{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px;min-height:54px}",
    ".nthview-island-quest .nthview-rb{display:flex;flex-direction:column;align-items:center;font-size:1.6rem;line-height:1}",
    ".nthview-island-quest .nthview-rb b{font-size:.85rem;margin-top:3px;font-family:var(--display);padding:1px 6px;border-radius:6px}",
    ".nthview-island-quest .nthview-rb.nthview-win b{background:var(--accent);color:#10152b}",
    ".nthview-island-quest .nthview-pile{font-size:1.25rem;letter-spacing:2px;line-height:1.4;min-height:1.4em;margin-top:6px;word-break:break-all}",
    ".nthview-island-quest .nthview-story{display:grid;gap:8px;margin-top:12px}",
    ".nthview-island-quest .nthview-story p{margin:0;padding:10px 12px;border-radius:12px;background:var(--panel-solid);border:1px solid var(--line)}",
    ".nthview-island-quest .nthview-stepper{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:8px 0}",
    ".nthview-island-quest .nthview-stepper .nthview-ctl{display:flex;align-items:center;gap:10px}",
    ".nthview-island-quest .nthview-stepper button{width:42px;height:42px;border-radius:12px;border:1.5px solid var(--line);background:var(--panel-solid);font-size:1.3rem;font-weight:700}",
    ".nthview-island-quest .nthview-stepper b{min-width:2ch;text-align:center;font-family:var(--display);font-size:1.35rem}",
    ".nthview-island-quest .nthview-frow{margin:12px 0}",
    ".nthview-island-quest .nthview-flabel{font-size:.95rem;margin-bottom:5px}",
    ".nthview-island-quest .nthview-fline{display:flex;align-items:center;gap:10px}",
    ".nthview-island-quest .nthview-track{flex:1;height:14px;border-radius:7px;background:color-mix(in srgb,var(--ink) 9%,transparent);overflow:hidden}",
    ".nthview-island-quest .nthview-track .nthview-bar{height:100%;border-radius:7px;background:var(--accent);transition:width 1.4s ease-out}",
    ".nthview-island-quest .nthview-bar.nthview-grey{background:#9aa3b8}",
    ".nthview-island-quest .nthview-bar.nthview-dashed{background:repeating-linear-gradient(90deg,var(--accent) 0 9px,transparent 9px 15px)}",
    ".nthview-island-quest .nthview-fline b{min-width:5.2ch;text-align:right;font-family:var(--display)}",
    ".nthview-island-quest .nthview-quiz{margin-top:22px;border-top:1px solid var(--line);padding-top:16px}",
    ".nthview-island-quest .nthview-q{font-weight:700;font-size:1.08rem}",
    ".nthview-island-quest .nthview-opts{display:grid;gap:8px}",
    ".nthview-island-quest .nthview-opt{text-align:left;background:var(--panel-solid);border:1.5px solid var(--line);border-radius:12px;padding:12px 14px;line-height:1.35}",
    ".nthview-island-quest .nthview-opt:hover:not(:disabled){border-color:var(--accent,var(--nv-accent))}",
    ".nthview-island-quest .nthview-opt.nthview-right{border-color:var(--ok);background:color-mix(in srgb,var(--ok) 14%,var(--panel-solid))}",
    ".nthview-island-quest .nthview-opt.nthview-wrong{border-color:var(--no);opacity:.7;text-decoration:line-through}",
    ".nthview-island-quest .nthview-fb{margin-top:12px;line-height:1.5}",
    ".nthview-island-quest .nthview-fb.nthview-ok{color:var(--ok);font-weight:700}",
    ".nthview-island-quest .nthview-fb.nthview-no{color:var(--no)}",
    ".nthview-island-quest .nthview-remember{border:2px solid var(--accent);border-radius:16px;padding:14px 16px;margin-top:18px}",
    ".nthview-island-quest .nthview-remember .nthview-box-title{margin-bottom:4px}",
    ".nthview-island-quest .nthview-remember .nthview-btn{margin-top:8px}",
    ".nthview-island-quest .nthview-stars-earned{font-size:1.4rem;color:var(--star);letter-spacing:2px;margin:0 0 6px}",
    /* overlays */
    ".nthview-island-quest .nthview-overlay{position:absolute;inset:0;z-index:20;display:grid;place-items:center;padding:20px 16px;background:color-mix(in srgb,var(--sky) 55%,transparent);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);overflow-y:auto}",
    ".nthview-island-quest .nthview-card{background:var(--panel-solid);border:1px solid var(--line);border-radius:24px;padding:28px;max-width:600px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,.3)}",
    ".nthview-island-quest .nthview-card h1{font-family:var(--display);font-weight:800;font-size:clamp(2.4rem,7vw,3.8rem);line-height:.95;letter-spacing:-.035em;margin:0 0 14px}",
    ".nthview-island-quest .nthview-card p{line-height:1.6}",
    ".nthview-island-quest .nthview-big{font-size:1.1rem}",
    ".nthview-island-quest .nthview-card ol,.nthview-island-quest .nthview-card ul{padding-left:1.3rem;line-height:1.55}",
    ".nthview-island-quest .nthview-card li{margin:8px 0}",
    ".nthview-island-quest .nthview-small{font-size:.9rem;color:var(--muted)}",
    ".nthview-island-quest .nthview-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:18px}",
    ".nthview-island-quest .nthview-card .nthview-btn.nthview-primary{font-size:1.08rem;padding:12px 24px}",
    ".nthview-island-quest .nthview-scorecard{display:flex;gap:12px;flex-wrap:wrap;margin:12px 0 6px}",
    ".nthview-island-quest .nthview-scorecard div{flex:1;min-width:120px;background:var(--chip);border:1px solid var(--line);border-radius:14px;padding:12px 14px}",
    ".nthview-island-quest .nthview-scorecard b{display:block;font-family:var(--display);font-size:1.6rem}",
    ".nthview-island-quest table.nthview-t{border-collapse:collapse;width:100%;font-size:.95rem;margin-top:8px}",
    ".nthview-island-quest table.nthview-t th,.nthview-island-quest table.nthview-t td{padding:7px 8px;border-bottom:1px solid var(--line);text-align:left}",
    ".nthview-island-quest a{color:var(--nv-accent)}",
    "@media (prefers-reduced-motion:reduce){.nthview-island-quest .nthview-panel,.nthview-island-quest .nthview-toast,.nthview-island-quest .nthview-track .nthview-bar{transition:none}}"
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

  // ---- view-specific rendering: data is already valid here ---------------
  var PALETTE = ["#3d8fd6", "#a77fd1", "#c99312", "#1fa874", "#e0679e", "#9aa3b8", "#7ea31c", "#d9534f", "#2aa198"];
  var PALETTE_DARK = ["#6eb6f2", "#b48ad8", "#f4c55b", "#5ed6a3", "#f28db8", "#e8e6da", "#c6e46a", "#ff8a98", "#6fd3c7"];

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

  /* ======================================================================
     The game. Everything below is driven by `data`.
     ====================================================================== */
  function render(container, data) {
    var THREE = root.THREE, doc = root.document;
    var N = data.islands.length;
    var hero = data.companion.name;
    var reduceMotion = root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isDark = function () { return !!(root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)").matches); };
    var css = function (n) { return getComputedStyle(container).getPropertyValue(n).trim(); };

    /* ---------- DOM scaffold ---------- */
    var canvas = el("canvas", { class: "nthview-canvas", tabindex: "0", "aria-label": "3D islands. Use WASD or arrow keys to move and drag to look. Use the guide at the bottom of the screen to walk to the next lesson." });
    var tray = el("div", { class: "nthview-tray", "aria-label": "Lessons finished" });
    var mini = el("canvas", { class: "nthview-mini", width: "224", height: "224", "aria-hidden": "true" });
    var coinCount = el("b", { text: String(data.coins || 10) }), starCount = el("b", { text: "0" });
    var soundBtn = el("button", { type: "button", class: "nthview-chip", "aria-pressed": "true", text: "Sound on" });
    var helpBtn = el("button", { type: "button", class: "nthview-chip", text: "How to play" });
    var hud = el("div", { class: "nthview-hud" }, [
      el("div", {}, [el("div", { class: "nthview-chip nthview-brand", text: data.title }), tray, mini]),
      el("div", { class: "nthview-hud-right" }, [
        el("div", { class: "nthview-chip nthview-score", title: "Each guess costs a coin. Answer first time for 3 stars." }, [
          el("span", { class: "nthview-coin", "aria-hidden": "true" }), coinCount,
          el("span", { class: "nthview-star", "aria-hidden": "true", text: "★" }), starCount,
          el("span", { class: "nthview-sr", text: "coins and stars" })]),
        el("div", { class: "nthview-hud-row" }, [soundBtn, helpBtn])])
    ]);
    var svgNS = "http://www.w3.org/2000/svg";
    var gSvg = doc.createElementNS(svgNS, "svg"); gSvg.setAttribute("viewBox", "0 0 24 24"); gSvg.setAttribute("width", "26"); gSvg.setAttribute("height", "26");
    var gPath = doc.createElementNS(svgNS, "path"); gPath.setAttribute("d", "M12 2 L21 13 H15.5 V22 H8.5 V13 H3 Z"); gPath.setAttribute("fill", "currentColor"); gSvg.appendChild(gPath);
    var gArrow = el("div", { class: "nthview-garrow", "aria-hidden": "true" }, [gSvg]);
    var gSmall = el("div", { class: "nthview-gsmall" }), gBig = el("div", { class: "nthview-gbig" }), gActions = el("div", { class: "nthview-gactions" });
    var guide = el("div", { class: "nthview-guide nthview-hidden", "aria-live": "polite" }, [gArrow, el("div", { class: "nthview-gtext" }, [gSmall, gBig]), gActions]);
    var toastEl = el("div", { class: "nthview-toast", role: "status", "aria-live": "polite" });
    var knob = el("div", { class: "nthview-knob" });
    var joy = el("div", { class: "nthview-joy", "aria-hidden": "true" }, [knob]);
    var closeBtn = el("button", { type: "button", class: "nthview-close", text: "Back to the islands" });
    var pbody = el("div");
    var panel = el("aside", { class: "nthview-panel", "aria-label": "Lesson" }, [closeBtn, pbody]);
    var startBtn = btn("Start", "nthview-primary", function () { onStart(); });
    var introCard = el("div", { class: "nthview-card" });
    introCard.appendChild(el("h1", { text: data.title }));
    if (data.subtitle) introCard.appendChild(p("nthview-kicker", data.subtitle));
    data.intro.paragraphs.forEach(function (t) { introCard.appendChild(p("nthview-big", t)); });
    if (data.intro.steps && data.intro.steps.length) {
      introCard.appendChild(p("", "**How it works**"));
      introCard.appendChild(el("ol", {}, data.intro.steps.map(function (s) { var li = el("li"); li.appendChild(rich(s)); return li; })));
    }
    introCard.appendChild(p("nthview-small", "To move yourself: WASD or arrow keys, and drag to look around. On a phone, use the stick at the bottom left."));
    if (data.intro.note) introCard.appendChild(p("nthview-small", data.intro.note));
    introCard.appendChild(el("div", { class: "nthview-actions" }, [startBtn]));
    var intro = el("div", { class: "nthview-overlay" }, [introCard]);
    var endCard = el("div", { class: "nthview-card" });
    var end = el("div", { class: "nthview-overlay nthview-hidden" }, [endCard]);
    [canvas, hud, guide, toastEl, joy, panel, intro, end].forEach(function (n) { container.appendChild(n); });

    /* ---------- state & score ---------- */
    var state = { done: {}, doneCount: 0, coins: data.coins || 10, stars: {}, attempts: {}, panelOpen: false, started: false, finished: false, muted: false };
    var totalStars = function () { return Object.keys(state.stars).reduce(function (a, k) { return a + state.stars[k]; }, 0); };
    var maxStars = 3 * (N + data.finale.questions.length);
    function renderScore() { coinCount.textContent = String(state.coins); starCount.textContent = String(totalStars()); }
    function attempt(key) { state.attempts[key] = (state.attempts[key] || 0) + 1; state.coins = Math.max(0, state.coins - 1); renderScore(); }
    function award(key) { var a = state.attempts[key] || 1; var st = a === 1 ? 3 : a === 2 ? 2 : 1; state.stars[key] = st; renderScore(); return st; }
    var toastTimer;
    function toast(msg) { toastEl.textContent = msg; toastEl.classList.add("nthview-show"); clearTimeout(toastTimer); toastTimer = setTimeout(function () { toastEl.classList.remove("nthview-show"); }, 3400); }

    /* ---------- sound (synthesised, no files) ---------- */
    var actx = null;
    function sfx(kind) {
      if (state.muted) return;
      try {
        var AC = root.AudioContext || root.webkitAudioContext; if (!AC) return;
        if (!actx) actx = new AC(); if (actx.state === "suspended") actx.resume();
        var t0 = actx.currentTime;
        var tone = function (f, st, dur, type, vol) {
          var o = actx.createOscillator(), g = actx.createGain(); o.type = type || "sine"; o.frequency.setValueAtTime(f, t0 + st);
          g.gain.setValueAtTime(0, t0 + st); g.gain.linearRampToValueAtTime(vol || .07, t0 + st + .012); g.gain.exponentialRampToValueAtTime(.0001, t0 + st + dur);
          o.connect(g); g.connect(actx.destination); o.start(t0 + st); o.stop(t0 + st + dur + .03);
        };
        switch (kind) {
          case "coin": tone(988, 0, .1, "triangle"); tone(1319, .07, .16, "triangle"); break;
          case "pick": tone(660, 0, .09, "triangle"); tone(880, .05, .12, "triangle"); break;
          case "ok": [523, 659, 784].forEach(function (f, i) { tone(f, i * .09, .3); }); break;
          case "no": tone(170, 0, .28, "sawtooth", .035); tone(140, .12, .3, "sawtooth", .03); break;
          case "win": [523, 659, 784, 1047, 1319].forEach(function (f, i) { tone(f, i * .1, .45); }); break;
          case "open": tone(440, 0, .07, "triangle", .035); break;
          case "step": tone(330, 0, .05, "triangle", .02); break;
        }
      } catch (e) { /* audio is optional */ }
    }
    soundBtn.addEventListener("click", function () { state.muted = !state.muted; soundBtn.textContent = state.muted ? "Sound off" : "Sound on"; soundBtn.setAttribute("aria-pressed", String(!state.muted)); if (!state.muted) sfx("open"); });

    /* ---------- renderer & scene ---------- */
    var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
    renderer.setPixelRatio(Math.min(root.devicePixelRatio || 1, 2));
    var W = function () { return container.clientWidth || 800; }, H = function () { return container.clientHeight || 600; };
    renderer.setSize(W(), H(), false);
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(60, W() / H(), .1, 900);
    var hemi = new THREE.HemisphereLight(0xffffff, 0x445566, .9); scene.add(hemi);
    var sun = new THREE.DirectionalLight(0xffffff, .8); sun.position.set(40, 80, 30); scene.add(sun);
    var M = function (c, o) { return new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: .75, metalness: .05, flatShading: true }, o || {})); };
    var glow = function (c, i, o) { return M(c, Object.assign({ emissive: c, emissiveIntensity: i === undefined ? .6 : i }, o || {})); };
    var sandMat = M("#e3cf9f"), stoneMat = M("#b9a77d");
    var seaMat = new THREE.MeshStandardMaterial({ color: "#4d93a6", roughness: .35, metalness: .1, flatShading: true, transparent: true, opacity: .95 });
    var seaGeo = new THREE.PlaneGeometry(700, 700, 90, 90);
    var sea = new THREE.Mesh(seaGeo, seaMat); sea.rotation.x = -Math.PI / 2; sea.position.y = -1.6; scene.add(sea);
    var seaPos = seaGeo.attributes.position;
    var starGeo = new THREE.BufferGeometry(); var sp = [];
    for (var si = 0; si < 900; si++) { var th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * .45, rr = 400; sp.push(rr * Math.sin(ph) * Math.cos(th), rr * Math.cos(ph) + 20, rr * Math.sin(ph) * Math.sin(th)); }
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(sp, 3));
    var stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 1.4, sizeAttenuation: false, fog: false })); scene.add(stars);

    /* ---------- labels (canvas textures) ---------- */
    var FONT = "\"Bricolage Grotesque\", \"Avenir Next\", system-ui, sans-serif";
    function makeLabel(text, color, num) {
      var cw = 1280, ch = 200, c = doc.createElement("canvas"); c.width = cw; c.height = ch;
      var x = c.getContext("2d"); var font = function (s) { return "800 " + s + "px " + FONT; };
      x.font = font(80); var tw = x.measureText(text).width; var lead = num != null ? 118 : 48; var w = Math.min(cw - 16, tw + lead + 56), l = (cw - w) / 2, r = 80;
      x.fillStyle = "rgba(12,16,34,.76)"; x.beginPath(); x.moveTo(l + r, 20); x.lineTo(l + w - r, 20); x.arc(l + w - r, 100, r, -Math.PI / 2, Math.PI / 2); x.lineTo(l + r, 180); x.arc(l + r, 100, r, Math.PI / 2, Math.PI * 1.5); x.fill();
      if (num != null) { x.fillStyle = color; x.beginPath(); x.arc(l + 74, 100, 44, 0, Math.PI * 2); x.fill(); x.fillStyle = "#10152b"; x.font = font(58); x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(String(num), l + 74, 104); x.textAlign = "left"; x.font = font(80); }
      x.fillStyle = "#ffffff"; x.textBaseline = "middle"; x.fillText(text, l + lead, 104);
      var tex = new THREE.CanvasTexture(c); tex.anisotropy = 4;
      var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); s.scale.set(15, 2.34, 1); return s;
    }
    function makeTag(text, color, size) {
      var c = doc.createElement("canvas"); c.width = 256; c.height = 256; var x = c.getContext("2d");
      x.fillStyle = "rgba(12,16,34,.8)"; x.beginPath(); x.arc(128, 128, 118, 0, Math.PI * 2); x.fill();
      x.fillStyle = color; x.beginPath(); x.arc(128, 128, 100, 0, Math.PI * 2); x.fill();
      x.fillStyle = "#10152b"; x.font = "800 " + (text.length > 2 ? 70 : 130) + "px " + FONT; x.textAlign = "center"; x.textBaseline = "middle"; x.fillText(text, 128, 136);
      var tex = new THREE.CanvasTexture(c); var s = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false })); s.scale.set(size || 1.3, size || 1.3, 1); return s;
    }

    /* ---------- world ---------- */
    var R_RING = N <= 7 ? 50 : 50 + (N - 7) * 6, R_HUB = 16, R_ISLE = 11, RING_ROAD = 11.5;
    var islands = [{ x: 0, z: 0, r: R_HUB }], bridges = [];
    function island(x, z, r) {
      var g = new THREE.Mesh(new THREE.CylinderGeometry(r, r * .72, 7, 30), sandMat); g.position.set(x, -3.5, z); scene.add(g);
      for (var i = 0; i < 7; i++) {
        var a = Math.random() * Math.PI * 2, d = r * (.82 + Math.random() * .12);
        var rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.5 + Math.random() * .7, 0), stoneMat);
        rock.position.set(x + Math.cos(a) * d, .2, z + Math.sin(a) * d); rock.rotation.set(Math.random(), Math.random(), 0); scene.add(rock);
      }
    }
    island(0, 0, R_HUB);

    var STATIONS = data.islands.map(function (isl, i) {
      return { id: isl.id, name: isl.name, idx: i, data: isl, lightColor: isl.color || PALETTE[i % PALETTE.length], darkColor: isl.color || PALETTE_DARK[i % PALETTE_DARK.length] };
    });
    var coinPickups = [];
    STATIONS.forEach(function (s, i) {
      s.color = isDark() ? s.darkColor : s.lightColor;
      s.angle = Math.PI + i * 2 * Math.PI / N;
      s.dir = { x: Math.sin(s.angle), z: Math.cos(s.angle) };
      s.x = s.dir.x * R_RING; s.z = s.dir.z * R_RING;
      s.toWorld = function (lx, lz) { return { x: s.x + lx * Math.cos(s.angle) + lz * Math.sin(s.angle), z: s.z - lx * Math.sin(s.angle) + lz * Math.cos(s.angle) }; };
      islands.push({ x: s.x, z: s.z, r: R_ISLE }); island(s.x, s.z, R_ISLE);
      var a0 = R_HUB - 1.5, a1 = R_RING - R_ISLE + 1.5, len = a1 - a0;
      var b = new THREE.Mesh(new THREE.BoxGeometry(3.4, .5, len), stoneMat);
      b.position.set(s.dir.x * (a0 + len / 2), -.25, s.dir.z * (a0 + len / 2)); b.rotation.y = s.angle; scene.add(b);
      s.lamps = [];
      for (var k = 0; k <= len; k += 3.2) {
        [-1, 1].forEach(function (side) {
          var px = s.dir.x * (a0 + k) + Math.cos(s.angle) * side * 1.6, pz = s.dir.z * (a0 + k) - Math.sin(s.angle) * side * 1.6;
          var post = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, 1, 5), stoneMat); post.position.set(px, .5, pz); scene.add(post);
          var lamp = new THREE.Mesh(new THREE.SphereGeometry(.14, 8, 6), glow(s.color, .9)); lamp.position.set(px, 1.05, pz); scene.add(lamp); s.lamps.push(lamp);
        });
      }
      [.28, .5, .72].forEach(function (f, k) {
        var dd = a0 + len * f, side = (k % 2 ? 1 : -1) * .7;
        var c = new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .1, 18), glow("#f4c55b", .7, { metalness: .5, roughness: .3 })); c.rotation.x = Math.PI / 2;
        var wx = s.dir.x * dd + Math.cos(s.angle) * side, wz = s.dir.z * dd - Math.sin(s.angle) * side; c.position.set(wx, 1.2, wz); scene.add(c); coinPickups.push({ mesh: c, x: wx, z: wz, got: false });
      });
      s.bridge = { ax: s.dir.x * (R_HUB - 3), az: s.dir.z * (R_HUB - 3), bx: s.dir.x * (R_RING - R_ISLE + 3), bz: s.dir.z * (R_RING - R_ISLE + 3) };
      bridges.push(s.bridge);
      s.g = new THREE.Group(); s.g.position.set(s.x, 0, s.z); s.g.rotation.y = s.angle; scene.add(s.g);
      s.beacon = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, 60, 12, 1, true), new THREE.MeshBasicMaterial({ color: s.color, transparent: true, opacity: .1, depthWrite: false, fog: false }));
      s.beacon.position.set(s.x, 30, s.z); scene.add(s.beacon);
      s.label = makeLabel(s.name, s.color, i + 1); s.label.position.set(s.x, 10.5, s.z); scene.add(s.label);
      s.beaconBase = .04;
    });

    function segDist(px, pz, b) { var vx = b.bx - b.ax, vz = b.bz - b.az; var t = ((px - b.ax) * vx + (pz - b.az) * vz) / (vx * vx + vz * vz); t = Math.max(0, Math.min(1, t)); return Math.hypot(px - (b.ax + vx * t), pz - (b.az + vz * t)); }
    function walkable(x, z) {
      for (var i = 0; i < islands.length; i++) if (Math.hypot(x - islands[i].x, z - islands[i].z) < islands[i].r - .9) return true;
      for (var j = 0; j < bridges.length; j++) if (segDist(x, z, bridges[j]) < 1.3) return true;
      return false;
    }

    /* ---------- centre ---------- */
    var plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.8, .6, 8), stoneMat); plinth.position.y = .3; scene.add(plinth);
    var obelisk = new THREE.Mesh(new THREE.OctahedronGeometry(1.3, 0), M("#9aa3b8", { emissive: "#222222", metalness: .3, roughness: .3 })); obelisk.position.y = 3.8; obelisk.scale.y = 1.8; scene.add(obelisk);
    var crown = STATIONS.map(function (s, i) {
      var a = i / N * Math.PI * 2; var h = .7 + 2.4 * (1 - Math.exp(-(i + .6) / 2.1));
      var pm = new THREE.Mesh(new THREE.BoxGeometry(.55, h, .55), M("#8a93a8", { emissive: "#000000" })); pm.position.set(Math.sin(a) * 2.55, .6 + h / 2, Math.cos(a) * 2.55); scene.add(pm); return { p: pm, s: s };
    });
    var examLabel = makeLabel(data.finale.name, "#ffffff"); examLabel.position.set(0, 9.6, 0); scene.add(examLabel);
    var marker = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 4), glow("#ffd76a", .9)); marker.rotation.x = Math.PI; scene.add(marker);

    function nextTarget() { return state.doneCount < N ? STATIONS[state.doneCount] : "summit"; }
    function isUnlocked(s) { return s.idx <= state.doneCount; }
    function refreshWorld() {
      var tgt = nextTarget();
      STATIONS.forEach(function (s) {
        var done = !!state.done[s.id], next = tgt === s;
        s.beaconBase = done ? .36 : next ? .3 : .04; s.isNext = next; s.label.material.opacity = (done || next) ? 1 : .45;
      });
      crown.forEach(function (c) { var on = !!state.done[c.s.id]; c.p.material.color.set(on ? c.s.color : "#8a93a8"); c.p.material.emissive.set(on ? c.s.color : "#000000"); c.p.material.emissiveIntensity = on ? .6 : 0; });
      var all = state.doneCount === N; obelisk.material.emissive.set(all ? "#ffffff" : "#222222"); obelisk.material.emissiveIntensity = all ? .6 : .4;
    }
    function applyTheme() {
      var sky = css("--sky") || "#cfe3ee"; scene.background = new THREE.Color(sky); scene.fog = new THREE.Fog(sky, 70, 300);
      seaMat.color.set(css("--sea") || "#4d93a6"); sandMat.color.set(css("--sand") || "#e3cf9f"); stoneMat.color.set(css("--stone") || "#b9a77d");
      stars.visible = isDark(); hemi.intensity = isDark() ? .7 : 1; sun.intensity = isDark() ? .55 : .9;
      STATIONS.forEach(function (s) {
        s.color = isDark() ? s.darkColor : s.lightColor; s.beacon.material.color.set(s.color);
        s.lamps.forEach(function (l) { l.material.color.set(s.color); l.material.emissive.set(s.color); });
        if (s.recolor) s.recolor(s.color);
      });
      refreshWorld(); renderTray();
    }

    /* ---------- confetti ---------- */
    var bursts = [];
    function burst(x, y, z, color, n) {
      n = n || 110;
      var geo = new THREE.BufferGeometry(); var pos = new Float32Array(n * 3); var vel = [];
      for (var i = 0; i < n; i++) { pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z; var a = Math.random() * Math.PI * 2, up = 4 + Math.random() * 7, out = 2 + Math.random() * 5; vel.push(Math.cos(a) * out, up, Math.sin(a) * out); }
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      var pts = new THREE.Points(geo, new THREE.PointsMaterial({ color: color, size: .38, transparent: true, opacity: 1 }));
      scene.add(pts); bursts.push({ pts: pts, vel: vel, t: 0 });
    }
    function updateBursts(dt) {
      for (var i = bursts.length - 1; i >= 0; i--) {
        var b = bursts[i]; b.t += dt; var a = b.pts.geometry.attributes.position; var arr = a.array;
        for (var k = 0; k < b.vel.length / 3; k++) { b.vel[k * 3 + 1] -= 12 * dt; arr[k * 3] += b.vel[k * 3] * dt; arr[k * 3 + 1] += b.vel[k * 3 + 1] * dt; arr[k * 3 + 2] += b.vel[k * 3 + 2] * dt; if (arr[k * 3 + 1] < 0) { arr[k * 3 + 1] = 0; b.vel[k * 3 + 1] *= -.3; } }
        a.needsUpdate = true; b.pts.material.opacity = Math.max(0, 1 - b.t / 2); if (b.t > 2) { scene.remove(b.pts); bursts.splice(i, 1); }
      }
    }

    /* ---------- player (the coach) and the companion ---------- */
    var player = new THREE.Group(); scene.add(player);
    var body = new THREE.Mesh(new THREE.IcosahedronGeometry(.75, 1), M("#f4f6fb", { emissive: "#ffffff", emissiveIntensity: .15, roughness: .4 })); body.position.y = 1.1; player.add(body);
    var visor = new THREE.Mesh(new THREE.BoxGeometry(.9, .22, .3), M("#1b2440", { emissive: "#6eb6f2", emissiveIntensity: .8 })); visor.position.set(0, 1.25, .62); player.add(visor);
    var halo = new THREE.Mesh(new THREE.TorusGeometry(.55, .07, 6, 24), glow("#ffd76a", .8)); halo.rotation.x = Math.PI / 2; halo.position.y = 2.25; player.add(halo);
    player.position.set(0, 0, 6.5);
    var yaw = 0, pitch = .34;
    var robo = new THREE.Group(); scene.add(robo);
    (function () {
      var bd = new THREE.Mesh(new THREE.BoxGeometry(.75, .65, .6), M("#e8e6da", { roughness: .5 })); bd.position.y = .75; robo.add(bd);
      var hd = new THREE.Mesh(new THREE.BoxGeometry(.6, .45, .55), M("#e8e6da", { roughness: .5 })); hd.position.y = 1.35; robo.add(hd);
      [-.15, .15].forEach(function (sx) { var eye = new THREE.Mesh(new THREE.BoxGeometry(.12, .12, .06), glow("#6eb6f2", 1)); eye.position.set(sx, 1.4, .29); robo.add(eye); });
      var ant = new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .4, 5), stoneMat); ant.position.y = 1.75; robo.add(ant);
      var tip = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), glow("#f4c55b", 1)); tip.position.y = 1.98; robo.add(tip); robo.userData.tip = tip;
      var feet = new THREE.Mesh(new THREE.BoxGeometry(.6, .2, .5), M("#9aa3b8")); feet.position.y = .35; robo.add(feet);
    })();
    robo.position.set(0, 0, 8.2); var roboJump = 0;

    /* ---------- scenery per theme, field tasks per activity ---------- */
    var updaters = [];
    function figure(sc, color) {
      var f = new THREE.Group();
      var b = new THREE.Mesh(new THREE.CylinderGeometry(.55, .75, 2, 8), M(color || "#c8cdd8")); b.position.y = 1; f.add(b);
      var h = new THREE.Mesh(new THREE.IcosahedronGeometry(.55, 0), glow(color || "#c8cdd8", .3)); h.position.y = 2.6; f.add(h);
      f.scale.setScalar(sc); return f;
    }
    function makePad(s, lx, lz, opt) {
      var pad = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, .18, 20), M("#f4f1e8", { emissive: s.color, emissiveIntensity: 0 })); pad.position.set(lx, .09, lz); s.g.add(pad);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(1.5, .08, 6, 28), glow(s.color, .5)); ring.rotation.x = Math.PI / 2; ring.position.set(lx, .2, lz); s.g.add(ring);
      var tag = makeTag(opt.label, "#ffffff", 1.9); tag.position.set(lx, 1.6, lz); s.g.add(tag);
      var w = s.toWorld(lx, lz); return { mesh: pad, ring: ring, tag: tag, id: opt.id, label: opt.label, why: opt.hint || "", x: w.x, z: w.z };
    }
    var THEMES = {
      grove: function (s) {
        var trees = [];
        for (var i = 0; i < 10; i++) {
          var a = i / 10 * Math.PI * 2, t = new THREE.Group();
          var cone = new THREE.Mesh(new THREE.ConeGeometry(.95, 3.4, 6), glow(s.color, .25)); cone.position.y = 2.6; t.add(cone);
          var trunk = new THREE.Mesh(new THREE.CylinderGeometry(.18, .24, 1, 6), stoneMat); trunk.position.y = .5; t.add(trunk);
          t.position.set(Math.cos(a) * 7.2, 0, Math.sin(a) * 7.2); s.g.add(t); trees.push(t);
        }
        var ballot = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.6, 2.2), M("#f4f1e8")); ballot.position.y = .8; s.g.add(ballot);
        var slot = new THREE.Mesh(new THREE.BoxGeometry(1.2, .06, .2), M("#1b2440")); slot.position.y = 1.62; s.g.add(slot);
        s.pulse = function () { ballot.scale.setScalar(1.12); };
        updaters.push(function (t) { if (!reduceMotion) trees.forEach(function (tr, i) { tr.rotation.z = Math.sin(t * 1.2 + i) * .03; }); ballot.scale.lerp(new THREE.Vector3(1, 1, 1), .1); });
      },
      tower: function (s) {
        var rings = [];
        var core = new THREE.Mesh(new THREE.CylinderGeometry(.5, .9, 12, 8), stoneMat); core.position.y = 6; s.g.add(core);
        for (var i = 0; i < 9; i++) { var r = new THREE.Mesh(new THREE.TorusGeometry(2.6 - i * .18, .22, 6, 28), glow(s.color, .9 - i * .09)); r.rotation.x = Math.PI / 2; r.position.y = 1 + i * 1.25; s.g.add(r); rings.push(r); }
        var top = new THREE.Mesh(new THREE.OctahedronGeometry(.7, 0), M("#888888", { emissive: "#333333" })); top.position.y = 12.8; s.g.add(top);
        updaters.push(function (t) { if (reduceMotion) return; rings.forEach(function (r, i) { r.rotation.z = t * .4 * (i % 2 ? 1 : -1); r.material.emissiveIntensity = .15 + .75 * Math.max(0, Math.sin(t * 1.6 - i * .55)) * (1 - i / 11); }); });
      },
      arena: function (s) {
        var floor = new THREE.Mesh(new THREE.TorusGeometry(5.6, .25, 6, 40), glow(s.color, .4)); floor.rotation.x = Math.PI / 2; floor.position.y = .1; s.g.add(floor);
      },
      workshop: function (s) {
        var stand = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.6, .3, 10), stoneMat); stand.position.y = .15; s.g.add(stand);
      },
      canyon: function (s) {
        var wall = new THREE.Mesh(new THREE.BoxGeometry(14, 1.2, 1.2), stoneMat); wall.position.set(0, .6, 5.5); s.g.add(wall);
      },
      hall: function (s) {
        for (var i = -1; i <= 1; i += 2) { var col = new THREE.Mesh(new THREE.CylinderGeometry(.35, .4, 6, 8), M("#c8cdd8")); col.position.set(i * 6.5, 3, 4.5); s.g.add(col); }
        var beam = new THREE.Mesh(new THREE.BoxGeometry(13.8, .5, .6), M("#c8cdd8")); beam.position.set(0, 6.2, 4.5); s.g.add(beam);
      },
      clock: function (s) {
        var stand = new THREE.Mesh(new THREE.BoxGeometry(8, .8, 1.6), stoneMat); stand.position.y = .4; s.g.add(stand);
      },
      plain: function () {}
    };
    /* visual builders used by `tune` activities */
    function circleVisual(s) {
      var holder = new THREE.Group(); s.g.add(holder); var heads = [];
      updaters.push(function (t) { if (reduceMotion) return; heads.forEach(function (h, i) { h.material.emissiveIntensity = .3 + .7 * Math.max(0, Math.sin(t * 2.2 - i * 1.3)); }); });
      return function (count, extra) {
        holder.clear(); heads = []; count = Math.max(0, Math.min(12, Math.round(count))); extra = Math.max(0, Math.min(36, Math.round(extra)));
        for (var i = 0; i < count; i++) {
          var a = i / count * Math.PI * 2, ag = new THREE.Group();
          var b = new THREE.Mesh(new THREE.CylinderGeometry(.45, .6, 2, 8), M("#f4f1e8")); b.position.y = 1; ag.add(b);
          var h = new THREE.Mesh(new THREE.SphereGeometry(.5, 10, 8), glow(s.color, .6)); h.position.y = 2.45; ag.add(h);
          ag.position.set(Math.cos(a) * 4.4, 0, Math.sin(a) * 4.4); ag.lookAt(0, 0, 0); holder.add(ag); heads.push(h);
        }
        for (var k = 0; k < extra; k++) { var sl = new THREE.Mesh(new THREE.BoxGeometry(1.5, .16, 1.1), glow(s.color, .25, { color: "#fff4cf" })); sl.position.set((Math.random() - .5) * .3, .3 + k * .2, (Math.random() - .5) * .3); sl.rotation.y = k * .35; holder.add(sl); }
      };
    }
    function gridVisual(s, leader) {
      var holder = new THREE.Group(); s.g.add(holder); var nodes = [];
      updaters.push(function (t) { if (reduceMotion) return; nodes.forEach(function (n) { n.material.emissiveIntensity = .25 + .6 * Math.max(0, Math.sin(t * 2.4 - n.position.y * 1.1)); }); });
      return function (cols, rows) {
        holder.clear(); nodes = []; cols = Math.max(1, Math.min(8, Math.round(cols))); rows = Math.max(0, Math.min(6, Math.round(rows)));
        var layers = [], gap = 1.7;
        for (var l = 0; l < rows; l++) { var row = []; for (var m = 0; m < cols; m++) { var c = new THREE.Mesh(new THREE.BoxGeometry(.8, .8, .8), glow(s.color, .35)); c.position.set((m - (cols - 1) / 2) * 1.35, .8 + l * gap, 0); holder.add(c); row.push(c); nodes.push(c); } layers.push(row); }
        if (leader) { var lead = new THREE.Mesh(new THREE.OctahedronGeometry(.85, 0), glow("#ffffff", .5, { color: "#ffffff" })); lead.position.set(0, .8 + rows * gap + .3, 0); holder.add(lead); layers.push([lead]); nodes.push(lead); }
        var pts = [];
        for (var li = 0; li < layers.length - 1; li++) layers[li].forEach(function (a) { layers[li + 1].forEach(function (b) { pts.push(a.position.x, a.position.y, a.position.z, b.position.x, b.position.y, b.position.z); }); });
        if (pts.length) { var lg = new THREE.BufferGeometry(); lg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3)); holder.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: s.color, transparent: true, opacity: .45 }))); }
      };
    }

    STATIONS.forEach(function (s) {
      (THEMES[s.data.theme] || THEMES.plain)(s);
      var act = s.data.activity; if (!act) return;
      if (act.type === "collect") {
        var n = act.items.length;
        s.task = { type: "collect", total: n, collected: [], items: [] };
        act.items.forEach(function (L, i) {
          var a = i / n * Math.PI * 2 + .4, d = 4.6 + (i % 2) * 1.6, lx = Math.cos(a) * d, lz = Math.sin(a) * d;
          var o = new THREE.Mesh(new THREE.SphereGeometry(.42, 12, 10), glow(s.color, 1)); o.position.set(lx, 1, lz); s.g.add(o);
          var tag = makeTag(L, "#ffffff", 1.2); tag.position.set(lx, 2.1, lz); s.g.add(tag); var w = s.toWorld(lx, lz);
          s.task.items.push({ mesh: o, tag: tag, L: L, x: w.x, z: w.z, got: false, ph: i });
        });
        updaters.push(function (t) { if (reduceMotion) return; s.task.items.forEach(function (it) { if (!it.got) { it.mesh.position.y = 1 + Math.sin(t * 2.5 + it.ph) * .18; it.tag.position.y = 2.1 + Math.sin(t * 2.5 + it.ph) * .18; } }); });
      } else if (act.type === "pads") {
        var k = act.options.length, spread = 4.6;
        s.task = { type: "pad", answer: act.answer, onPad: null, pads: [] };
        act.options.forEach(function (opt, i) {
          var x = (i - (k - 1) / 2) * spread;
          s.task.pads.push(makePad(s, x, -3.4, opt));
          if (opt.bars) {
            var a = new THREE.Mesh(new THREE.BoxGeometry(1.3, Math.max(.2, opt.bars[0] / 10), 1.3), M("#9aa3b8")); a.position.set(x - .8, Math.max(.2, opt.bars[0] / 10) / 2, 1.5); s.g.add(a);
            var b = new THREE.Mesh(new THREE.BoxGeometry(1.3, Math.max(.2, opt.bars[1] / 10), 1.3), glow(s.color, .45)); b.position.set(x + .8, Math.max(.2, opt.bars[1] / 10) / 2, 1.5); s.g.add(b);
            var lb = makeLabel(opt.label, s.color); lb.scale.set(7, 1.09, 1); lb.position.set(x, Math.max(opt.bars[1] / 10, 1) + 1.4, 1.5); s.g.add(lb);
          }
          if (opt.size) {
            var f = figure(opt.size); f.position.set(x, 0, 1.5); s.g.add(f);
            var l1 = makeLabel(opt.label, "#ffffff"); l1.scale.set(6, .94, 1); l1.position.set(x, 3.2 * opt.size + .8, 1.5); s.g.add(l1);
            (function (fig, big) { updaters.push(function (t) { if (reduceMotion) return; if (big) fig.rotation.y = Math.sin(t * .4) * .3; else fig.position.y = Math.abs(Math.sin(t * 3 + x)) * .25; }); })(f, opt.size >= 2);
          }
        });
      } else if (act.type === "tune" && act.visual) {
        var builder = act.visual.kind === "grid" ? gridVisual(s, !!act.visual.leader) : circleVisual(s);
        var env = {}; act.controls.forEach(function (c) { env[c.id] = c.value; });
        s.api = { build: function (e) { builder(evalExpr(act.visual.count, e), evalExpr(act.visual.extra, e)); } };
        s.api.build(env);
      } else if (act.type === "race") {
        var gears = [], labels = [];
        act.bars.forEach(function (bar, i) {
          var gr = new THREE.Group();
          var ring = new THREE.Mesh(new THREE.TorusGeometry(2.1, .32, 6, 28), M("#c8cdd8", { emissive: "#000000" })); gr.add(ring);
          for (var ti = 0; ti < 12; ti++) { var ta = ti / 12 * Math.PI * 2; var tooth = new THREE.Mesh(new THREE.BoxGeometry(.5, .6, .5), M("#c8cdd8")); tooth.position.set(Math.cos(ta) * 2.5, Math.sin(ta) * 2.5, 0); tooth.rotation.z = ta; gr.add(tooth); }
          var hub = new THREE.Mesh(new THREE.CylinderGeometry(.5, .5, .6, 8), stoneMat); hub.rotation.x = Math.PI / 2; gr.add(hub);
          var x = (i - (act.bars.length - 1) / 2) * 4.8; gr.position.set(x, 3.4, 0); s.g.add(gr); gears.push(gr);
          var tag = bar.tag || bar.label.split(/\s+/)[0];
          var lb = makeLabel(tag, "#ffffff"); lb.scale.set(5.5, .86, 1); lb.position.set(x, 6.9, 0); s.g.add(lb); labels.push(lb);
        });
        var mx = Math.max.apply(null, act.bars.map(function (b) { return b.value; })) || 1;
        var speeds = act.bars.map(function (b) { return b.value / mx; });
        var hot = act.bars.map(function (b) { return b.value; }).indexOf(mx);
        gears.forEach(function (gg, i) { gg.children[0].material.emissive.set(i === hot ? s.color : "#000000"); gg.children[0].material.emissiveIntensity = i === hot ? .8 : 0; });
        s.recolor = function (c) { gears[hot].children[0].material.emissive.set(c); };
        updaters.push(function (t, dt) { var kk = reduceMotion ? 0 : 1; gears.forEach(function (gg, i) { gg.rotation.z += dt * 2.2 * speeds[i] * kk * (i % 2 ? -1 : 1); }); });
      }
    });

    /* ---------- HUD tray & minimap ---------- */
    function renderTray() {
      tray.textContent = "";
      STATIONS.forEach(function (s) {
        var on = !!state.done[s.id]; var d = el("div", { class: "nthview-gem" + (on ? " nthview-on" : ""), text: String(s.idx + 1) });
        d.title = "Lesson " + (s.idx + 1) + ": " + s.name + (on ? ", finished " + starsText(state.stars[s.id] || 0) : ""); if (on) d.style.background = s.color; tray.appendChild(d);
      });
      tray.setAttribute("aria-label", "Lessons finished: " + state.doneCount + " of " + N);
    }
    var mctx = mini.getContext("2d");
    function drawMini(t) {
      if (!mctx) return; var MW = mini.width, cx = MW / 2, k = MW / 2 / (R_RING + R_ISLE + 5); mctx.clearRect(0, 0, MW, MW);
      var ink = css("--ink") || "#17203d", tgt = nextTarget();
      mctx.strokeStyle = ink; mctx.globalAlpha = .35; mctx.lineWidth = 5;
      STATIONS.forEach(function (s) { mctx.beginPath(); mctx.moveTo(cx + s.dir.x * R_HUB * k, cx - s.dir.z * R_HUB * k); mctx.lineTo(cx + s.x * k, cx - s.z * k); mctx.stroke(); });
      mctx.globalAlpha = 1;
      var isle = function (x, z, r, fill, stroke) { mctx.beginPath(); mctx.arc(cx + x * k, cx - z * k, r * k, 0, Math.PI * 2); mctx.fillStyle = fill; mctx.fill(); if (stroke) { mctx.lineWidth = 4; mctx.strokeStyle = stroke; mctx.stroke(); } };
      isle(0, 0, R_HUB, css("--sand") || "#e3cf9f", state.doneCount === N ? "#ffd76a" : null);
      STATIONS.forEach(function (s) { var done = !!state.done[s.id]; isle(s.x, s.z, R_ISLE, done ? s.color : (css("--sand") || "#e3cf9f"), s.isNext ? "#ffd76a" : null); if (!done && !s.isNext) { mctx.globalAlpha = .35; isle(s.x, s.z, R_ISLE, ink, null); mctx.globalAlpha = 1; } });
      if (tgt === "summit" && !state.finished) { mctx.beginPath(); mctx.arc(cx, cx, 5 + Math.sin(t * 4) * 2, 0, Math.PI * 2); mctx.fillStyle = "#ffd76a"; mctx.fill(); }
      var pp = player.position; mctx.save(); mctx.translate(cx + pp.x * k, cx - pp.z * k); mctx.rotate(Math.PI - yaw);
      mctx.fillStyle = ink; mctx.beginPath(); mctx.moveTo(0, -9); mctx.lineTo(6, 6); mctx.lineTo(0, 3); mctx.lineTo(-6, 6); mctx.closePath(); mctx.fill(); mctx.restore();
    }

    /* ---------- panel helpers ---------- */
    function openPanel(accent) { panel.style.setProperty("--accent", accent); panel.classList.add("nthview-open"); state.panelOpen = true; keys = {}; joyVec.x = joyVec.y = 0; panel.scrollTop = 0; sfx("open"); setTimeout(function () { closeBtn.focus({ preventScroll: true }); }, 60); }
    function closePanel() { panel.classList.remove("nthview-open"); state.panelOpen = false; guideKey = ""; canvas.focus({ preventScroll: true }); }
    closeBtn.addEventListener("click", closePanel);

    function quiz(host, o) {
      var box = el("div", { class: "nthview-quiz" }); box.appendChild(p("nthview-q", o.q.question));
      var list = el("div", { class: "nthview-opts" }), fb = el("div", { class: "nthview-fb", "aria-live": "polite" });
      var finished = false;
      var done = function (st) { finished = true; fb.className = "nthview-fb nthview-ok"; fb.textContent = (o.q.okText || "Correct!") + " " + starsText(st) + (st === 3 ? " First try!" : ""); Array.prototype.forEach.call(list.querySelectorAll("button"), function (x) { x.disabled = true; }); };
      o.q.options.forEach(function (opt) {
        var b = el("button", { type: "button", class: "nthview-opt", text: opt.text }); if (o.solved && opt.correct) b.classList.add("nthview-right");
        b.addEventListener("click", function () {
          if (finished) return; attempt(o.key);
          if (opt.correct) { b.classList.add("nthview-right"); var st = award(o.key); sfx("ok"); done(st); if (o.onSolve) o.onSolve(st); }
          else { b.classList.add("nthview-wrong"); b.disabled = true; sfx("no"); fb.className = "nthview-fb nthview-no"; fb.textContent = opt.why || "Not quite. Read the box above again and try once more."; }
        });
        list.appendChild(b);
      });
      if (o.solved) done(state.stars[o.key] || 1);
      box.appendChild(list); box.appendChild(fb); host.appendChild(box); return box;
    }
    function head(s) { pbody.textContent = ""; pbody.appendChild(el("p", { class: "nthview-kicker", text: "Lesson " + (s.idx + 1) + " of " + N })); pbody.appendChild(el("h2", { text: s.name })); }
    function box(title, cls) { var d = el("div", { class: "nthview-box" + (cls ? " " + cls : "") }); if (title) d.appendChild(el("p", { class: "nthview-box-title", text: title })); return d; }
    function barRow(label, value, show, style) {
      var bar = el("div", { class: "nthview-bar" + (style === "grey" ? " nthview-grey" : style === "dashed" ? " nthview-dashed" : "") }); bar.style.width = value + "%";
      return el("div", { class: "nthview-frow" }, [el("div", { class: "nthview-flabel", text: label }), el("div", { class: "nthview-fline" }, [el("div", { class: "nthview-track" }, [bar]), el("b", { text: show })])]);
    }
    function findings(f) {
      var d = box("What the scientists found"); var cap = el("p", { class: "nthview-cap", text: f.caption || "Right answers out of 100 questions" }); cap.style.marginTop = "0"; d.appendChild(cap);
      f.rows.forEach(function (r) { d.appendChild(barRow(r.label, r.value, r.show, r.style)); });
      if (f.text) { var t = p("", f.text); t.style.margin = "10px 0 0"; d.appendChild(t); }
      return d;
    }
    function remember(s) {
      var r = el("div", { class: "nthview-remember" });
      r.appendChild(el("p", { class: "nthview-stars-earned", "aria-label": (state.stars[s.id] || 0) + " stars", text: starsText(state.stars[s.id] || 0) }));
      r.appendChild(el("p", { class: "nthview-box-title", text: "Remember" }));
      var t = p("", s.data.remember); t.style.margin = "0"; r.appendChild(t);
      var nxt = s.idx < N - 1 ? STATIONS[s.idx + 1] : "summit";
      r.appendChild(btn(nxt === "summit" ? "Walk me to " + lower(data.finale.name) : "Walk me to lesson " + (nxt.idx + 1) + ": " + nxt.name, "nthview-primary", function () { startWalk(nxt); }));
      return r;
    }
    function lower(s) { return s.charAt(0).toLowerCase() + s.slice(1); }
    function earn(s) {
      if (state.done[s.id]) return; state.done[s.id] = true; state.doneCount++; renderTray(); refreshWorld(); guideKey = "";
      burst(s.x, 3, s.z, s.color); burst(crown[s.idx].p.position.x, crown[s.idx].p.position.y + 2, crown[s.idx].p.position.z, s.color, 50); roboJump = 1;
      if (state.doneCount === N) { sfx("win"); toast("All " + N + " lessons done! " + data.finale.name + " in the middle is open."); } else toast("Lesson " + (s.idx + 1) + " done. " + (N - state.doneCount) + " to go.");
    }
    function stepper(host, label, min, max, val, onChange) {
      var out = el("b", { "aria-live": "polite", text: String(val) });
      var minus = el("button", { type: "button", "aria-label": "Fewer: " + label, text: "−" }), plus = el("button", { type: "button", "aria-label": "More: " + label, text: "+" });
      var row = el("div", { class: "nthview-stepper" }, [el("span", { text: label }), el("span", { class: "nthview-ctl" }, [minus, out, plus])]);
      var set = function (v) { val = Math.max(min, Math.min(max, v)); out.textContent = String(val); minus.disabled = val <= min; plus.disabled = val >= max; onChange(val); };
      minus.addEventListener("click", function () { set(val - 1); }); plus.addEventListener("click", function () { set(val + 1); }); host.appendChild(row); set(val);
    }
    function taskBox(text) {
      var d = box("Your task on this island", "nthview-task"); var t = p("", text); t.style.margin = "0"; d.appendChild(t);
      var row = el("div", { class: "nthview-row" }); row.style.marginTop = "12px"; row.appendChild(btn("Close this and go", "nthview-primary", closePanel)); d.appendChild(row); return d;
    }

    /* ---------- activities inside the panel ---------- */
    var ACTIVITIES = {
      collect: function (s, act) {
        var task = s.task, complete = task.collected.length >= task.total;
        if (!complete) {
          pbody.appendChild(taskBox(act.prompt + (task.collected.length ? " You have " + task.collected.length + " of " + task.total + "." : "")));
          pbody.appendChild(el("p", { class: "nthview-cap", text: "The question appears here once you have all " + task.total + " answers." }));
          return false;
        }
        var counts = {}; task.collected.forEach(function (a) { counts[a] = (counts[a] || 0) + 1; });
        var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
        var d = box(act.resultTitle || "The vote");
        d.appendChild(el("div", { class: "nthview-robots" }, task.collected.map(function (a) { return el("span", { class: "nthview-rb" + (a === top ? " nthview-win" : ""), text: "🤖" }, [el("b", { text: a })]); })));
        d.appendChild(el("p", { class: "nthview-readout", text: fillTemplate(act.resultText, { top: top, count: counts[top], total: task.total }) }));
        if (act.resultNote) d.appendChild(p("nthview-cap", act.resultNote));
        pbody.appendChild(d); return true;
      },
      pads: function (s, act) {
        if (!state.done[s.id]) { pbody.appendChild(taskBox(act.prompt)); return false; }
        return true;
      },
      story: function (s, act) {
        var w = box(act.title || "Try it"); var row = el("div", { class: "nthview-row" }); var story = el("div", { class: "nthview-story" }); var step = 1;
        var draw = function () { story.textContent = ""; act.frames.slice(0, step).forEach(function (f) { story.appendChild(p("", f)); }); next.disabled = step >= act.frames.length; };
        var next = btn(act.buttonLabel, "nthview-primary", function () { step++; sfx("step"); draw(); });
        var reset = btn(act.resetLabel || "Start over", "", function () { step = 1; draw(); });
        row.appendChild(next); row.appendChild(reset); w.appendChild(row); w.appendChild(story); if (act.caption) w.appendChild(p("nthview-cap", act.caption)); pbody.appendChild(w); draw(); return true;
      },
      tune: function (s, act) {
        var w = box(act.title || "Try it"); pbody.appendChild(w);
        var env = {}; act.controls.forEach(function (c) { env[c.id] = c.value; });
        var exprs = function (src) { var c = compileExpr(src); return c.fn ? String(Math.round(c.fn(env) * 100) / 100) : null; };
        var readout = el("p", { class: "nthview-readout" }), pile = el("div", { class: "nthview-pile", "aria-hidden": "true" }), fb = el("p", { class: "nthview-fb", "aria-live": "polite" });
        var out = el("div"); out.appendChild(readout); if (act.tally) out.appendChild(pile);
        var ready = false;
        var upd = function () {
          if (s.api) s.api.build(env);
          var r = null; for (var i = 0; i < act.readout.length; i++) { var c = act.readout[i]; if (c.when === undefined || evalExpr(c.when, env)) { r = c; break; } }
          readout.textContent = r ? fillTemplate(r.text, null, exprs) : "";
          if (act.tally) { var n = Math.max(0, Math.round(evalExpr(act.tally.count, env))); pile.textContent = act.tally.icon.repeat(Math.min(n, act.tally.max || 30)); }
          fb.textContent = ""; fb.className = "nthview-fb";
        };
        act.controls.forEach(function (c) { stepper(w, c.label, c.min, c.max, c.value, function (v) { env[c.id] = v; if (ready) { sfx("step"); upd(); } }); });
        if (act.outcomes) {
          var row = el("div", { class: "nthview-row" }); row.style.marginTop = "10px";
          row.appendChild(btn(act.outcomes.buttonLabel, "nthview-primary", function () {
            var hit = null; for (var i = 0; i < act.outcomes.cases.length; i++) { if (evalExpr(act.outcomes.cases[i].when, env)) { hit = act.outcomes.cases[i]; break; } }
            hit = hit || act.outcomes.fallback;
            fb.className = "nthview-fb" + (hit.tone === "ok" ? " nthview-ok" : hit.tone === "no" ? " nthview-no" : ""); fb.textContent = hit.text;
            if (hit.tone === "ok") { sfx("ok"); burst(s.x, 4, s.z, s.color, 60); } else if (hit.tone === "no") sfx("no"); else sfx("pick");
          }));
          out.appendChild(row); out.appendChild(fb);
        }
        if (act.caption) out.appendChild(p("nthview-cap", act.caption));
        w.appendChild(out); ready = true; upd(); return true;
      },
      race: function (s, act) {
        var w = box(act.title || "Try it"); var row = el("div", { class: "nthview-row" }); var bars = [];
        row.appendChild(btn(act.buttonLabel, "nthview-primary", function () {
          bars.forEach(function (b) { b.bar.style.width = "0%"; b.val.textContent = ""; }); sfx("step");
          requestAnimationFrame(function () { requestAnimationFrame(function () { bars.forEach(function (b) { b.bar.style.width = b.value + "%"; }); setTimeout(function () { bars.forEach(function (b) { b.val.textContent = b.show; }); sfx("pick"); }, reduceMotion ? 0 : 1300); }); });
        }));
        w.appendChild(row);
        act.bars.forEach(function (b) { var r = barRow(b.label, 0, "", "normal"); var bar = r.querySelector(".nthview-bar"), val = r.querySelector("b"); bars.push({ bar: bar, val: val, value: b.value, show: b.show }); w.appendChild(r); });
        if (act.caption) w.appendChild(p("nthview-cap", act.caption)); pbody.appendChild(w); return true;
      }
    };

    function openLesson(s) {
      stopWalk();
      var isl = s.data, done = !!state.done[s.id];
      head(s); pbody.appendChild(p("nthview-lead", isl.lead)); (isl.body || []).forEach(function (t) { pbody.appendChild(p("", t)); });
      var isPads = isl.activity && isl.activity.type === "pads";
      if (isl.findings && !isl.findings.after) pbody.appendChild(findings(isl.findings));
      var ready = true;
      if (isl.activity) ready = ACTIVITIES[isl.activity.type](s, isl.activity);
      if (isl.aside) { var ad = box(isl.aside.title); var at = p("", isl.aside.text); at.style.margin = "0"; ad.appendChild(at); pbody.appendChild(ad); }
      if (ready && isl.findings && isl.findings.after) pbody.appendChild(findings(isl.findings));
      if (ready) {
        if (isPads) { if (done) pbody.appendChild(remember(s)); }
        else {
          quiz(pbody, { key: s.id, q: isl.quiz, solved: done, onSolve: function () { earn(s); pbody.appendChild(remember(s)); } });
          if (done) pbody.appendChild(remember(s));
        }
      }
      openPanel(s.color);
    }

    function choosePad(s, pad) {
      if (state.done[s.id]) return;
      attempt(s.id);
      if (pad.id === s.task.answer) { award(s.id); sfx("ok"); earn(s); setTimeout(function () { openLesson(s); }, 500); }
      else { sfx("no"); toast(pad.why || "Not this one."); }
    }

    function openExam() {
      stopWalk();
      pbody.textContent = ""; pbody.appendChild(el("p", { class: "nthview-kicker", text: "Final step" })); pbody.appendChild(el("h2", { text: data.finale.name })); pbody.appendChild(p("nthview-lead", data.finale.lead));
      var host = el("div"); pbody.appendChild(host);
      var qs = data.finale.questions;
      var next = function (i) { if (i >= qs.length) { setTimeout(finish, 1100); return; } quiz(host, { key: "exam" + i, q: qs[i], onSolve: function () { setTimeout(function () { next(i + 1); }, 500); } }); };
      next(0);
      openPanel("#ffd76a");
    }

    function showReport() {
      var st = totalStars(), c = state.coins, r = data.report, tiers = r.tiers || {};
      endCard.textContent = "";
      endCard.appendChild(el("h1", { text: r.heading }));
      endCard.appendChild(el("div", { class: "nthview-scorecard" }, [
        el("div", {}, [el("span", { class: "nthview-star", "aria-hidden": "true", text: "★" }), doc.createTextNode(" Stars"), el("b", { text: st + " of " + maxStars })]),
        el("div", {}, [el("span", { class: "nthview-coin", "aria-hidden": "true" }), doc.createTextNode(" Coins left"), el("b", { text: String(c) })])]));
      var msg = st === maxStars ? (tiers.perfect || "Every answer right on the first try.") : st >= maxStars * .8 ? (tiers.great || "Almost perfect.") : (tiers.pass || "You made it through! Play again to earn more stars.");
      endCard.appendChild(p("nthview-big", msg));
      endCard.appendChild(p("", "**What you learned**"));
      endCard.appendChild(el("ol", {}, r.lessons.map(function (l) { var li = el("li"); li.appendChild(rich(l)); return li; })));
      if (r.glossary && r.glossary.length) {
        if (r.glossaryIntro) endCard.appendChild(p("", r.glossaryIntro));
        var cols = r.glossaryColumns || ["In this game", "In the paper"];
        var table = el("table", { class: "nthview-t" }, [el("tr", {}, [el("th", { text: cols[0] }), el("th", { text: cols[1] })])]);
        r.glossary.forEach(function (g) { table.appendChild(el("tr", {}, [el("td", { text: g.term }), el("td", { text: g.meaning })])); });
        endCard.appendChild(table);
      }
      if (r.source) {
        var sp = el("p", { class: "nthview-small" }); sp.appendChild(doc.createTextNode("Source: "));
        if (r.source.url) { var a = el("a", { href: r.source.url, target: "_blank", rel: "noopener noreferrer", text: r.source.label }); sp.appendChild(a); }
        else sp.appendChild(el("b", { text: r.source.label }));
        if (r.source.note) sp.appendChild(doc.createTextNode(" " + r.source.note));
        endCard.appendChild(sp);
      }
      var again = btn("Play again", "nthview-primary", function () { root.location.reload(); });
      var roam = btn("Keep exploring", "", function () { end.classList.add("nthview-hidden"); guideKey = ""; canvas.focus(); });
      endCard.appendChild(el("div", { class: "nthview-actions" }, [again, roam]));
      end.classList.remove("nthview-hidden"); again.focus();
    }
    function finish() { if (!state.finished) { state.finished = true; sfx("win"); burst(0, 6, 0, "#ffd76a", 200); roboJump = 1; } closePanel(); showReport(); }

    /* ---------- auto-walk ---------- */
    var auto = null;
    var angOf = function (x, z) { return Math.atan2(x, z); };
    var ringPt = function (a, r) { r = r || RING_ROAD; return { x: Math.sin(a) * r, z: Math.cos(a) * r }; };
    var islePt = function (s) { return { x: s.dir.x * (R_RING - 4), z: s.dir.z * (R_RING - 4) }; };
    function areaStation(pp) { for (var i = 0; i < N; i++) { var s = STATIONS[i]; if (Math.hypot(pp.x - s.x, pp.z - s.z) < R_ISLE + .5 || segDist(pp.x, pp.z, s.bridge) < 2) return s; } return null; }
    function buildRoute(target) {
      var pp = player.position, pts = [], cur = areaStation(pp), tS = target === "summit" ? null : target;
      if (cur && cur === tS) { pts.push(islePt(cur)); return pts; }
      var a;
      if (cur) { a = cur.angle; pts.push(ringPt(a)); }
      else { var r = Math.hypot(pp.x, pp.z); a = r < 1 ? (tS ? tS.angle : 0) : angOf(pp.x, pp.z); if (tS) pts.push(ringPt(a)); }
      if (!tS) { pts.push(ringPt(a, 4.3)); return pts; }
      var d = tS.angle - a; d = Math.atan2(Math.sin(d), Math.cos(d));
      var n = Math.max(1, Math.ceil(Math.abs(d) / .4));
      for (var k = 1; k <= n; k++) pts.push(ringPt(a + d * k / n));
      pts.push(islePt(tS)); return pts;
    }
    function startWalk(target) { if (state.panelOpen) closePanel(); auto = { pts: buildRoute(target), target: target }; guideKey = ""; }
    function stopWalk() { if (auto) { auto = null; guideKey = ""; } }
    function arriveAt(t) { setTimeout(function () { if (state.panelOpen) return; if (t === "summit") { if (state.doneCount === N) openExam(); } else if (isUnlocked(t)) openLesson(t); }, 300); }

    /* ---------- guide card ---------- */
    var guideKey = "", guidePrimary = null, arrowTarget = null, nearby = null;
    function setGuide(small, big, actions, accent, arrow) {
      gSmall.textContent = small; gBig.textContent = big; gActions.textContent = "";
      actions.forEach(function (a, i) { gActions.appendChild(btn(a.label, i === 0 ? "nthview-primary" : "", a.fn)); });
      guidePrimary = actions[0] ? actions[0].fn : null;
      guide.style.setProperty("--accent", accent);
      arrowTarget = arrow; gArrow.classList.toggle("nthview-hidden", !arrow);
    }
    function updateGuide() {
      var show = state.started && !state.panelOpen && intro.classList.contains("nthview-hidden") && end.classList.contains("nthview-hidden");
      guide.classList.toggle("nthview-hidden", !show); if (!show) return;
      var tgt = nextTarget(), tName = tgt === "summit" ? data.finale.name : tgt.name, tColor = tgt === "summit" ? "#ffd76a" : tgt.color;
      var tPos = tgt === "summit" ? { x: 0, z: 0 } : { x: tgt.x, z: tgt.z };
      var here = nearby && nearby !== "summit" ? nearby : null;
      var task = here && here.task && !state.done[here.id] && isUnlocked(here) ? here.task : null;
      var mode;
      if (auto) mode = "walking";
      else if (state.finished) mode = "finished";
      else if (task && task.type === "pad" && task.onPad) mode = "pad";
      else if (task && task.type === "collect" && task.collected.length < task.total) mode = "collect";
      else if (nearby && nearby === tgt) mode = "at-target";
      else if (here && state.done[here.id]) mode = "at-done";
      else if (here) mode = "at-locked";
      else if (nearby === "summit") mode = "summit-locked";
      else mode = "roam";
      var key = mode + "|" + tName + "|" + (here ? here.id : String(nearby)) + "|" + (task && task.type === "collect" ? task.collected.length : "") + "|" + (task && task.onPad ? task.onPad.id : "");
      if (key !== guideKey) {
        guideKey = key;
        var walkBtn = { label: "Walk me there", fn: function () { startWalk(tgt); } };
        var lessonNo = tgt === "summit" ? "" : "lesson " + (tgt.idx + 1);
        var finaleLower = lower(data.finale.name);
        if (mode === "walking") setGuide("On the way to", auto.target === "summit" ? data.finale.name : auto.target.name, [{ label: "Stop walking", fn: stopWalk }], auto.target === "summit" ? "#ffd76a" : auto.target.color, null);
        else if (mode === "finished") setGuide(hero + " passed the exam", "Explore as long as you like", [{ label: "See my report card", fn: showReport }], "#1fa874", null);
        else if (mode === "pad") setGuide("Standing on the pad", task.onPad.label, [{ label: "Choose this one", fn: function () { choosePad(here, task.onPad); } }, { label: "Read the lesson", fn: function () { openLesson(here); } }], here.color, null);
        else if (mode === "collect") setGuide("Answers collected: " + task.collected.length + " of " + task.total, task.collected.length ? "Keep going, walk into the rest" : "Walk into the glowing letters", [{ label: "Read the lesson", fn: function () { openLesson(here); } }], here.color, null);
        else if (mode === "at-target") setGuide(tgt === "summit" ? "You made it" : "You're at lesson " + (tgt.idx + 1), tName, [{ label: tgt === "summit" ? "Take " + finaleLower : (tgt.task ? "Start the task" : "Start the lesson"), fn: function () { if (tgt === "summit") openExam(); else openLesson(tgt); } }], tColor, null);
        else if (mode === "at-done") setGuide("Lesson " + (here.idx + 1) + ", done " + starsText(state.stars[here.id] || 0), here.name, [{ label: tgt === "summit" ? "Walk me to " + finaleLower : "Walk me to " + lessonNo, fn: function () { startWalk(tgt); } }, { label: "Read it again", fn: function () { openLesson(here); } }], here.color, tPos);
        else if (mode === "at-locked") setGuide("Not open yet", "Finish " + lessonNo + " first", [walkBtn], tColor, tPos);
        else if (mode === "summit-locked") setGuide(data.finale.name, "Opens after all " + N + " lessons", [{ label: "Walk me to " + lessonNo, fn: function () { startWalk(tgt); } }], tColor, tPos);
        else setGuide(tgt === "summit" ? "Final step" : "Next up: lesson " + (tgt.idx + 1) + " of " + N, tName, [walkBtn], tColor, tPos);
      }
      if (arrowTarget) { var pp = player.position; var ta = Math.atan2(arrowTarget.x - pp.x, arrowTarget.z - pp.z); var fa = Math.atan2(-Math.sin(yaw), -Math.cos(yaw)); var rel = fa - ta; rel = Math.atan2(Math.sin(rel), Math.cos(rel)); gSvg.style.transform = "rotate(" + rel + "rad)"; }
    }

    /* ---------- input ---------- */
    var keys = {};
    var MOVE_KEYS = ["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"];
    function onKeyDown(e) {
      if (!container.isConnected) return;
      if (e.key === "Escape") { if (state.panelOpen) closePanel(); return; }
      if (state.panelOpen || !state.started) return;
      if (!intro.classList.contains("nthview-hidden") || !end.classList.contains("nthview-hidden")) return;
      if (e.target && e.target.tagName === "BUTTON" && (e.key === "Enter" || e.key === " ")) return;
      if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
      var k = e.key.toLowerCase();
      if (MOVE_KEYS.indexOf(k) !== -1) { keys[k] = true; e.preventDefault(); }
      if (k === "e" || k === "enter") { if (guidePrimary) guidePrimary(); e.preventDefault(); }
    }
    function onKeyUp(e) { delete keys[e.key.toLowerCase()]; }
    function onBlur() { keys = {}; }
    root.addEventListener("keydown", onKeyDown); root.addEventListener("keyup", onKeyUp); root.addEventListener("blur", onBlur);
    var drag = null;
    canvas.addEventListener("pointerdown", function (e) { drag = { id: e.pointerId, x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); canvas.focus({ preventScroll: true }); });
    canvas.addEventListener("pointermove", function (e) { if (!drag || drag.id !== e.pointerId) return; var dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.x = e.clientX; drag.y = e.clientY; yaw -= dx * .006; pitch = Math.max(.05, Math.min(1.1, pitch + dy * .004)); });
    var endDrag = function (e) { if (drag && drag.id === e.pointerId) drag = null; };
    canvas.addEventListener("pointerup", endDrag); canvas.addEventListener("pointercancel", endDrag);
    var joyVec = { x: 0, y: 0 }, joyId = null;
    function joyMove(e) { var r = joy.getBoundingClientRect(); var x = (e.clientX - r.left - r.width / 2) / (r.width / 2), y = (e.clientY - r.top - r.height / 2) / (r.height / 2); var l = Math.hypot(x, y); if (l > 1) { x /= l; y /= l; } joyVec.x = x; joyVec.y = y; knob.style.transform = "translate(" + x * 34 + "px," + y * 34 + "px)"; }
    joy.addEventListener("pointerdown", function (e) { joyId = e.pointerId; joy.setPointerCapture(e.pointerId); joyMove(e); });
    joy.addEventListener("pointermove", function (e) { if (e.pointerId === joyId) joyMove(e); });
    var joyEnd = function (e) { if (e.pointerId !== joyId) return; joyId = null; joyVec.x = joyVec.y = 0; knob.style.transform = ""; };
    joy.addEventListener("pointerup", joyEnd); joy.addEventListener("pointercancel", joyEnd);

    helpBtn.addEventListener("click", function () { intro.classList.remove("nthview-hidden"); startBtn.textContent = "Back to the islands"; startBtn.focus(); });
    function onStart() { intro.classList.add("nthview-hidden"); guideKey = ""; sfx("open"); if (!state.started) { state.started = true; toast("Press \"Walk me there\" at the bottom to reach lesson 1. Grab the coins on the bridge!"); } canvas.focus(); }

    /* ---------- loop ---------- */
    var clock = new THREE.Clock(); var frame = 0; var camTarget = new THREE.Vector3(); var alive = true;
    function tick() {
      if (!alive || !container.isConnected) { alive = false; renderer.dispose(); root.removeEventListener("keydown", onKeyDown); root.removeEventListener("keyup", onKeyUp); root.removeEventListener("blur", onBlur); return; }
      var dt = Math.min(clock.getDelta(), .05), t = clock.elapsedTime; frame++;
      var pp = player.position;
      var mx = 0, mz = 0;
      if (state.started && !state.panelOpen) {
        var f = 0, r = 0;
        if (keys.w || keys.arrowup) f += 1; if (keys.s || keys.arrowdown) f -= 1;
        if (keys.a) r -= 1; if (keys.d) r += 1;
        if (keys.arrowleft) yaw += dt * 2.2; if (keys.arrowright) yaw -= dt * 2.2;
        f += -joyVec.y; r += joyVec.x;
        var len = Math.hypot(f, r);
        if (len > .15 && auto) stopWalk();
        if (auto) {
          var w = auto.pts[0], dx = w.x - pp.x, dz = w.z - pp.z, d = Math.hypot(dx, dz), step = 12 * dt;
          if (d <= step) { pp.x = w.x; pp.z = w.z; auto.pts.shift(); if (!auto.pts.length) { var tg = auto.target; auto = null; guideKey = ""; arriveAt(tg); } }
          else { mx = dx / d * step; mz = dz / d * step; pp.x += mx; pp.z += mz; var want = Math.atan2(-mx, -mz); var dy = want - yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); yaw += dy * Math.min(1, dt * 2.5); }
        } else if (len > .05) {
          var nn = Math.min(1, len); f /= len; r /= len;
          var spd = 11 * nn * dt, fx = -Math.sin(yaw), fz = -Math.cos(yaw), rx = Math.cos(yaw), rz = -Math.sin(yaw);
          mx = (fx * f + rx * r) * spd; mz = (fz * f + rz * r) * spd;
          if (walkable(pp.x + mx, pp.z + mz)) { pp.x += mx; pp.z += mz; } else if (walkable(pp.x + mx, pp.z)) { pp.x += mx; mz = 0; } else if (walkable(pp.x, pp.z + mz)) { pp.z += mz; mx = 0; } else { mx = mz = 0; }
        }
      }
      var moving = !!(mx || mz);
      if (moving) { var targ = Math.atan2(mx, mz); var dd = targ - player.rotation.y; dd = Math.atan2(Math.sin(dd), Math.cos(dd)); player.rotation.y += dd * Math.min(1, dt * 10); body.position.y = 1.1 + Math.abs(Math.sin(t * 9)) * .12; }
      else body.position.y += (1.1 + Math.sin(t * 2) * .06 - body.position.y) * .1;
      halo.rotation.z = t * 1.5;
      (function () {
        var bx = -Math.sin(player.rotation.y) * 1.9, bz = -Math.cos(player.rotation.y) * 1.9; var tx = pp.x + bx, tz = pp.z + bz; var dx = tx - robo.position.x, dz = tz - robo.position.z, d = Math.hypot(dx, dz);
        if (d > .05) { var k = Math.min(1, dt * (d > 6 ? 8 : 3.5)); robo.position.x += dx * k; robo.position.z += dz * k; var want = Math.atan2(dx, dz); var dy = want - robo.rotation.y; dy = Math.atan2(Math.sin(dy), Math.cos(dy)); robo.rotation.y += dy * Math.min(1, dt * 8); }
        if (roboJump > 0) { roboJump = Math.max(0, roboJump - dt * 1.2); robo.position.y = Math.abs(Math.sin(roboJump * Math.PI * 3)) * 1.2 * roboJump; } else robo.position.y = d > .6 && !reduceMotion ? Math.abs(Math.sin(t * 10)) * .15 : 0;
        robo.userData.tip.material.emissiveIntensity = .6 + .4 * Math.sin(t * 4);
      })();
      coinPickups.forEach(function (c) {
        if (c.got) return; c.mesh.rotation.z = t * 2.4; c.mesh.position.y = 1.2 + Math.sin(t * 3 + c.x) * .12;
        if (Math.hypot(pp.x - c.x, pp.z - c.z) < 1.3) { c.got = true; scene.remove(c.mesh); state.coins++; renderScore(); sfx("coin"); burst(c.x, 1.4, c.z, "#f4c55b", 25); }
      });
      var near = null;
      if (Math.hypot(pp.x, pp.z) < 5) near = "summit";
      else for (var i = 0; i < N; i++) if (Math.hypot(pp.x - STATIONS[i].x, pp.z - STATIONS[i].z) < R_ISLE) { near = STATIONS[i]; break; }
      if (near !== nearby) { nearby = near; guideKey = ""; }
      if (near && near !== "summit" && near.task && isUnlocked(near) && !state.done[near.id]) {
        var task = near.task;
        if (task.type === "collect") {
          task.items.forEach(function (it) {
            if (it.got || Math.hypot(pp.x - it.x, pp.z - it.z) >= 1.4) return;
            it.got = true; near.g.remove(it.mesh); near.g.remove(it.tag); task.collected.push(it.L); if (near.pulse) near.pulse(); sfx("pick"); burst(it.x, 1.5, it.z, near.color, 30); guideKey = "";
            if (task.collected.length >= task.total) {
              var counts = {}; task.collected.forEach(function (a) { counts[a] = (counts[a] || 0) + 1; }); var top = Object.keys(counts).sort(function (a, b) { return counts[b] - counts[a]; })[0];
              sfx("win"); roboJump = 1; toast("All " + task.total + " answers collected! Most popular: " + top + "."); setTimeout(function () { if (!state.panelOpen && !auto) openLesson(near); }, 700);
            }
          });
        } else if (task.type === "pad") {
          var on = null; task.pads.forEach(function (pd) { var hit = Math.hypot(pp.x - pd.x, pp.z - pd.z) < 1.9; pd.mesh.material.emissiveIntensity += ((hit ? .7 : 0) - pd.mesh.material.emissiveIntensity) * .2; if (hit) on = pd; });
          if (on !== task.onPad) { task.onPad = on; guideKey = ""; if (on) sfx("step"); }
        }
      }
      updateGuide();
      var dist = 10.5; camTarget.set(pp.x, 1.8, pp.z);
      camera.position.set(pp.x + Math.sin(yaw) * dist * Math.cos(pitch), 1.8 + dist * Math.sin(pitch), pp.z + Math.cos(yaw) * dist * Math.cos(pitch));
      camera.lookAt(camTarget);
      if (!reduceMotion) { for (var vi = 0; vi < seaPos.count; vi++) { var sx = seaPos.getX(vi), sy = seaPos.getY(vi); seaPos.setZ(vi, Math.sin(sx * .05 + t * .9) * .55 + Math.cos(sy * .07 + t * .7) * .45); } seaPos.needsUpdate = true; if (frame % 4 === 0) seaGeo.computeVertexNormals(); }
      obelisk.rotation.y = t * .4;
      var tgt = nextTarget();
      if (tgt === "summit") marker.position.set(0, 11.6 + (reduceMotion ? 0 : Math.sin(t * 2.5) * .5), 0); else marker.position.set(tgt.x, 13.6 + (reduceMotion ? 0 : Math.sin(t * 2.5) * .5), tgt.z);
      marker.rotation.y = t * 1.2; marker.visible = !state.finished;
      STATIONS.forEach(function (s) { s.label.position.y = 10.5 + (reduceMotion ? 0 : Math.sin(t * 1.3 + s.angle) * .25); s.beacon.material.opacity = s.beaconBase + (s.isNext && !reduceMotion ? Math.sin(t * 3) * .12 : 0); });
      updaters.forEach(function (u) { u(t, dt); }); updateBursts(dt);
      if (frame % 3 === 0) drawMini(t);
      renderer.render(scene, camera);
      requestAnimationFrame(tick);
    }

    function onResize() { renderer.setSize(W(), H(), false); camera.aspect = W() / H(); camera.updateProjectionMatrix(); }
    if (root.ResizeObserver) new root.ResizeObserver(onResize).observe(container); else root.addEventListener("resize", onResize);
    var mq = root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)");
    if (mq) { if (mq.addEventListener) mq.addEventListener("change", applyTheme); else if (mq.addListener) mq.addListener(applyTheme); }

    applyTheme(); renderTray(); renderScore(); refreshWorld();
    tick();
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(function () {
      STATIONS.forEach(function (s) { var old = s.label; s.label = makeLabel(s.name, s.color, s.idx + 1); s.label.position.copy(old.position); scene.remove(old); scene.add(s.label); });
      var nl = makeLabel(data.finale.name, "#ffffff"); nl.position.copy(examLabel.position); scene.remove(examLabel); scene.add(nl); examLabel = nl;
      refreshWorld();
    });
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-island-quest");
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
    render(container, data);
    return result;
  };

  NthView.libs = [
    { kind: "script", src: "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js", global: "THREE", name: "three.js r128" },
    { kind: "style", href: "https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&display=swap", name: "Google Fonts (Atkinson Hyperlegible, Bricolage Grotesque)" }
  ];
})(typeof globalThis !== "undefined" ? globalThis : window);
