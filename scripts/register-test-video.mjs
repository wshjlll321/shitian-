/**
 * Demo helper — registers a "video" MediaAsset in the registry and points
 * the home hero background at it. The file itself is a 1-byte placeholder
 * so the browser only renders the <video> element, not actually plays.
 * Real testing should upload a real .mp4 via the admin Media Picker.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
await fs.mkdir(UPLOAD_DIR, { recursive: true });
const filename = "demo-hero-video.mp4";
await fs.writeFile(path.join(UPLOAD_DIR, filename), Buffer.from([0]));

const mediaRow = await p.singleton.findUnique({ where: { key: "media" } });
const media = JSON.parse(mediaRow?.data ?? "[]");
const id = "demo-hero-video";
const next = media.filter((m) => m.id !== id);
next.push({
  id,
  kind: "video",
  src: `/uploads/${filename}`,
  alt: "Demo hero loop",
  status: "local"
});
await p.singleton.upsert({
  where: { key: "media" },
  create: { key: "media", data: JSON.stringify(next) },
  update: { data: JSON.stringify(next) }
});

const homeRow = await p.singleton.findUnique({ where: { key: "home" } });
const home = JSON.parse(homeRow.data);
home.hero.backgroundMediaId = id;
await p.singleton.update({
  where: { key: "home" },
  data: { data: JSON.stringify(home) }
});

console.log(`Registered ${id}; hero.backgroundMediaId → ${id}`);
await p.$disconnect();
