"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import { LayoutDashboard, Users, GraduationCap, MessageSquare, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [pendingReports, setPendingReports] = useState(0);
  const [pendingSuggestions, setPendingSuggestions] = useState(0);

  useEffect(() => {
    fetch("/api/admin/stats", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.pendingReports) setPendingReports(d.pendingReports);
        if (d.newSuggestions) setPendingSuggestions(d.newSuggestions);
      }).catch(() => {});
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  const navItem = (href: string, icon: React.ReactNode, label: string, badge?: number) => (
    <Link
      href={href}
      className={`flex items-center justify-between px-4 py-3 rounded font-medium transition-colors ${
        pathname === href || (href !== "/admin" && pathname.startsWith(href))
          ? "text-kk-blue dark:text-white bg-kk-beige/40 dark:bg-zinc-800"
          : "text-slate-500 dark:text-zinc-400 hover:text-kk-blue dark:hover:text-white hover:bg-slate-50 dark:hover:bg-zinc-800"
      }`}
    >
      <div className="flex items-center gap-3">{icon}{label}</div>
      {badge ? <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 py-0.5 px-2 rounded-sm text-xs font-bold">{badge}</span> : null}
    </Link>
  );

  return (
    <div className="flex h-screen bg-kk-beige-dark dark:bg-zinc-950 text-slate-800 dark:text-slate-300 font-sans transition-colors duration-500">
      <aside className="w-72 bg-white dark:bg-zinc-900 border-r border-slate-200 dark:border-zinc-800 flex flex-col shadow-sm z-10 transition-colors duration-500">
        <div className="p-8 border-b border-slate-100 dark:border-zinc-800 flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-kk-blue dark:text-white font-serif tracking-tight">KampusKarne</h2>
          <span className="text-xs font-semibold text-kk-gold uppercase tracking-widest">Yönetici Paneli</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 mt-4">Ana Menü</p>
          {navItem("/admin", <LayoutDashboard size={20} />, "Genel Bakış")}
          {navItem("/admin/users", <Users size={20} />, "Kullanıcı Yönetimi")}
          {navItem("/admin/instructors", <GraduationCap size={20} />, "Akademisyenler")}
          <p className="px-4 text-xs font-medium text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2 mt-8">Geri Bildirimler</p>
          {navItem("/admin/reports", <MessageSquare size={20} />, "Şikayet & Öneriler", (pendingReports + pendingSuggestions) || undefined)}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 space-y-1">
          <ThemeToggle variant="inline" />
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded font-medium transition-colors cursor-pointer">
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative">
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
