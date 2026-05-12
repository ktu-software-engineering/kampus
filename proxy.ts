import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isProfessorRoute = pathname.startsWith("/professor");
  const isProtectedRoute = pathname.startsWith("/settings") || pathname.startsWith("/suggest");
  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

  // Giriş yapmış kullanıcıyı login/register'dan ana sayfaya yönlendir
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Giriş gerektiren sayfalarda oturum yoksa login'e yönlendir
  if (!user && (isProtectedRoute || isAdminRoute || isProfessorRoute)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Admin ve profesör rotaları için rol kontrolü
  if (user && (isAdminRoute || isProfessorRoute)) {
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role ?? "";

    if (isAdminRoute && !["admin", "moderator"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (isProfessorRoute && role !== "professor") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/professor/:path*",
    "/settings/:path*",
    "/suggest",
    "/login",
    "/register",
  ],
};
