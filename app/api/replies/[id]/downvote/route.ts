import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: replyId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const admin = createAdminClient();
  const { data: existing } = await admin.from("reply_downvotes").select("reply_id").eq("reply_id", replyId).eq("user_id", user.id).single();

  if (existing) {
    await admin.from("reply_downvotes").delete().eq("reply_id", replyId).eq("user_id", user.id);
    return Response.json({ downvoted: false });
  }
  const { error } = await admin.from("reply_downvotes").insert({ reply_id: replyId, user_id: user.id });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ downvoted: true });
}
