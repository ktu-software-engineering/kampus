"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  GraduationCap,
  Star,
  TrendingUp,
  MapPin,
  ArrowRight,
  PenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FeedbackButton } from "@/components/FeedbackButton";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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

function BackgroundTexture() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `
            repeating-linear-gradient(
              -38deg,
              transparent 0px,
              transparent 18px,
              rgba(255,255,255,0.55) 18px,
              rgba(255,255,255,0.55) 19px,
              transparent 19px,
              transparent 42px
            ),
            repeating-linear-gradient(
              -38deg,
              transparent 0px,
              transparent 74px,
              rgba(255,255,255,0.32) 74px,
              rgba(255,255,255,0.32) 76px,
              transparent 76px,
              transparent 160px
            )
          `,
          maskImage:
            "radial-gradient(ellipse 95% 70% at 20% 10%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 70% at 20% 10%, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, transparent 85%)",
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0 opacity-[0.18]"
        style={{
          background: `
            radial-gradient(circle at 20% 35%, rgba(180,160,120,0.15) 0%, transparent 50%),
            radial-gradient(circle at 75% 15%, rgba(160,140,100,0.12) 0%, transparent 45%),
            radial-gradient(circle at 55% 70%, rgba(200,180,140,0.10) 0%, transparent 40%),
            radial-gradient(circle at 10% 80%, rgba(170,150,110,0.08) 0%, transparent 35%)
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 0%, rgba(255,248,232,0.55) 0%, transparent 60%), radial-gradient(ellipse 100% 70% at 80% 110%, rgba(0,99,146,0.05) 0%, transparent 60%)",
        }}
      />
    </>
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

function IllustrationMap({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.88}>
      <path d="M10 16 L35 9 L65 20 L90 12 L90 72 L65 79 L35 68 L10 76 Z" stroke="var(--color-kk-text)" strokeWidth="1.8" strokeLinejoin="round" fill="rgba(255,255,255,0.07)" />
      <line x1="35" y1="9" x2="35" y2="68" stroke="var(--color-kk-text)" strokeWidth="1.2" opacity="0.4" />
      <line x1="65" y1="20" x2="65" y2="79" stroke="var(--color-kk-text)" strokeWidth="1.2" opacity="0.4" />
      <path d="M14 32 C22 30 30 38 35 35 C42 30 50 40 58 38 C65 36 72 42 84 40" stroke="var(--color-kk-text)" strokeWidth="1.1" opacity="0.45" strokeLinecap="round" fill="none" />
      <path d="M14 52 C22 50 30 57 38 54" stroke="var(--color-kk-text)" strokeWidth="1.0" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M68 45 C74 43 80 50 84 55" stroke="var(--color-kk-text)" strokeWidth="1.0" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M50 22 C46 22 42 26 42 30 C42 37 50 45 50 45 C50 45 58 37 58 30 C58 26 54 22 50 22 Z" stroke="var(--color-kk-text)" strokeWidth="1.6" fill="rgba(255,255,255,0.1)" />
      <circle cx="50" cy="30" r="4" stroke="var(--color-kk-text)" strokeWidth="1.3" fill="rgba(255,255,255,0.08)" />
      <path d="M16 62 L20 56 L24 62" stroke="var(--color-kk-text)" strokeWidth="1.0" opacity="0.45" strokeLinejoin="round" fill="none" />
      <path d="M22 62 L27 54 L32 62" stroke="var(--color-kk-text)" strokeWidth="1.0" opacity="0.45" strokeLinejoin="round" fill="none" />
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

function CookieBanner() {
  const [visible, setVisible] = React.useState(true);
  if (!visible) return null;
  return (
    <div className="fixed bottom-[90px] left-6 max-w-[340px] bg-kk-beige/97 backdrop-blur-[18px] border border-kk-blue/12 rounded-[18px] p-[18px_20px] z-[29] shadow-[0_8px_32px_-8px_rgba(6,40,58,0.18)] flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <span className="text-[22px] leading-none shrink-0">🍪</span>
        <p className="text-[12.5px] text-[#3d362e] leading-[1.6] m-0">
          Bu site, deneyiminizi geliştirmek için çerezler kullanmaktadır. Devam ederek{" "}
          <span className="text-kk-blue-light font-semibold cursor-pointer">
            çerez politikamızı
          </span>{" "}
          kabul etmiş sayılırsınız.
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant="kk-login"
          size="unsized"
          onClick={() => setVisible(false)}
          className="flex-1 rounded-[10px] py-2 text-xs"
        >
          Kabul Et
        </Button>
        <Button
          variant="kk-ghost-link"
          size="unsized"
          onClick={() => setVisible(false)}
          className="flex-1 rounded-[10px] py-2 text-xs border border-kk-blue/15 text-kk-text-muted hover:text-kk-blue justify-center"
        >
          Reddet
        </Button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
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
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-[340px] bg-gradient-to-t from-kk-beige from-0% via-kk-beige/97 via-18% via-kk-beige/85 via-40% via-kk-beige/50 via-65% via-kk-beige/15 via-85% to-kk-beige/0 to-100% z-[2] pointer-events-none"
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
                onSubmit={handleSearch}
                className="max-w-[600px] mx-auto relative"
              >
                <div className={`flex items-center backdrop-blur-[20px] rounded-full border-[1.5px] transition-all duration-300 pl-6 pr-2 py-1.5 h-[62px] ${
                  searchFocused 
                    ? "bg-[rgba(255,253,248,0.92)] border-[rgba(6,40,58,0.45)] shadow-[0_16px_48px_-16px_rgba(6,40,58,0.28),0_2px_8px_-2px_rgba(6,40,58,0.1)]" 
                    : "bg-[rgba(255,253,248,0.78)] border-[rgba(255,255,255,0.75)] shadow-[0_8px_32px_-12px_rgba(6,40,58,0.18),0_2px_8px_-4px_rgba(6,40,58,0.06)]"
                }`}>
                  <GraduationCap
                    size={20}
                    strokeWidth={1.75}
                    className={`shrink-0 transition-colors duration-200 ${searchFocused ? "text-kk-blue" : "text-[#8b8374]"}`}
                  />
                  <input
                    ref={inputRef}
                    className="kk-search-input flex-1 border-none outline-none bg-transparent py-3 px-4 text-base text-kk-blue font-inherit"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Üniversite, hoca veya bölüm ara"
                  />
                  {searchQuery.trim().length > 0 && (
                    <Button type="submit" variant="kk-search-submit" size="unsized">
                      Ara <ArrowRight size={14} strokeWidth={2.25} />
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Hızlı erişim kartları */}
          <div className="kk-cat-section relative z-[3] pt-4 pb-14 px-6">
            <div className="kk-cat-strip max-w-[820px] mx-auto grid grid-cols-3 gap-5 items-end">
              {CATEGORIES.map(({ label, desc }, idx) => (
                <div key={label} className="kk-cat-wrapper relative h-[118px]">
                  <Button
                    variant="kk-cat"
                    size="unsized"
                    className="kk-cat-cell backdrop-blur-[18px] absolute top-0 left-0 right-0"
                  >
                    <span className="block leading-none">
                      {idx === 0 ? (
                        <IllustrationGraduationCap size={72} />
                      ) : idx === 1 ? (
                        <IllustrationProfessor size={72} />
                      ) : (
                        <IllustrationMap size={72} />
                      )}
                    </span>
                    <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-[72px] group-hover:opacity-100 group-hover:mt-4 transition-all duration-300 text-center">
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
        </section>

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
                <Button variant="kk-cta" size="unsized" className="kk-cta-btn">
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
                  {RECENT_REVIEWS.map((review) => (
                    <div
                      key={review.id}
                      className="relative bg-[#FFfdf8]/45 rounded-[20px] py-[22px] px-6 border border-white/60 shadow-[0_6px_28px_-12px_rgba(6,40,58,0.10),inset_0_1px_0_rgba(255,255,255,0.75)] cursor-pointer transition-all duration-250 overflow-hidden hover:-translate-y-[3px] hover:shadow-[0_18px_44px_-14px_rgba(6,40,58,0.18),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-[#009992]/28 hover:bg-[#FFfdf8]/60"
                    >
                      <div className="relative flex justify-between items-start mb-3 gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="display-serif text-[18px] font-semibold text-kk-blue m-0 mb-2 tracking-[-0.01em]">
                            {review.professor}
                          </h3>
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="bg-kk-blue-light/10 text-kk-blue-light py-[3px] px-[11px] rounded-[20px] text-[11px] font-semibold tracking-[0.01em] border border-kk-blue-light/18">
                              {review.department}
                            </span>
                            <span className="text-[11px] text-[#8b8374] inline-flex items-center gap-1">
                              <MapPin size={11} strokeWidth={2} />
                              {review.city}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <StarRating value={review.rating} />
                          <p className="text-[10.5px] text-[#a8a090] m-0 mt-[5px] tracking-[0.01em]">
                            {review.time}
                          </p>
                        </div>
                      </div>
                      <p className="display-serif relative text-[15px] text-[#3d362e] leading-[1.65] m-0 italic font-normal border-t border-kk-blue/05 pt-3">
                        &ldquo;{review.review}&rdquo;
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
                  {TRENDING_PROFESSORS.map((item, idx) => (
                    <div
                      key={item.name}
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
                          {item.name}
                        </p>
                        <div className="flex items-center gap-1.5 text-[11px] text-kk-text-muted">
                          <span>{item.field}</span>
                          <span className="text-[#c0b7a6]">·</span>
                          <span>{item.university}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-[2px] shrink-0">
                        <StarRating value={item.rating} />
                        <div className="flex items-center gap-[3px]">
                          <TrendingUp size={10} color="#2f8c4f" strokeWidth={2.5} />
                          <span className="text-[10.5px] text-[#2f8c4f] font-bold">{item.trend}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="py-3 px-5 pb-3.5 border-t border-kk-blue/07">
                    <Button variant="kk-ghost-link" size="unsized" className="w-full justify-center py-2">
                      Tüm Sıralamayı Gör <ArrowRight size={14} strokeWidth={2} />
                    </Button>
                  </div>
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
  );
}
