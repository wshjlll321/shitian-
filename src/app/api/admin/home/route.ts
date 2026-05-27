import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import type { HomeContent } from "@/types/content";

type Payload = { home?: HomeContent };

/**
 * Saves the full HomeContent singleton in one go. The home editor sends the
 * entire payload (hero + 5 section blocks) because the sections share a row
 * in the database; partial PATCH semantics would require merging nested
 * structures that the front-end doesn't track separately.
 */
export async function PUT(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "请求格式有误" }, { status: 400 });
  }
  if (!body.home) {
    return NextResponse.json({ error: "缺少 home 字段" }, { status: 400 });
  }
  await prisma.singleton.upsert({
    where: { key: "home" },
    create: { key: "home", data: JSON.stringify(body.home) },
    update: { data: JSON.stringify(body.home) }
  });
  // Home page caches per layout; revalidate both locales.
  revalidatePath("/", "layout");
  revalidatePath("/en", "layout");
  return NextResponse.json({ ok: true });
}
