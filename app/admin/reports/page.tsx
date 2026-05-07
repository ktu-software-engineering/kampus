import { AlertTriangle, CheckCircle, Eye, Trash2, Flag, MessageCircle } from "lucide-react";

const mockReports = [
  { id: "REP-842", course: "BIL204", comment: "Bu dersi veren hoca asla anlatamıyor, zaman kaybı...", reason: "Hakaret / Uygunsuz Dil", status: "pending", date: "2 saat önce" },
  { id: "REP-841", course: "MAT101", comment: "Sınav soruları çok saçmaydı, hakkımı helal etmiyorum.", reason: "Spam", status: "pending", date: "5 saat önce" },
  { id: "REP-840", course: "FIZ101", comment: "Ders çok kolay, herkes geçiyor.", reason: "Alakasız İçerik", status: "resolved", date: "1 gün önce" },
];

export default function ReportsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-2xl font-black text-[#112a46] dark:text-white uppercase tracking-tighter">İçerik Moderasyonu</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm font-medium">Sistem genelinde bildirilen ihlal ve uygunsuz içeriklerin denetim merkezi.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-zinc-800/30 text-slate-500 dark:text-zinc-500 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Denetlenecek İçerik</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">İhlal Gerekçesi</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Durum Skoru</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">Moderasyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-8 py-7 max-w-md">
                    <div className="flex flex-col gap-3">
                      <span className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">{report.id} • {report.course}</span>
                      <div className="relative p-5 bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 border-l-4 border-l-red-600 rounded-sm">
                        <p className="text-[#112a46] dark:text-zinc-300 font-medium italic leading-relaxed text-sm">"{report.comment}"</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <div className="flex flex-col gap-2">
                      <span className="flex items-center gap-2 text-red-700 dark:text-red-400 font-black text-[10px] uppercase tracking-tighter">
                        <AlertTriangle size={14} /> {report.reason}
                      </span>
                      <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">{report.date}</span>
                    </div>
                  </td>
                  <td className="px-8 py-7">
                    <span className={`inline-flex items-center px-2.5 py-1 border rounded-sm text-[9px] font-black uppercase tracking-widest ${report.status === 'pending' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30 text-amber-700 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400'}`}>
                       {report.status === 'pending' ? 'İnceleme Bekliyor' : 'Karara Bağlandı'}
                    </span>
                  </td>
                  <td className="px-8 py-7 text-right">
                    <div className="flex justify-end gap-2">
                       <button title="Detay" className="p-2 text-slate-500 dark:text-zinc-400 border border-slate-100 dark:border-zinc-800 rounded hover:bg-white dark:hover:bg-zinc-800 transition-all"><Eye size={18} /></button>
                       <button title="Onayla" className="p-2 text-emerald-600 border border-slate-100 dark:border-zinc-800 rounded hover:bg-emerald-50 transition-all"><CheckCircle size={18} /></button>
                       <button title="Kaldır" className="p-2 text-red-600 border border-slate-100 dark:border-zinc-800 rounded hover:bg-red-50 transition-all"><Trash2 size={18} /></button>
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