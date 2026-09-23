import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/utils/constants";

/**
 * First line of defence, running on the Edge before a request reaches a
 * protected page or API route. This is intentionally NOT the only check -
 * every protected Server Component also calls requireRole() (see
 * lib/auth/guards.js), and every mutating API route re-checks the session
 * itself. Uses Web Crypto (via lib/auth/session.js) rather than Node's
 * `crypto` module, since Buffer / node:crypto are not available on Edge.
 */
const ROLE_BY_PREFIX = { "/customer": "CUSTOMER", "/analyst": "ANALYST", "/admin": "ADMIN" };
const PUBLIC_API_PATHS = new Set([
  "/api/auth/login",
  "/api/auth/register",
  "/api/auth/logout",
  "/api/auth/forgot-password",
]);

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await verifySessionToken(token);

  // Protected API routes: everything under /api/ except the public auth endpoints.
  if (pathname.startsWith("/api/")) {
    if (PUBLIC_API_PATHS.has(pathname) || session) return NextResponse.next();
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  // Signed-in users don't need the auth pages again.
  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role] ?? "/", request.url));
  }

  const prefix = Object.keys(ROLE_BY_PREFIX).find((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!prefix) return NextResponse.next();

  if (!session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (session.role !== ROLE_BY_PREFIX[prefix]) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/customer/:path*", "/analyst/:path*", "/admin/:path*", "/login", "/register", "/api/:path*"],
};
