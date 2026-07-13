import fs from "fs";
import path from "path";

const OUT_DIR = path.resolve("out");

const FALLBACK_SCRIPT = `<script id="static-export-fallback">(function(){document.querySelectorAll(".bento-reveal").forEach(function(el){el.classList.add("is-visible")});})();</script>`;

const NAV_FIX_SCRIPT = `<script id="static-export-nav">document.addEventListener("click",function(e){var a=e.target.closest("a[href]");if(!a||a.target==="_blank"||a.hasAttribute("download"))return;var href=a.getAttribute("href");if(!href||/^(https?:|mailto:|tel:|#)/.test(href))return;e.preventDefault();e.stopImmediatePropagation();window.location.href=a.href;},true);</script>`;

const CONSTRUCTOR_SCRIPT = `<script src="../constructor.js" defer></script>`;

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(html|js|css|json|txt)$/.test(entry.name)) files.push(full);
  }
  return files;
}

function nextPrefix(filePath) {
  const fromDir = path.dirname(filePath);
  const nextDir = path.join(OUT_DIR, "_next");
  let rel = path.relative(fromDir, nextDir).replace(/\\/g, "/");
  if (rel === "") rel = ".";
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel.endsWith("/") ? rel : `${rel}/`;
}

function rootPrefix(filePath) {
  const relDir = path.relative(OUT_DIR, path.dirname(filePath));
  const depth = relDir === "" ? 0 : relDir.split(path.sep).length;
  return depth === 0 ? "./" : "../".repeat(depth);
}

/** file:// needs explicit index.html — ./catalog/ does not auto-resolve */
function normalizePageLinks(content) {
  let next = content.replace(/href="\.\/"/g, 'href="./index.html"');

  const depths = ["./", "../", "../../", "../../../"];
  const pages = ["catalog", "constructor", "admin", "order"];

  for (const depth of depths) {
    for (const page of pages) {
      next = next.replaceAll(
        `href="${depth}${page}/"`,
        `href="${depth}${page}/index.html"`,
      );
      next = next.replaceAll(
        `href="${depth}${page}/?`,
        `href="${depth}${page}/index.html?`,
      );
    }
  }

  next = next.replace(
    /href="((?:\.\.\/|\.\/)+catalog\/\d+\/order\/)(\?[^"]*)?"/g,
    (_, pagePath, query = "") => `href="${pagePath}index.html${query}"`,
  );

  next = next.replace(
    /href="((?:\.\.\/|\.\/)+order\/success\/)(\?[^"]*)?"/g,
    (_, pagePath, query = "") => `href="${pagePath}index.html${query}"`,
  );

  return next;
}

function fixContent(content, filePath) {
  const toNext = nextPrefix(filePath);
  const toRoot = rootPrefix(filePath);

  let next = content
    .replace(/"\/_next\//g, `"${toNext}`)
    .replace(/'\/_next\//g, `'${toNext}`);

  if (filePath.endsWith(".html")) {
    next = next
      .replace(/((?:href|src)=")\.\/_next\//g, `$1${toNext}`)
      .replace(/((?:href|src)=')\.\/_next\//g, `$1${toNext}`);
  }

  next = next
    .replace(/((?:href|src|action)=)"\/(?!\/)([^"]*)"/g, (_, attr, p) => {
      if (p.startsWith("_next/")) return `${attr}"${toNext}${p.slice(6)}"`;
      if (p === "") return `${attr}"${toRoot === "./" ? "./" : `${toRoot}index.html`}"`;
      return `${attr}"${toRoot}${p}"`;
    })
    .replace(/url\(\/(?!\/)([^)]+)\)/g, (_, p) => `url(${toRoot}${p})`);

  if (filePath.endsWith(".html")) {
    const wpPath = toNext;
    const publicPathScript = `<script>self.__webpack_public_path__="${wpPath}";</script>`;

    if (!next.includes("__webpack_public_path__")) {
      next = next.replace("<head>", `<head>${publicPathScript}`);
    }

    if (!next.includes("static-export-nav")) {
      next = next.replace("<head>", `<head>${NAV_FIX_SCRIPT}`);
    }

    if (!/<html[^>]*\bdata-asset-prefix=/i.test(next)) {
      next = next.replace(
        /<html([^>]*)>/i,
        `<html$1 data-asset-prefix="${toRoot}">`,
      );
    }

    next = normalizePageLinks(next);

    // ./cakes/ из SSR корректен только на главной — на вложенных страницах нужен ../cakes/
    if (toRoot !== "./") {
      next = next
        .replace(/((?:href|src)=)"\.\/cakes\//g, `$1"${toRoot}cakes/`)
        .replace(/url\(\.\/cakes\//g, `url(${toRoot}cakes/`);
    }

    if (!next.includes("static-export-fallback")) {
      next = next.replace("</body>", `${FALLBACK_SCRIPT}</body>`);
    }

    if (
      filePath.replace(/\\/g, "/").endsWith("/constructor/index.html") &&
      !next.includes("constructor.js")
    ) {
      next = next.replace("</body>", `${CONSTRUCTOR_SCRIPT}</body>`);
    }
  }

  if (filePath.endsWith(".css") && !next.includes("bento-reveal{opacity:1!important")) {
    next += `\n.bento-reveal{opacity:1!important;transform:none!important}\n`;
  }

  return next;
}

if (!fs.existsSync(OUT_DIR)) {
  console.error("Missing out/ — run npm run build:static first");
  process.exit(1);
}

const files = walk(OUT_DIR);
for (const file of files) {
  fs.writeFileSync(file, fixContent(fs.readFileSync(file, "utf8"), file));
}

console.log("Fixed static paths in", files.length, "files");
