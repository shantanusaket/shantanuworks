import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
import { getPosts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages = [["", 1], ["/services", 0.9], ["/products", 0.9], ["/how-we-work", 0.7], ["/about", 0.7], ["/insights", 0.7], ["/contact", 0.8]] as const;
  const posts = await getPosts();
  return [
    ...pages.map(([p, pr]) => ({ url: `${SITE.url}${p}`, lastModified: now, changeFrequency: "weekly" as const, priority: pr })),
    ...posts.map((x) => ({ url: `${SITE.url}/insights/${x.slug}`, lastModified: new Date(x.published_at), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
