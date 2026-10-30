import { requireUser } from "../../lib/auth.js";
import { applicationSchema, mapApplication } from "../../lib/applications.js";
import { query } from "../../lib/db.js";
import { method } from "../../lib/http.js";
import { z } from "zod";
export default async function handler(req, res) {
  if (!method(req, res, ["GET", "POST"])) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    if (req.method === "GET") {
      const { rows } = await query(
        "select * from applications where user_id=$1 order by date_applied desc,created_at desc",
        [user.user_id],
      );
      return res.status(200).json({ applications: rows.map(mapApplication) });
    }
    const a = applicationSchema.parse(req.body);
    const {
      rows: [row],
    } = await query(
      `insert into applications(user_id,company,role,location,link,date_applied,status,contact_person,notes,followed_up_at) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *`,
      [
        user.user_id,
        a.company,
        a.role,
        a.location,
        a.link || null,
        a.dateApplied,
        a.status,
        a.contact,
        a.notes,
        a.followedUpAt || null,
      ],
    );
    res.status(201).json({ application: mapApplication(row) });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res
        .status(400)
        .json({ error: "Application data is invalid" });
    console.error("Application request failed");
    res.status(500).json({ error: "Unable to process applications" });
  }
}
