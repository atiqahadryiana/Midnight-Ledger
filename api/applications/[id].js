import { requireUser } from "../../lib/auth.js";
import { applicationSchema, mapApplication } from "../../lib/applications.js";
import { query } from "../../lib/db.js";
import { method } from "../../lib/http.js";
import { z } from "zod";
const idSchema = z.string().uuid();
export default async function handler(req, res) {
  if (!method(req, res, ["PUT", "DELETE"])) return;
  try {
    const user = await requireUser(req, res);
    if (!user) return;
    const id = idSchema.parse(req.query.id);
    if (req.method === "DELETE") {
      const result = await query(
        "delete from applications where id=$1 and user_id=$2",
        [id, user.user_id],
      );
      return result.rowCount
        ? res.status(204).end()
        : res.status(404).json({ error: "Application not found" });
    }
    const a = applicationSchema.parse(req.body);
    const {
      rows: [row],
    } = await query(
      `update applications set company=$1,role=$2,location=$3,link=$4,date_applied=$5,status=$6,contact_person=$7,notes=$8,followed_up_at=$9,last_updated_at=now() where id=$10 and user_id=$11 returning *`,
      [
        a.company,
        a.role,
        a.location,
        a.link || null,
        a.dateApplied,
        a.status,
        a.contact,
        a.notes,
        a.followedUpAt || null,
        id,
        user.user_id,
      ],
    );
    if (!row) return res.status(404).json({ error: "Application not found" });
    res.status(200).json({ application: mapApplication(row) });
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(400).json({ error: "Application data is invalid" });
    console.error("Application mutation failed");
    res.status(500).json({ error: "Unable to update application" });
  }
}
