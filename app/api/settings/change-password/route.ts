import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { z } from "zod";

const schema = z.object({
  current_password: z.string().min(1),
  new_password: z.string().min(8),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });

  const { current_password, new_password } = parsed.data;

  // Mevcut şifreyi doğrula
  const cookieStore = await cookies();
  const testClient = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );

  const { error: signInError } = await testClient.auth.signInWithPassword({
    email: user.email!,
    password: current_password,
  });

  if (signInError) {
    return Response.json({ error: "Mevcut şifreniz hatalı." }, { status: 400 });
  }

  // Yeni şifreyi güncelle
  const { error: updateError } = await supabase.auth.updateUser({ password: new_password });

  if (updateError) {
    return Response.json({ error: "Şifre güncellenemedi." }, { status: 500 });
  }

  return Response.json({ message: "Şifre başarıyla güncellendi." });
}
