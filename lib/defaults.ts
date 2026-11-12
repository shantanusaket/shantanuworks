// Fallback content. The site works with these even before Supabase is connected.
// Once connected, anything you edit in /admin overrides these.
export type Service = { slug: string; title: string; summary: string; description: string; deliverables: string[]; icon: string; base_price?: number; sort?: number };

export const DEFAULT_SERVICES: Service[] = [
  { slug: "data-intelligence", icon: "chart", sort: 1, base_price: 15000, title: "Data Intelligence",
    summary: "Transform information into actionable insight through dashboards, analytics and decision-support systems.",
    description: "We structure your scattered data, connect your sources and build dashboards that leaders actually use — so every decision is backed by clear numbers instead of guesswork.",
    deliverables: ["KPI & executive dashboards", "Excel, Power BI & SQL reporting", "Data cleaning & validation", "MIS & performance reports", "Data visualisation & infographics"] },
  { slug: "artificial-intelligence", icon: "brain", sort: 2, base_price: 25000, title: "Artificial Intelligence",
    summary: "AI assistants, knowledge systems and intelligent workflows that enhance productivity and decisions.",
    description: "We deploy practical AI — multilingual assistants, document search and smart workflows — designed around outcomes such as faster answers, less manual effort and better service.",
    deliverables: ["Multilingual AI assistants", "Knowledge-base & document search", "AI-assisted workflows", "Lead qualification bots", "AI readiness consultation"] },
  { slug: "digital-products-platforms", icon: "globe", sort: 3, base_price: 20000, title: "Digital Products & Platforms",
    summary: "Modern websites, business applications, portals and SaaS platforms engineered for growth.",
    description: "From a credible business website to a full custom platform with logins, databases and payments — built on a modern, secure, cloud-native stack that scales with you.",
    deliverables: ["Business & portfolio websites", "Web applications & portals", "SaaS & custom platforms", "SEO-ready architecture", "Secure admin panels"] },
  { slug: "automation-operations", icon: "gear", sort: 4, base_price: 12000, title: "Automation & Operations",
    summary: "Streamline processes and remove repetitive work with intelligent automation and workflow orchestration.",
    description: "Reports, reminders, follow-ups and approvals that run by themselves — with checks along the way — so your team spends time on work that matters.",
    deliverables: ["Reporting automation", "Lead & follow-up workflows", "Invoice & payment reminders", "Email / WhatsApp notifications", "Process mapping"] },
  { slug: "presentations-reports", icon: "doc", sort: 5, base_price: 6000, title: "Presentations & Reports",
    summary: "Pitch decks, company profiles and professional reports that support decisions and influence action.",
    description: "Ideas deserve clear communication. We turn complex information into polished decks and reports your audience understands at a glance.",
    deliverables: ["Pitch & proposal decks", "Company profiles", "Strategy presentations", "Annual & impact reports", "Decision-support reports"] },
  { slug: "consulting", icon: "compass", sort: 6, base_price: 3000, title: "Consultation & Strategy",
    summary: "Not sure what to build? We help you define priorities and a practical implementation path.",
    description: "A focused discovery conversation to evaluate opportunities, choose the right solution and plan delivery in clear phases.",
    deliverables: ["Discovery call", "Solution roadmap", "Scope & timeline", "Technology selection", "Implementation support"] },
];

export const INDUSTRIES = [
  { t: "Research & Innovation", d: "Technology infrastructure for institutions, think tanks and knowledge ecosystems." },
  { t: "Sustainability & Development", d: "Digital systems supporting SDGs, ESG initiatives and impact measurement." },
  { t: "Government & Public Programs", d: "Information systems, reporting platforms and citizen-focused experiences." },
  { t: "NGOs & Social Impact", d: "Tools that improve visibility, reporting, collaboration and impact communication." },
  { t: "Startups & Emerging Ventures", d: "Product design, architecture, AI integration and growth-focused platforms." },
  { t: "Data-Driven Enterprises", d: "Analytics, automation, operational intelligence and decision-support." },
];

export const WHY = [
  { t: "Strategy Before Technology", d: "Every engagement starts with the problem, not the platform." },
  { t: "Built for Scale", d: "Cloud-native architecture designed for reliability, security, performance and growth." },
  { t: "AI-Ready by Design", d: "Solutions that use today’s AI while staying adaptable to tomorrow’s." },
  { t: "Impact-Oriented Execution", d: "Technology should deliver measurable value, not unnecessary complexity." },
];

export const PROCESS = [
  { t: "Discover", d: "We understand challenges, objectives, stakeholders and opportunities." },
  { t: "Design", d: "We create strategic, technical and operational frameworks." },
  { t: "Build", d: "We develop reliable, scalable and future-ready systems." },
  { t: "Launch", d: "We deploy solutions optimised for performance and adoption." },
  { t: "Evolve", d: "We keep improving through analytics, automation and innovation." },
];

export const DEFAULT_PRODUCT = {
  slug: "sdgview", name: "SDGVIEW", tagline: "Analytics • Automation • Impact",
  url: "https://www.sdgview.com",
  description: "SDGVIEW is a live analytics and automation platform — Excel and Power BI dashboards, KPI tracking, MIS and SQL reporting and workflow automation — built for schools, NGOs, small businesses and consultants.",
  highlights: ["Knowledge architecture", "Data intelligence", "Analytics systems", "Content & SEO architecture", "Scalable cloud deployment", "AI companion (CoMentor)"],
};

export const DEFAULT_SETTINGS: Record<string, string> = {
  hero_title: "Building What’s Next.",
  hero_sub: "We help organizations design, build and scale intelligent digital systems powered by technology, data and artificial intelligence.",
  upi_id: "",
  upi_name: "ShantanuWorks",
  business_hours: "Mon–Sat, 10:00–19:00 IST",
  location: "India",
  guruji_greeting: "Namaste! I’m AI-Guruji. Ask me about our services, how projects work, or how to get started — in any language you like.",
};

export const DEFAULT_KB = [
  { q: "What does ShantanuWorks do?", a: "ShantanuWorks designs, builds and scales intelligent digital systems: data dashboards, AI assistants, automation, and modern websites and platforms. Our slogan is: Ideas. Engineered for Impact.", k: "what do you do services about shantanuworks" },
  { q: "How do I start a project?", a: "Open the Contact page and share your goals — or message us on WhatsApp. We review every inquiry personally, discuss your requirements, share a clear quote, and then begin design and development.", k: "start project begin hire contact quote" },
  { q: "How does payment work?", a: "After you accept a quote you receive an invoice with a secure payment page: pay by UPI (any UPI app) or bank transfer, then confirm with your transaction reference. You get a confirmation once we verify it.", k: "payment pay upi price cost invoice" },
  { q: "What is SDGVIEW?", a: "SDGVIEW is our flagship live platform for analytics, dashboards and automation, used by schools, NGOs, small businesses and consultants. You can explore it from the Products page.", k: "sdgview product platform" },
];
