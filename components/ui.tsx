import Link from "next/link";
import { ReactNode } from "react";

export function PageHero({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <section className="dark-mesh">
      <div className="wrap py-16 sm:py-24">
        <p className="eyebrow !text-cyan-300">{eyebrow}</p>
        <h1 className="reveal mt-3 max-w-3xl text-4xl font-bold !text-white sm:text-5xl">{title}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">{sub}</p>}
      </div>
    </section>
  );
}
export function Section({ eyebrow, title, sub, children, dark, id }: { eyebrow?: string; title?: string; sub?: string; children: ReactNode; dark?: boolean; id?: string }) {
  return (
    <section id={id} className={dark ? "dark-mesh text-slate-300" : ""}>
      <div className="wrap py-16 sm:py-20">
        {(eyebrow || title) && (
          <div className="mb-10 max-w-2xl">
            {eyebrow && <p className={`eyebrow ${dark ? "!text-cyan-300" : ""}`}>{eyebrow}</p>}
            {title && <h2 className={`mt-2 text-3xl font-bold sm:text-4xl ${dark ? "!text-white" : ""}`}>{title}</h2>}
            {sub && <p className={`mt-3 text-base leading-7 ${dark ? "text-slate-300" : "text-slate-600"}`}>{sub}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
export function CtaBand({ title, sub, primary = ["/contact", "Start a Project"], secondary }: { title: string; sub: string; primary?: string[]; secondary?: string[] }) {
  return (
    <section className="dark-mesh">
      <div className="wrap py-16 text-center">
        <h2 className="mx-auto max-w-2xl text-3xl font-bold !text-white sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-300">{sub}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href={primary[0]} className="btn-primary">{primary[1]}</Link>
          {secondary && <Link href={secondary[0]} className="btn-ghost">{secondary[1]}</Link>}
        </div>
      </div>
    </section>
  );
}
