import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { RESOURCES } from "@/lib/resources";
import { logout } from "@/app/admin/actions";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "Admin | ShantanuWorks" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
const GROUPS = ["Money", "Website", "AI Guruji", "System"] as const;

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="bg-navy p-4 text-slate-300 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto">
        <Link href="/admin" className="mb-4 block px-2 font-display text-lg font-bold text-white">SHANTANU<span style={{ color: "#3b82f6" }}>WORKS</span> <span className="text-xs font-normal text-slate-400">admin</span></Link>
        <nav className="flex gap-1 overflow-x-auto pb-2 lg:block lg:space-y-0.5 lg:overflow-visible" aria-label="Admin">
          <Link href="/admin" className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-white/10">📊 Dashboard</Link>
          {GROUPS.map((g) => (
            <div key={g} className="contents lg:block">
              <p className="hidden px-3 pb-1 pt-4 text-[10px] font-bold uppercase tracking-widest text-slate-500 lg:block">{g}</p>
              {RESOURCES.filter((r) => r.group === g).map((r) => (
                <Link key={r.key} href={`/admin/${r.key}`} className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-white/10">{r.icon} {r.title}</Link>))}
            </div>))}
          <Link href="/admin/guide" className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm font-semibold text-cyan-300 hover:bg-white/10 lg:mt-3">📘 Guide & Playbook</Link>
          <Link href="/" target="_blank" className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm hover:bg-white/10">🌐 View website ↗</Link>
        </nav>
        <div className="mt-4 border-t border-white/10 pt-4 text-xs"><p className="truncate px-2 text-slate-400">{admin.email}</p>
          <form action={logout}><button className="mt-2 w-full rounded-lg bg-white/10 px-3 py-2 text-left text-sm hover:bg-white/20" title="Sign out of the admin console">Sign out</button></form></div>
      </aside>
      <div className="min-w-0 flex-1 p-4 sm:p-8">{children}</div>
    </div>
  );
}
