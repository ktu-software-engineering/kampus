"use client";

import React, { useState, useEffect } from "react";
import { Star, Trash2, Pencil, X, Check, MessageSquare, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";

// ─── Yarım yıldız seçici (ReviewForm ile aynı mantık)
function HalfStarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = React.useState(0);
  const [hoveredStar, setHoveredStar] = React.useState(0);
  const display = hovered || value;
  const SIZE = 32;

  return (
    <div className="flex items-center gap-0.5" onMouseLeave={() => { setHovered(0); setHoveredStar(0); }}>
      {[1,2,3,4,5].map(star => {
        const full = display >= star;
        const half = !full && display >= star - 0.5;
        const isActive = hoveredStar === star;
        return (
          <div key={star} className="relative"
            style={{ width: SIZE, height: SIZE, transform: isActive ? "scale(1.15)" : "scale(1)", transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <div className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
              onMouseEnter={() => { setHovered(star - 0.5); setHoveredStar(star); }}
              onClick={() => onChange(star - 0.5)} />
            <div className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
              onMouseEnter={() => { setHovered(star); setHoveredStar(star); }}
              onClick={() => onChange(star)} />
            <svg viewBox="0 0 24 24" width={SIZE} height={SIZE}>
              {half && (
                <defs>
                  <linearGradient id={`hs-${star}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#C8941A" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={full ? "#C8941A" : half ? `url(#hs-${star})` : "transparent"}
                stroke={full || half ? "#C8941A" : "#d1c9b8"}
                strokeWidth={1.5} strokeLinejoin="round" />
            </svg>
          </div>
        );
      })}
      {value > 0 && <span className="ml-1.5 text-kk-gold font-bold text-base">{value}</span>}
    </div>
  );
}

const DIFF_LABELS = ["", "Çok Kolay", "Kolay", "Orta", "Zor", "Çok Zor"];
const DIFF_OPTIONS = [1, 2, 3, 4, 5];

// ─── Yorum kartı
function ReviewItem({ review, onDelete, onUpdate }: {
  review: any;
  onDelete: (id: string) => void;
  onUpdate: (id: string, data: any) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [rating, setRating] = useState(Number(review.teaching_quality));
  const [courseDiff, setCourseDiff] = useState(Number(review.course_difficulty ?? 3));
  const [examDiff, setExamDiff] = useState(Number(review.exam_difficulty ?? 3));
  const [comment, setComment] = useState(review.comment ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const instructor = review.instructors;
  const course = review.courses;

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/settings/reviews", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id, teaching_quality: rating, course_difficulty: courseDiff, exam_difficulty: examDiff, comment: comment.trim() || undefined }),
    });
    setSaving(false);
    if (res.ok) { setEditing(false); onUpdate(review.id, { teaching_quality: rating, course_difficulty: courseDiff, exam_difficulty: examDiff, comment }); }
  }

  async function handleDelete() {
    if (!confirm("Bu yorumu silmek istediğinizden emin misiniz?")) return;
    setDeleting(true);
    const res = await fetch("/api/settings/reviews", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: review.id }),
    });
    setDeleting(false);
    if (res.ok) onDelete(review.id);
  }

  return (
    <div className="bg-white/80 border border-[#e8e2d9] rounded-2xl p-5 space-y-3">
      {/* Üst: hoca + ders */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <button onClick={() => instructor?.slug && router.push(`/instructors/${instructor.slug}`)}
            className="text-sm font-bold text-kk-blue hover:underline cursor-pointer flex items-center gap-1.5 mb-1">
            <GraduationCap size={14} />
            {instructor ? `${instructor.title ? instructor.title + " " : ""}${instructor.full_name}` : "Bilinmeyen Hoca"}
          </button>
          {course && <span className="text-xs text-kk-text-muted">{course.code} — {course.name}</span>}
          <div className="text-xs text-kk-text-muted mt-0.5">
            {new Date(review.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!editing && (
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-kk-blue/5 text-kk-text-muted hover:text-kk-blue transition-all cursor-pointer">
              <Pencil size={15} />
            </button>
          )}
          <button onClick={handleDelete} disabled={deleting} className="p-1.5 rounded-lg hover:bg-red-50 text-kk-text-muted hover:text-red-500 transition-all cursor-pointer disabled:opacity-50">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="space-y-3 pt-2 border-t border-[#f0ede6]">
          {/* Puan — 0.5 artışlı */}
          <div>
            <label className="text-xs font-bold text-kk-text-muted uppercase tracking-wider mb-1.5 block">Puan</label>
            <HalfStarRating value={rating} onChange={setRating} />
          </div>
          {/* Ders Zorluğu */}
          <div>
            <label className="text-xs font-bold text-kk-text-muted uppercase tracking-wider mb-1.5 block">Ders Zorluğu</label>
            <div className="flex flex-wrap gap-2">
              {DIFF_OPTIONS.map(v => (
                <button key={v} type="button" onClick={() => setCourseDiff(v)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border-[1.5px] transition-all cursor-pointer"
                  style={courseDiff === v ? { background:"#06283a", color:"#fff", borderColor:"#06283a" } : { background:"transparent", color:"#6b6356", borderColor:"#e8e2d9" }}>
                  {DIFF_LABELS[v]}
                </button>
              ))}
            </div>
          </div>
          {/* Sınav Zorluğu */}
          <div>
            <label className="text-xs font-bold text-kk-text-muted uppercase tracking-wider mb-1.5 block">Sınav Zorluğu</label>
            <div className="flex flex-wrap gap-2">
              {DIFF_OPTIONS.map(v => (
                <button key={v} type="button" onClick={() => setExamDiff(v)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border-[1.5px] transition-all cursor-pointer"
                  style={examDiff === v ? { background:"#06283a", color:"#fff", borderColor:"#06283a" } : { background:"transparent", color:"#6b6356", borderColor:"#e8e2d9" }}>
                  {DIFF_LABELS[v]}
                </button>
              ))}
            </div>
          </div>
          {/* Yorum */}
          <div>
            <label className="text-xs font-bold text-kk-text-muted uppercase tracking-wider mb-1.5 block">Yorum</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={500} rows={3}
              className="w-full px-3 py-2 text-sm bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] rounded-xl outline-none resize-none focus:border-kk-blue-light focus:ring-2 focus:ring-kk-blue-light/10 transition-all" />
            <div className="text-right text-xs text-kk-text-muted">{comment.length}/500</div>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setEditing(false)} className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-kk-text-muted hover:bg-kk-blue/5 transition-all cursor-pointer">
              <X size={13} /> İptal
            </button>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all disabled:opacity-50 cursor-pointer"
              style={{ background: "#06283a" }}>
              <Check size={13} /> {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-[#f0ede6] space-y-2">
          <div className="flex items-center gap-3 flex-wrap text-xs text-kk-text-muted">
            <span className="flex items-center gap-1">
              <Star size={12} fill="#C8941A" color="#C8941A" />
              <span className="font-bold text-kk-gold">{Number(review.teaching_quality).toFixed(1)}</span>
            </span>
            <span>Ders: <span className="font-semibold text-kk-blue">{DIFF_LABELS[Math.round(Number(review.course_difficulty))] ?? "—"}</span></span>
            <span>Sınav: <span className="font-semibold text-kk-blue">{DIFF_LABELS[Math.round(Number(review.exam_difficulty))] ?? "—"}</span></span>
          </div>
          {review.comment && <p className="text-sm text-kk-text italic">"{review.comment}"</p>}
        </div>
      )}
    </div>
  );
}

// ─── Yanıt kartı
function ReplyItem({ reply, onDelete, onUpdate }: {
  reply: any;
  onDelete: (id: string) => void;
  onUpdate: (id: string, content: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(reply.content);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const review = reply.reviews;
  const instructor = review?.instructors;
  const course = review?.courses;

  async function handleSave() {
    if (!content.trim()) return;
    setSaving(true);
    const res = await fetch("/api/settings/replies", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reply.id, content: content.trim() }),
    });
    setSaving(false);
    if (res.ok) { setEditing(false); onUpdate(reply.id, content.trim()); }
  }

  async function handleDelete() {
    if (!confirm("Bu yanıtı silmek istediğinizden emin misiniz?")) return;
    const res = await fetch("/api/settings/replies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reply.id }),
    });
    if (res.ok) onDelete(reply.id);
  }

  return (
    <div className="bg-white/80 border border-[#e8e2d9] rounded-2xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <button onClick={() => instructor?.slug && router.push(`/instructors/${instructor.slug}`)}
            className="text-sm font-bold text-kk-blue hover:underline cursor-pointer flex items-center gap-1.5 mb-1">
            <MessageSquare size={14} />
            {instructor ? `${instructor.title ? instructor.title + " " : ""}${instructor.full_name}` : "Bilinmeyen"} yorumuna yanıt
          </button>
          {course && <span className="text-xs text-kk-text-muted">{course.code} — {course.name}</span>}
          <div className="text-xs text-kk-text-muted mt-0.5">
            {new Date(reply.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!editing && (
            <button onClick={() => setEditing(true)} className="p-1.5 rounded-lg hover:bg-kk-blue/5 text-kk-text-muted hover:text-kk-blue transition-all cursor-pointer">
              <Pencil size={15} />
            </button>
          )}
          <button onClick={handleDelete} className="p-1.5 rounded-lg hover:bg-red-50 text-kk-text-muted hover:text-red-500 transition-all cursor-pointer">
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {editing ? (
        <div className="pt-2 border-t border-[#f0ede6] space-y-2">
          <textarea value={content} onChange={e => setContent(e.target.value)} maxLength={500} rows={3}
            className="w-full px-3 py-2 text-sm bg-[#f5f1ea] border-[1.5px] border-[#e8e2d9] rounded-xl outline-none resize-none focus:border-kk-blue-light focus:ring-2 focus:ring-kk-blue-light/10 transition-all" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setEditing(false); setContent(reply.content); }}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-kk-text-muted hover:bg-kk-blue/5 transition-all cursor-pointer">
              <X size={13} /> İptal
            </button>
            <button onClick={handleSave} disabled={saving || !content.trim()}
              className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-semibold text-white disabled:opacity-50 cursor-pointer"
              style={{ background: "#06283a" }}>
              <Check size={13} /> {saving ? "Kaydediliyor..." : "Kaydet"}
            </button>
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-[#f0ede6]">
          <p className="text-sm text-kk-text">{reply.content}</p>
        </div>
      )}
    </div>
  );
}

// ─── Ana sayfa
export default function DegerlendirmelerimPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"reviews" | "replies">("reviews");

  useEffect(() => {
    Promise.all([
      fetch("/api/settings/reviews", { credentials: "include" }).then(r => r.json()),
      fetch("/api/settings/replies", { credentials: "include" }).then(r => r.json()),
    ]).then(([rev, rep]) => {
      setReviews(Array.isArray(rev) ? rev : []);
      setReplies(Array.isArray(rep) ? rep : []);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="text-kk-text-muted text-sm py-10 text-center">Yükleniyor...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-kk-blue tracking-tight mb-1">Değerlendirmelerim</h2>
        <p className="text-sm text-kk-text-muted">Yorumlarınızı ve yanıtlarınızı görüntüleyin, düzenleyin veya silin.</p>
      </div>

      {/* Tab */}
      <div className="flex gap-2 border-b border-[#e8e2d9]">
        {([["reviews", `Yorumlar (${reviews.length})`], ["replies", `Yanıtlar (${replies.length})`]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all cursor-pointer -mb-px ${
              tab === key ? "border-kk-blue text-kk-blue" : "border-transparent text-kk-text-muted hover:text-kk-blue"
            }`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "reviews" && (
        <div className="space-y-3">
          {reviews.length === 0 ? (
            <div className="text-center py-12 text-kk-text-muted">
              <Star size={32} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold">Henüz yorum yapmadınız.</p>
            </div>
          ) : reviews.map(r => (
            <ReviewItem key={r.id} review={r}
              onDelete={id => setReviews(prev => prev.filter(x => x.id !== id))}
              onUpdate={(id, data) => setReviews(prev => prev.map(x => x.id === id ? { ...x, ...data } : x))}
            />
          ))}
        </div>
      )}

      {tab === "replies" && (
        <div className="space-y-3">
          {replies.length === 0 ? (
            <div className="text-center py-12 text-kk-text-muted">
              <MessageSquare size={32} className="mx-auto mb-3 opacity-20" />
              <p className="font-semibold">Henüz yanıt vermediniz.</p>
            </div>
          ) : replies.map(r => (
            <ReplyItem key={r.id} reply={r}
              onDelete={id => setReplies(prev => prev.filter(x => x.id !== id))}
              onUpdate={(id, content) => setReplies(prev => prev.map(x => x.id === id ? { ...x, content } : x))}
            />
          ))}
        </div>
      )}
    </div>
  );
}
