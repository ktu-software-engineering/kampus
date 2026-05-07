import { Search, PlusCircle, Edit, Trash2, BookOpen, Star, Layers } from "lucide-react";

const mockCourses = [
  { id: "CRS-001", code: "BIL204", name: "Veri Yapıları ve Algoritmalar", department: "Bilgisayar Mühendisliği", credits: "5 AKTS", rating: 4.5, reviewCount: 215 },
  { id: "CRS-002", code: "MAT101", name: "Kalkülüs I", department: "Temel Bilimler", credits: "6 AKTS", rating: 2.8, reviewCount: 432 },
  { id: "CRS-003", code: "SENG302", name: "Yazılım Mimarisi", department: "Yazılım Mühendisliği", credits: "4 AKTS", rating: 4.1, reviewCount: 89 },
];

export default function CoursesPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-slate-200 dark:border-zinc-800 pb-8">
        <div>
          <h1 className="text-2xl font-black text-[#112a46] dark:text-white uppercase tracking-tighter">Müfredat Veritabanı</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-sm font-medium">Sistemdeki tüm derslerin, AKTS kredilerinin ve içerik bilgilerinin merkezi yönetimi.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-[#112a46] dark:bg-zinc-100 text-white dark:text-[#112a46] rounded font-black text-xs uppercase tracking-[0.15em] hover:bg-opacity-90 active:scale-95 transition-all shadow-sm">
          <PlusCircle size={16} strokeWidth={3} /> Yeni Müfredat Ekle
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 dark:bg-zinc-800/30 text-slate-500 dark:text-zinc-500 border-b border-slate-200 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Ders Kodu & Başlık</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Departman / Kredi</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px]">Kalite Analizi</th>
                <th className="px-8 py-5 font-black uppercase tracking-widest text-[10px] text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {mockCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/30 dark:hover:bg-zinc-800/20 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[#112a46] dark:text-white border border-slate-200 dark:border-zinc-700">
                        <BookOpen size={20} />
                      </div>
                      <div>
                        <p className="text-[#112a46] dark:text-zinc-200 font-bold text-sm leading-tight uppercase tracking-tight">{course.code}</p>
                        <p className="text-slate-400 dark:text-zinc-500 text-[10px] font-black mt-1 tracking-widest uppercase">{course.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-700 dark:text-zinc-300 font-bold text-xs uppercase tracking-tight">{course.department}</span>
                      <span className="inline-flex items-center px-2 py-0.5 border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-sm text-[9px] font-black tracking-widest">{course.credits}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                         <div className="h-1.5 w-24 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-700 dark:bg-slate-300" style={{ width: `${(course.rating/5)*100}%` }}></div>
                         </div>
                         <span className="text-[#112a46] dark:text-white font-black text-xs">{course.rating}</span>
                      </div>
                      <span className="text-slate-400 dark:text-zinc-500 text-[9px] font-black uppercase tracking-[0.15em]">{course.reviewCount} Değerlendirme Kaydı</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2.5 text-slate-400 dark:text-zinc-600 border border-slate-100 dark:border-zinc-800 rounded hover:text-[#112a46] dark:hover:text-white hover:border-[#112a46] transition-all"><Edit size={16} /></button>
                      <button className="p-2.5 text-slate-400 dark:text-zinc-600 border border-slate-100 dark:border-zinc-800 rounded hover:text-red-600 hover:border-red-600 transition-all"><Trash2 size={16} /></button>
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