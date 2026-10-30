import { z } from "zod";
import { query } from "../../lib/db.js";
import { issueToken } from "../../lib/auth.js";
import { sendAccessToken } from "../../lib/email.js";
import { clientIp, method, sha256Hex } from "../../lib/http.js";
import { enforceRateLimit } from "../../lib/rate-limit.js";
const schema = z
  .object({ email: z.string().trim().toLowerCase().email().max(254) })
  .strict();
const disposable = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
]);
export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  try {
    const { email } = schema.parse(req.body);
    if (disposable.has(email.split("@")[1]))
      return res
        .status(400)
        .json({ error: "Please use a permanent email address" });
    await enforceRateLimit("register", [clientIp(req), email]);
    let {
      rows: [user],
    } = await query("select id from users where email=$1", [email]);
    if (!user) {
      ({
        rows: [user],
      } = await query(
        "insert into users(email,token_hash) values($1,'pending') returning id",
        [email],
      ));
    }
    const token = issueToken(user.id);
    await sendAccessToken(email, token);
    await query("update users set token_hash=$1 where id=$2", [
      sha256Hex(token),
      user.id,
    ]);
    await query("delete from sessions where user_id=$1", [user.id]);
    res.status(202).json({
      message: "If that email can receive mail, a token has been sent",
    });
  } catch (error) {
    if (error?.status === 429)
      return res.status(429).json({ error: error.message });
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Enter a valid email address" });
    console.error("Registration failed");
    res.status(500).json({ error: "Unable to process the request" });
  }
}
