"use client";

import { useState, useEffect } from "react";
import { Flag, MessageSquare, CheckCircle, XCircle, Mail, X, Send } from "lucide-react";
import { useRouter } from "next/navigation";

const STATUS_LABELS: Record<string, string> = { pending: "Bekliyor", reviewed: "İncelendi", resolved: "Çözüldü", removed: "Kaldırıldı", approved: "Onaylandı", rejected: "Reddedildi" };
const STATUS_COLORS: Record<string, string> = {
  pending:  "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300",
  reviewed: "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300",
  resolved: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  removed:  "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300",
  approved: "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300",
  rejected: "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300",
};

interface ReplyState { id: string; type: "report"|"suggestion"; email: string; }

export default function ReportsPage() {
  const [tab, setTab] = useState<"reports"|"suggestions">("reports");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [replying, setReplying] = useState<ReplyState | null>(null);
  const [replyMsg, setReplyMsg] = useState("");
  const [sending, setSending] = useState(false);
  const [sentId, setSentId] = useState<string | null>(null);
  const router = useRouter();

  const load = async (t: "reports"|"suggestions") => {
    setLoading(true);
    const res = await fetch(`/api/admin/reports?type=${t}`, { credentials: "include" });
    const data = await res.json();
    setItems(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => { load(tab); }, [tab]);

  const sendReply = async () => {
    if (!replying || !replyMsg.trim()) return;
    setSending(true);
    await fetch("/api/admin/reply", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestion_id: replying.id, message: replyMsg, type: replying.type }),
    });
    setSending(false);
    setSentId(replying.id);
    setReplying(null);
    setReplyMsg("");
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/admin/reports", { method: "PUT", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify({ id, status, type: tab === "suggestions" ? "suggestion" : "report" }) });
    load(tab);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl font-black text-kk-blue dark:text-white uppercase tracking-tighter">Şikayet & Öneriler</h1>
        <p className="text-kk-text-muted dark:text-zinc-400 mt-1 text-sm">Kullanıcılardan gelen geri bildirimler</p>
      </div>

      {/* Tab */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-zinc-800">
        {([["reports","Şikayetler",<Flag size={15}/>],["suggestions","Öneriler",<MessageSquare size={15}/>]] as const).map(([key,label,icon]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer -mb-px ${
              tab === key ? "border-kk-blue text-kk-blue" : "border-transparent text-slate-500 hover:text-kk-blue"
            }`}>
            {icon}{label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? <div className="text-center py-12 text-slate-400 text-sm">Yükleniyor...</div> : items.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">Kayıt bulunamadı.</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-zinc-800">
            {items.map(item => (
              <div key={item.id} className="px-6 py-5 hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {tab === "reports" ? (
                      <>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">{item.reason}</span>
                          {item.reviews?.instructors && (
                            <button onClick={() => item.reviews.instructors.slug && router.push(`/instructors/${item.reviews.instructors.slug}`)}
                              className="text-xs text-kk-blue-light hover:underline cursor-pointer">{item.reviews.instructors.full_name}</button>
                          )}
                          {item.reviews?.courses && <span className="text-xs text-slate-400">{item.reviews.courses.code}</span>}
                        </div>
                        {item.reviews?.comment && (
                          <p className="text-sm text-slate-600 dark:text-zinc-300 italic line-clamp-2">"{item.reviews.comment}"</p>
                        )}
                        {item.reviews?.is_hidden && <span className="text-xs text-red-500 font-semibold">⚠ Yorum gizlenmiş</span>}
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.type === "instructor" ? "bg-blue-50 text-blue-700" : item.type === "course" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {item.type === "instructor" ? "Hoca Önerisi" : item.type === "course" ? "Ders Önerisi" : "Şikayet"}
                          </span>
                          <span className="text-xs text-slate-400 dark:text-zinc-500">{new Date(item.created_at).toLocaleDateString("tr-TR")}</span>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-zinc-300">
                          {item.data && typeof item.data === "object" && Object.entries(item.data).map(([k,v]) => (
                            <span key={k} className="mr-3"><span className="text-slate-400">{k}:</span> {String(v)}</span>
                          ))}
                        </div>
                      </>
                    )}
                    {/* Kullanıcı maili */}
                    {(() => {
                      const email = tab === "reports"
                        ? item.users?.email
                        : item.users?.email ?? null; // suggestions için suggested_by join'i ayrı
                      return email ? (
                        <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <Mail size={11}/> {email}
                        </div>
                      ) : null;
                    })()}
                    <div className="mt-2 text-xs text-slate-400 dark:text-zinc-500">{new Date(item.created_at).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}</div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[item.status] ?? ""}`}>{STATUS_LABELS[item.status] ?? item.status}</span>
                    {sentId === item.id && <span className="text-xs text-green-600 font-semibold">✓ Yanıt gönderildi</span>}
                    <div className="flex gap-1">
                      {/* Cevapla */}
                      <button
                        onClick={() => { setReplying({ id: item.id, type: tab === "suggestions" ? "suggestion" : "report", email: item.users?.email ?? "" }); setReplyMsg(""); }}
                        className="p-1.5 rounded-lg hover:bg-kk-blue/10 text-slate-400 hover:text-kk-blue transition-all cursor-pointer" title="Cevapla">
                        <Mail size={15}/>
                      </button>
                      {item.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(item.id, tab === "suggestions" ? "approved" : "resolved")}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-slate-400 hover:text-green-600 transition-all cursor-pointer" title="Onayla / Çöz">
                            <CheckCircle size={15}/>
                          </button>
                          <button onClick={() => updateStatus(item.id, tab === "suggestions" ? "rejected" : "removed")}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all cursor-pointer" title="Reddet / Kaldır">
                            <XCircle size={15}/>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cevaplama Modal */}
      {replying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{background:"rgba(0,0,0,0.4)"}} onClick={e => e.target===e.currentTarget && setReplying(null)}>
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-kk-blue dark:text-white">Yanıt Gönder</h3>
                {replying.email && <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1"><Mail size={11}/>{replying.email}</p>}
              </div>
              <button onClick={() => setReplying(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={18}/></button>
            </div>
            <textarea
              value={replyMsg}
              onChange={e => setReplyMsg(e.target.value)}
              rows={5}
              placeholder="Kullanıcıya göndermek istediğiniz mesajı yazın..."
              className="w-full px-3 py-2.5 border border-slate-200 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-800 text-kk-blue dark:text-white focus:outline-none focus:ring-1 focus:ring-kk-blue resize-none"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setReplying(null)} className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 cursor-pointer">İptal</button>
              <button onClick={sendReply} disabled={sending || !replyMsg.trim()}
                className="flex items-center gap-1.5 px-4 py-2 bg-kk-blue text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 cursor-pointer">
                <Send size={14}/>{sending ? "Gönderiliyor..." : "Gönder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
