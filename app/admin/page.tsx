import { Users, Flag, MessageSquare, BookCheck, ArrowRight, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Üst Başlık */}
      <div>
        <h1 className="text-4xl font-bold text-[#112a46] font-serif">Sisteme Genel Bakış</h1>
        <p className="text-slate-500 mt-2 text-lg">KampusKarne platformunun anlık istatistikleri ve bekleyen işlemler.</p>
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
          trend="" // Yazı kaldırıldı
          alert
        />
        <StatsCard 
          title="Yeni Öneriler" 
          value="8" 
          icon={<MessageSquare className="text-[#c28f2c]" size={28} />} 
          trend="Hoca/Ders ekleme" 
        />
      </div>

      {/* İki Kolonlu İçerik Alanı */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        
        {/* Sol Kolon: Son Aktiviteler Tablosu */}
        <div className="lg:col-span-2 bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-[#112a46] font-serif">Son Bekleyen İşlemler</h2>
            <button className="text-sm font-medium text-[#3b82f6] flex items-center gap-1 hover:underline">
              Tümünü Gör <ArrowRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-medium">TÜR</th>
                  <th className="px-6 py-4 font-medium">DETAY</th>
                  <th className="px-6 py-4 font-medium">TARİH</th>
                  <th className="px-6 py-4 font-medium">DURUM</th>
                  <th className="px-6 py-4 font-medium text-right">İŞLEM</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Şikayet Satırı */}
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold tracking-wide">ŞİKAYET</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[#112a46] font-medium">Uygunsuz dil kullanımı tespiti</p>
                    <p className="text-slate-400 text-xs mt-0.5">Yorum ID: #RV-842</p>
                  </td>
                  <td className="px-6 py-5 text-slate-500">2 saat önce</td>
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-1.5 text-[#c28f2c] font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c28f2c]"></div> Bekliyor
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-2 bg-slate-100 text-[#112a46] hover:bg-slate-200 rounded-lg font-medium transition-colors">
                      İncele
                    </button>
                  </td>
                </tr>
                {/* Öneri Satırı */}
                <tr className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold tracking-wide">ÖNERİ</span>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-[#112a46] font-medium">Yeni Hoca Ekleme Talebi</p>
                    <p className="text-slate-400 text-xs mt-0.5">Dr. Ahmet Yılmaz - Bilgisayar Müh.</p>
                  </td>
                  <td className="px-6 py-5 text-slate-500">5 saat önce</td>
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-1.5 text-[#c28f2c] font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#c28f2c]"></div> Bekliyor
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="px-4 py-2 bg-slate-100 text-[#112a46] hover:bg-slate-200 rounded-lg font-medium transition-colors">
                      İncele
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Sağ Kolon: Tailwind ile Tasarlanmış CSS Bar Grafik */}
        <div className="bg-white border border-slate-100 rounded-3xl shadow-sm p-7 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-[#112a46] font-serif">Haftalık Etkileşim</h3>
            <div className="p-2 bg-slate-50 rounded-xl">
              <BarChart3 size={20} className="text-slate-400" />
            </div>
          </div>

          {/* Tailwind CSS Grafik Alanı */}
          <div className="flex-1 flex flex-col justify-end mt-4">
            <div className="flex items-end justify-between gap-2 h-40">
              {[
                { day: 'Pzt', h: 'h-[40%]' },
                { day: 'Sal', h: 'h-[65%]' },
                { day: 'Çar', h: 'h-[45%]' },
                { day: 'Per', h: 'h-[85%]', active: true },
                { day: 'Cum', h: 'h-[55%]' },
                { day: 'Cmt', h: 'h-[30%]' },
                { day: 'Paz', h: 'h-[45%]' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center w-full gap-3 group cursor-pointer">
                  {/* Bar */}
                  <div className={`w-full max-w-[32px] rounded-t-md transition-all duration-300 ${item.active ? 'bg-[#3b82f6]' : 'bg-slate-100 group-hover:bg-blue-100'} ${item.h}`}></div>
                  {/* Etiket */}
                  <span className={`text-[11px] font-bold tracking-wide ${item.active ? 'text-[#112a46]' : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Grafik Altı Özet Bilgiler */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Toplam Ziyaret</p>
              <p className="text-2xl font-bold text-[#112a46]">12,450</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Yeni Yorum</p>
              <p className="text-2xl font-bold text-emerald-500">+342</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// Kart Bileşeni
function StatsCard({ title, value, icon, trend, alert }: { title: string, value: string, icon: React.ReactNode, trend: string, alert?: boolean }) {
  return (
    <div className={`bg-white p-6 rounded-3xl border ${alert ? 'border-red-100' : 'border-slate-100'} shadow-sm flex flex-col relative overflow-hidden group hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${alert ? 'bg-red-50' : 'bg-slate-50'}`}>
          {icon}
        </div>
      </div>
      <div>
        <h4 className="text-4xl font-bold text-[#112a46] tracking-tight">{value}</h4>
        <h3 className="text-sm font-semibold text-slate-500 mt-2">{title}</h3>
        {/* Trend boş gönderilirse hiç render edilmeyecek, böylece boşluk oluşmayacak */}
        {trend && (
          <p className={`text-xs mt-3 font-medium ${alert ? 'text-red-500' : 'text-slate-400'}`}>{trend}</p>
        )}
      </div>
    </div>
  );
}