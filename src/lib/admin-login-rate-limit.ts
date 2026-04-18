import "server-only";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000;
const LOCKOUT_MS = 15 * 60 * 1000;

type LoginAttemptEntry = {
  attempts: number[];
  lockedUntil: number;
};

const getStore = () => {
  const globalStore = globalThis as typeof globalThis & {
    __marketAdminLoginRateLimit?: Map<string, LoginAttemptEntry>;
  };

  if (!globalStore.__marketAdminLoginRateLimit) {
    globalStore.__marketAdminLoginRateLimit = new Map<string, LoginAttemptEntry>();
  }

  return globalStore.__marketAdminLoginRateLimit;
};

const getClientIp = (requestHeaders: Headers) => {
  const forwardedFor = requestHeaders.get("x-forwarded-for");
  const realIp = requestHeaders.get("x-real-ip");
  const candidate = forwardedFor?.split(",")[0]?.trim() || realIp?.trim() || "unknown";

  return candidate || "unknown";
};

const getEntry = (identifier: string, now = Date.now()) => {
  const store = getStore();
  const current = store.get(identifier);

  const entry: LoginAttemptEntry = current
    ? {
        attempts: current.attempts.filter((timestamp) => now - timestamp <= WINDOW_MS),
        lockedUntil: current.lockedUntil > now ? current.lockedUntil : 0,
      }
    : {
        attempts: [],
        lockedUntil: 0,
      };

  store.set(identifier, entry);
  return entry;
};

export const getAdminLoginIdentifier = (requestHeaders: Headers) => getClientIp(requestHeaders);

export const getAdminLoginLock = (identifier: string, now = Date.now()) => {
  const entry = getEntry(identifier, now);

  if (entry.lockedUntil <= now) {
    return null;
  }

  return {
    retryAfterSeconds: Math.ceil((entry.lockedUntil - now) / 1000),
  };
};

export const registerAdminLoginFailure = (identifier: string, now = Date.now()) => {
  const entry = getEntry(identifier, now);
  entry.attempts.push(now);

  if (entry.attempts.length >= MAX_ATTEMPTS) {
    entry.lockedUntil = now + LOCKOUT_MS;
    entry.attempts = [];
  }

  getStore().set(identifier, entry);

  return getAdminLoginLock(identifier, now);
};

export const clearAdminLoginFailures = (identifier: string) => {
  getStore().delete(identifier);
};
