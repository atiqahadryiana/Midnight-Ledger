import { Resend } from "resend";

export async function sendAccessToken(email, token) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM || "Midnight Ledger <onboarding@resend.dev>";
  const { error } = await resend.emails.send({
    from,
    to: email,
    subject: "Your Midnight Ledger access token",
    html: `<!doctype html><html><body style="margin:0;background:#0e0f14;color:#e8e6e1;font-family:Arial,sans-serif"><div style="max-width:540px;margin:auto;padding:48px 24px"><h1 style="font-family:Georgia,serif;font-weight:500">Midnight Ledger</h1><p style="color:#9a98a3">Use this token to log in to your private application ledger.</p><div style="margin:28px 0;padding:18px;background:#1e2130;border:1px solid #2a2d3e;border-radius:10px;font:14px monospace;word-break:break-all;color:#e0a458">${token}</div><p>Keep this safe. It's your key to log in.</p><p style="color:#5f6070;font-size:12px">If you did not request this token, you can ignore this email.</p></div></body></html>`,
  });
  if (error) throw new Error("Email delivery failed");
}

const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character],
  );

export async function sendFeedbackNotification({
  category,
  message,
  rating,
  email,
}) {
  if (!process.env.OWNER_EMAIL)
    throw new Error("OWNER_EMAIL is not configured");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const from =
    process.env.RESEND_FROM || "Midnight Ledger <onboarding@resend.dev>";
  const safe = {
    category: escapeHtml(category),
    message: escapeHtml(message),
    email: escapeHtml(email),
  };
  const { error } = await resend.emails.send({
    from,
    to: process.env.OWNER_EMAIL,
    subject: `[Midnight Ledger] ${category} feedback`,
    text: `New ${category} feedback\n\nFrom: ${email}\nRating: ${rating || "Not provided"}/5\n\n${message}`,
    html: `<!doctype html><html><body style="margin:0;background:#0e0f14;color:#e8e6e1;font-family:Arial,sans-serif"><div style="max-width:560px;margin:auto;padding:48px 24px"><h1 style="font-family:Georgia,serif;font-weight:500">Midnight Ledger</h1><p style="color:#e0a458">${safe.category} feedback</p><p style="color:#9a98a3">From ${safe.email} · Rating ${rating || "not provided"}/5</p><div style="white-space:pre-wrap;margin-top:24px;padding:18px;background:#171923;border:1px solid #2a2d3e;border-radius:10px">${safe.message}</div></div></body></html>`,
  });
  if (error) throw new Error("Feedback email delivery failed");
}
