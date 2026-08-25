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
  keySpec: string | null;
  /** Optional badge label shown on the card, e.g. "Featured" or "Sale" */
  badge?: string;
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
        category: { select: { slug: true } },
        variants: {
          orderBy: { price: "asc" },
          take: 1,
          select: { price: true, attributes: true },
        },
      },
    });

    const featured = products
      .filter((product) => product.variants.length > 0)
      .map((product) => {
        const lowestPriceVariant = product.variants[0];
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
          keySpec: getKeySpec(lowestPriceVariant.attributes),
          badge,
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
