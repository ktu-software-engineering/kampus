"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, LogIn, Send } from "lucide-react";

interface Course {
  id: string;
  code: string;
  name: string;
}

interface ReviewFormProps {
  instructorId: string;
  instructorName: string;
  courses: Course[];
  isLoggedIn: boolean;
  initiallyDone?: boolean;
  redirectPath?: string;
}

const DIFFICULTY_OPTIONS = [
  { value: 1, label: "Çok Kolay" },
  { value: 2, label: "Kolay" },
  { value: 3, label: "Orta" },
  { value: 4, label: "Zor" },
  { value: 5, label: "Çok Zor" },
];

function StarRatingInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const display = hovered || value;
  const SIZE = 44;

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => { setHovered(0); setHoveredStar(0); }}>
      {[1, 2, 3, 4, 5].map((star) => {
        const full = display >= star;
        const half = !full && display >= star - 0.5;
        const isActive = hoveredStar === star;
        const fillColor = "#C8941A";
        const emptyColor = "#d1c9b8";

        return (
          <div
            key={star}
            className="relative"
            style={{
              width: SIZE,
              height: SIZE,
              transform: isActive ? "scale(1.18)" : "scale(1)",
              transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <div
              className="absolute left-0 top-0 w-1/2 h-full z-10 cursor-pointer"
              onMouseEnter={() => { setHovered(star - 0.5); setHoveredStar(star); }}
              onClick={() => onChange(star - 0.5)}
            />
            <div
              className="absolute right-0 top-0 w-1/2 h-full z-10 cursor-pointer"
              onMouseEnter={() => { setHovered(star); setHoveredStar(star); }}
              onClick={() => onChange(star)}
            />
            <svg viewBox="0 0 24 24" width={SIZE} height={SIZE}>
              {half && (
                <defs>
                  <linearGradient id={`sg-half-${star}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor={fillColor} />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              )}
              <path
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                fill={full ? fillColor : half ? `url(#sg-half-${star})` : "transparent"}
                stroke={full || half ? fillColor : emptyColor}
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
          </div>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-kk-gold font-bold text-xl">{value}</span>
      )}
    </div>
  );
}

function DifficultySelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex flex-wrap gap-2">
      {DIFFICULTY_OPTIONS.map((opt) => {
        const selected = value === opt.value;
        const isHovered = hovered === opt.value && !selected;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            onMouseEnter={() => setHovered(opt.value)}
            onMouseLeave={() => setHovered(0)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-150 border-[1.5px] cursor-pointer"
            style={
              selected
                ? { background: "#06283a", color: "#ffffff", borderColor: "#06283a" }
                : isHovered
                ? { background: "rgba(6,40,58,0.08)", color: "#06283a", borderColor: "rgba(6,40,58,0.2)" }
                : { background: "transparent", color: "#6b6356", borderColor: "#e8e2d9" }
            }
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export default function ReviewForm({ instructorId, instructorName, courses, isLoggedIn, initiallyDone = false, redirectPath }: ReviewFormProps) {
  const router = useRouter();
  const [courseId, setCourseId]     = useState("");
  const [rating, setRating]         = useState(0);
  const [courseDiff, setCourseDiff] = useState(0);
  const [examDiff, setExamDiff]     = useState(0);
  const [comment, setComment]       = useState("");
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState("");
  const [success, setSuccess]       = useState(initiallyDone);
  const [closing, setClosing]       = useState(false);

  if (!isLoggedIn) {
    return (
      <div className="rounded-2xl p-8 text-center border border-[#e8e2d9]" style={{ background: "rgba(255,253,248,0.7)" }}>
        <Star size={28} className="text-kk-gold mx-auto mb-3" fill="currentColor" />
        <p className="text-kk-text font-semibold mb-1">Bu hocayı değerlendirmek ister misin?</p>
        <p className="text-kk-text-muted text-sm mb-5">Yorum yapabilmek için giriş yapmanız gerekiyor.</p>
        <button
          onClick={() => {
            const url = redirectPath ? `/login?redirect=${encodeURIComponent(redirectPath)}` : "/login";
            router.push(url);
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90 active:scale-95"
          style={{ background: "#06283a" }}
        >
          <LogIn size={15} />
          Giriş Yap
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div
        className="rounded-2xl p-10 text-center border border-[#c6e6d0]"
        style={{ background: "rgba(240,255,244,0.85)", animation: "kk-form-in 0.4s cubic-bezier(0,0,0.2,1)" }}
      >
        <style>{`@keyframes kk-form-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }`}</style>
        <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" width={28} height={28} fill="none" stroke="#16a34a" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <p className="text-green-700 font-bold text-[1.05rem] mb-1">Yorumunuz başarıyla eklendi!</p>
        <p className="text-kk-text-muted text-sm">Değerlendirmeniz için teşekkürler.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId)      { setError("Lütfen bir ders seçin."); return; }
    if (rating === 0)   { setError("Lütfen puan verin."); return; }
    if (courseDiff === 0) { setError("Lütfen ders zorluğunu seçin."); return; }
    if (examDiff === 0)   { setError("Lütfen sınav zorluğunu seçin."); return; }
    setError("");
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        instructor_id: instructorId,
        course_id: courseId,
        teaching_quality: rating,
        course_difficulty: courseDiff,
        exam_difficulty: examDiff,
        comment: comment.trim() || undefined,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Bir hata oluştu.");
      return;
    }

    setClosing(true);
    setTimeout(() => {
      setSuccess(true);
      setClosing(false);
    }, 350);
    router.refresh();
  };

  return (
    <div
      className="rounded-2xl border border-[#e8e2d9] overflow-hidden"
      style={{
        background: "rgba(255,253,248,0.7)",
        backdropFilter: "blur(12px)",
        animation: closing ? "kk-form-out 350ms ease forwards" : undefined,
      }}
    >
      <style>{`
        @keyframes kk-form-out { from { opacity:1; transform:scaleY(1); } to { opacity:0; transform:scaleY(0.92); } }
        @keyframes kk-form-in  { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>
      {/* Header */}
      <div className="px-7 py-4 border-b border-[#e8e2d9] text-center" style={{ background: "#06283a" }}>
        <p className="text-white/80 text-sm">Yorumunuz anonim olarak yayınlanacaktır</p>
      </div>

      <form onSubmit={handleSubmit} className="px-7 py-6 flex flex-col gap-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Ders Seçimi */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-kk-text">Hangi ders?</label>
          <select
            value={courseId}
            onChange={e => setCourseId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[#e8e2d9] bg-[#f5f1ea] text-kk-blue text-sm outline-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all appearance-none cursor-pointer"
          >
            <option value="">Ders seçin...</option>
            <option value="genel">Genel</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Puan */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-kk-text">Hocanın puanı</label>
          <StarRatingInput value={rating} onChange={setRating} />
        </div>

        {/* Ders Zorluğu */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-kk-text">Ders zorluğu</label>
          <DifficultySelector value={courseDiff} onChange={setCourseDiff} />
        </div>

        {/* Sınav Zorluğu */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-kk-text">Sınav zorluğu</label>
          <DifficultySelector value={examDiff} onChange={setExamDiff} />
        </div>

        {/* Yorum */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-kk-text">
            Yorum <span className="text-kk-text-muted font-normal text-xs">(isteğe bağlı)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Dersleri nasıldı? Sınav nasıl geçti? Tavsiyeleriniz..."
            className="w-full px-4 py-3 rounded-xl border-[1.5px] border-[#e8e2d9] bg-[#f5f1ea] text-kk-blue text-sm outline-none resize-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all"
          />
          <div className="text-right text-xs text-kk-text-muted">{comment.length}/500</div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2.5 py-4 rounded-2xl font-bold text-white text-[0.95rem] transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:opacity-60 mt-2 shadow-[0_8px_24px_-8px_rgba(6,40,58,0.35)]"
          style={{ background: "linear-gradient(135deg, #06283a 0%, #0e4a6b 100%)" }}
        >
          <Send size={16} />
          {loading ? "Gönderiliyor..." : "Yorumu Gönder"}
        </button>
      </form>
    </div>
  );
}
