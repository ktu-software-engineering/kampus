"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
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

const heroImage = "/images/unnamed.jpg";
const ktuLogo = "/images/ktu_logo.png";
const siteLogo = "/images/site_logo-1.png";
const newSiteLogo = "/images/new_site_logo_1.png";

const CATEGORIES = [
  { emoji: "🎓", label: "Üniversite Ara", desc: "Türkiye genelinde keşfet" },
  { emoji: "👨‍🏫", label: "Hoca Ara", desc: "Akademisyenleri değerlendir" },
  { emoji: "🗺️", label: "Şehre Göre", desc: "Yakınındaki kampüsleri gör" },
];

const RECENT_REVIEWS = [
  {
    id: 1,
    professor: "Prof. Dr. Ahmet Yılmaz",
    university: "Boğaziçi Üniversitesi",
    city: "İstanbul",
    rating: 4.9,
    review:
      "Dersleri son derece anlaşılır anlatıyor. Öğrenciye verdiği değer ve ilgi gerçekten takdire şayan.",
    department: "Bilgisayar Mühendisliği",
    time: "2 saat önce",
  },
  {
    id: 2,
    professor: "Doç. Dr. Zeynep Demir",
    university: "ODTÜ",
    city: "Ankara",
    rating: 4.7,
    review:
      "Araştırmaya yönlendirme konusunda çok destekleyici. Sınav soruları düşündürücü ve adil.",
    department: "Elektrik-Elektronik",
    time: "5 saat önce",
  },
  {
    id: 3,
    professor: "Prof. Dr. Mehmet Kaya",
    university: "İTÜ",
    city: "İstanbul",
    rating: 4.5,
    review:
      "Uygulamaya dayalı öğretim anlayışı mükemmel. Sanayi tecrübesini derse yansıtıyor.",
    department: "Endüstri Mühendisliği",
    time: "1 gün önce",
  },
];

const TRENDING_PROFESSORS = [
  { name: "Prof. Dr. Ahmet Yılmaz", field: "Bilgisayar Müh.", university: "Boğaziçi", rating: 4.9, trend: "+14%" },
  { name: "Doç. Dr. Zeynep Demir", field: "Elektrik-Elektronik", university: "ODTÜ", rating: 4.7, trend: "+9%" },
  { name: "Prof. Dr. Mehmet Kaya", field: "Endüstri Müh.", university: "İTÜ", rating: 4.5, trend: "+7%" },
  { name: "Dr. Ayşe Şahin", field: "İşletme", university: "Hacettepe", rating: 4.3, trend: "+5%" },
];

function StarRating({ value }: { value: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          fill={s <= Math.round(value) ? "#C8941A" : "transparent"}
          color={s <= Math.round(value) ? "#C8941A" : "#c9c2b5"}
        />
      ))}
      <span style={{ fontSize: "12px", color: "#6b6356", marginLeft: "4px" }}>{value}</span>
    </div>
  );
}

