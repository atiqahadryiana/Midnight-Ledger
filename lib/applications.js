import { z } from "zod";
export const statuses = [
  "Wishlist",
  "Applied",
  "Online Assessment",
  "Interview",
  "Offer",
  "Rejected",
  "Ghosted",
];
export const applicationSchema = z
  .object({
    company: z.string().trim().min(1).max(160),
    role: z.string().trim().min(1).max(160),
    location: z.string().trim().max(160).default(""),
    link: z
      .union([z.string().trim().url().max(2048), z.literal("")])
      .default(""),
    dateApplied: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    status: z.enum(statuses),
    contact: z.string().trim().max(160).default(""),
    notes: z.string().trim().max(10000).default(""),
    followedUpAt: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable()
      .optional(),
  })
  .strict();
export const mapApplication = (row) => ({
  id: row.id,
  company: row.company,
  role: row.role,
  location: row.location || "",
  link: row.link || "",
  dateApplied: String(row.date_applied).slice(0, 10),
  status: row.status,
  contact: row.contact_person || "",
  notes: row.notes || "",
  followedUpAt: row.followed_up_at
    ? String(row.followed_up_at).slice(0, 10)
    : null,
});
