import { Search, Filter, AlertTriangle, CheckCircle, XCircle, Eye, Trash2 } from "lucide-react";

// Şimdilik arayüzde görmek için sahte (mock) veriler kullanıyoruz
const mockReports = [
  {
    id: "REP-842",
    course: "BIL204 - Veri Yapıları",
    comment: "Hoca dersi hiç anlatamıyor, slayt okuyup geçiyor. Sınavlar da aşırı zor, Allah belasını...",
    reason: "Küfür ve Hakaret",
    date: "2 saat önce",
    status: "pending",
  },
  {
    id: "REP-841",
    course: "MAT101 - Kalkülüs I",
    comment: "Bu dersi geçmek imkansız. Gidin başka üniversitede okuyun daha iyi.",
    reason: "Spam / Alakasız",
    date: "5 saat önce",
    status: "pending",
  },
  {
    id: "REP-839",
    course: "FIZ101 - Fizik I",
    comment: "Çok iyi bir hoca, kesinlikle dersini almalısınız.",
    reason: "Hatalı Şikayet",
    date: "1 gün önce",
    status: "resolved",
  },
  {
    id: "REP-835",
    course: "CENG301 - İşletim Sistemleri",
    comment: "Derste sürekli siyaset konuşuluyor, akademik bir ortam yok.",
    reason: "Uygunsuz İçerik",
    date: "2 gün önce",
    status: "rejected",
  },
];

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Üst Başlık ve Aksiyonlar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] font-serif">Şikayet Yönetimi</h1>
          <p className="text-slate-500 mt-1">Kullanıcılardan gelen yorum şikayetlerini inceleyin ve karara bağlayın.</p>
        </div>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Şikayet ID, ders veya yorum içeriğinde ara..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
          <Filter size={18} />
          Filtrele
        </button>
      </div>

      {/* Şikayetler Tablosu */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">ŞİKAYET DETAYI</th>
                <th className="px-6 py-4 font-medium">ŞİKAYET SEBEBİ</th>
                <th className="px-6 py-4 font-medium">TARİH</th>
                <th className="px-6 py-4 font-medium">DURUM</th>
                <th className="px-6 py-4 font-medium text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5 max-w-md">
                    <div className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-slate-400 tracking-wider">{report.id} • {report.course}</span>
                      <p className="text-[#112a46] font-medium line-clamp-2 leading-relaxed">
                        "{report.comment}"
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="flex items-center gap-2 text-slate-600 font-medium">
                      <AlertTriangle size={16} className="text-amber-500" />
                      {report.reason}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-slate-500 font-medium">
                    {report.date}
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="İncele" className="p-2 text-[#3b82f6] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
                        <Eye size={18} />
                      </button>
                      <button title="Sorun Yok (Onayla)" className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors">
                        <CheckCircle size={18} />
                      </button>
                      <button title="Yorumu Sil" className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination (Sayfalama) */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>Toplam 4 şikayet gösteriliyor</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50" disabled>Önceki</button>
            <button className="px-3 py-1 border border-slate-200 bg-slate-50 rounded-md font-medium text-[#112a46]">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50">2</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50">Sonraki</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Durum rozetlerini renklendiren küçük bileşen
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold tracking-wide">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          BEKLİYOR
        </span>
      );
    case 'resolved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          SİLİNDİ
        </span>
      );
    case 'rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wide">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
          REDDEDİLDİ
        </span>
      );
    default:
      return null;
  }
}