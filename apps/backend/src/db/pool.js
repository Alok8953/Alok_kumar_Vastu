import pg from "pg";
import { env } from "../config/env.js";

const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    const poolConfig = {
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      database: env.db.name,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 5_000
    };

    if (env.db.password) {
      poolConfig.password = env.db.password;
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
