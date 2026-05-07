"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/ThemeToggle";
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  Flag, 
  MessageSquare, 
  LogOut,
  Settings
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-[#f8f7f3] dark:bg-zinc-950 text-slate-800 dark:text-slate-300 font-sans transition-colors duration-500">
      
      {/* Sol Menü (Sidebar) */}
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col shadow-sm z-10 transition-colors duration-500">
        <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-[#112a46] dark:text-white font-serif tracking-tight">
            KampusKarne
          </h2>
          <span className="text-xs font-semibold text-[#c28f2c] uppercase tracking-widest">
            Yönetici Paneli
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 mt-4">Ana Menü</p>
          <Link 
            href="/admin" 
            className={`flex items-center gap-3 px-4 py-3 rounded font-medium transition-colors ${
              pathname === "/admin" 
                ? "text-[#112a46] dark:text-white bg-slate-50 dark:bg-zinc-800" 
                : "text-slate-500 dark:text-zinc-400 hover:text-[#112a46] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
            }`}
          >
            <LayoutDashboard size={20} className={pathname === "/admin" ? "text-[#3b82f6]" : ""} />
            Genel Bakış
          </Link>
          <Link 
            href="/admin/users" 
            className={`flex items-center gap-3 px-4 py-3 rounded font-medium transition-colors ${
              pathname === "/admin/users" 
                ? "text-[#112a46] dark:text-white bg-slate-50 dark:bg-zinc-800" 
                : "text-slate-500 dark:text-zinc-400 hover:text-[#112a46] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
            }`}
          >
            <Users size={20} />
            Kullanıcı Yönetimi
          </Link>
          
          <Link 
            href="/admin/instructors" 
            className={`flex items-center gap-3 px-4 py-3 rounded font-medium transition-colors ${
              pathname === "/admin/instructors" 
                ? "text-[#112a46] dark:text-white bg-slate-50 dark:bg-zinc-800" 
                : "text-slate-500 dark:text-zinc-400 hover:text-[#112a46] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
            }`}
          >
            <GraduationCap size={20} />
            Akademisyenler
          </Link>
          
          <Link 
            href="/admin/courses" 
            className={`flex items-center gap-3 px-4 py-3 rounded font-medium transition-colors ${
              pathname === "/admin/courses" 
                ? "text-[#112a46] dark:text-white bg-slate-50 dark:bg-zinc-800" 
                : "text-slate-500 dark:text-zinc-400 hover:text-[#112a46] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
            }`}
          >
            <BookOpen size={20} />
            Ders Katalogları
          </Link>

          <p className="px-4 text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 mt-8">İşlem Sırası</p>
          
          <Link 
            href="/admin/reports" 
            className={`flex items-center justify-between px-4 py-3 rounded font-medium transition-colors ${
              pathname === "/admin/reports" 
                ? "text-[#112a46] dark:text-white bg-slate-50 dark:bg-zinc-800" 
                : "text-slate-500 dark:text-zinc-400 hover:text-[#112a46] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <Flag size={20} />
              Şikayetler
            </div>
            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-0.5 px-2 rounded-sm text-xs font-bold">14</span>
          </Link>
          
          <Link 
            href="/admin/suggestions" 
            className={`flex items-center justify-between px-4 py-3 rounded font-medium transition-colors ${
              pathname === "/admin/suggestions" 
                ? "text-[#112a46] dark:text-white bg-slate-50 dark:bg-zinc-800" 
                : "text-slate-500 dark:text-zinc-400 hover:text-[#112a46] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={20} />
              Öneriler
            </div>
            <span className="bg-[#c28f2c]/10 text-[#c28f2c] py-0.5 px-2 rounded-sm text-xs font-bold">8</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 space-y-1">
          <ThemeToggle variant="inline" />
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-zinc-400 hover:text-[#112a46] dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 rounded font-medium transition-colors">
            <Settings size={20} />
            Ayarlar
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded font-medium transition-colors">
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}