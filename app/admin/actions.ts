"use server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { adminDb } from "@/lib/supabase/admin";
import { sessionDb } from "@/lib/supabase/server";
import { getAdmin, requireAdmin } from "@/lib/auth";
import { byKey, type Field } from "@/lib/resources";
import { limited } from "@/lib/ratelimit";
import { sendEmail } from "@/lib/email";
import { esc } from "@/lib/validate";
import { SITE } from "@/lib/site";

type Result = { ok: boolean; message: string };

// ───────── login / logout ─────────
export async function login(_: any, fd: FormData): Promise<{ error?: string }> {
  const ip = (headers().get("x-forwarded-for") || "x").split(",")[0];
  if (limited(`login:${ip}`, 6, 15 * 60_000)) return { error: "Too many attempts. Wait 15 minutes." };
  const email = String(fd.get("email") || "").trim().toLowerCase().slice(0, 200);
  const password = String(fd.get("password") || "").slice(0, 200);
  const s = sessionDb();
  if (!s) return { error: "Supabase is not configured (check environment variables)." };
  const { error } = await s.auth.signInWithPassword({ email, password });
  if (error) return { error: "Invalid email or password." };
  if (!(await getAdmin())) { await s.auth.signOut(); return { error: "This account is not authorised for admin access." }; }
  redirect("/admin");
}
export async function logout() {
  const s = sessionDb();
  if (s) await s.auth.signOut();
  redirect("/admin/login");
}

// ───────── helpers ─────────
async function audit(actor: string, action: string, resource: string, row_id: string, detail?: any) {
  const db = adminDb();
  if (db) await db.from("audit_log").insert({ actor, action, resource, row_id, detail: detail ?? null });
}
function coerce(f: Field, v: any) {
  const s = typeof v === "string" ? v.trim() : v;
  switch (f.type) {
    case "number": case "money": return s === "" || s == null ? null : Number(s);
    case "bool": return s === true || s === "true" || s === "on";
    case "list": return String(v || "").split("\n").map((x) => x.trim()).filter(Boolean);
    case "date": case "relation": return s === "" || s == null ? null : s;
    default: return s === "" ? null : s;
  }
}
const stamp = (p: string) => `${p}-${new Date().toISOString().slice(0, 7).replace("-", "")}-${Math.floor(1000 + Math.random() * 9000)}`;

// ───────── generic save / delete ─────────
export async function saveRow(resource: string, id: string | null, values: Record<string, any>): Promise<Result> {
  const admin = await requireAdmin();
  const r = byKey(resource); const db = adminDb();
  if (!r || !db || r.noEdit && id || r.noCreate && !id) return { ok: false, message: "Not allowed." };
  const row: Record<string, any> = {};
  for (const f of r.fields) {
    if (f.readonly) continue;
    if (id && f.createOnly) continue;
    if (!(f.key in values)) continue;
    row[f.key] = coerce(f, values[f.key]);
    if (f.required && (row[f.key] === null || row[f.key] === "")) return { ok: false, message: `“${f.label}” is required.` };
  }
  if (r.number && !id && !row[r.number.key]) row[r.number.key] = stamp(r.number.prefix);
  if (r.key === "posts" && !row.published_at) delete row.published_at;
  const pk = r.pk || "id";
  const q = id ? db.from(r.table).update(row).eq(pk, id).select(pk).maybeSingle() : db.from(r.table).insert(row).select(pk).maybeSingle();
  const { data, error } = await q;
  if (error) return { ok: false, message: error.message.includes("duplicate") ? "That value already exists (must be unique)." : `Could not save: ${error.message}` };
  await audit(admin.email, id ? "update" : "create", r.key, String((data as any)?.[pk] ?? id ?? ""), row);
  revalidatePath("/", "layout");
  return { ok: true, message: id ? "Saved." : "Created." };
}

export async function deleteRow(resource: string, id: string): Promise<Result> {
  const admin = await requireAdmin();
  const r = byKey(resource); const db = adminDb();
  if (!r || !db || r.noDelete) return { ok: false, message: "Not allowed." };
  if (r.key === "admin_users" && id.toLowerCase() === admin.email) return { ok: false, message: "You can’t remove yourself." };
  const { error } = await db.from(r.table).delete().eq(r.pk || "id", id);
  if (error) return { ok: false, message: `Could not delete: ${error.message}` };
  await audit(admin.email, "delete", r.key, id);
  revalidatePath("/", "layout");
  return { ok: true, message: "Deleted." };
}

