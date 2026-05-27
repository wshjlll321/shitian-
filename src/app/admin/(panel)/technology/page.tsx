import { AdminList } from "@/components/admin/AdminList";
import { prisma } from "@/lib/db";

export const metadata = { title: "技术能力 · 世天航空后台" };

export default async function AdminTechnologyPage() {
  const rows = await prisma.contentRecord.findMany({
    where: { type: "technology" },
    orderBy: { sortOrder: "asc" }
  });
  const items = rows.map((row) => {
    const data = JSON.parse(row.data) as {
      title: string;
      index: string;
      abstract: string;
      titleEn?: string;
      abstractEn?: string;
    };
    // Light EN coverage indicator: count title/abstract overlays present.
    const filled = (data.titleEn ? 1 : 0) + (data.abstractEn ? 1 : 0);
    return {
      slug: row.slug,
      status: row.status,
      primary: `${data.index} · ${data.title}`,
      secondary: data.abstract,
      i18n: { total: 2, filled, complete: filled === 2 }
    };
  });

  return (
    <AdminList
      kicker="Technology · 技术能力"
      title={`技术支柱 · ${items.length} 项`}
      note="维护 4 个工程支柱(飞控 / 动力 / 载荷 / 智能闭环)的标题、概述、亮点、详细块。保存后前台 /technology 与 /en/technology 立即更新。"
      items={items}
      editBase="/admin/technology"
      createType="technology"
      createLabel="新建技术模块"
    />
  );
}
