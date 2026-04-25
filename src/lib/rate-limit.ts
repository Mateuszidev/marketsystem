import { ApiError } from "@/lib/errors";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

declare global {
  var rateLimitBuckets: Map<string, RateLimitBucket> | undefined;
}

const buckets = global.rateLimitBuckets ?? new Map<string, RateLimitBucket>();

if (process.env.NODE_ENV !== "production") {
  global.rateLimitBuckets = buckets;
}

const getClientIp = (request: Request) => {
  const forwardedFor = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  return forwardedFor || request.headers.get("x-real-ip") || request.headers.get("cf-connecting-ip") || "unknown";
};

const cleanupExpiredBuckets = (now: number) => {
  if (buckets.size < 1000) {
    return;
  }

  for (const [key, bucket] of buckets.entries()) {
    if (bucket.resetAt <= now) {
      buckets.delete(key);
    }
  }
};

export const assertRateLimit = (
  request: Request,
  options: {
    keyPrefix: string;
    limit: number;
    windowMs: number;
    message?: string;
  },
) => {
  const now = Date.now();
  const key = `${options.keyPrefix}:${getClientIp(request)}`;
  const current = buckets.get(key);

  cleanupExpiredBuckets(now);

  if (!current || current.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return;
  }

  if (current.count >= options.limit) {
    throw new ApiError(options.message || "Muitas requisicoes. Tente novamente em instantes.", 429);
  }

  current.count += 1;
};
