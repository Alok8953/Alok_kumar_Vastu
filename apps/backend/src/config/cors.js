import { env } from "./env.js";

/** Allow localhost, 127.0.0.1, and common LAN IPs used by Vite (host: true). */
export function isAllowedDevOrigin(origin) {
  if (!origin) return true;

  try {
    const { hostname, protocol } = new URL(origin);
    if (protocol !== "http:" && protocol !== "https:") return false;
    if (hostname === "localhost" || hostname === "127.0.0.1") return true;
    if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
    if (/^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
    if (/^172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3}$/.test(hostname)) return true;
    return origin === env.frontendOrigin;
  } catch {
    return false;
  }
}

export function corsOrigin(origin, callback) {
  if (!origin) {
    callback(null, true);
    return;
  }

  if (origin === env.frontendOrigin) {
    callback(null, true);
    return;
  }

  if (env.nodeEnv !== "production" && isAllowedDevOrigin(origin)) {
    callback(null, true);
    return;
  }

  callback(new Error(`CORS blocked for origin: ${origin}`));
}
