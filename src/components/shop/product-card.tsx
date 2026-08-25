import Link from "next/link";
import { Star, Tag } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import type { ListedProduct } from "@/lib/shop-filters";

/**
 * Determines if the price shown is a per-watt solar unit price.
 * Per-watt prices are very small (< 100), so we can detect them and
 * display the "/ Watt" suffix instead of treating them as BDT totals.
 */
function isPricePerWatt(product: ListedProduct): boolean {
  // Per-watt prices are tiny (25-30 BDT), whereas all other products are > 900
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
  const hasDiscount =
    product.originalPrice != null && product.originalPrice > product.price;

  const discountPct = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100,
      )
    : 0;

  const isPerWatt = isPricePerWatt(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="relative flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 transition-all duration-200 hover:border-brand/40 hover:shadow-sm sm:gap-3 sm:rounded-2xl sm:p-5"
    >
      <div className="relative aspect-square rounded-lg sm:rounded-xl overflow-hidden">
        {/* Image placeholder */}
        <div className="absolute inset-0 bg-muted" aria-hidden />
        {/* Badge overlay */}
        {product.badge && (
          <span
            className={[
              "absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide shadow-md select-none",
              product.badge.toLowerCase() === "sale"
                ? "bg-gradient-to-r from-red-500 to-rose-500 text-white"
                : "bg-gradient-to-r from-amber-400 to-orange-500 text-white",
            ].join(" ")}
          >
            {product.badge.toLowerCase() === "sale" ? (
              <Tag className="size-2.5" aria-hidden />
            ) : (
              <Star className="size-2.5 fill-white" aria-hidden />
            )}
            {product.badge}
          </span>
        )}

        {/* Discount % pill */}
        {hasDiscount && discountPct > 0 && (
          <span className="absolute top-2 right-2 z-10 flex items-center gap-0.5 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white shadow-md select-none">
            -{discountPct}%
          </span>
        )}
      </div>

      <div className="flex flex-col gap-0.5 sm:gap-1">
        <h3 className="line-clamp-2 text-xs font-medium text-ink sm:text-sm">
          {product.name}
        </h3>
        {product.keySpec ? (
          <span className="spec-number text-xs text-brand sm:text-sm">
            {product.keySpec}
          </span>
        ) : null}

        {/* Price row */}
        <div className="flex flex-wrap items-baseline gap-1.5 mt-0.5">
          <span className="spec-number text-sm font-semibold text-ink sm:text-base">
            {formatCardPrice(product)}
          </span>
          {hasDiscount && !isPerWatt && (
            <span className="spec-number text-xs text-muted-foreground line-through sm:text-sm">
              {formatPrice(product.originalPrice!)}
            </span>
          )}
        </div>

        {/* Solar panel estimated total note */}
        {isPerWatt && (
          <span className="text-[10px] text-muted-foreground sm:text-xs">
            Priced per watt - see panel total on detail page
          </span>
        )}
      </div>
    </Link>
  );
}