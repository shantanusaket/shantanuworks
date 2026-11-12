import "server-only";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;
/** Service-role client. Bypasses RLS. ONLY use on the server, after verifying the caller. */
export function adminDb(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!cached) cached = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return cached;
}
