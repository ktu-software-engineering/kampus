import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reviewId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("review_downvotes")
    .select("review_id")
    .eq("review_id", reviewId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await admin.from("review_downvotes").delete()
      .eq("review_id", reviewId)
      .eq("user_id", user.id);
    return Response.json({ downvoted: false });
  }

  const { error: insertError } = await admin
    .from("review_downvotes")
    .insert({ review_id: reviewId, user_id: user.id });

  if (insertError) {
    console.error("[downvote] insert error:", insertError.message, insertError.details);
    return Response.json({ error: insertError.message }, { status: 500 });
  }

  return Response.json({ downvoted: true });
}
