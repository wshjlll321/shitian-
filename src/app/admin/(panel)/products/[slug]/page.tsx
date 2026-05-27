import { notFound } from "next/navigation";

import { ProductEditForm } from "@/components/admin/ProductEditForm.client";
import { getRelationOptions } from "@/lib/admin-options";
import { getMediaIndex } from "@/lib/cms";
import { prisma } from "@/lib/db";
import type { Product } from "@/types/content";

type AdminProductEditPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function AdminProductEditPage({ params }: AdminProductEditPageProps) {
  const { slug } = await params;
  const [row, mediaIndex, relationOptions] = await Promise.all([
    prisma.contentRecord.findUnique({ where: { type_slug: { type: "product", slug } } }),
    getMediaIndex(),
    getRelationOptions()
  ]);

  if (!row) {
    notFound();
  }

  const product = JSON.parse(row.data) as Product;

  return (
    <ProductEditForm
      product={product}
      status={row.status}
      mediaIndex={mediaIndex}
      scenarioOptions={relationOptions.scenarios}
      caseOptions={relationOptions.cases}
    />
  );
}
