"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  BilingualField,
  BilingualLinesField
} from "@/components/admin/BilingualField.client";
import { ContentDeleteButton } from "@/components/admin/ContentDeleteButton.client";
import {
  LanguageModeSwitcher,
  type EditMode
} from "@/components/admin/LanguageModeSwitcher.client";
import { MediaPicker, type MediaIndex } from "@/components/admin/MediaPicker.client";
import { RelationPicker, type RelationOption } from "@/components/admin/RelationPicker.client";
import { computeProgress } from "@/lib/i18n-progress";
import type { ProductSpec } from "@/types/content";

/** Field kinds the generic record form knows how to render. */
export type FieldDef =
  | { key: string; label: string; kind: "text"; placeholder?: string; bilingual?: boolean }
  | { key: string; label: string; kind: "textarea"; placeholder?: string; bilingual?: boolean }
  | { key: string; label: string; kind: "lines"; hint?: string; bilingual?: boolean }
  | { key: string; label: string; kind: "select"; options: { value: string; label: string }[] }
  | { key: string; label: string; kind: "specs"; hint?: string }
  | {
      key: string;
      label: string;
      kind: "media";
      hint?: string;
      multiple?: boolean;
      /** Limit the file picker. Defaults to "image+video" so hero/scenario
       *  backdrops can carry MP4 loops; pass "image" for cover/gallery
       *  slots where only stills make sense. */
      accept?: "image" | "image+video";
    }
  | {
      key: string;
      label: string;
      kind: "relation";
      optionsKey: string;
      multiple?: boolean;
      hint?: string;
    }
  /** Big-toggle boolean. Renders as a checkbox row with a hint underneath,
   *  styled to feel like a flight-deck switch rather than a bare HTML check. */
  | { key: string; label: string; kind: "boolean"; hint?: string }
  /** Repeating heading + body block list (e.g. technology pillar "detail"
   *  array). Each block is independently bilingual. */
  | { key: string; label: string; kind: "blocks"; hint?: string };

/** Returns the English overlay key paired with a base field (e.g. titleEn for title). */
const enKey = (key: string) => `${key}En`;

export type RelationOptionsBag = Record<string, RelationOption[]>;

type RecordFormProps = {
  apiType: "case" | "news" | "scenario" | "technology";
  slug: string;
  heading: string;
  backHref: string;
  viewHref?: string;
  record: Record<string, unknown>;
  status: string;
  fields: FieldDef[];
  mediaIndex?: MediaIndex;
  relationOptions?: RelationOptionsBag;
};

type SpecRow = ProductSpec & { _key: string };

type BlockRow = {
  heading: string;
  body: string;
  headingEn?: string;
  bodyEn?: string;
  _key: string;
};

let keyCounter = 0;
const nextKey = () => `r${Date.now()}_${keyCounter++}`;

function toBlockRows(value: unknown): BlockRow[] {
  if (!Array.isArray(value)) return [];
  return (value as Array<Omit<BlockRow, "_key">>).map((b) => ({
    heading: b.heading ?? "",
    body: b.body ?? "",
    headingEn: b.headingEn,
    bodyEn: b.bodyEn,
    _key: nextKey()
  }));
}

const fieldClass =
  "min-h-10 w-full border border-carbon-black/15 bg-white px-2.5 text-sm text-carbon-black outline-none transition focus:border-aviation-orange";
const labelClass = "grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-metal-gray";

function asLines(value: unknown): string {
  return Array.isArray(value) ? value.join("\n") : "";
}
function toSpecRows(value: unknown): SpecRow[] {
  if (!Array.isArray(value)) return [];
  return (value as ProductSpec[]).map((s) => ({ ...s, _key: nextKey() }));
}

