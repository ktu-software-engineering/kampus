import { CheckCircle, XCircle, UserPlus, BookPlus, Search, PlusCircle, ArrowUpRight } from "lucide-react";

const mockSuggestions = [
  { id: "SUG-102", type: "instructor", title: "Dr. Öğr. Üyesi Ayşe Yılmaz", details: "Yazılım Mühendisliği Fakültesi", submittedBy: "İbrahim D.", date: "1 saat önce" },
  { id: "SUG-101", type: "course", title: "SENG302 - Yazılım Mimarisi", details: "3. Sınıf / Bahar Dönemi", submittedBy: "Anonim", date: "3 saat önce" },
];

export default function SuggestionsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] dark:text-white font-serif tracking-tight">Öneri Yönetimi</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg font-medium">Öğrencilerin sisteme eklenmesini istediği yeni hoca ve ders taleplerini yönetin.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Öneri Türü</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Öneri Başlığı & İçeriği</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Gönderen / Tarih</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px] text-right">Karar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
              {mockSuggestions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-8 py-7">
                    {s.type === 'instructor' ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm">
                        <UserPlus size={16} /> HOCA ÖNERİSİ
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 dark:text-cyan-400 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm">
                        <BookPlus size={16} /> DERS ÖNERİSİ
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#112a46] dark:text-zinc-200 font-black text-base">{s.title}</p>
                      <p className="text-slate-500 dark:text-zinc-500 text-xs font-bold leading-relaxed">{s.details}</p>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                     <div className="flex flex-col gap-1">
                        <span className="text-slate-700 dark:text-zinc-300 font-black text-xs uppercase tracking-tight">{s.submittedBy}</span>
                        <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold italic">{s.date}</span>
                     </div>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex justify-end gap-3">
                      <button className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl font-black text-[11px] hover:shadow-lg hover:shadow-emerald-500/30 transition-all active:scale-95 tracking-widest">
                        <CheckCircle size={16} /> ONAYLA & EKLE
                      </button>
                      <button className="p-2.5 text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                        <XCircle size={22} />
                      </button>
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