// ───────── one-click business actions ─────────
export async function runAction(resource: string, action: string, id: string): Promise<Result> {
  const admin = await requireAdmin();
  const db = adminDb();
  if (!db) return { ok: false, message: "Database not configured." };
  const notifyOwner = process.env.NOTIFY_EMAIL || admin.email;

  if (resource === "leads" && action === "convertToClient") {
    const { data: l } = await db.from("leads").select("*").eq("id", id).maybeSingle();
    if (!l) return { ok: false, message: "Lead not found." };
    const { error } = await db.from("clients").insert({ name: l.name, organization: l.organization, email: l.email, phone: l.phone, lead_id: l.id, notes: l.goals });
    if (error) return { ok: false, message: error.message };
    if (["new", "contacted"].includes(l.status)) await db.from("leads").update({ status: "discussion" }).eq("id", id);
    await audit(admin.email, "convertToClient", "leads", id);
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Client created. Next: create a quote under Quotes." };
  }
  if (resource === "quotes" && action === "toInvoice") {
    const { data: q } = await db.from("quotes").select("*").eq("id", id).maybeSingle();
    if (!q) return { ok: false, message: "Quote not found." };
    const due = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);
    const no = stamp("INV");
    const { error } = await db.from("invoices").insert({ invoice_no: no, client_id: q.client_id, quote_id: q.id, title: q.title, amount: q.amount, status: "draft", due_date: due });
    if (error) return { ok: false, message: error.message };
    await db.from("quotes").update({ status: "accepted" }).eq("id", id);
    await audit(admin.email, "toInvoice", "quotes", id, { invoice: no });
    revalidatePath("/admin", "layout");
    return { ok: true, message: `Invoice ${no} created (due in 7 days). Open Invoices to send it.` };
  }
  if (resource === "invoices" && (action === "send" || action === "markPaid")) {
    const { data: inv } = await db.from("invoices").select("*, clients(name,email)").eq("id", id).maybeSingle();
    if (!inv) return { ok: false, message: "Invoice not found." };
    const c: any = Array.isArray(inv.clients) ? inv.clients[0] : inv.clients;
    const link = `${SITE.url}/pay/${inv.token}`;
    const amt = `₹${Number(inv.amount).toLocaleString("en-IN")}`;
    if (action === "send") {
      await db.from("invoices").update({ status: "sent" }).eq("id", id);
      const sent = c?.email ? await sendEmail(c.email, `Invoice ${inv.invoice_no} – ${amt}`, `<p>Hi ${esc(c.name || "")},</p><p>Your invoice <b>${esc(inv.invoice_no)}</b> for <b>${esc(inv.title)}</b> (${amt}) is ready.</p><p><a href="${link}" style="background:#2563EB;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Pay securely via UPI</a></p><p>Thank you,<br/>ShantanuWorks</p>`) : false;
      await audit(admin.email, "send", "invoices", id);
      revalidatePath("/admin", "layout");
      return { ok: true, message: sent ? "Marked sent and emailed to client." : "Marked sent. (Email not sent — copy the pay link and share it on WhatsApp.)" };
    }
    await db.from("invoices").update({ status: "paid", paid_at: new Date().toISOString() }).eq("id", id);
    if (c?.email) await sendEmail(c.email, `Payment received – ${inv.invoice_no}`, `<p>Hi ${esc(c.name || "")},</p><p>We’ve received your payment of <b>${amt}</b> for <b>${esc(inv.title)}</b>. Thank you!</p><p>— ShantanuWorks</p>`);
    await sendEmail(notifyOwner, `Paid: ${inv.invoice_no} ${amt}`, `<p>Invoice ${esc(inv.invoice_no)} (${amt}) marked paid.</p>`);
    await audit(admin.email, "markPaid", "invoices", id, { amount: inv.amount });
    revalidatePath("/admin", "layout");
    return { ok: true, message: "Payment recorded and confirmation sent. 🎉" };
  }
  return { ok: false, message: "Unknown action." };
}
