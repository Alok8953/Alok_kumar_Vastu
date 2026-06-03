import "dotenv/config";
import { getPool } from "../src/db/pool.js";

const pool = getPool();

const tables = await pool.query(`
  SELECT table_name
  FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name
`);

console.log("Tables:", tables.rows.map((r) => r.table_name).join(", "));

const count = await pool.query("SELECT COUNT(*) FROM callback_requests");
console.log("callback_requests:", count.rows[0].count);

const sample = await pool.query(`
  SELECT cr.id, u.full_name, u.mobile, cr.property_type, cr.created_at
  FROM callback_requests cr
  JOIN users u ON u.id = cr.user_id
  ORDER BY cr.id DESC LIMIT 5
`);
console.log("Recent:", JSON.stringify(sample.rows, null, 2));

await pool.end();
