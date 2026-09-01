"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, ShoppingCart, Sparkles, Tag, Zap } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import { useCart } from "@/components/cart/cart-context";
import type { ListedProduct } from "@/lib/shop-filters";
import { cn } from "@/lib/utils";

/**
 * Determines if the price shown is a per-watt solar unit price.
 * Per-watt prices are very small (< 100), so we can detect them and
 * display the "/ Watt" suffix instead of treating them as BDT totals.
 */
function isPricePerWatt(product: ListedProduct): boolean {
  return product.price < 100;
}

/** Format the sale price string for a card */
function formatCardPrice(product: ListedProduct): string {
  if (isPricePerWatt(product)) {
    return formatPrice(product.price) + " / Watt";
  }
  return formatPrice(product.price);
}

export function ProductCard({ product }: { product: ListedProduct }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const hasDiscount =
    product.originalPrice != null && product.originalPrice > product.price;

  const discountPct = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  const isPerWatt = isPricePerWatt(product);
  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const variantId = product.variantId || `var-${product.id}`;
    const variantSku = product.variantSku || product.id.toUpperCase();
    const stock = product.stock ?? 10;

    const result = add({
      productId: product.id,
      variantId,
      productSlug: product.slug,
      productName: product.name,
      variantSku,
      keySpec: product.keySpec,
      price: product.price,
      stock,
      quantity: 1,
      image: product.image,
    });

    if (result.ok) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1600);
    }
  };

  return (
    <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-surface p-2.5 sm:p-3.5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-xl hover:shadow-brand/5 dark:bg-card dark:border-border/60">
      {/* Top energy glow line on hover */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brand/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Main Clickable Area / Top Content */}
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {/* Product Image Stage */}
        <Link
          href={`/products/${product.slug}`}
          className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/40 bg-gradient-to-b from-neutral-50 via-white to-neutral-100/60 p-2 dark:from-neutral-900/60 dark:via-neutral-900/40 dark:to-neutral-950/60 flex items-center justify-center"
        >
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-contain p-1.5 transition-transform duration-500 ease-out group-hover:scale-105 drop-shadow-xs"
            />
          ) : (
            <div className="h-full w-full bg-muted/60 rounded-lg flex items-center justify-center" aria-hidden>
              <Zap className="size-8 text-muted-foreground/30" />
            </div>
          )}

          {/* Badges Overlay */}
          <div className="pointer-events-none absolute inset-x-2 top-2 flex items-start justify-between gap-1.5">
            {/* Main Badge / Status */}
            <div>
              {product.badge ? (
                <span
                  className={cn(
                    "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide shadow-sm select-none",
                    product.badge.toLowerCase() === "sale"
                      ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                      : "bg-gradient-to-r from-emerald-600 to-teal-600 text-white",
                  )}
                >
                  {product.badge.toLowerCase() === "sale" ? (
                    <Tag className="size-2.5" aria-hidden />
                  ) : (
                    <Sparkles className="size-2.5 fill-white" aria-hidden />
                  )}
                  {product.badge}
                </span>
              ) : !isOutOfStock ? (
                <span className="flex items-center gap-1 rounded-full bg-surface/90 px-2 py-0.5 text-[10px] font-medium text-emerald-700 shadow-xs backdrop-blur-xs border border-border/60 dark:bg-card/90 dark:text-emerald-400 select-none">
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock
                </span>
              ) : null}
            </div>

            {/* Discount % Pill */}
            {hasDiscount && discountPct > 0 && (
              <span className="flex items-center gap-0.5 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-xs select-none">
                -{discountPct}%
              </span>
            )}
          </div>

          {/* Hover Quick Hint */}
          <div className="absolute inset-x-0 bottom-0 py-1.5 px-2.5 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-between text-white text-[11px] font-medium">
            <span>View Details</span>
            <ArrowRight className="size-3" />
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex flex-col gap-1.5">
          {/* Key Spec Chip */}
          {product.keySpec ? (
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1 rounded-md bg-brand/8 px-2 py-0.5 text-[11px] font-mono font-semibold text-brand border border-brand/15">
                <Zap className="size-2.5 text-brand" />
                {product.keySpec}
              </span>
            </div>
          ) : null}

          {/* Product Name */}
          <Link href={`/products/${product.slug}`} className="group/title">
            <h3 className="line-clamp-2 text-xs font-semibold text-ink sm:text-sm leading-snug transition-colors group-hover/title:text-brand">
              {product.name}
            </h3>
          </Link>

          {/* Price Block */}
          <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
            <span className="spec-number text-sm font-bold text-ink sm:text-base">
              {formatCardPrice(product)}
            </span>
            {hasDiscount && !isPerWatt && (
              <span className="spec-number text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice!)}
              </span>
            )}
          </div>

          {/* Solar Panel Note */}
          {isPerWatt && (
            <span className="text-[10px] text-muted-foreground">
              Priced per watt &bull; see panel totals on page
            </span>
          )}
        </div>
      </div>

      {/* Card Action Button */}
      <div className="mt-3 pt-2 border-t border-border/50">
        {isOutOfStock ? (
          <button
            type="button"
            disabled
            className="w-full h-8 sm:h-8.5 rounded-xl text-xs font-medium bg-muted text-muted-foreground cursor-not-allowed select-none"
          >
            Out of Stock
          </button>
        ) : isPerWatt ? (
          <Link
            href={`/products/${product.slug}`}
            className="w-full h-8 sm:h-8.5 rounded-xl text-xs font-semibold bg-surface border border-brand/30 text-brand hover:bg-brand/5 hover:border-brand transition-all flex items-center justify-center gap-1.5 shadow-2xs select-none"
          >
            <span>View Options</span>
            <ArrowRight className="size-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className={cn(
              "relative w-full h-8 sm:h-8.5 rounded-xl text-xs sm:text-[13px] font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs select-none cursor-pointer",
              added
                ? "bg-emerald-600 text-white scale-[0.98]"
                : "bg-brand text-white hover:bg-brand/90 active:scale-[0.98]",
            )}
          >
            {added ? (
              <>
                <Check className="size-3.5 stroke-[2.5]" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="size-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}