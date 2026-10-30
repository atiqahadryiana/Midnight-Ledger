import pg from "pg";

const { Pool } = pg;
if (!process.env.DATABASE_URL) console.warn("DATABASE_URL is not configured");
export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "development"
      ? false
      : { rejectUnauthorized: false },
  max: 3,
  idleTimeoutMillis: 10_000,
});

export const query = (text, params) => db.query(text, params);
