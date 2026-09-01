export function ProductCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col justify-between rounded-2xl border border-border/80 bg-surface p-2.5 sm:p-3.5 dark:bg-card dark:border-border/60">
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {/* Image placeholder */}
        <div className="aspect-square w-full rounded-xl bg-muted/70" />
        <div className="flex flex-col gap-1.5 mt-0.5">
          {/* Spec placeholder */}
          <div className="h-4 w-16 rounded-md bg-brand/10" />
          {/* Title placeholder */}
          <div className="h-3.5 w-4/5 rounded-md bg-muted/80 sm:h-4" />
          <div className="h-3.5 w-3/5 rounded-md bg-muted/80 sm:h-4" />
          {/* Price placeholder */}
          <div className="mt-1 h-5 w-24 rounded-md bg-muted/90 sm:h-6" />
        </div>
      </div>
      {/* Button placeholder */}
      <div className="mt-3 pt-2 border-t border-border/50">
        <div className="h-8 sm:h-8.5 w-full rounded-xl bg-muted/70" />
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
