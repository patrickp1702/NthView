#!/usr/bin/env node
/* NthView — lesson builder
 *
 * A lesson is a folder lessons/<slug>/ holding lesson.json and chapters/.
 * Each chapter is one view output (one view per chapter, never two) whose
 * JSON sits next to the HTML it produces. This tool validates lesson.json,
 * validates and assembles every chapter with its view, injects the lesson
 * bar (previous / contents / next) into each chapter page, writes the
 * lesson's contents page, and regenerates the gallery registry.
 *
 * Usage:
 *   node scripts/build-lesson.js lessons/<slug>          # build one lesson
 *   node scripts/build-lesson.js --all                    # build every lesson
 *
 * Exit codes: 0 ok, 1 invalid manifest or chapter data, 2 usage error.
 */
"use strict";
var fs = require("fs");
var path = require("path");
var cp = require("child_process");
var buildHtml = require("./build-html.js");

var ROOT = path.resolve(__dirname, "..");
var SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
var FILE = /^\d{2}-[a-z0-9]+(-[a-z0-9]+)*$/;

function fail(msg) { console.error("error    " + msg); }

/* ---------- manifest validation ---------- */
function validateManifest(m, lessonDir) {
  var errors = [];
  var e = function (p, msg) { errors.push(p + ": " + msg); };
  if (!m || typeof m !== "object" || Array.isArray(m)) { e("$", "lesson.json must be an object"); return errors; }
  if (m.schemaVersion !== 1) e("schemaVersion", "expected 1, got " + JSON.stringify(m.schemaVersion));
  if (typeof m.title !== "string" || !m.title.trim() || m.title.length > 80) e("title", "must be a string of 1–80 characters");
  if (typeof m.description !== "string" || !m.description.trim() || m.description.length > 400) e("description", "must be a string of 1–400 characters");
  if (m.audience !== undefined && (typeof m.audience !== "string" || m.audience.length > 200)) e("audience", "must be a string of at most 200 characters");
  if (m.next !== undefined) {
    if (typeof m.next !== "string" || !SLUG.test(m.next)) e("next", "must be the kebab-case slug of another lesson folder");
    else if (!fs.existsSync(path.join(ROOT, "lessons", m.next, "lesson.json"))) e("next", "lessons/" + m.next + "/lesson.json does not exist");
  }
  if (!Array.isArray(m.chapters) || m.chapters.length < 1 || m.chapters.length > 30) { e("chapters", "must be an array of 1–30 chapters"); return errors; }
  var files = [];
  m.chapters.forEach(function (c, i) {
    var p = "chapters[" + i + "]";
    if (!c || typeof c !== "object") { e(p, "must be an object"); return; }
    if (typeof c.file !== "string" || !FILE.test(c.file)) e(p + ".file", "must look like 01-some-title (two digits, hyphen, kebab-case), got " + JSON.stringify(c.file));
    else {
      if (files.indexOf(c.file) !== -1) e(p + ".file", "duplicate chapter file " + c.file);
      files.push(c.file);
      if (!fs.existsSync(path.join(lessonDir, "chapters", c.file + ".json"))) e(p + ".file", "chapters/" + c.file + ".json does not exist");
    }
    if (typeof c.title !== "string" || !c.title.trim() || c.title.length > 80) e(p + ".title", "must be a string of 1–80 characters");
    if (typeof c.view !== "string" || !/^nthview-[a-z0-9-]+$/.test(c.view)) e(p + ".view", "must be a view skill name such as nthview-scenario-quiz");
    else if (!fs.existsSync(path.join(ROOT, "skills", c.view, "assets", "view.js"))) e(p + ".view", "skills/" + c.view + " is not an installed view");
    if (typeof c.summary !== "string" || !c.summary.trim() || c.summary.length > 300) e(p + ".summary", "must be a string of 1–300 characters");
  });
  return errors;
}

