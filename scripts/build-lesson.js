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
 * lesson.json is schemaVersion 2: title, description, audience, level, domain,
 * tags, objectives, created and the chapters (the first a nthview-highlights
 * overview) are required; see skills/nthview/references/lesson-format.md.
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

/* ---------- manifest validation (lesson.json schemaVersion 2) ---------- */
var LEVELS = ["beginner", "intermediate", "advanced"];
var DOMAINS = ["security", "software", "science", "business", "philosophy", "health", "maths", "language", "history", "arts", "other"];
var ROLES = ["preview", "structure", "demonstrate", "apply", "confront", "consolidate", "assess", "recap"];
var TAG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
var DATE = /^\d{4}-\d{2}-\d{2}$/;
var LANG = /^[a-z]{2,3}(-[A-Za-z0-9]{2,8})*$/;

function validDate(s) {
  if (typeof s !== "string" || !DATE.test(s)) return false;
  var d = new Date(s + "T00:00:00Z");
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s;
}
function str(v, min, max) { return typeof v === "string" && v.trim().length >= min && v.length <= max; }

function validateManifest(m, lessonDir) {
  var errors = [], warnings = [];
  var e = function (p, msg) { errors.push(p + ": " + msg); };
  var w = function (p, msg) { warnings.push(p + ": " + msg); };
  var done = function () { return { errors: errors, warnings: warnings }; };
  if (!m || typeof m !== "object" || Array.isArray(m)) { e("$", "lesson.json must be an object"); return done(); }
  if (m.schemaVersion !== 2) { e("schemaVersion", "expected 2, got " + JSON.stringify(m.schemaVersion) + " (see skills/nthview/references/lesson-format.md for the version 2 fields)"); return done(); }
  if (!str(m.title, 1, 80)) e("title", "must be a string of 1–80 characters");
  if (!str(m.description, 1, 400)) e("description", "must be a string of 1–400 characters");
  if (!str(m.audience, 1, 200)) e("audience", "must be a string of 1–200 characters saying who the lesson is for");
  if (LEVELS.indexOf(m.level) === -1) e("level", "must be one of " + LEVELS.join(", ") + ", got " + JSON.stringify(m.level));
  if (DOMAINS.indexOf(m.domain) === -1) e("domain", "must be one of " + DOMAINS.join(", ") + ", got " + JSON.stringify(m.domain));
  if (!Array.isArray(m.tags) || m.tags.length < 1 || m.tags.length > 8) e("tags", "must be an array of 1–8 tags");
  else {
    var seen = {};
    m.tags.forEach(function (t, i) {
      if (!str(t, 2, 30) || !TAG.test(t)) e("tags[" + i + "]", "must be lowercase kebab-case of 2–30 characters, got " + JSON.stringify(t));
      else if (seen[t]) e("tags[" + i + "]", "duplicate tag " + JSON.stringify(t)); else seen[t] = true;
    });
  }
  if (!Array.isArray(m.objectives) || m.objectives.length < 2 || m.objectives.length > 7) e("objectives", "must be an array of 2–7 learning objectives");
  else m.objectives.forEach(function (o, i) { if (!str(o, 10, 160)) e("objectives[" + i + "]", "must be a string of 10–160 characters starting with what the learner will be able to do"); });
  if (m.prerequisites !== undefined) {
    if (!Array.isArray(m.prerequisites) || m.prerequisites.length > 6) e("prerequisites", "must be an array of at most 6 strings");
    else m.prerequisites.forEach(function (o, i) { if (!str(o, 1, 160)) e("prerequisites[" + i + "]", "must be a string of 1–160 characters"); });
  }
  if (m.estimatedMinutes !== undefined && (typeof m.estimatedMinutes !== "number" || m.estimatedMinutes % 1 !== 0 || m.estimatedMinutes < 5 || m.estimatedMinutes > 600)) e("estimatedMinutes", "must be an integer of 5–600");
  if (m.license !== undefined && !str(m.license, 1, 40)) e("license", "must be a short string such as an SPDX id");
  if (m.language !== undefined && (typeof m.language !== "string" || !LANG.test(m.language))) e("language", "must be a BCP-47 tag such as en or pt-BR");
  if (!validDate(m.created)) e("created", "must be a real date written YYYY-MM-DD");
  if (m.updated !== undefined) {
    if (!validDate(m.updated)) e("updated", "must be a real date written YYYY-MM-DD");
    else if (validDate(m.created) && m.updated < m.created) e("updated", "must not be earlier than created");
  }
  if (m.next !== undefined) {
    if (typeof m.next !== "string" || !SLUG.test(m.next)) e("next", "must be the kebab-case slug of another lesson folder");
    else if (!fs.existsSync(path.join(ROOT, "lessons", m.next, "lesson.json"))) e("next", "lessons/" + m.next + "/lesson.json does not exist");
  }
  var glossaryTerms = {};
  if (m.glossary !== undefined) {
    if (!Array.isArray(m.glossary) || m.glossary.length > 20) e("glossary", "must be an array of at most 20 entries");
    else m.glossary.forEach(function (g, i) {
      var p = "glossary[" + i + "]";
      if (!g || typeof g !== "object") { e(p, "must be an object"); return; }
      if (!str(g.term, 1, 60)) e(p + ".term", "must be a string of 1–60 characters");
      else {
        var k = g.term.trim().toLowerCase();
        if (glossaryTerms[k]) e(p + ".term", "duplicate term " + JSON.stringify(g.term) + " (terms must differ beyond case)"); else glossaryTerms[k] = g.term;
      }
      if (!str(g.definition, 1, 300)) e(p + ".definition", "must be a string of 1–300 characters in plain words");
      if (g.chapter !== undefined && typeof g.chapter !== "string") e(p + ".chapter", "must be a chapter file name");
    });
    if (m.glossary.length && m.glossary.length < 3) w("glossary", "fewer than 3 terms; a lesson glossary usually holds 5–15");
  } else w("glossary", "no glossary; readers benefit from 5–15 terms defined in plain words");
  if (m.references !== undefined) {
    if (!Array.isArray(m.references) || m.references.length > 12) e("references", "must be an array of at most 12 entries");
    else m.references.forEach(function (r, i) {
      var p = "references[" + i + "]";
      if (!r || typeof r !== "object") { e(p, "must be an object"); return; }
      if (!str(r.title, 1, 120)) e(p + ".title", "must be a string of 1–120 characters");
      if (r.url !== undefined && (typeof r.url !== "string" || !/^https?:\/\/\S+$/.test(r.url))) e(p + ".url", "must be an http(s) URL");
      if (r.note !== undefined && !str(r.note, 1, 160)) e(p + ".note", "must be a string of 1–160 characters");
    });
  }
  if (!Array.isArray(m.chapters) || m.chapters.length < 2 || m.chapters.length > 30) { e("chapters", "must be an array of 2–30 chapters, the first one a nthview-highlights overview"); return done(); }
  var files = [], roles = {}, minutes = 0, allMinutes = true, covered = {};
  m.chapters.forEach(function (c, i) {
    var p = "chapters[" + i + "]";
    if (!c || typeof c !== "object") { e(p, "must be an object"); return; }
    if (typeof c.file !== "string" || !FILE.test(c.file)) e(p + ".file", "must look like 01-some-title (two digits, hyphen, kebab-case), got " + JSON.stringify(c.file));
    else {
      if (files.indexOf(c.file) !== -1) e(p + ".file", "duplicate chapter file " + c.file);
      files.push(c.file);
      if (!fs.existsSync(path.join(lessonDir, "chapters", c.file + ".json"))) e(p + ".file", "chapters/" + c.file + ".json does not exist");
    }
    if (!str(c.title, 1, 80)) e(p + ".title", "must be a string of 1–80 characters");
    if (typeof c.view !== "string" || !/^nthview-[a-z0-9-]+$/.test(c.view)) e(p + ".view", "must be a view skill name such as nthview-scenario-quiz");
    else if (!fs.existsSync(path.join(ROOT, "skills", c.view, "assets", "view.js"))) e(p + ".view", "skills/" + c.view + " is not an installed view");
    if (i === 0 && c.view !== "nthview-highlights") e(p + ".view", "the first chapter must be the nthview-highlights overview of the whole lesson, got " + JSON.stringify(c.view));
    if (!str(c.summary, 1, 300)) e(p + ".summary", "must be a string of 1–300 characters");
    if (c.role !== undefined) {
      if (ROLES.indexOf(c.role) === -1) e(p + ".role", "must be one of " + ROLES.join(", ") + ", got " + JSON.stringify(c.role));
      else { roles[c.role] = (roles[c.role] || 0) + 1; if (c.role === "preview" && i !== 0) e(p + ".role", "the preview chapter must be first"); if (c.role === "recap" && i !== m.chapters.length - 1) e(p + ".role", "the recap chapter must be last"); }
    }
    if (c.minutes !== undefined) {
      if (typeof c.minutes !== "number" || c.minutes % 1 !== 0 || c.minutes < 1 || c.minutes > 120) e(p + ".minutes", "must be an integer of 1–120");
      else minutes += c.minutes;
    } else allMinutes = false;
    if (c.objectives !== undefined) {
      if (!Array.isArray(c.objectives) || !c.objectives.length) e(p + ".objectives", "must be a non-empty array of indexes into the lesson objectives");
      else c.objectives.forEach(function (k, j) {
        if (typeof k !== "number" || k % 1 !== 0 || !Array.isArray(m.objectives) || k < 0 || k >= m.objectives.length) e(p + ".objectives[" + j + "]", "index " + JSON.stringify(k) + " is out of range (" + (Array.isArray(m.objectives) ? m.objectives.length : 0) + " objectives, valid indexes are 0–" + ((Array.isArray(m.objectives) ? m.objectives.length : 1) - 1) + ")");
        else covered[k] = true;
      });
    }
    if (c.terms !== undefined) {
      if (!Array.isArray(c.terms)) e(p + ".terms", "must be an array of glossary terms");
      else c.terms.forEach(function (t, j) { if (typeof t !== "string" || !glossaryTerms[String(t).trim().toLowerCase()]) e(p + ".terms[" + j + "]", "term " + JSON.stringify(t) + " is not in the lesson glossary"); });
    }
  });
  if (roles.preview > 1) e("chapters", "more than one preview chapter");
  if (roles.recap > 1) e("chapters", "more than one recap chapter");
  if (Array.isArray(m.glossary)) m.glossary.forEach(function (g, i) { if (g && g.chapter !== undefined && files.indexOf(g.chapter) === -1) e("glossary[" + i + "].chapter", "chapter file " + JSON.stringify(g.chapter) + " is not in chapters"); });
  if (Array.isArray(m.objectives) && Object.keys(covered).length && Object.keys(covered).length < m.objectives.length) {
    m.objectives.forEach(function (o, k) { if (!covered[k]) w("objectives[" + k + "]", "no chapter lists this objective"); });
  }
  if (m.estimatedMinutes === undefined && !allMinutes) w("estimatedMinutes", "not set and not every chapter has minutes; the contents page shows no duration");
  if (Object.keys(roles).length && !roles.apply && !roles.assess) w("chapters", "no chapter has the role apply or assess; learners need somewhere to use the ideas");
  return done();
}

