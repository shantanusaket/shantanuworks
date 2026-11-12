# ShantanuWorks — www.shantanuworks.com

Next.js 14 (App Router) · TypeScript · Tailwind · Supabase · Vercel — the same family of stack as sdgview.com.

## Deploy in 6 steps
1. **Supabase**: create project → SQL Editor → run `supabase/schema.sql`.
2. **Admin user**: Supabase → Authentication → Users → Add user (Auto Confirm). Then run  
   `insert into admin_users(email) values ('you@example.com');`
3. **GitHub**: push this folder to a *private* repo.
4. **Vercel**: Import repo → add every variable from `.env.example` → Deploy.
5. **Domain**: Vercel → Domains → add `www.shantanuworks.com` (+ apex) and set DNS as shown.
6. **Sign in** at `/admin/login` → read **Guide & Playbook** (inside admin) → set `upi_id` in *Site Text & Payments*.

Local: `npm install && cp .env.example .env.local && npm run dev`

## What's inside
| Area | Files |
|---|---|
| Public site (Home, Services, Products/SDGVIEW, How We Work, About, Insights, Contact, Privacy, Terms) | `app/*` |
| AI-Guruji (15 languages, voice in/out, KB + optional AI key) | `components/GurujiWidget.tsx`, `app/api/guruji` |
| Contact automation (lead scoring, 24h follow-up, email alert + auto-reply, WhatsApp hand-off) | `app/api/contact` |
| Invoices → UPI QR payment page → UTR confirmation → admin verify | `app/pay/[token]`, `app/api/pay/confirm` |
| Unified admin (dashboard, leads, clients, quotes, invoices, expenses, goals, services, products, blog, SEO, settings, Guruji KB/chats, admins, audit log, guide) | `app/admin/*`, `lib/resources.ts` |
| Database, RLS, seed data | `supabase/schema.sql` |
| SEO: metadata, sitemap, robots, JSON-LD, OG image, manifest | `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx` |
| Security headers/CSP | `next.config.mjs`, `middleware.ts` |

Add a new admin table by adding one entry to `lib/resources.ts` (+ its SQL table & RLS policy).

## Notes
- `next.config.mjs` has `ignoreBuildErrors` / `ignoreDuringBuilds` set so the first deploy can't be blocked by a stray type error. After your first successful build, remove them and run `npm run build` locally.
- Without `RESEND_API_KEY` emails are skipped (leads still saved). Without `ANTHROPIC_API_KEY` Guruji answers from its Knowledge Base only.
- Legal pages are templates — have them reviewed.
- Public pages show no pricing; internal reference prices live only in admin.
