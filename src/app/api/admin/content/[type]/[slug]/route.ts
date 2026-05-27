import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";

// Which public paths to refresh after each content type is saved. Each
// list also includes the English mirror so /en/* routes stay in sync.
const REVALIDATE: Record<string, (slug: string) => string[]> = {
  product: (slug) => [
    "/",
    "/products",
    `/products/${slug}`,
    "/en",
    "/en/products",
    `/en/products/${slug}`
  ],
  case: (slug) => [
    "/",
    "/cases",
    `/cases/${slug}`,
    "/en",
    "/en/cases",
    `/en/cases/${slug}`
  ],
  news: (slug) => ["/news", `/news/${slug}`, "/en/news", `/en/news/${slug}`],
  scenario: (slug) => [
    "/",
    "/scenarios",
    `/scenarios/${slug}`,
    "/en",
    "/en/scenarios",
    `/en/scenarios/${slug}`
  ],
  technology: () => ["/technology", "/en/technology", "/", "/en"]
};

type RouteContext = {
  params: Promise<{ type: string; slug: string }>;
};

export async function PUT(request: Request, { params }: RouteContext) {
  const { type, slug } = await params;

  const revalidate = REVALIDATE[type];
  if (!revalidate) {
    return NextResponse.json({ error: "不支持的内容类型" }, { status: 400 });
  }

  let body: { record?: Record<string, unknown>; status?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式有误" }, { status: 400 });
  }

  const record = body.record;
  if (!record || typeof record !== "object") {
    return NextResponse.json({ error: "缺少内容数据" }, { status: 400 });
  }

  const existing = await prisma.contentRecord.findUnique({
    where: { type_slug: { type, slug } }
  });
  if (!existing) {
    return NextResponse.json({ error: "内容不存在" }, { status: 404 });
  }

  const status = body.status === "draft" ? "draft" : "published";
  const priority = typeof record.priority === "string" ? record.priority : existing.priority;

  await prisma.contentRecord.update({
    where: { type_slug: { type, slug } },
    data: {
      data: JSON.stringify({ ...record, slug }),
      status,
      priority
    }
  });

  for (const path of revalidate(slug)) {
    revalidatePath(path);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const { type, slug } = await params;

  const revalidate = REVALIDATE[type];
  if (!revalidate) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
  }

  const existing = await prisma.contentRecord.findUnique({
    where: { type_slug: { type, slug } }
  });
  if (!existing) {
    return NextResponse.json({ error: "Content not found" }, { status: 404 });
  }

  await prisma.contentRecord.delete({
    where: { type_slug: { type, slug } }
  });

  for (const path of revalidate(slug)) {
    revalidatePath(path);
  }

  return NextResponse.json({ ok: true });
}
