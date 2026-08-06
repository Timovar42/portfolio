import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const puppeteer = require(path.join(root, "../тортики/node_modules/puppeteer"));
const fileUrl = `file:///${path.join(root, "index.html").replace(/\\/g, "/")}`;

const widths = [320, 360, 390, 768, 1024, 1440, 1920];
const browser = await puppeteer.launch({ headless: true, args: ["--allow-file-access-from-files"] });

for (const w of widths) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: 900 });
  await page.goto(fileUrl, { waitUntil: "networkidle0" });
  await page.evaluate(() => {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
  });
  await new Promise((r) => setTimeout(r, 1900));
  const info = await page.evaluate(() => {
    const cs = (el) => (el ? getComputedStyle(el) : null);
    const head = document.querySelector("#projects .section-head");
    const inner = document.querySelector("#projects .section-inner");
    const sec = document.querySelector("#services");
    const padX = getComputedStyle(document.documentElement).getPropertyValue("--pad-x");
    return {
      padX: padX.trim(),
      headMarginLeft: cs(head).marginLeft,
      headWidth: cs(head).width,
      headLeft: Math.round(head.getBoundingClientRect().left),
      headPad: cs(head).paddingLeft + " / " + cs(head).paddingRight,
      innerLeft: Math.round(inner.getBoundingClientRect().left),
      secPad: cs(sec).paddingLeft + " / " + cs(sec).paddingRight,
      navMenuBg: cs(document.querySelector(".nav-menu")).backgroundColor,
    };
  });
  console.log(w, JSON.stringify(info));
  await page.close();
}
await browser.close();
