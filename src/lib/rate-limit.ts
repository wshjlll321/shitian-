/**
 * Single-instance, in-memory rate limiter.
 *
 * Trade-off: this lives in process memory, so it resets on restart and
 * doesn't share state between dev/prod processes. For a single-instance
 * deployment (the current shape of this site) it's the right size: it
 * stops casual brute-force on /api/admin/login and bot spam on
 * /api/inquiries without dragging in Redis. If we ever scale to multiple
 * processes, swap this implementation for one backed by a shared store
 * and the call sites keep working.
 *
 * Keys are arbitrary strings — callers typically build them as
 * `"login:" + ip` or `"inquiry:" + ip` so different endpoints don't share
 * the same bucket.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  options: { max: number; windowMs: number }
): { ok: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + options.windowMs };
    buckets.set(key, fresh);
    return { ok: true, remaining: options.max - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= options.max) {
    return { ok: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: options.max - existing.count,
    resetAt: existing.resetAt
  };
}

/**
 * Best-effort client ip — reads common reverse-proxy headers, then falls
 * back to a fixed bucket for local requests. Never trust this for
 * security-sensitive decisions; it's only here to keep one client from
 * exhausting limits for everyone.
 */
export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return (
    request.headers.get("x-real-ip") ||
    request.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}
