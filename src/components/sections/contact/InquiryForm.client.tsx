"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { pick, type Locale } from "@/lib/i18n";
import type { CaseStudy, Product, Scenario } from "@/types/content";

type FormStatus = "idle" | "loading" | "sent" | "error";

type InquiryFormProps = {
  products: Product[];
  scenarios: Scenario[];
  caseStudies: CaseStudy[];
  /** Drives every label, placeholder, and button text so the form reads
   *  cleanly on both `/contact` and `/en/contact`. */
  locale?: Locale;
};

const inputClass =
  "min-h-12 w-full border-0 border-b border-carbon-black/14 bg-transparent px-0 text-base text-carbon-black outline-none transition placeholder:text-carbon-black/35 focus:border-aviation-orange";
const labelClass = "flex flex-col gap-2 text-[11px] uppercase tracking-[0.18em] text-metal-gray";

const COPY = {
  prefilled: {
    zh: "已根据来源页面预填关键字段",
    en: "Key fields prefilled from the referring page"
  },
  name: { zh: "Name · 姓名", en: "Name" },
  company: { zh: "Company · 公司", en: "Company" },
  email: { zh: "Email · 邮箱", en: "Email" },
  phone: { zh: "Phone · 电话", en: "Phone" },
  region: { zh: "Region · 区域", en: "Region" },
  product: { zh: "Product · 关注机型", en: "Product" },
  scenario: { zh: "Scenario · 作业场景", en: "Scenario" },
  selectPlaceholder: { zh: "选择 / Select", en: "Select" },
  cnOption: { zh: "China · 中国", en: "China" },
  overseasOption: { zh: "海外合作 / Overseas partnership", en: "Overseas partnership" },
  otherOption: { zh: "其他 / Other", en: "Other" },
  brief: {
    zh: "Brief · 作业区域、面积或载荷需求",
    en: "Brief · operating area, scale or payload need"
  },
  briefPlaceholder: {
    zh: "比如：新疆 1000 亩棉田植保 · 7 月作业窗口 · 优先 T280",
    en: "e.g. 1000 mu cotton-field protection in Xinjiang · July window · T280 preferred"
  },
  consent: {
    zh: "我同意世天航空根据以上信息联系我，用于产品资料、场景方案或项目合作沟通。",
    en: "I agree Shitian Aviation may contact me about product information, scenario plans, or project collaboration."
  },
  submitting: { zh: "提交中...", en: "Sending…" },
  sent: { zh: "需求已记录 · We'll get back", en: "Brief received · we'll get back" },
  submit: { zh: "提交项目需求 · Submit inquiry", en: "Submit inquiry" },
  sentNote: {
    zh: "我们会在两个工作日内回复。",
    en: "We respond within two business days."
  },
  prefRefCase: { zh: "参考案例：", en: "Reference case: " },
  prefRefProduct: { zh: "关注机型：", en: "Product of interest: " },
  prefRefScenario: { zh: "作业场景：", en: "Operating scenario: " },
  prefRefPlatform: { zh: "机型：", en: "Platform: " }
};

