import type { Metadata } from "next";
import Image from "next/image";
import { getSeo } from "@/lib/data";
import { PageHero, Section, CtaBand } from "@/components/ui";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeo("/about", { title: "About ShantanuWorks", description: "From insight to impact." });
  return { title: { absolute: s.title }, description: s.description, alternates: { canonical: "/about" } };
}
export default function About() {
  return (
    <>
      <PageHero eyebrow="About" title="From insight to impact." sub="Many organizations have ambitious goals but lack the technology, systems or capacity to achieve them. ShantanuWorks exists to bridge that gap." />
      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <Image src="/brand/founder-team.jpg" alt="Founder of ShantanuWorks leading a data and strategy discussion" width={1091} height={766} className="h-auto w-full rounded-2xl shadow-xl" />
          <div className="space-y-4 leading-7 text-slate-600">
            <h2 className="text-3xl font-bold">Build technology that works.</h2>
            <p>Our mission is to transform data, intelligence and technology into practical solutions that improve decision-making, streamline operations and create measurable value.</p>
            <p>By combining modern engineering, AI, analytics and strategic execution, we help organizations move faster, work smarter and achieve more.</p>
            <p className="font-semibold text-navy">Technology should create clarity. Data should create understanding. Automation should create efficiency. Design should create simplicity.</p>
          </div>
        </div>
      </Section>
      <Section eyebrow="Mission & vision">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="card"><h3 className="text-xl font-semibold">Our mission</h3><p className="mt-2 text-slate-600">To help organizations design, build, automate and deliver practical digital solutions that improve efficiency, visibility, communication and decision-making.</p></div>
          <div className="card"><h3 className="text-xl font-semibold">Our vision</h3><p className="mt-2 text-slate-600">To become a trusted implementation partner for organizations seeking scalable, intelligent and outcome-focused digital systems.</p></div>
        </div>
      </Section>
      <CtaBand title="Let’s build something meaningful." sub="If you’re looking for a practical partner focused on results, we’d love to talk." primary={["/contact", "Book a Consultation"]} />
    </>
  );
}
