import { notFound } from "next/navigation";

import { RecordForm } from "@/components/admin/RecordForm.client";
import { newsFields } from "@/lib/admin-fields";
import { prisma } from "@/lib/db";
import type { NewsArticle } from "@/types/content";

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdminNewsEditPage({ params }: PageProps) {
  const { slug } = await params;
  const row = await prisma.contentRecord.findUnique({
    where: { type_slug: { type: "news", slug } }
  });
  if (!row) notFound();

  const record = JSON.parse(row.data) as NewsArticle;

  return (
    <RecordForm
      apiType="news"
      slug={slug}
      heading={`编辑文章 · ${record.title}`}
      backHref="/admin/news"
      viewHref={`/news/${slug}`}
      record={record as unknown as Record<string, unknown>}
      status={row.status}
      fields={newsFields}
    />
  );
}
