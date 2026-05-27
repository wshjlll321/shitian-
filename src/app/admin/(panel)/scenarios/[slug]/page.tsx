import { notFound } from "next/navigation";

import { RecordForm } from "@/components/admin/RecordForm.client";
import { scenarioFields } from "@/lib/admin-fields";
import { getRelationOptions } from "@/lib/admin-options";
import { getMediaIndex } from "@/lib/cms";
import { prisma } from "@/lib/db";
import type { Scenario } from "@/types/content";

type PageProps = { params: Promise<{ slug: string }> };

export default async function AdminScenarioEditPage({ params }: PageProps) {
  const { slug } = await params;
  const [row, mediaIndex, relationOptions] = await Promise.all([
    prisma.contentRecord.findUnique({ where: { type_slug: { type: "scenario", slug } } }),
    getMediaIndex(),
    getRelationOptions()
  ]);
  if (!row) notFound();

  const record = JSON.parse(row.data) as Scenario;

  return (
    <RecordForm
      apiType="scenario"
      slug={slug}
      heading={`编辑场景 · ${record.name}`}
      backHref="/admin/scenarios"
      viewHref={`/scenarios/${slug}`}
      record={record as unknown as Record<string, unknown>}
      status={row.status}
      fields={scenarioFields}
      mediaIndex={mediaIndex}
      relationOptions={relationOptions}
    />
  );
}
