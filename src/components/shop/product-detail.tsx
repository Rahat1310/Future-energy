"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddToCartButton } from "@/components/shop/add-to-cart-button";
import {
  attributeValueKey,
  formatAttributeValue,
  formatPrice,
  getKeySpec,
  getVariantSelectorAxes,
  listSpecEntries,
  parseAttributes,
} from "@/lib/catalog";
import {
  LOW_STOCK_THRESHOLD,
  QUOTE_PRICE_THRESHOLD,
} from "@/lib/constants";
import { attributeLabel } from "@/lib/shop-filters";
import type { ProductDetailDTO, ProductVariantDTO } from "@/lib/product-data";
import { cn } from "@/lib/utils";

type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

function getStockStatus(stock: number): StockStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock < LOW_STOCK_THRESHOLD) return "low_stock";
  return "in_stock";
}

const STOCK_COPY: Record<StockStatus, string> = {
  in_stock: "In stock",
  low_stock: "Low stock",
  out_of_stock: "Out of stock",
};

function pickInitialVariant(variants: ProductVariantDTO[]): ProductVariantDTO {
  const inStock = variants.find((v) => v.stock > 0);
  return inStock ?? variants[0];
}

function findMatchingVariant(
  variants: ProductVariantDTO[],
  selection: Record<string, string>,
  axes: string[],
): ProductVariantDTO | undefined {
  return variants.find((variant) => {
    const attrs = parseAttributes(variant.attributes);
    return axes.every((axis) => {
      if (!(axis in selection)) return true;
      return attributeValueKey(attrs[axis]) === selection[axis];
    });
  });
}

/** Returns true when the price is a per-watt unit price (< 100 BDT) */
function isPricePerWatt(price: number): boolean {
  return price < 100;
}

/** Parse watts from a wattage attribute */
function extractWattsFromAttrs(attributes: unknown): number | null {
  const attrs = parseAttributes(attributes);
  if (typeof attrs.wattage === "number") return attrs.wattage;
  return null;
}

