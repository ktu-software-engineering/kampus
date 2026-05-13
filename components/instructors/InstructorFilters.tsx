"use client";

import { useRouter, usePathname } from "next/navigation";
import { Star, GraduationCap, ChevronDown, X } from "lucide-react";

interface Instructor {
  id: string;
  full_name: string;
  title: string | null;
  slug: string;
  average_rating: number;
  review_count: number;
}

interface Props {
  departments: string[];
  titles?: string[]; // artık kullanılmıyor, geriye dönük uyumluluk için
  instructors: Instructor[];
  totalPages: number;
  currentPage: number;
  currentBolum: string;
  currentUnvan: string;
  currentSiralama: string;
  totalCount: number;
}

// Birleştirilmiş unvan grupları
const TITLE_GROUPS = [
  { label: "Prof. Dr.",       values: ["Prof. Dr.", "Prof."] },
  { label: "Doç. Dr.",        values: ["Doç. Dr."] },
  { label: "Dr. Öğr. Üyesi", values: ["Dr. Öğr. Üyesi"] },
  { label: "Dr.",             values: ["Dr."] },
  { label: "Arş. Gör.",       values: ["Arş. Gör. Dr.", "Arş. Gör."] },
  { label: "Öğr. Gör.",       values: ["Öğr. Gör. Dr.", "Öğr. Gör."] },
];

const SORT_OPTIONS = [
  { value: "puan_azalan",  label: "En Yüksek Puan" },
  { value: "puan_artan",   label: "En Düşük Puan" },
  { value: "yorum_azalan", label: "En Çok Yorum" },
  { value: "yorum_artan",  label: "En Az Yorum" },
];

export function InstructorFilters({
  departments, titles, instructors,
  totalPages, currentPage, currentBolum, currentUnvan, currentSiralama, totalCount,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams();
    if (currentBolum)   params.set("bolum",    currentBolum);
    if (currentUnvan)   params.set("unvan",    currentUnvan);
    if (currentSiralama && currentSiralama !== "puan_azalan") params.set("siralama", currentSiralama);
    params.set("sayfa", "1");
    Object.entries(updates).forEach(([k, v]) => v ? params.set(k, v) : params.delete(k));
    if (params.get("sayfa") === "1") params.delete("sayfa");
    router.push(`${pathname}?${params.toString()}`);
  }

  function goPage(p: number) {
    const params = new URLSearchParams();
    if (currentBolum) params.set("bolum", currentBolum);
    if (currentUnvan) params.set("unvan", currentUnvan);
    if (currentSiralama && currentSiralama !== "puan_azalan") params.set("siralama", currentSiralama);
    if (p > 1) params.set("sayfa", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }

  const hasFilters = currentUnvan;

  return (
    <div>
      {/* Filtre Çubuğu */}
      <div className="flex flex-wrap gap-3 items-center mb-6">
        {/* Unvan filtreleri */}
        <div className="flex flex-wrap gap-2">
          {TITLE_GROUPS.map(group => {
            const groupKey = group.values.join(",");
            const active = currentUnvan === groupKey;
            return (
              <button
                key={group.label}
                onClick={() => updateParams({ unvan: active ? "" : groupKey })}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border-[1.5px] transition-all cursor-pointer"
                style={
                  active
                    ? { background: "#06283a", color: "#fff", borderColor: "#06283a" }
                    : { background: "#fff", color: "#6b6356", borderColor: "#e8e2d9" }
                }
              >
                {group.label}
              </button>
            );
          })}
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

        {/* Filtreleri temizle */}
        {hasFilters && (
          <button
            onClick={() => router.push(pathname)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 transition-all cursor-pointer"
          >
            <X size={12} /> Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Hoca Kartları */}
      {instructors.length === 0 ? (
        <div className="text-center py-20 text-kk-text-muted">
          <GraduationCap size={40} className="mx-auto mb-3 opacity-20" />
          <p className="font-semibold">Bu filtrelere uygun hoca bulunamadı.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {instructors.map(ins => (
            <button
              key={ins.id}
              onClick={() => router.push(`/instructors/${ins.slug}`)}
              className="text-left bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-[#e8e2d9] hover:border-kk-blue-light/40 hover:shadow-[0_8px_24px_-8px_rgba(6,40,58,0.15)] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-xl bg-kk-blue/10 flex items-center justify-center mb-3">
                <GraduationCap size={24} className="text-kk-blue" />
              </div>

              {/* İsim */}
              <h3 className="font-bold text-kk-blue text-[14px] leading-snug mb-1 line-clamp-2">
                {ins.title ? `${ins.title} ${ins.full_name}` : ins.full_name}
              </h3>

              {/* İstatistikler */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#f0ede6]">
                {ins.average_rating > 0 ? (
                  <div className="flex items-center gap-1 text-kk-gold">
                    <Star size={13} fill="currentColor" />
                    <span className="text-[13px] font-bold text-kk-blue">{ins.average_rating.toFixed(1)}</span>
                  </div>
                ) : (
                  <span className="text-[12px] text-kk-text-muted">Henüz puan yok</span>
                )}
                <span className="text-[12px] text-kk-text-muted">{ins.review_count} yorum</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Sayfalama */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => goPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-xl border border-[#e8e2d9] text-sm font-semibold text-kk-blue disabled:opacity-40 hover:bg-kk-blue/5 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            ← Önceki
          </button>

          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p: number;
            if (totalPages <= 7) p = i + 1;
            else if (currentPage <= 4) p = i + 1;
            else if (currentPage >= totalPages - 3) p = totalPages - 6 + i;
            else p = currentPage - 3 + i;
            return (
              <button
                key={p}
                onClick={() => goPage(p)}
                className="w-9 h-9 rounded-xl border text-sm font-semibold transition-all cursor-pointer"
                style={
                  p === currentPage
                    ? { background: "#06283a", color: "#fff", borderColor: "#06283a" }
                    : { background: "#fff", color: "#06283a", borderColor: "#e8e2d9" }
                }
              >
                {p}
              </button>
            );
          })}

          <button
            onClick={() => goPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-xl border border-[#e8e2d9] text-sm font-semibold text-kk-blue disabled:opacity-40 hover:bg-kk-blue/5 transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            Sonraki →
          </button>
        </div>
      )}
    </div>
  );
}
