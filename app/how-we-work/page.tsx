import type { Metadata } from "next";
import { getSeo } from "@/lib/data";
import { PROCESS } from "@/lib/defaults";
import { PageHero, Section, CtaBand } from "@/components/ui";

export const revalidate = 300;
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeo("/how-we-work", { title: "How We Work | ShantanuWorks", description: "A clear, transparent delivery process." });
  return { title: { absolute: s.title }, description: s.description, alternates: { canonical: "/how-we-work" } };
}
const FLOW = ["Inquiry", "Discussion", "Quote", "Design & Development", "Invoice", "Secure Payment", "Delivery & Support"];
export default function How() {
  return (
    <>
      <PageHero eyebrow="How we work" title="A process designed around clarity." sub="Successful projects begin with understanding. The better the understanding, the better the outcome." />
      <Section eyebrow="Five stages" title="Discover. Design. Build. Launch. Evolve.">
        <ol className="space-y-4">
          {PROCESS.map((p, i) => (
            <li key={p.t} className="card flex gap-5"><span className="font-display text-4xl font-bold text-brand/25">{i + 1}</span><div><h3 className="text-xl font-semibold">{p.t}</h3><p className="mt-1 text-slate-600">{p.d}</p></div></li>
          ))}
        </ol>
      </Section>
      <Section eyebrow="Project workflow" title="Simple. Transparent. Professional." sub="Every project follows a structured path from first conversation to final delivery.">
        <div className="flex flex-wrap items-center gap-2">
          {FLOW.map((f, i) => (<span key={f} className="flex items-center gap-2"><span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-navy">{f}</span>{i < FLOW.length - 1 && <span className="text-brand">→</span>}</span>))}
        </div>
      </Section>
      <CtaBand title="Ready to move forward?" sub="Every successful project starts with a conversation." primary={["/contact", "Start Your Project"]} />
    </>
  );
}
