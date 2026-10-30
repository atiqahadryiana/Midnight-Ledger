import { z } from "zod";
import { requireUser } from "../lib/auth.js";
import { query } from "../lib/db.js";
import { sendFeedbackNotification } from "../lib/email.js";
import { method } from "../lib/http.js";

const schema = z
  .object({
    category: z.enum(["Idea", "Bug", "Praise", "Other"]),
    message: z.string().trim().min(10).max(1000),
    rating: z.number().int().min(1).max(5).nullable(),
    includeInfo: z.boolean(),
    page: z.string().trim().max(500).nullable(),
    screenSize: z.string().trim().max(32).nullable(),
  })
  .strict();

export default async function handler(req, res) {
  if (!method(req, res, ["POST"])) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const feedback = schema.parse(req.body);
    const {
      rows: [usage],
    } = await query(
      "select count(*)::int as count from feedback where user_id=$1 and created_at > now() - interval '1 hour'",
      [user.user_id],
    );
    if (usage.count >= 5)
      return res.status(429).json({
        error: "You've sent a few notes already. Please try again later.",
      });
    const userAgent = feedback.includeInfo
      ? String(req.headers["user-agent"] || "").slice(0, 500) || null
      : null;
    const {
      rows: [row],
    } = await query(
      `insert into feedback(user_id,category,message,rating,page,user_agent,screen_size)
       values($1,$2,$3,$4,$5,$6,$7) returning id,created_at`,
      [
        user.user_id,
        feedback.category,
        feedback.message,
        feedback.rating,
        feedback.includeInfo ? feedback.page : null,
        userAgent,
        feedback.includeInfo ? feedback.screenSize : null,
      ],
    );
    try {
      await sendFeedbackNotification({ ...feedback, email: user.email });
    } catch (error) {
      await query("delete from feedback where id=$1 and user_id=$2", [
        row.id,
        user.user_id,
      ]);
      throw error;
    }
    res.status(201).json({ feedback: row });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Check your note and try again." });
    console.error("Feedback submission failed", error?.message);
    res.status(500).json({
      error: "Couldn't send that. Your text is still here, try again.",
    });
  }
}
