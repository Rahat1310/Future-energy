import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function PaymentLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8">
        <div className="h-4 w-28 animate-pulse rounded bg-brand/20" />
        <div className="mt-2 flex items-center gap-3">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />
          <LoadingSpinner className="size-7" />
        </div>
        <div className="mt-2 h-4 w-72 max-w-full animate-pulse rounded bg-muted/60" />
      </header>

      <div className="mb-8 h-24 animate-pulse rounded-2xl bg-signal/15" />

      <section className="animate-pulse rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="h-6 w-36 rounded-md bg-muted" />
        <div className="mt-6 space-y-4 border-b border-border pb-6">
          <div className="h-12 rounded-lg bg-muted/50" />
          <div className="h-12 rounded-lg bg-muted/50" />
        </div>
        <div className="mt-4 flex justify-between">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-8 w-28 rounded bg-muted" />
        </div>
      </section>

      <section className="mt-6 animate-pulse rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="h-6 w-48 rounded-md bg-muted" />
        <div className="mt-4 space-y-3">
          <div className="h-4 w-full rounded bg-muted/50" />
          <div className="h-4 w-5/6 rounded bg-muted/50" />
          <div className="h-10 w-40 rounded-lg bg-muted" />
        </div>
        <div className="mt-6 h-10 w-full rounded-lg bg-muted/70" />
        <div className="mt-4 h-12 w-40 rounded-xl bg-brand/20" />
      </section>
    </div>
  );
}
