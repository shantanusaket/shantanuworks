import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** Cookie-aware client: identifies the logged-in admin. */
export function sessionDb() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const store = cookies();
  return createServerClient(url, key, {
    cookies: {
      getAll: () => store.getAll(),
      setAll: (list) => {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* called from a Server Component */ }
      },
    },
  });
}
