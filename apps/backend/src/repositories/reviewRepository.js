import crypto from "crypto";
import { getPool } from "../db/pool.js";

function newApproveToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function createClientReview({ fullName, city, rating, reviewText }) {
  const approveToken = newApproveToken();
  const { rows } = await getPool().query(
    `INSERT INTO client_reviews (full_name, city, rating, review_text, approve_token)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, status, approve_token, created_at`,
    [fullName, city, rating, reviewText, approveToken]
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
    `SELECT id, full_name, city, rating, review_text, created_at
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
