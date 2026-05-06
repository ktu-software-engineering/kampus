import { Search, PlusCircle, Edit, Trash2, BookOpen, Star, Layers } from "lucide-react";

const mockCourses = [
  { id: "CRS-001", code: "BIL204", name: "Veri Yapıları ve Algoritmalar", department: "Bilgisayar Mühendisliği", credits: "5 AKTS", rating: 4.5, reviewCount: 215 },
  { id: "CRS-002", code: "MAT101", name: "Kalkülüs I", department: "Temel Bilimler", credits: "6 AKTS", rating: 2.8, reviewCount: 432 },
  { id: "CRS-003", code: "SENG302", name: "Yazılım Mimarisi", department: "Yazılım Mühendisliği", credits: "4 AKTS", rating: 4.1, reviewCount: 89 },
];

export default function CoursesPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#112a46] dark:text-white font-serif tracking-tight">Ders Katalogları</h1>
          <p className="text-slate-500 dark:text-zinc-400 mt-1 text-lg font-medium">Sistemdeki tüm dersleri görüntüleyin, AKTS ve içerik bilgilerini güncelleyin.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-[#112a46] dark:bg-zinc-800 text-white rounded-[1.25rem] text-sm font-black hover:shadow-2xl transition-all">
          <PlusCircle size={20} /> Yeni Ders Ekle
        </button>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-500">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-400 border-b border-slate-100 dark:border-zinc-800">
              <tr>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Ders Kodu & İsmi</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Departman / Kredi</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px]">Kalite Skoru</th>
                <th className="px-8 py-5 font-black uppercase tracking-wider text-[10px] text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-zinc-800">
              {mockCourses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-100/50 dark:border-indigo-900/30">
                        <BookOpen size={26} />
                      </div>
                      <div>
                        <p className="text-[#112a46] dark:text-zinc-200 font-black text-base">{course.code}</p>
                        <p className="text-slate-400 dark:text-zinc-500 text-xs font-bold mt-0.5">{course.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <span className="text-slate-700 dark:text-zinc-300 font-bold text-xs">{course.department}</span>
                      <span className="inline-flex items-center gap-1 w-fit px-2.5 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 rounded-md text-[10px] font-black tracking-widest">{course.credits}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                         <div className="h-2 w-24 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#c28f2c]" style={{ width: `${(course.rating/5)*100}%` }}></div>
                         </div>
                         <span className="text-[#112a46] dark:text-white font-black text-sm">{course.rating}</span>
                      </div>
                      <span className="text-slate-400 dark:text-zinc-500 text-[10px] font-black uppercase tracking-widest">{course.reviewCount} Değerlendirme</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-3 text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 rounded-xl hover:text-blue-500 transition-all"><Edit size={18} /></button>
                      <button className="p-3 text-slate-600 dark:text-zinc-400 bg-slate-50 dark:bg-zinc-800 rounded-xl hover:text-red-500 transition-all"><Trash2 size={18} /></button>
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