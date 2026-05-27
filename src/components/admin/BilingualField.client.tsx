"use client";

import type { EditMode } from "@/components/admin/LanguageModeSwitcher.client";

/**
 * Bilingual editor for a single field, governed by a page-level edit mode:
 *
 *  - `zh`   — show only the Chinese input. The English overlay is hidden
 *             completely so monolingual editing stays uncluttered. A small
 *             pill on the label still tells the operator whether an English
 *             translation already exists.
 *  - `en`   — show the Chinese value as a small, read-only reference *above*
 *             the input, and put the English textarea in the primary spot.
 *             Best for translation work — every untranslated field is one
 *             scroll away, no expand/collapse dance required.
 *  - `both` — render the two inputs side-by-side for proof-reading.
 *
 * `↻ 复制中文` is available in `en` and `both` modes, never in `zh` mode
 * (there's no EN input to seed there).
 */

type Kind = "text" | "textarea";

type BilingualFieldProps = {
  label: string;
  kind: Kind;
  /** Chinese value (the canonical field). */
  valueZh: string;
  /** English overlay value. */
  valueEn: string;
  onChangeZh: (next: string) => void;
  onChangeEn: (next: string) => void;
  placeholder?: string;
  hint?: string;
  /** Page-level edit mode. Default: `zh`. */
  mode?: EditMode;
};

const fieldClass =
  "min-h-10 w-full border border-carbon-black/15 bg-white px-2.5 text-sm text-carbon-black outline-none transition focus:border-aviation-orange";
const labelClass =
  "grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-metal-gray";

