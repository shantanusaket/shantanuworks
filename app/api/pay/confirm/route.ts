import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase/admin";
import { clean } from "@/lib/validate";
import { ipOf, limited } from "@/lib/ratelimit";
import { sendEmail, rows } from "@/lib/email";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function POST(req: Request) {
  if (limited(`p:${ipOf(req)}`, 6, 10 * 60_000)) return NextResponse.json({ ok: false, error: "Too many attempts. Try again later." }, { status: 429 });
  const b = await req.json().catch(() => null);
  const token = clean(b?.token, 40), utr = clean(b?.utr, 30).replace(/\s/g, ""), note = clean(b?.note, 100);
  if (!UUID.test(token) || !/^[A-Za-z0-9]{8,30}$/.test(utr)) return NextResponse.json({ ok: false, error: "Please enter a valid transaction ID (8–30 letters/numbers)." }, { status: 400 });
  const db = adminDb();
  if (!db) return NextResponse.json({ ok: false, error: "Unavailable." }, { status: 503 });
  // This NEVER marks an invoice paid. It only records the reference; you verify it in your bank/UPI app, then click "Mark paid" in admin.
  const { data, error } = await db.from("invoices").update({ status: "payment_submitted", utr, payer_note: note || null })
    .eq("token", token).in("status", ["draft", "sent", "overdue"]).select("invoice_no,title,amount").maybeSingle();
  if (error || !data) return NextResponse.json({ ok: false, error: "This invoice cannot accept a payment reference." }, { status: 400 });
  const notify = process.env.NOTIFY_EMAIL || (process.env.ADMIN_EMAILS || "").split(",")[0];
  if (notify) await sendEmail(notify, `Payment reference received: ${data.invoice_no}`, `<h3>Verify this payment</h3>${rows({ Invoice: data.invoice_no, For: data.title, Amount: `₹${data.amount}`, "UTR / Txn ID": utr, Note: note })}<p>Check your UPI/bank app, then mark it paid in Admin → Invoices.</p>`);
  return NextResponse.json({ ok: true });
}
