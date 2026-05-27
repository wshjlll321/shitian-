import { PrismaClient } from "@prisma/client";

// Demo: change home hero backgroundMediaId to an existing image asset.
// Usage: npx tsx scripts/swap-hero-bg.mjs <mediaId>
const p = new PrismaClient();
const target = process.argv[2] || "product-t280-hero";

const row = await p.singleton.findUnique({ where: { key: "home" } });
if (!row) {
  console.error("home singleton missing");
  process.exit(1);
}
const home = JSON.parse(row.data);
home.hero.backgroundMediaId = target;
await p.singleton.update({
  where: { key: "home" },
  data: { data: JSON.stringify(home) }
});
console.log(`home.hero.backgroundMediaId → ${target}`);
await p.$disconnect();
