import React from "react";
import Link from "next/link";
import { 
  User, 
  ShieldCheck, 
  Bell, 
  UserCircle,
  ChevronRight,
  ArrowLeft
} from "lucide-react";

import ThemeToggle from "@/components/ThemeToggle";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F1E7] dark:bg-zinc-950 transition-colors duration-500">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Üst Başlık ve Geri Dönüş */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-[#06283a] transition-colors mb-4 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Ana Sayfaya Dön</span>
            </Link>
            <h1 className="text-4xl font-bold text-[#06283a] dark:text-white font-serif tracking-tight">Hesap Ayarları</h1>
            <p className="text-slate-500 dark:text-zinc-400 mt-2 text-sm font-medium uppercase tracking-wider">Profil, Güvenlik ve Tercih Yönetimi</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol Menü (Sidebar) */}
          <aside className="w-full lg:w-64 flex flex-col gap-1">
            <SettingsLink 
              href="/settings" 
              icon={<User size={18} />} 
              label="Profil Bilgileri" 
              active 
            />
            <SettingsLink 
              href="/settings/security" 
              icon={<ShieldCheck size={18} />} 
              label="Güvenlik ve Şifre" 
            />
            <SettingsLink 
              href="/settings/notifications" 
              icon={<Bell size={18} />} 
              label="Bildirim Tercihleri" 
            />
            
            <div className="mt-6 p-5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded bg-[#06283a] flex items-center justify-center text-white text-xs font-bold">
                  İD
                </div>
                <div>
                  <p className="text-xs font-bold text-[#06283a] dark:text-white uppercase tracking-tight">İbrahim Doğan</p>
                  <p className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">Öğrenci</p>
                </div>
              </div>
              
              <div className="space-y-2 border-t border-slate-100 dark:border-zinc-800 pt-4">
                <button className="w-full py-2 text-[11px] font-bold text-red-600 border border-red-50 hover:bg-red-50 dark:border-red-900/10 dark:hover:bg-red-900/20 rounded transition-colors uppercase tracking-wider">
                  Oturumu Kapat
                </button>
              </div>
            </div>
          </aside>

          {/* Ana İçerik Alanı */}
          <main className="flex-1">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg shadow-sm p-8 md:p-12 min-h-[600px]">
              {children}
            </div>
          </main>
        </div>
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
          ? "bg-[#06283a] text-white shadow-sm" 
          : "hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-[#06283a] dark:hover:text-white border border-transparent"
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={active ? "text-white" : "text-slate-400 dark:text-zinc-600 group-hover:text-[#06283a] transition-colors"}>
          {icon}
        </span>
        <span className="font-semibold text-[13px] tracking-tight">{label}</span>
      </div>
      <ChevronRight size={14} className={active ? "opacity-100" : "opacity-0 group-hover:opacity-40 transition-opacity"} />
    </Link>
  );
}