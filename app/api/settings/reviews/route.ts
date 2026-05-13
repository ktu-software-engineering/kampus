import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

// GET — kullanıcının kendi yorumları
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json([], { status: 401 });

  const { data } = await supabase
    .from("reviews")
    .select("id, teaching_quality, course_difficulty, exam_difficulty, comment, created_at, instructors(full_name, title, slug), courses(code, name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return Response.json(data ?? []);
}

// DELETE — yorum sil
export async function DELETE(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const { id } = await req.json().catch(() => ({}));
  if (!id) return Response.json({ error: "Geçersiz istek." }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("reviews").delete().eq("id", id).eq("user_id", user.id);
  if (error) return Response.json({ error: "Silinemedi." }, { status: 500 });

  return Response.json({ message: "Yorum silindi." });
}

// PUT — yorum güncelle
const schema = z.object({
  id: z.string().min(1),
  teaching_quality: z.number().min(1).max(5),
  course_difficulty: z.number().min(1).max(5),
  exam_difficulty: z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function PUT(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz veri." }, { status: 400 });

  const { id, ...updates } = parsed.data;
  const admin = createAdminClient();
  const { error } = await admin.from("reviews").update({
    teaching_quality: updates.teaching_quality,
    course_difficulty: updates.course_difficulty,
    exam_difficulty: updates.exam_difficulty,
    comment: updates.comment ?? null,
  }).eq("id", id).eq("user_id", user.id);

  if (error) return Response.json({ error: "Güncellenemedi." }, { status: 500 });
  return Response.json({ message: "Yorum güncellendi." });
}
