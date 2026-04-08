import { getHealthStatus } from "../services/healthService.js";

export function healthController(req, res) {
  res.json(getHealthStatus());
}
