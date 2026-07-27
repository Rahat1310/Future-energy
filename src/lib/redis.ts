import { Redis } from "@upstash/redis";

/**
 * Lazy Upstash REST client. Returns null when env is missing so callers can
 * fail open (rate limits / impact never block real orders).
 */
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  return new Redis({ url, token });
}