function lessonMinutes(m) {
  if (typeof m.estimatedMinutes === "number") return m.estimatedMinutes;
  var sum = 0, all = true;
  m.chapters.forEach(function (c) { if (typeof c.minutes === "number") sum += c.minutes; else all = false; });
  return all ? sum : null;
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
function fmtDate(iso) {
  var d = new Date(iso + "T00:00:00Z");
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}
function cap(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }
function contentsPage(m, slug) {
  var esc = function (s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); };
  var viewName = function (v) { return v.replace(/^nthview-/, "").split("-").map(function (w) { return w[0].toUpperCase() + w.slice(1); }).join(" "); };
  var mins = lessonMinutes(m);
  var n = m.chapters.length;
  var cards = m.chapters.map(function (c, i) {
    var meta = [esc(viewName(c.view))];
    if (c.role) meta.push(esc(cap(c.role)));
    if (typeof c.minutes === "number") meta.push(c.minutes + " min");
    return '      <li class="ch" data-view="' + esc(c.view) + '"><a href="chapters/' + c.file + '.html"><span class="num">' + String(i + 1).padStart(2, "0") + '</span><span class="body"><span class="view">' + meta.join(" · ") + '</span><b>' + esc(c.title) + "</b><p>" + esc(c.summary) + '</p></span><span class="go" aria-hidden="true">›</span></a></li>';
  }).join("\n");
  var tags = (m.tags || []).map(function (t) { return '<a class="tag" href="../../index.html#lessons?tag=' + encodeURIComponent(t) + '">#' + esc(t) + "</a>"; }).join("");
  var facts = [cap(esc(m.domain)), cap(esc(m.level)), mins ? "about " + mins + " min" : null, n + " chapters"].filter(Boolean).join(" · ");
  var objectives = (m.objectives || []).map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("");
  var prereq = (m.prerequisites || []).map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("");
  var glossary = (m.glossary || []).slice().sort(function (a, b) { return a.term.toLowerCase() < b.term.toLowerCase() ? -1 : 1; }).map(function (g) {
    var where = "";
    if (g.chapter) { var idx = m.chapters.map(function (c) { return c.file; }).indexOf(g.chapter); if (idx !== -1) where = ' <a class="where" href="chapters/' + g.chapter + '.html">ch. ' + (idx + 1) + "</a>"; }
    return "<div class=\"term\"><dt>" + esc(g.term) + where + "</dt><dd>" + esc(g.definition) + "</dd></div>";
  }).join("");
  var refs = (m.references || []).map(function (r) {
    var t = r.url ? '<a href="' + esc(r.url) + '" rel="noopener" target="_blank">' + esc(r.title) + "</a>" : esc(r.title);
    return "<li>" + t + (r.note ? ' <span class="note">' + esc(r.note) + "</span>" : "") + "</li>";
  }).join("");
  var dates = "Created " + fmtDate(m.created) + (m.updated && m.updated !== m.created ? " · Updated " + fmtDate(m.updated) : "");
  var nextLink = m.next ? '<a class="btn" href="../' + m.next + '/index.html">Next lesson ›</a>' : "";
  var firstReal = m.chapters.length > 1 ? m.chapters[1] : m.chapters[0];
  return [
    "<!doctype html>", '<html lang="' + esc(m.language || "en") + '">', "<head>", '  <meta charset="utf-8">', '  <meta name="viewport" content="width=device-width, initial-scale=1">', '  <meta name="color-scheme" content="light dark">',
    "  <title>" + esc(m.title) + " — NthView lesson</title>",
    '  <meta name="description" content="' + esc(m.description) + '">',
    '  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,800&family=Inter:wght@400;500;700&display=swap">',
    "  <style>",
    "    :root{--bg1:#f7f3ec;--bg2:#ece6f6;--ink:#111318;--muted:#5b5a66;--line:rgba(20,20,40,.12);--surface:rgba(255,255,255,.84);--surface-2:rgba(255,255,255,.96);--accent:#6d4aff;--accent-2:#ff6a8a;--accent-3:#19b3b0;color-scheme:light dark}",
    "    @media (prefers-color-scheme:dark){:root{--bg1:#0d0f1a;--bg2:#1a1530;--ink:#fafbff;--muted:#b3b6cc;--line:rgba(255,255,255,.14);--surface:rgba(22,24,44,.7);--surface-2:rgba(28,30,54,.92);--accent:#9d8bff;--accent-2:#ff8fa8;--accent-3:#4fd6d2}}",
    "    *{box-sizing:border-box}body{margin:0;min-height:100vh;background:linear-gradient(160deg,var(--bg1),var(--bg2)) fixed;color:var(--ink);font:16px/1.55 Inter,system-ui,sans-serif}",
    "    main{max-width:56rem;margin:0 auto;padding:clamp(1rem,4vw,2.5rem) 1rem 4rem}",
    "    .back{color:var(--muted);text-decoration:none;font-size:.9rem}.back:hover{text-decoration:underline}",
    "    .hero{display:grid;grid-template-columns:1.4fr 1fr;gap:1.6rem;align-items:start;margin:1.2rem 0 2rem}@media (max-width:760px){.hero{grid-template-columns:1fr}}",
    "    .eyebrow{font-size:.74rem;letter-spacing:.16em;text-transform:uppercase;font-weight:700;color:var(--accent);margin:0 0 .5rem}",
    "    h1{font-family:Fraunces,Georgia,serif;font-weight:800;font-size:clamp(2.2rem,6vw,3.6rem);line-height:1;letter-spacing:-.03em;margin:0 0 .8rem;background:linear-gradient(120deg,var(--ink) 55%,var(--accent) 85%,var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent}",
    "    .lede{font-size:1.1rem;color:var(--muted);margin:0 0 .8rem}.aud{font-size:.95rem;color:var(--muted);margin:0 0 .9rem}.aud b{color:var(--ink)}",
    "    .tags{display:flex;flex-wrap:wrap;gap:.4rem;margin:0 0 1rem}.tag{font-size:.8rem;font-weight:700;text-decoration:none;color:var(--accent);background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:.25rem .7rem}.tag:hover{border-color:var(--accent)}",
    "    .dates{font-size:.82rem;color:var(--muted);margin:0}",
    "    .cta{display:flex;gap:.7rem;flex-wrap:wrap;margin:1.2rem 0 0}.btn{display:inline-block;padding:.7rem 1.25rem;border-radius:999px;font-weight:700;text-decoration:none;border:1.5px solid var(--accent);color:var(--accent);background:var(--surface)}.btn.primary{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;border-color:transparent;box-shadow:0 18px 40px -20px rgba(0,0,0,.5)}.btn:hover{transform:translateY(-1px)}",
    "    .panel{background:var(--surface);backdrop-filter:blur(14px);border:1px solid var(--line);border-radius:1.3rem;padding:1.1rem 1.3rem;box-shadow:0 24px 60px -32px rgba(0,0,0,.45)}",
    "    .panel h2{font-family:Fraunces,Georgia,serif;font-size:1.15rem;margin:0 0 .6rem;letter-spacing:-.01em}.panel ul{margin:0;padding-left:1.1rem;display:grid;gap:.35rem}.panel li{font-size:.95rem}.panel+.panel{margin-top:1rem}",
    "    .side{display:grid;gap:1rem}",
    "    h2.sec{font-family:Fraunces,Georgia,serif;font-weight:800;font-size:1.6rem;letter-spacing:-.02em;margin:2.2rem 0 .9rem}",
    "    ol{list-style:none;padding:0;margin:0;display:grid;gap:.8rem}",
    "    .ch a{display:flex;gap:1rem;align-items:center;text-decoration:none;color:inherit;background:var(--surface);backdrop-filter:blur(14px);border:1px solid var(--line);border-radius:1.2rem;padding:1rem 1.2rem;box-shadow:0 24px 60px -32px rgba(0,0,0,.45);transition:transform .2s,box-shadow .2s}",
    "    .ch a:hover{transform:translateY(-3px);box-shadow:0 34px 70px -30px rgba(0,0,0,.55)}",
    "    .ch[data-view=nthview-highlights] a{border-color:var(--accent);background:linear-gradient(135deg,var(--surface),var(--surface-2))}",
    "    .num{font-family:Fraunces,Georgia,serif;font-weight:800;font-size:2rem;line-height:1;background:linear-gradient(135deg,var(--accent),var(--accent-2));-webkit-background-clip:text;background-clip:text;color:transparent;flex:none;width:3rem}",
    "    .body{flex:1;min-width:0}.view{display:inline-block;font-size:.7rem;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin-bottom:.2rem}.body b{display:block;font-family:Fraunces,Georgia,serif;font-size:1.25rem;line-height:1.2}.body p{margin:.3rem 0 0;color:var(--muted);font-size:.95rem}",
    "    .go{font-size:1.8rem;color:var(--muted)}",
    "    dl{margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(16rem,1fr));gap:.7rem}.term{background:var(--surface);border:1px solid var(--line);border-radius:1rem;padding:.8rem 1rem}dt{font-weight:700;display:flex;justify-content:space-between;gap:.5rem;align-items:baseline}dd{margin:.25rem 0 0;color:var(--muted);font-size:.92rem}.where{font-size:.72rem;font-weight:700;color:var(--accent);text-decoration:none;white-space:nowrap}.where:hover{text-decoration:underline}",
    "    .refs{margin:0;padding-left:1.1rem;display:grid;gap:.4rem}.refs a{color:var(--accent)}.note{color:var(--muted);font-size:.9rem}",
    "    .foot{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:2.2rem;align-items:center}",
    "    @media (prefers-reduced-motion:reduce){.ch a,.btn{transition:none}.ch a:hover,.btn:hover{transform:none}}",
    "  </style>", "</head>", "<body>", "  <main>",
    '    <a class="back" href="../../index.html">‹ All views and lessons</a>',
    '    <div class="hero">',
    "      <div>",
    '        <p class="eyebrow">Lesson · ' + facts + "</p>",
    "        <h1>" + esc(m.title) + "</h1>",
    '        <p class="lede">' + esc(m.description) + "</p>",
    '        <p class="aud"><b>For:</b> ' + esc(m.audience) + "</p>",
    tags ? '        <div class="tags" aria-label="Tags">' + tags + "</div>" : "",
    '        <p class="dates">' + dates + (m.license ? " · " + esc(m.license) : "") + "</p>",
    '        <div class="cta"><a class="btn primary" href="chapters/' + m.chapters[0].file + '.html">Start with the highlights ›</a><a class="btn" href="chapters/' + firstReal.file + '.html">Skip to chapter 2</a></div>',
    "      </div>",
    '      <div class="side">',
    objectives ? '        <section class="panel" aria-labelledby="obj"><h2 id="obj">You will be able to</h2><ul>' + objectives + "</ul></section>" : "",
    prereq ? '        <section class="panel" aria-labelledby="pre"><h2 id="pre">Before you start</h2><ul>' + prereq + "</ul></section>" : "",
    "      </div>",
    "    </div>",
    '    <h2 class="sec" id="chapters">Chapters</h2>',
    '    <ol aria-labelledby="chapters">', cards, "    </ol>",
    glossary ? '    <h2 class="sec" id="glossary">Glossary</h2>\n    <dl aria-labelledby="glossary">' + glossary + "</dl>" : "",
    refs ? '    <h2 class="sec" id="refs">Further reading</h2>\n    <ul class="refs" aria-labelledby="refs">' + refs + "</ul>" : "",
    '    <div class="foot"><a class="btn primary" href="chapters/' + m.chapters[0].file + '.html">Start ›</a>' + nextLink + "</div>",
    "  </main>", "</body>", "</html>", ""
  ].filter(function (l) { return l !== ""; }).join("\n");
}

/* ---------- build one lesson ---------- */
function buildLesson(lessonDir) {
  lessonDir = path.resolve(lessonDir);
  var slug = path.basename(lessonDir), manifestPath = path.join(lessonDir, "lesson.json");
  if (!SLUG.test(slug)) { fail("lesson folder name must be kebab-case, got " + slug); return false; }
  if (!fs.existsSync(manifestPath)) { fail("missing " + path.relative(ROOT, manifestPath)); return false; }
  var m;
  try { m = JSON.parse(fs.readFileSync(manifestPath, "utf8")); } catch (e) { fail("lesson.json could not be parsed (" + e.message + ")"); return false; }
  var check = validateManifest(m, lessonDir);
  check.warnings.forEach(function (w) { console.error("warning  lesson.json " + w); });
  if (check.errors.length) { check.errors.forEach(function (x) { fail("lesson.json " + x); }); return false; }

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

module.exports = { buildLesson: buildLesson, validateManifest: validateManifest, lessonMinutes: lessonMinutes, LEVELS: LEVELS, DOMAINS: DOMAINS, ROLES: ROLES };

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
