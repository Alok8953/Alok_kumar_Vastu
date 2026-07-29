import crypto from "crypto";
import { getPool } from "../db/pool.js";

const OTP_TTL_MS = 10 * 60 * 1000;
const AUTH_TTL_MS = 30 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 45 * 1000;

export function hashOtp(otp) {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
}

export function generateOtp() {
  return String(crypto.randomInt(100000, 999999));
}

export function newAuthToken() {
  return crypto.randomBytes(24).toString("hex");
}

export async function findRecentChallenge(phone) {
  const { rows } = await getPool().query(
    `SELECT id, phone, created_at, verified_at
     FROM review_otp_challenges
     WHERE phone = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [phone]
  );
  return rows[0] ?? null;
}

export async function assertCanSendOtp(phone) {
  const recent = await findRecentChallenge(phone);
  if (!recent) return { ok: true };

  const age = Date.now() - new Date(recent.created_at).getTime();
  if (age < RESEND_COOLDOWN_MS) {
    const waitSec = Math.ceil((RESEND_COOLDOWN_MS - age) / 1000);
    return {
      ok: false,
      error: `Please wait ${waitSec}s before requesting another OTP.`
    };
  }
  return { ok: true };
}

export async function createOtpChallenge(phone, otp) {
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  const { rows } = await getPool().query(
    `INSERT INTO review_otp_challenges (phone, otp_hash, expires_at)
     VALUES ($1, $2, $3)
     RETURNING id, phone, expires_at, created_at`,
    [phone, hashOtp(otp), expiresAt.toISOString()]
  );
  return rows[0];
}

export async function verifyOtpAndIssueAuth(phone, otp) {
  const { rows } = await getPool().query(
    `SELECT id, otp_hash, expires_at, attempts, verified_at
     FROM review_otp_challenges
     WHERE phone = $1
     ORDER BY created_at DESC
     LIMIT 1`,
    [phone]
  );

  const challenge = rows[0];
  if (!challenge) {
    return { ok: false, error: "Please request an OTP first." };
  }

  if (challenge.verified_at) {
    return { ok: false, error: "OTP already used. Please request a new one." };
  }

  if (new Date(challenge.expires_at).getTime() < Date.now()) {
    return { ok: false, error: "OTP expired. Please request a new one." };
  }

  if (challenge.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: "Too many wrong attempts. Request a new OTP." };
  }

  if (challenge.otp_hash !== hashOtp(otp)) {
    await getPool().query(
      `UPDATE review_otp_challenges SET attempts = attempts + 1 WHERE id = $1`,
      [challenge.id]
    );
    return { ok: false, error: "Incorrect OTP. Please try again." };
  }

  const authToken = newAuthToken();
  const authExpiresAt = new Date(Date.now() + AUTH_TTL_MS);

  await getPool().query(
    `UPDATE review_otp_challenges
     SET verified_at = NOW(),
         auth_token = $2,
         auth_expires_at = $3
     WHERE id = $1`,
    [challenge.id, authToken, authExpiresAt.toISOString()]
  );

  return { ok: true, authToken, phone, authExpiresAt };
}

export async function consumeAuthToken(phone, authToken) {
  if (!phone || !authToken) {
    return { ok: false, error: "Phone verification required before submitting feedback." };
  }

  const { rows } = await getPool().query(
    `SELECT id, phone, auth_expires_at, auth_used_at, verified_at
     FROM review_otp_challenges
     WHERE auth_token = $1
     LIMIT 1`,
    [authToken]
  );

  const row = rows[0];
  if (!row || !row.verified_at) {
    return { ok: false, error: "Invalid verification. Please verify your phone again." };
  }

  if (row.phone !== phone) {
    return { ok: false, error: "Phone number does not match verification." };
  }

  if (row.auth_used_at) {
    return { ok: false, error: "Verification already used. Please verify again." };
  }

  if (new Date(row.auth_expires_at).getTime() < Date.now()) {
    return { ok: false, error: "Verification expired. Please verify your phone again." };
  }

  await getPool().query(
    `UPDATE review_otp_challenges SET auth_used_at = NOW() WHERE id = $1`,
    [row.id]
  );

  return { ok: true };
}
