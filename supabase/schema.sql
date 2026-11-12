-- ShantanuWorks – database schema, security (RLS) and starter data.
-- Run ONCE in Supabase → SQL Editor → New query → paste all → Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).

create extension if not exists pgcrypto;

-- ───────── Admin allow-list ─────────
create table if not exists admin_users (
  email text primary key,
  created_at timestamptz default now()
);
create or replace function is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admin_users where lower(email) = lower(coalesce(auth.jwt() ->> 'email','')));
$$;

-- ───────── Public website content ─────────
create table if not exists site_settings (
  key text primary key, value text, is_public boolean default true, note text
);
create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, summary text, description text,
  deliverables jsonb default '[]'::jsonb, icon text default 'chart',
  base_price numeric default 0,            -- INTERNAL reference price (never shown publicly)
  sort int default 10, published boolean default true, created_at timestamptz default now()
);
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, name text not null, tagline text, url text, description text,
  highlights jsonb default '[]'::jsonb, sort int default 10, published boolean default true
);
create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, title text not null, excerpt text, body text, cover text,
  published boolean default false, published_at timestamptz default now()
);
create table if not exists seo_pages (
  id uuid primary key default gen_random_uuid(),
  path text unique not null, title text, description text, og_image text, noindex boolean default false
);

-- ───────── Money engine (private) ─────────
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text, organization text, email text, phone text,
  project_type text, goals text, message text, contact_method text,
  source text default 'website', lang text default 'en',
  est_value numeric default 0, score int default 0,
  status text default 'new',               -- new, contacted, discussion, quoted, won, lost
  next_followup date, notes text
);
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text not null, organization text, email text, phone text, notes text, lead_id uuid references leads(id) on delete set null
);
create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  quote_no text, client_id uuid references clients(id) on delete set null,
  title text not null, scope text, amount numeric default 0,
  status text default 'draft',             -- draft, sent, accepted, rejected
  valid_until date
);
create table if not exists invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  invoice_no text, token uuid not null default gen_random_uuid() unique,
  client_id uuid references clients(id) on delete set null, quote_id uuid references quotes(id) on delete set null,
  title text not null, amount numeric not null default 0,
  status text default 'draft',             -- draft, sent, payment_submitted, paid, overdue, cancelled
  due_date date, paid_at timestamptz, utr text, payer_note text
);
create table if not exists expenses (
  id uuid primary key default gen_random_uuid(),
  spent_on date default current_date, category text, description text, amount numeric default 0,
  created_at timestamptz default now()
);
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  month date unique not null,              -- use the 1st of the month, e.g. 2026-12-01
  revenue_target numeric default 0, leads_target int default 0
);

-- ───────── AI Guruji ─────────
create table if not exists guruji_kb (
  id uuid primary key default gen_random_uuid(),
  question text not null, answer text not null, keywords text, published boolean default true
);
create table if not exists guruji_chats (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(), session text, lang text, question text, answer text
);

-- ───────── Audit trail ─────────
create table if not exists audit_log (
  id bigserial primary key, at timestamptz default now(),
  actor text, action text, resource text, row_id text, detail jsonb
);

create index if not exists leads_status_idx on leads(status, created_at desc);
create index if not exists invoices_status_idx on invoices(status, due_date);
create index if not exists chats_created_idx on guruji_chats(created_at desc);

-- ───────── ROW LEVEL SECURITY ─────────
do $$
declare t text;
begin
  foreach t in array array['admin_users','site_settings','services','products','posts','seo_pages','leads','clients','quotes','invoices','expenses','goals','guruji_kb','guruji_chats','audit_log']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('drop policy if exists "admin all" on %I', t);
    execute format('create policy "admin all" on %I for all to authenticated using (is_admin()) with check (is_admin())', t);
  end loop;
end $$;

-- Public (anonymous) may ONLY read published website content. Everything else is admin-only.
drop policy if exists "public read" on services;   create policy "public read" on services   for select to anon, authenticated using (published);
drop policy if exists "public read" on products;   create policy "public read" on products   for select to anon, authenticated using (published);
drop policy if exists "public read" on posts;      create policy "public read" on posts      for select to anon, authenticated using (published);
drop policy if exists "public read" on seo_pages;  create policy "public read" on seo_pages  for select to anon, authenticated using (true);
drop policy if exists "public read" on site_settings; create policy "public read" on site_settings for select to anon, authenticated using (is_public);

-- ───────── STARTER DATA ─────────
insert into site_settings(key,value,is_public,note) values
 ('hero_title','Building What’s Next.',true,'Home page big headline'),
 ('hero_sub','We help organizations design, build and scale intelligent digital systems powered by technology, data and artificial intelligence.',true,'Home page sub-headline'),
 ('upi_id','',true,'Your UPI ID, e.g. name@bank – shown on invoice payment pages'),
 ('upi_name','ShantanuWorks',true,'Name shown to payers in UPI apps'),
 ('business_hours','Mon–Sat, 10:00–19:00 IST',true,'Shown on Contact page'),
 ('location','India',true,'Shown on Contact page'),
 ('guruji_greeting','Namaste! I’m AI-Guruji. Ask me about our services, how projects work, or how to get started — in any language you like.',true,'First message in the AI-Guruji chat'),
 ('guruji_extra_rules','Never share internal prices, margins or business strategy. Invite the visitor to share their requirement via the Contact page or WhatsApp.',false,'Extra private instructions for AI-Guruji')
