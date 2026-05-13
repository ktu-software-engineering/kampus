"use client";

import { useRouter, usePathname } from "next/navigation";
import { BookOpen, ChevronDown, X } from "lucide-react";

interface Course {
  id: string;
  code: string;
  name: string;
  department_name: string;
  review_count: number;
  avg_course_difficulty: number;
  avg_exam_difficulty: number;
}

interface Props {
  departments: string[];
  courses: Course[];
  totalPages: number;
  currentPage: number;
  currentBolum: string;
  currentSiralama: string;
  totalCount: number;
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

export function CourseFilters({ departments, courses, totalPages, currentPage, currentBolum, currentSiralama }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams();
    if (currentBolum) params.set("bolum", currentBolum);
    if (currentSiralama && currentSiralama !== "ders_azalan") params.set("siralama", currentSiralama);
    params.delete("sayfa");
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  }

  function goPage(p: number) {
    const params = new URLSearchParams();
    if (currentBolum) params.set("bolum", currentBolum);
    if (currentSiralama && currentSiralama !== "ders_azalan") params.set("siralama", currentSiralama);
    if (p > 1) params.set("sayfa", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div>
      {/* Filtre Çubuğu */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        {/* Bölüm */}
        <div className="relative">
          <select
            value={currentBolum}
            onChange={e => updateParams({ bolum: e.target.value })}
            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border-[1.5px] border-[#e8e2d9] bg-white text-kk-blue text-sm font-medium outline-none cursor-pointer focus:border-kk-blue-light transition-all"
          >
            <option value="">Tüm Bölümler</option>
            {departments.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-kk-text-muted pointer-events-none" />
        </div>

        {/* Sıralama */}
        <div className="relative ml-auto">
          <select
            value={currentSiralama}
            onChange={e => updateParams({ siralama: e.target.value })}
            className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border-[1.5px] border-[#e8e2d9] bg-white text-kk-blue text-sm font-medium outline-none cursor-pointer focus:border-kk-blue-light transition-all"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-kk-text-muted pointer-events-none" />
        </div>

        {/* Temizle */}
        {currentBolum && (
          <button
            onClick={() => router.push(pathname)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
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
          {courses.map(course => (
            <div
              key={course.id}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-[#e8e2d9] hover:border-kk-blue-light/40 hover:shadow-[0_8px_24px_-8px_rgba(6,40,58,0.15)] hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* İkon */}
              <div className="w-10 h-10 rounded-xl bg-kk-blue/10 flex items-center justify-center mb-3">
                <BookOpen size={20} className="text-kk-blue" />
              </div>

              {/* Ders kodu + adı */}
              <div className="mb-3">
                <span className="text-[11px] font-bold text-kk-blue-light uppercase tracking-wider">{course.code}</span>
                <h3 className="font-bold text-kk-blue text-[14px] leading-snug mt-0.5 line-clamp-2">{course.name}</h3>
              </div>

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
          ))}
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
