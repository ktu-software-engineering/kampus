"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star, MessageSquare, ChevronUp, ChevronDown, Flag, LogIn, Send } from "lucide-react";
import ReviewForm from "@/components/review/ReviewForm";

// ─── Yardımcı: bar rengi (1=yeşil → 5=kırmızı, 0=boş)
function barColor(val: number): string {
  if (!val) return "#e5e7eb";
  const ratio = (val - 1) / 4;
  const r = Math.round(34  + (239 - 34)  * ratio);
  const g = Math.round(197 + (68  - 197) * ratio);
  const b = Math.round(94  + (68  - 94)  * ratio);
  return `rgb(${r},${g},${b})`;
}

// ─── Küçük login popup
function LoginToast({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-xl text-sm font-semibold text-white"
      style={{ background: "#06283a", animation: "kk-toast-in 0.25s ease" }}
    >
      <style>{`@keyframes kk-toast-in { from { opacity:0; transform:translateX(-50%) translateY(12px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
      <LogIn size={16} />
      Bu işlem için giriş yapmanız gerekiyor.
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-xs">✕</button>
    </div>
  );
}

// ─── ReviewCard
interface ReviewCardProps {
  id: string;
  course: string;
  date: string;
  rating: number;
  comment: string;
  upvotes: number;
  teachingQuality: number;
  difficulty: number;
  examDifficulty: number;
  isLoggedIn: boolean;
  onLoginRequired: () => void;
  initialReported: boolean;
  initialUpvoted: boolean;
  initialDownvoted: boolean;
  initialReplied: boolean;
}

function ReviewCard({ id: _id, course, date, rating, comment, upvotes: initialUpvotes, teachingQuality, difficulty, examDifficulty, isLoggedIn, onLoginRequired, initialReported, initialUpvoted, initialDownvoted, initialReplied }: ReviewCardProps) {
  const [vote, setVote] = useState<"up" | "down" | null>(initialUpvoted ? "up" : initialDownvoted ? "down" : null);
  const [currentUpvotes, setCurrentUpvotes] = useState(initialUpvotes);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyLoginHint, setReplyLoginHint] = useState(false);
  const [loginHint, setLoginHint] = useState<"up" | "down" | null>(null);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [reported, setReported] = useState(initialReported);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportLoginHint, setReportLoginHint] = useState(false);

  // Dışarı tıklayınca menüyü kapat
  React.useEffect(() => {
    if (!showReportMenu) return;
    const handler = () => setShowReportMenu(false);
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showReportMenu]);

  const showLoginHint = (type: "up" | "down") => {
    setLoginHint(type);
    setTimeout(() => setLoginHint(null), 2500);
  };

  const handleVote = async (type: "up" | "down") => {
    if (!isLoggedIn) { showLoginHint(type); return; }

    // Optimistik UI güncelleme
    if (vote === type) {
      setVote(null);
      setCurrentUpvotes(prev => type === "up" ? prev - 1 : prev + 1);
    } else {
      const diff = type === "up" ? (vote === "down" ? 2 : 1) : (vote === "up" ? -2 : -1);
      setCurrentUpvotes(prev => prev + diff);
      setVote(type);
    }

    // DB'ye kaydet — oy değiştirince eskiyi de sil
    const opts = { method: "POST", credentials: "include" as RequestCredentials };
    if (vote === "up" && type === "down") {
      await Promise.all([
        fetch(`/api/reviews/${_id}/upvote`,   opts),
        fetch(`/api/reviews/${_id}/downvote`, opts),
      ]);
    } else if (vote === "down" && type === "up") {
      await Promise.all([
        fetch(`/api/reviews/${_id}/downvote`, opts),
        fetch(`/api/reviews/${_id}/upvote`,   opts),
      ]);
    } else {
      await fetch(`/api/reviews/${_id}/${type === "up" ? "upvote" : "downvote"}`, opts);
    }
  };

  const handleReport = () => {
    if (!isLoggedIn) {
      setReportLoginHint(true);
      setTimeout(() => setReportLoginHint(false), 2500);
      return;
    }
    if (reported) {
      submitReport("__remove__");
      return;
    }
    setShowReportMenu(v => !v);
  };

  const submitReport = async (reason: string) => {
    setShowReportMenu(false);
    setReportLoading(true);
    const res = await fetch(`/api/reviews/${_id}/report`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason: reason === "__remove__" ? "geri_al" : reason }),
    });
    setReportLoading(false);
    if (res.ok) {
      const data = await res.json();
      setReported(!data.removed);
    }
  };

  return (
    <div className="group bg-[#FCFBF7] rounded-2xl py-4 px-6 md:py-5 md:px-8 border border-kk-blue/5 shadow-[0_10px_30px_-15px_rgba(6,40,58,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(6,40,58,0.1)] transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="text-kk-blue-light font-bold text-sm mb-1">{course}</div>
          <div className="text-kk-text-muted text-[11px] font-medium uppercase tracking-wider">{date}</div>
        </div>
        {/* Puan — büyük, güzel */}
        <div className="flex items-center gap-1.5 bg-kk-gold/10 text-kk-gold px-4 py-2 rounded-xl font-black text-lg border border-kk-gold/20">
          <Star size={16} fill="currentColor" />
          {rating}
        </div>
      </div>

      {comment && (
        <p className="text-kk-text leading-relaxed font-medium mb-5 text-[15px]">
          &quot;{comment}&quot;
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-5">
        {[
          { label: "Ders Zorluğu", val: difficulty },
          { label: "Sınav Zorluğu", val: examDifficulty },
        ].map((stat) => {
          const diffLabel = ["", "Çok Kolay", "Kolay", "Orta", "Zor", "Çok Zor"][Math.round(stat.val)] ?? "—";
          return (
            <div key={stat.label} className="bg-kk-beige/50 border border-kk-blue/5 px-3 py-1.5 rounded-lg flex items-center gap-2">
              <span className="text-[11px] font-bold text-kk-text-muted uppercase tracking-tight">{stat.label}</span>
              <span className="text-xs font-black text-kk-blue">{diffLabel}</span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-kk-blue/5">
        <div className="flex items-center gap-3">
          {/* Oylama */}
          <div className="relative flex items-center bg-kk-beige rounded-xl px-1 py-1 border border-kk-blue/10 shadow-sm">
            {/* Login popup */}
            {loginHint && (
              <>
                <style>{`
                  @keyframes kk-hint-in {
                    from { opacity:0; transform:translateX(-50%) translateY(4px); }
                    to   { opacity:1; transform:translateX(-50%) translateY(0); }
                  }
                `}</style>
                <div
                  className="absolute whitespace-nowrap text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg pointer-events-none z-50"
                  style={{
                    background: "#06283a",
                    bottom: "calc(100% + 8px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    animation: "kk-hint-in 0.2s ease both",
                  }}
                >
                  Lütfen giriş yapın
                  <div
                    className="absolute border-4 border-transparent"
                    style={{
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      borderTopColor: "#06283a",
                    }}
                  />
                </div>
              </>
            )}
            <button onClick={() => handleVote("up")} className={`p-1.5 rounded-lg transition-all cursor-pointer ${vote === "up" ? "text-kk-blue-light bg-white" : "text-kk-text-muted hover:text-kk-blue-light hover:bg-white/50"}`}>
              <ChevronUp size={20} strokeWidth={3} />
            </button>
            <span className={`px-2 text-sm font-black min-w-[2rem] text-center ${vote === "up" ? "text-kk-blue-light" : vote === "down" ? "text-red-600" : "text-kk-blue"}`}>
              {currentUpvotes}
            </span>
            <button onClick={() => handleVote("down")} className={`p-1.5 rounded-lg transition-all cursor-pointer ${vote === "down" ? "text-red-600 bg-white" : "text-kk-text-muted hover:text-red-600 hover:bg-white/50"}`}>
              <ChevronDown size={20} strokeWidth={3} />
            </button>
          </div>

          {/* Cevap Ver — sadece henüz cevap vermediyse göster */}
          {!initialReplied && (
          <div className="relative">
            <button
              onClick={() => {
                if (!isLoggedIn) {
                  setReplyLoginHint(true);
                  setTimeout(() => setReplyLoginHint(false), 2500);
                  return;
                }
                setShowReplyForm(v => !v);
              }}
              className="text-kk-text-muted hover:text-kk-blue text-xs font-bold transition-colors px-3 py-1.5 rounded-lg hover:bg-kk-blue/5 cursor-pointer"
            >
              Cevap Ver
            </button>
            {replyLoginHint && (
              <>
                <style>{`@keyframes kk-hint-reply { from { opacity:0; transform:translateX(-50%) translateY(4px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
                <div className="absolute pointer-events-none z-50 whitespace-nowrap text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg"
                  style={{ background:"#06283a", bottom:"calc(100% + 8px)", left:"50%", transform:"translateX(-50%)", animation:"kk-hint-reply 0.2s ease both" }}>
                  Lütfen giriş yapın
                  <div className="absolute border-4 border-transparent" style={{ top:"100%", left:"50%", transform:"translateX(-50%)", borderTopColor:"#06283a" }}/>
                </div>
              </>
            )}
          </div>
          )}
        </div>

        {/* Şikayet */}
        <div className="relative">
          <button
            onClick={handleReport}
            disabled={reportLoading}
            className={`flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer opacity-0 group-hover:opacity-100 ${reported ? "text-red-500" : "text-kk-text-muted hover:text-red-500"}`}
          >
            <Flag size={14} fill={reported ? "currentColor" : "none"} />
            <span>{reported ? "Şikayet Edildi" : "Şikayet"}</span>
          </button>

          {/* Login popup — şikayet */}
          {reportLoginHint && (
            <>
              <style>{`@keyframes kk-hint-in2 { from { opacity:0; transform:translateX(-50%) translateY(4px); } to { opacity:1; transform:translateX(-50%) translateY(0); } }`}</style>
              <div
                className="absolute whitespace-nowrap text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg pointer-events-none z-50"
                style={{
                  background: "#06283a",
                  bottom: "calc(100% + 8px)",
                  left: "50%",
                  transform: "translateX(-50%)",
                  animation: "kk-hint-in2 0.2s ease both",
                }}
              >
                Lütfen giriş yapın
                <div
                  className="absolute border-4 border-transparent"
                  style={{ top: "100%", left: "50%", transform: "translateX(-50%)", borderTopColor: "#06283a" }}
                />
              </div>
            </>
          )}

          {/* Sebep seçme menüsü */}
          {showReportMenu && (
            <div
              className="absolute bottom-full right-0 mb-2 w-48 rounded-xl overflow-hidden shadow-xl z-50 border border-[#e8e2d9]"
              style={{ background: "#fff" }}
            >
              <div className="px-3 py-2 text-[11px] font-bold text-kk-text-muted uppercase tracking-wider border-b border-[#f0ede6]">
                Şikayet Sebebi
              </div>
              {[
                "Uygunsuz içerik",
                "Küfür / Hakaret",
                "Yanıltıcı bilgi",
                "Spam / Reklam",
                "Diğer",
              ].map(reason => (
                <button
                  key={reason}
                  onMouseDown={e => { e.stopPropagation(); submitReport(reason); }}
                  className="w-full text-left px-3 py-2.5 text-sm text-kk-text hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                >
                  {reason}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Cevaplar */}
      <ReplySection
        reviewId={_id}
        isLoggedIn={isLoggedIn}
        onLoginRequired={onLoginRequired}
        showForm={showReplyForm}
        onFormClose={() => setShowReplyForm(false)}
      />
    </div>
  );
}

// ─── Reply bileşeni
interface Reply {
  id: string; content: string; created_at: string; vote_count: number;
  user_upvoted: boolean; user_downvoted: boolean; user_reported: boolean;
}

function ReplyItem({ reply, isLoggedIn, initialUpvoted, initialDownvoted, initialReported, onLoginRequired }: {
  reply: Reply; isLoggedIn: boolean;
  initialUpvoted: boolean; initialDownvoted: boolean; initialReported: boolean;
  onLoginRequired: () => void;
}) {
  const [vote, setVote] = useState<"up"|"down"|null>(initialUpvoted ? "up" : initialDownvoted ? "down" : null);
  const [count, setCount] = useState(reply.vote_count);
  const [reported, setReported] = useState(initialReported);
  const [showReportMenu, setShowReportMenu] = useState(false);
  const [reportLoginHint, setReportLoginHint] = useState(false);
  const [voteLoginHint, setVoteLoginHint] = useState(false);

  const opts = { method: "POST", credentials: "include" as RequestCredentials };

  const handleVote = async (type: "up"|"down") => {
    if (!isLoggedIn) {
      setVoteLoginHint(true);
      setTimeout(() => setVoteLoginHint(false), 2500);
      return;
    }
    if (vote === type) {
      setVote(null);
      setCount(p => type === "up" ? p - 1 : p + 1);
    } else {
      const diff = type === "up" ? (vote === "down" ? 2 : 1) : (vote === "up" ? -2 : -1);
      setCount(p => p + diff);
      setVote(type);
    }
    if (vote === "up" && type === "down") {
      await Promise.all([fetch(`/api/replies/${reply.id}/upvote`, opts), fetch(`/api/replies/${reply.id}/downvote`, opts)]);
    } else if (vote === "down" && type === "up") {
      await Promise.all([fetch(`/api/replies/${reply.id}/downvote`, opts), fetch(`/api/replies/${reply.id}/upvote`, opts)]);
    } else {
      await fetch(`/api/replies/${reply.id}/${type === "up" ? "upvote" : "downvote"}`, opts);
    }
  };

  const submitReport = async (reason: string) => {
    setShowReportMenu(false);
    const res = await fetch(`/api/replies/${reply.id}/report`, { ...opts, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason }) });
    if (res.ok) { const d = await res.json(); setReported(!d.removed); }
  };

  return (
    <div className="group ml-8 pl-4 border-l-2 border-kk-blue/10 py-2">
      <p className="text-kk-text text-sm leading-relaxed mb-2">{reply.content}</p>
      <div className="flex items-center justify-between">
        <div className="relative flex items-center bg-kk-beige rounded-lg px-1 py-0.5 border border-kk-blue/10 text-xs">
          {voteLoginHint && (
            <>
              <style>{`@keyframes kk-hint-rv { from{opacity:0;transform:translateX(-50%) translateY(4px)}to{opacity:1;transform:translateX(-50%) translateY(0)} }`}</style>
              <div className="absolute pointer-events-none z-50 whitespace-nowrap text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-lg"
                style={{background:"#06283a",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)",animation:"kk-hint-rv 0.2s ease both"}}>
                Lütfen giriş yapın
                <div className="absolute border-4 border-transparent" style={{top:"100%",left:"50%",transform:"translateX(-50%)",borderTopColor:"#06283a"}}/>
              </div>
            </>
          )}
          <button onClick={() => handleVote("up")} className={`p-1 rounded cursor-pointer transition-all ${vote==="up"?"text-kk-blue-light bg-white":"text-kk-text-muted hover:text-kk-blue-light"}`}><ChevronUp size={15} strokeWidth={3}/></button>
          <span className={`px-1.5 font-black min-w-[1.5rem] text-center ${vote==="up"?"text-kk-blue-light":vote==="down"?"text-red-600":"text-kk-blue"}`}>{count}</span>
          <button onClick={() => handleVote("down")} className={`p-1 rounded cursor-pointer transition-all ${vote==="down"?"text-red-600 bg-white":"text-kk-text-muted hover:text-red-600"}`}><ChevronDown size={15} strokeWidth={3}/></button>
        </div>
        <div className="relative">
          <button onClick={() => { if (!isLoggedIn) { setReportLoginHint(true); setTimeout(()=>setReportLoginHint(false),2500); return; } if(reported){submitReport("geri_al");}else{setShowReportMenu(v=>!v);}}}
            className={`opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] font-bold cursor-pointer transition-all ${reported?"text-red-500":"text-kk-text-muted hover:text-red-500"}`}>
            <Flag size={12} fill={reported?"currentColor":"none"}/>{reported?"Şikayet Edildi":"Şikayet"}
          </button>
          {reportLoginHint && (
            <div className="absolute pointer-events-none z-50 whitespace-nowrap text-white text-xs font-semibold px-2 py-1 rounded-lg shadow-lg"
              style={{background:"#06283a",bottom:"calc(100% + 6px)",left:"50%",transform:"translateX(-50%)"}}>
              Lütfen giriş yapın
              <div className="absolute border-4 border-transparent" style={{top:"100%",left:"50%",transform:"translateX(-50%)",borderTopColor:"#06283a"}}/>
            </div>
          )}
          {showReportMenu && (
            <div className="absolute bottom-full right-0 mb-1 w-44 rounded-xl overflow-hidden shadow-xl z-50 border border-[#e8e2d9]" style={{background:"#fff"}}>
              {["Uygunsuz içerik","Küfür / Hakaret","Yanıltıcı bilgi","Spam / Reklam","Diğer"].map(r=>(
                <button key={r} onMouseDown={e=>{e.stopPropagation();submitReport(r);}} className="w-full text-left px-3 py-2 text-xs text-kk-text hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer">{r}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ReplySection({ reviewId, isLoggedIn, onLoginRequired, showForm, onFormClose }: {
  reviewId: string; isLoggedIn: boolean; onLoginRequired: ()=>void;
  showForm: boolean; onFormClose: ()=>void;
}) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews/${reviewId}/replies`, { credentials: "include" })
      .then(r => r.json())
      .then(d => Array.isArray(d) && setReplies(d));
  }, [reviewId]);

  const handleSubmit = async () => {
    if (!content.trim() || loading) return;
    setLoading(true);
    const res = await fetch(`/api/reviews/${reviewId}/replies`, {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: content.trim() }),
    });
    setLoading(false);
    if (res.ok) {
      const newReply = await res.json();
      setReplies(prev => [...prev, newReply]);
      setContent("");
      onFormClose();
    }
  };

  if (replies.length === 0 && !showForm) return null;

  return (
    <div className="mt-3 pt-3 border-t border-kk-blue/5 space-y-1">
      {replies.map(reply => (
        <ReplyItem key={reply.id} reply={reply} isLoggedIn={isLoggedIn}
          initialUpvoted={reply.user_upvoted}
          initialDownvoted={reply.user_downvoted}
          initialReported={reply.user_reported}
          onLoginRequired={onLoginRequired} />
      ))}
      {/* Cevap yazma alanı */}
      {isLoggedIn ? (
        showForm ? (
          <div className="ml-8 mt-2 flex gap-2">
            <textarea
              value={content} onChange={e => setContent(e.target.value)} maxLength={500} rows={2}
              placeholder="Cevabınızı yazın..."
              className="flex-1 px-3 py-2 rounded-xl border-[1.5px] border-[#e8e2d9] bg-[#f5f1ea] text-kk-blue text-sm outline-none resize-none focus:border-kk-blue-light focus:ring-2 focus:ring-kk-blue-light/10 transition-all"
            />
            <div className="flex flex-col gap-1">
              <button onClick={handleSubmit} disabled={loading || !content.trim()}
                className="p-2 rounded-xl text-white disabled:opacity-40 transition-all hover:opacity-90 cursor-pointer"
                style={{background:"#06283a"}}>
                <Send size={15}/>
              </button>
              <button onClick={onFormClose} className="p-2 rounded-xl text-kk-text-muted hover:bg-kk-blue/5 transition-all text-xs cursor-pointer">✕</button>
            </div>
          </div>
        ) : null
      ) : null}
    </div>
  );
}

// ─── Ana bileşen
interface Course { id: string; code: string; name: string; }
interface Review {
  id: string;
  courses: { id: string; name: string; code: string } | null;
  created_at: string;
  teaching_quality: number;
  course_difficulty: number;
  exam_difficulty: number;
  comment: string | null;
  upvote_count: number;
}

interface Props {
  instructorId: string;
  instructorSlug: string;
  instructorName: string;
  courses: Course[];
  reviews: Review[];
  averages: { teaching_quality: number; course_difficulty: number; exam_difficulty: number };
  isLoggedIn: boolean;
  hasReviewed: boolean;
  reportedReviewIds: string[];
  upvotedReviewIds: string[];
  downvotedReviewIds: string[];
  repliedReviewIds: string[];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
}

export default function InstructorContent({ instructorId, instructorSlug, instructorName, courses, reviews, averages, isLoggedIn, hasReviewed, reportedReviewIds, upvotedReviewIds, downvotedReviewIds, repliedReviewIds }: Props) {
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);

  const filteredReviews = selectedCourse
    ? reviews.filter(r => r.courses?.id === selectedCourse)
    : reviews;

  const handleLoginRequired = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {showToast && <LoginToast onClose={() => setShowToast(false)} />}

      {/* Sol Panel */}
      <div className="lg:col-span-1 space-y-8">

        {/* Değerlendirme Detayları */}
        {reviews.length > 0 && (
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/40 shadow-sm">
            <h3 className="text-lg font-bold text-kk-blue mb-6 flex items-center gap-2">
              <Star size={20} className="text-kk-gold" />
              Değerlendirme Detayları
            </h3>
            <div className="space-y-5">
              {[
                { label: "Anlatım Kalitesi", val: averages.teaching_quality,  useBlue: true },
                { label: "Ders Zorluğu",     val: averages.course_difficulty, useBlue: false },
                { label: "Sınav Zorluğu",    val: averages.exam_difficulty,   useBlue: false },
              ].map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-kk-text">{item.label}</span>
                    <span className="text-kk-blue-light">{item.val > 0 ? `${item.val} / 5` : "–"}</span>
                  </div>
                  <div className="h-2.5 w-full bg-kk-blue/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${item.val > 0 ? (item.val / 5) * 100 : 0}%`,
                        background: item.useBlue ? "#006392" : barColor(item.val),
                        transition: "width 1s ease, background-color 1s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verdiği Dersler — filtre */}
        {courses.length > 0 && (
          <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/40 shadow-sm">
            <h3 className="text-lg font-bold text-kk-blue mb-4">Verdiği Dersler</h3>
            <p className="text-xs text-kk-text-muted mb-3">Bir derse tıklayarak yorumları filtrele</p>
            <div className="flex flex-wrap gap-2">
              {courses.map((course) => {
                const active = selectedCourse === course.id;
                return (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => setSelectedCourse(active ? null : course.id)}
                    className="text-[13px] font-semibold px-4 py-2 rounded-lg border transition-all duration-200 cursor-pointer"
                    style={
                      active
                        ? { background: "#06283a", color: "#fff", borderColor: "#06283a" }
                        : { background: "rgba(6,40,58,0.04)", color: "#06283a", borderColor: "rgba(6,40,58,0.1)" }
                    }
                  >
                    <span className="opacity-60 mr-1">{course.code}</span>
                    {course.name}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sağ Panel */}
      <div className="lg:col-span-2 space-y-6">

        {/* Yorum Formu */}
        <ReviewForm
          instructorId={instructorId}
          instructorName={instructorName}
          courses={courses}
          isLoggedIn={isLoggedIn}
          initiallyDone={hasReviewed}
          redirectPath={`/instructors/${instructorSlug}`}
        />

        <div className="flex items-center justify-between mb-2 px-2">
          <h2 className="text-2xl font-extrabold text-kk-blue">
            {selectedCourse ? "Filtrelenmiş Yorumlar" : "Öğrenci Yorumları"}
          </h2>
          <span className="text-kk-text-muted text-sm font-medium">{filteredReviews.length} yorum</span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white/40 rounded-xl border border-white/40">
            <MessageSquare size={36} className="text-kk-blue/20 mb-3" />
            <p className="text-kk-text-muted font-semibold">
              {selectedCourse ? "Bu derse henüz yorum yapılmamış." : "Henüz yorum yapılmamış."}
            </p>
            {!selectedCourse && <p className="text-kk-text-muted/60 text-sm mt-1">İlk değerlendirmeyi yapan sen ol!</p>}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              course={review.courses?.name ?? "Genel"}
              date={formatDate(review.created_at)}
              rating={Number(review.teaching_quality)}
              comment={review.comment ?? ""}
              upvotes={review.upvote_count}
              teachingQuality={Number(review.teaching_quality)}
              difficulty={Number(review.course_difficulty)}
              examDifficulty={Number(review.exam_difficulty)}
              isLoggedIn={isLoggedIn}
              onLoginRequired={handleLoginRequired}
              initialReported={reportedReviewIds.includes(review.id)}
              initialUpvoted={upvotedReviewIds.includes(review.id)}
              initialDownvoted={downvotedReviewIds.includes(review.id)}
              initialReplied={repliedReviewIds.includes(review.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
