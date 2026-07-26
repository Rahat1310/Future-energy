"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { useCart } from "@/components/cart/cart-context";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/catalog";
import { cn } from "@/lib/utils";

export function CartDrawer() {
  const {
    items,
    itemCount,
    total,
    isOpen,
    closeCart,
    remove,
    updateQuantity,
  } = useCart();

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={cn(
          "fixed inset-0 z-50 bg-ink/40 transition-opacity",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-medium text-ink">Cart</h2>
            <p className="text-sm text-muted-foreground">
              {itemCount === 0
                ? "No items yet"
                : `${itemCount} item${itemCount === 1 ? "" : "s"}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-ink"
            aria-label="Close cart"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground">Your cart is empty.</p>
              <Button
                variant="outline"
                nativeButton={false}
                onClick={closeCart}
                render={<Link href="/shop">Browse products</Link>}
              />
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li
                  key={item.variantId}
                  className="flex gap-3 rounded-2xl border border-border bg-surface p-3"
                >
                  <div
                    className="size-20 shrink-0 rounded-xl bg-muted"
                    aria-hidden
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={`/products/${item.productSlug}`}
                          onClick={closeCart}
                          className="line-clamp-2 text-sm font-medium text-ink hover:text-brand"
                        >
                          {item.productName}
                        </Link>
                        {item.keySpec ? (
                          <p className="spec-number mt-0.5 text-xs text-brand">
                            {item.keySpec}
                          </p>
                        ) : (
                          <p className="spec-number mt-0.5 text-xs text-muted-foreground">
                            {item.variantSku}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.variantId)}
                        className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-ink"
                        aria-label={`Remove ${item.productName}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-lg border border-border">
                        <button
                          type="button"
                          className="inline-flex size-8 items-center justify-center text-ink hover:bg-muted disabled:opacity-40"
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="spec-number min-w-8 text-center text-sm text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          className="inline-flex size-8 items-center justify-center text-ink hover:bg-muted disabled:opacity-40"
                          disabled={item.quantity >= item.stock}
                          onClick={() =>
                            updateQuantity(item.variantId, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <span className="spec-number text-sm font-semibold text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <div className="border-t border-border px-5 py-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Subtotal</span>
              <span className="spec-number text-lg font-semibold text-ink">
                {formatPrice(total)}
              </span>
            </div>
            <Button
              size="lg"
              className="h-12 w-full text-base"
              nativeButton={false}
              onClick={closeCart}
              render={<Link href="/checkout">Checkout</Link>}
            />
          </div>
        ) : null}
      </aside>
    </>
  );
}
