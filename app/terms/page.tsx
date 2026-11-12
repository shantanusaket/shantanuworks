import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
export const metadata: Metadata = { title: "Terms of Service", alternates: { canonical: "/terms" } };
export default function Terms() {
  return (<><PageHero eyebrow="Legal" title="Terms of Service" />
    <div className="wrap prose-sw max-w-3xl py-14">
      <p>Projects begin after a written quote is accepted. Scope, timeline and fees are as stated in the quote and invoice.</p>
      <h2>Payments</h2><p>Payments are made via UPI or bank transfer against an invoice. Work is delivered after the agreed payment milestone is verified.</p>
      <h2>Intellectual property</h2><p>Ownership of final deliverables transfers to the client on full payment, unless agreed otherwise in writing.</p>
      <h2>Liability</h2><p>Our liability is limited to the fees paid for the relevant project.</p>
      <p className="text-sm text-slate-500">Template text — have it reviewed by a legal professional before relying on it.</p>
    </div></>);
}