export function RecordForm({
  apiType,
  slug,
  heading,
  backHref,
  viewHref,
  record,
  status: initialStatus,
  fields,
  mediaIndex = {},
  relationOptions = {}
}: RecordFormProps) {
  const router = useRouter();

  // Generic value store. Text/textarea/select/lines keep a string; specs keep
  // rows; media fields keep a string[] of media ids. Bilingual fields stash
  // their English overlay under `${key}En` in the same store. Booleans live
  // in their own map so we never confuse "false" the string with false the
  // boolean.
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const field of fields) {
      if (field.kind === "lines") {
        init[field.key] = asLines(record[field.key]);
        if (field.bilingual) init[enKey(field.key)] = asLines(record[enKey(field.key)]);
      } else if (
        field.kind === "specs" ||
        field.kind === "media" ||
        field.kind === "relation" ||
        field.kind === "boolean"
      ) {
        init[field.key] = "";
      } else {
        init[field.key] = record[field.key] == null ? "" : String(record[field.key]);
        if ((field.kind === "text" || field.kind === "textarea") && field.bilingual) {
          init[enKey(field.key)] =
            record[enKey(field.key)] == null ? "" : String(record[enKey(field.key)]);
        }
      }
    }
    return init;
  });
  const [booleanValues, setBooleanValues] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const field of fields) {
      if (field.kind === "boolean") {
        init[field.key] = Boolean(record[field.key]);
      }
    }
    return init;
  });
  const [blockValues, setBlockValues] = useState<Record<string, BlockRow[]>>(() => {
    const init: Record<string, BlockRow[]> = {};
    for (const field of fields) {
      if (field.kind === "blocks") init[field.key] = toBlockRows(record[field.key]);
    }
    return init;
  });
  const [specs, setSpecs] = useState<Record<string, SpecRow[]>>(() => {
    const init: Record<string, SpecRow[]> = {};
    for (const field of fields) {
      if (field.kind === "specs") init[field.key] = toSpecRows(record[field.key]);
    }
    return init;
  });
  const [mediaValues, setMediaValues] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    for (const field of fields) {
      if (field.kind === "media") {
        const raw = record[field.key];
        init[field.key] = Array.isArray(raw) ? (raw as string[]) : [];
      }
    }
    return init;
  });
  const [relationValues, setRelationValues] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    for (const field of fields) {
      if (field.kind === "relation") {
        const raw = record[field.key];
        if (Array.isArray(raw)) init[field.key] = raw as string[];
        else if (typeof raw === "string" && raw) init[field.key] = [raw];
        else init[field.key] = [];
      }
    }
    return init;
  });
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  // Page-level edit mode — defaults to 中文 so the monolingual workflow
  // stays uncluttered. Switch to "en" for focused translation work, or
  // "both" for side-by-side proof-reading.
  const [mode, setMode] = useState<EditMode>("zh");

  function setValue(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }
  function updateSpec(fieldKey: string, rowKey: string, patch: Partial<SpecRow>) {
    setSpecs((prev) => ({
      ...prev,
      [fieldKey]: prev[fieldKey].map((r) => (r._key === rowKey ? { ...r, ...patch } : r))
    }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setSaving(true);

    const next: Record<string, unknown> = { ...record, slug };
    for (const field of fields) {
      if (field.kind === "lines") {
        next[field.key] = values[field.key]
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        if (field.bilingual) {
          const enLines = (values[enKey(field.key)] ?? "")
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean);
          if (enLines.length > 0) next[enKey(field.key)] = enLines;
          else delete next[enKey(field.key)];
        }
      } else if (field.kind === "specs") {
        next[field.key] = specs[field.key]
          .filter((r) => r.label.trim() || r.value.trim())
          .map((r) => {
            const spec: ProductSpec = { label: r.label.trim(), value: r.value.trim() };
            if (r.unit && r.unit.trim()) spec.unit = r.unit.trim();
            return spec;
          });
      } else if (field.kind === "media") {
        next[field.key] = mediaValues[field.key];
      } else if (field.kind === "relation") {
        const arr = relationValues[field.key];
        next[field.key] = field.multiple === false ? arr[0] ?? "" : arr;
      } else if (field.kind === "boolean") {
        // Store as a real boolean. We avoid writing `false` explicitly so
        // unset records stay clean — `pick()`/checks treat undefined the
        // same as false for this flag.
        if (booleanValues[field.key]) next[field.key] = true;
        else delete next[field.key];
      } else if (field.kind === "blocks") {
        next[field.key] = blockValues[field.key]
          .filter((b) => b.heading.trim() || b.body.trim())
          .map((b) => {
            const out: Record<string, string> = {
              heading: b.heading.trim(),
              body: b.body.trim()
            };
            if (b.headingEn && b.headingEn.trim())
              out.headingEn = b.headingEn.trim();
            if (b.bodyEn && b.bodyEn.trim()) out.bodyEn = b.bodyEn.trim();
            return out;
          });
      } else {
        next[field.key] = values[field.key];
        if (
          (field.kind === "text" || field.kind === "textarea") &&
          field.bilingual
        ) {
          const en = (values[enKey(field.key)] ?? "").trim();
          if (en.length > 0) next[enKey(field.key)] = en;
          else delete next[enKey(field.key)];
        }
      }
    }
    next.status = status;

    try {
      const res = await fetch(`/api/admin/content/${apiType}/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ record: next, status })
      });
      if (res.ok) {
        setMessage({ type: "ok", text: "已保存，前台对应页面已更新。" });
        router.refresh();
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage({ type: "err", text: data.error ?? "保存失败" });
      }
    } catch {
      setMessage({ type: "err", text: "网络错误，请重试。" });
    }
    setSaving(false);
  }

  // Translation coverage — computed live from the in-form state so editors
  // see the progress bar tick up as they fill in English overlays.
  const bilingualKeys = fields
    .filter(
      (f) =>
        (f.kind === "text" || f.kind === "textarea" || f.kind === "lines") && f.bilingual
    )
    .map((f) => f.key);
  const liveRecord: Record<string, unknown> = {};
  for (const k of bilingualKeys) liveRecord[`${k}En`] = values[`${k}En`];
  const progress = computeProgress(liveRecord, bilingualKeys);

  return (
    <div className="px-10 py-10">
      <Link
        href={backHref}
        className="text-[12px] text-carbon-black/55 transition hover:text-aviation-orange"
      >
        ← 返回列表
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.01em]">{heading}</h1>
      <p className="mt-2 text-sm text-carbon-black/55">slug：{slug}（不可修改）</p>

      {bilingualKeys.length > 0 ? (
        <div className="mt-5 max-w-4xl">
          <LanguageModeSwitcher mode={mode} onChange={setMode} progress={progress} />
        </div>
      ) : null}

      <form onSubmit={onSubmit} className="mt-8 max-w-4xl">
        <div className="grid gap-6">
          {fields.map((field) => {
            if (field.kind === "relation") {
              const opts = relationOptions[field.optionsKey] ?? [];
              return (
                <label key={field.key} className={labelClass}>
                  {field.label}
                  <RelationPicker
                    value={relationValues[field.key]}
                    onChange={(next) =>
                      setRelationValues((prev) => ({ ...prev, [field.key]: next }))
                    }
                    options={opts}
                    multiple={field.multiple !== false}
                  />
                  {field.hint ? (
                    <span className="text-[11px] normal-case tracking-normal text-carbon-black/45">
                      {field.hint}
                    </span>
                  ) : null}
                </label>
              );
            }
            if (field.kind === "media") {
              return (
                <div key={field.key} className="border-t border-carbon-black/12 pt-6">
                  <h2 className="font-display text-base font-semibold">{field.label}</h2>
                  {field.hint ? (
                    <p className="mt-1.5 text-[12px] text-carbon-black/50">{field.hint}</p>
                  ) : null}
                  <div className="mt-4">
                    <MediaPicker
                      value={mediaValues[field.key]}
                      onChange={(next) =>
                        setMediaValues((prev) => ({ ...prev, [field.key]: next }))
                      }
                      mediaIndex={mediaIndex}
                      multiple={field.multiple !== false}
                      accept={field.accept}
                    />
                  </div>
                </div>
              );
            }
            if (field.kind === "boolean") {
              const on = booleanValues[field.key];
              return (
                <div
                  key={field.key}
                  className="flex items-start gap-4 border border-carbon-black/12 bg-surface-warm/40 px-4 py-3.5"
                >
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    onClick={() =>
                      setBooleanValues((prev) => ({ ...prev, [field.key]: !on }))
                    }
                    className={`relative mt-0.5 inline-flex h-5 w-9 shrink-0 items-center border transition ${
                      on
                        ? "border-aviation-orange bg-aviation-orange"
                        : "border-carbon-black/20 bg-white"
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`block h-4 w-4 bg-surface-warm transition-transform ${
                        on ? "translate-x-[18px]" : "translate-x-[2px]"
                      }`}
                    />
                  </button>
                  <div className="grid gap-1">
                    <span className="text-[12px] font-medium text-carbon-black">
                      {field.label}
                    </span>
                    {field.hint ? (
                      <span className="text-[11px] text-carbon-black/55">
                        {field.hint}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            }
            if (field.kind === "blocks") {
              const rows = blockValues[field.key];
              const update = (k: string, patch: Partial<BlockRow>) =>
                setBlockValues((prev) => ({
                  ...prev,
                  [field.key]: prev[field.key].map((r) =>
                    r._key === k ? { ...r, ...patch } : r
                  )
                }));
              return (
                <div key={field.key} className="border-t border-carbon-black/12 pt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-semibold">{field.label}</h2>
                    <button
                      type="button"
                      onClick={() =>
                        setBlockValues((prev) => ({
                          ...prev,
                          [field.key]: [
                            ...prev[field.key],
                            { _key: nextKey(), heading: "", body: "" }
                          ]
                        }))
                      }
                      className="border border-carbon-black/20 px-3 py-1.5 text-[12px] transition hover:border-aviation-orange hover:text-aviation-orange"
                    >
                      + 添加块
                    </button>
                  </div>
                  {field.hint ? (
                    <p className="mt-1.5 text-[12px] text-carbon-black/50">{field.hint}</p>
                  ) : null}
                  <div className="mt-4 grid gap-3">
                    {rows.map((row, i) => (
                      <div
                        key={row._key}
                        className="border border-carbon-black/10 bg-surface-warm/40 p-4"
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-aviation-orange">
                            块 / 0{i + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setBlockValues((prev) => ({
                                ...prev,
                                [field.key]: prev[field.key].filter(
                                  (r) => r._key !== row._key
                                )
                              }))
                            }
                            className="text-[10px] uppercase tracking-[0.16em] text-carbon-black/40 transition hover:text-signal-red"
                          >
                            ✕ 删除
                          </button>
                        </div>
                        <div className="mt-3 grid gap-3">
                          <BilingualField
                            label="标题 Heading"
                            kind="text"
                            valueZh={row.heading}
                            valueEn={row.headingEn ?? ""}
                            onChangeZh={(v) => update(row._key, { heading: v })}
                            onChangeEn={(v) => update(row._key, { headingEn: v })}
                            mode={mode}
                          />
                          <BilingualField
                            label="正文 Body"
                            kind="textarea"
                            valueZh={row.body}
                            valueEn={row.bodyEn ?? ""}
                            onChangeZh={(v) => update(row._key, { body: v })}
                            onChangeEn={(v) => update(row._key, { bodyEn: v })}
                            mode={mode}
                          />
                        </div>
                      </div>
                    ))}
                    {rows.length === 0 ? (
                      <p className="py-2 text-[13px] text-carbon-black/40">
                        暂无块,点击「+ 添加块」。
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            }
            if (field.kind === "specs") {
              const rows = specs[field.key];
              return (
                <div key={field.key} className="border-t border-carbon-black/12 pt-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-display text-base font-semibold">{field.label}</h2>
                    <button
                      type="button"
                      onClick={() =>
                        setSpecs((prev) => ({
                          ...prev,
                          [field.key]: [
                            ...prev[field.key],
                            { _key: nextKey(), label: "", value: "", unit: "" }
                          ]
                        }))
                      }
                      className="border border-carbon-black/20 px-3 py-1.5 text-[12px] transition hover:border-aviation-orange hover:text-aviation-orange"
                    >
                      + 添加
                    </button>
                  </div>
                  {field.hint ? (
                    <p className="mt-1.5 text-[12px] text-carbon-black/50">{field.hint}</p>
                  ) : null}
                  <div className="mt-3 grid gap-2">
                    {rows.map((row) => (
                      <div key={row._key} className="grid grid-cols-[1fr_1fr_90px_40px] gap-2">
                        <input
                          className={fieldClass}
                          value={row.label}
                          placeholder="标签"
                          onChange={(e) => updateSpec(field.key, row._key, { label: e.target.value })}
                        />
                        <input
                          className={fieldClass}
                          value={row.value}
                          placeholder="数值"
                          onChange={(e) => updateSpec(field.key, row._key, { value: e.target.value })}
                        />
                        <input
                          className={fieldClass}
                          value={row.unit ?? ""}
                          placeholder="单位"
                          onChange={(e) => updateSpec(field.key, row._key, { unit: e.target.value })}
                        />
                        <button
                          type="button"
                          aria-label="删除"
                          onClick={() =>
                            setSpecs((prev) => ({
                              ...prev,
                              [field.key]: prev[field.key].filter((r) => r._key !== row._key)
                            }))
                          }
                          className="border border-carbon-black/15 text-carbon-black/40 transition hover:border-signal-red hover:text-signal-red"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {rows.length === 0 ? (
                      <p className="py-2 text-[13px] text-carbon-black/40">暂无，点击「+ 添加」。</p>
                    ) : null}
                  </div>
                </div>
              );
            }

            // Bilingual text / textarea — render the mode-aware BilingualField.
            if (
              (field.kind === "text" || field.kind === "textarea") &&
              field.bilingual
            ) {
              return (
                <BilingualField
                  key={field.key}
                  label={field.label}
                  kind={field.kind}
                  valueZh={values[field.key]}
                  valueEn={values[enKey(field.key)] ?? ""}
                  onChangeZh={(next) => setValue(field.key, next)}
                  onChangeEn={(next) => setValue(enKey(field.key), next)}
                  placeholder={field.placeholder}
                  mode={mode}
                />
              );
            }

            // Bilingual lines — mode-aware line-by-line editor.
            if (field.kind === "lines" && field.bilingual) {
              return (
                <BilingualLinesField
                  key={field.key}
                  label={field.label}
                  valueZh={values[field.key]}
                  valueEn={values[enKey(field.key)] ?? ""}
                  onChangeZh={(next) => setValue(field.key, next)}
                  onChangeEn={(next) => setValue(enKey(field.key), next)}
                  hint={field.hint}
                  mode={mode}
                />
              );
            }

            return (
              <label key={field.key} className={labelClass}>
                {field.label}
                {field.kind === "text" ? (
                  <input
                    className={fieldClass}
                    value={values[field.key]}
                    placeholder={field.placeholder}
                    onChange={(e) => setValue(field.key, e.target.value)}
                  />
                ) : field.kind === "select" ? (
                  <select
                    className={fieldClass}
                    value={values[field.key]}
                    onChange={(e) => setValue(field.key, e.target.value)}
                  >
                    {field.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    className={`${fieldClass} py-2 leading-6 ${
                      field.kind === "lines" ? "min-h-28 font-numeric text-[13px]" : "min-h-28"
                    }`}
                    value={values[field.key]}
                    spellCheck={field.kind !== "lines"}
                    onChange={(e) => setValue(field.key, e.target.value)}
                  />
                )}
                {field.kind === "lines" && field.hint ? (
                  <span className="text-[11px] normal-case tracking-normal text-carbon-black/45">
                    {field.hint}
                  </span>
                ) : null}
              </label>
            );
          })}

          <label className={`${labelClass} border-t border-carbon-black/12 pt-6`}>
            发布状态 Status
            <select
              className={`${fieldClass} max-w-xs`}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="published">已发布</option>
              <option value="draft">草稿（前台隐藏）</option>
            </select>
          </label>
        </div>

        {message ? (
          <p
            className={`mt-6 border px-3 py-2 text-[13px] ${
              message.type === "ok"
                ? "border-aviation-orange/40 bg-aviation-orange/5 text-aviation-orange"
                : "border-signal-red/40 bg-signal-red/10 text-signal-red"
            }`}
          >
            {message.text}
          </p>
        ) : null}

        <div className="mt-7 flex items-center gap-4 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-11 items-center justify-center bg-aviation-orange px-7 text-sm font-medium text-surface-warm transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存修改"}
          </button>
          {viewHref ? (
            <Link
              href={viewHref}
              target="_blank"
              className="text-[13px] text-carbon-black/55 transition hover:text-aviation-orange"
            >
              在前台查看 ↗
            </Link>
          ) : null}
        </div>
      </form>
      <div className="mt-8 max-w-4xl border-t border-carbon-black/12 pt-6">
        <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-metal-gray">
          Danger zone
        </p>
        <ContentDeleteButton type={apiType} slug={slug} backHref={backHref} />
      </div>
    </div>
  );
}
