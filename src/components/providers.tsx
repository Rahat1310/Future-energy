"use client";

import { CartProvider } from "@/components/cart/cart-context";
import dynamic from "next/dynamic";

/** Cart drawer is below-the-fold UX — keep it out of the first-paint JS chunk. */
const CartDrawer = dynamic(
  () =>
    import("@/components/cart/cart-drawer").then((mod) => mod.CartDrawer),
  { ssr: false },
);

/** Root client providers — keep cart above marketing/shop so state survives navigation. */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
