import fs from "fs";
import path from "path";

const UA = "CakeSiteDemo/1.0";
const OUT = path.join(process.cwd(), "public", "cakes");

async function downloadUrl(url, name) {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`status ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error(`small ${buf.length}`);
  fs.writeFileSync(path.join(OUT, `${name}.jpg`), buf);
  console.log(`fixed ${name}.jpg (${buf.length} bytes)`);
}

await downloadUrl(
  "https://upload.wikimedia.org/wikipedia/commons/a/a8/Winter_Wedding_Cake.jpg",
  "ready-6",
);
await downloadUrl(
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Wedding_tableau%2C_Sydney%2C_Australia.jpg/1200px-Wedding_tableau%2C_Sydney%2C_Australia.jpg",
  "decor-4",
);
