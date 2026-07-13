import fs from "fs";
import path from "path";

const UA = "CakeSiteDemo/1.0 (educational portfolio demo)";
const OUT_DIR = path.join(process.cwd(), "public", "cakes");

const url =
  `https://commons.wikimedia.org/w/api.php?action=query&format=json` +
  `&generator=search&gsrsearch=${encodeURIComponent("cream cake raspberries")}` +
  `&gsrnamespace=6&gsrlimit=40&prop=imageinfo&iiprop=url|mime|size&iiurlwidth=900`;

const res = await fetch(url, { headers: { "User-Agent": UA } });
const data = await res.json();
const urls = Object.values(data?.query?.pages || {})
  .map((p) => p.imageinfo?.[0])
  .filter((i) => i && /jpe?g$/i.test(i.mime || ""))
  .filter((i) => (i.width || 0) >= 1200)
  .map((i) => i.thumburl || i.url);

for (const u of urls) {
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  if (!r.ok) {
    await new Promise((x) => setTimeout(x, 2500));
    continue;
  }
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 8000) continue;
  fs.writeFileSync(path.join(OUT_DIR, "portfolio-3.jpg"), buf);
  console.log(`OK portfolio-3.jpg (${Math.round(buf.length / 1024)} KB)`);
  break;
}
