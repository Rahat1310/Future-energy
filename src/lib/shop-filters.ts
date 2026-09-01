/**
 * Infer sidebar filters from ProductVariant.attributes JSON across a category.
 * Keys and buckets come from the data — no per-category hardcoding.
 */

export type SortOption = "price-asc" | "price-desc" | "newest";

export type NumericFilterOption = {
  kind: "numeric";
  /** Inclusive range; exact match when min === max. */
  min: number;
  max: number;
  label: string;
  value: string;
};

export type StringFilterOption = {
  kind: "string";
  label: string;
  value: string;
};

export type FilterOption = NumericFilterOption | StringFilterOption;

export type AttributeFilterGroup = {
  key: string;
  label: string;
  options: FilterOption[];
};

export type ActiveFilters = Record<string, string[]>;

const UNIT_SUFFIX: Record<string, string> = {
  capacityAh: "Ah",
  wattage: "W",
  rangeKm: "km",
  voltage: "V",
  ratedCurrentA: "A",
  motorPowerW: "W",
  topSpeedKmph: "km/h",
  cycleLife: " cycles",
  efficiency: "%",
};

/** camelCase / known keys → human label for the sidebar. */
export function attributeLabel(key: string): string {
  const known: Record<string, string> = {
    capacityAh: "Capacity",
    wattage: "Wattage",
    rangeKm: "Range",
    voltage: "Voltage",
    ratedCurrentA: "Current",
    motorPowerW: "Motor power",
    topSpeedKmph: "Top speed",
    cycleLife: "Cycle life",
    efficiency: "Efficiency",
    chemistry: "Chemistry",
    cellType: "Cell type",
    type: "Type",
  };
  if (known[key]) return known[key];
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function formatNumericLabel(key: string, n: number): string {
  const unit = UNIT_SUFFIX[key] ?? "";
  if (key === "rangeKm") return `${n}${unit} range`;
  if (key === "cycleLife") return `${n.toLocaleString("en-US")}${unit}`;
  if (key === "efficiency") return `${n}${unit}`;
  return `${n}${unit}`;
}

function formatRangeLabel(key: string, min: number, max: number): string {
  if (min === max) return formatNumericLabel(key, min);
  const unit = UNIT_SUFFIX[key] ?? "";
  if (key === "rangeKm") return `${min}–${max}${unit}`;
  if (key === "cycleLife")
    return `${min.toLocaleString("en-US")}–${max.toLocaleString("en-US")}${unit}`;
  return `${min}–${max}${unit}`;
}

function asAttributes(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as Record<string, unknown>;
}

/**
 * Build filter groups from every variant's attributes in the category.
 * Numeric keys become range buckets; string keys become discrete options.
 * Keys with fewer than 2 distinct values are skipped (nothing to filter).
 */
export function inferAttributeFilters(
  attributeList: unknown[],
): AttributeFilterGroup[] {
  const numericValues = new Map<string, number[]>();
  const stringValues = new Map<string, Set<string>>();

  const IGNORED_KEYS = new Set(["variant", "warranty", "compatibility", "cellType", "type"]);

  for (const raw of attributeList) {
    const attrs = asAttributes(raw);
    for (const [key, value] of Object.entries(attrs)) {
      if (IGNORED_KEYS.has(key)) continue;

      if (typeof value === "number" && Number.isFinite(value)) {
        const list = numericValues.get(key) ?? [];
        list.push(value);
        numericValues.set(key, list);
      } else if (typeof value === "string" && value.trim()) {
        const set = stringValues.get(key) ?? new Set<string>();
        set.add(value.trim());
        stringValues.set(key, set);
      }
    }
  }

  const groups: AttributeFilterGroup[] = [];

  for (const [key, values] of numericValues) {
    const unique = [...new Set(values)].sort((a, b) => a - b);
    if (unique.length < 2) continue;

    const options = buildNumericOptions(key, unique);
    if (options.length >= 2) {
      groups.push({ key, label: attributeLabel(key), options });
    }
  }

  for (const [key, set] of stringValues) {
    const unique = [...set].sort((a, b) => a.localeCompare(b));
    if (unique.length < 1) continue;
    groups.push({
      key,
      label: attributeLabel(key),
      options: unique.map((value) => ({
        kind: "string" as const,
        label: value,
        value,
      })),
    });
  }

  // Stable order: prefer shopper-facing specs first, then alpha.
  const priority = [
    "capacityAh",
    "wattage",
    "rangeKm",
    "voltage",
    "ratedCurrentA",
    "motorPowerW",
    "topSpeedKmph",
    "chemistry",
    "cellType",
    "type",
    "efficiency",
    "cycleLife",
  ];
  groups.sort((a, b) => {
    const ai = priority.indexOf(a.key);
    const bi = priority.indexOf(b.key);
    if (ai === -1 && bi === -1) return a.key.localeCompare(b.key);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return groups;
}

/**
 * Few distinct values → one option each (exact).
 * Many → ~3–4 inclusive ranges spanning min→max.
 */
function buildNumericOptions(
  key: string,
  sortedUnique: number[],
): NumericFilterOption[] {
  if (sortedUnique.length <= 5) {
    return sortedUnique.map((n) => ({
      kind: "numeric" as const,
      min: n,
      max: n,
      label: formatNumericLabel(key, n),
      value: `${n}-${n}`,
    }));
  }

  const bucketCount = Math.min(4, sortedUnique.length);
  const buckets: NumericFilterOption[] = [];
  for (let i = 0; i < bucketCount; i++) {
    const startIdx = Math.floor((i * sortedUnique.length) / bucketCount);
    const endIdx =
      Math.floor(((i + 1) * sortedUnique.length) / bucketCount) - 1;
    const min = sortedUnique[startIdx];
    const max = sortedUnique[endIdx];
    buckets.push({
      kind: "numeric",
      min,
      max,
      label: formatRangeLabel(key, min, max),
      value: `${min}-${max}`,
    });
  }
  return buckets;
}

export function parseSort(raw: string | string[] | undefined): SortOption {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (value === "price-desc" || value === "newest" || value === "price-asc") {
    return value;
  }
  return "price-asc";
}

/** Pull active attribute filters from searchParams (skip `sort`). */
export function parseActiveFilters(
  searchParams: Record<string, string | string[] | undefined>,
  knownKeys: string[],
): ActiveFilters {
  const active: ActiveFilters = {};
  for (const key of knownKeys) {
    const raw = searchParams[key];
    if (!raw) continue;
    const parts = (Array.isArray(raw) ? raw : [raw])
      .flatMap((chunk) => chunk.split(","))
      .map((s) => s.trim())
      .filter(Boolean);
    if (parts.length) active[key] = parts;
  }
  return active;
}

function variantMatchesFilters(
  attributes: unknown,
  active: ActiveFilters,
): boolean {
  if (Object.keys(active).length === 0) return true;
  const attrs = asAttributes(attributes);

  for (const [key, selected] of Object.entries(active)) {
    if (selected.length === 0) continue;
    const value = attrs[key];
    const matched = selected.some((token) => {
      if (typeof value === "number") {
        const [minStr, maxStr] = token.split("-");
        const min = Number(minStr);
        const max = Number(maxStr);
        if (!Number.isFinite(min) || !Number.isFinite(max)) return false;
        return value >= min && value <= max;
      }
      if (typeof value === "string") {
        return value === token;
      }
      return false;
    });
    if (!matched) return false;
  }
  return true;
}

export type FilterableVariant = {
  id?: string;
  sku?: string;
  stock?: number;
  price: number;
  /** Original (pre-discount) price for strikethrough display. */
  originalPrice?: number;
  attributes: unknown;
};

export type FilterableProduct = {
  id: string;
  name: string;
  slug: string;
  /** Used for "newest" — cuid embeds creation time. */
  idSortKey: string;
  variants: FilterableVariant[];
  /** Present on the full-catalog listing for category chips. */
  categorySlug?: string;
  categoryName?: string;
  description?: string;
  image?: string | null;
  /** Optional badge label shown on cards, e.g. "Featured" or "Sale" */
  badge?: string;
};

export function parseSearchQuery(
  searchParams: Record<string, string | string[] | undefined>,
): string {
  const raw = searchParams.q;
  const value = Array.isArray(raw) ? raw[0] : raw;
  const trimmed = value?.trim() ?? "";
  // Cap length client-path too — server searchProducts also validates via Zod.
  return trimmed.slice(0, 100);
}

/** Text + optional category slug pre-filter before attribute filters. */
export function prefilterCatalog(
  products: FilterableProduct[],
  query: string,
  categorySlugs: string[],
): FilterableProduct[] {
  const q = query.trim().toLowerCase();
  return products.filter((product) => {
    if (categorySlugs.length > 0) {
      if (!product.categorySlug || !categorySlugs.includes(product.categorySlug)) {
        return false;
      }
    }
    if (!q) return true;
    const haystack = `${product.name} ${product.description ?? ""}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function buildCategoryFilterGroup(
  products: FilterableProduct[],
): AttributeFilterGroup | null {
  const bySlug = new Map<string, string>();
  for (const product of products) {
    if (product.categorySlug && product.categoryName) {
      bySlug.set(product.categorySlug, product.categoryName);
    }
  }
  if (bySlug.size < 2) return null;
  const options = [...bySlug.entries()]
    .sort((a, b) => a[1].localeCompare(b[1]))
    .map(([value, label]) => ({
      kind: "string" as const,
      label,
      value,
    }));
  return { key: "category", label: "Category", options };
}

export type ListedProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  /** Original (pre-discount) price for strikethrough display. */
  originalPrice?: number;
  keySpec: string | null;
  /** Optional badge label shown on cards, e.g. "Featured" or "Sale" */
  badge?: string;
  image?: string | null;
  variantId?: string;
  variantSku?: string;
  stock?: number;
  categorySlug?: string;
  categoryName?: string;
  hasMultipleVariants?: boolean;
};

/**
 * Keep products that have at least one matching variant; expose the
 * lowest-price matching variant for card price/spec. Then sort.
 */
export function filterAndSortProducts(
  products: FilterableProduct[],
  active: ActiveFilters,
  sort: SortOption,
  getKeySpec: (attributes: unknown) => string | null,
): ListedProduct[] {
  const listed: ListedProduct[] = [];

  for (const product of products) {
    const matching = product.variants.filter((v) =>
      variantMatchesFilters(v.attributes, active),
    );
    if (matching.length === 0) continue;

    matching.sort((a, b) => a.price - b.price);
    const cheapest = matching[0];
    listed.push({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: cheapest.price,
      originalPrice: cheapest.originalPrice,
      keySpec: getKeySpec(cheapest.attributes),
      badge: product.badge,
      image: product.image,
      variantId: cheapest.id,
      variantSku: cheapest.sku,
      stock: cheapest.stock,
      categorySlug: product.categorySlug,
      categoryName: product.categoryName,
      hasMultipleVariants: product.variants.length > 1,
    });
  }

  listed.sort((a, b) => {
    if (sort === "price-asc") return a.price - b.price;
    if (sort === "price-desc") return b.price - a.price;
    // newest: higher cuid ≈ newer
    const productA = products.find((p) => p.id === a.id);
    const productB = products.find((p) => p.id === b.id);
    return (productB?.idSortKey ?? "").localeCompare(productA?.idSortKey ?? "");
  });

  return listed;
}
