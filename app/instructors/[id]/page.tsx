import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackgroundTexture } from "@/components/layout/BackgroundTexture";
import InstructorContent from "@/components/instructor/InstructorContent";
import { Star, GraduationCap, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getInstructorData(id: string) {
  const supabase = await createClient();

  // Slug veya UUID ile ara
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  const query = supabase
    .from("instructors")
    .select("id, full_name, title, average_rating, review_count, is_active, slug");

  const { data: instructor, error } = await (isUUID
    ? query.eq("id", id)
    : query.eq("slug", id)
  ).single();

  if (error || !instructor) return null;

  // Sonraki sorgularda her zaman gerçek UUID kullan
  const instructorId = instructor.id;

  // Önce course_id'leri al, sonra ders detaylarını çek
  const { data: courseLinks } = await supabase
    .from("course_instructors")
    .select("course_id")
    .eq("instructor_id", instructorId);

  const courseIds = (courseLinks ?? []).map((cl: any) => cl.course_id).filter(Boolean);

  const courses = courseIds.length > 0
    ? (await supabase
        .from("courses")
        .select("id, code, name, departments(name)")
        .in("id", courseIds)
      ).data ?? []
    : [];

  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id, teaching_quality, course_difficulty, exam_difficulty,
      attendance_required, comment, created_at,
      courses(id, code, name),
      review_upvotes(count)
    `)
    .eq("instructor_id", instructorId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  const activeReviews = reviews ?? [];

  // Her yorum için downvote sayısını ayrı çek
  const reviewIds = activeReviews.map((r: any) => r.id);
  const downvoteCounts: Record<string, number> = {};
  if (reviewIds.length > 0) {
    const { data: dvRows } = await supabase
      .from("review_downvotes")
      .select("review_id")
      .in("review_id", reviewIds);
    (dvRows ?? []).forEach((row: any) => {
      downvoteCounts[row.review_id] = (downvoteCounts[row.review_id] ?? 0) + 1;
    });
  }

  const avg = (key: string) =>
    activeReviews.length > 0
      ? +(activeReviews.reduce((s: number, r: any) => s + (r[key] ?? 0), 0) / activeReviews.length).toFixed(1)
      : 0;

  return {
    instructor,
    courses,
    reviews: activeReviews.map((r: any) => ({
      ...r,
      upvote_count: (r.review_upvotes?.[0]?.count ?? 0) - (downvoteCounts[r.id] ?? 0),
    })),
    averages: {
      teaching_quality: avg("teaching_quality"),
      course_difficulty: avg("course_difficulty"),
      exam_difficulty: avg("exam_difficulty"),
    },
  };
}


export default async function InstructorPage({ params }: PageProps) {
  const { id } = await params;
  const data = await getInstructorData(id);

  if (!data) notFound();

  // UUID ile girilmişse slug URL'e yönlendir
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  if (isUUID && data.instructor.slug) {
    redirect(`/instructors/${data.instructor.slug}`);
  }

  const { instructor, courses, reviews, averages } = data;

  // Kullanıcı giriş yapmış mı + daha önce yorum yapmış mı?
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  let hasReviewed = false;
  if (user) {
    const { data: existing } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("instructor_id", instructor.id)
      .single();
    hasReviewed = !!existing;
  }

  // Kullanıcının upvote/downvote ettiği yorum ID'leri
  let upvotedReviewIds: string[]   = [];
  let downvotedReviewIds: string[] = [];

  // Kullanıcının şikayet ettiği yorum ID'leri
  let reportedReviewIds: string[] = [];
  if (user) {
    const reviewIds = reviews.map((r: any) => r.id);
    if (reviewIds.length > 0) {
      const [{ data: userReports }, { data: userUpvotes }, { data: userDownvotes }] = await Promise.all([
        supabase.from("reports").select("review_id").eq("reported_by", user.id).in("review_id", reviewIds),
        supabase.from("review_upvotes").select("review_id").eq("user_id", user.id).in("review_id", reviewIds),
        supabase.from("review_downvotes").select("review_id").eq("user_id", user.id).in("review_id", reviewIds),
      ]);
      reportedReviewIds  = (userReports    ?? []).map((r: any) => r.review_id);
      upvotedReviewIds   = (userUpvotes    ?? []).map((r: any) => r.review_id);
      downvotedReviewIds = (userDownvotes  ?? []).map((r: any) => r.review_id);
    }
  }

  const ratingDisplay = instructor.average_rating > 0
    ? instructor.average_rating.toFixed(1)
    : "–";

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
              {/* Avatar */}
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl bg-kk-blue flex items-center justify-center text-kk-beige shrink-0 shadow-xl">
                <GraduationCap size={64} />
              </div>

              {/* Bilgiler */}
              <div className="flex-grow">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  {instructor.average_rating > 0 && (
                    <div className="flex items-center gap-1 text-kk-gold font-bold">
                      <Star size={18} fill="currentColor" />
                      <span>{ratingDisplay}</span>
                    </div>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl font-extrabold text-kk-blue mb-4 tracking-tight leading-tight">
                  {instructor.title ? `${instructor.title} ${instructor.full_name}` : instructor.full_name}
                </h1>

                <div className="flex flex-col gap-2 text-kk-text-muted font-medium italic">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} />
                    <span>{instructor.review_count} değerlendirme</span>
                  </div>
                </div>
              </div>

              {/* Stat Kutucukları */}
              <div className="flex flex-row md:flex-col gap-4 w-full md:w-auto">
                <div className="bg-kk-blue p-6 rounded-xl text-center flex-1 md:w-32 shadow-lg">
                  <div className="text-kk-beige/70 text-xs font-medium mb-1">Yorum</div>
                  <div className="text-kk-beige text-2xl font-bold">{instructor.review_count}</div>
                </div>
                <div className="bg-white p-6 rounded-xl text-center flex-1 md:w-32 border border-kk-blue/5 shadow-md">
                  <div className="text-kk-text-muted text-xs font-medium mb-1">Puan</div>
                  <div className="flex items-center justify-center gap-1 text-kk-gold">
                    <Star size={18} fill="currentColor" />
                    <span className="text-kk-blue text-2xl font-bold">{ratingDisplay}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <InstructorContent
          instructorId={instructor.id}
          instructorSlug={instructor.slug ?? id}
          instructorName={instructor.title ? `${instructor.title} ${instructor.full_name}` : instructor.full_name}
          courses={courses.map((c: any) => ({ id: c.id, code: c.code, name: c.name }))}
          reviews={reviews.map((r: any) => ({
            id: r.id,
            courses: r.courses ?? null,
            created_at: r.created_at,
            teaching_quality: r.teaching_quality,
            course_difficulty: r.course_difficulty ?? 0,
            exam_difficulty: r.exam_difficulty ?? 0,
            comment: r.comment ?? null,
            upvote_count: r.upvote_count ?? 0,
          }))}
          averages={averages}
          isLoggedIn={isLoggedIn}
          hasReviewed={hasReviewed}
          reportedReviewIds={reportedReviewIds}
          upvotedReviewIds={upvotedReviewIds}
          downvotedReviewIds={downvotedReviewIds}
        />
      </main>

      <Footer />
    </div>
  );
}
