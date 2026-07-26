import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function isAdminRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function getRoleFromClaims(sessionClaims: CustomJwtSessionClaims | null) {
  return sessionClaims?.metadata?.role;
}

export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req.nextUrl.pathname)) {
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
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
