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
    return Response.json({ error: "Geçersiz istek" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = createAdminClient();

  // Hesap kilitli mi kontrol et
  const { data: profile } = await admin
    .from("users")
    .select("locked_until, failed_login_count")
    .eq("email", email)
    .single();

  if (profile?.locked_until && new Date(profile.locked_until) > new Date()) {
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
      return Response.json({ error: "E-posta adresin henüz doğrulanmamış. Gelen kutunu kontrol et." }, { status: 403 });
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

    return Response.json({ error: "E-posta veya şifre hatalı." }, { status: 401 });
  }

  // Başarılı giriş — sayacı sıfırla
  await admin
    .from("users")
    .update({ failed_login_count: 0, locked_until: null })
    .eq("id", data.user.id);

  return Response.json({ message: "Giriş başarılı." });
}
