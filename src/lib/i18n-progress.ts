/**
 * Translation-progress helpers for the admin panel.
 *
 * Given a record and the list of fields that carry English overlays, these
 * functions compute "how much of the EN side is filled" so editors can see
 * coverage at a glance — both as a per-record progress bar and as a status
 * dot in list views.
 */

export type I18nProgress = {
  /** Total number of fields that *could* be translated. */
  total: number;
  /** Number of fields that have a non-empty English value. */
  filled: number;
  /** Convenience boolean: every translatable field is covered. */
  complete: boolean;
};

function isFilled(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return false;
}

/**
 * Count English overlays present in `record` against the list of base field
 * keys that *can* carry an overlay.
 *
 * @example
 *   computeProgress(record, ["title", "summary", "task"])
 *   // → { total: 3, filled: 2, complete: false }
 */
export function computeProgress(
  record: Record<string, unknown>,
  baseKeys: string[]
): I18nProgress {
  let filled = 0;
  for (const key of baseKeys) {
    if (isFilled(record[`${key}En`])) filled += 1;
  }
  return { total: baseKeys.length, filled, complete: filled === baseKeys.length };
}

/** Field keys that participate in i18n on each collection type. */
export const I18N_FIELDS = {
  case: ["title", "summary", "location", "time", "task", "result"],
  scenario: ["name", "headline", "painPoint", "taskFlow", "cta"],
  news: ["title", "summary", "body"],
  product: [
    "displayName",
    "category",
    "strategicRole",
    "summary",
    "positioning",
    "narrative",
    "ctaContext",
    "keyCapabilities"
  ]
} as const;
