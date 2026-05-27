import type { NavItem } from "@/types/content";

export const primaryNavigation: NavItem[] = [
  { label: "首页", labelEn: "Home", href: "/" },
  {
    label: "产品",
    labelEn: "Fleet",
    href: "/products",
    description: "重载无人直升机与低空作业数字平台"
  },
  {
    label: "场景",
    labelEn: "Scenarios",
    href: "/scenarios",
    description: "农业、林业、应急、海上与智慧场地"
  },
  {
    label: "技术",
    labelEn: "Technology",
    href: "/technology",
    description: "飞控、动力、载荷、智能闭环"
  },
  {
    label: "案例",
    labelEn: "Cases",
    href: "/cases",
    description: "真实作业案例与任务证据"
  },
  {
    label: "动态",
    labelEn: "News",
    href: "/news",
    description: "作业动态与政策观察"
  },
  {
    label: "关于",
    labelEn: "About",
    href: "/about",
    description: "航空工程能力与企业资质"
  },
  {
    label: "联系",
    labelEn: "Contact",
    href: "/contact",
    description: "获取方案、预约演示与海外合作"
  }
];

export const footerNavigation: NavItem[] = [
  { label: "产品", labelEn: "Fleet", href: "/products" },
  { label: "场景", labelEn: "Scenarios", href: "/scenarios" },
  { label: "技术", labelEn: "Technology", href: "/technology" },
  { label: "案例", labelEn: "Cases", href: "/cases" },
  { label: "动态", labelEn: "News", href: "/news" },
  { label: "关于", labelEn: "About", href: "/about" },
  { label: "联系", labelEn: "Contact", href: "/contact" }
];
