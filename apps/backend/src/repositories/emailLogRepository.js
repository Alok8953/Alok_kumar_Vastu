import { getPool } from "../db/pool.js";
import { env } from "../config/env.js";

export async function createEmailLog({ callbackRequestId, status, errorMessage }) {
  const { rows } = await getPool().query(
    `INSERT INTO email_logs (callback_request_id, to_email, status, error_message)
     VALUES ($1, $2, $3, $4)
     RETURNING id, status, created_at`,
    [callbackRequestId, env.toEmail, status, errorMessage || null]
  );

  return rows[0];
}
