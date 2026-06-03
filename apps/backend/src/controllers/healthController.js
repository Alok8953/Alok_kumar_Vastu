import { getHealthStatus } from "../services/healthService.js";

export async function healthController(req, res) {
  const status = await getHealthStatus();
  res.json(status);
}
