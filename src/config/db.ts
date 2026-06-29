import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_READ_URL ?? process.env.DATABASE_URL,
  max: 10,
});

pool.on("error", (err) => console.error("[Postgres] pool error:", err));
