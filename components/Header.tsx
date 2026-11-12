"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { T, useLang } from "@/lib/i18n";
import Icon from "@/components/Icon";

const NAV = [
  ["/", "nav.home"], ["/services", "nav.services"], ["/products", "nav.products"],
  ["/how-we-work", "nav.how"], ["/about", "nav.about"], ["/insights", "nav.insights"], ["/contact", "nav.contact"],
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const { lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/85 backdrop-blur-xl">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3" aria-label="ShantanuWorks home">
          <Image src="/brand/icon-192.png" alt="" width={36} height={36} className="rounded-lg" priority />
          <span className="font-display text-lg font-bold tracking-tight text-white">SHANTANU<span className="text-brand" style={{ color: "#3b82f6" }}>WORKS</span></span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map(([href, k]) => (
            <Link key={href} href={href} className={`rounded-lg px-3 py-2 text-sm font-medium transition ${path === href ? "bg-white/10 text-white" : "text-slate-300 hover:text-white"}`}>
              <T k={k} />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={() => setLang(lang === "en" ? "hi" : "en")} className="rounded-lg border border-white/20 px-2.5 py-1.5 text-xs font-semibold text-slate-200 hover:bg-white/10" aria-label="Switch language English / Hindi">
            {lang === "en" ? "हिन्दी" : "EN"}
          </button>
          <Link href="/contact" className="btn-primary hidden !py-2 sm:inline-flex"><T k="cta.start" /></Link>
          <button className="rounded-lg p-2 text-white lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
            <Icon name={open ? "x" : "menu"} />
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t border-white/10 bg-navy px-5 pb-5 lg:hidden" aria-label="Mobile">
          {NAV.map(([href, k]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="block border-b border-white/5 py-3 text-slate-200"><T k={k} /></Link>
          ))}
          <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full"><T k="cta.start" /></Link>
        </nav>
      )}
    </header>
  );
}
