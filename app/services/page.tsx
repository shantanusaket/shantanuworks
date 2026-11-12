import type { Metadata } from "next";
import Link from "next/link";
import { getServices, getSeo } from "@/lib/data";
import { PageHero, CtaBand } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 60;
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeo("/services", { title: "Services | ShantanuWorks", description: "Data, AI, automation and digital platforms." });
  return { title: { absolute: s.title }, description: s.description, alternates: { canonical: "/services" } };
}

export default async function Services() {
  const services = await getServices();
  return (
    <>
      <PageHero eyebrow="Services" title="Digital solutions built around results." sub="Every organization is different, so we focus on solutions — not packages. Tell us the outcome you need and we design the system to deliver it." />
      <div className="wrap space-y-6 py-16">
        {services.map((s, i) => (
          <article key={s.slug} id={s.slug} className="card scroll-mt-24 grid gap-6 md:grid-cols-[1fr_1.2fr]">
            <div>
              <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl text-white" style={{ backgroundImage: "linear-gradient(135deg,#2563EB,#06B6D4)" }}><Icon name={s.icon} /></span>
              <p className="eyebrow">0{i + 1}</p>
              <h2 className="mt-1 text-2xl font-bold">{s.title}</h2>
              <p className="mt-3 leading-7 text-slate-600">{s.description || s.summary}</p>
              <Link href={`/contact?service=${encodeURIComponent(s.title)}`} className="btn-primary mt-5">Discuss this <Icon name="arrow" className="h-4 w-4" /></Link>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Deliverables</h3>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {s.deliverables.map((d) => (<li key={d} className="flex gap-2 text-sm"><Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-teal2" />{d}</li>))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <CtaBand title="Need help deciding what to build?" sub="Start with a discovery conversation — we’ll help you prioritise and define a practical path." primary={["/contact?service=Consultation", "Schedule a Discovery Call"]} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "ItemList", itemListElement: services.map((s, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "Service", name: s.title, description: s.summary, provider: { "@type": "Organization", name: SITE.name, url: SITE.url }, areaServed: "IN" } })) }} />
    </>
  );
}
