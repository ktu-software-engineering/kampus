"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Star,
  TrendingUp,
  MapPin,
  ArrowRight,
  PenLine,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { CATEGORIES, RECENT_REVIEWS, TRENDING_PROFESSORS } from "@/data/mock-data";

const heroImage = "/images/unnamed.jpg";
const ktuLogo = "/images/ktu_logo.png";

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-[3px]">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          fill={s <= Math.round(value) ? "var(--color-kk-gold)" : "transparent"}
          color={s <= Math.round(value) ? "var(--color-kk-gold)" : "#c9c2b5"}
        />
      ))}
      <span className="text-[12px] text-kk-text-muted ml-1">{value}</span>
    </div>
  );
}

function IllustrationGraduationCap({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 82" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.82}>
      <path d="M50 9 L84 25 L50 41 L16 25 Z" stroke="var(--color-kk-text)" strokeWidth="1.9" strokeLinejoin="round" fill="rgba(255,255,255,0.1)" />
      <path d="M26 31 C26 31 26 51 26 53 Q50 64 74 53 L74 31" stroke="var(--color-kk-text)" strokeWidth="1.7" strokeLinejoin="round" fill="rgba(255,255,255,0.07)" />
      <line x1="28" y1="33" x2="27" y2="44" stroke="var(--color-kk-text)" strokeWidth="0.9" opacity="0.35" />
      <line x1="32" y1="32" x2="30" y2="46" stroke="var(--color-kk-text)" strokeWidth="0.9" opacity="0.35" />
      <line x1="36" y1="31" x2="34" y2="49" stroke="var(--color-kk-text)" strokeWidth="0.9" opacity="0.35" />
      <line x1="40" y1="30" x2="38" y2="51" stroke="var(--color-kk-text)" strokeWidth="0.9" opacity="0.35" />
      <ellipse cx="54" cy="25" rx="3.5" ry="2.8" stroke="var(--color-kk-text)" strokeWidth="1.4" fill="none" />
      <path d="M57 25 L80 25" stroke="var(--color-kk-text)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M80 25 L80 47" stroke="var(--color-kk-text)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M76 47 C75 50 76 52 80 52 C84 52 85 50 84 47 Z" stroke="var(--color-kk-text)" strokeWidth="1.3" fill="none" />
      <line x1="77" y1="52" x2="76" y2="62" stroke="var(--color-kk-text)" strokeWidth="1.0" strokeLinecap="round" opacity="0.7" />
      <line x1="80" y1="52" x2="80" y2="63" stroke="var(--color-kk-text)" strokeWidth="1.0" strokeLinecap="round" opacity="0.7" />
      <line x1="83" y1="52" x2="84" y2="62" stroke="var(--color-kk-text)" strokeWidth="1.0" strokeLinecap="round" opacity="0.7" />
      <line x1="78" y1="62" x2="82" y2="62" stroke="var(--color-kk-text)" strokeWidth="1.0" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function IllustrationProfessor({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.9}>
      <circle cx="50" cy="20" r="13" stroke="var(--color-kk-text)" strokeWidth="1.8" fill="rgba(255,255,255,0.09)" />
      <circle cx="44" cy="19" r="4.5" stroke="var(--color-kk-text)" strokeWidth="1.3" fill="rgba(255,255,255,0.05)" />
      <circle cx="56" cy="19" r="4.5" stroke="var(--color-kk-text)" strokeWidth="1.3" fill="rgba(255,255,255,0.05)" />
      <line x1="48.5" y1="19" x2="51.5" y2="19" stroke="var(--color-kk-text)" strokeWidth="1.3" />
      <line x1="39.5" y1="18" x2="36" y2="16" stroke="var(--color-kk-text)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="60.5" y1="18" x2="64" y2="16" stroke="var(--color-kk-text)" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M46 23 Q50 26 54 23" stroke="var(--color-kk-text)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M31 72 C31 52 38 38 50 36 C62 38 69 52 69 72" stroke="var(--color-kk-text)" strokeWidth="1.8" strokeLinejoin="round" fill="rgba(255,255,255,0.07)" />
      <path d="M50 36 L46 44 L40 40" stroke="var(--color-kk-text)" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <path d="M50 36 L54 44 L60 40" stroke="var(--color-kk-text)" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <path d="M33 74 L50 70 L67 74 L67 86 L50 82 L33 86 Z" stroke="var(--color-kk-text)" strokeWidth="1.6" strokeLinejoin="round" fill="rgba(255,255,255,0.08)" />
      <line x1="50" y1="70" x2="50" y2="82" stroke="var(--color-kk-text)" strokeWidth="1.2" />
      <line x1="36" y1="77" x2="48" y2="74.5" stroke="var(--color-kk-text)" strokeWidth="0.85" opacity="0.5" />
      <line x1="36" y1="80" x2="48" y2="78" stroke="var(--color-kk-text)" strokeWidth="0.85" opacity="0.5" />
      <line x1="52" y1="74.5" x2="64" y2="77" stroke="var(--color-kk-text)" strokeWidth="0.85" opacity="0.5" />
      <line x1="52" y1="78" x2="64" y2="80" stroke="var(--color-kk-text)" strokeWidth="0.85" opacity="0.5" />
    </svg>
  );
}

function IllustrationBooks({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.88}>
      {/* Arka kitap */}
      <rect x="18" y="18" width="22" height="56" rx="3" stroke="var(--color-kk-text)" strokeWidth="1.8" fill="rgba(255,255,255,0.06)" opacity="0.5" />
      <line x1="24" y1="18" x2="24" y2="74" stroke="var(--color-kk-text)" strokeWidth="1.2" opacity="0.3" />
      {/* Orta kitap */}
      <rect x="38" y="12" width="24" height="62" rx="3" stroke="var(--color-kk-text)" strokeWidth="1.8" fill="rgba(255,255,255,0.08)" opacity="0.7" />
      <line x1="45" y1="12" x2="45" y2="74" stroke="var(--color-kk-text)" strokeWidth="1.2" opacity="0.35" />
      <line x1="50" y1="22" x2="58" y2="22" stroke="var(--color-kk-text)" strokeWidth="1.0" opacity="0.4" strokeLinecap="round" />
      <line x1="50" y1="28" x2="58" y2="28" stroke="var(--color-kk-text)" strokeWidth="1.0" opacity="0.4" strokeLinecap="round" />
      <line x1="50" y1="34" x2="56" y2="34" stroke="var(--color-kk-text)" strokeWidth="1.0" opacity="0.4" strokeLinecap="round" />
      {/* Ön kitap */}
      <rect x="60" y="20" width="20" height="54" rx="3" stroke="var(--color-kk-text)" strokeWidth="1.8" fill="rgba(255,255,255,0.07)" opacity="0.6" />
      <line x1="65" y1="20" x2="65" y2="74" stroke="var(--color-kk-text)" strokeWidth="1.2" opacity="0.3" />
      {/* Bookmark */}
      <path d="M70 20 L70 32 L74 28 L78 32 L78 20" stroke="var(--color-kk-text)" strokeWidth="1.2" fill="rgba(255,255,255,0.1)" strokeLinejoin="round" opacity="0.6" />
    </svg>
  );
}