/* ---------- the lesson bar injected into every chapter page ---------- */
function lessonBar(m, i, slug) {
  var n = m.chapters.length, prev = i > 0 ? m.chapters[i - 1].file + ".html" : null, next = i < n - 1 ? m.chapters[i + 1].file + ".html" : null;
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
  var nextHref = next ? next : (m.next ? "../../" + m.next + "/index.html" : "../index.html");
  var nextLabel = next ? "Next chapter" : (m.next ? "Next lesson" : "Finish");
  return [
    "",
    "  <!-- NthView lesson bar: added by scripts/build-lesson.js; the view above is untouched -->",
    '  <nav class="nthview-lesson-bar" aria-label="Lesson navigation" data-chapter="' + (i + 1) + '" data-of="' + n + '">',
    '    <button type="button" class="nthview-lesson-toggle" aria-expanded="false" aria-controls="nthview-lesson-menu" title="' + esc(m.title) + '">' + (i + 1) + "<small>/" + n + "</small></button>",
    '    <div class="nthview-lesson-menu" id="nthview-lesson-menu">',
    '      <span class="nthview-lesson-title"><b>' + esc(m.title) + "</b> · Chapter " + (i + 1) + " of " + n + ": " + esc(m.chapters[i].title) + "</span>",
    '      <span class="nthview-lesson-links">',
    prev ? '        <a href="' + prev + '">‹ Previous</a>' : '        <a href="../index.html">‹ Contents</a>',
    '        <a href="../index.html">Contents</a>',
    '        <a class="nthview-lesson-next" href="' + nextHref + '">' + nextLabel + " ›</a>",
    "      </span>",
    "    </div>",
    "  </nav>",
    "  <style>",
    "    .nthview-lesson-bar{position:fixed;right:14px;bottom:14px;z-index:2147483000;display:flex;align-items:center;gap:.5rem;font:14px/1.3 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color-scheme:light dark}",
    "    .nthview-lesson-toggle{width:46px;height:46px;border-radius:50%;border:1.5px solid rgba(127,127,127,.4);background:rgba(255,255,255,.9);color:#111;font:700 15px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 10px 30px -12px rgba(0,0,0,.5);backdrop-filter:blur(10px)}",
    "    .nthview-lesson-toggle small{font-size:10px;font-weight:600;opacity:.7}",
    "    .nthview-lesson-menu{display:none;align-items:center;gap:.9rem;padding:.55rem .9rem;border-radius:999px;border:1.5px solid rgba(127,127,127,.4);background:rgba(255,255,255,.94);color:#111;box-shadow:0 14px 40px -16px rgba(0,0,0,.55);backdrop-filter:blur(12px);max-width:min(78vw,40rem)}",
    "    .nthview-lesson-bar.nthview-lesson-open .nthview-lesson-menu,.nthview-lesson-bar:focus-within .nthview-lesson-menu,.nthview-lesson-bar:hover .nthview-lesson-menu{display:flex}",
    "    .nthview-lesson-title{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:22rem}",
    "    .nthview-lesson-links{display:flex;gap:.6rem;flex:none}",
    "    .nthview-lesson-links a{color:#1d4ed8;text-decoration:none;font-weight:600;white-space:nowrap}",
    "    .nthview-lesson-links a:hover{text-decoration:underline}",
    "    .nthview-lesson-links a.nthview-lesson-next{background:#1d4ed8;color:#fff;padding:.25rem .7rem;border-radius:999px}",
    "    .nthview-lesson-bar :focus-visible{outline:3px solid #1d4ed8;outline-offset:2px}",
    "    @media (prefers-color-scheme:dark){.nthview-lesson-toggle,.nthview-lesson-menu{background:rgba(24,26,36,.92);color:#f3f4f8}.nthview-lesson-links a{color:#9db4ff}.nthview-lesson-links a.nthview-lesson-next{background:#4d7cff;color:#0b1020}}",
    "    @media (max-width:640px){.nthview-lesson-bar{flex-direction:column-reverse;align-items:flex-end}.nthview-lesson-menu{flex-direction:column;align-items:flex-start;border-radius:1rem;max-width:calc(100vw - 28px)}.nthview-lesson-title{white-space:normal;max-width:none}}",
    "    @media print{.nthview-lesson-bar{display:none}}",
    "  </style>",
    "  <script>",
    "    (function () {",
    '      var bar = document.querySelector(".nthview-lesson-bar"), btn = bar.querySelector(".nthview-lesson-toggle");',
    '      btn.addEventListener("click", function () { var open = bar.classList.toggle("nthview-lesson-open"); btn.setAttribute("aria-expanded", String(open)); });',
    '      document.addEventListener("keydown", function (e) { if (e.key === "Escape" && bar.classList.contains("nthview-lesson-open")) { bar.classList.remove("nthview-lesson-open"); btn.setAttribute("aria-expanded", "false"); btn.focus(); } });',
    "    })();",
    "  </script>"
  ].join("\n");
}

