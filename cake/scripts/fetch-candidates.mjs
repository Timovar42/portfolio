import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public", "candidates");
fs.mkdirSync(OUT_DIR, { recursive: true });

const UA = "CakeSiteDemo/1.0 (educational portfolio demo)";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function searchCommons(query, limit = 25) {
  const url =
    `https://commons.wikimedia.org/w/api.php?action=query&format=json` +
    `&generator=search&gsrsearch=${encodeURIComponent(query)}` +
    `&gsrnamespace=6&gsrlimit=${limit}` +
    `&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=900`;
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`search ${res.status}`);
  const data = await res.json();
  return Object.values(data?.query?.pages || {})
    .map((p) => p.imageinfo?.[0])
    .filter((i) => i && /jpe?g$/i.test(i.mime || ""))
    .filter((i) => (i.width || 0) >= 1300 && (i.height || 0) >= 900)
    // отсекаем портретные «снято на телефон» — берём ближе к ландшафту/квадрату
    .filter((i) => i.width / i.height >= 1.0)
    .map((i) => i.thumburl || i.url);
}

async function dl(url, dest, attempt = 0) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (res.status === 429 && attempt < 5) {
    await sleep(2000 * (attempt + 1));
    return dl(url, dest, attempt + 1);
  }
  if (!res.ok) throw new Error(`status ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 10000) throw new Error("small");
  fs.writeFileSync(dest, buf);
  return buf.length;
}

// студийные фуд-запросы (дают чистые кадры на однотонном фоне / тарелке)
const queries = [
  "chocolate mirror glaze cake",
  "tiramisu",
  "cheesecake slice",
  "chocolate cake slice plate",
  "fruit tart",
  "mousse cake",
  "sachertorte",
  "opera cake",
  "red velvet cake slice",
  "lemon meringue tart",
  "strawberry shortcake",
  "carrot cake slice",
  "black forest cake",
  "chocolate gateau",
  "cream layer cake",
  "berry cheesecake",
];

let idx = 0;
const used = new Set();
for (const q of queries) {
  let urls = [];
  try {
    urls = await searchCommons(q);
  } catch (e) {
    console.log(`search "${q}" failed: ${e.message}`);
  }
  let saved = 0;
  for (const url of urls) {
    if (used.has(url)) continue;
    if (saved >= 3) break;
    idx += 1;
    const slug = q.replace(/\s+/g, "_");
    const name = `c${String(idx).padStart(2, "0")}_${slug}.jpg`;
    try {
      const size = await dl(url, path.join(OUT_DIR, name));
      used.add(url);
      saved += 1;
      console.log(`OK ${name} (${Math.round(size / 1024)} KB)`);
    } catch {
      /* next */
    }
    await sleep(900);
  }
  await sleep(400);
}
console.log(`\nDone. ${idx} candidates in public/candidates/`);
