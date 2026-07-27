import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function QuoteLoading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
      <header className="mb-8 flex flex-col items-center text-center sm:mb-10">
        <div className="flex items-center gap-3">
          <div className="h-10 w-56 animate-pulse rounded-lg bg-muted" />
          <LoadingSpinner className="size-8" />
        </div>
        <div className="mx-auto mt-3 h-4 w-80 max-w-full animate-pulse rounded bg-muted/60" />
      </header>

      <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-10 rounded-lg bg-muted/70" />
          <div className="h-10 rounded-lg bg-muted/70" />
          <div className="h-10 rounded-lg bg-muted/70 sm:col-span-2" />
          <div className="h-32 rounded-lg bg-muted/50 sm:col-span-2" />
        </div>
        <div className="mt-6 h-12 w-48 rounded-xl bg-brand/20" />
      </div>
    </div>
  );
}
