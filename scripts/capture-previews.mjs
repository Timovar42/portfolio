import { createRequire } from "node:module";
import path from "node:path";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const puppeteer = require(
  path.join(fileURLToPath(new URL(".", import.meta.url)), "../../тортики/node_modules/puppeteer"),
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "images", "previews");

const sites = [
  { name: "barbie", file: "barbie/index.html", width: 1440, height: 820 },
  { name: "lawyer", file: "lawyer/index.html", width: 1280, height: 760 },
  { name: "cake", file: "cake/out/index.html", width: 1280, height: 760 },
];

function fileUrl(relPath) {
  return `file:///${path.join(root, relPath).replace(/\\/g, "/")}`;
}

await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--allow-file-access-from-files", "--disable-web-security"],
});

for (const site of sites) {
  const page = await browser.newPage();
  await page.setViewport({
    width: site.width,
    height: site.height,
    deviceScaleFactor: 2,
  });

  console.log(`Capturing ${site.name}…`);
  await page.goto(fileUrl(site.file), {
    waitUntil: "networkidle0",
    timeout: 90000,
  });
  await page.evaluate(() => document.fonts.ready);
  await new Promise((r) => setTimeout(r, 2000));

  const outFile = path.join(outDir, `${site.name}.jpg`);
  await page.screenshot({
    path: outFile,
    type: "jpeg",
    quality: 90,
    clip: {
      x: 0,
      y: 0,
      width: site.width,
      height: Math.min(site.height, 680),
    },
  });

  console.log(`  ✓ ${outFile}`);
  await page.close();
}

await browser.close();
console.log("Done.");
