import type { I18nProgress } from "@/lib/i18n-progress";

/**
 * Compact translation-progress display for record edit pages.
 *
 * Shows an at-a-glance read of how many translatable fields already have an
 * English overlay, with a hairline bar and pill state — the goal is to make
 * "this record is missing 3 EN fields" visible the moment the page loads,
 * not buried inside individual field labels.
 */
export function I18nProgressBar({ progress }: { progress: I18nProgress }) {
  const { filled, total, complete } = progress;
  const pct = total === 0 ? 0 : Math.round((filled / total) * 100);

  // Three states drive the pill colour:
  //   complete → orange (this record is fully bilingual)
  //   started  → metal-gray (some EN written, more to do)
  //   empty    → ghost (no EN at all yet)
  const tone = complete
    ? "border-aviation-orange/55 bg-aviation-orange/[0.08] text-aviation-orange"
    : filled > 0
      ? "border-carbon-black/15 text-carbon-black/65"
      : "border-carbon-black/10 text-carbon-black/40";

  return (
    <div
      className={`flex items-center gap-4 border ${tone} px-4 py-2.5`}
      role="status"
      aria-label={`Translation progress: ${filled} of ${total} fields`}
    >
      <span className="font-numeric text-[11px] uppercase tracking-[0.22em]">
        EN 翻译进度
      </span>
      <span className="relative block h-1 w-32 overflow-hidden bg-carbon-black/10">
        <span
          aria-hidden
          className={`absolute inset-y-0 left-0 block transition-all ${
            complete ? "bg-aviation-orange" : "bg-carbon-black/50"
          }`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className="font-numeric text-[11px] tracking-[0.06em]">
        {filled} / {total} · {pct}%
      </span>
    </div>
  );
}

/**
 * Tiny round indicator for list rows. Mirrors the progress bar's three-tone
 * vocabulary so editors can scan a list and spot rows that still need work.
 */
export function I18nStatusDot({ progress }: { progress: I18nProgress }) {
  const { filled, total, complete } = progress;
  const tone = complete
    ? "bg-aviation-orange"
    : filled > 0
      ? "bg-carbon-black/45"
      : "bg-carbon-black/15";
  const label = complete
    ? `EN ✓ (${filled}/${total})`
    : filled > 0
      ? `EN 部分翻译 (${filled}/${total})`
      : `EN 未翻译 (0/${total})`;
  return (
    <span
      className="inline-flex items-center gap-1.5 font-numeric text-[10px] uppercase tracking-[0.16em] text-carbon-black/55"
      title={label}
    >
      <span aria-hidden className={`inline-block h-1.5 w-1.5 rounded-full ${tone}`} />
      EN {filled}/{total}
    </span>
  );
}
