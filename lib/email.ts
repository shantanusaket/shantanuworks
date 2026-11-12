import "server-only";
import { esc } from "@/lib/validate";

/** Sends via Resend if RESEND_API_KEY is set; silently skips otherwise (never breaks the user flow). */
export async function sendEmail(to: string | string[], subject: string, html: string, replyTo?: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return false;
  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.EMAIL_FROM || "ShantanuWorks <onboarding@resend.dev>", to, subject, html, reply_to: replyTo }),
    });
    return r.ok;
  } catch { return false; }
}
export const rows = (o: Record<string, string>) =>
  `<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${Object.entries(o)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#64748b">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v || "—")}</b></td></tr>`).join("")}</table>`;
