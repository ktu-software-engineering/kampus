// GET  /api/admin/reports — Bekleyen şikayetler (moderator+)
// PUT  /api/admin/reports/:id — Şikayet durumu güncelle
export async function GET() {
  return Response.json({ message: "Yapım aşamasında" }, { status: 501 });
}
