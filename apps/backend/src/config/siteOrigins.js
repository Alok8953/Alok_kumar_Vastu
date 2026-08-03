import { env } from "./env.js";

/** Canonical site hostnames allowed in production (apex + www). */
export function getAllowedSiteOrigins() {
  const origins = new Set([env.frontendOrigin]);

  try {
    const url = new URL(env.frontendOrigin);
    if (url.hostname.startsWith("www.")) {
      origins.add(`${url.protocol}//${url.hostname.slice(4)}`);
    } else {
      origins.add(`${url.protocol}//www.${url.hostname}`);
    }
  } catch {
    /* ignore invalid FRONTEND_ORIGIN */
  }

  return origins;
}

export function getCanonicalSiteHostname() {
  try {
    return new URL(env.frontendOrigin).hostname;
  } catch {
    return null;
  }
}
