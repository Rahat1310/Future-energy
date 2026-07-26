import { db } from "@/lib/db";
import { getKeySpec } from "@/lib/catalog";
import type { ListedProduct } from "@/lib/shop-filters";

/**
 * Global text search across Product.name and Product.description.
 * Separate from per-category attribute filters on /shop/[slug].
 */
export async function searchProducts(query: string): Promise<ListedProduct[]> {
  const q = query.trim();
  if (!q) return [];

  const products = await db.product.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ],
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      variants: {
        orderBy: { price: "asc" },
        take: 1,
        select: { price: true, attributes: true },
      },
    },
  });

  return products
    .filter((product) => product.variants.length > 0)
    .map((product) => {
      const cheapest = product.variants[0];
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: Number(cheapest.price),
        keySpec: getKeySpec(cheapest.attributes),
      };
    });
}
