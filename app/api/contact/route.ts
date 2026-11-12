import { NextResponse } from "next/server";
import { adminDb } from "@/lib/supabase/admin";
import { clean, isEmail, isPhone, esc } from "@/lib/validate";
import { ipOf, limited } from "@/lib/ratelimit";
import { sendEmail, rows } from "@/lib/email";
import { SITE, waLink } from "@/lib/site";

export const runtime = "nodejs";
const VALUE: Record<string, number> = { "Website Development": 20000, "Dashboard Development": 15000, "Data Management": 8000, "Reporting & Visualization": 8000, "Business Automation": 12000, "AI Solution": 25000, "Custom Digital Platform": 40000, "Consultation": 3000 };

export async function POST(req: Request) {
  if (limited(`c:${ipOf(req)}`, 5, 10 * 60_000)) return NextResponse.json({ ok: false, error: "Too many requests. Please try again in a few minutes." }, { status: 429 });
  let b: any;
  try { b = await req.json(); } catch { return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 }); }

  // Bot traps: honeypot + form must have been open ≥ 3 seconds
  if (b.website) return NextResponse.json({ ok: true });
  if (!b.ts || Date.now() - Number(b.ts) < 3000) return NextResponse.json({ ok: false, error: "Please take a moment to review and submit again." }, { status: 400 });

  const name = clean(b.name, 100), email = clean(b.email, 200).toLowerCase(), phone = clean(b.phone, 20);
  const message = clean(b.message, 2000);
  if (!name || name.length < 2) return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  if (!isEmail(email)) return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  if (phone && !isPhone(phone)) return NextResponse.json({ ok: false, error: "Please enter a valid phone number." }, { status: 400 });
  if (message.length < 10) return NextResponse.json({ ok: false, error: "Please tell us a little more in the message." }, { status: 400 });

  const lead = {
    name, email, phone: phone || null,
    organization: clean(b.organization, 120) || null, project_type: clean(b.project_type, 60) || null,
    goals: clean(b.goals, 300) || null, message, contact_method: clean(b.contact_method, 30) || null,
    source: clean(b.source, 30) || "website", lang: clean(b.lang, 8) || "en",
  } as any;
  lead.est_value = VALUE[lead.project_type || ""] || 0;
  lead.score = Math.min(100, 20 + (phone ? 25 : 0) + (lead.goals ? 10 : 0) + (message.length > 120 ? 15 : 0) + (lead.organization ? 10 : 0) + (lead.est_value >= 15000 ? 20 : 0));
  lead.next_followup = new Date(Date.now() + 86400000).toISOString().slice(0, 10); // follow up within 24h

  const db = adminDb();
  if (!db) return NextResponse.json({ ok: false, error: "Our inbox is being set up. Please contact us on WhatsApp." }, { status: 503 });
  const { error } = await db.from("leads").insert(lead);
  if (error) { console.error("lead insert", error.message); return NextResponse.json({ ok: false, error: "Could not save your inquiry. Please try WhatsApp." }, { status: 500 }); }

  // Automation: alert owner + auto-reply (no-ops if RESEND_API_KEY is not set)
  const notify = process.env.NOTIFY_EMAIL || (process.env.ADMIN_EMAILS || "").split(",")[0];
  await Promise.all([
    notify && sendEmail(notify, `New lead (${lead.score}/100): ${name}`, `<h3>New inquiry</h3>${rows({ Name: name, Organization: lead.organization || "", Email: email, Phone: phone, Type: lead.project_type || "", Goals: lead.goals || "", Message: message, Score: String(lead.score) })}<p><a href="${SITE.url}/admin/leads">Open in admin</a></p>`, email),
    sendEmail(email, "We’ve received your inquiry – ShantanuWorks", `<p>Hi ${esc(name)},</p><p>Thank you for reaching out. We’ll review your inquiry personally and reply with clear next steps within 24 hours.</p><p>— Team ShantanuWorks<br/>${SITE.slogan}</p>`),
  ]);
  return NextResponse.json({ ok: true, wa: waLink(`Hello ShantanuWorks, I'm ${name}. I just submitted an inquiry on your website${lead.project_type ? ` about ${lead.project_type}` : ""}.`) });
}
