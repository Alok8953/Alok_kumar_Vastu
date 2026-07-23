import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    const poolConfig = {
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000
    };

    if (env.databaseUrl) {
      poolConfig.connectionString = env.databaseUrl;
      poolConfig.ssl = { rejectUnauthorized: false };
    } else {
      poolConfig.host = env.db.host;
      poolConfig.port = env.db.port;
      poolConfig.user = env.db.user;
      poolConfig.database = env.db.name;

      if (env.db.password) {
        poolConfig.password = env.db.password;
      }

      if (env.db.ssl) {
        poolConfig.ssl = { rejectUnauthorized: false };
      }
    }

    pool = new Pool(poolConfig);

    pool.on("error", (err) => {
      console.error("Unexpected PostgreSQL pool error:", err.message);
    });
  }

  return pool;
}

export async function checkDatabaseConnection() {
  const client = await getPool().connect();
  try {
    await client.query("SELECT 1");
    return true;
  } finally {
    client.release();
  }
}

export async function closePool() {
  if (pool) {
    await pool.end();
    pool = undefined;
  }
}
