import { apiRequest } from "./apiRequest.js";

export function getHealth() {
  return apiRequest("/api/health");
}
