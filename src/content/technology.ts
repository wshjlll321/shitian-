export type TechPillarBlock = {
  heading: string;
  body: string;
  headingEn?: string;
  bodyEn?: string;
};

export type TechPillar = {
  id: string;
  index: string;
  title: string;
  abstract: string;
  highlights: string[];
  detail: TechPillarBlock[];
  /* Optional English overlays — `pick()` falls back to Chinese when absent. */
  titleEn?: string;
  abstractEn?: string;
  highlightsEn?: string[];
};

export const technologyPillars: TechPillar[] = [
  {
    id: "flight-control",
    index: "FC-01",
    title: "飞行控制",
    titleEn: "Flight control",
    abstract: "把姿态控制与航线执行，做成重载、远距与复杂地形任务的工程底座。",
    abstractEn:
      "Attitude control and route execution engineered as the foundation for heavy-payload, long-range, and complex-terrain missions.",
    highlights: [
      "高度集成农业智能飞控",
      "地形追踪精度 ≤ 0.5m",
      "支持视距外百公里级控制半径",
      "断链续航与航线复执"
    ],
    highlightsEn: [
      "Highly integrated agricultural smart autopilot",
      "Terrain-following accuracy ≤ 0.5 m",
      "Beyond-visual-range control radius of 100 km",
      "Link-loss continuation and route re-execution"
    ],
    detail: [
      {
        heading: "重载下的稳定姿态",
        headingEn: "Stable attitude under heavy payload",
        body:
          "T280 / S270 平台在 80–120kg 载荷下的姿态控制以航空工程方法标定，避免高载工况下出现失速或姿态漂移。",
        bodyEn:
          "T280 / S270 attitude control is calibrated with aviation-engineering rigour at 80–120 kg payload — no stall or drift in the heavy-load envelope."
      },
      {
        heading: "复杂地形跟随",
        headingEn: "Complex terrain following",
        body:
          "地形追踪精度 ≤ 0.5m，覆盖梯田、山地、海面与果园冠层等真实工况，让喷洒、巡查或吊运保持稳定离地高度。",
        bodyEn:
          "Sub-0.5 m terrain-following across terraces, mountain slopes, sea surfaces, and orchard canopies — keeping spray, patrol, or sling-lift at a stable AGL."
      },
      {
        heading: "百公里级控制半径",
        headingEn: "Hundred-km control radius",
        body:
          "数链与遥测协同优化，T280 / S270 可在 100km 控制半径内完成视距外任务，并具备断链后自主回航与航线复执能力。",
        bodyEn:
          "Data-link and telemetry co-tuned: T280 / S270 fly BVR missions out to 100 km, with autonomous return-to-home and route re-execution after link loss."
      }
    ]
  },
  {
    id: "powertrain",
    index: "PW-02",
    title: "动力系统",
    titleEn: "Powertrain",
    abstract: "燃油动力承接长航时与重载，电动单元承接高频、低温与复杂环境任务，机型与动力分层。",
    abstractEn:
      "Heavy-fuel power for long endurance and heavy lift; electric units for high-frequency, cold-weather, and complex-environment missions — tiered by platform.",
    highlights: [
      "95# 汽油驱动 · 24L / 50L 油箱",
      "S270 平台 46kW 连续输出",
      "H15 工作温度 -40℃ 至 +60℃",
      "水冷与自然冷却双方案"
    ],
    highlightsEn: [
      "95-octane petrol · 24 L / 50 L tank options",
      "S270 platform · 46 kW sustained output",
      "H15 operating range -40 °C to +60 °C",
      "Liquid and passive air cooling options"
    ],
    detail: [
      {
        heading: "燃油重载平台",
        headingEn: "Heavy-fuel platforms",
        body:
          "T280 / S270 以 95# 汽油为动力源，匹配 24L 与 50L 油箱设计，在 80kg 载荷下可形成 3–4h 单架次航时。",
        bodyEn:
          "T280 / S270 run on 95-octane petrol with 24 L and 50 L tank designs, sustaining 3–4 h per sortie at 80 kg payload."
      },
      {
        heading: "电动轻型平台",
        headingEn: "Light electric platforms",
        body:
          "H15 单旋翼电动直升机配备 12S 33Ah 锂电池，3kg 载荷下航时 40 分钟，工作温度覆盖 -40℃ 至 +60℃。",
        bodyEn:
          "The H15 single-rotor electric helicopter carries a 12S 33 Ah Li battery — 40 min endurance at 3 kg payload across -40 °C to +60 °C."
      },
      {
        heading: "高效率电动植保",
        headingEn: "High-efficiency electric protection",
        body:
          "H60 采用 18S 30000mAh 电池组与三相交流快充，单次充电 10 分钟，支持每小时 20 公顷量级的连续作业。",
        bodyEn:
          "H60 pairs an 18S 30000 mAh pack with three-phase AC fast charging — 10 min top-up, supporting continuous 20 ha/hour operations."
      }
    ]
  },
  {
    id: "payload",
    index: "PL-03",
    title: "任务载荷",
    titleEn: "Payload",
    abstract: "从喷洒、播撒到吊运、投送，模块化任务舱让一台机型可以承担多种现场任务。",
    abstractEn:
      "From spraying and spreading to sling-lifting and air-drop — a modular mission bay lets one airframe carry many on-site jobs.",
    highlights: [
      "80–120kg 任务载荷",
      "侧面挂载 + 吊挂双模式",
      "55L 喷洒 / 80L 播撒任务舱",
      "离心式喷嘴，雾滴 50–500μm"
    ],
    highlightsEn: [
      "80–120 kg mission payload",
      "Side mount and sling-lift dual mode",
      "55 L spray / 80 L spread mission bay",
      "Centrifugal nozzle, droplet 50–500 μm"
    ],
    detail: [
      {
        heading: "重载与吊运",
        headingEn: "Heavy lift and sling delivery",
        body:
          "T280 支持 80–120kg 任务载荷，侧面挂载空间长 1500mm，宽 1000mm，可挂喷洒系统、应急水泵、医疗物资或船用补给。",
        bodyEn:
          "T280 carries 80–120 kg with a 1500 × 1000 mm side mount that fits spray rigs, emergency pumps, medical supplies, or marine resupply pallets."
      },
      {
        heading: "植保任务舱",
        headingEn: "Crop-protection bay",
        body:
          "H60 配备 55L 喷洒箱与 80L 播撒箱，离心式喷嘴雾滴尺寸覆盖 50–500μm，单架次作业 3.3 公顷，适配多种农作物。",
        bodyEn:
          "H60 ships with a 55 L spray tank, 80 L spread hopper, centrifugal nozzles covering 50–500 μm droplets — 3.3 ha per sortie across many crops."
      },
      {
        heading: "复杂环境投送",
        headingEn: "Delivery into complex environments",
        body:
          "海上、山地、应急场景使用吊挂模式，T280 已在黄岛海上点对点吊运（15km）与青岛红十字山地吊运中验证。",
        bodyEn:
          "Sling lifts for maritime, mountain, and emergency scenarios — T280 has logged a 15 km Huangdao ship-to-shore lift and a Qingdao Red Cross mountain exercise."
      }
    ]
  },
  {
    id: "ai",
    index: "AI-04",
    title: "智能闭环",
    titleEn: "HIZONE intelligence loop",
    abstract: "HIZONE 连接感知、分析、决策、执行、反馈，让单次飞行升级为可被组织、可被复算的作业系统。",
    abstractEn:
      "HIZONE wires sense, analyse, decide, execute, and feedback — turning a single sortie into an organised, repeatable operating system.",
    highlights: [
      "多源数据采集与影像分析",
      "AI 处方图生成与航线下发",
      "无人机任务执行与状态回传",
      "作业效果评估与下一周期闭环"
    ],
    highlightsEn: [
      "Multi-source data capture and image analysis",
      "AI prescription maps and route dispatch",
      "UAV mission execution with telemetry feedback",
      "Result evaluation closing into the next cycle"
    ],
    detail: [
      {
        heading: "感知层",
        headingEn: "Sensing layer",
        body:
          "多源数据采集覆盖卫星遥感、无人机巡查影像与地面传感，形成场地、农情或植被状态的统一数据底座。",
        bodyEn:
          "Multi-source capture spans satellite remote sensing, UAV inspection imagery, and ground sensors — a unified data foundation for fields, crops, and vegetation."
      },
      {
        heading: "决策与执行",
        headingEn: "Decide and execute",
        body:
          "AI 模型在感知数据上生成处方图与作业方案，自动转化为航线下发到无人直升机或植保机，闭合任务指令链。",
        bodyEn:
          "AI models turn sensing data into prescription maps and operating plans, then dispatch flight routes to UAVs or protection drones — closing the command chain."
      },
      {
        heading: "评估与下一周期",
        headingEn: "Evaluate and feed the next cycle",
        body:
          "执行结果实时回传 HIZONE，与上一周期数据对照，生成下一作业周期的方案建议，实现真正的作业闭环。",
        bodyEn:
          "Execution results stream back to HIZONE in real time, are benchmarked against the previous cycle, and produce the next operating plan — a real closed loop."
      }
    ]
  }
];
