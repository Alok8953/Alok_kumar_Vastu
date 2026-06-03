import { env } from "../config/env.js";

export function requireAdminKey(req, res, next) {
  if (!env.adminApiKey) {
    return res.status(503).json({
      error:
        "Admin API key is not configured. Set ADMIN_API_KEY in apps/backend/.env and restart the server."
    });
  }

  const key = req.headers["x-admin-key"];
  if (!key || key !== env.adminApiKey) {
    return res.status(401).json({ error: "Invalid or missing admin key." });
  }

  next();
}
