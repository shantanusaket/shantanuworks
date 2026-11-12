import Link from "next/link";
import Image from "next/image";
import { SITE, waLink } from "@/lib/site";
import { T } from "@/lib/i18n";

export default function Footer() {
  return (
    <footer className="dark-mesh text-slate-300">
      <div className="wrap grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <Image src="/brand/icon-192.png" alt="" width={40} height={40} className="rounded-lg" />
            <span className="font-display text-xl font-bold text-white">SHANTANU<span style={{ color: "#3b82f6" }}>WORKS</span></span>
          </div>
          <p className="mt-2 text-sm font-semibold text-cyan-300">{SITE.descriptor}</p>
          <p className="text-xs uppercase tracking-widest text-slate-400">{SITE.pillars}</p>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400"><T k="footer.tag" /></p>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm">
            {[["/services", "Services"], ["/products", "Products"], ["/how-we-work", "How We Work"], ["/about", "About"], ["/insights", "Insights"], ["/contact", "Contact"]].map(([h, t]) => (
              <li key={h}><Link href={h} className="hover:text-white">{t}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-display text-sm font-semibold text-white">Connect</h4>
          <ul className="space-y-2 text-sm">
            <li><a href={SITE.sdgview} target="_blank" rel="noopener" className="hover:text-white">SDGVIEW ↗</a></li>
            <li><a href={waLink()} target="_blank" rel="noopener" className="hover:text-white">WhatsApp</a></li>
            <li><a href={`tel:${SITE.phone}`} className="hover:text-white">{SITE.phone.replace(/(\+91)(\d{5})(\d{5})/, "$1 $2 $3")}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="break-all hover:text-white">{SITE.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-2 py-5 text-xs text-slate-500 sm:flex-row">
          <span>© {new Date().getFullYear()} ShantanuWorks. {SITE.slogan}</span>
          <span className="flex gap-4"><Link href="/privacy" className="hover:text-white">Privacy</Link><Link href="/terms" className="hover:text-white">Terms</Link></span>
        </div>
      </div>
    </footer>
  );
}