/* ---------- the contents page of a lesson ---------- */
function contentsPage(m, slug) {
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
  var viewName = function (v) { return v.replace(/^nthview-/, "").split("-").map(function (w) { return w[0].toUpperCase() + w.slice(1); }).join(" "); };
  var cards = m.chapters.map(function (c, i) {
    return '      <li class="ch"><a href="chapters/' + c.file + '.html"><span class="num">' + String(i + 1).padStart(2, "0") + '</span><span class="body"><span class="view">' + esc(viewName(c.view)) + '</span><b>' + esc(c.title) + "</b><p>" + esc(c.summary) + '</p></span><span class="go" aria-hidden="true">›</span></a></li>';
  }).join("\n");
  var nextLink = m.next ? '<a class="btn" href="../' + m.next + '/index.html">Next lesson ›</a>' : "";
  return [
    "<!doctype html>", '<html lang="en">', "<head>", '  <meta charset="utf-8">', '  <meta name="viewport" content="width=device-width, initial-scale=1">', '  <meta name="color-scheme" content="light dark">',
    "  <title>" + esc(m.title) + " — NthView lesson</title>",
    '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;500;700&display=swap">',
    "  <style>",
    "    :root{--bg1:#f7f3ec;--bg2:#ece6f6;--ink:#111318;--muted:#5b5a66;--line:rgba(20,20,40,.12);--surface:rgba(255,255,255,.84);--accent:#6d4aff;--accent-2:#ff6a8a;color-scheme:light dark}",
    "    @media (prefers-color-scheme:dark){:root{--bg1:#0d0f1a;--bg2:#1a1530;--ink:#fafbff;--muted:#b3b6cc;--line:rgba(255,255,255,.14);--surface:rgba(22,24,44,.7);--accent:#9d8bff;--accent-2:#ff8fa8}}",
    "    *{box-sizing:border-box}body{margin:0;min-height:100vh;background:linear-gradient(160deg,var(--bg1),var(--bg2));color:var(--ink);font:16px/1.55 Inter,system-ui,sans-serif}",
    "    main{max-width:50rem;margin:0 auto;padding:clamp(1rem,4vw,2.5rem) 1rem 4rem}",
    "    .eyebrow{font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:var(--accent);margin:0 0 .5rem}",
    "    h1{font-family:Fraunces,Georgia,serif;font-weight:800;font-size:clamp(2.2rem,6vw,3.6rem);line-height:1;letter-spacing:-.03em;margin:0 0 .8rem;background:linear-gradient(120deg,var(--ink) 55%,var(--accent) 85%,var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}",
    "    .lede{font-size:1.1rem;color:var(--muted);margin:0 0 .6rem}.aud{font-size:.95rem;color:var(--muted);margin:0 0 1.6rem}",
    "    ol{list-style:none;padding:0;margin:0;display:grid;gap:.8rem}",
    "    .ch a{display:flex;gap:1rem;align-items:center;text-decoration:none;color:inherit;background:var(--surface);backdrop-filter:blur(14px);border:1px solid var(--line);border-radius:1.2rem;padding:1rem 1.2rem;box-shadow:0 24px 60px -32px rgba(0,0,0,.45);transition:transform .2s,box-shadow .2s}",
    "    .ch a:hover{transform:translateY(-3px);box-shadow:0 34px 70px -30px rgba(0,0,0,.55)}",
    "    .num{font-family:Fraunces,Georgia,serif;font-weight:800;font-size:2rem;line-height:1;background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent;flex:none;width:3rem}",
    "    .body{flex:1;min-width:0}.view{display:inline-block;font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:.2rem}.body b{display:block;font-family:Fraunces,Georgia,serif;font-size:1.25rem;line-height:1.2}.body p{margin:.3rem 0 0;color:var(--muted);font-size:.95rem}",
    "    .go{font-size:1.8rem;color:var(--muted)}",
    "    .foot{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:2rem;align-items:center}.btn{display:inline-block;padding:.65rem 1.2rem;border-radius:999px;font-weight:700;text-decoration:none;border:1.5px solid var(--accent);color:var(--accent)}.btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;border-color:transparent}",
    "    .back{color:var(--muted);text-decoration:none;font-size:.9rem}.back:hover{text-decoration:underline}",
    "  </style>", "</head>", "<body>", "  <main>",
    '    <a class="back" href="../../index.html">‹ All views and lessons</a>',
    '    <p class="eyebrow" style="margin-top:1.2rem">Lesson · ' + m.chapters.length + " chapter" + (m.chapters.length === 1 ? "" : "s") + "</p>",
    "    <h1>" + esc(m.title) + "</h1>",
    '    <p class="lede">' + esc(m.description) + "</p>",
    m.audience ? '    <p class="aud"><b>For:</b> ' + esc(m.audience) + "</p>" : "",
    '    <ol aria-label="Chapters">', cards, "    </ol>",
    '    <div class="foot"><a class="btn primary" href="chapters/' + m.chapters[0].file + '.html">Start chapter 1 ›</a>' + nextLink + "</div>",
    "  </main>", "</body>", "</html>", ""
  ].join("\n");
}

