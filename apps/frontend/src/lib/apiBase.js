/**
 * Empty VITE_API_BASE_URL = same-origin /api (dev proxy or production Express).
 * Set only when API is on a separate host, e.g. https://api.yoursite.com
 */
const configured = import.meta.env.VITE_API_BASE_URL ?? "";
export const API_BASE_URL =
  typeof configured === "string" ? configured.trim().replace(/\/$/, "") : "";
