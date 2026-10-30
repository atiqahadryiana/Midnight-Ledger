import { query } from "./db.js";
import crypto from "node:crypto";
import {
  cookie,
  randomSecret,
  readCookie,
  sha256,
  sha256Hex,
  safeEqual,
} from "./http.js";

const SESSION_COOKIE = "ml_session",
  THIRTY_DAYS = 60 * 60 * 24 * 30;
const sessionDigest = (raw) => {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32)
    throw new Error("SESSION_SECRET must contain at least 32 characters");
  return crypto.createHmac("sha256", secret).update(raw).digest("hex");
};
export function issueToken(userId) {
  return `ml_${userId}.${randomSecret()}`;
}
export function tokenUserId(token) {
  const match = /^ml_([0-9a-f-]{36})\.([A-Za-z0-9_-]{43})$/i.exec(token);
  return match?.[1] || null;
}
export async function createSession(res, userId) {
  const raw = randomSecret(),
    id = sessionDigest(raw);
  await query(
    "insert into sessions (id,user_id,expires_at) values ($1,$2,now()+interval '30 days')",
    [id, userId],
  );
  res.setHeader("Set-Cookie", cookie(SESSION_COOKIE, raw, THIRTY_DAYS));
}
export async function requireUser(req, res) {
  const raw = readCookie(req, SESSION_COOKIE);
  if (!raw) {
    res.status(401).json({ error: "Authentication required" });
    return null;
  }
  const {
    rows: [session],
  } = await query(
    `select s.user_id,u.email from sessions s join users u on u.id=s.user_id where s.id=$1 and s.expires_at>now()`,
    [sessionDigest(raw)],
  );
  if (!session) {
    res.setHeader("Set-Cookie", cookie(SESSION_COOKIE, "", 0));
    res.status(401).json({ error: "Session expired" });
    return null;
  }
  return session;
}
export async function verifyToken(token) {
  const id = tokenUserId(token);
  if (!id) return null;
  const {
    rows: [user],
  } = await query("select id,email,token_hash from users where id=$1", [id]);
  if (!user || !safeEqual(Buffer.from(user.token_hash, "hex"), sha256(token)))
    return null;
  return user;
}
export async function logout(req, res) {
  const raw = readCookie(req, SESSION_COOKIE);
  if (raw)
    await query("delete from sessions where id=$1", [sessionDigest(raw)]);
  res.setHeader("Set-Cookie", cookie(SESSION_COOKIE, "", 0));
}
