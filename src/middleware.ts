import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const DISABLED_ROUTES = [
  "/programmes",
  "/cart",
  "/login",
  "/dashboard",
  "/volunteer",
  "/volunteer/apply",
  "/wayfinding",
  "/icons",
  "/sea",
];

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isDisabledRoute = DISABLED_ROUTES.some(
    (route) =>
      pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isDisabledRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/programmes/:path*",
    "/cart/:path*",
    "/login/:path*",
    "/dashboard/:path*",
    "/volunteer/:path*",
    "/wayfinding/:path*",
    "/icons/:path*",
    "/sea/:path*",
  ],
};