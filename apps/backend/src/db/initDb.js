import crypto from "crypto";
import pg from "pg";
import { env } from "../config/env.js";
import { getPool } from "./pool.js";

const { Pool } = pg;

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  mobile VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS callback_requests (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_types TEXT[] NOT NULL,
  primary_concerns TEXT[] NOT NULL,
  concern_detail TEXT NOT NULL,
  property_location VARCHAR(255) NOT NULL,
  has_floor_plan BOOLEAN NOT NULL,
  preferred_time_slot VARCHAR(50) NOT NULL,
  consultation_method VARCHAR(50) NOT NULL,
  consultation_contact_number VARCHAR(20),
  referral_source VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'new',
  email_sent_at TIMESTAMPTZ,
  email_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  role VARCHAR(50) NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS email_logs (
  id SERIAL PRIMARY KEY,
  callback_request_id INT NOT NULL REFERENCES callback_requests(id) ON DELETE CASCADE,
  to_email VARCHAR(255) NOT NULL,
  status VARCHAR(20) NOT NULL,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_callback_requests_created_at
  ON callback_requests (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_callback_requests_user_id
  ON callback_requests (user_id);

CREATE INDEX IF NOT EXISTS idx_email_logs_callback_request_id
  ON email_logs (callback_request_id);

CREATE TABLE IF NOT EXISTS client_reviews (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  approve_token VARCHAR(64) UNIQUE,
  email_sent_at TIMESTAMPTZ,
  email_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_reviews_created_at
  ON client_reviews (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_client_reviews_status
  ON client_reviews (status);

CREATE TABLE IF NOT EXISTS review_otp_challenges (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(15) NOT NULL,
  otp_hash VARCHAR(128) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts SMALLINT NOT NULL DEFAULT 0,
  verified_at TIMESTAMPTZ,
  auth_token VARCHAR(64) UNIQUE,
  auth_expires_at TIMESTAMPTZ,
  auth_used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_review_otp_phone_created
  ON review_otp_challenges (phone, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_review_otp_auth_token
  ON review_otp_challenges (auth_token);
`;

async function ensureDatabaseExists() {
  const adminConfig = {
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    database: "postgres"
  };

  if (env.db.password) {
    adminConfig.password = env.db.password;
  }

  const adminPool = new Pool(adminConfig);

  try {
    const { rows } = await adminPool.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [env.db.name]
    );

    if (rows.length === 0) {
      await adminPool.query(`CREATE DATABASE "${env.db.name}"`);
      console.log(`Created PostgreSQL database: ${env.db.name}`);
    }
  } finally {
    await adminPool.end();
  }
}

async function migrateLegacyCallbackTable(pool) {
  const { rows: legacyColumns } = await pool.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'callback_requests' AND column_name = 'name'`
  );

  if (legacyColumns.length === 0) {
    return;
  }

  const { rows: legacyRows } = await pool.query(
    "SELECT id, name, place, problem, status, email_sent_at, email_error, created_at FROM callback_requests"
  );

  await pool.query("DROP TABLE IF EXISTS email_logs CASCADE");
  await pool.query("DROP TABLE IF EXISTS callback_requests CASCADE");
  await pool.query("DROP TABLE IF EXISTS users CASCADE");

  await pool.query(SCHEMA_SQL);

  for (const row of legacyRows) {
    const userResult = await pool.query(
      `INSERT INTO users (full_name, mobile, email, created_at, updated_at)
       VALUES ($1, $2, NULL, $3, $3)
       RETURNING id`,
      [row.name, "legacy", row.created_at]
    );

    await pool.query(
      `INSERT INTO callback_requests (
         user_id, property_types, primary_concerns, concern_detail, property_location,
         has_floor_plan, preferred_time_slot, consultation_method, referral_source,
         status, email_sent_at, email_error, created_at, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $13)`,
      [
        userResult.rows[0].id,
        ["Other"],
        ["General Vastu Consultation"],
        row.problem,
        row.place,
        false,
        "Not specified",
        "Phone Call",
        null,
        row.status || "new",
        row.email_sent_at,
        row.email_error,
        row.created_at
      ]
    );
  }

  if (legacyRows.length > 0) {
    console.log(`Migrated ${legacyRows.length} legacy callback request(s)`);
  }
}

export async function initDatabase() {
  if (!env.db.skipAutoCreate) {
    await ensureDatabaseExists();
  }

  const pool = getPool();

  const { rows: legacyColumns } = await pool.query(
    `SELECT column_name FROM information_schema.columns
     WHERE table_schema = 'public' AND table_name = 'callback_requests' AND column_name = 'name'`
  );

  if (legacyColumns.length > 0) {
    await migrateLegacyCallbackTable(pool);
    await ensurePropertyTypesColumn(pool);
    await ensureConsultationContactNumberColumn(pool);
    await ensureReviewApproveTokens(pool);
    await ensureReviewPhoneAuth(pool);
    return;
  }

  await pool.query(SCHEMA_SQL);
  await ensurePropertyTypesColumn(pool);
  await ensureConsultationContactNumberColumn(pool);
  await ensureReviewApproveTokens(pool);
  await ensureReviewPhoneAuth(pool);
}

async function ensureConsultationContactNumberColumn(pool) {
  await pool.query(`
    ALTER TABLE callback_requests
    ADD COLUMN IF NOT EXISTS consultation_contact_number VARCHAR(20)
  `);
}

async function ensurePropertyTypesColumn(pool) {
  await pool.query(`
    ALTER TABLE callback_requests
    ADD COLUMN IF NOT EXISTS property_types TEXT[]
  `);

  const { rows } = await pool.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'callback_requests'
      AND column_name IN ('property_type', 'property_types')
  `);
  const cols = new Set(rows.map((r) => r.column_name));

  if (cols.has("property_type") && cols.has("property_types")) {
    await pool.query(`
      UPDATE callback_requests
      SET property_types = ARRAY[property_type]
      WHERE property_types IS NULL AND property_type IS NOT NULL
    `);
    await pool.query(`
      ALTER TABLE callback_requests
      ALTER COLUMN property_type DROP NOT NULL
    `);
  }
}

async function ensureReviewApproveTokens(pool) {
  await pool.query(
    `ALTER TABLE client_reviews
     ADD COLUMN IF NOT EXISTS approve_token VARCHAR(64) UNIQUE`
  );

  const { rows } = await pool.query(
    `SELECT id FROM client_reviews WHERE approve_token IS NULL`
  );

  for (const row of rows) {
    const token = crypto.randomBytes(24).toString("hex");
    await pool.query(`UPDATE client_reviews SET approve_token = $2 WHERE id = $1`, [
      row.id,
      token
    ]);
  }
}

async function ensureReviewPhoneAuth(pool) {
  await pool.query(`
    ALTER TABLE client_reviews
    ADD COLUMN IF NOT EXISTS phone VARCHAR(15)
  `);

  await pool.query(`
    ALTER TABLE client_reviews
    ADD COLUMN IF NOT EXISTS email VARCHAR(255)
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS review_otp_challenges (
      id SERIAL PRIMARY KEY,
      phone VARCHAR(15) NOT NULL,
      otp_hash VARCHAR(128) NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      attempts SMALLINT NOT NULL DEFAULT 0,
      verified_at TIMESTAMPTZ,
      auth_token VARCHAR(64) UNIQUE,
      auth_expires_at TIMESTAMPTZ,
      auth_used_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_review_otp_phone_created
      ON review_otp_challenges (phone, created_at DESC)
  `);

  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_review_otp_auth_token
      ON review_otp_challenges (auth_token)
  `);
}
