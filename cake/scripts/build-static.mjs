import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const apiPath = path.join("src", "app", "api");
const backupPath = path.join("src", "app", "_api_export_backup");
let apiMoved = false;

try {
  if (fs.existsSync(apiPath)) {
    fs.renameSync(apiPath, backupPath);
    apiMoved = true;
  }

  execSync("npm run build", {
    stdio: "inherit",
    env: { ...process.env, STATIC_EXPORT: "1" },
  });

  execSync("node scripts/fix-static-paths.mjs", { stdio: "inherit" });
  console.log("\nStatic export ready: out/index.html");
} finally {
  if (apiMoved && fs.existsSync(backupPath)) {
    fs.renameSync(backupPath, apiPath);
  }
}
