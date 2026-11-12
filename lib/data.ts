import { publicDb } from "@/lib/supabase/public";
import { DEFAULT_SERVICES, DEFAULT_SETTINGS, DEFAULT_PRODUCT, type Service } from "@/lib/defaults";

export async function getServices(): Promise<Service[]> {
  try {
    const db = publicDb();
    if (!db) return DEFAULT_SERVICES;
    const { data, error } = await db.from("services").select("*").eq("published", true).order("sort", { ascending: true });
    if (error || !data?.length) return DEFAULT_SERVICES;
    return data.map((r: any) => ({ ...r, deliverables: Array.isArray(r.deliverables) ? r.deliverables : [] }));
  } catch { return DEFAULT_SERVICES; }
}

export async function getSettings(): Promise<Record<string, string>> {
  const out = { ...DEFAULT_SETTINGS };
  try {
    const db = publicDb();
    if (!db) return out;
    const { data } = await db.from("site_settings").select("key,value").eq("is_public", true);
    (data || []).forEach((r: any) => { if (r.value) out[r.key] = r.value; });
  } catch {}
  return out;
}

export async function getProduct() {
  try {
    const db = publicDb();
    if (!db) return DEFAULT_PRODUCT;
    const { data } = await db.from("products").select("*").eq("published", true).order("sort").limit(1).maybeSingle();
    if (!data) return DEFAULT_PRODUCT;
    return { ...DEFAULT_PRODUCT, ...data, name: data.name, highlights: Array.isArray(data.highlights) && data.highlights.length ? data.highlights : DEFAULT_PRODUCT.highlights };
  } catch { return DEFAULT_PRODUCT; }
}

export type Post = { slug: string; title: string; excerpt: string; body: string; published_at: string; cover?: string };
export async function getPosts(): Promise<Post[]> {
  try {
    const db = publicDb();
    if (!db) return [];
    const { data } = await db.from("posts").select("slug,title,excerpt,body,published_at,cover").eq("published", true).order("published_at", { ascending: false });
    return (data as Post[]) || [];
  } catch { return []; }
}
export async function getPost(slug: string): Promise<Post | null> {
  try {
    const db = publicDb();
    if (!db) return null;
    const { data } = await db.from("posts").select("slug,title,excerpt,body,published_at,cover").eq("published", true).eq("slug", slug).maybeSingle();
    return (data as Post) || null;
  } catch { return null; }
}

/** Per-page SEO overrides editable in /admin/seo_pages */
export async function getSeo(path: string, fallback: { title: string; description: string }) {
  try {
    const db = publicDb();
    if (db) {
      const { data } = await db.from("seo_pages").select("title,description,og_image,noindex").eq("path", path).maybeSingle();
      if (data) return { title: data.title || fallback.title, description: data.description || fallback.description, og_image: data.og_image as string | null, noindex: !!data.noindex };
    }
  } catch {}
  return { ...fallback, og_image: null as string | null, noindex: false };
}
