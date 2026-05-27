import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import type { ContactInfo, HomeContent, HomeHeroContent } from "@/types/content";
import type { SiteProfile } from "@/lib/cms";

type Payload = {
  site?: Partial<SiteProfile>;
  contact?: Partial<ContactInfo>;
  home?: Partial<HomeHeroContent>;
};

async function patchSingleton<T>(key: string, patch: Partial<T>) {
  const row = await prisma.singleton.findUnique({ where: { key } });
  const current = row ? (JSON.parse(row.data) as T) : ({} as T);
  const next = { ...current, ...patch };
  await prisma.singleton.upsert({
    where: { key },
    create: { key, data: JSON.stringify(next) },
    update: { data: JSON.stringify(next) }
  });
}

async function patchHomeHero(patch: Partial<HomeHeroContent>) {
  const row = await prisma.singleton.findUnique({ where: { key: "home" } });
  const current = row ? (JSON.parse(row.data) as HomeContent | HomeHeroContent) : undefined;
  const next = current && "hero" in current
    ? { ...current, hero: { ...current.hero, ...patch } }
    : { ...(current ?? {}), ...patch };

  await prisma.singleton.upsert({
    where: { key: "home" },
    create: { key: "home", data: JSON.stringify(next) },
    update: { data: JSON.stringify(next) }
  });
}

export async function PUT(request: Request) {
  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "请求格式有误" }, { status: 400 });
  }

  if (body.site) await patchSingleton<SiteProfile>("site", body.site);
  if (body.contact) await patchSingleton<ContactInfo>("contact", body.contact);
  if (body.home) await patchHomeHero(body.home);

  // Settings affect the whole site (header, footer, home hero, contact).
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
