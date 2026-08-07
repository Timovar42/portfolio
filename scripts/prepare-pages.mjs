import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, "_site");

const rootFiles = ["index.html", "favicon.svg", "robots.txt", "sitemap.xml", ".nojekyll"];
const rootDirs = ["images", "fonts", "barbie"];

function copy(from, to) {
  const stat = fs.statSync(from);
  if (stat.isDirectory()) {
    fs.mkdirSync(to, { recursive: true });
    for (const name of fs.readdirSync(from)) {
      copy(path.join(from, name), path.join(to, name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
}

try {
  fs.rmSync(out, { recursive: true, force: true });
  fs.mkdirSync(out, { recursive: true });

  for (const file of rootFiles) {
    const src = path.join(root, file);
    if (fs.existsSync(src)) copy(src, path.join(out, file));
  }

  for (const dir of rootDirs) {
    const src = path.join(root, dir);
    if (fs.existsSync(src)) copy(src, path.join(out, dir));
  }

  copy(path.join(root, "cake/out"), path.join(out, "cake/out"));

  for (const part of ["index.html", "css", "js"]) {
    const src = path.join(root, "lawyer", part);
    if (fs.existsSync(src)) copy(src, path.join(out, "lawyer", part));
  }

  if (!fs.existsSync(path.join(out, ".nojekyll"))) {
    fs.writeFileSync(path.join(out, ".nojekyll"), "");
  }

  console.log("Prepared _site");
} catch (error) {
  console.error(error);
  process.exit(1);
}
