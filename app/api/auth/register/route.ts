import { createClient } from "@/lib/supabase/server";
import { isKtuStudentEmail } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(2).max(100),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const { email, password, full_name } = parsed.data;

  if (!isKtuStudentEmail(email)) {
    return Response.json(
      { error: "Sadece KTÜ öğrenci e-postası kabul edilir. (örnek: 123456789@ogr.ktu.edu.tr)" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name },
    },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return Response.json({ error: "Bu e-posta adresi zaten kayıtlı." }, { status: 409 });
    }
    if (error.message.toLowerCase().includes("rate limit")) {
      return Response.json({ error: "Çok fazla deneme yapıldı. Lütfen birkaç dakika bekleyip tekrar dene." }, { status: 429 });
    }
    console.error("[register] signUp error:", error.message);
    return Response.json({ error: "Kayıt sırasında hata oluştu." }, { status: 500 });
  }

  // Trigger users tablosunu oluşturdu — full_name'i güncelle
  if (data.user) {
    const { createAdminClient } = await import("@/lib/supabase/server");
    const admin = createAdminClient();
    await admin.from("users").update({ full_name }).eq("id", data.user.id);
  }

  return Response.json({ message: "Kayıt başarılı. E-postanı kontrol et." }, { status: 201 });
}
