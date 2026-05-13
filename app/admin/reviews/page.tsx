"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, Star, ChevronDown, ChevronUp, MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

const DIFF_LABELS: Record<number, string> = { 1:"Çok Kolay", 2:"Kolay", 3:"Orta", 4:"Zor", 5:"Çok Zor" };

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const router = useRouter();

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/reviews?page=${page}`, { credentials: "include" });
    const data = await res.json();
    setReviews(data.reviews ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const toggleExpand = (id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleDelete = async (review: any) => {
    const name = review.instructors?.full_name ?? "bilinmeyen hoca";
    const user = review.users?.full_name ?? review.users?.email ?? "bilinmeyen kullanıcı";
    if (!confirm(`"${user}" kullanıcısının "${name}" hakkındaki yorumunu ve tüm yanıtlarını silmek istiyor musunuz?`)) return;
    await fetch("/api/admin/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ id: review.id }),
    });
    load();
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b border-slate-200 dark:border-zinc-800 pb-6">
        <h1 className="text-2xl font-black text-kk-blue dark:text-white uppercase tracking-tighter">Yorumlar</h1>
        <p className="text-kk-text-muted dark:text-zinc-400 mt-1 text-sm">{total.toLocaleString("tr-TR")} yorum</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400 text-sm">Yükleniyor...</div>
      ) : (
        <div className="space-y-3">
          {reviews.map(review => {
            const isExpanded = expanded.has(review.id);
            const replies = review.review_replies ?? [];
            const instructor = review.instructors;
            const user = review.users;
            const course = review.courses;

            return (
              <div key={review.id} className={`bg-white dark:bg-zinc-900 border rounded-xl shadow-sm overflow-hidden transition-all ${review.is_hidden ? "border-red-200 dark:border-red-900/40 opacity-70" : "border-slate-200 dark:border-zinc-800"}`}>
                <div className="px-6 py-4 flex items-start gap-4">
                  {/* Sol: kullanıcı + hoca + tarih */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Kullanıcı */}
                      <span className="text-xs font-bold text-slate-500 dark:text-zinc-400 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                        {user?.full_name ?? user?.email ?? "—"}
                      </span>
                      <span className="text-slate-300 dark:text-zinc-600 text-xs">→</span>
                      {/* Hoca */}
                      <button
                        onClick={() => instructor?.slug && router.push(`/instructors/${instructor.slug}`)}
                        className="text-xs font-bold text-kk-blue-light hover:underline cursor-pointer"
                      >
                        {instructor ? `${instructor.title ? instructor.title + " " : ""}${instructor.full_name}` : "—"}
                      </button>
                      {/* Ders */}
                      {course && (
                        <span className="text-xs text-slate-400 dark:text-zinc-500">{course.code} — {course.name}</span>
                      )}
                      {review.is_hidden && (
                        <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">Gizli</span>
                      )}
                    </div>

                    {/* Puanlar */}
                    <div className="flex items-center gap-3 flex-wrap text-xs text-slate-500 dark:text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Star size={11} fill="#C8941A" color="#C8941A" />
                        <span className="font-bold text-kk-gold">{Number(review.teaching_quality).toFixed(1)}</span>
                      </span>
                      {review.course_difficulty && <span>Ders: <strong>{DIFF_LABELS[Math.round(Number(review.course_difficulty))]}</strong></span>}
                      {review.exam_difficulty && <span>Sınav: <strong>{DIFF_LABELS[Math.round(Number(review.exam_difficulty))]}</strong></span>}
                      <span className="text-slate-300 dark:text-zinc-600">•</span>
                      <span>{new Date(review.created_at).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}</span>
                    </div>

                    {/* Yorum metni */}
                    {review.comment && (
                      <p className="text-sm text-slate-600 dark:text-zinc-300 italic leading-relaxed">"{review.comment}"</p>
                    )}
                  </div>

                  {/* Sağ: aksiyonlar */}
                  <div className="flex items-center gap-2 shrink-0">
                    {replies.length > 0 && (
                      <button
                        onClick={() => toggleExpand(review.id)}
                        className="flex items-center gap-1 text-xs text-slate-400 hover:text-kk-blue px-2 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                      >
                        <MessageSquare size={13} />
                        {replies.length}
                        {isExpanded ? <ChevronUp size={12}/> : <ChevronDown size={12}/>}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review)}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-500 transition-all cursor-pointer"
                      title="Yorumu ve yanıtlarını sil"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Yanıtlar (expand) */}
                {isExpanded && replies.length > 0 && (
                  <div className="border-t border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/30 divide-y divide-slate-100 dark:divide-zinc-800">
                    {replies.map((reply: any) => (
                      <div key={reply.id} className="px-6 py-3 flex items-start gap-3">
                        <MessageSquare size={13} className="text-slate-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-600 dark:text-zinc-300">{reply.content}</p>
                          <span className="text-[11px] text-slate-400 dark:text-zinc-500">
                            {new Date(reply.created_at).toLocaleDateString("tr-TR", { day:"numeric", month:"long", year:"numeric", hour:"2-digit", minute:"2-digit" })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer">← Önceki</button>
          <span className="text-sm text-slate-500 dark:text-zinc-400">{page} / {totalPages} <span className="text-slate-300 dark:text-zinc-600 mx-1">·</span> {total} yorum</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 text-sm disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-zinc-800 cursor-pointer">Sonraki →</button>
        </div>
      )}
    </div>
  );
}
