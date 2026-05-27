import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import type { Product } from "@/types/content";

type RouteContext = {
  params: Promise<{ slug: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  const { slug } = await params;

  let body: { product?: Product; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式有误" }, { status: 400 });
  }

  const product = body.product;
  if (!product || typeof product !== "object") {
    return NextResponse.json({ error: "缺少产品数据" }, { status: 400 });
  }

  const existing = await prisma.contentRecord.findUnique({
    where: { type_slug: { type: "product", slug } }
  });
  if (!existing) {
    return NextResponse.json({ error: "产品不存在" }, { status: 404 });
  }

  const status = body.status === "draft" ? "draft" : "published";

  await prisma.contentRecord.update({
    where: { type_slug: { type: "product", slug } },
    data: {
      data: JSON.stringify({ ...product, slug }),
      status,
      priority: typeof product.priority === "string" ? product.priority : existing.priority
    }
  });

  // Refresh every public surface that renders product data.
  revalidatePath("/");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);

  return NextResponse.json({ ok: true });
}
