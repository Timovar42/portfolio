import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAKES_DIR = path.resolve(__dirname, "..", "public", "cakes");
const OUT_FILE = path.resolve(__dirname, "..", "src", "lib", "data", "cake-images.ts");

function detectMime(filePath) {
  const buf = fs.readFileSync(filePath);
  if (buf[0] === 0xff && buf[1] === 0xd8) return "image/jpeg";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "image/png";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "image/gif";
  if (buf[8] === 0x57 && buf[9] === 0x45) return "image/webp";
  return "image/jpeg";
}

if (!fs.existsSync(CAKES_DIR)) {
  console.error("Missing public/cakes/");
  process.exit(1);
}

const entries = fs
  .readdirSync(CAKES_DIR)
  .filter((f) => /\.(jpe?g|png|webp|gif)$/i.test(f))
  .sort((a, b) => a.localeCompare(b, "en"));

const map = {};
for (const file of entries) {
  const full = path.join(CAKES_DIR, file);
  const mime = detectMime(full);
  map[file] = `data:${mime};base64,${fs.readFileSync(full).toString("base64")}`;
}

const body = `/* Автогенерация: scripts/generate-cake-images.mjs — не редактировать вручную */
export const CAKE_IMAGE_DATA: Record<string, string> = ${JSON.stringify(map, null, 2)} as const;

export function resolveCakeImage(src: string): string {
  if (!src) return src;
  if (/^(data:|https?:|blob:)/i.test(src)) return src;
  const file = src.replace(/^\\/cakes\\//, "").replace(/^\\/+/, "");
  return CAKE_IMAGE_DATA[file] ?? src;
}
`;

fs.writeFileSync(OUT_FILE, body);
console.log(`Generated ${OUT_FILE} (${entries.length} images)`);
