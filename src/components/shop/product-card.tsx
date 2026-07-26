import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import type { ListedProduct } from "@/lib/shop-filters";

export function ProductCard({ product }: { product: ListedProduct }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-brand/40"
    >
      <div className="aspect-square rounded-xl bg-muted" aria-hidden />
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium text-ink">{product.name}</h3>
        {product.keySpec ? (
          <span className="spec-number text-sm text-brand">{product.keySpec}</span>
        ) : null}
        <span className="spec-number text-base font-semibold text-ink">
          {formatPrice(product.price)}
        </span>
      </div>
    </Link>
  );
}
