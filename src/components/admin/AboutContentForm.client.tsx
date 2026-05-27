"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BilingualField } from "@/components/admin/BilingualField.client";
import { AdminEditToolbar } from "@/components/admin/AdminEditToolbar";
import {
  LanguageModeSwitcher,
  type EditMode
} from "@/components/admin/LanguageModeSwitcher.client";
import { MediaPicker, type MediaIndex } from "@/components/admin/MediaPicker.client";
import { computeProgress } from "@/lib/i18n-progress";
import type {
  CompanyMilestone,
  CompanyProfile,
  ProductSpec
} from "@/types/content";

type FieldReelTile = NonNullable<CompanyProfile["fieldReel"]>[number];

type Props = {
  company: CompanyProfile;
  mediaIndex: MediaIndex;
};

const fieldClass =
  "min-h-10 w-full border border-carbon-black/15 bg-white px-2.5 text-sm text-carbon-black outline-none transition focus:border-aviation-orange";
const labelClass = "grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-metal-gray";
const sectionClass =
  "border-t-2 border-aviation-orange/40 bg-surface-warm/60 px-7 py-7 first:border-t-0";

function SectionHeader({
  index,
  title,
  subtitle
}: {
  index: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 flex items-baseline gap-4">
      <span className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
        {index}
      </span>
      <div>
        <h2 className="font-display text-lg font-semibold">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-[12px] text-carbon-black/55">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Repeating row helpers — proof metrics, capabilities, culture, etc.        */
/*  All accept a value array, an updater, and a mode prop so the inputs       */
/*  honour the page-level language switch.                                    */
/* -------------------------------------------------------------------------- */

function ProofRows({
  rows,
  onChange
}: {
  rows: ProductSpec[];
  onChange: (next: ProductSpec[]) => void;
}) {
  function update(i: number, patch: Partial<ProductSpec>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function add() {
    onChange([...rows, { label: "", value: "", unit: "" }]);
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }
  return (
    <div className="grid gap-2">
      <div className="grid grid-cols-[1fr_120px_80px_40px] gap-2 text-[10px] uppercase tracking-[0.16em] text-metal-gray">
        <span>标签</span>
        <span>数值</span>
        <span>单位</span>
        <span />
      </div>
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-[1fr_120px_80px_40px] gap-2">
          <input
            className={fieldClass}
            value={r.label}
            placeholder="例如：实用新型专利"
            onChange={(e) => update(i, { label: e.target.value })}
          />
          <input
            className={fieldClass}
            value={r.value}
            placeholder="例如：20"
            onChange={(e) => update(i, { value: e.target.value })}
          />
          <input
            className={fieldClass}
            value={r.unit ?? ""}
            placeholder="项"
            onChange={(e) => update(i, { unit: e.target.value })}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="border border-carbon-black/15 text-carbon-black/40 transition hover:border-signal-red hover:text-signal-red"
            aria-label="删除"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
      >
        + 添加一行
      </button>
    </div>
  );
}

type TitleDescRow = {
  title: string;
  description: string;
  titleEn?: string;
  descriptionEn?: string;
};

function TitleDescEditor({
  row,
  onChange,
  onRemove,
  mode,
  index
}: {
  row: TitleDescRow;
  onChange: (next: TitleDescRow) => void;
  onRemove: () => void;
  mode: EditMode;
  index: number;
}) {
  return (
    <div className="border border-carbon-black/10 bg-surface-warm/50 p-5">
      <div className="flex items-baseline justify-between">
        <p className="font-numeric text-[10px] uppercase tracking-[0.22em] text-aviation-orange">
          0{index + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] uppercase tracking-[0.16em] text-carbon-black/40 transition hover:text-signal-red"
        >
          ✕ 删除
        </button>
      </div>
      <div className="mt-3 grid gap-4">
        <BilingualField
          label="标题 Title"
          kind="text"
          valueZh={row.title}
          valueEn={row.titleEn ?? ""}
          onChangeZh={(v) => onChange({ ...row, title: v })}
          onChangeEn={(v) => onChange({ ...row, titleEn: v })}
          mode={mode}
        />
        <BilingualField
          label="描述 Description"
          kind="textarea"
          valueZh={row.description}
          valueEn={row.descriptionEn ?? ""}
          onChangeZh={(v) => onChange({ ...row, description: v })}
          onChangeEn={(v) => onChange({ ...row, descriptionEn: v })}
          mode={mode}
        />
      </div>
    </div>
  );
}

type MilestoneRow = CompanyMilestone;

function MilestoneEditor({
  row,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  mode,
  total,
  index
}: {
  row: MilestoneRow;
  onChange: (next: MilestoneRow) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  mode: EditMode;
  total: number;
  index: number;
}) {
  return (
    <div className="border border-carbon-black/10 bg-surface-warm/50 p-5">
      <div className="flex items-baseline justify-between">
        <p className="font-numeric text-[10px] uppercase tracking-[0.22em] text-aviation-orange">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="text-carbon-black/40 transition hover:text-aviation-orange disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↑ 上移
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="text-carbon-black/40 transition hover:text-aviation-orange disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↓ 下移
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-carbon-black/40 transition hover:text-signal-red"
          >
            ✕ 删除
          </button>
        </div>
      </div>
      <div className="mt-3 grid gap-4">
        <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
          <label className={labelClass}>
            年份 Year
            <input
              className={fieldClass}
              value={row.year}
              placeholder="2019"
              onChange={(e) => onChange({ ...row, year: e.target.value })}
            />
          </label>
          <label className={labelClass}>
            状态 Status
            <select
              className={fieldClass}
              value={row.status ?? "confirmed"}
              onChange={(e) =>
                onChange({
                  ...row,
                  status: e.target.value as MilestoneRow["status"]
                })
              }
            >
              <option value="confirmed">已确认 confirmed</option>
              <option value="needs-confirmation">待确认 needs-confirmation</option>
            </select>
          </label>
        </div>
        <BilingualField
          label="标题 Title"
          kind="text"
          valueZh={row.title}
          valueEn={row.titleEn ?? ""}
          onChangeZh={(v) => onChange({ ...row, title: v })}
          onChangeEn={(v) => onChange({ ...row, titleEn: v })}
          mode={mode}
        />
        <BilingualField
          label="描述 Description"
          kind="textarea"
          valueZh={row.description}
          valueEn={row.descriptionEn ?? ""}
          onChangeZh={(v) => onChange({ ...row, description: v })}
          onChangeEn={(v) => onChange({ ...row, descriptionEn: v })}
          mode={mode}
        />
      </div>
    </div>
  );
}

type GlobalRow = NonNullable<CompanyProfile["global"]>[number];

function FieldReelEditor({
  row,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
  mode,
  mediaIndex,
  total,
  index
}: {
  row: FieldReelTile;
  onChange: (next: FieldReelTile) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  mode: EditMode;
  mediaIndex: MediaIndex;
  total: number;
  index: number;
}) {
  return (
    <div className="border border-carbon-black/10 bg-surface-warm/50 p-5">
      <div className="flex items-baseline justify-between">
        <p className="font-numeric text-[10px] uppercase tracking-[0.22em] text-aviation-orange">
          Tile / {String(index + 1).padStart(2, "0")} of {String(total).padStart(2, "0")}
        </p>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em]">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="text-carbon-black/40 transition hover:text-aviation-orange disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↑ 上移
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="text-carbon-black/40 transition hover:text-aviation-orange disabled:cursor-not-allowed disabled:opacity-30"
          >
            ↓ 下移
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="text-carbon-black/40 transition hover:text-signal-red"
          >
            ✕ 删除
          </button>
        </div>
      </div>
      <div className="mt-3 grid gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.16em] text-metal-gray">
            图片 / Image
          </p>
          <p className="mt-1 text-[12px] leading-5 text-carbon-black/50">
            推荐 1200×900 或 1600×1200,JPG / WebP,≤ 3 MB。横版图请勾「宽」、竖版选「竖」以适配版面。
          </p>
          <div className="mt-2">
            <MediaPicker
              value={row.mediaId ? [row.mediaId] : []}
              onChange={(next) => onChange({ ...row, mediaId: next[0] ?? "" })}
              mediaIndex={mediaIndex}
              multiple={false}
              accept="image"
            />
          </div>
        </div>
        <BilingualField
          label="说明文字 Caption"
          kind="text"
          valueZh={row.caption}
          valueEn={row.captionEn ?? ""}
          onChangeZh={(v) => onChange({ ...row, caption: v })}
          onChangeEn={(v) => onChange({ ...row, captionEn: v })}
          mode={mode}
        />
        <div className="grid gap-3 sm:grid-cols-3">
          <label className={labelClass}>
            年份 Year（任意短文）
            <input
              className={fieldClass}
              value={row.year}
              placeholder="2025·07 / Platform"
              onChange={(e) => onChange({ ...row, year: e.target.value })}
            />
          </label>
          <label className={labelClass}>
            列宽 Span（桌面）
            <select
              className={fieldClass}
              value={row.span ?? "2"}
              onChange={(e) =>
                onChange({
                  ...row,
                  span: e.target.value as FieldReelTile["span"]
                })
              }
            >
              <option value="2">小 / 2 col</option>
              <option value="3">大 / 3 col</option>
            </select>
          </label>
          <label className={labelClass}>
            画幅 Aspect
            <select
              className={fieldClass}
              value={row.aspect ?? "wide"}
              onChange={(e) =>
                onChange({
                  ...row,
                  aspect: e.target.value as FieldReelTile["aspect"]
                })
              }
            >
              <option value="wide">横版 16:10</option>
              <option value="portrait">竖版 4:5</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}

function GlobalEditor({
  row,
  onChange,
  onRemove,
  mode,
  index
}: {
  row: GlobalRow;
  onChange: (next: GlobalRow) => void;
  onRemove: () => void;
  mode: EditMode;
  index: number;
}) {
  return (
    <div className="border border-carbon-black/10 bg-surface-warm/50 p-5">
      <div className="flex items-baseline justify-between">
        <p className="font-numeric text-[10px] uppercase tracking-[0.22em] text-aviation-orange">
          {row.code} · 0{index + 1}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] uppercase tracking-[0.16em] text-carbon-black/40 transition hover:text-signal-red"
        >
          ✕ 删除
        </button>
      </div>
      <div className="mt-3 grid gap-4">
        <label className={labelClass}>
          地区代码 Region code（CN / APAC / EMEA / AMS …）
          <input
            className={fieldClass}
            value={row.code}
            onChange={(e) => onChange({ ...row, code: e.target.value })}
          />
        </label>
        <BilingualField
          label="地区名 Region name"
          kind="text"
          valueZh={row.region}
          valueEn={row.regionEn ?? ""}
          onChangeZh={(v) => onChange({ ...row, region: v })}
          onChangeEn={(v) => onChange({ ...row, regionEn: v })}
          mode={mode}
        />
        <BilingualField
          label="描述 Description"
          kind="textarea"
          valueZh={row.description}
          valueEn={row.descriptionEn ?? ""}
          onChangeZh={(v) => onChange({ ...row, description: v })}
          onChangeEn={(v) => onChange({ ...row, descriptionEn: v })}
          mode={mode}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

export function AboutContentForm({ company, mediaIndex }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(company.title);
  const [titleEn, setTitleEn] = useState(company.titleEn ?? "");
  const [lead, setLead] = useState(company.lead);
  const [leadEn, setLeadEn] = useState(company.leadEn ?? "");

  const [proof, setProof] = useState<ProductSpec[]>(company.proof);
  const [capabilities, setCapabilities] = useState<TitleDescRow[]>(
    company.capabilities
  );
  const [culture, setCulture] = useState<TitleDescRow[]>(company.culture);
  const [milestones, setMilestones] = useState<MilestoneRow[]>(company.milestones);
  const [certifications, setCertifications] = useState<
    CompanyProfile["certifications"]
  >(company.certifications);
  const [manufacturing, setManufacturing] = useState<TitleDescRow[]>(
    company.manufacturing ?? []
  );
  const [globalRows, setGlobalRows] = useState<GlobalRow[]>(company.global ?? []);
  const [fieldReel, setFieldReel] = useState<FieldReelTile[]>(
    company.fieldReel ?? []
  );

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );
  const [mode, setMode] = useState<EditMode>("zh");
  const formId = "admin-about-content-form";

  const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

  // Coarse progress: any high-impact EN overlay is counted. Good enough
  // for the progress bar — exhaustive counting would be noisy here.
  const progress = useMemo(() => {
    const baseKeys = [
      "title",
      "lead",
      "capabilitiesFirstTitle",
      "milestonesFirstTitle"
    ];
    const liveRecord = {
      titleEn,
      leadEn,
      capabilitiesFirstTitleEn: capabilities[0]?.titleEn,
      milestonesFirstTitleEn: milestones[0]?.titleEn
    };
    return computeProgress(liveRecord, baseKeys);
  }, [titleEn, leadEn, capabilities, milestones]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setSaving(true);

    // Strip empty En fields so /pick() falls back to Chinese cleanly.
    const stripRow = <T extends TitleDescRow>(row: T): T => ({
      ...row,
      titleEn: clean(row.titleEn),
      descriptionEn: clean(row.descriptionEn)
    });
    const stripMilestone = (m: MilestoneRow): MilestoneRow => ({
      ...m,
      titleEn: clean(m.titleEn),
      descriptionEn: clean(m.descriptionEn)
    });
    const stripGlobal = (g: GlobalRow): GlobalRow => ({
      ...g,
      regionEn: clean(g.regionEn),
      descriptionEn: clean(g.descriptionEn)
    });

    const next: CompanyProfile = {
      ...company,
      title,
      titleEn: clean(titleEn),
      lead,
      leadEn: clean(leadEn),
      proof: proof.filter((p) => p.label.trim() || p.value.trim()),
      capabilities: capabilities.map(stripRow),
      culture: culture.map(stripRow),
      milestones: milestones.map(stripMilestone),
      certifications: certifications.map((c) => ({
        ...c,
        titleEn: clean(c.titleEn),
        descriptionEn: clean(c.descriptionEn)
      })),
      manufacturing: manufacturing.length > 0 ? manufacturing.map(stripRow) : undefined,
      global: globalRows.length > 0 ? globalRows.map(stripGlobal) : undefined,
      fieldReel: fieldReel.length > 0
        ? fieldReel
            .filter((t) => t.mediaId)
            .map((t) => ({
              mediaId: t.mediaId,
              caption: t.caption,
              captionEn: clean(t.captionEn),
              year: t.year,
              span: t.span,
              aspect: t.aspect
            }))
        : undefined
    };

    try {
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company: next })
      });
      if (res.ok) {
        setMessage({ type: "ok", text: "已保存,前台关于页与主页里程碑已更新。" });
        router.refresh();
      } else {
        const d = (await res.json().catch(() => ({}))) as { error?: string };
        setMessage({ type: "err", text: d.error ?? "保存失败" });
      }
    } catch {
      setMessage({ type: "err", text: "网络错误,请重试。" });
    }
    setSaving(false);
  }

  function moveItem<T>(arr: T[], i: number, dir: 1 | -1): T[] {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const next = [...arr];
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  }

  return (
    <div className="px-10 py-10">
      <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
        About · 关于页内容
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em]">
        关于页内容
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-carbon-black/60">
        维护关于页的标题与引言、4 项数据、核心能力、经营理念、里程碑、资质、制造与交付、全球交付各段。所有可双语字段支持「+ 添加 English」与「↻ 复制中文」。
      </p>

      <AdminEditToolbar
        formId={formId}
        saving={saving}
        title="关于页维护操作"
        description="长表单编辑时不需要滚到底部，这里可以直接保存。"
        viewHref="/about"
      />

      <div className="mt-5 max-w-3xl">
        <LanguageModeSwitcher mode={mode} onChange={setMode} progress={progress} />
      </div>

      <form id={formId} onSubmit={onSubmit} className="mt-8 max-w-4xl">
        {/* §1 Hero ---------------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader index="§1" title="关于页 Hero" subtitle="页头大标题与开场引言" />
          <div className="grid gap-5">
            <BilingualField
              label="标题 Title"
              kind="text"
              valueZh={title}
              valueEn={titleEn}
              onChangeZh={setTitle}
              onChangeEn={setTitleEn}
              mode={mode}
            />
            <BilingualField
              label="开场引言 Lead"
              kind="textarea"
              valueZh={lead}
              valueEn={leadEn}
              onChangeZh={setLead}
              onChangeEn={setLeadEn}
              mode={mode}
            />
          </div>
        </section>

        {/* §2 Proof strip -------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§2"
            title="4 项数据 / Proof strip"
            subtitle="关于页第一屏下方的横向四列数字。建议保留 4 条以维持视觉节奏。"
          />
          <ProofRows rows={proof} onChange={setProof} />
        </section>

        {/* §3 Capabilities ------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§3"
            title="核心能力 / Capabilities"
            subtitle="3 条核心能力,每条 标题 + 描述"
          />
          <div className="grid gap-4">
            {capabilities.map((c, i) => (
              <TitleDescEditor
                key={i}
                row={c}
                index={i}
                mode={mode}
                onChange={(next) =>
                  setCapabilities((rows) => rows.map((r, idx) => (idx === i ? next : r)))
                }
                onRemove={() =>
                  setCapabilities((rows) => rows.filter((_, idx) => idx !== i))
                }
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setCapabilities((rows) => [...rows, { title: "", description: "" }])
              }
              className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加一条能力
            </button>
          </div>
        </section>

        {/* §4 Culture ------------------------------------------------ */}
        <section className={sectionClass}>
          <SectionHeader
            index="§4"
            title="经营理念 / Operating Principles"
            subtitle="深色背景区的三列;每条 标题(如「专注 · Focus」)+ 描述"
          />
          <div className="grid gap-4">
            {culture.map((c, i) => (
              <TitleDescEditor
                key={i}
                row={c}
                index={i}
                mode={mode}
                onChange={(next) =>
                  setCulture((rows) => rows.map((r, idx) => (idx === i ? next : r)))
                }
                onRemove={() => setCulture((rows) => rows.filter((_, idx) => idx !== i))}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setCulture((rows) => [...rows, { title: "", description: "" }])
              }
              className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加一条理念
            </button>
          </div>
        </section>

        {/* §5 Manufacturing ------------------------------------------ */}
        <section className={sectionClass}>
          <SectionHeader
            index="§5"
            title="制造与交付 / Manufacturing & Delivery"
            subtitle="4 个阶段卡片;留空则该节不显示"
          />
          <div className="grid gap-4">
            {manufacturing.map((m, i) => (
              <TitleDescEditor
                key={i}
                row={m}
                index={i}
                mode={mode}
                onChange={(next) =>
                  setManufacturing((rows) =>
                    rows.map((r, idx) => (idx === i ? next : r))
                  )
                }
                onRemove={() =>
                  setManufacturing((rows) => rows.filter((_, idx) => idx !== i))
                }
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setManufacturing((rows) => [...rows, { title: "", description: "" }])
              }
              className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加一个阶段
            </button>
          </div>
        </section>

        {/* §6 Credentials -------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§6"
            title="资质与技术沉淀 / Certifications & IP"
            subtitle="3 张资质卡(默认国家级 / IP / 学府联合)"
          />
          <div className="grid gap-4">
            {certifications.map((c, i) => (
              <TitleDescEditor
                key={i}
                row={c}
                index={i}
                mode={mode}
                onChange={(next) =>
                  setCertifications((rows) =>
                    rows.map((r, idx) =>
                      idx === i
                        ? {
                            title: next.title,
                            description: next.description,
                            titleEn: next.titleEn,
                            descriptionEn: next.descriptionEn,
                            status: rows[idx].status
                          }
                        : r
                    )
                  )
                }
                onRemove={() =>
                  setCertifications((rows) => rows.filter((_, idx) => idx !== i))
                }
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setCertifications((rows) => [
                  ...rows,
                  {
                    title: "",
                    description: "",
                    status: "needs-confirmation"
                  }
                ])
              }
              className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加一份资质
            </button>
          </div>
        </section>

        {/* §7 Milestones --------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§7"
            title="发展历程 / Trajectory"
            subtitle="也会驱动主页 §7 时间线。顺序决定前台显示顺序,带「待确认」状态的会标记为 upcoming。"
          />
          <div className="grid gap-4">
            {milestones.map((m, i) => (
              <MilestoneEditor
                key={i}
                row={m}
                index={i}
                total={milestones.length}
                mode={mode}
                onChange={(next) =>
                  setMilestones((rows) => rows.map((r, idx) => (idx === i ? next : r)))
                }
                onRemove={() =>
                  setMilestones((rows) => rows.filter((_, idx) => idx !== i))
                }
                onMoveUp={() => setMilestones((rows) => moveItem(rows, i, -1))}
                onMoveDown={() => setMilestones((rows) => moveItem(rows, i, 1))}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setMilestones((rows) => [
                  ...rows,
                  {
                    year: "",
                    title: "",
                    description: "",
                    status: "confirmed"
                  }
                ])
              }
              className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加一条里程碑
            </button>
          </div>
        </section>

        {/* §8 Global ------------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§8"
            title="全球交付 / Global Delivery"
            subtitle="4 张地区卡,留空则该节不显示"
          />
          <div className="grid gap-4">
            {globalRows.map((g, i) => (
              <GlobalEditor
                key={i}
                row={g}
                index={i}
                mode={mode}
                onChange={(next) =>
                  setGlobalRows((rows) => rows.map((r, idx) => (idx === i ? next : r)))
                }
                onRemove={() =>
                  setGlobalRows((rows) => rows.filter((_, idx) => idx !== i))
                }
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setGlobalRows((rows) => [
                  ...rows,
                  { code: "", region: "", description: "" }
                ])
              }
              className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加一个地区
            </button>
          </div>
        </section>

        {/* §9 Field reel --------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§9"
            title="作业现场 / Field reel"
            subtitle="关于页底部图墙;每块选图、写说明、设大小;留空则不显示"
          />
          <div className="grid gap-4">
            {fieldReel.map((t, i) => (
              <FieldReelEditor
                key={i}
                row={t}
                index={i}
                total={fieldReel.length}
                mode={mode}
                mediaIndex={mediaIndex}
                onChange={(next) =>
                  setFieldReel((rows) => rows.map((r, idx) => (idx === i ? next : r)))
                }
                onRemove={() =>
                  setFieldReel((rows) => rows.filter((_, idx) => idx !== i))
                }
                onMoveUp={() => setFieldReel((rows) => moveItem(rows, i, -1))}
                onMoveDown={() => setFieldReel((rows) => moveItem(rows, i, 1))}
              />
            ))}
            <button
              type="button"
              onClick={() =>
                setFieldReel((rows) => [
                  ...rows,
                  {
                    mediaId: "",
                    caption: "",
                    year: "",
                    span: "2",
                    aspect: "wide"
                  }
                ])
              }
              className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
            >
              + 添加一张图
            </button>
          </div>
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

        <div className="mt-8 flex items-center gap-4 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-11 items-center justify-center bg-aviation-orange px-7 text-sm font-medium text-surface-warm transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存修改"}
          </button>
        </div>
      </form>
    </div>
  );
}
