/* NthView — dataflow renderer — schemaVersion 1
 * Requires scripts/validate.js to be loaded first. No libraries: plain DOM, CSS and inline SVG.
 * Hero introduction, then a three-column lesson: topics, the step with a network or sequence diagram
 * and the message flow, the topic's article and the current message's payload. Optional time machine.
 */
(function (root) {
  "use strict";
  var NthView = root.NthView = root.NthView || {};
  var STYLE_ID = "nthview-style";

  var THEMES = ["graphite", "paper", "blueprint", "amber"];

  /* Surfaces per theme, light and dark. Near-monochrome plus one warm accent.
     --df-rgb is the text colour as "r,g,b" so hairlines and tints derive from it. */
  var PALETTES = {
    graphite: { side: "dark",
      dark: "--nv-bg:#191615;--nv-fg:#f5f3ef;--nv-muted:#a9a49c;--nv-accent:#fbbf24;--nv-border:#3a3632;--nv-error:#f97066;--df-rgb:245,243,239;--df-panel:#1e1b19;--df-accent-ink:#191615;--df-good:#34d399;--df-bad:#f97066;--df-head:system-ui,-apple-system,'Segoe UI',Roboto,Inter,sans-serif",
      light: "--nv-bg:#f5f3ef;--nv-fg:#191615;--nv-muted:#5f5a54;--nv-accent:#9c4705;--nv-border:#d9d5ce;--nv-error:#b42318;--df-rgb:25,22,21;--df-panel:#fbfaf7;--df-accent-ink:#fff;--df-good:#047857;--df-bad:#b42318;--df-head:system-ui,-apple-system,'Segoe UI',Roboto,Inter,sans-serif" },
    paper: { side: "light",
      light: "--nv-bg:#f4efe6;--nv-fg:#1d1a16;--nv-muted:#5f574c;--nv-accent:#8a3b12;--nv-border:#dcd2c2;--nv-error:#b91c1c;--df-rgb:29,26,22;--df-panel:#fbf8f2;--df-accent-ink:#fff;--df-good:#2f6b3a;--df-bad:#b91c1c;--df-head:Georgia,'Iowan Old Style','Times New Roman',serif",
      dark: "--nv-bg:#1a1814;--nv-fg:#f1ebe0;--nv-muted:#b4a996;--nv-accent:#f2a474;--nv-border:#3b362e;--nv-error:#f87171;--df-rgb:241,235,224;--df-panel:#201d18;--df-accent-ink:#1a1814;--df-good:#8fd3a0;--df-bad:#f87171;--df-head:Georgia,'Iowan Old Style','Times New Roman',serif" },
    blueprint: { side: "dark",
      dark: "--nv-bg:#0b1626;--nv-fg:#dce8f7;--nv-muted:#93a8c4;--nv-accent:#4fd1e8;--nv-border:#243752;--nv-error:#fb7185;--df-rgb:220,232,247;--df-panel:#0f1c30;--df-accent-ink:#0b1626;--df-good:#5eead4;--df-bad:#fb7185;--df-head:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace",
      light: "--nv-bg:#e6eef9;--nv-fg:#0c1d33;--nv-muted:#41587a;--nv-accent:#0b6480;--nv-border:#c1d2e8;--nv-error:#b91c1c;--df-rgb:12,29,51;--df-panel:#f6f9fe;--df-accent-ink:#fff;--df-good:#0f766e;--df-bad:#b91c1c;--df-head:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace" },
    amber: { side: "light",
      light: "--nv-bg:#faf3e3;--nv-fg:#221b10;--nv-muted:#6a5a3f;--nv-accent:#924e00;--nv-border:#e5d9c0;--nv-error:#b42318;--df-rgb:34,27,16;--df-panel:#fffaf0;--df-accent-ink:#fff;--df-good:#3f6f2a;--df-bad:#b42318;--df-head:system-ui,-apple-system,'Segoe UI',Roboto,Inter,sans-serif",
      dark: "--nv-bg:#1c1611;--nv-fg:#f6ecdc;--nv-muted:#b9a98f;--nv-accent:#f5b342;--nv-border:#3d3328;--nv-error:#f97066;--df-rgb:246,236,220;--df-panel:#231c15;--df-accent-ink:#1c1611;--df-good:#9ad17d;--df-bad:#f97066;--df-head:system-ui,-apple-system,'Segoe UI',Roboto,Inter,sans-serif" }
  };

  /* Channel colours: one hue set per scheme, the same names in every theme. --df-h-* is the line and text
     colour, --df-t-* a tint for outlined dots. */
  var HUES = ["slate", "amber", "green", "blue", "red", "teal", "violet", "pink"];
  var HUES_LIGHT = "--df-h-slate:#4a5563;--df-t-slate:#e4e8ec;--df-h-amber:#975008;--df-t-amber:#fbecd7;--df-h-green:#146a41;--df-t-green:#dcefe4;--df-h-blue:#1d4fb8;--df-t-blue:#e1e9fb;--df-h-red:#b42323;--df-t-red:#fbe2e2;--df-h-teal:#0e676c;--df-t-teal:#d9efef;--df-h-violet:#6140b5;--df-t-violet:#ebe5fa;--df-h-pink:#a42f6b;--df-t-pink:#f8e1ec";
  var HUES_DARK = "--df-h-slate:#aab4c0;--df-t-slate:#2a3038;--df-h-amber:#f0b061;--df-t-amber:#3a2a14;--df-h-green:#72d09d;--df-t-green:#163326;--df-h-blue:#93b4ff;--df-t-blue:#1c2a4a;--df-h-red:#ff9393;--df-t-red:#3f1d1d;--df-h-teal:#72d4d7;--df-t-teal:#133536;--df-h-violet:#bda7ff;--df-t-violet:#2a2347;--df-h-pink:#f6a0cb;--df-t-pink:#3b1d2d";

  function themeCss() {
    var out = [], Z = ".nthview-dataflow";
    function vars(p, side) { return p[side] + ";" + (side === "dark" ? HUES_DARK : HUES_LIGHT) + ";color-scheme:" + side; }
    THEMES.forEach(function (t) {
      var p = PALETTES[t], native = p.side, other = native === "dark" ? "light" : "dark";
      out.push(Z + "[data-theme=" + t + "]{" + vars(p, native) + "}");
      out.push(Z + "[data-theme=" + t + "][data-scheme=" + other + "]{" + vars(p, other) + "}");
      out.push(Z + "[data-theme=" + t + "][data-scheme=" + native + "]{" + vars(p, native) + "}");
      out.push("@media (prefers-color-scheme:" + other + "){" + Z + "[data-theme=" + t + "]:not([data-scheme]){" + vars(p, other) + "}}");
    });
    return out.join("\n");
  }
  /* Everything a channel colours: edges and pills on the network, arrows on the sequence, the packet, the dots. */
  function hueCss() {
    return HUES.map(function (h) {
      var c = ".nthview-df-ch-" + h, v = "var(--df-h-" + h + ")", t = "var(--df-t-" + h + ")";
      return [
        ".nthview-df-edge" + c + "{stroke:" + v + "}",
        ".nthview-df-epill" + c + " text{fill:" + v + "}",
        ".nthview-df-sm" + c + " line,.nthview-df-sm" + c + " path{stroke:" + v + "}",
        ".nthview-df-sm" + c + " .nthview-df-ah,.nthview-df-sm" + c + " text{fill:" + v + "}",
        ".nthview-df-sm" + c + ".nthview-df-k-response .nthview-df-ah{fill:var(--nv-bg);stroke:" + v + "}",
        ".nthview-df-pkt" + c + " .nthview-df-pb,.nthview-df-pkt" + c + " .nthview-df-trail{stroke:" + v + "}",
        ".nthview-df-pkt" + c + " .nthview-df-pd,.nthview-df-pkt" + c + " .nthview-df-trailhead{fill:" + v + "}",
        ".nthview-df-dot" + c + "{background:" + v + ";border-color:" + v + ";color:var(--nv-bg)}",
        ".nthview-df-dot" + c + ".nthview-df-k-response,.nthview-df-dot" + c + ".nthview-df-k-notification,.nthview-df-dot" + c + ".nthview-df-k-local{background:" + t + ";color:" + v + "}",
        ".nthview-df-legend " + c + " i,.nthview-df-ir " + c + "{background:" + v + "}"
      ].join("\n");
    }).join("\n");
  }

  var Z = ".nthview-dataflow ";
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
    ".nthview-dataflow{--df-mono:ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace;--df-border:rgba(var(--df-rgb),.14);--df-soft:rgba(var(--df-rgb),.07);--df-hover:rgba(var(--df-rgb),.04);--df-faint:rgba(var(--df-rgb),.3);--df-face-t:rgba(var(--df-rgb),.11);--df-face-l:rgba(var(--df-rgb),.045);--df-face-r:var(--nv-bg);",
    "  max-width:none;padding:0;margin:0;min-height:100vh;display:flex;flex-direction:column;font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}",
    ":where(.nthview-dataflow) button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:left}",
    Z + "a{color:var(--nv-fg);text-decoration-color:var(--df-faint);text-underline-offset:2px}",
    Z + "a:hover{text-decoration-color:var(--nv-fg)}",
    Z + "code,.nthview-dataflow pre,.nthview-df-mono{font-family:var(--df-mono);font-size:.92em}",
    Z + "h1,.nthview-dataflow h2,.nthview-dataflow h3,.nthview-dataflow h4{font-family:var(--df-head);font-weight:500;letter-spacing:-.01em;margin:0}",
    Z + "p{margin:0}",
    ".nthview-df-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}",
    ".nthview-df-muted{color:var(--nv-muted)}",
    ".nthview-df-tag{display:inline-block;font:500 11px/1.4 var(--df-mono);color:var(--nv-accent);border:1px solid currentColor;border-radius:4px;padding:0 5px;margin-left:6px;vertical-align:middle;text-transform:lowercase}",
    ".nthview-df-tag.nthview-df-tag-muted{color:var(--nv-muted)}",
    /* buttons */
    ".nthview-df-btn{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:0 12px;border:1px solid var(--df-border);border-radius:8px;font-size:14px;line-height:1;background:var(--nv-bg);color:var(--nv-fg);white-space:nowrap}",
    ".nthview-df-btn:hover{background:var(--df-hover)}",
    ".nthview-df-btn[disabled]{opacity:.4;cursor:default}",
    ".nthview-df-btn[disabled]:hover{background:var(--nv-bg)}",
    ".nthview-df-btn-primary{background:var(--nv-fg);color:var(--nv-bg);border-color:var(--nv-fg)}",
    ".nthview-df-btn-primary:hover{background:var(--nv-fg);opacity:.9}",
    ".nthview-df-btn svg{width:14px;height:14px;fill:currentColor}",
    ".nthview-df-seg{display:inline-flex;border:1px solid var(--df-border);border-radius:8px;padding:2px;background:var(--df-hover)}",
    ".nthview-df-seg button{min-height:28px;padding:0 10px;border-radius:6px;font-size:12.5px;color:var(--nv-muted)}",
    ".nthview-df-seg button[aria-pressed=true]{background:var(--nv-bg);color:var(--nv-fg);box-shadow:0 1px 2px rgba(0,0,0,.15)}",
    ".nthview-restart{min-height:36px;padding:0 12px;border:1px solid var(--df-border);border-radius:8px;font-size:13px;color:var(--nv-muted);white-space:nowrap}",
    ".nthview-restart:hover{color:var(--nv-fg);background:var(--df-hover)}",
    /* top bar */
    ".nthview-df-top{display:flex;align-items:center;gap:14px;padding:10px 20px;border-bottom:1px solid var(--df-border);flex:0 0 auto;min-height:57px}",
    ".nthview-df-brand{font-family:var(--df-head);font-size:20px;font-weight:500;letter-spacing:-.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:40vw;flex:0 1 auto;min-width:0}",
    ".nthview-df-brand:hover{text-decoration:underline;text-decoration-color:var(--df-faint);text-underline-offset:3px}",
    ".nthview-df-introbtn{font-size:13px;color:var(--nv-muted);white-space:nowrap}",
    ".nthview-df-introbtn:hover{color:var(--nv-fg)}",
    ".nthview-df-topright{margin-left:auto;display:flex;align-items:center;gap:8px}",
    ".nthview-df-scheme{display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border:1px solid var(--df-border);border-radius:8px;color:var(--nv-muted)}",
    ".nthview-df-scheme:hover{color:var(--nv-fg);background:var(--df-hover)}",
    ".nthview-df-scheme svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}",
    /* time machine */
    ".nthview-df-tm{display:flex;align-items:center;gap:14px;margin:0 auto;padding:0 10px;border-left:1px solid var(--df-border)}",
    ".nthview-df-tmh{font-size:12px;color:var(--nv-muted);white-space:nowrap;display:flex;flex-direction:column;line-height:1.3}",
    ".nthview-df-tmh b{font-weight:500;color:var(--nv-fg);font-family:var(--df-mono);font-size:12px}",
    ".nthview-df-tml{display:flex;align-items:flex-start;position:relative;padding-top:6px}",
    ".nthview-df-tml:before{content:'';position:absolute;left:28px;right:28px;top:11px;border-top:1px solid var(--df-faint)}",
    ".nthview-df-tml button{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;min-width:60px;padding:0 8px 4px;font-size:11px;color:var(--nv-muted);white-space:nowrap}",
    ".nthview-df-tml button i{display:block;width:10px;height:10px;border-radius:50%;border:1.5px solid var(--df-faint);background:var(--nv-bg)}",
    ".nthview-df-tml button[aria-pressed=true]{color:var(--nv-fg);font-weight:500}",
    ".nthview-df-tml button[aria-pressed=true] i{background:var(--nv-fg);border-color:var(--nv-fg);transform:scale(1.25)}",
    ".nthview-df-tml button:hover i{border-color:var(--nv-fg)}",
    ".nthview-df-tmselect{display:none}",
    ".nthview-df-fullbtn{display:inline-flex;align-items:center;gap:6px}",
    ".nthview-df-fullbtn svg{width:14px;height:14px}",
    /* the full picture dialog */
    ".nthview-df-dialog{border:1px solid var(--df-border);border-radius:12px;background:var(--nv-bg);color:var(--nv-fg);padding:0;width:min(96vw,1440px);height:min(92vh,1000px);max-width:none;max-height:none;display:flex;flex-direction:column;overflow:hidden;font:14px/1.5 system-ui,-apple-system,'Segoe UI',Roboto,Inter,sans-serif}",
    ".nthview-df-dialog:not([open]){display:none}",
    ".nthview-df-dialog::backdrop{background:rgba(0,0,0,.6)}",
    ".nthview-df-dialog-head{display:flex;align-items:center;gap:16px;padding:14px 20px;border-bottom:1px solid var(--df-border);flex:0 0 auto}",
    ".nthview-df-dialog-head>div:first-child{flex:1;min-width:0}",
    ".nthview-df-dialog-head h2{font-size:18px}",
    ".nthview-df-dialog-head p{font-size:12.5px}",
    ".nthview-df-dialog-body{flex:1;min-height:0;position:relative;background-image:radial-gradient(rgba(var(--df-rgb),.16) 1px,transparent 1.2px);background-size:20px 20px;background-position:10px 10px}",
    ".nthview-df-dialog-body>svg{width:100%;height:100%;display:block}",
    ".nthview-df-seqtopic{font:500 14px var(--df-head);fill:var(--nv-fg)}",
    /* hero */
    ".nthview-df-intro{flex:1;display:grid;grid-template-columns:minmax(380px,520px) minmax(0,1fr);min-height:0}",
    ".nthview-df-hero{display:flex;flex-direction:column;border-right:1px solid var(--df-border);overflow:auto;padding:40px}",
    ".nthview-df-hero-in{max-width:460px;margin:auto 0}",
    ".nthview-df-kicker{font-size:13px;color:var(--nv-muted);margin-bottom:14px}",
    ".nthview-df-hero h2{font-size:clamp(30px,4.6vw,46px);line-height:1.1;margin-bottom:18px}",
    ".nthview-df-lead{font-size:17px;line-height:1.55;color:var(--nv-fg);margin-bottom:26px}",
    ".nthview-df-facts{display:grid;grid-template-columns:auto 1fr;gap:10px 18px;margin:0 0 30px;font-size:14px}",
    ".nthview-df-facts dt{font-weight:500;white-space:nowrap}",
    ".nthview-df-facts dd{margin:0;color:var(--nv-muted)}",
    ".nthview-df-start{min-height:44px;padding:0 18px;font-size:15px;border-radius:10px}",
    ".nthview-df-jumps{margin-top:14px;font-size:13px;color:var(--nv-muted)}",
    ".nthview-df-jumps button{color:var(--nv-fg);text-decoration:underline;text-decoration-color:var(--df-faint);text-underline-offset:2px;font-size:13px}",
    ".nthview-df-jumps button:hover{text-decoration-color:var(--nv-fg)}",
    ".nthview-df-preview{position:relative;display:flex;flex-direction:column;min-height:320px}",
    ".nthview-df-preview .nthview-df-stage{flex:1}",
    ".nthview-df-preview-cap{padding:20px 24px 0;font-size:13px;color:var(--nv-muted)}",
    /* lesson grid */
    ".nthview-df-lesson{flex:1;display:grid;grid-template-columns:316px minmax(0,1fr) 380px;min-height:0;transition:grid-template-columns .5s cubic-bezier(.2,.7,.2,1)}",
    ".nthview-df-side,.nthview-df-right{transition:opacity .3s}",
    ".nthview-df-focus .nthview-df-lesson{grid-template-columns:0 minmax(0,1fr) 0}",
    ".nthview-df-focus .nthview-df-side,.nthview-df-focus .nthview-df-right{opacity:0;overflow:hidden;pointer-events:none}",
    ".nthview-df-stagewrap{display:flex;flex-direction:column;min-height:0;min-width:0}",
    ".nthview-df-side,.nthview-df-right{border-right:1px solid var(--df-border);min-height:0}",
    ".nthview-df-right{border-right:0;border-left:1px solid var(--df-border)}",
    ".nthview-df-center{display:flex;flex-direction:column;min-width:0;min-height:0}",
    "@media (min-width:1024px){.nthview-dataflow{height:100vh}.nthview-df-side,.nthview-df-right{overflow:auto}.nthview-df-intro{overflow:hidden}",
    "  .nthview-df-center{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr) 300px;overflow:hidden}.nthview-df-stage,.nthview-df-flow{min-width:0}.nthview-df-stagewrap{overflow:hidden}.nthview-df-stage{min-height:0}.nthview-df-stage svg{min-height:0}",
    "  .nthview-df-flow{display:flex;flex-direction:column;min-height:0}.nthview-df-tablewrap{flex:1;min-height:0;overflow:auto}.nthview-df-nexttopic{flex:0 0 auto}}",
    /* sidebar */
    ".nthview-df-sidehead{padding:16px 20px 10px;border-bottom:1px solid var(--df-border)}",
    ".nthview-df-sidehead h2{font-size:17px}",
    ".nthview-df-vernote{font-size:12px;color:var(--nv-muted);margin-top:6px}",
    ".nthview-df-gh{padding:18px 20px 6px;font-size:12px;font-weight:500;color:var(--nv-muted)}",
    ".nthview-df-topic{border-top:1px solid var(--df-border)}",
    ".nthview-df-topic:first-child{border-top:0}",
    ".nthview-df-th{display:block;width:100%;padding:10px 20px;min-height:44px}",
    ".nthview-df-th:hover{background:var(--df-hover)}",
    ".nthview-df-topic-open>.nthview-df-th{background:var(--df-soft)}",
    ".nthview-df-th b{font-weight:500;display:block;font-size:14px}",
    ".nthview-df-th em{display:block;font-style:normal;font-size:12px;color:var(--nv-muted)}",
    ".nthview-df-topic-off .nthview-df-th b{color:var(--nv-muted)}",
    ".nthview-df-steps{list-style:none;margin:0;padding:6px 12px 12px 20px}",
    ".nthview-df-steps li button{display:flex;align-items:center;gap:12px;width:100%;min-height:34px;padding:4px 8px;border-radius:6px;font-size:13.5px}",
    ".nthview-df-steps li button:hover{background:var(--df-hover)}",
    ".nthview-df-steps li button[aria-current=step]{background:var(--df-soft)}",
    ".nthview-df-num{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;border:1px solid var(--df-faint);font:11px var(--df-mono);color:var(--nv-muted);flex:0 0 auto}",
    "[aria-current=step] .nthview-df-num{background:var(--nv-fg);color:var(--nv-bg);border-color:var(--nv-fg)}",
    ".nthview-df-num.nthview-df-num-done{border-color:var(--df-good);color:var(--df-good)}",
    ".nthview-df-steps .nthview-df-off{color:var(--nv-muted);font-size:13px;padding:6px 8px;display:flex;gap:12px;align-items:center}",
    ".nthview-df-further a{display:block;padding:10px 20px;text-decoration:none;min-height:44px}",
    ".nthview-df-further a:hover{background:var(--df-hover)}",
    ".nthview-df-further b{display:block;font-weight:500;font-size:15px}",
    ".nthview-df-further em{display:block;font-style:normal;font-size:12px;color:var(--nv-muted)}",
    ".nthview-df-further b:after{content:' ↗';color:var(--nv-muted);font-size:12px}",
    /* phone sub bar and drawer */
    ".nthview-df-subbar{display:none;gap:8px;padding:10px 16px;border-bottom:1px solid var(--df-border);align-items:center}",
    ".nthview-df-subbar select,.nthview-df-tmselect select{min-height:44px;font:inherit;font-size:15px;color:var(--nv-fg);background:var(--nv-bg);border:1px solid var(--df-border);border-radius:8px;padding:0 10px;max-width:100%}",
    ".nthview-df-topicsbtn{min-height:44px;flex:1;justify-content:space-between}",
    ".nthview-df-backdrop{display:none}",
    ".nthview-df-drawerhead{display:none}",
    /* centre: caption, stage, flow */
    ".nthview-df-stagebar{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding:16px 20px 0}",
    ".nthview-df-cap{min-height:84px;flex:1;min-width:0;max-width:680px}",
    "@keyframes nthview-df-fade{from{opacity:0;transform:translateY(3px)}to{opacity:1;transform:none}}",
    ".nthview-df-fadein{animation:nthview-df-fade .28s ease-out}",
    ".nthview-df-eyebrow{font-size:12px;color:var(--nv-muted)}",
    ".nthview-df-cap h2{font-size:21px;line-height:1.2;margin:2px 0 6px}",
    ".nthview-df-expl{font-size:14px;color:var(--nv-fg);opacity:.85;max-width:68ch;text-wrap:pretty}",
    ".nthview-df-expl b{font-weight:600}",
    ".nthview-df-stage{position:relative;min-height:300px;flex:1;display:flex;align-items:stretch;overflow:hidden;outline-offset:-3px;",
    "  background-image:radial-gradient(rgba(var(--df-rgb),.16) 1px,transparent 1.2px);background-size:20px 20px;background-position:10px 10px}",
    ".nthview-df-stage svg{width:100%;height:100%;display:block;min-height:300px}",
    ".nthview-df-stage.nthview-df-absent svg{opacity:.3;filter:grayscale(1)}",
    ".nthview-df-absentmsg{position:absolute;inset:0;display:grid;place-items:center;font-size:14px;color:var(--nv-muted);pointer-events:none;padding:20px;text-align:center}",
    ".nthview-df-flow{border-top:1px solid var(--df-border)}",
    ".nthview-df-fh{display:flex;align-items:center;gap:14px;padding:12px 20px;flex-wrap:wrap}",
    ".nthview-df-fh h2{font-size:16px}",
    ".nthview-df-fh .nthview-df-count{font-size:12px;color:var(--nv-muted)}",
    ".nthview-df-ctrl{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}",
    ".nthview-df-tablewrap{overflow-x:auto}",
    ".nthview-df-table{width:100%;border-collapse:collapse;font-size:13px;min-width:560px}",
    ".nthview-df-table th{text-align:left;font-weight:500;color:var(--nv-muted);padding:6px 10px;border-bottom:1px solid var(--df-border);font-size:12px;white-space:nowrap}",
    ".nthview-df-table td{padding:5px 10px;border-bottom:1px solid var(--df-soft);color:rgba(var(--df-rgb),.78);white-space:nowrap;max-width:340px;overflow:hidden;text-overflow:ellipsis;vertical-align:middle}",
    ".nthview-df-table thead th{position:sticky;top:0;background:var(--nv-bg);z-index:1}",
    ".nthview-df-table th:first-child,.nthview-df-table td:first-child{padding-left:20px;width:48px}",
    ".nthview-df-table tr{cursor:pointer}",
    ".nthview-df-table tr:hover td{background:var(--df-hover)}",
    ".nthview-df-table tr.nthview-df-cur td{background:var(--df-soft);color:var(--nv-fg)}",
    ".nthview-df-table tr.nthview-df-fut td{color:var(--df-faint)}",
    ".nthview-df-table tr.nthview-df-fut .nthview-df-dot{opacity:.55}",
    ".nthview-df-table td.nthview-df-mono{font-family:var(--df-mono);font-size:12.5px}",
    ".nthview-df-table .nthview-df-dep{text-decoration:line-through;text-decoration-color:var(--df-bad)}",
    ".nthview-df-table tr.nthview-df-cur .nthview-df-dep{color:var(--nv-fg)}",
    ".nthview-df-empty{padding:18px 20px 22px;font-size:13px;color:var(--nv-muted)}",
    ".nthview-df-nexttopic{padding:10px 20px 18px}",
    /* message dots: kind encodes the style */
    ".nthview-df-dot{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;font:10px var(--df-mono);color:var(--nv-bg);background:var(--nv-fg);border:1.4px solid var(--nv-fg);vertical-align:middle}",
    ".nthview-df-dot.nthview-df-k-response{background:transparent;color:var(--nv-fg)}",
    ".nthview-df-dot.nthview-df-k-error{background:var(--nv-accent);border-color:var(--nv-accent);color:var(--df-accent-ink)}",
    ".nthview-df-dot.nthview-df-k-notification{background:transparent;border-style:dashed;color:var(--nv-fg)}",
    ".nthview-df-dot.nthview-df-k-local{background:transparent;border-style:dotted;border-color:var(--nv-muted);color:var(--nv-muted)}",
    ".nthview-df-dot.nthview-df-k-transport{border-radius:4px;background:rgba(var(--df-rgb),.55);border-color:transparent;color:var(--nv-bg)}",
    /* right panel: article and message */
    ".nthview-df-article{padding:22px 24px 18px;border-top:1px solid var(--df-border)}",
    ".nthview-df-article h3{font-size:30px;line-height:1.1}",
    ".nthview-df-article .nthview-df-sub{font-size:15px;color:var(--nv-muted);margin:4px 0 14px}",
    ".nthview-df-article p{font-size:14px;line-height:1.55;margin:0 0 12px}",
    ".nthview-df-refs{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:13px;margin:6px 0 4px}",
    ".nthview-df-refs span{color:var(--nv-muted)}",
    ".nthview-df-refs a:after{content:' ↗';font-size:11px;color:var(--nv-muted)}",
    ".nthview-df-vnote{border-top:1px solid var(--df-border);margin-top:14px;padding-top:12px}",
    ".nthview-df-vnote h4{font-size:14px;margin-bottom:6px}",
    ".nthview-df-vnote h4 .nthview-df-tag{margin-left:8px}",
    ".nthview-df-vnote ul{margin:0;padding-left:18px;font-size:13px;color:var(--nv-muted)}",
    ".nthview-df-vnote li{margin:3px 0}",
    ".nthview-df-box{border:1px solid var(--df-border);border-radius:8px;padding:10px 12px;margin-top:14px;font-size:13px}",
    ".nthview-df-box-attention{border-style:dashed;border-color:var(--nv-accent)}",
    ".nthview-df-box h4{font-size:13px;margin-bottom:6px}",
    ".nthview-df-box ul{margin:0;padding-left:18px;color:var(--nv-muted)}",
    ".nthview-df-box li{margin:3px 0}",
    ".nthview-df-box .nthview-df-tagtext{color:var(--nv-muted);font-size:12px;margin-left:4px}",
    ".nthview-df-absentbox{border:1px dashed var(--df-faint);border-radius:8px;padding:10px 12px;margin:0 0 14px;font-size:13px;color:var(--nv-muted)}",
    ".nthview-df-absentbox b{color:var(--nv-fg);font-weight:500}",
    ".nthview-df-footer{font-size:12px;color:var(--nv-muted);padding:14px 24px 20px;border-top:1px solid var(--df-border)}",
    ".nthview-df-msg{padding:18px 24px 22px}",
    ".nthview-df-msg h2{font-size:16px;margin-bottom:10px}",
    ".nthview-df-ih{display:flex;align-items:center;gap:8px}",
    ".nthview-df-ih .nthview-df-dot{width:10px;height:10px}",
    ".nthview-df-ih .nthview-df-im{font-family:var(--df-mono);font-size:14px;font-weight:500;min-width:0;overflow-wrap:anywhere}",
    ".nthview-df-ih .nthview-df-isz{margin-left:auto;font:11px var(--df-mono);color:var(--nv-muted);white-space:nowrap}",
    ".nthview-df-ir{font-size:12px;color:var(--nv-muted);margin:4px 0 10px}",
    ".nthview-df-json{margin:0;padding:12px;border:1px solid var(--df-border);border-radius:8px;background:var(--df-hover);font-size:12px;line-height:1.5;overflow:auto;max-height:360px;white-space:pre;tab-size:2}",
    ".nthview-df-json .nthview-df-j-key{color:var(--nv-fg)}",
    ".nthview-df-json .nthview-df-j-str{color:var(--nv-muted)}",
    ".nthview-df-json .nthview-df-j-num,.nthview-df-json .nthview-df-j-lit{color:var(--nv-accent)}",
    ".nthview-df-notes{display:grid;grid-template-columns:auto 1fr;gap:8px 14px;margin:12px 0 0;font-size:12.5px}",
    ".nthview-df-notes dt{font-family:var(--df-mono);color:var(--nv-fg);white-space:nowrap;max-width:140px;overflow:hidden;text-overflow:ellipsis}",
    ".nthview-df-notes dd{margin:0;color:var(--nv-muted)}",
    ".nthview-df-msg .nthview-df-empty{padding:4px 0 0}",
    ".nthview-df-rtabs{display:none}",
    /* checks: the side panel */
    ".nthview-df-lesson{position:relative}",
    ".nthview-df-quiz{position:absolute;left:0;top:0;bottom:0;width:316px;max-width:100%;z-index:25;background:var(--nv-bg);border-right:1px solid var(--df-border);box-shadow:10px 0 30px rgba(0,0,0,.22);transform:translateX(-103%);transition:transform .3s cubic-bezier(.2,.7,.2,1);overflow:auto;display:flex;flex-direction:column;visibility:hidden}",
    ".nthview-df-quiz.nthview-df-open{transform:none;visibility:visible}",
    ".nthview-df-quiz-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px 0;gap:8px}",
    ".nthview-df-quiz-kicker{color:var(--nv-accent)}",
    ".nthview-df-quiz-close{width:36px;height:36px;border:1px solid var(--df-border);border-radius:8px;display:inline-grid;place-items:center;font-size:18px;color:var(--nv-muted)}",
    ".nthview-df-quiz-close:hover{color:var(--nv-fg);background:var(--df-hover)}",
    ".nthview-df-quiz-step{padding:6px 16px 0;font-size:12.5px;color:var(--nv-muted)}",
    ".nthview-df-review{font-size:12px;color:var(--nv-accent);text-decoration:underline;text-decoration-color:var(--df-faint);text-underline-offset:2px}",
    ".nthview-df-review:hover{text-decoration-color:var(--nv-accent)}",
    ".nthview-df-waiting{color:var(--nv-muted)}",
    ".nthview-df-check{padding:10px 16px 20px;font-size:14px}",
    ".nthview-df-check p{margin:2px 0 12px}",
    ".nthview-df-verdict{font-weight:600;color:var(--nv-accent)}",
    ".nthview-df-verdict-right{color:var(--df-good)}",
    ".nthview-df-continue{margin-top:14px;min-height:40px}",
    ".nthview-df-opts{display:grid;gap:6px;margin:0;padding:0;list-style:none}",
    ".nthview-df-opts button{display:flex;gap:10px;align-items:flex-start;width:100%;min-height:44px;padding:8px 10px;border:1px solid var(--df-border);border-radius:8px;font-size:14px;line-height:1.4}",
    ".nthview-df-opts button:hover{background:var(--df-hover)}",
    ".nthview-df-opts button[disabled]{cursor:default}",
    ".nthview-df-opts button[disabled]:hover{background:none}",
    ".nthview-df-opts .nthview-df-ol{flex:0 0 auto;display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;border:1px solid var(--df-faint);font:11px var(--df-mono);color:var(--nv-muted)}",
    ".nthview-df-opts button.nthview-df-right{border-color:var(--df-good)}",
    ".nthview-df-opts button.nthview-df-right .nthview-df-ol{background:var(--df-good);color:var(--nv-bg);border-color:var(--df-good)}",
    ".nthview-df-opts button.nthview-df-wrong{border-color:var(--df-bad)}",
    ".nthview-df-opts button.nthview-df-wrong .nthview-df-ol{background:var(--df-bad);color:var(--nv-bg);border-color:var(--df-bad)}",
    ".nthview-df-why{margin:10px 0 0;font-size:13px;color:var(--nv-muted);border-top:1px solid var(--df-border);padding-top:10px}",
    ".nthview-df-why b{color:var(--nv-fg);font-weight:500}",
    ".nthview-df-skip{margin-top:10px;font-size:13px;color:var(--nv-muted);text-decoration:underline;text-underline-offset:2px;min-height:32px}",
    ".nthview-df-skip:hover{color:var(--nv-fg)}",
    /* diagrams */
    ".nthview-df-zone rect{fill:rgba(var(--df-rgb),.02);stroke:var(--df-faint);stroke-width:1}",
    ".nthview-df-zone.nthview-df-remote rect{stroke-dasharray:6 5;fill:var(--df-hover)}",
    ".nthview-df-zone .nthview-df-zl{font:600 10px var(--df-mono);fill:var(--nv-fg);letter-spacing:.08em}",
    ".nthview-df-zone .nthview-df-zs{font:10px var(--df-mono);fill:var(--nv-muted)}",
    ".nthview-df-edge{stroke:var(--df-faint);stroke-width:1;transition:stroke .25s,opacity .25s}",
    ".nthview-df-edge.nthview-df-implicit{stroke-dasharray:4 4}",
    ".nthview-df-edge.nthview-df-on{stroke:var(--nv-fg);stroke-width:1.5}",
    ".nthview-df-dim .nthview-df-edge:not(.nthview-df-on){opacity:.45}",
    ".nthview-df-epill rect{fill:var(--nv-bg);stroke:var(--df-faint);stroke-width:1}",
    ".nthview-df-epill text{font:600 9px var(--df-mono);fill:var(--nv-muted);letter-spacing:.06em}",
    ".nthview-df-epill.nthview-df-on rect{stroke:var(--nv-fg)}",
    ".nthview-df-epill.nthview-df-on text{fill:var(--nv-fg)}",
    ".nthview-df-dim .nthview-df-epill:not(.nthview-df-on){opacity:.45}",
    ".nthview-df-node{transition:opacity .25s}",
    ".nthview-df-dim .nthview-df-node:not(.nthview-df-on){opacity:.4}",
    ".nthview-df-node .nthview-df-shd{fill:rgba(var(--df-rgb),.07)}",
    ".nthview-df-node .nthview-df-fl{fill:rgba(var(--df-rgb),.11)}",
    ".nthview-df-node .nthview-df-fr{fill:rgba(var(--df-rgb),.2)}",
    ".nthview-df-node .nthview-df-ft{fill:rgba(var(--df-rgb),.03)}",
    ".nthview-df-node.nthview-df-on .nthview-df-shd{fill:rgba(var(--df-rgb),.13)}",
    ".nthview-df-node polygon,.nthview-df-node path,.nthview-df-node circle,.nthview-df-node ellipse:not(.nthview-df-shd),.nthview-df-node rect,.nthview-df-node line{stroke:var(--nv-muted);stroke-width:.9;stroke-linejoin:round;stroke-linecap:round}",
    ".nthview-df-node path.nthview-df-ln,.nthview-df-node line.nthview-df-ln,.nthview-df-node circle.nthview-df-ln,.nthview-df-node rect.nthview-df-ln{fill:none}",
    ".nthview-df-node circle.nthview-df-led{fill:var(--nv-muted);stroke:none}",
    ".nthview-df-node.nthview-df-on polygon,.nthview-df-node.nthview-df-on path,.nthview-df-node.nthview-df-on circle,.nthview-df-node.nthview-df-on ellipse:not(.nthview-df-shd),.nthview-df-node.nthview-df-on rect,.nthview-df-node.nthview-df-on line{stroke:var(--nv-fg);stroke-width:1.3}",
    ".nthview-df-node.nthview-df-on circle.nthview-df-led{fill:var(--nv-accent);stroke:none}",
    ".nthview-df-node .nthview-df-nl{font:400 18px var(--df-head);fill:var(--nv-fg);text-anchor:middle;paint-order:stroke;stroke:var(--nv-bg);stroke-width:5px;stroke-linejoin:round}",
    ".nthview-df-node .nthview-df-ns{font:13px var(--df-mono);fill:var(--nv-muted);text-anchor:middle;paint-order:stroke;stroke:var(--nv-bg);stroke-width:5px;stroke-linejoin:round}",
    ".nthview-df-dim .nthview-df-node:not(.nthview-df-on) .nthview-df-nl{fill:var(--nv-muted)}",
    /* the travelling packet: a labelled pill with a trail; colours follow the message kind */
    ".nthview-df-pkt .nthview-df-pb{fill:var(--nv-bg);stroke:var(--nv-fg);stroke-width:1.6}",
    ".nthview-df-pkt .nthview-df-pd{fill:var(--nv-fg)}",
    ".nthview-df-pkt .nthview-df-pt{font:13.5px var(--df-mono);fill:var(--nv-fg)}",
    ".nthview-df-pkt .nthview-df-trail{stroke:var(--nv-fg);stroke-width:1.6}",
    ".nthview-df-pkt .nthview-df-trailhead{fill:var(--nv-fg)}",
    ".nthview-df-pkt.nthview-df-k-response .nthview-df-pb,.nthview-df-pkt.nthview-df-k-response .nthview-df-trail{stroke:var(--nv-muted)}",
    ".nthview-df-pkt.nthview-df-k-response .nthview-df-pd,.nthview-df-pkt.nthview-df-k-response .nthview-df-trailhead{fill:var(--nv-muted)}",
    ".nthview-df-pkt.nthview-df-k-error .nthview-df-pb,.nthview-df-pkt.nthview-df-k-error .nthview-df-trail{stroke:var(--nv-accent)}",
    ".nthview-df-pkt.nthview-df-k-error .nthview-df-pd,.nthview-df-pkt.nthview-df-k-error .nthview-df-trailhead{fill:var(--nv-accent)}",
    ".nthview-df-pkt.nthview-df-k-notification .nthview-df-pb,.nthview-df-pkt.nthview-df-k-notification .nthview-df-trail,.nthview-df-pkt.nthview-df-dep .nthview-df-pb{stroke-dasharray:5 3}",
    ".nthview-df-pkt.nthview-df-k-local .nthview-df-trail,.nthview-df-pkt.nthview-df-k-transport .nthview-df-trail{stroke-dasharray:2 4}",
    ".nthview-df-pkt .nthview-df-pdep{font:600 9.5px var(--df-mono);letter-spacing:.1em;fill:var(--nv-accent)}",
    ".nthview-df-pkt.nthview-df-arrived{opacity:.92}",
    /* sequence */
    ".nthview-df-life{stroke:var(--df-faint);stroke-width:1;stroke-dasharray:3 4}",
    ".nthview-df-lifehead rect{fill:var(--nv-bg);stroke:var(--df-faint);stroke-width:1}",
    ".nthview-df-lifehead text{font:400 15px var(--df-head);fill:var(--nv-fg);text-anchor:middle}",
    ".nthview-df-lifehead .nthview-df-zl{font:600 9px var(--df-mono);fill:var(--nv-muted);letter-spacing:.08em}",
    ".nthview-df-lifehead.nthview-df-on rect{stroke:var(--nv-fg);stroke-width:1.5}",
    ".nthview-df-sstep{font:11px var(--df-mono);fill:var(--nv-muted)}",
    ".nthview-df-ssep{stroke:var(--df-soft);stroke-width:1}",
    ".nthview-df-sm{cursor:pointer}",
    ".nthview-df-sm line,.nthview-df-sm path{stroke:var(--nv-fg);stroke-width:1.3;fill:none;transition:stroke .2s}",
    ".nthview-df-sm.nthview-df-k-response line,.nthview-df-sm.nthview-df-k-response path{stroke-dasharray:none;stroke:rgba(var(--df-rgb),.55)}",
    ".nthview-df-sm.nthview-df-k-notification line,.nthview-df-sm.nthview-df-k-notification path{stroke-dasharray:6 4}",
    ".nthview-df-sm.nthview-df-k-local path{stroke-dasharray:2 3}",
    ".nthview-df-sm.nthview-df-k-error line,.nthview-df-sm.nthview-df-k-error path{stroke:var(--nv-accent)}",
    ".nthview-df-sm.nthview-df-dep line,.nthview-df-sm.nthview-df-dep path{stroke-dasharray:6 3}",
    ".nthview-df-sm text{font:13px var(--df-mono);fill:rgba(var(--df-rgb),.7);text-anchor:middle;paint-order:stroke;stroke:var(--nv-bg);stroke-width:4px}",
    ".nthview-df-sm .nthview-df-sdep{fill:var(--nv-accent);font-weight:600}",
    ".nthview-df-sm .nthview-df-ah{fill:var(--nv-fg);stroke:none}",
    ".nthview-df-sm.nthview-df-k-response .nthview-df-ah{fill:var(--nv-bg);stroke:rgba(var(--df-rgb),.55);stroke-width:1.2}",
    ".nthview-df-sm.nthview-df-k-error .nthview-df-ah{fill:var(--nv-accent)}",
    ".nthview-df-sm.nthview-df-fut{opacity:.18}",
    ".nthview-df-sm.nthview-df-cur line,.nthview-df-sm.nthview-df-cur path{stroke:var(--nv-fg);stroke-width:2.2}",
    ".nthview-df-sm.nthview-df-cur text{fill:var(--nv-fg);font-weight:600}",
    ".nthview-df-sm.nthview-df-cur .nthview-df-ah{fill:var(--nv-fg)}",
    ".nthview-df-sm.nthview-df-k-response.nthview-df-cur .nthview-df-ah{fill:var(--nv-bg);stroke:var(--nv-fg)}",
    /* resume notice */
    ".nthview-resume{margin:12px 20px 0;padding:8px 12px;border-radius:8px;border:1px solid var(--nv-accent);background:var(--df-hover);font-size:13px;transition:opacity .4s}",
    ".nthview-resume.nthview-resume-hide{opacity:0}",
    /* ---- phone and narrow: one column, drawer sidebar, tabs for article and message ---- */
    "@media (max-width:1023px){",
    "  .nthview-df-top{padding:10px 16px;gap:10px;flex-wrap:wrap}",
    "  .nthview-df-brand{max-width:none;font-size:18px}",
    "  .nthview-df-topright{flex:0 0 auto}",
    "  .nthview-df-tm{display:none}",
    "  .nthview-df-tmselect{display:block;flex:1;min-width:0}",
    "  .nthview-df-intro{grid-template-columns:1fr;grid-template-rows:auto auto}",
    "  .nthview-df-hero{border-right:0;border-bottom:1px solid var(--df-border);padding:28px 16px}",
    "  .nthview-df-preview{min-height:280px}",
    "  .nthview-df-lesson{grid-template-columns:minmax(0,1fr)}",
    "  .nthview-df-right,.nthview-df-center{min-width:0;max-width:100vw}",
    "  .nthview-df-subbar select{flex:1 1 0;min-width:0;max-width:55%}",
    "  .nthview-df-topicsbtn{min-width:0;overflow:hidden}",
    "  .nthview-df-topicsbtn span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    "  .nthview-df-subbar{display:flex}",
    "  .nthview-df-side{position:fixed;inset:0 auto 0 0;width:min(86vw,340px);max-width:100%;z-index:30;background:var(--nv-bg);border-right:1px solid var(--df-border);transform:translateX(-102%);transition:transform .25s;overflow:auto;box-shadow:0 0 40px rgba(0,0,0,.3)}",
    "  .nthview-df-side.nthview-df-open{transform:none}",
    "  .nthview-df-backdrop{position:fixed;inset:0;z-index:29;background:rgba(0,0,0,.45)}",
    "  .nthview-df-backdrop.nthview-df-open{display:block}",
    "  .nthview-df-drawerhead{display:flex;justify-content:space-between;align-items:center;padding:12px 16px 0}",
    "  .nthview-df-quiz{position:fixed;inset:0 auto 0 0;width:min(86vw,340px);z-index:32}",
    "  .nthview-df-drawerhead button{min-height:44px;min-width:44px;display:inline-grid;place-items:center;border:1px solid var(--df-border);border-radius:8px;font-size:18px}",
    "  .nthview-df-stagebar{flex-direction:column;gap:10px;padding:14px 16px 0}",
    "  .nthview-df-stagebar .nthview-df-seg{align-self:flex-start}",
    "  .nthview-df-stageright{align-items:flex-start}.nthview-df-legend{align-items:flex-start;text-align:left;flex-direction:row;flex-wrap:wrap;gap:3px 14px;max-width:none}",
    "  .nthview-df-cap{min-height:0}",
    "  .nthview-df-stage{min-height:260px}",
    "  .nthview-df-stage svg{min-height:260px;max-height:70vh}",
    "  .nthview-df-fh{padding:12px 16px}",
    "  .nthview-df-ctrl{margin-left:0;width:100%}",
    "  .nthview-df-ctrl .nthview-df-btn{min-height:44px;flex:1;justify-content:center}",
    "  .nthview-df-table th:first-child,.nthview-df-table td:first-child{padding-left:16px}",
    "  .nthview-df-right{border-left:0;border-top:1px solid var(--df-border)}",
    "  .nthview-df-rtabs{display:flex;padding:12px 16px 0}",
    "  .nthview-df-rtabs .nthview-df-seg{width:100%}",
    "  .nthview-df-rtabs .nthview-df-seg button{flex:1;min-height:40px;text-align:center}",
    "  .nthview-df-right[data-panel=article] .nthview-df-msg,.nthview-df-right[data-panel=message] .nthview-df-article,.nthview-df-right[data-panel=message] .nthview-df-footer{display:none}",
    "  .nthview-df-article,.nthview-df-msg{padding:18px 16px}",
    "  .nthview-df-article h3{font-size:26px}",
    "  .nthview-df-facts{grid-template-columns:1fr;gap:2px 0}",
    "  .nthview-df-facts dd{margin-bottom:8px}",
    "}",
    "@media (max-width:420px){.nthview-df-hero h2{font-size:28px}.nthview-df-top .nthview-df-introbtn{display:none}}",
    /* fragments on the sequence diagram */
    ".nthview-df-frag rect{fill:none;stroke:var(--df-faint);stroke-width:1}",
    ".nthview-df-frag .nthview-df-fragtab{fill:var(--nv-bg);stroke:var(--df-faint)}",
    ".nthview-df-frag text{font:600 10px var(--df-mono);fill:var(--nv-muted);letter-spacing:.06em}",
    ".nthview-df-frag .nthview-df-fragcond{font:10.5px var(--df-mono);fill:var(--nv-muted);letter-spacing:0}",
    ".nthview-df-frag .nthview-df-fragsep{stroke:var(--df-faint);stroke-dasharray:4 4}",
    /* holdings strip */
    ".nthview-df-holds{display:flex;flex-wrap:wrap;gap:4px 22px;padding:8px 20px 10px;border-top:1px solid var(--df-border);font-size:12px;flex:0 0 auto}",
    ".nthview-df-hold{display:flex;flex-wrap:wrap;align-items:center;gap:0 4px}",
    ".nthview-df-hold b{font-weight:500;color:var(--nv-muted);margin-right:4px;white-space:nowrap}",
    ".nthview-df-chip{display:inline-block;border:1px solid var(--df-border);border-radius:6px;padding:0 6px;margin:2px 0;font:11.5px/1.6 var(--df-mono);color:var(--nv-fg);background:var(--df-hover);white-space:nowrap}",
    ".nthview-df-chip-new{border-color:var(--nv-accent);box-shadow:inset 0 0 0 1px var(--nv-accent)}",
    ".nthview-df-chip-gone{text-decoration:line-through;text-decoration-color:var(--df-bad);opacity:.55}",
    ".nthview-df-hold-none{color:var(--df-faint);font-style:italic}",
    /* channel legend */
    ".nthview-df-stageright{display:flex;flex-direction:column;align-items:flex-end;gap:10px;flex:0 0 auto}",
    ".nthview-df-legend{display:flex;flex-direction:column;align-items:flex-end;gap:3px;font:11px var(--df-mono);color:var(--nv-muted);text-align:right;max-width:260px}",
    ".nthview-df-legend i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:6px;vertical-align:-1px;background:var(--nv-muted)}",
    ".nthview-df-ir i{display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 4px 0 2px;vertical-align:0;background:var(--nv-muted)}",
    /* inner sequences, groups, notes, comparisons, glossary, recap */
    ".nthview-df-crumbs{display:flex;flex-wrap:wrap;align-items:center;gap:2px 8px;padding:12px 20px 0;font-size:12.5px;color:var(--nv-muted)}",
    ".nthview-df-crumbs button{color:var(--nv-accent);text-decoration:underline;text-decoration-color:var(--df-faint);text-underline-offset:2px;min-height:28px}",
    ".nthview-df-crumbs b{color:var(--nv-fg);font-weight:500}",
    ".nthview-df-innersub{padding:2px 20px 0;font-size:13px;color:var(--nv-muted);max-width:76ch}",
    ".nthview-df-callout{margin:8px 0 0;padding:6px 10px;border-left:3px solid var(--nv-muted);background:var(--df-hover);border-radius:0 6px 6px 0;font-size:13px;max-width:68ch}",
    ".nthview-df-callout b{font-weight:600}",
    ".nthview-df-sev-warning{border-left-color:var(--nv-accent)}.nthview-df-sev-danger{border-left-color:var(--df-bad)}.nthview-df-sev-danger>b{color:var(--df-bad)}",
    ".nthview-df-cmp{border-left-style:dashed;border-left-color:var(--nv-accent)}",
    ".nthview-df-capact{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;margin:10px 0 8px;font-size:12.5px}",
    ".nthview-df-capact label{display:inline-flex;gap:6px;align-items:center;color:var(--nv-muted);cursor:pointer;min-height:28px}",
    ".nthview-df-capact input{accent-color:var(--nv-accent);width:16px;height:16px;margin:0}",
    ".nthview-df-steps .nthview-df-crumb button{color:var(--nv-muted);font-size:12.5px}",
    ".nthview-df-num.nthview-df-num-grp{width:auto;min-width:22px;padding:0 6px;border-radius:11px;border-style:dashed}",
    ".nthview-df-in{font:11px var(--df-mono);color:var(--nv-accent);margin-left:auto;padding-left:6px}",
    ".nthview-df-grprow td{color:var(--nv-muted);font-style:italic}",
    ".nthview-df-sgrp{cursor:pointer}",
    ".nthview-df-sgrp rect{fill:var(--df-hover);stroke:var(--df-faint);stroke-dasharray:5 3}",
    ".nthview-df-sgrp text{font:12px var(--df-mono);fill:var(--nv-muted)}",
    ".nthview-df-sgrp.nthview-df-cur rect{stroke:var(--nv-fg);stroke-width:1.5}.nthview-df-sgrp.nthview-df-cur text{fill:var(--nv-fg)}",
    ".nthview-df-sgrp.nthview-df-fut{opacity:.35}",
    ".nthview-df-frag.nthview-df-ref{cursor:pointer}",
    ".nthview-df-frag.nthview-df-ref>rect:first-child{stroke:var(--nv-accent);stroke-opacity:.6}",
    ".nthview-df-snote{font:700 12px var(--df-mono);fill:var(--nv-muted)}.nthview-df-snote-warning{fill:var(--nv-accent)}.nthview-df-snote-danger{fill:var(--df-bad)}",
    ".nthview-df-term{color:inherit;font:inherit;padding:0;text-decoration:underline dotted;text-decoration-color:var(--nv-accent);text-underline-offset:3px;cursor:help}",
    ".nthview-df-pop{position:fixed;z-index:40;max-width:min(320px,calc(100vw - 24px));padding:10px 12px;border:1px solid var(--df-border);border-radius:8px;background:var(--df-panel);color:var(--nv-fg);font-size:13px;line-height:1.45;box-shadow:0 8px 30px rgba(0,0,0,.25)}",
    ".nthview-df-pop b{display:block;margin-bottom:2px}",
    ".nthview-df-dialog.nthview-df-dsmall{width:min(96vw,640px);height:auto;max-height:86vh}",
    ".nthview-df-gloss{margin:0;padding:8px 24px 20px;overflow:auto;font-size:14px}",
    ".nthview-df-gloss dt{font-weight:600;margin-top:12px}.nthview-df-gloss dd{margin:2px 0 0;color:var(--nv-muted)}",
    ".nthview-df-recap{margin-top:8px;padding:12px 14px;border:1px solid var(--df-border);border-radius:8px;font-size:13.5px;max-width:76ch}",
    ".nthview-df-recap h3{font-size:15px}.nthview-df-recap p{margin:6px 0 0}",
    ".nthview-df-holdtog{font:11px var(--df-mono);color:var(--nv-muted);border:1px solid var(--df-border);border-radius:6px;padding:0 8px;min-height:24px;align-self:center}",
    ".nthview-df-holdtog[aria-pressed=true]{color:var(--nv-fg);border-color:var(--nv-fg)}",
    ".nthview-df-dh{font-size:12.5px;font-weight:500;color:var(--nv-muted);margin:18px 0 0}",
    ".nthview-df-detail dt{font-family:inherit;white-space:normal;max-width:130px;color:var(--nv-fg)}",
    ".nthview-df-zoom{display:flex;flex-wrap:wrap;gap:4px}.nthview-df-zoom .nthview-df-btn[aria-pressed=true]{background:var(--nv-fg);color:var(--nv-bg)}",
    "@media (min-width:1024px){.nthview-df-stage{min-height:200px}.nthview-df-holds{max-height:30%;overflow:auto}.nthview-df-nexttopic{max-height:70%;overflow:auto}}",
    "@media (max-width:1023px){.nthview-df-crumbs,.nthview-df-innersub{padding-left:16px;padding-right:16px}.nthview-df-dialog-head{flex-wrap:wrap}",
    "  .nthview-df-legend{align-items:flex-start;text-align:left;flex-direction:row;flex-wrap:wrap;gap:3px 14px;max-width:none}}",
    "@media (max-width:420px){.nthview-df-top .nthview-df-glossbtn{display:inline-flex}}",
    hueCss(),
    "@media (prefers-reduced-motion:reduce){.nthview-dataflow *{transition:none!important;animation:none!important}}"
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
    return "nthview:dataflow:" + (h >>> 0).toString(36);
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

  // ---- SVG helpers ---------------------------------------------------------
  var SVG_NS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs, children) {
    var node = root.document.createElementNS(SVG_NS, tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { node.appendChild(c); });
    return node;
  }
  function f1(n) { return (Math.round(n * 10) / 10).toString(); }
  function pts(list) { return list.map(function (p) { return f1(p[0]) + "," + f1(p[1]); }).join(" "); }

  /* Small line icons for buttons (play, pause, step, sun, moon, auto, menu, close). */
  function icon(name) {
    var s = svgEl("svg", { viewBox: "0 0 24 24", "aria-hidden": "true", focusable: "false" });
    if (name === "play") s.appendChild(svgEl("path", { d: "M7 4l13 8-13 8z" }));
    else if (name === "pause") { s.appendChild(svgEl("rect", { x: 6, y: 4, width: 4, height: 16 })); s.appendChild(svgEl("rect", { x: 14, y: 4, width: 4, height: 16 })); }
    else if (name === "step") s.appendChild(svgEl("path", { d: "M8 5l8 7-8 7z" }));
    else if (name === "back") s.appendChild(svgEl("path", { d: "M16 5l-8 7 8 7z" }));
    else if (name === "sun") { s.appendChild(svgEl("circle", { cx: 12, cy: 12, r: 4 })); s.appendChild(svgEl("path", { d: "M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" })); }
    else if (name === "moon") s.appendChild(svgEl("path", { d: "M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" }));
    else if (name === "auto") { s.appendChild(svgEl("circle", { cx: 12, cy: 12, r: 8 })); s.appendChild(svgEl("path", { d: "M12 4a8 8 0 0 1 0 16z", fill: "currentColor" })); }
    else if (name === "menu") s.appendChild(svgEl("path", { d: "M4 7h16M4 12h16M4 17h16" }));
    else if (name === "full") { s.appendChild(svgEl("path", { d: "M4 9V5a1 1 0 0 1 1-1h4M15 4h4a1 1 0 0 1 1 1v4M20 15v4a1 1 0 0 1-1 1h-4M9 20H5a1 1 0 0 1-1-1v-4", fill: "none", stroke: "currentColor", "stroke-width": "1.8", "stroke-linecap": "round" })); }
    return s;
  }

  // ---- isometric line art ---------------------------------------------------
  /* Ground plane (u, v) with height z. u runs to the lower right, v to the lower left. */
  var ISO_X = 0.866, ISO_Y = 0.5;
  function P(u, v, z) { return [(u - v) * ISO_X, (u + v) * ISO_Y - z]; }
  /* A box standing on (u0, v0, z0) with size su, sv, sz: three visible faces, drawn left, right, top. */
  function box(shapes, u0, v0, z0, su, sv, sz, extra) {
    var u1 = u0 + su, v1 = v0 + sv, z1 = z0 + sz;
    shapes.push({ t: "poly", p: [P(u0, v1, z0), P(u1, v1, z0), P(u1, v1, z1), P(u0, v1, z1)], c: "nthview-df-fl" + (extra || "") });
    shapes.push({ t: "poly", p: [P(u1, v0, z0), P(u1, v1, z0), P(u1, v1, z1), P(u1, v0, z1)], c: "nthview-df-fr" + (extra || "") });
    shapes.push({ t: "poly", p: [P(u0, v0, z1), P(u1, v0, z1), P(u1, v1, z1), P(u0, v1, z1)], c: "nthview-df-ft" + (extra || "") });
  }
  /* Groups drawn on a face in flat 2D coordinates: left face (u, z), right face (v, z), top face (u, v). */
  function faceL(v, z0) { var o = P(0, v, z0); return "matrix(" + ISO_X + "," + ISO_Y + ",0,-1," + f1(o[0]) + "," + f1(o[1]) + ")"; }
  function faceR(u, z0) { var o = P(u, 0, z0); return "matrix(" + (-ISO_X) + "," + ISO_Y + ",0,-1," + f1(o[0]) + "," + f1(o[1]) + ")"; }
  function faceT(z) { var o = P(0, 0, z); return "matrix(" + ISO_X + "," + ISO_Y + "," + (-ISO_X) + "," + ISO_Y + "," + f1(o[0]) + "," + f1(o[1]) + ")"; }
  function onFace(shapes, transform, children) { shapes.push({ t: "g", tr: transform, ch: children }); }
  function ln(d) { return { t: "path", d: d, c: "nthview-df-ln" }; }
  function led(x, y) { return { t: "circle", x: x, y: y, r: 1.6, c: "nthview-df-led" }; }

  /* Each glyph is a list of shapes in iso coordinates; the caller centres it. */
  var GLYPHS = {
    generic: function (s) { box(s, 0, 0, 0, 38, 38, 28); },
    client: function (s) {
      box(s, 0, 0, 0, 40, 40, 26);
      onFace(s, faceL(40, 0), [{ t: "rect", x: 8, y: 9, w: 22, h: 8, rx: 4, c: "nthview-df-ln" }]);
      onFace(s, faceR(40, 0), [ln("M8 10h22M8 16h22")]);
      box(s, 6, 6, 26, 8, 8, 8); box(s, 22, 18, 26, 8, 8, 8);
    },
    app: function (s) {
      box(s, 0, 0, 0, 42, 42, 24);
      onFace(s, faceT(24), [{ t: "rect", x: 8, y: 8, w: 26, h: 26, rx: 4, c: "nthview-df-ln" }, ln("M14 21h14M21 14v14")]);
      onFace(s, faceL(42, 0), [ln("M8 12h26")]);
    },
    server: function (s) {
      for (var i = 0; i < 3; i++) {
        var z = i * 14;
        box(s, 0, 0, z, 56, 40, 12);
        onFace(s, faceL(40, z), [led(7, 6), led(13, 6), ln("M20 6h30")]);
        onFace(s, faceR(56, z), [ln("M6 4h28M6 8h28")]);
      }
    },
    service: function (s) {
      box(s, 0, 0, 0, 40, 40, 30);
      onFace(s, faceL(40, 0), [{ t: "circle", x: 20, y: 15, r: 7, c: "nthview-df-ln" }, { t: "circle", x: 20, y: 15, r: 2.5, c: "nthview-df-ln" }, ln("M20 4v4M20 22v4M9 15h4M27 15h4")]);
      onFace(s, faceR(40, 0), [ln("M8 10h24M8 16h16")]);
    },
    database: function (s) {
      s.push({ t: "path", d: "M-26 -34 a26 11 0 0 0 52 0 v34 a26 11 0 0 1 -52 0 z", c: "nthview-df-fl" });
      s.push({ t: "path", d: "M-26 -34 a26 11 0 0 0 52 0 a26 11 0 0 0 -52 0 z", c: "nthview-df-ft" });
      s.push(ln("M-26 -17 a26 11 0 0 0 52 0")); s.push(ln("M-26 0 a26 11 0 0 0 52 0"));
    },
    gateway: function (s) {
      box(s, 0, 0, 0, 48, 30, 30);
      onFace(s, faceL(30, 0), [ln("M10 15h26M28 7l8 8-8 8")]);
      onFace(s, faceR(48, 0), [ln("M6 8h18M6 15h18M6 22h18")]);
      box(s, 10, 6, 30, 28, 18, 5);
    },
    network: function (s) {
      box(s, 0, 0, 0, 60, 60, 6);
      onFace(s, faceT(6), [ln("M14 14L46 14L30 46Z M14 14L30 46 M46 14L30 46 M14 14L46 46"), { t: "circle", x: 14, y: 14, r: 4, c: "nthview-df-led" }, { t: "circle", x: 46, y: 14, r: 4, c: "nthview-df-led" }, { t: "circle", x: 30, y: 46, r: 4, c: "nthview-df-led" }, { t: "circle", x: 46, y: 46, r: 4, c: "nthview-df-led" }]);
    },
    bank: function (s) {
      box(s, 0, 0, 0, 56, 40, 6);
      box(s, 4, 4, 6, 48, 32, 26);
      onFace(s, faceL(36, 6), [ln("M12 2v22M22 2v22M32 2v22M42 2v22")]);
      box(s, 0, 0, 32, 56, 40, 6);
    },
    model: function (s) {
      box(s, 0, 0, 0, 44, 44, 8);
      onFace(s, faceL(44, 0), [ln("M6 2v4M14 2v4M22 2v4M30 2v4M38 2v4")]);
      onFace(s, faceR(44, 0), [ln("M6 2v4M14 2v4M22 2v4M30 2v4M38 2v4")]);
      box(s, 14, 14, 8, 16, 16, 6);
      onFace(s, faceT(14), [ln("M18 18h8M22 18v8")]);
    },
    device: function (s) {
      box(s, 0, 0, 0, 26, 6, 48);
      onFace(s, faceL(6, 0), [{ t: "rect", x: 3, y: 7, w: 20, h: 34, rx: 2, c: "nthview-df-ln" }, { t: "circle", x: 13, y: 3.5, r: 1.4, c: "nthview-df-led" }]);
    },
    browser: function (s) {
      box(s, 0, 0, 0, 58, 6, 42);
      onFace(s, faceL(6, 0), [{ t: "rect", x: 4, y: 5, w: 50, h: 32, rx: 2, c: "nthview-df-ln" }, ln("M4 31h50"), { t: "rect", x: 16, y: 32.5, w: 26, h: 3, rx: 1.5, c: "nthview-df-ln" }, led(8, 34), led(12, 34), ln("M12 14h20M12 20h30")]);
    },
    document: function (s) {
      box(s, 0, 0, 0, 36, 4, 46);
      onFace(s, faceL(4, 0), [ln("M8 36h20M8 29h20M8 22h20M8 15h12"), ln("M26 46v-8h8")]);
    },
    person: function (s) {
      s.push({ t: "circle", x: 0, y: -34, r: 9, c: "nthview-df-fr" });
      s.push({ t: "path", d: "M-18 0 a18 18 0 0 1 36 0 z", c: "nthview-df-fl" });
      s.push(ln("M-12 -8 a12 12 0 0 1 24 0"));
    },
    queue: function (s) {
      box(s, 0, 20, 0, 14, 14, 14); box(s, 20, 20, 0, 14, 14, 14); box(s, 40, 20, 0, 14, 14, 14);
      s.push(ln("M" + f1(P(-6, 27, 7)[0]) + " " + f1(P(-6, 27, 7)[1]) + "L" + f1(P(-16, 27, 7)[0]) + " " + f1(P(-16, 27, 7)[1])));
    },
    cloud: function (s) {
      s.push({ t: "path", d: "M-30 6 a12 12 0 0 1 4 -23 a16 16 0 0 1 30 -6 a12 12 0 0 1 22 10 a10 10 0 0 1 -4 19 z", c: "nthview-df-fl" });
      s.push(ln("M-14 -4 a7 7 0 0 1 10 -6"));
    }
  };

  /* Build a glyph into a <g>, centred on (cx, cy) and scaled; returns the group and its half height. */
  function drawGlyph(kind, cx, cy, scale) {
    var shapes = [];
    (GLYPHS[kind] || GLYPHS.generic)(shapes);
    var minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
    function see(x, y) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; }
    shapes.forEach(function (sh) {
      if (sh.t === "poly") sh.p.forEach(function (p) { see(p[0], p[1]); });
      else if (sh.t === "circle") { see(sh.x - sh.r, sh.y - sh.r); see(sh.x + sh.r, sh.y + sh.r); }
      else if (sh.t === "path" && sh.c !== "nthview-df-ln") { see(-30, -40); see(30, 6); }
    });
    if (minX > maxX) { minX = -20; maxX = 20; minY = -20; maxY = 20; }
    var w = maxX - minX, h = maxY - minY, mx = (minX + maxX) / 2, my = (minY + maxY) / 2;
    var g = svgEl("g", { transform: "translate(" + f1(cx) + "," + f1(cy) + ") scale(" + scale + ") translate(" + f1(-mx) + "," + f1(-my) + ")" });
    g.appendChild(svgEl("ellipse", { class: "nthview-df-shd", cx: f1(mx), cy: f1(maxY + 2), rx: f1(w * 0.55), ry: f1(w * 0.22) }));
    function emit(parent, sh) {
      if (sh.t === "poly") parent.appendChild(svgEl("polygon", { points: pts(sh.p), class: sh.c }));
      else if (sh.t === "path") parent.appendChild(svgEl("path", { d: sh.d, class: sh.c }));
      else if (sh.t === "circle") parent.appendChild(svgEl("circle", { cx: f1(sh.x), cy: f1(sh.y), r: f1(sh.r), class: sh.c }));
      else if (sh.t === "rect") parent.appendChild(svgEl("rect", { x: f1(sh.x), y: f1(sh.y), width: f1(sh.w), height: f1(sh.h), rx: sh.rx || 0, class: sh.c }));
      else if (sh.t === "g") { var gg = svgEl("g", { transform: sh.tr }); sh.ch.forEach(function (c) { emit(gg, c); }); parent.appendChild(gg); }
    }
    shapes.forEach(function (sh) { emit(g, sh); });
    return { g: g, halfH: h * scale / 2, halfW: w * scale / 2 };
  }

  // ---- text helpers ----------------------------------------------------------
  /* rich text: **bold**, `code` and glossary marks ((term)) or ((shown text|term)); everything else is literal.
     A mark becomes a button that opens the term's definition; plain (inside another button) keeps only the text. */
  var GLOSS = {}, onTerm = null;
  function rich(text, plain) {
    var frag = root.document.createDocumentFragment();
    String(text).split(/(\*\*[^*]+\*\*|`[^`]+`|\(\([^()]*\)\))/).forEach(function (part) {
      if (!part) return;
      if (/^\*\*[^*]+\*\*$/.test(part)) frag.appendChild(el("b", { text: part.slice(2, -2) }));
      else if (/^`[^`]+`$/.test(part)) frag.appendChild(el("code", { text: part.slice(1, -1) }));
      else if (/^\(\([^()]*\)\)$/.test(part)) {
        var inner = part.slice(2, -2), bar = inner.lastIndexOf("|"), shown = bar === -1 ? inner : inner.slice(0, bar), g = GLOSS[inner.slice(bar + 1).trim().toLowerCase()];
        if (!g || plain) { frag.appendChild(root.document.createTextNode(shown)); return; }
        var b = el("button", { type: "button", class: "nthview-df-term", text: shown, "aria-haspopup": "dialog", title: "What is " + g.term + "?" });
        b.addEventListener("click", function (e) { e.stopPropagation(); if (onTerm) onTerm(g, b); });
        frag.appendChild(b);
      } else frag.appendChild(root.document.createTextNode(part));
    });
    return frag;
  }
  function para(cls, text) { var n = el("p", cls ? { class: cls } : {}); n.appendChild(rich(text)); return n; }

  /* JSON text with light colouring: keys, strings, numbers and literals as spans, built with textContent */
  function colourJson(pre, text) {
    var re = /("(?:[^"\\]|\\.)*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?/g, last = 0, m;
    while ((m = re.exec(text))) {
      if (m.index > last) pre.appendChild(root.document.createTextNode(text.slice(last, m.index)));
      if (m[1] !== undefined) {
        pre.appendChild(el("span", { class: m[2] ? "nthview-df-j-key" : "nthview-df-j-str", text: m[1] }));
        if (m[2]) pre.appendChild(root.document.createTextNode(m[2]));
      } else if (m[3] !== undefined) pre.appendChild(el("span", { class: "nthview-df-j-lit", text: m[3] }));
      else pre.appendChild(el("span", { class: "nthview-df-j-num", text: m[0] }));
      last = re.lastIndex;
    }
    if (last < text.length) pre.appendChild(root.document.createTextNode(text.slice(last)));
  }
  function pairKey(a, b) { return a < b ? a + "|" + b : b + "|" + a; }
  function kindOf(m) { return m.kind || "request"; }
  function isDeprecated(m) { return !!(m.tags && m.tags.indexOf("deprecated") !== -1); }

  // ---- model -------------------------------------------------------------------
  /* A single exchange (root steps) is one topic without an article; everything below sees topics only. */
  function buildModel(data) {
    var E = {}, Z = {}, L = {}, C = {}, V = data.versions || [], VI = {}, topics = [], TI = {}, TS = {}, GP = {};
    data.entities.forEach(function (e) { E[e.id] = e; (e.members || []).forEach(function (m) { GP[m] = e.id; }); });
    (data.channels || []).forEach(function (c) { C[c.id] = c; });
    (data.zones || []).forEach(function (z) { Z[z.id] = z; });
    (data.links || []).forEach(function (l) { L[pairKey(l.from, l.to)] = l; });
    V.forEach(function (v, i) { VI[v.id] = i; });
    var sections = data.sections || [{ title: "", topics: [{ id: "x", title: data.title, subtitle: "", steps: data.steps, fragments: data.fragments, article: null }] }];
    sections.forEach(function (s, si) { s.topics.forEach(function (t) { topics.push(t); TI[t.id] = t; TS[t.id] = si; }); });
    var def = null;
    V.forEach(function (v) { if (v["default"]) def = v.id; });
    if (!def && V.length) def = V[V.length - 1].id;
    return { E: E, Z: Z, L: L, C: C, V: V, VI: VI, topics: topics, TI: TI, TS: TS, GP: GP, defaultVersion: def, hasTM: V.length >= 2, single: !data.sections };
  }
  /* A member of a group without a zone of its own sits in its group's zone. */
  function zoneOf(M, id) { var e = M.E[id], g = M.GP[id] && M.E[M.GP[id]]; return e.zone || (g && g.zone) || null; }
  function clone(h) { var o = {}; Object.keys(h).forEach(function (id) { o[id] = h[id].slice(); }); return o; }
  function ext(o, x) { var r = {}; Object.keys(o).forEach(function (k) { r[k] = o[k]; }); Object.keys(x).forEach(function (k) { r[k] = x[k]; }); return r; }
  /* Holdings across an alt: before each step, the actions that apply there. The fragment's first step saves the
     state, every later branch starts again from it, and after the fragment the state is the end of branch one. */
  function altPlan(frags) {
    var at = {};
    function add(s, prio, fn) { (at[s] = at[s] || []).push({ p: prio, fn: fn }); }
    (frags || []).forEach(function (f) {
      if (f.kind !== "alt") return;
      var st = {};
      add(f.start, 3, function (h) { st.start = clone(h); return h; });
      f.branches.forEach(function (b, k) { if (k) add(b.start, 2, function (h) { if (k === 1) st.end0 = clone(h); return clone(st.start); }); });
      add(f.end + 1, 1 - 1 / (f.end - f.start + 2), function (h) { return st.end0 ? clone(st.end0) : h; });
    });
    Object.keys(at).forEach(function (s) { at[s] = at[s].sort(function (a, b) { return a.p - b.p; }).map(function (x) { return x.fn; }); });
    return at;
  }

  /* One level of a topic (the topic itself or an inner sequence) as it stands in one version: steps with
     overrides applied, messages filtered, every beat with the holdings before and after it. */
  function resolveLevel(M, data, seq, versionId, avail, held0, parentHolds) {
    var steps = seq.steps.map(function (st, i) {
      var ov = (versionId && st.versions && st.versions[versionId]) || {};
      var msgs = (ov.messages !== undefined ? ov.messages : (st.messages || [])).filter(function (m) {
        return !m.versions || !versionId || m.versions.indexOf(versionId) !== -1;
      });
      return { idx: i, title: ov.title || st.title, explanation: ov.explanation || st.explanation, tag: ov.tag !== undefined ? ov.tag : st.tag,
        focus: ov.focus || st.focus || [], messages: msgs, check: st.check || null, compare: st.compare, note: st.note, detail: st.detail, inner: st.inner };
    });
    var all = [], n = 0, seen = {}, held = {}, stepState = [], plan = altPlan(seq.fragments);
    data.entities.forEach(function (e) { held[e.id] = (held0 ? held0[e.id] : (seq.holds && seq.holds[e.id]) || e.holds || []).slice(); });
    if (avail) steps.forEach(function (s) {
      (plan[s.idx] || []).forEach(function (fn) { held = fn(held); });
      stepState[s.idx] = clone(held);
      s.focus.forEach(function (id) { seen[id] = true; });
      (s.messages.length ? s.messages : [null]).forEach(function (m) {
        var b = { step: s.idx, msg: m, n: m ? ++n : 0, before: clone(held), added: {}, removed: {} };
        if (m) {
          seen[m.from] = true; seen[m.to] = true;
          var ch = m.holds;
          if (ch) Object.keys(ch).forEach(function (id) {
            (ch[id].remove || []).forEach(function (item) { var at = held[id].indexOf(item); if (at !== -1) { held[id].splice(at, 1); (b.removed[id] = b.removed[id] || []).push(item); } });
            (ch[id].add || []).forEach(function (item) { if (held[id].indexOf(item) === -1) { held[id].push(item); (b.added[id] = b.added[id] || []).push(item); } });
          });
        }
        b.after = clone(held); all.push(b);
      });
    });
    var hasHolds = !!parentHolds || !!seq.holds || data.entities.some(function (e) { return e.holds && e.holds.length; }) ||
      steps.some(function (st) { return st.messages.some(function (m) { return !!m.holds; }); });
    return { seq: seq, steps: steps, all: all, beats: all, msgCount: n, stepState: stepState, hasHolds: hasHolds, avail: avail,
      entities: data.entities.map(function (e) { return e.id; }).filter(function (id) { return seen[id]; }), fragments: avail ? (seq.fragments || []) : [], shut: [] };
  }
  /* first and last beat of every step, for the frames on the sequence diagram */
  function finish(Rt) {
    Rt.stepBeats = Rt.steps.map(function () { return null; });
    Rt.beats.forEach(function (b, i) {
      var from = b.grp ? b.grp.start : b.step, to = b.grp ? b.grp.end : b.step;
      for (var s = from; s <= to; s++) { if (!Rt.stepBeats[s]) Rt.stepBeats[s] = { first: i, last: i }; else Rt.stepBeats[s].last = i; }
    });
    return Rt;
  }
  /* Collapsed group fragments fold their steps into one beat that shows the net change of holdings. */
  function fold(Rt, isOpen) {
    var frs = Rt.fragments, shut = [];
    frs.forEach(function (f, i) { if (f.kind === "group" && !isOpen(i, f)) shut.push(i); });
    shut = shut.filter(function (i) { var f = frs[i]; return !shut.some(function (j) { var g = frs[j]; return j !== i && g.start <= f.start && g.end >= f.end; }); });
    Rt.shut = shut.map(function (i) { return frs[i]; });
    var beats = [];
    Rt.all.forEach(function (b) {
      var g = null;
      Rt.shut.forEach(function (f) { if (b.step >= f.start && b.step <= f.end) g = f; });
      if (!g) { beats.push(b); return; }
      var last = beats[beats.length - 1];
      if (!last || last.grp !== g) beats.push(last = { step: g.start, grp: g, msg: null, n: 0, msgs: [], before: b.before, added: {}, removed: {} });
      if (b.msg) last.msgs.push(b.msg);
      last.after = b.after;
    });
    beats.forEach(function (b) {
      if (b.grp) Object.keys(b.after).forEach(function (id) {
        var a = b.after[id].filter(function (x) { return b.before[id].indexOf(x) === -1; }), r = b.before[id].filter(function (x) { return b.after[id].indexOf(x) === -1; });
        if (a.length) b.added[id] = a; if (r.length) b.removed[id] = r;
      });
    });
    Rt.beats = beats;
    return finish(Rt);
  }
  /* The topic as it stands in one version, at the level the path opens (step indexes into inner sequences). */
  function resolveTopic(M, data, topic, versionId, path, isOpen) {
    var avail = true, reason = null, vi = versionId ? M.VI[versionId] : -1;
    if (versionId && topic.availableFrom && vi < M.VI[topic.availableFrom]) { avail = false; reason = { kind: "arrives", version: topic.availableFrom }; }
    if (versionId && topic.removedIn && vi >= M.VI[topic.removedIn]) { avail = false; reason = { kind: "removed", version: topic.removedIn }; }
    var Rt = resolveLevel(M, data, topic, versionId, avail, null, false), crumbs = [], key = topic.id;
    (path || []).some(function (i) {
      var s = Rt.steps[i];
      if (!avail || !s || !s.inner) return true;
      crumbs.push({ idx: i, title: s.title, n: Rt.steps.length });
      key += "." + i;
      Rt = resolveLevel(M, data, s.inner, versionId, true, Rt.stepState[i], Rt.hasHolds);
    });
    fold(Rt, function (i, f) { return isOpen ? isOpen(key + "#" + i, f) : f.collapsed === false; });
    Rt.topic = topic; Rt.reason = reason; Rt.crumbs = crumbs; Rt.key = key;
    return Rt;
  }
  /* Every inner sequence drawn in place under a ref frame, every group open: the full picture's "Expand all". */
  function flatten(M, data, Rt, versionId, path) {
    var out = { steps: [], labels: [], all: [], fragments: [], seen: {}, hasHolds: Rt.hasHolds, avail: true, shut: [] }, a = [], z = [], pre = path.map(function (i) { return i + 1; }).join(".");
    Rt.entities.forEach(function (id) { out.seen[id] = true; });
    function shift(f, off) { var g = ext(f, { start: f.start + off, end: f.end + off }); if (f.branches) g.branches = f.branches.map(function (b) { return ext(b, { start: b.start + off, end: b.end + off }); }); return g; }
    Rt.steps.forEach(function (s, i) {
      a[i] = out.steps.length; out.steps.push(s); out.labels.push((pre ? pre + "." : "") + (i + 1));
      Rt.all.forEach(function (b) { if (b.step === i) out.all.push(ext(b, { step: a[i], path: path })); });
      if (s.inner) {
        var sub = flatten(M, data, resolveLevel(M, data, s.inner, versionId, true, Rt.stepState[i], Rt.hasHolds), versionId, path.concat([i])), off = out.steps.length;
        sub.steps.forEach(function (x, k) { out.steps.push(x); out.labels.push(sub.labels[k]); });
        sub.all.forEach(function (b) { out.all.push(ext(b, { step: b.step + off })); });
        sub.fragments.forEach(function (f) { out.fragments.push(shift(f, off)); });
        out.fragments.push({ kind: "ref", label: s.title, start: off, end: out.steps.length - 1 });
        Object.keys(sub.seen).forEach(function (id) { out.seen[id] = true; });
      }
      z[i] = out.steps.length - 1;
    });
    Rt.fragments.forEach(function (f) {
      var g = ext(f, { start: a[f.start], end: z[f.end], collapsed: false });
      if (f.branches) g.branches = f.branches.map(function (b) { return ext(b, { start: a[b.start], end: z[b.end] }); });
      out.fragments.push(g);
    });
    out.beats = out.all;
    out.msgCount = out.all.filter(function (b) { return b.msg; }).length;
    out.entities = data.entities.map(function (e) { return e.id; }).filter(function (id) { return out.seen[id]; });
    return finish(out);
  }
  /* The frames to draw: fragments outside collapsed groups, and a ref frame on every step with an inner sequence. */
  function framesOf(Rt, refs) {
    var inShut = function (s, e) { return Rt.shut.some(function (g) { return s >= g.start && e <= g.end; }); };
    var out = Rt.fragments.filter(function (f) { return Rt.shut.indexOf(f) === -1 && !inShut(f.start, f.end); });
    if (refs) Rt.steps.forEach(function (s, i) { if (s.inner && !inShut(i, i)) out.push({ kind: "ref", label: s.inner.steps.length + " inner steps", start: i, end: i, open: i }); });
    return out;
  }
  /* The channel a message travels on: its own, or the one of the link between its ends. */
  function channelOf(M, m) {
    if (m.channel && M.C[m.channel]) return M.C[m.channel];
    var l = M.L[pairKey(m.from, m.to)];
    return l && l.channel && M.C[l.channel] ? M.C[l.channel] : null;
  }
  function hueClass(ch) { return ch ? " nthview-df-ch-" + ch.color : ""; }

  // ---- layout of the network diagram ------------------------------------------
  function layoutNetwork(M, ids, narrow) {
    var CW = 236, CH = 212, PAD = 22, HEAD = 36, GAP = narrow ? 30 : 64, perRow = narrow ? 2 : 3;
    var groups = [], byZone = {};
    ids.forEach(function (id) {
      var zid = zoneOf(M, id), z = zid && M.Z[zid] ? zid : null;
      if (z) { if (!byZone[z]) { byZone[z] = { zone: M.Z[z], ids: [] }; groups.push(byZone[z]); } byZone[z].ids.push(id); }
      else groups.push({ zone: null, ids: [id] });
    });
    function size(g) { g.rows = Math.ceil(g.ids.length / g.cols); g.w = g.cols * CW + (g.zone ? PAD * 2 : 0); g.h = g.rows * CH + (g.zone ? PAD + HEAD : 0); }
    groups.forEach(function (g) { g.cols = Math.min(perRow, g.ids.length); size(g); });
    var n = groups.length, W, H;
    if (!narrow && n >= 2 && n <= 7) {
      /* a flow reads left to right: the first zone (where the story starts) stands on the left with its
         parties stacked, the other zones are stacked in one or two columns to its right */
      var home = groups[0], rest = groups.slice(1);
      if (home.ids.length <= 2) home.cols = 1; else if (home.ids.length <= 4) home.cols = 2;
      size(home);
      var rcols = rest.length <= 2 ? 1 : 2, rrows = [];
      rest.forEach(function (g, i) { var r = Math.floor(i / rcols); (rrows[r] = rrows[r] || []).push(g); });
      var restW = Math.max.apply(null, rrows.map(function (row) { return row.reduce(function (sum, g) { return sum + g.w; }, 0) + GAP * (row.length - 1); }));
      var restH = rrows.reduce(function (sum, row) { return sum + Math.max.apply(null, row.map(function (g) { return g.h; })); }, 0) + GAP * (rrows.length - 1);
      H = Math.max(home.h, restH) + GAP * 2; W = home.w + GAP * 1.6 + restW + GAP * 2;
      home.x = GAP; home.y = (H - home.h) / 2;
      var ry = (H - restH) / 2;
      rrows.forEach(function (row) {
        var rh = Math.max.apply(null, row.map(function (g) { return g.h; })), rowW = row.reduce(function (sum, g) { return sum + g.w; }, 0) + GAP * (row.length - 1);
        var rx = home.x + home.w + GAP * 1.6 + (restW - rowW) / 2;
        row.forEach(function (g) { g.x = rx; g.y = ry + (rh - g.h) / 2; rx += g.w + GAP; });
        ry += rh + GAP;
      });
    } else {
      var cols = narrow ? (groups.every(function (g) { return g.ids.length === 1; }) ? 2 : 1) : (n <= 3 ? n : Math.ceil(Math.sqrt(n)));
      var rows = [];
      groups.forEach(function (g, i) { var r = Math.floor(i / cols); (rows[r] = rows[r] || []).push(g); });
      var rowW = rows.map(function (row) { return row.reduce(function (sum, g) { return sum + g.w; }, 0) + GAP * (row.length - 1); });
      W = Math.max.apply(null, rowW) + GAP * 2; var y = GAP;
      rows.forEach(function (row, r) {
        var h = Math.max.apply(null, row.map(function (g) { return g.h; })), x = (W - rowW[r]) / 2;
        row.forEach(function (g) { g.x = x; g.y = y + (h - g.h) / 2; x += g.w + GAP; });
        y += h + GAP;
      });
      H = y;
    }
    /* a small diagram floats centred in a 1000x560 frame so two entities are not blown up to fill the stage */
    var VW = Math.max(W, narrow ? 0 : 1000), VH = Math.max(H, narrow ? 0 : 560), dx = (VW - W) / 2, dy = (VH - H) / 2;
    var nodes = {}, zones = [];
    groups.forEach(function (g) {
      g.x += dx; g.y += dy;
      if (g.zone) zones.push({ zone: g.zone, x: g.x, y: g.y, w: g.w, h: g.h });
      var ox = g.x + (g.zone ? PAD : 0), oy = g.y + (g.zone ? HEAD + PAD / 2 : 0);
      g.ids.forEach(function (id, k) {
        var rr = Math.floor(k / g.cols), cc = k % g.cols, inRow = Math.min(g.cols, g.ids.length - rr * g.cols), off = (g.cols - inRow) * CW / 2;
        nodes[id] = { x: ox + off + cc * CW + CW / 2, y: oy + rr * CH + CH / 2 };
      });
    });
    return { W: VW, H: VH, nodes: nodes, zones: zones };
  }

  // ---- view-specific rendering: data is already valid here ---------------
  function render(container, data) {
    var doc = root.document;
    var reduceMotion = !!(root.matchMedia && root.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var key = storageKey(data);
    var M = buildModel(data);
    GLOSS = {}; (data.glossary || []).forEach(function (g) { GLOSS[g.term.trim().toLowerCase()] = g; });
    onTerm = showTerm;
    /* a later build() on the same container retires this one's listeners */
    var gen = container.nthviewGen = (container.nthviewGen || 0) + 1;
    function live() { return container.nthviewGen === gen; }
    var theme = data.theme || "graphite";
    container.setAttribute("data-theme", theme);

    /* ---------- state and progress (§5.5) ---------- */
    var defaultMode = data.defaultMode || (M.single ? "sequence" : "network");
    var state = { screen: M.single ? "lesson" : "intro", topic: M.topics[0].id, path: [], pos: 0, version: M.defaultVersion, mode: defaultMode, scheme: PALETTES[theme].side,
      checks: {}, groups: {}, compare: false, changed: false, panel: "message", done: false };
    var saved = loadState(key), resumed = false;
    if (saved) {
      if (!M.single && (saved.screen === "lesson" || saved.screen === "intro")) state.screen = saved.screen;
      if (Array.isArray(saved.path) && saved.path.every(function (x) { return typeof x === "number" && x >= 0 && x % 1 === 0; })) state.path = saved.path;
      if (saved.groups && typeof saved.groups === "object" && !Array.isArray(saved.groups)) Object.keys(saved.groups).forEach(function (k) { if (typeof saved.groups[k] === "boolean") state.groups[k] = saved.groups[k]; });
      state.compare = saved.compare === true; state.changed = saved.changed === true;
      if (typeof saved.topic === "string" && M.TI[saved.topic]) state.topic = saved.topic;
      if (typeof saved.pos === "number" && saved.pos >= 0) state.pos = Math.floor(saved.pos);
      if (typeof saved.version === "string" && M.VI[saved.version] !== undefined) state.version = saved.version;
      if (saved.mode === "network" || saved.mode === "sequence") state.mode = saved.mode;
      if (saved.scheme === "light" || saved.scheme === "dark" || saved.scheme === "auto") state.scheme = saved.scheme;
      if (saved.checks && typeof saved.checks === "object" && !Array.isArray(saved.checks)) state.checks = saved.checks;
      if (saved.panel === "article" || saved.panel === "message") state.panel = saved.panel;
      state.done = saved.done === true;
      resumed = M.single ? state.pos > 0 || state.path.length > 0 : state.screen === "lesson";
    }
    function untouched() {
      return !state.done && (M.single ? !state.pos && !state.path.length : state.screen === "intro") && !Object.keys(state.checks).length && !Object.keys(state.groups).length &&
        !state.compare && !state.changed && state.version === M.defaultVersion && state.mode === defaultMode && state.scheme === PALETTES[theme].side;
    }
    function persist() {
      if (!live()) return;
      if (untouched()) { clearState(key); return; }
      saveState(key, { screen: state.screen, topic: state.topic, path: state.path, pos: state.pos, version: state.version, mode: state.mode, scheme: state.scheme, checks: state.checks,
        groups: state.groups, compare: state.compare, changed: state.changed, panel: state.panel, done: state.done });
    }
    function applyScheme() {
      if (state.scheme === "auto") container.removeAttribute("data-scheme"); else container.setAttribute("data-scheme", state.scheme);
    }
    applyScheme();

    var R = null, playing = false, timer = null, anim = null, ui = {};
    var narrowStage = false;
    function versionLabel(id) { var v = id && M.V[M.VI[id]]; return v ? v.label : ""; }
    function topicIndex(id) { for (var i = 0; i < M.topics.length; i++) if (M.topics[i].id === id) return i; return 0; }
    function isOpen(k, f) { var v = state.groups[k]; return v === undefined ? f.collapsed === false : v; }
    function resolve() {
      R = resolveTopic(M, data, M.TI[state.topic], state.version, state.path, isOpen);
      state.path = R.crumbs.map(function (c) { return c.idx; });
      if (state.pos >= R.beats.length) state.pos = Math.max(0, R.beats.length - 1);
    }
    function checkKey(stepIdx) { return state.topic + "/" + (state.path.length ? state.path.join(".") + "." : "") + stepIdx; }
    function isGated(i) { var b = R.beats[i]; return !!(b && !b.grp && R.steps[b.step].check && state.checks[checkKey(b.step)] === undefined); }
    /* 1 right, -1 wrong, 0 skipped; a who check stores the chosen entity id, a choice check the option index */
    function verdictOf(c, a) { return a === -1 ? 0 : (c.type === "who" ? a === c.answer : !!(c.options[a] && c.options[a].correct)) ? 1 : -1; }
    function focusStage() { if (ui.stage) { try { ui.stage.focus({ preventScroll: true }); } catch (e) { ui.stage.focus(); } } }
    function curStep() { var b = R.beats[state.pos]; return b ? R.steps[b.step] : R.steps[0]; }
    function totalMessages() {
      var n = 0;
      M.topics.forEach(function (t) { n += resolveTopic(M, data, t, state.version).msgCount; });
      return n;
    }

    /* ---------- resume notice ---------- */
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

    /* ---------- top bar ---------- */
    function schemeButton() {
      var names = { dark: "Dark", light: "Light", auto: "Auto" }, order = ["dark", "light", "auto"];
      var b = el("button", { type: "button", class: "nthview-df-scheme" });
      function draw() {
        b.innerHTML = "";
        b.appendChild(icon(state.scheme === "dark" ? "moon" : state.scheme === "light" ? "sun" : "auto"));
        var next = order[(order.indexOf(state.scheme) + 1) % 3];
        b.setAttribute("aria-label", "Colour scheme: " + names[state.scheme] + ". Switch to " + names[next]);
        b.title = "Colour scheme: " + names[state.scheme] + " (click for " + names[next] + ")";
      }
      b.addEventListener("click", function () { state.scheme = order[(order.indexOf(state.scheme) + 1) % 3]; applyScheme(); persist(); draw(); });
      draw();
      return b;
    }
    function timeMachine() {
      var cur = M.V[M.VI[state.version]];
      var head = el("div", { class: "nthview-df-tmh" }, [el("span", { text: data.versionsLabel || "Version" }), el("b", { text: cur.label + (cur.date ? " · " + cur.date : "") })]);
      var line = el("div", { class: "nthview-df-tml", role: "group", "aria-label": (data.versionsLabel || "Version") + " time machine" });
      M.V.forEach(function (v) {
        var b = el("button", { type: "button", "aria-pressed": v.id === state.version ? "true" : "false", title: v.label + (v.date ? " · " + v.date : "") + (v.note ? ". " + v.note : "") }, [el("i"), el("span", { text: v.label })]);
        b.addEventListener("click", function () { setVersion(v.id); });
        line.appendChild(b);
      });
      var sel = el("select", { "aria-label": (data.versionsLabel || "Version") });
      M.V.forEach(function (v) { var o = el("option", { value: v.id, text: v.label + (v.date ? " · " + v.date : "") }); if (v.id === state.version) o.selected = true; sel.appendChild(o); });
      sel.addEventListener("change", function () { setVersion(sel.value); });
      ui.tmSelect = el("div", { class: "nthview-df-tmselect" }, [sel]);
      return el("div", { class: "nthview-df-tm" }, [head, line]);
    }
    function topBar() {
      var brand = M.single ? el("span", { class: "nthview-df-brand", text: data.title }) : el("button", { type: "button", class: "nthview-df-brand", text: data.title, title: "Back to the overview" });
      if (!M.single) brand.addEventListener("click", function () { setScreen("intro"); });
      var bar = el("div", { class: "nthview-df-top" }, [el("h1", { class: "nthview-df-sr", text: data.title }), brand]);
      if (state.screen === "lesson" && !M.single) {
        var ib = el("button", { type: "button", class: "nthview-df-introbtn", text: "Overview" });
        ib.addEventListener("click", function () { setScreen("intro"); });
        bar.appendChild(ib);
      }
      var fb = el("button", { type: "button", class: "nthview-df-introbtn nthview-df-fullbtn", title: "The whole flow in one diagram" }, [icon("full"), doc.createTextNode("Full picture")]);
      fb.addEventListener("click", function () { openFullPicture(); });
      bar.appendChild(fb);
      if (data.glossary && data.glossary.length) { var gb = el("button", { type: "button", class: "nthview-df-introbtn nthview-df-glossbtn", text: "Glossary", "aria-haspopup": "dialog" }); gb.addEventListener("click", openGlossary); bar.appendChild(gb); }
      if (M.hasTM && state.screen === "lesson") bar.appendChild(timeMachine());
      bar.appendChild(el("div", { class: "nthview-df-topright" }, [schemeButton(), restartButton(container, data, key)]));
      return bar;
    }

    /* ---------- hero ---------- */
    function hero() {
      var inner = el("div", { class: "nthview-df-hero-in" });
      if (data.kicker) inner.appendChild(el("p", { class: "nthview-df-kicker", text: data.kicker }));
      inner.appendChild(el("h2", { text: data.heading || data.title }));
      inner.appendChild(para("nthview-df-lead", data.lead));
      if (data.facts && data.facts.length) {
        var dl = el("dl", { class: "nthview-df-facts" });
        data.facts.forEach(function (f) { dl.appendChild(el("dt", { text: f.term })); var dd = el("dd"); dd.appendChild(rich(f.text)); dl.appendChild(dd); });
        inner.appendChild(dl);
      }
      var start = el("button", { type: "button", class: "nthview-df-btn nthview-df-btn-primary nthview-df-start" }, [doc.createTextNode(data.startLabel || "Start the lessons"), doc.createTextNode(" →")]);
      start.addEventListener("click", function () { openTopic(M.topics[0].id, true); });
      inner.appendChild(start);
      if (data.jumps && data.jumps.length) {
        var j = el("p", { class: "nthview-df-jumps" }, [doc.createTextNode("or jump to ")]);
        data.jumps.forEach(function (id, i) {
          if (i) j.appendChild(doc.createTextNode(" · "));
          var b = el("button", { type: "button", text: M.TI[id].title });
          b.addEventListener("click", function () { openTopic(id, true); });
          j.appendChild(b);
        });
        inner.appendChild(j);
      }
      var cap = el("p", { class: "nthview-df-preview-cap", text: data.entities.length + " entities · " + M.topics.length + " topics · " + totalMessages() + " messages" + (M.hasTM ? " · " + M.V.length + " versions" : "") });
      var stage = el("div", { class: "nthview-df-stage nthview-df-stage-preview", "aria-label": "Overview diagram of every entity" });
      ui.previewStage = stage;
      var preview = el("div", { class: "nthview-df-preview" }, [cap, stage]);
      var wrap = el("div", { class: "nthview-df-intro" }, [el("div", { class: "nthview-df-hero" }, [inner]), preview]);
      return wrap;
    }
    function drawPreview() {
      if (!ui.previewStage) return;
      ui.previewStage.innerHTML = "";
      var narrow = ui.previewStage.clientWidth > 0 && ui.previewStage.clientWidth < 560;
      var net = buildNetwork(data.entities.map(function (e) { return e.id; }), narrow, null);
      ui.previewStage.appendChild(net.svg);
    }

    /* ---------- network diagram ---------- */
    function buildNetwork(ids, narrow, Rt) {
      var lay = layoutNetwork(M, ids, narrow);
      var svg = svgEl("svg", { viewBox: "0 0 " + f1(lay.W) + " " + f1(lay.H), preserveAspectRatio: "xMidYMid meet", role: "img", "aria-label": "Network diagram" });
      var shown = {}; ids.forEach(function (id) { shown[id] = true; });
      lay.zones.forEach(function (z) {
        var g = svgEl("g", { class: "nthview-df-zone" + (z.zone.remote ? " nthview-df-remote" : "") });
        g.appendChild(svgEl("rect", { x: f1(z.x), y: f1(z.y), width: f1(z.w), height: f1(z.h), rx: 14 }));
        var lab = svgEl("text", { class: "nthview-df-zl", x: f1(z.x + 18), y: f1(z.y + 24), text: z.zone.name });
        g.appendChild(lab);
        if (z.zone.subtitle) g.appendChild(svgEl("text", { class: "nthview-df-zs", x: f1(z.x + 18 + z.zone.name.length * 7.9 + 12), y: f1(z.y + 24), text: z.zone.subtitle }));
        svg.appendChild(g);
      });
      /* edges: declared links among shown entities, plus implicit ones for message pairs without a link */
      var edges = {}, eg = svgEl("g");
      function addEdge(a, b, link) {
        var k = pairKey(a, b);
        if (edges[k] || a === b || !lay.nodes[a] || !lay.nodes[b]) return;
        var pa = lay.nodes[a], pb = lay.nodes[b];
        var ch = link && link.channel && M.C[link.channel] ? M.C[link.channel] : null;
        var line = svgEl("line", { class: "nthview-df-edge" + (link ? "" : " nthview-df-implicit") + hueClass(ch), x1: f1(pa.x), y1: f1(pa.y), x2: f1(pb.x), y2: f1(pb.y) });
        eg.appendChild(line);
        var pill = null;
        if (link && link.label) {
          var mx = (pa.x + pb.x) / 2, my = (pa.y + pb.y) / 2, w = link.label.length * 7 + 16;
          pill = svgEl("g", { class: "nthview-df-epill" + hueClass(ch) }, [svgEl("rect", { x: f1(mx - w / 2), y: f1(my - 10), width: f1(w), height: 20, rx: 10 }), svgEl("text", { x: f1(mx), y: f1(my + 3.8), "text-anchor": "middle", text: link.label })]);
        }
        edges[k] = { line: line, pill: pill, a: a, b: b };
      }
      Object.keys(M.L).forEach(function (k) { var l = M.L[k]; if (shown[l.from] && shown[l.to]) addEdge(l.from, l.to, l); });
      if (Rt) Rt.beats.forEach(function (b) { if (b.msg) addEdge(b.msg.from, b.msg.to, null); });
      svg.appendChild(eg);
      var pills = svgEl("g"); Object.keys(edges).forEach(function (k) { if (edges[k].pill) pills.appendChild(edges[k].pill); }); svg.appendChild(pills);
      /* nodes */
      var nodes = {}, ng = svgEl("g");
      ids.forEach(function (id) {
        var e = M.E[id], p = lay.nodes[id];
        var g = svgEl("g", { class: "nthview-df-node", "data-id": id });
        var gl = drawGlyph(e.kind || "generic", p.x, p.y - 30, 1.4);
        if (gl.halfH > 48) gl = drawGlyph(e.kind || "generic", p.x, p.y - 30, 1.4 * 48 / gl.halfH);
        g.appendChild(gl.g);
        g.appendChild(svgEl("text", { class: "nthview-df-nl", x: f1(p.x), y: f1(p.y + 44), text: e.name }));
        if (e.subtitle) g.appendChild(svgEl("text", { class: "nthview-df-ns", x: f1(p.x), y: f1(p.y + 64), text: e.subtitle }));
        var t = svgEl("title", { text: e.name + (e.subtitle ? " · " + e.subtitle : "") }); g.appendChild(t);
        ng.appendChild(g);
        nodes[id] = { g: g, x: p.x, y: p.y - 26 };
      });
      svg.appendChild(ng);
      var fx = svgEl("g"); svg.appendChild(fx);
      return { svg: svg, nodes: nodes, edges: edges, fx: fx, W: lay.W, H: lay.H, addEdge: addEdge };
    }

    /* ---------- sequence diagram ---------- */
    /* blocks: [{ Rt, title, topicId }]. The lesson passes its one topic; the full picture passes every
       topic, each under a title band, on lifelines shared by all of them. */
    function buildSequence(blocks, ids, avail, availH, opts) {
      opts = opts || {};
      blocks.forEach(function (b) { b.frames = framesOf(b.Rt, opts.refs); });
      var hasFrames = blocks.some(function (b) { return b.frames.length > 0; });
      var n = Math.max(ids.length, 1), LEFT = 36, ROW = hasFrames ? 48 : 40, TOP = hasFrames ? 140 : 116, BAND = 44;
      var W = Math.max(avail, n * 150 + LEFT + 20), COL = (W - LEFT - 20) / n, BOX = Math.min(170, COL - 16);
      var rowsTotal = blocks.reduce(function (sum, b) { return sum + Math.max(b.Rt.beats.length, 1) + (b.title ? BAND / ROW : 0); }, 0);
      var H = Math.max(availH || 0, TOP + rowsTotal * ROW + 30);
      var svg = svgEl("svg", { viewBox: "0 0 " + f1(W) + " " + f1(H), preserveAspectRatio: "xMidYMin meet", role: "img", "aria-label": "Sequence diagram", style: "width:" + f1(W) + "px;height:" + f1(H) + "px;min-height:0;display:block;margin:0 auto" });
      var X = {}, heads = {};
      ids.forEach(function (id, i) {
        var x = LEFT + COL * (i + 0.5), e = M.E[id];
        X[id] = x;
        svg.appendChild(svgEl("line", { class: "nthview-df-life", x1: f1(x), y1: 90, x2: f1(x), y2: f1(H - 12) }));
        var mem = e.members ? e.members.length : 0;
        var g = svgEl("g", { class: "nthview-df-lifehead", "data-id": id }, [
          svgEl("rect", { x: f1(x - BOX / 2), y: 16, width: f1(BOX), height: 42, rx: 8 }),
          svgEl("text", { x: f1(x), y: mem ? 36 : 42, text: e.name })
        ]);
        if (mem) {
          g.appendChild(svgEl("text", { class: "nthview-df-zl", x: f1(x), y: 51, "text-anchor": "middle", text: mem + " INSIDE" }));
          g.appendChild(svgEl("title", { text: e.name + ": " + e.members.map(function (m) { return M.E[m].name; }).join(", ") }));
        }
        var z = zoneOf(M, id) && M.Z[zoneOf(M, id)];
        if (z) g.appendChild(svgEl("text", { class: "nthview-df-zl", x: f1(x), y: 76, "text-anchor": "middle", text: z.name }));
        svg.appendChild(g); heads[id] = g;
      });
      var arrows = [], base = TOP;
      blocks.forEach(function (blk) {
      var Rt = blk.Rt, lastStep = -1;
      if (blk.title) {
        svg.appendChild(svgEl("line", { class: "nthview-df-ssep", x1: LEFT, y1: f1(base - 30), x2: f1(W - 10), y2: f1(base - 30) }));
        svg.appendChild(svgEl("text", { class: "nthview-df-seqtopic", x: LEFT + 4, y: f1(base - 8), text: blk.title }));
        base += BAND;
      }
      if (blk.frames.length) drawFrames(svg, Rt, blk.frames, LEFT, W, base, ROW, opts.onRef);
      Rt.beats.forEach(function (b, i) {
        var y = base + i * ROW, st = Rt.steps[b.step];
        if (b.step !== lastStep) {
          lastStep = b.step;
          svg.appendChild(svgEl("text", { class: "nthview-df-sstep", x: 8, y: f1(y + 4), text: b.grp ? (b.grp.start + 1) + "–" + (b.grp.end + 1) : Rt.labels ? Rt.labels[b.step] : String(b.step + 1) }));
          if (!b.grp && st.note) svg.appendChild(svgEl("text", { class: "nthview-df-snote nthview-df-snote-" + st.note.severity, x: 24, y: f1(y + 4), text: "!" }, [svgEl("title", { text: st.note.severity + ": " + st.note.text.replace(/\*\*|`|\(\(|\)\)/g, "") })]));
          if (i) svg.appendChild(svgEl("line", { class: "nthview-df-ssep", x1: LEFT, y1: f1(y - ROW / 2 - 2), x2: f1(W - 10), y2: f1(y - ROW / 2 - 2) }));
        }
        if (b.grp) {
          var xs = [];
          b.msgs.forEach(function (m) { if (X[m.from] !== undefined) xs.push(X[m.from]); if (X[m.to] !== undefined) xs.push(X[m.to]); });
          var gl = "▸ " + b.grp.label + " · " + (b.grp.end - b.grp.start + 1) + " steps", need = gl.length * 7.2 + 28;
          var gx1 = xs.length ? Math.min.apply(null, xs) - 24 : LEFT + 10, gx2 = xs.length ? Math.max.apply(null, xs) + 24 : W - 20;
          if (gx2 - gx1 < need) { var mid = (gx1 + gx2) / 2; gx1 = Math.max(LEFT + 4, mid - need / 2); gx2 = Math.min(W - 8, gx1 + need); }
          var gg = svgEl("g", { class: "nthview-df-sgrp", "data-i": i }, [svgEl("rect", { x: f1(gx1), y: f1(y - 14), width: f1(gx2 - gx1), height: 28, rx: 14 }),
            svgEl("text", { x: f1((gx1 + gx2) / 2), y: f1(y + 4), "text-anchor": "middle", text: gl }), svgEl("title", { text: "Folded group: " + b.grp.label })]);
          gg.addEventListener("click", function () { if (opts.onPick) opts.onPick(blk, i); else { stop(); setPos(i); } });
          svg.appendChild(gg); arrows.push(gg); return;
        }
        if (!b.msg) {
          svg.appendChild(svgEl("text", { class: "nthview-df-sstep", x: LEFT + 4, y: f1(y + 4), text: Rt.steps[b.step].title + " · no message" }));
          arrows.push(null); return;
        }
        var m = b.msg, k = kindOf(m), g = svgEl("g", { class: "nthview-df-sm nthview-df-k-" + k + (isDeprecated(m) ? " nthview-df-dep" : "") + hueClass(channelOf(M, m)), "data-i": i });
        var x1 = X[m.from], x2 = X[m.to], label = m.name;
        if (m.info && (label.length + m.info.length + 3) * 7.4 < Math.abs(x2 - x1) - 24) label += " · " + m.info;
        if (m.from === m.to) {
          g.appendChild(svgEl("path", { d: "M" + f1(x1 + 4) + " " + f1(y - 9) + "h40v18h-36" }));
          g.appendChild(svgEl("polygon", { class: "nthview-df-ah", points: pts([[x1 + 4, y + 9], [x1 + 13, y + 4.5], [x1 + 13, y + 13.5]]) }));
          g.appendChild(svgEl("text", { x: f1(x1 + 54), y: f1(y + 4), "text-anchor": "start", text: label }));
          g.appendChild(svgEl("title", { text: m.name + " (" + M.E[m.from].name + ", local)" }));
        } else {
          var dir = x2 > x1 ? 1 : -1, ax1 = x1 + dir * 4, ax2 = x2 - dir * 4;
          g.appendChild(svgEl("line", { x1: f1(ax1), y1: f1(y), x2: f1(ax2 - dir * 9), y2: f1(y) }));
          g.appendChild(svgEl("polygon", { class: "nthview-df-ah", points: pts([[ax2, y], [ax2 - dir * 11, y - 5], [ax2 - dir * 11, y + 5]]) }));
          var t = svgEl("text", { x: f1((x1 + x2) / 2), y: f1(y - 7) });
          if (isDeprecated(m)) t.appendChild(svgEl("tspan", { class: "nthview-df-sdep", text: "DEPRECATED " }));
          t.appendChild(doc.createTextNode(label));
          g.appendChild(t);
          g.appendChild(svgEl("title", { text: m.name + ": " + M.E[m.from].name + " → " + M.E[m.to].name }));
        }
        if (opts.onPick) g.addEventListener("click", function () { opts.onPick(blk, i); });
        else g.addEventListener("click", function () { stop(); setPos(i); });
        svg.appendChild(g); arrows.push(g);
      });
      base += Math.max(Rt.beats.length, 1) * ROW;
      });
      var fx = svgEl("g"); svg.appendChild(fx);
      return { svg: svg, arrows: arrows, heads: heads, X: X, TOP: TOP, ROW: ROW, fx: fx };
    }

    /* alt, opt and loop frames: a box around the rows of the steps they cover, a tab with the kind and label,
       the guard in brackets, and for alt a dashed separator before every further branch */
    function drawFrames(svg, Rt, frames, LEFT, W, TOP, ROW, onRef) { /* TOP is the y of this block's first row */
      var frags = frames.map(function (f, i) { return { f: f, i: i, first: Rt.stepBeats[f.start].first, last: Rt.stepBeats[f.end].last }; });
      frags.forEach(function (a) { a.depth = frags.filter(function (b) { return b !== a && b.first <= a.first && b.last >= a.last && (b.first < a.first || b.last > a.last || b.i < a.i); }).length; });
      var tabsAt = {};
      frags.forEach(function (fr) {
        var f = fr.f, inset = fr.depth * 12, x1 = LEFT + 6 + inset, x2 = W - 12 - inset;
        var yTop = TOP + fr.first * ROW - 26, yBot = TOP + fr.last * ROW + 20;
        var g = svgEl("g", { class: "nthview-df-frag" + (f.kind === "ref" ? " nthview-df-ref" : "") });
        g.appendChild(svgEl("rect", { x: f1(x1), y: f1(yTop), width: f1(x2 - x1), height: f1(yBot - yTop), rx: 4 }));
        var tabText = f.kind + (f.label ? " " + f.label : ""), tabW = tabText.length * 6.6 + 14, tabX = x1 + (tabsAt[fr.first] || 0);
        tabsAt[fr.first] = (tabsAt[fr.first] || 0) + tabW + 6;
        g.appendChild(svgEl("rect", { class: "nthview-df-fragtab", x: f1(tabX), y: f1(yTop - 16), width: f1(tabW), height: 16, rx: 3 }));
        g.appendChild(svgEl("text", { x: f1(tabX + 7), y: f1(yTop - 4.5), text: tabText }));
        if (f.kind === "alt") {
          f.branches.forEach(function (b, k) {
            var yb = TOP + Rt.stepBeats[b.start].first * ROW - 26;
            if (k) g.appendChild(svgEl("line", { class: "nthview-df-fragsep", x1: f1(x1), y1: f1(yb), x2: f1(x2), y2: f1(yb) }));
            g.appendChild(svgEl("text", { class: "nthview-df-fragcond", x: f1(k ? x1 + 8 : tabX + tabW + 8), y: f1(yb - 4.5), text: "[" + b.condition + "]" }));
          });
        } else if (f.condition) {
          g.appendChild(svgEl("text", { class: "nthview-df-fragcond", x: f1(tabX + tabW + 8), y: f1(yTop - 4.5), text: "[" + f.condition + "]" }));
        }
        if (f.open !== undefined && onRef) { g.appendChild(svgEl("title", { text: "Open the inner sequence" })); g.addEventListener("click", function () { onRef(f.open); }); }
        svg.appendChild(g);
      });
    }

    /* ---------- lesson layout ---------- */
    function sidebar() {
      var side = el("aside", { class: "nthview-df-side", "aria-label": "Topics" });
      var closeB = el("button", { type: "button", "aria-label": "Close topics", text: "×" });
      closeB.addEventListener("click", function () { toggleDrawer(false); });
      side.appendChild(el("div", { class: "nthview-df-drawerhead" }, [el("span", { class: "nthview-df-muted", text: "Topics" }), closeB]));
      var head = el("div", { class: "nthview-df-sidehead" }, [el("h2", { text: data.kicker || data.title })]);
      if (M.single && data.lead) head.appendChild(para("nthview-df-vernote", data.lead));
      if (M.hasTM) { var cv = M.V[M.VI[state.version]]; if (cv.note) head.appendChild(para("nthview-df-vernote", cv.label + ": " + cv.note)); }
      side.appendChild(head);
      if (M.single) side.appendChild(stepList(R));
      else data.sections.forEach(function (s) {
        side.appendChild(el("div", { class: "nthview-df-gh", text: s.title }));
        s.topics.forEach(function (t) { side.appendChild(topicItem(t)); });
      });
      if (data.further) {
        side.appendChild(el("div", { class: "nthview-df-gh", text: data.further.title || "What's next" }));
        var fl = el("div", { class: "nthview-df-further" });
        data.further.items.forEach(function (it) {
          var a = el("a", { href: it.url, target: "_blank", rel: "noopener" }, [el("b", { text: it.title })]);
          if (it.subtitle) a.appendChild(el("em", { text: it.subtitle }));
          fl.appendChild(a);
        });
        side.appendChild(fl);
      }
      return side;
    }
    function topicItem(t) {
      var open = t.id === state.topic, Rt = open ? R : resolveTopic(M, data, t, state.version);
      var item = el("div", { class: "nthview-df-topic" + (open ? " nthview-df-topic-open" : "") + (Rt.avail ? "" : " nthview-df-topic-off") });
      var titleB = el("b", { text: t.title });
      if (t.tag) titleB.appendChild(el("i", { class: "nthview-df-tag", text: t.tag }));
      var sub = Rt.avail ? t.subtitle : (Rt.reason.kind === "arrives" ? "Arrives in " + versionLabel(Rt.reason.version) : "Removed in " + versionLabel(Rt.reason.version));
      var b = el("button", { type: "button", class: "nthview-df-th", "aria-expanded": open ? "true" : "false" }, [titleB, el("em", { text: sub })]);
      b.addEventListener("click", function () { if (open) { toggleDrawer(false); return; } openTopic(t.id, false); });
      item.appendChild(b);
      if (open) item.appendChild(stepList(Rt));
      return item;
    }

    /* The steps of the open level: a row per ancestor to back out to, a folded group as one row, a mark on
       steps that open an inner sequence. */
    function stepList(Rt) {
      var ol = el("ol", { class: "nthview-df-steps" });
      ui.stepList = ol;
      if (!Rt.avail) { ol.appendChild(el("li", {}, [el("span", { class: "nthview-df-off" }, [el("span", { class: "nthview-df-num", text: "–" }), doc.createTextNode("Not in this version")])])); return ol; }
      Rt.crumbs.forEach(function (c, d) {
        var b = el("button", { type: "button", title: "Back out to this level" }, [el("span", { class: "nthview-df-num", text: "↑" }), el("span", { text: "Step " + (c.idx + 1) + " · " + c.title })]);
        b.addEventListener("click", function () { backOut(d); toggleDrawer(false); });
        ol.appendChild(el("li", { class: "nthview-df-crumb" }, [b]));
      });
      Rt.steps.forEach(function (s, i) {
        var g = null;
        Rt.shut.forEach(function (f) { if (i >= f.start && i <= f.end) g = f; });
        if (g && i !== g.start) return;
        var beat = Rt.stepBeats[i] ? Rt.stepBeats[i].first : 0, done = !g && state.checks[checkKey(i)] !== undefined;
        var sb = g ? el("button", { type: "button" }, [el("span", { class: "nthview-df-num nthview-df-num-grp", text: (g.start + 1) + "–" + (g.end + 1) }), el("span", { text: g.label })])
          : el("button", { type: "button" }, [el("span", { class: "nthview-df-num" + (done ? " nthview-df-num-done" : ""), text: String(i + 1) }), el("span", { text: s.title })]);
        if (!g && s.tag) sb.appendChild(el("i", { class: "nthview-df-tag", text: s.tag }));
        if (!g && s.inner) sb.appendChild(el("i", { class: "nthview-df-in", text: "↳" + s.inner.steps.length, title: "Opens an inner sequence of " + s.inner.steps.length + " steps" }));
        sb.addEventListener("click", function () { stop(); setPos(beat); toggleDrawer(false); });
        ol.appendChild(el("li", { "data-s": String(i) }, [sb]));
      });
      return ol;
    }

    function center() {
      var c = el("section", { class: "nthview-df-center", "aria-label": "Lesson" });
      /* phone sub bar: topics drawer button and the version select */
      var tb = el("button", { type: "button", class: "nthview-df-btn nthview-df-topicsbtn", "aria-expanded": "false", "aria-controls": "nthview-df-side" }, [el("span", { text: M.single ? "Steps" : M.TI[state.topic].title }), icon("menu")]);
      tb.addEventListener("click", function () { toggleDrawer(true); });
      ui.topicsBtn = tb;
      var sub = el("div", { class: "nthview-df-subbar" }, [tb]);
      if (M.hasTM && ui.tmSelect) { var sel2 = ui.tmSelect.firstChild.cloneNode(true); sel2.addEventListener("change", function () { setVersion(sel2.value); }); sub.appendChild(sel2); }
      var stagewrap = el("div", { class: "nthview-df-stagewrap" });
      stagewrap.appendChild(sub);
      if (resumed) { resumed = false; stagewrap.appendChild(resumeNotice("Welcome back, continuing from " + (M.single ? "" : M.TI[state.topic].title + " · ") + (R.crumbs.length ? "inside step " + (R.crumbs[R.crumbs.length - 1].idx + 1) + " · " : "") + (R.beats.length ? "step " + (R.beats[state.pos].step + 1) + " of " + R.steps.length : ""))); }
      if (R.crumbs.length) {
        var nav = el("nav", { class: "nthview-df-crumbs", "aria-label": "Where you are" }), topB = el("button", { type: "button", text: M.single ? data.title : M.TI[state.topic].title });
        topB.addEventListener("click", function () { backOut(0); });
        nav.appendChild(topB);
        R.crumbs.forEach(function (c, d) {
          nav.appendChild(el("span", { "aria-hidden": "true", text: "›" }));
          var label = "Step " + (c.idx + 1) + " · " + c.title;
          if (d === R.crumbs.length - 1) { nav.appendChild(el("b", { text: label + " · inner sequence" })); return; }
          var cb = el("button", { type: "button", text: label }); cb.addEventListener("click", function () { backOut(d + 1); }); nav.appendChild(cb);
        });
        stagewrap.appendChild(nav);
        if (R.seq.subtitle) stagewrap.appendChild(para("nthview-df-innersub", R.seq.subtitle));
      }
      ui.status = el("div", { class: "nthview-df-sr", "aria-live": "polite" }); c.appendChild(ui.status);
      /* caption and mode toggle */
      ui.cap = el("div", { class: "nthview-df-cap" });
      var seg = el("div", { class: "nthview-df-seg", role: "group", "aria-label": "Diagram" });
      ["network", "sequence"].forEach(function (m) {
        var b = el("button", { type: "button", "aria-pressed": state.mode === m ? "true" : "false", text: m === "network" ? "Network" : "Sequence" });
        b.addEventListener("click", function () { if (state.mode === m) return; state.mode = m; persist(); seg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); buildStage(); refresh(); });
        seg.appendChild(b);
      });
      ui.stageRight = el("div", { class: "nthview-df-stageright" }, [seg]);
      stagewrap.appendChild(el("div", { class: "nthview-df-stagebar" }, [ui.cap, ui.stageRight]));
      ui.stage = el("div", { class: "nthview-df-stage", tabindex: "0", role: "group", "aria-label": "Diagram. Use the arrow keys to move between messages and space to play." });
      stagewrap.appendChild(ui.stage);
      if (R.hasHolds) { ui.holds = el("div", { class: "nthview-df-holds", "aria-label": "What each entity holds now" }); stagewrap.appendChild(ui.holds); }
      c.appendChild(stagewrap);
      /* flow */
      var flow = el("div", { class: "nthview-df-flow" });
      var fh = el("div", { class: "nthview-df-fh" }, [el("h2", { text: "Message flow" }), el("span", { class: "nthview-df-count", text: R.msgCount + " message" + (R.msgCount === 1 ? "" : "s") + " · " + R.steps.length + " step" + (R.steps.length === 1 ? "" : "s") })]);
      ui.playBtn = el("button", { type: "button", class: "nthview-df-btn nthview-df-btn-primary", title: "Play / pause (space)" });
      ui.playBtn.addEventListener("click", function () { if (playing) stop(); else play(); });
      ui.backBtn = el("button", { type: "button", class: "nthview-df-btn", title: "Previous message (←)" }, [icon("back"), doc.createTextNode("Back")]);
      ui.backBtn.addEventListener("click", function () { stop(); if (state.pos > 0) setPos(state.pos - 1); });
      ui.stepBtn = el("button", { type: "button", class: "nthview-df-btn", title: "Next message (→)" }, [doc.createTextNode("Step"), icon("step")]);
      ui.stepBtn.addEventListener("click", function () { stop(); stepForward(); });
      var reset = el("button", { type: "button", class: "nthview-df-btn", text: "Reset", title: "Back to the start of this topic" });
      reset.addEventListener("click", function () { stop(); setPos(0); });
      fh.appendChild(el("div", { class: "nthview-df-ctrl" }, [ui.playBtn, ui.backBtn, ui.stepBtn, reset]));
      flow.appendChild(fh);
      if (!R.beats.length || !R.msgCount) {
        flow.appendChild(el("p", { class: "nthview-df-empty", text: R.avail ? "This topic sends no messages in this version." : "This topic is not part of " + versionLabel(state.version) + "." }));
      } else {
        var info = R.beats.some(function (b) { return b.msg && b.msg.info; }), heads = ["#", "From", "To", "Message"].concat(info ? ["Info"] : []);
        var table = el("table", { class: "nthview-df-table" }, [el("caption", { class: "nthview-df-sr", text: "Messages of this topic, in order" }), el("thead", {}, [el("tr", {}, heads.map(function (h) { return el("th", { scope: "col", text: h }); }))])]);
        var tbody = el("tbody"); ui.rows = [];
        R.beats.forEach(function (b, i) {
          if (b.grp) {
            var gtr = el("tr", { tabindex: "0", class: "nthview-df-grprow", "aria-label": "Folded group " + b.grp.label + ", steps " + (b.grp.start + 1) + " to " + (b.grp.end + 1) }, [
              el("td", {}, [el("span", { class: "nthview-df-num nthview-df-num-grp", text: (b.grp.start + 1) + "–" + (b.grp.end + 1) })]),
              el("td", { colspan: info ? "3" : "2", text: "▸ " + b.grp.label }), el("td", { text: b.msgs.length + " message" + (b.msgs.length === 1 ? "" : "s") + ", folded" })]);
            gtr.addEventListener("click", function () { stop(); setPos(i); });
            gtr.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stop(); setPos(i); } });
            tbody.appendChild(gtr); ui.rows.push(gtr); return;
          }
          if (!b.msg) { ui.rows.push(null); return; }
          var m = b.msg;
          var nameTd = el("td", { class: "nthview-df-mono" }, [el("span", { class: isDeprecated(m) ? "nthview-df-dep" : "", text: m.name })]);
          (m.tags || []).forEach(function (t) { nameTd.appendChild(el("i", { class: "nthview-df-tag" + (t === "deprecated" ? "" : " nthview-df-tag-muted"), text: t })); });
          var tr = el("tr", { tabindex: "0", "aria-label": "Message " + b.n + ": " + m.name + ", " + M.E[m.from].name + " to " + M.E[m.to].name }, [
            el("td", {}, [el("span", { class: "nthview-df-dot nthview-df-k-" + kindOf(m) + hueClass(channelOf(M, m)), text: String(b.step + 1), title: "step " + (b.step + 1) + " · " + kindOf(m) + (channelOf(M, m) ? " · " + channelOf(M, m).name : "") })]),
            el("td", { text: M.E[m.from].name }), el("td", { text: M.E[m.to].name }), nameTd
          ]);
          if (info) tr.appendChild(el("td", { text: m.info || "" }));
          tr.addEventListener("click", function () { stop(); setPos(i); });
          tr.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); stop(); setPos(i); } });
          tbody.appendChild(tr); ui.rows.push(tr);
        });
        table.appendChild(tbody);
        ui.tablewrap = el("div", { class: "nthview-df-tablewrap" }, [table]);
        flow.appendChild(ui.tablewrap);
      }
      ui.nextWrap = el("div", { class: "nthview-df-nexttopic" }); flow.appendChild(ui.nextWrap);
      c.appendChild(flow);
      return c;
    }

    function article(t) {
      var a = t.article, wrap = el("div", { class: "nthview-df-article" });
      var h = el("h3", { text: t.title }); if (t.tag) h.appendChild(el("i", { class: "nthview-df-tag", text: t.tag }));
      wrap.appendChild(h);
      wrap.appendChild(el("p", { class: "nthview-df-sub", text: t.subtitle }));
      if (!R.avail) {
        var vl = versionLabel(state.version), rl = versionLabel(R.reason.version);
        wrap.appendChild(el("div", { class: "nthview-df-absentbox" }, [el("b", { text: "Not in " + vl + ". " }), doc.createTextNode(R.reason.kind === "arrives" ? t.title + " arrives in " + rl + "." : t.title + " was removed in " + rl + ".")]));
      }
      a.body.forEach(function (p) { wrap.appendChild(para(null, p)); });
      if (a.references && a.references.length) {
        var refs = el("div", { class: "nthview-df-refs" }, [el("span", { text: a.referencesLabel || "References" })]);
        a.references.forEach(function (r) { refs.appendChild(el("a", { href: r.url, target: "_blank", rel: "noopener", text: r.label })); });
        wrap.appendChild(refs);
      }
      (a.versionNotes || []).forEach(function (n) {
        var v = M.V[M.VI[n.version]], cur = n.version === state.version;
        var h4 = el("h4", { text: n.heading || ("What changes in " + v.label) });
        if (cur) h4.appendChild(el("i", { class: "nthview-df-tag", text: "current" }));
        var ul = el("ul"); n.items.forEach(function (it) { var li = el("li"); li.appendChild(rich(it)); ul.appendChild(li); });
        wrap.appendChild(el("div", { class: "nthview-df-vnote" }, [h4, ul]));
      });
      (a.boxes || []).forEach(function (b) {
        var ul = el("ul");
        b.items.forEach(function (it) {
          var li = el("li");
          if (it.url) { var link = el("a", { href: it.url, target: "_blank", rel: "noopener" }); link.appendChild(rich(it.text)); li.appendChild(link); } else li.appendChild(rich(it.text));
          if (it.tag) li.appendChild(el("span", { class: "nthview-df-tagtext", text: it.tag }));
          ul.appendChild(li);
        });
        wrap.appendChild(el("div", { class: "nthview-df-box" + (b.tone === "attention" ? " nthview-df-box-attention" : "") }, [el("h4", { text: b.title }), ul]));
      });
      return wrap;
    }

    function rightPanel() {
      var r = el("aside", { class: "nthview-df-right", "data-panel": M.single ? "solo" : state.panel, "aria-label": M.single ? "Message" : "Article and message" });
      if (M.single) {
        ui.msg = el("div", { class: "nthview-df-msg" }); r.appendChild(ui.msg);
        if (data.footer) r.appendChild(para("nthview-df-footer", data.footer));
        return r;
      }
      var seg = el("div", { class: "nthview-df-seg", role: "group", "aria-label": "Panel" });
      ["message", "article"].forEach(function (p) {
        var b = el("button", { type: "button", "aria-pressed": state.panel === p ? "true" : "false", text: p === "article" ? "Article" : "Message" });
        b.addEventListener("click", function () { state.panel = p; r.setAttribute("data-panel", p); persist(); seg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x === b ? "true" : "false"); }); });
        seg.appendChild(b);
      });
      r.appendChild(el("div", { class: "nthview-df-rtabs" }, [seg]));
      ui.msg = el("div", { class: "nthview-df-msg" }); r.appendChild(ui.msg);
      r.appendChild(article(M.TI[state.topic]));
      if (data.footer) r.appendChild(para("nthview-df-footer", data.footer));
      return r;
    }

    function lesson() {
      ui.side = sidebar(); ui.side.id = "nthview-df-side";
      ui.backdrop = el("div", { class: "nthview-df-backdrop" });
      ui.backdrop.addEventListener("click", function () { toggleDrawer(false); });
      ui.lesson = el("div", { class: "nthview-df-lesson" }, [ui.side, ui.backdrop, center(), rightPanel()]);
      return ui.lesson;
    }
    function toggleDrawer(open) {
      if (!ui.side) return;
      ui.side.classList.toggle("nthview-df-open", open); ui.backdrop.classList.toggle("nthview-df-open", open);
      if (ui.topicsBtn) ui.topicsBtn.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) { var f = ui.side.querySelector(".nthview-df-topic-open .nthview-df-th"); if (f) f.focus(); }
    }

    /* ---------- stage: build the diagram for the current mode ---------- */
    function buildStage() {
      if (!ui.stage) return;
      cancelAnim();
      ui.stage.innerHTML = ""; ui.net = null; ui.seq = null;
      ui.stage.classList.toggle("nthview-df-absent", !R.avail);
      narrowStage = ui.stage.clientWidth > 0 && ui.stage.clientWidth < 560;
      if (!R.avail) {
        var all = buildNetwork(data.entities.map(function (e) { return e.id; }), narrowStage, null);
        ui.stage.appendChild(all.svg);
        ui.stage.appendChild(el("div", { class: "nthview-df-absentmsg", text: "Not in " + versionLabel(state.version) }));
        ui.stage.style.cssText = "";
        return;
      }
      if (state.mode === "network") { ui.net = buildNetwork(R.entities, narrowStage, R); ui.net.svg.classList.add("nthview-df-dim"); ui.stage.appendChild(ui.net.svg); ui.stage.style.cssText = ""; }
      else {
        var w = ui.stage.clientWidth || 900, h = ui.stage.clientHeight || 0;
        ui.seq = buildSequence([{ Rt: R, title: null, topicId: state.topic }], R.entities, Math.max(320, w - 2), h > 200 ? h - 2 : 0, { refs: true, onRef: openInner });
        ui.stage.appendChild(ui.seq.svg);
        ui.stage.style.cssText = "overflow:auto;display:block";
      }
      var old = ui.stageRight.querySelector(".nthview-df-legend");
      if (old) ui.stageRight.removeChild(old);
      var legend = channelLegend();
      if (legend) ui.stageRight.appendChild(legend);
    }
    /* the channels this topic's messages and links use, as a small legend in the stage corner */
    function channelLegend() {
      var used = {}, order = [];
      R.beats.forEach(function (b) { var ch = b.msg && channelOf(M, b.msg); if (ch && !used[ch.id]) { used[ch.id] = true; order.push(ch); } });
      (data.links || []).forEach(function (l) { var ch = l.channel && M.C[l.channel]; if (ch && !used[ch.id] && R.entities.indexOf(l.from) !== -1 && R.entities.indexOf(l.to) !== -1) { used[ch.id] = true; order.push(ch); } });
      if (!order.length) return null;
      var lg = el("div", { class: "nthview-df-legend", "aria-label": "Channels" });
      order.forEach(function (ch) { lg.appendChild(el("span", { class: "nthview-df-ch-" + ch.color, title: ch.description || "" }, [el("i"), doc.createTextNode(ch.name)])); });
      return lg;
    }
    /* the holdings strip: after the current message, what every entity involved holds; new items marked, removed ones struck */
    function renderHolds(b, gated) {
      if (!ui.holds) return;
      ui.holds.innerHTML = "";
      var state_ = b ? (gated ? b.before : b.after) : null, added = b && !gated ? b.added : {}, removed = b && !gated ? b.removed : {};
      if (!state_) { ui.holds.style.display = "none"; return; }
      var any = false, tg = el("button", { type: "button", class: "nthview-df-holdtog", "aria-pressed": state.changed ? "true" : "false", text: "Changes only", title: "Show only the entities whose holdings change here" });
      tg.addEventListener("click", function () { state.changed = !state.changed; persist(); renderHolds(b, gated); ui.holds.firstChild.focus(); });
      ui.holds.appendChild(tg);
      R.entities.forEach(function (id) {
        var items = state_[id] || [], gone = removed[id] || [];
        if (!items.length && !gone.length) return;
        if (state.changed && !gone.length && !(added[id] || []).length) return;
        any = true;
        var g = el("div", { class: "nthview-df-hold" }, [el("b", { text: M.E[id].name })]);
        items.forEach(function (it) { g.appendChild(el("span", { class: "nthview-df-chip" + ((added[id] || []).indexOf(it) !== -1 ? " nthview-df-chip-new" : ""), text: it, title: (added[id] || []).indexOf(it) !== -1 ? "new at this message" : "" })); });
        gone.forEach(function (it) { g.appendChild(el("span", { class: "nthview-df-chip nthview-df-chip-gone", text: it, title: "given up at this message" })); });
        ui.holds.appendChild(g);
      });
      if (!any && state.changed) { ui.holds.appendChild(el("span", { class: "nthview-df-hold-none", text: "Nothing changes hands here" })); any = true; }
      ui.holds.style.display = any ? "" : "none";
    }

    /* ---------- refresh everything that depends on the position ---------- */
    function refresh() {
      if (!ui.cap) return;
      var b = R.beats[state.pos], st = b ? R.steps[b.step] : null, gated = b ? isGated(state.pos) : false;
      /* caption */
      ui.cap.innerHTML = "";
      if (!reduceMotion && ui.fadeNext) { ui.cap.classList.remove("nthview-df-fadein"); void ui.cap.offsetWidth; ui.cap.classList.add("nthview-df-fadein"); }
      ui.fadeNext = false;
      var fxLayer = ui.net ? ui.net.fx : ui.seq ? ui.seq.fx : null;
      if (fxLayer) Array.prototype.slice.call(fxLayer.childNodes).forEach(function (nd) { if (nd.getAttribute("data-i") !== String(state.pos)) fxLayer.removeChild(nd); });
      var inside = R.crumbs.length ? "Inside step " + (R.crumbs[R.crumbs.length - 1].idx + 1) + " · " : "";
      if (b && b.grp) {
        ui.cap.appendChild(el("p", { class: "nthview-df-eyebrow", text: inside + "Steps " + (b.grp.start + 1) + "–" + (b.grp.end + 1) + " of " + R.steps.length + " · folded group" }));
        ui.cap.appendChild(el("h2", { text: b.grp.label }));
        if (b.grp.summary) ui.cap.appendChild(para("nthview-df-expl", b.grp.summary));
        var ex = el("button", { type: "button", class: "nthview-df-btn", text: "Expand the " + (b.grp.end - b.grp.start + 1) + " steps" });
        ex.addEventListener("click", function () { setGroup(b.grp, true); });
        ui.cap.appendChild(el("div", { class: "nthview-df-capact" }, [ex]));
      } else if (!st) {
        ui.cap.appendChild(el("p", { class: "nthview-df-eyebrow", text: R.avail ? "No steps" : "Not in " + versionLabel(state.version) }));
        ui.cap.appendChild(el("h2", { text: M.TI[state.topic].title }));
        ui.cap.appendChild(para("nthview-df-expl", R.avail ? "" : (R.reason.kind === "arrives" ? "This topic arrives in " + versionLabel(R.reason.version) + ". Switch the version to see it." : "This topic was removed in " + versionLabel(R.reason.version) + ". Switch to an earlier version to see it.")));
      } else {
        var eyebrow = el("p", { class: "nthview-df-eyebrow", text: inside + "Step " + (st.idx + 1) + " of " + R.steps.length });
        if (st.check && !gated) {
          var a = state.checks[checkKey(st.idx)], verdict = ["Predicted wrong", "Prediction skipped", "Predicted right"][verdictOf(st.check, a) + 1];
          var review = el("button", { type: "button", class: "nthview-df-review", text: verdict + " · review" });
          review.addEventListener("click", function () { openQuiz(st); });
          eyebrow.appendChild(doc.createTextNode(" · ")); eyebrow.appendChild(review);
        }
        ui.cap.appendChild(eyebrow);
        var h2 = el("h2", { text: st.title }); if (st.tag) h2.appendChild(el("i", { class: "nthview-df-tag", text: st.tag })); ui.cap.appendChild(h2);
        if (gated) {
          var waiting = el("p", { class: "nthview-df-expl nthview-df-waiting" }, [doc.createTextNode("Predict first: answer the question in the side panel, or skip it, to reveal this step. ")]);
          var reopen = el("button", { type: "button", class: "nthview-df-review", text: "Open the question" });
          reopen.addEventListener("click", function () { openQuiz(st); });
          waiting.appendChild(reopen); ui.cap.appendChild(waiting);
          openQuiz(st);
        } else {
          ui.cap.appendChild(para("nthview-df-expl", st.explanation));
          capExtras(st);
          if (ui.quiz && ui.quiz.classList.contains("nthview-df-open") && ui.quizStep !== st.idx) closeQuiz();
        }
      }
      /* table rows */
      (ui.rows || []).forEach(function (tr, i) {
        if (!tr) return;
        tr.classList.toggle("nthview-df-cur", i === state.pos && !gated);
        tr.classList.toggle("nthview-df-fut", i > state.pos || (i === state.pos && gated));
        if (i === state.pos && !gated) {
          tr.setAttribute("aria-current", "true");
          if (ui.tablewrap) { var top = tr.offsetTop - ui.tablewrap.offsetTop, vh = ui.tablewrap.clientHeight; if (top < ui.tablewrap.scrollTop + 32 || top + tr.offsetHeight > ui.tablewrap.scrollTop + vh - 8) ui.tablewrap.scrollTop = Math.max(0, top - vh / 2 + 40); }
        } else tr.removeAttribute("aria-current");
      });
      /* diagram highlight */
      var on = {}, onEdge = {};
      if (b && b.grp) b.msgs.forEach(function (m) { on[m.from] = true; on[m.to] = true; });
      else if (st && !gated) {
        st.focus.forEach(function (id) { on[id] = true; });
        st.messages.forEach(function (m) { on[m.from] = true; on[m.to] = true; });
        if (b.msg && b.msg.from !== b.msg.to) onEdge[pairKey(b.msg.from, b.msg.to)] = true;
      }
      if (ui.net) {
        Object.keys(ui.net.nodes).forEach(function (id) { ui.net.nodes[id].g.classList.toggle("nthview-df-on", !!on[id]); });
        Object.keys(ui.net.edges).forEach(function (k) { var e = ui.net.edges[k]; e.line.classList.toggle("nthview-df-on", !!onEdge[k]); if (e.pill) e.pill.classList.toggle("nthview-df-on", !!onEdge[k]); });
      }
      if (ui.seq) {
        var sy = ui.seq.TOP + state.pos * ui.seq.ROW, stg = ui.stage;
        if (sy < stg.scrollTop + 60 || sy > stg.scrollTop + stg.clientHeight - 30) stg.scrollTop = Math.max(0, sy - stg.clientHeight / 2);
        ui.seq.arrows.forEach(function (g, i) { if (!g) return; g.classList.toggle("nthview-df-cur", i === state.pos && !gated); g.classList.toggle("nthview-df-fut", i > state.pos || (i === state.pos && gated)); });
        Object.keys(ui.seq.heads).forEach(function (id) { ui.seq.heads[id].classList.toggle("nthview-df-on", !!on[id]); });
      }
      /* sidebar current step */
      if (ui.stepList) ui.stepList.querySelectorAll("li[data-s]").forEach(function (li) { var sb = li.firstChild; if (st && +li.getAttribute("data-s") === (b.grp ? b.grp.start : st.idx)) sb.setAttribute("aria-current", "step"); else sb.removeAttribute("aria-current"); });
      /* holdings and message panel */
      renderHolds(b, gated);
      renderMessage(b, gated);
      /* controls */
      var last = !R.beats.length || state.pos >= R.beats.length - 1;
      ui.backBtn.disabled = state.pos <= 0; ui.stepBtn.disabled = last || gated; ui.playBtn.disabled = !R.beats.length || (last && !playing && R.beats.length < 2);
      updatePlayBtn();
      ui.nextWrap.innerHTML = "";
      var ti = topicIndex(state.topic), lastTopic = ti === M.topics.length - 1;
      if (last && R.crumbs.length && !gated) {
        var pc = R.crumbs[R.crumbs.length - 1], ob = el("button", { type: "button", class: "nthview-df-btn" }, [doc.createTextNode("Back out and continue after step " + (pc.idx + 1) + " ↑")]);
        ob.addEventListener("click", function () { backOut(R.crumbs.length - 1, true); });
        ui.nextWrap.appendChild(ob);
      } else if (last && R.avail && !gated && lastTopic) {
        /* the end is the last step of the last topic, where the view offers no "Next topic" (§5.5 rule 8) */
        if (!state.done) { state.done = true; persist(); }
        ui.nextWrap.appendChild(recap());
      }
      if ((last || !R.avail) && !gated && !lastTopic && !R.crumbs.length) {
        var nt = M.topics[ti + 1], nb = el("button", { type: "button", class: "nthview-df-btn" }, [doc.createTextNode("Next topic: " + nt.title + " →")]);
        nb.addEventListener("click", function () { openTopic(nt.id, false); });
        ui.nextWrap.appendChild(nb);
      }
      /* live status */
      if (b && b.grp) ui.status.textContent = "Steps " + (b.grp.start + 1) + " to " + (b.grp.end + 1) + ", folded: " + b.grp.label;
      else if (st) ui.status.textContent = inside + "Step " + (st.idx + 1) + " of " + R.steps.length + ": " + st.title + (b.msg && !gated ? ". Message " + b.n + " of " + R.msgCount + ": " + b.msg.name + " from " + M.E[b.msg.from].name + " to " + M.E[b.msg.to].name : gated ? ". Answer the question to reveal this step." : "");
    }
    /* under the explanation: the note, the comparison, the way into an inner sequence or out of a group */
    function capExtras(st) {
      if (st.note) {
        var n = el("p", { class: "nthview-df-callout nthview-df-sev-" + st.note.severity }, [el("b", { text: { info: "Note: ", warning: "Watch out: ", danger: "Critical: " }[st.note.severity] })]);
        n.appendChild(rich(st.note.text)); ui.cap.appendChild(n);
      }
      if (state.compare && st.compare) {
        var c = el("p", { class: "nthview-df-callout nthview-df-cmp" }, [el("b", { text: st.compare.label + ": " })]);
        c.appendChild(rich(st.compare.text)); ui.cap.appendChild(c);
      }
      var act = el("div", { class: "nthview-df-capact" });
      if (st.inner) {
        var ob = el("button", { type: "button", class: "nthview-df-btn" }, [doc.createTextNode("Open the inner sequence · " + st.inner.steps.length + " steps →")]);
        ob.addEventListener("click", function () { openInner(st.idx); });
        act.appendChild(ob);
      }
      var g = null;
      R.fragments.forEach(function (f) { if (f.kind === "group" && st.idx >= f.start && st.idx <= f.end) g = f; });
      if (g) { var fb = el("button", { type: "button", class: "nthview-df-review", text: "Fold “" + g.label + "”" }); fb.addEventListener("click", function () { setGroup(g, false); }); act.appendChild(fb); }
      if (R.steps.some(function (x) { return x.compare; })) {
        var cb = el("input", { type: "checkbox" });
        cb.checked = state.compare;
        cb.addEventListener("change", function () { state.compare = cb.checked; persist(); ui.refocus = true; refresh(); });
        act.appendChild(el("label", {}, [cb, doc.createTextNode(data.compareLabel || "Show the comparison")]));
        if (ui.refocus) { ui.refocus = false; cb.focus(); }
      }
      if (act.childNodes.length) ui.cap.appendChild(act);
    }
    /* the end of the whole flow: how the predictions went, and the closing words */
    function recap() {
      var t = { 1: 0, "-1": 0, 0: 0 }, total = 0;
      function walk(seq, prefix) {
        seq.steps.forEach(function (st, i) {
          if (st.check) { total++; var a = state.checks[prefix + i]; if (a !== undefined) t[verdictOf(st.check, a)]++; }
          if (st.inner) walk(st.inner, prefix + i + ".");
        });
      }
      M.topics.forEach(function (tp) { walk(tp, tp.id + "/"); });
      var box = el("div", { class: "nthview-df-recap", role: "status" }, [el("h3", { text: "You reached the end" })]);
      var seen = t[1] + t[-1] + t[0];
      if (total) box.appendChild(el("p", { text: "Predictions: " + t[1] + " right, " + t[-1] + " wrong, " + t[0] + " skipped" + (total > seen ? ", " + (total - seen) + " not reached" : "") + "." }));
      (data.closing || []).forEach(function (c) { box.appendChild(para(null, c)); });
      return box;
    }
    function openInner(idx) { stop(); state.path = state.path.concat([idx]); state.pos = 0; persist(); renderAll(); focusStage(); }
    /* back out to depth d; with advance, continue at the beat after the parent step */
    function backOut(d, advance) {
      stop();
      var idx = state.path[d];
      state.path = state.path.slice(0, d); resolve();
      var sb = R.stepBeats[idx];
      state.pos = sb ? Math.min(R.beats.length - 1, sb.last + (advance ? 1 : 0)) : 0;
      persist(); renderAll(); focusStage();
    }
    function setGroup(f, open) {
      stop();
      var k = R.key + "#" + R.fragments.indexOf(f);
      if (open === (f.collapsed === false)) delete state.groups[k]; else state.groups[k] = open;
      resolve();
      var sb = R.stepBeats[f.start]; state.pos = sb ? sb.first : 0;
      persist(); renderAll(); focusStage();
    }
    /* glossary: a pop-over by the term, and a dialog with every term */
    function showTerm(g, anchor) {
      hideTerm();
      var pop = el("div", { class: "nthview-df-pop", role: "dialog", "aria-label": g.term }, [el("b", { text: g.term })]);
      pop.appendChild(para(null, g.definition));
      (anchor.closest("dialog") || container).appendChild(pop);
      var r = anchor.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight, y = r.bottom + 6;
      if (y + h > root.innerHeight - 8) y = Math.max(8, r.top - h - 6);
      pop.style.left = f1(Math.max(12, Math.min(r.left, root.innerWidth - w - 12))) + "px"; pop.style.top = f1(y) + "px";
      ui.pop = pop;
    }
    function hideTerm() { if (ui.pop && ui.pop.parentNode) ui.pop.parentNode.removeChild(ui.pop); ui.pop = null; }
    function openGlossary() {
      hideTerm();
      var dlg = el("dialog", { class: "nthview-df-dialog nthview-df-dsmall", "aria-label": "Glossary" });
      var close = el("button", { type: "button", class: "nthview-df-btn", text: "Close" });
      close.addEventListener("click", function () { dlg.close(); });
      dlg.appendChild(el("div", { class: "nthview-df-dialog-head" }, [el("div", {}, [el("h2", { text: "Glossary" })]), close]));
      var dl = el("dl", { class: "nthview-df-gloss" });
      data.glossary.slice().sort(function (a, b) { return a.term.localeCompare(b.term); }).forEach(function (g) { dl.appendChild(el("dt", { text: g.term })); var dd = el("dd"); dd.appendChild(rich(g.definition)); dl.appendChild(dd); });
      dlg.appendChild(dl);
      dlg.addEventListener("close", function () { hideTerm(); if (dlg.parentNode) dlg.parentNode.removeChild(dlg); });
      container.appendChild(dlg);
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
    }
    function updatePlayBtn() {
      ui.playBtn.innerHTML = "";
      ui.playBtn.appendChild(icon(playing ? "pause" : "play"));
      ui.playBtn.appendChild(doc.createTextNode(playing ? "Pause" : "Play"));
      ui.playBtn.setAttribute("aria-pressed", playing ? "true" : "false");
    }

    function renderMessage(b, gated) {
      var box = ui.msg; box.innerHTML = "";
      box.appendChild(el("h2", { text: "Message" }));
      if (!b) { box.appendChild(el("p", { class: "nthview-df-empty", text: R.avail ? "Nothing to show." : "This topic is not part of " + versionLabel(state.version) + "." })); return; }
      if (gated) { box.appendChild(el("p", { class: "nthview-df-empty", text: "Answer the question above the diagram, or skip it, to reveal this step's messages." })); return; }
      if (b.grp) { box.appendChild(el("p", { class: "nthview-df-empty", text: "Folded: " + b.msgs.map(function (m) { return m.name; }).join(", ") + ". Expand the group to step through " + (b.msgs.length === 1 ? "it." : "them one by one.") })); return; }
      if (!b.msg) box.appendChild(el("p", { class: "nthview-df-empty", text: "This step sends no message." }));
      else messageBody(box, b);
      var st = R.steps[b.step];
      if (st.detail) {
        box.appendChild(el("h3", { class: "nthview-df-dh", text: "About this step" }));
        var dl = el("dl", { class: "nthview-df-notes nthview-df-detail" });
        st.detail.forEach(function (d) { dl.appendChild(el("dt", { text: d.label })); var dd = el("dd"); dd.appendChild(rich(d.text)); dl.appendChild(dd); });
        box.appendChild(dl);
      }
    }
    function messageBody(box, b) {
      var m = b.msg, k = kindOf(m);
      var ch = channelOf(M, m);
      var ih = el("div", { class: "nthview-df-ih" }, [el("span", { class: "nthview-df-dot nthview-df-k-" + k + hueClass(ch), "aria-hidden": "true" }), el("span", { class: "nthview-df-im" + (isDeprecated(m) ? " nthview-df-dep" : ""), text: m.name })]);
      (m.tags || []).forEach(function (t) { ih.appendChild(el("i", { class: "nthview-df-tag" + (t === "deprecated" ? "" : " nthview-df-tag-muted"), text: t })); });
      if (m.size) ih.appendChild(el("span", { class: "nthview-df-isz", text: m.size }));
      box.appendChild(ih);
      var kindName = { request: "Request", response: "Response", error: "Error", notification: "Notification", local: "Local", transport: "Transport" }[k];
      var ir = el("p", { class: "nthview-df-ir", text: M.E[m.from].name + (m.from === m.to ? " (local)" : " → " + M.E[m.to].name) + " · " + kindName + " · #" + b.n });
      if (ch) { ir.appendChild(doc.createTextNode(" · ")); ir.appendChild(el("i", { class: "nthview-df-ch-" + ch.color, "aria-hidden": "true" })); ir.appendChild(doc.createTextNode(ch.name)); }
      box.appendChild(ir);
      if (m.payload !== undefined) {
        var pre = el("pre", { class: "nthview-df-json", tabindex: "0", "aria-label": "Payload" });
        if (typeof m.payload === "string") pre.textContent = m.payload; else colourJson(pre, JSON.stringify(m.payload, null, 2));
        box.appendChild(pre);
      }
      if (m.info && !m.payload) box.appendChild(el("p", { class: "nthview-df-ir", text: m.info }));
      if (m.annotations && m.annotations.length) {
        var dl = el("dl", { class: "nthview-df-notes" });
        m.annotations.forEach(function (a) { dl.appendChild(el("dt", { text: a.field })); var dd = el("dd"); dd.appendChild(rich(a.text)); dl.appendChild(dd); });
        box.appendChild(dl);
      }
    }

    /* ---------- checks: a side panel that slides in over the navigation, so the stage never moves ---------- */
    function openQuiz(st) {
      if (!ui.lesson) return;
      if (!ui.quiz) {
        ui.quiz = el("aside", { class: "nthview-df-quiz", role: "dialog", "aria-label": "Prediction check", "aria-modal": "false" });
        ui.lesson.appendChild(ui.quiz);
      }
      ui.quizStep = st.idx;
      ui.quiz.innerHTML = "";
      var answered = state.checks[checkKey(st.idx)] !== undefined;
      var head = el("div", { class: "nthview-df-quiz-head" }, [el("span", { class: "nthview-df-eyebrow nthview-df-quiz-kicker", text: answered ? "Your prediction" : "Predict before you look" })]);
      if (answered) { var x = el("button", { type: "button", class: "nthview-df-quiz-close", "aria-label": "Close", text: "×" }); x.addEventListener("click", closeQuiz); head.appendChild(x); }
      ui.quiz.appendChild(head);
      ui.quiz.appendChild(el("p", { class: "nthview-df-quiz-step", text: (R.crumbs.length ? "Inside step " + (R.crumbs[R.crumbs.length - 1].idx + 1) + " · " : "") + "Step " + (st.idx + 1) + " · " + st.title }));
      ui.quiz.appendChild(checkCard(st));
      var wasOpen = ui.quiz.classList.contains("nthview-df-open");
      ui.quiz.classList.add("nthview-df-open");
      if (!wasOpen) { var first = ui.quiz.querySelector("button:not(.nthview-df-quiz-close)"); if (first) setTimeout(function () { try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); } }, reduceMotion ? 0 : 320); }
    }
    function closeQuiz() {
      if (!ui.quiz || !ui.quiz.classList.contains("nthview-df-open")) return;
      ui.quiz.classList.remove("nthview-df-open");
      if (ui.stage) { try { ui.stage.focus({ preventScroll: true }); } catch (e) { ui.stage.focus(); } }
    }
    /* A who check offers the parties on the diagram; a choice check its own options. */
    function checkCard(st) {
      var c = st.check, who = c.type === "who", answered = state.checks[checkKey(st.idx)], card = el("div", { class: "nthview-df-check", role: "group", "aria-label": "Prediction check" });
      var opts = who ? R.entities.map(function (id) { return { val: id, text: M.E[id].name, correct: id === c.answer, why: id === c.answer ? c.why || M.E[id].name + " sends it." : M.E[id].name + " does not send this one." }; })
        : c.options.map(function (o, i) { return { val: i, text: o.text, correct: !!o.correct, why: o.why }; });
      var mine = opts.filter(function (o) { return o.val === answered; })[0], right = opts.filter(function (o) { return o.correct; })[0];
      if (answered !== undefined) card.appendChild(el("p", { class: "nthview-df-verdict" + (mine && mine.correct ? " nthview-df-verdict-right" : ""), text: answered === -1 ? "Skipped" : (mine && mine.correct ? "Correct" : "Not quite") }));
      card.appendChild(para(null, c.prompt || "Who sends the next message?"));
      var ol = el("ul", { class: "nthview-df-opts" });
      opts.forEach(function (o, i) {
        var b = el("button", { type: "button" }, [el("span", { class: "nthview-df-ol", text: String.fromCharCode(65 + i) }), el("span", {}, [rich(o.text, true)])]);
        if (answered !== undefined) {
          b.disabled = true;
          if (o.correct) b.classList.add("nthview-df-right");
          else if (o === mine) b.classList.add("nthview-df-wrong");
        } else b.addEventListener("click", function () { answer(st, o.val); });
        ol.appendChild(el("li", {}, [b]));
      });
      card.appendChild(ol);
      if (mine) {
        var why = el("p", { class: "nthview-df-why" });
        why.appendChild(el("b", { text: mine.correct ? "Why: " : "Why not: " })); why.appendChild(rich(mine.why));
        if (!mine.correct && right) { why.appendChild(el("br")); why.appendChild(el("b", { text: "The answer: " })); why.appendChild(rich(right.text + ". " + right.why)); }
        card.appendChild(why);
      } else if (answered === undefined) {
        var skip = el("button", { type: "button", class: "nthview-df-skip", text: "Skip and show the step" });
        skip.addEventListener("click", function () { answer(st, -1); });
        card.appendChild(skip);
      }
      if (answered !== undefined) {
        var go = el("button", { type: "button", class: "nthview-df-btn nthview-df-btn-primary nthview-df-continue", text: "Continue" });
        go.addEventListener("click", closeQuiz);
        card.appendChild(go);
      }
      return card;
    }
    /* The step is revealed behind the panel as soon as the learner answers; Continue closes the panel. */
    function answer(st, i) {
      state.checks[checkKey(st.idx)] = i; persist();
      if (ui.stepList) { var num = ui.stepList.querySelector("li[data-s='" + st.idx + "'] .nthview-df-num"); if (num) num.classList.add("nthview-df-num-done"); }
      refresh();
      var b = R.beats[state.pos];
      if (b && b.msg && !reduceMotion) animateBeat(state.pos, function () {});
      openQuiz(st);
      var go = ui.quiz && ui.quiz.querySelector(".nthview-df-continue"); if (go) go.focus();
    }

    /* ---------- position, play, animation ---------- */
    function setPos(i) {
      if (!R.beats.length) { state.pos = 0; persist(); refresh(); return; }
      ui.fadeNext = state.pos !== Math.max(0, Math.min(i, R.beats.length - 1));
      state.pos = Math.max(0, Math.min(i, R.beats.length - 1)); persist(); refresh();
    }
    function stepForward() {
      var next = state.pos + 1;
      if (next >= R.beats.length || isGated(state.pos)) return;
      if (isGated(next) || reduceMotion || !R.beats[next].msg) { setPos(next); return; }
      animateBeat(next, function () { setPos(next); });
    }
    function play() {
      if (playing || !R.beats.length) return;
      playing = true; updatePlayBtn();
      if (root.innerWidth >= 1024) container.classList.add("nthview-df-focus");
      if (state.pos >= R.beats.length - 1 && !isGated(state.pos)) { state.pos = 0; refresh(); }
      if (state.pos === 0 && !isGated(0) && R.beats[0].msg) animateBeat(0, function () { refresh(); schedule(); }); else schedule();
    }
    function schedule() { if (!playing) return; timer = setTimeout(tick, reduceMotion ? 1100 : 800); }
    function tick() {
      if (!playing) return;
      var next = state.pos + 1;
      if (next >= R.beats.length || isGated(state.pos)) { stop(); return; }
      if (isGated(next)) { setPos(next); stop(); return; }
      if (reduceMotion || !R.beats[next].msg) { setPos(next); schedule(); return; }
      animateBeat(next, function () { setPos(next); schedule(); });
    }
    function stop() {
      playing = false; if (timer) { clearTimeout(timer); timer = null; }
      cancelAnim(); container.classList.remove("nthview-df-focus");
      if (ui.playBtn) updatePlayBtn();
    }
    function cancelAnim() { if (anim) { if (anim.raf) root.cancelAnimationFrame(anim.raf); if (anim.g && anim.g.parentNode) anim.g.parentNode.removeChild(anim.g); anim = null; } }
    /* A labelled packet carries the message name along the link (network) or the arrow (sequence),
       drawing a trail behind it; it stays at the receiver until the position changes. */
    function animateBeat(i, done) {
      cancelAnim();
      var m = R.beats[i].msg;
      if (!m || reduceMotion) { done(); return; }
      var DUR = 820, start = null, from, to, fx, k = kindOf(m);
      if (ui.net && ui.net.nodes[m.from] && ui.net.nodes[m.to]) {
        var a = ui.net.nodes[m.from], c = ui.net.nodes[m.to]; fx = ui.net.fx;
        from = { x: a.x, y: a.y }; to = m.from === m.to ? { x: a.x, y: a.y - 70 } : { x: c.x, y: c.y };
      } else if (ui.seq) {
        var y = ui.seq.TOP + i * ui.seq.ROW; fx = ui.seq.fx;
        from = { x: ui.seq.X[m.from], y: y }; to = m.from === m.to ? { x: ui.seq.X[m.from] + 44, y: y } : { x: ui.seq.X[m.to], y: y };
      } else { done(); return; }
      var label = m.name.length > 28 ? m.name.slice(0, 27) + "…" : m.name, w = Math.max(60, label.length * 8.2 + 32);
      var g = svgEl("g", { class: "nthview-df-pkt nthview-df-k-" + k + (isDeprecated(m) ? " nthview-df-dep" : "") + hueClass(channelOf(M, m)), "data-i": String(i) });
      var trail = svgEl("line", { class: "nthview-df-trail", x1: f1(from.x), y1: f1(from.y), x2: f1(from.y === to.y && from.x === to.x ? from.x : from.x), y2: f1(from.y) });
      var head = svgEl("polygon", { class: "nthview-df-trailhead", points: "0,0 0,0 0,0" });
      var pill = svgEl("g", { transform: "translate(" + f1(from.x) + "," + f1(from.y) + ")" }, [
        svgEl("rect", { class: "nthview-df-pb", x: f1(-w / 2), y: -15, width: f1(w), height: 30, rx: 15 }),
        svgEl("circle", { class: "nthview-df-pd", cx: f1(-w / 2 + 15), cy: 0, r: 4.5 }),
        svgEl("text", { class: "nthview-df-pt", x: f1(-w / 2 + 27), y: 4.5, text: label })
      ]);
      if (isDeprecated(m)) pill.appendChild(svgEl("text", { class: "nthview-df-pdep", x: 0, y: -22, "text-anchor": "middle", text: "DEPRECATED" }));
      g.appendChild(trail); g.appendChild(head); g.appendChild(pill);
      fx.appendChild(g);
      anim = { g: g, raf: 0 };
      var dxTot = to.x - from.x, dyTot = to.y - from.y, len = Math.sqrt(dxTot * dxTot + dyTot * dyTot) || 1, ux = dxTot / len, uy = dyTot / len;
      function frame(ts) {
        if (!start) start = ts;
        var t = Math.min(1, (ts - start) / DUR), e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        var x = from.x + dxTot * e, yy = from.y + dyTot * e;
        pill.setAttribute("transform", "translate(" + f1(x) + "," + f1(yy) + ")");
        trail.setAttribute("x2", f1(x)); trail.setAttribute("y2", f1(yy));
        var hx = x - ux * (w / 2 + 2), hy = yy - uy * (w / 2 + 2);
        head.setAttribute("points", pts([[hx, hy], [hx - ux * 10 - uy * 5, hy - uy * 10 + ux * 5], [hx - ux * 10 + uy * 5, hy - uy * 10 - ux * 5]]));
        if (t < 1) anim.raf = root.requestAnimationFrame(frame);
        else { g.classList.add("nthview-df-arrived"); anim = null; done(); }
      }
      anim.raf = root.requestAnimationFrame(frame);
    }

    /* ---------- the full picture: every entity, or every message of every topic, in one dialog ---------- */
    var fullMode = "network";
    function openFullPicture() {
      stop();
      if (ui.dialog) { if (ui.dialog.parentNode) ui.dialog.parentNode.removeChild(ui.dialog); ui.dialog = null; }
      var expand = false, zoom = 1, all, msgs;
      function blocks() {
        all = M.topics.map(function (t) {
          var Rt = resolveTopic(M, data, t, state.version, [], isOpen);
          return { Rt: expand && Rt.avail ? flatten(M, data, Rt, state.version, []) : Rt, title: M.single ? null : t.title, topicId: t.id };
        }).filter(function (b) { return b.Rt.avail && b.Rt.beats.length; });
        msgs = all.reduce(function (sum, b) { return sum + b.Rt.msgCount; }, 0);
      }
      blocks();
      var tools = el("div", { class: "nthview-df-zoom" }), xb = el("button", { type: "button", class: "nthview-df-btn", text: "Expand all", "aria-pressed": "false", title: "Draw every inner sequence in place and open every group" });
      xb.addEventListener("click", function () { expand = !expand; xb.setAttribute("aria-pressed", expand ? "true" : "false"); blocks(); draw(); });
      tools.appendChild(xb);
      [["−", 1 / 1.25, "Zoom out"], ["+", 1.25, "Zoom in"], ["Fit", 0, "Fit the width"]].forEach(function (z) {
        var b = el("button", { type: "button", class: "nthview-df-btn", text: z[0], "aria-label": z[2] });
        b.addEventListener("click", function () { zoom = z[1] ? Math.max(0.4, Math.min(3, zoom * z[1])) : 1; draw(); });
        tools.appendChild(b);
      });
      var dlg = el("dialog", { class: "nthview-df-dialog", "aria-label": "The full picture" });
      var seg = el("div", { class: "nthview-df-seg", role: "group", "aria-label": "Diagram" });
      var body = el("div", { class: "nthview-df-dialog-body" });
      function draw() {
        body.innerHTML = "";
        count.textContent = data.entities.length + " entities · " + (M.single ? "" : all.length + " topics · ") + msgs + " messages" + (M.hasTM ? " · " + versionLabel(state.version) : "") + ". In the sequence, click a message to open it in the lesson.";
        tools.style.display = fullMode === "sequence" ? "" : "none";
        seg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", x.getAttribute("data-mode") === fullMode ? "true" : "false"); });
        if (fullMode === "network") {
          var net = buildNetwork(data.entities.map(function (e) { return e.id; }), body.clientWidth > 0 && body.clientWidth < 560, null);
          all.forEach(function (b) { b.Rt.beats.forEach(function (bt) { if (bt.msg) net.addEdge(bt.msg.from, bt.msg.to, null); }); });
          body.style.overflow = "hidden"; body.appendChild(net.svg);
        } else {
          var used = {};
          all.forEach(function (b) { b.Rt.entities.forEach(function (id) { used[id] = true; }); });
          var ids = data.entities.map(function (e) { return e.id; }).filter(function (id) { return used[id]; });
          var seq = buildSequence(all, ids, Math.max(320, body.clientWidth - 2), 0, { refs: !expand, onPick: function (blk, i) { dlg.close(); goTo(blk.topicId, blk.Rt.beats[i]); },
            onRef: function () { expand = true; xb.setAttribute("aria-pressed", "true"); blocks(); draw(); } });
          var vb = seq.svg.getAttribute("viewBox").split(" ");
          seq.svg.style.width = f1(vb[2] * zoom) + "px"; seq.svg.style.height = f1(vb[3] * zoom) + "px";
          body.style.overflow = "auto"; body.appendChild(seq.svg);
        }
      }
      [["network", "Network"], ["sequence", "Sequence"]].forEach(function (m) {
        var b = el("button", { type: "button", "data-mode": m[0], text: m[1] });
        b.addEventListener("click", function () { fullMode = m[0]; draw(); });
        seg.appendChild(b);
      });
      var close = el("button", { type: "button", class: "nthview-df-btn", text: "Close", "aria-label": "Close the full picture" });
      close.addEventListener("click", function () { dlg.close(); });
      var count = el("p", { class: "nthview-df-muted" });
      dlg.appendChild(el("div", { class: "nthview-df-dialog-head" }, [
        el("div", {}, [el("h2", { text: "The full picture" }), count]),
        seg, tools, close
      ]));
      dlg.appendChild(body);
      dlg.addEventListener("close", function () { if (dlg.parentNode) dlg.parentNode.removeChild(dlg); ui.dialog = null; });
      container.appendChild(dlg); ui.dialog = dlg;
      if (typeof dlg.showModal === "function") dlg.showModal(); else dlg.setAttribute("open", "");
      draw();
    }

    /* ---------- navigation ---------- */
    function setScreen(s) {
      stop(); state.screen = s; persist(); renderAll();
    }
    /* open a beat picked on the full picture: its topic, its level, and the beat that shows it */
    function goTo(tid, b) {
      stop(); state.topic = tid; state.screen = "lesson"; state.path = (b.path || []).slice(); state.pos = 0; resolve();
      var target = b.orig !== undefined ? b.orig : b.step, at = 0;
      for (var k = R.beats.length - 1; k >= 0; k--) {
        var x = R.beats[k];
        if (b.msg ? x.msg === b.msg || (x.grp && x.msgs.indexOf(b.msg) !== -1) : (x.grp ? target >= x.grp.start && target <= x.grp.end : x.step === target)) at = k;
      }
      state.pos = at; persist(); renderAll(); focusStage();
    }
    function openTopic(id, fromHero) {
      stop(); state.topic = id; state.screen = "lesson"; state.path = []; state.pos = 0; persist(); renderAll();
      if (!ui.stage) return;
      if (!fromHero && root.innerWidth < 1024) ui.stage.scrollIntoView({ block: "start", behavior: reduceMotion ? "auto" : "smooth" });
      try { ui.stage.focus({ preventScroll: true }); } catch (e) { ui.stage.focus(); }
    }
    function setVersion(id) {
      if (id === state.version) return;
      stop(); state.version = id; persist(); renderAll();
      var pressed = container.querySelector(".nthview-df-tml [aria-pressed=true]");
      if (pressed && root.innerWidth >= 1024) pressed.focus();
    }
    function renderAll() {
      cancelAnim();
      resolve();
      var sideScroll = ui.side ? ui.side.scrollTop : 0;
      container.innerHTML = "";
      ui = {};
      container.appendChild(topBar());
      if (state.screen === "intro" && !M.single) { container.appendChild(hero()); drawPreview(); }
      else { container.appendChild(lesson()); buildStage(); refresh(); if (ui.side) ui.side.scrollTop = sideScroll; }
    }

    /* ---------- keyboard and resize ---------- */
    container.addEventListener("click", function (e) { if (live() && ui.pop && !ui.pop.contains(e.target)) hideTerm(); });
    container.addEventListener("keydown", function (e) {
      if (!live()) return;
      if (e.key === "Escape" && ui.pop) { hideTerm(); return; }
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      if (e.key === "Escape" && ui.side && ui.side.classList.contains("nthview-df-open")) { toggleDrawer(false); return; }
      if (e.key === "Escape" && ui.quiz && ui.quiz.classList.contains("nthview-df-open") && ui.quizStep !== undefined && state.checks[checkKey(ui.quizStep)] !== undefined) { closeQuiz(); return; }
      if (state.screen !== "lesson") return;
      if (e.key === " " && tag !== "button" && tag !== "a" && tag !== "tr") { e.preventDefault(); if (playing) stop(); else play(); }
      else if (e.key === "ArrowRight") { e.preventDefault(); stop(); stepForward(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); stop(); if (state.pos > 0) setPos(state.pos - 1); }
    });
    var resizeTimer = null;
    function onResize() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (!live()) return;
        if (state.screen === "intro") { drawPreview(); return; }
        if (!ui.stage || playing) return;
        var narrow = ui.stage.clientWidth > 0 && ui.stage.clientWidth < 560;
        if (narrow !== narrowStage || state.mode === "sequence") { buildStage(); refresh(); }
      }, 120);
    }
    root.addEventListener("resize", onResize);
    if (root.ResizeObserver) { var ro = new root.ResizeObserver(onResize); ro.observe(container); }
    doc.addEventListener("visibilitychange", function () { if (doc.hidden && live()) { stop(); persist(); } });
    root.addEventListener("pagehide", function () { persist(); });

    renderAll();
  }

  NthView.build = function (container, data) {
    if (!container || typeof container.appendChild !== "function") {
      throw new TypeError("NthView.build: container must be a DOM element");
    }
    container.innerHTML = "";
    container.classList.add("nthview", "nthview-dataflow");
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
