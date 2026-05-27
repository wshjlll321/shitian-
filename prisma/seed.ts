/**
 * One-time content import — copies everything currently in src/content/*.ts
 * into the SQLite database so the site keeps exactly the content it has now,
 * only DB-backed and editable through the admin.
 *
 * Safe to re-run: every write is an upsert keyed by (type, slug) or key.
 */
import { PrismaClient } from "@prisma/client";

import { companyProfile } from "../src/content/about";
import { caseStudies } from "../src/content/cases";
import { contactInfo } from "../src/content/contact";
import { homeContent } from "../src/content/home";
import { mediaAssets } from "../src/content/media";
import { footerNavigation, primaryNavigation } from "../src/content/navigation";
import { newsArticles } from "../src/content/news";
import { products } from "../src/content/products";
import { scenarios } from "../src/content/scenarios";
import { seoEntries } from "../src/content/seo";
import { siteProfile } from "../src/content/site";
import { technologyPillars } from "../src/content/technology";

const prisma = new PrismaClient();

type AnyRecord = Record<string, unknown>;

async function seedCollection(type: string, items: AnyRecord[], slugKey: string) {
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const slug = String(item[slugKey]);
    const payload = {
      status: typeof item.status === "string" ? item.status : "published",
      priority: typeof item.priority === "string" ? item.priority : "P1",
      sortOrder: i,
      data: JSON.stringify(item)
    };
    await prisma.contentRecord.upsert({
      where: { type_slug: { type, slug } },
      create: { type, slug, ...payload },
      update: payload
    });
  }
  console.log(`  ${type.padEnd(12)} ${items.length} 条`);
}

async function seedSingleton(key: string, data: unknown) {
  const json = JSON.stringify(data);
  await prisma.singleton.upsert({
    where: { key },
    create: { key, data: json },
    update: { data: json }
  });
  console.log(`  singleton     ${key}`);
}

async function main() {
  console.log("导入现有内容到数据库 …");

  await seedCollection("product", products as unknown as AnyRecord[], "slug");
  await seedCollection("scenario", scenarios as unknown as AnyRecord[], "slug");
  await seedCollection("case", caseStudies as unknown as AnyRecord[], "slug");
  await seedCollection("news", newsArticles as unknown as AnyRecord[], "slug");
  await seedCollection("technology", technologyPillars as unknown as AnyRecord[], "id");

  await seedSingleton("company", companyProfile);
  await seedSingleton("contact", contactInfo);
  await seedSingleton("home", homeContent);
  await seedSingleton("site", siteProfile);
  await seedSingleton("nav", { primary: primaryNavigation, footer: footerNavigation });
  await seedSingleton("seo", seoEntries);
  await seedSingleton("media", mediaAssets);

  console.log("完成。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
