import { ProductGridSkeleton } from "@/components/shop/product-card-skeleton";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function SearchLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-center gap-4 sm:mb-10">
        <h1 className="font-display text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          Searching catalog...
        </h1>
        <LoadingSpinner className="size-8" />
      </header>

      <ProductGridSkeleton count={8} />
    </div>
  );
}
