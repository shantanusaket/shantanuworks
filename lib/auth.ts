import "server-only";
import { redirect } from "next/navigation";
import { sessionDb } from "@/lib/supabase/server";
import { adminDb } from "@/lib/supabase/admin";

export type AdminUser = { id: string; email: string };

/** Returns the admin if logged in AND allow-listed, else null. */
export async function getAdmin(): Promise<AdminUser | null> {
  const s = sessionDb();
  if (!s) return null;
  const { data } = await s.auth.getUser(); // validates JWT with Supabase (not just the cookie)
  const user = data?.user;
  if (!user?.email) return null;
  const email = user.email.toLowerCase();
  const envList = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").map((x) => x.trim()).filter(Boolean);
  let ok = envList.includes(email);
  if (!ok) {
    const db = adminDb();
    if (db) {
      const { data: row } = await db.from("admin_users").select("email").ilike("email", email).maybeSingle();
      ok = !!row;
    }
  }
  return ok ? { id: user.id, email } : null;
}

/** Use at the top of EVERY admin page and EVERY server action. */
export async function requireAdmin(): Promise<AdminUser> {
  const a = await getAdmin();
  if (!a) redirect("/admin/login");
  return a;
}
