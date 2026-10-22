#!/usr/bin/env node
/* NthView — standalone HTML assembler
 *
 * Builds the one-file output exactly as AGENTS.md §6 prescribes: the view's
 * CDN library tags (from NthView.libs), the JSON with "<" escaped as <,
 * validate.js and view.js inlined verbatim, and the bootstrap call. An
 * optional extra block (the lesson bar, see scripts/build-lesson.js) may be
 * appended after the bootstrap script.
 *
 * Usage:
 *   node scripts/build-html.js <view-dir> <data.json> <out.html>
 *   node scripts/build-html.js <view-dir> --example <out.html>   # data from references/schema.md
 *
 * As a module: require("./build-html.js").assemble(viewDir, data, { extraBody })
 * returns { html, errors, warnings, libs }.
 *
 * The data is validated first; the file is not written when it is invalid.
 * Exit codes: 0 ok, 1 invalid data or missing file, 2 usage error.
 */
"use strict";
var fs = require("fs");
var path = require("path");

function loadView(viewDir) {
  viewDir = path.resolve(viewDir);
  var files = {
    validate: path.join(viewDir, "scripts", "validate.js"),
    view: path.join(viewDir, "assets", "view.js"),
    schema: path.join(viewDir, "references", "schema.md")
  };
  [files.validate, files.view].forEach(function (f) {
    if (!fs.existsSync(f)) throw new Error("missing " + path.relative(process.cwd(), f));
  });
  return { dir: viewDir, name: path.basename(viewDir), files: files };
}

function exampleJson(view) {
  var md = fs.readFileSync(view.files.schema, "utf8");
  var idx = md.indexOf("## Complete example");
  var m = idx !== -1 && md.slice(idx).match(/```json\r?\n([\s\S]*?)\r?\n```/);
  if (!m) throw new Error("no ```json block under '## Complete example' in " + path.relative(process.cwd(), view.files.schema));
  return m[1];
}

/* Load the view's scripts in Node, validate, and read NthView.libs. */
function assemble(viewDir, data, opts) {
  opts = opts || {};
  var view = typeof viewDir === "string" ? loadView(viewDir) : viewDir;
  var validateApi = require(view.files.validate);
  var result = validateApi.validate(data);
  if (!result.valid) return { html: null, errors: result.errors, warnings: result.warnings, libs: [] };

  global.window = global;
  delete require.cache[require.resolve(view.files.view)];
  global.NthView = { validate: validateApi.validate };
  require(view.files.view);
  var libs = (global.NthView && global.NthView.libs) || [];
  var libTags = libs.map(function (l) {
    if (l.kind === "style") return '  <link rel="stylesheet" href="' + l.href + '">';
    return '  <script src="' + l.src + '"></script>';
  }).join("\n");

  var json = JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
  var validateSrc = fs.readFileSync(view.files.validate, "utf8").replace(/\s+$/, "");
  var viewSrc = fs.readFileSync(view.files.view, "utf8").replace(/\s+$/, "");
  var title = String(data.title || view.name).replace(/[<>&]/g, "");

  var html = [
    "<!doctype html>",
    '<html lang="en">',
    "<head>",
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <meta name="color-scheme" content="light dark">',
    "  <title>" + title + " — NthView</title>",
    "</head>",
    "<body>",
    '  <div id="app"></div>',
    "",
    libTags || null,
    libTags ? "" : null,
    '  <script type="application/json" id="nthview-data">',
    json,
    "  </script>",
    "",
    "  <script>",
    validateSrc,
    "  </script>",
    "  <script>",
    viewSrc,
    "  </script>",
    "  <script>",
    "    (function () {",
    '      var data = JSON.parse(document.getElementById("nthview-data").textContent);',
    '      NthView.build(document.getElementById("app"), data);',
    "    })();",
    "  </script>",
    opts.extraBody || null,
    "</body>",
    "</html>",
    ""
  ].filter(function (line) { return line !== null; }).join("\n");

  return { html: html, errors: [], warnings: result.warnings, libs: libs };
}

module.exports = { assemble: assemble, loadView: loadView, exampleJson: exampleJson };

if (require.main === module) {
  var viewArg = process.argv[2], dataArg = process.argv[3], outPath = process.argv[4];
  if (!viewArg || !dataArg || !outPath) {
    console.error("usage: node scripts/build-html.js <view-dir> <data.json|--example> <out.html>");
    process.exit(2);
  }
  var view;
  try { view = loadView(viewArg); } catch (e) { console.error(e.message); process.exit(1); }
  var rawJson;
  try { rawJson = dataArg === "--example" ? exampleJson(view) : fs.readFileSync(path.resolve(dataArg), "utf8"); }
  catch (e) { console.error(e.message); process.exit(1); }
  var data;
  try { data = JSON.parse(rawJson); }
  catch (e) { console.error("$: could not parse JSON (" + e.message + ")"); process.exit(1); }

  var out = assemble(view, data);
  out.errors.forEach(function (e) { console.error("error    " + e.path + ": " + e.message); });
  out.warnings.forEach(function (w) { console.error("warning  " + w.path + ": " + w.message); });
  if (!out.html) { console.error("invalid: " + out.errors.length + " error(s); HTML not written"); process.exit(1); }
  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(path.resolve(outPath), out.html);
  console.log("wrote " + path.relative(process.cwd(), path.resolve(outPath)) + " (" + out.html.length + " bytes, " + out.libs.length + " CDN librar" + (out.libs.length === 1 ? "y" : "ies") + ")");
}