function KTUWatermark() {
  return (
    <Image
      src={ktuLogo}
      aria-hidden="true"
      alt=""
      width={400}
      height={400}
      loading="eager"
      className="object-contain opacity-15 select-none pointer-events-none block"
      style={{
        filter:
          "brightness(0) saturate(100%) " +
          "invert(28%) sepia(90%) saturate(500%) " +
          "hue-rotate(174deg) brightness(95%)",
      }}
    />
  );
}

function IllustrationFlame({ size = 22, color = "var(--color-kk-gold)" }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 36 48" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * (48 / 36)}>
      <path
        d="M18 46 C10 46 3 39 3 31 C3 24 7 19 12 14 C14 11 14 7 12 3 C16 7 17 13 15 19 C18 15 19 9 18 3 C23 9 23 18 21 25 C24 20 25 13 24 6 C29 13 29 23 26 32 C29 28 30 21 28 14 C33 21 33 32 30 40 C27 45 23 47 18 46 Z"
        stroke={color}
        strokeWidth="1.6"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M18 38 C14 35 13 29 15 25 C17 29 16 34 18 38 Z"
        stroke={color}
        strokeWidth="1.1"
        strokeLinejoin="round"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

function CookieModal({ onClose }: { onClose: () => void }) {
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", handler); document.body.style.overflow = ""; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(6,40,58,0.55)", backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-[560px] max-h-[80vh] flex flex-col rounded-2xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 24px 64px rgba(6,40,58,0.22)" }}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: "#06283a" }}>
          <div>
            <h2 className="text-white font-bold text-[1rem]">Çerez Politikası</h2>
            <p className="text-white/50 text-xs mt-0.5">Son güncelleme: 13 Mayıs 2026</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer">
            ✕
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4 text-[0.875rem] text-[#3a3530] leading-relaxed">
          <p>KampusKarne olarak gizliliğinize saygı duyuyoruz. Bu politika, sitemizde kullandığımız çerezler hakkında bilgi vermektedir.</p>
          <div>
            <h3 className="font-bold text-[#06283a] text-xs uppercase tracking-wider mb-2">Zorunlu Çerezler</h3>
            <p>Oturum yönetimi ve güvenlik için kullanılır. Bu çerezler devre dışı bırakılamaz; site bu çerezler olmadan düzgün çalışmaz.</p>
          </div>
          <div>
            <h3 className="font-bold text-[#06283a] text-xs uppercase tracking-wider mb-2">Analitik Çerezler</h3>
            <p>Sitenin nasıl kullanıldığını anlamak için anonim istatistik toplamamıza yardımcı olur. Kişisel veri içermez.</p>
          </div>
          <div>
            <h3 className="font-bold text-[#06283a] text-xs uppercase tracking-wider mb-2">Çerezleri Nasıl Kontrol Edebilirsiniz?</h3>
            <p>Tarayıcı ayarlarınızdan çerezleri yönetebilir veya silebilirsiniz. Zorunlu çerezlerin kapatılması site işlevselliğini etkileyebilir.</p>
          </div>
          <div>
            <h3 className="font-bold text-[#06283a] text-xs uppercase tracking-wider mb-2">İletişim</h3>
            <p>Çerez politikamız hakkında sorularınız için platform içindeki Öneri/Şikayet bölümünü kullanabilirsiniz.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CookieBanner() {
  const [visible, setVisible] = React.useState(true);
  const [showPolicy, setShowPolicy] = React.useState(false);
  if (!visible) return null;
  return (
    <>
      {showPolicy && <CookieModal onClose={() => setShowPolicy(false)} />}
      <div className="fixed bottom-[90px] left-6 max-w-[340px] bg-kk-beige/97 backdrop-blur-[18px] border border-kk-blue/12 rounded-[18px] p-[18px_20px] z-[29] shadow-[0_8px_32px_-8px_rgba(6,40,58,0.18)] flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <span className="text-[22px] leading-none shrink-0">🍪</span>
          <p className="text-[12.5px] text-[#3d362e] leading-[1.6] m-0">
            Bu site, deneyiminizi geliştirmek için çerezler kullanmaktadır. Devam ederek{" "}
            <span onClick={() => setShowPolicy(true)} className="text-kk-blue-light font-semibold cursor-pointer hover:underline">
              çerez politikamızı
            </span>{" "}
            kabul etmiş sayılırsınız.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="kk-login" size="unsized" onClick={() => setVisible(false)} className="flex-1 rounded-[10px] py-2 text-xs">
            Kabul Et
          </Button>
          <Button variant="kk-ghost-link" size="unsized" onClick={() => setVisible(false)}
            className="flex-1 rounded-[10px] py-2 text-xs border border-kk-blue/15 text-kk-text-muted hover:text-kk-blue justify-center">
            Reddet
          </Button>
        </div>
      </div>
    </>
  );
}

interface InstructorResult {
  id: string;
  full_name: string;
  title: string | null;
  slug: string;
  average_rating: number;
  review_count: number;
}

interface RecentReview {
  id: string; rating: number; comment: string; created_at: string;
  instructor: { id: string; full_name: string; title: string | null; slug: string } | null;
  course: { name: string; code: string } | null;
}
interface TrendingInstructor {
  id: string; full_name: string; title: string | null; slug: string;
  average_rating: number; review_count: number; week_reviews: number;
}

export default function HomePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recentReviews, setRecentReviews] = useState<RecentReview[]>([]);
  const [trending, setTrending] = useState<TrendingInstructor[]>([]);
  const [searchFocused, setSearchFocused] = useState(false);
  const [results, setResults] = useState<InstructorResult[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownRect, setDropdownRect] = useState<DOMRect | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeDropdown = useCallback(() => {
    if (!showDropdown) return;
    setIsClosing(true);
    setTimeout(() => { setIsClosing(false); setShowDropdown(false); }, 200);
  }, [showDropdown]);

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); closeDropdown(); return; }
    const res = await fetch(`/api/instructors?q=${encodeURIComponent(q)}&limit=5`);
    const data = await res.json();
    setResults(data);
    if (data.length > 0) {
      if (formRef.current) setDropdownRect(formRef.current.getBoundingClientRect());
      setShowDropdown(true);
      setIsClosing(false);
    } else {
      closeDropdown();
    }
    setActiveIndex(-1);
  }, [closeDropdown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(val), 280);
  };

  const handleSelect = (instructor: InstructorResult) => {
    closeDropdown();
    setSearchQuery("");
    router.push(`/instructors/${instructor.slug}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) handleSelect(results[activeIndex]);
    else if (results.length > 0) handleSelect(results[0]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, results.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, -1)); }
    if (e.key === "Escape")    { closeDropdown(); setActiveIndex(-1); }
  };

  // Scroll'da pozisyonu güncelle
  useEffect(() => {
    if (!showDropdown) return;
    const update = () => { if (formRef.current) setDropdownRect(formRef.current.getBoundingClientRect()); };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [showDropdown]);

  // Dışarı tıklayınca kapat
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!formRef.current?.contains(e.target as Node)) closeDropdown();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeDropdown]);

  // Gerçek veri: son yorumlar + trend
  useEffect(() => {
    fetch("/api/reviews/recent").then(r => r.json()).then(d => Array.isArray(d) && setRecentReviews(d));
    fetch("/api/instructors/trending").then(r => r.json()).then(d => Array.isArray(d) && setTrending(d));
  }, []);

  return (
    <>
    <div className="min-h-screen bg-kk-beige font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] relative overflow-x-hidden text-kk-text">
      <style>{`
        .display-serif {
          font-family: var(--font-fraunces), 'Georgia', serif;
          font-optical-sizing: auto;
          font-feature-settings: "ss01", "ss02";
        }
        ::selection { background: rgba(0,99,146,0.18); color: #06283a; }
        .kk-search-input::placeholder { color: #a8a090; }
      `}</style>

      <BackgroundTexture />

      <div className="relative z-[1]">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        {/* Hero */}
        <section className="relative overflow-hidden -mt-[110px]">
          <div
            aria-hidden="true"
            className="absolute inset-0 z-0 bg-cover bg-[center_30%]"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
          <div aria-hidden="true" className="absolute inset-0 bg-kk-beige/80 z-[1]" />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-kk-beige via-kk-beige/85 via-40% to-kk-beige/0 to-100% z-[2] pointer-events-none"
          />

          <div className="kk-hero-pad relative z-[3] pt-[180px] pb-14 px-6 text-center">
            <div className="max-w-[720px] mx-auto relative">
              <h1 className="display-serif text-[clamp(26px,4.5vw,58px)] font-medium text-kk-blue leading-[1.05] mb-[22px] tracking-[-0.02em] whitespace-nowrap">
                Hocaları değerlendir,{" "}
                <em className="display-serif italic font-medium text-kk-blue-light">
                  fark yarat.
                </em>
              </h1>

              <p className="text-[#4b443c] text-[clamp(14px,1.4vw,16px)] mb-9 leading-[1.6] max-w-[480px] mx-auto">
                Gerçek öğrenci yorumlarıyla hocaları keşfet, değerlendir ve bilinçli tercih yap.
              </p>

              <form
                ref={formRef}
                onSubmit={handleSearch}
                className="max-w-[600px] mx-auto relative"
                autoComplete="off"
                style={{
                  transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                  transform: searchFocused ? "scale(1.025)" : "scale(1)",
                }}
              >
                <div className={`flex items-center backdrop-blur-[20px] rounded-full border-[1.5px] transition-all duration-300 pl-6 pr-4 py-1.5 h-[62px] ${
                  searchFocused
                    ? "bg-[rgba(255,253,248,0.92)] border-[rgba(6,40,58,0.45)] shadow-[0_16px_48px_-16px_rgba(6,40,58,0.28),0_2px_8px_-2px_rgba(6,40,58,0.1)]"
                    : "bg-[rgba(255,253,248,0.78)] border-[rgba(255,255,255,0.75)] shadow-[0_8px_32px_-12px_rgba(6,40,58,0.18),0_2px_8px_-4px_rgba(6,40,58,0.06)]"
                }`}>
                  <Search
                    size={20}
                    strokeWidth={1.75}
                    className={`shrink-0 transition-colors duration-200 ${searchFocused ? "text-kk-blue" : "text-[#8b8374]"}`}
                  />
                  <input
                    ref={inputRef}
                    className="kk-search-input flex-1 border-none outline-none bg-transparent py-3 px-4 text-base text-kk-blue font-inherit"
                    type="text"
                    value={searchQuery}
                    onChange={handleChange}
                    onFocus={() => { setSearchFocused(true); if (results.length > 0) setShowDropdown(true); }}
                    onBlur={() => setSearchFocused(false)}
                    onKeyDown={handleKeyDown}
                    placeholder="Hoca adı ara..."
                  />
                </div>
              </form>
            </div>
          </div>

        </section>

        {/* Hero → Highlights geçiş gradyanı */}
        <div
          aria-hidden="true"
          className="relative z-[5] pointer-events-none"
          style={{ marginTop: "-120px", height: "120px", background: "linear-gradient(to bottom, transparent, var(--color-kk-beige))" }}
        />

        {/* Hızlı erişim kartları — gradyanın altında */}
        <div className="kk-cat-section relative z-[6] bg-kk-beige pt-2 pb-14 px-6">
          <div className="kk-cat-strip max-w-[820px] mx-auto grid grid-cols-3 gap-5 items-end">
            {CATEGORIES.map(({ label, desc }, idx) => (
              <div key={label} className="kk-cat-wrapper relative h-[160px] md:h-[118px]">
                <Button
                  variant="kk-cat"
                  size="unsized"
                  className="kk-cat-cell backdrop-blur-[18px] absolute top-0 left-0 right-0"
                  onClick={() => {
                    if (idx === 1) router.push("/hocalar");
                    if (idx === 2) router.push("/dersler");
                  }}
                >
                  <span className="block leading-none">
                    {idx === 0 ? (
                      <IllustrationGraduationCap size={72} />
                    ) : idx === 1 ? (
                      <IllustrationProfessor size={72} />
                    ) : (
                      <IllustrationBooks size={72} />
                    )}
                  </span>
                  <div className="overflow-hidden transition-all duration-300 text-center max-h-[72px] opacity-100 mt-4 md:max-h-0 md:opacity-0 md:mt-0 md:group-hover:max-h-[72px] md:group-hover:opacity-100 md:group-hover:mt-4">
                    <p className="display-serif m-0 mb-1 text-kk-blue text-[13px] font-semibold tracking-[-0.01em] whitespace-normal break-words">
                      {label}
                    </p>
                    <p className="m-0 text-kk-text-muted text-[12px] leading-[1.45]">
                      {desc}
                    </p>
                  </div>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <section className="kk-highlights-section relative pt-7 pb-24 px-6 bg-kk-beige">
          <div
            aria-hidden="true"
            className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0"
          >
            <KTUWatermark />
          </div>

          <div className="relative z-[3] max-w-[1100px] mx-auto">
            {/* CTA bandı */}
            <div className="kk-cta-banner relative bg-[rgba(6,40,58,0.58)] backdrop-blur-[28px] saturate-[140%] rounded-[24px] py-9 px-11 text-kk-beige border border-white/14 overflow-hidden mb-14">
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(-38deg,transparent_0px,transparent_16px,rgba(255,255,255,0.045)_16px,rgba(255,255,255,0.045)_17px,transparent_17px,transparent_38px)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_60%_80%_at_0%_0%,rgba(255,255,255,0.10)_0%,transparent_55%),radial-gradient(ellipse_40%_60%_at_100%_100%,rgba(0,99,146,0.18)_0%,transparent_65%)]"
              />
              <div className="kk-cta-inner relative flex items-center justify-between gap-9 flex-wrap">
                <div className="flex items-center gap-[22px] flex-auto min-w-0">
                  <div className="w-[62px] h-[62px] rounded-2xl bg-kk-beige/12 border border-kk-beige/24 flex items-center justify-center shrink-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
                    <PenLine size={26} color="var(--color-kk-beige)" strokeWidth={1.6} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="display-serif text-[clamp(24px,3vw,32px)] font-medium m-0 mb-1.5 tracking-[-0.015em] leading-[1.18] text-kk-beige">
                      Sen de değerlendir,{" "}
                      <em className="display-serif italic font-medium text-[#f0c875]">
                        fark yarat
                      </em>
                    </h2>
                    <p className="text-[14.5px] m-0 opacity-[0.78] leading-[1.55] max-w-[560px] text-kk-beige">
                      Üniversiteni ve hocalarını değerlendirerek geleceğin öğrencilerine
                      ışık tut. Birlikte daha şeffaf bir akademi inşa edelim.
                    </p>
                  </div>
                </div>
                <Button variant="kk-cta" size="unsized" className="kk-cta-btn" onClick={() => router.push("/hocalar")}>
                  Hemen Başla <ArrowRight size={16} strokeWidth={2.25} />
                </Button>
              </div>
            </div>

            {/* İki sütunlu yerleşim */}
            <div className="responsive-grid grid grid-cols-[1fr_360px] gap-8 items-start">
              {/* Sol: Son değerlendirmeler */}
              <div>
                <div className="flex justify-between items-baseline mb-[22px] pl-1">
                  <h2 className="display-serif text-kk-blue text-[28px] font-medium m-0 tracking-[-0.015em]">
                    Son{" "}
                    <em className="display-serif italic font-medium text-kk-blue-light">
                      değerlendirmeler
                    </em>
                  </h2>
                  <Button variant="kk-ghost-link" size="unsized">
                    Tümünü gör <ArrowRight size={14} strokeWidth={2} />
                  </Button>
                </div>

                <div className="flex flex-col gap-3.5">
                  {recentReviews.length === 0 ? (
                    <div className="text-kk-text-muted text-sm text-center py-10">Henüz değerlendirme yok.</div>
                  ) : recentReviews.map((review) => (
                    <div
                      key={review.id}
                      onClick={() => review.instructor && router.push(`/instructors/${review.instructor.slug}`)}
                      className="relative bg-[#FFfdf8]/80 rounded-[20px] py-[22px] px-6 border border-white/80 shadow-[0_6px_28px_-12px_rgba(6,40,58,0.10),inset_0_1px_0_rgba(255,255,255,0.75)] cursor-pointer transition-all duration-250 overflow-hidden hover:-translate-y-[3px] hover:shadow-[0_18px_44px_-14px_rgba(6,40,58,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#009992]/28 hover:bg-[#FFfdf8]/90"
                    >
                      <div className="relative flex justify-between items-start mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="display-serif text-[18px] font-semibold text-kk-blue m-0 mb-2 tracking-[-0.01em]">
                            {review.instructor
                              ? (review.instructor.title
                                  ? `${review.instructor.title} ${review.instructor.full_name}`
                                  : review.instructor.full_name)
                              : "Bilinmeyen Hoca"}
                          </h3>
                          {review.course && (
                            <span className="bg-kk-blue-light/10 text-kk-blue-light py-[3px] px-[11px] rounded-[20px] text-[11px] font-semibold tracking-[0.01em] border border-kk-blue-light/18">
                              {review.course.code} — {review.course.name}
                            </span>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center gap-1 justify-end mb-1">
                            {[1,2,3,4,5].map(s => (
                              <Star key={s} size={17}
                                fill={s <= Math.round(review.rating) ? "var(--color-kk-gold)" : "transparent"}
                                color={s <= Math.round(review.rating) ? "var(--color-kk-gold)" : "#c9c2b5"}
                              />
                            ))}
                            <span className="text-[14px] font-bold text-kk-gold ml-1">{review.rating}</span>
                          </div>
                          <p className="text-[10.5px] text-[#a8a090] m-0 mt-[3px] tracking-[0.01em]">
                            {new Date(review.created_at).toLocaleDateString("tr-TR", { day:"numeric", month:"long" })}
                          </p>
                        </div>
                      </div>
                      <p className="display-serif relative text-[15px] text-[#3d362e] leading-[1.65] m-0 italic font-normal border-t border-kk-blue/05 pt-3">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sağ: Bu haftanın trendi */}
              <div>
                <div className="mb-[22px] flex items-center gap-[11px] pl-1">
                  <IllustrationFlame size={24} color="var(--color-kk-gold)" />
                  <h2 className="display-serif text-kk-blue text-[23px] font-medium m-0 tracking-[-0.015em]">
                    Bu Hafta{" "}
                    <em className="display-serif italic font-medium text-kk-gold">
                      Trend
                    </em>
                  </h2>
                </div>

                <div className="bg-[#FFfdf8]/45 rounded-[20px] overflow-hidden border border-white/60 shadow-[0_6px_28px_-12px_rgba(6,40,58,0.10),inset_0_1px_0_rgba(255,255,255,0.75)]">
                  {trending.length === 0 ? (
                    <div className="text-kk-text-muted text-sm text-center py-8">Henüz veri yok.</div>
                  ) : trending.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => router.push(`/instructors/${item.slug}`)}
                      className="py-4 px-5 flex items-center gap-3.5 border-b border-kk-blue/07 last:border-none cursor-pointer transition-colors duration-200 hover:bg-kk-blue-light/06"
                    >
                      <div
                        className={`display-serif w-8 h-8 rounded-full flex items-center justify-center text-[14px] font-bold shrink-0 ${
                          idx === 0
                            ? "bg-gradient-to-br from-kk-blue to-kk-blue-light text-kk-beige shadow-[0_3px_10px_-2px_rgba(6,40,58,0.3)]"
                            : idx === 1
                              ? "bg-kk-blue-light/14 text-kk-blue"
                              : "bg-kk-blue/07 text-kk-blue"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-semibold text-kk-blue m-0 mb-[3px] overflow-hidden text-ellipsis whitespace-nowrap">
                          {item.title ? `${item.title} ${item.full_name}` : item.full_name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-kk-text-muted">
                          <span>{item.review_count} yorum</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-[2px] shrink-0">
                        {item.average_rating > 0 && <StarRating value={item.average_rating} />}
                        <div className="flex items-center gap-[3px]">
                          <TrendingUp size={10} color="#2f8c4f" strokeWidth={2.5} />
                          <span className="text-[10.5px] text-[#2f8c4f] font-bold">+{item.week_reviews} bu hafta</span>
                        </div>
                      </div>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />

        <CookieBanner />
        <FeedbackButton />
      </div>

      <style>{`
        @media (max-width: 860px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
          .kk-cta-inner { flex-direction: column !important; align-items: flex-start !important; gap: 24px !important; }
          .kk-cta-btn { width: 100% !important; justify-content: center !important; }
        }
        @media (max-width: 768px) {
          .desktop-nav-links { display: none !important; }
          .login-btn { padding: 9px 16px !important; margin-left: 0 !important; }
          .kk-header { padding: 14px 18px !important; }
          .kk-hero-pad { padding: 150px 20px 44px !important; }
          .kk-cat-section { padding: 16px 16px 24px !important; }
          .kk-highlights-section { padding: 20px 18px 72px !important; }
          .kk-cta-banner { padding: 28px 24px !important; border-radius: 20px !important; }
        }
        @media (max-width: 640px) {
          .kk-cat-strip { grid-template-columns: repeat(3, 1fr) !important; gap: 12px !important; max-width: 100% !important; }
          .kk-cat-cell { padding: 20px 10px 16px !important; border-radius: 18px !important; }
          .kk-cat-wrapper { height: 140px !important; }
          .kk-footer-inner { flex-direction: column !important; align-items: flex-start !important; gap: 8px !important; }
        }
        @media (max-width: 420px) {
          .kk-cat-strip { grid-template-columns: repeat(3, 1fr) !important; gap: 8px !important; }
        }
        @media (min-width: 769px) {
          .mobile-hamburger { display: none !important; }
        }
        @media (max-width: 768px) {
          .kk-logo-group { flex-direction: column !important; align-items: center !important; gap: 6px !important; }
          .kk-site-logo { height: 46px !important; margin-left: 4px !important; }
        }
      `}</style>
    </div>

    {/* Arama dropdown — portal ile body'ye render edilir, overflow:hidden'dan etkilenmez */}
    {(showDropdown || isClosing) && dropdownRect && typeof document !== "undefined" && createPortal(
      <>
        <style>{`
          @keyframes kk-search-in  { from { opacity:0; transform:translateY(-6px) scale(0.98); } to { opacity:1; transform:translateY(0) scale(1); } }
          @keyframes kk-search-out { from { opacity:1; transform:translateY(0) scale(1); } to { opacity:0; transform:translateY(-6px) scale(0.98); } }
        `}</style>
        <div
          style={{
            position: "fixed",
            top: dropdownRect.bottom + 8,
            left: dropdownRect.left,
            width: dropdownRect.width,
            zIndex: 9999,
            borderRadius: 16,
            overflow: "hidden",
            background: "rgba(255,253,248,0.98)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1.5px solid rgba(6,40,58,0.12)",
            boxShadow: "0 24px 56px -12px rgba(6,40,58,0.24), 0 4px 16px -4px rgba(6,40,58,0.1)",
            animation: isClosing
              ? "kk-search-out 200ms cubic-bezier(0.4,0,1,1) forwards"
              : "kk-search-in 220ms cubic-bezier(0,0,0.2,1) forwards",
          }}
        >
          {results.map((instructor, i) => (
            <button
              key={instructor.id}
              type="button"
              onMouseDown={() => handleSelect(instructor)}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(6,40,58,0.09)")}
              onMouseLeave={e => (e.currentTarget.style.background = i === activeIndex ? "rgba(6,40,58,0.06)" : "transparent")}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors cursor-pointer"
              style={{
                background: i === activeIndex ? "rgba(6,40,58,0.06)" : "transparent",
                borderBottom: i < results.length - 1 ? "1px solid rgba(6,40,58,0.06)" : "none",
              }}
            >
              <div className="w-8 h-8 rounded-lg bg-kk-blue/10 flex items-center justify-center shrink-0">
                <GraduationCap size={16} className="text-kk-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-kk-blue font-semibold text-sm truncate">
                  {instructor.title ? `${instructor.title} ${instructor.full_name}` : instructor.full_name}
                </div>
                {instructor.review_count > 0 && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star size={11} className="text-kk-gold" fill="currentColor" />
                    <span className="text-[11px] text-kk-text-muted font-medium">
                      {instructor.average_rating.toFixed(1)} · {instructor.review_count} yorum
                    </span>
                  </div>
                )}
              </div>
              <ArrowRight size={14} className="text-kk-text-muted shrink-0 opacity-40" />
            </button>
          ))}
        </div>
      </>,
      document.body
    )}
    </>
  );
}
