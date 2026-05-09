import { Search, PlusCircle, Edit, Trash2, GraduationCap, Star } from "lucide-react";

const mockInstructors = [
  { id: "INS-001", name: "Prof. Dr. Ahmet Yılmaz", department: "Bilgisayar Mühendisliği", university: "KTÜ", rating: 4.8, reviewCount: 124, status: "active" },
  { id: "INS-002", name: "Doç. Dr. Zeynep Demir", department: "Elektrik-Elektronik Müh.", university: "KTÜ", rating: 4.2, reviewCount: 86, status: "active" },
  { id: "INS-003", name: "Dr. Öğr. Üyesi Ali Kaya", department: "Makine Mühendisliği", university: "KTÜ", rating: 3.5, reviewCount: 42, status: "active" },
];

export default function InstructorsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-2xl font-black text-kk-blue dark:text-white uppercase tracking-tighter">Akademisyen Envanteri</h1>
          <p className="text-kk-text-muted dark:text-zinc-400 mt-1 text-sm font-medium">Sistemde kayıtlı olan tüm öğretim üyelerinin yönetim paneli.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-kk-blue dark:bg-zinc-100 text-white dark:text-kk-blue rounded font-black text-xs uppercase tracking-[0.15em] hover:bg-opacity-90 active:scale-95 transition-all shadow-sm">
          <PlusCircle size={16} strokeWidth={3} /> Yeni Kayıt Ekle
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-600 transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="İSİM, BÖLÜM VEYA FAKÜLTE İLE ARA..." 
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded text-xs font-bold text-kk-blue dark:text-white uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-kk-blue transition-all" 
          />
        </div>
        <div className="flex gap-2">
            <select className="px-5 py-3.5 bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400 rounded text-xs font-bold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-kk-blue">
                <option>TÜM BÖLÜMLER</option>
                <option>BİLGİSAYAR MÜH.</option>
                <option>MAKİNE MÜH.</option>
            </select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-zinc-800/30 text-slate-500 dark:text-zinc-500 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Akademik Kimlik</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Departman & Kurum</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Analitik Veri</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Durum</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {mockInstructors.map((instructor) => (
                <tr key={instructor.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded bg-kk-beige-dark dark:bg-zinc-800 flex items-center justify-center text-kk-blue dark:text-white border border-kk-blue/5 dark:border-zinc-700">
                        <GraduationCap size={20} />
                      </div>
                      <div>
                        <p className="text-kk-blue dark:text-zinc-200 font-bold text-sm leading-tight uppercase tracking-tight">{instructor.name}</p>
                        <p className="text-kk-text-muted dark:text-zinc-500 text-[10px] font-black mt-1 tracking-widest uppercase">{instructor.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-tight">{instructor.department}</span>
                      <span className="text-kk-text-muted dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">{instructor.university}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={12} className={`${s <= Math.round(instructor.rating) ? 'text-kk-gold fill-current' : 'text-slate-200 dark:text-zinc-800'}`} />
                        ))}
                        <span className="ml-2 text-kk-blue dark:text-white font-black text-xs">{instructor.rating}</span>
                      </div>
                      <span className="text-kk-text-muted dark:text-zinc-500 text-[9px] font-black uppercase tracking-[0.15em]">{instructor.reviewCount} Kayıtlı Yorum</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="inline-flex items-center px-2.5 py-1 border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/50 dark:bg-emerald-900/10 text-emerald-700 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest rounded-sm">
                       Sistemde Aktif
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2.5 text-slate-400 dark:text-zinc-600 border border-slate-100 dark:border-zinc-800 rounded hover:text-kk-blue dark:hover:text-white hover:border-kk-blue transition-all"><Edit size={16} /></button>
                      <button className="p-2.5 text-slate-400 dark:text-zinc-600 border border-slate-100 dark:border-zinc-800 rounded hover:text-red-600 hover:border-red-600 transition-all"><Trash2 size={16} /></button>
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
