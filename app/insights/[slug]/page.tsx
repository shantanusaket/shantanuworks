import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/data";
import { PageHero } from "@/components/ui";
import JsonLd from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export const revalidate = 120;
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await getPost(params.slug);
  if (!p) return {};
  return { title: p.title, description: p.excerpt, alternates: { canonical: `/insights/${p.slug}` }, openGraph: { type: "article", title: p.title, description: p.excerpt, publishedTime: p.published_at } };
}
// Safe minimal renderer: blank line = paragraph, "## " = heading, "- " = bullet. No raw HTML is ever injected.
function Body({ text }: { text: string }) {
  return (<>{text.split(/\n{2,}/).map((blk, i) => {
    if (blk.startsWith("## ")) return <h2 key={i}>{blk.slice(3)}</h2>;
    if (blk.startsWith("### ")) return <h3 key={i}>{blk.slice(4)}</h3>;
    if (blk.split("\n").every((l) => l.startsWith("- "))) return <ul key={i}>{blk.split("\n").map((l, j) => <li key={j}>{l.slice(2)}</li>)}</ul>;
    return <p key={i}>{blk}</p>;
  })}</>);
}
export default async function Post({ params }: { params: { slug: string } }) {
  const p = await getPost(params.slug);
  if (!p) notFound();
  return (
    <>
      <PageHero eyebrow={new Date(p.published_at).toLocaleDateString("en-IN", { dateStyle: "long" })} title={p.title} sub={p.excerpt} />
      <article className="wrap prose-sw max-w-3xl py-14"><Body text={p.body || ""} /></article>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Article", headline: p.title, description: p.excerpt, datePublished: p.published_at, author: { "@type": "Organization", name: SITE.name }, publisher: { "@type": "Organization", name: SITE.name, logo: { "@type": "ImageObject", url: `${SITE.url}/brand/icon-512.png` } }, mainEntityOfPage: `${SITE.url}/insights/${p.slug}` }} />
    </>
  );
}
