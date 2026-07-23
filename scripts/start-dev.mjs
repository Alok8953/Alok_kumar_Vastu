import { execSync, spawn } from "node:child_process";
import { platform } from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ports = [5000, 5173, 5174];

function freePort(port) {
  if (platform() !== "win32") return;

  try {
    const output = execSync(`netstat -ano | findstr :${port}`, { encoding: "utf8" });
    const pids = new Set();

    for (const line of output.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed.includes("LISTENING")) continue;
      const match = trimmed.match(/\s(\d+)\s*$/);
      if (match) pids.add(match[1]);
    }

    for (const pid of pids) {
      if (!pid || pid === "0") continue;
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`Freed port ${port} (PID ${pid})`);
      } catch {
        /* process may already be gone */
      }
    }
  } catch {
    /* port not in use */
  }
}

for (const port of ports) {
  freePort(port);
}

const child = spawn(
  "npm",
  ["run", "dev:inner"],
  { cwd: rootDir, stdio: "inherit", shell: true }
);

child.on("exit", (code) => process.exit(code ?? 0));
