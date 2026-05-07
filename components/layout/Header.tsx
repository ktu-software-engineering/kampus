"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Admin sayfalarında Header'ı gösterme
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className="sticky top-0 z-40 w-full transition-all duration-300"
      style={{
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
        {/* LEFT: vertical stack — logo on top, hamburger below */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            gap: "16px",
          }}
        >
          <Link href="/" className="flex items-center gap-10">
            <img
              src="/logos/site_logo.png"
              alt="KampüsKarne Logo"
              style={{
                height: "60px",
                width: "auto",
                objectFit: "contain",
                marginLeft: "12px",
              }}
            />
          </Link>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ml-2 p-2 rounded bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all md:hidden"
            aria-label="Menü"
          >
            {menuOpen ? <X size={22} color="#06283a" /> : (
              <svg viewBox="0 0 24 24" width="22" height="22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <line x1="4" y1="7" x2="20" y2="7" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4" y1="12" x2="20" y2="12" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="4" y1="17" x2="20" y2="17" stroke="#06283a" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            )}
          </button>
        </div>

        {/* RIGHT: nav + login */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingTop: "6px",
          }}
        >
          <div className="hidden md:flex items-center gap-4 mr-4">
            {["Hocalar", "Hakkımızda"].map((item) => (
              <Link 
                key={item} 
                href="#" 
                className="text-[14px] font-semibold text-[#06283a] px-4 py-2 hover:bg-[#06283a]/5 rounded transition-all"
              >
                {item}
              </Link>
            ))}
          </div>
          
          <Link href="/auth/register" className="hidden sm:block">
            <Button
              variant="ghost"
              className="text-[13px] font-bold text-[#06283a] px-4 py-2 hover:bg-transparent"
            >
              Kaydol
            </Button>
          </Link>
          
          <Link href="/auth/login">
            <Button
              style={{
                backgroundColor: "#06283a",
                color: "#F6F1E7",
                borderRadius: "4px",
                padding: "10px 20px",
                fontSize: "13px",
                fontWeight: 700,
                border: "none",
                boxShadow: "0 4px 12px -2px rgba(6,40,58,0.25)"
              }}
              className="hover:scale-105 transition-transform"
            >
              Giriş Yap
            </Button>
          </Link>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden animate-in slide-in-from-top duration-300">
          <Link href="#" className="text-lg font-bold text-[#06283a]">Hocalar</Link>
          <Link href="#" className="text-lg font-bold text-[#06283a]">Hakkımızda</Link>
          <Link href="/auth/register" className="text-lg font-bold text-[#06283a]">Kaydol</Link>
        </div>
      )}
    </header>
  );
}