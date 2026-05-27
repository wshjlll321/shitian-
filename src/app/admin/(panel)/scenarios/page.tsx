import { AdminList } from "@/components/admin/AdminList";
import { prisma } from "@/lib/db";
import { computeProgress, I18N_FIELDS } from "@/lib/i18n-progress";
import type { Scenario } from "@/types/content";

export const metadata = { title: "场景管理 · 世天航空后台" };

export default async function AdminScenariosPage() {
  const rows = await prisma.contentRecord.findMany({
    where: { type: "scenario" },
    orderBy: { sortOrder: "asc" }
  });
  const items = rows.map((row) => {
    const data = JSON.parse(row.data) as Scenario;
    return {
      slug: row.slug,
      status: row.status,
      primary: data.name,
      secondary: data.headline,
      i18n: computeProgress(
        data as unknown as Record<string, unknown>,
        [...I18N_FIELDS.scenario]
      )
    };
  });

  return (
    <AdminList
      kicker="Scenarios · 场景管理"
      title={`应用场景 · ${items.length} 项`}
      note="点击任意场景进入编辑，保存后前台场景页会自动更新。"
      items={items}
      editBase="/admin/scenarios"
    />
  );
}
