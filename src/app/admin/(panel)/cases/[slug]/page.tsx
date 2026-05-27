import { notFound } from "next/navigation";

import { RecordForm } from "@/components/admin/RecordForm.client";
import { caseFields } from "@/lib/admin-fields";
import { getRelationOptions } from "@/lib/admin-options";
import { getMediaIndex } from "@/lib/cms";
import { prisma } from "@/lib/db";
import type { CaseStudy } from "@/types/content";

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdminCaseEditPage({ params }: PageProps) {
  const { slug } = await params;
  const [row, mediaIndex, relationOptions] = await Promise.all([
    prisma.contentRecord.findUnique({ where: { type_slug: { type: "case", slug } } }),
    getMediaIndex(),
    getRelationOptions()
  ]);
  if (!row) notFound();

  const record = JSON.parse(row.data) as CaseStudy;

  return (
    <RecordForm
      apiType="case"
      slug={slug}
      heading={`编辑案例 · ${record.title}`}
      backHref="/admin/cases"
      viewHref={`/cases/${slug}`}
      record={record as unknown as Record<string, unknown>}
      status={row.status}
      fields={caseFields}
      mediaIndex={mediaIndex}
      relationOptions={relationOptions}
    />
  );
}
