import { cache, CACHE_TTL } from "@/lib/cache";
import { logger } from "@/lib/logger";

type RedisClient = {
  get: (key: string) => Promise<string | null>;
  set: (
    key: string,
    value: string,
    options?: { ex?: number }
  ) => Promise<unknown>;
  del: (key: string) => Promise<unknown>;
};

let redisClient: RedisClient | null = null;
let redisInitAttempted = false;

async function getRedisClient(): Promise<RedisClient | null> {
  if (redisInitAttempted) return redisClient;
  redisInitAttempted = true;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) return null;

  try {
    const { Redis } = await import("@upstash/redis");
    redisClient = new Redis({ url, token }) as RedisClient;
    logger.info("Upstash Redis cache connected");
  } catch (error) {
    logger.warn("Upstash Redis unavailable, using in-memory cache", {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  return redisClient;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const redis = await getRedisClient();
  if (redis) {
    try {
      const raw = await redis.get(key);
      if (raw === null) return null;
      return JSON.parse(String(raw)) as T;
    } catch {
      logger.warn("Redis get failed, falling back to memory", { key });
    }
  }
  return cache.get<T>(key);
}

export async function cacheSet<T>(
  key: string,
  data: T,
  ttlSeconds: number = CACHE_TTL.SEARCH
): Promise<void> {
  const redis = await getRedisClient();
  if (redis) {
    try {
      await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
      return;
    } catch {
      logger.warn("Redis set failed, falling back to memory", { key });
    }
  }
  cache.set(key, data, ttlSeconds);
}

export async function cacheDelete(key: string): Promise<void> {
  const redis = await getRedisClient();
  if (redis) {
    try {
      await redis.del(key);
    } catch {
      // fall through
    }
  }
  cache.delete(key);
}

export { CACHE_TTL };
