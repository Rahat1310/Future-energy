import Link from "next/link";
import { Star, Tag } from "lucide-react";
import { formatPrice } from "@/lib/catalog";
import type { ListedProduct } from "@/lib/shop-filters";

export function ProductCard({ product }: { product: ListedProduct }) {
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
      </div>
      <div className="flex flex-col gap-0.5 sm:gap-1">
        <h3 className="line-clamp-2 text-xs font-medium text-ink sm:text-sm">{product.name}</h3>
        {product.keySpec ? (
          <span className="spec-number text-xs text-brand sm:text-sm">{product.keySpec}</span>
        ) : null}
        <span className="spec-number text-sm font-semibold text-ink sm:text-base">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}
