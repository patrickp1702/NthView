#!/usr/bin/env node
/* NthView — gallery registry builder and structure checker
 *
 * Scans skills/<name>/SKILL.md, verifies each view folder follows AGENTS.md,
 * scans docs/*.html (single documents) and lessons/<slug>/lesson.json
 * (lessons), and writes registry.js, which index.html loads to render the
 * gallery. The parent skill `nthview` is recorded but hidden from the gallery.
 *
 * Usage:
 *   node scripts/build-registry.js            # regenerate registry.js
 *   node scripts/build-registry.js --check    # verify registry.js is current (exit 1 if not)
 *   node scripts/build-registry.js --root DIR # operate on another repo root (for tests)
 *
 * Exit codes: 0 ok, 1 structure errors or stale registry, 2 usage error.
 */
"use strict";
var fs = require("fs");
var path = require("path");

var args = process.argv.slice(2);
var check = args.indexOf("--check") !== -1;
var rootIdx = args.indexOf("--root");
var root = rootIdx !== -1 ? args[rootIdx + 1] : path.resolve(__dirname, "..");
if (rootIdx !== -1 && !root) { console.error("usage: --root <dir>"); process.exit(2); }
root = path.resolve(root);

var skillsDir = path.join(root, "skills");
var registryPath = path.join(root, "registry.js");
var REQUIRED_VIEW_FILES = [
  "SKILL.md",
  "assets/view.js",
  "scripts/validate.js",
  "references/schema.md",
  "examples/example.html"
];
var FORBIDDEN_CALLS = /fetch\(|XMLHttpRequest|\bimport\b/;
var CDN_HOSTS = ["cdnjs.cloudflare.com", "cdn.jsdelivr.net", "unpkg.com", "fonts.googleapis.com", "fonts.gstatic.com"];
var URL_RE = /https?:\/\/[a-z0-9.-]+\.[a-z]{2,}[^\s"'`)<>]*/gi;
var ATTR_RE = /(?:src|href)=["']([^"']+)["']|url\(["']?([^"')]+)["']?\)/g;
function allowedUrl(u) {
  if (/^(data:|#|%23|mailto:)/.test(u)) return true; // %23 is an encoded # fragment inside a data URI
  if (/^http:\/\/www\.w3\.org\//.test(u)) return true; // XML namespace identifiers, never fetched
  var m = u.match(/^https:\/\/([^\/]+)\//);
  return !!m && CDN_HOSTS.indexOf(m[1]) !== -1;
}
function stripDataBlock(html) {
  return html.replace(/<script type="application\/json" id="nthview-data">[\s\S]*?<\/script>/, "");
}
var NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
var OS_JUNK = /^(\.DS_Store|Thumbs\.db|desktop\.ini|\._.*)$/;

var errors = [];
function error(where, message) { errors.push(where + ": " + message); }

function parseFrontmatter(text, where) {
  var m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/);
  if (!m) { error(where, "missing YAML frontmatter (file must start with ---)"); return {}; }
  var out = {};
  m[1].split(/\r?\n/).forEach(function (line) {
    var kv = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!kv) return;
    var v = kv[2].trim();
    if ((v[0] === '"' && v[v.length - 1] === '"') || (v[0] === "'" && v[v.length - 1] === "'")) v = v.slice(1, -1);
    out[kv[1]] = v;
  });
  return out;
}

function titleFromName(name) {
  return name.replace(/^nthview-?/, "").split("-").filter(Boolean)
    .map(function (w) { return w[0].toUpperCase() + w.slice(1); }).join(" ") || "NthView";
}

function rel(p) { return path.relative(root, p).split(path.sep).join("/"); }

var skills = [];
if (fs.existsSync(skillsDir)) {
  fs.readdirSync(skillsDir).sort().forEach(function (dir) {
    var full = path.join(skillsDir, dir);
    if (!fs.statSync(full).isDirectory()) return;
    var skillFile = path.join(full, "SKILL.md");
    var where = rel(full);
    if (!fs.existsSync(skillFile)) { error(where, "has no SKILL.md"); return; }

    var fm = parseFrontmatter(fs.readFileSync(skillFile, "utf8"), rel(skillFile));
    if (!fm.name) error(rel(skillFile), "frontmatter is missing 'name'");
    else if (fm.name !== dir) error(rel(skillFile), "frontmatter name \"" + fm.name + "\" does not match folder name \"" + dir + "\"");
    if (!NAME_RE.test(dir) || dir.length > 64) error(where, "folder name must be 1–64 lowercase letters, digits and single hyphens");
    if (!fm.description) error(rel(skillFile), "frontmatter is missing 'description' (must be a single line)");
    else if (fm.description.length > 1024) error(rel(skillFile), "description is " + fm.description.length + " characters; max is 1024");

    var isView = /^nthview-/.test(dir);
    if (isView) {
      REQUIRED_VIEW_FILES.forEach(function (f) {
        if (!fs.existsSync(path.join(full, f))) error(where, "missing required file " + f);
      });
      ["assets/view.js", "examples/example.html"].forEach(function (f) {
        var p = path.join(full, f);
        if (!fs.existsSync(p)) return;
        var text = fs.readFileSync(p, "utf8");
        if (f === "examples/example.html") text = stripDataBlock(text);
        text.split(/\r?\n/).forEach(function (line, i) {
          var where = rel(p) + ":" + (i + 1), m;
          if (FORBIDDEN_CALLS.test(line)) error(where, "forbidden runtime call or import: " + line.trim().slice(0, 80));
          URL_RE.lastIndex = 0;
          while ((m = URL_RE.exec(line))) {
            if (!allowedUrl(m[0])) error(where, "URL is not on an allowed CDN host (" + CDN_HOSTS.join(", ") + "): " + m[0]);
          }
          if (f === "examples/example.html") {
            ATTR_RE.lastIndex = 0;
            while ((m = ATTR_RE.exec(line))) {
              var u = m[1] || m[2];
              if (!allowedUrl(u)) error(where, "local or non-CDN resource reference (the file must stand alone): " + u);
            }
          }
        });
      });
      var ex = path.join(full, "examples/example.html");
      if (fs.existsSync(ex)) {
        var html = fs.readFileSync(ex, "utf8");
        if (html.indexOf('id="nthview-data"') === -1) error(rel(ex), 'missing <script type="application/json" id="nthview-data">');
        if (html.indexOf('id="app"') === -1) error(rel(ex), 'missing <div id="app">');
      }
      // only the fixed layout is allowed inside a view folder
      fs.readdirSync(full).forEach(function (entry) {
        if (OS_JUNK.test(entry)) return; // Finder/Explorer droppings, ignored by git too
        if (["SKILL.md", "assets", "scripts", "references", "examples"].indexOf(entry) === -1) {
          error(where, "unexpected entry \"" + entry + "\" (only SKILL.md, assets/, scripts/, references/, examples/ are allowed)");
        }
      });
    }

    /* the gallery renders these two documents in a dialog, so their text travels inside registry.js
       (the page must also work from file://, where it cannot fetch sibling files) */
    var skillMd = fs.readFileSync(skillFile, "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
    var schemaPath = path.join(full, "references/schema.md");
    var schemaMd = isView && fs.existsSync(schemaPath) ? fs.readFileSync(schemaPath, "utf8") : null;
    skills.push({
      name: dir,
      title: titleFromName(dir),
      kind: isView ? "view" : "skill",
      hidden: !isView,
      skillMd: skillMd,
      schemaMd: schemaMd,
      description: fm.description || "",
      path: where,
      skill: rel(skillFile),
      schema: isView && fs.existsSync(path.join(full, "references/schema.md")) ? rel(path.join(full, "references/schema.md")) : null,
      demo: isView && fs.existsSync(path.join(full, "examples/example.html")) ? rel(path.join(full, "examples/example.html")) : null
    });
  });
}

/* single documents: docs/*.html, built by scripts/build-html.js */
var docs = [];
var docsDir = path.join(root, "docs");
if (fs.existsSync(docsDir)) {
  fs.readdirSync(docsDir).sort().forEach(function (f) {
    if (!/\.html$/.test(f)) return;
    var html = fs.readFileSync(path.join(docsDir, f), "utf8");
    var t = html.match(/<title>([^<]*)<\/title>/), v = html.match(/NthView — ([a-z0-9-]+) (?:validator|renderer)/);
    var unesc = function (x) { return x.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&"); };
    docs.push({ file: "docs/" + f, title: t ? unesc(t[1].replace(/\s*—\s*NthView.*$/, "")) : f.replace(/\.html$/, ""), view: v ? "nthview-" + v[1] : null, data: fs.existsSync(path.join(docsDir, f.replace(/\.html$/, ".json"))) ? "docs/" + f.replace(/\.html$/, ".json") : null });
  });
}
/* lessons: lessons/<slug>/lesson.json, built by scripts/build-lesson.js */
var lessons = [];
var lessonsDir = path.join(root, "lessons");
if (fs.existsSync(lessonsDir)) {
  fs.readdirSync(lessonsDir).sort().forEach(function (slug) {
    var mp = path.join(lessonsDir, slug, "lesson.json");
    if (!fs.existsSync(mp)) return;
    var where = "lessons/" + slug;
    var m;
    try { m = JSON.parse(fs.readFileSync(mp, "utf8")); } catch (e) { error(where + "/lesson.json", "could not be parsed (" + e.message + ")"); return; }
    if (!m || typeof m.title !== "string" || !Array.isArray(m.chapters)) { error(where + "/lesson.json", "needs a title and a chapters array (run node scripts/build-lesson.js " + where + ")"); return; }
    if (!fs.existsSync(path.join(lessonsDir, slug, "index.html"))) error(where, "has no index.html; run node scripts/build-lesson.js " + where);
    m.chapters.forEach(function (c, i) {
      if (!c || typeof c.file !== "string") return;
      if (!fs.existsSync(path.join(lessonsDir, slug, "chapters", c.file + ".html"))) error(where + "/lesson.json chapters[" + i + "]", "chapters/" + c.file + ".html is missing; run node scripts/build-lesson.js " + where);
    });
    var views = []; m.chapters.forEach(function (c) { if (c && c.view && views.indexOf(c.view) === -1) views.push(c.view); });
    var mins = typeof m.estimatedMinutes === "number" ? m.estimatedMinutes : (m.chapters.every(function (c) { return typeof c.minutes === "number"; }) ? m.chapters.reduce(function (a, c) { return a + c.minutes; }, 0) : null);
    lessons.push({ slug: slug, title: m.title, description: m.description || "", audience: m.audience || null, chapters: m.chapters.length, views: views, path: where + "/index.html", next: m.next || null,
      domain: m.domain || null, level: m.level || null, tags: Array.isArray(m.tags) ? m.tags : [], minutes: mins, created: m.created || null, updated: m.updated || m.created || null,
      objectives: Array.isArray(m.objectives) ? m.objectives.length : 0, glossary: Array.isArray(m.glossary) ? m.glossary.length : 0,
      highlights: m.chapters.length && m.chapters[0].view === "nthview-highlights" ? where + "/chapters/" + m.chapters[0].file + ".html" : null });
  });
}

if (errors.length) {
  errors.forEach(function (e) { console.error("error    " + e); });
  console.error("invalid: " + errors.length + " structure error(s); registry.js not written");
  process.exit(1);
}

var out = "// Generated by scripts/build-registry.js from each skills/<name>/SKILL.md. Do not edit by hand.\n" +
  "// Regenerate with: node scripts/build-registry.js\n" +
  "window.NthViewRegistry = " + JSON.stringify({ skills: skills, docs: docs, lessons: lessons }, null, 2) + ";\n";

var existing = fs.existsSync(registryPath) ? fs.readFileSync(registryPath, "utf8") : null;
if (check) {
  if (existing === out) { console.log("registry.js is up to date (" + skills.length + " skill(s))"); process.exit(0); }
  console.error("registry.js is stale; run: node scripts/build-registry.js");
  process.exit(1);
}
fs.writeFileSync(registryPath, out);
console.log("wrote registry.js with " + skills.length + " skill(s)" + (skills.length ? ": " + skills.map(function (s) { return s.name; }).join(", ") : "") + "; " + docs.length + " doc(s), " + lessons.length + " lesson(s)");
