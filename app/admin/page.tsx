import { Users, Flag, MessageSquare, BookCheck, ArrowRight, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-2xl font-black text-[#112a46] dark:text-white uppercase tracking-tighter">Sistem Analizi</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm font-medium">KampusKarne platformu gerçek zamanlı operasyonel verileri.</p>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Toplam Kullanıcı" 
          value="1,248" 
          icon={<Users className="text-slate-600 dark:text-slate-400" size={20} />} 
          trend="+12% BU HAFTA" 
        />
        <StatsCard 
          title="Değerlendirmeler" 
          value="4,821" 
          icon={<BookCheck className="text-slate-600 dark:text-slate-400" size={20} />} 
          trend="+84 BUGÜN" 
        />
        <StatsCard 
          title="Bekleyen Şikayetler" 
          value="14" 
          icon={<Flag className="text-red-600 dark:text-red-400" size={20} />} 
          trend="KRİTİK DURUM" 
          isAlert
        />
        <StatsCard 
          title="Yeni Öneriler" 
          value="8" 
          icon={<MessageSquare className="text-slate-600 dark:text-slate-400" size={20} />} 
          trend="İNCELENMEYEN" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Son Bekleyen İşlemler Tablosu */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden flex flex-col transition-colors duration-500">
          <div className="px-6 py-5 border-b border-slate-100 dark:border-zinc-800 flex justify-between items-center bg-slate-50/50 dark:bg-zinc-800/30">
            <h2 className="text-xs font-black text-[#112a46] dark:text-white uppercase tracking-widest">Bekleyen Operasyonlar</h2>
            <button className="text-[10px] font-bold text-[#112a46] dark:text-white flex items-center gap-1 hover:underline uppercase tracking-wider">
              Tüm Liste <ArrowRight size={12} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white dark:bg-zinc-900 text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-800">
                <tr>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Kategori</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Açıklama</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Zamanlama</th>
                  <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Aksiyon</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                {[
                  { type: 'ŞİKAYET', detail: 'Uygunsuz dil kullanımı tespiti', date: '2 saat önce', color: 'text-red-600 border-red-100 bg-red-50 dark:bg-red-900/10 dark:border-red-900/30' },
                  { type: 'ÖNERİ', detail: 'Yeni Hoca Ekleme Talebi', date: '5 saat önce', color: 'text-slate-600 border-slate-200 bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-300' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-5">
                      <span className={`px-2 py-0.5 border rounded text-[9px] font-black tracking-tighter ${row.color}`}>{row.type}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[#112a46] dark:text-zinc-200 font-bold text-xs">{row.detail}</p>
                    </td>
                    <td className="px-6 py-5 text-slate-500 dark:text-zinc-500 text-xs font-medium uppercase tracking-tight">{row.date}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="px-3 py-1.5 border border-slate-200 dark:border-zinc-700 text-[#112a46] dark:text-white hover:bg-slate-50 dark:hover:bg-zinc-800 rounded text-[10px] font-black uppercase tracking-wider transition-colors shadow-sm">Yönet</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Haftalık Etkileşim Grafiği */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm p-7 flex flex-col transition-colors duration-500">
          <h3 className="text-xs font-black text-[#112a46] dark:text-white uppercase tracking-widest mb-8">Etkileşim Grafiği</h3>
          <div className="flex-1 flex items-end justify-between gap-1.5 h-32 px-2">
            {[40, 65, 45, 85, 55, 30, 45].map((h, i) => (
              <div key={i} className="flex flex-col items-center w-full gap-3 group">
                <div className={`w-full max-w-[12px] rounded-sm transition-all duration-300 ${i === 3 ? 'bg-[#112a46] dark:bg-white' : 'bg-slate-100 dark:bg-zinc-800 group-hover:bg-slate-200 dark:group-hover:bg-zinc-700'}`} style={{ height: `${h}%` }}></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 pt-6 border-t border-slate-100 dark:border-zinc-800 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Ziyaret</p>
              <p className="text-xl font-black text-[#112a46] dark:text-white tracking-tighter">12,450</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Yeni Yorum</p>
              <p className="text-xl font-black text-emerald-600 tracking-tighter">+342</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend, isAlert = false }: { title: string, value: string, icon: React.ReactNode, trend: string, isAlert?: boolean }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 p-6 rounded border shadow-sm flex flex-col group transition-all duration-300 ${isAlert ? 'border-red-100 dark:border-red-900/30' : 'border-slate-200 dark:border-zinc-800'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 border border-slate-100 dark:border-zinc-800 rounded bg-slate-50 dark:bg-zinc-950 transition-colors">{icon}</div>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-tighter ${isAlert ? 'text-red-600 border-red-100 bg-red-50' : 'text-slate-400 border-slate-100 bg-slate-50 dark:bg-zinc-800 dark:border-zinc-700'}`}>{trend}</span>
      </div>
      <h4 className="text-3xl font-black text-[#112a46] dark:text-white tracking-tighter">{value}</h4>
      <h3 className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-widest mt-1">{title}</h3>
    </div>
  );
}