import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "__session";

// 需要登入才能訪問的路由
const PROTECTED_ROUTES = ["/practice"];

// 已登入時應 redirect 的路由（避免重複登入）
const AUTH_ROUTES = ["/login", "/signup"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // 受保護路由：無 session cookie → redirect 到 /login
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 認證頁面：有 session cookie → redirect 到 /practice
  if (isAuthRoute && sessionCookie) {
    return NextResponse.redirect(new URL("/practice", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 匹配所有路徑，除了：
     * - api (API routes)
     * - _next/static (靜態檔案)
     * - _next/image (圖片優化)
     * - favicon.ico (圖標)
     * - 任何帶有副檔名的檔案
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
