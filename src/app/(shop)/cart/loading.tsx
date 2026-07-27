import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function CartLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex items-center gap-4">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <LoadingSpinner className="size-8" />
      </div>
      <div className="animate-pulse rounded-3xl border border-border bg-surface p-8">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-4 py-12">
          <div className="h-5 w-56 rounded-md bg-muted" />
          <div className="h-12 w-44 rounded-xl bg-brand/20" />
        </div>
      </div>
    </div>
  );
}
