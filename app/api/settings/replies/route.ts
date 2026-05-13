import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

// GET — kullanıcının kendi yanıtları
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json([], { status: 401 });

  const { data } = await supabase
    .from("review_replies")
    .select("id, content, created_at, reviews(id, instructors(full_name, title, slug), courses(code, name))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return Response.json(data ?? []);
}

// DELETE
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const { id } = await req.json().catch(() => ({}));
  if (!id) return Response.json({ error: "Geçersiz istek." }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("review_replies").delete().eq("id", id).eq("user_id", user.id);
  if (error) return Response.json({ error: "Silinemedi." }, { status: 500 });
  return Response.json({ message: "Yanıt silindi." });
}

// PUT — yanıt güncelle
const schema = z.object({
  id: z.string().min(1),
  content: z.string().min(1).max(500),
});

export async function PUT(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz veri." }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("review_replies")
    .update({ content: parsed.data.content })
    .eq("id", parsed.data.id)
    .eq("user_id", user.id);

  if (error) return Response.json({ error: "Güncellenemedi." }, { status: 500 });
  return Response.json({ message: "Yanıt güncellendi." });
}
