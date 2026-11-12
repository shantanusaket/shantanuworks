import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { adminDb } from "@/lib/supabase/admin";
import { byKey } from "@/lib/resources";
import ResourceManager from "@/components/admin/ResourceManager";
import { SITE } from "@/lib/site";

export const dynamic = "force-dynamic";
export default async function ResourcePage({ params }: { params: { resource: string } }) {
  await requireAdmin();
  const r = byKey(params.resource);
  if (!r) notFound();
  const db = adminDb();
  if (!db) return <p className="rounded-xl bg-amber-50 p-4 text-amber-800">Supabase isn’t configured. Add the environment variables (see Guide → Setup).</p>;
  const { data, error } = await db.from(r.table).select("*").order(r.order.col, { ascending: !!r.order.asc }).limit(1000);
  const rel: Record<string, { id: string; label: string }[]> = {};
  for (const f of r.fields) {
    if (f.type === "relation" && f.relation && !rel[f.relation.table]) {
      const { data: rows } = await db.from(f.relation.table).select(`id,${f.relation.label}`).order(f.relation.label).limit(1000);
      rel[f.relation.table] = (rows || []).map((x: any) => ({ id: x.id, label: x[f.relation!.label] }));
    }
  }
  return (
    <div className="mx-auto max-w-7xl">
      <h1 className="text-3xl font-bold">{r.icon} {r.title}</h1>
      <p className="mt-1 text-slate-600">{r.intro}</p>
      <details className="mt-4 rounded-2xl border border-brand/20 bg-white p-4" open>
        <summary className="cursor-pointer text-sm font-bold text-brand">📘 How to use this page</summary>
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">{r.guide.map((g) => <li key={g}>{g}</li>)}</ul>
        <p className="mt-3 text-xs text-slate-400">Hover over any button to see what it does. Every change is recorded in the Audit Log.</p>
      </details>
      {error && <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">Database error: {error.message}. Did you run supabase/schema.sql?</p>}
      <div className="mt-6"><ResourceManager r={r} rows={data || []} rel={rel} siteUrl={SITE.url} /></div>
    </div>
  );
}
