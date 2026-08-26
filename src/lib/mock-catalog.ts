/**
 * Shared mock catalog when the DB is empty or unreachable.
 * Derived from the canonical product data in @/data/products.ts.
 */

import {
  products as CATALOG_PRODUCTS,
  CATEGORY_SLUG_MAP,
  SLUG_TO_CATEGORY_NAME,
  getSolarPanelTotal,
  type Product,
} from "@/data/products";

export type MockCategory = {
  id: string;
  name: string;
  slug: string;
};

export type MockVariant = {
  id: string;
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  attributes: Record<string, string | number>;
};

export type MockProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: MockCategory;
  variants: MockVariant[];
  /** Optional badge label shown on cards, e.g. "Featured" or "Sale" */
  badge?: string;
};

// Build categories from the catalog data
const categoryMap = new Map<string, MockCategory>();
for (const p of CATALOG_PRODUCTS) {
  const slug = CATEGORY_SLUG_MAP[p.category];
  if (!categoryMap.has(slug)) {
    categoryMap.set(slug, {
      id: `cat-${slug}`,
      name: SLUG_TO_CATEGORY_NAME[slug] ?? p.category,
      slug,
    });
  }
}

export const MOCK_CATEGORIES: MockCategory[] = [...categoryMap.values()];

/** Build a human-readable description for a product */
function buildDescription(p: Product): string {
  const parts: string[] = [];
  if (p.category === "Lithium Battery") {
    parts.push(`LiFePO4 lithium battery for IPS/solar home backup.`);
    if (p.capacity) parts.push(`Capacity: ${p.capacity}.`);
    if (p.voltage) parts.push(`Voltage: ${p.voltage}.`);
    if (p.warranty) parts.push(`Warranty: ${p.warranty}.`);
    parts.push("Built-in BMS with deep discharge protection.");
  } else if (p.category === "Hybrid Inverter") {
    parts.push(`Hybrid solar inverter with MPPT charging.`);
    if (p.power) parts.push(`Output power: ${p.power}.`);
    if (p.voltage) parts.push(`Battery voltage: ${p.voltage}.`);
    if (p.warranty) parts.push(`Warranty: ${p.warranty}.`);
    parts.push("Supports grid, solar, and battery inputs simultaneously.");
  } else if (p.category === "Solar Panel") {
    parts.push("High-efficiency monocrystalline solar panel.");
    if (p.power) parts.push(`Power: ${p.power}.`);
    if (p.warranty) parts.push(`Warranty: ${p.warranty}.`);
    if (p.unit === "/ Watt") {
      const total = getSolarPanelTotal(p);
      if (total) parts.push(`Estimated panel total: ?${total.toLocaleString("en-US")}.`);
    }
  } else if (p.category === "EasyBike Lithium Battery") {
    parts.push("High-performance lithium battery for EasyBike & electric bikes.");
    if (p.voltage) parts.push(`Voltage: ${p.voltage}.`);
    if (p.capacity) parts.push(`Capacity: ${p.capacity}.`);
  } else if (p.category === "Lead Acid Battery") {
    parts.push("Deep-cycle lead acid battery for general use.");
    if (p.voltage) parts.push(`Voltage: ${p.voltage}.`);
    if (p.capacity) parts.push(`Capacity: ${p.capacity}.`);
  } else if (p.category === "IPS Battery") {
    parts.push("High-performance battery designed for IPS backup systems.");
    if (p.voltage) parts.push(`Voltage: ${p.voltage}.`);
    if (p.capacity) parts.push(`Capacity: ${p.capacity}.`);
  } else if (p.category === "Mounted Lithium Battery") {
    parts.push("Space-saving wall-mounted lithium battery.");
    if (p.voltage) parts.push(`Voltage: ${p.voltage}.`);
    if (p.capacity) parts.push(`Capacity: ${p.capacity}.`);
  } else if (p.category === "Motorcycle Battery") {
    parts.push("Reliable motorcycle starting battery.");
    if (p.voltage) parts.push(`Voltage: ${p.voltage}.`);
  } else if (p.category === "Accessories & Parts") {
    parts.push("Solar energy system accessory.");
  }
  return parts.join(" ");
}

/** Extract numeric attributes from a product for variant filtering */
function buildAttributes(p: Product): Record<string, string | number> {
  const attrs: Record<string, string | number> = {};
  if (p.voltage) {
    // Extract primary voltage as number if possible (e.g. "12V" -> 12)
    const v = parseFloat(p.voltage);
    if (!isNaN(v)) attrs.voltage = v;
    else attrs.voltageLabel = p.voltage;
  }
  if (p.capacity) {
    // Extract capacity number (e.g. "100AH" -> 100)
    const c = parseFloat(p.capacity);
    if (!isNaN(c)) attrs.capacityAh = c;
  }
  if (p.power) {
    // Extract wattage (e.g. "1.2kW" -> 1200, "590W" -> 590)
    const kwMatch = p.power.match(/^([\d.]+)kW/i);
    const wMatch = p.power.match(/^(\d+)W$/i);
    if (kwMatch) attrs.wattage = Math.round(parseFloat(kwMatch[1]) * 1000);
    else if (wMatch) attrs.wattage = parseInt(wMatch[1], 10);
  }
  if (p.warranty) attrs.warranty = p.warranty;
  return attrs;
}

function buildBadge(p: Product): string | undefined {
  if (p.originalPriceBDT && p.originalPriceBDT > p.retailPriceBDT) return "Sale";
  // Mark the largest/premium batteries as Featured
  if (p.id === "bat-wm-48v-330ah" || p.id === "bat-wm-48v-200ah") return "Featured";
  return undefined;
}

export const MOCK_PRODUCTS: MockProduct[] = CATALOG_PRODUCTS.map((p) => {
  const categorySlug = CATEGORY_SLUG_MAP[p.category];
  const category = categoryMap.get(categorySlug)!;

  const variant: MockVariant = {
    id: `var-${p.id}`,
    sku: p.id.toUpperCase(),
    price: p.retailPriceBDT,
    originalPrice: p.originalPriceBDT,
    stock: 10, // default stock for mock data
    attributes: buildAttributes(p),
  };

  return {
    id: p.id,
    name: p.title,
    slug: p.id,
    description: buildDescription(p),
    category,
    variants: [variant],
    badge: buildBadge(p),
  };
});

export function getMockProductBySlug(slug: string): MockProduct | null {
  return MOCK_PRODUCTS.find((product) => product.slug === slug) ?? null;
}

export function getMockFeaturedProducts() {
  return MOCK_PRODUCTS.map((product) => {
    const lowest = [...product.variants].sort((a, b) => a.price - b.price)[0];
    const attrs = lowest.attributes;
    let keySpec: string | null = null;
    if (typeof attrs.capacityAh === "number") keySpec = `${attrs.capacityAh}Ah`;
    else if (typeof attrs.rangeKm === "number") keySpec = `${attrs.rangeKm}km range`;
    else if (typeof attrs.wattage === "number") keySpec = `${attrs.wattage}W`;
    else if (typeof attrs.ratedCurrentA === "number") keySpec = `${attrs.ratedCurrentA}A`;

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      categorySlug: product.category.slug,
      price: lowest.price,
      originalPrice: lowest.originalPrice,
      keySpec,
      badge: product.badge,
    };
  });
}
