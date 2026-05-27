import { AdminList } from "@/components/admin/AdminList";
import { prisma } from "@/lib/db";
import { computeProgress, I18N_FIELDS } from "@/lib/i18n-progress";
import type { NewsArticle } from "@/types/content";

export const metadata = { title: "新闻管理 · 世天航空后台" };

export default async function AdminNewsPage() {
  const rows = await prisma.contentRecord.findMany({
    where: { type: "news" },
    orderBy: { sortOrder: "asc" }
  });
  const items = rows.map((row) => {
    const data = JSON.parse(row.data) as NewsArticle;
    return {
      slug: row.slug,
      status: row.status,
      primary: data.title,
      secondary: `${data.category} · ${(data.publishedAt || "").slice(0, 10)}`,
      i18n: computeProgress(
        data as unknown as Record<string, unknown>,
        [...I18N_FIELDS.news]
      )
    };
  });

  return (
    <AdminList
      kicker="News · 新闻管理"
      title={`新闻动态 · ${items.length} 篇`}
      note="点击任意文章进入编辑。正文每行一个段落。"
      items={items}
      editBase="/admin/news"
    />
  );
}
