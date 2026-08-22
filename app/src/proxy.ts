import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "fl_session";

const PUBLIC_PATHS = [
  "/",
  "/login",
  "/signup",
  "/api/auth/",
  "/how-this-works",
  "/manifesto",
];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) =>
    p.endsWith("/") ? pathname.startsWith(p) : pathname === p
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static assets and internal Next.js routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Allow public paths through
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  // Redirect to login if no session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
