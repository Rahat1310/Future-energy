export type ImpactStats = {
  co2SavedKg: number;
  treesEquivalent: number;
};

/**
 * TODO(build order #8 — see project.md): these totals are mocked. Replace
 * with a real aggregation over completed Orders/OrderItems (e.g. sum a
 * per-unit CO2-offset figure derived from each ProductVariant's attributes)
 * once the solar savings calculator ships.
 *
 * Kept in a plain (non "use client") module deliberately: Server Components
 * can only resolve component references from "use client" files, not plain
 * data exports, so this constant lives here instead of in impact-counter.tsx.
 */
export const MOCK_IMPACT_STATS: ImpactStats = {
  co2SavedKg: 128450,
  treesEquivalent: 5840,
};
