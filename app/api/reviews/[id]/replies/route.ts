import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

// GET — review'ın tüm replyleri + kullanıcının oy durumu
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reviewId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("review_replies")
    .select("id, content, created_at, reply_upvotes(count)")
    .eq("review_id", reviewId)
    .eq("is_hidden", false)
    .order("created_at", { ascending: true });

  if (error) return Response.json([], { status: 500 });

  const replyIds = (data ?? []).map((r: any) => r.id);
  const downvoteCounts: Record<string, number> = {};
  const userUpvotes = new Set<string>();
  const userDownvotes = new Set<string>();
  const userReports = new Set<string>();

  if (replyIds.length > 0) {
    // Tüm downvotlar
    const { data: dvRows } = await supabase
      .from("reply_downvotes")
      .select("reply_id")
      .in("reply_id", replyIds);
    (dvRows ?? []).forEach((row: any) => {
      downvoteCounts[row.reply_id] = (downvoteCounts[row.reply_id] ?? 0) + 1;
    });

    // Kullanıcının kendi oyları
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const [{ data: myUpvotes }, { data: myDownvotes }, { data: myReports }] = await Promise.all([
        supabase.from("reply_upvotes").select("reply_id").eq("user_id", user.id).in("reply_id", replyIds),
        supabase.from("reply_downvotes").select("reply_id").eq("user_id", user.id).in("reply_id", replyIds),
        supabase.from("reports").select("reply_id").eq("reported_by", user.id).in("reply_id", replyIds),
      ]);
      (myUpvotes   ?? []).forEach((r: any) => userUpvotes.add(r.reply_id));
      (myDownvotes ?? []).forEach((r: any) => userDownvotes.add(r.reply_id));
      (myReports   ?? []).forEach((r: any) => r.reply_id && userReports.add(r.reply_id));
    }
  }

  return Response.json(
    (data ?? []).map((r: any) => ({
      id: r.id,
      content: r.content,
      created_at: r.created_at,
      vote_count: (r.reply_upvotes?.[0]?.count ?? 0) - (downvoteCounts[r.id] ?? 0),
      user_upvoted:   userUpvotes.has(r.id),
      user_downvoted: userDownvotes.has(r.id),
      user_reported:  userReports.has(r.id),
    }))
  );
}

// POST — yeni reply
const schema = z.object({ content: z.string().min(1).max(500) });

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reviewId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz içerik." }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("review_replies")
    .insert({ review_id: reviewId, user_id: user.id, content: parsed.data.content })
    .select("id, content, created_at")
    .single();

  if (error) {
    console.error("[reply] insert error:", error.message);
    return Response.json({ error: "Cevap gönderilemedi." }, { status: 500 });
  }

  return Response.json({
    ...data,
    vote_count: 0,
    user_upvoted: false,
    user_downvoted: false,
    user_reported: false,
  }, { status: 201 });
}
