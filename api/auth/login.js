import { z } from "zod";
import { createSession, tokenUserId, verifyToken } from "../../lib/auth.js";
import { query } from "../../lib/db.js";
import { clientIp, method } from "../../lib/http.js";
import { enforceRateLimit } from "../../lib/rate-limit.js";
const schema = z.object({ token: z.string().trim().min(40).max(200) }).strict();
export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  try {
    const { token } = schema.parse(req.body);
    const tokenId = tokenUserId(token);
    let accountKey = tokenId || "invalid";
    if (tokenId) {
      const {
        rows: [account],
      } = await query("select email from users where id=$1", [tokenId]);
      if (account) accountKey = account.email;
    }
    await enforceRateLimit("login", [clientIp(req), accountKey]);
    const user = await verifyToken(token);
    if (!user) return res.status(401).json({ error: "Invalid access token" });
    await createSession(res, user.id);
    await query("update users set last_login_at=now() where id=$1", [user.id]);
    res.status(200).json({ user: { email: user.email } });
  } catch (error) {
    if (error?.status === 429)
      return res.status(429).json({ error: error.message });
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Invalid access token" });
    console.error("Login failed");
    res.status(500).json({ error: "Unable to log in" });
  }
}
