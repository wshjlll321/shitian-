import Link from "next/link";

import { InquiryDeleteButton } from "@/components/admin/InquiryDeleteButton.client";
import { pick } from "@/lib/i18n";
import { prisma } from "@/lib/db";
import type { Product, Scenario } from "@/types/content";

export const metadata = { title: "询盘管理 · 世天航空后台" };

const dateTimeFormat = new Intl.DateTimeFormat("zh-CN", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Shanghai"
});

function formatDate(value: Date) {
  return dateTimeFormat.format(value);
}

function compact(value: string) {
  return value.trim() || "未填写";
}

export default async function AdminInquiriesPage() {
  const [rows, total, productRows, scenarioRows] = await Promise.all([
    prisma.inquirySubmission.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    }),
    prisma.inquirySubmission.count(),
    prisma.contentRecord.findMany({
      where: { type: "product" },
      select: { slug: true, data: true }
    }),
    prisma.contentRecord.findMany({
      where: { type: "scenario" },
      select: { slug: true, data: true }
    })
  ]);

  const productLabels = new Map(
    productRows.map((row) => {
      const data = JSON.parse(row.data) as Product;
      return [row.slug, `${data.model} · ${pick(data, "displayName", "zh")}`];
    })
  );
  const scenarioLabels = new Map(
    scenarioRows.map((row) => {
      const data = JSON.parse(row.data) as Scenario;
      return [row.slug, pick(data, "name", "zh")];
    })
  );

  return (
    <div className="px-10 py-10">
      <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
        Inquiries · 询盘管理
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold tracking-[-0.01em]">
        询盘线索 · {total} 条
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-carbon-black/60">
        前台联系表单提交后会写入这里，默认展示最近 100 条，便于销售工程师按邮箱、电话和项目简述跟进。
      </p>

      {rows.length === 0 ? (
        <div className="mt-8 border-y border-carbon-black/12 py-12">
          <p className="font-display text-xl font-semibold">暂时还没有询盘。</p>
          <p className="mt-2 text-sm leading-7 text-carbon-black/60">
            可以打开前台联系页提交一次测试需求，成功后这张列表会立即出现新记录。
          </p>
          <Link
            href="/contact"
            target="_blank"
            className="mt-5 inline-flex text-sm text-aviation-orange transition hover:text-carbon-black"
          >
            打开联系页 →
          </Link>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto border-y border-carbon-black/12">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-carbon-black/10 text-[10px] uppercase tracking-[0.18em] text-metal-gray">
              <tr>
                <th className="whitespace-nowrap px-0 py-4 pr-6 font-medium">提交时间</th>
                <th className="whitespace-nowrap px-0 py-4 pr-6 font-medium">联系人</th>
                <th className="whitespace-nowrap px-0 py-4 pr-6 font-medium">联系方式</th>
                <th className="whitespace-nowrap px-0 py-4 pr-6 font-medium">项目方向</th>
                <th className="min-w-80 px-0 py-4 pr-6 font-medium">需求简述</th>
                <th className="w-20 px-0 py-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-black/10">
              {rows.map((row) => {
                const product = row.product ? productLabels.get(row.product) ?? row.product : "";
                const scenario = row.scenario
                  ? scenarioLabels.get(row.scenario) ?? row.scenario
                  : "";

                return (
                  <tr key={row.id} className="align-top">
                    <td className="whitespace-nowrap py-5 pr-6 font-numeric text-[12px] text-carbon-black/55">
                      {formatDate(row.createdAt)}
                      <span className="mt-1 block uppercase tracking-[0.14em]">
                        {row.locale === "en" ? "EN" : "ZH"} · {compact(row.region)}
                      </span>
                    </td>
                    <td className="py-5 pr-6">
                      <p className="font-medium text-carbon-black">{row.name}</p>
                      <p className="mt-1 text-[13px] text-carbon-black/55">
                        {compact(row.company)}
                      </p>
                    </td>
                    <td className="py-5 pr-6">
                      <Link
                        href={`mailto:${row.email}`}
                        className="block text-[13px] text-carbon-black transition hover:text-aviation-orange"
                      >
                        {row.email}
                      </Link>
                      <p className="mt-1 text-[13px] text-carbon-black/55">
                        {compact(row.phone)}
                      </p>
                    </td>
                    <td className="py-5 pr-6 text-[13px] leading-6 text-carbon-black/70">
                      <span className="block">{compact(product)}</span>
                      <span className="block">{compact(scenario)}</span>
                    </td>
                    <td className="py-5 pr-6 text-[13px] leading-6 text-carbon-black/70">
                      <p className="max-w-xl whitespace-pre-line">{compact(row.message)}</p>
                      <p className="mt-3 font-numeric text-[10px] uppercase tracking-[0.16em] text-carbon-black/35">
                        Source · {compact(row.source)}
                      </p>
                    </td>
                    <td className="py-5 text-right">
                      <InquiryDeleteButton id={row.id} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
