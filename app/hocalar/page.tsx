import { createClient } from "@/lib/supabase/server";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import { InstructorFilters } from "@/components/instructors/InstructorFilters";

const TITLES = [
  "Prof. Dr.", "Prof.", "Doç. Dr.", "Dr. Öğr. Üyesi",
  "Dr.", "Arş. Gör. Dr.", "Arş. Gör.", "Öğr. Gör. Dr.", "Öğr. Gör.",
];

const PER_PAGE = 24;

interface Props {
  searchParams: Promise<{
    bolum?: string;
    unvan?: string;
    siralama?: string;
    sayfa?: string;
  }>;
}

export default async function HocalarPage({ searchParams }: Props) {
  const { bolum, unvan, siralama, sayfa } = await searchParams;
  const page = Math.max(1, parseInt(sayfa ?? "1"));
  const from = (page - 1) * PER_PAGE;
  const to = from + PER_PAGE - 1;

  const supabase = await createClient();

  // Bölüm listesi
  const { data: departments } = await supabase
    .from("departments")
    .select("id, name")
    .order("name");

  // Bölüm filtresi için instructor ID'leri bul
  let filteredIds: string[] | null = null;
  if (bolum) {
    const dept = departments?.find(d => d.name === bolum);
    if (dept) {
      const { data: links } = await supabase
        .from("course_instructors")
        .select("instructor_id, courses!inner(department_id)")
        .eq("courses.department_id", dept.id);
      filteredIds = [...new Set((links ?? []).map((l: any) => l.instructor_id))];
    }
  }

  // Sıralama
  const ascending = siralama === "puan_artan" || siralama === "yorum_artan";
  const orderCol = siralama?.startsWith("yorum") ? "review_count" : "average_rating";

  let query = supabase
    .from("instructors")
    .select("id, full_name, title, slug, average_rating, review_count", { count: "exact" })
    .eq("is_active", true);

  if (unvan) {
    const titles = unvan.split(",").map(t => t.trim()).filter(Boolean);
    query = titles.length === 1 ? query.eq("title", titles[0]) : query.in("title", titles);
  }
  if (filteredIds) query = filteredIds.length > 0 ? query.in("id", filteredIds) : query.in("id", ["00000000-0000-0000-0000-000000000000"]);
  query = query.order(orderCol, { ascending }).order("full_name", { ascending: true });
  query = query.range(from, to);

  const { data: instructors, count } = await query;
  const totalPages = Math.ceil((count ?? 0) / PER_PAGE);

  return (
    <div className="min-h-screen flex flex-col bg-kk-beige relative overflow-x-hidden font-sans">
      <BackgroundTexture />
      <Navbar />

      <main className="flex-grow relative z-10 pt-24 pb-16 px-4 md:px-8 max-w-7xl mx-auto w-full">
        {/* Başlık */}
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold text-kk-blue tracking-tight mb-1">
            Hocalar
          </h1>
          <p className="text-kk-text-muted text-sm">
            {count ?? 0} akademisyen listeleniyor
          </p>
        </div>

        <InstructorFilters
          departments={(departments ?? []).map(d => d.name)}
          titles={TITLES}
          instructors={(instructors ?? []).map((i: any) => ({
            id: i.id,
            full_name: i.full_name,
            title: i.title,
            slug: i.slug,
            average_rating: i.average_rating,
            review_count: i.review_count,
          }))}
          totalPages={totalPages}
          currentPage={page}
          currentBolum={bolum ?? ""}
          currentUnvan={unvan ?? ""}
          currentSiralama={siralama ?? "puan_azalan"}
          totalCount={count ?? 0}
        />
      </main>

      <Footer />
    </div>
  );
}
