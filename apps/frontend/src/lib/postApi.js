import { apiRequest } from "./apiRequest.js";

/** POST JSON to /api/* */
export function postApi(path, body) {
  return apiRequest(path, { method: "POST", body });
}
