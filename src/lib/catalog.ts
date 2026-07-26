/** Shared formatting helpers for catalog data pulled from Prisma. */

import { attributeLabel } from "@/lib/shop-filters";

type ProductAttributes = Record<string, unknown>;

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

/** Keys preferred as variant-picker axes (shopper-facing specs first). */
const SELECTOR_AXIS_PRIORITY = [
  "capacityAh",
  "wattage",
  "rangeKm",
  "color",
  "voltage",
  "ratedCurrentA",
  "motorPowerW",
  "topSpeedKmph",
  "chemistry",
  "cellType",
];

export function parseAttributes(raw: unknown): ProductAttributes {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  return raw as ProductAttributes;
}

/**
 * Picks the single most relevant spec to show on a product card, based on
 * whichever category-specific attribute is present (see ProductVariant.attributes
 * in prisma/schema.prisma). Priority order favors the numbers customers shop by:
 * capacity, then range, then wattage, then current/voltage as a fallback.
 */
export function getKeySpec(attributes: unknown): string | null {
  const attrs = parseAttributes(attributes);

  if (typeof attrs.capacityAh === "number") return `${attrs.capacityAh}Ah`;
  if (typeof attrs.rangeKm === "number") return `${attrs.rangeKm}km range`;
  if (typeof attrs.wattage === "number") return `${attrs.wattage}W`;
  if (typeof attrs.ratedCurrentA === "number") return `${attrs.ratedCurrentA}A`;
  if (typeof attrs.voltage === "number") return `${attrs.voltage}V`;

  return null;
}

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-US")}`;
}

/** Format a single attribute value for mono display (selector chips + spec table). */
export function formatAttributeValue(key: string, value: unknown): string {
  if (typeof value === "number" && Number.isFinite(value)) {
    const unit = UNIT_SUFFIX[key] ?? "";
    if (key === "rangeKm") return `${value}${unit} range`;
    if (key === "cycleLife") return `${value.toLocaleString("en-US")}${unit}`;
    if (key === "efficiency") return `${value}${unit}`;
    return `${value}${unit}`;
  }
  if (typeof value === "string") return value;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value ?? "");
}

export type SpecEntry = {
  key: string;
  label: string;
  /** Raw value for matching selector state. */
  raw: string | number | boolean;
  /** Display string (mono for numbers). */
  display: string;
  isNumeric: boolean;
};

/** All attributes on a variant as labeled spec rows. */
export function listSpecEntries(attributes: unknown): SpecEntry[] {
  const attrs = parseAttributes(attributes);
  return Object.entries(attrs)
    .filter(([, value]) => value !== null && value !== undefined && value !== "")
    .map(([key, value]) => {
      const isNumeric = typeof value === "number" && Number.isFinite(value);
      return {
        key,
        label: attributeLabel(key),
        raw: value as string | number | boolean,
        display: formatAttributeValue(key, value),
        isNumeric,
      };
    })
    .sort((a, b) => {
      const ai = SELECTOR_AXIS_PRIORITY.indexOf(a.key);
      const bi = SELECTOR_AXIS_PRIORITY.indexOf(b.key);
      if (ai === -1 && bi === -1) return a.key.localeCompare(b.key);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
}

/**
 * Attribute keys whose values differ across variants — used as selector axes.
 * Inferred from data; not hardcoded per category.
 */
export function getVariantSelectorAxes(
  variants: { attributes: unknown }[],
): string[] {
  if (variants.length < 2) return [];

  const valuesByKey = new Map<string, Set<string>>();

  for (const variant of variants) {
    const attrs = parseAttributes(variant.attributes);
    for (const [key, value] of Object.entries(attrs)) {
      if (value === null || value === undefined || value === "") continue;
      const set = valuesByKey.get(key) ?? new Set<string>();
      set.add(JSON.stringify(value));
      valuesByKey.set(key, set);
    }
  }

  const differing = [...valuesByKey.entries()]
    .filter(([, set]) => set.size > 1)
    .map(([key]) => key);

  differing.sort((a, b) => {
    const ai = SELECTOR_AXIS_PRIORITY.indexOf(a);
    const bi = SELECTOR_AXIS_PRIORITY.indexOf(b);
    if (ai === -1 && bi === -1) return a.localeCompare(b);
    if (ai === -1) return 1;
    if (bi === -1) return -1;
    return ai - bi;
  });

  return differing;
}

export function attributeValueKey(value: unknown): string {
  return JSON.stringify(value);
}
