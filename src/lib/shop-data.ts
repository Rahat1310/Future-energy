import { cache } from "react";
import { unstable_cache } from "next/cache";
import { db } from "@/lib/db";
import { getKeySpec } from "@/lib/catalog";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-catalog";
import {
  buildCategoryFilterGroup,
  filterAndSortProducts,
  inferAttributeFilters,
  parseActiveFilters,
  parseSearchQuery,
  parseSort,
  prefilterCatalog,
  type AttributeFilterGroup,
  type FilterableProduct,
  type ListedProduct,
  type SortOption,
} from "@/lib/shop-filters";

export type CategoryListing = {
  category: { id: string; name: string; slug: string };
  products: ListedProduct[];
  filterGroups: AttributeFilterGroup[];
  sort: SortOption;
  activeFilters: Record<string, string[]>;
  totalInCategory: number;
};

export type CatalogListing = {
  products: ListedProduct[];
  filterGroups: AttributeFilterGroup[];
  sort: SortOption;
  activeFilters: Record<string, string[]>;
  query: string;
  /** Products after text/category prefilter, before attribute filters. */
  matchedCount: number;
  /** Unfiltered catalog size. */
  totalInCatalog: number;
};

function buildListing(
  category: { id: string; name: string; slug: string },
  filterable: FilterableProduct[],
  searchParams: Record<string, string | string[] | undefined>,
): CategoryListing {
  const allAttributes = filterable.flatMap((p) =>
    p.variants.map((v) => v.attributes),
  );
  const filterGroups = inferAttributeFilters(allAttributes);
  const knownKeys = filterGroups.map((g) => g.key);
  const activeFilters = parseActiveFilters(searchParams, knownKeys);
  const sort = parseSort(searchParams.sort);

  const products = filterAndSortProducts(
    filterable,
    activeFilters,
    sort,
    getKeySpec,
  );

  return {
    category,
    products,
    filterGroups,
    sort,
    activeFilters,
    totalInCategory: filterable.length,
  };
}

function getMockCategoryListing(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>,
): CategoryListing | null {
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  if (!category) return null;

  const filterable: FilterableProduct[] = MOCK_PRODUCTS.filter(
    (product) => product.category.slug === slug,
  ).map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    idSortKey: product.id,
    badge: product.badge,
    variants: product.variants.map((v) => ({
      price: v.price,
      attributes: v.attributes,
    })),
  }));

  return buildListing(category, filterable, searchParams);
}

function getMockFilterableCatalog(): FilterableProduct[] {
  return MOCK_PRODUCTS.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    idSortKey: product.id,
    description: product.description,
    categorySlug: product.category.slug,
    categoryName: product.category.name,
    badge: product.badge,
    variants: product.variants.map((v) => ({
      price: v.price,
      attributes: v.attributes,
    })),
  }));
}

async function fetchFilterableCatalog(): Promise<FilterableProduct[]> {
  try {
    const rows = await db.product.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        category: { select: { name: true, slug: true } },
        variants: {
          select: {
            price: true,
            attributes: true,
          },
        },
      },
    });

    const filterable = rows
      .filter((product) => product.variants.length > 0)
      .map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        idSortKey: product.id,
        description: product.description,
        categorySlug: product.category.slug,
        categoryName: product.category.name,
        // Assign badge by slug — matches the mock catalog logic
        badge:
          product.slug === "akij-48v-lithium-solar-storage"
            ? "Featured"
            : undefined,
        variants: product.variants.map((v) => ({
          price: Number(v.price),
          attributes: v.attributes,
        })),
      }));

    if (filterable.length > 0) return filterable;
  } catch (error) {
    console.warn("[shop] Catalog query failed, using mock catalog:", error);
  }

  return getMockFilterableCatalog();
}

/** Cross-request cache; invalidated via `revalidateTag('products'|'categories')`. */
const loadFilterableCatalog = unstable_cache(
  fetchFilterableCatalog,
  ["filterable-catalog"],
  { tags: ["products", "categories"], revalidate: 300 },
);

