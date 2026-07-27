import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

/**
 * Next.js 16 uses `src/proxy.ts` (not `middleware.ts`) for this project.
 * Matcher is intentionally narrow so public catalog/search/product browsing
 * never runs Clerk middleware — see project.md §8.
 */

function isAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function getRoleFromClaims(sessionClaims: CustomJwtSessionClaims | null) {
  return sessionClaims?.metadata?.role;
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Admin-only gate — other matched routes still get Clerk session context
  // for server `auth()` on checkout/orders/sign-in without protecting public pages.
  if (!isAdminRoute(pathname)) {
    return;
  }

  const { userId, sessionClaims } = await auth();
  const role = getRoleFromClaims(sessionClaims);

  if (!userId || (role !== "admin" && role !== "dealer")) {
    return NextResponse.redirect(new URL("/", req.url));
  }
});

export const config = {
  matcher: [
    "/checkout",
    "/checkout/(.*)",
    "/orders",
    "/orders/(.*)",
    "/account",
    "/account/(.*)",
    "/admin",
    "/admin/(.*)",
    "/sign-in",
    "/sign-in/(.*)",
    "/sign-up",
    "/sign-up/(.*)",
  ],
};
