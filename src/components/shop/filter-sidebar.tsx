"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AttributeFilterGroup } from "@/lib/shop-filters";

type FilterSidebarProps = {
  groups: AttributeFilterGroup[];
  activeFilters: Record<string, string[]>;
  /** When true, show a hint under Category until one is selected. */
  categoryScopedAttributes?: boolean;
};

const META_KEYS = new Set(["sort", "q", "category"]);

export function FilterSidebar({
  groups,
  activeFilters,
  categoryScopedAttributes = false,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function pushParams(params: URLSearchParams) {
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function toggle(key: string, optionValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    const current = new Set(
      (params.get(key) ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );

    if (current.has(optionValue)) {
      current.delete(optionValue);
    } else {
      current.add(optionValue);
    }

    if (current.size === 0) {
      params.delete(key);
    } else {
      params.set(key, [...current].join(","));
    }

    // Changing category invalidates attribute filters from other categories.
    if (key === "category") {
      for (const paramKey of [...params.keys()]) {
        if (!META_KEYS.has(paramKey)) {
          params.delete(paramKey);
        }
      }
    }

    pushParams(params);
  }

  function clearAll() {
    const params = new URLSearchParams(searchParams.toString());
    for (const paramKey of [...params.keys()]) {
      if (paramKey !== "sort") params.delete(paramKey);
    }
    pushParams(params);
  }

  const hasActive =
    Object.values(activeFilters).some((v) => v.length > 0) ||
    Boolean(searchParams.get("q"));

  const categorySelected = (activeFilters.category?.length ?? 0) > 0;
  const attributeGroups = groups.filter((group) => group.key !== "category");
  const categoryGroup = groups.find((group) => group.key === "category");

  if (groups.length === 0) {
    return (
      <aside className="text-sm text-muted-foreground">
        No filters for this category yet.
      </aside>
    );
  }

  return (
    <aside className="flex flex-col gap-8">
      <div className="flex items-center justify-between gap-2">
        <h2 className="font-display text-base font-medium text-ink">Filters</h2>
        {hasActive ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm font-medium text-brand hover:underline"
          >
            Clear all
          </button>
        ) : null}
      </div>

      {categoryGroup ? (
        <FilterGroup
          group={categoryGroup}
          activeFilters={activeFilters}
          onToggle={toggle}
        />
      ) : null}

      {categoryScopedAttributes && !categorySelected ? (
        <p className="rounded-xl border border-dashed border-border bg-surface/60 px-3 py-3 text-sm text-muted-foreground">
          Select a category to see matching filters (wattage, capacity, range…).
        </p>
      ) : null}

      {attributeGroups.map((group) => (
        <FilterGroup
          key={group.key}
          group={group}
          activeFilters={activeFilters}
          onToggle={toggle}
        />
      ))}
    </aside>
  );
}

function FilterGroup({
  group,
  activeFilters,
  onToggle,
}: {
  group: AttributeFilterGroup;
  activeFilters: Record<string, string[]>;
  onToggle: (key: string, value: string) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium text-ink">{group.label}</legend>
      <div className="flex flex-col gap-2">
        {group.options.map((option) => {
          const checked =
            activeFilters[group.key]?.includes(option.value) ?? false;
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-center gap-2 text-sm text-muted-foreground hover:text-ink"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(group.key, option.value)}
                className="size-4 rounded border-border text-brand accent-brand"
              />
              <span className="spec-number">{option.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
