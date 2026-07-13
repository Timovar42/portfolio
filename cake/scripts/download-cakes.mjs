import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public", "cakes");
fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = "CakeSiteDemo/1.0 (educational portfolio demo)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Профессиональные студийные запросы (ярусные, мастика, подтёки, патиссери)
async function searchCommons(query, limit = 40) {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&format=json` +
    `&generator=search&gsrsearch=${encodeURIComponent(query)}` +
    `&gsrnamespace=6&gsrlimit=${limit}` +
    `&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=900`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`search status ${res.status}`);
  const data = await res.json();
  const pages = Object.values(data?.query?.pages || {});
  return pages
    .map((p) => p.imageinfo?.[0])
    .filter((i) => i && /jpe?g$/i.test(i.mime || ""))
    // только крупные снимки (профессиональные), ширина >= 1200
    .filter((i) => (i.width || 0) >= 1200 && (i.height || 0) >= 800)
    .map((i) => i.thumburl || i.url);
}

async function downloadImage(url, dest, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (res.status === 429 && attempt < 5) {
    await sleep(2000 * (attempt + 1));
    return downloadImage(url, dest, attempt + 1);
  }
  if (!res.ok) throw new Error(`status ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error(`too small ${buf.length}`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

// Каждой позиции — свой профессиональный запрос, чтобы фото подходило под название
const plan = [
  // ПОРТФОЛИО
  { name: "portfolio-1", queries: ["wedding cake buttercream", "tiered wedding cake"] },
  { name: "portfolio-2", queries: ["chocolate drip cake", "chocolate ganache cake"] },
  { name: "portfolio-3", queries: ["naked cake berries", "semi naked cake"] },
  { name: "portfolio-4", queries: ["raspberry layer cake", "berry cream cake"] },
  { name: "portfolio-5", queries: ["strawberry cream cake", "fruit cream cake"] },
  { name: "portfolio-6", queries: ["chocolate fondant cake", "chocolate celebration cake"] },
  { name: "portfolio-7", queries: ["fruit gateau", "fresh fruit cake"] },
  { name: "portfolio-8", queries: ["fondant novelty cake", "character fondant cake"] },
  { name: "portfolio-9", queries: ["mont blanc cake", "chestnut cream cake"] },
  { name: "portfolio-10", queries: ["birthday fondant cake blue", "themed birthday cake"] },
  { name: "portfolio-11", queries: ["fondant rose cake", "pink fondant cake"] },
  { name: "portfolio-12", queries: ["chocolate tart", "chocolate glaze cake"] },
  { name: "portfolio-13", queries: ["buttercream flower cake", "floral celebration cake"] },
  { name: "portfolio-14", queries: ["white buttercream cake", "elegant white cake"] },
  { name: "portfolio-15", queries: ["gourmet cupcakes", "decorated cupcakes"] },
  { name: "portfolio-16", queries: ["chocolate mirror glaze cake", "glossy chocolate cake"] },
  // ДЕКОР
  { name: "decor-1", queries: ["tiered wedding cake flowers", "multi tier wedding cake"] },
  { name: "decor-2", queries: ["bundt cake", "pound cake powdered sugar"] },
  { name: "decor-3", queries: ["teddy bear cake fondant", "kids fondant cake"] },
  { name: "decor-4", queries: ["novelty themed cake", "custom decorated cake"] },
  { name: "decor-5", queries: ["fruit decorated cake", "fruit topped cake"] },
  // ГОТОВЫЕ
  { name: "ready-1", queries: ["german chocolate cake", "coconut pecan cake"] },
  { name: "ready-2", queries: ["chocolate rose cake", "chocolate truffle cake"] },
  { name: "ready-3", queries: ["swiss roll cake", "cream roll cake"] },
  { name: "ready-4", queries: ["assorted cake slices", "patisserie slices"] },
  { name: "ready-5", queries: ["chocolate brownie", "fudge brownie"] },
  { name: "ready-6", queries: ["tiramisu", "tiramisu slice"] },
];

// Кэш результатов поиска по запросу
const searchCache = new Map();
const usedUrls = new Set();

async function getUrlsFor(queries) {
  for (const q of queries) {
    if (!searchCache.has(q)) {
      try {
        const urls = await searchCommons(q);
        searchCache.set(q, urls);
        await sleep(400);
      } catch (e) {
        searchCache.set(q, []);
        console.log(`  search "${q}" failed: ${e.message}`);
      }
    }
    const fresh = searchCache.get(q).filter((u) => !usedUrls.has(u));
    if (fresh.length > 0) return fresh;
  }
  return [];
}

let ok = 0;
for (const item of plan) {
  const urls = await getUrlsFor(item.queries);
  let done = false;
  for (const url of urls) {
    try {
      const size = await downloadImage(url, path.join(OUT_DIR, `${item.name}.jpg`));
      usedUrls.add(url);
      ok += 1;
      done = true;
      console.log(`OK ${item.name}.jpg (${Math.round(size / 1024)} KB)`);
      break;
    } catch (e) {
      // пробуем следующий url
    }
  }
  if (!done) console.log(`FAIL ${item.name}: no usable image`);
  await sleep(1000);
}

console.log(`\nDownloaded ${ok}/${plan.length} professional images.`);