function Input({
  kind,
  value,
  onChange,
  placeholder,
  ariaLabel,
  readOnly = false
}: {
  kind: Kind;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  ariaLabel: string;
  readOnly?: boolean;
}) {
  if (kind === "textarea") {
    return (
      <textarea
        aria-label={ariaLabel}
        className={`${fieldClass} min-h-28 py-2 leading-6 ${
          readOnly ? "bg-surface-warm/40 text-carbon-black/55" : ""
        }`}
        value={value}
        placeholder={placeholder}
        readOnly={readOnly}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }
  return (
    <input
      aria-label={ariaLabel}
      className={`${fieldClass} ${
        readOnly ? "bg-surface-warm/40 text-carbon-black/55" : ""
      }`}
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function StatusPill({ hasZh, hasEn }: { hasZh: boolean; hasEn: boolean }) {
  if (hasEn) {
    return (
      <span
        className="font-numeric text-[10px] normal-case tracking-[0.12em] text-aviation-orange"
        title="English translation present"
      >
        ✓ EN
      </span>
    );
  }
  if (hasZh) {
    return (
      <span
        className="font-numeric text-[10px] normal-case tracking-[0.12em] text-metal-gray"
        title="English not yet translated"
      >
        ⚠ EN 未译
      </span>
    );
  }
  return null;
}

export function BilingualField({
  label,
  kind,
  valueZh,
  valueEn,
  onChangeZh,
  onChangeEn,
  placeholder,
  hint,
  mode = "zh"
}: BilingualFieldProps) {
  const hasZh = valueZh.trim().length > 0;
  const hasEn = valueEn.trim().length > 0;

  // ── Mode: 中文 ──────────────────────────────────────────────────────
  // The English overlay is hidden entirely. A small pill still surfaces
  // translation status so the operator knows whether the field has been
  // translated, without showing the EN editor.
  if (mode === "zh") {
    return (
      <label className={labelClass}>
        <span className="flex items-baseline justify-between gap-3">
          <span>{label}</span>
          <StatusPill hasZh={hasZh} hasEn={hasEn} />
        </span>
        <Input
          kind={kind}
          value={valueZh}
          onChange={onChangeZh}
          placeholder={placeholder}
          ariaLabel={`${label} 中文`}
        />
        {hint ? (
          <span className="text-[11px] normal-case tracking-normal text-carbon-black/45">
            {hint}
          </span>
        ) : null}
      </label>
    );
  }

  // ── Mode: English ───────────────────────────────────────────────────
  // The Chinese value appears as a small, read-only reference above the
  // English input. Translation work focuses on EN; no expand/collapse, no
  // hunting for "+ 添加 English" buttons.
  if (mode === "en") {
    return (
      <label className={labelClass}>
        <span className="flex items-baseline justify-between gap-3">
          <span>{label}</span>
          <StatusPill hasZh={hasZh} hasEn={hasEn} />
        </span>
        {hasZh ? (
          <div className="border-l-2 border-carbon-black/15 bg-surface-warm/40 px-2.5 py-1.5">
            <p className="font-numeric text-[10px] uppercase tracking-[0.16em] text-metal-gray">
              中文原文
            </p>
            <p className="mt-1 whitespace-pre-wrap text-[13px] leading-6 text-carbon-black/65">
              {valueZh}
            </p>
          </div>
        ) : null}
        <div className="flex items-baseline justify-between gap-3 pt-1">
          <span className="text-[10px] uppercase tracking-[0.16em] text-aviation-orange">
            English
          </span>
          <button
            type="button"
            onClick={() => onChangeEn(valueZh)}
            disabled={!hasZh}
            title={hasZh ? "Copy Chinese into English to start translation" : "中文为空"}
            className="border border-carbon-black/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↻ 复制中文
          </button>
        </div>
        <Input
          kind={kind}
          value={valueEn}
          onChange={onChangeEn}
          placeholder={`English ${label}`}
          ariaLabel={`${label} English`}
        />
        {hint ? (
          <span className="text-[11px] normal-case tracking-normal text-carbon-black/45">
            {hint}
          </span>
        ) : null}
      </label>
    );
  }

  // ── Mode: 对照 ──────────────────────────────────────────────────────
  // Side-by-side CN/EN. Best when proof-reading and comparing.
  return (
    <label className={labelClass}>
      <span className="flex items-baseline justify-between gap-3">
        <span>{label}</span>
        <StatusPill hasZh={hasZh} hasEn={hasEn} />
      </span>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-1">
          <span className="text-[10px] uppercase tracking-[0.16em] text-metal-gray">
            中文
          </span>
          <Input
            kind={kind}
            value={valueZh}
            onChange={onChangeZh}
            placeholder={placeholder}
            ariaLabel={`${label} 中文`}
          />
        </div>
        <div className="grid gap-1">
          <span className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.16em] text-aviation-orange">
            <span>English</span>
            <button
              type="button"
              onClick={() => onChangeEn(valueZh)}
              disabled={!hasZh}
              className="border border-carbon-black/15 px-2 py-0.5 text-[10px] normal-case tracking-normal text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↻ 复制中文
            </button>
          </span>
          <Input
            kind={kind}
            value={valueEn}
            onChange={onChangeEn}
            placeholder={`English ${label}`}
            ariaLabel={`${label} English`}
          />
        </div>
      </div>
      {hint ? (
        <span className="text-[11px] normal-case tracking-normal text-carbon-black/45">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

/**
 * Bilingual editor for "lines" fields — every line in the Chinese textarea
 * maps to a parallel line in the English textarea. Same three modes as the
 * single-input variant: 中文 hides EN; English shows CN as reference; 对照
 * renders both side-by-side.
 */
export function BilingualLinesField({
  label,
  valueZh,
  valueEn,
  onChangeZh,
  onChangeEn,
  hint,
  mode = "zh"
}: {
  label: string;
  valueZh: string;
  valueEn: string;
  onChangeZh: (next: string) => void;
  onChangeEn: (next: string) => void;
  hint?: string;
  mode?: EditMode;
}) {
  const hasZh = valueZh.trim().length > 0;
  const hasEn = valueEn.trim().length > 0;

  if (mode === "zh") {
    return (
      <label className={labelClass}>
        <span className="flex items-baseline justify-between gap-3">
          <span>{label}</span>
          <StatusPill hasZh={hasZh} hasEn={hasEn} />
        </span>
        <textarea
          className={`${fieldClass} min-h-28 py-2 font-numeric text-[13px] leading-6`}
          value={valueZh}
          spellCheck={false}
          onChange={(e) => onChangeZh(e.target.value)}
        />
        {hint ? (
          <span className="text-[11px] normal-case tracking-normal text-carbon-black/45">
            {hint}
          </span>
        ) : null}
      </label>
    );
  }

  if (mode === "en") {
    return (
      <label className={labelClass}>
        <span className="flex items-baseline justify-between gap-3">
          <span>{label}</span>
          <StatusPill hasZh={hasZh} hasEn={hasEn} />
        </span>
        {hasZh ? (
          <div className="border-l-2 border-carbon-black/15 bg-surface-warm/40 px-2.5 py-1.5">
            <p className="font-numeric text-[10px] uppercase tracking-[0.16em] text-metal-gray">
              中文原文(每行一条)
            </p>
            <pre className="mt-1 whitespace-pre-wrap font-numeric text-[12.5px] leading-6 text-carbon-black/65">
              {valueZh}
            </pre>
          </div>
        ) : null}
        <div className="flex items-baseline justify-between gap-3 pt-1">
          <span className="text-[10px] uppercase tracking-[0.16em] text-aviation-orange">
            English · one per line
          </span>
          <button
            type="button"
            onClick={() => onChangeEn(valueZh)}
            disabled={!hasZh}
            className="border border-carbon-black/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange disabled:cursor-not-allowed disabled:opacity-40"
          >
            ↻ 复制中文
          </button>
        </div>
        <textarea
          className={`${fieldClass} min-h-28 py-2 font-numeric text-[13px] leading-6`}
          value={valueEn}
          spellCheck={false}
          onChange={(e) => onChangeEn(e.target.value)}
        />
        {hint ? (
          <span className="text-[11px] normal-case tracking-normal text-carbon-black/45">
            {hint}
          </span>
        ) : null}
      </label>
    );
  }

  return (
    <label className={labelClass}>
      <span className="flex items-baseline justify-between gap-3">
        <span>{label}</span>
        <StatusPill hasZh={hasZh} hasEn={hasEn} />
      </span>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-1">
          <span className="text-[10px] uppercase tracking-[0.16em] text-metal-gray">
            中文 · 每行一条
          </span>
          <textarea
            className={`${fieldClass} min-h-28 py-2 font-numeric text-[13px] leading-6`}
            value={valueZh}
            spellCheck={false}
            onChange={(e) => onChangeZh(e.target.value)}
          />
        </div>
        <div className="grid gap-1">
          <span className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.16em] text-aviation-orange">
            <span>English · one per line</span>
            <button
              type="button"
              onClick={() => onChangeEn(valueZh)}
              disabled={!hasZh}
              className="border border-carbon-black/15 px-2 py-0.5 text-[10px] normal-case tracking-normal text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange disabled:cursor-not-allowed disabled:opacity-40"
            >
              ↻ 复制中文
            </button>
          </span>
          <textarea
            className={`${fieldClass} min-h-28 py-2 font-numeric text-[13px] leading-6`}
            value={valueEn}
            spellCheck={false}
            onChange={(e) => onChangeEn(e.target.value)}
          />
        </div>
      </div>
      {hint ? (
        <span className="text-[11px] normal-case tracking-normal text-carbon-black/45">
          {hint}
        </span>
      ) : null}
    </label>
  );
}
