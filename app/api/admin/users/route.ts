import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data: profile } = await admin.from("users").select("role").eq("id", user.id).single();
  if (!["admin", "moderator"].includes(profile?.role ?? "")) return null;
  return user;
}

// GET — kullanıcı listesi (arama + sayfalama)
export async function GET(req: Request) {
  if (!await checkAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const per = 20;
  const from = (page - 1) * per;

  const admin = createAdminClient();
  let query = admin
    .from("users")
    .select("id, full_name, email, role, is_verified, created_at", { count: "exact" });

  if (q) query = query.or(`full_name.ilike.%${q}%,email.ilike.%${q}%`);
  query = query.order("created_at", { ascending: false }).range(from, from + per - 1);

  const { data, count } = await query;
  return Response.json({ users: data ?? [], total: count ?? 0 });
}

// PUT — kullanıcı güncelle (ad, rol, şifre)
const putSchema = z.object({
  id: z.string(),
  full_name: z.string().min(2).optional(),
  role: z.enum(["student", "professor", "moderator", "admin"]).optional(),
  password: z.string().min(8).optional(),
});

export async function PUT(req: Request) {
  if (!await checkAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz veri." }, { status: 400 });

  const { id, full_name, role, password } = parsed.data;
  const admin = createAdminClient();

  if (full_name || role) {
    const updates: Record<string, string> = {};
    if (full_name) updates.full_name = full_name;
    if (role) updates.role = role;
    await admin.from("users").update(updates).eq("id", id);
  }

  if (password) {
    await admin.auth.admin.updateUserById(id, { password });
  }

  return Response.json({ message: "Güncellendi." });
}

// DELETE — kullanıcı ve tüm verileri sil
export async function DELETE(req: Request) {
  if (!await checkAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 403 });

  const { id } = await req.json().catch(() => ({}));
  if (!id) return Response.json({ error: "ID gerekli." }, { status: 400 });

  const admin = createAdminClient();
  // Cascade: reviews → auth user → public users (FK cascade)
  await admin.from("reviews").delete().eq("user_id", id);
  await admin.from("review_replies").delete().eq("user_id", id);
  await admin.auth.admin.deleteUser(id);

  return Response.json({ message: "Kullanıcı silindi." });
}
