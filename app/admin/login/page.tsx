import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";
export const metadata: Metadata = { title: "Admin sign in", robots: { index: false, follow: false } };
export default function Login() {
  return (
    <div className="dark-mesh flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-white p-8 shadow-2xl">
        <div className="mb-6 text-center"><p className="font-display text-xl font-bold text-navy">SHANTANU<span className="text-brand">WORKS</span></p><p className="text-sm text-slate-500">Admin console</p></div>
        <LoginForm />
        <p className="mt-6 text-center text-xs text-slate-400">🔒 Authorised personnel only. Activity is logged.</p>
      </div>
    </div>
  );
}
