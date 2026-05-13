"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, LogOut, Search, Star, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface InstructorResult {
  id: string;
  full_name: string;
  title: string | null;
  slug: string;
  average_rating: number;
  review_count: number;
}

const siteLogo = "/images/site_logo-1.png";

interface NavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Navbar({ sidebarOpen: externalOpen, setSidebarOpen: externalSet }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const [internalOpen, setInternalOpen] = useState(false);
  const { user, loading } = useCurrentUser();

  // Dışarıdan prop gelirse onu kullan, gelmezse kendi state'ini kullan
  const sidebarOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setSidebarOpen = externalSet ?? setInternalOpen;

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isSettingsPage = pathname?.startsWith("/settings");

  // ── Navbar arama
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<InstructorResult[]>([]);
  const [showDrop, setShowDrop] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [dropRect, setDropRect] = useState<DOMRect | null>(null);
  const [activeIdx, setActiveIdx] = useState(-1);
  const searchRef = useRef<HTMLFormElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeDrop = useCallback(() => {
    if (!showDrop) return;
    setIsClosing(true);
    setTimeout(() => { setIsClosing(false); setShowDrop(false); }, 180);
  }, [showDrop]);

  const fetchResults = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); closeDrop(); return; }
    const res = await fetch(`/api/instructors?q=${encodeURIComponent(q)}&limit=5`);
    const data = await res.json();
    setResults(data);
    if (data.length > 0) {
      if (searchRef.current) setDropRect(searchRef.current.getBoundingClientRect());
      setShowDrop(true); setIsClosing(false);
    } else closeDrop();
    setActiveIdx(-1);
  }, [closeDrop]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchResults(v), 280);
  };

  const handleSelect = (ins: InstructorResult) => {
    closeDrop(); setQuery("");
    router.push(`/instructors/${ins.slug}`);
  };

  const handleSearchKey = (e: React.KeyboardEvent) => {
    if (!showDrop) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i+1, results.length-1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i-1, -1)); }
    if (e.key === "Escape")    { closeDrop(); }
    if (e.key === "Enter")     { e.preventDefault(); if (activeIdx >= 0 && results[activeIdx]) handleSelect(results[activeIdx]); else if (results[0]) handleSelect(results[0]); }
  };

  useEffect(() => {
    if (!showDrop) return;
    const upd = () => { if (searchRef.current) setDropRect(searchRef.current.getBoundingClientRect()); };
    window.addEventListener("scroll", upd, { passive: true });
    window.addEventListener("resize", upd);
    return () => { window.removeEventListener("scroll", upd); window.removeEventListener("resize", upd); };
  }, [showDrop]);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (!searchRef.current?.contains(e.target as Node)) closeDrop(); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [closeDrop]);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("cookie_accepted");
    window.location.reload();
  }

  function getInitials(name: string | null) {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  }

  return (
    <>
      {/* Menü açıkken arkayı karartan örtü */}
      <div
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
        className={`fixed inset-0 z-[18] transition-all duration-350 ease-in-out ${
          sidebarOpen
            ? "bg-[rgba(6,40,58,0.32)] backdrop-blur-[2px] pointer-events-auto"
            : "bg-transparent backdrop-blur-none pointer-events-none"
        }`}
      />

      {/* Sağdan açılan menü paneli */}
      <div
        aria-hidden={!sidebarOpen}
        className={`kk-menu-panel fixed top-0 right-0 w-[300px] max-w-[calc(100vw-32px)] max-h-screen overflow-y-auto z-[25] pt-5 pb-8 px-6 shadow-[-12px_16px_48px_-12px_rgba(6,40,58,0.28)] border-l border-b border-[rgba(10,42,58,0.08)] rounded-bl-[24px] bg-[rgba(246,241,231,0.96)] backdrop-blur-[28px] transition-transform duration-500 ${
          sidebarOpen ? "translate-y-0" : "-translate-y-[105%]"
        }`}
      >
        <div className="flex items-start justify-between mb-7 gap-3">
          <Image
            src={siteLogo}
            alt="Site Logo"
            width={140}
            height={36}
            loading="eager"
            className="h-9 w-auto object-contain cursor-pointer"
            onClick={() => router.push("/")}
          />
          <Button
            variant="kk-hamburger"
            size="unsized"
            onClick={() => setSidebarOpen(false)}
            aria-label="Menüyü kapat"
            className="w-9 h-9 rounded-[11px] bg-[rgba(0,99,146,0.1)] border-[rgba(0,99,146,0.22)] relative hover:bg-[rgba(0,99,146,0.18)] hover:scale-105 flex-shrink-0"
            style={{ backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)" }}
          >
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 w-3.5 h-[1.5px] bg-[#06283a] rounded-full -translate-x-1/2 -translate-y-1/2 rotate-45"
            />
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 w-3.5 h-[1.5px] bg-[#06283a] rounded-full -translate-x-1/2 -translate-y-1/2 -rotate-45"
            />
          </Button>
        </div>

        <p className="text-[11px] text-[#8b8374] tracking-[0.16em] uppercase font-semibold m-0 mb-3.5">
          Menü
        </p>
        <nav className="flex flex-col gap-0">
          {[
            { label: "Hocalar", href: "/hocalar" },
            { label: "Dersler",  href: "/dersler" },
            { label: "Profil",   href: "/settings" },
          ].map((item, i) => (
            <Button
              key={item.label}
              variant="kk-ghost-link"
              size="unsized"
              onClick={() => { setSidebarOpen(false); router.push(item.href); }}
              className={[
                "w-full justify-between text-left gap-3 px-1 py-4 rounded-none",
                "border-b border-[#0a2a3a]/08 text-[#06283a]",
                i === 0 ? "border-t border-[#0a2a3a]/08" : "",
                "hover:pl-3 hover:text-[#06283a]",
                "transition-all duration-200",
              ].join(" ")}
            >
              <p className="display-serif m-0 text-[17px] font-medium tracking-[-0.01em]">{item.label}</p>
              <ArrowRight size={16} color="#006392" strokeWidth={2} className="shrink-0" />
            </Button>
          ))}
          {/* Giriş Yap / Çıkış Yap */}
          {mounted && (
            user ? (
              <Button
                variant="kk-ghost-link"
                size="unsized"
                onClick={() => { setSidebarOpen(false); handleLogout(); }}
                className="w-full justify-between text-left gap-3 px-1 py-4 rounded-none border-b border-[#0a2a3a]/08 hover:pl-3 transition-all duration-200 text-red-500"
              >
                <p className="display-serif m-0 text-[17px] font-medium tracking-[-0.01em]">Çıkış Yap</p>
                <ArrowRight size={16} color="currentColor" strokeWidth={2} className="shrink-0" />
              </Button>
            ) : (
              <Button
                variant="kk-ghost-link"
                size="unsized"
                onClick={() => { setSidebarOpen(false); router.push("/login"); }}
                className="w-full justify-between text-left gap-3 px-1 py-4 rounded-none border-b border-[#0a2a3a]/08 hover:pl-3 transition-all duration-200 text-kk-blue-light"
              >
                <p className="display-serif m-0 text-[17px] font-medium tracking-[-0.01em]">Giriş Yap</p>
                <ArrowRight size={16} color="#006392" strokeWidth={2} className="shrink-0" />
              </Button>
            )
          )}
        </nav>
      </div>

      {/* Header */}
      <header className="kk-header sticky top-0 z-[20] bg-transparent py-4 pr-12 pl-2">
        <div className="w-full flex items-center justify-between gap-4">
          <div className="kk-logo-group flex flex-row items-center gap-[10px]">
            <Image
              src={siteLogo}
              alt="Site Logo"
              width={200}
              height={60}
              priority
              className="kk-site-logo h-[60px] w-auto object-contain ml-3 cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

          {/* ── Orta: Arama */}
          {mounted && !isLoginPage && !isRegisterPage && pathname !== "/" && (
            <form
              ref={searchRef}
              onSubmit={e => e.preventDefault()}
              autoComplete="off"
              className="flex-1 max-w-[420px] min-w-0 hidden md:block"
            >
              <div className="flex items-center bg-white/70 backdrop-blur-md border border-[rgba(6,40,58,0.12)] rounded-full px-4 h-[40px] gap-2 transition-all duration-200 focus-within:border-[rgba(6,40,58,0.35)] focus-within:shadow-[0_4px_16px_-4px_rgba(6,40,58,0.15)]">
                <Search size={15} className="text-[#8b8374] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  onKeyDown={handleSearchKey}
                  onFocus={() => results.length > 0 && setShowDrop(true)}
                  placeholder="Hoca ara..."
                  className="flex-1 min-w-0 bg-transparent outline-none text-[13px] text-kk-blue placeholder:text-[#a8a090]"
                />
              </div>
            </form>
          )}

          {/* Mobil hamburger — sağ taraf */}
          {mounted && !isLoginPage && !isRegisterPage && (
            <Button
              variant="kk-hamburger"
              size="unsized"
              onClick={() => setSidebarOpen((v) => !v)}
              aria-label={sidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={sidebarOpen}
              className="mobile-hamburger backdrop-blur-[10px] md:hidden"
            >
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4" y1="7" x2="20" y2="7" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4" y1="17" x2="20" y2="17" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </Button>
          )}

          <nav className="hidden md:flex items-center gap-2 pt-1.5">
            <div className="desktop-nav-links flex items-center gap-1">
              {[{ label: "Hocalar", href: "/hocalar" }, { label: "Dersler", href: "/dersler" }].map(({ label, href }) => (
                <Button
                  key={label}
                  variant="kk-nav"
                  size="unsized"
                  onClick={() => router.push(href)}
                >
                  {label}
                </Button>
              ))}
            </div>

            {mounted && !loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push("/settings")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-kk-blue/5 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-kk-blue flex items-center justify-center text-[11px] font-bold text-kk-gold">
                      {getInitials(user.full_name)}
                    </div>
                    <span className="text-[13px] font-semibold text-kk-blue hidden sm:block">
                      {user.full_name?.split(" ")[0] ?? "Profil"}
                    </span>
                  </button>
                  <Button
                    variant="kk-ghost-link"
                    size="unsized"
                    onClick={handleLogout}
                    className="text-[13px] py-[9px] px-3 border-none rounded-lg text-kk-text-muted hover:text-red-600 flex items-center gap-1.5"
                  >
                    <LogOut size={14} />
                    <span className="hidden sm:block">Çıkış</span>
                  </Button>
                </div>
              ) : (
                <>
                  {!isRegisterPage && (
                    <Button
                      variant={isLoginPage ? "kk-login" : "kk-ghost-link"}
                      size="unsized"
                      className={`login-btn mobile-register ${
                        !isLoginPage ? "text-[13px] py-[9px] px-3.5 border-none rounded-lg text-kk-blue" : ""
                      }`}
                      onClick={() => router.push("/register")}
                    >
                      Kaydol
                    </Button>
                  )}
                  {!isLoginPage && (
                    <Button
                      variant="kk-login"
                      size="unsized"
                      className="login-btn"
                      onClick={() => {
                        const redirect = pathname && pathname !== "/" ? `?redirect=${encodeURIComponent(pathname)}` : "";
                        router.push(`/login${redirect}`);
                      }}
                    >
                      <span className="login-text">Giriş Yap</span>
                    </Button>
                  )}
                </>
              )
            )}
          </nav>
        </div>
      </header>

      {/* Arama dropdown — portal */}
      {(showDrop || isClosing) && dropRect && typeof document !== "undefined" && createPortal(
        <>
          <style>{`
            @keyframes kk-nav-drop-in  { from{opacity:0;transform:translateY(-4px) scale(0.98)}to{opacity:1;transform:translateY(0) scale(1)} }
            @keyframes kk-nav-drop-out { from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(-4px) scale(0.98)} }
          `}</style>
          <div
            style={{
              position: "fixed",
              top: dropRect.bottom + 6,
              left: dropRect.left,
              width: dropRect.width,
              zIndex: 9999,
              borderRadius: 14,
              overflow: "hidden",
              background: "rgba(255,253,248,0.98)",
              backdropFilter: "blur(20px)",
              border: "1.5px solid rgba(6,40,58,0.12)",
              boxShadow: "0 16px 40px -8px rgba(6,40,58,0.2)",
              animation: isClosing
                ? "kk-nav-drop-out 180ms ease forwards"
                : "kk-nav-drop-in 200ms cubic-bezier(0,0,0.2,1) forwards",
            }}
          >
            {results.map((ins, i) => (
              <button
                key={ins.id}
                type="button"
                onMouseDown={() => handleSelect(ins)}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(6,40,58,0.07)")}
                onMouseLeave={e => (e.currentTarget.style.background = i === activeIdx ? "rgba(6,40,58,0.06)" : "transparent")}
                className="w-full flex items-center gap-3 px-4 py-3 text-left cursor-pointer transition-colors"
                style={{
                  background: i === activeIdx ? "rgba(6,40,58,0.06)" : "transparent",
                  borderBottom: i < results.length - 1 ? "1px solid rgba(6,40,58,0.06)" : "none",
                }}
              >
                <div className="w-7 h-7 rounded-lg bg-kk-blue/10 flex items-center justify-center shrink-0">
                  <GraduationCap size={14} className="text-kk-blue" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-kk-blue font-semibold text-[13px] truncate">
                    {ins.title ? `${ins.title} ${ins.full_name}` : ins.full_name}
                  </div>
                  {ins.review_count > 0 && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star size={10} className="text-kk-gold" fill="currentColor" />
                      <span className="text-[11px] text-kk-text-muted">{ins.average_rating.toFixed(1)} · {ins.review_count} yorum</span>
                    </div>
                  )}
                </div>
                <ArrowRight size={13} className="text-kk-text-muted opacity-40 shrink-0" />
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  );
}
