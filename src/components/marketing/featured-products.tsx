"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/catalog";
import type { FeaturedProduct } from "@/lib/homepage-data";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FeaturedProducts({ products }: { products: FeaturedProduct[] }) {
  return (
    <section className="border-b border-border bg-transparent">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:py-24">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">Featured Products</h2>
            <p className="mt-4 text-muted-foreground">Hand-picked gear for maximum efficiency.</p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors"
          >
            View full catalog
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-surface/50 p-12 text-center">
            <p className="text-muted-foreground">
              The catalog is being stocked — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex flex-col h-full overflow-hidden rounded-3xl border border-border bg-surface transition-all hover:border-brand/30 hover:shadow-2xl hover:shadow-brand/10"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
                    <div className="absolute inset-0 bg-muted transition-transform duration-700 group-hover:scale-105" aria-hidden />
                    <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full transition-transform duration-300 group-hover:translate-y-0 bg-gradient-to-t from-black/60 to-transparent">
                      <span className="text-sm font-medium text-white flex items-center gap-2">
                        View details <ArrowRight className="size-4" />
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 p-5 gap-2">
                    <h3 className="text-base font-semibold text-ink line-clamp-2">{product.name}</h3>
                    <div className="mt-auto flex items-end justify-between gap-4 pt-4">
                      {product.keySpec ? (
                        <span className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
                          {product.keySpec}
                        </span>
                      ) : <span />}
                      <span className="spec-number text-lg font-bold text-brand">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
