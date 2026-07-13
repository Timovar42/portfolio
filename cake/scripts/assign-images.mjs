import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const CAKES = path.join(ROOT, "public", "cakes");

const mapping = {
  "portfolio-1": "cakes/decor-1.jpg",
  "portfolio-2": "candidates/c40_chocolate_gateau.jpg",
  "portfolio-3": "candidates/c41_cream_layer_cake.jpg",
  "portfolio-4": "candidates/c21_opera_cake.jpg",
  "portfolio-5": "candidates/c05_cheesecake_slice.jpg",
  "portfolio-6": "candidates/c39_chocolate_gateau.jpg",
  "portfolio-7": "candidates/c35_black_forest_cake.jpg",
  "portfolio-8": "cakes/decor-3.jpg",
  "portfolio-9": "candidates/c18_sachertorte.jpg",
  "portfolio-11": "cakes/ready-2.jpg",
  "portfolio-12": "cakes/decor-5.jpg",
  "portfolio-14": "candidates/c15_mousse_cake.jpg",
  "portfolio-15": "candidates/c03_tiramisu.jpg",
  "portfolio-16": "candidates/c01_chocolate_mirror_glaze_cake.jpg",
  "decor-2": "candidates/c41_cream_layer_cake.jpg",
  "decor-4": "candidates/c21_opera_cake.jpg",
  "decor-5": "cakes/portfolio-13.jpg",
  "ready-1": "candidates/c18_sachertorte.jpg",
  "ready-2": "candidates/c15_mousse_cake.jpg",
  "ready-3": "candidates/c03_tiramisu.jpg",
  "ready-4": "candidates/c39_chocolate_gateau.jpg",
  "ready-5": "candidates/c40_chocolate_gateau.jpg",
  "ready-6": "candidates/c02_tiramisu.jpg",
};

for (const [dest, src] of Object.entries(mapping)) {
  const from = path.join(ROOT, "public", src);
  const to = path.join(CAKES, `${dest}.jpg`);
  if (!fs.existsSync(from)) {
    console.log(`SKIP ${dest}: missing ${src}`);
    continue;
  }
  fs.copyFileSync(from, to);
  console.log(`OK ${dest}.jpg <- ${src}`);
}

console.log("\nDone.");
