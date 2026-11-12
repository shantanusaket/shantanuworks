import type { Metadata } from "next";
import Link from "next/link";
import { getPosts, getSeo } from "@/lib/data";
import { PageHero, Section } from "@/components/ui";

export const revalidate = 120;
export async function generateMetadata(): Promise<Metadata> {
  const s = await getSeo("/insights", { title: "Insights | ShantanuWorks", description: "Ideas on data, AI and automation." });
  return { title: { absolute: s.title }, description: s.description, alternates: { canonical: "/insights" } };
}
export default async function Insights() {
  const posts = await getPosts();
  return (
    <>
      <PageHero eyebrow="Insights" title="Practical ideas on data, AI and automation." />
      <Section>
        {posts.length === 0 ? <p className="text-slate-600">New insights are coming soon.</p> : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p) => (
              <Link key={p.slug} href={`/insights/${p.slug}`} className="card card-hover block">
                <p className="text-xs text-slate-500">{new Date(p.published_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>
                <h2 className="mt-2 text-xl font-semibold">{p.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{p.excerpt}</p>
              </Link>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
