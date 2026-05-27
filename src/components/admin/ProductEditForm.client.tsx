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
import { computeProgress, I18N_FIELDS } from "@/lib/i18n-progress";
import { SPEC_GROUP_META } from "@/types/content";
import type { Product, ProductSpec, SpecGroup } from "@/types/content";

type ProductEditFormProps = {
  product: Product;
  status: string;
  mediaIndex?: MediaIndex;
  scenarioOptions?: RelationOption[];
  caseOptions?: RelationOption[];
};

// A spec row with a stable React key so add / remove never mis-targets a row.
type SpecRow = ProductSpec & { _key: string };

const SPEC_GROUPS = Object.keys(SPEC_GROUP_META) as SpecGroup[];

let keyCounter = 0;
const nextKey = () => `r${Date.now()}_${keyCounter++}`;

function toRows(specs: ProductSpec[]): SpecRow[] {
  return specs.map((spec) => ({ ...spec, _key: nextKey() }));
}

function fromRows(rows: SpecRow[], withGroup: boolean): ProductSpec[] {
  return rows
    .filter((row) => row.label.trim() || row.value.trim())
    .map((row) => {
      const spec: ProductSpec = { label: row.label.trim(), value: row.value.trim() };
      if (row.unit && row.unit.trim()) spec.unit = row.unit.trim();
      if (row.note && row.note.trim()) spec.note = row.note.trim();
      if (withGroup && row.group) spec.group = row.group;
      return spec;
    });
}

const fieldClass =
  "min-h-10 w-full border border-carbon-black/15 bg-white px-2.5 text-sm text-carbon-black outline-none transition focus:border-aviation-orange";
const labelClass = "grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-metal-gray";

