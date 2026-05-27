import type { FieldDef } from "@/components/admin/RecordForm.client";

// Editable-field definitions for the generic admin record form, one set per
// collection type. Fields not listed here are preserved untouched on save.

const PRIORITY_OPTIONS = [
  { value: "P0", label: "P0" },
  { value: "P1", label: "P1" },
  { value: "P2", label: "P2" },
  { value: "P3", label: "P3" }
];

export const caseFields: FieldDef[] = [
  { key: "title", label: "标题 Title", kind: "text", bilingual: true },
  { key: "summary", label: "一句话摘要 Summary", kind: "text", bilingual: true },
  { key: "location", label: "作业地点 Location", kind: "text", bilingual: true },
  { key: "time", label: "作业时间 Time", kind: "text", bilingual: true },
  {
    key: "scenario",
    label: "所属场景 Scenario",
    kind: "relation",
    optionsKey: "scenarios",
    multiple: false
  },
  {
    key: "productModels",
    label: "涉及机型 Product models",
    kind: "relation",
    optionsKey: "productModels",
    hint: "从产品列表中选择"
  },
  { key: "task", label: "任务说明 Task", kind: "textarea", bilingual: true },
  { key: "result", label: "作业结果 Result", kind: "textarea", bilingual: true },
  { key: "keyData", label: "关键数据 Key data", kind: "specs", hint: "案例页展示的关键数字" },
  { key: "media", label: "封面图 Cover", kind: "media", hint: "案例列表与详情页顶部的主图,放 1 张即可" },
  { key: "gallery", label: "现场图 Gallery", kind: "media", hint: "详情页底部展示的现场图,可上传多张" },
  {
    key: "showOnHomepage",
    label: "在主页展示 / Show on homepage",
    kind: "boolean",
    hint: "开启后该案例自动出现在首页「案例实证」节;数量、排序由案例库自动聚合决定。"
  },
  { key: "priority", label: "优先级 Priority", kind: "select", options: PRIORITY_OPTIONS }
];

export const newsFields: FieldDef[] = [
  { key: "title", label: "标题 Title", kind: "text", bilingual: true },
  {
    key: "category",
    label: "分类 Category",
    kind: "select",
    options: [
      { value: "作业案例", label: "作业案例" },
      { value: "企业动态", label: "企业动态" },
      { value: "低空政策观察", label: "低空政策观察" }
    ]
  },
  { key: "publishedAt", label: "发布时间 Published at", kind: "text", placeholder: "2025-12-26" },
  { key: "summary", label: "摘要 Summary", kind: "textarea", bilingual: true },
  { key: "tags", label: "标签 Tags（每行一个）", kind: "lines" },
  {
    key: "body",
    label: "正文 Body",
    kind: "lines",
    hint: "每行一个段落，空行将被忽略",
    bilingual: true
  },
  { key: "priority", label: "优先级 Priority", kind: "select", options: PRIORITY_OPTIONS }
];

export const technologyFields: FieldDef[] = [
  { key: "index", label: "编号 Index（如 FC-01）", kind: "text" },
  { key: "title", label: "标题 Title", kind: "text", bilingual: true },
  { key: "abstract", label: "概述 Abstract", kind: "textarea", bilingual: true },
  {
    key: "highlights",
    label: "亮点列表 Highlights（每行一条）",
    kind: "lines",
    bilingual: true,
    hint: "每行一条要点;前台显示为「• 」前缀的小列表"
  },
  {
    key: "detail",
    label: "详细块 Detail blocks",
    kind: "blocks",
    hint: "每个块 = 一个小标题 + 一段正文,双语;按顺序在前台铺开"
  }
];

export const scenarioFields: FieldDef[] = [
  { key: "name", label: "场景名称 Name", kind: "text", bilingual: true },
  { key: "headline", label: "标题句 Headline", kind: "text", bilingual: true },
  { key: "painPoint", label: "痛点描述 Pain point", kind: "textarea", bilingual: true },
  {
    key: "recommendedProducts",
    label: "推荐机型 Recommended products",
    kind: "relation",
    optionsKey: "productModels",
    hint: "从产品列表中选择"
  },
  {
    key: "taskFlow",
    label: "作业流程 Task flow",
    kind: "lines",
    hint: "每行一个步骤",
    bilingual: true
  },
  {
    key: "proofCases",
    label: "佐证案例 Proof cases",
    kind: "relation",
    optionsKey: "cases",
    hint: "从案例库中选择"
  },
  { key: "valueMetrics", label: "价值指标 Value metrics", kind: "specs" },
  { key: "media", label: "场景背景图 Media", kind: "media", hint: "场景页大背景图,可上传多张" },
  { key: "cta", label: "行动号召 CTA", kind: "text", bilingual: true },
  { key: "priority", label: "优先级 Priority", kind: "select", options: PRIORITY_OPTIONS }
];
