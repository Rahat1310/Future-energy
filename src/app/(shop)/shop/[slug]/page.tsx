import { Suspense } from "react";
import { notFound } from "next/navigation";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { ProductGrid } from "@/components/shop/product-grid";
import { SortControl } from "@/components/shop/sort-control";
import { getCategoryBySlug, getCategoryListing } from "@/lib/shop-data";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * ISR: category listing — 5 min.
 * Note: `searchParams` (filters/sort) may still opt this route into dynamic
 * rendering in App Router; revalidate still caps freshness when a static
 * shell is served, and admin stock edits call revalidatePath/tag.
 */
export const revalidate = 300;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };
  return {
    title: `${category.name} | Future Energy BD`,
    description: `Shop ${category.name} — lithium, solar, and electric products for Bangladesh.`,
  };
}

export default async function CategoryShopPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const listing = await getCategoryListing(slug, query);

  if (!listing) {
    notFound();
  }

  const { category, products, filterGroups, sort, activeFilters, totalInCategory } =
    listing;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl text-ink sm:text-4xl">{category.name}</h1>
        <p className="mt-2 text-muted-foreground">
          {totalInCategory === 0
            ? "No products in this category yet."
            : `${products.length} product${products.length === 1 ? "" : "s"}${
                products.length !== totalInCategory
                  ? ` of ${totalInCategory}`
                  : ""
              }`}
        </p>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <div className="w-full shrink-0 lg:w-56">
          <Suspense fallback={null}>
            <FilterSidebar
              groups={filterGroups}
              activeFilters={activeFilters}
            />
          </Suspense>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground lg:sr-only">
              {products.length} shown
            </p>
            <Suspense fallback={null}>
              <SortControl value={sort} />
            </Suspense>
          </div>

          {totalInCategory === 0 ? (
            <EmptyState
              title="Nothing here yet"
              description="We're stocking this category. Check back soon, or browse another category from the nav."
            />
          ) : products.length === 0 ? (
            <EmptyState
              title="No matches"
              description="No products match the selected filters. Try clearing a filter or widening the range."
            />
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center">
      <h2 className="font-display text-lg font-medium text-ink">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
