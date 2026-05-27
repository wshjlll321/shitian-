/**
 * Resolves the admin session signing secret, with a hard guarantee that
 * production deployments always set a real value via env var.
 *
 * Why this lives in its own module:
 * - Both the proxy/middleware (Edge runtime) and the regular Node auth
 *   helper read the same secret. Sharing this lookup keeps them in lockstep.
 * - The previous setup silently fell back to a hardcoded constant if the
 *   env var was unset. That constant is in the repo, so a forgotten
 *   `ADMIN_SESSION_SECRET` in prod meant attackers could mint valid
 *   admin cookies. We now refuse to start instead of failing open.
 */

const DEV_FALLBACK = "st-aviation-cms-local-dev-secret";

function readSecret(): string {
  const raw = process.env.ADMIN_SESSION_SECRET?.trim();
  if (raw && raw.length >= 16) return raw;

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short. Set a 32+ char random string in the production env before starting."
    );
  }

  if (process.env.NODE_ENV !== "test") {
    console.warn(
      "[auth] ADMIN_SESSION_SECRET not set — using dev fallback. Never deploy this way."
    );
  }
  return DEV_FALLBACK;
}

export const SESSION_SECRET_BYTES = new TextEncoder().encode(readSecret());
