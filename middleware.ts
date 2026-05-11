// Route koruması — her istekte çalışır
// - /admin/* → moderator veya admin rolü zorunlu
// - /professor/dashboard → professor rolü zorunlu
// - Giriş yapılmamışsa /login sayfasına yönlendir
import { NextResponse } from "next/server";

export function middleware() {
  // Yapım aşamasında — Supabase Auth session kontrolü buraya gelecek
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/professor/:path*"],
};
