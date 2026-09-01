import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { getKeySpec } from "@/lib/catalog";
import type { ListedProduct } from "@/lib/shop-filters";
import { searchQuerySchema } from "@/lib/validation";

/**
 * Global text search across Product.name and Product.description.
 * Separate from per-category attribute filters on /shop/[slug].
 * Results are Data-Cache tagged so admin stock/price edits invalidate them.
 */
export async function searchProducts(query: string): Promise<ListedProduct[]> {
  const parsed = searchQuerySchema.safeParse(query);
  if (!parsed.success) return [];

  const q = parsed.data;
  if (!q) return [];

  const normalized = q.toLowerCase();

  return unstable_cache(
    async () => {
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
          image: true,
          variants: {
            orderBy: { price: "asc" },
            take: 1,
            select: { id: true, sku: true, stock: true, price: true, attributes: true },
          },
        },
      });

      return products
        .filter((product) => product.variants.length > 0)
        .map((product) => {
          const cheapest = product.variants[0];
          const attrs = (cheapest.attributes as Record<string, unknown> | null) ?? {};
          const originalPrice = typeof attrs.originalPrice === "number" ? attrs.originalPrice : undefined;
          return {
            id: product.id,
            name: product.name,
            slug: product.slug,
            image: product.image,
            price: Number(cheapest.price),
            originalPrice,
            keySpec: getKeySpec(cheapest.attributes),
            variantId: cheapest.id,
            variantSku: cheapest.sku,
            stock: cheapest.stock,
          };
        });
    },
    ["search-products", normalized],
    { tags: ["products"], revalidate: 300 },
  )();
}
