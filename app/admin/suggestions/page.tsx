import { CheckCircle, XCircle, UserPlus, BookPlus, Search, PlusCircle, ArrowUpRight } from "lucide-react";

const mockSuggestions = [
  { id: "SUG-102", type: "instructor", title: "Dr. Öğr. Üyesi Ayşe Yılmaz", details: "Yazılım Mühendisliği Fakültesi", submittedBy: "İbrahim D.", date: "1 saat önce" },
  { id: "SUG-101", type: "course", title: "SENG302 - Yazılım Mimarisi", details: "3. Sınıf / Bahar Dönemi", submittedBy: "Anonim", date: "3 saat önce" },
];

export default function SuggestionsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-2xl font-black text-[#112a46] dark:text-white uppercase tracking-tighter">İçerik Genişletme</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm font-medium">Kullanıcılar tarafından iletilen yeni hoca ve müfredat ekleme talepleri.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-zinc-800/30 text-slate-500 dark:text-zinc-500 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Talep Kategorisi</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Öneri Detayları</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Kaynak / Zaman</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">Karar Mekanizması</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {mockSuggestions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-8 py-7">
                    {s.type === 'instructor' ? (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10 text-indigo-700 dark:text-indigo-400 rounded-sm text-[9px] font-black uppercase tracking-widest">
                        <UserPlus size={14} /> AKADEMİSYEN
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 border border-cyan-100 dark:border-cyan-900/30 bg-cyan-50/50 dark:bg-cyan-900/10 text-cyan-700 dark:text-cyan-400 rounded-sm text-[9px] font-black uppercase tracking-widest">
                        <BookPlus size={14} /> MÜFREDAT
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#112a46] dark:text-zinc-200 font-bold text-sm uppercase tracking-tight">{s.title}</p>
                      <p className="text-slate-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest leading-relaxed">{s.details}</p>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                     <div className="flex flex-col gap-1">
                        <span className="text-slate-700 dark:text-zinc-300 font-black text-[11px] uppercase tracking-tighter">{s.submittedBy}</span>
                        <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-bold italic">{s.date}</span>
                     </div>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#112a46] dark:bg-zinc-100 text-white dark:text-[#112a46] rounded font-black text-[10px] uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all shadow-sm">
                        <CheckCircle size={14} strokeWidth={3} /> SİSTEME EKLE
                      </button>
                      <button className="p-2 text-red-600 border border-slate-200 dark:border-zinc-800 rounded hover:bg-red-50 transition-all">
                        <XCircle size={18} />
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