import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({ reason: z.string().min(1).max(100) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: replyId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz istek." }, { status: 400 });

  const admin = createAdminClient();
  const { data: existing } = await admin.from("reports").select("id").eq("reply_id", replyId).eq("reported_by", user.id).single();

  if (existing) {
    await admin.from("reports").delete().eq("reply_id", replyId).eq("reported_by", user.id);
    return Response.json({ removed: true });
  }

  await admin.from("reports").insert({ reply_id: replyId, reported_by: user.id, reason: parsed.data.reason, status: "pending" });
  return Response.json({ removed: false });
}
