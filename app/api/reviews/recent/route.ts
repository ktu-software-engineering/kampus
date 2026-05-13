import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("reviews")
    .select(`
      id, teaching_quality, comment, created_at,
      instructors(id, full_name, title, slug),
      courses(name, code)
    `)
    .eq("is_hidden", false)
    .not("comment", "is", null)
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) return Response.json([]);

  return Response.json(
    (data ?? []).map((r: any) => ({
      id: r.id,
      rating: r.teaching_quality,
      comment: r.comment,
      created_at: r.created_at,
      instructor: r.instructors,
      course: r.courses,
    }))
  );
}
