"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BookOpen, ChevronDown, X, Search } from "lucide-react";

interface CourseInstructor {
  id: string;
  full_name: string;
  title: string | null;
  slug: string;
}

interface Course {
  id: string;
  code: string;
  name: string;
  department_name: string;
  review_count: number;
  avg_course_difficulty: number;
  avg_exam_difficulty: number;
  instructors: CourseInstructor[];
}

interface Props {
  departments: string[];
  courses: Course[];
  totalPages: number;
  currentPage: number;
  currentBolum: string;
  currentSiralama: string;
  currentQ: string;
  totalCount: number;
}

function SearchBar({ currentQ, onSearch }: { currentQ: string; onSearch: (q: string) => void }) {
  const [value, setValue] = useState(currentQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setValue(currentQ); }, [currentQ]);

  const handleChange = (v: string) => {
    setValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (v.length === 0 || v.length >= 2) onSearch(v);
    }, 300);
  };

  return (
    <div className="relative">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kk-text-muted pointer-events-none" />
      <input
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="Ders adı veya koduna göre ara..."
        className="w-full pl-10 pr-9 py-3.5 rounded-xl border-[1.5px] border-[#e8e2d9] bg-white text-kk-blue text-sm outline-none focus:border-kk-blue-light focus:ring-4 focus:ring-kk-blue-light/10 transition-all"
      />
      {value && (
        <button type="button" onClick={() => { setValue(""); onSearch(""); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-kk-text-muted hover:text-kk-blue cursor-pointer">
          <X size={14} />
        </button>
      )}
    </div>
  );
}

const SORT_OPTIONS = [
  { value: "ders_azalan",  label: "En Zor Ders" },
  { value: "ders_artan",   label: "En Kolay Ders" },
  { value: "sinav_azalan", label: "En Zor Sınav" },
  { value: "sinav_artan",  label: "En Kolay Sınav" },
];

const DIFF_LABELS: Record<number, string> = {
  1: "Çok Kolay", 2: "Kolay", 3: "Orta", 4: "Zor", 5: "Çok Zor",
};

function diffLabel(val: number): string {
  if (!val) return "—";
  const rounded = Math.round(val);
  return DIFF_LABELS[rounded] ?? val.toFixed(1);
}

function diffColor(val: number): string {
  if (!val) return "#9ca3af";
  const ratio = (val - 1) / 4;
  const r = Math.round(34  + (239 - 34)  * ratio);
  const g = Math.round(197 + (68  - 197) * ratio);
  const b = Math.round(94  + (68  - 94)  * ratio);
  return `rgb(${r},${g},${b})`;
}

export function CourseFilters({ departments, courses, totalPages, currentPage, currentBolum, currentSiralama, currentQ }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [popupCourseId, setPopupCourseId] = useState<string | null>(null);
  const hasFilter = !!currentBolum;

  // Dışarı tıklayınca popup'u kapat
  useEffect(() => {
    if (!popupCourseId) return;
    const handler = () => setPopupCourseId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [popupCourseId]);
  const [showClear, setShowClear] = useState(hasFilter);
  const [clearClosing, setClearClosing] = useState(false);
  const prevHasFilter = useRef(hasFilter);

  useEffect(() => {
    if (hasFilter && !prevHasFilter.current) {
      setShowClear(true); setClearClosing(false);
    } else if (!hasFilter && prevHasFilter.current) {
      setClearClosing(true);
      setTimeout(() => { setShowClear(false); setClearClosing(false); }, 220);
    }
    prevHasFilter.current = hasFilter;
  }, [hasFilter]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams();
    if (currentBolum) params.set("bolum", currentBolum);
    if (currentSiralama && currentSiralama !== "ders_azalan") params.set("siralama", currentSiralama);
    if (currentQ) params.set("q", currentQ);
    params.delete("sayfa");
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  }

  function goPage(p: number) {
    const params = new URLSearchParams();
    if (currentBolum) params.set("bolum", currentBolum);
    if (currentSiralama && currentSiralama !== "ders_azalan") params.set("siralama", currentSiralama);
    if (currentQ) params.set("q", currentQ);
    if (p > 1) params.set("sayfa", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      <style>{`
        @keyframes cf-slide-in  { from{opacity:0;transform:translateX(8px)}to{opacity:1;transform:translateX(0)} }
        @keyframes cf-slide-out { from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(8px)} }
      `}</style>

      {/* Filtre Çubuğu — Bölüm + Sıralama */}
      <div className="grid grid-cols-2 gap-3 w-full mb-3">
        {/* Bölüm */}
        <div className="relative">
          <select
            value={currentBolum}
            onChange={e => updateParams({ bolum: e.target.value })}
            className="appearance-none w-full pl-4 pr-8 py-3.5 rounded-xl border-[1.5px] border-[#e8e2d9] bg-white text-kk-blue text-sm font-medium outline-none cursor-pointer focus:border-kk-blue-light transition-all"
          >
            <option value="">Tüm Bölümler</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-kk-text-muted pointer-events-none" />
        </div>

        {/* Sıralama */}
        <div className="relative">
          <select
            value={currentSiralama}
            onChange={e => updateParams({ siralama: e.target.value })}
            className="appearance-none w-full pl-4 pr-8 py-3.5 rounded-xl border-[1.5px] border-[#e8e2d9] bg-white text-kk-blue text-sm font-medium outline-none cursor-pointer focus:border-kk-blue-light transition-all"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-kk-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Arama + Filtreleri Temizle satırı */}
      <div
        className="grid gap-3 w-full mb-6"
        style={{
          gridTemplateColumns: showClear ? "2fr 1fr" : "1fr",
          transition: "grid-template-columns 0.25s ease",
        }}
      >
        <SearchBar currentQ={currentQ} onSearch={q => updateParams({ q })} />

        {showClear && (
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (currentQ) params.set("q", currentQ);
              router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
            }}
            className="flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer whitespace-nowrap"
            style={{ animation: `${clearClosing ? "cf-slide-out" : "cf-slide-in"} 0.22s ease forwards` }}
          >
            <X size={12} /> Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Ders Kartları */}
      {courses.length === 0 ? (
        <div className="text-center py-20 text-kk-text-muted">
          <BookOpen size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-semibold">Bu filtrelere uygun ders bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {courses.map(course => {
            const isFlipped = popupCourseId === course.id;
            const isMulti   = course.instructors.length > 1;
            const isSingle  = course.instructors.length === 1;

            return (
              <div
                key={course.id}
                className="relative"
                style={{ perspective: "1000px" }}
                onClick={() => {
                  if (isSingle) router.push(`/instructors/${course.instructors[0].slug}`);
                  else if (isMulti) setPopupCourseId(prev => prev === course.id ? null : course.id);
                }}
              >
                <div
                  className="relative w-full"
                  style={{
                    transformStyle: "preserve-3d",
                    transition: "transform 0.55s cubic-bezier(0.4,0.2,0.2,1)",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >

                  {/* ── ÖN YÜZ ── */}
                  <div
                    className={`bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-[#e8e2d9] transition-[border-color,box-shadow] duration-200 ${(isSingle || isMulti) ? "cursor-pointer hover:border-kk-blue-light/40 hover:shadow-[0_8px_24px_-8px_rgba(6,40,58,0.15)]" : ""}`}
                    style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
                  >
                    {/* İkon */}
                    <div className="w-10 h-10 rounded-xl bg-kk-blue/10 flex items-center justify-center mb-3">
                      <BookOpen size={20} className="text-kk-blue" />
                    </div>

                    {/* Ders kodu + adı */}
                    <div className="mb-2">
                      <span className="text-[11px] font-bold text-kk-blue-light uppercase tracking-wider">{course.code}</span>
                      <h3 className="font-bold text-kk-blue text-[14px] leading-snug mt-0.5 line-clamp-2">{course.name}</h3>
                    </div>

                    {/* Hocalar */}
                    {course.instructors.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-1">
                        {course.instructors.map(ins => (
                          <span key={ins.id} className="inline-block text-[11px] font-medium text-kk-blue-light bg-kk-blue/6 px-2 py-0.5 rounded-md leading-snug">
                            {ins.title ? `${ins.title} ${ins.full_name}` : ins.full_name}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Bölüm */}
                    {course.department_name && (
                      <p className="text-[11px] text-kk-text-muted mb-3 line-clamp-1">{course.department_name}</p>
                    )}

                    {/* İstatistikler */}
                    <div className="border-t border-[#f0ede6] pt-3 space-y-1.5">
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-kk-text-muted">Yorum</span>
                        <span className="font-bold text-kk-blue">{course.review_count}</span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-kk-text-muted">Ders Zorluğu</span>
                        <span className="font-bold" style={{ color: diffColor(course.avg_course_difficulty) }}>
                          {diffLabel(course.avg_course_difficulty)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="text-kk-text-muted">Sınav Zorluğu</span>
                        <span className="font-bold" style={{ color: diffColor(course.avg_exam_difficulty) }}>
                          {diffLabel(course.avg_exam_difficulty)}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* ── ARKA YÜZ ── */}
                  <div
                    className="absolute inset-0 bg-white/70 backdrop-blur-md rounded-2xl p-5 flex flex-col cursor-default border border-[#e8e2d9]"
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Başlık + kapat */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-kk-text-muted text-[10px] font-bold uppercase tracking-widest">Dersi Veren Hocalar</span>
                      <button
                        onClick={() => setPopupCourseId(null)}
                        className="text-kk-text-muted hover:text-kk-blue transition-colors cursor-pointer p-0.5"
                      >
                        <X size={13} />
                      </button>
                    </div>
                    <p className="text-kk-blue text-[12px] font-semibold mb-4 line-clamp-1">{course.name}</p>

                    {/* Hoca listesi */}
                    <div className="flex flex-col gap-2 flex-1 overflow-auto">
                      {course.instructors.map(ins => (
                        <button
                          key={ins.id}
                          onClick={e => { e.stopPropagation(); router.push(`/instructors/${ins.slug}`); }}
                          className="text-left px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-kk-blue bg-kk-blue/5 hover:bg-kk-blue/10 active:bg-kk-blue/15 transition-colors cursor-pointer"
                        >
                          {ins.title ? `${ins.title} ${ins.full_name}` : ins.full_name}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => goPage(currentPage - 1)} disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-[#e8e2d9] text-sm font-semibold text-kk-blue disabled:opacity-40 hover:bg-kk-blue/5 transition-all cursor-pointer disabled:cursor-not-allowed">
            ← Önceki
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p: number;
            if (totalPages <= 7) p = i + 1;
            else if (currentPage <= 4) p = i + 1;
            else if (currentPage >= totalPages - 3) p = totalPages - 6 + i;
            else p = currentPage - 3 + i;
            return (
              <button key={p} onClick={() => goPage(p)}
                className="w-9 h-9 rounded-xl border text-sm font-semibold transition-all cursor-pointer"
                style={p === currentPage
                  ? { background: "#06283a", color: "#fff", borderColor: "#06283a" }
                  : { background: "#fff", color: "#06283a", borderColor: "#e8e2d9" }}>
                {p}
              </button>
            );
          })}
          <button onClick={() => goPage(currentPage + 1)} disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-[#e8e2d9] text-sm font-semibold text-kk-blue disabled:opacity-40 hover:bg-kk-blue/5 transition-all cursor-pointer disabled:cursor-not-allowed">
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
