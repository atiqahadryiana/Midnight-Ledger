import { logout } from "../../lib/auth.js";
import { method } from "../../lib/http.js";
export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  try {
    await logout(req, res);
    res.status(204).end();
  } catch {
    res.status(500).json({ error: "Unable to log out" });
  }
}
