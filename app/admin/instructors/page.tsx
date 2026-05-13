"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Edit, EyeOff, Eye, Star, X, Check } from "lucide-react";

interface Instructor { id: string; full_name: string; title: string | null; slug: string; average_rating: number; review_count: number; is_active: boolean; }
interface EditState { id: string; full_name: string; title: string; }

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/instructors?${params}`, { credentials: "include" });
    const data = await res.json();
    setInstructors(data.instructors ?? []); setTotal(data.total ?? 0); setLoading(false);
  }, [q, page]);

  useEffect(() => { fetch_(); }, [fetch_]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetch_(); };

  const handleToggleActive = async (ins: Instructor) => {
    const msg = ins.is_active
      ? `${ins.full_name} profili gizlensin mi? Sayfasında "istek üzerine kaldırıldı" yazacak.`
      : `${ins.full_name} profili tekrar görünür yapılsın mı?`;
    if (!confirm(msg)) return;
    await fetch("/api/admin/instructors", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ id: ins.id, is_active: !ins.is_active }) });
    fetch_();
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    await fetch("/api/admin/instructors", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ id: editing.id, full_name: editing.full_name, title: editing.title || null }) });
    setSaving(false); setEditing(null); fetch_();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl font-black text-kk-blue dark:text-white uppercase tracking-tighter">Akademisyenler</h1>
        <p className="text-kk-text-muted dark:text-zinc-400 mt-1 text-sm">{total.toLocaleString("tr-TR")} akademisyen kayıtlı</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="İsme göre ara..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm text-kk-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-kk-blue" />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-kk-blue text-white rounded-lg text-sm font-semibold hover:opacity-90 cursor-pointer">Ara</button>
      </form>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm"><div className="overflow-x-auto">
        {loading ? <div className="text-center py-12 text-slate-400 text-sm">Yükleniyor...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
              <tr>{["Akademisyen","Puan","Durum",""].map(h => (
                <th key={h} className={`px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest ${!h ? "text-right" : "text-left"}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {instructors.map(ins => (
                <tr key={ins.id} className={`hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors ${!ins.is_active ? "opacity-50" : ""}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-kk-blue dark:text-white">
                      {ins.title && <span className="text-slate-400 dark:text-zinc-500 mr-1">{ins.title}</span>}
                      {ins.full_name}
                    </div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500">{ins.review_count} yorum</div>
                  </td>
                  <td className="px-6 py-4">
                    {ins.average_rating > 0 ? (
                      <div className="flex items-center gap-1 text-kk-gold">
                        <Star size={13} fill="currentColor"/>
                        <span className="text-sm font-bold text-kk-blue dark:text-white">{ins.average_rating.toFixed(1)}</span>
                      </div>
                    ) : <span className="text-xs text-slate-400">—</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ins.is_active ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300" : "bg-slate-100 text-slate-500 dark:bg-zinc-800 dark:text-zinc-400"}`}>
                      {ins.is_active ? "Aktif" : "Gizli"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing({ id: ins.id, full_name: ins.full_name, title: ins.title ?? "" })}
                        className="p-1.5 rounded-lg hover:bg-kk-blue/10 text-slate-400 hover:text-kk-blue transition-all cursor-pointer" title="Düzenle"><Edit size={15}/></button>
                      <button onClick={() => handleToggleActive(ins)}
                        className={`p-1.5 rounded-lg transition-all cursor-pointer ${ins.is_active ? "hover:bg-orange-50 text-slate-400 hover:text-orange-500" : "hover:bg-green-50 text-slate-400 hover:text-green-600"}`}
                        title={ins.is_active ? "Gizle" : "Göster"}>
                        {ins.is_active ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div></div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer">← Önceki</button>
          <span className="text-sm text-slate-500">{page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer">Sonraki →</button>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.4)"}} onClick={e => e.target===e.currentTarget && setEditing(null)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-kk-blue dark:text-white">Akademisyen Düzenle</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18}/></button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Unvan</label>
              <input value={editing.title} onChange={e => setEditing(s => s && ({...s, title: e.target.value}))} placeholder="Prof. Dr., Doç. Dr., ..."
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-kk-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-kk-blue" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Ad Soyad</label>
              <input value={editing.full_name} onChange={e => setEditing(s => s && ({...s, full_name: e.target.value}))}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-kk-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-kk-blue" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 cursor-pointer">İptal</button>
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-1.5 px-4 py-2 bg-kk-blue text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer">
                <Check size={14}/> {saving ? "Kaydediliyor..." : "Kaydet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
