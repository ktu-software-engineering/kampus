import Link from "next/link";
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
  return (
    <div className="flex h-screen bg-[#f8f7f3] text-slate-800 font-sans">
      {/* Sol Menü (Sidebar) */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <div className="p-8 border-b border-slate-100 flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-[#112a46] font-serif tracking-tight">
            KampusKarne
          </h2>
          <span className="text-xs font-semibold text-[#c28f2c] uppercase tracking-widest">
            Yönetici Paneli
          </span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 mt-4">Ana Menü</p>
          <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-[#112a46] bg-slate-50 rounded-xl font-medium transition-colors">
            <LayoutDashboard size={20} className="text-[#3b82f6]" />
            Genel Bakış
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#112a46] hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <Users size={20} />
            Kullanıcı Yönetimi
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#112a46] hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <GraduationCap size={20} />
            Akademisyenler
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#112a46] hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <BookOpen size={20} />
            Ders Katalogları
          </Link>

          <p className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2 mt-8">İşlem Sırası</p>
          <Link href="#" className="flex items-center justify-between px-4 py-3 text-slate-500 hover:text-[#112a46] hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <div className="flex items-center gap-3">
              <Flag size={20} />
              Şikayetler
            </div>
            <span className="bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs font-bold">14</span>
          </Link>
          <Link href="#" className="flex items-center justify-between px-4 py-3 text-slate-500 hover:text-[#112a46] hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <div className="flex items-center gap-3">
              <MessageSquare size={20} />
              Öneriler
            </div>
            <span className="bg-[#c28f2c]/10 text-[#c28f2c] py-0.5 px-2 rounded-full text-xs font-bold">8</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <Link href="#" className="flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-[#112a46] hover:bg-slate-50 rounded-xl font-medium transition-colors mb-1">
            <Settings size={20} />
            Ayarlar
          </Link>
          <button className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors">
            <LogOut size={20} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Ana İçerik Alanı */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}