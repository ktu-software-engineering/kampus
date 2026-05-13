import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  full_name: z.string().min(2).max(100),
  university_id: z.string().min(1),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    const fields = parsed.error.issues.map(i => i.path[0]);
    if (fields.includes("password")) {
      return Response.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
    }
    return Response.json({ error: "Lütfen tüm alanları eksiksiz doldurun." }, { status: 400 });
  }

  const { email, password, full_name, university_id } = parsed.data;

  // Email zaten kayıtlı mı kontrol et
  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (existing) {
    return Response.json({ error: "Bu e-posta adresi zaten kayıtlı." }, { status: 409 });
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

  // Trigger users tablosunu oluşturdu — full_name ve university_id'yi güncelle
  if (data.user) {
    await admin.from("users").update({ full_name, university_id }).eq("id", data.user.id);
  }

  return Response.json({ message: "Kayıt başarılı. E-postanı kontrol et." }, { status: 201 });
}
