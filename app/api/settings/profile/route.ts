import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().min(2).max(100),
});

export async function PUT(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Giriş yapmanız gerekiyor." }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz istek." }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from("users")
    .update({ full_name: parsed.data.full_name })
    .eq("id", user.id);

  if (error) return Response.json({ error: "Güncelleme başarısız." }, { status: 500 });

  return Response.json({ message: "Profil güncellendi." });
}
