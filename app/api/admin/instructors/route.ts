import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data } = await admin.from("users").select("role").eq("id", user.id).single();
  return ["admin", "moderator"].includes(data?.role ?? "") ? user : null;
}

// GET — hoca listesi (arama + sayfalama)
export async function GET(req: Request) {
  if (!await checkAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1"));
  const per = 20;
  const from = (page - 1) * per;

  const admin = createAdminClient();
  let query = admin
    .from("instructors")
    .select("id, full_name, title, slug, average_rating, review_count, is_active", { count: "exact" });

  if (q) query = query.ilike("full_name", `%${q}%`);
  query = query.order("full_name").range(from, from + per - 1);

  const { data, count } = await query;
  return Response.json({ instructors: data ?? [], total: count ?? 0 });
}

// PUT — hoca düzenle (ad, başlık) veya gizle/göster
const putSchema = z.object({
  id: z.string(),
  full_name: z.string().min(2).optional(),
  title: z.string().optional(),
  is_active: z.boolean().optional(),
});

export async function PUT(req: Request) {
  if (!await checkAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = putSchema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz veri." }, { status: 400 });

  const { id, ...updates } = parsed.data;
  const admin = createAdminClient();

  // Slug'ı da güncelle (ad değiştiyse)
  if (updates.full_name) {
    const slug = generateSlug(updates.full_name);
    // Çakışma kontrolü
    const { data: existing } = await admin
      .from("instructors")
      .select("id")
      .eq("slug", slug)
      .neq("id", id)
      .single();
    (updates as any).slug = existing ? `${slug}-${id.slice(0, 4)}` : slug;
  }

  await admin.from("instructors").update(updates).eq("id", id);
  return Response.json({ message: "Güncellendi." });
}

function generateSlug(name: string): string {
  return name.toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ö/g, "o").replace(/ı/g, "i").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim().replace(/\s+/g, "-");
}
