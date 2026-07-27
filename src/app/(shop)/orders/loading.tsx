import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function OrdersLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-center gap-4 sm:mb-10">
        <div className="h-10 w-44 animate-pulse rounded-lg bg-muted" />
        <LoadingSpinner className="size-8" />
      </header>

      <ul className="flex flex-col gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <li
            key={i}
            className="animate-pulse rounded-2xl border border-border bg-surface p-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="h-4 w-40 rounded bg-muted" />
                <div className="h-3 w-56 rounded bg-muted/60" />
              </div>
              <div className="h-6 w-20 rounded-full bg-muted" />
            </div>
            <div className="mt-4 h-5 w-28 rounded bg-muted" />
          </li>
        ))}
      </ul>
    </div>
  );
}
