import type { Product, ProductHotspot } from "@/types/content";

// Shared hotspot library — single source of truth for the exploded-view
// scene positions. Products reference them by composition, not magic
// strings, so a CMS can attach hotspots per product without forcing the
// front-end to ship a `slug === "t280"` branch.
const HOTSPOTS: Record<string, ProductHotspot> = {
  rotor: {
    id: "RT",
    label: "主旋翼系统",
    detail: "5 叶旋翼直径 3.7m，提供重载工况下的升力与悬停稳定性。",
    position: [0.4, 1.0, 0]
  },
  payload: {
    id: "PL",
    label: "侧挂任务舱",
    detail: "支持 80–120kg 任务载荷，宽 1000mm 任务空间适配多种挂载。",
    position: [0.4, -0.4, 1.0]
  },
  tail: {
    id: "TR",
    label: "尾旋翼组件",
    detail: "三叶尾桨抵消主旋翼反扭矩，复杂气流下保持航向稳定。",
    position: [-2.6, 0.5, 0.4]
  },
  skid: {
    id: "LG",
    label: "起落架",
    detail: "钢制双轨结构，适配田间、山地、海上甲板等多种起降场地。",
    position: [0.6, -0.95, 0.6]
  }
};

export const products: Product[] = [
  {
    slug: "t280",
    model: "T280",
    displayName: "T280 重载燃油无人直升机",
    displayNameEn: "T280 Heavy-Fuel Unmanned Helicopter",
    category: "重载燃油无人直升机",
    categoryEn: "Heavy-fuel unmanned helicopter",
    strategicRole: "重载远航复杂任务平台",
    strategicRoleEn: "Heavy-payload long-range mission platform",
    summary: "120kg 任务载荷 · 100km 作业半径 · 2-4h 航时",
    summaryEn: "120 kg payload · 100 km radius · 2–4 h endurance",
    positioning: "国产重载燃油直升机的旗舰平台，面向远距、复杂地形与海上甲板作业。",
    positioningEn:
      "China's flagship heavy-fuel UAV — built for long-range missions, complex terrain, and shipboard operations.",
    narrative:
      "T280 以航空工程方法标定整机，把 80–120kg 任务载荷、100km 作业半径与 2–4h 单架次航时，稳定输出到大田植保、果园授粉、山地吊运与海上投送等真实任务。新疆棉田连续一个月作业、黄岛 15 公里海上点对点吊运、青岛红十字山地吊运演练——产品能力以可被复算的作业证据为底座。",
    narrativeEn:
      "Engineered as a full aviation airframe, the T280 delivers 80–120 kg payload, 100 km radius, and 2–4 h endurance across cotton-field protection, orchard pollination, mountain lifts, and maritime delivery. Continuous month-long Xinjiang operations, a 15 km Huangdao ship-to-shore lift, and the Qingdao Red Cross mountain exercise — every capability rests on reproducible field evidence.",
    keyCapabilities: [
      "80–120kg 任务载荷",
      "100km 视距外作业半径",
      "2–4h 单架次航时",
      "侧面挂载与吊挂双模"
    ],
    keyCapabilitiesEn: [
      "80–120 kg mission payload",
      "100 km beyond-visual-range radius",
      "2–4 h endurance per sortie",
      "Side mount and sling-lift dual mode"
    ],
    keyMetrics: [
      { label: "任务载荷", value: "80-120", unit: "kg" },
      { label: "作业半径", value: "100", unit: "km" },
      { label: "航时", value: "2-4", unit: "h" },
      { label: "升限", value: "3000", unit: "m" }
    ],
    specifications: [
      { group: "dimensions", label: "主旋翼直径", value: "3700", unit: "mm" },
      { group: "dimensions", label: "主轴轴距", value: "2150", unit: "mm" },
      { group: "dimensions", label: "空机重量", value: "150", unit: "kg" },
      { group: "dimensions", label: "总重", value: "280", unit: "kg" },
      { group: "dimensions", label: "机身长度", value: "5260", unit: "mm" },
      { group: "dimensions", label: "机身宽度", value: "640", unit: "mm" },
      { group: "dimensions", label: "机身高度", value: "1528", unit: "mm" },
      { group: "dimensions", label: "起落架宽度", value: "1160", unit: "mm" },
      { group: "dimensions", label: "拆桨长度", value: "2635", unit: "mm" },
      { group: "performance", label: "最大飞行速度", value: "120", unit: "km/h" },
      { group: "performance", label: "巡航速度", value: "100", unit: "km/h" },
      { group: "performance", label: "经济巡航速度", value: "80", unit: "km/h" },
      { group: "performance", label: "作业半径", value: "100", unit: "km" },
      { group: "performance", label: "无地效悬停", value: "2500", unit: "m" },
      { group: "performance", label: "升限", value: "3000", unit: "m" },
      { group: "performance", label: "航时", value: "120kg 载荷 2h @ 24L；80kg 载荷 4h @ 50L" },
      { group: "powertrain", label: "燃料", value: "95# 汽油" },
      { group: "powertrain", label: "油箱容积", value: "24", unit: "L" },
      { group: "mission", label: "任务载荷", value: "80-120", unit: "kg" },
      { group: "mission", label: "侧面挂载", value: "支持" },
      { group: "mission", label: "有效挂载尺寸", value: "长 1500mm；宽 上 600mm / 下 1000mm；高 450mm" }
    ],
    scenarios: ["agriculture-plant-protection", "orchard-pollination", "frost-protection", "emergency-lift", "maritime-logistics", "golf-maintenance"],
    relatedCases: ["xinjiang-shihezi-cotton", "weihai-apple-pollination", "laiyang-pear-frost", "qingdao-red-cross-pump", "huangdao-maritime-lift"],
    media: ["product-t280-hero"],
    gallery: ["t280-gallery-01", "t280-gallery-02", "t280-gallery-03", "t280-gallery-04", "t280-gallery-05", "t280-gallery-06"],
    hotspots: [HOTSPOTS.rotor, HOTSPOTS.payload, HOTSPOTS.tail, HOTSPOTS.skid],
    heroVariant: "vehicle",
    sourceUrls: ["https://www.shitianuav.com/product/748.html"],
    ctaContext: "咨询 T280 重载作业方案",
    ctaContextEn: "Inquire about T280 heavy-lift operations",
    priority: "P0"
  },
  {
    slug: "s270",
    model: "S270",
    displayName: "S270 长航时燃油无人直升机",
    displayNameEn: "S270 Long-Endurance Heavy-Fuel Helicopter",
    category: "长航时燃油无人直升机",
    categoryEn: "Long-endurance fuel UAV",
    strategicRole: "农林长航时作业平台",
    strategicRoleEn: "Agriculture & forestry long-endurance platform",
    summary: "100kg 载荷 · 3h 续航 · 100km 控制半径",
    summaryEn: "100 kg payload · 3 h endurance · 100 km radius",
    positioning: "面向农林防护与大面积植保的长航时燃油平台，承接重载机型之外的连续作业需求。",
    positioningEn:
      "A long-endurance fuel platform for agriculture & forestry protection, picking up where heavy-lift platforms hand off.",
    narrative:
      "S270 以 46kW 连续动力、3 小时单架次续航与百公里级控制半径，把长航时作业能力，交付给西北棉田、南方果园与松材线虫病防治等农林任务。脱叶剂喷洒前后 7 天对照、阿克苏地区大田作业、连续三年获得政府认可的松材线虫病防治——案例已经在那里。",
    narrativeEn:
      "With 46 kW continuous output, 3 h endurance per sortie, and a 100 km control radius, S270 delivers long-endurance operations to north-west cotton fields, southern orchards, and pine wilt control. Seven-day defoliant before/after comparison, Aksu large-field work, and three consecutive years of officially recognised pine wilt control — the evidence is already in.",
    keyCapabilities: [
      "100kg 最大有效载荷",
      "3h 最大续航",
      "100km 控制半径",
      "3000m 实用升限"
    ],
    keyCapabilitiesEn: [
      "100 kg max effective payload",
      "3 h max endurance",
      "100 km control radius",
      "3000 m service ceiling"
    ],
    keyMetrics: [
      { label: "最大有效载荷", value: "100", unit: "kg" },
      { label: "额定载荷", value: "80", unit: "kg" },
      { label: "最大续航", value: "3", unit: "h" },
      { label: "控制半径", value: "100", unit: "km" }
    ],
    specifications: [
      { group: "dimensions", label: "最大起飞重量", value: "260", unit: "kg" },
      { group: "dimensions", label: "自重", value: "150", unit: "kg" },
      { group: "performance", label: "最大速度", value: "120", unit: "km/h" },
      { group: "performance", label: "巡航速度", value: "100", unit: "km/h" },
      { group: "performance", label: "最大续航", value: "3", unit: "h", note: "80kg 有效载荷" },
      { group: "performance", label: "实用升限", value: "3000", unit: "m" },
      { group: "performance", label: "控制半径", value: "100", unit: "km", note: "视链路而定" },
      { group: "powertrain", label: "发动机", value: "46kW", note: "@ 5500rpm continuously" },
      { group: "powertrain", label: "排气量", value: "976", unit: "cc" },
      { group: "powertrain", label: "冷却方式", value: "水冷" },
      { group: "mission", label: "最大有效载荷", value: "100", unit: "kg" },
      { group: "mission", label: "额定载荷", value: "80", unit: "kg" },
      { group: "environment", label: "工作温度", value: "-25 至 +45", unit: "℃", note: "-20℃ 以上启动" },
      { group: "environment", label: "储存温度", value: "-55 至 +70", unit: "℃" }
    ],
    scenarios: ["agriculture-plant-protection", "forestry-protection"],
    relatedCases: ["s270-defoliant-seven-days", "s270-akesu-operation", "s270-pine-wilt-control"],
    media: ["product-s270-hero"],
    gallery: ["s270-gallery-01", "s270-gallery-02", "s270-gallery-03", "s270-gallery-04", "s270-gallery-05", "s270-gallery-06"],
    hotspots: [HOTSPOTS.rotor, HOTSPOTS.payload, HOTSPOTS.tail, HOTSPOTS.skid],
    heroVariant: "vehicle",
    sourceUrls: ["https://www.shitianuav.com/product/747.html"],
    ctaContext: "咨询 S270 农林长航时方案",
    ctaContextEn: "Inquire about S270 long-endurance operations",
    priority: "P0"
  },
  {
    slug: "h15",
    model: "H15",
    displayName: "H15 单旋翼电动无人直升机",
    displayNameEn: "H15 Single-Rotor Electric Helicopter",
    category: "电动无人直升机",
    categoryEn: "Electric unmanned helicopter",
    strategicRole: "复杂环境轻型巡查平台",
    strategicRoleEn: "Light patrol platform for harsh environments",
    summary: "-40 至 +60℃ · 5kg 载荷 · 单人部署",
    summaryEn: "-40 to +60 °C · 5 kg payload · single-operator deploy",
    positioning: "面向消防巡查、山林巡检与低温环境任务的轻型电动平台。",
    positioningEn:
      "A light electric platform for fire patrol, forest inspection, and cold-weather missions.",
    narrative:
      "H15 以 18kg 起飞重量、5kg 任务载荷的单旋翼电动结构，覆盖 -40℃ 至 +60℃ 工作温度，可由单人箱内运输至作业前线，支撑山林巡查、消防前置与应急侦察等任务，把传统多旋翼机型够不到的复杂环境，纳入常态作业半径。",
    narrativeEn:
      "An 18 kg single-rotor electric airframe carrying a 5 kg payload through -40 °C to +60 °C, the H15 fits in a single carry case and brings forest patrol, forward fire support, and emergency reconnaissance into routine operating range — environments multi-rotors cannot reliably reach.",
    keyCapabilities: [
      "5kg 任务载荷",
      "5km 控制半径",
      "-40℃ 至 +60℃ 工作温度",
      "单人部署，模块化挂载"
    ],
    keyCapabilitiesEn: [
      "5 kg mission payload",
      "5 km control radius",
      "-40 to +60 °C operating range",
      "Single-operator deploy, modular mounts"
    ],
    keyMetrics: [
      { label: "载重", value: "5", unit: "kg" },
      { label: "航速", value: "60", unit: "km/h" },
      { label: "控制半径", value: "5", unit: "km" },
      { label: "抗风能力", value: "40", unit: "km/h" }
    ],
    specifications: [
      { group: "dimensions", label: "最大起飞重量", value: "18", unit: "kg" },
      { group: "dimensions", label: "自重", value: "12", unit: "kg" },
      { group: "dimensions", label: "展开尺寸", value: "L2080 × H372 × W390", unit: "mm" },
      { group: "dimensions", label: "收纳尺寸", value: "L1620 × H310 × W150", unit: "mm" },
      { group: "dimensions", label: "箱体外部尺寸", value: "L1280 × H600 × W260", unit: "mm" },
      { group: "performance", label: "航时", value: "40 / 50", unit: "分钟", note: "3kg / 1kg 载荷" },
      { group: "performance", label: "航速", value: "60", unit: "km/h" },
      { group: "performance", label: "升限", value: "500", unit: "m" },
      { group: "performance", label: "抗风能力", value: "40", unit: "km/h" },
      { group: "performance", label: "控制半径", value: "5", unit: "km" },
      { group: "powertrain", label: "电池", value: "12S 33Ah" },
      { group: "powertrain", label: "冷却方式", value: "自然冷却" },
      { group: "mission", label: "载重", value: "5", unit: "kg" },
      { group: "mission", label: "导航", value: "GPS" },
      { group: "environment", label: "工作温度", value: "-40 至 +60", unit: "℃", note: "-30℃ 以上启动" },
      { group: "environment", label: "储存温度", value: "-55 至 +70", unit: "℃" }
    ],
    scenarios: ["forestry-protection", "emergency-lift"],
    relatedCases: ["forest-fire-drill"],
    media: ["product-h15-hero"],
    gallery: ["h15-gallery-01", "h15-gallery-02", "h15-gallery-03", "h15-gallery-04", "h15-gallery-05", "h15-gallery-06"],
    hotspots: [HOTSPOTS.rotor, HOTSPOTS.tail, HOTSPOTS.skid],
    heroVariant: "vehicle",
    sourceUrls: ["https://www.shitianuav.com/product/746.html"],
    ctaContext: "咨询 H15 巡查与复杂环境方案",
    ctaContextEn: "Inquire about H15 patrol and harsh-environment ops",
    priority: "P0"
  },
  {
    slug: "h60",
    model: "H60",
    displayName: "H60 电动无人植保机",
    displayNameEn: "H60 Electric Agricultural UAV",
    category: "电动植保无人机",
    categoryEn: "Electric agricultural UAV",
    strategicRole: "高效率电动植保平台",
    strategicRoleEn: "High-efficiency electric protection platform",
    summary: "20 公顷/小时 · 55L 喷洒 · IP67 防护",
    summaryEn: "20 ha/hour · 55 L spray · IP67",
    positioning: "面向中小面积、高频次植保的电动作业平台，与重载燃油机型形成机型分层。",
    positioningEn:
      "An electric platform for small to mid-area, high-frequency protection — sitting alongside the heavy-fuel fleet as a complementary tier.",
    narrative:
      "H60 以 55L 喷洒、80L 播撒任务舱与离心式雾滴系统，把每小时 20 公顷的作业效率，交付给中小面积、高频次的植保任务；IP67 防护等级与 10 分钟三相快充，让作业组织从单架次思维转向连续轮转。",
    narrativeEn:
      "With a 55 L spray tank, 80 L spreader, and centrifugal atomiser, the H60 delivers 20 ha/hour to small- and mid-area, high-frequency protection. IP67 sealing and a 10-minute three-phase fast charge let operations move from single-sortie thinking to continuous rotation.",
    keyCapabilities: [
      "55L 喷洒 / 80L 播撒任务舱",
      "20 公顷/小时作业效率",
      "IP67 防护等级",
      "10 分钟三相快充"
    ],
    keyCapabilitiesEn: [
      "55 L spray / 80 L spread tanks",
      "20 ha/hour throughput",
      "IP67 protection rating",
      "10-minute three-phase fast charge"
    ],
    keyMetrics: [
      { label: "喷洒箱容量", value: "55", unit: "L" },
      { label: "播撒箱容量", value: "80", unit: "L" },
      { label: "作业效率", value: "20", unit: "公顷/小时" },
      { label: "防护等级", value: "IP67" }
    ],
    specifications: [
      { group: "dimensions", label: "机身尺寸", value: "3060 × 3050 × 860", unit: "mm" },
      { group: "dimensions", label: "运输尺寸", value: "1110 × 850 × 860", unit: "mm" },
      { group: "dimensions", label: "最大起飞重量", value: "106", unit: "kg" },
      { group: "performance", label: "地形追踪精度", value: "≤ 0.5", unit: "m" },
      { group: "powertrain", label: "电池", value: "18S 30000mAh" },
      { group: "powertrain", label: "充电时间", value: "10", unit: "分钟", note: "三相交流快充" },
      { group: "mission", label: "飞控", value: "高度集成农业智能系统" },
      { group: "mission", label: "导航", value: "GPS" },
      { group: "mission", label: "喷洒箱容量", value: "55", unit: "L" },
      { group: "mission", label: "播撒箱容量", value: "80", unit: "L" },
      { group: "mission", label: "喷洒宽度", value: "8-12", unit: "m" },
      { group: "mission", label: "喷嘴类型", value: "离心式喷嘴" },
      { group: "mission", label: "雾滴尺寸", value: "50-500", unit: "μm" },
      { group: "mission", label: "单次作业效率", value: "3.3", unit: "公顷/次" },
      { group: "mission", label: "作业效率", value: "20", unit: "公顷/小时" },
      { group: "mission", label: "FPV 相机", value: "1080P 星光级，单轴云台，超广角" },
      { group: "mission", label: "遥控器", value: "Z14 智能遥控器", note: "5.5 英寸高亮屏，IP67" },
      { group: "environment", label: "防护等级", value: "IP67" }
    ],
    scenarios: ["agriculture-plant-protection"],
    relatedCases: [],
    media: ["product-h60-hero"],
    gallery: ["h60-gallery-01", "h60-gallery-02", "h60-gallery-03", "h60-gallery-04", "h60-gallery-05", "h60-gallery-06"],
    hotspots: [],
    heroVariant: "vehicle",
    sourceUrls: ["https://www.shitianuav.com/product/745.html"],
    ctaContext: "咨询 H60 电动植保方案",
    ctaContextEn: "Inquire about H60 electric protection ops",
    priority: "P0"
  },
  {
    slug: "hizone",
    model: "HIZONE",
    displayName: "HIZONE 低空作业数字化平台",
    displayNameEn: "HIZONE Digital Operations Platform",
    category: "数字化作业平台",
    categoryEn: "Digital operations platform",
    strategicRole: "低空作业数字化中枢",
    strategicRoleEn: "Low-altitude operations digital hub",
    summary: "感知 · 分析 · 决策 · 执行 · 反馈",
    summaryEn: "Sense · Analyse · Decide · Execute · Feedback",
    positioning: "把单次飞行扩展为可迭代的作业系统，让低空作业脱离一次性展示。",
    positioningEn:
      "Extends a single sortie into an iterative operating system, taking low-altitude flight beyond one-off demonstration.",
    narrative:
      "HIZONE 连接卫星遥感、无人机巡查与地面传感的数据流，自动生成处方图与航线方案，让 T280 / S270 / H60 等机型在统一闭环中完成精准农业、林业防护与场地养护任务。从一次任务到一个周期，从一个周期到下一个周期——HIZONE 让作业从单次飞行，升级为可对照、可复算、可优化的运营体系。",
    narrativeEn:
      "HIZONE links satellite remote sensing, UAV inspection, and ground-sensor data flows, auto-generating prescription maps and flight plans for T280 / S270 / H60 platforms across precision agriculture, forestry, and site maintenance. From one mission to one cycle, from one cycle to the next — HIZONE elevates each flight into a benchmarkable, repeatable, optimisable operating system.",
    keyCapabilities: [
      "多源数据采集与影像分析",
      "AI 处方图生成与航线下发",
      "无人机任务执行与状态回传",
      "作业效果评估与下一周期闭环"
    ],
    keyCapabilitiesEn: [
      "Multi-source data capture and image analysis",
      "AI prescription maps and flight-plan dispatch",
      "UAV mission execution with telemetry feedback",
      "Operation evaluation closing into the next cycle"
    ],
    keyMetrics: [
      { label: "闭环步骤", value: "5", unit: "步" },
      { label: "适用机型", value: "T280 · S270 · H60" },
      { label: "应用方向", value: "精准农业 / 智慧场地 / 高尔夫" }
    ],
    specifications: [
      { group: "system", label: "平台定位", value: "AI 智能中枢与无人机协同执行平台" },
      { group: "system", label: "任务闭环", value: "感知 · 分析 · 决策 · 执行 · 反馈" },
      { group: "system", label: "应用方向", value: "精准农业 / 智慧场地 / 高尔夫 / 园林管理" },
      { group: "mission", label: "适配机型", value: "T280 · S270 · H60" }
    ],
    scenarios: ["golf-maintenance", "smart-field"],
    relatedCases: ["longkou-golf-maintenance"],
    media: ["hizone-platform-screen"],
    gallery: ["hizone-gallery-01", "hizone-gallery-02", "hizone-gallery-03", "hizone-gallery-04", "hizone-gallery-05", "hizone-gallery-06"],
    hotspots: [],
    heroVariant: "platform",
    sourceUrls: ["https://www.shitianuav.com/product/749.html"],
    ctaContext: "咨询 HIZONE 数字化方案",
    ctaContextEn: "Inquire about HIZONE digital operations",
    priority: "P0"
  }
];
