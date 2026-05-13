"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Edit, Trash2, X, Check } from "lucide-react";

const ROLES = ["student", "professor", "moderator", "admin"] as const;
const ROLE_LABELS: Record<string, string> = { student: "Öğrenci", professor: "Akademisyen", moderator: "Moderatör", admin: "Yönetici" };
const ROLE_COLORS: Record<string, string> = {
  student:   "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  professor: "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  moderator: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  admin:     "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

interface User { id: string; full_name: string | null; email: string; role: string; is_verified: boolean; created_at: string; }
interface EditState { id: string; full_name: string; role: string; password: string; }

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<EditState | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (q) params.set("q", q);
    const res = await fetch(`/api/admin/users?${params}`, { credentials: "include" });
    const data = await res.json();
    setUsers(data.users ?? []); setTotal(data.total ?? 0); setLoading(false);
  }, [q, page]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetchUsers(); };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const body: Record<string, string> = { id: editing.id, full_name: editing.full_name, role: editing.role };
    if (editing.password) body.password = editing.password;
    await fetch("/api/admin/users", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify(body) });
    setSaving(false); setEditing(null); fetchUsers();
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`${user.full_name ?? user.email} adlı kullanıcıyı ve tüm verilerini silmek istediğinizden emin misiniz?`)) return;
    await fetch("/api/admin/users", { method: "DELETE", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ id: user.id }) });
    fetchUsers();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl font-black text-kk-blue dark:text-white uppercase tracking-tighter">Kullanıcı Yönetimi</h1>
        <p className="text-kk-text-muted dark:text-zinc-400 mt-1 text-sm">{total.toLocaleString("tr-TR")} kullanıcı kayıtlı</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="İsim veya e-posta ile ara..."
            className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-sm text-kk-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-kk-blue" />
        </div>
        <button type="submit" className="px-4 py-2.5 bg-kk-blue text-white rounded-lg text-sm font-semibold hover:opacity-90 cursor-pointer">Ara</button>
      </form>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? <div className="text-center py-12 text-slate-400 text-sm">Yükleniyor...</div> : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-zinc-800/50 border-b border-slate-200 dark:border-zinc-800">
              <tr>{["Kullanıcı","Rol","Doğrulama","Kayıt",""].map(h => (
                <th key={h} className={`px-6 py-4 text-xs font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest ${h ? "text-left" : "text-right"}`}>{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-kk-blue dark:text-white">{u.full_name ?? "—"}</div>
                    <div className="text-xs text-slate-400 dark:text-zinc-500">{u.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${ROLE_COLORS[u.role] ?? ""}`}>{ROLE_LABELS[u.role] ?? u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={u.is_verified ? "text-green-600 font-semibold" : "text-slate-400"}>{u.is_verified ? "✓ Doğrulandı" : "Bekliyor"}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-400 dark:text-zinc-500">{new Date(u.created_at).toLocaleDateString("tr-TR")}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing({ id: u.id, full_name: u.full_name ?? "", role: u.role, password: "" })}
                        className="p-1.5 rounded-lg hover:bg-kk-blue/10 text-slate-400 hover:text-kk-blue transition-all cursor-pointer"><Edit size={15}/></button>
                      <button onClick={() => handleDelete(u)}
                        className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all cursor-pointer"><Trash2 size={15}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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
              <h3 className="font-bold text-kk-blue dark:text-white">Kullanıcı Düzenle</h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18}/></button>
            </div>
            {[
              { label: "Ad Soyad", key: "full_name", type: "text", placeholder: "" },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{f.label}</label>
                <input type={f.type} value={(editing as any)[f.key]} onChange={e => setEditing(s => s && ({...s, [f.key]: e.target.value}))}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-kk-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-kk-blue" />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Rol</label>
              <select value={editing.role} onChange={e => setEditing(s => s && ({...s, role: e.target.value}))}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-kk-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-kk-blue cursor-pointer">
                {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Yeni Şifre <span className="text-slate-300 font-normal normal-case">(boş bırakılırsa değişmez)</span></label>
              <input type="password" value={editing.password} onChange={e => setEditing(s => s && ({...s, password: e.target.value}))} placeholder="En az 8 karakter"
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
