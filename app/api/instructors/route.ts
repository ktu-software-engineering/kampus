import { createClient } from "@/lib/supabase/server";

// Arama sorgusunu slug formatına normalize et (Türkçe karakter + boşluk→tire)
function normalizeQuery(q: string): string {
  return q
    .toLowerCase()
    .replace(/ş/g, "s").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ö/g, "o").replace(/ı/g, "i").replace(/ç/g, "c")
    .replace(/İ/g, "i").replace(/Ş/g, "s").replace(/Ğ/g, "g")
    .replace(/Ü/g, "u").replace(/Ö/g, "o").replace(/Ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "8"), 20);

  if (q.length < 2) {
    return Response.json([]);
  }

  const supabase = await createClient();
  const normalizedQ = normalizeQuery(q);

  // full_name'de orijinal sorgu VEYA slug'da normalize sorgu ara
  const { data, error } = await supabase
    .from("instructors")
    .select("id, full_name, title, slug, average_rating, review_count")
    .or(`full_name.ilike.%${q}%,slug.ilike.%${normalizedQ}%`)
    .eq("is_active", true)
    .order("review_count", { ascending: false })
    .limit(limit);

  if (error) {
    return Response.json([], { status: 500 });
  }

  return Response.json(data ?? []);
}
