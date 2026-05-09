"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  ShieldCheck, 
  Bell, 
  ChevronRight,
  ArrowLeft
} from "lucide-react";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-kk-beige-dark font-['Inter',-apple-system,BlinkMacSystemFont,'Segoe_UI',sans-serif] relative overflow-x-hidden text-kk-text">
      <BackgroundTexture />
      
      <div className="relative z-10 flex flex-col flex-1">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <div className="max-w-6xl w-full mx-auto px-4 py-12 flex-1">
          {/* Üst Başlık ve Geri Dönüş */}
          <div className="mb-10 flex items-center justify-between">
            <div>
              <Link href="/" className="flex items-center gap-2 text-kk-text-muted hover:text-kk-blue transition-colors mb-4 group">
                <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Ana Sayfaya Dön</span>
              </Link>
              <h1 className="text-4xl font-bold text-kk-blue font-serif tracking-tight">Hesap Ayarları</h1>
              <p className="text-kk-text-muted mt-2 text-sm font-medium uppercase tracking-wider">Profil, Güvenlik ve Tercih Yönetimi</p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sol Menü (Sidebar) */}
            <aside className="w-full lg:w-64 flex flex-col gap-1">
              <SettingsLink 
                href="/settings" 
                icon={<User size={18} />} 
                label="Profil Bilgileri" 
                active={pathname === "/settings"} 
              />
              <SettingsLink 
                href="/settings/security" 
                icon={<ShieldCheck size={18} />} 
                label="Güvenlik ve Şifre" 
                active={pathname === "/settings/security"}
              />
              <SettingsLink 
                href="/settings/notifications" 
                icon={<Bell size={18} />} 
                label="Bildirim Tercihleri" 
                active={pathname === "/settings/notifications"}
              />
              
              <div className="mt-6 p-5 bg-white/80 backdrop-blur-md border border-white/60 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 rounded bg-kk-blue flex items-center justify-center text-white text-xs font-bold">
                    İD
                  </div>
                  <div>
                    <p className="text-xs font-bold text-kk-blue uppercase tracking-tight">İbrahim Doğan</p>
                    <p className="text-[10px] text-kk-text-muted font-medium uppercase tracking-widest">Öğrenci</p>
                  </div>
                </div>
                
                <div className="space-y-2 border-t border-kk-blue/10 pt-4">
                  <button className="w-full py-2 text-[11px] font-bold text-red-600 border border-red-50 hover:bg-red-50 rounded transition-colors uppercase tracking-wider">
                    Oturumu Kapat
                  </button>
                </div>
              </div>
            </aside>

            {/* Ana İçerik Alanı */}
            <main className="flex-1">
              <div className="bg-white/90 backdrop-blur-xl border border-white/60 rounded-lg shadow-sm p-8 md:p-12 min-h-[600px]">
                {children}
              </div>
            </main>
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

function SettingsLink({ href, icon, label, active = false }: { href: string, icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <Link 
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded transition-all duration-200 group ${
        active 
          ? "bg-kk-blue text-kk-beige shadow-sm" 
          : "hover:bg-white/60 text-kk-text-muted hover:text-kk-blue border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? "text-kk-beige" : "text-kk-text-muted group-hover:text-kk-blue transition-colors"}>
          {icon}
        </span>
        <span className="font-semibold text-[13px] tracking-tight">{label}</span>
      </div>
      <ChevronRight size={14} className={active ? "opacity-100" : "opacity-0 group-hover:opacity-40 transition-opacity"} />
    </Link>
  );
}
