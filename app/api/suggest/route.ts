import { createClient, createAdminClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["instructor", "course", "report"]),
  data: z.record(z.string(), z.unknown()),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();
  const user = authData.user;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz veri." }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from("suggestions").insert({
    type: parsed.data.type,
    data: parsed.data.data,
    suggested_by: user?.id ?? null,
    status: "pending",
    vote_count: 0,
  });

  if (error) {
    console.error("[suggest]", error.message);
    return Response.json({ error: "Gönderilemedi." }, { status: 500 });
  }

  return Response.json({ message: "Öneri iletildi." }, { status: 201 });
}
