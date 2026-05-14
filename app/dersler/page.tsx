import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { CourseFilters } from "@/components/courses/CourseFilters";

const PER_PAGE = 24;

interface Props {
  searchParams: Promise<{
    bolum?: string;
    siralama?: string;
    sayfa?: string;
  }>;
}

export default async function DerslerPage({ searchParams }: Props) {
  const { bolum, siralama, sayfa } = await searchParams;
  const page = Math.max(1, parseInt(sayfa ?? "1"));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createClient();

  // Bölüm listesi
  const { data: departments } = await supabase
    .from("departments")
    .select("name")
    .order("name");

  // Sıralama
  type SortCol = "avg_course_difficulty" | "avg_exam_difficulty";
  const sortMap: Record<string, { col: SortCol; asc: boolean }> = {
    ders_azalan:   { col: "avg_course_difficulty", asc: false },
    ders_artan:    { col: "avg_course_difficulty", asc: true  },
    sinav_azalan:  { col: "avg_exam_difficulty",   asc: false },
    sinav_artan:   { col: "avg_exam_difficulty",   asc: true  },
  };
  const sort = sortMap[siralama ?? ""] ?? sortMap["ders_azalan"];

  let query = supabase
    .from("course_stats")
    .select("id, code, name, department_name, review_count, avg_course_difficulty, avg_exam_difficulty", { count: "exact" });

  if (bolum) query = query.eq("department_name", bolum);

  query = query
    .order(sort.col, { ascending: sort.asc, nullsFirst: false })
    .order("name", { ascending: true })
    .range(from, to);

  const { data: courses, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-kk-beige relative overflow-x-hidden font-sans">
      <BackgroundTexture />
      <Navbar />

      <main className="flex-grow relative z-10 pt-14 md:pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-kk-blue tracking-tight mb-1">Dersler</h1>
          <p className="text-kk-text-muted text-sm">{count ?? 0} ders listeleniyor</p>
        </div>

        <CourseFilters
          departments={(departments ?? []).map(d => d.name)}
          courses={(courses ?? []).map((c: any) => ({
            id: c.id,
            code: c.code,
            name: c.name,
            department_name: c.department_name ?? "",
            review_count: Number(c.review_count ?? 0),
            avg_course_difficulty: c.avg_course_difficulty != null ? Number(c.avg_course_difficulty) : 0,
            avg_exam_difficulty: c.avg_exam_difficulty != null ? Number(c.avg_exam_difficulty) : 0,
          }))}
          totalPages={totalPages}
          currentPage={page}
          currentBolum={bolum ?? ""}
          currentSiralama={siralama ?? "ders_azalan"}
          totalCount={count ?? 0}
        />
      </main>

      <Footer />
    </div>
  );
}
