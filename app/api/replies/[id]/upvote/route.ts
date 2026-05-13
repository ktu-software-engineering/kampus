import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: replyId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const admin = createAdminClient();
  const { data: existing } = await admin.from("reply_upvotes").select("reply_id").eq("reply_id", replyId).eq("user_id", user.id).single();

  if (existing) {
    await admin.from("reply_upvotes").delete().eq("reply_id", replyId).eq("user_id", user.id);
    return Response.json({ upvoted: false });
  }
  await admin.from("reply_upvotes").insert({ reply_id: replyId, user_id: user.id });
  return Response.json({ upvoted: true });
}
