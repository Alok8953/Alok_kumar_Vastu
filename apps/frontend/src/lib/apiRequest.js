import { API_BASE_URL } from "./apiBase.js";

/**
 * JSON API helper (GET/POST/PATCH). Pass adminKey for /api/admin/* routes.
 */
export async function apiRequest(path, { method = "GET", body, adminKey } = {}) {
  const url = `${API_BASE_URL}${path}`;
  const headers = {};

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  if (adminKey) {
    headers["X-Admin-Key"] = adminKey;
  }

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined
    });
  } catch {
    throw new Error(
      "Cannot reach the server. In the Vastu_proj folder run: npm run dev (backend port 5000 + frontend 5173)."
    );
  }

  const text = await res.text();
  let data = {};

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      const proxyDown =
        res.status === 502 ||
        res.status === 504 ||
        text.includes("proxy") ||
        text.includes("ECONNREFUSED");
      if (proxyDown) {
        throw new Error(
          "Backend is not running. Open a terminal in Vastu_proj and run: npm run dev"
        );
      }
      throw new Error(
        "Unexpected server response. Ensure the backend is running on port 5000."
      );
    }
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || "Something went wrong. Please try again.");
  }

  return data;
}
