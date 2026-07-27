export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col gap-2 rounded-xl border border-border bg-surface p-3 sm:gap-3 sm:rounded-2xl sm:p-5">
      {/* Image placeholder */}
      <div className="aspect-square rounded-lg bg-muted sm:rounded-xl" />
      <div className="flex flex-col gap-1 sm:gap-1.5 mt-1">
        {/* Title placeholder */}
        <div className="h-4 w-3/4 rounded-md bg-muted sm:h-5" />
        <div className="h-4 w-1/2 rounded-md bg-muted sm:h-5" />
        {/* Spec placeholder */}
        <div className="mt-1 h-3 w-1/3 rounded-md bg-brand/10 sm:h-4" />
        {/* Price placeholder */}
        <div className="mt-1.5 h-5 w-2/5 rounded-md bg-muted sm:h-6" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-3 xl:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
