"use client";
import { useFormState, useFormStatus } from "react-dom";
import { login } from "@/app/admin/actions";
function Btn() { const { pending } = useFormStatus(); return <button className="btn-primary w-full" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button>; }
export default function LoginForm() {
  const [s, action] = useFormState(login, {} as { error?: string });
  return (
    <form action={action} className="space-y-4">
      <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="input" /></div>
      <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="input" /></div>
      {s?.error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{s.error}</p>}
      <Btn />
    </form>
  );
}
