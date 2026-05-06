import { AlertTriangle, CheckCircle, Eye, Trash2, Flag, MessageCircle } from "lucide-react";

const mockReports = [
  { id: "REP-842", course: "BIL204", comment: "Bu dersi veren hoca asla anlatamıyor, zaman kaybı...", reason: "Hakaret / Uygunsuz Dil", status: "pending", date: "2 saat önce" },
  { id: "REP-841", course: "MAT101", comment: "Sınav soruları çok saçmaydı, hakkımı helal etmiyorum.", reason: "Spam", status: "pending", date: "5 saat önce" },
  { id: "REP-840", course: "FIZ101", comment: "Ders çok kolay, herkes geçiyor.", reason: "Alakasız İçerik", status: "resolved", date: "1 gün önce" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] dark:text-white font-serif tracking-tight">Şikayet Yönetimi</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg font-medium">Öğrencilerin bildirdiği hatalı veya kural dışı yorumları moderasyon süzgecinden geçirin.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Şikayet Edilen Yorum</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Sebep & Tarih</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Durum</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px] text-right">Aksiyonlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-8 py-7 max-w-md">
                    <div className="flex flex-col gap-2">
                      <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">{report.id} • {report.course}</span>
                      <div className="relative p-4 bg-slate-50 dark:bg-zinc-800 rounded-2xl border-l-4 border-red-500/50">
                        <p className="text-[#112a46] dark:text-zinc-200 font-medium italic leading-relaxed text-base">"{report.comment}"</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-black text-[11px] uppercase tracking-tighter">
                        <AlertTriangle size={16} /> {report.reason}
                      </span>
                      <span className="text-slate-400 dark:text-zinc-500 text-xs font-semibold">{report.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${report.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'}`}>
                       {report.status === 'pending' ? 'Bekliyor' : 'Çözüldü'}
                    </span>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex justify-end gap-2">
                       <button title="Detaylı Bak" className="p-3 text-blue-600 bg-blue-50 dark:bg-blue-900/20 rounded-xl hover:shadow-lg transition-all"><Eye size={20} /></button>
                       <button title="Onayla / Geçerli" className="p-3 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl hover:shadow-lg transition-all"><CheckCircle size={20} /></button>
                       <button title="Yorumu Sil" className="p-3 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-xl hover:shadow-lg transition-all"><Trash2 size={20} /></button>
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