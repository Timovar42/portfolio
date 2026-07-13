import fs from "fs";
import path from "path";

const OUT_DIR = path.join(process.cwd(), "public", "cakes");
const UA = "CakeSiteDemo/1.0 (educational portfolio demo)";

/** 27 уникальных минималистичных тортов — Unsplash (чистый фон, лаконичный стиль). */
const PLAN = [
  { name: "portfolio-1", id: "cEdWE3XTGO0" },
  { name: "portfolio-2", id: "1588195538326-c5b1e9f80a1b" },
  { name: "portfolio-3", id: "Vz_jee7g9cU" },
  { name: "portfolio-4", id: "1621303837174-89787a7d4729" },
  { name: "portfolio-5", id: "1602351447937-745cb720612f" },
  { name: "portfolio-6", id: "GOCErfl1ufM" },
  { name: "portfolio-7", id: "1571115177098-24ec42ed204d" },
  { name: "portfolio-8", id: "1606983340126-99ab4feaa64a" },
  { name: "portfolio-9", id: "1558301211-0d8c8ddee6ec" },
  { name: "portfolio-10", id: "4_jhDO54BYg" },
  { name: "portfolio-11", id: "KMn4VEeEPR8" },
  { name: "portfolio-12", id: "1517427294546-5aa121f68e8a" },
  { name: "portfolio-13", id: "1606890737304-57a1ca8a5b62" },
  { name: "portfolio-14", id: "1562440499-64c9a111f713" },
  { name: "portfolio-15", id: "6jHpcBPw7i8" },
  { name: "portfolio-16", id: "S2jw81lfrG0" },
  { name: "decor-1", id: "1508737804141-4c3b688e2546" },
  { name: "decor-2", id: "1512223792601-592a9809eed4" },
  { name: "decor-3", id: "1563729784474-d77dbb933a9e" },
  { name: "decor-4", id: "1486427944299-d1955d23e34d" },
  { name: "decor-5", id: "1551024506-0bccd828d307" },
  { name: "ready-1", id: "1578985545062-69928b1d9587" },
  { name: "ready-2", id: "1557925923-cd4648e211a0" },
  { name: "ready-3", id: "1488477181946-6428a0291777" },
  { name: "ready-4", id: "1558618666-fcd25c85cd64" },
  { name: "ready-5", id: "LRIQuZyxKRM" },
  { name: "ready-6", id: "pGM4sjt_BdQ" },
];

async function resolveUrl(id) {
  if (id.includes("-") && id.length > 15) {
    return `https://images.unsplash.com/photo-${id}?w=1400&q=85&auto=format&fit=crop`;
  }
  const res = await fetch(`https://unsplash.com/photos/${id}`, {
    headers: { "User-Agent": UA },
  });
  if (!res.ok) throw new Error(`slug ${id} ${res.status}`);
  const html = await res.text();
  const match = html.match(
    /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+\?[^"'\s]+/,
  );
  if (!match) throw new Error(`no image for ${id}`);
  const base = match[0].replace(/\\u0026/g, "&").replace(/&amp;/g, "&");
  return base.split("&w=")[0] + "&w=1400&q=85&auto=format&fit=crop";
}

async function download(url, dest) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`status ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 12000) throw new Error(`small ${buf.length}`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

fs.mkdirSync(OUT_DIR, { recursive: true });

let ok = 0;
for (const item of PLAN) {
  try {
    const url = await resolveUrl(item.id);
    const size = await download(url, path.join(OUT_DIR, `${item.name}.jpg`));
    ok += 1;
    console.log(`OK ${item.name}.jpg ← ${item.id} (${Math.round(size / 1024)} KB)`);
  } catch (e) {
    console.log(`FAIL ${item.name}: ${e.message}`);
  }
  await new Promise((r) => setTimeout(r, 400));
}

console.log(`\nDone: ${ok}/${PLAN.length}`);
