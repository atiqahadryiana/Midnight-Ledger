import { query } from "./db.js";
import { sha256Hex } from "./http.js";

const WINDOW_MINUTES = 15,
  LIMIT = 5;
export async function enforceRateLimit(scope, values) {
  const keys = values.map((value) => sha256Hex(`${scope}:${value}`));
  await query(
    "delete from rate_limits where window_started_at < now() - interval '1 day'",
  );
  for (const key of keys) {
    const {
      rows: [row],
    } = await query(
      `insert into rate_limits (key_hash, attempts, window_started_at)
      values ($1, 1, now()) on conflict (key_hash) do update set
      attempts = case when rate_limits.window_started_at < now() - interval '${WINDOW_MINUTES} minutes' then 1 else rate_limits.attempts + 1 end,
      window_started_at = case when rate_limits.window_started_at < now() - interval '${WINDOW_MINUTES} minutes' then now() else rate_limits.window_started_at end
      returning attempts`,
      [key],
    );
    if (row.attempts > LIMIT) {
      const error = new Error("Too many attempts. Try again in 15 minutes.");
      error.status = 429;
      throw error;
    }
  }
}
