import { Pool } from "pg";
import { hostname } from "zod";

const pool = new Pool({
  hostname: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? "5432"),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

export async function query<T = any>(
  sql: string,
  params?: any[]
): Promise<T[]> {
  const result = await pool.query<T>(sql, params);
  return result.rows;
}
