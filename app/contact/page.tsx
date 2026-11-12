import type { Metadata } from "next";
import { getSeo, getSettings } from "@/lib/data";
import { PageHero, Section } from "@/components/ui";
import ContactForm from "@/components/ContactForm";
import Icon from "@/components/Icon";
import { SITE, waLink } from "@/lib/site";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeo("/contact", { title: "Contact & Start a Project | ShantanuWorks", description: "Share your goals and get a clear plan." });
  return { title: { absolute: s.title }, description: s.description, alternates: { canonical: "/contact" } };
}
export default async function Contact({ searchParams }: { searchParams: { service?: string } }) {
  const set = await getSettings();
  const preset = typeof searchParams?.service === "string" ? searchParams.service.slice(0, 120) : undefined;
  return (
    <>
      <PageHero eyebrow="Contact" title="Let’s build something that works." sub="Every project starts with a conversation. Tell us your challenge, opportunity or requirements." />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_.7fr]">
          <ContactForm preset={preset} />
          <aside className="space-y-5">
            <div className="card">
              <h3 className="font-semibold">Reach us directly</h3>
              <ul className="mt-3 space-y-3 text-sm">
                <li><a className="flex items-center gap-2 font-medium text-brand" href={waLink()} target="_blank" rel="noopener"><Icon name="whatsapp" className="h-4 w-4" /> WhatsApp</a></li>
                <li><a className="font-medium text-brand" href={`tel:${SITE.phone}`}>{SITE.phone}</a></li>
                <li><a className="break-all font-medium text-brand" href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
                <li className="text-slate-500">{set.business_hours} · {set.location}</li>
              </ul>
            </div>
            <div className="card">
              <h3 className="font-semibold">What happens next?</h3>
              <ol className="mt-3 space-y-3 text-sm text-slate-600">
                {["We review your inquiry.", "We contact you to understand requirements.", "We discuss approaches and solutions.", "We define next steps and project direction."].map((t, i) => (
                  <li key={t} className="flex gap-3"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">{i + 1}</span>{t}</li>))}
              </ol>
            </div>
            <div className="card">
              <h3 className="font-semibold">Secure payments</h3>
              <p className="mt-2 text-sm text-slate-600">Once a quote is agreed, you receive an invoice with a secure payment page. Pay by <b>UPI</b> (scan the QR or tap to pay) or bank transfer, and confirm with your reference — you receive confirmation after verification.</p>
            </div>
            <p className="text-sm text-slate-500">💬 Prefer to chat? Ask <b>AI-Guruji</b> (bottom-right) in your own language.</p>
          </aside>
        </div>
      </Section>
    </>
  );
}
