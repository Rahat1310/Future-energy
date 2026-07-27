import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ShopLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-center gap-4 sm:mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Loading catalog...
        </h1>
        <LoadingSpinner className="size-8" />
      </header>

      <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">
        {/* Sidebar skeleton */}
        <div className="w-full shrink-0 lg:w-56">
          <div className="h-96 w-full animate-pulse rounded-xl bg-muted/50" />
        </div>

        {/* Grid skeleton */}
        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="h-5 w-32 animate-pulse rounded-md bg-muted" />
            <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
          </div>
          <ProductGridSkeleton count={12} />
        </div>
      </div>
    </div>
  );
}
