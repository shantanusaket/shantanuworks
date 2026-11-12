import { requireAdmin } from "@/lib/auth";
import { RESOURCES } from "@/lib/resources";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
const H = ({ id, children }: { id: string; children: React.ReactNode }) => <h2 id={id} className="mt-10 scroll-mt-6 border-b pb-2 text-2xl font-bold">{children}</h2>;
const Steps = ({ items }: { items: React.ReactNode[] }) => <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm leading-6 text-slate-700">{items.map((x, i) => <li key={i}>{x}</li>)}</ol>;
const Table = ({ head, rows }: { head: string[]; rows: string[][] }) => (
  <div className="mt-3 overflow-x-auto rounded-xl border bg-white"><table className="w-full min-w-[520px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr>{head.map((h) => <th key={h} className="px-4 py-2">{h}</th>)}</tr></thead><tbody className="divide-y">{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} className={`px-4 py-2 align-top ${j === 0 ? "font-semibold text-navy" : ""}`}>{c}</td>)}</tr>)}</tbody></table></div>
);

export default async function Guide() {
  await requireAdmin();
  return (
    <div className="mx-auto max-w-4xl pb-20">
      <h1 className="text-3xl font-bold">📘 Guide & Playbook</h1>
      <p className="mt-1 text-slate-600">Private. Visitors never see this page, your prices, or your strategy.</p>
      <nav className="mt-4 flex flex-wrap gap-2 text-sm">{[["setup", "1 Setup"], ["daily", "2 Daily routine"], ["money", "3 Earning playbook"], ["buttons", "4 Every button"], ["tools", "5 Software to use"], ["seo", "6 SEO"], ["security", "7 Security"], ["trouble", "8 Troubleshooting"]].map(([h, t]) => <a key={h} href={`#${h}`} className="rounded-full bg-white px-3 py-1.5 font-medium text-brand shadow-sm hover:bg-brand hover:text-white">{t}</a>)}</nav>

      <H id="setup">1 · First-time setup (30–45 minutes)</H>
      <Steps items={[
        <>Create a free project at <b>supabase.com</b>. Open <b>SQL Editor → New query</b>, paste the whole of <code>supabase/schema.sql</code>, press <b>Run</b>.</>,
        <>Supabase → <b>Authentication → Users → Add user</b>: your email + a long unique password, tick <i>Auto Confirm</i>. Then in SQL Editor run: <code>insert into admin_users(email) values (&apos;your@email.com&apos;);</code></>,
        <>Supabase → <b>Project Settings → API</b>: copy <b>Project URL</b>, <b>anon key</b> and <b>service_role key</b>. The service_role key is a SECRET — only ever paste it into Vercel.</>,
        <>Push the project to a private GitHub repo → Vercel → <b>Add New Project</b> → import it. Under <b>Environment Variables</b> add everything from <code>.env.example</code>. Deploy.</>,
        <>Vercel → Project → <b>Domains</b>: add <code>www.shantanuworks.com</code> and <code>shantanuworks.com</code>; set the DNS records Vercel shows at your domain registrar. HTTPS is automatic.</>,
        <>Open <code>/admin/login</code> and sign in. Go to <b>Site Text & Payments</b> and set <b>upi_id</b> (your UPI ID) and <b>upi_name</b>.</>,
        <>(Optional) <b>Resend.com</b>: verify your domain, create an API key → set <code>RESEND_API_KEY</code>, <code>EMAIL_FROM</code>, <code>NOTIFY_EMAIL</code> to get instant lead alerts and auto-reply to clients.</>,
        <>(Optional) <b>console.anthropic.com</b>: create an API key → <code>ANTHROPIC_API_KEY</code>. This makes AI-Guruji answer intelligently in 15 languages. Without it, Guruji answers from your Knowledge Base only.</>,
        <>Do a test: submit the Contact form, check Leads. Create a ₹1 test invoice for yourself, open its pay link, pay ₹1, submit the UTR, press <b>Mark paid</b>.</>,
      ]} />

      <H id="daily">2 · Your daily 20-minute routine</H>
      <Steps items={["Open Dashboard → clear the ‘Do these today’ list top to bottom.", "Reply to every new lead within 1 hour (WhatsApp button). Speed alone wins many projects.", "Move lead statuses forward; set the next follow-up date every time.", "Verify submitted payments in your UPI/bank app, then press Mark paid.", "Log any expense you made today (30 seconds).", "Once a week: read Guruji Chats, add 2 Q&As, publish 1 Insight post.", "On the 1st of each month: set the new Monthly Goal; review last month’s profit."]} />

      <H id="money">3 · Earning playbook (kept private)</H>
      <p className="mt-2 text-sm text-slate-600">Everything on this website funnels visitors into one number: <b>paid invoices</b>. Treat these as strong suggestions to test, not guarantees — your market will tell you what works.</p>
      <Table head={["Lever", "What to do", "Where in admin"]} rows={[
        ["1. Capture", "Every visitor has 3 ways to reach you: form, WhatsApp, AI-Guruji. Make sure phone/WhatsApp are correct in env vars.", "Leads"],
        ["2. Speed", "Reply < 1 hour; follow up on day 1, 3, 7, 14. Most deals are lost to silence, not price.", "Leads → Next follow-up"],
        ["3. Qualify", "Ask: goal, deadline, budget range, decision maker. Use the Score (0–100) to prioritise.", "Leads → Notes / Est. value"],
        ["4. Quote", "Quote an outcome (‘dashboard that tracks X’), not hours. Offer 3 options: Basic / Standard / Premium — most pick the middle.", "Quotes"],
        ["5. Advance", "Take 40–50% advance before starting; balance on delivery. Two invoices per project.", "Quotes → Make invoice"],
        ["6. Collect", "Send the pay link on WhatsApp, not just email. Chase overdue the same day.", "Invoices"],
        ["7. Repeat", "Offer a monthly support/reporting retainer after delivery — recurring revenue is the real goal.", "Quotes (monthly)"],
        ["8. Proof", "After each project (with permission) publish an anonymised result as an Insight post. SDGVIEW is your live proof — link to it in every proposal.", "Insights / Products"],
      ]} />
      <h3 className="mt-6 text-lg font-semibold">Suggested offer ladder</h3>
      <Table head={["Tier", "Example offers (reference prices — set your own)", "Purpose"]} rows={[
        ["Entry (₹3k–8k)", "Discovery call, data-cleaning sprint, single dashboard, pitch deck", "Easy yes; builds trust"],
        ["Core (₹15k–40k)", "Business website, KPI/MIS dashboard system, automation workflow, AI assistant", "Main revenue"],
        ["Premium (₹50k+)", "Custom platform, multi-source analytics, AI knowledge system", "High margin, referrals"],
        ["Retainer (monthly)", "Reporting upkeep, updates, support, new features", "Predictable income"],
      ]} />
      <p className="mt-3 text-sm text-slate-600">Public pages deliberately show <i>no prices</i> — price after understanding the need. Your internal reference prices live in Services → ‘Internal base price’. Lead ‘Est. value’ is auto-filled from them.</p>
      <h3 className="mt-6 text-lg font-semibold">Where leads come from</h3>
      <ul className="mt-2 list-disc space-y-1 pl-6 text-sm text-slate-700"><li>Google (this site’s SEO + Insights posts + Google Business Profile).</li><li>SDGVIEW → every SDGVIEW page already links to ShantanuWorks: keep that link prominent.</li><li>LinkedIn & WhatsApp status: post one result/insight per week.</li><li>Referrals: ask every happy client for 2 introductions; offer a small thank-you.</li></ul>

      <H id="buttons">4 · What every button does</H>
      <p className="mt-2 text-sm text-slate-600">Hover any button in the panel for a tooltip. Common controls on every list page:</p>
      <Table head={["Control", "What it does"]} rows={[
        ["🔍 Search", "Filters the table instantly (searches all columns)."], ["Status filter", "Show only one stage (e.g. only ‘quoted’ leads)."], ["⬇ Export CSV", "Downloads the visible rows to open in Excel / Google Sheets / Power BI."],
        ["＋ New", "Opens a form to add a record. Fields marked * are required."], ["Edit", "Opens the same form with existing values. Save applies instantly to the live site."], ["Delete", "Permanently removes the record (asks to confirm)."],
      ]} />
      {RESOURCES.map((r) => (
        <div key={r.key} className="mt-6 rounded-2xl border bg-white p-5">
          <h3 className="font-bold">{r.icon} {r.title} <a className="ml-2 text-xs font-medium text-brand" href={`/admin/${r.key}`}>open →</a></h3>
          <p className="mt-1 text-sm text-slate-600">{r.intro}</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">{r.guide.map((g) => <li key={g}>{g}</li>)}</ul>
          {r.actions && <p className="mt-2 text-sm"><b>Buttons:</b> {r.actions.map((a) => `“${a.label}” — ${a.help}`).join("  ·  ")}</p>}
        </div>))}

      <H id="tools">5 · Which software to use to design, build and control the website</H>
      <Table head={["Job", "Tool", "Notes"]} rows={[
        ["Change text, services, SEO, blog, payments", "This admin panel", "No coding needed. Saves instantly."],
        ["Edit database visually", "Supabase → Table Editor", "Spreadsheet-like view of all data. Be careful deleting."],
        ["Change layout, colours, new pages", "VS Code (free) + GitHub + Vercel", "Edit the project, commit → Vercel redeploys automatically in ~1 minute. An AI coding assistant such as Claude Code or Cursor can make these edits for you from plain-English requests."],
        ["Logos, social posts, banners", "Canva or Figma (free tiers)", "Your brand colours: Navy #0F172A, Blue #2563EB, Cyan #06B6D4, Teal #14B8A6, Light #F8FAFC. Logos are in /public/brand."],
        ["Client dashboards (your service work)", "Excel + Power Query, Power BI Desktop, Looker Studio", "What you sell. Deliver files + training."],
        ["Pitch decks / reports", "PowerPoint, Canva, Google Slides", "Reuse one template per client type."],
        ["Domain & DNS", "Your registrar (GoDaddy / Namecheap) or Cloudflare", "Records come from Vercel → Domains."],
        ["Visitors & Google ranking", "Google Search Console + Vercel Analytics", "Free. See SEO section."],
        ["Email", "Resend (sending) + Gmail/Workspace (receiving)", "Optional but recommended."],
        ["Accounting", "Export CSVs from Invoices & Expenses → give to your CA", "GST/ITR rules depend on your registration — confirm with a CA."],
      ]} />

      <H id="seo">6 · SEO — what’s built in and what you must do</H>
      <p className="mt-2 text-sm text-slate-700"><b>Built in:</b> fast server-rendered pages, unique title/description per page (editable in SEO Controls), canonical URLs, auto sitemap.xml and robots.txt, structured data (Organization, Service, SoftwareApplication, Article), social share image, mobile-first responsive layout, accessible markup, private pages blocked from Google.</p>
      <p className="mt-2 text-sm text-slate-700"><b>Nobody can guarantee rank #1</b> — rankings depend on content, links and time. These actions move the needle:</p>
      <Steps items={[<>Go to <b>search.google.com/search-console</b> → add property <code>{SITE.url}</code> → verify (DNS or put the token in <code>NEXT_PUBLIC_GSC_VERIFICATION</code>) → <b>Sitemaps</b> → submit <code>sitemap.xml</code>.</>, "Create a free Google Business Profile for ShantanuWorks (service-area business).", "Publish one helpful Insight post per week targeting a real question (e.g. ‘Power BI dashboard cost for NGOs in India’).", "Get links: SDGVIEW already links here; add LinkedIn, Google Business, directories, guest posts.", "Keep pages fast: compress any images you upload (< 200 KB) and keep titles unique.", "Check Search Console monthly: fix errors, see which queries bring clicks, write more on those."]} />

      <H id="security">7 · Security — what protects you</H>
      <ul className="mt-2 list-disc space-y-1.5 pl-6 text-sm text-slate-700">
        <li><b>Admin gate:</b> middleware blocks /admin without a valid session; every page and every action re-checks that your email is on the allow-list. Login attempts are rate-limited.</li>
        <li><b>Database:</b> Row Level Security is ON for every table. The public (anon key) can only read published website content; leads, money and chats are unreachable from the browser.</li>
        <li><b>Secrets:</b> the service-role key lives only on the server (Vercel). Never share it, commit it, or put it in NEXT_PUBLIC_ variables.</li>
        <li><b>Headers:</b> CSP, HSTS, no-framing, no-sniff, strict referrer policy; admin and payment pages are no-index and no-store.</li>
        <li><b>Forms:</b> server-side validation, honeypot, timing check and per-IP limits on the contact form, chat and payment confirmation.</li>
        <li><b>Payments:</b> the site never marks an invoice paid by itself. You confirm in your bank/UPI app, then press Mark paid.</li>
        <li><b>Your part:</b> use a long unique password + password manager; turn on <b>Supabase Auth → MFA</b> and your email’s 2-step login; keep ADMIN_EMAILS short; enable Vercel Firewall rate-limit rules and Supabase daily backups (paid plans) once you have real clients.</li>
      </ul>

      <H id="trouble">8 · Troubleshooting</H>
      <Table head={["Problem", "Fix"]} rows={[
        ["‘Invalid email or password’", "User must exist in Supabase Auth (confirmed) AND be in ADMIN_EMAILS or admin_users."],
        ["Dashboard shows ‘connect Supabase’", "Check the 3 Supabase env vars in Vercel, run schema.sql, redeploy."],
        ["Contact form says inbox is being set up", "SUPABASE_SERVICE_ROLE_KEY is missing in Vercel."],
        ["No emails arrive", "Set RESEND_API_KEY and verify your sending domain in Resend; check spam."],
        ["Guruji only gives generic answers", "Add ANTHROPIC_API_KEY; extend the Knowledge Base."],
        ["Invoice page has no QR", "Set upi_id in Site Text & Payments."],
        ["Edited text not showing", "Public pages refresh within ~60 seconds. Hard-refresh the browser."],
      ]} />
    </div>
  );
}
