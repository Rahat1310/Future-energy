"use client";

import Link from "next/link";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import { Package } from "lucide-react";

/** Account shortcuts next to Clerk UserButton (orders + admin when staff). */
export function AccountLinks({ light = false }: { light?: boolean }) {
  const { isSignedIn } = useAuth();
  const { user } = useUser();

  if (!isSignedIn) return null;

  const role = user?.publicMetadata?.role;
  const isStaff = role === "admin" || role === "dealer";
  const linkClass = light
    ? "text-white/80 hover:text-white"
    : "text-muted-foreground hover:text-ink";

  return (
    <div className="hidden items-center gap-3 sm:flex">
      <Link
        href="/orders"
        className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${linkClass}`}
      >
        <Package className="size-4" />
        My orders
      </Link>
      {isStaff ? (
        <Link
          href="/admin"
          className={`text-sm font-medium transition-colors ${linkClass}`}
        >
          Admin
        </Link>
      ) : null}
      <UserButton />
    </div>
  );
}
