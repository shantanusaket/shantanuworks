"use client";
import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

const TYPES = ["Website Development", "Dashboard Development", "Data Management", "Reporting & Visualization", "Business Automation", "AI Solution", "Custom Digital Platform", "Consultation", "Other"];
const METHODS = ["WhatsApp", "Email", "Phone Call", "Google Meet", "Microsoft Teams"];

export default function ContactForm({ preset }: { preset?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  const [wa, setWa] = useState("");
  const [ts, setTs] = useState(0);
  useEffect(() => setTs(Date.now()), []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending"); setMsg("");
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, ts, lang: document.documentElement.lang || "en" }) });
      const j = await r.json();
      if (r.ok && j.ok) { setWa(j.wa || ""); setState("done"); }
      else { setMsg(j.error || "Something went wrong."); setState("error"); }
    } catch { setMsg("Network error. Please try WhatsApp instead."); setState("error"); }
  }

  if (state === "done")
    return (
      <div className="card text-center" role="status">
        <span className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-teal2/15 text-teal2"><Icon name="check" className="h-7 w-7" /></span>
        <h3 className="text-2xl font-bold">Thank you — we’ve received your inquiry.</h3>
        <p className="mt-2 text-slate-600">We’ll review it personally and get back to you with clear next steps. A confirmation has been emailed if you provided an email address.</p>
        {wa && <a href={wa} target="_blank" rel="noopener" className="btn-primary mt-6"><Icon name="whatsapp" className="h-4 w-4" /> Continue on WhatsApp</a>}
      </div>
    );

  return (
    <form onSubmit={submit} className="card space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">Full name *</label><input id="name" name="name" required maxLength={100} className="input" autoComplete="name" /></div>
        <div><label className="label" htmlFor="organization">Organization / business</label><input id="organization" name="organization" maxLength={120} className="input" autoComplete="organization" /></div>
        <div><label className="label" htmlFor="email">Email *</label><input id="email" name="email" type="email" required maxLength={200} className="input" autoComplete="email" /></div>
        <div><label className="label" htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" type="tel" maxLength={20} className="input" autoComplete="tel" placeholder="+91 …" /></div>
        <div><label className="label" htmlFor="project_type">Project type</label>
          <select id="project_type" name="project_type" className="input" defaultValue={preset && TYPES.includes(preset) ? preset : ""}>
            <option value="">Select…</option>{TYPES.map((t) => <option key={t}>{t}</option>)}
          </select></div>
        <div><label className="label" htmlFor="contact_method">Preferred contact</label>
          <select id="contact_method" name="contact_method" className="input" defaultValue="WhatsApp">{METHODS.map((t) => <option key={t}>{t}</option>)}</select></div>
      </div>
      <div><label className="label" htmlFor="goals">Project goals</label><input id="goals" name="goals" maxLength={300} className="input" placeholder="e.g. Track monthly KPIs for 5 branches" defaultValue={preset && !TYPES.includes(preset) ? `Interested in: ${preset}` : ""} /></div>
      <div><label className="label" htmlFor="message">Message *</label><textarea id="message" name="message" required rows={5} maxLength={2000} className="input" placeholder="Tell us about your challenge, opportunity or requirements." /></div>
      {/* honeypot – real people never see or fill this */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
      {state === "error" && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{msg}</p>}
      <button className="btn-primary w-full" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Discuss My Project"}</button>
      <p className="text-xs text-slate-500">By submitting you agree to our <a href="/privacy" className="underline">Privacy Policy</a>. Every inquiry receives a personal review.</p>
    </form>
  );
}
