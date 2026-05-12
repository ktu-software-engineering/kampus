import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import ReviewCard from "@/components/review/ReviewCard";
import { Star, BookOpen, GraduationCap, TrendingUp } from "lucide-react";

// Mock hoca verisi (Gerçek uygulamada Supabase'den gelecek)
const MOCK_INSTRUCTOR = {
  id: "1",
  name: "Prof. Dr. Ahmet Yılmaz",
  title: "Profesör Dr.",
  department: "Bilgisayar Mühendisliği",
  university: "Karadeniz Teknik Üniversitesi",
  rating: 4.8,
  totalReviews: 124,
  teachingQuality: 4.9,
  difficulty: 3.2,
  examDifficulty: 4.1,
  courses: [
    { id: "c1", code: "BIL 101", name: "Algoritma ve Programlama I" },
    { id: "c2", code: "BIL 203", name: "Veri Yapıları" },
    { id: "c3", code: "BIL 455", name: "Yapay Zeka" },
  ],
  reviews: [
    {
      id: "r1",
      course: "Veri Yapıları",
      date: "12 Ekim 2025",
      rating: 5,
      comment: "Dersleri son derece anlaşılır anlatıyor. Veri yapıları gibi zor bir dersi bile sevdirdi. Sınavları zordur ama adildir.",
      upvotes: 24,
      teachingQuality: 5,
      difficulty: 4,
      examDifficulty: 4
    },
    {
      id: "r2",
      course: "Algoritma ve Programlama I",
      date: "5 Eylül 2025",
      rating: 4,
      comment: "Hoca çok donanımlı. Sadece ders anlatmıyor, sektör tecrübelerini de paylaşıyor. Katılım zorunlu değil ama kaçırmamanızı öneririm.",
      upvotes: 12,
      teachingQuality: 4,
      difficulty: 2,
      examDifficulty: 3
    },
  ]
};

export default function InstructorPage() {
  const hoca = MOCK_INSTRUCTOR;

  return (
    <div className="flex flex-col min-h-screen relative bg-kk-beige overflow-x-hidden font-sans">
      <BackgroundTexture />
      <Navbar />

      <main className="flex-grow relative z-10 pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Üst Bilgi Kartı */}
        <section className="mb-12">
          <div className="bg-[rgba(255,253,248,0.72)] backdrop-blur-xl border border-[rgba(255,255,255,0.8)] rounded-2xl p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(6,40,58,0.12)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-kk-blue-light/5 rounded-full -mr-20 -mt-20 blur-3xl" />
            
            <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-kk-blue flex items-center justify-center text-kk-beige shrink-0 shadow-xl">
                <GraduationCap size={64} />
              </div>

              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <span className="bg-kk-blue-light/10 text-kk-blue-light text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {hoca.title}
                  </span>
                  <div className="flex items-center gap-1 text-kk-gold font-bold">
                    <Star size={18} fill="currentColor" />
                    <span>{hoca.rating}</span>
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-extrabold text-kk-blue mb-4 tracking-tight leading-tight">
                  {hoca.name}
                </h1>

                <div className="flex flex-col gap-2 text-kk-text-muted font-medium italic">
                  <div className="flex items-center gap-2">
                    <BookOpen size={18} />
                    <span>{hoca.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} />
                    <span>{hoca.university}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto">
                <div className="bg-kk-blue p-6 rounded-xl text-center flex-1 md:w-32 shadow-lg">
                  <div className="text-kk-beige/70 text-xs font-medium mb-1">Yorum</div>
                  <div className="text-kk-beige text-2xl font-bold">{hoca.totalReviews}</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center flex-1 md:w-32 border border-kk-blue/5 shadow-md">
                  <div className="text-kk-text-muted text-xs font-medium mb-1">Başarı</div>
                  <div className="text-kk-blue text-2xl font-bold">%94</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/40 shadow-sm">
              <h3 className="text-lg font-bold text-kk-blue mb-6 flex items-center gap-2">
                <Star size={20} className="text-kk-gold" />
                Değerlendirme Detayları
              </h3>
              
              <div className="space-y-5">
                {[
                  { label: "Anlatım Kalitesi", val: hoca.teachingQuality },
                  { label: "Ders Zorluğu", val: hoca.difficulty },
                  { label: "Sınav Zorluğu", val: hoca.examDifficulty }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-kk-text">{item.label}</span>
                      <span className="text-kk-blue-light">{item.val} / 5</span>
                    </div>
                    <div className="h-2 w-full bg-kk-blue/10 rounded-full overflow-hidden">
                      <div className="h-full bg-kk-blue-light transition-all duration-1000" style={{ width: `${(item.val / 5) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-md rounded-xl p-6 border border-white/40 shadow-sm">
              <h3 className="text-lg font-bold text-kk-blue mb-4">Verdiği Dersler</h3>
              <div className="flex flex-wrap gap-2">
                {hoca.courses.map(course => (
                  <div key={course.id} className="bg-kk-blue/5 text-kk-blue text-[13px] font-semibold px-4 py-2 rounded-lg border border-kk-blue/10">
                    <span className="opacity-60 mr-1">{course.code}</span> {course.name}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-2 px-2">
              <h2 className="text-2xl font-extrabold text-kk-blue">Öğrenci Yorumları</h2>
              <button className="text-kk-blue-light font-bold text-sm hover:underline">Tümünü Gör</button>
            </div>

            {hoca.reviews.map(review => (
              <ReviewCard 
                key={review.id}
                id={review.id}
                course={review.course}
                date={review.date}
                rating={review.rating}
                comment={review.comment}
                upvotes={review.upvotes}
                teachingQuality={review.teachingQuality}
                difficulty={review.difficulty}
                examDifficulty={review.examDifficulty}
              />
            ))}
            
            <button className="w-full py-6 rounded-xl border-2 border-dashed border-kk-blue/20 text-kk-blue/40 font-bold hover:bg-kk-blue/5 hover:border-kk-blue/30 transition-all">
              Daha Fazla Yorum Yükle
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
