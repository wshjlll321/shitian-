import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

import { prisma } from "@/lib/db";
import type { MediaAsset } from "@/types/content";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "upload"
  );
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const altInput = form.get("alt");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "未提供文件" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "只支持图片类型" }, { status: 400 });
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const ext = path.extname(file.name).toLowerCase() || ".png";
  const safeBase = slugify(path.basename(file.name, path.extname(file.name)));
  const id = `upload-${Date.now()}-${safeBase}`;
  const filename = `${id}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  const asset: MediaAsset = {
    id,
    kind: "image",
    src: `/uploads/${filename}`,
    alt: (typeof altInput === "string" ? altInput.trim() : "") || file.name,
    status: "local"
  };

  // Append to the media singleton so getMediaById() can resolve it.
  const row = await prisma.singleton.findUnique({ where: { key: "media" } });
  const list: MediaAsset[] = row ? (JSON.parse(row.data) as MediaAsset[]) : [];
  list.push(asset);
  await prisma.singleton.upsert({
    where: { key: "media" },
    create: { key: "media", data: JSON.stringify(list) },
    update: { data: JSON.stringify(list) }
  });

  return NextResponse.json({ ok: true, asset });
}
