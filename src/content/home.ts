import type {
  HomeCasesContent,
  HomeContent,
  HomeHeroContent,
  HomeInquiryContent,
  HomeManifestoContent,
  HomeOperationalProofContent,
  HomeScenariosContent,
  HomeTechContent,
  HomeTrajectoryContent
} from "@/types/content";

export const homeHero: HomeHeroContent = {
  eyebrow: "Shitian Aviation · Heavy-Lift Unmanned Helicopter Systems",
  eyebrowEn: "Shitian Aviation · Heavy-Lift Unmanned Helicopter Systems",
  title: "国产燃油重载，无人直升机系统",
  titleEn: "Heavy-fuel, heavy-lift, unmanned helicopter systems",
  subtitle:
    "面向农林植保、应急救援、海上物流与精细化场地作业的低空作业装备制造商。在产产品线涵盖 T280 / S270 燃油重载平台、H 系列电动专项机型，以及 HIZONE 低空作业数字化中枢。",
  subtitleEn:
    "A Chinese manufacturer of low-altitude operating systems for agriculture, emergency response, maritime logistics, and precision site missions. Active product lines span the T280 / S270 heavy-fuel platforms, the H-series electric specialists, and the HIZONE low-altitude operations hub.",
  productFocus: "T280 重载燃油无人直升机平台",
  metrics: [
    { label: "任务载荷", value: "80-120", unit: "kg" },
    { label: "作业半径", value: "100", unit: "km" },
    { label: "航时", value: "2-4", unit: "h" },
    { label: "成功案例", value: "81", unit: "例" }
  ],
  proofPoints: ["20 项实用新型专利", "2019 年创立", "高新技术企业"],
  primaryCta: {
    label: "项目咨询",
    labelEn: "Project inquiry",
    href: "/contact"
  },
  secondaryCta: {
    label: "T280 技术参数",
    labelEn: "T280 specifications",
    href: "/products/t280"
  },
  globalCta: {
    label: "International inquiries · sales@shitianuav.com",
    href: "mailto:sales@shitianuav.com"
  },
  visual: {
    label: "T280 重载平台空间叙事",
    fallbackLabel: "T280 重载无人直升机静态视觉",
    mediaId: "product-t280-hero"
  },
  backgroundMediaId: "home-hero-backdrop",
  threeScene: {
    id: "premium-uav-hero-t280",
    purpose: "以克制的三维空间展示 T280 的机体、双旋翼、任务载荷与低空作业尺度，服务首屏产品叙事。",
    fallbackRequired: true
  },
  sourceUrls: [
    "https://www.shitianuav.com/",
    "https://www.shitianuav.com/product/748.html",
    "https://www.shitianuav.com/p/about.html"
  ]
};

export const homeSections = [
  {
    id: "hero",
    title: "国产重载无人直升机，进入低空经济主航道",
    contentSource: ["首页", "T280 产品页", "关于我们"],
    media: ["product-t280-hero"],
    status: "structure-only"
  },
  {
    id: "brand-declaration",
    title: "以航空工程能力，重构低空作业边界",
    contentSource: ["关于我们", "企业文化"],
    media: [],
    status: "structure-only"
  },
  {
    id: "product-capability",
    title: "重载、远距、长航时，才是真正进入场景的低空能力",
    contentSource: ["T280 产品页", "S270 产品页", "典型案例"],
    media: ["product-t280-hero", "case-rescue-pump-cover"],
    status: "structure-only"
  },
  {
    id: "product-matrix",
    title: "从重载平台到数字中枢，构成低空作业装备矩阵",
    contentSource: ["产品中心", "HIZONE 产品页"],
    media: ["product-t280-hero", "product-s270-hero", "hizone-platform-screen"],
    status: "structure-only"
  },
  {
    id: "scenarios",
    title: "让低空装备进入真实任务，而不是停留在展示场",
    contentSource: ["案例中心", "新闻中心"],
    media: ["case-xinjiang-cotton-cover", "case-apple-pollination-cover", "case-rescue-pump-cover"],
    status: "structure-only"
  },
  {
    id: "technology",
    title: "从飞行平台，到可闭环的低空作业系统",
    contentSource: ["产品参数", "HIZONE 产品页"],
    media: ["hizone-platform-screen"],
    status: "structure-only"
  },
  {
    id: "case-studies",
    title: "用真实作业，验证每一项能力",
    contentSource: ["案例中心", "新闻中心"],
    media: ["case-xinjiang-cotton-cover", "case-apple-pollination-cover", "case-rescue-pump-cover"],
    status: "structure-only"
  },
  {
    id: "delivery",
    title: "从装备到任务交付，服务低空经济场景落地",
    contentSource: ["关于我们", "应用场景", "案例中心"],
    media: [],
    status: "structure-only"
  },
  {
    id: "conversion",
    title: "让我们从一个具体场景开始",
    contentSource: ["联系我们", "在线留言"],
    media: [],
    status: "structure-only"
  }
] as const;

