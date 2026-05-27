import { AdminList } from "@/components/admin/AdminList";
import { prisma } from "@/lib/db";
import { computeProgress, I18N_FIELDS } from "@/lib/i18n-progress";
import type { Product } from "@/types/content";

export const metadata = { title: "产品管理 · 世天航空后台" };

export default async function AdminProductsPage() {
  const rows = await prisma.contentRecord.findMany({
    where: { type: "product" },
    orderBy: { sortOrder: "asc" }
  });

  const items = rows.map((row) => {
    const data = JSON.parse(row.data) as Product;
    return {
      slug: row.slug,
      status: row.status,
      primary: `${data.model} · ${data.displayName}`,
      secondary: `${data.category} · ${data.summary}`,
      i18n: computeProgress(
        data as unknown as Record<string, unknown>,
        [...I18N_FIELDS.product]
      )
    };
  });

  return (
    <AdminList
      kicker="Products · 产品管理"
      title={`产品 · ${items.length} 项`}
      note="可直接搜索、筛选显示状态，也可以在列表里设为不显示或删除。点击内容本身进入编辑详情。"
      items={items}
      editBase="/admin/products"
      contentType="product"
      createType="product"
      createLabel="新建产品"
    />
  );
}
