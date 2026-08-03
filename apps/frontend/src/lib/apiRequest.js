import { API_BASE_URL } from "./apiBase.js";

const GENERIC_REQUEST_ERROR =
  "We could not complete your request right now. Please try again in a moment.";

function requestError({ status = 0, isTransient = false } = {}) {
  const error = new Error(GENERIC_REQUEST_ERROR);
  error.status = status;
  error.isTransient = isTransient;
  return error;
}

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
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15_000);
  try {
    res = await fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });
  } catch {
    throw requestError({ isTransient: true });
  } finally {
    window.clearTimeout(timeoutId);
  }

  const text = await res.text();
  let data = {};

  if (text) {
    try {
      const parsed = JSON.parse(text);
      data = parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      throw requestError({
        status: res.status,
        isTransient: res.status >= 500
      });
    }
  }

  if (!res.ok) {
    const detail =
      data?.error ||
      data?.message ||
      (Array.isArray(data?.errors) ? data.errors.join(" ") : "") ||
      (typeof data?.errors === "string" ? data.errors : "");
    const isSafeClientError = res.status >= 400 && res.status < 500;
    if (isSafeClientError && detail) {
      const error = new Error(detail);
      error.status = res.status;
      error.isTransient = false;
      throw error;
    }
    throw requestError({ status: res.status, isTransient: res.status >= 500 });
  }

  return data;
}
