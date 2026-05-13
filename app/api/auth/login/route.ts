import { createAdminClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { z } from "zod";
import { cookies } from "next/headers";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const LOCK_THRESHOLD = 5;
const LOCK_MINUTES = 15;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Lütfen geçerli bir e-posta adresi girin." }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = createAdminClient();

  // Hesap var mı + kilitli mi kontrol et
  const { data: profile } = await admin
    .from("users")
    .select("id, locked_until, failed_login_count, created_at, verification_resend_count, last_verification_sent")
    .eq("email", email)
    .single();

  if (!profile) {
    return Response.json(
      { error: "Bu e-posta adresiyle kayıtlı bir hesap bulunamadı." },
      { status: 404 }
    );
  }

  if (profile.locked_until && new Date(profile.locked_until) > new Date()) {
    return Response.json(
      { error: "Hesabın kilitli. 15 dakika sonra tekrar dene." },
      { status: 429 }
    );
  }

  // Giriş dene
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("email not confirmed")) {
      const now = Date.now();
      const OTP_EXPIRY_MS = 3600 * 1000; // Supabase OTP süresi: 1 saat
      const RESEND_INTERVAL_MS = 8 * 3600 * 1000; // 8 saatte bir (günde 3 kez)
      const MAX_RESENDS_PER_DAY = 3;

      const registeredAt = profile?.created_at ? new Date(profile.created_at).getTime() : 0;
      const lastSent = profile?.last_verification_sent ? new Date(profile.last_verification_sent).getTime() : 0;
      const resendCount = profile?.verification_resend_count ?? 0;

      const originalLinkExpired = now - registeredAt > OTP_EXPIRY_MS;
      const enoughTimeSinceLastSend = now - lastSent > RESEND_INTERVAL_MS;
      const underDailyLimit = resendCount < MAX_RESENDS_PER_DAY;

      let extraMsg = "";

      if (originalLinkExpired && enoughTimeSinceLastSend && underDailyLimit) {
        // Yeni doğrulama maili gönder
        await supabase.auth.resend({ type: "signup", email });
        await admin.from("users").update({
          last_verification_sent: new Date().toISOString(),
          verification_resend_count: resendCount + 1,
        }).eq("email", email);
        const nextResendHours = 8;
        extraMsg = ` Tekrar doğrulama maili attık. ${nextResendHours} saat sonra tekrar doğrulama maili alabilirsin.`;
      } else if (!originalLinkExpired) {
        extraMsg = " İlk kayıt olurken gönderilen link hâlâ geçerli, gelen kutunu kontrol et.";
      } else if (!enoughTimeSinceLastSend && lastSent > 0) {
        const remainingMs = RESEND_INTERVAL_MS - (now - lastSent);
        const remainingHours = Math.ceil(remainingMs / 3600000);
        extraMsg = ` ${remainingHours} saat sonra tekrar doğrulama maili alabilirsin.`;
      }

      return Response.json({
        error: `E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et.${extraMsg}`,
      }, { status: 403 });
    }

    // Başarısız giriş sayacını artır
    if (profile) {
      const newCount = (profile.failed_login_count ?? 0) + 1;
      const updates: Record<string, unknown> = { failed_login_count: newCount };
      if (newCount >= LOCK_THRESHOLD) {
        updates.locked_until = new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString();
        updates.failed_login_count = 0;
      }
      await admin.from("users").update(updates).eq("email", email);
    }

    return Response.json({ error: "Şifreniz hatalı. Lütfen tekrar deneyin." }, { status: 401 });
  }

  // Başarılı giriş — sayacı sıfırla
  await admin
    .from("users")
    .update({ failed_login_count: 0, locked_until: null })
    .eq("id", data.user.id);

  return Response.json({ message: "Giriş başarılı." });
}
