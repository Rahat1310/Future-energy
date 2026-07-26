import { auth } from "@clerk/nextjs/server";

export type UserRole = "customer" | "dealer" | "admin";

export async function getUserRole(): Promise<UserRole> {
  const { sessionClaims } = await auth();
  const role = sessionClaims?.metadata?.role;

  if (role === "admin" || role === "dealer" || role === "customer") {
    return role;
  }

  return "customer";
}
