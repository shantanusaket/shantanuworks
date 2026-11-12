import Link from "next/link";
import { adminDb } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
const ym = (d: Date | string) => new Date(d).toISOString().slice(0, 7);

function Stat({ label, value, sub, tone = "navy", href }: { label: string; value: string; sub?: string; tone?: string; href?: string }) {
  const c = { navy: "text-navy", green: "text-green-600", red: "text-red-600", blue: "text-brand", amber: "text-amber-600" }[tone];
  const body = (<div className="card h-full"><p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p><p className={`mt-2 font-display text-3xl font-bold ${c}`}>{value}</p>{sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}</div>);
  return href ? <Link href={href} className="block transition hover:-translate-y-0.5">{body}</Link> : body;
}

export default async function Dashboard() {
  const admin = await requireAdmin();
  const db = adminDb();
  if (!db) return <SetupHelp />;
  const today = new Date().toISOString().slice(0, 10);
  // automation: sent invoices past due date become 'overdue'
  await db.from("invoices").update({ status: "overdue" }).eq("status", "sent").lt("due_date", today);
  const [L, I, E, G] = await Promise.all([
    db.from("leads").select("id,created_at,status,est_value,next_followup,name,score").limit(5000),
    db.from("invoices").select("id,amount,status,paid_at,due_date,invoice_no,title").limit(5000),
    db.from("expenses").select("amount,spent_on").limit(5000),
    db.from("goals").select("*").eq("month", today.slice(0, 7) + "-01").maybeSingle(),
  ]);
  if (L.error) return <SetupHelp err={L.error.message} />;
  const leads = L.data || [], inv = I.data || [], exp = E.data || [];
  const thisM = today.slice(0, 7);
  const paid = inv.filter((i) => i.status === "paid");
  const revM = paid.filter((i) => i.paid_at && ym(i.paid_at) === thisM).reduce((s, i) => s + Number(i.amount), 0);
  const expM = exp.filter((e) => e.spent_on && ym(e.spent_on) === thisM).reduce((s, e) => s + Number(e.amount), 0);
  const outstanding = inv.filter((i) => ["sent", "overdue", "payment_submitted"].includes(i.status));
  const outAmt = outstanding.reduce((s, i) => s + Number(i.amount), 0);
  const overdue = inv.filter((i) => i.status === "overdue");
  const open = leads.filter((l) => !["won", "lost"].includes(l.status));
  const pipeline = open.reduce((s, l) => s + Number(l.est_value || 0), 0);
  const newM = leads.filter((l) => ym(l.created_at) === thisM).length;
  const won = leads.filter((l) => l.status === "won").length;
  const conv = leads.length ? Math.round((won / leads.length) * 100) : 0;
  const target = Number(G.data?.revenue_target || 0), lt = Number(G.data?.leads_target || 0);
  const pct = target ? Math.min(100, Math.round((revM / target) * 100)) : 0;
  const months = Array.from({ length: 6 }, (_, k) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - (5 - k)); const key = d.toISOString().slice(0, 7); return { key, label: d.toLocaleString("en-IN", { month: "short" }), v: paid.filter((i) => i.paid_at && ym(i.paid_at) === key).reduce((s, i) => s + Number(i.amount), 0) }; });
  const max = Math.max(1, ...months.map((m) => m.v));
  const stale = leads.filter((l) => l.status === "new" && Date.now() - new Date(l.created_at).getTime() > 86400000);
  const due = leads.filter((l) => l.next_followup && l.next_followup <= today && !["won", "lost"].includes(l.status));
  const verify = inv.filter((i) => i.status === "payment_submitted");

  const todo = [
    { n: verify.length, t: "payments to verify → check bank/UPI then Mark paid", href: "/admin/invoices", tone: "amber" },
    { n: stale.length, t: "new leads waiting over 24h → reply now", href: "/admin/leads", tone: "red" },
    { n: due.length, t: "follow-ups due today", href: "/admin/leads", tone: "blue" },
    { n: overdue.length, t: "overdue invoices → send a WhatsApp reminder", href: "/admin/invoices", tone: "red" },
  ].filter((x) => x.n > 0);
  const checks = [
    ["Service key (database access)", !!process.env.SUPABASE_SERVICE_ROLE_KEY], ["UPI ID set (payment QR)", null],
    ["Email automation (RESEND_API_KEY)", !!process.env.RESEND_API_KEY], ["AI-Guruji AI key (ANTHROPIC_API_KEY)", !!process.env.ANTHROPIC_API_KEY], ["Admin allow-list (ADMIN_EMAILS)", !!process.env.ADMIN_EMAILS],
  ] as [string, boolean | null][];
  const { data: upi } = await db.from("site_settings").select("value").eq("key", "upi_id").maybeSingle();
  checks[1][1] = !!upi?.value;

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div><h1 className="text-3xl font-bold">Money Map</h1><p className="text-slate-600">Welcome, {admin.email}. Everything here is private to you.</p></div>

      <section aria-label="Today’s actions" className="card">
        <h2 className="text-lg font-bold">✅ Do these today</h2>
        {todo.length === 0 ? <p className="mt-2 text-sm text-slate-500">All clear. Best use of time: message 5 past contacts or publish an Insight post.</p> :
          <ul className="mt-3 space-y-2">{todo.map((x) => <li key={x.t}><Link href={x.href} className="flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3 text-sm hover:bg-slate-100"><b className="rounded-full bg-navy px-2.5 py-0.5 text-white">{x.n}</b>{x.t}</Link></li>)}</ul>}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Revenue this month" value={inr(revM)} sub={target ? `${pct}% of ${inr(target)} goal` : "Set a goal in Monthly Goals"} tone="green" href="/admin/invoices" />
        <Stat label="Net profit this month" value={inr(revM - expM)} sub={`Expenses ${inr(expM)}`} tone={revM - expM >= 0 ? "green" : "red"} href="/admin/expenses" />
        <Stat label="Outstanding (to collect)" value={inr(outAmt)} sub={`${outstanding.length} invoice(s), ${overdue.length} overdue`} tone={overdue.length ? "red" : "amber"} href="/admin/invoices" />
        <Stat label="Pipeline value" value={inr(pipeline)} sub={`${open.length} open lead(s)`} tone="blue" href="/admin/leads" />
        <Stat label="New leads this month" value={String(newM)} sub={lt ? `Target ${lt}` : undefined} href="/admin/leads" />
        <Stat label="Lead → client conversion" value={`${conv}%`} sub={`${won} won of ${leads.length}`} />
        <Stat label="Total collected (all time)" value={inr(paid.reduce((s, i) => s + Number(i.amount), 0))} sub={`${paid.length} paid invoice(s)`} tone="green" />
        <Stat label="Total expenses (all time)" value={inr(exp.reduce((s, e) => s + Number(e.amount), 0))} href="/admin/expenses" />
      </section>

      {target > 0 && <section className="card"><div className="flex justify-between text-sm"><b>Monthly revenue goal</b><span>{inr(revM)} / {inr(target)}</span></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundImage: "linear-gradient(90deg,#2563EB,#06B6D4)" }} /></div></section>}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="card"><h2 className="text-lg font-bold">Revenue — last 6 months</h2>
          <div className="mt-6 flex h-44 items-end gap-3" role="img" aria-label="Revenue bar chart">
            {months.map((m) => (<div key={m.key} className="flex flex-1 flex-col items-center justify-end gap-1"><span className="text-[10px] text-slate-500">{m.v ? inr(m.v) : ""}</span><div className="w-full rounded-t-lg" style={{ height: `${Math.max(4, (m.v / max) * 100)}%`, backgroundImage: "linear-gradient(180deg,#06B6D4,#2563EB)" }} /><span className="text-xs text-slate-500">{m.label}</span></div>))}
          </div></div>
        <div className="card"><h2 className="text-lg font-bold">Lead pipeline</h2>
          <ul className="mt-4 space-y-3">{["new", "contacted", "discussion", "quoted", "won", "lost"].map((s) => { const n = leads.filter((l) => l.status === s).length; return (<li key={s}><div className="flex justify-between text-sm"><span className="capitalize">{s}</span><b>{n}</b></div><div className="mt-1 h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-brand" style={{ width: `${leads.length ? (n / leads.length) * 100 : 0}%` }} /></div></li>); })}</ul></div>
      </section>

      <section className="card"><h2 className="text-lg font-bold">🛠 Setup health</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">{checks.map(([t, ok]) => <li key={t} className="flex items-center gap-2 text-sm"><span>{ok ? "✅" : "⚠️"}</span>{t}{!ok && <Link href="/admin/guide#setup" className="text-xs font-semibold text-brand">how to fix</Link>}</li>)}</ul></section>
    </div>
  );
}
function SetupHelp({ err }: { err?: string }) {
  return (<div className="mx-auto max-w-2xl card"><h1 className="text-2xl font-bold">Almost there — connect Supabase</h1><p className="mt-2 text-slate-600">{err ? `Database said: ${err}. ` : ""}Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in Vercel, run <code>supabase/schema.sql</code>, then redeploy. Open the <Link className="text-brand underline" href="/admin/guide#setup">Guide</Link> for step-by-step help.</p></div>);
}
