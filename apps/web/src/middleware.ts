import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, AUTH_REFRESH_COOKIE_NAME } from "@/lib/auth-constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(AUTH_REFRESH_COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  if (!token && !refreshToken && pathname.startsWith("/profile")) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if ((token || refreshToken) && (pathname.startsWith("/login") || pathname.startsWith("/register"))) {
    const profileUrl = new URL("/profile", request.url);
    return NextResponse.redirect(profileUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/login", "/register"],
};
