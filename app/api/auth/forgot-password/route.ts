import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Lütfen geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  const { email } = parsed.data;
  const admin = createAdminClient();

  // Kullanıcı var mı ve doğrulanmış mı kontrol et
  const { data: profile } = await admin
    .from("users")
    .select("is_verified")
    .eq("email", email)
    .single();

  if (!profile) {
    return Response.json(
      { error: "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı." },
      { status: 404 }
    );
  }

  if (!profile.is_verified) {
    return Response.json(
      { error: "Mail adresiniz henüz doğrulanmamış. Lütfen önce gelen kutunuzdaki onay linkine tıklayın." },
      { status: 403 }
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/sifre-sifirla`,
  });

  if (error) {
    console.error("[forgot-password] error:", error.message);
    return Response.json({ error: "Mail gönderilemedi. Lütfen tekrar dene." }, { status: 500 });
  }

  return Response.json({ message: "Sıfırlama linki gönderildi." });
}
