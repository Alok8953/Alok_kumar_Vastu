import { API_BASE_URL } from "../lib/apiBase.js";

export async function getHealth() {
  const response = await fetch(`${API_BASE_URL}/api/health`);
  if (!response.ok) {
    throw new Error("Failed to fetch API health");
  }
  return response.json();
}
