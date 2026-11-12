import Link from "next/link";
export default function NotFound() {
  return (<div className="wrap py-32 text-center"><p className="eyebrow">404</p><h1 className="mt-2 text-4xl font-bold">Page not found</h1><p className="mt-3 text-slate-600">The page you’re looking for doesn’t exist.</p><Link href="/" className="btn-primary mt-6">Back home</Link></div>);
}
