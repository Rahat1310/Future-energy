import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { getKeySpec } from "@/lib/catalog";
import {
  getMockFeaturedProducts,
  MOCK_CATEGORIES,
} from "@/lib/mock-catalog";

export type NavCategory = {
  id: string;
  name: string;
  slug: string;
};

export type FeaturedProduct = {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  keySpec: string | null;
  image: string | null;
  /** Optional badge label shown on the card, e.g. "Featured" or "Sale" */
  badge?: string;
  variantId?: string;
  variantSku?: string;
  stock?: number;
};

export type HeroContent = {
  heroHeadline: string;
  heroSubhead: string;
};

/** Static homepage hero copy (edit here or move to env later). */
const HERO_CONTENT: HeroContent = {
  heroHeadline: "Power your world without costing the earth",
  heroSubhead:
    "Lithium batteries, solar panels, and electric motorcycles for Bangladesh — built to cut bills and cut carbon.",
};

export async function getHeroContent(): Promise<HeroContent> {
  return HERO_CONTENT;
}

async function fetchTopLevelCategories(): Promise<NavCategory[]> {
  try {
    const categories = await db.category.findMany({
      where: { parentId: null },
      orderBy: { name: "asc" },
      take: 4,
      select: { id: true, name: true, slug: true },
    });
    return categories.length > 0 ? categories : MOCK_CATEGORIES;
  } catch (error) {
    console.warn("[homepage] Category query failed, using mock data:", error);
    return MOCK_CATEGORIES;
  }
}

/**
 * Cached category strip for the homepage. Invalidated via `revalidateTag('categories')`
 * from admin mutations (and page-level ISR at 600s as a safety net).
 */
export const getTopLevelCategories = unstable_cache(
  fetchTopLevelCategories,
  ["homepage-top-categories"],
  { tags: ["categories", "homepage"], revalidate: 600 },
);

async function fetchFeaturedProducts(): Promise<FeaturedProduct[]> {
  try {
    const products = await db.product.findMany({
      take: 8,
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        image: true,
        category: { select: { slug: true } },
        variants: {
          orderBy: { price: "asc" },
          select: { id: true, sku: true, stock: true, price: true, attributes: true },
        },
      },
    });

    const featured = products
      .filter((product) => product.variants.length > 0)
      .map((product) => {
        // Use the cheapest variant for display price/spec
        const lowestPriceVariant = product.variants[0];
        const cheapestAttrs = (lowestPriceVariant.attributes as Record<string, unknown> | null) ?? {};
        const cheapestOriginalPrice = typeof cheapestAttrs.originalPrice === "number" ? cheapestAttrs.originalPrice : undefined;

        // If the cheapest variant has no originalPrice, look for one on any other variant
        // (originalPrice may have been set on a higher-tier variant in some cases)
        let originalPrice = cheapestOriginalPrice;
        if (originalPrice === undefined && product.variants.length > 1) {
          for (const v of product.variants) {
            const vAttrs = (v.attributes as Record<string, unknown> | null) ?? {};
            if (typeof vAttrs.originalPrice === "number") {
              originalPrice = vAttrs.originalPrice;
              break;
            }
          }
        }

        // Assign badge by slug — matches the mock catalog logic
        const badge =
          product.slug === "akij-48v-lithium-solar-storage"
            ? "Featured"
            : undefined;
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          categorySlug: product.category.slug,
          price: Number(lowestPriceVariant.price),
          originalPrice,
          keySpec: getKeySpec(lowestPriceVariant.attributes),
          image: product.image ?? null,
          badge,
          variantId: lowestPriceVariant.id,
          variantSku: lowestPriceVariant.sku,
          stock: lowestPriceVariant.stock,
        };
      });

    return featured.length > 0 ? featured : getMockFeaturedProducts();
  } catch (error) {
    console.warn("[homepage] Product query failed, using mock data:", error);
    return getMockFeaturedProducts();
  }
}

/**
 * Cached featured products for the homepage. Invalidated via
 * `revalidateTag('homepage' | 'products')` when stock/price changes in admin.
 */
export const getFeaturedProducts = unstable_cache(
  fetchFeaturedProducts,
  ["homepage-featured-products"],
  { tags: ["homepage", "products"], revalidate: 600 },
);
