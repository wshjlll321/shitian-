import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

const TYPE_CONFIG: Record<string, { editBase: string; label: string }> = {
  product: { editBase: "/admin/products", label: "产品" },
  case: { editBase: "/admin/cases", label: "案例" },
  news: { editBase: "/admin/news", label: "文章" },
  scenario: { editBase: "/admin/scenarios", label: "场景" },
  technology: { editBase: "/admin/technology", label: "技术模块" }
};

type RouteContext = {
  params: Promise<{ type: string }>;
};

function cleanSlug(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function autoSlug(type: string): string {
  return `draft-${type}-${Date.now().toString(36)}`;
}

function isValidSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function draftFromTemplate(type: string, template: Record<string, unknown>, slug: string) {
  const draft: Record<string, unknown> = {
    ...template,
    slug,
    status: "draft",
    priority: "P3"
  };

  for (const key of Object.keys(draft)) {
    if (key.endsWith("En")) delete draft[key];
  }

  if (type === "product") {
    return {
      ...draft,
      model: slug.toUpperCase().slice(0, 12),
      displayName: "新产品草稿",
      category: "",
      strategicRole: "",
      summary: "",
      positioning: "",
      narrative: "",
      keyCapabilities: [],
      keyMetrics: [],
      specifications: [],
      scenarios: [],
      relatedCases: [],
      media: [],
      gallery: [],
      hotspots: [],
      sourceUrls: [],
      ctaContext: ""
    };
  }

  if (type === "case") {
    return {
      ...draft,
      title: "新案例草稿",
      summary: "",
      productModels: [],
      scenario: "",
      location: "",
      time: "",
      task: "",
      result: "",
      keyData: [],
      media: [],
      gallery: [],
      sourceUrl: "",
      showOnHomepage: false
    };
  }

  if (type === "news") {
    return {
      ...draft,
      title: "新文章草稿",
      publishedAt: today(),
      summary: "",
      tags: [],
      body: [],
      cover: "",
      gallery: [],
      images: [],
      videos: [],
      sourceUrl: "",
      sourceRawFile: ""
    };
  }

  if (type === "scenario") {
    return {
      ...draft,
      name: "新场景草稿",
      headline: "",
      painPoint: "",
      recommendedProducts: [],
      taskFlow: [],
      proofCases: [],
      valueMetrics: [],
      media: [],
      cta: ""
    };
  }

  return {
    ...draft,
    id: slug,
    index: "NEW",
    title: "新技术模块草稿",
    abstract: "",
    highlights: [],
    detail: []
  };
}

export async function POST(request: Request, { params }: RouteContext) {
  const { type } = await params;
  const config = TYPE_CONFIG[type];
  if (!config) {
    return NextResponse.json({ error: "Unsupported content type" }, { status: 400 });
  }

  let body: { slug?: string } = {};
  try {
    body = (await request.json()) as { slug?: string };
  } catch {
    body = {};
  }

  const requestedSlug = cleanSlug(body.slug);
  const slug = requestedSlug || autoSlug(type);
  if (!isValidSlug(slug)) {
    return NextResponse.json(
      { error: "Slug can only use lowercase letters, numbers, and hyphens" },
      { status: 400 }
    );
  }

  const [existing, template, maxSort] = await Promise.all([
    prisma.contentRecord.findUnique({ where: { type_slug: { type, slug } } }),
    prisma.contentRecord.findFirst({ where: { type }, orderBy: { sortOrder: "asc" } }),
    prisma.contentRecord.findFirst({ where: { type }, orderBy: { sortOrder: "desc" } })
  ]);

  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }
  if (!template) {
    return NextResponse.json({ error: `No ${config.label} template exists` }, { status: 400 });
  }

  const record = draftFromTemplate(type, JSON.parse(template.data), slug);
  await prisma.contentRecord.create({
    data: {
      type,
      slug,
      status: "draft",
      priority: "P3",
      sortOrder: (maxSort?.sortOrder ?? 0) + 10,
      data: JSON.stringify(record)
    }
  });

  revalidatePath(config.editBase);

  return NextResponse.json({
    ok: true,
    slug,
    editHref: `${config.editBase}/${slug}`
  });
}