function InquiryFormInner({
  products,
  scenarios,
  caseStudies,
  locale = "zh"
}: InquiryFormProps) {
  const params = useSearchParams();
  const [status, setStatus] = useState<FormStatus>("idle");
  const en = locale === "en";

  // Prefill — visitors arriving from /products/:slug, /scenarios/:slug or
  // /cases/:slug should land on the form with the relevant select already
  // chosen and the brief textarea seeded with a starter line.
  const initial = useMemo(() => {
    const productSlug = params.get("product") ?? "";
    const scenarioSlug = params.get("scenario") ?? "";
    const caseSlug = params.get("case") ?? "";

    let brief = "";
    if (caseSlug) {
      const c = caseStudies.find((x) => x.slug === caseSlug);
      if (c) {
        const title = pick(c, "title", locale);
        brief = `${COPY.prefRefCase[locale]}${title}\n${COPY.prefRefPlatform[locale]}${c.productModels.join(" / ")}\n`;
      }
    } else if (productSlug) {
      const p = products.find((x) => x.slug === productSlug);
      if (p) {
        brief = `${COPY.prefRefProduct[locale]}${pick(p, "displayName", locale)}\n`;
      }
    } else if (scenarioSlug) {
      const s = scenarios.find((x) => x.slug === scenarioSlug);
      if (s) {
        brief = `${COPY.prefRefScenario[locale]}${pick(s, "name", locale)}（${pick(s, "headline", locale)}）\n`;
      }
    }

    const inferredProduct =
      productSlug ||
      (caseSlug
        ? products.find((p) =>
            caseStudies.find((c) => c.slug === caseSlug)?.productModels.includes(p.model)
          )?.slug ?? ""
        : "");

    const inferredScenario =
      scenarioSlug ||
      (caseSlug ? caseStudies.find((c) => c.slug === caseSlug)?.scenario ?? "" : "");

    return { product: inferredProduct, scenario: inferredScenario, brief };
  }, [params, locale, caseStudies, products, scenarios]);

  return (
    <>
      {initial.brief ? (
        <p className="mb-6 inline-flex items-center gap-2 border border-aviation-orange/40 bg-aviation-orange/5 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] text-aviation-orange">
          <span aria-hidden className="block h-1.5 w-1.5 rounded-full bg-aviation-orange" />
          {COPY.prefilled[locale]}
        </p>
      ) : null}

      <form
        className="grid gap-9"
        onSubmit={(event) => {
          event.preventDefault();
          setStatus("loading");
          window.setTimeout(() => setStatus("sent"), 800);
        }}
      >
        <div className="grid gap-9 md:grid-cols-2">
          <label className={labelClass}>
            {COPY.name[locale]}
            <input required className={inputClass} name="name" autoComplete="name" />
          </label>
          <label className={labelClass}>
            {COPY.company[locale]}
            <input className={inputClass} name="company" autoComplete="organization" />
          </label>
        </div>

        <div className="grid gap-9 md:grid-cols-2">
          <label className={labelClass}>
            {COPY.email[locale]}
            <input
              required
              type="email"
              className={inputClass}
              name="email"
              autoComplete="email"
            />
          </label>
          <label className={labelClass}>
            {COPY.phone[locale]}
            <input className={inputClass} name="phone" autoComplete="tel" />
          </label>
        </div>

        <div className="grid gap-9 md:grid-cols-2">
          <label className={labelClass}>
            {COPY.region[locale]}
            <select className={inputClass} name="region" defaultValue="">
              <option value="" disabled>
                {COPY.selectPlaceholder[locale]}
              </option>
              <option value="cn">{COPY.cnOption[locale]}</option>
              <option value="apac">Asia–Pacific</option>
              <option value="emea">EMEA</option>
              <option value="americas">Americas</option>
              <option value="other">{en ? "Other" : "其他 / Other"}</option>
            </select>
          </label>
          <label className={labelClass}>
            {COPY.product[locale]}
            <select
              className={inputClass}
              name="product"
              defaultValue={initial.product}
              key={`p-${initial.product}`}
            >
              <option value="">{COPY.selectPlaceholder[locale]}</option>
              {products.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.model} — {pick(p, "category", locale)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className={labelClass}>
          {COPY.scenario[locale]}
          <select
            className={inputClass}
            name="scenario"
            defaultValue={initial.scenario}
            key={`s-${initial.scenario}`}
          >
            <option value="">{COPY.selectPlaceholder[locale]}</option>
            {scenarios.map((s) => (
              <option key={s.slug} value={s.slug}>
                {pick(s, "name", locale)}
              </option>
            ))}
            <option value="overseas">{COPY.overseasOption[locale]}</option>
            <option value="other">{COPY.otherOption[locale]}</option>
          </select>
        </label>

        <label className={labelClass}>
          {COPY.brief[locale]}
          <textarea
            name="message"
            rows={5}
            defaultValue={initial.brief}
            key={`b-${initial.brief}`}
            className="w-full resize-none border-0 border-b border-carbon-black/14 bg-transparent px-0 py-3 text-base text-carbon-black outline-none transition placeholder:text-carbon-black/35 focus:border-aviation-orange"
            placeholder={COPY.briefPlaceholder[locale]}
          />
        </label>

        <label className="flex gap-3 text-xs leading-6 text-carbon-black/56">
          <input required type="checkbox" className="mt-1 accent-aviation-orange" />
          {COPY.consent[locale]}
        </label>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Button type="submit" disabled={status === "loading"}>
            {status === "loading"
              ? COPY.submitting[locale]
              : status === "sent"
                ? COPY.sent[locale]
                : COPY.submit[locale]}
          </Button>
          {status === "sent" ? (
            <span className="text-xs text-aviation-orange">{COPY.sentNote[locale]}</span>
          ) : null}
        </div>
      </form>
    </>
  );
}

// useSearchParams must be wrapped in a Suspense boundary inside the App
// Router. The fallback renders the same form scaffold without prefill, so
// no layout shift during hydration.
export function InquiryForm(props: InquiryFormProps) {
  return (
    <Suspense fallback={<InquiryFormFallback locale={props.locale} />}>
      <InquiryFormInner {...props} />
    </Suspense>
  );
}

function InquiryFormFallback({ locale = "zh" }: { locale?: Locale }) {
  return (
    <form className="grid gap-9" aria-busy>
      <div className="grid gap-9 md:grid-cols-2">
        <label className={labelClass}>
          {COPY.name[locale]}
          <input className={inputClass} disabled />
        </label>
        <label className={labelClass}>
          {COPY.company[locale]}
          <input className={inputClass} disabled />
        </label>
      </div>
    </form>
  );
}
