import { createAdminClient } from "@/lib/supabase/server";
import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  suggestion_id: z.string().min(1),
  message: z.string().min(1).max(2000),
  type: z.enum(["suggestion", "report"]),
});

export async function POST(req: Request) {
  // Admin kontrolü
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: "Yetkisiz." }, { status: 401 });

  const admin = createAdminClient();
  const { data: profile } = await admin.from("users").select("role").eq("id", user.id).single();
  if (!["admin", "moderator"].includes(profile?.role ?? "")) {
    return Response.json({ error: "Yetkisiz." }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return Response.json({ error: "Geçersiz veri." }, { status: 400 });

  const { suggestion_id, message, type } = parsed.data;

  // Göndericiyi bul
  const table = type === "report" ? "reports" : "suggestions";
  const userIdField = type === "report" ? "reported_by" : "suggested_by";

  const { data: item } = await admin
    .from(table)
    .select(`${userIdField}, users:${userIdField}(email, full_name)`)
    .eq("id", suggestion_id)
    .single();

  if (!item) return Response.json({ error: "Kayıt bulunamadı." }, { status: 404 });

  const recipientUser = (item as any).users;
  if (!recipientUser?.email) {
    return Response.json({ error: "Kullanıcı e-postası bulunamadı." }, { status: 400 });
  }

  // Resend ile mail gönder
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error: mailError } = await resend.emails.send({
    from: "KampusKarne <hosgeldin@kampuskarne.com>",
    to: recipientUser.email,
    subject: "KampusKarne — Geri Bildiriminize Yanıt",
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 500px; margin: 0 auto; background: #ffffff; border: 1px solid #edeae2; border-radius: 12px; overflow: hidden;">
        <div style="background: #06283a; padding: 24px 32px;">
          <p style="color: #f0c875; font-size: 18px; font-weight: 700; margin: 0;">KampusKarne</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #06283a; font-size: 20px; margin-top: 0;">Geri Bildiriminize Yanıt</h2>
          <p style="color: #4b5563; line-height: 1.6;">Merhaba${recipientUser.full_name ? ` ${recipientUser.full_name}` : ""},</p>
          <p style="color: #4b5563; line-height: 1.6;">${message.replace(/\n/g, "<br>")}</p>
          <hr style="border: none; border-top: 1px solid #edeae2; margin: 24px 0;" />
          <p style="color: #9ca3af; font-size: 13px;">KampusKarne Ekibi</p>
        </div>
      </div>
    `,
  });

  if (mailError) {
    console.error("[reply] mail error:", mailError);
    return Response.json({ error: "Mail gönderilemedi." }, { status: 500 });
  }

  return Response.json({ message: "Yanıt gönderildi." });
}
