import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const assetsDir = path.resolve(
  os.homedir(),
  ".cursor",
  "projects",
  "c-Users-Desktop-portfolio",
  "assets"
);
const outDir = path.resolve(projectRoot, "public", "cakes");

const TARGETS = [
  ...Array.from({ length: 16 }, (_, i) => `portfolio-${i + 1}.jpg`),
  ...Array.from({ length: 5 }, (_, i) => `decor-${i + 1}.jpg`),
  ...Array.from({ length: 6 }, (_, i) => `ready-${i + 1}.jpg`),
];

const WEDDING_SLOTS = new Set([
  "portfolio-1.jpg",
  "portfolio-13.jpg",
  "decor-1.jpg",
]);

function pickSources(dir) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
  const ordered = [];

  for (let n = 1; n <= 10; n += 1) {
    const match = files.find((f) => f.includes(`images__${n}_-`));
    if (match) ordered.push(path.join(dir, match));
  }

  const extra = files.find((f) => f.includes("images-a6a4c7d0"));
  if (extra) ordered.push(path.join(dir, extra));

  return ordered;
}

function pickWeddingSource(dir, sources) {
  const files = fs.readdirSync(dir);
  // Новое свадебное фото (двухъярусный торт с вафельными лепестками)
  const newWedding = files.find(
    (f) => f.includes("9c863ef0") && f.endsWith(".png")
  );
  if (newWedding) return path.join(dir, newWedding);
  const match = files.find(
    (f) => f.includes("images__10_-") && f.endsWith(".png")
  );
  if (match) return path.join(dir, match);
  return sources[0];
}

const sources = pickSources(assetsDir);
if (sources.length === 0) {
  console.error("Не найдены PNG в:", assetsDir);
  process.exit(1);
}

const weddingSource = pickWeddingSource(assetsDir, sources);

fs.mkdirSync(outDir, { recursive: true });

TARGETS.forEach((name, index) => {
  const src = WEDDING_SLOTS.has(name)
    ? weddingSource
    : sources[index % sources.length];
  const dest = path.join(outDir, name);
  fs.copyFileSync(src, dest);
  console.log(`${name} ← ${path.basename(src)}`);
});

console.log(`\nГотово: ${TARGETS.length} файлов из ${sources.length} исходников.`);
