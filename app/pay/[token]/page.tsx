import type { Metadata } from "next";
import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { adminDb } from "@/lib/supabase/admin";
import { getSettings } from "@/lib/data";
import PayConfirm from "@/components/PayConfirm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Secure Payment", robots: { index: false, follow: false } };
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function Pay({ params }: { params: { token: string } }) {
  if (!UUID.test(params.token)) notFound();
  const db = adminDb();
  if (!db) notFound();
  const { data: inv } = await db.from("invoices").select("invoice_no,title,amount,status,due_date,paid_at,clients(name)").eq("token", params.token).maybeSingle();
  if (!inv || inv.status === "cancelled") notFound();
  const set = await getSettings();
  const amount = Number(inv.amount);
  const upi = set.upi_id ? `upi://pay?pa=${encodeURIComponent(set.upi_id)}&pn=${encodeURIComponent(set.upi_name || "ShantanuWorks")}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(inv.invoice_no || "Invoice")}` : "";
  const qr = upi ? await QRCode.toDataURL(upi, { margin: 1, width: 280 }) : "";
  const client: any = Array.isArray(inv.clients) ? inv.clients[0] : inv.clients;
  return (
    <div className="dark-mesh min-h-[80vh] px-4 py-12">
      <div className="mx-auto max-w-md space-y-4">
        <div className="card">
          <p className="eyebrow">Invoice {inv.invoice_no}</p>
          <h1 className="mt-1 text-2xl font-bold">{inv.title}</h1>
          {client?.name && <p className="text-sm text-slate-500">For {client.name}</p>}
          <p className="mt-4 font-display text-4xl font-bold text-navy">₹{amount.toLocaleString("en-IN")}</p>
          {inv.due_date && inv.status !== "paid" && <p className="text-xs text-slate-500">Due {new Date(inv.due_date).toLocaleDateString("en-IN", { dateStyle: "medium" })}</p>}
        </div>
        {inv.status === "paid" ? (
          <div className="card text-center"><p className="text-3xl">✅</p><h2 className="mt-2 text-xl font-bold">Payment received</h2><p className="text-sm text-slate-600">Thank you! Paid on {new Date(inv.paid_at).toLocaleDateString("en-IN", { dateStyle: "long" })}.</p></div>
        ) : inv.status === "payment_submitted" ? (
          <div className="card text-center"><p className="text-3xl">⏳</p><h2 className="mt-2 text-xl font-bold">Verification in progress</h2><p className="text-sm text-slate-600">We received your payment reference and are verifying it. You’ll be notified once confirmed.</p></div>
        ) : (
          <div className="card space-y-5">
            {upi ? (<>
              <div className="text-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qr} alt="UPI QR code" width={220} height={220} className="mx-auto rounded-xl border border-slate-200" />
                <p className="mt-2 text-xs text-slate-500">Scan with any UPI app (GPay, PhonePe, Paytm, BHIM…)</p>
                <a href={upi} className="btn-primary mt-3 w-full sm:hidden">Pay ₹{amount.toLocaleString("en-IN")} with UPI app</a>
                <p className="mt-2 text-xs text-slate-500">UPI ID: <b>{set.upi_id}</b></p>
              </div>
              <hr />
              <PayConfirm token={params.token} />
            </>) : <p className="text-sm text-slate-600">Payment details are being set up. Please contact us on WhatsApp to complete this payment.</p>}
          </div>
        )}
        <p className="text-center text-xs text-slate-400">🔒 Payments go directly to ShantanuWorks via UPI. We never see your bank credentials.</p>
      </div>
    </div>
  );
}