on conflict (key) do nothing;

insert into services(slug,title,summary,description,deliverables,icon,base_price,sort) values
 ('data-intelligence','Data Intelligence','Transform information into actionable insight through dashboards, analytics and decision-support systems.','We structure your scattered data, connect your sources and build dashboards that leaders actually use.','["KPI & executive dashboards","Excel, Power BI & SQL reporting","Data cleaning & validation","MIS & performance reports","Data visualisation & infographics"]','chart',15000,1),
 ('artificial-intelligence','Artificial Intelligence','AI assistants, knowledge systems and intelligent workflows that enhance productivity and decisions.','We deploy practical AI — multilingual assistants, document search and smart workflows.','["Multilingual AI assistants","Knowledge-base & document search","AI-assisted workflows","Lead qualification bots","AI readiness consultation"]','brain',25000,2),
 ('digital-products-platforms','Digital Products & Platforms','Modern websites, business applications, portals and SaaS platforms engineered for growth.','From a credible business website to a full custom platform with logins, databases and payments.','["Business & portfolio websites","Web applications & portals","SaaS & custom platforms","SEO-ready architecture","Secure admin panels"]','globe',20000,3),
 ('automation-operations','Automation & Operations','Streamline processes and remove repetitive work with intelligent automation.','Reports, reminders, follow-ups and approvals that run by themselves — with checks along the way.','["Reporting automation","Lead & follow-up workflows","Invoice & payment reminders","Email / WhatsApp notifications","Process mapping"]','gear',12000,4),
 ('presentations-reports','Presentations & Reports','Pitch decks, company profiles and professional reports that support decisions.','We turn complex information into polished decks and reports your audience understands at a glance.','["Pitch & proposal decks","Company profiles","Strategy presentations","Annual & impact reports","Decision-support reports"]','doc',6000,5),
 ('consulting','Consultation & Strategy','Not sure what to build? We help you define priorities and a practical path.','A focused discovery conversation to evaluate opportunities and plan delivery in clear phases.','["Discovery call","Solution roadmap","Scope & timeline","Technology selection","Implementation support"]','compass',3000,6)
on conflict (slug) do nothing;

insert into products(slug,name,tagline,url,description,highlights,sort) values
 ('sdgview','SDGVIEW','Analytics • Automation • Impact','https://www.sdgview.com','SDGVIEW is a live analytics and automation platform — Excel and Power BI dashboards, KPI tracking, MIS and SQL reporting and workflow automation — built for schools, NGOs, small businesses and consultants.','["Knowledge architecture","Data intelligence","Analytics systems","Content & SEO architecture","Scalable cloud deployment","AI companion (CoMentor)"]',1)
on conflict (slug) do nothing;

insert into seo_pages(path,title,description) values
 ('/','ShantanuWorks – Ideas. Engineered for Impact.','Technology, data and AI solutions: dashboards, AI assistants, automation and modern web platforms. Flagship product: SDGVIEW.'),
 ('/services','Services – Data, AI, Automation & Web Platforms | ShantanuWorks','Data intelligence, AI assistants, automation and digital platforms engineered for measurable impact.'),
 ('/products','Products – SDGVIEW | ShantanuWorks','SDGVIEW is ShantanuWorks’ flagship analytics and automation platform, live at sdgview.com.'),
 ('/how-we-work','How We Work | ShantanuWorks','Discover, Design, Build, Launch, Evolve — a clear, transparent delivery process.'),
 ('/about','About ShantanuWorks','From insight to impact: our mission, vision and approach.'),
 ('/contact','Contact & Start a Project | ShantanuWorks','Share your goals and get a clear plan and quote. WhatsApp, email or call.'),
 ('/insights','Insights | ShantanuWorks','Practical ideas on data, AI, automation and digital growth.')
on conflict (path) do nothing;

insert into guruji_kb(question,answer,keywords) values
 ('What does ShantanuWorks do?','ShantanuWorks designs, builds and scales intelligent digital systems: data dashboards, AI assistants, automation and modern websites and platforms.','what do you do services about'),
 ('How do I start a project?','Open the Contact page and share your goals, or message us on WhatsApp. We review every inquiry personally and reply with next steps.','start begin hire project contact quote'),
 ('How does payment work?','After you accept a quote you receive an invoice with a secure payment page: pay by UPI or bank transfer and confirm with your transaction reference.','payment pay upi cost price invoice'),
 ('What is SDGVIEW?','SDGVIEW is our flagship live analytics and automation platform at sdgview.com.','sdgview product platform')
on conflict do nothing;

insert into goals(month,revenue_target,leads_target) values (date_trunc('month', now())::date, 50000, 20) on conflict (month) do nothing;

-- ───────── FIRST ADMIN ─────────
-- 1) Supabase → Authentication → Users → Add user (your email + strong password, tick "Auto Confirm").
-- 2) Replace the email below with yours and run this line:
-- insert into admin_users(email) values ('you@example.com') on conflict do nothing;
