import { Search, Filter, CheckCircle, XCircle, UserPlus, BookPlus, PlusCircle } from "lucide-react";

// Şimdilik arayüzde görmek için sahte (mock) öneri verileri
const mockSuggestions = [
  {
    id: "SUG-102",
    type: "instructor",
    title: "Dr. Öğr. Üyesi Ayşe Yılmaz",
    details: "Yazılım Mühendisliği Bölümü - Yeni katıldı",
    submittedBy: "Anonim Öğrenci",
    date: "1 saat önce",
    status: "pending",
  },
  {
    id: "SUG-101",
    type: "course",
    title: "SENG302 - Yazılım Mimarisi",
    details: "Bilgisayar Mühendisliği 3. Sınıf Bahar Dönemi",
    submittedBy: "ahmet.k@ktu.edu.tr",
    date: "3 saat önce",
    status: "pending",
  },
  {
    id: "SUG-098",
    type: "instructor",
    title: "Prof. Dr. Mehmet Demir",
    details: "Elektrik-Elektronik Mühendisliği Bölümü",
    submittedBy: "Anonim Öğrenci",
    date: "1 gün önce",
    status: "approved",
  },
  {
    id: "SUG-095",
    type: "course",
    title: "GİR101 - Girişimcilik",
    details: "Zaten sistemde var ama kodu farklı girilmiş.",
    submittedBy: "zeynep.y@ktu.edu.tr",
    date: "2 gün önce",
    status: "rejected",
  },
];

export default function SuggestionsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Üst Başlık ve Aksiyonlar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] font-serif">Öneri Yönetimi</h1>
          <p className="text-slate-500 mt-1">Öğrencilerden gelen yeni hoca ve ders ekleme taleplerini değerlendirin.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#112a46] text-white rounded-xl text-sm font-medium hover:bg-[#1a3a5f] transition-colors shadow-sm">
          <PlusCircle size={18} />
          Manuel Ekle
        </button>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Öneri ID, hoca adı veya ders kodu ara..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
          <Filter size={18} />
          Tümü
        </button>
      </div>

      {/* Öneriler Tablosu */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">TÜR</th>
                <th className="px-6 py-4 font-medium">ÖNERİ DETAYI</th>
                <th className="px-6 py-4 font-medium">GÖNDEREN / TARİH</th>
                <th className="px-6 py-4 font-medium">DURUM</th>
                <th className="px-6 py-4 font-medium text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockSuggestions.map((suggestion) => (
                <tr key={suggestion.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    {suggestion.type === 'instructor' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold tracking-wide">
                        <UserPlus size={14} /> HOCA
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-cyan-50 text-cyan-600 rounded-lg text-xs font-bold tracking-wide">
                        <BookPlus size={14} /> DERS
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <p className="text-[#112a46] font-bold">{suggestion.title}</p>
                      <p className="text-slate-500 text-xs">{suggestion.details}</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-700 font-medium">{suggestion.submittedBy}</span>
                      <span className="text-slate-400 text-xs">{suggestion.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <StatusBadge status={suggestion.status} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Onayla ve Sisteme Ekle" className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold pr-3">
                        <CheckCircle size={18} /> Ekle
                      </button>
                      <button title="Reddet" className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
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

// Durum rozetleri
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold tracking-wide">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></div>
          BEKLİYOR
        </span>
      );
    case 'approved':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
          EKLENDİ
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