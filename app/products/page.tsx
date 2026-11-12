import type { Metadata } from "next";
import Image from "next/image";
import { getProduct, getSeo } from "@/lib/data";
import { PageHero, Section, CtaBand } from "@/components/ui";
import Icon from "@/components/Icon";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 60;
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeo("/products", { title: "Products – SDGVIEW | ShantanuWorks", description: "SDGVIEW, the flagship platform by ShantanuWorks." });
  return { title: { absolute: s.title }, description: s.description, alternates: { canonical: "/products" } };
}

export default async function Products() {
  const p = await getProduct();
  return (
    <>
      <PageHero eyebrow="Products" title="Websites that become products." sub="ShantanuWorks builds platforms — and runs its own. SDGVIEW is proof of what we deliver." />
      <Section>
        <div className="card grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="eyebrow">Flagship product</p>
            <h2 className="mt-2 text-4xl font-bold">{p.name}</h2>
            <p className="mt-1 font-semibold text-brand">{p.tagline}</p>
            <p className="mt-4 leading-7 text-slate-600">{p.description}</p>
            <p className="mt-3 text-sm text-slate-500">A product of ShantanuWorks — designed, built, secured and operated end to end by our team.</p>
            <a href={p.url} target="_blank" rel="noopener" className="btn-primary mt-6">Visit {p.name} <Icon name="arrow" className="h-4 w-4" /></a>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Capabilities demonstrated</h3>
            <ul className="mt-3 space-y-2">
              {p.highlights.map((h: string) => (<li key={h} className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3 text-sm font-medium text-navy"><Icon name="check" className="h-4 w-4 text-teal2" />{h}</li>))}
            </ul>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {[["Website", "What visitors see — fast, secure, search-friendly."], ["Platform", "Knowledge, data and automation working behind the scenes."], ["Product", "A living system that serves real users every day."]].map(([t, d]) => (
            <div key={t} className="card"><h3 className="font-semibold">{t}</h3><p className="mt-2 text-sm text-slate-600">{d}</p></div>
          ))}
        </div>
      </Section>
      <CtaBand title="Want a platform like this?" sub="Tell us the outcome you need — we’ll design the system." />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "SoftwareApplication", name: p.name, url: p.url, applicationCategory: "BusinessApplication", description: p.description, publisher: { "@type": "Organization", name: SITE.name, url: SITE.url } }} />
    </>
  );
}