export function ProductDetail({ product }: { product: ProductDetailDTO }) {
  const axes = useMemo(
    () => getVariantSelectorAxes(product.variants),
    [product.variants],
  );

  const [selectedId, setSelectedId] = useState(
    () => pickInitialVariant(product.variants).id,
  );
  const [quantity, setQuantity] = useState(1);

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  useEffect(() => {
    setQuantity(1);
  }, [selectedId]);

  const selection = useMemo(() => {
    const attrs = parseAttributes(selected.attributes);
    const next: Record<string, string> = {};
    for (const axis of axes) {
      if (axis in attrs) {
        next[axis] = attributeValueKey(attrs[axis]);
      }
    }
    return next;
  }, [axes, selected]);

  const specs = listSpecEntries(selected.attributes);
  const stockStatus = getStockStatus(selected.stock);
  const requiresQuote = selected.price >= QUOTE_PRICE_THRESHOLD;
  const outOfStock = stockStatus === "out_of_stock";
  const maxQty = Math.max(1, selected.stock);

  const quoteHref = `/quote?product=${encodeURIComponent(product.slug)}&variant=${encodeURIComponent(selected.id)}`;

  // Discount / per-watt pricing
  const isPerWatt = isPricePerWatt(selected.price);
  const hasDiscount =
    selected.originalPrice != null && selected.originalPrice > selected.price;

  const discountPct = hasDiscount
    ? Math.round(
        ((selected.originalPrice! - selected.price) / selected.originalPrice!) *
          100,
      )
    : 0;

  // For per-watt panels, derive the estimated panel total
  const panelWatts = isPerWatt ? extractWattsFromAttrs(selected.attributes) : null;
  const panelTotal = panelWatts != null ? panelWatts * selected.price : null;

  function selectAxisValue(axis: string, valueKey: string) {
    const nextSelection = { ...selection, [axis]: valueKey };
    const match = findMatchingVariant(product.variants, nextSelection, axes);
    if (match) {
      setSelectedId(match.id);
      return;
    }
    const fallback = product.variants.find((variant) => {
      const attrs = parseAttributes(variant.attributes);
      return attributeValueKey(attrs[axis]) === valueKey;
    });
    if (fallback) setSelectedId(fallback.id);
  }

  function optionsForAxis(axis: string) {
    const seen = new Map<string, { raw: unknown; display: string }>();
    for (const variant of product.variants) {
      const attrs = parseAttributes(variant.attributes);
      if (!(axis in attrs)) continue;
      const key = attributeValueKey(attrs[axis]);
      if (!seen.has(key)) {
        seen.set(key, {
          raw: attrs[axis],
          display: formatAttributeValue(axis, attrs[axis]),
        });
      }
    }
    return [...seen.entries()].map(([valueKey, meta]) => ({
      valueKey,
      ...meta,
    }));
  }

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="aspect-square rounded-2xl border border-border bg-muted overflow-hidden relative">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div aria-hidden className="absolute inset-0 bg-muted" />
        )}
      </div>

      <div className="flex flex-col">
        <Link
          href={`/shop/${product.category.slug}`}
          className="text-sm font-medium text-brand hover:underline"
        >
          {product.category.name}
        </Link>

        <h1 className="mt-2 text-3xl text-ink sm:text-4xl">{product.name}</h1>

        {/* Price block */}
        <div className="mt-4 flex flex-wrap items-baseline gap-3">
          <p className="spec-number text-2xl font-semibold text-ink sm:text-3xl">
            {isPerWatt
              ? `${formatPrice(selected.price)} / Watt`
              : formatPrice(selected.price)}
          </p>
          {hasDiscount && !isPerWatt && (
            <p className="spec-number text-lg text-muted-foreground line-through">
              {formatPrice(selected.originalPrice!)}
            </p>
          )}
          {hasDiscount && discountPct > 0 && !isPerWatt && (
            <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-sm font-semibold text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
              Save {discountPct}%
            </span>
          )}
        </div>

        {/* Per-watt: estimated panel total */}
        {isPerWatt && panelTotal != null && (
          <p className="mt-1.5 text-sm text-muted-foreground">
            Estimated panel total:{" "}
            <span className="spec-number font-semibold text-ink">
              {formatPrice(panelTotal)}
            </span>{" "}
            ({panelWatts}W x {formatPrice(selected.price)}/W)
          </p>
        )}

        <p
          className={cn(
            "mt-2 text-sm font-medium",
            stockStatus === "in_stock" && "text-brand",
            stockStatus === "low_stock" && "text-signal",
            stockStatus === "out_of_stock" && "text-muted-foreground",
          )}
        >
          {STOCK_COPY[stockStatus]}
          {stockStatus === "low_stock" ? (
            <span className="spec-number text-muted-foreground">
              {" "}
              - {selected.stock} left
            </span>
          ) : null}
        </p>

        {axes.length > 0 ? (
          <div className="mt-8 flex flex-col gap-6">
            {axes.map((axis) => (
              <fieldset key={axis}>
                <legend className="mb-3 text-sm font-medium text-ink">
                  {attributeLabel(axis)}
                </legend>
                <div className="flex flex-wrap gap-2">
                  {optionsForAxis(axis).map((option) => {
                    const isActive = selection[axis] === option.valueKey;
                    const wouldMatch = Boolean(
                      findMatchingVariant(
                        product.variants,
                        { ...selection, [axis]: option.valueKey },
                        axes,
                      ) ??
                        product.variants.find((variant) => {
                          const attrs = parseAttributes(variant.attributes);
                          return (
                            attributeValueKey(attrs[axis]) === option.valueKey
                          );
                        }),
                    );
                    return (
                      <button
                        key={option.valueKey}
                        type="button"
                        disabled={!wouldMatch}
                        onClick={() => selectAxisValue(axis, option.valueKey)}
                        className={cn(
                          "rounded-lg border px-3 py-2 text-sm transition-colors",
                          "spec-number",
                          isActive
                            ? "border-brand bg-brand/10 text-brand"
                            : "border-border bg-surface text-ink hover:border-brand/40",
                          !wouldMatch && "cursor-not-allowed opacity-40",
                        )}
                      >
                        {option.display}
                      </button>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
        ) : null}

        {specs.length > 0 ? (
          <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-border pt-6 sm:grid-cols-3">
            {specs.map((spec) => (
              <div key={spec.key}>
                <dt className="text-xs text-muted-foreground">{spec.label}</dt>
                <dd
                  className={cn(
                    "mt-0.5 text-sm text-ink",
                    spec.isNumeric && "spec-number",
                  )}
                >
                  {spec.display}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className="mt-8 flex flex-col gap-4">
          {!outOfStock ? (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-ink">Quantity</span>
              <div className="inline-flex items-center rounded-lg border border-border bg-surface">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  className="flex size-10 items-center justify-center text-ink transition-colors hover:bg-muted disabled:opacity-40"
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Minus className="size-4" />
                </button>
                <span className="spec-number min-w-10 text-center text-sm font-semibold text-ink">
                  {quantity}
                </span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  className="flex size-10 items-center justify-center text-ink transition-colors hover:bg-muted disabled:opacity-40"
                  disabled={quantity >= maxQty}
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <AddToCartButton
              productId={product.id}
              variantId={selected.id}
              productSlug={product.slug}
              productName={product.name}
              variantSku={selected.sku}
              keySpec={getKeySpec(selected.attributes)}
              price={selected.price}
              stock={selected.stock}
              quantity={quantity}
              disabled={outOfStock}
              image={product.image}
              className="h-12 w-full px-6 text-base sm:w-auto"
            />
            {requiresQuote ? (
              <Button
                size="lg"
                variant="outline"
                className="h-12 w-full px-6 text-base sm:w-auto"
                nativeButton={false}
                render={<Link href={quoteHref}>Request a quote</Link>}
              />
            ) : null}
          </div>
        </div>

        {requiresQuote ? (
          <p className="mt-3 text-sm text-muted-foreground">
            High-ticket items can be quoted for EMI and bulk pricing - or add to
            cart to check out directly.
          </p>
        ) : null}

        <div className="mt-10 border-t border-border pt-8">
          <h2 className="font-display text-lg font-medium text-ink">
            Description
          </h2>
          <p className="mt-3 whitespace-pre-line text-muted-foreground">
            {product.description}
          </p>
        </div>

        <p className="mt-6 text-xs text-muted-foreground">
          SKU{" "}
          <span className="spec-number text-ink">{selected.sku}</span>
        </p>
      </div>
    </div>
  );
}