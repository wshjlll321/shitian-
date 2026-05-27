import { PrismaClient } from "@prisma/client";

const p = new PrismaClient();
const media = JSON.parse((await p.singleton.findUnique({ where: { key: "media" } }))?.data ?? "[]");
const found = media.find((m) => m.id === "home-hero-backdrop");
console.log("home-hero-backdrop asset:", found);
await p.$disconnect();