function BackgroundTexture() {
  return (
    <>
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
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
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          opacity: 0.18,
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
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
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
      <path d="M50 9 L84 25 L50 41 L16 25 Z" stroke="#2a2520" strokeWidth="1.9" strokeLinejoin="round" fill="rgba(255,255,255,0.1)" />
      <path d="M26 31 C26 31 26 51 26 53 Q50 64 74 53 L74 31" stroke="#2a2520" strokeWidth="1.7" strokeLinejoin="round" fill="rgba(255,255,255,0.07)" />
      <line x1="28" y1="33" x2="27" y2="44" stroke="#2a2520" strokeWidth="0.9" opacity="0.35" />
      <line x1="32" y1="32" x2="30" y2="46" stroke="#2a2520" strokeWidth="0.9" opacity="0.35" />
      <line x1="36" y1="31" x2="34" y2="49" stroke="#2a2520" strokeWidth="0.9" opacity="0.35" />
      <line x1="40" y1="30" x2="38" y2="51" stroke="#2a2520" strokeWidth="0.9" opacity="0.35" />
      <ellipse cx="54" cy="25" rx="3.5" ry="2.8" stroke="#2a2520" strokeWidth="1.4" fill="none" />
      <path d="M57 25 L80 25" stroke="#2a2520" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M80 25 L80 47" stroke="#2a2520" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M76 47 C75 50 76 52 80 52 C84 52 85 50 84 47 Z" stroke="#2a2520" strokeWidth="1.3" fill="none" />
      <line x1="77" y1="52" x2="76" y2="62" stroke="#2a2520" strokeWidth="1.0" strokeLinecap="round" opacity="0.7" />
      <line x1="80" y1="52" x2="80" y2="63" stroke="#2a2520" strokeWidth="1.0" strokeLinecap="round" opacity="0.7" />
      <line x1="83" y1="52" x2="84" y2="62" stroke="#2a2520" strokeWidth="1.0" strokeLinecap="round" opacity="0.7" />
      <line x1="78" y1="62" x2="82" y2="62" stroke="#2a2520" strokeWidth="1.0" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function IllustrationProfessor({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 90" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.9}>
      <circle cx="50" cy="20" r="13" stroke="#2a2520" strokeWidth="1.8" fill="rgba(255,255,255,0.09)" />
      <circle cx="44" cy="19" r="4.5" stroke="#2a2520" strokeWidth="1.3" fill="rgba(255,255,255,0.05)" />
      <circle cx="56" cy="19" r="4.5" stroke="#2a2520" strokeWidth="1.3" fill="rgba(255,255,255,0.05)" />
      <line x1="48.5" y1="19" x2="51.5" y2="19" stroke="#2a2520" strokeWidth="1.3" />
      <line x1="39.5" y1="18" x2="36" y2="16" stroke="#2a2520" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="60.5" y1="18" x2="64" y2="16" stroke="#2a2520" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M46 23 Q50 26 54 23" stroke="#2a2520" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M31 72 C31 52 38 38 50 36 C62 38 69 52 69 72" stroke="#2a2520" strokeWidth="1.8" strokeLinejoin="round" fill="rgba(255,255,255,0.07)" />
      <path d="M50 36 L46 44 L40 40" stroke="#2a2520" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <path d="M50 36 L54 44 L60 40" stroke="#2a2520" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
      <path d="M33 74 L50 70 L67 74 L67 86 L50 82 L33 86 Z" stroke="#2a2520" strokeWidth="1.6" strokeLinejoin="round" fill="rgba(255,255,255,0.08)" />
      <line x1="50" y1="70" x2="50" y2="82" stroke="#2a2520" strokeWidth="1.2" />
      <line x1="36" y1="77" x2="48" y2="74.5" stroke="#2a2520" strokeWidth="0.85" opacity="0.5" />
      <line x1="36" y1="80" x2="48" y2="78" stroke="#2a2520" strokeWidth="0.85" opacity="0.5" />
      <line x1="52" y1="74.5" x2="64" y2="77" stroke="#2a2520" strokeWidth="0.85" opacity="0.5" />
      <line x1="52" y1="78" x2="64" y2="80" stroke="#2a2520" strokeWidth="0.85" opacity="0.5" />
    </svg>
  );
}

function IllustrationMap({ size = 64 }: { size?: number }) {
  return (
    <svg viewBox="0 0 100 88" fill="none" xmlns="http://www.w3.org/2000/svg" width={size} height={size * 0.88}>
      <path d="M10 16 L35 9 L65 20 L90 12 L90 72 L65 79 L35 68 L10 76 Z" stroke="#2a2520" strokeWidth="1.8" strokeLinejoin="round" fill="rgba(255,255,255,0.07)" />
      <line x1="35" y1="9" x2="35" y2="68" stroke="#2a2520" strokeWidth="1.2" opacity="0.4" />
      <line x1="65" y1="20" x2="65" y2="79" stroke="#2a2520" strokeWidth="1.2" opacity="0.4" />
      <path d="M14 32 C22 30 30 38 35 35 C42 30 50 40 58 38 C65 36 72 42 84 40" stroke="#2a2520" strokeWidth="1.1" opacity="0.45" strokeLinecap="round" fill="none" />
      <path d="M14 52 C22 50 30 57 38 54" stroke="#2a2520" strokeWidth="1.0" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M68 45 C74 43 80 50 84 55" stroke="#2a2520" strokeWidth="1.0" opacity="0.4" strokeLinecap="round" fill="none" />
      <path d="M50 22 C46 22 42 26 42 30 C42 37 50 45 50 45 C50 45 58 37 58 30 C58 26 54 22 50 22 Z" stroke="#2a2520" strokeWidth="1.6" fill="rgba(255,255,255,0.1)" />
      <circle cx="50" cy="30" r="4" stroke="#2a2520" strokeWidth="1.3" fill="rgba(255,255,255,0.08)" />
      <path d="M16 62 L20 56 L24 62" stroke="#2a2520" strokeWidth="1.0" opacity="0.45" strokeLinejoin="round" fill="none" />
      <path d="M22 62 L27 54 L32 62" stroke="#2a2520" strokeWidth="1.0" opacity="0.45" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function KTUWatermark() {
  return (
    <img
      src={ktuLogo}
      aria-hidden="true"
      alt=""
      style={{
        width: "400px",
        height: "400px",
        objectFit: "contain",
        opacity: 0.15,
        filter:
          "brightness(0) saturate(100%) " +
          "invert(28%) sepia(90%) saturate(500%) " +
          "hue-rotate(174deg) brightness(95%)",
        userSelect: "none",
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}

function IllustrationFlame({ size = 22, color = "#C8941A" }: { size?: number; color?: string }) {
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
    <div
      style={{
        position: "fixed",
        bottom: "90px",
        left: "24px",
        maxWidth: "340px",
        background: "rgba(246,241,231,0.97)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        border: "1px solid rgba(10,42,58,0.12)",
        borderRadius: "18px",
        padding: "18px 20px",
        zIndex: 29,
        boxShadow: "0 8px 32px -8px rgba(6,40,58,0.18)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
        <span style={{ fontSize: "22px", lineHeight: 1, flexShrink: 0 }}>🍪</span>
        <p style={{ fontSize: "12.5px", color: "#3d362e", lineHeight: 1.6, margin: 0 }}>
          Bu site, deneyiminizi geliştirmek için çerezler kullanmaktadır. Devam ederek{" "}
          <span style={{ color: "#006392", fontWeight: 600, cursor: "pointer" }}>
            çerez politikamızı
          </span>{" "}
          kabul etmiş sayılırsınız.
        </p>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
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
          className="flex-1 rounded-[10px] py-2 text-xs border border-[rgba(10,42,58,0.15)] text-[#6b6356] hover:text-[#06283a] justify-center"
        >
          Reddet
        </Button>
      </div>
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#F6F1E7",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        position: "relative",
        overflowX: "hidden",
        color: "#2a2520",
      }}
    >
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

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Menü açıkken arkayı karartan örtü */}
        <div
          onClick={() => setSidebarOpen(false)}
          aria-hidden={!sidebarOpen}
          style={{
            position: "fixed",
            inset: 0,
            background: sidebarOpen ? "rgba(6,40,58,0.32)" : "transparent",
            backdropFilter: sidebarOpen ? "blur(2px)" : "none",
            WebkitBackdropFilter: sidebarOpen ? "blur(2px)" : "none",
            pointerEvents: sidebarOpen ? "auto" : "none",
            transition: "background 0.35s ease, backdrop-filter 0.35s ease",
            zIndex: 18,
          }}
        />

        {/* Soldan açılan menü paneli */}
        <div
          aria-hidden={!sidebarOpen}
          className="kk-menu-panel"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "340px",
            maxWidth: "calc(100vw - 32px)",
            maxHeight: "100vh",
            overflowY: "auto",
            transform: sidebarOpen ? "translateY(0)" : "translateY(-105%)",
            transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
            background: "rgba(246,241,231,0.96)",
            backdropFilter: "blur(28px)",
            WebkitBackdropFilter: "blur(28px)",
            zIndex: 25,
            paddingTop: "20px",
            paddingBottom: "32px",
            paddingLeft: "24px",
            paddingRight: "24px",
            boxShadow: "12px 16px 48px -12px rgba(6,40,58,0.28)",
            borderRight: "1px solid rgba(10,42,58,0.08)",
            borderBottom: "1px solid rgba(10,42,58,0.08)",
            borderBottomRightRadius: "24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "28px", gap: "12px" }}>
            <img
              src={siteLogo}
              alt="Site Logo"
              style={{ height: "36px", width: "auto", objectFit: "contain" }}
            />
            <Button
              variant="kk-hamburger"
              size="unsized"
              onClick={() => setSidebarOpen(false)}
              aria-label="Menüyü kapat"
              className="w-9 h-9 rounded-[11px] bg-[rgba(0,99,146,0.1)] border-[rgba(0,99,146,0.22)] relative hover:bg-[rgba(0,99,146,0.18)] hover:scale-105 flex-shrink-0"
              style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
            >
              <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "14px", height: "1.5px", background: "#06283a", borderRadius: "999px", transform: "translate(-50%, -50%) rotate(45deg)" }} />
              <span aria-hidden="true" style={{ position: "absolute", left: "50%", top: "50%", width: "14px", height: "1.5px", background: "#06283a", borderRadius: "999px", transform: "translate(-50%, -50%) rotate(-45deg)" }} />
            </Button>
          </div>

          <p style={{ fontSize: "11px", color: "#8b8374", letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 600, margin: "0 0 14px" }}>
            Menü
          </p>
          <nav style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {[
              { label: "Hocalar", desc: "Akademisyenleri değerlendir" },
              { label: "Sıralamalar", desc: "En iyi üniversite ve hocalar" },
              { label: "Yorum Yaz", desc: "Sen de değerlendirme paylaş" },
              { label: "Hakkımızda", desc: "Misyonumuz ve ekibimiz" },
            ].map((item, i) => (
              <Button
                key={item.label}
                variant="kk-ghost-link"
                size="unsized"
                onClick={() => setSidebarOpen(false)}
                className={[
                  "w-full justify-between text-left gap-3 px-1 py-4 rounded-none",
                  "border-b border-[rgba(10,42,58,0.08)] text-[#06283a]",
                  i === 0 ? "border-t border-[rgba(10,42,58,0.08)]" : "",
                  "hover:pl-3 hover:text-[#06283a]",
                  "transition-all duration-200",
                ].join(" ")}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="display-serif" style={{ margin: "0 0 2px", fontSize: "17px", fontWeight: 500, letterSpacing: "-0.01em" }}>
                    {item.label}
                  </p>
                  <p style={{ margin: 0, fontSize: "11.5px", color: "#6b6356", letterSpacing: "0.01em" }}>
                    {item.desc}
                  </p>
                </div>
                <ArrowRight size={16} color="#006392" strokeWidth={2} style={{ flexShrink: 0 }} />
              </Button>
            ))}
          </nav>
        </div>

        {/* Header */}
        <header
          className="kk-header"
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            background: "transparent",
            padding: "16px 48px 16px 8px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div
              className="kk-logo-group"
              style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "10px" }}
            >
              <img
                src={siteLogo}
                alt="Site Logo"
                className="kk-site-logo"
                style={{ height: "60px", width: "auto", objectFit: "contain", marginLeft: "12px" }}
              />
              <Button
                variant="kk-hamburger"
                size="unsized"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label={sidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={sidebarOpen}
                className="mobile-hamburger"
                style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
              >
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="7" x2="20" y2="7" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4" y1="12" x2="20" y2="12" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4" y1="17" x2="20" y2="17" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Button>
            </div>

            <nav style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "6px" }}>
              <div className="desktop-nav-links" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {["Hocalar", "Hakkımızda"].map((item) => (
                  <Button key={item} variant="kk-nav" size="unsized">
                    {item}
                  </Button>
                ))}
              </div>
              <Button
                variant="kk-ghost-link"
                size="unsized"
                className="login-btn mobile-register"
                onClick={() => router.push("/register")}
                style={{ fontSize: "13px", padding: "9px 14px", border: "none", borderRadius: "8px", color: "#06283a" }}
              >
                Kaydol
              </Button>
              <Button
                variant="kk-login"
                size="unsized"
                className="login-btn"
                onClick={() => router.push("/login")}
              >
                <span className="login-text">Giriş Yap</span>
              </Button>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section style={{ position: "relative", overflow: "hidden", marginTop: "-110px" }}>
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center 30%",
              zIndex: 0,
            }}
          />
          <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: "rgba(246,241,231,0.80)", zIndex: 1 }} />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "200px",
              background: "linear-gradient(to bottom, rgba(246,241,231,1) 0%, rgba(246,241,231,0.85) 40%, rgba(246,241,231,0.4) 70%, rgba(246,241,231,0) 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "340px",
              background: "linear-gradient(to top, #F6F1E7 0%, rgba(246,241,231,0.97) 18%, rgba(246,241,231,0.85) 40%, rgba(246,241,231,0.5) 65%, rgba(246,241,231,0.15) 85%, rgba(246,241,231,0) 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          <div
            className="kk-hero-pad"
            style={{ position: "relative", zIndex: 3, padding: "180px 24px 56px", textAlign: "center" }}
          >
            <div style={{ maxWidth: "720px", margin: "0 auto", position: "relative" }}>
              <h1
                className="display-serif"
                style={{
                  fontSize: "clamp(26px, 4.5vw, 58px)",
                  fontWeight: 500,
                  color: "#06283a",
                  lineHeight: 1.05,
                  marginBottom: "22px",
                  letterSpacing: "-0.02em",
                  whiteSpace: "nowrap",
                }}
              >
                Hocaları değerlendir,{" "}
                <em className="display-serif" style={{ fontStyle: "italic", fontWeight: 500, color: "#006392" }}>
                  fark yarat.
                </em>
              </h1>

              <p
                style={{
                  color: "#4b443c",
                  fontSize: "clamp(14px, 1.4vw, 16px)",
                  marginBottom: "36px",
                  lineHeight: 1.6,
                  maxWidth: "480px",
                  margin: "0 auto 36px",
                }}
              >
                Gerçek öğrenci yorumlarıyla hocaları keşfet, değerlendir ve bilinçli tercih yap.
              </p>

              <form
                onSubmit={handleSearch}
                style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    background: searchFocused ? "rgba(255,253,248,0.92)" : "rgba(255,253,248,0.78)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    borderRadius: "999px",
                    border: searchFocused ? "1.5px solid rgba(6,40,58,0.45)" : "1.5px solid rgba(255,255,255,0.75)",
                    boxShadow: searchFocused
                      ? "0 16px 48px -16px rgba(6,40,58,0.28), 0 2px 8px -2px rgba(6,40,58,0.1)"
                      : "0 8px 32px -12px rgba(6,40,58,0.18), 0 2px 8px -4px rgba(6,40,58,0.06)",
                    transition: "box-shadow 0.3s ease, border-color 0.25s ease, background 0.25s ease",
                    padding: "6px 8px 6px 24px",
                    height: "62px",
                  }}
                >
                  <GraduationCap
                    size={20}
                    color={searchFocused ? "#06283a" : "#8b8374"}
                    strokeWidth={1.75}
                    style={{ flexShrink: 0, transition: "color 0.2s" }}
                  />
                  <input
                    ref={inputRef}
                    className="kk-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    placeholder="Üniversite, hoca veya bölüm ara"
                    style={{
                      flex: 1,
                      border: "none",
                      outline: "none",
                      background: "transparent",
                      padding: "12px 16px",
                      fontSize: "16px",
                      color: "#06283a",
                      fontFamily: "inherit",
                    }}
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
          <div
            className="kk-cat-section"
            style={{ position: "relative", zIndex: 3, padding: "16px 24px 56px" }}
          >
            <div
              style={{
                maxWidth: "820px",
                margin: "0 auto",
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "20px",
                alignItems: "end",
              }}
              className="kk-cat-strip"
            >
              {CATEGORIES.map(({ label, desc }, idx) => (
                <div key={label} style={{ position: "relative", height: "118px" }} className="kk-cat-wrapper">
                  <Button
                    variant="kk-cat"
                    size="unsized"
                    className="kk-cat-cell"
                    style={{
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                    }}
                  >
                    <span className="block" style={{ lineHeight: 1 }}>
                      {idx === 0 ? (
                        <IllustrationGraduationCap size={72} />
                      ) : idx === 1 ? (
                        <IllustrationProfessor size={72} />
                      ) : (
                        <IllustrationMap size={72} />
                      )}
                    </span>
                    <div className="overflow-hidden max-h-0 opacity-0 group-hover:max-h-[72px] group-hover:opacity-100 group-hover:mt-4 transition-all duration-300 text-center">
                      <p
                        className="display-serif"
                        style={{
                          margin: "0 0 4px",
                          color: "#06283a",
                          fontSize: "13px",
                          fontWeight: 600,
                          letterSpacing: "-0.01em",
                          whiteSpace: "normal",
                          wordBreak: "break-word",
                        }}
                      >
                        {label}
                      </p>
                      <p style={{ margin: 0, color: "#6b6356", fontSize: "12px", lineHeight: 1.45 }}>
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
        <section
          className="kk-highlights-section"
          style={{ position: "relative", padding: "28px 24px 96px", background: "#F6F1E7" }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "48%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <KTUWatermark />
          </div>

          <div style={{ position: "relative", zIndex: 3, maxWidth: "1100px", margin: "0 auto" }}>
            {/* CTA bandı */}
            <div
              className="kk-cta-banner"
              style={{
                position: "relative",
                background: "rgba(6,40,58,0.58)",
                backdropFilter: "blur(28px) saturate(140%)",
                WebkitBackdropFilter: "blur(28px) saturate(140%)",
                borderRadius: "24px",
                padding: "36px 44px",
                color: "#F6F1E7",
                border: "1px solid rgba(255,255,255,0.14)",
                overflow: "hidden",
                marginBottom: "56px",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `repeating-linear-gradient(
                    -38deg,
                    transparent 0px, transparent 16px,
                    rgba(255,255,255,0.045) 16px, rgba(255,255,255,0.045) 17px,
                    transparent 17px, transparent 38px
                  )`,
                  pointerEvents: "none",
                }}
              />
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 60% 80% at 0% 0%, rgba(255,255,255,0.10) 0%, transparent 55%), radial-gradient(ellipse 40% 60% at 100% 100%, rgba(0,99,146,0.18) 0%, transparent 65%)",
                  pointerEvents: "none",
                }}
              />
              <div
                className="kk-cta-inner"
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "36px",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "22px", flex: "1 1 auto", minWidth: 0 }}>
                  <div
                    style={{
                      width: "62px",
                      height: "62px",
                      borderRadius: "16px",
                      background: "rgba(246,241,231,0.12)",
                      border: "1px solid rgba(246,241,231,0.24)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.18)",
                    }}
                  >
                    <PenLine size={26} color="#F6F1E7" strokeWidth={1.6} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h2
                      className="display-serif"
                      style={{
                        fontSize: "clamp(24px, 3vw, 32px)",
                        fontWeight: 500,
                        margin: "0 0 6px",
                        letterSpacing: "-0.015em",
                        lineHeight: 1.18,
                        color: "#F6F1E7",
                      }}
                    >
                      Sen de değerlendir,{" "}
                      <em className="display-serif" style={{ fontStyle: "italic", fontWeight: 500, color: "#f0c875" }}>
                        fark yarat
                      </em>
                    </h2>
                    <p style={{ fontSize: "14.5px", margin: 0, opacity: 0.78, lineHeight: 1.55, maxWidth: "560px", color: "#F6F1E7" }}>
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
            <div
              style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "32px", alignItems: "start" }}
              className="responsive-grid"
            >
              {/* Sol: Son değerlendirmeler */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "22px", paddingLeft: "4px" }}>
                  <h2
                    className="display-serif"
                    style={{ color: "#06283a", fontSize: "28px", fontWeight: 500, margin: 0, letterSpacing: "-0.015em" }}
                  >
                    Son{" "}
                    <em className="display-serif" style={{ fontStyle: "italic", fontWeight: 500, color: "#006392" }}>
                      değerlendirmeler
                    </em>
                  </h2>
                  <Button variant="kk-ghost-link" size="unsized">
                    Tümünü gör <ArrowRight size={14} strokeWidth={2} />
                  </Button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {RECENT_REVIEWS.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        position: "relative",
                        background: "rgba(255,253,248,0.45)",
                        borderRadius: "20px",
                        padding: "22px 24px",
                        border: "1px solid rgba(255,255,255,0.60)",
                        boxShadow: "0 6px 28px -12px rgba(6,40,58,0.10), inset 0 1px 0 rgba(255,255,255,0.75)",
                        cursor: "pointer",
                        transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease, background 0.25s ease",
                        overflow: "hidden",
                      }}
                      onMouseEnter={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(-3px)";
                        el.style.boxShadow = "0 18px 44px -14px rgba(6,40,58,0.18), inset 0 1px 0 rgba(255,255,255,0.9)";
                        el.style.borderColor = "rgba(0,99,146,0.28)";
                        el.style.background = "rgba(255,253,248,0.6)";
                      }}
                      onMouseLeave={(e) => {
                        const el = e.currentTarget as HTMLElement;
                        el.style.transform = "translateY(0)";
                        el.style.boxShadow = "0 6px 28px -12px rgba(6,40,58,0.10), inset 0 1px 0 rgba(255,255,255,0.75)";
                        el.style.borderColor = "rgba(255,255,255,0.60)";
                        el.style.background = "rgba(255,253,248,0.45)";
                      }}
                    >
                      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px", gap: "12px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h3
                            className="display-serif"
                            style={{ fontSize: "18px", fontWeight: 600, color: "#06283a", margin: "0 0 8px", letterSpacing: "-0.01em" }}
                          >
                            {review.professor}
                          </h3>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                            <span
                              style={{
                                background: "rgba(0,99,146,0.1)",
                                color: "#006392",
                                padding: "3px 11px",
                                borderRadius: "20px",
                                fontSize: "11px",
                                fontWeight: 600,
                                letterSpacing: "0.01em",
                                border: "1px solid rgba(0,99,146,0.18)",
                              }}
                            >
                              {review.department}
                            </span>
                            <span style={{ fontSize: "11px", color: "#8b8374", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                              <MapPin size={11} strokeWidth={2} />
                              {review.city}
                            </span>
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <StarRating value={review.rating} />
                          <p style={{ fontSize: "10.5px", color: "#a8a090", margin: "5px 0 0", letterSpacing: "0.01em" }}>
                            {review.time}
                          </p>
                        </div>
                      </div>
                      <p
                        className="display-serif"
                        style={{
                          position: "relative",
                          fontSize: "15px",
                          color: "#3d362e",
                          lineHeight: 1.65,
                          margin: 0,
                          fontStyle: "italic",
                          fontWeight: 400,
                          borderTop: "1px solid rgba(10,42,58,0.07)",
                          paddingTop: "12px",
                        }}
                      >
                        &ldquo;{review.review}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sağ: Bu haftanın trendi */}
              <div>
                <div style={{ marginBottom: "22px", display: "flex", alignItems: "center", gap: "11px", paddingLeft: "4px" }}>
                  <IllustrationFlame size={24} color="#C8941A" />
                  <h2
                    className="display-serif"
                    style={{ color: "#06283a", fontSize: "23px", fontWeight: 500, margin: 0, letterSpacing: "-0.015em" }}
                  >
                    Bu Hafta{" "}
                    <em className="display-serif" style={{ fontStyle: "italic", fontWeight: 500, color: "#C8941A" }}>
                      Trend
                    </em>
                  </h2>
                </div>

                <div
                  style={{
                    background: "rgba(255,253,248,0.45)",
                    borderRadius: "20px",
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.60)",
                    boxShadow: "0 6px 28px -12px rgba(6,40,58,0.10), inset 0 1px 0 rgba(255,255,255,0.75)",
                  }}
                >
                  {TRENDING_PROFESSORS.map((item, idx) => (
                    <div
                      key={item.name}
                      style={{
                        padding: "16px 20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        borderBottom: idx < TRENDING_PROFESSORS.length - 1 ? "1px solid rgba(10,42,58,0.07)" : "none",
                        cursor: "pointer",
                        transition: "background 0.2s ease",
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,99,146,0.06)"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                    >
                      <div
                        className="display-serif"
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          background:
                            idx === 0
                              ? "linear-gradient(135deg, #06283a 0%, #006392 100%)"
                              : idx === 1
                              ? "rgba(0,99,146,0.14)"
                              : "rgba(10,42,58,0.07)",
                          color: idx === 0 ? "#F6F1E7" : "#06283a",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                          fontWeight: 700,
                          flexShrink: 0,
                          boxShadow: idx === 0 ? "0 3px 10px -2px rgba(6,40,58,0.3)" : "none",
                        }}
                      >
                        {idx + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: "13.5px", fontWeight: 600, color: "#06283a", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#6b6356" }}>
                          <span>{item.field}</span>
                          <span style={{ color: "#c0b7a6" }}>·</span>
                          <span>{item.university}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px", flexShrink: 0 }}>
                        <StarRating value={item.rating} />
                        <div style={{ display: "flex", alignItems: "center", gap: "3px" }}>
                          <TrendingUp size={10} color="#2f8c4f" strokeWidth={2.5} />
                          <span style={{ fontSize: "10.5px", color: "#2f8c4f", fontWeight: 700 }}>{item.trend}</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div style={{ padding: "12px 20px 14px", borderTop: "1px solid rgba(10,42,58,0.07)" }}>
                    <Button variant="kk-ghost-link" size="unsized" className="w-full justify-center py-2">
                      Tüm Sıralamayı Gör <ArrowRight size={14} strokeWidth={2} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ background: "#0e4a6b", borderTop: "none", padding: "32px 32px 28px 8px" }}>
          <div
            className="kk-footer-inner"
            style={{ maxWidth: "100%", margin: "0", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <img src={newSiteLogo} alt="Site Logo" style={{ height: "48px", width: "auto", objectFit: "contain", display: "block" }} />
            </div>
            <p style={{ fontSize: "12px", color: "rgba(246,241,231,0.55)", margin: 0, letterSpacing: "0.02em" }}>
              © 2026 KampusKarne · Üniversite Değerlendirme Platformu · Tüm hakları saklıdır.
            </p>
          </div>
        </footer>

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
