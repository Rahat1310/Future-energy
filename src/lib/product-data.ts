import { cache } from "react";
import { db } from "@/lib/db";
import { getMockProductBySlug } from "@/lib/mock-catalog";

export type ProductVariantDTO = {
  id: string;
  sku: string;
  price: number;
  /** Original (pre-discount) price for strikethrough display, if discounted. */
  originalPrice?: number;
  stock: number;
  attributes: unknown;
};

export type ProductDetailDTO = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: { id: string; name: string; slug: string };
  variants: ProductVariantDTO[];
};

/**
 * Per-request memoization so generateMetadata + the page component share
 * a single Neon round-trip (React cache), not two identical finds.
 */
export const getProductBySlug = cache(
  async (slug: string): Promise<ProductDetailDTO | null> => {
    try {
      const product = await db.product.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          category: {
            select: { id: true, name: true, slug: true },
          },
          variants: {
            orderBy: { price: "asc" },
            select: {
              id: true,
              sku: true,
              price: true,
              stock: true,
              attributes: true,
            },
          },
        },
      });

      if (product && product.variants.length > 0) {
        return {
          ...product,
          variants: product.variants.map((variant) => {
            const attrs = variant.attributes as Record<string, unknown> | null ?? {};
            const originalPrice = typeof attrs.originalPrice === 'number' ? attrs.originalPrice : undefined;
            return {
              id: variant.id,
              sku: variant.sku,
              price: Number(variant.price),
              originalPrice,
              stock: variant.stock,
              attributes: attrs,
            };
          }),
        };
      }
    } catch (error) {
      console.warn("[product] DB lookup failed, using mock catalog:", error);
    }

    return getMockProductBySlug(slug);
  },
);
