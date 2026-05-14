"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Star, GraduationCap, ChevronDown, X, Search } from "lucide-react";

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
  currentQ: string;
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

function SearchBar({ currentQ, onSearch }: { currentQ: string; onSearch: (q: string) => void }) {
  const [value, setValue] = useState(currentQ);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // currentQ dışarıdan değişince (filtre temizlenince) sıfırla
  useEffect(() => { setValue(currentQ); }, [currentQ]);

  const handleChange = (v: string) => {
    setValue(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (v.length === 0 || v.length >= 2) onSearch(v);
    }, 300);
  };

  return (
    <div className="relative mb-6">
      <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kk-text-muted pointer-events-none" />
      <input
        value={value}
        onChange={e => handleChange(e.target.value)}
        placeholder="Hoca adına göre ara..."
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
  { value: "puan_azalan",  label: "En Yüksek Puan" },
  { value: "puan_artan",   label: "En Düşük Puan" },
  { value: "yorum_azalan", label: "En Çok Yorum" },
  { value: "yorum_artan",  label: "En Az Yorum" },
];

export function InstructorFilters({
  departments, titles, instructors,
  totalPages, currentPage, currentBolum, currentUnvan, currentSiralama, currentQ, totalCount,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const hasFilters = currentUnvan;
  const [showClear, setShowClear] = useState(!!hasFilters);
  const [clearClosing, setClearClosing] = useState(false);
  const prevHasFilters = useRef(hasFilters);

  useEffect(() => {
    if (hasFilters && !prevHasFilters.current) {
      setShowClear(true);
      setClearClosing(false);
    } else if (!hasFilters && prevHasFilters.current) {
      setClearClosing(true);
      setTimeout(() => { setShowClear(false); setClearClosing(false); }, 220);
    }
    prevHasFilters.current = hasFilters;
  }, [hasFilters]);

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams();
    if (currentBolum)   params.set("bolum",    currentBolum);
    if (currentUnvan)   params.set("unvan",    currentUnvan);
    if (currentSiralama && currentSiralama !== "puan_azalan") params.set("siralama", currentSiralama);
    if (currentQ)       params.set("q",        currentQ);
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
    if (currentQ) params.set("q", currentQ);
    if (p > 1) params.set("sayfa", String(p));
    router.push(`${pathname}?${params.toString()}`);
  }


  return (
    <div>
      {/* Filtre Çubuğu */}
      <div className="flex flex-wrap gap-3 items-center mb-3 w-full">
        {/* Unvan filtreleri */}
        <div className="grid grid-cols-3 gap-2 w-full md:flex md:flex-wrap md:w-auto">
          {TITLE_GROUPS.map(group => {
            const groupKey = group.values.join(",");
            const active = currentUnvan === groupKey;
            return (
              <button
                key={group.label}
                onClick={() => updateParams({ unvan: active ? "" : groupKey })}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold border-[1.5px] transition-all cursor-pointer text-center w-full md:w-auto"
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

        {/* Sıralama + Temizle — mobilde grid */}
        <div
          className="grid gap-2 w-full md:contents"
          style={{
            gridTemplateColumns: showClear ? "1fr 1fr" : "1fr",
            transition: "grid-template-columns 0.25s ease",
          }}
        >
          <style>{`
            @keyframes kk-slide-in  { from { opacity:0; transform:translateX(8px);  } to { opacity:1; transform:translateX(0);    } }
            @keyframes kk-slide-out { from { opacity:1; transform:translateX(0);    } to { opacity:0; transform:translateX(8px);  } }
          `}</style>

          <div className="relative md:ml-auto">
            <select
              value={currentSiralama}
              onChange={e => updateParams({ siralama: e.target.value })}
              className="appearance-none w-full pl-4 pr-8 py-2.5 rounded-xl border-[1.5px] border-[#e8e2d9] bg-white text-kk-blue text-sm font-medium outline-none cursor-pointer focus:border-kk-blue-light transition-all"
            >
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-kk-text-muted pointer-events-none" />
          </div>

          {showClear && (
            <button
              onClick={() => router.push(pathname)}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-200 bg-red-50 hover:bg-red-100 cursor-pointer"
              style={{ animation: `${clearClosing ? "kk-slide-out" : "kk-slide-in"} 0.22s ease forwards` }}
            >
              <X size={12} /> Filtreleri Temizle
            </button>
          )}
        </div>
      </div>

      {/* Arama barı — debounced */}
      <SearchBar currentQ={currentQ} onSearch={q => updateParams({ q, sayfa: "1" })} />


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
