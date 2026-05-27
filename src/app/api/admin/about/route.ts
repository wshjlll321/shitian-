import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import type { CompanyProfile } from "@/types/content";

type Payload = {
  company?: Partial<CompanyProfile>;
};

/**
 * PUT /api/admin/about
 *
 * Saves the `company` singleton — the one record that drives every
 * section of the public /about page. We accept a partial patch so the
 * client form can ship only the dirty subtree if it ever needs to.
 */
export async function PUT(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "请求格式有误" }, { status: 400 });
  }

  if (!body.company) {
    return NextResponse.json({ error: "缺少 company 字段" }, { status: 400 });
  }

  const row = await prisma.singleton.findUnique({ where: { key: "company" } });
  const current = row
    ? (JSON.parse(row.data) as CompanyProfile)
    : ({} as CompanyProfile);
  const next = { ...current, ...body.company };

  await prisma.singleton.upsert({
    where: { key: "company" },
    create: { key: "company", data: JSON.stringify(next) },
    update: { data: JSON.stringify(next) }
  });

  // About is the only consumer today, but several other pages reference
  // companyProfile.milestones (e.g. home §7), so revalidate the layout.
  revalidatePath("/", "layout");
  revalidatePath("/about");
  revalidatePath("/en/about");

  return NextResponse.json({ ok: true });
}
