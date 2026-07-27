import { Ratelimit } from "@upstash/ratelimit";
import { headers } from "next/headers";
import { getRedis } from "@/lib/redis";

/** Sliding window — 5 submissions / minute / IP for inquiry + checkout only. */
const WINDOW = "1 m";
const LIMIT = 5;

export type RateLimitResult =
  | { ok: true }
  | { ok: false; error: string; status: 429 };

function getLimiter(prefix: string): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(LIMIT, WINDOW),
    prefix: `ratelimit:${prefix}`,
    analytics: false,
  });
}

async function clientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "anonymous";
  }
  return h.get("x-real-ip")?.trim() || "anonymous";
}

/**
 * Rate-limit a sensitive mutation by IP.
 * Fail-open: if Redis is unset/unreachable, allow the request.
 */
export async function enforceMutationRateLimit(
  bucket: "inquiry" | "checkout",
): Promise<RateLimitResult> {
  const limiter = getLimiter(bucket);
  if (!limiter) return { ok: true };

  try {
    const ip = await clientIp();
    const result = await limiter.limit(ip);
    if (result.success) return { ok: true };

    return {
      ok: false,
      status: 429,
      error: "Please try again in a moment — too many requests.",
    };
  } catch (error) {
    console.warn(`[ratelimit] ${bucket} check failed, allowing request:`, error);
    return { ok: true };
  }
}
