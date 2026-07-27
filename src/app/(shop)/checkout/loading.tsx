import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex items-center gap-4 sm:mb-10">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-muted" />
        <LoadingSpinner className="size-8" />
      </header>

      <div className="grid gap-10 lg:grid-cols-[1fr_22rem] lg:items-start">
        <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 sm:p-8">
          <div className="h-6 w-40 rounded-md bg-muted" />
          <div className="mt-2 h-4 w-64 rounded bg-muted/60" />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="h-10 rounded-lg bg-muted/70" />
            <div className="h-10 rounded-lg bg-muted/70" />
            <div className="h-10 rounded-lg bg-muted/70 sm:col-span-2" />
            <div className="h-10 rounded-lg bg-muted/70" />
          </div>
          <div className="mt-8 h-12 w-40 rounded-xl bg-brand/20" />
        </div>

        <aside className="animate-pulse rounded-2xl border border-border bg-surface p-6">
          <div className="h-6 w-36 rounded-md bg-muted" />
          <div className="mt-4 space-y-4">
            <div className="h-12 rounded-lg bg-muted/50" />
            <div className="h-12 rounded-lg bg-muted/50" />
          </div>
          <div className="mt-6 flex justify-between border-t border-border pt-4">
            <div className="h-4 w-16 rounded bg-muted" />
            <div className="h-7 w-24 rounded bg-muted" />
          </div>
        </aside>
      </div>
    </div>
  );
}
