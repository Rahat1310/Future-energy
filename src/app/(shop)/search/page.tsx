import Link from "next/link";
import { ProductGrid } from "@/components/shop/product-grid";
import { searchProducts } from "@/lib/search";

type PageProps = {
  searchParams: Promise<{ q?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim();
  return {
    title: query
      ? `Search: ${query} | Future Energy BD`
      : "Search | Future Energy BD",
  };
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchProducts(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl text-ink sm:text-4xl">Search</h1>
        {query ? (
          <p className="mt-2 text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"} for{" "}
            <span className="font-medium text-ink">&ldquo;{query}&rdquo;</span>
          </p>
        ) : (
          <p className="mt-2 text-muted-foreground">
            Enter a search term to find products across all categories.
          </p>
        )}
      </header>

      {!query ? (
        <EmptyState
          title="Start searching"
          description="Try a product name or keyword — batteries, panels, scooter, inverter…"
        />
      ) : results.length === 0 ? (
        <EmptyState
          title="No results"
          description={`Nothing matched “${query}”. Browse categories or try a different term.`}
        />
      ) : (
        <ProductGrid products={results} />
      )}
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
      <Link
        href="/shop"
        className="mt-6 inline-block text-sm font-medium text-brand hover:underline"
      >
        Browse all categories
      </Link>
    </div>
  );
}
