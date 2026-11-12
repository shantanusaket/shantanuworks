"use client";
import { useState } from "react";
export default function PayConfirm({ token }: { token: string }) {
  const [s, setS] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [m, setM] = useState("");
  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setS("sending");
    const fd = Object.fromEntries(new FormData(e.currentTarget).entries());
    const r = await fetch("/api/pay/confirm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...fd, token }) });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.ok) setS("done"); else { setM(j.error || "Could not submit."); setS("error"); }
  }
  if (s === "done") return <p className="rounded-xl bg-teal2/10 p-4 text-sm text-teal-800" role="status">✅ Thank you! We received your payment reference and will verify it shortly. You’ll get a confirmation once verified.</p>;
  return (
    <form onSubmit={go} className="space-y-3">
      <div><label className="label" htmlFor="utr">UPI transaction ID / UTR *</label><input id="utr" name="utr" required minLength={8} maxLength={30} className="input" placeholder="e.g. 412345678901" /></div>
      <div><label className="label" htmlFor="note">Your name (optional)</label><input id="note" name="note" maxLength={100} className="input" /></div>
      {s === "error" && <p className="text-sm text-red-600" role="alert">{m}</p>}
      <button className="btn-primary w-full" disabled={s === "sending"}>{s === "sending" ? "Submitting…" : "I’ve paid – submit reference"}</button>
    </form>
  );
}
