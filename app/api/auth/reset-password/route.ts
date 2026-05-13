import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(8).max(32),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json({ error: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
  }

  const { password } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error("[reset-password] error:", error.message);
    return Response.json({ error: "Şifre güncellenemedi. Link geçersiz veya süresi dolmuş olabilir." }, { status: 400 });
  }

  return Response.json({ message: "Şifre başarıyla güncellendi." });
}
