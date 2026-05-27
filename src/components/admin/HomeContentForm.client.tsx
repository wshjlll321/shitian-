"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { BilingualField } from "@/components/admin/BilingualField.client";
import {
  LanguageModeSwitcher,
  type EditMode
} from "@/components/admin/LanguageModeSwitcher.client";
import { MediaPicker, type MediaIndex } from "@/components/admin/MediaPicker.client";
import {
  RelationPicker,
  type RelationOption
} from "@/components/admin/RelationPicker.client";
import { computeProgress } from "@/lib/i18n-progress";
import type {
  HomeCasesContent,
  HomeContent,
  HomeInquiryContent,
  HomeManifestoContent,
  HomeMetric,
  HomeOperationalProofContent,
  HomeScenariosContent,
  HomeTechContent,
  HomeTechPillar,
  HomeTrajectoryContent
} from "@/types/content";

type HomepageCasePreview = {
  slug: string;
  title: string;
  titleEn?: string;
  location: string;
  time: string;
  priority: string;
};

type Props = {
  home: HomeContent;
  /** Media library indexed by id — feeds MediaPicker thumbnails for the
   *  three home-page image slots (hero / proof / timeline). */
  mediaIndex: MediaIndex;
  /** Scenario relation options for the §5 featured picker. */
  scenarioOptions: RelationOption[];
  /** Resolved list of cases currently flagged with `showOnHomepage`. The
   *  home admin no longer picks cases manually — this list is shown as a
   *  read-only preview with deep-links into each case's edit page. */
  homepageCases: HomepageCasePreview[];
};

const fieldClass =
  "min-h-10 w-full border border-carbon-black/15 bg-white px-2.5 text-sm text-carbon-black outline-none transition focus:border-aviation-orange";
const labelClass = "grid gap-1.5 text-[11px] uppercase tracking-[0.16em] text-metal-gray";

const sectionClass =
  "border-t-2 border-aviation-orange/40 bg-surface-warm/60 px-7 py-7 first:border-t-0";

