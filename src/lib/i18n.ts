/**
 * i18n primitives shared by server and client components.
 *
 * The site ships two locales: zh (default, the path is /) and en (the path
 * is /en/...). Most content remains Chinese in the database; bilingual
 * content is exposed via optional `{field}En` fields on the typed records.
 * `pick()` reads either, with the English variant falling back to Chinese
 * when not yet authored.
 */

export const LOCALES = ["zh", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh";

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Pick the locale-appropriate value from a record that may carry an
 * optional `{field}En` overlay. Falls back to the base (Chinese) field
 * whenever the English string is missing or empty.
 */
export function pick<T extends Record<string, unknown>, K extends keyof T & string>(
  record: T,
  field: K,
  locale: Locale
): T[K] {
  if (locale === "en") {
    const enField = `${field}En` as keyof T;
    const candidate = record[enField];
    if (typeof candidate === "string" && candidate.length > 0) {
      return candidate as T[K];
    }
    if (Array.isArray(candidate) && candidate.length > 0) {
      return candidate as T[K];
    }
  }
  return record[field];
}

/**
 * Build the matching href in the opposite locale. `/` ↔ `/en`,
 * `/products/t280` ↔ `/en/products/t280`, etc. Hash and query are preserved.
 */
export function altLocaleHref(pathname: string, target: Locale): string {
  const clean = pathname || "/";
  const isEnglish = clean === "/en" || clean.startsWith("/en/");

  if (target === "en") {
    if (isEnglish) return clean;
    return clean === "/" ? "/en" : `/en${clean}`;
  }

  if (!isEnglish) return clean;
  if (clean === "/en") return "/";
  return clean.slice(3) || "/";
}

/**
 * Derive the active locale from a Next.js pathname. Anything under /en is
 * English; everything else is Chinese.
 */
export function localeFromPathname(pathname: string): Locale {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  return "zh";
}

/* -------------------------- Static UI dictionary ------------------------- */

type Dict = Record<string, { zh: string; en: string }>;

export const dictionary: Dict = {
  // Header / footer
  "nav.home": { zh: "首页", en: "Home" },
  "nav.products": { zh: "产品", en: "Fleet" },
  "nav.scenarios": { zh: "场景", en: "Scenarios" },
  "nav.technology": { zh: "技术", en: "Technology" },
  "nav.cases": { zh: "案例", en: "Case Studies" },
  "nav.news": { zh: "动态", en: "News" },
  "nav.about": { zh: "关于", en: "About" },
  "nav.contact": { zh: "联系", en: "Contact" },

  "cta.inquiry": { zh: "项目咨询", en: "Project Inquiry" },
  "cta.inquiryShort": { zh: "咨询", en: "Inquiry" },
  "cta.submitInquiry": { zh: "提交项目需求", en: "Submit Inquiry" },
  "cta.viewSpecs": { zh: "查看完整参数", en: "Full Specifications" },
  "cta.viewDetail": { zh: "查看详情", en: "View Detail" },
  "cta.enterDetail": { zh: "进入场景详情", en: "Enter Scenario" },
  "cta.readCase": { zh: "阅读完整案例", en: "Read Full Case" },
  "cta.allScenarios": { zh: "全部场景", en: "All Scenarios" },
  "cta.backList": { zh: "返回列表", en: "Back to List" },

  "form.name": { zh: "姓名", en: "Name" },
  "form.company": { zh: "公司", en: "Company" },
  "form.email": { zh: "邮箱", en: "Email" },
  "form.phone": { zh: "电话", en: "Phone" },
  "form.region": { zh: "区域", en: "Region" },
  "form.product": { zh: "关注机型", en: "Product" },
  "form.scenario": { zh: "作业场景", en: "Scenario" },
  "form.brief": { zh: "作业区域、面积或载荷需求", en: "Operation area / payload requirements" },
  "form.consent": {
    zh: "我同意世天航空根据以上信息联系我,用于产品资料、场景方案或项目合作沟通。",
    en: "I agree Shitian Aviation may contact me with product information, scenario plans, or project collaboration details."
  },
  "form.placeholder.select": { zh: "选择 / Select", en: "Select…" },
  "form.placeholder.brief": {
    zh: "比如：新疆 1000 亩棉田植保 · 7 月作业窗口 · 优先 T280",
    en: "e.g. 1000-mu cotton field protection in Xinjiang · July window · prefer T280"
  },

  // Section eyebrows / labels
  "section.about": { zh: "企业概览", en: "Company Profile" },
  "section.capabilities": { zh: "核心能力", en: "Core Capabilities" },
  "section.proof": { zh: "任务实绩", en: "Operational Record" },
  "section.fleet": { zh: "产品矩阵", en: "Fleet" },
  "section.scenarios": { zh: "作业现场", en: "Scenarios" },
  "section.technology": { zh: "工程系统", en: "Engineering" },
  "section.trajectory": { zh: "发展历程", en: "Trajectory" },
  "section.inquiry": { zh: "开放合作", en: "Engage" },
  "section.cases": { zh: "任务实证", en: "Case Proof" },
  "section.specs": { zh: "完整参数", en: "Specification" },
  "section.gallery": { zh: "装备影像", en: "Gallery" },

  // Misc UI
  "ui.loadMore": { zh: "查看更多", en: "Load more" },
  "ui.viewAll": { zh: "查看全部", en: "View all" },
  "ui.filter": { zh: "筛选", en: "Filter" },
  "ui.records": { zh: "条记录", en: "records" },
  "ui.published": { zh: "发布于", en: "Published" },
  "ui.location": { zh: "作业地点", en: "Location" },
  "ui.time": { zh: "作业时间", en: "Time" },
  "ui.task": { zh: "任务", en: "Task" },
  "ui.outcome": { zh: "结果", en: "Outcome" },
  "ui.relatedProducts": { zh: "涉及机型", en: "Products involved" },
  "ui.relatedScenarios": { zh: "关联场景", en: "Related scenarios" },
  "ui.relatedCases": { zh: "相关案例", en: "Related cases" },
  "ui.scenarioOf": { zh: "所属场景", en: "Scenario" },
  "ui.noEnglishYet": {
    zh: "",
    en: "English translation in progress — original Chinese shown."
  },

  // Locale switcher labels
  "locale.zh": { zh: "中文", en: "中文" },
  "locale.en": { zh: "English", en: "English" }
};

/**
 * Look up a dictionary string for the active locale. Falls back to the
 * Chinese variant if the key is missing entirely, so callers never crash
 * on typos in development.
 */
export function t(key: keyof typeof dictionary, locale: Locale): string {
  const entry = dictionary[key];
  if (!entry) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`[i18n] missing dictionary key: ${key}`);
    }
    return key;
  }
  return entry[locale] || entry.zh;
}
