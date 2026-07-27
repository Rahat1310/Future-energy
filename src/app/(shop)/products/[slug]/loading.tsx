import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-center justify-center gap-4 sm:mb-10 lg:hidden">
        <LoadingSpinner className="size-8" />
        <span className="font-medium text-muted-foreground">Loading product...</span>
      </header>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Left Side: Image skeleton */}
        <div className="aspect-square w-full animate-pulse rounded-2xl bg-muted/70" />

        {/* Right Side: Details skeleton */}
        <div className="flex flex-col">
          <div className="hidden lg:flex lg:items-center lg:gap-4 mb-4">
            <LoadingSpinner className="size-6" />
            <span className="text-sm font-medium text-muted-foreground">Loading product details...</span>
          </div>

          <div className="mt-2 h-4 w-24 animate-pulse rounded bg-brand/20" />
          <div className="mt-4 h-10 w-3/4 animate-pulse rounded-lg bg-muted" />
          <div className="mt-6 h-8 w-1/3 animate-pulse rounded-md bg-muted" />
          
          <div className="mt-8 space-y-4">
            <div className="h-4 w-full animate-pulse rounded bg-muted/60" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-muted/60" />
            <div className="h-4 w-4/6 animate-pulse rounded bg-muted/60" />
          </div>

          <div className="mt-10 space-y-6">
            <div>
              <div className="mb-3 h-4 w-20 animate-pulse rounded bg-muted" />
              <div className="flex gap-2">
                <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
                <div className="h-10 w-24 animate-pulse rounded-lg bg-muted" />
              </div>
            </div>
            
            <div className="mt-8 flex gap-4">
              <div className="h-12 w-32 animate-pulse rounded-xl bg-muted" />
              <div className="h-12 flex-1 animate-pulse rounded-xl bg-brand/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
