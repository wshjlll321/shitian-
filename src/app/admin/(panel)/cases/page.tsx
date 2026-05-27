import { AdminList } from "@/components/admin/AdminList";
import { prisma } from "@/lib/db";
import { computeProgress, I18N_FIELDS } from "@/lib/i18n-progress";
import type { CaseStudy } from "@/types/content";

export const metadata = { title: "案例管理 · 世天航空后台" };

export default async function AdminCasesPage() {
  const rows = await prisma.contentRecord.findMany({
    where: { type: "case" },
    orderBy: { sortOrder: "asc" }
  });
  const items = rows
    .map((row) => {
      const data = JSON.parse(row.data) as CaseStudy;
      return {
        slug: row.slug,
        status: row.status,
        primary: data.title,
        secondary: `${data.location} · ${data.time}`,
        pinned: data.showOnHomepage === true,
        i18n: computeProgress(
          data as unknown as Record<string, unknown>,
          [...I18N_FIELDS.case]
        )
      };
    })
    // Surface pinned-to-homepage cases at the top so the operator instantly
    // sees what's currently public on `/`.
    .sort((a, b) => Number(b.pinned ?? false) - Number(a.pinned ?? false));

  const pinnedCount = items.filter((i) => i.pinned).length;

  return (
    <AdminList
      kicker="Cases · 案例管理"
      title={`案例 · ${items.length} 项`}
      note={`点击任意案例进入编辑。当前 ${pinnedCount} 条已勾选「在主页展示」,会自动出现在前台主页「案例实证」节。`}
      items={items}
      editBase="/admin/cases"
    />
  );
}
