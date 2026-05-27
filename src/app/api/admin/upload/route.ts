import { NextResponse } from "next/server";
import path from "node:path";
import fs from "node:fs/promises";

import { prisma } from "@/lib/db";
import type { MediaAsset } from "@/types/content";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// File-size ceiling — kept conservative so a stray HD clip doesn't fill the
// public/uploads folder. Frontend should warn before sending oversize files.
const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

// Allowed file extensions. SVG is excluded on purpose — it can carry inline
// <script> and triggers XSS when served from the same origin. PDF / docs
// are off the menu because /uploads is presumed to be image-like media.
const ALLOWED_IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);
const ALLOWED_VIDEO_EXT = new Set([".mp4", ".webm", ".mov", ".m4v"]);

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 40) || "upload"
  );
}

function detectKind(mime: string): "image" | "video" | null {
  if (mime.startsWith("image/svg")) return null; // explicit reject — XSS vector
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  return null;
}

/**
 * Read-modify-write the media singleton inside a transaction so concurrent
 * uploads can't clobber one another.
 */
async function appendMedia(asset: MediaAsset): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const row = await tx.singleton.findUnique({ where: { key: "media" } });
    const list: MediaAsset[] = row ? (JSON.parse(row.data) as MediaAsset[]) : [];
    list.push(asset);
    await tx.singleton.upsert({
      where: { key: "media" },
      create: { key: "media", data: JSON.stringify(list) },
      update: { data: JSON.stringify(list) }
    });
  });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  const altInput = form.get("alt");

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "未提供文件" }, { status: 400 });
  }
  const kind = detectKind(file.type);
  if (!kind) {
    return NextResponse.json(
      { error: "仅支持 jpg/png/webp/gif/avif 图片与 mp4/webm/mov 视频(不接受 SVG)" },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: `文件超过 ${Math.round(MAX_BYTES / 1024 / 1024)} MB 上限` },
      { status: 400 }
    );
  }

  const rawExt = path.extname(file.name).toLowerCase();
  const allowed = kind === "image" ? ALLOWED_IMAGE_EXT : ALLOWED_VIDEO_EXT;
  const defaultExt = kind === "video" ? ".mp4" : ".jpg";
  const ext = allowed.has(rawExt) ? rawExt : defaultExt;

  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const safeBase = slugify(path.basename(file.name, path.extname(file.name)));
  const id = `upload-${Date.now()}-${safeBase}`;
  const filename = `${id}${ext}`;
  const filepath = path.join(UPLOAD_DIR, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filepath, buffer);

  const asset: MediaAsset = {
    id,
    kind,
    src: `/uploads/${filename}`,
    alt: (typeof altInput === "string" ? altInput.trim() : "") || file.name,
    status: "local"
  };

  await appendMedia(asset);

  return NextResponse.json({ ok: true, asset });
}

/**
 * Detach a media asset from the registry and remove the file from disk.
 *
 *   DELETE /api/admin/upload?id=<mediaId>
 *
 * Records that still reference the id (product.media, case.media, etc.)
 * will simply not resolve any cover after this — same fallback as missing
 * media in the legacy seed data — so this is safe to run even when the
 * asset is wired up somewhere. Operators can re-pick a replacement on the
 * referencing record.
 */
export async function DELETE(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "缺少 id 参数" }, { status: 400 });
  }

  let removedSrc: string | null = null;
  await prisma.$transaction(async (tx) => {
    const row = await tx.singleton.findUnique({ where: { key: "media" } });
    if (!row) return;
    const list: MediaAsset[] = JSON.parse(row.data);
    const next: MediaAsset[] = [];
    for (const asset of list) {
      if (asset.id === id) {
        removedSrc = asset.src;
        continue;
      }
      next.push(asset);
    }
    await tx.singleton.update({
      where: { key: "media" },
      data: { data: JSON.stringify(next) }
    });
  });

  // Only delete files we own under /uploads — never anything bundled with
  // the app (e.g. /media/products/*).
  if (removedSrc && (removedSrc as string).startsWith("/uploads/")) {
    const filename = path.basename(removedSrc as string);
    const filepath = path.join(UPLOAD_DIR, filename);
    try {
      await fs.unlink(filepath);
    } catch {
      // File may already be gone; ignore.
    }
  }

  return NextResponse.json({ ok: true, removed: Boolean(removedSrc) });
}
