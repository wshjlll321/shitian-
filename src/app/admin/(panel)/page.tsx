import Link from "next/link";

import { prisma } from "@/lib/db";

export const metadata = { title: "仪表盘 · 世天航空后台" };

async function countOf(type: string) {
  return prisma.contentRecord.count({ where: { type } });
}

export default async function AdminDashboardPage() {
  const [products, cases, news, scenarios] = await Promise.all([
    countOf("product"),
    countOf("case"),
    countOf("news"),
    countOf("scenario")
  ]);

  const cards = [
    { label: "产品", en: "Products", count: products, href: "/admin/products", ready: true },
    { label: "案例", en: "Cases", count: cases, href: "/admin/cases", ready: true },
    { label: "新闻动态", en: "News", count: news, href: "/admin/news", ready: true },
    { label: "应用场景", en: "Scenarios", count: scenarios, href: "/admin/scenarios", ready: true }
  ];

  return (
    <div className="px-10 py-10">
      <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
        Dashboard · 仪表盘
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em]">
        内容概览
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-carbon-black/60">
        这里管理网站上展示的全部内容。在下方进入对应模块进行编辑，保存后前台会自动更新。
      </p>

      <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const inner = (
            <>
              <div className="flex items-baseline justify-between">
                <span className="font-numeric text-[10px] uppercase tracking-[0.22em] text-metal-gray">
                  {card.en}
                </span>
                {card.ready ? (
                  <span className="font-numeric text-[10px] text-aviation-orange">→</span>
                ) : (
                  <span className="text-[9px] uppercase tracking-[0.16em] text-metal-gray">
                    即将上线
                  </span>
                )}
              </div>
              <p className="mt-6 font-numeric text-4xl font-semibold tracking-[-0.02em]">
                {card.count}
              </p>
              <p className="mt-1 text-sm text-carbon-black/60">{card.label}</p>
            </>
          );

          return card.ready ? (
            <Link
              key={card.en}
              href={card.href}
              className="group border border-carbon-black/12 bg-surface-warm p-6 transition hover:border-aviation-orange"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={card.en}
              className="border border-carbon-black/12 bg-surface-warm/60 p-6"
            >
              {inner}
            </div>
          );
        })}
      </div>

      <div className="mt-10 border-t border-carbon-black/12 pt-7">
        <p className="text-[11px] uppercase tracking-[0.2em] text-metal-gray">提示</p>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-carbon-black/60">
          产品、案例、新闻、应用场景、公司信息均可在后台维护，图片可直接上传。
        </p>
      </div>
    </div>
  );
}
