import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export type UserRole = "customer" | "dealer" | "admin";

/**
 * Prefer `auth()` (local JWT / session claims) over `currentUser()` (network
 * round-trip to Clerk). Role lives in the customized session token
 * (`metadata.role`). There are no `currentUser()` calls in this codebase —
 * add one only if a page needs full profile fields (email, name, image).
 */
export async function getUserRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (role === "admin" || role === "dealer" || role === "customer") {
    return role;
  }

  return "customer";
}

export function isStaffRole(role: UserRole): boolean {
  return role === "admin" || role === "dealer";
}

/** Defense-in-depth for /admin pages — redirect if not staff (in addition to proxy.ts). */
export async function requireStaffPage(): Promise<void> {
  const { userId } = await auth();
  const role = await getUserRole();
  if (!userId || !isStaffRole(role)) {
    redirect("/");
  }
}

/** Defense-in-depth for admin server actions. */
export async function requireStaffAction(): Promise<
  { ok: true } | { ok: false; error: string }
> {
  const { userId } = await auth();
  const role = await getUserRole();
  if (!userId || !isStaffRole(role)) {
    return { ok: false, error: "Unauthorized." };
  }
  return { ok: true };
}
