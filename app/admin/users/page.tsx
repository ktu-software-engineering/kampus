import { Search, Filter, UserPlus, Shield, User, GraduationCap, Ban, Edit, Trash2 } from "lucide-react";

const mockUsers = [
  { id: "USR-1042", name: "İbrahim Doğan", email: "ibrahim.d@ktu.edu.tr", role: "admin", joinDate: "12 Ekim 2025", status: "active" },
  { id: "USR-1043", name: "Ahmet Yılmaz", email: "ahmet.y@ktu.edu.tr", role: "student", joinDate: "3 gün önce", status: "active" },
  { id: "USR-1044", name: "Dr. Ayşe Yılmaz", email: "ayse.yilmaz@ktu.edu.tr", role: "professor", joinDate: "1 hafta önce", status: "active" },
  { id: "USR-1045", name: "Mehmet Kaya", email: "mehmet.k@ktu.edu.tr", role: "student", joinDate: "2 ay önce", status: "banned" },
];

export default function UsersPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-2xl font-black text-[#112a46] dark:text-white uppercase tracking-tighter">Kullanıcı Veritabanı</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm font-medium">Sistemdeki tüm kullanıcı rollerinin ve erişim yetkilerinin yönetimi.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#112a46] dark:bg-zinc-100 text-white dark:text-[#112a46] rounded font-black text-xs uppercase tracking-[0.15em] hover:bg-opacity-90 active:scale-95 transition-all shadow-sm">
          <UserPlus size={16} strokeWidth={3} /> Kullanıcı Davet Et
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="İSİM, E-POSTA VEYA KULLANICI ID İLE ARA..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded text-xs font-bold text-[#112a46] dark:text-white uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-[#112a46] transition-all" 
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-colors">
          <Filter size={16} /> Filtreleme
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-zinc-800/30 text-slate-500 dark:text-zinc-500 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Kullanıcı Kimliği</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Yetki Rolü</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Kayıt Tarihi</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Durum</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {mockUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors group ${user.status === 'banned' ? 'opacity-60 bg-red-50/5 dark:bg-red-900/5' : ''}`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-11 h-11 rounded bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[#112a46] dark:text-white font-black text-sm border border-slate-200 dark:border-zinc-700">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-[#112a46] dark:text-zinc-200 font-bold text-sm uppercase tracking-tight">{user.name}</p>
                        <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-black tracking-widest uppercase">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-8 py-6 text-slate-600 dark:text-zinc-400 font-bold text-xs uppercase tracking-tighter">{user.joinDate}</td>
                  <td className="px-8 py-6">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-sm">
                        <div className="w-1 h-1 rounded-full bg-emerald-500"></div> Aktif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 text-red-700 dark:text-red-400 text-[9px] font-black uppercase tracking-widest rounded-sm">
                        <Ban size={10} /> Yasaklı
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button title="Düzenle" className="p-2.5 text-slate-400 dark:text-zinc-600 border border-slate-100 dark:border-zinc-800 rounded hover:text-[#112a46] dark:hover:text-white hover:border-[#112a46] transition-all"><Edit size={16} /></button>
                      <button title="Sil" className="p-2.5 text-slate-400 dark:text-zinc-600 border border-slate-100 dark:border-zinc-800 rounded hover:text-red-600 hover:border-red-600 transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-zinc-500 bg-slate-50/50 dark:bg-zinc-800/30">
          <span className="font-black uppercase tracking-widest">Kayıt 1 - 4 (Toplam {mockUsers.length})</span>
          <div className="flex gap-1">
            <button className="px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all disabled:opacity-30" disabled>Geri</button>
            <button className="w-8 h-8 bg-[#112a46] dark:bg-zinc-100 text-white dark:text-[#112a46] rounded text-[10px] font-black">1</button>
            <button className="px-4 py-2 border border-slate-200 dark:border-zinc-800 rounded text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">İleri</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const config: any = {
    admin: { icon: <Shield size={12} />, class: "border-purple-100 bg-purple-50 text-purple-700 dark:bg-purple-900/10 dark:border-purple-900/30 dark:text-purple-400" },
    professor: { icon: <GraduationCap size={12} />, class: "border-blue-100 bg-blue-50 text-blue-700 dark:bg-blue-900/10 dark:border-blue-900/30 dark:text-blue-400" },
    student: { icon: <User size={12} />, class: "border-slate-200 bg-slate-50 text-slate-600 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-400" },
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 border rounded text-[9px] font-black tracking-widest ${config[role].class}`}>
      {config[role].icon} {role.toUpperCase()}
    </span>
  );
}