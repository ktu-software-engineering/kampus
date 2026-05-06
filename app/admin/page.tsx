import { Users, Flag, MessageSquare, BookCheck, ArrowRight, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-[#112a46] dark:text-white font-serif">Sisteme Genel Bakış</h1>
        <p className="text-slate-500 dark:text-zinc-400 mt-2 text-lg">KampusKarne platformunun anlık istatistikleri ve bekleyen işlemler.</p>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Toplam Kullanıcı" 
          value="1,248" 
          icon={<Users className="text-[#3b82f6]" size={28} />} 
          trend="+12% bu hafta" 
        />
        <StatsCard 
          title="Değerlendirmeler" 
          value="4,821" 
          icon={<BookCheck className="text-emerald-500" size={28} />} 
          trend="+84 bugün eklendi" 
        />
        <StatsCard 
          title="Bekleyen Şikayetler" 
          value="14" 
          icon={<Flag className="text-red-500" size={28} />} 
          trend="İnceleme bekliyor" 
        />
        <StatsCard 
          title="Yeni Öneriler" 
          value="8" 
          icon={<MessageSquare className="text-[#c28f2c]" size={28} />} 
          trend="Hoca/Ders ekleme" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Son Bekleyen İşlemler Tablosu */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-sm overflow-hidden flex flex-col transition-colors duration-500">
          <div className="p-6 border-b border-slate-50 dark:border-zinc-800 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#112a46] dark:text-white font-serif">Son Bekleyen İşlemler</h2>
            <button className="text-sm font-medium text-[#3b82f6] flex items-center gap-1 hover:underline">
              Tümünü Gör <ArrowRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400">
                <tr>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Tür</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Detay</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs">Tarih</th>
                  <th className="px-6 py-4 font-medium uppercase tracking-wider text-xs text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
                {[
                  { type: 'ŞİKAYET', detail: 'Uygunsuz dil kullanımı tespiti', date: '2 saat önce', color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
                  { type: 'ÖNERİ', detail: 'Yeni Hoca Ekleme Talebi', date: '5 saat önce', color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-zinc-800/80 transition-colors">
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-widest ${row.color}`}>{row.type}</span>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-[#112a46] dark:text-zinc-200 font-medium">{row.detail}</p>
                    </td>
                    <td className="px-6 py-5 text-slate-500 dark:text-zinc-400">{row.date}</td>
                    <td className="px-6 py-5 text-right">
                      <button className="px-4 py-2 bg-slate-100 dark:bg-zinc-800 text-[#112a46] dark:text-white hover:bg-slate-200 dark:hover:bg-zinc-700 rounded-lg font-bold text-xs transition-colors">İncele</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Haftalık Etkileşim Grafiği */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-3xl shadow-sm p-7 flex flex-col transition-colors duration-500">
          <h3 className="text-xl font-bold text-[#112a46] dark:text-white font-serif mb-6">Haftalık Etkileşim</h3>
          <div className="flex-1 flex items-end justify-between gap-2 h-40">
            {[40, 65, 45, 85, 55, 30, 45].map((h, i) => (
              <div key={i} className="flex flex-col items-center w-full gap-2 group">
                <div className={`w-full max-w-[32px] rounded-t-md transition-all duration-300 ${i === 3 ? 'bg-[#3b82f6]' : 'bg-slate-100 dark:bg-zinc-800 group-hover:bg-blue-100 dark:group-hover:bg-zinc-700'}`} style={{ height: `${h}%` }}></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{['Pzt','Sal','Çar','Per','Cum','Cmt','Paz'][i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 dark:border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Toplam Ziyaret</p>
              <p className="text-2xl font-bold text-[#112a46] dark:text-white">12,450</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Yeni Yorum</p>
              <p className="text-2xl font-bold text-emerald-500">+342</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 shadow-sm flex flex-col group hover:shadow-md transition-all duration-500">
      <div className="p-3 w-fit rounded-2xl bg-slate-50 dark:bg-zinc-800 transition-colors mb-4">{icon}</div>
      <h4 className="text-4xl font-bold text-[#112a46] dark:text-white tracking-tight">{value}</h4>
      <h3 className="text-sm font-semibold text-slate-500 dark:text-zinc-400 mt-2">{title}</h3>
      <p className="text-xs mt-3 font-medium text-slate-400 dark:text-zinc-500">{trend}</p>
    </div>
  );
}