// One config drives every admin page. Pure data (serialisable) so it can be passed to client components.
export type Field = {
  key: string; label: string;
  type?: "text" | "textarea" | "number" | "money" | "select" | "date" | "bool" | "list" | "relation" | "url" | "email";
  options?: string[]; relation?: { table: string; label: string };
  help?: string; required?: boolean; createOnly?: boolean; readonly?: boolean; placeholder?: string; default?: any;
};
export type Column = { key: string; label: string; type?: "text" | "money" | "date" | "badge" | "relation" | "bool" | "list" | "datetime" };
export type Action = { id: string; label: string; kind: "server" | "copy" | "wa"; confirm?: string; when?: { field: string; in: string[] }; help: string };
export type Resource = {
  key: string; table: string; title: string; group: "Money" | "Website" | "AI Guruji" | "System"; icon: string;
  pk?: string; order: { col: string; asc?: boolean }; statusField?: string;
  columns: Column[]; fields: Field[]; actions?: Action[];
  noCreate?: boolean; noEdit?: boolean; noDelete?: boolean; number?: { key: string; prefix: string };
  intro: string; guide: string[];
};

const LEAD_STATUS = ["new", "contacted", "discussion", "quoted", "won", "lost"];
const INV_STATUS = ["draft", "sent", "payment_submitted", "paid", "overdue", "cancelled"];

