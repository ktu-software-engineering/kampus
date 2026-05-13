import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";

async function checkAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const admin = createAdminClient();
  const { data } = await admin.from("users").select("role").eq("id", user.id).single();
  return ["admin", "moderator"].includes(data?.role ?? "") ? user : null;
}

export async function GET(req: Request) {
  if (!await checkAdmin()) return Response.json([], { status: 403 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") ?? "reports";
  const admin = createAdminClient();

  if (type === "suggestions") {
    const { data } = await admin
      .from("suggestions")
      .select("id, type, data, vote_count, status, created_at, users:suggested_by(email, full_name)")
      .order("created_at", { ascending: false });
    return Response.json(data ?? []);
  }

  const { data } = await admin
    .from("reports")
    .select("id, reason, status, created_at, reviews(id, comment, is_hidden, instructors(full_name, slug), courses(code, name))")
    .order("created_at", { ascending: false });

  return Response.json(data ?? []);
}

export async function PUT(req: Request) {
  if (!await checkAdmin()) return Response.json({ error: "Yetkisiz." }, { status: 403 });

  const { id, status, type } = await req.json().catch(() => ({}));
  if (!id || !status) return Response.json({ error: "Eksik veri." }, { status: 400 });

  const admin = createAdminClient();

  if (type === "suggestion") {
    await admin.from("suggestions").update({ status }).eq("id", id);
  } else {
    await admin.from("reports").update({ status }).eq("id", id);
    if (status === "resolved") {
      const { data: report } = await admin.from("reports").select("review_id").eq("id", id).single();
      if (report?.review_id) await admin.from("reviews").update({ is_hidden: false }).eq("id", report.review_id);
    }
  }

  return Response.json({ message: "Güncellendi." });
}
