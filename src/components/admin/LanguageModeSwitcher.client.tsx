"use client";

import type { I18nProgress } from "@/lib/i18n-progress";

/** Three editing modes for any bilingual record edit page. */
export type EditMode = "zh" | "en" | "both";

type LanguageModeSwitcherProps = {
  mode: EditMode;
  onChange: (next: EditMode) => void;
  /** Optional translation progress shown inline so the operator sees how
   *  much English is still missing without leaving the toolbar. */
  progress?: I18nProgress;
};

const MODES: { value: EditMode; label: string; sub: string }[] = [
  { value: "zh", label: "中文", sub: "主语言" },
  { value: "en", label: "English", sub: "翻译" },
  { value: "both", label: "对照", sub: "Compare" }
];

/**
 * Page-level editor mode toggle. Replaces the per-field "+ 添加 English"
 * affordance with a single decision at the top of the page:
 *
 *  - 中文 mode hides every English overlay so monolingual editing stays
 *    quiet (the existing CN workflow keeps working as-is).
 *  - English mode brings every translation target to the surface, with the
 *    Chinese value shown as a small read-only reference above the input.
 *  - 对照 mode renders both columns side-by-side for proof-reading.
 *
 * Inline progress (e.g. EN 4/12) keeps the "how much is still missing"
 * answer visible without scrolling.
 */
export function LanguageModeSwitcher({
  mode,
  onChange,
  progress
}: LanguageModeSwitcherProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 border border-carbon-black/12 bg-surface-warm px-4 py-3">
      <span className="font-numeric text-[10px] uppercase tracking-[0.24em] text-metal-gray">
        编辑模式
      </span>
      <div
        role="tablist"
        aria-label="编辑模式 / Edit mode"
        className="flex items-stretch border border-carbon-black/15"
      >
        {MODES.map((m) => {
          const active = m.value === mode;
          return (
            <button
              key={m.value}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(m.value)}
              className={`flex items-baseline gap-2 border-r border-carbon-black/10 px-3.5 py-1.5 text-[12px] transition last:border-r-0 ${
                active
                  ? "bg-aviation-orange text-surface-warm"
                  : "bg-white text-carbon-black/70 hover:bg-surface-porcelain"
              }`}
            >
              <span className="font-medium">{m.label}</span>
              <span
                className={`font-numeric text-[10px] uppercase tracking-[0.16em] ${
                  active ? "text-surface-warm/75" : "text-carbon-black/40"
                }`}
              >
                {m.sub}
              </span>
            </button>
          );
        })}
      </div>

      {progress ? (
        <div className="ml-auto flex items-center gap-3">
          <span className="font-numeric text-[10px] uppercase tracking-[0.24em] text-metal-gray">
            EN 翻译进度
          </span>
          <span className="relative block h-1 w-32 overflow-hidden bg-carbon-black/10">
            <span
              aria-hidden
              className={`absolute inset-y-0 left-0 block transition-all ${
                progress.complete ? "bg-aviation-orange" : "bg-carbon-black/50"
              }`}
              style={{
                width: `${
                  progress.total === 0
                    ? 0
                    : Math.round((progress.filled / progress.total) * 100)
                }%`
              }}
            />
          </span>
          <span className="font-numeric text-[11px] tracking-[0.06em] text-carbon-black/70">
            {progress.filled} / {progress.total}
          </span>
        </div>
      ) : null}
    </div>
  );
}
