import { requireUser, issueToken } from "../../lib/auth.js";
import { query } from "../../lib/db.js";
import { sendAccessToken } from "../../lib/email.js";
import { clientIp, method, sha256Hex } from "../../lib/http.js";
import { enforceRateLimit } from "../../lib/rate-limit.js";
export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    await enforceRateLimit("regenerate", [clientIp(req), user.email]);
    const token = issueToken(user.user_id);
    await sendAccessToken(user.email, token);
    await query("update users set token_hash=$1 where id=$2", [
      sha256Hex(token),
      user.user_id,
    ]);
    res.status(202).json({ message: "A new token has been emailed to you" });
  } catch (error) {
    if (error?.status === 429)
      return res.status(429).json({ error: error.message });
    console.error("Regeneration failed");
    res.status(500).json({ error: "Unable to regenerate token" });
  }
}