/* ============================================================
 * Editable section content — all the previously-hardcoded copy
 * (eyebrows, headlines, body, metrics, capabilities, pillars)
 * collected into a single typed singleton so the admin can edit
 * every word on the home page without a code change.
 * ============================================================ */

const manifesto: HomeManifestoContent = {
  eyebrow: "02 — About · 企业概述",
  eyebrowEn: "02 — About · Company Profile",
  headlineLine1: "青岛世天创新航空",
  headlineLine1En: "Qingdao Shitian Innovation",
  headlineLine2: "科技有限公司",
  headlineLine2En: "Aviation Technology Co., Ltd.",
  body: "成立于 2019 年，由国际航空科技专家与吉林大学联合发起，国家高新技术企业。主营业务为燃油重载无人直升机的研发、制造与整机交付，应用方向覆盖农林植保、应急救援、海上物流与精细化场地作业。",
  bodyEn:
    "Founded in 2019 by international aerospace specialists in partnership with Jilin University, Shitian Aviation is a recognised National High-Tech Enterprise. We develop, manufacture, and deliver heavy-fuel unmanned helicopters serving agriculture & forestry, emergency response, maritime logistics, and precision site operations.",
  capabilities: [
    "整机研发与制造",
    "燃油动力系统",
    "任务载荷集成",
    "数字化作业平台"
  ],
  capabilitiesEn: [
    "Airframe R&D and manufacturing",
    "Heavy-fuel powertrain",
    "Mission payload integration",
    "Digital operations platform"
  ],
  proofPoints: [
    { value: "20", unit: "项", label: "实用新型专利", labelEn: "Utility patents", unitEn: "" },
    { value: "81", unit: "例", label: "完成作业任务", labelEn: "Operations delivered", unitEn: "" },
    { value: "5", unit: "条", label: "在产产品线", labelEn: "Active product lines", unitEn: "" },
    { value: "2019", unit: "", label: "成立年份", labelEn: "Founded" }
  ],
  tail: "National High-Tech Enterprise · Qingdao, China · Est. 2019",
  tailEn: "National High-Tech Enterprise · Qingdao, China · Est. 2019"
};

const operationalProof: HomeOperationalProofContent = {
  eyebrow: "03 — Operational Record · 任务实绩",
  eyebrowEn: "03 — Operational Record",
  headlineLine1: "T280 平台",
  headlineLine1En: "T280 platform",
  headlineLine2: "作业数据 · 2025",
  headlineLine2En: "operational record · 2025",
  body: "截至 2025 年 12 月，T280 燃油重载平台已在新疆棉田植保、威海果园授粉、莱阳梨园防霜冻、青岛山地应急吊运及黄岛海上物资投送等任务中，累计完成 81 例作业。",
  bodyEn:
    "As of December 2025, the T280 heavy-fuel platform has logged 81 missions across Xinjiang cotton-field protection, Weihai orchard pollination, Laiyang pear-orchard frost defence, Qingdao mountain rescue lifts, and Huangdao maritime supply runs.",
  metrics: [
    { value: "100", unit: "km", label: "作业半径", labelEn: "Operating radius" },
    { value: "120", unit: "kg", label: "任务载荷", labelEn: "Mission payload" },
    { value: "4", unit: "h", label: "单机航时", labelEn: "Endurance per sortie" },
    { value: "81", unit: "例", label: "累计任务", labelEn: "Operations completed", unitEn: "" }
  ],
  mediaId: "case-rescue-pump-cover"
};

const scenarios: HomeScenariosContent = {
  eyebrow: "05 — Scenarios · 作业现场",
  eyebrowEn: "05 — Scenarios · Field Operations",
  // Ordered list of scenario slugs to feature in the rotating §5 spread.
  featured: [
    "agriculture-plant-protection",
    "emergency-lift",
    "orchard-pollination",
    "frost-protection",
    "maritime-logistics",
    "forestry-protection",
    "golf-maintenance",
    "smart-field"
  ]
};

const cases: HomeCasesContent = {
  eyebrow: "Case proof · 任务实证",
  eyebrowEn: "Case proof",
  headline: "以真实任务，验证平台能力。",
  headlineEn: "Real missions, validating real capability.",
  body:
    "以下案例直接来自后台「案例库」。运营在后台勾选哪些案例上首页,前台立即展示;数量完全弹性,从一张卡到一整列都可以。",
  bodyEn:
    "Featured cases are picked from the cases library. The count adapts automatically — pin a single hero case or surface the whole shortlist, the layout follows.",
  // Legacy fallback list — preferred path is the per-case `showOnHomepage`
  // toggle. We leave this empty by default so case-level switches own the
  // single source of truth.
  featured: []
};

