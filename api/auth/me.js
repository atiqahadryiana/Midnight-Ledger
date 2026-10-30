import { requireUser } from "../../lib/auth.js";
import { method } from "../../lib/http.js";
export default async function handler(req, res) {
  if (!method(req, res, ["GET"])) return;
  try {
    const user = await requireUser(req, res);
    if (user) res.status(200).json({ user: { email: user.email } });
  } catch {
    res.status(500).json({ error: "Unable to check session" });
  }
}
