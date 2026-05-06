import { Search, Filter, PlusCircle, Edit, Trash2, BookOpen, Star } from "lucide-react";

// Şimdilik arayüzde görmek için sahte (mock) ders verileri
const mockCourses = [
  {
    id: "CRS-001",
    code: "BIL204",
    name: "Veri Yapıları ve Algoritmalar",
    department: "Bilgisayar Mühendisliği",
    credits: "5 AKTS",
    rating: 4.5,
    reviewCount: 215,
    status: "active",
  },
  {
    id: "CRS-002",
    code: "MAT101",
    name: "Kalkülüs I",
    department: "Temel Bilimler",
    credits: "6 AKTS",
    rating: 2.8,
    reviewCount: 432,
    status: "active",
  },
  {
    id: "CRS-003",
    code: "SENG302",
    name: "Yazılım Mimarisi",
    department: "Yazılım Mühendisliği",
    credits: "4 AKTS",
    rating: 0,
    reviewCount: 0,
    status: "new",
  },
  {
    id: "CRS-004",
    code: "EEM205",
    name: "Devre Teorisi",
    department: "Elektrik-Elektronik Mühendisliği",
    credits: "5 AKTS",
    rating: 4.1,
    reviewCount: 89,
    status: "active",
  },
];

export default function CoursesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Üst Başlık ve Aksiyonlar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] font-serif">Ders Katalogları</h1>
          <p className="text-slate-500 mt-1">Sistemdeki tüm dersleri görüntüleyin, kredi ve bölüm bilgilerini düzenleyin.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#112a46] text-white rounded-xl text-sm font-medium hover:bg-[#1a3a5f] transition-colors shadow-sm">
          <PlusCircle size={18} />
          Yeni Ders Ekle
        </button>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Ders kodu, adı veya bölüm ara..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50 focus:border-[#3b82f6] transition-all"
          />
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/50">
            <option>Tüm Bölümler</option>
            <option>Bilgisayar Müh.</option>
            <option>Temel Bilimler</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
            <Filter size={18} />
            Filtrele
          </button>
        </div>
      </div>

      {/* Dersler Tablosu */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 font-medium">DERS KODU VE ADI</th>
                <th className="px-6 py-4 font-medium">BÖLÜM / KREDİ</th>
                <th className="px-6 py-4 font-medium">İSTATİSTİK</th>
                <th className="px-6 py-4 font-medium">DURUM</th>
                <th className="px-6 py-4 font-medium text-right">İŞLEMLER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-[#112a46] font-bold">{course.code} - {course.name}</p>
                        <p className="text-slate-400 text-xs">{course.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-700 font-medium">{course.department}</span>
                      <span className="text-slate-400 text-xs">{course.credits}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-[#c28f2c] font-bold">
                        <Star size={14} className="fill-[#c28f2c]" />
                        {course.rating > 0 ? course.rating : '-'}
                      </div>
                      <span className="text-slate-400 text-xs">{course.reviewCount} değerlendirme</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {course.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold tracking-wide">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        AKTİF
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-600 text-xs font-bold tracking-wide">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500"></div>
                        YENİ EKLENDİ
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button title="Düzenle" className="p-2 text-slate-600 bg-slate-50 hover:bg-slate-100 hover:text-[#3b82f6] rounded-lg transition-colors">
                        <Edit size={18} />
                      </button>
                      <button title="Sil" className="p-2 text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between text-sm text-slate-500">
          <span>Toplam 4 ders gösteriliyor</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50" disabled>Önceki</button>
            <button className="px-3 py-1 border border-slate-200 bg-slate-50 rounded-md font-medium text-[#112a46]">1</button>
            <button className="px-3 py-1 border border-slate-200 rounded-md hover:bg-slate-50">Sonraki</button>
          </div>
        </div>
      </div>
    </div>
  );
}