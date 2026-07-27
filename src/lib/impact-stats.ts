/**
 * @deprecated Prefer `@/lib/impact` — Redis-backed totals for the homepage.
 * Kept briefly so any leftover imports still typecheck during the cutover.
 */
export type { ImpactStats } from "@/lib/impact";

import type { ImpactStats } from "@/lib/impact";

/** @deprecated Mocked totals — homepage now reads Redis via getImpactStats(). */
export const MOCK_IMPACT_STATS: ImpactStats = {
  co2SavedKg: 0,
  treesEquivalent: 0,
  homesPowered: 0,
};
