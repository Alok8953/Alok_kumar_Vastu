import crypto from "crypto";
import { getPool } from "../db/pool.js";

function newApproveToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function createClientReview({
  submissionId,
  fullName,
  city,
  rating,
  reviewText,
  phone,
  email
}) {
  const approveToken = newApproveToken();
  const { rows } = await getPool().query(
    `INSERT INTO client_reviews (
       submission_id, full_name, city, rating, review_text, approve_token, phone, email
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (submission_id)
     DO UPDATE SET submission_id = EXCLUDED.submission_id
     RETURNING id, status, approve_token, created_at, email_sent_at,
       full_name, city, rating, review_text, phone, email,
       (xmax = 0) AS inserted`,
    [
      submissionId,
      fullName,
      city,
      rating,
      reviewText,
      approveToken,
      phone || null,
      email || null
    ]
  );

  return rows[0];
}

export async function findReviewByApproveToken(token) {
  const { rows } = await getPool().query(
    `SELECT id, full_name, city, rating, review_text, status, approve_token, created_at
     FROM client_reviews
     WHERE approve_token = $1`,
    [token]
  );
  return rows[0] ?? null;
}

export async function setReviewStatusByToken(token, status) {
  const { rows } = await getPool().query(
    `UPDATE client_reviews
     SET status = $2
     WHERE approve_token = $1
     RETURNING id, full_name, city, rating, review_text, status, created_at`,
    [token, status]
  );
  return rows[0] ?? null;
}

export async function markReviewEmailSent(id) {
  await getPool().query(
    `UPDATE client_reviews
     SET email_sent_at = NOW(), email_error = NULL
     WHERE id = $1`,
    [id]
  );
}

export async function markReviewEmailFailed(id, errorMessage) {
  await getPool().query(
    `UPDATE client_reviews SET email_error = $2 WHERE id = $1`,
    [id, errorMessage]
  );
}

export async function listPendingReviewEmails(limit = 20) {
  const { rows } = await getPool().query(
    `SELECT id, full_name, city, rating, review_text, approve_token, phone, email
     FROM client_reviews
     WHERE status = 'pending'
       AND email_sent_at IS NULL
       AND approve_token IS NOT NULL
     ORDER BY created_at ASC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function listReviewsByStatus(status) {
  const { rows } = await getPool().query(
    `SELECT id, full_name, city, rating, review_text, status, created_at
     FROM client_reviews
     WHERE status = $1
     ORDER BY created_at DESC`,
    [status]
  );
  return rows;
}

export async function listPublishedReviews() {
  const { rows } = await getPool().query(
    `SELECT id, full_name, city, rating, review_text, email, created_at
     FROM client_reviews
     WHERE status = 'approved'
     ORDER BY created_at DESC`
  );
  return rows;
}

export async function updateReviewStatus(id, status) {
  const allowed = ["pending", "approved", "rejected"];
  if (!allowed.includes(status)) {
    return null;
  }

  const { rows } = await getPool().query(
    `UPDATE client_reviews
     SET status = $2
     WHERE id = $1
     RETURNING id, full_name, city, rating, review_text, status, created_at`,
    [id, status]
  );

  return rows[0] ?? null;
}