const tech: HomeTechContent = {
  eyebrow: "06 — Engineering · 工程系统",
  eyebrowEn: "06 — Engineering · Core systems",
  headline: "核心技术系统",
  headlineEn: "Core technology systems",
  subhead: "飞控 / 动力 / 载荷 / 智能闭环",
  subheadEn: "Flight control · Powertrain · Payload · HIZONE loop",
  pillars: [
    {
      id: "flight-control",
      code: "FC-01",
      metric: "0.5",
      unit: "m",
      name: "飞行控制",
      nameEn: "Flight Control",
      english: "Flight Control",
      role: "感知",
      roleEn: "Sense",
      caption: "地形跟随精度 ≤ 0.5m，重载工况下保持稳定姿态。",
      captionEn: "Terrain-following accuracy under 0.5 m; stable attitude even at heavy payload.",
      points: ["农业级智能飞控", "百公里级控制半径", "断链续航与航线复执"],
      pointsEn: [
        "Agricultural-grade smart autopilot",
        "Hundred-km control radius",
        "Link-loss continuation and route re-execution"
      ]
    },
    {
      id: "powertrain",
      code: "PW-02",
      metric: "46",
      unit: "kW",
      name: "动力系统",
      nameEn: "Powertrain",
      english: "Powertrain",
      role: "决策",
      roleEn: "Decide",
      caption: "S270 燃油动力连续输出 46kW，覆盖燃油与电动双路径。",
      captionEn:
        "S270 heavy-fuel powertrain sustains 46 kW; both fuel and electric paths supported.",
      points: ["95# 汽油 24–50L", "-40 至 +60℃ 工作温度", "水冷 / 自然冷却"],
      pointsEn: [
        "95 octane petrol, 24–50 L",
        "-40 to +60 °C operating range",
        "Water and passive air cooling"
      ]
    },
    {
      id: "payload",
      code: "PL-03",
      metric: "120",
      unit: "kg",
      name: "任务载荷",
      nameEn: "Payload",
      english: "Payload",
      role: "执行",
      roleEn: "Execute",
      caption: "T280 最大 120kg 任务载荷，模块化挂载适配多种任务。",
      captionEn: "T280 carries up to 120 kg mission payload with modular mounts for every task.",
      points: ["侧面挂载与吊挂兼容", "55L 喷洒 / 80L 播撒", "雾滴粒径 50–500μm"],
      pointsEn: [
        "Side mount and sling lift compatible",
        "55 L spray / 80 L spread",
        "Droplet size 50–500 μm"
      ]
    },
    {
      id: "ai",
      code: "AI-04",
      metric: "5",
      unit: "步",
      unitEn: "stages",
      name: "智能闭环",
      nameEn: "HIZONE Loop",
      english: "HIZONE Loop",
      role: "反馈",
      roleEn: "Feedback",
      caption: "感知 / 分析 / 决策 / 执行 / 反馈，构成作业闭环。",
      captionEn:
        "Sense → analyse → decide → execute → feedback, closing the operations loop.",
      points: ["多源数据采集", "AI 处方图下发", "作业效果回传与评估"],
      pointsEn: [
        "Multi-source data capture",
        "AI-issued prescription maps",
        "Result telemetry and evaluation"
      ]
    }
  ],
  footerText:
    "飞行控制、动力总成、任务载荷与智能闭环构成 T280 整机系统底盘，支撑 80–120kg 载荷、100km 控制半径与 2–4 小时单架次航时的复合任务能力。",
  footerTextEn:
    "Flight control, powertrain, payload and the HIZONE loop form the chassis of the T280 platform, sustaining 80–120 kg payload, 100 km control radius, and 2–4 h endurance per sortie."
};

const trajectory: HomeTrajectoryContent = {
  eyebrow: "07 — Trajectory · 2019 → Today",
  eyebrowEn: "07 — Trajectory · 2019 → Today",
  headline: "发展历程 · 2019 — 2025",
  headlineEn: "Trajectory · 2019 — 2025",
  mediaId: "product-t280-hero"
};

const inquiry: HomeInquiryContent = {
  eyebrow: "08 — Engage · 开启合作",
  eyebrowEn: "08 — Engage · Get in touch",
  headlineTop: "项目合作咨询",
  headlineTopEn: "Project Inquiry",
  headlineSub: "Project Inquiry",
  headlineSubEn: "Engineering, sales & partnership",
  body: "提交作业需求后，由销售工程师在两个工作日内对接，反馈机型选型、配置方案与作业组织建议，并同步提供技术资料、案例文档与海外渠道信息。",
  bodyEn:
    "After you submit a brief, a sales engineer follows up within two business days with platform selection, configuration proposals, and operational guidance — along with datasheets, case files, and international channel information.",
  response: "Response · 工作日 24 小时内回复",
  responseEn: "Response · within 24 working hours"
};

export const homeContent: HomeContent = {
  hero: homeHero,
  manifesto,
  operationalProof,
  scenarios,
  cases,
  tech,
  trajectory,
  inquiry
};