export const RESOURCES: Resource[] = [
  {
    key: "leads", table: "leads", title: "Leads & Inquiries", group: "Money", icon: "📥", order: { col: "created_at" }, statusField: "status",
    intro: "Every website form and AI-Guruji inquiry lands here automatically. This is the top of your money funnel.",
    guide: [
      "New inquiries arrive with a score (0–100) — call/WhatsApp the highest scores first.",
      "Use the status filter above the table. Move a lead: new → contacted → discussion → quoted → won / lost.",
      "Button ‘WhatsApp’ opens a ready chat with the lead. Button ‘Make client’ copies the lead into Clients so you can quote and invoice.",
      "Always set ‘Next follow-up’ — the dashboard lists every follow-up due today.",
      "‘Est. value’ (₹) feeds the Pipeline Value on the dashboard. Update it after you discuss scope.",
    ],
    columns: [{ key: "created_at", label: "Received", type: "date" }, { key: "name", label: "Name" }, { key: "project_type", label: "Type" }, { key: "phone", label: "Phone" }, { key: "score", label: "Score" }, { key: "est_value", label: "Est. ₹", type: "money" }, { key: "status", label: "Status", type: "badge" }, { key: "next_followup", label: "Follow-up", type: "date" }],
    fields: [
      { key: "name", label: "Name", required: true }, { key: "organization", label: "Organization" }, { key: "email", label: "Email", type: "email" }, { key: "phone", label: "Phone / WhatsApp" },
      { key: "project_type", label: "Project type" }, { key: "goals", label: "Goals" }, { key: "message", label: "Message", type: "textarea" },
      { key: "contact_method", label: "Preferred contact" }, { key: "source", label: "Source", help: "website, guruji, referral, social…" },
      { key: "est_value", label: "Estimated value (₹)", type: "money" }, { key: "status", label: "Status", type: "select", options: LEAD_STATUS, default: "new" },
      { key: "next_followup", label: "Next follow-up", type: "date" }, { key: "notes", label: "Private notes", type: "textarea", help: "Only you can see this." },
    ],
    actions: [
      { id: "wa", label: "WhatsApp", kind: "wa", help: "Opens WhatsApp chat with this lead." },
      { id: "convertToClient", label: "Make client", kind: "server", confirm: "Create a client record from this lead?", help: "Copies details into Clients and moves the lead to ‘discussion’." },
    ],
  },
  {
    key: "clients", table: "clients", title: "Clients", group: "Money", icon: "🤝", order: { col: "created_at" },
    intro: "People and organizations you quote and invoice.",
    guide: ["Add clients manually or with ‘Make client’ from a lead.", "A client must exist before you can create a quote or invoice for them.", "Use Notes for requirements, GST details or preferences (private)."],
    columns: [{ key: "name", label: "Name" }, { key: "organization", label: "Organization" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "created_at", label: "Added", type: "date" }],
    fields: [{ key: "name", label: "Name", required: true }, { key: "organization", label: "Organization" }, { key: "email", label: "Email", type: "email" }, { key: "phone", label: "Phone / WhatsApp" }, { key: "notes", label: "Private notes", type: "textarea" }],
    actions: [{ id: "wa", label: "WhatsApp", kind: "wa", help: "Opens WhatsApp chat." }],
  },
  {
    key: "quotes", table: "quotes", title: "Quotes", group: "Money", icon: "🧾", order: { col: "created_at" }, statusField: "status", number: { key: "quote_no", prefix: "QT" },
    intro: "Price proposals. A quote is a promise; an invoice is a request for money.",
    guide: ["Create a quote after the discussion call: pick the client, write the scope clearly, enter the amount (₹).", "Status: draft → sent → accepted / rejected. Set ‘valid until’ to create gentle urgency (7–14 days).", "When the client says yes, press ‘Make invoice’ — it creates the invoice automatically and marks the quote accepted.", "Tip: quote in phases (e.g. 50% advance, 50% on delivery) by creating two invoices."],
    columns: [{ key: "quote_no", label: "No." }, { key: "client_id", label: "Client", type: "relation" }, { key: "title", label: "Title" }, { key: "amount", label: "Amount", type: "money" }, { key: "status", label: "Status", type: "badge" }, { key: "valid_until", label: "Valid until", type: "date" }],
    fields: [
      { key: "client_id", label: "Client", type: "relation", relation: { table: "clients", label: "name" }, required: true }, { key: "title", label: "Title", required: true },
      { key: "scope", label: "Scope of work", type: "textarea" }, { key: "amount", label: "Amount (₹)", type: "money", required: true },
      { key: "status", label: "Status", type: "select", options: ["draft", "sent", "accepted", "rejected"], default: "draft" }, { key: "valid_until", label: "Valid until", type: "date" },
    ],
    actions: [{ id: "toInvoice", label: "Make invoice", kind: "server", confirm: "Create an invoice from this quote and mark the quote accepted?", when: { field: "status", in: ["draft", "sent"] }, help: "Creates an invoice with a payment link." }],
  },
  {
    key: "invoices", table: "invoices", title: "Invoices & Payments", group: "Money", icon: "💰", order: { col: "created_at" }, statusField: "status", number: { key: "invoice_no", prefix: "INV" },
    intro: "Where money is collected. Each invoice has a private payment page (QR + UPI) you send to the client.",
    guide: [
      "Create an invoice (or use ‘Make invoice’ on a quote). Status starts as draft.",
      "Press ‘Send’ — it marks the invoice sent and emails the client the payment link (if email automation is on).",
      "‘Copy pay link’ copies the private payment page URL — paste into WhatsApp/email.",
      "Client pays by UPI and submits their transaction ID. Status becomes ‘payment_submitted’ and you get an email.",
      "IMPORTANT: open your bank/UPI app, confirm the money arrived, THEN press ‘Mark paid’. Never mark paid on a screenshot alone.",
      "Overdue invoices turn red automatically after the due date. Chase them with WhatsApp.",
    ],
    columns: [{ key: "invoice_no", label: "No." }, { key: "client_id", label: "Client", type: "relation" }, { key: "title", label: "For" }, { key: "amount", label: "Amount", type: "money" }, { key: "status", label: "Status", type: "badge" }, { key: "due_date", label: "Due", type: "date" }, { key: "utr", label: "UTR" }],
    fields: [
      { key: "client_id", label: "Client", type: "relation", relation: { table: "clients", label: "name" }, required: true }, { key: "title", label: "Invoice for", required: true },
      { key: "amount", label: "Amount (₹)", type: "money", required: true }, { key: "status", label: "Status", type: "select", options: INV_STATUS, default: "draft" },
      { key: "due_date", label: "Due date", type: "date" }, { key: "utr", label: "UTR / transaction ID", help: "Filled when the client submits it." }, { key: "payer_note", label: "Payer note" },
    ],
    actions: [
      { id: "send", label: "Send", kind: "server", confirm: "Mark as sent and email the payment link to the client?", when: { field: "status", in: ["draft"] }, help: "Marks sent + emails the pay link." },
      { id: "copyPayLink", label: "Copy pay link", kind: "copy", when: { field: "status", in: ["draft", "sent", "overdue", "payment_submitted"] }, help: "Copies the private payment page URL." },
      { id: "markPaid", label: "Mark paid", kind: "server", confirm: "Have you CONFIRMED the money in your bank/UPI app? This records revenue and emails a receipt.", when: { field: "status", in: ["draft", "sent", "overdue", "payment_submitted"] }, help: "Records revenue and sends confirmation." },
    ],
  },
  {
    key: "expenses", table: "expenses", title: "Expenses", group: "Money", icon: "📉", order: { col: "spent_on" },
    intro: "What the business spends. Profit = revenue − expenses.",
    guide: ["Log every business cost: hosting, domain, software, ads, freelancers, internet.", "Use consistent categories (Hosting, Software, Marketing, Contractors, Tax, Other) to see where money goes.", "The dashboard subtracts this month’s expenses from revenue to show net profit."],
    columns: [{ key: "spent_on", label: "Date", type: "date" }, { key: "category", label: "Category" }, { key: "description", label: "Description" }, { key: "amount", label: "Amount", type: "money" }],
    fields: [{ key: "spent_on", label: "Date", type: "date" }, { key: "category", label: "Category", type: "select", options: ["Hosting", "Software", "Marketing", "Contractors", "Tax", "Equipment", "Other"] }, { key: "description", label: "Description" }, { key: "amount", label: "Amount (₹)", type: "money", required: true }],
  },
  {
    key: "goals", table: "goals", title: "Monthly Goals", group: "Money", icon: "🎯", order: { col: "month" },
    intro: "Targets that drive the progress bars on your dashboard.",
    guide: ["Add one row per month. ‘Month’ must be the 1st (e.g. 2026-12-01).", "Set a revenue target (₹) and a leads target. Review on the 1st of every month."],
    columns: [{ key: "month", label: "Month", type: "date" }, { key: "revenue_target", label: "Revenue target", type: "money" }, { key: "leads_target", label: "Leads target" }],
    fields: [{ key: "month", label: "Month (1st day)", type: "date", required: true }, { key: "revenue_target", label: "Revenue target (₹)", type: "money" }, { key: "leads_target", label: "Leads target", type: "number" }],
  },
  {
    key: "services", table: "services", title: "Services", group: "Website", icon: "🛠️", order: { col: "sort", asc: true },
    intro: "The service cards shown on Home and Services pages.",
    guide: ["‘Slug’ is the URL id (lowercase-with-dashes) — don’t change it after launch.", "‘Deliverables’: one per line.", "‘Internal base price’ is for YOUR reference when quoting. It is never shown publicly.", "Untick ‘Published’ to hide a service instantly. ‘Sort’ controls order (1 first).", "Icons: chart, brain, globe, gear, doc, compass."],
    columns: [{ key: "sort", label: "#" }, { key: "title", label: "Title" }, { key: "slug", label: "Slug" }, { key: "base_price", label: "Internal ₹", type: "money" }, { key: "published", label: "Live", type: "bool" }],
    fields: [{ key: "title", label: "Title", required: true }, { key: "slug", label: "Slug", required: true, createOnly: true }, { key: "summary", label: "Short summary", type: "textarea" }, { key: "description", label: "Full description", type: "textarea" }, { key: "deliverables", label: "Deliverables (one per line)", type: "list" }, { key: "icon", label: "Icon", type: "select", options: ["chart", "brain", "globe", "gear", "doc", "compass"], default: "chart" }, { key: "base_price", label: "Internal base price (₹) – private", type: "money" }, { key: "sort", label: "Sort order", type: "number", default: 10 }, { key: "published", label: "Published", type: "bool", default: true }],
  },
  {
    key: "products", table: "products", title: "Products (SDGVIEW)", group: "Website", icon: "🚀", order: { col: "sort", asc: true },
    intro: "Products owned by ShantanuWorks, shown on the Products page and Home. SDGVIEW is pre-loaded.",
    guide: ["Edit SDGVIEW’s description, tagline or highlights (one per line).", "Add future products as new rows. The first published product (lowest sort) is featured on Home.", "‘URL’ is where the ‘Visit’ button goes."],
    columns: [{ key: "name", label: "Name" }, { key: "tagline", label: "Tagline" }, { key: "url", label: "URL" }, { key: "published", label: "Live", type: "bool" }],
    fields: [{ key: "name", label: "Name", required: true }, { key: "slug", label: "Slug", required: true, createOnly: true }, { key: "tagline", label: "Tagline" }, { key: "url", label: "URL", type: "url" }, { key: "description", label: "Description", type: "textarea" }, { key: "highlights", label: "Highlights (one per line)", type: "list" }, { key: "sort", label: "Sort", type: "number", default: 10 }, { key: "published", label: "Published", type: "bool", default: true }],
  },
  {
    key: "posts", table: "posts", title: "Insights (Blog)", group: "Website", icon: "✍️", order: { col: "published_at" },
    intro: "Articles that bring free Google traffic. Consistent publishing is the cheapest long-term lead source.",
    guide: ["Write helpful posts that answer questions your clients Google (e.g. ‘Excel vs Power BI for NGOs’).", "Body format: blank line = new paragraph, ‘## ’ = heading, lines starting ‘- ’ = bullet list.", "Slug = URL (e.g. power-bi-for-ngos). Keep it short and keyword-rich.", "Excerpt (≈150 chars) becomes the Google description — write it like an ad.", "Tick ‘Published’ to go live. It joins the sitemap automatically."],
    columns: [{ key: "published_at", label: "Date", type: "date" }, { key: "title", label: "Title" }, { key: "slug", label: "Slug" }, { key: "published", label: "Live", type: "bool" }],
    fields: [{ key: "title", label: "Title", required: true }, { key: "slug", label: "Slug", required: true, createOnly: true }, { key: "excerpt", label: "Excerpt (SEO description)", type: "textarea" }, { key: "body", label: "Body", type: "textarea" }, { key: "published_at", label: "Publish date", type: "date" }, { key: "published", label: "Published", type: "bool", default: false }],
  },
  {
    key: "seo_pages", table: "seo_pages", title: "SEO Controls", group: "Website", icon: "🔎", order: { col: "path", asc: true },
    intro: "Control what Google shows for each page.",
    guide: ["One row per page path (e.g. /services). Title ≈ 50–60 characters, description ≈ 140–160.", "Put the main keyword first, then the benefit, then the brand.", "‘No-index’ hides a page from Google — leave off for public pages.", "After big changes, submit the sitemap in Google Search Console (see Guide)."],
    columns: [{ key: "path", label: "Path" }, { key: "title", label: "Title" }, { key: "noindex", label: "No-index", type: "bool" }],
    fields: [{ key: "path", label: "Path (e.g. /services)", required: true, createOnly: true }, { key: "title", label: "SEO title" }, { key: "description", label: "Meta description", type: "textarea" }, { key: "og_image", label: "Social image URL", type: "url" }, { key: "noindex", label: "No-index (hide from Google)", type: "bool", default: false }],
  },
  {
    key: "site_settings", table: "site_settings", title: "Site Text & Payments", group: "Website", icon: "⚙️", pk: "key", order: { col: "key", asc: true },
    intro: "Editable website text and payment settings.",
    guide: ["hero_title / hero_sub: the big headline & sub-text on the Home page.", "upi_id: YOUR UPI ID (e.g. name@sbi). Required for invoice QR codes.", "upi_name: name shown to payers. business_hours / location: shown on Contact.", "guruji_greeting: first AI-Guruji message. guruji_extra_rules (private): extra instructions for the AI.", "‘Public’ off = never exposed to visitors."],
    columns: [{ key: "key", label: "Key" }, { key: "value", label: "Value" }, { key: "is_public", label: "Public", type: "bool" }, { key: "note", label: "What it does" }],
    fields: [{ key: "key", label: "Key", required: true, createOnly: true }, { key: "value", label: "Value", type: "textarea" }, { key: "is_public", label: "Public", type: "bool", default: true }, { key: "note", label: "Note" }],
  },
  {
    key: "guruji_kb", table: "guruji_kb", title: "Guruji Knowledge Base", group: "AI Guruji", icon: "🧠", order: { col: "question", asc: true },
    intro: "What AI-Guruji knows. Add every question prospects ask you.",
    guide: ["Write the question and the ideal short answer. Keywords help the offline matcher.", "Review ‘Guruji Chats’ weekly: whenever Guruji struggled, add a Q&A here.", "Never put private prices or secrets here — answers can be shown to visitors."],
    columns: [{ key: "question", label: "Question" }, { key: "answer", label: "Answer" }, { key: "published", label: "Live", type: "bool" }],
    fields: [{ key: "question", label: "Question", required: true }, { key: "answer", label: "Answer", type: "textarea", required: true }, { key: "keywords", label: "Keywords (space separated)" }, { key: "published", label: "Published", type: "bool", default: true }],
  },
  {
    key: "guruji_chats", table: "guruji_chats", title: "Guruji Chats", group: "AI Guruji", icon: "💬", order: { col: "created_at" }, noCreate: true, noEdit: true,
    intro: "Real visitor questions — a goldmine for content, pricing and sales ideas.",
    guide: ["Read what visitors ask. Repeated questions = write a blog post or add to the Knowledge Base.", "Delete old chats periodically to respect privacy."],
    columns: [{ key: "created_at", label: "When", type: "datetime" }, { key: "lang", label: "Lang" }, { key: "question", label: "Question" }, { key: "answer", label: "Answer" }],
    fields: [],
  },
  {
    key: "admin_users", table: "admin_users", title: "Admins", group: "System", icon: "🔐", pk: "email", order: { col: "created_at" },
    intro: "Who can enter this panel.",
    guide: ["Add an email here AND create the same email in Supabase → Authentication → Users.", "Remove an email to revoke access instantly.", "Keep this list as short as possible (ideally just you)."],
    columns: [{ key: "email", label: "Email" }, { key: "created_at", label: "Added", type: "date" }],
    fields: [{ key: "email", label: "Email", type: "email", required: true, createOnly: true }],
  },
  {
    key: "audit_log", table: "audit_log", title: "Audit Log", group: "System", icon: "📜", order: { col: "at" }, noCreate: true, noEdit: true, noDelete: true,
    intro: "A permanent record of every change made in this panel.",
    guide: ["Shows who changed what and when. Check it if something looks wrong."],
    columns: [{ key: "at", label: "When", type: "datetime" }, { key: "actor", label: "Who" }, { key: "action", label: "Action" }, { key: "resource", label: "Where" }, { key: "row_id", label: "Row" }],
    fields: [],
  },
];
export const byKey = (k: string) => RESOURCES.find((r) => r.key === k);
