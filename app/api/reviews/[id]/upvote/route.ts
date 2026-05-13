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
    .from("review_upvotes")
    .select("review_id")
    .eq("review_id", reviewId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await admin.from("review_upvotes").delete()
      .eq("review_id", reviewId)
      .eq("user_id", user.id);
    return Response.json({ upvoted: false });
  }

  await admin.from("review_upvotes").insert({
    review_id: reviewId,
    user_id: user.id,
  });
  return Response.json({ upvoted: true });
}