/** Full catalog for /shop — search, category + attribute filters, sort. */
export async function getCatalogListing(
  searchParams: Record<string, string | string[] | undefined>,
): Promise<CatalogListing> {
  const all = await loadFilterableCatalog();
  const query = parseSearchQuery(searchParams);
  const sort = parseSort(searchParams.sort);

  const categoryGroup = buildCategoryFilterGroup(all);
  const selectedCategories = parseActiveFilters(searchParams, ["category"]);
  const categorySlugs = selectedCategories.category ?? [];

  // Attribute filters are scoped to the selected category/categories only.
  // With no category picked, only the Category list is shown.
  const scopedProducts =
    categorySlugs.length > 0
      ? all.filter(
          (product) =>
            product.categorySlug != null &&
            categorySlugs.includes(product.categorySlug),
        )
      : [];

  const attributeGroups =
    categorySlugs.length > 0
      ? inferAttributeFilters(
          scopedProducts.flatMap((p) => p.variants.map((v) => v.attributes)),
        )
      : [];

  const filterGroups = categoryGroup
    ? [categoryGroup, ...attributeGroups]
    : attributeGroups;

  const knownKeys = filterGroups.map((g) => g.key);
  const activeFilters = parseActiveFilters(searchParams, knownKeys);
  const attributeFilters = { ...activeFilters };
  delete attributeFilters.category;

  const prefiltered = prefilterCatalog(all, query, categorySlugs);
  const products = filterAndSortProducts(
    prefiltered,
    attributeFilters,
    sort,
    getKeySpec,
  );

  return {
    products,
    filterGroups,
    sort,
    activeFilters,
    query,
    matchedCount: prefiltered.length,
    totalInCatalog: all.length,
  };
}

/** @deprecated Prefer getCatalogListing — kept for simple full lists. */
export async function getAllProducts(): Promise<ListedProduct[]> {
  const listing = await getCatalogListing({});
  return listing.products;
}

async function fetchCategoryBySlug(slug: string) {
  try {
    const category = await db.category.findUnique({
      where: { slug },
      select: { id: true, name: true, slug: true },
    });
    if (category) return category;
  } catch (error) {
    console.warn("[shop] Category lookup failed, using mock:", error);
  }
  return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

/**
 * Cross-request tagged cache + per-request React.cache so generateMetadata
 * and getCategoryListing share one category lookup per request.
 * Invalidated with `revalidateTag('categories')`.
 */
export const getCategoryBySlug = cache(async (slug: string) => {
  return unstable_cache(
    () => fetchCategoryBySlug(slug),
    ["category-by-slug", slug],
    { tags: ["categories"], revalidate: 600 },
  )();
});

async function fetchCategoryProducts(
  categoryId: string,
): Promise<FilterableProduct[]> {
  const rows = await db.product.findMany({
    where: { categoryId },
    select: {
      id: true,
      name: true,
      slug: true,
      variants: {
        select: {
          price: true,
          attributes: true,
        },
      },
    },
  });

  return rows.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    idSortKey: product.id,
    variants: product.variants.map((v) => ({
      price: Number(v.price),
      attributes: v.attributes,
    })),
  }));
}

/** Tagged product list for a category; invalidated with products/categories tags. */
function getCachedCategoryProducts(categoryId: string, slug: string) {
  return unstable_cache(
    () => fetchCategoryProducts(categoryId),
    ["category-products", slug],
    { tags: ["products", "categories"], revalidate: 300 },
  )();
}

export async function getCategoryListing(
  slug: string,
  searchParams: Record<string, string | string[] | undefined>,
): Promise<CategoryListing | null> {
  try {
    const category = await getCategoryBySlug(slug);

    if (category) {
      const filterable = await getCachedCategoryProducts(category.id, slug);

      if (filterable.length > 0) {
        return buildListing(category, filterable, searchParams);
      }
    }
  } catch (error) {
    console.warn("[shop] Listing query failed, using mock catalog:", error);
  }

  return getMockCategoryListing(slug, searchParams);
}
