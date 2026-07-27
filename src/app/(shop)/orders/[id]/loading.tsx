import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function OrderDetailLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-3 flex items-center gap-3">
          <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
          <LoadingSpinner className="size-7" />
        </div>
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-muted/60" />
      </header>

      <div className="mb-6 h-16 animate-pulse rounded-2xl bg-muted/40" />

      <section className="animate-pulse rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="h-6 w-24 rounded-md bg-muted" />
        <div className="mt-6 space-y-4 border-b border-border pb-6">
          <div className="flex justify-between gap-3">
            <div className="h-10 w-2/3 rounded bg-muted/60" />
            <div className="h-5 w-20 rounded bg-muted" />
          </div>
          <div className="flex justify-between gap-3">
            <div className="h-10 w-1/2 rounded bg-muted/60" />
            <div className="h-5 w-16 rounded bg-muted" />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-16 rounded bg-muted" />
          <div className="h-8 w-28 rounded bg-muted" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="h-16 rounded-lg bg-muted/50" />
          <div className="h-16 rounded-lg bg-muted/50" />
        </div>
      </section>
    </div>
  );
}
