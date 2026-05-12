"use client";

import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const siteLogo = "/images/site_logo-1.png";

interface NavbarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Navbar({ sidebarOpen = false, setSidebarOpen = () => {} }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);
  const { user, loading } = useCurrentUser();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";
  const isSettingsPage = pathname?.startsWith("/settings");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
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

      {/* Soldan açılan menü paneli */}
      <div
        aria-hidden={!sidebarOpen}
        className={`kk-menu-panel fixed top-0 left-0 w-[340px] max-w-[calc(100vw-32px)] max-h-screen overflow-y-auto z-[25] pt-5 pb-8 px-6 shadow-[12px_16px_48px_-12px_rgba(6,40,58,0.28)] border-r border-b border-[rgba(10,42,58,0.08)] rounded-br-[24px] bg-[rgba(246,241,231,0.96)] backdrop-blur-[28px] transition-transform duration-500 cubic-bezier(0.4,0,0.2,1) ${
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
            { label: "Hocalar", desc: "Akademisyenleri değerlendir" },
            { label: "Sıralamalar", desc: "En iyi üniversite ve hocalar" },
            { label: "Yorum Yaz", desc: "Sen de değerlendirme paylaş" },
            { label: "Hakkımızda", desc: "Misyonumuz ve ekibimiz" },
          ].map((item, i) => (
            <Button
              key={item.label}
              variant="kk-ghost-link"
              size="unsized"
              onClick={() => {
                setSidebarOpen(false);
                if (item.label === "Hocalar") router.push("/");
              }}
              className={[
                "w-full justify-between text-left gap-3 px-1 py-4 rounded-none",
                "border-b border-[#0a2a3a]/08 text-[#06283a]",
                i === 0 ? "border-t border-[#0a2a3a]/08" : "",
                "hover:pl-3 hover:text-[#06283a]",
                "transition-all duration-200",
              ].join(" ")}
            >
              <div className="flex-1 min-w-0">
                <p className="display-serif m-0 mb-[2px] text-[17px] font-medium tracking-[-0.01em]">
                  {item.label}
                </p>
                <p className="m-0 text-[11.5px] text-[#6b6356] tracking-[0.01em]">
                  {item.desc}
                </p>
              </div>
              <ArrowRight size={16} color="#006392" strokeWidth={2} className="shrink-0" />
            </Button>
          ))}
        </nav>
      </div>

      {/* Header */}
      <header className="kk-header sticky top-0 z-[20] bg-transparent py-4 pr-12 pl-2">
        <div className="w-full flex items-start justify-between gap-5">
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
            {mounted && isSettingsPage && !isLoginPage && !isRegisterPage && (
              <Button
                variant="kk-hamburger"
                size="unsized"
                onClick={() => setSidebarOpen((v) => !v)}
                aria-label={sidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
                aria-expanded={sidebarOpen}
                className="mobile-hamburger backdrop-blur-[10px]"
              >
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <line x1="4" y1="7" x2="20" y2="7" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4" y1="12" x2="20" y2="12" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="4" y1="17" x2="20" y2="17" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </Button>
            )}
          </div>

          <nav className="flex items-center gap-2 pt-1.5">
            <div className="desktop-nav-links flex items-center gap-1">
              {["Hocalar", "Hakkımızda"].map((item) => (
                <Button
                  key={item}
                  variant="kk-nav"
                  size="unsized"
                  onClick={() => {
                    if (item === "Hocalar") router.push("/");
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>

            {mounted && !loading && (
              user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => router.push("/settings")}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-kk-blue/5 transition-colors"
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
                      onClick={() => router.push("/login")}
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
    </>
  );
}
