"use client";

import { ShoppingCart } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { cn } from "@/lib/utils";

type CartButtonProps = {
  className?: string;
  /** When the homepage header is over the hero image. */
  light?: boolean;
};

export function CartButton({ className, light = false }: CartButtonProps) {
  const { itemCount, openCart } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className={cn(
        "relative inline-flex size-9 items-center justify-center rounded-lg transition-colors",
        light
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-muted-foreground hover:bg-muted hover:text-ink",
        className,
      )}
      aria-label={
        itemCount > 0
          ? `Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`
          : "Open cart"
      }
    >
      <ShoppingCart className="size-5" />
      {itemCount > 0 ? (
        <span className="spec-number absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-signal px-1 text-[10px] font-semibold text-ink">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </button>
  );
}
