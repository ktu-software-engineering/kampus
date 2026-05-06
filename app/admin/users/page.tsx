import { Search, Filter, UserPlus, Shield, User, GraduationCap, Ban, Edit, Trash2 } from "lucide-react";

const mockUsers = [
  { id: "USR-1042", name: "İbrahim Doğan", email: "ibrahim.d@ktu.edu.tr", role: "admin", joinDate: "12 Ekim 2025", status: "active" },
  { id: "USR-1043", name: "Ahmet Yılmaz", email: "ahmet.y@ktu.edu.tr", role: "student", joinDate: "3 gün önce", status: "active" },
  { id: "USR-1044", name: "Dr. Ayşe Yılmaz", email: "ayse.yilmaz@ktu.edu.tr", role: "professor", joinDate: "1 hafta önce", status: "active" },
  { id: "USR-1045", name: "Mehmet Kaya", email: "mehmet.k@ktu.edu.tr", role: "student", joinDate: "2 ay önce", status: "banned" },
];

export default function UsersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] dark:text-white font-serif">Kullanıcı Yönetimi</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg">Sistemdeki tüm öğrencileri, hocaları ve yöneticileri kontrol edin.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#112a46] dark:bg-zinc-800 text-white rounded-2xl text-sm font-bold hover:scale-[1.02] transition-all shadow-lg active:scale-95">
          <UserPlus size={18} /> Kullanıcı Davet Et
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3b82f6] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="İsim, e-posta veya ID ile ara..." 
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm text-[#112a46] dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6] transition-all" 
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-2xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors">
          <Filter size={18} /> Filtrele
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Kullanıcı Bilgisi</th>
                <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Rol</th>
                <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Kayıt Tarihi</th>
                <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px]">Durum</th>
                <th className="px-8 py-5 font-bold uppercase tracking-wider text-[10px] text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
              {mockUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group ${user.status === 'banned' ? 'opacity-60 bg-red-50/10' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[#112a46] dark:text-white font-black text-lg shadow-inner">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[#112a46] dark:text-zinc-200 font-bold text-base">{user.name}</p>
                        <p className="text-slate-400 dark:text-zinc-500 text-xs font-medium">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-8 py-6 text-slate-500 dark:text-zinc-400 font-semibold">{user.joinDate}</td>
                  <td className="px-8 py-6">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black tracking-widest uppercase">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-[10px] font-black tracking-widest uppercase">
                        <Ban size={12} /> Yasaklı
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                      <button title="Düzenle" className="p-3 text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 rounded-xl hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all shadow-sm"><Edit size={18} /></button>
                      <button title="Sil" className="p-3 text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 rounded-xl hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all shadow-sm"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between text-sm text-slate-500 dark:text-zinc-500 bg-slate-50/30 dark:bg-zinc-800/30">
          <span className="font-medium tracking-tight">Toplam {mockUsers.length} kayıt arasından 1-4 arası gösteriliyor</span>
          <div className="flex gap-2">
            <button className="px-6 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-white dark:hover:bg-zinc-900 transition-all disabled:opacity-30 font-bold" disabled>Geri</button>
            <div className="flex items-center">
               <button className="w-10 h-10 bg-[#112a46] dark:bg-[#3b82f6] text-white rounded-xl font-black shadow-lg shadow-blue-500/20">1</button>
            </div>
            <button className="px-6 py-2.5 border border-slate-200 dark:border-zinc-800 rounded-xl hover:bg-white dark:hover:bg-zinc-900 transition-all font-bold">İleri</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config: any = {
    admin: { icon: <Shield size={14} />, class: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400" },
    professor: { icon: <GraduationCap size={14} />, class: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400" },
    student: { icon: <User size={14} />, class: "bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400" },
  };
  return (
    <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black tracking-[0.1em] shadow-sm ${config[role].class}`}>
      {config[role].icon} {role.toUpperCase()}
    </span>
  );
}