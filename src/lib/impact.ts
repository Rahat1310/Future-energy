import { getRedis } from "@/lib/redis";

export const IMPACT_CO2_KEY = "impact:co2_kg";
export const IMPACT_TREES_KEY = "impact:trees";

/**
 * Starting totals shown before any PAID orders land.
 * SET NX once into Redis — later admin PAID events incrby on top.
 */
const BASELINE_CO2_KG = 12_850;
const BASELINE_TREES = 512;

export type ImpactStats = {
  co2SavedKg: number;
  treesEquivalent: number;
  /** Soft display metric — not backed by Redis until methodology exists. */
  homesPowered: number;
};

export type PaidOrderImpactInput = {
  orderId: string;
  /** Order total in BDT — only used by the placeholder estimator. */
  totalBdt: number;
  itemCount: number;
};

/**
 * TODO(launch): replace with a real methodology before going live.
 *
 * Placeholder only — do NOT treat these as scientific CO₂ / tree figures.
 * Until product-level offsets (panel wattage × lifetime energy, battery
 * chemistry, motorcycle km displaced, etc.) are defined, we use a flat
 * per-order estimate so Redis keys and the homepage counter can be wired.
 */
export function estimateImpactForPaidOrder(
  order: PaidOrderImpactInput,
): { co2Kg: number; trees: number } {
  // Flat placeholder: ~50 kg CO₂ and ~2 trees-equivalent per paid order,
  // lightly scaled by line-item count so multi-item orders move the needle.
  const scale = Math.max(1, order.itemCount);
  return {
    co2Kg: 50 * scale,
    trees: 2 * scale,
  };
}

/** Seed baseline totals once if Redis keys are missing or still zero. */
async function ensureImpactBaseline(
  redis: NonNullable<ReturnType<typeof getRedis>>,
): Promise<void> {
  try {
    const [co2, trees] = await Promise.all([
      redis.get<number | string | null>(IMPACT_CO2_KEY),
      redis.get<number | string | null>(IMPACT_TREES_KEY),
    ]);

    const writes: Promise<unknown>[] = [];
    if (co2 == null || Number(co2) === 0) {
      writes.push(redis.set(IMPACT_CO2_KEY, BASELINE_CO2_KG));
    }
    if (trees == null || Number(trees) === 0) {
      writes.push(redis.set(IMPACT_TREES_KEY, BASELINE_TREES));
    }
    if (writes.length > 0) await Promise.all(writes);
  } catch (error) {
    console.warn("[impact] Baseline seed failed:", error);
  }
}

/** Read Redis impact totals. Fail-open to baseline if Redis is unavailable. */
export async function getImpactStats(): Promise<ImpactStats> {
  const redis = getRedis();
  if (!redis) {
    return {
      co2SavedKg: BASELINE_CO2_KG,
      treesEquivalent: BASELINE_TREES,
      homesPowered: Math.floor(BASELINE_TREES / 4),
    };
  }

  try {
    await ensureImpactBaseline(redis);

    const [co2, trees] = await Promise.all([
      redis.get<number | string | null>(IMPACT_CO2_KEY),
      redis.get<number | string | null>(IMPACT_TREES_KEY),
    ]);

    const co2SavedKg = Number(co2 ?? BASELINE_CO2_KG) || BASELINE_CO2_KG;
    const treesEquivalent = Number(trees ?? BASELINE_TREES) || BASELINE_TREES;

    return {
      co2SavedKg,
      treesEquivalent,
      // Placeholder display only — not stored; refine with methodology later.
      homesPowered: Math.floor(treesEquivalent / 4),
    };
  } catch (error) {
    console.warn("[impact] Redis read failed, returning baseline:", error);
    return {
      co2SavedKg: BASELINE_CO2_KG,
      treesEquivalent: BASELINE_TREES,
      homesPowered: Math.floor(BASELINE_TREES / 4),
    };
  }
}

/**
 * Increment impact keys after an order becomes PAID.
 * Fail-open: Redis errors are logged and never thrown to the caller.
 */
export async function recordImpactForPaidOrder(
  order: PaidOrderImpactInput,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;

  await ensureImpactBaseline(redis);

  const { co2Kg, trees } = estimateImpactForPaidOrder(order);

  try {
    await Promise.all([
      redis.incrby(IMPACT_CO2_KEY, co2Kg),
      redis.incrby(IMPACT_TREES_KEY, trees),
    ]);
  } catch (error) {
    console.warn(
      `[impact] Failed to increment Redis for order ${order.orderId}:`,
      error,
    );
  }
}
