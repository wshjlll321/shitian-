import type { MetadataRoute } from "next";

import { getCaseStudies, getNewsArticles, getProducts, getScenarios } from "@/lib/cms";

const BASE_URL = "https://www.shitianuav.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const [products, scenarios, caseStudies, newsArticles] = await Promise.all([
    getProducts(),
    getScenarios(),
    getCaseStudies(),
    getNewsArticles()
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/products",
    "/scenarios",
    "/technology",
    "/cases",
    "/news",
    "/about",
    "/contact"
  ].map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/products/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8
  }));

  const scenarioRoutes: MetadataRoute.Sitemap = scenarios.map((s) => ({
    url: `${BASE_URL}/scenarios/${s.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6
  }));

  const caseRoutes: MetadataRoute.Sitemap = caseStudies.map((c) => ({
    url: `${BASE_URL}/cases/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsArticles.map((n) => ({
    url: `${BASE_URL}/news/${n.slug}`,
    lastModified: n.publishedAt ? new Date(n.publishedAt) : now,
    changeFrequency: "monthly",
    priority: 0.4
  }));

  return [...staticRoutes, ...productRoutes, ...scenarioRoutes, ...caseRoutes, ...newsRoutes];
}
