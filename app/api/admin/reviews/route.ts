import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data } = await admin.from("users").select("role").eq("id", user.id).single();
  return ["admin", "moderator"].includes(data?.role ?? "") ? user : null;
}

// GET — tüm yorumlar (sayfalı)
export async function GET(req: Request) {
  if (!await checkAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const per = 20;
  const from = (page - 1) * per;

  const admin = createAdminClient();
  const { data, count, error } = await admin
    .from("reviews")
    .select(`
      id, teaching_quality, course_difficulty, exam_difficulty,
      comment, is_hidden, created_at, user_id,
      instructors(id, full_name, title, slug),
      courses(code, name)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + per - 1);

  if (error) {
    console.error("[admin/reviews]", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const reviewIds = (data ?? []).map((r: any) => r.id);
  const userIds  = [...new Set((data ?? []).map((r: any) => r.user_id).filter(Boolean))];

  // Kullanıcılar + yanıtlar ayrı sorgularda
  const [usersRes, repliesRes] = await Promise.all([
    userIds.length > 0
      ? admin.from("users").select("id, full_name, email").in("id", userIds)
      : { data: [] },
    reviewIds.length > 0
      ? admin.from("review_replies").select("id, review_id, content, created_at").in("review_id", reviewIds).order("created_at", { ascending: true })
      : { data: [] },
  ]);

  const usersMap: Record<string, any> = {};
  (usersRes.data ?? []).forEach((u: any) => { usersMap[u.id] = u; });

  const repliesMap: Record<string, any[]> = {};
  (repliesRes.data ?? []).forEach((r: any) => {
    if (!repliesMap[r.review_id]) repliesMap[r.review_id] = [];
    repliesMap[r.review_id].push(r);
  });

  const reviews = (data ?? []).map((r: any) => ({
    ...r,
    users: usersMap[r.user_id] ?? null,
    review_replies: repliesMap[r.id] ?? [],
  }));

  return Response.json({ reviews, total: count ?? 0 });
}

// DELETE — yorum + tüm cevapları sil
export async function DELETE(req: Request) {
  if (!await checkAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 403 });

  const { id } = await req.json().catch(() => ({}));
  if (!id) return Response.json({ error: "ID gerekli." }, { status: 400 });

  const admin = createAdminClient();
  // Cascade ile review_replies, review_upvotes, review_downvotes, reports otomatik silinir
  const { error } = await admin.from("reviews").delete().eq("id", id);
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json({ message: "Yorum ve tüm verileri silindi." });
}
