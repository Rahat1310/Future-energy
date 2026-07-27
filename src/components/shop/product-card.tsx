import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import type { ListedProduct } from "@/lib/shop-filters";

export function ProductCard({ product }: { product: ListedProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-3 transition-all duration-200 hover:border-brand/40 hover:shadow-sm sm:gap-3 sm:rounded-2xl sm:p-5"
    >
      <div className="aspect-square rounded-lg bg-muted sm:rounded-xl" aria-hidden />
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
