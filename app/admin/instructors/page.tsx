import { Search, Filter, PlusCircle, Edit, Trash2, GraduationCap, Star, BookOpen } from "lucide-react";

const mockInstructors = [
  { id: "INS-001", name: "Prof. Dr. Ahmet Yılmaz", department: "Bilgisayar Mühendisliği", university: "KTÜ", rating: 4.8, reviewCount: 124, status: "active" },
  { id: "INS-002", name: "Doç. Dr. Zeynep Demir", department: "Elektrik-Elektronik Müh.", university: "KTÜ", rating: 4.2, reviewCount: 86, status: "active" },
  { id: "INS-003", name: "Dr. Öğr. Üyesi Ali Kaya", department: "Makine Mühendisliği", university: "KTÜ", rating: 3.5, reviewCount: 42, status: "active" },
];

export default function InstructorsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] dark:text-white font-serif tracking-tight">Akademisyen Yönetimi</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg font-medium">Sistemde kayıtlı olan tüm akademisyenleri görüntüleyin ve düzenleyin.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-[#112a46] dark:bg-zinc-800 text-white rounded-[1.25rem] text-sm font-black hover:shadow-2xl hover:shadow-[#112a46]/20 transition-all active:scale-95">
          <PlusCircle size={20} /> Yeni Hoca Ekle
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#3b82f6] transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Hoca adı, bölüm veya fakülte ara..." 
            className="w-full pl-12 pr-4 py-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-sm text-[#112a46] dark:text-white focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/10 focus:border-[#3b82f6] transition-all" 
          />
        </div>
        <div className="flex gap-2">
            <select className="px-4 py-3 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-[#3b82f6]/10">
                <option>Tüm Bölümler</option>
                <option>Bilgisayar Müh.</option>
                <option>Makine Müh.</option>
            </select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Profesör / Akademisyen</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Bölüm & Üniversite</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Değerlendirme</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Durum</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px] text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
              {mockInstructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100/50 dark:border-blue-900/30">
                        <GraduationCap size={26} />
                      </div>
                      <div>
                        <p className="text-[#112a46] dark:text-zinc-200 font-black text-base leading-tight">{instructor.name}</p>
                        <p className="text-slate-400 dark:text-zinc-500 text-[11px] font-bold mt-1 tracking-widest uppercase">{instructor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-700 dark:text-zinc-300 font-bold flex items-center gap-1.5"><BookOpen size={14} className="text-slate-400" /> {instructor.department}</span>
                      <span className="text-slate-400 dark:text-zinc-500 text-xs font-semibold">{instructor.university}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} className={`${s <= Math.round(instructor.rating) ? 'text-[#c28f2c] fill-[#c28f2c]' : 'text-slate-200 dark:text-zinc-800'}`} />
                        ))}
                        <span className="ml-1 text-[#112a46] dark:text-white font-black text-sm">{instructor.rating}</span>
                      </div>
                      <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">{instructor.reviewCount} Toplam Yorum</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                       Aktif
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
                      <button className="p-3 text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 rounded-xl hover:text-blue-500 hover:shadow-xl transition-all"><Edit size={18} /></button>
                      <button className="p-3 text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 rounded-xl hover:text-red-500 hover:shadow-xl transition-all"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}