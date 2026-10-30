import crypto from "node:crypto";

export function secure(res) {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'",
  );
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  res.setHeader("Cache-Control", "no-store");
}
export function method(req, res, allowed) {
  secure(res);
  if (!allowed.includes(req.method)) {
    res.setHeader("Allow", allowed);
    res.status(405).json({ error: "Method not allowed" });
    return false;
  }
  return true;
}
export const sha256 = (value) =>
  crypto.createHash("sha256").update(value).digest();
export const sha256Hex = (value) => sha256(value).toString("hex");
export const randomSecret = () => crypto.randomBytes(32).toString("base64url");
export const clientIp = (req) =>
  String(
    req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown",
  )
    .split(",")[0]
    .trim();
export const cookie = (name, value, maxAge) => {
  const secureFlag = process.env.VERCEL_ENV === "development" ? "" : "; Secure";
  return `${name}=${value}; Path=/; HttpOnly${secureFlag}; SameSite=Lax; Max-Age=${maxAge}`;
};
export function readCookie(req, name) {
  const raw = req.headers.cookie || "";
  return (
    raw
      .split(";")
      .map((v) => v.trim())
      .find((v) => v.startsWith(`${name}=`))
      ?.slice(name.length + 1) || null
  );
}
export function safeEqual(a, b) {
  const left = Buffer.from(a),
    right = Buffer.from(b);
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}
