import { Search, Filter, UserPlus, Shield, User, GraduationCap, Ban, Edit, Trash2 } from "lucide-react";

// Şimdilik arayüzde görmek için sahte (mock) kullanıcı verileri
const mockUsers = [
  {
    id: "USR-1042",
    name: "İbrahim Doğan",
    email: "ibrahim.d@ktu.edu.tr",
    role: "admin",
    joinDate: "12 Ekim 2025",
    status: "active",
  },
  {
    id: "USR-1043",
    name: "Anonim Öğrenci",
    email: "ahmet.y@ktu.edu.tr",
    role: "student",
    joinDate: "3 gün önce",
    status: "active",
  },
  {
    id: "USR-1044",
    name: "Dr. Ayşe Yılmaz",
    email: "ayse.yilmaz@ktu.edu.tr",
    role: "professor",
    joinDate: "1 hafta önce",
    status: "active",
  },
  {
    id: "USR-1045",
    name: "Anonim Öğrenci",
    email: "mehmet.k@ktu.edu.tr",
    role: "student",
    joinDate: "2 ay önce",
    status: "banned",
  },
];

export default function UsersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Üst Başlık ve Aksiyonlar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] font-serif">Kullanıcı Yönetimi</h1>
          <p className="text-slate-500 mt-1">Sistemdeki tüm öğrencileri, hocaları ve yöneticileri kontrol edin.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#112a46] text-white rounded-xl text-sm font-medium hover:bg-[#1a3a5f] transition-colors shadow-sm">
          <UserPlus size={18} />
          Kullanıcı Davet Et
        </button>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="İsim, e-posta veya ID ile ara..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50">
            <option>Tüm Roller</option>
            <option>Öğrenciler</option>
            <option>Profesörler</option>
            <option>Yöneticiler</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filtrele
          </button>
        </div>
      </div>

      {/* Kullanıcılar Tablosu */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">KULLANICI BİLGİSİ</th>
                <th className="px-6 py-4 font-medium">ROL</th>
                <th className="px-6 py-4 font-medium">KAYIT TARİHİ</th>
                <th className="px-6 py-4 font-medium">DURUM</th>
                <th className="px-6 py-4 font-medium text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockUsers.map((user) => (
                <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors group ${user.status === 'banned' ? 'opacity-75' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 overflow-hidden">
                        {/* Baş harfi gösterme mantığı (basitçe) */}
                        <span className="font-bold text-sm">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-[#112a46] font-bold">{user.name}</p>
                        <p className="text-slate-500 text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 text-slate-500 font-medium">
                    {user.joinDate}
                  </td>
                  <td className="px-6 py-4">
                    {user.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        AKTİF
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold tracking-wide">
                        <Ban size={12} />
                        YASAKLI
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Rolü Düzenle" className="p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#3b82f6] rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      {user.status === 'active' ? (
                        <button title="Kullanıcıyı Yasakla" className="p-2 text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                          <Ban size={18} />
                        </button>
                      ) : (
                        <button title="Yasağı Kaldır" className="p-2 text-slate-600 bg-slate-50 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors">
                          <Shield size={18} />
                        </button>
                      )}
                      <button title="Hesabı Sil" className="p-2 text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>Toplam 4 kullanıcı gösteriliyor</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50" disabled>Önceki</button>
            <button className="px-3 py-1 border border-slate-200 bg-slate-50 rounded-md font-medium text-[#112a46]">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50">Sonraki</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rol rozetleri
function RoleBadge({ role }: { role: string }) {
  switch (role) {
    case 'admin':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-bold tracking-wide">
          <Shield size={14} /> YÖNETİCİ
        </span>
      );
    case 'professor':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs font-bold tracking-wide">
          <GraduationCap size={14} /> PROFESÖR
        </span>
      );
    case 'student':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold tracking-wide">
          <User size={14} /> ÖĞRENCİ
        </span>
      );
    default:
      return null;
  }
}