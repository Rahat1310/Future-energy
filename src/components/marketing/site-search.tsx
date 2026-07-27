"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SiteSearchProps = {
  /** Homepage hero overlay — light icon/input treatment. */
  light?: boolean;
};

const SEARCH_DEBOUNCE_MS = 400;

export function SiteSearch({ light = false }: SiteSearchProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  function navigateToSearch(raw: string) {
    const q = raw.trim();
    if (!q) {
      if (pathname === "/search") {
        router.push("/search");
      }
      return;
    }
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function onQueryChange(next: string) {
    setQuery(next);
    // Debounce navigation only while already on /search so homepage typing
    // never triggers a route change mid-keystroke. Submit still fires immediately.
    if (pathname !== "/search") return;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      navigateToSearch(next);
    }, SEARCH_DEBOUNCE_MS);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (!q) return;
    setOpen(false);
    navigateToSearch(q);
  }

  return (
    <div className="relative flex items-center">
      {/* Desktop: always-visible input */}
      <form
        onSubmit={submit}
        className="relative hidden sm:block"
        role="search"
      >
        <Search
          className={cn(
            "pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2",
            light ? "text-white/70" : "text-muted-foreground",
          )}
          aria-hidden
        />
        <input
          type="search"
          name="q"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search products…"
          aria-label="Search products"
          className={cn(
            "h-9 w-44 rounded-lg border py-1 pr-3 pl-8 text-sm outline-none transition-[width] focus:w-56 focus-visible:ring-3 focus-visible:ring-ring/50 md:w-52 md:focus:w-64",
            light
              ? "border-white/20 bg-white/10 text-white placeholder:text-white/60 focus-visible:border-white/40"
              : "border-border bg-background text-ink placeholder:text-muted-foreground focus-visible:border-ring",
          )}
        />
      </form>

      {/* Mobile: icon that expands to an input */}
      <div className="sm:hidden">
        {open ? (
          <form
            onSubmit={submit}
            className="absolute top-1/2 right-0 z-20 flex -translate-y-1/2 items-center gap-1 rounded-lg border border-border bg-background p-1 shadow-lg"
            role="search"
          >
            <input
              ref={inputRef}
              type="search"
              name="q"
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search…"
              aria-label="Search products"
              className="h-9 w-[min(70vw,16rem)] rounded-md bg-transparent px-2 text-sm text-ink outline-none"
            />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-ink"
              aria-label="Close search"
            >
              <X className="size-4" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-lg transition-colors",
              light
                ? "text-white/90 hover:bg-white/10 hover:text-white"
                : "text-muted-foreground hover:bg-muted hover:text-ink",
            )}
            aria-label="Open search"
          >
            <Search className="size-5" />
          </button>
        )}
      </div>
    </div>
  );
}
