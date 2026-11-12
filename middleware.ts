import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Gate: /admin/* needs a valid Supabase session (role is re-checked on the server in every page/action).
export async function middleware(req: NextRequest) {
  const res = NextResponse.next({ request: req });
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/admin")) return res;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (path === "/admin/login") return res;
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: (list) => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
    },
  });
  const { data } = await supabase.auth.getUser();
  if (!data.user && path !== "/admin/login") return NextResponse.redirect(new URL("/admin/login", req.url));
  return res;
}
export const config = { matcher: ["/admin/:path*"] };
