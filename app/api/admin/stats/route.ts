import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Yetkisiz." }, { status: 401 });

  const admin = createAdminClient();

  const [
    { count: userCount },
    { count: reviewCount },
    { count: pendingReports },
    { count: newSuggestions },
  ] = await Promise.all([
    admin.from("users").select("*", { count: "exact", head: true }),
    admin.from("reviews").select("*", { count: "exact", head: true }).eq("is_hidden", false),
    admin.from("reports").select("*", { count: "exact", head: true }).eq("status", "pending"),
    admin.from("suggestions").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  // Son 7 günün yorum sayısı (grafik verisi)
  const { data: chartRows } = await admin
    .from("reviews")
    .select("created_at")
    .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

  const dayCounts: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dayCounts[d.toISOString().slice(0, 10)] = 0;
  }
  (chartRows ?? []).forEach((r: any) => {
    const day = r.created_at.slice(0, 10);
    if (day in dayCounts) dayCounts[day]++;
  });

  const chart = Object.entries(dayCounts).map(([date, count]) => ({
    date,
    label: new Date(date).toLocaleDateString("tr-TR", { day: "numeric", month: "short" }),
    count,
  }));

  return Response.json({ userCount, reviewCount, pendingReports, newSuggestions, chart });
}
