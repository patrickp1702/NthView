#!/usr/bin/env node
/* NthView — standalone HTML assembler
 *
 * Builds the one-file output exactly as AGENTS.md §6 prescribes: the view's
 * CDN library tags (from NthView.libs), the JSON with "<" escaped as \u003c,
 * validate.js and view.js inlined verbatim, and the bootstrap call.
 *
 * Usage:
 *   node scripts/build-html.js <view-dir> <data.json> <out.html>
 *   node scripts/build-html.js <view-dir> --example <out.html>   # data from references/schema.md
 *
 * The data is validated first; the file is not written when it is invalid.
 * Exit codes: 0 ok, 1 invalid data or missing file, 2 usage error.
 */
"use strict";
var fs = require("fs");
var path = require("path");

var viewDir = process.argv[2], dataArg = process.argv[3], outPath = process.argv[4];
if (!viewDir || !dataArg || !outPath) {
  console.error("usage: node scripts/build-html.js <view-dir> <data.json|--example> <out.html>");
  process.exit(2);
}
viewDir = path.resolve(viewDir);
var viewName = path.basename(viewDir);
var files = {
  validate: path.join(viewDir, "scripts", "validate.js"),
  view: path.join(viewDir, "assets", "view.js"),
  schema: path.join(viewDir, "references", "schema.md")
};
[files.validate, files.view].forEach(function (f) {
  if (!fs.existsSync(f)) { console.error("missing " + path.relative(process.cwd(), f)); process.exit(1); }
});

var rawJson;
if (dataArg === "--example") {
  var md = fs.readFileSync(files.schema, "utf8");
  var idx = md.indexOf("## Complete example");
  var m = idx !== -1 && md.slice(idx).match(/```json\r?\n([\s\S]*?)\r?\n```/);
  if (!m) { console.error("no ```json block under '## Complete example' in " + path.relative(process.cwd(), files.schema)); process.exit(1); }
  rawJson = m[1];
} else {
  rawJson = fs.readFileSync(path.resolve(dataArg), "utf8");
}
var data;
try { data = JSON.parse(rawJson); }
catch (e) { console.error("$: could not parse JSON (" + e.message + ")"); process.exit(1); }

// Load the view's scripts in Node to validate and to read NthView.libs.
var validateApi = require(files.validate);
var result = validateApi.validate(data);
result.errors.forEach(function (e) { console.error("error    " + e.path + ": " + e.message); });
result.warnings.forEach(function (w) { console.error("warning  " + w.path + ": " + w.message); });
if (!result.valid) { console.error("invalid: " + result.errors.length + " error(s); HTML not written"); process.exit(1); }

global.window = global;
require(files.view);
var libs = (global.NthView && global.NthView.libs) || [];
var libTags = libs.map(function (l) {
  if (l.kind === "style") return '  <link rel="stylesheet" href="' + l.href + '">';
  return '  <script src="' + l.src + '"></script>';
}).join("\n");

var json = JSON.stringify(data, null, 2).replace(/</g, "\\u003c");
var validateSrc = fs.readFileSync(files.validate, "utf8").replace(/\s+$/, "");
var viewSrc = fs.readFileSync(files.view, "utf8").replace(/\s+$/, "");
var title = String(data.title || viewName).replace(/[<>&]/g, "");

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
  libTags,
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
  "</body>",
  "</html>",
  ""
].filter(function (line) { return line !== null; }).join("\n");

fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
fs.writeFileSync(path.resolve(outPath), html);
console.log("wrote " + path.relative(process.cwd(), path.resolve(outPath)) + " (" + html.length + " bytes, " + libs.length + " CDN librar" + (libs.length === 1 ? "y" : "ies") + ")");