function SectionHeader({ index, title, subtitle }: { index: string; title: string; subtitle?: string }) {
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
/*  Metric / pillar row editors — both are "array of structured records",     */
/*  rendered as a thin table with CN + EN side-by-side and per-row controls.  */
/* -------------------------------------------------------------------------- */

function MetricRows({
  rows,
  onChange
}: {
  rows: HomeMetric[];
  onChange: (next: HomeMetric[]) => void;
}) {
  function update(i: number, patch: Partial<HomeMetric>) {
    onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function add() {
    onChange([...rows, { value: "", unit: "", label: "" }]);
  }
  function remove(i: number) {
    onChange(rows.filter((_, idx) => idx !== i));
  }
  return (
    <div className="mt-3 grid gap-2.5">
      <div className="grid grid-cols-[80px_60px_minmax(0,1fr)_minmax(0,1fr)_60px_36px] gap-2 text-[10px] uppercase tracking-[0.16em] text-metal-gray">
        <span>数值</span>
        <span>单位</span>
        <span>中文标签</span>
        <span>English label</span>
        <span>EN unit</span>
        <span />
      </div>
      {rows.map((r, i) => (
        <div
          key={i}
          className="grid grid-cols-[80px_60px_minmax(0,1fr)_minmax(0,1fr)_60px_36px] gap-2"
        >
          <input className={fieldClass} value={r.value} onChange={(e) => update(i, { value: e.target.value })} />
          <input className={fieldClass} value={r.unit} onChange={(e) => update(i, { unit: e.target.value })} />
          <input className={fieldClass} value={r.label} onChange={(e) => update(i, { label: e.target.value })} />
          <input className={fieldClass} value={r.labelEn ?? ""} onChange={(e) => update(i, { labelEn: e.target.value })} />
          <input className={fieldClass} value={r.unitEn ?? ""} onChange={(e) => update(i, { unitEn: e.target.value })} />
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label="删除"
            className="border border-carbon-black/15 text-carbon-black/40 transition hover:border-signal-red hover:text-signal-red"
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

function PillarEditor({
  pillar,
  onChange,
  onRemove,
  mode
}: {
  pillar: HomeTechPillar;
  onChange: (next: HomeTechPillar) => void;
  onRemove: () => void;
  mode: EditMode;
}) {
  // Tech pillars carry many bilingual sub-fields; we lay them out as a
  // dense card so all four pillars stay scannable on one page.
  const upd = (patch: Partial<HomeTechPillar>) => onChange({ ...pillar, ...patch });
  const pointsZh = pillar.points.join("\n");
  const pointsEn = (pillar.pointsEn ?? []).join("\n");
  return (
    <div className="border border-carbon-black/10 bg-surface-warm/60 p-5">
      <div className="flex items-baseline justify-between">
        <p className="font-numeric text-[11px] uppercase tracking-[0.22em] text-aviation-orange">
          {pillar.code} · {pillar.english}
        </p>
        <button
          type="button"
          onClick={onRemove}
          className="text-[10px] uppercase tracking-[0.16em] text-carbon-black/40 transition hover:text-signal-red"
        >
          ✕ 删除支柱
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className={labelClass}>
          编号 Code
          <input className={fieldClass} value={pillar.code} onChange={(e) => upd({ code: e.target.value })} />
        </label>
        <label className={labelClass}>
          指标值 Metric
          <input className={fieldClass} value={pillar.metric} onChange={(e) => upd({ metric: e.target.value })} />
        </label>
        <label className={labelClass}>
          英文别名 English
          <input className={fieldClass} value={pillar.english} onChange={(e) => upd({ english: e.target.value })} />
        </label>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <label className={labelClass}>
          单位 Unit (中文)
          <input className={fieldClass} value={pillar.unit} onChange={(e) => upd({ unit: e.target.value })} />
        </label>
        <label className={labelClass}>
          Unit (English)
          <input className={fieldClass} value={pillar.unitEn ?? ""} onChange={(e) => upd({ unitEn: e.target.value })} />
        </label>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <BilingualField
          label="名称 Name"
          kind="text"
          valueZh={pillar.name}
          valueEn={pillar.nameEn ?? ""}
          onChangeZh={(v) => upd({ name: v })}
          onChangeEn={(v) => upd({ nameEn: v })}
          mode={mode}
        />
        <BilingualField
          label="角色 Role"
          kind="text"
          valueZh={pillar.role}
          valueEn={pillar.roleEn ?? ""}
          onChangeZh={(v) => upd({ role: v })}
          onChangeEn={(v) => upd({ roleEn: v })}
          mode={mode}
        />
      </div>
      <div className="mt-3">
        <BilingualField
          label="说明 Caption"
          kind="textarea"
          valueZh={pillar.caption}
          valueEn={pillar.captionEn ?? ""}
          onChangeZh={(v) => upd({ caption: v })}
          onChangeEn={(v) => upd({ captionEn: v })}
          mode={mode}
        />
      </div>
      <label className={`${labelClass} mt-3`}>
        要点 Points
        <div className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-1">
            <span className="text-[10px] uppercase tracking-[0.16em] text-metal-gray">中文 · 每行一条</span>
            <textarea
              className={`${fieldClass} min-h-24 py-2 leading-6`}
              value={pointsZh}
              onChange={(e) =>
                upd({
                  points: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                })
              }
            />
          </div>
          <div className="grid gap-1">
            <span className="flex items-baseline justify-between text-[10px] uppercase tracking-[0.16em] text-aviation-orange">
              <span>English · one per line</span>
              <button
                type="button"
                onClick={() => upd({ pointsEn: [...pillar.points] })}
                className="border border-carbon-black/15 px-2 py-0.5 text-[10px] normal-case tracking-normal text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
              >
                ↻ 复制中文
              </button>
            </span>
            <textarea
              className={`${fieldClass} min-h-24 py-2 leading-6`}
              value={pointsEn}
              onChange={(e) =>
                upd({
                  pointsEn: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean)
                })
              }
            />
          </div>
        </div>
      </label>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Top-level form                                                            */
/* -------------------------------------------------------------------------- */

export function HomeContentForm({ home, mediaIndex, scenarioOptions, homepageCases }: Props) {
  const router = useRouter();

  // Image picker state — each home-page image slot is a single media id
  // stored as a 1-element string[] so the existing MediaPicker can drive
  // selection. Empty array means "fall back to the built-in image".
  const [heroMedia, setHeroMedia] = useState<string[]>(
    home.hero.backgroundMediaId ? [home.hero.backgroundMediaId] : []
  );
  const [proofMedia, setProofMedia] = useState<string[]>(
    home.operationalProof.mediaId ? [home.operationalProof.mediaId] : []
  );
  const [trajectoryMedia, setTrajectoryMedia] = useState<string[]>(
    home.trajectory.mediaId ? [home.trajectory.mediaId] : []
  );

  // Hero
  const [heroEyebrow, setHeroEyebrow] = useState(home.hero.eyebrow);
  const [heroEyebrowEn, setHeroEyebrowEn] = useState(home.hero.eyebrowEn ?? "");
  const [heroTitle, setHeroTitle] = useState(home.hero.title);
  const [heroTitleEn, setHeroTitleEn] = useState(home.hero.titleEn ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(home.hero.subtitle);
  const [heroSubtitleEn, setHeroSubtitleEn] = useState(home.hero.subtitleEn ?? "");

  // Manifesto
  const [manifesto, setManifesto] = useState<HomeManifestoContent>(home.manifesto);
  // OperationalProof
  const [proof, setProof] = useState<HomeOperationalProofContent>(home.operationalProof);
  // Scenarios (admin picks which scenario slugs to feature on §5).
  const [scenarios, setScenarios] = useState<HomeScenariosContent>(home.scenarios);
  // Cases (admin picks featured cases for the dedicated §"案例实证" section).
  const [cases, setCases] = useState<HomeCasesContent>(home.cases);
  // Tech
  const [tech, setTech] = useState<HomeTechContent>(home.tech);
  // Trajectory
  const [trajectory, setTrajectory] = useState<HomeTrajectoryContent>(home.trajectory);
  // Inquiry
  const [inquiry, setInquiry] = useState<HomeInquiryContent>(home.inquiry);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [mode, setMode] = useState<EditMode>("zh");

  // Strip empty EN strings before save so `pick()` falls back to Chinese.
  const clean = (v: string | undefined) => (v && v.trim() ? v.trim() : undefined);

  // ----- Live translation progress (top of page) ---------------------------
  const progress = useMemo(() => {
    const baseKeys = ["heroTitle", "heroSubtitle", "manifestoBody", "proofBody", "techHeadline", "inquiryBody"];
    const liveRecord = {
      heroTitleEn,
      heroSubtitleEn,
      manifestoBodyEn: manifesto.bodyEn,
      proofBodyEn: proof.bodyEn,
      techHeadlineEn: tech.headlineEn,
      inquiryBodyEn: inquiry.bodyEn
    };
    return computeProgress(liveRecord, baseKeys);
  }, [heroTitleEn, heroSubtitleEn, manifesto.bodyEn, proof.bodyEn, tech.headlineEn, inquiry.bodyEn]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setMessage(null);
    setSaving(true);

    const next: HomeContent = {
      hero: {
        ...home.hero,
        eyebrow: heroEyebrow,
        eyebrowEn: clean(heroEyebrowEn),
        title: heroTitle,
        titleEn: clean(heroTitleEn),
        subtitle: heroSubtitle,
        subtitleEn: clean(heroSubtitleEn),
        backgroundMediaId: heroMedia[0] || undefined
      },
      manifesto,
      operationalProof: { ...proof, mediaId: proofMedia[0] || undefined },
      scenarios,
      cases,
      tech,
      trajectory: { ...trajectory, mediaId: trajectoryMedia[0] || undefined },
      inquiry
    };

    try {
      const res = await fetch("/api/admin/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ home: next })
      });
      if (res.ok) {
        setMessage({ type: "ok", text: "已保存,前台主页已更新。" });
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

  return (
    <div className="px-10 py-10">
      <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
        Home · 主页内容
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em]">主页内容</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-carbon-black/60">
        维护主页 8 节的眉标、标题、正文、指标与技术支柱。所有可双语字段都支持「+ 添加 English」与「↻ 复制中文」。
      </p>

      <div className="mt-5 max-w-3xl">
        <LanguageModeSwitcher mode={mode} onChange={setMode} progress={progress} />
      </div>

      <form onSubmit={onSubmit} className="mt-8 max-w-4xl">
        {/* §1 Hero ----------------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§1"
            title="Hero · 首屏"
            subtitle="主屏眉标、主标题、副描述与背景大图"
          />
          <div className="grid gap-5">
            <BilingualField label="眉标 Eyebrow" kind="text" valueZh={heroEyebrow} valueEn={heroEyebrowEn} onChangeZh={setHeroEyebrow} onChangeEn={setHeroEyebrowEn} mode={mode} />
            <BilingualField label="主标题 Title" kind="text" valueZh={heroTitle} valueEn={heroTitleEn} onChangeZh={setHeroTitle} onChangeEn={setHeroTitleEn} mode={mode} />
            <BilingualField label="副描述 Subtitle" kind="textarea" valueZh={heroSubtitle} valueEn={heroSubtitleEn} onChangeZh={setHeroSubtitle} onChangeEn={setHeroSubtitleEn} mode={mode} />
            <div className="border-t border-carbon-black/10 pt-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-metal-gray">
                Hero 背景图 / Background image
              </p>
              <p className="mt-1 text-[12px] text-carbon-black/55">
                首屏大背景。从媒体库选 1 张;留空则用默认底图。
              </p>
              <div className="mt-3">
                <MediaPicker
                  value={heroMedia}
                  onChange={setHeroMedia}
                  mediaIndex={mediaIndex}
                  multiple={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* §2 Manifesto ------------------------------------------------ */}
        <section className={sectionClass}>
          <SectionHeader index="§2" title="Manifesto · 公司主张" subtitle="眉标 / 双行大标题 / 描述 / 4 项能力 / 4 项数据" />
          <div className="grid gap-5">
            <BilingualField label="眉标 Eyebrow" kind="text" valueZh={manifesto.eyebrow} valueEn={manifesto.eyebrowEn ?? ""} onChangeZh={(v) => setManifesto({ ...manifesto, eyebrow: v })} onChangeEn={(v) => setManifesto({ ...manifesto, eyebrowEn: v })} mode={mode} />
            <BilingualField label="标题第 1 行 Headline 1" kind="text" valueZh={manifesto.headlineLine1} valueEn={manifesto.headlineLine1En ?? ""} onChangeZh={(v) => setManifesto({ ...manifesto, headlineLine1: v })} onChangeEn={(v) => setManifesto({ ...manifesto, headlineLine1En: v })} mode={mode} />
            <BilingualField label="标题第 2 行 Headline 2" kind="text" valueZh={manifesto.headlineLine2} valueEn={manifesto.headlineLine2En ?? ""} onChangeZh={(v) => setManifesto({ ...manifesto, headlineLine2: v })} onChangeEn={(v) => setManifesto({ ...manifesto, headlineLine2En: v })} mode={mode} />
            <BilingualField label="正文 Body" kind="textarea" valueZh={manifesto.body} valueEn={manifesto.bodyEn ?? ""} onChangeZh={(v) => setManifesto({ ...manifesto, body: v })} onChangeEn={(v) => setManifesto({ ...manifesto, bodyEn: v })} mode={mode} />
            <label className={labelClass}>
              工程能力 Capabilities（每行一条）
              <div className="grid gap-3 md:grid-cols-2">
                <textarea className={`${fieldClass} min-h-24 py-2 leading-6`} value={manifesto.capabilities.join("\n")} onChange={(e) => setManifesto({ ...manifesto, capabilities: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
                <textarea className={`${fieldClass} min-h-24 py-2 leading-6`} value={(manifesto.capabilitiesEn ?? []).join("\n")} onChange={(e) => setManifesto({ ...manifesto, capabilitiesEn: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })} />
              </div>
            </label>
            <label className={labelClass}>
              4 项数据 Proof Points
              <MetricRows rows={manifesto.proofPoints} onChange={(rows) => setManifesto({ ...manifesto, proofPoints: rows })} />
            </label>
            <BilingualField label="底部铭牌 Tail" kind="text" valueZh={manifesto.tail} valueEn={manifesto.tailEn ?? ""} onChangeZh={(v) => setManifesto({ ...manifesto, tail: v })} onChangeEn={(v) => setManifesto({ ...manifesto, tailEn: v })} mode={mode} />
          </div>
        </section>

        {/* §3 Operational Proof --------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader index="§3" title="Operational Record · 任务实绩" subtitle="眉标 / 双行大标题 / 描述 / 4 项指标" />
          <div className="grid gap-5">
            <BilingualField label="眉标 Eyebrow" kind="text" valueZh={proof.eyebrow} valueEn={proof.eyebrowEn ?? ""} onChangeZh={(v) => setProof({ ...proof, eyebrow: v })} onChangeEn={(v) => setProof({ ...proof, eyebrowEn: v })} mode={mode} />
            <BilingualField label="标题第 1 行 Headline 1" kind="text" valueZh={proof.headlineLine1} valueEn={proof.headlineLine1En ?? ""} onChangeZh={(v) => setProof({ ...proof, headlineLine1: v })} onChangeEn={(v) => setProof({ ...proof, headlineLine1En: v })} mode={mode} />
            <BilingualField label="标题第 2 行 Headline 2" kind="text" valueZh={proof.headlineLine2} valueEn={proof.headlineLine2En ?? ""} onChangeZh={(v) => setProof({ ...proof, headlineLine2: v })} onChangeEn={(v) => setProof({ ...proof, headlineLine2En: v })} mode={mode} />
            <BilingualField label="正文 Body" kind="textarea" valueZh={proof.body} valueEn={proof.bodyEn ?? ""} onChangeZh={(v) => setProof({ ...proof, body: v })} onChangeEn={(v) => setProof({ ...proof, bodyEn: v })} mode={mode} />
            <label className={labelClass}>
              4 项指标 Metrics
              <MetricRows rows={proof.metrics} onChange={(rows) => setProof({ ...proof, metrics: rows })} />
            </label>
            <div className="border-t border-carbon-black/10 pt-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-metal-gray">
                §3 背景图 / Backdrop image
              </p>
              <p className="mt-1 text-[12px] text-carbon-black/55">
                整屏铺满的电影感背景。推荐选有人物或机型动作的实拍图。
              </p>
              <div className="mt-3">
                <MediaPicker
                  value={proofMedia}
                  onChange={setProofMedia}
                  mediaIndex={mediaIndex}
                  multiple={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* §5 Scenarios picker ---------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§5"
            title="Scenarios · 作业现场"
            subtitle="眉标 + 在主页轮播展示哪些场景(顺序决定显示顺序)"
          />
          <div className="grid gap-5">
            <BilingualField
              label="眉标 Eyebrow"
              kind="text"
              valueZh={scenarios.eyebrow}
              valueEn={scenarios.eyebrowEn ?? ""}
              onChangeZh={(v) => setScenarios({ ...scenarios, eyebrow: v })}
              onChangeEn={(v) => setScenarios({ ...scenarios, eyebrowEn: v })}
              mode={mode}
            />
            <label className={labelClass}>
              在主页展示的场景 Featured scenarios（从场景库中选,数量弹性）
              <RelationPicker
                value={scenarios.featured}
                onChange={(next) => setScenarios({ ...scenarios, featured: next })}
                options={scenarioOptions}
              />
            </label>
          </div>
        </section>

        {/* §"案例实证" Featured cases --------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§6"
            title="Case proof · 案例实证"
            subtitle="眉标 / 标题 / 描述 + 从案例库挑案例(数量弹性,留空则该节隐藏)"
          />
          <div className="grid gap-5">
            <BilingualField
              label="眉标 Eyebrow"
              kind="text"
              valueZh={cases.eyebrow}
              valueEn={cases.eyebrowEn ?? ""}
              onChangeZh={(v) => setCases({ ...cases, eyebrow: v })}
              onChangeEn={(v) => setCases({ ...cases, eyebrowEn: v })}
              mode={mode}
            />
            <BilingualField
              label="标题 Headline"
              kind="text"
              valueZh={cases.headline}
              valueEn={cases.headlineEn ?? ""}
              onChangeZh={(v) => setCases({ ...cases, headline: v })}
              onChangeEn={(v) => setCases({ ...cases, headlineEn: v })}
              mode={mode}
            />
            <BilingualField
              label="描述 Body"
              kind="textarea"
              valueZh={cases.body}
              valueEn={cases.bodyEn ?? ""}
              onChangeZh={(v) => setCases({ ...cases, body: v })}
              onChangeEn={(v) => setCases({ ...cases, bodyEn: v })}
              mode={mode}
            />
            <div className="grid gap-2 border-l-2 border-aviation-orange/35 bg-surface-warm/50 px-4 py-4">
              <div className="flex items-baseline justify-between">
                <p className="text-[10px] uppercase tracking-[0.18em] text-aviation-orange">
                  当前在主页显示的案例 / Currently on homepage
                </p>
                <span className="font-numeric text-[11px] text-carbon-black/55">
                  {homepageCases.length} 条
                </span>
              </div>
              <p className="text-[12px] leading-6 text-carbon-black/65">
                案例是否上主页,改由<strong className="text-carbon-black">案例编辑页</strong>的「在主页展示」开关控制 — 不用回这里维护数组。下方实时显示已开关的案例,点击直接跳去编辑。
              </p>
              {homepageCases.length === 0 ? (
                <p className="mt-1 text-[12px] text-carbon-black/45">
                  暂未勾选任何案例。前往
                  {" "}
                  <a
                    href="/admin/cases"
                    className="text-aviation-orange underline decoration-aviation-orange/40 underline-offset-2 hover:no-underline"
                  >
                    案例库
                  </a>
                  {" "}
                  打开任一案例,在底部勾选「在主页展示」即可。
                </p>
              ) : (
                <ul className="mt-1 grid gap-1.5">
                  {homepageCases.map((c) => (
                    <li
                      key={c.slug}
                      className="flex items-baseline justify-between gap-3 border-b border-carbon-black/10 pb-1.5"
                    >
                      <div className="min-w-0 flex-1">
                        <a
                          href={`/admin/cases/${c.slug}`}
                          className="text-[13px] text-carbon-black transition hover:text-aviation-orange"
                        >
                          {c.title}
                        </a>
                        <p className="mt-0.5 truncate text-[11px] text-carbon-black/45">
                          {c.location || "—"} · {c.time || "持续"} · {c.priority}
                          {c.titleEn ? ` · EN ✓` : ""}
                        </p>
                      </div>
                      <a
                        href={`/admin/cases/${c.slug}`}
                        className="shrink-0 font-numeric text-[11px] uppercase tracking-[0.16em] text-aviation-orange transition hover:underline"
                      >
                        编辑 →
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-2 text-[11px] leading-5 text-carbon-black/40">
                小提示:1 张 = 整宽大卡;2 张 = 双卡并排;3 张及以上 = 3 列网格。
                完全留空时主页该节自动隐藏,Slide dots 一并收回。
              </p>
            </div>
          </div>
        </section>

        {/* §6 Tech ----------------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader index="§6" title="Engineering · 工程系统" subtitle="眉标 / 标题 / 副标 / 4 个技术支柱 / 底部说明" />
          <div className="grid gap-5">
            <BilingualField label="眉标 Eyebrow" kind="text" valueZh={tech.eyebrow} valueEn={tech.eyebrowEn ?? ""} onChangeZh={(v) => setTech({ ...tech, eyebrow: v })} onChangeEn={(v) => setTech({ ...tech, eyebrowEn: v })} mode={mode} />
            <BilingualField label="主标题 Headline" kind="text" valueZh={tech.headline} valueEn={tech.headlineEn ?? ""} onChangeZh={(v) => setTech({ ...tech, headline: v })} onChangeEn={(v) => setTech({ ...tech, headlineEn: v })} mode={mode} />
            <BilingualField label="副标 Subhead" kind="text" valueZh={tech.subhead} valueEn={tech.subheadEn ?? ""} onChangeZh={(v) => setTech({ ...tech, subhead: v })} onChangeEn={(v) => setTech({ ...tech, subheadEn: v })} mode={mode} />
            <div className="grid gap-3">
              <p className="text-[10px] uppercase tracking-[0.16em] text-metal-gray">技术支柱 Pillars</p>
              {tech.pillars.map((p, i) => (
                <PillarEditor
                  key={p.id}
                  pillar={p}
                  onChange={(next) => setTech({ ...tech, pillars: tech.pillars.map((x, idx) => (idx === i ? next : x)) })}
                  onRemove={() => setTech({ ...tech, pillars: tech.pillars.filter((_, idx) => idx !== i) })}
                  mode={mode}
                />
              ))}
              <button
                type="button"
                onClick={() =>
                  setTech({
                    ...tech,
                    pillars: [
                      ...tech.pillars,
                      {
                        id: `pillar-${tech.pillars.length + 1}`,
                        code: "",
                        metric: "",
                        unit: "",
                        name: "",
                        english: "",
                        role: "",
                        caption: "",
                        points: []
                      }
                    ]
                  })
                }
                className="w-fit border border-dashed border-carbon-black/25 px-3 py-1 text-[11px] text-carbon-black/60 transition hover:border-aviation-orange hover:text-aviation-orange"
              >
                + 添加支柱
              </button>
            </div>
            <BilingualField label="底部说明 Footer text" kind="textarea" valueZh={tech.footerText} valueEn={tech.footerTextEn ?? ""} onChangeZh={(v) => setTech({ ...tech, footerText: v })} onChangeEn={(v) => setTech({ ...tech, footerTextEn: v })} mode={mode} />
          </div>
        </section>

        {/* §7 Trajectory ---------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader
            index="§7"
            title="Trajectory · 发展历程"
            subtitle="眉标 / 标题 / 中央铭牌图(里程碑条目在「关于」编辑页)"
          />
          <div className="grid gap-5">
            <BilingualField label="眉标 Eyebrow" kind="text" valueZh={trajectory.eyebrow} valueEn={trajectory.eyebrowEn ?? ""} onChangeZh={(v) => setTrajectory({ ...trajectory, eyebrow: v })} onChangeEn={(v) => setTrajectory({ ...trajectory, eyebrowEn: v })} mode={mode} />
            <BilingualField label="主标题 Headline" kind="text" valueZh={trajectory.headline} valueEn={trajectory.headlineEn ?? ""} onChangeZh={(v) => setTrajectory({ ...trajectory, headline: v })} onChangeEn={(v) => setTrajectory({ ...trajectory, headlineEn: v })} mode={mode} />
            <div className="border-t border-carbon-black/10 pt-5">
              <p className="text-[10px] uppercase tracking-[0.16em] text-metal-gray">
                中央铭牌图 / Centre plate image
              </p>
              <p className="mt-1 text-[12px] text-carbon-black/55">
                时间线中央悬浮的 T280 铭牌图。可换成其它机型实拍。
              </p>
              <div className="mt-3">
                <MediaPicker
                  value={trajectoryMedia}
                  onChange={setTrajectoryMedia}
                  mediaIndex={mediaIndex}
                  multiple={false}
                />
              </div>
            </div>
          </div>
        </section>

        {/* §8 Inquiry ------------------------------------------------- */}
        <section className={sectionClass}>
          <SectionHeader index="§8" title="Engage · 开启合作" subtitle="眉标 / 双标题 / 正文 / 响应时长" />
          <div className="grid gap-5">
            <BilingualField label="眉标 Eyebrow" kind="text" valueZh={inquiry.eyebrow} valueEn={inquiry.eyebrowEn ?? ""} onChangeZh={(v) => setInquiry({ ...inquiry, eyebrow: v })} onChangeEn={(v) => setInquiry({ ...inquiry, eyebrowEn: v })} mode={mode} />
            <BilingualField label="主标题 Headline" kind="text" valueZh={inquiry.headlineTop} valueEn={inquiry.headlineTopEn ?? ""} onChangeZh={(v) => setInquiry({ ...inquiry, headlineTop: v })} onChangeEn={(v) => setInquiry({ ...inquiry, headlineTopEn: v })} mode={mode} />
            <BilingualField label="副标 Subline" kind="text" valueZh={inquiry.headlineSub} valueEn={inquiry.headlineSubEn ?? ""} onChangeZh={(v) => setInquiry({ ...inquiry, headlineSub: v })} onChangeEn={(v) => setInquiry({ ...inquiry, headlineSubEn: v })} mode={mode} />
            <BilingualField label="正文 Body" kind="textarea" valueZh={inquiry.body} valueEn={inquiry.bodyEn ?? ""} onChangeZh={(v) => setInquiry({ ...inquiry, body: v })} onChangeEn={(v) => setInquiry({ ...inquiry, bodyEn: v })} mode={mode} />
            <BilingualField label="响应文案 Response" kind="text" valueZh={inquiry.response} valueEn={inquiry.responseEn ?? ""} onChangeZh={(v) => setInquiry({ ...inquiry, response: v })} onChangeEn={(v) => setInquiry({ ...inquiry, responseEn: v })} mode={mode} />
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

        <div className="mt-7 flex items-center gap-4 pb-4">
          <button
            type="submit"
            disabled={saving}
            className="flex min-h-11 items-center justify-center bg-aviation-orange px-7 text-sm font-medium text-surface-warm transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "保存中…" : "保存全部"}
          </button>
        </div>
      </form>
    </div>
  );
}
