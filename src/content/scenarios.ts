import type { Scenario } from "@/types/content";

export const scenarios: Scenario[] = [
  {
    slug: "agriculture-plant-protection",
    name: "农业植保",
    nameEn: "Agricultural protection",
    headline: "大田植保 · 燃油重载平台连续作业",
    headlineEn: "Field-scale protection · continuous ops on a heavy-fuel platform",
    painPoint:
      "大面积棉田、果园与制种基地的核心约束在于作业半径、连续航时与组织效率。电动多旋翼机型在长时段、强日照与复杂地块作业能力有限，需由 T280 / S270 燃油重载平台承担主力运力。",
    painPointEn:
      "Large cotton fields, orchards, and seed-breeding bases are constrained by operating radius, sustained endurance, and crew organisation. Electric multirotors struggle under long sessions, harsh sun, and complex terrain — the heavy lift falls to the T280 / S270 fuel platforms.",
    recommendedProducts: ["T280", "S270", "H60"],
    taskFlow: ["作业区域踏勘", "机型与药剂匹配", "航线与处方图规划", "分段喷洒/播撒执行", "出苗与药效回评"],
    taskFlowEn: [
      "Field survey",
      "Match platform and chemistry",
      "Plan flight routes and prescription maps",
      "Execute staged spray/spread",
      "Review emergence and treatment efficacy"
    ],
    proofCases: ["xinjiang-shihezi-cotton", "orchard-low-carbon-demo", "s270-defoliant-seven-days"],
    valueMetrics: [
      { label: "T280 任务载荷", value: "80-120", unit: "kg" },
      { label: "H60 作业效率", value: "20", unit: "公顷/小时" }
    ],
    media: ["case-xinjiang-cotton-cover"],
    cta: "获取大田植保作业方案",
    ctaEn: "Request a field-protection operations plan",
    priority: "P0"
  },
  {
    slug: "orchard-pollination",
    name: "果园授粉",
    nameEn: "Orchard pollination",
    headline: "果园授粉 · 低空稳定下洗作业",
    headlineEn: "Orchard pollination · steady low-altitude downwash",
    painPoint:
      "苹果、梨、樱桃的盛花期持续仅 5–7 天，蜂群调度受限、天气波动大、人工授粉精度有限。T280 燃油重载平台在花期窗口内输出稳定下洗风场，实现均匀、可控、可复算的低空授粉。",
    painPointEn:
      "Apple, pear, and cherry blossom windows last just 5–7 days. Bee scheduling is constrained, weather is volatile, and manual pollination lacks precision. Within that window, the T280 heavy-fuel platform delivers steady downwash for uniform, controllable, repeatable low-altitude pollination.",
    ctaEn: "Inquire about orchard pollination capability",
    recommendedProducts: ["T280"],
    taskFlow: ["花期与气象判断", "授粉航线与点位规划", "低空作业执行", "授粉密度与坐果跟踪"],
    proofCases: ["weihai-apple-pollination"],
    valueMetrics: [
      { label: "50 亩授粉", value: "12", unit: "分钟" },
      { label: "预计产量提升", value: "15%-20%" }
    ],
    media: ["case-apple-pollination-cover"],
    cta: "咨询果园授粉作业能力",
    priority: "P0"
  },
  {
    slug: "frost-protection",
    name: "果园防霜冻",
    nameEn: "Frost defence",
    headline: "防霜冻 · 凌晨低温窗口低空作业",
    headlineEn: "Frost defence · pre-dawn low-altitude ops",
    painPoint:
      "霜冻常发生于凌晨 1–5 点，温度反转层稳定后地面被动防护时效有限。T280 燃油重载平台连续盘旋输出强下洗气流，打破冷暖空气分层，与地面热源协同实现热扰动覆盖。",
    painPointEn:
      "Frost typically hits between 01:00 and 05:00. Once the inversion layer settles, passive ground defence runs out of headroom. The T280 platform sustains a strong downwash that breaks the cold/warm stratification and pairs with ground heat sources to cover the field.",
    ctaEn: "Request a frost-defence low-altitude plan",
    recommendedProducts: ["T280"],
    taskFlow: ["气象与冰点风险判断", "凌晨作业组织与起降编排", "下洗风场与地面热源协同", "持续巡回与温度复核"],
    proofCases: ["laiyang-pear-frost"],
    valueMetrics: [{ label: "连续作业时段", value: "凌晨 1 点至 5 点" }],
    media: ["t280-gallery-03"],
    cta: "获取防霜冻低空作业方案",
    priority: "P0"
  },
  {
    slug: "golf-maintenance",
    name: "高尔夫养护",
    nameEn: "Golf maintenance",
    headline: "高尔夫养护 · 数字化精细作业",
    headlineEn: "Golf maintenance · data-driven precision care",
    painPoint:
      "大型球场的球道、果岭、长草区养护节奏与药械需求差异显著，人工组织成本高、用量管控难、效果验证缺乏数据。HIZONE 平台结合无人机作业与 AI 处方图，实现可对照、可复算的数据化养护。",
    painPointEn:
      "Large courses face different needs across fairway, green, and rough — staffing costs are high, dosing control is hard, and outcomes lack data. HIZONE pairs UAV operations with AI prescription maps to deliver comparable, repeatable, data-grounded care.",
    ctaEn: "Inquire about smart-venue maintenance",
    recommendedProducts: ["T280", "HIZONE"],
    taskFlow: ["场地多源数据采集", "草坪状态与处方图分析", "无人机精准作业", "用量与效果对照回评"],
    proofCases: ["longkou-golf-maintenance"],
    valueMetrics: [
      { label: "18 洞作业", value: "3", unit: "小时" },
      { label: "农药成本降低", value: "约 30%" }
    ],
    media: ["hizone-gallery-03"],
    cta: "咨询智慧场地养护方案",
    priority: "P0"
  },
  {
    slug: "forestry-protection",
    name: "林业防护",
    nameEn: "Forestry protection",
    headline: "林业防护 · 空地协同长航时作业",
    headlineEn: "Forestry protection · air-ground long-endurance ops",
    painPoint:
      "山林地形复杂、车辆难抵、人工巡查效率低，病虫害防治与防火响应依赖空地协同。S270 长航时燃油平台与 H15 轻型电动机型分层执行巡查、超低量喷雾与重点点位处置作业。",
    painPointEn:
      "Forests are hard to reach by vehicle and slow to patrol on foot, leaving pest control and fire response dependent on air-ground coordination. The S270 long-endurance fuel platform and the H15 light electric airframe split duties across patrol, ultra-low-volume spraying, and key-point treatment.",
    ctaEn: "Request a forestry protection plan",
    recommendedProducts: ["S270", "H15", "T280"],
    taskFlow: ["林区任务分级评估", "航线与载荷分层规划", "超低量喷雾或低空巡查", "地面补防与协同复核"],
    proofCases: ["s270-pine-wilt-control", "forest-fire-drill"],
    valueMetrics: [{ label: "政府认可", value: "连续三年" }],
    media: ["h15-gallery-02"],
    cta: "获取林业防护作业方案",
    priority: "P0"
  },
  {
    slug: "emergency-lift",
    name: "应急吊运",
    nameEn: "Emergency lift",
    headline: "应急吊运 · 灾害现场低空运力",
    headlineEn: "Emergency lift · low-altitude capacity at disaster sites",
    painPoint:
      "山地、水域与灾害现场存在车辆无法通行、人员难以接近的最后一公里运输需求。T280 平台可在不依赖临时道路的条件下，完成水泵、医疗物资与救援器材的精准吊运投送。",
    painPointEn:
      "Mountains, waters, and disaster zones leave a last-mile gap where vehicles can't pass and crews struggle to reach. Without any temporary road, the T280 can deliver pumps, medical supplies, and rescue gear by precision sling-lift.",
    ctaEn: "Inquire about emergency lift capability",
    recommendedProducts: ["T280", "H15"],
    taskFlow: ["任务载荷与体积确认", "起降点与禁区评估", "吊挂方案与航线规划", "现场指挥与物资投送"],
    proofCases: ["qingdao-red-cross-pump"],
    valueMetrics: [
      { label: "吊运重量", value: "60", unit: "kg" },
      { label: "上山时间", value: "10", unit: "分钟" }
    ],
    media: ["case-rescue-pump-cover"],
    cta: "咨询应急吊运能力",
    priority: "P0"
  },
  {
    slug: "maritime-logistics",
    name: "海上物流",
    nameEn: "Maritime logistics",
    headline: "海上物流 · 近岸点对点低空通道",
    headlineEn: "Maritime logistics · point-to-point low-altitude corridors",
    painPoint:
      "海上点对点投送受船期、潮汐与海况制约，小艇周转慢、人力成本高。T280 平台在近岸 15–50 公里航程内提供稳定载荷与抗风能力，承担补给、应急与救援物资投送。",
    painPointEn:
      "Ship-to-shore delivery is bound by sailing schedules, tides, and sea state — small boats are slow and labour-heavy. The T280 sustains payload and wind resistance over 15–50 km of nearshore range for supply, emergency, and rescue delivery.",
    ctaEn: "Inquire about maritime low-altitude logistics",
    recommendedProducts: ["T280"],
    taskFlow: ["海域起降点确认", "潮汐/风场与海上航线规划", "吊挂或投送执行", "任务复核与航后回执"],
    proofCases: ["huangdao-maritime-lift"],
    valueMetrics: [{ label: "点对点吊运距离", value: "15", unit: "km" }],
    media: ["t280-gallery-06"],
    cta: "咨询海上低空物流方案",
    priority: "P0"
  },
  {
    slug: "smart-field",
    name: "智慧场地",
    nameEn: "Smart field",
    headline: "智慧场地 · HIZONE 作业数据闭环",
    headlineEn: "Smart field · HIZONE closed-loop operations",
    painPoint:
      "球场、园林、试验田与特种农场的养护长期依赖经验判断，作业数据缺失、方案难以复算、效果难以对照。HIZONE 平台将感知、分析、决策、执行、反馈五个环节串接为统一数据链路。",
    painPointEn:
      "Courses, gardens, trial fields, and specialty farms rely on intuition because data is missing, plans aren't repeatable, and outcomes don't compare. HIZONE wires sense, analyse, decide, execute, and feedback into a single data chain.",
    ctaEn: "Inquire about HIZONE digital operations",
    recommendedProducts: ["HIZONE", "T280"],
    taskFlow: ["多源数据采集", "AI 状态分析", "处方图与航线决策", "无人机精准执行", "效果反馈与下一周期闭环"],
    proofCases: ["longkou-golf-maintenance"],
    valueMetrics: [{ label: "闭环流程", value: "感知-分析-决策-执行-反馈" }],
    media: ["hizone-platform-screen"],
    cta: "咨询 HIZONE 数字化方案",
    priority: "P0"
  }
];
