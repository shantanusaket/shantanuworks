import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getServices, getSettings, getProduct, getSeo } from "@/lib/data";
import { INDUSTRIES, WHY, PROCESS } from "@/lib/defaults";
import { Section, CtaBand } from "@/components/ui";
import Icon from "@/components/Icon";
import { T } from "@/lib/i18n";
import { SITE } from "@/lib/site";

export const revalidate = 60;
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeo("/", { title: `${SITE.name} – ${SITE.slogan}`, description: SITE.description });
  return { title: { absolute: s.title }, description: s.description, robots: s.noindex ? { index: false } : undefined, openGraph: { title: s.title, description: s.description } };
}

export default async function Home() {
  const [services, set, product] = await Promise.all([getServices(), getSettings(), getProduct()]);
  return (
    <>
      <section className="dark-mesh overflow-hidden">
        <div className="wrap grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <p className="eyebrow !text-cyan-300"><T k="hero.kicker" /></p>
            <h1 className="reveal mt-4 text-5xl font-bold leading-[1.05] !text-white sm:text-6xl">
              {set.hero_title.replace(/\.$/, "")}<span className="grad-text">.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">{set.hero_sub}</p>
            <p className="mt-4 font-display text-lg font-semibold text-cyan-300"><T k="hero.tag" /></p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/services" className="btn-primary"><T k="cta.explore" /> <Icon name="arrow" className="h-4 w-4" /></Link>
              <Link href="/products" className="btn-ghost"><T k="cta.sdgview" /></Link>
            </div>
            <p className="mt-8 text-sm text-slate-400">{SITE.slogan} · {SITE.descriptor}</p>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-6 rounded-[2rem] bg-brand/30 blur-3xl" aria-hidden />
            <div className="relative overflow-hidden rounded-3xl border border-white/15 shadow-glow">
              <Image src="/brand/logo-3d.png" alt="ShantanuWorks — Data, AI, Automation, Web Solutions" width={334} height={260} className="h-auto w-full" priority />
            </div>
          </div>
        </div>
      </section>

      <Section eyebrow="Introduction" title="Technology should do more than function.">
        <div className="grid gap-8 lg:grid-cols-2">
          <p className="text-lg leading-8 text-slate-600">It should enable better decisions, accelerate execution and create lasting value. ShantanuWorks combines data intelligence, artificial intelligence, modern engineering and strategic thinking to solve complex challenges through practical, scalable digital solutions.</p>
          <p className="text-lg leading-8 text-slate-600">We believe the most valuable technology is not the most sophisticated. <b className="text-navy">It is the technology that creates measurable outcomes.</b></p>
        </div>
      </Section>

      <Section eyebrow="Core capabilities" title="What we build" sub="Four capabilities, one connected system.">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <Link key={s.slug} href={`/services#${s.slug}`} className="card card-hover group block">
              <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl text-white" style={{ backgroundImage: "linear-gradient(135deg,#2563EB,#06B6D4)" }}><Icon name={s.icon} /></span>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{s.summary}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand">Learn more <Icon name="arrow" className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </Section>

      <Section dark eyebrow="Featured platform" title={`${product.name} — our flagship product`} sub={product.tagline}>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-lg leading-8">{product.description}</p>
            <p className="mt-4 text-sm text-slate-400">The platform demonstrates how structured knowledge, data intelligence, modern design and scalable technology work together — built and operated by ShantanuWorks.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">About the product</Link>
              <a href={product.url} target="_blank" rel="noopener" className="btn-ghost">Visit {product.name} ↗</a>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {product.highlights.map((h: string) => (
              <li key={h} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white"><Icon name="check" className="h-4 w-4 text-cyan-300" />{h}</li>
            ))}
          </ul>
        </div>
      </Section>

      <Section eyebrow="Why ShantanuWorks" title="Built on four principles">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {WHY.map((w, i) => (
            <div key={w.t} className="card"><span className="font-display text-3xl font-bold text-brand/30">0{i + 1}</span><h3 className="mt-2 text-lg font-semibold">{w.t}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{w.d}</p></div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Industries" title="Who we support">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((x) => (<div key={x.t} className="rounded-2xl border border-slate-200 bg-white p-5"><h3 className="font-semibold">{x.t}</h3><p className="mt-1 text-sm text-slate-600">{x.d}</p></div>))}
        </div>
      </Section>

      <Section eyebrow="Our approach" title="Discover → Design → Build → Launch → Evolve">
        <ol className="grid gap-4 md:grid-cols-5">
          {PROCESS.map((p, i) => (<li key={p.t} className="card"><span className="text-xs font-bold text-brand">STEP {i + 1}</span><h3 className="mt-1 font-semibold">{p.t}</h3><p className="mt-2 text-sm text-slate-600">{p.d}</p></li>))}
        </ol>
      </Section>

      <CtaBand title="Let’s Build What Comes Next." sub="Launching a digital platform, implementing AI, modernising operations or creating a new capability — we’re ready to help." secondary={["/contact", "Contact Us"]} />
    </>
  );
}
