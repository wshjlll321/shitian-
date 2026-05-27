import { notFound } from "next/navigation";

import { RecordForm } from "@/components/admin/RecordForm.client";
import { technologyFields } from "@/lib/admin-fields";
import { prisma } from "@/lib/db";
import type { TechPillar } from "@/content/technology";

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdminTechnologyEditPage({ params }: PageProps) {
  const { slug } = await params;
  const row = await prisma.contentRecord.findUnique({
    where: { type_slug: { type: "technology", slug } }
  });
  if (!row) notFound();

  const record = JSON.parse(row.data) as TechPillar;

  return (
    <RecordForm
      apiType="technology"
      slug={slug}
      heading={`编辑技术支柱 · ${record.title}`}
      backHref="/admin/technology"
      viewHref="/technology"
      record={record as unknown as Record<string, unknown>}
      status={row.status}
      fields={technologyFields}
    />
  );
}
