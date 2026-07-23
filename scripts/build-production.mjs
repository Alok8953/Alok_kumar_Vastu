import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

console.log("Building frontend for production...");
const build = spawnSync("npm", ["run", "build", "--workspace", "@app/frontend"], {
  cwd: rootDir,
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL ?? ""
  }
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

console.log("Production build ready: apps/frontend/dist");
