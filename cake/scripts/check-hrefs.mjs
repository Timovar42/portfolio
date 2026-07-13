import fs from "fs";

for (const file of ["out/index.html", "out/catalog/index.html"]) {
  const h = fs.readFileSync(file, "utf8");
  const hrefs = [...h.matchAll(/href="([^"]+)"/g)]
    .map((x) => x[1])
    .filter((x) => !x.startsWith("http") && !x.startsWith("tel") && !x.startsWith("#") && !x.includes("_next") && !x.includes(".jpg") && !x.includes(".css"));
  console.log("\n=== " + file + " ===");
  console.log([...new Set(hrefs)].join("\n"));
  console.log("nav script:", h.includes("static-export-nav"));
}
