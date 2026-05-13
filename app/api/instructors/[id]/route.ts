import { createClient } from "@/lib/supabase/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

  if (error || !instructor) {
    return Response.json({ error: "Hoca bulunamadı." }, { status: 404 });
  }

  // Verdiği dersler — ayrı sorgu (join yerine)
  const { data: courseLinks } = await supabase
    .from("course_instructors")
    .select("course_id")
    .eq("instructor_id", instructor.id);

  const courseIds = (courseLinks ?? []).map((cl: any) => cl.course_id).filter(Boolean);

  const courses = courseIds.length > 0
    ? (await supabase
        .from("courses")
        .select("id, code, name, departments(name)")
        .in("id", courseIds)
      ).data ?? []
    : [];

  // Yorumlar + upvote sayısı
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      id,
      teaching_quality,
      course_difficulty,
      exam_difficulty,
      attendance_required,
      comment,
      created_at,
      courses(id, code, name),
      review_upvotes(count)
    `)
    .eq("instructor_id", id)
    .eq("is_hidden", false)
    .order("created_at", { ascending: false });

  // Ortalamalar
  const activeReviews = reviews ?? [];
  const avg = (key: string) =>
    activeReviews.length > 0
      ? +(activeReviews.reduce((s: number, r: any) => s + (r[key] ?? 0), 0) / activeReviews.length).toFixed(1)
      : 0;

  return Response.json({
    instructor,
    courses,
    reviews: activeReviews.map((r: any) => ({
      ...r,
      upvote_count: r.review_upvotes?.[0]?.count ?? 0,
    })),
    averages: {
      teaching_quality: avg("teaching_quality"),
      course_difficulty: avg("course_difficulty"),
      exam_difficulty: avg("exam_difficulty"),
    },
  });
}
