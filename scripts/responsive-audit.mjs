import { createRequire } from "node:module";
import path from "node:path";
import { mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const puppeteer = require(path.join(root, "../тортики/node_modules/puppeteer"));

const tag = process.argv[2] || "before";
const outDir = path.join(root, ".audit", tag);

const viewports = [
  { name: "320", width: 320, height: 640 },
  { name: "360", width: 360, height: 740 },
  { name: "390", width: 390, height: 844 },
  { name: "430", width: 430, height: 932 },
  { name: "landscape-844", width: 844, height: 390 },
  { name: "768", width: 768, height: 1024 },
  { name: "834", width: 834, height: 1112 },
  { name: "1024", width: 1024, height: 768 },
  { name: "1280", width: 1280, height: 800 },
  { name: "1440", width: 1440, height: 900 },
  { name: "1920", width: 1920, height: 1080 },
];

const anchors = [
  { name: "1-hero", selector: "#hero" },
  { name: "2-projects", selector: "#projects" },
  { name: "3-services", selector: "#services .services-intro" },
  { name: "4-pills-bots", selector: ".services-pills-group--bots" },
  { name: "5-workflow", selector: ".services-info-block--workflow" },
  { name: "6-tools", selector: ".services-info-block:not(.services-info-block--workflow)" },
  { name: "7-reviews", selector: "#reviews" },
  { name: "8-contact", selector: "#contact" },
  { name: "9-footer", selector: ".footer" },
];

const fileUrl = `file:///${path.join(root, "index.html").replace(/\\/g, "/")}`;

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  args: ["--allow-file-access-from-files", "--disable-web-security"],
});

for (const vp of viewports) {
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });
  await page.goto(fileUrl, { waitUntil: "networkidle0", timeout: 90000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    // подарок прячем на скринах — иначе перекрывает контент случайной позицией
    const gift = document.getElementById("gift-surprise");
    if (gift) {
      gift.remove();
    }
    const flyer = document.getElementById("discount-flyer");
    if (flyer) flyer.remove();
  });
  // reveal-переходы длятся до 1600ms — иначе замеры попадают в середину анимации
  await new Promise((r) => setTimeout(r, 1900));

  const overflow = await page.evaluate(() => {
    const docW = document.documentElement.clientWidth;
    const bad = [];
    document.querySelectorAll("body *").forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.visibility === "hidden" || cs.display === "none") return;
      if (el.closest("[aria-hidden='true']")) return;
      if (r.right > docW + 1 || r.left < -1) {
        bad.push(
          `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ").slice(0, 2).join(".")} left=${Math.round(r.left)} right=${Math.round(r.right)}`,
        );
      }
    });
    return {
      scrollW: document.documentElement.scrollWidth,
      clientW: docW,
      bad: bad.slice(0, 12),
    };
  });
  console.log(`\n=== ${vp.name} (${vp.width}x${vp.height}) scrollW=${overflow.scrollW} clientW=${overflow.clientW}`);
  overflow.bad.forEach((b) => console.log("   overflow:", b));

  for (const a of anchors) {
    const ok = await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return false;
      const top = el.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo(0, Math.max(0, top));
      return true;
    }, a.selector);
    if (!ok) continue;
    await new Promise((r) => setTimeout(r, 250));
    await page.screenshot({
      path: path.join(outDir, `${vp.name}_${a.name}.jpg`),
      type: "jpeg",
      quality: 78,
    });
  }
  if (vp.width <= 767) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.click("#nav-burger");
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(outDir, `${vp.name}_0-menu.jpg`),
      type: "jpeg",
      quality: 78,
    });
  }

  await page.close();
}

await browser.close();
console.log("\nDone ->", outDir);
