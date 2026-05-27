import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const mediaRow = await p.singleton.findUnique({ where: { key: "media" } });
const media = JSON.parse(mediaRow?.data ?? "[]");
const images = media.filter((m) => m.kind === "image");
console.log(`Total media: ${media.length}, images: ${images.length}`);
console.log("Sample images:");
for (const m of images.slice(0, 8)) console.log(" ", m.id, "->", m.src);
const home = JSON.parse(
  (await p.singleton.findUnique({ where: { key: "home" } }))?.data ?? "{}"
);
console.log(
  "Current hero.backgroundMediaId:",
  home.hero?.backgroundMediaId ?? "(unset → falls back to /media/old-site/images/63580a43d1b3.jpg)"
);
await p.$disconnect();
