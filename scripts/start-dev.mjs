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

/**
 * `node --watch` re-binds a freed port within milliseconds, so stale dev
 * servers from earlier terminals must be killed by process, not just by port.
 */
function killStaleDevProcesses() {
  if (platform() !== "win32") return;

  const currentPid = String(process.pid);
  const query =
    "Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | " +
    "Where-Object { $_.CommandLine -match 'src.server\\.js|vite\\.js|dev:inner' " +
    "-and $_.CommandLine -notmatch 'cursor' } | " +
    "Select-Object -ExpandProperty ProcessId";

  try {
    const output = execSync(`powershell -NoProfile -Command "${query}"`, {
      encoding: "utf8"
    });

    for (const line of output.split("\n")) {
      const pid = line.trim();
      if (!pid || pid === currentPid) continue;
      try {
        execSync(`taskkill /F /PID ${pid}`, { stdio: "ignore" });
        console.log(`Stopped stale dev process (PID ${pid})`);
      } catch {
        /* process may already be gone */
      }
    }
  } catch {
    /* no stale processes */
  }
}

killStaleDevProcesses();

for (const port of ports) {
  freePort(port);
}

const child = spawn(
  "npm",
  ["run", "dev:inner"],
  { cwd: rootDir, stdio: "inherit", shell: true }
);

child.on("exit", (code) => process.exit(code ?? 0));
