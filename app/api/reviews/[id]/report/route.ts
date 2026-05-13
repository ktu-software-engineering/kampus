import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  reason: z.string().min(1).max(100),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: reviewId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  const admin = createAdminClient();

  // Daha önce şikayet etmiş mi?
  const { data: existing } = await admin
    .from("reports")
    .select("id")
    .eq("review_id", reviewId)
    .eq("reported_by", user.id)
    .single();

  if (existing) {
    // Şikayeti geri al
    await admin.from("reports").delete()
      .eq("review_id", reviewId)
      .eq("reported_by", user.id);

    // Yorumu tekrar göster
    await admin.from("reviews")
      .update({ is_hidden: false })
      .eq("id", reviewId);

    return Response.json({ message: "Şikayet geri alındı.", removed: true });
  }

  // Şikayet ekle
  const { error } = await admin.from("reports").insert({
    review_id: reviewId,
    reported_by: user.id,
    reason: parsed.data.reason,
    status: "pending",
  });

  if (error) {
    console.error("[report] error:", error.message);
    return Response.json({ error: "Şikayet gönderilemedi." }, { status: 500 });
  }

  return Response.json({ message: "Şikayet iletildi.", removed: false });
}