/* ---------- build one lesson ---------- */
function buildLesson(lessonDir) {
  lessonDir = path.resolve(lessonDir);
  var slug = path.basename(lessonDir), manifestPath = path.join(lessonDir, "lesson.json");
  if (!SLUG.test(slug)) { fail("lesson folder name must be kebab-case, got " + slug); return false; }
  if (!fs.existsSync(manifestPath)) { fail("missing " + path.relative(ROOT, manifestPath)); return false; }
  var m;
  try { m = JSON.parse(fs.readFileSync(manifestPath, "utf8")); } catch (e) { fail("lesson.json could not be parsed (" + e.message + ")"); return false; }
  var errs = validateManifest(m, lessonDir);
  if (errs.length) { errs.forEach(fail); return false; }

  var ok = true;
  m.chapters.forEach(function (c, i) {
    var dataPath = path.join(lessonDir, "chapters", c.file + ".json");
    var data;
    try { data = JSON.parse(fs.readFileSync(dataPath, "utf8")); } catch (e) { fail(c.file + ".json could not be parsed (" + e.message + ")"); ok = false; return; }
    var out = buildHtml.assemble(path.join(ROOT, "skills", c.view), data, { extraBody: lessonBar(m, i, slug) });
    out.errors.forEach(function (er) { fail(c.file + ".json " + er.path + ": " + er.message); });
    out.warnings.forEach(function (w) { console.error("warning  " + c.file + ".json " + w.path + ": " + w.message); });
    if (!out.html) { ok = false; return; }
    fs.writeFileSync(path.join(lessonDir, "chapters", c.file + ".html"), out.html);
    console.log("wrote lessons/" + slug + "/chapters/" + c.file + ".html (" + c.view + ")");
  });
  if (!ok) return false;
  fs.writeFileSync(path.join(lessonDir, "index.html"), contentsPage(m, slug));
  console.log("wrote lessons/" + slug + "/index.html (" + m.chapters.length + " chapters)");
  return true;
}

module.exports = { buildLesson: buildLesson, validateManifest: validateManifest };

if (require.main === module) {
  var arg = process.argv[2];
  if (!arg) { console.error("usage: node scripts/build-lesson.js <lessons/slug> | --all"); process.exit(2); }
  var targets = arg === "--all"
    ? (fs.existsSync(path.join(ROOT, "lessons")) ? fs.readdirSync(path.join(ROOT, "lessons")).filter(function (d) { return fs.existsSync(path.join(ROOT, "lessons", d, "lesson.json")); }).map(function (d) { return path.join(ROOT, "lessons", d); }) : [])
    : [arg];
  var allOk = targets.length > 0;
  targets.forEach(function (t) { if (!buildLesson(t)) allOk = false; });
  if (!allOk) { console.error("lesson build failed"); process.exit(1); }
  /* the gallery registry exists only inside the NthView repository; a lesson built elsewhere (plugin use) is just files */
  var inRepo = targets.every(function (t) { return path.resolve(t).indexOf(path.join(ROOT, "lessons") + path.sep) === 0; });
  if (!inRepo) { console.log("lesson built outside the NthView repository; gallery registry not updated"); process.exit(0); }
  try { cp.execFileSync(process.execPath, [path.join(__dirname, "build-registry.js")], { stdio: "inherit" }); }
  catch (e) { process.exit(1); }
}