export function ProductEditForm({
  product,
  status: initialStatus,
  mediaIndex = {},
  scenarioOptions = [],
  caseOptions = []
}: ProductEditFormProps) {
  const router = useRouter();

  const [model, setModel] = useState(product.model);
  const [displayName, setDisplayName] = useState(product.displayName);
  const [displayNameEn, setDisplayNameEn] = useState(product.displayNameEn ?? "");
  const [category, setCategory] = useState(product.category);
  const [categoryEn, setCategoryEn] = useState(product.categoryEn ?? "");
  const [strategicRole, setStrategicRole] = useState(product.strategicRole);
  const [strategicRoleEn, setStrategicRoleEn] = useState(product.strategicRoleEn ?? "");
  const [summary, setSummary] = useState(product.summary);
  const [summaryEn, setSummaryEn] = useState(product.summaryEn ?? "");
  const [positioning, setPositioning] = useState(product.positioning);
  const [positioningEn, setPositioningEn] = useState(product.positioningEn ?? "");
  const [ctaContext, setCtaContext] = useState(product.ctaContext);
  const [ctaContextEn, setCtaContextEn] = useState(product.ctaContextEn ?? "");
  const [narrative, setNarrative] = useState(product.narrative);
  const [narrativeEn, setNarrativeEn] = useState(product.narrativeEn ?? "");
  const [keyCapabilities, setKeyCapabilities] = useState(product.keyCapabilities.join("\n"));
  const [keyCapabilitiesEn, setKeyCapabilitiesEn] = useState(
    (product.keyCapabilitiesEn ?? []).join("\n")
  );
  const [heroVariant, setHeroVariant] = useState(product.heroVariant);
  const [priority, setPriority] = useState(product.priority);
  const [status, setStatus] = useState(initialStatus);

  // Parameter tables — the everyday editing surface.
  const [keyMetrics, setKeyMetrics] = useState<SpecRow[]>(() => toRows(product.keyMetrics));
  const [specifications, setSpecifications] = useState<SpecRow[]>(() =>
    toRows(product.specifications)
  );

  // References — picked from current scenarios/cases lists; no manual slugs.
  const [scenarios, setScenarios] = useState<string[]>(product.scenarios);
  const [relatedCases, setRelatedCases] = useState<string[]>(product.relatedCases);
  const [media, setMedia] = useState<string[]>(product.media);
  const [gallery, setGallery] = useState<string[]>(product.gallery);
  const [sourceUrls, setSourceUrls] = useState(product.sourceUrls.join("\n"));

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [mode, setMode] = useState<EditMode>("zh");

  function updateMetric(key: string, patch: Partial<SpecRow>) {
    setKeyMetrics((rows) => rows.map((r) => (r._key === key ? { ...r, ...patch } : r)));
  }
  function updateSpec(key: string, patch: Partial<SpecRow>) {
    setSpecifications((rows) => rows.map((r) => (r._key === key ? { ...r, ...patch } : r)));
  }

  const lines = (value: string) =>
    value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setSaving(true);

    const next: Product = {
      ...product,
      model,
      displayName,
      category,
      strategicRole,
      summary,
      positioning,
      ctaContext,
      narrative,
      keyCapabilities: lines(keyCapabilities),
      heroVariant,
      priority,
      keyMetrics: fromRows(keyMetrics, false),
      specifications: fromRows(specifications, true),
      scenarios,
      relatedCases,
      media,
      gallery,
      sourceUrls: lines(sourceUrls)
    };
    // Strip empty EN overlays so the JSON stays lean and `pick()` falls back
    // cleanly to Chinese when a translation hasn't been written yet.
    const setOrClear = (k: keyof Product, v: string) => {
      if (v.trim()) (next as unknown as Record<string, unknown>)[k as string] = v.trim();
      else delete (next as unknown as Record<string, unknown>)[k as string];
    };
    setOrClear("displayNameEn", displayNameEn);
    setOrClear("categoryEn", categoryEn);
    setOrClear("strategicRoleEn", strategicRoleEn);
    setOrClear("summaryEn", summaryEn);
    setOrClear("positioningEn", positioningEn);
    setOrClear("ctaContextEn", ctaContextEn);
    setOrClear("narrativeEn", narrativeEn);
    const capsEn = lines(keyCapabilitiesEn);
    if (capsEn.length > 0) next.keyCapabilitiesEn = capsEn;
    else delete (next as unknown as Record<string, unknown>).keyCapabilitiesEn;

    try {
      const res = await fetch(`/api/admin/products/${product.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: next, status })
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

  return (
    <div className="px-10 py-10">
      <Link
        href="/admin/products"
        className="text-[12px] text-carbon-black/55 transition hover:text-aviation-orange"
      >
        ← 返回产品列表
      </Link>
      <h1 className="mt-4 font-display text-3xl font-semibold tracking-[-0.01em]">
        编辑产品 · {product.model}
      </h1>
      <p className="mt-2 text-sm text-carbon-black/55">slug：{product.slug}（不可修改）</p>

      <div className="mt-5 max-w-5xl">
        <LanguageModeSwitcher
          mode={mode}
          onChange={setMode}
          progress={computeProgress(
            {
              displayNameEn,
              categoryEn,
              strategicRoleEn,
              summaryEn,
              positioningEn,
              narrativeEn,
              ctaContextEn,
              keyCapabilitiesEn: keyCapabilitiesEn.trim() ? [keyCapabilitiesEn] : []
            },
            [...I18N_FIELDS.product]
          )}
        />
      </div>

      <form onSubmit={onSubmit} className="mt-8 max-w-5xl">
        {/* ---- Basic copy ---- */}
        <section className="grid gap-6">
          <label className={labelClass}>
            型号 Model
            <input className={fieldClass} value={model} onChange={(e) => setModel(e.target.value)} />
          </label>

          <BilingualField
            label="展示名称 Display name"
            kind="text"
            valueZh={displayName}
            valueEn={displayNameEn}
            onChangeZh={setDisplayName}
            onChangeEn={setDisplayNameEn}
            mode={mode}
          />
          <BilingualField
            label="分类 Category"
            kind="text"
            valueZh={category}
            valueEn={categoryEn}
            onChangeZh={setCategory}
            onChangeEn={setCategoryEn}
            mode={mode}
          />
          <BilingualField
            label="战略角色 Strategic role"
            kind="text"
            valueZh={strategicRole}
            valueEn={strategicRoleEn}
            onChangeZh={setStrategicRole}
            onChangeEn={setStrategicRoleEn}
            mode={mode}
          />
          <BilingualField
            label="一句话简介 Summary"
            kind="text"
            valueZh={summary}
            valueEn={summaryEn}
            onChangeZh={setSummary}
            onChangeEn={setSummaryEn}
            mode={mode}
          />
          <BilingualField
            label="定位 Positioning"
            kind="textarea"
            valueZh={positioning}
            valueEn={positioningEn}
            onChangeZh={setPositioning}
            onChangeEn={setPositioningEn}
            mode={mode}
          />
          <BilingualField
            label="产品叙述 Narrative"
            kind="textarea"
            valueZh={narrative}
            valueEn={narrativeEn}
            onChangeZh={setNarrative}
            onChangeEn={setNarrativeEn}
            mode={mode}
          />
          <BilingualLinesField
            label="核心能力 Key capabilities（每行一条）"
            valueZh={keyCapabilities}
            valueEn={keyCapabilitiesEn}
            onChangeZh={setKeyCapabilities}
            onChangeEn={setKeyCapabilitiesEn}
            mode={mode}
          />
          <BilingualField
            label="询盘按钮文案 CTA context"
            kind="text"
            valueZh={ctaContext}
            valueEn={ctaContextEn}
            onChangeZh={setCtaContext}
            onChangeEn={setCtaContextEn}
            mode={mode}
          />
        </section>

        {/* ---- Key metrics table ---- */}
        <section className="mt-10 border-t border-carbon-black/12 pt-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">核心指标 Key metrics</h2>
            <button
              type="button"
              onClick={() =>
                setKeyMetrics((rows) => [
                  ...rows,
                  { _key: nextKey(), label: "", value: "", unit: "" }
                ])
              }
              className="border border-carbon-black/20 px-3 py-1.5 text-[12px] transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加指标
            </button>
          </div>
          <p className="mt-2 text-[12px] text-carbon-black/50">
            产品页顶部展示的几个关键数字。建议 3–4 条。
          </p>
          <div className="mt-4 grid gap-2">
            <div className="grid grid-cols-[1fr_1fr_90px_40px] gap-2 text-[10px] uppercase tracking-[0.16em] text-metal-gray">
              <span>标签</span>
              <span>数值</span>
              <span>单位</span>
              <span />
            </div>
            {keyMetrics.map((row) => (
              <div key={row._key} className="grid grid-cols-[1fr_1fr_90px_40px] gap-2">
                <input
                  className={fieldClass}
                  value={row.label}
                  placeholder="如 任务载荷"
                  onChange={(e) => updateMetric(row._key, { label: e.target.value })}
                />
                <input
                  className={fieldClass}
                  value={row.value}
                  placeholder="如 80-120"
                  onChange={(e) => updateMetric(row._key, { value: e.target.value })}
                />
                <input
                  className={fieldClass}
                  value={row.unit ?? ""}
                  placeholder="kg"
                  onChange={(e) => updateMetric(row._key, { unit: e.target.value })}
                />
                <button
                  type="button"
                  aria-label="删除"
                  onClick={() =>
                    setKeyMetrics((rows) => rows.filter((r) => r._key !== row._key))
                  }
                  className="border border-carbon-black/15 text-carbon-black/40 transition hover:border-signal-red hover:text-signal-red"
                >
                  ✕
                </button>
              </div>
            ))}
            {keyMetrics.length === 0 ? (
              <p className="py-3 text-[13px] text-carbon-black/40">暂无指标，点击右上角添加。</p>
            ) : null}
          </div>
        </section>

        {/* ---- Specifications table ---- */}
        <section className="mt-10 border-t border-carbon-black/12 pt-7">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">完整参数 Specifications</h2>
            <button
              type="button"
              onClick={() =>
                setSpecifications((rows) => [
                  ...rows,
                  { _key: nextKey(), group: "performance", label: "", value: "", unit: "", note: "" }
                ])
              }
              className="border border-carbon-black/20 px-3 py-1.5 text-[12px] transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加参数
            </button>
          </div>
          <p className="mt-2 text-[12px] text-carbon-black/50">
            产品页「完整参数」表格的内容，按分组归类展示。
          </p>
          <div className="mt-4 grid gap-2">
            <div className="grid grid-cols-[130px_1fr_1fr_80px_1fr_40px] gap-2 text-[10px] uppercase tracking-[0.16em] text-metal-gray">
              <span>分组</span>
              <span>标签</span>
              <span>数值</span>
              <span>单位</span>
              <span>备注</span>
              <span />
            </div>
            {specifications.map((row) => (
              <div
                key={row._key}
                className="grid grid-cols-[130px_1fr_1fr_80px_1fr_40px] gap-2"
              >
                <select
                  className={fieldClass}
                  value={row.group ?? "performance"}
                  onChange={(e) => updateSpec(row._key, { group: e.target.value as SpecGroup })}
                >
                  {SPEC_GROUPS.map((g) => (
                    <option key={g} value={g}>
                      {SPEC_GROUP_META[g].name}
                    </option>
                  ))}
                </select>
                <input
                  className={fieldClass}
                  value={row.label}
                  placeholder="如 最大速度"
                  onChange={(e) => updateSpec(row._key, { label: e.target.value })}
                />
                <input
                  className={fieldClass}
                  value={row.value}
                  placeholder="如 120"
                  onChange={(e) => updateSpec(row._key, { value: e.target.value })}
                />
                <input
                  className={fieldClass}
                  value={row.unit ?? ""}
                  placeholder="km/h"
                  onChange={(e) => updateSpec(row._key, { unit: e.target.value })}
                />
                <input
                  className={fieldClass}
                  value={row.note ?? ""}
                  placeholder="备注（可空）"
                  onChange={(e) => updateSpec(row._key, { note: e.target.value })}
                />
                <button
                  type="button"
                  aria-label="删除"
                  onClick={() =>
                    setSpecifications((rows) => rows.filter((r) => r._key !== row._key))
                  }
                  className="border border-carbon-black/15 text-carbon-black/40 transition hover:border-signal-red hover:text-signal-red"
                >
                  ✕
                </button>
              </div>
            ))}
            {specifications.length === 0 ? (
              <p className="py-3 text-[13px] text-carbon-black/40">暂无参数，点击右上角添加。</p>
            ) : null}
          </div>
        </section>

        {/* ---- References ---- */}
        <section className="mt-10 border-t border-carbon-black/12 pt-7">
          <h2 className="font-display text-lg font-semibold">关联内容 References</h2>
          <p className="mt-2 text-[12px] text-carbon-black/50">
            从已有的场景与案例中选择,不用记 slug。
          </p>
          <div className="mt-4 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-metal-gray">
                关联场景 Scenarios
              </p>
              <RelationPicker
                value={scenarios}
                onChange={setScenarios}
                options={scenarioOptions}
              />
            </div>
            <div>
              <p className="mb-2 text-[11px] uppercase tracking-[0.16em] text-metal-gray">
                关联案例 Related cases
              </p>
              <RelationPicker
                value={relatedCases}
                onChange={setRelatedCases}
                options={caseOptions}
              />
            </div>
          </div>

          <div className="mt-2 border-t border-carbon-black/10 pt-6">
            <h3 className="font-display text-base font-semibold">主图 Hero image</h3>
            <p className="mt-1.5 text-[12px] text-carbon-black/50">
              产品列表与详情页顶部展示的主图。建议放 1 张。
            </p>
            <div className="mt-4">
              <MediaPicker value={media} onChange={setMedia} mediaIndex={mediaIndex} />
            </div>
          </div>

          <div className="mt-2 border-t border-carbon-black/10 pt-6">
            <h3 className="font-display text-base font-semibold">产品图库 Gallery</h3>
            <p className="mt-1.5 text-[12px] text-carbon-black/50">
              产品详情页底部展示的图库，可上传多张。
            </p>
            <div className="mt-4">
              <MediaPicker value={gallery} onChange={setGallery} mediaIndex={mediaIndex} />
            </div>
          </div>

          <label className={`${labelClass} mt-6 border-t border-carbon-black/10 pt-6`}>
            来源链接 Source URLs（每行一个，仅内部记录）
            <textarea
              className={`${fieldClass} min-h-16 py-2 font-numeric text-[12px] leading-5`}
              value={sourceUrls}
              onChange={(e) => setSourceUrls(e.target.value)}
              spellCheck={false}
            />
          </label>
        </section>

        {/* ---- Publish controls ---- */}
        <section className="mt-10 grid gap-6 border-t border-carbon-black/12 pt-7 sm:grid-cols-3">
          <label className={labelClass}>
            详情页样式 Hero variant
            <select
              className={fieldClass}
              value={heroVariant}
              onChange={(e) => setHeroVariant(e.target.value as Product["heroVariant"])}
            >
              <option value="vehicle">vehicle · 机型</option>
              <option value="platform">platform · 平台</option>
            </select>
          </label>
          <label className={labelClass}>
            优先级 Priority
            <select
              className={fieldClass}
              value={priority}
              onChange={(e) => setPriority(e.target.value as Product["priority"])}
            >
              <option value="P0">P0</option>
              <option value="P1">P1</option>
              <option value="P2">P2</option>
              <option value="P3">P3</option>
            </select>
          </label>
          <label className={labelClass}>
            发布状态 Status
            <select className={fieldClass} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="published">已发布</option>
              <option value="draft">草稿（前台隐藏）</option>
            </select>
          </label>
        </section>

        {message ? (
          <p
            className={`mt-7 border px-3 py-2 text-[13px] ${
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
          <Link
            href={`/products/${product.slug}`}
            target="_blank"
            className="text-[13px] text-carbon-black/55 transition hover:text-aviation-orange"
          >
            在前台查看 ↗
          </Link>
        </div>
      </form>
      <div className="mt-8 max-w-5xl border-t border-carbon-black/12 pt-6">
        <p className="mb-3 text-[11px] uppercase tracking-[0.16em] text-metal-gray">
          Danger zone
        </p>
        <ContentDeleteButton type="product" slug={product.slug} backHref="/admin/products" />
      </div>
    </div>
  );
}
