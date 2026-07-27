import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <LoadingSpinner className="size-10" />
      <p className="font-medium text-muted-foreground animate-pulse">
        Loading...
      </p>
    </div>
  );
}
