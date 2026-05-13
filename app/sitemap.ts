import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = "https://kampuskarne.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Statik sayfalar
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,            lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/hocalar`, lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE}/dersler`, lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE}/suggest`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  // Aktif hoca sayfaları
  const { data: instructors } = await supabase
    .from("instructors")
    .select("slug, created_at")
    .eq("is_active", true)
    .not("slug", "is", null);

  const instructorPages: MetadataRoute.Sitemap = (instructors ?? []).map((ins: any) => ({
    url: `${BASE}/instructors/${ins.slug}`,
    lastModified: new Date(ins.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...instructorPages];
}
