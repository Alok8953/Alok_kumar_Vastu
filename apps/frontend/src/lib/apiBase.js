/** Empty string in dev uses Vite proxy (/api -> localhost:5000). */
const raw = import.meta.env.VITE_API_BASE_URL ?? "";
export const API_BASE_URL =
  typeof raw === "string" ? raw.trim().replace(/\/$/, "") : "";
