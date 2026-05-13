import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  // Bu haftanın en çok yorum alan hocaları
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data: weekData } = await supabase
    .from("reviews")
    .select("instructor_id")
    .eq("is_hidden", false)
    .gte("created_at", weekAgo);

  if (weekData && weekData.length > 0) {
    // Bu hafta yorum alan hocaları say
    const counts: Record<string, number> = {};
    weekData.forEach((r: any) => {
      counts[r.instructor_id] = (counts[r.instructor_id] ?? 0) + 1;
    });

    const topIds = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);

    const { data: instructors } = await supabase
      .from("instructors")
      .select("id, full_name, title, slug, average_rating, review_count")
      .in("id", topIds)
      .eq("is_active", true);

    if (instructors && instructors.length > 0) {
      return Response.json(
        instructors
          .sort((a: any, b: any) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0))
          .map((i: any) => ({
            ...i,
            week_reviews: counts[i.id] ?? 0,
          }))
      );
    }
  }

  // Bu hafta yorum yoksa genel en çok yorumlananlar
  const { data: fallback } = await supabase
    .from("instructors")
    .select("id, full_name, title, slug, average_rating, review_count")
    .eq("is_active", true)
    .gt("review_count", 0)
    .order("review_count", { ascending: false })
    .limit(10);

  return Response.json(
    (fallback ?? []).map((i: any) => ({ ...i, week_reviews: i.review_count }))
  );
}
