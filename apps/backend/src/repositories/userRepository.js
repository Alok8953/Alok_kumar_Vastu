import { getPool } from "../db/pool.js";

export async function createUser({ fullName, mobile, email }) {
  const { rows } = await getPool().query(
    `INSERT INTO users (full_name, mobile, email)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, mobile, email, created_at`,
    [fullName, mobile, email || null]
  );

  return rows[0];
}
