import { db } from "@/lib/db";
import { getKeySpec } from "@/lib/catalog";
import {
  getMockFeaturedProducts,
  MOCK_CATEGORIES,
} from "@/lib/mock-catalog";
import { sanityFetch, type BlogPost, type HomePage } from "@/lib/sanity";
import { HOME_PAGE_QUERY, LATEST_BLOG_POSTS_QUERY } from "@/sanity/queries";

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
};

type HeroContent = Pick<HomePage, "heroHeadline" | "heroSubhead">;

/** Shown until an editor publishes the Sanity `homePage` document. */
const FALLBACK_HERO_CONTENT: HeroContent = {
  heroHeadline: "Power your world without costing the earth",
  heroSubhead:
    "Lithium batteries, solar panels, and electric motorcycles for Bangladesh — built to cut bills and cut carbon.",
};

export async function getHeroContent(): Promise<HeroContent> {
  try {
    const doc = await sanityFetch<HomePage | null>({
      query: HOME_PAGE_QUERY,
      tags: ["homePage"],
    });

    return {
      heroHeadline: doc?.heroHeadline || FALLBACK_HERO_CONTENT.heroHeadline,
      heroSubhead: doc?.heroSubhead || FALLBACK_HERO_CONTENT.heroSubhead,
    };
  } catch (error) {
    console.warn(
      "[homepage] Sanity homePage fetch failed, using placeholder copy:",
      error,
    );
    return FALLBACK_HERO_CONTENT;
  }
}

/** Top-level categories only — subcategories (via parentId) stay off the homepage strip. */
export async function getTopLevelCategories(): Promise<NavCategory[]> {
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

export async function getFeaturedProducts(): Promise<FeaturedProduct[]> {
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
        return {
          id: product.id,
          name: product.name,
          slug: product.slug,
          categorySlug: product.category.slug,
          price: Number(lowestPriceVariant.price),
          keySpec: getKeySpec(lowestPriceVariant.attributes),
        };
      });

    return featured.length > 0 ? featured : getMockFeaturedProducts();
  } catch (error) {
    console.warn("[homepage] Product query failed, using mock data:", error);
    return getMockFeaturedProducts();
  }
}

export async function getLatestBlogPosts(): Promise<BlogPost[]> {
  try {
    return await sanityFetch<BlogPost[]>({
      query: LATEST_BLOG_POSTS_QUERY,
      tags: ["blogPost"],
    });
  } catch (error) {
    console.warn("[homepage] Sanity blogPost fetch failed:", error);
    return [];
  }
}
