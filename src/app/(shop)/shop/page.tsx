import { Suspense } from "react";
import { CatalogSearch } from "@/components/shop/catalog-search";
import { FilterSidebar } from "@/components/shop/filter-sidebar";
import { ProductGrid } from "@/components/shop/product-grid";
import { SortControl } from "@/components/shop/sort-control";
import { getCatalogListing } from "@/lib/shop-data";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const metadata = {
  title: "All products | Future Energy BD",
  description:
    "Browse the full Future Energy BD catalog — solar panels, batteries, e-bikes, and accessories.",
};

export default async function ShopCatalogPage({ searchParams }: PageProps) {
  const queryParams = await searchParams;
  const {
    products,
    filterGroups,
    sort,
    activeFilters,
    query,
    matchedCount,
    totalInCatalog,
  } = await getCatalogListing(queryParams);

  const hasFilters =
    Boolean(query) ||
    Object.values(activeFilters).some((values) => values.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 sm:mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          All products
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Full catalog across solar, batteries, e-bikes, and accessories.
        </p>
        <div className="mt-6">
          <Suspense fallback={null}>
            <CatalogSearch initialQuery={query} />
          </Suspense>
        </div>
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        <div className="w-full shrink-0 lg:w-56">
          <Suspense fallback={null}>
            <FilterSidebar
              groups={filterGroups}
              activeFilters={activeFilters}
              categoryScopedAttributes
            />
          </Suspense>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              {totalInCatalog === 0
                ? "No products yet."
                : hasFilters
                  ? `${products.length} of ${totalInCatalog} product${
                      totalInCatalog === 1 ? "" : "s"
                    }${
                      query
                        ? ` matching “${query}”`
                        : matchedCount !== totalInCatalog
                          ? ` in selection`
                          : ""
                    }`
                  : `${products.length} product${
                      products.length === 1 ? "" : "s"
                    } available`}
            </p>
            <Suspense fallback={null}>
              <SortControl value={sort} />
            </Suspense>
          </div>

          {totalInCatalog === 0 ? (
            <EmptyState
              title="Catalog empty"
              description="We're stocking products. Check back soon."
            />
          ) : products.length === 0 ? (
            <EmptyState
              title="No matches"
              description="Nothing matched your search or filters. Try clearing filters or a different keyword."
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
