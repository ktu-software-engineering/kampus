// GET /api/admin/suggestions — Öneri kuyruğu (moderator+)
// PUT /api/admin/suggestions/:id — Onayla / reddet
export async function GET() {
  return Response.json({ message: "Yapım aşamasında" }, { status: 501 });
}
