"use client";

import { useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import type { ListedProduct } from "@/lib/shop-filters";

const PAGE_SIZE = 12;

interface ProductGridProps {
  products: ListedProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;
  const remaining = products.length - visibleCount;

  return (
    <div className="flex flex-col gap-8">
      {/* Grid — 2 cols on mobile, 2 on sm, 3 on xl */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 xl:gap-5">
        {visible.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium text-ink">{visible.length}</span> of{" "}
            <span className="font-medium text-ink">{products.length}</span> products
          </p>
          <button
            type="button"
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl border border-brand/40 bg-surface px-8 py-3 text-sm font-semibold text-ink shadow-sm transition-all duration-200 hover:border-brand hover:bg-brand/5 hover:shadow-md active:scale-[0.98]"
          >
            {/* Animated gradient shimmer on hover */}
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-brand/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            <span className="relative">
              Load {Math.min(remaining, PAGE_SIZE)} more
            </span>
            <svg
              className="relative size-4 transition-transform duration-200 group-hover:translate-y-0.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {/* Progress bar */}
          <div className="h-1 w-48 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-brand/60 transition-all duration-300"
              style={{ width: `${(visible.length / products.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* All loaded message */}
      {!hasMore && products.length > PAGE_SIZE && (
        <p className="text-center text-sm text-muted-foreground">
          ✓ All {products.length} products loaded
        </p>
      )}
    </div>
  );
}
