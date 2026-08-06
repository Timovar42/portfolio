import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execSync, spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const PORTS = [8080, 8090, 8091, 8092, 8093];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};

function getLocalIPv4() {
  const addresses = [];

  for (const [adapter, interfaces] of Object.entries(os.networkInterfaces())) {
    if (!interfaces) continue;
    for (const iface of interfaces) {
      if (iface.family === "IPv4" && !iface.internal) {
        addresses.push({ adapter, address: iface.address });
      }
    }
  }

  return addresses;
}

function getNetworkCategory() {
  if (process.platform !== "win32") return null;

  try {
    const output = execSync(
      "powershell -NoProfile -Command \"(Get-NetConnectionProfile | Select-Object -First 1).NetworkCategory\"",
      { encoding: "utf8" },
    ).trim();
    return output || null;
  } catch {
    return null;
  }
}

function killPort(port) {
  if (process.platform !== "win32") return;

  try {
    const output = execSync(`netstat -ano | findstr ":${port} "`, { encoding: "utf8" });
    const pids = new Set();

    for (const line of output.split(/\r?\n/)) {
      if (!line.includes("LISTENING")) continue;
      const pid = line.trim().split(/\s+/).pop();
      if (pid && pid !== "0") pids.add(pid);
    }

    for (const pid of pids) {
      spawnSync("taskkill", ["/F", "/PID", pid], { stdio: "ignore" });
    }
  } catch {
    // port is free
  }
}

function ensureFirewallRule(port) {
  if (process.platform !== "win32") return false;

  const ruleName = `Portfolio Mobile Preview ${port}`;
  spawnSync("netsh", [
    "advfirewall", "firewall", "delete", "rule", `name=${ruleName}`,
  ], { stdio: "ignore" });

  const add = spawnSync("netsh", [
    "advfirewall", "firewall", "add", "rule",
    `name=${ruleName}`,
    "dir=in",
    "action=allow",
    "protocol=TCP",
    `localport=${port}`,
    "profile=any",
    "enable=yes",
  ], { encoding: "utf8" });

  return add.status === 0;
}

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0].split("#")[0]);
  const relative = decoded === "/" ? "index.html" : decoded.replace(/^\/+/, "");
  const filePath = path.normalize(path.join(root, relative));
  if (!filePath.startsWith(root)) return null;
  return filePath;
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(error.code === "ENOENT" ? 404 : 500);
      res.end(error.code === "ENOENT" ? "Not found" : "Server error");
      return;
    }

    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    res.end(data);
  });
}

function openUrl(url) {
  if (process.platform === "win32") {
    spawn("cmd", ["/c", "start", "", url], { detached: true, stdio: "ignore" }).unref();
  }
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      cleanup();
      reject(error);
    };
    const onListening = () => {
      cleanup();
      resolve(port);
    };
    const cleanup = () => {
      server.off("error", onError);
      server.off("listening", onListening);
    };

    server.once("error", onError);
    server.once("listening", onListening);
    server.listen(port, "0.0.0.0");
  });
}

async function selfTest(port, ip) {
  const urls = [`http://127.0.0.1:${port}/`];
  if (ip) urls.push(`http://${ip}:${port}/`);

  for (const url of urls) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) return false;
    } catch {
      return false;
    }
  }

  return true;
}

async function start() {
  console.log("");
  console.log("  Portfolio - prosmotr na telefone");
  console.log("  ================================");
  console.log("");

  for (const port of PORTS) killPort(port);

  const network = getNetworkCategory();
  if (network === "Public") {
    console.log("  [!] Wi-Fi set as PUBLIC network - Windows blocks phones.");
    console.log("      Fixing firewall for all network types...");
  }

  const ips = getLocalIPv4();
  const server = http.createServer((req, res) => {
    const filePath = safePath(req.url || "/");
    if (!filePath) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }

    fs.stat(filePath, (error, stats) => {
      if (error) {
        sendFile(res, filePath);
        return;
      }

      if (stats.isDirectory()) {
        sendFile(res, path.join(filePath, "index.html"));
        return;
      }

      sendFile(res, filePath);
    });
  });

  let port = null;
  for (const candidate of PORTS) {
    try {
      port = await listen(server, candidate);
      break;
    } catch (error) {
      if (error.code !== "EADDRINUSE") {
        console.error("  Error:", error.message);
        process.exit(1);
      }
    }
  }

  if (!port) {
    console.error("  Could not start server. Restart PC and try again.");
    process.exit(1);
  }

  const firewallOk = ensureFirewallRule(port);
  const phoneIp = ips[0]?.address;
  const phoneUrl = phoneIp ? `http://${phoneIp}:${port}/` : null;
  const pcUrl = `http://127.0.0.1:${port}/`;
  const ok = await selfTest(port, phoneIp);

  console.log(`  PC:     ${pcUrl}`);
  if (phoneUrl) {
    console.log(`  Phone:  ${phoneUrl}`);
    console.log("");
    console.log("  Scan QR on phone (opens in browser):");
    openUrl(`https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(phoneUrl)}`);
  } else {
    console.log("  Phone:  Wi-Fi IP not found - connect PC to Wi-Fi.");
  }

  console.log("");
  console.log(`  Server: ${ok ? "OK" : "CHECK FAILED"}`);
  console.log(`  Firewall: ${firewallOk ? "OK (all profiles)" : "run allow-mobile.cmd as admin"}`);
  console.log("");
  console.log("  On phone: turn OFF mobile data, use Wi-Fi only.");
  console.log("  Do NOT close this window while testing.");
  console.log("  Stop: Ctrl+C");
  console.log("");

  openUrl(pcUrl);

  process.on("SIGINT", () => {
    server.close(() => process.exit(0));
  });
}

start();
