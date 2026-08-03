import { apiRequest } from "./apiRequest.js";

const DEV_DIRECT_API = "http://127.0.0.1:5000";
const REVIEW_TIMEOUT_MS = 45_000;
const RETRY_DELAYS_MS = [0, 800, 2000, 4000, 8000];

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

async function postReviewOnce(payload, baseUrl) {
  return apiRequest("/api/reviews", {
    method: "POST",
    body: payload,
    timeoutMs: REVIEW_TIMEOUT_MS,
    baseUrl
  });
}

async function postReviewWithRetries(payload, baseUrl) {
  let lastError;

  for (const delay of RETRY_DELAYS_MS) {
    if (delay) await wait(delay);
    try {
      return await postReviewOnce(payload, baseUrl);
    } catch (error) {
      lastError = error;
      if (!error?.isTransient) throw error;
    }
  }

  throw lastError;
}

/** Resilient review submit: retries, long timeout, dev direct-backend fallback. */
export async function submitReview(payload) {
  const routes = [{ baseUrl: undefined }];

  if (import.meta.env.DEV) {
    routes.push({ baseUrl: DEV_DIRECT_API });
  }

  let lastError;

  for (const { baseUrl } of routes) {
    try {
      return await postReviewWithRetries(payload, baseUrl);
    } catch (error) {
      lastError = error;
      if (!error?.isTransient) throw error;
    }
  }

  throw lastError;
}
