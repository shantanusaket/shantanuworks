"use client";
import { useMemo, useState, useTransition } from "react";
import { saveRow, deleteRow, runAction } from "@/app/admin/actions";
import type { Resource, Field, Column } from "@/lib/resources";

type Rel = Record<string, { id: string; label: string }[]>;
const inr = (n: any) => (n == null || n === "" ? "—" : "₹" + Number(n).toLocaleString("en-IN"));
const BADGE: Record<string, string> = { new: "bg-blue-100 text-blue-700", contacted: "bg-cyan-100 text-cyan-700", discussion: "bg-indigo-100 text-indigo-700", quoted: "bg-amber-100 text-amber-700", won: "bg-green-100 text-green-700", lost: "bg-slate-200 text-slate-600", draft: "bg-slate-100 text-slate-600", sent: "bg-blue-100 text-blue-700", accepted: "bg-green-100 text-green-700", rejected: "bg-red-100 text-red-700", paid: "bg-green-100 text-green-700", overdue: "bg-red-100 text-red-700", payment_submitted: "bg-amber-100 text-amber-800", cancelled: "bg-slate-200 text-slate-600" };

export default function ResourceManager({ r, rows, rel, siteUrl }: { r: Resource; rows: any[]; rel: Rel; siteUrl: string }) {
  const pk = r.pk || "id";
  const [q, setQ] = useState(""); const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState<any | null>(null); const [isNew, setIsNew] = useState(false);
  const [toast, setToast] = useState<{ ok: boolean; m: string } | null>(null);
  const [pending, start] = useTransition();
  const relLabel = (field: Field | undefined, id: string) => rel[field?.relation?.table || ""]?.find((x) => x.id === id)?.label || "—";

  const shown = useMemo(() => rows.filter((row) => {
    if (status !== "all" && r.statusField && row[r.statusField] !== status) return false;
    if (!q) return true;
    return JSON.stringify(row).toLowerCase().includes(q.toLowerCase());
  }), [rows, q, status, r.statusField]);

  const statusOptions = r.fields.find((f) => f.key === r.statusField)?.options || [];
  const note = (ok: boolean, m: string) => { setToast({ ok, m }); setTimeout(() => setToast(null), 6000); };

  function cell(row: any, c: Column) {
    const v = row[c.key];
    const f = r.fields.find((x) => x.key === c.key);
    if (c.type === "money") return inr(v);
    if (c.type === "date") return v ? new Date(v).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
    if (c.type === "datetime") return v ? new Date(v).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }) : "—";
    if (c.type === "bool") return v ? "✅" : "—";
    if (c.type === "relation") return relLabel(f, v);
    if (c.type === "badge") return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE[v] || "bg-slate-100"}`}>{String(v || "").replace("_", " ")}</span>;
    const t = Array.isArray(v) ? v.join(", ") : String(v ?? "—");
    return <span title={t}>{t.length > 60 ? t.slice(0, 60) + "…" : t}</span>;
  }
  function exportCsv() {
    const head = r.columns.map((c) => c.label);
    const lines = shown.map((row) => r.columns.map((c) => { let v = row[c.key]; if (c.type === "relation") v = relLabel(r.fields.find((f) => f.key === c.key), v); return `"${String(v ?? "").replace(/"/g, '""')}"`; }).join(","));
    const url = URL.createObjectURL(new Blob([[head.join(","), ...lines].join("\n")], { type: "text/csv" }));
    const a = document.createElement("a"); a.href = url; a.download = `${r.key}-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  }
  function onAction(a: Resource["actions"][number], row: any) {
    if (a.kind === "wa") { const p = String(row.phone || "").replace(/\D/g, ""); if (!p) return note(false, "No phone number saved."); return void window.open(`https://wa.me/${p.length === 10 ? "91" + p : p}?text=${encodeURIComponent(`Hello ${row.name || ""}, this is ShantanuWorks.`)}`, "_blank", "noopener"); }
    if (a.kind === "copy") { navigator.clipboard.writeText(`${siteUrl}/pay/${row.token}`).then(() => note(true, "Payment link copied. Paste it in WhatsApp or email.")); return; }
    if (a.confirm && !confirm(a.confirm)) return;
    start(async () => { const res = await runAction(r.key, a.id, row[pk]); note(res.ok, res.message); if (res.ok) location.reload(); });
  }
  function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget); const v: Record<string, any> = {};
    r.fields.forEach((f) => { v[f.key] = f.type === "bool" ? fd.get(f.key) === "on" : fd.get(f.key) ?? ""; });
    start(async () => { const res = await saveRow(r.key, isNew ? null : editing[pk], v); note(res.ok, res.message); if (res.ok) { setEditing(null); location.reload(); } });
  }
  function onDelete(row: any) {
    if (!confirm("Delete permanently? This cannot be undone.")) return;
    start(async () => { const res = await deleteRow(r.key, row[pk]); note(res.ok, res.message); if (res.ok) location.reload(); });
  }
  const inputFor = (f: Field, val: any) => {
    const common = { name: f.key, required: f.required, readOnly: f.readonly, className: "input", placeholder: f.placeholder, id: `f_${f.key}` } as any;
    const disabledPk = !isNew && f.createOnly;
    switch (f.type) {
      case "textarea": return <textarea {...common} rows={4} defaultValue={val ?? ""} />;
      case "list": return <textarea {...common} rows={5} defaultValue={Array.isArray(val) ? val.join("\n") : ""} />;
      case "bool": return <input type="checkbox" name={f.key} defaultChecked={isNew ? !!f.default : !!val} className="h-5 w-5 rounded border-slate-300" />;
      case "select": return <select {...common} defaultValue={val ?? f.default ?? ""}><option value="">—</option>{f.options!.map((o) => <option key={o} value={o}>{o}</option>)}</select>;
      case "relation": return <select {...common} defaultValue={val ?? ""}><option value="">— choose —</option>{(rel[f.relation!.table] || []).map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select>;
      case "number": case "money": return <input {...common} type="number" step="any" defaultValue={val ?? f.default ?? ""} />;
      case "date": return <input {...common} type="date" defaultValue={val ? String(val).slice(0, 10) : ""} />;
      default: return <input {...common} type={f.type === "email" ? "email" : f.type === "url" ? "url" : "text"} defaultValue={val ?? f.default ?? ""} disabled={disabledPk} />;
    }
  };

  return (
    <div>
      {toast && <div role="status" className={`fixed right-4 top-4 z-[60] max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${toast.ok ? "bg-green-600" : "bg-red-600"}`}>{toast.m}</div>}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Search…" className="input !w-56 !py-2" aria-label="Search" />
        {r.statusField && <select value={status} onChange={(e) => setStatus(e.target.value)} className="input !w-auto !py-2" aria-label="Filter by status"><option value="all">All statuses</option>{statusOptions.map((s) => <option key={s}>{s}</option>)}</select>}
        <span className="text-xs text-slate-500">{shown.length} of {rows.length}</span>
        <div className="ml-auto flex gap-2">
          <button onClick={exportCsv} className="btn-outline !py-2" title="Download this table as a spreadsheet (CSV) for Excel / Google Sheets">⬇ Export CSV</button>
          {!r.noCreate && <button onClick={() => { setIsNew(true); setEditing({}); }} className="btn-primary !py-2" title="Add a new record">＋ New</button>}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr>{r.columns.map((c) => <th key={c.key} className="px-4 py-3">{c.label}</th>)}<th className="px-4 py-3 text-right">Actions</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {shown.length === 0 && <tr><td colSpan={r.columns.length + 1} className="px-4 py-10 text-center text-slate-400">Nothing here yet.</td></tr>}
            {shown.map((row) => (
              <tr key={row[pk]} className="hover:bg-slate-50/70">
                {r.columns.map((c) => <td key={c.key} className="px-4 py-3 align-top">{cell(row, c)}</td>)}
                <td className="px-4 py-3 text-right"><div className="flex flex-wrap justify-end gap-1.5">
                  {r.actions?.filter((a) => !a.when || a.when.in.includes(row[a.when.field])).map((a) => (
                    <button key={a.id} onClick={() => onAction(a, row)} disabled={pending} title={a.help} className="rounded-lg bg-brand/10 px-2.5 py-1 text-xs font-semibold text-brand hover:bg-brand hover:text-white">{a.label}</button>))}
                  {!r.noEdit && <button onClick={() => { setIsNew(false); setEditing(row); }} title="Edit this record" className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-navy hover:bg-slate-200">Edit</button>}
                  {!r.noDelete && <button onClick={() => onDelete(row)} disabled={pending} title="Delete permanently" className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-600 hover:text-white">Delete</button>}
                </div></td>
              </tr>))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy/60 p-0 sm:items-center sm:p-6" role="dialog" aria-modal="true">
          <form onSubmit={onSave} className="max-h-[92dvh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl">
            <div className="flex items-center justify-between"><h2 className="text-xl font-bold">{isNew ? "New" : "Edit"} — {r.title}</h2><button type="button" onClick={() => setEditing(null)} className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100" aria-label="Close">✕</button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              {r.fields.filter((f) => isNew || !f.createOnly || true).map((f) => (
                <div key={f.key} className={f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}>
                  <label className="label" htmlFor={`f_${f.key}`}>{f.label}{f.required && " *"}</label>
                  {inputFor(f, editing[f.key])}
                  {f.help && <p className="mt-1 text-xs text-slate-500">{f.help}</p>}
                </div>))}
            </div>
            <div className="flex justify-end gap-2 border-t pt-4"><button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancel</button><button className="btn-primary" disabled={pending}>{pending ? "Saving…" : "Save"}</button></div>
          </form>
        </div>
      )}
    </div>
  );
}
