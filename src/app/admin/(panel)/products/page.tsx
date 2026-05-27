import Link from "next/link";

import { ContentCreateButton } from "@/components/admin/ContentCreateButton.client";
import { I18nStatusDot } from "@/components/admin/I18nProgressBar";
import { prisma } from "@/lib/db";
import { computeProgress, I18N_FIELDS } from "@/lib/i18n-progress";
import type { Product } from "@/types/content";

export const metadata = { title: "产品管理 · 世天航空后台" };

export default async function AdminProductsPage() {
  const rows = await prisma.contentRecord.findMany({
    where: { type: "product" },
    orderBy: { sortOrder: "asc" }
  });

  const items = rows.map((row) => ({
    slug: row.slug,
    status: row.status,
    data: JSON.parse(row.data) as Product
  }));

  return (
    <div className="px-10 py-10">
      <p className="font-numeric text-[11px] uppercase tracking-[0.28em] text-aviation-orange">
        Products · 产品管理
      </p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-[-0.01em]">
            产品 · {items.length} 项
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-carbon-black/60">
            点击任意产品进入编辑。保存后，前台产品页会自动更新。
          </p>
        </div>
        <ContentCreateButton type="product" label="新建产品" />
      </div>

      <ul className="mt-8 divide-y divide-carbon-black/10 border-y border-carbon-black/12">
        {items.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/admin/products/${item.slug}`}
              className="group flex items-center gap-6 py-5 transition hover:bg-surface-warm"
            >
              <span className="font-numeric text-lg font-semibold tracking-[-0.01em] w-24">
                {item.data.model}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-carbon-black">
                  {item.data.displayName}
                </span>
                <span className="mt-0.5 block truncate text-[13px] text-carbon-black/55">
                  {item.data.category} · {item.data.summary}
                </span>
              </span>
              <I18nStatusDot
                progress={computeProgress(
                  item.data as unknown as Record<string, unknown>,
                  [...I18N_FIELDS.product]
                )}
              />
              <span
                className={`shrink-0 border px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ${
                  item.status === "draft"
                    ? "border-metal-gray/40 text-metal-gray"
                    : "border-aviation-orange/50 text-aviation-orange"
                }`}
              >
                {item.status === "draft" ? "草稿" : "已发布"}
              </span>
              <span
                aria-hidden
                className="shrink-0 font-numeric text-sm text-carbon-black/30 transition group-hover:translate-x-1 group-hover:text-aviation-orange"
              >
                编辑 →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
