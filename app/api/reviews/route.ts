import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  instructor_id:     z.string().min(1),
  course_id:         z.string().optional(), // "genel" veya boş ise null kaydedilir
  teaching_quality:  z.number().min(0.5).max(5),
  course_difficulty: z.number().min(1).max(5),
  exam_difficulty:   z.number().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  // Email doğrulaması kontrolü
  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("users")
    .select("is_verified")
    .eq("id", user.id)
    .single();

  if (!profile?.is_verified) {
    return Response.json({ error: "Yorum yapabilmek için e-posta adresinizi doğrulamanız gerekiyor." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Geçersiz form verisi." }, { status: 400 });
  }

  const { instructor_id, course_id, teaching_quality, course_difficulty, exam_difficulty, comment } = parsed.data;
  const finalCourseId = (!course_id || course_id === "genel") ? null : course_id;

  // Aynı hocaya daha önce yorum yapılmış mı?
  const { data: existing } = await admin
    .from("reviews")
    .select("id")
    .eq("user_id", user.id)
    .eq("instructor_id", instructor_id)
    .single();

  if (existing) {
    return Response.json({ error: "Bu hocaya daha önce yorum yaptınız." }, { status: 409 });
  }

  const { data, error } = await admin
    .from("reviews")
    .insert({
      user_id: user.id,
      instructor_id,
      course_id: finalCourseId,
      teaching_quality,
      course_difficulty,
      exam_difficulty,
      comment: comment ?? null,
      is_hidden: false,
    })
    .select("id")
    .single();

  if (error) {
    console.error("[reviews] insert error:", error.message);
    return Response.json({ error: "Yorum kaydedilemedi." }, { status: 500 });
  }

  return Response.json({ message: "Yorum eklendi.", id: data.id }, { status: 201 });
}
